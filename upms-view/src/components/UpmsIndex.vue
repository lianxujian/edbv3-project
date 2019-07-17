<!--upms首页 尘音-->
<template>
  <div id="upmsIndex">
    <!--功能导航图-->
    <el-row :gutter="15">
      <el-col :span="4"><img src="../assets/img/banner1.png" width="100%" alt=""></el-col>
      <el-col :span="4"><img src="../assets/img/banner2.png" width="100%" alt=""></el-col>
      <el-col :span="4"><img src="../assets/img/banner3.png" width="100%" alt=""></el-col>
      <el-col :span="4"><img src="../assets/img/banner4.png" width="100%" alt=""></el-col>
      <el-col :span="4"><img src="../assets/img/banner5.png" width="100%" alt=""></el-col>
      <el-col :span="4"><img src="../assets/img/banner6.png" width="100%" alt=""></el-col>
    </el-row>
    <!--pageHome-->
    <div style="margin-top: 5px">
      <div style="float: right;margin-left:5px;width: 451px">
        <img style="margin-bottom: 5px" src="../assets/img/gonggao.png" width="100%" alt="">
        <img style="margin-bottom: 5px" src="../assets/img/xitong.png" width="100%" alt="">
        <img src="../assets/img/yudan.png" width="100%" height="100%" alt="">
        <div style="margin-top:30px;padding:0 30px;">
          <div style="display: inline-block">
            <img src="../assets/img/twoCode1.jpg" alt="">
            <div style="text-align: center">微信（公众）</div>
          </div>
          <div style="display: inline-block;margin-left: 90px">
            <img src="../assets/img/twoCode2.jpg" alt="">
            <div style="text-align: center">圣特尔 E店宝</div>
          </div>
        </div>
      </div>
      <div>
        <div style="width: 100%;padding-right: 441px">
          <img style="margin-bottom: 5px" src="../assets/img/dianpu.png" width="98.5%" alt="">
          <img src="../assets/img/hexin.png" width="98.5%" alt="">
        </div>
      </div>
    </div>
    <div style="text-align: center;color: #C8CEDF;margin-top: 2px">Copyright © @2004-2017 京公⽹安备11010502034342号 京ICP备05039376号-33 北京圣特尔科技发展有限公司 版权所有</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },methods:{

    }
  }
</script>
<style scoped>
  #upmsIndex{
    background: #F0F1F5;
    color: #4A4A4A;
    padding: 5px 15px!important;
  }
</style>
