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
        <el-submenu index="commodityMenu">
          <template slot="title">
            <span>商品</span>
          </template>
          <el-menu-item index="classify" @click="classify">分类</el-menu-item>
          <el-menu-item index="brand" @click="brand">品牌</el-menu-item>
          <el-menu-item index="customAttribute" @click="customAttribute">自定义属性</el-menu-item>
          <el-menu-item index="goodsList" @click="goodsList">商品列表</el-menu-item>
          <el-menu-item index="suit" @click="suit">套装</el-menu-item>
          <el-menu-item index="internetGoods" @click="internetGoods">网店商品</el-menu-item>
          <el-menu-item index="goodsDownCenter" @click="goodsDownCenter">商品下载中心</el-menu-item>
        </el-submenu>
        <el-submenu index="setUpMenu">
          <template slot="title">
            <span>设置</span>
          </template>
          <el-menu-item index="shop" @click="shop">店铺</el-menu-item>
          <el-menu-item index="express" @click="express">快递</el-menu-item>
          <el-menu-item index="supplier" @click="supplier">供应商</el-menu-item>
          <el-menu-item index="operationLog" @click="operationLog">操作日志</el-menu-item>
        </el-submenu>
        <el-submenu index="appreciationMenu">
          <template slot="title">
            <!--<i class="el-icon-star-on"></i>-->
            <span>增值</span>
          </template>
          <el-menu-item index="industrialization" @click="industrialization">行业化</el-menu-item>
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
      // 商品-------------------------------------------商品
      // 分类
      classify: function () {
        this.$router.push('/classify')
      },
      // 品牌
      brand: function () {
        this.$router.push('/brand')
      },
      // 自定义属性
      customAttribute: function () {
        this.$router.push('/customAttribute')
      },
      // 	商品列表
      goodsList: function () {
        this.$router.push('/goodsList')
      },
      // 套装
      suit: function () {
        this.$router.push('/suit')
      },
      //网店商品
      internetGoods: function () {
        this.$router.push('/internetGoods')
      },
      //网店商品下载中心
      goodsDownCenter: function () {
        this.$router.push('/goodsDownCenter')
      },
      // 设置--------------------------------------------设置
      // 店铺
      shop: function () {
        this.$router.push('/shop')
      },
      // 快递
      express: function () {
        this.$router.push('/express')
      },
      supplier: function () {
        this.$router.push('/supplier')
      },
      // 操作日志
      operationLog: function () {
        this.$router.push('/operationLog')
      },
      // 增值--------------------------------------------增值
      // 行业化
      industrialization: function () {
        this.$router.push('/industrialization')
      },
    }
  }
</script>

<!-- 本页css -->
<style scoped>
  #aside{
    overflow: auto;
    width: 95px;
    height: 100%;
    background: #545c64;
    position:fixed;
    font-size: 10px!important;
    left: 0;
    top: 0;
    z-index: 9999;
  }
  #aside .el-submenu .el-menu-item{
    min-width: 100px;
  }
  #aside .el-menu{
    border-right: none;
  }
</style>
<style>
    .el-submenu__title{
    padding: 0 2px!important;
  }
    .el-submenu .el-menu-item{
      font-size: 10px;
      padding: 0 10px!important;
    }
</style>
