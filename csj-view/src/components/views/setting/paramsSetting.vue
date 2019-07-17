<template>
  <div style="padding:40px !important;">
    <span>商家编码相同商品：</span>
    <el-radio-group v-model="paramsType" @change="channelChange">
      <el-radio :label="1">按照新品更新旧品</el-radio>
      <el-radio :label="2">不做更新保留旧品</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        paramsType:'',
        version:'1.0.0'
      }
    },methods:{
      channelChange(){
        var paramsTypeStatus = this.paramsType==1?2:1;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/updateParamSetting",{
          tsParamsId:'GOODS_UPDATE_RULE',
          paramsType:this.paramsType
        }).then((response)=>{
          if(response.data.success){
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
          }else{
            this.paramsType = paramsTypeStatus;
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },
    mounted(){
      this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/selecetParamSetting").then((response)=>{
        if(response.data.success){
          this.paramsType = response.data.result.paramsType;
        }else{
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      })
    },
    created(){

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
