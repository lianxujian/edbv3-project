<!--店铺销量 佩玖-->
<template>
  <div id="Salestatistics">
    <!--Top 导航-->
    <div class="topClass">
      <el-row>
        <el-col :span="5">
          <div class="grid-content bg-purple"
               style="text-align: center;cursor: pointer;line-height: 40px;margin-bottom: 1px"
               :class="{colorTitle: Showey == 1}" @click="handleSelect(1)"><span class="spanText">商品销量统计（条形码）</span>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light"
               style="text-align: center;cursor: pointer;line-height: 40px;margin-bottom: 1px"
               :class="{colorTitle: Showey == 2}" @click="handleSelect(2)"><span class="spanText"> 商品销量统计（商品编码）</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple"
               style="text-align: center;cursor: pointer;line-height: 40px;margin-bottom: 1px"
               :class="{colorTitle: Showey == 3}" @click="handleSelect(3)"><span class="spanText">品牌销量统计</span></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light"
               style="text-align: center;cursor: pointer;line-height: 40px;margin-bottom: 1px"
               :class="{colorTitle: Showey == 4}" @click="handleSelect(4)"><span class="spanText">分类销量统计 </span></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple-light"
               style="text-align: center;cursor: pointer;line-height: 40px;margin-bottom: 1px"
               :class="{colorTitle: Showey == 5}" @click="handleSelect(5)"><span class="spanText">店铺销量统计 </span></div>
        </el-col>
      </el-row>
    </div>
    <!--搜索区-->
    <!--No:1商品销量统计（条形码)-->
    <div id="searchBox" class="searchBox" style="margin: 8px 0 -10px 0" v-show="Showey == 1">
      <div class="query-button" style="margin-left: -30px"><!--查询区-->
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">商品分类</label>
          <select id="example-post1_1" class="example-post Showey1" name="multiselect[]" multiple="multiple">
            <option v-for="item in goodsCate" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">品牌</label>
          <select id="example-post1_2" class="example-post Showey2" name="multiselect[]" multiple="multiple">
            <option v-for="item in brand" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">店铺</label>
          <select id="example-post1_3" class="example-post Showey3" name="multiselect[]" multiple="multiple">
            <option v-for="item in shop" :value="item.value">{{item.label}}</option>
          </select>
        </div>

        <div class="grid-content">
          <label>付款时间</label>
          <el-date-picker
            style="width: 350px"
            v-model="applyTime1"
            type="datetimerange"
            range-separator="-"
            format="yyyy/MM/dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>


        <div class="grid-content" id="shop-box">
          <label>条形码</label>
          <el-input style="width: 200px!important;" v-model="showData"></el-input>
          <i class="el-icon-close error" @click="showData='';"></i> <!--X-->
          <span class="dot" @click="dialogVisible=true;;productList()">...</span><!--...-->
        </div>
        <div class="grid-content">
          <label>是否套装</label>
          <el-select style="width:200px!important;" v-model="area1.suitFlag" placeholder="请选择">
            <el-option
              v-for="item in manageState3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.isNo == 50 "
            >
            </el-option>
          </el-select>
        </div>
        <div class="grid-content">
          <el-select style="width:110px!important;margin-left: 30px" v-model="area1.serachType" placeholder="请选择">
            <el-option
              v-for="item in manageState2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width: 90px!important;" :maxlength="9"
                    @keyup.native="area1.numsStart = area1.numsStart.replace(/[^\d]/g,'');if(area1.numsStart == 0)area1.numsStart=''"
                    v-model="area1.numsStart"></el-input>&nbsp;~&nbsp;
          <el-input style="width: 90px!important;" :maxlength="9"
                    @keyup.native="area1.numsEnd = area1.numsEnd.replace(/[^\d]/g,'');if(area1.numsEnd == 0)area1.numsEnd=''"
                    v-model="area1.numsEnd"></el-input>
        </div>
        <div class="grid-content">
          <el-checkbox :disabled="area1.suitFlag == true" v-model="area1.countSuitGoodsFlag" @change="delopotion()"
                       style="margin-left: 40px">统计套装内单品
          </el-checkbox>
        </div>

      </div>

    </div>
    <!--No:2商品销量统计（商品编码）-->
    <div class="searchBox" style="margin: 8px 0 -10px 0" v-show="Showey == 2">
      <div class="query-button" style="margin-left: -30px"><!--查询区-->
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">商品分类</label>
          <select id="example-post2_1" class="example-post Showey1" name="multiselect[]" multiple="multiple">
            <option v-for="item in goodsCate" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">品牌</label>
          <select id="example-post2_2" class="example-post Showey2" name="multiselect[]" multiple="multiple">
            <option v-for="item in brand" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">店铺</label>
          <select id="example-post2_3" class="example-post Showey3" name="multiselect[]" multiple="multiple">
            <option v-for="item in shop" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content">
          <label>付款时间</label>
          <el-date-picker
            style="width: 290px"
            v-model="applyTime2"
            type="datetimerange"
            range-separator="-"
            format="yyyy/MM/dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="grid-content" id="shop-box1">
          <label>商品编号</label>
          <el-input style="width: 200px!important;" v-model="showData2"></el-input>
          <i class="el-icon-close error" @click="showData2=''"></i> <!--X-->
          <span class="dot" @click="dialogVisible=true;;productList()">...</span><!--...-->
        </div>
        <div class="grid-content">
          <el-select style="width:110px!important;margin-left: 30px" v-model="area2.serachType" placeholder="请选择">
            <el-option
              v-for="item in manageState2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width: 90px!important;" :maxlength="9"
                    @keyup.native="area2.numsStart = area2.numsStart.replace(/[^\d]/g,'');if(area2.numsStart == 0)area2.numsStart = ''"
                    v-model="area2.numsStart"></el-input>&nbsp;~&nbsp;
          <el-input style="width: 90px!important;" :maxlength="9"
                    @keyup.native="area2.numsEnd = area2.numsEnd.replace(/[^\d]/g,'');if(area2.numsEnd == 0)area2.numsEnd = ''"
                    v-model="area2.numsEnd"></el-input>
        </div>

        <!--<div class="grid-content" style="margin-left:60px!important;" v-show="Showey != 5">-->
        <!--<el-checkbox v-model="checked2">仅统计自动流转商品</el-checkbox>-->
        <!--</div>-->

      </div>
    </div>
    <!--No:3 品牌销量统计-->
    <div class="searchBox" style="margin: 8px 0 -10px 0" v-show="Showey == 3">
      <div class="query-button" style="margin-left: -30px"><!--查询区-->

        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">品牌</label>
          <select id="example-post3_1" class="example-post Showey2" name="multiselect[]" multiple="multiple">
            <option v-for="item in brand" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">店铺</label>
          <select id="example-post3_2" class="example-post Showey3" name="multiselect[]" multiple="multiple">
            <option v-for="item in shop" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" id="specific">
          <el-select style="width:110px!important;margin-left: 30px" v-model="area3.saleType" placeholder="请选择">
            <el-option
              v-for="item in manageState"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width:90px!important;" :maxlength="9"
                    @keyup.native="area3.minQty = area3.minQty.replace(/[^\d]/g,'');if( area3.minQty == 0) area3.minQty = ''"
                    v-model="area3.minQty"></el-input>&nbsp;~ &nbsp;
          <el-input style="width:90px!important;" class="specific" :maxlength="9"
                    @keyup.native="area3.maxQty = area3.maxQty.replace(/[^\d]/g,'');if( area3.maxQty == 0) area3.maxQty = ''"
                    v-model="area3.maxQty"></el-input>
        </div>

        <div class="grid-content">
          <label>付款时间</label>
          <el-date-picker
            style="width: 310px"
            v-model="applyTime3"
            type="datetimerange"
            range-separator="-"
            format="yyyy/MM/dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>

        <!--<div class="grid-content" style="margin-left:60px!important;" v-show="Showey != 5">-->
        <!--<el-checkbox v-model="area3_4">仅统计自动流转商品</el-checkbox>-->
        <!--</div>-->

      </div>
    </div>
    <!--No:4 分类销量统计-->
    <div class="searchBox" style="margin: 8px 0 -10px 0" v-show="Showey == 4">
      <div class="query-button" style="margin-left: -30px"><!--查询区-->
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">商品分类</label>
          <select id="example-post4_2" class="example-post Showey1" name="multiselect[]" multiple="multiple">
            <option v-for="item in goodsCate" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">店铺</label>
          <select id="example-post4_3" class="example-post Showey3" name="multiselect[]" multiple="multiple">
            <option v-for="item in shop" :value="item.value">{{item.label}}</option>
          </select>
        </div>

        <div class="grid-content">
          <el-select style="width:110px!important;margin-left: 30px" v-model="area4.saleType" placeholder="请选择">
            <el-option
              v-for="item in manageState2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width:90px!important;"
                    :maxlength="9"
                    @keyup.native="area4.startValue = area4.startValue.replace(/[^\d]/g,'');if(area4.startValue == 0)area4.startValue = ''"
                    v-model="area4.startValue"></el-input>&nbsp;~ &nbsp;
          <el-input style="width:90px!important;" class="specific"
                    :maxlength="9"
                    @keyup.native="area4.endValue = area4.endValue.replace(/[^\d]/g,'');if(area4.endValue == 0)area4.endValue = ''"
                    v-model="area4.endValue"></el-input>
        </div>

        <div class="grid-content">
          <label>付款时间</label>
          <el-date-picker
            style="width: 290px"
            v-model="applyTime4"
            type="datetimerange"
            range-separator="-"
            format="yyyy/MM/dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>

        <!--<div class="grid-content" style="margin-left:60px!important;" v-show="Showey != 5">-->
        <!--<el-checkbox v-model="checked2">仅统计自动流转商品</el-checkbox>-->
        <!--</div>-->

      </div>
    </div>
    <!--No:5 店铺销量统计-->
    <div class="searchBox" style="margin: 8px 0 -10px 0" v-show="Showey == 5">
      <div class="query-button" style="margin-left: -30px"><!--查询区-->

        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">店铺</label>
          <select id="example-post5_1" class="example-post Showey3" name="multiselect[]" multiple="multiple">
            <option v-for="item in shop" :value="item.value">{{item.label}}</option>
          </select>
        </div>

        <div class="grid-content">
          <label>销售总额</label>
          <el-input style="width:90px!important;"
                    :maxlength="9"
                    @keyup.native="area5.numsStart = area5.numsStart.replace(/[^\d]/g,'');if(area5.numsStart == 0)area5.numsStart=''"
                    v-model="area5.numsStart"></el-input>&nbsp;~ &nbsp;
          <el-input style="width:90px!important;" class="specific"
                    :maxlength="9"
                    @keyup.native="area5.numsEnd = area5.numsEnd.replace(/[^\d]/g,'');if(area5.numsEnd == 0)area5.numsEnd=''"
                    v-model="area5.numsEnd"></el-input>
        </div>
        <div class="grid-content">
          <label>付款时间</label>
          <el-date-picker
            style="width: 290px"
            v-model="applyTime5"
            type="datetimerange"
            range-separator="-"
            format="yyyy/MM/dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>

      </div>
    </div>
    <!--按钮-->
    <div style="position: absolute;right: 20px;top:60px" id="smallBtn">
      <el-button type="primary" @keyup.enter="query()" @click="query()">查 询</el-button>
      <el-button @click="reset()">重 置</el-button>
    </div>
    <div style="clear:both"></div>
    <div style="margin-bottom: 10px"></div>
    <div class="col-nav" style="margin-top:-10px;">
      <ul>
        <li @click="exportData()"><span>导出报表</span></li>
      </ul>
    </div>
    <div style="width: 500px;height:30px;line-height:30px;float: right;" v-show="Showey==1"><span
      style="margin-right:50px;font-weight:600;font-size:14px;">总计:</span>
      <span style="margin-right:90px;font-weight:600;font-size:14px;">销售数量:{{ sumData }}</span>
      <span style="font-weight:600;font-size:14px;">销售总额:{{ amount }}</span>
    </div>
    <div style="width: 500px;height:30px;line-height:30px;float: right;" v-show="Showey==2"><span
      style="margin-right:50px;font-weight:600;font-size:14px;">总计:</span>
      <span style="margin-right:90px;font-weight:600;font-size:14px;">销售数量:{{ sumData2 }}</span>
      <span style="font-weight:600;font-size:14px;">销售总额:{{ amount2 }}</span>
    </div>
    <div style="width: 500px;height:30px;line-height:30px;float: right;" v-show="Showey==3"><span
      style="margin-right:50px;font-weight:600;font-size:14px;">总计:</span>
      <span style="margin-right:90px;font-weight:600;font-size:14px;">销售数量:{{ sumData3 }}</span>
      <span style="font-weight:600;font-size:14px;">销售总额:{{ amount3 }}</span>
    </div>
    <div style="width: 500px;height:30px;line-height:30px;float: right;" v-show="Showey==4"><span
      style="margin-right:50px;font-weight:600;font-size:14px;">总计:</span>
      <span style="margin-right:90px;font-weight:600;font-size:14px;">销售数量:{{ sumData4 }}</span>
      <span style="font-weight:600;font-size:14px;">销售总额:{{ amount4 }}</span>
    </div>
    <div style="width: 500px;height:30px;line-height:30px;float: right;" v-show="Showey==5"><span
      style="margin-right:50px;font-weight:600;font-size:14px;">总计:</span>
      <span style="margin-right:90px;font-weight:600;font-size:14px;">销售数量:{{ sumData5 }}</span>
      <span style="font-weight:600;font-size:14px;">销售总额:{{ amount5 }}</span>
    </div>
    <!--No:1商品销量统计（条形码)-->
    <div v-show="Showey == 1">
      <el-table
        :data="tableData"
        border
        id="fitTable"
        :height="table_h"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="50"
          fixed="left"
          align="center"
          type="index"
          label="序号">
        </el-table-column>

        <el-table-column
          align="center"
          label="店铺"
          prop="storeName"
          width="189">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          align="center"
          width="189"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="goodsCode"
          align="center"
          label="商品编码"
          width="185">
        </el-table-column>
        <el-table-column
          prop="barCode"
          align="center"
          label="条形码"
          width="185">
        </el-table-column>
        <el-table-column
          prop="catalogName"
          align="center"
          label="商品分类"
          width="185">
        </el-table-column>
        <el-table-column
          prop="brandName"
          align="center"
          label="品牌"
          width="185">
        </el-table-column>
        <el-table-column
          prop="salesNums"
          align="center"
          label="销售数量"
          width="185">
        </el-table-column>
        <el-table-column align="center" width="185">
          <template slot="header" slot-scope="slot">

            <span>销售单价</span>
            <el-tooltip class="item" effect="dark" content="销售单价=销售总额/销售数量" trigger='hover' placement="top-start">
              <i class="el-icon-info" style="margin-left:3px;font-size:14px"></i>
            </el-tooltip>

          </template>
          <template slot-scope="scope">
            <span>{{scope.row.salesPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="销售总额"
          prop="salesAtmTotal"
          width="185">
        </el-table-column>

      </el-table>

      <!--分页-->
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
    </div>
    <!--No:2商品销量统计（商品编码）-->
    <div v-show="Showey == 2">
      <el-table
        :data="tableData2"
        border
        id="fitTable2"
        :height="table_h2"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="50"
          fixed="left"
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          label="店铺"
          prop="storeName"
          width="239">
        </el-table-column>
        <el-table-column
          prop="goodsCode"
          align="center"
          width="239"
          label="商品编码">
        </el-table-column>
        <el-table-column
          prop="catalogName"
          align="center"
          label="商品分类"
          width="239">
        </el-table-column>
        <el-table-column
          prop="brandName"
          align="center"
          label="品牌"
          width="239">
        </el-table-column>
        <el-table-column
          prop="salesNums"
          align="center"
          label="销售数量"
          width="239">
        </el-table-column>
        <el-table-column align="center" width="239">
          <template slot="header" slot-scope="slot">
            <span>销售单价</span>
            <el-tooltip class="item" effect="dark" content="销售单价=销售总额/销售数量" trigger='hover' placement="top-start">
              <i class="el-icon-info" style="margin-left:3px;font-size:14px"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.salesPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="salesAtmTotal"
          align="center"
          label="销售总额"
          width="239">
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage1"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="pageSize1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum1">
        </el-pagination>
      </div>
    </div>
    <!--No:3 品牌销量统计-->
    <div v-show="Showey == 3">
      <el-table
        :data="tableData3"
        border
        id="fitTable3"
        :height="table_h3"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="50"
          fixed="left"
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          label="店铺"
          prop="storeName"
          width="331">
        </el-table-column>
        <el-table-column
          prop="brandName"
          align="center"
          width="331"
          label="品牌">
        </el-table-column>
        <el-table-column
          prop="saleNum"
          align="center"
          label="销售数量"
          width="331">
        </el-table-column>
        <el-table-column align="center" width="331">
          <template slot="header" slot-scope="slot">
            <span>销售单价</span>
            <el-tooltip class="item" effect="dark" content="销售单价=销售总额/销售数量" trigger='hover' placement="top-start">
              <i class="el-icon-info" style="margin-left:3px;font-size:14px"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.unitPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="saleAmt"
          align="center"
          label="销售总额"
          width="350">
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage3"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="pageSize3"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum3">
        </el-pagination>
      </div>
    </div>
    <!--No:4 分类销量统计-->
    <div v-show="Showey == 4">
      <el-table
        :data="tableData4"
        border
        id="fitTable4"
        :height="table_h4"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="50"
          fixed="left"
          align="center"
          type="index"
          label="序号">
        </el-table-column>

        <el-table-column
          align="center"
          label="店铺"
          prop="storeName"
          width="330">
        </el-table-column>
        <el-table-column
          prop="catalogName"
          align="center"
          width="333"
          label="商品分类">
        </el-table-column>
        <el-table-column
          prop="saleNum"
          align="center"
          label="销售数量"
          width="330">
        </el-table-column>

        <el-table-column align="center" width="330">
          <template slot="header" slot-scope="slot">
            <span>销售单价</span>
            <el-tooltip class="item" effect="dark" content="销售单价=销售总额/销售数量" trigger='hover' placement="top-start">
              <i class="el-icon-info" style="margin-left:3px;font-size:14px"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.unitPrice}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="saleAmt"
          align="center"
          label="销售总额"
          width="350">
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage4"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="pageSize4"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum4">
        </el-pagination>
      </div>
    </div>
    <!--No:5 店铺销量统计-->
    <div v-show="Showey == 5">
      <el-table
        :data="tableData5"
        border
        id="fitTable5"
        :height="table_h5"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          width="50"
          fixed="left"
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          label="店铺"
          prop="storeName"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="orderNums"
          align="center"
          min-width="200"
          label="客单量">
        </el-table-column>
        <el-table-column
          align="center"
          min-width="200"
          prop="guestprice"
        >
          <template slot="header" slot-scope="slot">
            <span>客单价</span>
            <el-tooltip class="item" effect="dark" content="客单价=销售总额/客单量" trigger='hover' placement="top-start">
              <i class="el-icon-info" style="margin-left:3px;font-size:14px"></i>
            </el-tooltip>
          </template>
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.guestprice}}</span>-->
          <!--</template>-->

        </el-table-column>
        <el-table-column
          prop="salesAtmTotal"
          align="center"
          label="销售总额"
          min-width="200">
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage5"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="pageSize5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum5">
        </el-pagination>
      </div>
    </div>
    <!--条形码查询商品弹框-->
    <div class="pop-w">
      <el-dialog v-dialogDrag
        title="请选择所查询商品"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="730px"
      >
        <div style="height: 50px" v-show="Showey == 1" class="input-box">
          <el-input style="width: 105px;margin-right: 10px!important;" @keyup.enter.native="productList()"
                    v-model="searchData.goodsCode"
                    placeholder="请输入商品编号"></el-input>
          <el-input style="width: 105px;margin-right: 10px!important;" @keyup.enter.native="productList()"
                    v-model="searchData.barCode"
                    placeholder="请输入条形码"></el-input>
          <el-input style="width: 105px;margin-right: 10px!important;" @keyup.enter.native="productList()"
                    v-model="searchData.goodsName"
                    placeholder="请输入商品名称"></el-input>
          <el-input style="width: 105px;margin-right: 10px!important;" @keyup.enter.native="productList()"
                    v-model="searchData.goodsSpec"
                    placeholder="请输入商品规格"></el-input>
          <span style="float: right">  <el-button type="primary" style="width:70px!important;" @click="productList()">查 询</el-button>
            <el-button @click="reset_1()" style="width:70px!important;">重 置</el-button></span>
        </div>

        <div style="height: 50px" v-show="Showey == 2" class="input-box">
          <el-input style="width: 155px;margin-right: 10px!important;" @keyup.enter.native="productList()"
                    v-model="searchData1.goodsCode"
                    placeholder="请输入商品编号"></el-input>
          <!--<el-input style="width: 105px;margin-right: 10px!important;" @keyup.enter.native="productList()"-->
          <!--v-model="searchData.barCode"-->
          <!--placeholder="请输入条形码"></el-input>-->
          <el-input style="width: 155px;margin-right: 10px!important;" @keyup.enter.native="productList()"
                    v-model="searchData1.goodsName"
                    placeholder="请输入商品名称"></el-input>
          <!--<el-input style="width: 105px;margin-right: 10px!important;" @keyup.enter.native="productList()"-->
          <!--v-model="searchData1.goodsSpec"-->
          <!--placeholder="请输入商品规格"></el-input>-->
          <span style="float: right">  <el-button type="primary" style="width:70px!important;" @click="productList()">查 询</el-button>
            <el-button @click="reset_1()" style="width:70px!important;">重 置</el-button></span>
        </div>
        <!--条形码列表-->
        <div v-show="Showey == 1">
          <el-table
            :data="tableData1_1"
            tooltip-effect="dark"
            ref="multipleTable"
            @selection-change="handleSelectionChange2"
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
        <!--商品编码列表-->
        <div v-show="Showey == 2">
          <el-table
            :data="tableData1_2"
            tooltip-effect="dark"
            ref="multipleTable"
            @selection-change="handleSelectionChange2"
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
              width="200">
              <template slot-scope="scope">
                <img :src="scope.row.goodsImageBean.imageUrl" alt=""
                     style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                <span>{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="goodsCode"
              width="180"
              label="商品编号">
            </el-table-column>
            <!--<el-table-column-->
            <!--align="center"-->
            <!--prop="barCode"-->
            <!--width="140"-->
            <!--:show-overflow-tooltip="true"-->
            <!--label="条形码">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
            <!--align="center"-->
            <!--prop="specification"-->
            <!--width="56"-->
            <!--:show-overflow-tooltip="true"-->
            <!--label="规格">-->
            <!--</el-table-column>-->
            <el-table-column
              align="center"
              prop="brandName"
              width="120"
              :show-overflow-tooltip="true"
              label="商品品牌">
            </el-table-column>
            <el-table-column
              align="center"
              prop="salesPrice"
              width="100"
              label="售价">
            </el-table-column>
          </el-table>
        </div>
        <div v-show="Showey == 1">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="curPage2"
            :page-sizes="[15, 30, 50, 100, 200]"
            :page-size="pageSize2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum2">
          </el-pagination>
        </div>

        <div v-show="Showey == 2">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="curPage2_1"
            :page-sizes="[15, 30, 50, 100, 200]"
            :page-size="pageSize2_1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum2_1">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取 消</el-button>
          <el-button type="primary" @click="GetgoodsName()">确认选择</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0',
         Uploads:process.env.FILE_API,
        area1: {     //商品销量统计（条形码）
          catalogIds: '', //多个分类id 用英文逗号分隔
          storeIds: '',//多个店铺id用英文隔开
          brandIds: '', //多个品牌id 用英文逗号隔开
          serachType: 1,//查询类型  1：销售数量  2：销售总额
          numsStart: '',//销售总额/数量起始值
          numsEnd: '',//销售总额/数量结束值
          payTimeStart: '',//起始付款时间
          payTimeEnd: '',//结束付款时间
          barCodes: '', //商品条形码 多个用英文逗号分隔
          suitFlag: '', //是否是套装   true/false  不传就是全部
          countSuitGoodsFlag: false,//统计套装内单品
          page: 1,
          Size: 15

        },
        area2: {     //商品销量统计（商品编码）
          catalogIds: '', //多个分类id 用英文逗号分隔
          storeIds: '',//多个店铺id用英文隔开
          brandIds: '', //多个品牌id 用英文逗号隔开
          serachType: 1,//查询类型  1：销售数量  2：销售总额
          numsStart: '',//销售总额/数量起始值
          numsEnd: '',//销售总额/数量结束值
          payTimeStart: '',//起始付款时间
          payTimeEnd: '',//结束付款时间
          goodsCodes: '', //商品编码 多个用英文逗号分隔
          page: 1,
          Size: 15

        },
        area3: {      //品牌销量统计
          startTime: '',
          endTime: '',
          saleType: 0,
          brandId: '', //品牌
          storeId: '', //店铺
          maxQty: '',
          minQty: '',
          page: 1,
          Size: 15
        },
        area4: {    //分类销量统计
          startTime: '',
          endTime: '',
          saleType: 1,
          storeIds: '',
          catalogIds: '',
          startValue: '',
          endValue: '',
          page: 1,
          Size: 15
        },
        area5: {    //店铺销量统计
          storeIds: '',   //店铺
          numsStart: '',//销售总额起始值
          numsEnd: '',//销售总额结束值
          payTimeStart: '',//起始付款时间
          payTimeEnd: '',//结束付款时间
          page: 1,
          Size: 15
        },
        showData: '',//条形码
        showData2: '', //商品编码
        currentData: [],//重置仅改变当前时间
        Showey: 1, //默认显示第一页
        sumData: 0,//总数
        amount: 0, //总额
        sumData2: 0,//总数
        amount2: 0, //总额
        sumData3: 0,//总数
        amount3: 0, //总额
        sumData4: 0,//总数
        amount4: 0, //总额
        sumData5: 0,//总数
        amount5: 0, //总额
        goodsCate: [],//商品分类
        table_h: 0,//表格的高度
        table_h2: 0,
        table_h3: 0,
        table_h4: 0,
        table_h5: 0,
        totalNum: 0, // 数据总条数
        totalNum2: 0, //弹窗条数一 条形码
        totalNum2_1: 0,  //弹窗分页二商品编码
        totalNum5: 0,
        totalNum4: 0,
        totalNum3: 0,
        totalNum1: 0,
        dialogVisible: false, // 查询商品弹框
        tableData1: [],
        tableData2: [],
        tableData3: [],
        tableData4: [],
        tableData5: [],
        tableData1_1: [], //弹窗条形码搜索
        tableData1_2: [],//弹窗商品编码搜索
        //枚举
        manageState: [ // 处理状态
          {value: 0, label: '销售数量'},
          {value: 1, label: '销售总额'},
        ],
        manageState3: [ // 处理状态
          {value: '', label: '全部'},
          {value: false, label: '单品'},
          {value: true, label: '套装', isNo: ''},
        ],
        manageState2: [ // 处理状态
          {value: 1, label: '销售数量'},
          {value: 2, label: '销售总额'},
        ],
        tableData: [],//商品销量统计（条形码)
        applyTime1: [],//商品销量统计（条形码)
        applyTime2: [],//商品销量统计（商品编码)
        applyTime3: [],
        applyTime4: [],
        applyTime5: [],
        shop: [], // 店铺
        brand: [],//品牌
        pageSize: 15,
        curPage: 1,
        pageSize2: 15, //弹窗分页一
        pageSize2_1: 15,//弹窗分页二
        curPage2: 1,  //弹窗分页一
        curPage2_1: 1,  //弹窗分页二
        pageSize1: 15,
        curPage1: 1,
        pageSize3: 15,
        curPage3: 1,
        pageSize4: 15,
        curPage4: 1,
        pageSize5: 15,
        curPage5: 1,
        searchData: {   //弹窗中第一的搜索区
          goodsCode: '',
          barCode: '',
          goodsName: '',
          goodsSpec: '',
          page: 1,
          Size: 15

        },
        searchData1: {  //弹窗中第2个的搜索区
          goodsCode: '',
          barCode: '',
          goodsName: '',
          goodsSpec: '',
          page: 1,
          Size: 15

        },
        replaceData: [],//商品名
      }
    },


    methods: {
//      判断置灰套装枚举
      delopotion() {
        if (this.area1.countSuitGoodsFlag) {
          this.manageState3[2].isNo = 50
        } else {
          this.manageState3[2].isNo = 60
        }
      },
      //查询
      query() {
        if (this.Showey == 1) {
          this.initMessages1();
        } else if (this.Showey == 2) {
          this.initMessages2();
        } else if (this.Showey == 3) {
          this.initMessages3();
        } else if (this.Showey == 4) {
          this.initMessages4();
        } else if (this.Showey == 5) {
          this.initMessages5();

        }

      },
      //重置
      reset() {
        if (this.Showey == 1) {
          this.area1.serachType = 1;
          this.area1.numsStart = '';
          this.area1.numsEnd = '';
          this.area1.suitFlag = '';
          this.area1.barCodes = '';
          this.showData = '';
          this.area1.countSuitGoodsFlag = false;
          $('#example-post1_1').multiselect('dataprovider', this.goodsCate); //分类
          $('#example-post1_2').multiselect('dataprovider', this.brand); // 品牌
          $('#example-post1_3').multiselect('dataprovider', this.shop); //店铺
          this.applyTime1 = this.currentData;

        } else if (this.Showey == 2) {
          this.area2.serachType = 1;
          this.area2.numsStart = '';
          this.area2.numsEnd = '';
          this.area2.goodsCodes = '';
          this.showData2 = '';
          $('#example-post2_1').multiselect('dataprovider', this.goodsCate); //分类
          $('#example-post2_2').multiselect('dataprovider', this.brand); // 品牌
          $('#example-post2_3').multiselect('dataprovider', this.shop); //店铺
          this.applyTime2 = this.currentData;

        } else if (this.Showey == 3) {
          this.area3.maxQty = '';
          this.area3.minQty = '';
          this.area3.saleType = 0;
          $('#example-post3_1').multiselect('dataprovider', this.brand);
          $('#example-post3_2').multiselect('dataprovider', this.shop);
          this.applyTime3 = this.currentData;
        } else if (this.Showey == 4) {
          this.area4.saleType = 1;
          this.area4.startValue = '';
          this.area4.endValue = '';
          this.applyTime4 = this.currentData;
          $('#example-post4_2').multiselect('dataprovider', this.brand);
          $('#example-post4_3').multiselect('dataprovider', this.shop);
        } else if (this.Showey == 5) {
          this.area5.numsStart = '';
          this.area5.numsEnd = '';
          this.applyTime5 = this.currentData;
          $('#example-post5_1').multiselect('dataprovider', this.shop);
        }


      },
      // 弹框重置
      reset_1() {
        if (this.Showey == 1) {
          for (var item in this.searchData) {
            this.searchData[item] = '';

          }
          this.searchData.page = 1
          this.searchData.Size = 15

        } else {
          for (var item in this.searchData1) {
            this.searchData1[item] = '';
          }
          this.searchData1.page = 1
          this.searchData1.Size = 15
        }


      },
      //商品销量统计（条形码）
      initMessages1() {
        if (this.applyTime1 != null) {
          this.area1.payTimeStart = this.applyTime1[0].getTime();
          this.area1.payTimeEnd = this.applyTime1[1].getTime();
        } else {
          this.area1.payTimeStart = '';
          this.area1.payTimeEnd = '';
        }

        this.area1.catalogIds = $('#example-post1_1').val().toString(); //分类
        this.area1.brandIds = $('#example-post1_2').val().toString(); //品牌
        this.area1.storeIds = $('#example-post1_3').val().toString(); //店铺
        if (this.showData != this.area1.barCodes) {
          this.area1.barCodes = this.showData
        }
        this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/getListPageStore_SKU', this.area1)
          .then(res => {
            if (res.data.success) {
              this.tableData = res.data.result.rows;
              this.totalNum = res.data.result.total;
              res.data.result.rows.forEach((item) => {
                this.goodsCate.forEach((val) => {
                  if (item.catalogId == val.catalogId) {
                    item.catalogName = val.label;
                  }
                });
                this.brand.forEach((v) => {
                  if (item.brandId == v.value) {
                    item.brandName = v.label;
                  }
                })

              });


            }
          })
        this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/getTotalStore_SKU', this.area1)
          .then(res => {
            if (res.data.success && res.data.hasOwnProperty('result')) {
              this.amount = res.data.result.salesAtmCount;  //总数
              this.sumData = res.data.result.salesNumsCount;  //总额

            } else {
              this.sumData = 0;
              this.amount = 0;

            }
          })


      },
      //商品销量统计（商品编码）
      initMessages2() {
        if (this.applyTime2 != null) {
          this.area2.payTimeStart = this.applyTime2[0].getTime();
          this.area2.payTimeEnd = this.applyTime2[1].getTime();
        } else {
          this.area2.payTimeStart = '';
          this.area2.payTimeEnd = '';
        }
        this.area2.catalogIds = $('#example-post2_1').val().toString(); //分类
        this.area2.brandIds = $('#example-post2_2').val().toString(); //品牌
        this.area2.storeIds = $('#example-post2_3').val().toString(); //店铺
        if (this.showData2 != this.area2.goodsCodes) {
          this.area2.goodsCodes = this.showData2
        }
        this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/getListPageStore_SPU', this.area2)
          .then(res => {
            if (res.data.success) {
              this.tableData2 = res.data.result.rows;
              this.totalNum1 = res.data.result.total;
              res.data.result.rows.forEach((item) => {
                this.goodsCate.forEach((val) => {
                  if (item.catalogId == val.catalogId) {
                    item.catalogName = val.label;
                  }
                });
                this.brand.forEach((v) => {
                  if (item.brandId == v.value) {
                    item.brandName = v.label;
                  }
                })

              });

            }
          })
        this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/getTotalStore_SPU', this.area2)
          .then(res => {
            if (res.data.success && res.data.hasOwnProperty('result')) {
              this.amount2 = res.data.result.salesAtmCount;  //总数
              this.sumData2 = res.data.result.salesNumsCount;  //总额

            } else {
              this.sumData2 = 0;
              this.amount2 = 0;
            }
          })


      },
      //品牌销量统计
      initMessages3() {
        if (this.applyTime3 != null) {
          this.area3.startTime = this.applyTime3[0].getTime();
          this.area3.endTime = this.applyTime3[1].getTime();
        } else {
          this.area3.startTime = '';
          this.area3.endTime = '';
        }
        this.area3.brandId = $('#example-post3_1').val().toString();
        this.area3.storeId = $('#example-post3_2').val().toString();
        this._post('com.edb01.erp.bis.service.api.BrandService/' + this.version + '/storeBrandQuery', this.area3)
          .then(res => {
            if (res.data.success) {
              this.tableData3 = res.data.result.rows;
              this.totalNum3 = res.data.result.total;
              res.data.result.rows.forEach((item) => {
                this.shop.forEach((val) => {
                  if (item.storeId == val.value) {
                    item.storeName = val.label;
                  }
                });
                this.brand.forEach((v) => {
                  if (item.brandId == v.value) {
                    item.brandName = v.label;
                  }
                })
              });


              if (this.tableData3.length > 0 && (this.tableData3[0].totalQty != '' && this.tableData3[0].totalAmt != '')) {
                this.sumData3 = this.tableData3[0].totalQty;
                this.amount3 = this.tableData3[0].totalAmt;
              } else {
                this.sumData3 = 0;
                this.amount3 = 0;
              }

            }
          })


      },
      //分类销量统计
      initMessages4() {
        if (this.applyTime4 != null) {
          this.area4.startTime = this.applyTime4[0].getTime();
          this.area4.endTime = this.applyTime4[1].getTime();
        } else {
          this.area4.startTime = '';
          this.area4.endTime = '';
        }
        this.area4.catalogIds = $('#example-post4_2').val().toString();
        this.area4.storeIds = $('#example-post4_3').val().toString();
        this._post('com.edb01.erp.bis.service.api.CatalogService/' + this.version + '/storeCatalogQuery', this.area4)
          .then(res => {
            if (res.data.success) {
              this.tableData4 = res.data.result.rows;
              this.totalNum4 = res.data.result.total;
              res.data.result.rows.forEach((item) => {
                this.goodsCate.forEach((val) => {
                  if (item.catalogId == val.catalogId) {
                    item.catalogName = val.label;
                  }
                });

              });

            }
          });
        this._post('com.edb01.erp.bis.service.api.CatalogService/' + this.version + '/queryTotal', this.area4)
          .then(res => {
            if (res.data.success) {
              this.sumData4 = res.data.result.saleNumTotal;
              this.amount4 = res.data.result.saleAmtTotal;

            } else {
              this.sumData4 = 0;
              this.amount4 = 0;

            }
          })


      },
      //店铺销量统计
      initMessages5() {
        if (this.applyTime5 != null) {
          this.area5.payTimeStart = this.applyTime5[0].getTime();
          this.area5.payTimeEnd = this.applyTime5[1].getTime();
        } else {
          this.area5.payTimeEnd = '';
          this.area5.payTimeStart = '';
        }
        this.area5.storeIds = $('#example-post5_1').val().toString();
        this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/getlistWithStore', this.area5)
          .then(res => {
            if (res.data.success) {
              this.tableData5 = res.data.result.rows;
              this.totalNum5 = res.data.result.total;
              res.data.result.rows.forEach((item) => {
                this.shop.forEach((val) => {
                  if (item.storeId == val.value) {
                    item.storeName = val.label;
                  }
                });
                let str = ''
                let number = ''
                str = item.salesAtmTotal / item.orderNums
                number = String(str).replace(/^(.*\..{4}).*$/, "$1");
                item.guestprice = Number(number);


              });



            }
          })
        this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/getNumsAndAtmCount', this.area5)
          .then(res => {
            if (res.data.success && res.data.hasOwnProperty('result')) {
              this.sumData5 = res.data.result.salesNumsCount;
              this.amount5 = res.data.result.salesAtmCount;

            } else {
              this.sumData5 = 0;
              this.amount5 = 0;

            }
          })


      },
      //商品列表关闭清空
      handleClose() {
        this.searchData.goodsCode = '';
        this.searchData.barCode = '';
        this.searchData.goodsName = '';
        this.searchData.goodsSpec = '';
        this.searchData1.goodsCode = '';
        this.searchData1.barCode = '';
        this.searchData1.goodsName = '';
        this.searchData1.goodsSpec = '';
        this.$refs.multipleTable.clearSelection();
        this.dialogVisible = false;
      },
      //取商品名
      handleSelectionChange2(val) {
        this.replaceData = val
      },
//      tab切换
      handleSelect(val) {
        this.Showey = val;
        if (val == 1) {
          this.$nextTick(() => {
            this.table_h = $(window).height() - $('#fitTable').offset().top - 70;

          });
          window.onresize = () => {
            this.table_h1 = $(window).height() - $('#fitTable').offset().top - 80;
          };

        } else if (val == 2) {
          this.$nextTick(() => {
            this.table_h2 = $(window).height() - $('#fitTable2').offset().top - 70;

          });
          window.onresize = () => {
            this.table_h2 = $(window).height() - $('#fitTable2').offset().top - 80;
          };
        } else if (val == 3) {
          this.$nextTick(() => {
            this.table_h3 = $(window).height() - $('#fitTable3').offset().top - 70;

          });
          window.onresize = () => {
            this.table_h3 = $(window).height() - $('#fitTable3').offset().top - 80;
          };
        } else if (val == 4) {
          this.$nextTick(() => {
            this.table_h4 = $(window).height() - $('#fitTable4').offset().top - 70;

          });
          window.onresize = () => {
            this.table_h4 = $(window).height() - $('#fitTable4').offset().top - 80;
          };
        } else if (val == 5) {
          this.$nextTick(() => {
            this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 70;

          });
          window.onresize = () => {
            this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 80;
          };
        }

      },

      //把商品名放入输入框
      GetgoodsName() {
        if (this.replaceData.length == 0) {
          this.$message({
            message: '请选择商品',// 如果code为其他，弹出错误码
            type: 'warning'
          })
          return false
        }
        let str = '';
        let str2 = '';
        this.replaceData.forEach((item) => {
          str += item.barCode + ',';
          str2 += item.goodsCode + ',';

        })

        if (this.Showey == 1) {
          this.area1.barCodes = str.slice(0, -1);
          if (str.length >= 15) {
            this.showData = str.slice(0, 15) + '...';
          } else {
            this.showData = str.slice(0, -1);
          }

        } else if (this.Showey == 2) {
          this.area2.goodsCodes = str2.slice(0, -1)

          if (str.length >= 15) {
            this.showData2 = str2.slice(0, 15) + '...';
          } else {
            this.showData2 = str2.slice(0, -1);
          }
        }

        this.handleClose();
      },
      //查询商品列表
      productList() {
        if (this.Showey == 1) {
          this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryForHandWave', this.searchData)
            .then(res => {
              if (res.data.success) {
                this.tableData1_1 = res.data.result.rows
                this.totalNum2 = res.data.result.total
                if (this.tableData1_1.length > 0) {
                  res.data.result.rows.forEach((item) => {
                    item.imageUrl = item.goodsImageBean.imageUrl
                  })
                }


              }
            })

        } else {
          this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryForHandWave', this.searchData1)
            .then(res => {
              if (res.data.success) {

                this.tableData1_2 = res.data.result.rows
                this.totalNum2_1 = res.data.result.total
                if (this.tableData1_2.length > 0) {
                  res.data.result.rows.forEach((item) => {
                    item.imageUrl = item.goodsImageBean.imageUrl
                  })
                }

              }
            })

        }

      },
      //导出
      exportData() {
        if (this.Showey == 1) {
          if (this.applyTime1 != null) {
            this.area1.payTimeStart = this.applyTime1[0].getTime();
            this.area1.payTimeEnd = this.applyTime1[1].getTime();
          } else {
            this.area1.payTimeStart = '';
            this.area1.payTimeEnd = '';
          }
          this.area1.catalogIds = $('#example-post1_1').val().toString(); //分类
          this.area1.brandIds = $('#example-post1_2').val().toString(); //品牌
          this.area1.storeIds = $('#example-post1_3').val().toString(); //店铺
          if (this.showData != this.area1.barCodes) {
            this.area1.barCodes = this.showData
          }
          this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/storeSKUQueryExportExcel', this.area1).then((res) => {
            if (res.data.success) {
              location.href = 'http://'+this.Uploads+'/files-web/download/' + res.data.result
            } else {
              this.$message({
                message: res.data.msg,// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          });
        } else if (this.Showey == 2) {
          if (this.applyTime2 != null) {
            this.area2.payTimeStart = this.applyTime2[0].getTime();
            this.area2.payTimeEnd = this.applyTime2[1].getTime();
          } else {
            this.area2.payTimeStart = '';
            this.area2.payTimeEnd = '';
          }
          this.area2.catalogIds = $('#example-post2_1').val().toString(); //分类
          this.area2.brandIds = $('#example-post2_2').val().toString(); //品牌
          this.area2.storeIds = $('#example-post2_3').val().toString(); //店铺
          if (this.showData2 != this.area2.goodsCodes) {
            this.area2.goodsCodes = this.showData2
          }
          this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/storeSPUQueryExportExcel', this.area2).then((res) => {
            if (res.data.success) {
              location.href = 'http://'+this.Uploads+'/files-web/download/' + res.data.result
            } else {
              this.$message({
                message: res.data.msg,// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          });
        } else if (this.Showey == 3) {
          if (this.applyTime3 != null) {
            this.area3.startTime = this.applyTime3[0].getTime();
            this.area3.endTime = this.applyTime3[1].getTime();
          } else {
            this.area3.startTime = '';
            this.area3.endTime = '';
          }
          this.area3.brandId = $('#example-post3_1').val().toString();
          this.area3.storeId = $('#example-post3_2').val().toString();
          this._post('com.edb01.erp.bis.service.api.BrandService/' + this.version + '/storeBrandQueryExportExcel', this.area3).then((res) => {
            if (res.data.success) {
              location.href = 'http://'+this.Uploads+'/files-web/download/' + res.data.result
            } else {
              this.$message({
                message: res.data.msg,// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }

          });
        } else if (this.Showey == 4) {
          if (this.applyTime4 != null) {
            this.area4.startTime = this.applyTime4[0].getTime();
            this.area4.endTime = this.applyTime4[1].getTime();
          } else {
            this.area4.startTime = '';
            this.area4.endTime = '';
          }
          this.area4.catalogIds = $('#example-post4_2').val().toString();
          this.area4.storeIds = $('#example-post4_3').val().toString();

          this._post('com.edb01.erp.bis.service.api.CatalogService/' + this.version + '/storeCatalogQueryExportExcel', this.area4).then((res) => {
            if (res.data.success) {
              location.href = 'http://'+this.Uploads+'/files-web/download/' + res.data.result
            } else {
              this.$message({
                message: res.data.msg,// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }

          });


        } else if (this.Showey == 5) {
          if (this.applyTime5 != null) {
            this.area5.payTimeStart = this.applyTime5[0].getTime();
            this.area5.payTimeEnd = this.applyTime5[1].getTime();
          } else {
            this.area5.payTimeEnd = '';
            this.area5.payTimeStart = '';
          }
          this.area5.storeIds = $('#example-post5_1').val().toString();

          this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/reportStoreExcel', this.area5).then((res) => {
            if (res.data.success) {
              location.href = 'http://'+this.Uploads+'/files-web/download/' + res.data.result
            } else {
              this.$message({
                message: res.data.msg,// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }

          });

        }


      },
//    弹窗分页
      handleSizeChange2(val) {
        if (this.Showey == 1) {
          this.pageSize2 = val;
          this.searchData.Size = val;
          this.productList();

        } else if (this.Showey == 2) {
          this.pageSize2_1 = val;
          this.searchData1.Size = val;
          this.productList();
        }

      },

      handleCurrentChange2(val) {
        if (this.Showey == 1) {
          this.curPage2 = val;
          this.searchData.page = val
          this.productList()
        } else if (this.Showey == 2) {
          this.curPage2_1 = val;
          this.searchData1.page = val
          this.productList()

        }


      },

      handleSizeChange(val) {
        if (this.Showey == 1) {
          this.pageSize = val
          this.area1.Size = val;
          this.initMessages1();
        } else if (this.Showey == 2) {
          this.pageSize1 = val
          this.area2.Size = val;
          this.initMessages2();
        } else if (this.Showey == 3) {
          this.pageSize3 = val
          this.area3.Size = val;
          this.initMessages3();
        } else if (this.Showey == 4) {
          this.pageSize4 = val
          this.area4.Size = val;
          this.initMessages4();
        } else if (this.Showey == 5) {
          this.pageSize5 = val
          this.area5.Size = val;
          this.initMessages5();
        }

      },
      //  当前页
      handleCurrentChange(val) {
        if (this.Showey == 1) {
          this.area1.page = val;
          this.curPage = val;
          this.initMessages1()

        } else if (this.Showey == 2) {
          this.area2.page = val;
          this.curPage1 = val;
          this.initMessages2()

        } else if (this.Showey == 3) {
          this.area3.page = val;
          this.curPage3 = val;
          this.initMessages3()

        } else if (this.Showey == 4) {
          this.area4.page = val;
          this.curPage4 = val;
          this.initMessages4()


        } else if (this.Showey == 5) {
          this.area5.page = val;
          this.curPage5 = val;
          this.initMessages5()

        }


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
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        const start = new Date(year, month, strDate - 7, 0, 0);

        this.currentData = [start, end];
        this.applyTime1 = [start, end];
        this.applyTime2 = [start, end];
        this.applyTime3 = [start, end];
        this.applyTime4 = [start, end];
        this.applyTime5 = [start, end];


      },
      //商品
      shopData() {   // 商户有权限的店铺
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/listOauth')
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
              $('.Showey3').multiselect('dataprovider', this.shop);
              $('.Showey3').multiselect('select', value);

            }
          });

      },
//       品牌
      brandData() {   // 品牌
        this._post('com.edb01.erp.mdata.service.api.BrandService/' + this.version + '/list')
          .then(res => {
            if (res.data.success == true) {
              this.brand = res.data.result;
              var value = [];
              for (var item of this.brand) {
                item.value = item.brandId;
                item.label = item.brandName;
                value.push(item.brandId)
              }
              //console.log(self.plat);

              $('.Showey2').multiselect('dataprovider', this.brand);
              $('.Showey2').multiselect('select', value);

            }
          });

      },
//  分类
      cateData() {  // 商品分类
        this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/listTail')
          .then(res => {
            if (res.data.success == true) {
              this.goodsCate = res.data.result;
              var value = [];
              for (var item of this.goodsCate) {
                item.value = item.catalogId;
                item.label = item.catalogName;
                value.push(item.catalogId)
              }
              //console.log(self.plat);

              $('.Showey1').multiselect('dataprovider', this.goodsCate);
              $('.Showey1').multiselect('select', value);

            }
          });


      }


    },

    mounted() {
      this.shopData();
      this.brandData();
      this.cateData();
      //默认近7天
      this.sevenTime();
      this.$nextTick(() => {
        this.table_h = $(window).height() - $('#fitTable').offset().top - 70;

      });
      window.onresize = () => {
        this.table_h1 = $(window).height() - $('#fitTable').offset().top - 80;
      };
//      setTimeout(()=>{
//        if(this.goodsCate.length>0 && this.brand.length>0 && this.shop.length>0){
//          this.initMessages1()
//        }
//      },600)

      $('.example-post').multiselect({ // 商品分类多选的样式
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
  .topClass {
    background: #F0F1F5;
    margin-top: -10px;
  }

  .colorTitle {
    color: #1871F0;
  }

  #Salestatistics .dot { /*商品里的...号*/
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

  #Salestatistics .searchBox {
    position: relative;
  }

  #Salestatistics .error { /*商品里的X号*/
    position: relative;
    left: -45px;
    top: 2px;
    font-weight: bold;
    cursor: pointer;
    color: #979797;
  }

</style>
<style>
  #Salestatistics .btn-group > .btn:first-child {
    width: 200px;
    height: 28px;
    text-align: left;
    line-height: 15px;
    border: 1px solid #d8dce5;
  }

  #Salestatistics .input-box .el-input__inner {
    padding: 0 5px !important;
    font-size: 12px !important;
  }

  #Salestatistics .grid-content .spanText {
    font-weight: bold;
    font-size: 14px;

  }

  @media screen and (max-width: 1679px) {
    #Salestatistics #smallBtn .el-button--primary {
      width: 60px !important;
      padding-right: 42px !important;
      box-sizing: border-box !important;
    }

    #Salestatistics #smallBtn .el-button--default {
      width: 60px !important;
      padding-right: 42px !important;
    }
  }

  #Salestatistics .pop-w .el-dialog__header {
    height: 40px !important;
    padding: 10px 20px 10px;
  }

  #Salestatistics #shop-box .el-input__inner {
    padding: 0 46px 0 15px !important;
  }

  #Salestatistics #shop-box1 .el-input__inner {
    padding: 0 46px 0 15px !important;
  }

  #Salestatistics #shop-box2 .el-input__inner {
    padding: 0 46px 0 15px !important;
  }

  #Salestatistics #shop-box3 .el-input__inner {
    padding: 0 46px 0 15px !important;
  }

  #Salestatistics #shop-box4 .el-input__inner {
    padding: 0 46px 0 15px !important;
  }

  #Salestatistics .pop-w .el-input__inner {
    padding-left: 0px !important;
  }

  #Salestatistics .el-dialog__body {
    padding: 10px 20px !important;
  }

  #Salestatistics .open > .dropdown-menu {
    width: 200px;
  }

  #Salestatistics .el-date-editor .el-range-input, .el-date-editor .el-range-separator {
    font-size: 12px;
  }

  #Salestatistics .el-range-editor.el-input__inner {
    padding: 3px 2px;
    padding-left: 0;

  }

  #Salestatistics .el-menu-demo {
    margin: -20px -20px 0;
    min-width: 1366px;
  }

  #Salestatistics .el-menu-item {
    margin-right: 80px;
    /*height: 100px;*/
  }

  #Salestatistics .el-menu-item {
    background-color: black;
  }
</style>
