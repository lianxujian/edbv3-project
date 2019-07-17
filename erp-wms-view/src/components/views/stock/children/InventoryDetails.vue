<!--入库单详情 佩玖-->
<template>
  <!--表格-->
  <div id="InventoryDetails">
      <el-breadcrumb separator=">" class="col-breadcrumb" >
        <el-breadcrumb-item :to="{ path: '/EnterShelves' }" v-if="$route.params.id==8">上架</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/inStock' }" v-else>入库</el-breadcrumb-item>
        <el-breadcrumb-item>入库单详情</el-breadcrumb-item>
      </el-breadcrumb>
    <div>
      <!-- 表头 -->
      <p style="margin: 10px 0"><strong>基本信息</strong></p>

        <el-row style="margin-top: 20px" >
          <el-col :span="4">
            <div class="grid-content">
            <label  style="">入库单号：</label>
            <span>{{stockInNo}}</span>
          </div>
          </el-col>
          <el-col :span="4">
            <label >单据状态：</label>
            <span>{{status}}</span>
          </el-col>
          <el-col :span="4">
            <label>申请时间：</label>
            <span>{{proposeTime| normalTime(6)}}</span>
          </el-col>
          <el-col :span="4">
            <label >确认时间：</label>
            <span>{{confirmeTime| normalTime(6)}}</span>
          </el-col>
          <el-col :span="4">
            <label >质检时间：</label>
            <span>{{qualitTime| normalTime(6)}}</span>
          </el-col>
        </el-row>
      <el-row style="margin-top: 10px">
          <el-col :span="4">
            <div class="grid-content">
            <label  style="">申请人：</label>
            <span>{{proposer}}</span>
          </div>
          </el-col> <el-col :span="4">
            <div class="grid-content">
            <label  style="">来源单据：</label>
            <span>{{sourceOrderType}}</span>
          </div>
          </el-col>
          <el-col :span="4">
            <label >来源单号：</label>
            <span>{{sourceOrderNo}}</span>
          </el-col>
          <el-col :span="4">
            <label>三方仓同步状态：</label>
            <span>{{syncStatus}}</span>
          </el-col>
          <el-col :span="4">
            <label >三方仓处理状态：</label>
            <span>{{wmsProcessStatus}}</span>
          </el-col>
        </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="6">
          <div class="grid-content">
            <label for="searchStock">入库类型：</label>
            <el-select id="stockOutType" filterable clearable v-model="stockInType" disabled placeholder="请选择入库类型"
                       style="width: 201px!important;">
              <el-option
                v-for="item in StockOutTypeEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="xin">* </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label for="searchStock">仓库：</label>
            <el-select id="searchStock" filterable clearable disabled v-model="storageId" placeholder="请选择仓库"
                       style="width: 201px!important;">
              <el-option
                v-for="item in optionsStock"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="xin">* </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label for="searchStock">供应商：</label>
            <el-select id="supplierId" filterable disabled clearable v-model="supplierIds" placeholder="请选择供应商"
                       style="width: 201px!important;">
              <el-option
                v-for="item in supplier"
                :key="item.supplierId"
                :label="item.supplierName"
                :value="item.supplierId">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content">
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top:10px">
        <el-col :span="17">
          <div class="grid-content">
            <label for="explain" style="">入库备注：</label>
            <el-input
              maxlength="200"
              id="explain"
              disabled
              type="textarea"
              :rows="4"
              v-model="remark"
            >
            </el-input>
            <span v-if="remark!=undefined">{{remark.length}}/200</span>
            <!--<p v-show="isExplainShow" style="margin-left: 65px;margin-top:3px;color: red">请填写调整说明</p>-->
          </div>
        </el-col>
      </el-row>
      <div>
      </div>
    </div>
    <p style="margin: 10px 0"><strong>商品信息</strong></p>
    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData" style="width: 100%" fit ref="table" border max-height="650"
               >
        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column label="商品" align='left' min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt="" style="width: 30px;height: 30px;margin-right: 5px">
            <span v-show="scope.row.suitFlag==true">【套】</span><span>{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="条形码" align='center' min-width="150" prop="barCode">
        </el-table-column>

        <el-table-column label="商品编号" align='center' min-width="150" prop="goodsCode">
        </el-table-column>

        <el-table-column label="规格" align='center' min-width="150" prop="specification">
        </el-table-column>

        <el-table-column :label="item.attributeName" v-for="(item,i) in state" align="center" :key="i" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-for="(itemd,j) in scope.row.goodsAttributeAllShowBeanList">
              <span v-if="j==i">{{ itemd.attributeValue }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="商品属性" align="center" min-width="150" v-if="stockInType==2 || stockInType == 4">
          <template slot-scope="scope">
            <span  v-show="scope.row.goodsAttributeType==1">正品</span>
            <span v-show="scope.row.goodsAttributeType==2">次品</span>
            <span v-show="scope.row.goodsAttributeType==3">未知</span>
          </template>
        </el-table-column>

        <el-table-column label="应入数量" align='center' min-width="150" prop="goodsQty">
        </el-table-column>

        <el-table-column label="实入数量" align='center' min-width="150" prop="actualInQty">
        </el-table-column>

        <el-table-column label="生产日期" align='center' min-width="150" v-if="batchEnable">
          <template slot-scope="scope">
            <span>{{ scope.row.produceTime | normalTime(6) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="批次号" align='center' min-width="150" prop="batchNo" v-if="batchEnable">
        </el-table-column>

        <el-table-column label="保质期" align='center' min-width="150" v-if="batchEnable" prop="expTimeEcho">
        </el-table-column>

        <el-table-column :label="item.attributeName" v-for="(item,index) in batchoption" align='center'
                         :key="item.index" min-width="150" v-if="showBaych">
          <template slot-scope="scope">
            <span v-for="(val) in scope.row.batchoptiondataes">
            <span v-if="item.attributeName==val.attributeName">
                <span class="cen-g" v-show="val.attributeType=='2'">{{ scope.row['attributeValue'+index] }}</span>
                <span class="cen-g" v-show="val.attributeType=='1'">{{ scope.row['attributeValue'+index] }}</span>
            </span>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div style="float: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>


    </div>



    <div style="margin-top:50px ">
      <strong>操作日志：</strong>
      <v-Publiclog :paramObj="paramObj"></v-Publiclog>
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
        showBaych:'',//批次属性
        totalNum: 0, //分页总条数
        curPage: 0, //去第几页
        pageSize: 15, //当前页条数
        stockInType: '', //入库类型
        supplierIds: '', //供应商
        storageId: '',//仓库
        batchEnable: '',//行业化插件是否开启
        state: '',//自定义属性
        paramObj: {
          moduleId: 56,
          billCode: this.$route.params.stockInNo,
          typeId: ''
        },
        supplier: [],//供应商
        StockOutTypeEnum: [//入库类型

          {
            value: 1,
            label: '采购入库 '
          }, {
            value: 2,
            label: '调拨入库'
          },
          {
            value: 3,
            label: '其他入库'
          },
          {
            value: 4,
            label: '销退入库'
          },
        ],
        remark: '',//出库备注
        optionsStock: [],
        tableData: [],//表格数据
        ModiData: {     //回显数据
          stockInId: this.$route.params.stockInNo,
          size: 15,
          page: 1

        },
        batchoption: [],
        proposeTime:'',//申请时间
        confirmeTime:'',//确认时间
        qualitTime:'',//质检时间
        stockInNo:'',//入库单号
        status:'',//
        syncStatus:'', //三方仓同步状态
        wmsProcessStatus:'', //三方仓处理状态
        sourceOrderType:'',//来源单据
        sourceOrderNo:'',//来源单号
        proposer:'',//申请人
      }
    },
    mounted() {
      this.initBatchopt()
      this.Modifydtat()
      this.plugflag();//行业化插件是否开启
      this.initStock();//初始化仓库下拉
      this.supplierSum();//供应商

    },


    methods: {

      //回显入库单信息
      Modifydtat(){
        this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/getStockInInfo_page',this.ModiData)
          .then((res)=> {
            if (res.data.success) {
              this.storageId = res.data.result.storageId
              this.supplierIds = res.data.result.supplierId
              this.stockInType = res.data.result.stockInType
              this.remark = res.data.result.remark
              this.stockInNo = res.data.result.stockInNo
              this.confirmeTime = res.data.result.confirmeTime
              this.proposer = res.data.result.proposer//申请人
              this.qualitTime = res.data.result.qualitTime
              this.proposeTime = res.data.result.proposeTime
              this.sourceOrderNo = res.data.result.sourceOrderNo//来源单号
              this.totalNum=res.data.result.wmStockInPage.total
              if(res.data.result.status == 0){
                this.status='全部'
              }if(res.data.result.status == 1){
                this.status='待确认'
              }if(res.data.result.status == 2){
                this.status='已确认'
              }if(res.data.result.status == 3){
                this.status='待上架'
              }if(res.data.result.status == 4){
                this.status='已上架'
              }if(res.data.result.status == 5){
                this.status='已作废'
              }
              if (res.data.result.stockInType == 4) {
                this.sourceOrderType = '售后单'
              }
          /*    if(res.data.result.stockInType == 0){
                this.status='全部'
              }if(res.data.result.stockInType == 1){
                this.status='采购'
              }if(res.data.result.stockInType == 2){
                this.status='调拨'
              }if(res.data.result.stockInType == 3){
                this.status='其他'
              }if(res.data.result.stockInType == 4){
                this.status='销退'
              }*/
              //三方仓同步状态
              if (res.data.result.syncStatus == 1) {
                this.syncStatus = '已同步';
              } else if (res.data.result.syncStatus == 0) {
                this.syncStatus = '未同步';
              }
              //三方仓处理状态
              if (res.data.result.wmsProcessStatus == 1) {
                this.wmsProcessStatus = '已确认';
              } else if (res.data.result.wmsProcessStatus == 0) {
                this.wmsProcessStatus = '已取消';
              }
              res.data.result.wmStockInPage.rows.forEach((item, i)=> {
                item.batchoptiondataes=this.batchoption;
                if(res.data.result.status==1){
                  item.actualInQty=0
                };
                item.batchoptiondataes.forEach((value, num)=> {
                  item['attributeValue' + num] = '';
                  item['attributeValueId' + num] = '';
                });
                if (item.goodsAttrType != 3) {
                  item.goodsAttributeType = item.goodsAttrType;
                };

                if (item.wmStockInGoodsBean.goodsId == item.goodsId) {
                  item.barCode = item.wmStockInGoodsBean.barCode;
                  item.imageUrl=item.wmStockInGoodsBean.defaultImageUrl;
                  item.goodsCode = item.wmStockInGoodsBean.goodsCode;
                  item.goodsName = item.wmStockInGoodsBean.goodsName;
                  item.specification = item.wmStockInGoodsBean.specification;
                  item.goodsType = item.wmStockInGoodsBean.goodsType;
                  item.expTimeEcho = item.wmStockInGoodsBean.expTimeEcho;
                  item.suitFlag = item.wmStockInGoodsBean.suitFlag;
                  item.goodsAttributeAllShowBeanList = item.wmStockInGoodsBean.goodsAttributeShowBeanList;
                  this.state = item.wmStockInGoodsBean.goodsAttributeShowBeanList

                };

              })
              res.data.result.wmStockInPage.rows.forEach((item)=>{
                if(item.batchNo){
                  this.tableData=res.data.result.wmStockInPage.rows;
                  this.tableData.forEach((item) => {
                    if(item.batchNo!=''){
                      this._post('com.edb01.erp.wms.service.api.StorageAttributeService/' + this.version + '/getGoodsBatchAllAtribute', {
                        goodsId: item.goodsId,
                        batchNo: item.batchNo
                      }).then((res)=> {
                        if (res.data.success) {
                          res.data.result.forEach((val,n)=>{
                            item.batchoptiondataes.forEach((num)=>{
                              if (num.attributeId == val.attributeId) {
                                item['attributeValueId' + n] = val.attributeValueId;
                                item['attributeValue' + n] = val.attributeValue;
                              }

                            })
                          })
                        }
                      })
                    }

                  })
                  this.$nextTick(()=>{
                    this.showBaych = true;
                  })

                }else {
                  this.tableData=res.data.result.wmStockInPage.rows;

                }

              })
            }
          })

      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.ModiData.size=val
        this.Modifydtat()
      },
      //  当前页
      handleCurrentChange(val) {
        this.curPage = val;
        this.ModiData.page=val
        this.Modifydtat()

      },

      //行业化插件是否开启查询
      plugflag() {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryBatchFlag').then((res) => {
          if (res.data.success) {
            this.$nextTick(()=>{
              this.batchEnable = res.data.result.batchFlag;
            })


          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })

      },

      //初始化仓库下拉列表
      initStock: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/findGrantStorage').then(function (res) {
          res.data.result.forEach(function (val) {
            this.optionsStock.push({value: val.storageId, label: val.storageName})
          }.bind(this));
        }.bind(this));
      },
      //供应商
      supplierSum: function () {
        this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/getSupplierList').then(function (res) {
          this.supplier = res.data.result;
        }.bind(this));
      },
      //初始化批次属性选项
      initBatchopt: function () {
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/selectGoodsAttributeBatch').then(function (res) {

          res.data.result.forEach(function (val) {
            val.attributeValue = ''
          });
          this.batchoption = res.data.result


        }.bind(this));
      },


    }
  }
</script>
<style scoped>
  #AddOutbound {
    padding: 20px;
  }

  .pTop {
    margin-bottom: 20px;
  }

  .el-button {
    display: inline-block;
    line-height: 0
  }

  .xin {
    color: red;
  }
</style>
<style>
  #AddOutbound .el-table td, .el-table th {
    padding: 0 !important;
  }

  #AddOutbound .el-table th > .cell {
    text-align: center;
    padding: 3px 0;
    background-color: #eee;
    height: 29px;
  }

  #AddOutbound .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #eee !important;
  }

  #AddOutbound .pTop .el-input, .pTop .el-input__inner {
    width: 195px !important;
    height: 28px !important;
    line-height: inherit !important;
  }


  #AddOutbound .btnStyle {
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px !important;
    height: 30px;
  }

</style>



