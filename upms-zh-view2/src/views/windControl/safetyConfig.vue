<template>
  <div>
    <div style="padding: 15px 20px;">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <div class="demo-input-suffix">
              用户名：
              <el-input
                style="width: 200px;"
                placeholder="输入用户名"
                v-model="parameter.userId">
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">
            <div class="demo-input-suffix">
              用户部门：
              <el-input
                style="width: 200px;"
                placeholder="请输入部门"
                v-model="parameter.ip">
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="query()">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="padding: 0 20px;">
      <div style="height: 30px;width: 100%;background: #409EFF;"></div>
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
          align="center"
          prop="departmentName"
          label="部门名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="userSource"
          label="用户渠道">
        </el-table-column>
        <el-table-column
          align="center"
          width="80"
          label="短信验证">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.smsCheck" @click.native="clickStart(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="IP验证">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.smsCheck" @click.native="clickStart(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="userStatus"
          label="用户状态">
        </el-table-column>
        <el-table-column
          align="center"
          prop="loginName"
          label="登陆名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="userName"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          align="center"
          prop="creater"
          label="创建人">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          width="180"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <!-- <el-button  type="text" size="small">启用校验</el-button>-->
            <el-button v-if="scope.row.phone" type="text" size="small" @click="replacePhone(scope.row)">换绑手机</el-button>
            <el-button v-else type="text" size="small" @click="replacePhone(scope.row)">绑定手机</el-button>
            <el-button type="text" size="small" @click="bindWhite(scope.row)">绑定白名单</el-button>
          </template>
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
    <!--查看白名单弹框-->
    <div>
      <el-dialog
        title="查看白名单"
        :visible.sync="tan"
        width="900px"
        :before-close="handleC"
      >
        <v-white :user="userId"></v-white>
      </el-dialog>
    </div>
    <!--换绑手机-->
    <div>
      <el-dialog
        title="换绑手机"
        :visible.sync="phone"
        width="600px"
        :before-close="handlePhone"
      >
        <div style="margin-left: 30px">
          <div class="demo-input-suffix">
            <span class="span-box">
              手机号：
            </span>
            <el-input
              style="width: 200px;"
              placeholder="输入换绑手机号"
              v-model="saveP.phone">
            </el-input>
            <el-button type="primary" @click="acquirePhone()">获取验证码</el-button>
          </div>
          <div style="margin-top: 30px;">
            <div class="demo-input-suffix">
               <span class="span-box">
             手机验证码：
            </span>
              <el-input
                style="width: 200px;"
                placeholder="输入手机验证码"
                v-model="saveP.code">
              </el-input>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <div style="text-align: center;width: 100%">
            <el-button type="primary" @click="savePhone()">保 存</el-button>
            <el-button @click="phone = false">取 消</el-button>
          </div>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import white from './whitelist.vue'

  export default {
    components: {
      'v-white': white
    },
    data() {
      return {
        version: '1.0.0', // 版本号
        token: '',
        queryData: () => {
        },
        phone: false, // 替绑手机/绑定手机
        tan: false, // 查看白名单
        table_h: 0, // 表格的高度
        tableData: [],
        totalPage: 20, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 总条数
        parameter: { // 参数
          clToken: '',
          size: 20,
          page: 1
        },
        verPhone: '', // 要换绑/绑定的手机号
        saveUser: '', // 要换绑/绑定的用户ID
        verification: { // 获取验证码的参数
          phone: '',
          businessType: 1,
          ip: '192.168.60.8',
          clToken: ''
        },
        saveP: { // 保存换绑手机
          userId: '',
          phone: '',
          codeId: '',
          code: '',
          clToken: ''
        },
        userId: '' // 绑定白名单的ID
      }
    },
    methods: {
      // 点击开启短信验证
      clickStart() {

      },
      // 保存换绑手机号
      savePhone() {
        var self = this
        var reg1 = /0?(13|14|15|17|18)[0-9]{9}/ // 验证手机号
        if (!reg1.test(self.saveP.phone)) {
          self.$message({
            message: '不是有有效的手机号',
            type: 'warning'
          })
          return false
        }

        var reg = /\d{6}/
        if (!reg.test(self.saveP.code)) {
          self.$message({
            message: '验证码为六位的数字',
            type: 'warning'
          })
          return false
        }
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.UserService/' + self.version + '/bindPhone',
          data: self.saveP,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.phone = false
              self.queryData(self.parameter)
              self.$message({
                message: '手机号换绑成功',
                type: 'success'
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
      // 获取验证码
      acquirePhone() {
        var self = this
        self.verification.phone = self.saveP.phone
        if (self.verification.phone == '') {
          self.$message({
            message: '手机号为空',
            type: 'warning'
          })
          return false
        }
        if (self.verPhone == self.verification.phone) {
          self.$message({
            message: '相同的手机号',
            type: 'warning'
          })
          return false
        }
        var reg = /0?(13|14|15|17|18)[0-9]{9}/ // 验证手机号
        if (!reg.test(this.verification.phone)) {
          self.$message({
            message: '不是有有效的手机号',
            type: 'warning'
          })
          return false
        }
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.UserService/' + self.version + '/getValidationCode',
          data: self.verification,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.saveP.codeId = res.data.result
              self.$message({
                message: '验证码发送成功，请注意查收',
                type: 'success'
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
      // 换绑手机
      replacePhone(row) {
        this.verPhone = row.phone // 把当前要替换的手机号存起来
        this.saveP.userId = row.userId
        this.phone = true
      },
      // 关闭换绑弹框
      handlePhone() {
        this.phone = false
      },
      // 关闭白名单弹层
      handleC() {
        this.tan = false
      },
      // 绑定白名单
      bindWhite(row) {
        this.userId = row.userId
        this.tan = true
        console.log(row)
      },
      query() {
        var self = this
        self.parameter.page = self.currentPage
        self.parameter.size = self.totalPage
        self.queryData(self.parameter)
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
      }
    },
    created() {
      if (localStorage.getItem('clToken')) {
        this.token = localStorage.getItem('clToken');
        this.saveP.clToken = this.token
        this.parameter.clToken = this.token
        this.verification.clToken = this.token
      }
      // 动态获取表格高度
      this.$nextTick(function () {
        var a = document.body.clientHeight // 页面高度
        var b = document.getElementById('fitTable').offsetTop // 表格距离顶部的距离
        this.table_h = a - b - 40
      })
      this.queryData = (par) => {
        var self = this
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.UserAdminService/' + self.version + '/getCompanyUsers',
          data: par,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function (res) {
            if (res.data.code === 0) {
              self.tableData = res.data.result.rows
              self.totalNum = res.data.result.total // 总条数
              // createTime

              // /转换创建时间时间戳并把为null的字段过滤掉
              for (var i = 0; i < self.tableData.length; i++) {
                if (self.tableData[i].createTime == null || self.tableData[i].createTime == 'null') {
                  self.tableData[i].createTime = ''
                } else {
                  var a = new Date(new Date(self.tableData[i].createTime))
                  self.tableData[i].createTime = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds()
                }
              }
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
      this.queryData(this.parameter)
    }
  }
</script>

<style scoped>
  .span-box {
    display: inline-block;
    width: 120px;
    text-align: right;
  }

</style>
