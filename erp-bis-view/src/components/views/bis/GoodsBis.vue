<!--商品销量  贾南风 变更 佩玖-->
<template>
  <div id="goodsBis">
    <div class="topClass">
      <el-row>
        <el-col :span="5">
          <div class="grid-content bg-purple"  style="text-align: center;cursor: pointer;line-height: 40px;margin-bottom: 1px" :class="{colorTitle: isShow == 1}" @click="clickCut(1)"><span class="spanText">商品销量统计（条形码）</span></div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light" style="text-align: center;cursor: pointer;line-height: 40px;margin-bottom: 1px" :class="{colorTitle: isShow == 2}" @click="clickCut(2)"><span class="spanText"> 商品销量统计（商品编码）</span></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple" style="text-align: center;cursor: pointer;line-height: 40px;margin-bottom: 1px" :class="{colorTitle: isShow == 3}" @click="clickCut(3)"><span class="spanText">品牌销量统计</span></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light" style="text-align: center;cursor: pointer;line-height: 40px;margin-bottom: 1px" :class="{colorTitle: isShow == 4}" @click="clickCut(4)"><span class="spanText">分类销量统计 </span></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple" ></div>
        </el-col>
      </el-row>
    </div>
   <!-- <keep-alive>
    <router-view></router-view>
    </keep-alive>-->
    <div v-if="isShow==1"><barCode></barCode></div>
    <div v-if="isShow==2"><shopNumber></shopNumber></div>
    <div v-if="isShow==3"><brandCount></brandCount></div>
    <div v-if="isShow==4"><classifyCount></classifyCount></div>
  </div>
</template>
<script>
  import barCode from '@/components/views/bis/children/barCode.vue' // 商品条形码
  import shopNumber from '@/components/views/bis/children/shopNumber.vue' // 商品条形码
  import brandCount from '@/components/views/bis/children/brandCount.vue' // 商品条形码
  import classifyCount from '@/components/views/bis/children/classifyCount.vue' // 商品条形码
  export default {
    components: {
      barCode,shopNumber,brandCount,classifyCount
    },
    data(){
      return{
          isShow: 1    //默认展示
      }
    },
    methods:{
      // 点击切换
      clickCut(num){
        this.isShow = num;
        if(num == 1){
         // console.log(this.table_h1,1);
        }else if(num == 2){
          //console.log(this.table_h4,2);
        }else if(num == 3){
          //console.log(this.table_h4,2);
        }else{
          this.isShow = num;
          setTimeout( () => {
            this.table_h4 = $(window).height() - $('.col-border4').offset().top - 80;
            console.log(this.table_h4,2);
          },600)
          /*if(this.isShow == 4){

            console.log(this.table_h4,2);
          }*/

        }
      }
    }
  }
</script>
<style scoped>
  .topClass{
    background: #F0F1F5;
    margin-top: -10px;
  }
  .colorTitle{
    color: #1871F0;
  }
</style>
<style>
 /* #goodsBis .grid-content{
    text-align: center;
    cursor: pointer;
    line-height: 40px;
    margin-bottom: 1px;
  }*/
  #goodsBis .grid-content .spanText{
    font-weight: bold;
    font-size: 14px;

  }
</style>
