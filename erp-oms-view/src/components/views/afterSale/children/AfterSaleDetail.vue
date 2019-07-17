<!--售后单详情  贾南风-->   <!--refuseReplaceMsg  拒绝换货备注-->
<template>
  <div id="afterSaleDetail">
    <div>
      <el-breadcrumb separator=">"  style="margin-bottom: 10px">
        <el-breadcrumb-item @click.native="backOne">售后单处理</el-breadcrumb-item>
        <el-breadcrumb-item>售后单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="title"><span>售后信息</span></div>
    <div style="padding-left: 10px">
      <div>
        <el-row :gutter="2">
          <el-col :span="3">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">售后类型：</span>
                <span v-if="tableData.asType == 1">退货退款</span>
                <span v-if="tableData.asType == 2">仅退款</span>
                <span v-if="tableData.asType == 3">换货</span>
                <span v-if="tableData.asType == 4">补发</span>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <span class="label-span">售后单号：</span><span >{{tableData.afterSalesNo}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span" style="width: 100px">外部售后单号：</span><span v-if="tableData.outAfterSalesNo">{{tableData.outAfterSalesNo}}</span>
                <span v-else>-</span>
              </div>
            </div>
          </el-col>
          <!--<span class="label-span">平台单号：</span><span  :title="tableData.sourceOrderNo">{{tableData.sourceOrderNo}}</span><!--class="widthDot"-->
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">平台单号：</span>
                <span v-cloak v-if="tableData.replaceSourceOrderNo">{{tableData.replaceSourceOrderNo}}</span>
                <span v-cloak v-else>{{tableData.sourceOrderNo}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">单据来源：</span><span v-if="tableData.sourceOrderType == 1">线上下载</span><span v-else>手工下单</span>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <span class="label-span">线上状态：</span>
                <span class="line-span" v-if="tableData.onlineStatus == 1" title="买家已申请退款，等待卖家同意">买家已申请退款，等待卖家同意</span>
                <span class="line-span" v-if="tableData.onlineStatus == 2" title="卖家同意退款，等待买家退货">卖家同意退款，等待买家退货</span>
                <span class="line-span" v-if="tableData.onlineStatus == 3" title="买家已退货，等待卖家确认收货">买家已退货，等待卖家确认收货</span>
                <span class="line-span" v-if="tableData.onlineStatus == 4">卖家拒绝退款</span>
                <span class="line-span" v-if="tableData.onlineStatus == 5">退款成功</span>
                <span class="line-span" v-if="tableData.onlineStatus == 6">退款关闭</span>
                <span class="line-span" v-if="tableData.onlineStatus == 11">换货待处理</span>
                <span class="line-span" v-if="tableData.onlineStatus == 12">待买家退货</span>
                <span class="line-span" v-if="tableData.onlineStatus == 13">买家已退货，待收货</span>
                <span class="line-span" v-if="tableData.onlineStatus == 14">换货关闭</span>
                <span class="line-span" v-if="tableData.onlineStatus == 15">换货成功</span>
                <span class="line-span" v-if="tableData.onlineStatus == 16">待买家修改</span>
                <span class="line-span" v-if="tableData.onlineStatus == 17">待发出换货商品</span>
                <span class="line-span" v-if="tableData.onlineStatus == 18">待买家收货</span>
                <span class="line-span" v-if="tableData.onlineStatus == 19">请退款</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="3">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">退换补状态：</span>
                <span v-if="tableData.returnGoodsStatus == 1">未退货</span>
                <span v-else-if="tableData.returnGoodsStatus == 2">同意退货</span>
                <span v-else-if="tableData.returnGoodsStatus == 3">部分收货</span>
                <span v-else-if="tableData.returnGoodsStatus == 4">全部收货</span>
                <span v-else-if="tableData.returnGoodsStatus == 5">拒绝退货</span>
                <span v-else-if="tableData.returnGoodsStatus == 6">未换货</span>
                <span v-else-if="tableData.returnGoodsStatus == 7">同意换货</span>
                <span v-else-if="tableData.returnGoodsStatus == 8">拒绝换货</span>
                <span v-else-if="tableData.returnGoodsStatus == 9">取消换货</span>
                <span v-else-if="tableData.returnGoodsStatus == 10">未补发</span>
                <span v-else-if="tableData.returnGoodsStatus == 11">同意补发</span>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <span class="label-span">退换补原因：</span><span>{{tableData.returnGoodsName}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="7" v-if="tableData.refundStatus == 2 || tableData.returnGoodsStatus == 8" >
            <div class="grid-content bg-purple-light">
              <div class="box-detail">

                <!--尘音修改dom结构-->
                <span class="label-span" v-if="tableData.returnGoodsStatus == 8">拒绝换货原因：<span>{{tableData.refuseReplaceReason}}</span></span>
                <span class="label-span" v-if="tableData.refundStatus == 2">拒绝退款原因：</span><span class="overflow" :title="tableData.refuseRefundReason" v-if="tableData.refundStatus == 2">{{tableData.refuseRefundReason}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6" v-if="tableData.refuseReturnVoucher || tableData.returnGoodsStatus == 8">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <div v-if="tableData.returnGoodsStatus == 8" :class="{imgClass: tableData.refuseReplaceVoucher}">
                  <span class="label-span" >拒绝换货凭证：</span>

                  <!--尘音修改拒绝换货图片字段refuseReplaceVoucher-->
                  <img v-if="tableData.refuseReplaceVoucher" :src="tableData.refuseReplaceVoucher"  style="width: 40px;height: 40px;align-items: center" @mouseenter="showImg(tableData.refuseReplaceVoucher)"/>
                </div>

                <!--尘音修改点击方法传参-->
                <div v-if="tableData.refuseReturnVoucher" :class="{imgClass: tableData.refuseReplaceVoucher}">
                  <span class="label-span" >拒绝退货凭证：</span>
                  <img v-if="tableData.refuseReturnVoucher" :src="tableData.refuseReturnVoucher" style="width: 40px;height: 40px;align-items: center" @mouseenter="showImg(tableData.refuseReturnVoucher)"/>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="2" v-if="tableData.refundStatus == 3">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">退款状态：</span>
                <span v-if="tableData.refundStatus == 1">未退款</span>
                <span v-else-if="tableData.refundStatus == 2">拒绝退款</span><span v-else-if="tableData.refundStatus == 3">退款成功</span>
                <span v-else-if="tableData.refundStatus == 4">取消退款</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="2" v-if="tableData.asType==1 || tableData.asType == 2 || tableData.asType == 3">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">退款总金额：</span><span>{{tableData.totalRefundAmt}}</span>
                <el-tooltip v-if="isReality" class="item" effect="dark" content="退款总金额为申请退款金额、额外退款金额的合计"placement="right">
                  <i style="font-size: 14px;color:#FF8E4F" class="el-icon-warning" />
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" content="退款总金额为实际退款金额、额外退款金额的合计"placement="right">
                  <i style="font-size: 14px;color:#FF8E4F" class="el-icon-warning" />
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">额外退款金额：</span><span>{{tableData.otherRefundAmt}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">额外退款原因：</span><span class="overflow" :title="tableData.otherRefundReasonName">{{tableData.otherRefundReasonName}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span" style="width: 135px">额外退款流水号：</span><span class="overflow" :title="tableData.otherRefundFlowNo">{{tableData.otherRefundFlowNo}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span" >退换补描述：</span><span class="overflow" :title="tableData.returnMsg">{{tableData.returnMsg}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="2" v-if="tableData.asType == 4">
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">补发订单号：</span><span  :title="tableData.orderNo">{{tableData.orderNo}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">寄出快递：</span><span class="overflow">{{tableData.replaceEexpressCoName}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">寄出快递单号：</span><span class="overflow">{{tableData.replaceExpressNos}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="2" v-if="tableData.asType == 4">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span" >退换补描述：</span><span class="overflow" :title="tableData.returnMsg">{{tableData.returnMsg}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="2" v-if="tableData.asType != 4">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">退回仓：</span><span class="overflow" :title="tableData.storageName">{{tableData.storageName}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">退回快递：</span><span class="overflow">{{tableData.expressCoName}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">退回快递单号：</span><span class="overflow">{{tableData.returnExpressNos}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4" v-if="tableData.asType == 3 && (tableData.returnGoodsStatus == 3 || tableData.returnGoodsStatus == 4 || tableData.returnGoodsStatus == 7)">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">换货订单号：</span><span class="overflow" :title="tableData.orderNo">{{tableData.orderNo}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4" v-if="tableData.asType == 3 && (tableData.returnGoodsStatus == 3 || tableData.returnGoodsStatus == 4 || tableData.returnGoodsStatus == 7)">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">寄出快递：</span><span class="overflow" :title="tableData.replaceEexpressCoName">{{tableData.replaceEexpressCoName}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4" v-if="tableData.asType == 3 && (tableData.returnGoodsStatus == 3 || tableData.returnGoodsStatus == 4 || tableData.returnGoodsStatus == 7)">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">寄出快递单号：</span><span class="overflow" :title="tableData.replaceExpressNos">{{tableData.replaceExpressNos}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">售后备注：</span><span class="overflow1" :title="tableData.afterMsg">{{tableData.afterMsg}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <!--拒绝换货备注-->
        <el-row :gutter="2">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">客服备注：</span><span class="overflow" :title="tableData.serviceMsg">{{tableData.serviceMsg}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="2" v-if="tableData.refuseReplaceMsg">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">拒绝换货备注：</span><span class="overflow" :title="tableData.refuseReplaceMsg">{{tableData.refuseReplaceMsg}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="test.length != 0">
          <el-col :span="24">
            <div class="label-span" >售后属性：</div><!--style="padding-left: 24px"-->
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="spanCol" v-for="(item,index) in test" :key="index">
              <div class="grid-content bg-purple" style="position: relative">
                <div style="white-space: nowrap">
                  <span v-if="item.attributeType != 3" style="width: 140px;text-align: right;display: inline-block">{{item.attributeName}}</span>
                  <el-select disabled v-if="item.attributeType == 1" v-model="item.attributeValue" placeholder="请选择"
                             style="width: 180px!important;">
                    <el-option
                      v-for="(item1,index) in item.attributeValues"
                      :key="index"
                      :label="item1"
                      :value="item1">
                    </el-option>
                  </el-select>
                  <el-input disabled v-if="item.attributeType == 2" style="width: 180px!important;"
                            v-model="item.attributeValue"></el-input>
                </div>
              </div>
            </el-col>
        </el-row >
          <el-row  v-if="item.attributeType == 3" v-for="(item,index) in test" :key="index">
            <el-col :span="21">
              <div class="grid-content bg-purple">
                <div style="white-space: nowrap">
                  <span class="label-span"
                        style="width: 140px;text-align: right;display: inline-block;vertical-align: top">{{item.attributeName}}</span>
                  <el-input disabled type="textarea" v-model="item.attributeValue"></el-input>
                </div>
              </div>
            </el-col>
          </el-row>
        <el-row  v-if="tableData.asType == 3 || tableData.asType == 4">
          <el-col :span="21">
            <div class="grid-content bg-purple">
              <span class="label-span">收货地址：</span>
              <span>{{tableData.consigneeProvince}} {{tableData.consigneeCity}} {{tableData.consigneeArea}} {{tableData.consigneeTown}} {{tableData.shippingAddress}}</span>

              <span class="label-span">收货人：</span>
              <span>{{tableData.receiver}}  {{tableData.mobile}} {{tableData.phone}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--补发-->
    <div v-if="tableData.asType == 4">
      <div>
        <span class="shop-detail">补发明细</span>
      </div>
      <div style="margin:10px 0  25px 6px"  ><!--border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;-->
        <el-table
          :data="tableData.replaceItemBeanList"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="商品"
            min-width="150"
          >
            <template slot-scope="scope">
              <div :class="{suitO: scope.row.openSuit}">
                <img :src="scope.row.goodsImage"
                     style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                <span v-if="scope.row.fromItemId">(套单)</span>
                <span v-if="scope.row.suitFlag">[套]</span>
                <span v-if="scope.row.giftFlag">[赠]</span>
                <span :class="{hands: scope.row.suitFlag}"
                      @click="addSuit(scope.row,scope.$index)">{{scope.row.goodsName}}</span>
                <span v-if="scope.row.originalBarCode">({{scope.row.originalBarCode}}换)</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsBarCode"
            label="条形码"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="salesPrice"
            label="售价">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsSpec"
            label="规格">
          </el-table-column>
          <!--<el-table-column
            align="center"
            prop="goodsQty"
            label="订货数量">
          </el-table-column>-->
          <el-table-column
            align="center"
            prop="goodsQty"
            label="申请补发数量">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--换货-->
    <div v-if="tableData.asType == 3">
      <div v-if="tableData.asType == 3 && isBarter == 1">
        <span class="shop-detail" @click="cutPage(1)">换货明细</span>
        <span class="shop-detail2" @click="cutPage(2)"  style="border-left: 1px solid #3B8EE5;" >入库明细</span>
        <span class="shop-detail2"   @click="cutPage(3)" style="border-left: none" >换出明细</span>
      </div>
      <div v-if="tableData.asType == 3 && isBarter == 2">
        <span class="shop-detail2" @click="cutPage(1)">换货明细</span>
        <span class="shop-detail" @click="cutPage(2)"  style="border-left: 1px solid #3B8EE5;" >入库明细</span>
        <span class="shop-detail2"  @click="cutPage(3)" style="border-left: none">换出明细</span>
      </div>

      <div v-if="tableData.asType == 3 && isBarter == 3">
        <span class="shop-detail2" @click="cutPage(1)">换货明细</span>
        <span class="shop-detail2" @click="cutPage(2)"   >入库明细</span>
        <span class="shop-detail"  @click="cutPage(3)" >换出明细</span>
      </div>

      <div style="margin:10px 0  25px 6px" id="shop-detail1" v-if="isBarter == 1"><!--border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;-->
        <el-table
          :data="tableData.itemBeanList"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="商品"
            min-width="150"
          >
            <template slot-scope="scope">
              <div :class="{suitO: scope.row.openSuit}">
                <img :src="scope.row.goodsImage"
                     style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                <span v-if="scope.row.fromItemId">(套单)</span>
                <span v-if="scope.row.suitFlag">[套]</span>
                <span v-if="scope.row.giftFlag">[赠]</span>
                <span :class="{hands: scope.row.suitFlag}"
                      @click="addSuit(scope.row,scope.$index)">{{scope.row.goodsName}}</span>
                <span v-if="scope.row.originalBarCode">({{scope.row.originalBarCode}}换)</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsBarCode"
            label="条形码"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsSpec"
            label="规格">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsQty"
            label="订货数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="applyReturnQty"
            label="申请退换补数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="realReturnQty"
            label="实际退货数量">
          </el-table-column>
        </el-table>
      </div>

      <div style="margin:10px 0  25px 6px;border-bottom: 1px solid #EBEEF5" v-show="isBarter == 2"><!--border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;-->
        <el-table
          :data="tableData.inStorageItemBeanList"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            label="商品图片"
            width="70"
          >
            <template slot-scope="scope">
              <div :class="{suitO: scope.row.openSuit}">
                <img :src="scope.row.goodsImageUrl"
                     style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
              </div>
            </template>
          </el-table-column><!--<span :class="{hands: scope.row.suitFlag}"@click="addSuit(scope.row,scope.$index)">{{scope.row.goodsName}}</span>-->
          <el-table-column
            align="center"
            prop="barCode"
            label="条形码"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsCode"
            label="商品编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsName"
            label="商品名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsSpec"
            label="规格">
          </el-table-column>
          <el-table-column
            align="center"
            label="商品属性">
            <template slot-scope="scope">
              <span v-if="scope.row.goodsAttrType == 1">正品</span>
              <span v-if="scope.row.goodsAttrType == 2">次品</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsQty"
            label="入库数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="actualInQty"
            label="实际入库数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="生产日期">
            <template slot-scope="scope">
              <span v-if="scope.row.batchEnabledFlag">{{scope.row.produceTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="批次号">
            <template slot-scope="scope">
              <span v-if="scope.row.batchEnabledFlag">{{scope.row.batchNo}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="保质期">
            <template slot-scope="scope">
              <span v-if="scope.row.batchEnabledFlag">{{scope.row.expTimeEcho}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="margin:10px 0  25px 6px" id="shop-detail3" v-if="isBarter == 3"><!--border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;-->
        <el-table
          :data="tableData.replaceItemBeanList"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="商品"
            min-width="150"
          >
            <template slot-scope="scope">
              <div :class="{suitO: scope.row.openSuit}">
                <img :src="scope.row.goodsImage"
                     style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                <span v-if="scope.row.fromItemId">(套单)</span>
                <span v-if="scope.row.suitFlag">[套]</span>
                <span v-if="scope.row.giftFlag">[赠]</span>
                <span :class="{hands: scope.row.suitFlag}"
                      @click="addSuit(scope.row,scope.$index)">{{scope.row.goodsName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsBarCode"
            label="条形码"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsSpec"
            label="规格">
          </el-table-column>
          <el-table-column
            align="center"
            prop="salesPrice"
            label="售价">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsQty"
            label="换出商品数量">
          </el-table-column>
        </el-table>
      </div>

    </div>
    <!--退货退款  仅退款-->
    <div v-if="tableData.asType == 1 || tableData.asType == 2">
      <div v-if="!isShop && (tableData.asType == 1 || tableData.asType == 2)">
      <span class="shop-detail" >商品明细</span>
      <span class="shop-detail2"  style="border-left: 1px solid #3B8EE5;" @click="isShop=true">入库明细</span>
      </div>
      <div v-if="isShop && (tableData.asType == 1 || tableData.asType == 2)">
        <span class="shop-detail2" style="border-right: 1px solid #3B8EE5;" @click="isShop=false">商品明细</span>
        <span class="shop-detail">入库明细</span>
      </div>
      <div style="margin:10px 0  25px 6px" id="shop-detail" v-show="!isShop"><!--border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;-->
        <el-table
          :data="tableData.itemBeanList"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="商品"
            min-width="150"
          >
            <template slot-scope="scope">
              <div :class="{suitO: scope.row.openSuit}">
                <img :src="scope.row.goodsImage"
                     style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                <span v-if="scope.row.fromItemId">(套单)</span>
                <span v-if="scope.row.suitFlag">[套]</span>
                <span v-if="scope.row.giftFlag">[赠]</span>
                <span :class="{hands: scope.row.suitFlag}"
                      @click="addSuit(scope.row,scope.$index)">{{scope.row.goodsName}}</span>
                <span v-if="scope.row.originalBarCode">({{scope.row.originalBarCode}}换)</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsBarCode"
            label="条形码"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsSpec"
            label="规格">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsQty"
            label="订货数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="realReturnQty"
            label="实际退货数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="factRefundAmt"
            label="实际退款金额">
          </el-table-column>
          <el-table-column
            align="center"
            prop="dealPrice"
            label="成交单价">
          </el-table-column>
          <el-table-column
            align="center"
            prop="applyReturnQty"
            label="申请换补数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="applyRefundAmt"
            label="申请退款金额">
          </el-table-column>
          <el-table-column
            align="center"
            prop="batchNo"
            label="批次号">
          </el-table-column>
        </el-table>
      </div>
      <div style="margin:10px 0  25px 6px;border-bottom: 1px solid #EBEEF5" v-show="isShop"><!--border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;-->
        <el-table
          :data="tableData.inStorageItemBeanList"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            label="商品图片"
            width="70"
          >
            <template slot-scope="scope">
              <div :class="{suitO: scope.row.openSuit}">
                <img :src="scope.row.goodsImageUrl"
                     style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
              </div>
            </template>
          </el-table-column><!--<span :class="{hands: scope.row.suitFlag}"@click="addSuit(scope.row,scope.$index)">{{scope.row.goodsName}}</span>-->
          <el-table-column
            align="center"
            prop="barCode"
            label="条形码"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsCode"
            label="商品编号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsName"
            label="商品名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsSpec"
            label="规格">
          </el-table-column>
          <el-table-column
            align="center"
            label="商品属性">
            <template slot-scope="scope">
              <span v-if="scope.row.goodsAttrType == 1">正品</span>
              <span v-if="scope.row.goodsAttrType == 2">次品</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsQty"
            label="入库数量">
          </el-table-column>
          <el-table-column
            align="center"
            prop="actualInQty"
            label="实际入库数量">
          </el-table-column>
          <el-table-column
            align="center"
            label="生产日期">
            <template slot-scope="scope">
              <span v-if="scope.row.batchEnabledFlag">{{scope.row.produceTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="批次号">
            <template slot-scope="scope">
              <span v-if="scope.row.batchEnabledFlag">{{scope.row.batchNo}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="保质期">
            <template slot-scope="scope">
              <span v-if="scope.row.batchEnabledFlag">{{scope.row.expTimeEcho}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="title1"><span>操作日志</span></div>
    <el-dialog v-dialogDrag
      :close-on-click-modal="false"
      title="查看大图"
      :visible.sync="innerVisible"
      style="text-align: center">
      <div style="width: 100%;height: 100%;padding:0!important;">
        <!--尘音修改图片传参-->
        <img :src="imgSrc" style="width: 100%;height: 100%">
      </div>
    </el-dialog>
    <div style="border-bottom: 1px solid #EBEEF5">
      <public-Log2 :paramObj="paramObj"></public-Log2>
    </div>
  </div>
</template>
<script>
  import { turnTimestamp } from '@/assets/js/validate'
  import PublicLog2 from '@/components/common/PublicLog2.vue';
  export default {
    components:{
      PublicLog2
    },
    props: ['orderId'],
    data() {
      return {
        // 日志
        paramObj:{
          moduleId:57,
          billCode:this.orderId,
          typeId:''
        },
        isReality: true,// 是否显示实际退款金额
        version: '1.0.0', // 版本号
        switchover: false, // 商品明细和入库明细切换
        isShop: false, // 退货退款  仅退款
        isBarter: 1, // 换货
        tableData: [], // 详情数据
        test: [], // 自定义属性
        spanCol: 6,// 显示占格数
        innerVisible: false, // 大图显示/隐藏
        imgSrc: ''//拒绝凭证图片（尘音新加字段）

      }
    },
    methods:{
      // 点击切换
      cutPage(num) {
        this.isBarter = num;
      },
      // 点击套装显示 退货退款 仅退款
      addSuit(row,index) {
        console.log(row,'ok');
        return
        if(index+1 < this.afterSaleBaseBean.itemBeanList.length){ // 判断当前套装是否展开，如果展开则关闭
          if(this.afterSaleBaseBean.itemBeanList[index+1].openSuit){
            this.afterSaleBaseBean.itemBeanList.splice(index+1,row.suitDetailBeanList.length);
            return;
          }
        }

        // 如果当前有套装就展开
        if(row.suitDetailBeanList){
          row.suitDetailBeanList.forEach((item,i) => {
            item.openSuit = true;
            this.afterSaleBaseBean.itemBeanList.splice(index+i+1, 0, item);
          })
        }
        if (this.shopSuit.itemBeanList[index].applyReturnQty && this.shopSuit.itemBeanList[index].fromItemId) { //当前行为套单并且填写申请退货数量
          for (var j = index; j >= 0; j--) {       //向上找如果遇到事套装就置灰它
            if (this.shopSuit.itemBeanList[j].suitFlag) {
              this.shopSuit.itemBeanList[j].Disable2 = true;
              return
            }
          }
        }else if(!this.shopSuit.itemBeanList[index].applyReturnQty && this.shopSuit.itemBeanList[index].fromItemId) {
          for (var n = index; n >= 0; n--) {
            if (this.shopSuit.itemBeanList[n].suitFlag) {
              this.shopSuit.itemBeanList[n].Disable2 = false;
              return
            }
          }
        }else  if (this.shopSuit.itemBeanList[index].applyReturnQty && this.shopSuit.itemBeanList[index].suitFlag) { //当前为套装并且填写申请可退数量
          for (var j=index ; j<this.shopSuit.itemBeanList.length; j++) { //只能向下找到一个套单然后置灰它， 如果它下面还有套单解决的办法是。在列表中套单向上判断是否置灰
            //如果上面的置灰了就把自己也置灰
            if (this.shopSuit.itemBeanList[j].fromItemId) {
              this.shopSuit.itemBeanList[j].Disable = true;
              return
            }
          }
        }else if(!this.shopSuit.itemBeanList[index].applyReturnQty && this.shopSuit.itemBeanList[index].suitFlag){
          for (var j=index ; j<this.shopSuit.itemBeanList.length; j++) {
            if (this.shopSuit.itemBeanList[j].fromItemId) {
              this.shopSuit.itemBeanList[j].Disable = false;
              return
            }
          }

        }

      },
      //鼠标滑过显示大图（尘音修改）
      showImg(bool){
//        if(!this.tableData.refuseReturnVoucher){
//          return
//        }
        this.imgSrc = bool;
        this.innerVisible = true;
      },
      // 返回售后处理页面
      backOne() {
        this.$emit('changeShow',{childrenShow: 19});
      },
    },

    created() {
      this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getAfterSaleDetail',{afterSalesNo: this.orderId})
        .then(res => {
            if(res.data.success){
//                  res.data.result.defineBizBeanList.forEach( item => {
//                    item.attributeValue = '';
//                    if(item.enabledFlag && item.attributeType === 1 && item.attributeValues){ // 每个自定义属性下的下拉字符串转成数组
//                      item.attributeValues = item.attributeValues.split(',');
//                    }
//                    if(item.enabledFlag){ // 过滤自定义属性当前开启的
//                      res.data.result.attributeBeanList.forEach(it => {
//                        if(item.attributeId == it.attributeId){ //  用户之前存的值开没开启，或者存不存在，如果存在赋值
//                          if(item.attributeType == 1  && item.attributeValues){ // 属性值被删除
//                            if(item.attributeValues.indexOf(it.attributeValue)== -1){
//                              item.attributeValue = '';
//                            }else{
//                              item.attributeValue = it.attributeValue;
//                            }
//                          }else if(item.attributeType == 1 && it.attributeType == 2){ // 下拉框变单行文本
//                            item.attributeValue = '';
//                          }else if(item.attributeType == 2 && it.attributeType == 1){// 单行文本变下拉框
//                            item.attributeValue = '';
//                          }else{
//                            item.attributeValue  = it.attributeValue;
//                          }
//                        }
//                      })
//                    }
//                  });
              res.data.result.itemBeanList.forEach(item => {
                if(item.factRefundAmt || item.factRefundAmt == 0){
                  this.isReality = false;
                }
              });
                   if(res.data.result.attributeBeanList){
                     this.test = res.data.result.attributeBeanList;
                   }

                  //console.log(response.data.result);
              /*  });*/
              res.data.result.inStorageItemBeanList.forEach( item => {
                if(item.produceTime){
                  item.produceTime = turnTimestamp(item.produceTime);
                }
              });
                this.tableData = res.data.result;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
        })
    },
    mounted() {
      if(document.body.clientWidth < 1580){
        this.spanCol = 8;
      }else{
        this.spanCol = 6;
      }
      // 监听自定义属性布局，小于1550显示3个，大于1920显示4个
      window.onresize = () =>{
        if(document.body.offsetWidth < 1550){
          this.spanCol = 8;
        }else{
          this.spanCol = 6;
        }
      }
    }
  }
</script>
<style scoped>
  #afterSaleDetail{
    font-size: 12px;
  }
  .imgClass{
    margin: -8px 0 -8px 0
  }
  .line-span{
    display: inline-block;
    vertical-align: bottom;
    width: 150px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap

  }
  .widthDot{
    vertical-align: bottom;
    display: inline-block;
    width: 110px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  #afterSaleDetail .grid-content .overflow{
    display: inline-block;
    width: 90px;
    height: 20px;
    line-height: 30px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  #afterSaleDetail .grid-content .overflow1{
    display: inline-block;
    width: 900px;
    height: 20px;
    line-height: 30px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  #afterSaleDetail .shop-detail{
    display: inline-block;
    height: 25px;
    width: 60px;
    line-height: 25px;
    text-align: center;
    border: 1px solid #3B8EE5;
    color: #409EFF;
    margin:0 -11px 0 7px;
    cursor: pointer;
  }
#afterSaleDetail .shop-detail2{
  display: inline-block;
  height: 25px;
  width: 60px;
  line-height: 25px;
  color: #A3A3A3;
  text-align: center;
  border: 1px solid #C2CBD2;
  margin:0 -11px 0 7px;
  cursor: pointer;
}
  #afterSaleDetail .title{
    font-weight: bold;
    border-left: 4px solid #409EFF;
    padding-left: 12px;
    margin: 30px 0;
    padding-top: 3px;
  }
  #afterSaleDetail .title1{
    font-weight: bold;
    border-left: 4px solid #409EFF;
    padding-left: 12px;
    margin: 10px 0;
    padding-top: 3px;
  }
  #afterSaleDetail .title span{
    font-size: 16px;
  }
  #afterSaleDetail .title1 span{
    font-size: 16px;
  }
  #afterSaleDetail .label-span{
    display: inline-block;
    width: 95px;
    text-align: right;
    font-size: 12px;
    color: #4A4A4A;
    margin-right: 5px;
  }
  #afterSaleDetail .box-detail{
    white-space: nowrap;
  }

</style>
