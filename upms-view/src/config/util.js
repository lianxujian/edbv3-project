/**
 * Created by Administrator on 2017/6/2.
 */
export default{
    formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
  },
    formatDate2(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    return y +''+ m;
  },
     addmulMonth(dtstr, n)
  {
    var s = dtstr.split("-");
    var yy = parseInt(s[0]);
    var mm = parseInt(s[1])-1 ;
    var dd = parseInt(s[2]);
    var dt = new Date(yy, mm, dd);
    dt.setMonth(dt.getMonth() + n);
    var month = parseInt(dt.getMonth()) + 1;
    return dt.getFullYear() + "-" + month  + "-" + dd;
  },
  //格式化0-9
  turnSingle(num){
    return num<10?'0'+num:num;
  },
  //时间戳转成年月日 时分秒
  turnTimestamp(time){
    var x=new Date(time).toLocaleDateString().replace(/\//g,'-');
    var h=this.turnSingle(new Date(time).getHours());
    var m=this.turnSingle(new Date(time).getMinutes());
    var s=this.turnSingle(new Date(time).getSeconds());
    return x+' '+h+':'+m+':'+s;
  },
  //时间戳转成年月日 时分秒
  turnTimestamp2(time){
    var y=this.turnSingle(new Date(time).getFullYear());
    var o=this.turnSingle(new Date(time).getMonth()+1);
    var d=this.turnSingle(new Date(time).getDate());
    var h=this.turnSingle(new Date(time).getHours());
    var m=this.turnSingle(new Date(time).getMinutes());
    var s=this.turnSingle(new Date(time).getSeconds());
    return y+'-'+o+'-'+d+' '+h+':'+m+':'+s;
  },
  //补零的方法
  returnFloat(x) {
    var f = parseFloat(x);
    f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  },
  rechargeValidator(callback){
    $.ajax({
        url:process.env.API_HOST+'api/account/checkAccount',
        type:'get',
        success:function(data){
            callback(data)
        }
    })
  },
  richTextEditor(){
    //富文本编辑器

    //富文本编辑器颜色选择器插件
    var ColorHex=new Array('00','33','66','99','CC','FF');
    var SpColorHex=new Array('FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF');
    $.fn.colorpicker = function(options) {
        var opts = jQuery.extend({}, jQuery.fn.colorpicker.defaults, options);
        initColor();
        return this.each(function(){
            var obj = $(this);
            obj.bind(opts.event,function(){
                //定位
                var ttop  = $(this).offset().top;     //控件的定位点高
                var thei  = $(this).height();  //控件本身的高
                var tleft = $(this).offset().left;    //控件的定位点宽
                $("#colorpanel").css({
                    top:ttop+thei+5,
                    left:tleft
                }).show();
                var target = opts.target ? $(opts.target) : obj;
                if(target.data("color") == null){
                    target.data("color",target.css("color"));
                }
                if(target.data("value") == null){
                    target.data("value",target.val());
                }

                $("#_creset").bind("click",function(){
                    target.css("color", target.data("color")).val(target.data("value"));
                    $("#colorpanel").hide();
                    opts.reset(obj);
                });

                $("#CT tr td button").unbind("click").mouseover(function(){
                    var color=$(this).css("background-color");
                    $("#DisColor").css("background",color);
                    $("#HexColor").val($(this).attr("rel"));
                }).click(function(){
                    var color=$(this).attr("rel");
                    color = opts.ishex ? color : getRGBColor(color);
                    if(opts.fillcolor) target.val(color);
                    target.css("color",color);
                    $("#colorpanel").hide();
                    $("#_creset").unbind("click");
                    opts.success(obj,color);
                });

            });
        });

        function initColor(){
            $("body").append('<div id="colorpanel" style="position: absolute; display: none;"></div>');
            var colorTable = '';
            var colorValue = '';
            for(var i=0;i<2;i++){
                for(var j=0;j<6;j++){
                    colorTable=colorTable+'<tr height=12>'
                    colorTable=colorTable+'<td width=11><button rel="#000000" style="width:11px;height:12px;display:block;border:none;background-color:#000000">'
                    colorValue = i==0 ? ColorHex[j]+ColorHex[j]+ColorHex[j] : SpColorHex[j];
                    colorTable=colorTable+'<td width=11><button rel="#'+colorValue+'" style="width:11px;height:12px;display:block;border:none;background-color:#'+colorValue+'">'
                    colorTable=colorTable+'<td width=11><button rel="#000000" style="width:11px;height:12px;display:block;border:none;background-color:#000000">'
                    for (var k=0;k<3;k++){
                        for (var l=0;l<6;l++){
                            colorValue = ColorHex[k+i*3]+ColorHex[l]+ColorHex[j];
                            colorTable=colorTable+'<td width=11><button rel="#'+colorValue+'" style="width:11px;height:12px;display:block;border:none;background-color:#'+colorValue+'">'
                        }
                    }
                }
            }
            colorTable='<table width=253 border="0" cellspacing="0" cellpadding="0" style="border:1px solid #000;">'
                +'<tr height=30><td colspan=21 bgcolor=#cccccc>'
                +'<table cellpadding="0" cellspacing="1" border="0" style="border-collapse: collapse">'
                +'<tr><td width="3"><td><input type="text" id="DisColor" size="6" disabled style="border:solid 1px #000000;background-color:#ffff00"></td>'
                +'<td width="3"><td><input type="text" id="HexColor" size="7" style="border:inset 1px;font-family:Arial;" value="#000000"><a href="javascript:void(0);" id="_cclose">关闭</a> | <a href="javascript:void(0);" id="_creset">清除</a></td></tr></table></td></table>'
                +'<table id="CT" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse" bordercolor="000000"  style="cursor:pointer;">'
                +colorTable+'</table>';
            $("#colorpanel").html(colorTable);
            $("#_cclose").click(function(){
                $("#colorpanel").hide();
                return false;
            }).css({
                "font-size":"12px",
                "padding-left":"20px"
            });
        }

        function getRGBColor(color) {
            var result;
            if ( color && color.constructor == Array && color.length == 3 )
                color = color;
            if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
                color = [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
            if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
                color =[parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];
            if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
                color =[parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];
            if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
                color =[parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];
            return "rgb("+color[0]+","+color[1]+","+color[2]+")";
        }
    };
    jQuery.fn.colorpicker.defaults = {
        ishex : true, //是否使用16进制颜色值
        fillcolor:false,  //是否将颜色值填充至对象的val中
        target: null, //目标对象
        event: 'click', //颜色框显示的事件
        success:function(){}, //回调函数
        reset:function(){}
    };
    //富文本编辑器

    //插入图片
    function setImage(fileData){
        document.querySelector('#'+this.id).parentNode.parentNode.parentNode.querySelector('.editor').focus();
        //$('#'+$(this)[0].id).parents('.text-head').next().focus();
        document.execCommand('insertImage',false,fileData[0].resourceUrl);
    }
    //渲染页面
    function renderEditor(opt){
        var str='<div class="text-head">'
          +'<button class="bold"></button>'
          +'<button class="italic"></button>'
          +'<button class="underline"></button>'
          +'<button class="linethrough"></button>'
          +'<button class="del"></button>'
          +'<div class="style-box">'
            +'<select name="" class="fontStyle">'
              +'<option value="">字体</option>'
              +'<option value="黑体">黑体</option>'
              +'<option value="隶书">隶书</option>'
              +'<option value="楷体">楷体</option>'
              +'<option value="微软雅黑">微软雅黑</option>'
              +'<option value="Georgia">Georgia</option>'
              +'<option value="Times New Roman">Times New Roman</option>'
              +'<option value="Impact">Impact</option>'
              +'<option value="Courier New">Courier New</option>'
              +'<option value="Arial">Arial</option>'
              +'<option value="Verdana">Verdana</option>'
              +'<option value="Tahoma">Tahoma</option>'
            +'</select>'
          +'</div>'
          +'<div class="font-box">'
            +'<select name="" class="fontSize">'
              +'<option value="">大小</option>'
              +'<option value="1">1</option>'
              +'<option value="2">2</option>'
              +'<option value="3">3</option>'
              +'<option value="4">4</option>'
              +'<option value="5">5</option>'
              +'<option value="6">6</option>'
              +'<option value="7">7</option>'
            +'</select>'
          +'</div>'
          +'<button class="fontColor"></button>'
          +'<button class="backColor"></button>'
          +'<button class="indent"></button>'
          +'<button class="outdent"></button>'
          +'<button class="inLeft"></button>'
          +'<button class="inCenter"></button>'
          +'<button class="inRight"></button>'
                    +'<span class="btn btn-default purple fileinput-button insertImage" ><i class="fa fa-upload"></i><span>页面直传</span><input id="file'+opt.orderNum+'" type="file"  name="filedata" multiple></input></span><script type="text/javascript" >$(document).ready(function(){ $("#file'+opt.orderNum+'").jupload({id:"file'+opt.orderNum+'",jupload_server:"http://file.'+process.env.IMG_UPLOAD+'.com/files-web",but_name:"页面直传",file_size:102400, types:"*",pattern:"direct",file_size:512000,limit:10,upload_complete_fun:'+setImage+',params:{"batch":"","project":"test","table":"test","objectId":"11AA","group":"11","priority":"0","cover":false} });});</script>'
                    +'<label class="pro"></label>'
            +'</div>';
        opt.el.prepend($(str));

    }
    //渲染页面
    $('.text-box').each(function(i,val){
        renderEditor({
            el:$('.text-box').eq(i),
            orderNum:i
        })
    })

    //js操作
    setTimeout(function(){
        richEditor();
    })
    function richEditor(){
        //view
        $('button').click(function(e){
            stopDefault( e )
        })
        //删除
        $('.del').click(function(e){
            $(this).parent().next().focus();
            document.execCommand("Delete",false,null);
        })
        //设置字体
        $('.fontStyle').change(function(){
            $(this).parent().parent().next().focus();
            document.execCommand("FontName",false,$(this).val())
        })
        //设置字体大小
        $('.fontSize').change(function(){
            //console.log($(this).val())
            $(this).parent().parent().next().focus();
            document.execCommand("FontSize",false,$(this).val())
        })
        //加粗
        $('.bold').click(function(){
            $(this).parent().next().focus();
            document.execCommand('bold');
        })
        //倾斜
        $('.italic').click(function(){
            $(this).parent().next().focus();
            document.execCommand('italic');
        })
        //下划线
        $('.underline').click(function(){
            $(this).parent().next().focus();
            document.execCommand('underline');
        })
        //中划线
        $('.linethrough').click(function(){
            $(this).parent().next().focus();
            document.execCommand("StrikeThrough",false,null);
        })
        //字体颜色
        $('.fontColor').each(function(i,val){
            var _this=$(this);
           // console.log($(this))
            $(this).colorpicker({
                fillcolor:true,
                target:'.editor p',
                success:function(o,color){
                    _this.parent().next().focus();
                    document.execCommand("ForeColor",false,color)
                }
            });
        })
        //背景颜色
        $('.backColor').each(function(i,val){
            var _this=$(this);
            $(this).colorpicker({
                fillcolor:true,
                target:'.editor p',
                success:function(o,color){
                    _this.parent().next().focus();
                    document.execCommand("BackColor",false,color)
                }
            });
        })
        //添加缩进
        $('.indent').click(function(){
            $(this).parent().next().focus();
            document.execCommand('indent');
        })
        //左对齐
        $('.outdent').click(function(){
            $(this).parent().next().focus();
            document.execCommand('outdent');
        })
        //左对齐
        $('.inLeft').click(function(){
            $(this).parent().next().focus();
            document.execCommand('justifyLeft');
        })
        //居中
        $('.inCenter').click(function(){
            $(this).parent().next().focus();
            document.execCommand('justifyCenter');
        })
        //左对齐
        $('.inRight').click(function(){
            $(this).parent().next().focus();
            document.execCommand('justifyRight');
        })
    }


    //阻止浏览器的默认行为
    function stopDefault( e ) {
        //阻止默认浏览器动作(W3C)
        if ( e && e.preventDefault )
            e.preventDefault();
        //IE中阻止函数器默认动作的方式
        else
            window.event.returnValue = false;
        return false;
    }

  }
}
