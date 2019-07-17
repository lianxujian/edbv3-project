<!--公司管理 秋香-->
<template>
  <div id="account" >
    <div >
      <div class="input-box">
        <el-row :gutter="15">
          <el-col :span="5">
            <div style="min-width: 226px"><label  style="width:100px;margin-left: -20px;font-size:14px;">公司名称 :</label>
              <el-input size='small' v-model="formData.companyName"></el-input>
            </div>
          </el-col>
          <el-col :span="5">
            <div style="min-width: 226px;font-size:14px;"><label >联系人 :</label>
              <el-input size='small' v-model="formData.contacts"></el-input>
            </div>
          </el-col>
          <el-col :span="5">
            <div style="min-width: 226px"><label  style="width:80px;margin-left:-5px;font-size:14px;">公司法人 :</label>
              <el-input size='small' v-model="formData.legalPerson"></el-input>
            </div>
          </el-col>
          <el-col :span="5">
            <div style="min-width: 226px"><label  style="width:80px;margin-left:-5px;font-size:14px;">联系方式 :</label>
              <el-input size='small' v-model="formData.phone"></el-input>
            </div>
          </el-col>
          <el-col :span="3" style="text-align:center;">
            <el-button type="primary" @click='queryBtn'>查 询</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 表头 -->
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="dialogFormVisible = true;handleAdd()"  ><span>添加</span></li>
      </ul>
    </div>
    <el-dialog
      title="添加公司信息"
      :visible.sync="dialogFormVisible"
      width="750px"
      center
    >
      <div v-loading="loading" >
        <el-form :model="addData"  >
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
          <el-form-item label="抓单时间" :label-width="formLabelWidth">
            <el-date-picker
              v-model="addData.grapOrderTime"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="过期时间" :label-width="formLabelWidth">
            <el-date-picker
              v-model="addData.expiry"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否模糊化" :label-width="formLabelWidth">
            <el-radio :label=true  v-model="addData.vague">是</el-radio>
            <el-radio :label=false  v-model="addData.vague">否</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-left: 400px">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addD()">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <div class="header">
      <el-dialog
        title="修改公司信息"
        :visible.sync="dialogFormVisiblee"
        width="750px"
        center
      >
        <div v-loading="loading" >
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
            <el-form-item label="抓单时间" :label-width="formLabelWidth">
              <el-date-picker
                v-model="paramData.grapOrderTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="过期时间" :label-width="formLabelWidth">
              <el-date-picker
                v-model="paramData.expiry"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="是否模糊化" :label-width="formLabelWidth" >
              <el-radio :label=true v-model="paramData.vague" >是</el-radio>
              <el-radio :label=false v-model="paramData.vague" >否</el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="margin-left: 400px">
            <el-button @click="dialogFormVisiblee = false">取 消</el-button>
            <el-button type="primary" @click="editorSave()">确定</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div style="margin-bottom: 50px">
      <el-table
        id="fitTable"
        :height="table_h"
        ref="multipleTable"
        :data="tableData"
        border
      >
        <el-table-column
          align="center"
          type="selection">
        </el-table-column>
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="75px">
        </el-table-column>
        <el-table-column
          align="center"
          prop="companyName"
          :show-overflow-tooltip='true'
          label="名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="legalPerson"
          :show-overflow-tooltip='true'
          label="公司法人">
        </el-table-column>
        <el-table-column
          align="center"
          prop="contacts"
          :show-overflow-tooltip='true'
          label="联系人">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          align="center"
          prop="email"
          :show-overflow-tooltip='true'
          label="邮箱">
        </el-table-column>
        <el-table-column
          align="center"
          :show-overflow-tooltip='true'
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          align="center"
          prop="grapOrderTime"
          label="抓单时间">
        </el-table-column>
        <el-table-column
          align="center"
          prop="expiry"
          label="过期时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="是否模糊化">
          <template slot-scope="scope">
            <span class="cen-g" v-if="scope.row.vague==true">是</span>
            <span class="cen-g" v-if="scope.row.vague==false">否</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope" >
            <el-button  type="text"   @click="dialogFormVisiblee = true;handleEdit(scope.$index, scope.row)" style="width: 50px">编辑</el-button>
            <el-button  type="text"  @click="handleDelete(scope.$index, scope.row)" style="width: 50px">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="col-pagination">
        <el-pagination
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        queryFn: () => {}, // 表格信息
        table_h: 10, // 表格的高度
        tableData: [],//表格的数据
        totalPage: 20,//每页显示条数
        currentPage: 1,//当前页
        totalNum: 0,//总条数
        listData: {
          page: 1,
          size: 20,
        },//刷新数据
        formData: {
          companyName: '', // 公司名称
          legalPerson: '', // 公司法人
          contacts: '', // 联系人
          phone: '', // 联系方式
          page: '1', // 页数
          size: '20' // 行数
        },//模糊查询
        dialogFormVisible: false,//添加弹窗
        paramData:{
          companyName: '', // 公司名称
          legalPerson: '', // 公司法人
          contacts: '', // 联系人
          phone: '', //电话
          email: '', // 邮箱
          address: '', // 福建不知道
          intro: '', // 简介
          icon: '', // 图标
          grapOrderTime: '',//抓单时间
          expiry:'',// 过期时间
          vague:'',// 是否模糊化
        },// 修改公司
        dData:{ // 删除公司
          clToken: ''
        },
        addData: { // 添加公司
          companyName: '', // 公司名称
          legalPerson: '', // 公司法人
          contacts: '', // 联系人
          phone: '', //电话
          email: '', // 邮箱
          address: '', // 福建不知道
          intro: '', // 简介
          icon: '', // 图标
          grapOrderTime: '',//抓单时间
          expiry:'',// 过期时间
          vague:'',// 是否模糊化
        },//添加数据
        formLabelWidth: '100px',//尺寸
        dialogFormVisiblee: false,//修改页面
        loading: false,//加载
      }
    },

    methods: {
      // 每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        var paramData = this.formData;
        paramData.size = this.totalPage;
        this.queryFn(paramData)
      },

      // 当前页
      handleCurrentChange(val) {
        this.currentPage = val ;
        var paramData = this.formData;
        paramData.page = this.currentPage;
        this.queryFn(paramData)
      },

      // 查询
      queryBtn() {
        var paramData = this.formData;
        this.queryFn(paramData);
      },

      //取消修改弹窗
      closeBtn(){
        this.dialogFormVisiblee = false
      },

      // 点击按钮弹出框时
      handleAdd(){
        let self = this;
        // 清空之前输入的项
        self.addData.companyName = '';// 店铺
        self.addData.legalPerson = '';
        self.addData.contacts = '';
        self.addData.phone = '';
        self.addData.email = '';
        self.addData.address = '';
        self.addData.intro = '';
        self.addData.icon = '';
        self.dialogFormVisible = true;// 显示弹层
        self.addData.grapOrderTime= '';//抓单时间
        self.addData.expiry='';// 过期时间
        self.addData.vague=true// 是否模糊化
      },

      //编辑
      handleEdit(index, row) {
        this.dialogFormVisiblee = true;
        this.paramData.companyId = row.companyId;
        this.paramData.companyName = row.companyName;
        this.paramData.legalPerson = row.legalPerson;
        this.paramData.contacts = row.contacts;
        this.paramData.phone = row.phone;
        this.paramData.email = row.email;
        this.paramData.address = row.address;
        this.paramData.intro = row.intro;
        this.paramData.icon = row.icon;
        this.paramData.grapOrderTime = row.grapOrderTime;
        this.paramData.expiry = row.expiry;
        this.paramData.vague = row.vague;
      },

      //修改数据
      editorSave(){
        var self = this;
        if(self.paramData.grapOrderTime != null||self.paramData.grapOrderTime != '') {
          self.paramData.grapOrderTime= new Date(self.paramData.grapOrderTime).getTime()
        }else {
          self.paramData.grapOrderTime = ''
        }
        if(self.paramData.expiry != null||self.paramData.expiry != '') {
          self.paramData.expiry= new Date(self.paramData.expiry).getTime()
        }else {
          self.paramData.expiry = ''
        }

        if (!self.paramData.companyName){
          this.$message({
            message: '公司名称不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.paramData.legalPerson){
          this.$message({
            message: '公司法人不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.paramData.contacts){
          this.$message({
            message: '联系人不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.paramData.phone) {
          self.$message({
            message: '请输入手机号!',
            type: 'warning'
          })
          return false
        } else if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(self.paramData.phone))) {
          // 如果手机号有值，验证是否正确
          self.$message({
            message: '不是完整的11位手机号或者正确的手机号前七位',
            type: 'warning'
          });
          return false;
        }
        if (!self.paramData.email) {
          self.$message({
            message: '请输入邮箱!',
            type: 'warning'
          })
          return false
        } else if (!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(self.paramData.email))) {
          // 如果手机号有值，验证是否正确
          self.$message({
            message: '邮箱格式不正确!',
            type: 'warning'
          });
          return false;
        }
        if (!self.paramData.address){
          this.$message({
            message: '地址不能为空!',
            type: 'warning'
          })
          return false
        } if (!self.paramData.intro){
          this.$message({
            message: '简介不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.paramData.grapOrderTime){
          this.$message({
            message: '抓单时间不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.paramData.expiry){
          this.$message({
            message: '过期时间不能为空!',
            type: 'warning'
          })
          return false
        }
        self.loading=true
        this._post('com.edb01.upms.service.CompanyService/1.0.0/update',this.paramData)
          .then(function(response) {
            if (response.data.code === 0) {
              self.dialogFormVisiblee = false;// 关闭弹框
              self.queryFn(self.listData);
              self.$message({
                type: 'success',
                message: '修改成功!'
              })
              self.loading=false
            } else {
              self.$message({
                message: response.data.msg,
                type: 'warning'
              })
              self.loading=false
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //删除单条数据
      handleDelete(index , row){
        var self = this;
        self.dData.companyId = row.companyId;
        this.$confirm('确认要删除本条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this._post('com.edb01.upms.service.CompanyService/1.0.0/delete',self.dData)
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

      //添加公司数据
      addD() {
        var self = this;
        if(self.addData.grapOrderTime != null||self.addData.grapOrderTime != '') {
          self.addData.grapOrderTime= new Date(self.addData.grapOrderTime).getTime()
        }else {
          self.addData.grapOrderTime = ''
        }
        if(self.addData.expiry != null||self.addData.expiry != '') {
          self.addData.expiry= new Date(self.addData.expiry).getTime()
        }else {
          self.addData.expiry = ''
        }

        if (!self.addData.companyName){
          this.$message({
            message: '公司名称不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.addData.legalPerson){
          this.$message({
            message: '公司法人不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.addData.contacts){
          this.$message({
            message: '联系人不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.addData.phone) {
          self.$message({
            message: '请输入手机号!',
            type: 'warning'
          })
          return false
        } else if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(self.addData.phone))) {
          // 如果手机号有值，验证是否正确
          self.$message({
            message: '不是完整的11位手机号或者正确的手机号前七位',
            type: 'warning'
          });
          return false;
        }
        if (!self.addData.email) {
          self.$message({
            message: '请输入邮箱!',
            type: 'warning'
          });
          return false
        } else if (!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(self.addData.email))) {
          // 如果手机号有值，验证是否正确
          self.$message({
            message: '邮箱格式不正确!',
            type: 'warning'
          });
          return false;
        }
        if (!self.addData.address){
          this.$message({
            message: '地址不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.addData.intro){
          this.$message({
            message: '简介不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.addData.grapOrderTime){
          this.$message({
            message: '抓单时间不能为空!',
            type: 'warning'
          })
          return false
        }
        if (!self.addData.expiry){
          this.$message({
            message: '过期时间不能为空!',
            type: 'warning'
          })
          return false
        }
        self.loading=true;
        self._post('com.edb01.upms.service.CompanyService/1.0.0/add',self.addData)
          .then(function(response) {
            if (response.data.code === 0) {
              self.dialogFormVisible = false; // 关闭弹框
              self.queryFn(self.listData);
              self.$message({
                type: 'success',
                message: '添加成功!'
              });
              self.loading=false
            } else {
              self.$message({
                message: response.data.msg,
                type: 'warning'
              })
              self.loading=false
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    },
    mounted() {
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight // 页面高度
        var b = document.getElementById('fitTable').offsetTop;// 表格距离顶部的距离
        this.table_h = a - b - 80
      })

      //初始化数据
      var self = this;
      this.queryFn = (par) => {
        self._post('com.edb01.upms.service.CompanyService/1.0.0/getByPage',par)
          .then(function(response) {
            if (response.data.code == 0) {
              self.totalNum = response.data.result.total;
              self.tableData = response.data.result.rows;
              // /转换时间
              for (var i = 0; i < self.tableData.length; i++) {
                if (self.tableData[i].createTime == null || self.tableData[i].createTime == 'null') {
                  self.tableData[i].createTime = '';
                } else {
                  var a = new Date(new Date(self.tableData[i].createTime));
                  self.tableData[i].createTime = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds()
                }
              }
              for (var i = 0; i < self.tableData.length; i++) {
                if (self.tableData[i].grapOrderTime == null || self.tableData[i].grapOrderTime == 'null') {
                  self.tableData[i].grapOrderTime = '';
                } else {
                  var a = new Date(new Date(self.tableData[i].grapOrderTime));
                  self.tableData[i].grapOrderTime = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds()
                }
              }
              for (var i = 0; i < self.tableData.length; i++) {
                if (self.tableData[i].expiry == null || self.tableData[i].expiry == 'null') {
                  self.tableData[i].expiry = ''
                } else {
                  var a = new Date(new Date(self.tableData[i].expiry));
                  self.tableData[i].expiry = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds()
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
      this.queryFn(this.listData);
    }
  }
</script>
<style>
</style>
<style scoped>
  #account {
    border-left:30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 10px solid #F0F1F5;
    padding: 20px;
  }
  .el-button{
    width: 100px;
  }
  .input-box {
    margin: -5px 0 0 0;
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

  .el-button span {
    font-size: 12px;
  }
  .el-input {
    width: 60% !important;
  }

  .col-pagination {
     position: fixed;
     height: 65px;
    border-top: 15px solid #F0F1F5;
    background: #fff;
    bottom: 0px;
    width: 100%;
    left: 0;
     z-index: 10;
  }

</style>
