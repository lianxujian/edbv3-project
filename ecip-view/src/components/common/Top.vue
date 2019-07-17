<!--侧边导航 尘音-->
<template>
  <div id="top">
    <div class="logo">
      <div style="height: 30px;background: #006DDC"></div>
      <img src="../../assets/img/logo.png" width="200" height="70" alt="logo">
    </div>
    <div class="nav">
      <div class="userClass">
        <span class="glyphicon glyphicon-user"></span>
        <span style="margin-right: 50px">用户名</span>
        <span class="exitClick" style="cursor: pointer;" @click="exitClick">退出系统</span>
      </div>
      <div style="text-align: center;height: 70px;overflow: hidden">
        <ul id="navClick">
          <li id="indexClick" @click="indexClick">
            <span style="margin-left: 0" class="glyphicon glyphicon-home iconClass"></span>
            <div style="margin-top: 10px">首 页</div>
          </li>
          <li id="goodsClick" @click="goodsClick">
            <span class="glyphicon glyphicon-shopping-cart iconClass"></span>
            <div style="margin-top: 10px">商品中心</div>
          </li>
          <li>
            <span class="glyphicon glyphicon-file iconClass"></span>
            <div style="margin-top: 10px">订单中心</div>
          </li>
          <li>
            <span class="glyphicon glyphicon-blackboard iconClass"></span>
            <div style="margin-top: 10px">库存中心</div>
          </li>
          <li>
            <span class="glyphicon glyphicon-bell iconClass"></span>
            <div style="margin-top: 10px">监控中心</div>
          </li>
          <li>
            <span class="glyphicon glyphicon-equalizer iconClass"></span>
            <div style="margin-top: 10px">系统管理</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {

      //首页点击
      indexClick: function () {
        $('#navClick li').css('background','transparent');
        $('#indexClick').css('background','#254B9E');
        $('#navAll>div').hide();
        $('#nav1').show()
      },

      //商品中心点击
      goodsClick: function () {
        $('#navClick li').css('background','transparent');
        $('#goodsClick').css('background','#254B9E');
        $('#navAll>div').hide();
        $('#nav2').show();
      },

      //退出系统
      exitClick: function () {
        this.$router.push('/login')
      }
    }
  }
</script>

<!-- 本页css -->
<style scoped>
  #top{
    width: 100%;
    height: 100px;
    overflow: auto;
    background: #2D5CC4;
    position:absolute;
    left: 0;
    top: 0;
    z-index: 12;
  }
  .logo{
    width: 200px;
    height: 100px;
    background: #2D5CC4;
    float: left;
  }
  ul{
    margin-bottom: 0;
  }
  ul li{
    display: inline-block;
    padding: 15px 40px;
    color: #fff;
    cursor: pointer;
    margin: 0 -2px;
  }
  ul li:hover{
    background: #254B9E!important;
  }
  #indexClick{
    background: #254B9E
  }
  .iconClass{
    margin-left: 10px;
    padding-left: 5px;
    display: block;
    width: 14px;
    height: 14px;
    font-size: 16px
  }
  .userClass{
    height: 30px;
    line-height: 30px;
    color: #cdd7ff;
    background: #006DDC;
    text-align: right;
    padding-right: 50px;
  }
  .exitClick:hover{
    color: #fff;
  }
</style>
