<template>

  <div class="page-header-fixed page-sidebar-closed-hide-logo page-content-white">
  <!-- 头部开始 -->
  <!-- BEGIN HEADER头部 -->
  <div class="page-header navbar navbar-fixed-top">
    <!-- BEGIN HEADER INNER -->
    <div class="page-header-inner ">
      <!-- BEGIN LOGO -->
      <div class="page-logo">
        <a>LOGO</a>

      </div>
      <!-- END LOGO -->
      <!-- 横向导航栏Begin -->
      <div class="hor-menu   hidden-sm hidden-xs">
        <ul class="nav navbar-nav">
          <li class="classic-menu-dropdown">
            <a href="javascript:;" data-hover="megamenu-dropdown" data-close-others="true" class="hover-initialized">
              <span class="CurrEntName" entid="881684766236">admin的档口</span>
              <i class="fa fa-angle-down"></i>
            </a>
            <ul class="dropdown-menu pull-left EntList TopEntList"></ul>
          </li>
        </ul>
      </div>
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
            <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
              <!--错误时加载默认图，默认图也错误则null，防止图片闪跳-->
              <img alt="" class="img-circle Top_Avatar HeadImg" src="../../static/jframe/images/1489393836000_global_head_default.png@_80w_80h_1c_1e.png">
              <span class="username username-hide-on-mobile"><span class="UserCode">admin</span> </span>
              <i class="fa fa-angle-down"></i>
            </a>
            <!-- onerror="javascript: this.src = &#39;https://cdn-hbbsystem.hbbyun.com/hbb/image/1466473664000_mine_malehead_default.png&#39;;this.onerror=&#39;null&#39;" -->
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
      <div class="page-sidebar navbar-collapse collapse">
        <!-- BEGIN SIDEBAR MENU -->
        <ul id="side-menu" class="page-sidebar-menu  page-header-fixed page-sidebar-menu-hover-submenu" data-keep-expanded="true" data-auto-scroll="true" data-slide-speed="200" style="padding-top: 0px">
          <li class="sidebar-toggler-wrapper hide">
            <!-- BEGIN SIDEBAR TOGGLER BUTTON -->
            <div class="sidebar-toggler"> </div>
            <!-- END SIDEBAR TOGGLER BUTTON -->
          </li>

          <li class="nav-item start" v-if="index==0"  v-for="(item, index) in menuData">
            <a :url="item.url" class="J_menuItem nav-item" data-index="0">
              <!--<img :src="item.icon">-->
              <i v-if="item.icon!=''" :src="item.icon"  class="fa fa-arrows"></i>
              <span class="title">{{item.name}}</span>
            </a>
          </li>

          <li class="nav-item start" v-if="index>0"  v-for="(item, index) in menuData">
            <a  :url="item.url" class="nav-link nav-toggle" data-index="0">
             <!-- <img v-if="item.icon!=''" :src="item.icon" />-->
              <i v-if="item.icon!=''" :src="item.icon"  class="fa fa-arrows"></i>
              <span class="title">{{item.name}}</span>
              <span v-if="item.children.length>0" class="arrow"></span>
            </a>
            <ul v-if="item.children.length>0" class="sub-menu new-menu-area">
              <li v-for="(item2,index2) in item.children"  class="nav-item start" secondnav="true">
                <a url=""  class="nav-link nav-toggle">
                  <!--<img :src="item2.icon">-->
                  <i v-if="item2.icon!=''" :src="item2.icon"  class="fa fa-arrows"></i>
                  <span class="title">{{item2.name}}</span>
                  <span class="arrow"></span>
                </a>
                <ul v-if="item2.children.length>0" class="sub-menu new-menu-children-area">
                  <li v-for="(item3,index3) in item2.children" class="nav-item start">
                    <i v-if="item3.icon!=''" :src="item3.icon"  class="fa fa-arrows"></i>
                    <a :url="item3.url" class="J_menuItem nav-item " data-index="1">{{item3.name}}</a>
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
              <i class="fa fa-backward"></i>
            </button>
            <nav class="page-tabs J_menuTabs" data-toggle="tooltip" title="" data-original-title="双击刷新页面">
              <div class="page-tabs-content" style="margin-left: 0px;">
                <a class="J_menuTab active" data-id="">首页</a>
              </div>
            </nav>
            <button class="roll-nav roll-right J_tabRight">
              <i class="fa fa-forward"></i>
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
            <iframe id="Index_iFrame" class="J_iframe" name="iframe0" width="100%" height="100%" style="overflow: hidden; z-index: 999999999 !important; height: 100% !important; display: inline;" frameborder="0" data-id="" seamless="" src="../../static/jframe/images/Index.html"></iframe>
          </div>
        </div>
      </div>
      <!-- END CONTENT BODY -->
    </div>
    <!-- END CONTENT -->
  </div>
  <!-- END CONTAINER -->
  <!-- BEGIN CORE PLUGINS -->
  </div>
</template>
<script type="application/javascript">

  import   '../../static/jframe/js/bootstrap.min.js'
  import   '../../static/jframe/js/layout.min.js'
  import   '../../static/jframe/js/contabs.js'

  export default {
    name: 'Layout2',
    data () {
      return {
        menuData:[
          {
            name:'首页1',
            icon:'fa fa-inbox',
            url:'',
            children:[]
          },
          {
            name:'商品',
            icon:'fa fa-inbox',
            url:'',
            children:[
              {
                name:'商品管理',
                icon:'fa fa-inbox',
                url:'',
                children:[
                  {
                    name:'商品档案',
                    icon:'',
                    url:'/#/Login',
                  }
                ]
              },
              {
                name:'商品设置',
                icon:'fa fa-inbox',
                url:'',
                children:[
                  {
                    name:'商品分类',
                    icon:'',
                    url:'/#/Login',
                  },
                  {
                    name:'商品规格',
                    icon:'',
                    url:'/#/Login',
                  }
                ]
              }
            ]
          },
          {
            name:'客户',
            icon:'fa fa-inbox',
            url:'',
            children:[
              {
                name:'客户管理',
                icon:'fa fa-inbox',
                url:'',
                children:[
                  {
                    name:'客户档案',
                    icon:'',
                    url:'/#/Login',
                  }
                ]
              },
              {
                name:'客户设置',
                icon:'fa fa-inbox',
                url:'',
                children:[
                  {
                    name:'客户分类',
                    icon:'',
                    url:'/#/Login',
                  },
                  {
                    name:'客户规格',
                    icon:'',
                    url:'/#/Login',
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    beforeCreate () {

    },
    mounted(){

    },
    beforeDestroy () {

    },
    methods: {

    }
  }
</script>

<style>
  @import "../../static/jframe/css/font-awesome.min.css";
 @import "../../static/jframe/css/bootstrap.min.css";
 @import "../../static/jframe/css/layout.min.css";
 @import "../../static/jframe/css/darkblue.min.css";
 @import "../../static/jframe/css/contabs.css";



</style>

