<!--公共分页组件 尘音-->
<template>
  <div id="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curPage"
      :page-sizes="[15, 30, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCom">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    props:{
      curPageCom: Number,//父级当前页
      pageSizeCom: Number,//父级每页数量
      totalCom: Number//父级总数量
    },
    computed: {

      //每页数量
      pageSize: {
        get:function(){
          return this.pageSizeCom
        },
        set:function(val){
          this.$emit('pageSizeVal', val);
        }
      },

      //当前页
      curPage: {
        get:function () {
          return this.curPageCom
        },
        set:function (val) {
          this.$emit('curPageVal',val);
        }
      }
    },
    methods: {

      //变换每页数量
      handleSizeChange(value) {
        this.pageSize = value;
      },

      //变换当前页
      handleCurrentChange(value) {
        this.curPage = value;
      },
    }
  }
</script>
<style>
  .pagination{
    text-align: right;
    position: fixed;
    right: 0;
    bottom: 0;
    background: #fff;
    padding: 9px 50px;
    width: 100%;
    margin: 0!important;
    border-top: 15px solid #F0F1F5;
    z-index: 99;
  }
</style>
