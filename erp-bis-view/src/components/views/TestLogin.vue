<!--尘音 首页-->
<template>
  <div id="index">
    尘音
  </div>
</template>
<script>
  export default {
    mounted(){

      //账号登录
      let ruleForm2 = {
        companyName: '葫芦弟弟',
        loginName: 'admin',
        password: '123456asd'
      };
      this._post('com.edb01.upms.service.LoginRegistService/1.0.0/login',ruleForm2)
        .then( (res) => {
          if (res.data.success) {
            if(res.data.result.code){ //有权限code才存储
              let arr = res.data.result.code.split(','); // 把获取到的字符串权限分割成数组
              let authorityCode = {};
              arr.forEach(item =>{
                authorityCode[item] =  true;// 把有的权限存起来
              });

              sessionStorage.setItem('authorityCode',JSON.stringify(authorityCode))
            }else{
              sessionStorage.clear(); // 清除之前存储的sessionStorage
            }

            sessionStorage.setItem("clToken", res.data.result.clToken);
          }
        });

      //手机登录
//      const data = {
//        phone: '18610056688',
//        password: '123wangsiqi'
//      };
//      //data.phone = encodeURIComponent(data.phone);
//      // 请求获取token
//      this._post('com.edb01.upms.service.LoginRegistService/1.0.0/loginByPhone',data)
//        .then((response) => {
//          console.log(response);
//          if(response.data.code == 0) {
//            //this.$router.push("/");
//
//            if(response.data.result.code){ //有权限code才存储
//              let arr = response.data.result.code.split(','); // 把获取到的字符串权限分割成数组
//              let authorityCode = {};
//              arr.forEach(item =>{
//                authorityCode[item] =  true;// 把有的权限存起来
//              });
//
//              sessionStorage.setItem('authorityCode',JSON.stringify(authorityCode))
//            }else{
//              sessionStorage.clear(); // 清除之前存储的sessionStorage
//            }
//
//            sessionStorage.setItem("clToken", response.data.result.clToken);
//
//          } else {
//            this.$message({
//              message: response.data.msg,
//              type: 'warning'
//            });
//          }
//        })
    },
  }
</script>




