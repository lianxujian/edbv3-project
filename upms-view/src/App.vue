<template>
  <div id="app">
  <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
  @import "./assets/css/static/css/font-awesome.min.css";
  @import "./assets/css/static/css/iconfont.css";
  @import './assets/css/index.css';
  @import './assets/css/element-ui.css';  /*全局自定义样式*/
  @import "./assets/css/searchBox.css"; /*公共搜索区样式*/

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  box-sizing: border-box;
  height:100%;
  min-height:768px;
}
  html,body{
    height:100%;
    margin:0;
  }
.el-submenu .fa{
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle
}
  .el-dialog__header{
    text-align: center;
    border-bottom: 1px solid #E1E1E1;
  }
  .el-dialog__title{
    font-size: 14px;
  }
  .el-input__inner{
    height: 30px;
  }
</style>
