<!--账号登录 贾南风-->
<template>
  <div style='padding-top:15%;height: 100%;background: #fff;box-sizing: border-box;background: url("static/img/loginBg.png");background-size: cover'>
    <!--登录-->
    <div v-if="loginType">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">

        <!--标题logo-->
        <!--<h3 class="title" style="color: #2299EE;font-size: 40px;"><img src="../assets/img/erp.png" alt=""></h3>-->

        <!--手机号登陆-->
        <div style="position: relative;z-index: 999;text-align: center">
          <span class="pass">账号登录</span>
          <span style="display:inline-block;margin: 0 60px 30px">|</span>
          <span style="font-size: 16px" @click="cutType">手机号登录</span>
        </div>

        <el-form-item  prop="companyName">
          <el-input v-model="ruleForm2.companyName" placeholder="公司名称" ref="company" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
            <img width="14" slot="prefix" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAAABGdBTUEAALGPC/xhBQAAAl1JREFUOBG1lc+LUlEUx+c9X6gJMkWL/oGivdVisEiyFrWINkEtohazETH8RT82bYLCX6QLwWbTogiiQIYmiCgrJlukLSdo2URBMU2KguKv+VzxwR3T955BwuWdc8/5fs695753VeYs/BKJxF7SlhhHFEVZ1TRtMRwO/zCTqmYJ2Wx2H8Ay4zhjeTAY+DqdTjmdTu830xrCM5nMwXa7/R7gvKqq/ng8fpECfoa71+utplKpQ0YFpsIRngBQQtwG7I1Go2UBosAH2uKlQIuir2nZyWkFJsIBn0e4wli32WwLsVhsTQbQ7892u32Bua8UeZZMJi/Icd3+Cw74CtCHJFTEClnxup4sP0Oh0DeXy+Vl7iPjAbqwHBf2NjgJt/v9/l3mn7vdbn8kEvk9LpD9QCCwyc78YpfoMuzgjhxXhFMqlbRqtbpEwiX6e9/j8Sz6fL6unGhkC32lUrlHkcuyXikUCjvr9fpjAqcJJOjvVSOQUWy082ucwwo7P6fWarWiAI9ESSOxWQzOLZEjeIKrUqWC/9JMOEsc5hu6UFV5b29gvJhFbJYL/BXtvb7tbTETzRrXrAhyuZy72+0e0HNZ2Rc+pD+6P+1pCd5qtR4BOCVB3mIfk/yJpqW2sNJ5xhpncxbKJ+FPpI1NWoILDa/XBodUBPxzjDHVtQyfSjAI/Ff48EDZsn5BHeUTfje+GO4ckacS24O9A1sT9ngeLTvMf8AcORsiNoRzdRabzeZNJp+OC2Sf+C/dl219bvT87nA4ngh7eCsKI5/P72o0Gmeovlv4//jbdDqdy8FgcLjyLToL9kUkYGj2AAAAAElFTkSuQmCC">
          </el-input>
        </el-form-item>
        <el-form-item prop="loginName">
          <el-input v-model="ruleForm2.loginName" placeholder="登录账户" ref="nameL" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;">
            <img width="14" slot="prefix" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAVCAYAAABG1c6oAAAABGdBTUEAALGPC/xhBQAAAm5JREFUOBGdlEtoU1EQhs3NDa6SVdSCj6Cg4ErpQjeCCxfZtFAqxtpNEZF0oxhjgoJYFbvJw3gDLlTQIl1oBAVR8YGPhS7cVJDia2mJBRWEgJJ3+k1xwjE3BMyBw/wz889//ntzbjwreizHcTZXq9VTrVZrF7QBj8fziX3f7/dfjEajf7qNeroVpZbJZEYRugX8xn4E/orYNuIIcdGyrN3xeHxBuObqKpjL5QZrtdpbBkVwMpFI/NYhelvp3aPXCAQC23Fa055Ey0wUM3AO/DkUCh0yxaQfi8U++ny+cZxuKZVK+3VGo0uwUCh4OT3MvhqJRKpKNCOic+RvEN1r1gW7BIvF4nqIPnrznWQz5x3Oc+hasybYJViv139ARLO1oZNs5s1mM0T+y6wJdgn+fWfvER3tJGuez+dX0Zer9FprGl2C0sDdNHs4nU4fVqJGxFZWKpVr5E2v13tZ6xq7XhtpIuYgehQncnUKxOV72Gg0joM3UdvH0zwUrrlsM1Esj1QulxfJq4iOEceI2pY4GwwGn5sFxS6HqVTqCA4uIGATn0B8wV4Ayy+1jr0HGKb2E3wmmUzOgNvrH0EeM0XnBMQrDE3xSN/bTAPAW016Hl6U6CB6TNttQZxdQmSS+zXBN3pbCb0i3/sBrs8MczkOPyncZUEaYRqPySc47WYvkc4ebg/i9Dq/+DBGHlgk8m6mId75XzERx9kNHN7F0FnJbdyNEAc5YVwK/Szbtk/zh/Ihm80OiUP5wOew+6UfMZmRfyBcvsNlxALspPayXzGdw9gr9g5xuIZiURv9Rm6HaAzI5Z3l/T3rV0jnEHwK3rgE35sJ+IQiLgsAAAAASUVORK5CYII=">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm2.password" ref="wordP" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;" auto-complete="off" placeholder="密码">
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
          <el-button type="primary" style="width:100%!important;height:45px;background-image: url('static/img/login.png');border: none" @click.native.prevent="handleSubmit2('ruleForm2')" :loading="logining"></el-button>
        </el-form-item>
      </el-form>
      <div style="color:#cccccc69;text-align: center;position: absolute;bottom: 5%;font-size: 14px;width: 100%;">Copyright © @2004-2017 京公⽹安备11010502034342号 京ICP备19016511号-1 北京圣特尔科技发展有限公司 版权所有</div>
    </div>
  </div>
</template>
<script>
  import requestLogin from '../api/api'
  export default {
    data(){
      var validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error("密码不能小于6位"));
        } else {
          callback();
        }
      };
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
      return{
        //isShow: false,
        num:0,// 记录输入次数
        loginType: true, // 切换账户登录
        logining: false, // loading
        ruleForm2: { // 保存参数
          companyName: '',
          loginName: '',
          password: ''
        },
        rules2: { // 表单验证
          companyName: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
          ],
          loginName: [
            { required: true, message: '请输入登录账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        version: '1.0.0', // 版本号
        checked: false, // 记住密码
        autoLogin: false, // 自动登录
      }
    },
    methods:{
      // 找回密码页面
      findPass() {
        this.$router.push({path: '/findPassword'})
      },
     /* handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },*/
     // 点击手机号登录 切换
      cutType() {
        this.$router.push({path: '/phonePage'})
      },
      // 登录按钮
      handleSubmit2: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (this.ruleForm2.companyName.trim() == '') {
            this.$nextTick(() => {
              this.$refs.company.focus();
            });
            return false;
          } else if (this.ruleForm2.loginName.trim() == '') {
            this.$nextTick(() => {
              this.$refs.nameL.focus();
            });
            return false;
          } else if (this.ruleForm2.password.trim() == '') {
            this.$nextTick(() => {
              this.$refs.wordP.focus();
            });
            return false;
          }
          if (valid) {
            this._post('com.edb01.upms.service.LoginRegistService/' + this.version + '/login', this.ruleForm2)
              .then((res) => {
                if (res.data.code == 0) {
                  if (res.data.result.code) { //有权限code才存储
                    let arr = res.data.result.code.split(','); // 把获取到的字符串权限分割成数组
                    let authorityCode = {};
                    arr.forEach(item => {
                      authorityCode[item] = true;// 把有的权限存起来
                    });

                    sessionStorage.setItem('authorityCode', JSON.stringify(authorityCode));
                    localStorage.setItem('authorityCode', JSON.stringify(authorityCode));
                  } else {
                    sessionStorage.clear(); // 清除之前存储的sessionStorage
                    localStorage.clear();
                  }
                  localStorage.setItem('userName', res.data.result.userName);
                  sessionStorage.setItem('clToken', res.data.result.clToken);
                  this.$router.push({path: '/Layout'});
                  // 判断用户是否选择记住密码
                  if (this.checked === true) {
                    localStorage.setItem('companyName', this.ruleForm2.companyName);
                    localStorage.setItem('loginName', this.ruleForm2.loginName);
                    localStorage.setItem('password', this.ruleForm2.password);
                  } else { //否则清除
                    localStorage.removeItem('companyName');
                    localStorage.removeItem('loginName');
                    localStorage.removeItem('password')
                  }
                  if (this.autoLogin == true) { // 是否自动登录
                    localStorage.setItem('autoLogin', true);
                    localStorage.setItem('clToken', res.data.result.clToken);
                  } else {
                    localStorage.removeItem('autoLogin');
                    localStorage.removeItem('clToken');
                  }
                } else if (res.data.success === false) {
                  if (res.data.code === 91000007) { //未绑定手机号，跳转授权页面
                    this.$router.push({
                      name: 'activateAccount',
                      params: {loginName: this.ruleForm2.loginName, companyId: res.data.result}
                    })
                    // this.$router.push('/activateAccount')
                  } else if (res.data.code === 91000008) { // 首次登录，请修改密码
                    this.$router.push({
                      name: 'setupPassword',
                      params: {loginName: this.ruleForm2.loginName, companyId: res.data.result}
                    });
                  } else if (res.data.code === 91000004) { // 密码错误 返回错误次数
                    //this.isShow = true;
                    let num = 5 - res.data.result;
                    if (res.data.result == 1 || res.data.result == 2) {
                      this.$message({
                        message: '密码输入不正确',
                        type: 'warning'
                      });
                    } else if (res.data.result < 5) {
                      this.$message({
                        message: '最多还能输入' + num + '次',
                        type: 'warning'
                      });
                    } else {
                      this.$message({
                        message: res.data.msg,
                        type: 'warning'
                      });
                    }

                    // this.num = 5 -res.data.result;
                  } else if (res.data.code === 91000006) { // 账号已锁定
                    this.$message({
                      message: '账号已锁定，请联系管理员',
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000001) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000002) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000003) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000005) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000002) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91880003) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000004) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000005) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000006) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000009) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000010) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else if (res.data.code === 91000012) {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  } else {
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
    created() {
      if(localStorage.getItem('message')){ // 有接口异常
        this.$message({
          message: localStorage.getItem('message'),
          type: 'warning'
        });
        localStorage.removeItem('message');// 删除掉
      }
    },
    mounted(){
      this.$nextTick(function () {
        if(localStorage.getItem('autoLogin')){ // 判断用户是否点击自动登录
          this.autoLogin = true;
          this._post('com.edb01.upms.service.LoginRegistService/'+ this.version + '/loginByToken')
            .then(res => {
              if(res.data.success){
                sessionStorage.setItem('clToken',res.data.result.clToken);
                sessionStorage.setItem('userName',res.data.result.userName);
//                localStorage.setItem('clToken1',encodeURIComponent(res.data.result.clToken));
                if (res.data.result.code) { //有权限code才存储
                  let arr = res.data.result.code.split(','); // 把获取到的字符串权限分割成数组
                  let authorityCode = {};
                  arr.forEach(item => {
                    authorityCode[item] = true;// 把有的权限存起来
                  });

                  sessionStorage.setItem('authorityCode', JSON.stringify(authorityCode));
                  localStorage.setItem('authorityCode', JSON.stringify(authorityCode));
                } else {
                  sessionStorage.clear(); // 清除之前存储的sessionStorage
                  localStorage.clear();
                }

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
        if (localStorage.getItem('loginName')) {
          this.ruleForm2.companyName = localStorage.getItem('companyName');
          this.ruleForm2.loginName = localStorage.getItem('loginName');
          this.ruleForm2.password = localStorage.getItem('password');
          this.checked = true
        }else{ // 否则清掉（包括浏览器保存的）
          this.ruleForm2.companyName = '';
          this.ruleForm2.loginName = '';
          this.ruleForm2.password = '';
          this.$refs.nameL.focus();
        }
      })


      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if(e && e.keyCode==13){ // enter 键
          //调接口
          this.handleSubmit2('ruleForm2');
        }
      };
    }
  }

</script>
<style scoped>
  .password{
    color: #2299EE;
    /*margin-left: 10px;*/
    cursor: pointer;
    font-size: 14px;
    position: relative;
    float: right;
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
    margin: 0 10px 35px 0;
  }

</style>
