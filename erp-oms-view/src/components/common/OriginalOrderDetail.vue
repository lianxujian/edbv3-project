<!--促销中心弹框-->
<template>
  <div>
    <!--商品详细信息-->
    <div id="goodsInfo" v-loading="loading" element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading">
      <div>
        <div class="formatLine">
          <div class="line-child" style="width:220px;"><span class="titleText">平台单号：</span><span
            class="valueStyle ellipsis" :title="listBean.sourceOrderNo" style="width:135px;">{{listBean.sourceOrderNo}}</span>
          </div>
          <div class="line-child">
            <span class="titleText">平台订单状态：</span>
            <span class="valueStyle ellipsis" style="width:90px;" :title="listBean.ecOrderStatusName">{{listBean.ecOrderStatusName}}</span>
          </div>
          <div class="line-child"><span class="titleText">旗帜：</span>
            <span class="valueStyle" v-if="listBean.flagId">
                      <span v-for="(value,key) in listBean.flagId.split(',')"><i
                        class="icon iconfont icon-ai246" :style="{color:flagColorList[value]}"></i>
                      </span>
            </span>
          </div>
          <div class="line-child"><span class="titleText">买家留言：</span>
            <span class="valueStyle ellipsis" :title="listBean.customerMsg">{{listBean.customerMsg}}</span>
          </div>
          <div class="line-child"><span class="titleText">客服备注：</span><span class="valueStyle ellipsis" :title="listBean.serviceMsg">{{listBean.serviceMsg}}</span>
          </div>
        </div>
        <el-table class="col-border" :data="goodsList" border
                  style="width: 100%;margin-bottom: 15px;">
          <el-table-column prop="goodsName" align="center" width="250" label="商品信息">
            <template slot-scope="scope">
              <div style="float:left;width:80px;line-height:100px;">
                <img style="width:80%;height:auto;" v-if="scope.row && scope.row.imageUrl" :src="scope.row.imageUrl"
                     alt="">
              </div>
              <div v-if="scope.row"
                   style="text-align:left;display: flex;padding:5px;min-height: 85px;flex-direction: column;justify-content: center;">
                <p style="line-height:20px;">
                  <span v-if="scope.row.presellFlag" style="color:green;">【预】</span>
                  <span v-if="scope.row.giftFlag" style="color:#FD00FF;">【赠】<span v-if="scope.row.strategyNo">【{{scope.row.strategyNo}}】</span></span>
                  <span v-if="scope.row.refundFlag" style="color:red;">【退】</span>
                  <span v-if="scope.row.suitFlag" style="color:#0000FF;">【套】</span>
                  <span v-if="!scope.row.giftFlag">{{scope.row.skuPlatname}}</span><!--网店品名-->
                </p>
                <p style="line-height:20px;">{{scope.row.goodsBarcode}}</p>
                <p style="line-height:20px;">{{scope.row.skuPlatspec}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" align="center" label="软件品名">
          </el-table-column>
          <el-table-column prop="goodsQty" label="数量" align="center">
            <template slot-scope="scope">
                    <span v-if="scope.row">
                      <div>
                        <div style="display:inline-block;">{{scope.row.goodsQuantity}}</div>
                        <div v-if="scope.row.lackQty" style="display:inline-block;color:red;">（缺）</div><!--{{scope.row.lackQty}}-->
                       <!-- <div v-if="scope.row.suitSingleLackFlag" style="display:inline-block;color:red;">（缺）</div>&lt;!&ndash;单品&ndash;&gt;-->
                      </div>
                    </span>
            </template>
          </el-table-column>
          <el-table-column prop="salesPrice" align="center" label="单价">
          </el-table-column>
          <el-table-column prop="transactionPrice" align="center" label="成交价格">
          </el-table-column>
          <el-table-column prop="orderfeeDiscounts" align="center" label="优惠抵扣金额">
          </el-table-column>
          <el-table-column prop="turnoverAmount" align="center" label="成交金额">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      sourceOrderNo: String,
    },
    data() {
      return {
        loading: false,
        goodsList: [],
        listBean:{},
        ecOrderStatusObj:{
          1:'未付款',
          2:'已付款',
          3:'货到付款',
          4:'已发货',
          5:'待退货',
          6:'已退货',
          7:'待退款',
          8:'已退款',
          9:'已关闭',
          10:'已完成',
        },//平台订单状态
        //旗帜颜色列表
        flagColorList: {
          "0": "#999",
          "1": "#cd3930",
          "2": "#edcf4c",
          "3": "#72c95d",
          "4": "#3d9bfe",
          "5": "#822aea"
        },
        version: '1.0.0',
        authorityCode: sessionStorage.getItem('authorityCode') ? JSON.parse(sessionStorage.getItem('authorityCode')) : {},
      }
    },
    methods: {
      //获取商品详情
      initRenderDetail(item) {
        this.loading = true;
        this._post("com.edb01.erp.oms.service.api.PromotionCenterService/" + this.version + "/getSourceOrderDetails", {
          sourceOrderNO: this.sourceOrderNo
        }).then((response) => {
          this.loading = false;
          if (response.data.success) {
            if(response.data.result[0]){
              this.listBean = {
                sourceOrderNo:response.data.result[0].sourceOrderNo,
                customerMsg:response.data.result[0].customerMsg,
                serviceMsg:response.data.result[0].serviceMsg,
                ecOrderStatusName:response.data.result[0].platorderStatus?ecOrderStatusObj[response.data.result[0].platorderStatus]:'',
                flagId:response.data.result[0].flagcolor,
              }
            }
            this.goodsList = response.data.result;
          } else {
            this.$message({
              message: response.data.msg ? response.data.msg : '接口异常',
              type: "warning"
            });
          }
        })
      }
    },
    mounted() {
      this.initRenderDetail();
    }
  }
</script>

<style scoped>
  .formatLine {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    margin-left: 5px;
    margin-bottom:5px;
  }

  .line-child {
   /* flex: 1;*/
  }

  .titleText {
    margin-left: 10px;
    font-weight: 500;
    display: inline-block;
    float: left;
    margin-top: 2px;
  }

  .valueStyle {
    margin-right: 15px;
    line-height: 20px;
  }

  .ellipsis {
    width: 115px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
