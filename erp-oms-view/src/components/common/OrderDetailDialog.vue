<template>
  <div>
    <!--商品详细信息-->
    <div id="goodsInfo" v-loading="loading" element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading">
      <el-button type="primary" style="margin-bottom: 10px;" @click="addGiftShow" v-if="followUpdateGift">+ 加赠品
      </el-button>
      <div v-for="(listBean,index) in goodsList">
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
                  <span v-if="scope.row.giftFlag" style="color:#FD00FF;">【赠】<span v-if="scope.row.strategyNo">【{{scope.row.strategyNo}}】</span></span>
                  <span v-if="scope.row.refundFlag" style="color:red;">【退】</span>
                  <span v-if="scope.row.suitFlag" style="color:#0000FF;">【套】</span>
                  <span v-if="!scope.row.giftFlag">{{scope.row.storeGoodsName}}</span><!--网店品名-->
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
          <el-table-column prop="goodsName" align="center" label="软件品名">
          </el-table-column>
          <el-table-column prop="goodsQty" v-if="followUpdateGift" :render-header="renderHeader" align="center">
            <template slot-scope="scope">
                    <span v-if="scope.row">
                      <el-input v-if="scope.row.editFlag" v-model="scope.row.goodsQty"
                                @keyup.native="scope.row.goodsQty = scope.row.goodsQty.replace(/[^\d]/g,'')" type='text'
                                @blur="keyupNumSave(scope.row)"></el-input>
                      <div v-else>
                        <div style="display:inline-block;">{{scope.row.goodsQty}}</div>
                         <div v-if="scope.row.lackQty"
                              style="display:inline-block;color:red;">（缺）</div><!--{{scope.row.lackQty}}-->
                        <div v-if="scope.row.classFlag && scope.row.suitSingleLackFlag">（缺）</div><!--单品-->
                      </div>
                    </span>
            </template>
          </el-table-column>
          <el-table-column prop="goodsQty" v-if="!followUpdateGift" label="数量" align="center">
            <template slot-scope="scope">
                    <span v-if="scope.row">
                      <el-input v-if="scope.row.editFlag" v-model="scope.row.goodsQty"
                                @keyup.native="scope.row.goodsQty = scope.row.goodsQty.replace(/[^\d]/g,'')" type='text'
                                @blur="keyupNumSave(scope.row)"></el-input>
                      <div v-else>
                        <div style="display:inline-block;">{{scope.row.goodsQty}}</div>
                        <div v-if="scope.row.lackQty" style="display:inline-block;color:red;">（缺）</div><!--{{scope.row.lackQty}}-->
                        <div v-if="scope.row.classFlag && scope.row.suitSingleLackFlag" style="display:inline-block;color:red;">（缺）</div><!--单品-->
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
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text"
                         v-if="scope.row && !scope.row.refundFlag && !scope.row.classFlag && followChangeGoods"
                         @click="exchangeGift(scope.row)">换商品
              </el-button>
              <el-button type="text" v-if="scope.row && scope.row.giftFlag && followUpdateGift"
                         @click="channelDelGift(scope.row)">删除
              </el-button>
              <el-button type="text" @click="checkStock(scope.row)">查库存</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--查库存弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="查库存" append-to-body :visible.sync="checkStockDialog" width="800px">
      <div class="formatLine" style="margin-bottom:10px;">
        <span>条形码：</span><span style="display:inline-block;width:150px;margin-right:15px;" class="ellipsis" :title="checkStockObj.goodsBarCode">{{checkStockObj.goodsBarCode}}</span>
        <span>商品名称：</span><span style="display:inline-block;width:300px;margin-right:15px;" class="ellipsis" :title="checkStockObj.goodsName">{{checkStockObj.goodsName}}</span>
        <span>订货数量：</span><span style="display:inline-block;width:50px;">{{checkStockObj.goodsQty}}</span>
      </div>
      <div class="input-box">
        <el-table
          border
          height="400"
          :data="checkStockData"
        >
          <el-table-column
            label="序号"
            align='center'
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="storageName"
            align='center'
            label="仓库名称"
            width="">
          </el-table-column>
          <el-table-column
            prop="storageType"
            align='center'
            label="仓库类型"
            width="">
          </el-table-column>
          <el-table-column
            prop="accountSurplusInv"
            align='center'
            label="台账余量"
            width="">
            <template slot-scope="scope">
              <span v-if="suitFlagStock">-</span>
              <span v-else>
                <span v-if="scope.row.accountSurplusInv < checkStockObj.goodsQty" style="color:red;">{{scope.row.accountSurplusInv}}</span>
                <span v-else>{{scope.row.accountSurplusInv}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="suitMaxAccount"
            align='center'
            label="单品组套最大台账"
            width="">
            <template slot-scope="scope">
              <span v-if="suitFlagStock">
                <span v-if="scope.row.suitMaxAccount < checkStockObj.goodsQty" style="color:red;">{{scope.row.suitMaxAccount}}</span>
                <span v-else>{{scope.row.suitMaxAccount}}</span>
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!--添加赠品弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" append-to-body title="请选择赠品" :visible.sync="selectAddGiftDialog"
               width="1200px" v-loading="loading" element-loading-text="拼命加载中"
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
          <el-col :span="4" v-if="openManGiftInv">
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
          v-loading="selectAddGiftDialogLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          border
          highlight-current-row
          height="400"
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
            v-if="openManGiftInv"
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
            v-if="openManGiftInv"
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.saleQty > 0">{{scope.row.saleQty}}</span>
              <span v-else style="color:red;">{{scope.row.saleQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="readyForSale"
            align='center'
            label="可售现货"
            v-if="!openManGiftInv"
            width="">
          </el-table-column>

          <!--宝洁新增-->
          <el-table-column v-if="!openManSuitSales" label="单品组套最大可售" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales >= 0">{{ scope.row.suitMaxSales }}</span>
              <span v-else-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales < 0">0</span>
              <span v-else>-</span>
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
    <el-dialog v-dialogDrag :close-on-click-modal="false" append-to-body title="请选择替换的商品" :visible.sync="replaceGoodsDialog6"
               width="1200px" v-loading="loading" element-loading-text="拼命加载中"
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
          v-loading="replaceGoodsDialog6Loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          border
          highlight-current-row
          height="400"
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
              <span v-if="scope.row.suitFlag">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="salesPrice"
            align='center'
            label="软件售价"
            v-if="openLimitExchangeGoods"
            width="">
          </el-table-column>
          <el-table-column
            v-if="!isPresellFlag"
            prop="kStock"
            align='center'
            label="可售现货"
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.kStock > 0">{{scope.row.kStock}}</span>
              <span v-else style="color:red;">{{scope.row.kStock}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="preSaleStock"
            v-if="isPresellFlag"
            align='center'
            label="预售库存"
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.preSaleStock > 0">{{scope.row.preSaleStock}}</span>
              <span v-else style="color:red;">{{scope.row.preSaleStock}}</span>
            </template>
          </el-table-column>
          <!--宝洁新增-->
          <el-table-column v-if="!openManSuitSales" label="单品组套最大可售" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales >= 0">{{ scope.row.suitMaxSales }}</span>
              <span v-else-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales < 0">0</span>
              <span v-else>-</span>
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
    <el-dialog v-dialogDrag :close-on-click-modal="false" append-to-body title="请选择替换的赠品" :visible.sync="replaceGoodsDialog7"
               width="1200px" v-loading="loading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
      <div class="input-box">
        <el-row>
          <el-col :span="4">
            <div><label for="">赠品名称：</label>
              <el-input maxlength="50" style="width:110px;" v-model="replaceGiftObj.goodsName"
                        @keyup.enter.native="queryGiftBtn7"></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <div><label for="">赠品编号：</label>
              <el-input maxlength="50" style="width:110px;" v-model="replaceGiftObj.goodsCode"
                        @keyup.enter.native="queryGiftBtn7"></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <div><label for="">条形码：</label>
              <el-input maxlength="50" style="width:110px;" v-model="replaceGiftObj.barCode"
                        @keyup.enter.native="queryGiftBtn7"></el-input>
            </div>
          </el-col>
          <el-col :span="4" v-if="openManGiftInv">
            <div><label for="">销售状态：</label>
              <el-select v-model="replaceGiftObj.salesType" placeholder="" style="width:110px;">
                <el-option label="全部" value="-1"></el-option>
                <el-option label="可售可赠" value="1"></el-option>
                <el-option label="仅赠" value="2"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div><label for="">是否套装：</label>
              <el-select v-model="replaceGiftObj.suitFlag" placeholder="" style="width:110px;">
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
          v-loading="replaceGoodsDialog7Loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          border
          highlight-current-row
          height="400"
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
              <span v-if="scope.row.suitFlag">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="giftType"
            align='center'
            label="销售状态"
            v-if="openManGiftInv"
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
            v-if="openManGiftInv"
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.giftStock > 0">{{scope.row.giftStock}}</span>
              <span v-else style="color:red;">{{scope.row.giftStock}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="readyForSale"
            align='center'
            label="可售现货"
            v-if="!openManGiftInv"
            width="">
          </el-table-column>
          <!--宝洁新增-->
          <el-table-column v-if="!openManSuitSales" label="单品组套最大可售" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales >= 0">{{ scope.row.suitMaxSales }}</span>
              <span v-else-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales < 0">0</span>
              <span v-else>-</span>
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
</template>

<script>
  export default {
    props: {
      salesOrderId: String,
      isLoading: Boolean,
      isOperation:Boolean
    },
    data() {
      return {
        loading: false,
        followUpdateGift: false,
        selectAddGiftDialogLoading: false,
        openManGiftInv: false,
        openManSuitSales: false,
        checkStockDialog:false,//查库存
        checkStockData:[],//查库存data
        checkStockObj:{
          goodsName:'',
          goodsBarCode:'',
          goodsQty:'',
        },
        suitFlagStock:false,//是否套装
        goodsList: [],
        storageTypeObj:{
          '1':'自建仓',
          '2':'第三方仓',
          '3':'菜鸟',
          '4':'京东',
        },
        //旗帜颜色列表
        flagColorList: {
          "0": "#999",
          "1": "#cd3930",
          "2": "#edcf4c",
          "3": "#72c95d",
          "4": "#3d9bfe",
          "5": "#822aea"
        },
        addGiftObj: {},
        currentPage1: 1,
        totalPage1: 15,
        totalNum1: 0,
        selectRow1: '',
        addGiftData1: [],
        selectAddGiftDialog: false,
        recordCurrent: 1,
        editing: false,
        version: '1.0.0',
        orderInfos: {},
        exchangeRow: '',
        replaceGiftObj: '',
        addGiftData7: [],
        currentPage7: 1,
        totalPage7: 15,
        totalNum7: 0,
        selectRow7: '',
        isPresellFlag: false,
        replaceGoodsObj: {},
        addGiftData6: [],
        currentPage6: 1,
        totalPage6: 15,
        totalNum6: 0,
        selectRow6: '',
        replaceGoodsDialog6Loading: false,
        replaceGoodsDialog7Loading: false,
        replaceGoodsDialog7: false,
        replaceGoodsDialog6: false,
        openLimitExchangeGoods: false,
        openSaleInvNegativeFlag: false,
        authorityCode: sessionStorage.getItem('authorityCode') ? JSON.parse(sessionStorage.getItem('authorityCode')) : {},
      }
    },
    methods: {
      //选择赠品添加查询
      addGiftShow() {
        //添加赠品列表
        this.addGiftObj = {
          giftName: '',
          giftCode: '',
          giftBarCode: '',
          giftSalesStatus: '-1',
          giftSuitFlag: '-1',
        };
        this.currentPage1 = 1;
        this.totalPage1 = 15;
        this.selectRow1 = '';
        this.queryGiftBtn1();
      },
      //选择赠品添加查询
      queryGiftBtn1() {
        this.selectAddGiftDialog = true;
        this.selectAddGiftDialogLoading = true;
        this.addGiftObj.page = this.currentPage1;
        this.addGiftObj.size = this.totalPage1;
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/queryAddGiftList', this.addGiftObj)
          .then((res) => {
            if (res.data.success) {
              this.openManGiftInv = res.data.result.openManGiftInv ? res.data.result.openManGiftInv : false;
              //宝洁新增是否显示最大可售列
              this.openManSuitSales = res.data.result.openManSuitSales ? res.data.result.openManSuitSales : false;
              this.selectRow1 = '';

              this.addGiftData1 = res.data.result.rows;
              this.totalNum1 = res.data.result.total;
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
            this.selectAddGiftDialogLoading = false;
          })
      },
      handleSizeChange1(value) {
        this.totalPage1 = value;
        this.queryGiftBtn1();
      },
      handleCurrentChange1(value) {
        this.currentPage1 = value;
        this.queryGiftBtn1();
      },
      selecGiftRow1(row, oldrow) {
        this.selectRow1 = row ? row : '';
      },
      //添加赠品
      saveAddGift1() {
        if (!this.selectRow1) {
          this.$message({
            message: '请选择要添加的赠品！',
            type: 'warning'
          });
          return false;
        }
        var salesOrderIdList = [];
        salesOrderIdList[0] = this.salesOrderId;
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/followPassSalesOrderVoucher", {
          salesOrderIdList: JSON.stringify(salesOrderIdList)
        }).then((response) => {
          if (response.data.success) {
            this.loading = true;
            this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funUpdateGift', {
              changeType: 1,
              giftBarCode: this.selectRow1.goodsBarCode,
              giftNum: 1,
              addUpFlag: true,
              orderIds: this.salesOrderId,
              isNotDel: null,
              isFromOrderDetail: 1,
              openManGiftInv: this.openManGiftInv,
              openManSuitSales: this.openManSuitSales,
              editUpdateTime:this.orderInfos.editUpdateTime?this.orderInfos.editUpdateTime:''
            })
              .then((res) => {
                this.loading = false;
                if (res.data.success) {
                  this.selectAddGiftDialog = false;
                  //都成功
                  if (res.data.result.failQty === 0) {
                    this.$message({
                      message: '添加成功！',
                      type: 'success'
                    });
                    this.initRenderDetail();
                  } else if (res.data.result.successQty === 0 || res.data.result.returnType == 3) {
                    this.$message({
                      message: "添加失败!原因：" + res.data.result.failReason + "！",
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
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //双击单元格
      celldbClick(row, column, cell, event) {
        if (column.property == "goodsQty" && row.giftFlag && this.followUpdateGift) {
          if (!this.editing) {
            row.editFlag = true;
            this.editing = true;
            this.goodsList = JSON.parse(JSON.stringify(this.goodsList));
            this.recordCurrent = row.goodsQty * 1;
          } else {
            this.$message({
              message: '请先保存当前编辑方案！',
              type: 'warning'
            });
          }
        }
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
      //套装更多显示
      showSuitList1(index, row, n) {
        this.$set(row, 'isSuit', true);
        for (var i = row.orderSuitDetailBeans.length; i--; i >= 0) {
          row.orderSuitDetailBeans[i].goodsQty = row.orderSuitDetailBeans[i].skuQty;
          row.orderSuitDetailBeans[i].unitPrice = row.orderSuitDetailBeans[i].skuPrice;
          row.orderSuitDetailBeans[i].goodsBarCode = row.orderSuitDetailBeans[i].barCode;//条码
          row.orderSuitDetailBeans[i].goodsSpec = row.orderSuitDetailBeans[i].spec;//规格
          row.orderSuitDetailBeans[i].classFlag = 'classFlag';
          this.goodsList[n].orderDetails.splice(index + 1, 0, row.orderSuitDetailBeans[i]);
        }
      },
      //套装更多收起可售现货库存
      hideSuitList(index, row, n) {
        this.$set(row, 'isSuit', false);
        this.goodsList[n].orderDetails.splice(index + 1, row.orderSuitDetailBeans.length);
      },
      //删除赠品
      channelDelGift(row) {
        if (this.goodsList.length == 1 && this.goodsList[0].orderDetails.length == 1) {
          this.$message({
            message: '该订单只有一条明细不能删除！',
            type: 'warning'
          });
          return false;
        }
        this.$confirm('确定要删除此赠品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.loading = true;
          this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funUpdateGift', {
            changeType: 2,
            giftBarCode: row.goodsBarCode,
            orderItemIdByUpdateGiftNum: row.orderItemId,
            giftNum: row.goodsQty,
            addUpFlag: true,
            orderIds: this.salesOrderId,
            isNotDel: null,
            isFromOrderDetail: 1,
            openManGiftInv: this.openManGiftInv,
            openManSuitSales: this.openManSuitSales,
            editUpdateTime:this.orderInfos.editUpdateTime?this.orderInfos.editUpdateTime:'',
          })
            .then((res) => {
              this.loading = false;
              if (res.data.success) {
                this.loading = false;
                if (res.data.result.failQty === 0) {
                  this.$message({
                    message: '删除成功！',
                    type: 'success'
                  });
                  this.initRenderDetail();
                } else if (res.data.result.successQty === 0 || res.data.result.returnType == 3) {
                  this.$message({
                    message: "删除失败!原因：" + res.data.result.failReason + "！",
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
        }).catch(() => {
        });
      },
      //查库存
      checkStock(row){
        this._post('com.edb01.erp.wms.service.api.WmStorageInvService/' + this.version + '/queryOrderBranchStorageSuitList', {
          barCode:row.goodsBarCode,
          goodsName:row.goodsName,
          suitFlag:row.suitFlag?row.suitFlag:false,
          goodsId:row.goodsId
        }).then((res) => {
          this.loading = false;
          if (res.data.success) {
            this.checkStockObj = {
              goodsName:row.goodsName,
              goodsBarCode:row.goodsBarCode,
              goodsQty:row.goodsQty
            }
            this.suitFlagStock = row.suitFlag;
            this.checkStockData = res.data.result;
            this.checkStockData.forEach(item => {
              if(item.storageType){
                item.storageType = this.storageTypeObj[item.storageType+''];
              }else{
                item.storageType = '';
              }
            })
            if(this.suitFlagStock){
              this.checkStockData.sort((a,b)=>{
                return b.suitMaxAccount - a.suitMaxAccount;
              })
            }else{
              this.checkStockData.sort((a,b)=>{
                return b.accountSurplusInv - a.accountSurplusInv;
              })
            }
            this.checkStockDialog = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
      },
      //失焦保存
      keyupNumSave(row, index) {
        if (row.goodsQty == '') {
          this.$message({
            message: '数量不能为空！',
            type: 'warning'
          });
          return false;
        }
        var paramNum = 0, isAdd = true;
        if (this.recordCurrent == row.goodsQty * 1) {
          row.editFlag = false;
          this.editing = false;
          return false;
        } else if (this.recordCurrent > row.goodsQty * 1) {
          paramNum = this.recordCurrent - row.goodsQty * 1;
          isAdd = false;
        } else {
          paramNum = row.goodsQty * 1 - this.recordCurrent;
          isAdd = true;
        }
        this.loading = true;
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funUpdateGift', {
          changeType: isAdd ? 1 : 2,
          giftBarCode: row.goodsBarCode,
          orderItemIdByUpdateGiftNum: row.orderItemId,
          giftNum: paramNum,
          addUpFlag: true,
          orderIds: this.salesOrderId,
          isNotDel: null,
          isFromOrderDetail: 1,
          openManGiftInv: this.openManGiftInv,
          openManSuitSales: this.openManSuitSales,
          editUpdateTime:this.orderInfos.editUpdateTime?this.orderInfos.editUpdateTime:''
        }).then((res) => {
          this.loading = false;
          if (res.data.success) {
            if (res.data.result.returnType == 3 || res.data.result.successQty === 0) {
              this.$message({
                message: "修改失败!原因：" + res.data.result.failReason + "！",
                type: 'warning'
              });
            } else if (res.data.result.failQty === 0) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
              row.editFlag = false;
              this.editing = false;
              this.initRenderDetail();
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
      exchangeGift(row) {
        //presellFlag giftFlag suitFlag
        this.exchangeRow = row;
        if (row.giftFlag) {
          //赠品
          //添加赠品列表
          this.replaceGiftObj = {
            goodsName: '',
            goodsCode: '',
            barCode: '',
            salesType: '-1',
            suitFlag: '-1',
          };
          this.currentPage7 = 1;
          this.totalPage7 = 15;
          this.selectRow7 = '';
          this.queryGiftBtn7();
        } else {
          if (row.presellFlag) {
            this.isPresellFlag = true;
          } else {
            this.isPresellFlag = false;
          }
          //预售或正常
          this.replaceGoodsObj = {
            goodsName: '',
            goodsCode: '',
            barCode: '',
            suitFlag: '-1'
          };
          this.currentPage6 = 1;
          this.totalPage6 = 15;
          this.selectRow6 = '';
          this.queryGiftBtn6();
        }
      },
      /*---------------------------------------------*/
      //请选择替换的商品（订单详情）
      queryGiftBtn6() {
        this.replaceGoodsObj.page = this.currentPage6;
        this.replaceGoodsObj.size = this.totalPage6;
        this.replaceGoodsObj.openManGiftInv = this.openManGiftInv;
        this.replaceGoodsObj.openManSuitSales = this.openManSuitSales;
        this.replaceGoodsObj.goodsId = this.exchangeRow.goodsId;
        this.replaceGoodsDialog6 = true;
        this.replaceGoodsDialog6Loading = true;
        var paramUrl = this.isPresellFlag ? 'selectPreSaleGoodsList' : 'selectNormalGoodsList';
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/" + paramUrl, this.replaceGoodsObj).then((response) => {
          if (response.data.success) {
            this.openLimitExchangeGoods = response.data.result.openLimitExchangeGoods ? response.data.result.openLimitExchangeGoods : false;
            this.openManGiftInv = response.data.result.openManGiftInv ? response.data.result.openManGiftInv : false;
            this.openManSuitSales = response.data.result.openManSuitSales ? response.data.result.openManSuitSales : false;
            this.selectRow6 = '';
            this.addGiftData6 = response.data.result.rows;
            this.totalNum6 = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
          this.replaceGoodsDialog6Loading = false;
        })
      },
      handleSizeChange6(value) {
        this.totalPage6 = value;
        this.queryGiftBtn6();
      },
      handleCurrentChange6(value) {
        this.currentPage6 = value;
        this.queryGiftBtn6();
      },
      selecGiftRow6(row, oldrow) {
        this.selectRow6 = row ? row : '';
      },
      saveAddGift6() {
        if (!this.selectRow6) {
          this.$message({
            message: '请选择替换的商品!',
            type: 'warning'
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/salesOrderDetailPleaseProductListListClickYes", {
          salesOrderId: this.salesOrderId,
          oldGoodsId: this.exchangeRow.goodsId,
          orderItemId: this.exchangeRow.orderItemId,
          replaceGoodsId: this.selectRow6.goodsId,
          suitFlag: this.selectRow6.suitFlag
        }).then((response) => {
          if (response.data.success) {
            this.loading = true;
            this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateProduct", {
              newSkuBarCode: this.selectRow6.goodsBarCode,
              isFromOrderDetail:1,
              replaceGiftSale: false,
              replaceSale: this.isPresellFlag ? false : true,
              replacePreSale: this.isPresellFlag ? true : false,
              orderIdListJson: JSON.stringify([this.salesOrderId]),
              oldSkuGoodsId: this.exchangeRow.goodsId,
              orderDetailId: this.exchangeRow.orderItemId,
              openManGiftInv: this.openManGiftInv,
              openManSuitSales: this.openManSuitSales,
              openLimitExchangeGoods: this.openLimitExchangeGoods,
              openSaleInvNegativeFlag: this.openSaleInvNegativeFlag,
              editUpdateTime:this.orderInfos.editUpdateTime?this.orderInfos.editUpdateTime:''
            }).then((response) => {
              this.loading = false;
              if (response.data.success) {
                if (response.data.result.returnType == 3) {
                  this.$message({
                    message: '换货失败！' + response.data.result.failReason,
                    type: 'warning'
                  });
                } else if (response.data.result.successQty == 1) {
                  this.$message({
                    message: '换货成功！',
                    type: 'success'
                  });
                  this.replaceGoodsDialog6 = false;
                  this.initRenderDetail();
                } else {
                  this.$message({
                    message: '换货失败！' + response.data.result.failReason,
                    type: 'warning'
                  });
                }
              } else {
                this.$message({
                  message: response.data.msg,
                  type: "warning"
                });
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
      /*---------------------------------------------*/
      //请选择替换的赠品（订单详情）
      queryGiftBtn7() {
        this.replaceGiftObj.page = this.currentPage7;
        this.replaceGiftObj.size = this.totalPage7;
        this.replaceGiftObj.goodsId = this.exchangeRow.goodsId;
        this.replaceGoodsDialog7 = true;
        this.replaceGoodsDialog7Loading = true;
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/selectGiftGoodsList", this.replaceGiftObj).then((response) => {
          if (response.data.success) {
            this.openLimitExchangeGoods = response.data.result.openLimitExchangeGoods ? response.data.result.openLimitExchangeGoods : false;//openManGiftInv
            this.openManGiftInv = response.data.result.openManGiftInv ? response.data.result.openManGiftInv : false;
            this.openManSuitSales = response.data.result.openManSuitSales ? response.data.result.openManSuitSales : false;
            this.selectRow7 = '';
            this.addGiftData7 = response.data.result.rows;
            this.totalNum7 = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
          this.replaceGoodsDialog7Loading = false;
        })
      },
      handleSizeChange7(value) {
        this.totalPage7 = value;
        this.queryGiftBtn7();
      },
      handleCurrentChange7(value) {
        this.currentPage7 = value;
        this.queryGiftBtn7();
      },
      selecGiftRow7(row, oldrow) {
        this.selectRow7 = row ? row : '';
      },
      saveAddGift7() {
        if (!this.selectRow7) {
          this.$message({
            message: '请选择替换的赠品!',
            type: 'warning'
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/salesOrderDetailPleaseProductListListClickYes", {
          salesOrderId: this.salesOrderId,
          oldGoodsId: this.exchangeRow.goodsId,
          orderItemId: this.exchangeRow.orderItemId,
          replaceGoodsId: this.selectRow7.goodsId,
          suitFlag: this.selectRow7.suitFlag
        }).then((response) => {
          if (response.data.success) {
            this.loading = true;
            this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateProduct", {
              newSkuBarCode: this.selectRow7.goodsBarCode,
              isFromOrderDetail:1,
              replaceGiftSale: true,
              replaceSale: false,
              replacePreSale: false,
              orderIdListJson: JSON.stringify([this.salesOrderId]),
              oldSkuGoodsId: this.exchangeRow.goodsId,
              orderDetailId: this.exchangeRow.orderItemId,
              openManGiftInv: this.openManGiftInv,
              openManSuitSales: this.openManSuitSales,
              openLimitExchangeGoods: this.openLimitExchangeGoods,
              openSaleInvNegativeFlag: this.openSaleInvNegativeFlag,
              editUpdateTime:this.orderInfos.editUpdateTime?this.orderInfos.editUpdateTime:''
            }).then((response) => {
              this.loading = false;
              if (response.data.success) {
                if (response.data.result.returnType == 3) {
                  this.$message({
                    message: '换货失败！' + response.data.result.failReason,
                    type: 'warning'
                  });
                } else if (response.data.result.successQty == 1) {
                  this.$message({
                    message: '换货成功！',
                    type: 'success'
                  });
                  this.replaceGoodsDialog7 = false;
                  this.initRenderDetail();
                } else {
                  this.$message({
                    message: '换货失败！' + response.data.result.failReason,
                    type: 'warning'
                  });
                }
              } else {
                this.$message({
                  message: response.data.msg,
                  type: "warning"
                });
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
      /*---------------------------------------------*/

      //获取商品详情
      initRenderDetail(item) {
        if (!this.isLoading) this.loading = true;
        this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/findOrderBaseBeanById", {
          salesOrderId: this.salesOrderId
        }).then((response) => {
          this.loading = false;
          if (response.data.success) {
            this._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + this.version + '/query')
              .then((res) => {
                if (res.data.success) {
                  this.openManGiftInv = res.data.result.openManGiftInv;
                  this.openManSuitSales = res.data.result.openManSuitSales;
                  this.openLimitExchangeGoods = res.data.result.limitExchangeGoods;
                  this.openSaleInvNegativeFlag = res.data.result.saleInvNegativeFlag;
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "warning"
                  });
                }
              })
            this.goodsList = [];
            this.followUpdateGift = response.data.result.followUpdateGift && this.authorityCode.OMS_ORDERPROCESSING_EDITGOODS && this.isOperation;//改赠品
            this.followChangeGoods = response.data.result.followChangeGoods && this.authorityCode.OMS_ORDERPROCESSING_EDITGOODS && this.isOperation;//换商品

            response.data.result.internalMemoMsg = (response.data.result.internalMemoMsg == 'undefined' || !response.data.result.internalMemoMsg) ? '' : response.data.result.internalMemoMsg;
            response.data.result.storageAuditMsg = (response.data.result.storageAuditMsg == 'undefined' || !response.data.result.storageAuditMsg) ? '' : response.data.result.storageAuditMsg;
            response.data.result.consignee = (response.data.result.consignee == 'undefined' || !response.data.result.consignee) ? '' : response.data.result.consignee;
            response.data.result.consigneeMobile = (response.data.result.consigneeMobile == 'undefined' || !response.data.result.consigneeMobile) ? '' : response.data.result.consigneeMobile;
            response.data.result.consigneePhone = (response.data.result.consigneePhone == 'undefined' || !response.data.result.consigneePhone) ? '' : response.data.result.consigneePhone;
            response.data.result.storageId = response.data.result.storageId ? response.data.result.storageId : '';
            response.data.result.expressId = response.data.result.expressId ? response.data.result.expressId : '';

            //response.data.result.sourceOrderNo = (response.data.result.orderType == 3 || response.data.result.orderType == 4)?'':response.data.result.sourceOrderNo;
            this.orderInfos = response.data.result;
            console.log(this.orderInfos);
            /*this.orderInfos = response.data.result;
            //storageId expressId
            if (!this.orderInfos.storageName) this.orderInfos.storageId = '';
            if (!this.orderInfos.expressName) this.orderInfos.expressId = '';

            if (this.orderInfos.orderTime) this.orderInfos.orderTime = turnTimestamp(this.orderInfos.orderTime);
            if (this.orderInfos.payTime) this.orderInfos.payTime = turnTimestamp(this.orderInfos.payTime);
            this.proCityAreaValue = [this.orderInfos.provinceRegionId + '', this.orderInfos.cityRegionId + '', this.orderInfos.areaRegionId + ''];*/

            response.data.result.orderBaseDetailsBean.forEach((item, i) => {
              this.$set(item, 'editFlag', false);
              if (item.suitFlag) this.$set(item, 'isSuit', false);
            });
            response.data.result.orderBaseDetailsBeanNews = response.data.result.orderBaseDetailsBeanNews ? response.data.result.orderBaseDetailsBeanNews : [];
            response.data.result.orderBaseDetailsBeanNews.forEach((item, i) => {
              this.$set(item, 'editFlag', false);
              if (item.suitFlag) this.$set(item, 'isSuit', false);
            });

            //先判断字段是否存在，再使用forEach
            if (response.data.result.orderHistoryBaseBeansv != undefined) {
              response.data.result.orderHistoryBaseBeans.forEach((item, i) => {

                item.orderDetails.forEach((item2, j) => {
                  this.$set(item2, 'editFlag', false);
                  if (item2.suitFlag) this.$set(item2, 'isSuit', false);
                })

              })
            }

            if (this.orderInfos.originalFlag) {//原始单
              //sourceOrderNo flagId customerMsg serviceMsg
              this.goodsList.push({
                orderDetails: response.data.result.orderBaseDetailsBean,
                sourceOrderNo: this.orderInfos.sourceOrderNo,
                flagId: this.orderInfos.flagId,
                customerMsg: this.orderInfos.customerMsg,
                serviceMsg: this.orderInfos.serviceMsg,
                ecOrderStatusName:this.orderInfos.ecOrderStatusName
              })
            } else {
              this.goodsList = response.data.result.orderHistoryBaseBeans;
              if (response.data.result.orderBaseDetailsBeanNews.length > 0) {
                this.goodsList.push({
                  orderDetails: response.data.result.orderBaseDetailsBeanNews,
                  sourceOrderNo: this.orderInfos.sourceOrderNo,
                  flagId: this.orderInfos.flagId,
                  customerMsg: this.orderInfos.customerMsg,
                  serviceMsg: this.orderInfos.serviceMsg,
                  ecOrderStatusName:this.orderInfos.ecOrderStatusName
                })
              }
            }
            this.$emit('returnOrderDetail', response.data.result)
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
      //console.log(this.isOperation);
      this.initRenderDetail('echo');
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
