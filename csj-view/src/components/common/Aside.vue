<!--侧边导航 尘音-->
<template>
    <div id="aside">
      <div class="sidebar">
        <el-menu
          :default-active="onRoutes"
          router
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF">
          <el-submenu index="home">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>首页</span>
            </template>
            <el-menu-item index="/home">首页</el-menu-item>
          </el-submenu>
          <el-submenu index="goods">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>商品</span>
            </template>
            <el-menu-item index="/goodsManage">商品管理</el-menu-item>
            <el-menu-item index="/goodsRelease">商品发布</el-menu-item>
          </el-submenu>
          <el-submenu index="task">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>任务中心</span>
            </template>
            <el-menu-item index="/taskCenter">任务中心</el-menu-item>
          </el-submenu>
          <el-submenu index="limitword">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>极限词检测</span>
            </template>
            <el-menu-item index="/limitwordCare">极限词维护</el-menu-item>
            <el-menu-item index="/historyRecord">历史检测记录</el-menu-item>
          </el-submenu>
          <el-submenu index="billingManage">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>计费管理</span>
            </template>
            <el-menu-item index="/accountCenter">账户中心</el-menu-item>
            <el-menu-item index="/consDetail">消费明细</el-menu-item>
            <el-menu-item index="/rechargeRecord">充值记录</el-menu-item>
          </el-submenu>
          <el-submenu index="setting">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>设置</span>
            </template>
            <el-menu-item index="/accountSetting">账号设置</el-menu-item>
            <el-menu-item index="/storeSetting">店铺设置</el-menu-item>
            <el-menu-item index="/paramsSetting">参数设置</el-menu-item>
          </el-submenu>
          <el-submenu index="backStage">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>后台管理</span>
            </template>
            <el-menu-item index="/noticeInfo">公告信息</el-menu-item>
            <el-menu-item index="/service">服务通道</el-menu-item>
            <el-menu-item index="/billingDetails">结算明细</el-menu-item>
            <el-menu-item index="/backRechargeRecord">充值记录</el-menu-item>
            <el-menu-item index="/rechargeManage">充值商品列表</el-menu-item>
            <el-menu-item index="/accountManage">账户管理列表</el-menu-item>
          </el-submenu>

        </el-menu>

      </div>
    </div>
</template>

<script>
export default {
  computed:{
    onRoutes(){
      return this.$route.path.replace('/','');//默认显示
    }
  },
  methods: {

  }
}
</script>

<!-- 本页css -->
<style scoped>
#aside{
  overflow: auto;
  width: 2px;
  height: 100%;
  background: #545c64;
  position:fixed;
  left: 0;
  top: 0;
  z-index: 9999;
}
#aside:hover{
  width: 180px;
}
#aside .el-submenu .el-menu-item{
  min-width: 100px;
}
#aside .el-menu{
  border-right: none;
}
</style>
