<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  methods:{

  }
}
</script>

<style>
  @import 'assets/css/index.css';
  @import './assets/css/element-ui.css';  /*全局自定义样式*/
  @import './assets/css/ag-grid.css';  /*ag-grid样式*/
  @import './assets/css/multiselect.css'; /*下拉多选框插件*/
  @import './assets/css/searchBox.css';/*搜索区全局样式引入*/
  @import './assets/css/rich-text-editor.css';/*富文本编辑器全局样式引入*/
</style>
<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height:100%;
  }
  *{
    margin:0;
    padding:0;
    list-style:none;
    box-sizing:border-box;

  }
  body,html{
    width:100%;
    height:100%;
    font-size:14px;
  }
  .container_search .el-input-group__append{
    padding: 0;
    height: 26px;
    width: 26px;
    background: #fff;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  /* 弹出框 */
  .dialog{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .mask{
    width:100%;
    height:100%;
    background:#000;
    position:fixed;
    left:0;
    top:0;
    opacity:.5;
    z-index:100;
  }
  .dialog-box{
    width:500px;
    height:320px;
    background:#fff;
    position:fixed;
    left:50%;
    top:40%;
    margin-top:-160px;
    margin-left:-250px;
    z-index:110;
    border-radius:2px;
  }
  .dialog-head{
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
  }
  .dialog-head span{
    float: right;
    font-size: 22px;
    margin-right: 15px;
    cursor: pointer;
  }
  .dialog-content{
    padding:30px 50px;
  }
  .el-loading-mask{
    background:rgba(255, 255, 255, .9) !important;
  }
  .el-loading-text{
    text-align:center;
  }
  .el-table__header-wrapper .cell{
    text-align:center;
  }
  .el-table .cell, .el-table th>div{
    padding:0 8px;
  }
  .el-icon-refresh{
    font-size:18px;
    float: left;
    margin:6px 15px 0 15px;
    cursor: pointer;
  }
  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #dcdfe6 !important;
  }
  #tab_small .el-table td,#tab_small .el-table th{
    padding:0px;
  }
  /*表格输入框*/
  #fitTable .el-input__inner {
    padding: 0 10px;
  }

  #fitTable .el-input {
    width: 100% !important;
  }
  /*多选select*/
  .rel-shop .el-select__tags {
    overflow: hidden;
  }

  .rel-shop .el-select__tags > span {
    display: inline-block;
    width: 300px;
  }
  .release-dialog .dialog-box{
    width: 700px !important;height: 460px !important;margin-top: -230px !important;margin-left: -350px !important;overflow:hidden;
  }
  .release-dialog .dialog-box .dialog-content{
    height:430px;position:relative;padding:0 0 80px 0;width:670px;
  }
  .release-dialog .dialog-box .dialog-content .s-content{
    width:100%;height:100%;overflow-y:scroll;padding:20px 60px 10px 50px;
  }
  .release-dialog .dialog-box .dialog-content .release-btn{
    position:absolute;bottom:30px;left:0;text-align:center;width:100%;
  }
  .img-seat{
    display:inline-block;width:120px;height:120px;border:1px solid #ccc;border-radius:5px;margin-right:16px;
  }

  .img-title {
    width: 30px;
    height: 30px;
    display: inline-block;
    float: left;
    margin-left: 10px;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  .img-title img {
    width: auto;
    height: auto;
    max-width: 30px;
    max-height: 30px;
  }

  .img-title video {
    width: 100%;
  }
  .upload-img{
    position:relative;
  }
  /*发布弹框重构*/
  .col-left{
    float:left;
    border-right:1px solid #ccc;
    height:100%;
    width:50%;
    padding:40px 20px;
  }
  .col-left>p{
    margin-bottom:30px;
  }
  .col-left>div{
    margin-bottom:20px;
    position:relative;
  }
  .col-left>div>i{
    position:absolute;
  }
  .col-left>div>label{
    width:80px;
    display:inline-block;
    text-align:right;
  }
  .col-left>div>label>span{
    color:red;
    margin-right:2px;
  }
  .col-left .el-select{
    width:180px !important;
  }
  .col-left .rel-button{
    text-align:center;
    margin-top:40px;
  }
  .col-right{
    float:left;
    height:100%;
    width:50%;
    padding:40px 20px;
  }
  .col-right>p{
    margin-bottom:30px;
    text-align:center;
  }
  .col-right .shop-box{
    height:200px;
    border:1px solid #ccc;
    overflow-y:scroll;
  }
  .col-right .shop-box>div{
    float:left;
    margin:5px;
  }
  .col-right .shop-box>div span{
    color: red;
    font-size: 16px;
    cursor: pointer;
    margin: 3px;
    opacity: 1;
  }
  .col-right .rel-button{
    text-align:center;
    margin-top:30px;
  }
  .ts-darwin .el-select .el-input .el-select__caret{
    line-height:32px;
  }
  .wrap-ul .el-input__suffix-inner{
    width: 25px;
    margin:0;
  }
</style>
