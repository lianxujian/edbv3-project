<!--登录成功 贾南风-->
<template>
  <div class="page-header-fixed page-sidebar-closed-hide-logo page-content-white background-body" id="layout">
    <!-- 头部开始 -->
    <!-- BEGIN HEADER头部 -->
    <div class="page-header navbar navbar-fixed-top">
      <!-- BEGIN HEADER INNER -->
      <div class="page-header-inner ">
        <!-- BEGIN LOGO -->
        <div class="page-logo">
          <a style="margin: 5px 0 5px 20px;"><img src="../assets/css/static/css/img/logo.png" style="color:#C5C9CE" /> </a>

        </div>
       <!-- <div class="page-logo">
          <a>LOGO</a>

        </div>-->
        <!-- END LOGO -->
        <!-- 横向导航栏Begin -->
        <div class="hor-menu   hidden-sm hidden-xs">
          <ul class="nav navbar-nav">
            <!-- <li class="classic-menu-dropdown">
              <a href="javascript:;" data-hover="megamenu-dropdown" data-close-others="true" class="hover-initialized">
              </a>
              <ul class="dropdown-menu pull-left EntList TopEntList"></ul>
            </li> -->
          </ul>
        </div>
        <!--<div class="hor-menu   hidden-sm hidden-xs">
          <ul class="nav navbar-nav">
            <li class="classic-menu-dropdown">
              <a href="javascript:;" data-hover="megamenu-dropdown" data-close-others="true" class="hover-initialized">
                <span class="CurrEntName" entid="881684766236">admin的档口</span>
                <i class="fa fa-angle-down"></i>
              </a>
              <ul class="dropdown-menu pull-left EntList TopEntList"></ul>
            </li>
          </ul>
        </div>-->
        <!--横向导航栏End -->
        <!-- BEGIN RESPONSIVE MENU TOGGLER -->
        <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"> </a>
        <!-- END RESPONSIVE MENU TOGGLER -->
        <!-- BEGIN TOP NAVIGATION MENU 缩小时顶部导航栏-->
        <div class="top-menu">
          <ul class="nav navbar-nav pull-right">
            <!-- BEGIN USER LOGIN DROPDOWN -->
            <!-- DOC: Apply "dropdown-dark" class after below "dropdown-extended" to change the dropdown styte -->
            <li class="dropdown dropdown-user">
              <el-dropdown style="margin-right: 30px;">
              <span class="el-dropdown-link" style="font-weight: bold;color: #444E5F;">
                帮助中心<i class="el-icon-arrow-down" style="font-weight: bold;margin-left: 5px"></i>
              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>操作手册</el-dropdown-item>
                  <el-dropdown-item>操作视频</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!--<div @mouseenter="enter1"  style="display: inline-block;margin-right: 30px;cursor: pointer;font-size: 14px;font-weight: bold;color: #444E5F;height: 40px">帮助中心<i class="el-icon-arrow-down" style="font-weight: bold;margin-left: 5px"></i></div>--><!--@mouseleave="leave1"-->
              <div style="display: inline-block;margin-right: 30px;">{{userName}}</div>
              <el-dropdown style="margin-right: 30px;" @command="handleCommand">
              <span class="el-dropdown-link" style="font-weight: bold;color: #444E5F;">
               <img id="a" src="../assets/css/static/css/img/touxiang.png" style="width: 90%;cursor: pointer;" @mouseenter="isShowHide"/>
              </span>
                <el-dropdown-menu slot="dropdown" class="honeybee">
                  <el-dropdown-item command="personalCenter"   style="width:180px;"><i class="glyphicon glyphicon-user"></i>个人中心</el-dropdown-item>
                  <el-dropdown-item v-if="message2" command="fullScreen"><i class="el-icon-rank" style="font-size: 15px;margin-left: -3px"></i>全屏显示</el-dropdown-item>
                  <el-dropdown-item v-else command="CancelFullScreen"><i class="el-icon-rank" style="font-size: 15px;margin-left: -3px"></i>取消全屏</el-dropdown-item>
                  <el-dropdown-item command="logOut"><i class="glyphicon glyphicon-log-out"></i>退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!--<div style="display: inline-block;width: 46px;height: 46px;line-height: 43px;" @mouseenter="enter" >&lt;!&ndash;@click="personalCenter()"@mouseleave="leave"&ndash;&gt;
                <img id="a" src="../assets/css/static/css/img/touxiang.png" style="width: 90%;cursor: pointer;"/>
              </div>-->
              <div style="display: inline-block;margin:0  26px 0 15px"><img src="../assets/css/static/css/img/gengduoziliao.png" /></div>
              <!-- <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                 &lt;!&ndash;错误时加载默认图，默认图也错误则null，防止图片闪跳&ndash;&gt;
                 <img alt="" class="img-circle Top_Avatar HeadImg" src="../../static/jframe/images/1489393836000_global_head_default.png@_80w_80h_1c_1e.png" onerror="javascript: this.src = &#39;https://cdn-hbbsystem.hbbyun.com/hbb/image/1466473664000_mine_malehead_default.png&#39;;this.onerror=&#39;null&#39;">
                 <span class="username username-hide-on-mobile"><span class="UserCode">admin</span> </span>
                 <i class="fa fa-angle-down"></i>
               </a>-->
              <!--退出-->
              <ul class="dropdown-menu dropdown-menu-default">
                <li class="FullScreen">
                  <a onclick="objIndex.FullScreen()">
                    <i class="fa fa-arrows-alt"></i> 全屏显示
                  </a>
                </li>
                <li class="CancelFullScreen" style="display:none;">
                  <a onclick="objIndex.CancelFullScreen()">
                    <i class="fa fa-arrows-alt"></i> 取消全屏
                  </a>
                </li>
                <li class="divider"> </li>
                <li>
                  <a href="http://c.hbbyun.com/Login/LoginOut" ismenu="0">
                    <i class="icon-key"></i> 退出
                  </a>
                </li>
              </ul>
            </li>
            <!-- END USER LOGIN DROPDOWN -->
          </ul>
        </div>
        <!-- END TOP NAVIGATION MENU 缩小时顶部导航栏-->
      </div>
      <!-- END HEADER INNER -->
    </div>
    <!-- END HEADER -->
    <!-- BEGIN HEADER & CONTENT DIVIDER -->
    <div class="clearfix"> </div>
    <!-- END HEADER & CONTENT DIVIDER -->
    <!-- 头部结束End -->
    <!-- BEGIN CONTAINER -->
    <div class="page-container">
      <!-- 导航栏BEGIN SIDEBAR -->
      <div class="page-sidebar-wrapper">
        <!--电脑版导航栏BEGIN SIDEBAR -->
        <div class="page-sidebar navbar-collapse collapse" id="ul-box">
          <!-- BEGIN SIDEBAR MENU -->
          <ul id="side-menu" class="page-sidebar-menu  page-header-fixed page-sidebar-menu-hover-submenu" data-keep-expanded="true" data-auto-scroll="true" data-slide-speed="200" style="padding-top: 0">
            <li class="sidebar-toggler-wrapper hide">
              <!-- BEGIN SIDEBAR TOGGLER BUTTON -->
              <div class="sidebar-toggler"> </div>
              <!-- END SIDEBAR TOGGLER BUTTON -->
            </li>
            <li class="nav-item start" v-if="index==0"  v-for="(item,index) in menuData">
                <a  class="J_menuItem nav-item" data-index="0">
                  <!--<img :src="item.icon">-->
                  <i v-if="item.icon!=''" :src="item.icon"  :class="item.icon" style="color:#A9C2E0"></i>
                  <span class="title" style="color: #DAEBFF;font-weight: bold">{{item.privilegeName}}</span>
                </a>
            </li>

            <li class="nav-item start" v-if="index>0"  v-for="(item, index) in menuData">
              <a :url="`${url}${item.appServerName}/${item.programCode}`" class="nav-link nav-toggle" data-index="0">
                <!-- <img v-if="item.icon!=''" :src="item.icon" />-->
                <i v-if="item.icon!=''" :src="item.icon"  :class="item.icon" style="color:#A9C2E0"></i>
                <span class="title" style="color: #DAEBFF;">{{item.privilegeName}}</span>
                <span v-if="item.nodes.length>0" class="arrow"></span>
              </a>
              <ul v-if="item.nodes.length>0" class="sub-menu new-menu-area">
                <li v-for="(item2,index2) in item.nodes"  class="nav-item start" style="background: #536277"  secondnav="true" > <!--style="background: #536277"-->
                  <a v-if="item2.nodes.length==0" :url="`${url}${item2.appServerName}/${item2.programCode}`"  class="J_menuItem nav-item">
                    <!-- <i v-if="item2.icon!=''" :src="item2.icon"  :class="item2.icon"></i> -->
                    <span class="title">{{item2.privilegeName}}</span>
                    <span class="arrow"></span>
                  </a>
                  <a v-if="item2.nodes.length>0" :url="`${url}${item2.appServerName}/${item2.programCode}`"  class="nav-link nav-toggle">
                    <!--<img :src="item2.icon">-->
                    <!-- <i v-if="item2.icon!=''" :src="item2.icon"  :class="item2.icon"></i> -->
                    <span class="title">{{item2.privilegeName}}</span>
                    <span class="arrow"></span>
                  </a>
                  <ul v-if="item2.nodes.length>0" class="sub-menu new-menu-children-area">
                    <li v-for="(item3,index3) in item2.nodes" class="nav-item start">
                      <!--<i v-if="item3.icon!=''" :src="item3.icon"  class="fa fa-arrows"></i>-->
                      <a :url="`${url}${item3.appServerName}/${item3.programCode}`" class="J_menuItem nav-item" data-index="1">{{item3.privilegeName}}</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

          </ul>
          <!-- 电脑版导航栏END SIDEBAR MENU -->
        </div>
        <!-- END SIDEBAR -->
      </div>
      <!-- END SIDEBAR -->
      <!-- BEGIN CONTENT -->
      <div class="page-content-wrapper">
        <!-- BEGIN CONTENT BODY -->
        <div class="page-content" style="height:931px">

          <div id="page-wrapper" class="gray-bg dashbard-1">
            <div class="row content-tabs">
              <button class="roll-nav roll-left J_tabLeft">
                <i class="icon iconfont icon-zuoshuangjiantou"></i>
              </button>
              <nav class="page-tabs J_menuTabs" data-toggle="tooltip" title="" data-original-title="双击刷新页面">
                <div class="page-tabs-content" style="margin-left: 0;">
                  <a class="J_menuTab active" data-id="">首页<span></span></a>
                </div>
              </nav>
              <button class="roll-nav roll-right J_tabRight">
                <i class="icon iconfont icon-youshuangjiantou"></i>
              </button>
              <div class="btn-group roll-nav roll-right">
                <button class="dropdown J_tabClose" data-toggle="dropdown" aria-expanded="false">
                  关闭操作<span class="caret"></span>
                </button>
                <ul role="menu" class="dropdown-menu dropdown-menu-right">
                  <li class="J_tabShowActive">
                    <a>定位当前选项卡</a>
                  </li>
                  <li class="divider"></li>
                  <li class="J_tabCloseAll">
                    <a>关闭全部选项卡</a>
                  </li>
                  <li class="J_tabCloseOther">
                    <a>关闭其他选项卡</a>
                  </li>
                </ul>
              </div>

            </div>
            <div class="row J_mainContent" id="content-main" style="height: 100% !important;-webkit-overflow-scrolling: touch;background:#fff;">
              <iframe id="Index_iFrame" class="J_iframe" name="iframe0" width="100%" height="100%" style="overflow: hidden; z-index: 999999999 !important; height: 100% !important; display: inline;" frameborder="0" data-id="" seamless="" :src="`http://${imgUpload}/erp-bis-view/dist/#/indexBis?times=${times}`"></iframe><!--src="http://localhost:8888/#/authorityMange"-->
            </div>
          </div>
        </div>
        <!-- END CONTENT BODY -->
      </div>
      <!-- END CONTENT -->

    </div>
    <!--<ul id="center"  v-if="message3"  @mouseover="enter1" @mouseleave="leave1">
      &lt;!&ndash;<li><a :url="`http://localhost:8888/#/personalCenter`" class="J_menuItem nav-item" data-index="1"><i class="fa fa-home"></i>个人中心1</a></li>&ndash;&gt;
      <li><a  class="J_menuItem nav-item" data-index="1">操作手册</a></li>
      <li style="height: 1px;background: #eee"></li>
      <li  ><a>操作视频</a></li>
    </ul>-->
    <!--<ul id="b" v-if="message1" @mouseover="enter" @mouseleave="leave">
      <i  class="el-icon-arrow-up" id="c"></i>
      &lt;!&ndash;<li><a :url="`http://localhost:8888/#/personalCenter`" class="J_menuItem nav-item" data-index="1"><i class="fa fa-home"></i>个人中心1</a></li>&ndash;&gt;
      <li><a :url="`${url}/upms-view/dist/#/personalCenter`" class="J_menuItem nav-item" data-index="1"><i class="glyphicon glyphicon-user"></i>个人中心</a></li>
      <li style="margin: 8px 0;height: 1px;background: #eee"></li>
      <li v-if="message2" @click="fullScreen"><a><i class="el-icon-rank" style="font-size: 15px;margin-left: -3px"></i>全屏显示</a></li>
      <li v-else @click="CancelFullScreen"><a><i class="fa fa-arrows-alt"></i>取消全屏</a></li>
      <li style="margin: 8px 0;height: 1px;background: #eee"></li>
      <li @click="logOut()"><a><i class="glyphicon glyphicon-log-out"></i>退出</a></li>
    </ul>-->
    <!-- END CONTAINER -->
    <!-- BEGIN CORE PLUGINS -->
    <!-- 隐藏菜单跳转 -->
    <div style="display:none;">
      <div :url="`http://${imgUpload}/erp-oms-view/dist/#/orderSet`" class="J_menuItem nav-item" data-index="1" id="orderSet">订单设置</div>
      <div :url="`${url}/upms-view/dist/#/personalCenter`" class="J_menuItem nav-item" data-index="1" id="personalCenter">个人中心</div>
      <div :url="`http://${imgUpload}/erp-oms-view/dist/#/orderProcessing`" class="J_menuItem nav-item" data-index="1" id="hospitalityTrial">订单处理</div><!--待客审-->
      <div :url="`http://${imgUpload}/erp-oms-view/dist/#/orderProcessing`" class="J_menuItem nav-item" data-index="1" id="toWarehouse">订单处理</div><!--待仓审-->
      <div :url="`http://${imgUpload}/erp-oms-view/dist/#/exceptionOrder`" class="J_menuItem nav-item" data-index="1" id="ExceptionOrder">平台异常单</div><!--平台异常单-->
      <div :url="`http://${imgUpload}/erp-wms-view/dist/#/StockDiffBill`" class="J_menuItem nav-item" data-index="1" id="warehouseOrder">仓库异常单</div><!--仓库异常单-->
      <div :url="`http://${imgUpload}/erp-oms-view/dist/#/orderQuery`" class="J_menuItem nav-item" data-index="1" id="toSendGoods">订单查询</div><!--待发货-->
      <div :url="`http://${imgUpload}/erp-oms-view/dist/#/afterSaleDispose`" class="J_menuItem nav-item" data-index="1" id="toAfterSale">售后处理</div><!--待处理售后-->
      <div :url="`http://${imgUpload}/erp-oms-view/dist/#/taskCenter`" class="J_menuItem nav-item" data-index="1" id="taskCenter">任务中心</div><!--任务中心-->
    </div>
  </div>
</template>
<script type="application/javascript">
  var timer; // 定时器
  import '../assets/css/static/jframe/js/bootstrap.min.js'
  import '../assets/css/static/jframe/js/layout.min.js'
  import '../assets/css/static/jframe/js/contabs.js'
  export default {
    name: 'Layout2',
    data () {
      return {
        menuData: [], // 菜单数据接收
        version: '1.0.0', // 版本号
        url:process.env.API_URL, // 'test.edbv3.com‘
        imgUpload:process.env.FILE_API,
        // 个人中心 全屏显示  退出 的显示隐藏
        message1: false,
        message2: true,
        message3: false,
        message4: true,
        userName: localStorage.getItem('userName'), // 用户名
        times:new Date().getTime()
      }
    },
    beforeCreate () {

    },
    beforeDestroy () {

    },
    methods: {
      // 蜜蜂上浮
      isShowHide(){
        // 判断当前是否全屏
        this.message2 = !(document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen);
      },
      // 蜜蜂触发的方法
      handleCommand(command) {
        if (command === 'logOut') {
          this.logOut();
        }else if(command === 'personalCenter'){
          let btn = document.getElementById('personalCenter');
          btn.click();
        }else if(command === 'fullScreen'){
          this.fullScreen();
        }else if(command === 'CancelFullScreen'){
          this.CancelFullScreen();
        }
      },
      // 跳转个人中心
      personalCenter() {
        this.$router.push({path: '/personalCenter'})
      },
      // 全屏显示
      fullScreen() {
        console.log(123);
        this.message2 = false;
        let docElm = document.documentElement;
        //W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      },
      // 取消全屏
      CancelFullScreen() {
        this.message2 = true;
        // 判断各种浏览器，找到正确的方法
        var exitMethod = document.exitFullscreen || //W3C
          document.mozCancelFullScreen || //Chrome等
          document.webkitExitFullscreen || //FireFox
          document.webkitExitFullscreen; //IE11
        if (exitMethod) {
          exitMethod.call(document);
        }
        else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
          var wscript = new ActiveXObject("WScript.Shell");
          if (wscript !== null) {
            wscript.SendKeys("{F11}");
          }
        }
    },
      // 鼠标上浮
      enter(){
        this.message1 = true;
      },
      // 鼠标离开
      leave(){
        this.message1 = false;
       /* setTimeout(() => {
          this.message1 = false;
        },1000)*/
      },
      // 鼠标上浮
      enter1(){
        this.message3 = true;
      },
      // 鼠标离开
      leave1(){
        this.message3 = false;
      },
      // 退出
      logOut() {
        let self = this;
          self._post('com.edb01.upms.service.LoginRegistService/'+self.version+'/logout')
          .then(function (res) {
            if (res.data.success == true) {
              if(res.data.result) { // 为true退出并去登录页
                clearInterval(timer);
                self.$router.push({ path: '/' });
                localStorage.removeItem('autoLogin');
                localStorage.removeItem('clToken');
              }
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err);
          })
      }
    },
    created() {
     /* timer = setInterval( () => {
        let self = this;
        self._post('com.edb01.upms.service.LoginRegistService/' + self.version + '/loginLisnter')
          .then(res => {
            if(res.data.success == true){
            }
          })
      },5000);
    */
    },
    mounted() {
      /*$("#Index_iFrame").attr('src','');
      $("#Index_iFrame").attr('src','http://'+this.imgUpload+'/erp-bis-view/dist/#/indexBis?times='+this.times);
      document.getElementById('Index_iFrame').contentWindow.location.reload(true);*/
      $('.page-content').height($('#app').height()-88);

     let self = this;
       self._post('com.edb01.upms.service.PrivilegeService/'+self.version+'/getUserPrivilege')
       .then(function (res) {
         if (res.data.code == 0) {
           var params = {};
          // params.clToken='TB0+LhEZdtYikSUg2Ydef+Y3o1g93r3uY6ANBz/Qqv6mHQGLfK/+fT7BkmF6k/p7pu1FkSJoWG5xmQW+2qChEQ==';
           var result = JSON.parse(JSON.stringify(res.data.result.nodes));
           result.forEach(item => {
             item.nodes.forEach(item2 => {
               item2.nodes.forEach(item3 => {
                 for(var i= item3.nodes.length-1;i>=0;i--){
                   if(item3.nodes[i] && item3.nodes[i].privilegeName == '赠品调整'){
                     item3.nodes.splice(i,1);
                   }
                   if(item3.nodes[i] && item3.nodes[i].privilegeName == '赠品列表'){
                     item3.nodes.splice(i,1);
                   }
                   if(item3.nodes[i] && item3.nodes[i].privilegeName == '虚拟套装调整'){
                     item3.nodes.splice(i,1);
                   }
                 }
               })
             })
           })
           self.menuData = result[0].nodes;
           self.menuData.unshift({ privilegeName:'首页',
             icon:'icon iconfont icon-shouye',
             url:'',
             nodes:[]});
           //console.log(self.menuData);
           //获得店铺列表
           self._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + self.version + '/query',params).then(response => {
             if (response.data.success) {
               if(response.data.result){
                 var pageBean = response.data.result;
                 var openManGiftInv = pageBean.openManGiftInv,openManSuitSales = pageBean.openManSuitSales;
                 //console.log(openManGiftInv,openManSuitSales);
                 var result = res.data.result.nodes;
                 result.forEach(item => {
                   item.nodes.forEach(item2 => {
                     item2.nodes.forEach(item3 => {
                       for(var i= item3.nodes.length-1;i>=0;i--){
                         if(item3.nodes[i] && item3.nodes[i].privilegeName == '赠品调整' && !openManGiftInv){
                           item3.nodes.splice(i,1);
                         }
                         if(item3.nodes[i] && item3.nodes[i].privilegeName == '赠品列表' && !openManGiftInv){
                           item3.nodes.splice(i,1);
                         }
                         if(item3.nodes[i] && item3.nodes[i].privilegeName == '虚拟套装调整' && !openManSuitSales){
                           item3.nodes.splice(i,1);
                         }
                       }
                     })
                   })
                 })
                 self.menuData = result[0].nodes;
                 self.menuData.unshift({ privilegeName:'首页',
                   icon:'icon iconfont icon-shouye',
                   url:'',
                   nodes:[]});
                 //console.log(self.menuData);
               }
             } else {
               self.$message({
                 message: response.data.msg,
                 type: 'warning'
               });
             }
           }).catch(function (error) {
             console.log(error);
           });
         } else {
           self.$message({
             message: res.data.msg,
             type: 'warning'
           });
         }
       })
       .catch(function (err) {
         console.log(err);
       })
    }
  }
</script>

<style>
  @import "../assets/css/static/jframe/css/bootstrap.min.css";
  @import "../assets/css/static/jframe/css/layout.min.css";
  @import "../assets/css/static/jframe/css/darkblue.min.css";
  @import "../assets/css/static/jframe/css/contabs.css";


  .page-header.navbar {
    background: -webkit-linear-gradient(to right, #5D6D7C, #EAEAF2); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(to right, #5D6D7C, #EAEAF2); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(to right, #5D6D7C, #EAEAF2); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #5D6D7C, #EAEAF2); /* 标准的语法 */
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
<style scoped>
  .honeybee i{
    width: 15px;
    display: inline-block;
    margin-right:9px;
    color: #888;
  }
  .honeybee{
    font-size: 14px;
    font-weight: 300;
    margin: 4px;
    color: #888;
  }
  .honeybee li{
    height: 40px;
    width: 180px;
    line-height: 40px;
    padding-left: 16px;
  }
  .background-body{
    height: 100%;
    background: -webkit-linear-gradient(to bottom, #202d3d, #475a6f); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(to bottom, #202d3d, #475a6f); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(to bottom, #202d3d, #475a6f); /* Firefox 3.6 - 15 */
    background: linear-gradient(to bottom, #202d3d, #475a6f); /* 标准的语法 */
  }
  #center{
    width: 110px;
    height: 84px;
    list-style: none;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    position: fixed;
    top:49px;
    right: 170px;
    z-index: 10;
    cursor: pointer;
    text-align: center;
    padding: 2px;
  }
  #center li{
    height: 39px;
    line-height: 40px;
   /* padding-left: 16px;*/
  }
  #center li a{
    font-size: 14px;
    font-weight: 300;
    margin: 4px;
    color: #888;
  }
  #center li:hover{
    background: #D1F5F7;
  }
  #b{
    width: 195px;
    height: 168px;
    list-style: none;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    position: fixed;
    top:49px;
    right: 30px;
    z-index: 10000;
    cursor: pointer;
    padding: 5px;
  }
  #c{
    position: fixed;
    top:37px;
    right: 86px;
    color: #eee;
    font-size: 18px;
    background: #fff;
    z-index: 10;
  }
  #b li{
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
  }
  #b li a{
    font-size: 14px;
    font-weight: 300;
    margin: 4px;
    color: #888;
  }
  #b li:hover{
    background: #D1F5F7;
  }
  #b li i{
    width: 15px;
    display: inline-block;
    margin-right:9px;
    color: #888;
  }
  #layout .page-sidebar-menu.page-sidebar-menu-hover-submenu > li > .new-menu-area{
    background: #536277!important;
  }
</style>

