<!--平台异常单 樊虎-->
<template>
  <div class="container_abnormal" v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <!--条件搜索区-->
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>异常提示：</label>
              <el-select clearable v-model="paramData.hint" placeholder="请选择" class="inputFormat">
                <el-option v-for="item in abnormalList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="participate-shop">店铺名称：</label><!--storeBeans-->
              <select id="participate-shop" name="multiselect[]" multiple="multiple" required>
                <option v-for="item in shopList" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>付款状态：</label>
              <el-select v-model="paramData.payMentStatus" placeholder="请选择" class="inputFormat">
                <el-option v-for="item in payStatusList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>网店品名：</label>
              <el-input type="text" placeholder="请输入内容" v-model="paramData.goodsName"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>平台订单号：</label>
              <el-input maxlength="50" type="text" placeholder="请输入内容" v-model="paramData.sourceOrderNo"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="">下单时间：</label>
              <el-date-picker
                :editable="false"
                @change="channelChangeDate(1)"
                v-model="paramData.startTime"
                type="datetime"
                placeholder=""
                format='yyyy-MM-dd HH:mm:ss'
                value-format='timestamp'>
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="">至：</label>
              <el-date-picker
                :editable="false"
                @change="channelChangeDate(2)"
                v-model="paramData.endTime"
                type="datetime"
                placeholder=""
                format='yyyy-MM-dd HH:mm:ss'
                value-format='timestamp'>
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox1">
        <el-button type="primary" @click="searchOrder">查询</el-button>
      </div>
    </div>
    <!--操作按钮区-->
    <div  class="col-nav">
      <ul>
        <li v-if="authorityCode.OMS_EXCEPTIONORDER_MATCHBARCODE" @click="searchAbnormal"><span>匹配异常条码</span></li>
        <li v-if="authorityCode.OMS_EXCEPTIONORDER_REMATCH" @click="rematching"><span>重新匹配</span></li>
      </ul>
    </div>
    <!--主数据表格区-->
    <div id="orderList">
      <el-table :header-cell-style="headBgc" :height="t_height" class="col-border" :data="orderList" border @cell-mouse-leave="mouseLeave" @cell-mouse-enter="mouseEnter"
                style="cursor: pointer;">
        <el-table-column type="index" fixed label="序号" align="center" width="50">
        </el-table-column>
        <el-table-column label="异常提示" align="center" width="151px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.exceptionFlagName}}
          </template>
        </el-table-column>
        <el-table-column prop="shippingAddress" label="收货地址" align="center" width="300px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.consigneeProvince}} {{scope.row.consigneeCity}} {{scope.row.consigneeArea}} {{scope.row.consigneeTown}} {{scope.row.shippingAddress}}
            <!-- v-if="scope.row.whetherEdit && scope.row.exceptionFlagName && scope.row.exceptionFlagName.indexOf('收货地址异常')>-1 && authorityCode.OMS_EXCEPTIONORDER_EDITADDRESS" -->
            <i class="el-icon-edit"
               v-if="scope.row.whetherEdit && scope.row.exceptionFlagName && scope.row.exceptionFlagName.indexOf('收货地址异常')>-1 && authorityCode.OMS_EXCEPTIONORDER_EDITADDRESS"
               style="position: absolute;bottom: 5px;right: 5px;top:10px;font-size: 14px;"
               @click="getAddress(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column prop="sourceOrderNo" label="平台订单号" align="center" width="145px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salesOrderNo" label="订单编号" align="center" width="115px" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: #409EFF;" @click="orderDetail(scope.row)">{{scope.row.salesOrderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderTotalAmt" label="订单总金额" align="center" width="115px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.orderTotalAmt | parseNum}}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="下单时间" align="center" width="135px" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.orderTime | parseTime}}
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="付款状态" align="center" width="75px" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus==1">未付款</span>
            <span v-if="scope.row.payStatus==2">部分付款</span>
            <span v-if="scope.row.payStatus==3">已付款</span>
          </template>
        </el-table-column>
        <el-table-column prop="buyerNick" label="买家ID" align="center" width="105px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="consignee" label="收货人" align="center" width="85px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="consigneeMobile" label="手机号" align="center" width="95px" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="serviceMsg" label="客服备注" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.serviceMsg ? scope.row.serviceMsg : ""}}
          </template>
        </el-table-column>
        <el-table-column prop="customerMsg" label="买家留言" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.customerMsg ? scope.row.customerMsg : ""}}
          </template>
        </el-table-column>
        <el-table-column prop="shopId" label="所属店铺" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{shopListId[scope.row.storeId]}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--修改收货地址弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="修改收货地址" :visible.sync="setAddress" v-if="setAddress" width="600px" v-loading="areaLoading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
      <el-form :model="addressForm" :rules="rules" ref="addressForm" label-width="" class="demo-ruleForm">
        <el-form-item label="" style="display:inline-block;height:36px;">
          <prov-city-area style="display:inline-block;" @channelArea="channelArea"  :proCityAreaValue="addressForm.proCityAreaValue" :proCityAreaLabel="addressForm.proCityAreaLabel"></prov-city-area>
        </el-form-item>
        <el-form-item label="" prop="receiveAddress" style="width:494px;height:36px;">
          <el-input v-model="addressForm.receiveAddress" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-button style="margin-left:256px;margin-bottom:10px;" @click="setAddress=false">取消
          </el-button>
          <el-button type="primary" style="width:126px!important;" @click="enterSetOrder('addressForm')">确定并转正常单
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--匹配异常条码-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="匹配异常条码" :visible.sync="shopShow" width="900px" v-loading="shopShowLoading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
      <!--<el-select v-model="barCodeObj.searchType" style="width:100px;">
        <el-option label="网店品名" value="1"></el-option>
        <el-option label="条形码" value="3"></el-option>
      </el-select>-->
      <span>网店品名：</span>
      <el-input v-model="barCodeObj.goodsName" style="width:190px;" @keyup.enter.native="queryAbnormal"></el-input>
      <el-button class="btnFormat" style="background:#409EFF;color:white;" @click="queryAbnormal">查询</el-button>
      <span style="color:#cd3930;margin-left:20px;">提示：同一店铺，网店品名、网店规格相同视为同一商品。</span>
      <br/><br/>
      <el-table :header-cell-style="headBgc" @cell-dblclick="celldbClick" class="col-border" height="525px" :data="abnormalCodeList" border
                v-loading="barCodeloading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                style="width: 100%;">
        <el-table-column label="序号" fixed type="index" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderItemAbnormalType" label="提示" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.orderItemAbnormalName}}
          </template>
        </el-table-column>
        <el-table-column prop="storeGoodsName" label="网店品名" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="storeGoodsSpec" label="网店规格" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.storeGoodsSpec ? scope.row.storeGoodsSpec : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="goodsBarCode" width="120" label="网店条码" align="center" show-overflow-tooltip>
          <template slot="header" slot-scope="scope">
            <span>网店条码</span><i class="el-icon-edit"></i>
          </template>
          <template slot-scope="scope">
            <el-input type="text" v-if="scope.row.numEdit"  v-model="scope.row.goodsBarCode"
                             @blur="keyupNumSave(scope.row)"></el-input>
            <span v-else>{{scope.row.goodsBarCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeId" label="店铺" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{shopListId[scope.row.storeId]}}
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="订单数量" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="addCommodityDialog(scope.row)">
              选择商品
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-pagination">
        <el-pagination
          @size-change="abnormalSizeChange"
          @current-change="abnormalCurrentChange"
          :current-page="abnormalPage"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="abnormalSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="abnormalTotal">
        </el-pagination>
      </div>
     <div style="margin-top:15px;text-align:right;">
       <el-button @click="barcodeCancel">取消</el-button>
       <el-button type="primary" @click="barcodeSave">确定</el-button>
     </div>
    </el-dialog>
    <!--添加商品弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="搜索关联商品" v-loading="loading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading" :visible.sync="dialogAddCommodity" width="800px">
      <div class="input-box">
        <el-row>
          <el-col :span="20">
            <div>
              <el-select v-model="searchType" style="width:100px;">
                <el-option label="商品名称" value="1"></el-option>
                <el-option label="条形码" value="2"></el-option>
              </el-select>
              <el-input style="width:200px;" v-model="searchContent"
                        @keyup.enter.native="queryGiftBtn2"></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" style="height:28px;" @click="queryGiftBtn2">查询</el-button>
          </el-col>
        </el-row>
        <el-table
          border
          max-height="400"
          :data="addCommodityData"
          style="margin-top:15px;"
        >
          <el-table-column
            label="序号"
            align='center'
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            align='center'
            label="商品图"
            min-width="">
            <template slot-scope="scope">
              <!--<el-tooltip placement="right">
                <div slot="content"><img  :src="productSkuTableData[scope.$index].picUrl" alt=""></div>
                <img  :src="productSkuTableData[scope.$index].picUrl" alt="">
              </el-tooltip>-->
              <img v-if="scope.row.goodsImageBean" :src="scope.row.goodsImageBean.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="barCode"
            label="条形码"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align='center'
            label="商品名称"
            width="">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="setGoods(scope.row)">
                关联此商品
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="dialog-pagination">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="currentPage2"
            :page-sizes="[15, 30, 50, 100, 200]"
            :page-size="totalPage2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum2">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <!--订单详情-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="订单详情" :visible.sync="orderInfo" width="850px">
      <el-table :header-cell-style="headBgc" class="col-border" height="525px" :data="orderInfos" border
                style="width: 100%;margin-bottom:8px;">
        <el-table-column label="序号" fixed type="index" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="orderAbnormalName" label="提示" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="storeGoodsName" label="网店品名" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="storeGoodsSpec" label="网店规格" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.storeGoodsSpec ? scope.row.storeGoodsSpec : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="goodsBarCode" label="条形码" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="goodsQty" label="数量" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitPrice" label="单价" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.unitPrice | parseNum}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--匹配条码error-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="提示" :visible.sync="partErrorDialog" width="400px">
      <p>已成功为您匹配{{partErrorObj.successQty}}条,失败{{partErrorObj.failQty}}条</p>
      <p style="margin:20px 10px 10px 0;text-align:right;color:rgb(64, 158, 255);cursor: pointer;" @click="errorDialog = true;partErrorDialog = false">查看失败列表</p>
    </el-dialog>
    <!--匹配条码失败弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="失败列表" :visible.sync="errorDialog" width="900px" v-loading="shopShowLoading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
      <el-table :header-cell-style="headBgc" @cell-dblclick="celldbClick" class="col-border" height="525px" :data="abnormalCodeList" border
                v-loading="barCodeloading" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                style="width: 100%;">
        <el-table-column label="序号" fixed type="index" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderItemAbnormalType" label="提示" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.orderItemAbnormalName}}
          </template>
        </el-table-column>
        <el-table-column prop="storeGoodsName" label="网店品名" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="storeGoodsSpec" label="网店规格" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.storeGoodsSpec ? scope.row.storeGoodsSpec : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="goodsBarCode" width="120" label="网店条码" align="center" show-overflow-tooltip>
          <template slot="header" slot-scope="scope">
            <span>网店条码</span><i class="el-icon-edit"></i>
          </template>
          <template slot-scope="scope">
            <el-input type="text" v-if="scope.row.numEdit"  v-model="scope.row.goodsBarCode"
                      @blur="keyupNumSave(scope.row)"></el-input>
            <span v-else>{{scope.row.goodsBarCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeId" label="店铺" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{shopListId[scope.row.storeId]}}
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="订单数量" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="addCommodityDialog(scope.row)">
              选择商品
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:15px;text-align:right;">
        <el-button @click="errorCancel">取消</el-button>
        <el-button type="primary" @click="barcodeSave">确定</el-button>
      </div>
    </el-dialog>
    <div id="pageTool" class="col-pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                     :page-sizes="[15,30,50,100,200,1000]" :page-size="size" layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { turnTimestamp3,turnTimestamp4 } from '@/assets/js/validate.js';
import ProvCityArea from '@/components/common/ProvCityArea.vue';
  export default {
    name: "",
    components:{
      ProvCityArea
    },
    data() {
      return {
        shopShowLoading:false,
        barCodeloading:false,//匹配条形码loading
        isEditing:false,//记录编辑状态
        commitBeans:[],//修改barCode集合
        oldBarCode:'',//记录旧条形码
        partErrorDialog:false,//部分失败弹框
        partErrorObj:{
          successQty:0,
          failQty:0
        },//成功失败条数
        errorDialog:false,//失败弹框
        errStockData:[],//失败列表存数据

        version: "1.0.0",
        areaLoading:false,//修改收货地址loading
        areaParams:{},//修改收货地址回传参数
        rules: {
          proCityAreaValue: {required: true, message: '请选择省市区', trigger: 'change'},
          receiveAddress: {required: true, message: '请输入详细地址', trigger: 'blur'},
        },//表单校验规则
        addressForm: {
          address_1: '',
          address_2: '',
          address_3: '',
          proCityAreaValue:[],
          proCityAreaLabel:[],
          receiveAddress: ''
        },//修改收获地址参数
        regionId: 0, //区域ID
        orderInfo: false, //订单页面
        setAddress: false, //设置收货地址
        shopShow: false, //店铺列表
        goodsShow: false, //选择商品界面
        page: 1, //当前页
        size: 15, //每页显示数量
        total: 0, //总数量
        abnormalPage: 1, //异常单列表当前页
        abnormalSize: 15, //异常单列表每页显示数量
        abnormalTotal: 0, //异常单列表总数量
        t_height: 0, //表格高度
        searchGoods: "", //商品名称
        provinceList: [], //省列表
        cityList: [], //市列表
        areaList: [], //区列表
        townList: [], //镇列表
        shopList: [], //店铺列表
        orderList: [], //订单列表
        abnormalCodeList: [], //异常列表
        orderInfos: [], //订单信息
        abnormalList: [
          {
            label: '请选择',
            value: ''
          },
          {
            label: '条码异常',
            value: '1'
          },
          {
            label: '收货地址异常',
            value: '2'
          }, {
            label: '未设置菜鸟仓ID',
            value: '3'
          }

        ],//异常提示集合
        payStatusList: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '未付款',
            value: '1'
          },
          {
            label: '部分付款',
            value: '2'
          },
          {
            label: '已付款',
            value: '3'
          }
        ],//付款状态集合
        shopListId: {},//参与店铺obj
        shopSelect: [],//参与店铺选中
        paramData: {
          page: 1,
          size: 15,
          payMentStatus: '',
          hint: '',
          goodsName: '',
          startTime: '',
          endTime: '',
          sourceOrderNo: ''
        },//平台异常单参数
        barCodeObj:{
          goodsName: '',//网店品名
          searchType:'1'
        },
        salesOrderId: '',//订单id
        searchContent:'',
        searchType:'1',
        addCommodityParam: {
          barCode:'',
          goodsName:'',
          page: 1,
          size: 15,
          tenantId: 0
        },//添加商品弹框参数
        addCommodityData: [],//添加商品tableData
        currentPage2: 1,
        totalPage2: 15,
        totalNum2: 0,
        dialogAddCommodity: false,//添加商品弹框
        goodsNameMd5: '',//goodsNameMd5
        oldGoodsBarCode:'',//原商品code
        orderNum:'',//原商品num
        storeId:'',//店铺
        loading:false,
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
      };
    },
    methods: {
      //双击单元格
      celldbClick(row, column, cell, event) {
        if (column.property == "goodsBarCode" && !row.numEdit) {
          if(this.isEditing){
            this.$message({
              message: '请先保存当前编辑方案',
              type: "warning"
            });
          }else{
            row.numEdit = true;
            this.isEditing = true;
            this.oldBarCode = row.goodsBarCode;
          }
        }
      },
      //barcode失焦保存记录
      keyupNumSave(row){
        row.numEdit = false;
        this.isEditing = false;
        var isHas = false;//是否有
        this.commitBeans.forEach(item => {
            if(item.oldGoodsNameMd5 == row.goodsNameMd5){
              item.newGoodsBarCode = row.goodsBarCode;
              isHas = true;
            }
        })
        if(!isHas && this.oldBarCode != row.goodsBarCode){
          //不存在则push进来
          this.commitBeans.push({
            newGoodsBarCode:row.goodsBarCode,
            oldGoodsBarCode:this.oldBarCode,
            oldGoodsNameMd5:row.goodsNameMd5,
            storeId:row.storeId,
            goodsExistsOrderQty:row.orderNum
          })
        }
      },
      //修改条形码
      barcodeSave(){
        if(this.commitBeans.length == 0){
          this.$message({
            message: '请先修改网店条码',
            type: "warning"
          });
          return false;
        }
        this.shopShowLoading = true;
        //console.log(this.commitBeans);
        this._post("com.edb01.erp.oms.service.api.PEPlatExceptionService/" + this.version + "/relationListGoods", {
          commitBeans:JSON.stringify(this.commitBeans)
        }).then((response) => {
          this.shopShowLoading = false;
          if (response.data.success) {
            this.shopShow = false;
            this.errorDialog = false;
            if(response.data.result.failQty == 0){
              this.$alert('已成功为您匹配'+ response.data.result.successQty +'条', '提示', {
                confirmButtonText: '确定',
                type:"success",
                showConfirmButton:false,
                center:true,
              });
            }else if(response.data.result.successQty == 0){
              this.$alert('匹配失败，请重新检查网店条形码信息', '提示', {
                confirmButtonText: '确定',
                type:"error",
                showConfirmButton:false,
                center:true,
              });
            }else{
              this.partErrorDialog = true;
              this.partErrorObj = {
                successQty:response.data.result.successQty,
                failQty:response.data.result.failQty
              }
              response.data.result.rows.forEach(item => {
                item.numEdit = false;
              })
              this.abnormalCodeList = response.data.result.rows;
              this.errStockData = JSON.parse(JSON.stringify(response.data.result.rows));
              this.commitBeans = [];
              this.isEditing = false;
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //取消修改
      barcodeCancel(){
        this.commitBeans = [];
        this.isEditing = false;
        this.queryAbnormal();
      },
      //失败列表取消
      errorCancel(){
        this.commitBeans = [];
        this.isEditing = false;
        this.abnormalCodeList = JSON.parse(JSON.stringify(this.errStockData));
      },
      //省市区组件回传
      channelArea(params){
        this.areaParams = params;
        this.areaLoading = false;
      },
      //选择时间校验
      channelChangeDate(item){
        if(this.paramData.startTime && this.paramData.endTime && this.paramData.startTime > this.paramData.endTime){
          this.$alert('起始时间不能大于结束时间！', "", {
            type: "warning",
            center: true,
            confirmButtonText: "关闭"
          });
          if(item == 1){
            this.paramData.startTime = '';
          }else{
            this.paramData.endTime = '';
          }
        }
      },
      //鼠标滑入表格行
      mouseEnter(row, column, cell, event){
        row.whetherEdit = true;
      },
      //鼠标滑出表格行
      mouseLeave(row, column, cell, event){
        row.whetherEdit = false;
      },
      //修改每页显示数量
      handleSizeChange(value) {
        this.paramData.size = value;
        this.searchOrder();
      },
      //修改页数
      handleCurrentChange(value) {
        this.paramData.page = value;
        this.searchOrder();
      },
      //订单查询下拉元素
      orderItem() {
        this._post("com.edb01.erp.oms.service.api.PEPlatExceptionService/" + this.version + "/getPageElement").then((response) => {
          if (response.data.code == 0) {
            //参与店铺
            this.shopListId = response.data.result.shopList;
            for (var item in response.data.result.shopList) {
              this.shopList.push({
                value: item,
                label: response.data.result.shopList[item]
              });
              this.shopSelect.push(item);
            }
            $('#participate-shop').multiselect('dataprovider', this.shopList);
            $('#participate-shop').multiselect('select', this.shopSelect);
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //查询订单列表
      searchOrder() {
        this.loading = true;
        this.paramData.storeList = $('#participate-shop').val() == null ? '' : JSON.stringify($('#participate-shop').val());
        this._post("com.edb01.erp.oms.service.api.PEPlatExceptionService/" + this.version + "/getOrderList", this.paramData).then((response) => {
          this.loading = false;
          if (response.data.code == 0) {
            response.data.result.rows.forEach((item,i)=>{
              item.whetherEdit = false;
            })
            this.orderList = response.data.result.rows;
            this.page = response.data.result.page;
            this.size = response.data.result.size;
            this.total = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //异常单明细
      orderDetail(row) {
        this.orderInfo = true;
        this._post("com.edb01.erp.oms.service.api.PEPlatExceptionService/" + this.version + "/getOrderDetailsById", {
          salesOrderId: row.salesOrderId
        }).then((response) => {
          if (response.data.code == 0) {
            this.orderInfos = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //表头背景颜色
      headBgc({row, rowIndex}) {
        return {
          "background-color": "#eeeeee!important"
        };
      },
      //查询异常商品
      queryAbnormal() {
        this.barCodeloading = true;
        this._post("com.edb01.erp.oms.service.api.PEPlatExceptionService/" + this.version + "/getBarCodeOrder", {
          goodsName: this.barCodeObj.goodsName,
          searchType: this.barCodeObj.searchType,
          page: this.abnormalPage,
          size: this.abnormalSize
        }).then((response) => {
          this.isEditing = false;
          this.barCodeloading = false;
          if (response.data.success) {
            response.data.result.rows = response.data.result.rows?response.data.result.rows:[];
            var mapArr = new Map();
            this.commitBeans.forEach(item => {
              mapArr.set(item.oldGoodsNameMd5,item);
            })
            response.data.result.rows.forEach(item => {
              item.numEdit = false;
              if(mapArr.get(item.goodsNameMd5)){
                item.goodsBarCode = mapArr.get(item.goodsNameMd5).newGoodsBarCode;
              }
            })
            this.abnormalCodeList = response.data.result.rows;
            this.abnormalTotal = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //匹配异常条码
      searchAbnormal() {
        this.barCodeObj = {
          goodsName:"",
          searchType:'1'
        }
        this.shopShow = true;
        this.commitBeans = [];
        this.isEditing = false;
        this.queryAbnormal();
      },
      //修改每页显示数量
      abnormalSizeChange(val) {
        this.abnormalSize = val;
        this.queryAbnormal();
      },
      //修改页数
      abnormalCurrentChange(val) {
        this.abnormalPage = val;
        this.queryAbnormal();
      },
      //重新匹配商品
      rematching() {
        this.loading = true;
        this._post("com.edb01.erp.oms.service.api.PEPlatExceptionService/" + this.version + "/retryMatching").then((response) => {
          this.loading = false;
          if (response.data.success) {
            this.$message({
              message: response.data.result,
              type: "success"
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //渲染城市
      getAddress(value) {
        this.areaLoading = true;
        this.setAddress = true;
        if (this.$refs.addressForm) this.$refs.addressForm.resetFields();
        this.addressForm.receiveAddress = value.shippingAddress;
        this.salesOrderId = value.salesOrderId;
        value.provinceRegionId = value.provinceRegionId?value.provinceRegionId:'';
        value.cityRegionId = value.cityRegionId?value.cityRegionId:'';
        value.areaRegionId = value.areaRegionId?value.areaRegionId:'';
        value.townRegionId = value.townRegionId?value.townRegionId:'';
        this.addressForm.proCityAreaValue = [value.provinceRegionId,value.cityRegionId,value.areaRegionId,value.townRegionId];
        this.addressForm.proCityAreaLabel = [value.consigneeProvince,value.consigneeCity,value.consigneeArea,value.consigneeTown];
      },
      //确定并转正常单
      enterSetOrder(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.areaParams.validatePass){
              this.$message({
                message: this.areaParams.validatePass,
                type: 'warning'
              });
              return false;
            }
            this._post("com.edb01.erp.oms.service.api.PEPlatExceptionService/" + this.version + "/updateAddress", {
              salesOrderId: this.salesOrderId,
              receiveAddress: this.addressForm.receiveAddress,
              provinceId: this.areaParams.proCityAreaValue[0],
              cityId: this.areaParams.proCityAreaValue[1],
              areaId: this.areaParams.proCityAreaValue[2]?this.areaParams.proCityAreaValue[2]:'',
              townRegionId: this.areaParams.proCityAreaValue[3]?this.areaParams.proCityAreaValue[3]:'',
            }).then((response) => {
              if (response.data.success) {
                this.setAddress = false;
                this.searchOrder();
                this.$message({
                  message: '操作成功',
                  type: "success"
                });
              } else if (response.data.code == 3703) {
                this.setAddress = false;
                this.searchOrder();
                this.$message({
                  message: response.data.msg,
                  type: "warning"
                });
              } else {
                this.$message({
                  message: response.data.msg,
                  type: "warning"
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //添加商品弹框
      addCommodityDialog(row) {
        this.searchContent = '';
        this.searchType = '1';
        this.goodsNameMd5 = row.goodsNameMd5;
        this.storeId = row.storeId;
        this.oldGoodsBarCode = row.goodsBarCode;
        this.orderNum = row.orderNum;
        this.queryGiftBtn2();
      },
      handleSizeChange2(val) {
        this.addCommodityParam.size = val;
        this.queryGiftBtn2();
      },
      handleCurrentChange2(val) {
        this.addCommodityParam.page = val;
        this.queryGiftBtn2();
      },
      //添加商品列表渲染
      queryGiftBtn2() {
        if(this.searchType == '1'){
          //商品名称
          this.addCommodityParam.goodsName = this.searchContent;
          this.addCommodityParam.barCode = '';
        }else{
          //条形码
          this.addCommodityParam.goodsName = '';
          this.addCommodityParam.barCode = this.searchContent;
        }
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsAndSuitByCondition', this.addCommodityParam).then((response) => {
          if (response.data.success) {
            this.dialogAddCommodity = true;
            this.addCommodityData = response.data.result.rows.map(v => {
              this.$set(v, 'numEdit', false);
              this.$set(v, 'buyEdit', false)
              return v
            })
            this.totalNum2 = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //设置关联商品
      setGoods(row) {
        this.$confirm("是否要关联此商品？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          center: true
        }).then(() => {
          /*this.loading = true;
          this._post("com.edb01.erp.oms.service.api.PEPlatExceptionService/" + this.version + "/relationProduct", {
            goodsNameMd5: this.goodsNameMd5,
            goodsId: data.goodsId,
            oldGoodsBarCode:this.oldGoodsBarCode,
            newGoodsBarCode:data.barCode
          }).then((response) => {
            this.loading = false;
            if (response.data.success) {
              this.dialogAddCommodity = false;
              this.shopShow = false;
              this.searchAbnormal();
              this.$message({
                message: '关联成功！',
                type: "success"
              });
            } else {
              this.$message({
                message: response.data.msg,
                type: "warning"
              });
            }
          })*/
          var isHas = false;//是否有
          this.commitBeans.forEach(item => {
            if(item.oldGoodsNameMd5 == this.goodsNameMd5){
              item.newGoodsBarCode = row.barCode;
              isHas = true;
            }
          })
          if(!isHas && this.oldGoodsBarCode != row.barCode){
            //不存在则push进来,
            this.commitBeans.push({
              newGoodsBarCode:row.barCode,
              oldGoodsBarCode:this.oldGoodsBarCode,
              oldGoodsNameMd5:this.goodsNameMd5,
              storeId:this.storeId,
              goodsExistsOrderQty:this.orderNum
            })
          }
          this.dialogAddCommodity = false;
          var mapArr = new Map();
          this.commitBeans.forEach(item => {
            mapArr.set(item.oldGoodsNameMd5,item);
          })
          this.abnormalCodeList.forEach(item => {
            if(mapArr.get(item.goodsNameMd5)){
              item.goodsBarCode = mapArr.get(item.goodsNameMd5).newGoodsBarCode;
            }
          })
        });
      },
    },
    mounted() {
      //参与店铺下拉框
      $('#participate-shop').multiselect({
        onInitialized: function (select, container) {
          $("._scroll").yi_scroll();
        },
      });
      //渲染表格高度
      this.$nextTick(function () {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      })
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13 && $('.v-modal').length == 0){ // enter 键
          //要做的事情
          this.searchOrder();
        }
      };
      //初始化时间
      this.paramData.endTime=new Date().getTime();
      this.paramData.startTime=new Date(this.paramData.endTime-7*24*3600000).getTime();
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      }
      //获取下拉菜单
      this.orderItem();
      //查询异常单列表
      this.searchOrder();
    }
  };
</script>

<style scoped>
  .grid-content > label {
    width: 72px;
  }

  .btnMenu {
    width: 85px !important;
    margin: 0 !important;
    padding: 0 !important;
    margin-top: -15px;
    background-color: transparent;
    border: none;
    height: 30px;
    color: #606266 !important;
  }

  .searchCondition {
    display: flex;
    justify-content: space-between;
  }

  .btnMenu:hover {
    background-color: #818d9b;
    border-radius: 0;
    color: white !important;
  }

  a {
    color: #409eff;
  }

  #topSearch {
    margin-top: 15px;
  }

  #centerToolBar {
    margin-left: 15px !important;
    margin-top: 15px;
    height: 30px;
    background-color: #eeeeee;
  }

  #centerToolBar ul li {
    float: left;
  }

  #orderList {
    margin-top: 15px;
  }

  .formarStyle {
    margin-left: 15px;
  }

  .inputFormat {
    width: 155px;
  }

  .btnFormat {
    background-color: #818d9a;
    border: none;
    margin-left: 15px;
    color: white;
    width: 100px;
  }

  .btnFormat:hover {
    background-color: #818d9a;
  }
</style>
<style>
  .container_abnormal .el-table__body tr.hover-row > td {
    background-color: #eeeeee !important;
  }

  .container_abnormal .el-select__tags {
    max-width: 155px !important;
    width: 155px !important;
  }
</style>
