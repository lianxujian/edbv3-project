<template>
  <div>
    <div style="padding: 5px 22px;">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="9">
          <div class="grid-content bg-purple">
            <div class="demo-input-suffix">
              用户ID：
              <el-input
                style="width: 220px;"
                placeholder="输入用户ID"
                v-model="parameter.userId">
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple-light">
            <div class="demo-input-suffix">
              用户IP：
              <el-input
                style="width: 220px;"
                placeholder="输入用户IP"
                v-model="parameter.ip">
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <el-button type="primary"  @click="query()">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="padding: 0 20px;">
      <div style="height: 40px;width: 100%;background: #409EFF;">
        <ul class="ul-box">
          <li @click="addT()" style="margin-left: -22px" >添加</li>
        </ul>
      </div>
      <el-table
        ref="box"
        id="fitTable"
        :height="table_h"
        :data="tableData"
        border>
        <el-table-column
          align="center"
          width="60"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          width="180"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="DelClick(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="amendData(scope.row)" type="text" size="small">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="id"
          label="白名单ID">
        </el-table-column>
        <el-table-column
          align="center"
          prop="userId"
          label="用户ID">
        </el-table-column>
        <el-table-column
          align="center"
          prop="ip"
          label="IP地址">
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
    <!--添加白名单-->
    <div>
      <el-dialog
        title="添加白名单"
        :visible.sync="dialogVisible"
        width="600px"
        :before-close="handleClose"
        append-to-body>
        <div class="grid-content bg-purple" style="margin:0 0  30px 128px;" >
          <div class="demo-input-suffix">
            用户ID：
            <el-input
              style="width: 200px;"
              placeholder="请输入用户ID"
              v-model="addData.userId">
            </el-input>
          </div>
        </div>
        <div class="grid-content bg-purple" style="margin-left: 130px;">
          <div class="demo-input-suffix">
            用户IP：
            <el-input
              style="width: 200px;"
              placeholder="请输入 用户IP"
              v-model="addData.ip">
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
           <div style="text-align: center;width: 100%">
          <el-button type="primary" @click="addD()">添 加</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
           </div>
       </span>
      </el-dialog>
    </div>
    <!--修改白名单-->
    <div>
      <el-dialog
        title="修改白名单"
        :visible.sync="amend"
        width="700px"
        :before-close="handleC"
        append-to-body>
        <div class="grid-content bg-purple" style="margin-bottom: 30px;">
          <div class="demo-input-suffix">
            <span class="span-box">
               用户ID：
            </span>
            <el-input
              style="width: 200px;"
              placeholder="请输入用户ID"
              v-model="amendD.userId">
            </el-input>
          </div>
        </div>
        <div class="grid-content bg-purple">
          <div class="demo-input-suffix">
             <span class="span-box">
             白名单IP：
            </span>
            <el-input
              style="width: 200px;"
              placeholder="请输入白名单IP"
              v-model="amendD.ip">
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="amend = false">取 消</el-button>
    <el-button type="primary" @click="saveAmendData()">保存</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['user'],
    data() {
      return {
        queryData: () => {
        },
        table_h: 400, // 表格的高度
        tableData: [],
        input2: '',
        totalPage: 20, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 总条数
        dialogVisible: false, // 弹框显示隐藏
        version: '1.0.0', // 版本号
        token: '',
        addData: { // 添加白名单的字段
          userId: '',
          ip: '',
          clToken: ''
        },
        parameter: { // 参数
          userId: this.user,
          id: '',
          ip: '',
          size: 20,
          page: 1,
          clToken: ''
        },
        amend: false,
        amendD: {
          id: '',
          userId: '',
          ip: '',
          clToken: ''
        }
      }
    },
    methods: {
      query() {
        var self = this
        self.parameter.page = self.currentPage
        self.parameter.size = self.totalPage
        self.queryData(self.parameter)
      },
      // 保存修改的数据
      saveAmendData() {
        var self = this
        if (self.amendD.userId === '') {
          self.$message({
            type: 'warning',
            message: '请输入用户ID'
          })
          return false
        }

        if (self.amendD.ip === '') {
          self.$message({
            type: 'warning',
            message: '请输入用户IP'
          })
          return false
        }
        // IP正则验证
        var reg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
        if (!reg.test(self.amendD.ip)) {
          self.$message({
            type: 'warning',
            message: '请输入正确用户IP'
          })
          return false
        }

        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.risk.service.api.iface.WhiteIpApi/' + self.version + '/update',
          data: self.amendD,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function(res) {
            if (res.data.code === 0) {
              self.amend = false // 关闭弹框
              self.queryData(self.parameter)
              self.$message({
                type: 'success',
                message: '添加成功!'
              })
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
        console.log(1)
      },
      // 添加白名单数据
      addD() {
        var self = this
        if (self.addData.userId === '') {
          self.$message({
            type: 'warning',
            message: '请输入用户ID'
          })
          return false
        }
        if (self.addData.ip === '') {
          self.$message({
            type: 'warning',
            message: '请输入用户IP'
          })
          return false
        }
        self.parameter.userId = self.user
        self.parameter.page = self.currentPage
        self.parameter.size = self.totalPage
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.risk.service.api.iface.WhiteIpApi/' + self.version + '/insert',
          data: self.addData,
          transformRequest: [function(data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function (res) {
            if (res.data.code === 0) {
              self.dialogVisible = false // 关闭弹框
              self.queryData(self.parameter)
              self.$message({
                type: 'success',
                message: '添加成功!'
              })
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 修改并弹框
      amendData(row) {
        this.amend = true
        this.amendD.id = row.id
        this.amendD.userId = row.userId
        this.amendD.ip = row.ip
      },
      // 添加并弹框
      addT() {
        this.addData.ip = ''
        this.addData.userId = ''
        this.dialogVisible = true
      },
      // 关闭修改弹层
      handleC() {
        this.amend = false
      },
      // 关闭添加弹框
      handleClose() {
        this.dialogVisible = false
      },
      // 当前页
      handleCurrentChange(val) {
        console.log(val)
        this.currentPage = val
        this.parameter.page = this.currentPage
        this.parameter.size = this.totalPage
        this.queryData(this.parameter)
      },
      // 每页多少条
      handleSizeChange(val) {
        console.log(val)
        this.totalPage = val
        this.parameter.page = this.currentPage
        this.parameter.size = this.totalPage
        this.queryData(this.parameter)
      },
      // 单条删除数据
      DelClick(row) {
        console.log(row)
        var self = this
        self.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$axios({
            method: 'get',
            url: process.env.API_HOST + 'com.edb01.risk.service.api.iface.WhiteIpApi/' + self.version + '/deleteById?id=' + row.id + '&clToken=' + self.token
          })
            .then(function(res) {
              if (res.data.code === 0) {
                self.queryData(self.parameter)
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else {
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    watch: {
      user: function(newUser) {
        this.parameter.userId = newUser
        this.queryData(this.parameter)
      }
    },
    created() {
      if (localStorage.getItem('clToken')) {
        this.token = localStorage.getItem('clToken');
        this.parameter.clToken = this.token
        this.addData.clToken = this.token
        this.amendD.clToken = this.token

      }
      var parameter = {
        userId: this.user,
        size: this.totalPage,
        page: this.currentPage,
        clToken: this.token
      }
      this.queryData = (par) => {
        var self = this
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.risk.service.api.iface.WhiteIpApi/' + self.version + '/getByPage',
          data: par,
          transformRequest: [function(data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function(res) {
            if (res.data.code === 0) {
              self.tableData = res.data.result.rows
              self.totalNum = res.data.result.total // 总条数
              console.log(self.tableData)
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
      // 调用
      this.queryData(parameter)
    }
  }
</script>

<style scoped>
  ol, ul {
    list-style: none;
  }

  .ul-box {
    line-height: 40px;
    color: #fff;
    cursor: pointer;
  }

  .span-box {
    display: inline-block;
    width: 120px;
    text-align: right;
  }

</style>
