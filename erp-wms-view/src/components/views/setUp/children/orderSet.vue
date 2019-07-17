<!--订单设置 南风-->
<template>
  <div id="orderSet" style="padding-bottom:95px !important;">
    <!--提示指令-->
    <el-popover
      ref="orderWritePopover"
      placement="left-end"
      title=""
      width="200"
      trigger="hover"
      content="关闭订单写入后，订单流程截断，不再进入下一环节，请在设置参数成功后，立即开启！"
    >
    </el-popover>

    <el-popover
      ref="orderInWarehousePopover"
      placement="right-start"
      title=""
      width="200"
      trigger="hover"
      content="关闭订单入仓后，订单流程截断，不再进入下一环节。请在设置参数成功后，立即开启！">
    </el-popover>


    <div class="head-box"><span>订单处理流程设置</span></div>
    <div class="content-box">
      <el-row :gutter="20">
        <el-col :span="2">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
        <el-col :span="14">
          <div class="box1" style="width: 600px">

            <el-steps :active="7" align-center>
              <el-step title="订单下载">
              </el-step>
              <!--<el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">-->
              <el-step class="tooltips " title="订单写入" v-popover:orderWritePopover>

                <template slot="title">订单写入<br/></template>
                <template slot="title">
                  <el-switch ref="orderWriteSwitch" v-model="pageBean.writeOrderFlag"
                             @change="onClickCheckbox('d1',pageBean.writeOrderFlag)">
                  </el-switch>
                </template>

              </el-step>

              <!--</el-tooltip>-->

              <el-step title="订单审核"></el-step>
              <el-step title="订单入仓" style="width: 1px;height: 1px" v-popover:orderInWarehousePopover>
                <template slot="title">订单入仓<br/></template>
                <template slot="title">
                  <el-switch v-model="pageBean.storageOrderFlag"
                             @change="onClickCheckbox('d2',pageBean.storageOrderFlag)">
                  </el-switch>
                </template>

              </el-step>
              <el-step title="分配快递"></el-step>
              <el-step title="仓库审核"></el-step>
              <el-step title="发货"></el-step>
            </el-steps>

          </div>
        </el-col>
      </el-row>

    </div>
    <div class="head-box"><span>订单设置</span></div>
    <div class="content-box">
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
        <el-col :span="5">
          <div class="box1">
            <el-checkbox v-model="pageBean.autoMergeFlag"
                         @change="onClickCheckbox('p1',pageBean.autoMergeFlag)">订单自动合并
            </el-checkbox>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="23">

          <div class="font-box" style="">
            <span style="text-align: end;margin-left:25px;"> 订单审核通过后，根据付款时间等待  </span>
            <el-input maxlength="9" type="number" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入内容" style="width:180px;" :min="0" :controls="false" @blur="validate" @keyup.native="channelKeyup" v-model="pageBean.payWaitSecTime"></el-input>
            <span style="text-align: end"> 分钟后，自动合并订单  </span>
          </div>

        </el-col>
      </el-row>


      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="5">
          <div class="box1">
            <el-checkbox v-model="pageBean.earnestorderAuditFlag"
                         @change="onClickCheckbox('p6',pageBean.earnestorderAuditFlag)">开启定金订单预审
            </el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="5">

          <div class="box1">
            <el-checkbox v-model="pageBean.earnestorderPickingFlag"
                         @change="onClickCheckbox('p7',pageBean.earnestorderPickingFlag)">开启定金订单预配货
            </el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="20">
          <div>
            <span> 订单发货 </span>
            <el-select v-model="pageBean.sendOutFinishDay" style="width:180px;display:inline-block;" placeholder="请选择">
              <el-option
                v-for="item in sendOutFinishDayArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span> 自动标为已完成 </span>
            <el-tooltip class="item" effect="dark" content="仅对手工导入订单有效" placement="top-start">
              <i class="el-icon-question" style="margin-left:5px;font-size:16px;"></i>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="12">
          <div style="margin-top:15px;">
            <el-checkbox v-model="pageBean.ordergiftNotSingSeparate">订单赠品不单独拆分一单
            </el-checkbox>
            <el-tooltip class="item" effect="dark" content="仅对智能仓库商品拆分和指定商品拆分有效" placement="top-start">
              <i class="el-icon-question" style="margin-left:5px;font-size:16px;"></i>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="head-box"><span>预售订单设置</span></div>
    <div class="content-box">
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
        <el-col :span="8">
          <div>
            <label for="">预售符号为：</label>
            <el-select v-model="pageBean.presaleSymbol" style="width:180px;" placeholder="请选择">
              <el-option
                v-for="item in saleSymbol"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="网店品名或网店规格含有'【预售】'或者'^@^'符号的均为预售订单" placement="top-start">
              <i class="el-icon-question" style="margin-left:5px;font-size:16px;"></i>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
        <el-col :span="5">
          <div class="box1">
            <el-checkbox v-model="pageBean.presellorderSplitFlag">预售订单自动拆分
            </el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
        <el-col :span="8">
          <div class="">
            <el-checkbox v-model="pageBean.presellorderInSplitFlag">预售期订单自动拆分
            </el-checkbox>
            <el-tooltip class="item" effect="dark" content="对网店规格备注'预售X天'或'XXXX.XX.XX'的预售产品，系统根据订单付款时间在第X天或预售日期当天自动进行拆分" placement="top-start">
              <i class="el-icon-question" style="margin-left:5px;font-size:16px;"></i>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
    </div>


    <div class="head-box"><span>退款订单设置</span></div>
    <div class="content-box">

      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="5">

          <div class="box1">
            <el-checkbox v-model="pageBean.refundorderSplitFlag">退款订单自动拆分
            </el-checkbox>
          </div>

        </el-col>
      </el-row>

    </div>
    <div class="head-box"><span>促销策略设置</span></div>
    <div class="content-box">

      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="5">

          <div class="box1">
            <el-checkbox v-model="pageBean.promotionCalculateFlag"
                         @change="onClickCheckbox('p4',pageBean.promotionCalculateFlag)">开启促销计算
            </el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="23">
          <div class="" style="height: 40px;">
            <div style="height: 20px;">
              <el-checkbox v-model="pageBean.strategyTimeoutFlag"
                           @change="onClickCheckbox('p5',pageBean.strategyTimeoutFlag)">设置策略过期
              </el-checkbox>
              <el-input type="number" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" maxlength="9" @blur="validate" v-model="pageBean.strategyTimeoutDay" @keyup.native="channelKeyup" style="width:180px;" placeholder="请输入内容"></el-input>
              <span>天后自动作废</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="head-box"><span>发票设置</span></div>
    <div class="content-box">
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="5">
          <div class="box1">
            <el-checkbox v-model="pageBean.invoiceFreightFlag"
                         @change="onClickCheckbox('p3',pageBean.invoiceFreightFlag)">开票金额包含快递费
            </el-checkbox>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="head-box"><span>同步库存设置</span></div>
    <div class="content-box">
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="12">
          <div style="margin-top:15px;">
            <el-checkbox v-model="pageBean.setDefalutExclusiveInventoryProportion">开启按默认独占库存比例独占库存
            </el-checkbox>
            <el-tooltip class="item" effect="dark" content="开启后，当商品在仓库上架后，默认按照独占库存设置中的比例同步独占库存" placement="top-start">
              <i class="el-icon-question" style="margin-left:5px;font-size:16px;"></i>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="head-box"><span>修改订单设置</span></div>
    <div class="content-box">
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="5">

          <div class="box1" style="display:inline-block;width:110px;">
            <el-checkbox v-model="pageBean.limitExchangeGoods">限制换货商品
            </el-checkbox>
          </div>
          <el-tooltip class="item" effect="dark" content="勾选时，在修改订单时替换的商品的价格必须小于原商品的价格" placement="top-start">
            <i class="el-icon-question" style="margin-left:5px;font-size:16px;"></i>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="20">
          <div>
            <el-select v-model="pageBean.replacePriceType" style="width:180px;display:inline-block;" placeholder="请选择">
              <el-option v-for="item in salesList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
            <span> 小于等于原商品</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="col-button">
      <el-button type="primary" @click="nextPage">返回</el-button>
      <el-button type="primary" @click="saveOrderSetting">保存</el-button>
    </div>
    <!--<div>-->
    <el-dialog v-dialogDrag
      :visible.sync="orderWriteDialogVisible"
      width="30%"
    >
      <div style="text-align:center;font-size: 20px;color: red"><i class="el-icon-warning"></i></div>
      <div style="text-align:center;">
         <span>关闭订单写入后，订单流程截断，不再进入下一环节，<br/>
        <span style="font-size: 15px;color: red">请在设置参数成功后，立即开启！</span></span><br/>
        <el-button @click="orderWriteDialogVisible = false">关 闭</el-button>
      </div>

    </el-dialog>
    <!--</div>-->

    <el-dialog v-dialogDrag
      :visible.sync="orderInWarehouseDialogVisible"
      width="30%"
    >
      <div style="text-align:center;font-size: 30px;color: red"><i class="el-icon-warning"></i></div>
      <div style="text-align:center;">
        <span>关闭订单入仓后，订单流程截断，不再进入下一环节,<br/><span style="font-size: 15px;color: red">请在设置参数成功后，立即开启！</span></span><br/>
        <el-button @click="orderInWarehouseDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import orderSettingParam from '@/components/views/setUp/children/order.param';
  import { positiveIntegerValidator } from '../../../../assets/js/validate.js';
  export default {
    name: "order-setting",
    data() {
      return {
        version:'1.0.0',
        saleSymbol:[
          {
            label:'【预售】',
            value:1
          },
          {
            label:'^@^',
            value:2
          },
        ],
        salesList:[
          {
            label:'售价',
            value:1
          }
        ],
        orderWrite: true,
        orderInWarehouseIsShow: false,
        checked: false,
        orderWriteDialogVisible: false,
        orderInWarehouseDialogVisible: false,
        isForbiddenSmartExpress: false,
        isForbiddenOrderGtNum: false,
        isForbiddenOrderSelection: false,
        isForbiddenMoneySmartExpress: false,
        pageBean: {
          presaleSymbol:1,
          replacePriceType:1
        },
        setGrantShopOptions: [],
        orderSelectionOptions: [],
        pageParam: [],
        sendOutFinishDayArr:[
          {
            label:'7天',
            value:7
          },
          {
            label:'15天',
            value:15
          },
          {
            label:'30天',
            value:30
          },
        ]
      }
    },
    created() {
      this.getOrderSetting();
    },
    methods: {
      nextPage() {
        this.$emit('showCityName',true);
      },
      validate(){
        this.pageBean.payWaitSecTime=positiveIntegerValidator(this.pageBean.payWaitSecTime);
        this.pageBean.strategyTimeoutDay=positiveIntegerValidator(this.pageBean.strategyTimeoutDay);
      },
      channelKeyup(){
        if(this.pageBean.payWaitSecTime.length>9){
          this.pageBean.payWaitSecTime=this.pageBean.payWaitSecTime.slice(0,9);
        }
        if(this.pageBean.strategyTimeoutDay.length>9){
          this.pageBean.strategyTimeoutDay=this.pageBean.strategyTimeoutDay.slice(0,9);
        }
      },
      getOrderSetting() {
        var self = this;
        //获得店铺列表
        /* self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/smartDeliveryIsSubscribed').then(response => {

           if (response.data.success) {
             self.setGrantShopOptions = response.data.result;
           } else {
             self.$message({
               message: response.data.msg,
               type: 'warning'
             });
           }
         }).catch(function (error) {
           console.log(error);
         })*/
        /* //获得智能快递列表
         self._post('com.edb01.erp.wms.service.api.ExpressService/' + self.version + '/listExpress').then(response => {
           if (response.data.success) {

             self.orderSelectionOptions = response.data.result;
             // alert(JSON.stringify(response.data.result))
           } else {
             self.$message({
               message: response.data.msg,
               type: 'warning'
             });
           }
         }).catch(function (error) {
           console.log(error);
         })*/
        self._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + self.version + '/query').then(response => {
          var self = this;
          if (response.data.success) {
            self.pageBean = response.data.result;
            /*if (self.pageParam.length > 0) {
              for (var i = 0; i < self.pageParam.length; i++) {
                //订单写入
                if (self.pageParam[i].name == orderSettingParam.ORDER_WRITE) {
                  self.pageBean.orderWriteIsShow = self.stringToBoolean(self.pageParam[i].value);
                  //订单入仓
                } else if (self.pageParam[i].name == orderSettingParam.ORDER_STORAGE) {
                  self.pageBean.orderInWarehouseIsShow = self.stringToBoolean(self.pageParam[i].value);
                  //订单自动合并
                } else if (self.pageParam[i].name == orderSettingParam.ORDER_AUTO_MERGE) {
                  self.pageBean.orderAutoMergeChecked = self.stringToBoolean(self.pageParam[i].value);
                  //预售订单自动拆分
                } else if (self.pageParam[i].name == orderSettingParam.ORDER_PRESELL_AUTO_SPILT) {
                  self.pageBean.presellOrderAutoSplitChecked = self.stringToBoolean(self.pageParam[i].value);
                } else if (self.pageParam[i].name == orderSettingParam.ORDER_REFUND_AUTO_SPLIT) {
                  self.pageBean.refundOrderAutoSplitChecked = self.stringToBoolean(self.pageParam[i].value);
                  //开启促销计算
                } else if (self.pageParam[i].name == orderSettingParam.SALES_PROMOTION) {
                  self.pageBean.openPromotionSettingChecked = self.stringToBoolean(self.pageParam[i].value);
                  //"设置策略过期"
                } else if (self.pageParam[i].name == orderSettingParam.STRATEGY_OVERDUE) {
                  self.pageBean.setStrategyExpireChecked = self.stringToBoolean(self.pageParam[i].value);
                  //设置策略过期时间
                } else if (self.pageParam[i].name == orderSettingParam.STRATEGY_OVERDUE_TIME) {
                  self.pageBean.strategyExpireTime = self.pageParam[i].value;
                  //开启定金订单预审
                } else if (self.pageParam[i].name == orderSettingParam.ORDER_DEPOSIT_PRELIMANERY) {
                  self.pageBean.depositOrderPreChecked = self.stringToBoolean(self.pageParam[i].value);
                  //开启定金订单预配货
                } else if (self.pageParam[i].name == orderSettingParam.ORDER_DEPOSIT_PREALLOCATION) {
                  self.pageBean.depositOrderprepareChecked = self.stringToBoolean(self.pageParam[i].value);
                  //开启智能快递
                } else if (self.pageParam[i].name == orderSettingParam.SMART_DELIVERY) {
                  self.pageBean.openSmartExpressChecked = self.stringToBoolean(self.pageParam[i].value);
                  //按金额指定快递
                } else if (self.pageParam[i].name == orderSettingParam.SMART_DELIVERY_ASSIGNED) {
                  self.pageBean.amountAppointExpressChecked = self.stringToBoolean(self.pageParam[i].value);
                  //设置授权店铺
                } else if (self.pageParam[i].name == orderSettingParam.SMART_DELIVERY_ASSIGNED_SHOP) {
                  // self.pageBean.setGrantShopSelection= self.pageParam[i].value;
                  self.pageBean.setGrantShop = self.pageParam[i].value;
                  // alert("设置授权店铺"+self.pageBean.setGrantShop);
                } else if (self.pageParam[i].name == orderSettingParam.SMART_DELIVERY_ASSIGNED_FEE) {
                  self.pageBean.orderGtNum = self.pageParam[i].value;
                  //orderSelection
                } else if (self.pageParam[i].name == orderSettingParam.SMART_DELIVERY_ASSIGNED_EXPRESS) {
                  self.pageBean.orderSelection = self.pageParam[i].value;
                }

              }
            }*/
          } else {
            self.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      selectChange(value) {
        var self = this;
        console.log(JSON.stringify(this.setGrantShopOptions));
        let smartParam = {};
        smartParam = self.setGrantShopOptions.find((item) => {
          return item.shopName === value;
        });
        console.log(JSON.stringify(smartParam));

        // 判断店铺是否在淘宝开启了智能仓库服务。
        self._post('/com.edb01.erp.data.service.ShopService/' + self.version + '/smartDeliveryIsSubscribed', smartParam).then(response => {
          if (response.data.success) {
            self.expressForbidden(true);
          } else {
            self.expressForbidden(false);
            self.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        })
      },
      stringToBoolean(value) {
        // alert(value);
        if (value == "1") {
          return true;
        } else if (value == "0") {
          return false;
        }

      },
      booleanToString(value) {
        if (value) {
          return "1";
        } else {
          return "0";
        }

      },
      onClickCheckbox(name, isdisableValue) {
        var self = this;
        if (self.pageParam.length > 0) {
          for (var i = 0; i < self.pageParam.length; i++) {
            //订单写入
            if (name == "d1" && self.pageParam[i].name == orderSettingParam.ORDER_WRITE) {
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              // alert("订单写入"+self.pageParam[i].value);
              //订单入仓
            } else if (name == "d2" && self.pageParam[i].name == orderSettingParam.ORDER_STORAGE) {
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              // alert("订单入仓"+self.pageParam[i].value);
              //订单自动合并
            } else if (name == "p1" && self.pageParam[i].name == orderSettingParam.ORDER_AUTO_MERGE) {
              // alert("订单自动合并=="+ self.booleanToString(isdisableValue));
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              //预售订单自动拆分
            } else if (name == "p2" && self.pageParam[i].name == orderSettingParam.ORDER_PRESELL_AUTO_SPILT) {
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              // alert("预售订单自动拆分  p2=="+  self.pageParam[i].value);
              //退款订单自动拆分
            } else if (name == "p3" && self.pageParam[i].name == orderSettingParam.ORDER_REFUND_AUTO_SPLIT) {
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              // alert("退款订单自动拆分  p3==="+  self.pageParam[i].value);
              //开启促销计算
            } else if (name == "p4" && self.pageParam[i].name == orderSettingParam.SALES_PROMOTION) {
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              // alert("开启促销计算  p4=="+  self.pageParam[i].value);
              //"设置策略过期"
            } else if (name == "p5" && self.pageParam[i].name == orderSettingParam.STRATEGY_OVERDUE) {
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              // alert("设置策略过期  p5="+  self.pageParam[i].value);
              //开启定金订单预审
            } else if (name == "p6" && self.pageParam[i].name == orderSettingParam.ORDER_DEPOSIT_PRELIMANERY) {
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              // alert("开启定金订单预审  p6"+  self.pageParam[i].value);
              //开启定金订单预配货
            } else if (name == "p7" && self.pageParam[i].name == orderSettingParam.ORDER_DEPOSIT_PREALLOCATION) {
              self.pageParam[i].value == self.booleanToString(isdisableValue);
              // alert("开启定金订单预配货  p7"+  self.pageParam[i].value);
              //开启智能快递
            } else if (name == "p8" && self.pageParam[i].name == orderSettingParam.SMART_DELIVERY) {
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              // alert("开启智能快递  p8"+  self.pageParam[i].value);
              //按金额指定快递
            } else if (name == "p9" && self.pageParam[i].name == orderSettingParam.SMART_DELIVERY_ASSIGNED) {
              self.pageParam[i].value = self.booleanToString(isdisableValue);
              // alert("按金额指定快递  p9=="+  self.pageParam[i].value);
              //
            }

          }
        }
      },
      expressForbidden(isTrue) {
        var self = this;
        if (isTrue) {
          self.isForbiddenSmartExpress = false;
          self.isForbiddenOrderGtNum = false;
          self.isForbiddenOrderSelection = false;
          self.isForbiddenMoneySmartExpress = false;
        } else {
          self.isForbiddenSmartExpress = true;
          self.isForbiddenOrderGtNum = true;
          self.isForbiddenOrderSelection = true;
          self.isForbiddenMoneySmartExpress = true;
        }

      },
      orderWriteDialogMethod() {
        if (this.pageBean.orderWriteIsShow) {
          this.orderWriteDialogVisible = true;
        }
      },
      orderInWarehouseDialogMethod() {
        if (this.pageBean.orderInWarehouseIsShow) {
          this.orderInWarehouseDialogVisible = true;
        }
      },
      saveOrderSetting() {
        var self = this;
        /*if (self.pageParam.length > 0) {
          for (var i = 0; i < self.pageParam.length; i++) {
            //设置授权店铺
            if (self.pageParam[i].name == orderSettingParam.SMART_DELIVERY_ASSIGNED_SHOP) {
              self.pageParam[i].value = self.pageBean.setGrantShop;
              //按金额指定快递最小金额
            } else if (self.pageParam[i].name == orderSettingParam.SMART_DELIVERY_ASSIGNED_FEE) {
              self.pageParam[i].value = self.pageBean.orderGtNum;
              //按金额指定快递种类
            } else if (self.pageParam[i].name == orderSettingParam.SMART_DELIVERY_ASSIGNED_EXPRESS) {
              self.pageParam[i].value = self.pageBean.orderSelection;
            }
            else if (self.pageParam[i].name == orderSettingParam.STRATEGY_OVERDUE_TIME) {
              self.pageParam[i].value = self.pageBean.strategyExpireTime;
            }

          }
        }*/
        self._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + self.version + '/updateOrderSetUp', self.pageBean).then(response => {
          if (response.data.success) {
            self.$message({
              message:'更新成功',
              type: 'success'
            });
          } else {
            self.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
          self.$message({
            message: error,
            type: 'warning'
          });
        });


      }
    }
  }
</script>
<style scoped>
  .head-box {
    width: 100%;
    height: 30px;
    background: #cbccd1;
    text-align: left;
    line-height: 30px;
    padding-left: 10px;
    font-size: 15px;
  }
  .box1 {
    width: 150px;
    text-align: left;
    /*background-color: aquamarine;*/
    margin-bottom: 15px;
    margin-top: 10px;
  }
  .font-box {
    font-size: 14px;
  }
  .content-box {
    margin-top: 10px;
    margin-bottom: 20px;
  }
</style>
