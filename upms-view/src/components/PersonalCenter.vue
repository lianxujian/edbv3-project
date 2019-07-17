<!--个人中心 贾南风-->
<template>
  <div id="personalCenter" :style="'height:' + box_h + 'px'">
    <div class="navBar1">
      <div style="height: 50px;line-height: 50px;margin-left: 10px;">
      <img id="a" src="../../static/css/img/touxiang.png" style="width: 40px;vertical-align: middle;cursor: pointer"/><!-- @click="$router.go(-1)"-->
      <h5 style="display: inline-block;margin-left:10px;">个人中心</h5>
      </div>
    </div>
    <div class="msg-box">基本信息</div>
    <div>
      <div class="box-wrapper"><span class="title-left">登录账号：</span><span>{{personalText.loginName}}</span></div>
      <div class="box-wrapper"><span class="title-left">姓名：</span><span>{{personalText.userName}}</span></div>
      <div class="box-wrapper"><span class="title-left">所属部门：</span><span>{{personalText.departmentName}}</span></div>
      <div class="box-wrapper"><span class="title-left">上次登录时间：</span><span>{{personalText.loginTime}}</span></div>
    </div>
    <div class="msg-box">修改登录密码<span class="amend" @click="amendPass">修改</span></div>
    <!--修改密码-->
    <div class="box-wrapper" v-if="isShowPass">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input  type="password" v-model="ruleForm.oldPassword" ref="original" @paste.native="methodTest(1)" style="width: 260px" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" @paste.native="methodTest(2)" style="width: 260px" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="confirmPassword">
          <el-input type="password" v-model="ruleForm.confirmPassword" @paste.native="methodTest(3)" style="width: 260px" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelAmend('ruleForm')">取 消</el-button>
          <el-button style="margin-left: 55px;" type="primary"  @click="submitForm('ruleForm')">保 存</el-button><!--@click="submitForm('ruleForm')"-->
        </el-form-item>
      </el-form>
    </div>
    <div class="msg-box">绑定手机号({{before}}****{{after}}）<span class="amend" @click="amendPhone">修改</span></div>
    <!--修改手机号-->
    <div class="box-wrapper" v-if="isUnbind">
      <!--密码-->
      <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
        <el-form-item label="请输入密码" prop="password">
          <el-input type="password" v-model="ruleForm1.password" style="width: 260px" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelPhone('ruleForm1')">取 消</el-button>
          <el-button style="margin-left: 55px;" type="primary" @click="submitForm1('ruleForm1')">确 定</el-button><!--@click="submitForm1('ruleForm1')"-->
        </el-form-item>
      </el-form>
    </div>
    <div class="box-wrapper" v-if="showUnbind">
      <!--手机号-->
      <el-form  :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="新手机号" prop="phone">
          <el-input v-model="ruleForm2.phone" style="width: 270px"></el-input>
        </el-form-item>
        <el-form-item v-if="false" label="新手机号" prop="phone">
          <el-input v-model="ruleForm2.phone" style="width: 260px" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm2.code" style="width: 158px" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"></el-input>
          <el-button style="width: 110px!important;" @click="changeNum">获取验证码<span v-if="isShow">（{{num}}s）</span></el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 160px;" type="primary" @click="submitForm2('ruleForm2')">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--订单处理  樊虎-->
    <div v-if="false" style="margin-top:20px;">
      <el-button @click="jumpTerm(1)">待客审</el-button>
      <el-button @click="jumpTerm(2)">待仓审</el-button>
      <el-button @click="jumpTerm(3)">平台异常单</el-button>
      <el-button @click="jumpTerm(4)">仓库异常单</el-button>
      <el-button @click="jumpTerm(5)">待发货</el-button>
      <el-button @click="jumpTerm(6)">待处理售后</el-button>
      <el-button @click="closeCurrentTab">关闭当前tab</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    /*
    * if (!(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/.test(value))) {
          callback(new Error("输入8到16位两种以上字符"));
        } else {
          callback();
        }
*/
    data() {
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
     /* var validatePass = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error("密码不能小于6位"));
        } else {
          callback();
        }
      };*/
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        }
        if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))) {
          callback(new Error("输入正确的手机号"));
        } else {
          callback();
        }
      };
      var validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        }
        if (!(/^\d{6}\b/.test(value))) {
          callback(new Error("手机号验证码输入不正确"));
        } else {
          callback()
        }
      };
      return {
        isShowPass: false, // 是不修改密码
        isShow: false,
        isUnbind: false, // 是否解绑
        showUnbind: false, // 手机验证码
        version: '1.0.0',
        getData: () => {},
        num: 60,
        box_h: 0,
        // 修改密码
        ruleForm: {
          loginName: '', // 登录名
          oldPassword: '', // 旧密码
          confirmPassword: '', // 确认密码
          password: '', // 新密码
          isAdmin: false,
          companyId:'', //部门id
        },

        personalText: '', // 个人中心内容
        ruleForm1: { // 密码参数
          password: ''
        },
        ruleForm2: { //保存参数
          loginName: '',
          phone: '',
          codeId: '',
          code: '',
        },
        // 把用户输入手机号截取显示
        before: '',
        after: '',
        before1: '',
        after1: '',
        rules: {// 表单验证
          oldPassword: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatePass }
            ],
          confirmPassword: [
            { required: true, message: '请重新输入新密码', trigger: 'blur' },
            { validator: validatePass }
          ],
        },
        rules1: { // 表单验证
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePass }
          ],
        },
        rules2: {  // 表单验证
          phone: [
            { required: true, message: '请输入手机号', trigger: 'change' },
            { validator: validatePhone }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { validator: validateCode }
          ]
        }
      };
    },
    methods:{
      // 修改登录密码的取消
      cancelAmend(formName){
        //onsole.log(process.env.BASE_API,process.env.FILE_API);
        this.$refs[formName].resetFields();
        this.isShowPass = false;
      },
      // 绑定手机号的取消
      cancelPhone(formName){
        this.$refs[formName].resetFields();
        this.isUnbind = false;
      },
      // 首页跳转
      jumpTerm(item){
        switch(item){
          case 1:
            $(parent.document.querySelector('#hospitalityTrial')).click();
            var parentDom = $(parent.document.querySelector('#content-main')).children('.J_iframe:visible');
            if($(parentDom)[0].contentWindow.document.querySelector('.fh-order1')){
              $(parentDom)[0].contentWindow.document.querySelector('.fh-order1').click();
            }
            $(parentDom)[0].onload = function(){
              $(parentDom)[0].contentWindow.document.querySelector('.fh-order1').click();
            }
            break;//待客审
          case 2:
            $(parent.document.querySelector('#toWarehouse')).click();
            var parentDom = $(parent.document.querySelector('#content-main')).children('.J_iframe:visible');
            if($(parentDom)[0].contentWindow.document.querySelector('.fh-order2')){
              $(parentDom)[0].contentWindow.document.querySelector('.fh-order2').click();
            }
            $(parentDom)[0].onload = function(){
              $(parentDom)[0].contentWindow.document.querySelector('.fh-order2').click();
            }
            break;//待仓审
          case 3:
            $(parent.document.querySelector('#ExceptionOrder')).click();
            break;//平台异常单
          case 4:
            $(parent.document.querySelector('#warehouseOrder')).click();
            break;//仓库异常单
          case 5:
            $(parent.document.querySelector('#toSendGoods')).click();
            break;//待发货
          case 6:
            $(parent.document.querySelector('#toAfterSale')).click();
            break;//待处理售后
        }
      },
      // 首页跳转 测试（关闭）
      closeCurrentTab(){
        $(parent.document.querySelector('.active.J_menuTab')).find('i').click();
      },

      // 粘贴事件 修改密码
      methodTest(num) {
        let reg = /^[\u4e00-\u9fa5]/;
        if(num == 1){
          let trimer = setTimeout(() => { // 粘贴之后再去获取
            if(reg.test(this.ruleForm.oldPassword)){
              this.ruleForm.oldPassword = '';
            }
          },100);
        }else if(num == 2){
          let trimer = setTimeout(() => {
            if(reg.test(this.ruleForm.password)){
              this.ruleForm.password = '';
            }
          },100);
        }else if(num == 3){
          let trimer = setTimeout(() => {
            if(reg.test(this.ruleForm.confirmPassword)){
              this.ruleForm.confirmPassword = '';
            }
          },100);
        }
      },
      // 换绑手机的修改按钮
      amendPhone() {
        if(this.num == 60){ // 确定60秒之后修改
          this.isUnbind = !this.isUnbind;
          this.showUnbind = false;
        }else{
          return false;
        }

      },
      // 修改密码的修改按钮
      amendPass() {
        this.isShowPass = !this.isShowPass;
        this.$nextTick(() => {
          this.$refs.original.focus();
        })
      },
      // 处理时间戳
      turnSingle(num) {
        return num < 10 ? '0' + num : num
      },
      // 修改密码成功后跳到login
      nextPage(){
        let url = 'http://' + process.env.FILE_API;
        window.parent.location.href = url;
      },
      // 换绑成功进入手机号登录
      nextPage1(){
        window.parent.location.href = 'http://www.edbv3.com/#/phonePage';
      },
      // 点击获取验证码
      changeNum() {
        // 不允许重复点击
        if(this.num != 60) {
          return false
        }
        var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if(!reg.test(this.ruleForm2.phone)){ // 确保正确的手机号发送
          return false
        }

        if(this.ruleForm2.phone == this.personalText.phone){ // 换绑的手机号和现在的一样
            this.$message({
              message: '当前账号已绑定手机号，请输入新的手机号',
              type: 'warning'
            });
          return false;
        }
        // 发送验证码
        this._post('com.edb01.upms.service.UpmsCodeService/' + this.version + '/sendSms',{mobile: this.ruleForm2.phone, businessType: 1}) //loginName: this.personalText.loginName,
          .then((res) => {
            if(res.data.success == true){
              this.isShow = true;
              let timer = setInterval(() => {
                this.num = this.num-1;
                if(this.num == -1){
                  clearInterval(timer);
                  this.num = 60;
                  this.isShow = false;
                }
              }, 1000);
               this.ruleForm2.codeId = res.data.result;
              this.before1 = this.ruleForm2.phone.substring(0,3);
              this.after1 = this.ruleForm2.phone.substring(7);
              this.$message({
                message:'已经向手机号[' + this.before1 + '***** ' + this.after1 + ']发送手机验证码，请注意查收',
                type: 'success'
              })
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 修改登录密码的保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.password !== this.ruleForm.confirmPassword){
              this.$message({
                message: '两次输入密码不同',
                type: 'warning'
              });
              return false;
            }else{
              this._post('com.edb01.upms.service.UserService/' + this.version + '/updateUserPassword',this.ruleForm)
                .then( res => {
                  if(res.data.success == true){
                    this.$message({
                      message: '修改密码成功',
                      type: 'success'
                    });
                    this.isShowPass = false;
                    this.$refs[formName].resetFields(); //  重置表单
                    //this.$router.push({path: '/'});
                    this.nextPage();
                  }else{
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }
                })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 绑定手机号的密码验证
      submitForm1(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this._post('com.edb01.upms.service.UserService/' + this.version + '/checkPwd',this.ruleForm1)
               .then( res => {
                 if(res.data.success == true){
                   if(res.data.result == false){
                     this.$message({
                       message: '密码不正正确',
                       type: 'warning'
                     });
                     return false;
                   }
                   this.isUnbind = false;
                   this.showUnbind = true;
                   //this.$refs['ruleForm2'].resetFields();
                 }else{
                   this.$message({
                     message: res.data.msg,
                     type: 'warning'
                   });
                 }
               })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 换绑手机的保存
      submitForm2(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let self = this;
            self._post('com.edb01.upms.service.UserService/' + self.version + '/bindPhone',self.ruleForm2)
              .then(function (res) {
                if(res.data.success == true){
                  //self.before = self.ruleForm2.phone.substring(0,3);
                  //self.after = self.ruleForm2.phone.substring(7);
                  // this.$router.push({path: '/phonePage'});
                  //self.nextPage1();
                  self.$message({
                    message: '绑定手机号成功',
                    type: 'success'
                  });
                  self.getData();
                  self.ruleForm1.password = '';
                  self.showUnbind = false;
                  self.$refs[formName].resetFields(); //  重置表单
                }else{
                  self.$message({
                    message: res.data.msg,
                    type: 'warning'
                  });
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    created() {
      // 动态获取高度
      this.$nextTick(function () {
        var a = document.body.clientHeight;
        var b = document.getElementById('personalCenter').offsetTop;
        this.box_h = a - b;
      });
      this.getData = () => {
        this._post('com.edb01.upms.service.UserService/' + this.version + '/get',{userId: ''})
          .then( res => {
            if(res.data.success == true){
              this.personalText = res.data.result;
              let a = new Date(new Date(this.personalText.loginTime));
              this.personalText.loginTime = a.getFullYear() + '-' + this.turnSingle(a.getMonth() + 1) + '-' + this.turnSingle(a.getDate())+' '+this.turnSingle(a.getHours())+':'+this.turnSingle(a.getMinutes())+':'+this.turnSingle(a.getSeconds());
              this.ruleForm.loginName = this.personalText.loginName;
              this.ruleForm2.loginName = this.personalText.loginName;
              this.before = this.personalText.phone.substring(0,3);
              this.after = this.personalText.phone.substring(7);
              this.ruleForm.companyId=this.personalText.companyId;//公司
            }else{
              this.$message({
                message: res.data.msg,
                type:'warning'
              })
            }
          })
      }

      this.getData();

    },
  }
</script>
<style scoped>
  #personalCenter .navBar1{
    height: 50px;
    margin-bottom: -10px;
    background: -webkit-linear-gradient(to right, #EAEAF2,#5D6D7C); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(to right, #EAEAF2,#5D6D7C); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(to right, #EAEAF2,#5D6D7C); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #EAEAF2,#5D6D7C); /* 标准的语法 */
  }
  #personalCenter {
    border-left: 30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 15px solid #F0F1F5;
    padding: 15px 20px;
  }

  #personalCenter .title-left {
    display: inline-block;
    width: 100px;
    text-align: right;
  }

  #personalCenter .box-wrapper {
    padding-left: 80px;
    margin: 20px;
  }

  #personalCenter .msg-box {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #eee;
    padding-left: 10px;
    font-weight: bold;
    margin-top: 20px;
  }
  #personalCenter .amend{
    margin-left: 50px;
    color: #3CA2EE;
    cursor: pointer;
  }
</style>
