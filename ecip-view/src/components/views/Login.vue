<!--登录 尘音-->
<template>
  <div id="login">
    <a style="color: #0000FF;" @click="imgSrc">登录</a>
  </div>
</template>
<script>
  export default {
    mounted(){

    },
    methods: {
      imgSrc: function () {
        this.$router.push('/index');
        sessionStorage.setItem('JumpJudgement',1)
      }
    }
  }
</script>




