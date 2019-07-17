<!--平台原始单详情 樊虎-->
<template>
  <div id="OriginalDetail">
    <div class="title-Detail">
      <el-breadcrumb separator="/" class="col-breadcrumb">
        <el-breadcrumb-item><span @click="backOrderFn">原始订单查询</span></el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="formatLine">
        <div class="line-child"><span class="titleText">平台单号：</span><span class="valueStyle">{{originalInfos.sourceOrderNo}}</span></div>
        <div class="line-child"><span class="titleText">买家ID：</span><span class="valueStyle">{{originalInfos.buyerNick}}</span></div>
        <div class="line-child"><span class="titleText">旗帜颜色：</span><span class="valueStyle">
          <i v-if="originalInfos.flagcolor != 0" class="icon iconfont icon-ai246" :style="{'color':flagObj[originalInfos.flagcolor]}"></i>
        </span></div>
        <div class="line-child"><span class="titleText">订单状态：</span><span class="valueStyle">{{platorderObj[originalInfos.platorderStatus]}}</span></div>
        <!--<div class="line-child"><span class="titleText">快递单号：</span><span class="valueStyle">{{originalInfos.storeName}}</span></div>-->
        <div class="line-child"><span class="titleText">快递公司：</span><span class="valueStyle">{{originalInfos.expressName}}</span></div>
      </div>
      <div class="formatLine">
        <div class="line-child"><span class="titleText">店铺名称：</span><span class="valueStyle">{{originalInfos.storeName}}</span></div>
        <div class="line-child"><span class="titleText">所属平台：</span><span class="valueStyle">{{originalInfos.ecName}}</span></div>
        <div class="line-child"><span class="titleText">发票抬头：</span><span class="valueStyle">{{originalInfos.title}}</span></div>
        <div class="line-child"><span class="titleText">是否开票：</span><span class="valueStyle">{{originalInfos.invoiceFlag?'是':'否'}}</span></div>
        <div class="line-child"><span class="titleText">税号：</span><span class="valueStyle">{{originalInfos.taxNo}}</span></div>
      </div>
      <div class="formatLine">
        <div class="line-child"><span class="titleText">开票类型：</span><span class="valueStyle">{{originalInfos.titletypeName}}</span></div>
        <div class="line-child"><span class="titleText">支付方式：</span><span class="valueStyle">{{originalInfos.paymentWay}}</span></div>
        <div class="line-child"><span class="titleText">是否货到付款：</span><span class="valueStyle">{{originalInfos.codFlag?'是':'否'}}</span></div>
        <div class="line-child"><span class="titleText">收货人：</span><span class="valueStyle">{{originalInfos.receiveName}}</span></div>
        <div class="line-child"><span class="titleText">省份：</span><span class="valueStyle">{{originalInfos.receiveProvince}}</span></div>
      </div>
      <div class="formatLine">
        <div class="line-child"><span class="titleText">城市：</span><span class="valueStyle">{{originalInfos.receiveCity}}</span></div>
        <div class="line-child"><span class="titleText">区县：</span><span class="valueStyle">{{originalInfos.receiveArea}}</span></div>
        <div class="line-child"><span class="titleText">买家留言：</span><span class="valueStyle ellipsis" :title="originalInfos.customerMsg">{{originalInfos.customerMsg}}</span></div>
        <div class="line-child"><span class="titleText">手机：</span><span class="valueStyle">{{originalInfos.receiveMobile}}</span></div>
        <div class="line-child"><span class="titleText">电话：</span><span class="valueStyle">{{originalInfos.receivePhone}}</span></div>
      </div>
      <div class="formatLine">
        <div class="line-child"><span class="titleText">收货地址：</span><span class="valueStyle ellipsis" :title="originalInfos.receiveAddr">{{originalInfos.receiveAddr}}</span></div>
        <div class="line-child"><span class="titleText">客服备注：</span><span class="valueStyle ellipsis" :title="originalInfos.serviceMsg">{{originalInfos.serviceMsg}}</span></div>
        <!--<div class="line-child"><span class="titleText">明细汇总：</span><span class="valueStyle ellipsis" :title="originalInfos.payTime">{{originalInfos.payTime}}</span></div>-->
        <div class="line-child"><span class="titleText">完成时间：</span><span class="valueStyle">{{originalInfos.completeTime}}</span></div>
        <div class="line-child"><span class="titleText">发货时间：</span><span class="valueStyle">{{originalInfos.platsendTime}}</span></div>
        <div class="line-child"><span class="titleText">下单时间：</span><span class="valueStyle">{{originalInfos.createTime}}</span></div>
      </div>
      <div class="formatLine">
        <div class="line-child"><span class="titleText">付款时间：</span><span class="valueStyle">{{originalInfos.payTime}}</span></div>
        <div class="line-child"></div>
        <div class="line-child"></div>
        <div class="line-child"></div>
        <div class="line-child"></div>
      </div>
    </div>
    <div>
      <el-table class="col-border" :data="tableData" max-height="380" border style="width: 100%;margin-top: 15px;">
        <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
        <el-table-column prop="sourceOrderNo" align="center" label="平台单号" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
        <el-table-column prop="skuPlatname" align="center" label="网店品名" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
        <el-table-column prop="goodsBarcode" align="center" label="条形码" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
        <el-table-column v-if="false" prop="operateRemark" align="center" label="商品编码" :show-overflow-tooltip="hidden">
        </el-table-column>
        <el-table-column prop="skuPlatspec" align="center" label="网店规格" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
        <el-table-column prop="goodsQuantity" align="center" label="购买数量" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
        <el-table-column prop="outrefundStatus" align="center" label="退款状态" :show-overflow-tooltip="hidden" width="">
          <template slot-scope="scope">
            <span>{{scope.row.outrefundStatusOnline}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="transactionPrice" align="center" label="单价" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
        <el-table-column prop="orderfeeDiscounts" align="center" label="优惠抵扣金额" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
        <el-table-column prop="dazePrice" align="center" label="打折金额" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
        <el-table-column prop="unitPrice" align="center" label="报价" :show-overflow-tooltip="hidden" width="">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { zeroFill,positiveIntegerValidator,priceValidator,gridOptions,turnTimestamp,phoneEncrypt } from '@/assets/js/validate.js';
  export default {
    name: "OriginalDetail",
    components: {

    },
    data() {
      return {
        originalInfos:{

        },
        version:'1.0.0',
        tableData:[],
        hidden:true,
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
        //退款状态列表
        refundStatusObj: {
          "1": "未退款",
          "2": "退款中",
          "3": "已退款"
        },
      }
    },
    methods: {
      backOrderFn(){
        this.$router.push({path:'/originalOrder'});
      }
    },
    mounted() {
      this._post("com.edb01.erp.oms.service.api.OrderVsfBaseListService/" + this.version + "/getOrderVsfItemList",{
        orderVsfId:this.$route.query.orderVsfId
      }).then((response)=>{
        this.$store.commit('setLoading',false)
        if (response.data.success) {
          this.originalInfos = response.data.result?response.data.result:{};
          if (this.originalInfos.platsendTime) this.originalInfos.platsendTime = turnTimestamp(this.originalInfos.platsendTime);//发货时间
          if (this.originalInfos.completeTime) this.originalInfos.completeTime = turnTimestamp(this.originalInfos.completeTime);//完成时间
          if (this.originalInfos.payTime) this.originalInfos.payTime = turnTimestamp(this.originalInfos.payTime);//下单时间
          if (this.originalInfos.createTime) this.originalInfos.createTime = turnTimestamp(this.originalInfos.createTime);//付款时间
          this.tableData = response.data.result && response.data.result.vsfItems?response.data.result.vsfItems:[];
        } else {
          this.$message({
            message: response.data.msg,
            type: "warning"
          });
        }
      })
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .formatLine {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    margin-left: 5px;
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
  .titleText {
    margin-left: 10px;
    font-weight: 500;
    display: inline-block;
    margin-top: 20px;
  }
  .ellipsis{
    width:142px;
    display:inline-block;
    margin-bottom:-5px;
  }
  .line-child {
    flex:1;
  }
</style>

