<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import '../static/bootstrap/js/bootstrap-3.3.2.min.js'
  import '../static/bootstrap/js/bootstrap-multiselect.js'
  import '../static/bootstrap/js/yi-scroll.js'
export default {
  methods:{

  }
}
</script>

<style>
  @import "../static/css/font-awesome.min.css";
  @import "../static/css/iconfont.css";

  @import './assets/css/index.css';
  @import './assets/css/element-ui.css';  /*全局自定义样式*/
  @import './assets/css/multiselect.css'; /*下拉多选框插件*/
  @import './assets/css/ag-grid.css';  /*ag-grid样式*/
  @import './assets/css/searchBox.css';/*搜索区全局样式引入*/
</style>
