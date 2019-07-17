<!--自动审单方案 樊虎-->
<template>
  <div id="automaticReviewScheme">
    <div v-if="paramsObj.mainPageShow">
      <!--系统参数：开启自动审单-->
      <div style="position:relative;">
        <el-checkbox v-model="paramStatus" @change="handleParamChange">{{$t('orderPlan.checkParam')}}并在订单付款时间 <span style="margin-right:100px;"></span>分钟后进行自动审核</el-checkbox>
        <span style="color: #FFAD55;">{{$t('orderPlan.checkParamTip')}}</span>
        <el-input-number :controls="false" :disabled="paramStatus" :min="0" :max="1440" v-model="planWaitTime" style="width:95px;position:absolute;top:-9px;left:225px;" @blur="planWaitTimeBlur"></el-input-number>
      </div>

      <!--查询数据-->
      <div id="searchBox" style="margin-top: 20px;">
        <div class="leftBox1">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="conStatus">{{$t('orderPlan.conStatus')}}</label>
                <el-select id="conStatus" v-model="listQuery.isEnable">
                  <el-option :label="$t('orderPlan.optAll')" value="3"></el-option>
                  <el-option :label="$t('orderPlan.optEnable')" value="1"></el-option>
                  <el-option :label="$t('orderPlan.optDisable')" value="2"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="conPlanName">{{$t('orderPlan.conPlanName')}}</label>
                <el-input id="conPlanName" v-model="listQuery.planName" :maxlength="20" clearable></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox1">
          <el-button @click="getList" type="primary" icon="el-icon-search">{{$t('orderPlan.search')}}</el-button>
        </div>
      </div>

      <!--操作导航栏-->
      <div class="col-nav">
        <ul>
          <li @click="autoPlanAdd" v-if="authorityCode.OMS_AUTOMATICREVIEW_ADD"><span>{{$t("orderPlan.create")}}</span></li>
          <li @click="publicLogBtn('')"><span>{{$t("orderPlan.viewLog")}}</span></li>
        </ul>
      </div>
      <!--日志弹框-->
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>

      <!--主数据表格区-->
      <div style="margin-top: 15px;">
        <el-table id="tabPlan" :data="list" v-loading.body="listLoading" border :height="tabHeight" style="width: 100%">
          <el-table-column type="index" :label="$t('orderPlan.index')" align="center">
          </el-table-column>
          <el-table-column :label="$t('orderPlan.planName')" header-align="center">
            <template slot-scope="scope">
              <span class="link-type" @click="initView(scope.row.orderAutoPlanId)">{{scope.row.planName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('orderPlan.isenable')" align="center" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enabledFlag" :disabled="!authorityCode.OMS_AUTOMATICREVIEW_STATUS" @change="enablePlan(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('orderPlan.shopName')" show-overflow-tooltip header-align="center">
            <template slot-scope="scope">
              <span>{{scope.row.shopName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('orderPlan.runTime')" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.runStartTime.slice(11)}}</span>
              <span> - </span>
              <span>{{scope.row.runEndTime.slice(11)}}</span>
              <span v-if="scope.row.isShow" style="font-size:12px;color: red;">+1</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('orderPlan.operation')" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="autoPlanEdit(scope.row,scope.row.orderAutoPlanId)" v-if="!scope.row.enabledFlag && authorityCode.OMS_AUTOMATICREVIEW_EDIT" :disabled="scope.row.enabledFlag">{{$t('orderPlan.update')}}</el-button>
              <el-button type="text" @click="detelePlan(scope.row)" v-if="!scope.row.enabledFlag && authorityCode.OMS_AUTOMATICREVIEW_DEL" :disabled="scope.row.enabledFlag" :style="{color: scope.row.enabledFlag? '#C0C4CC':'red'}">{{$t('orderPlan.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--查看方案详情-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('orderPlan.viewPlan')" :visible.sync="dialogPlanVisible" id="orderPlan" width="650px">
        <div style="width:100%;background:#eee;padding:3px 10px;">
          <span>{{$t('orderPlan.groupBase')}}</span>
        </div>
        <el-row style="margin-top: 20px;">
          <el-col :span="12">
            <el-col :span="8" style="text-align: right;padding-right: 20px;line-height:28px;">{{$t('orderPlan.conPlanName')}}</el-col>
            <el-col :span="16">
              <el-input v-model="temp.planName" disabled></el-input>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-col :span="8" style="text-align: right;padding-right: 20px;line-height:28px;">{{$t('orderPlan.conTime')}}</el-col>
            <el-col :span="16">
              <el-col :span="11">
                <el-time-picker disabled value-format="timestamp" v-model="temp.runStartTime" type="fixed-time" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" style="width: 100%;"></el-time-picker>
              </el-col>
              <el-col :span="2" style="text-align: center;line-height:28px;">-</el-col>
              <el-col :span="11">
                <el-time-picker disabled value-format="timestamp" v-model="temp.runEndTime" type="fixed-time":picker-options="{selectableRange: '00:00:00 - 23:59:59'}" style="width: 100%;"></el-time-picker>
              </el-col>
            </el-col>
          </el-col>
        </el-row>
        <!--<el-row style="margin-top: 10px;">
          <el-col :span="4" style="text-align: right;padding-right: 20px;line-height:28px;">等待时间：</el-col>
          <el-col :span="20">
            <span>订单进入系统后等待</span>
            <el-input type="text" v-model="temp.planWaitTime" disabled style="width:230px;"></el-input>
            <span>分钟后执行自动审单</span>
          </el-col>
        </el-row>-->
        <el-row style="margin-top: 10px;">
          <el-col :span="4" style="text-align: right;padding-right: 20px;line-height:28px;">执行店铺：</el-col>
          <el-col :span="20">
            <el-input type="textarea" v-model="temp.storesName" :autosize="{ minRows: 1, maxRows: 4}" disabled style="width: 100%;"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <div style="text-align: left;padding-right: 0px;line-height:28px;float:left;">{{$t('orderPlan.conServmsgEqual')}}</div>
          <el-input type="textarea" v-model="temp.serviceRemarkOnly" :autosize="{ minRows: 1, maxRows: 4}" disabled style="width: 454px;"></el-input>
        </el-row>

        <div style="width:100%;background:#eee;padding:3px 10px;margin-top: 20px;">
          <span>{{$t('orderPlan.groupIntercept')}}</span><!--拦截条件-->
        </div>
        <el-row style="margin-top: 20px;">
          <el-col :span="4" style="text-align: right;padding-right: 20px;line-height:28px;">{{$t('orderPlan.conOrderType')}}</el-col>
          <el-col :span="20">
            <el-input type="textarea" v-model="temp.orderTypeName" :autosize="{ minRows: 1, maxRows: 4}" disabled style="width: 100%;"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="4" style="text-align: right;padding-right: 20px;line-height:28px;">{{$t('orderPlan.conSignType')}}</el-col>
          <el-col :span="20">
            <el-input type="textarea" v-model="temp.orderSignName" :autosize="{ minRows: 1, maxRows: 4}" disabled style="width: 100%;"></el-input>
          </el-col>
        </el-row>

        <el-row style="margin-top: 10px;">
          <el-col :span="4" style="text-align: left;padding-right: 0px;line-height:28px;">订单金额大于：</el-col>
          <el-col :span="8">
            <el-col :span="22">
              <el-input v-model="temp.startOrderAmt" disabled></el-input>
            </el-col>
          </el-col>
          <el-col :span="4" style="text-align: right;padding-right: 0px;line-height:28px;">订单金额小于：</el-col>
          <el-col :span="8">
            <el-col :span="24">
              <el-input v-model="temp.endOrderAmt" disabled></el-input>
            </el-col>
          </el-col>
        </el-row>

        <el-row style="margin-top: 10px;">
          <el-col :span="4" style="text-align: left;padding-right: 0px;line-height:28px;">{{$t('orderPlan.conSuttle')}}</el-col>
          <el-col :span="8">
            <el-col :span="22">
              <el-input v-model="temp.suttleLimit" disabled></el-input>
            </el-col>
            <el-col :span="2" style="text-align: center;line-height:28px;">KG</el-col>
          </el-col>
          <el-col :span="4" style="text-align: right;padding-right: 0px;line-height:28px;">订货数量大于：</el-col>
          <el-col :span="8">
            <el-col :span="24">
              <el-input v-model="temp.startGoodsQty" disabled></el-input>
            </el-col>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="4" style="text-align: left;padding-right: 0px;line-height:28px;">{{$t('orderPlan.conRegion')}}</el-col>
          <el-col :span="20">
            <el-input type="textarea" v-model="temp.regionName" :autosize="{ minRows: 1, maxRows: 4}" disabled style="width: 100%;"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="4" style="text-align: right;padding-right: 20px;line-height:28px;">&nbsp;</el-col>
          <el-col :span="20">
            <el-checkbox v-model="temp.codOrderFlag" :label="$t('orderPlan.conCod')" disabled>
            </el-checkbox>
            <el-checkbox v-model="temp.invoiceOrderFlag" style="margin-left:15px;" :label="$t('orderPlan.conInvoice')" disabled>
            </el-checkbox>
            <el-checkbox v-model="temp.msgFlag" style="margin-left:15px;" :label="$t('orderPlan.conBuyermsg')" disabled>
            </el-checkbox>
            <el-checkbox v-model="temp.giftFlag" style="margin-left:15px;" :label="$t('orderPlan.conGifts')" disabled>
            </el-checkbox>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="4" style="text-align: right;padding-right: 20px;line-height:28px;">&nbsp;</el-col>
          <el-col :span="16">
            <el-checkbox-group v-model="temp.flagsIds">
              <el-checkbox v-for="item in colorType" :label="item.key" :key="item.key" disabled>
                <i class="icon iconfont icon-ai246" :style="{ color: item.picUrl, width: 50 + 'px'}"></i>
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col :span="4" style="text-align: right">
            <el-button @click="getPlanSkuList()" type="text">{{$t('orderPlan.conIntercept')}}</el-button>
            <el-tooltip :content="$t('orderPlan.conInterceptTip')" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-dialog>

      <!--拦截商品展示-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('orderPlan.dlgIntercept')" :visible.sync="dialogPlanSkuVisible">
        <div>
          <el-table :data="planSkuList" v-loading.body="listPlanSkuLoading" border stripe fit highlight-current-row height="300" style="width: 100%">
            <el-table-column :label="$t('orderPlan.index')" type="index" align="center">
            </el-table-column>
            <el-table-column :label="$t('orderPlan.picUrl')" align="center">
              <template slot-scope="scope">
                <div v-if="picUrl != ''" style="position: fixed;z-index: 1000000000;left:50%;top:50%;border-radius: 10px;margin-top: -150px;margin-left: -150px;background: #000">
                  <img :src="picUrl" alt="" style="width: 300px;height: 300px;cursor: pointer;border-radius: 10px;">
                </div>
                <img v-if="scope.row.picUrl != ''" :src="scope.row.picUrl" alt="" style="width: 25px;height: 25px;cursor: pointer" @mouseenter="showImg(scope.row,scope.$index)" @mouseleave="showImg1()">
              </template>
            </el-table-column>
            <el-table-column :label="$t('orderPlan.skuCode')" show-overflow-tooltip header-align="center">
              <template slot-scope="scope">
                <span>{{scope.row.skuCode}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('orderPlan.skuBarcode')" show-overflow-tooltip header-align="center">
              <template slot-scope="scope">
                <span>{{scope.row.skuBarcode}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('orderPlan.skuName')" show-overflow-tooltip header-align="center">
              <template slot-scope="scope">
                <span>{{scope.row.skuName}}</span>
              </template>
            </el-table-column>
          </el-table>
          <span>{{$t('orderPlan.dlgInterceptTip')}}</span>
        </div>
      </el-dialog>

      <!--分页控制区-->
      <div class="col-pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.page"
                       :page-sizes="[15,30,50,100,200]" :page-size="listQuery.size"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <auto-Matic v-else :params="paramsObj" @changeShow="changeShow"></auto-Matic>
  </div>
</template>
<script>
  import {turnTimestamp} from '@/assets/js/validate.js';
  import publicLog from '@/components/common/publicLog.vue';
  import AutoMatic from '@/components/views/setUp/children/AutomaticReviewSchemeSetting.vue';

  export default {
    name: 'planMain',
    components: {
      'v-Publiclog': publicLog,
      AutoMatic
    },
    data() {
      return {
        paramsObj:{
          mainPageShow:true,
        },
        planWaitTime:0,//自动审单等待时间
        apiVersion: '1.0.0',
        picUrl: '',//图片url
        paramStatus:false,//开启自动审单状态
        pulicLogVisible: false,//公共日志弹框
        paramObj:{},//公共日志参数
        list: null,//表格data
        total: null,//总页数
        listLoading: false,//表格loading
        listQuery: {
          isEnable: '3',
          planName: '',
          page: 1,
          size: 15
        },//查询条件
        tabHeight: null,
        temp: {},//查看方案详情参数
        colorType: [
          { key: '1', picUrl: 'red' },
          { key: '2', picUrl: 'yellow' },
          { key: '3', picUrl: 'blue' },
          { key: '4', picUrl: 'green' },
          { key: '5', picUrl: 'purple' }
        ],//颜色集合
        planSkuList: [],//拦截商品data
        listPlanSkuLoading: false,//获取拦截商品loading
        dialogPlanVisible: false,//查看方案详情弹框
        dialogPlanSkuVisible: false,//拦截商品弹框
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
      }
    },
    mounted() {
      window.onresize = () => {
        this.onResize()
      }
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if (e && e.keyCode == 13 && $('.v-modal').length == 0) { // enter 键
          this.getList();
        }
      };
    },
    created() {
      //初始化表格
      this.initSetting()
      this.$nextTick(() => {
        this.onResize()
      })
    },
    methods: {
      planWaitTimeBlur(){
        this.planWaitTime = this.planWaitTime?this.planWaitTime:0;
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/updateAutoWaitTime',{
          planWaitTime:this.planWaitTime
        }).then(response => {
          if (response.data.success) {
            this.$message({
              message: '保存成功！',
              type: 'success'
            });
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //组件回传
      changeShow(param){
        if(param && param.isRefresh){
          this.getList();
        }
        this.paramsObj.mainPageShow = true;
        document.onkeydown = (event) => {
          var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
          if (e && e.keyCode == 13 && $('.v-modal').length == 0) { // enter 键
            this.getList();
          }
        };
      },
      onResize() {
        const clientHeight = document.body.clientHeight
        this.tableTop = document.getElementById('tabPlan').offsetTop
        if (clientHeight - this.tableTop - 170 > 100) {
          this.tabHeight = clientHeight - this.tableTop - 100
        } else {
          this.tabHeight = 100
        }
      },
      //是否可开启自动审单
      initSetting() {
        //getPlanParam()
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/selectAutoInspectionFlag').then(response => {
          if (response.data.success) {
            this.paramStatus = response.data.result;
            //this.planWaitTime = response.data.planWaitTime;
          }
        })
        this._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + this.apiVersion + '/query').then(response => {
          if (response.data.success) {
            this.planWaitTime = response.data.result.planWaitTime;
          }
        })

        this.getList()
      },
      //表格渲染
      getList() {
        //this.listLoading = true
        this.list = []
        //fetchList(this.listQuery)
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/list',this.listQuery).then(response => {
          if (response.data.success) {
            this.list = response.data.result.rows
            this.list.forEach((item,i)=>{
              item.runStartTime = turnTimestamp(item.runStartTime);
              item.runEndTime = turnTimestamp(item.runEndTime);
              if(item.runStartTime.slice(11).replace(/:/g,'')*1 > item.runEndTime.slice(11).replace(/:/g,'')*1){
                item.isShow = true;
              }
            })
            //console.log(this.list);
            this.total = response.data.result.total
            this.listQuery.page = response.data.result.page
            this.listQuery.size = response.data.result.size
            this.listLoading = false
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch((error) => {
          console.log(error)
          //this.listLoading = false
        })
      },
      //开启自动审单
      handleParamChange() {
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/updateIsAutoInspectionFlag',{ status: this.paramStatus }).then(response => {
          if (response.data.success) {
            this.$message({
              message: '设置成功',
              duration: 1500,
              type: 'success'
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
            this.paramStatus = !this.paramStatus;
          }
        }).catch(() => {
          this.paramStatus = !this.paramStatus;
        })
      },
      //方案启用停用
      enablePlan(row) {
        const _item = { planId: row.orderAutoPlanId, enabledFlag: row.enabledFlag }
        //enableOrderPlan(_item)
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/updateOrderPlanStatus',_item).then(response => {
          if (response.data.success) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
            row.enabledFlag = !row.enabledFlag
          }
        })
      },
      //公共日志弹框组件
      publicLogBtn(code) {
        this.paramObj.moduleId = '19';
        this.pulicLogVisible = true;
      },
      //公共日志弹框组件回传
      changDialogShow() {
        this.pulicLogVisible = false
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      //删除方案
      detelePlan(row) {
        if(row.enabledFlag){
          this.$message({
            message: '请先关闭方案，然后再删除！',
            type: 'warning'
          });
          return false;
        }
        this.$confirm(this.$t('orderPlan.confirmDelete') + this.$t('orderPlan.handleContinue'), this.$t('orderPlan.handlePrompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/removeOrderPlan',{ planId: row.orderAutoPlanId }).then(response => {
            if (response.data.success) {
              this.$message({
                message: '删除成功',
                duration: 1500,
                type: 'success'
              })
              this.getList();
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              })
            }
          }).catch((error) => {
            console.log(error.toString())
          })
        })
      },
      //添加
      autoPlanAdd() {
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/getOrderAutoPlanStoredToBeUsedCount').then(response => {
          if(response.data.success){
            if(response.data.result){
              this.paramsObj = {
                planId:'fanhu',
                type:1,
                mainPageShow:false
              }
              //this.$router.push({name: 'automaticReviewSchemeSetting', params: {planId: 'fanhu',type:1}});
            }else{
              this.$message({
                message: '现有自动审单方案已包含所有店铺，请删除无用方案后添加！',
                type: 'warning'
              });
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //修改
      autoPlanEdit(row,orderAutoPlanId){
        if(row.enabledFlag){
          this.$message({
            message: '开启状态方案不允许修改！',
            type: 'warning'
          });
          return false;
        }
        this.paramsObj = {
          planId:orderAutoPlanId,
          type:2,
          mainPageShow:false
        }
        //this.$router.push({name: 'automaticReviewSchemeSetting', params: {planId: orderAutoPlanId,type:2}});
      },
      //查看
      initView(planId) {
        this.planId = planId
        this.planSkuList = []
        //getOrderPlan(_item)
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/get',{ planId}).then(response => {
          if(response.data.success){
            this.temp = response.data.result;
            this.temp.flagsIds = this.temp.flagsIds.split(',');
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
          this.dialogPlanVisible = true;
        })
      },
      //获取拦截商品
      getPlanSkuList() {
        this.dialogPlanSkuVisible = true;
        const _item = { planId: this.planId }
        //getOrderPlanSku(_item)
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/getOrderPlanSkuList',_item).then(response => {
          if(response.data.success){
            this.planSkuList = response.data.result;
            this.listPlanSkuLoading = true;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
          this.listPlanSkuLoading = false;
        })
      },
      //图片鼠标滑入
      showImg(row,index) {
        this.picUrl = row.picUrl
      },
      //图片鼠标滑出
      showImg1() {
        this.picUrl = ''
      },
    }
  }
</script>
<style>
 #orderPlan .el-input.is-disabled .el-input__icon{
   display:none;
 }
 #orderPlan .el-textarea .el-textarea__inner{
   height:30px;
 }
 #orderPlan .el-input--prefix .el-input__inner,#orderPlan .el-input--suffix .el-input__inner{
   padding:0 15px;
 }
</style>

