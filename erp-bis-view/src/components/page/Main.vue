<template>
  <div id="main">
    <pageAside v-if="isShow"></pageAside>
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
  min-height: 100%;
  padding: 20px !important;
  background: rgb(255, 255, 255);
  position: relative;
  margin-left: 0px;
}
#main{
  padding: 15px 30px;
  height: 100%;
  overflow-y: auto;
}
</style>
