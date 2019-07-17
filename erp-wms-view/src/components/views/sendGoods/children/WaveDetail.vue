<!--波次明细 秋香-->
// 组件b
<template>
  <!--表格-->
  <div id="WaveDetail">
    <el-breadcrumb separator=">" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/WaveList' }">波次列表</el-breadcrumb-item>
      <el-breadcrumb-item>波次明细</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs type="border-card">
      <el-tab-pane label="波次订单">
        <div class="pDown" >
            <el-table  ref="multipleTable"
                       :data="tableData"
                       tooltip-effect="dark"
                       border style="width: 100%"
            >

            <el-table-column label="订单号" min-width="100" prop="orderSerialNum">
            </el-table-column>

            <el-table-column label="波次编号" min-width="100" prop="waveOrderNo">
            </el-table-column>

            <el-table-column label="波次类型" min-width="100">
              <template slot-scope="scope">
                <span class="initP-g" v-show="scope.row.waveType ==1001">全部</span>
                <span class="initP-g" v-show="scope.row.waveType == 1002">自定义波次</span>
                <span class="initP-g" v-show="scope.row.waveType == 1003">多品订单波次</span>
                <span class="initP-g" v-show="scope.row.waveType == 1004">大宗订单波次</span>
                <span class="initP-g" v-show="scope.row.waveType == 1005">单品订单波次</span>
                <span class="initP-g" v-show="scope.row.waveType == 1006">单件混合波次</span>
                <span class="initP-g" v-show="scope.row.waveType == 1007">手工波次</span>
              </template>
            </el-table-column>

            <el-table-column label="订单编号" min-width="100" prop="salesOrderNo">
            </el-table-column>

            <el-table-column label="商品数量" min-width="100" prop="goodsQty">
            </el-table-column>

            <el-table-column label="快递" min-width="100" prop="expressName">
            </el-table-column>

            <el-table-column label="快递单号" min-width="100">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.expressNo" :disabled="scope.row.expressPrintStatus == 1002"
                         @blur="moveNo(scope.row,scope.$index)" :maxlength="50"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="快递单打印状态" min-width="100">
              <template slot-scope="scope">
                <span class="initP-g" v-show="scope.row.expressPrintStatus ==1001">未打印</span>
                <span class="initP-g" v-show="scope.row.expressPrintStatus == 1002">已打印</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <span class="cen-g">
                  <el-button  @click="delIndex(scope.row)" type="text" size="small">剔除波次</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="波次商品">
        <div class="pDown">
              <el-table  ref="multipleTable"
                         tooltip-effect="dark"
                         :data="tableDataShell"
                         border style="width: 100%"
              >
              <el-table-column
                label="序号"
                type="index"
                align="center"
                width="45">
              </el-table-column>

              <el-table-column label="波次编号" min-width="100" prop="waveOrderNo">
              </el-table-column>

              <el-table-column label="波次类型" min-width="100">
                <template slot-scope="scope">
                  <span class="initP-g" v-if="scope.row.waveType==1002">自定义波次</span>
                  <span class="initP-g" v-if="scope.row.waveType==1003">多品订单波次</span>
                  <span class="initP-g" v-if="scope.row.waveType==1004">大宗订单波次</span>
                  <span class="initP-g" v-if="scope.row.waveType==1005">单品订单波次</span>
                  <span class="initP-g" v-if="scope.row.waveType==1006">单件混合波次</span>
                </template>
              </el-table-column>

            <el-table-column label="条形码" prop="barCode">
            </el-table-column>

            <el-table-column label="商品名称"
                             :show-overflow-tooltip="true"
                             prop="goodsName">
            </el-table-column>

              <el-table-column label="规格" prop="spec">
              </el-table-column>

            <el-table-column label="库位" prop="storageBinName">
            </el-table-column>

            <el-table-column label="应拣数量" prop="pickQty">
            </el-table-column>


            <el-table-column label="订单分布" width="140" prop="ordersDistribute">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!--操作日志-->
      <div class="col-nav" style="margin:20px 0 10px">
        <ul>
          <li><span>操作日志</span></li>
        </ul>
      </div>
      <!--日志表格-->
      <publicLog :paramObj="paramObj"></publicLog>

      <div >
        <div style="margin-top:100px;margin-bottom:20px;text-align: center">
          <router-link :to="{path: '/WaveList'}">
            <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;" round @click="">返回</el-button>
          </router-link>
        </div>
      </div>

    </el-tabs>
  </div>
</template>
<script>
 // import pagination from '@/components/common/Pagination.vue'
  import publicLog from '@/components/common/publicLog.vue';
  export default {
    components: {
      publicLog
    },
    data() {
      return {
        queryFnT: () => {
        }, // 定义方法全局调用
        version:'1.0.0',
        optionsSuit:[
          {
          value: '选项1',
          label: '北京仓'
        }, {
          value: '选项2',
          label: '上海仓'
        }, {
          value: '选项3',
          label: '广州仓'
        }, {
          value: '选项4',
          label: '成都仓'
        }, {
          value: '选项5',
          label: '武汉仓'
        }],//仓库下拉
        stock: [],//仓库
        id:'',//商品名称
        tableData: [],//表格数据
        tableDataShop: [],//表格数据
        tableDataShell:[],//波次商品
        tableData2: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        isenable: [{//状态下拉
          value: '选项1',
          label: '是'
        }, {
          value: '选项2',
          label: '否'
        }],
        isSuit: '',//是否套装
        shelves:false,//完成上架弹窗
        stockWaveIds:'',//获取的id
        stockWaveId:this.$router.history.current.params.stockWaveId,//波次id
        waveOrderNo:this.$router.history.current.params.waveOrderNo,//波次编号
        paramObj:{
          moduleId:'41',
          billCode: this.$router.history.current.params.stockWaveId
        },//日志
        data:{
          stockWaveId:this.$router.history.current.params.stockWaveId,//波次id
          waveOrderNo:this.$router.history.current.params.waveOrderNo,//波次编号
        },
        isShowOne:false
      }
    },

    mounted(){

    },
    methods:{
      //快递单号校验
      moveNo(row){
        let isShow=''
        if(row.expressNo==row.originalExpressNo){
          return false
        }else{
        this.tableData.forEach((item)=>{
          if(row.expressName.indexOf("纸质") != -1&&row.expressNo==item.originalExpressNo){
                this.$message({
                  message: '不能修改为相同单号的校验',
                  type: 'warning'
                });
                isShow=1
          }
          return false
        })
        }
        if(row.expressNo==undefined||row.expressNo==''){
          if(isShow==1){
            return false
          }else{
            this.$message({
              message: '请输入快递单号！',
              type: 'warning'
            });
          }
        }else{
          var self=this;
          var paramData = {
            stockWaveId:self.stockWaveId,//波次订单明细id
            salesOrderId:row.salesOrderId,//订单id
            expressNo:row.expressNo,
          }
          self._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/alertExpressNo',paramData)
            .then(function (response) {
              if (response.data.success == true) {
                row.expressNo= row.expressNo
              }else {
                row.expressNo= row.expressNo
                self.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      },

      //剔除波次
      delIndex(row){
        var self=this;
        var paramData = {
          merchantId:0,//商户id
          stockWaveId:self.stockWaveId,//波次订单明细id
          waveGoodsItemId:'',//波次商品id
          stockWaveItemId:row.stockWaveItemId,//波次订单明细id
          salesOrderId:row.salesOrderId,//订单id
          salesOrderNo:row.salesOrderNo,
          goodsQty:row.goodsQty,
        }
        self._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/eliminateOrderFromWave',paramData)
          .then(function (response) {
            if (response.data.success == true) {
              self.$message({
                type: 'success',
                message: '剔除成功!',
              })
              self.queryFnT(self.data);
            }else {
              self.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //波次详情 商品展示
      shop(){
        var self = this;
        let waveTypeOne=''
        if(self.$router.history.current.params.waveType==undefined){
          waveTypeOne=''
        }else{
          waveTypeOne=self.$router.history.current.params.waveType
        }
        var paramData = {
          stockWaveId:self.stockWaveId,//波次id
          waveOrderNo:self.waveOrderNo,//波次编号
          waveType:waveTypeOne,//波次类型
          merchantId:0,//商户id
        }
        self._post('com.edb01.erp.wms.service.api.WmStockWaveGoodsItemService/'+this.version+'/queryLinkWmStockWaveGoodsOrder',paramData)
          .then(function (response) {
            if (response.data.code == 0) {
              self.tableDataShell=response.data.result;
            } else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
     },

    //订单获取列表
    created() {
      this.shop();
      // 登录获取token
      if (sessionStorage.getItem('clToken')) {
        this.token = sessionStorage.getItem('clToken')
      }
      var self = this;
      var paramData = {
        stockWaveId:self.stockWaveId,//波次id
        waveOrderNo:self.waveOrderNo,//波次编号
        merchantId:0,//商户id
      }
      this.queryFnT = (paramData) => {
        self._post('com.edb01.erp.wms.service.api.WmStockWaveItemService/'+this.version+'/queryList',paramData)
          .then(function (response) {
            if (response.data.code == 0) {
              self.tableData = response.data.result;
            } else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.queryFnT(paramData);
    },
  }
</script>
<style scoped>
  #WaveDetail{
    padding: 20px;
  }
  .pTop{
    margin-bottom: 20px;
  }
  .el-button {
    display: inline-block;
    line-height: 0
  }
</style>
<style>
  #WaveDetail  .el-table td, .el-table th{
    padding: 0!important;
  }
  #WaveDetail .el-table th>.cell {
    text-align: center;
    padding: 3px 0;
    background-color: #eee;
    height: 29px;
  }
  #WaveDetail .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #eee!important;
  }
  #WaveDetail .pTop .el-input,.pTop .el-input__inner{
    width: 195px!important;
    height: 28px!important;
    line-height: inherit!important;
  }
  #WaveDetail  .col-nav{
    width: 100%;
    height: 28px!important;
    background: #F7F7F7;
  }
  #WaveDetail .btnStyle{
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px!important;
    height: 30px;
  }

</style>



