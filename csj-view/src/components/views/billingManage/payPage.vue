<template>
  <div id="payForm" v-html='htmlForm'>

  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      paramData:this.$router.history.current.params,
      htmlForm:'',
      htmlStr:''
    }
  },
  mounted(){
    var paramData={
          payWay:this.paramData.payPath,
          rechargeGoodsId:this.paramData.payNum
        }
    var self=this;
    this.$axios({
      method:'post',
      url:process.env.OLD_API + 'api/recharge/webBusiness',
      data:paramData,
      transformRequest:[function (data) {
        let newData = '';
        for(let k in data){
          newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
        }
        return newData;
      }]

    })
      .then(function (response) {
        console.log(response)
        if(response.data.code==0){
          self.htmlStr=response.data.result;
          self.htmlForm=self.htmlStr.split('<script>')[0];
          setTimeout(()=>{
            document.forms[0].submit();
          })
          //self.$router.push({ name:'payPage',params:{payPath:response.data.result}});
        }else{
          self.$message({
            message: response.data.message,
            type: 'warning'
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }
}
</script>

<style>
</style>
