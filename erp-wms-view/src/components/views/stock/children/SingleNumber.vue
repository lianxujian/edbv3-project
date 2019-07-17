<!--上架单详情 秋香-->
<template>
  <!--表格-->
  <div id="SingleNumber">
    <div style="margin-bottom: 10px">
      <el-breadcrumb separator=">" class="col-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/EnterShelves' }">上架</el-breadcrumb-item>
        <el-breadcrumb-item>上架单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="pDown">
      <el-tabs type="border-card">
        <el-tab-pane label="上架商品">
          <el-table :data="tableDataGood"
                    border
                    style="width: 100%"
                    :height="table_h1"
                    id="tableH">
            <el-table-column
              align="center"
              type="index"
              label="序号">
            </el-table-column>

            <el-table-column label="条形码" min-width="100" prop="barCode">
            </el-table-column>

            <el-table-column label="商品名称" min-width="100" prop="goodsName">
            </el-table-column>

            <el-table-column label="批次号" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.batchNo != 0" class="initP-g">{{ scope.row.batchNo }}</span>
              </template>
            </el-table-column>

            <el-table-column label="拣货库区" min-width="100" prop="sourceSectionName">
            </el-table-column>

            <el-table-column label="拣货库位" min-width="100" prop="sourceStorageBinName">
            </el-table-column>

            <el-table-column label="库位类型" min-width="100">
              <template slot-scope="scope">
                <span class="initP-g" v-if="scope.row.sourceBinType==1">正品</span>
                <span class="initP-g" v-if="scope.row.sourceBinType==2">次品</span>
              </template>
            </el-table-column>

            <el-table-column label="应上数量" min-width="100" prop="oughtQty">
            </el-table-column>

            <el-table-column label="实上数量" width="100" prop="realQty">
            </el-table-column>
          </el-table>

        <!--操作日志-->
        <div class="col-nav" style="margin:20px 0 10px;">
          <ul>
            <li><span>操作日志</span></li>
          </ul>
        </div>
        <!--日志表格-->
        <div id="hight1">
          <publicLog :paramObj="paramObj" ></publicLog>
        </div>

        </el-tab-pane>

        <el-tab-pane label="上架任务" value="2">
          <div class="col-height">
            <el-table :data="tableDataList"
                      id="fitTable"
                      :height="table_h"
                      border style="width: 100%">
              <el-table-column
                align="center"
                type="index"
                label="序号">
              </el-table-column>

              <el-table-column label="条形码" min-width="100" prop="barCode">
              </el-table-column>

              <el-table-column label="商品名称" min-width="140" prop="goodsName">
              </el-table-column>

              <el-table-column label="批次号" min-width="100">
                <template slot-scope="scope">
                  <span class="initP-g" v-if="scope.row.batchNo != 0">{{ scope.row.batchNo }}</span>
                </template>
              </el-table-column>

              <el-table-column label="上架库区" min-width="100" prop="targetSectionName">
              </el-table-column>

              <el-table-column label="上架库位" min-width="100" prop="targetStorageBinName">
              </el-table-column>

              <el-table-column label="库位类型" min-width="100">
                <template slot-scope="scope">
                  <span class="initP-g" v-if="scope.row.targetBinType==1">正品</span>
                  <span class="initP-g" v-if="scope.row.targetBinType==2">次品</span>
                </template>
              </el-table-column>

              <el-table-column label="应上数量" min-width="140" prop="oughtQty">
              </el-table-column>

              <el-table-column label="实上数量" width="140">
                <template slot-scope="scope">
                  <el-input id="id" v-model="scope.row.realQty" :disabled="isShowTime" placeholder="请输入内容"
                            @blur="testC(scope.row)"
                            @keyup.native="scope.row.realQty = scope.row.realQty.replace(/[^\d]/g,'')"></el-input>
                </template>
              </el-table-column>

            </el-table>

          </div>
        </el-tab-pane>
        <div class="wmsFoot">
          <el-button @click="backClick" size="mini" type="info" style="line-height: 14px">返 回</el-button>
        </div>

        <div class="wmsFoot">
              <span>
              <el-button style="line-height: 14px" @click="backClick" type="info">返 回</el-button>
              </span>
          <span v-if="isShowStatus">
               <el-button style="line-height: 14px" plain @click="addAll()">仅保存</el-button>
               <el-button style="line-height: 14px" type="primary" @click="complateShelves()">完成上架</el-button>
             </span>
        </div>
      </el-tabs>
    </div>
    <div>
      <el-dialog v-dialogDrag
        title="提示"
       :beforeClose="cancelOne"
        :visible.sync="shelves"
        width="800px"
        center>
        <div style="width: 100%;margin-top:-10px;text-align: center">
          <i style="font-size: 16px;color: red;" class="el-icon-warning"></i>
          <span style="font-size: 14px;margin-left: 10px">以下目标库位未完成上架，是否重新分配上架库位？</span>
          <div class="" style="margin-top: 20px">
            <el-table :data="successTableData" border style="width:100%;"    >
              <el-table-column
                align="center"
                type="index"
                label="序号">
              </el-table-column>
              <el-table-column label="条形码" prop="barCode">
              </el-table-column>
              <el-table-column label="上架库位" prop="targetStorageBinName">
              </el-table-column>
              <el-table-column label="应上数量" prop="oughtQty">
              </el-table-column>
              <el-table-column label="实上数量" prop="realQty">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin-top:20px;margin-bottom:20px;text-align: right">
          <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                     @click="cancelOne()">取消
          </el-button>
          <el-button class="btnStyle" v-loading.fullscreen.lock="fullscreenLoading"
                     style="margin:0;background-color:#49A0F5;color:white;border:none;" @click="sureShelves()">确定
          </el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :beforeClose="handaddOne"
        :visible.sync="handadd"
        width="800px"
        center>
        <div style="width: 100%;margin-top:-10px;text-align: center">
          <i style="font-size: 16px;color: red;" class="el-icon-warning"></i>
          <span style="font-size: 14px;margin-left: 10px">以下是系统为未完成上架商品自动推荐的上架库位，您也可以手工为商品指定上架库位!</span>
          <div class="" style="margin-top: 20px">
            <el-table :data="tableData"
                      border>
              <el-table-column
                label="序号"
                align="center"
                type="index"
              >
              </el-table-column>
              <el-table-column label="商品名称" min-width="100" prop="goodsName">
              </el-table-column>

              <el-table-column label="条形码" prop="barCode">
              </el-table-column>

              <el-table-column label="批次号" min-width="100" prop="batchNo">
              </el-table-column>

              <el-table-column label="库位类型" min-width="100">
                <template slot-scope="scope">
                  <span class="initP-g" v-if="scope.row.sourceBinType==1">正品</span>
                  <span class="initP-g" v-if="scope.row.sourceBinType==2">次品</span>
                </template>
              </el-table-column>

              <el-table-column label="上架库位" align="center">
                <template slot-scope="scope">
                  <div v-if="!scope.row.isShowNum">
                    <el-input type="text" v-model="scope.row.storageBinName"
                              @blur="holdNum(scope.row,scope.$index)"></el-input>
                  </div>
                  <div v-if="scope.row.isShowNum">
                    <el-input type="text" v-model="scope.row.storageBinName" style="border: 1px solid red;"
                              @blur="holdNum(scope.row,scope.$index)"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="应上数量" prop="oughtQty">
              </el-table-column>
              <el-table-column label="实上数量">
                <template slot-scope="scope" align="center">
                  <div v-if="!scope.row.isShowNum">
                    <el-input type="text" v-model="scope.row.realQty"></el-input>
                  </div>
                  <div v-if="scope.row.isShowNum">
                    <el-input type="text" v-model="scope.row.realQty" style="border: 1px solid red;"></el-input>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin-top:20px;margin-bottom:20px;text-align: right">
          <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                     @click="handaddOne()">取消
          </el-button>
          <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                     @click="sureShelvesOne()">确定
          </el-button>
        </div>

      </el-dialog>
    </div>


  </div>
</template>
<script>
  // import pagination from '@/components/common/Pagination.vue'
  import publicLog from '@/components/common/publicLog.vue';
  export default {
    components: {
      publicLog,
    },
    data() {
      return {
        version: '1.0.0',//版本号
        //arrAy: '',
        fullscreenLoading: false,
        stock: [],//仓库
        id: '',//条形码
        tableData: [],//未完成上架商品上架库位
        tableDataGood: [],//上架商品信息
        tableDataList: [],//上架任务信息
        successTableData: [],//重新分配上架库位
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        isenable: [{
          value: '选项1',
          label: '是'
        }, {
          value: '选项2',
          label: '否'
        }],//状态下拉
        isSuit: '',//是否套装
        shelves: false,//完成上架弹窗// 上架任务
        handadd: false,//未完成上架商品上架库位弹窗
        table_h: 0,//表格默认高度
        table_h1: 0,//表格默认高度
        hight1:0,//表格默认高度
        stockPutawayId: '',//上架单id
        stockPutawayItemId: '',//上架单id
        realQty: '',//实上数量
        paramObj: {
          moduleId: '42',
          billCode:this.$router.history.current.params.stockPutawayId,
        },//日志
        isShowTime: false,//实上数量禁用按钮
        putawayStatus: '',//上架状态
        loading: false,//正在加载中
        isShowStatus: false,//状态
        value: '',//上架
        isShowNum: false,//实上数量
        storageBinName:''//上架库位
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('.col-height').offset().top - 260);
      });

      this.$nextTick(function () {
        var a = document.body.clientHeight// 页面高度
        var b = document.getElementById('tableH').offsetTop // 表格距离顶部的距离
        this.table_h1 = a - b - 580
      })
      this.messages();
    },
    methods: {
      //未完成上架库位取消按钮
      cancelOne(){
         this.shelves=false
         this.messages();
      },

      //未完成上架库位取消按钮
      handaddOne(){
         this.handadd=false
         this.messages();
      },

      //上架库位
      holdNum(row) {
        this.storageBinName= row.storageBinName
      },

      /*isYes(){
        let arr1 = [];
        let arr2 = []
        this.tableData.forEach((item) => {
          arr1.push(item.oughtQty)
          arr2.push(item.realQty)

        })

        if (eval(arr1.join('+')) != eval(arr2.join('+'))) {
          this.successTableData = this.tableData;
          this.shelves = true;
          return false;

        }
        let data = []
        //  var c=this.successTableData.concat(this.tableData);
        // var c=this.tableDataList.concat(this.arrAy);
        var addDataW = {
          merchantId: 0,//商户id
          wmStockPutawayItemPOParamListStr: JSON.stringify(this.arrAy),
          stockPutawayId: this.$router.history.current.params.stockPutawayId,
          storageId: this.$router.history.current.params.storageId,
        }
        this._post('com.edb01.erp.wms.service.api.WmStockPutawayService/' + this.version + '/confirmReAllotStorageBin', addDataW).then(function (res) {
          if (res.data.success == true) {
            this.handadd = false
            this.messages()
          } else {
            this.successTableData = []
            this.shelves = true;
            this.tableData.forEach((item, index) => {
              if (item.realQty < item.oughtQty) {
                //     exit = true;
                this.shelves = true
                //  self.successTableData=self.tableDataList
                this.successTableData.push({
                  barCode: item.barCode,
                  batchNo: item.batchNo,
                  goodsId: item.goodsId,
                  goodsName: item.goodsName,
                  goodsQty: item.goodsQty,
                  oughtQty: item.oughtQty,
                  realQty: item.realQty,
                  sourceAisleCode: item.sourceAisleCode,
                  sourceBinType: item.sourceBinType,
                  sourceSectionName: item.sourceSectionName,
                  sourceStorageBinId: item.sourceStorageBinId,
                  sourceStorageBinName: item.sourceStorageBinName,
                  sourceStorageSectionId: item.sourceStorageSectionId,
                  stockPutawayId: item.stockPutawayId,
                  stockPutawayItemId: item.stockPutawayItemId,
                  storageBinId: item.storageBinId,
                  targetAisleCode: item.targetAisleCode,
                  targetBinType: item.targetBinType,
                  targetSectionName: item.targetSectionName,
                  targetStorageBinId: item.targetStorageBinId,
                  targetStorageBinName: item.targetStorageBinName,
                  targetStorageSectionId: item.targetStorageSectionId,
                })
              }
              if (item.realQty == item.oughtQty) {
                this.shelves = false;
                this.messages();
              }
            })
          }
        }.bind(this));
      },*/

      //分配确定按钮
      sureShelvesOne() {
        let isNumber=0
        let isStrue=''
        this.tableData.forEach((item, index) => {
          if (item.realQty == item.oughtQty) {
            isNumber++
          }
          if(item.storageBinName==this.storageBinName){
          isStrue=1
          }else{
            isStrue=2
          }
        })
        let nub=this.tableData.length
      if(isNumber==nub&&isStrue==2){
        this.handadd=false
        this.messages();
      }else{
        const loading = this.$loading({
          lock: true,
          text: 'loding',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.shelves = false;
        this.loading = true;
        let dataList=[]
        this.tableData.forEach((item, index) => {
          dataList.push({
            goodsName:item.goodsName,
            batchNo:item.batchNo,
            sourceBinType:item.sourceBinType,
            barCode:item.barCode,
            oughtQty:item.oughtQty,
            realQty:item.realQty,
            storageBinName:item.storageBinName,
            stockPutawayItemId:item.stockPutawayItemId
          })})
        let addDataW = {
          wmStockPutAwayBeanJson:JSON.stringify( dataList)
        }
        this._post('com.edb01.erp.wms.service.api.StockPutAwayService/' + this.version + '/putAway',addDataW)
          .then(res => {
            if (res.data.success) {
              if(res.data.result.length==0){
                this.messages();
                this.handadd = false
                loading.close();
              }else{
                this.handadd = true;
                this.shelves=false
                let arr1=[]
                res.data.result.forEach((item, index) => {
                  arr1.push({
                    barCode:item.barCode,
                    oughtQty:item.oughtQty,
                    realQty:item.realQty,
                    storageBinName:item. storageBinName,
                    stockPutawayItemId:item.stockPutawayItemId
                  })})
                this.tableData=  arr1
                loading.close();
              }
            } else {
              loading.close();
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
       }
      },

      //点击返回
      backClick: function () {
        this.$router.push('/EnterShelves')
      },

     //实上数量校验
      testC(row) {
        console.log(row);
      },

      //初始化数据获得上架商品和上架任务
      messages() {
        var self = this;
        //查询上架单详情
        var paramData = {
          merchantId: 0,//商户id
          stockPutawayId: self.$router.history.current.params.stockPutawayId
        }
        this.queryFn = (paramData) => {
          self._post('com.edb01.erp.wms.service.api.WmStockPutawayItemService/' + this.version + '/queryList', paramData)
            .then(function (response) {
              if (response.data.code == 0) {
                self.tableDataList = response.data.result.wmStockPutawayItemEditBeanList;//上架任务
                self.tableDataGood = response.data.result.goodsBeanMapList;//上架商品
                if (self.$router.history.current.params.putawayStatus == 1004 || self.$router.history.current.params.putawayStatus == 1001) {//已完成上架||待分配
                  self.isShowTime = true
                  self.isShowStatus = false
                } else {
                  self.isShowStatus = true
                }
              } else {
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
        this.queryFn(paramData);
      },

      //完成上架
      complateShelves() {
        this.successTableData = []
        if (this.isShowTime == true) {

        } else {
          var self = this
          let exit = false;
          self.tableDataList.forEach((item, index) => {
            if (item.realQty < item.oughtQty) {
              exit = true;
              self.shelves = true
              //  self.successTableData=self.tableDataList
              this.successTableData.push({
                barCode: item.barCode,
                batchNo: item.batchNo,
                goodsId: item.goodsId,
                goodsName: item.goodsName,
                goodsQty: item.goodsQty,
                oughtQty: item.oughtQty,
                realQty: item.realQty,
                sourceAisleCode: item.sourceAisleCode,
                sourceBinType: item.sourceBinType,
                sourceSectionName: item.sourceSectionName,
                sourceStorageBinId: item.sourceStorageBinId,
                sourceStorageBinName: item.sourceStorageBinName,
                sourceStorageSectionId: item.sourceStorageSectionId,
                stockPutawayId: item.stockPutawayId,
                stockPutawayItemId: item.stockPutawayItemId,
                storageBinId: item.storageBinId,
                targetAisleCode: item.targetAisleCode,
                targetBinType: item.targetBinType,
                targetSectionName: item.targetSectionName,
                targetStorageBinId: item.targetStorageBinId,
                targetStorageBinName: item.targetStorageBinName,
                targetStorageSectionId: item.targetStorageSectionId,
                /*   realQty:item.realQty,
                   oughtQty:item.oughtQty,
                   targetStorageBinName:item.targetStorageBinName,
                   barCode:item.barCode,
                   storageId:item.storageId,
                   binType:item.binType,
                   batchNo:item.batchNo,
                   goodsId:item.goodsId,
                   targetStorageBinId:item.targetStorageBinId,
                   targetStorageSectionId:item.targetStorageSectionId*/
              });
            }
            //   arr.push(item. realQty);
            /*   if (item.realQty=='') {
                 self.shelves=false
                 exit = true;
                 self.$message({
                   message: '实上数量不可为空！',
                   type: 'warning'
                 })
               }
               if (item.realQty==0) {
                 self.shelves=false
                 exit = true;
                 self.$message({
                   message: '实上数量不可为0！',
                   type: 'warning'
                 })
               }*/
            if (item.realQty > item.oughtQty) {
              self.shelves = false
              exit = true;
              self.$message({
                message: '实上数量不能大于应上数量!！',
                type: 'warning'
              })
            }
          })
          if (exit) {
            return false;
          }
        }
        self.loading = true;
        var addDataW = {
          merchantId: 0,//商户id
          wmStockPutawayItemPOParamListStr: JSON.stringify(this.tableDataList),
          stockPutawayId: self.$router.history.current.params.stockPutawayId,
          putawayType: self.$router.history.current.params.putawayType,
          sourceOrderId: self.$router.history.current.params.sourceOrderId
        }
        const loading = this.$loading({
          lock: true,
          text: 'loding',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        self._post('com.edb01.erp.wms.service.api.WmStockPutawayService/' + this.version + '/finishPutaway', addDataW)
          .then(res => {
            if (res.data.success == true) {
              if (res.data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '保存成功!',
                })
                self.$router.push('/EnterShelves')
                loading.close();
              } else if (res.data.code == 500000004) {
                self.$message({
                  type: 'warning',
                  message: '实上数量不能大于应上数量!',
                })
                loading.close();
              } else if (res.data.code == 500000003) {
                self.$message({
                  type: 'warning',
                  message: '请分配上架人!',
                })
                loading.close();
              }
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
              loading.close();
            }
          })
      },

      //重新分配上架库位
      sureShelves() {
        const loading = this.$loading({
          lock: true,
          text: 'loding',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });//加载
        this.shelves = false;
        this.loading = true;
        let dataList=[]
        this.successTableData.forEach((item, index) => {
          dataList.push({
              barCode:item.barCode,
              oughtQty:item.oughtQty,
              realQty:item.realQty,
              storageBinName:item.targetStorageBinName,
              stockPutawayItemId:item.stockPutawayItemId
            })})
        let addDataW = {
          wmStockPutAwayBeanJson:JSON.stringify( dataList)
        }
        this._post('com.edb01.erp.wms.service.api.StockPutAwayService/' + this.version + '/putAway',addDataW)
          .then(res => {
            if (res.data.success) {
              this.handadd = true;
              this.tableData=res.data.result;
              loading.close();
            } else {
                loading.close();
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
            }
          })
      },

//      以下是分页
      getPageSize: function (val) {
        //存储每页数量
        this.pageSize = val;
      },
      getCurPage: function (val) {
        if (val != undefined) {
          this.curPage = val
        }
      },

      //仅保存
      addAll() {
        if (this.isShowTime == true) {

        } else {
          var self = this
          let arr = [];
          let exit = false;
          self.tableDataList.forEach(item => {
            arr.push(item.realQty);
            if (item.realQty > item.oughtQty) {
              exit = true;
              self.$message({
                message: '实上数量不可超过应上数量！',
                type: 'warning'
              })
            }
            if (item.realQty == '') {
              exit = true;
              self.$message({
                message: '实上数量不可为空！',
                type: 'warning'
              })
            }
            if (item.realQty == 0) {
              exit = true;
              self.$message({
                message: '实上数量不可为0！',
                type: 'warning'
              })
            }
            if (item.realQty == 0) {
              exit = true;
              self.$message({
                message: '实上数量不可为0！',
                type: 'warning'
              })
            }
          })
          if (exit) {
            return false;
          }
        }
        var self = this
        self.loading = true;
        var addDataW = {
          merchantId: 0,//商户id
          wmStockPutawayItemPOParamListStr: JSON.stringify(self.tableDataList),
          stockPutawayId: self.$router.history.current.params.stockPutawayId,
        }
        const loading = this.$loading({
          lock: true,
          text: 'loding',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        self._post('com.edb01.erp.wms.service.api.WmStockPutawayService/' + this.version + '/save', addDataW)
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                type: 'success',
                message: '保存成功!',
              })
              self.$router.push('/EnterShelves')
              loading.close();
            }
            if (res.data.code == 500000004) {
              self.$message({
                type: 'warning',
                message: res.data.msg,
              })
              loading.close();
            }
            if (res.data.code == 500000003) {
              self.$message({
                type: 'warning',
                message: '请分配上架人',
              })
              loading.close();
            }
          })
          .catch(function (error) {
            console.log(error);
          });

      }
    }
  }
</script>
<style scoped>
  #SingleNumber {
    padding: 20px;
  }

  .pTop {
    margin-bottom: 20px;
  }

  .el-button {
    display: inline-block;
    line-height: 0
  }
</style>
<style>
  #SingleNumber .el-table td, .el-table th {
    padding: 0 !important;
  }

  #SingleNumber .el-table th > .cell {
    text-align: center;
    padding: 3px 0;
    background-color: #eee;
    height: 29px;
  }

  #SingleNumber .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #eee !important;
  }

  #SingleNumber .pTop .el-input, .pTop .el-input__inner {
    width: 195px !important;
    height: 28px !important;
    line-height: inherit !important;
  }

  #SingleNumber .col-nav {
    width: 100%;
    height: 28px !important;
    background: #F7F7F7;
  }

  #SingleNumber .btnStyle {
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px !important;
    height: 30px;
  }

  #SingleNumber .save {
    position: fixed;
    bottom: 20px;
    right: 0;
    width: 100%;
    text-align: center;
  }

  #SingleNumber .el-button[data-v-60b7066a] {
    display: inline-block;
    line-height: 15px;
  }

</style>



