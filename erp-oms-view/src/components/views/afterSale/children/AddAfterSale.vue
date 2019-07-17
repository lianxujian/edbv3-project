<!--添加售后单 贾南风3-->
<template>
  <div id="addAfterSale">
    <div>
      <el-breadcrumb separator=">" style="margin-bottom: 10px">
        <el-breadcrumb-item @click.native="backOne">售后处理</el-breadcrumb-item>
        <el-breadcrumb-item>售后单添加</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="title"><span>售后信息</span></div>
    <div style="padding-left: 10px">
      <div>
        <el-row :gutter="15">
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">售后类型</span>
                <el-radio :disabled="sendStatus==1 || obj.orderType == 3 || obj.orderType == 4 || typeChand || typeChand2"
                          v-model="afterSaleBaseBean.asType" :label="1" @change="changeTable">退货退款
                </el-radio>
                <el-radio :disabled="obj.orderType == 3 || obj.orderType == 4" v-model="afterSaleBaseBean.asType"
                          :label="2" @change="changeTable">仅退款
                </el-radio>
                <el-radio :disabled="sendStatus==1 || obj.orderType == 4 || typeChand" v-model="afterSaleBaseBean.asType" :label="3"
                          @change="changeTable">换货
                </el-radio>
                <el-radio :disabled="sendStatus==1 || obj.orderType == 3 && obj.orderType != 4 || typeChand3" v-model="afterSaleBaseBean.asType"
                          :label="4" @change="changeTable">补发
                </el-radio>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <span class="label-span">平台单号：</span>
                <span v-if="afterSaleBaseBean.replaceSourceOrderNo"> {{afterSaleBaseBean.replaceSourceOrderNo}}</span>
                <span v-else> {{afterSaleBaseBean.sourceOrderNo}}</span>
                <!--<span>{{platNum}}</span>-->
                <!--<span class="label-span" v-if="afterSaleBaseBean.asType == 1 || afterSaleBaseBean.asType == 2">平台单号：</span><span v-else class="label-span">订单号：</span>
                <span v-if="afterSaleBaseBean.asType == 1 || afterSaleBaseBean.asType == 2">{{platNum}}</span>
                <span v-else>{{obj.salesOrderNo}}</span>-->
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">退换补原因</span>
                <el-select v-model="afterSaleBaseBean.returnGoodsName" placeholder="请选择" @click.native="refreshData(1)">
                  <el-option
                    v-for="(item,index) in list"
                    :key="index"
                    :label="item.returnName"
                    :value="item.returnName">
                  </el-option>
                </el-select>
                <span class="add" @click="problemList(1)">添加</span>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <div style="white-space: nowrap">
                <span class="label-span" style="vertical-align: top">退换补描述</span>
                <el-input
                  v-model="afterSaleBaseBean.returnMsg"
                  type="textarea"
                  style="width: 90%;height: 80px!important;"
                  :maxlength="200"
                  placeholder="最多可输入200字">
                </el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15" v-if="afterSaleBaseBean.asType != 4">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">额外退款金额</span>
                <el-input style="width:100px" :maxlength="8" v-model="afterSaleBaseBean.otherRefundAmt"
                          @keyup.native="realTime" @blur="returnOut()"></el-input>
                <span>元</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <span class="label-span">退款总金额：</span><span>{{afterSaleBaseBean.totalRefundAmt}}元</span>
                <el-tooltip class="item" effect="dark" content="提示文字1" v-show="false" placement="right">
                  <i style="font-size: 18px;" class="el-icon-question"/>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="退款总金额为商品退款金额、额外退款金额的合计" placement="right">
                  <i style="font-size: 14px;color:#FF8E4F" class="el-icon-warning"/>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">额外退款原因</span>
                <el-select v-model="afterSaleBaseBean.otherRefundReasonName" placeholder="请选择"
                           @click.native="refreshData(2)">
                  <el-option
                    v-for="(item,index) in outerList"
                    :key="index"
                    :label="item.otherRefundName"
                    :value="item.otherRefundName">
                  </el-option>
                </el-select>
                <span class="add" @click="problemList(2)">添加</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <span class="label-span">额外退款流水号</span>
                <el-input style="width: 160px" :maxlength="100"
                          v-model="afterSaleBaseBean.otherRefundFlowNo"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15" v-if="afterSaleBaseBean.asType != 4">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <!--<span class="verifyC" v-if="afterSaleBaseBean.asType != 2">*</span>-->
                <span class="label-span">退回快递</span>
                <el-select :disabled="sendStatus==1" v-model="afterSaleBaseBean.expressCoName" filterable
                           placeholder="请选择" style="width: 160px;">
                  <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <!--<span class="verifyC" v-if="afterSaleBaseBean.asType != 2">*</span>-->
              <div class="box-detail">
                <span class="label-span">退回快递单号</span>
                <el-input style="width: 160px" :disabled="sendStatus==1"
                          v-model="afterSaleBaseBean.returnExpressNos"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <div style="white-space: nowrap">
                <span class="label-span" style="vertical-align: top">售后备注</span>
                <el-input
                  v-model="afterSaleBaseBean.afterMsg"
                  type="textarea"
                  style="width: 90%;height: 80px!important;"
                  placeholder="最多可输入1000字"
                  :maxlength="1000"
                >
                </el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <div style="white-space: nowrap">
                <span class="label-span">客服备注：</span>
                <span style="font-size: 14px">{{shopSuit.serviceMsg}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="test.length != 0">
          <el-col :span="24">
            <div style="font-size: 14px;padding-left: 24px">售后属性：</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="spanCol" v-if="item.enabledFlag && item.attributeType != 3 && test.length != 0"
                  v-for="(item,index) in test" :key="index">
            <div class="grid-content bg-purple" style="position: relative">
              <div style="white-space: nowrap">
                <span v-if="item.attributeType != 3"
                      style="width: 140px;font-size: 14px;text-align: right;display: inline-block">{{item.attributeName}}</span>
                <el-select v-if="item.attributeType == 1" clearable v-model="item.attributeValue" placeholder="请选择"
                           style="width: 180px!important;">
                  <el-option
                    v-for="(item1,index) in item.attributeValues"
                    :key="index"
                    :label="item1"
                    :value="item1">
                  </el-option>
                </el-select>
                <el-input v-if="item.attributeType == 2" style="width: 180px!important;"
                          v-model="item.attributeValue"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-for="(item,index) in test" v-if="item.enabledFlag && item.attributeType == 3 && test.length != 0"
                :key="index">
          <el-col :span="21">
            <div class="grid-content bg-purple">
              <div style="white-space: nowrap">
                <span class="label-span"
                      style="width: 140px;font-size: 14px;text-align: right;display: inline-block;vertical-align: top">{{item.attributeName}}</span>
                <el-input type="textarea" v-model="item.attributeValue"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="afterSaleBaseBean.asType == 3 || afterSaleBaseBean.asType == 4">
          <el-col :span="24">
            <div style="margin-bottom: 15px">
              <span class="label-span">收货地址：</span>
              <prov-city-area style="display:inline-block;" @channelArea="channelArea"
                              :proCityAreaValue="proCityAreaValue"
                              :proCityAreaLabel="proCityAreaLabel"></prov-city-area>
              <el-input maxlength="100" v-model="afterSaleBaseBean.shippingAddress" placeholder="请填写详细地址"
                        style="width: 300px;"></el-input>

              <span class="label-span">收货人：</span>
              <el-input maxlength="30" v-model="obj.consignee" placeholder="请填姓名"
                        style="width:150px;"></el-input>
              <el-input maxlength="11" v-model="obj.consigneeMobile" placeholder="请填写手机"
                        style="width: 190px;"></el-input>

              <el-input maxlength="15" v-model="obj.consigneePhone" placeholder="请填写电话"
                        style="width: 190px;"></el-input>

            </div>
          </el-col>
        </el-row>

      </div>
      <!-- 商品明细（退货退款，仅退款）-->
      <div v-show="afterSaleBaseBean.asType == 1 || afterSaleBaseBean.asType == 2">
        <div class="shop-detail">商品明细</div>
        <div style="border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;margin-bottom: 55px"
             id="shop-detail">
          <el-table
            :data="shopSuit.itemBeanList"
            @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="55">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="商品名称"
              min-width="220"
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
              prop="turnoverAmt"
              label="成交金额">
            </el-table-column>
            <el-table-column
              align="center"
              prop="dealPrice"
              label="成交单价">
            </el-table-column>
            <el-table-column
              align="center"
              prop="canReturnQty"
              label="可退数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="canReturnAmt"
              label="可退金额">
            </el-table-column>
            <el-table-column
              align="center"
              min-width="105"
              label="申请退换补数量">
              <template slot-scope="scope">
                <el-input style="width: 80px" :disabled="scope.row.returnQtyFlag || (!scope.row.giftFlag && scope.row.dealPrice == 0 && scope.row.canReturnAmt > 0) ||(scope.row.fromItemId && scope.row.Disable)
                || (scope.row.suitFlag && scope.row.Disable2) ||(!scope.row.suitFlag && !scope.row.giftFlag && !scope.row.fromItemId && !scope.row.originalBarCode && scope.row.dealPrice != 0) && scope.row.canReturnAmt == 0 || scope.row.canReturnQty == 0 ||
                 (scope.row.suitFlag && scope.row.dealPrice != 0 && scope.row.canReturnQty==0) || (scope.row.Disable2 || scope.row.Disable) || (scope.row.giftFlag && scope.row.canReturnQty == 0) || (scope.row.turnoverAmt >0 && (scope.row.canReturnAmt == 0 || scope.row.canReturnQty == 0 ))"
                          v-model="scope.row.applyReturnQty"
                          @keyup.native="scope.row.applyReturnQty=scope.row.applyReturnQty.replace(/[^\d]/g, '');returnNumber(scope.row,scope.$index,'1')"
                          :class="{styleColor:indexReg == scope.$index && classReg == 'applyReturnQty'}"
                          @blur="returnNumber(scope.row,scope.$index)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              min-width="105"
              label="申请退款金额">
              <template slot-scope="scope">
                <el-input style="width: 60px" :disabled="!scope.row.giftFlag && (scope.row.disabled || (!scope.row.canReturnAmt || !scope.row.canReturnQty)) ||
                (scope.row.suitFlag && scope.row.dealPrice != 0 && scope.row.canReturnAmt==0) || (scope.row.dealPrice ==0 && scope.row.canReturnAmt ==0) || (scope.row.Disable2 || scope.row.Disable)"
                          v-model="scope.row.applyRefundAmt"
                          :class="{styleColor:indexReg == scope.$index && classReg == 'applyRefundAmt'}"
                          @blur="oneSuit(scope.row,scope.$index,2)"
                          @keyup.native="scope.row.applyRefundAmt = scope.row.applyRefundAmt.replace(/[^\.\d]/g,'');if(scope.row.canReturnAmt<scope.row.applyRefundAmt)scope.row.applyRefundAmt='';returnNumber(scope.row,scope.$index,'2')"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="batchNo"
              label="批次号">
            </el-table-column>
            <el-table-column
              align="center"
              width="50"
              label="操作">
              <template slot-scope="scope">
                <span style="color:#DA384C;cursor: pointer" v-if="shopSuit.itemBeanList.length != 1"
                      @click="delAll(scope.row,scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--换货商品明细（换货）-->
      <div v-if="afterSaleBaseBean.asType == 3">
        <div>
          <span class="shop-detail1">换货商品明细</span><span class="shop-span" @click="copyShop(1)">复制商品</span>
        </div>
        <div style="border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;margin-bottom: 55px"
             id="shop-detail1">
          <el-table
            :data="shopSuit.itemBeanList"
            @selection-change="handleSelectionChange"
            :span-method="objectSpanMethod"
            @row-dblclick="dbMethods"
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
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="商品"
              min-width="220"
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
                  <!--@click="addSuit(scope.row,scope.$index)"-->
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
              prop="salesPrice"
              label="售价">
            </el-table-column>
            <el-table-column
              align="center"
              width="70"
              prop="canReturnQty"
              label="可换数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="canChangAmtSum"
              label="可换金额">
            </el-table-column>
            <!--this.obj.orderType-->
            <el-table-column
              align="center"
              width="120"
              label="申请退换补数量">
              <template slot-scope="scope">
                <!--<span>{{(!scope.row.suitFlag && !scope.row.giftFlag && !scope.row.fromItemId && !scope.row.originalBarCode && scope.row.dealPrice != 0 &&  scope.row.canReturnAmt == 0)}}</span>-->
                <el-input style="width: 80px" :disabled="scope.row.returnQtyFlag || (!scope.row.giftFlag && scope.row.dealPrice == 0 && scope.row.canReturnAmt > 0) || (scope.row.fromItemId && scope.row.Disable)
                || (scope.row.suitFlag && scope.row.Disable2) || scope.row.canReturnQty == 0 ||
                 (scope.row.suitFlag && scope.row.dealPrice != 0 && scope.row.canReturnQty==0) || (scope.row.Disable2 || scope.row.Disable) || (scope.row.giftFlag && scope.row.canReturnQty == 0)"
                          v-model="scope.row.applyReturnQty"
                          @keyup.native="scope.row.applyReturnQty=scope.row.applyReturnQty.replace(/[^\d]/g, '');returnNumber(scope.row,scope.$index,'1')"
                          :class="{styleColor:indexReg == scope.$index && classReg == 'applyReturnQty'}"
                          @blur="returnNumber(scope.row,scope.$index)"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--换出商品明细（换货）-->
      <div v-if="afterSaleBaseBean.asType == 3">
        <div>
          <span class="shop-detail1">换出商品明细</span><span class="shop-span" @click="clickShop">添加换出明细</span>
        </div>
        <div style="border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;margin-bottom: 55px">
          <el-table
            :data="replaceItemBeans"
            style="width: 100%">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="55">
            </el-table-column>
            <!--:class="{suitO: scope.row.openSuit}"  :class="{hands: scope.row.suitFlag}"-->
            <el-table-column
              :show-overflow-tooltip="true"
              label="商品"
              min-width="220"
            >
              <template slot-scope="scope">
                <div>
                  <img :src="scope.row.goodsImage"
                       style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                  <span v-if="scope.row.fromItemId">(套单)</span>
                  <span v-if="scope.row.suitFlag">[套]</span>
                  <span v-if="scope.row.giftFlag">[赠]</span>
                  <span
                  >{{scope.row.goodsName}}</span><!--@click="addSuit(scope.row,scope.$index)"-->
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
              label="换出商品数量">
              <template slot-scope="scope">
                <el-input style="width: 80px" v-model="scope.row.goodsQty"
                          @keyup.native="numReg(scope.row,scope.$index)"
                          :class="{styleColor:indexReg == scope.$index && classReg == 'goodsQty'}"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="scope">
                <span style="color:#DA384C;cursor: pointer" @click="deleteShoe(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--订单商品明细（补发）-->
      <div v-show="afterSaleBaseBean.asType == 4">
        <div>
          <span class="shop-detail1">订单商品明细</span><span class="shop-span" @click="copyShop(1)">复制商品</span>
        </div>
        <div style="border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;margin-bottom: 55px">
          <el-table
            :data="shopSuit.itemBeanList"
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="商品"
              min-width="220"
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
                  <!--@click="addSuit(scope.row,scope.$index)"-->
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
              prop="salesPrice"
              label="售价">
            </el-table-column>
            <el-table-column
              align="center"
              prop="goodsQty"
              label="订货数量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="applyReissueQty"
              label="已申请补发数量">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--补发商品明细（补发）-->
      <div v-show="afterSaleBaseBean.asType == 4">
        <div>
          <span class="shop-detail1">补发商品明细</span><span class="shop-span" @click="clickShop">添加补发商品</span>
        </div>
        <div style="border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;margin-bottom: 55px">
          <el-table
            :data="replaceItemBeans"
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
              min-width="220"
            >
              <template slot-scope="scope">
                <div>
                  <img :src="scope.row.goodsImage"
                       style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                  <span v-if="scope.row.fromItemId">(套单)</span>
                  <span v-if="scope.row.suitFlag">[套]</span>
                  <span v-if="scope.row.giftFlag">[赠]</span>
                  <span
                  >{{scope.row.goodsName}}</span><!--@click="addSuit(scope.row,scope.$index)"-->
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
              label="申请补发数量">
              <template slot-scope="scope">
                <el-input style="width: 80px" v-model="scope.row.goodsQty"
                          @keyup.native="scope.row.goodsQty = scope.row.goodsQty.replace(/[^\d]/g,'')"
                          :class="{styleColor:indexReg == scope.$index && classReg == 'goodsQty'}"
                          @blur="oneSuit(scope.row,scope.$index,1)"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center">
              <template slot-scope="scope">
                <span style="color:#DA384C;cursor: pointer" @click="deleteShoe(scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--查询商品明细-->
      <div id="pop-up">
        <el-dialog
          title="请选择所查询商品"
          :close-on-click-modal="false"
          :visible.sync="dialogVisibleQuery"
          width="730px"
        >
          <div id="input-box">
            <el-row>
              <el-col :span="18">
                <div class="grid-content bg-purple">
                  <el-input v-model="findShop.goodsCode" @keyup.enter.native="queryShop"
                            style="width: 100px!important;margin-right: 19px" placeholder="商品编号"></el-input>
                  <el-input v-model="findShop.barCode" @keyup.enter.native="queryShop"
                            style="width: 100px!important;margin-right: 19px" placeholder="条形码"></el-input>
                  <el-input v-model="findShop.goodsName" @keyup.enter.native="queryShop"
                            style="width: 100px!important;margin-right: 19px" placeholder="商品名称"></el-input>
                  <el-input v-model="findShop.goodsSpec" @keyup.enter.native="queryShop" style="width: 100px!important;"
                            placeholder="商品规格"></el-input>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple-light" style="float: right">
                  <el-button @click="queryShop" type="primary" style="width: 74px!important;">查询</el-button>
                  <el-button @click="shopReset" style="width: 74px!important;">重置</el-button>
                </div>
              </el-col>
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
                width="220">
                <template slot-scope="scope">
                  <img :src="scope.row.goodsImageBean.imageUrl" alt=""
                       style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
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
    <el-button @click="dialogVisibleQuery = false">返回</el-button>
    <el-button type="primary" @click="ChooseSure">确认选择</el-button>
  </span>
        </el-dialog>
      </div>
    </div>
    <div class="col-pagination">
      <div style="width: 100%;text-align: center;margin-top: 10px">
        <el-button @click="backOne">取消</el-button>
        <el-button type="primary" @click="clickAddAfter" :loading="repetition">确认</el-button>
      </div>
    </div>
    <div>
      <el-dialog
        title="添加问题原因"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="440px"
      >
        <div
          style="width:400px;height: 550px;border-left: 1px solid #ECECED;border-right: 1px solid #ECECED;overflow: auto">
          <div class="box" style="background: #F2F2F2">
            <span class="span1"><i class="el-icon-plus" @click="addList"></i></span><span
            class="span2">问题原因（15个字以内）</span><span class="span3">操作</span>
          </div>
          <ul>
            <li class="box" v-for="(item,index) in list1" :key="index" :class="{background: index%2==1}">
              <span class="span1">{{index + 1}}</span>
              <span class="span2" style="display: inline-block" @click="exitList(item,index)">
                <el-input v-if="indexDex == index && item.isShow == true" v-model="item.returnName"
                          @keyup.native="item.returnName=item.returnName.replace(/\s+/g,'')" :maxlength="15"
                          style="width: 300px;display: inline-block"></el-input>
                <span v-else>{{item.returnName}}</span>
              </span>
              <span class="span3"><i class="el-icon-close" @click="delList(item,index)"></i></span>
            </li>
          </ul>
        </div>
        <div class="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveSales(1)">保 存</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        title="添加额外退款原因"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible1"
        width="440px"
      >
        <div
          style="width:400px;height: 550px;border-left: 1px solid #ECECED;border-right: 1px solid #ECECED;overflow: auto">
          <div class="box" style="background: #F2F2F2">
            <span class="span1"><i class="el-icon-plus" @click="addList1"></i></span><span
            class="span2">问题原因（15个字以内）</span><span class="span3">操作</span>
          </div>
          <ul>
            <li class="box" v-for="(item,index) in outerList1" :class="{background: index%2==1}" :key="index">
              <span class="span1">{{index + 1}}</span>
              <span class="span2" style="display: inline-block" @click="exitList1(item,index)">
                <el-input v-if="indexDex1 == index && item.isShow == true" v-model="item.otherRefundName"
                          @keyup.native="item.otherRefundName=item.otherRefundName.replace(/\s+/g,'')" :maxlength="15"
                          style="width: 300px;display: inline-block"></el-input>
                <span v-else>{{item.otherRefundName}}</span>
              </span>
              <span class="span3"><i class="el-icon-close" @click="delList1(item,index)"></i></span>
            </li>
          </ul>
        </div>
        <div class="footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="saveSales(2)">保 存</el-button>
        </div>
      </el-dialog>
    </div>
    <div id="orderId">
      <el-dialog
        title=""
        :close-on-click-modal="false"
        :visible.sync="dialogVisible3"
        width="360px"
      >
        <div style="width: 100%;text-align: center;">
          <i class="el-icon-circle-check-outline" style="color: #7ED321;font-size: 40px"></i>
        </div>
        <div style="width: 100%;text-align: center;margin: 20px 0 50px 0;color:#4A4A4A;">
          <span>创建售后单成功，售后单号{{newOrder}}</span>
        </div>
        <div style="width: 100%;text-align: center">
          <el-button @click="knowClose">知道了</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {returnFloat, returnFloat1} from '@/assets/js/validate';
  import ProvCityArea from '@/components/common/ProvCityArea.vue';

  export default {
    props: ['orderId', 'platNum', 'sendStatus', 'obj'],
    components: {
      ProvCityArea,
    },
    data() {
      return {
        proCityAreaValue: [], // 地址接受
        proCityAreaLabel: [],// 地址label
        value: '', // 版本号
        test: [], // 自定义属性
        spanCol: 6, // 占格数
        dialogVisible: false, // 问题原因弹框
        dialogVisible1: false, // 添加额外退款原因
        dialogVisible3: false, // 新售后单号
        dialogVisibleQuery: false, //查询商品弹框
        shopSuit: [], // 商品套装
        options: [],// 快递
        indexDex: 'a',// 添加条数限制
        indexDex1: 'b',// 添加条数限制
        queryShop: () => {
        }, // 商品list
        shopQuery: () => {
        }, // 商品明细的查询
        salesReturn: () => {
        }, // 退货原因查询
        salesReturnOuter: () => {
        }, // 额外退货原因
        version: '1.0.0',// 版本号
        list: [], // 退货原因原来的数据
        list1: [], // 退货原因改变之后的数据
        outerList: [], // 额外退货原因原来的数据
        outerList1: [], // 额外退货原因改变之后的数据
        ///tableData: [],
        tableData1: [], // 弹框商品明细
        delIdList: [], //删除原因id列表
        reasonAddList: [],//新增原因列表
        reasonChangeMap: {},//原因修改列表：key:原因id，val：新原因
        newOrder: '', // 新订单
        indexReg: 'ab', // 商品明细的校验index
        classReg: '', // 商品明细的校验calss
        itemBeanList: [], // 深拷贝商品
        copyData: [], // 选择要换货的商品
        copyData1: [],// 选择要换货的商品 弹框
        replaceItemBeans: [],//换出、补发明细,JSON字符串
        bool: false,// 开启订单设置-限制换货商品参数
        boolMoney: false,//换出金额大于
        continued: false,// 如果大于禁止
        repetition: false,// 防止重复点击
        // 查询商品参数
        findShop: {
          page: 1,   //当前页
          size: 15,   //每页条数
          goodsCode: '',   //商品编码
          barCode: '',       //条形码
          goodsName: '',  //商品名称
          goodsSpec: '',  //商品规格
        },
        totalPage1: 15, // 要显示的条数
        currentPage1: 1, //
        totalNum1: 0, // 数据总条数
        afterSaleBaseBean: { // 添加售后单参数
          salesOrderNos: '',//新单订单号集合,逗号隔开
          orderNoExpressNoJson: '',//查询明细时返回的值直接带过来
          salesOrderId: this.orderId,//原始单id
          sourceOrderNo: this.platNum,//平台单号
          asType: '',//售后类型
          receiver: '',// 收货人
          mobile: '',//手机
          phone: '',
          applyRefundAmt: 0,//申请退款金额
          totalRefundAmt: '',//退款总金额
          otherRefundAmt: '',//额外退款金额
          otherRefundReasonName: '',//额外退款原因id
          otherRefundMsg: '',//额外退款说明
          returnGoodsName: '',//退货原因id
          otherRefundFlowNo: '',//额外退款流水号
          buyerNick: '',//买家昵称
          payTime: '',//付款时间
          expressCoName: '',//退回快递公司名字
          returnExpressNos: '',//退回快递单号集合，逗号隔开
          sendExpressNos: '',//发货快递单号集合，逗号隔开,查询明细时返回的值直接带过来
          storeId: '',//店铺id
          returnMsg: '',//退货描述
          serviceMsg: '',//客服备注,查询明细时返回的值直接带过来
          afterMsg: '',//售后备注
          customerReturnMsg: '',//买家退货留言
          itemBeans: '',//售后明细,JSON字符串
          attributeBeans: '', // 自定义属性,JSON字符串
          provinceRegionId: '', //省份id
          cityRegionId: '',//市id
          areaRegionId: '', //区id
          townRegionId: '', //镇id
          consigneeContry: '', //收货人国家名
          consigneeProvince: '', //收货人省份
          consigneeCity: '', //收货人市
          consigneeArea: '', //收货人地区
          consigneeTown: '',//收货人镇
          shippingAddress: '', // 收货详细地址
          orderType: '',// 订单原始类型
          replaceSourceOrderNo: '',// 换补订单原订单号
        },
        areaParams: [],// 接受选择地址
        typeChand: false,//只能仅退款或补发
        typeChand3:false, //补发状态改变
        typeChand2:false
      }
    },

    watch: {
      shopSuit(val) {
        let num = [];
        let num2 = [];
        let Amt = 0
        val.itemBeanList.forEach((item) => {
          if (!item.giftFlag && item.dealPrice == 0) {  //无曾字并且单价为0视为平台产品可进行其它类型操作，而且平台产品可以填写数量的
            this.obj.isAdd = false;
          }
          num.push(item.canReturnQty)
          num2.push(item.canReturnAmt)
          if( item.firstPayAmt){
            item.canReturnAmt = item.firstPayAmt
          }
          if((item.giftFlag && item.turnoverAmt == 0 && item.canReturnQty > 0) || (item.canReturnQty > 0 && item.canReturnAmt > 0)){
            Amt++
          }


          if(item.suitDetailBeanList){  //套装套单部分
            item.suitDetailBeanList.forEach(val=>{
              if (!val.giftFlag && val.dealPrice == 0) {  //无曾字并且单价为0视为平台产品可进行其它类型操作，而且平台产品可以填写数量的
                this.obj.isAdd = false;
              }
              num.push(val.canReturnQty)
              num2.push(val.canReturnAmt)

              if( val.firstPayAmt){
                val.canReturnAmt = val.firstPayAmt
              }

            })
          }

        });

           if (eval(num.join("+")) == 0 ) {        //可退金额和可退数量不满足同时大于0所以不能退货退款和换货
             this.typeChand = true;
             if(this.afterSaleBaseBean.asType == 1 || this.afterSaleBaseBean.asType == 3){
               this.afterSaleBaseBean.asType = 2
             }else if( this.afterSaleBaseBean.asType == 2){
               this.afterSaleBaseBean.asType = 2
             }else if( this.afterSaleBaseBean.asType == 4){
               this.afterSaleBaseBean.asType = 4
             }
           }
           ;

           if ((eval(num2.join("+")) == 0 && Amt == 0) || Amt == 0) {        //可退金额和可退数量不满足同时大于0所以不能退货退款和换货
             this.typeChand2 = true;
             if(this.afterSaleBaseBean.asType == 1){
               this.afterSaleBaseBean.asType = 2
             }else if( this.afterSaleBaseBean.asType == 2){
               this.afterSaleBaseBean.asType = 2
             }else if( this.afterSaleBaseBean.asType == 4){
               this.afterSaleBaseBean.asType = 4
             }

           }
           ;


        if(val.itemBeanList.length == 1 && val.itemBeanList[0].dealPrice == 0){
          this.typeChand = false;
        }
      },



    },
    methods: {
      // 选择收货地址时触发方法
      channelArea(params) {
        //console.log(params);
        this.areaParams = params;
        this.afterSaleBaseBean.provinceRegionId = params.proCityAreaValue[0];
        this.afterSaleBaseBean.cityRegionId = params.proCityAreaValue[1];//市id
        this.afterSaleBaseBean.consigneeProvince = params.proCityAreaLabel[0]; //收货人省份
        this.afterSaleBaseBean.consigneeCity = params.proCityAreaLabel[1]; //收货人市
        if (params.proCityAreaValue.length >= 3) {
          this.afterSaleBaseBean.areaRegionId = params.proCityAreaValue[2]; //区id
          this.afterSaleBaseBean.consigneeArea = params.proCityAreaLabel[2]; //收货人地区
        } else { // 防止赋值之前的地址
          this.afterSaleBaseBean.areaRegionId = ''; //区id
          this.afterSaleBaseBean.consigneeArea = ''; //收货人地区
        }
        if (params.proCityAreaValue.length == 4) {
          this.afterSaleBaseBean.townRegionId = params.proCityAreaValue[3]; //镇id
          this.afterSaleBaseBean.consigneeTown = params.proCityAreaLabel[3];
        } else { // 防止赋值之前的地址
          this.afterSaleBaseBean.townRegionId = ''; //镇id
          this.afterSaleBaseBean.consigneeTown = '';
        }
        ///this.loading = false;
      },
      // 点击添加商品
      clickShop() {
        this.queryShop();//调用商品列表接口
        this.dialogVisibleQuery = true; // 商品弹框显示
      },
      // 校验换货
      numSubmit() {
        let num = 0;
        // 换出商品的总金额
        this.replaceItemBeans.forEach(item => {
          if (item.salesPrice && item.goodsQty) { // 售价为不为0  输入不为空
            num += (item.salesPrice * 1) * (item.goodsQty * 1);//换出商品数量*换出商品售价
          }
        });
        if (this.bool) { // 开启订单设置-限制换货商品参数
          if (num > this.shopSuit.itemBeanList[0].canChangAmtSum) { // 开启后换出商品金额不可大于被换金额
            this.$message({
              message: '换出商品金额大于被换商品可换金额，不可更换',
              type: 'warning'
            })
          } else {// 小于等于才可以换出
            this.clickAddBarter();// 保存换货
          }
        } else { // 未开启
          this.boolMoney = false;
          this.continued = false;
          if (num * 1 > this.shopSuit.itemBeanList[0].canChangAmtSum * 1) { //大于可换金额时
            this.$confirm('所换商品金额已超过可换金额，确认强制换货', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true
            }).then(() => { // 大于也同意换货
              this.continued = false;
              this.clickAddBarter();// 保存换货
            }).catch(() => {
              this.continued = true;
              this.$message({
                type: 'info',
                message: '取消强制换货'
              });
            })
          } else {// 不大于直接换货
            this.clickAddBarter();// 保存换货
          }
        }
      },
      // 换货的添加售后单
      clickAddBarter() { //换货的
        this.indexReg = 'a'; // 把之前红框恢复
        this.classReg = '';
        if (this.afterSaleBaseBean.otherRefundAmt && !this.afterSaleBaseBean.otherRefundReasonName) {
          this.$message({
            message: '请选择额外退款原因',
            type: 'warning'
          });
          return;
        }
        let ptgift = false;//是否为平台赠品
        /*canReturnQty;//可退数量   canReturnAmt;//可退金额*/
        if (this.afterSaleBaseBean.asType == 3) { // 换货
          if (this.replaceItemBeans.length == 0) { // 换出商品不可为空
            this.$message({
              message: '请添加换出商品',
              type: 'warning'
            });
            return;
          }

          for (var j = 0; j < this.replaceItemBeans.length; j++) { // 添加换出商品必须输入值，不然就删除
            if (!(this.replaceItemBeans[j].goodsQty * 1)) {
              this.classReg = 'goodsQty'; // 申请退款金额
              this.indexReg = j; // 申请退款金额
              this.$message({
                message: '请输入换出商品数量',
                type: 'warning'
              });
              return;
            }
          }

          let reg = 0; // 存储符合条件的并且有值的
          for (var i = 0; i < this.shopSuit.itemBeanList.length; i++) {
            // 输入数量  可退数量不为0  不为套装
            if (!this.shopSuit.itemBeanList[i].giftFlag && this.shopSuit.itemBeanList[i].salesPrice == 0) {
              ptgift = true;
            }

            if ((this.shopSuit.itemBeanList[i].applyReturnQty * 1) && (this.shopSuit.itemBeanList[i].canReturnAmt || this.shopSuit.itemBeanList[i].giftFlag)) {
              reg++;
            } else if (this.obj.orderType == 3 && this.shopSuit.itemBeanList[i].canReturnQty && this.shopSuit.itemBeanList[i].applyReturnQty * 1) {
              reg++;
            } else if (this.shopSuit.itemBeanList[i].applyReturnQty * 1 && ptgift) {
              reg++;
            } else if (this.shopSuit.itemBeanList[i].applyReturnQty * 1 && this.shopSuit.itemBeanList[i].suitFlag) {
              reg++;
            } else if (this.shopSuit.itemBeanList[i].applyReturnQty * 1 && this.shopSuit.itemBeanList[i].fromItemId) {
              reg++;
            }
          }
          if (reg == 0) {// 换出商品明细没有符合的没有填值
            for (var i = 0; i < this.shopSuit.itemBeanList.length; i++) {
              if (this.obj.orderType == 3) { // 订单原始状态是换货
                // 申请退货数量没有输入值，可编辑状态
                let numben = 0
                this.shopSuit.itemBeanList.forEach(item => {
                  console.log(item.applyReturnQty, '1111');
                  if (item.applyReturnQty) {
                    if (item.applyReturnQty == 0) {
                      numben++
                    }

                  }
                })
                if (numben != 0) {
                  this.$message({
                    message: '请输入申请退货数量',
                    type: 'warning'
                  });
                  return;
                }
                if (!(this.shopSuit.itemBeanList[i].applyReturnQty * 1) && (this.shopSuit.itemBeanList[i].giftFlag || this.shopSuit.itemBeanList[i].suitFlag || this.shopSuit.itemBeanList[i].fromItemId) && this.shopSuit.itemBeanList[i].canReturnQty > 0) {
                  this.classReg = 'applyReturnQty'; // 申请退款金额
                  this.indexReg = i; // 申请退款金额
                  this.$message({
                    message: '请输入申请退货数量',
                    type: 'warning'
                  });
                  return;
                }

                if ((this.shopSuit.itemBeanList[i].applyReturnQty * 1) == 0) {
                  this.$message({
                    message: '请输入申请退货数量',
                    type: 'warning'
                  });
                  return;
                }
              } else {
                let numben = 0
                this.shopSuit.itemBeanList.forEach(item => {
                  console.log(item.applyReturnQty, '1111');
                  if (item.applyReturnQty) {
                    if (item.applyReturnQty == 0) {
                      numben++
                    }

                  }
                })
                if (numben != 0) {
                  this.$message({
                    message: '请输入申请退货数量',
                    type: 'warning'
                  });
                  return;
                }
                // 申请退货数量没有输入值，可编辑状态
                if (!(this.shopSuit.itemBeanList[i].applyReturnQty * 1) && (this.shopSuit.itemBeanList[i].giftFlag || this.shopSuit.itemBeanList[i].suitFlag || this.shopSuit.itemBeanList[i].fromItemId) && this.shopSuit.itemBeanList[i].canReturnQty > 0) {
                  this.classReg = 'applyReturnQty'; // 申请退款金额
                  this.indexReg = i; // 申请退款金额
                  this.$message({
                    message: '请输入申请退货数量',
                    type: 'warning'
                  });
                  return;
                }


              }

            }
          }


          if (this.areaParams.validatePass) { // 没有选择的地址提示 （地址为必填）
            this.$message({
              message: this.areaParams.validatePass,
              type: 'warning'
            });
            return
          }

          if (!this.afterSaleBaseBean.shippingAddress) { // 详细地址为必填
            this.$message({
              message: '请填写详细地址',
              type: 'warning'
            });
            return
          }

          if (this.obj.consignee == '') {
            this.$message({
              message: '请添加收货人',
              type: 'warning'
            });
            return
          }

          if (this.obj.consigneePhone == '') {
            this.$message({
              message: '请填写手机号',
              type: 'warning'
            });
            return
          }

        }


        let arr = [];
        if (this.afterSaleBaseBean.asType == 3) { // 换货过滤没有填写的
          this.shopSuit.itemBeanList.forEach(item => {
            if (this.obj.orderType == 3) { // 原始订单是换货
              if (item.applyReturnQty * 1 && (item.canReturnQty || ptgift || (item.applyReturnQty * 1 && item.suitFlag) || (!item.suitFlag && !item.giftFlag))) {
                arr.push(item)
              }
            } else {
              if ((item.applyReturnQty * 1) && (!item.disabled || item.giftFlag || ptgift || (item.applyReturnQty * 1 && item.suitFlag) || (!item.suitFlag && !item.giftFlag))) {
                arr.push(item)
              }
            }
          });
          this.afterSaleBaseBean.itemBeans = JSON.stringify(arr);
        } else { // 退货退款 仅退款  过滤不需要填写的
          let list = [];
          this.shopSuit.itemBeanList.forEach(item => {
            if (!item.disabled) {
              list.push(item)
            }
          });
          this.afterSaleBaseBean.itemBeans = JSON.stringify(list);
          //console.log(list,this.shopSuit.itemBeanList,98888);
        }

        if (this.shopSuit.payTime) {// 付款时间是否有值
          this.afterSaleBaseBean.payTime = this.shopSuit.payTime; // 付款时间
        } else {
          this.afterSaleBaseBean.payTime = '';
        }


        let filter = []; // 过滤没有填的商品

        this.replaceItemBeans.forEach(item => {
          if (item.goodsQty) {
            filter.push(item)
          }
        });

        this.repetition = true;
        this.afterSaleBaseBean.storeId = this.obj.storeId; // 店铺
        this.afterSaleBaseBean.mobile = this.obj.consigneeMobile; // 手机
        this.afterSaleBaseBean.receiver = this.obj.consignee; // 收货人
        this.afterSaleBaseBean.phone = this.obj.consigneePhone
        this.afterSaleBaseBean.orderNoExpressNoJson = this.shopSuit.orderNoExpressNoJson; // 查询明细时返回的值
        this.afterSaleBaseBean.salesOrderNos = this.shopSuit.salesOrderNos; // 新单订单号集合,逗号隔开
        this.afterSaleBaseBean.sendExpressNos = this.shopSuit.sendExpressNos; //发货快递单号集合
        this.afterSaleBaseBean.buyerNick = this.obj.buyerNick; // 卖家昵称
        this.afterSaleBaseBean.attributeBeans = JSON.stringify(this.test);
        this.afterSaleBaseBean.serviceMsg = this.shopSuit.serviceMsg;
        this.afterSaleBaseBean.replaceItemBeans = JSON.stringify(filter);
        // 添加售后单接口
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/saveAfterSaleOrder', this.afterSaleBaseBean)
          .then(res => {
            if (res.data.success) {
              this.repetition = false;
              this.newOrder = res.data.result;
              this.dialogVisible3 = true;
            } else {
              this.repetition = false;
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 点击确认添加售后单
      clickAddAfter() {
        if (this.afterSaleBaseBean.asType != 4) {
          if (this.shopSuit.itemBeanList.length == 1 && !this.shopSuit.itemBeanList[0].giftFlag && this.shopSuit.itemBeanList[0].dealPrice == 0
            && this.shopSuit.itemBeanList[0].canReturnQty == 0) {
            this.$message({
              message: ' 不可新建售后单！',
              type: 'warning'
            })
            return false
          }
        }


        this.indexReg = 'a'; // input框爆红还原
        this.classReg = '';
        if (this.afterSaleBaseBean.asType == 3) { // 换货应该走校验
          //console.log(123);
          this.numSubmit(); // 校验，是否开启订单设置
        } else {
          // 补发校验
          if (this.afterSaleBaseBean.asType == 4) { // 补发
            if (this.replaceItemBeans.length == 0) { //补发不能为空
              this.$message({
                message: '选择要补发的商品',
                type: 'warning'
              });
              return;
            }

            for (var i = 0; i < this.replaceItemBeans.length; i++) { // 补发商品申请补发数量为必填
              if (!this.replaceItemBeans[i].goodsQty) {
                this.classReg = 'goodsQty'; // 申请补发数量
                this.indexReg = i; // 申请补发数量

                this.$message({
                  message: '请填写申请补发数量',
                  type: 'warning'
                });
                return;
              }
            }
            if (this.areaParams.validatePass) { // 地址为必填
              this.$message({
                message: this.areaParams.validatePass,
                type: 'warning'
              });
              return
            }


            if (!this.afterSaleBaseBean.shippingAddress) { // 详细地址为必填
              this.$message({
                message: '请填写详细地址',
                type: 'warning'
              });
              return
            }

            if (this.obj.consignee == '') {
              this.$message({
                message: '请添加收货人',
                type: 'warning'
              });
              return
            }

            if (this.obj.consigneePhone == '') {
              this.$message({
                message: '请填写手机号',
                type: 'warning'
              });
              return
            }
            let compare = false;

            this.replaceItemBeans.forEach(item => { // 补发商品明细里申请补发数量 添加商品弹框不校验
              this.shopSuit.itemBeanList.forEach(item1 => {
                if (item.goodsId == item1.goodsId && item.goodsQty) { // 添加的弹框商品不计算
                  if (item.goodsQty * 1 > (item1.goodsQty - item1.applyReissueQty) * 1) {
                    compare = true;
                  }
                }
              })
            });
            if (compare) {
              this.$confirm('补发商品明细中含有超过可补发数量的商品确认强制生成售后单？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
              }).then(() => {
                if (this.shopSuit.payTime) { // 付款时间有值
                  this.afterSaleBaseBean.payTime = this.shopSuit.payTime; // 付款时间
                } else {
                  this.afterSaleBaseBean.payTime = '';
                }

                this.repetition = true;
                this.afterSaleBaseBean.storeId = this.obj.storeId; // 店铺
                this.afterSaleBaseBean.mobile = this.obj.consigneeMobile; // 手机  consigneePhone
                this.afterSaleBaseBean.phone = this.obj.consigneePhone;
                this.afterSaleBaseBean.receiver = this.obj.consignee; // 收货人
                this.afterSaleBaseBean.itemBeans = JSON.stringify(this.shopSuit.itemBeanList);
                this.afterSaleBaseBean.orderNoExpressNoJson = this.shopSuit.orderNoExpressNoJson; // 查询明细时返回的值
                this.afterSaleBaseBean.salesOrderNos = this.shopSuit.salesOrderNos; // 新单订单号集合,逗号隔开
                this.afterSaleBaseBean.sendExpressNos = this.shopSuit.sendExpressNos; //发货快递单号集合
                this.afterSaleBaseBean.buyerNick = this.obj.buyerNick; // 卖家昵称
                this.afterSaleBaseBean.attributeBeans = JSON.stringify(this.test);
                this.afterSaleBaseBean.serviceMsg = this.shopSuit.serviceMsg;
                this.afterSaleBaseBean.replaceItemBeans = JSON.stringify(this.replaceItemBeans);


                // 添加售后单接口
                this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/saveAfterSaleOrder', this.afterSaleBaseBean)
                  .then(res => {

                    if (res.data.success) {
                      this.repetition = false;
                      this.newOrder = res.data.result;
                      this.dialogVisible3 = true;
                    } else {
                      this.repetition = false;
                      this.$message({
                        message: res.data.msg,
                        type: 'warning'
                      })
                    }
                  })
              }).catch(() => {// 不生成售后单
              })
            } else {
              /* let arr = [];
               this.shopSuit.itemBeanList.forEach(item => {
                 if(item.disabled == true){

                 }else{
                   arr.push(item)
                 }
               });*/
              if (this.shopSuit.payTime) {// 付款时间有值
                this.afterSaleBaseBean.payTime = this.shopSuit.payTime; // 付款时间
              } else {
                this.afterSaleBaseBean.payTime = '';
              }

              let filter = []; // 过滤没有填的值

              this.replaceItemBeans.forEach(item => {
                if (item.goodsQty) {
                  filter.push(item)
                }
              });

              this.repetition = true;
              this.afterSaleBaseBean.storeId = this.obj.storeId; // 店铺
              this.afterSaleBaseBean.mobile = this.obj.consigneeMobile; // 手机
              this.afterSaleBaseBean.receiver = this.obj.consignee; // 收货人
              this.afterSaleBaseBean.phone = this.obj.consigneePhone; // 手机
              this.afterSaleBaseBean.itemBeans = JSON.stringify(this.shopSuit.itemBeanList);
              this.afterSaleBaseBean.orderNoExpressNoJson = this.shopSuit.orderNoExpressNoJson; // 查询明细时返回的值
              this.afterSaleBaseBean.salesOrderNos = this.shopSuit.salesOrderNos; // 新单订单号集合,逗号隔开
              this.afterSaleBaseBean.sendExpressNos = this.shopSuit.sendExpressNos; //发货快递单号集合
              this.afterSaleBaseBean.buyerNick = this.obj.buyerNick; // 卖家昵称
              this.afterSaleBaseBean.attributeBeans = JSON.stringify(this.test);
              this.afterSaleBaseBean.serviceMsg = this.shopSuit.serviceMsg;
              this.afterSaleBaseBean.replaceItemBeans = JSON.stringify(filter);
              // 添加售后单接口
              this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/saveAfterSaleOrder', this.afterSaleBaseBean)
                .then(res => {

                  if (res.data.success) {
                    this.repetition = false;
                    this.newOrder = res.data.result;
                    this.dialogVisible3 = true;
                  } else {
                    this.repetition = false;
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
            }
          } else { // 仅退款 退货退款  换货
            this.indexReg = 'a';
            if (this.afterSaleBaseBean.otherRefundAmt && !this.afterSaleBaseBean.otherRefundReasonName) {
              this.$message({
                message: '请选择额外退款原因',
                type: 'warning'
              });
              return;
            }
            if (this.afterSaleBaseBean.asType == 1) { // 退货退款
              var number2 = 0;
              var number3 = 0;
              var number4 = 0
              this.shopSuit.itemBeanList.forEach(item => {
                if (!!(item.applyReturnQty) && (!!(item.applyRefundAmt) || item.applyRefundAmt != undefined)) {
                  if (item.applyReturnQty == 0 && item.applyRefundAmt == 0) {
                    number4++
                  }
                }
                if (item.applyReturnQty) {
                  number2++
                }
                if (item.applyRefundAmt != undefined) {
                  number3++
                }
              });

              if (number4 != 0) {
                this.$message({
                  message: '申请退款金额和申请退货数量不能都为0',
                  type: 'warning'
                });
                return
              }

              for (var i = 0; i < this.shopSuit.itemBeanList.length; i++) {
                if ((this.shopSuit.itemBeanList[i].canReturnQty > 0 && this.shopSuit.itemBeanList[i].canReturnAmt > 0) && (!!(this.shopSuit.itemBeanList[i].applyRefundAmt) == true &&
                    !!(this.shopSuit.itemBeanList[i].applyReturnQty) == false) && number3 != 0) {
                  this.classReg = 'applyReturnQty'; // 申请退款金额
                  this.indexReg = i; // 申请退款金额
                  this.$message({
                    message: '请输入申请退换补数量',
                    type: 'warning'
                  });
                  return;
                }


                if (this.shopSuit.itemBeanList[i].canReturnQty > 0 && this.shopSuit.itemBeanList[i].canReturnAmt > 0 &&
                  !!(this.shopSuit.itemBeanList[i].applyRefundAmt) == false && !!(this.shopSuit.itemBeanList[i].applyReturnQty) == true && !this.shopSuit.itemBeanList[i].Disable2 && !this.shopSuit.itemBeanList[i].Disable && number2 != 0) {
                  this.classReg = 'applyRefundAmt'; // 申请退款金额
                  this.indexReg = i; // 申请退款金额
                  this.$message({
                    message: '请输入申请退款金额',
                    type: 'warning'
                  });
                  return;
                }
                if (this.shopSuit.itemBeanList[i].giftFlag) { //如果为赠品不校验申请退款金额

                } else {
                  if (this.shopSuit.itemBeanList[i].turnoverAmt == 0) {

                  } else {
                    if (!(this.shopSuit.itemBeanList[i].applyRefundAmt * 1) && (this.shopSuit.itemBeanList[i].disabled == false || (this.shopSuit.itemBeanList[i].canReturnAmt && this.shopSuit.itemBeanList[i].canReturnQty)) && number != 0 && (this.shopSuit.itemBeanList[i].applyReturnQty)) {
                      this.classReg = 'applyRefundAmt'; // 申请退款金额
                      this.indexReg = i; // 申请退款金额
                      this.$message({
                        message: '请输入申请退款金额',
                        type: 'warning'
                      });
                      return;
                    }
                  }
                }
              }

              var numb = 0;
              this.shopSuit.itemBeanList.forEach(item => {
                if (!!(item.applyReturnQty)) {
                  numb++;
                }
              });
              for (var i = 0; i < this.shopSuit.itemBeanList.length; i++) {
                if ((!!(this.shopSuit.itemBeanList[i].applyReturnQty) == false && this.shopSuit.itemBeanList[i].canReturnQty > 0 && numb == 0 ) && (!this.shopSuit.itemBeanList[i].Disable2 && !this.shopSuit.itemBeanList[i].Disable)) {
                  this.classReg = 'applyReturnQty'; // 申请退款金额
                  this.indexReg = i; // 申请退款金额
                  this.$message({
                    message: '请输入申请退换补数量',
                    type: 'warning'
                  });
                  return;
                }
              }
            }
            if (this.afterSaleBaseBean.asType == 2) { // 仅退款

              var number = 0;
              this.shopSuit.itemBeanList.forEach(item => {
                if (item.applyRefundAmt || item.applyReturnQty) {
                  number++
                }
              });
              if(this.afterSaleBaseBean.otherRefundAmt == ''){
                for (var i = 0; i < this.shopSuit.itemBeanList.length; i++) {
                  if (this.shopSuit.itemBeanList[i].canReturnAmt > 0 && !!(this.shopSuit.itemBeanList[i].applyRefundAmt) == false && number == 0) {
                    this.classReg = 'applyRefundAmt'; // 申请退款金额
                    this.indexReg = i; // 申请退款金额
                    this.$message({
                      message: '请输入申请退款金额',
                      type: 'warning'
                    });
                    return;
                  }

                  if (this.shopSuit.itemBeanList[i].canReturnQty > 0 && this.shopSuit.itemBeanList[i].canReturnAmt > 0 &&
                    !!(this.shopSuit.itemBeanList[i].applyRefundAmt) == false && !!(this.shopSuit.itemBeanList[i].applyReturnQty) == true && !this.shopSuit.itemBeanList[i].Disable2 && !this.shopSuit.itemBeanList[i].Disable) {
                    this.classReg = 'applyRefundAmt'; // 申请退款金额
                    this.indexReg = i; // 申请退款金额
                    this.$message({
                      message: '请输入申请退款金额',
                      type: 'warning'
                    });
                    return;
                  }

                }
              }




            }

            if (this.afterSaleBaseBean.asType == 3) { // 换货

              if (this.boolMoney) {
                this.$message({
                  message: '换出商品金额大于被换商品可换金额，不可更换',
                  type: 'warning'
                });
                return
              }
              if (this.continued) {

                return;
              }
              let reg = 0;
              for (var i = 0; i < this.shopSuit.itemBeanList.length; i++) {
                // 输入数量  可退数量不为0  不为套装
                if ((this.shopSuit.itemBeanList[i].applyReturnQty * 1) && (this.shopSuit.itemBeanList[i].canReturnAmt || this.shopSuit.itemBeanList[i].giftFlag)) {
                  reg++;
                }
              }
              if (reg == 0) {
                for (var i = 0; i < this.shopSuit.itemBeanList.length; i++) {
                  // 申请退货数量没有输入值，可编辑状态
                  if (!(this.shopSuit.itemBeanList[i].applyReturnQty * 1) && (!this.shopSuit.itemBeanList[i].disabled || this.shopSuit.itemBeanList[i].giftFlag) && !this.shopSuit.itemBeanList[i].fromItemId) {
                    this.classReg = 'applyReturnQty'; // 申请退款金额
                    this.indexReg = i; // 申请退款金额
                    this.$message({
                      message: '请输入申请退货数量',
                      type: 'warning'
                    });
                    return;
                  }
                }
              }

              if (this.replaceItemBeans.length == 0) {
                this.$message({
                  message: '请添加换出商品',
                  type: 'warning'
                });
                return;
              }

              for (var j = 0; j < this.replaceItemBeans.length; j++) {
                if (!(this.replaceItemBeans[j].goodsQty * 1)) {
                  this.classReg = 'goodsQty'; // 申请退款金额
                  this.indexReg = j; // 申请退款金额
                  this.$message({
                    message: '请输入换出商品数量',
                    type: 'warning'
                  });
                  return;
                }
              }


            }
            let arr = [];
            if (this.afterSaleBaseBean.asType == 3) { // 换货过滤没有填写的
              this.shopSuit.itemBeanList.forEach(item => {
                if ((item.applyReturnQty * 1) && (!item.disabled || item.giftFlag)) {
                  arr.push(item)
                }
              });
              this.afterSaleBaseBean.itemBeans = JSON.stringify(arr);
            } else { // 退货退款 仅退款  过滤不需要填写的
              let list = [];
                this.shopSuit.itemBeanList.forEach(item => { //可退金额和可退数量都不为0 输入框有值  或者  当前为赠品 输入框有值
                  if (item.turnoverAmt == 0) {
                    if (((item.canReturnQty || item.canReturnAmt) && (item.applyReturnQty || item.applyRefundAmt)) || (item.giftFlag && (item.applyReturnQty || item.applyRefundAmt))) {
                      list.push(item)
                    }
                  } else {
                    if (((item.canReturnQty && item.canReturnAmt) && (item.applyReturnQty || item.applyRefundAmt)) || (item.giftFlag && (item.applyReturnQty || item.applyRefundAmt))) {
                      list.push(item)
                    }
                  }

                });



              if(this.afterSaleBaseBean.otherRefundAmt !== ''){
                this.afterSaleBaseBean.itemBeans = JSON.stringify(this.shopSuit.itemBeanList);
              }else {
                this.afterSaleBaseBean.itemBeans = JSON.stringify(list);
              }

            }

            if (this.shopSuit.payTime) {
              this.afterSaleBaseBean.payTime = this.shopSuit.payTime; // 付款时间
            } else {
              this.afterSaleBaseBean.payTime = '';
            }


            let filter = []; // 过滤没有填的值

            this.replaceItemBeans.forEach(item => {
              if (item.goodsQty) {
                filter.push(item)
              }
            });
            let num = 0;
            this.shopSuit.itemBeanList.forEach(item => {
              if (item.disabled) { // 值过滤

              } else {
                if (item.applyRefundAmt) {
                  num += item.applyRefundAmt * 1;
                }
              }
            });
            if (!num) {
              this.afterSaleBaseBean.applyRefundAmt = '';
            } else {
              this.afterSaleBaseBean.applyRefundAmt = num; // 申请退款金额
            }
            this.repetition = true;
            this.afterSaleBaseBean.storeId = this.obj.storeId; // 店铺
            this.afterSaleBaseBean.mobile = this.obj.consigneeMobile; // 手机
            this.afterSaleBaseBean.receiver = this.obj.consignee; // 收货人
            this.afterSaleBaseBean.orderNoExpressNoJson = this.shopSuit.orderNoExpressNoJson; // 查询明细时返回的值
            this.afterSaleBaseBean.salesOrderNos = this.shopSuit.salesOrderNos; // 新单订单号集合,逗号隔开
            this.afterSaleBaseBean.sendExpressNos = this.shopSuit.sendExpressNos; //发货快递单号集合
            this.afterSaleBaseBean.buyerNick = this.obj.buyerNick; // 卖家昵称
            this.afterSaleBaseBean.attributeBeans = JSON.stringify(this.test);
            this.afterSaleBaseBean.serviceMsg = this.shopSuit.serviceMsg;
            this.afterSaleBaseBean.replaceItemBeans = JSON.stringify(filter);
            //console.log(this.afterSaleBaseBean,88888888);
            // 添加售后单接口
            this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/saveAfterSaleOrder', this.afterSaleBaseBean)
              .then(res => {

                if (res.data.success) {
                  this.repetition = false;
                  this.newOrder = res.data.result;
                  this.dialogVisible3 = true;
                } else {
                  this.repetition = false;
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
          }
        }
      },
      // 申请退换补数量校验（换货）
      returnNumber(row, index, val) {
        if (val == 1) {
          if (row.applyReturnQty) { // 输入框有值
            if (row.applyReturnQty * 1 > row.canReturnQty && !row.giftFlag) { // 申请退货数量大于可退数量时，则输入框中直接展示可退数量最大值
              row.applyReturnQty = row.canReturnQty;
            } else if (row.applyReturnQty * 1 > row.canReturnQty && row.giftFlag) {
              row.applyReturnQty = row.canReturnQty;
            } else if (row.dealPrice == 0 && row.canReturnAmt == 0) { //成交价格为0并且快退金额为0 将申请退款金额置为0
              row.applyRefundAmt = 0;
            }
          } else {
            row.applyRefundAmt = ''

          }
          if (row.turnoverAmt > 0 && row.canReturnAmt > 0 && row.canReturnQty > 0) {
            if (row.applyReturnQty == 0) {
              row.applyReturnQty = ''
            }

            if (row.applyRefundAmt == 0) {
              row.applyRefundAmt = ''

            }
          }
        }

        if (!row.applyReturnQty && !row.applyRefundAmt) {
          this.classReg = 'aa'
        }

        this.$set(this.shopSuit.itemBeanList, index, row);
        let num = 0;
        this.shopSuit.itemBeanList.forEach(item => {
          if (item.applyReturnQty && item.salesPrice) {
            num += item.applyReturnQty * item.salesPrice;
          }
        });
        this.shopSuit.itemBeanList[0].canChangAmtSum = num.toFixed(2);
        if (!row.fromItemId && row.suitFlag) { // 当前失去焦点的是套装
          if (!row.applyReturnQty) { // 套装没值  单品可以输入
            if (row.suitFlag && this.shopSuit.itemBeanList[index + 1].openSuit) {
              row.suitDetailBeanList.forEach(item => {
                item.disabled = false;
              })
            }
          } else { // 套装有值  单品不可以输入
            if (row.suitFlag && this.shopSuit.itemBeanList[index + 1].openSuit) {
              row.suitDetailBeanList.forEach(item => {
                item.disabled = true;
              })
            }
          }
        } else if (row.fromItemId) { // // 当前失去焦点的是套装单品
          if (!row.applyReturnQty) {//没值的情况下恢复
            let count = 0; // 套装下单品是否都没值
            this.shopSuit.itemBeanList.forEach(item => {
              if (item.orderItemId == row.fromItemId) {
                item.suitDetailBeanList.forEach(item1 => {
                  if (item1.applyReturnQty) {
                    count++;
                  }
                })
              }
              if (item.orderItemId == row.fromItemId && count > 0) { // 套装下至少有一个有值
                item.disabled = true;
              } else {
                if (item.canReturnAmt && item.canReturnQty) {
                  item.disabled = false;
                }

              }
            })
          } else { //有值的情况下把套装置灰不可输入
            this.shopSuit.itemBeanList.forEach(item => {
              if (item.orderItemId == row.fromItemId) {
                item.disabled = true;
              }
            })
          }
        }

        let isExit = false;
        if (row.suitFlag && row.giftFlag) { //是套装也是赠品
          isExit = true
        }
        if (row.suitFlag) {  //只是套装
          isExit = true
        }
        if (val == 1 || val == 2) {
          if ((row.applyReturnQty || row.applyRefundAmt) && row.fromItemId) { //当前行为套单并且填写申请退货数量
            let arr = []
            for (var j = index; j >= 0; j--) {       //向上找如果遇到事套装就置灰它

              if (this.shopSuit.itemBeanList[j].suitFlag) {
                this.shopSuit.itemBeanList[j].suitDetailBeanList.forEach(item => {
                  if (item.applyReturnQty || item.applyRefundAmt) {
                    arr.push(item.applyReturnQty)
                    arr.push(item.applyRefundAmt)
                  }
                })
                if (arr.length > 0) {
                  this.shopSuit.itemBeanList[j].Disable2 = true
                }
                return
              }
            }
          } else if ((!row.applyReturnQty || !row.applyRefundAmt) && row.fromItemId) {
            let arr2 = []
            for (var j = index; j >= 0; j--) {       //向上找如果遇到事套装就置灰它
              if (this.shopSuit.itemBeanList[j].suitFlag) {
                this.shopSuit.itemBeanList[j].suitDetailBeanList.forEach(item => {
                  if (item.applyReturnQty || item.applyRefundAmt) {
                    arr2.push(item.applyReturnQty)
                    arr2.push(item.applyRefundAmt)
                  }
                })
                if (arr2.length == 0) {
                  this.shopSuit.itemBeanList[j].Disable2 = false
                }
                return
              }
            }
          }
          if ((row.applyReturnQty || row.applyRefundAmt) && isExit) { //当前为套装并且填写申请可退数量
            if (row.suitDetailBeanList) {
              row.suitDetailBeanList.forEach(item => {
                item.Disable = true;

              })
            }
          } else if ((!row.applyReturnQty || !row.applyRefundAmt) && isExit) {
            if (row.suitDetailBeanList) {
              row.suitDetailBeanList.forEach(item => {
                item.Disable = false;

              })
            }

          }
        }
      },
      // 选择商品的确认选择按钮
      ChooseSure() {
        this.dialogVisibleQuery = false;// 关闭弹框
        this.copyShop(2); // 确认按钮方法
      }
      ,
      //  每页多少条
      handleCurrentChange1(val) {
        console.log(val);
        this.currentPage1 = val;
        this.findShop.page = this.currentPage1;
        this.findShop.size = this.totalPage1;
        this.queryShop();
      }
      ,
      // 当前页
      handleSizeChange1(val) {
        console.log(val);
        this.totalPage1 = val;
        this.findShop.page = this.currentPage1;
        this.findShop.size = this.totalPage1;
        this.queryShop()// 请求数据
      }
      ,
      // 换货选择的商品明细
      handleSelectionChange(val) {
        console.log(val);
        this.copyData = val;
      }
      ,
      // shop checkbox 换货选择的商品明细（弹框）
      handleSelectionChange1(val) {
        console.log(val);
        this.copyData1 = val;
      }
      ,
      // 重置
      shopReset() {
        this.findShop.goodsCode = '';//商品编码
        this.findShop.barCode = ''; //条形码
        this.findShop.goodsName = '';//商品名称
        this.findShop.goodsSpec = '';//商品规格
      }
      ,
      //是否开启订单设置-限制换货商品参数
      getOrderSetting() {
        this._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + this.version + '/query')
          .then(res => {
            if (res.data.success) {
              if (res.data.result) {
                this.bool = res.data.result.limitExchangeGoods;// 开启状态赋值
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(function (error) {
          //console.log(error);
        });

      }
      ,
      // 换出商品输入框校验
      numReg(row, index) {
        let num = 0; //
        row.goodsQty = row.goodsQty.replace(/[^\d]/g, '');
        if (this.replaceItemBeans.length == 1 && this.replaceItemBeans[0].giftFlag) {// 如果换出商品有一个并且是赠品，则不校验
          return;
        }

        // 换出商品的总金额
        this.replaceItemBeans.forEach(item => {
          if (item.salesPrice && item.goodsQty) { // 售价为不为0  输入不为空
            num += (item.salesPrice * 1) * (item.goodsQty * 1);//换出商品数量*换出商品售价
          }
        });
        if (this.bool) { // 开启订单设置-限制换货商品参数
          if (num > this.shopSuit.itemBeanList[0].canChangAmtSum) {
            this.$message({
              message: '换出商品金额大于被换商品可换金额，不可更换',
              type: 'warning'
            })
            // 输入框爆红
            this.indexReg = index;
            this.classReg = 'goodsQty';

            this.boolMoney = true;

          } else {
            this.boolMoney = false;
            this.indexReg = '';
            this.classReg = '';
          }

        } else { // 未开启
          this.boolMoney = false;
          this.continued = false;
          if (num > this.shopSuit.itemBeanList[0].canChangAmtSum) { //大于可换金额时
            this.$confirm('所换商品金额已超过可换金额，确认强制换货', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true
            }).then(() => {
              this.continued = false;

              this.clickAddBarter();
            }).catch(() => {
              this.continued = true;
              this.$message({
                type: 'info',
                message: '取消强制换货'
              });
            })
          }

        }
      }
      ,
      //换货明细 里的合并行
      //columnIndex操作列
      /**
       * @param row 行
       * @param column 列
       * @param rowIndex 合并列
       * @param columnIndex 合并第几列
       * @returns {{rowspan: number, colspan: number}} 合并前列数 合并后列数
       */
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 8) {
          if (rowIndex % this.shopSuit.itemBeanList.length === 0) { //
            return {
              rowspan: this.shopSuit.itemBeanList.length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
      ,
      // 双击某一行时把数据复制到换货中
      dbMethods(row, column, event) {
        let pushRow = 0;
        this.replaceItemBeans.forEach(item => {// 判断当前双击行是否存在
          if (item.goodsId == row.goodsId) {
            pushRow++; // 存在++
          }
        });
        if (pushRow == 0) { // 不存在push
          this.replaceItemBeans.push(row);
        }
      }
      ,
      // 售后类型选择换货，点击复制商品
      copyShop(num) {
        if (num == 1) { // 订单商品点击（换货、补发）
          if (this.copyData.length == 0) {
            this.$message({
              message: '请选择所需复制的商品',
              type: 'warning'
            })
          } else {
            let arr = JSON.parse(JSON.stringify(this.copyData)); // 深拷贝
            let indexSave = []; // 存储重复的index
            arr.forEach((item, index) => { // 过滤重复的商品
              this.replaceItemBeans.forEach(item1 => {
                if (item.goodsId == item1.goodsId) {
                  indexSave.push(index);
                }
              });
            });
            arr.forEach((item, indexD) => { // 判断索引不存在在push
              if (indexSave.indexOf(indexD) == -1) {// item.canReturnAmt 可退金额为0不可换出
                item.goodsQty = item.applyReturnQty;
                this.replaceItemBeans.push(item);
              }
            })
          }
        } else { // 弹框确认选择 num == 2  copyShoe(2)
          if (this.copyData1.length == 0) {
            this.$message({
              message: '请选择所需复制的商品',
              type: 'warning'
            })
          } else {
            let arr = JSON.parse(JSON.stringify(this.copyData1)); // 深拷贝
            let indexSave = []; // 存储重复的index
            arr.forEach((item, index) => { // 过滤重复的商品
              this.replaceItemBeans.forEach(item1 => {
                if (item.goodsId == item1.goodsId) {
                  indexSave.push(index);
                }
              });
            });
            arr.forEach((item, indexD) => { // 判断索引不存在在push
              if (indexSave.indexOf(indexD) == -1) {// item.canReturnAmt 可退金额为0不可换出
                item.goodsQty = item.applyReturnQty;
                item.goodsSpec = item.specification;
                item.goodsBarCode = item.barCode;
                item.goodsImage = item.goodsImageBean.imageUrl;
                /* if(item.suitFlag){
                   item.goodsName = '[套]' + item.goodsName;
                 }*/
                this.replaceItemBeans.push(item);
              }
            })
          }
        }
      }
      ,
      // 删除换出的商品
      deleteShoe(index) {
        this.$confirm('确认要删除该商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.replaceItemBeans.splice(index, 1);
        }).catch(() => {

        })
      }
      ,
      // 额外退款金额
      realTime() {
        this.afterSaleBaseBean.otherRefundAmt = this.afterSaleBaseBean.otherRefundAmt.replace(/[^\.\d]/g, '');
        this.returnOut1();
      }
      ,
      // 额外退款金额失去焦点触发
      returnOut1() {
        if (this.afterSaleBaseBean.otherRefundAmt == 0) { // 不允许等于0
          this.afterSaleBaseBean.otherRefundAmt = ''
        }
        let num = 0;
        this.shopSuit.itemBeanList.forEach(item => {
          if (item.applyRefundAmt != '' && item.applyRefundAmt != undefined) { // 过滤没有输入的
            num += item.applyRefundAmt * 1; // 申请总金额
          }
        });
        this.afterSaleBaseBean.otherRefundAmt = returnFloat1(this.afterSaleBaseBean.otherRefundAmt);
        this.afterSaleBaseBean.totalRefundAmt = returnFloat1(this.afterSaleBaseBean.otherRefundAmt * 1 + num); // 额外退款金额加申请总金额
      }
      ,
      // 额外退款金额失去焦点触发
      returnOut() {
        if (this.afterSaleBaseBean.otherRefundAmt == 0) {// 不允许等于0
          this.afterSaleBaseBean.otherRefundAmt = ''
        }
        let num = 0;
        this.shopSuit.itemBeanList.forEach(item => {
          if (item.applyRefundAmt != '' && item.applyRefundAmt != undefined) {// 过滤没有输入的
            num += item.applyRefundAmt * 1; // 申请总金额
          }
        });
        this.afterSaleBaseBean.otherRefundAmt = returnFloat(this.afterSaleBaseBean.otherRefundAmt);
        this.afterSaleBaseBean.totalRefundAmt = returnFloat1(this.afterSaleBaseBean.otherRefundAmt * 1 + num); // 额外退款金额加申请总金额
      }
      ,
      // 售后类型改变触发
      changeTable() {
        this.replaceItemBeans = [];
        this.shopQuery(); //订单售后明细
        this.indexReg = 'ab'; // input框复原
        this.classReg = '';
        //console.log(this.itemBeanList);
        /*if(this.afterSaleBaseBean.asType == 2){ // 仅退款时可退金额为0的过滤掉，申请可退数量清空
          this.shopSuit.itemBeanList.forEach( (item,index) => {
            item.applyReturnQty = '';
            if(item.canReturnAmt == 0){// itemBeanList
              this.shopSuit.itemBeanList.splice(index,1)
            }
          })
        }else{ // 退货退款时可退金额为0的可以申请
          this.shopQuery();
        }*/
      }
      ,

      // 创建新售后单弹框里的知道了
      knowClose() {
        this.dialogVisible3 = false; // 关闭成功弹框
        this.repetition = false; // 重复点击取消
        this.$emit('changeShow', {childrenShow: 19, isRefresh: true});// 返回售后处理页面
      }
      ,
      // 商品明细里input框失去焦点校验
      oneSuit(row, index, num) {
        if (num == 2) { // 申请退款金额失去焦点触发
          if (row.applyRefundAmt != '' && row.applyRefundAmt != undefined) {
            if (row.applyRefundAmt * 1 > row.canReturnAmt) {
              row.applyRefundAmt = returnFloat(row.canReturnAmt)
            } else {
              row.applyRefundAmt = returnFloat(row.applyRefundAmt)
            }
            this.returnOut(); // 计算出退款总金额
          }
        } else if (num == 1) { // 可退数量失去焦点触发
          if (row.applyReturnQty == 0) {
            row.applyReturnQty = '';
          } else {
            if (row.applyReturnQty != '' && row.applyReturnQty != undefined) {
              if (row.applyReturnQty * 1 > row.canReturnQty) {
                row.applyReturnQty = row.canReturnQty;
              }
            }
          }
        }
        if (!row.fromItemId && row.suitFlag) { // 当前失去焦点的是套装
          if (!row.applyReturnQty && !row.applyRefundAmt && (index != (this.shopSuit.itemBeanList.length - 1))) {
            if (row.suitFlag && this.shopSuit.itemBeanList[index + 1].openSuit) {
              row.suitDetailBeanList.forEach(item => {
                item.disabled = false;
              })
            }
          } else {
            if (index != (this.shopSuit.itemBeanList.length - 1)) {
              if (row.suitFlag && this.shopSuit.itemBeanList[index + 1].openSuit) {
                row.suitDetailBeanList.forEach(item => {
                  item.disabled = true;
                })
              }
            }

          }
        } else if (row.suitFlag == undefined) { // // 当前失去焦点的是套装单品
          if ((row.applyReturnQty == '' || row.applyReturnQty == undefined) && (row.applyRefundAmt == '' || row.applyRefundAmt == undefined)) {//没值的情况下恢复
            this.shopSuit.itemBeanList.forEach(item => {
              if (item.orderItemId == row.fromItemId) {
                item.disabled = false;
              }
            })
          } else { //有值的情况下把套装置灰不可输入
            this.shopSuit.itemBeanList.forEach(item => {
              if (item.orderItemId == row.fromItemId) {
                item.disabled = true;
              }
            })
          }

        }
      }
      ,
      // 商品明细里的删除
      delAll(row, index) {
        this.$confirm('确认删除该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          if (row.fromItemId == undefined) {
            if (index + 1 < this.shopSuit.itemBeanList.length) { // 确保不是最后一个数据
              if (this.shopSuit.itemBeanList[index + 1].openSuit == true && row.suitFlag == true) { // 判断当前套装是否有单品展开，否则套装下的单品全删掉
                this.shopSuit.itemBeanList.splice(index + 1, row.suitDetailBeanList.length);
              }
            }

            this.shopSuit.itemBeanList.splice(index, 1);
          } else { // 删除的是套装单品
            if (row.disabled == true) { // 套装有值的情况下

            } else { // 套装没值的情况下
              let length = 0;
              let indexNow = '';
              this.shopSuit.itemBeanList.forEach((item, i) => {
                if (row.fromItemId == item.orderItemId) {
                  indexNow = i;
                  item.suitDetailBeanList.forEach((item1, j) => {
                    if (this.shopSuit.itemBeanList[i + 1].openSuit == true && this.shopSuit.itemBeanList[i + 1].fromItemId != undefined) {
                      length++;
                    }
                  })
                }
              });
              this.$nextTick(() => {
                this.shopSuit.itemBeanList.splice(index, 1);
              });
              if (length > 0) { // length包括当前删除的，应该减去1
                length = length - 1;
              }
              if (length == 0) { // 如果为0，说明下面没有套装单品，不需要校验有没有值，直接把套装禁用打开
                this.shopSuit.itemBeanList[indexNow].disabled = false;
              } else { // 校验套装单品有没有值，把套装禁用打开/关闭
                for (var i = 0; i < length; i++) {
                  if ((this.shopSuit.itemBeanList[indexNow + 1].applyReturnQty == '' || this.shopSuit.itemBeanList[indexNow + 1].applyReturnQty == undefined) && (this.shopSuit.itemBeanList[indexNow + 1].applyRefundAmt == '' || this.shopSuit.itemBeanList[indexNow + 1].applyRefundAmt == undefined)) {
                    this.shopSuit.itemBeanList[indexNow].disabled = false;
                  } else {
                    this.shopSuit.itemBeanList[indexNow].disabled = true;
                  }

                }
              }
            }

          }
        }).catch(() => {
          /* this.$message({
                  type: 'info',
                  message: '已取消启用'
                })*/
        })
      }
      ,
      // 点击表格行触发
      handleCurrentChange(row) {
        /* let index = '';
         this.shopSuit.itemBeanList.forEach((item,i) => {
           if(item.orderItemId == row.orderItemId){
             index = i;
           }
         });
         if(index+1 < this.shopSuit.itemBeanList.length){ // 判断当前套装是否展开，如果展开则关闭
           if(this.shopSuit.itemBeanList[index+1].openSuit){
             this.shopSuit.itemBeanList.splice(index+1,row.suitDetailBeanList.length);
             return;
           }
         }
         // 如果当前有套装就展开
         if(row.suitDetailBeanList){
           row.suitDetailBeanList.forEach((item,j) => {
             item.openSuit = true;
             this.shopSuit.itemBeanList.splice(index+j+1, 0, item);
           })
         }*/
        //this.shopSuit.itemBeanList

      }
      ,
      // 点击套装显示
      addSuit(row, index) {
        if (index + 1 < this.shopSuit.itemBeanList.length) { // 判断当前套装是否展开，如果展开则关闭
          if (this.shopSuit.itemBeanList[index + 1].openSuit) {
            this.shopSuit.itemBeanList.splice(index + 1, row.suitDetailBeanList.length);
            return;
          }
        }

        // 如果当前有套装就展开
        if (row.suitDetailBeanList) {
          row.suitDetailBeanList.forEach((item, i) => {
            item.openSuit = true;
            this.shopSuit.itemBeanList.splice(index + i + 1, 0, item);
            this.shopSuit.itemBeanList[index + i + 1].salesPrice = item.skuPrice; // 套装单品售价复字段复制
          })
          let isExit = false;
          if (row.suitFlag && row.giftFlag) { //是套装也是赠品
            isExit = true
          }
          if (row.suitFlag) {  //只是套装
            isExit = true
          }
          if (row.applyReturnQty && isExit) { //当前为套装并且填写申请可退数量
            if (row.suitDetailBeanList) {
              row.suitDetailBeanList.forEach(item => {
                item.Disable = true;

              })
            }
          } else if (!row.applyReturnQty && isExit) {
            if (row.suitDetailBeanList) {
              row.suitDetailBeanList.forEach(item => {
                item.Disable = false;

              })
            }

          }
        }


      }
      ,
      //保存退货原因/额外退货原因修改添加删除
      saveSales(num) {
        this.reasonAddList = [];
        if (num == 1) { // 问题原因
          if (this.list1.length > 0 && this.list1[this.list1.length - 1].returnName == '') {
            this.$message({
              message: '请输入问题原因',
              type: 'warning'
            })
            return false
          }

          this.list1.forEach(item => { // 刚输入的存储
            if (!item.returnReasonId) { // 没有ID说明刚输入的
              this.reasonAddList.push(item.returnName)
            }
          });
          for (var i = 0; i < this.list1.length; i++) {
            for (var j = 0; j < this.list.length; j++) {
              if (this.list1[i].returnReasonId == this.list[j].returnReasonId && this.list1[i].returnName != this.list[j].returnName) {
                this.reasonChangeMap[this.list1[i].returnReasonId] = this.list1[i].returnName;
              }
            }
          }
          if (this.delIdList.length == 0 && this.reasonAddList.length == 0 && JSON.stringify(this.reasonChangeMap) == "{}") { // 没有修改没有添加没有删除不调接口
            return false;
          }
          let reasonChangeJson = {
            delIdList: this.delIdList,
            reasonAddList: this.reasonAddList,
            reasonChangeMap: this.reasonChangeMap,
          };
          //console.log(reasonChangeJson,555555555555);
          //return;
          this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/returnGoodsReasonChange', {reasonChangeJson: JSON.stringify(reasonChangeJson)})
            .then(res => {
              if (res.data.success) {
                this.dialogVisible = false;
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
        } else { // 额外退款原因
          if (this.outerList1.length > 0 && this.outerList1[this.outerList1.length - 1].otherRefundName == '') {
            this.$message({
              message: '请输入额外退款原因',
              type: 'warning'
            })
            return false
          }
          this.outerList1.forEach(item => {// 刚输入的存储
            if (!item.otherRefundReasonId) {
              this.reasonAddList.push(item.otherRefundName)
            }
          });
          for (var i = 0; i < this.outerList1.length; i++) {
            for (var j = 0; j < this.outerList.length; j++) {
              if (this.outerList1[i].otherRefundReasonId == this.outerList[j].otherRefundReasonId && this.outerList1[i].otherRefundName != this.outerList[j].otherRefundName) {
                this.reasonChangeMap[this.outerList1[i].otherRefundReasonId] = this.outerList1[i].otherRefundName;
              }
            }
          }
          if (this.delIdList.length == 0 && this.reasonAddList.length == 0 && JSON.stringify(this.reasonChangeMap) == "{}") { // 没有修改没有添加没有删除不调接口
            return false;
          }
          let reasonChangeJson = {
            delIdList: this.delIdList,
            reasonAddList: this.reasonAddList,
            reasonChangeMap: this.reasonChangeMap,
          };
          //console.log(reasonChangeJson,66666666);
          this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/otherRefundReasonChange', {reasonChangeJson: JSON.stringify(reasonChangeJson)})
            .then(res => {
              if (res.data.success) {
                this.dialogVisible1 = false;
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
        }


      }
      ,
      //刷新退货列表数据
      refreshData(num) {
        if (num == 1) {
          this.salesReturn(); // 退货原因列表
        } else { // num == 2
          this.salesReturnOuter(); // 额外退货列表
        }
      }
      ,
      // 返回售后处理页面
      backOne() {
        this.$emit('changeShow', {childrenShow: 19});
      }
      ,
      // 退货原因点击添加问题原因
      problemList(num) {
        // 清空之前添加存储的
        this.reasonAddList = [];
        this.delIdList = [];
        this.reasonChangeMap = {};
        if (num == 1) { // 退换补原因
          this.dialogVisible = true; // 弹框显示
          this.salesReturn(); // 退货列表
        } else {
          this.dialogVisible1 = true;// 弹框显示
          this.salesReturnOuter(); // 额外退货列表
        }

      }
      ,
      // 退货原因删除一条问题
      delList(row, index) {
        let jump = false;
        this.list1.forEach(item => { // 遍历当前数据是否有空，有空择不允许添加
          if (item.returnName == '') {
            jump = true;
          }
        });
        if (jump) {
          return false;
        }
        if (row.returnReasonId) { // 判断删除的是否是刚添加的，如果刚添加的不放进去
          this.delIdList.push(row.returnReasonId, row.returnName)
        }
        this.list1.forEach(item => { // 遍历当前数据都为不可编辑状态
          item.isShow = false;
        });
        this.list1.splice(index, 1);
      }
      ,
      // 退换补原因添加一条问题
      addList() {
        let jump = false;
        this.list1.forEach(item => { // 遍历当前数据是否有空，有空择不允许添加
          if (item.returnName == '') {
            jump = true;
          }
        });

        if (jump || this.list1.length >= 50) { // 最多添加50条
          return false;
        }
        this.list1.push({isShow: true, returnName: '', returnReasonId: ''}); // 显示input框
        this.indexDex = this.list1.length - 1;
      }
      ,
      // 退货原因点击某一条问题进行编辑
      exitList(row, index) {
        let jump = false;
        this.list1.forEach(item => { // 遍历当前数据是否有空，有空择不允许编辑
          if (item.returnName == '') {
            jump = true;
          }
        });

        if (jump) {
          return false;
        }
        this.indexDex = index;
        row.isShow = true;
        //this.reasonChangeMap[row.returnReasonId] = row.returnName;
      }
      ,
      // 额外退货删除一条问题
      delList1(row, index) {
        let jump = false;
        this.outerList1.forEach(item => { // 遍历当前数据是否有空，有空择不允许添加
          if (item.otherRefundName == '') {
            jump = true;
          }
        });

        if (jump) {
          return false;
        }
        if (row.otherRefundReasonId) { // 判断删除的是否是刚添加的，如果刚添加的不放进去
          this.delIdList.push(row.otherRefundReasonId, row.otherRefundName)
        }
        this.outerList1.forEach(item => { // 遍历当前数据都为不可编辑状态
          item.isShow = false;
        });
        this.outerList1.splice(index, 1);
      }
      ,
      // 额外退货添加一条问题
      addList1() {
        let jump = false;
        this.outerList1.forEach(item => { // 遍历当前数据是否有空，有空择不允许添加
          if (item.otherRefundName == '') {
            jump = true;
          }
        });
        if (jump) {
          return false;
        }
        this.outerList1.push({isShow: true, otherRefundName: '', otherRefundReasonId: ''}); // 显示input框
        this.indexDex1 = this.outerList1.length - 1;
      }
      ,
      // 额外退货点击某一条问题进行编辑
      exitList1(row, index) {
        let jump = false;
        this.outerList1.forEach(item => { // 遍历当前数据是否有空，有空择不允许编辑
          if (item.otherRefundName == '') {
            jump = true;
          }
        });

        if (jump) {
          return false;
        }
        this.indexDex1 = index;
        row.isShow = true;
        //this.reasonChangeMap[row.returnReasonId] = row.returnName;
      }
    }
    ,
    created() {
      //console.log(this.obj,789456123);
      setTimeout(() => {
        this.afterSaleBaseBean.orderType = this.obj.orderType;// 原始订单类型
        if (this.obj.replaceSourceOrderNo) {
          this.afterSaleBaseBean.replaceSourceOrderNo = this.obj.replaceSourceOrderNo; //换补订单原订单号
        }
        if (this.obj.orderType == 3) { // 换货
          this.afterSaleBaseBean.asType = 3;
        } else if (this.obj.orderType == 4) { // 补发
          this.afterSaleBaseBean.asType = 4;
        } else {
          /*if(this.obj.isAdd){
            this.afterSaleBaseBean.asType = 4;
          }else{*/
          this.afterSaleBaseBean.asType = 1;
          /*}*/

        }
      }, 1);
      this.proCityAreaValue = [this.obj.provinceRegionId + '', this.obj.cityRegionId + '', this.obj.areaRegionId + '', this.obj.townRegionId + '']; // 收货地址
      this.proCityAreaLabel = [this.obj.consigneeProvince, this.obj.consigneeCity, this.obj.consigneeArea, this.obj.consigneeTown]; // 收货地址label

      if (this.obj.consigneeContry) {
        this.afterSaleBaseBean.consigneeContry = this.obj.consigneeContry; // 国家
      }
      this.afterSaleBaseBean.shippingAddress = this.obj.shippingAddress; // 详细地址
      console.log(this.obj, 898989);
      this.getOrderSetting();

      // 商品的查询(弹框)
      this.queryShop = () => {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsFilter', this.findShop)
          .then(res => {
            if (res.data.success) {
              this.tableData1 = res.data.result.rows;
              this.totalNum1 = res.data.result.total;
              //this.tableData1[0].goodsName = '姜黄色羽绒服女短款2018冬装新款姜黄色羽绒服女短款2018冬装新款';
            }
          })
      };
      //自定义属性接口
      this._post('com.edb01.erp.ass.service.api.AfterAttributeDefineService/' + this.version + '/showList')
        .then(res => {
          res.data.result.forEach(item => {
            item.attributeValue = '';
            if (item.enabledFlag && item.attributeType === 1 && item.attributeValues) { // 每个自定义属性下的下拉字符串转成数组
              item.attributeValues = item.attributeValues.split(',');
            }
          });
          this.test = res.data.result;
        });
      // 判断当前处理状态
      if (this.sendStatus == 1) {
        this.afterSaleBaseBean.asType = '2';
      } else {
        this.afterSaleBaseBean.asType = '1';
      }
      //console.log(this.platNum,this.orderId,this.sendStatus,this.obj,789);
      // 退回快递查询
      this._post('com.edb01.erp.mdata.service.api.DtEcExpressService/' + this.version + '/list')
        .then(res => {
          if (res.data.success) {
            this.options = res.data.result;
          }
        });
      this.shopQuery = () => {
        // 订单可售后的明细查询
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getOrderItemData', {orderId: this.orderId})
          .then(res => {
            if (res.data.success) {
              //console.log(res.data.result.serviceMsg,'客服备注');
              res.data.result.itemBeanList.forEach(item => {
                item.applyReturnQty = '';
                if (!item.canReturnAmt || !item.canReturnQty) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
                if (item.suitFlag) {
                  item.suitDetailBeanList.forEach(item1 => {
                    item1.disabled = false;
                    item1.openSuit = false;
                  })
                }
              });

              //this.shopNum = this.shopNum.toFixed(2);
              res.data.result.itemBeanList[0].canChangAmtSum = '0.00'; // 可换金额默认为0
              this.shopSuit = res.data.result;
              if (this.shopSuit.serviceMsg == undefined) {
                this.shopSuit.serviceMsg = '';
              }

            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      };
      this.shopQuery();// 订单售后明细
      // 退货原因查询list
      this.salesReturn = () => {
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getReturnGoodsReasonList')
          .then(res => {
            if (res.data.success) {
              res.data.result.forEach(item => {
                item.isShow = false;
              });
              this.list = res.data.result;
              if (this.list.length) {
                this.afterSaleBaseBean.returnGoodsName = this.list[0].returnName;
              } else {
                this.afterSaleBaseBean.returnGoodsName = '';
              }
              this.list1 = JSON.parse(JSON.stringify(this.list));
            }
          })
      };
      this.salesReturn();//退货原因查询list
      // 额外退款原因列表查询 list
      this.salesReturnOuter = () => {
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getOtherRefundReasonList')
          .then(res => {
            if (res.data.success) {
              res.data.result.forEach(item => {
                item.isShow = false;
              });
              this.outerList = res.data.result;
              console.log(this.outerList, '12222');
              /* if(this.outerList.length) {
                 this.afterSaleBaseBean.otherRefundReasonName = this.outerList[0].otherRefundName;
               }else{
                 this.afterSaleBaseBean.otherRefundReasonName = '';
               }*/
              this.outerList1 = JSON.parse(JSON.stringify(this.outerList));
            }
          })
      };
      this.salesReturnOuter();
    }
    ,
    mounted() {
      if(this.obj.orderType == '5' && this.obj.payStatus == 2 && this.obj.orderStatus == 11 && this.obj.sendStatus == 1){
        setTimeout(()=>{
          this.afterSaleBaseBean.asType = 2;
          this.typeChand = true;
          this.typeChand3 = true;
        })
      }
      if(this.sendStatus == 1){
        setTimeout(()=>{
          this.afterSaleBaseBean.asType = 2;
        })
      }

      this.queryShop(); // 调用弹框数据
      // 监听自定义属性布局，小于1550显示3个，大于1920显示4个
      if (document.body.clientWidth < 1580) {
        this.spanCol = 8;
      } else {
        this.spanCol = 6;
      }
      window.onresize = () => {
        if (document.body.offsetWidth < 1550) {
          this.spanCol = 8;
        } else {
          this.spanCol = 6;
        }
      }
    }
    ,
  }
</script>
<style scoped>
  .styleColor, .el-input__inner {
    border: 1px solid red !important;
    border-radius: 5px;
  }

  .verifyC {
    color: #FF9153;
    font-size: 16px;
    margin-right: 3px;
  }

  .suitO {
    padding-left: 20px;
    font-size: 10px;
  }

  .hands {
    cursor: pointer;
    font-weight: bold;
  }

  #addAfterSale .footer {
    width: 100%;
    text-align: center;
    margin: 20px 0 10px 0;
  }

  #addAfterSale .background {
    background: #F2F2F2;
  }

  #addAfterSale .box {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #EAEAEC;
    cursor: pointer;
  }

  #addAfterSale .box span {
    display: inline-block;
    text-align: center;
  }

  #addAfterSale .box .span1, .span3 {
    width: 10%;
  }

  #addAfterSale .box .span2 {
    width: 78%;
  }

  #addAfterSale i {
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
  }

  #addAfterSale .title {
    font-weight: bold;
    border-left: 4px solid #409EFF;
    padding-left: 12px;
    margin: 30px 0;
    padding-top: 3px;
  }

  #addAfterSale .title span {
    font-size: 16px;
  }

  #addAfterSale .label-span {
    display: inline-block;
    width: 95px;
    text-align: right;
    font-size: 14px;
    color: #4A4A4A;
    margin-right: 5px;
  }

  #addAfterSale .box-detail {
    white-space: nowrap;
    height: 30px;
    line-height: 30px;
  }

  #addAfterSale .add {
    margin-left: 8px;
    font-size: 14px;
    color: #409EFF;
    cursor: pointer;
  }

  #addAfterSale .shop-detail {
    height: 25px;
    width: 60px;
    line-height: 25px;
    text-align: center;
    border: 1px solid #3B8EE5;
    color: #409EFF;
    margin-bottom: 7px;
  }

  #addAfterSale .shop-detail1 {
    display: inline-block;
    height: 25px;
    width: 90px;
    line-height: 25px;
    text-align: center;
    border: 1px solid #3B8EE5;
    color: #409EFF;
    margin-bottom: 7px;
  }

  #addAfterSale .shop-span {
    margin-left: 20px;
    color: #409EFF;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
<style>
  #addAfterSale #orderId .el-dialog__headerbtn .el-dialog__close {
    display: none;
  }

  #addAfterSale #orderId .el-dialog__header {
    border-bottom: 0 solid #eee;
  }

  #addAfterSale #shop-detail .el-input__inner {
    padding: 0 3px !important;
  }

  #addAfterSale .el-dialog__body {
    padding: 10px 20px !important;
  }

  /* #addAfterSale .el-dialog__header{
     text-align: left;
   }*/
</style>

