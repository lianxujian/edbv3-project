<!--/*订单详情 樊虎
 * @Author: fanhu
 * @Date: 2018-04-09 16:05:18
 * @Last Modified by: fanhu
 * @Last Modified time: 2018-04-27 16:55:17
 */-->
<template>
  <div class="container_Detail" style="height:100%;">
    <div style="width:100%;height:100%;position:relative;">
      <div class="title-Detail" style="margin-bottom:15px;font-size:16px;position: absolute;width: 100%;z-index: 10;">
        <el-breadcrumb separator="/" class="col-breadcrumb">
          <el-breadcrumb-item v-if="fromPage=='OrderProcessing'"><span @click="backOrderFn">订单处理</span></el-breadcrumb-item>
          <el-breadcrumb-item v-if="fromPage=='OrderQuery'"><span @click="backOrderFn">订单查询</span></el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 标题栏 -->
      <ul id="topTitle">
        <li v-for='(item,index) in titleData' :class="{cur:item.iscur}" :key="index" @click="setCur(index)"><a
        >{{item.name}}</a></li>
      </ul>
      <div id="detail-container">
        <div class="detail-box">
          <!-- 基本信息 -->
          <div ref="title1" id="orderInfo">
            <span class="title">基本信息</span>
            <br/>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">订单号：</span><span class="valueStyle ellipsis" :title="orderInfos.salesOrderNo">{{orderInfos.salesOrderNo}}</span></div>
              <div class="line-child"><span class="titleText">平台单号：</span><span class="valueStyle ellipsis" :title="orderInfos.sourceOrderNo">{{orderInfos.sourceOrderNo}}</span></div>
              <div class="line-child"><span class="titleText">下单时间：</span><span class="valueStyle">{{orderInfos.orderTime}}</span></div>
              <div class="line-child"><span class="titleText">付款时间：</span><span class="valueStyle">{{orderInfos.payTime}}</span></div>
              <div class="line-child"><span class="titleText">店铺：</span><span class="valueStyle ellipsis" :title="orderInfos.storeName">{{orderInfos.storeName}}</span></div>
            </div>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">买家ID：</span><span class="valueStyle ellipsis" :title="orderInfos.customerName">{{orderInfos.customerName}}</span></div>
              <div class="line-child"><span class="titleText">订单状态：</span><span class="valueStyle">{{orderInfos.orderStatusName}}</span></div>
              <div class="line-child"><span class="titleText">异常标记：</span><span class="valueStyle ellipsis" :title="orderInfos.orderAbnormalSign">{{orderInfos.orderAbnormalSign}}</span></div>
              <div class="line-child"><span class="titleText">拆合状态：</span><span class="valueStyle ellipsis" :title="orderInfos.splitJoinStatus">{{orderInfos.splitJoinStatus}}</span></div>
              <div class="line-child"><span class="titleText">订单渠道：</span><span class="valueStyle">
                <!--<span v-if="orderInfos.orderChannel==1">网店直营</span>
                <span v-if="orderInfos.orderChannel==2">手工下单</span>-->
                <span>{{orderInfos.orderChannel?orderInfos.orderChannel:''}}</span>
              </span></div>
            </div>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">订单总金额：</span><span class="valueStyle">{{orderInfos.orderTotalAmt?orderInfos.orderTotalAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">商家优惠：</span><span class="valueStyle">{{orderInfos.merchantDctAmt?orderInfos.merchantDctAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">平台优惠：</span><span class="valueStyle">{{orderInfos.ecDctAmt?orderInfos.ecDctAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">实付金额：</span><span class="valueStyle">{{orderInfos.actuallyPayAmt?orderInfos.actuallyPayAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">代收金额：</span><span class="valueStyle">{{orderInfos.expressServiceAmt?orderInfos.expressServiceAmt:0 | parseNum}}元</span></div>
            </div>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">实收金额：</span><span class="valueStyle">{{(orderInfos.orderTotalAmt - orderInfos.merchantDctAmt) | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">运费：</span><span class="valueStyle">{{orderInfos.freightAmt?orderInfos.freightAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">首次支付金额：</span><span class="valueStyle">{{orderInfos.firstPayAmt?orderInfos.firstPayAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">净重：</span><span class="valueStyle">{{orderInfos.totalWeight?orderInfos.totalWeight:0 | parseNum}}kg</span></div>
              <div class="line-child"><span class="titleText">毛重：</span><span class="valueStyle">{{orderInfos.grossWeight?orderInfos.grossWeight:0 | parseNum}}kg</span></div>
            </div>
            <div class="formatLine">
              <div class="line-child">
                <span class="titleText">仓库：</span>
                <span class="valueStyle">
                   <el-select :disabled="!authorityCode.OMS_ORDERPROCESSING_WAREHOUSE || !isOperation || isOperation2" v-model="orderInfos.storageId" style="width: 60%;">
                      <el-option :label="label" :value="value" :key="value" v-for="(label,value) in elem_storage"></el-option>
                   </el-select>
                </span>
              </div>
              <div class="line-child">
                <span class="titleText">快递：</span>
                <span class="valueStyle">
                  <el-select :disabled="!authorityCode.OMS_ORDERPROCESSING_EXPRESS || !isOperation || isOperation2" v-model="orderInfos.expressId" style="width:60%;">
                    <el-option :label="label" :value="value" :key="value" v-for="(label,value) in elem_express"></el-option>
                  </el-select>
                </span>
              </div>
              <div class="line-child"><span class="titleText">快递单号：</span><span class="valueStyle">{{orderInfos.expressNo}}</span></div>
              <div class="line-child"></div>
              <div class="line-child"></div>
            </div>
            <div class="formatLine">
              <div style="width: 100%;">
                <span class="titleText" style="float:left;">客服备注：</span>
                <span class="valueStyle" v-if="orderInfos.serviceMsg && orderInfos.serviceMsg.length > 500" :title="orderInfos.serviceMsg" style="width:90%;float:left;word-break: break-all;">{{orderInfos.serviceMsg.slice(0,500)}}...</span>
                <div class="valueStyle" v-else :title="orderInfos.serviceMsg" style="width:90%;float:left;word-break: break-all;">{{orderInfos.serviceMsg}}</div>
              </div>
            </div>
            <div class="formatLine">
              <div style="width:100%;" class="line-child">
                <span class="titleText" style="float:left;">买家留言：</span>
                <span class="valueStyle" v-if="orderInfos.customerMsg && orderInfos.customerMsg.length > 500" :title="orderInfos.customerMsg" style="width:90%;float:left;word-break: break-all;">{{orderInfos.customerMsg.slice(0,500)}}...</span>
                <span class="valueStyle" v-else :title="orderInfos.customerMsg" style="width:90%;float:left;word-break: break-all;">{{orderInfos.customerMsg}}</span>
              </div>
            </div>
            <div>
             <span style="width: 100%;">
               <span class="titleText" style="margin-left: 15px;">内部便签：</span>
             <span class="valueStyle">
               <el-input placeholder="请输入内部便签" :disabled="internalDisabled || !authorityCode.OMS_ORDERPROCESSING_INTERNAL || !isOperation" style="width: 50%;" v-model="orderInfos.internalMemoMsg"></el-input>
             </span>
             </span>
            </div>
            <div>
             <span style="width: 100%;">
               <span class="titleText" style="margin-left: 15px;">仓审须知：</span>
             <span class="valueStyle">
               <el-input :disabled="auditDisabled || !authorityCode.OMS_ORDERPROCESSING_GUIDELINES || !isOperation" placeholder="请输入仓审须知" style="width: 50%;" v-model="orderInfos.storageAuditMsg"></el-input>
             </span>
             </span>
            </div>
          </div>
          <!-- 收货人信息 -->
          <div ref="title2" id="consigneeInfo">
            <span class="title paddings">收货人信息</span>
            <br/>
            <span>
              <span class="titleText" style="margin-left: 15px;">收货人：</span>
              <el-input :disabled="!isOperation || isOperation2" v-model="orderInfos.consignee" maxlength="50" class="formarWidth" style="width: 100px;"></el-input>
            </span>
            <span>
              <span class="titleT ext">手机：</span>
              <el-input :disabled="!isOperation || isOperation2" v-model="orderInfos.consigneeMobile" maxlength="50" class="formarWidth" style="width: 110px;"></el-input>
            </span>
            <span>
              <span class="titleText">电话：</span>
              <el-input :disabled="!isOperation || isOperation2" v-model="orderInfos.consigneePhone" maxlength="50" class="formarWidth"></el-input>
            </span>
            <p>
              <span class="titleText">收货地址：</span>
              <prov-city-area style="display:inline-block;" v-if="proCityAreaShow" @channelArea="channelArea" :disabled="!isOperation || isOperation2"  :proCityAreaValue="proCityAreaValue" :proCityAreaLabel="proCityAreaLabel"></prov-city-area>
              <el-input :disabled="!isOperation || isOperation2" v-model="orderInfos.shippingAddress" maxlength="100" style="width: 300px;"></el-input>
            </p>
          </div>
          <!-- 支付信息 -->
          <div ref="title3" id="payInfo">
            <span class="title paddings">支付信息</span>
            <div class="formatLine">
              <div class=""><span class="titleText">支付方式：</span><span class="valueStyle">{{orderInfos.paymentWay}}</span></div><!--payList-->
              <div class=""><span class="titleText">支付单号：</span><span class="valueStyle">{{orderInfos.alipayNo}}</span></div>
              <div class=""><span class="titleText">支付金额：</span><span class="valueStyle"></span>{{orderInfos.actuallyPayAmt | parseNum}}元</div>
              <div class=""><span class="titleText">支付时间：</span><span class="valueStyle">{{orderInfos.payTime}}</span></div>
              <div class=""></div>
            </div>
          </div>
          <!-- 商品信息 -->
          <div ref="title4">
            <span class="title paddings" style="margin-bottom:10px;">商品信息</span>
            <order-detail-dialog :salesOrderId="salesOrderId" :isOperation="isOperation" :isLoading="true" @returnOrderDetail="returnOrderDetail"></order-detail-dialog>
          </div>
          <!-- 操作日志 -->
          <div ref="title5" id="logInfo">
            <span class="title">操作日志</span>
            <!--<public-Log2 sourceType="21"></public-Log2>-->
            <el-table class="col-border" :data="logList" max-height="380" border style="width: 100%;margin-top: 15px;">
              <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="hidden" width="45px">
              </el-table-column>
              <el-table-column prop="billTypeid" align="center" label="单据类型" :show-overflow-tooltip="hidden"
                               width="95px">
                <template slot-scope="scope">
                 <span>订单</span>
                </template>
              </el-table-column>
              <el-table-column prop="billCode" align="center" label="单据编号" :show-overflow-tooltip="hidden"
                               width="135px">
                <template slot-scope="scope">
                  {{orderInfos.salesOrderNo}}
                </template>
              </el-table-column>
              <el-table-column prop="operateName" align="center" label="操作类型" :show-overflow-tooltip="hidden" width="75px">
              </el-table-column>
              <el-table-column prop="operateRemark" align="center" label="操作描述" :show-overflow-tooltip="hidden">
              </el-table-column>
              <el-table-column prop="operater" align="center" label="操作人" :show-overflow-tooltip="hidden" width="85px">
              </el-table-column>
              <el-table-column prop="operateTime" align="center" label="操作时间" :show-overflow-tooltip="hidden" width="135px">
              </el-table-column>
              <el-table-column prop="opersteIp" align="center" label="IP" :show-overflow-tooltip="hidden" width="115px">
              </el-table-column>
              <el-table-column prop="remarks" align="center" label="备注" :show-overflow-tooltip="hidden" width="75px">
              </el-table-column>
            </el-table>
          </div>
          <!-- 订单商品列表弹窗 -->
          <el-dialog v-dialogDrag :close-on-click-modal="false" title="订单商品列表" :visible.sync="itemListFlag" width="950px">
            <span>商品名称:&nbsp;</span>
            <el-input class="itemStyle" v-model="itemName"></el-input>
            <span>商品编号:&nbsp;</span>
            <el-input class="itemStyle" v-model="itemCode"></el-input>
            <span>条形码:&nbsp;</span>
            <el-input class="itemStyle" v-model="itemBarCode"></el-input>
            <span>是否套装:&nbsp;</span>
            <el-select class="itemStyle" v-model="isSet">
              <el-option v-for="(value,key) in setList" :value="key" :label="value" :key="key"></el-option>
            </el-select>
            <el-button type="primary" style="margin-left:30px;" @click="getItemList">查询</el-button>
            <el-table height="500px" highlight-current-row :data="itemList" style="margin-top:20px;">
              <el-table-column type="index" label="序号" align="center">
              </el-table-column>
              <el-table-column prop="skuUrl" label="商品图片" align="center">
                <template slot-scope="scope">
                  <img style="height:36px;" :src="scope.row.skuUrl">
                </template>
              </el-table-column>
              <el-table-column prop="skuCode" label="商品编号" align="center">
              </el-table-column>
              <el-table-column prop="skuBarCode" label="条形码" align="center">
              </el-table-column>
              <el-table-column prop="skuName" label="商品名称" align="center">
              </el-table-column>
              <el-table-column prop="skuSpec" label="规格" align="center">
              </el-table-column>
              <el-table-column prop="skuName" label="是否套装" align="center">
                <template slot-scope="scope">
                  {{scope.row.suit ? '是' : '否'}}
                </template>
              </el-table-column>
              <el-table-column prop="skuPrice" label="商品售价" align="center">
                <template slot-scope="scope">
                  ￥:{{scope.row.skuPrice | parseNum}}
                </template>
              </el-table-column>
              <el-table-column prop="stockSale" label="可售库存" align="center">
                <template slot-scope="scope">
                  <span :style="scope.row.stockSale<0?'color:red':''">{{scope.row.stockSale}}</span>
                </template>
              </el-table-column>
            </el-table>
            <br>
            <el-pagination style="position:absolute;right:45px;" :total="itemTotal" :current-page="itemPage"
                           :page-size="itemSize" @size-change="sizeChange" @current-change="changePage"
                           layout="total,sizes,prev,pager,next, jumper"></el-pagination>
            <br>
            <el-button style="margin-left:40%;margin-top:30px;" @click="itemListFlag=false">取消</el-button>
            <el-button type="primary" @click="itemListFlag=false">确定</el-button>
          </el-dialog>
        </div>
      </div>
      <!--按钮操作区域-->
      <div class="col-button">
        <el-button @click="backPage('cancel')">返回</el-button>
        <el-button v-if="isOperation" type="primary" @click="backPage('sure')">确定</el-button>
      </div>
    </div>
    <div class="fh-loading" v-if="loading" v-loading="loading" element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"></div>
  </div>
</template>

<script>
  import PublicLog2 from '@/components/common/PublicLog2.vue';
  import ProvCityArea from '@/components/common/ProvCityArea.vue';
  import OrderDetailDialog from '@/components/common/OrderDetailDialog.vue';
  import {returnFloat, turnTimestamp, selShowLabel,turnTimestamp3} from '@/assets/js/validate';
  export default {
    name: "",
    components:{
      PublicLog2,
      ProvCityArea,
      OrderDetailDialog
    },
    props:{
      params:Object
    },
    data() {
      return {
        proCityAreaShow:false,//省市区组件
        areaParams:{},//省市区参数回传
        loading:'',//loading
        version: "1.0.0",
        clToken: "", //令牌
        isOrigin: "", //是否为原始单
        titleActiveStatus: 1, //标题栏激活状态
        itemListFlag: false, //商品列表显示状态
        itemList: [], //商品列表
        itemName: "", //商品名字
        itemCode: "", //商品编号
        itemBarCode: "", //商品条形码
        itemSize: 10, //商品列表数量
        itemTotal: 0, //商品列表总数
        itemPage: 1, //商品列表当前页

        internalDisabled:false,//是否可以修改内部便签
        auditDisabled:false,//是否可以修改仓审须知
        hidden: true,//是否滑过行显示
        isSet: "0", //是否套装
        setList: {
          "0": "全部",
          "1": "单品",
          "2": "套装"
        },//套装列表
        orderStatusObj:{
          "1": "待客审",
          "2": "已客审",
          "3": "已财审",
          "4": "已仓审",
          "20": "已分配拣货位",
          "5": "已拣货",
          "6": "已验货",
          "7": "已打包",
          "8": "已称重",
          "9": "已发货",
          "10": "已完成",
          "11": "已取消"
        },//订单状态
        payList: {
          "1": "支付宝",
          "2": "微信",
          "3": "银联",
          "4": "现金",
          "5": "京东"
        },//支付方式列表
        orderInfos: {
          storageId:'',
          expressId:'',
          consigneePhone:'',
        }, //订单详情
        logList: [], //日志列表
        goodsList: [], //商品列表
        titleData: [
          {
            iscur: true,
            name: '基本信息'
          },
          {
            iscur: false,
            name: '收货人信息'
          },
          {
            iscur: false,
            name: '支付信息'
          },
          {
            iscur: false,
            name: '商品信息'
          },
          {
            iscur: false,
            name: '操作日志'
          }
        ],//title
        proCityAreaData:[],//省市级data
        proCityAreaValue:[],//级联下拉value
        proCityAreaLabel:[],//级联下拉label
        elem_store:[],//店铺
        elem_storage:[],//仓库
        elem_express:[],//快递
        flagColorList: {
          "0":"#999",
          "1": "#cd3930",
          "2": "#edcf4c",
          "3": "#72c95d",
          "4": "#3d9bfe",
          "5": "#822aea"
        },//旗帜颜色列表
        fromPage: this.params.fromPage,//从哪个页面跳转的
        salesOrderId:this.params.orderId,//订单id
        isOperation:this.params.fromPage == 'OrderProcessing'?true:false,//是否能操作
        isOperation2:false,
        expressList:[],//仓库快递集合
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{}
      };
    },
    methods: {
      //省市区组件回传
      channelArea(params){
        //console.log(params);
        this.areaParams = params;
        this.loading = false;
      },
      //订单详情回传
      returnOrderDetail(params){
        //console.log(params);
        //params.sourceOrderNo = (params.orderType == 3 || params.orderType == 4)?'':params.sourceOrderNo;
        params.orderTotalAmt =  params.orderTotalAmt? params.orderTotalAmt*1:0;
        params.merchantDctAmt =  params.merchantDctAmt? params.merchantDctAmt*1:0;
        this.orderInfos = params;

        if(params.storageId){
          this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version + "/getExpressListBeanGroupByStorageId", {
            storageId:params.storageId
          }).then((res) => {
            if (res.data.success) {
              var expressObj = {};
              if(res.data.result[params.storageId]){
                res.data.result[params.storageId].forEach((item,i)=>{
                  expressObj[item.expressId] = item.expressName;
                })
                this.elem_express = expressObj;
                this.orderInfos.expressId = params.expressId;
                var showExpress = true;
                for (var item in this.elem_express) {
                  if (item == this.orderInfos.expressId) {
                    showExpress = false;
                  }
                }
                if(!this.orderInfos.expressName || showExpress)this.orderInfos.expressId='';
              }else{
                this.elem_express = this.expressList;
                var showExpress = true;
                for (var item in this.elem_express) {
                  if (item == this.orderInfos.expressId) {
                    showExpress = false;
                  }
                }
                if(!this.orderInfos.expressName || showExpress)this.orderInfos.expressId='';
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          })
        }else{
          //this.loading = false;
          this.elem_express = this.expressList;
          var showExpress = true;
          for (var item in this.elem_express) {
            if (item == this.orderInfos.expressId) {
              showExpress = false;
            }
          }
          if(!this.orderInfos.expressName || showExpress)this.orderInfos.expressId='';
        }

        //只有待仓审和待客审可以改
        if(params.orderStatusName == '待仓审' || params.orderStatusName == '待客审'){
          this.isOperation2 = false;
        }else{
          this.isOperation2 = true;
        }

        //公共日志
        this.getLog();
        //storageId expressId
        var showStorage = true;
        for(var item in this.elem_storage){
          if(item == this.orderInfos.storageId){
            showStorage = false;
          }
        }
        if(!this.orderInfos.storageName || showStorage)this.orderInfos.storageId='';

        this.orderInfos.orderTime = this.orderInfos.orderTime?turnTimestamp(this.orderInfos.orderTime):'';
        this.orderInfos.payTime = this.orderInfos.payTime?turnTimestamp(this.orderInfos.payTime):'';
        this.proCityAreaValue=[this.orderInfos.provinceRegionId+'',this.orderInfos.cityRegionId+'',this.orderInfos.areaRegionId+'',this.orderInfos.townRegionId+''];
        this.proCityAreaLabel = [this.orderInfos.consigneeProvince,this.orderInfos.consigneeCity,this.orderInfos.consigneeArea,this.orderInfos.consigneeTown];
        this.proCityAreaShow = true;
      },
      //返回上一页
      backOrderFn(item){
        if(item == 1){
          this.$emit('changeShow',true);
        }else{
          this.$emit('changeShow');
        }
      },
      //返回上一页
      backPage(value) {
        if(value == 'sure'){
          if(this.areaParams.validatePass){
            this.$message({
              message: this.areaParams.validatePass,
              type: "warning"
            });
            return false;
          }
          //console.log(this.orderInfos);
          var itemObj = {
            salesOrderId:this.salesOrderId,
            storageId:this.orderInfos.storageId,
            editUpdateTime:this.orderInfos.editUpdateTime?this.orderInfos.editUpdateTime:'',
            storageName:this.orderInfos.storageId?this.elem_storage[this.orderInfos.storageId]:'',
            expressId:this.orderInfos.expressId,
            expressName:this.orderInfos.expressId?this.elem_express[this.orderInfos.expressId]:'',
            internalMemo:this.orderInfos.internalMemoMsg,
            storageAuditMes:this.orderInfos.storageAuditMsg,//仓审须知
            receiveAddress:this.orderInfos.shippingAddress,//收货详细地址
            provinceId:this.areaParams.proCityAreaValue[0],
            cityId:this.areaParams.proCityAreaValue[1],
            areaId:this.areaParams.proCityAreaValue[2],
            townId:this.areaParams.proCityAreaValue[3],
            isAppend:1,
            consignee:this.orderInfos.consignee,
            consigneeMobile:this.orderInfos.consigneeMobile,
            consigneePhone:this.orderInfos.consigneePhone,
          }
          for(var item in itemObj){
            if(itemObj[item] == 'undefined'){
              itemObj[item] = '';
            }
          }
          this.loading = true;
          this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/saveSalesOrderDetailInfo", itemObj).then((response) => {
            this.loading = false;
            if (response.data.success) {
              this.$message({
                message: '保存成功',
                type: "success"
              });
              setTimeout(()=>{
                this.backOrderFn(1);
              },300)
            }else {
              this.$message({
                message: response.data.msg,
                type: "warning"
              });
            }
          })
        }else{
          /*if(this.fromPage=='OrderProcessing'){
            this.$router.push("/orderProcessing");
          }else{
            this.$router.push("/orderQuery");
          }*/
          this.backOrderFn();
        }
      },
      //获取日志列表
      getLog(){
        this._post('com.edb01.erp.log.service.api.OperateLogService/'+this.version+'/getLogList',{
          sourceType:40,
          sourceId:this.orderInfos.salesOrderNo,
          operateType:''
        }).then((response)=>{
          if(response.data.code==0){
            this.logList = response.data.result;
            this.logList.forEach((item, i) => {
              item.operateTime = turnTimestamp(item.operateTime);
            })
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //获取商品列表
      getItemList() {
        const temp = {
          suit: this.isSet,
          size: this.itemSize,
          page: this.itemPage,
          barCode: this.itemBarCode,
          skuName: this.itemName,
          skuCode: this.itemCode
        };
        const data = {
          replaceSearchBean: JSON.stringify(temp)
        };
        this._post("com.edb01.erp.biz.oms.baseservice.OrderBaseFunService/" + this.version + "/funUpdateProductFindNewProductList", data).then((response) => {
          if (response.data.code == 0) {
            this.itemList = response.data.result.rows;
            this.itemTotal = response.data.result.total;
            this.itemPage = response.data.result.page;
            this.itemSize = response.data.result.size;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //换页
      changePage(value) {
        this.itemPage = value;
        this.getItemList();
      },
      //每页显示数量
      sizeChange(value) {
        this.itemSize = value;
        this.getItemList();
      },
      //更换每页显示数量
      handleSizeChange() {
        this.logInit();
      },
      //更换页数
      handleCurrentChange() {
        this.logInit();
      },
      //表头切换class的方法
      setCur(index) {
        setTimeout(() => {
          this.titleData.map(function (v, i) {
            v.iscur = i == index ? true : false;
          });
        }, 20)
        document.querySelector('.detail-box').scrollTop = this.$refs['title' + (index + 1)].offsetTop - 75;
      },
      //获取店铺仓库快递list
      getQueryInit() {
        this.loading = true;
        this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/getPageElement").then((response) => {
          if (response.data.code == 0) {
            this.elem_store = response.data.result.elem_store;
            this.elem_storage = response.data.result.elem_storage;
            this.expressList = response.data.result.elem_express;
          } else {
            this.loading = false;
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })

        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateNoteMsgCheck",{
          orderIds:this.salesOrderId
        }).then((response) => {
          if (response.data.success) {
            this.internalDisabled = response.data.result?false:true;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateStorageMsgCheck",{
          orderIds:this.salesOrderId
        }).then((response) => {
          if (response.data.success) {
            this.auditDisabled = response.data.result?false:true;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      }
    },
    mounted(){
      //点击表头动态切换样式
      var self = this;
      $('.detail-box').on('scroll',function () {
        var h1 =  self.$refs.title1.offsetTop - 75,
          h2 = self.$refs.title2.offsetTop - 75,
          h3 = self.$refs.title3.offsetTop - 75,
          h4 = self.$refs.title4.offsetTop - 75,
          h5 = self.$refs.title5.offsetTop - 75;
        if ($('.detail-box').scrollTop() > h1 && $('.detail-box').scrollTop() < h2) {
          self.titleData.map(function (v, i) {
            i == 0 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h2 && $('.detail-box').scrollTop() < h3) {
          self.titleData.map(function (v, i) {
            i == 1 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h3 && $('.detail-box').scrollTop() < h4) {
          self.titleData.map(function (v, i) {
            i == 2 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h4 && $('.detail-box').scrollTop() < h5) {
          self.titleData.map(function (v, i) {
            i == 3 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h5) {
          self.titleData.map(function (v, i) {
            i == 4 ? v.iscur = true : v.iscur = false;
          });
        }
      })
    },
    created() {
      //初始化
      this.getQueryInit();
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped >
  .classFlag{
    margin-left:40px;
  }
  .ellipsis{
    width:142px;display:inline-block;margin-bottom:-5px;
  }
  .line-child{
    flex:1;
  }
  #detail-container {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 75px 0px 55px 0px;
  }

  .detail-box {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding-right: 15px;
  }

  #topTitle .cur {
    height: 99%;
    border-bottom: 1px solid #999;
    color: #25BAFF;
  }

  #topTitle {
    left: 0;
    top: 45px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    z-index: 10;
    position: absolute;
    width: 100%;
  }

  #topTitle li {
    float: left;
    width: 20%;
    height: 100%;
    min-width: 100px;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    background: #f4f4f4;
    cursor: pointer;
  }

  #topTitle li a {
    display: inline-block;
    text-align: center;
    text-decoration: none;
    width: 100%;
    height: 100%;
    color: #848484;
    box-sizing: border-box;
  }

  .fixd {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: space-around;
    background: white !important;
  }

  .container {
    overflow-y: visible;
  }

  .itemStyle {
    width: 120px;
  }

  .el-tb-edit .el-input {
    display: none;
    width: 100%;
  }

  [v-cloak] {
    display: none !important;
  }

  .el-tb-edit .current-row .el-input {
    display: inherit;
  }

  .el-tb-edit .current-row .el-input + span {
    display: none;
  }

  #titleBar {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 28px;
  }

  .titleBtn {
    background-color: transparent;
    border: none;
  }

  #pageTool {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 100;
  }

  #bottomBtn {
    margin-top: 25px;
  }

  .btnStyle {
    width: 100px;
  }

  .formarWidth {
    width: 115px;
  }

  .btnStyle:hover {
    background-color: #409eff;
    color: white;
  }

  .formatLine {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    margin-left:5px;
  }

  .clearStyle {
    width: 50px !important;
    border: none;
    background-color: transparent;
  }

  .helpNum {
    width: 58% !important;
    position: absolute !important;
    left: 10% !important;
    top: 32% !important;
    padding-left: 15% !important;
  }

  .titleText {
    margin-left: 10px;
    font-weight: 500;
    display: inline-block;
    margin-top: 20px;
  }

  .valueStyle {
    margin-top: 20px;
    margin-right: 15px;
  }

  .title {
    display: inline-block;
    margin-top: 20px;
    margin-left: 10px;
    font-weight: 600;
    font-size: 14px;
  }

  #titleBar li {
    float: left;
    text-align: center;
    height: 25px;
    cursor: pointer;
    width: 100px;
  }
  #titleBar li span {
    display: inline-block;
    width: 100%;
    line-height: 28px;
  }

  #titleBar span:hover {
    color: #323941;
    border-radius: 0;
    border-bottom: solid 2px #3d4144;
  }

  .titleActive {
    color: #323941;
    border-radius: 0;
    padding-bottom: 28px !important;
    border-bottom: solid 2px #3d4144;
  }
</style>
