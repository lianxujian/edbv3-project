<template>
  <div style='padding-left:0px;height:100%;margin:0 20px;'>
    <div >
    <div class="input-box">
      <el-row>
        <el-col :span="5">
          <div style="min-width: 226px"><label for=""style="width:100px;margin-left: -20px;font-size:14px;">公司名称</label>
            <el-input size='small' v-model="formData.companyName"></el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <div style="min-width: 226px;font-size:14px;"><label for="">联系人</label>
            <el-input size='small' v-model="formData.contacts"></el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <div style="min-width: 226px"><label for=""style="width:80px;margin-left:-5px;font-size:14px;">公司法人</label>
            <el-input size='small' v-model="formData.legalPerson"></el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <div style="min-width: 226px"><label for="" style="width:80px;margin-left:-5px;font-size:14px;">联系方式</label>
            <el-input size='small' v-model="formData.phone"></el-input>
          </div>
        </el-col>
        <el-col :span="3" style="text-align:center;">
          <el-button type="small" style="width:80px;color:#fff;background:#00ADEE;" @click='queryBtn'>查询</el-button>
        </el-col>
      </el-row>
    </div>
    </div>
     <div class="header">
      <div style="width:100%;height:40px;background-color:#d0d0d0;line-height:40px;margin-top: 10px">
        <el-button  type="text" @click="dialogFormVisible = true;handleAdd()" style="margin-left: 30px;">添加</el-button>
      </div>
      <el-dialog title="添加公司信息" :visible.sync="dialogFormVisible" >
        <el-form :model="addData">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="addData.companyName" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="公司法人" :label-width="formLabelWidth">
            <el-input v-model="addData.legalPerson" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="联系人" :label-width="formLabelWidth">
            <el-input v-model="addData.contacts" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth">
            <el-input v-model="addData.phone" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="addData.email" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="地址" :label-width="formLabelWidth">
            <el-input v-model="addData.address" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="简介" :label-width="formLabelWidth">
            <el-input v-model="addData.intro" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="图标" :label-width="formLabelWidth">
            <el-input v-model="addData.icon" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addD()">确定</el-button>
        </div>
      </el-dialog>
     </div>
    <div class="header">
      <el-dialog title="修改公司信息" :visible.sync="dialogFormVisiblee">
        <el-form :model="paramData">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="paramData.companyName" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="公司法人" :label-width="formLabelWidth">
            <el-input v-model="paramData.legalPerson" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="联系人" :label-width="formLabelWidth">
            <el-input v-model="paramData.contacts" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth">
            <el-input v-model="paramData.phone" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="paramData.email" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="地址" :label-width="formLabelWidth">
            <el-input v-model="paramData.address" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="简介" :label-width="formLabelWidth">
            <el-input v-model="paramData.intro" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item label="图标" :label-width="formLabelWidth">
            <el-input v-model="paramData.icon" auto-complete="off" style="width: 120px"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisiblee = false">取 消</el-button>
          <el-button type="primary" @click="editorSave()">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-table
        id="fitTable"
        :height="table_h"
        ref="multipleTable"
        :data="tableData"
        border
      >
        <el-table-column
          align="center"
          type="selection"
          min-width="30">
        </el-table-column>
        <el-table-column
          align="center"
          type="index"
          label="序号"
          min-width="110">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="110">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="dialogFormVisiblee = true;
              handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="companyName"
          :show-overflow-tooltip='true'
          label="名称"
          min-width="60">
        </el-table-column>
        <el-table-column
          align="center"
          prop="legalPerson"
          :show-overflow-tooltip='true'
          label="公司法人"
          min-width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="contacts"
          :show-overflow-tooltip='true'
          label="联系人"
          min-width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="联系方式"
          min-width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="email"
          label="邮箱"
          min-width="60">
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="地址"
          min-width="60">
        </el-table-column>
        <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
        min-width="100">
        </el-table-column>
      </el-table>
      <div style='float:right;margin-right:20px;'>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
       <!--<i class="el-icon-refresh" style="float: right;margin-right:-30px;margin-top: -25px;" @click="refresh()"></i>-->
      </div>
    </div>
  </div>
</template>

  <script>
  export default {
    data() {
      return {
        token: '',
        queryFn: () => {},
        // 表格信息
        table_h: 10, // 表格的高度
        tableData: [],
        totalPage: 20,
        currentPage: 1,
        totalNum: 0,
        selectionData: [],  // 选中条数
        listData: {
            page: 1,
            size: 20,
            clToken: ''
        },
       // 查询条件
      formData: {
          companyName: '', // 公司名称
          legalPerson: '', // 法人
          contacts: '', // 联系人
          phone: '', // 联系方式
          page: '1', // 页数
          size: '20' // 行数
      },
        // 弹出框
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        paramData:{ // 修改公司
          companyName: '',
          legalPerson: '', // 陈xx
          contacts: '', // 陈xx
          phone: '', // 15201541108
          email: '', // dy15201541109@qq.com
          address: '', // 福建不知道
          intro: '', // ceshi
          icon: '', // pig
          clToken: '',
          companyCode: ''
        },
        dData:{ // 删除公司
          clToken: ''
        },
        addData: { // 添加公司
          companyName: '', // 公司名称
          legalPerson: '', // 陈xx
          contacts: '', // 陈xx
          phone: '', // 15201541108
          email: '', // dy15201541109@qq.com
          address: '', // 福建不知道
          intro: '', // ceshi
          icon: '', // pig
          clToken: '',
          companyCode: ''
        },
        formLabelWidth: '100px',
        // 多选框
        checkAll: false,
        checkedCities: [],
        cities: [],
        isIndeterminate: true,
        isPublish: false,
        fullscreenLoading: false,
        loading: false,
        dialogShowEdit: false,
        dialogFormVisiblee: false
      }
    },

    methods: {
      /* 每页多少条 */
      handleSizeChange(val) {
        this.totalPage = val
        var paramData = this.formData
        paramData.size = this.totalPage
        paramData.clToken = this.token
        this.queryFn(paramData)
      },
      // 当前页
      handleCurrentChange(val) {
        this.currentPage = val ;
        var paramData = this.formData;
        paramData.page = this.currentPage;
        paramData.clToken = this.token;
        this.queryFn(paramData)
      },
      // 查询
      queryBtn() {
        var paramData = this.formData;
        paramData.clToken = this.token;
        this.queryFn(paramData);
      },
      closeBtn(){
        this.dialogFormVisiblee = false
      },
      // 点击按钮弹出框时
      handleAdd(){
        let self = this
        // 清空之前输入的项
        self.addData.companyName = ''// 店铺
        self.addData.legalPerson = ''
        self.addData.contacts = ''
        self.addData.phone = ''
        self.addData.email = ''
        self.addData.address = ''
        self.addData.intro = ''
        self.addData.icon = ''
        self.success = false
        self.dialogFormVisible = true;// 显示弹层
      },
      // 编辑 ------------------------------------------------修改数据----------------------------------------------------------
      handleEdit(index, row) {
        this.dialogFormVisiblee = true
        this.paramData.companyId = row.companyId
        this.paramData.companyName = row.companyName
        this.paramData.legalPerson = row.legalPerson
        this.paramData.contacts = row.contacts
        this.paramData.phone = row.phone
        this.paramData.email = row.email
        this.paramData.address = row.address
        this.paramData.intro = row.intro
        this.paramData.icon = row.icon
      },
      editorSave(){
        var self = this;
        this.paramData.clToken = this.token;
        this.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.CompanyService/update',
          data: this.paramData,
          transformRequest:[function (data) {
            let newData = '';
            for(let k in data){
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
            return newData;
          }]

        })
          .then(function(response) {
            if (response.data.code === 0) {
              self.dialogFormVisiblee = false// 关闭弹框
              self.queryFn(self.listData)
              self.$message({
                type: 'success',
                message: '修改成功!'
              })
            } else {
              self.$message({
                message: response.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      // ------------------------------------------------删除单条数据----------------------------------------------------------
      handleDelete(index , row){
        var self = this;
        self.dData.companyId = row.companyId;
        self.dData.clToken = self.token;
        this.$confirm('确认要删除本条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios({
            method: 'post',
            url: process.env.API_HOST + 'com.edb01.upms.service.CompanyService/delete',
            data: self.dData,
            transformRequest:[function (data) {
              let newData = '';
              for(let k in data){
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
              }
              return newData;
            }]
          })
            .then(function(response) {
              if (response.data.code == 0){
                // 后台删除成功，渲染页面
                var paramData = self.formData;
                paramData.page = self.currentPage;
                paramData.rows = self.totalPage;
                self.queryFn(self.listData)
              }else{
                self.$message({
                  message: response.data.message,
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }).catch(() => {});
      },
      // ------------------------------------------------添加公司数据----------------------------------------------------------
      addD() {
        var self = this;
        if(this.companyName == null || this.companyName == 'null')
          this.$message({
            message: '公司名称不能为空',
            type: 'warning'
          })
        this.addData.clToken=this.token;
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.CompanyService/add',
          data: self.addData,
          transformRequest: [function(data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function(response) {
            if (response.data.code === 0) {
              self.dialogFormVisible = false// 关闭弹框
              self.queryFn(self.listData)
              self.$message({
                type: 'success',
                message: '添加成功!'
              })
            } else {
              self.$message({
                message: response.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    },
    mounted() {
      if (localStorage.getItem('clToken')) {
        this.token = localStorage.getItem('clToken')
      }
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight // 页面高度
        var b = document.getElementById('fitTable').offsetTop // 表格距离顶部的距离
        this.table_h = a - b - 40
      })
      var self = this;
      this.queryFn = (par) => {
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.CompanyService/getByPage',
          data: par,
          transformRequest: [function(data) {
            let newData = ''
            for (let k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function(response) {
            if (response.data.code == 0) {
              self.totalNum = response.data.result.total
              self.tableData = response.data.result.rows
              // /转换时间
              for (var i = 0; i < self.tableData.length; i++) {
                if (self.tableData[i].createTime == null || self.tableData[i].createTime == 'null') {
                  self.tableData[i].createTime = ''
                } else {
                  var a = new Date(new Date(self.tableData[i].createTime))
                  self.tableData[i].createTime = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds()
                }
              }
            } else {
              self.$message({
                message: response.data.message,
                type: 'warning'
              })
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      }
      this.listData.clToken = this.token
      this.queryFn(this.listData);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .input-box {
    margin: 20px 0px 0 0px;
    display: inline-block;
  }

  .input-box label {
    width: 60px;
    display: inline-block;
    text-align: right;
    margin-right: 15px;
  }
  .el-select {
    width: 60%;
  }

  .el-input {
    width: 60% !important;
  }

  .release-nav {
    background: #F5F5F5;
    width: 100%;
    height: 38px;

  }

  .release-nav button {
    float: left;
    margin-top: 6px;
    cursor: pointer;
  }
  .release-header {
    background: #F5F5F5;
    width: 100%;
    height: 28px;

  }
  .border{
    border:1px dashed #cccccc;
  }
  .release-nav ul li {
    float: left;
    height: 26px;
    margin-top: 6px;
    line-height: 26px;
    padding: 0 40px;
    color: #2d2f33;
    cursor: pointer;
    list-style: none;
  }

  {
    float: left;
    height: 26px;
    margin-left: 200px;
    margin-top: 6px;
    line-height: 26px;
    padding: 0 40px;
    color: #2d2f33;
    cursor: pointer;
  }
  .input-box {
    margin: 20px 0 0px 0;
    display: inline-block;
  }

  .input-box label {
    width: 60px;
    display: inline-block;
    text-align: right;
    margin-right: 5px;
  }
  .el-button span {
    font-size: 12px;
  }
  .el-input {
    width: 60% !important;
  }
</style>
