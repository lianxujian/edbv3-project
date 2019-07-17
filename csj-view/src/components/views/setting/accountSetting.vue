<template>
  <div style='padding-left:20px;height:100%;'>
    <div class="input-box">
      <el-row style="">
        <el-col :span="5">
          <div class='s-date'>
            <label for="" style="margin-right:1px;">账号：</label>
            <el-input size='small' v-model="paramData.loginName" style="width:300px;" @keyup.enter.native="queryBtn"></el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="" style="margin-right:1px;">员工姓名：</label>
            <el-input size='small' v-model="paramData.staffName" style="width:300px;" @keyup.enter.native="queryBtn"></el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="" style="margin-right:1px;">状态：</label>
            <el-select size='small' v-model="paramData.status" placeholder="请选择">
              <el-option
                v-for="item in enableStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" @click='queryBtn'>查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="release-nav">
      <ul>
        <li @click="addDialog">添加</li>
        <li @click='delBtn'>删除</li>
      </ul>
    </div>
    <div class="border">
      <el-table
        id='fitTable'
        :height="table_h"
        :data="tableData"
        @selection-change="handleSelectionChange"
        @cell-dblclick="cellClick"
        border>
        <el-table-column
          align='center'
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="loginName"
          align='center'
          :show-overflow-tooltip='true'
          label="账号"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="password"
          align='center'
          min-width=''
          label="密码">
          <template slot-scope="scope">
            <span style="cursor: pointer;" v-if="!scope.row.edit">............</span>
            <el-input type="password" v-else size="small" v-model="scope.row.password" @keyup.enter.native="keyupSave(scope.row)" @blur="keyupSave(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="staffName"
          align='center'
          label="员工姓名"
          width="">
          <template slot-scope="scope">
            <span style="cursor: pointer;" v-if="!scope.row.edit">{{scope.row.staffName}}</span>
            <el-input v-else size="small" v-model="scope.row.staffName" @keyup.enter.native="keyupSave(scope.row)" @blur="keyupSave(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="staffDesc"
          align='center'
          label="员工简介"
          width="">
          <template slot-scope="scope">
            <span style="cursor: pointer;" v-if="!scope.row.edit">{{scope.row.staffDesc}}</span>
            <el-input v-else size="small" v-model="scope.row.staffDesc" @keyup.enter.native="keyupSave(scope.row)" @blur="keyupSave(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align='center'
          width="110">
          <template slot-scope="scope">
            <span v-if='scope.row.status=="F01"' type="text" style="color:#94E727;">已启用</span>
            <span v-else type="text" style='color:#DE3A45;'>已停用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align='center'
          width="110">
          <template slot-scope="scope">
            <el-button v-if='scope.row.status=="F01"' type="text" @click="enable(scope.$index, scope.row)">停用</el-button>
            <el-button v-else type="text" @click="enable(scope.$index, scope.row)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style='float:right;margin-top:5px;'>
      <el-pagination
        style='float:left;'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
      <i class='el-icon-refresh' @click='refresh'></i>
    </div>
    <div class="dialog" v-if="dialogShow">
      <div class="mask"></div>
      <div class="dialog-box" style='width:500px;height:460px;margin-top:-230px;margin-left:-250px;'>
        <div class="dialog-head">
          添加账号<span @click='closeBtn'>&times;</span>
        </div>
        <div class="dialog-content">
          <div style='margin-top:20px;'></div>
          <div class='template-div'>
            <span><b>*</b> 账号：</span>
            csj_b
            <el-input size='small' v-model="loginName" style="width:203px !important;" disabled></el-input>
          </div>
          <div class='template-div'>
            <span><b>*</b> 密码：</span>
            <el-input size='small' type="password" v-model="addFormData.password" style="width:300px;"></el-input>
          </div>
          <div class='template-div'>
            <span><b>*</b> 员工姓名：</span>
            <el-input size='small' v-model="addFormData.staffName" style="width:300px;"></el-input>
          </div>
          <div class='template-div'>
            <span> 员工简介：</span>
            <el-input size='small' v-model="addFormData.staffDesc" style="width:300px;"></el-input>
          </div>
          <div class='template-div'>
            <span style='margin-right:30px;'>状态：</span>
            <el-radio-group v-model="addFormData.status">
              <el-radio label="F01">启用</el-radio>
              <el-radio label="F02">停用</el-radio>
            </el-radio-group>
          </div>
          <div class='template-div'>
            <el-button type='primary' size='small' style='margin:10px 60px 0px 80px;' @click='addBtnSave(0)'>确定</el-button>
            <el-button size='small' style='margin:10px;' @click='addBtnSave(1)'>确定并继续</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        renderFn:()=>{},
        totalNum:0,
        totalPage:20,
        currentPage:1,
        tableData:[],
        paramData:{
          page:1,
          rows:20,
          loginName:'',
          staffName:'',
          status:'-1'
        },
        loginName:'',
        dialogShow:false,
        selectionData:[],
        table_h:0,
        enableStatus:[
          {
            label:'全部',
            value:'-1'
          },
          {
            label:'已启用',
            value:'F01'
          },
          {
            label:'已停用',
            value:'F02'
          }
        ],
        addFormData:{
          status:'F01',
          platformType:'1'
        }
      }
    },methods:{
      queryBtn(){
        this.renderFn();
      },
      handleSizeChange(val){
        this.paramData.rows=val;
        this.renderFn();
      },
      handleCurrentChange(val){
        this.paramData.page=val;
        this.renderFn();
      },
      refresh(){
        this.renderFn();
      },
      //多选框
      handleSelectionChange(val){
        this.selectionData=val;
      },
      //删除多条
      delBtn(){
        if(this.selectionData.length==0){
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }else{
          this.$confirm('确认要删除这些数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            var str='';
            this.selectionData.forEach((item,val)=>{
              str+=item.staffId+',';
            })
            this.$axios({
              method:'get',
              url:process.env.OLD_API + 'api/jd/staff/del?ids='+str.slice(0,-1)
            })
              .then((response)=>{
                if(response.data.code==0){
                  this.renderFn();
                }else{
                  this.$message({
                    message: response.data.message,
                    type: 'warning'
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }).catch(() => {});
        }
      },
      closeBtn(){
        this.dialogShow=false;
      },
      enable(index,row){
        var status=row.status=='F01'?'F02':'F01';
        var self = this;
        this.$axios({
          method:'get',
          url:process.env.OLD_API + 'api/jd/staff/updateStatus?staffId='+row.staffId
        })
          .then(function (response) {
            if(response.data.code==0){
              row.status=status;
              console.log(row.status);
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
      },
      //添加弹出框
      addDialog(){
        this.$axios({
          method:'post',
          url:process.env.OLD_API + 'api/jd/staff/autoGet'
        })
          .then((response)=>{
            if(response.data.code==0){
              this.dialogShow=true;
              this.addFormData={
                status:'F01',
                loginName:'',
                password:'',
                staffName:'',
                staffDesc:''
              };
              this.loginName=response.data.result;
            }else{
              this.$message({
                message: response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //添加保存
      addBtnSave(value){
        console.log(this.addFormData.password.trim());
        if(this.loginName.trim()==''){
          this.$message({
            message: '请输入账号',
            type: 'warning'
          });
          return false;
        }else if(this.loginName.trim().length!=6){
          this.$message({
            message: '请输入6位字符的账号',
            type: 'warning'
          });
          return false;
        }
        if(this.addFormData.password.trim()==''){
          this.$message({
            message: '请输入密码',
            type: 'warning'
          });
          return false;
        }else if(this.addFormData.password.trim().length>60){
          this.$message({
            message: '密码不能超过60个字符',
            type: 'warning'
          });
          return false;
        }
        if(this.addFormData.staffName.trim()==''){
          this.$message({
            message: '请输入员工姓名',
            type: 'warning'
          });
          return false;
        }else if(this.addFormData.staffName.trim().length>60){
          this.$message({
            message: '员工姓名不能超过60个字符',
            type: 'warning'
          });
          return false;
        }
        if(this.addFormData.staffDesc.trim().length>60){
          this.$message({
            message: '员工简介不能超过60个字符',
            type: 'warning'
          });
          return false;
        }
        this.addFormData.loginName='csj_b'+this.loginName;
        this.$axios({
          method:'post',
          url:process.env.OLD_API + 'api/jd/staff/addStaff',
          data:this.addFormData,
          transformRequest:[(data)=> {
            let newData = '';
            for(let k in data){
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
            return newData;
          }]
        })
          .then((response)=>{
            if(response.data.code==0){
              this.renderFn();
              if(value==0){
                this.dialogShow=false;
              }else{
                this.addDialog();
              }
            }else{
              this.$message({
                message: response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //单元格双击
      cellClick(row, column, cell, event){
        if(column.property=="staffDesc" || column.property=='staffName' || column.property=='password'){
          row.edit=true;
        }
      },
      keyupSave(row){
        if(row.password.trim()==''){
          this.$message({
            message: '请输入密码',
            type: 'warning'
          });
          return false;
        }
        if(row.staffName.trim()==''){
          this.$message({
            message: '请输入员工姓名',
            type: 'warning'
          });
          return false;
        }
        if(row.staffName.length>60){
          this.$message({
            message: '员工姓名长度不能超过60字符',
            type: 'warning'
          });
          return false;
        }
        if(row.staffDesc.length>60){
          this.$message({
            message: '员工简介长度不能超过60字符',
            type: 'warning'
          });
          return false;
        }
        this.$axios({
          method:'post',
          url:process.env.OLD_API + 'api/jd/staff/updateEdit?password='+encodeURIComponent(row.password)+'&staffName='+encodeURIComponent(row.staffName)+'&staffDesc='+encodeURIComponent(row.staffDesc)+'&staffId='+row.staffId
        })
          .then((response)=>{
            if(response.data.code==0){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }else{
              this.$message({
                message: response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        row.edit=false;
      },
      renderTableHeight() {
        this.$nextTick(function () {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        });
        window.onresize = () => {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        }
      },
    },
    mounted(){
      //渲染表格高度
      this.renderTableHeight();
      this.renderFn=()=>{
        this.$axios({
          method:'post',
          url:process.env.OLD_API + 'api/jd/staff/getByList',
          data:this.paramData,
          transformRequest:[(data)=> {
            let newData = '';
            for(let k in data){
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
            return newData;
          }]

        })
          .then( (response)=>{
            if (response.data.code == 0) {
              this.tableData=response.data.result.rows;
              this.totalNum=response.data.result.total;
            } else {
              this.$message({
                message: response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.renderFn();
    },
    created(){

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-select{
    width:60%;
  }
  .el-input{
    width:60% !important;
  }
  .release-nav{
    background:#2EA3FC;
    width:100%;
    height:38px;
    margin:15px 0;
  }
  .release-nav ul li{
    float:left;
    height:26px;
    margin-top:6px;
    line-height:26px;
    padding:0 40px;
    color:#fff;
    border-right:1px solid #fff;
    cursor: pointer;
  }
  .template-div{
    margin-bottom:20px;
  }
  .template-div span{
    display:inline-block;
    width:80px;
    text-align:right;
  }
  .template-div span>b{
    color:red;
    font-weight:normal;
  }
  .input-box label{
    width:70px;
    display:inline-block;
    text-align:right;
    margin-right:1px;
  }
</style>
<style>
  .rel-shop .el-select__tags {
    overflow: hidden;
  }

  .rel-shop .el-select__tags > span {
    display: inline-block;
    width: 300px;
  }
</style>
