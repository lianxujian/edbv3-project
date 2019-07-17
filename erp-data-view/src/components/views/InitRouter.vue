<!--尘音 空路由时返回此页面-->
<template>
  <div id="initRouter" style="text-align: center">
    data系统超时，请重新<a style="color: #0000FF;" @click="imgSrc">登录</a>
    <div>{{sessionToken}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        sessionToken: sessionStorage.getItem('clToken') ? sessionStorage.getItem('clToken') : localStorage.getItem('clToken')
      }
    },
    methods: {
      imgSrc: function () {
        if(process.env.NODE_ENV == 'development'){
          this.$router.push('/testLogin');
        }else{
          parent.location.href = `http://${process.env.FILE_API}`;
        }
      }
    }
  }
</script>










