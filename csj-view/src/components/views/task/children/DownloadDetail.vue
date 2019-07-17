<template>
  <div style='padding-left:20px;height:100%;'>
    <el-breadcrumb separator="/" class="col-breadcrumb" style="margin-bottom:15px;">
      <el-breadcrumb-item :to="{ path: '/taskCenter' }">任务中心</el-breadcrumb-item>
      <el-breadcrumb-item>任务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="input-box">
      <el-row style="">
        <el-col :span="5">
          <div><label for="">商家编码：</label><el-input size='small' v-model="paramData.goodsCode" @keyup.enter.native="queryBtn"></el-input></div>
        </el-col>
        <el-col :span="5">
          <div><label for="">商品名称：</label><el-input size='small' v-model="paramData.goodsName" @keyup.enter.native="queryBtn"></el-input></div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="">状态：</label>
            <el-select size='small' v-model="paramData.taskGoodsStatus" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="成功" value="1"></el-option>
              <el-option label="失败" value="2"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4" style="">
          <el-button type="primary" size="small" @click='queryBtn'>查 询</el-button>
          <el-button size="small" @click='resetBtn' style="background:#E4E4E4;">重 置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="border" style="margin-top:15px;">
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
          prop="goodsCode"
          align='center'
          label="商家编码"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          align='center'
          :show-overflow-tooltip='true'
          min-width=''
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="platFormType"
          label="平台"
          min-width=''
          align='center'
          width="">
        </el-table-column>
        <el-table-column
          prop="publishStore"
          align='left'
          :show-overflow-tooltip='true'
          label="店铺"
          min-width=''
          width="">
        </el-table-column>
        <el-table-column
          prop="status"
          align='center'
          label="状态"
          width="">
        </el-table-column>
        <el-table-column
          prop="remark"
          :show-overflow-tooltip='true'
          align='left'
          label="任务说明"
          width="">
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
        tableData:[{}],
        paramData:{
          page:1,
          size:20,
          taskGoodsStatus:''
        },
        materialType:[],
        table_h:0,
        taskId:this.$route.params.taskId,
      }
    },methods:{
      //新增宝贝
      addBaby(item){
        if(item == 'a'){
          //新增

        }else if(item == 'b'){
          //导入

        }else{
          //平台下载

        }
      },
      queryBtn(item){
        this.initRenderTable(item);
      },
      resetBtn(){
        this.paramData = {
          taskGoodsStatus:'',
          goodsCode:'',
          goodsName:''
        }
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
      renderTableHeight() {
        this.$nextTick(function () {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        });
        window.onresize = () => {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        }
      },
      initRenderTable(item){
        this.currentPage = item?1:this.currentPage;
        this.paramData.page = this.currentPage;
        this.paramData.size = this.totalPage;
        this.paramData.taskId = this.taskId;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/queryTaskDetail",this.paramData).then((response)=>{
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
      this.initRenderTable();
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
