<template>
  <div>
    <el-table
      border
      :data="publicLogData"
      max-height="380"
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
  </div>
</template>

<script>
  import {turnTimestamp, returnTimesStamp} from '@/assets/js/validate.js';
  export default {
    props:{
      paramObj:Object,
    },
    data() {
      return {
        version:'1.0.0',
        publicLogData:[],
        paramData:{
          operateRemark:'',
          sourceId:'',
          operateTypes:''
        }
      }
    },
    methods: {
      queryBtn(){
        this.paramData.sourceType=this.paramObj.moduleId?this.paramObj.moduleId:0;
        this.paramData.sourceId=this.paramObj.billCode?this.paramObj.billCode:'';
        this.paramData.operateTypes=this.paramObj.typeId?this.paramObj.typeId:'';
        var paramData={};
        for(var item in this.paramData){
          if(item != 'operateTypes' || (item == 'operateTypes' && this.paramData.operateTypes)){
            paramData[item] = this.paramData[item];
          }
        }
        this._post('com.edb01.erp.log.service.api.OperateLogService/'+this.version+'/getLogList',paramData).then((response)=>{
          if(response.data.code==0){
            this.publicLogData = response.data.result;
            this.publicLogData.forEach((item, i) => {
              item.operateTime = turnTimestamp(item.operateTime);
            })
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },
    mounted() {
      this.queryBtn();
    }
  }
</script>

<style scoped>

</style>
