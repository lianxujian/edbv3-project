<template>
  <div style='padding-left:20px;height:100%;'>
    <div class="input-box">
      <el-row style="">
        <el-col :span="5">
          <div class='s-date'>
            <label for="" style="margin-right:1px;">平台类型：</label>
            <el-select size='small' v-model="paramData.platformType" placeholder="请选择">
              <el-option
                v-for="item in platformType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date rel-shop'>
            <label for="" style="margin-right:1px;">店铺名称：</label>
            <el-select size='small' :multiple="true" collapse-tags :clearable="true" v-model="paramData.storeId" placeholder="请选择">
              <el-option
                v-for="item in shopName"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId">
              </el-option>
            </el-select>
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
          prop="storeName"
          align='center'
          label="店铺名称"
          min-width="">
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit" size="small" v-model="scope.row.storeName" @keyup.enter.native="keyupSave(scope.row)" @blur="keyupSave(scope.row)"></el-input>
            <span style="cursor: pointer;" v-else>{{scope.row.storeName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="平台类型"
          align='center'
          width="130">
          <template slot-scope="scope">
            <!--<span v-if="scope.row.platformType==1">天猫</span>
            <span v-else-if="scope.row.platformType==2">京东</span>-->
            <el-select size='small' v-model="scope.row.platformType" @change="platformTypeChange(scope.row)" placeholder="请选择">
              <el-option
                v-for="item in platformTypeTable"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="appkey"
          align='center'
          min-width=''
          label="appkey">
          <template slot-scope="scope">
            <p>............</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="secrets"
          label="secrets"
          :show-overflow-tooltip='true'
          min-width=''
          align='center'
          width="">
          <template slot-scope="scope">
            <p>............</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeToken"
          align='center'
          label="token "
          min-width=''
          width="">
          <template slot-scope="scope">
            <span style="cursor: pointer;" v-if="!scope.row.edit">............</span>
            <el-input type="password" v-else size="small" v-model="scope.row.storeToken" @keyup.enter.native="keyupSave(scope.row)" @blur="keyupSave(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align='center'
          width="110">
          <template slot-scope="scope">
            <span v-if='scope.row.status=="S01"' type="text" style="color:#94E727;">已启用</span>
            <span v-else type="text" style='color:#DE3A45;'>已停用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align='center'
          width="110">
          <template slot-scope="scope">
            <el-button v-if='scope.row.status=="S01"' type="text" @click="enable(scope.$index, scope.row)">停用</el-button>
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
          添加店铺<span @click='closeBtn'>&times;</span>
        </div>
        <div class="dialog-content">
          <div style='margin-top:20px;'></div>
          <div class='template-div'>
            <span><b>*</b> 店铺名称：</span>
            <el-input size='small' v-model="addFormData.storeName" style="width:300px;"></el-input>
          </div>
          <div class="template-div">
            <span><b>*</b> 平台类型：</span>
            <el-select size='small' v-model="addFormData.platformType" placeholder="请选择">
              <el-option
                v-for="item in addPlatformType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class='template-div'>
            <span>appkey：</span>
            <el-input size='small' type="password" v-model="appkey" style="width:300px;" disabled></el-input>
          </div>
          <div class='template-div'>
            <span>secrets：</span>
            <el-input size='small' type="password" v-model="secrets" style="width:300px;" disabled></el-input>
          </div>
          <div class='template-div'>
            <span><b>*</b> token：</span>
            <el-input size='small' v-model="addFormData.storeToken" style="width:300px;"></el-input>
          </div>
          <div class='template-div'>
            <span style='margin-right:30px;'>状态：</span>
            <el-radio-group v-model="addFormData.status">
              <el-radio label="S01">启用</el-radio>
              <el-radio label="S02">停用</el-radio>
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
        renderSelectShop:()=>{},
        totalNum:0,
        totalPage:20,
        currentPage:1,
        tableData:[],
        paramData:{
          page:1,
          rows:20,
          storeId:'',
          platformType:'-1',
          status:'-1'
        },
        dialogShow:false,
        selectionData:[],
        table_h:0,
        platformType:[
          {
            label:'全部',
            value:'-1'
          },
          {
            label:'天猫',
            value:'1'
          },
          {
            label:'京东',
            value:'2'
          },
          {
            label:'淘宝',
            value:'3'
          },
          {
            label:'拼多多',
            value:'4'
          }
        ],
        platformTypeTable:[
          {
            label:'天猫',
            value:1
          },
          {
            label:'京东',
            value:2
          },
          {
            label:'淘宝',
            value:3
          },
          {
            label:'拼多多',
            value:4
          }
        ],
        addPlatformType:[
          {
            label:'天猫',
            value:'1'
          },
          {
            label:'京东',
            value:'2'
          },
          {
            label:'淘宝',
            value:'3'
          },
          {
            label:'拼多多',
            value:'4'
          }
        ],
        enableStatus:[
          {
            label:'全部',
            value:'-1'
          },
          {
            label:'已启用',
            value:'S01'
          },
          {
            label:'已停用',
            value:'S02'
          }
        ],
        shopName:[],
        appkey:'123456123456',
        secrets:'123456123456',
        addFormData:{
          status:'S01',
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
              str+=item.storeId+',';
            })
            this.$axios({
              method:'get',
              url:process.env.OLD_API + 'api/store/dels?ids='+str.slice(0,-1)
            })
              .then((response)=>{
                if(response.data.code==0){
                  this.renderFn();
                  this.renderSelectShop();
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
        var status=row.status=='S01'?'S02':'S01';
        var self = this;
        this.$axios({
          method:'get',
          url:process.env.OLD_API + 'api/store/statusUpdate?id='+row.storeId
        })
          .then(function (response) {
            if(response.data.code==0){
              row.status=status;
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
        this.dialogShow=true;
        this.addFormData={
          status:'S01',
          platformType:'1',
          storeName:'',
          storeToken:''
        };
      },
      //添加保存
      addBtnSave(value){
        if(this.addFormData.storeName.trim()==''){
          this.$message({
            message: '请输入店铺名称',
            type: 'warning'
          });
          return false;
        }
        if(this.addFormData.storeToken.trim()==''){
          this.$message({
            message: '请输入店铺token',
            type: 'warning'
          });
          return false;
        }
        this.$axios({
          method:'post',
          url:process.env.OLD_API + 'api/store/addStore',
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
              this.renderSelectShop();
              if(value==0){
                this.dialogShow=false;
              }else{
                this.addFormData={
                  status:'S01',
                  platformType:'1',
                  storeName:'',
                  storeToken:''
                };
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
      //改变平台
      platformTypeChange(row){
        this.$axios({
          method:'get',
          url:process.env.OLD_API + 'api/store/updateType?type='+row.platformType+'&storeId='+row.storeId
        })
          .then((response)=>{
            console.log(response)
            if(response.data.code==0){

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
        if(column.property=="storeName" || column.property=='storeToken'){
          row.edit=true;
        }
      },
      keyupSave(row){
        if(row.storeName.trim()==''){
          this.$message({
            message: '请输入店铺名称',
            type: 'warning'
          });
          return false;
        }
        if(row.storeToken.trim()==''){
          this.$message({
            message: '请输入店铺token',
            type: 'warning'
          });
          return false;
        }
        if(row.storeName.length>64){
          this.$message({
            message: '名称长度不能超过64字符',
            type: 'warning'
          });
          return false;
        }
        this.$axios({
          method:'post',
          url:process.env.OLD_API + 'api/store/updateEdit?storeName='+encodeURIComponent(row.storeName)+'&storeToken='+encodeURIComponent(row.storeToken)+'&storeId='+row.storeId
        })
          .then((response)=>{
            if(response.data.code==0){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.renderSelectShop();
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
          url:process.env.OLD_API + 'api/store/getByList',
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
      //店铺下拉
      this.renderSelectShop=()=>{
        this.$axios({
          method:'get',
          url:process.env.OLD_API + 'api/store/getByMerId'
        })
          .then((response)=>{
            if(response.data.code==0){
              this.shopName=response.data.result;
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
      }
      this.renderSelectShop();
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
