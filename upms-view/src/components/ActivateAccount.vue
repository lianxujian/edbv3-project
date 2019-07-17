<!--激活账号 贾南风-->
<template>
  <div style='padding-top:250px;height: 100%;background: #fff;box-sizing: border-box;' id="activate">
    <el-form  :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title" style="font-size: 30px;color:#2299EE">激活账号</h3>
      <el-form-item class="form-content">
        <label >&nbsp;&nbsp;&nbsp;登录账户：</label>
        <el-input style="width: 80%;" v-model="ruleForm2.loginName"  disabled placeholder="登录账户">
        </el-input>
      </el-form-item>
      <el-form-item prop="phone" class="form-content">
        <label >绑定手机号：</label>
        <el-input style="width: 80%;" v-model="ruleForm2.phone" placeholder="绑定手机号">
        </el-input>
      </el-form-item >
      <el-form-item prop="code" class="form-content">
        <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;验证码：</label>
        <el-input type="number" v-model="ruleForm2.code" auto-complete="off"  style="width: 50%; " placeholder="手机验证码"></el-input>
        <el-button style="width: 120px!important;" @click="changeNum">获取验证码<span v-if="isShow">（{{num}}s）</span></el-button> <!--<span v-if="smsAlert" style="padding-left: 73px;color: #FF0000">已经向手机号[{{before}}*****{{after}}]发送手机验证码，请查收</span>-->
      </el-form-item>
      <el-form-item style="width:100%;">
        <div v-if="isShow" style="color: #F56C6C">已经向手机号[{{before}}*****{{after}}]发送手机验证码，请注意查收</div>
        <el-button type="primary" style="width:100%!important;background: #169BD5" @click="handleSubmit2('ruleForm2')">保存/下一步</el-button>
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
          callback(new Error('请输入密码'));
        }
        if (!(/^[0-9]\S{5}$/.test(value))) {
          callback(new Error("请输入6位的数字验证码"));
        } else {
          callback();
        }
      };
      return{
        //smsAlert: false, // 验证码提醒
        version: '1.0.0', //版本号
        num: 60, //获取验证码的时间
        // 把用户输入手机号截取显示
        before: '',
        after: '',
        isShow: false, // 用户点击获取验证码时显示
        ruleForm2: { // 保存参数
          loginName: this.$router.history.current.params.loginName, // 路由携带参数
          companyId: this.$router.history.current.params.companyId, // 路由携带参数
          phone: '',
          codeId: '',
          code: '',
        },
        rules2: { // 表单验证
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: validatePass1 }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { validator: validatePass }
          ]
        },
      }
    },
    methods:{
      // 点击获取验证码
      changeNum() {
        if(this.num != 60) {
          return false
        }
        // 发送验证码
        this._post('com.edb01.upms.service.UpmsCodeService/' + this.version + '/sendSms',{mobile: this.ruleForm2.phone, businessType: 1,loginName:this.ruleForm2.loginName,companyId:this.ruleForm2.companyId})
          .then((res) => {
            if(res.data.success == true){
              this.isShow = true;
              this.ruleForm2.codeId = res.data.result;
              this.smsAlert = true;
              this.before = this.ruleForm2.phone.substring(0,3);
              this.after = this.ruleForm2.phone.substring(7);
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
       /* this._post('com.edb01.upms.service.UserService/' + this.version + '/getValidationCode',{phone: this.ruleForm2.phone, businessType: 1,loginName:this.ruleForm2.loginName})
          .then((res) => {
              if(res.data.success == true){
                 this.isShow = true;
                 this.ruleForm2.codeId = res.data.result;
                 this.smsAlert = true;
                 this.before = this.ruleForm2.phone.substring(0,3);
                 this.after = this.ruleForm2.phone.substring(7);
                var timer = setInterval(() => {
                  this.num = this.num-1;
                  if(this.num == -1){
                    clearInterval(timer);
                    this.num = 60;
                    this.isShow = false;
                  }
                }, 1000);
               /!* this.$message({
                  message:'已经向手机号[' + this.before + '***** ' + this.after+ ']发送手机验证码，请注意查收',
                  type: 'success'
                })*!/
              }
          })*/
      },
      // 保存/下一步
      handleSubmit2(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let self = this;
              self._post('com.edb01.upms.service.UserService/' + self.version + '/bindPhone',self.ruleForm2)
              .then(function (res) {
                if(res.data.success == true){
                  self.$router.push({name: 'setupPassword',params: {loginName: self.ruleForm2.loginName,companyId: self.ruleForm2.companyId}})
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
    }
  }

</script>
<style scoped>
  .form-content{
    white-space: nowrap;
  }
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
    margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>
<style>
  .el-input__inner::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }
  .el-input__inner[type="number"]{-moz-appearance:textfield;}
  .wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-bottom: none!important;
  }
  #activate  .el-form-item__content .label label{
    width: 120px!important;
    text-align: right;
  }
  #activate .el-form-item__error{
    left: 74px;
  }
</style>
