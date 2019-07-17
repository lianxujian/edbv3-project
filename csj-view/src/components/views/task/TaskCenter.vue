<template>
  <div style='padding-left:20px;height:100%;'>
    <div class="input-box">
      <el-row style="">
        <el-col :span="5">
          <div class='s-date'>
            <label for="" style='margin-right:-3px;'>提交时间：</label>
            <el-date-picker
              :editable="false"
              size='small'
              @change="channelChangeDate(1)"
              v-model="paramData.submitTime"
              value-format="timestamp"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="" style='margin-right:-3px;text-align:center;'>至</label>
            <el-date-picker
              :editable="false"
              size='small'
              @change="channelChangeDate(2)"
              v-model="paramData.endTime"
              value-format="timestamp"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div>
            <label for="">任务类型：</label>
            <el-select size='small' clearable v-model="paramData.taskType" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="发布任务" value="1"></el-option>
              <el-option label="下载任务" value="2"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="">任务状态：</label>
            <el-select size='small' clearable v-model="paramData.taskStatus" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="等待执行" value="1"></el-option>
              <el-option label="执行中" value="2"></el-option>
              <el-option label="执行结束" value="3"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4" style="">
          <el-button type="primary" size="small" @click='queryBtn'>查 询</el-button>
          <el-button size="small" @click='resetBtn' style="background:#E4E4E4;">重 置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px;">
        <el-col :span="5">
          <div>
            <label for="">平台：</label>
            <el-select size='small' clearable v-model="paramData.platFormType" @change="channelPlat" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="天猫" value="1"></el-option>
              <el-option label="京东" value="2"></el-option>
              <el-option label="淘宝" value="3"></el-option>
              <el-option label="拼多多" value="4"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="">店铺：</label>
            <el-select size='small' filterable clearable v-model="paramData.storeName" placeholder="请选择">
              <el-option
                v-for="item in storeList"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeName">
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top:15px;" class="border">
      <el-table
        border
        id='fitTable'
        :height="table_h"
        :data="tableData"
      >
        <el-table-column
          align='center'
          label="序号"
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
          label="操作"
          align='center'
          width="110">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskCode"
          align='center'
          :show-overflow-tooltip='true'
          label="任务编号"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="taskType"
          align='center'
          min-width=''
          label="任务类型">
        </el-table-column>
        <el-table-column
          prop="taskStatus"
          label="任务状态"
          min-width=''
          align='center'
          width="">
        </el-table-column>
        <el-table-column
          prop="platFormType"
          align='center'
          label="平台"
          min-width=''
          width="">
        </el-table-column>
        <el-table-column
          prop="publishStore"
          align='left'
          label="店铺"
          :show-overflow-tooltip='true'
          width="">
        </el-table-column>
        <el-table-column
          prop="attrKeyName"
          align='center'
          label="商品（去重/失败/成功/总数）"
          width="210">
          <template slot-scope="scope">
            <span>{{scope.row.repetition_qty}}</span>/<span style="color:red;">{{scope.row.failure_qty}}</span>/<span style="color:green;">{{scope.row.success_qty}}</span>/<span>{{scope.row.total_qty}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align='center'
          label="任务提交时间"
          width="160">
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
      <i class='el-icon-refresh refresh' @click='refresh'></i>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        version:'1.0.0',
        totalNum:0,
        totalPage:20,
        currentPage:1,
        tableData:[],
        paramData:{
          page:1,
          size:20,
          submitTime:'',
          endTime:'',
          platFormType:'',
          storeName:'全部',
          platFormType:'',
          taskStatus:'',
          taskType:''
        },
        materialType:[],
        table_h:0,
        storeList:[],
      }
    },methods:{
      channelChangeDate(item){
        if(this.paramData.submitTime && this.paramData.endTime && this.paramData.submitTime > this.paramData.endTime){
          this.$message({
            message: '起始时间不能大于结束时间！',
            type: 'warning'
          });
          if(item == 1){
            this.paramData.submitTime = '';
          }else{
            this.paramData.endTime = '';
          }
        }
      },
      channelPlat(){
        var platFormType = this.paramData.platFormType == ''?0:this.paramData.platFormType;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/getMerchantList",{
          platformType:platFormType
        }).then((response)=>{
          if (response.data.success) {
            response.data.result.unshift({
              storeName:'全部',
              storeId:'全部'
            })
            this.storeList = response.data.result;
            this.paramData.storeName = '全部';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      queryBtn(item){
        this.initRenderTable(item);
      },
      //重置
      resetBtn(){
        this.paramData = {
          taskType:'',
          platFormType:'',
          taskStatus:'',
          submitTime:'',
          endTime:'',
          storeName:'全部',
        }
        this.formatTime();
      },
      handleSizeChange(val){
        this.totalPage = val;
        this.initRenderTable();
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.initRenderTable();
      },
      refresh(){
        this.initRenderTable();
      },
      //编辑
      handleEdit(index,row){
        this.$router.push({path:'/taskDetail/'+row.taskId});
      },
      renderTableHeight() {
        this.$nextTick(function () {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        });
        window.onresize = () => {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        }
      },
      formatTime(){
        let y = new Date().getFullYear();
        let m = new Date().getMonth()-3;
        let d = new Date().getDate();
        this.paramData.endTime = new Date().getTime();
        this.paramData.submitTime = new Date(y,m,d).getTime();
      },
      initRenderTable(item){
        this.currentPage = item?1:this.currentPage;
        this.paramData.page = this.currentPage;
        this.paramData.size = this.totalPage;
        this.paramData.submitTime = this.paramData.submitTime?this.paramData.submitTime:'';
        this.paramData.endTime = this.paramData.endTime?this.paramData.endTime:'';
        var param = JSON.parse(JSON.stringify(this.paramData));
        param.storeName = this.paramData.storeName == '全部'?'':this.paramData.storeName;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/queryTaskCenter",param).then((response)=>{
          if (response.data.success) {
            this.tableData = response.data.result.rows;
            this.totalNum = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      }
    },
    mounted(){
      //渲染表格高度
      this.renderTableHeight();
      //格式化时间
      this.formatTime();
      this.initRenderTable();
      this.channelPlat();
    },
    created(){

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-input{
    width:60% !important;
  }
</style>
