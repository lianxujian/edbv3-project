<template>
  <div id="main">
    <pageTop></pageTop>
    <pageAside></pageAside>
    <div class="tag" id="tagBox">
      <el-tag
        :key="tag"
        v-for="(tag,index) in dynamicTags"
        :class="{'blueBackGround': index == currentIndex}"
        closable
        @click="handleClick(tag,index)"
        @close="handleClose(tag,index)">
        <span v-if="tag == 'index'">首页</span>
        <span v-if="tag == 'brand'">品牌管理</span>
        <span v-if="tag == 'classify'">分类管理</span>
        <span v-if="tag == 'singleGoods'">商品维护</span>
        <span v-if="tag == 'singleSku'">商品查询</span>
        <span v-if="tag == 'suit'">套装维护</span>
        <span v-if="tag == 'suitSku'">套装查询</span>
        <span v-if="tag == 'internetGoods'">平台商品查询</span>
        <span v-if="tag == 'goodsBind'">前后端商品绑定</span>
        <span v-if="tag == 'goodSupervise'">WMS货品管理</span>
      </el-tag>
    </div>
    <keep-alive :include="dynamicTags">
      <router-view class="main"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import pageTop from '@/components/common/Top.vue';
  import pageAside from '@/components/common/Aside.vue';
  import {mapGetters,mapState} from 'vuex'
  export default {
    //computed:mapGetters(['dynamicTags','currentIndex']),
    computed:{
      ...mapGetters(['dynamicTags']),
      ...mapGetters(['currentIndex'])
    },
    components:{
      pageTop,pageAside
    },
    data(){
      return {

      }
    },
    mounted(){
      console.log(this.$store.getters.dynamicTags);
    },
    methods: {

      //tag点击
      handleClick(tag) {
        this.$router.push(`/${tag}`);
        this.$store.dispatch(`${tag}`);
      },

      //tag关闭
      handleClose(tag,index) {
        //删除缓存组件
        /*this.$children.forEach(item => {
          if(item.$el.getAttribute("id") == tag) {
            let vue_component = item.$vnode.tag.split('-')[2]*1;
            delete item.$vnode.parent.componentInstance.cache[vue_component];
          }
        });*/
        if(this.currentIndex == index) {
          let i = this.dynamicTags.indexOf(tag) - 1;
          let name = this.dynamicTags[i];
          this.handleClick(name);
          this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        }else if(index < this.currentIndex){
          this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
          this.$store.dispatch('tagClose')
        }else {
          this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        }
      }
    }
  }
</script>

<!-- 本页css -->
<style scoped>
.main{
  min-height: 100%;
  padding: 20px!important;
  background: rgb(255, 255, 255);
  position: relative;
  margin-left: 200px;
}
#main{
  padding: 130px 15px 10px;
  height: 100%;
}
.tag{
  top: 104px;
  left: 215px;
  position: absolute;
}
#main .el-tag {
  cursor: pointer;
  background-color: #fff;
  padding: 0 10px;
  height: 22px;
  line-height: 20px;
  font-size: 12px;
  color: #000;
  border-radius: 13px;
  box-sizing: border-box;
  white-space: nowrap;
  margin-right: 5px;
}
.blueBackGround{
  background-color: #2D5CC4!important;
  cursor: pointer;
  padding: 0 10px;
  height: 22px;
  font-size: 12px;
  color: #fff!important;
  border-radius: 13px;
  box-sizing: border-box;
  white-space: nowrap;
  margin-right: 5px;
}
</style>
<style>
  #main .el-tag .el-icon-close {
    border-radius: 50%;
    text-align: center;
    position: relative;
    cursor: pointer;
    font-size: 16px;
    height: 16px;
    width: 16px;
    line-height: 16px;
    top: -1px;
    right: -5px;
    color: #2D5CC4;
    background: #fff;
    transform: scale(0.5);
    font-weight: bolder;
  }
  #tagBox .el-tag:nth-child(1) i{
    display: none;
  }
  #main .el-tag .el-icon-close:hover{
    color: #ff0000;
  }
</style>
