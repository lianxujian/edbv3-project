<template>
  <div id='notice' style="border:1px solid #ccc;border-top:none;padding:20px;width:100%;">
   <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label='序号'
      type="index"
      width="80">
    </el-table-column>
    <el-table-column
      prop="title"
      label="公告主题"
      width="">
    </el-table-column>
    <el-table-column
      prop="creater"
      label="发布者"
      width="">
    </el-table-column>
    <el-table-column
      prop="lastPublishTime"
      width="180"
      align='left'
      label="最近发布时间">
    </el-table-column>
    <el-table-column
      label="操作"
      width="">
      <template slot-scope='scope'>
        <span style='color:#20a0ff;cursor:pointer;' @click='turnDetail(scope.row)'>查看</span>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      class='notice'
      style='float:right;margin-top:20px;'
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <div style="clear:both;"></div>
</div>
</template>

<script>
export default {
  data () {
    return {
      queryFn:()=>{},
      tableData:[],
      currentPage:1,
      total:0
    }
  },methods:{
    handleCurrentChange(page){
      var paramData={
        page:page,
        rows:20
      }
      this.queryFn(paramData);
    },
    turnDetail(row){
      if(process.env.NODE_ENV=='development'){
        location.href='http://localhost:8080/#/notice/'+row.noticeId
      }else{
        MainTab.createTab('notice_'+row.noticeId,'查看公告',process.env.API_PAGE+'notice/'+row.noticeId);
      }
    }
  },
  mounted(){
    var self = this;
    var paramData={
      page:self.currentPage,
      rows:20
    }
    this.queryFn=(paramData)=>{
      this.$axios({
        method:'post',
        url:process.env.OLD_API + 'api/login_index/getList',
        data:paramData,
        transformRequest:[function (data) {
          let newData = '';
          for(let k in data){
            newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
          }
          return newData;
        }]

      })
        .then(function (response) {
          if(response.data.code==0){
            self.tableData=response.data.result.rows;
            self.total=response.data.result.total;
          }else{
              self.$message({
                message:response.data.message,
                type: 'warning'
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    this.queryFn(paramData);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #notice table td{
      height:50px;
      text-align:center;
  }
  #notice table thead td{
      font-weight:bold;
  }
  #notice .ui-paging-container li.ui-paging-toolbar select{
      padding:0;
  }
  #pageToolbar{
      margin:40px;
  }
  #notice .ui-paging-container li.ui-paging-toolbar select{
      display:none;
  }
  #notice .notice-query{
      cursor:pointer;
      color:dodgerblue;
  }
  #notice .notice .el-pagination__sizes{
    display:none;
  }
</style>
