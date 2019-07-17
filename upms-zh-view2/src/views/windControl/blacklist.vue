<template>
  <div>
    <div style="padding: 20px  20px 0 20px;">
      <div style="height: 30px;width: 100%;background: #409EFF;"></div>
      <el-table
        ref="box"
        id="fitTable"
        :height="table_h"
        :data="tableData"
        border>
        <el-table-column
          align="center"
          type="index"
          width="60"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="ip"
          label="封禁IP">
        </el-table-column>
        <el-table-column
          align="center"
          prop="banTime"
          label="封禁时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="unbanTime"
          label="解封时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="type"
          label="封禁类型">
        </el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          width="180"
          align="center"
          label="是否封禁">
          <template slot-scope="scope">
            <span  v-if="scope.row.isBan == 2" type="text" size="small">正常</span>
            <span  v-else type="text" size="small">封禁</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isBan == 1" @click="handleClick(scope.row)" type="text" size="small">解封</el-button>
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0', // 版本号
        token: '',
        queryD: () => {
        },
        table_h: 0, // 表格的高度
        tableData: [], // 表格信息
        input2: '',
        totalPage: 20, // 要显示的条数
        currentPage: 1, //
        totalNum: 0,
        pager: {
          page: 1,
          size: 20,
          clToken: ''
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        console.log(val)
        this.currentPage = val
        this.pager.page = this.currentPage
        this.pager.size = this.totalPage
        this.queryD(this.pager)
      },
      // 每页多少条
      handleSizeChange(val) {
        console.log(val)
        this.totalPage = val
        this.pager.page = this.currentPage
        this.pager.size = this.totalPage
        this.queryD(this.pager)
      },
      // 解封
      handleClick(row) {
        var self = this
        self.$confirm('是否解封?', '提示', {
          confirmButtonText: '解封',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$axios({
            method: 'post',
            url: process.env.API_HOST + 'com.edb01.risk.service.api.iface.BlackIpApi/' + self.version + '/unbanByIp?ip=' + row.ip + '&clToken=' + self.token
          })
            .then((res) => {
              if (res.data.code == 0) {
                self.queryD(self.pager)
                self.$message({
                  message: '解封成功',
                  type: 'success'
                })
              } else {
                self.$message({
                  message: 'res.data.msg',
                  type: 'warning'
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '取消解封'
          })
        })
      }
    },
    created() {
      if (localStorage.getItem('clToken')) {
        this.token = localStorage.getItem('clToken');
        this.pager.clToken = this.token
      }
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight // 页面高度
        var b = document.getElementById('fitTable').offsetTop // 表格距离顶部的距离
        this.table_h = a - b - 30
      })
      this.queryD = (par) => {
        var self = this
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.risk.service.api.iface.BlackIpApi/' + self.version + '/getByPage',
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
              self.totalNum = res.data.result.total

              // /转换解禁时间戳并把为null的字段过滤掉
              for (var i = 0; i < self.tableData.length; i++) {
                if (self.tableData[i].unbanTime == null || self.tableData[i].unbanTime == 'null') {
                  self.tableData[i].unbanTime = ''
                } else {
                  var a = new Date(new Date(self.tableData[i].unbanTime))
                  self.tableData[i].unbanTime = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds()
                }
              }
              // /转换封禁时间戳并把为null的字段过滤掉
              for (var i = 0; i < self.tableData.length; i++) {
                if (self.tableData[i].banTime == null || self.tableData[i].banTime == 'null') {
                  self.tableData[i].banTime = ''
                } else {
                  var a = new Date(new Date(self.tableData[i].banTime))
                  self.tableData[i].banTime = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds()
                }
              }
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
      }
      this.queryD(this.pager)
    }
  }
</script>

<style scoped>
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

</style>

