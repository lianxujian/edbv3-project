<!--查看损益单 佩玖-->
<template>
  <div id="checkCauExceSin">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/CauExceSin' }">损溢单</el-breadcrumb-item>
        <el-breadcrumb-item>查看损溢单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="stateShow">
      <el-row :gutter="12">
        <el-col :span="3">
          <div class="grid-content bg-purple" style=" white-space:nowrap "><strong>损溢单号：</strong>{{numbers}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple"><strong>状态：</strong>{{statues}}</div>
        </el-col>
        <el-col :span="3" style=" white-space:nowrap ">
          <div class="grid-content bg-purple" ><strong>仓库：</strong>{{warehouse}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple"><strong>单据来源：</strong>{{source}}</div>
        </el-col>
      </el-row>
    </div>


    <!--损益单明细-->
    <div class="pDown" style="width: 650px;margin-bottom: 50px">
      <strong>损溢单明细：</strong>

      <el-table :data="tableData" border style="width: 100%;margin-bottom: 50px">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="商品名称" width="110">
          <template slot-scope="scope">
            <div v-show="scope.row.goodsQty!==0">
              <p class="cen-g">{{ scope.row.goodsName }}</p>
            </div>

          </template>
        </el-table-column>

        <el-table-column label="条形码" width="200">
          <template slot-scope="scope">
            <div v-show="scope.row.goodsQty!==0">
              <p class="initP-g">{{ scope.row.barCode }}</p>
            </div>

          </template>
        </el-table-column>

        <el-table-column label="商品属性">
          <template slot-scope="scope">
            <div v-show="scope.row.goodsQty!==0">
              <p class="cen-g" v-show="scope.row.goodsType==1">正品</p>
              <p class="cen-g" v-show="scope.row.goodsType==2">次品</p>
            </div>

          </template>
        </el-table-column>

        <el-table-column label="损溢数量">
          <template slot-scope="scope">
            <p class="cen-g"><span v-show="scope.row.goodsQty>0">+</span>{{ scope.row.goodsQty }}</p>
          </template>
        </el-table-column>


      </el-table>

    </div>


    <div>
      <strong>操作日志：</strong>
      <v-Publiclog :paramObj="paramObj"></v-Publiclog>
    </div>

    <!--</div>-->
    <div class="wmsFoot">
      <el-button size="mini" @click="back()">返回</el-button>
    </div>
  </div>
</template>
<script>
  import publicLog from '@/components/common/publicLog.vue'
  export default {
    components: {
      'v-Publiclog': publicLog
    },

    data() {
      return {
        version: '1.0.0',
        numbers: '',  //单据号
        statues: '',  // 状态
        warehouse: '', //仓库
        source: '',    //来源单据
        optionsStock: [{value: '', label: '全部'}],//仓库下拉
        paramObj:{
          moduleId:44,
          billCode:this.$route.params.objdata.stockProfitlossId,
          typeId:''
        },

        storageId: '',//仓库
        tableDataLog: [],
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1 //当前页数
      }
    },
    mounted() {
      this.isTrue()
    },
    methods: {

      //初始化仓库下拉列表
      initStock: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.optionsStock.push({value: val.storageId, label: val.storageName})
          }.bind(this));
        }.bind(this));
      },
      //损益单明细淑数据列表
      isTrue() {
        let self = this

        let arr = this.$route.params.objdata
        let id = arr.stockProfitlossId
        this.numbers = arr.profitlossNo
        this.warehouse = arr.storageName

        self._post('com.edb01.erp.wms.service.api.WmStockProfitlossService/'+this.version+'/queryLinkById', {
          stockProfitlossId: id,

        }).then(function (res) {

          self.tableData = res.data.result.wmStockProfitlossItemEditBeanList
          if(res.data.result.sourceType==1001){
            self.source ="调整单"
          }else if(res.data.result.sourceType==1002){
            self.source ="第三方盘点单"
          }

          if(res.data.result.status==1001){
            self.statues = "待审核"
          }else if(res.data.result.status==1002){
            self.statues ="已审核"
          }else if(res.data.result.status==1003){
             self.statues = "审核拒绝"
          }else if(res.data.result.status==1004){
             self.statues = "已作废"
          }
        }).catch(function (err) {
          console.log(err)
        })


      },
//      返回
      back() {
        this.$router.push("CauExceSin")
      },


    }
  }
</script>
<style scoped>
  .pTop {
    margin-bottom: 20px;

  }

</style>
<style>
  #checkCauExceSin .el-textarea {
    width: 82%;
  }

  #checkCauExceSin .el-table .cell {
    text-align: center;
  }
</style>
