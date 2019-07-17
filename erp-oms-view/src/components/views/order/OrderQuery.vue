<!--订单查询 李式/樊虎-->
<template>
  <div id="order-query" class="container_search" v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <div v-show="paramsObj.mainPageShow" id="orderPage">
      <!--搜索查询区-->
      <div id="searchBox">
        <div class="leftBox2" style="margin-right:250px;">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="participate-shop">店铺：</label><!--storeBeans-->
                <select id="participate-shop" name="multiselect[]" multiple="multiple" required>
                  <option v-for="item in shopList" :value="item.value">{{item.label}}</option>
                </select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="Warehouse">仓库：</label><!--storageBeans-->
                <select id="Warehouse" name="multiselect[]" multiple="multiple" required>
                  <option v-for="item in storeList" :value="item.value">{{item.label}}</option>
                </select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">订单号：</label>
                <el-input class="selectWidth" maxlength="100" v-model="testData.salesOrderNo" @keyup.native="testData.salesOrderNo=testData.salesOrderNo.replace(/[^\d|a-z]/ig,'')"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">平台单号：</label>
                <el-input class="selectWidth" maxlength="100" @keyup.native="testData.sourceOrderNo=testData.sourceOrderNo.replace(/[^\d|a-z|-]/ig,'')" v-model="testData.sourceOrderNo" ></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="expressBeans">快递：</label>
                <el-select id="enableFlag" v-model="testData.expressBeans" placeholder="" clearable>
                  <el-option v-for="(value,key) in expressList" :key="key" :label="value" :value="key">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">快递单号：</label>
                <el-input class="selectWidth" maxlength="100" v-model="testData.expressNo" @keyup.native="testData.expressNo=testData.expressNo.replace(/[^\d|a-z]/ig,'')"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">买家ID：</label>
                <el-input class="selectWidth" maxlength="100" v-model="testData.customerName"></el-input>
                <!--@keyup.native="testData.customerName=testData.customerName.replace(/[^\d|a-z|\u4e00-\u9fa5]/ig,'')"-->
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">异常标记：</label>
                <el-select v-model="testData.orderSignCode" placeholder="请选择" class="selects">
                  <el-option :value="key" :key="key" :label="value" v-for="(value,key) in orderSignList">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox2" style="width:250px;">
          <el-button style="margin-left:12px;width:75px !important;" type="primary" round @click="moreConditionFlag=!moreConditionFlag">更多... <i class="el-icon-arrow-down"></i></el-button>
          <el-button style="margin:0;width:75px !important;" type="primary" @click="conditionSearch">查询</el-button>
          <el-button style="margin:0;width:75px !important;" @click="refresh">重置</el-button>
          <div id="moreCondition" v-show="moreConditionFlag">
            <div style="margin-top: 25px;margin-left:10px;">
              <el-button class="conditionBtn" :style="setDay==1?'color:#409eff':''" @click="getNowDay(1)">今日</el-button>
              <el-button class="conditionBtn" :style="setDay==7?'color:#409eff':''" @click="getNowDay(7)">近七日</el-button>
              <el-button class="conditionBtn" :style="setDay==30?'color:#409eff':''" @click="getNowDay(30)">近三十日</el-button>
              <i class="el-icon-close" style="float: right;margin-right: 15px;margin-top: -15px;font-size: 16px;cursor: pointer;" @click="moreConditionFlag=false"></i>
            </div>
            <div>
              <el-select v-model="testData.searchTime" placeholder="请选择" style="margin-left: 50px;margin-top: 20px;width: 170px;" class="selectStyle">
                <el-option v-for="item in timerList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker style="width:355px;" :clearable="false" @change="handlePicker" v-model="timer" type="datetimerange"
                              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
                              :editable="false">
              </el-date-picker>
            </div>
            <div id="conditions">
              <span class="leftFormat" style="display:inline-block;margin-top: 15px;">订单类型：</span>
              <!--<el-select v-model="testData.orderType" placeholder="请选择" style="margin-top: 15px;" class="selectStyle">
                <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>-->
              <multiple-select
                :selectArr="orderTypeList"
                :valueArr="testData.orderTypes"
                @multipleChange="multipleChange1"
                style="width:192px;">
              </multiple-select>
              <span class="leftFormat" style="margin-left: 15px;">订单状态：</span>
              <el-select v-model="testData.orderStatus" clearable placeholder="请选择" style="margin-top: 15px;" class="selectStyle">
                <el-option v-for="item in orderStatusList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <br /><br />
              <span class="leftFormat">商&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;品：</span>
              <span style="position: absolute;right:75px;top: 168px;z-index:100;">
						  <i class="el-icon-error" style="cursor:pointer;" v-show="testData.goodsBarCode" @click="clearGoods"></i>
				    </span>
					    <el-input v-model="testData.goodsBarCode" :clearble="true" class="selects" :maxlength="textLength" style="width: 470px;margin-top: 0px;">
                <template slot="append">
                  <div style="width:100%;height: 100%;" @click="addCommodityDialog('fanhu')"><i class="el-icon-more"></i></div>
                </template>
              </el-input>
              <br /><br />
              <span class="leftFormat">商品条数：</span>
              <el-input class="numText" @keyup.native="testData.goodsNumTStart = testData.goodsNumTStart.replace(/[^\d]/ig,'')" v-model="testData.goodsNumTStart" @change="checkValue(1)"></el-input>-
              <el-input class="numText" @keyup.native="testData.goodsNumTEnd = testData.goodsNumTEnd.replace(/[^\d]/ig,'')" v-model="testData.goodsNumTEnd" @change="checkValue(1)"></el-input>
              <span class="leftFormat" style="margin-left:20px;">商品数量：</span>
              <el-input class="numText" @keyup.native="testData.goodsQtySStart = testData.goodsQtySStart.replace(/[^\d]/ig,'')" v-model="testData.goodsQtySStart" @change="checkValue(2)"></el-input>-
              <el-input class="numText" @keyup.native="testData.goodsQtySEnd = testData.goodsQtySEnd.replace(/[^\d]/ig,'')" v-model="testData.goodsQtySEnd" @change="checkValue(2)"></el-input>
              <br /><br />
              <span class="leftFormat">订单金额：</span>
              <el-input class="numText" @keyup.native="testData.orderAmtSStart = testData.orderAmtSStart.replace(/[^\d\.]/ig,'')" v-model="testData.orderAmtSStart" @change="checkValue(3)"></el-input>-
              <el-input class="numText" @keyup.native="testData.orderAmtSEnd = testData.orderAmtSEnd.replace(/[^\d\.]/ig,'')" v-model="testData.orderAmtSEnd" @change="checkValue(3)"></el-input>
              <span class="leftFormat" style="margin-left:20px;">订单重量：</span>
              <el-input class="numText" @keyup.native="testData.orderWeightSStart = testData.orderWeightSStart.replace(/[^\d\.]/ig,'')" v-model="testData.orderWeightSStart" @change="checkValue(4)"></el-input>-
              <el-input class="numText" @keyup.native="testData.orderWeightSEnd = testData.orderWeightSEnd.replace(/[^\d\.]/ig,'')" v-model="testData.orderWeightSEnd" @change="checkValue(4)"></el-input>
              <span class="leftFormat">付款状态：</span>
              <el-select v-model="testData.payStatus" placeholder="请选择" style="margin-top:15px;" class="selectStyle">
                <el-option label="全部" value="0"></el-option>
                <el-option label="未付款" value="1"></el-option>
                <el-option label="部分付款" value="2"></el-option>
                <el-option label="已付款" value="3"></el-option>
              </el-select>
              <span class="leftFormat" style="margin-left: 16px;">货到付款：</span>
              <el-select v-model="testData.codFlag" placeholder="请选择" style="margin-top:15px;" class="selectStyle">
                <el-option label="全部" value="-1"></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
              <span class="leftFormat">退款状态：</span>
              <el-select v-model="testData.refundStatus" placeholder="请选择" style="margin-top:15px;" class="selectStyle">
                <el-option v-for="item in refundStatusList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <span class="leftFormat" style="margin-left: 16px;">退款类型：</span>
              <el-select v-if="testData.refundStatus=='3'|| testData.refundStatus=='2'" v-model="testData.refundType" placeholder="请选择" style="margin-top: 15px;" class="selectStyle">
                <el-option v-for="item in refundTypeList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-select v-if="testData.refundStatus=='' || testData.refundStatus=='1'" v-model="testData.refundType=''" placeholder="请选择" style="margin-top: 15px;" class="selectStyle">
                <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <br /><br />
              <span class="leftFormat">旗&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;帜：</span>
              <el-select multiple collapse-tags v-model="testData.flagId" placeholder="请选择" style="margin-top:0px;" class="selectStyle">
                <el-option v-for="item in flagList" :value="item.value" :key="item.value" :label="item.label"><i class="el-icon-success" :style="{color:item.color}">&nbsp;{{item.label}}</i>
                </el-option>
              </el-select>
              <span class="leftFormat" style="margin-left: 16px;">订单渠道：</span>
              <el-select v-model="testData.orderChannel" placeholder="请选择" class="selectStyle">
                <el-option label="全部" value=""></el-option>
                <el-option label="网店直营" value="1"></el-option>
                <el-option label="手工下单" value="2"></el-option>
                <el-option label="导入订单" value="3"></el-option>
              </el-select>
              <br /><br />
              <span class="leftFormat">收货人信息：</span>
              <el-select v-model="testData.consigneeType" clearable placeholder="请选择" @change="channelConsignee" style="margin-top:0px;" class="selectStyle">
                <el-option v-for="item in addressList" :value="item.value" :key="item.value" :label="item.label">
                </el-option>
              </el-select>
             <!-- <el-select v-if="testData.consigneeType=='4'" v-model="testData.consigneeInfoText" placeholder="请选择" style="margin-top: 15px;width:260px;" class="selectStyle">
                <el-option v-for="item in consigneeTypeList" :key="item.regionName" :label="item.regionName" :value="item.regionName">
                </el-option>
              </el-select>-->
              <!--<div v-show="testData.consigneeType=='4'" style="display:inline-block;width:200px;">
                <select id="provinceMul" name="multiselect[]" multiple="multiple" required>
                  <option v-for="item in consigneeTypeList" :value="item.value">{{item.label}}</option>
                </select>
              </div>-->
              <multiple-select
                :selectArr="consigneeTypeList"
                :valueArr="consigneeInfoText"
                @multipleChange="multipleChange"
                v-show="testData.consigneeType=='4'" style="display:inline-block;width:200px;">
              </multiple-select>
              <el-input v-if="testData.consigneeType=='2'||testData.consigneeType=='3'" @keyup.native="testData.consigneeInfoText = testData.consigneeInfoText.replace(/[^\d]/g,'')" type='text' :maxlength="textLength" v-model="testData.consigneeInfoText" style="width: 260px;"></el-input>
              <el-input v-if="testData.consigneeType=='1'||testData.consigneeType=='5'" :maxlength="textLength" v-model="testData.consigneeInfoText" style="width: 260px;"></el-input>
            </div>
            <div style="width:475px;margin:15px 0 0 50px;display: inline-block;">
              <span class="spanSet">条件1：</span>
              <!--first-->
              <el-select v-model="testData.conditionType1" style="width:120px;" placeholder="请选择"
                         @change="changeOrder1">
                <el-option label="收货人地址" value="1"></el-option>
                <el-option label="条形码" value="2"></el-option>
                <el-option label="网店品名" value="3"></el-option>
                <el-option label="客服备注" value="4"></el-option>
                <el-option label="平台订单状态" value="5"></el-option>
                <el-option label="拆合状态" value="6"></el-option>
                <el-option label="促销编号" value="7"></el-option>
                <el-option label="买家留言" value="8"></el-option>
              </el-select>
              <!--second-->
              <el-select v-show="testData.conditionType1==1||testData.conditionType1==2||testData.conditionType1==3||testData.conditionType1==4||testData.conditionType1==8" v-model="testData.childType1" style="width:120px;" placeholder="请选择">
                <el-option label="包含" value="1"></el-option>
                <el-option label="不包含" value="2"></el-option>
              </el-select>
              <el-select @change="childTypeChange1" v-show="testData.conditionType1==5||testData.conditionType1==6||testData.conditionType1==7" v-model="testData.childType1" style="width:120px;" placeholder="请选择">
                <el-option label="等于" value="2"></el-option>
                <el-option v-if="testData.conditionType1!=7" label="不等于" value="13"></el-option>
              </el-select>
              <!--third-->
              <el-input v-if="testData.conditionType1==1||testData.conditionType1==2||testData.conditionType1==3||testData.conditionType1==4 || testData.conditionType1==7||testData.conditionType1==8" type="text" style="width:180px;" v-model="testData.conditionInfo1"></el-input>
              <el-select v-if="testData.conditionType1==5" v-model="testData.conditionInfo1" style="width:180px;" placeholder="请选择">
                <el-option v-if="testData.childType1!=13" label="全部" value=""></el-option>
                <el-option label="未付款" value="1"></el-option>
                <el-option label="已付款" value="2"></el-option>
                <el-option label="货到付款" value="3"></el-option>
                <el-option label="已发货" value="4"></el-option>
                <el-option label="待退货" value="5"></el-option>
                <el-option label="已退货" value="6"></el-option>
                <el-option label="待退款" value="7"></el-option>
                <el-option label="已退款" value="8"></el-option>
                <el-option label="已关闭" value="9"></el-option>
                <el-option label="已完成" value="10"></el-option>
              </el-select>
              <el-select v-if="testData.conditionType1==6" v-model="testData.conditionInfo1" style="width:180px;" placeholder="请选择">
                <el-option v-if="testData.childType1!=13" label="全部" value=""></el-option>
                <el-option label="手动批量拆分" value="2"></el-option>
                <el-option label="手动合并" value="3"></el-option>
                <el-option label="自动预售拆分" value="4"></el-option>
                <el-option label="自动拆分" value="5"></el-option>
                <el-option label="自动合并" value="6"></el-option>
                <el-option label="手动自定义拆分" value="7"></el-option>
              </el-select>
            </div>
            <el-select v-model="testData.conditionRelation" style="width:72px;" placeholder="请选择">
              <el-option label="并且" value="1"></el-option>
              <el-option label="或者" value="2"></el-option>
            </el-select>
            <div style="width:500px;display:inline-block;margin:15px 0 0 50px;">
              <span class="spanSet">条件2：</span>
              <!--first-->
              <el-select v-model="testData.conditionType2" style="width:120px;" placeholder="请选择"
                         @change="changeOrder2">
                <el-option label="收货人地址" value="1"></el-option>
                <el-option label="条形码" value="2"></el-option>
                <el-option label="网店品名" value="3"></el-option>
                <el-option label="客服备注" value="4"></el-option>
                <el-option label="平台订单状态" value="5"></el-option>
                <el-option label="拆合状态" value="6"></el-option>
                <el-option label="促销编号" value="7"></el-option>
                <el-option label="买家留言" value="8"></el-option>
              </el-select>
              <!--second-->
              <el-select v-show="testData.conditionType2==1||testData.conditionType2==2||testData.conditionType2==3||testData.conditionType2==4||testData.conditionType2==8" v-model="testData.childType2" style="width:120px;" placeholder="请选择">
                <el-option label="包含" value="1"></el-option>
                <el-option label="不包含" value="2"></el-option>
              </el-select>
              <el-select @change="childTypeChange2" v-show="testData.conditionType2==5||testData.conditionType2==6||testData.conditionType2==7" v-model="testData.childType2" style="width:120px;" placeholder="请选择">
                <el-option label="等于" value="2"></el-option>
                <el-option v-if="testData.conditionType2!=7" label="不等于" value="13"></el-option>
              </el-select>
              <!--third-->
              <el-input v-if="testData.conditionType2==1||testData.conditionType2==2||testData.conditionType2==3||testData.conditionType2==4||testData.conditionType2==7||testData.conditionType2==8" type="text" style="width:180px;" v-model="testData.conditionInfo2"></el-input>
              <el-select v-if="testData.conditionType2==5" v-model="testData.conditionInfo2" style="width:180px;" placeholder="请选择">
                <el-option v-if="testData.childType2!=13" label="全部" value=""></el-option>
                <el-option label="未付款" value="1"></el-option>
                <el-option label="已付款" value="2"></el-option>
                <el-option label="货到付款" value="3"></el-option>
                <el-option label="已发货" value="4"></el-option>
                <el-option label="待退货" value="5"></el-option>
                <el-option label="已退货" value="6"></el-option>
                <el-option label="待退款" value="7"></el-option>
                <el-option label="已退款" value="8"></el-option>
                <el-option label="已关闭" value="9"></el-option>
                <el-option label="已完成" value="10"></el-option>
              </el-select>
              <el-select v-if="testData.conditionType2==6" v-model="testData.conditionInfo2" style="width:180px;" placeholder="请选择">
                <el-option v-if="testData.childType2!=13" label="全部" value=""></el-option>
                <el-option label="手动批量拆分" value="2"></el-option>
                <el-option label="手动合并" value="3"></el-option>
                <el-option label="自动预售拆分" value="4"></el-option>
                <el-option label="自动拆分" value="5"></el-option>
                <el-option label="自动合并" value="6"></el-option>
                <el-option label="手动自定义拆分" value="7"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <!--操作按钮区-->
      <div class="col-nav">
        <ul>
          <li @click="dataExport" v-if="authorityCode.OMS_ORDQUERY_EXPORT"><span>导出</span></li>
        </ul>
      </div>
      <div style="padding-bottom: 32px;margin-top:15px;">
        <!-- 表格区订单列表 -->
        <ag-grid-vue :style='{"height":agHeight+"px","width": "100%"}'
                     class="ag-theme-balham ag-table"
                     :gridOptions="gridOptions"
                     :columnDefs="columnDefs"
                     :rowData="orderList"
                     :pinnedBottomRowData="pinnedBottomRowData"
                     rowSelection="multiple"
                     :enableFilter="true"
                     :components="components"
                     :enableSorting="true"
                     :gridReady="onGridReady"><!--:enableSorting="true"-->
        </ag-grid-vue>
      </div>
      <div id="pageTool" class="col-pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[15,30,50,100,200,1000,2000]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <!--商品详细信息-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="商品详细信息" :visible.sync="goodsDetailDialog" v-if="goodsDetailDialog" width="1100px">
        <order-detail-dialog :isOperation="false" :salesOrderId="salesOrderId"></order-detail-dialog>
      </el-dialog>
      <!--添加商品弹框-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="商品列表" v-loading="loading" element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading" :visible.sync="dialogAddCommodity" width="800px">
        <div class="input-box">
          <el-row>
            <el-col :span="10">
              <div><label for="">商品名称：</label>
                <el-input maxlength="50" style="width:200px;" v-model="addCommodityParam.goodsName" @keyup.enter.native="queryGiftBtn2"></el-input>
              </div>
            </el-col>
            <el-col :span="10">
              <div><label for="">条形码：</label>
                <el-input maxlength="50" style="width:200px;" v-model="addCommodityParam.barCode" @keyup.enter.native="queryGiftBtn2"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button  type="primary" style="height:28px;" @click="queryGiftBtn2">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            border
            max-height="400"
            :data="addCommodityData"
            @selection-change="handleSelectionChange2"
            style="margin-top:15px;"
          >
            <el-table-column
              align='center'
              label="序号"
              type="selection"
              width="80">
            </el-table-column>
            <el-table-column
              label="序号"
              align='center'
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="imageUrl"
              align='center'
              label="图片"
              min-width="">
              <template slot-scope="scope">
                <img v-if="scope.row.goodsImageBean" :src="scope.row.goodsImageBean.imageUrl" alt="">
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsName"
              align='center'
              label="商品名称"
              width="">
            </el-table-column>
            <el-table-column
              prop="specification"
              align='center'
              min-width=''
              label="规格">
            </el-table-column>
            <el-table-column
              prop="barCode"
              label="条形码"
              min-width=''
              align='center'
              width="">
            </el-table-column>
            <!--<el-table-column
              prop="buyQty"
              align='center'
              label="库存"
              width="">
            </el-table-column>-->
          </el-table>
          <div class="dialog-pagination">
            <el-pagination
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="currentPage2"
              :page-sizes="[15, 30, 50, 100, 200]"
              :page-size="totalPage2"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum2">
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddCommodity">取消</el-button>
        <el-button type="primary"  @click="saveAddCommodity">确定</el-button>
      </span>
      </el-dialog>
    </div>
    <order-detail v-if="!paramsObj.mainPageShow" :params="paramsObj" @changeShow="changeShow"></order-detail>
  </div>
</template>

<script>
  import { zeroFill,positiveIntegerValidator,priceValidator,gridOptions,turnTimestamp,phoneEncrypt } from '@/assets/js/validate.js';
  import OrderDetail from '@/components/views/order/children/OrderDetail.vue';
  import OrderDetailDialog from '@/components/common/OrderDetailDialog.vue';
  import {AgGridVue} from "ag-grid-vue";
  export default {
    name: "orderQuery",
    components: {
      'ag-grid-vue': AgGridVue,
      OrderDetail,
      OrderDetailDialog,
      RowFn: {//params.node.rowIndex+1
        template: `<span><span v-if="params.data.index == '合计'">{{params.data.index}}</span><span v-else>{{params.node.rowIndex+1}}</span></span>`
      },
    },
    data() {
      return {
        pinnedBottomRowData:[],
        orderStatusArr: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '未付款',
            value: 1,
          },
          {
            label: '已付款',
            value: 2,
          },
          {
            label: '货到付款',
            value: 3,
          },
          {
            label: '已发货',
            value: 4,
          },
          {
            label: '待退货',
            value: 5,
          },
          {
            label: '已退货',
            value: 6,
          },
          {
            label: '待退款',
            value: 7,
          },
          {
            label: '已退款',
            value: 8,
          },
          {
            label: '已关闭',
            value: 9,
          },
          {
            label: '已完成',
            value: 10,
          }],//订单状态枚举值
        splitJoinStatusObj:{
          1:'合并手拆',
          2:'手动批量拆分',
          3:'手动合并',
          4:'自动预售拆分',
          5:'自动拆分',
          6:'自动合并',
          7:'手动自定义拆分'
        },//拆合状态
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
        goodsDetailDialog:false,//商品详情弹框显隐
        salesOrderId:'',//订单id
        paramsObj:{
          mainPageShow:true,
        },//订单详情组件回传
        loading:false,
        addCommodityParam: {
          page: 1,
          size: 15,
          goodsName:'',
          barCode:'',
        },//添加商品查询条件
        addCommodityData: [],//添加商品tableData
        currentPage2: 1,
        totalPage2: 15,
        totalNum2: 0,
        dialogAddCommodity: false,//添加商品弹框
        version: "1.0.0",
        goodsListVisible: false, //商品列表显示判断
        textLength: 50, //文本框最大字符数
        total: 0, //总页数
        size: 15, //每页数量
        page: 1, //当前页数
        shopList: [], //店铺列表
        storeList: [], //仓库列表
        expressList: [], //快递列表
        expressListStr:'',//快递string
        goods: "", //商品ID
        goodsNameTemp: "", //商品ID临时参数
        t_height: 0, //表格宽度
        setDay: 7,//日期 当天、7、30
        columnsCheckList: [], //自定义显示列列表
        moreConditionFlag: false, //更多条件显示标记
        timer: [], //时间选择
        tableCheckList: [], //选中的列表订单
        orderStatus: "", //订单状态
        testData: {
          payStatus:'3',
          codFlag:'-1',
          searchTime: '1',//下单时间
          storeBeans: [],//店铺
          storageBeans: [],//仓库
          refundStatus: '1',//退款状态
          expressBeans:'',//快递
          refundType: '',
          orderTypes: ['1','3','4','5'],
          flagId:[],
          orderChannel:'',
          goodsNumTStart: "", //商品条数下限
          goodsNumTEnd: "", //商品条数上限
          goodsQtySStart: "", //商品数量下限
          goodsQtySEnd: "", //商品数量上限
          orderWeightSStart: "", //订单重量下限
          orderWeightSEnd: "", //订单重量上限
          orderAmtSStart: "", //订单金额下限
          orderAmtSEnd: "", //订单金额上限
          sortType: true,
          consigneeInfoText:'',
          goodsBarCode:'',
          page: 1,
          size: 15,
          orderSignCode:'0',
          conditionType1:'1',
          childType1:'1',
          conditionInfo1:'',
          conditionType2:'1',
          childType2:'1',
          conditionInfo2:'',
          conditionRelation:'1',
        },//查询条件
        consigneeInfoText:[],//省value
        addressList: [
          {
            value: "1",
            label: "收货人"
          },
          {
            value: "2",
            label: "手机"
          },
          {
            value: "3",
            label: "电话"
          },
          {
            value: "4",
            label: "省份"
          },
          /*{
            value: "5",
            label: "收货地址"
          }*/
        ],//收货信息下拉
        flagList: [
          {
            value: "1",
            label: "红色",
            color: "#cd3930"
          },
          {
            value: "2",
            label: "黄色",
            color: "#edcf4c"
          },
          {
            value: "3",
            label: "绿色",
            color: "#72c95d"
          },
          {
            value: "4",
            label: "蓝色",
            color: "#3d9bfe"
          },
          {
            value: "5",
            label: "紫色",
            color: "#822aea"
          }
        ],//颜色下拉
        refundStatusList: [
          {
            value: "",
            label: "全部"
          },
          {
            value: "1",
            label: "未退款"
          },
          {
            value: "2",
            label: "退款中"
          },
          {
            value: "3",
            label: "已退款"
          }
        ],//退款状态
        refundTypeList: [
          {
            value: "2",
            label: "部分退款"
          },
          {
            value: "3",
            label: "全部退款"
          }
        ],//退款类型
        orderStatusList: [
          {
            value: "1",
            label: "待客审"
          },
          {
            value: "2",
            label: "已客审"
          },
          {
            value: "3",
            label: "已财审"
          },
          {
            value: "4",
            label: "已仓审"
          },
          {
            value: "20",
            label: "已分配拣货位"
          },
          {
            value: "5",
            label: "已拣货"
          },
          {
            value: "6",
            label: "已验货"
          },
          {
            value: "7",
            label: "已打包"
          },
          {
            value: "8",
            label: "已称重"
          },
          {
            value: "9",
            label: "已发货"
          },
          {
            value: "10",
            label: "已完成"
          },
          {
            value: "11",
            label: "已取消"
          },
          {
            value: "12",
            label: "已作废"
          }
        ],//订单状态
        timerList: [
          {
            value: "1",
            label: "下单时间"
          },
          {
            value: "2",
            label: "付款时间"
          },
          {
            value: "3",
            label: "发货时间"
          },
          {
            value: "4",
            label: "审单时间"
          }
        ],//时间类型
        orderTypeList: [
          {
            value: "1",
            label: "正常订单"
          },
          {
            value: "2",
            label: "预售订单"
          },
          {
            value: "3",
            label: "换货订单"
          },
          {
            value: "4",
            label: "补发订单"
          },
          {
            value: "5",
            label: "定金订单"
          }
        ],//订单类型
        shopSelect: [],//选中店铺
        storeSelect: [],//选中仓库
        consigneeTypeList: [],//省级下拉
        //ag-grid
        gridOptions: gridOptions(),
        agHeight:0,
        components: null,
        columnDefs: null,
        rowData: null,
        //企业扩展
        gridApi: null,
        columnApi: null,
        autoGroupColumnDef: null,
        //ag-grid
        orderList: [], //订单列表
        goodsId:[],//商品id集合
        selectionData2:[],//添加商品选中商品集合
        orderSignList: {
          "0": "全部",
        },//异常标记列表
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
        //付款状态列表
        payStatusObj: {
          "1": "未付款",
          "2": "部分付款",
          "3": "已付款"
        },
        //退款状态列表
        refundStatusObj: {
          "1": "未退款",
          "2": "退款中",
          "3": "已退款"
        },
        //退款类型列表
        refundTypeObj: {
          "1": "未退款",
          "2": "部分退款",
          "3": "全部退款"
        },
        //发货状态
        sendStatusObj:{
          "1":'未发货',
          "2":'部分发货',
          "3":'已发货'
        },
        //订单类型列表
        orderTypeObj: {
          "0": "全部",
          "1": "正常订单",
          "2": "预售订单",
          "3": "换货订单",
          "4": "补发订单",
          "5": "定金订单"
        },
        //订单渠道
        orderChannelObj:{
          '1':'网店直营',
          '2':'手工下单',
          '3':'导入订单'
        },
      }
    },
    methods: {
      multipleChange(value) {
        this.consigneeInfoText = value;
      },
      multipleChange1(value){
        this.testData.orderTypes = value;
      },
      //查询类型改变（条件1）
      changeOrder1(){
        if(this.testData.conditionType1 == 1 || this.testData.conditionType1 == 2 || this.testData.conditionType1 == 3 || this.testData.conditionType1 == 4 || this.testData.conditionType1 == 8){
          this.testData.childType1 = '1';
        }else if(this.testData.conditionType1 == 5 || this.testData.conditionType1 == 6 || this.testData.conditionType1 == 7){
          this.testData.childType1 = '2';
        }
        this.testData.conditionInfo1 = '';
      },
      //查询类型改变（条件2）
      changeOrder2(){
        if(this.testData.conditionType2 == 1 || this.testData.conditionType2 == 2 || this.testData.conditionType2 == 3 || this.testData.conditionType2 == 4 || this.testData.conditionType2 == 8){
          this.testData.childType2 = '1';
        }else if(this.testData.conditionType2 == 5 || this.testData.conditionType2 == 6 || this.testData.conditionType2 == 7){
          this.testData.childType2 = '2';
        }
        this.testData.conditionInfo2 = '';
      },
      childTypeChange1(){
        if(this.testData.childType1 == 2){
          this.testData.conditionInfo1 = '';
        }else{
          if(this.testData.conditionType1 == 5){
            this.testData.conditionInfo1 = '1';
          }else{
            this.testData.conditionInfo1 = '2';
          }
        }
      },
      childTypeChange2(){
        if(this.testData.childType2 == 2){
          this.testData.conditionInfo2 = '';
        }else{
          if(this.testData.conditionType2 == 5){
            this.testData.conditionInfo2 = '1';
          }else{
            this.testData.conditionInfo2 = '2';
          }
        }
      },
      //订单详情组件回传
      changeShow(param){
        if(param){
          this.conditionSearch();
        }
        this.paramsObj.mainPageShow = true;
        this.renderTableHeight();
      },
      //渲染省级下拉
      channelConsignee(){
        this.testData.consigneeInfoText='';
        if(this.testData.consigneeType==4){
          /*$('#provinceMul').multiselect('dataprovider', this.consigneeTypeList);
          $('#provinceMul').multiselect('select',[]);*/
          this.consigneeInfoText = [];
        }
      },
      /*----------------------------------*/
      //添加商品弹框
      addCommodityDialog(logo) {
        this.addCommodityParam.size=this.totalPage2;
        if (logo) {
          this.addCommodityParam.goodsName = '';
          this.addCommodityParam.barCode = '';
        }
        if(logo != 'init')this.loading = true;
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsAndSuitByCondition',this.addCommodityParam).then((response)=>{
          this.loading = false;
          if (response.data.success) {
            if(logo != 'init')this.dialogAddCommodity = true;
            this.addCommodityData = response.data.result.rows;
            this.totalNum2 = response.data.result.total;
            this.goodsId = JSON.parse(JSON.stringify((this.addCommodityData)));
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //添加商品保存
      saveAddCommodity() {
        if (this.selectionData2.length == 0) {
          this.$message({
            message: '请选择要添加的商品！',
            type: 'warning'
          });
          return false;
        } else {
          var barCodes = this.testData.goodsBarCode.split(','),mapArr = new Map();
          if(barCodes[0] == ''){
            barCodes.splice(0,1);
          }
          barCodes.forEach(item => {
            mapArr.set(item,item);
          })
          this.selectionData2.forEach(item => {
            if(!mapArr.get(item.barCode)){
              barCodes.push(item.barCode);
            }
          })
          this.testData.goodsBarCode = barCodes.join(',');
          this.dialogAddCommodity = false;
        }
      },
      //添加商品取消
      cancelAddCommodity() {
        this.dialogAddCommodity = false;
      },
      handleSelectionChange2(val) {
        this.selectionData2 = val;
      },
      handleSizeChange2(val) {
        this.addCommodityParam.size = val;
        this.addCommodityDialog();
      },
      handleCurrentChange2(val) {
        this.addCommodityParam.page = val;
        this.addCommodityDialog();
      },
      //添加商品列表渲染
      queryGiftBtn2() {
        this.addCommodityDialog();
      },
      /*----------------------------------*/
      //选择时间改变
      handlePicker(value){
        if(value==null){
          this.$message({
            message: '起止时间不能为空，请重新选择时间范围！',
            type: 'warning'
          });
          this.getNowDay(7);
        }
        /*if(value && (value[1]-value[0]>7776000000)){
          this.$message({
            message: '起止时间间隔范围最多不能超多3个月，请重新选择时间范围！',
            type: 'warning'
          });
          this.getNowDay(7);
        }*/
      },
      //根据条件查询-----------------------------------
      conditionSearch() {
        this.testData.storeBeans = $('#participate-shop').val()==null || $('#participate-shop').val().length == this.shopList.length?'':JSON.stringify($('#participate-shop').val());
        this.testData.storageBeans = $('#Warehouse').val()==null || $('#Warehouse').val().length == this.storeList.length?'':JSON.stringify($('#Warehouse').val());
        if(this.testData.consigneeType=='4'){
          //this.testData.consigneeInfoText = $('#provinceMul').val()==null || $('#provinceMul').val().length == this.consigneeTypeList.length?'':$('#provinceMul').val();
          this.testData.consigneeInfoText = this.consigneeInfoText.length == 0 || this.consigneeInfoText.length == this.consigneeTypeList.length?'':JSON.parse(JSON.stringify(this.consigneeInfoText));
          console.log(this.testData.consigneeInfoText);
        }
        this.testData.searchTimeStart=this.timer?this.timer[0]:'';
        this.testData.searchTimeEnd=this.timer?this.timer[1]:'';
        this.loading = true;

        this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/getOrderOnlySearchByList",this.testData).then((response)=>{
          this.loading = false;
          if (response.data.success) {
            this.orderList = response.data.result.rows;
            this.orderList.map((v,index)=>{
              this.$set(v,'index',index+1);
              this.$set(v,'consignee',v.consignee && v.consignee!='undefined'?v.consignee:'');
              this.$set(v,'consigneeMobile',v.consigneeMobile && v.consigneeMobile!='undefined'?phoneEncrypt(v.consigneeMobile):'');
              this.$set(v,'consigneePhone',v.consigneePhone && v.consigneePhone!='undefined'?v.consigneePhone:'');
              var orderStatus='';
              switch(v.orderStatus){
                case '1':
                  orderStatus='待客审';
                  break;
                case '2':
                  orderStatus='已客审';
                  break;
                case '3':
                  orderStatus='已财审';
                  break;
                case '4':
                  orderStatus='已仓审';
                  break;
                case '5':
                  orderStatus='已拣货';
                  break;
                case '6':
                  orderStatus='已验货';
                  break;
                case '7':
                  orderStatus='已打包';
                  break;
                case '8':
                  orderStatus='已称重';
                  break;
                case '9':
                  orderStatus='已发货';
                  break;
                case '10':
                  orderStatus='已完成';
                  break;
                case '11':
                  orderStatus='已取消';
                  break;
                case '12':
                  orderStatus='已作废';
                  break;

              }
              this.$set(v,'orderStatus',orderStatus);
              this.$set(v,'orderTime',v.orderTime?turnTimestamp(v.orderTime):'');
              this.$set(v,'payTime',v.payTime?turnTimestamp(v.payTime):'');
              this.$set(v,'orderSign',v.orderSign ? v.orderSign.split(',') : []);
              if (v.manualHangupFlag) {
                this.$set(v,'hangupLogo','【挂】');
              } else {
                this.$set(v,'hangupLogo','');
              }
              v.orderSign1 = v.hangupLogo + v.orderSign.join(',');
              v.consigneeProvince = v.consigneeProvince && v.consigneeProvince != 'undefined'?v.consigneeProvince:'';
              v.consigneeCity = v.consigneeCity && v.consigneeCity != 'undefined'?v.consigneeCity:'';
              v.consigneeArea = v.consigneeArea && v.consigneeArea != 'undefined'?v.consigneeArea:'';
              v.consigneeTown = v.consigneeTown && v.consigneeTown != 'undefined'?v.consigneeTown:'';
              v.shippingAddress = v.shippingAddress && v.shippingAddress != 'undefined'?v.shippingAddress:'';
              v.ecOrderStatus = v.ecOrderStatus ? this.ecOrderStatusObj[v.ecOrderStatus] : '';//平台订单状态
              v.splitJoinStatus = v.splitJoinStatus ? this.splitJoinStatusObj[v.splitJoinStatus] : '';//拆合状态
              //v.sourceOrderNo = (v.orderType == 3 || v.orderType == 4) ? '' : v.sourceOrderNo;//平台单号
              v.customerMsg = v.customerMsg ? v.customerMsg : '';
              v.serviceMsg = v.serviceMsg ? v.serviceMsg : '';
              v.serviceMsg = v.serviceMsg && v.serviceMsg.length > 500 ? v.serviceMsg.slice(0, 500) : v.serviceMsg;
              v.customerMsg = v.customerMsg && v.customerMsg.length > 500 ? v.customerMsg.slice(0, 500) : v.customerMsg;
              v.buyerNick = v.buyerNick ? v.buyerNick : '';
              v.storeName = v.storeName ? v.storeName : '';

              //处理表格复制
              v.productTypenum1 = v.goodsTypeQty + '/' + v.goodsQty;

              v.orderTotalAmt1 = v.orderTotalAmt;
              v.actuallyPayAmt1 = v.actuallyPayAmt;
              v.merchantDctAmt1 = v.merchantDctAmt;
              v.ecDctAmt1 = v.ecDctAmt;
              v.freightAmt1 = v.freightAmt;
              v.expressServiceAmt1 = v.expressServiceAmt;

              v.totalWeight = v.totalWeight?zeroFill(v.totalWeight):'0.00';
              v.grossWeight = v.grossWeight?zeroFill(v.grossWeight):'0.00';
              v.orderTotalAmt = v.orderTotalAmt?'￥'+ zeroFill(v.orderTotalAmt):'￥0.00';
              v.actuallyPayAmt = v.actuallyPayAmt?'￥'+ zeroFill(v.actuallyPayAmt):'￥0.00';
              v.merchantDctAmt = v.merchantDctAmt?'￥' + zeroFill(v.merchantDctAmt):'￥0.00';
              v.ecDctAmt = v.ecDctAmt?'￥' + zeroFill(v.ecDctAmt):'￥0.00';
              v.freightAmt = v.freightAmt?'￥' + zeroFill(v.freightAmt):'￥0.00';
              v.expressServiceAmt = v.expressServiceAmt?'￥' + zeroFill(v.expressServiceAmt):'￥0.00';

              v.payStatus = this.payStatusObj[v.payStatus];//付款状态
              v.refundStatus = this.refundStatusObj[v.refundStatus];//退款状态
              v.refundType = this.refundTypeObj[v.refundType];//退款类型
              v.sendStatus = this.sendStatusObj[v.sendStatus];//发货状态
              v.ecSendStatus = this.sendStatusObj[v.ecSendStatus];//平台发货状态
              v.orderType = this.orderTypeObj[v.orderType];//订单类型
              if(v.pushOtherFlag){
                v.pushOtherFlag = '已推送';
              }else{
                v.pushOtherFlag = v.pushOtherFlag === false?'未推送':'';
              }//三方仓推送状态
              v.orderChannel = this.orderChannelObj[v.orderChannel];//订单渠道
              if(v.cainiaoServiceType){
                v.cainiaoServiceType = v.cainiaoServiceType == 1?'当日达':'次日达';
              }else{
                v.cainiaoServiceType = '';
              }//菜鸟服务类型
              if (v.orderReviewTime) v.orderReviewTime = turnTimestamp(v.orderReviewTime);//审单时间
              if (v.sendTime) v.sendTime = turnTimestamp(v.sendTime);//发货时间
              if (v.createTime) v.createTime = turnTimestamp(v.createTime);//发货时间

              v.firstPayAmt1 = v.firstPayAmt;
              v.lastPayAmt1 = v.lastPayAmt;
              v.receiptServiceAmt1 = v.receiptServiceAmt;
              v.goodsTotalAmt1 = v.goodsTotalAmt;
              v.orderDctAmt1 = v.orderDctAmt;
              v.firstPayAmt = v.firstPayAmt?'￥'+ zeroFill(v.firstPayAmt):'￥0.00';
              v.lastPayAmt = v.lastPayAmt?'￥'+ zeroFill(v.lastPayAmt):'￥0.00';
              v.receiptServiceAmt = v.receiptServiceAmt?'￥' + zeroFill(v.receiptServiceAmt):'￥0.00';
              v.goodsTotalAmt = v.goodsTotalAmt?'￥' + zeroFill(v.goodsTotalAmt):'￥0.00';
              v.orderDctAmt = v.orderDctAmt?'￥' + zeroFill(v.orderDctAmt):'￥0.00';
              return v;
            })
            this.getSummaries();
            this.total = response.data.result.total;
            this.page = response.data.result.page;
            this.size = response.data.result.size;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //计算表格金额合计
      getSummaries(data){
        var tableData = data?JSON.parse(JSON.stringify(data)):JSON.parse(JSON.stringify(this.orderList));
        var obj = {
          index:'合计',
          salesOrderNo:'',
          orderSign:[],
          customerMsg:'',
          serviceMsg:'',
          handResion:'',
          hangupLogo:'',
          orderTotalAmt:0,
          ecDctAmt:0,
          merchantDctAmt:0,
          actuallyPayAmt:0,
          freightAmt:0,
          expressServiceAmt:0,
          firstPayAmt:0,
          lastPayAmt:0,
          receiptServiceAmt:0,
          goodsTotalAmt:0,
          orderDctAmt:0,
          totalWeight:0,
          grossWeight:0,
          goodsQty:0
        }
        tableData.forEach(item => {
          item.orderTotalAmt1 = item.orderTotalAmt1?item.orderTotalAmt1*1:0;
          item.ecDctAmt1 = item.ecDctAmt1?item.ecDctAmt1*1:0;
          item.merchantDctAmt1 = item.merchantDctAmt1?item.merchantDctAmt1*1:0;
          item.actuallyPayAmt1 = item.actuallyPayAmt1?item.actuallyPayAmt1*1:0;
          item.freightAmt1 = item.freightAmt1?item.freightAmt1*1:0;
          item.expressServiceAmt1 = item.expressServiceAmt1?item.expressServiceAmt1*1:0;
          item.firstPayAmt1 = item.firstPayAmt1?item.firstPayAmt1*1:0;
          item.lastPayAmt1 = item.lastPayAmt1?item.lastPayAmt1*1:0;
          item.receiptServiceAmt1 = item.receiptServiceAmt1?item.receiptServiceAmt1*1:0;
          item.goodsTotalAmt1 = item.goodsTotalAmt1?item.goodsTotalAmt1*1:0;
          item.orderDctAmt1 = item.orderDctAmt1?item.orderDctAmt1*1:0;
          item.totalWeight = item.totalWeight?item.totalWeight*1:0;
          item.grossWeight = item.grossWeight?item.grossWeight*1:0;

          obj.orderTotalAmt += item.orderTotalAmt1;
          obj.ecDctAmt += item.ecDctAmt1;
          obj.merchantDctAmt += item.merchantDctAmt1;
          obj.actuallyPayAmt += item.actuallyPayAmt1;
          obj.freightAmt += item.freightAmt1;
          obj.expressServiceAmt += item.expressServiceAmt1;
          obj.firstPayAmt += item.firstPayAmt1;
          obj.lastPayAmt += item.lastPayAmt1;
          obj.receiptServiceAmt += item.receiptServiceAmt1;
          obj.goodsTotalAmt += item.goodsTotalAmt1;
          obj.orderDctAmt += item.orderDctAmt1;
          obj.totalWeight += item.totalWeight;
          obj.grossWeight += item.grossWeight;
          obj.goodsQty += item.goodsQty*1;
        })
        obj.totalWeight = zeroFill(obj.totalWeight);
        obj.grossWeight = zeroFill(obj.grossWeight);
        obj.orderTotalAmt = '￥' + zeroFill(obj.orderTotalAmt);
        obj.ecDctAmt = '￥' + zeroFill(obj.ecDctAmt);
        obj.merchantDctAmt = '￥' + zeroFill(obj.merchantDctAmt);
        obj.actuallyPayAmt = '￥' + zeroFill(obj.actuallyPayAmt);
        obj.freightAmt = '￥' + zeroFill(obj.freightAmt);
        obj.expressServiceAmt = '￥' + zeroFill(obj.expressServiceAmt);
        obj.firstPayAmt = '￥' + zeroFill(obj.firstPayAmt);
        obj.lastPayAmt = '￥' + zeroFill(obj.lastPayAmt);
        obj.receiptServiceAmt = '￥' + zeroFill(obj.receiptServiceAmt);
        obj.goodsTotalAmt = '￥' + zeroFill(obj.goodsTotalAmt);
        obj.orderDctAmt = '￥' + zeroFill(obj.orderDctAmt);
        this.pinnedBottomRowData = [obj];
      },
      //数据导出
      dataExport() {
        this.loading = true;
        this.testData.storeBeans = $('#participate-shop').val()==null || $('#participate-shop').val().length == this.shopList.length?'':JSON.stringify($('#participate-shop').val());
        this.testData.storageBeans = $('#Warehouse').val()==null || $('#Warehouse').val().length == this.storeList.length?'':JSON.stringify($('#Warehouse').val());
        this.testData.searchTimeStart=this.timer?this.timer[0]:'';
        this.testData.searchTimeEnd=this.timer?this.timer[1]:'';
        this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/export",this.testData).then((response)=>{
          this.loading = false;
          if (response.data.success) {
            location.href = 'http://'+process.env.FILE_API+'/files-web/download/' + response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        }).catch(()=> {
          this.loading = false;
          this.$message({
            message: '接口超时，请从后端获取id导出数据',
            type: "warning"
          });
        })
      },
      //验证查询值是否合法
      checkValue(num) {
        switch(num){
          case 1:
            this.testData.goodsNumTStart=positiveIntegerValidator(this.testData.goodsNumTStart);
            this.testData.goodsNumTEnd=positiveIntegerValidator(this.testData.goodsNumTEnd);
            if(this.testData.goodsNumTStart && this.testData.goodsNumTEnd && this.testData.goodsNumTEnd*1<this.testData.goodsNumTStart*1){
              this.$message({
                message: '上限值不能低于下限值！',
                type: 'warning'
              });
              this.testData.goodsNumTEnd='';
            }
            break;
          case 2:
            this.testData.goodsQtySStart=positiveIntegerValidator(this.testData.goodsQtySStart);
            this.testData.goodsQtySEnd=positiveIntegerValidator(this.testData.goodsQtySEnd);
            if(this.testData.goodsQtySStart && this.testData.goodsQtySEnd && this.testData.goodsQtySEnd*1<this.testData.goodsQtySStart*1){
              this.$message({
                message: '上限值不能低于下限值！',
                type: 'warning'
              });
              this.testData.goodsQtySEnd='';
            }
            break;
          case 3:
            this.testData.orderAmtSStart=priceValidator(this.testData.orderAmtSStart);
            this.testData.orderAmtSEnd=priceValidator(this.testData.orderAmtSEnd);
            if(this.testData.orderAmtSStart && this.testData.orderAmtSEnd && this.testData.orderAmtSEnd*1<this.testData.orderAmtSStart*1){
              this.$message({
                message: '上限值不能低于下限值！',
                type: 'warning'
              });
              this.testData.orderAmtSEnd='';
            }
            break;
          case 4:
            this.testData.orderWeightSStart=priceValidator(this.testData.orderWeightSStart);
            this.testData.orderWeightSEnd=priceValidator(this.testData.orderWeightSEnd);
            if(this.testData.orderWeightSStart && this.testData.orderWeightSEnd && this.testData.orderWeightSEnd*1<this.testData.orderWeightSStart*1){
              this.$message({
                message: '上限值不能低于下限值！',
                type: 'warning'
              });
              this.testData.orderWeightSEnd='';
            }
            break;
        }
      },
      //清除商品条形码
      clearGoods() {
        this.testData.goodsBarCode = '';
      },
      //选中项添加到数组
      checkRow(v) {
        this.tableCheckList = v;
      },
      //重置按钮重置所有变量
      refresh() {
        $('#participate-shop').multiselect('select',this.shopSelect);
        $('#Warehouse').multiselect('select',this.storeSelect);
        this.consigneeInfoText = [];
        this.getNowDay(7);
        this.goods = "";
        this.testData={
            storeBeans:[],//店铺
            storageBeans:[],//仓库
            expressBeans:'',//快递
            sourceOrderNo:'',//外部平台单号
            expressNo:'', //快递单号
            customerName:'',//买家ID
            salesOrderNo:'',//销售订单号
            searchTime:'1',//下单时间
            searchTimeStart:'', //订单查询时间 时间戳 开始时间
            searchTimeEnd:'', //订单查询时间 时间戳 结束时间
            orderTypes:['1','3','4','5'],//订单类型
            goodsId:'',//商品ID
            goodsBarCode:'',
            orderStatus:'',//订单状态
            payStatus:'3',
            codFlag:'-1',
            refundStatus:'1',//退款状态
            refundType:'',//退款类型
            flagId:[],//旗帜
            orderChannel:'',
            consigneeType:'', //收货人信息枚举 默认为全部
            consigneeInfoText:'', //收货人信息内容
            goodsNumTStart: "", //商品条数下限
            goodsNumTEnd: "", //商品条数上限
            goodsQtySStart: "", //商品数量下限
            goodsQtySEnd: "", //商品数量上限
            orderWeightSStart: "", //订单重量下限
            orderWeightSEnd: "", //订单重量上限
            orderAmtSStart: "", //订单金额下限
            orderAmtSEnd: "", //订单金额上限
            sortType:true,
            page:1,
            size:15,
            orderSignCode:'0',
            conditionType1:'1',
            childType1:'1',
            conditionInfo1:'',
            conditionType2:'1',
            childType2:'1',
            conditionInfo2:'',
            conditionRelation:'1',
        }
      },
      filterHandler(value, row, column) {
        console.log(value);
        console.log(row);
        console.log(column);
      },
      //根据天数设置查询的时间区间,传入的参数为需要设置的天数
      getNowDay(time) {
        this.timer = [];
        var start = new Date();
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        var todayStartTime = Date.parse(start);
        if (time == 1) {
          this.timer.push(todayStartTime);
        } else {
          this.timer.push(todayStartTime - 3600 * 1000 * 24 * time);
        }

        this.timer.push(todayStartTime + 24 * 60 * 60 * 1000 - 1000);
        this.setDay = time;
      },
      //设置商品名称
      setGoodsName(value) {
        this.goodsNameTemp = "";
        if (value != null) {
          this.goodsNameTemp = value.barCode;
        }
      },
      //商品信息写入到文本框
      selectGoodsEnter() {
        this.goods = this.goodsNameTemp;
        this.goodsListVisible = false;
      },
      handleSizeChange(value) {
        this.testData.size = value;
        this.conditionSearch();
      },
      handleCurrentChange(value) {
        this.testData.page = value;
        this.conditionSearch();
      },
      //表头背景颜色
      headBgc({ row, rowIndex }) {
        return {
          "background-color": "#eeeeee!important"
        };
      },
      //获取查询条件的元素
      getQueryInit(){
        this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/getPageElement").then((response)=>{
          if (response.data.code == 0) {
            //快递
            var expressList = {};
            expressList[''] = '全部';
            for(var item in response.data.result.elem_express){
              expressList[item] = response.data.result.elem_express[item];
            }
            this.expressList = expressList;
            this.expressListStr = JSON.stringify(this.expressList);
            //参与店铺
            for(var item in response.data.result.elem_store){
              this.shopList.push({
                value:item,
                label:response.data.result.elem_store[item]
              });
              this.shopSelect.push(item);
            }
            $('#participate-shop').multiselect('dataprovider', this.shopList);
            $('#participate-shop').multiselect('select',this.shopSelect);//storeSelect

            //仓库
            for(var item in response.data.result.elem_storage){
              this.storeList.push({
                value:item,
                label:response.data.result.elem_storage[item]
              });
              this.storeSelect.push(item);
            }
            $('#Warehouse').multiselect('dataprovider', this.storeList);
            $('#Warehouse').multiselect('select',this.storeSelect);

            //根据条件查询
            this.conditionSearch();
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list',{regionId:1}).then((response)=>{
          if(response.data.success){
            this.consigneeTypeList=response.data.result;
            this.consigneeTypeList.forEach((item,i)=>{
              item.value = item.regionName;
              item.label = item.regionName;
            })
           /* $('#provinceMul').multiselect('dataprovider', this.consigneeTypeList);
            $('#provinceMul').multiselect('select',[]);*/
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //渲染表格高度
      renderTableHeight(){
        this.$nextTick(function () {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 90;
        });
        window.onresize = () => {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 90;
        }
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        //params.api.sizeColumnsToFit();
        this.gridOptions.onSelectionChanged= (event)=> {
          this.orderLists = this.getSelectedRows();
        }
        this.gridOptions.onFilterChanged = (event) => {
          var tableData = [];
          this.gridOptions.api.forEachNodeAfterFilterAndSort((node,index)=>{
            tableData.push(node.data);
          })
          this.getSummaries(tableData);
        }
      },
      getSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map( node => node.data );
        return selectedData;
      },
      //订单号 商品信息
      getRenderer2(item) {
        var _this=this;
        function CellRenderer() {}
        CellRenderer.prototype.createGui = function() {
          var template =
            '<span><span class="jump" style="color:#409eff;cursor:pointer;"></span></span>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function(params) {
          this.createGui();
          this.params = params;
          var eValue = this.eGui.querySelector(".jump");
          if(item=='productTypenum'){
            if(params.data.goodsTypeQty && params.data.goodsQty){
              eValue.innerHTML = params.data.goodsTypeQty + '/' + params.data.goodsQty;
            }else{
              eValue.innerHTML = params.data.goodsQty;
              $(eValue).css({'color':'#000','cursor':'unset'});
            }
          }else{
            eValue.innerHTML = params.data.salesOrderNo;
          }
          this.eButton = this.eGui.querySelector(".jump");
          this.buttonClickListener = this.onButtonClicked.bind(this,params);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function() {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function(params) {
          if(params.data.index == '合计')return;
          if (item == 'productTypenum') {
            //获取商品详情
            _this.salesOrderId = this.params.data.salesOrderId;
            _this.goodsDetailDialog = true;
          } else {
            _this.paramsObj = {
              orderId:this.params.data.salesOrderId,
              fromPage:'OrderQuery',
              mainPageShow:false
            }
          }
        };
        CellRenderer.prototype.destroy = function() {
          this.eButton.removeEventListener("click", this.buttonClickListener);
        };
        return CellRenderer;
      },
      //仓库级联快递
      selExpressFn(){
        if($('#Warehouse').val().length==0){
          this.expressList = JSON.parse(this.expressListStr);
          return false;
        }
        this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version+ "/getExpressListBean",{
          storageId:$('#Warehouse').val().join(',')
        }).then((response)=>{
          if (response.data.success) {
            this.expressList = {};
            response.data.result = response.data.result?response.data.result:[];
            response.data.result.forEach((item,i)=>{
              this.expressList[item.expressId] = item.expressName;
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //获取异常标记集合
      getMarksList() {
        this._post("com.edb01.erp.oms.service.api.OrderSignService/" + this.version + "/getOrderSignByList").then((response) => {
          if (response.data.success) {
            //orderSignList
            response.data.result.forEach((item, i) => {
              if (item.enabledFlag) {
                this.orderSignList[item.signCode] = item.signName;
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
      //异常标记
      abnormalTag() {
        var _this = this;
        function CellRenderer() {}
        CellRenderer.prototype.createGui = function (params) {
          var template = '', isUrgent = '', orderSign = '';
          for (var i = 0; i < params.data.orderSign.length; i++) {
            if (params.data.orderSign[i] == '需人工审核') {
              var checkFailResion = params.data.checkFailResion ? params.data.checkFailResion : '';
              orderSign = orderSign + '<span title="' + checkFailResion + '">' + params.data.orderSign[i] + '</span>,';
            } else {
              orderSign = orderSign + '<span>' + params.data.orderSign[i] + '</span>,';
            }
          }
          orderSign = orderSign.slice(0, -1);
          if (params.data.orderSign.length > 0) {
            isUrgent = params.data.urgentFlag ? '，加急' : '';
          } else {
            isUrgent = params.data.urgentFlag ? '加急' : '';
          }
          if (params.data.orderSign[0] == '未合并') {
            if (params.data.orderStatus != '已客审') {
              template =
                '<div><span title="' + params.data.handResion + '">' + params.data.hangupLogo + '</span><span class="unincorporated">' + orderSign + '</span><span>' + isUrgent + '</span></div>';
            } else {
              var urgent = isUrgent ? '加急' : '';
              template =
                '<div><span title="' + params.data.handResion + '">' + params.data.hangupLogo + '</span><span>' + urgent + '</span></div>';
            }
          } else {
            template =
              '<div><span title="' + params.data.handResion + '">' + params.data.hangupLogo + '</span><span>' + orderSign + '</span><span>' + isUrgent + '</span></div>';
          }
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          this.eButton = this.eGui.querySelector(".unincorporated");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          if (this.eButton) this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          //console.log(this.params.data.orderSign);
          //_this.unincorporatedBtn(this.params.data);
        };
        return CellRenderer;
      },
    },
    beforeMount() {
      this.columnDefs = [
        {headerName: '序号', suppressToolPanel: true,
          pinned: 'left',
          width: 95,
          suppressSorting: true,
          lockPosition: true,checkboxSelection: true,headerCheckboxSelection:true,cellRendererFramework: 'RowFn'},
        {
          headerName: '异常标记',
          field: 'orderSign1',
          lockPosition: true,
          suppressToolPanel: true,
          width: 100,
          suppressSizeToFit: true,
          cellRenderer: "abnormalTag"
        },
        {headerName: '订单号', field: 'salesOrderNo',suppressToolPanel: true,
          lockPosition: true,width: 120,cellRenderer: "orderCodeRender"},
        {headerName: '商品信息', field: 'productTypenum1',suppressToolPanel: true,
          lockPosition: true,width: 100,cellRenderer: "productRender",
          headerComponentParams : {
            template:
            '<div class="ag-cell-label-container" role="presentation">' +
            '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
            '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
            '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
            '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
            '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
            '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
            '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span><i class="el-icon-question" style="line-height:33px;" title="商品种类/商品总数量"></i>' +
            '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
            '  </div>' +
            '</div>'
          }
        },//productSkunum
        {headerName: '订单状态', field: 'orderStatus',width: 100},
        {headerName: '买家留言', field: 'customerMsg',width: 100},
        {headerName: '客服备注', field: 'serviceMsg',width: 100},
        {
          headerName: "收货人",
          field: "consignee",
          width: 80
        },
        {
          headerName: "手机",
          field: "consigneeMobile",
          width: 100
        },
        {
          headerName: "省",
          field: "consigneeProvince",
          width: 80
        },
        {
          headerName: "市",
          field: "consigneeCity",
          width: 80
        },
        {
          headerName: "区",
          field: "consigneeArea",
          width: 80
        },
        {
          headerName: "镇",
          field: "consigneeTown",
          width: 80
        },
        {
          headerName: "详细地址",
          field: "shippingAddress",
          width: 150
        },
        {
          headerName: "买家ID",
          field: "customerName",
          width: 80
        },
        {
          headerName: "店铺",
          field: "storeName",
          width: 100
        },
        {headerName: '内部便签', field: 'internalMemoMsg',width: 100},
        {headerName: '仓审须知', field: 'storageAuditMsg',width: 100},
        {headerName: '订单总金额', field: 'orderTotalAmt1', width: 100, cellRenderer: function (params) {
          return '<span>' + params.data.orderTotalAmt + '</span>'
        }},
        {headerName: '平台整单优惠', field: 'ecDctAmt1', width: 120, cellRenderer: function (params) {
          return '<span>' + params.data.ecDctAmt + '</span>'
        }},
        {headerName: '商家整单优惠', field: 'merchantDctAmt1', width: 120, cellRenderer: function (params) {
          return '<span>' + params.data.merchantDctAmt + '</span>'
        }},
        {headerName: '实付金额', field: 'actuallyPayAmt1', width: 100, cellRenderer: function (params) {
          return '<span>' + params.data.actuallyPayAmt + '</span>'
        }},
        {headerName: '运费', field: 'freightAmt1', width: 80, cellRenderer: function (params) {
          return '<span>' + params.data.freightAmt + '</span>'
        }},
        {headerName: '代收金额', field: 'expressServiceAmt1', width: 100, cellRenderer: function (params) {
          return '<span>' + params.data.expressServiceAmt + '</span>'
        }},
        {headerName: '仓库', field: 'storageName',width: 130, cellRenderer: function(params) { return '<span>'+params.data.storageName?params.data.storageName:""+'</span>'}},
        {headerName: '快递', field: 'expressName',width: 130},
        {headerName: '净重', field: 'totalWeight',width: 100,cellRenderer: function (params) {
          return '<span>'+ params.data.totalWeight + ' kg</span>'
        }},
        {headerName: '毛重', field: 'grossWeight',width: 100,cellRenderer: function (params) {
          return '<span>'+ params.data.grossWeight + ' kg</span>'
        }},
        {headerName: '下单时间', field: 'orderTime',width: 150},
        {headerName: '付款时间', field: 'payTime',width: 150},
        {headerName: '平台单号', field: 'sourceOrderNo',width: 100},
        {headerName: '相关单号', field: 'fromOrderCode',width: 100},
        {headerName: '平台订单状态', field: 'ecOrderStatus', width: 120},
        {headerName: '拆合状态', field: 'splitJoinStatus', width: 100},

        {headerName: '快递单号', field: 'expressNo', width: 100},
        {headerName: '付款状态', field: 'payStatus', width: 100},
        {headerName: '退款状态', field: 'refundStatus', width: 100},
        {headerName: '退款类型', field: 'refundType', width: 100},
        {headerName: '发货状态', field: 'sendStatus', width: 100},
        {headerName: '平台发货状态', field: 'ecSendStatus', width: 115},
        {headerName: '订单类型', field: 'orderType', width: 100},
        {headerName: '三方仓推送状态', field: 'pushOtherFlag', width: 125},
        {headerName: '支付方式', field: 'paymentWay', width: 100},
        {headerName: '订单渠道', field: 'orderChannel', width: 100},
        {headerName: '首次付款金额', field: 'firstPayAmt1', width: 115, cellRenderer: function (params) {
          return '<span>' + params.data.firstPayAmt + '</span>'
        }},
        {headerName: '二次付款金额', field: 'lastPayAmt1', width: 115, cellRenderer: function (params) {
          return '<span>' + params.data.lastPayAmt + '</span>'
        }},
        {headerName: '买家货到付款服务费', field: 'receiptServiceAmt1', width: 150, cellRenderer: function (params) {
          return '<span>' + params.data.receiptServiceAmt + '</span>'
        }},
        {headerName: '商品总金额', field: 'goodsTotalAmt1', width: 100, cellRenderer: function (params) {
          return '<span>' + params.data.goodsTotalAmt + '</span>'
        }},
        {headerName: '产品总优惠', field: 'orderDctAmt1', width: 100, cellRenderer: function (params) {
          return '<span>' + params.data.orderDctAmt + '</span>'
        }},
        {headerName: '菜鸟服务类型', field: 'cainiaoServiceType', width: 115},
        {headerName: '审单员', field: 'orderReviewName', width: 100},
        {headerName: '审单时间', field: 'orderReviewTime', width: 150},
        {headerName: '发货时间', field: 'sendTime', width: 150},
        {headerName: '获取时间', field: 'createTime', width: 150},
        {headerName: '促销编号', field: 'strategyNos', width: 150},
      ];
      this.components = {
        orderCodeRender:this.getRenderer2('orderCode'),
        productRender:this.getRenderer2('productTypenum'),
        abnormalTag: this.abnormalTag()
      };
    },
    mounted() {
      var _this=this;
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13 && $('.v-modal').length == 0){ // enter 键
          //要做的事情
          this.conditionSearch();
        }
      };
      //参与店铺下拉框
      $('#participate-shop').multiselect({
        onInitialized: function(select, container) {
          $("._scroll").yi_scroll();
        },
      });
      //仓库下拉框
      $('#Warehouse').multiselect({
        onInitialized: function(select, container) {
          $("._scroll").yi_scroll();
        },
        //下拉框关闭回调函数
        onDropdownHide: function (event) {
          _this.selExpressFn();
        },
      });
      this.renderTableHeight();
      //回显查询条件
      this.getQueryInit();
      //异常标记
      this.getMarksList();
      //设置默认时间段
      this.getNowDay(7);
      //this.addCommodityDialog('init');
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container_search {
    overflow-y: hidden;
    height: 100%;
  }

  #topTools {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  #dataList {
    width: 100%;
    margin-top: 20px;
  }

  .shows-enter-active,
  .shows-leave-active {
    transition: opacity 0.5s;
  }

  .shows-enter,
  .shows-leave-to {
    opacity: 0;
  }

  .leftFormat {
    margin-left: 50px;
    text-align: right;
  }

  .numText {
    margin-top: 0px;
    width: 91px;
  }

  .conditionBtn {
    border: none;
    background-color: transparent;
  }

  #moreCondition {
    border: solid 1px black;
    background-color: white;
    z-index: 101;
    position: absolute;
    right: 0;
    top: 45px;
    width: 625px;
    height: 575px;
    text-align:left;
  }

  .selectStyle {
    width: 192px;
  }

  #toolsBar {
    margin-top: 20px;
    width: 100%;
    background-color: #eeeeee;
    height: 30px;
  }

  #pageTool {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 100;
  }

  #toolsBar ul li {
    text-align: center;
    float: left;
  }

  #topTools_two {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .topTitle {
    font-size: 14px;
  }

  .selectWidth {
    width: 179.5px;
  }

  .btnStyle {
    width: 75px !important;
    margin-left: 15px;
    background-color: transparent;
    background-color:#818d9a;
    color:white;
    border:none;
  }
  .btnStyle:hover {
    color: white;
    background-color:#818d9a;
  }
  .toolsBtns {
    height: 30px !important;
    width: 44px !important;
    margin: 0 !important;
    padding: 0 !important;
    background-color: transparent;
    border: none;
  }

  .toolsBtns:hover {
    background-color: #818d9b;
    border-radius: 0;
    color: white;
  }

  a {
    color: #409eff;
  }

  .btnFormatEnter {
    margin-left: 35px !important;
    margin-top: 25px;
    margin-bottom: 30px;
    color: white;
  }

  .chkStyles {
    margin-left: 35px !important;
    text-align: left;
    display: block;
    width: 120px;
  }
</style>
<style>
  .container_search .el-select__tags {
    max-width: 179px !important;
    width: 179px !important;
  }
  .container_search .el-input-group__append{
    padding: 0;
    height: 26px;
    width: 26px;
    background: #fff;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
  }
  .container_search .el-table__body tr.hover-row > td {
    background: #eeeeee !important;
  }

  .container_search #dataList .el-table__body tr.hover-row > td {
    background: #eeeeee !important;
  }

  .container_search .el-table__body tr.current-row > td {
    background: #eeeeee !important;
  }
  .selects .el-input__inner{
    padding-right:27px;
  }
  /*.container_search .el-input.is-disabled .el-input__inner {
    background: #eeeeee !important;
  }*/
</style>

