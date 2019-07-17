<template>
  <div>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">edb管理平台系统登录</h3>
      <el-form-item prop="loginName">
        <el-input type="text" v-model="ruleForm2.loginName" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember" style="float: left">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import requestLogin from '../api/api'
  export default {
    data(){
      var checkUser = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        if (!(/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){4,19}$/.test(value))) {
          callback(new Error("用户名格式不正确"));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }
        if (!(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/.test(value))) {
          callback(new Error("输入8到16位两种以上字符"));
        } else {
          callback();
        }
      }
      return{
        logining: false,
        ruleForm2: {
          loginName: 'admin',
          password: 'admin'
        },
        rules2: {
          loginName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      }
    },
    methods:{
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            let ruleForm2 = {
              companyName: '女女公司',
              loginName: 'admin',
              password: '123456a'
            };
           let self = this
            self.$axios({
              method: 'post',
              url: process.env.API_HOST + 'com.edb01.upms.service.LoginRegistService/1.0.0/login',
              data: ruleForm2,
              transformRequest: [function(data) {
                let newData = ''
                for (var k in data) {
                  newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
                }
                return newData
              }]
            })
              .then(function (res) {
                console.log(res.data);
                if(res.data.code == 0){
                  localStorage.setItem('clToken',res.data.result.clToken)
                  self.$router.push({ path: '/Layout' });
                }else{
                  self.$message({
                    message: res.data.msg,
                    type: 'warning'
                  });
                }
              })
              .catch(function (err) {
                console.log(err);
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted(){
      /*var token=localStorage.getItem('clToken');
      if(token){
        this.$router.push({ path: '/Layout' });
      }*/
    }
  }

</script>
<style scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }

</style>
