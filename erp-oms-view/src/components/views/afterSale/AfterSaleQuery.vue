<!--售后单查询 佩玖-->
<template>
  <div>
    <div id="AfterSaleQuery" v-show="paramsObj.mainPageShow">
      <div id="searchBox" class="searchBox">
        <div class="query-button" style="margin-left: -30px"><!--查询区-->
          <div class="grid-content" style="white-space: nowrap;">
            <label for="example-post">店铺</label>
            <select id="example-post" name="multiselect[]" multiple="multiple">
              <option v-for="item in shop" :value="item.value">{{item.label}}</option>
            </select>
          </div>
          <div class="grid-content" style="margin-left: 20px">
            <el-select style="width: 100px!important;" v-model="receiveType" clearable placeholder="请选择">
              <el-option
                v-for="item in custom"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input style="width: 200px!important;" v-model="receiveInfo" @keyup.enter.native="initMessages()"
                      placeholder="请输入内容"></el-input>
          </div>
          <div class="grid-content">
            <label>单据来源</label>
            <el-select style="width: 200px!important;" v-model="source" clearable placeholder="请选择">
              <el-option
                v-for="item in bills"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content">
            <label>处理状态</label>
            <el-select style="width: 200px!important;" v-model="dealStatus" placeholder="请选择">
              <el-option
                v-for="item in manageState"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content" id="shop-box">
            <label>商品</label>
            <el-input style="width: 200px!important;" v-model="goodsIds"></el-input>
            <i class="el-icon-close error" @click="goodsIds='';goodsIds2=''"></i> <!--X-->
            <span class="dot" @click="dialogVisible=true;;productList()">...</span><!--...-->
          </div>
          <div class="grid-content" style="margin-right:35px">
            <label>售后类型</label>
            <el-select style="width: 200px!important;" v-model="afterSaleType" clearable placeholder="请选择">
              <el-option
                v-for="item in afterType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content">
            <label>退换补状态</label>
            <el-select style="width: 200px!important;" v-model="returnGoodsStatus" clearable placeholder="请选择">
              <el-option
                v-for="item in returns"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content">
            <label>退款状态</label>
            <el-select style="width: 200px!important;" v-model="refundStatus" clearable placeholder="请选择">
              <el-option
                v-for="item in returMany"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content">
            <label>平台发货状态</label>
            <el-select style="width: 200px!important;" v-model="ecSendStatus" clearable placeholder="请选择">
              <el-option
                v-for="item in returMany2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content">
            <label>申请时间</label>
            <el-date-picker
              style="width: 290px"
              v-model="applyTime"
              type="datetimerange"
              range-separator="-"
              format="yyyy/MM/dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <span class="button-span" :class="{ span1: isActive1 }" @click="nowTime">今天</span>
            <span class="button-span" :class="{ span1: isActive2 }" @click="sevenTime">近7天</span>
            <span class="button-span" :class="{ span1: isActive3 }" @click="thirtyTime">近30天</span>
          </div>
        </div>
        <div class="rightBox3">
          <el-button type="primary" @click="initMessages()">查 询</el-button>
          <el-button @click="reset()">重 置</el-button>
        </div>
      </div>
      <div style="clear:both"></div>
      <div class="ledgement"></div>
      <div class="col-nav" style="margin:-10px 0 10px;">
        <ul>
          <li @click="exportData()" v-if="authorityCode.OMS_AFTERSALEQRY_EXPORTDATA" v-once><span>导出</span></li>
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
              tooltip-effect="dark"
              :default-sort="{prop: 'applyTimeshow', order: 'descending'}"
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
                label="售后单号"
                width="150">
                <template slot-scope="scope">
                  <el-button @click="handlenumbers(scope.row)" type="text" size="small">{{scope.row.afterSalesNo}}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="outAfterSalesNo"
                align="center"
                :show-overflow-tooltip="true"
                width="150"
                label="外部售后单号">
              </el-table-column>

              <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                width="150"
                label="平台单号">
                <template slot-scope="scope">
                  <span v-if="scope.row.replaceSourceOrderNo"> {{scope.row.replaceSourceOrderNo}}</span>
                  <span v-else> {{scope.row.sourceOrderNo}}</span>
                </template>
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
                prop="buyerNick"
                align="center"
                :show-overflow-tooltip="true"
                label="买家ID"
                width="120">
              </el-table-column>
              <el-table-column
                prop="receiver"
                :show-overflow-tooltip="true"
                align="center"
                label="寄件人"
                width="120">
              </el-table-column>
              <el-table-column
                prop="mobile"
                align="center"
                label="寄件人手机"
                width="160">
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                label="退回快递公司"
                width="120">
                <template slot-scope="scope">
                  <span class="cen-g"  v-if="scope.row.asType == 4">-</span>
                  <span class="cen-g" v-else>{{scope.row.expressCoName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="left"
                :show-overflow-tooltip="true"
                label="退回快递单号"
                width="120">
                <template slot-scope="scope">
                  <span class="cen-g"  v-if="scope.row.asType == 4">-</span>
                  <span class="cen-g" v-else>{{scope.row.returnExpressNos}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="平台发货状态"
                width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.ecSendStatus == 1">未发货</span>
                  &lt;!&ndash;<span v-if="scope.row.ecSendStatus == 2">部分发货</span>&ndash;&gt;
                  <span v-if="scope.row.ecSendStatus == 3">已发货</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="处理状态"
                width="120">
                <template slot-scope="scope">
                  <p class="cen-g" v-show="scope.row.dealStatus==1">未处理</p>
                  <p class="cen-g" v-show="scope.row.dealStatus==2">处理中</p>
                  <p class="cen-g" v-show="scope.row.dealStatus==3">已完成</p>
                  <p class="cen-g" v-show="scope.row.dealStatus==4">已作废</p>
                  <p class="cen-g" v-show="scope.row.dealStatus==5">已终结</p>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="申请时间"
                sortable
                prop="applyTimeshow"
                width="150">
              </el-table-column>
              <el-table-column
                label="退款总金额"
                align="center"
                sortable
                width="120">
                <template slot-scope="scope">
                  <span class="cen-g"  v-if="scope.row.asType == 4">-</span>
                  <span class="cen-g" v-else>{{scope.row.totalRefundAmt}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="申请退款金额"
                sortable
                align="center"
                width="120">
                <template slot-scope="scope">
                  <span class="cen-g"  v-if="scope.row.asType == 4 || scope.row.asType == 3">-</span>
                  <span class="cen-g" v-else>{{scope.row.applyRefundAmt}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="额外退款金额"
                align="center"
                sortable
                width="120">
                <template slot-scope="scope">
                  <span class="cen-g"  v-if="scope.row.asType == 4">-</span>
                  <span class="cen-g" v-else>{{scope.row.otherRefundAmt}}</span>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="factRefundAmt"
                align="center"
                label="实际退款金额"
                width="120">
              </el-table-column>
            </el-table>
          </template>-->

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
          :current-page="curPage"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
      <!--查询商品弹框-->
      <div id="pop-w">
        <el-dialog
          title="请选择所查询商品"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          width="730px"
        >
          <div style="height: 50px" id="input-box">
            <el-input style="width: 100px!important;margin-right: 10px;" @keyup.enter.native="productList()"
                      v-model="goodsCode"
                      placeholder="请输入商品编号"></el-input>
            <el-input style="width: 100px!important;margin-right: 10px;" @keyup.enter.native="productList()"
                      v-model="barCode"
                      placeholder="请输入条形码"></el-input>
            <el-input style="width: 100px!important;margin-right: 10px;" @keyup.enter.native="productList()"
                      v-model="goodsName"
                      placeholder="请输入商品名称"></el-input>
            <el-input style="width: 100px!important;margin-right: 10px;" @keyup.enter.native="productList()"
                      v-model="goodsSpec"
                      placeholder="请输入商品规格"></el-input>
            <span style="float: right">  <el-button type="primary" style="width:70px!important;" @click="productList()">查 询</el-button>
            <el-button @click="reset2()" style="width:70px!important;">重 置</el-button></span>
          </div>

          <div>
            <el-table
              :data="tableData1"
              tooltip-effect="dark"
              border
              :height="570"
              ref="multipleTable"
              @selection-change="handleSelectionChange2"
              style="width: 100%">
              <el-table-column
                label="序号"
                width="45"
                type="index"
                align="center">
              </el-table-column>

              <el-table-column
                align='center'
                fixed="left"
                type="selection"
                width="50">
              </el-table-column>

              <el-table-column
                align='left'
                prop="date"
                :show-overflow-tooltip="true"
                label="商品"
                width="180">
                <template slot-scope="scope">
                  <img :src="scope.row.goodsImageBean.imageUrl" alt=""
                       style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">
                  <span>{{scope.row.goodsName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align='center'
                prop="goodsCode"
                :show-overflow-tooltip="true"
                label="商品编号"
                width="120">
              </el-table-column>
              <el-table-column
                align='center'
                prop="barCode"
                :show-overflow-tooltip="true"
                label="条形码"
                width="110">
              </el-table-column>
              <el-table-column
                align='center'
                :show-overflow-tooltip="true"
                prop="specification"
                label="规格"
                width="50">
              </el-table-column>
              <el-table-column
                align='center'
                :show-overflow-tooltip="true"
                prop="brandName"
                label="商品品牌"
                width="80">
              </el-table-column>
              <el-table-column
                align='center'
                :show-overflow-tooltip="true"
                prop="salesPrice"
                label="售价"
                width="80">
              </el-table-column>
            </el-table>
          </div>
          <div>
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
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="GetgoodsName()">确认选择</el-button>
          </div>
        </el-dialog>
      </div>

    </div>
    <!--添加售后单-->
    <AftetSlateDetails v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 1"
                       :params="paramsObj" @changeShow="changeShow" :orderId="orderId"
                       :asTypes="asTypes"></AftetSlateDetails>
  </div>
</template>
<script>
  import AftetSlateDetails from '@/components/views/afterSale/children/AftetSlateDetails.vue';
  import {turnTimestamp} from '@/assets/js/validate.js'
  import {AgGridVue} from "ag-grid-vue";

  export default {
    components: {
      AftetSlateDetails,
      'ag-grid-vue': AgGridVue,
      orderCodeRender: {
        template: '<div><el-button @click="handlenumbers(params.data)" type="text" size="small">{{params.data.afterSalesNo}}</el-button></div>',
        methods: {
          //售后单详情跳转
          handlenumbers(row) {
            let _this = this.params.context

            if(row.asType == '退货退款'){
              _this.asTypes = 1
            }else if(row.asType == '仅退款'){
              _this.asTypes = 2
            }else if(row.asType == '换货'){
              _this.asTypes = 3
            }else if(row.asType == '补发'){
              _this.asTypes  = 4
            }

            _this.orderId = row.afterSalesNo;
            _this.paramsObj = {childrenShow: 1, mainPageShow: false}
            //给子级传参并显示子级
          },
        },


      },

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
        version: '1.0.0',
        publicLogData: [],//日志
        orderId: '', // 详情单的id
        table_h: 0,//表格的高度
        totalNum: 0, // 数据总条数
        totalNum2: 0,
        dialogVisible: false, // 查询商品弹框
        tableData1: [],//选择商品列表
        paramsObj: {
          mainPageShow: true
        },//子级传参
        //枚举
        afterType: [ // 售后类型
          {value: '', label: '全部'},
          {value: 1, label: '退货退款'},
          {value: 2, label: '仅退款'},
          {value: 3, label: '换货'},
          {value: 4, label: '补发'},

        ],
        manageState: [ // 处理状态
          {value: '', label: '全部'},
          {value: 1, label: '未处理'},
          {value: 2, label: '处理中'},
          {value: 3, label: '已完成'},
          {value: 4, label: '已作废'},
          {value: 5, label: '已终结'},

        ],
        returns: [ // 退换补状态
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
          {value: 11, label: '同意补发'},

        ],
        returMany: [ // 退款状态
          {value: '', label: '全部'},
          {value: 1, label: '未退款'},
          {value: 2, label: '拒绝退款'},
          {value: 3, label: '退款成功'},
          {value: 4, label: '取消退款'}
        ],
        returMany2: [ // 发货状态
          {value: '', label: '全部'},
          {value: 1, label: '未发货'},
//          {value: 2, label: '部分发货'},
          {value: 3, label: '已发货'},
        ],
        bills: [ // 单据来源
          {value: '', label: '全部'},
          {value: 1, label: '线上下载'},
          {value: 2, label: '手工下单'},
        ],
        //自定义查询条件
        custom: [ // 处理状态
          {value: 1, label: '手机号'},
          {value: 2, label: '售后单号'},
          {value: 3, label: '快递单号'},
          {value: 4, label: '平台单号'},
          {value: 5, label: '买家ID'},
          {value: 6, label: '收货人'},
          {value: 7, label: '订单号'}
        ],
        authorityCode: sessionStorage.getItem('authorityCode') ? JSON.parse(sessionStorage.getItem('authorityCode')) : {},//权限
        tableData: [], //住列表
        applyTime: [], //时间
        isActive1: false, //今天
        isActive2: true, //近7天
        isActive3: false, //近30天
        shop: [], // 店铺
        otherRefundMsg: '',//额外退款说明
        returnGoodsStatus: '',//退货状态
        refundStatus: '',//退款状态
        ecSendStatus: '',//发货状态
        afterSaleType: '', //售后类型
        source: '',//单据来源
        dealStatus: '',//处理状态
        receiveType: 4, //收货人信息类型ID 1.手机号.2.售后单号.3.快递单号.4平台单号.5.买家ID.6.收货人.7订单号
        receiveInfo: '',//收货人信息对应的值
        goodsIds: '', //支持选择多条商品
        asType: '', //售后类型
        asTypes: '', //解决子页面标签切换延迟
        goodsIds2: '', //展示与传参区分
        pageSize: 15,
        curPage: 1,
        pageSize2: 15,
        curPage2: 1,
        totalNum: 0,
        totalNum2: 0,
        goodsCode: '',// 商品编码
        barCode: '', //条形码
        goodsName: '', //商品名
        goodsSpec: '', //规格
        replaceData: [],//商品名

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


        {headerName: '售后单号', field: 'afterSalesNo', width: 150, cellRendererFramework: "orderCodeRender"},
        {headerName: '外部售后单号', field: 'outAfterSalesNo', width: 150,},
        {headerName: '售后类型', field: 'asType', width: 90},
        {headerName: '处理状态', field: 'dealStatus', width: 90},
        {headerName: '退款状态', field: 'refundStatus', width: 90,},
        {headerName: '平台发货状态', field: 'ecSendStatus', width: 120},
        {headerName: '退款总金额', field: 'totalRefundAmt', width: 100},
        {headerName: '额外退款金额', field: 'otherRefundAmt', width: 120},
        {headerName: '申请退款金额', field: 'applyRefundAmt', width: 120},
        {headerName: '实际退款金额', field: 'factRefundAmt', width: 120},
        {headerName: '申请时间', field: 'applyTimeshow', width: 180},
        {headerName: '买家ID', field: 'buyerNick', width: 180},
        {headerName: '退回快递公司', field: 'expressCoName', width: 120},
        {headerName: '退回快递单号', field: 'returnExpressNos', width: 180},
        {headerName: '平台单号', field: 'replaceSourceOrderNo', width: 180},
        {headerName: '单据来源', field: 'sourceOrderType', width: 180},

      ];


    },

    methods: {
      study(){


      },
      //保存表格设置
      saveTableSet() {
        var setColumnState = JSON.stringify(this.gridOptions.columnApi.getColumnState());
        sessionStorage.setItem("columnStateAfterquer", setColumnState);
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
      },
      //初始化
      onGridReady(params) {
        if (sessionStorage.getItem("columnStateAfterquer")) {
          var getColumnState = JSON.parse(sessionStorage.getItem("columnStateAfterquer"));
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
      //数据初始化
      initMessages() {
        let timeStart = '';
        let timeEnd = '';
        if (this.applyTime != null) {
          timeStart = this.applyTime[0].getTime();
          timeEnd = this.applyTime[1].getTime()
        }
        let data = {
          timeStart: timeStart,
          timeEnd: timeEnd,
          storeIds: $('#example-post').val().toString(),
          refundStatus: this.refundStatus,
          ecSendStatus: this.ecSendStatus,
          returnGoodsStatus: this.returnGoodsStatus,
          afterSaleType: this.afterSaleType,
          source: this.source,
          dealStatus: this.dealStatus,
          receiveType: this.receiveType,
          receiveInfo: this.receiveInfo,
          barCodes: this.goodsIds,
          page: this.curPage,
          Size: this.pageSize
        }
        this._post('com.edb01.erp.ass.service.api.AfterSaleSearchService/' + this.version + '/getAfterSaleSearchList', data)
          .then(res => {
            if (res.data.success) {
              res.data.result.rows.forEach((item) => {
                item.applyTimeshow = turnTimestamp(item.applyTime)

              })
              this.tableData = res.data.result.rows
              this.totalNum = res.data.result.total
              this.tableData.forEach((item, index) => {
                item.index = index + 1
                item.asType1 = item.asType;
                item.dealStatus1 = item.dealStatus;
                item.refundStatus1 = item.refundStatus;
                item.ecSendStatus1 = item.ecSendStatus;
                item.sourceOrderType1 = item.sourceOrderType;
                item.asType1 = item.asType;
                if (item.asType == 1) {
                  item.asType = '退货退款'
                } else if (item.asType == 2) {
                  item.asType = '仅退款'
                } else if (item.asType == 3) {
                  item.asType = '换货'
                } else if (item.asType == 4) {
                  item.asType = '补发'
                }

                if (item.dealStatus == 1) {
                  item.dealStatus = '未处理'
                } else if (item.dealStatus == 2) {
                  item.dealStatus = '处理中'
                } else if (item.dealStatus == 3) {
                  item.dealStatus = '已完成'
                } else if (item.dealStatus == 4) {
                  item.dealStatus = '已作废'
                } else if (item.dealStatus == 5) {
                  item.dealStatus = '已终结'
                }

                if (item.refundStatus == 1) {
                  item.refundStatus = '未退款'
                } else if (item.refundStatus == 2) {
                  item.refundStatus = '拒绝退款'
                } else if (item.refundStatus == 3) {
                  item.refundStatus = '退款成功'
                } else if (item.refundStatus == 4) {
                  item.refundStatus = '取消退款'
                }

                if (item.ecSendStatus == 1) {
                  item.ecSendStatus = '未发货'
                } else if (item.ecSendStatus == 3) {
                  item.ecSendStatus = '已发货'
                }


                if (item.asType1 == 4) {
                  item.totalRefundAmt = '-'
                } else {
                  item.totalRefundAmt = item.totalRefundAmt
                }

                if (item.asType1 == 4) {
                  item.otherRefundAmt = '-'
                } else {
                  item.otherRefundAmt = item.otherRefundAmt
                }

                if (item.asType1 == 4 || item.asType1 == 3) {
                  item.applyRefundAmt = '-'
                } else {
                  item.applyRefundAmt = item.applyRefundAmt
                }

                if (item.asType1 == 4) {
                  item.otherRefundReasonName = '-'
                } else {
                  item.otherRefundReasonName = item.otherRefundReasonName
                }

                if (item.sourceOrderType == 1) {
                  item.sourceOrderType = '线上下载'
                } else if (item.sourceOrderType == 2) {
                  item.sourceOrderType = '手工下单'
                }


                if (item.asType1 == 4) {
                  item.expressCoName = '-';
                } else {
                  item.expressCoName = item.expressCoName && item.expressCoName !== 'undefined'?item.expressCoName:'';
                }


                if(item.asType1 == 4){
                  item.returnExpressNos = '-'
                }else {
                  item.returnExpressNos = item.returnExpressNos
                }

                if (item.replaceSourceOrderNo) {
                  item.replaceSourceOrderNo = item.replaceSourceOrderNo
                } else {
                  item.replaceSourceOrderNo = item.sourceOrderNo
                }


              })


            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning',
              })

            }
          })


      },
      //子级传参通知父级刷新表格数据
      changeShow(val) {
        if (val.childrenShow == 3) {
          this.paramsObj.mainPageShow = true;
        }

      },
//      重置
      reset2() {
        this.goodsCode = '';
        this.barCode = '';
        this.goodsName = '';
        this.goodsSpec = '';

      },
      /*//售后单详情跳转
      handlenumbers(row) {
        this.asTypes=row.asType;
        this.orderId = row.afterSalesNo;
        this.paramsObj = {childrenShow: 1, mainPageShow: false}
        //给子级传参并显示子级
      },*/
      //商品列表关闭清空
      handleClose() {
        this.goodsCode = '';
        this.barCode = '';
        this.goodsName = '';
        this.goodsSpec = '';
        this.$refs.multipleTable.clearSelection();
        this.dialogVisible = false;
      },
      //取商品名
      handleSelectionChange2(val) {
        this.replaceData = val
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
        this.replaceData.forEach((item) => {
          str += item.barCode + ',';
          this.goodsIds2 += item.barCode + ','

        })
        this.goodsIds = str.slice(0, -1);
        this.handleClose();
      },
      //查询商品列表
      productList() {
        let data = {
          goodsCode: this.goodsCode,
          barCode: this.barCode,
          goodsName: this.goodsName,
          goodsSpec: this.goodsSpec,
          page: this.curPage2,
          Size: this.pageSize2
        }
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryForHandWave', data)
          .then(res => {
            if (res.data.success) {
              this.tableData1 = res.data.result.rows;
              this.totalNum2 = res.data.result.total;


            }
          })

      },
      //重置
      reset() {
        this.sevenTime()
        $('#example-post').multiselect('dataprovider', this.shop);
        this.returnGoodsStatus = '';
        this.refundStatus = '';
        this.ecSendStatus = '';
        this.afterSaleType = '';
        this.source = '';
        this.dealStatus = '';
        this.receiveType = 2;
        this.receiveInfo = '';
        this.goodsIds = '';
        this.goodsIds2 = '';


      },
      //导出
      exportData() {
        let timeStart = '';
        let timeEnd = '';

        if (this.applyTime != null) {
          timeStart = this.applyTime[0].getTime();
          timeEnd = this.applyTime[1].getTime()
        }
        let data = {
          timeStart: timeStart,
          timeEnd: timeEnd,
          storeIds: $('#example-post').val().toString(),
          refundStatus: this.refundStatus,
          ecSendStatus: this.ecSendStatus,
          returnGoodsStatus: this.returnGoodsStatus,
          afterSaleType: this.afterSaleType,
          source: this.source,
          dealStatus: this.dealStatus,
          receiveType: this.receiveType,
          receiveInfo: this.receiveInfo,
          barCodes: this.goodsIds2.slice(0, -1),
          page: this.curPage,
          Size: this.pageSize
        }
        if (this.goodsIds != '') {
          data.barCodes = this.goodsIds;
        }
        this._post('com.edb01.erp.ass.service.api.AfterSaleSearchService/' + this.version + '/exportAfterSaleList', data).then(function (res) {
          if (res.data.success) {
            location.href = 'http://' + process.env.FILE_API + '/files-web/download/' + res.data.result
          } else {
            this.$message({
              message: res.data.msg,// 如果code为其他，弹出错误码
              type: 'warning'
            })
          }

        }.bind(this))


      },
//      选择商品分页
      handleSizeChange2(val) {
        this.pageSize2 = val;
        this.productList()
      },
//       选择商品分页
      handleCurrentChange2(val) {
        this.curPage2 = val;
        this.productList()

      },
//      主页分页
      handleSizeChange(val) {
        this.pageSize = val;
        this.initMessages()
      },
      //  当前页
      handleCurrentChange(val) {
        this.curPage = val;
        this.initMessages()

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
        this.applyTime = [new Date(year, month, strDate, 0, 0), new Date(year, month, strDate, 23, 59, 59)]
        this.isActive1 = true;
        this.isActive2 = false;
        this.isActive3 = false;
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
        this.applyTime = [start, end];
        console.log(this.applyTime);
        this.isActive1 = false;
        this.isActive2 = true;
        this.isActive3 = false;
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
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
        const start = new Date(year, month, strDate - 30, 0, 0);
        this.applyTime = [start, end];
        this.isActive1 = false;
        this.isActive2 = false;
        this.isActive3 = true;
      }

    },
    mounted() {
      //默认近7天
      this.sevenTime()
      //数据初始化
      this.initMessages()

      //渲染表格高度
      this.$nextTick(function () {
        this.table_h = $(window).height() - $('.col-border').offset().top - 70;
      });
      window.onresize = () => {
        this.table_h = $(window).height() - $('.col-border').offset().top - 70;
      };
      // 商户有权限的店铺
      this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/listOauth')
        .then(res => {
          if (res.data.success) {
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
        })
      $('#example-post').multiselect({ // 店铺多选的样式
        onInitialized: function (select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor: 'hsla(220,4%,58%,.3)'
          });
        },
      });
      this.study()

    },

  }
</script>
<style scoped>
  #AfterSaleQuery .dot { /*商品里的...号*/
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

  #AfterSaleQuery .error { /*商品里的X号*/
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
  #AfterSaleQuery .btn-group > .btn:first-child {
    width: 200px;
    height: 28px;
    text-align: left;
    line-height: 15px;
    border: 1px solid #d8dce5;
  }

  #pop-y .button-span {
    display: inline-block;
    width: 76px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #979797;
    padding: 0 9px;
    cursor: pointer;
    color: #1a06a4;
    font-size: 12px;
    margin-bottom: 10px;
  }

  #pop-y .span1 {
    display: inline-block;
    /*height: 26px;*/
    /*line-height: 26px;*/
    /*border-radius: 4px;*/
    /*padding: 0 9px;*/
    border: 1px solid #87B6F7;
    cursor: pointer;
    /*background: #409EFF;*/
    background-color: #314155;
    color: white;
    /*margin-left: 7px;*/
    /*font-size: 14px;*/
  }
  #AfterSaleQuery .reees:hover{
    opacity:1!important;

  }
  #AfterSaleQuery #input-box .el-input__inner {
    padding: 0 5px !important;
  }

  #AfterSaleQuery #pop-w .el-dialog__header {
    height: 40px !important;
    padding: 10px 20px 10px;
  }

  #AfterSaleQuery #pop-y .el-dialog__header {
    height: 40px !important;
    text-align: left !important;
    font-size: 20px;
    font-weight: 700;
    padding: 10px 20px 10px;
  }

  #AfterSaleQuery #shop-box .el-input__inner {
    padding: 0 46px 0 15px !important;
  }

  #AfterSaleQuery #pop-w .el-input__inner {
    padding-left: 0px !important;
  }

  #AfterSaleQuery .el-dialog__body {
    padding: 10px 20px !important;
  }

  #AfterSaleQuery .open > .dropdown-menu {
    width: 200px;
  }

  #AfterSaleQuery .el-date-editor .el-range-input, .el-date-editor .el-range-separator {
    font-size: 12px;
  }

  #AfterSaleQuery .el-range-editor.el-input__inner {
    padding: 3px 2px;
    padding-left: 0;

  }
</style>
