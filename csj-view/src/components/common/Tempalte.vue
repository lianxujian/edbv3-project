<template>
  <div style='padding-left:20px;height:100%;'>
    <div class="input-box">
      <el-row style="">
        <el-col :span="5">
          <div><label for="">商家编码：</label><el-input size='small' v-model="paramData.contactPhone" @keyup.enter.native="queryBtn"></el-input></div>
        </el-col>
        <el-col :span="5">
          <div><label for="">商品名称：</label><el-input size='small' v-model="paramData.contactPhone" @keyup.enter.native="queryBtn"></el-input></div>
        </el-col>
        <el-col :span="5">
          <div>
            <label for="">来源：</label>
            <el-select size='small' v-model="paramData.materialType" placeholder="请选择">
              <el-option
                v-for="item in materialType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="">发布状态：</label>
            <el-select size='small' v-model="paramData.materialType" placeholder="请选择">
              <el-option
                v-for="item in materialType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
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
          <div class='s-date'>
            <label for="" style='margin-right:-3px;'>发布时间：</label>
            <el-date-picker
              :editable="false"
              size='small'
              v-model="paramData.startTime"
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
              v-model="paramData.startTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="release-nav">
      <ul>
        <li>发布</li>
      </ul>
    </div>
    <div class="border">
      <el-table
        border
        id='fitTable'
        :height="table_h"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align='center'
          type="selection"
          width="55">
        </el-table-column>
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
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="bookName"
          align='center'
          :show-overflow-tooltip='true'
          label="商家编码"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="isbn"
          align='center'
          min-width=''
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="pressName"
          label="售价（元）"
          :show-overflow-tooltip='true'
          min-width=''
          align='left'
          width="">
        </el-table-column>
        <el-table-column
          prop="price"
          align='right'
          label="已发布平台"
          min-width=''
          width="">
        </el-table-column>
        <el-table-column
          prop="attrKeyName"
          align='center'
          label="已发布店铺"
          width="">
        </el-table-column>
        <el-table-column
          prop="attrKeyName"
          align='center'
          label="发布时间"
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
          size:20
        },
        selectionData:[],
        materialType:[],
        table_h:0
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
      queryBtn(){
        this.initRenderTable();
      },
      resetBtn(){
        this.paramData = {};
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
      //多选框
      handleSelectionChange(val){
        this.selectionData=val;
      },
      //编辑
      handleEdit(){
        this.dialogShow=true;
      },
      //删除单条
      handleDelete(){
        this.$confirm('确认要删除本条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {

        }).catch(() => {});
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

          }).catch(() => {});
        }
      },
      renderTableHeight() {
        this.$nextTick(function () {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        });
        window.onresize = () => {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        }
      },
      initRenderTable(){
        this.paramData.page = this.currentPage;
        this.paramData.size = this.totalPage;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/queryTaskCenter",this.paramData).then((response)=>{
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
