<!--失效店铺 秋香-->
<template>
  <div id="Reauthorization">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/IndexBis' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>失效店铺</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--表格-->
    <div class="pDown">
      <el-table id="tableH"
                :data="tableData"
                border :max-height="table_h"
                style="width: 100%"
      >

        <el-table-column label="店铺" >
          <template slot-scope="scope">
            {{ scope.row.storeName }}
          </template>
        </el-table-column>

        <el-table-column label="平台">
          <template slot-scope="scope">
            {{ scope.row.ecName}}
          </template>
        </el-table-column>

        <el-table-column label="失效时间">
          <template slot-scope="scope">
            {{ scope.row.authEndTime| normalTime(6) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="177" align="center">
          <template slot-scope="scope">
            <el-button @click="changQ(scope.row)" type="text" size="small" >重新授权</el-button>
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
        mainData:this.$router.history.current.params.id,
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        storeName:'',//店铺名称
        ecId:'',//平台
        authStatus:'',//授权状态id
        enabledFlag:'',// 是否启用
        centerP:false,//授权窗口
        platIm: {}, // 平台授权
      }
    },
    mounted(){
      this.findShop(); //店铺查询
      //表格高度
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });
    },
    methods:{

      //自动授权
      changQ(item){
        if(item.ecName == '京东'){
          //window.location.href
          window.open('http://edb.centaur.cn/edbtp/oauthhome.aspx?p=' + item.ecName + '2&e=edb_a64971&s=1&f=edb&r=http://www.edbv3.com/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/callback?clToken='+ encodeURIComponent(encodeURIComponent(encodeURIComponent(encodeURIComponent(sessionStorage.getItem('clToken'))))) +'.storeId=' + item.storeId + '&','_blank');
        }else{
          if(item.ecName == '天猫'){
            item.ecName = '淘宝';
            window.open('http://edb.centaur.cn/edbtp/oauthhome.aspx?p=' + item.ecName + '&e=edb_a64971&s=1&f=edb&r=http://www.edbv3.com/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/callback?clToken='+ encodeURIComponent(encodeURIComponent(encodeURIComponent(encodeURIComponent(sessionStorage.getItem('clToken'))))) +'.storeId=' + item.storeId + '&','_blank');
          }else{
            window.open('http://edb.centaur.cn/edbtp/oauthhome.aspx?p=' + item.ecName + '&e=edb_a64971&s=1&f=edb&r=http://www.edbv3.com/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/callback?clToken='+ encodeURIComponent(encodeURIComponent(encodeURIComponent(encodeURIComponent(sessionStorage.getItem('clToken'))))) +'.storeId=' + item.storeId + '&','_blank');
          }
        }
      },

      //店铺查询
      findShop(){
        let data = {
          "storeName": this. storeName,//店铺名称
          "ecId":this.ecId,//平台
          "authStatus":this.authStatus,//授权状态id
          "enabledFlag":this.enabledFlag,// 是否启用
          "page": this.curPage,
          "size": this.pageSize,
          "merchantId": 0
        };
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/query',data).then(function (res) {
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
          this.findShop();
        }
      },
      getCurPage: function (val) {
        if(val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.findShop()
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
