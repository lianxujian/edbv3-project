<!--入库单确认 秋香-->

<template>
  <!--表格-->
  <div id="WarehousingConfirm">
    <el-breadcrumb separator=">" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/inStock' }">入库</el-breadcrumb-item>
      <el-breadcrumb-item>入库确认</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表头 -->
    <div>
      <p style="margin: 10px 0"><strong>基本信息</strong></p>
      <el-row>
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
        <el-col :span="7">
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

      <el-row>
        <el-col :span="17">
          <div class="grid-content">
            <label for="explain" style="">入库备注：</label>
            <el-input
              maxlength="200"
              id="explain"
              disabled
              type="textarea"
              :rows="4"
              placeholder="请输入入库备注"
              v-model="remark"
            >
            </el-input>
            <span>{{remark.length}}/200</span>
            <p v-show="isExplainShow" style="margin-left: 65px;margin-top:3px;color: red">请填写调整说明</p>
          </div>
        </el-col>
      </el-row>
      <div>
      </div>
    </div>
    <p style="margin: 10px 0"><strong>商品信息</strong></p>
    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData" style="width: 100%" fit ref="table" borderfit id="tableH" border :max-height="table_h"
                @selection-change="handleSelectionChangssa">
        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          align='center'
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column label="商品" align='left' min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt="" style="width: 30px;height: 30px;margin-right: 5px">
            <span v-show="scope.row.suitFlag==true">【套】</span><span>{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="条形码" align='center' prop="barCode" min-width="150">
        </el-table-column>

        <el-table-column label="商品编号" align='center' prop="goodsCode" min-width="150">
        </el-table-column>

        <el-table-column label="规格" align='center' prop="specification" min-width="150">
        </el-table-column>

        <el-table-column :label="item.attributeName" align="center" v-for="(item,i) in state" :key="i" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="cen-g" v-for="(itemd,j) in scope.row.goodsAttributeAllShowBeanList">
              <span v-if="j==i">{{ itemd.attributeValue }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="商品属性" min-width="150" v-if="stockInType==2 || stockInType == 4">
          <template slot-scope="scope">
            <el-select v-model="scope.row.goodsAttributeType" :disabled="scope.row.forbid!=1||scope.row.overdueFlag" placeholder="请选择"
                       style="width: 120px!important;"
                       @change="typeTwo(scope.row,scope.$index)">
              <el-option
                v-for="item in shopList"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="入库数量" align='center' min-width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.goodsQty"
                      :class="{ box: isClasses ==true && (scope.row.goodsQty==undefined||scope.row.goodsQty=='')}"
                      @keyup.native="scope.row.goodsQty = scope.row.goodsQty.replace(/[^\d]/g,'');if(scope.row.goodsQty == 0)scope.row.goodsQty = ''"
                      :maxlength="9" style="width:100%;"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column label="生产日期" align='center' min-width="150" v-if="batchEnable!=false">
          <template slot-scope="scope">
            <el-date-picker
              :class="{ box: scope.$index == isClass && isMather == 'produceTimeshow' }"
              v-model="scope.row.produceTimeshow"
              :disabled="!(scope.row.batchEnabledFlag==true&&scope.row.suitFlag==false)||stockInType==2"
              :picker-options="pickerOptions2"
              type="date"
              style="width:100%!important;"
              placeholder="选择日期"
              @change="changeProduceTime(scope.row,scope.$index)"
            >
            </el-date-picker>
          </template>
        </el-table-column>

        <el-table-column label="批次号" align='center'min-width="150" v-if="batchEnable!=false">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batchNo"
                      :class="{ box: scope.$index == isClass && isMather == 'batchNo' }"
                      @keyup.native="scope.row.batchNo = scope.row.batchNo.replace(/[^\d]/g,'')"
                      :disabled="!(scope.row.batchEnabledFlag==true&&scope.row.suitFlag==false)"
                      @blur="Batchcheck(scope.row,scope.$index)" maxlength="50" style="width:100%;">
              <i slot="suffix" class="el-input__icon el-icon-more"
                 style="cursor: pointer"
                 v-show="scope.row.batchEnabledFlag==true && scope.row.suitFlag==false"
                 @click="batchdata(scope.row,scope.$index)"></i>
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="保质期" align='center' prop="expTimeEcho" min-width="150" v-if="batchEnable!=false">
        </el-table-column>

        <el-table-column :label="item.attributeName" v-for="(item,index) in batchoption" align='center'
                         :key="item.index" min-width="150" v-if="batchAttrShow">
          <template slot-scope="scope">
            <span v-for="(val) in scope.row.batchoptiondataes">
            <span v-if="item.attributeName==val.attributeName">

              <el-input v-model="scope.row['attributeValue'+index]"
                        :disabled="stockInType==2||scope.row.isChange!=1"
                        v-show="val.attributeType=='2'" maxlength="50"
                        style="width:100%;"></el-input>
              <el-select v-model="scope.row['attributeValueId'+index]"
                         :disabled="stockInType==2||scope.row.isChange!=1"
                         v-show="val.attributeType=='1'" placeholder="请选择"
                         clearable style="width:100%;"
                         @change="typeTwo2(scope.row,scope.$index)">
              <el-option
                v-for="items in val.attributeCodeBeans"
                :key="items.attributeValueName"
                :label="items.attributeValueName"
                :value="items.attributeValueId">
              </el-option>
           </el-select>

            </span>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->


    </div>
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="shelves"
        width="30%"
        center>
        <div style="width: 100%;margin-top:-10px;text-align: center">
          <i style="font-size: 16px;color: red;" class="el-icon-warning"></i>
          <span style="font-size: 14px;margin-left: 10px">以下目标库位未完成上架，是否重新分配目标库位？</span>
          <div class="" style="margin-top: 20px">
            <el-table border style="width:100%;">
              <el-table-column label="序号">
                <template slot-scope="scope">
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
              <el-table-column label="条形码">
                <template slot-scope="scope">
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
              <el-table-column label="目标库位">
                <template slot-scope="scope">
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
              <el-table-column label="应上数量">
                <template slot-scope="scope">
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
              <el-table-column label="实上数量">
                <template slot-scope="scope">
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin-top:20px;margin-bottom:20px;text-align: right">
          <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                     @click="shelves=false">取消
          </el-button>
          <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                     @click="shelves=true">确定
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!--添加商品-->
    <el-dialog v-dialogDrag
      title="添加商品"
      :visible.sync="addShop"
      :before-close="handleClose"
      width="1200px"
      center>
      <div id="searchBox">
        <div class="leftBox1">
          <el-row>
            <el-col :span="12">
              <div class="grid-content">
                <el-select style="width: 120px!important;" v-model="baby" filterable placeholder="">
                  <el-option
                    v-for="item in shopData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input style="width: 192px!important;" v-model="babyt" placeholder=""></el-input>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                <label for="searchStock2">是否套装：</label>
                <el-select id="searchStock2" v-model="enabledFlag" filterable placeholder="全部">
                  <el-option
                    v-for="item in enabledFlagTwo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox1">
          <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                     @click="query()">查询
          </el-button>
        </div>
        <div class="pDown">
          <el-table :data="tableDataShop"
                    border
                    style="width: 100%"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="序号"
              width="45"
              type="index"
              align="center">
            </el-table-column>

            <el-table-column
              align='center'
              type="selection"
              width="50">
            </el-table-column>

            <el-table-column label="商品图片" align='center'>
              <template slot-scope="scope">
                <img :src="scope.row.imageUrl" alt="">
              </template>
            </el-table-column>


            <el-table-column label="商品编号">
              <template slot-scope="scope">
                <p class="initP-g">{{scope.row.goodsCode}}</p>
              </template>
            </el-table-column>

            <el-table-column label="条形码">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.barCode }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品名称">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.goodsName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="规格">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.specification }}</p>
              </template>
            </el-table-column>

            <el-table-column label="是否套装">
              <template slot-scope="scope">
                <p class="cen-g" v-show="scope.row.suitFlag == false">否</p>
                <p class="cen-g" v-show="scope.row.suitFlag == true">是</p>
              </template>
            </el-table-column>

          </el-table>
          <div style="float: right">
            <pagination
              :totalCom="total"
              :pageSizeCom="pageSize"
              :curPageCom="curPage"
              @pageSizeVal="getPageSize" @curPageVal="getCurPage"
            ></pagination>
          </div>
        </div>
      </div>
      <div style="margin-top:40px;margin-bottom:20px;text-align: right">
        <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                   @click="hhShop()">取消
        </el-button>
        <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                   @click="success()">确定
        </el-button>
      </div>
    </el-dialog>
    <!--替换原批次-->
    <el-dialog v-dialogDrag
      title="添加批次"
      :visible.sync="addbathlist"
      width="1050px"
      center>
      <el-table :data="tableDataad"
                highlight-current-row
                @current-change="handleSelectionChangesd"
                border
                style="width: 100%"
      >
        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column label="提示" align='center' width="260px">
          <template slot-scope="scope">
            <p class="cen-g" v-show="scope.row.showWay == 'A'">正常--预警提前期--发货提前期过期--过期</p>
            <p class="cen-g" v-show="scope.row.showWay == 'B'">正常--预警提前期-<span style="color:orange ">发货提前期过期</span>-过期
            </p>
            <p class="cen-g" v-show="scope.row.showWay == 'C'">正常--预警提前期--<span style="color:red ">发货提前期过期</span>--过期
            </p>
            <p class="cen-g" style="color:gray" v-show="scope.row.showWay =='D'">正常--预警提前期--发货提前期过期--过期</p>
          </template>
        </el-table-column>

        <el-table-column label="批次号" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.batchNo }}</p>
          </template>
        </el-table-column>

        <el-table-column label="失效日期" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.overdueTime | normalTime(6)}}</p>
          </template>
        </el-table-column>

        <el-table-column label="预警提前期" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.warningAheadTimeText }}</p>
          </template>
        </el-table-column>

        <el-table-column label="发货提前期" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.sendAheadTimeText }}</p>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="addbathlist= false" style="line-height: 10px">取 消</el-button>
            <el-button size="mini" type="primary" @click="refuse()" style="line-height: 10px">确 定</el-button>
          </span>

    </el-dialog>
    <div class="wmsFoot">
      <el-button @click="holdClick" size="mini" type="primary" style="height: 30px">入库确认</el-button>
      <el-button @click="backClick" size="mini" type="info"  style="height: 30px">返 回</el-button>
    </div>
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
        goodsData: [],//废弃属性，页面没有查到
        batchAttrShow:'',//批次属性列是否显示
//        optionsStock: [{value: '', label: '全部'}],//仓库下拉
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
        addbathlist: false,//添加批次弹框关闭
        totals: '',//废弃属性，页面没有查到
        stockInType: '',//出库类型
        storageId: '',//仓库id
        isExplainShow: false,
        supplierIds: '',//供应商
        consignee: '',//收货人
        consigneePhone: '',//收货人手机
        consigneeRegionId: '',//省Id
        consigneeAddr: '',
        consigneeFullAddr: '',
        remark: '',//出库备注
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
        multipleTable: [],//勾选条数
        num: [],//废弃属性，页面没有查到
        baby: '1',//选择商品弹框下拉框默认值
        babyt: '',//选择商品弹框文本搜索字段
        suitFlag: '',//是否是套装
        goodsCode: '', // 商品编码。
        barCode: '', // 商品条形码。
        goodsName: '',// 商品名称。
        enableFlag: '',//是否可用
        standbyBarCode: '',//备用条形码
        goodsIdListJsonStr: '',//json串 出入库添加商品时排除页面上已经存在的商品集合
        tableTransitionData: [],//废弃属性，页面没有查到
        multipleSelection: [],//选择商品
        shopList: [// 1//商品属性 1：正品 2：次品
          {
            value: 1,
            label: '正品'
          }, {
            value: 2,
            label: '次品'
          }],
        tableTransitionName: [],//废弃属性，页面没有查到
        tableTransitionType: [],//废弃属性，页面没有查到
        name: '',//废弃属性，页面没有查到
        indexs: '',//对比用，跨方法传值

        tableDataOne: [],//批次
        multipleSelection3: [],//选择批次
//        batchNo: '',//批次号
        optionsStocksed: [],
        stock: [],//仓库
        optionsStock: [],
        tableData: [],//表格数据
        total: 0, //总页数
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        isDisable: false,
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
        state: [],//属性表头名称列表
        temp: [], //废弃属性，页面没有查到
        tempw: [],//废弃属性，页面没有查到
        isnum: [],//废弃属性，页面没有查到
        batch: false,//废弃属性，页面没有查到
        batg: '',//对比用，跨方法传值
        batr: '',//对比用，跨方法传值
        suig: '',//对比用，跨方法传值
        tim: '',//对比用，跨方法传值
        tableNum: [],//对比用，跨方法传值
        tableDataad: [],//添加批次表格数据
        batchFlag: '',//是否开启行业化插件
        batchEnable: '',//是否展示表格列
        produceTimes: '',//废弃属性，页面没有查到
        replaceData: null,//表格数据对比用数组
        batchoption: [],//批次属性表头名称列表
      }
    },
    mounted() {

      //表格高度自适应
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 90);
      });

      this.initBatchopt();//初始化批次属性选项
      this.plugflag();//行业化插件是否开启
      this.initStock();//初始化仓库下拉
      this.supplierSum();//供应商

      if (this.tableData.length == 0) {
        this.state = '';
      }



    },

    methods: {

      //入库确认
      holdClick(){
        let self=this
            self.$confirm('确认入库单？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              const loading = this.$loading({
                lock: true,
                text: '正在寻找商品的上架库位，请稍后......',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              self._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/batchConfirm', {stockInIdList:this.stockInId}).then(function (res) {
                if (res.data.success==true) {
                  if (res.data.result.hasOwnProperty("msg")) {
                    self.$message({
                      message: res.data.result.msg,
                      type: 'warning'
                    });
                    loading.close();
                  } else {
                    self.$message({
                      message: '操作成功!',
                      type: 'success'
                    });
                    loading.close();
                    self.$router.push('/InStock')
                  }
                }else{
                  loading.close();
                  self.$message({
                    message: res.data.msg,
                    type: 'warning'
                  });
                }
              }).catch(function (err) {
                console.log(err)
              })
            }).catch(() => {
              self.$message({
                type: 'info',
                message: '已取消操作'
              });
            });

      },

      //点击返回
      backClick: function () {
        this.$router.push('/InStock')
      },
      query() {
        this.addButton()
      },

      //获取批次
      handleSelectionChangesd(val) {
        this.replaceData = val.batchNo

      },

      //确定获取批次属性回显信息
      refuse() {
        this.$nextTick(() => {
          this.tableData[this.indexs].batchNo = this.replaceData;
          this.addbathlist = false;
        })
        let data = {
          goodsId: this.tableData[this.indexs].goodsId,
          batchNo: this.replaceData
        }
        this._post('com.edb01.erp.wms.service.api.StorageAttributeService/' + this.version + '/getGoodsBatchAllAtribute', data).then(function (res) {
          if (res.data.code == 0) {
            res.data.result.forEach(function (val) {
              this.batchoption.forEach((value, num) => {
                value['attributeValueId' + num] = val.attributeId;
              })
            }.bind(this))

          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })

          }
        }.bind(this))
      },

      //输入批次号校验
      Batchcheck(row) {
        let data = {
          goodsId: row.goodsId,
          stockInType: this.stockInType,
          batchNo: row.batchNo,
          supplierId: this.supplierIds

        }
        this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/checkAndEchoBatch', data).then(function (res) {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })

            this.tableData.forEach(function (item) {
              item.produceTimeshow = res.data.result.produceTime;

            })

          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })


          }
        }.bind(this))


      },

      //点击省略号获取批次数据
      batchdata(row, index) {
        let datas = ''
        this.tableData.forEach((item, i) => {
          if (this.tableData[i].goodsId == item.goodsId) {
            datas = item.batchNo
          }
        })
        let data = {
          "goodsId": row.goodsId,
          "batchNos": datas
        }
        this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/queryAndUpdateBatch', data).then(function (res) {
          if (res.data.code == 0) {
            this.addbathlist = true;
            this.tableDataad = res.data.result;

          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })

          }
        }.bind(this))
        this.indexs = index;
      },

//      添加批次
      addBatch(row) {
        if (this.stockInType == 1 || this.stockInType == 2) {
          let data = {
            goodsId: row.goodsId,
            batchNos: row.batchNo
          }
          this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/checkAddBatch', data)
            .then(function (res) {
              if (res.data.code == 0) {
                this.tableData.push(Object.assign({}, row))  //在原商品行增加一行记录
                this.deltdata()     //只能存在两条相同方法
                this.tableData.forEach(function (item, i) {
                  if (item.goodsId == this.tableData[i].goodsId) {
                    this.tableData[i + 1].produceTimeshow = res.data.result.produceTime;
                    this.tableData[i + 1].batchNo = res.data.result.batchNo

                  }
                  console.log(232323232, this.tableData);
                }.bind(this))
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })

              }
            }.bind(this))

        }


      },
      //      添加属性
      addAttribute(row) {
        this.tableData.push(Object.assign({}, row))  //在原商品行增加一行记录
        this.deltdata()     //只能存在两条相同方法
        this.tableData.forEach(function (item, i) {
          if (item.goodsId == this.tableData[i].goodsId) {
            if (item.goodsAttributeType != undefined) {
              this.tableData[i + 1].goodsAttributeType = item.goodsAttributeType == 1 ? 2 : 1; //，商品属性为次品或正品（与原商品相反）
              this.tableData[i + 1].goodsQty = ''; // ，出库数量为空，其余信息皆一致。
              this.isDisable = true
            }
          }
        }.bind(this))
      },
      deltdata() {  //保证列表只能存在两条相同数据
        var obj = {}
        var arr = []
        var self = this
        this.tableData.forEach(function (item) {  //判断相同id出现次数
          arr.push(item.goodsId)
        })
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i]
          if (obj[item]) {
            obj[item] = obj[item] + 1
          } else {
            obj[item] = 1
          }
        }
        for (let val in obj) {     //同一个id不能出现3次否则删除保留两个
          this.tableData.forEach(function (item, i) {
            if (obj[val] == 3 && val == item.goodsId) {
              this.tableData.splice(i + 1, 1)
            } else if (obj[val] == 1 && val == item.goodsId) {

              this.isDisable = false
            }

          }.bind(this))
        }
      },

      //删除
      handleDelete(row, index) {
        this.tableData.splice(index, 1);
        this.deltdata()
        if (this.tableData.length == 0) {
          this.batchoption = ''
          this.state = '';

        }


      },

      // 批量删除
      deldteButton: function () {
        if (this.tableNum == '') {
          this.$message({
            message: '请勾选',
            type: 'warning'
          })

        } else {
          this.tableNum.forEach((val, index) => {
            this.tableData.forEach((v, i) => {
              if (val.goodsCode === v.goodsCode) {
                this.tableData.splice(i, 1)
              }
            })
          })
          this.deltdata()
          if (this.tableData.length == 0) {
            this.batchoption = ''
            this.state = '';

          }

        }

      },
      handleSelectionChangssa(val) {
        this.tableNum = val
      },

      //添加商品弹框取消点击
      hhShop() {
        this.baby = '1'
        this.babyt = ''
        this.addShop = false;
      },

      //添加商品弹框关闭按钮点击
      handleClose() {
        this.baby = '1'
        this.babyt = ''
        this.addShop = false;
      },

      //初始化时间
      initTime() {
        this.tableData.forEach(function (item) {
          if (item.produceTimeshow == '') {
            item.produceTimeshow = new Date().getTime();
          }

        })
      },

      // 添加商品弹窗待选商品列表
      addButton: function () {
        if (this.storageId == '') {
          this.$message({
            message: '请选择仓库',
            type: 'warning'
          });
        } else if (this.stockInType == '') {
          this.$message({
            message: '请选出库类型',
            type: 'warning'
          });

        } else {

          this.addShop = true;//添加商品窗口
          let data = {
            "sendStorageId": this.storageId,
            "stockInType": this.stockInType,
            "page": this.curPage,//当前页
            "size": this.pageSize,//每页行数
            "suitFlag": this.suitFlag,//是否是套装
            "goodsCode": '', // 商品编码。2
            "barCode": '', // 商品条形码。1
            "goodsName": this.goodsName,// 商品名称。
            "enableFlag": this.enableFlag,//是否可用
            "standbyBarCode": '',//备用条形码3
//            "goodsIdListJsonStr": this.goodsIdListJsonStr,//json串 出入库添加商品时排除页面上已经存在的商品集合
          }
          if (this.baby == 1) {
            data.barCode = this.babyt;
            data.goodsCode = '';
            data.standbyBarCode = '';
          }
          if (this.baby == 2) {
            data.goodsCode = this.babyt;
            data.barCode = '';
            data.standbyBarCode = '';
          }
          if (this.baby == 3) {
            data.standbyBarCode = this.babyt;
            data.goodsCode = '';
            data.barCode = '';
          }
          this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsStockInWms', data).then(function (res) {
            this.total = res.data.result.total;
            res.data.result.rows.forEach((item, i) => {
              item.batchNo = '';
              item.produceTimeshow = '';
              item.batchoptiondataes = this.batchoption
              item.batchoptiondataes.forEach(function (value, num) {
                item['attributeValue' + num] = '';
                item['attributeValueId' + num] = '';
              }.bind(this))

            })

            this.tableDataShop = res.data.result.rows;
            this.tableDataShop.forEach((item, i) => {
              if (item.goodsImageBean && item.goodsImageBean.imageUrl) {
                item.imageUrl = item.goodsImageBean.imageUrl;
              }
            })
          }.bind(this));
        }
      },

      //弹窗勾选后确定获取自定义属性生产日期为当前并且传参获取批次号
      success() {
        if(this.stockInType == 1 && this.supplierIds == '' || this.stockInType == 3 && this.supplierIds == ''){
          this.$message({
            message: '请选择供应商！',
            type: 'warning'
          });
        }else {
          let ids = [];
          this.multipleSelection.forEach((item) => {
            ids.push(item.goodsId);
            this.batg=item.batchEnabledFlag;
            this.batr=item.batchRules;
            this.suig=item.suitFlag;
            this.tim=item.createTime;
          })
          let data = {
            "stockInType": this.stockInType,
            "batchEnable": this.batchEnable,
            "goodsIdListJsonStrSelect": JSON.stringify(ids)
          }
          this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsStockInWmsItem', data).then(function (res) {
            if (res.data.code == 0) {
              this.multipleSelection.forEach((item) => {
                res.data.result.forEach((val)=>{
                  this.state=val.goodsAttributeAllShowBeanList;
                  if(item.goodsId==val.goodsId){
                    item.goodsAttributeAllShowBeanList=val.goodsAttributeAllShowBeanList;
                  }
                })
              })
              if (this.tableData.length == 0) {
                this.tableData = this.multipleSelection
                this.addShop = false;
              } else {
                this.multipleSelection.forEach(function (val, index) {
                  this.tableData.forEach(function (item) {
                    if (this.multipleSelection[index].goodsId == item.goodsId) {
                      this.$message({
                        message: '不能选择重复商品',
                        type: 'warning'
                      })
                      this.multipleSelection.splice(index, 1)
                    }
                  }.bind(this));
                }.bind(this));
                this.multipleSelection.forEach(function (val) {
                  this.tableData.push(val)
                  this.addShop = false;
                }.bind(this))
              }

              this.Assuccess()
              this.initTime()
              this.tableData.forEach((item) => {
                item.goodsAttributeType = 3

              })


            }
          }.bind(this));
        }

      },

      //回显入库单信息
      Modifydtat(){
        this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/getStockInInfo', {stockInId:this.$route.params.stockInNo})
          .then(function (res) {
            if (res.data.code == 0) {
              if (res.data.result.stockInType == 1 || res.data.result.stockInType == 3) {
                this.isDised = true
                this.isDised2 = true

              } else if (res.data.result.stockInType == 2) {
                this.isDised = true
              }
              this.storageId = res.data.result.storageId
              this.stockInId = res.data.result.stockInId
              this.supplierIds = res.data.result.supplierId
              this.stockInType = res.data.result.stockInType
              this.remark = res.data.result.remark
              res.data.result.wmStockInItemEditBeanList.forEach(function (item, i) {
                item.produceTimeshow = '';
                item.batchoptiondataes=this.batchoption;
                item.batchoptiondataes.forEach(function (value, num) {
                  item['attributeValue' + num] = '';
                  item['attributeValueId' + num] = '';
                }.bind(this))
                if (item.goodsAttrType != 3) {
                  item.goodsAttributeType = item.goodsAttrType;
                }
                item.produceTimeshow = item.produceTime
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

                }

              }.bind(this))

            }
            res.data.result.wmStockInItemEditBeanList.forEach((item)=>{
              if(item.batchNo){
                this.tableData=res.data.result.wmStockInItemEditBeanList;
                this._post('com.edb01.erp.wms.service.api.StorageAttributeService/' + this.version + '/getGoodsBatchAllAtribute', {
                  goodsId: item.goodsId,
                  batchNo: item.batchNo
                }).then(res=> {
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
                this.batchAttrShow=true
              }else {
                this.tableData=res.data.result.wmStockInItemEditBeanList;

              }

            })


          }.bind(this))


      },

      //当生产日期改变的时候重新获取批次
      changeProduceTime(row) {
        this.tim=row.produceTimeshow.getTime()
        this.Assuccess()
      },

      //入库类型为采购或其他的时候获取批次号
      Assuccess() {
        let supplierNos
        this.supplier.forEach(function (item) { //获取对应的供应商编号
          if (item.supplierId === this.supplierIds) {
            supplierNos = item.supplierNo
          }
        }.bind(this))
        let data = {
          supplierNo: supplierNos,
          supplierId: this.supplierIds,
          produceTime:this.tim,
          stockInType: this.stockInType,
          batchEnabledFlag: this.batg,
          batchRules: this.batr,
          suitFlag: this.suig
        }
        this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/generateBatchNo', data).then(function (res) {
          if (res.data.success) {
            this.tableData.forEach(function (item, index) {
              item.batchNo = res.data.result;
            })
          }
        }.bind(this))
      },

      //行业化插件是否开启查询
      plugflag() {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryBatchFlag').then((res) => {
          if (res.data.success) {
//            if (res.data.result.batchFlag) {
//              this.initBatchopt()
//
//            };
            this.Modifydtat()
            this.batchEnable = res.data.result.batchFlag;
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })

      },

      //修改商品属性校验
      typeTwo(row, index) {
        let obj = this.tableData[index];
        this.$set(this.tableData, index, obj);
      },
      typeTwo2(row, index) {
        let obj = this.tableData[index];
        this.$set(this.tableData, index, obj);
      },

      //修改入库单
      addOutbound() {
        let arr = []
        this.tableData.forEach(function (items, i) {
          items.goodsAttrType = items.goodsAttributeType
          items.produceTime = items.produceTimeshow
          items.batchoptiondataes.forEach(function (val, n) {
            if (items['attributeValueId' + n] != undefined || items['attributeValue' + n] != undefined) {
              arr.push({
                goodsId: items.goodsId,
                batchNo: items.batchNo,
                attributeId: this.batchoption[n].attributeId,
                attributeValueId: items['attributeValueId' + n],
                attributeValue: items['attributeValue' + n]
              })
            }
            console.log(123, this.tableData);
            items.batchAttrListJsonStr = arr
          }.bind(this))
          if (items.goodsQty == undefined) {
            this.$message({
              message: '请输入出库数量',
              type: 'warning'
            });
          } else if (items.goodsQty <= 0) {
            this.$message({
              message: '出库数量必须大于0',
              type: 'warning'
            });

          } else if (this.stockInType == '') {
            this.$message({
              message: '请选择出库类型！',
              type: 'warning'
            });
          } else if (this.storageId == '') {
            this.$message({
              message: '请选择仓库！',
              type: 'warning'
            });
          } else if (this.tableData == '') {
            this.$message({
              message: '请添加商品！',
              type: 'warning'
            });
          } else {
            var addDataW = {
              "stockInType": this.stockInType,//入库单类型
              "storageId": this.storageId,//仓库id
              "supplierId": this.supplierIds,//供货商Id
              "batchFlag": this.batchEnable,   //是否开启行业化插件
              "remark": this.remark,//出库备注
//              "handle": 'add',//操作，add:新增 update：修改
              "wmsStockInItemEditBeanListJsonStr": JSON.stringify(this.tableData),//表格
            }
            console.log(9999999999999,addDataW);
            this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/updateStockIn', addDataW)
              .then(function (res) {
                if (res.data.code == 0) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!',
                  })
                  this.$router.push('/inStock')
                } else {
                  this.$message({
                    message: '保存失败，请重试！',
                    type: 'warning'
                  });
                }
              }.bind(this))
          }
        }.bind(this))


      },

      //初始化仓库下拉列表
      initStock: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
          res.data.result.forEach(function (val) {
            this.optionsStock.push({value: val.storageId, label: val.storageName})
          }.bind(this));
        }.bind(this));
      },

      //供应商
      supplierSum: function () {
        this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/getSupplierList').then(function (res) {
          console.log(45454545454, res.data.result);
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

      //勾选条数
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      //      以下是分页
      getPageSize: function (val) {
        if (val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          // this.initMessage();
          //存储每页数量
          sessionStorage.setItem('hold_stock_1', val);
          this.addButton();
        }
      },
      getCurPage: function (val) {
        if (val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          console.log(999, this.curPage);
          this.addButton();
          //  this.initMessage()
        }
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



