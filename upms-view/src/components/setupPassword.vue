<!--设置密码 贾南风-->
<template>
  <div style='padding-top:250px;height: 100%;background: #fff;box-sizing: border-box;'>
    <!--找回密码-->
    <el-form  :model="ruleForm3" :rules="rules2" ref="ruleForm3" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title" style="font-size: 30px;">设置新密码</h3>
      <el-form-item prop="password">
        <el-input type="password" ref="pass" onKeypress="if(event.keyCode == 32)event.returnValue = false;" v-model="ruleForm3.password"  placeholder="新密码" @keyup.native="pwStrength(ruleForm3.password,1)" @blru.native="pwStrength(ruleForm3.password,1)" style="width: 280px;"></el-input>
        <div class="strongDiv"><div :class="{bindColor1: isShow1}">弱</div><div :class="{bindColor2: isShow2}">中</div><div style="border-right: 1px solid #A9A9A9;" :class="{bindColor3: isShow3}">强</div></div>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input type="password" onKeypress="if(event.keyCode == 32)event.returnValue = false;" v-model="ruleForm3.confirmPassword" placeholder="重新输入新密码" style="width: 280px;" @keyup.native="pwStrength(ruleForm3.confirmPassword,2)" @blru.native="pwStrength(ruleForm3.confirmPassword,2)"></el-input>
        <div class="strongDiv"><div :class="{bindColor1: isShow4}">弱</div><div :class="{bindColor2: isShow5}">中</div><div style="border-right: 1px solid #A9A9A9;" :class="{bindColor3: isShow6}">强</div></div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%!important;background: #169BD5" @click="handleSubmit2('ruleForm3')"  :loading="logining">保 存</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-dialog v-dialogDrag
        title="修改密码成功"
        :visible.sync="dialogVisible"
        width="400px">
        <div style="width: 100%;height: 110px;line-height: 110px;text-align: center">去<span style="color: #0000FF;cursor: pointer" @click="loginChange">登录</span>，{{num}}秒后自动跳转到登录页面</div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import requestLogin from '../api/api'
  export default {
    data(){
      var validatePass = (rule, value, callback) => {
        if(value == 123456){
          callback(new Error("新密码不允许设置为123456"));
        }
        if (!(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,20}$/.test(value))) {
          callback(new Error("6-20位 大小写字母、数字、特殊字符（#@._&）"));
        } else {
          callback();
        }
      };
      return{
        // 根据用户输入的密码强度显示不同的样式
        isShow1: false,
        isShow2: false,
        isShow3: false,
        isShow4: false,
        isShow5: false,
        isShow6: false,
        logining: false, // loading
        num: 3,
        dialogVisible: false, // 修改密码成功弹框
        ruleForm3: { // 保存参数
          loginName: this.$router.history.current.params.loginName, // 登录账号
          companyId: '', // 公司ID
          password: '', // 新密码
          confirmPassword: '', // 确认密码
          isAdmin: false
        },
        rules2: { // 表单验证
          confirmPassword: [
            { required: true, message: '请输入重复新密码', trigger: 'blur,focus' },
            { validator: validatePass }
          ],
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatePass }
          ]
        },
        version: '1.0.0' // 版本号
      }
    },
    methods:{
      // 设置密码失去焦点验证
      pwStrength(pwd, num) {
        if(num == 1){ // 新密码
          if (!pwd) {
            this.isShow1 = false;
            this.isShow2 = false;
            this.isShow3 = false;
          }else {
            let level = this.checkStrong(pwd);
            switch (level) {
              case 0:
                this.isShow1 = false;
                this.isShow2 = false;
                this.isShow3 = false;
              case 1:
                this.isShow1 = true;
                this.isShow2 = false;
                this.isShow3 = false;
                break;
              case 2:
                this.isShow1 = false;
                this.isShow2 = true;
                this.isShow3 = false;
                break;
              default:
                this.isShow1 = false;
                this.isShow2 = false;
                this.isShow3 = true;
            }
          }
        }else if(num == 2){ // 重新输入新密码
          if (!pwd) {
            this.isShow4 = false;
            this.isShow5 = false;
            this.isShow6 = false;
          }else {
            let level2 = this.checkStrong(pwd);
            switch (level2) {
              case 0:
                this.isShow4 = false;
                this.isShow5 = false;
                this.isShow6 = false;
              case 1:
                this.isShow4 = true;
                this.isShow5 = false;
                this.isShow6 = false;
                break;
              case 2:
                this.isShow4 = false;
                this.isShow5 = true;
                this.isShow6 = false;
                break;
              default:
                this.isShow4 = false;
                this.isShow5 = false;
                this.isShow6 = true;
            }
          }
        }
      },
      //CharMode函数
      //测试某个字符是属于哪一类.
      CharMode(iN) {
        if (iN >= 48 && iN <= 57) //数字
          return 1;
        if (iN >= 65 && iN <= 90) //大写字母
          return 2;
        if (iN >= 97 && iN <= 122) //小写
          return 4;
        else
          return 8; //特殊字符
      },

      //bitTotal函数
      //计算出当前密码当中一共有多少种模式
      bitTotal(num) {
        let modes = 0;
        for (let i = 0; i < 4; i++) {
          if (num & 1) modes++;
          num >>>= 1;
        }
        return modes;
      },

      //checkStrong函数
      //返回密码的强度级别
      checkStrong(sPW) {
        if(!sPW){
          return 0;
        }
        if (sPW.length <= 5){
          return 0; //密码太短
        }
        let Modes = 0;
        for (let i = 0; i < sPW.length; i++) {
//测试每一个字符的类别并统计一共有多少种模式.
          Modes |= this.CharMode(sPW.charCodeAt(i));
        }
        return this.bitTotal(Modes);
      },
      // 跳转到登录页面
      loginChange() {
        this.$router.push({path: '/'});
      },
      // 点击保存时的提交
      handleSubmit2(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.ruleForm3.password !== this.ruleForm3.confirmPassword){
                this.$message({
                  message: '两次输入密码不同',
                  type: 'warning'
                });
                return false;
              }
              this._post('com.edb01.upms.service.UserService/' + this.version + '/updateUserPassword',this.ruleForm3)
                .then((res) => {
                  if(res.data.result == true){
                    this.dialogVisible = true;
                    let timer = setInterval(() => {
                      this.num--;
                      if(this.num == 0){
                        this.$router.push({path: '/'});
                        clearInterval(timer);
                      }
                    },1000)
                  }else{
                    this.$message({
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
    created() {
      this.$nextTick(() => {
        this.$refs.pass.focus(); // 页面一上来获取焦点
      })
    },
    mounted(){
      // 获取上一个页面的公司ID
      if(this.$router.history.current.params.companyId){
        this.ruleForm3.companyId = this.$router.history.current.params.companyId;
      }
    }
  }

</script>
<style scoped>
  .bindColor1{
    color: #D0021B;
    border: 1px solid #D0021B!important;
  }
  .bindColor2{
    color: #F5A623;
    border: 1px solid #F5A623!important;

  }
  .bindColor3{
    color: #098AFB;
    border: 1px solid #098AFB!important;
  }
  .strongDiv {
    display: inline-block;
  }
  .strongDiv div{
    display: inline-block;
    width: 40px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #C2CBD2;
    vertical-align: middle;
    text-align: center;
    margin-right: 1px;
    border-radius: 3px;
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
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>
