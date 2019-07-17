<!--自动审单方案-方案设置 方证/樊虎-->
<template>
  <div id="automaticReviewSchemeSetting" style="padding-bottom:80px !important;" v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <el-breadcrumb separator="/" class="col-breadcrumb" style="margin-bottom:15px;">
      <el-breadcrumb-item :to="{ path: '/AutomaticReviewScheme' }"><span @click="showParentBlock">自动审单方案</span></el-breadcrumb-item>
      <el-breadcrumb-item>{{titleName}}方案</el-breadcrumb-item>
    </el-breadcrumb>
    <!--主数据区-->
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" class="auto-ruleForm">
      <div class="auto-breadcrumb">
        <span>{{$t('orderPlan.groupBase')}}</span><!--  基本信息  -->
      </div>
      <el-row style="margin-top: 30px;">
        <el-form-item :label="$t('orderPlan.conPlanName')" prop="planName" style="width:310px;float:left;">
          <el-tooltip effect="light" content="输入最大长度为 20 个汉字或字符！" placement="bottom-start">
            <el-input v-model="temp.planName" :maxlength="20"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="$t('orderPlan.conShops')" prop="shopIds" style="width:310px;float:left;">
          <!--<el-select v-model="shops" @change="onShopChange" filterable multiple collapse-tags clearable style="width: 100%;">
            <el-option v-for="item in shoplist" :key="item.shopId" :value="item.shopId" :label="item.shopName"></el-option>
          </el-select>-->
          <select id="mulshop" name="multiselect[]" multiple="multiple">
            <option v-for="item in shoplist" :value="item.value">{{item.label}}</option>
          </select>
          <!--<p style="position:absolute;top:25px;color:#fa5555;" class="mul-error">执行店铺必须输入!</p>-->
        </el-form-item>
        <el-form-item :label="$t('orderPlan.conTime')" required style="width:520px;float:left;">
          <el-col :span="11">
            <el-form-item prop="runStartTime">
              <el-time-picker value-format="timestamp" v-model="temp.runStartTime" type="fixed-time" @change="handleStartTime" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="runEndTime">
              <el-time-picker value-format="timestamp" v-model="temp.runEndTime" type="fixed-time" @change="handleEndTime"  :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
       <!-- <el-form-item label="等待时间：" style="clear:both;">
          <span>订单进入系统后等待</span>
          <el-input type="text" v-model="temp.planWaitTime" placeholder="请输入内容" style="width:195px;"></el-input>
          <span>分钟后执行自动审单</span>
        </el-form-item>-->
        <el-form-item :label="$t('orderPlan.conServmsgEqual')" style="clear:both;">
          <el-input type="textarea" v-model="temp.serviceRemarkOnly"
                    :autosize="{ minRows: 2, maxRows: 4}" :maxlength="100"
                    :placeholder="$t('orderPlan.conServmsgEqualPlace')"
                    style="width: 1028px;"
          ></el-input>
          <p style="color:orange;">注：无客服备注的订单均可参加自动审单；</p>
        </el-form-item>
      </el-row>

      <div class="auto-breadcrumb">
        <span>{{$t('orderPlan.groupIntercept')}}</span><!--  拦截条件  -->
      </div>
      <el-row style="margin-top: 30px;">
        <el-form-item :label="$t('orderPlan.conOrderType')" style="float:left;width:320px;margin-right:40px;">
          <!--<el-select v-model="types" filterable multiple collapse-tags clearable style="width: 100%;">
            <el-option v-for="item in orderType" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>-->
          <select id="mulordertype" name="multiselect[]" multiple="multiple">
            <option v-for="item in orderType" :value="item.value">{{item.label}}</option>
          </select>
        </el-form-item>
        <el-form-item :label="$t('orderPlan.conSignType')" style="float:left;width:320px;margin-right:40px;">
          <!--<el-select v-model="signs" filterable multiple collapse-tags clearable style="width: 100%;">
            <el-option v-for="item in signlist" :key="item.signId" :value="item.signId" :label="item.signName"></el-option>
          </el-select>-->
          <select id="mulsign" name="multiselect[]" multiple="multiple">
            <option v-for="item in signlist" :value="item.value">{{item.label}}</option>
          </select>
        </el-form-item>
        <el-form-item :label="$t('orderPlan.conSuttle')" style="float:left;height:31px;width:320px;margin-right:40px;">
          <el-col :span="23">
            <el-input v-model="temp.suttleLimit" @blur="validate(3)"  @keyup.native="temp.suttleLimit = temp.suttleLimit.replace(/[^\d\.]/ig,'')" style="width: 100%"></el-input>
          </el-col>
          <el-col :span="1" style="text-align: center">&nbsp;KG</el-col>
        </el-form-item>
        <el-form-item :label="$t('orderPlan.conRegion')" style="float:left;width:320px;margin-right:40px;">
          <!--<el-select v-model="adds" filterable multiple collapse-tags clearable style="width: 100%;">
            <el-option v-for="item in addresslist" :key="item.regionId" :value="item.regionId.toString()" :label="item.regionName">
            </el-option>
          </el-select>-->
          <select id="muladdress" name="multiselect[]" multiple="multiple">
            <option v-for="item in addresslist" :value="item.regionId.toString()">{{item.regionName}}</option>
          </select>
        </el-form-item>
        <el-form-item label="订单金额大于：" style="float:left;width:320px;height:31px;margin-right:40px;">
          <el-col :span="23">
            <el-input v-model="temp.startOrderAmt" @blur="validate(1)" @keyup.native="temp.startOrderAmt = temp.startOrderAmt.replace(/[^\d\.]/ig,'')" style="width: 100%"></el-input>
          </el-col>
          <el-col :span="1" style="text-align: center">&nbsp;元</el-col>
        </el-form-item>
        <el-form-item label="订单金额小于：" style="float:left;width:320px;height:31px;margin-right:40px;">
          <el-col :span="23">
            <el-input v-model="temp.endOrderAmt" @blur="validate(2)" @keyup.native="temp.endOrderAmt = temp.endOrderAmt.replace(/[^\d\.]/ig,'')" style="width: 100%"></el-input>
          </el-col>
          <el-col :span="1" style="text-align: center">&nbsp;元</el-col>
        </el-form-item>
        <el-form-item label="订货数量大于：" style="float:left;width:320px;margin-right:40px;">
          <el-col :span="23">
            <el-input  @keyup.native="temp.startGoodsQty = temp.startGoodsQty.replace(/[^\d]/g,'')" @blur="validate(4)" type='text' v-model="temp.startGoodsQty" style="width: 100%"></el-input>
          </el-col>
          <el-col :span="1" style="padding-left: 5px;">
            <el-tooltip content="套装有2个商品，则订货数量为1。" placement="top-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-form-item>

      </el-row>
      <el-row>
        <el-form-item label="" style="float:left;width:700px;">
          <el-checkbox v-model="temp.codOrderFlag" :label="$t('orderPlan.conCod')">
          </el-checkbox>
          <el-checkbox v-model="temp.invoiceOrderFlag" :label="$t('orderPlan.conInvoice')">
          </el-checkbox>
          <el-checkbox v-model="temp.msgFlag" :label="$t('orderPlan.conBuyermsg')">
          </el-checkbox>
          <el-checkbox v-model="temp.giftFlag" :label="$t('orderPlan.conGifts')">
          </el-checkbox>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item :label="$t('orderPlan.conColors')" style="width:860px;float:left;">
          <el-checkbox-group v-model="temp.flagIds">
            <el-checkbox v-for="item in colorType" :label="item.value" :key="item.value">
              <i class="icon iconfont icon-ai246" :style="{ color: item.picUrl}"></i>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label=" " style="float:left;">
          <el-button @click="onPlanSku()" type="text">{{$t('orderPlan.conIntercept')}}</el-button>
          <el-tooltip :content="$t('orderPlan.conInterceptTip')" placement="top-start">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
      </el-row>
    </el-form>

    <!--拦截商品弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('orderPlan.dlgIntercept')" :visible.sync="dialogPlanSkuVisible">
      <!--<div class="tool-container">
        <el-button @click="onSku" type="text">{{$t('orderPlan.insert')}}</el-button>
        <el-button @click="onDeletePlanSku" type="text">{{$t('orderPlan.batchDelete')}}</el-button>
      </div>-->
      <div class="col-nav">
        <ul>
          <li @click="onSku"><span>{{$t("orderPlan.insert")}}</span></li>
          <li @click="onDeletePlanSku"><span>{{$t("orderPlan.batchDelete")}}</span></li>
        </ul>
      </div>
      <div style="margin-top: 20px;">
        <el-table :data="planSkuList" @selection-change="onPlanSkuChange" v-loading.body="listPlanSkuLoading" border height="300" style="width: 100%">
          <el-table-column type="selection" align="center">
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

    <!--添加拦截商品弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('orderPlan.dlgSkus')" :visible.sync="dialogSkuVisible" width="865px">
      <div>
        <label style="margin-right: 5px;">{{$t('orderPlan.conType')}}</label>
        <el-select v-model="listSkuQuery.type"  style="width: 100px">
          <el-option v-for="item in skuType" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <label style="margin-left: 20px;margin-right: 5px;">{{$t('orderPlan.conBrand')}}</label>
        <el-select v-model="listSkuQuery.brandId" clearable style="width: 100px">
          <el-option v-for="item in brandList" :key="item.brandId" :value="item.brandId" :label="item.brandName"></el-option>
        </el-select>
        <el-input v-model="listSkuQuery.searchText" style="margin-left: 20px;width: 280px">
          <el-select v-model="listSkuQuery.searchType" slot="prepend" style="width: 100px">
            <el-option v-for="item in skuConditionList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-input>
        <el-button @click="getSkuList()" type="primary" icon="el-icon-search" style="margin-left: 20px;">{{$t('orderPlan.search')}}</el-button>
      </div>
      <div style="margin-top: 20px;">
        <el-table :data="skuList" @selection-change="onSkuChange" v-loading.body="listSkuLoading" border height="300" style="width: 100%">
          <el-table-column type="selection" align="center">
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
      </div>
      <div class="dialog-pagination">
        <el-pagination background @size-change="skuSizeChange" @current-change="skuCurrentChange"
                       :current-page.sync="listSkuQuery.page"
                       :page-sizes="[15,30,50,100,200]" :page-size="listSkuQuery.size"
                       layout="total, sizes, prev, pager, next, jumper" :total="skuTotal">
        </el-pagination>
      </div>
      <span slot="footer" class="center">
        <el-button plain @click="dialogSkuVisible = false">{{$t('orderPlan.cancel')}}</el-button>
        <el-button type="primary" @click="onSaveSku" >{{$t('orderPlan.confirm')}}</el-button>
      </span>
    </el-dialog>

    <!--操作区-->
    <div slot="footer" align="center" class="col-button">
      <el-button @click="showParentBlock('planMain')">{{$t('orderPlan.return')}}</el-button>
      <el-button @click="autoPlanSave" type="primary">{{$t('orderPlan.save')}}</el-button>
    </div>
  </div>
</template>

<script>
  import { parseTime,returnFloat,returnOneFloat } from '@/assets/js/validate'

  export default {
    name: 'planSetting',
    props:{
      params:Object
    },
    data() {
      return {
        apiVersion:'1.0.0',
        loading:false,
        picUrl: '',//图片url
        temp: {
          orderAutoPlanId: '', //方案ID
          planName: '', //方案名称
          runStartTime: '', //开始时间
          runEndTime: '', //结束时间
          startOrderAmt: '', //订单金额大于
          endOrderAmt: '', //订单金额小于
          startGoodsQty: '', //订货数量大于
          endGoodsQty: '', //订货数量小于
          suttleLimit: '', //订单净重大于
          serviceRemarkFlag: false, //是否有客服备注
          serviceRemarkOnly: '', //客服备注仅包含
          serviceRemarkInclude: '', //客服备注包含
          codOrderFlag: false, //是否货到付款订单
          invoiceOrderFlag: false, //是否开票订单
          msgFlag: false, //是否有买家留言
          giftFlag: false, //包含赠品
          shopIds: '', //执行店铺 “，” 分割
          orderTypeIds: '', //订单类型ID
          goodIds:'', //多个商品id “，” 分割
          signTypeIds: '', //订单标记类型
          regionIds: '', //收货地址，支持多选（省份）
          flagIds: [], //旗帜颜色 支持多选
          planWaitTime:0,//排序等待时间
        },//保存条件
        shoplist: [],//店铺集合
        signlist: [],//订单标记集合
        addresslist: [],//省份下拉集合
        orderType: [],//订单类型集合
        colorType: [
          { value: '1', picUrl: 'red' },
          { value: '2', picUrl: 'yellow' },
          { value: '3', picUrl: 'blue' },
          { value: '4', picUrl: 'green' },
          { value: '5', picUrl: 'purple' }
        ],//颜色集合
        rules: {
          planName: [{ required: true, message: this.$t('orderPlan.rulePlanName'), trigger: 'blur' }],
          shopIds: [{ required: true, message: this.$t('orderPlan.ruleShops'), trigger: 'blur' }],
          runStartTime: [{ required: true, message: this.$t('orderPlan.startdate'), trigger: 'change' }],
          runEndTime: [{ required: true, message: this.$t('orderPlan.enddate'), trigger: 'change' }]
        },//表格校验规则

        brandList: [],//品牌集合
        skuType: [
          { value: '1', label: this.$t('orderPlan.optSingle') },
          { value: '2', label: this.$t('orderPlan.optSuit') }
        ],//商品类型
        skuConditionList: [
          { value: '1', label: this.$t('orderPlan.optSkuCode') },
          { value: '2', label: this.$t('orderPlan.optSkuBarcode') },
          { value: '3', label: this.$t('orderPlan.optSkuName') }
        ],//商品编码 条形码 商品名称
        planSkuList: [],//拦截商品列表
        listPlanSkuLoading: false,//拦截商品列表table loading
        selPlanSku: [],//选中的拦截商品
        skuList: null,//添加拦截商品列表
        skuTotal: null,
        listSkuLoading: false,//添加拦截商品列表loading
        titleName:'',//添加 编辑
        listSkuQuery: {
          type: '1',
          searchText:'',
          searchType:'1',
          brandId: '',
          page: 1,
          size: 10
        },//添加商品查询条件
        selSku: [],//选中商品集合
        dialogSkuVisible: false,//添加拦截商品弹框
        dialogPlanSkuVisible: false,//拦截商品弹框
        planId:this.params.planId,//方案id
        type:this.params.type
      }
    },
    created() {
      this.titleName = this.type == 1?'添加':'编辑';
      this.initSelect();
      //回显
      if(this.type == 2){
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/getOrderPlanSkuList',{
          planId:this.planId
        }).then(response => {
          if(response.data.success){
            this.planSkuList = response.data.result;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },
    mounted() {
      var _this=this;
      // 执行店铺设置
      $('#mulshop').multiselect({
        onInitialized: function (select, container) {
          $("._scroll").yi_scroll();
        },
        //下拉框关闭回调函数
        onDropdownHide: function (event) {
          _this.validateShop();
        }
      });
      // 订单类型设置
      $('#mulordertype').multiselect({
        onInitialized: function (select, container) {
          $("._scroll").yi_scroll();
        }
      });
      // 订单标记设置
      $('#mulsign').multiselect({
        onInitialized: function (select, container) {
          $("._scroll").yi_scroll();
        }
      });
      // 收货地址省份设置
      $('#muladdress').multiselect({
        onInitialized: function (select, container) {
          $("._scroll").yi_scroll();
        }
      });
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if (e && e.keyCode == 13 && $('.v-modal').length != 0) { // enter 键
          this.getSkuList(1);
        }
      };
    },
    methods: {
      //保存
      autoPlanSave(){
        this.validateShop();
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //订单类型
            var goodIds = '';
            this.planSkuList.forEach((item,i)=>{
              goodIds += item.skuId + ',';
            })
            this.temp.orderTypeIds = $('#mulordertype').val();
            this.temp.signTypeIds = $('#mulsign').val();
            this.temp.regionIds = $('#muladdress').val();
            this.temp.goodIds = goodIds.slice(0,-1);
            if(this.temp.runStartTime > this.temp.runEndTime){
              this.temp.runEndTime += 24*3600000;
            }
            //订单金额判断
            if(this.temp.startOrderAmt && this.temp.endOrderAmt && this.temp.startOrderAmt*1 < this.temp.endOrderAmt*1){
              this.$message({
                message: '拦截条件订单金额大于不能小于订单金额小于！',
                type: 'warning'
              });
              return false;
            }
            //客服备注包含与客服备注仅包含
            var isPass1 = false;
            this.temp.serviceRemarkOnly = this.temp.serviceRemarkOnly.replace(/,/g,'，').trim();
            var serviceRemarkOnly = this.temp.serviceRemarkOnly?this.temp.serviceRemarkOnly.split('，'):[];
            for(var i = 0;i < serviceRemarkOnly.length;i++){
              if(serviceRemarkOnly[i] == serviceRemarkOnly[i+1]){
                isPass1 = true;
              }
            }
            if(isPass1){
              this.$message({
                message: '客服备注仅包含关键词重复，请修改后再保存！',
                type: 'warning'
              });
              return false;
            }

            this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/addOrderPlan',this.temp).then(response => {
              if (response.data.success) {
                if(this.temp.orderAutoPlanId){
                  this.$message({
                    message: '修改成功！',
                    type: 'success'
                  });
                }else{
                  this.$message({
                    message: '保存成功！',
                    type: 'success'
                  });
                }
                this.$emit('changeShow',{isRefresh:true});
                //this.$router.push({name: 'automaticReviewScheme'});
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
      //输入框失焦校验
      validate(item){
        switch(item){
          case 1://订单金额大于
            this.temp.startOrderAmt = returnFloat(this.temp.startOrderAmt);
            if(this.temp.startOrderAmt*1 > 99999999){
              this.temp.startOrderAmt = 99999999;
            }
            break;
          case 2://订单金额小于
            this.temp.endOrderAmt = returnFloat(this.temp.endOrderAmt);
            if(this.temp.endOrderAmt*1 > 99999999){
              this.temp.endOrderAmt = 99999999;
            }
            break;
          case 3://订单净重大于
            this.temp.suttleLimit = returnOneFloat(this.temp.suttleLimit);
            if(this.temp.suttleLimit*1 > 9999999){
              this.temp.suttleLimit = 9999999;
            }
            break;
          case 4://订货数量大于
            if(this.temp.startGoodsQty*1 > 999999999){
              this.temp.startGoodsQty = 999999999;
            }
            break;
        }
      },
      //组件回传
      showParentBlock(clockBlock) {
        this.$emit('changeShow')
        //this.$router.push({name: 'automaticReviewScheme'});
      },
      //初始化下拉
      initSelect(){
        //fetchProvinceList() 收货地址省份下拉
        this.loading = true;
        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.apiVersion + '/getProvAndCity').then(response => {
          if(response.data.success){
            response.data.result.forEach((item,i)=>{
              item.value=item.regionId;
              item.label=item.regionName;
              //this.adds.push(item.value);
            })
            this.addresslist = response.data.result
            $('#muladdress').multiselect('dataprovider', this.addresslist);
            $('#muladdress').multiselect('select',[]);

            //select下拉函数
            this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/getPageElement',{
              planId:this.planId == 'fanhu'?'':this.planId
            }).then(response => {
              this.loading = false;
              if(response.data.success){
                var elem_orderType =  response.data.result.elem_orderType,
                  elem_signType =  response.data.result.elem_signType,
                  elem_store =  response.data.result.elem_store;
                //订单类型
                this.orderType = [];
                for(var item in elem_orderType){
                  var obj = {
                    value:item,
                    label:elem_orderType[item]
                  }
                  this.orderType.push(obj);
                }
                $('#mulordertype').multiselect('dataprovider', this.orderType);
                //订单标记
                this.signlist = [];
                for(var item in elem_signType){
                  var obj = {
                    value:item,
                    label:elem_signType[item]
                  }
                  this.signlist.push(obj);
                }
                $('#mulsign').multiselect('dataprovider', this.signlist);
                //$('#mulsign').multiselect('select',this.signs);
                //店铺
                this.shoplist = [];
                for(var item in elem_store){
                  var obj = {
                    value:item,
                    label:elem_store[item]
                  }
                  this.shoplist.push(obj);
                }
                $('#mulshop').multiselect('dataprovider', this.shoplist);
                //$('#mulshop').multiselect('select',this.shops);
                if(this.type == 2){
                  this.initSetting(this.planId);
                }
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //选择时间校验
      handleStartTime(value) {
        if(!this.temp.runEndTime){
          return false;
        }
       if(this.temp.runStartTime > this.temp.runEndTime){
        if((this.temp.runEndTime + 24*3600000) - this.temp.runStartTime < 600000){
          this.$message({
            message:'开始时间与结束时间间隔不能小于10分钟!',
            type: 'warning'
          });
          this.temp.runStartTime = '';
        }
       }else{
         if(this.temp.runEndTime - this.temp.runStartTime < 600000){
           this.$message({
             message:'开始时间与结束时间间隔不能小于10分钟!',
             type: 'warning'
           });
           this.temp.runStartTime = '';
         }
       }
      },
      handleEndTime(value) {
        if(!this.temp.runStartTime){
          return false;
        }
        if(this.temp.runStartTime > this.temp.runEndTime){
          if((this.temp.runEndTime + 24*3600000) - this.temp.runStartTime < 600000){
            this.$message({
              message:'开始时间与结束时间间隔不能小于10分钟!',
              type: 'warning'
            });
            this.temp.runEndTime = '';
          }
        }else{
          if(this.temp.runEndTime - this.temp.runStartTime < 600000){
            this.$message({
              message:'开始时间与结束时间间隔不能小于10分钟!',
              type: 'warning'
            });
            this.temp.runEndTime = '';
          }
        }
      },
      //校验参与店铺
      validateShop(){
        var _this=$('#mulshop');
        if($(_this).val().length==0){
          $(_this).next().children().eq(0).addClass('b-error');
          this.temp.shopIds = ''
        }else{
          $(_this).next().children().eq(0).removeClass('b-error');
          this.temp.shopIds = $(_this).val();
        }
        this.$refs.dataForm.validateField('shopIds');
      },
      //回显
      initSetting(planId) {
        this.loading = true;
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/get',{ planId}).then(response => {
          this.loading = false;
          if(response.data.success){
            response.data.result.shopIds = response.data.result.storesIds.split(',');
            response.data.result.flagIds = [];
            this.temp = response.data.result;
            this.temp.flagIds = this.temp.flagsIds?this.temp.flagsIds.split(','):[];
            $('#mulshop').multiselect('select', this.temp.storesIds.split(','));    //参与店铺
            $('#mulordertype').multiselect('select', this.temp.orderTypeIds.split(','));    //订单类型
            $('#mulsign').multiselect('select', this.temp.orderSignIds.split(','));    //订单标记
            $('#muladdress').multiselect('select', this.temp.regionIds.split(','));
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //批量移除
      onDeletePlanSku() {
        if(this.selPlanSku.length == 0){
          this.$message({
            message: '请选择要删除的拦截商品！',
            type: 'warning'
          });
          return false;
        }
        this.$confirm('确定要移除选中拦截商品吗?', this.$t('orderPlan.handlePrompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          this.selPlanSku.map(v => {
            var index = this.planSkuList.indexOf(v);
            this.planSkuList.splice(index, 1);
          })
        })
      },
      //获取弹框列表
      onPlanSku() {
        if(this.planSkuList.length > 0){
          //this.planSkuList = JSON.parse(JSON.stringify(this.storageList));
          this.dialogPlanSkuVisible = true;
          return false;
        }
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/getOrderPlanSkuList',{
          planId:this.planId
        }).then(response => {
          if(response.data.success){
            this.planSkuList = response.data.result;
            this.dialogPlanSkuVisible = true;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //选择selection
      onPlanSkuChange(val) {
        this.selPlanSku = val
      },
      //erter查询函数
      getSkuList(item) {
        this.listSkuLoading = true
        this._post('com.edb01.erp.oms.service.api.OrderAutoPlanService/' + this.apiVersion + '/addGoodsByGetOrderPlanSkuList',this.listSkuQuery).then(response => {
          if(response.data.success){
            this.skuList = response.data.result.rows
            this.skuTotal = response.data.result.total
            this.listSkuQuery.page = response.data.result.page
            this.listSkuQuery.size = response.data.result.size
            this.listSkuLoading = false;
            if(item!=1)this.dialogSkuVisible = true;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //获取添加弹窗列表
      onSku() {
        this.listSkuQuery.page = 1;
        this.listSkuQuery.size = 15;
        this.listSkuQuery.type = '1';
        this.listSkuQuery.brandId = '';
        this.listSkuQuery.searchType = '1';
        this.listSkuQuery.searchText = '';
        this.getSkuList()
        this.getBrandList();
      },
      //获取品牌列表
      getBrandList(){
        this._post('com.edb01.erp.mdata.service.api.BrandService/' + this.apiVersion + '/list',this.listSkuQuery).then(response => {
          if(response.data.success){
            this.brandList = response.data.result;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //添加弹框保存
      onSaveSku() {
        if(this.selSku.length == 0){
          this.$message({
            message: '请选择拦截商品！',
            type: 'warning'
          });
          return false;
        }
        if((this.planSkuList.length + this.selSku.length) > 500){
          this.$message({
            message: '拦截商品最多添加500个！',
            type: 'warning'
          });
          return false;
        }
        var mapArr = new Map();
        this.planSkuList.forEach((item,i)=>{
          mapArr.set(item.skuId,item);
        })
        this.selSku.forEach((item,i)=>{
          if(!mapArr.get(item.skuId)){
            this.planSkuList.push(item);
          }
        })
        //this.storageList = JSON.parse(JSON.stringify(this.planSkuList));
        this.dialogSkuVisible = false
      },
      //添加弹框选择
      onSkuChange(val) {
        this.selSku = val
      },
      //图片鼠标滑入滑出
      showImg(row,index) {
        this.picUrl = row.picUrl
      },
      showImg1() {
        this.picUrl = ''
      },
      skuSizeChange(val) {
        this.listSkuQuery.size = val
        this.getSkuList()
      },
      skuCurrentChange(val) {
        this.listSkuQuery.page = val
        this.getSkuList()
      }
    }
  }
</script>
<style scoped>
  .auto-breadcrumb{
    border-bottom: 1px solid #ddd;
    line-height: 30px;
    padding-left: 10px;
  }
</style>
<style>
  .auto-ruleForm .el-form-item__content{
    line-height: 30px !important;
  }
  .auto-ruleForm .el-form-item__label{
    line-height: 30px !important;
    height:30px;
  }
  .el-form-item__label{
    font-size:12px !important;
  }
</style>
