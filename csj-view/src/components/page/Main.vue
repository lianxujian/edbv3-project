<template>
  <div id="main" class="main-iframe">
    <pageAside v-if="isShow"></pageAside>
    <!--<keep-alive></keep-alive>-->
    <router-view class="main"></router-view>
  </div>
</template>

<script>
  import pageAside from '@/components/common/Aside.vue';
  export default {
    components:{
      pageAside
    },
    data(){
      return {
        isShow: false
      }
    }
  }
</script>

<!-- 本页css -->
<style scoped>
.main{
  height: 100%;
  padding: 20px !important;
  position: relative;
  margin-left:0;
}
  #main{
    height: 100%;
  }
</style>
<style>
</style>
