<!--发票管理-发票档案设置-发票设置 樊虎-->
<template>
  <div id="invoicesControlBasic" v-loading="listLoading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <!--查询条件-->
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label for="mulshop2">{{$t('receipt.labShop')}}</label>
              <select id="mulshop2" name="multiselect[]" multiple="multiple">
                <option v-for="item in condition.shopList" :value="item.shopId">{{item.shopName}}</option>
              </select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="conPlanName1">{{$t('receipt.labPlanName')}}</label>
              <el-input id="conPlanName1" v-model="listQuery.planName" clearable></el-input>
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
        <el-checkbox :label="$t('receipt.chkSkuAlias')" v-model="paramStatus" @change="handleParamChange" style="margin-left: 390px;">
        </el-checkbox>
      </ul>
    </div>

    <!--主数据表格区-->
    <div style="margin-top: 20px;">
      <el-table id="tab_setting" :data="list"
                :height="tabHeight" border style="width: 100%">
        <el-table-column :label="$t('receipt.index')" type="index" align="center" width=50>
        </el-table-column>
        <el-table-column :label="$t('receipt.planName')" show-overflow-tooltip head-align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handleView(scope.row.invoiceBasicId)">{{scope.row.setupName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.isenable')" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleEnable(scope.row)" v-model="scope.row.enabledFlag"></el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.shopName')" show-overflow-tooltip head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.storeNames}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.compName')" show-overflow-tooltip head-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.drawerName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.taxregNum')" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.taxNo}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.taxuser')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.drawer}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.chkuser')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.reviewer}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.receiveuser')" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.payee}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.operate')" align="center" width=130>
          <template slot-scope="scope">
            <el-button @click='handleEdit(scope.row.invoiceBasicId)'  type="text" :disabled="scope.row.enabledFlag">
              {{$t("receipt.btnEdit")}}
            </el-button>
            <!--<el-button @click="dialogDetails=true" type="text">
              {{$t("receipt.btnView")}}
            </el-button>-->
            <el-button @click='handleDelete(scope.row)' type="text" :disabled="scope.row.enabledFlag" :style="{color: scope.row.enabledFlag ? '#C0C4CC':'red'}">
              {{$t("receipt.btnDelete")}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加、编辑方案-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('receipt.tipBasicSetting')" :visible.sync="dialogEdit" width="800px" class="invoicesControlBasic">
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labPlanName')" prop="setupName">
              <el-input v-model="dataForm.setupName" :maxlength="40"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labShopIds')" prop="shopIds">
              <!--<el-select v-model="condition.shopBean" @change="onShopChange" multiple collapse-tags clearable filterable placeholder="请选择" style="width: 100%">
                <el-option v-for="item in condition.shopList" :key="item.shopId" :value="item.shopId" :label="item.shopName"></el-option>
              </el-select>-->
              <select id="mulshopplan" name="multiselect[]" multiple="multiple" style="width:100px;">
                <option v-for="item in condition.shopList" :value="item.value">{{item.label}}</option>
              </select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('receipt.labCompName')" prop="drawerName">
          <el-input v-model="dataForm.drawerName" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labAuthcode')" prop="apiKey" label-width="130px">
          <el-input v-model="dataForm.apiKey" :maxlength="60"></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labTaxregNum')" prop="taxNo" label-width="130px">
          <el-input v-model="dataForm.taxNo" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labCompBankacc')" prop="drawerBankAccountNo" label-width="130px">
          <el-input v-model="dataForm.drawerBankAccountNo" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labCompAddress')" prop="drawerAddress">
          <el-input v-model="dataForm.drawerAddress" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labCompTel')" prop="drawerPhone">
          <el-input v-model="dataForm.drawerPhone" :maxlength="15"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('receipt.labTaxuser')" prop="drawer">
              <el-input v-model="dataForm.drawer" :maxlength="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('receipt.labChkuser')" prop="reviewer">
              <el-input v-model="dataForm.reviewer" :maxlength="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('receipt.labReceiveuser')" prop="payee">
              <el-input v-model="dataForm.payee" :maxlength="8"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" align="center">
        <el-button type="primary" @click="confirmEdit">{{$t('receipt.btnSave')}}</el-button>
      </span>
    </el-dialog>

    <!--查看方案详情-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('receipt.tipViewPlan')" :visible.sync="dialogDetails" width="800px">
      <el-form :model="dataForm" label-width="140px">
        <el-form-item :label="$t('receipt.labPlanName')">
          <el-input v-model="dataForm.setupName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labShopIds')">
          <el-input type="textarea" v-model="dataForm.shopNames" :autosize="{ minRows: 1, maxRows: 4}" disabled style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labCompName')">
          <el-input v-model="dataForm.drawerName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labAuthcode')">
          <el-input v-model="dataForm.apiKey" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labTaxregNum')">
          <el-input v-model="dataForm.taxNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labCompBankacc')">
          <el-input v-model="dataForm.drawerBankAccountNo" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labCompAddress')">
          <el-input v-model="dataForm.drawerAddress" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('receipt.labCompTel')">
          <el-input v-model="dataForm.drawerPhone" disabled></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('receipt.labTaxuser')">
              <el-input v-model="dataForm.drawer" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('receipt.labChkuser')">
              <el-input v-model="dataForm.reviewer" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('receipt.labReceiveuser')">
              <el-input v-model="dataForm.payee" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" align="center">
        <el-button @click="dialogDetails = false">{{$t('receipt.btnClose')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //import { fetchReceiptPlan, getReceiptPlan, addReceiptPlan, deleteReceiptPlan, updateReceiptPlan, enableReceiptPlan, getSkuAlias, enableSkuAlias } from '@/api/receiptService'

  export default {
    name: 'receipt-basic',
    props: {
      tabHeight: Number
    },
    data() {
      return {
        apiVersion: '1.0.0',
        paramStatus: false,//使用商品别名添加发票
        condition: {
          shopList: null,
          shopId: [],
          shopBean: []
        },//下拉集合
        list: [],//表格tableData
        total: 0,
        listLoading: false,
        listQuery: {
          shopIds: '',
          planName: ''
        },//查询条件
        dialogEdit: false,//添加编辑方案弹框
        dialogDetails: false,//查看编辑方案弹框
        dataForm: {
          invoiceBasicId: ''
        },//添加编辑方案form
        rules: {
          setupName: [{ required: true, message: this.$t('receipt.rulePlanName'), trigger: 'blur' }],
          shopIds: [{ required: true, message: this.$t('receipt.ruleShopIds'), trigger: 'blur' }],
          drawerName: [{ required: true, message: this.$t('receipt.ruleCompName'), trigger: 'blur' }],
          apiKey: [{ required: true, message: this.$t('receipt.ruleAuthcode'), trigger: 'blur' }],
          taxNo: [{ required: true, message: this.$t('receipt.ruleTaxregNum'), trigger: 'blur' }],
          drawerBankAccountNo: [{ required: true, message: this.$t('receipt.ruleCompBankacc'), trigger: 'blur' }],
          drawerAddress: [{ required: true, message: this.$t('receipt.ruleCompAddress'), trigger: 'blur' }],
          drawerPhone: [{ required: true, message: this.$t('receipt.ruleCompTel'), trigger: 'blur' }],
          drawer: [{ required: true, message: this.$t('receipt.ruleTaxuser'), trigger: 'blur' }],
          reviewer: [{ required: true, message: this.$t('receipt.ruleChkuser'), trigger: 'blur' }],
          payee: [{ required: true, message: this.$t('receipt.ruleReceiveuser'), trigger: 'blur' }]
        },//表单校验规则
      }
    },
    created() {
      this.initSetting()
    },
    mounted() {
      var _this=this;
      // 店铺设置
      $('#mulshop2').multiselect({
        onInitialized: function (select, container) {
          $("._scroll").yi_scroll();
        }
      });
    },
    methods: {
      //初始化
      initSetting() {
        //getSkuAlias()
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getIsInvoicesUsingCommodityAliases').then(response => {
          if (response.data.success) {
            this.paramStatus = response.data.result
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getPageElement').then(response => {
          if (response.data.success) {
            //店铺下拉
            this.condition.shopList = [];
            for(var item in response.data.result.elem_store){
              this.condition.shopList.push({
                value:item,
                label:response.data.result.elem_store[item]
              })
            }
            $('#mulshop2').multiselect('dataprovider', this.condition.shopList);
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
        this.getList();
      },
      //多选框
      handleParamChange() {
        const _item = { isEnable: this.paramStatus }
        //enableSkuAlias(_item)
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/isInvoicesUsingCommodityAliases',_item).then(response => {
          if (response.data.success) {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
            this.paramStatus = !this.paramStatus
          }
        }).catch(() => {
          this.paramStatus = !this.paramStatus
        })
      },
      //获取表格数据
      getList() {
        this.listLoading = true
        //this.listQuery.shopIds = this.condition.shopId.join(',')
        this.$nextTick(()=>{
          this.listQuery.shopIds = $('#mulshop2').val()
          //fetchReceiptPlan(this.listQuery)
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getInvoiceBasicList',this.listQuery).then(response => {
            if (response.data.success === true) {
              this.list = response.data.result
              this.listLoading = false
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
              this.listLoading = false
            }
          }).catch((error) => {
            this.listLoading = false
          })
        })
      },
      //启用停用
      handleEnable(row) {
        this.$confirm('是否'+ (row.enabledFlag ? '启用':'停用') +'该方案?', this.$t('orderSign.prompt'), {
          // type: 'warning'
          center: true
        }).then(() => {
          const item = { invoiceBasicId: row.invoiceBasicId, isEnable: row.enabledFlag }
          //enableReceiptPlan(item)
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/isEnableInvoiceBasicPlanBean',item).then(response => {
            if (!response.data.success) {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
              row.enabledFlag = !row.enabledFlag
            }
          }).catch((error) => {
            row.enabledFlag = !row.enabledFlag
          })
        }).catch(()=>{
          row.enabledFlag = !row.enabledFlag
        })
      },
      //发票编辑校验参与店铺
      validateShop(){
        var _this=$('#mulshopplan');
        if($(_this).val().length==0){
          this.dataForm.shopIds = ''
        }else{
          this.dataForm.shopIds = $(_this).val()
        }
        this.$refs.dataForm.validateField('shopIds')
      },
      //删除
      handleDelete(row) {
        this.$confirm(this.$t('receipt.detelePlan'), this.$t('receipt.handlePrompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          const item = { invoiceBasicId: row.invoiceBasicId }
          //deleteReceiptPlan(item)
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/deleteInvoiceBasicPlan',item).then(response => {
            if (response.data.success === true) {
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
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
      //查看
      handleView(invoiceBasicId) {
        this.initDataForm(invoiceBasicId)
        this.dialogDetails = true
      },
      //新建编辑方案初始化
      initDataForm(invoiceBasicId) {
        this.condition.shopBean = []
        this.dataForm = {
          invoiceBasicId: '', // 方案Id
          setupName: '', // 方案名称
          drawerName: '', // 开票方名称
          apiKey: '', // 授权码
          taxNo: '', // 税务登记证号
          drawerBankAccountNo: '', // 开票公司银行账号
          drawerAddress: '', // 开票公司地址
          drawerPhone: '', // 开票公司电话
          drawer: '', // 开票人
          reviewer: '', // 复核人
          payee: '', // 收款人
          shopIds: '', // 店铺Id集合
        }

        $('#mulshopplan').multiselect('dataprovider', this.condition.shopList);
        $('#mulshopplan').multiselect('select',this.condition.shopBean);

        if (invoiceBasicId !== '') {
          const _item = { invoiceBasicId: invoiceBasicId }
          //getReceiptPlan(_item)
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getSingleInvoiceBasicPO',_item).then(response => {
            if(response.data.success){
              const _dataForm = response.data.result;
              this.condition.shopBean = _dataForm.shopIds.split(',');
              //console.log(this.condition.shopBean);
              // this.dataForm.shopIds = this.condition.shopBean.toString()
              $('#mulshopplan').multiselect('dataprovider', this.condition.shopList);
              $('#mulshopplan').multiselect('select',this.condition.shopBean);
              this.dataForm = {
                invoiceBasicId: _dataForm.invoiceBasicId, // 方案Id
                setupName: _dataForm.setupName, // 方案名称
                shopNames: _dataForm.shopNames, // 店铺名称
                drawerName: _dataForm.drawerName, // 开票方名称
                apiKey: _dataForm.apiKey, // 授权码
                taxNo: _dataForm.taxNo, // 税务登记证号
                drawerBankAccountNo: _dataForm.drawerBankAccountNo, // 开票公司银行账号
                drawerAddress: _dataForm.drawerAddress, // 开票公司地址
                drawerPhone: _dataForm.drawerPhone, // 开票公司电话
                drawer: _dataForm.drawer, // 开票人
                reviewer: _dataForm.reviewer, // 复核人
                payee: _dataForm.payee, // 收款人
                shopIds: this.condition.shopBean.toString(), // 店铺Id集合
              }
            }else{
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      //新建编辑方案
      handleEdit(invoiceBasicId) {
        if (this.list.length >= 20 && invoiceBasicId == '') {
          this.$message({
            message: '最多可添加20条方案',
            type: 'warning'
          });
          return
        }
        this.dialogEdit = true
        this.initDataForm(invoiceBasicId)

        this.$nextTick(()=>{
          var _this=this
          // 发票编辑-店铺设置
          $('#mulshopplan').multiselect({
            onInitialized: function (select, container) {
              $("._scroll").yi_scroll();
            },
            //下拉框关闭回调函数
            onDropdownHide: function (event) {
              _this.validateShop();
            }
          });

          this.$refs['dataForm'].resetFields()
        })
      },
      //新建编辑方案保存
      confirmEdit() {
        // console.log('confirmEdit');
        this.dataForm.shopIds=$('#mulshopplan').val()
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/addInvoiceBasicPlan',this.dataForm).then(response => {
              if (response.data.success) {
                this.$message({
                  message: '保存成功',
                  duration: 1000,
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
<style>
  #invoicesControlSetting .multiselect-native-select{
    width:100%;
  }
  .invoicesControlSetting .el-form-item__content{
    height:28px;
  }
</style>


