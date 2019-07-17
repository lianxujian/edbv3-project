<!--手机登录 贾南风-->
<template>
  <div style='padding-top:15%;height: 100%;background: #fff;box-sizing: border-box;background: url("static/img/loginBg.png");background-size: cover'>
    <!--登录-->
    <div v-if="loginType">
      <el-form :model="ruleForm1" :rules="rules2" ref="ruleForm1" label-position="left" label-width="0px" class="demo-ruleForm login-container">

        <!--标题logo-->
        <!--<h3 class="title" style="color: #2299EE;font-size: 40px;"><img src="../assets/img/erp.png" alt=""></h3>-->

        <!--账号登陆-->
        <div style="position: relative;z-index: 999;text-align: center">
          <span style="font-size: 16px"  @click="cutType()">账号登录</span>
          <span style="display:inline-block;margin: 0 60px 30px">|</span>
          <span class="pass">手机号登录</span>
        </div>

        <el-form-item prop="phone">
          <el-input v-model="ruleForm1.phone" ref="phone" placeholder="手机号" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
            <img width="12" slot="prefix" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAYCAYAAAAlBadpAAAABGdBTUEAALGPC/xhBQAAARtJREFUOBFj7OrqKmNgYIgD4u9ATCzgZGRknMcCVB3Dyspq8/fvXylidQoKCj5+9+7dERagCd9+//5dB9SoDmS/JsIA2bdv3+4Gqv0OspkByGAGUk2lpaUnCWnu7e31+ffvnz5IHRMhxfjkRzXjCx0scqMBhiVQ8AkNXICBcxXIaUxMTML9/f2S+JwJkgNmXyFgLgQrg2XJE8BslgHEhPSCsi8IT////78vWHNJSclyoC4QhoOenh4RoIIoZmbmJUVFRe/gElBGd3d3Pc4AA2oElWtFwOIpBl0jjA+yGasBwHJtKdB/7ED5FTDFaDQTI9D6bUDB60D8Bk0SJxfoKlGgv1VYREREgl6/fu0A5HDiVI0mAYyZc2xsbJUAxKRTElgPBCgAAAAASUVORK5CYII=">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" ref="pass" v-model="ruleForm1.password" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" auto-complete="off" placeholder="密码">
            <img width="14" slot="prefix" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAYCAYAAAD6S912AAAABGdBTUEAALGPC/xhBQAAAdxJREFUOBHFlT9IAlEcx3uncnpFDW5CBFGLNNbU0uDgJkSRSyCtlzScNzo0hgqBOtggNTUUUVtRQ0sSFLVEFDQ3BG3lXRja9yd3x+vSuzcIPXi+3/v9vr/P+3tPNtSnVCqVqGEY6winOp3OFMkYYy9oThRFKamq+kE+d2FuB/ULhUIKzS5AYLBL2DeoVObgW0D7HggEVjVNa5CTL3+AgCWQdAbQeTgcXstms698QrlcjpmmWYcvgZrUdf2Cj/8CAjYM2ANgtxAu80K3De0BtLPQzkD7accl27DaPASjsFWXv1dXtbR5PugGpjHqHkZ840W9bNKQFrE0H3eAtVptDIIJjHrHC7xsSZLuKYdybZ0DbDabUXIC+GwHBdon0ti5ZHcPpVqtjuDOzbfb7VP4lkKh0CMF/Uqr1YpDc4iZJiORyBXdTYbToj2gOyf7AbziWNkX4pkgQCUYx7io214JXjGsjIGzAU0piJ8Y6Ee49ddeSX4xrHQc0BXnUPwSROP/AywWi1tURWZJe+hbsDeTviJLMPAlC80Qg3+LzlAIiGu1OVBgLpfrfrMi0IHvIQFNnGL3pRGZQT+NxTDpcdhHZxH7JPTCeADj9AkHZVnO4E+ngc50P7GIH5Oqg7XzA4yhr7DV5NxdAAAAAElFTkSuQmCC">
          </el-input><!--<div style="color:#FF0000;margin-bottom: -20px;" v-show="isShow">密码不正确,最多还能输入{{num}}次</div>-->
        </el-form-item>
        <div class="pass-box">
          <el-checkbox v-model="checked"  class="remember" style="float: left">记住密码</el-checkbox>
          <el-checkbox v-model="autoLogin"  class="remember" style="float: left;margin-left: 75px">自动登录</el-checkbox>
          <span class="password" @click="findPass()">找回密码？</span>
        </div>

        <!--登陆按钮-->
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%!important;height:45px;background-image: url('static/img/login.png');border: none" @click.native.prevent="handleSubmit('ruleForm1')" :loading="logining"></el-button>
        </el-form-item>
      </el-form>
      <div style="color:#cccccc69;text-align: center;position: absolute;bottom: 5%;font-size: 14px;width: 100%;">Copyright © @2004-2017 京公⽹安备11010502034342号 京ICP备19016511号-1 北京圣特尔科技发展有限公司 版权所有</div>
    </div>
  </div>
</template>
<script>
  import requestLogin from '../api/api' // 验证
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
        if (value.length < 6) {
          callback(new Error("密码不能小于六位"));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }
        if (!(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,20}$/.test(value))) {
          callback(new Error("6-20位，大小写字母、数字、特殊字符"));
        } else {
          callback();
        }
      };
      return{
        //isShow: false,
        autoLogin: false, // 自动登录
        num:0, // 记录输入次数
        loginType: true, // 切换账户登录
        logining: false, // loading
        ruleForm1: { // 提交参数
          phone: '',
          password: ''
        },
        rules2: { // 表单验证
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: validatePass1 }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePass }
          ]
        },
        version: '1.0.0',
        checked: false // 记住密码
      }
    },
    methods:{
      // 找回密码页面
      findPass() {
        this.$router.push({path: '/findPassword'})
      },
      // 切换登录方式
      cutType() {
        this.$router.push({path: '/'})
      },
     /* handleReset2() {
        this.$refs.ruleForm1.resetFields();
      },*/
     // 点击登录触发
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
            if(this.ruleForm1.phone.trim() == ''){
              this.$nextTick(() => {
                this.$refs.phone.focus();
              });
              return false;
            }else if(this.ruleForm1.password.trim() == ''){
              this.$nextTick(() => {
                this.$refs.pass.focus();
              });
              return false;
            }
          if (valid) {
              this._post('com.edb01.upms.service.LoginRegistService/'+ this.version +'/loginByPhone',this.ruleForm1)
              .then( (res) => {
                console.log(res.data);
                if(res.data.code == 0){
                  if(res.data.result.code){ //有权限code才存储
                    let arr = res.data.result.code.split(','); // 把获取到的字符串权限分割成数组
                    let authorityCode = {};
                    arr.forEach(item =>{
                      authorityCode[item] =  true;// 把有的权限存起来
                    });

                    sessionStorage.setItem('authorityCode',JSON.stringify(authorityCode));
                    localStorage.setItem('authorityCode', JSON.stringify(authorityCode));
                  }else{
                    sessionStorage.clear(); // 清除之前存储的sessionStorage
                    localStorage.clear();
                  }
                  sessionStorage.setItem('clToken',res.data.result.clToken);
                  localStorage.setItem('userName',res.data.result.userName);
                  this.$router.push({ path: '/Layout' });
                  // 判断用户是否选择记住密码
                  if (this.checked === true) {
                    localStorage.setItem('phone',this.ruleForm1.phone);
                    localStorage.setItem('password',this.ruleForm1.password)
                  }else{ //否则清除
                    localStorage.removeItem('phone');
                    localStorage.removeItem('password')
                  }
                  if(this.autoLogin == true){ //是否自动登录
                    localStorage.setItem('autoLogin',true);
                    localStorage.setItem('clToken',res.data.result.clToken);
                  }else{
                    localStorage.removeItem('autoLogin');
                    localStorage.removeItem('clToken');
                  }
                }else if(res.data.success === false) {
                  if(res.data.code === 91000007) { //未绑定手机号，跳转授权页面
                    this.$router.push({name: 'activateAccount',params: {loginName: this.ruleForm1.phone}})
                    // this.$router.push('/activateAccount')
                  }else if (res.data.code === 91000008) { // 首次登录，请修改密码
                    this.$router.push({name: 'setupPassword',params: {loginName: this.ruleForm1.phone}});
                  }else if (res.data.code === 91000004) { // 密码错误 返回错误次数
                    let num = 5 -res.data.result;
                    if(res.data.result == 1 || res.data.result == 2){
                      this.$message({
                        message: '密码输入不正确',
                        type: 'warning'
                      });
                    }else if(res.data.result < 5){
                      this.$message({
                        message: '最多还能输入' + num + '次',
                        type: 'warning'
                      });
                    }else{
                      this.$message({
                        message: res.data.msg,
                        type: 'warning'
                      });
                    }

                    /*this.isShow = true;
                    this.num = 5 -res.data.result;*/
                  }else if (res.data.code === 91000006) { // 账号已锁定
                    this.$message({
                      message: '账号已锁定，请联系管理员',
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000001){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000002){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000003){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000005  ){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000002){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91880003){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000004){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000005){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000006){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000009){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000010){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else if(res.data.code === 91000012){
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }else{
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }
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
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if(e && e.keyCode==13){ // enter 键
          //调接口
          this.handleSubmit('ruleForm1');
        }
      };



      this.$nextTick(function () {
        if(localStorage.getItem('autoLogin')){ // 判断用户是否点击自动登录
          this.autoLogin = true;
          this._post('com.edb01.upms.service.LoginRegistService/'+ this.version + '/loginByToken')
            .then(res => {
              if(res.data.success == true){
                if(res.data.result.code){ //有权限code才存储
                  let arr = res.data.result.code.split(','); // 把获取到的字符串权限分割成数组
                  let authorityCode = {};
                  arr.forEach(item =>{
                    authorityCode[item] =  true;// 把有的权限存起来
                  });

                  sessionStorage.setItem('authorityCode',JSON.stringify(authorityCode))
                  localStorage.setItem('authorityCode', JSON.stringify(authorityCode));
                }else{
                  sessionStorage.clear(); // 清除之前存储的sessionStorage
                  localStorage.clear();
                }
                sessionStorage.setItem('clToken',res.data.result.clToken);
                this.$router.push({ path: '/Layout' });
              }else if(res.data.success == false){
                if(res.data.code === 91000007) { //未绑定手机号，跳转授权页面
                  this.$router.push({path: '/'})
                }else if (res.data.code === 91000008) { // 首次登录，请修改密码
                  this.$router.push({path: '/'});
                }
              }
            });
        }
        // 判断用户是否记住密码
        if (localStorage.getItem('phone')) {
          this.ruleForm1.phone = localStorage.getItem('phone');
          this.ruleForm1.password = localStorage.getItem('password');
          this.checked = true
        }else{ // 否则清掉（包括浏览器保存的）
          this.ruleForm1.phone = '';
          this.ruleForm1.password = ''
        }
      });


    }
  }

</script>
<style scoped>
  .password{
    color: #2299EE;
    /*margin-left: 20px;*/
    cursor: pointer;
    font-size: 14px;
    float: right;
    position: relative;
    z-index: 999;
  }
  .pass{
    color: #2299EE;
    cursor: pointer;
    font-size: 16px;
  }
  .pass-box{
    width: 100%;
    margin-top: 30px;
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    float: right;
    margin-right: 12%;
    width: 432px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    /*border: 1px solid #eaeaea;*/
    /*box-shadow: 0 0 25px #cac6c6;*/
  }
  .title {
    margin: 0 auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0 0 35px 0;
  }

</style>
