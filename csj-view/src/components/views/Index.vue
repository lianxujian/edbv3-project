<!--首页 樊虎-->
<template>
  <div id="index">
    <h1 style="font-size: 16px; text-align: center;">{{ $t("route.dashboard") }} - 樊虎</h1>
    <fh-select></fh-select>
  </div>
</template>
<script>
  import FhSelect from '@/components/common/Upload.vue';
  export default {
    components: {
      FhSelect
    },
    data() {
      return {

      }
    },
    mounted(){
      document.cookie='UPMS_USERTOKEN=2eba38bf5ddebd90a474436dbf6098e9';//f06bdc782a0fbd056d87a8256b10d435
      /*const data1 = {
        phone: '13552375417',
        password: 'fanhu123'
      };
      this._post( process.env.BASE_API + 'com.edb01.upms.service.LoginRegistService/1.0.0/loginByPhone',data1).then((response)=>{
        if(response.data.success){
          localStorage.setItem("clToken", response.data.result.clToken);
        }else{
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      })*/
    },
    methods:{

    }
  }
</script>
<style scoped>
  #stock{
    padding: 20px;
  }
  .pTop{
    margin-bottom: 20px;
  }
  #index{
    padding:30px;
  }
</style>

