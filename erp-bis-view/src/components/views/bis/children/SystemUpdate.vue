<!--系统更新 秋香-->
<template>
  <div id="SystemUpdate">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/IndexBis' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统更新</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--表格-->
    <div class="pDown">
      <el-table id="tableH"
                :data="tableData"
                border :max-height="table_h"
                style="width: 100%"
      >
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="148">
        </el-table-column>
        <el-table-column
           align="left"
           label="更新内容">
          <template
            slot-scope="scope"
            >
              <el-button @click="theme(scope.row)" type="text" size="small" >{{scope.row.sysNotiTheme}}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="更新时间" align="center" >
          <template slot-scope="scope"  >
            {{ scope.row.publishTime| normalTime(6) }}
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <div class="pagination">
        <pagination
          :totalCom="total"
          :pageSizeCom="pageSize"
          :curPageCom="curPage"
          @pageSizeVal="getPageSize" @curPageVal="getCurPage"
        ></pagination>
      </div>
    </div>

  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  export default {
    components: {
      pagination,dataTime
    },
    data(){
      return{
        version: '1.0.0',
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        sysNotiType:'',//公告类型
      }
    },
    mounted(){
      this.findHistory(); //店铺查询
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods:{
     //主题
     theme(row){
        this.$router.push({name: 'UpdateDetail',params: {sysNotiId: row.sysNotiId}})
     },

      //列表查询
      findHistory(){
        let data = {
          "page": this.curPage,
          "size": this.pageSize,
          "merchantId": 0,
          "sysNotiType":'1002',
        };
        this._post('com.edb01.erp.bis.service.api.BisSysNoticeService/'+this.version+'/queryByList',data).then(function (res) {
          this.tableData=res.data.result.rows;
          this.total = res.data.result.total;
        }.bind(this))
      },

      // 关闭平台授权弹框
      handleClose() {
        this.centerP = false;
        window.clearInterval(this.timer);
      },

      // 以下是分页
      getPageSize: function (val) {
        if(val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.findHistory();
        }
      },

      getCurPage: function (val) {
        if(val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.findHistory()
        }
      },


    }
  }
</script>
<style scoped>
  .pTop{
    margin-bottom: 20px;
  }
</style>
<style>

</style>
