<!--出库单管理 秋香-->
<template>
  <div>
    <div id="OutStock" v-show="paramsObj.mainPageShow">

      <!--搜索区-->
      <div id="searchBox">
        <div class="leftBox1">
          <el-row>
            <el-col :span="4.1">
              <div class="grid-content">
                <label>仓库：</label>
                <el-select id="searchStock" v-model="storageId" @click.native="initStock()" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsStock"
                    :key="item.storageId"
                    :label="item.storageName"
                    :value="item.storageId">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="4.1">
              <div class="grid-content">
                <label >单据状态：</label>
                <el-select id="searchStock1" v-model="status" filterable placeholder="全部">
                  <el-option
                    v-for="item in WmStockOutStatusEnum"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="4.1">
              <div class="grid-content">
                <label >出库类型：</label>
                <el-select id="searchStock2" v-model="stockOutType" filterable placeholder="全部">
                  <el-option
                    v-for="item in StockOutTypeEnum"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <el-select style="width: 110px!important;" v-model="selectTimeType" filterable placeholder="创建时间">
                  <el-option
                    v-for="item in WmStockOutTimeEnum"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

                <el-date-picker
                  style="width: 32%!important"
                  @change="methodsS"
                  type="datetime"
                  v-model="startTime"
                  placeholder="选择日期时间">
                </el-date-picker>
                <i>-</i>
                <el-date-picker
                  @change="methodsM"
                  style="width: 32%!important"
                  type="datetime"
                  v-model="endTime"
                  placeholder="选择日期时间">
                </el-date-picker>


              </div>
            </el-col>
            <el-col :span="7">
              <div class="grid-content">
                <el-select style="width: 110px!important;" v-model="selectHandlerType" filterable placeholder="出库单号">
                  <el-option
                    v-for="item in WmStockOutSelectEnum"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input maxlength="50" @keyup.enter.native="queryData()" v-model="context" style="width: 50%!important;" placeholder=""></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox2">
          <el-button size="mini" type="primary" @click="queryData()">查 询</el-button>
          <el-button @click="reset()" size="mini" type="default">重 置</el-button>
        </div>
      </div>

      <!-- 表头 -->
      <div class="col-nav" style="margin:10px 0;">
        <ul>
          <li @click="addButton()" v-if="authorityCode.WMS_OUTSTOCK_ADD"><span>+添加</span></li>
          <li @click="importTemplate()" v-if="authorityCode.WMS_OUTSTOCK_ADD"><span>导入</span></li>
          <li @click="check()" v-if="authorityCode.WMS_OUTSTOCK_AUDIT"><span>审核</span></li>
          <li @click="unauditor()" v-if="authorityCode.WMS_OUTSTOCK_UNAUDITOR"><span>反审核</span></li>
          <li @click="Unassign()"><span>分配</span></li>
          <li @click="cancellation()" v-if="authorityCode.WMS_OUTSTOCK_CANCELLATIONESD"><span>作废</span></li>
          <li @click="derive()" v-if="authorityCode.WMS_OUTSTOCK_EXPORTDATA"><span>导出</span></li>
         <li>
           <el-dropdown  @command="handleCommand">
              <span class="el-dropdown-link">
                打印
              </span>
               <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item command="Importber" @click="print()">打印出库单</el-dropdown-item>
                 <el-dropdown-item command="Downimport" @click="print()">打印拣货单</el-dropdown-item>
               </el-dropdown-menu>
             </el-dropdown>
         </li>
        </ul>
      </div>

      <!--表格-->
      <ag-grid-vue  :style='{"height":agHeight+"px","width": "100%"}'
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

      <div class="pagination">
        <pagination
          :totalCom="total"
          :pageSizeCom="pageSize"
          :curPageCom="curPage"
          @pageSizeVal="getPageSize" @curPageVal="getCurPage"
        ></pagination>
      </div>

      <!--当前行拣货分配-->
      <el-dialog v-dialogDrag
        title="拣货分配"
        :visible.sync="centerDialogVisible"
        width="500px"
        center>
        <div class="fix">
          <div class="fix-l"><label>请选择拣货人：</label></div>
          <el-select placeholder="请选择" v-model="pickingerId">
            <el-option
              v-for="item in person"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="centerVisible()">确 认</el-button>
        </span>
      </el-dialog>

      <!--重新分配-->
      <div>
        <el-dialog v-dialogDrag
          title="拣货分配"
          :visible.sync="unassign"
          width="500px"
          center>
          <div class="fix">
            <div class="fix-l"><label>请选择拣货人：</label></div>
            <el-select placeholder="请选择" v-model="pickingerId">
              <el-option
                v-for="item in person"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId">
              </el-option>
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="unassign = false">取 消</el-button>
          <el-button type="primary" @click="unassignYes">确 认</el-button>
        </span>
        </el-dialog>
      </div>

      <!--抬头分配-->
      <div>
        <el-dialog v-dialogDrag
          title="拣货分配"
          :visible.sync="handUnassign"
          width="500px"
          center>
          <div class="fix">
            <div class="fix-l"><label>请选择拣货人：</label></div>
            <el-select placeholder="请选择" v-model="pickingerId">
              <el-option
                v-for="item in person"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId">
              </el-option>
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="handUnassign = false">取 消</el-button>
          <el-button type="primary" @click="handUnassignYes">确 认</el-button>
        </span>
        </el-dialog>
      </div>

      <!--导入-->
      <el-dialog v-dialogDrag
        title="导入"
        :visible.sync="visibleLead"
        width="800px"
        :before-close="handleClose">
        <div>
          <ul id="leadUl">
            <li>1.务必按照模板格式导入，点击 <span class="liSpan" @click="downLoad">下载出库单模板</span></li>
            <li>2.列名称分别为：条形码，出库数量，商品属性，批次号。</li>
            <li>3.批次号为非必填，商品有批次属性，批次号为空时，默认按照批次出库规则带入批次。</li>
            <li>4.导入文件后，若有商品不符合导入条件，则导入失败，可手动下载失败文件查看失败原因。</li>
            <li>5.文件导入成功后，自动创建出库单。</li>
            <el-form label-width="120px" class="demo-ruleForm" :model="addData" :rules="rules" ref="addData">
              <el-form-item label="上传文件：" prop="fileName">
                <el-input placeholder="文件路径" disabled style="width:198px" v-model="addData.fileName"></el-input>
                <el-button @click="fileUpload">选择文件</el-button>
                <input type="file" style="display:none" ref="fileBtn" @change="fileSelect"/>
              </el-form-item>
              <el-form-item label="出库类型：" prop="stockOutType">
                <el-select id="StockOutType" v-model="addData.stockOutType" filterable placeholder="请选择出库类型"
                           style="width: 201px!important;">
                  <el-option
                    v-for="item in StockOutTypeEnum2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="仓库：" prop="storageId">
                <el-select v-model="addData.storageId" @click.native="initStock()" filterable placeholder="请选择仓库" style="width: 201px!important;">
                  <el-option
                    v-for="item in optionsStock2"
                    :key="item.storageId"
                    :label="item.storageName"
                    :value="item.storageId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="返厂供应商：" prop="supplierId">
                <el-select id="supplierId" filterable v-model="addData.supplierId" placeholder="请选择供应商"
                           style="width: 201px!important;">
                  <el-option
                    v-for="item in supplier"
                    :key="item.supplierId"
                    :label="item.supplierName"
                    :value="item.supplierId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="出库备注：" prop="remark">
                <el-input type="textarea" placeholder="请输入出库备注" v-model="addData.remark" style="width: 78%"
                          :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item style="width:100%;text-align: right">
                <el-button type="primary" @click="makeImport('addData')">确定导入</el-button>
              </el-form-item>
            </el-form>
          </ul>
        </div>
      </el-dialog>

      <!--批量审核详情弹框-->
      <el-dialog v-dialogDrag
        title="审核出库单"
        :visible.sync="Checkoutlist"
        width="920px"
        center>
        <ul style="text-align: center;font-size: 14px">
          <li style="width: 100%">{{successNum}}</li>
          <li style="width: 100%">{{reasones}}</li>
        </ul>
        <!--表格-->
        <el-table :data="tableDataad"
                  border
                  style="width: 100%"
        >
          <el-table-column
            label="序号"
            width="45"
            type="index"
            align="center">
          </el-table-column>

          <el-table-column label="出库单号" align='center'>
            <template slot-scope="scope">
              <el-button @click="particulars(scope.row)" type="text" size="small"><span>{{scope.row.stockOutNo}}</span>
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="单据状态" align="center">
            <template slot-scope="scope">
              <span class="cen-g" v-show="scope.row.status == 1001">待审核</span>
              <span class="cen-g" v-show="scope.row.status == 1002">已审核</span>
              <span class="cen-g" v-show="scope.row.status == 1003">已分配</span>
              <span class="cen-g" v-show="scope.row.status == 1004">已拣货</span>
              <span class="cen-g" v-show="scope.row.status == 1005">已出库</span>
              <span class="cen-g" v-show="scope.row.status == 1006">审核拒绝</span>
              <span class="cen-g" v-show="scope.row.status == 1007">已作废</span>
            </template>
          </el-table-column>

          <el-table-column label="出库类型" align="center">
            <template slot-scope="scope">
              <span class="cen-g" v-show="scope.row.stockOutType ==1">采购退货</span>
              <span class="cen-g" v-show="scope.row.stockOutType ==2">调拨出库</span>
              <span class="cen-g" v-show="scope.row.stockOutType ==3">其他出库</span>
            </template>
          </el-table-column>

          <el-table-column label="仓库名称" align="center">
            <template slot-scope="scope">
              <span class="cen-g">{{ scope.row.storageName }}</span>
            </template>
          </el-table-column>
        </el-table>

      </el-dialog>

      <!--批量审核选择弹框-->
      <el-dialog v-dialogDrag
        title="审核出库单"
        :visible.sync="refuseClick"
        :before-close="handleClose2"
        width="420px"
        center>
        <div style="text-align: center">
          <p>
            <el-radio v-model="radioes" label="1">审核通过</el-radio>
            <el-radio v-model="radioes" label="2">审核拒绝</el-radio>
          </p>
          <span style="position: absolute ;top:105px;left: 20px">审核备注：</span>
          <el-input
            maxlength="200"
            style="width: 252px;"
            type="textarea"
            :rows="3"
            placeholder="请输入备注内容"
            v-model="auditRemark ">
          </el-input>

          <div style="text-align: left;position: relative">
            <span style="position: absolute;left: 236px;height: 17px">{{auditRemark.length}}/200</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="refuseClick= false;auditRemark=''">取 消</el-button>
            <el-button size="mini" type="primary" @click="refuse" style="margin-right: 70px">审 核</el-button>
          </span>
      </el-dialog>
    </div>
    <ConfirmPick v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 33"
                 :params="paramsObj" @changeShow="changeShow" :stockOutNos="stockOutNos" :stockOutIds="stockOutIds"></ConfirmPick>
  </div>
</template>
<script>
  import { zeroFill,positiveIntegerValidator,priceValidator,gridOptions,turnTimestamp,phoneEncrypt } from '@/assets/js/validate.js';
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue';
  import ConfirmPick from '@/components/views/stock/children/ConfirmPick.vue';
  import {AgGridVue} from "ag-grid-vue";
  export default {
    components: {
      'ag-grid-vue': AgGridVue,
      pagination,dataTime, ConfirmPick,
      orderCodeRender: {
        template: '<div><el-button @click="particulars()" type="text" size="small">{{params.data.stockOutNo}}</el-button></div>',
        methods: {
          //出库单号跳转
          particulars() {
            let _this = this.params.context
            let stockOutId = this.params.data.stockOutId;
            _this.$router.push({name: 'OutboundDetail', params: {id: stockOutId}})
          },

        }
      },
      //操作
      delRenderer: {
        template: `<div >
              <div >
                    <span v-if="params.data.status == 1001 || params.data.status ==1006">
                      <el-button  @click="modification()" v-if="(params.data.stockOutType == 1 && params.data.sourceOrderType==1001 && params.data.sourceOrderNo != ''&& params.context.authorityCode.WMS_OUTSTOCK__AMEND) " type="text" size="small">
                      </el-button>
                      <el-button  @click="modification()" type="text" size="small" v-else>修改
                      </el-button>
                    </span>
                    <span v-if="params.data.status == 1001 || params.data.status ==1006">
                        <el-button v-if="params.context.authorityCode.WMS_OUTSTOCK_AUDIT" @click="audit()" type="text" size="small">审核</el-button>
                        <el-button v-if="params.context.authorityCode.WMS_OUTSTOCK_CANCELLATIONESD" @click="cancellationesd()" type="text" size="small">作废</el-button>
                    </span>
              </div>
              <div v-if="params.data.status == 1002||params.data.isThr==false">
                  <el-button @click="unassignOne()" type="text" size="small">分配</el-button>
              </div>
              <div v-if="params.data.status == 1003">
                    <el-button v-if="params.context.authorityCode.WMS_OUTSTOCK_CONFIRMPICK" @click="confirmPick()" type="text" size="small">确认拣货
                    </el-button>
                    <span v-if="params.data.checkAgainAllot==true"> <el-button @click="changeUnassign()" type="text" size="small">重新分配</el-button></span>
              </div>
        </div>`,
        methods: {
          //修改
          modification() {
            let _this = this.params.context
            let stockOutId = this.params.data.stockOutId;
            _this.$router.push('/Outrevision/' + stockOutId)
          },
          //单条审核
          audit() {
            let _this = this.params.context
            let stockOutId = this.params.data.stockOutId;
            _this.$router.push('/OutbReview/' + stockOutId)
          },
          // 作废
          cancellationesd(row) {
            let stockOutId = this.params.data.stockOutId;
            let _this = this.params.context
            _this._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/cancelStockoutOrder', {stockOutIds: stockOutId}).then(function (res) {
              if (!res.data.result.checkstatus) {
                _this.$message({
                  message: res.data.result.data,
                  type: 'success'
                });
                _this.initMessage();
              } else {
                _this.$message({
                  message: res.data.result.data,
                  type: 'warning'
                })
              }
            })
          },

          //确认拣货
          confirmPick() {
            let stockOutNo = this.params.data.stockOutNo;
            let stockOutId = this.params.data.stockOutId;
            let _this = this.params.context
            _this.stockOutNos = stockOutNo;
            _this.stockOutIds= stockOutId;
            _this.paramsObj = {childrenShow:33, mainPageShow: false}
          },
          //重新分配
          changeUnassign() {
            let pickingerId = this.params.data.pickingerId;
            let stockOutId = this.params.data.stockOutId;
            let _this = this.params.context
            _this.unassign = true;
            _this.assigner();
            _this.aob =stockOutId
          },

          //单行分配
          unassignOne() {
            let stockOutId = this.params.data.stockOutId;
            let _this = this.params.context
            _this.aob = stockOutId
            _this.centerDialogVisible = true;
            _this.pickingerId = ''
            _this.assigner()

          },
     /*     //详情跳转
          clickDetail() {
            let _this = this.params.context
            //待审核详情页面  待审核/审核拒绝/已作废
            if (this.params.data.status == 1001 || this.params.data.status == 1006 || this.params.data.status == 1007) {
              _this.$router.push({name: 'OutboundDetail', params: {stockOutNo: this.params.data.stockOutNo, stockOutId: this.params.data.stockOutId}})
            }
            //已审核详情页面  已审核/已拣货/出库
            if (this.params.data.status == 1002 || this.params.data.status == 1004 || this.params.data.status == 1005) {
            _this.$router.push({
                name: 'OutboundDetailTwo',
                params: {stockOutNo: this.params.data.stockOutNo, stockOutId: this.params.data.stockOutId}
              })
            }
          },*/
        }
      }
      },
    data() {
      return {
        gridOptions: {
          //国际化（设置显示文字）
          context: this,
          enableColResize: true,//可拖动改变列宽度
          suppressExcelExport:true,//关闭excel导出
          suppressCsvExport:true,//关闭csv导出
          /*rowHeight:50,*/
          enableRangeSelection:true,//可复制多行多单元格
          suppressCopyRowsToClipboard:true,//当启用行单击选择和范围选择时，如果您希望让范围优先，则快捷方式将复制所选行而不是所选范围
          suppressRowClickSelection: true,//阻止单击行选中本行
          enableSorting:true,
          enableBrowserTooltips:true,
          localeText:{
            noRowsToShow:'暂无数据',
            pinColumn:"固定列",
            pinLeft:'居左',
            pinRight:'居右',
            noPin:'默认',
            autosizeThiscolumn:'自适应当前列',
            autosizeAllColumns:'自适应所有列',
            resetColumns:'重置列',
            toolPanel:'工具板',
            blanks:'空白',
            selectAll:'全选',
            searchOoo:'搜索',
            filterOoo:'筛选',
            columns:'自定义显示列',
            groups:'行组',
            rowGroupColumnsEmptyMessage:'拖动此处以设置行组'
          }
        },//表格初始化配置
        components: null,//自定义列
        columnDefs: null,//列标题设置
        rowData: null,//表格数据
        //企业扩展
        gridApi: null,
        columnApi: null,
        agHeight: 0,
        wmsDownload:process.env.FILE_API,
        paramsObj: {
          mainPageShow: true
        },//子级传参
        stockOutNos:'',
        stockOutIds:'',//出库单Ids
        stockOutId: '',//出库单Id
        reasones:'',
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},
        radioes:"1",//审核通过
        auditStatus: '',//审核是否通过
        refuseClick: false, //批量审核选择弹框
        auditRemark: '',  //批量审核选择弹框备注信息
        tableDataad: [], //批量审核详情弹框数据
        successNum: '',  //成功
        version: '1.0.0',
        addData: {
          fileName: '',//文件路径
          stockOutType: '',//出库类型
          storageId: '',//仓库
          supplierId: '',//供应商
          remark: '',//出库备注
          fileId: '',
          checkList:''
        },//导入
        Checkoutlist: false, // 批量审核详情弹框
        uploadFile: '',//存文件
        rules: {
          stockOutType: [     //必选出库类型
            {trigger: 'change', required: true, message: '请选择出库类型！'}
          ],
          storageId: [         //必选仓库
            {trigger: 'change', required: true, message: '请选择仓库！'},
          ],
          fileName: [       //文件
            {required: true, message: '请选择上传文件！'},
          ],
        },//表单规则
        optionsStock:[{storageId:'',storageName:'全部'}],//仓库下拉
        optionsStock2:'',//仓库下拉
        statusName:'',
        WmStockOutStatusEnum: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 1001,
            label: '待审核'
          },
          {
            value: 1002,
            label: '已审核'
          },
          {
            value: 1003,
            label: '已分配'
          },
          {
            value: 1004,
            label: '已拣货'
          }, {
            value: 1005,
            label: '已出库'
          }, {
            value: 1006,
            label: '审核拒绝'
          }, {
            value: 1007,
            label: '已作废'
          },
        ],//单据状态
        WmStockOutTimeEnum: [
          {
            value: '1001',
            label: '申请时间'
          }, {
            value: '1002',
            label: '审核时间'
          }, {
            value: '1003',
            label: '拣货时间'
          }, {
            value: '1004',
            label: '出库时间'
          },
        ],//时间类型
        supplier: [{value: '', label: '全部'}],//供应商
        supplierId: '',//供应商
        remark: '',//备注
        StockOutTypeEnum: [
          {
            value: ' ',
            label: '全部'
          },
          {
            value: '1',
            label: '采购退货'
          }, {
            value: '2',
            label: '调拨出库'
          }, {
            value: '3',
            label: '其他出库'
          },
        ],//出库类型
        StockOutTypeEnum2: [
          {
            value: '1',
            label: '采购退货'
          }, {
            value: '2',
            label: '调拨出库'
          }, {
            value: '3',
            label: '其他出库'
          },
        ],//出库类型
        WmStockOutSelectEnum: [
          {
            value: '1001',
            label: '出库单号'
          }, {
            value: '1006',
            label: '条形码'
          }, {
            value: '1007',
            label: '来源单号'
          }, {
            value: '1002',
            label: '申请人'
          }, {
            value: '1003',
            label: '审核人'
          }, {
            value: '1004',
            label: '拣货人'
          }, {
            value: '1005',
            label: '验货人'
          },
        ],//出库单
        tableNum: [],//选择条数
        storageId:"",//仓库
        status: 1001,//单据状态-待审核
        selectHandlerType: '1001',//出库单号
        stockOutType: ' ',//出库类型
        selectTimeType: '1001',//时间类型
        stockOutNo: '',//出库单号
        startTime:'',//起始时间
        endTime: '',//结束时间
        context: '',//输入单号
        stock: '',//仓库
        stockArea: '',//库区
        stockSeat: '',//库位
        isSeat: false,//库位判空
        barCode: '',//条形码
        name: '',//商品名称
        time1: '',//快照开始
        time2: '',//快照结束
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1,//当前页数
        dialogFormVisiblex: false,//修改窗口
        centerDialogVisible: false,//上架弹窗
        visibleLead: false, // 导入
        unassign: false,//分配弹窗
        multipleSelection: [],
        pickingerId: '',//拣货人
        aob: '',//当前行出库单Id
        person:[],//仓库下拉
        aa: '',
        pickinger:'',//拣货人
        handUnassign:false,//抬头分配弹框
        isShowChang:false,//重新分配
        syncStatus:'',//是否同步  0；已同步 1：未同步
        isThr:'',//;是否为第三方  true 是  false 否
      }
    },

    //列标题设置
    beforeMount() {
      this.columnDefs = [                     /*多选框*/ /*表头全选框*/
        {headerName: '序号', field: 'index', pinned: 'left',suppressToolPanel:true,suppressSorting:true,lockPosition: true,headerCheckboxSelection:true,checkboxSelection:true , width: 120, },
        {headerName: '出库单号', field: 'stockOutNo',pinned: 'left',width: 180,cellRendererFramework: "orderCodeRender"},
        {headerName: '单据状态', field: 'statusName',width: 180,},
        {headerName: '出库类型', field: 'stockOutType',width: 180,},
        {headerName: '仓库', field: 'storageName',width: 120,},
        {headerName: '返厂供应商', field: 'supplierName',width: 150,tooltipField:'supplierName'},
        {headerName: '出库备注', field: 'stockOutRemark', width:200,tooltipField:'stockOutRemark'},
        {headerName: '三方仓同步状态', field: 'syncStatus', width:200,tooltipField:'remark'},
        {headerName: '三方仓处理状态', field: 'processStatus', width:200,tooltipField:'remark'},
        {headerName: '申请人', field: 'proposer', width: 150},
        {headerName: '申请时间', field: 'proposTime', width:180},
        {headerName: '审核人', field: 'auditor', width:150},
        {headerName: '审核时间', field: 'auditTime', width: 200},
        {headerName: '拣货人', field: 'pickinger', width: 150},
        {headerName: '拣货时间', field: 'pickingTime', width: 200},
        {headerName: '验货人', field: 'surveyor', width: 150},
        {headerName: '出库时间', field: 'stockOutTime', width: 200},
        {headerName: '来源单号', field: 'sourceOrderNo', width:180},
        {headerName: '来源单据', field: 'sourceOrderOne', width: 180},
        {headerName: '审核备注',field: 'auditRemark', width:200,tooltipField:'auditRemark'},
        {headerName: '操作', field: 'button ',pinned: 'right',width: 200,cellRendererFramework: "delRenderer", },
      ];
      //自定义列
      this.components = {
      };

    },
    activated() {
      this.initMessage();//初始化表格数据
    },

    mounted() {
      this.renderTableHeight(); //渲染表格高度
      this.reallocationCheck()
      this.assigner()
      this.initTime();
      this.initMessage();
      this.initStock();//初始化仓库下拉

/*      //表格高度自适应
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });*/
    },

    methods: {

      //表格初始化
      onGridReady(params) {
        if(sessionStorage.getItem("columnState")){
          var getColumnState = JSON.parse(sessionStorage.getItem("columnState"));
          this.gridOptions.columnApi.setColumnState(getColumnState);
        }
        //this.gridApi = params.api;
        // this.columnApi = params.columnApi;
        //params.api.sizeColumnsToFit();
        this.stockOutIds = '';
        this.gridOptions.onSelectionChanged = (event) => {
          //this.orderLists = this.getSelectedRows();
          this.tableNum = this.gridOptions.api.getSelectedRows();
          var orderIds = '';
          this.tableNum.forEach((item, i) => {
            orderIds += item.stockOutId + ',';
          })
          this.stockOutIds = orderIds.slice(0, -1);
        }
        this.gridOptions.onSortChanged = (event) => {
          console.log(event);
        }
      },

      //渲染表格高度
      renderTableHeight() {
        this.$nextTick(function () {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 80;
        });
        window.onresize = () => {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 80;
        }
      },
      handleCommand(){

      },

      beforeRouteLeave(to,from,next) {
        if (to.name == 'Outrevision' || to.name == 'OutbReview') {
          //离开时，将自身缓存下来
          if (!from.meta.keepAlive) {
            from.meta.keepAlive = true;
          }
          next();
        }else {
          from.meta.keepAlive = false;
          to.meta.keepAlive = false;
          this.$destroy();
          next();
        }
      },

      //打印
      print(){
        if (this.tableNum == '') {
          this.$message({
            message: '请选择出库单！',
            type: 'warning'
          })
        }else{
          let arr=[]
          this.tableNum.forEach((item)=>{
            arr.push(item.status)
          })
          if(arr.indexOf(1003)>-1||arr.indexOf(1005)>-1) {
            /*   this.$message({
                 message: '无接口!',
                 type: 'warning'
               })*/
            var arrOne=''
            for (let item of this.tableNum) {
              arrOne += item.stockOutId + ','
            }
            const token=localStorage.getItem('clToken');
            let data={
              ids:arrOne.slice(0, -1),
              modelkey:1,
              stype:'SVoucher',
              cltoken:token
            }
            /*this._post('http://127.0.0.1:8082/preview',data).then((res) => {
              if (res.data.result == '') {

              }
            })*/
            $.ajax({
              type: "post",
              url: "http://127.0.0.1:8082/preview",
              data: data,
              success: function(data){

              }
            });
          }else{
            this.$message({
              message: '已分配和已出库的出库单可进行打印!',
              type: 'warning'
            })
          }
        }
      },

      //分配人
      assigner(){
        this._post('com.edb01.upms.service.UserService/1.0.0/getUserByPri', {privilegeName:'出库单管理'})
          .then((res) => {
            this.person= res.data.result;
          })
      },

      // 起始时间
      methodsS() {
        if(this.endTime){
          if(this.startTime > this.endTime){
            this.endTime = '';
          }else{

          }
        }
      },

      // 结束时间
      methodsM() {
        if(this.startTime){
          if(this.startTime > this.endTime){
            this.endTime = '';
          }else{

          }
        }else{

        }
      },

      // 中国标准时间转换为时间戳
      dateToMs (date) {
        let result = new Date(date).getTime();
        return result;
      },

      //初始化时间
      initTime: function () {
        var nowdate = new Date();
        var y = nowdate.getFullYear();
        var m = nowdate.getMonth() + 1;
        var d = nowdate.getDate();
        var formatnowdate = y + '-' + m + '-' + d + ' 23:59:59';
        nowdate.setMonth(nowdate.getMonth() - 1);
        var y = nowdate.getFullYear();
        var m = nowdate.getMonth() + 1;
        var d = nowdate.getDate();
        var formatwdate = y + '-' + m + '-' + d;
        this.startTime = formatwdate
        this.endTime = formatnowdate
      },

      clicdata() {
        this.initStock()
      },

      //重置
      reset() {
        this.addData.storageId = '';
        this.initTime();
        this.stockOutType = '';
        this.selectTimeType='1001';
        this.selectHandlerType = '1001';
        this.select1Value = '';
        this.context = ''
      },

      //导出
      derive() {
        let self = this;
        let str = []
        for (let item of self.tableNum) { // 库位ID，用逗号隔开
          str += item.stockOutId + ','
        }
        if(self.tableNum==''){
          str=''
        }else{
          str.slice(0, -1)
        }
        let data = {
          "storageId": this.storageId,//仓库id
          "status": this.status,//单据状态
          "stockOutType": this.stockOutType,//出库类型
          "selectTimeType": this.selectTimeType,//时间类型
          "startTime": this.startTime,//开始时间
          "endTime": this.endTime,//结束时间
          "selectHandlerType": this.selectHandlerType,//查询类型
          "context": this.context,//出库单号，申请人，审核人，拣货人，验货人
          "stockOutNo": this.stockOutNo,
          "page": this.curPage,//当前页
          "size": this.pageSize,//每页行数
          "stockOutIds": str,
        };
        self._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/exportExcel', data
        )
          .then(function (res) {
            if (res.data.code == 0) {
              location.href = 'http://'+self.wmsDownload+'/files-web/download/' + res.data.result
            } else {
              self.$message({
                message: res.data.msg,// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      //批量审核
      check() {
        if (this.tableNum == '') {
          this.$message({
            message: '请选择出库单！',
            type: 'warning'
          })
        } else {
          let arr=[]
          this.tableNum.forEach((item)=>{
            arr.push(item.status)
          })
          if(arr.indexOf(1001) > -1 ||arr.indexOf(1006) > -1) {
            this.refuseClick = true
          }else {
            this.$message({
              message: '勾选的出库单中不包含待审核或审核拒绝的出库单!',
              type: 'warning'
            })
          }
        }
      },

      // 批量审核提交
      refuse() {
        let self = this
        if (this.radioes == 1) {
          this.auditStatus = true
        } else if (this.radioes == 2) {
          this.auditStatus = false
        }
        var arr = '';
        for (let item of this.tableNum) {
          arr += item.stockOutId + ','
        }
        self._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/batchAuditStockOutOrder', {
          stockOutIds: arr.slice(0, -1),
          auditStatus: this.auditStatus,
          auditRemark: this.auditRemark
        }).then(function (res) {
          if (res.data.result.checkstatus) {
            self.refuseClick = false
            self.auditRemark='';
            self.$message({
              message: res.data.result.data,
              type: 'success'
            })
            self.initMessage()
          } else {
            self.refuseClick = false;
            self.auditRemark='';
            self.successNum=res.data.result.data
            self.reasones=res.data.result.reason
            self.optionsStock.forEach((item)=>{
              res.data.result.auditFails.forEach((val)=>{
                if(item.storageId==val.storageId){
                  val.storageName=item.storageName
                }
              })
            })
            self.tableDataad = res.data.result.auditFails;
            self.Checkoutlist = true;
            self.initMessage()
          }
        }).catch(function (err) {
          console.log(err)
        })
      },



      //给子级传参并显示子级
      changeShow(val){
        if(val.childrenShow == 3){
          this.paramsObj.mainPageShow = true;
          this.initMessage();
        }
      },

      // 批量作废
      cancellation: function () {
        if (this.tableNum == '') {
          this.$message({
            message: '请选择出库单！',
            type: 'warning'
          })
        } else {
          let self = this
          this.$confirm('确定作废出库单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            var arr = '';
            for (let item of this.tableNum) {
              arr += item.stockOutId + ','
            }
            self._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/cancelStockoutOrder', {stockOutIds: arr.slice(0, -1)}).then(function (res) {
              if (res.data.result.checkstatus) {
                self.$message({
                  message: res.data.result.data,
                  type: 'success'
                });
                self.initMessage();
              } else {
                self.$message({
                  message: res.data.result.data,
                  type: 'warning'
                })
                self.initMessage();
              }
            }).catch(function (err) {
              console.log(err)
            })
          }).catch(() => {
            this.$refs.multipleTable.clearSelection();
          });
        }
      },

      // 批量反审核
      unauditor: function () {
        if (this.tableNum == '') {
          this.$message({
            message: '请选择出库单！',
            type: 'warning'
          })
        } else {
          let self = this
          this.$confirm('确定反审核出库单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            var arr = '';
            for (let item of this.tableNum) {
              arr += item.stockOutId + ','
            }
            self._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/reverseAuditStockOutOrder', {stockOutIds: arr.slice(0, -1)}).then(function (res) {
              if (res.data.result.checkstatus) {
                self.$message({
                  message: res.data.result.data,
                  type: 'success'
                });
                self.initMessage();
              } else {
                self.$message({
                  message: res.data.result.data,
                  type: 'warning'
                })
              }

            }).catch(function (err) {
              console.log(err)
            })
          }).catch(() => {
            self.$refs.multipleTable.clearSelection();
          });
        }
      },

      //导入窗口
      importTemplate() {
        this.visibleLead = true
        this.supplierSum();
      },

      //确定导入
      makeImport: function () {
        this.$refs.addData.validate((valid) => {
          if (valid) {
            let formData = new FormData();
            formData.append('filedata', this.uploadFile);
            this.$axios({
              method: 'post',
              url: 'http://'+this.wmsDownload+'/files-web/upload',
              data: formData
            })
              .then((res) => {
                if (res.data.resourcesId) {
                  this.addData.fileId = res.data.resourcesId
                  this._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/importExcel', this.addData)
                    .then((res) => {
                      if (res.data.success == true) {
                        if(res.data.result.checkstatus==false){
                          this.$message({
                            message:'导入失败，详细错误请查看Excel错误文件！',
                            type: 'warning'
                          })
                          location.href = 'http://'+this.wmsDownload+'/files-web/download/' + res.data.result.data
                        }else{
                          this.$message({
                            message:'导入成功！',
                            type: 'success'
                          })
                          this.initMessage()
                        }
                        this.uploadFile='';
                        this.visibleLead = false;
                        this.$refs.addData.resetFields();
                      }else {
                        if(res.data.msg!=''){
                          this.$message({
                            message:res.data.msg,
                            type: 'warning'
                          })
                        }
                      }
                    })
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 弹框关闭时置为空
      handleClose(done, addData) {
        this.$refs.addData.resetFields();
        this.$refs.fileBtn.value='';
        done();
      },

      //审核出库单取消
      handleClose2(done) {
        this.auditRemark='';
        this.refuseClick=false;
        done();
      },

      //下载出库单模板
      downLoad() {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/1.0.0/queryBatchFlag').then((res) => {
          if (res.data.success) {
            if (res.data.result.batchFlag) {
              location.href = 'http://'+this.wmsDownload+'/files-web/download/5334';

            }else {

              location.href = 'http://'+this.wmsDownload+'/files-web/download/3850';
            }
          } else {

          }
        })

      },

      //文件选择函数
      fileSelect(e) {
        if (e.target.files[0].name.indexOf(".xls") > 0 || e.target.files[0].name.indexOf(".xlsx") > 0) {
          this.uploadFile = e.target.files[0];
          this.addData.fileName = e.target.files[0].name;
        } else {
          this.$message({
            message: '文件格式不正确，仅支持.xls、. xlsx两种格式！',
            type: 'warning'
          });
        }
      },

      // 点击选择文件
      fileUpload() {
        this.$refs.fileBtn.click();
      },

      //查询按钮
      queryData() {
        if (this.startTime !== null && this.endTime == null) {
          this.$message({
            message: '请选择结束时间',
            type: 'warning'
          })
        } else if (this.startTime == null && this.endTime == null || this.storageId !== '' || this.status !== '' || this.stockOutType !== '' || this.selectTimeType !== '' || this.selectHandlerType !== '' || this.context !== '') {
          this.initMessage()
        }
      },

      //初始化表格数据
      initMessage: function () {
        if(this.startTime == ''){

        }else{
          this.startTime = this.dateToMs(this.startTime);
        }
        if(this.endTime == ''){

        }else{
          this.endTime = this.dateToMs(this.endTime);
        }

        let data = {
          "syncStatus":this.syncStatus,//是否同步  0；已同步 1：未同步
          "isThr":this.isThr,//是否为第三方  true 是  false 否
          "storageId": this.storageId,//仓库id
          "status": this.status,//单据状态
          "stockOutType": this.stockOutType,//出库类型
          "selectTimeType": this.selectTimeType,//时间类型
          "startTime": this.startTime,//开始时间
          "endTime": this.endTime,//结束时间
          "selectHandlerType": this.selectHandlerType,//查询类型
          "context": this.context,//出库单号，申请人，审核人，拣货人，验货人
          "stockOutNo": this.stockOutNo,
          "page": this.curPage,//当前页
          "size": this.pageSize//每页行数
        };

        if(data.startTime==0){
          data.startTime='';
        }
        if(data.endTime==0){
          data.endTime='';
        }
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/queryPager', data).then( res =>{
            if (res.data.hasOwnProperty("result")) {
              this.tableData = res.data.result.rows;
              this.total = res.data.result.total;
              res.data.result.rows.map((v,index)=> {
                this.$set(v,'index',index+1);
                if (v.proposTime) v.proposTime = turnTimestamp(v.proposTime);//审请时间}
                if (v.auditTime) v.auditTime = turnTimestamp(v.auditTime);//审核时间}
                if (v.pickingTime) v.pickingTime = turnTimestamp(v.pickingTime);//拣货时间}
                if (v.stockOutTime) v.stockOutTime = turnTimestamp(v.stockOutTime);//出库时间}
                // 出库类型
                var stockOutType='';
                switch(v.stockOutType){
                 case 1:
                    stockOutType='采购退货';
                    break;
                 case 2:
                    stockOutType='调拨出库';
                    break;
                 case 3:
                    stockOutType='其他出库';
                    break;
                 case 4:
                    stockOutType='售后单';
                    break;
                }
                this.$set(v,'stockOutType',stockOutType);
                //三方仓同步状态
                var syncStatus='';
                switch(v.syncStatus){
                  case 0:
                    syncStatus='已同步';
                    break;
                  case 1:
                    syncStatus='未同步';
                    break;
                }
                this.$set(v,'syncStatus',syncStatus);
                //三方仓处理状态
              var processStatus='';
              switch(v.processStatus){
                case 0:
                  processStatus='已确认';
                  break;
                case 1:
                  processStatus='已取消';
                  break;
              }
              this.$set(v,'processStatus',processStatus);
                var statusName='';
                switch(v.status){
                  case 1001:
                    statusName='待审核';
                    break;
                  case 1002:
                    statusName='已审核';
                    break;
                  case 1003:
                    statusName='已分配';
                    break;
                  case 1004:
                    statusName='已拣货';
                    break;
                  case 1005:
                    statusName='已出库';
                    break;
                  case 1006:
                    statusName='审核拒绝';
                    break;
                  case 1007:
                    statusName='已作废';
                    break;
                }
                this.$set(v,'statusName',statusName);
              var sourceOrderOne='';//来源单据
              switch(v.sourceOrderType){
                case 1001:
                  statusName='入库单';
                  break;
              }
              this.$set(v,'sourceOrderOne',sourceOrderOne);
            })
        /*      res.data.result.rows.forEach(item => {
                if (item.remark) {
                  item.name1 = item.remark.slice(0, 25);
                  if (item.remark.length > 25) {
                    item.name2 = item.remark.slice(25, 200);
                  }
                } else {
                  item.name1 = '';
                  item.name2 = '';
                }
              })
          */
              console.log(this.tableData);
            } else {
              this.tableData = [];
              this.total = 0;
            }

        })
      },

      //重新分配接口校验
      reallocationCheck(){
        let stockOutIdAll=''
        this.tableData.forEach((item)=>{
          stockOutIdAll += item.stockOutId + ','
        })
        this._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/checkAgainAllotStockOutOrder', {stockOutId:stockOutIdAll.slice(0, -1)})
          .then((res) => {
            this.checkList= res.data.result;
          })
      },

      //初始化仓库下拉列表
      initStock: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/1.0.0/listOauth').then(function (res) {
          this.optionsStock2=res.data.result
          this.optionsStock=res.data.result
        }.bind(this));
      },

      //获取多选框的值
      handleSelectionChange(val) {
        this.tableNum = val;
      },

      //供应商
      supplierSum: function () {
        this._post('com.edb01.erp.mdata.service.api.SupplierService/1.0.0/getSupplierList').then(function (res) {
          this.supplier = res.data.result;
        }.bind(this));
      },

     //以下是分页
      getPageSize: function (val) {
        if (val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();
          //存储每页数量
          sessionStorage.setItem('hold_OutStock_1', val);
        }
      },
      getCurPage: function (val) {
        if (val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
        }
      },

      //添加跳转路由
      addButton() {
        this.$router.push({path: '/AddOutbound'});
      },

      //抬头分配
      Unassign() {
        let self = this
        if (self.tableNum.length == 0) { // 判断是否选中要删除的波次
          self.$message({
            message: '请选择出库单！',
            type: 'warning'
          })
          return false
        }
        var vals=[];
        for(var item of this.tableNum){
          vals.push(item.waveStatus);
        }
        for(let i=0; i<vals.length; i++) {
          if (vals[i] == 1002) {//待分配
            this.handUnassign = true;
            this.pickingerId = ''
            this.assigner();
          } else {
            var vals = [];
            for (var item of this.tableNum) {
              vals.push(item.status);
            }
            for (let i = 0; i < vals.length; i++) {
              if (vals[i] == 1002) {//（已审核状态）
                self.handUnassign = true;
                self.pickingerId = ''
                self.assigner()
              } else {
                self.$message({
                  message: '勾选的出库单中不包含已审核的出库单！',
                  type: 'warning'
                })
                return false;
              }
            }
          }
        }
      },

      //抬头确定
      handUnassignYes() {
        if (this.pickingerId == '') {
          this.$message({
            type: 'warning',
            message: '请选择拣货人!'
          })
        } else {
          this.handUnassign = false
          let str = []
          for (let item of this.tableNum) { // 库位ID，用逗号隔开
            str += item.stockOutId + ','
          }
          this.person.forEach((val)=>{
            if(val.userId==this.pickingerId){
              this.pickinger=val.userName
            }
          })
          let self = this;
          self._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/allotStockOutOrder', {
            stockOutIds: str.slice(0, -1),
            pickingerId:this.pickingerId,
            pickinger:this.pickinger,
          })
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '分配成功!',
                })
                self.initMessage();
              }  else {
                self.$message({
                  message: res.data.msg,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
        }
      },



      //重新分配确定按钮
      unassignYes() {
        if (this.pickingerId == '') {
          this.$message({
            type: 'warning',
            message: '请选择拣货人!'
          })
        } else {
          this.unassign = false
          this.person.forEach((val)=>{
            if(val.userId==this.pickingerId){
              this.pickinger=val.userName
            }
          })
          let self = this;
          self._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/againAllotStockOutOrder', {
            stockOutId:this.aob,
            pickingerId:this.pickingerId,
            pickinger:this.pickinger,
          })
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '分配成功!',
                })
                self.initMessage();
              } else if (res.data.result.checkstatus = false) {
                self.$message({
                  type: 'warning',
                  message: '勾选的出库单中必须含有已审核的出库单!'
                })
              } else {
                self.$message({
                  message: res.data.msg,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }
      },


      //单行分配确定
      centerVisible() {
        if (this.pickingerId == '') {
          this.$message({
            type: 'warning',
            message: '请选择拣货人!'
          })
        } else {
          this.centerDialogVisible = false
          this.person.forEach((val)=>{
            if(val.userId==this.pickingerId){
              this.pickinger=val.userName
            }
          })
          let self = this;
          self._post('com.edb01.erp.wms.service.api.WmStockOutService/1.0.0/allotStockOutOrder', {
            stockOutIds: this.aob,
            pickingerId:this.pickingerId,
            pickinger:this.pickinger,
          })
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '分配成功!',
                })
                self.initMessage();
              }  else {
                self.$message({
                  message: res.data.msg,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
        }
      },
    }
  }
</script>
<style>
  #OutStock .pTop .col-nav ul li span {

  }
</style>
<style scoped>

  .pTop {
    margin-bottom: 20px;
  }
  .router-link-active {
    text-decoration: none;
  }
  a {
    text-decoration: none !important;
  }
  .btnStyle {
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px !important;
    height: 30px;
    line-height: 8px;
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
  #leadUl li {
    color: #FF0000;
    font-size: 14px;
    margin-bottom: 20px;
    padding-left: 17px;
  }
  .liSpan {
    color: #0000FF;
    cursor: pointer;
  }
  .xin {
    color: red;
  }
</style>
