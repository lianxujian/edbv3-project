<!--手工生成波次 秋香-->
<template>
  <div id="CreateWave">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox2">
        <el-row >
          <el-col :span="6">
            <div class="grid-content">
              <el-select style="width: 33%!important;"    v-model="receiveType" filterable placeholder="">
                <el-option
                  v-for="item in receiveTypeNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input  v-model="receiveInfo" :maxlength="50"
                         placeholder="" @keyup.enter.native="initMessage"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content" >
              <label style="width: 33%!important;"  >订单类型：</label>
              <el-select id="searchStock" v-model="orderType"  filterable placeholder="全部" >
                <el-option
                  v-for="item in orderTypeNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 33%!important;"  >店铺：</label>
              <select id="example-post" name="multiselect[]" multiple="multiple" >
                <option  v-for="item in optionsStore" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label >省份：</label>
              <select id="example-post2" name="multiselect[]" multiple="multiple" >
                <option  v-for="item in optionsProvince" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 33%!important;"  >仓库：</label>
              <el-select id="searchStock1"  filterable placeholder="全部" v-model="storageId"  @change="clickChange()">
                <el-option
                  v-for="item in optionsStock"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 33%!important;"  >快递：</label>
              <select id="example-post1" name="multiselect[]" multiple="multiple">
                <option  v-for="item in optionsExpress" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <el-select style="width: 20%!important;" v-model="timeType" filterable placeholder="创建时间">
                <el-option
                  v-for="item in timeTypeNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

              <dataTime
                style="display:inline-block;width: 75%;"
                :timeCom1="startTime"
                :timeCom2="endTime"
                @timeVal1="getTime1"
                @timeVal2="getTime2"
              ></dataTime>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <el-select style="width: 33%!important;" v-model="codUrgentegType" filterable >
                <el-option
                  v-for="item in codUrgentegTypeNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="bcodUrgenteg" filterable >
                <el-option
                  v-for="item in bcodUrgentegNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <el-select style="width: 33%!important;"   v-model="OrderGoodsTypeQtyOrWeight" filterable placeholder="商品条数">
                <el-option
                  v-for="item in OrderGoodsTypeQtyOrWeightNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input style="width: 30%!important;" v-model="OrderGoodsTypeQtyOrWeightThan"
                        placeholder=""
                        :maxlength="10"
                        @keyup.native="OrderGoodsTypeQtyOrWeightThan=OrderGoodsTypeQtyOrWeightThan.replace(/[^\d]/ig,'')"
                        @keyup.enter.native="initMessage"></el-input>
                -
              <el-input style="width: 30%!important;" v-model="OrderGoodsTypeQtyOrWeightLess"
                        placeholder=""
                        :maxlength="10"
                        @keyup.native="OrderGoodsTypeQtyOrWeightLess=OrderGoodsTypeQtyOrWeightLess.replace(/[^\d]/ig,'');"
                        @blur="moveNo()"
                        @keyup.enter.native="initMessage"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <el-select style="width: 33%!important;"   v-model="OrderGoodsQtyOrMoney" filterable placeholder="商品数量">
                <el-option
                  v-for="item in OrderGoodsQtyOrMoneyNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input style="width: 30%!important;" v-model="OrderGoodsQtyOrMoneyThan"
                        :maxlength="10"
                        placeholder=""
                        @keyup.native="OrderGoodsQtyOrMoneyThan=OrderGoodsQtyOrMoneyThan.replace(/[^\d]/ig,'')"
                        @keyup.enter.native="initMessage"></el-input>
                -
              <el-input style="width: 30%!important;" v-model="OrderGoodsQtyOrMoneyLess"
                        :maxlength="10"
                        placeholder=""
                        @keyup.native="OrderGoodsQtyOrMoneyLess=OrderGoodsQtyOrMoneyLess.replace(/[^\d]/ig,'');"
                        @keyup.enter.native="initMessage"
                        @blur="moveMo()"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label >包含商品：</label>
              <i class="el-icon-more"></i>
              <el-input style="width: 150px!important;"  class="username" v-model="barCodes" placeholder="请输入内容"  @keyup.enter.native="initMessage()">
              </el-input>
              <i id="box_relative1" style="font-size: 16px;cursor: pointer" @click="delShopCode()"  class="el-icon-circle-close-outline"></i>
              <span id="box_relative" style="font-size: 18px;cursor: pointer" @click="onlyOne()">...</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button @click="query()" size="mini" type="primary" >查 询</el-button>
        <el-button @click="reset" size="mini" type="default">重 置</el-button>
      </div>
    </div>

    <!-- 表头 -->
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="Manual()" v-if="authorityCode.WMS_CREATEWAVE_MANUAL"><span>生成波次</span></li>
        <li @click="handManual();"  v-if="authorityCode.WMS_CREATEWAVE_HANDMANUAL"><span> 手动执行波次策略</span></li>
      </ul>
    </div>

    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData"
                tooltip-effect="dark"
                id="tableH"
                border :max-height="table_h"
                @selection-change="handleSelectionChange1"
                :default-sort = "{prop: 'orderTime', order: 'descending'}"
                border style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          align='center'
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="订单号">
          <template slot-scope="scope">
            <span>{{scope.row.salesOrderNo}}</span>
          </template>
        </el-table-column>

        <el-table-column
           :render-header="renderHeader1"
           width="100" >
          <template slot-scope="scope">
              <span  style="cursor: pointer;color: blue" @click="particulars(scope.row)">{{scope.row.goodsTypeQty}}/{{ scope.row.goodsQty }}</span>
          </template>
        </el-table-column>

        <el-table-column label="订单类型">
          <template slot-scope="scope">
            <p class="cen-g" v-if="scope.row.orderType==1">正常订单</p>
            <p class="cen-g" v-if="scope.row.orderType==2">预售订单</p>
            <p class="cen-g" v-if="scope.row.orderType==3">换货订单</p>
            <p class="cen-g" v-if="scope.row.orderType==4">补发订单</p>
            <p class="cen-g" v-if="scope.row.orderType==5">定金订单</p>
          </template>
        </el-table-column>

        <el-table-column label="买家信息"
                         :show-overflow-tooltip="true"><!--买家ID+店铺-->
          <template slot-scope="scope">
            <div style="padding-right: 10px">
              买家ID：{{ scope.row.buyerNick }}
            </div>
            <div>
            店铺：{{ scope.row.storeName }}
          </div>
          </template>
        </el-table-column>

        <el-table-column
          label="收货信息"
          width="150"
          :show-overflow-tooltip="true"><!--收货人+手机号+收货地址-->
          <template slot-scope="scope">
            <div style="padding-right: 10px">
              {{ scope.row.consignee }} {{scope.row.consigneeMobile}}
            </div>
            <div>
              {{scope.row.consigneeProvince}} {{scope.row.consigneeCity}} {{scope.row.consigneeArea}} {{scope.row.shippingAddress}}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="快递信息"
                         width="100"
                         :show-overflow-tooltip="true"><!--快递公司+快递单号-->
          <template slot-scope="scope">
            <div>
              {{ scope.row.expressName}}
            </div>
            <div>
              {{ scope.row.expressNo}}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="仓库" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.storageName }}</p>
          </template>
        </el-table-column>

        <el-table-column
          label="订单总金额"
          sortable
          align="center"
          width="110"
          prop="orderTotalAmt"
        >
        </el-table-column>


        <el-table-column label="内部便签"
                         :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.internalMemoMsg }}</p>
          </template>
        </el-table-column>

        <el-table-column
          sortable
          label="下单时间"
          sortable
          width="100"
          prop="orderTime"
          :show-overflow-tooltip="true">

        </el-table-column>

        <el-table-column
          sortable
          label="付款时间"
          sortable
          width="100"
          prop="payTime"
          :show-overflow-tooltip="true">
        </el-table-column>

        <el-table-column
          sortable
          label="订单净重"
          prop="totalWeight"
          align="center"
          sortable
          width="100">
        </el-table-column>

        <el-table-column label="是否加急">
          <template slot-scope="scope">
            <p class="cen-g" v-if="scope.row.urgentFlag==true">是</p>
            <p class="cen-g" v-if="scope.row.urgentFlag==false">否</p>
          </template>
        </el-table-column>

        <el-table-column label="是否开票">
          <template slot-scope="scope">
            <p class="cen-g" v-if="scope.row.invoiceFlag==true">是</p>
            <p class="cen-g" v-if="scope.row.invoiceFlag==false">否</p>
          </template>
        </el-table-column>

        <el-table-column label="是否货到付款" width="100">
          <template slot-scope="scope">
            <p class="cen-g" v-if="scope.row.codFlag==true">是</p>
            <p class="cen-g" v-if="scope.row.codFlag==false">否</p>
          </template>
        </el-table-column>

        <el-table-column label="平台单号":show-overflow-tooltip="true">
          <template slot-scope="scope" >
            <p class="cen-g" v-if="scope.row.orderType==3||scope.row.orderType==4"></p>
            <p class="cen-g" v-else>{{ scope.row.sourceOrderNo }}</p>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <div class="pagination">
        <pagination
          :totalCom="total"
          :pageSizeCom="pageSize"
          :curPageCom="curPage"
          @pageSizeVal="getPageSize" @curPageVal="getCurPage"
        ></pagination>
      </div>
    </div>

    <!--添加商品-->
    <el-dialog v-dialogDrag
      title="添加商品"
      :visible.sync="addShop"
      :before-close="handleClose"
      width="1100px"
      center>
      <div id="searchBox1">
        <div class="leftBox1">
          <el-row>
            <el-col :span="5">
              <div class="grid-content">
                <el-input style="width: 182px!important;"   placeholder="请输入商品编号" v-model="goodsCode" @keyup.enter.native="onlyOne"></el-input>
              </div>
            </el-col>

            <el-col :span="5">
              <div class="grid-content">
                <el-input style="width: 182px!important;"  placeholder="请输入条形码" v-model="barCode" @keyup.enter.native="onlyOne"></el-input>
              </div>
            </el-col>

            <el-col :span="5">
              <div class="grid-content">
                <el-input style="width: 182px!important;"   placeholder="请输入商品名称" v-model="goodsName" @keyup.enter.native="onlyOne" > </el-input>
              </div>
            </el-col>

            <el-col :span="5">
              <div class="grid-content">
                <el-input style="width: 182px!important;"   placeholder="请输入商品规格" v-model="goodsSpec" @keyup.enter.native="onlyOne"></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox2" style="margin-top:80px;margin-right: 25px">
          <el-button @click="queryList" size="mini" type="primary"  >查 询</el-button>
          <el-button @click="resetOne" size="mini" type="default">重 置</el-button>
        </div>
        <div class="pDown">
          <el-table :data="tableDataShop"
                    border
                    style="width: 100%"
                    :height="600"
                    tooltip-effect="dark"
                    ref="table"
                    @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="序号"
              width="45"
              type="index"
              align="center">
            </el-table-column>

            <el-table-column
              align='center'
              type="selection"
              width="50">
            </el-table-column>

            <el-table-column label="商品图片" align='center'>
              <template slot-scope="scope">
                <img :src="scope.row.imageUrl" alt="">
              </template>
            </el-table-column>


            <el-table-column label="商品编号">
              <template slot-scope="scope">
                <p class="initP-g">{{scope.row.goodsCode}}</p>
              </template>
            </el-table-column>

            <el-table-column label="条形码">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.barCode }}</p>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="goodsName" :show-overflow-tooltip="true">
            </el-table-column>

            <el-table-column label="规格">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.specification }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="brandName"
              :show-overflow-tooltip="true"
              label="商品品牌">
            </el-table-column>
            <el-table-column label="售价（元）" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.salesPrice }}</p>
              </template>
            </el-table-column>

          </el-table>
          <div style="float: right">
            <pagination
              :totalCom="total1"
              :pageSizeCom="pageSize1"
              :curPageCom="curPage1"
              @pageSizeVal="getPageSize1" @curPageVal="getCurPage1"
            ></pagination>
          </div>
        </div>
      </div>
      <div style="margin-top:50px;text-align: right">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="addShopConfirm()">确定</el-button>
      </div>
    </el-dialog>

    <!--商品详细信息-->
    <el-dialog v-dialogDrag title="商品详细信息" :visible.sync="goodsDetailDialog" width="1000px" v-loading="loading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
      <div id="goodsInfo">
        <div v-for="(listBean,index) in goodsList">
          <div class="formatLine"><!-- this.orderType,//订单类型ID 1正常订单2预售订单3换货订单4补发订单5定金订单-->
            <div class="line-child"><span class="titleText">平台单号：</span>
                <span class="valueStyle" v-if="isType==3||  isType==4"  ></span>
                <span class="valueStyle" v-else >{{listBean.sourceOrderNo}}</span>
            </div>
            <div class="line-child"><span class="titleText">旗帜：</span>
              <span class="valueStyle" v-if="listBean.flagId">
                      <span v-for="(value,key) in listBean.flagId.split(',')"><i
                        class="icon iconfont icon-ai246" :style="{color:flagColorList[value]}"></i>
                      </span>
                    </span>
            </div>
            <div class="line-child"><span class="titleText">买家留言：</span><span class="valueStyle ellipsis"
                                                                              :title="listBean.customerMsg">{{listBean.customerMsg}}</span>
            </div>
            <div class="line-child"><span class="titleText">客服备注：</span><span class="valueStyle ellipsis"
                                                                              :title="listBean.serviceMsg">{{listBean.serviceMsg}}</span>
            </div>
          </div>

          <el-table class="col-border" :data="listBean.orderDetails" @cell-dblclick="celldbClick" border
                    style="width: 100%;margin-bottom: 15px;">
            <el-table-column prop="goodsName" align="center" width="250" label="商品信息">
              <template slot-scope="scope">
                <div style="float:left;width:80px;line-height:100px;" :class="scope.row.classFlag">
                  <img style="width:80%;height:auto;" v-if="scope.row && scope.row.goodsUrl" :src="scope.row.goodsUrl"
                       alt="">
                </div>
                <div v-if="scope.row"
                     style="text-align:left;display: flex;padding:5px;min-height: 85px;flex-direction: column;justify-content: center;">
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
                      <span v-if="!scope.row.isSuit" style="color:#8996A2;cursor:pointer;"
                            @click="showSuitList1(scope.$index,scope.row,index)">更多</span>
                    <span v-else style="color:#8996A2;cursor:pointer;"
                          @click="hideSuitList(scope.$index,scope.row,index)">收起</span>
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
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!--生成波次弹框-->
    <el-dialog v-dialogDrag
      title="生成波次"
      :visible.sync="refuseClick"
      width="420px"
      center>
      <div style="text-align: center">
        <span style="position: absolute ;top:105px;left: 20px">波次描述：</span>
        <el-input
          maxlength="200"
          style="width: 252px;"
          type="textarea"
          :rows="3"
          placeholder="请输入波次描述"
          v-model="waveDesc ">
        </el-input>

        <div style="text-align: left;position: relative">
          <span style="position: absolute;left: 236px;height: 17px">{{waveDesc.length}}/200</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="refuseClick= false">取 消</el-button>
            <el-button size="mini" type="primary" @click="affirm">确 认</el-button>
          </span>
    </el-dialog>

    <!--成功的通知弹框-->
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="centerDialog"
        width="30%"
        center
        :data="tableHosue">
        <div style="width: 100%;text-align: center"><i style="font-size: 30px;color: #65F007;margin-top: -10px" class="el-icon-success"></i> </div>
        <div  style="font-size: 18px;margin: 5px 0 -10px 0;width: 100%;text-align: center">波次生成成功：执行订单数【{{this.tableNum.length}}】！</div>
        <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="iKown">知道了</el-button>
  </span>
      </el-dialog>
    </div>

    <!--手动执行波次策略-->
    <el-dialog v-dialogDrag
      title="提示"
      :visible.sync="execute"
      width="420px"
      center>
      <div style="text-align: center;">
        <span style="font-size: 16px"><i class="el-icon-warning" style="color: #DB535B;font-size: 20px"></i> 确定要手动执行波次策略吗？</span>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="execute= false">取 消</el-button>
            <el-button size="mini" type="primary" @click="affirmOne()">确 认</el-button>
          </span>
    </el-dialog>

    <!--成功的通知弹框-->
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="centerDialogVisible"
        width="500px"
        center>
        <div style="width: 100%;text-align: center"><i style="font-size: 30px;color: #65F007;margin-top: -10px" class="el-icon-loading"></i> </div>
        <div  style="font-size: 18px;margin: 5px 0 -10px 0;width: 100%;text-align: center">波次策略执行中，请稍后……</div>
         <el-button type="plain" @click="isKone()" style="margin-left: 150px;margin-top: 20px" >知道了</el-button>
      </el-dialog>
    </div>

    <!--波次失败原因-->
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="deleteListWindow"
        width="650px"
        center>
        <div style="width: 100%;margin-top: -20px;">
          <div style="text-align: center">
            <i style="font-size: 16px;color:orange;margin-left: 20px;" class="el-icon-warning">
            </i><span style="font-size: 16px;font-weight: bold;margin-left: 10px;">生成波次失败！</span>
          </div>
          <div style="margin-top: 10px;text-align: center">
            <span>失败原因：有商品的可配货库存不足！</span>
          </div>
        </div>

        <div style="margin-top:20px">
          <div><span>失败商品列表</span></div>
          <el-table :data="deletetableData" border style="width:100%;"
                    ref="multipleTable3" >
            <el-table-column
              align="center"
              type="index"
              label="序号">
            </el-table-column>

            <el-table-column label="条形码" align='center' >
              <template slot-scope="scope" >
                <p class="cen-g">{{scope.row.barCode}}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品名称"align='center' >
              <template slot-scope="scope">
                <p class="cen-g">{{scope.row.goodsName}}</p>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-dialog>
    </div>

    <!--手动执行波次策略-->
    <el-dialog v-dialogDrag
      title="提示"
      :visible.sync="executeOne"
      width="620px"
      center>
      <div style="text-align: center;">
        <span style="font-size: 16px"><i class="el-icon-warning" style="color: #DB535B;font-size: 20px"></i> 勾选的订单中存在{{this.earlength}}条未全部付款的定金订单，是否要剔除订单？</span>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="medium  " @click="executeOne= false" ><span style="margin-left: -10px">否，不剔除订单</span></el-button>
            <el-button size="medium " type="primary"  @click="affirmExecute()"><span style="margin-left: -20px;">是，继续生成波次</span>  </el-button>
          </span>
    </el-dialog>

  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  import {turnTimestamp, returnTimesStamp, priceValidator, positiveIntegerValidator , Trim} from '@/assets/js/validate.js';
  export default {
    components: {
      pagination,dataTime
    },
    data() {
      return {
        version:'1.0.0',//接口版本号
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        optionsStore:[],//店铺下拉
        optionsProvince:[],//省份
        optionsExpress:[],//快递
        startTime: '',//起始时间
        endTime: '',//结束时间
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        total1:0,//总页数
        pageSize1: 15, //每页数量
        curPage1: 1, //当前页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        timeType: 1,//时间类型
        storageId:'',//仓库
        receiveType:1,//收货人信息类型ID 1.订单号2.平台单号3.买家昵称4.手机号 5.快递单号6.收货人
        receiveInfo: '',//收货人信息对应的值
        orderType: '',//订单类型ID 1正常订单2预售订单3换货订单4补发订单5定金订单
        provinceIds: '',//省份集合，逗号隔开
        stores: '', //店铺ID,逗号隔开,注意权限问题
        expressIds: '', //快递ID,逗号隔开,注意权限问题
        timeStart: '',//开始时间
        timeEnd: '',//结束时间
        codUrgentegType: 1,//是否类型：1。是否加急2.是否开票3.是否货到付款
        bcodUrgenteg: '',//1是，2否
        OrderGoodsTypeQtyOrWeight: 1,//1商品类型数（种类数） 2订单净重
        OrderGoodsTypeQtyOrWeightThan: '',//订单商品类型数（条数）/净重大于
        OrderGoodsTypeQtyOrWeightLess: '',//订单商品类型数（条数）/净重小于
        OrderGoodsQtyOrMoney: 1,//1商品数量 2订单总金额
        OrderGoodsQtyOrMoneyThan: '',//订单商品数量/订单总金额大于
        OrderGoodsQtyOrMoneyLess: '',//订单商品数量/订单总金额小于
        barCodes: '',//支持选择多条商品，匹配规则为：订单中包含所选商品中的一条即可显
        stock: '',//仓库
        addShopVal: [], // 添加商品的选中的值
        timeTypeNo:[
          {
          value: 1,
          label: '下单时间'
        },{
          value: 2,
          label: '付款时间'
        }],// 1下单时间 2付款时间
        receiveTypeNo:[
          {
            value: 1,
            label: '订单号'
          },
          {
            value: 2,
            label: '平台单号'
          },{
            value: 3,
            label: '买家ID'
          },{
            value: 4,
            label: '手机号'
          },{
            value: 5,
            label: '快递单号'
          },{
            value: 6,
            label: '收货人'
          },
        ],//下拉杂项
        orderTypeNo:[
          {
            value: '',
            label: '全部'
          },
          {
            value: 1,
            label: '正常订单'
          },
          {
            value: 2,
            label: '预售订单'
          },{
            value: 3,
            label: '换货订单'
          },{
            value: 4,
            label: '补发订单'
          },{
            value: 5,
            label: '定金订单'
          }
        ],//订单下拉
        codUrgentegTypeNo:[
          {
            value: 1,
            label: '是否加急'
          },
          {
            value: 2,
            label: '是否开票'
          },
          {
            value: 3,
            label: '是否货到付款'
          }],//是否类型：1。是否加急2.是否开票3.是否货到付款
        bcodUrgentegNo:[
          {
            value: '',
            label: '全部'
          }, {
            value: 'true',
            label: '是'
          },
          {
            value: 'false',
            label: '否'
          }],//是否项
        OrderGoodsTypeQtyOrWeightNo:[
          {
            value: 1,
            label: '商品条数'
          },
          {
            value: 2,
            label: '订单净重'
          }],//1商品类型数（种类数） 2订单净重
        OrderGoodsQtyOrMoneyNo:[
          {
            value: 1,
            label: '商品数量'
          },
          {
            value: 2,
            label: '订单总金额'
          }],//1商品数量 2订单总金额
        addShop:false,//添加商品窗口
        stockArea:'',//库区
        stockSeat:'',//库位
        isSeat: false,//库位判空
        barCode: '',//条形码
        name:'',//商品名称
        centerDialogVisible:false,//波次执行中
        unassign:false,//取消分配弹窗
        assignNumber:false,//分配快递单号
        print:false,//打印窗口
        tableDataShop:[],//商品
        goodsDetailDialog:false,//商品详细信息窗口
        refuseClick:false,//生成波次
        tableNum:[],//勾选条数
        goodsList:[],//套装信息
        flagColorList: {
          "0":"#999",
          "1": "#cd3930",
          "2": "#edcf4c",
          "3": "#3d9bfe",
          "4": "#72c95d",
          "5": "#822aea"
        },//旗帜颜色列表
        loading: false,//遮罩层
        waveDesc:'',//波次描述
        centerDialog:false,//知道了
        tableHosue:[],//波次生成成功信息
        goodsCode:'',//商品编号
        goodsName:'',//商品名称
        specification:'',//规格
        execute:false,//手动执行波次策略窗口
        goodsSpec:'',//商品规格
        deleteListWindow:false,//波次失败原因窗口
        deletetableData:[],//失败商品列表
        executeOne:false,//是否要剔除订单窗口
        earlength:'',//条数
        isOK:'',//代替赋值
        learn:'',//状态
        numLength:'',//赋值状态
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限
        isType:'',//订单
      }
    },
    mounted(){
      this.initTime();//初始时间
      this.getProvince();//初始省份
      this.getStoreId();//初始店铺
      this.initStock();//初始化仓库下拉
      this.initMessage();//初始化表格数据
      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 90);
      });
      let self = this;
      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      $('#example-post1').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      $('#example-post2').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });

    },
    created(){
      //获取快递
        this._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + this.version + '/getExpressListBean',{storageId:''}).then(function (res) {
          if (res.data.success == true) {
            this.optionsExpress = res.data.result;
            if(this.optionsExpress==undefined){
              this.optionsExpress=[]
            }
            let value = [];
            let str = '';
            for (let item of this.optionsExpress){
              str += item.expressId + ',';
              item.value = item.expressId;
              item.label = item.expressName;
              value.push(item.expressId)
            }
            $('#example-post1').multiselect('dataprovider', this.optionsExpress );
            $('#example-post1').multiselect('select',value);
          }
        }.bind(this));

    },
    methods: {
      //商品条数校验
      moveNo(){
        if(this.OrderGoodsTypeQtyOrWeightThan>this.OrderGoodsTypeQtyOrWeightLess){
          this.OrderGoodsTypeQtyOrWeightLess=''
        }
      },

      //商品数量校验
      moveMo(){
        if(this.OrderGoodsQtyOrMoneyThan>this.OrderGoodsQtyOrMoneyLess){
          this.OrderGoodsQtyOrMoneyLess=''
        }
      },

      //套装更多显示
      showSuitList1(index, row, n) {
        this.$set(row, 'isSuit', true);
        for (var i = row.orderSuitDetailBeans.length; i--; i >= 0) {
          row.orderSuitDetailBeans[i].goodsQty = row.orderSuitDetailBeans[i].skuQty;
          row.orderSuitDetailBeans[i].unitPrice = row.orderSuitDetailBeans[i].skuPrice;
          row.orderSuitDetailBeans[i].classFlag = 'classFlag';
          this.goodsList[n].orderDetails.splice(index + 1, 0, row.orderSuitDetailBeans[i]);
        }
      },

      //套装更多收起
      hideSuitList(index, row, n) {
        this.$set(row, 'isSuit', false);
        this.goodsList[n].orderDetails.splice(index + 1, row.orderSuitDetailBeans.length);
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

      //波次策略执行中
      isKone(){
        this.centerDialogVisible=false
        this.execute=false
      } ,

      // 包含商品里的删除图标
      delShopCode() {
        this.barCodes='';
        this.addShopVal = '';
      },

      // 添加商品的确定
      addShopConfirm(){
        this.barCodes=''
        let str = '';
        this.addShopVal.forEach(item => {
          str += item.barCode + ',';
       //   this.strOne += item.goodsId + ',';
        })
        this.barCodes = str.slice(0,-1);

        this.addShop = false;
      },

      //商品详细信息
      particulars(row){
        this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/findOrderBaseBeanById", {
          salesOrderId:row.salesOrderId
        }).then((response) => {
          if (response.data.success) {
            this.goodsList = [];
            this.goodsDetailDialog = true;
            this.orderInfos = response.data.result;
            this.followUpdateGift = response.data.result.followUpdateGift;//改赠品
            this.followChangeGoods = response.data.result.followChangeGoods;//换商品
            this.isType = response.data.result.orderType;//类型
            if (!this.orderInfos.storageName) this.orderInfos.storageId = '';
            if (!this.orderInfos.expressName) this.orderInfos.expressId = '';
            if (this.orderInfos.orderTime) this.orderInfos.orderTime = turnTimestamp(this.orderInfos.orderTime);
            if (this.orderInfos.payTime) this.orderInfos.payTime = turnTimestamp(this.orderInfos.payTime);
            this.proCityAreaValue = [this.orderInfos.provinceRegionId + '', this.orderInfos.cityRegionId + '', this.orderInfos.areaRegionId + ''];
            response.data.result.orderBaseDetailsBean.forEach((item, i) => {
              this.$set(item, 'editFlag', false);
              if (item.suitFlag) this.$set(item, 'isSuit', false);
            })
            response.data.result.orderHistoryBaseBeans.forEach((item, i) => {
              item.orderDetails.forEach((item2,j)=>{
                this.$set(item2,'editFlag',false);
                if(item2.suitFlag)this.$set(item2,'isSuit',false);
              })
            })
            if (this.orderInfos.originalFlag) {//原始单
              //sourceOrderNo flagId customerMsg serviceMsg
              this.goodsList.push({
                orderDetails: response.data.result.orderBaseDetailsBean,
                sourceOrderNo: this.orderInfos.sourceOrderNo,
                flagId: this.orderInfos.flagId,
                customerMsg: this.orderInfos.customerMsg,
                serviceMsg: this.orderInfos.serviceMsg
              })
            } else {
              this.goodsList = response.data.result.orderHistoryBaseBeans;
            }
          } else {
            this.$message({
              message: response.data.msg ? response.data.msg : '接口异常',
              type: "warning"
            });
          }
        })
      },

      //订单号 商品信息
      getRenderer2(item) {
        var _this = this;
        function CellRenderer() {
        }
        CellRenderer.prototype.createGui = function () {
          var template =
            '<span><span class="jump" style="color:#409eff;cursor:pointer;"></span></span>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui();
          this.params = params;
          var eValue = this.eGui.querySelector(".jump");
          if (item == 'productTypenum') {
            eValue.innerHTML = params.data.goodsTypeQty + '/' + params.data.goodsQty;
          } else {
            eValue.innerHTML = params.data.salesOrderNo;
          }
          this.eButton = this.eGui.querySelector(".jump");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          if (item == 'productTypenum') {
            //获取商品详情
            _this.salesOrderId = this.params.data.salesOrderId;
            _this.orderBaseDetail(this.params.data.salesOrderId);
          } else {
            /* _this.$router.push({
               name: 'orderDetail',
               params: {orderId: this.params.data.salesOrderId, fromPage: 'OrderProcessing'}
             });*/
            $('#orderDetail').show().attr('src', '#/orderDetail/'+this.params.data.salesOrderId+'/OrderProcessing');
            document.querySelector('#orderDetail').contentWindow.location.href = '#/orderDetail/'+this.params.data.salesOrderId+'/OrderProcessing';
            $('#orderPage').hide();
            _this.loading = true;
            setTimeout(()=>{
              _this.loading = false;
            },1500)
          }
        };
        CellRenderer.prototype.destroy = function () {
          this.eButton.removeEventListener("click", this.buttonClickListener);
        };
        return CellRenderer;
      },

      //联动
      clickChange(){
        this.getExpress();//初始快递
      },

      //取消添加商品弹框
      handleClose(){
          this.addShop=false
      },

      //商品信息
      renderHeader1(createElement, {_self}) {
        return createElement(
          'span',
          {
            style: 'font-weight:bold;'
          },
          [
            createElement('span', ['商品信息']
            ),
            createElement(
              'i',
              {
                class: 'el-icon-question',
                style: 'font-size:14px;margin-left:5px;',
                attrs: {title: '商品种类/商品总数量'}
              }
            )
          ]
        );
      },

      //勾选添加商品
      handleSelectionChange(val){
        this.addShopVal = val;
      },

      //勾选商品
      handleSelectionChange1(val){
        this.tableNum = val
      },

      //商品接口
      onlyOne(){
        this.addShop = true;//添加商品窗口
        let data = {
          "page": this.curPage,//当前页
          "size": this.pageSize,//每页行数
          "goodsCode": this.goodsCode, // 商品编码。
          "barCode": this.barCode, // 商品条形码。
          "goodsName": this.goodsName,// 商品名称。
          "goodsSpec":this.goodsSpec,//规格
        }
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryForHandWave', data).then(function (res) {
            this.total1 = res.data.result.total;
            this.tableDataShop=res.data.result.rows;
            //获取图片
          let arr=[]
            this.tableDataShop.forEach((item, i) => {
            if (item.goodsImageBean && item.goodsImageBean.imageUrl) {
                item.imageUrl = item.goodsImageBean.imageUrl;
              }
          if(this.addShopVal){
            this.addShopVal.forEach(val => {
              if(item.barCode == val.barCode){
                arr.push(i)
              }
            })
          }
            })
          this.$nextTick(()=>{
            arr.forEach((j)=>{
              this.$refs.table.toggleRowSelection(this.tableDataShop[j],true);
            })
          });

        }.bind(this));
      },

      //表格查询
      queryList(){
        this.onlyOne()
      },

      //重置
      resetOne(){
        this.goodsCode=''
        this.barCode=''
        this.goodsName=''
        this.goodsSpec=''
      },

      // 以下是分页
      getPageSize: function (val) {
        if(val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();
        }
      },
      getCurPage: function (val) {
        if(val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
        }
      },

      //以下是分页
      getPageSize1: function (val) {
        if(val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.onlyOne();
        }
      },
      getCurPage1: function (val) {
        if(val != undefined) {

          //变换当前页刷新数据
          this.curPage = val;
          this.onlyOne()
        }
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.optionsStock.push({value: val.storageId,label: val.storageName})
          }.bind(this));
        }.bind(this));
      },

      //获取当前店铺
      getStoreId:function () {
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/list').then(function (res) {
          if (res.data.success == true) {
            this.optionsStore = res.data.result;
            let value = [];
            let str = '';
            for (let item of this.optionsStore){
              str += item.storeId + ',';
              item.value = item.storeId;
              item.label = item.storeName;
              value.push(item.storeId)
            }
            $('#example-post').multiselect('dataprovider', this.optionsStore );
            $('#example-post').multiselect('select',value);
          }
        }.bind(this));
      },

      //获取快递
      getExpress:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + this.version + '/getExpressListBean',{storageId:this.storageId}).then(function (res) {
          if (res.data.success == true) {
              this.optionsExpress = res.data.result;
              if(this.optionsExpress==undefined){
                this.optionsExpress=[]
              }
              let value = [];
              let str = '';
              for (let item of this.optionsExpress){
                str += item.expressId + ',';
                item.value = item.expressId;
                item.label = item.expressName;
                value.push(item.expressId)
              }
              $('#example-post1').multiselect('dataprovider', this.optionsExpress );
              $('#example-post1').multiselect('select',value);
          }
        }.bind(this));
      },

      // 请求省
      getProvince:function () {
        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list',{regionId: 1}).then(function (res) {
          if (res.data.success == true) {
            this.optionsProvince = res.data.result;
            let value = [];
            let str = '';
            for (let item of this.optionsProvince){
              str += item.regionId + ',';
              item.value = item.regionId;
              item.label = item.regionName;
              value.push(item.regionId)
            }
            $('#example-post2').multiselect('dataprovider', this.optionsProvince );
            $('#example-post2').multiselect('select',value);
          }
        }.bind(this));
      },

      // 所属仓库
      query(){
        this.stores = $('#example-post').val();
        this.expressIds = $('#example-post1').val();
        this.provinceIds = $('#example-post2').val();
        this.initMessage();//初始化表格数据
      },

      //初始化表格数据
      initMessage:function () {
        let startTime,endTime;
        if(this.startTime != null) {
          startTime = new Date(this.startTime).getTime()
        }else {
          startTime = ''
        }
        if(this.endTime != null) {
          endTime = new Date(this.endTime).getTime()
        }else {
          endTime = ''
        }
        let data = {
          wmsStorageCheckFlag:false,
          timeType:this.timeType,//时间类型
          storageId:this.storageId,//仓库
          receiveType:this.receiveType,//收货人信息类型ID 1.订单号2.平台单号3.买家昵称4.手机号 5.快递单号6.收货人
          receiveInfo: this.receiveInfo,//收货人信息对应的值
          orderType: this.orderType,//订单类型ID 1正常订单2预售订单3换货订单4补发订单5定金订单
          provinceIds: this.provinceIds,//省份集合，逗号隔开
          stores: this.stores, //店铺ID,逗号隔开,注意权限问题
          expressIds: this.expressIds, //快递ID,逗号隔开,注意权限问题
          /*timeStart: this.timeStart,//开始时间
          timeEnd: this.timeEnd,//结束时间*/
          codUrgentegType: this.codUrgentegType,//是否类型：1。是否加急2.是否开票3.是否货到付款
          bcodUrgenteg: this.bcodUrgenteg,//1是，2否
          OrderGoodsTypeQtyOrWeight: this.OrderGoodsTypeQtyOrWeight,//1商品类型数（种类数） 2订单净重
          sortType:0,//0升序 1降序
          sortColumn:3,
          OrderGoodsTypeQtyOrWeightThan:this.OrderGoodsTypeQtyOrWeightThan,//订单商品类型数（条数）/净重大于
          OrderGoodsTypeQtyOrWeightLess: this.OrderGoodsTypeQtyOrWeightLess,//订单商品类型数（条数）/净重小于
          OrderGoodsQtyOrMoney: this.OrderGoodsQtyOrMoney,//1商品数量 2订单总金额
          OrderGoodsQtyOrMoneyThan: this.OrderGoodsQtyOrMoneyThan,//订单商品数量/订单总金额大于
          OrderGoodsQtyOrMoneyLess: this.OrderGoodsQtyOrMoneyLess,//订单商品数量/订单总金额小于
          barCodes: this.barCodes,//支持选择多条商品，匹配规则为：订单中包含所选商品中的一条即可显
          timeStart:startTime,
          timeEnd:endTime,
          page: this.curPage,
          size: this.pageSize
        };
        this._post('com.edb01.erp.oms.service.api.OrderForWmsService/' + this.version + '/getUnallocWaveOrderBaseComplex',data).then(function (res) {
          res.data.result.rows.forEach((item)=>{
            item.orderTime =  turnTimestamp(item.orderTime);
            item.payTime =  turnTimestamp(item.payTime);
          })
          this.tableData=res.data.result.rows;

          this.total = res.data.result.total;
          res.data.result.rows.forEach((item=>{
            if(item.payTime == 'NaN-NaN-NaN NaN:NaN:NaN'){
              item.payTime=''
            }
          }))
        }.bind(this))
      },

      //重置
      reset() {
        let arr1 = [];
        this.optionsStore.forEach(item => {
          arr1.push(item.storeId)
        });
        $('#example-post').multiselect('select',arr1); // 重置所属店铺
        let arr = [];
        this.optionsExpress.forEach(item => {
          arr.push(item.expressId)
        });
        $('#example-post1').multiselect('select',arr); // 重置所属快递
         let arr2 = [];
        this.optionsProvince.forEach(item => {
          arr2.push(item.regionId)
        });
        $('#example-post2').multiselect('select',arr2); // 重置所属快递

            wmsStorageCheckFlag:false,
            this.timeType=1,//时间类型
            this.storageId='',//仓库
            this.receiveType=1,//收货人信息类型ID 1.订单号2.平台单号3.买家昵称4.手机号 5.快递单号6.收货人
            this.receiveInfo='',//收货人信息对应的值
            this.orderType='',//订单类型ID 1正常订单2预售订单3换货订单4补发订单5定金订单
            this.provinceIds='',//省份集合，逗号隔开
            this.stores='', //店铺ID,逗号隔开,注意权限问题
            this.expressIds='', //快递ID,逗号隔开,注意权限问题
            this.codUrgentegType=1,//是否类型：1。是否加急2.是否开票3.是否货到付款
            this.bcodUrgenteg='',//1是，2否
            this.OrderGoodsTypeQtyOrWeight=1,//1商品类型数（种类数） 2订单净重
            this.OrderGoodsTypeQtyOrWeightThan='',//订单商品类型数（条数）/净重大于
            this.OrderGoodsTypeQtyOrWeightLess='',//订单商品类型数（条数）/净重小于
            this.OrderGoodsQtyOrMoney=1,//1商品数量 2订单总金额
            this.OrderGoodsQtyOrMoneyThan='',//订单商品数量/订单总金额大于
            this.OrderGoodsQtyOrMoneyLess='',//订单商品数量/订单总金额小于
            this.barCodes=''
            let oDate = new Date();
            const Y = oDate.getFullYear(),
              M = oDate.getMonth() + 1,
              D = oDate.getDate();
            let timeStart = Y + ' ' + M + ' ' + D + ' 00:00:00';
            this.startTime = new Date(timeStart);
            let timeEnd = Y + ' ' + M + ' ' + D + ' 23:59:59';
            this.endTime = new Date(timeEnd)
      },

      //初始化时间
      initTime: function () {
        let oDate = new Date();
        const Y = oDate.getFullYear(),
          M = oDate.getMonth() + 1,
          D = oDate.getDate();
        let timeStart = Y + ' ' + M + ' ' + D + ' 00:00:00';
        this.startTime = new Date(timeStart);
        let timeEnd = Y + ' ' + M + ' ' + D + ' 23:59:59';
        this.endTime = new Date(timeEnd)
      },

      //获取时间time1
      getTime1: function (val) {
        this.startTime = val
      },

      //获取时间time2
      getTime2: function (val) {
        this.endTime = val;
      },

      //继续生成波次
      affirmExecute(){
        if(this.earlength==this.tableNum.length){
            this.executeOne=false
        }else{
          this.executeOne=false
          this.refuseClick = true;
          this.waveDesc=''
          this.learn=1
        }
      },

      //生成波次
      Manual(){
        if (this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message: '请选择待分配波次的订单！',
            type: 'warning'
          })
          return false
        } else {
          let self = this;
          self.isOK = '';
          var arr = '';
          for (let item of this.tableNum) {
            arr += item.salesOrderId + ','
          }
          self._post('com.edb01.erp.wms.service.api.WmWaveHandMovementService/'+this.version+'/createWaveCheck', {orderIdList: arr.slice(0, -1)}).then(function (res) {
            if (res.data.success==true) {
              if (res.data.result.checkSuccess==true) {
                  self.executeOne=false
                  self.refuseClick = true;
                  self.waveDesc=''
              }  else {
                if(!res.data.result.earnstOrderList==''||!res.data.result.earnstOrderList==undefined){
                  self.executeOne=true
                  self.earlength=res.data.result.earnstOrderList.length
                  let arr=[];
                  self.tableNum.forEach((item)=>{
                    arr.push(item.salesOrderId)
                  })
                  arr.forEach((item,index)=>{
                    if(res.data.result.earnstOrderList.indexOf(item) == -1){
                      self.isOK += item + ',';
                    }
                  })
                }else{
                  self.$message({
                    message: '已选订单中有不满足订单波次生成条件!',
                    type: 'warning'
                  })
                }
              }
            }else{
              if(res.data.code==15000005){
                self.$message({
                  message: '纸质快递订单和支持电子面单快递订单不能混合生成波次，请检查订单！',
                  type: 'warning'
                })
              }
              if(res.data.code==15000006){
                self.$message({
                  message: '不同纸质快递的订单不能混合生成波次，请检查订单！',
                  type: 'warning'
                })
              }
            }
          }).catch(function (err) {
            console.log(err)
          })
        }
      },

      //确认按钮
      affirm(){
        const loading = this.$loading({
          lock: true,
          text: '正在生成波次，请稍后......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
          let self = this
            var arr = '';
            if(self.learn==1){
              arr=self.isOK
              self.numLength=1
            }else{
              for (let item of this.tableNum) {
                arr += item.salesOrderId + ','
              }
            }
            self._post('com.edb01.erp.wms.service.api.WmWaveHandMovementService/'+this.version+'/createWaveStratedyOrder', {orderIdList: arr.slice(0, -1),waveDesc:this.waveDesc}).then(function (res) {

              if (res.data.success==true) {
                loading.close();
                self.refuseClick = false;
                 // self.sum=res.data.result
                  // self.initMessage();
                if(res.data.result.success==false){
                  self.deleteListWindow=true
                  self.deletetableData=res.data.result.goodsList
                  self.refuseClick=false
                  loading.close();
                }else{
                  self.refuseClick=false
                  self.centerDialog=true
                  self.tableNum.length=self.tableNum.length-self.earlength
                  loading.close();
                }

              }  else {
                  self.$message({
                    message: '生成波次失败！',
                    type: 'warning'
                  })
                  self.refuseClick=true
                  self.initMessage()
                  loading.close();
              }
            }).catch(function (err) {
              console.log(err)
            })
      },

      //波次生成成功，执行订单数
      iKown(){
        this.centerDialog=false
        this.initMessage()
      },

      //手动生成波次策略
      handManual(){
        this.execute=true
      },

      //手动执行波次策略
      affirmOne(){
        this.centerDialogVisible=true
        let self = this
        self._post('com.edb01.erp.wms.service.api.WmWaveHandMovementService/'+this.version+'/handMovementWave').then(function (res) {
          if (res.data.success==true) {
            self.$message({
              message: '调用成功！',
              type: 'success,'
            })
            self.execute=false
            self.centerDialogVisible=false
            /*if (res.data.code==0) {
              self.sum=res.data.result
              self.refuseClick=false
              self.centerDialog=true
              // self.initMessage();
            }*/
          }  else {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            })
            self.execute=false
            self.centerDialogVisible=false
            self.initMessage()
          }
        }).catch(function (err) {
          console.log(err)
          self.centerDialogVisible=false
        })
      },
    },
  }
</script>
<style>
  #CreateWave .alertBox{
    position: absolute;
    top: -6px;
    left: 51px;
    z-index: 10;
  }

  .el-tooltip__popper{
    max-width:80%
  }

</style>
<style scoped>
  #CreateWave{
    padding: 20px;
  }
  .pTop{
    margin-bottom: 20px;
  }

  .fix {
    margin-top: 20px;
    white-space: nowrap;
  }

  .fix-l {
    display: inline-block;
    width: 120px;
    text-align: right;
  }
  .fix-l1 {
    width: 260px;
  }
  .grid-content  {
    position: relative;
  }
  .grid-content .el-icon-more {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 10px;
    padding-left: 50px;
  }

  .grid-content .username{
    height: 20px;
  }
  .line-child {
    flex: 1;
  }

  .formatLine {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    margin-left: 5px;
  }
  #box_relative1{
    position: absolute;
    left:176px;
    top: 6px;
    background: #fff;
  }
  #box_relative {
    position: absolute;
    left:192px;
    top: 1px;
    background: #fff;
  }
  #CreateWave .el-col-6{
    width: 25%;
  }


</style>


