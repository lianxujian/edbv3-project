<template>
  <div id="main" class="main-iframe">
    <pageAside v-if="isShow"></pageAside>
    <keep-alive><!--:include="keepComponentArr"-->
      <router-view class="main" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <el-button @click="closeKeep" style="position:fixed;left:20px;top:20px;z-index:1000;" v-if="false">关闭缓存</el-button>
    <router-view class="main" v-if="!$route.meta.keepAlive"></router-view>
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
        keepComponentArr:['orderProcessing','orderQuery'],
        isShow: process.env.NODE_ENV == 'development'?true:false
      }
    },
    mounted(){

    },
    methods:{
      closeKeep(){
        this.keepComponentArr = [];
        this.$router.push({path:'/'});
        console.log(this.$router);
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
  margin-left: 0;
}
#main{
  padding: 10px 15px;
  height: 100%;
}
</style>
<style>
</style>
