<!--出库单审核 佩玖-->
// 组件b
<template>
  <!--表格-->
  <div id="OutboundDetail">
    <el-breadcrumb separator=">" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/OutStock' }">出库</el-breadcrumb-item>
      <el-breadcrumb-item>出库单审核</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表头 -->
    <div>
      <p style="margin: 10px 0"><strong>基本信息</strong></p>
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <label for="searchStock">出库类型：</label>
            <el-select id="stockOutType" filterable v-model="stockOutType" placeholder="请选择出库类型"
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
            <el-select id="searchStock" filterable v-model="storageId" placeholder="请选择仓库"
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
        <el-col :span="7">
          <div class="grid-content">
            <label for="searchStock">返厂供应商：</label>
            <el-select id="supplierId" filterable v-model="supplierId" placeholder="请选择供应商"
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
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <label id="consignee">收货人：</label>
            <el-input style="width: 201px!important;" :maxlength="20" v-model="consignee" placeholder=""></el-input>
            <!-- <el-input style="width: 150px!important;" v-model="consignee"></el-input>-->
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label id="consigneePhone">手机：</label>
            <el-input style="width: 201px!important;" v-model="consigneePhone"></el-input>
          </div>
        </el-col>


        <el-col :span="13.5">
          <div class="grid-content">
            <label for="searchStock">收货地址：</label>
            <el-select v-model="provinceId" placeholder="请选择省" @change="two()" style="width: 120px!important;">
              <el-option
                v-for="item in province"
                :key="item.regionId"
                :label="item.regionName"
                :value="item.regionId">
              </el-option>
            </el-select>
            <el-select v-model="cityId" placeholder="请选择市" @change="three()" style="width: 120px!important;">
              <el-option
                v-for="item in city"
                :key="item.regionName"
                :label="item.regionName"
                :value="item.regionId">
              </el-option>
            </el-select>
            <el-select v-model="regionId" placeholder="请选择区" style="width: 120px!important;">
              <el-option
                v-for="item in district"
                :key="item.regionId"
                :label="item.regionName"
                :value="item.regionId">
              </el-option>
            </el-select>
            <el-input placeholder="请输入街道" :maxlength="100" v-model="consigneeAddr"
                      style="width: 180px!important;"></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="17">
          <div class="grid-content">
            <label for="explain" style="">出库备注：</label>
            <el-input
              maxlength="200"
              id="explain"
              type="textarea"
              :rows="4"
              placeholder="请输入出库备注"
              v-model="stockOutRemark"
            >
            </el-input>
            <span>{{stockOutRemark.length}}/200</span>
            <p v-show="isExplainShow" style="margin-left: 65px;margin-top:3px;color: red">请填写调整说明</p>
          </div>
        </el-col>
      </el-row>
      <div>
      </div>
    </div>
    <p style="margin: 10px 0"><strong>商品信息</strong></p>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column
        label="序号"
        width="45"
        type="index"
        align="center">
      </el-table-column>

      <el-table-column label="商品" align='left' min-width="200" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt="" style="width: 30px;height: 30px;margin-right: 5px">
          <span>{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="条形码" min-width="150" align="center" prop="barCode">
      </el-table-column>

      <el-table-column label="商品编号" min-width="150" align="center" prop="goodsCode">
      </el-table-column>

      <el-table-column label="规格" min-width="150" align="center" prop="specification">
      </el-table-column>

      <el-table-column :label="item.attributeName" align="center" v-for="(item,i) in state" :key="i" min-width="150"
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-for="(itemd,j) in scope.row.goodsAttributeShowBeanList">
            <span class="cen-g" v-if="j==i">{{ itemd.attributeValue }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="商品属性" align="center" min-width="150">
        <template slot-scope="scope">
          <span v-show="scope.row.goodsAttrType==1">正品</span>
          <span v-show="scope.row.goodsAttrType==2">次品</span>
        </template>
      </el-table-column>

      <el-table-column label="出库数量" align='center' min-width="150" prop="goodsQty">
      </el-table-column>

      <el-table-column label="批次号" align="center" prop="batchNo" min-width="150">
      </el-table-column>
      <el-table-column :label="item.attributeName" v-for="(item,index) in batchoption" align='center'
                       :key="item.index" v-if="showBaych" min-width="150">
        <template slot-scope="scope">
          <span v-for="(val) in scope.row.batchoptiondataes">
            <span v-if="item.attributeName==val.attributeName">
              <span v-if="val.attributeType=='2'">{{ scope.row['attributeValue' + index] }}</span>
              <span v-if="val.attributeType=='1'">{{ scope.row['attributeValue' + index] }}</span>
            </span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="wmsFoot" style="text-align: center">
      <el-button size="mini" @click="back()" style="line-height: 10px">返回</el-button>
      <el-button size="mini" type="primary" @click="AuditRefused" style="line-height: 10px">审核拒绝</el-button>
      <el-button size="mini" type="primary" @click="passverification " style="line-height: 10px">审核通过</el-button>
    </div>

    <!--审核拒绝备注信息-->
    <el-dialog v-dialogDrag
      title="审核出库单"
      :visible.sync="refuseClick"
      width="420px"
      center>
      <div style="text-align: center">

        <span>审核备注：</span>
        <el-input
          maxlength="200"
          style="width: 252px;"
          type="textarea"
          :rows="3"
          placeholder="请输入备注内容"
          v-model="auditRemark ">
        </el-input>

        <div style="text-align: left;position: relative">
          <span style="position: absolute;left: 236px;height: 17px">{{auditRemark.length}}/200</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="refuseClick= false" style="line-height: 10px">取 消</el-button>
            <el-button size="mini" type="primary" @click="refuse()" style="line-height: 10px">审 核</el-button>
          </span>
    </el-dialog>


  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'

  export default {
    components: {
      pagination
    },
    data() {
      return {
        version: '1.0.0',
        auditRemark: '',
        showBaych: '',
        goodsDataesd: [],
        refuseClick: false, //备注审核弹框
        supplier: [{value: '', label: '全部'}],//供应商
        StockOutTypeEnum: [//出库类型
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '采购退货'
          }, {
            value: 2,
            label: '调拨出库'
          }, {
            value: 3,
            label: '其他出库'
          }, {
            value: 4,
            label: '订单出库'
          },
        ],
        stockOutType: '',//出库类型
        storageId: '',
        isExplainShow: false,
        supplierId: '',//供应商
        consignee: '',//收货人
        consigneePhone: '',//收货人手机
        consigneeRegionId: '',//省Id
        consigneeAddr: '',
        consigneeFullAddr: '',
        stockOutRemark: '',//出库备注
        province: [{value: '', label: '全部'}], // 省
        city: '', // 市
        district: '', // 区
        provinceId: '',
        regionId: '',
        cityId: '',
        //商品
        enabledFlagTwo: [{
          value: '',
          label: '全部'
        }, {
          value: true,
          label: '单品'
        }, {
          value: false,
          label: '套装'
        }],
        enabledFlag: '',//是否套装
        shopData: [{
          value: '1',
          label: '条形码'
        }, {
          value: '2',
          label: '商品编号'
        }, {
          value: '3',
          label: '备用条形码'
        }],
        baby: '3',
        multipleTable: [],//勾选条数
        num: [],
        suitFlag: '',//是否是套装
        goodsCode: '', // 商品编码。
        barCode: '', // 商品条形码。
        goodsName: '',// 商品名称。
        enableFlag: '',//是否可用
        standbyBarCode: '',//备用条形码
        goodsIdListJsonStr: '',//json串 出入库添加商品时排除页面上已经存在的商品集合
        tableTransitionData: [],
        multipleSelection: [],//选择商品
        shopList: [// 1//商品属性 1：正品 2：次品
          {
            value: 1,
            label: '正品'
          }, {
            value: 2,
            label: '次品'
          }],
        tableTransitionName: [],
        tableTransitionType: [],
        name: '',

        tableDataOne: [],//批次
        multipleSelection3: [],//选择批次
        batchNo: '',//批次号

        stock: [],//仓库
        optionsStock: [],
        tableData: [],//表格数据
        isenable: [{//状态下拉
          value: '选项1',
          label: '是'
        }, {
          value: '选项2',
          label: '否'
        }],
        isSuit: '',//是否套装
        shelves: false,//完成上架弹窗
        tableDataShop: [],//表格数据
        addShop: false,//添加商品窗口
        tableDateOne: [],//商品属性值
        state: [],
        batchoption: [],
        tableDataesd: [],
        temp: [], tempw: [],
        isnum: [],
        table_h: 0,
        batch: false,
      }
    },
    mounted() {
      this.initBatchopt();
      this.initMessage();
      this.initStock();//初始化仓库下拉
      this.supplierSum();//供应商
      this.price();//请求省

      //表格高度自适应
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 90);
      });


    },
    methods: {
//      数据详情
      initMessage() {
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/getStockInfo', {stockOutId: this.$route.params.Id}).then((res) => {
//             console.log(1230,res.data.result)
          if (res.data.code == 0) {
            let sds = res.data.result.consigneeRegionId
            if (sds !== '') {
              this.where(sds)

            }
            this.stockOutType = res.data.result.stockOutType;
            this.supplierId = res.data.result.supplierId;
            this.storageId = res.data.result.storageName;
            this.consigneePhone = res.data.result.consigneePhone;
            this.consignee = res.data.result.consignee;
            if (res.data.result.hasOwnProperty("stockOutRemark")) {
              this.stockOutRemark = res.data.result.stockOutRemark;
            }
            this.consigneeAddr = res.data.result.consigneeAddr;
            res.data.result.stockOutItem.forEach((item, i) => {  //获取图片以及批次属性值
              item.batchoptiondataes = this.batchoption;
              item.batchoptiondataes.forEach(function (value, num) {
                item['attributeValue' + num] = '';
                item['attributeValueId' + num] = '';
              }.bind(this));

              this.state = item.goodsAttributeShowBeanList;
              item.dtGoodsImageBeanList.forEach((val) => {
                if (item.goodsId == val.goodsId && val.pri == 0) {
                  item.imageUrl = val.imageUrl
                }
              })
              if (item.imageUrl == '') {
                item.imageUrl = item.defaultImageUrl
              }
            })
            res.data.result.stockOutItem.forEach((item) => {
              if (item.batchNo) {
                this.tableData = res.data.result.stockOutItem;
                this._post('com.edb01.erp.wms.service.api.StorageAttributeService/' + this.version + '/getGoodsBatchAllAtribute', {
                  batchNo: item.batchNo,
                  goodsId: item.goodsId
                }).then((res) => {
                  if (res.data.success) {
                    res.data.result.forEach((val, n) => {
                      item.batchoptiondataes.forEach((num) => {
                        if (num.attributeId == val.attributeId) {
                          item['attributeValueId' + n] = val.attributeValue;
                          item['attributeValue' + n] = val.attributeValue;

                        }
                      })
                    })
                  }
                })
                this.showBaych = true
              } else {
                this.tableData = res.data.result.stockOutItem;
              }

            })
          }
        })
      },

      //初始化批次属性选项
      initBatchopt() {
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/selectGoodsAttributeBatch').then(function (res) {
          res.data.result.forEach(function (val) {
            val.attributeValue = ''
          });
          this.batchoption = res.data.result
        }.bind(this));
      },
//      区域
      where(sds) {
        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/findRegionBeanById', {regionId: sds}).then((res) => {

          res.data.result.forEach((item) => {
//
            let wee = item.regionPid
            let wees = item.provinceId
            this.regionId = item.regionId
            this.cityId = item.cityId
            this.provinceId = item.provinceId
            this.cityId = item.cityId
            this.three(wee)
            this.two(wees)
          })


        })
      },

      //      审核拒绝弹框
      AuditRefused() {
        this.refuseClick = true;
      },
//      拒绝审核
      refuse() {
        let self = this
        if (this.auditRemark == '') {
          self.$message({
            message: "备注不能为空",// 如果code为其他，弹出错误码
            type: 'warning'
          })
        } else {
          self._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/auditStockOutOrder', {
            auditRemark: this.auditRemark,
            stockOutId: this.$route.params.Id,
            auditStatus: false

          }).then(function (res) {

            if (res.data.result.checkstatus) {
              self.refuseClick = false;
              self.$message({
                message: res.data.result.data,
                type: 'success'
              })
              self.back()
            } else {
              self.$message({
                message: res.data.result.data,
                type: 'warning'
              })
            }

          }).catch(function (err) {
            console.log(err)
          })
        }

      },
      //      审核通过
      passverification() {
        let self = this
        self._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/auditStockOutOrder', {
          stockOutId: this.$route.params.Id,
          auditStatus: true

        }).then(function (res) {
          if (res.data.success && res.data.result.data != '') {

            self.$message({
              message: res.data.result.data,
              type: 'success'
            })
            self.back()
          } else {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }

        }).catch(function (err) {
          console.log(err)
        })


      },
      //      返回
      back() {
        this.$router.push("/outStock")
      },


      //批次
      handleSelectionChange3() {

      },
      //添加批次的确定键
      sureData() {
        this.batch = false;
        //追加列表
        this.tableData.push()
      },
      addBatch(row) {
        console.log(888, row);
        console.log(138, row.batchNo.length);
        this.batch = true;
        var arr = '';
        this.multipleSelection.forEach((item) => {
          arr += item.goodsId + ','
        })
        arr.slice(0, -1)
        console.log(111, arr);
        console.log(5556, row.batchNo);
        let data = {
          goodsId: arr.slice(0, -1),//选择的商品id：id1,id2,id3
          storageId: this.storageId,//仓库id
          batchNos: row.batchNo, //当前出库单中已经存在的本商品的批次号：no1,no2,no3
        };
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkAddBatchMsg', data).then((res) => {
          if (res.data.code == 0) {
            this.tableDataOne = res.data.result;
            console.log(5555, this.tableDataOne);
          } else if (res.data.code == 320000004) {

          }
        })
      },
      //添加属性
      addAttribute(row) {
      },
      //批次属性值
//      batchValue() {
//        var arr = '';
//        this.multipleSelection.forEach((item) => {
//          arr += item.goodsId + ','
//        })
//        arr.slice(0, -1)
//        console.log(111, arr);
//        let data = {
//          goodsId: arr.slice(0, -1),//选择的商品id：id1,id2,id3
//          storageId: this.storageId,//仓库id
//          batchNo: 'AB5383A936574AF4989E40B1F02F1DA0', //当前出库单中已经存在的本商品的批次号：no1,no2,no3
//        };
//        this._post('com.edb01.erp.wms.service.api.StorageAttributeService/' + this.version + '/getGoodsBatchAllAtribute', data).then((res) => {
//          if (res.data.code == 0) {
//            //console.log(5555,res.data.result);
//          }
//        })
//      },
      //商品属性
      shopType() {
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/selectGoodsAttribute')
          .then(function (res) {
            if (res.data.code == 0) {
              /* for(var i of res.data.result){
                 console.log(581,i.attributeCodeBeans);
                 for(var q of i.attributeCodeBeans){
                   console.log(58,q.attributeValueName);
                 }
               }
               console.log(53,res.data.result);*/
            }
          })
      },

      //添加调整商品确定点击
      refuseTrueClick: function () {
        this.shopType()
        this.success();
        this.batchValue()
        /*    this.multipleSelection.forEach(function (val) {
              this.tableData.push({realQty:'',batchNo:'',goodAttribute:'',preAccount:'',imageUrl:val.imageUrl,goodsCode:val.goodsCode,barCode:val.barCode,goodsName:val.goodsName,specification:val.specification, })
            }.bind(this));
    */
        //   console.log(7777,this.multipleSelection);

      },
      updataShop(row) {
        console.log(583, row);
        if (row.goodsAttributeType == 1) {//正品
          this.numSearch(row)
        }
        if (row.goodsAttributeType == 2) {//次品
          this.sunSearch(row)
        }
      },
      //输入状态
      numSearch(row) {//校验正品商品出库数量
        let data = {
          storageId: this.storageId,//仓库id
          goodsId: row.goodsId, //商品ID
          checkGoodOutNum: row.goodsQty, //当前商品的出库数量
          sumOtherBatchGoodOutNum: row.sumOtherBatchGoodOutNum,///出库单中商品属性为正品的其他批次的出库数量之和--若此出库单中的商品存在多个批次时
        };
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkGoodZpOutNum', data).then((res) => {
          if (res.data.code == 0) {

          } else if (res.data.code == 320000004) {

          }
        })
      },
      sunSearch(row) {//校验次品商品出库数量
        let data = {
          storageId: this.storageId,//仓库id
          goodsId: row.goodsId, //商品ID
          checkGoodOutNum: row.goodsQty, //当前商品的出库数量
          sumCpStockOutNum: row.sumCpStockOutNum,//出库单中商品属性为次品的所有批次的次品出库数量之和--若出库单中的商品有多个批次时（包含本商品）
          sumOtherBatchGoodOutNum: row.sumOtherBatchGoodOutNum,//本出库单中商品的其他批次且商品属性为次品的出库数量之和--若出库单中的商品有多个批次时（不包含当前商品数量）
        };
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkGoodCpOutNum', data).then((res) => {
          if (res.data.code == 0) {

          } else if (res.data.code == 320000004) {

          }
        })
      },
      //修改商品属性校验
      typeTwo(row) {
        console.log(866, row.batchId);
        let data = {
          batchId: row.batchId,//批次Id
          batchNo: row.batchNo,//批次号
        };
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkUpdateGoodAttribute', data).then((res) => {
          if (res.data.code == 0) {

          }
        })
      },
      //保存出库单
      addOutbound() {
        var addDataW = {
          "storageId": this.storageId,//仓库id
          "supplierId": this.supplierId,//供货商Id
          "stockOutRemark": this.stockOutRemark,//出库备注
          "consignee": this.consignee,//收货人
          "consigneePhone": this.consigneePhone,//收货人手机
          "consigneeRegionId": this.regionId,//收货地址ID
          "consigneeAddr": this.consigneeAddr,//收货地址
          "consigneeFullAddr": this.consigneeFullAddr,//收货全部地址
          "handle": 'add',//操作，add:新增 update：修改
          "stockOutItemJson": JSON.stringify(this.tableData),//表格
        }
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/saveStockOutOrder', addDataW)
          .then(function (res) {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '保存成功!',
              })
              this.$router.push('/OutStock')
            } else {
              this.$message({
                message: '保存失败，请重试！',
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //取name
      getList() {
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/showList', {merchantId: 0}).then(response => {
          if (response.data.success === true) {
            this.list = response.data.result
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //初始化仓库下拉列表
      initStock: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth').then(function (res) {
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
      price: function () {
        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list', {regionId: 1}).then(function (res) {
          this.province = res.data.result; // 接受省的数据
        }.bind(this));
      },
      two: function (wees) {

        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list', {
          regionId: wees,
          regionId: this.provinceId
        }).then(function (res) {
          this.city = res.data.result; // 接受省的数据
          if (this.provinceId !== wees) {
            this.cityId = ''
            this.regionId = ''

          }
//
        }.bind(this));
      },
      // 市改变请求区
      three(wee) {
        let self = this
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list', {
          regionId: wee,
          regionId: self.cityId
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.district = res.data.result; // 接受省的数据
              if (self.cityId !== wee) {
                self.regionId = ''

              }
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 请求四级地址
      four() {
        let self = this
        self.addStore.regionId = '';  // 清空四级
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list', {regionId: self.addStore.districtId})
          .then(function (res) {
            if (res.data.code == 0) {
              self.housing = res.data.result; // 接受省的数据
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      //勾选条数
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

    }
  }
</script>
<style scoped>
  #OutboundDetail {
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
  #OutboundDetail .el-table td, .el-table th {
    padding: 0 !important;
  }

  #OutboundDetail .el-table th > .cell {
    text-align: center;
    padding: 3px 0;
    background-color: #eee;
    height: 29px;
  }

  #OutboundDetail .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #eee !important;
  }

  #OutboundDetail .pTop .el-input, .pTop .el-input__inner {
    width: 195px !important;
    height: 28px !important;
    line-height: inherit !important;
  }

  #OutboundDetail .col-nav {
    width: 100%;
    height: 28px !important;
    background: #F7F7F7;
  }

  #OutboundDetail .btnStyle {
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px !important;
    height: 30px;
  }

</style>



