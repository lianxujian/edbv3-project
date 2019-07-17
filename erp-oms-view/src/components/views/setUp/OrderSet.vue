<!--订单设置 樊虎-->
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
      content="关闭智能分仓后，订单流程截断，不再进入下一环节。请在设置参数成功后，立即开启！">
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
              <el-step class="tooltips " title="订单写入">

                <template slot="title">
                  <el-popover
                    ref="orderWritePopover"
                    placement="left-end"
                    title=""
                    width="200"
                    trigger="hover"
                    content="关闭订单写入后，订单流程截断，不再进入下一环节，请在设置参数成功后，立即开启！"
                  >
                    <p style="font-size:16px;" slot="reference">订单写入</p>
                  </el-popover>
                </template>
                <template slot="title">
                  <el-switch ref="orderWriteSwitch" v-model="pageBean.writeOrderFlag">
                  </el-switch>
                </template>

              </el-step>

              <!--</el-tooltip>-->

              <el-step title="订单审核"></el-step>
              <el-step title="智能分仓" style="width: 1px;height: 1px">
                <template slot="title">
                  <el-popover
                    ref="orderInWarehousePopover"
                    placement="right-end"
                    title=""
                    width="200"
                    trigger="hover"
                    content="关闭智能分仓后，订单流程截断，不再进入下一环节。请在设置参数成功后，立即开启！">
                    <p style="font-size:16px;" slot="reference">智能分仓</p>
                  </el-popover>
                </template>
                <template slot="title">
                  <el-switch v-model="pageBean.storageOrderFlag">
                  </el-switch>
                </template>

              </el-step>
              <el-step title="分配快递"></el-step>
              <el-step title="发货"></el-step>
            </el-steps>

          </div>
        </el-col>
      </el-row>

    </div>
    <div class="head-box"><span>订单可售库存设置</span></div>
    <div class="content-box">
      <el-row :gutter="20">
        <el-col :span="1">
          <div class="">&nbsp;</div>
        </el-col>
        <el-col :span="12">
          <div style="margin-top:15px;">
            <el-checkbox :disabled="openManGiftInv" v-model="pageBean.openManGiftInv">管理赠品可售库存
            </el-checkbox>
            <el-tooltip class="item" effect="dark" content="若开启需通过赠品调整单调整赠品库存，订单所对应赠品均扣除已调整的赠品库存" placement="top-start">
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
            <el-checkbox :disabled="openManSuitSales" v-model="pageBean.openManSuitSales">管理套装可售库存
            </el-checkbox>
            <el-tooltip class="item" effect="dark" content="若开启需通过虚拟套装调整单调整套装库存，订单所对应套装均扣除已调整的套装库存不再扣除对应单品库存" placement="top-start">
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
            <el-checkbox :disabled="accountCamponFlag" v-model="pageBean.accountCamponFlag">缺货订单预占台账
            </el-checkbox>
            <el-tooltip class="item" effect="dark" content="开启后，缺货订单中的商品会预占台账库存" placement="top-start">
              <i class="el-icon-question" style="margin-left:5px;font-size:16px;"></i>
            </el-tooltip>
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
            <el-checkbox v-model="pageBean.autoMergeFlag">订单自动合并
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
            <el-input maxlength="9" type='text' placeholder="请输入内容" style="width:180px;" :min="0" :controls="false" @blur="validate" @keyup.native="channelKeyup" v-model="pageBean.payWaitSecTime"></el-input>
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
            <el-checkbox v-model="pageBean.earnestorderAuditFlag">开启定金订单预审
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
            <el-checkbox v-model="pageBean.earnestorderPickingFlag">开启定金订单预配货
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

          <!--宝洁新增-->
          <div class="box1">
            <el-checkbox v-model="pageBean.refundRepromotionFlag">退款订单不重新计算促销
            </el-checkbox>
          </div>

          <!--宝洁新增-->
          <div>
            <el-checkbox v-model="pageBean.refundOrderAutoEnd">退款订单自动取消
            </el-checkbox>
            <el-tooltip class="item" effect="dark" content="若对接AG则订单取消后自动推送订单至AG系统" placement="top-start">
              <i class="el-icon-question" style="margin-left:5px;font-size:16px;"></i>
            </el-tooltip>
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
            <el-checkbox v-model="pageBean.promotionCalculateFlag">开启促销计算
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
              <el-checkbox v-model="pageBean.strategyTimeoutFlag">设置策略过期
              </el-checkbox>
              <el-input type='text' maxlength="9" @blur="validate" v-model="pageBean.strategyTimeoutDay" @keyup.native="channelKeyup" style="width:180px;" placeholder="请输入内容"></el-input>
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
            <el-checkbox v-model="pageBean.invoiceFreightFlag">开票金额包含快递费
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
      <el-button type="primary" @click="saveOrderSetting" v-if="authorityCode.OMS_ORDERSET_SAVE">保存</el-button>
    </div>
  </div>
</template>
<script>
  import orderSettingParam from '@/components/views/setUp/children/order.param';
  import { positiveIntegerValidator } from '@/assets/js/validate.js';
  export default {
    name: "order-setting",
    data() {
      return {
        version:'1.0.0',
        saleSymbol:[
          {
            label:'【预售】',
            value:1
          },{
            label:'^@^',
            value:2
          }
        ],//预售符号集合
        salesList:[
          {
            label:'售价',
            value:1
          }
        ],//售价
        pageBean: {
          presaleSymbol:1,
          replacePriceType:1,
          payWaitSecTime:'',
          strategyTimeoutDay:'',
        },//保存设置入参
        openManSuitSales:false,
        openManGiftInv:false,
        accountCamponFlag:false,
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
        ],//7 15 30集合
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
      }
    },
    created() {
      this.getOrderSetting();
    },
    methods: {
      //退款订单自动拆分改变
      refundorderSplitFlagChange(){
        if(!this.pageBean.refundorderSplitFlag){
          this.pageBean.refundRepromotionFlag = false;
        }
      },
      //输入框失焦校验
      validate(){
        this.pageBean.payWaitSecTime=positiveIntegerValidator(this.pageBean.payWaitSecTime);
        this.pageBean.strategyTimeoutDay=positiveIntegerValidator(this.pageBean.strategyTimeoutDay);
      },
      channelKeyup(){
        this.pageBean.payWaitSecTime += '';
        this.pageBean.strategyTimeoutDay += '';
        setTimeout(()=>{
          this.pageBean.payWaitSecTime = this.pageBean.payWaitSecTime.replace(/[^\d]/g,'');
          this.pageBean.strategyTimeoutDay = this.pageBean.strategyTimeoutDay.replace(/[^\d]/g,'');
        })
        if(this.pageBean.payWaitSecTime.length>9){
          this.pageBean.payWaitSecTime=this.pageBean.payWaitSecTime.slice(0,9);
        }
        if(this.pageBean.strategyTimeoutDay.length>9){
          this.pageBean.strategyTimeoutDay=this.pageBean.strategyTimeoutDay.slice(0,9);
        }
      },
      //初始化回显
      getOrderSetting() {
        var self = this;
        self._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + self.version + '/query').then(response => {
          var self = this;
          if (response.data.success) {
            var updateTime = JSON.parse(JSON.stringify(response.data.result.updateTime));
            if(response.data.result)self.pageBean = response.data.result;
            self.pageBean.updateTime = updateTime;
            this.openManSuitSales = response.data.result.openManSuitSales;
            this.openManGiftInv = response.data.result.openManGiftInv;
            this.accountCamponFlag = response.data.result.accountCamponFlag;
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
      //保存设置
      saveOrderSetting() {
        var self = this;
        self._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + self.version + '/updateOrderSetUp', self.pageBean).then(response => {
          if (response.data.success) {
            self.$message({
              message:'更新成功',
              type: 'success'
            });
            this.getOrderSetting();
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
