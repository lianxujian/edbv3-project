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
          <el-submenu index="orderMenu">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>订单</span>
            </template>
            <el-menu-item index="orderProcessing" @click="orderProcessing">订单处理</el-menu-item>
            <el-menu-item index="orderQuery" @click="orderQuery">订单查询</el-menu-item>
            <el-menu-item index="invoicesControl" @click="invoicesControl">发票管理</el-menu-item>
            <el-menu-item index="exceptionOrder" @click="exceptionOrder">平台异常单</el-menu-item>
            <el-menu-item index="/originalOrder">平台原始单</el-menu-item>
          </el-submenu>

          <el-submenu index="commodityMenu">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>商品</span>
            </template>
            <el-menu-item index="giftList" @click="giftList">赠品列表</el-menu-item>
            <el-menu-item index="giftAdjust" @click="giftAdjust">赠品调整</el-menu-item>
            <el-menu-item index="giftStrategy" @click="giftStrategy">赠品策略</el-menu-item>
            <el-menu-item index="suitAdjust" @click="suitAdjust">虚拟套装调整</el-menu-item>
            <el-menu-item index="taskCenter" @click="taskCenter">任务中心</el-menu-item>
            <el-menu-item index="/salesCenter">促销中心</el-menu-item>
          </el-submenu>

          <el-submenu index="afterSaleMenu">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>售后</span>
            </template>
            <el-menu-item index="afterSaleDispose" @click="afterSaleDispose">售后处理</el-menu-item>
            <el-menu-item index="quickSalesReturn" @click="quickSalesReturn">快速退货入库</el-menu-item>
            <el-menu-item index="afterSaleQuery" @click="afterSaleQuery">售后单查询</el-menu-item>
          </el-submenu>

          <el-submenu index="setUpMenu">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>设置</span>
            </template>
            <el-menu-item index="automaticReviewScheme" @click="automaticReviewScheme">自动审单方案</el-menu-item>
            <el-menu-item index="orderMarks" @click="orderMarks">订单标记</el-menu-item>
            <el-menu-item index="orderSet" @click="orderSet">订单设置	</el-menu-item>
            <el-menu-item index="afterSaleSet" @click="afterSaleSet">售后设置</el-menu-item>
          </el-submenu>
          <el-submenu index="loginMenu">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>登录</span>
            </template>
            <el-menu-item index="/AgGridVue">Ag-grid	</el-menu-item>
            <el-menu-item index="/formTest">FormTest</el-menu-item>
            <el-menu-item index="/testLogin">登录</el-menu-item>
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
    orderProcessing: function () {
      this.$router.push('/orderProcessing')
    },
    orderQuery: function () {
      this.$router.push('/orderQuery')
    },
    invoicesControl: function () {
      this.$router.push('/invoicesControl')
    },
    exceptionOrder: function () {
      this.$router.push('/exceptionOrder')
    },
    giftStrategy: function () {
      this.$router.push('/giftStrategy')
    },
    giftAdjust: function () {
      this.$router.push('/giftAdjust')
    },
    suitAdjust: function () {
      this.$router.push('/suitAdjust')
    },
    giftList: function () {
      this.$router.push('/giftList')
    },
    afterSaleDispose: function () {
      this.$router.push('/afterSaleDispose')
    },
    quickSalesReturn: function () {
      this.$router.push('/quickSalesReturn')
    },
    afterSaleQuery: function () {
      this.$router.push('/afterSaleQuery')
    },
    automaticReviewScheme:function(){
      this.$router.push('/automaticReviewScheme')
    },
    orderMarks:function(){
      this.$router.push('/orderMarks/0')
    },
    orderSet:function(){
      this.$router.push('/orderSet')
    },
    afterSaleSet:function(){
      this.$router.push('/afterSaleSet')
    },
    taskCenter(){
      this.$router.push('/taskCenter')
    }
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
