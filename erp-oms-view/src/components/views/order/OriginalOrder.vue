<!--平台原始单 樊虎-->
<template>
  <div id="OriginalOrder" class="container_search">
    <div id="orderPage">
      <!--搜索查询区-->
      <div>
          <el-row>
            <el-col style="width:440px;">
              <el-select v-model="paramData.orderType" style="width:110px;" placeholder="请选择">
                <el-option value="1" key="1" label="平台单号"></el-option>
                <el-option value="2" key="2" label="快递单号"></el-option>
              </el-select>
              <el-input maxlength="100" style="width:321px;" @keyup.native="paramData.orderValue=paramData.orderValue.replace(/[^\d|a-z|-]/ig,'')" v-model="paramData.orderValue" ></el-input>
            </el-col>
            <el-col :span="6">
              <el-select v-model="paramData.payType" style="width:120px;" placeholder="请选择">
                <el-option value="1" key="1" label="订单总金额"></el-option>
                <el-option value="2" key="2" label="买家实付金额"></el-option>
                <el-option value="3" key="3" label="首次支付金额"></el-option>
                <el-option value="4" key="4" label="二次支付金额"></el-option>
              </el-select>
              <el-input maxlength="100" style="width:58%;" @keyup.native="paramData.payValue=paramData.payValue.replace(/[^\d]/ig,'')" v-model="paramData.payValue" ></el-input>
            </el-col>
            <el-col :span="5">
              <label for="">所属平台：</label>
              <multiple-select
                :selectArr="ecBeansArr"
                placeholder="全部"
                :valueArr="paramData.ecBeans"
                @multipleChange="multipleChange1"
                style="width:65%;">
              </multiple-select>
            </el-col>
            <el-col :span="5" style="width:210px;float:right;text-align: right;">
              <el-button type="primary" @click="conditionSearch">查询</el-button>
              <el-button style="margin:0;" @click="reSetBtn">重置</el-button>
            </el-col>
          </el-row>
        <el-row style="margin-top:10px;">
          <el-col style="width:440px;">
            <el-select v-model="paramData.dateType" style="width:110px;" placeholder="请选择">
              <el-option value="1" key="1" label="下单时间"></el-option>
              <el-option value="2" key="2" label="付款时间"></el-option>
              <el-option value="3" key="3" label="完成时间"></el-option>
              <el-option value="4" key="4" label="发货时间"></el-option>
            </el-select>
            <el-date-picker style="width:321px;" class="fh-picker" :clearable="false" v-model="pickerTimer" type="datetimerange"
                            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
                            :editable="false">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-select v-model="paramData.phoneType" style="width:120px;" placeholder="请选择">
              <el-option value="1" key="1" label="手机"></el-option>
              <el-option value="2" key="2" label="电话"></el-option>
            </el-select>
            <el-input maxlength="100" style="width:58%;" @keyup.native="paramData.phoneValue=paramData.phoneValue.replace(/[^\d]/ig,'')" v-model="paramData.phoneValue"></el-input>
          </el-col>
          <el-col :span="5">
            <label for="">店铺名称：</label>
            <multiple-select
              :selectArr="storeBeansArr"
              placeholder="全部"
              :valueArr="paramData.storeBeans"
              @multipleChange="multipleChange2"
              style="width:65%;">
            </multiple-select>
          </el-col>
          <el-col :span="5" style="text-align:right;">
          </el-col>
        </el-row>
      </div>
      <!--操作按钮区-->
      <div class="col-nav" style="margin-top:10px;">
        <ul>
          <li @click="dataExport" v-if="authorityCode.OMS_ORDQUERY_EXPORT"><span>导出</span></li>
        </ul>
      </div>
      <div style="padding-bottom: 32px;margin-top:10px;">
        <!-- 表格区订单列表 -->
        <ag-grid-vue :style='{"height":agHeight+"px","width": "100%"}'
                     class="ag-theme-balham ag-table"
                     :gridOptions="gridOptions"
                     :columnDefs="columnDefs"
                     :rowData="orderList"
                     :pinnedBottomRowData="pinnedBottomRowData"
                     rowSelection="multiple"
                     :enableFilter="true"
                     :components="components"
                     :enableSorting="true"
                     :gridReady="onGridReady"><!--:enableSorting="true"-->
        </ag-grid-vue>
      </div>
      <div id="pageTool" class="col-pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[15,30,50,100,200,1000,2000]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { zeroFill,positiveIntegerValidator,priceValidator,gridOptions,turnTimestamp,phoneEncrypt } from '@/assets/js/validate.js';
  import {AgGridVue} from "ag-grid-vue";
  export default {
    name: "OriginalOrder",
    components: {
      'ag-grid-vue': AgGridVue,
      RowFn: {//params.node.rowIndex+1
        template: `<span><span v-if="params.data.index == '合计'">{{params.data.index}}</span><span v-else>{{params.node.rowIndex+1}}</span></span>`
      },
      sourceOrderComponent:{
        template: `<span><span class="jump" @click="sourceOrderDetail" style="color:#409eff;cursor:pointer;">{{params.data.sourceOrderNo}}</span></span>`,
        methods: {
          sourceOrderDetail(){
            this.params.context.sourceOrderDetail(this.params.data);
          }
        }
      }
    },
    data() {
      return {
        pickerTimer:[],
        pinnedBottomRowData:[],
        version: "1.0.0",
        total: 0, //总页数
        size: 15, //每页数量
        page: 1, //当前页数
        t_height: 0, //表格宽度
        paramData: {
          ecBeans:[],
          storeBeans:[],
          dateType:'1',
          orderType:'1',
          payType:'1',
          phoneType:'1',
          dateStart:'',
          dateEnd:'',
          orderValue:'',
          payValue:'',
          phoneValue:''
        },//查询条件
        exportParam:{},
        ecBeansArr:[],//平台集合
        storeBeansArr:[],//店铺集合
        //ag-grid
        gridOptions: gridOptions(),
        agHeight:0,
        components: null,
        columnDefs: null,
        rowData: null,
        //企业扩展
        gridApi: null,
        columnApi: null,
        autoGroupColumnDef: null,
        //ag-grid
        orderList: [], //订单列表
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
        //订单渠道
        orderSourcesObj:{
          '1':'网店直营',
          '2':'手工下单',
          '3':'导入订单'
        },
        platorderObj:{
          '1':'待客审',
          '2':'已客审',
          '3':'已财审',
          '4':'已仓审',
          '5':'已拣货',
          '6':'已验货',
          '7':'已打包',
          '8':'已称重',
          '9':'已发货',
          '10':'已完成',
          '11':'已取消',
          '12':'已作废',
        },
        flagObj:{
          '0':'',
          '1':"#cd3930",
          '2':"#edcf4c",
          '3':"#72c95d",
          '4':"#3d9bfe",
          '5':"#822aea",
        },
        flagList:{
          '0':'无',
          '1':"红",
          '2':"黄",
          '3':"绿",
          '4':"蓝",
          '5':"紫",
        }
      }
    },
    methods: {
      //多选下拉组件（平台）
      multipleChange1(value) {
        this.paramData.ecBeans = value;
      },
      //多选下拉组件（店铺）
      multipleChange2(value) {
        this.paramData.storeBeans = value;
      },
      //根据条件查询-----------------------------------
      conditionSearch() {
        var paramData = Object.assign(this.paramData, {
          page: this.page,
          size: this.size,
          dateStart:this.pickerTimer && this.pickerTimer[0] ? this.pickerTimer[0] : '',
          dateEnd:this.pickerTimer && this.pickerTimer[1] ? this.pickerTimer[1] : ''
        })
        //paramData 等于 this.paramData
        this.exportParam = JSON.stringify(paramData);
        this.$store.commit('setLoading',true)
        this._post("com.edb01.erp.oms.service.api.OrderVsfBaseListService/" + this.version + "/getOrderVsfList",this.paramData).then((response)=>{
          this.$store.commit('setLoading',false)
          if (response.data.success) {
            this.orderList = response.data.result.rows;
            this.orderList.map((v,index)=>{
              this.$set(v,'index',index+1);
              this.$set(v,'receiveName',v.receiveName && v.receiveName!='undefined'?v.receiveName:'');
              this.$set(v,'receiveMobile',v.receiveMobile && v.receiveMobile!='undefined'?phoneEncrypt(v.receiveMobile):'');
              this.$set(v,'receivePhone',v.receivePhone && v.receivePhone!='undefined'?v.receivePhone:'');
              //v.platorderStatusOnline = this.platorderObj[v.platorderStatusOnline];
              this.$set(v,'createTime',v.createTime?turnTimestamp(v.createTime):'');
              this.$set(v,'payTime',v.payTime?turnTimestamp(v.payTime):'');

              v.receiveProvince = v.receiveProvince && v.receiveProvince != 'undefined'?v.receiveProvince:'';
              v.receiveCity = v.receiveCity && v.receiveCity != 'undefined'?v.receiveCity:'';
              v.receiveArea = v.receiveArea && v.receiveArea != 'undefined'?v.receiveArea:'';
              v.consigneeTown = v.consigneeTown && v.consigneeTown != 'undefined'?v.consigneeTown:'';
              v.receiveAddr = v.receiveAddr && v.receiveAddr != 'undefined'?v.receiveAddr:'';
              v.invoiceFlag = v.invoiceFlag?'是':'否';
              v.codFlag = v.codFlag?'是':'否';
              if(v.flagcolor == 0)v.none = 'none';
              v.flagName = this.flagList[v.flagcolor];

              v.customerMsg = v.customerMsg ? v.customerMsg : '';
              v.serviceMsg = v.serviceMsg ? v.serviceMsg : '';
              v.serviceMsg = v.serviceMsg && v.serviceMsg.length > 500 ? v.serviceMsg.slice(0, 500) : v.serviceMsg;
              v.customerMsg = v.customerMsg && v.customerMsg.length > 500 ? v.customerMsg.slice(0, 500) : v.customerMsg;
              v.buyerNick = v.buyerNick ? v.buyerNick : '';
              v.storeName = v.storeName ? v.storeName : '';
              v.ecName = v.ecName ? v.ecName : '';
              //v.orderSources = this.orderSourcesObj[v.orderSources];//订单渠道
              if (v.orderReviewTime) v.orderReviewTime = turnTimestamp(v.orderReviewTime);//审单时间
              if (v.platsendTime) v.platsendTime = turnTimestamp(v.platsendTime);//发货时间
              if (v.completeTime) v.completeTime = turnTimestamp(v.completeTime);//完成时间

              v.firstpayAmount1 = v.firstpayAmount;
              v.lastpayAmount1 = v.lastpayAmount;
              v.codserviceAmount1 = v.codserviceAmount;
              v.realpayAmount1 = v.realpayAmount;
              v.orderAmount1 = v.orderAmount;
              v.freightAmount1 = v.freightAmount;
              v.expresscollAmount1 = v.expresscollAmount;
              v.firstpayAmount = v.firstpayAmount?'￥'+ zeroFill(v.firstpayAmount):'￥0.00';
              v.lastpayAmount = v.lastpayAmount?'￥'+ zeroFill(v.lastpayAmount):'￥0.00';
              v.codserviceAmount = v.codserviceAmount?'￥' + zeroFill(v.codserviceAmount):'￥0.00';
              v.realpayAmount = v.realpayAmount?'￥' + zeroFill(v.realpayAmount):'￥0.00';
              v.orderAmount = v.orderAmount?'￥'+ zeroFill(v.orderAmount):'￥0.00';
              v.freightAmount = v.freightAmount?'￥' + zeroFill(v.freightAmount):'￥0.00';
              v.expresscollAmount = v.expresscollAmount?'￥' + zeroFill(v.expresscollAmount):'￥0.00';
              return v;
            })
            this.getSummaries();
            this.total = response.data.result.total;
            this.page = response.data.result.page;
            this.size = response.data.result.size;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //计算表格金额合计
      getSummaries(data){
        var tableData = data?JSON.parse(JSON.stringify(data)):JSON.parse(JSON.stringify(this.orderList));
        var obj = {
          index:'合计',
          sourceOrderNo:'',
          flagcolor:'',
          none:'none',
          customerMsg:'',
          serviceMsg:'',
          orderAmount:0,
          freightAmount:0,
          expresscollAmount:0,
          firstpayAmount:0,
          lastpayAmount:0,
          codserviceAmount:0,
          realpayAmount:0,
        }
        tableData.forEach(item => {
          item.orderAmount1 = item.orderAmount1?item.orderAmount1*1:0;
          item.freightAmount1 = item.freightAmount1?item.freightAmount1*1:0;
          item.expresscollAmount1 = item.expresscollAmount1?item.expresscollAmount1*1:0;
          item.firstpayAmount1 = item.firstpayAmount1?item.firstpayAmount1*1:0;
          item.lastpayAmount1 = item.lastpayAmount1?item.lastpayAmount1*1:0;
          item.codserviceAmount1 = item.codserviceAmount1?item.codserviceAmount1*1:0;
          item.realpayAmount1 = item.realpayAmount1?item.realpayAmount1*1:0;

          obj.orderAmount += item.orderAmount1;
          obj.freightAmount += item.freightAmount1;
          obj.expresscollAmount += item.expresscollAmount1;
          obj.firstpayAmount += item.firstpayAmount1;
          obj.lastpayAmount += item.lastpayAmount1;
          obj.codserviceAmount += item.codserviceAmount1;
          obj.realpayAmount += item.realpayAmount1;
        })
        obj.orderAmount = '￥' + zeroFill(obj.orderAmount);
        obj.freightAmount = '￥' + zeroFill(obj.freightAmount);
        obj.expresscollAmount = '￥' + zeroFill(obj.expresscollAmount);
        obj.firstpayAmount = '￥' + zeroFill(obj.firstpayAmount);
        obj.lastpayAmount = '￥' + zeroFill(obj.lastpayAmount);
        obj.codserviceAmount = '￥' + zeroFill(obj.codserviceAmount);
        obj.realpayAmount = '￥' + zeroFill(obj.realpayAmount);
        this.pinnedBottomRowData = [obj];
      },
      //数据导出
      dataExport() {
        this.$store.commit('setLoading',true)
        this._post("com.edb01.erp.oms.service.api.OrderVsfBaseListService/" + this.version + "/export",JSON.parse(this.exportParam)).then((response)=>{
          this.$store.commit('setLoading',false)
          if (response.data.success) {
            location.href = 'http://'+process.env.FILE_API+'/files-web/download/' + response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        }).catch(()=> {
          this.$store.commit('setLoading',false)
          this.$message({
            message: '接口超时，请从后端获取id导出数据',
            type: "warning"
          });
        })
      },
      //重置按钮重置所有变量
      reSetBtn() {
        this.paramData={
          ecBeans:[],
          storeBeans:[],
          dateType:'1',
          orderType:'1',
          payType:'1',
          phoneType:'1',
          dateStart:'',
          dateEnd:'',
          orderValue:'',
          payValue:'',
          phoneValue:''
        }
        this.pickerTimer = [];
      },
      handleSizeChange(value) {
        this.size = value;
        this.conditionSearch();
      },
      handleCurrentChange(value) {
        this.page = value;
        this.conditionSearch();
      },
      //渲染表格高度
      renderTableHeight(){
        this.$nextTick(function () {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 80;
        });
        window.onresize = () => {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 80;
        }
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        //params.api.sizeColumnsToFit();
        this.gridOptions.onSelectionChanged= (event)=> {
          this.orderLists = this.getSelectedRows();
        }
        this.gridOptions.onFilterChanged = (event) => {
          var tableData = [];
          this.gridOptions.api.forEachNodeAfterFilterAndSort((node,index)=>{
            tableData.push(node.data);
          })
          this.getSummaries(tableData);
        }
      },
      getSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map( node => node.data );
        return selectedData;
      },
      //平台单号
      sourceOrderDetail(row){
        this.$router.push({path:'/originalDetail',query: {orderVsfId: row.orderVsfId}})
      },
      //获取店铺集合
      storeListEcho(){
        this._post("com.edb01.erp.mdata.service.api.DtStoreService/" + this.version + "/findGrantStoreByUser").then((response)=>{
          if (response.data.success) {
            response.data.result = response.data.result?response.data.result:[];
            response.data.result.forEach(item => {
              item.value = item.storeId;
              item.label = item.storeName;
            })
            this.storeBeansArr = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //获取平台集合
      storePlatEcho(){
        this._post("com.edb01.erp.mdata.service.api.EcService/" + this.version + "/getEcBeanList").then((response)=>{
          if (response.data.success) {
            response.data.result = response.data.result?response.data.result:[];
            response.data.result.forEach(item => {
              item.value = item.ecId;
              item.label = item.ecName;
            })
            this.ecBeansArr = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
    },
    beforeMount() {
      this.gridOptions.context = this;
      const _this = this;
      this.columnDefs = [
        {headerName: '序号', suppressToolPanel: true,
          pinned: 'left',
          width: 95,
          suppressSorting: true,
          lockPosition: true,checkboxSelection: true,headerCheckboxSelection:true,cellRendererFramework: 'RowFn'},
        {headerName: "买家ID", field: "buyerNick", width: 80},
        {headerName: '平台单号', field: 'sourceOrderNo',width: 120, cellRendererFramework: 'sourceOrderComponent'},
        {headerName: '客服备注', field: 'serviceMsg',width: 100},
        {headerName: '旗帜颜色', field: 'flagName',width: 100 ,cellRenderer: function (params) {
          return `<span>
                    <span style="display:${params.data.none}"><i class="icon iconfont icon-ai246" style="color:${_this.flagObj[params.data.flagcolor]}"></i></span>
                  </span>`
        }},
        {headerName: '代收金额', field: 'expresscollAmount1', width: 100, cellRenderer: function (params) {
          return '<span>' + params.data.expresscollAmount + '</span>'
        }},
        {headerName: '运费', field: 'freightAmount1', width: 80, cellRenderer: function (params) {
          return '<span>' + params.data.freightAmount + '</span>'
        }},
        {headerName: '订单总金额', field: 'orderAmount1', width: 100, cellRenderer: function (params) {
          return '<span>' + params.data.orderAmount + '</span>'
        }},
        {headerName: '买家货到付款服务费', field: 'codserviceAmount1', width: 150, cellRenderer: function (params) {
          return '<span>' + params.data.codserviceAmount + '</span>'
        }},
        {headerName: '买家实付金额', field: 'realpayAmount1', width: 100, cellRenderer: function (params) {
          return '<span>' + params.data.realpayAmount + '</span>'
        }},
        {headerName: '首次付款金额', field: 'firstpayAmount1', width: 115, cellRenderer: function (params) {
          return '<span>' + params.data.firstpayAmount + '</span>'
        }},
        {headerName: '二次付款金额', field: 'lastpayAmount1', width: 115, cellRenderer: function (params) {
          return '<span>' + params.data.lastpayAmount + '</span>'
        }},
        {headerName: "是否货到付款", field: "codFlag", width: 80},
        {headerName: '订单状态', field: 'platorderStatusOnline',width: 100},//platorderStatus
        {headerName: '买家留言', field: 'customerMsg',width: 100},
        {headerName: "收货人",field: "receiveName", width: 80},
        {headerName: '完成时间', field: 'orderReviewTime', width: 150},
        {headerName: '发货时间', field: 'platsendTime', width: 150},
        {headerName: "省份", field: "receiveProvince", width: 80}, {headerName: "城市", field: "receiveCity", width: 80},
        {headerName: "区县", field: "receiveArea", width: 80},
        /*{
          headerName: "镇",
          field: "consigneeTown",
          width: 80
        },*/
        {headerName: "收货地址", field: "receiveAddr", width: 150},
        {headerName: "电话", field: "receivePhone", width: 100},
        {headerName: "手机", field: "receiveMobile", width: 100},
        {headerName: '下单时间', field: 'createTime',width: 150},
        {headerName: '付款时间', field: 'payTime',width: 150},
        {headerName: "店铺名称", field: "storeName", width: 100},
        {headerName: "所属平台", field: "ecName", width: 100},
        {headerName: '快递公司', field: 'expressName',width: 130},
        {headerName: '商品种类', field: 'itemTypeNo',width: 130},
        {headerName: '支付方式', field: 'paymentWay', width: 100},
        {headerName: '订单渠道', field: 'orderSources', width: 100},
        {headerName: '是否开发票', field: 'invoiceFlag', width: 100},
        {headerName: '发票抬头', field: 'title', width: 100},
        {headerName: '税号', field: 'taxNo', width: 100},
        {headerName: '开票类型', field: 'titletypeName', width: 100},
      ];
    },
    mounted() {
      var _this=this;
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13 && $('.v-modal').length == 0){ // enter 键
          //要做的事情
          this.conditionSearch();
        }
      };
      this.conditionSearch();
      this.renderTableHeight();
      this.storeListEcho();
      this.storePlatEcho();
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

