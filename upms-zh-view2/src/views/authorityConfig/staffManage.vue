<template>
  <div style="padding: 10px">
    <!--<div style="height: 30px;width: 100%;background: #409EFF;"></div>-->
    <el-row :gutter="20" style="width:100%;">
      <el-col :span="6"><div class="grid-content bg-purple">
        <div style="width: 100%;height: 44px;background: #eee;border-bottom: 1px solid #ddd;margin-bottom: 15px;"></div>
        <el-tree :data="tableData1" :props="defaultProps" :highlight-current="true" :default-expand-all="true" :expand-on-click-node="true" @node-click="handleNodeClick"></el-tree>
      </div></el-col>
      <el-col :span="18"><div class="grid-content bg-purple">
        <div style="background: #eee">
          <div style="padding: 6px 0 6px  16px;">
            <el-row :gutter="10">
              <div style="float:left;margin-right:30px;"><div class="grid-content bg-purple">
                <span style="font-size: 14px;">员工姓名：</span>
                <el-input
                  size="small"
                  v-model="staffList.userName"
                  style="width: 150px"
                >
                </el-input>
              </div></div>
              <div style="float:left;margin-right:30px;"><div class="grid-content bg-purple">
                <span style="font-size: 14px;">登录名：</span>
                <el-input
                  size="small"
                  v-model="staffList.loginName"
                  style="width: 150px"
                >
                </el-input>
              </div></div>
              <div style="float:left;"><div class="grid-content bg-purple">
                <el-button type="primary" size="small" icon="el-icon-search" @click="queryStaffList()">查询</el-button>
              </div></div>
            </el-row>
          </div>
          <div style="padding: 10px;border-top: 1px solid #ddd">
            <el-button icon="el-icon-plus" size="small" @click="addStaff()">新增员工</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="amendStaff()">修改员工</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="delStaff()">删除</el-button>
          </div>
        </div>
        <el-table
          ref="box"
          id="fitTable"
          :height='table_h'
          :data="tableData2"
          highlight-current-row
          @current-change="handleClick"
          border>
          <el-table-column
            align="center"
            type="index"
            width="60"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="userName"
            align="center"
            label="员工姓名">
          </el-table-column>
          <el-table-column
            prop="loginName"
            align="center"
            label="员工登录名">
          </el-table-column>
          <!--<el-table-column
            prop="name"
            align="center"
            label="公司">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="部门">
          </el-table-column>
          <el-table-column
            prop="userType"
            align="center"
            label="是否默认">
          </el-table-column>-->
        </el-table>
      </div>
        <div>
          <el-pagination
            style="text-align: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <div>
      <el-dialog
        title="添加员工"
        :visible.sync="dialogVisible"
        width="600px">
        <div style="padding-left: 50px;">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="员工姓名" prop="userName">
              <el-input v-model="ruleForm.userName" style="width: 280px"></el-input>
            </el-form-item>
            <el-form-item label="员工登录名" prop="loginName">
              <el-input v-model="ruleForm.loginName" style="width: 280px"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="loginPassword">
              <el-input v-model="ruleForm.loginPassword" style="width: 280px"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="ruleForm.phone" style="width: 280px"></el-input>
            </el-form-item>
            <el-form-item label="E-mail" prop="email">
              <el-input v-model="ruleForm.email" style="width: 280px"></el-input>
            </el-form-item>
            <el-form-item label="用户类型" prop="userType">
              <el-radio-group v-model="ruleForm.userType">
                <el-radio label="200">超级管理员</el-radio>
                <el-radio label="201">普通管理员</el-radio>
                <el-radio label="202">普通用户</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="权限组" prop="groupIds">
              <el-checkbox-group v-model="ruleForm.groupIds" >
                <el-checkbox v-for="group in groups"  :label="group.privilegegroupId" :key="group.privilegegroupId">{{group.privilegegroupName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">添 加</el-button>
              <el-button @click="resetForm('ruleForm')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <!--修改员工-->
    <div>
      <el-dialog
        title="修改员工"
        :visible.sync="dialogAmend"
        width="600px">
        <div style="padding-left: 50px;">
          <el-form :model="ruleAmend" :rules="rule" ref="ruleAmend" label-width="100px" class="demo-ruleForm">
            <el-form-item label="员工姓名" prop="userName">
              <el-input v-model="ruleAmend.userName" style="width: 280px"></el-input>
            </el-form-item>
            <el-form-item label="员工登录名" prop="loginName">
              <el-input v-model="ruleAmend.loginName" style="width: 280px"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="ruleAmend.phone" style="width: 280px"></el-input>
            </el-form-item>
            <el-form-item label="E-mail" prop="email">
              <el-input v-model="ruleAmend.email" style="width: 280px"></el-input>
            </el-form-item>
            <el-form-item label="用户类型" prop="userType">
              <el-radio-group v-model="ruleAmend.userType">
                <el-radio :label="200">超级管理员</el-radio>
                <el-radio :label="201">普通管理员</el-radio>
                <el-radio :label="202">普通用户</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="权限组" prop="groupIds">
              <el-checkbox-group v-model="ruleAmend.groupIds" >
                <el-checkbox v-for="group in groups" :true-label="group.privilegegroupId"  :label="group.privilegegroupId" :key="group.privilegegroupId">{{group.privilegegroupName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitAmend('ruleAmend')">添 加</el-button>
              <el-button @click="resetAmend('ruleAmend')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import {isValidPhone,isEmail} from '../../config/validate'
  export default {
    data() {
      var validatePass=(rule, value,callback)=>{
        if (!value){
          callback(new Error('密码不能为空'));
        }else  if (value.length<6){
          callback(new Error('密码不能小于六位数'));
        }else {
          callback()
        }
      };
      var validateLogin=(rule, value,callback)=>{
        if (!value){
          callback(new Error('此项不能为空'));
        }else{
          callback()
        }
      };
      var validateEmail = (rule, value, callback) => { //
        if (value === '') {
          callback(new Error('请输入Email'));
        } else if(!isEmail(value)){
          callback(new Error('请输入正确的E-mail'))
        }else{
          callback();
        }
      };
      var validatePhone=(rule, value,callback)=>{
        if (!value){
          callback(new Error('请输入手机号'))
        }else  if (!isValidPhone(value)){
          callback(new Error('请输入正确11位手机号码'))
        }else {
          callback()
        }
      };
      return {
        queryC:()=>{},
        queryDa: () => {},
        queryGroups:()=>{},
        version:'',
        token:'',
        dialogVisible:false, // 添加员工弹层
        dialogAmend:false, // 修改员工弹层
        staffLeft:{   // 左边部门树参数
          companyId:'2B7CA39EB9644334A4570459F9029385',
          clToken:''
        },
        defaultProps: {
          children: 'nodes',
          label: 'departmentName'
        },
        staffName:'',//员工姓名
        userId:'', // 要删除员工的ID
        table_h:1,
        tableData1: [], // 部门
        tableData2: [], // 员工
        staffList:{ // 获取员工列表的参数
          clToken:'',
          departmentId:'',
          userName:'',
          loginName:'',
          page:1,
          size:20
        },
        groups:'',
        totalPage: 20, // 要显示的条数
        currentPage: 1, //
        totalNum: 0,
        ruleAmend:{},// 修改回显的字段
        update:{ // 修改提交的字段
          userId:'',
          companyId:'',
          departmentId:'',
          departmentName:'',
          userName:'',
          loginName:'',
          userType:'',
          phone:'',
          email:'',
          groupIds:'',
          clToken:''
        },
        ruleForm:{ // 添加的字段
          companyId:'',
          departmentId:'',
          departmentName:'',
          userName:'',
          userType:'200',
          loginName:'',
          loginPassword:'',
          phone:'',
          email:'',
          groupIds:[],
          clToken:''
        },
        rules: {
          userName: [
            {validator: validateLogin, trigger: 'blur' }
          ],
          loginName: [
            { validator: validateLogin, trigger: 'blur' }
          ],
          loginPassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
          phone: [
            { trigger: 'blur', validator: validatePhone }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' }
          ]
        },
        rule: {
          userType:[
            {validator: validateLogin, trigger: 'blur' }
          ],
          userName: [
            {validator: validateLogin, trigger: 'blur' }
          ],
          loginName: [
            { validator: validateLogin, trigger: 'blur' }
          ],
          phone: [
            { trigger: 'blur', validator: validatePhone }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' }
          ]
        },


      }
    },
    methods: {
      handleCurrentChange(val) {
        console.log(val)
        this.currentPage = val
        this.staffList.page = this.currentPage
        this.staffList.size = this.totalPage
        this.queryDa(this.staffList)
      },
      // 每页多少条
      handleSizeChange(val) {
        console.log(val)
        this.totalPage = val
        this.staffList.page = this.currentPage
        this.staffList.size = this.totalPage
        this.queryDa(this.staffList)
      },
      // 点击部门触发的方法
      handleNodeClick(row){
        console.log(row.companyId);
        console.log(row);
        this.ruleForm.companyId = row.companyId
        this.ruleForm.departmentId = row.departmentId
        this.ruleForm.departmentName = row.departmentName
        this.staffList.departmentId = row.departmentId
        this.queryDa(this.staffList)
      },
      // 点击查询员工列表
      queryStaffList(){
        this.staffList.page = this.currentPage
        this.staffList.size = this.totalPage
        this.queryDa(this.staffList)
      },
      // 点击员工表格行触发
      handleClick(row){
        this.update.companyId = row.companyId
        this.update.departmentId = row.departmentId
        this.update.userId = row.userId
        this.staffName = row.loginName
        this.userId = row.userId
        console.log(row);
      },
      // 点击修改员工
      amendStaff(){
        if(this.userId == ''){
          this.$message({
            message: '请选择要修改的员工',
            type: 'warning'
          });
          return false
        }
        let self = this
        self.dialogAmend = true
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.UserService/get',
          data: {userId:this.userId,clToken:this.token},
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then((res) => {
            if (res.data.code == 0) {
              self.ruleAmend = res.data.result
              console.log(self.ruleAmend.groupIds);
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })

      },
      // 点击删除员工
      delStaff(){
        if(this.userId == ''){
          this.$message({
            message: '请选择要删除的员工',
            type: 'warning'
          });
          return false
        }
        this.$confirm('是否删除员工'+this.staffName+'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            method: 'post',
            url: process.env.API_HOST + 'com.edb01.upms.service.UserService/'+this.version+'/delete',
            data: {userId:this.userId,clToken:this.token},
            transformRequest: [function (data) {
              let newData = ''
              for (var k in data) {
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
              }
              return newData
            }]
          })
            .then((res) => {
              if (res.data.code == 0) {
                this.queryDa(this.staffList)
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      // 点击新增员工按钮
      addStaff(){
        if(this.ruleForm.companyId == ''){
          this.$message({
            message: '请选择部门',
            type: 'warning'
          });
          return false
        }
        // 置空上次输入的值
        this.ruleForm.userName = ''
        this.ruleForm.loginName = ''
        this.ruleForm.phone = ''
        this.ruleForm.email = ''
        this.ruleForm.loginPassword = ''
        this.dialogVisible = true;
      },
      // 点击添加员工
      submitForm(formName) {
        let self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.ruleForm.clToken = localStorage.getItem('clToken')
            self.$axios({
              method: 'post',
              url: process.env.API_HOST + 'com.edb01.upms.service.UserService/'+self.version+'/add',
              data: self.ruleForm,
              transformRequest: [function (data) {
                let newData = ''
                for (var k in data) {
                  newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
                }
                return newData
              }]
            })
              .then((res) => {
                if (res.data.code == 0) {
                  self.dialogVisible = false
                  this.queryDa(this.staffList)
                  self.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                } else {
                  self.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 点击修改员工
      submitAmend(formName) {
        let self = this
        self.update.departmentName =  self.ruleForm.departmentName
        self.update.clToken =  localStorage.getItem('clToken')
        self.update.userName =  self.ruleAmend.userName
        self.update.loginName =  self.ruleAmend.loginName
        self.update.phone =  self.ruleAmend.phone
        self.update.email =  self.ruleAmend.email
        self.update.userType =  self.ruleAmend.userType
        self.update.groupIds =  self.ruleAmend.groupIds
        if(self.update.groupIds == ''){
          self.$message({
            message: '权限项为必填项',
            type: 'warning'
          });
          return false
        }
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.ruleForm.clToken = self.token
            self.$axios({
              method: 'post',
              url: process.env.API_HOST + 'com.edb01.upms.service.UserService/update',
              data: self.update,
              transformRequest: [function (data) {
                let newData = ''
                for (var k in data) {
                  newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
                }
                return newData
              }]
            })
              .then((res) => {
                if (res.data.code == 0) {
                  self.dialogAmend = false
                  this.queryDa(this.staffList)
                  self.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                } else {
                  self.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置修改表单
      resetAmend(formName) {
        this.$refs[formName].resetFields();
      },
      // 重置添加表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted(){

    },
    created(){
      if (localStorage.getItem('clToken')) {
        this.token = localStorage.getItem('clToken')
        this.staffLeft.clToken = this.token
        this.staffList.clToken = this.token
        console.log(this.staffLeft.clToken);
      }
      this.$nextTick(function() {
        this.table_h = $(window).height() - $('#fitTable').offset().top-40;
      })
      //获取权限组
      this.queryGroups = () => {
        let self = this
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeGroupService/list',
          data: {clToken:self.token},
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then((res) => {
            if (res.data.code == 0) {
              self.groups = res.data.result
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
      this.queryGroups()

      this.queryC = (par) => {
        let self = this
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.DepartmentService/getAll',
          data: par,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then((res) => {
            if (res.data.code == 0) {
              self.tableData1 = res.data.result.nodes
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
      this.queryC(this.staffLeft)
      this.queryDa = (par) => {
        let self = this
        if(self.staffList.departmentId == ''){
          return false
        }
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.UserService/getByPager',
          data: par,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then((res) => {
            if (res.data.code == 0) {
              self.tableData2 = res.data.result.rows
              self.totalNum = res.data.result.total
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
</script>
<style scoped>

</style>
<style >
  .el-icon-caret-right:before{
    font-size: 20px;
  }
  .el-icon-caret-right:before{
    margin-bottom: 10px;
  }
  .el-tree-node__expand-icon{
    color:#2196F3 !important;
  }
</style>
