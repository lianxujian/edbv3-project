<!--售后详情 佩玖-->
<template>
  <div id="AftetSlateDetails">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click.native="backOne">售后单查询</el-breadcrumb-item>
        <el-breadcrumb-item>售后单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="width: 100%;height: 20px;line-height: 20px;margin: 20px;border-left:4px solid #1871F0">
      <strong style="font-size:1.2em;margin-left: 10px">售后信息</strong>
    </div>
    <div style="width: 96%;height: auto;float: right">
      <div v-if="asTypes == 1">
        <div>
          <el-row :gutter="24" class="lable-span">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>售后类型：</span>
                <span>{{asType}}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple" style="white-space: nowrap">
                <span>退换补状态：</span>
                {{returnGoodsStatus}}
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple" style="white-space: nowrap">
                <span>退款状态：</span>
                <span>{{refundStatus}}</span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content bg-purple" style="white-space: nowrap">
                <span>售后单号：</span>
                {{afterSalesNo}}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="lable-span">

            <el-col :span="6">
              <div class="grid-content bg-purple" style="white-space: nowrap">
                <span>平台单号：</span>
                <span v-if="replaceSourceOrderNo"> {{replaceSourceOrderNo}}</span>
                <span v-else> {{sourceOrderNo}}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple" style="white-space: nowrap">
                <span>额外退款流水号：</span>
                <span>{{otherRefundFlowNo}}</span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>拒绝退货凭证：</span>
                <el-popover
                  placement="top-start"
                  v-show="refuseReturnVoucher != undefined "
                  title="拒绝退货凭证："
                  min-width="1200"
                  min-height="1050"
                  trigger="hover">
                  <img :src="refuseReturnVoucher" width="100%" height="100%"/>
                  <img slot="reference" :src="refuseReturnVoucher" width="50" height="20">
                </el-popover>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple" style="white-space: nowrap">
                <span>线上状态：</span>
                <span>{{onlineStatus}}</span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="24" class="lable-span">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>拒绝退款原因：</span>
                <span>{{refuseRefundReason}}</span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>退换补原因：</span>
                <span>{{returnGoodsName}}</span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>退换补描述：</span>
                <span>{{returnMsg}}</span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>订单编号：</span>
                <span>{{salesOrderNos}}</span>
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="24" class="lable-span">

            <el-col :span="6">
              <div class="grid-content bg-purple" style="white-space: nowrap">
                <span>退款总金额：</span>
                {{totalRefundAmt}}
                <span v-if="refundStatus=='未退款'"> <el-tooltip class="item" effect="dark"
                                                              content="退款总金额为申请退款金额，额外退款金额的合计" placement="bottom-start">
                  <i class="el-icon-info"></i>
                </el-tooltip></span>
                <span v-else-if="refundStatus=='退款成功'">  <el-tooltip class="item" effect="dark"
                                                                     content="退款总金额为实际退款金额，额外退款金额的合计"
                                                                     placement="bottom-start">
                  <i class="el-icon-info"></i>
                </el-tooltip></span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple" style="white-space: nowrap">
                <span>额外退款金额：</span>
                <span>{{otherRefundAmt}}</span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>额外退款原因：</span>
                <span>{{otherRefundReasonName}}</span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content bg-purple" style="white-space: nowrap">
                <span>单据来源：</span>
                <span>{{sourceOrderType}}</span>
              </div>
            </el-col>
          </el-row>

          <!--<el-row :gutter="24">-->
          <!--<el-col>-->
          <!--<div class="grid-content bg-purple">-->
          <!--<span>额外退款说明：</span>-->
          <!--<span>{{otherRefundMsg}}</span>-->
          <!--</div>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <el-row :gutter="24" class="lable-span">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>退回仓：</span>
                <span>{{storageName}}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>退回快递：</span>
                <span>{{expressCoName}}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <span>退回快递单号：</span>
                <span>{{returnExpressNos}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="lable-span">
            <el-col :span="24">
              <div class="grid-content">
                <label for="explain" style="position: absolute;top: 0px">售后备注：</label>
                <el-input
                  maxlength="200"
                  type="textarea"
                  :disabled="true"
                  :rows="4"
                  style="width:93%;margin-left: 60px"
                  v-model="afterMsg"
                >
                </el-input>
              </div>
            </el-col>
          </el-row>
          <!--自定义属性-->
          <el-row :gutter="24" v-show="attributeBeanList" class="lable-span">
            <label for="explain" style="position: absolute;top: 0px;left:12px">售后属性：</label>
            <el-col :span="6" v-for="(item,i) in attributeBeanList" :key="i">
              <div class="grid-content bg-purple" style="margin-left: 60px">
                <span>{{ item.attributeName }}：</span>
                <span v-show="item.attributeType == 1">{{item.attributeValue}}</span>
                <span v-show="item.attributeType == 2">{{item.attributeValue}}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <span class="button-span" :class="{ span1: isActive1 }"
                @click="isActive1=true;isActive2=false;isShow=50">商品明细</span>
          <span class="button-span" style="margin-left: -4px!important;" :class="{ span1: isActive2 }"
                @click="isActive1=false;isActive2=true;isShow=500"
                v-if="tableDataes != undefined && tableDataes.length>0">入库明细</span>
        </div>
        <!--商品明细-->
        <div v-show="isShow==50">
          <el-table :data="tableDataGood" border max-height="150" style="width: 100%">
            <el-table-column
              align="center"
              type="index"
              label="序号">
            </el-table-column>

            <el-table-column label="商品" min-width="150" align="left" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <!--<img :src="scope.row.goodsImage" alt="" style="width: 30px;height: 30px">-->
                <el-popover
                  placement="top-start"
                  title="商品图片预览："
                  v-if="scope.row.goodsImage"
                  width="520"
                  height="520"
                  trigger="hover">
                  <img :src="scope.row.goodsImage" width="100%" height="100%"/>
                  <img slot="reference" :src="scope.row.goodsImage"
                       style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">
                </el-popover>
                <span v-if="scope.row.fromItemId">(套单)</span>
                <span v-if="scope.row.suitFlag">[套]</span>
                <span v-if="scope.row.giftFlag">[赠]</span>
                <span v-html="scope.row.goodsName"></span>
                <span v-if="scope.row.originalBarCode">({{scope.row.originalBarCode}}换)</span>
              </template>
            </el-table-column>

            <el-table-column label="条形码" min-width="100" align="center" prop="goodsBarCode"
                             :show-overflow-tooltip="true">
            </el-table-column>

            <el-table-column label="规格" min-width="100" align="center" prop="goodsSpec" :show-overflow-tooltip="true">
            </el-table-column>

            <el-table-column label="订货数量" min-width="100" align="center" prop="goodsQty">
            </el-table-column>

            <el-table-column label="成交单价" min-width="100" align="center" prop="dealPrice">
            </el-table-column>

            <el-table-column label="成交金额" min-width="100" align="center" prop="turnoverAmt">
            </el-table-column>

            <el-table-column label="申请退货数量" min-width="100" align="center" prop="applyReturnQty">
            </el-table-column>

            <el-table-column align="center" prop="factRefundAmt" label="实际退款金额" min-width="100">
            </el-table-column>

            <el-table-column label="实际退货数量" min-width="100" align="center" prop="realReturnQty">
            </el-table-column>

            <el-table-column label="申请退款金额" min-width="100" align="center" prop="applyRefundAmt">
            </el-table-column>
            <el-table-column label="批次号" min-width="100" align="center" prop="batchNo">
            </el-table-column>
          </el-table>
        </div>
        <!--入库明细-->
        <div v-show="isShow==500">
          <el-table :data="tableDataes" border style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="45"
              type="index"
              align="center">
            </el-table-column>

            <el-table-column label="商品" align='left' min-width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <!--<img :src="scope.row.goodsImage" alt=""-->
                <!--style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">-->
                <el-popover
                  placement="top-start"
                  title="商品图片预览："
                  v-if="scope.row.goodsImage"
                  width="520"
                  height="520"
                  trigger="hover">
                  <img :src="scope.row.goodsImage" width="100%" height="100%"/>
                  <img slot="reference" :src="scope.row.goodsImage"
                       style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">
                </el-popover>
                <span v-if="scope.row.fromItemId">(套单)</span>
                <span v-if="scope.row.suitFlag">[套]</span>
                <span v-if="scope.row.giftFlag">[赠]</span>
                <span>{{scope.row.goodsName}}</span>
                <span v-if="scope.row.originalBarCode">({{scope.row.originalBarCode}}换)</span>
              </template>
            </el-table-column>

            <el-table-column label="条形码" prop="barCode" align='center' min-width="100">
            </el-table-column>

            <el-table-column label="商品编号" prop="goodsCode" align='center' min-width="100">
            </el-table-column>

            <el-table-column label="规格" prop="goodsSpec" align='center' min-width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="商品属性" min-width="100" align='center'>
              <template slot-scope="scope">
                <span v-show="scope.row.goodsAttrType==1">正品</span>
                <span v-show="scope.row.goodsAttrType==2">次品</span>
              </template>
            </el-table-column>
            <el-table-column label="入库数量" align='center' min-width="100" prop="goodsQty">
            </el-table-column>
            <el-table-column label="实际入库数量" align='center' min-width="100" prop="actualInQty">
            </el-table-column>
            <el-table-column label="批次号" align='center' min-width="100" prop="batchNo">
            </el-table-column>

          </el-table>
        </div>
      </div>
      <div v-else>
        <el-row :gutter="24" class="lable-span">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <span>售后类型：</span>
              <span>{{asType}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple" style="white-space: nowrap">
              <span>售后单号：</span>
              {{afterSalesNo}}
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple" style="white-space: nowrap">
              <span>外部售后单号：</span>
              <span>{{outAfterSalesNo}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple" style="white-space: nowrap">
              <span>平台单号：</span>
              <span v-if="replaceSourceOrderNo"> {{replaceSourceOrderNo}}</span>
              <span v-else> {{sourceOrderNo}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <span>单据来源：</span>
              <span>{{sourceOrderType}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple" style="white-space: nowrap">
              <span>线上状态：</span>
              <span>{{onlineStatus}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="lable-span">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <span>退换补状态：</span>
              <span>{{returnGoodsStatus}}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple" style="white-space: nowrap">
              <span>退换补原因：</span>
              <span>{{returnGoodsName}}</span>
            </div>
          </el-col>
          <el-col :span="4" v-show="returnGoodsStatus == '拒绝退货'">
            <div class="grid-content bg-purple" style="white-space: nowrap">
              <span>拒绝退款原因：</span>
              <span>{{refuseRefundReason}}</span>
            </div>
          </el-col>
          <el-col :span="4" v-show="returnGoodsStatus == '拒绝退货'">
            <div class="grid-content bg-purple">
              <span>拒绝退货凭证：</span>
              <el-popover
                placement="top-start"
                v-show="refuseReturnVoucher!= undefined"
                title="拒绝退货凭证："
                min-width="1200"
                min-height="1050"
                trigger="hover">
                <img :src="refuseReturnVoucher" width="100%" height="100%"/>
                <img slot="reference" :src="refuseReturnVoucher" width="50" height="20">
              </el-popover>
            </div>
          </el-col>

          <el-col :span="4" v-show="returnGoodsStatus == '拒绝换货'">
            <div class="grid-content bg-purple" style="white-space: nowrap">
              <span>拒绝换货原因：</span>
              <span>{{refuseReplaceReason}}</span>
            </div>
          </el-col>
          <el-col :span="4" v-show="returnGoodsStatus == '拒绝换货'">
            <div class="grid-content bg-purple">
              <span>拒绝换货凭证：</span>
              <el-popover
                placement="top-start"
                title="拒绝换货凭证："
                v-show="refuseReplaceVoucher!= undefined"
                min-width="1200"
                min-height="1050"
                trigger="hover">
                <img :src="refuseReplaceVoucher" width="100%" height="100%"/>
                <img slot="reference" :src="refuseReplaceVoucher" width="50" height="20">
              </el-popover>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="lable-span">
          <el-col :span="24">
            <div class="grid-content bg-purple" style="height:auto;word-wrap: break-word;"
                 v-show="asType == '补发'||asType == '换货'">
              <span>退换补描述：</span>
              <span>{{returnMsg}}</span>
            </div>
          </el-col>

          <el-col :span="24" v-show="returnGoodsStatus == '拒绝换货'">
            <div class="grid-content bg-purple" style="height:auto;word-wrap: break-word;">
              <span>拒绝换货备注：</span>
              <span>{{refuseReplaceMsg }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="lable-span">
          <el-col :span="6" v-show="asType == '补发'">
            <div class="grid-content bg-purple" style="white-space: nowrap">
              <span>补发订单号：</span>
              <span>{{orderNo}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple" v-show="asType == '补发'">
              <span>寄出快递：</span>
              <span>{{replaceEexpressCoName}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple" v-show="asType == '补发'" style="white-space: nowrap">
              <span>寄出快递单号：</span>
              <span>{{replaceExpressNos}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="lable-span">
          <el-col :span="6" v-show="asType == '换货'">
            <div class="grid-content bg-purple">
              <span>退回仓：</span>
              <span>{{storageName}}</span>
            </div>
          </el-col>
          <el-col :span="6" v-show="asType == '换货'">
            <div class="grid-content bg-purple">
              <span>退回快递：</span>
              <span>{{expressCoName}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple" v-show="asType == '换货'">
              <span>退回快递单号：</span>
              <span>{{returnExpressNos}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="lable-span">
          <el-col :span="6" v-show="asType == '换货'">
            <div class="grid-content bg-purple" style="white-space: nowrap">
              <span>换货订单号：</span>
              <span>{{orderNo }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple" v-show="asType == '换货'">
              <span>寄出快递：</span>
              <span>{{replaceEexpressCoName}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple" v-show="asType == '换货'" style="white-space: nowrap">
              <span>寄出快递单号：</span>
              <span>{{replaceExpressNos }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="lable-span">
          <el-col :span="24" class="lable-span">
            <div class="grid-content">
              <label for="explain" style="position: absolute;top: 0px">售后备注：</label>
              <el-input
                maxlength="200"
                :disabled="true"
                type="textarea"
                :rows="4"
                style="width:96%;margin-left: 60px"
                v-model="afterMsg"
              >
              </el-input>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="lable-span">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <span>客服备注：</span>
              <span>{{serviceMsg}}</span>
            </div>
          </el-col>
        </el-row>
        <!--自定义属性-->
        <el-row :gutter="24" v-show="attributeBeanList" class="lable-span">
          <label for="explain" style="position: absolute;top: 0px;left:12px">售后属性：</label>
          <el-col :span="6" v-for="(item,i) in attributeBeanList" :key="i">
            <div class="grid-content bg-purple" style="margin-left: 60px">
              <span>{{ item.attributeName }}：</span>
              <span v-show="item.attributeType == 1">{{item.attributeValue}}</span>
              <span v-show="item.attributeType == 2">{{item.attributeValue}}</span>
            </div>
          </el-col>
        </el-row>
        <!--收货地址-->
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="grid-content bg-purple" style="height:auto;word-wrap: break-word;"
                 v-show="asType == '补发'||asType == '换货'">
              <span>收货地址：</span>
              <span>{{shipAddres }}</span>
              <span class="label-span">收货人：</span>
              <span>{{receiver}} {{mobile}} {{phone}}</span>
            </div>
          </el-col>
        </el-row>
        <div style="clear: both"></div>
        <!--数据明细-->
        <div>
          <div v-if="asTypes == 4">
         <span class="button-span" :class="{ span1: isActive1 }"
               @click="isActive1=true;isActive2=false;isShow=50">&nbsp;补发明细</span>
          </div>
          <div v-else-if="asTypes == 2">
        <span class="button-span" :class="{ span1: isActive1 }"
              @click="isActive1=true;isActive2=false;isShow=50">&nbsp;商品明细</span>
            <span class="button-span" style="margin-left: -4px!important;" :class="{ span1: isActive2 }"
                  @click="isActive1=false;isActive2=true;isActive3=false;isShow=500"
                  v-if="tableDataes != undefined && tableDataes.length>0">入库明细</span>
          </div>
          <div v-else>
              <span class="button-span" :class="{ span1: isActive1 }"
                    @click="isActive1=true;isActive2=false;isActive3=false;isShow=50">换货明细</span>
              <span class="button-span" style="margin-left: -4px!important;" :class="{ span1: isActive2 }"
                    @click="isActive1=false;isActive2=true;isActive3=false;isShow=500"
                    v-if="tableDataes != undefined && tableDataes.length>0">入库明细</span>
              <span class="button-span" style="margin-left: -4px!important;" :class="{ span1: isActive3 }"
                    @click="isActive1=false;isActive2=false;isActive3=true;isShow=600">换出明细</span>

          </div>

          <!--补发明细-->
          <div v-show="isShow==50">
            <el-table :data="tableDatarepl" border max-height="800px" style="width: 100%">
              <el-table-column
                align="center"
                type="index"
                label="序号">
              </el-table-column>

              <el-table-column label="商品" min-width="150" align="left" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <!--<img :src="scope.row.goodsImage" alt=""-->
                  <!--style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">-->
                  <el-popover
                    placement="top-start"
                    title="商品图片预览："
                    v-if="scope.row.goodsImage"
                    width="520"
                    height="520"
                    trigger="hover">
                    <img :src="scope.row.goodsImage" width="100%" height="100%"/>
                    <img slot="reference" :src="scope.row.goodsImage"
                         style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">
                  </el-popover>
                  <span v-if="scope.row.fromItemId">(套单)</span>
                  <span v-if="scope.row.suitFlag">[套]</span>
                  <span v-if="scope.row.giftFlag">[赠]</span>
                  <span>{{scope.row.goodsName}}</span>
                  <span v-if="scope.row.originalBarCode">({{scope.row.originalBarCode}}换)</span>
                </template>
              </el-table-column>

              <el-table-column label="条形码" min-width="100" align="center" prop="goodsBarCode"
                               :show-overflow-tooltip="true">
              </el-table-column>

              <el-table-column label="成交单价" min-width="100" align="center" prop="dealPrice" v-if="asType != '补发'">
              </el-table-column>

              <el-table-column label="成交金额" min-width="100" align="center" prop="turnoverAmt" v-if="asType != '补发'">
              </el-table-column>

              <el-table-column label="规格" min-width="100" align="center" prop="goodsSpec" :show-overflow-tooltip="true">
              </el-table-column>

              <el-table-column label="售价" min-width="100" align="center" prop="salesPrice" v-if="asType == '补发'">
              </el-table-column>

              <el-table-column label="申请补发数量" min-width="100" align="center" prop="goodsQty" v-if="asType == '补发'">
              </el-table-column>

              <el-table-column label="订货数量" min-width="100" align="center" prop="goodsQty" v-if="asType != '补发'">
              </el-table-column>

              <el-table-column label="申请退货数量" min-width="100" align="center" prop="applyReturnQty"
                               v-if="asType != '补发'">
              </el-table-column>

              <el-table-column label="实际退货数量" min-width="100" align="center" prop="realReturnQty" v-if="asType != '补发'">
              </el-table-column>

              <el-table-column label="实际退款金额" min-width="100" align="center" prop="factRefundAmt"
                               v-if="asType == '仅退款'">
              </el-table-column>

              <el-table-column label="申请退款金额" min-width="100" align="center" prop="applyRefundAmt"
                               v-if="asType == '仅退款'">
              </el-table-column>

              <el-table-column label="批次号" min-width="100" align="center" prop="batchNo" v-if="asType == '仅退款'">
              </el-table-column>

            </el-table>
          </div>
          <!--入库明细-->
          <div v-show="isShow==500">
            <el-table :data="tableDataes" border style="width: 100%"
            >
              <el-table-column
                label="序号"
                width="45"
                type="index"
                align="center">
              </el-table-column>

              <el-table-column label="商品" align='left' min-width="150" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <!--<img :src="scope.row.goodsImage" alt=""-->
                  <!--style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">-->
                  <el-popover
                    placement="top-start"
                    title="商品图片预览："
                    v-if="scope.row.goodsImage"
                    width="520"
                    height="520"
                    trigger="hover">
                    <img :src="scope.row.goodsImage" width="100%" height="100%"/>
                    <img slot="reference" :src="scope.row.goodsImage"
                         style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">
                  </el-popover>
                  <span v-if="scope.row.fromItemId">(套单)</span>
                  <span v-if="scope.row.suitFlag">[套]</span>
                  <span v-if="scope.row.giftFlag">[赠]</span>
                  <span>{{scope.row.goodsName}}</span>
                  <span v-if="scope.row.originalBarCode">({{scope.row.originalBarCode}}换)</span>
                </template>
              </el-table-column>

              <el-table-column label="条形码" prop="barCode" align='center' min-width="100">
              </el-table-column>

              <el-table-column label="商品编号" prop="goodsCode" align='center' min-width="100">
              </el-table-column>

              <el-table-column label="规格" prop="goodsSpec" align='center' min-width="100" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column label="商品属性" min-width="100" align='center'>
                <template slot-scope="scope">
                  <span v-show="scope.row.goodsAttrType==1">正品</span>
                  <span v-show="scope.row.goodsAttrType==2">次品</span>
                </template>
              </el-table-column>
              <el-table-column label="入库数量" align='center' min-width="100" prop="goodsQty">
              </el-table-column>
              <el-table-column label="实际入库数量" align='center' min-width="100" prop="actualInQty">
              </el-table-column>
              <el-table-column label="批次号" align='center' min-width="100" prop="batchNo">
              </el-table-column>

            </el-table>
          </div>
          <!--换出明细 -->
          <div v-show="isShow==600">
            <el-table :data="tableDataGood" border max-height="800px" style="width: 100%">
              <el-table-column
                align="center"
                type="index"
                label="序号">
              </el-table-column>

              <el-table-column label="商品" min-width="150" align='left' :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <!-- <img :src="scope.row.goodsImage" alt=""
                        style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">-->
                  <el-popover
                    placement="top-start"
                    title="商品图片预览："
                    v-if="scope.row.goodsImage"
                    width="520"
                    height="520"
                    trigger="hover">
                    <img :src="scope.row.goodsImage" width="100%" height="100%"/>
                    <img slot="reference" :src="scope.row.goodsImage"
                         style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">
                  </el-popover>
                  <span v-if="scope.row.fromItemId">(套单)</span>
                  <span v-if="scope.row.suitFlag">[套]</span>
                  <span v-if="scope.row.giftFlag">[赠]</span>
                  <span v-html="scope.row.goodsName"></span>
                  <span v-if="scope.row.originalBarCode">({{scope.row.originalBarCode}}换)</span>
                </template>
              </el-table-column>

              <el-table-column label="条形码" min-width="100" align="center" prop="goodsBarCode"
                               :show-overflow-tooltip="true">
              </el-table-column>

              <!--<el-table-column label="商品名称" min-width="100" align="center" prop="goodsName">-->
              <!--</el-table-column>-->

              <el-table-column label="规格" min-width="100" align="center" prop="goodsSpec" :show-overflow-tooltip="true">
              </el-table-column>

              <el-table-column label="售价" min-width="100" align="center" prop="salesPrice">
              </el-table-column>

              <el-table-column label="换出商品数量" min-width="100" align="center" prop="goodsQty">
              </el-table-column>


            </el-table>
          </div>

        </div>


      </div>

      <div style="margin:20px 0 10px 0;">操作记录：</div>
      <public-Log2 :paramObj="paramObj"></public-Log2>
    </div>
  </div>
</template>
<script>
  import PublicLog2 from '@/components/common/PublicLog2.vue';

  export default {
    components: {
      PublicLog2
    },
    props: ['orderId', 'asTypes'],  //接收父级传参
    data() {
      return {
        paramObj: { //日志参数
          moduleId: 57,
          billCode: this.orderId,
          typeId: ''
        },
        receiver: '',
        mobile: '',
        phone: '',
        version: '1.0.0',
        isActive1: true, //默认商品明细按钮
        isActive2: false, //
        isActive3: false,
        isShow: 50,  //默认商品明细
        state: [],   //自定义属性
        asType: '', //售后类型
        afterSalesNo: '',//售后单号
        outAfterSalesNo: '',//外部售后单号
        sourceOrderNo: '', //平台单号
        replaceSourceOrderNo: '',
        sourceOrderType: '',//单据来源
        onlineStatus: '',//线上状态
        returnGoodsStatus: '',//退货状态
        returnGoodsReason: '', //退货原因
        returnMsg: '',//退换货原因描述
        refundStatus: '',//退款状态
        totalRefundAmt: '', //退款总金额
        otherRefundAmt: '',//额外退款金额
        otherRefundFlowNo: '',
        refuseReplaceReason: '',//拒绝换货原因
        shipAddres: '',//收货地址
        otherRefundMsg: '',//额外退款说明
        afterSalesNo: '',//新单订单号集合换货，补发 订单号
        salesOrderNos: '',//发货单号与快递单号映射快递单
        orderNo: '',//订单号
        orderType: '',//原始售后类型
        refuseRefundReason: '',//拒绝退款原因
        otherRefundReasonName: '', //额外退款原因
        otherReturnFlowNo: '',//额外退款流水号
        storageName: '',//退回仓库名字
        expressCoName: '',  //退回快递公司名字
        returnExpressNos: '',//退回快递单号集合，逗号隔开
        afterMsg: '',  //售后备注
        serviceMsg: '',//客服备注
        refuseReplaceVoucher: undefined, //拒绝换货凭证
        refuseReturnVoucher: undefined,//拒绝退货凭证
        returnGoodsName: '',//拒绝退货原因
        tableDataGood: [],//商品明细列表
        tableDatarepl: [],//换货明细
        tableDataes: [],//入库明细
        attributeBeanList: '',//自定义属性
        refuseReplaceMsg: '',//拒绝换货备注
        orderNoExpressNoJson: '',//寄出快递单号
        replaceEexpressCoName: '',//寄出快递
        replaceExpressNos: '',//寄出快递单号
      }
    },
    created() {
      this.initMemberes() //回显数据
    },

    methods: {
      // 返回售后处理页面
      backOne() {
        this.$emit('changeShow', {childrenShow: 3});

      },
      //初始话会员数据
      initMemberes() {
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getAfterSaleDetail', {afterSalesNo: this.orderId}).then(function (res) {
          if (res.data.success) {
            if (res.data.result.asType == 1) {  //售后类型
              this.asType = "退货退款"
            } else if (res.data.result.asType == 2) {
              this.asType = "仅退款"
            } else if (res.data.result.asType == 3) {
              this.asType = "换货"
            } else if (res.data.result.asType == 4) {
              this.asType = "补发"
            }

            if (res.data.result.sourceOrderType == 1) {  //单据来源
              this.sourceOrderType = "线上售后单"
            } else if (res.data.result.sourceOrderType == 2) {
              this.sourceOrderType = "手工下单"
            }

            if (res.data.result.onlineStatus == 1) {  //线上状态
              this.onlineStatus = "买家已申请退款，等待卖家同意"
            } else if (res.data.result.onlineStatus == 2) {
              this.onlineStatus = "卖家同意退款，等待买家退货"
            } else if (res.data.result.onlineStatus == 3) {
              this.onlineStatus = "买家已退货，等待卖家确认收货"
            } else if (res.data.result.onlineStatus == 4) {
              this.onlineStatus = "卖家拒绝退款"
            } else if (res.data.result.onlineStatus == 5) {
              this.onlineStatus = "退款成功"
            } else if (res.data.result.onlineStatus == 6) {
              this.onlineStatus = "退款关闭"
            }

            if (res.data.result.returnGoodsStatus == 1) {  //退货状态
              this.returnGoodsStatus = "未退货"
            } else if (res.data.result.returnGoodsStatus == 2) {
              this.returnGoodsStatus = "同意退货"
            } else if (res.data.result.returnGoodsStatus == 3) {
              this.returnGoodsStatus = "部分收货"
            } else if (res.data.result.returnGoodsStatus == 4) {
              this.returnGoodsStatus = "全部收货"
            } else if (res.data.result.returnGoodsStatus == 5) {
              this.returnGoodsStatus = "拒绝退货"
            } else if (res.data.result.returnGoodsStatus == 6) {
              this.returnGoodsStatus = "未换货"
            } else if (res.data.result.returnGoodsStatus == 7) {
              this.returnGoodsStatus = "同意换货"
            } else if (res.data.result.returnGoodsStatus == 8) {
              this.returnGoodsStatus = "拒绝换货"
            } else if (res.data.result.returnGoodsStatus == 9) {
              this.returnGoodsStatus = "取消换货"
            } else if (res.data.result.returnGoodsStatus == 10) {
              this.returnGoodsStatus = "未补发"
            } else if (res.data.result.returnGoodsStatus == 11) {
              this.returnGoodsStatus = "同意补发"
            }

            if (res.data.result.refundStatus == 1) {  //退款状态
              this.refundStatus = "未退款"
            } else if (res.data.result.refundStatus == 2) {
              this.refundStatus = "拒绝退款"
            } else if (res.data.result.refundStatus == 3) {
              this.refundStatus = "退款成功"
            } else if (res.data.result.refundStatus == 4) {
              this.refundStatus = "取消退款"
            }
            this.shipAddres = res.data.result.consigneeContry + res.data.result.consigneeProvince + res.data.result.consigneeCity + res.data.result.consigneeArea
              + res.data.result.consigneeTown + res.data.result.shippingAddress
            this.otherReturnFlowNo = res.data.result.otherReturnFlowNo//额外退款流水号
            this.otherRefundMsg = res.data.result.otherRefundMsg//额外退款说明
            this.refuseRefundReason = res.data.result.refuseRefundReason//拒绝退款原因
            this.attributeBeanList = res.data.result.attributeBeanList; //自定义属性
            this.afterSalesNo = res.data.result.afterSalesNo //售后单号
            this.outAfterSalesNo = res.data.result.outAfterSalesNo //外部售后单号
            this.sourceOrderNo = res.data.result.sourceOrderNo //平台单号
            this.replaceSourceOrderNo = res.data.result.replaceSourceOrderNo;
            this.returnGoodsReason = res.data.result.returnGoodsReason //退货原因
            this.totalRefundAmt = res.data.result.totalRefundAmt //退款总金额
            this.otherRefundAmt = res.data.result.otherRefundAmt //额外退款总金额
            this.otherRefundReasonName = res.data.result.otherRefundReasonName //额外退款原因
            this.otherRefundFlowNo = res.data.result.otherRefundFlowNo //额外退款交易流水号
            this.storageName = res.data.result.storageName //退回仓
            this.expressCoName = res.data.result.expressCoName  //退回快递公司名字
            this.returnExpressNos = res.data.result.returnExpressNos  //退回快递编号
            this.refuseReturnVoucher = res.data.result.refuseReturnVoucher  //拒绝退货凭证
            this.returnGoodsName = res.data.result.returnGoodsName    //拒绝退货原因
            this.afterMsg = res.data.result.afterMsg  //售后备注
            this.serviceMsg = res.data.result.serviceMsg  //客服备注
            this.returnMsg = res.data.result.returnMsg   //退换货原因描述
            this.tableDatarepl = res.data.result.itemBeanList //换货明细
            this.tableDataGood = res.data.result.replaceItemBeanList //换货明细
            this.tableDataes = res.data.result.inStorageItemBeanList //入库明细
            this.afterSalesNo = res.data.result.afterSalesNo //新单订单号集合换货，补发 订单号
            this.salesOrderNos = res.data.result.salesOrderNos//发货单号与快递单号映射快递单
            this.orderNo = res.data.result.orderNo;//订单号
            this.refuseReplaceVoucher = res.data.result.refuseReplaceVoucher//拒绝换货凭证
            this.refuseReplaceMsg = res.data.result.refuseReplaceMsg//拒绝换货备注
            this.replaceEexpressCoName = res.data.result.replaceEexpressCoName//寄出快递
            this.replaceExpressNos = res.data.result.replaceExpressNos//
            this.orderType = res.data.result.orderType//原始售后类型
            this.receiver = res.data.result.receiver
            this.mobile = res.data.result.mobile
            this.phone = res.data.result.phone
            this.refuseReplaceReason = res.data.result.refuseReplaceReason
            if (this.asType == "补发") {
              this.tableDatarepl = res.data.result.replaceItemBeanList //换货明细
            } else if (this.asType == "退货退款") {
              this.tableDataGood = res.data.result.itemBeanList //换货明细

            }
          }

        }.bind(this));


      },


    }
  }
</script>
<style scoped>
  .pTop {
    margin-bottom: 20px;

  }

  .pDown {
    width: 750px;
    height: auto;
    margin-bottom: 50px;
  }

  .button-span {
    display: inline-block;
    width: 76px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #979797;
    padding: 0 9px;
    cursor: pointer;
    color: #A4A4A4;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .span1 {
    display: inline-block;
    border: 1px solid #87B6F7;
    cursor: pointer;
    color: #87B6F7;
  }

  #AftetSlateDetails .lable-span {
    margin-bottom: 8px;

  }

</style>
<style>

</style>
