<!--添加售后单（可操作） 贾南风3-->
<template>
  <div id="addAfterSaleDetail">
    <div>
      <el-breadcrumb separator=">" style="margin-bottom: 10px">
        <el-breadcrumb-item @click.native="backOne">售后处理</el-breadcrumb-item>
        <el-breadcrumb-item>售后单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="title"><span>售后信息</span></div>
    <div style="padding-left: 10px">
      <div>
        <el-row :gutter="15">
          <el-col :span="9">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">售后类型</span>
                <el-radio
                  :disabled="afterSaleBaseBean.sendStatus==1 || exit != 2 || afterSaleBaseBean.asType==3 || afterSaleBaseBean.asType==4 || typeChand"
                  v-model="afterSaleBaseBean.asType" :label="1">退货退款
                </el-radio><!--:disabled="sendStatus==1"-->
                <el-radio v-model="afterSaleBaseBean.asType" :label="2"
                          :disabled=" exit != 2 || afterSaleBaseBean.asType==3 || afterSaleBaseBean.asType==4 || typeChand2">仅退款
                </el-radio>
                <el-radio v-model="afterSaleBaseBean.asType" :label="3"
                          :disabled="afterSaleBaseBean.asType==4 || afterSaleBaseBean.asType==1 || afterSaleBaseBean.asType==2 || typeChand">
                  换货
                </el-radio>
                <el-radio v-model="afterSaleBaseBean.asType" :label="4"
                          :disabled="afterSaleBaseBean.asType==3 || afterSaleBaseBean.asType==1 || afterSaleBaseBean.asType==2">
                  补发
                </el-radio>
              </div>
            </div>
          </el-col>
          <!--售后单号-->
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <span class="label-span"
                      v-if="(exit == 1 && afterSaleBaseBean.asType!=4) || exit == 2">售后单号：</span><span
                v-cloak>{{afterSaleBaseBean.afterSalesNo}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <span class="label-span">平台单号：</span>
                <span v-if="afterSaleBaseBean.replaceSourceOrderNo"> {{afterSaleBaseBean.replaceSourceOrderNo}}</span>
                <span v-else> {{afterSaleBaseBean.sourceOrderNo}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">退换补原因</span>
                <el-select v-model="afterSaleBaseBean.returnGoodsName" :disabled=" exit != 2" placeholder="请选择"
                           @click.native="refreshData(1)">
                  <el-option
                    v-for="item in list"
                    :key="item.returnName"
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
                  :disabled=" exit != 2"
                  v-model="afterSaleBaseBean.returnMsg"
                  :maxlength="200"
                  type="textarea"
                  style="width: 90%;height: 80px!important;"
                  placeholder="最多可输入200字">
                </el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15" v-if="afterSaleBaseBean.asType!=4">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">额外退款金额</span>
                <el-input style="width:100px" :disable="exit==2 || exit == 1" :maxlength="8"
                          v-model="afterSaleBaseBean.otherRefundAmt" @keyup.native="realTime"
                          @blur="returnOut()"></el-input>
                <span>元</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple-light">
              <div class="box-detail">
                <span class="label-span">退款总金额：</span><span>{{afterSaleBaseBean.totalRefundAmt}}元</span>
                <el-tooltip v-if="isReality" class="item" effect="dark" content="退款总金额为申请退款金额、额外退款金额的合计"
                            placement="right">
                  <i style="font-size: 14px;color:#FF8E4F" class="el-icon-warning"/>
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" content="退款总金额为实际退款金额、额外退款金额的合计" placement="right">
                  <i style="font-size: 14px;color:#FF8E4F" class="el-icon-warning"/>
                </el-tooltip>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <span class="label-span">额外退款原因</span>
                <el-select :disable="exit==2 || exit == 1" v-model="afterSaleBaseBean.otherRefundReasonName"
                           placeholder="请选择" @click.native="refreshData(2)">
                  <el-option
                    v-for="item in outerList"
                    :key="item.otherRefundName"
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
                <el-input style="width: 160px" :maxlength="100" :disable="exit==2 || exit == 1"
                          v-model="afterSaleBaseBean.otherRefundFlowNo"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15" v-if="afterSaleBaseBean.asType!=4">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class="box-detail">
                <!--<span class="verifyC" v-if="afterSaleBaseBean.asType!=2">*</span>-->
                <span class="label-span">退回快递</span>
                <el-select :disabled="afterSaleBaseBean.returnGoodsStatus==3 || afterSaleBaseBean.returnGoodsStatus==4"
                           v-model="afterSaleBaseBean.expressCoName" filterable placeholder="请选择" style="width: 160px;">
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
              <!--exit != 2-->
              <!--<span class="verifyC" v-if="afterSaleBaseBean.asType!=2">*</span>-->
              <div class="box-detail">
                <span class="label-span">退回快递单号</span>
                <el-input style="width: 160px"
                          :disabled="afterSaleBaseBean.returnGoodsStatus==3 || afterSaleBaseBean.returnGoodsStatus==4"
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
                  :disable="exit==2 || exit == 1"
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
                <span style="font-size: 14px">{{afterSaleBaseBean.serviceMsg}}</span>
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
          <el-col :span="spanCol" v-for="(item,index) in test" v-if="item.attributeType != 3 && item.enabledFlag"
                  :key="index">
            <div class="grid-content bg-purple" style="position: relative">
              <div style="white-space: nowrap">
                <span style="width: 140px;font-size: 14px;text-align: right;display: inline-block">{{item.attributeName}}</span>
                <el-select v-if="item.attributeType == 1" clearable v-model="item.attributeValue" placeholder="请选择"
                           style="width: 180px!important;">
                  <el-option
                    v-for="item1 in item.attributeValues"
                    :key="item1"
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
        <el-row v-for="(item,index) in test" v-if="item.enabledFlag && item.attributeType == 3" :key="index"><!-- -->
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
          <el-col :span="24" v-if="afterSaleBaseBean.dealStatus == 1">
            <div style="margin-bottom: 15px">
              <span class="label-span">收货地址：</span>
              <prov-city-area style="display:inline-block;" @channelArea="channelArea"
                              :proCityAreaValue="proCityAreaValue"
                              :proCityAreaLabel="proCityAreaLabel"></prov-city-area>
              <el-input maxlength="100" v-model="afterSaleBaseBean.shippingAddress" style="width: 300px;"></el-input>

              <span class="label-span">收货人：</span>
              <el-input maxlength="100" v-model="afterSaleBaseBean.receiver" placeholder="请填写姓名"
                        style="width:150px;"></el-input>
              <el-input maxlength="100" v-model="afterSaleBaseBean.mobile" placeholder="请填写手机"
                        style="width: 190px;"></el-input>

              <el-input maxlength="100" v-model="afterSaleBaseBean.phone" placeholder="请填写电话"
                        style="width: 190px;"></el-input>
            </div>
          </el-col>
          <el-col :span="24" v-else>
            <div style="margin-bottom: 15px">
              <span class="label-span">收货地址：</span>
              <el-input v-model="afterSaleBaseBean.consigneeProvince" style="width: 120px" :disabled="true"></el-input>
              <el-input v-model="afterSaleBaseBean.consigneeCity" style="width: 120px" :disabled="true"></el-input>
              <el-input v-if="afterSaleBaseBean.consigneeArea" v-model="afterSaleBaseBean.consigneeArea"
                        style="width: 120px" :disabled="true"></el-input>
              <el-input v-if="afterSaleBaseBean.consigneeTown" v-model="afterSaleBaseBean.consigneeTown"
                        style="width: 120px" :disabled="true"></el-input>
              <el-input maxlength="100" :disabled="true" v-model="afterSaleBaseBean.shippingAddress"
                        style="width: 300px;"></el-input>

              <span class="label-span">收货人：</span>
              <el-input maxlength="100" v-model="afterSaleBaseBean.receiver" placeholder="请填写姓名"
                        style="width:150px;" :disabled="true"></el-input>
              <el-input maxlength="100" v-model="afterSaleBaseBean.mobile" placeholder="请填写手机"
                        style="width: 190px;" :disabled="true"></el-input>

              <el-input maxlength="100" v-model="afterSaleBaseBean.phone" placeholder="请填写电话"
                        style="width: 190px;" :disabled="true"></el-input>
            </div>


          </el-col>
        </el-row>
      </div>
      <!--商品明细-->
      <div v-if="afterSaleBaseBean.itemBeanList && (afterSaleBaseBean.asType == 1 || afterSaleBaseBean.asType == 2)">
        <div v-if="!isShop">
          <span class="shop-detail">商品明细</span>
          <span class="shop-detail2" style="border-left: 1px solid #3B8EE5;" @click="isShop=true">入库明细</span>
        </div>
        <div v-else>
          <span class="shop-detail2" style="border-right: 1px solid #3B8EE5;" @click="isShop=false">商品明细</span>
          <span class="shop-detail">入库明细</span>
        </div>
        <div style="border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;margin:10px 0 25px 6px"
             id="shop-detail" v-show="!isShop">
          <el-table
            :data="afterSaleBaseBean.itemBeanList"
            @current-change="handleCurrentChange"
            style="width: 100%">
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
              :show-overflow-tooltip="true"
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
              prop="turnoverAmt"
              label="成交金额">
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
              v-if="exit==2"
              align="center"
              prop="canReturnQty"
              label="可退数量">
            </el-table-column>
            <el-table-column
              v-if="exit==2"
              align="center"
              prop="canReturnAmt"
              label="可退金额">
            </el-table-column>
            <el-table-column
              align="center"
              min-width="105"
              label="申请退换补数量">
              <template slot-scope="scope">
                <el-input style="width: 80px" :disabled="(!scope.row.giftFlag && scope.row.dealPrice == 0 && scope.row.canReturnAmt > 0) ||(scope.row.fromItemId && scope.row.Disable)
                || (scope.row.suitFlag && scope.row.Disable2) ||(!scope.row.suitFlag && !scope.row.giftFlag && !scope.row.fromItemId && !scope.row.originalBarCode && scope.row.dealPrice != 0) && scope.row.canReturnAmt == 0 || scope.row.canReturnQty == 0 ||
                 (scope.row.suitFlag && scope.row.dealPrice != 0 && scope.row.canReturnQty==0) || (scope.row.giftFlag && scope.row.canReturnQty == 0) || dealStatus==2 || (sourceOrderType == 1 && !scope.row.giftFlag && scope.row.dealPrice == 0) ||
                (sourceOrderType == 1 && scope.row.giftFlag)" v-model="scope.row.applyReturnQty"
                          @keyup.native="returnNumber(scope.row,scope.$index)"
                          :class="{styleColor:indexReg == scope.$index && classReg == 'applyReturnQty'}"
                          @blur="returnNumber(scope.row,scope.$index)"></el-input>
                <!--  <div v-if="scope.row.turnoverAmt == 0">
                    <el-input style="width: 80px" :disabled="!scope.row.giftFlag && scope.row.canReturnQty == 0 && scope.row.canReturnAmt == 0" v-model="scope.row.applyReturnQty"
                              @keyup.native="returnNumber(scope.row,scope.$index)"
                              :class="{styleColor:indexReg == scope.$index && classReg == 'applyReturnQty'}"
                              @blur="returnNumber(scope.row,scope.$index)"></el-input>&lt;!&ndash;@blur="oneSuit(scope.row,scope.$index,1)"&ndash;&gt;
                  </div>
                  <div v-else>
                    <el-input style="width: 80px" :disabled="!scope.row.giftFlag && (scope.row.disabled || (!scope.row.canReturnAmt || !scope.row.canReturnQty))" v-model="scope.row.applyReturnQty"
                              @keyup.native="returnNumber(scope.row,scope.$index)"
                              :class="{styleColor:indexReg == scope.$index && classReg == 'applyReturnQty'}"
                              @blur="returnNumber(scope.row,scope.$index)"></el-input>&lt;!&ndash;@blur="oneSuit(scope.row,scope.$index,1)"&ndash;&gt;
                  </div>-->
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              min-width="105"
              label="申请退款金额">
              <template slot-scope="scope">
                <el-input style="width: 60px" :disabled="!scope.row.giftFlag && (scope.row.disabled || (!scope.row.canReturnAmt || !scope.row.canReturnQty)) ||
                (scope.row.suitFlag && scope.row.dealPrice != 0 && scope.row.canReturnAmt==0) || (scope.row.dealPrice ==0 && scope.row.canReturnAmt ==0) || dealStatus==2 || sourceOrderType == 1"
                          v-model="scope.row.applyRefundAmt"
                          :class="{styleColor:indexReg == scope.$index && classReg == 'applyRefundAmt'}"
                          @blur="oneSuit(scope.row,scope.$index,2)"
                          @keyup.native="scope.row.applyRefundAmt = scope.row.applyRefundAmt.replace(/[^\.\d]/g,'')"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="batchNo"
              label="批次号">
            </el-table-column>
            <el-table-column
              v-if="exit !=1"
              align="center"
              width="50"
              label="操作">
              <template slot-scope="scope">
                <span style="color:#DA384C;cursor: pointer" v-if="afterSaleBaseBean.itemBeanList.length != 1"
                      @click="delAll(scope.row,scope.$index)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin:10px 0  25px 6px;border-bottom: 1px solid #EBEEF5" v-show="isShop">
          <!--border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;-->
          <el-table
            :data="afterSaleBaseBean.inStorageItemBeanList"
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
                <div>
                  <img :src="scope.row.goodsImage"
                       style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                </div>
              </template>
            </el-table-column>
            <!--<span :class="{hands: scope.row.suitFlag}"@click="addSuit(scope.row,scope.$index)">{{scope.row.goodsName}}</span>-->
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
            <!--<el-table-column
              align="center"
              prop="failQty"
              label="不合格数量">
            </el-table-column>-->
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
      <!--换货商品明细（换货）-->
      <div v-if="afterSaleBaseBean.asType == 3">
        <div v-if="afterSaleBaseBean.asType == 3 && isBarter == 1">
          <span class="shop-detail" @click="cutPage(1)" style="width: 85px">换货商品明细</span>
          <span class="shop-detail2" @click="cutPage(2)" style="border-left: 1px solid #3B8EE5;">入库明细</span>
          <span class="shop-detail2" @click="cutPage(3)" style="border-left: none">换出明细</span>
          <span class="shop-span" @click="copyShop(1)">复制商品</span>
        </div>

        <div v-if="afterSaleBaseBean.asType == 3 && isBarter == 2">
          <span class="shop-detail2" @click="cutPage(1)" style="width: 85px">换货商品明细</span>
          <span class="shop-detail" @click="cutPage(2)" style="border-left: 1px solid #3B8EE5;">入库明细</span>
          <span class="shop-detail2" @click="cutPage(3)" style="border-left: none">换出明细</span>
          <span class="shop-span" @click="copyShop(1)">复制商品</span>
        </div>
        <div v-if="afterSaleBaseBean.asType == 3 && isBarter == 3">
          <span class="shop-detail2" @click="cutPage(1)" style="width: 85px">换货商品明细</span>
          <span class="shop-detail2" @click="cutPage(2)">入库明细</span>
          <span class="shop-detail" @click="cutPage(3)">换出明细</span>
          <span class="shop-span" @click="copyShop(1)">复制商品</span>
        </div>
        <div style="margin:10px 0  25px 6px;border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;"
             id="shop-detail1" v-if="isBarter == 1">
          <el-table
            :data="afterSaleBaseBean.itemBeanList"
            :span-method="objectSpanMethod"
            @selection-change="handleSelectionChange"
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
              v-if="exit != 1"
              align="center"
              prop="canReturnQty"
              label="可换数量">
            </el-table-column>
            <el-table-column
              v-if="exit != 1"
              align="center"
              prop="canChangAmtSum"
              label="可换金额">
            </el-table-column>
            <el-table-column
              align="center"
              width="105"
              label="申请退换补数量">
              <template slot-scope="scope">
                <el-input style="width: 80px" :disabled="(!scope.row.giftFlag && scope.row.dealPrice == 0 && scope.row.canReturnAmt > 0) ||(scope.row.fromItemId && scope.row.Disable)
                || (scope.row.suitFlag && scope.row.Disable2) ||(!scope.row.suitFlag && !scope.row.giftFlag && !scope.row.fromItemId && !scope.row.originalBarCode && scope.row.dealPrice != 0) && scope.row.canReturnAmt == 0 || scope.row.canReturnQty == 0 ||
                 (scope.row.suitFlag && scope.row.dealPrice != 0 && scope.row.canReturnQty==0) ||  (scope.row.giftFlag && scope.row.canReturnQty == 0) || dealStatus==2 || sourceOrderType == 1"
                          v-model="scope.row.applyReturnQty"
                          @keyup.native="returnNumber(scope.row,scope.$index)"
                          :class="{styleColor:indexReg == scope.$index && classReg == 'applyReturnQty'}"
                          @blur="returnNumber(scope.row,scope.$index)"></el-input>
                <!--<div v-if="scope.row.turnoverAmt == 0">-->
                <!--<el-input style="width: 80px" :disabled="!scope.row.giftFlag && scope.row.canReturnQty == 0 && scope.row.canReturnAmt == 0" v-model="scope.row.applyReturnQty"-->
                <!--@keyup.native="returnNumber(scope.row,scope.$index)"-->
                <!--:class="{styleColor:indexReg == scope.$index && classReg == 'applyReturnQty'}"-->
                <!--@blur="returnNumber(scope.row,scope.$index)"></el-input>&lt;!&ndash;@blur="oneSuit(scope.row,scope.$index,1)"&ndash;&gt;-->
                <!--</div>-->
                <!--<div v-else>-->
                <!--<el-input style="width: 80px" :disabled="!scope.row.giftFlag && (scope.row.disabled || (!scope.row.canReturnAmt || !scope.row.canReturnQty))" v-model="scope.row.applyReturnQty"-->
                <!--@keyup.native="returnNumber(scope.row,scope.$index)"-->
                <!--:class="{styleColor:indexReg == scope.$index && classReg == 'applyReturnQty'}"-->
                <!--@blur="returnNumber(scope.row,scope.$index)"></el-input>&lt;!&ndash;@blur="oneSuit(scope.row,scope.$index,1)"&ndash;&gt;-->
                <!--</div>-->
              </template>
            </el-table-column>
            <!--7404bug-->
            <el-table-column
              align="center"
              prop="realReturnQty"
              label="实际退货数量">
            </el-table-column>
          </el-table>
        </div>

        <div style="margin:10px 0  25px 6px;border-bottom: 1px solid #EBEEF5" v-show="isBarter == 2">
          <!--border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;-->
          <el-table
            :data="afterSaleBaseBean.inStorageItemBeanList"
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
                  <img :src="scope.row.goodsImage"
                       style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                </div>
              </template>
            </el-table-column>
            <!--<span :class="{hands: scope.row.suitFlag}"@click="addSuit(scope.row,scope.$index)">{{scope.row.goodsName}}</span>-->
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
        <div style="margin:10px 0  25px 6px" id="shop-detail3" v-if="isBarter == 3">
          <!--border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;-->
          <el-table
            :data="afterSaleBaseBean.replaceItemBeanList"
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
      <!--换出商品明细（换货）-->
      <div v-show="afterSaleBaseBean.asType == 3">
        <div>
          <span class="shop-detail1">换出商品明细</span><span class="shop-span" @click="addX">添加换出明细</span>
        </div>
        <div style="border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;margin-bottom: 55px">
          <el-table
            :data="afterSaleBaseBean.replaceItemBeanList"
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
              label="换出商品数量">
              <template slot-scope="scope">
                <el-input style="width: 80px" :disabled="scope.row.disabled || exit == 1" v-model="scope.row.goodsQty"
                          @keyup.native="scope.row.goodsQty = scope.row.goodsQty.replace(/[^\d]/g,'');"
                          @blur="numReg(scope.row,scope.$index)"
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
            :data="afterSaleBaseBean.itemBeanList"
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
          <span class="shop-detail1">补发商品明细</span><span class="shop-span" @click="addH">添加补发商品</span>
        </div>
        <div style="border-right: 1px solid #EBEEF5;border-left: 1px solid #EBEEF5;margin-bottom: 55px">
          <el-table
            :data="afterSaleBaseBean.replaceItemBeanList"
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
              label="申请补发数量">
              <template slot-scope="scope">
                <el-input style="width: 80px" :disabled="exit == 1 || scope.row.disabled || afterSaleBaseBean.asType==2"
                          v-model="scope.row.goodsQty"
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
      <!--查询产品弹框-->
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
                width="180">
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
    <div class="title1"><span>操作日志</span></div>
    <div style="border-bottom: 1px solid #EBEEF5;margin-bottom: 60px">
      <public-Log2 :paramObj="paramObj"></public-Log2>
    </div>
    <div class="col-pagination">
      <div style="width: 100%;text-align: center;margin-top: 10px">
        <el-button @click="backOne">返回</el-button>
        <el-button type="primary" @click="clickAddAfter" :loading="repetition">修改</el-button>
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
            <li class="box" v-for="(item,index) in list1" :class="{background: index%2==1}" :key="index">
              <span class="span1">{{index + 1}}</span>
              <span class="span2" style="display: inline-block" @click="exitList(item,index)">
                <el-input v-if="indexDex == index && item.isShow == true"
                          @keyup.native="item.returnName=item.returnName.replace(/\s+/g,'')" v-model="item.returnName"
                          :maxlength="15" style="width: 300px;display: inline-block"></el-input>
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
                <el-input v-if="indexDex1 == index && item.isShow == true"
                          @keyup.native="item.otherRefundName=item.otherRefundName.replace(/\s+/g,'')"
                          v-model="item.otherRefundName" :maxlength="15"
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
  </div>
</template>
<script>
  import {returnFloat, returnFloat1, turnTimestamp} from '@/assets/js/validate';
  import PublicLog2 from '@/components/common/PublicLog2.vue';
  import ProvCityArea from '@/components/common/ProvCityArea.vue';

  export default {
    components: {
      PublicLog2,
      ProvCityArea
    },
    props: ['orderId', 'exit', 'refundStatus', 'dealStatus', 'sourceOrderType'],
    data() {
      return {
        paramObj: {
          moduleId: 57,
          billCode: this.orderId,
          typeId: ''
        },
        index2: '',
        proCityAreaValue: [], // 地址接受
        proCityAreaLabel: [],//地址接受label
        dialogVisible: false, // 问题原因弹框
        dialogVisible1: false, // 添加额外退款原因
        dialogVisible3: false, // 新售后单号
        dialogVisibleQuery: false, // 查询商品弹框
        isReality: true,// 是否显示实际退款金额
        options: [], // 退回快递
        indexDex: 'a', // 添加原因限制条数
        indexDex1: 'b', // 添加原因限制条数
        queryShop: () => {
        }, // 商品list
        salesReturn: () => {
        }, // 退货原因查询
        salesReturnOuter: () => {
        }, // 额外退货原因
        version: '1.0.0',
        isShop: false, // 切换商品明细和入库明细
        list: [], // 退货原因原来的数据
        list1: [], // 退货原因改变之后的数据
        outerList: [], // 额外退货原因原来的数据
        outerList1: [], // 额外退货原因改变之后的数据
        tableData: [],
        tableData1: [], // 弹框商品明细
        delIdList: [], //删除原因id列表
        isBarter: 1, // 换货
        bool: false, // 开启订单设置-限制换货商品参数
        boolMoney: false, //换出商品金额大于被换商品可换金额
        continued: false, // 是否继续
        repetition: false, //禁止重复提交
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
        reasonAddList: [],//新增原因列表
        reasonChangeMap: {},//原因修改列表：key:原因id，val：新原因
        newOrder: '', // 新订单
        indexReg: 'ab', // 商品明细的校验index
        classReg: '', // 商品明细的校验calss
        copyData: [],//选择要换货的商品
        replaceItemBeans: [], // 换货商品
        afterSaleBaseBean: {},// 修改数据
        spanCol: 6, // 占格数
        test: [], // 自定义属性
        typeChand:false,
        typeChand2:false
      }
    },
    watch: {
      afterSaleBaseBean(v) {
        let num = 0;
        let num2 = 0
        v.itemBeanList.forEach(item => {
          if (item.canReturnQty > 0 && item.canReturnAmt > 0) {
            num++
          }

          if (item.turnoverAmt == 0 && item.canReturnQty > 0) {
            num2++
          }

        })

//        if (num == 0) {        //可退金额和可退数量不满足同时大于0所以不能退货退款和换货
//          if(this.afterSaleBaseBean.asType == 1){
//            this.afterSaleBaseBean.asType = 2
//          }else if( this.afterSaleBaseBean.asType == 2){
//            this.afterSaleBaseBean.asType = 2
//          }else if( this.afterSaleBaseBean.asType == 4){
//            this.afterSaleBaseBean.asType = 4
//          }
//          this.typeChand = true;
//        }
//        ;

        if(num2 > 0){
//          this.typeChand = false;
          this.typeChand2 = true;
        }

      }

    },
    methods: {
      // 选择收货地址时触发方法
      channelArea(params) {
        console.log(params);
        this.areaParams = params;
        this.afterSaleBaseBean.provinceRegionId = params.proCityAreaValue[0];
        this.afterSaleBaseBean.cityRegionId = params.proCityAreaValue[1];//市id
        this.afterSaleBaseBean.consigneeProvince = params.proCityAreaLabel[0]; //收货人省份
        this.afterSaleBaseBean.consigneeCity = params.proCityAreaLabel[1]; //收货人市
        if (params.proCityAreaValue.length >= 3) {
          this.afterSaleBaseBean.areaRegionId = params.proCityAreaValue[2]; //区id
          this.afterSaleBaseBean.consigneeArea = params.proCityAreaLabel[2]; //收货人地区
          //console.log(123456);
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
      // 换出商品输入框校验
      numReg(row, index) {
        if (this.afterSaleBaseBean.replaceItemBeanList.length == 1 && this.afterSaleBaseBean.replaceItemBeanList[0].giftFlag) {// 如果换出商品有一个并且是赠品，则不校验
          return;
        }
        let num = 0; //
        //row.goodsQty = row.goodsQty.replace(/[^\d]/g,'');
        // 换出商品的总金额
        this.afterSaleBaseBean.replaceItemBeanList.forEach(item => {
          if (item.salesPrice && item.goodsQty) { // 售价为不为0  输入不为空
            num += (item.salesPrice * 1) * (item.goodsQty * 1);//换出商品数量*换出商品售价
          }
        });
        if (this.bool) { // 开启订单设置-限制换货商品参数
          if (num > this.afterSaleBaseBean.itemBeanList[0].canChangAmtSum) {
            this.$message({
              message: '换出商品金额大于被换商品可换金额，不可更换',
              type: 'warning'
            })
          }
        } else { // 未开启
          this.boolMoney = false;
          this.continued = false;
          if (num > this.afterSaleBaseBean.itemBeanList[0].canChangAmtSum) { //大于可换金额时
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
          } else {
            this.clickAddBarter();
          }

        }
      },
      // 换货的校验
      numSubmit() {
        if (this.afterSaleBaseBean.replaceItemBeanList.length == 1 && this.afterSaleBaseBean.replaceItemBeanList[0].giftFlag) {// 如果换出商品有一个并且是赠品，则不校验
          this.clickAddBarter();
        } else {
          let num = 0; //
          //row.goodsQty = row.goodsQty.replace(/[^\d]/g,'');
          // 换出商品的总金额
          this.afterSaleBaseBean.replaceItemBeanList.forEach(item => {
            if (item.salesPrice && item.goodsQty) { // 售价为不为0  输入不为空
              num += (item.salesPrice * 1) * (item.goodsQty * 1);//换出商品数量*换出商品售价
            }
          });
          if (this.bool) { // 开启订单设置-限制换货商品参数
            if (num > this.afterSaleBaseBean.itemBeanList[0].canChangAmtSum) {
              this.$message({
                message: '换出商品金额大于被换商品可换金额，不可更换',
                type: 'warning'
              })
            } else {
              this.clickAddBarter();
            }
          } else { // 未开启
            this.boolMoney = false;
            this.continued = false;
            if (num > this.afterSaleBaseBean.itemBeanList[0].canChangAmtSum) { //大于可换金额时
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
            } else {
              this.clickAddBarter();
            }

          }
        }
      },
      // 换货的 添加售后单
      clickAddBarter() {
        this.indexReg = 'a';
        let arr1 = [];
        let indexSave = [];
        if (this.afterSaleBaseBean.payTime) {

        } else {
          this.afterSaleBaseBean.payTime = '';
        }

        let reg = true;

        for (var i = 0; i < this.afterSaleBaseBean.itemBeanList.length; i++) {
          if (!(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty * 1) && this.afterSaleBaseBean.itemBeanList[i].canReturnAmt) {

          } else {
            reg = false;
          }
        }


        if (reg) {
          for (var i = 0; i < this.afterSaleBaseBean.itemBeanList.length; i++) {
            if (!(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty * 1) && this.afterSaleBaseBean.itemBeanList[i].canReturnAmt) {
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

        if (this.afterSaleBaseBean.replaceItemBeanList.length == 0) {
          this.$message({
            message: '请添加换出商品',
            type: 'warning'
          });
          return;
        }

        for (var j = 0; j < this.afterSaleBaseBean.replaceItemBeanList.length; j++) {
          if (!(this.afterSaleBaseBean.replaceItemBeanList[j].goodsQty * 1)) {
            this.classReg = 'goodsQty'; // 申请退款金额
            this.indexReg = j; // 申请退款金额
            this.$message({
              message: '请输入换出商品数量',
              type: 'warning'
            });
            return;
          }
        }
        // 没有填写的不传给后台
        this.afterSaleBaseBean.replaceItemBeanList.forEach((item, index) => {
          if (item.goodsQty) {
            indexSave.push(index)
          }
        });

        this.afterSaleBaseBean.replaceItemBeanList.forEach((item1, index1) => {
          if (indexSave.indexOf(index1) >= 0) {
            arr1.push(item1)
          }
        })


        if (this.afterSaleBaseBean.otherRefundAmt && !this.afterSaleBaseBean.otherRefundReasonName) {
          this.$message({
            message: '请选择额外退款原因',
            type: 'warning'
          });
          return;
        }
        if (this.areaParams.validatePass) {
          this.$message({
            message: this.areaParams.validatePass,
            type: 'warning'
          })
          return
        }

        if (!this.afterSaleBaseBean.shippingAddress) {
          this.$message({
            message: '请填写详细地址',
            type: 'warning'
          })
          return
        }
        if (!this.afterSaleBaseBean.otherRefundReasonName) {
          this.afterSaleBaseBean.otherRefundReasonName = '';
        }
        if (!this.afterSaleBaseBean.returnExpressNos) {
          this.afterSaleBaseBean.returnExpressNos = '';
        }
        if (!this.afterSaleBaseBean.returnGoodsName) {
          this.afterSaleBaseBean.returnGoodsName = '';
        }
        //申请退款总金额
        if (!this.afterSaleBaseBean.applyRefundAmt) {
          this.afterSaleBaseBean.applyRefundAmt = '';
        }
        //this.repetition = true;
        let data = {
          payTime: this.afterSaleBaseBean.payTime,
          afterSalesId: this.afterSaleBaseBean.afterSalesId,
          asType: this.afterSaleBaseBean.asType,
          returnGoodsName: this.afterSaleBaseBean.returnGoodsName,
          returnMsg: this.afterSaleBaseBean.returnMsg,
          applyRefundAmt: this.afterSaleBaseBean.applyRefundAmt,
          totalRefundAmt: this.afterSaleBaseBean.totalRefundAmt,
          otherRefundAmt: this.afterSaleBaseBean.otherRefundAmt,
          otherRefundReasonName: this.afterSaleBaseBean.otherRefundReasonName,
          otherRefundFlowNo: this.afterSaleBaseBean.otherRefundFlowNo,
          expressCoName: this.afterSaleBaseBean.expressCoName,
          afterMsg: this.afterSaleBaseBean.afterMsg,
          returnExpressNos: this.afterSaleBaseBean.returnExpressNos,
          attributeBeans: JSON.stringify(this.test),
          replaceItemBeans: JSON.stringify(arr1),
          provinceRegionId: this.afterSaleBaseBean.provinceRegionId,
          cityRegionId: this.afterSaleBaseBean.cityRegionId,
          areaRegionId: this.afterSaleBaseBean.areaRegionId,
          townRegionId: this.afterSaleBaseBean.townRegionId,
          consigneeProvince: this.afterSaleBaseBean.consigneeProvince,
          consigneeCity: this.afterSaleBaseBean.consigneeCity,
          consigneeArea: this.afterSaleBaseBean.consigneeArea,
          consigneeTown: this.afterSaleBaseBean.consigneeTown,
          shippingAddress: this.afterSaleBaseBean.shippingAddress, // 详细地址
          consigneeContry: this.afterSaleBaseBean.consigneeContry, // 国家
          mobile: this.afterSaleBaseBean.mobile, // 手机
          receiver: this.afterSaleBaseBean.receiver,// 收货人
          phone: this.afterSaleBaseBean.phone,

        };
        console.log(data);
        //return
        if (this.afterSaleBaseBean.asType == 3) { // 换货List校验
          let arr2 = [];
          this.afterSaleBaseBean.itemBeanList.forEach(item => {
            if (item.goodsQty) {
              arr2.push(item)
            }
          })

          data.itemBeans = JSON.stringify(arr2)
        } else {

          let arr = [];
          this.afterSaleBaseBean.itemBeanList.forEach(item => {
            if (!item.disabled && (item.applyReturnQty || item.applyRefundAmt)) {
              arr.push(item)
            }
          });
          data.itemBeans = JSON.stringify(arr)
        }
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/updateAfterSaleOrder', data)
          .then(res => {
            if (res.data.success) {
              this.repetition = false;
              this.$message({
                message: '修改成功',
                type: 'success'
              });

              this.$emit('changeShow', {childrenShow: 19, isRefresh: true}); // 返回订单处理并刷新
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
      clickAddAfter() {  //  exit == 2 未处理
        if (this.exit == 2 && this.afterSaleBaseBean.asType == 3) {
          //console.log(123);
          this.numSubmit();
        } else {
          this.indexReg = 'a';
          let arr1 = [];
          let indexSave = [];
          if (this.afterSaleBaseBean.payTime) {

          } else {
            this.afterSaleBaseBean.payTime = '';
          }
          if (this.afterSaleBaseBean.asType == 4) { // 补发验证

            if (this.afterSaleBaseBean.replaceItemBeanList.length == 0) {
              this.$message({
                message: '选择要补发的商品',
                type: 'warning'
              });
              return;
            }

            for (var i = 0; i < this.afterSaleBaseBean.replaceItemBeanList.length; i++) {
              if (!this.afterSaleBaseBean.replaceItemBeanList[i].goodsQty) {
                this.classReg = 'goodsQty'; // 申请补发数量
                this.indexReg = i; // 申请补发数量

                this.$message({
                  message: '请填写申请补发数量',
                  type: 'warning'
                });
                return;
              }

            }

            if (this.areaParams.validatePass) {
              this.$message({
                message: this.areaParams.validatePass,
                type: 'warning'
              })
              return
            }

            if (!this.afterSaleBaseBean.shippingAddress) {
              this.$message({
                message: '请填写详细地址',
                type: 'warning'
              })
              return
            }

            /* let orderN = 0; //订单明细中商品的订货数量-已申请补发数量
             let applyO = 0;
             this.afterSaleBaseBean.itemBeanList.forEach(item => {
               console.log(item.goodsQty,item.applyReissueQty);
               orderN += (item.goodsQty - item.applyReissueQty)*1;//订单明细中商品的订货数量-已申请补发数量
             });*/

            let compare = false;

            this.afterSaleBaseBean.replaceItemBeanList.forEach(item => { // 补发商品明细里申请补发数量
              this.afterSaleBaseBean.itemBeanList.forEach(item1 => {
                if (item.goodsId == item1.goodsId && item.goodsQty) {
                  if (item.goodsQty * 1 > (item1.goodsQty - item1.applyReissueQty) * 1) {
                    compare = true;
                  }
                }
              })
            });
            //console.log(applyO,orderN);
            if (compare) {
              this.$confirm('补发商品明细中含有超过可补发数量的商品确认强制生成售后单？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.repetition = true;
                let data = {
                  payTime: this.afterSaleBaseBean.payTime,
                  afterSalesId: this.afterSaleBaseBean.afterSalesId,
                  asType: this.afterSaleBaseBean.asType,
                  returnGoodsName: this.afterSaleBaseBean.returnGoodsName,
                  returnMsg: this.afterSaleBaseBean.returnMsg,
                  applyRefundAmt: this.afterSaleBaseBean.applyRefundAmt,
                  totalRefundAmt: this.afterSaleBaseBean.totalRefundAmt,
                  otherRefundAmt: this.afterSaleBaseBean.otherRefundAmt,
                  otherRefundReasonName: this.afterSaleBaseBean.otherRefundReasonName,
                  otherRefundFlowNo: this.afterSaleBaseBean.otherRefundFlowNo,
                  expressCoName: this.afterSaleBaseBean.expressCoName,
                  afterMsg: this.afterSaleBaseBean.afterMsg,
                  returnExpressNos: this.afterSaleBaseBean.returnExpressNos,
                  itemBeans: JSON.stringify(this.afterSaleBaseBean.itemBeanList),
                  attributeBeans: JSON.stringify(this.test),
                  replaceItemBeans: JSON.stringify(this.afterSaleBaseBean.replaceItemBeanList),
                  provinceRegionId: this.afterSaleBaseBean.provinceRegionId,
                  cityRegionId: this.afterSaleBaseBean.cityRegionId,
                  areaRegionId: this.afterSaleBaseBean.areaRegionId,
                  townRegionId: this.afterSaleBaseBean.townRegionId,
                  consigneeProvince: this.afterSaleBaseBean.consigneeProvince,
                  consigneeCity: this.afterSaleBaseBean.consigneeCity,
                  consigneeArea: this.afterSaleBaseBean.consigneeArea,
                  consigneeTown: this.afterSaleBaseBean.consigneeTown,
                  shippingAddress: this.afterSaleBaseBean.shippingAddress, // 详细地址
                  consigneeContry: this.afterSaleBaseBean.consigneeContry, // 国家
                  mobile: this.afterSaleBaseBean.mobile, // 手机
                  receiver: this.afterSaleBaseBean.receiver,// 收货人
                  phone: this.afterSaleBaseBean.phone
                };
                this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/updateAfterSaleOrder', data)
                  .then(res => {
                    if (res.data.success) {
                      this.repetition = false;
                      this.$message({
                        message: '修改成功',
                        type: 'success'
                      });

                      this.$emit('changeShow', {childrenShow: 19, isRefresh: true}); // 返回订单处理并刷新
                    } else {
                      this.repetition = false;
                      this.$message({
                        message: res.data.msg,
                        type: 'warning'
                      })
                    }
                  })

              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
              /* this.$confirm('补发商品明细中含有超过可补发数量的商品确认强制生成售后单？', '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 center: true
               }).then(() => {

               }).catch(() => {// 不生成售后单
               })*/
            } else {
              this.repetition = true;
              let data = {
                payTime: this.afterSaleBaseBean.payTime,
                afterSalesId: this.afterSaleBaseBean.afterSalesId,
                asType: this.afterSaleBaseBean.asType,
                returnGoodsName: this.afterSaleBaseBean.returnGoodsName,
                returnMsg: this.afterSaleBaseBean.returnMsg,
                applyRefundAmt: this.afterSaleBaseBean.applyRefundAmt,
                totalRefundAmt: this.afterSaleBaseBean.totalRefundAmt,
                otherRefundAmt: this.afterSaleBaseBean.otherRefundAmt,
                otherRefundReasonName: this.afterSaleBaseBean.otherRefundReasonName,
                otherRefundFlowNo: this.afterSaleBaseBean.otherRefundFlowNo,
                expressCoName: this.afterSaleBaseBean.expressCoName,
                afterMsg: this.afterSaleBaseBean.afterMsg,
                returnExpressNos: this.afterSaleBaseBean.returnExpressNos,
                itemBeans: JSON.stringify(this.afterSaleBaseBean.itemBeanList),
                attributeBeans: JSON.stringify(this.test),
                replaceItemBeans: JSON.stringify(this.afterSaleBaseBean.replaceItemBeanList),
                provinceRegionId: this.afterSaleBaseBean.provinceRegionId,
                cityRegionId: this.afterSaleBaseBean.cityRegionId,
                areaRegionId: this.afterSaleBaseBean.areaRegionId,
                townRegionId: this.afterSaleBaseBean.townRegionId,
                consigneeProvince: this.afterSaleBaseBean.consigneeProvince,
                consigneeCity: this.afterSaleBaseBean.consigneeCity,
                consigneeArea: this.afterSaleBaseBean.consigneeArea,
                consigneeTown: this.afterSaleBaseBean.consigneeTown,
                shippingAddress: this.afterSaleBaseBean.shippingAddress, // 详细地址
                consigneeContry: this.afterSaleBaseBean.consigneeContry, // 国家
                mobile: this.afterSaleBaseBean.mobile, // 手机
                receiver: this.afterSaleBaseBean.receiver,// 收货人
                phone: this.afterSaleBaseBean.phone
              };
              this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/updateAfterSaleOrder', data)
                .then(res => {
                  if (res.data.success) {
                    this.repetition = false;
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    });

                    this.$emit('changeShow', {childrenShow: 19, isRefresh: true}); // 返回订单处理并刷新
                  } else {
                    this.repetition = false;
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
            }
          } else {
            if (this.afterSaleBaseBean.asType == 3) { // 换货验证

              let reg = true;

              for (var i = 0; i < this.afterSaleBaseBean.itemBeanList.length; i++) {
                if (!(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty * 1) && this.afterSaleBaseBean.itemBeanList[i].canReturnAmt) {

                } else {
                  reg = false;
                }
              }

              if (reg) {
                for (var i = 0; i < this.afterSaleBaseBean.itemBeanList.length; i++) {
                  if (!(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty * 1) && this.afterSaleBaseBean.itemBeanList[i].canReturnAmt) {
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

              if (this.afterSaleBaseBean.replaceItemBeanList.length == 0) {
                this.$message({
                  message: '请添加换出商品',
                  type: 'warning'
                });
                return;
              }

              for (var j = 0; j < this.afterSaleBaseBean.replaceItemBeanList.length; j++) {
                if (!(this.afterSaleBaseBean.replaceItemBeanList[j].goodsQty * 1)) {
                  this.classReg = 'goodsQty'; // 申请退款金额
                  this.indexReg = j; // 申请退款金额
                  this.$message({
                    message: '请输入换出商品数量',
                    type: 'warning'
                  });
                  return;
                }
              }

              if (this.boolMoney) { // 大于可换金额时  开启
                this.$message({
                  message: '换出商品金额大于被换商品可换金额，不可更换',
                  type: 'warning'
                })
                return
              }
              if (this.continued) { // 大于可换金额时  未开启
                return;
              }

              // 没有填写的不传给后台
              this.afterSaleBaseBean.replaceItemBeanList.forEach((item, index) => {
                if (item.goodsQty) {
                  indexSave.push(index)
                }
              });

              this.afterSaleBaseBean.replaceItemBeanList.forEach((item1, index1) => {
                if (indexSave.indexOf(index1) >= 0) {
                  arr1.push(item1)
                }
              })


            }
            //console.log(this.afterSaleBaseBean.asType);
            if (this.afterSaleBaseBean.otherRefundAmt && !this.afterSaleBaseBean.otherRefundReasonName) {
              this.$message({
                message: '请选择额外退款原因',
                type: 'warning'
              });
              return;
            }
            /* if(this.afterSaleBaseBean.asType != 2 && this.afterSaleBaseBean.asType != 4){ // 仅退款不需要校验  补发
               if(this.afterSaleBaseBean.expressCoName == ''){
                 this.$message({
                   message: '请选择退回快递',
                   type: 'warning'
                 });
                 return;
               };
               if(this.afterSaleBaseBean.returnExpressNos == ''){
                 this.$message({
                   message: '请填写退回快递单号',
                   type: 'warning'
                 });
                 return;
               }
             }*/

            if (this.afterSaleBaseBean.asType == 1 || this.afterSaleBaseBean.asType == 2) { //退货退款  仅退款 校验
              let number = 0; // 数量
              let money = 0; // 金额
              this.afterSaleBaseBean.itemBeanList.forEach(item => {
                if (item.applyReturnQty) {
                  number += item.applyReturnQty;
                }
                if (item.applyRefundAmt) {
                  money += item.applyRefundAmt;
                }
              })

              for (var i = 0; i < this.afterSaleBaseBean.itemBeanList.length; i++) {
                if (this.afterSaleBaseBean.asType == 1) {
                  /*  if ((this.afterSaleBaseBean.itemBeanList[i].applyReturnQty * 1 == 0 && this.afterSaleBaseBean.itemBeanList[i].disabled == false) && (this.afterSaleBaseBean.itemBeanList[i].applyRefundAmt * 1 == 0 && this.shopSuit.itemBeanList[i].disabled == false && number == 0)) {
                      this.$message({
                        message: '申请退款金额和申请退货数量不能都为0',
                        type: 'warning'
                      });
                      return;
                    }*/

                  if (!(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty * 1) && number == 0) {
                    this.classReg = 'applyReturnQty'; // 申请退款金额
                    this.indexReg = i; // 申请退款金额
                    this.$message({
                      message: '请输入申请退换补数量',
                      type: 'warning'
                    });
                    return;
                  }
                  if (this.afterSaleBaseBean.itemBeanList[i].turnoverAmt == 0) {

                  } else {
                    if (!(this.afterSaleBaseBean.itemBeanList[i].applyRefundAmt * 1) && number != 0 && (this.afterSaleBaseBean.itemBeanList[i].applyReturnQty)) {
                      this.classReg = 'applyRefundAmt'; // 申请退款金额
                      this.indexReg = i; // 申请退款金额

                      this.$message({
                        message: '请输入申请退款金额',
                        type: 'warning'
                      });
                      return;
                    }
                  }
                } else {
                  if (!(this.afterSaleBaseBean.itemBeanList[i].applyRefundAmt * 1) && money == 0) {
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
              this.afterSaleBaseBean.applyRefundAmt = money; // 申请退款金额
              /*for (var i = 0; i < this.afterSaleBaseBean.itemBeanList.length; i++) {
                if((this.afterSaleBaseBean.itemBeanList[i].applyReturnQty*1 == 0 && this.afterSaleBaseBean.asType != 2) && this.afterSaleBaseBean.itemBeanList[i].applyRefundAmt*1 == 0){
                  this.$message({
                    message: '申请退款金额和申请退货数量不能都为0',
                    type: 'warning'
                  });
                  return;
                }
                // 申请退货数量 为0的时候
                if(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty*1 == 0 && this.afterSaleBaseBean.asType != 2){
                  if(!(this.afterSaleBaseBean.itemBeanList[i].applyRefundAmt*1) ){
                    this.classReg = 'applyRefundAmt'; // 申请退款金额
                    this.indexReg = i; // 申请退款金额
                    this.$message({
                      message: '请输入申请退款金额',
                      type: 'warning'
                    });
                    return;
                  }
                }else{
                  if(!(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty*1)  && this.afterSaleBaseBean.asType != 2){
                    this.classReg = 'applyReturnQty'; // 申请退款金额
                    this.indexReg = i; // 申请退款金额
                    this.$message({
                      message: '请输入申请退货数量',
                      type: 'warning'
                    });
                    return;
                  }
                }

                // 申请退款金额 为0的时候
                if(this.afterSaleBaseBean.itemBeanList[i].applyRefundAmt*1 == 0 ){
                  if(!(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty*1) && this.afterSaleBaseBean.asType != 2){
                    this.classReg = 'applyReturnQty'; // 申请退款金额
                    this.indexReg = i; // 申请退款金额
                    this.$message({
                      message: '请输入申请退货数量',
                      type: 'warning'
                    });
                    return;
                  }
                }else{
                  if(!(this.afterSaleBaseBean.itemBeanList[i].applyRefundAmt*1) && this.afterSaleBaseBean.itemBeanList[i].disabled == false){
                    this.classReg = 'applyRefundAmt'; // 申请退款金额
                    this.indexReg = i; // 申请退款金额
                    this.$message({
                      message: '请输入申请退款金额',
                      type: 'warning'
                    });
                    return;
                  }
                }
                //console.log(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty * 1,89898989);
                if(this.afterSaleBaseBean.itemBeanList[i].applyReturnQty*1 === '' && this.afterSaleBaseBean.asType != 2){
                  this.classReg = 'applyReturnQty'; // 申请退款金额
                  this.indexReg = i; // 申请退款金额
                  this.$message({
                    message: '请输入申请退货数量',
                    type: 'warning'
                  });
                  return;
                }
                if(this.afterSaleBaseBean.itemBeanList[i].applyRefundAmt*1 === ''){
                  this.classReg = 'applyRefundAmt'; // 申请退款金额
                  this.indexReg = i; // 申请退款金额
                  this.$message({
                    message: '请输入申请退款金额',
                    type: 'warning'
                  });
                  return;
                }
              }*/

            }

            if (!this.afterSaleBaseBean.otherRefundReasonName) {
              this.afterSaleBaseBean.otherRefundReasonName = '';
            }
            if (!this.afterSaleBaseBean.returnExpressNos) {
              this.afterSaleBaseBean.returnExpressNos = '';
            }
            if (!this.afterSaleBaseBean.returnGoodsName) {
              this.afterSaleBaseBean.returnGoodsName = '';
            }
            //申请退款总金额
            if (!this.afterSaleBaseBean.applyRefundAmt) {
              this.afterSaleBaseBean.applyRefundAmt = '';
            }
            this.repetition = true;
            let data = {
              payTime: this.afterSaleBaseBean.payTime,
              afterSalesId: this.afterSaleBaseBean.afterSalesId,
              asType: this.afterSaleBaseBean.asType,
              returnGoodsName: this.afterSaleBaseBean.returnGoodsName,
              returnMsg: this.afterSaleBaseBean.returnMsg,
              applyRefundAmt: this.afterSaleBaseBean.applyRefundAmt,
              totalRefundAmt: this.afterSaleBaseBean.totalRefundAmt,
              otherRefundAmt: this.afterSaleBaseBean.otherRefundAmt,
              otherRefundReasonName: this.afterSaleBaseBean.otherRefundReasonName,
              otherRefundFlowNo: this.afterSaleBaseBean.otherRefundFlowNo,
              expressCoName: this.afterSaleBaseBean.expressCoName,
              afterMsg: this.afterSaleBaseBean.afterMsg,
              returnExpressNos: this.afterSaleBaseBean.returnExpressNos,
              attributeBeans: JSON.stringify(this.test),
              replaceItemBeans: JSON.stringify(arr1),
              provinceRegionId: this.afterSaleBaseBean.provinceRegionId,
              cityRegionId: this.afterSaleBaseBean.cityRegionId,
              areaRegionId: this.afterSaleBaseBean.areaRegionId,
              townRegionId: this.afterSaleBaseBean.townRegionId,
              consigneeProvince: this.afterSaleBaseBean.consigneeProvince,
              consigneeCity: this.afterSaleBaseBean.consigneeCity,
              consigneeArea: this.afterSaleBaseBean.consigneeArea,
              consigneeTown: this.afterSaleBaseBean.consigneeTown,
              shippingAddress: this.afterSaleBaseBean.shippingAddress, // 详细地址
              consigneeContry: this.afterSaleBaseBean.consigneeContry, // 国家
              mobile: this.afterSaleBaseBean.mobile, // 手机
              receiver: this.afterSaleBaseBean.receiver,// 收货人
              phone: this.afterSaleBaseBean.phone
            };
            if (this.afterSaleBaseBean.asType == 3) { // 换货List校验
              let arr2 = [];
              this.afterSaleBaseBean.itemBeanList.forEach(item => {
                if (item.goodsQty) {
                  arr2.push(item)
                }
              })

              data.itemBeans = JSON.stringify(arr2)
            } else {
              let arr = [];
              this.afterSaleBaseBean.itemBeanList.forEach(item => {
                if (item.applyReturnQty || item.applyRefundAmt) {
                  arr.push(item)
                }
              });
              data.itemBeans = JSON.stringify(arr)
            }
            console.log(data, 'ceshi');
            //return
            this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/updateAfterSaleOrder', data)
              .then(res => {
                if (res.data.success) {
                  this.repetition = false;
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });

                  this.$emit('changeShow', {childrenShow: 19, isRefresh: true}); // 返回订单处理并刷新
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
      // 点击切换
      cutPage(num) {
        this.isBarter = num;
      },
      //换货明细 里的合并行
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 8) {
          if (rowIndex % 5 === 0) {
            return {
              rowspan: this.afterSaleBaseBean.itemBeanList.length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      // 申请退换补数量校验（换货）
      returnNumber(row, index) {
        row.applyReturnQty = row.applyReturnQty.replace(/[^\d]/g, '');
        if (row.applyReturnQty) { // 输入框有值
          if (row.applyReturnQty * 1 > row.canReturnQty && !row.giftFlag) { // 申请退货数量大于可退数量时，则输入框中直接展示可退数量最大值
            row.applyReturnQty = row.canReturnQty;
          } else if (row.applyReturnQty * 1 > row.canReturnQty && row.giftFlag) {
            row.applyReturnQty = row.canReturnQty;
          } else if (row.dealPrice == 0 && row.canReturnAmt == 0) {
            row.applyRefundAmt = 0;
          }
        } else {
          row.applyRefundAmt = ''
        }


        let num = 0;
        this.afterSaleBaseBean.itemBeanList.forEach(item => {
          if (item.applyReturnQty && item.salesPrice) {
            num += item.applyReturnQty * item.salesPrice;
          }
        })
        this.afterSaleBaseBean.itemBeanList[0].canChangAmtSum = num.toFixed(2);

        let obj = this.afterSaleBaseBean.itemBeanList[index];
        this.$set(this.afterSaleBaseBean.itemBeanList, index, obj);

        let isExit = false;
        if (this.afterSaleBaseBean.itemBeanList[index].suitFlag && this.afterSaleBaseBean.itemBeanList[index].giftFlag) { //是套装也是赠品
          isExit = true
        }
        if (this.afterSaleBaseBean.itemBeanList[index].suitFlag) {  //只是套装
          isExit = true
        }

        if (row.applyReturnQty && row.fromItemId) { //当前行为套单并且填写申请退货数量
          let arr = []
          for (var j = index; j >= 0; j--) {       //向上找如果遇到事套装就置灰它
            if (this.afterSaleBaseBean.itemBeanList[j].suitFlag) {
              this.afterSaleBaseBean.itemBeanList[j].suitDetailBeanList.forEach(item => {
                if (item.applyReturnQty) {
                  arr.push(item.applyReturnQty)
                }
              })
              if (arr.length > 0) {
                this.afterSaleBaseBean.itemBeanList[j].Disable2 = true
              }
              return
            }
          }
        } else if (!row.applyReturnQty && row.fromItemId) {
          let arr2 = []
          for (var j = index; j >= 0; j--) {       //向上找如果遇到事套装就置灰它
            if (this.afterSaleBaseBean.itemBeanList[j].suitFlag) {
              this.afterSaleBaseBean.itemBeanList[j].suitDetailBeanList.forEach(item => {
                if (item.applyReturnQty) {
                  arr.push(item.applyReturnQty)
                }
              })
              if (arr2.length == 0) {
                this.afterSaleBaseBean.itemBeanList[j].Disable2 = false
              }
              return
            }
          }
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

      },
      // 添加换出明细
      addX() {
        if (this.exit == 1) {
          return
        }
        this.queryShop();
        this.dialogVisibleQuery = true;
      },
      // 添加换出明细
      addH() {
        if (this.exit == 1) {
          return
        }
        this.queryShop();
        this.dialogVisibleQuery = true;
      },
      // 选择商品的确认选择按钮
      ChooseSure() {
        if (this.exit == 1) {
          return
        }
        this.dialogVisibleQuery = false;
        this.copyShop(2);
      },
      //  每页多少条
      handleCurrentChange1(val) {
        console.log(val);
        this.currentPage1 = val;
        this.findShop.page = this.currentPage1;
        this.findShop.size = this.totalPage1;
        this.queryShop();
      },
      handleSizeChange1(val) {
        console.log(val);
        this.totalPage1 = val;
        this.findShop.page = this.currentPage1;
        this.findShop.size = this.totalPage1;
        this.queryShop()// 请求数据
      },
      // shop checkbox 换货选择的商品明细（弹框）
      handleSelectionChange1(val) {
        console.log(val);
        this.copyData = val;
      },
      // 重置
      shopReset() {
        this.findShop.goodsCode = '';
        this.findShop.barCode = '';
        this.findShop.goodsName = '';
        this.findShop.goodsSpec = '';
      },
      // 删除换出的商品
      deleteShoe(index) {
        if (this.exit == 1) {
          return
        }

        this.$confirm('确认要删除该商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.afterSaleBaseBean.replaceItemBeanList.splice(index, 1);
        }).catch(() => {

        })

      },
      //是否开启订单设置-限制换货商品参数
      getOrderSetting() {
        this._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + this.version + '/query')
          .then(res => {
            if (res.data.success) {
              if (res.data.result) {
                this.bool = res.data.result.limitExchangeGoods;
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(function (error) {
          console.log(error);
        });
      },

      // 换货选择的商品明细
      handleSelectionChange(val) {
        console.log(val);
        this.copyData = val;
      },
      // 售后类型选择换货，点击复制商品
      copyShop(num) {
        if (this.exit == 1) {
          return
        }
        if (this.copyData.length == 0) {
          this.$message({
            message: '请选择所需复制的商品',
            type: 'warning'
          })
        } else {
          let arr = JSON.parse(JSON.stringify(this.copyData)); // 深拷贝
          let indexSave = []; // 存储重复的index
          arr.forEach((item, index) => { // 过滤重复的商品
            this.afterSaleBaseBean.replaceItemBeanList.forEach(item1 => {
              if (item.goodsId == item1.goodsId) {
                indexSave.push(index);
              }
            });
          });
          arr.forEach((item, indexD) => { // 判断索引不存在在push
            if (indexSave.indexOf(indexD) == -1) {// item.canReturnAmt 可退金额为0不可换出
              if (num == 1) {

              } else {
                item.goodsSpec = item.specification;
                item.goodsBarCode = item.barCode;
                item.goodsImage = item.goodsImageBean.imageUrl;

                /* if(item.suitFlag){
                   item.goodsName = '[套]' + item.goodsName;
                 }*/
              }
              this.afterSaleBaseBean.replaceItemBeanList.push(item);
            }
          })
        }

      },
      // 额外退款金额
      realTime() {
        this.afterSaleBaseBean.otherRefundAmt = this.afterSaleBaseBean.otherRefundAmt.replace(/[^\.\d]/g, '');
        this.returnOut1();
      },
      // 额外退款金额失去焦点触发
      returnOut1() {
        if (this.afterSaleBaseBean.otherRefundAmt == 0) {
          this.afterSaleBaseBean.otherRefundAmt = ''
        }
        let num = 0;
        this.afterSaleBaseBean.itemBeanList.forEach(item => {
          if (this.refundStatus == 3) { // 退款状态同意退款
            if (item.factRefundAmt) {
              num += item.factRefundAmt * 1; // 申请总金额
            }
          } else {
            if (item.applyRefundAmt) {
              num += item.applyRefundAmt * 1; // 申请总金额
            }
          }
        });
        this.afterSaleBaseBean.otherRefundAmt = returnFloat1(this.afterSaleBaseBean.otherRefundAmt);
        this.afterSaleBaseBean.totalRefundAmt = returnFloat1(this.afterSaleBaseBean.otherRefundAmt * 1 + num); // 额外退款金额加申请总金额
      },
      // 额外退款金额失去焦点触发
      returnOut() {
        if (!this.afterSaleBaseBean.otherRefundAmt || this.afterSaleBaseBean.otherRefundAmt == 0) {
          //console.log(123);
          this.afterSaleBaseBean.otherRefundAmt = '';
        }
        let num = 0;
        if (this.afterSaleBaseBean.itemBeanList) {
          this.afterSaleBaseBean.itemBeanList.forEach(item => {
            if (this.refundStatus == 3) { // 退款状态同意退款
              if (item.factRefundAmt) {
                num += item.factRefundAmt * 1; // 申请总金额
              }
            } else {
              if (item.applyRefundAmt) {
                num += item.applyRefundAmt * 1; // 申请总金额
              }
            }

          });
        }

        this.$nextTick(() => {
          this.afterSaleBaseBean.otherRefundAmt = returnFloat(this.afterSaleBaseBean.otherRefundAmt);
          this.afterSaleBaseBean.totalRefundAmt = returnFloat1(this.afterSaleBaseBean.otherRefundAmt * 1 + num); // 额外退款金额加申请总金额
        })

      },
      // 创建新售后单弹框里的知道了
      knowClose() {
        this.dialogVisible3 = false;
        this.$emit('changeShow', {childrenShow: 19, isRefresh: true});
      },
      // 商品明细里input框失去焦点校验
      oneSuit(row, index, num) {
        if (num == 2) { // 申请退款金额失去焦点触发
          console.log(row);
          if (row.applyRefundAmt != '' && row.applyRefundAmt != undefined) {
            // dealPrice 11 canReturnQty
            if (row.applyRefundAmt * 1 > row.canReturnAmt) {
              row.applyRefundAmt = returnFloat(row.canReturnAmt * 1)
            } else {
              row.applyRefundAmt = returnFloat(row.applyRefundAmt)
            }
            this.returnOut(); // 计算出退款总金额
          }
        } else if (num == 1) { // 可退数量失去焦点触发
          if (row.applyReturnQty != '' && row.applyReturnQty != undefined) {
            if (row.applyReturnQty > row.canReturnQty) {
              row.applyReturnQty = row.canReturnQty;
            }
          }

        }
        if (!row.fromItemId && row.suitFlag) { // 当前失去焦点的是套装
          if (!row.applyReturnQty && !row.applyRefundAmt && (index != (this.afterSaleBaseBean.itemBeanList.length - 1))) {
            if (row.suitFlag && this.afterSaleBaseBean.itemBeanList[index + 1].openSuit == true) {
              row.suitDetailBeanList.forEach(item => {
                item.disabled = false;
              })
            }
          } else {
            if (index != (this.afterSaleBaseBean.itemBeanList.length - 1)) {
              if (row.suitFlag && this.afterSaleBaseBean.itemBeanList[index + 1].openSuit == true) {
                row.suitDetailBeanList.forEach(item => {
                  item.disabled = true;
                })
              }
            }

          }
        } else if (row.suitFlag == undefined) { // // 当前失去焦点的是套装单品
          if (!row.applyReturnQty && !row.applyRefundAmt) {//没值的情况下恢复
            this.afterSaleBaseBean.itemBeanList.forEach(item => {
              if (item.orderItemId == row.fromItemId) {
                item.disabled = false;
              }
            })
          } else { //有值的情况下把套装置灰不可输入
            this.afterSaleBaseBean.itemBeanList.forEach(item => {
              if (item.orderItemId == row.fromItemId) {
                item.disabled = true;
              }
            })
          }

        }
      },
      // 商品明细里的删除
      delAll(row, index) {
        /* if(this.exit == 1){ //不允许编辑
           return;
         }*/
        if (row.fromItemId == undefined) {
          if (index + 1 < this.afterSaleBaseBean.itemBeanList.length) { // 确保不是最后一个数据
            if (this.afterSaleBaseBean.itemBeanList[index + 1].openSuit == true && row.suitFlag == true) { // 判断当前套装是否有单品展开，否则套装下的单品全删掉
              this.afterSaleBaseBean.itemBeanList.splice(index + 1, row.suitDetailBeanList.length);
            }
          }

          this.afterSaleBaseBean.itemBeanList.splice(index, 1);
        } else { // 删除的是套装单品
          if (row.disabled == true) { // 套装有值的情况下

          } else { // 套装没值的情况下
            let length = 0;
            let indexNow = '';
            this.afterSaleBaseBean.itemBeanList.forEach((item, i) => {
              if (row.fromItemId == item.orderItemId) {
                indexNow = i;
                item.suitDetailBeanList.forEach((item1, j) => {
                  if (this.afterSaleBaseBean.itemBeanList[i + 1].openSuit == true && this.afterSaleBaseBean.itemBeanList[i + 1].fromItemId != undefined) {
                    length++;
                  }
                })
              }
            });
            this.$nextTick(() => {
              this.afterSaleBaseBean.itemBeanList.splice(index, 1);
            })
            if (length > 0) { // length包括当前删除的，应该减去1
              length = length - 1;
            }
            if (length == 0) { // 如果为0，说明下面没有套装单品，不需要校验有没有值，直接把套装禁用打开
              this.afterSaleBaseBean.itemBeanList[indexNow].disabled = false;
            } else { // 校验套装单品有没有值，把套装禁用打开/关闭
              for (var i = 0; i < length; i++) {
                if (!this.afterSaleBaseBean.itemBeanList[indexNow + 1].applyReturnQty && !this.afterSaleBaseBean.itemBeanList[indexNow + 1].applyRefundAmt) {
                  this.afterSaleBaseBean.itemBeanList[indexNow].disabled = false;
                } else {
                  this.afterSaleBaseBean.itemBeanList[indexNow].disabled = true;
                }

              }
            }
          }

        }

      },
      // 点击表格行触发
      handleCurrentChange(row) {
        console.log(row);
      },
      /* // 点击套装显示 换货补发
       addSuit(row,index) {
         if(index+1 < this.shopSuit.itemBeanList.length){ // 判断当前套装是否展开，如果展开则关闭
           if(this.shopSuit.itemBeanList[index+1].openSuit){
             this.shopSuit.itemBeanList.splice(index+1,row.suitDetailBeanList.length);
             return;
           }
         }

         // 如果当前有套装就展开
         if(row.suitDetailBeanList){
           row.suitDetailBeanList.forEach((item,i) => {
             console.log(item);
             item.openSuit = true;
             this.shopSuit.itemBeanList.splice(index+i+1, 0, item);
           })
         }
       },*/

      // 点击套装显示 退货退款 仅退款
      addSuit(row, index) {
        if (index + 1 < this.afterSaleBaseBean.itemBeanList.length) { // 判断当前套装是否展开，如果展开则关闭
          if (this.afterSaleBaseBean.itemBeanList[index + 1].openSuit) {
            this.afterSaleBaseBean.itemBeanList.splice(index + 1, row.suitDetailBeanList.length);
            return;
          }
        }

        // 如果当前有套装就展开
        if (row.suitDetailBeanList) {
          row.suitDetailBeanList.forEach((item, i) => {
            item.openSuit = true;
            this.afterSaleBaseBean.itemBeanList.splice(index + i + 1, 0, item);
          })
        }
        let isExit = false;
        if (this.shopSuit.itemBeanList[index].suitFlag && this.shopSuit.itemBeanList[index].giftFlag) { //是套装也是赠品
          isExit = true
        }
        if (this.shopSuit.itemBeanList[index].suitFlag) {  //只是套装
          isExit = true
        }

        if (this.shopSuit.itemBeanList[index].applyReturnQty && this.shopSuit.itemBeanList[index].fromItemId) { //当前行为套单并且填写申请退货数量
          for (var j = index; j >= 0; j--) {       //向上找如果遇到事套装就置灰它
            if (this.shopSuit.itemBeanList[j].suitFlag) {
              this.shopSuit.itemBeanList[j].Disable2 = true;
              return
            }
          }
        } else if (!this.shopSuit.itemBeanList[index].applyReturnQty && this.shopSuit.itemBeanList[index].fromItemId) {
          for (var n = index; n >= 0; n--) {
            if (this.shopSuit.itemBeanList[n].suitFlag) {
              this.shopSuit.itemBeanList[n].Disable2 = false;
              return
            }
          }
        }


        if (this.shopSuit.itemBeanList[index].applyReturnQty && isExit) { //当前为套装并且填写申请可退数量
          for (var j = index; j < this.shopSuit.itemBeanList.length; j++) { //只能向下找到一个套单然后置灰它， 如果它下面还有套单解决的办法是。在列表中套单向上判断是否置灰
            if (!this.shopSuit.itemBeanList[j + 1].fromItemId || (!this.shopSuit.itemBeanList[j + 1].giftFlag && !this.shopSuit.itemBeanList[j + 1].fromItemId)) {
              let i = j
              let tim = setInterval(() => {
                this.shopSuit.itemBeanList[i--].Disable = true;
                if (this.shopSuit.itemBeanList[i].suitFlag || (this.shopSuit.itemBeanList[i].suitFlag && this.shopSuit.itemBeanList[i].giftFlag)) {
                  clearInterval(tim)
                }
              })
              return
            }
          }
        } else if (!this.shopSuit.itemBeanList[index].applyReturnQty && isExit) {
          for (var j = index; j < this.shopSuit.itemBeanList.length; j++) {
            if (!this.shopSuit.itemBeanList[j + 1].fromItemId || (!this.shopSuit.itemBeanList[j + 1].giftFlag && !this.shopSuit.itemBeanList[j + 1].fromItemId)) {
              let i = j
              let tim = setInterval(() => {
                this.shopSuit.itemBeanList[i--].Disable = false;
                if (this.shopSuit.itemBeanList[i].suitFlag || (this.shopSuit.itemBeanList[i].suitFlag && this.shopSuit.itemBeanList[i].giftFlag)) {
                  clearInterval(tim)
                }
              })
              return
            }
          }

        }

      },
      //保存退货原因/额外退货原因修改添加删除
      saveSales(num) {
        this.reasonAddList = [];
        if (num == 1) {
          if (this.list1.length > 0 && this.list1[this.list1.length - 1].returnName == '') {
            this.$message({
              message: '请输入问题原因',
              type: 'warning'
            })
            return false
          }

          this.list1.forEach(item => {
            if (!item.returnReasonId) {
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
          //console.log(reasonChangeJson);
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
        } else {

          if (this.outerList1.length > 0 && this.outerList1[this.outerList1.length - 1].otherRefundName == '') {
            this.$message({
              message: '请输入额外退款原因',
              type: 'warning'
            })
            return false
          }

          this.outerList1.forEach(item => {
            if (!item.otherRefundReasonId) {
              this.reasonAddList.push(item.otherRefundName)
            }
          })
          for (var i = 0; i < this.outerList1.length; i++) {
            for (var j = 0; j < this.outerList.length; j++) {
              if (this.outerList1[i].otherRefundReasonId == this.outerList[j].otherRefundReasonId && this.list1[i].otherRefundName != this.outerList[j].otherRefundName) {
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


      },
      //刷新退货列表数据
      refreshData(num) {
        if (num == 1) {
          this.salesReturn(); // 退货原因列表
        } else {
          this.salesReturnOuter(); // 额外退货列表
        }
      },
      // 返回售后处理页面
      backOne() {
        this.$emit('changeShow', {childrenShow: 19});
      },
      // 退货原因点击添加问题原因
      problemList(num) {
        this.reasonAddList = [];
        this.delIdList = [];
        this.reasonChangeMap = {};
        if (num == 1) {
          if (this.exit == 1) {
            return;
          }
          this.dialogVisible = true;
          this.salesReturn(); // 退货列表
        } else {
          this.dialogVisible1 = true;
          this.salesReturnOuter(); // 额外退货列表
        }

      },
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
      },
      // 退货原因添加一条问题
      addList() {
        let jump = false;
        this.list1.forEach(item => { // 遍历当前数据是否有空，有空则 不允许添加
          if (item.returnName == '') {
            jump = true;
          }
        });

        if (jump || this.list1.length >= 50) {
          return false;
        }
        this.list1.push({isShow: true, returnName: '', returnReasonId: ''}); // 显示input框
        this.indexDex = this.list1.length - 1;
      },
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
      },
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
      },
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
      },
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

    },
    created() {
      console.log(this.dealStatus);
      this.getOrderSetting();
      //console.log(this.exit);
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
      // 获取详情单的列表
      this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getAfterSaleDetail', {afterSalesNo: this.orderId})
        .then(res => {
          if (res.data.success) {

            //自定义属性接口
            /*this._post('com.edb01.erp.ass.service.api.AfterAttributeDefineService/' + this.version + '/showList')
              .then(response => {*/
            if (res.data.result.defineBizBeanList) {
              res.data.result.defineBizBeanList.forEach(item => { // 自定义属性
                item.attributeValue = '';
                if (item.enabledFlag && item.attributeType === 1 && item.attributeValues) { // 每个自定义属性下的下拉字符串转成数组
                  item.attributeValues = item.attributeValues.split(',');
                }
                if (item.enabledFlag) { // 过滤自定义属性当前开启的
                  if (res.data.result.attributeBeanList) {
                    res.data.result.attributeBeanList.forEach(it => {
                      if (item.attributeId == it.attributeId) { //  用户之前存的值开没开启，或者存不存在，如果存在赋值
                        if (item.attributeType == 1 && item.attributeValues) { // 属性值被删除
                          if (item.attributeValues.indexOf(it.attributeValue) == -1) { // 下拉框存不存在这个属性值，是否被删除
                            item.attributeValue = ''; // 如果删除置空
                          } else {
                            item.attributeValue = it.attributeValue;
                          }
                        } else if (item.attributeType == 1 && it.attributeType == 2) { // 单行文本变下拉框
                          item.attributeValue = '';
                        } else if (item.attributeType == 3 && it.attributeType == 1) { // 下拉框变多行文本
                          item.attributeValue = '';
                        } else if (item.attributeType == 2 && it.attributeType == 1) {// 下拉框变单行文本
                          item.attributeValue = '';
                        } else {
                          item.attributeValue = it.attributeValue;
                        }
                      }
                    })
                  }
                }
              });
              this.test = res.data.result.defineBizBeanList;
            }

            //console.log(response.data.result);
            /*   });*/
            if (!res.data.result.otherRefundAmt || res.data.result.otherRefundAmt == 'undefined') {
              res.data.result.otherRefundAmt = '';
            }
            if (this.exit == 1 && res.data.result.itemBeanList) {
              res.data.result.itemBeanList.forEach(item => {
                if (item.factRefundAmt) {
                  this.isReality = false;
                }
              })
            }
            if (this.exit == 2 && res.data.result.itemBeanList.length != 0) { /*canReturnAmt"canReturnQty applyRefundAmt applyReturnQty*/ // 都可修改
              let shopNum = 0;
              res.data.result.itemBeanList.forEach(item => {
                if (item.salesPrice && item.applyReturnQty) {
                  shopNum += item.salesPrice * item.applyReturnQty;
                }
                if (!item.applyRefundAmt) {
                  item.canReturnAmt = item.canReturnAmt + 0;
                } else {
                  item.canReturnAmt = item.canReturnAmt + item.applyRefundAmt;
                }
                if (res.data.result.asType == 3) {

                } else {
                  if (!item.applyReturnQty) {
                    item.canReturnQty = item.canReturnQty + 0;
                  } else {
                    item.canReturnQty = item.canReturnQty + item.applyReturnQty;
                  }
                }

              });

              res.data.result.itemBeanList[0].canChangAmtSum = shopNum;
            }
            if (!res.data.result.inStorageItemBeanList) {
              res.data.result.inStorageItemBeanList = [];
            } else {
              res.data.result.inStorageItemBeanList.forEach(item => {
                if (item.produceTime) {
                  item.produceTime = turnTimestamp(item.produceTime);
                }
              });
            }
            if (!res.data.result.totalRefundAmt || res.data.result.totalRefundAmt == 'undefined') {
              res.data.result.totalRefundAmt = '';
            }
            if (res.data.result.otherRefundFlowNo == 'undefined' || !res.data.result.otherRefundFlowNo) {
              res.data.result.otherRefundFlowNo = '';
            }
            this.proCityAreaValue = [res.data.result.provinceRegionId + '', res.data.result.cityRegionId + '', res.data.result.areaRegionId + '', res.data.result.townRegionId + '']; // 收货地址
            this.proCityAreaLabel = [res.data.result.consigneeProvince, res.data.result.consigneeCity, res.data.result.consigneeArea, res.data.result.consigneeTown];
            if (!res.data.result.afterMsg) { // 售后备注
              res.data.result.afterMsg = '';
            }
            this.afterSaleBaseBean = res.data.result;
            //console.log(this.afterSaleBaseBean);
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        });
      // 退回快递查询
      this._post('com.edb01.erp.mdata.service.api.DtEcExpressService/' + this.version + '/list')
        .then(res => {
          if (res.data.success) {
            this.options = res.data.result;
          }
        });
      /* // 订单可售后的明细查询
       this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getOrderItemData',{orderId: this.orderId})
         .then(res => {
           if(res.data.success){
             res.data.result.itemBeanList.forEach(item => {
               item.disabled = false;
               if(item.suitFlag){
                 item.suitDetailBeanList.forEach(item1 => {
                   item1.disabled = false;
                   item1.openSuit = false;
                 })
               }
             })
             this.afterSaleBaseBean = res.data.result;
             if(this.afterSaleBaseBean.serviceMsg == undefined){
               this.afterSaleBaseBean.serviceMsg = '';
             }
             console.log(this.afterSaleBaseBean.payTime,789456123);
           }else{
             this.$message({
               message: res.data.msg,
               type: 'warning'
             })
           }
         })*/
      // 退货原因查询list
      this.salesReturn = () => {
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getReturnGoodsReasonList')
          .then(res => {
            if (res.data.success) {
              res.data.result.forEach(item => {
                item.isShow = false;
              });
              this.list = res.data.result;
              this.list1 = JSON.parse(JSON.stringify(this.list));
            }
          })
      };
      this.salesReturn();
      // 额外退款原因列表查询 list
      this.salesReturnOuter = () => {
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getOtherRefundReasonList')
          .then(res => {
            if (res.data.success) {
              res.data.result.forEach(item => {
                item.isShow = false;
              });
              this.outerList = res.data.result;
              this.outerList1 = JSON.parse(JSON.stringify(this.outerList));
            }
          })
      };
      this.salesReturnOuter();
    },
    mounted() {
      this.queryShop();//查询商品弹框
      if (document.body.clientWidth < 1580) {
        this.spanCol = 8;
      } else {
        this.spanCol = 6;
      }
      // 监听自定义属性布局，小于1550显示3个，大于1920显示4个
      window.onresize = () => {
        if (document.body.offsetWidth < 1550) {
          this.spanCol = 8;
        } else {
          this.spanCol = 6;
        }
      }

    },
  }
</script>
<style scoped>
  #addAfterSaleDetail .line-span {
    display: inline-block;
    vertical-align: bottom;
    width: 121px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap

  }

  #addAfterSaleDetail .shop-detail1 {
    display: inline-block;
    height: 25px;
    width: 90px;
    line-height: 25px;
    text-align: center;
    border: 1px solid #3B8EE5;
    color: #409EFF;
    margin-bottom: 7px;
  }

  #addAfterSaleDetail .shop-span {
    margin-left: 20px;
    color: #409EFF;
    text-decoration: underline;
    cursor: pointer;
  }

  #addAfterSaleDetail .title1 {
    font-weight: bold;
    border-left: 4px solid #409EFF;
    padding-left: 12px;
    margin: 10px 0;
    padding-top: 3px;
  }

  #addAfterSaleDetail .shop-detail {
    display: inline-block;
    height: 25px;
    width: 60px;
    line-height: 25px;
    text-align: center;
    border: 1px solid #3B8EE5;
    color: #409EFF;
    margin: 0 -11px 0 7px;
    cursor: pointer;
  }

  #addAfterSaleDetail .shop-detail2 {
    display: inline-block;
    height: 25px;
    width: 60px;
    line-height: 25px;
    color: #A3A3A3;
    text-align: center;
    border: 1px solid #C2CBD2;
    margin: 0 -11px 0 7px;
    cursor: pointer;
  }

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

  #addAfterSaleDetail .footer {
    width: 100%;
    text-align: center;
    margin: 20px 0 10px 0;
  }

  #addAfterSaleDetail .background {
    background: #F2F2F2;
  }

  #addAfterSaleDetail .box {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #EAEAEC;
    cursor: pointer;
  }

  #addAfterSaleDetail .box span {
    display: inline-block;
    text-align: center;
  }

  #addAfterSaleDetail .box .span1, .span3 {
    width: 10%;
  }

  #addAfterSaleDetail .box .span2 {
    width: 78%;
  }

  #addAfterSaleDetail i {
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
  }

  #addAfterSaleDetail .title {
    font-weight: bold;
    border-left: 4px solid #409EFF;
    padding-left: 12px;
    margin: 30px 0;
    padding-top: 3px;
  }

  #addAfterSaleDetail .title span {
    font-size: 16px;
  }

  #addAfterSaleDetail .label-span {
    display: inline-block;
    width: 95px;
    text-align: right;
    font-size: 14px;
    color: #4A4A4A;
    margin-right: 5px;
  }

  #addAfterSaleDetail .box-detail {
    white-space: nowrap;
    height: 30px;
    line-height: 30px;
  }

  #addAfterSaleDetail .add {
    margin-left: 8px;
    font-size: 14px;
    color: #409EFF;
    cursor: pointer;
  }
</style>
<style>
  /* #addAfterSaleDetail #orderId .el-dialog__headerbtn .el-dialog__close{
     display: none;
   }
   #addAfterSaleDetail #orderId .el-dialog__header{
     border-bottom: 0 solid #eee;
   }*/
  #addAfterSaleDetail #shop-detail .el-input__inner {
    padding: 0 3px !important;
  }

  #addAfterSaleDetail .el-dialog__body {
    padding: 10px 20px !important;
  }

  /* #addAfterSale .el-dialog__header{
     text-align: left;
   }*/
</style>

