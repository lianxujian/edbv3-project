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
          <!--报表-->
          <el-submenu index="echartsBox">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>报表</span>
            </template>
            <!--店铺销量统计-->
            <el-menu-item index="shopBis" @click="shopBis">店铺销量统计</el-menu-item>

            <!--商品销量统计-->
            <el-menu-item index="goodsBis" @click="goodsBis">商品销量统计</el-menu-item>

            <!--绩效统计-->
            <el-menu-item index="scoreBis" @click="scoreBis">绩效统计</el-menu-item>

            <!--首页报表-->
            <el-menu-item index="indexBis" @click="indexBis">首页报表</el-menu-item>

          </el-submenu>

          <!--E店宝后台-->
          <el-submenu index="back_E">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>E店宝后台</span>
            </template>
            <!--系统公告-->
            <el-menu-item index="noticeBis" @click="noticeBis">系统公告</el-menu-item>

          </el-submenu>

          <!--Echarts样例-->
          <el-submenu index="echartsExample">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>Echarts样例</span>
            </template>
            <el-menu-item index="echarts01" @click="echarts01">echarts01</el-menu-item>
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
    shopBis: function () {
      this.$router.push('/shopBis')
    },
    goodsBis: function () {
      this.$router.push('/goodsBis')
    },
    scoreBis: function () {
      this.$router.push('/scoreBis')
    },
    indexBis: function () {
      this.$router.push('/indexBis')
    },
    noticeBis: function () {
      this.$router.push('/noticeBis')
    },
    echarts01: function () {
      this.$router.push('/echarts01')
    }
  }
}
</script>

<!-- 本页css -->
<style scoped>
#aside{
  width: 95px;
  height: 100%;
  overflow: auto;
  background: #545c64;
  position:absolute;
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
