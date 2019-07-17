<!--历史记录 秋香-->
<template>
  <div id="historyList">
    <el-breadcrumb separator=">" style="margin-bottom:30px">
      <el-breadcrumb-item :to="{ path: '/Suit' }">返回</el-breadcrumb-item>
      <el-breadcrumb-item>历史记录</el-breadcrumb-item>
    </el-breadcrumb>

    <label  class="leftLabel" >套装信息</label>
    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData"
                tooltip-effect="dark"
                id="tableH"
                border :height="table_h"
                @selection-change="handleSelectionChange"
                :default-sort = "{prop: 'orderTime', order: 'descending'}"
                border style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="商品"
          prop="">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="商品编号"
          prop="">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="条形码"
          prop="">
        </el-table-column>

        <el-table-column
          label="更新时间"
          prop=""
          :show-overflow-tooltip="true">
        </el-table-column>
      </el-table>

    </div>

    <!--表格2-->
    <label  class="leftLabel2" >相关单品</label>
    <div class="pDown">
      <el-table :data="tableData2"
                tooltip-effect="dark"
                id="tableH"
                border :height="table_h"
                @selection-change="handleSelectionChange"
                :default-sort = "{prop: 'orderTime', order: 'descending'}"
                border style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="商品"
          prop="">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="商品编号"
          prop="">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="条形码"
          prop="">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="数量"
          prop="">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="售价"
          prop="">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        table_h: 0,//表格高度
        tableData: [],//表格数据
        tableData2: [],//表格数据
        total: 0, //总页数

      }
    },
    methods:{
      handleSelectionChange(){

      },
    },
    mounted() {
      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 585);
      });
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped >
  .leftLabel{
    border-left: 5px solid #2E5EC5;
    font-weight: 500;
    padding-left: 10px;
    font-size: 16px;
    margin-bottom: 20px;
    margin-left: 5px
  }
  .leftLabel2{
   // padding-left: 10px;
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 5px
  }
</style>
