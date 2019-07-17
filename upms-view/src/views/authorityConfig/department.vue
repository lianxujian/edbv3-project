<!--部门管理 贾南风-->
<template>
  <div style="height:100%;" id="department">
    <el-row>
      <el-col :span="companyLeft">
        <div class="grid-content bg-purple" style="border-right: 1px solid #eee">
          <el-table
            ref="box"
            :height="table_h"
            id="fitTable"
            :data="tableData"
            highlight-current-row
            @current-change="clickCurrent"
            border>
            <el-table-column
              align="center"
              type="index"
              width="60"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="companyName"
              align="center"
              label="部门管理">
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination
            style="text-align: center;"
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
      <el-col :span="treeRight" style="padding-left:30px;">
        <div class="grid-content bg-purple-light">
          <div style="width: 100%;text-align:left;margin: 10px 0;">
            <el-button size="small" icon="el-icon-plus" @click="addDepartment()">新增部门</el-button>
            <el-button size="small" type="primary" icon="el-icon-edit" @click="amendNode()">修改部门</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="delNode()">删除部门</el-button>
          </div>
          <el-tree :data="data" :props="defaultProps" highlight-current :expand-on-click-node="true"
                   @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
    </el-row>
    <!--添加部门弹层-->
    <div>
      <el-dialog v-dialogDrag
        title="添加部门"
        :visible.sync="dialogVisible"
        width="600px">
        <span>部门名称</span>
        <el-input v-model="addDep.departmentName" placeholder="请输入部门名称"
                  style="width: 300px;margin-left: 20px;"></el-input>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addName()">添 加</el-button>
  </span>
      </el-dialog>
    </div>
    <!--修改部门-->
    <div>
      <el-dialog v-dialogDrag
        title="修改部门"
        :visible.sync="dialogName"
        width="600px">
        <span>部门名称</span>
        <el-input v-model="addDep.departmentName" placeholder="请输入部门名称"
                  style="width: 300px;margin-left: 20px;"></el-input>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogName = false">取 消</el-button>
    <el-button type="primary" @click="amendAddName()">保 存</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        queryCompany: () => {
        },
        queryData: () => {
        },
        table_h: 10,
        version: '1.0.0',
        dialogVisible: false,
        dialogName: false,
        tableData: [],
        data: [],
        departmentId: '',
        companyLeft: 9, // 左边公司
        treeRight: 15, //右边部门树
        isAdmin: '', // 是否是超级用户
        companyId: '', // 普通用户的公司id
        company: {
          clToken: '',
          page: 1,
          size: 20
        },
        addDep: {   // 新增部门参数
          departmentCode: 0,
          departmentPid: '',
          departmentName: '',
          companyId: ''
        },
        totalPage: 20, // 要显示的条数
        currentPage: 1, //
        totalNum: 0,
        defaultProps: {
          children: 'nodes',
          label: 'departmentName'
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val;
        this.company.page = this.currentPage;
        this.company.size = this.totalPage;
        this.queryCompany(this.company)
      },
      // 每页多少条
      handleSizeChange(val) {
        console.log(val);
        this.totalPage = val;
        this.company.page = this.currentPage;
        this.company.size = this.totalPage;
        this.queryCompany(this.company)
      },
      // 点击部门触发的方法
      handleNodeClick(data) {
        this.addDep.departmentPid = data.departmentId;
        this.departmentId = data.departmentId;
        console.log(data);
      },
      // 点击公司触发的方法
      clickCurrent(row) {
        console.log(row);
        this.addDep.companyId = row.companyId;
        this.queryData(row.companyId);
      },
      // 点击添加部门
      addDepartment() {
        if (this.isAdmin == true && this.addDep.companyId == '') {
          return false
        } else {
          this.addDep.companyId = this.companyId;
        }
        this.addDep.departmentName = '';
          this.dialogVisible = true;
      },
      // 修改部门里的保存
      amendAddName() {
        let self = this;
        if (self.addDep.departmentName == '') {
          self.$message({
            message: '部门名称不能为空',
            type: 'warning'
          });
          return false
        }
        self._post('com.edb01.upms.service.DepartmentService/'+self.version+'/update',{departmentId: self.departmentId, departmentName: self.addDep.departmentName})
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogName = false;
              self.$message({
                message: '修改部门成功',
                type: 'success'
              });
              self.queryData(self.addDep.companyId)
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 修改部门
      amendNode() {
        let self = this;
        if (self.departmentId == '') {
          return false
        }
        self.dialogName = true
        self._post('com.edb01.upms.service.DepartmentService/'+self.version+'/get',{departmentId: self.departmentId})
          .then(function (res) {
            if (res.data.code == 0) {
              self.addDep.departmentName = res.data.result.departmentName
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 点击删除节点
      delNode() {
        let self = this
        self.$confirm('是否删除部门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self._post('com.edb01.upms.service.DepartmentService/'+self.version+'/delete',{departmentId: self.departmentId})
            .then(function (res) {
              if (res.data.code == 0) {
                self.dialogVisible = false
                self.queryData(self.addDep.companyId);
                self.$message({
                  message: '删除部门成功',
                  type: 'success'
                });
              } else {
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 添加部门
      addName() {
        let self = this;
        if (self.addDep.departmentName.trim() == '') {
          self.$message({
            message: '部门名称不能为空',
            type: 'warning'
          });
          return false
        }
        self.addDep.clToken = self.token;
        self._post('com.edb01.upms.service.DepartmentService/'+self.version+'/add',self.addDep)
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogVisible = false;
              self.queryData(self.addDep.companyId);
              self.departmentId = '';
              self.$message({
                message: '添加部门成功',
                type: 'success'
              });
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    mounted() {
      let self = this;
      // 动态获取表格高度
      self.$nextTick(function () {
        var a = document.body.clientHeight; // 页面高度
        var b = document.getElementById('fitTable').offsetTop; // 表格距离顶部的距离
        self.table_h = a - b - 90;
      });
      if (localStorage.getItem('clToken')) {
        self.token = localStorage.getItem('clToken')
      }
      if (localStorage.getItem('version')) {
        self.version = localStorage.getItem('version')
      }
      // 公司列表
      self.queryCompany = (parameter) => {
        self._post('com.edb01.upms.service.CompanyService/'+self.version+'/getByPage',parameter)
          .then(function (res) {
            if (res.data.code == 0) {
              self.tableData = res.data.result.rows;
              self.totalNum = res.data.result.total;
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }

      // 部门列表
      self.queryData = (pars) => {
        self._post('com.edb01.upms.service.DepartmentService/'+self.version+'/getAll',{companyId: pars})
          .then(function (res) {
            if (res.data.code == 0) {
              self.data = [];
              let result = res.data.result;
              self.data.push(result)
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })

      }
      // 判断是否是超级管理员
      self._post('com.edb01.upms.service.LoginRegistService/'+self.version+'/isAdmin')
        .then(function (res) {
          if (res.data.code == 0) {
            var result = res.data.result;
            self.isAdmin = result.isAdmin;
            self.companyId = result.companyId;
            // 根据用户类型判断显示的内容
            if (self.isAdmin === false) { // 普通管理员
              self.companyLeft = 0;
              self.treeRight = 24;
              self.queryData(self.companyId)
            } else {  // 超级管理员
              self.queryCompany(self.company)
            }
          } else {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
  }
</script>
<style scoped>
  #department{
  border-left: 30px solid #F0F1F5;
  border-right: 30px solid #F0F1F5;
  border-top: 15px solid #F0F1F5;
  border-bottom: 15px solid #F0F1F5;
  padding: 15px 20px;
  }
</style>
<style>
  .el-tree-node__label {
    font-size: 14px;
  }

  .el-icon-caret-right:before {
    font-size: 20px;
  }

  .el-icon-caret-right:before {
    margin-bottom: 10px;
  }
  .el-tree-node__expand-icon{
    color:#2196F3 !important;
  }
</style>
