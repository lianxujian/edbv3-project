<!--找回密码 贾南风-->
<template>
  <div style='padding-top:250px;height: 100%;background: #fff;box-sizing: border-box;' id="findPassword">
    <!--找回密码-->
    <el-form  :model="ruleForm" :rules="rules2" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title" style="font-size: 30px;">找回密码</h3>
      <el-form-item prop="phone">
        <el-input placeholder="手机号" v-model="ruleForm.phone" ref="findP">
          <i slot="prefix" class="el-input__icon el-icon-search" ></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="number" v-model="ruleForm.password" style="width: 65%; " placeholder="验证码"></el-input>
        <el-button style="width: 138px!important;" @click="changeNum">获取验证码<span v-if="isShow">（{{num}}s）</span></el-button>
      </el-form-item>
      <el-form-item style="width:100%;">
        <div v-if="isShow" style="color: #F56C6C">已经向手机号[{{before}}*****{{after}}]发送手机验证码，请注意查收</div>
        <el-button type="primary" style="width:100%!important;background: #169BD5" @click="handleSubmit2('ruleForm')" :loading="logining">下一步</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import requestLogin from '../api/api'
  export default {
    data(){
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        }
        if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        }
        if (!(/^[0-9]\S{5}$/.test(value))) {
          callback(new Error("请输入6位的数字验证码"));
        } else {
          callback();
        }
      };
      return{
        version: '1.0.0', // 版本号
        loginType: true, // 切换账户登录
        num: 60, // 手机验证码
        isShow: false, // 是否已经发送验证码
        findPass: false,
        logining: false,
        // 把用户输入手机号截取显示
        before: '',
        after: '',
        ruleForm: { // 提交参数
          loginName: '',
          phone: '',
          password: '',
          codeId: ''
        },
        rules2: { // 表单验证
          phone: [
            { required: true, message: '请输入手机号/登录账号', trigger: 'blur' },
            { validator: validatePass1}
          ],
          password: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { validator: validatePass }
          ]
        },
      }
    },
    methods:{
      // 下一步操作
      nextSave() {
        this.$router.push({path:'/setupPassword'});
      },
      // 点击获取验证码
      changeNum() {
        // 不允许重复点击
        if(this.num != 60) {
          return false;
        };
        var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if(!reg.test(this.ruleForm.phone)){ // 确保正确的手机号发送
          return false
        }
        // 发送验证码
/*

        this._post('com.edb01.upms.service.UserService/' + this.version + '/getValidationCode',{phone: this.ruleForm.phone, businessType: 1,loginName:this.ruleForm.loginName})
          .then((res) => {
            if(res.data.success == true){
              this.isShow = true;
              this.ruleForm2.codeId = res.data.result;
              this.before = this.ruleForm.phone.substring(0,3);
              this.after = this.ruleForm.phone.substring(7);
              var timer = setInterval(() => {
                this.num = this.num-1;
                if(this.num == -1){
                  clearInterval(timer);
                  this.num = 60;
                  this.isShow = false;
                }
              }, 1000);
            }
          })
*/

        this._post('com.edb01.upms.service.UpmsCodeService/' + this.version + '/repeatsendSms',{loginName: this.ruleForm.phone, businessType: 2})
          .then((res) => {
            if(res.data.success == true){
                this.ruleForm.codeId = res.data.result;
                this.isShow = true;
                  this.findPass = true;
                  this.before = this.ruleForm.phone.substring(0,3);
                  this.after = this.ruleForm.phone.substring(7);
                let timer = setInterval(() => {
                  this.num = this.num-1;
                  if(this.num == -1){
                    clearInterval(timer);
                    this.num = 60;
                    this.isShow = false;
                  }
                }, 1000);
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 切换登录方式
      cutType(bool) {
        this.loginType = bool
      },
      // 重置
     /* handleReset2() {
        this.$refs.ruleForm.resetFields();
      },*/
     //  下一步
      handleSubmit2(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._post('com.edb01.upms.service.UpmsCodeService/' + this.version + '/checkCode',{loginName:this.ruleForm.phone,codeId:this.ruleForm.codeId,code: this.ruleForm.password})
              .then( res => {
                if(res.data.success == true){
                  this.$router.push({name: 'setupPassword', params: {loginName: this.ruleForm.phone}});
                }else{
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
          }
        })
      }
    },
    created() {
      this.$nextTick(() => {
        this.$refs.findP.focus(); // 页面一上来获取焦点
      });
    },
    mounted(){
      // console.log(this.ruleForm.phone);
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
    margin:auto;
    width: 480px;
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
</style>
<style>
  #findPassword .el-input__inner::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }
  #findPassword .el-input__inner[type="number"]{-moz-appearance:textfield;}
  .wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-bottom: none!important;
  }
</style>
