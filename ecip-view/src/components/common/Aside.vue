<!--侧边导航 尘音-->
<template>
    <div id="aside">
      <div class="sidebar">

        <el-menu
          id="navAll"
          :default-active="onRoutes"
          router
          :unique-opened="true"
          class="el-menu-vertical-demo">
          <!--首页-->
          <div id="nav1">
            <el-menu-item index="index" @click="index">
              <i style="top: -1px" class="glyphicon glyphicon-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
          </div>
          <!--商品中心-->
          <div id="nav2">
            <el-menu-item index="brand" @click="brand">
              <i class="glyphicon glyphicon-flag iconClass"></i>
              <span slot="title">品牌管理</span>
            </el-menu-item>

            <el-menu-item index="classify" @click="classify">
              <i class="glyphicon glyphicon-th iconClass"></i>
              <span slot="title">分类管理</span>
            </el-menu-item>

            <el-submenu index="goodsCenter3">
              <template slot="title">
                <i class="glyphicon glyphicon-tag iconClass"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="singleGoods" @click="singleGoods">商品维护</el-menu-item>
              <el-menu-item index="singleSku" @click="singleSku">商品查询</el-menu-item>
            </el-submenu>

            <el-submenu index="goodsCenter4">
              <template slot="title">
                <i class="glyphicon glyphicon-tags iconClass"></i>
                <span>套装管理</span>
              </template>
              <el-menu-item index="suit" @click="suit">套装维护</el-menu-item>
              <el-menu-item index="suitSku" @click="suitSku">套装查询</el-menu-item>
            </el-submenu>

            <el-submenu index="goodsCenter5">
              <template slot="title">
                <i class="glyphicon glyphicon-barcode iconClass"></i>
                <span>平台商品管理</span>
              </template>
              <el-menu-item index="internetGoods" @click="internetGoods">平台商品查询</el-menu-item>
              <el-menu-item index="goodsBind" @click="goodsBind">前后端商品绑定</el-menu-item>
            </el-submenu>

            <el-menu-item index="goodSupervise" @click="goodSupervise">
              <i class="glyphicon glyphicon-th-large iconClass"></i>
              <span slot="title">WMS货品管理</span>
            </el-menu-item>
          </div>
          <!--订单中心-->
          <!--<div id="nav3"></div>-->
          <!--库存中心-->
          <!--<div id="nav4"></div>-->
          <!--监控中心-->
          <!--<div id="nav5"></div>-->
          <!--系统管理-->
          <!--<div id="nav6"></div>-->
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
    index: function () {
      this.$router.push('/index');
      this.$store.dispatch('index')
    },
    brand: function () {
      this.$router.push('/brand');
      this.$store.dispatch('brand','brand');
    },
    classify: function () {
      this.$router.push('/classify');
      this.$store.dispatch('classify')
    },
    singleGoods: function () {
      this.$router.push('/singleGoods');
      this.$store.dispatch('singleGoods')
    },
    singleSku: function () {
      this.$router.push('/singleSku');
      this.$store.dispatch('singleSku')
    },
    suit: function () {
      this.$router.push('/suit');
      this.$store.dispatch('suit')
    },
    suitSku: function () {
      this.$router.push('/suitSku');
      this.$store.dispatch('suitSku')
    },
    internetGoods: function () {
      this.$router.push('/internetGoods');
      this.$store.dispatch('internetGoods')
    },
    goodsBind: function () {
      this.$router.push('/goodsBind');
      this.$store.dispatch('goodsBind')
    },
    goodSupervise: function () {
      this.$router.push('/goodSupervise');
      this.$store.dispatch('goodSupervise')
    }
  }
}
</script>

<!-- 本页css -->
<style scoped>

.iconClass{
  font-size: 16px;
}
#aside{
  width: 200px;
  height: 100%;
  overflow: auto;
  background: white;
  position:absolute;
  left: 0;
  top: 0;
  padding-top: 100px;
  z-index: 11;
}
#aside .el-submenu .el-menu-item{
  min-width: 100px;
}
#aside .el-menu{
  border-right: none;
}
#navAll>div{
  display: none;
}
#navAll #nav1{
  display: block;
}
</style>
