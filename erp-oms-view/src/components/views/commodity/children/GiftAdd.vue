<!--赠品策略新增 樊虎-->
<template>
  <div id="giftStrategy-add" style='padding-bottom:75px !important;'>
    <el-breadcrumb separator=">" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/giftStrategy' }"><span @click="showParentBlock">赠品策略</span></el-breadcrumb-item>
      <el-breadcrumb-item>{{titleName}}赠品策略</el-breadcrumb-item>
    </el-breadcrumb>
    <!--基本信息-->
    <p class="fh-title">基本信息</p>
    <div style="margin-left:8px;">
      <el-form :model="paramData" :rules="rules" ref="ruleForm" label-width="80px" class="ruleForm">
        <el-form-item label="策略名称：" prop="giftStrategyName">
          <el-input v-model.trim="paramData.giftStrategyName" :disabled="forbidden" placeholder="最多不超过20个汉字" :maxlength="20"></el-input>
          <span v-if="paramData.giftStrategyName.length>0&& paramData.giftStrategyName.length<20">{{paramData.giftStrategyName.length}}/20</span><span v-if="paramData.giftStrategyName.length==20" style="color:#fa5555;">20/20</span>
        </el-form-item>
        <el-form-item v-show="!forbidden"  label="参与店铺：" required>
          <select id="participate-shop" name="multiselect[]" multiple="multiple" required>
            <option v-for="item in participateShopArr" :value="item.value">{{item.label}}</option>
          </select>
          <p style="position:absolute;top:25px;color:#fa5555;" class="mul-error">请选择店铺</p>
        </el-form-item>
        <el-form-item v-show="forbidden"  label="参与店铺：" required>
          <el-select multiple collapse-tags v-model="paramData.storeIdList" placeholder="未分组">
            <el-option
              disabled
              v-for="item in participateShopArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <p style="position:absolute;top:25px;color:#fa5555;" class="mul-error">请选择店铺</p>
        </el-form-item>
        <el-form-item v-show="!forbidden" label="参与渠道：" required>
          <select id="participate-channel" name="multiselect[]" multiple="multiple" required>
            <option v-for="item in participationChannelArr" :value="item.value">{{item.label}}</option>
          </select>
          <p style="position:absolute;top:25px;color:#fa5555;" class="mul-error">请选择渠道</p>
        </el-form-item>
        <el-form-item v-show="forbidden" label="参与渠道：" required>
          <el-select multiple collapse-tags v-model="paramData.channelIdList" placeholder="未分组">
            <el-option
              disabled
              v-for="item in participationChannelArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <p style="position:absolute;top:25px;color:#fa5555;" class="mul-error">请选择渠道</p>
        </el-form-item>
        <el-form-item label="所属分组：">
          <el-select :disabled="forbidden" v-model="paramData.giftStrategyGroupId" clearable filterable placeholder="未分组">
            <el-option
              v-for="item in groupArr"
              :key="item.giftStrategyGroupId"
              :label="item.groupName"
              :value="item.giftStrategyGroupId">
            </el-option>
          </el-select>
        </el-form-item>
        <div style="display:inline-block;padding-bottom:15px;width:319px;margin-right:40px;" v-if="type == 2 || type == 4">
          <label for="" style="width: 74px;text-align: right;margin-right: 4px;">策略编号：</label>
          <el-input  v-model.trim="paramData.giftStrategyNo" disabled></el-input>
        </div>
        <div style="display:inline-block;padding-bottom:15px;margin-right:68px;">
          <label for="" style="width: 74px;text-align: right;margin-right: 4px;"><span style="color:#FA5555;margin-right:3px;">*</span>参与会员：</label>
          <el-select :disabled="forbidden" v-model="memberId" placeholder="" @change="partyMembersChange">
            <el-option
              v-for="item in partyMembersArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <p v-if="isSetMember" style="color:#409EFF;cursor:pointer;display:inline-block;" @click="setMemberDialog">设置会员范围</p>
          <el-select :disabled="forbidden" v-if="newOldMember" v-model="subUserRangeid" placeholder="">
            <el-option
              v-for="item in subPartyMembersArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="display:inline-block;padding-bottom:15px;margin-right:40px;">
          <label for="" style="width: 92px;text-align: right;margin-right: 4px;"><span style="color:#FA5555;margin-right:3px;"></span>排序等待时间：</label>
          <span>策略开始</span>
          <el-input v-model="paramData.sortWaitTime" :disabled="forbidden" @keyup.native="paramData.sortWaitTime = paramData.sortWaitTime.replace(/[^\d]/ig,'')" style="width:80px !important;" :maxlength="4"></el-input>
          <span>分钟后停止排序</span>
        </div>
      </el-form>
    </div>
    <!--赠送方式-->
    <p class="fh-title" style="margin-top:0;">赠送方式</p>
    <div class="fh-title-c">
      <el-radio-group v-model="paramData.giftingWay" @change="givingWayChange" :disabled="forbidden">
        <el-radio v-for="item in givingWayArr" :label="item.value" :key="item.value">{{item.label}}</el-radio>
      </el-radio-group>
    </div>
    <!--订单筛选-->
    <p class="fh-title">订单筛选</p>
    <div class="fh-title-c">
      <el-checkbox-group v-model="paramData.orderTypeIdList" @change="resetGiveTimeType" :disabled="forbidden">
        <el-checkbox v-for="item in orderTypeArr" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <!--赠送时机-->
    <p class="fh-title">赠送时机</p>
    <div class="fh-title-c">
      <el-radio-group v-model="paramData.giveTimeType" :disabled="forbidden" @change="channelGiveTimeType">
        <el-radio label="1" style="margin-right:10px;">付款赠送</el-radio>
        <el-radio label="2" style="margin-right:10px;margin-left:0;">下单赠送</el-radio>
        <el-radio label="3" style="margin-right:0px;margin-left:0;" :disabled="!((giftStrategy5 || giftStrategy7) && paramData.orderTypeIdList.length == 1 && paramData.orderTypeIdList[0] == 3)">首尾款赠送</el-radio>
        <el-tooltip class="item" effect="dark" content="仅定金订单的“指定单品买就送”和“名额阶梯送”支持首尾款赠送。" placement="top-start">
          <i class="el-icon-question" style="margin-left:10px;font-size:16px;color:#ccc;"></i>
        </el-tooltip>
      </el-radio-group>
      <div style="display:inline-block;margin-left:20px;" class="fh-date-packer">
        <label for="">
          <span style="color:red;margin-right:2px;">*</span><span v-if="paramData.giveTimeType == 1">付款</span><span v-if="paramData.giveTimeType == 2">下单</span><span v-if="paramData.giveTimeType == 3">首款</span>时间：</label>
        <!--//orderBeginTime orderEndTime finalBeginTime finalEndTime-->
        <el-date-picker
          :disabled="forbidden"
          :editable="false"
          style="width:163px;"
          v-model="paramData.orderBeginTime"
          type="datetime"
          placeholder="开始日期"
          format='yyyy-MM-dd HH:mm:ss'
          value-format='timestamp'>
        </el-date-picker>
        <span>-</span>
        <el-date-picker
          :disabled="forbidden && forbidden1"
          :editable="false"
          style="width:163px;"
          v-model="paramData.orderEndTime"
          type="datetime"
          placeholder="结束日期"
          format='yyyy-MM-dd HH:mm:ss'
          value-format='timestamp'>
        </el-date-picker>
      </div>
      <div style="display:inline-block;margin-left:20px;" class="fh-date-packer" v-if="paramData.giveTimeType == 3">
        <span style="color:red;margin-right:2px;">*</span><label for="">尾款时间：</label>
        <el-date-picker
          :disabled="forbidden"
          :editable="false"
          style="width:163px;"
          v-model="paramData.finalBeginTime"
          type="datetime"
          placeholder="开始日期"
          format='yyyy-MM-dd HH:mm:ss'
          value-format='timestamp'>
        </el-date-picker>
        <span>-</span>
        <el-date-picker
          :disabled="forbidden  && forbidden1"
          :editable="false"
          style="width:163px;"
          v-model="paramData.finalEndTime"
          type="datetime"
          placeholder="结束日期"
          format='yyyy-MM-dd HH:mm:ss'
          value-format='timestamp'>
        </el-date-picker>
      </div>
    </div>
    <!--订单金额阶梯送 指定商品-->
    <div v-if="giftStrategy1 && excludeGoodsJson.length == 0">
      <p class="fh-title" style="margin-bottom: 10px;">指定商品</p>
      <div
        style="padding:10px 0 10px 10px;height:40px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-top: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
        <span v-if="!forbidden" @click="addDialog('limit')">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加商品</span>
        </span>
        <span v-if="!forbidden" @click="excelExportGoods('limit')">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
        </span>
      </div>
      <el-table
        border
        @cell-dblclick="celldbClick"
        :data="goodsLimitsJson"
      >
        <el-table-column
          align='center'
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          align='center'
          :show-overflow-tooltip='true'
          label="商品名称"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="goodsBarCode"
          align='center'
          min-width=''
          label="条形码">
        </el-table-column>
        <el-table-column
          prop="goodsSpec"
          label="规格"
          min-width=''
          align='center'
          width="">
        </el-table-column>
        <el-table-column
          label="操作"
          v-if="!forbidden"
          align='center'
          width="110">
          <template slot-scope="scope">
            <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
               @click="deleteExcludeBtn(scope.$index, scope.row,'goodsLimitsJson')"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--赠品信息-->
    <p class="fh-title" style="margin-bottom: 10px;">赠品信息</p>
    <!--订单金额阶梯赠送-->
    <div v-if="giftStrategy1" v-for="(strategyData,i) in giftStrategyData1">
      <div
        style="background:#F4F9FF;float:left;height: 42px;border: 1px solid #ebeef5;line-height: 42px;padding: 0 15px;">
        <span style="display:inline-block;width:20px;">{{i + 1}}.</span>
        <span style="margin-right:15px;">商品金额满</span>
        <el-input  style="width:70px !important;" :disabled="forbidden" v-model="strategyData.orderStartAmt"
                   @blur="validation(i,1)"></el-input>
        <span>—</span>
        <el-input  style="width:70px !important;" :disabled="forbidden" v-model="strategyData.orderEndAmt"
                   @blur="validation(i,2)"></el-input>
        <span style="margin-right:20px;"> 元</span>
        <el-radio-group :disabled="forbidden" v-model="strategyData.fullGiftWay">
          <el-radio :label="1">全部送</el-radio>
          <el-radio :label="2">随机送</el-radio>
          <el-radio :label="3">顺序送</el-radio>
        </el-radio-group>
      </div>
      <div style="float:left;margin-top:7px;">
        <i class="el-icon-circle-plus" @click="addLadder(1)" v-if="i==giftStrategyData1.length-1 && !forbidden"
           style="font-size:25px;color:#409EFF;margin-left:15px;cursor: pointer;"></i>
        <i class="el-icon-remove" @click="reduceLadder(1,i)" v-if="giftStrategyData1.length>1 && !forbidden"
           style="font-size:25px;color:#FF2424;margin-left:15px;cursor: pointer;"></i>
      </div>
      <div style="clear:both;"></div>
      <div
        v-if="!forbidden"
        style="padding:15px 0 10px 15px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
        <span @click="addGiftDialog('1-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加赠品</span>
        </span>
        <span v-if="!forbidden" @click="excelExportGift('1-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
        </span>
      </div>
      <div class="border">
        <el-table
          border
          @cell-dblclick="celldbClick"
          :data="strategyData.giftBeanList"
        >
          <el-table-column
            align='center'
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="giftName"
            align='center'
            :show-overflow-tooltip='true'
            label="商品名称"
            min-width="">
          </el-table-column>
          <el-table-column
            prop="barCode"
            align='center'
            min-width=''
            label="条形码">
          </el-table-column>
          <el-table-column
            prop="spec"
            label="规格"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column prop="numEdit" align="center">
            <template slot="header" slot-scope="scope">
              <span>赠送数量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.numEdit"  v-model="scope.row.giveQty"
                        @blur="keyupNumSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalEdit"
            align='center'>
            <template slot="header" slot-scope="scope">
              <span>赠送总量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.totalNumEdit"  v-model="scope.row.giveTotalQty"
                        @blur="keyupTotalSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveTotalQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="givedQty"
            align='center'
            label="已赠送数量"
            width="">
          </el-table-column>
          <el-table-column
            v-if="!forbidden"
            label="操作"
            align='center'
            width="110">
            <template slot-scope="scope">
              <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
                 @click="deleteBtn(scope.$index, scope.row,'1-'+i)"></i>
              <i class="el-icon-upload2" @click="upArrowBtn(scope.row,'1-'+i)"
                 v-if="scope.$index!=0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-upload2" v-if="scope.$index==0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download" @click="downArrowBtn(scope.row,'1-'+i)"
                 v-if="scope.$index!=strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:orange;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download"
                 v-if="scope.$index==strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--订单满金额赠送-->
    <div v-if="giftStrategy2" v-for="(strategyData,i) in giftStrategyData2">
      <div
        style="background:#F4F9FF;display:inline-block;height: 42px;border: 1px solid #ebeef5;line-height: 42px;padding: 0 15px;">
        <span style="margin:0 15px 0 0;">商品金额满</span>
        <el-input style="width:70px !important;" :disabled="forbidden" v-model="strategyData.fullGiftAmt"
                   @blur="validation(i,3)"></el-input>
        <span style="margin-right:20px;"> 元</span>
        <el-radio-group :disabled="forbidden" v-model="strategyData.fullGiftWay">
          <el-radio :label="1">全部送</el-radio>
          <el-radio :label="2">随机送</el-radio>
          <el-radio :label="3">顺序送</el-radio>
        </el-radio-group>
      </div>
      <el-checkbox style="margin:0 0 0 15px;" :disabled="forbidden" v-model="paramData.giftDoubleFlag">赠品倍增</el-checkbox>
      <el-tooltip class="item" effect="dark" content="示例：设置满200元送一个A。若一个订单金额为400元，勾选此参数，则赠送2个A，不勾选只送1个A。" placement="top-start">
        <i class="el-icon-question" style="margin-left:20px;font-size:16px;color:#ccc;"></i>
      </el-tooltip>
      <div v-if="!forbidden"
        style="padding:15px 0 10px 15px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
        <span @click="addGiftDialog('2-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加赠品</span>
        </span>
        <span v-if="!forbidden" @click="excelExportGift('2-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
        </span>
      </div>
      <div class="border">
        <el-table
          border
          @cell-dblclick="celldbClick"
          :data="strategyData.giftBeanList"
        >
          <el-table-column
            align='center'
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="giftName"
            align='center'
            :show-overflow-tooltip='true'
            label="商品名称"
            min-width="">
          </el-table-column>
          <el-table-column
            prop="barCode"
            align='center'
            min-width=''
            label="条形码">
          </el-table-column>
          <el-table-column
            prop="spec"
            label="规格"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column prop="numEdit" align="center">
            <template slot="header" slot-scope="scope">
              <span>赠送数量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.numEdit"  v-model="scope.row.giveQty"
                        @blur="keyupNumSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalEdit"
            align='center'>
            <template slot="header" slot-scope="scope">
              <span>赠送总量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.totalNumEdit"  v-model="scope.row.giveTotalQty"
                        @blur="keyupTotalSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveTotalQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="givedQty"
            align='center'
            label="已赠送数量"
            width="">
          </el-table-column>
          <el-table-column
            label="操作"
            v-if="!forbidden"
            align='center'
            width="110">
            <template slot-scope="scope">
              <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
                 @click="deleteBtn(scope.$index, scope.row,'2-'+i)"></i>
              <i class="el-icon-upload2" @click="upArrowBtn(scope.row,'2-'+i)"
                 v-if="scope.$index!=0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-upload2" v-if="scope.$index==0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download" @click="downArrowBtn(scope.row,'2-'+i)"
                 v-if="scope.$index!=strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:orange;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download"
                 v-if="scope.$index==strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--订单满件数赠送-->
    <div v-if="giftStrategy3" v-for="(strategyData,i) in giftStrategyData3">
      <div
        style="background:#F4F9FF;display:inline-block;height: 42px;border: 1px solid #ebeef5;line-height: 42px;padding: 0 15px;">
        <span style="margin:0 15px 0 0;">订单满</span>
        <el-input  style="width:70px !important;" :disabled="forbidden" v-model="strategyData.fullGiftQty" required="required"
                   @blur="validation(i,4)"></el-input>
        <span style="margin-right:20px;"> 件数</span>
        <el-radio-group :disabled="forbidden" v-model="strategyData.fullGiftWay">
          <el-radio :label="1">全部送</el-radio>
          <el-radio :label="2">随机送</el-radio>
          <el-radio :label="3">顺序送</el-radio>
        </el-radio-group>
      </div>
      <el-checkbox style="margin:0 0 0 15px;" :disabled="forbidden" v-model="paramData.giftDoubleFlag">赠品倍增</el-checkbox>
      <el-tooltip class="item" effect="dark" content="示例：设置满2件送一个A。若一个订单总件数为4件，勾选此参数，则赠送2个A，不勾选只送1个A。" placement="top-start">
        <i class="el-icon-question" style="margin-left:20px;font-size:16px;color:#ccc;"></i>
      </el-tooltip>
      <div v-if="!forbidden"
        style="padding:15px 0 10px 15px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
        <span @click="addGiftDialog('3-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加赠品</span>
        </span>
        <span v-if="!forbidden" @click="excelExportGift('3-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
        </span>
      </div>
      <div class="border">
        <el-table
          border
          @cell-dblclick="celldbClick"
          :data="strategyData.giftBeanList"
        >
          <el-table-column
            align='center'
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="giftName"
            align='center'
            :show-overflow-tooltip='true'
            label="商品名称"
            min-width="">
          </el-table-column>
          <el-table-column
            prop="barCode"
            align='center'
            min-width=''
            label="条形码">
          </el-table-column>
          <el-table-column
            prop="spec"
            label="规格"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column prop="numEdit" align="center">
            <template slot="header" slot-scope="scope">
              <span>赠送数量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.numEdit"  v-model="scope.row.giveQty"
                        @blur="keyupNumSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalEdit"
            align='center'>
            <template slot="header" slot-scope="scope">
              <span>赠送总量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.totalNumEdit"  v-model="scope.row.giveTotalQty"
                        @blur="keyupTotalSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveTotalQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="givedQty"
            align='center'
            label="已赠送数量"
            width="">
          </el-table-column>
          <el-table-column
            label="操作"
            align='center'
            v-if="!forbidden"
            width="110">
            <template slot-scope="scope">
              <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
                 @click="deleteBtn(scope.$index, scope.row,'3-'+i)"></i>
              <i class="el-icon-upload2" @click="upArrowBtn(scope.row,'3-'+i)"
                 v-if="scope.$index!=0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-upload2" v-if="scope.$index==0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download" @click="downArrowBtn(scope.row,'3-'+i)"
                 v-if="scope.$index!=strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:orange;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download"
                 v-if="scope.$index==strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--订单满种类赠送-->
    <div v-if="giftStrategy4" v-for="(strategyData,i) in giftStrategyData4">
      <div
        style="background:#F4F9FF;display:inline-block;height: 42px;border: 1px solid #ebeef5;line-height: 42px;padding: 0 15px;">
        <span style="margin:0 15px 0 0;">订单满</span>
        <el-input  style="width:70px !important;" :disabled="forbidden" v-model="strategyData.fullGiftTypeQty"
                   @blur="validation(i,5)"></el-input>
        <span style="margin-right:0px;"> 种</span>
        <el-tooltip class="item" effect="dark" content="一个套装算作一种。" placement="top-start">
          <i class="el-icon-question" style="margin:5px 40px 0 10px;font-size:16px;color:rgb(204, 204, 204);"></i>
        </el-tooltip>
        <el-radio-group :disabled="forbidden" v-model="strategyData.fullGiftWay">
          <el-radio :label="1">全部送</el-radio>
          <el-radio :label="2">随机送</el-radio>
          <el-radio :label="3">顺序送</el-radio>
        </el-radio-group>
      </div>
      <div v-if="!forbidden"
        style="padding:15px 0 10px 15px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
        <span @click="addGiftDialog('4-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加赠品</span>
        </span>
        <span v-if="!forbidden" @click="excelExportGift('4-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
        </span>
      </div>
      <div class="border">
        <el-table
          border
          @cell-dblclick="celldbClick"
          :data="strategyData.giftBeanList"
        >
          <el-table-column
            align='center'
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="giftName"
            align='center'
            :show-overflow-tooltip='true'
            label="商品名称"
            min-width="">
          </el-table-column>
          <el-table-column
            prop="barCode"
            align='center'
            min-width=''
            label="条形码">
          </el-table-column>
          <el-table-column
            prop="spec"
            label="规格"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column prop="numEdit" align="center">
            <template slot="header" slot-scope="scope">
              <span>赠送数量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.numEdit"  v-model="scope.row.giveQty"
                        @blur="keyupNumSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalEdit"
            align='center'>
            <template slot="header" slot-scope="scope">
              <span>赠送总量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.totalNumEdit"  v-model="scope.row.giveTotalQty"
                        @blur="keyupTotalSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveTotalQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="givedQty"
            align='center'
            label="已赠送数量"
            width="">
          </el-table-column>
          <el-table-column
            label="操作"
            v-if="!forbidden"
            align='center'
            width="110">
            <template slot-scope="scope">
              <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
                 @click="deleteBtn(scope.$index, scope.row,'4-'+i)"></i>
              <i class="el-icon-upload2" @click="upArrowBtn(scope.row,'4-'+i)"
                 v-if="scope.$index!=0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-upload2" v-if="scope.$index==0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download" @click="downArrowBtn(scope.row,'4-'+i)"
                 v-if="scope.$index!=strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:orange;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download"
                 v-if="scope.$index==strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--指定单品买就送-->
    <div v-if="giftStrategy5" v-for="(strategyData,i) in giftStrategyData5">
      <div
        v-if="!forbidden"
        style="padding:15px 0 10px 15px;background:#F7F7F7;border-top: 1px solid #ebeef5;border-right: 1px solid #ebeef5;border-left: 1px solid #ebeef5;">
        <div @click="addDialog('5-'+i)" style="width: 60px;display: inline-block;">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加</span>
        </div>
        <span v-if="!forbidden" @click="excelExportGoods('testData')">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
        </span>
      </div>
      <!-- 指定单品买就送-定金 -->
      <div class="border" v-show="paramData.giveTimeType == 3">
        <el-table
          :data="testData"
          tooltip-effect="dark"
          border
          class="fh-table"
          style="width:100%;">
          <el-table-column
            label="序号"
            align="center"
            type="index">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsName"
            :show-overflow-tooltip='true'
            label="商品名称">
          </el-table-column>
          <el-table-column
            align="center"
            :show-overflow-tooltip='true'
            prop="barCode"
            label="条形码">
          </el-table-column>
          <el-table-column
            align="center"
            :show-overflow-tooltip='true'
            prop="specification"
            label="规格">
          </el-table-column>
          <el-table-column
            align="center"
            prop="buyQty"
            label="购买数量">
            <template slot="header" slot-scope="scope">
              <span>购买数量</span><i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :disabled="forbidden" :precision="0" :controls="false" :min="0" :max="99999999" style="width:75px;" size="small" v-model="scope.row.buyQty"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!forbidden"
            align="center"
            prop="attributeValue"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addGiftEar(scope.row,scope.$index,'earnest')">加赠品</el-button>
              <el-button type="text" size="small" @click="delGoodsEar(scope.row,scope.$index,'earnest')">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            header-align="left"
            width="1092"
            label="">
            <template slot="header" slot-scope="scope">
              <p style="text-align:left;">
                <span style="margin:0 118px 0 73px;">是否赠品倍增</span>
                <span style="margin-right:167px;">赠送方式</span>
                <span>赠品名称</span>
                <span style="margin:0 58px 0 105px">条形码</span>
                <span>规格</span>
                <span style="margin:0 0 0 38px;">赠送数量</span><i v-if="!forbidden" style="margin-right: 13px;" class="el-icon-edit"></i><span v-else style="display:inline-block;width:32px;"></span>
                <span>赠送总量</span><i v-if="!forbidden" class="el-icon-edit"></i>
                <span style="margin:0 26px;">已赠数量</span>
                <span>操作</span>
              </p>
            </template>
            <template slot-scope="scope">
              <el-table
                :data="scope.row.testChildren"
                class="table-box"
                tooltip-effect="dark"
                :show-header="false">
                <el-table-column
                  align="center"
                  width="60"
                  prop="firstLastMoneyType">
                  <template slot-scope="scope">
                    <span v-if="scope.row.firstLastMoneyType == 1">首款送</span>
                    <span v-if="scope.row.firstLastMoneyType == 2">尾款送</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="100"
                  label="是否赠品倍增"
                  prop="test2">
                  <template slot-scope="scope">
                    <el-checkbox :disabled="forbidden" v-model="scope.row.giftDoubleFlag">倍增</el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="250"
                  prop="test2">
                  <template slot-scope="scope">
                    <el-radio-group :disabled="forbidden" style="font-size:12px !important;" v-model="scope.row.fullGiftWay">
                      <el-radio label="1">全部送</el-radio>
                      <el-radio label="2">随机送</el-radio>
                      <el-radio label="3">顺序送</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center">
                  <template slot-scope="scope1">
                    <el-table
                      :data="scope1.row.testChildren2"
                      class="table-box"
                      tooltip-effect="dark"
                      :show-header="false">
                      <el-table-column
                        align="center"
                        width="200"
                        :show-overflow-tooltip='true'
                        prop="giftName">
                      </el-table-column>
                      <el-table-column
                        :show-overflow-tooltip='true'
                        align="center"
                        width="100"
                        prop="barCode">
                      </el-table-column>
                      <el-table-column
                        :show-overflow-tooltip='true'
                        align="center"
                        width="80"
                        prop="spec">
                      </el-table-column>
                      <el-table-column
                        align="center"
                        width="80"
                        prop="giftName">
                        <template slot-scope="scope">
                          <el-input-number :disabled="forbidden" :precision="0" :controls="false" :min="1" :max="99999999" style="width:75px;" type="text" size="small" v-model="scope.row.giveQty"></el-input-number>
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        width="80"
                        prop="barCode">
                        <template slot-scope="scope">
                          <el-input-number :disabled="forbidden" :precision="0" :controls="false" :min="1" :max="99999999" style="width:75px;" type="text" size="small" v-model="scope.row.giveTotalQty"></el-input-number>
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        width="80"
                        prop="givedQty">
                      </el-table-column>
                      <el-table-column
                        align="center"
                        width="60"
                        prop="giftName">
                        <template slot-scope="scope2">
                          <i class="el-icon-close" v-if="!forbidden" style="color: red; font-size: 16px; cursor: pointer;" @click="delGiftEar(scope1.row,scope2.$index,scope.$index,'earnest')"></i>
                          <i class="el-icon-upload2" @click="upArrowGiftEar(scope2.row,scope.$index,scope1.$index,'earnest',scope2.$index)"
                             v-if="scope2.$index!=0 && scope1.row.fullGiftWay==3 && scope1.row.testChildren2.length>1 && !forbidden"
                             style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
                          <i class="el-icon-upload2" v-if="scope2.$index==0 && scope1.row.fullGiftWay==3 && scope1.row.testChildren2.length>1 && !forbidden"
                             style="font-size: 16px;"></i>
                          <i class="el-icon-download" @click="downArrowGiftEar(scope2.row,scope.$index,scope1.$index,'earnest',scope2.$index)"
                             v-if="scope2.$index!=scope1.row.testChildren2.length-1 && scope1.row.fullGiftWay==3 && scope1.row.testChildren2.length>1 && !forbidden"
                             style="color:orange;font-size: 16px;cursor: pointer;"></i>
                          <i class="el-icon-download"
                             v-if="scope2.$index==scope1.row.testChildren2.length-1 && scope1.row.fullGiftWay==3 && scope1.row.testChildren2.length>1 && !forbidden"
                             style="font-size: 16px;"></i>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 指定单品买就送-全场 -->
      <div class="border" v-show="paramData.giveTimeType != 3">
        <el-table
          :data="testData2"
          tooltip-effect="dark"
          border
          class="fh-table"
          style="width:100%;">
          <el-table-column
            label="序号"
            align="center"
            type="index">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsName"
            :show-overflow-tooltip='true'
            label="商品名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="barCode"
            :show-overflow-tooltip='true'
            label="条形码">
          </el-table-column>
          <el-table-column
            align="center"
            prop="specification"
            :show-overflow-tooltip='true'
            label="规格">
          </el-table-column>
          <el-table-column
            align="center"
            prop="buyQty"
            label="购买数量">
            <template slot="header" slot-scope="scope">
              <span>购买数量</span><i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :disabled="forbidden" :precision="0" :controls="false" :min="0" :max="99999999" style="width:75px;" type="text" size="small" v-model="scope.row.buyQty"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="250"
            label="赠送方式"
            prop="test2">
            <template slot-scope="scope">
              <el-radio-group :disabled="forbidden" style="font-size:12px !important;" v-model="scope.row.fullGiftWay">
                <el-radio label="1">全部送</el-radio>
                <el-radio label="2">随机送</el-radio>
                <el-radio label="3">顺序送</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            label="是否赠品倍增"
            prop="test2">
            <template slot-scope="scope">
              <el-checkbox :disabled="forbidden" v-model="scope.row.giftDoubleFlag">倍增</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!forbidden"
            align="center"
            width="100"
            prop="attributeValue"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addGiftEar(scope.row,scope.$index,'whole')">加赠品</el-button>
              <el-button type="text" size="small" @click="delGoodsEar(scope.row,scope.$index,'whole')">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            header-align="left"
            width="681"
            label="">
            <template slot="header" slot-scope="scope">
              <p style="text-align:left;">
                <span style="margin:0px 103px 0px 76px">赠品名称</span>
                <span>条形码</span>
                <span style="margin:0px -2px 0px 58px;">规格</span>
                <span style="margin:0 0 0 38px;">赠送数量</span><i style="margin-right: 13px;" v-if="!forbidden" class="el-icon-edit"></i><span v-else style="display:inline-block;width:32px;"></span>
                <span>赠送总量</span><i v-if="!forbidden" class="el-icon-edit"></i>
                <span style="margin:0 26px;">已赠数量</span>
                <span>操作</span>
              </p>
            </template>
            <template slot-scope="scope">
              <el-table
                :data="scope.row.testChildren"
                class="table-box"
                tooltip-effect="dark"
                :show-header="false">
                <el-table-column
                  align="center"
                  width="200"
                  :show-overflow-tooltip='true'
                  prop="giftName">
                </el-table-column>
                <el-table-column
                  align="center"
                  width="100"
                  :show-overflow-tooltip='true'
                  prop="barCode">
                </el-table-column>
                <el-table-column
                  align="center"
                  width="80"
                  :show-overflow-tooltip='true'
                  prop="spec">
                </el-table-column>
                <el-table-column
                  align="center"
                  width="80"
                  prop="giftName">
                  <template slot-scope="scope">
                    <el-input-number :disabled="forbidden" :precision="0" :controls="false" :min="1" :max="99999999" style="width:75px;" type="text" size="small" v-model="scope.row.giveQty"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="80"
                  prop="">
                  <template slot-scope="scope">
                    <el-input-number :disabled="forbidden" :precision="0" :controls="false" :min="1" :max="99999999" style="width:75px;" type="text" size="small" v-model="scope.row.giveTotalQty"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="80"
                  prop="givedQty">
                </el-table-column>
                <el-table-column
                  align="center"
                  width="60"
                  prop="giftName">
                  <template slot-scope="scope1">
                    <i class="el-icon-close" v-if="!forbidden" style="color: red; font-size: 16px; cursor: pointer;" @click="delGiftEar(scope1.row,scope1.$index,scope.$index,'whole')"></i>
                    <i class="el-icon-upload2" @click="upArrowGiftEar(scope1.row,scope.$index,scope1.$index,'whole')"
                       v-if="scope1.$index!=0 && scope.row.fullGiftWay==3 && scope.row.testChildren.length>1 && !forbidden"
                       style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
                    <i class="el-icon-upload2" v-if="scope1.$index==0 && scope.row.fullGiftWay==3 && scope.row.testChildren.length>1 && !forbidden"
                       style="font-size: 16px;"></i>
                    <i class="el-icon-download" @click="downArrowGiftEar(scope1.row,scope.$index,scope1.$index,'whole')"
                       v-if="scope1.$index!=scope.row.testChildren.length-1 && scope.row.fullGiftWay==3 && scope.row.testChildren.length>1 && !forbidden"
                       style="color:orange;font-size: 16px;cursor: pointer;"></i>
                    <i class="el-icon-download"
                       v-if="scope1.$index==scope.row.testChildren.length-1 && scope.row.fullGiftWay==3 && scope.row.testChildren.length>1 && !forbidden"
                       style="font-size: 16px;"></i>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--多个商品买就送-->
    <div v-show="giftStrategy6 || (giftStrategy7 && excludeGoodsJson.length == 0)" >
      <div
        style="padding:10px 0 10px 10px;height:48px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-top: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
        <span v-if="!forbidden" @click="addDialog('limit')">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加商品</span>
        </span>
        <span v-if="!forbidden" @click="excelExportGoods('limit')">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
        </span>
        <el-radio-group :disabled="forbidden" v-model="paramData.goodsLimitType" @change="channelGoodsLimit">
          <el-radio label="1">买全部商品</el-radio>
          <el-radio label="2" style="margin-right:110px;">买不同商品</el-radio>
          <el-radio label="3">买任意商品</el-radio>
        </el-radio-group>
        <el-input-number :disabled="paramData.goodsLimitType!=2 || forbidden"  style="width:70px !important;margin:0 5px 0 -200px;" @blur="goodsLimitsBlur(goodsLimitNum1)" v-model="goodsLimitNum1" :controls="false" :min="0" :max="99999999" size="small"></el-input-number>
        <span>件</span>
        <el-input-number :disabled="paramData.goodsLimitType!=3 || forbidden" style="width:70px !important;margin:0 5px 0 110px;" @blur="goodsLimitsBlur(goodsLimitNum2)" v-model="goodsLimitNum2" :controls="false" :min="0" :max="99999999" size="small"></el-input-number>
        <span>件</span>
        <el-checkbox v-if="giftStrategy6" style="margin:0 0 0 15px;" :disabled="forbidden" v-model="paramData.giftDoubleFlag">赠品倍增</el-checkbox>
      </div><!--paramData.goodsLimitType == 3 && -->
      <el-table
        border
        @cell-dblclick="celldbClick"
        max-height="380"
        :data="goodsLimitsJson"
      >
        <el-table-column
          align='center'
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          align='center'
          :show-overflow-tooltip='true'
          label="商品名称"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="goodsBarCode"
          align='center'
          min-width=''
          label="条形码">
        </el-table-column>
        <el-table-column
          prop="goodsSpec"
          label="规格"
          min-width=''
          align='center'
          width="">
        </el-table-column>
        <el-table-column align="center" prop="numEdit">
          <template slot="header" slot-scope="scope">
            <span>购买数量</span>
            <i v-if="paramData.goodsLimitType==1" class="el-icon-edit"></i>
          </template>
          <template slot-scope="scope">
            <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.numEdit && paramData.goodsLimitType==1"  v-model="scope.row.buyQty"
                      @blur="keyupNumSave(scope.row)"></el-input-number>
            <span v-else>{{scope.row.buyQty}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          v-if="!forbidden"
          align='center'
          width="110">
          <template slot-scope="scope">
            <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
               @click="deleteExcludeBtn(scope.$index, scope.row,'goodsLimitsJson')"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="giftStrategy6" v-for="(strategyData,i) in giftStrategyData6">
      <div
        style="background:#F4F9FF;display:inline-block;height: 42px;border: 1px solid #ebeef5;line-height: 42px;padding: 0 15px;margin-top:20px;">
        <el-select v-if="false" style="width:120px;" v-model="strategyData.manyBuyGiveType" :disabled="forbidden" placeholder="">
          <el-option
            v-for="item in multiProductArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span>商品金额满 </span>
        <el-input :disabled="forbidden" style="width:70px !important;" v-model="strategyData.wayupValue"
                   @blur="validation(i,6)"></el-input>
        <span style="margin-right:40px;"> 元</span>
        <el-radio-group :disabled="forbidden" v-model="strategyData.fullGiftWay">
          <el-radio :label="1">全部送</el-radio>
          <el-radio :label="2">随机送</el-radio>
          <el-radio :label="3">顺序送</el-radio>
        </el-radio-group>
      </div>
      <div v-if="!forbidden"
        style="padding:15px 0 10px 15px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
        <span @click="addGiftDialog('6-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加赠品</span>
        </span>
        <span v-if="!forbidden" @click="excelExportGift('6-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
        </span>
      </div>
      <div class="border">
        <el-table
          border
          @cell-dblclick="celldbClick"
          :data="strategyData.giftBeanList"
        >
          <el-table-column
            align='center'
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="giftName"
            align='center'
            :show-overflow-tooltip='true'
            label="商品名称"
            min-width="">
          </el-table-column>
          <el-table-column
            prop="barCode"
            align='center'
            min-width=''
            label="条形码">
          </el-table-column>
          <el-table-column
            prop="spec"
            label="规格"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column prop="numEdit" align="center">
            <template slot="header" slot-scope="scope">
              <span>赠送数量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.numEdit"  v-model="scope.row.giveQty"
                        @blur="keyupNumSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalEdit"
            align='center'>
            <template slot="header" slot-scope="scope">
              <span>赠送总量</span>
              <i v-if="!forbidden" class="el-icon-edit"></i>
            </template>
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.totalNumEdit"  v-model="scope.row.giveTotalQty"
                        @blur="keyupTotalSave(scope.row)"></el-input-number>
              <span v-else>{{scope.row.giveTotalQty}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="givedQty"
            align='center'
            label="已赠送数量"
            width="">
          </el-table-column>
          <el-table-column
            label="操作"
            v-if="!forbidden"
            align='center'
            width="110">
            <template slot-scope="scope">
              <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
                 @click="deleteBtn(scope.$index, scope.row,'6-'+i)"></i>
              <i class="el-icon-upload2" @click="upArrowBtn(scope.row,'6-'+i)"
                 v-if="scope.$index!=0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-upload2" v-if="scope.$index==0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download" @click="downArrowBtn(scope.row,'6-'+i)"
                 v-if="scope.$index!=strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="color:orange;font-size: 16px;cursor: pointer;"></i>
              <i class="el-icon-download"
                 v-if="scope.$index==strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                 style="font-size: 16px;cursor: pointer;"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--名額阶梯赠送-->
    <div v-if="giftStrategy7">
      <!-- 定金 -->
      <div class="earnest-tail" v-show="paramData.giveTimeType == 3">
        <!-- 首款送 -->
        <div style="width:50%;float:left;display:inline-block;padding-right:10px;">
          <h5 style="text-align:center;font-size:16px;font-weight:bold;">首款送</h5>
          <div v-for="(strategyData,i) in firstEarnestData">
            <div
              style="background:#F4F9FF;float:left;height: 42px;border: 1px solid #ebeef5;line-height: 42px;padding: 0 15px;">
              <span style="display:inline-block;width:20px;">{{i + 1}}.</span>
              <span style="margin-right:15px;">第</span>
              <el-input :disabled="forbidden" style="width:60px !important;" v-model="strategyData.quotaStartQty"
                         @keyup.native="strategyData.quotaStartQty = strategyData.quotaStartQty.replace(/[^\d]/ig,'')"></el-input>
              <span>—</span>
              <el-input :disabled="forbidden" style="width:60px !important;" v-model="strategyData.quotaEndQty"
                         @keyup.native="strategyData.quotaEndQty = strategyData.quotaEndQty.replace(/[^\d]/ig,'')"></el-input>
              <span style="margin-right:20px;"> 名</span>
              <el-radio-group :disabled="forbidden" v-model="strategyData.fullGiftWay">
                <el-radio :label="1" style="margin-right:0;">全部送</el-radio>
                <el-radio :label="2" style="margin-right:0;">随机送</el-radio>
                <el-radio :label="3">顺序送</el-radio>
              </el-radio-group>
            </div>
            <div style="float:left;margin-top:8px;">
              <i class="el-icon-circle-plus" @click="addLadderEarNest('first',i)" v-if="i==firstEarnestData.length-1 && !forbidden"
                 style="font-size:25px;color:#409EFF;margin-left:15px;cursor: pointer;"></i>
              <i class="el-icon-remove" @click="reduceLadderEarNest('firstEarnestData',i)" v-if="firstEarnestData.length>1 && !forbidden"
                 style="font-size:25px;color:#FF2424;margin-left:15px;cursor: pointer;"></i>
            </div>
            <div style="clear:both;"></div>
            <div v-if="!forbidden"
              style="padding:15px 0 10px 15px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
                <span @click="addGiftDialog('firstEarnestData-'+i)">
                  <i class="el-icon-plus" style="color:#409eff;"></i>
                  <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加赠品</span>
                </span>
              <span v-if="!forbidden" @click="excelExportGift('firstEarnestData-'+i)">
                <i class="el-icon-plus" style="color:#409eff;"></i>
                <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
              </span>
              </div>
            <div class="border">
              <el-table
                border
                @cell-dblclick="celldbClick"
                :data="strategyData.giftBeanList"
              >
                <el-table-column
                  align='center'
                  label="序号"
                  type="index"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="giftName"
                  align='center'
                  :show-overflow-tooltip='true'
                  label="商品名称"
                  min-width="">
                </el-table-column>
                <el-table-column
                  prop="barCode"
                  align='center'
                  min-width=''
                  label="条形码">
                </el-table-column>
                <el-table-column
                  prop="spec"
                  label="规格"
                  min-width=''
                  align='center'
                  width="">
                </el-table-column>
                <el-table-column prop="numEdit" align="center">
                  <template slot="header" slot-scope="scope">
                    <span>赠送数量</span>
                    <i v-if="!forbidden" class="el-icon-edit"></i>
                  </template>
                  <template slot-scope="scope">
                    <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.numEdit"  v-model="scope.row.giveQty"
                              @blur="keyupNumSave(scope.row)"></el-input-number>
                    <span v-else>{{scope.row.giveQty}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="totalEdit"
                  align='center'>
                  <template slot="header" slot-scope="scope">
                    <span>赠送总量</span>
                    <i v-if="!forbidden" class="el-icon-edit"></i>
                  </template>
                  <template slot-scope="scope">
                    <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.totalNumEdit"  v-model="scope.row.giveTotalQty"
                              @blur="keyupTotalSave(scope.row)"></el-input-number>
                    <span v-else>{{scope.row.giveTotalQty}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="givedQty"
                  align='center'
                  label="已赠送数量"
                  width="">
                </el-table-column>
                <el-table-column
                  label="操作"
                  v-if="!forbidden"
                  align='center'
                  width="110">
                  <template slot-scope="scope">
                    <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
                       @click="deleteBtnEar(scope.$index, scope.row,'firstEarnestData',i)"></i>
                    <i class="el-icon-upload2" @click="upArrowBtnEar(scope.row,'firstEarnestData',i)"
                       v-if="scope.$index!=0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                       style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
                    <i class="el-icon-upload2" v-if="scope.$index==0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                       style="font-size: 16px;cursor: pointer;"></i>
                    <i class="el-icon-download" @click="downArrowBtnEar(scope.row,'firstEarnestData',i)"
                       v-if="scope.$index!=strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                       style="color:orange;font-size: 16px;cursor: pointer;"></i>
                    <i class="el-icon-download"
                       v-if="scope.$index==strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                       style="font-size: 16px;cursor: pointer;"></i>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!-- 尾款送 -->
        <div style="width:50%;display:inline-block;padding-left:20px;">
          <h5 style="text-align:center;font-size:16px;font-weight:bold;">尾款送</h5>
          <div v-for="(strategyData,i) in tailEarnestData">
            <div
              style="background:#F4F9FF;float:left;height: 42px;border: 1px solid #ebeef5;line-height: 42px;padding: 0 15px;">
              <span style="display:inline-block;width:20px;">{{i + 1}}.</span>
              <span style="margin-right:15px;">第</span>
              <el-input :disabled="forbidden" @keyup.native="strategyData.quotaStartQty = strategyData.quotaStartQty.replace(/[^\d]/ig,'')" style="width:60px !important;" v-model="strategyData.quotaStartQty"></el-input>
              <span>—</span>
              <el-input :disabled="forbidden" @keyup.native="strategyData.quotaEndQty = strategyData.quotaEndQty.replace(/[^\d]/ig,'')" style="width:60px !important;" v-model="strategyData.quotaEndQty"></el-input>
              <span style="margin-right:20px;"> 名</span>
              <el-radio-group :disabled="forbidden" v-model="strategyData.fullGiftWay">
                <el-radio :label="1" style="margin-right:0;">全部送</el-radio>
                <el-radio :label="2" style="margin-right:0;">随机送</el-radio>
                <el-radio :label="3">顺序送</el-radio>
              </el-radio-group>
            </div>
            <div style="float:left;margin-top:8px;">
              <i class="el-icon-circle-plus" @click="addLadderEarNest('tail',i)"  v-if="i==tailEarnestData.length-1 && !forbidden"
                 style="font-size:25px;color:#409EFF;margin-left:15px;cursor: pointer;"></i>
              <i class="el-icon-remove" @click="reduceLadderEarNest('tailEarnestData',i)" v-if="tailEarnestData.length>1 && !forbidden"
                 style="font-size:25px;color:#FF2424;margin-left:15px;cursor: pointer;"></i>
            </div>
            <div style="clear:both;"></div>
            <div v-if="!forbidden" style="padding:15px 0 10px 15px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
              <span @click="addGiftDialog('tailEarnestData-'+i)">
                <i class="el-icon-plus" style="color:#409eff;"></i>
                <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加赠品</span>
              </span>
              <span v-if="!forbidden" @click="excelExportGift('tailEarnestData-'+i)">
                <i class="el-icon-plus" style="color:#409eff;"></i>
                <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
              </span>
            </div>
            <div class="border">
              <el-table
                border
                @cell-dblclick="celldbClick"
                :data="strategyData.giftBeanList"
              >
                <el-table-column
                  align='center'
                  label="序号"
                  type="index"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="giftName"
                  align='center'
                  :show-overflow-tooltip='true'
                  label="商品名称"
                  min-width="">
                </el-table-column>
                <el-table-column
                  prop="barCode"
                  align='center'
                  min-width=''
                  label="条形码">
                </el-table-column>
                <el-table-column
                  prop="spec"
                  label="规格"
                  min-width=''
                  align='center'
                  width="">
                </el-table-column>
                <el-table-column prop="numEdit" align="center">
                  <template slot="header" slot-scope="scope">
                    <span>赠送数量</span>
                    <i v-if="!forbidden" class="el-icon-edit"></i>
                  </template>
                  <template slot-scope="scope">
                    <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.numEdit"  v-model="scope.row.giveQty"
                              @blur="keyupNumSave(scope.row)"></el-input-number>
                    <span v-else>{{scope.row.giveQty}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="totalEdit"
                  align='center'>
                  <template slot="header" slot-scope="scope">
                    <span>赠送总量</span>
                    <i v-if="!forbidden" class="el-icon-edit"></i>
                  </template>
                  <template slot-scope="scope">
                    <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.totalNumEdit"  v-model="scope.row.giveTotalQty"
                              @blur="keyupTotalSave(scope.row)"></el-input-number>
                    <span v-else>{{scope.row.giveTotalQty}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="givedQty"
                  align='center'
                  label="已赠送数量"
                  width="">
                </el-table-column>
                <el-table-column
                  label="操作"
                  v-if="!forbidden"
                  align='center'
                  width="110">
                  <template slot-scope="scope">
                    <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
                       @click="deleteBtnEar(scope.$index, scope.row,'tailEarnestData',i)"></i>
                    <i class="el-icon-upload2" @click="upArrowBtnEar(scope.row,'tailEarnestData',i)"
                       v-if="scope.$index!=0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                       style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
                    <i class="el-icon-upload2" v-if="scope.$index==0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                       style="font-size: 16px;cursor: pointer;"></i>
                    <i class="el-icon-download" @click="downArrowBtnEar(scope.row,'tailEarnestData',i)"
                       v-if="scope.$index!=strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                       style="color:orange;font-size: 16px;cursor: pointer;"></i>
                    <i class="el-icon-download"
                       v-if="scope.$index==strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                       style="font-size: 16px;cursor: pointer;"></i>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
      </div>
      <!-- 全场 -->
      <div v-show="paramData.giveTimeType != 3" v-for="(strategyData,i) in giftStrategyData7">
        <div
          style="background:#F4F9FF;float:left;height: 42px;border: 1px solid #ebeef5;line-height: 42px;padding: 0 15px;margin-top:15px;">
          <span style="display:inline-block;width:20px;">{{i + 1}}.</span>
          <span style="margin-right:15px;">第</span>
          <el-input :disabled="forbidden" @keyup.native="strategyData.quotaStartQty = strategyData.quotaStartQty.replace(/[^\d]/ig,'')" style="width:70px !important;" v-model="strategyData.quotaStartQty"></el-input>
          <span>—</span>
          <el-input :disabled="forbidden" @keyup.native="strategyData.quotaEndQty = strategyData.quotaEndQty.replace(/[^\d]/ig,'')" style="width:70px !important;" v-model="strategyData.quotaEndQty"></el-input>
          <span style="margin-right:20px;"> 名</span>
          <el-radio-group :disabled="forbidden" v-model="strategyData.fullGiftWay">
            <el-radio :label="1">全部送</el-radio>
            <el-radio :label="2">随机送</el-radio>
            <el-radio :label="3">顺序送</el-radio>
          </el-radio-group>
        </div>
        <div style="float:left;margin-top:20px;">
          <i class="el-icon-circle-plus" @click="addLadder(7)" v-if="i==giftStrategyData7.length-1 && !forbidden"
             style="font-size:25px;color:#409EFF;margin-left:15px;cursor: pointer;"></i>
          <i class="el-icon-remove" @click="reduceLadder(7,i)" v-if="giftStrategyData7.length>1 && !forbidden"
             style="font-size:25px;color:#FF2424;margin-left:15px;cursor: pointer;"></i>
        </div>
        <div style="clear:both;"></div>
        <div v-if="!forbidden"
          style="padding:15px 0 10px 15px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
        <span @click="addGiftDialog('7-'+i)">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加赠品</span>
        </span>
          <span v-if="!forbidden" @click="excelExportGift('7-'+i)">
                <i class="el-icon-plus" style="color:#409eff;"></i>
                <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
          </span>
        </div>
        <div class="border">
          <el-table
            border
            @cell-dblclick="celldbClick"
            :data="strategyData.giftBeanList"
          >
            <el-table-column
              align='center'
              label="序号"
              type="index"
              width="80">
            </el-table-column>
            <el-table-column
              prop="giftName"
              align='center'
              :show-overflow-tooltip='true'
              label="商品名称"
              min-width="">
            </el-table-column>
            <el-table-column
              prop="barCode"
              align='center'
              min-width=''
              label="条形码">
            </el-table-column>
            <el-table-column
              prop="spec"
              label="规格"
              min-width=''
              align='center'
              width="">
            </el-table-column>
            <el-table-column prop="numEdit" align="center">
              <template slot="header" slot-scope="scope">
                <span>赠送数量</span>
                <i v-if="!forbidden" class="el-icon-edit"></i>
              </template>
              <template slot-scope="scope">
                <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.numEdit"  v-model="scope.row.giveQty"
                          @blur="keyupNumSave(scope.row)"></el-input-number>
                <span v-else>{{scope.row.giveQty}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalEdit"
              align='center'>
              <template slot="header" slot-scope="scope">
                <span>赠送总量</span>
                <i v-if="!forbidden" class="el-icon-edit"></i>
              </template>
              <template slot-scope="scope">
                <el-input-number :controls="false" :min="0" :max="99999999" v-if="scope.row.totalNumEdit"  v-model="scope.row.giveTotalQty"
                          @blur="keyupTotalSave(scope.row)"></el-input-number>
                <span v-else>{{scope.row.giveTotalQty}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="givedQty"
              align='center'
              label="已赠送数量"
              width="">
            </el-table-column>
            <el-table-column
              label="操作"
              v-if="!forbidden"
              align='center'
              width="110">
              <template slot-scope="scope">
                <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
                   @click="deleteBtn(scope.$index, scope.row,'7-'+i)"></i>
                <i class="el-icon-upload2" @click="upArrowBtn(scope.row,'7-'+i)"
                   v-if="scope.$index!=0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                   style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
                <i class="el-icon-upload2" v-if="scope.$index==0 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                   style="font-size: 16px;cursor: pointer;"></i>
                <i class="el-icon-download" @click="downArrowBtn(scope.row,'7-'+i)"
                   v-if="scope.$index!=strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                   style="color:orange;font-size: 16px;cursor: pointer;"></i>
                <i class="el-icon-download"
                   v-if="scope.$index==strategyData.giftBeanList.length-1 && strategyData.fullGiftWay==3 && strategyData.giftBeanList.length>1"
                   style="font-size: 16px;cursor: pointer;"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 排除商品 -->
    <div v-if="(giftStrategy1 && goodsLimitsJson.length == 0) || giftStrategy2 || giftStrategy3 || giftStrategy4 || (giftStrategy7 && goodsLimitsJson.length == 0 && paramData.goodsLimitType == 1)">
     <p class="fh-title">排除商品</p>
     <div v-if="!forbidden"
       style="padding:15px 0 10px 15px;background:#F7F7F7;border-left: 1px solid #ebeef5;border-top: 1px solid #ebeef5;border-right: 1px solid #ebeef5;">
        <span @click="addDialog('exclude')">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">添加商品</span>
        </span>
       <span v-if="!forbidden" @click="excelExportGoods('exclude')">
          <i class="el-icon-plus" style="color:#409eff;"></i>
          <span style="color:#409eff;cursor: pointer;font-weight:bold;margin-right:20px;">excel导入</span>
        </span>
     </div>
     <el-table
       border
       max-height="380"
       :data="excludeGoodsJson"
     >
       <el-table-column
         align='center'
         label="序号"
         type="index"
         width="80">
       </el-table-column>
       <el-table-column
         prop="goodsName"
         align='center'
         :show-overflow-tooltip='true'
         label="商品名称"
         min-width="">
       </el-table-column>
       <el-table-column
         prop="goodsBarCode"
         align='center'
         min-width=''
         label="条形码">
       </el-table-column>
       <el-table-column
         prop="goodsSpec"
         label="规格"
         min-width=''
         align='center'
         width="">
       </el-table-column>
       <el-table-column
         v-if="!forbidden"
         label="操作"
         align='center'
         width="110">
         <template slot-scope="scope">
           <i class="el-icon-close" style="color:red;font-size: 16px;cursor: pointer;"
              @click="deleteExcludeBtn(scope.$index, scope.row,'excludeGoodsJson')"></i>
         </template>
       </el-table-column>
     </el-table>
   </div>
    <div class="col-button">
      <el-button native-type="submit" style="margin:15px 0 0 25px;width:100px;" @click="showParentBlock">返回</el-button>
      <el-button  type="primary" v-if="!forbidden || !forbidden1" :loading="shade"  style="margin:15px 0 0 25px;width:100px;" @click="giftStrategySave('ruleForm')">保存
      </el-button>
    </div>
    <div v-if="forbidden && forbidden1">
      <!--操作记录-->
      <div style="margin:20px 0 10px 0;">操作记录：</div>
      <public-Log2 :paramObj="paramObj"></public-Log2>
    </div>
    <!--添加赠品弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="添加赠品" :visible.sync="dialogAddGift" width="1000px">
      <div class="input-box">
        <el-row>
          <el-col :span="7">
            <div><label for="">赠品名称：</label>
              <el-input style="width:158px;" v-model="addGiftParam.goodsName" @keyup.enter.native="queryGiftBtn1"></el-input>
            </div>
          </el-col>
          <el-col :span="7">
            <div><label for="">条形码：</label>
              <el-input style="width:158px;" v-model="addGiftParam.barCode" @keyup.enter.native="queryGiftBtn1"></el-input>
            </div>
          </el-col>
          <el-col :span="7" v-if="!suitSwitch">
            <div><label for="">是否套装：</label>
              <el-select v-model="addGiftParam.suitFlag" style="width:158px;" placeholder="未分组">
                <el-option label="全部" value=""></el-option>
                <el-option label="套装" value="true"></el-option>
                <el-option label="单品" value="false"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="3">
            <el-button  type="primary" style="height:28px;width:80px !important;margin-left: 20px;" @click="queryGiftBtn1">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:15px;">
          <el-col :span="7">
            <div><label for="">品牌：</label>
              <multiple-select style="width:158px;"
                               :selectArr="brandIdArr"
                               :valueArr="conditionData.brandIds"
                               @multipleChange="multipleChange1">
              </multiple-select>
            </div>
          </el-col>
          <el-col :span="7">
            <div><label for="">分类：</label>
              <el-cascader
                style="width:158px;line-height: 28px;"
                clearable filterable
                v-model="conditionData.catalogId"
                placeholder="请选择"
                :options="catalogList"
                :props="catalogIdProps"
                :show-all-levels="false"
              ></el-cascader>
            </div>
          </el-col>
        </el-row>
        <el-table
          border
          ref="multipleTable"
          height="400"
          :data="addGiftData"
          @selection-change="handleSelectionChange1"
          style="margin-top:15px;"
        >
          <el-table-column
            align='center'
            type="selection"
            width="80">
          </el-table-column>
          <el-table-column
            label="序号"
            align='center'
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            align='center'
            label="图片"
            min-width="">
            <template slot-scope="scope">
              <img v-if="scope.row.goodsImageBean" :src="scope.row.goodsImageBean.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="brandName"
            align='center'
            sortable
            label="品牌"
            width="">
          </el-table-column>
          <el-table-column
            prop="catalogName"
            align='center'
            sortable
            label="分类"
            width="">
          </el-table-column>
          <el-table-column
            prop="giftName"
            align='center'
            sortable
            show-overflow-tooltip
            label="赠品名称"
            width="100">
          </el-table-column>
          <el-table-column
            prop="spec"
            align='center'
            sortable
            min-width=''
            label="规格">
          </el-table-column>
          <el-table-column
            prop="barCode"
            label="条形码"
            sortable
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="usableQty"
            align='center'
            sortable
            label="库存"
            width="">
          </el-table-column>
          <el-table-column
            v-if="!suitSwitch"
            prop="suitMaxSales"
            align='center'
            sortable
            label="单品组套最大可售"
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.suitFlag">{{scope.row.suitMaxSales}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!suitSwitch"
            prop="suitFlag"
            align='center'
            sortable
            label="是否套装"
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.suitFlag">套装</span>
              <span v-else>单品</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="dialog-pagination">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="currentPage1"
            :page-sizes="[15, 30, 50, 100, 200]"
            :page-size="totalPage1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum1">
          </el-pagination>
        </div>
      </div>
      <span v-if="logo == 'earnest'" slot="footer" class="dialog-footer">
        <el-button @click="cancelAddGift">关闭</el-button>
        <el-button type="primary"  @click="saveAddGift('tail')">尾款送</el-button>
        <el-button type="primary"  @click="saveAddGift('head')">首款送</el-button>
      </span>
      <span v-else slot="footer" class="dialog-footer">
        <el-button @click="cancelAddGift">取消</el-button>
        <el-button type="primary"  @click="saveAddGift">确定</el-button>
      </span>
    </el-dialog>
    <!--设置会员范围弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="会员范围" :visible.sync="dialogSetMember" width="460px">
      <div>
        <label for="" style="margin-right:1px;">交易总次数：</label>
        <el-select :disabled="forbidden" v-model="rangeBean.tradeQtyRules" placeholder="" style="width:120px;">
          <el-option
            v-for="item in transactionsArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input-number :precision="0" :controls="false" :min="0" :max="99999999" style="width:120px !important;" :disabled="forbidden" v-model="rangeBean.tradeQty" @blur="validation(0,9)"></el-input-number> 次
      </div>
      <div style="margin-top:15px;">
        <el-select :disabled="forbidden" v-model="rangeBean.tradeRulesRelevant" placeholder="" style="width:75px;">
          <el-option
            v-for="item in orAngArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="margin-top:15px;">
        <label for="" style="margin-right:1px;">交易总金额：</label>
        <el-select :disabled="forbidden" v-model="rangeBean.tradeAmtRules" placeholder="" style="width:120px;">
          <el-option
            v-for="item in transactionsArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input-number :precision="2" :controls="false" :min="0" :max="99999999.99" style="width:120px !important;" :disabled="forbidden"  v-model="rangeBean.tradeAmt" @blur="validation(0,10)"></el-input-number> 元
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button  style="width:70px;" @click="cancelSetMember">取消</el-button>
        <el-button type="primary"  style="width:70px;" @click="saveSetMember">确定</el-button>
      </span>
    </el-dialog>
    <!--添加商品弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="添加商品" :visible.sync="dialogAddCommodity" width="900px">
      <div class="input-box">
        <el-row>
          <el-col :span="7">
            <div><label for="">商品名称：</label>
              <el-input style="width:158px;" v-model="addCommodityParam.goodsName" @keyup.enter.native="queryGiftBtn2"></el-input>
            </div>
          </el-col>
          <el-col :span="7">
            <div><label for="">条形码：</label>
              <el-input style="width:158px;" v-model="addCommodityParam.barCode" @keyup.enter.native="queryGiftBtn2"></el-input>
            </div>
          </el-col>
          <el-col :span="7">
            <div><label for="">是否套装：</label>
              <el-select v-model="addCommodityParam.suitFlag" style="width:158px;" placeholder="未分组">
                <el-option label="全部" value=""></el-option>
                <el-option label="套装" value="true"></el-option>
                <el-option label="单品" value="false"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="3">
            <el-button  type="primary" style="height:28px;width:80px !important;margin-left:20px;" @click="queryGiftBtn2">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:15px;">
          <el-col :span="7">
            <div><label for="">品牌：</label>
              <multiple-select style="width:158px;"
                               :selectArr="brandIdArr"
                               :valueArr="conditionData.brandIds"
                               @multipleChange="multipleChange1">
              </multiple-select>
            </div>
          </el-col>
          <el-col :span="7">
            <div><label for="">分类：</label>
              <el-cascader
                style="width:158px;line-height: 28px;"
                clearable filterable
                v-model="conditionData.catalogId"
                placeholder="请选择"
                :options="catalogList"
                :props="catalogIdProps"
                :show-all-levels="false"
              ></el-cascader>
            </div>
          </el-col>
        </el-row>
        <el-table
          border
          height="400"
          :data="addCommodityData"
          @selection-change="handleSelectionChange2"
          style="margin-top:15px;"
        >
          <el-table-column
            align='center'
            label="序号"
            type="selection"
            width="80">
          </el-table-column>
          <el-table-column
            label="序号"
            align='center'
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            align='center'
            label="图片"
            min-width="">
            <template slot-scope="scope">
              <img v-if="scope.row.goodsImageBean" :src="scope.row.goodsImageBean.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="brandName"
            align='center'
            sortable
            label="品牌"
            width="">
          </el-table-column>
          <el-table-column
            prop="catalogName"
            align='center'
            sortable
            label="分类"
            width="">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align='center'
            sortable
            show-overflow-tooltip
            label="商品名称"
            width="">
          </el-table-column>
          <el-table-column
            prop="goodsSpec"
            align='center'
            sortable
            min-width=''
            label="规格">
          </el-table-column>
          <el-table-column
            prop="goodsBarCode"
            label="条形码"
            sortable
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="suitFlag"
            align='center'
            label="是否套装"
            sortable
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.suitFlag">套装</span>
              <span v-else>单品</span>
            </template>
          </el-table-column>
          <!--<el-table-column
            prop="buyQty"
            align='center'
            label="库存"
            width="">
          </el-table-column>-->
        </el-table>
        <div class="dialog-pagination">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="currentPage2"
            :page-sizes="[15, 30, 50, 100, 200]"
            :page-size="totalPage2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum2">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddCommodity">取消</el-button>
        <el-button type="primary"  @click="saveAddCommodity">确定</el-button>
      </span>
    </el-dialog>
    <!--文件上传-->
    <el-dialog v-dialogDrag
               :close-on-click-modal="false"
               title="导入"
               :visible.sync="uploadFileDialog"
               width="600px"
               center>
      <div>
        <el-row style="width: 650px">
          <el-col style="width: 400px">
            <div class="filePath">
              <el-input style="width:200px;" v-model="fileName" disabled></el-input>
              <el-upload
                style="display:inline-block;"
                action="https://jsonplaceholder.typicode.com/posts/"
                :before-upload="beforeAvatarUpload"
                :show-file-list="false"
                :http-request="httpRequest">
                <el-button slot="trigger" size="small">浏览</el-button>
              </el-upload>
            </div>
          </el-col>
          <el-col style="width: 100px;">
            <div class="grid-content bg-purple-dark" style="width: 100px;">
              <el-button size="small"
                         @click.native.prevent="downloadTemplet">下载模板
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 650px">
          <div class="el-upload__tip">请上传.xls/.xlsx/.csv文件</div>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadFileDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmImport">确定</el-button>
      </span>
    </el-dialog>
    <!--导入结果弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="导入结果" :visible.sync="importStatus" width="400px">
      <span style="font-size:16px;">本次导入成功：{{successFileNum}} 条，失败：{{failFileNum}} 条。</span>
      <br><br>
      <p v-show="failFileNum != 0">
        <a :href="failExcelFile" style="color:rgb(64, 158, 255);">导出失败列表</a>
        <br><br>
      </p>
      <el-button type="primary" style="color:white;float:right;" @click="importStatus=false">确 定</el-button>
      <br>
    </el-dialog>
    <div class="fh-loading" v-if="loading" v-loading="loading" element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"></div>
  </div>
</template>

<script>
  import {handleData,turnTimestamp, returnTimesStamp, priceValidator, positiveIntegerValidator , Trim,validateSpelCharacter} from '@/assets/js/validate.js';
  import PublicLog2 from '@/components/common/PublicLog2.vue';
  export default {
    name: 'giftStrategy-add',
    props:{
      params:Object
    },
    components:{
      PublicLog2
    },
    data() {
      return {
        file:'',
        fileName:'',
        fileId:'',
        uploadFileDialog:false,//导入弹框
        importStatus:false,//导入结果弹框
        successFileNum:0,//成功数
        failFileNum:0,//失败数
        failExcelFile:'',//失败列表路径
        goodsLogo:'',//商品标记
        giftLogo:'',//赠品标记
        brandIdArr:[],//品牌下拉集合
        catalogList:[],//分类树
        classifyMatchArr:[],//分类集合
        catalogIdProps:{
          label: 'privilegeName',
          value:'catalogId',
          children: 'nodes'
        },
        paramObj:{
          moduleId:'40',
          billCode:this.params.giftStrategyNo,
          typeId:'["4050","4051","4052","4053","4054","4055"]'
        },//公共日志参数
        loading:false,
        shade: false, // 保存的遮罩
        //指定单品买-定金
        /*testData:[{
          goodsName:'商品1',
          barCode:'1103',
          specification:'啊啊啊',
          buyQty:'1',
          testChildren:[{
            fullGiftWay:'1',
            firstLastMoneyType:'1',
            testChildren2:[{
              giftName:'赠品1',
              barcode:'LJTM001',
              spec:'袋',
              giveQty:'1',
              giveTotalQty:'2',
              givedQty:'1',
            },{
              giftName:'赠品1',
              barcode:'LJTM001',
              spec:'袋',
              giveQty:'1',
              giveTotalQty:'2',
              givedQty:'1',
            }]
          }],
        }],*/
        testData:[],
        //指定单品买-全场
        /*testData2:[{
          goodsName:'商品1',
          barCode:'1103',
          specification:'啊啊啊',
          buyQty:'1',
          fullGiftWay:'1',
          testChildren:[{
            giftName:'赠品1',
            barcode:'LJTM001',
            spec:'袋',
            giveQty:'1',
            giveTotalQty:'2',
            givedQty:'1',
          },{
            giftName:'赠品1',
            barcode:'LJTM001',
            spec:'袋',
            giveQty:'1',
            giveTotalQty:'2',
            givedQty:'1',
          }]
        }],*/
        testData2:[],
        excludeGoodsJson:[],//排除商品
        goodsLimitsJson:[],//限制商品
        goodsLimitNum1:'',//买不同商品件数
        goodsLimitNum2:'',//买任意商品件数
        earLog:'',//指定单品添加赠品标志
        firstEarnestData:[{
          giftBeanList: [],
          fullGiftWay: 1,
          quotaStartQty: '',
          quotaEndQty: ''
        }],//首款送data
        tailEarnestData:[{
          giftBeanList: [],
          fullGiftWay: 1,
          quotaStartQty: '',
          quotaEndQty: ''
        }],//尾款data
        groupArr:[],//分组集合
        giftStrategyId: this.params.giftStrategyId,//赠品策略id
        type: this.params.type,//新建 修改 复制 查看
        titleName:'新建',
        //showFlag:false,
        forbidden:false,//是否禁用
        forbidden1:true,//是否禁用
        giveTimeType:'1',//赠送时机
        getparams:true,//是否开启赠品可售库存
        suitSwitch:true,//是否开启套装可售库存
        rules: {
          giftStrategyName: [{required: true, message: '请输入策略名称'},{validator:function(rule,value,callback){
            if(validateSpelCharacter(value)){
              callback(new Error("不允许输入特殊字符"));
            }else{
              callback();
            }
          }, trigger: 'blur'}],
          giftStrategyGroupId:{ required: true,message: '请选择所属分组',  trigger: 'change' },
          startTime:{ required: true,message: '请输入开始时间',  trigger: 'blur' },
          endTime:{ required: true,message: '请输入结束时间',  trigger: 'blur' },
        },//表单检验规则
        version: '1.0.0',
        paramData: {
          giftStrategyNo:'',//策略编号
          orderBeginTime:'',
          orderEndTime:'',
          finalBeginTime:'',
          finalEndTime:'',
          goodsLimitType:'1',
          giftStrategyName: '',
          sortWaitTime:'',
          giftStrategyGroupId:'',
          giveTimeType:'1',
          channelIdList: [],
          orderTypeIdList: [1,2,3],
          storeIdList:[],
          givepayid: 1,
          giftingWay: 1,
          giftDoubleFlag: false, //赠品倍增多选框
          rangeBean: {

          },
          startTime: '',
          endTime: ''
        },//新建策略参数
        memberId:'0',//会员id
        subUserRangeid: '',//级联会员value
        rangeBean: {
          tradeRulesRelevant:1,
          tradeQtyRules: '',
          tradeQty: '',
          tradeAmtRules: '',
          tradeAmt: ''
        },//指定会员弹框信息
        addGiftParam: {
          suitFlag:'',
          goodsName:'',
          barCode:'',
          page: 1,
          size: 15,
          tenantId: 0
        },//添加赠品弹框查询条件
        addGiftData: [],//添加赠品表格data
        addCommodityParam: {
          suitFlag:'',
          page: 1,
          size: 15,
          goodsName:'',
          barCode:'',
          tenantId: 0
        },//添加商品弹框查询条件
        conditionData:{
          brandIds:[],
          catalogId:[''],
        },
        brandIds:[],
        addCommodityData: [],//添加商品表格data
        //givingWay: 1,
        //tableData: [],
        dialogAddGift: false,//添加赠品弹框
        selectionData1: [], //添加赠品
        selectionData2: [], //添加商品
        selectionData3: [], //更换赠品
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        totalPage1: 15,
        totalPage2: 15,
        totalPage3: 15,
        totalNum1: 0,
        totalNum2: 0,
        totalNum3: 0,
        dialogSetMember: false,//设置会员弹框
        isSetMember: false,// 设置会员范围按钮
        newOldMember: false,//设置会员级联是否显示
        dialogAddCommodity: false,//添加商品弹框
        givingWayArr: [
          {
            label: '订单金额阶梯赠送',
            value: 1
          },
          {
            label: '订单满金额赠送',
            value: 2
          },
          {
            label: '订单满件数赠送',
            value: 3
          },
          {
            label: '订单满种类赠送',
            value: 4
          },
          {
            label: '指定单品买就送',
            value: 5
          },
          {
            label: '多个商品买就送',
            value: 6
          },
          {
            label: '名额阶梯赠送',
            value: 7
          }
        ],//赠送方式
        participateShopArr: [],//参与店铺下拉集合
        partyMembersArr: [
          {
            label: '全部',
            value: '0'
          },
          {
            label: '新客户',
            value: '1'
          },
          {
            label: '老客户',
            value: '2'
          },
          {
            label: '指定会员',
            value: '5'
          }
        ],//设置会员下拉集合
        subPartyMembersArr: [],//设置会员二级下拉集合
        participationChannelArr: [
          {
            label: '网店直营',
            value: 1
          },
          {
            label: '手工建单',
            value: 2
          },
          {
            label: '导入订单',
            value: 3
          },
        ],//参与渠道
        orderTypeArr: [
          {
            label: '正常订单',
            value: 1
          },
          {
            label: '预售订单',
            value: 2
          },
          {
            label: '定金订单',
            value: 3
          },
        ],//订单筛选
        multiProductArr: [
          {
            label: '指定多品满',
            value: 1
          },
          {
            label: '包含指定商品且订单金额满',
            value: 2
          }
        ],//满多少送下拉集合
        transactionsArr: [
          {
            label: '大于',
            value: 1
          }, {
            label: '大于等于',
            value: 2
          }
        ],//大于 大于等于
        orAngArr:[
          {
            label:'或者',
            value:1,
          },
          {
            label:'并且',
            value:2
          }
        ],//或者 并且
        giftStrategy1: false,//订单金额阶梯送
        giftStrategy2: false,//订单满金额送
        giftStrategy3: false,//订单满件数送
        giftStrategy4: false,//订单满种类送
        giftStrategy5: false,//指定单品买送
        giftStrategy6: false,//多个商品买就送
        giftStrategy7: false,//名额阶梯赠送
        giftStrategyData1: [{
          giftBeanList: [],
          fullGiftWay: 1,
          orderStartAmt: '',
          orderEndAmt: ''
        }],
        giftStrategyData2: [{//----------asd------------
          giftBeanList: [],
          fullGiftWay: 1,
          fullGiftAmt: ''
        }],
        giftStrategyData3: [{
          giftBeanList: [],
          fullGiftWay: 1,
          fullGiftQty: ''
        }],
        giftStrategyData4: [{
          giftBeanList: [],
          fullGiftWay: 1,
          fullGiftTypeQty: ''
        }],
        giftStrategyData5: [{
          skuBeanList: [],
          giftBeanList: [],
          fullGiftWay: 1
        }],
        giftStrategyData6: [{
          skuBeanList: [],
          giftBeanList: [],
          fullGiftWay: 1,
          manyBuyGiveType: 1,
          wayupValue: '',
        }],
        giftStrategyData7: [{
          giftBeanList: [],
          fullGiftWay: 1,
          quotaStartQty: '',
          quotaEndQty: ''
        }],
        logo: '',//记录表格
      }
    },
    watch:{
      'paramData.giftStrategyName':function (a,b) {
        //this.paramData.giftStrategyName=Trim(this.paramData.giftStrategyName,'g');
      }
    },
    methods: {
      // 保洁
      //导入商品
      excelExportGoods(logo){
        this.uploadFileDialog = true;
        this.fileName = '';
        this.fileId = '';
        this.goodsLogo = logo;
        this.giftLogo = '';
      },
      //导入赠品
      excelExportGift(logo){
        this.uploadFileDialog = true;
        this.fileName = '';
        this.fileId = '';
        this.goodsLogo = '';
        this.giftLogo = logo;
      },
      //下载模板
      downloadTemplet() {
        // 下载模板文件
        var fileId = process.env.FILE_API == 'www.edbv3.com'?'25861':'22401'
        location.href = 'http://'+process.env.FILE_API+'/files-web/download/' + fileId;
      },
      beforeAvatarUpload(file) {
        if (file.name.indexOf(".xls") > 0 || file.name.indexOf(".xlsx") > 0 || file.name.indexOf(".csv") > 0) {
          this.file = file;
        } else {
          this.$message({
            message: '只支持excel文件上传(.xls、.xlsx、csv)',
            type: 'warning'
          });
          return false;
        }
      },
      httpRequest(){
        let formData = new FormData();
        formData.append('filedata', this.file)
        this.$axios({
          method: 'post',
          url: `http://${process.env.FILE_API}/files-web/upload`,
          data: formData
        }).then((response)=>{
          if(response.data.resourcesId){
            var ossKey = response.data.ossKey.split('.');
            var ossKey2 = ossKey[ossKey.length-1];
            this.fileName = response.data.fileName + '.' + ossKey2;
            this.fileId = response.data.resourcesId;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      //确定导入
      confirmImport(){
        if(!this.fileId){
          this.$message({
            message: '请选择文件',
            type: 'warning'
          });
          return false;
        }
        console.log(this.fileName);
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/goodsImport',{
          fileId:this.fileId,
          fileName:this.fileName
        }).then((response)=>{
          if (response.data.success) {
            var succGoodsBeanList = response.data.result.succGoodsBeanList?response.data.result.succGoodsBeanList:[];
            succGoodsBeanList.forEach(item => {
              if(this.goodsLogo){
                //商品
                item.numEdit = false;
                item.goodsSpec = item.spec;
                item.goodsBarCode = item.barCode;
                item.buyQty = '';
              }else{
                //赠品
                item.buyEdit = false;
                item.numEdit = false;
                item.totalNumEdit = false;
                item.goodsBarCode = item.barCode;
                item.giftGoodsId=item.goodsId;
                item.giftName = item.goodsName;
                item.giveQty = '';
                item.giveTotalQty = '';
                item.givedQty = 0;
              }
            })
            this.importStatus = true;
            this.uploadFileDialog = false;
            this.successFileNum = response.data.result.successNum;
            this.failFileNum = response.data.result.failNum;
            this.failExcelFile = 'http://'+process.env.FILE_API+'/files-web/download/' + response.data.result.fileId;
            if(succGoodsBeanList.length == 0){return false;}
            //插入表格数据
            if(this.goodsLogo){//商品
              this.insertGoods(succGoodsBeanList);
            }else if(this.giftLogo){//赠品
              this.insertGift(succGoodsBeanList);
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      insertGoods(succGoodsBeanList){
        //商品
        console.log(succGoodsBeanList);
        if (this.paramData.giftingWay == 5) {
          var isPass = false,num = 0;
          //指定单品添加
          if(this.paramData.giveTimeType == 3){
            //定金
            var mapArr = new Map();
            this.testData.forEach(item => {
              mapArr.set(item.goodsId,item);
            })
            succGoodsBeanList.forEach(item => {
              if(!mapArr.get(item.goodsId)){
                this.testData.push({
                  goodsName:item.goodsName,
                  goodsId:item.goodsId,
                  barCode:item.barCode,
                  specification:item.goodsSpec,
                  buyQty:item.buyQty,
                  testChildren:[]
                })
                isPass = true;
                num += 1;
              }
            })
          }else{
            //全场
            var mapArr = new Map();
            this.testData2.forEach(item => {
              mapArr.set(item.goodsId,item);
            })
            succGoodsBeanList.forEach(item => {
              if(!mapArr.get(item.goodsId)){
                this.testData2.push({
                  goodsName:item.goodsName,
                  goodsId:item.goodsId,
                  barCode:item.barCode,
                  specification:item.goodsSpec,
                  buyQty:item.buyQty,
                  fullGiftWay:'1',
                  giftDoubleFlag:false,
                  testChildren:[]
                })
                isPass = true;
                num += 1;
              }
            })
          }
          /*if (!isPass) {
            this.$message({
              message: '此商品已添加，请勿重复添加',
              type: 'warning'
            });
            return false;
          }else{
            this.$message({
              message: '添加成功' + num + '条',
              type: 'success'
            });
          }*/
        } else {
          var mapArr = new Map(), isPass = false,num = 0;
          if(this.goodsLogo == 'exclude'){
            //排除商品 excludeGoodsJson
            this.excludeGoodsJson.forEach((item, i) => {
              mapArr.set(item.goodsId, item);
            })
            succGoodsBeanList.forEach((item, i) => {
              if (!mapArr.get(item.goodsId)) {
                item.buyQty = item.buyQty;
                this.excludeGoodsJson.push(item);
                num += 1;
                isPass = true;
              }
            })
          }else if(this.goodsLogo == 'limit'){
            //限制商品
            this.goodsLimitsJson.forEach((item, i) => {
              mapArr.set(item.goodsId, item);
            })
            succGoodsBeanList.forEach((item, i) => {
              if (!mapArr.get(item.goodsId)) {
                if(this.paramData.goodsLimitType == 1){
                  item.buyQty = item.buyQty;
                }else{
                  item.buyQty = '';
                }
                this.goodsLimitsJson.push(item);
                num += 1;
                isPass = true;
              }
            })
          }
          /*if (!isPass) {
            this.$message({
              message: '此商品已添加，请勿重复添加',
              type: 'warning'
            });
            return false;
          }else{
            this.$message({
              message: '添加成功' + num + '条',
              type: 'success'
            });
          }*/
        }
      },
      insertGift(succGoodsBeanList){
        var tableData = this.giftLogo.split('-')[0],i = this.giftLogo.split('-')[1],num = 0;
        if(tableData == 'tailEarnestData' || tableData == 'firstEarnestData'){
          //名额阶梯-定金
          var mapArr = new Map(), isPass = false;
          this[tableData][i].giftBeanList.forEach((item, i) => {
            mapArr.set(item.giftGoodsId, item);
          })
          succGoodsBeanList.forEach((item, index) => {
            if (!mapArr.get(item.giftGoodsId)) {
              //默认值
              item.giveQty = item.giveQty;
              //item.giveTotalQty=1;
              this[tableData][i].giftBeanList.push(item);
              this[tableData][i].giftBeanList[index].pri=index;
              num += 1;
              isPass = true;
            }
          })
          /*if (!isPass) {
            this.$message({
              message: '此商品已添加，请勿重复添加',
              type: 'warning'
            });
            return false;
          }else{
            this.$message({
              message: '添加成功' + num + '条',
              type: 'success'
            });
          }*/
        }else{
          var mapArr = new Map(), isPass = false;
          this['giftStrategyData' + this.giftLogo.split('-')[0]][this.giftLogo.split('-')[1]].giftBeanList.forEach((item, i) => {
            mapArr.set(item.giftGoodsId, item);
          })
          succGoodsBeanList.forEach((item, i) => {
            if (!mapArr.get(item.giftGoodsId)) {
              //默认值
              //item.giveTotalQty=1;
              item.giveQty=item.giveQty;
              this['giftStrategyData' + this.giftLogo.split('-')[0]][this.giftLogo.split('-')[1]].giftBeanList.push(item);
              this['giftStrategyData' + this.giftLogo.split('-')[0]][this.giftLogo.split('-')[1]].giftBeanList[i].pri=i;
              isPass = true;
              num += 1;
            }
          })
          /*if (!isPass) {
            this.$message({
              message: '此商品已添加，请勿重复添加',
              type: 'warning'
            });
            return false;
          }else{
            this.$message({
              message: '添加成功' + num + '条',
              type: 'success'
            });
          }*/
        }
      },
      //多选下拉组件（品牌）
      multipleChange1(value) {
        this.conditionData.brandIds = value;
      },
      //重置时间
      resetGiveTimeType(){
        this.paramData.giveTimeType = '1';
        this.channelGiveTimeType();
      },
      //删除表格数据
      deleteExcludeBtn(index,row,table){
        this[table].splice(index, 1);
      },
      //指定单品送加赠品
      addGiftEar(row,index,type){
        if(type == 'whole'){
          //全场
          this.addGiftDialog('whole');
          this.earLog = index;
        }else{
          //定金
          this.addGiftDialog('earnest');
          this.earLog = index;
        }
      },
      //指定单品买送加商品
      delGoodsEar(row,index,type){
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          if(type == 'whole'){
            //全场
            this.testData2.splice(index,1);
          }else{
            //定金
            this.testData.splice(index,1);
          }
        }).catch(() => {});
      },
      //指定单品买送删商品
      delGiftEar(row,index,indexP,type){
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          if(type == 'whole'){
            //全场
            this.testData2[indexP].testChildren.splice(index,1);
          }else{
            //定金
            this.testData[indexP].testChildren[row.firstLastMoneyType-1].testChildren2.splice(index,1);
          }
        }).catch(() => {});
      },
      //指定单品买送排序
      upArrowGiftEar(row,index,index1,type,index2){
        if(type == 'whole'){
          //全场
          this.testData2[index].testChildren.splice(index1,1);
          this.testData2[index].testChildren.splice(index1 - 1,0,row);
        }else{
          //定金 row 2 1 type 3
          this.testData[index].testChildren[index1].testChildren2.splice(index2,1);
          this.testData[index].testChildren[index1].testChildren2.splice(index2 - 1,0,row);
        }
      },
      downArrowGiftEar(row,index,index1,type,index2){
        if(type == 'whole'){
          //全场
          this.testData2[index].testChildren.splice(index1,1);
          this.testData2[index].testChildren.splice(index1 + 1,0,row);
        }else{
          //定金 row 2 1 type 3
          this.testData[index].testChildren[index1].testChildren2.splice(index2,1);
          this.testData[index].testChildren[index1].testChildren2.splice(index2 + 1,0,row);
        }
      },
      //增加阶梯
      addLadderEarNest(type,index) {
        if (type == 'first') {
          //首款送
          var index=this.firstEarnestData.length-1;
          var obj = {
            fullGiftWay: 1,
            giftBeanList: [],
            quotaStartQty: '',
            quotaEndQty: ''
          }
          var isPass=true;
          this.quotaLayerValidate('firstEarnestData',index,function(data){
            isPass=data;
          });
          if(!isPass){
            return false;
          }
          if (this.firstEarnestData.length < 5) {
            this.firstEarnestData.push(obj);
          } else {
            this.$message({
              message: '最多只能添加5个梯度',
              type: 'warning'
            });
          }
        } else if(type == 'tail'){
          var index=this.tailEarnestData.length-1;
          var obj = {
            fullGiftWay: 1,
            giftBeanList: [],
            quotaStartQty: '',
            quotaEndQty: ''
          }
          var isPass=true;
          this.quotaLayerValidate('tailEarnestData',index,function(data){
            isPass=data;
          });
          if(!isPass){
            return false;
          }
          if (this.tailEarnestData.length < 5) {
            this.tailEarnestData.push(obj);
          } else {
            this.$message({
              message: '最多只能添加5个梯度',
              type: 'warning'
            });
          }
        }
      },
      //减少阶梯
      reduceLadderEarNest(tableName, index) {
        this[tableName].splice(index, 1);
      },
      //表格向上箭头
      upArrowBtnEar(row, tableName,index) {
        var giftArr = this[tableName][index].giftBeanList;
        giftArr.forEach((item, i) => {
          if (item.giftGoodsId == row.giftGoodsId) {
            giftArr.splice(i, 1);
            giftArr.splice(i - 1, 0, row);
          }
        })
        giftArr.forEach((item,i)=>{
          item.pri=i;
        })
        this[tableName][index].giftBeanList = giftArr;
      },
      //表格向下箭头
      downArrowBtnEar(row, tableName,index) {
        var giftArr = this[tableName][index].giftBeanList;
        var index = 0;
        giftArr.forEach((item, i) => {
          if (item.giftGoodsId == row.giftGoodsId) {    //skuId
            giftArr.splice(i, 1);
            index = i + 1;
          }
        })
        giftArr.splice(index, 0, row);
        giftArr.forEach((item,i)=>{
          item.pri=i;
        })
        if(this[tableName][index])this[tableName][index].giftBeanList = giftArr;
      },
      //删除赠品表格数据
      deleteBtnEar(index, row, tableName,i) {
        this[tableName][i].giftBeanList.splice(index, 1);
      },
      //失焦校验
      goodsLimitsBlur(value){
       /* var goodsLimitsJson = JSON.parse(JSON.stringify(this.goodsLimitsJson));
        goodsLimitsJson.forEach(item => {
          item.buyQty = value;
        })
        this.goodsLimitsJson = goodsLimitsJson;*/
      },
      //买全部 买不同 买任意 选项改变
      channelGoodsLimit(value){
        this.goodsLimitNum1 = 0;
        this.goodsLimitNum2 = 0;
        if(value != 1){
          var goodsLimitsJson = JSON.parse(JSON.stringify(this.goodsLimitsJson));
          goodsLimitsJson.forEach(item => {
            item.buyQty = '';
          })
          this.goodsLimitsJson = goodsLimitsJson;
        }
      },
      //重置时间
      channelGiveTimeType(){
        if(this.paramData.giveTimeType == 3 || this.giveTimeType == 3){
          this.givingWayChange('fanhu');
        }
        this.giveTimeType = this.paramData.giveTimeType;
        this.paramData.finalBeginTime = '';
        this.paramData.finalEndTime = '';
      },
      //组件回传
      showParentBlock(clockBlock) {
        this.$emit('changeShow')
      },
      //表单验证
      validation(a, item) {
        switch (item) {
          case 1 :
            this.giftStrategyData1[a].orderStartAmt = priceValidator(this.giftStrategyData1[a].orderStartAmt);
            break;
          case 2 :
            this.giftStrategyData1[a].orderEndAmt = priceValidator(this.giftStrategyData1[a].orderEndAmt);
            break;
          case 3:
            this.giftStrategyData2[0].fullGiftAmt = priceValidator(this.giftStrategyData2[0].fullGiftAmt);
            break;
          case 4:
            this.giftStrategyData3[0].fullGiftQty = positiveIntegerValidator(this.giftStrategyData3[0].fullGiftQty);
            break;
          case 5:
            this.giftStrategyData4[0].fullGiftTypeQty = positiveIntegerValidator(this.giftStrategyData4[0].fullGiftTypeQty);
            break;
          case 6:
            this.giftStrategyData6[0].wayupValue = priceValidator(this.giftStrategyData6[0].wayupValue);
            break;//quotaStartQty quotaEndQty
          case 7 :
            this.giftStrategyData7[a].quotaStartQty = positiveIntegerValidator(this.giftStrategyData7[a].quotaStartQty);
            break;
          case 8 :
            this.giftStrategyData7[a].quotaEndQty = positiveIntegerValidator(this.giftStrategyData7[a].quotaEndQty);
            break;
          case 9:
            this.rangeBean.tradeQty = positiveIntegerValidator(this.rangeBean.tradeQty);
            break;
          case 10:
            this.rangeBean.tradeAmt = priceValidator(this.rangeBean.tradeAmt);
            break;
        }
      },
      /*----------------------------------*/
      //添加赠品弹框
      addGiftDialog(logo) {
        if (logo) {
          this.currentPage1 = 1;
          this.totalPage1 = 15;
          this.addGiftParam.goodsName = '';
          this.addGiftParam.barCode = '';
          this.addGiftParam.suitFlag = '';
          this.logo = logo;
          this.conditionData.brandIds = JSON.parse(JSON.stringify(this.brandIds));
          this.conditionData.catalogId = [''];
        }
        this.addGiftParam.page = this.currentPage1;
        this.addGiftParam.size=this.totalPage1;
        //分类
        if(this.conditionData.catalogId.length == 0){
          this.addGiftParam.catalogId = '';
        }else{
          this.addGiftParam.catalogId = this.conditionData.catalogId[this.conditionData.catalogId.length - 1];
        }
        //品牌
        if(this.conditionData.brandIds.length == this.brandIdArr.length){
          this.addGiftParam.brandIds = '';
        }else{
          this.addGiftParam.brandIds = this.conditionData.brandIds.join(',');
        }

        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGiftsAndSaleInvListByCondition',this.addGiftParam).then((response)=>{
          if (response.data.success) {
            var mapArr1 = new Map(),mapArr2 = new Map();
            this.brandIdArr.forEach(item => {
              mapArr1.set(item.brandId,item);
            })
            this.classifyMatchArr.forEach(item => {
              mapArr2.set(item.catalogId,item);
            })
            this.dialogAddGift = true;
            //this.showFlag = response.data.result.showFlag;
            this.addGiftData = response.data.result.rows.map(v => {
              this.$set(v,'buyEdit',false)
              this.$set(v,'numEdit',false)
              this.$set(v,'totalNumEdit',false)
              v.giveQty=1;
              v.giveTotalQty=1;
              v.giftGoodsId=v.goodsId;
              v.giftName = v.goodsName;
              v.spec=v.specification;
              if(this.getparams){
                v.usableQty=v.goodsMerchantInv?v.goodsMerchantInv.giftSalesInv:'';
              }else{
                v.usableQty=v.goodsMerchantInv?v.goodsMerchantInv.goodsSalesInv:'';
              }

              if(mapArr1.get(v.brandId) && mapArr1.get(v.brandId).brandName){
                v.brandName = mapArr1.get(v.brandId).brandName;
              }else{
                v.brandName = '-';
              }
              if(mapArr2.get(v.catalogId)){
                v.catalogName = mapArr2.get(v.catalogId).catalogName;
              }else{
                v.catalogName = '-';
              }

              return v
            })
            this.totalNum1 = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //添加赠品保存
      saveAddGift(type) {//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        if (this.selectionData1.length == 0) {
          this.$message({
            message: '请选择要添加的赠品！',
            type: 'warning'
          });
          return false;
        } else {
          if (this.paramData.giftingWay == 5) {
            var isAdd = false,num = 0;
            if (this.logo == 'whole') {//全场
              var mapArr = new Map();
              this.testData2[this.earLog].testChildren.forEach(item => {
                mapArr.set(item.giftGoodsId, item);
              })
              this.selectionData1.forEach(item => {
                if (!mapArr.get(item.giftGoodsId)) {
                  //默认值
                  item.giveQty=1;
                  item.giveTotalQty=1;
                  item.givedQty=item.givedQty?item.givedQty:0;
                  item.giftGoodsId = item.goodsId;
                  delete item.goodsId;
                  this.testData2[this.earLog].testChildren.push(item);
                  isAdd = true;
                  num += 1;
                }
              })
              this.dialogAddGift = false;
            } else {//定金
              var selectionData1 = JSON.parse(JSON.stringify(this.selectionData1));
              if(type == 'tail'){
                //尾款送
                selectionData1.forEach(item => {
                  //默认值
                  item.giveQty=1;
                  item.giveTotalQty=1;
                  item.givedQty=item.givedQty?item.givedQty:0;
                  item.giftGoodsId = item.goodsId;
                  //delete item.goodsId;
                  if((this.testData[this.earLog].testChildren[0] && this.testData[this.earLog].testChildren[0].firstLastMoneyType=='2')||(this.testData[this.earLog].testChildren[1] && this.testData[this.earLog].testChildren[1].firstLastMoneyType=='2')){
                    //尾款送有赠品
                    var i = 0;
                    if(this.testData[this.earLog].testChildren[0] && this.testData[this.earLog].testChildren[0].firstLastMoneyType == '2'){i = 0;}else{i = 1;}
                    var mapArr = new Map();
                    this.testData[this.earLog].testChildren[i].testChildren2.forEach(item => {
                      mapArr.set(item.giftGoodsId, item);
                    })
                    selectionData1.forEach(item1 => {
                      if (!mapArr.get(item1.giftGoodsId)) {
                        this.testData[this.earLog].testChildren[i].testChildren2.push(item1);
                        num += 1;
                        isAdd = true;
                      }
                    })
                  }else{
                    isAdd = true;
                    num += 1;
                    this.testData[this.earLog].testChildren.push({
                      fullGiftWay:'1',
                      giftDoubleFlag:false,
                      firstLastMoneyType:'2',
                      testChildren2:[item]
                    })
                  }
                })
              }else if(type == 'head'){
                //首款送
                selectionData1.forEach(item => {
                  //默认值
                  item.giveQty=1;
                  item.giveTotalQty=1;
                  item.givedQty=item.givedQty?item.givedQty:0;
                  item.giftGoodsId = item.goodsId;
                  if(this.testData[this.earLog].testChildren[0] && this.testData[this.earLog].testChildren[0].firstLastMoneyType=='1'){
                    //首款送有赠品
                    var mapArr = new Map();
                    this.testData[this.earLog].testChildren[0].testChildren2.forEach(item => {
                      mapArr.set(item.giftGoodsId, item);
                    })
                    selectionData1.forEach(item1 => {
                      if (!mapArr.get(item1.giftGoodsId)) {
                        this.testData[this.earLog].testChildren[0].testChildren2.push(item1);
                        isAdd = true;
                        num += 1;
                      }
                    })
                  }else{//无赠品
                    isAdd = true;
                    num += 1;
                    this.testData[this.earLog].testChildren.unshift({
                      fullGiftWay:'1',
                      firstLastMoneyType:'1',
                      giftDoubleFlag:false,
                      testChildren2:[item]
                    })
                  }
                })
              }
            }
            if(isAdd){
              this.$refs.multipleTable.clearSelection();
              this.$message({
                message: '添加成功'+ num + '条',
                type: 'success'
              });
            }else{
              this.$message({
                message: '所选商品已添加，请勿重复添加',
                type: 'warning'
              });
            }
          } else {
            var tableData = this.logo.split('-')[0],i = this.logo.split('-')[1],num = 0;
            if(tableData == 'tailEarnestData' || tableData == 'firstEarnestData'){
              //名额阶梯-定金
              var mapArr = new Map(), isPass = false;
              this[tableData][i].giftBeanList.forEach((item, i) => {
                mapArr.set(item.giftGoodsId, item);
              })
              this.selectionData1.forEach((item, index) => {
                if (!mapArr.get(item.giftGoodsId)) {
                  //默认值
                  item.giveQty=1;
                  item.giveTotalQty=1;
                  item.givedQty=item.givedQty?item.givedQty:0;
                  this[tableData][i].giftBeanList.push(item);
                  this[tableData][i].giftBeanList[index].pri=index;
                  num += 1;
                  isPass = true;
                }
              })
              if (!isPass) {
                this.$message({
                  message: '此商品已添加，请勿重复添加',
                  type: 'warning'
                });
                return false;
              }else{
                this.$message({
                  message: '添加成功' + num + '条',
                  type: 'success'
                });
              }
            }else{
              var mapArr = new Map(), isPass = false;
              this['giftStrategyData' + this.logo.split('-')[0]][this.logo.split('-')[1]].giftBeanList.forEach((item, i) => {
                mapArr.set(item.giftGoodsId, item);
              })
              this.selectionData1.forEach((item, i) => {
                if (!mapArr.get(item.giftGoodsId)) {
                  //默认值
                  item.giveQty=1;
                  item.giveTotalQty=1;
                  item.givedQty=item.givedQty?item.givedQty:0;
                  this['giftStrategyData' + this.logo.split('-')[0]][this.logo.split('-')[1]].giftBeanList.push(item);
                  this['giftStrategyData' + this.logo.split('-')[0]][this.logo.split('-')[1]].giftBeanList[i].pri=i;
                  isPass = true;
                  num += 1;
                }
              })
              if (!isPass) {
                this.$message({
                  message: '此商品已添加，请勿重复添加',
                  type: 'warning'
                });
                return false;
              }else{
                this.$message({
                  message: '添加成功' + num + '条',
                  type: 'success'
                });
              }
            }
            this.dialogAddGift = false;
          }
        }
      },
      //添加赠品取消
      cancelAddGift() {
        this.dialogAddGift = false;
      },
      handleSelectionChange1(val) {
        this.selectionData1 = val;
      },
      handleSizeChange1(val) {
        this.totalPage1 = val;
        this.addGiftDialog();
      },
      handleCurrentChange1(val) {
        this.currentPage1 = val;
        this.addGiftDialog();
      },
      queryGiftBtn1() {
        this.addGiftDialog();
      },
      /*----------------------------------*/
      //添加商品弹框
      addCommodityDialog() {
        this.addCommodityParam.page = this.currentPage2;
        this.addCommodityParam.size=this.totalPage2;
        //分类
        if(this.conditionData.catalogId.length == 0){
          this.addCommodityParam.catalogId = '';
        }else{
          this.addCommodityParam.catalogId = this.conditionData.catalogId[this.conditionData.catalogId.length - 1];
        }
        //品牌
        if(this.conditionData.brandIds.length == this.brandIdArr.length){
          this.addCommodityParam.brandIds = '';
        }else{
          this.addCommodityParam.brandIds = this.conditionData.brandIds.join(',');
        }

        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsByCondition',this.addCommodityParam).then((response)=>{
          if (response.data.success) {
            var mapArr1 = new Map(),mapArr2 = new Map();
            this.brandIdArr.forEach(item => {
              mapArr1.set(item.brandId,item);
            })
            this.classifyMatchArr.forEach(item => {
              mapArr2.set(item.catalogId,item);
            })
            this.dialogAddCommodity = true;
            this.addCommodityData = response.data.result.rows.map(v => {
              this.$set(v,'numEdit',false);
              this.$set(v,'buyEdit',false);
              this.$set(v,'goodsSpec',v.specification);
              this.$set(v,'goodsBarCode',v.barCode);

              if(mapArr1.get(v.brandId) && mapArr1.get(v.brandId).brandName){
                v.brandName = mapArr1.get(v.brandId).brandName;
              }else{
                v.brandName = '-';
              }
              if(mapArr2.get(v.catalogId)){
                v.catalogName = mapArr2.get(v.catalogId).catalogName;
              }else{
                v.catalogName = '-';
              }

              return v
            })
            this.totalNum2 = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //添加商品保存
      saveAddCommodity() {//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        if (this.selectionData2.length == 0) {
          this.$message({
            message: '请选择要添加的商品！',
            type: 'warning'
          });
          return false;
        } else {
          if (this.paramData.giftingWay == 5) {
            var isPass = false,num = 0;
            //指定单品添加
            if(this.paramData.giveTimeType == 3){
              //定金
              var mapArr = new Map();
              this.testData.forEach(item => {
                mapArr.set(item.goodsId,item);
              })
              this.selectionData2.forEach(item => {
                if(!mapArr.get(item.goodsId)){
                  this.testData.push({
                    goodsName:item.goodsName,
                    goodsId:item.goodsId,
                    barCode:item.barCode,
                    specification:item.specification,
                    buyQty:'1',
                    testChildren:[]
                  })
                  isPass = true;
                  num += 1;
                }
              })
            }else{
              //全场
              var mapArr = new Map();
              this.testData2.forEach(item => {
                mapArr.set(item.goodsId,item);
              })
              this.selectionData2.forEach(item => {
                if(!mapArr.get(item.goodsId)){
                  this.testData2.push({
                    goodsName:item.goodsName,
                    goodsId:item.goodsId,
                    barCode:item.barCode,
                    specification:item.specification,
                    buyQty:'1',
                    fullGiftWay:'1',
                    giftDoubleFlag:false,
                    testChildren:[]
                  })
                  isPass = true;
                  num += 1;
                }
              })
            }
            if (!isPass) {
              this.$message({
                message: '此商品已添加，请勿重复添加',
                type: 'warning'
              });
              return false;
            }else{
              this.$message({
                message: '添加成功' + num + '条',
                type: 'success'
              });
            }
          } else {
            var mapArr = new Map(), isPass = false,num = 0;
            if(this.logo == 'exclude'){
              //排除商品 excludeGoodsJson
              this.excludeGoodsJson.forEach((item, i) => {
                mapArr.set(item.goodsId, item);
              })
              this.selectionData2.forEach((item, i) => {
                if (!mapArr.get(item.goodsId)) {
                  item.buyQty=1;
                  this.excludeGoodsJson.push(item);
                  num += 1;
                  isPass = true;
                }
              })
            }else if(this.logo == 'limit'){
              //限制商品
              this.goodsLimitsJson.forEach((item, i) => {
                mapArr.set(item.goodsId, item);
              })
              this.selectionData2.forEach((item, i) => {
                if (!mapArr.get(item.goodsId)) {
                  if(this.paramData.goodsLimitType == 1){
                    item.buyQty = 1;
                  }else{
                    item.buyQty = '';
                  }
                  this.goodsLimitsJson.push(item);
                  num += 1;
                  isPass = true;
                }
              })
            }else{
              this['giftStrategyData' + this.logo.split('-')[0]][this.logo.split('-')[1]].skuBeanList.forEach((item, i) => {
                mapArr.set(item.goodsId, item);
              })
              this.selectionData2.forEach((item, i) => {
                if (!mapArr.get(item.goodsId)) {
                  item.buyQty=1;
                  this['giftStrategyData' + this.logo.split('-')[0]][this.logo.split('-')[1]].skuBeanList.push(item);
                  isPass = true;
                  num += 1;
                }
              })
            }
            if (!isPass) {
              this.$message({
                message: '此商品已添加，请勿重复添加',
                type: 'warning'
              });
              return false;
            }else{
              this.$message({
                message: '添加成功' + num + '条',
                type: 'success'
              });
            }
          }
          this.dialogAddCommodity = false;
        }
      },
      //添加商品取消
      cancelAddCommodity() {
        this.dialogAddCommodity = false;
      },
      handleSelectionChange2(val) {
        this.selectionData2 = val;
      },
      handleSizeChange2(val) {
        this.totalPage2 = val;
        this.addCommodityDialog();
      },
      handleCurrentChange2(val) {
        this.currentPage2 = val;
        this.addCommodityDialog();
      },
      queryGiftBtn2() {
        this.addCommodityDialog();
      },
      /*----------------------------------*/
      //设置会员范围弹框
      setMemberDialog(){
        this.rangeBean.tradeQtyRules=this.paramData.rangeBean.tradeQtyRules?this.paramData.rangeBean.tradeQtyRules:1;
        this.rangeBean.tradeQty=this.paramData.rangeBean.tradeQty;
        this.rangeBean.tradeAmtRules=this.paramData.rangeBean.tradeAmtRules?this.paramData.rangeBean.tradeAmtRules:1;
        this.rangeBean.tradeRulesRelevant=this.paramData.rangeBean.tradeRulesRelevant?this.paramData.rangeBean.tradeRulesRelevant:1;
        this.rangeBean.tradeAmt=this.paramData.rangeBean.tradeAmt;
        this.dialogSetMember=true;
      },
      //设置会员范围保存
      saveSetMember(){
        if(this.rangeBean.tradeQty*1>99999999){
          this.rangeBean.tradeQty='';
          this.$message({
            message: '次数输入最大不能超过99999999',
            type: 'warning'
          });
          return false;
        }
        if(this.rangeBean.tradeAmt>99999999.99){
          this.rangeBean.tradeAmt='';
          this.$message({
            message: '金额最大不能超过99999999.99',
            type: 'warning'
          });
          return false;
        }
        this.paramData.rangeBean.tradeQtyRules=this.rangeBean.tradeQtyRules;
        this.paramData.rangeBean.tradeQty=this.rangeBean.tradeQty;
        this.paramData.rangeBean.tradeAmtRules=this.rangeBean.tradeAmtRules;
        this.paramData.rangeBean.tradeAmt=this.rangeBean.tradeAmt;
        this.paramData.rangeBean.tradeRulesRelevant=this.rangeBean.tradeRulesRelevant;
        this.dialogSetMember=false;
      },
      //设置会员范围取消
      cancelSetMember() {
        this.dialogSetMember = false;
      },
      /*----------------------------------*/
      //添加商品弹框
      addDialog(logo) {
        if (logo) this.logo = logo;
        this.addCommodityParam.goodsName = '';
        this.addCommodityParam.barCode = '';
        this.currentPage2 = 1;
        this.totalPage2= 15;
        this.addCommodityParam.suitFlag = '';

        this.conditionData.brandIds = JSON.parse(JSON.stringify(this.brandIds));
        this.conditionData.catalogId = [''];

        this.addCommodityDialog();
      },
      /*----------------------------------*/
      //参与会员二级联动
      partyMembersChange() {
        if (this.memberId == 1) {
          this.newOldMember = true;
          this.isSetMember = false;
          this.subPartyMembersArr = [
            {
              label: '店铺新客户',
              value: 1
            },
            {
              label: '平台新客户',
              value: 3
            }
          ]
          this.subUserRangeid = this.subUserRangeid==3?3:1;
        } else if (this.memberId == 2) {
          this.newOldMember = true;
          this.isSetMember = false;
          this.subPartyMembersArr = [
            {
              label: '店铺老客户',
              value: 2
            },
            {
              label: '平台老客户',
              value: 4
            }
          ]
          this.subUserRangeid = this.subUserRangeid==4?4:2;
        } else if (this.memberId == 5) {
          this.paramData.rangeBean.tradeQtyRules = '';
          this.paramData.rangeBean.tradeQty = '';
          this.paramData.rangeBean.tradeAmtRules = '';
          this.paramData.rangeBean.tradeAmt = '';

          this.newOldMember = false;
          this.isSetMember = true;
        } else if (this.memberId == 0) {
          this.newOldMember = false;
          this.isSetMember = false;
        }
      },
      //赠送方式改变   eeeeeeeeeeeeeeeeeeeee
      givingWayChange(type) {
        //重置赠品fanhu
        if(type != 'fanhu'){
          this.paramData.giveTimeType = '1';
          this.giveTimeType = '1';
        }
        this.paramData.goodsLimitType = '1';
        this.goodsLimitNum1 = '';
        this.goodsLimitNum2 = '';
        this.excludeGoodsJson = [];
        this.goodsLimitsJson = [];
        for (var i = 0; i < 7; i++) {
          this['giftStrategy' + (i + 1)] = false;
        }
        this['giftStrategy' + (this.paramData.giftingWay)] = true;
        this.paramData.giftDoubleFlag = false;
        this.testData = [];
        this.testData2 = [];
        this.giftStrategyData1 = [{
          giftBeanList: [],
          fullGiftWay: 1,
          orderStartAmt: '',
          orderEndAmt: ''
        }]
        this.giftStrategyData2 = [{
          giftBeanList: [],
          fullGiftWay: 1,
          fullGiftAmt: ''
        }]
        this.giftStrategyData3 = [{
          giftBeanList: [],
          fullGiftWay: 1,
          fullGiftQty: ''
        }]
        this.giftStrategyData4 = [{
          giftBeanList: [],
          fullGiftWay: 1,
          fullGiftTypeQty: ''
        }]
        this.giftStrategyData6 = [{
          skuBeanList: [],
          giftBeanList: [],
          fullGiftWay: 1,
          manyBuyGiveType: 1,
          wayupValue: '',
        }]
        this.giftStrategyData7 = [{
          giftBeanList: [],
          fullGiftWay: 1,
          quotaStartQty: '',
          quotaEndQty: ''
        }]
        this.firstEarnestData = [{
          giftBeanList: [],
          fullGiftWay: 1,
          quotaStartQty: '',
          quotaEndQty: ''
        }]
        this.tailEarnestData = [{
          giftBeanList: [],
          fullGiftWay: 1,
          quotaStartQty: '',
          quotaEndQty: ''
        }]
      },
      //双击单元格
      celldbClick(row, column, cell, event) {
        if(this.forbidden){
          return false;
        }
        console.log(column);
        if (column.property == "numEdit") {
          row.numEdit = true;
        } else if (column.property == "totalEdit") {
          row.totalNumEdit = true;
        } else if (column.property == 'buyQty') {
          row.buyEdit = true;
        }
      },
      //单元格保存
      keyupNumSave(row, index) {
        row.giveQty = positiveIntegerValidator(row.giveQty);
        if(row.buyQty){row.buyQty = positiveIntegerValidator(row.buyQty);}
        row.numEdit = false;
      },
      keyupTotalSave(row, index) {
        row.giveTotalQty = positiveIntegerValidator(row.giveTotalQty);
        row.totalNumEdit = false;
      },
      //赠品策略保存
      giftStrategySave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //参与店铺下拉
            this.paramData.storeIdList=$('#participate-shop').val();
            //参与渠道下拉
            this.paramData.channelIdList=$('#participate-channel').val();
            if (this.paramData.storeIdList==null || this.paramData.storeIdList.length == 0) {
              return false;
            }
            if (this.paramData.channelIdList==null || this.paramData.channelIdList.length == 0) {
              return false;
            }
            if (this.paramData.orderTypeIdList==null || this.paramData.orderTypeIdList.length == 0) {
              this.$message({
                message: '订单筛选至少选择一种订单类型',
                type: 'warning'
              });
              return false;
            }
            //时间校验
            var timeName = '';
            if(this.paramData.giveTimeType == 1){//付款时间
              timeName = '付款';
            }else if(this.paramData.giveTimeType == 2){//下单时间
              timeName = '下单';
            }else{//首尾款时间
              timeName = '首款';
            }
            if(!this.paramData.orderBeginTime){
              this.$message({
                message: timeName + '起始时间不能为空',
                type: 'warning'
              });
              return false;
            }
            if(!this.paramData.orderEndTime){
              this.$message({
                message: timeName + '结束时间不能为空',
                type: 'warning'
              });
              return false;
            }
            if(this.paramData.orderBeginTime && this.paramData.orderEndTime && this.paramData.orderBeginTime > this.paramData.orderEndTime){
              this.$message({
                message: timeName + '起始时间不能大于结束时间',
                type: 'warning'
              });
              return false;
            }
            if(this.paramData.giveTimeType == 3){
              if(!this.paramData.finalBeginTime){
                this.$message({
                  message: '尾款起始时间不能为空',
                  type: 'warning'
                });
                return false;
              }
              if(!this.paramData.finalEndTime){
                this.$message({
                  message: '尾款结束时间不能为空',
                  type: 'warning'
                });
                return false;
              }
              if(this.paramData.finalBeginTime && this.paramData.finalEndTime && this.paramData.finalBeginTime > this.paramData.finalEndTime){
                this.$message({
                  message: '尾款起始时间不能大于结束时间',
                  type: 'warning'
                });
                return false;
              }
            }
            if(this.paramData.giveTimeType == 3 && this.paramData.finalBeginTime < this.paramData.orderBeginTime){
              this.$message({
                message: '尾款起始时间不能小于首款起始时间',
                type: 'warning'
              });
              return false;
            }

            //非定金订单
            /*var timeName = '';
            if(this.paramData.giveTimeType != 3){
              if(this.paramData.giveTimeType == 1){//付款时间
                timeName = '付款';
              }else if(this.paramData.giveTimeType == 2){//下单时间
                timeName = '下单';
              }
              if(!this.paramData.orderBeginTime){
                this.$message({
                  message: timeName + '起始时间不能为空',
                  type: 'warning'
                });
                return false;
              }
              if(!this.paramData.orderEndTime){
                this.$message({
                  message: timeName + '结束时间不能为空',
                  type: 'warning'
                });
                return false;
              }
              if(this.paramData.orderBeginTime && this.paramData.orderEndTime && this.paramData.orderBeginTime > this.paramData.orderEndTime){
                this.$message({
                  message: timeName + '起始时间不能大于结束时间',
                  type: 'warning'
                });
                return false;
              }
            }
            //定金订单
            /!*if(this.paramData.giveTimeType == 3){
              if(!this.paramData.finalBeginTime){
                this.$message({
                  message: '尾款起始时间不能为空',
                  type: 'warning'
                });
                return false;
              }
              if(!this.paramData.finalEndTime){
                this.$message({
                  message: '尾款结束时间不能为空',
                  type: 'warning'
                });
                return false;
              }
              if(this.paramData.finalBeginTime && this.paramData.finalEndTime && this.paramData.finalBeginTime > this.paramData.finalEndTime){
                this.$message({
                  message: '尾款起始时间不能大于结束时间',
                  type: 'warning'
                });
                return false;
              }
              if(this.paramData.giveTimeType == 3 && this.paramData.finalBeginTime < this.paramData.orderBeginTime){
                this.$message({
                  message: '尾款起始时间不能小于首款起始时间',
                  type: 'warning'
                });
                return false;
              }
            }*!/*/

            //参与会员
            if(this.memberId==0){
              this.paramData.memberId=0;
            }else if(this.memberId==5){
              this.paramData.memberId=5;
              this.paramData.memberRangeBean=this.paramData.rangeBean;
            }else{
              this.paramData.memberId=this.subUserRangeid;
            }
            if(this.paramData.memberRangeBean){
              this.paramData.memberRangeBean=JSON.stringify(this.paramData.memberRangeBean);
            }
            //处理赠送方式数据
            if(this.paramData.giftingWay == 6){//多个商品买就送
              this.paramData.manyOrderFullAmt=this.giftStrategyData6[0].wayupValue?this.giftStrategyData6[0].wayupValue:'';
              this.paramData.manyBuyGiveType=this.giftStrategyData6[0].manyBuyGiveType;
            }else if(this.paramData.giftingWay == 2){//满金额
              this.paramData.fullGiftAmt=this.giftStrategyData2[0].fullGiftAmt;
            }else if(this.paramData.giftingWay == 3){//满件数
              this.paramData.fullGiftQty=this.giftStrategyData3[0].fullGiftQty;
            }else if(this.paramData.giftingWay == 4){//满种类
              this.paramData.fullGiftTypeQty=this.giftStrategyData4[0].fullGiftTypeQty;
            }
            //商品限制类型 商品限制数量
            if(this.paramData.goodsLimitType == 2){
              this.paramData.goodsLimitNum = this.goodsLimitNum1;
            }else if(this.paramData.goodsLimitType == 3){
              this.paramData.goodsLimitNum = this.goodsLimitNum2;
            }

            //多个商品买就送
            if(this.paramData.giftingWay == 6 && this.goodsLimitsJson.length == 0){
              this.$message({
                message: '商品不能为空！',
                type: 'warning'
              });
              return false;
            }
            //名额阶梯送
            if(this.paramData.giftingWay == 7){
              if((this.paramData.goodsLimitType == 2 || this.paramData.goodsLimitType == 3) && this.goodsLimitsJson.length == 0){
                this.$message({
                  message: '商品不能为空！',
                  type: 'warning'
                });
                return false;
              }
            }
            //商品限制校验
            if(this.goodsLimitsJson.length > 0 && this.paramData.giftingWay != 1){
              var goodsLimitsJsonPass = false;
              this.goodsLimitsJson.forEach(item => {
                if(!item.buyQty){
                  goodsLimitsJsonPass = true;
                }
              })
              if(goodsLimitsJsonPass && this.paramData.goodsLimitType == 1){
                this.$message({
                  message: '商品限制购买数量必填且不能为0！',
                  type: 'warning'
                });
                return false;
              }
              if(this.paramData.goodsLimitType == 3 && !this.goodsLimitNum2){//(this.paramData.goodsLimitType == 2 && !this.goodsLimitNum1) ||
                this.$message({
                  message: '商品限制购买数量必填且不能为0！',
                  type: 'warning'
                });
                return false;
              }
              //选择买不同商品时校验
              if(this.paramData.goodsLimitType == 2){
                if(!this.goodsLimitNum1 || this.goodsLimitNum1 < 2){
                  this.$message({
                    message: '商品限制购买数量必填且大于等于2！',
                    type: 'warning'
                  });
                  return false;
                }
                if(this.goodsLimitsJson.length < 2){
                  this.$message({
                    message: '指定商品种类大于等于2！',
                    type: 'warning'
                  });
                  return false;
                }
              }
            }
            //赠品表格校验
            switch (this.paramData.giftingWay) {
              case 1:
                var isPass=true;
                for(var i=this.giftStrategyData1.length-1;i>=0;i--){
                  this.amountLayerValidate(i,function(data){
                    isPass=data;
                  });
                }
                if(!isPass){
                  return false;
                }
                break;
              case 2:
                if(this.giftStrategyData2[0].fullGiftAmt.toString().trim() == ''){
                  this.$message({
                    message: '商品金额满不能为空',
                    type: 'warning'
                  });
                  return false;
                }else if(this.giftStrategyData2[0].fullGiftAmt>99999999.99){
                  this.giftStrategyData2[0].fullGiftAmt='';
                  this.$message({
                    message: '金额输入最大不能超过99999999.99',
                    type: 'warning'
                  });
                  return false;
                }
                if(this.giftStrategyData2[0].giftBeanList.length==0){
                  this.$message({
                    message: '赠品不能为空',
                    type: 'warning'
                  });
                  return false;
                }
                var isPass1=true,isPass2=true,isPass3=true,isPass4=true,isPass5=true;
                this.giftStrategyData2[0].giftBeanList.forEach((item,i)=>{
                  if(item.giveQty==''||item.giveQty=='0'){
                    isPass1=false;
                  }
                  if(item.giveTotalQty=='' || item.giveTotalQty=='0'){
                    isPass5=false;
                  }
                  if(item.giveTotalQty !== '' && item.giveQty*1>item.giveTotalQty*1){
                    isPass2=false;
                  }
                  if(item.giveTotalQty*1>item.usableQty*1){
                    isPass3=false;
                  }
                  if(item.giveQty*1>99999999){isPass4=false;};
                  if(item.giveTotalQty*1>99999999){isPass4=false;};
                })
                if(!isPass1){
                  this.$message({
                    message: '赠送数量为必填且不能为0！',
                    type: 'warning'
                  });
                  return false;
                }
                /*if(!isPass5){
                  this.$message({
                    message: '赠送总量为必填且不能为0！',
                    type: 'warning'
                  });
                  return false;
                }*/
                if(!isPass2){
                  this.$message({
                    message: '赠送数量不能大于赠送总量',
                    type: 'warning'
                  });
                  return false;
                }
                if(!isPass4){
                  this.$message({
                    message: '数量最大不能超过99999999',
                    type: 'warning'
                  });
                  return false;
                }
                break;
              case 3:
                if(this.giftStrategyData3[0].fullGiftQty.toString().trim() == ''){
                  this.$message({
                    message: '订单满件数不能为空',
                    type: 'warning'
                  });
                  return false;
                } else if (this.giftStrategyData3[0].fullGiftQty*1 > 99999999) {
                  this.$set(this.giftStrategyData3[0],'fullGiftQty','');
                  this.$message({
                    message: '件数最大不能超过99999999',
                    type: 'warning'
                  });
                  return false;
                }
                if(this.giftStrategyData3[0].giftBeanList.length==0){
                  this.$message({
                    message: '赠品不能为空',
                    type: 'warning'
                  });
                  return false;
                }
                var isPass1=true,isPass2=true,isPass3=true,isPass4=true,isPass5=true;
                this.giftStrategyData3[0].giftBeanList.forEach((item,i)=>{
                  if(item.giveQty==''||item.giveQty=='0'){
                    isPass1=false;
                  }
                  if(item.giveTotalQty=='' || item.giveTotalQty=='0'){
                    isPass5=false;
                  }
                  if(item.giveTotalQty !== '' && item.giveQty*1>item.giveTotalQty*1){
                    isPass2=false;
                  }
                  if(item.giveTotalQty*1>item.usableQty*1){
                    isPass3=false;
                  }
                  if(item.giveQty*1>99999999){isPass4=false;};
                  if(item.giveTotalQty*1>99999999){isPass4=false;};
                })
                if(!isPass1){
                  this.$message({
                    message: '赠送数量为必填且不能为0！',
                    type: 'warning'
                  });
                  return false;
                }/*
                if(!isPass5){
                  this.$message({
                    message: '赠送总量为必填且不能为0！',
                    type: 'warning'
                  });
                  return false;
                }*/
                if(!isPass2){
                  this.$message({
                    message: '赠送数量不能大于赠送总量',
                    type: 'warning'
                  });
                  return false;
                }
                if(!isPass4){
                  this.$message({
                    message: '数量最大不能超过99999999',
                    type: 'warning'
                  });
                  return false;
                }
                break;
              case 4:
                if(this.giftStrategyData4[0].fullGiftTypeQty.toString().trim() == ''){
                  this.$message({
                    message: '订单满种类不能为空',
                    type: 'warning'
                  });
                  return false;
                }else if (this.giftStrategyData4[0].fullGiftTypeQty > 99999999) {
                  this.giftStrategyData4[0].fullGiftTypeQty='';
                  this.$message({
                    message: '种类最大不能超过99999999',
                    type: 'warning'
                  });
                  return false;
                }
                if(this.giftStrategyData4[0].giftBeanList.length==0){
                  this.$message({
                    message: '赠品不能为空',
                    type: 'warning'
                  });
                  return false;
                }
                var isPass1=true,isPass2=true,isPass3=true,isPass4=true,isPass5=true;
                this.giftStrategyData4[0].giftBeanList.forEach((item,i)=>{
                  if(item.giveQty==''||item.giveQty=='0'){
                    isPass1=false;
                  }
                  if(item.giveTotalQty=='' || item.giveTotalQty=='0'){
                    isPass5=false;
                  }
                  if(item.giveTotalQty !== '' && item.giveQty*1>item.giveTotalQty*1){
                    isPass2=false;
                  }
                  if(item.giveTotalQty*1>item.usableQty*1){
                    isPass3=false;
                  }
                  if(item.giveQty*1>99999999){isPass4=false;};
                  if(item.giveTotalQty*1>99999999){isPass4=false;};
                })
                if(!isPass1){
                  this.$message({
                    message: '赠送数量为必填且不能为0！',
                    type: 'warning'
                  });
                  return false;
                }
                /*if(!isPass5){
                  this.$message({
                    message: '赠送总量为必填且不能为0！',
                    type: 'warning'
                  });
                  return false;
                }*/
                if(!isPass2){
                  this.$message({
                    message: '赠送数量不能大于赠送总量',
                    type: 'warning'
                  });
                  return false;
                }
                if(!isPass4){
                  this.$message({
                    message: '数量最大不能超过99999999',
                    type: 'warning'
                  });
                  return false;
                }
                break;
              case 6:
                /*if(this.giftStrategyData6[0].skuBeanList.length==0){
                  this.$message({
                    message: '商品不能为空',
                    type: 'warning'
                  });
                  return false;
                }*/
                var isPass1=true,isPass2=true,isPass3=true,isPass4=true,isPass5=true,isPass6=true,isPass7=true;
                this.giftStrategyData6[0].giftBeanList.forEach((item,i)=>{
                  if(item.giveQty==''||item.giveQty=='0'){
                    isPass1=false;
                  }
                  if(item.giveTotalQty=='' || item.giveTotalQty=='0'){
                    isPass7=false;
                  }
                  if(item.giveTotalQty !== '' && item.giveQty*1>item.giveTotalQty*1){
                    isPass2=false;
                  }
                  if(item.giveTotalQty*1>item.usableQty*1){
                    isPass3=false;
                  }
                  if(item.giveQty*1>99999999){isPass4=false;};
                  if(item.giveTotalQty*1>99999999){isPass4=false;};
                })
                this.giftStrategyData6[0].skuBeanList.forEach((item,i)=>{
                  if(item.buyQty==''||item.buyQty=='0'){
                    isPass5=false;
                  }
                  if(item.buyQty*1>99999999){isPass6=false;};//item.buyQty=''
                })
                /*if(!isPass5){
                  this.$message({
                    message: '购买数量为必填且不能为0',
                    type: 'warning'
                  });
                  return false;
                }
                if(!isPass6){
                  this.$message({
                    message: '数量最大不能超过99999999',
                    type: 'warning'
                  });
                  return false;
                } else if(this.giftStrategyData6[0].wayupValue>99999999.99){
                  this.giftStrategyData6[0].wayupValue='';
                  this.$message({
                    message: '金额输入最大不能超过99999999.99',
                    type: 'warning'
                  });
                  return false;
                }*/
                /*if(this.giftStrategyData6[0].wayupValue.toString().trim() == ''){
                  this.$message({
                    message: '指定多品满或包含指定商品订单金额满输入框不能为空',
                    type: 'warning'
                  });
                  return false;
                }*/
               /* if(this.giftStrategyData6[0].wayupValue.toString().trim() == ''){
                  this.$message({
                    message: '商品金额满不能为空',
                    type: 'warning'
                  });
                  return false;
                }*/
                if(this.giftStrategyData6[0].giftBeanList.length==0){
                  this.$message({
                    message: '赠品不能为空',
                    type: 'warning'
                  });
                  return false;
                }
                if(!isPass1){
                  this.$message({
                    message: '赠送数量为必填且不能为0',
                    type: 'warning'
                  });
                  return false;
                }
                /*if(!isPass7){
                  this.$message({
                    message: '赠送总量为必填且不能为0',
                    type: 'warning'
                  });
                  return false;
                }*/
                if(!isPass2){
                  this.$message({
                    message: '赠送数量不能大于赠送总量',
                    type: 'warning'
                  });
                  return false;
                }
                if(!isPass4){
                  this.$message({
                    message: '数量最大不能超过99999999',
                    type: 'warning'
                  });
                  return false;
                }
                break;
              case 7:
                if(this.paramData.giveTimeType != 3){
                  var isPass=true;
                  for(var i=this.giftStrategyData7.length-1;i>=0;i--){
                    this.quotaLayerValidate('giftStrategyData7',i,function(data){
                      isPass=data;
                    });
                  }
                  if(!isPass){
                    return false;
                  }
                }else{
                  //首款送与尾款送至少有一个有赠品
                  if(this.firstEarnestData[0].giftBeanList.length == 0 && this.tailEarnestData[0].giftBeanList.length == 0){
                    this.$message({
                      message: '首款送与尾款送至少有一个有赠品',
                      type: 'warning'
                    });
                    return false;
                  }
                  var isPass=true,isPass2 = true;
                  if(this.firstEarnestData[0].giftBeanList.length != 0){
                    for(var i=this.firstEarnestData.length-1;i>=0;i--){
                      this.quotaLayerValidate('firstEarnestData',i,function(data){
                        isPass=data;
                      });
                    }
                    if(!isPass){
                      return false;
                    }
                  }
                  if(this.tailEarnestData[0].giftBeanList.length != 0){
                    for(var i=this.tailEarnestData.length-1;i>=0;i--){
                      this.quotaLayerValidate('tailEarnestData',i,function(data){
                        isPass2=data;
                      });
                    }
                    if(!isPass2){
                      return false;
                    }
                  }
                }
                break;
            }
            /*单品校验待写*/
            if(this.paramData.giftingWay == 5){
              if(this.paramData.giveTimeType == 3){
                if(this.testData.length == 0){
                  this.$message({
                    message: '请添加商品',
                    type: 'warning'
                  });
                  return false;
                }
                //定金
                var msg1 = '',msg2 = '',msg3 = '',msg4 = '';
                for(var item of this.testData){
                  if(item.testChildren.length == 0){
                    msg4 = '每个商品至少需要添加一个赠品';
                  }
                  if(!item.buyQty){
                    msg1 = item.goodsName + '必填';
                    break;
                  }
                  for(var item1 of item.testChildren){
                    for(var item2 of item1.testChildren2){
                      var message = item1.firstLastMoneyType == '1'?'首款送':'尾款送';
                      if(!item2.giveQty){
                        msg2 = item.goodsName + ' ' + message + '下 '+ item2.giftName + ' 的赠送数量必填';
                        break;
                      }
                      if(item2.giveTotalQty*1 !== '' && item2.giveQty*1 > item2.giveTotalQty*1){
                        msg3 = item.goodsName + ' ' + message + '下 '+ item2.giftName + ' 的赠送数量不能大于赠送总量';
                        break;
                      }
                    }
                  }
                }
                if(msg4){
                  this.$message({
                    message: msg4,
                    type: 'warning'
                  });
                  return false;
                }
                if(msg1){
                  this.$message({
                    message: msg1,
                    type: 'warning'
                  });
                  return false;
                }
                if(msg2){
                  this.$message({
                    message: msg2,
                    type: 'warning'
                  });
                  return false;
                }
                if(msg3){
                  this.$message({
                    message: msg3,
                    type: 'warning'
                  });
                  return false;
                }
              }else{
                if(this.testData2.length == 0){
                  this.$message({
                    message: '请添加商品',
                    type: 'warning'
                  });
                  return false;
                }
                //全场
                var msg1 = '',msg2 = '',msg3 = '',msg4 = '';
                for(var item of this.testData2){
                  if(item.testChildren.length == 0){
                    msg4 = '每个商品至少需要添加一个赠品';
                  }
                  if(!item.buyQty){
                    msg1 = item.goodsName + '购买数量必填';
                    break;
                  }
                  for(var item2 of item.testChildren){
                    if(!item2.giveQty){
                      msg2 = item.goodsName + '下 '+ item2.giftName + ' 的赠送数量必填';
                      break;
                    }
                    if(item2.giveTotalQty*1 !== '' && item2.giveQty*1 > item2.giveTotalQty*1){
                      msg3 = item.goodsName + '下 '+ item2.giftName + ' 的赠送数量不能大于赠送总量';
                      break;
                    }
                  }
                }
                if(msg4){
                  this.$message({
                    message: msg4,
                    type: 'warning'
                  });
                  return false;
                }
                if(msg1){
                  this.$message({
                    message: msg1,
                    type: 'warning'
                  });
                  return false;
                }
                if(msg2){
                  this.$message({
                    message: msg2,
                    type: 'warning'
                  });
                  return false;
                }
                if(msg3){
                  this.$message({
                    message: msg3,
                    type: 'warning'
                  });
                  return false;
                }
              }
            }
            //排除商品与商品限制
            this.excludeGoodsJson.forEach((item,i) => {
              item.pri = i+1;
            })
            this.goodsLimitsJson.forEach((item,i) => {
              item.pri = i+1;
              item.goodsBarCode = item.goodsBarCode?item.goodsBarCode:item.barCode;
            })
            this.paramData.excludeGoodsJson = JSON.stringify(this.excludeGoodsJson);
            this.paramData.goodsLimitsJson = JSON.stringify(this.goodsLimitsJson);

            if(this.paramData.giftingWay == 5){
              //指定单品买
              var giftBeanList = [],skuBeanList = [];
              if(this.paramData.giveTimeType == 3){
                //定金
                this.testData.forEach((item,i) => {
                  //商品
                  skuBeanList.push({
                    buyQty:item.buyQty,
                    goodsId:item.goodsId,
                    specification:item.specification,
                    goodsName:item.goodsName,
                    barCode:item.barCode,
                    pri:i+1
                  })
                  //赠品
                  item.testChildren.forEach(item1 => {
                    item1.testChildren2.forEach((item2,index) => {
                      item2.goodsId = item.goodsId;
                      item2.firstLastMoneyType = item1.firstLastMoneyType;
                      item2.fullGiftWay = item1.fullGiftWay;
                      item2.giftDoubleFlag = item1.giftDoubleFlag;
                      item2.pri = index+1;
                      giftBeanList.push(item2);
                    })
                  })
                })
              }else{
                //全场
                this.testData2.forEach((item,i) => {
                  //商品
                  skuBeanList.push({
                    buyQty:item.buyQty,
                    goodsId:item.goodsId,
                    specification:item.specification,
                    goodsName:item.goodsName,
                    barCode:item.barCode,
                    pri:i+1
                  })
                  //赠品
                  item.testChildren.forEach((item1,index) => {
                    item1.goodsId = item.goodsId;
                    item1.firstLastMoneyType = '';
                    item1.fullGiftWay = item.fullGiftWay;
                    item1.giftDoubleFlag = item.giftDoubleFlag;
                    item1.pri = index+1;
                    giftBeanList.push(item1);
                  })
                })
              }
              this.paramData.promplanLevelBeanList=JSON.stringify([{giftBeanList, skuBeanList}]);
            }else if(this.paramData.giftingWay == 7){
              //名额阶梯
              if(this.paramData.giveTimeType == 3){
                //定金
                var promplanLevelBeanList = [];
                this.firstEarnestData.forEach(item => {
                  item.giftBeanList.forEach((item2,j)=>{
                    item2.pri=j;
                  })
                  item.firstLastMoneyType = 1;
                  if(item.giftBeanList.length>0)promplanLevelBeanList.push(item);
                })
                this.tailEarnestData.forEach(item => {
                  item.giftBeanList.forEach((item2,j)=>{
                    item2.pri=j;
                  })
                  item.firstLastMoneyType = 2;
                  if(item.giftBeanList.length>0)promplanLevelBeanList.push(item);
                })
                this.paramData.promplanLevelBeanList=JSON.stringify(promplanLevelBeanList);
              }else{
                //全场
                this['giftStrategyData' + this.paramData.giftingWay].forEach((item,i)=>{
                  item.giftBeanList.forEach((item2,j)=>{
                    item2.pri=j;
                  })
                })
                this.paramData.promplanLevelBeanList=JSON.stringify(this['giftStrategyData'+this.paramData.giftingWay]);
              }
            }else{
              this['giftStrategyData' + this.paramData.giftingWay].forEach((item,i)=>{
                item.giftBeanList.forEach((item2,j)=>{
                  item2.pri=j;
                })
              })
              this.paramData.promplanLevelBeanList=JSON.stringify(this['giftStrategyData'+this.paramData.giftingWay]);
            }
            this.shade = true;
            var paramDataObj={};
            for(let i in this.paramData){
              if(i != 'rangeBean'){
                paramDataObj[i]=this.paramData[i];
              }
            }
            //console.log(paramDataObj);
            console.log(this.paramData);
            this.paramData.giftStrategyId = this.giftStrategyId;
            var urlName = this.type == 1 || this.type == 3?'savePromplanBean':'updatePromplanBean';
            this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/' + urlName,paramDataObj).then((response)=>{
              if (response.data.success) {
                this.shade = false;
                this.$emit('changeShow',{isRefresh:true});
                setTimeout(()=>{
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                },300)
              } else {
                this.shade = false;
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //表格向上箭头
      upArrowBtn(row, logo) {
        var giftArr = this['giftStrategyData' + logo.split('-')[0]][logo.split('-')[1]].giftBeanList;
        giftArr.forEach((item, i) => {
          if (item.giftGoodsId == row.giftGoodsId) {
            giftArr.splice(i, 1);
            giftArr.splice(i - 1, 0, row);
          }
        })
        giftArr.forEach((item,i)=>{
          item.pri=i;
        })
        this['giftStrategyData' + logo.split('-')[0]][logo.split('-')[1]].giftBeanList = giftArr;
      },
      //表格向下箭头
      downArrowBtn(row, logo) {
        var giftArr = this['giftStrategyData' + logo.split('-')[0]][logo.split('-')[1]].giftBeanList;
        var index = 0;
        giftArr.forEach((item, i) => {
          if (item.giftGoodsId == row.giftGoodsId) {    //skuId
            giftArr.splice(i, 1);
            index = i + 1;
          }
        })
        giftArr.splice(index, 0, row);
        giftArr.forEach((item,i)=>{
          item.pri=i;
        })
        this['giftStrategyData' + logo.split('-')[0]][logo.split('-')[1]].giftBeanList = giftArr;
      },
      //删除赠品表格数据
      deleteBtn(index, row, logo) {
        this['giftStrategyData' + logo.split('-')[0]][logo.split('-')[1]].giftBeanList.splice(index, 1);
        if (this.paramData.giftingWay == 5) {
          this['giftStrategyData' + logo.split('-')[0]][logo.split('-')[1]].skuBeanList.splice(index, 1);
        }
      },
      //删除商品表格数据
      deleteBuyBtn(index, row, logo) {
        this['giftStrategyData' + logo.split('-')[0]][logo.split('-')[1]].skuBeanList.splice(index, 1);
      },
      //增加阶梯
      addLadder(logo) {
        var index=this['giftStrategyData' + logo].length-1;
        if (this.paramData.giftingWay == 1) {
          var obj = {
            fullGiftWay: 1,
            giftBeanList: [],
            orderStartAmt: '',
            orderEndAmt: ''
          }
          var isPass=true;
          this.amountLayerValidate(index,function(data){
            isPass=data;
          });
          if(!isPass){
            return false;
          }
        } else if(this.paramData.giftingWay == 7){
          var obj = {
            fullGiftWay: 1,
            giftBeanList: [],
            quotaStartQty: '',
            quotaEndQty: ''
          }
          var isPass=true;
          this.quotaLayerValidate('giftStrategyData7',index,function(data){
            isPass=data;
          });
          if(!isPass){
            return false;
          }
        }
        if (this['giftStrategyData' + logo].length < 5) {
          this['giftStrategyData' + logo].push(obj);
        } else {
          this.$message({
            message: '最多只能添加5个梯度',
            type: 'warning'
          });
        }
      },
      //减少阶梯
      reduceLadder(logo, index) {
        this['giftStrategyData' + logo].splice(index, 1);
      },
      //校验参与店铺
      validateShop(){
        var _this=$('#participate-shop');
        if($(_this).val().length==0){
          $(_this).parent().next().show();
          $(_this).next().children().eq(0).addClass('b-error');
          return false;
        }else{
          $(_this).parent().next().hide();
          $(_this).next().children().eq(0).removeClass('b-error');
        }
      },
      //校验参与渠道
      validateChannel(){
        var _this=$('#participate-channel');
        if($(_this).val().length==0){
          $(_this).parent().next().show();
          $(_this).next().children().eq(0).addClass('b-error');
          return false;
        }else{
          $(_this).parent().next().hide();
          $(_this).next().children().eq(0).removeClass('b-error');
        }
      },
      //名额阶梯验证
      quotaLayerValidate(tableData,index,callback){
        var titleName = '';
        if(tableData == 'firstEarnestData'){
          titleName = '（首款送）';
        }else if(tableData == 'tailEarnestData'){
          titleName = '（尾款送）';
        }
        var num = index + 1;
        if (this[tableData][index].quotaStartQty.toString().trim() == '') {
          this.$message({
            message: titleName+ '请添加名次',
            type: 'warning'
          });
          callback(false);
          return false;
        } else if (this[tableData][index].quotaEndQty.toString().trim() == '') {
          this.$message({
            message:titleName + '请添加名次',
            type: 'warning'
          });
          callback(false);
          return false;
        } else if (this[tableData][index].quotaEndQty * 1 < this[tableData][index].quotaStartQty * 1) {
          this.$message({
            message: titleName+ '第' + num + '层级名额上限值不能小于下限值',
            type: 'warning'
          });
          callback(false);
          return false;
        } else if (this[tableData][index].quotaStartQty * 1 > 99999999) {
          this[tableData][index].quotaStartQty = '';
          this.$message({
            message: titleName+ '名额输入最大不能超过99999999',
            type: 'warning'
          });
          callback(false);
          return false;
        } else if (this[tableData][index].quotaEndQty * 1 > 99999999) {
          this[tableData][index].quotaEndQty = '';
          this.$message({
            message: titleName+ '名额输入最大不能超过99999999',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        if (index == 0 && this[tableData][index].quotaStartQty * 1 == '0') {
          this.$message({
            message: titleName+ '第1层级名额下限值最小为1',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        if (index > 0) {
          if (this[tableData][index].quotaStartQty * 1 <= this[tableData][index - 1].quotaEndQty * 1) {
            this.$message({
              message: titleName+ '第' + num + '层级下限值必须大于第' + (num - 1) + '层级上限值',
              type: 'warning'
            });
            callback(false);
            return false;
          }
          if (this[tableData][index].quotaEndQty * 1 <= this[tableData][index - 1].quotaEndQty * 1) {
            this.$message({
              message: titleName+ '第' + num + '层级上限值必须大于第' + (num - 1) + '层级上限值',
              type: 'warning'
            });
            callback(false);
            return false;
          }
        }
        if (this[tableData][index].giftBeanList.length == 0) {
          this.$message({
            message: titleName+ '第' + num + '层级赠品不能为空',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        var isPass1 = true, isPass2 = true, isPass3 = true, isPass4 = true, isPass5 = true,isPass6=true,totalNum=0;
        this[tableData][index].giftBeanList.forEach((item, i) => {
          if (item.giveQty == '' || item.giveQty == '0') {
            isPass1 = false;
          }
          if (item.giveTotalQty == '' || item.giveTotalQty == '0') {
            isPass5 = false;
          }
          if (item.giveQty * 1 > item.giveTotalQty * 1) {
            isPass2 = false;
          }
          if (item.giveTotalQty * 1 > item.usableQty * 1) {
            isPass3 = false;
          }
          if (item.giveQty * 1 > 99999999) {
            isPass4 = false;
          }
          if (item.giveTotalQty * 1 > 99999999) {
            isPass4 = false;
          }
          if((item.giveTotalQty * 1)/(item.giveQty*1)!=(this[tableData][index].quotaEndQty*1-this[tableData][index].quotaStartQty*1+1)){
            isPass6=false;
          }
          totalNum+=(item.giveTotalQty * 1)/(item.giveQty*1);
        })
        if (!isPass1) {
          this.$message({
            message: titleName+ '第' + num + '层级赠送数量为必填且不能为0！',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        if (!isPass5) {
          this.$message({
            message: titleName+ '第' + num + '层级赠送总量为必填且不能为0！',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        if (!isPass2) {
          this.$message({
            message: titleName+ '第' + num + '层级赠品赠送数量不能大于赠送总量',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        if (!isPass4) {
          this.$message({
            message: titleName+ '数量最大不能超过99999999',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        if(this[tableData][index].fullGiftWay==1){
          if (!isPass6) {
            this.$message({
              message: titleName+ '第'+num+'层级的赠送总量/赠送数量要等于名额差，请重新配置！',
              type: 'warning'
            });
            callback(false);
            return false;
          }
        }else if(this[tableData][index].fullGiftWay==2||this[tableData][index].fullGiftWay==3){
          if (totalNum != (this[tableData][index].quotaEndQty*1-this[tableData][index].quotaStartQty*1+1)) {
            this.$message({
              message: titleName+ '第'+num+'层级的赠送总量/赠送数量要等于名额差，请重新配置！',
              type: 'warning'
            });
            callback(false);
            return false;
          }
        }
      },
      //金额阶梯验证
      amountLayerValidate(index,callback){
        var num = index + 1;
        if (this.giftStrategyData1[index].orderStartAmt.toString().trim() == '') {
          this.$message({
            message: '请添加金额！',
            type: 'warning'
          });
          callback(false);
          return false;
        } else if (this.giftStrategyData1[index].orderEndAmt.toString().trim() == '') {
          this.$message({
            message: '请添加金额！',
            type: 'warning'
          });
          callback(false);
          return false;
        } else if (this.giftStrategyData1[index].orderEndAmt * 1 < this.giftStrategyData1[index].orderStartAmt * 1) {
          this.$message({
            message: '第' + num + '层级订单金额上限值不能小于下限值',
            type: 'warning'
          });
          callback(false);
          return false;
        } else if (this.giftStrategyData1[index].orderStartAmt * 1 > 99999999.99) {
          this.giftStrategyData1[index].orderStartAmt = '';
          this.$message({
            message: '金额输入最大不能超过99999999.99',
            type: 'warning'
          });
          callback(false);
          return false;
        } else if (this.giftStrategyData1[index].orderEndAmt * 1 > 99999999.99) {
          this.giftStrategyData1[index].orderEndAmt = '';
          this.$message({
            message: '金额输入最大不能超过99999999.99',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        if (index > 0) {
          if (this.giftStrategyData1[index].orderStartAmt * 1 <= this.giftStrategyData1[index - 1].orderEndAmt * 1) {
            this.$message({
              message: '第' + num + '层级下限值必须大于第' + (num - 1) + '层级上限值',
              type: 'warning'
            });
            callback(false);
            return false;
          }
          if (this.giftStrategyData1[index].orderEndAmt * 1 <= this.giftStrategyData1[index - 1].orderEndAmt * 1) {
            this.$message({
              message: '第' + num + '层级上限值必须大于第' + (num - 1) + '层级上限值',
              type: 'warning'
            });
            callback(false);
            return false;
          }
        }
        if (this.giftStrategyData1[index].giftBeanList.length == 0) {
          this.$message({
            message: '第' + num + '层级赠品不能为空',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        var isPass1 = true, isPass2 = true, isPass3 = true, isPass4 = true, isPass5 = true;
        this.giftStrategyData1[index].giftBeanList.forEach((item, i) => {
          if (item.giveQty == '' || item.giveQty == '0') {
            isPass1 = false;
          }
          if (item.giveTotalQty == '' || item.giveTotalQty == '0') {
            isPass5 = false;
          }
          if (item.giveTotalQty !== '' && item.giveQty * 1 > item.giveTotalQty * 1) {
            isPass2 = false;
          }
          if (item.giveTotalQty * 1 > item.usableQty * 1) {
            isPass3 = false;
          }
          if (item.giveQty * 1 > 99999999) {
            isPass4 = false;
          }
          ;
          if (item.giveTotalQty * 1 > 99999999) {
            isPass4 = false;
          }
          ;
        })
        if (!isPass1) {
          this.$message({
            message: '第' + num + '层级赠送数量为必填且不能为0！',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        /*if (!isPass5) {
          this.$message({
            message: '第' + num + '层级赠送总量为必填且不能为0！',
            type: 'warning'
          });
          callback(false);
          return false;
        }*/
        if (!isPass2) {
          this.$message({
            message: '第' + num + '层级赠品赠送数量不能大于赠送总量',
            type: 'warning'
          });
          callback(false);
          return false;
        }
        if (!isPass4) {
          this.$message({
            message: '数量最大不能超过99999999',
            type: 'warning'
          });
          callback(false);
          return false;
        }
      },
      //修改复制查看回显
      echoInit(){
        /*-----------------回显-----------------*/
        this.loading = true;
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/getPromplanBean', {
          tenantId: 0,
          giftStratageId: this.giftStrategyId
        }).then((response) => {
          this.loading = false;
          if (response.data.success) {
            var res = response.data.result;
            var pass = false;
            this.groupArr.forEach(item => {
              if(res.giftStrategyGroupId == item.giftStrategyGroupId){
                pass = true;
              }
            })
            this.paramData.giftStrategyGroupId = pass?res.giftStrategyGroupId:'';   //所属分组
            this.paramData.giftStrategyName = res.giftStrategyName;   //策略名称
            this.paramData.giftStrategyNo = res.giftStrategyNo;   //策略编号
            $('#participate-shop').multiselect('select', JSON.parse(res.storeIdList));    //参与店铺
            $('#participate-channel').multiselect('select', JSON.parse(res.channelIdList));    //参与渠道
            this.paramData.storeIdList = JSON.parse(res.storeIdList);
            this.paramData.channelIdList = JSON.parse(res.channelIdList);
            this.paramData.sortWaitTime = res.sortWaitTime?res.sortWaitTime:'';   //排序等待时间
            this.paramData.giftingWay = res.giftingWay;   //赠送方式
            this.paramData.orderTypeIdList = JSON.parse(res.orderTypeIdList);   //订单筛选
            this.paramData.orderBeginTime = res.orderBeginTime?res.orderBeginTime:'';
            this.paramData.orderEndTime = res.orderEndTime?res.orderEndTime:'';
            this.paramData.finalBeginTime = res.finalBeginTime?res.finalBeginTime:'';
            this.paramData.finalEndTime = res.finalEndTime?res.finalEndTime:'';
            this.paramData.giveTimeType=res.giveTimeType+'';  //赠送时机
            this.giveTimeType = res.giveTimeType+'';
            this.paramData.giftDoubleFlag = res.giftDoubleFlag;   //赠品倍增
            this.paramData.giftStrategyId=res.giftStrategyId;
            this.paramData.goodsLimitType = res.goodsLimitType+'';//商品限制类型
            this.goodsLimitNum1 = this.paramData.goodsLimitType == 2?res.goodsLimitNum:'';
            this.goodsLimitNum2 = this.paramData.goodsLimitType == 3?res.goodsLimitNum:'';
            this.paramData.memberId = res.memberId;   //参与会员
            //设置指定会员
            if(res.memberId==0||res.memberId==5){
              this.memberId=res.memberId;
            }else{
              if(res.memberId==1 || res.memberId==3){
                this.memberId='1';
                this.subUserRangeid=res.memberId;
              }else if(res.memberId==2 || res.memberId==4){
                this.memberId='2';
                this.subUserRangeid=res.memberId;
              }
            }
            this.partyMembersChange();
            if (res.rangeBean) {
              this.paramData.rangeBean = res.rangeBean;
              /*this.rangeBean.tradeQtyRules = res.rangeBean.tradeQtyRules;
              this.rangeBean.tradeQty = res.rangeBean.tradeQty;
              this.rangeBean.tradeAmtRules = res.rangeBean.tradeAmtRules;
              this.rangeBean.tradeAmt = res.rangeBean.tradeAmt;
              this.rangeBean.tradeRulesRelevant = res.rangeBean.tradeRulesRelevant;*/
            }

            //判断是否是进行中的策略
            var currentTime = new Date().getTime();
            var maxTime = '';
            if(this.paramData.giveTimeType == 3){
              maxTime = this.paramData.orderEndTime > this.paramData.finalEndTime?this.paramData.orderEndTime:this.paramData.finalEndTime;
            }else{
              maxTime = this.paramData.orderEndTime;
            }
            if(this.paramData.orderBeginTime < currentTime && maxTime > currentTime && this.type == 2){
              this.forbidden = true;
              this.forbidden1 = false;
            }

            for (var i = 0; i < 7; i++) {
              this['giftStrategy' + (i + 1)] = false;
            }
            this['giftStrategy' + (this.paramData.giftingWay)] = true;
            //金额阶梯与名额阶梯（全场）排序
            res.listShow.sort((a, b) => {
              if (res.giftingWay == 1) {
                return a.orderStartAmt - b.orderStartAmt;
              } else if (res.giftingWay == 7 && !(this.paramData.giveTimeType == 3)) {//名额阶梯全场
                return a.quotaStartQty - b.quotaStartQty;
              }
            })
            //赠品排序显示
            res.listShow.forEach((item, i) => {
              if (!item.skuBeanList) {
                item.skuBeanList = [];
              }
              if (!item.giftBeanList) {
                item.giftBeanList = [];
              }
              item.giftBeanList.forEach((item2,j)=>{
                item2.numEdit=false;
                item2.totalNumEdit=false;
                if(this.type == 3){
                  item2.givedQty = 0;
                }
              })
              item.skuBeanList.forEach((item3,k)=>{
                item3.numEdit=false;
              })
              if (item.giftBeanList && item.giftBeanList.length > 0) {
                item.giftBeanList.sort((a, b) => {
                  return a.pri - b.pri;
                })
              }
            })
            if(res.giftingWay == 2){
              res.listShow[0].fullGiftAmt = '';
            }else if(res.giftingWay == 3){
              res.listShow[0].fullGiftQty = '';
            }else if(res.giftingWay == 4){
              res.listShow[0].fullGiftTypeQty = '';
            }else if(res.giftingWay == 6){
              res.listShow[0].manyBuyGiveType = '';
              res.listShow[0].wayupValue = '';
            }
            //排除商品 商品限制
            this.excludeGoodsJson = res.excludeBeanList;
            res.limitBeanList.forEach(item => {
              item.numEdit = false;
            })
            this.goodsLimitsJson = res.limitBeanList;

            if(res.giftingWay == 1 || res.giftingWay == 2 || res.giftingWay == 3 || res.giftingWay == 4 || res.giftingWay == 6 || (res.giftingWay == 7 && this.paramData.giveTimeType != 3)){
              this['giftStrategyData' + res.giftingWay] = res.listShow;
            }
            if(res.giftingWay == 7 && this.paramData.giveTimeType == 3){
              //名额阶梯-定金
              var firstEarnestData = [],tailEarnestData = [];
              res.listShow.forEach(item => {
                if(item.firstLastMoneyType == 1){
                  firstEarnestData.push(item);
                }else if(item.firstLastMoneyType == 2){
                  tailEarnestData.push(item);
                }
              })
              firstEarnestData.sort((a,b) => {
                return a.quotaStartQty - b.quotaStartQty;
              })
              tailEarnestData.sort((a,b) => {
                return a.quotaStartQty - b.quotaStartQty;
              })
              if(firstEarnestData.length>0)this.firstEarnestData = firstEarnestData;
              if(tailEarnestData.length>0)this.tailEarnestData = tailEarnestData;
            }
            if(res.giftingWay == 5){
              if(this.paramData.giveTimeType == 3){
                //定金
                /*testData:[{
                         goodsName:'商品1',
                         barCode:'1103',
                         specification:'啊啊啊',
                         buyQty:'1',
                         testChildren:[{
                           fullGiftWay:'1',
                           firstLastMoneyType:'1',
                           testChildren2:[{
                             giftName:'赠品1',
                             barcode:'LJTM001',
                             spec:'袋',
                             giveQty:'1',
                             giveTotalQty:'2',
                             givedQty:'1',
                           }]
                         }],
                       }],*/
                var giftBeanList = res.listShow[0].giftBeanList,skuBeanList = res.listShow[0].skuBeanList;
                skuBeanList.forEach(item =>{
                  var arr1 = [],arr2 = [];
                  giftBeanList.forEach(item1 => {
                    if(item.goodsId == item1.goodsId){
                      if(item1.firstLastMoneyType == 1){
                        arr1.push(item1)
                      }
                      if(item1.firstLastMoneyType == 2){
                        arr2.push(item1)
                      }
                    }
                  })
                  item.testChildren = [{
                    firstLastMoneyType:'1',
                    testChildren2:arr1
                  },{
                    firstLastMoneyType:'2',
                    testChildren2:arr2
                  }];
                })
                skuBeanList.forEach(item => {
                  item.testChildren.forEach((item1,i) => {
                    if(item1.testChildren2.length == 0){
                      item.testChildren.splice(i,1);
                    }
                  })
                })
                skuBeanList.forEach(item => {
                  item.testChildren.forEach((item1,i) => {
                    item1.fullGiftWay = item1.testChildren2[0].fullGiftWay+'';
                    item1.giftDoubleFlag = item1.testChildren2[0].giftDoubleFlag;
                  })
                })
                //console.log(skuBeanList);
                this.testData = skuBeanList;
              }else{
                //全场
                var giftBeanList = res.listShow[0].giftBeanList,skuBeanList = res.listShow[0].skuBeanList;
                skuBeanList.forEach(item =>{
                  var testChildren = [];
                  giftBeanList.forEach(item1 => {
                    if(item.goodsId == item1.goodsId){
                      testChildren.push(item1);
                    }
                  })
                  item.fullGiftWay = testChildren[0].fullGiftWay+'';
                  item.giftDoubleFlag = testChildren[0].giftDoubleFlag;
                  item.testChildren = testChildren;
                })
                this.testData2 = skuBeanList;
              }
            }
            if(res.giftingWay == 6){//多个商品买就送
              this.giftStrategyData6[0].wayupValue=res.manyOrderFullAmt?res.manyOrderFullAmt:'';
              this.giftStrategyData6[0].manyBuyGiveType = res.manyBuyGiveType;
            }else if(res.giftingWay == 2){//满金额
              this.giftStrategyData2[0].fullGiftAmt=res.fullGiftAmt;
            }else if(res.giftingWay == 3){//满件数
              this.giftStrategyData3[0].fullGiftQty=res.fullGiftQty;
            }else if(res.giftingWay == 4){//满种类
              this.giftStrategyData4[0].fullGiftTypeQty=res.fullGiftTypeQty;
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
        /*-----------------回显-----------------*/
      },
      //赠品、套装可售库存开与否
      getParam(){
        this._post('com.edb01.erp.oms.service.api.OrderForWmsService/' + this.version + '/getGiftSwitch').then((response)=>{
          if (response.data.success) {
            this.getparams = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
        this._post('com.edb01.erp.oms.service.api.OrderForWmsService/' + this.version + '/getSuitSalesSwitch').then((response)=>{
          if (response.data.success) {
            this.suitSwitch = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //店铺下拉集合
      storeEcho(){
        //参与店铺下拉
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/findGrantStoreByUser').then((response)=>{
          if (response.data.success) {
            var shopSelect=[];
            this.participateShopArr = response.data.result;
            this.participateShopArr.forEach((item,i)=>{
              item.value = item.storeId;
              item.label = item.storeName;
              shopSelect.push(item.storeId);
            })
            $('#participate-shop').multiselect('dataprovider', this.participateShopArr);
            if(this.type == 1)$('#participate-shop').multiselect('select',shopSelect);
            if(this.type != 1){
              this.echoInit();
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //分组下拉
      groupListEcho(){
        //分组集合
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/promplanGroupListSearch').then((response) => {
          if (response.data.success) {
            this.groupArr = response.data.result;
            this.groupArr.forEach((item, i) => {
              item.value = item.giftStrategyGroupId;
              item.label = item.groupName;
            })
            this.storeEcho();
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //品牌下拉集合
      brandEcho(){
        return this._post('com.edb01.erp.mdata.service.api.BrandService/' + this.version + '/list');
      },
      //分类树形集合
      catalogTree(){
        return this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/listTree');
      },
      //分类下拉集合
      catalogEcho(){
        return this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/list').then((response) => {
          if (response.data.success) {
            this.classifyMatchArr = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
    },
    mounted() {
      if(this.type == 1){
        this.titleName = '新建';
      }else if(this.type == 2){
        this.titleName = '修改';
      }else if(this.type == 3){
        this.titleName = '复制';
      }else if(this.type == 4){
        this.titleName = '查看';
        this.forbidden = true;
      }
      var _this=this;
      //参与店铺下拉框
      $('#participate-shop').multiselect({
        onInitialized: function(select, container) {
          $("._scroll").yi_scroll();
        },
        //下拉框关闭回调函数
        onDropdownHide: function (event) {
          _this.validateShop();
        },
      });
      //参与渠道下拉框
      $('#participate-channel').multiselect({
        onInitialized: function(select, container) {
          $("._scroll").yi_scroll();
        },
        //下拉框关闭回调函数
        onDropdownHide: function (event) {
          _this.validateChannel();
        },
      });
      if(this.type == 1)$('#participate-channel').multiselect('select',[1,2,3]);
      this.giftStrategy1 = true;
      //分组下拉
      this.groupListEcho();
      //赠品、套装可售库存开与否
      this.getParam();
      this.catalogEcho();
      this.$axios.all([this.brandEcho(), this.catalogTree()])
        .then(this.$axios.spread((res1, res2) => {
          this.agLoading = false;
          //品牌
          if(res1.data.success){
            res1.data.result = res1.data.result?res1.data.result:[];
            this.brandIds = [];
            res1.data.result.forEach(item => {
              item.label = item.brandName;
              item.value = item.brandId;
              this.brandIds.push(item.brandId)
            })
            res1.data.result.unshift({
              label:'（无数据）',
              value:'DongPing'
            })
            this.brandIds.unshift('DongPing');
            this.brandIdArr = res1.data.result;
          }else{
            this.$message({
              message: res1.data.msg,
              type: 'warning'
            });
          }
          //分类
          if(res2.data.success){
            res2.data.result = res2.data.result?res2.data.result:[];
            res2.data.result.unshift({
              privilegeName:'（无数据）',
              catalogId:'DongPing'
            })
            res2.data.result.unshift({
              privilegeName:'全部',
              catalogId:''
            })
            this.catalogList = res2.data.result;
          } else {
            this.$message({
              message: res2.data.msg,
              type: 'warning'
            });
          }
        }));
    }
  }
</script>
<style scoped>
  .fh-title{
    color: rgb(64, 158, 255);
    font-size: 16px;
    margin: 15px 0 15px 0px;
    padding-left: 10px;
    border-left: 2px solid rgb(64, 158, 255);;
    height: 16px;
    line-height: 16px;
  }
  .fh-title-c{
    margin-left:10px;
  }
  .input-box {
    display: inline-block;
    width: 100%;
  }
  .input-box label {
    width: 70px;
    display: inline-block;
    text-align: right;
    margin-right: 1px;
  }

  .triggerTime label {
    width: 140px;
  }
</style>
<style>
  .fh-date-packer .el-input--prefix .el-input__inner{
    padding-left:25px;
  }
  .fh-date-packer .el-input--suffix .el-input__inner{
    padding-right:15px;
  }
  #giftStrategy-add .el-input-number{
    width:100%;
  }
  .earnest-tail .el-radio+.el-radio{
    margin-left:12px;
  }
  .fh-table.el-table .cell{
    padding:0 !important;
  }
  .fh-table .el-radio{
    margin-left:10px;
    margin-right:0px;
  }
  .fh-table .el-radio__label{
    font-size:10px;
  }
</style>
