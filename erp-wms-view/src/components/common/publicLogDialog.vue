<template>
  <div>
    <el-dialog v-dialogDrag
      title="查看日志"
      :visible.sync="pulicLogVisible"
      :before-close="changeShow"
      width="800px">
      <div class="input-box">
        <label for="">操作描述：</label>
        <el-input size='small' style="width:220px;" v-model="paramData.operateRemark" @keyup.enter.native="queryBtn"></el-input>
        <el-button size="small" type="primary" style="width:80px;margin:1px 50px 0 50px;" @click="queryBtn">查询</el-button>
        <span>只能查询最近三个月的日志</span>
      </div>
      <el-table
        border
        v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        height="500"
        :data="publicLogData"
        style="margin-top:15px;"
      >
        <el-table-column
          type="index"
          align='center'
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="operateName"
          align='center'
          label="操作类型"
          width="">
        </el-table-column>
        <el-table-column
          prop="operateRemark"
          align='center'
          label="操作描述"
          :show-overflow-tooltip='true'
          width="">
        </el-table-column>
        <el-table-column
          prop="operater"
          align='center'
          label="操作人"
          width="">
        </el-table-column>
        <el-table-column
          prop="operateTime"
          align='center'
          min-width=''
          label="操作时间">
        </el-table-column>
        <el-table-column
          prop="opersteIp"
          label="IP"
          min-width=''
          align='center'
          width="">
        </el-table-column>
      </el-table>
      <div class="dialog-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
      <div style="clear:both;"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeShow">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {turnTimestamp, returnTimesStamp} from '@/assets/js/validate.js';
  export default {
    props:{
      paramObj:Object,
      pulicLogVisible:Boolean
    },
    data() {
      return {
        loading:false,
        renderFn:()=>{},
        version:'1.0.0',
        dialogVisible:false,
        publicLogData:[],
        currentPage:1,
        totalPage:15,
        totalNum:0,
        paramData:{
          page:1,
          size:15,
          operateRemark:''
        }
      }
    },
    methods: {
      handleSizeChange(val){
        this.paramData.size = val;
        this.renderFn();
      },
      handleCurrentChange(val){
        this.paramData.page = val;
        this.renderFn();
      },
      queryBtn(){
        this.renderFn();
      },
      changeShow(){
        this.$emit('changShow',true)
      }
    },
    watch:{
      pulicLogVisible:function (a,b) {
        if(!b){
          this.paramData.sourceType=this.paramObj.moduleId?this.paramObj.moduleId:0;
          this.paramData.sourceId=this.paramObj.billCode?this.paramObj.billCode:'';
          this.paramData.operateTypes=this.paramObj.typeId?this.paramObj.typeId:'';
          this.renderFn();
        }
      }
    },
    mounted() {
      this.renderFn=()=>{
        var paramData={};
        for(var item in this.paramData){
          if(item != 'operateTypes' || (item == 'operateTypes' && this.paramData.operateTypes)){
            paramData[item] = this.paramData[item];
          }
        }
        this.loading = true;
        this._post('com.edb01.erp.log.service.api.OperateLogService/'+this.version+'/getLogDataPager',paramData).then((response)=>{
          this.loading = false;
          if(response.data.code==0){
            this.publicLogData = response.data.result.rows;
            this.publicLogData.forEach((item, i) => {
              item.operateTime = turnTimestamp(item.operateTime);
            })
            this.totalNum = response.data.result.total;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
