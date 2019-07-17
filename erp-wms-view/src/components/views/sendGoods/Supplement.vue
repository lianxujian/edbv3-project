<!--补打 尘音-->
<template>
  <div id="supplement">
    <div class="pageTop">
      <el-input :disabled="disabled" @keyup.enter.native="orderCodeSearch" v-model="orderCode" maxlength="50" placeholder="请扫描/输入订单号或快递单号，点击【回车】展示订单信息" style="width:400px;margin-right: 10px"></el-input>
      <p style="color: red;margin-left: 65px" v-show="isOrderShow">快递单号不能为空</p>
      <span v-if="abnormalStatus != null || abnormalStatus != undefined || abnormalStatus != ''">{{abnormalStatus}}</span>
    </div>
    <div style="margin-top: 20px;margin-left: 20px">
      <label>单据类型：</label>
      <div style="display: inline-block">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="发货单"></el-checkbox>
          <el-checkbox label="快递面单"></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div v-show="isShow" style="margin-bottom: 80px">
      <div class="pageMid">
        <el-row>
          <div class="formatLine">
            <div class="line-child">
              <span class="titleText">异常标记：</span>
              <span class="valueStyle ellipsis" :title="orderInfos.orderAbnormalSign">{{orderInfos.orderSign}}</span>
            </div>
            <div class="line-child">
              <span class="titleText">订单号：</span>
              <span class="valueStyle ellipsis" :title="orderInfos.salesOrderNo">{{orderInfos.salesOrderNo}}</span>
            </div>
            <div class="line-child">
              <span class="titleText">商品信息：</span>
              <span class="valueStyle ellipsis" :title="orderInfos.sourceOrderNo">{{orderInfos.goodsTypeQty}}/{{orderInfos.goodsQty}}</span>
            </div>
            <div class="line-child"><span class="titleText">订单状态：</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 0">已作废</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 1">待客审</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 2">已客审</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 3">已财务审核</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 4">已仓审</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 5">已打印</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 6">已拣货</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 7">已验货</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 8">已打包</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 9">已称重</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 10">已发货</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 11">已完成</span>
              <span class="valueStyle" v-if="orderInfos.orderStatus == 12">已取消</span>
            </div>
            <div class="line-child">
              <span class="titleText">净重：</span>
              <span class="valueStyle">{{orderInfos.totalWeight?orderInfos.totalWeight:0 | parseNum}}kg</span>
            </div>
          </div>
        </el-row>
        <el-row>
          <div class="formatLine">
            <div class="line-child">
              <span class="titleText">订单总金额：</span>
              <span class="valueStyle">{{orderInfos.orderTotalAmt?orderInfos.orderTotalAmt:0 | parseNum}}元</span>
            </div>
            <div class="line-child">
              <span class="titleText">整单优惠：</span>
              <span class="valueStyle">{{orderInfos.orderDctAmt?orderInfos.orderDctAmt:0 | parseNum}}元</span>
            </div>
            <div class="line-child">
              <span class="titleText">实付金额：</span>
              <span class="valueStyle">{{orderInfos.actuallyPayAmt?orderInfos.actuallyPayAmt:0 | parseNum}}元</span>
            </div>
            <div class="line-child">
              <span class="titleText">运费：</span>
              <span class="valueStyle">{{orderInfos.freightAmt?orderInfos.freightAmt:0 | parseNum}}元</span>
            </div>
            <div class="line-child">
              <span class="titleText">代收金额：</span>
              <span class="valueStyle">{{orderInfos.expressServiceAmt?orderInfos.expressServiceAmt:0 | parseNum}}元</span>
            </div>
          </div>
        </el-row>
        <el-row>
          <div class="formatLine">
            <div class="line-child">
              <span class="titleText">下单时间：</span>
              <span class="valueStyle">{{orderInfos.orderTime}}</span>
            </div>
            <div class="line-child">
              <span class="titleText">付款时间：</span>
              <span class="valueStyle">{{orderInfos.payTime}}</span>
            </div>
            <div class="line-child">
              <span class="titleText">平台单号：</span>
              <span class="valueStyle">{{orderInfos.sourceOrderNo}}</span>
            </div>
            <div class="line-child">
              <span class="titleText">相关单号：</span>
              <span class="valueStyle">{{orderInfos.fromOrderCode}}</span>
            </div>
            <div class="line-child">
              <span class="titleText">仓库：</span>
              <span class="valueStyle">{{orderInfos.storageName}}</span>
            </div>
          </div>
        </el-row>

        <el-row>
          <div class="formatLine">
            <div class="line-child">
              <span class="titleText">快递：</span>
              <span class="valueStyle">{{orderInfos.expressName}}</span>
            </div>
          </div>
        </el-row>
        <el-row>
          <div class="formatLine">
            <div class="line-child">
              <span class="titleText">买家留言：</span>
              <span class="valueStyle">{{orderInfos.customerMsg}}</span>
            </div>
          </div>
        </el-row>
        <el-row>
          <div class="formatLine">
            <div class="line-child">
              <span class="titleText">客服备注：</span>
              <span class="valueStyle">{{orderInfos.serviceMsg}}</span>
            </div>
          </div>
        </el-row>
        <el-row>
          <div class="formatLine">
            <div class="line-child">
              <span class="titleText">内部便签：</span>
              <span class="valueStyle">{{orderInfos.internalMemoMsg}}</span>
            </div>
          </div>
        </el-row>
        <el-row>
          <div class="formatLine">
            <div class="line-child">
              <span class="titleText">仓审须知：</span>
              <span class="valueStyle">{{orderInfos.storageAuditMsg}}</span>
            </div>
          </div>
        </el-row>
        <el-row>
          <div class="formatLine">
            <div class="line-child">
              <span class="titleText">收货信息：</span>
              <span class="valueStyle">
                {{orderInfos.consigneeProvince}}
                {{orderInfos.consigneeCity}}
                {{orderInfos.consigneeArea}}
                {{orderInfos.consigneeTown}}
                {{orderInfos.shippingAddress}}
                {{orderInfos.consignee}}
                {{orderInfos.consigneeMobile}}
              </span>
            </div>
          </div>
        </el-row>
      </div>
      <div class="botBot">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

          <el-table-column align="center" width="250" label="商品信息">
            <template slot-scope="scope">
              <div style="float:left;width:80px;line-height:100px;">
                <img style="width:80%;height:auto;" :src="scope.row.imageUrl" alt="">
              </div>
              <div v-if="scope.row" style="text-align:left;display: flex;min-height: 85px;padding:5px;flex-direction: column;justify-content: center;">
                <p style="line-height:20px;">{{scope.row.goodsName}}</p>
                <p style="line-height:20px;">{{scope.row.goodsBarCode}}</p>
                <p style="line-height:20px;">{{scope.row.goodsSpec}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="数量" align="right">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.goodsQty }}</p>
            </template>
          </el-table-column>

          <el-table-column label="单价" align="right">
            <template slot-scope="scope">
              <p class="initP-g">{{ scope.row.unitPrice }}</p>
            </template>
          </el-table-column>


          <el-table-column label="成交单价" align="right">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.dealUnitPrice }}</p>
            </template>
          </el-table-column>

          <el-table-column label="整单分摊优惠金额" align="right">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.orderDctAmt }}</p>
            </template>
          </el-table-column>

          <el-table-column label="成交金额" align="right">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.turnoverAmt }}</p>
            </template>
          </el-table-column>

          <el-table-column label="批次号" align="center">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.batchNo }}</p>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>
    <!--footer-->
    <div class="wmsFoot">
      <el-button v-if="isShow" @click="close" size="mini">取 消</el-button>
      <el-button v-if="authorityCode.WMS_SUPPLEMENT_PREVIEW" @click="print(1)" size="mini" type="primary">预 览</el-button>
      <el-button v-if="authorityCode.WMS_SUPPLEMENT_PRINT" @click="print" size="mini" type="primary">打 印</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0',
        isExpressShow: false,//快递斜线是否显示

        orderInfos:{},//订单信息

        isShow: false,//订单信息显示/隐藏

        orderCode: '',//订单输入框绑定参数
        isOrderShow: false,//订单输入框校验

        disabled: false,//输入功能限制

        checkList: ['发货单'],//默认为发货单

        table_h: 0,//表格高度
        tableData: [],//表格数据
        isPrint: false,//是否可以打印

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限
      }
    },
    mounted() {

    },
    methods: {

      //打印预览
      print: function (n) {
        let url = '';
        if(n == 1) {
          url = 'http://127.0.0.1:8082/preview'
        }else {
          url = 'http://127.0.0.1:8082/print'
        }
        let data = {
          stype:'SVoucher',
          modelkey: 101,
          cltoken: sessionStorage.getItem('clToken'),
          ids: this.orderInfos.salesOrderId
        };
        $.ajax({
          type: "post",
          url: url,
          data: data
        });
      },

      //校验是否可以打印
      initcheckSendPrint: function () {
        let data = {
          orderId: this.orderCode
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/checkSendPrintInfo',data).then((res) => {
          if(res.data.success){
            if(res.data.result) {
              this.initOrderMsg()
            }else {
              this.$message({
                message: '此订单没有生成过波次，不能进行补打！',
                type: 'warning'
              })
            }
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
      },

      //初始化订单信息
      initOrderMsg: function () {
        let data = {
          orderOrExpressNo: this.orderCode
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/printInfo',data).then(function (res) {
          console.log('tableData',res.data);
          if(res.data.success) {
            this.disabled = true;
            this.isShow = true;
            this.orderInfos = res.data.result;
            this.tableData = res.data.result.itemGoodsBeanList
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

      //根据单号查找
      orderCodeSearch: function () {
        let len = this.orderCode.length;
        if(len == 0) {
          this.isOrderShow = true
        }else {
          this.isOrderShow = false;
          this.initcheckSendPrint();
        }
      },

      //关闭父级便签栏
      close: function () {
        $(parent.document).find('.J_menuTab.active i').click();
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
    margin-top: 20px;
    background: #F2F2F2;
    height: 350px;
    padding: 0 30px
  }
  .botBot{
    margin-top: 20px;
    overflow: hidden;
  }
  .ulBox li{
    margin: 20px 0;
    padding-left: 10px;
    border-bottom: 1px solid #ccc;
  }
  .ulBox li label{
    font-size: 16px;
  }
  .formatLine {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    margin-left:5px;
  }
  .ellipsis{
    width:142px;display:inline-block;margin-bottom:-5px;
  }
  .line-child{
    flex:1;
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
</style>
