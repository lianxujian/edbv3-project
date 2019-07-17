<template>
  <div style='width:100%;padding-top:150px;height:100%;'>
    <div class='pay-box'><img src="../../../assets/img/logo.png" alt=""></div>
    <p>付款成功</p>
    <div class='fanhu'>请返回账户查看...</div>
    <div class='footer'>京ICP备05039376号-5</div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {

    }
  },
  mounted(){
  }
}
</script>

<style scoped>
  .pay-box{
    width:120px;
    height:120px;
    padding:20px;
    margin:0 auto;
    border-radius:50%;
    margin-top:80px;
    background:#3CACF3;
  }
  .pay-box img{
    width:100%;
    height:100%;
  }
  p{
    text-align:center;
    font-size:28px;
    margin-top:30px;
    color:#85B4C7;
  }
  .footer{
    height:150px;
    width:100%;
    position: fixed;
    bottom:0;
    left:0;
    background:#21212D;
    color:#fff;
    text-align:center;
    padding-top:55px;
  }
  .fanhu{
    text-align: center;
    margin-top: -22px;
    color: #85B4C7;
    margin-left: 310px;
    font-size: 15px;  }
</style>
