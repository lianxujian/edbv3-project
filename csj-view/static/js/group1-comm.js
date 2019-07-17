

/**
*页面加载后，设置样式
**/
$(document).ready(function(){
	resizeEasyuiDom();
	resetWinPageButs();
	initStyle();
});
/**
*页面改变大小后，设置样式
**/
$(window).resize(function() {
	//easyui 重新渲染
	resizeEasyuiDom();
	resetWinPageButs();

});

/**
* 重新设置easyui的DOM
**/
function resizeEasyuiDom(){
	var $textboxs=$(".textbox");
	for(var i=0;i<$textboxs.length;i++){
		var $textbox=$($textboxs[i]);
		$textbox.css("width",$textbox.parent().width());
		var $text=$textbox.find(".textbox-text");
		$text.css("width",$text.parent().width()-18);
	}
}
/**
*重新设置弹出窗口的按钮
**/
function resetWinPageButs(){
	var $butsrow=$(".page-form .buts-row-bottom");
	var top=$(window).height()-45;
	$butsrow.css("top",top);

}
/**
*初始化样式
**/
function initStyle(){
	var $ftitles=$("form .form-title");
	for(var i=0;i<$ftitles.length;i++){
		$ftitle=$($ftitles[i]);
		if($ftitle.find("a.icon-only").length<=0){
			var txt=$ftitle.html();
			var but_html="<a class='icon-only float-right  btn-min' onclick='showHideFormPart(this)' href='javascript:void(0);'><i class='fa fa-minus'></i></a>";
			$ftitle.html(txt+but_html);
		}
	}


	var $sfmbuts =$(".search-form .form-buttons .fa-minus");
	if($sfmbuts.length<=0){
		$(".search-form .form-buttons .clearfix").remove();
		$(".search-form .form-buttons").append("<a class='btn btn-default btn-xs shiny icon-only blue btn-min' href='javascript:hidshowSearchForm();'><i class='fa fa-minus'></i></a> <div class='clearfix'></div>");
	}


}

/**##################################################################################################**/


/*Show Notification*/
function Notify(message, position, timeout, theme, icon, closable) {
    toastr.options.positionClass = 'toast-' + position;
    toastr.options.extendedTimeOut = 0; //1000;
    toastr.options.timeOut = timeout;
    toastr.options.closeButton = closable;
    toastr.options.iconClass = icon + ' toast-' + theme;
    toastr['custom'](message);
}


/**
*创建cookies
*/
function createCookie(n, t, i) {
    var r, u;
    i ? (r = new Date, r.setTime(r.getTime() + i * 864e5), u = "; expires=" + r.toGMTString()) : u = "";
    document.cookie = n + "=" + t + u + "; path=/"
}
/**
*读取cookies
**/
function readCookie(n) {
    for (var t, r = n + "=",
    u = document.cookie.split(";"), i = 0; i < u.length; i++) {
        for (t = u[i]; t.charAt(0) == " ";) t = t.substring(1, t.length);
        if (t.indexOf(r) == 0) return t.substring(r.length, t.length)
    }
    return null
}
function eraseCookie(n) {
    createCookie(n, "", -1)
}
/**
*获得浏览器版本
**/
function getInternetExplorerVersion() {
    var n = -1,
    t, i;
    return navigator.appName == "Microsoft Internet Explorer" && (t = navigator.userAgent, i = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})"), i.exec(t) != null && (n = parseFloat(RegExp.$1))),
    n
}

/**##################################################################################################**/


/**
* 主框架TAB操作类
*
**/
var MainTab={
	/**
	*创建TAB
	*id：TAB的标识
	*label：TAB显示名称
	*url：TAB触发的URL
	**/
	createTab:function(id,label,url){
		if($("#framework_body").length<=0){
			window.parent.MainTab.createTab(id,label,url);
		}else{
			var $el_lis=$("#main-tabs ul li");
			var TABNUM=10;
			if($el_lis.length<TABNUM){
				var li_id="li_"+id;
				var ifm_id="ifm_"+id;

				if($("#"+li_id).length<=0){
					var tabTemplate = "<li id=\""+li_id+"\"><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close float-left'></span></li>";
					var li = $( tabTemplate.replace( /#\{href\}/g, "#" + ifm_id ).replace( /#\{label\}/g, label ) );
					$('#main-tabs').find( ".ui-tabs-nav" ).append( li );

					var ifm_html="<div class=\"tab-iframe-div\" id=\""+ifm_id+"\"  >"+
									"<iframe name=\""+ifm_id+"\" class=\"tab-iframe\" src=\""+url+"\" width=\"100%\"  frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"yes\" allowtransparency=\"yes\" ></iframe>"+
								 "</div>";

					//"<div id='"+id+"'><p>"+tabContentHtml+"</p></div>";
					$('#main-tabs').append(ifm_html);
					$('#main-tabs').tabs( "refresh" );
					refreshMainIframe();
				}
				var $lis=$("#main-tabs ul li");
				var index=0;
				for(var i=0;i<$lis.length;i++){
					var $li=$($lis[i]);
					if($li.attr("id")==li_id){
						index=i;
						break;
					}
				}
				if(id=='home'){
					$("#"+li_id).find(".ui-tabs-anchor").text(label);
					$("#"+ifm_id+" .tab-iframe").attr("src",url);
				}
				$('#main-tabs').tabs( "option", "active", index);
				$("#"+ifm_id+" .tab-iframe").attr('src', url);

			}else{
				Notify('最多打开'+TABNUM+'个标签页!', 'top-right', '5000', 'warning', 'fa-warning', true);
			}
		}
		bindTabContextmenu();
	}
	,
	/**
	*关闭当前的TAB
	**/
	closeTab:function(){
		if($("#framework_body").length<=0){
			window.parent.MainTab.closeTab();
		}else{
			var $lis=$("#main-tabs li");
			var $thisli;
			var index=0;
			var length=$lis.length;
			for(var i=0;i<$lis.length;i++){
				var $li=$($lis[i]);
				if($li.attr("aria-selected")=="true"){
					$thisli=$li;
					index=i;
					break;
				}
			}
			var panelId=$thisli.remove().attr( "aria-controls" );
			$( "#" + panelId ).remove();
			$('#main-tabs').tabs( "refresh" );

		}
	}
	,
	/**
	*关闭当前TAB，并跳转到另一个TAB
	*gotoLabel 将要跳转的TAB名称
	**/
  closeTabAndGoto:function(matchId,gotoLabel){
    if($("#framework_body").length<=0){
      window.parent.MainTab.closeTabAndGoto(matchId,gotoLabel);
    }else{
      var $lis=$("#main-tabs li");
      var $thisli;
      var index=0;
      var length=$lis.length;
      for(var i=0;i<$lis.length;i++){
        var $li=$($lis[i]);
        if($li.attr("aria-selected")=="true"){
          $thisli=$li;
          index=i;
          break;
        }
      }
      var panelId=$thisli.attr( "aria-controls" );
      $thisli.remove();
      $( "#" + panelId ).remove();

      $('#main-tabs').tabs( "refresh" );


      //重新选中
      var $lis=$("#main-tabs li");
      var $thisli;
      var index=0;
      var length=$lis.length;
      for(var i=0;i<$lis.length;i++){
        var $li=$($lis[i]);
        if($li.find("a").text()==gotoLabel && $li.attr("id").split("_")[1] == matchId){
          $thisli=$li;
          index=i;
          break;
        }
      }
      $('#main-tabs').tabs( "option", "active", index);
    }
  }

  ,
  /**
   *关闭当前TAB，并跳转到新TAB进行刷新
   *refreshLabel 将要跳转并刷新的TAB
   **/
  closeTabAndRefresh:function(matchId,refreshLabel){
    if($("#framework_body").length<=0){
      window.parent.MainTab.closeTabAndRefresh(matchId,refreshLabel);
    }else{
      var $lis=$("#main-tabs li");
      var $thisli;
      var index=0;
      var length=$lis.length;
      for(var i=0;i<$lis.length;i++){
        var $li=$($lis[i]);
        if($li.attr("aria-selected")=="true"){
          $thisli=$li;
          index=i;
          break;
        }
      }

      var panelId=$thisli.attr( "aria-controls" );
      $thisli.remove();
      $( "#" + panelId ).remove();

      $('#main-tabs').tabs( "refresh" );


      //重新选中
      var $lis=$("#main-tabs li");
      var $thisli;
      var index=0;
      var length=$lis.length;
      for(var i=0;i<$lis.length;i++){
        var $li=$($lis[i]);
        if($li.find("a").text()==refreshLabel && $li.attr("id").split("_")[1] == matchId){
          $thisli=$li;
          index=i;
          break;
        }
      }
      $('#main-tabs').tabs( "option", "active", index);

      var id=$thisli.attr("id").split("_")[1];
      var ifm_id="ifm_"+id;
      var $iframe=$("#"+ifm_id).find("iframe");
      var src=$iframe.attr("src");
      $iframe.prop("src",'');
      setTimeout(function(){
        $iframe.prop("src",src);
        //$iframe.reload();
      })
      /*src = timestamp(src);
      $iframe.prop("src",src);
      $iframe.reload();
      //解决浏览器缓存  
      function timestamp(url){
          //  var getTimestamp=Math.random();  
          var getTimestamp=new Date().getTime();
          if(url.indexOf('?')>-1){
              url=url+"&timestamp="+getTimestamp;
          }else{
              url=url+"?timestamp="+getTimestamp;
          }
          return url;
      }*/
    }
  }

  ,
	/**
	*只刷指定的TAB
	*refreshLabel 将要刷新的TAB
	**/
	refreshTab:function(refreshLabel){
		if($("#framework_body").length<=0){
			window.parent.MainTab.refreshTab(refreshLabel);
		}else{
			var $lis=$("#main-tabs li");
			var $thisli;
			var index=0;
			var length=$lis.length;
			for(var i=0;i<$lis.length;i++){
				var $li=$($lis[i]);
				if($li.find("a").text()==refreshLabel){
					$thisli=$li;
					index=i;
					break;
				}
			}
			var id=$thisli.attr("id").split("_")[1];
			var ifm_id="ifm_"+id;
			var $iframe=$("#"+ifm_id).find("iframe");
			try{
				 eval($iframe.attr("name")+'.dataGridRefresh()');
			}catch(e){
				var src=$iframe.attr("src");
				$iframe.attr("src","");
				$iframe.attr("src",src);
			}

		}
	}


}



/**
*刷新主框架TAB
**/
function refreshMainIframe(){
	var height=$(window).height()-102;
	$(".tab-iframe-div").css({"height":height,"padding":"0px","margin":"0px"});
	$(".tab-iframe").css({"height":height});
	$("#main-tabs").on( "click",'span.ui-icon-close', function() {
		var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
    if(panelId == 'ifm_2E16698022F94E8F8A2308CF529E9F1E'){
      //清除商品管理列表页查询条件

    }
		$( "#" + panelId ).remove();
		$('#main-tabs').tabs( "refresh" );
	});
}

/**##################################################################################################**/


/**
*打开弹出窗口
*title 窗口名称
*url 窗口的链接
*width 窗口宽度
*height 窗口的高度
*modal 模态类型 true 模态窗口 false 非模态窗口
**/
function openWindow(title,url,width,height,modal){
	var $win=$("#"+title);
	if($win.length==0){

	}else{
		 $win.remove();
	}
	var ifm_html="<iframe id=\"ifm_"+title+"\" class=\"tab-iframe\" src=\""+url+"\"  width=\"100%\" height=\""+(height-40)+"\" frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"auto\" allowtransparency=\"yes\"></iframe>";
	$("body").append("<div id="+title+" class='easyui-window'>"+ifm_html+"</div>");
	$("#"+title).window({
		modal:modal,
		closed:true,
		maximizable:false,
		width:width,
		height:height,
		title:title,
		resizable:false,
		minimizable:false,
		collapsible:false,
		iconCls:'fa fa-th-large padding-top-4'
	});

	$("#"+title).window("open");
}
/**
*关闭弹出窗口
*title 窗口名称
**/
function closeWindow(title){
	var $win=$("#"+title);
	if($win.length<1){
		window.parent.closeWindow(title);
	}else{
		//
		$(".easyui-datagrid").each(function(index){
			var $this=$(this);
			$this.datagrid('reload');
		});
		$("#"+title).window("close");
	}
}
/**
*关闭窗口并刷新TAB
*title 将要刷新的TAB名称
**/
function closeWindowRefrresh(title){
	var $win=$("#"+title);
	if($win.length<1){
		window.parent.closeWindowRefrresh(title);
	}else{
		location.reload();
		$("#"+title).window("close");
	}
}


/**##################################################################################################**/


/**
*按照百分比获得宽度
*num 百分比 例如 0.1 0.9
**/
function width(num) {
    return (($(window).width()) * num);
}

/**##################################################################################################**/

/**
* 设置查询表单
**/
function settingSearchForm(){
	var $groups=$("#search_form").find(".form-group");
	for(var i=0;i<$groups.length;i++){
		var $group=$($groups[i]);
		if($group.hasClass("hidden")){
			$group.removeClass("hidden");
			$group.prepend("<input class='settting-checkbox' type='checkbox'  ></input>");
		}else{
			$group.prepend("<input class='settting-checkbox' type='checkbox' checked='checked' ></input>");
		}
	}
	$("#search_form").find(".form-buttons").css("display","none");

	var html=	"<div class=\"setting-buttons text-align-center margin-bottom-5 \">"+
                	"<a href=\"javascript:saveSearchSetting();\" class=\"btn btn-success\">保存配置</a>"+
                   	"<a href=\"javascript:cancelSearchSetting();\" class=\"btn btn-danger\">取消配置</a>"+
                "</div>"+
                "<div class=\"clearfix\" ></div>";
	$("#search_form").append(html);

}
/**
*保存查询表单
**/
function saveSearchSetting(){
	var $groups=$("#search_form").find(".form-group");
	for(var i=0;i<$groups.length;i++){
		var $group=$($groups[i]);
		if($group.find(".settting-checkbox").prop("checked")){//checked

		}else{
			$group.addClass("hidden");
		}
		$group.find(".settting-checkbox").remove();
	}
	$("#search_form").find(".form-buttons").css("display","");
	$("#search_form").find(".setting-buttons").remove();
	$("#data_table").datagrid("reload");
}
/**
*取消查询表单设置
**/
function cancelSearchSetting(){
	saveSearchSetting();
}

/**
*显示隐藏查询表单
**/
function hidshowSearchForm(){
	if($("#search_form").hasClass("hidden")){
		$("#search_form").removeClass("hidden");
		$("#datagrid_toolbar .buttons-preview").removeClass("hidden");
		$("#datagrid_toolbar").find(".search-header").remove();

	}else{
		$("#search_form").addClass("hidden");
		$("#datagrid_toolbar .buttons-preview").addClass("hidden");
		var label="查询条件";
		var html=  "<div class=\"search-header widget-header  \">"+
						"<i class=\"widget-icon fa   fa-search-minus \"></i>"+
						"<span class=\"widget-caption\">"+label+"</span>"+
						"<div class=\"widget-buttons\">"+
							"<a href=\"javascript:hidshowSearchForm()\" ><i class=\"fa fa-plus\"></i></a>"+
						"</div>"+
					"</div>";

		$("#datagrid_toolbar").prepend(html);
	}
	$("#data_table").datagrid("reload");
}



/**
* 配置数据表格
**/
function settingDatagrid(){
	var html="";
	var $tds=$(".datagrid-header-row td");
	for(var i=0;i<$tds.length;i++){
		var $td=$($tds[i]);
		var field=$td.attr("field");
		var name=$td.text();
		var display=$td.css("display");

		if(name!=''){
			html+="<div class='cloumn' field='"+field+"'  >";
			if(display=='none'){
				html+="<input class='datagrid-setting-checkbox' type='checkbox'  ></input>"+name;
			}else{
				html+="<input class='datagrid-setting-checkbox' type='checkbox'  checked='checked' ></input>"+name;
			}
			html+= "</div>";
		}

	}


	bootbox.dialog({
		message: html,
		title: "配置数据表格",
		className: "",
		buttons: {
			success: {
				label: "保存配置",
				className: "btn-success",
				callback: function () {
					var $cloums=$(".bootbox .bootbox-body").find(".cloumn");
					for(var i=0;i<$cloums.length;i++){
						var $cloum=$($cloums[i]);
						if($cloum.find(".datagrid-setting-checkbox").prop("checked")){//checked
							$("#data_table").datagrid('showColumn', $cloum.attr("field"));
						}else{
							$("#data_table").datagrid('hideColumn', $cloum.attr("field"));
						}

					}
				}
			},
			"取消配置": {
				className: "btn-danger",
				callback: function () { }
			}
		}
	});

}


/**##################################################################################################**/


/**
*重设FORM表单
**/
function resetForm(formid){
	$("#"+formid)[0].reset();
}
/**
*显示隐藏from区域
**/
function showHideFormPart(obj){
	var $this=$(obj);
	var $i=$this.find("i");
	var $rows=$this.parent().next(".row");

	if($i.hasClass("fa-minus")){//进行隐藏
		$i.removeClass("fa-minus");
		$i.addClass("fa-plus");
		hideRows($rows);
	}else{
		$i.removeClass("fa-plus");
		$i.addClass("fa-minus");
		showRows($rows);
	}
}
/**
*隐藏form行
**/
function hideRows(obj){
	obj.addClass("hidden");
	if(!obj.next().hasClass("form-title")&&!obj.next().hasClass("buts-row-bottom")){
		hideRows(obj.next());
	}
}
/**
*显示from行
**/
function showRows(obj){
	obj.removeClass("hidden");
	if(!obj.next().hasClass("form-title")&&!obj.next().hasClass("buts-row-bottom")){
		showRows(obj.next());
	}
}
/**
*展示遮罩层
**/
function showPageShade(){
	if($(".page-shade").length<=0){
		$("body").append("<div class='page-shade'><span>正在处理...</span></div>");
		var ptop=$(window).height()/2;
		var pleft=($(window).width()-100)/2;
		$(".page-shade").css({height:$(window).height(),width:$(window).width(),'padding-top':ptop,'padding-left':pleft});
	}
}

/**
*隐藏遮罩层
**/
function hiddenPageShade(){
	$(".page-shade").remove();
}
/**
*绑定TAB右键菜单事件
**/
function bindTabContextmenu(){
	$("#main-tabs li").bind('contextmenu',function(e){
		/* 选中当前触发事件的选项卡 */
		var id=$(this).attr("id");
		var $lis=$("#main-tabs ul li");
		var index=0;
		for(var i=0;i<$lis.length;i++){
			var $li=$($lis[i]);
			if($li.attr("id")==id){
				index=i;
				break;
			}
		}
		$('#main-tabs').tabs( "option", "active", index);

		$("#tab_rightmenu").css({
			left: e.pageX,
			top: e.pageY
		});
		$("#tab_rightmenu").removeClass("hidden");
		return false;
	});
}

function setCookie(c_name,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function getCookie(c_name){
	if (document.cookie.length>0){
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1){
		c_start=c_start + c_name.length+1;
		c_end=document.cookie.indexOf(";",c_start);
		if (c_end==-1) c_end=document.cookie.length;
		return unescape(document.cookie.substring(c_start,c_end))
	  }
	}
	return "";
}

