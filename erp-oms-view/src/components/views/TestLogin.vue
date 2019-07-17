<!--尘音 首页-->
<template>
  <div id="index">
    {{loginStatus}}！
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loginStatus:'未登录'
      }
    },
    mounted(){

      //账号登录
      let ruleForm2 = {
        companyName: '连晋公司3',
        loginName: 'admin',
        password: '1234!@#$'
      };

      //console.log(ruleForm2);
      this._post('com.edb01.upms.service.LoginRegistService/1.0.0/login',ruleForm2)
        .then( (res) => {
          if (res.data.success) {
            this.loginStatus = '登录成功';
            if(res.data.result.code){ //有权限code才存储
              let arr = res.data.result.code.split(','); // 把获取到的字符串权限分割成数组
              let authorityCode = {};
              arr.forEach(item =>{
                authorityCode[item] =  true;// 把有的权限存起来
              });
              sessionStorage.setItem("clToken", res.data.result.clToken);
              sessionStorage.setItem('authorityCode',JSON.stringify(authorityCode));
              localStorage.setItem('authorityCode',JSON.stringify(authorityCode));
            }else{
              sessionStorage.clear(); // 清除之前存储的sessionStorage
              localStorage.clear();
            }
          }
        });

     /* //手机登录
      const data = {
        phone: '13552375417',
        password: 'fanhu123'
      };
      // 请求获取token
      this._post('com.edb01.upms.service.LoginRegistService/1.0.0/loginByPhone',data)
        .then((response) => {
          console.log(response);
          if(response.data.code == 0) {
            //this.$router.push("/");
            this.loginStatus = '登录成功';

            if(response.data.result.code){ //有权限code才存储
              let arr = response.data.result.code.split(','); // 把获取到的字符串权限分割成数组
              let authorityCode = {};
              arr.forEach(item =>{
                authorityCode[item] =  true;// 把有的权限存起来
              });

              //document.cookie='authorityCode='+JSON.stringify(authorityCode);
              sessionStorage.setItem('authorityCode',JSON.stringify(authorityCode))
              localStorage.setItem('authorityCode',JSON.stringify(authorityCode))
            }else{
              sessionStorage.clear(); // 清除之前存储的sessionStorage
              localStorage.clear(); // 清除之前存储的sessionStorage
            }

            sessionStorage.setItem("clToken", response.data.result.clToken);
            localStorage.setItem("clToken", response.data.result.clToken);

          } else {
            this.loginStatus = response.data.msg;
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })*/
    },
  }
</script>




