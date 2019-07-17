<template>
  <div>
    <el-table
      border
      ref="multipleTable"
      max-height="800"
      :data="tableData"
      @select = 'handleSelectChange'
      style="margin-top:15px;"
    >
      <el-table-column
        align='center'
        type="selection"
        width="80">
      </el-table-column>
      <el-table-column
        label="序号"
        align='center'
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goodsName"
        show-overflow-tooltip
        label="商品名称"
        min-width=''
        align='center'
        width="">
      </el-table-column>
      <el-table-column
        prop="barCode"
        label="条形码"
        min-width=''
        align='center'
        width="200">
      </el-table-column>
      <el-table-column
        prop="specification"
        label="规格"
        min-width=''
        align='center'
        width="200">
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage:1,
        totalPage:15,
        totalNum:0,
        tableData:[],
        paramsObj:{
          page:1,
          size:15,
        },
        totalNum:0,
        mapArr:[],
      }
    },
    methods: {
      handleSizeChange(val){
        this.paramsObj.size = val;
        this.getTableData();
      },
      handleCurrentChange(val){
        this.paramsObj.page = val;
        this.getTableData();
      },
      handleSelectChange(selection, currentRow){
        if(!this.mapArr.get(currentRow.goodsId)){
          this.mapArr.set(currentRow.goodsId,currentRow)
        }else{
          this.mapArr.delete(currentRow.goodsId);
        }
      },
      getTableData(item){
        this._post('com.edb01.erp.mdata.service.api.GoodsService/1.0.0/queryGoodsByCondition',this.paramsObj).then((response)=>{
          if (response.data.success) {
            this.tableData = response.data.result.rows;
            this.totalNum = response.data.result.total;
            if(item == 1){
              setTimeout(()=>{
                var mapArr = new Map();
                this.tableData.forEach((row,index) => {
                  if(index == 3 || index == 5){
                    this.$refs.multipleTable.toggleRowSelection(row);
                    mapArr.set(row.goodsId,row);
                  }
                });
                this.mapArr = mapArr;
              })
            }else{
              setTimeout(()=>{
                this.tableData.forEach(row => {
                  if(this.mapArr.get(row.goodsId)){
                    this.$refs.multipleTable.toggleRowSelection(row);
                  }
                })
              })
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },
    mounted(){
      this.getTableData(1);
    }
  };
</script>
