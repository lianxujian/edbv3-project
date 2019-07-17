<!--/*订单详情
 * @Author: fanhu/秋香
 * @Date: 2018-04-09 16:05:18
 * @Last Modified by: fanhu
 * @Last Modified time: 2018-04-27 16:55:17
 */-->
<template>
  <div class="container_Detail" style="height:100%;"  v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <div style="width:100%;height:100%;position:relative;">
      <div class="title-Detail" style="margin-bottom:15px;font-size:16px;position: absolute;width: 100%;z-index: 10;">
        <el-breadcrumb separator="/" class="col-breadcrumb">
          <el-breadcrumb-item><span @click="backOrderFn">上架</span></el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 标题栏 -->
      <ul id="topTitle">
        <li v-for='(item,index) in titleData' :class="{cur:item.iscur}" :key="index" @click="setCur(index)"><a
        >{{item.name}}</a></li>
      </ul>
      <div id="detail-container">
        <div class="detail-box">
          <!-- 基本信息 -->
          <div ref="title1" id="orderInfo">
            <span class="title">基本信息</span>
            <br/>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">订单号：</span><span class="valueStyle ellipsis" :title="orderInfos.salesOrderNo">{{orderInfos.salesOrderNo}}</span></div>
              <div class="line-child"><span class="titleText">平台单号：</span><span class="valueStyle ellipsis" :title="orderInfos.sourceOrderNo">{{orderInfos.sourceOrderNo}}</span></div>
              <div class="line-child"><span class="titleText">下单时间：</span><span class="valueStyle">{{orderInfos.orderTime}}</span></div>
              <div class="line-child"><span class="titleText">付款时间：</span><span class="valueStyle">{{orderInfos.payTime}}</span></div>
              <div class="line-child"><span class="titleText">店铺：</span><span class="valueStyle ellipsis" :title="orderInfos.storeName">{{orderInfos.storeName}}</span></div>
            </div>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">买家ID：</span><span class="valueStyle ellipsis" :title="orderInfos.customerName">{{orderInfos.customerName}}</span></div>
              <div class="line-child"><span class="titleText">订单状态：</span><span class="valueStyle">{{orderInfos.orderStatusName}}</span></div>
              <div class="line-child"><span class="titleText">异常标记：</span><span class="valueStyle ellipsis" :title="orderInfos.orderAbnormalSign">{{orderInfos.orderAbnormalSign}}</span></div>
              <div class="line-child"><span class="titleText">拆合状态：</span><span class="valueStyle ellipsis" :title="orderInfos.splitJoinStatus">{{orderInfos.splitJoinStatus}}</span></div>
              <div class="line-child"><span class="titleText">订单渠道：</span><span class="valueStyle">
                <span v-if="orderInfos.orderChannel==1">网店直营</span>
                <span v-if="orderInfos.orderChannel==2">手工下单</span>
              </span></div>
            </div>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">订单总金额：</span><span class="valueStyle">{{orderInfos.orderTotalAmt?orderInfos.orderTotalAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">商家优惠：</span><span class="valueStyle">{{orderInfos.merchantDctAmt?orderInfos.merchantDctAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">平台优惠：</span><span class="valueStyle">{{orderInfos.ecDctAmt?orderInfos.ecDctAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">实付金额：</span><span class="valueStyle">{{orderInfos.actuallyPayAmt?orderInfos.actuallyPayAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">代收金额：</span><span class="valueStyle">{{orderInfos.expressServiceAmt?orderInfos.expressServiceAmt:0 | parseNum}}元</span></div>
            </div>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">运费：</span><span class="valueStyle">{{orderInfos.freightAmt?orderInfos.freightAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">首次支付金额：</span><span class="valueStyle">{{orderInfos.firstPayAmt?orderInfos.firstPayAmt:0 | parseNum}}元</span></div>
              <div class="line-child"><span class="titleText">净重：</span><span class="valueStyle">{{orderInfos.totalWeight?orderInfos.totalWeight:0 | parseNum}}kg</span></div>
              <div class="line-child">
                <span class="titleText">仓库：</span>
                <span class="valueStyle">
                   <el-select v-model="orderInfos.storageId" style="width: 60%;">
                      <el-option :label="label" :value="value" :key="value" v-for="(label,value) in elem_storage"></el-option>
                   </el-select>
                </span>
              </div>
              <div class="line-child">
                <span class="titleText">快递：</span>
                <span class="valueStyle">
                  <el-select v-model="orderInfos.expressId" style="width:60%;">
                    <el-option :label="label" :value="value" :key="value" v-for="(label,value) in elem_express"></el-option>
                  </el-select>
                </span>
              </div>
            </div>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">快递单号：</span><span class="valueStyle">{{orderInfos.expressNo}}</span></div>
            </div>
            <div class="formatLine">
              <div style="width: 100%;">
                <span class="titleText" style="float:left;">客服备注：</span>
                <span class="valueStyle" v-if="orderInfos.serviceMsg && orderInfos.serviceMsg.length > 500" :title="orderInfos.serviceMsg" style="width:90%;float:left;word-break: break-all;">{{orderInfos.serviceMsg.slice(0,500)}}...</span>
                <div class="valueStyle" v-else :title="orderInfos.serviceMsg" style="width:90%;float:left;word-break: break-all;">{{orderInfos.serviceMsg}}</div>
              </div>
            </div>
            <div class="formatLine">
              <div style="width:100%;" class="line-child">
                <span class="titleText" style="float:left;">买家留言：</span>
                <span class="valueStyle" v-if="orderInfos.customerMsg && orderInfos.customerMsg.length > 500" :title="orderInfos.customerMsg" style="width:90%;float:left;word-break: break-all;">{{orderInfos.customerMsg.slice(0,500)}}...</span>
                <span class="valueStyle" v-else :title="orderInfos.customerMsg" style="width:90%;float:left;word-break: break-all;">{{orderInfos.customerMsg}}</span>
              </div>
            </div>
            <div>
             <span style="width: 100%;">
               <span class="titleText" style="margin-left: 15px;">内部便签：</span>
             <span class="valueStyle">
               <el-input placeholder="请输入内部便签" :disabled="internalDisabled" style="width: 50%;" v-model="orderInfos.internalMemoMsg"></el-input>
             </span>
             </span>
            </div>
            <div>
             <span style="width: 100%;">
               <span class="titleText" style="margin-left: 15px;">仓审须知：</span>
             <span class="valueStyle">
               <el-input :disabled="auditDisabled" placeholder="请输入仓审须知" style="width: 50%;" v-model="orderInfos.storageAuditMsg"></el-input>
             </span>
             </span>
            </div>
          </div>
          <!-- 收货人信息 -->
          <div ref="title2" id="consigneeInfo">
            <span class="title paddings">收货人信息</span>
            <br/>
            <span>
              <span class="titleText" style="margin-left: 15px;">收货人：</span>
              <el-input v-model="orderInfos.consignee" maxlength="50" class="formarWidth" style="width: 100px;"></el-input>
            </span>
            <span>
              <span class="titleText">手机：</span>
              <el-input v-model="orderInfos.consigneeMobile" maxlength="50" class="formarWidth" style="width: 110px;"></el-input>
            </span>
            <span>
              <span class="titleText">电话：</span>
              <el-input v-model="orderInfos.consigneePhone" maxlength="50" class="formarWidth"></el-input>
            </span>
            <span>
              <span class="titleText">收货地址：</span>
              <el-cascader
                placeholder="请选择" style="width:260px;"
                v-model="proCityAreaValue"
                :options="proCityAreaData"
                separator="-"
              ></el-cascader>
              <el-input v-model="orderInfos.shippingAddress" maxlength="100" style="width: 300px;"></el-input>
            </span>
          </div>
          <!-- 支付信息 -->
          <div ref="title3" id="payInfo">
            <span class="title paddings">支付信息</span>
            <div class="formatLine">
              <div class="line-child"><span class="titleText">支付方式：</span><span class="valueStyle">{{orderInfos.paymentWay}}</span></div><!--payList-->
              <div class="line-child"><span class="titleText">支付单号：</span><span class="valueStyle">{{orderInfos.alipayNo}}</span></div>
              <div class="line-child"><span class="titleText">支付金额：</span><span class="valueStyle"></span>{{orderInfos.actuallyPayAmt | parseNum}}元</div>
              <div class="line-child"><span class="titleText">支付时间：</span><span class="valueStyle">{{orderInfos.payTime}}</span></div>
              <div class="line-child"></div>
            </div>
          </div>
          <!-- 商品信息 -->
          <div ref="title4" id="goodsInfo">
            <span class="title paddings">商品信息 <el-button type="primary" style="margin-left: 15px;" v-if="followUpdateGift"
                                                       @click="addGiftShow">加赠品</el-button></span>
            <div v-for="(listBean,index) in goodsList">
              <div class="formatLine">
                <div class="line-child"><span class="titleText">平台单号：</span><span class="valueStyle ellipsis" :title="listBean.sourceOrderNo">{{listBean.sourceOrderNo}}</span></div>
                <div class="line-child"><span class="titleText">旗帜：</span>
                  <span class="valueStyle" v-if="listBean.flagId">
                    <span v-for="(value,key) in listBean.flagId.split(',')"><i
                      class="icon iconfont icon-ai246" :style="{color:flagColorList[value]}"></i>
                    </span>
                  </span>
                </div>
                <div class="line-child"><span class="titleText">买家留言：</span><span class="valueStyle ellipsis" :title="listBean.customerMsg">{{listBean.customerMsg}}</span></div>
                <div class="line-child"><span class="titleText">客服备注：</span><span class="valueStyle ellipsis" :title="listBean.serviceMsg">{{listBean.serviceMsg}}</span></div>
                <div class="line-child"></div>
              </div>

              <el-table class="col-border" :data="listBean.orderDetails"  @cell-dblclick="celldbClick" border style="width: 100%;margin-top: 15px;">
                <el-table-column prop="goodsName" align="center" width="250" label="商品信息">
                  <template slot-scope="scope">
                    <div style="float:left;width:80px;line-height:100px;" :class="scope.row.classFlag">
                      <img style="width:80%;height:auto;" v-if="scope.row && scope.row.goodsUrl" :src="scope.row.goodsUrl" alt="">
                    </div>
                    <div v-if="scope.row" style="text-align:left;display: flex;min-height: 85px;padding:5px;flex-direction: column;justify-content: center;">
                      <p style="line-height:20px;">
                        <span v-if="scope.row.presellFlag" style="color:green;">【预】</span>
                        <span v-if="scope.row.giftFlag" style="color:#FD00FF;">【赠】</span>
                        <span v-if="scope.row.refundFlag" style="color:red;">【退】</span>
                        <span v-if="scope.row.suitFlag" style="color:#0000FF;">【套】</span>
                        {{scope.row.goodsName}}
                      </p>
                      <p style="line-height:20px;">{{scope.row.goodsBarCode}}</p>
                      <p style="line-height:20px;">{{scope.row.goodsSpec}}</p>
                      <p style="line-height:20px;" v-if="scope.row.suitFlag">
                        <span v-if="!scope.row.isSuit" style="color:#8996A2;cursor:pointer;" @click="showSuitList(scope.$index,scope.row,index)">更多</span>
                        <span v-else style="color:#8996A2;cursor:pointer;" @click="hideSuitList(scope.$index,scope.row,index)">收起</span>
                      </p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="goodsQty" v-if="followUpdateGift" :render-header="renderHeader" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row">
                      <el-input v-if="scope.row.editFlag" v-model="scope.row.goodsQty"  @keyup.native="scope.row.goodsQty = scope.row.goodsQty.replace(/[^\d]/g,'')" type='text' @blur="keyupNumSave(scope.row)"></el-input>
                      <div v-else>
                        <div style="display:inline-block;">{{scope.row.goodsQty}}</div>
                        <div v-if="scope.row.lackQty" style="display:inline-block;color:red;">(缺{{scope.row.lackQty}})</div>
                      </div>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="goodsQty" v-if="!followUpdateGift" label="数量" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row">
                      <el-input v-if="scope.row.editFlag" v-model="scope.row.goodsQty"  @keyup.native="scope.row.goodsQty = scope.row.goodsQty.replace(/[^\d]/g,'')" type='text' @blur="keyupNumSave(scope.row)"></el-input>
                      <div v-else>
                        <div style="display:inline-block;">{{scope.row.goodsQty}}</div>
                        <div v-if="scope.row.lackQty" style="display:inline-block;color:red;">(缺{{scope.row.lackQty}})</div>
                      </div>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="unitPrice" align="center" label="单价">
                </el-table-column>
                <el-table-column prop="dealUnitPrice" align="center" label="成交价格">
                </el-table-column>
                <el-table-column prop="orderDctAmt" align="center" label="优惠抵扣金额">
                </el-table-column>
                <el-table-column prop="turnoverAmt" align="center" label="成交金额">
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row && !scope.row.refundFlag && !scope.row.classFlag && followChangeGoods" @click="exchangeGift(scope.row)">换货</el-button>
                    <el-button type="text" v-if="scope.row && scope.row.giftFlag && followUpdateGift" @click="channelDelGift(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <!-- 操作日志 -->
          <div ref="title5" id="logInfo">
            <span class="title">操作日志</span>
            <!--<public-Log2 sourceType="21"></public-Log2>-->
            <el-table class="col-border" :data="logList" max-height="380" border style="width: 100%;margin-top: 15px;">
              <el-table-column label="序号" align="center" type="index" :show-overflow-tooltip="hidden" width="45px">
              </el-table-column>
              <el-table-column prop="billTypeid" align="center" label="单据类型" :show-overflow-tooltip="hidden"
                               width="95px">
                <template slot-scope="scope">
                 <span>订单</span>
                </template>
              </el-table-column>
              <el-table-column prop="billCode" align="center" label="单据编号" :show-overflow-tooltip="hidden"
                               width="135px">
                <template slot-scope="scope">
                  {{orderInfos.salesOrderNo}}
                </template>
              </el-table-column>
              <el-table-column prop="operateName" align="center" label="操作类型" :show-overflow-tooltip="hidden" width="75px">
              </el-table-column>
              <el-table-column prop="operateRemark" align="center" label="操作描述" :show-overflow-tooltip="hidden">
              </el-table-column>
              <el-table-column prop="operater" align="center" label="操作人" :show-overflow-tooltip="hidden" width="85px">
              </el-table-column>
              <el-table-column prop="operateTime" align="center" label="操作时间" :show-overflow-tooltip="hidden" width="135px">
              </el-table-column>
              <el-table-column prop="opersteIp" align="center" label="IP" :show-overflow-tooltip="hidden" width="115px">
              </el-table-column>
              <el-table-column prop="remarks" align="center" label="备注" :show-overflow-tooltip="hidden" width="75px">
              </el-table-column>
            </el-table>
          </div>
          <!-- 订单商品列表弹窗 -->
          <el-dialog :close-on-click-modal="false" title="订单商品列表" :visible.sync="itemListFlag" width="950px">
            <span>商品名称:&nbsp;</span>
            <el-input class="itemStyle" v-model="itemName"></el-input>
            <span>商品编号:&nbsp;</span>
            <el-input class="itemStyle" v-model="itemCode"></el-input>
            <span>条形码:&nbsp;</span>
            <el-input class="itemStyle" v-model="itemBarCode"></el-input>
            <span>是否套装:&nbsp;</span>
            <el-select class="itemStyle" v-model="isSet">
              <el-option v-for="(value,key) in setList" :value="key" :label="value" :key="key"></el-option>
            </el-select>
            <el-button type="primary" style="margin-left:30px;" @click="getItemList">查询</el-button>
            <el-table height="500px" highlight-current-row :data="itemList" style="margin-top:20px;">
              <el-table-column type="index" label="序号" align="center">
              </el-table-column>
              <el-table-column prop="skuUrl" label="商品图片" align="center">
                <template slot-scope="scope">
                  <img style="height:36px;" :src="scope.row.skuUrl">
                </template>
              </el-table-column>
              <el-table-column prop="skuCode" label="商品编号" align="center">
              </el-table-column>
              <el-table-column prop="skuBarCode" label="条形码" align="center">
              </el-table-column>
              <el-table-column prop="skuName" label="商品名称" align="center">
              </el-table-column>
              <el-table-column prop="skuSpec" label="规格" align="center">
              </el-table-column>
              <el-table-column prop="skuName" label="是否套装" align="center">
                <template slot-scope="scope">
                  {{scope.row.suit ? '是' : '否'}}
                </template>
              </el-table-column>
              <el-table-column prop="skuPrice" label="商品售价" align="center">
                <template slot-scope="scope">
                  ￥:{{scope.row.skuPrice | parseNum}}
                </template>
              </el-table-column>
              <el-table-column prop="stockSale" label="可售库存" align="center">
                <template slot-scope="scope">
                  <span :style="scope.row.stockSale<0?'color:red':''">{{scope.row.stockSale}}</span>
                </template>
              </el-table-column>
            </el-table>
            <br>
            <el-pagination style="position:absolute;right:45px;" :total="itemTotal" :current-page="itemPage"
                           :page-size="itemSize" @size-change="sizeChange" @current-change="changePage"
                           layout="total,sizes,prev,pager,next, jumper"></el-pagination>
            <br>
            <el-button style="margin-left:40%;margin-top:30px;" @click="itemListFlag=false">取消</el-button>
            <el-button type="primary" @click="itemListFlag=false">确定</el-button>
          </el-dialog>
          <!--选择赠品（加赠品）-->
          <el-dialog :close-on-click-modal="false" title="请选择赠品" :visible.sync="selectAddGiftDialog" width="1200px" v-loading="loading" element-loading-text="拼命加载中"
                     element-loading-spinner="el-icon-loading">
            <div class="input-box">
              <el-row>
                <el-col :span="4">
                  <div><label for="">赠品名称：</label>
                    <el-input maxlength="50" style="width:110px;" v-model="addGiftObj.giftName"
                              @keyup.enter.native="queryGiftBtn1"></el-input>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div><label for="">赠品编号：</label>
                    <el-input maxlength="50" style="width:110px;" v-model="addGiftObj.giftCode"
                              @keyup.enter.native="queryGiftBtn1"></el-input>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div><label for="">条形码：</label>
                    <el-input maxlength="50" style="width:110px;" v-model="addGiftObj.giftBarCode"
                              @keyup.enter.native="queryGiftBtn1"></el-input>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div><label for="">销售状态：</label>
                    <el-select v-model="addGiftObj.giftSalesStatus" placeholder="" style="width:110px;">
                      <el-option label="全部" value="-1"></el-option>
                      <el-option label="可售可赠" value="1"></el-option>
                      <el-option label="仅可赠" value="2"></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div><label for="">是否套装：</label>
                    <el-select v-model="addGiftObj.giftSuitFlag" placeholder="" style="width:110px;">
                      <el-option label="全部" value="-1"></el-option>
                      <el-option label="单品" value="0"></el-option>
                      <el-option label="套装" value="1"></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" style="height:28px;margin-left:10px;" @click="queryGiftBtn1">查询</el-button>
                </el-col>
              </el-row>
              <el-table
                border
                highlight-current-row
                max-height="400"
                :data="addGiftData1"
                @current-change="selecGiftRow1"
                style="margin-top:15px;"
              >
                <el-table-column
                  label="序号"
                  align='center'
                  type="index"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="imageUrl"
                  align='center'
                  label="赠品图片"
                  min-width="">
                  <template slot-scope="scope">
                    <img v-if="scope.row.goodsUrl" :src="scope.row.goodsUrl" alt="">
                  </template>
                </el-table-column>
                <el-table-column
                  prop="goodsCode"
                  align='center'
                  label="赠品编号"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="goodsBarCode"
                  align='center'
                  min-width=''
                  label="条形码">
                </el-table-column>
                <el-table-column
                  prop="goodsName"
                  label="赠品名称"
                  min-width=''
                  align='center'
                  width="">
                </el-table-column>
                <el-table-column
                  prop="goodsSpec"
                  align='center'
                  label="规格"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="salesPrice"
                  align='center'
                  label="软件售价"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="suitFlag"
                  align='center'
                  label="是否套装"
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.suitFlag">是</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="giftType"
                  align='center'
                  label="销售状态"
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.giftType==1">可售可赠</span>
                    <span v-else>仅可赠</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="saleQty"
                  align='center'
                  label="可售库存"
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.saleQty > 0">{{scope.row.saleQty}}</span>
                    <span v-else style="color:red;">{{scope.row.saleQty}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="dialog-pagination">
                <el-pagination
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page="currentPage1"
                  :page-sizes="[15, 30, 50, 100, 200]"
                  :page-size="totalPage1"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalNum1">
                </el-pagination>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="selectAddGiftDialog=false">取消</el-button>
        <el-button type="primary" @click="saveAddGift1">确定</el-button>
      </span>
          </el-dialog>
          <!--请选择替换的商品（订单详情）-->
          <el-dialog :close-on-click-modal="false" title="请选择替换的商品" :visible.sync="replaceGoodsDialog6" width="1200px" v-loading="loading" element-loading-text="拼命加载中"
                     element-loading-spinner="el-icon-loading">
            <div class="input-box">
              <el-row>
                <el-col :span="5">
                  <div><label for="">商品名称：</label>
                    <el-input maxlength="50" style="width:150px;" v-model="replaceGoodsObj.goodsName"
                              @keyup.enter.native="queryGiftBtn6"></el-input>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div><label for="">商品编号：</label>
                    <el-input maxlength="50" style="width:150px;" v-model="replaceGoodsObj.goodsCode"
                              @keyup.enter.native="queryGiftBtn6"></el-input>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div><label for="">条形码：</label>
                    <el-input maxlength="50" style="width:150px;" v-model="replaceGoodsObj.barCode"
                              @keyup.enter.native="queryGiftBtn6"></el-input>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div><label for="">是否套装：</label>
                    <el-select v-model="replaceGoodsObj.suitFlag" placeholder="" style="width:150px;">
                      <el-option label="全部" value="-1"></el-option>
                      <el-option label="单品" value="0"></el-option>
                      <el-option label="套装" value="1"></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" style="height:28px;margin-left:10px;" @click="queryGiftBtn6">查询</el-button>
                </el-col>
              </el-row>
              <el-table
                border
                highlight-current-row
                max-height="400"
                :data="addGiftData6"
                @current-change="selecGiftRow6"
                style="margin-top:15px;"
              >
                <el-table-column
                  label="序号"
                  align='center'
                  type="index"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="imageUrl"
                  align='center'
                  label="商品图片"
                  min-width="">
                  <template slot-scope="scope">
                    <img v-if="scope.row.goodsImageUrl" :src="scope.row.goodsImageUrl" alt="">
                  </template>
                </el-table-column>
                <el-table-column
                  prop="goodsCode"
                  align='center'
                  label="商品编号"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="goodsBarCode"
                  align='center'
                  min-width=''
                  label="条形码">
                </el-table-column>
                <el-table-column
                  prop="goodsName"
                  label="商品名称"
                  min-width=''
                  align='center'
                  width="">
                </el-table-column>
                <el-table-column
                  prop="goodsSpec"
                  align='center'
                  label="规格"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="suitFlag"
                  align='center'
                  label="是否套装"
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.suttleFlag">是</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="salesPrice"
                  v-if="openLimitExchangeGoods"
                  align='center'
                  label="软件售价"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="kStock"
                  v-if="!isPresellFlag"
                  align='center'
                  label="可售现货"
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.kStock > 0">{{scope.row.kStock}}</span>
                    <span v-else style="color:red;">{{scope.row.kStock}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="isPresellFlag"
                  prop="preSaleStock"
                  align='center'
                  label="预售库存"
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.preSaleStock > 0">{{scope.row.preSaleStock}}</span>
                    <span v-else style="color:red;">{{scope.row.preSaleStock}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="dialog-pagination">
                <el-pagination
                  @size-change="handleSizeChange6"
                  @current-change="handleCurrentChange6"
                  :current-page="currentPage6"
                  :page-sizes="[15, 30, 50, 100, 200]"
                  :page-size="totalPage6"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalNum6">
                </el-pagination>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="replaceGoodsDialog6=false">取消</el-button>
        <el-button type="primary" @click="saveAddGift6">确定</el-button>
      </span>
          </el-dialog>
          <!--请选择替换的赠品（订单详情）-->
          <el-dialog :close-on-click-modal="false" title="请选择替换的赠品" :visible.sync="replaceGoodsDialog7" width="1200px" v-loading="loading" element-loading-text="拼命加载中"
                     element-loading-spinner="el-icon-loading">
            <div class="input-box">
              <el-row>
                <el-col :span="4">
                  <div><label for="">赠品名称：</label>
                    <el-input maxlength="50" style="width:110px;" v-model="addGiftObj.goodsName"
                              @keyup.enter.native="queryGiftBtn7"></el-input>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div><label for="">赠品编号：</label>
                    <el-input maxlength="50" style="width:110px;" v-model="addGiftObj.goodsCode"
                              @keyup.enter.native="queryGiftBtn7"></el-input>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div><label for="">条形码：</label>
                    <el-input maxlength="50" style="width:110px;" v-model="addGiftObj.barCode"
                              @keyup.enter.native="queryGiftBtn7"></el-input>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div><label for="">销售状态：</label>
                    <el-select v-model="addGiftObj.salesType" placeholder="" style="width:110px;">
                      <el-option label="全部" value="-1"></el-option>
                      <el-option label="可售可赠" value="1"></el-option>
                      <el-option label="仅赠" value="2"></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div><label for="">是否套装：</label>
                    <el-select v-model="addGiftObj.suitFlag" placeholder="" style="width:110px;">
                      <el-option label="全部" value="-1"></el-option>
                      <el-option label="单品" value="0"></el-option>
                      <el-option label="套装" value="1"></el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" style="height:28px;margin-left:10px;" @click="queryGiftBtn7">查询</el-button>
                </el-col>
              </el-row>
              <el-table
                border
                highlight-current-row
                max-height="400"
                :data="addGiftData7"
                @current-change="selecGiftRow7"
                style="margin-top:15px;"
              >
                <el-table-column
                  label="序号"
                  align='center'
                  type="index"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="imageUrl"
                  align='center'
                  label="赠品图片"
                  min-width="">
                  <template slot-scope="scope">
                    <img v-if="scope.row.goodsImageUrl" :src="scope.row.goodsImageUrl" alt="">
                  </template>
                </el-table-column>
                <el-table-column
                  prop="goodsCode"
                  align='center'
                  label="赠品编号"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="goodsBarCode"
                  align='center'
                  min-width=''
                  label="条形码">
                </el-table-column>
                <el-table-column
                  prop="goodsName"
                  label="赠品名称"
                  min-width=''
                  align='center'
                  width="">
                </el-table-column>
                <el-table-column
                  prop="goodsSpec"
                  align='center'
                  label="规格"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="salesPrice"
                  align='center'
                  label="软件售价"
                  v-if="openLimitExchangeGoods"
                  width="">
                </el-table-column>
                <el-table-column
                  prop="suitFlag"
                  align='center'
                  label="是否套装"
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.suttleFlag">是</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="giftType"
                  align='center'
                  label="销售状态"
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.salesStatus==1">可售可赠</span>
                    <span v-else>仅可赠</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="giftStock"
                  align='center'
                  label="赠品可售库存"
                  width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.giftStock > 0">{{scope.row.giftStock}}</span>
                    <span v-else style="color:red;">{{scope.row.giftStock}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="dialog-pagination">
                <el-pagination
                  @size-change="handleSizeChange7"
                  @current-change="handleCurrentChange7"
                  :current-page="currentPage7"
                  :page-sizes="[15, 30, 50, 100, 200]"
                  :page-size="totalPage7"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalNum7">
                </el-pagination>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="replaceGoodsDialog7=false">取消</el-button>
        <el-button type="primary" @click="saveAddGift7">确定</el-button>
      </span>
          </el-dialog>
        </div>
      </div>
      <div class="col-button">
        <el-button @click="backPage('cancel')">返回</el-button>
        <el-button type="primary" @click="backPage('sure')">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {returnFloat, turnTimestamp, selShowLabel,turnTimestamp3} from '@/assets/js/validate';
  export default {
    name: "",
    props:{
      params:Object
    },
    data() {
      return {
        loading:'',
        selectRow1:'',
        selectAddGiftDialog:false,
        addGiftData1:[],
        currentPage1:1,
        totalPage1:15,
        totalNum1:0,
        editing:false,
        recordCurrent:'',

        replaceGoodsDialog6:false,
        selectRow6:'',
        currentPage6:1,
        totalPage6:15,
        totalNum6:0,
        addGiftData6:[],
        replaceGoodsObj:{},

        replaceGoodsDialog7:false,
        selectRow7:'',
        currentPage7:1,
        totalPage7:15,
        totalNum7:0,
        addGiftData7:[],
        addGiftObj:{},
        exchangeRow:'',
        isPresellFlag:false,

        version: "1.0.0",
        clToken: "", //令牌
        activeNames: "1",
        isOrigin: "", //是否为原始单
        titleActiveStatus: 1, //标题栏激活状态
        itemListFlag: false, //商品列表显示状态
        itemList: [], //商品列表
        itemName: "", //商品名字
        itemCode: "", //商品编号
        itemBarCode: "", //商品条形码
        itemSize: 10, //商品列表数量
        itemTotal: 0, //商品列表总数
        itemPage: 1, //商品列表当前页

        internalDisabled:false,
        auditDisabled:false,
        hidden: true,
        size: 10, //
        showTextFlag: false,
        province: "0",
        city: "0",
        county: "0",
        warehouse: "0",
        currentPage: 1,
        total: 0,
        tenantId: 0,
        express: "0",
        note: "",
        notice: "",
        buyersMessage: "",
        serviceRemarks: "",
        toolsBarFixed: false,
        isSet: "0", //是否套装
        //套装列表
        setList: {
          "0": "全部",
          "1": "单品",
          "2": "套装"
        },
        billTypeList: [
          "管理员管理",
          "店铺档案",
          "仓库档案",
          "单品档案",
          "套装档案",
          "快递档案",
          "智能仓库",
          "订单方案",
          "订单标记",
          "商品品牌档案",
          "商品分类档案",
          "参数设置"
        ],
        typeList: [
          "添加",
          "更新",
          "删除",
          "启用",
          "停用",
          "授权",
          "取消挂起",
          "挂起"
        ],
        orderStatusObj:{
          "1": "待客审",
          "2": "已客审",
          "3": "已财审",
          "4": "已仓审",
          "20": "已分配拣货位",
          "5": "已拣货",
          "6": "已验货",
          "7": "已打包",
          "8": "已称重",
          "9": "已发货",
          "10": "已完成",
          "11": "已取消"
        },//订单状态
        //支付方式列表
        payList: {
          "1": "支付宝",
          "2": "微信",
          "3": "银联",
          "4": "现金",
          "5": "京东"
        },
        orderInfos: {
          storageId:'',
          expressId:''
        }, //订单详情
        logList: [], //日志列表
        goodsList: [], //商品列表
        titleData: [
          {
            iscur: true,
            name: '基本信息'
          },
          {
            iscur: false,
            name: '收货人信息'
          },
          {
            iscur: false,
            name: '支付信息'
          },
          {
            iscur: false,
            name: '商品信息'
          },
          {
            iscur: false,
            name: '操作日志'
          }
        ],
        proCityAreaData:[],//省市级data
        proCityAreaValue:[],//级联下拉value
        elem_store:[],//店铺
        elem_storage:[],//仓库
        elem_express:[],//快递
        //旗帜颜色列表
        flagColorList: {
          "1": "#cd3930",
          "2": "#edcf4c",
          "3": "#72c95d",
          "4": "#3d9bfe",
          "5": "#822aea"
        },
        salesOrderId:this.$router.history.current.params.orderId,
        followUpdateGift:true,//是否能改赠品
        followChangeGoods:false,//是否能换商品
        expressList:[],
        openLimitExchangeGoods:true,
      };
    },
    methods: {
      //选择赠品添加查询
      addGiftShow(){
        //添加赠品列表
        this.addGiftObj = {
          giftName:'',
          giftCode:'',
          giftBarCode:'',
          giftSalesStatus:'-1',
          giftSuitFlag:'-1',
        };
        this.currentPage1 = 1;
        this.totalPage1 = 15;
        this.selectRow1='';
        this.queryGiftBtn1();
      },
      queryGiftBtn1(){
        this.loading = true;
        this.addGiftObj.page = this.currentPage1;
        this.addGiftObj.size = this.totalPage1;
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/queryAddGiftList',this.addGiftObj)
          .then((res) => {
            if (res.data.success) {
              this.selectAddGiftDialog=true;
              this.selectRow1 = '';
              this.addGiftData1 = res.data.result.rows;
              this.totalNum1 = res.data.result.total;
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
            this.loading = false;
          })
      },
      handleSizeChange1(value){
        this.totalPage1=value;
        this.queryGiftBtn1();
      },
      handleCurrentChange1(value){
        this.currentPage1=value;
        this.queryGiftBtn1();
      },
      selecGiftRow1(row, oldrow) {
        this.selectRow1 = row;
      },
      //添加赠品
      saveAddGift1(){
        if(!this.selectRow1){
          this.$message({
            message: '请选择赠品！',
            type: 'warning'
          });
          return false;
        }
        var salesOrderIdList=[];
        salesOrderIdList[0] = this.salesOrderId;
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/followPassSalesOrderVoucher", {
          salesOrderIdList:JSON.stringify(salesOrderIdList[0])
        }).then((response) => {
          if (response.data.success) {
            this.loading = true;
            this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funUpdateGift',{
              changeType:1,
              giftBarCode:this.selectRow1.goodsBarCode,
              giftNum:1,
              addUpFlag:true,
              orderIds:this.salesOrderId,
              isNotDel:null,
              isFromOrderDetail:1
            })
              .then((res) => {
                this.loading = false;
                if (res.data.success) {
                  this.selectAddGiftDialog=false;
                  //都成功
                  if(res.data.result.failQty === 0){
                    this.$message({
                      message: '添加成功！',
                      type: 'success'
                    });
                    this.orderBaseDetail();
                  }else if(res.data.result.successQty === 0 || res.data.result.returnType == 3){
                    this.$message({
                      message: "添加失败!原因："+res.data.result.failReason+"！",
                      type: 'warning'
                    });
                  }
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "warning"
                  });
                }
              })
          }else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //删除赠品
      channelDelGift(row){
        this.$confirm('确定要删除此赠品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.loading=true;
          this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funUpdateGift',{
            changeType:2,
            giftBarCode:row.goodsBarCode,
            giftNum:row.goodsQty,
            addUpFlag:true,
            orderIds:this.salesOrderId,
            isNotDel:null,
            isFromOrderDetail:1
          })
            .then((res) => {
              this.loading = false;
              if (res.data.success) {
                this.loading=false;
                if(res.data.result.failQty === 0){
                  this.$message({
                    message: '删除成功！',
                    type: 'success'
                  });
                  this.orderBaseDetail();
                }else if(res.data.result.successQty === 0 || res.data.result.returnType == 3){
                  this.$message({
                    message: "删除失败!原因："+res.data.result.failReason+"！",
                    type: 'warning'
                  });
                }
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
        }).catch(() => {});
      },
      renderHeader(createElement, {_self}) {
        return createElement(
          'span',
          {
            'style': 'font-weight:bold;'
          },
          [
            createElement('span', ['数量']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-edit',
                'style': 'font-weight:bold;margin-left:5px;'
              }
            )
          ]
        );
      },
      //双击单元格
      celldbClick(row, column, cell, event) {
        if (column.property == "goodsQty" && row.giftFlag && this.followUpdateGift) {
          if(!this.editing){
            row.editFlag = true;
            this.editing = true;
            this.recordCurrent = row.goodsQty*1;
          }else{
            this.$message({
              message: '请先保存当前编辑方案！',
              type: 'warning'
            });
          }
        }
      },
      //失焦保存
      keyupNumSave(row, index){
        if(row.goodsQty == ''){
          this.$message({
            message: '数量不能为空！',
            type: 'warning'
          });
          return false;
        }
        var paramNum=0,isAdd=true;
        if(this.recordCurrent == row.goodsQty*1){
          row.editFlag=false;
          this.editing = false;
          return false;
        }else if(this.recordCurrent > row.goodsQty*1){
          paramNum = this.recordCurrent - row.goodsQty*1;
          isAdd = false;
        }else{
          paramNum = row.goodsQty*1 - this.recordCurrent;
          isAdd = true;
        }
        this.loading = true;
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funUpdateGift',{
          changeType:isAdd?1:2,
          giftBarCode:row.goodsBarCode,
          orderItemIdByUpdateGiftNum:row.orderItemId,
          giftNum:paramNum,
          addUpFlag:true,
          orderIds:this.salesOrderId,
          isNotDel:null,
          isFromOrderDetail:1
        })
          .then((res) => {
            this.loading = false;
            if (res.data.success) {
              if(res.data.result.returnType == 3 || res.data.result.successQty === 0){
                this.$message({
                  message: "修改失败!原因："+res.data.result.failReason+"！",
                  type: 'warning'
                });
              }else if(res.data.result.failQty === 0){
                this.$message({
                  message: '保存成功！',
                  type: 'success'
                });
                row.editFlag=false;
                this.editing = false;
                this.orderBaseDetail();
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          })

      },

      //换货
      exchangeGift(row){
        //presellFlag giftFlag suitFlag
        this.exchangeRow = row;
        if(row.giftFlag){
          //赠品
          //添加赠品列表
          this.addGiftObj = {
            goodsName:'',
            goodsCode:'',
            barCode:'',
            salesType:'-1',
            suitFlag:'-1',
          };
          this.currentPage7 = 1;
          this.totalPage7 = 15;
          this.selectRow7='';
          this.queryGiftBtn7();
        }else{
          if(row.presellFlag){
            this.isPresellFlag = true;
          }else{
            this.isPresellFlag = false;
          }
          //预售或正常
          this.replaceGoodsObj = {
            goodsName:'',
            goodsCode:'',
            barCode:'',
            suitFlag:'-1'
          };
          this.currentPage6 = 1;
          this.totalPage6 = 15;
          this.selectRow6='';
          this.queryGiftBtn6();
        }
      },
      /*---------------------------------------------*/
      //请选择替换的商品（订单详情）
      queryGiftBtn6(){
        this.replaceGoodsObj.page = this.currentPage6;
        this.replaceGoodsObj.size = this.totalPage6;
        this.replaceGoodsObj.goodsId = this.exchangeRow.goodsId;
        this.loading = true;
        var paramUrl = this.isPresellFlag?'selectPreSaleGoodsList':'selectNormalGoodsList';
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/"+paramUrl, this.replaceGoodsObj).then((response) => {
          if (response.data.success) {
            if(!response.data.result.openLimitExchangeGoods){
              this.openLimitExchangeGoods = false;
            }else{
              this.openLimitExchangeGoods = true;
            }
            this.replaceGoodsDialog6 = true;
            this.selectRow6 = '';
            this.addGiftData6 = response.data.result.rows;
            this.totalNum6 = response.data.result.total;
          }else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
          this.loading = false;
        })
      },
      handleSizeChange6(value){
        this.totalPage6=value;
        this.queryGiftBtn6();
      },
      handleCurrentChange6(value){
        this.currentPage6=value;
        this.queryGiftBtn6();
      },
      selecGiftRow6(row, oldrow) {
        this.selectRow6 = row;
      },
      saveAddGift6(){
        if(!this.selectRow6){
          this.$message({
            message: '请选择替换的商品!',
            type: 'warning'
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/salesOrderDetailPleaseProductListListClickYes", {
          salesOrderId:this.salesOrderId,
          oldGoodsId:this.exchangeRow.goodsId,
          orderItemId:this.exchangeRow.orderItemId,
          replaceGoodsId:this.selectRow6.goodsId
        }).then((response) => {
          if (response.data.success) {
            this.loading = true;
            this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateProduct", {
              newSkuBarCode:this.selectRow6.goodsBarCode,
              replaceGiftSale:false,
              replaceSale:this.isPresellFlag?false:true,
              replacePreSale:this.isPresellFlag?true:false,
              orderIdListJson:JSON.stringify([this.salesOrderId]),
              oldSkuGoodsId:this.exchangeRow.goodsId,
              orderDetailId:this.exchangeRow.orderItemId
            }).then((response) => {
              this.loading = false;
              if (response.data.success) {
                if(response.data.result.returnType == 3){
                  this.$message({
                    message:  '换货失败！'+response.data.result.failReason,
                    type: 'warning'
                  });
                }else if(response.data.result.successQty == 1){
                  this.$message({
                    message: '换货成功！',
                    type: 'success!'
                  });
                  this.replaceGoodsDialog6 = false;
                  this.orderBaseDetail();
                }else{
                  this.$message({
                    message:  '换货失败！'+response.data.result.failReason,
                    type: 'warning'
                  });
                }
              }else {
                this.$message({
                  message: response.data.msg,
                  type: "warning"
                });
              }
            })
          }else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      /*---------------------------------------------*/
      //请选择替换的赠品（订单详情）
      queryGiftBtn7(){
        this.addGiftObj.page = this.currentPage7;
        this.addGiftObj.size = this.totalPage7;
        this.addGiftObj.goodsId = this.exchangeRow.goodsId;
        this.loading = true;
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/selectGiftGoodsList", this.addGiftObj).then((response) => {
          if (response.data.success) {
            this.replaceGoodsDialog7 = true;
            this.openLimitExchangeGoods = response.data.result.openLimitExchangeGoods?response.data.result.openLimitExchangeGoods:false;
            this.selectRow7 = '';
            this.addGiftData7 = response.data.result.rows;
            this.totalNum7 = response.data.result.total;
          }else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
          this.loading = false;
        })
      },
      handleSizeChange7(value){
        this.totalPage7=value;
        this.queryGiftBtn7();
      },
      handleCurrentChange7(value){
        this.currentPage7=value;
        this.queryGiftBtn7();
      },
      selecGiftRow7(row, oldrow) {
        this.selectRow7 = row;
      },
      saveAddGift7(){
        if(!this.selectRow7){
          this.$message({
            message: '请选择替换的赠品!',
            type: 'warning'
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/salesOrderDetailPleaseProductListListClickYes", {
          salesOrderId:this.salesOrderId,
          oldGoodsId:this.exchangeRow.goodsId,
          orderItemId:this.exchangeRow.orderItemId,
          replaceGoodsId:this.selectRow7.goodsId
        }).then((response) => {
          if (response.data.success) {
            this.loading = true;
            this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateProduct", {
              newSkuBarCode:this.selectRow7.goodsBarCode,
              replaceGiftSale:true,
              replaceSale:false,
              replacePreSale:false,
              orderIdListJson:JSON.stringify([this.salesOrderId]),
              oldSkuGoodsId:this.exchangeRow.goodsId,
              orderDetailId:this.exchangeRow.orderItemId
            }).then((response) => {
              if (response.data.success) {
                if(response.data.result.returnType == 3){
                  this.$message({
                    message:  '换货失败！'+response.data.result.failReason,
                    type: 'warning'
                  });
                }else if(response.data.result.successQty == 1){
                  this.$message({
                    message: '换货成功！',
                    type: 'success!'
                  });
                  this.replaceGoodsDialog7 = false;
                  this.orderBaseDetail();
                }else{
                  this.$message({
                    message:  '换货失败！'+response.data.result.failReason,
                    type: 'warning'
                  });
                }
              }else {
                this.$message({
                  message: response.data.msg,
                  type: "warning"
                });
              }
              this.loading = false;
            })
          }else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })

      },
      /*---------------------------------------------*/

      //套装更多显示
      showSuitList(index,row,n){
        this.$set(row,'isSuit',true);
        for(var i=row.orderSuitDetailBeans.length;i--;i>=0){
          row.orderSuitDetailBeans[i].goodsQty = row.orderSuitDetailBeans[i].skuQty;
          row.orderSuitDetailBeans[i].unitPrice = row.orderSuitDetailBeans[i].skuPrice;
          row.orderSuitDetailBeans[i].classFlag = 'classFlag';
          this.goodsList[n].orderDetails.splice(index+1,0,row.orderSuitDetailBeans[i]);
        }
      },
      //套装更多收起
      hideSuitList(index,row,n){
        this.$set(row,'isSuit',false);
        this.goodsList[n].orderDetails.splice(index+1,row.orderSuitDetailBeans.length);
      },
      //标题栏吸顶效果
      handleScroll() {
        var scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        var offsetTop = document.querySelector("#topTitle").offsetTop;
        if (scrollTop > offsetTop) {
          this.toolsBarFixed = true;
        } else {
          this.toolsBarFixed = false;
        }
      },
      backOrderFn(item){
        this.$router.push({path:'/enterShelves'})
      },
      //返回上一页
      backPage(value) {
        if(value == 'sure'){
          var itemObj = {
            salesOrderId:this.salesOrderId,
            storageId:this.orderInfos.storageId,
            storageName:this.orderInfos.storageId?this.elem_storage[this.orderInfos.storageId]:'',
            expressId:this.orderInfos.expressId,
            expressName:this.orderInfos.expressId?this.elem_express[this.orderInfos.expressId]:'',
            internalMemo:this.orderInfos.internalMemoMsg,
            storageAuditMes:this.orderInfos.storageAuditMsg,//仓审须知
            receiveAddress:this.orderInfos.shippingAddress,//收货详细地址
            provinceId:this.proCityAreaValue[0]?this.proCityAreaValue[0]:'',
            cityId:this.proCityAreaValue[1]?this.proCityAreaValue[1]:'',
            areaId:this.proCityAreaValue[2]?this.proCityAreaValue[2]:'',
            townId:this.proCityAreaValue[3]?this.proCityAreaValue[3]:'',
            isAppend:1,
            consignee:this.orderInfos.consignee,
            consigneeMobile:this.orderInfos.consigneeMobile,
            consigneePhone:this.orderInfos.consigneePhone,
          }
          for(var item in itemObj){
            if(itemObj[item] == 'undefined'){
              itemObj[item] = '';
            }
          }
          this.loading = true;
          this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/saveSalesOrderDetailInfo", itemObj).then((response) => {
            this.loading = false;
            if (response.data.success) {
              this.$message({
                message: '保存成功',
                type: "success"
              });
              setTimeout(()=>{
                this.backOrderFn(1);
              },300)
            }else {
              this.$message({
                message: response.data.msg,
                type: "warning"
              });
            }
          })
        }else{
          /*if(this.fromPage=='OrderProcessing'){
            this.$router.push("/orderProcessing");
          }else{
            this.$router.push("/orderQuery");
          }*/
          this.backOrderFn();
        }
      },
      getLog(){
        this._post('com.edb01.erp.log.service.api.OperateLogService/'+this.version+'/getLogList',{
          sourceType:40,
          sourceId:this.orderInfos.salesOrderNo,
          operateType:''
        }).then((response)=>{
          if(response.data.code==0){
            this.logList = response.data.result;
            this.logList.forEach((item, i) => {
              item.operateTime = turnTimestamp(item.operateTime);
            })
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //获取商品详情
      orderBaseDetail() {
        this.loading = true;
        this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/findOrderBaseBeanById", {
          salesOrderId: this.salesOrderId
        }).then((response) => {
          if (response.data.success) {
            this.followUpdateGift = response.data.result.followUpdateGift;//改赠品
            this.followChangeGoods = response.data.result.followChangeGoods;//换商品
            response.data.result.storageId = response.data.result.storageId?response.data.result.storageId:'';
            response.data.result.expressId = response.data.result.expressId?response.data.result.expressId:'';
            this.orderInfos = response.data.result;

            if(response.data.result.storageId){
              this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version + "/getExpressListBeanGroupByStorageId", {
                storageId:response.data.result.storageId
              }).then((res) => {
                this.loading = false;
                if (res.data.success) {
                  var expressObj = {};
                  if(res.data.result[response.data.result.storageId]){
                    res.data.result[response.data.result.storageId].forEach((item,i)=>{
                      expressObj[item.expressId] = item.expressName;
                    })
                    this.elem_express = expressObj;
                    this.orderInfos.expressId = response.data.result.expressId;
                    var showExpress = true;
                    for (var item in this.elem_express) {
                      if (item == this.orderInfos.expressId) {
                        showExpress = false;
                      }
                    }
                    if(!this.orderInfos.expressName || showExpress)this.orderInfos.expressId='';
                  }else{
                    this.elem_express = this.expressList;
                    var showExpress = true;
                    for (var item in this.elem_express) {
                      if (item == this.orderInfos.expressId) {
                        showExpress = false;
                      }
                    }
                    if(!this.orderInfos.expressName || showExpress)this.orderInfos.expressId='';
                  }
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "warning"
                  });
                }
              })
            }else{
              this.loading = false;
              this.elem_express = this.expressList;
              var showExpress = true;
              for (var item in this.elem_express) {
                if (item == this.orderInfos.expressId) {
                  showExpress = false;
                }
              }
              if(!this.orderInfos.expressName || showExpress)this.orderInfos.expressId='';
            }

            //公共日志
            this.getLog();
            //storageId expressId
            var showStorage = true;
            for(var item in this.elem_storage){
              if(item == this.orderInfos.storageId){
                showStorage = false;
              }
            }
            if(!this.orderInfos.storageName || showStorage)this.orderInfos.storageId='';

            this.orderInfos.orderTime = this.orderInfos.orderTime?turnTimestamp(this.orderInfos.orderTime):'';
            this.orderInfos.payTime = this.orderInfos.payTime?turnTimestamp(this.orderInfos.payTime):'';
            this.proCityAreaValue=[this.orderInfos.provinceRegionId+'',this.orderInfos.cityRegionId+'',this.orderInfos.areaRegionId+'',this.orderInfos.townRegionId+''];
            response.data.result.orderBaseDetailsBean.forEach((item,i)=>{
              this.$set(item,'editFlag',false);
              if(item.suitFlag)this.$set(item,'isSuit',false);
            })
            response.data.result.orderBaseDetailsBeanNews = response.data.result.orderBaseDetailsBeanNews?response.data.result.orderBaseDetailsBeanNews:[];
            response.data.result.orderBaseDetailsBeanNews.forEach((item,i)=>{
              this.$set(item,'editFlag',false);
              if(item.suitFlag)this.$set(item,'isSuit',false);
            })
            response.data.result.orderHistoryBaseBeans.forEach((item,i)=>{
              item.orderDetails.forEach((item2,j)=>{
                if(item2)this.$set(item2,'editFlag',false);
                if(item2 && item2.suitFlag)this.$set(item2,'isSuit',false);
              })
            })
            this.goodsList=[];
            if (this.orderInfos.originalFlag) {//原始单
              //sourceOrderNo flagId customerMsg serviceMsg
              this.goodsList.push({
                orderDetails:response.data.result.orderBaseDetailsBean,
                sourceOrderNo:this.orderInfos.sourceOrderNo,
                flagId:this.orderInfos.flagId,
                customerMsg:this.orderInfos.customerMsg,
                serviceMsg:this.orderInfos.serviceMsg
              })
            } else {
              this.goodsList = response.data.result.orderHistoryBaseBeans;
              if(response.data.result.orderBaseDetailsBeanNews.length > 0){
                this.goodsList.push({
                  orderDetails:response.data.result.orderBaseDetailsBeanNews,
                  sourceOrderNo:this.orderInfos.sourceOrderNo,
                  flagId:this.orderInfos.flagId,
                  customerMsg:this.orderInfos.customerMsg,
                  serviceMsg:this.orderInfos.serviceMsg
                })
              }
            }
          } else {
            this.loading = false;
            this.$message({
              message: response.data.msg?response.data.msg:'接口异常',
              type: "warning"
            });
          }
        })
      },
      //获取商品列表
      getItemList() {
        const temp = {
          tenantId: this.tenantId,
          suit: this.isSet,
          size: this.itemSize,
          page: this.itemPage,
          barCode: this.itemBarCode,
          skuName: this.itemName,
          skuCode: this.itemCode
        };
        const data = {
          replaceSearchBean: JSON.stringify(temp)
        };
        this._post("com.edb01.erp.biz.oms.baseservice.OrderBaseFunService/" + this.version + "/funUpdateProductFindNewProductList", data).then((response) => {
          if (response.data.code == 0) {
            this.itemList = response.data.result.rows;
            this.itemTotal = response.data.result.total;
            this.itemPage = response.data.result.page;
            this.itemSize = response.data.result.size;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //换页
      changePage(value) {
        this.itemPage = value;
        this.getItemList();
      },
      //每页显示数量
      sizeChange(value) {
        this.itemSize = value;
        this.getItemList();
      },
      //表头提示信息
      // renderQuestion(h, {
      //   column,
      //   $index
      // }) {
      //   return ( <
      //     div style = "float:left;margin-top:-5px;" >
      //     <
      //     el - tooltip class = "item"
      //     effect = "dark"
      //     content = "商品种类/商品总数量"
      //     placement = "top" >
      //     <
      //     i class = "el-icon-question" / >
      //     <
      //     /el-tooltip> <
      //     span > & nbsp; 商品信息 < /span> <
      //     /div>
      //   );
      // },
      //更换每页显示数量
      handleSizeChange() {
        this.logInit();
      },
      //更换页数
      handleCurrentChange() {
        this.logInit();
      },
      //spetable
      currentChanges(value) {
        console.log(value);
        //				this.currentRow = value;
      },
      //表头切换class的方法
      setCur(index) {
        setTimeout(() => {
          this.titleData.map(function (v, i) {
            v.iscur = i == index ? true : false;
          });
        }, 20)
        document.querySelector('.detail-box').scrollTop = this.$refs['title' + (index + 1)].offsetTop - 75;
      },
      //省市区级下拉
      proCityArea(){
        this._post("com.edb01.erp.mdata.service.api.DtRegionService/" + this.version + "/getProvCityAndDistrict").then((response) => {
          if (response.data.success) {
            this.proCityAreaData = response.data.result;
            this.proCityAreaData.forEach((item,i)=>{
              if(item.cityBeanList.length>0)item.children=item.cityBeanList;
              item.value=item.regionId;
              item.label=item.regionName;
              if(item.cityBeanList){
                item.cityBeanList.forEach((item2,i)=>{
                  if(item2.districtBeans.length>0)item2.children=item2.districtBeans;
                  item2.value=item2.regionId;
                  item2.label=item2.regionName;
                  if(item2.districtBeans){
                    item2.districtBeans.forEach((item3,i)=>{
                      item3.value=item3.regionId;
                      item3.label=item3.regionName;
                      if(item3.areaBeanList.length>0)item3.children = item3.areaBeanList;
                      if (item3.areaBeanList) {
                        item3.areaBeanList.forEach((item4, i) => {
                          item4.value = item4.regionId;
                          item4.label = item4.regionName;
                        })
                      }
                    })
                  }
                })
              }
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //获取店铺仓库快递list
      getQueryInit() {
        console.log(this.params);
        this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/getPageElement").then((response) => {
          if (response.data.code == 0) {
            this.elem_store = response.data.result.elem_store;
            this.elem_storage = response.data.result.elem_storage;
            this.expressList = response.data.result.elem_express;
            this.orderBaseDetail();
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })

        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateNoteMsgCheck",{
          orderIds:this.salesOrderId
        }).then((response) => {
          if (response.data.success) {
            this.internalDisabled = response.data.result?false:true;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateStorageMsgCheck",{
          orderIds:this.salesOrderId
        }).then((response) => {
          if (response.data.success) {
            this.auditDisabled = response.data.result?false:true;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      }
    },
    mounted(){
      //console.log(JSON.parse(sessionStorage.getItem('proCityData')));
      //点击表头动态切换样式
      var self = this;
      $('.detail-box').on('scroll',function () {
        var h1 =  self.$refs.title1.offsetTop - 75,
          h2 = self.$refs.title2.offsetTop - 75,
          h3 = self.$refs.title3.offsetTop - 75,
          h4 = self.$refs.title4.offsetTop - 75,
          h5 = self.$refs.title5.offsetTop - 75;
        if ($('.detail-box').scrollTop() > h1 && $('.detail-box').scrollTop() < h2) {
          self.titleData.map(function (v, i) {
            i == 0 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h2 && $('.detail-box').scrollTop() < h3) {
          self.titleData.map(function (v, i) {
            i == 1 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h3 && $('.detail-box').scrollTop() < h4) {
          self.titleData.map(function (v, i) {
            i == 2 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h4 && $('.detail-box').scrollTop() < h5) {
          self.titleData.map(function (v, i) {
            i == 3 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h5) {
          self.titleData.map(function (v, i) {
            i == 4 ? v.iscur = true : v.iscur = false;
          });
        }
      })
    },
    created() {
      this.proCityArea();
      this.getQueryInit();
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped >
  .classFlag{
    margin-left:40px;
  }
  .ellipsis{
    width:142px;display:inline-block;margin-bottom:-5px;
  }
  .line-child{
    flex:1;
  }
  #detail-container {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 75px 0px 55px 0px;
  }

  .detail-box {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding-right: 15px;
  }

  #topTitle .cur {
    height: 99%;
    border-bottom: 1px solid #999;
    color: #25BAFF;
  }

  #topTitle {
    left: 0;
    top: 45px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    z-index: 10;
    position: absolute;
    width: 100%;
  }

  #topTitle li {
    float: left;
    width: 20%;
    height: 100%;
    min-width: 100px;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    background: #f4f4f4;
    cursor: pointer;
  }

  #topTitle li a {
    display: inline-block;
    text-align: center;
    text-decoration: none;
    width: 100%;
    height: 100%;
    color: #848484;
    box-sizing: border-box;
  }

  .fixd {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: space-around;
    background: white !important;
  }

  .container {
    overflow-y: visible;
  }

  .itemStyle {
    width: 120px;
  }

  .el-tb-edit .el-input {
    display: none;
    width: 100%;
  }

  [v-cloak] {
    display: none !important;
  }

  .el-tb-edit .current-row .el-input {
    display: inherit;
  }

  .el-tb-edit .current-row .el-input + span {
    display: none;
  }

  #titleBar {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 28px;
  }

  .titleBtn {
    background-color: transparent;
    border: none;
  }

  #pageTool {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 100;
  }

  #bottomBtn {
    margin-top: 25px;
  }

  .btnStyle {
    width: 100px;
  }

  .formarWidth {
    width: 115px;
  }

  .btnStyle:hover {
    background-color: #409eff;
    color: white;
  }

  .formatLine {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    margin-left:5px;
  }

  .clearStyle {
    width: 50px !important;
    border: none;
    background-color: transparent;
  }

  .helpNum {
    width: 58% !important;
    position: absolute !important;
    left: 10% !important;
    top: 32% !important;
    padding-left: 15% !important;
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

  .title {
    display: inline-block;
    margin-top: 20px;
    margin-left: 10px;
    font-weight: 600;
    font-size: 14px;
  }

  #titleBar li {
    float: left;
    text-align: center;
    height: 25px;
    cursor: pointer;
    width: 100px;
  }
  #titleBar li span {
    display: inline-block;
    width: 100%;
    line-height: 28px;
  }

  #titleBar span:hover {
    color: #323941;
    border-radius: 0;
    border-bottom: solid 2px #3d4144;
  }

  .titleActive {
    color: #323941;
    border-radius: 0;
    padding-bottom: 28px !important;
    border-bottom: solid 2px #3d4144;
  }
</style>
<style>
  .el-breadcrumb__inner{
    font-weight:700;
    cursor:pointer;
  }
</style>
