<!--发票管理 方证/樊虎-->
<template>
  <div id="invoicesControl" v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <div v-show="paramsObj.mainPageShow">
      <!--查询条件-->
      <div id="searchBox">
        <div class="leftBox1">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="conDateType">{{$t('receipt.labDateType')}}</label>
                <el-select id="conDateType" v-model="listQuery.dateType" @change="handleDateType">
                  <el-option v-for="(label,value) in condition.dateTypeOptions" :key="value" :value="value"
                             :label="label"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="conStartTime">从：</label>
                <el-date-picker id="conStartTime" v-model="listQuery.startTime" :clearable="false" :editable="false"
                                @change="channelChangeTime" type="datetime" placeholder="选择日期时间"
                                format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' default-time="00:00:00">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="conEndTime">{{$t('receipt.labTo')}}：</label>
                <el-date-picker id="conEndTime" v-model="listQuery.endTime" :clearable="false" :editable="false"
                                @change="channelChangeTime" type="datetime" placeholder="选择日期时间"
                                format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' default-time="23:59:59">
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="conStatus">{{$t('receipt.labRecStatus')}}</label>
                <el-select id="conStatus" v-model="listQuery.invoiceStatus" clearable placeholder="全部">
                  <el-option v-for="(label,value) in condition.statusOptions" :key="value" :value="value"
                             :label="label"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="conTypeId">{{$t('receipt.labTypeName')}}</label>
                <el-select id="conTypeId" v-model="listQuery.invoiceType" clearable placeholder="全部">
                  <el-option v-for="(label,value) in condition.typeIdOptions" :key="value" :value="value"
                             :label="label"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="mulshop">{{$t('receipt.labShop')}}</label>
                <select id="mulshop" name="multiselect[]" multiple="multiple">
                  <option v-for="item in condition.shopList" :value="item.value">{{item.label}}</option>
                </select>
              </div>
            </el-col>
            <el-col :span="12">
              <label for="conSearchId">查询条件：</label>
              <el-select id="conSearchId" v-model="listQuery.searchId" @change="handleSearchId" style="width:130px;">
                <el-option v-for="(label,value) in condition.searchIdOptions" :key="value" :value="value"
                           :label="label"></el-option>
              </el-select>
              <el-input style="width:210px;" id="conSearchText" v-model="listQuery.searchText" clearable
                        placeholder="请输入内容">
              </el-input>
            </el-col>
          </el-row>
        </div>

        <div class="rightBox1">
          <el-button type="primary" @click="getList" icon="el-icon-search">{{$t('receipt.btnSearch')}}</el-button>
        </div>
      </div>

      <!--操作导航栏-->
      <div class="col-nav">
        <ul>
          <li v-if="authorityCode.OMS_INVOICESCONTROL_UPLOAD" @click="handleUpload"><span>{{$t('receipt.btnUpload')}}</span></li>
          <li v-if="authorityCode.OMS_INVOICESCONTROL_REISSUE" @click="showChildBlock('receiptBilling')"><span>{{$t('receipt.btnBilling')}}</span></li>
          <li v-if="authorityCode.OMS_INVOICESCONTROL_REDDASHED" @click="handleRedBill"><span>{{$t('receipt.btnRedBill')}}</span></li>
          <li v-if="authorityCode.OMS_INVOICESCONTROL_SETTINGS" @click="showChildBlock('receiptSetting')"><span>{{$t('receipt.btnSetting')}}</span></li>
          <li v-if="authorityCode.OMS_INVOICESCONTROL_EXPORT" @click="handleExport"><span>{{$t('receipt.btnExport')}}</span></li>
          <li v-if="authorityCode.OMS_INVOICESCONTROL_DONEMANUALLY" @click="handleFinish"><span>{{$t('receipt.btnFinish')}}</span></li>
          <!--<li><span>{{$t('receipt.btnShowCol')}}</span></li>-->
        </ul>
      </div>

      <!--主数据表格区-->
      <div style="margin-top: 15px;">
        <el-table id="tabMain" :data="list" @selection-change="onListSel"
                  :height="tabHeight" border style="width: 100%">
          <el-table-column :label="$t('receipt.index')" fixed="left" type="index" align="center" width=50>
          </el-table-column>
          <el-table-column type="selection" fixed="left" align="center" width=50>
          </el-table-column>
          <el-table-column :label="$t('receipt.outorderId')" show-overflow-tooltip align="center" width=150>
            <template slot-scope="scope">
              <span>{{scope.row.sourceOrderNo}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" show-overflow-tooltip align="center" width=80>
            <template slot-scope="scope">
              <span>{{scope.row.orderStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.status')" show-overflow-tooltip align="center" width=80>
            <template slot-scope="scope">
              <span>{{scope.row.invoiceStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.typeName')" show-overflow-tooltip align="center" width=80>
            <template slot-scope="scope">
              <span>{{scope.row.invoiceTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.completdate')" show-overflow-tooltip align="center" width=120>
            <template slot-scope="scope">
              <span>{{scope.row.invoiceTimeName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.paydate')" show-overflow-tooltip align="center" width=120>
            <template slot-scope="scope">
              <span>{{scope.row.payDate}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.titletypeId')" show-overflow-tooltip header-align="center" width=80>
            <template slot-scope="scope">
              <span>{{scope.row.titleTypeName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.title')" show-overflow-tooltip header-align="center" width=150>
            <template slot-scope="scope">
              <span>{{scope.row.titleName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.taxNo')" show-overflow-tooltip header-align="center" width=100>
            <template slot-scope="scope">
              <span>{{scope.row.taxpayerNo}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.contenttypeName')" show-overflow-tooltip header-align="center" width=80>
            <template slot-scope="scope">
              <span>{{scope.row.invoiceContentName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.taxTotal')" show-overflow-tooltip header-align="center" align="right"
                           width=110>
            <template slot-scope="scope">
              <span>{{scope.row.invoiceAmt}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.taxAmount')" show-overflow-tooltip header-align="center" align="right"
                           width=80>
            <template slot-scope="scope">
              <span>{{scope.row.revenueAmt}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.taxTotalno')" show-overflow-tooltip header-align="center" align="right"
                           width=80>
            <template slot-scope="scope">
              <span>{{scope.row.minusRevenueAmt}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.recSerialno')" show-overflow-tooltip align="center" width=80>
            <template slot-scope="scope">
              <span>{{scope.row.invoiceFlowNo}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.recCode')" show-overflow-tooltip align="center" width=80>
            <template slot-scope="scope">
              <span>{{scope.row.invoiceCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发票号码" show-overflow-tooltip align="center" width=80>
            <template slot-scope="scope">
              <span>{{scope.row.invoiceNo}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.shopName')" show-overflow-tooltip header-align="center" min-width=200>
            <template slot-scope="scope">
              <span>{{scope.row.storeName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.buyerNick')" show-overflow-tooltip header-align="center">
            <template slot-scope="scope">
              <span>{{scope.row.buyerNick}}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" show-overflow-tooltip header-align="center">
            <template slot-scope="scope">
              <span>{{scope.row.mobile}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receipt.operate')" fixed="right" show-overflow-tooltip align="center" width=150>
            <template slot-scope="scope">
              <el-button @click='handleEdit(scope.row.invoiceId)'
                         v-if="authorityCode.OMS_INVOICESCONTROL_EDIT && scope.row.invoiceStatus != '2' && scope.row.invoiceStatus != '3'"
                         :disabled="scope.row.invoiceStatus == '2' || scope.row.invoiceStatus == '3'" type="text">
                {{$t('receipt.btnEdit')}}
              </el-button>
              <el-button @click="handleView(scope.row.invoiceId)" type="text">
                {{$t('receipt.btnView')}}
              </el-button>
              <el-button @click='handleDelete(scope.row)' type="text"
                         v-if="authorityCode.OMS_INVOICESCONTROL_DEL && scope.row.invoiceStatus != '2' && scope.row.invoiceStatus != '3'"
                         :disabled="scope.row.invoiceStatus == '2' || scope.row.invoiceStatus == '3'"
                         :style="{color: (scope.row.invoiceStatus == '2' || scope.row.invoiceStatus == '3') ? '#C0C4CC':'red'}">
                {{$t('receipt.btnDelete')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--编辑发票-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('receipt.tipEditBill')" :visible.sync="dialogEdit" width="800px">
        <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('receipt.labTypeName')">
                <el-select v-model="dataForm.invoiceType" disabled>
                  <el-option v-for="(label,value) in condition.typeIdOptions" :key="value" :value="value"
                             :label="label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('receipt.labContenttypeName')">
                <el-select v-model="dataForm.invoiceContent">
                  <el-option v-for="item in condition.contenttypeIdOptions" :key="item.value" :value="item.value"
                             :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="抬头类型：" prop="titleType">
                <el-select v-model="dataForm.titleType">
                  <el-option v-for="item in condition.titletypeIdOptions" :key="item.value" :value="item.value"
                             :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('receipt.labTitle')" prop="titleName">
                <el-input maxlength="100" v-model="dataForm.titleName" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税号：" prop="taxpayerNo">
                <el-input maxlength="100" v-model="dataForm.taxpayerNo" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('receipt.labTaxBank')">
                <el-input v-model="dataForm.openingBank" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('receipt.labTaxBankacc')">
                <el-input v-model="dataForm.bankAccount" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="$t('receipt.labTaxBankremark')">
            <el-input type="textarea" v-model="dataForm.remark"
                      maxlength="1000"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入内容" style="width: 100%;">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogEdit = false">取 消</el-button>-->
        <el-button type="primary" @click="confirmEdit">保 存</el-button>
      </span>
      </el-dialog>

      <!--查看发票详情-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('receipt.tipViewBill')" :visible.sync="dialogDetails" width="800px">
        <div class="invoiceDetail">
          <h4>发票信息</h4>
          <el-row style="margin-top:20px;">
            <el-col :span="8">
              <span class="invoiceLabel">发票类型：</span>
              <span>{{dataForm.invoiceTypeName}}</span>
            </el-col>
            <el-col :span="8">
              <span class="invoiceLabel">抬头类型：</span>
              <span>{{titleTypeObj[dataForm.titleType]}}</span>
            </el-col>
            <el-col :span="8">
              <span class="invoiceLabel">发票抬头：</span>
              <span class="ellipsis" style="width: 140px;display: inline-block;margin-bottom: -5px;"
                    :title="dataForm.titleName">{{dataForm.titleName}}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-col :span="8">
              <span class="invoiceLabel">纳税人识别号：</span>
              <span class="ellipsis" style="width:140px;display:inline-block;margin-bottom:-5px;"
                    :title="dataForm.taxpayerNo">{{dataForm.taxpayerNo}}</span>
            </el-col>
            <el-col :span="8">
              <span class="invoiceLabel">发票代码：</span>
              <span>{{dataForm.invoiceNo}}</span>
            </el-col>
            <el-col :span="8">
              <span class="invoiceLabel">发票流水号：</span>
              <span>{{dataForm.invoiceFlowNo}}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-col :span="8">
              <span class="invoiceLabel">开票金额：</span>
              <span>{{dataForm.invoiceAmt}}</span> 元
            </el-col>
            <el-col :span="8">
              <span class="invoiceLabel">去税金额：</span>
              <span>{{dataForm.minusRevenueAmt}}</span> 元
            </el-col>
            <el-col :span="8">
              <span class="invoiceLabel">税额：</span>
              <span>{{dataForm.revenueAmt}}</span> 元
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-col :span="8">
              <span class="invoiceLabel">开票状态：</span>
              <span>{{dataForm.invoiceStatusName}}</span>
            </el-col>
            <el-col :span="16">
              <span class="invoiceLabel">失败原因：</span>
              <span>{{dataForm.bizErrorMsg}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="invoiceDetail" style="margin-top:20px;">
          <h4>其他信息</h4>
          <el-row style="margin-top:20px;">
            <el-col :span="8">
              <span class="invoiceLabel">外部平台单号：</span>
              <span class="ellipsis" style="width: 140px;display: inline-block;margin-bottom: -5px;"
                    :title="dataForm.sourceOrderNo">{{dataForm.sourceOrderNo}}</span>
            </el-col>
            <el-col :span="8">
              <span class="invoiceLabel">店铺：</span>
              <span class="ellipsis" style="width: 140px;display: inline-block;margin-bottom: -5px;"
                    :title="dataForm.storeName">{{dataForm.storeName}}</span>
            </el-col>
            <el-col :span="8">
              <span class="invoiceLabel">买家ID：</span>
              <span class="ellipsis" style="width: 140px;display: inline-block;margin-bottom: -5px;"
                    :title="dataForm.buyerNick">{{dataForm.buyerNick}}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-col :span="8">
              <span class="invoiceLabel" style="width:60px;">付款时间：</span>
              <span>{{dataForm.payDateName}}</span>
            </el-col>
            <el-col :span="16">
              <span class="invoiceLabel">开票完成时间：</span>
              <span>{{dataForm.invoiceTimeName}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="invoiceDetail" style="margin-top:20px;">
          <h4>操作记录</h4>
          <el-table
            border
            :data="publicLogData"
            max-height="380"
            style="margin-top:15px;"
          >
            <el-table-column
              type="index"
              align='center'
              label="序号"
              width="60">
            </el-table-column>
            <el-table-column
              prop="operateName"
              align='center'
              label="操作类型"
              width="">
            </el-table-column>
            <el-table-column
              prop="operateRemark"
              align='center'
              label="操作描述"
              :show-overflow-tooltip='true'
              width="">
            </el-table-column>
            <el-table-column
              prop="operater"
              align='center'
              label="操作人"
              width="">
            </el-table-column>
            <el-table-column
              prop="operateTime"
              align='center'
              min-width=''
              label="操作时间">
            </el-table-column>
            <el-table-column
              prop="opersteIp"
              label="IP"
              min-width=''
              align='center'
              width="">
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDetails = false">关 闭</el-button>
      </span>
      </el-dialog>

      <div class="col-pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page"
                       :page-sizes="[15,30,50,100,200]" :page-size="listQuery.size"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <invoices-billing v-if="paramsObj.invoicesBilling" @changeShow="changeShow"></invoices-billing>
    <invoices-setting v-if="paramsObj.InvoicesSetting" @changeShow="changeShow"></invoices-setting>
  </div>
</template>
<script>
  //import { fetchReceipt, getOrderReceipt, updateOrderReceipt, deleteReceipt, uploadReceipt, uploadRedReceipt, exportReceipt, finishReceipt } from '@/api/receiptService'
  import {turnTimestamp, isStrEmpty} from '@/assets/js/validate.js'
  import InvoicesBilling from '@/components/views/order/children/InvoicesControlBilling.vue';
  import InvoicesSetting from '@/components/views/order/children/InvoicesControlSetting.vue';

  export default {
    name: 'receipt-main',
    components: {
      InvoicesBilling,
      InvoicesSetting
    },
    data() {
      var validateTitletypeId = (rule, value, callback) => {
        if (value == '1') {
          this.rules['taxpayerNo'][0].required = true;
        } else {
          this.rules['taxpayerNo'][0].required = false;
        }
        this.$nextTick(() => {
          this.$refs.dataForm.validateField('taxpayerNo');
        })
        callback();
      };
      var validateTaxNo = (rule, value, callback) => {
        if (!value && this.dataForm.titleType == 1) {
          callback(new Error('企业开票，纳税人识别号必须输入！'));
        } else {
          callback();
        }
      };
      return {
        paramsObj: {
          mainPageShow: true,
          invoicesBilling: false,
          InvoicesSetting: false,
        },//组件传参
        apiVersion: '1.0.0',
        loading: false,
        publicLogData: [],//公共日志组件
        condition: {//asd
          dateTypeOptions: {},
          searchIdOptions: {},
          statusOptions: {},
          typeIdOptions: {},
          contenttypeIdOptions: [
            {value: 1, label: '明细'}
          ],
          titletypeIdOptions: [
            {value: 1, label: '企业'},
            {value: 2, label: '个人'}
          ],
          shopList: null,
          shopId: []
        },//查询条件下拉集合
        titleTypeObj: {
          1: '企业',
          2: '个人'
        },//抬头类型
        list: null,//主数据表格data
        total: null,//总页数
        listQuery: {
          dateType: '1',
          startTime: '',
          endTime: '',
          invoiceStatus: '',
          shopId: '',
          invoiceType: '',
          searchId: '1',
          searchText: '',
          page: 1,
          size: 15
        },//查询条件
        listSel: [],//主数据选中集合
        tabHeight: 300,

        dialogEdit: false,//编辑发票弹框
        dialogDetails: false,//查看发票详情弹框
        dataForm: {
          invoiceId: '', // 发票Id 主键
          typeId: 1, // 发票类型
          // typeName: '正常发票', // 发票类型名称
          contenttypeId: 1, // 开票内容类型
          // contenttypeName: '明细', // 开票内容类型名称
          titleType: 2, // 抬头类型
          // titletypeName: '个人', // 抬头类型名称
          title: '', // 发票抬头
          taxBank: '', // 开户银行
          taxBankacc: '', // 银行账户
          taxBankremark: '', // 备注信息
          taxpayerNo: '' // 纳税人识别号
        },//编辑发票data
        rules: {
          titleType: [{validator: validateTitletypeId, trigger: 'change'}],
          titleName: [{required: true, message: this.$t('receipt.ruleTitle'), trigger: 'blur'}],
          taxpayerNo: [{required: false, validator: validateTaxNo, trigger: 'blur'}]
        },//编辑发票校验规则
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
      }
    },
    filters: {
      statusFilter(type) {
        const typeids = {1: '未开票', 2: '开票中', 3: '开票成功', 4: '开票失败'}
        return typeids[type]
      }
    },
    created() {
      //查询条件下拉，表格数据渲染
      this.initMain();
      this.$nextTick(() => {
        this.onResize()
      })
    },
    mounted() {
      // 店铺设置
      $('#mulshop').multiselect({
        onInitialized: function (select, container) {
          $("._scroll").yi_scroll();
        }
      });
      window.onresize = () => {
        this.onResize()
      }
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if (e && e.keyCode == 13) { // enter 键
          //调接口
          this.getList();
        }
      };
    },
    methods: {
      //组件回传
      changeShow(param) {
        this.getList();
        this.paramsObj = {
          mainPageShow: true,
          invoicesBilling: false,
          InvoicesSetting: false,
        }
      },
      onResize() {
        const clientHeight = document.body.clientHeight
        this.tableTop = document.getElementById('tabMain').offsetTop
        if (clientHeight - this.tableTop - 100 > 100) {
          this.tabHeight = clientHeight - this.tableTop - 100
        } else {
          this.tabHeight = 100
        }
      },
      //查询条件下拉
      initMain() {
        this.handleDateType()
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getPageElement').then(response => {
          if (response.data.success) {
            //店铺下拉
            this.condition.shopList = [];
            for (var item in response.data.result.elem_store) {
              this.condition.shopList.push({
                value: item,
                label: response.data.result.elem_store[item]
              })
            }
            $('#mulshop').multiselect('dataprovider', this.condition.shopList);
            //日期类型
            this.condition.dateTypeOptions = response.data.result.elem_orderTimeType;
            //开票状态
            this.condition.statusOptions = response.data.result.elem_invoiceStatus;
            //发票类型
            this.condition.typeIdOptions = response.data.result.elem_invoiceType;
            //查询条件
            this.condition.searchIdOptions = response.data.result.elem_selfSearchType;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
        this.getList()
      },
      //时间初始化
      handleDateType(val) {
        var today = new Date();
        this.listQuery.startTime = new Date((new Date(today - 3600 * 1000 * 24 * 7)).toLocaleDateString()).getTime();
        this.listQuery.endTime = new Date(today.toLocaleDateString() + ' 23:59:59').getTime();
      },
      //选择时间控件
      channelChangeTime() {
        this.listQuery.startTime = this.listQuery.startTime == null ? '' : this.listQuery.startTime;
        this.listQuery.endTime = this.listQuery.endTime == null ? '' : this.listQuery.endTime;
        if (this.listQuery.startTime && this.listQuery.endTime && this.listQuery.startTime > this.listQuery.endTime) {
          this.$message({
            message: '起始时间不能大于结束时间！',
            type: 'warning'
          });
          this.listQuery.endTime = this.listQuery.startTime + 24 * 3600000;
        }
        if (this.listQuery.startTime && this.listQuery.endTime && this.listQuery.startTime + 3 * 30 * 24 * 3600000 < this.listQuery.endTime) {
          this.$message({
            message: '开始时间和结束时间最大跨度不能超过3个月！',
            type: 'warning'
          });
          let y = new Date(this.listQuery.startTime).getFullYear();
          let m = new Date(this.listQuery.startTime).getMonth() + 3;
          let d = new Date(this.listQuery.startTime).getDate();
          this.listQuery.endTime = new Date(y, m, d).getTime();
          ;
        }
      },
      //初始化表格数据
      getList() {
        this.listQuery.shopIds = $('#mulshop').val() ? $('#mulshop').val() : '';
        this.loading = true;
        //fetchReceipt(this.listQuery)
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/showReceipt', this.listQuery).then(response => {
          if (response.data.success === true) {
            this.listSel = []
            this.list = response.data.result.rows;
            this.list.forEach((item, i) => {
              item.invoiceTime = turnTimestamp(item.invoiceTime);
              item.payDate = turnTimestamp(item.payDate);
            })
            this.total = response.data.result.total
            this.listQuery.page = response.data.result.page
            this.listQuery.size = response.data.result.size
            this.loading = false
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
            this.loading = false
          }
        }).catch((error) => {
          this.loading = false
        })
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      //编辑
      handleEdit(invoiceId) {
        this.dialogEdit = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.initDataForm(invoiceId)
        })
      },
      //初始化回显
      initDataForm(invoiceId) {
        if (invoiceId !== '') {
          const _item = {invoiceId: invoiceId}
          //getOrderReceipt(_item)
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getSingleInvoice', _item).then(response => {
            if (response.data.success) {
              this.dataForm = response.data.result;
              this.dataForm.invoiceType += '';
              this.dataForm.invoiceContent *= 1;

              if (this.dataForm.titleType == '1') {
                this.rules['taxpayerNo'][0].required = true
              } else {
                this.rules['taxpayerNo'][0].required = false
              }
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          }).catch((error) => {
            console.log(error.toString())
          })
        }
      },
      //编辑保存
      confirmEdit() {
        // console.log('confirmEdit');
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //updateOrderReceipt(this.dataForm)
            this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/updateSingleInvoice', this.dataForm).then(response => {
              if (response.data.success) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.dialogEdit = false
                // 保存成功后刷新
                this.getList()
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            }).catch((error) => {
              console.log(error.toString())
            })
          }
        })
      },
      //查看
      handleView(invoiceId) {
        this.dialogDetails = true;
        this.initDataForm(invoiceId);

        this._post('com.edb01.erp.log.service.api.OperateLogService/' + this.apiVersion + '/getLogList', {
          sourceType: 27,
          sourceId: invoiceId,
        }).then((response) => {
          if (response.data.code == 0) {
            this.publicLogData = response.data.result;
            this.publicLogData.forEach((item, i) => {
              item.operateTime = turnTimestamp(item.operateTime);
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //跳转页面
      showChildBlock(clockBlock) {
        //this.$emit('toblock', clockBlock)
        switch (clockBlock) {
          case 'receiptSetting':
            //this.$router.push({name: 'invoicesControlSetting'});
            this.paramsObj = {
              mainPageShow: false,
              invoicesBilling: false,
              InvoicesSetting: true,
            }
            break;
          case 'receiptBilling':
            //this.$router.push({name: 'invoicesControlBilling'});
            this.paramsObj = {
              mainPageShow: false,
              invoicesBilling: true,
              InvoicesSetting: false,
            }
            break;
        }
      },
      //删除
      handleDelete(row) {
        this.$confirm(this.$t('receipt.deteleReceipt'), this.$t('receipt.handlePrompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          const item = {invoiceId: row.invoiceId}
          //deleteReceipt(item)
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/deleteSingleInvoice', item).then(response => {
            if (response.data.success) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              });
              this.getList();
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          }).catch((error) => {
            console.log(error.toString())
          })
        })
      },
      //查询条件下拉改变
      handleSearchId(val) {
        this.listQuery.searchText = ''
      },
      //选中表格数据
      onListSel(val) {
        this.listSel = val
      },
      //手工完成开票
      handleFinish() {
        let _recIds = []
        this.listSel.map(v => {
          _recIds.push(v.invoiceId);
        })
        if (this.listSel.length === 0) {
          this.$message({
            message: '请选择未开票状态的发票进行手工开票',
            type: 'warning'
          })
          return;
        }
        // 选择未开票或开票失败状态，提示“是否确认手工开票，确认后发票将置为开票成功”
        this.$confirm('是否确认手工开票，确认后发票将置为开票成功', this.$t('receipt.handlePrompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          const item = {invoiceIds: _recIds.join(',')}
          //finishReceipt(item)
          this.loading = true;
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/handWorkeReceipt', item).then(response => {
            this.loading = false;
            if (response.data.success) {
              this.$confirm('共上传' + response.data.result.totalCount + '张，开票成功' + response.data.result.successCount + '张，开票失败' + response.data.result.failCount + '张！仅未开票和开票失败状态的发票可手工开票。', '开票结果', {
                showCancelButton: false,
                center: true
              })
              this.getList()
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          }).catch((error) => {
            console.log(error.toString())
          })
        })
      },
      //上传开票
      handleUpload() {
        // 点击【上传发票】开票状态为未开票或开票失败的发票进行上传(正常发票，红冲发票都可上传)
        let _recIds = []
        this.listSel.map(v => {
          _recIds.push(v.invoiceId)
        })
        if (this.listSel.length === 0) {
          this.$message({
            message: '请选择需要上传的发票',
            type: 'warning'
          })
          return
        }
        const item = {invoiceIds: _recIds.join(',')}
        //uploadReceipt(item)
        this.loading = true;
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/uploadInvoice', item).then(response => {
          this.loading = true;
          if (response.data.success) {
            this.$confirm('共上传' + response.data.result.totalCount + '张，开票成功' + response.data.result.successCount + '张，开票失败' + response.data.result.failCount + '张！仅未开票和开票失败且对应订单为已完成状态的发票可上传开票。', '开票结果', {
              showCancelButton: false,
              center: true
            })
            this.getList()
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //发票红冲
      handleRedBill() {
        let _recIds = [];
        this.listSel.map(v => {
          _recIds.push(v.invoiceId);
        })
        if (this.listSel.length == 0) {
          this.$message({
            message: '请选择开票状态为开票成功的正常发票进行红冲',
            type: 'warning'
          })
          return;
        }
        // 勾选的发票中,只是将(开票成功+正常发票)上传至开票平台进行红冲；提示“是否对此发票进行红冲”
        this.$confirm('确认进行发票红冲？', this.$t('receipt.handlePrompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          this.loading = true;
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/uploadRedReceipt', {invoiceIds: _recIds.join(',')}).then(response => {
            this.loading = false;
            if (response.data.success) {
              this.$confirm('共上传' + response.data.result.totalCount + '张，红冲成功' + response.data.result.successCount + '张，红冲失败' + response.data.result.failCount + '张！仅开票成功和红冲失败的发票可进行发票红冲。', '发票红冲结果', {
                showCancelButton: false,
                center: true
              })
              this.getList()
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        })
      },
      //发票导出
      handleExport() {
        console.log(this.listQuery);
        var item = {};
        item.dateType = this.listQuery.dateType;
        item.startTime = this.listQuery.startTime;
        item.endTime = this.listQuery.endTime;
        item.invoiceStatus = this.listQuery.invoiceStatus;
        item.invoiceType = this.listQuery.invoiceType;
        item.searchId = this.listQuery.searchId;
        item.searchText = this.listQuery.searchText;
        item.shopIds = $('#mulshop').val() ? $('#mulshop').val() : '';
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/export', item).then(response => {
          if (response.data.success) {
            // 这里返回的是一个Long型数据
            if (!isStrEmpty(response.data.result)) {
              location.href = 'http://'+ process.env.FILE_API +'/files-web/download/' + response.data.result;
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
    }
  }
</script>
<style scoped>
  .invoiceDetail h4 {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  }

  .invoiceDetail .invoiceLabel {
    width: 90px;
    text-align: right;
    display: inline-block;
  }
</style>

