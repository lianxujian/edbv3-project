<!--售后处理 贾南风-->
<template>
  <div>
    <div id="afterSaleDispose" v-show="paramsObj.mainPageShow">
      <div id="searchBox" class="searchBox">
        <div class="query-button" style="margin-left: -30px"><!--查询区-->
          <div class="grid-content" style="white-space: nowrap;">
            <label for="example-post">店铺</label>
            <select id="example-post" name="multiselect[]" multiple="multiple">
              <option v-for="item in shop" :value="item.value">{{item.label}}</option>
            </select>
          </div>
          <div class="grid-content" style="margin-left: 20px">
            <el-select style="width: 100px!important;" v-model="addQuery.receiveType" clearable placeholder="请选请选">
              <el-option
                v-for="item in custom"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input style="width: 200px!important;" v-model="addQuery.receiveInfo" placeholder="请输入内容"></el-input>
          </div>
          <div class="grid-content">
            <label>售后类型</label>
            <el-select style="width: 200px!important;" v-model="addQuery.afterSaleType" clearable placeholder="请选择">
              <el-option
                v-for="item in afterType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content">
            <label>是否异常</label>
            <el-select style="width: 200px!important;" v-model="addQuery.exceptionFlag" clearable placeholder="请选择">
              <el-option
                v-for="item in abnormal"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content" id="shop-box">
            <label>商品</label>
            <el-input style="width: 200px!important;" v-model="addQuery.barCodes"></el-input>
            <i class="el-icon-close error" @click="addQuery.barCodes=''"></i> <!--X-->
            <span class="dot" @click="clickShop">...</span><!--...-->
          </div>
          <div class="grid-content">
            <label>处理状态</label>
            <el-select style="width: 200px!important;" v-model="addQuery.dealStatus" placeholder="请选择">
              <el-option
                v-for="(item,i) in manageState"
                :key="i"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content special">
            <label>退换补状态</label>
            <el-select style="width: 200px!important;" v-model="addQuery.returnGoodsStatus" clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in returns"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content">
            <label>退款状态</label>
            <el-select style="width: 200px!important;" v-model="addQuery.refundStatus" clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in returnS"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content">
            <label>单据来源</label>
            <el-select style="width: 200px!important;" v-model="addQuery.source" clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in bills"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content">
            <label>平台发货状态</label>
            <el-select style="width: 200px!important;" v-model="addQuery.ecSendStatus" clearable placeholder="请选择">
              <el-option
                v-for="(item,index) in bills2"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content">
            <label>申请时间</label>
            <el-date-picker
              style="width: 290px;border: 1px solid  #DBDEE5!important;"
              v-model="value4"
              type="datetimerange"
              :clearable="false"
              range-separator="-"
              format="yyyy/MM/dd HH:mm:ss"
              @blur="dateChange"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <span class="button-span" :class="{ span1: isActive1 }" @click="nowTime">今天</span>
            <span class="button-span" :class="{ span1: isActive2 }" @click="sevenTime">近7天</span>
            <span class="button-span" :class="{ span1: isActive3 }" @click="thirtyTime">近30天</span>

          </div>
        </div>
        <div class="rightBox3">
          <el-button type="primary" @click="queryData()">查 询</el-button>
          <el-button @click="resetData">重 置</el-button>
        </div>
      </div>
      <div style="clear:both"></div>
      <div class="ledgement"></div>
      <div class="col-nav" style="margin:-10px 0 10px;">
        <ul>
          <li @click="addBill()"><span>添加售后单</span></li>
          <li @click="agreeReturn"><span>同意退换补</span></li>
          <li @click="agreeMoney"><span>同意退款</span></li>
          <li @click="refusedM"><span>拒绝退款</span></li>
          <li @click="clickSign"><span>标记异常</span></li>
          <li @click="saveTableSet"><span>保存表格设置</span></li>
        </ul>
      </div>
      <div class="col-border">
         <!--  <template>
             <el-table
               :data="tableData"
               border
               id="fitTable"
               :height="table_h"
               :row-class-name="tableRowClassName"
               tooltip-effect="dark"
               @selection-change="handleSelectionChange"
               style="width: 100%">
               <el-table-column
                 width="50"
                 fixed="left"
                 align="center"
                 type="index"
                 label="序号">
               </el-table-column>
               <el-table-column
                 fixed="left"
                 align="center"
                 type="selection"
                 width="55">
               </el-table-column>
               <el-table-column
                 align="center"
                 label="异常标记"
                 width="100">
                 <template slot-scope="scope">
                   <div v-if="scope.row.exceptionFlag == true && !scope.row.timeoutTime">
                     <el-tooltip v-if="scope.row.signReason" class="item" effect="dark" :content="scope.row.signReason"
                                 placement="right-start">
                       <el-button type="text" style="color: #F97D37">异常</el-button>
                     </el-tooltip>
                     <el-button v-else type="text" style="color: #F97D37">异常</el-button>
                   </div>

                   <div v-if="scope.row.exceptionFlag == true && scope.row.timeoutTime < new Date().getTime()">
                     <el-tooltip class="item" effect="dark" content="售后单已超时" placement="right-start">
                       <el-button type="text" style="color: #F97D37">超时</el-button>
                     </el-tooltip>
                   </div>
                   &lt;!&ndash;<span v-if="scope.row.exceptionFlag == true && scope.row.timeoutTime == undefined">异常</span>&ndash;&gt;
                   &lt;!&ndash;<div style="position: relative;left: 70px;bottom: 25px;z-index: 1000000;text-align: left;background: #eee">{{scope.row.signReason}}</div>&ndash;&gt;
                   &lt;!&ndash;<span v-if="scope.row.exceptionFlag == true && scope.row.timeoutTime < new Date().getTime()"></span>&ndash;&gt;
                 </template>
               </el-table-column>
               <el-table-column
                 sortable
                 :sort-method="sortMethod"
                 align="center"
                 width="150"
                 label="售后单号">
                 <template slot-scope="scope">
                   <span @click="clickDetail(scope.row)"
                         style="cursor: pointer;color: #3684F2">{{scope.row.afterSalesNo}}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 prop="outAfterSalesNo"
                 align="center"
                 label="外部售后单号"
                 width="120">
               </el-table-column>
               <el-table-column
                 align="center"
                 label="售后类型"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.asType == 1">退货退款</span>
                   <span v-if="scope.row.asType == 2">仅退款</span>
                   <span v-if="scope.row.asType == 3">换货</span>
                   <span v-if="scope.row.asType == 4">补发</span>
                 </template>
               </el-table-column>
               <el-table-column
                 align="center"
                 label="处理状态"
                 width="100">
                 <template slot-scope="scope">
                   <span v-if="scope.row.dealStatus == 1">未处理</span>
                   <span v-if="scope.row.dealStatus == 2">处理中</span>
                   <span v-if="scope.row.dealStatus == 3">已完成</span>
                   <span v-if="scope.row.dealStatus == 4">已作废</span>
                   <span v-if="scope.row.dealStatus == 5">已终结</span>
                 </template>
               </el-table-column>
               <el-table-column
                 label="退款状态"
                 align="center"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.refundStatus == 1">未退款</span>
                   <span v-if="scope.row.refundStatus == 2">拒绝退款</span>
                   <span v-if="scope.row.refundStatus == 3">退款成功</span>
                   <span v-if="scope.row.refundStatus == 4">取消退款</span>
                 </template>
               </el-table-column>
               <el-table-column
                 label="平台发货状态"
                 align="center"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.ecSendStatus == 1">未发货</span>
                   &lt;!&ndash;<span v-if="scope.row.ecSendStatus == 2">部分发货</span>&ndash;&gt;
                   <span v-if="scope.row.ecSendStatus == 3">已发货</span>
                 </template>
               </el-table-column>
               <el-table-column
                 label="退换补状态"
                 align="center"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.returnGoodsStatus == 1">未退货</span>
                   <span v-if="scope.row.returnGoodsStatus == 2">同意退货</span>
                   <span v-if="scope.row.returnGoodsStatus == 3">部分收货</span>
                   <span v-if="scope.row.returnGoodsStatus == 4">全部收货</span>
                   <span v-if="scope.row.returnGoodsStatus == 5">拒绝退货</span>
                   <span v-if="scope.row.returnGoodsStatus == 6">未换货</span>
                   <span v-if="scope.row.returnGoodsStatus == 7">同意换货</span>
                   <span v-if="scope.row.returnGoodsStatus == 8">拒绝换货</span>
                   <span v-if="scope.row.returnGoodsStatus == 9">取消换货</span>
                   <span v-if="scope.row.returnGoodsStatus == 10">未补发</span>
                   <span v-if="scope.row.returnGoodsStatus == 11">同意补发</span>
                 </template>
               </el-table-column>
               <el-table-column
                 sortable
                 align="right"
                 label="退款总金额"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.asType == 4"> - </span>
                   <span v-else>{{scope.row.totalRefundAmt}}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 sortable
                 align="right"
                 label="额外退款金额"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.asType == 4"> - </span>
                   <span v-else>{{scope.row.otherRefundAmt}}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 sortable
                 align="right"
                 label="申请退款金额"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.asType == 4 || scope.row.asType == 3"> - </span>
                   <span v-else>{{scope.row.applyRefundAmt}}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 sortable
                 prop="factRefundAmt"
                 align="right"
                 label="实际退款金额"
                 width="120">
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 label="额外退款原因"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.asType == 4"> - </span>
                   <span v-else>{{scope.row.otherRefundReasonName}}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 prop="returnGoodsName"
                 label="退换补原因"
                 width="120">
               </el-table-column>
               <el-table-column
                 sortable
                 prop="applyTime"
                 label="申请时间"
                 width="135">
               </el-table-column>
               <el-table-column
                 sortable
                 prop="timeout"
                 label="超时时间"
                 align="center"
                 width="135">
               </el-table-column>
               <el-table-column
                 sortable
                 prop="payTime"
                 label="付款时间"
                 width="135">
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 label="线上状态"
                 align="center"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.onlineStatus == 1">买家已申请退款，等待卖家同意</span>
                   <span v-if="scope.row.onlineStatus == 2">卖家同意退款，等待买家退货</span>
                   <span v-if="scope.row.onlineStatus == 3">买家已退货，等待卖家确认收货</span>
                   <span v-if="scope.row.onlineStatus == 4">卖家拒绝退款</span>
                   <span v-if="scope.row.onlineStatus == 5">退款成功</span>
                   <span v-if="scope.row.onlineStatus == 6">退款关闭</span>
                   <span v-if="scope.row.onlineStatus == 11">换货待处理</span>
                   <span v-if="scope.row.onlineStatus == 12">待买家退货</span>
                   <span v-if="scope.row.onlineStatus == 13">买家已退货，待收货</span>
                   <span v-if="scope.row.onlineStatus == 14">换货关闭</span>
                   <span v-if="scope.row.onlineStatus == 15">换货成功</span>
                   <span v-if="scope.row.onlineStatus == 16">待买家修改</span>
                   <span v-if="scope.row.onlineStatus == 17">待发出换货商品</span>
                   <span v-if="scope.row.onlineStatus == 18">待买家收货</span>
                   <span v-if="scope.row.onlineStatus == 19">请退款</span>
                 </template>
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 prop="buyerNick"
                 label="买家ID"
                 align="center"
                 width="120">
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 align="center"
                 label="退回快递公司"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.asType == 4"> - </span>
                   <span v-else>{{scope.row.expressCoName}}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 label="退回快递单号"
                 align="center"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.asType == 4"> - </span>
                   <span v-else>{{scope.row.returnExpressNos}}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 label="平台单号"
                 width="160">
                 <template slot-scope="scope">
                   <span v-if="scope.row.replaceSourceOrderNo"> {{scope.row.replaceSourceOrderNo}}</span>
                   <span v-else> {{scope.row.sourceOrderNo}}</span>
                 </template>
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 prop="salesOrderNos"
                 align="center"
                 label="订单号"
                 width="120">
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 prop="storeName"
                 align="center"
                 label="店铺"
                 width="120">
               </el-table-column>
               <el-table-column
                 align="center"
                 label="单据来源"
                 width="120">
                 <template slot-scope="scope">
                   <span v-if="scope.row.sourceOrderType == 1">线上下载</span>
                   <span v-if="scope.row.sourceOrderType == 2">手工下单</span>
                 </template>
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 prop="customerReturnMsg"
                 align="center"
                 label="买家退换货留言"
                 width="120">
               </el-table-column>
               <el-table-column
                 prop="storageName"
                 :show-overflow-tooltip="true"
                 align="center"
                 label="退回仓库"
                 width="120">
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 prop="endReason"
                 align="center"
                 label="终结原因"
                 width="120">
               </el-table-column>
               <el-table-column
                 :show-overflow-tooltip="true"
                 prop="signReason"
                 align="center"
                 label="标记异常原因"
                 width="120">
               </el-table-column>
               &lt;!&ndash; <el-table-column
                  align="center"
                  label="是否标记异常"
                  width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.exceptionFlag">是</span>
                    <span v-else="scope.row.exceptionFlag">否</span>
                  </template>
                </el-table-column>&ndash;&gt;
               <el-table-column
                 fixed="right"
                 label="操作"
                 align="center"
                 width="280">
                 <template slot-scope="scope">
                   <el-button type="text" size="small" @click="returnNo(scope.row)"
                              v-if="scope.row.asType == 1 && scope.row.returnGoodsStatus == 1 && scope.row.dealStatus == 1 && scope.row.ecId == 51 && scope.row.sourceOrderType == 1">
                     拒绝退货
                   </el-button>&lt;!&ndash; && scope.row.ecId == 51 && scope.row.sourceOrderType == 1&ndash;&gt;
                   <el-button type="text" size="small" style="color: #B6B6B6;cursor: default" v-else>拒绝退货</el-button>
                   <el-button @click="clickCancel(scope.row)"
                              v-if="scope.row.sourceOrderType == 2 && (scope.row.dealStatus == 1 || scope.row.dealStatus == 2) && (scope.row.returnGoodsStatus == 1 || scope.row.returnGoodsStatus ==2 || scope.row.returnGoodsStatus ==6 || scope.row.returnGoodsStatus ==7 || scope.row.returnGoodsStatus ==10 || scope.row.returnGoodsStatus ==11)"
                              type="text" size="small">作废
                   </el-button>
                   <el-button type="text" size="small" style="color: #B6B6B6;cursor: default" v-else>作废</el-button>
                   <el-button @click="clickEnd(scope.row)" type="text" size="small"
                              v-if="(scope.row.asType == 1 && scope.row.refundStatus == 3 && (scope.row.returnGoodsStatus == 2 || scope.row.returnGoodsStatus == 3) && scope.row.dealStatus == 2) ||
                            (scope.row.asType == 2 && scope.row.refundStatus == 3 && (scope.row.returnGoodsStatus == 1 || scope.row.returnGoodsStatus == 3) && scope.row.dealStatus == 2) ||
                             (scope.row.asType == 3 && scope.row.returnGoodsStatus == 3 && scope.row.replaceOrderSendStatus == 3 && scope.row.dealStatus == 2)">
                     终结
                   </el-button>
                   <el-button type="text" size="small" style="color: #B6B6B6;cursor: default" v-else>终结</el-button>
                   <el-button type="text" size="small"
                              v-if="scope.row.asType == 3 && scope.row.returnGoodsStatus == 6 && scope.row.dealStatus == 1"
                              @click="clickNo(scope.row)">拒绝换货
                   </el-button>
                   <el-button type="text" size="small" v-else style="color: #B6B6B6;cursor: default">拒绝换货</el-button>
                   <el-button @click="clickMoney(scope.row)"
                              v-if="((scope.row.asType == 2 && scope.row.dealStatus == 1) || scope.row.dealStatus == 2) && scope.row.refundStatus == 1 && ((scope.row.asType == 1 && (scope.row.returnGoodsStatus == 2 || scope.row.returnGoodsStatus == 3 || scope.row.returnGoodsStatus == 4)) || scope.row.asType == 2)"
                              type="text" size="small">同意退款
                   </el-button>
                   <el-button v-else style="color: #B6B6B6;cursor: default" type="text" size="small">同意退款</el-button>
                 </template>
               </el-table-column>
             </el-table>
           </template>-->
        <!--ag-gird表格-->

        <ag-grid-vue :style='{"height":table_h+"px","width": "100%"}'
                     class="ag-theme-balham ag-table"
                     :gridOptions="gridOptions"
                     :columnDefs="columnDefs"
                     :rowData="tableData"
                     rowSelection="multiple"
                     :enableFilter="true"
                     :enableSorting="true"
                     :enableColResize="true"
                     :components="components"
                     :gridReady="onGridReady"
        >
        </ag-grid-vue>

      </div>
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100,200]"
          :page-size="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
      <!--同意退货的失败列表-->
      <div>
        <el-dialog v-dialogDrag
                   title="提示"
                   :close-on-click-modal="false"
                   :visible.sync="dialogFlied"
                   width="600px"
        >
          <span>共执行{{agreeFiled.totalQty}}单，执行成功{{agreeFiled.successQty}}单，执行失败{{agreeFiled.failQty}}单</span>
          <div style="margin-top: 5px">
            <el-table
              :data="agreeFiled.failRows"
              border
              style="width: 100%">
              <el-table-column
                prop="afterSaleNo"
                label="售后单号">
              </el-table-column>
              <el-table-column
                prop="failReason"
                label="失败原因">
              </el-table-column>
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFlied = false">关 闭</el-button>
        </span>
        </el-dialog>
      </div>
      <!--查询商品弹框-->
      <div id="pop-up">
        <el-dialog v-dialogDrag
                   title="请选择所查询商品"
                   :close-on-click-modal="false"
                   :visible.sync="dialogVisible"
                   width="730px"
        >
          <div id="input-box">
            <el-row>
              <el-col :span="18">
                <div class="grid-content bg-purple">
                  <el-input v-model="findShop.goodsCode" style="width: 100px!important;margin-right: 19px"
                            placeholder="请输入商品编号"></el-input>
                  <el-input v-model="findShop.barCode" style="width: 100px!important;margin-right: 19px"
                            placeholder="输入条形码"></el-input>
                  <el-input v-model="findShop.goodsName" style="width: 100px!important;margin-right: 19px"
                            placeholder="请输入商品名称"></el-input>
                  <el-input v-model="findShop.goodsSpec" style="width: 100px!important;"
                            placeholder="请输入商品规格"></el-input>
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
    <el-button @click="dialogVisible = false">返回</el-button>
    <el-button type="primary" @click="ChooseSure">确认选择</el-button>
  </span>
        </el-dialog>
      </div>

    </div>
    <!--请填写拒绝退款原因-->
    <div id="textarea-box" class="textarea-box">
      <el-dialog v-dialogDrag
                 title="请填写拒绝退款原因"
                 :close-on-click-modal="false"
                 :visible.sync="rejectVisible"
                 width="600px"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          v-model="refusedArgument.refuseReason"
          placeholder="最多输入200个字符"
          :maxlength="200"
        >
        </el-input>
        <div style="width: 100%;text-align: right;padding: 30px 0 0 0;margin-bottom: -5px">
          <el-button @click="rejectVisible = false" style="width: 63px!important;">取消</el-button>
          <el-button type="primary" @click="sureSubmit" style="width: 63px!important;">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--请填写作废原因-->
    <div>
      <el-dialog v-dialogDrag
                 title="请填写作废原因"
                 :close-on-click-modal="false"
                 :visible.sync="cancelVisible"
                 width="600px"
      >
        <el-input
          type="textarea"
          v-model="cancelBill.invalidReason"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder="最多输入200个字符"
          :maxlength="200"
        >
        </el-input>
        <div style="width: 100%;text-align: right;padding: 30px 0 0 0;margin-bottom: -5px">
          <el-button @click="cancelVisible = false" style="width: 63px!important;">取消</el-button>
          <el-button type="primary" @click="cancelSubmit" style="width: 63px!important;">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--请填写终结原因-->
    <div>
      <el-dialog v-dialogDrag
                 title="请填写终结原因"
                 :close-on-click-modal="false"
                 :visible.sync="endVisible"
                 width="600px"
      >
        <el-input
          type="textarea"
          v-model="endBill.endReason"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder="最多输入200个字符"
          :maxlength="200"
        >
        </el-input>
        <div style="width: 100%;text-align: right;padding: 30px 0 0 0;margin-bottom: -5px">
          <el-button @click="endVisible = false" style="width: 63px!important;">取消</el-button>
          <el-button type="primary" @click="endSubmit" style="width: 63px!important;">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--请填写标记异常原因-->
    <div>
      <el-dialog v-dialogDrag
                 title="请填写标记异常原因"
                 :close-on-click-modal="false"
                 :visible.sync="signVisible"
                 width="600px"
      >
        <el-input
          type="textarea"
          v-model="signAfterSale.signReason"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder="最多输入200个字符"
          :maxlength="200"
        >
        </el-input>
        <div style="width: 100%;text-align: right;padding: 30px 0 0 0;margin-bottom: -5px">
          <el-button @click="signVisible = false" style="width: 63px!important;">取消</el-button>
          <el-button type="primary" @click="sureSign" style="width: 63px!important;">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--上传凭证-->
    <div>
      <el-dialog v-dialogDrag
                 title="请上传拒绝退货凭证"
                 :close-on-click-modal="false"
                 :visible.sync="uploadVisible"
                 width="600px"
      >
        <div style="width: 150px;height: 150px;overflow: hidden;margin-left: 33%">
          <el-upload
            class="avatar-uploader"
            :action="`http://${imgUpload}/files-web/upload1`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div style="width: 100%;text-align: right;padding: 30px 0 0 0;margin-bottom: -5px">
          <el-button @click="uploadVisible = false" style="width: 63px!important;">取消</el-button>
          <el-button type="primary" @click="clickUpload" style="width: 63px!important;">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--同意退款弹框-->
    <div id="pop-up1">
      <el-dialog v-dialogDrag
                 title="同意退款实退金额确认"
                 :close-on-click-modal="false"
                 :visible.sync="dialogVisible1"
                 width="730px"
      >
        <div>
          <el-table
            :data="agreeData"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange1"
            border
            :height="500"
            style="width: 100%">
            <el-table-column
              fixed="left"
              type="index"
              align="center"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="商品"
              width="180">
              <template slot-scope="scope">
                <img :src="scope.row.goodsImage" alt=""
                     style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                <span v-if="scope.row.suitFlag">[套]</span>
                <span v-if="scope.row.giftFlag">[赠]</span>
                <span>{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="goodsBarCode"
              width="140"
              :show-overflow-tooltip="true"
              label="条形码">
            </el-table-column>
            <el-table-column
              align="center"
              prop="goodsSpec"
              width="56"
              :show-overflow-tooltip="true"
              label="规格">
            </el-table-column>
            <el-table-column
              align="center"
              prop="goodsQty"
              width="120"
              :show-overflow-tooltip="true"
              label="订货数量">
            </el-table-column>
            <el-table-column
              align="right"
              prop="applyReturnQty"
              width="105"
              :show-overflow-tooltip="true"
              label="申请退换补数量">
            </el-table-column>
            <el-table-column
              align="right"
              prop="applyRefundAmt"
              width="105"
              :show-overflow-tooltip="true"
              label="申请退款金额">
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              width="120"
              :show-overflow-tooltip="true"
              label="实际退款金额">
              <template slot-scope="scope">
                <!--@keyup.native="scope.row.factRefundAmt = scope.row.factRefundAmt.replace(/[^\d]/g,'')"-->
                <el-input v-model="scope.row.factRefundAmt"
                          type="number"
                          @keyup.native="scope.row.factRefundAmt = scope.row.factRefundAmt.replace(/[^\d]/g,'')"
                          :class="{styleColor:indexReg == scope.$index && classReg == 'factRefundAmt'}"
                          @blur="returnReg(scope.row)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width: 100%;text-align: right;margin-top: 10px">
          <el-button @click="dialogVisible1 = false">返回</el-button>
          <el-button type="primary" @click="sureSuit">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--拒绝换货弹框-->
    <div id="textarea-box1" class="textarea-box">
      <el-dialog v-dialogDrag
                 title="请填写拒绝换货原因"
                 :close-on-click-modal="false"
                 :visible.sync="noShopVisible"
                 width="600px"
      >
        <el-row style="margin-bottom: 10px">
          <el-col :span="5">
            <div class="titleS">
              拒绝换货原因
            </div>
          </el-col>
          <el-col :span="19">
            <div>
              <el-select v-model="rejectA.sellerRefuseReasonId" placeholder="请选择" :class="{styleColor: isHave}"
                         @click.native="clickSelect">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px">
          <el-col :span="5">
            <div class="titleS">
              拒绝换货凭证
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-upload
                class="avatar-uploader"
                ref='upload'
                :action="`http://${imgUpload}/files-web/upload1`"
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :before-upload="beforeAvatarUpload1">
                <img v-if="imageUrlH" :src="imageUrlH" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="10">
            <div style="height: 125px;line-height: 125px;color: #4BA9FF">
              仅可上传JPG、JPEG和PND格式图片
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <div class="titleS">
              拒绝换货备注
            </div>
          </el-col>
          <el-col :span="19">
            <div>
              <el-input
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 8}"
                v-model="rejectA.refuseRemark"
                placeholder="最多输入200个字符"
                :maxlength="200"
              >
              </el-input>
            </div>
          </el-col>
        </el-row>
        <div style="width: 100%;text-align: right;padding: 30px 0 0 0;margin-bottom: -5px">
          <el-button @click="noShopVisible = false" style="width: 63px!important;">取消</el-button>
          <el-button type="primary" @click="rejectData" style="width: 63px!important;">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!--添加售后单查询-->
    <addAfterSaleQuery v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 1" :params="paramsObj"
                       @changeShow="changeShow"></addAfterSaleQuery>
    <!--添加售后单-->
    <addAfterSale v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 2" :params="paramsObj"
                  @changeShow="changeShow" :platNum="paramsObj.platNum" :orderId="paramsObj.orderId"
                  :sendStatus="paramsObj.sendStatus" :obj="paramsObj.obj"></addAfterSale>

    <afterSaleDetail v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 3" :params="paramsObj"
                     @changeShow="changeShow" :orderId="orderId"></afterSaleDetail>

    <addAfterSaleDetail v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 4" :params="paramsObj"
                        @changeShow="changeShow" :orderId="orderId" :exit="disabled" :refundStatus="refundStatus"
                        :dealStatus="dealStatus" :sourceOrderType="sourceOrderType"></addAfterSaleDetail>
  </div>
</template>
<script>
  import addAfterSaleQuery from '@/components/views/afterSale/children/AddAfterSaleQuery.vue' // 添加售后单查询
  import addAfterSale from '@/components/views/afterSale/children/AddAfterSale.vue' // 添加售后单
  import afterSaleDetail from '@/components/views/afterSale/children/AfterSaleDetail.vue' // 售后单详情
  import addAfterSaleDetail from '@/components/views/afterSale/children/AddAfterSaleDetail.vue' // 售后单详情
  import {turnTimestamp} from '@/assets/js/validate'
  import {AgGridVue} from "ag-grid-vue";

  export default {
    components: {
      addAfterSaleQuery, addAfterSale, afterSaleDetail, addAfterSaleDetail,
      'ag-grid-vue': AgGridVue,
       //
      orderCodeRender: {
        template: '<div><el-button @click="clickDetail(params.data)" type="text" size="small">{{params.data.afterSalesNo}}</el-button></div>',
        methods: {
          //售后单详情跳转
          clickDetail(row) {
            let _this = this.params.context
            _this.orderId = row.afterSalesNo;
            _this.refundStatus = row.refundStatus;
            _this.dealStatus = row.dealStatus;
            _this.sourceOrderType = row.sourceOrderType
            //给子级传参并显示子级
            // 已完成、已作废、已终结状态的售后单所有信息均不可编辑

            if (row.dealStatus == 3 || row.dealStatus == 4 || row.dealStatus == 5) {
              _this.paramsObj = {childrenShow: 3, mainPageShow: false}
              // 	针对于线上售后单，在处理状态为未处理以及处理中时可对额外退款金额、额外退款原因、售后备注以及额外退款流水号字段进行编辑（规则同添加售后单） ||
              // 处理中时仅可对额外退款金额、额外退款原因、售后备注以及额外退款流水号字段进行编辑（规则同添加售后单）
            } else if ((row.sourceOrderType == 1 && (row.dealStatus == 1 || row.dealStatus == 2)) || row.dealStatus == 2) {
              if (row.asType == 4) {
                _this.paramsObj = {childrenShow: 3, mainPageShow: false}
              } else {
                _this.disabled = 1; // 部分编辑
                _this.paramsObj = {childrenShow: 4, mainPageShow: false}
              }
              // 针对于手工下单的售后单，在处理状态为未处理前可对售后单所有信息进行修改
            } else if (row.sourceOrderType == 2 && row.dealStatus == 1) {
              _this.disabled = 2; // 都可编辑
              _this.paramsObj = {childrenShow: 4, mainPageShow: false}
            }

          },

        }
      },
       //标记异常
      orderCodeRender2: {
        template: `<div>
                   <div v-if="params.data.exceptionFlag == true && !params.data.timeoutTime">
                   <el-tooltip v-if="params.data.signReason" class="item" effect="dark" :content="params.data.signReason" placement="right-start">
                   <el-button type="text" style="color: #F97D37">异常</el-button></el-tooltip>
                   <el-button v-else type="text" style="color: #F97D37">异常</el-button></div>
                   <div v-if="params.data.exceptionFlag == true && params.data.timeoutTime < new Date().getTime()">
                   <el-tooltip class="item" effect="dark" content="售后单已超时" placement="right-start">
                   <el-button type="text" style="color: #F97D37">超时</el-button></el-tooltip></div>
                   </div>`,

      },
      //操作
      delRenderer: {

        template: `<div >

         <el-button type="text" size="small" @click="returnNo(params.data)" v-if="params.data.asType == 1 && params.data.returnGoodsStatus == 1 && params.data.dealStatus == 1 && params.data.ecId == 51 && params.data.sourceOrderType == 1">拒绝退货</el-button>
         <el-button type="text" size="small" style="color: #B6B6B6;cursor: default" v-else>拒绝退货</el-button>
         <el-button @click="clickCancel(params.data)" v-if="params.data.sourceOrderType == 2 && (params.data.dealStatus == 1 || params.data.dealStatus == 2) && (params.data.returnGoodsStatus == 1 || params.data.returnGoodsStatus ==2 || params.data.returnGoodsStatus ==6 ||
          params.data.returnGoodsStatus ==7 || params.data.returnGoodsStatus ==10 || params.data.returnGoodsStatus ==11)" type="text" size="small">作废
          </el-button>
         <el-button type="text" size="small" style="color: #B6B6B6;cursor: default" v-else>作废</el-button>
         <el-button @click="clickEnd(params.data)" type="text" size="small" v-if="(params.data.asType == 1 && params.data.refundStatus == 3 && (params.data.returnGoodsStatus == 2 || params.data.returnGoodsStatus == 3) && params.data.dealStatus == 2) ||
                         (params.data.asType == 2 && params.data.refundStatus == 3 && (params.data.returnGoodsStatus == 1 || params.data.returnGoodsStatus == 3) && params.data.dealStatus == 2) ||
                          (params.data.asType == 3 && params.data.returnGoodsStatus == 3 && params.data.replaceOrderSendStatus == 3 && params.data.dealStatus == 2)">终结
         </el-button>
         <el-button type="text" size="small" style="color: #B6B6B6;cursor: default" v-else>终结</el-button>
         <el-button type="text" size="small" v-if="params.data.asType == 3 && params.data.returnGoodsStatus == 6 && params.data.dealStatus == 1" @click="clickNo(params.data)">拒绝换货</el-button>
         <el-button type="text" size="small" v-else style="color: #B6B6B6;cursor: default">拒绝换货</el-button>
         <el-button @click="clickMoney(params.data)" v-if="((params.data.asType == 2 && params.data.dealStatus == 1) ||params.data.dealStatus == 2) && params.data.refundStatus == 1 && ((params.data.asType == 1 && (params.data.returnGoodsStatus == 2 || params.data.returnGoodsStatus == 3 || params.data.returnGoodsStatus == 4)) || params.data.asType == 2)"
                           type="text" size="small">同意退款</el-button>
         <el-button v-else style="color: #B6B6B6;cursor: default" type="text" size="small">同意退款</el-button>

        </div>`,
        methods: {
          // 点击表格的拒绝退货
          returnNo(row) {
            let _this = this.params.context
            _this.imageUrl = ''; // 置空之前的
            _this.uploadVisible = true; // 弹框
            _this.assOrderId = row.afterSalesId; // 保存当前售后单ID
          },
          // 表格里的点击作废按钮
          clickCancel(row) {
            let _this = this.params.context
            _this.cancelBill.invalidReason = '';// 置空之前的
            _this.cancelBill.afterSalesId = row.afterSalesId;// 售后单ID赋值
            _this.cancelVisible = true;// 显示弹框
          },

          // 表格里的点击终结按钮
          clickEnd(row) {
            let _this = this.params.context
            _this.endBill.endReason = ''; // 置空之前的
            _this.endBill.afterSalesId = row.afterSalesId; // 售后单ID赋值
            _this.endVisible = true; // 显示弹框
          },

          // 点击拒绝换货
          clickNo(row) {
            let _this = this.params.context
            if (row.sourceOrderType == 1) {// 线上下载
              // 调用店铺接口
              _this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + _this.version + '/findEditBeanById', {storeId: row.storeId})
                .then(res => {
                  if (res.data.success) {
                    // 获取店铺token 调用拒绝换货接口  线上
                    _this._post('com.edb01.erp.ass.service.api.AfterSaleOptionServiceBiz/' + _this.version + '/getRefundRefuseReason', {
                      storeToken: res.data.result.token,
                      disputeId: row.outAfterSalesNo
                    })
                      .then(response => {
                        if (response.data.success) {
                          _this.options = response.data.result;
                        }
                      })
                  }
                })
            } else { // 手工下载
              _this.options = [
                {id: 1, text: '库存不足或商品已下架'},
                {id: 2, text: '申请时间已超7天无理由换货时限'},
                {id: 3, text: '定制商品不支持换货'},
                {id: 4, text: '已经影响商品完好'},
                {id: 5, text: '非包邮商品运费未达成一致'},
                {id: 6, text: '与买家达成一致'},
                {id: 7, text: '所换商品差价，未协商一致'},
                {id: 8, text: '其他'}
              ]
            }
            _this.isHave = false;
            _this.imageUrlH = '';
            _this.noShopVisible = true;
            _this.rejectA.assOrderId = row.afterSalesId;// 售后单Id

            // 清空数据
            _this.rejectA.sellerRefuseReasonId = '';
            _this.rejectA.refuseReason = '';
            _this.rejectA.fileId = '';
            _this.rejectA.refuseRemark = '';
          },

          // 点击操作同意退款
          clickMoney(row) {
            let _this = this.params.context
            _this.shopOrderId = row.afterSalesId; // 保存订单ID
            _this.dialogVisible1 = true;
            _this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + _this.version + '/getAfterSaleItem', {afterSalesId: row.afterSalesId})
              .then(res => {
                if (res.data.success) {
                  res.data.result.forEach(item => {
                    item.factRefundAmt = item.applyRefundAmt;
                  });
                  _this.agreeData = res.data.result;
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })

          },


        }

      }


    },
    data() {
      return {
        gridOptions: {
          //国际化（设置显示文字）
          context: this,
          enableColResize: true,//可拖动改变列宽度
          suppressExcelExport: true,//关闭excel导出
          suppressCsvExport: true,//关闭csv导出
          /*rowHeight:50,*/
          enableRangeSelection: true,//可复制多行多单元格
          suppressCopyRowsToClipboard: true,//当启用行单击选择和范围选择时，如果您希望让范围优先，则快捷方式将复制所选行而不是所选范围
          suppressRowClickSelection: true,//阻止单击行选中本行
          enableSorting: true,
          enableBrowserTooltips: true, //tite
          localeText: {
            noRowsToShow: '暂无数据',
            pinColumn: "固定列",
            pinLeft: '居左',
            pinRight: '居右',
            noPin: '默认',
            autosizeThiscolumn: '自适应当前列',
            autosizeAllColumns: '自适应所有列',
            resetColumns: '重置列',
            toolPanel: '工具板',
            blanks: '空白',
            selectAll: '全选',
            searchOoo: '搜索',
            filterOoo: '筛选',
            columns: '自定义显示列',
            groups: '行组',
            rowGroupColumnsEmptyMessage: '拖动此处以设置行组'
          }
        },//表格初始化配置
        components: null,//自定义列
        columnDefs: null,//列标题设置
        rowData: null,//表格数据
        //企业扩展
        gridApi: null,
        options: [ //拒绝换货原因
          {id: 1, text: '库存不足或商品已下架'},
          {id: 2, text: '申请时间已超7天无理由换货时限'},
          {id: 3, text: '定制商品不支持换货'},
          {id: 4, text: '已经影响商品完好'},
          {id: 5, text: '非包邮商品运费未达成一致'},
          {id: 6, text: '与买家达成一致'},
          {id: 7, text: '所换商品差价，未协商一致'},
          {id: 8, text: '其他'}
        ],
        imgUpload: process.env.FILE_API,// 图片URL
        dialogImageUrl: '',//上传图片路径
        imageUrl: '', // 拒绝退货
        imageUrlH: '', // 拒绝换货
        dialogVisible2: false,
        dialogFlied: false, // 同意退货的失败列表
        version: '1.0.0', //版本号
        query: () => {
        }, // list
        queryShop: () => {
        }, // 商品list
        table_h: 0,//表格的高度
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 数据总条数
        totalPage1: 15, // 要显示的条数
        currentPage1: 1, //
        totalNum1: 0, // 数据总条数
        dialogVisible: false, // 查询商品弹框
        rejectVisible: false, // 拒绝退款弹框
        signVisible: false, // 标记异常弹框
        uploadVisible: false, // 上传凭证
        cancelVisible: false, // 作废
        dialogVisible1: false, // 同意退款
        endVisible: false, // 终结
        noShopVisible: false, // 拒绝换货
        isHave: false,//拒绝换货原因样式
        refundStatus: '',// 退款状态
        indexReg: 'ab', // 商品明细的校验index
        classReg: '',//校验标志
        assOrderId: '', // 拒绝退货的售后单id
        file: '', // 文件的大小
        text: '',// 上传图片信息
        tableData1: [],// 查询商品
        agreeData: [], // 点击同意退款弹框列表
        checkboxAll: [], // table选中checkbox
        agreeFiled: [], // 同意退货失败成功列表
        orderId: '', // 详情单的id
        shopOrderId: '', // 点击同意退款的保存ID
        disabled: 1,// 处理状态记录
        // 拒绝退款接口参数
        refusedArgument: {
          refuseReason: '',
          assOrderIdJson: []
        },
        // 作废接口参数
        cancelBill: {
          afterSalesId: '', //售后单Id
          invalidReason: '', // 作废原因
        },
        // 终结接口参数
        endBill: {
          afterSalesId: '', //售后单Id
          endReason: '', // 作废原因
        },
        // 标记异常
        signAfterSale: {
          afterSaleIds: '',
          signReason: ''
        },
        // 查询商品参数
        findShop: {
          page: 1,   //当前页
          size: 15,   //每页条数
          goodsCode: '',   //商品编码
          barCode: '',       //条形码
          goodsName: '',  //商品名称
          goodsSpec: '',  //商品规格
        },
        addQuery: { // 查询的参数
          storeIds: '',//店铺ID,逗号隔开
          ecSendStatus: '',//发货状态
          receiveType: 4,//收货人信息类型ID 1.手机号.2.售后单号.3.快递单号.4平台单号.5.买家ID.6.收货人.7订单号
          receiveInfo: '',//收货人信息对应的值
          timeStart: new Date(new Date() - 3600 * 1000 * 24 * 7).getTime(),//开始时
          timeEnd: new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime(),//结束时间
          afterSaleType: '',//售后类型
          dealStatus: '',//处理状态
          returnGoodsStatus: '',//退货状态
          source: '',//来源
          exceptionFlag: '',//是否异常
          barCodes: '',//支持选择多条商品，匹配规则为：订单中包含所选商品中的一条即可显示
          refundStatus: '', // 退款状态（新添加参数）
          page: 1, //页码
          size: 15,//每页大小
        },
        shopList: [],//选择商品的checkBox接受值
        paramsObj: {
          mainPageShow: true
        },//子级传参
        rejectA: { // 拒绝换货的参数
          assOrderId: '', //售后单id
          sellerRefuseReasonId: '', //拒绝原因id 下拉框id
          refuseReason: '', //拒绝原因 下拉框文本
          fileId: '', //上传图片接口返回的id
          refuseRemark: '', //拒绝备注*/
        },

        returnS: [ // 退款状态
          {value: '', label: '全部'},
          {value: 1, label: '未退款'},
          {value: 2, label: '拒绝退款'},
          {value: 3, label: '退款成功'},
          {value: 4, label: '取消退款'},
        ],
        //枚举
        afterType: [ // 售后类型
          {value: '', label: '全部'},
          {value: 1, label: '退货退款'},
          {value: 2, label: '仅退款'},
          {value: 3, label: '换货'},
          {value: 4, label: '补发'},
        ],
        abnormal: [ // 是否异常
          {value: '', label: '全部'},
          {value: true, label: '是'},
          {value: false, label: '否'},
        ],
        manageState: [ // 处理状态
          {value: '', label: '全部'},
          {value: 1, label: '未处理'},
          {value: 2, label: '处理中'},
          {value: 3, label: '已完成'},
          {value: 4, label: '已作废'},
          {value: 5, label: '已终结'},
        ],
        returns: [ // 退换补状态  （宝洁新需求已修改）
          {value: '', label: '全部'},
          {value: 1, label: '未退货'},
          {value: 2, label: '同意退货'},
          {value: 3, label: '部分收货'},
          {value: 4, label: '全部收货'},
          {value: 5, label: '拒绝退货'},
          {value: 6, label: '未换货'},
          {value: 7, label: '同意换货'},
          {value: 8, label: '拒绝换货'},
          {value: 9, label: '取消换货'},
          {value: 10, label: '未补发'},
          {value: 11, label: '同意补发'}
        ],
        bills: [ // 单据来源
          {value: '', label: '全部'},
          {value: 1, label: '线上下载'},
          {value: 2, label: '手工下单'},
        ],
        bills2: [ // 发货状态
          {value: '', label: '全部'},
          {value: 1, label: '未发货'},
          {value: 3, label: '已发货'},
        ],
        //自定义查询条件
        custom: [ // 处理状态
          {value: 2, label: '售后单号'},
          {value: 3, label: '快递单号'},
          {value: 4, label: '平台单号'},
          {value: 5, label: '买家ID'},
          {value: 6, label: '收货人'},
          {value: 1, label: '手机号'},
          {value: 7, label: '订单号'}
        ],
        tableData: [],//
        //value:1,//
        value4: [],//默认显示近7天
        //input: '',
        isActive1: false, //今天
        isActive2: true, //近7天
        isActive3: false, //近30天
        shop: [], // 店铺
        sourceOrderType: ''//单据来源
      }
    },
    //列标题设置
    beforeMount() {
      this.columnDefs = [/*多选框*/ /*表头全选框*/
        {
          headerName: '序号',
          field: 'index',
          pinned: 'left',
          suppressToolPanel: true,
          suppressSorting: true,
          lockPosition: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 120,
        },

        {
          headerName: '异常标记',
          field: 'exceptionFlag',
          pinned: 'left',
          width: 100,
          cellRendererFramework: "orderCodeRender2"
        },
        {headerName: '售后单号', field: 'afterSalesNo', width: 150, cellRendererFramework: "orderCodeRender"},
        {headerName: '外部售后单号', field: 'outAfterSalesNo', width: 150,},
        {headerName: '售后类型', field: 'asType1', width: 90, },
        {headerName: '处理状态', field: 'dealStatus1', width: 90},
        {headerName: '退款状态', field: 'refundStatus1', width: 90,},
        {headerName: '平台发货状态', field: 'ecSendStatus1', width: 120},
        {headerName: '退换补状态', field: 'returnGoodsStatus1', width: 120},
        {headerName: '退款总金额', field: 'totalRefundAmt1', width: 100},
        {headerName: '额外退款金额', field: 'otherRefundAmt1', width: 120},
        {headerName: '申请退款金额', field: 'applyRefundAmt1', width: 120},
        {headerName: '实际退款金额', field: 'factRefundAmt', width: 120},
        {headerName: '额外退款原因', field: 'otherRefundReasonName1', width: 180,tooltipField: 'otherRefundReasonName1'},
        {headerName: '退换补原因', field: 'returnGoodsName', width: 180,tooltipField: 'returnGoodsName'},
        {headerName: '申请时间', field: 'applyTime', width: 180},
        {headerName: '超时时间', field: 'timeout', width: 180},
        {headerName: '付款时间', field: 'payTime', width: 180},
        {headerName: '线上状态', field: 'onlineStatus1', width: 180,tooltipField: 'onlineStatus1'},
        {headerName: '买家ID', field: 'buyerNick', width: 180},
        {headerName: '退回快递公司', field: 'expressCoName1', width: 120},
        {headerName: '退回快递单号', field: 'returnExpressNos1', width: 180},
        {headerName: '平台单号', field: 'replaceSourceOrderNo1', width: 180},
        {headerName: '订单号', field: 'salesOrderNos', width: 180,tooltipField: 'salesOrderNos'},
        {headerName: '店铺', field: 'storeName', width: 180},
        {headerName: '单据来源', field: 'sourceOrderType1', width: 180},
        {headerName: '买家退换货留言', field: 'customerReturnMsg', width: 180,tooltipField: 'customerReturnMsg'},
        {headerName: '退回仓库', field: 'storageName', width: 180},
        {headerName: '标记异常原因', field: 'signReason', width: 180,tooltipField: 'signReason'},
        {headerName: '终结原因', field: 'endReason', width: 180,tooltipField: 'endReason'},
        {headerName: '操作', field: 'button ', pinned: 'right', width: 280, cellRendererFramework: "delRenderer",},
      ];


    },


    methods: {
      //保存表格设置
      saveTableSet(){
        var setColumnState = JSON.stringify(this.gridOptions.columnApi.getColumnState());
        sessionStorage.setItem("columnStateAfterDis", setColumnState);
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
      },

      //表格初始化
      onGridReady(params) {
        if(sessionStorage.getItem("columnStateAfterDis")){
          var getColumnState = JSON.parse(sessionStorage.getItem("columnStateAfterDis"));
          this.gridOptions.columnApi.setColumnState(getColumnState);
        }
        //this.gridApi = params.api;
        // this.columnApi = params.columnApi;
        //params.api.sizeColumnsToFit();
        this.orderIds = '';
        this.gridOptions.onSelectionChanged = (event) => {
          //this.orderLists = this.getSelectedRows();
          this.checkboxAll = this.gridOptions.api.getSelectedRows();
//          var orderIds = '';
//          this.multipleSelection.forEach((item, i) => {
//            orderIds += item.stockInId + ',';
//          })
//          this.orderIds = orderIds.slice(0, -1);
        }
        this.gridOptions.onSortChanged = (event) => {
          console.log(event);
        }
      },
      // 点击拒绝换货原因下拉框
      clickSelect() {
        this.isHave = false;
      },
      // 拒绝换货上传凭证确认
      rejectData() {
        //console.log(this.rejectA);
        // 拒绝换货原因为空
        if (!this.rejectA.sellerRefuseReasonId) {
          this.$message({
            message: '请选择拒绝换货原因',
            type: 'warning'
          });
          this.isHave = true;
          return;
        }
        this.options.forEach(item => { // 过滤对应的text
          if (item.id == this.rejectA.sellerRefuseReasonId)
            this.rejectA.refuseReason = item.text
        });
        // 拒绝换货保存
        this._post('com.edb01.erp.ass.service.api.AfterSaleOptionServiceBiz/' + this.version + '/refuseChang', this.rejectA)
          .then(res => {
            if (res.data.success) {
              this.noShopVisible = false; // 关闭弹框
              this.$message({
                message: '拒绝换货成功',
                type: 'success',
              })
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning',
              })
            }
          })
      },
      // 同意退款弹框里的确认
      sureSuit() {
        // 校验没有填写实际退款金额
        for (var i = 0; i < this.agreeData.length; i++) {
          if (!(this.agreeData[i].factRefundAmt + '')) {
            this.indexReg = i;
            this.classReg = 'factRefundAmt';
            this.$message({
              message: '请输入实际退款金额',
              type: 'warning'
            })
            return;
          }
        }
        let data = {
          assOrderId: this.shopOrderId, /*afterSalesId*/
          assItemBeanList: JSON.stringify(this.agreeData)
        };

        // 确认退款
        this._post('com.edb01.erp.ass.service.api.AfterSaleOptionServiceBiz/' + this.version + '/reviewRefundAfterSale', data)
          .then(res => {
            if (res.data.success) {
              this.dialogVisible1 = false;
              this.$message({
                message: '成功',
                type: 'success'
              });
              this.query(); // 刷新数据
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 同意退款弹框里的实际退款金额失去焦点校验
      returnReg(row) {
        if (row.factRefundAmt > row.applyRefundAmt) { // 小于等于
          row.factRefundAmt = row.applyRefundAmt
        }
      },
      /*    // 点击拒绝换货
          clickNo(row) {
            if (row.sourceOrderType == 1) {// 线上下载
              // 调用店铺接口
              this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/findEditBeanById', {storeId: row.storeId})
                .then(res => {
                  if (res.data.success) {
                    // 获取店铺token 调用拒绝换货接口  线上
                    this._post('com.edb01.erp.ass.service.api.AfterSaleOptionServiceBiz/' + this.version + '/getRefundRefuseReason', {
                      storeToken: res.data.result.token,
                      disputeId: row.outAfterSalesNo
                    })
                      .then(response => {
                        if (response.data.success) {
                          this.options = response.data.result;
                        }
                      })
                  }
                })
            } else { // 手工下载
              this.options = [
                {id: 1, text: '库存不足或商品已下架'},
                {id: 2, text: '申请时间已超7天无理由换货时限'},
                {id: 3, text: '定制商品不支持换货'},
                {id: 4, text: '已经影响商品完好'},
                {id: 5, text: '非包邮商品运费未达成一致'},
                {id: 6, text: '与买家达成一致'},
                {id: 7, text: '所换商品差价，未协商一致'},
                {id: 8, text: '其他'}
              ]
            }
            this.isHave = false;
            this.imageUrlH = '';
            this.noShopVisible = true;
            this.rejectA.assOrderId = row.afterSalesId;// 售后单Id

            // 清空数据
            this.rejectA.sellerRefuseReasonId = '';
            this.rejectA.refuseReason = '';
            this.rejectA.fileId = '';
            this.rejectA.refuseRemark = '';
          },*/
      /*  // 点击操作同意退款
        clickMoney(row) {
          //console.log(row);
          this.shopOrderId = row.afterSalesId; // 保存订单ID
          this.dialogVisible1 = true;
          this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getAfterSaleItem', {afterSalesId: row.afterSalesId})
            .then(res => {
              if (res.data.success) {
                res.data.result.forEach(item => {
                  item.factRefundAmt = item.applyRefundAmt;
                });
                this.agreeData = res.data.result;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })

        },*/
      //排序触发的方法
      sortMethod(a) {
        //console.log(a,789456123);
      },
      // 商品弹框里的重置
      shopReset() {
        this.findShop.goodsCode = ''; //商品编码
        this.findShop.barCode = ''; //条形码
        this.findShop.goodsName = '';//商品名称
        this.findShop.goodsSpec = '';//商品规格
      },
      /*  // 点击表格的拒绝退货
        returnNo(row) {
          console.log(row);
          this.imageUrl = ''; // 置空之前的
          this.uploadVisible = true; // 弹框
          this.assOrderId = row.afterSalesId; // 保存当前售后单ID
        },*/
      // 选择完时间后赋值给查询参数
      dateChange() {
        if (!this.value4) { // 没值情况下，状态改变
          this.isActive1 = false;
          this.isActive2 = false;
          this.isActive3 = false;
          this.addQuery.timeStart = '';
          this.addQuery.timeEnd = '';
        } else { // 有值的时候判断时候什么时间
          let date = new Date();
          let year = date.getFullYear(); // 年
          let month = date.getMonth(); // 月
          let strDate = date.getDate(); // 日
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          let a = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
          let b = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
          let c = new Date(year, month, strDate, 23, 59, 59).getTime();
          this.addQuery.timeStart = this.value4[0].getTime();
          this.addQuery.timeEnd = this.value4[1].getTime();
          if (this.value4[1].getTime() == a || this.value4[1].getTime() == b || this.value4[1].getTime() == c) {

          } else {
            this.isActive1 = false;
            this.isActive2 = false;
            this.isActive3 = false;
          }
        }

      },
      //售后单详情跳转
      /*   clickDetail(row) {
           this.orderId = row.afterSalesNo;
           this.refundStatus = row.refundStatus;
           this.dealStatus = row.dealStatus;
           this.sourceOrderType = row.sourceOrderType
           //给子级传参并显示子级
           // 已完成、已作废、已终结状态的售后单所有信息均不可编辑
           if (row.dealStatus == 3 || row.dealStatus == 4 || row.dealStatus == 5) {
             this.paramsObj = {childrenShow: 3, mainPageShow: false}
             // 	针对于线上售后单，在处理状态为未处理以及处理中时可对额外退款金额、额外退款原因、售后备注以及额外退款流水号字段进行编辑（规则同添加售后单） ||
             // 处理中时仅可对额外退款金额、额外退款原因、售后备注以及额外退款流水号字段进行编辑（规则同添加售后单）
           } else if ((row.sourceOrderType == 1 && (row.dealStatus == 1 || row.dealStatus == 2)) || row.dealStatus == 2) {
             if (row.asType == 4) {
               this.paramsObj = {childrenShow: 3, mainPageShow: false}
             } else {
               this.disabled = 1; // 部分编辑
               this.paramsObj = {childrenShow: 4, mainPageShow: false}
             }
             // 针对于手工下单的售后单，在处理状态为未处理前可对售后单所有信息进行修改
           } else if (row.sourceOrderType == 2 && row.dealStatus == 1) {
             this.disabled = 2; // 都可编辑
             this.paramsObj = {childrenShow: 4, mainPageShow: false}
           }

         },*/
      // 异常单子变色
      tableRowClassName({row, rowIndex}) {
        if (row.exceptionFlag === true) {
          return 'warning-row';
        }
        return '';
      },
      // 标记异常里的确认
      sureSign() {
        if (this.signAfterSale.signReason == '') {
          this.$message({
            message: '请输入标记异常原因',
            type: 'warning'
          });
        } else {
          // 标记异常
          this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/signAfterSale', this.signAfterSale)
            .then(res => {
              if (res.data.success) {
                this.agreeFiled = res.data.result;
                this.dialogFlied = true; // 失败列表
                this.query();
                if (this.dialogFlied) {
                  setTimeout(() => {
                    this.signVisible = false;
                  }, 500)
                }

              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }

            })
        }
        // this.signVisible = false
      },
      // 操作区域标记异常按钮
      clickSign() {
        if (this.checkboxAll.length == 0) {
          this.$message({
            message: '请选择所需操作的售后单',
            type: 'warning'
          });
        } else {
          this.signAfterSale.signReason = '';
          // 	处理状态为未处理或处理中
          let assOrderIdJson = [];
          this.checkboxAll.forEach(item => { // 保存选择的售后单ID
            assOrderIdJson.push(item.afterSalesId)
            /* if(item.dealStatus == 1 || item.dealStatus == 2) {
               assOrderIdJson.push(item.afterSalesId)
             }*/
          });
          /*if(assOrderIdJson.length == 0){ // 没有符合条件的
            this.$message({
              message: '请选择符合条件的售后单',
              type: 'warning'
            });
          }else{*/
          let str = '';
          assOrderIdJson.forEach(item => { // 拼接选择的售后单ID
            str += item + ',';
          });
          this.signAfterSale.afterSaleIds = str.slice(0, -1);
          this.signVisible = true;
        }
      },
      /*  // 表格里的点击终结按钮
        clickEnd(row) {
          this.endBill.endReason = ''; // 置空之前的
          this.endBill.afterSalesId = row.afterSalesId; // 售后单ID赋值
          this.endVisible = true; // 显示弹框
        },*/
      // 表格里的点击作废按钮
      /* clickCancel(row) {
         console.log(row);
         this.cancelBill.invalidReason = '';// 置空之前的
         this.cancelBill.afterSalesId = row.afterSalesId;// 售后单ID赋值
         this.cancelVisible = true;// 显示弹框
       },*/
      // 终结的里的确认按钮
      endSubmit() {
        if (this.endBill.endReason == '') {
          this.$message({
            message: '请填写终结原因',
            type: 'warning'
          });
          return;
        }
        // 终结
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/endAfterSale', this.endBill)
          .then(res => {
            if (res.data.success) {
              this.endVisible = false;
              this.$message({
                message: '终结成功',
                type: 'success'
              });
              this.query();
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }

          })
      },
      // 作废的里的确认按钮
      cancelSubmit() {
        if (this.cancelBill.invalidReason == '') {
          this.$message({
            message: '请填写作废原因',
            type: 'warning'
          });
          return;
        }
        // 作废
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/invalidAfterSale', this.cancelBill)
          .then(res => {
            if (res.data.success) {
              this.cancelVisible = false;
              this.$message({
                message: '作废成功',
                type: 'success'
              });
              this.query();
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }

          })
      },
      // 点击拒绝退款
      refusedM() {
        if (this.checkboxAll.length == 0) { // 没有选择
          this.$message({
            message: '请选择拒绝退款的售后单',
            type: 'warning'
          });
        } else { // 选中
          //	处理状态为处理中（仅退款为未处理）；	退货状态为同意退货；（针对于退货退款售后单，若为仅退款售后单则不校验退货状态）	退款状态为未退款；
          this.refusedArgument.refuseReason = '';
          this.refusedArgument.assOrderIdJson = [];
          let assOrderIdJson = [];
          this.checkboxAll.forEach(item => { // 保存选择售后单ID
            assOrderIdJson.push(item.afterSalesId)
            /*if(item.asType == 2){  // 仅退款
              if(item.dealStatus == 1 && item.refundStatus == 1) {
                assOrderIdJson.push(item.afterSalesId)
              }
            }else{ // 退货退款
              if(item.returnGoodsStatus == 2 && item.dealStatus == 2 && item.refundStatus == 1) {
                assOrderIdJson.push(item.afterSalesId)
              }
            }*/
          });
          /*if(assOrderIdJson.length == 0){ // 没有符合条件的
            this.$message({
              message: '请选择符合条件的售后单',
              type: 'warning'
            });
            return;
          }*/
          //console.log(assOrderIdJson);
          this.refusedArgument.assOrderIdJson = JSON.stringify(assOrderIdJson);
          this.rejectVisible = true;
        }

      },
      // 拒绝退款的确认接口
      sureSubmit() {
        /*if(this.refusedArgument.refuseReason == ''){
          this.$message({
            message: '请填写拒绝退款原因',
            type: 'warning'
          });
          return;
        }*/
        // 拒绝退款
        this._post('com.edb01.erp.ass.service.api.AfterSaleOptionServiceBiz/' + this.version + '/refuseRefund', this.refusedArgument)
          .then(res => {
            if (res.data.success) {
              this.agreeFiled = res.data.result;
              this.dialogFlied = true; // 失败列表
              this.query();
              this.rejectVisible = false;
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }

          })
      },

      // 点击上传
      clickUpload() {
        this._post('com.edb01.erp.ass.service.api.AfterSaleOptionServiceBiz/' + this.version + '/refuseReturn', {
          assOrderId: this.assOrderId,
          fileId: this.text.response.resourcesId
        })
          .then(res => {
            if (res.data.success) {
              this.uploadVisible = false;
              this.$message({
                message: '拒绝退货成功',
                type: 'success'
              });
              this.query();
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })

      },
      // 获取上传的图片信息  拒绝退货凭证
      handleAvatarSuccess(res, file) {
        this.text = file;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 判断图片的大小和格式  拒绝退货凭证
      beforeAvatarUpload(file) {
        console.log(file.size / 1024 / 1024);
        this.file = file;
        //console.log(file);
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!');
          return;
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5M!');
          return;
        }
        return (isJPG || isPNG) && isLt5M;
      },


      // 获取上传的图片信息  拒绝换货凭证
      handleAvatarSuccess1(res, file) {
        console.log(file.raw, file.response.resourcesId, file, 8888);
        this.rejectA.fileId = file.response.resourcesId;
        this.imageUrlH = URL.createObjectURL(file.raw);
      },
      // 判断图片的大小和格式  拒绝换货凭证
      beforeAvatarUpload1(file) {
        this.file = file;
        //console.log(file);
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isJPG && !isPNG) {
          this.$message.error('请上传.jpg、.jpeg、.png格式的图片');
          return
        }
        if (!isLt5M) {
          this.$message.error('最大支持上传5M图片');
          return
        }
        return (isJPG || isPNG) && isLt5M;
      },
      // 点击同意退款按钮
      agreeMoney() {
        if (this.checkboxAll.length == 0) { // 没有选择
          this.$message({
            message: '请选择同意退款的售后单',
            type: 'warning'
          });
        } else { // 选中
          //	处理状态为处理中（仅退款为未处理）；	退货状态为同意退货；（针对于退货退款售后单，若为仅退款售后单则不校验退货状态）	退款状态为未退款；

          let assOrderIdJson = [];
          this.checkboxAll.forEach(item => {// 保存选择的售后单ID
            assOrderIdJson.push(item.afterSalesId)
            /*if(item.asType == 2){  // 仅退款
                if(item.dealStatus == 1 && item.refundStatus == 1) {
                  assOrderIdJson.push(item.afterSalesId)
                }
            }else{ // 退货退款
              if(item.returnGoodsStatus == 2 && item.dealStatus == 2 && item.refundStatus == 1) {
                assOrderIdJson.push(item.afterSalesId)
              }
            }*/
          });
          /* if(assOrderIdJson.length == 0){ // 没有符合条件的
             this.$message({
               message: '请选择符合条件的售后单',
               type: 'warning'
             });
             return;
           }else{// 选中的至少有一条符合条件的*/
          //console.log(JSON.stringify(assOrderIdJson));
          //同意退货
          this._post('com.edb01.erp.ass.service.api.AfterSaleOptionServiceBiz/' + this.version + '/reviewRefund', {assOrderIdJson: JSON.stringify(assOrderIdJson)})
            .then(res => {
              if (res.data.success) {
                this.agreeFiled = res.data.result;
                this.dialogFlied = true;
                this.query();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            })
        }

      },
      // 点击同意退货按钮
      agreeReturn() {
        if (this.checkboxAll.length == 0) { // 没有选择
          this.$message({
            message: '请选择所需操作的售后单',
            type: 'warning'
          });
        } else { // 选中
          //	售后类型为退货退款；	退货状态为未退货；	处理状态为未处理；
          let assOrderIdJson = [];
          this.checkboxAll.forEach(item => {
            assOrderIdJson.push(item.afterSalesId)
            /* if(item.asType == 1 && item.returnGoodsStatus == 1 && item.dealStatus == 1){

             }*/
          });
          /* if(assOrderIdJson.length == 0){ // 没有符合条件的
             this.$message({
               message: '请选择符合条件的售后单',
               type: 'warning'
             });
             return;
           }else{// 选中的至少有一条符合条件的*/
          console.log(JSON.stringify(assOrderIdJson));
          //同意退货
          this._post('com.edb01.erp.ass.service.api.AfterSaleOptionServiceBiz/' + this.version + '/agreeReturn', {assOrderIdJson: JSON.stringify(assOrderIdJson)})
            .then(res => {
              if (res.data.success) {
                this.agreeFiled = res.data.result;
                this.dialogFlied = true;
                this.query();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            })
        }
      },
      // 重置数据
      resetData() {
        this.addQuery.storeIds = '';
        this.addQuery.ecSendStatus = '';
        this.addQuery.receiveType = 1;
        this.addQuery.receiveInfo = '';
        this.addQuery.afterSaleType = '';
        this.addQuery.dealStatus = '';
        this.addQuery.returnGoodsStatus = '';
        this.addQuery.source = '';
        this.addQuery.refundStatus = '';
        this.addQuery.exceptionFlag = '';
        this.addQuery.barCodes = '';
        $('#example-post').multiselect('dataprovider', this.shop);
        this.sevenTime();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible2 = true;
      },
      // 选择商品的确认选择按钮
      ChooseSure() {
        this.dialogVisible = false;
        if (this.shopList.length == 0) { // 如何当前用户没有选择商品，则不改变之前的

        } else {
          this.addQuery.barCodes = '';
          this.shopList.forEach(item => { // 保存所选商品的barCode
            this.addQuery.barCodes += item.barCode + ',';
          });
          this.addQuery.barCodes = this.addQuery.barCodes.slice(0, -1);
        }
      },
      // 点击查询区域商品的...
      clickShop() {
        this.dialogVisible = true;//显示弹框
        this.queryShop();// 调用商品接口
      },
      // 点击查询按钮
      queryData() {
        let arr = $('#example-post').val();
        let str = '';
        arr.forEach(item => { // 店铺
          str += item + ',';
        });

        this.addQuery.storeIds = str.slice(0, -1);
        this.query(); //查询
      },
      //子级传参通知父级刷新表格数据
      changeShow(val) {
        if (val.isRefresh) {
          this.paramsObj.mainPageShow = true;
          this.query();
        } else if (val.childrenShow == 1) {
          this.paramsObj.childrenShow = 1;
          this.paramsObj.mainPageShow = true;
        } else if (val.childrenShow == 2) {
          this.paramsObj.childrenShow = 2;
          this.paramsObj.mainPageShow = false;
          this.paramsObj.orderId = val.orderId;
          this.paramsObj.platNum = val.platNum;
          this.paramsObj.sendStatus = val.sendStatus;
          this.paramsObj.obj = val.obj;
        } else if (val.childrenShow == 19) {
          this.paramsObj.mainPageShow = true;
        }
        //this.paramsObj.mainPageShow = true;
      },
      //添加售后单跳转
      addBill() {
        //给子级传参并显示子级
        this.paramsObj = {
          childrenShow: 1,
          mainPageShow: false
        }
      },
      //list checkbox
      handleSelectionChange(val) {
        this.checkboxAll = val;
        console.log(val);
        /*val.forEach(item => {
          console.log(item.exceptionFlag,item.timeoutTime);
        })*/
      },
      // shop checkbox
      handleSelectionChange1(val) {
        console.log(val);
        this.shopList = val;
      },
      //  当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.addQuery.page = this.currentPage;
        this.addQuery.size = this.totalPage;
        this.query();
      },
      //  分页
      //  每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        this.addQuery.page = this.currentPage;
        this.addQuery.size = this.totalPage;
        this.query()// 请求数据
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

      handleClick(row) {
        console.log(row);
      },
      // 获取当前时间(今天)
      nowTime() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth(); // 月
        let strDate = date.getDate(); // 日
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        this.value4 = [new Date(year, month, strDate, 0, 0).getTime(), new Date(year, month, strDate, 23, 59, 59).getTime()];
        this.isActive1 = true;
        this.isActive2 = false;
        this.isActive3 = false;
        this.addQuery.timeStart = this.value4[0];
        this.addQuery.timeEnd = this.value4[1];
      },
      // 获取时间(近7天)
      sevenTime() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth(); // 月
        let strDate = date.getDate(); // 日
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
        const start = new Date(year, month, strDate - 7, 0, 0).getTime();
        this.value4 = [start, end];
        this.isActive1 = false;
        this.isActive2 = true;
        this.isActive3 = false;
        this.addQuery.timeStart = this.value4[0];
        this.addQuery.timeEnd = this.value4[1];
      },
      // 获取时间(近30天)
      thirtyTime() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth(); // 月
        let strDate = date.getDate(); // 日
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
        const start = new Date(year, month, strDate - 30, 0, 0).getTime();
        //start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.value4 = [start, end];
        this.isActive1 = false;
        this.isActive2 = false;
        this.isActive3 = true;
        this.addQuery.timeStart = this.value4[0];
        this.addQuery.timeEnd = this.value4[1];
      }
    },
    created() {
      this.sevenTime(); // 默认七天
      // 查询
      this.query = () => {
        this._post('com.edb01.erp.ass.service.api.AfterSaleService/' + this.version + '/getAfterSaleComplexList', this.addQuery)
          .then(res => {
            if (res.data.success) {
              res.data.result.rows.forEach(item => {
                if (!item.outAfterSalesNo) { // 外部售后单号没值显示‘-’
                  item.outAfterSalesNo = '-';
                }
                if (!item.otherRefundAmt) {
                  item.otherRefundAmt = 0;
                }
                if (item.payTime) {
                  item.payTime = turnTimestamp(item.payTime); // 时间戳转成年月日 时分秒
                }
                if (item.applyTime) {
                  item.applyTime = turnTimestamp(item.applyTime);// 时间戳转成年月日 时分秒
                }

                if (item.timeoutTime) {
                  item.timeout = turnTimestamp(item.timeoutTime);// 时间戳转成年月日 时分秒
                }
              });
              this.tableData = res.data.result.rows;
              this.totalNum = res.data.result.total;

              this.tableData.forEach((item,index)=>{
                item.index = index+1
                item.asType1 = item.asType;
                item.dealStatus1 = item.dealStatus;
                item.refundStatus1 = item.refundStatus;
                item.ecSendStatus1 = item.ecSendStatus;
                item.sourceOrderType1 = item.sourceOrderType;
                item.asType1 = item.asType;
                if(item.asType == 1){
                  item.asType1 = '退货退款'
                }else if(item.asType == 2){
                  item.asType1 = '仅退款'
                }else if(item.asType == 3){
                  item.asType1 = '换货'
                }else if(item.asType == 4){
                  item.asType1 = '补发'
                }

                if(item.dealStatus == 1){
                  item.dealStatus1 = '未处理'
                }else if(item.dealStatus == 2){
                  item.dealStatus1 = '处理中'
                }else if(item.dealStatus == 3){
                  item.dealStatus1 = '已完成'
                }else if(item.dealStatus == 4){
                  item.dealStatus1 = '已作废'
                }else if(item.dealStatus == 5){
                  item.dealStatus1 = '已终结'
                }

                if(item.refundStatus == 1){
                  item.refundStatus1 = '未退款'
                }else if(item.refundStatus == 2){
                  item.refundStatus1 = '拒绝退款'
                }else if(item.refundStatus == 3){
                  item.refundStatus1 = '退款成功'
                }else if(item.refundStatus == 4){
                  item.refundStatus1 = '取消退款'
                }

                if(item.ecSendStatus == 1){
                  item.ecSendStatus1 = '未发货'
                }else if(item.ecSendStatus == 2){
                  item.ecSendStatus1 = '部分发货'
                }else if(item.ecSendStatus == 3){
                  item.ecSendStatus1 = '已发货'
                }

                if(item.returnGoodsStatus == 1){
                  item.returnGoodsStatus1 = '未退货'
                }else if(item.returnGoodsStatus == 2){
                  item.returnGoodsStatus1 = '同意退货'
                }else if(item.returnGoodsStatus == 3){
                  item.returnGoodsStatus1 = '部分收货'
                }else if(item.returnGoodsStatus == 4){
                  item.returnGoodsStatus1 = '全部收货'
                }else if(item.returnGoodsStatus == 5){
                  item.returnGoodsStatus1 = '拒绝退货'
                } if(item.returnGoodsStatus == 6){
                  item.returnGoodsStatus1 = '未换货'
                }else if(item.returnGoodsStatus == 7){
                  item.returnGoodsStatus1 = '同意换货'
                }else if(item.returnGoodsStatus == 8){
                  item.returnGoodsStatus1 = '拒绝换货'
                }else if(item.returnGoodsStatus == 9){
                  item.returnGoodsStatus1 = '取消换货'
                }else if(item.returnGoodsStatus == 10){
                  item.returnGoodsStatus1 = '未补发'
                }else if(item.returnGoodsStatus == 11){
                  item.returnGoodsStatus1 = '同意补发'
                }

                if(item.asType == 4){
                  item.totalRefundAmt1 = '-'
                }else {
                  item.totalRefundAmt1 = item.totalRefundAmt
                }

                if(item.asType == 4){
                  item.otherRefundAmt1 = '-'
                }else {
                  item.otherRefundAmt1 = item.otherRefundAmt
                }

                if(item.asType == 4 || item.asType == 3){
                  item.applyRefundAmt1 = '-'
                }else {
                  item.applyRefundAmt1 = item.applyRefundAmt
                }

                if(item.asType == 4){
                  item.otherRefundReasonName1 = '-'
                }else {
                  item.otherRefundReasonName1 = item.otherRefundReasonName
                }

                if(item.onlineStatus == 1){
                  item.onlineStatus1 = '买家已申请退款，等待卖家同意'
                }else if(item.onlineStatus == 2){
                  item.onlineStatus1 = '卖家同意退款，等待买家退货'
                }else if(item.onlineStatus == 3){
                  item.onlineStatus1 = '买家已退货，等待卖家确认收货'
                }else if(item.onlineStatus == 4){
                  item.onlineStatus1 = '卖家拒绝退款'
                }else if(item.onlineStatus == 5){
                  item.onlineStatus1 = '退款成功'
                } if(item.onlineStatus == 6){
                  item.onlineStatus1 = '退款关闭'
                }else if(item.onlineStatus == 11){
                  item.onlineStatus1 = '换货待处理'
                }else if(item.onlineStatus == 12){
                  item.onlineStatus1 = '待买家退货'
                }else if(item.onlineStatus == 13){
                  item.onlineStatus1 = '买家已退货，待收货'
                }else if(item.onlineStatus == 14){
                  item.onlineStatus1 = '换货关闭'
                }else if(item.onlineStatus == 15){
                  item.onlineStatus1 = '换货成功'
                }else if(item.onlineStatus == 16){
                  item.onlineStatus1 = '待买家修改'
                }else if(item.onlineStatus == 17){
                  item.onlineStatus1 = '待发出换货商品'
                }else if(item.onlineStatus == 18){
                  item.onlineStatus1 = '待买家收货'
                }else if(item.onlineStatus == 19){
                  item.onlineStatus1 = '请退款'
                }


                if(item.asType == 4){
                  item.expressCoName1 = '-'
                }else {
                  item.expressCoName1 = item.expressCoName && item.expressCoName !== 'undefined'?item.expressCoName:'';
                }


                if(item.asType == 4){
                  item.returnExpressNos1 = '-'
                }else {
                  item.returnExpressNos1 = item.returnExpressNos
                }

                if(item.replaceSourceOrderNo){
                  item.replaceSourceOrderNo1 =item.replaceSourceOrderNo
                }else {
                  item.replaceSourceOrderNo1 = item.sourceOrderNo
                }

                if(item.sourceOrderType == 1){
                  item.sourceOrderType1 = '线上下载'
                }else if(item.sourceOrderType == 2) {
                  item.sourceOrderType1 = '手工下单'
                }

              })

            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      };
      // 商品的查询(弹框)
      this.queryShop = () => {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryForHandWave', this.findShop)
          .then(res => {
            if (res.data.success) {
              this.tableData1 = res.data.result.rows;
              this.totalNum1 = res.data.result.total;

            }
          })
      };
      this.query();
    },
    mounted() {
      /* this._post('com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/listOauth')
         .then(res => {

         })*/

      //回车事件
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if (e && e.keyCode == 13) { // enter 键
          //调接口

          this.queryShop(); // 商品查询
          if (this.dialogVisible) {
            this.queryShop(); // 商品查询
          } else {
            this.queryData();// 数据查询
          }
        }
      };
      //渲染表格高度
      this.$nextTick(function () {
        this.table_h = $(window).height() - $('.col-border').offset().top - 70;
      });
      window.onresize = () => {
        this.table_h = $(window).height() - $('.col-border').offset().top - 70;
      };
      // 商户有权限的店铺
      this._post('com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/listOauth')
        .then(res => {
          if (res.data.success == true) {
            this.shop = res.data.result;
            var value = [];
            for (var item of this.shop) {
              item.value = item.storeId;
              item.label = item.storeName;
              value.push(item.storeId)
            }
            //console.log(self.plat);
            $('#example-post').multiselect('dataprovider', this.shop);
            $('#example-post').multiselect('select', value);
          }
        });
      $('#example-post').multiselect({ // 店铺多选的样式
        onInitialized: function (select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor: 'hsla(220,4%,58%,.3)'
          });
        },
      });
    },
  }
</script>
<style scoped>
  .styleColor, .el-input__inner {
    border: 1px solid red !important;
    border-radius: 5px;
  }

  .titleS {
    font-size: 14px;
  }

  #afterSaleDispose .dot { /*商品里的...号*/
    position: relative;
    left: -45px;
    top: 0;
    font-weight: bold;
    font-size: 18px;
    border-left: 1px solid #C5CBD1;
    display: inline-block;
    height: 28px;
    padding: 0 5px;
    color: #979797;
    cursor: pointer;
  }

  #afterSaleDispose .error { /*商品里的X号*/
    position: relative;
    left: -45px;
    top: 2px;
    font-weight: bold;
    cursor: pointer;
    color: #979797;
  }

  .button-span {
    display: inline-block;
    height: 26px;
    line-height: 26px;
    border: 1px solid #979797;
    border-radius: 4px;
    padding: 0 9px;
    cursor: pointer;
    color: #A4A4A4;
    margin-left: 7px;
    font-size: 14px;
  }

  .span1 {
    display: inline-block;
    height: 26px;
    line-height: 26px;
    border-radius: 4px;
    padding: 0 9px;
    border: 1px solid #409EFF;
    cursor: pointer;
    background: #409EFF;
    color: #fff;
    margin-left: 7px;
    font-size: 14px;
  }

</style>
<style>
  .el-table .warning-row {
    background: #FFF7EB;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px !important;
    text-align: center;
  }

  .avatar {
    width: 140px;
    height: 140px;
    display: block;
  }

  #afterSaleDispose #shop-box .el-input__inner {
    padding: 0 46px 0 15px !important;
  }

  #afterSaleDispose #input-box .el-input__inner {
    padding: 0 5px !important;
  }

  #input-box .grid-content {
    margin-bottom: 10px;
  }

  #afterSaleDispose #pop-up .el-dialog__header {
    height: 40px !important;
    padding: 10px 20px 10px;
  }

  #afterSaleDispose .btn-group > .btn:first-child {
    width: 200px;
    height: 28px;
    text-align: left;
    line-height: 15px;
    border: 1px solid #d8dce5;
  }

  #afterSaleDispose .el-dialog__body {
    padding: 10px 20px !important;
  }

  #afterSaleDispose .open > .dropdown-menu {
    width: 200px;
  }

  #afterSaleDispose .el-date-editor .el-range-input, .el-date-editor .el-range-separator {
    font-size: 12px;
  }

  #afterSaleDispose .el-range-editor.el-input__inner {
    padding: 3px 2px;
  }
</style>
