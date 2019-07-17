<!--发票管理-开票 樊虎-->
<template>
  <div id="invoicesControlBilling">
    <!--面包屑导航-->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="col-breadcrumb">
        <el-breadcrumb-item @click.native="showParentBlock">{{$t("receipt.receiptMain")}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t("receipt.receiptBilling")}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--查询条件-->
    <div id="searchBox" style="margin-top: 20px;">
      <div class="leftBox1">
        <div class="grid-content" style="width:370px !important;float:left;">
          <label for="conDateType">{{$t('receipt.labDateType')}}</label>
          <el-select id="conDateType" v-model="listQuery.timeSearchType" @change="handleDateType" style="width:120px !important;">
            <el-option v-for="(label,value) in condition.dateTypeOptions" :key="value" :value="value" :label="label"></el-option>
          </el-select>
          <el-date-picker id="conStartTime" @change="channelChangeTime" v-model="listQuery.timeSearchTimeStart" type="datetime" placeholder="选择日期时间" style="width:180px !important;"
                          format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' default-time="00:00:00">
          </el-date-picker>
        </div>
        <div class="grid-content" style="width:280px !important;float:left;">
          <label for="conEndTime">{{$t('receipt.labTo')}}：</label>
          <el-date-picker id="conEndTime" @change="channelChangeTime" v-model="listQuery.timeSearchTimeEnd" type="datetime" placeholder="选择日期时间"
                          format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' default-time="23:59:59">
          </el-date-picker>
        </div>
        <div class="grid-content" style="width:280px !important;float:left;">
          <label for="mulshop1">{{$t('receipt.labShop')}}</label>
          <select id="mulshop1" name="multiselect[]" multiple="multiple">
            <option v-for="item in condition.shopList" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="width:370px !important;float:left;">
          <label for="conSearchId">条件：</label>
          <el-select id="conSearchId" v-model="listQuery.conditionSearchType" @change="handleSearchId" style="width:120px !important;">
            <el-option v-for="(label,value) in condition.searchIdOptions" :key="value" :value="value" :label="label"></el-option>
          </el-select>
          <el-input id="conSearchText" v-model="listQuery.conditionSearchText" clearable placeholder="请输入内容" style="width:180px !important;">
          </el-input>
        </div>
        <div style="clear:both;"></div>
      </div>

      <div class="rightBox1">
        <el-button type="primary" @click="getList" icon="el-icon-search">{{$t('receipt.btnSearch')}}</el-button>
      </div>
    </div>

    <!--操作导航栏-->
    <div class="col-nav">
      <ul>
        <li @click="handleEdit"><span>组合开票</span></li>
      </ul>
    </div>

    <!--主数据表格区-->
    <div style="margin-top: 20px;">
      <el-table id="tab_billing" :data="list" v-loading.body="listLoading" @selection-change="handleSelectionChange"
                :height="tabHeight" border style="width: 100%">
        <el-table-column type="selection" align="center" width=50>
        </el-table-column>
        <el-table-column :label="$t('receipt.outorderId')" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sourceOrderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.salesOrderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.shopName')" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.storeName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.buyerNick')" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{scope.row.buyerNick}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('receipt.taxTotal')" show-overflow-tooltip align="right">
          <template slot-scope="scope">
            <span>{{scope.row.freightAmt}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--【开票】编辑弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="添加发票信息" :visible.sync="dialogEdit" width="750px">
      <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="8">
            <!--<el-form-item :label="$t('receipt.labTypeName')">
              <el-select v-model="dataForm.typeId">
                <el-option v-for="item in condition.typeIdOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item :label="$t('receipt.labTaxTotal')">
              <span>{{dataForm.invoiceAmt}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('receipt.labContenttypeName')">
              <el-select v-model="dataForm.invoiceContent" disabled>
                <el-option v-for="(label,value) in condition.contenttypeIdOptions" :key="value" :value="value" :label="label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="抬头类型：" prop="titleType">
              <el-select v-model="dataForm.titleType">
                <el-option v-for="item in condition.titletypeIdOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labTitle')" prop="titleName">
              <el-input v-model="dataForm.titleName" :maxlength="100" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="税号：" prop="taxpayerNo">
              <el-input v-model="dataForm.taxpayerNo" :maxlength="100" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labTaxBank')">
              <el-input v-model="dataForm.openingBank" :maxlength="200" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('receipt.labTaxBankacc')">
              <el-input v-model="dataForm.bankAccount" :maxlength="200" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('receipt.labTaxBankremark')">
          <el-input type="textarea" v-model="dataForm.remark"
                    :autosize="{ minRows: 2, maxRows: 4}" :maxlength="1000"
                    placeholder="请输入内容" style="width: 100%;">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogEdit = false">取 消</el-button>-->
        <el-button type="primary" @click="confirmEdit">保 存</el-button>
      </span>
    </el-dialog>

    <!--分页控制区-->
    <div class="col-pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[15,30,50,100,200]" :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  //import { fetchReReceipt, addReReceipt } from '@/api/receiptService'
  import { turnTimestamp,isStrEmpty } from '@/assets/js/validate.js'

  export default {
    name: 'receipt-billing',
    data() {
      var validateTitletypeId = (rule, value, callback) => {
        if (value == '1') {
          this.rules['taxpayerNo'][0].required = true;
        } else {
          this.rules['taxpayerNo'][0].required = false;
        }
        this.$refs.dataForm.validateField('taxpayerNo');
        callback();
      };
      var validateTaxNo = (rule, value, callback) => {
        if (!value && this.dataForm.titleType === '1') {
          callback(new Error('企业开票，纳税人识别号必须输入！'));
        } else {
          callback();
        }
      };
      return {
        apiVersion: '1.0.0',
        condition: {
          dateTypeOptions: {},
          searchIdOptions: {},
          contenttypeIdOptions:{},
          titletypeIdOptions: [
            { value: '1', label: '企业' },
            { value: '2', label: '个人' }
          ],
          shopList: [],
          shopId: []
        },//查询条件下拉集合
        list: [],//表格是数据集合
        total: 0,
        listLoading: false,
        listQuery: {
          timeSearchType: '1',
          timeSearchTimeStart: '', //new Date((new Date((new Date()).toLocaleDateString())) - 3600 * 1000 * 24 * 7),
          timeSearchTimeEnd: '', //new Date((new Date()).toLocaleDateString() + ' 23:59:59'),
          storeIds: '',
          conditionSearchType: '2',
          conditionSearchText: '',
          page: 1,
          size: 15
        },//查询条件
        listSel: [],//表格选中集合
        tabHeight: 300,
        dialogEdit: false,//开票编辑弹框
        dataForm: {
          outorderIds: ''
        },//添加发票信息form
        rules: {
          titleType: [{ validator: validateTitletypeId, trigger: 'change' }],
          titleName: [{ required: true, message: this.$t('receipt.ruleTitle'), trigger: 'blur' }],
          taxpayerNo: [{ required: false, validator: validateTaxNo, trigger: 'blur' }]
        }//表单验证规则
      }
    },
    created() {
      //下拉集合init
      this.initBilling();
      this.$nextTick(() => {
        this.onResize()
      })
    },
    mounted() {
      // 店铺设置
      $('#mulshop1').multiselect({
        onInitialized: function (select, container) {
          $("._scroll").yi_scroll();
        }
      });

      window.onresize = () => {
        this.onResize()
      }
    },
    methods: {
      //设置表格高度
      onResize() {
        const clientHeight = document.body.clientHeight
        this.tableTop = document.getElementById('tab_billing').offsetTop
        if (clientHeight - this.tableTop - 100 > 100) {
          this.tabHeight = clientHeight - this.tableTop - 100
        } else {
          this.tabHeight = 100
        }
      },
      //选择日期类型
      handleDateType(val) {
        var today = new Date();
        //this.listQuery.timeSearchTimeStart = new Date((new Date(today - 3600 * 1000 * 24 * 7)).toLocaleDateString()).getTime();
        //this.listQuery.timeSearchTimeEnd = new Date(today.toLocaleDateString() + ' 23:59:59').getTime();
      },
      //选择时间控件
      channelChangeTime(){
        this.listQuery.timeSearchTimeStart = this.listQuery.timeSearchTimeStart == null?'':this.listQuery.timeSearchTimeStart;
        this.listQuery.timeSearchTimeEnd = this.listQuery.timeSearchTimeEnd == null?'':this.listQuery.timeSearchTimeEnd;
        if(this.listQuery.timeSearchTimeStart && this.listQuery.timeSearchTimeEnd && this.listQuery.timeSearchTimeStart > this.listQuery.timeSearchTimeEnd){
          this.$message({
            message: '起始时间不能大于结束时间！',
            type: 'warning'
          });
          this.listQuery.timeSearchTimeEnd = '';
        }
        if(this.listQuery.timeSearchTimeStart && this.listQuery.timeSearchTimeEnd && this.listQuery.timeSearchTimeStart + 3*30*24*3600000 < this.listQuery.timeSearchTimeEnd){
          this.$message({
            message: '开始时间和结束时间最大跨度不能超过3个月！',
            type: 'warning'
          });
          this.listQuery.timeSearchTimeEnd = this.listQuery.timeSearchTimeStart + 3*30*24*3600000;
        }
      },
      //下拉集合init
      initBilling() {
        this.handleDateType();
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getPageElement').then(response => {
          if (response.data.success) {
            //店铺下拉 //dateTypeOptions searchIdOptions contenttypeIdOptions titletypeIdOptions
            this.condition.shopList = [];
            for(var item in response.data.result.elem_store){
              this.condition.shopList.push({
                value:item,
                label:response.data.result.elem_store[item]
              })
            }
            $('#mulshop1').multiselect('dataprovider', this.condition.shopList);
            //日期类型
            this.condition.dateTypeOptions = response.data.result.elem_orderTimeType;
            //查询条件
            this.condition.searchIdOptions = response.data.result.elem_conditionType;
            //发票内容
            this.condition.contenttypeIdOptions = response.data.result.elem_content;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
        this.getList()
      },
      //跳回发票管理页
      showParentBlock() {
        //this.$router.push({name: 'invoicesControl'});
        this.$emit('changeShow');
      },
      //选择条件
      handleSearchId(val) {
        this.listQuery.conditionSearchText = ''
      },
      //table数据查询
      getList() {
        this.listQuery.storeIds = $('#mulshop1').val()?$('#mulshop1').val():'';
        this.listLoading = true
        //fetchReReceipt(this.listQuery)
        this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/selectSupplementInvoiceList',this.listQuery).then(response => {
          if (response.data.success === true) {
            this.listSel = [];
            this.list = response.data.result.rows;
            this.list.forEach((item,i)=>{
              item.invoiceTime = turnTimestamp(item.invoiceTime);
              item.payDate = turnTimestamp(item.payDate);
            })
            this.total = response.data.result.total;
            this.listQuery.page = response.data.result.page;
            this.listQuery.size = response.data.result.size;
            this.listLoading = false;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
            this.listLoading = false;
          }
        })
      },
      handleSelectionChange(val) {
        this.listSel = val
      },
      handleSizeChange(val) {
        this.listQuery.size = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      //组合开票
      handleEdit() {
        if (this.listSel.length === 0 ){
          this.$message({
            message: '请选择需要开票的订单',
            type: 'warning'
          })
          return
        } else {
          let _shopId = '';
          let _buyerNick = '';
          let salesOrderInfoByJson = [];
          let salesOrderIds = '';
          for (var i = 0; i < this.listSel.length; i++) {
            if (i === 0) {
              _shopId = this.listSel[i].storeId;
              _buyerNick = this.listSel[i].buyerNick;
            } else if (_shopId != this.listSel[i].storeId || _buyerNick != this.listSel[i].buyerNick ) {
              this.$message({
                message: '所选订单中含有不同的店铺和买家ID不许同时开票',
                type: 'warning'
              })
              return false;
            }
            salesOrderIds += this.listSel[i].salesOrderId + ',';
            salesOrderInfoByJson.push({
              salesOrderId:this.listSel[i].salesOrderId,
              sourceOrderNo:this.listSel[i].sourceOrderNo,
            })
          }
          this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/getSupplementInvoiceListData',{
            salesOrderIds:salesOrderIds.slice(0,-1)
          }).then(response => {
            if (response.data.success) {
              this.dialogEdit = true;
              this.$nextTick(()=>{
                this.$refs['dataForm'].resetFields();
                this.dataForm = {
                  salesOrderInfoByJson:JSON.stringify(salesOrderInfoByJson),
                  invoiceAmt:response.data.result.invoiceAmt,
                  invoiceContent:response.data.result.invoiceContent + '',
                  titleType:'',
                  titleName:'',
                  taxpayerNo:'',
                  openingBank:'',
                  bankAccount:'',
                  remark:'',
                }
                this.rules['taxpayerNo'][0].required = false;
              })
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      //补发开票保存
      confirmEdit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this._post('com.edb01.erp.oms.service.api.OrderInvoiceService/' + this.apiVersion + '/saveInvoiceInfo',this.dataForm).then(response => {
              if (response.data.success) {
                this.$message({
                  message: '补开发票成功',
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
            })
          }
        })
      },
    }
  }
</script>
