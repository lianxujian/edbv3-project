<!--添加出库单 佩玖-->
<template>
  <!--表格-->
  <div id="AddOutbound">
    <el-breadcrumb separator=">" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/OutStock' }">出库</el-breadcrumb-item>
      <el-breadcrumb-item>添加出库单</el-breadcrumb-item>
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
            <el-input style="width: 201px!important;" :maxlength="11"
                      @keyup.native="consigneePhone = consigneePhone.replace(/[^\d]/g,'')"
                      v-model="consigneePhone"></el-input>
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
      <!--<el-col :span="">-->
      <!--<div class="grid-content">-->
      <!--</div>-->
      <!--</el-col>-->
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
          </div>
        </el-col>
      </el-row>
      <div>
      </div>
    </div>
    <p style="margin: 10px 0"><strong>商品信息</strong></p>
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="addButton()"><span>+添加商品</span></li>
        <li @click="deldteButton()"><span>删除</span></li>
      </ul>
    </div>

    <!--表格-->
    <div class="pDown">


      <el-table :data="tableData" style="width: 100%" fit ref="table" id="tableH" border :max-height="table_h"
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

        <el-table-column label="商品" align='left' min-width="200">
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

        <el-table-column :label="item.attributeName" align="center" v-for="(item,i) in state" :key="i" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-for="(itemd,j) in scope.row.goodsAttributeAllShowBeanList">
              <span v-if="j==i">{{ itemd.attributeValue }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="商品属性" min-width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.goodsAttrType"  placeholder="请选择"
                       :disabled="scope.row.pastdue==600"
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

        <el-table-column label="出库数量" align='center' min-width="150">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.goodsQty"
                      :class="{ box: (isClass ==true && (scope.row.goodsQty==undefined||scope.row.goodsQty==''))||scope.row.saveFails==300}"
                      @keyup.native="scope.row.goodsQty = scope.row.goodsQty.replace(/[^\d]/g,'');if(scope.row.goodsQty == 0)scope.row.goodsQty = ''"
                      @blur="updataShop(scope.row)" @focus="regM(scope.row)" :maxlength="9"
            ></el-input>

          </template>
        </el-table-column>

        <el-table-column label="批次号" align='center' min-width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batchNo"
                      :disabled="!(scope.row.batchEnabledFlag==true&&scope.row.suitFlag==false)"
                      :class="{ box:scope.row.batchNo==''&& isBatchsde==500}"
                      @blur="Batchcheck(scope.row,scope.$index)" maxlength="50" style="width:100%;">
              <i v-show="scope.row.batchEnabledFlag==true&&scope.row.suitFlag==false" slot="suffix"
                 class="el-input__icon el-icon-more"
                 @click="batchdata(scope.row,scope.$index)"></i>
            </el-input>
          </template>
        </el-table-column>

        <el-table-column :label="item.attributeName" v-for="(item,index) in batchoption" align='center'
                         :key="item.index" v-if="showBaych" min-width="150">
          <template slot-scope="scope">
             <span v-for="(val) in scope.row.batchoptiondataes">
            <span v-if="item.attributeName==val.attributeName">
              <span v-show="val.attributeType=='2'">{{scope.row['attributeValue' + index]}}</span>
              <span v-show="val.attributeType=='1'">{{scope.row['attributeValueId' + index]}}</span>
            </span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="200" align="center">
          <template slot-scope="scope">

            <div v-if="scope.row.batchEnabledFlag==true&&scope.row.suitFlag==false">
              <el-button @click="addBatch(scope.row,scope.$index)" type="text" size="small">添加批次</el-button>
              <el-button @click="Addattribute(scope.row,scope.$index)" :disabled="scope.row.forbid" type="text"
                         size="small">
                添加属性
              </el-button>
              <el-button @click="handleDelete(scope.row,scope.$index)" type="text" size="small">删除</el-button>
            </div>
            <div v-else>

              <el-button @click="Addattribute(scope.row,scope.$index)" :disabled="scope.row.forbid" type="text"
                         size="small">
                添加属性
              </el-button>
              <el-button @click="handleDelete(scope.row,scope.$index)" type="text" size="small">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->

    </div>
    <div class="wmsFoot">
      <router-link :to="{path: '/OutStock'}">
        <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                   round @click="">返回
        </el-button>
      </router-link>
      <el-button type="submit" class="btnStyle" style="margin-left:40px;background-color:#49A0F5;color:white;border:none;"
                 :loading="isDisable"  @click="addOutbound()">
        <span v-if="!isDisable" style="margin-left:15px"> 创建出库单</span> <span v-else>创建中.....</span>
      </el-button>

    </div>

    <!--添加商品-->
    <div id="special">
      <el-dialog v-dialogDrag
        title="添加商品"
        :visible.sync="addShop"
        :before-close="handleClose"
        width="850px"
        center>
        <div id="searchBox">
          <div class="leftBox1">
            <el-row>
              <el-col :span="15">
                <div class="grid-content">
                  <el-select style="width: 120px!important;" v-model="baby" filterable placeholder="">
                    <el-option
                      v-for="item in shopData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input style="width: 192px!important;" v-model="babyt" @keyup.enter.native="query()"
                            placeholder=""></el-input>
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
                      v-loading="loading"
                      border
                      height="556"
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

              <el-table-column label="商品" align='left' min-width="150" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-popover
                    placement="left-end"
                    title="商品图片预览："
                    width="520"
                    height="520"
                    trigger="hover">
                    <img :src="scope.row.imageUrl" width="100%" height="100%"/>
                    <img slot="reference" :src="scope.row.imageUrl"  style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">
                  </el-popover>
                  <span>{{scope.row.goodsName}}</span>
                </template>
              </el-table-column>


              <el-table-column label="商品编号" align="center" min-width="100" prop="goodsCode" :show-overflow-tooltip="true">
              </el-table-column>

              <el-table-column label="条形码"  align="center" min-width="100" prop="barCode" :show-overflow-tooltip="true">
              </el-table-column>


              <el-table-column label="规格"  align="center" min-width="100" prop="specification" :show-overflow-tooltip="true">
              </el-table-column>

              <el-table-column label="是否套装"  align="center" min-width="100">
                <template slot-scope="scope">
                  <span  v-show="scope.row.suitFlag == false">否</span>
                  <span  v-show="scope.row.suitFlag == true">是</span>
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
                     @click="handleClose()">取消
          </el-button>
          <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                     @click="success()">确定
          </el-button>
        </div>
      </el-dialog>
    </div>

    <!--点击省略号添加批次-->
    <el-dialog v-dialogDrag
      title="选择批次"
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

            <p class="cen-g" v-show="scope.row.showWay == 'A'"><span style="color:green">正常</span>--预警提前期--发货提前期过期--过期
            </p>
            <p class="cen-g" v-show="scope.row.showWay == 'B'">正常--<span style="color:orange ">预警提前期</span>--发货提前期过期-过期
            </p>
            <p class="cen-g" v-show="scope.row.showWay == 'C'">正常--预警提前期--<span style="color:red ">发货提前期过期</span>--过期
            </p>
            <p class="cen-g" v-show="scope.row.showWay =='D'">正常--预警提前期--发货提前期过期--<span style="color:gray">过期</span></p>
            <!--<p class="cen-g" style="color:green" v-show="scope.row.showWay =='E'">正常&#45;&#45;预警提前期&#45;&#45;发货提前期过期&#45;&#45;过期</p>-->
            <p class="cen-g" v-show="scope.row.showWay == 'E'"><span style="color:green">正常</span>--预警提前期--发货提前期过期--过期
            </p>
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
    <!--点击按钮添加批次可多选-->
    <el-dialog v-dialogDrag
      title="选择批次"
      :visible.sync="addbathlistes"
      width="1050px"
      center>

      <el-table :data="tableDataad"
                ref="multipleTable"
                @selection-change="handleSelectionData"
                border
                style="width: 100%"
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


        <el-table-column label="提示" align='center' width="260px">
          <template slot-scope="scope">

            <span class="initP-g" v-show="scope.row.showWay == 'A'"><span style="color:#89C589">正常---</span>预警提前期---发货提前期---过期
            </span>
            <p class="initP-g" v-show="scope.row.showWay == 'B'"><span style="color:#999999">正常---</span><span style="color:#FEC773 ">预警提前期---</span>发货提前期---过期
            </p>
            <p class="initP-g" v-show="scope.row.showWay == 'C'"><span style="color:#999999">正常---</span><span style="color:#999999">预警提前期---</span><span style="color:#FE6C6C ">发货提前期---</span>过期
            </p>
            <p class="initP-g" v-show="scope.row.showWay =='D'">正常--预警提前期---发货提前期---<span style="color:#999999">过期</span>

            <p class="initP-g" v-show="scope.row.showWay =='E'">正常---预警提前期---发货提前期---过期</p>
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
            <el-button size="mini" @click="addbathlistes= false" style="line-height: 10px">取 消</el-button>
            <el-button size="mini" type="primary" @click="refusesd()" style="line-height: 10px">确 定</el-button>
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
        loading:true,
        batchNoExit:true, //输入批次校验
        showBaych:false, //判断批次属性列
        isBatchsde: 20,//批次号输入框是否标红
        isClass: false,//出库数量校验
        replaceDataes: [],//多选的批次号
        table_h: 0,
        tableDataad: [],//多择批次号弹窗数据
        addbathlistes: false,//选择批次号弹窗
        supplier: [{value: '', label: '全部'}],//供应商
        StockOutTypeEnum: [//出库类型
          {
            value: '1',
            label: '采购退货'
          }, {
            value: '2',
            label: '调拨出库'
          }, {
            value: '3',
            label: '其他出库'
          },
        ],
        addbathlist: false,//单选批次号弹窗
        stockOutType: '',//出库类型
        storageId: '', //仓库
        supplierId: '',//供应商
        consignee: '',//收货人
        consigneePhone: '',//收货人手机
        consigneeRegionId: '',//省Id
        consigneeAddr: '', //街道地址
        consigneeFullAddr: '',
        stockOutRemark: '',//出库备注
        province: [{value: '', label: '全部'}], // 省
        city: '', // 市
        district: '', // 区
        provinceId: '', ///省
        regionId: '',
        cityId: '',
        //商品
        enabledFlagTwo: [{
          value: '',
          label: '全部'
        }, {
          value: false,
          label: '单品'
        }, {
          value: true,
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
        baby: '1', //添加商品弹窗是否套装下拉
        babyt: '', //输入
        suitFlag: '',//是否是套装
        goodsCode: '', // 商品编码。
        barCode: '', // 商品条形码。
        goodsName: '',// 商品名称。
        enableFlag: '',//是否可用
        standbyBarCode: '',//备用条形码
        multipleSelection: [],//选择商品
        shopList: [// 1//商品属性 1：正品 2：次品
          {
            value: 1,
            label: '正品'
          }, {
            value: 2,
            label: '次品'
          }],
        batchNo: '',//批次号
        optionsStock: [],
        tableData: [],//表格数据
        total: 0, //总页数
        totalPage: 15, // 要显示的条数
        replaceData: '', //单选的批次号
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        indexs: '', //选择完批次号要插入的index
        isExits:'', //输入出库数量保存后代返回提示语
        tableDataShop: [],//表格数据
        addShop: false,//添加商品窗口
        state: [], //自定义属性
        tableNum: [], //批量删除
        arr: '', //反复选择商品后提交的ids
        isDisable: false, //创建按钮是否禁用
        AttrExit:'', //未输入出库数量前定义确保在校验好才能创建成功
        batchoption: [] //批次属性
      }
    },
    mounted() {
      this.initBatchopt();//初始化批次属性选项
      this.initStock();//初始化仓库下拉
      this.supplierSum();//供应商
      this.price();//请求省

      //表格高度自适应
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 150);
      });


    },

    methods: {
      //初始化入库数量校验状态
      regM(row){

        this.$nextTick(()=>{
          this.AttrExit=300;
          row.saveFails=301
        })


      },
    //查询
      query() {
        this.arr = '';
        this.addButton()
      },
      //单选批次号
      handleSelectionChangesd(val) {
        this.replaceData = val.batchNo

      },
     //多选批次号
      handleSelectionData(val) {
        this.replaceDataes = val


      },
      //点击省略号获取批次数据
      batchdata(row, index) {
        let data = {
          goodsId: row.goodsId,
          storageId: this.storageId,
          batchNos: row.batchNo,
//          batchNos: row.batchNosd
        }
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkAddBatchMsg', data).then(function (res) {
          if (res.data.code == 0) {
            let ArrData = new Map()   //Map结构提供了“值—值”的对应，是一种更完善的Hash结构实现。如果你需要“键值对”的数据结构，
            // Map比Object更合适。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
            this.tableData.forEach((item) => {
              ArrData.set(item.batchNo, item)
            })
            let arr = []
            console.log(ArrData);
            res.data.result.forEach((val) => {
              if (!ArrData.get(val.batchNo)) {    //判断批次号val.batchNo在ArrData是否存在，不存在就可以继续添加操作然后push进列表。存在就排除出去
                arr.push(val)
              }
            })

            this.addbathlist = true;
            this.tableDataad = arr;

          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })

          }
        }.bind(this))
        this.indexs = index;
      },
//      输入批次校验
      Batchcheck(row) {
        if (row.batchNo != '') {
          let data = {
            goodsId: row.goodsId,
            storageId: this.storageId,
            batchNo: row.batchNo,
//          batchNos: row.batchNosd
          }
          this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkBatchNo', data).then(function (res) {
            if (res.data.success) {
              this.batchNoExit=true
            } else {
             this.batchNoExit=false
              this.$message({
                message: '批次号在系统中不存在！',
                type: 'warning'
              })

            }
          }.bind(this))

        }


      },
      //单选添加批次的确定键
      refuse() {

        if (this.replaceData == '') {
          this.$message({
            message: '请选择批次',
            type: 'warning'
          });
        } else {

          this.tableData[this.indexs].batchNo = this.replaceData;  //单选获取批次号放入添加的批次行中
          this.addbathlist = false;
          let obj = this.tableData[this.indexs];
          this.$set(this.tableData, this.indexs, obj);
//
        }

      },
      //多选添加批次的确定键
      refusesd() {
        let arr = ''
        if (this.replaceDataes == '') {
          this.$message({
            message: '请选择批次',
            type: 'warning'
          });
        } else {
          this.replaceDataes.forEach((item) => {
            let data = Object.assign({}, this.indexs);
            data.batchNo = item.batchNo;
            data.goodsQty='';
            this.tableData.push(data)  //在原商品行增加一行记录
            if (this.replaceDataes.length > 0) {
              this.$message({
                message: '成功添加' + this.replaceDataes.length + '条',
                type: 'success'
              });
            }

          })


          this.addbathlistes = false;

        }

      },
//      添加批次
      addBatch(row, index) {

        let data = {
          goodsId: row.goodsId,
          storageId: this.storageId,
          batchNos: row.batchNo,
//          batchNos: row.batchNosd
        }
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkAddBatchMsg', data).then(function (res) {
          if (res.data.code == 0) {
            var mapArr = new Map();

            this.tableData.forEach((item, i) => {
              mapArr.set(item.batchNo, item);
            })
            console.log(mapArr);
            var arr = [];
            res.data.result.forEach((item, i) => {
              if (!mapArr.get(item.batchNo)) {
                arr.push(item);
              }
            })

            this.addbathlistes = true;
            this.tableDataad = arr;


          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })

          }
        }.bind(this))
        this.indexs = row;
      },
      //      添加属性
      Addattribute(row, index) {
        row.forbid = true
        let data = Object.assign({}, row);
        data.goodsAttrType = (data.goodsAttrType == 1) ? 2 : 1;
        data.goodsQty = '';
        this.tableData.splice(index + 1, 0, data);
        this.tableData.forEach((item, i) => {
          item.isMyAttr = 'isDelt' + i       //区别是否是添加属性后数据完全相同


        })

      },
      //删除
      handleDelete(row, index) {
        let arr=[]
        this.tableData.forEach((item, i) => {
          if (row.goodsId== item.goodsId) {
            this.tableData[i].saveFails=301;
            arr.push(i);
            if(arr.length==2){
              if(arr[0]==index){
                let j=arr[1]
                this.tableData[j].forbid = false
              }else {
                let n=arr[0]
                this.tableData[n].forbid = false

              }
            }

          }
        })
        var a = this.arr
        this.arr = a.replace(row.goodsId + ',', "");

        this.tableData.splice(index, 1);
        if (this.tableData.length == 0) {
          this.batchoption = ''
          this.state = '';

        }


      },
      // 批量删除
      deldteButton () {
        if (this.tableNum == '') {
          this.$message({
            message: '请选择商品！',
            type: 'warning'
          })

        } else {

          let goodsId
          let num
          this.tableNum.forEach((val, index) => {
            this.tableData.forEach((v, i) => {
              if (v.hasOwnProperty("isMyAttr")) {
                if(val.isMyAttr == v.isMyAttr){
                  goodsId=this.tableData[i].goodsId;
                  num=i
                  var a = this.arr
                  this.arr = a.replace(v.goodsId + ',', "");
                  this.Dletes2(goodsId,num);
                  this.Dletes(i);  //删方法


                }

              } else {
                if (val.goodsId == v.goodsId) {
                  this.tableData[i].saveFails=301
                  this.tableData.splice(i, 1);
                  var a = this.arr
                  this.arr = a.replace(v.goodsId + ',', "");
                }
              }
              this.$message({
                message: "删除成功" + this.tableNum.length + "条",
                type: 'success'
              });

            })
          })




          if (this.tableData.length == 0) {
            this.state = '';

          }



        }

      },
        //输入框标红后删除初始化出库数量校验
      Dletes(i){
        this.tableData[i].saveFails=301
       this.tableData.splice(i,1)
      },
      //添加属性后保证删除对应属性并且亮显对应的添加属性按钮
      Dletes2(goodsId,num){
        let arr=[]
        this.tableData.forEach((item, i) => {
          if (goodsId== item.goodsId) {
            arr.push(i);
            if(arr.length==2){
              if(arr[0]==num){
                let j=arr[1]
                this.tableData[j].forbid = false
              }else {
                let n=arr[0]
                this.tableData[n].forbid = false

              }
            }
          }
        })
      },
      //勾选批量删除
      handleSelectionChangssa(val) {
        this.tableNum = val
      },
      //关闭添加商品弹窗
      handleClose() {
        this.babyt = '';
        this.baby = '1';
        this.enabledFlag = '';
        this.$refs.multipleTable.clearSelection();
        this.addShop = false;
      },
      // 添加商品待选弹窗
      addButton() {
        if (this.tableData.length == 0) {
          this.isClass = false;
          this.isBatchsde = 50;
        }

        if (this.stockOutType == '') {
          this.$message({
            message: '请选出库类型',
            type: 'warning'
          });

        } else if (this.storageId == '') {
          this.$message({
            message: '请选择仓库',
            type: 'warning'
          });

        } else {
          this.addShop = true;//添加商品窗口
          let data = {
            "sendStorageId": this.storageId,
            "page": this.curPage,//当前页
            "size": this.pageSize,//每页行数
            "suitFlag": this.enabledFlag,//是否是套装
            "goodsCode": '', // 商品编码。2
            "barCode": '', // 商品条形码。1
            "goodsName": this.goodsName,// 商品名称。
//            "enableFlag": this.enableFlag,//是否可用
            "standbyBarCode": '',//备用条形码3
            "excludeGoods": this.arr.slice(0, -1),//json串 出入库添加商品时排除页面上已经存在的商品集合
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
          this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsStockOutWms', data).then((res)=> {
            if(res.data.success){
              res.data.result.rows.forEach((item, i) => {
                item.saveFails=''    //创建失败标记
                this.state = item.goodsAttributeAllShowBeanList;
                item.goodsAttrType = '';
                item.imageUrl = item.goodsImageBean.imageUrl;
                item.batchoptiondataes = this.batchoption;
                item.batchoptiondataes.forEach((value, num)=> {
                  item['attributeValue' + num] = '';
                  item['attributeValueId' + num] = '';
                })
              })
              this.total = res.data.result.total;
              this.tableDataShop = res.data.result.rows;
              this.loading = false;
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }

          });
        }

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
      //弹窗确定按钮
      success() {//把批次号带到表格中
        if (this.multipleSelection.length == 0) {
          this.$message({
            message: '请选择商品！',
            type: 'warning'
          })
        } else {
          let arr = ''
          this.multipleSelection.forEach((item) => {
            arr += item.goodsId + ',';
            this.arr += item.goodsId + ',';
          })
          arr.slice(0, -1)
          let data = {
            goodsIds: arr.slice(0, -1),//选择的商品id：id1,id2,id3
            storageId: this.storageId,//仓库ID
          }
          this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/getGoodsScList', data).then(function (res) {
            if (res.data.code == 0) {
              this.multipleSelection.forEach((item, i) => {
                for (var name in res.data.result) {
                  if (item.goodsId == name) {
                    item.batchNo = res.data.result[name].batchNo;
                    item.batchId = res.data.result[name].batchId;
                    item.goodsAttrType = res.data.result[name].goodsAttributeType;
                 if(item.batchNo!=''){
                   let data = {
                     batchId: item.batchId,//批次Id
                     batchNo:item.batchNo,//批次号
                   };
                   this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkUpdateGoodAttribute', data).then((res) => {
                     if (!res.data.success && item.goodsAttrType==2) {
                       item.pastdue=600
                     }

                   })

                 }

                  }
                }
              })


              this.multipleSelection.forEach((val)=> {
                this.tableData.push(val)
                this.addShop = false;
                if (val.batchEnabledFlag == true && val.suitFlag == false && val.batchNo != '') { //批次开启获取批次属性和批次属性列
                  this.showBaych=true
                  this.Assuccess()
                }
              })

              if (this.multipleSelection.length != 0) {
                this.$message({
                  message: "添加成功" + this.multipleSelection.length + "条",
                  type: 'success'
                });
              }
              this.babyt = '';
              this.baby = '1';
              this.enabledFlag = '';
              this.isClass = false;
              this.isBatchsde = 50;
              this.$refs.multipleTable.clearSelection();


            }

          }.bind(this));
        }


      },
      // 获取批次属性
      Assuccess() {
        this.tableData.forEach((item,i) => {
          this._post('com.edb01.erp.wms.service.api.StorageAttributeService/' + this.version + '/getGoodsBatchAllAtribute', {
            batchNo: item.batchNo,
            goodsId: item.goodsId
          }).then((res) => {
            if (res.data.success) {
              res.data.result.forEach((val, n) => {
                item.batchoptiondataes.forEach((num) => {
                  if (num.attributeId == val.attributeId) {
                    console.log(i,8989898989898);
                    item['attributeValueId' + n] = val.attributeValue;
                    item['attributeValue' + n] = val.attributeValue;

                  }
                })

              })

            }
          })
        })


      },
      //输入数量后根据当前行商品属性校验
      updataShop(row) {
//        console.log(parseInt(row.goodsQty)==0);

        if (row.goodsAttrType == undefined) {
          row.goodsAttrType = ''
        }
        if (row.goodsAttrType == '') {
          this.$message({
            message: '请选择商品属性',
            type: 'warning'
          });
        } else {
          let self = this;
          let googs = '';
          let googsd = row.goodsQty;
          let batchNos=row.batchNo
          let bas = row.goodsId
          let arr = [];
          let arr2 = []
          let googse = ''
          let sum = ''
          if (row.goodsAttrType == 1) {//正品
            self.tableData.forEach(function (item, i) {
              if (row.goodsId == self.tableData[i].goodsId && self.tableData[i].goodsAttrType == 1) {
                arr.push(self.tableData[i].goodsQty);
                arr2.push(self.tableData[i].batchNo)
              }
            })
            sum = eval(arr.join("+"))
            if (arr2.length > 1) {   ///出库单中商品属性为正品的其他批次的出库数量之和--若此出库单中的商品存在多个批次时（包含本商品）
              googs = sum
            } else {
              googs = sum - googsd
            }
            self.snumSearch(googs, googsd, bas,batchNos)
          } else if (row.goodsAttrType == 2) {//次品
            self.tableData.forEach(function (item, i) {
              if (row.goodsId == self.tableData[i].goodsId && self.tableData[i].goodsAttrType == 2) {
                arr.push(self.tableData[i].goodsQty)
                arr2.push(self.tableData[i].batchNo)
              }
            })
            sum = eval(arr.join("+"))
            if (arr2.length > 1) {
              googs = sum                     //出库单中商品属性为次品的所有批次的次品出库数量之和--若出库单中的商品有多个批次时（包含本商品）
              googse = sum - googsd          //本出库单中商品的其他批次且商品属性为次品的出库数量之和--若出库单中的商品有多个批次时（不包含当前商品数量）
            } else {
              googs = sum - googsd
              googse = sum
            }
            this.sunSearch(googs, googsd, bas, googse,batchNos)
          }
        }

      },
      //正品数量校验
      snumSearch(googs, googsd, bas,batchNos) {//校验正品商品出库数量
        let data = {
          storageId: this.storageId,//仓库id
          goodsId: bas, //商品ID
          batchNo:batchNos,
          checkGoodOutNum: googsd, //当前商品的出库数量
          sumOtherBatchGoodOutNum: googs,///出库单中商品属性为正品的其他批次的出库数量之和--若此出库单中的商品存在多个批次时
        };
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkGoodZpOutNum', data).then((res) => {
            if (!res.data.result.checkstatus) {
              this.$message({
                message: res.data.result.data,
                type: 'warning'
              });
                this.isExits=res.data.result.data;

            } else {
              this.isExits='';
              this.AttrExit=301;

            }
          if(!res.data.success){
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }


        })
      },
      //次品数量校验
      sunSearch(googs, googsd, bas, googse,batchNos) {//校验次品商品出库数量
        let data = {
          storageId: this.storageId,//仓库id
          goodsId: bas, //商品ID
          batchNo:batchNos,
          checkGoodOutNum: googsd, //当前商品的出库数量
          sumCpStockOutNum: googs,//出库单中商品属性为次品的所有批次的次品出库数量之和--若出库单中的商品有多个批次时（包含本商品）
          sumOtherBatchGoodOutNum: googse,//本出库单中商品的其他批次且商品属性为次品的出库数量之和--若出库单中的商品有多个批次时（不包含当前商品数量）
        };
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/checkGoodCpOutNum', data).then((res) => {
            if (!res.data.result.checkstatus) {
              this.$message({
                message: res.data.result.data,
                type: 'warning'
              });
              this.isExits=res.data.result.data;
            } else {
              this.isExits='';
              this.AttrExit=301;
            }

            if(!res.data.success){
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }


        })
      },
      //修改商品属性校验
      typeTwo(row, index) {
        let self = this
        let arr = [];
        self.tableData.forEach((item,i)=>{
          if(item.goodsId==row.goodsId){
            arr.push(i);// 取到当前点击goodsId相同数量
            if(arr.length == 2){ // length为2说明当前添加商品属性
              if(index == arr[0]){ //当前点击的是
                let j = arr[1];
                self.tableData[j].goodsAttrType = (self.tableData[index].goodsAttrType==1)?2:1
              }else{
                let k = arr[0];
                self.tableData[k].goodsAttrType = (self.tableData[index].goodsAttrType==1)?2:1
              }

            }

          }

        })
        let obj = this.tableData[index];
        this.$set(this.tableData, index, obj);

        if (row.goodsQty != ''&&row.goodsQty != undefined) {  //如果数量不为空需要校验
          if (row.batchNo != '' && row.goodsAttrType == 2) {

            let googs = ''
            let googsd = row.goodsQty
            let bas = row.goodsId;
            let batchNos=row.batchNo;
            let arr = [];
            let arr2 = [];
            let googse = ''
            let sum = ''
            if (row.goodsAttrType == 1) {//正品
              self.tableData.forEach(function (item, i) {
                if (row.goodsId == self.tableData[i].goodsId && self.tableData[i].goodsAttrType == 1) {
                  arr.push(self.tableData[i].goodsQty);
                  arr2.push(self.tableData[i].batchNo)
                }
              })
              sum = eval(arr.join("+"))
              if (arr2.length > 1) {   ///出库单中商品属性为正品的其他批次的出库数量之和--若此出库单中的商品存在多个批次时（包含本商品）
                googs = sum
              } else {
                googs = sum - googsd
              }

              this.snumSearch(googs, googsd, bas,batchNos)
            } else if (row.goodsAttrType == 2) {//次品
              self.tableData.forEach(function (item, i) {
                if (row.goodsId == self.tableData[i].goodsId && self.tableData[i].goodsAttrType == 2) {
                  arr.push(self.tableData[i].goodsQty)
                  arr2.push(self.tableData[i].batchNo)
                }
              })
              sum = eval(arr.join("+"))
              if (arr2.length > 1) {
                googs = sum                     //出库单中商品属性为次品的所有批次的次品出库数量之和--若出库单中的商品有多个批次时（包含本商品）
                googse = sum - googsd          //本出库单中商品的其他批次且商品属性为次品的出库数量之和--若出库单中的商品有多个批次时（不包含当前商品数量）
              } else {
                googs = sum - googsd
                googse = sum
              }
              this.sunSearch(googs, googsd, bas, googse,batchNos)
            }
          } else if (row.batchNo == '') {
            let self = this
            let googs = ''
            let googsd = row.goodsQty
            let bas = row.goodsId;
            let batchNos=row.batchNo;
            let arr = []
            let arr2 = []
            let googse = ''
            let sum = ''
            if (row.goodsAttrType == 1) {//正品
              self.tableData.forEach(function (item, i) {
                if (row.goodsId == self.tableData[i].goodsId && self.tableData[i].goodsAttrType == 1) {
                  arr.push(self.tableData[i].goodsQty);
                  arr2.push(self.tableData[i].batchNo)
                }
              })
              sum = eval(arr.join("+"))
              if (arr2.length > 1) {   ///出库单中商品属性为正品的其他批次的出库数量之和--若此出库单中的商品存在多个批次时（包含本商品）
                googs = sum
              } else {
                googs = sum - googsd
              }
              this.snumSearch(googs, googsd, bas,batchNos)
            } else if (row.goodsAttrType == 2) {//次品
              self.tableData.forEach(function (item, i) {
                if (row.goodsId == self.tableData[i].goodsId && self.tableData[i].goodsAttrType == 2) {
                  arr.push(self.tableData[i].goodsQty)
                  arr2.push(self.tableData[i].batchNo)
                }
              })
              sum = eval(arr.join("+"))
              if (arr2.length > 1) {
                googs = sum                     //出库单中商品属性为次品的所有批次的次品出库数量之和--若出库单中的商品有多个批次时（包含本商品）
                googse = sum - googsd          //本出库单中商品的其他批次且商品属性为次品的出库数量之和--若出库单中的商品有多个批次时（不包含当前商品数量）
              } else {
                googs = sum - googsd
                googse = sum
              }
              this.sunSearch(googs, googsd, bas, googse,batchNos)

            }

          }
        }


      },
      //创建出库单
        addOutbound() {
        let exited = false;
        let arr = [];
        let index = [];
        this.tableData.forEach(function (items, i) {
          items.goodsAttributeType = items.goodsAttrType;
          if (items.goodsQty != undefined && items.goodsQty != "") {
            arr.push(items.goodsQty)
          }

        }.bind(this))
        setTimeout(()=>{
          if(this.AttrExit==300){
            if(this.isExits){
              this.$message({
                message: this.isExits,
                type: 'warning'
              });
            }

            return false
          }


          if(this.batchNoExit==false){
          this.$message({
            message: '批次号在系统中不存在！',
            type: 'warning'
          });
          return false
        }

          if (this.stockOutType == '') {
          this.$message({
            message: '请选出库类型',
            type: 'warning'
          });

        } else if (this.tableData.length != arr.length) {
          this.isClass = true;
          this.$message({
            message: '有商品的出库数量为空，请输入商品的出库数量！',
            type: 'warning'
          });

        } else if (this.storageId == '') {
          this.$message({
            message: '请选择仓库',
            type: 'warning'
          });

        } else if (this.tableData.length == 0) {
          this.$message({
            message: '请添加商品',
            type: 'warning'
          });
        } else if (this.tableData.length > 0) {
          this.tableData.forEach((item) => {
            if (item.batchEnabledFlag == true && item.suitFlag == false&& item.batchNo == '') {
              exited = true
              this.isBatchsde = 500
              this.$message({
                message: '有商品的批次号为空，请选择批次号！',
                type: 'warning'
              })
            }

          })

          if (exited) {
            return false
          }

          let addDataW = {
            "stockOutType": this.stockOutType,//出库单类型
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
          if(this.regionId==''){
            addDataW.consigneeRegionId=this.cityId
          }
            this.isDisable=true;
             this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/saveStockOutOrder', addDataW)
               .then(function (res) {
                 if (res.data.success) {
                   this.isDisable=false;
                   this.$message({
                     type: 'success',
                     message: res.data.result,
                   })
                   this.$router.push('/OutStock')
                 } else {
                   this.isDisable=false;
                   this.tableData.forEach((item)=>{
                     res.data.result.forEach((val)=>{
                       if(item.goodsId==val){
                        item.saveFails=300

                       }
                     })

                   })

                   this.$message({
                     message: res.data.msg,
                     type: 'warning'
                   });


                 }
               }.bind(this))

           }


         },200)




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

      two: function () {
        this.cityId = ''
        this.regionId = ''
        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list', {
          regionId: this.provinceId
        }).then(function (res) {
          this.city = res.data.result; // 接受省的数据
        }.bind(this));
      },
      // 市改变请求区
      three() {
        let self = this
        self.regionId = ''
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list', {
          regionId: self.cityId
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.district = res.data.result; // 接受省的数据

            }
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
      //      以下是分页
      getPageSize: function (val) {
        if (val != undefined) {
          this.pageSize = val;
          this.addButton();
        }
      },

      getCurPage: function (val) {
        if (val != undefined) {
          this.curPage = val;
          this.addButton();
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
  #AddOutbound .box input.el-input__inner {
    border: 1px solid red !important;
  }

  #AddOutbound .el-table td, .el-table th {
    padding: 0 !important;
  }

  #AddOutbound .el-table th > .cell {
    text-align: center;
    padding: 3px 0;
    background-color: #eee;
    height: 29px;
  }

  .el-table .warning-row {
    background: red;
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
  #AddOutbound .el-button, .is-loading{
    padding-left: 3px!important;
  }
  #special .el-dialog__body{
    padding: 10px!important;
  }
</style>



