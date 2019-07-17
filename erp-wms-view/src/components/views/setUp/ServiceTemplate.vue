<!--业务单模板 贾南风/尘音-->
<template>
  <div id="serviceTemplate">
    <div class="col-border">
    <el-table
      :data="tableData"
      border
      :height="t_height"
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        align="center"
        label="模板名称"
        width="180">
        <template slot-scope="scope">
          <span style="cursor: pointer;color:#409EFF;" @click="print(scope.row,1)">{{scope.row.templateName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="model"
        label="应用模块">
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <span style="cursor: pointer;color:#409EFF;" @click="print(scope.row,1)">编辑</span>
          <span v-if="scope.row.templateName == '售后条码'" style="cursor: pointer;color:#409EFF;" @click="print(scope.row)">打印</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script>
    export default {
    data() {
      return {
        version: '1.0.0',
        t_height: 0,//表格高度
        tableData: [],//表格数据
      }
    },
    methods:{

      //编辑/打印
      print: function (row,n) {
        console.log(row,22);
        let url = '';
        if(n == 1) {
          url = 'http://127.0.0.1:8082/preview'
        }else {
          url = 'http://127.0.0.1:8082/print'
        }
        let data = {
          stype:'SVoucher',
          modelkey: 7,
          cltoken: sessionStorage.getItem('clToken'),
          ids: row.templateId
        };
        $.ajax({
          type: "post",
          url: url,
          data: data
        });
      },
    },
    created(){

      //初始化表格数据
      this._post('com.edb01.erp.wms.service.api.PrintTempletService/' + this.version + '/getAllTemplent')
        .then(res => {
          if(res.data.success == true){
            this.tableData = res.data.result;
          }
        })
    },
    mounted() {

      //渲染表格高度
      this.$nextTick(function() {
        this.t_height = $(window).height() - $('.col-border').offset().top - 40;
      });
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 40;
      };
    }
  }
</script>

<style scoped>
  a{
    color: blue;
  }
</style>
