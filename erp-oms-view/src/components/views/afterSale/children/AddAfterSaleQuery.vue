<!--添加售后查询 贾南风-->
<template>
  <div id="addAfterSaleQuery">
    <div>
      <el-breadcrumb separator=">"  style="margin-bottom: 10px">
        <el-breadcrumb-item @click.native="backOne">售后处理</el-breadcrumb-item>
        <el-breadcrumb-item>添加售后单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="searchBox" class="searchBox">
      <div class="query-button" style="margin-left: -30px"><!--查询区-->
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post1">店铺</label>
          <select id="example-post1" name="multiselect[]" multiple="multiple">
            <option  v-for="item in shop" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <!--<div class="grid-content special" >
          <label>快递公司</label>
          <el-select style="width: 200px!important;" v-model="queryOrder.expressId"  clearable placeholder="请选择" >
            <el-option
              v-for="item in listExpress"
              :key="item.expressId"
              :label="item.expressName"
              :value="item.expressId">
            </el-option>
          </el-select>
        </div>
        <div class="grid-content">
          <label>快递单号</label>
          <el-input style="width: 200px!important;" v-model="queryOrder.expressNo"></el-input>
        </div>-->
        <div class="grid-content" id="shop-box">
          <label>商品</label>
          <el-input style="width: 200px!important;" v-model="queryOrder.barCodes"></el-input>
          <i class="el-icon-close error" @click="queryOrder.barCodes=''"></i> <!--X-->
          <span class="dot" @click="dialogVisible=true;queryShop();">...</span><!--...-->
        </div>
        <div class="grid-content space" >
          <el-select style="width: 100px!important;" v-model="queryOrder.receiveType"  clearable placeholder="请选请选">
            <el-option
              v-for="item in custom"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width: 200px!important;margin-right: 15px" v-model="queryOrder.receiveInfo" placeholder="请输入内容" ></el-input>
        </div>
        <div class="grid-content">
          <el-select style="width: 100px!important;margin-left: 20px" v-model="queryOrder.timeType"  clearable placeholder="请选择">
            <el-option
              v-for="item in timeS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            style="width: 290px"
            v-model="value5"
            type="datetimerange"
            range-separator="-"
            @blur="dateChangeQuery"
            :clearable="false"
            format="yyyy/MM/dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <span class="button-span" :class="{ span1: isActive1 }" @click="nowTime">今天</span>
          <span class="button-span" :class="{ span1: isActive2 }" @click="sevenTime">近7天</span>
          <span class="button-span" :class="{ span1: isActive3 }" @click="thirtyTime">近30天</span>
        </div>
      </div>
      <div class="rightBox3">
        <el-button  type="primary"  @click="queryData">查 询</el-button>
        <el-button  @click="resetData">重 置</el-button>
      </div>
    </div>
    <div style="clear:both"></div>
    <div class="ledgement"></div>
    <div class="col-border1">
      <el-table
        :data="tableData"
        border
        id="fitTable"
        :height="table_h1"
        highlight-current-row
        @current-change="handleCurrentChangeTable"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="50"
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          sortable
          prop="salesOrderNo"
          align="center"
          label="订单号"
          width="150">
        </el-table-column>
        <el-table-column
          align="center"
          width="150"
          label="平台单号">
          <template slot-scope="scope">
            <span v-if="scope.row.replaceSourceOrderNo"> {{scope.row.replaceSourceOrderNo}}</span>
            <span v-else> {{scope.row.sourceOrderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeName"
          align="center"
          label="店铺"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          label="发货状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.sendStatus==1">未发货</span>
            <span v-if="scope.row.sendStatus==2">部分发货</span>
            <span v-if="scope.row.sendStatus==3">已发货</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="buyerNick"
          align="center"
          label="买家ID"
        >
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="consignee"
          align="right"
          label="收货人"
        >
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="consigneeMobile"
          align="right"
          label="手机号"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="shippingAddress"
          label="收货地址"
          min-width="120"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          sortable
          prop="orderTotalAmt"
          label="订单总金额"
          align="center"
          width="110"
        >
        </el-table-column>
        <el-table-column
          sortable
          prop="actuallyPayAmt"
          label="实付金额"
          min-width="95"
          align="center">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="sendTime"
          label="发货时间"
          align="center">
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: right;margin-top: 5px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100,200]"
        :page-size="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
    <!--<el-button type="primary" style="margin-left: 50%;margin-top: 10px" @click="nextStep">下一步</el-button>-->
    <div class="col-pagination">
      <el-button type="primary" style="margin-left: 45%;margin-top: 10px" @click="nextStep">下一步</el-button>
    </div>
    <!--查询商品弹框-->
    <div id="pop-up">
      <el-dialog v-dialogDrag
                 title="请选择所查询商品"
                 :visible.sync="dialogVisible"
                 width="720px"
      >
        <div  id="input-box">
          <el-row>
            <el-col :span="18"><div class="grid-content bg-purple">
              <el-input style="width: 100px!important;margin-right: 19px" v-model="findShop.goodsCode" placeholder="请输入商品编号"></el-input>
              <el-input style="width: 100px!important;margin-right: 19px" v-model="findShop.barCode" placeholder="输入条形码"></el-input>
              <el-input style="width: 100px!important;margin-right: 19px" v-model="findShop.goodsName" placeholder="请输入商品名称"></el-input>
              <el-input style="width: 100px!important;" v-model="findShop.goodsSpec" placeholder="请输入商品规格"></el-input>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light" style="float: right">
              <el-button type="primary" style="width: 74px!important;" @click="queryShop">查询</el-button>
              <el-button style="width: 74px!important;" @click="shopReset">重置</el-button>
            </div></el-col>
          </el-row>
        </div>
        <div>
          <el-table
            :data="tableData1"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange1"
            border
            :height="570"
            style="width: 100%">
            <el-table-column
              fixed="left"
              type="index"
              align="center"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              fixed="left"
              align="center"
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="商品"
              width="200">
              <template slot-scope="scope">
                <img :src="scope.row.goodsImageBean.imageUrl" alt="" style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                <span>{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="goodsCode"
              :show-overflow-tooltip="true"
              width="80"
              label="商品编号">
            </el-table-column>
            <el-table-column
              align="center"
              prop="barCode"
              width="140"
              :show-overflow-tooltip="true"
              label="条形码">
            </el-table-column>
            <el-table-column
              align="center"
              prop="specification"
              width="56"
              :show-overflow-tooltip="true"
              label="规格">
            </el-table-column>
            <el-table-column
              align="center"
              prop="brandName"
              width="120"
              :show-overflow-tooltip="true"
              label="商品品牌">
            </el-table-column>
            <el-table-column
              align="right"
              prop="salesPrice"
              width="56"
              :show-overflow-tooltip="true"
              label="售价">
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="currentPage1"
            :page-sizes="[15, 30, 50, 100,200]"
            :page-size="totalPage1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum1">
          </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">返回</el-button>
    <el-button type="primary" @click="ChooseSure">确认选择</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { turnTimestamp } from '@/assets/js/validate';
  export default {
    props: {
      params: Object //接收父级参数
    },
    data() {
      return {
        version: '1.0.0',//版本号
        queryO : ()=>{},//方法
        queryShop : ()=>{},//方法
        table_h1: 0,//表格的高度
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 数据总条数
        totalPage1: 15, // 要显示的条数
        currentPage1: 1, //
        totalNum1: 0, // 数据总条数
        dialogVisible: false, // 查询商品弹框
        tableData1: [],
        tableData: [],// 接受查询数据
        listExpress: [],//快递公司
        //value:1,//
        value5: [],//日期
        //input: '',//
        shopList: [],//选择商品的checkBox接受值
        isActive1: false, //今天
        isActive2: true, //近7天
        isActive3: false, //近30天
        isAdd: false, // 是否添加
        shop: [], // 店铺
        platNum: '', // 选中的平台单号
        orderId: '', // 选中的订单Id
        sendStatus: '', // 选中的发货状态
        obj: '',//接受组件数据
        queryOrder: { // 查询参数
          timeType: 1,//时间类型ID 1发货时间.2.付款时间，3下单时间
          timeStart: new Date(new Date() - 3600 * 1000 * 24 * 7).getTime(),//开始时间
          timeEnd: new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime(),
          storeIds: '', //店铺ID,逗号隔开
          expressId: '', //快递ID
          expressNo: '',
          receiveType: 5,//收货人信息类型ID 1.订单号.2.买家ID.3.收货人4.手机号 5.平台单号
          receiveInfo: '',//收货
          barCodes: '',//支持选择多条商品，匹配规则为：订单中包含所选商品中
          page: 1,//页码
          Size: 15,//每页大小
        },
        // 查询商品参数
        findShop: {
          page: 1,   //当前页
          size: 15,   //每页条数
          goodsCode: '',   //商品编码
          barCode: '',       //条形码
          goodsName: '',  //商品名称
          goodsSpec: '',  //商品规格
        },
        //枚举
        afterType: [ // 售后类型
          {value: '',label: '全部'},
          {value: 1,label: '退货退款'},
          {value: 2,label: '仅退款'},
        ],
        //
        timeS: [
          {value: 1,label: '发货时间'},
          {value: 2,label: '付款时间'},
          {value: 3,label: '下单时间'},
        ],
        abnormal: [ // 是否异常
          {value: '',label: '全部'},
          {value: true,label: '是'},
          {value: false,label: '否'},
        ],
        manageState: [ // 处理状态
          {value: '',label: '全部'},
          {value: 1,label: '未处理'},
          {value: 2,label: '处理中'},
          {value: 3,label: '已完成'},
          {value: 4,label: '已作废'},
          {value: 5,label: '已终结'},
        ],
        returns: [ // 退货状态
          {value: '',label: '全部'},
          {value: 1,label: '未退货'},
          {value: 2,label: '同意退货'},
          {value: 3,label: '部分收货'},
          {value: 4,label: '全部收货'}
        ],
        bills: [ // 单据来源
          {value: '',label: '全部'},
          {value: 1,label: '线上下载'},
          {value: 2,label: '手工下单'},
        ],
        //自定义查询条件
        custom: [ // 处理状态 /*1.订单号.2.买家ID.3.收货人4.手机号 5.平台单号*/
          {value: 5,label: '平台单号'},
          {value: 1,label: '订单号'},
          {value: 2,label: '买家ID'},
          {value: 3,label: '收货人'},
          {value: 4,label: '手机号'},
        ],
      }
    },
    methods:{
      // 商品里的重置按钮
      shopReset() {
        this.findShop.goodsCode = '';//商品编码
        this.findShop.barCode = ''; //条形码
        this.findShop.goodsName = '';//商品名称
        this.findShop.goodsSpec = ''; //商品规格
      },
      // 时间失去焦点
      dateChangeQuery() {
        // 选择完时间后赋值给查询参数
        if(!this.value5){ // 没值的情况下状态取消
          this.isActive1 = false;
          this.isActive2 = false;
          this.isActive3 = false;
          this.queryOrder.timeStart = '';
          this.queryOrder.timeEnd = '';
        }else{ // 有值的情况下判断
          let date = new Date();
          let year = date.getFullYear(); // 年
          let month = date.getMonth(); // 月
          let strDate = date.getDate(); // 日
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          let a = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime();
          let b = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime();
          let c = new Date(year, month, strDate, 23, 59,59).getTime();
          this.queryOrder.timeStart = this.value5[0].getTime();
          this.queryOrder.timeEnd =  this.value5[1].getTime();
          if(this.value5[1].getTime() == a || this.value5[1].getTime() == b || this.value5[1].getTime() == c){

          }else{
            this.isActive1 = false;
            this.isActive2 = false;
            this.isActive3 = false;
          }
        }
      },
      // 查询时间
      queryData() {
        let arr = $('#example-post1').val();
        let str = '';
        arr.forEach(item => {
          str += item + ',';
        });
        this.queryOrder.storeIds = str.slice(0,-1);
        this.queryO(); // 查询数据
      },
      // 重置数据
      resetData() {
        this.queryOrder.timeType = 1;
        this.queryOrder.expressId = '';
        this.queryOrder.expressNo = '';
        this.queryOrder.receiveType = 1;
        this.queryOrder.receiveInfo = '';
        this.queryOrder.barCodes = '';
        this.queryOrder.storeIds = '';
        $('#example-post1').multiselect('dataprovider', this.shop);
        this.sevenTime(); // 7天
      },
      //  每页多少条
      handleCurrentChange1(val) {
        this.currentPage1 = val;
        this.findShop.page = this.currentPage1;
        this.findShop.size = this.totalPage1;
        console.log(val);
        this.queryShop();
      },
      // 当前页
      handleSizeChange1(val) {
        this.totalPage1 = val;
        this.findShop.page = this.currentPage1;
        this.findShop.size = this.totalPage1;
        console.log(val);
        this.queryShop();
      },
      // shop checkbox
      handleSelectionChange1(val) {
        console.log(val);
        this.shopList = val;
      },
      // 选择商品的确认选择按钮
      ChooseSure() {
        this.dialogVisible = false;
        if(this.shopList.length == 0){ // 如何当前用户没有选择商品，则不改变之前的

        }else{
          this.queryOrder.barCodes = '';
          this.shopList.forEach(item => {
            this.queryOrder.barCodes += item.barCode + ',';
          })

          this.queryOrder.barCodes = this.queryOrder.barCodes.slice(0,-1);
        }
      },
      // 下一步 到添加售后单页面
      nextStep(){
        //console.log(this.platNum,this.obj,89);
        if(this.platNum == ''){
          this.$message({
            message: '请选择添加的订单',
            type: 'warning'
          });
          return;
        }

        this.obj.isAdd = this.isAdd;
        this.$emit('changeShow',{childrenShow: 2,platNum:this.platNum,orderId: this.orderId,sendStatus: this.sendStatus ,obj: this.obj});
      },
      // 点击表格某行触发
      handleCurrentChangeTable(val){
        console.log(val.orderType);
        // 订单可售后的明细查询
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getOrderItemData',{orderId: val.salesOrderId})
          .then(res => {
            if(res.data.success){
              if(val.orderType == 3 || val.orderType == 4){ // 订单之前是换货

              }else{
                let num = 0;
                //console.log(res.data.result,99999999);
                res.data.result.itemBeanList.forEach(item => {
                  console.log(item.suitFlag);
                  if(item.giftFlag && item.canReturnQty >=1){ //可退数量大于0并且为赠品可以退货
                  }else{
                    if(item.canReturnAmt == 0 || item.canReturnQty == 0){//可退数量或者可退金额均有一个为0或者都为0则只可进行补发操作
                      num++;
                    }
                  }

                });

                console.log(num,res.data.result.itemBeanList.length);
                if(num == res.data.result.itemBeanList.length){ //若订单商品中有一种商品的可退数量和可退金额均不为0，则可进行退货退款、仅退款、换货、补发
                  this.isAdd = true;
                }else{
                  this.isAdd = false;
                }
              }

            }
          });
        this.platNum  = val.sourceOrderNo;
        this.orderId = val.salesOrderId;
        this.sendStatus = val.sendStatus;
        this.obj = val;
      },
      // 返回售后处理页面
      backOne() {
        this.$emit('changeShow',{childrenShow: 1});
      },
      //checkbox
      handleSelectionChange(val) {
        console.log(val);
      },
      //  当前页
      handleCurrentChange(val) {
        console.log(val);

        this.currentPage = val;
        this.queryOrder.page = this.currentPage;
        this.queryOrder.size = this.totalPage;

        this.queryO();// 请求数据*/
      },
      //  分页
      //  每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        this.queryOrder.page = this.currentPage;
        this.queryOrder.size = this.totalPage;

        this.queryO();// 请求数据*/
      },
      handleClick(row) {
        console.log(row);
      },
      // 获取当前时间(今天)
      nowTime(){
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth(); // 月
        let strDate = date.getDate(); // 日
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        this.value5 = [new Date(year, month, strDate, 0, 0).getTime(), new Date(year, month, strDate, 23, 59,59).getTime()];
        this.isActive1 = true;
        this.isActive2 = false;
        this.isActive3 = false;
        this.queryOrder.timeStart = this.value5[0];
        this.queryOrder.timeEnd =  this.value5[1];
      },
      // 获取时间(近7天)
      sevenTime(){
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth(); // 月
        let strDate = date.getDate(); // 日
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime();
        const start = new Date(year, month, strDate-7, 0, 0).getTime();
        this.value5 = [start, end];
        this.isActive1 = false;
        this.isActive2 = true;
        this.isActive3 = false;
        this.queryOrder.timeStart = this.value5[0];
        this.queryOrder.timeEnd =  this.value5[1];
      },
      // 获取时间(近30天)
      thirtyTime() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth(); // 月
        let strDate = date.getDate(); // 日
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime();
        const start = new Date(year, month, strDate-30, 0, 0).getTime();
        this.value5 = [start, end];
        this.isActive1 = false;
        this.isActive2 = false;
        this.isActive3 = true;
        this.queryOrder.timeStart = this.value5[0];
        this.queryOrder.timeEnd =  this.value5[1];
      }
    },
    created() {
      this.sevenTime(); // 默认七天
      // 启用的快递
      this._post('com.edb01.erp.wms.service.api.ExpressService/' + this.version + '/listExpress')
        .then(res => {
          if(res.data.success){
            res.data.result.unshift({cainiaoFlag: true, expressCoId: "", expressId: "", expressName: "全部", jdThrFlag: true}); // 快递添加一个全部
            this.listExpress = res.data.result;
          }
        });
      // 原始单查询
      this.queryO = () => {
        this._post('com.edb01.erp.ass.service.api.OrderSearchService/' + this.version + '/getOrderBaseList',this.queryOrder)
          .then(res => {
            if(res.data.success){
              res.data.result.rows.forEach(item => { // 发货时间转换
                if(item.sendTime){
                  item.sendTime = turnTimestamp(item.sendTime);
                }
              });
              this.tableData = res.data.result.rows;
              this.totalNum = res.data.result.total;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }

          })
      }
//      this.queryO(); // 调用
      // 商品的查询
      this.queryShop = () => {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryForHandWave',this.findShop)
          .then(res =>{
            if(res.data.success){
              this.tableData1 = res.data.result.rows;
              this.totalNum1 = res.data.result.total;
              //this.tableData1[0].goodsName = '姜黄色羽绒服女短款2018冬装新款姜黄色羽绒服女短款2018冬装新款';
            }
          })
      }
    },
    mounted(){
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if(e && e.keyCode==13){ // enter 键
          //调接口
          this.queryData();
        }
      };
      //渲染表格高度
      this.$nextTick(function() {
        this.table_h1 = $(window).height() - $('.col-border1').offset().top - 110;
      });
      window.onresize = () => {
        this.table_h1 = $(window).height() - $('.col-border1').offset().top - 110;
      };
      // 商户有权限的店铺
      this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/listOauth')
        .then(res => {
          if(res.data.success == true){
            this.shop = res.data.result;
            var value = [];
            for (var item of this.shop){
              item.value = item.storeId;
              item.label = item.storeName;
              value.push(item.storeId);
            }
            //console.log(self.plat);
            $('#example-post1').multiselect('dataprovider', this.shop );
            $('#example-post1').multiselect('select',value);
          }
        })
      $('#example-post1').multiselect({ // 店铺多选的样式
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });

    },

  }
</script>
<style scoped>
  .pagination{
    position: fixed;
    height: 80px;
    border-top: 15px solid #F0F1F5;
    background: #fff;
    bottom: 1px;
    width: 100%;
    left: 0;
    z-index: 10;
  }
  #addAfterSaleQuery .dot{ /*商品里的...号*/
    position: relative;
    left: -45px;
    top: 0;
    font-weight: bold;
    font-size: 18px;
    border-left: 1px solid #C5CBD1;
    display: inline-block;
    height: 28px;
    padding: 0 5px;
    color: #979797;
    cursor: pointer;
  }
  #addAfterSaleQuery .error{ /*商品里的X号*/
    position: relative;
    left: -45px;
    top:2px;
    font-weight: bold;
    cursor: pointer;
    color: #979797;
  }
  .button-span{
    display: inline-block;
    height: 26px;
    line-height: 26px;
    border: 1px solid #979797;
    border-radius: 4px;
    padding: 0  9px;
    cursor: pointer;
    color: #A4A4A4;
    margin-left: 7px;
    font-size: 14px;
  }
  .span1{
    display: inline-block;
    height: 26px;
    line-height: 26px;
    border-radius: 4px;
    padding: 0  9px;
    border: 1px solid #409EFF;
    cursor: pointer;
    background: #409EFF;
    color: #fff;
    margin-left: 7px;
    font-size: 14px;
  }

</style>
<style>
  #addAfterSaleQuery #input-box .el-input__inner{
    padding: 0 5px!important;
  }
  #addAfterSaleQuery #input-box  .grid-content{
    margin-bottom: 10px;
  }
  #addAfterSaleQuery #pop-up .el-dialog__header{
    height: 40px!important;
    padding: 10px 20px 10px;
  }
  #addAfterSaleQuery #shop-box  .el-input__inner{
    padding: 0 46px 0 15px!important;
  }
  #addAfterSaleQuery .btn-group>.btn:first-child{
    width:200px;
    height:28px;
    line-height:15px;
    border:1px solid #d8dce5;
  }
  #addAfterSaleQuery .open>.dropdown-menu{
    width:200px;
  }
  #addAfterSaleQuery .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
    font-size: 12px;
  }
  #addAfterSaleQuery .el-range-editor.el-input__inner{
    padding: 3px 2px;
  }
  #addAfterSaleQuery .el-dialog__body{
    padding: 10px 20px!important;
  }
</style>


