<!--发票管理-发票档案设置-税务设置 樊虎-->
<template>
  <div id="invoicesControlSettingTax">
    <!--查询条件-->
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label for="conPlanName2">{{$t('receipt.labPlanName')}}</label>
              <el-input id="conPlanName2" v-model="listQuery.taxNoSetupName" clearable></el-input>
            </div>
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
        <li @click="handleEdit('')"><span>{{$t('receipt.btnAdd')}}</span></li>
      </ul>
    </div>

    <!--主数据表格区-->
    <div style="margin-top: 20px;">
      <el-table id="tab_setting" :data="list" v-loading.body="listLoading"
                :height="tabHeight" border style="width: 100%">
        <el-table-column :label="$t('receipt.index')" type="index" align="center" width=50>
        </el-table-column>
        <el-table-column :label="$t('receipt.planName')" show-overflow-tooltip head-align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handleView(scope.row.taxnoSetupId)">{{scope.row.taxnoSetupName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.isenable')" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleEnable(scope.row)" v-model="scope.row.enableFlag"></el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.typeid')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.setupType | typeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.taxNum')" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.taxno}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.operate')" align="center" width=130>
          <template slot-scope="scope">
            <el-button @click='handleEdit(scope.row.taxnoSetupId)'  type="text" :disabled="scope.row.enableFlag">
              {{$t("receipt.btnEdit")}}
            </el-button>
            <!--<el-button @click="dialogDetails=true" type="text">
              {{$t("receipt.btnView")}}
            </el-button>-->
            <el-button @click='handleDelete(scope.row)' type="text" :disabled="scope.row.enableFlag" :style="{color: scope.row.enableFlag ? '#C0C4CC':'red'}">
              {{$t("receipt.btnDelete")}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加、编辑方案-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('receipt.tipTaxNumPlan')" :visible.sync="dialogEdit" v-loading="loading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labPlanName')" prop="taxnoSetupName">
              <el-input v-model="dataForm.taxnoSetupName" :maxlength="40"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labTaxNum')" prop="taxno">
              <el-input v-model="dataForm.taxno" :maxlength="40"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labTypeid')" prop="setupType">
              <el-select v-model="dataForm.setupType" @change="onTypeidChange" :disabled="beanList.length > 0" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in condition.typeidOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-top:7px;">
            <el-button type="text" @click="onAdd" :disabled="this.dataForm.setupType===''" style="margin-left: 20px">{{$t('receipt.btnAdd')}}</el-button>
            <el-button type="text" @click="onReset">{{$t('receipt.btnReset')}}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-show="this.dataForm.setupType !== ''" :data="beanList" v-loading.body="listLoading" border height="300" style="width: 100%">
        <el-table-column :label="$t('receipt.index')" type="index" align="center">
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '1'" :label="$t('receipt.skuUrl')" align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right">
              <div slot="content">
                <img v-if="scope.row.goodsUrl != ''" :src="scope.row.goodsUrl" alt="" style="max-width:300px;">
              </div>
              <img v-if="scope.row.goodsUrl != ''" :src="scope.row.goodsUrl" alt="">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '1'" :label="$t('receipt.skuCode')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.goodsCode}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '1'" show-overflow-tooltip :label="$t('receipt.skuName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.goodsName}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '2'" :label="$t('receipt.brandName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.brandName}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '3'" :label="$t('receipt.sortName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.catalogName}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '4'" :label="$t('receipt.shopName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.storeName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.operate')" align="center" style="width: 100px">
          <template slot-scope="scope">
            <el-button @click='onRowDelete(scope.row)' type="text" style="color: red;">
              {{$t("receipt.btnDelete")}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" align="center">
        <el-button type="primary" @click="confirmEdit">{{$t('receipt.btnSave')}}</el-button>
      </span>
    </el-dialog>

    <!--查看方案详情-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('receipt.tipViewPlan')" :visible.sync="dialogDetails" width="600px">
      <el-form :model="dataForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labPlanName')">
              <el-input v-model="dataForm.taxnoSetupName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labTaxNum')">
              <el-input v-model="dataForm.taxno" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
       <!-- <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labTypeid')">
              <el-select v-model="dataForm.typeid" disabled style="width: 100%">
                <el-option v-for="item in condition.typeidOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>-->
      </el-form>
      <h5>设置内容</h5>
      <el-table v-show="this.dataForm.setupType !== ''" :data="beanList" v-loading.body="listLoading" border max-height="300" style="width: 100%">
        <el-table-column :label="$t('receipt.index')" type="index" align="center">
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '1'" :label="$t('receipt.skuUrl')" align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right">
              <div slot="content">
                <img v-if="scope.row.goodsUrl != ''" :src="scope.row.goodsUrl" alt="" style="max-width:300px;">
              </div>
              <img v-if="scope.row.goodsUrl != ''" :src="scope.row.goodsUrl" alt="">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '1'" :label="$t('receipt.skuCode')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.goodsCode}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '1'" :label="$t('receipt.skuName')" head-align="center" :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{scope.row.relevanceIdText}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '2'" :label="$t('receipt.brandName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.relevanceIdText}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '3'" :label="$t('receipt.sortName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.relevanceIdText}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType == '4'" :label="$t('receipt.shopName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.relevanceIdText}}</span>
          </template>
        </el-table-column>
      </el-table>
      <h5 style="margin-top:15px;">操作日志</h5>
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
      <span slot="footer" align="center">
        <el-button @click="dialogDetails = false">{{$t('receipt.btnClose')}}</el-button>
      </span>
    </el-dialog>

    <!--添加【商品、品牌、分类、店铺】过滤-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :visible.sync="dialogSearch" width="780px" v-loading="loading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
      <!--<el-input v-model="searchText" clearable style="width: 50%">
        <el-button @click="onSearch" slot="append" icon="el-icon-search"></el-button>
      </el-input>-->
      <div style="display:inline-block;width:420px;" v-if="dataForm.setupType === '1'">
        <span>商品编号：</span>
        <el-input type="text" v-model="paramData.goodsNo" style="width:200px;"></el-input>
      </div>
      <div style="display:inline-block;width:420px;" v-if="dataForm.setupType === '2'">
        <span>品牌：</span>
        <el-input type="text" v-model="paramData.brandName" style="width:200px;"></el-input>
      </div>
      <div style="display:inline-block;width:420px;" v-if="dataForm.setupType === '3'">
        <span>商品分类：</span>
        <el-input type="text" v-model="paramData.goodsCategoryName" style="width:200px;"></el-input>
      </div>
      <div style="display:inline-block;width:420px;" v-if="dataForm.setupType === '4'">
        <span>店铺：</span>
        <el-input type="text" v-model="paramData.storeName" style="width:200px;"></el-input>
      </div>
      <el-button @click="onSearch" type="primary">查询</el-button>
      <el-table :data="searchList" @selection-change="onSearchSel"
                height="380" border style="width: 100%; margin-top: 20px">
        <el-table-column :label="$t('receipt.index')" type="index" align="center">
        </el-table-column>
        <el-table-column type="selection" align="center">
        </el-table-column>
        <el-table-column v-if="dataForm.setupType === '1'" :label="$t('receipt.skuUrl')" align="center">
          <template slot-scope="scope">
            <el-tooltip placement="right">
              <div slot="content">
                <img v-if="scope.row.goodsUrl != ''" :src="scope.row.goodsUrl" alt="" style="max-width:300px;">
              </div>
              <img v-if="scope.row.goodsUrl != ''" :src="scope.row.goodsUrl" alt="">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType === '1'" :label="$t('receipt.skuCode')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.goodsCode}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType === '1'" :show-overflow-tooltip='true' :label="$t('receipt.skuName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.goodsName}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType === '2'" :label="$t('receipt.brandName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.brandName}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType === '3'" :label="$t('receipt.sortName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.catalogName}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dataForm.setupType === '4'" :label="$t('receipt.shopName')" head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.storeName}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSaveSearch">{{$t('receipt.btnOk')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
//  import { fetchReceiptTaxPlan, getReceiptTaxPlan, addReceiptTaxPlan, updateReceiptTaxPlan, deleteReceiptTaxPlan, enableReceiptTaxPlan,
//    fetchSku, fetchBrand, fetchProductSort, fetchShopEx } from '@/api/receiptService'
  import { isStrEmpty } from '@/assets/js/validate.js'

  export default {
    name: 'receipt-tax',
    props: {
      tabHeight: Number
    },
    data() {
      return {
        apiVersion: '1.0.0',
        currentPage:1,
        totalPage:15,
        totalNum:0,
        paramData:{
          goodsNo:'',
          brandName:'',
          goodsCategoryName:'',
          storeName:''
        },//添加【商品、品牌、分类、店铺】查询条件
        index: '',//图片index
        goodsUrl: '',//图片url
        condition: {
          typeidOptions: [
            { value: '1', label: '商品编号' },
            { value: '2', label: '品牌' },
            { value: '3', label: '商品分类' },
            { value: '4', label: '店铺' }
          ],
          taxrateTypeidOptions: [   //【税率】下拉选项
            { value: '1', label: '0' },
            { value: '2', label: '0.03' },
            { value: '3', label: '0.04' },
            { value: '4', label: '0.06' },
            { value: '5', label: '0.11' },
            { value: '6', label: '0.13' },
            { value: '7', label: '0.17' }
          ]
        },//下拉集合
        list: null,//表格tableData
        total: null,
        listLoading: false,
        loading:false,
        listQuery: {
          taxNoSetupName: ''
        },//查询条件
        dialogEdit: false,//新建编辑弹框
        dialogDetails: false,//查看弹框
        dataForm: {
          taxnoSetupId: '',
          taxnoSetupName: '',
          taxno: '',
          setupType: '',
          fromIds: ''
        },//新建编辑参数
        rules: {
          taxnoSetupName: [{ required: true, message: this.$t('receipt.rulePlanName'), trigger: 'blur' }],
          taxno: [{ required: true, message: this.$t('receipt.ruleTaxNum'), trigger: 'blur' }],
          setupType: [{ required: true, message: this.$t('receipt.ruleTypeid'), trigger: 'change' }]
        },//表单校验规则
        beanList: [],//税务编号方案表格tableData
        dialogSearch: false,//添加【商品、品牌、分类、店铺】过滤弹框
        searchText: '',//查询条件
        searchList: [],//添加【商品、品牌、分类、店铺】过滤弹框表格tableData
        searchSel: [],//添加【商品、品牌、分类、店铺】过滤弹框表格选中值
        publicLogData:[],//日志表格tableData
      }
    },
    filters: {
      typeFilter(type) {
        const typeids = { '1': '商品编号', '2': '品牌', '3': '商品分类', '4': '店铺' }
        return typeids[type]
      }
    },
    created() {
      this.getList()
    },
    mounted(){
    },
    methods: {
      //初始化表格
      getList() {
        this.listLoading = true
        //fetchReceiptTaxPlan(this.listQuery)
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getTaxNoSetUpList',this.listQuery).then(response => {
          if (response.data.success) {
            this.list = response.data.result;
            this.listLoading = false
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
            this.listLoading = false
          }
        })
      },
      //查看
      handleView(taxnoSetupId) {
        //日志
        this._post('com.edb01.erp.log.service.api.OperateLogService/'+this.apiVersion+'/getLogList',{
          sourceType:0,
          sourceId:taxnoSetupId,
          operateTypes:''
        }).then((response)=>{
          if(response.data.code==0){
            this.publicLogData = response.data.result;
            this.publicLogData.forEach((item, i) => {
              item.operateTime = turnTimestamp(item.operateTime);
            })
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
        this.beanList = [];
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getSingleTaxNoSetUp',{taxnoSetupId}).then(response => {
          if(response.data.success){
            this.dialogDetails = true;
            this.dataForm = response.data.result;
            setTimeout(()=>{
              this.beanList = response.data.result.chooseTextBean;
            })
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //删除
      handleDelete(row) {
        this.$confirm(this.$t('receipt.detelePlan'), this.$t('receipt.handlePrompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          const item = { taxnoSetupId: row.taxnoSetupId }
          //deleteReceiptTaxPlan(item)
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/deleteTaxNoSetUp',item).then(response => {
            if (response.data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getList();
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        })
      },
      //启用停用
      handleEnable(row) {
        this.$confirm('是否'+ (row.enableFlag ? '启用':'停用') +'该方案?', this.$t('orderSign.prompt'), {
          // type: 'warning'
          center: true
        }).then(() => {
          const item = { taxnoSetupId: row.taxnoSetupId, isEnable: row.enableFlag }
          //enableReceiptTaxPlan(item)
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/isEnableTaxNoSetUpBean',item).then(response => {
            if (response.data.success) {
              var edit = row.enableFlag?'启用':'停用';
              this.$message({
                message: edit + '成功！',
                type: 'success'
              });
            }else{
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
              row.enableFlag = !row.enableFlag;
            }
          }).catch((error) => {
            row.enableFlag = !row.enableFlag;
          })
        }).catch(()=>{
          row.enableFlag = !row.enableFlag;
        })
      },
      //添加或编辑
      handleEdit(taxnoSetupId) {
        if (this.list.length >= 20 && taxnoSetupId == '') {
          this.$message({
            message: '最多可添加20条方案！',
            type: 'warning'
          });
          return
        }
        this.initDataForm(taxnoSetupId)
        // this.$refs['dataForm'].resetFields()
      },
      //设置类型
      onTypeidChange() {
        this.searchText = ''
        this.searchList = []
        this.searchSel = []
        this.beanList = []
      },
      //税务编号方案表格初始化
      initDataForm(taxnoSetupId) {
        this.onTypeidChange();
        this.dataForm = {
          taxnoSetupId: '',
          taxnoSetupName: '',
          taxno: '',
          setupType: '1',
          setupTypeText: ''
        }
        if (taxnoSetupId !== '') {
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getSingleTaxNoSetUp',{taxnoSetupId}).then(response => {
            if(response.data.success){
              this.dialogEdit = true;
              this.dataForm = response.data.result;
              this.dataForm.setupType += '';
              setTimeout(()=>{
                this.beanList = response.data.result.chooseTextBean;
                this.beanList.forEach((item,i)=>{
                  if(this.dataForm.setupType == 1){
                    item.goodsName = item.relevanceIdText;
                    item.goodsId = item.relevanceId;
                  }else if(this.dataForm.setupType == 2){
                    item.brandId = item.relevanceId;
                    item.brandName = item.relevanceIdText;
                  }else if(this.dataForm.setupType == 3){
                    item.catalogName = item.relevanceIdText;
                    item.catalogId = item.relevanceId;
                  }else if(this.dataForm.setupType == 4){
                    item.storeName = item.relevanceIdText;
                    item.storeId = item.relevanceId;
                  }
                })
              })
            }else{
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }else{
          this.dialogEdit = true;
        }
      },
      //重置
      onReset() {
        this.dataForm.setupType = '1'
        this.onTypeidChange()
      },
      //添加编辑方案
      onAdd() {
        this.currentPage = 1;
        this.totalPage = 15;
        this.paramData = {
          goodsNo:'',
          brandName:'',
          goodsCategoryName:'',
          storeName:'',
          setUpType:this.dataForm.setupType,
          page:1,
          size:15
        }
        this.searchList = [];
        this.searchSel = [];
        this.onSearch();
      },
      //添加【商品、品牌、分类、店铺】过滤查询
      onSearch() {
        this.loading = true;
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/addOrderInvoiceTaxNoSetType',this.paramData).then(response => {
          this.loading = false;
          if(response.data.success){
            this.dialogSearch = true;
            if(this.dataForm.setupType == 3){
              this.searchList = response.data.result.result.rows;
              this.totalNum = response.data.result.result.total;
            }else{
              this.searchList = response.data.result.rows;
              this.totalNum = response.data.result.total;
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch((error)=>{
          this.loading = false;
          console.log(error);
        })
      },
      //添加【商品、品牌、分类、店铺】过滤选中
      onSearchSel(val) {
        this.searchSel = val
      },
      handleSizeChange(val){
        this.totalPage = val;
        this.paramData.size = val;
        this.onSearch();
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.paramData.page = val;
        this.onSearch();
      },
      //确定
      onSaveSearch() {
        if (this.searchSel.length === 0) {
          this.$message({
            message: '请选择表格数据！',
            type: 'warning'
          });
          return;
        }
        var mapArr = new Map(),ID = '';
        if(this.dataForm.setupType == 1){
          ID = 'goodsId';
        }else if(this.dataForm.setupType == 2){
          ID = 'brandId';
        }else if(this.dataForm.setupType == 3){
          ID = 'catalogId';
        }else if(this.dataForm.setupType == 4){
          ID = 'storeId';
        }
        this.beanList.forEach((item,i)=>{
          mapArr.set(item[ID],item);
        })
        this.searchSel.forEach((item,i)=>{
          if(!mapArr.get(item[ID])){
            this.beanList.push(item);
          }
        })
        this.dialogSearch = false;
      },
      //删除
      onRowDelete(row) {
        this.$confirm(this.$t('receipt.deteleItem'), this.$t('receipt.handlePrompt'), {
          center: true
        }).then(() => {
          const index = this.beanList.indexOf(row)
          this.beanList.splice(index, 1)
        })
      },
      //鼠标滑过离开表格图片
      showImg(row,index) {
        this.index = index
        this.goodsUrl = row.goodsUrl
      },
      showImg1() {
        this.index = ''
        this.goodsUrl = ''
      },
      //保存
      confirmEdit() {
        // console.log('confirmEdit');
        let _formIds = []
        switch (this.dataForm.setupType) {
          case '1': // '商品编号'
            _formIds = this.beanList.map(v => v.goodsId)
            break
          case '2': // '品牌'
            _formIds = this.beanList.map(v => v.brandId)
            break
          case '3': // '商品分类'
            _formIds = this.beanList.map(v => v.catalogId)
            break
          case '4': // '店铺'
            _formIds = this.beanList.map(v => v.storeId)
            break
        }
        this.dataForm.setupTypeText = _formIds.join(',')
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/addOrderInvoiceTaxNo',this.dataForm).then(response => {
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
    }
  }
</script>

<style scoped>

</style>
