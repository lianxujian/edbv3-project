<!--登录日志 贾南风-->
<template>
  <div id="loginLog">
    <div style="padding: 5px 0;">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <div class="demo-input-suffix">
              用户ID：
              <el-input
                style="width: 200px;"
                placeholder="请输入用户ID"
                v-model="loginD.userId">
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">
            <div class="demo-input-suffix">
              操作类型：
              <el-input
                style="width: 200px;"
                placeholder="请输入操作类型"
                v-model="loginD.operationType">
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="queryData()">查询</el-button>
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
          prop="clientType"
          label="客户端类型">
        </el-table-column>
        <el-table-column
          align="center"
          prop="computerName"
          label="用户电脑名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="creater"
          label="创建人">
        </el-table-column>
        <el-table-column
          align="center"
          prop="operationType"
          label="操作类型">
        </el-table-column>
        <el-table-column
          align="center"
          prop="publicIp"
          label="公网IP">
        </el-table-column>
        <el-table-column
          align="center"
          prop="clientVersion"
          label="用户客户端版本号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="userId"
          label="用户ID">
        </el-table-column>
        <el-table-column
          align="center"
          prop="mac"
          label="用户MAC地址">
        </el-table-column>
        <el-table-column
          align="center"
          prop="intranetIp"
          label="内网IP">
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0', // 版本号
        query: () => {},// 方法
        table_h: 0, // 表格的高度
        tableData: [], // 接受数据
        totalPage: 20, // 要显示的条数
        currentPage: 1, //
        totalNum: 0,
        loginD: {//提交参数
          userId: '',
          operationType: '',
          page: 1,
          size: 20
        }
      }
    },
    methods: {
      // 查询
      queryData() {
        this.loginD.page = this.currentPage;
        this.loginD.size = this.totalPage;
        this.query(this.loginD);
      },
      // 当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loginD.page = this.currentPage;
        this.loginD.size = this.totalPage;
        this.query(this.loginD);
      },
      // 每页多少条
      handleSizeChange(val) {
        //console.log(val);
        this.totalPage = val;
        this.loginD.page = this.currentPage;
        this.loginD.size = this.totalPage;
        this.query(this.loginD);
      },
    },
    created() {
    /*  if (localStorage.getItem('clToken')) {
        this.token = localStorage.getItem('clToken');
        this.loginD.clToken = this.token
      }*/
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight; // 页面高度
        var b = document.getElementById('fitTable').offsetTop;// 表格距离顶部的距离
        this.table_h = a - b - 62;
      });
      //查询方法
      this.query = (par) => {
        var self = this
        self._post('com.edb01.risk.service.api.iface.LoginLogApi/' + self.version + '/getByPage',par)
          .then(function(res) {
            if (res.data.code === 0) {
              self.tableData = res.data.result.rows;
              self.totalNum = res.data.result.total; // 总条数
              // /转换解禁时间戳并把为null的字段过滤掉
              for (var i = 0; i < self.tableData.length; i++) {
                if (self.tableData[i].createTime == null || self.tableData[i].createTime == 'null') {
                  self.tableData[i].createTime = '';
                } else {
                  var a = new Date(new Date(self.tableData[i].createTime));
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
      this.query(this.loginD)
    }
  }
</script>

<style scoped>
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  #loginLog{
    border-left: 30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 15px solid #F0F1F5;
    padding: 15px 20px;
  }

</style>
