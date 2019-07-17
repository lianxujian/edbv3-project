<!--发货 尘音-->
<template>
  <div id="shipments">
    <div class="pageTop">
      <label>快递单号：</label>
      <el-input :disabled="disabled" @keyup.enter.native="orderCodeSearch" v-model="orderCode" maxlength="50" placeholder="请输入/扫描快递单号" style="width:300px;margin-right: 10px"></el-input>
      <p style="color: red;margin-left: 65px" v-show="isOrderShow">快递单号不能为空</p>
      <span v-if="abnormalStatus != null || abnormalStatus != undefined || abnormalStatus != ''">{{abnormalStatus}}</span>
    </div>
    <div class="pageMid">
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <label>订单号：</label>
            <span>{{salesOrderNo}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label>快递信息：</label>
            <span>{{expressName}}</span>
            <span v-if="isExpressShow">/</span>
            <span>{{expressNo}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label>买家ID：</label>
            <span>{{buyerNick}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label>是否开票：</label>
            <span v-if="invoiceFlag == true">是</span>
            <span v-if="invoiceFlag == false">否</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div class="grid-content">
          <label>收货信息：</label>
          <span>{{consignee}} {{consigneeMobile}} {{shippingAddress}}</span>
        </div>
      </el-row>
      <el-row>
        <div class="grid-content">
          <label>买家留言：</label>
          <span>{{customerMsg}}</span>
        </div>
      </el-row>
      <el-row>
        <div class="grid-content">
          <label>客服备注：</label>
          <span>{{serviceMsg}}</span>
        </div>
      </el-row>
      <el-row>
        <div class="grid-content">
          <label>内部便签：</label>
          <span>{{internalMemoMsg}}</span>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0',
        isExpressShow: false,//快递斜线是否显示

        salesOrderNo: '',//订单号
        salesOrderId: '',//订单Id
        expressName: '',//快递信息1
        expressNo: '',//快递信息2
        buyerNick: '',//买家ID
        invoiceFlag: null,//是否开票
        consignee: '',//收货信息1
        consigneeMobile: '',//收货信息2
        shippingAddress: '',//收获信息3
        customerMsg: '',//买家留言
        serviceMsg: '',//客户备注
        internalMemoMsg: '',//内部便签
        abnormalStatus: '',//订单状态


        orderCode: '',//订单输入框绑定参数
        isOrderShow: false,//订单输入框校验

        disabled: false,//输入功能限制
      }
    },
    mounted() {

    },
    methods: {

      //初始化订单信息
      initOrderMsg: function () {
        let data = {
          orderOrExpressNo: this.orderCode
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/sendOutShow',data).then(function (res) {
          console.log('tableData',res.data);
          if(res.data.success) {
            this.salesOrderNo = res.data.result.orderBean.salesOrderNo;
            this.salesOrderId = res.data.result.orderBean.salesOrderId;
            this.expressName = res.data.result.expressName;
            this.expressNo = res.data.result.orderBean.expressNo;
            if(this.expressName != '' && this.expressNo != '') {
              this.isExpressShow = true;
            }

            this.buyerNick = res.data.result.orderBean.buyerNick;
            this.invoiceFlag = res.data.result.orderBean.invoiceFlag;
            this.consignee = res.data.result.orderBean.consignee;
            this.consigneeMobile = res.data.result.orderBean.consigneeMobile;
            this.shippingAddress = res.data.result.orderBean.shippingAddress;
            this.customerMsg = res.data.result.orderBean.customerMsg;
            this.serviceMsg = res.data.result.orderBean.serviceMsg;
            this.internalMemoMsg = res.data.result.orderBean.internalMemoMsg;
            this.abnormalStatus = res.data.result.abnormalStatus;
            if(this.abnormalStatus == '已取消' || this.abnormalStatus == '已退款' || this.abnormalStatus == '退款中') {
              this.disabled = false;
              this.orderCode = ''

            }else {
              this.disabled = false;
              this.initSendOutGoods()
            }
          }else {
            this.$alert(res.data.msg,{
              type: 'info',
              center: true,
              confirmButtonText: '知道了',
              callback: action => {
                this.orderCode = '';
              }
            })

          }

        }.bind(this))
      },

      //重置页面数据
      reset: function () {
        this.disabled = false;
        this.orderCode = '';
        this.isExpressShow = false;
        this.salesOrderNo = '';
        this.salesOrderId = '';
        this.expressName = '';
        this.expressNo = '';
        this.buyerNick = '';
        this.invoiceFlag = null;
        this.consignee = '';
        this.consigneeMobile = '';
        this.shippingAddress = '';
        this.customerMsg = '';
        this.serviceMsg = '';
        this.internalMemoMsg = '';
        this.abnormalStatus = '';
      },

      //发货接口
      initSendOutGoods: function () {
        let data = {
          salesOrderId: this.salesOrderId,
          salesOrderNo: this.salesOrderNo
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/sendOutGoods',data).then(function (res) {
          if(res.data.success) {
            this.reset();
            this.$message({
              message: '发货成功！',
              type: 'success'
            });
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //根据单号查找
      orderCodeSearch: function () {
        let len = this.orderCode.length;
        if(len == 0) {
          this.isOrderShow = true
        }else {
          this.isOrderShow = false;
          this.initOrderMsg()
        }
      },
    }
  }
</script>
<style scoped>
  .pageTop{
    position: relative;
  }
  .pageTop span{
    position: absolute;
    right: 15%;
    top: 20px;
    color: red;
    font-size: 25px;
    font-weight: bolder;
  }
  .pageMid{
    margin-top: 40px;
    background: #F2F2F2;
    height: 188px;
    padding: 10px 30px
  }
  .pageBot{
    margin-top: 20px;
  }
  .botBot{
    margin-top: 20px;
    overflow: hidden;
  }
  .botBotL,.botBotR{
    float: left;
  }
  .botBotR{
    margin-left: 30px;
  }
  .ulBox li{
    margin: 20px 0;
    padding-left: 10px;
    border-bottom: 1px solid #ccc;
  }
  .ulBox li label{
    font-size: 16px;
  }
  .addDiff{
    text-align: right;
    color: blue;
    padding:10px 45px 20px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .iconClose{
    color: #cccccc;
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
  }
  .iconClose:hover{
    color: rgb(96, 98, 102);
  }
</style>
<style>
  #diffBox .el-dialog__body{
    max-height: 300px;
    overflow-y: auto;
  }
</style>
