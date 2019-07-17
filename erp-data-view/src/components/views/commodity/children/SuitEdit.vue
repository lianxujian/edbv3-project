<!-- 套装添加 樊虎-->
<template>
  <div id="suit-add" style='padding-bottom:95px !important;'>
    <el-breadcrumb separator="/" class="col-breadcrumb" style="margin-bottom:15px;">
      <el-breadcrumb-item :to="{ path: '/suit' }"><span @click="showParentBlock">套装管理</span></el-breadcrumb-item>
      <el-breadcrumb-item>{{titleName}}套装管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="7">
        <el-form :model="paramData" :rules="rules" ref="ruleForm" label-width="90px" class="ruleForm">
          <el-form-item label="商品编号：" prop="goodsCode">
            <el-input class="first-focus" type="text" size="small" :disabled="isDisabled" v-model="paramData.goodsCode" placeholder="最多不超过50个字符" :maxlength="50"></el-input>
            <span v-if="paramData.goodsCode.length>0&& paramData.goodsCode.length<50">{{paramData.goodsCode.length}}/50</span><span v-if="paramData.goodsCode.length==50" style="color:#fa5555;">50/50</span>
          </el-form-item>
          <el-form-item label="条形码：" prop="barCode">
            <el-input type="text" size="small" v-model="paramData.barCode" :disabled="isDisabled" placeholder="最多不超过50个字符" :maxlength="50"></el-input>
            <span v-if="paramData.barCode.length>0&& paramData.barCode.length<50">{{paramData.barCode.length}}/50</span><span v-if="paramData.barCode.length==50" style="color:#fa5555;">50/50</span>
          </el-form-item>
          <el-form-item label="商品名称：" prop="goodsName">
            <el-input type="text" size="small" v-model="paramData.goodsName" :disabled="isDisabled" placeholder="最多不超过200个字符" :maxlength="200"></el-input>
            <span v-if="paramData.goodsName.trim().length>0&& paramData.goodsName.trim().length<200">{{paramData.goodsName.length}}/200</span><span v-if="paramData.goodsName.length==200" style="color:#fa5555;">200/200</span>
          </el-form-item>

          <el-form-item label="品牌：">
            <!--<multiple-select
              :disabled="isDisabled"
              :selectArr="brandIdArr"
              :valueArr="paramData.brandId"
              @multipleChange="multipleChange">
            </multiple-select>-->
            <el-select size='small' v-model="paramData.brandId" :disabled="isDisabled" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in brandIdArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item><!-- catalogId -->
          <el-form-item label="分类：">
            <el-input v-model="chooseClassifyBtn" clearable disabled>
              <template slot="append">
                <div @click="chooseClassify" style="cursor:pointer;">选择分类</div>
              </template>
            </el-input>
            <i class="el-icon-error" style="cursor:pointer;" v-show="chooseClassifyBtn && !isDisabled" @click="clearCalalogId"></i>
          </el-form-item>

          <el-form-item label="简称：" prop="goodsShortName">
            <el-input type="text" size="small" :disabled="isDisabled" v-model="paramData.goodsShortName"></el-input>
          </el-form-item>
          <el-form-item label="规格：" prop="specification">
            <el-input type="text" size="small" :disabled="isDisabled" v-model="paramData.specification"></el-input>
          </el-form-item>
          <el-form-item label="厂家货号：" prop="articleNumber">
            <el-input type="text" maxlength="50" size="small" :disabled="isDisabled" v-model="paramData.articleNumber"></el-input>
          </el-form-item>
          <el-form-item label="售价：">
            <el-input type="text" @keyup.native="paramData.salesPrice = paramData.salesPrice.replace(/[^\d\.]/g,'')" maxlength="20" size="small" disabled v-model="paramData.salesPrice" @blur="validation(1)"></el-input>
          </el-form-item>
          <el-form-item label="净重：">
            <el-input type="text" @keyup.native="paramData.suttle = paramData.suttle.replace(/[^\d\.]/g,'')" maxlength="20" size="small" disabled v-model="paramData.suttle" @blur="validation(2)"></el-input> kg
          </el-form-item>
          <el-form-item label="发货仓方案：">
            <el-select size='small' v-model="paramData.sendStorageId" :disabled="isDisabled" clearable placeholder="">
              <el-option
                v-for="item in planIdArr"
                :key="item.assignStorageId"
                :label="item.schemeName"
                :value="item.assignStorageId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="装箱率：">
            <el-input type="text" maxlength="8" @keyup.native="paramData.binRatio = paramData.binRatio.replace(/[^\d]/g,'')" size="small" :disabled="isDisabled" v-model="paramData.binRatio" @blur="validation(6)"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="17">
        <div style="margin-left:50px;">
          <span style="float:left;margin:2px 10px 0 0;">图片链接：</span>
          <div class="img-box">
            <div v-for="(item,i) in picUrlList" style="position:relative;">
              <div v-if="item.imageUrl" style="position:absolute;width:100%;height:100%;left:0;top:0;" @mouseover="mouseenterImg($event,item)" @mouseout="mouseoutImg($event,item)">
                <i v-if="item.showDel && !isDisabled" class="el-icon-circle-close" style="cursor:pointer;color:#cc4545;font-size:14px;position:absolute;top:-3px;right:-3px;" @click="deleteImg(i)"></i>
              </div>
              <i class="el-icon-plus" v-if="!item.imageUrl" style="cursor: pointer;margin:26px;" @click="popoverShowBtn"></i>
              <img :src="item.imageUrl" alt="">
              <div class="icon-box" v-if="item.imageUrl && !isDisabled">
                <i class="el-icon-arrow-left" @click="leftRemove(i,item)"></i>
                <i class="el-icon-arrow-right"  @click="rightRemove(i,item)"></i>
              </div>
            </div>
          </div>
          <div v-if="popoverShow && !isDisabled" style="margin:20px 0 0 70px;border: 1px solid #eee;border-radius: 5px;height: 50px;width: 370px;padding: 10px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
            <el-input type="text" style="width:200px;" placeholder="请输入图片路径" v-model="imageUrl"></el-input>
            <el-button type="primary" style="min-width:70px !important;" @click="addImgBtn">添加</el-button>
            <el-button style="margin-left:0px;min-width:70px !important;" @click="cancelImgBtn">取消</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>

      <div style="margin-top:5px;">
        <span style="width:85px;display:inline-block;margin-right:3px;text-align:right;">体积：</span>
        <el-input type="text" size="small" style="width:100px;" v-if="paramData.goodsLength*paramData.goodsWidth*paramData.goodsHeight"
                  v-model="paramData.goodsLength*paramData.goodsWidth*paramData.goodsHeight" disabled></el-input>
        <el-input type="text" size="small" style="width:100px;" v-else disabled></el-input>cm³ = 长
        <el-input maxlength="8" @keyup.native="paramData.goodsLength = paramData.goodsLength.replace(/[^\d\.]/g,'')"
                  :disabled="isDisabled" v-model="paramData.goodsLength" @blur="validation(3)" type="text" size="small" style="width:80px;"></el-input> cm × 宽
        <el-input @keyup.native="paramData.goodsWidth = paramData.goodsWidth.replace(/[^\d\.]/g,'')" maxlength="8" type="text" @blur="validation(4)"
                  :disabled="isDisabled"  v-model="paramData.goodsWidth" size="small" style="width:80px;"></el-input> cm × 高
        <el-input @keyup.native="paramData.goodsHeight = paramData.goodsHeight.replace(/[^\d\.]/g,'')" type="text" maxlength="8" @blur="validation(5)"
                  :disabled="isDisabled" v-model="paramData.goodsHeight" size="small" style="width:80px;"></el-input> cm
      </div>
      <div style="margin-top:20px;margin-left:8px;">
        <span>是否菜鸟时效标记：</span>
        <el-radio-group v-model="paramData.timelinessMarkFlag" :disabled="isDisabled">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top:20px;">
        <span><span style="color:red;margin-right:3px;">*</span>是否同步到三方仓：</span>
        <el-radio-group v-model="paramData.thirdPartyStore" :disabled="isDisabled">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </div>
    </el-row>

    <el-collapse style="margin:20px 0 0 10px;" v-model="activeNames" @change="handleChange">
      <el-collapse-item title="相关单品" name="1">
        <el-button type="text" style="margin:0 0 5px 15px;" v-if="!isDisabled" @click="addProductDialog">新增</el-button>
        <div class="border">
          <el-table
            border
            :data="paramData.goodsBeanList"
            @cell-dblclick="celldbClick"
          >
            <el-table-column
              align='center'
              label="序号"
              type="index"
              width="80">
            </el-table-column>
            <el-table-column
              prop=""
              align='center'
              label="图片"
              min-width="">
              <template slot-scope="scope">
                <img :src="scope.row.imageUrl" alt="">
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsCode"
              align='center'
              :show-overflow-tooltip='true'
              label="商品编号"
              min-width="">
            </el-table-column>
            <el-table-column
              prop="barCode"
              align='center'
              min-width=''
              label="条形码">
            </el-table-column>
            <el-table-column
              prop="goodsName"
              label="商品名称"
              min-width=''
              align='center'
              width="">
            </el-table-column>
            <el-table-column prop="skuNum" :render-header="renderHeader" align="center">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit" size="mini" v-model="scope.row.skuNum" @blur="keyupNumSave(scope.row)"></el-input>
                <span v-else>{{scope.row.skuNum}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="salesPrice"
              align='center'
              label="售价"
              width="">
            </el-table-column>
            <el-table-column
              v-if="!isDisabled"
              label="操作"
              align='center'
              width="110">
              <template slot-scope="scope">
                <el-button style="color:red;" type='text' @click="tableDel(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <el-collapse-item title="备用条码" name="4">
        <el-row>
          <el-col :span="7">
            <div class="input-box">
              <div style="margin-top:15px;position:relative;" v-for="(item,i) in barCodeArr">
                <span style="width:80px;text-align:right;display:inline-block;"></span>
                <el-input type="text" maxlength="50"  @keyup.native="item.barCode = item.barCode.replace(/[\u4E00-\u9FA5]/g,'')" placeholder="请输入..."  v-model="item.barCode" :disabled="isDisabled"></el-input>
                <i class="el-icon-circle-plus" @click="addLadder"
                   style="font-size:25px;color:#409EFF;cursor: pointer;position:absolute;margin-left:15px;" v-if="!isDisabled"></i>
                <i class="el-icon-remove" v-if="i!=0 && !isDisabled" @click="reduceLadder(i)"
                   style="font-size:25px;color:#FF2424;margin-left:55px;cursor: pointer;position:absolute;"></i>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="行业属性" name="2">
        <!--行业属性模板-->
        <div style="margin-left:40px;margin-bottom:20px;">
          <span>选择行业属性模板：</span>
          <el-select size='small'
                     v-model="paramData.attributeTmplId"
                     @change="handleAttributeChange"
                     clearable
                     :disabled="isDisabled"
                     placeholder="">
            <el-option
              v-for="item in attributeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="attribute-box" v-if="paramData.attributeTmplId=='BOOK_INDU_TMPL_ID'">
            <p>图书行业属性模板</p>
            <div v-for="(item,i) in industryArr">
              <!--单选-->
              <div v-if="item.attributeType==1" style="width:100%;">
                <span style="margin-top:0;">{{item.attributeName}}：</span>
                <el-radio-group v-model="item.attributeValueId" :disabled="isDisabled" style="display:inline-block;width:600px;">
                  <el-radio v-for="single in item.attributeCodeBeans" :label="single.attributeValueId" :key="single.attributeValueId">{{single.attributeValueName}}</el-radio>
                </el-radio-group>
              </div>
              <!--多选-->
              <div v-if="item.attributeType==2">
                <span style="margin-top:0;float:left;line-height: 35px;">{{item.attributeName}}：</span>
                <el-checkbox-group :disabled="isDisabled" v-model="item.attributeValueId" style="display:inline-block;width:600px;">
                  <el-checkbox v-for="(single,index) in item.attributeCodeBeans" :label="single.attributeValueId" :key="index">{{single.attributeValueName}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <!--单行文本-->
              <div v-if="item.attributeType==3">
                <span>{{item.attributeName}}</span>
                <el-input type="text" :disabled="isDisabled" v-model="item.attributeValue"></el-input>
              </div>
              <!--多行文本-->
              <div v-if="item.attributeType==4" style="width: 100%;">
                <span>{{item.attributeName}}</span>
                <el-input type="textarea" :disabled="isDisabled" v-model="item.attributeValue" maxlength="2000"  placeholder="最大输入2000字符"></el-input>
              </div>
              <!--时间选择器-->
              <div v-if="item.attributeType==5">
                <span>{{item.attributeName}}</span>
                <el-date-picker
                  :disabled="isDisabled"
                  v-model="item.attributeValue"
                  type="date"
                  placeholder="选择日期"
                  format='yyyy-MM-dd'
                  value-format='yyyy-MM-dd'>
                </el-date-picker>
              </div>
              <!--时间区间选择器-->
              <div v-if="item.attributeType==6">
                <span>{{item.attributeName}}</span>
                <!--<el-date-picker
                  v-model="item.attributeValue"
                  type="daterange"
                  :disabled="isDisabled"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format='yyyy-MM-dd'
                  value-format='yyyy-MM-dd'>
                </el-date-picker>-->
                <el-date-picker
                  v-model="item.attributeValue[0]"
                  @change="changePicker('industryArr',item.attributeValue,0,i)"
                  type="date"
                  :disabled="isDisabled"
                  placeholder="开始日期"
                  format='yyyy-MM-dd'
                  value-format='yyyy-MM-dd'>
                </el-date-picker>
                <span style="width: 25px;">到</span>
                <el-date-picker
                  v-model="item.attributeValue[1]"
                  @change="changePicker('industryArr',item.attributeValue,1,i)"
                  type="date"
                  :disabled="isDisabled"
                  placeholder="结束日期"
                  format='yyyy-MM-dd'
                  value-format='yyyy-MM-dd'>
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>

        <el-switch v-if="BatchFlag && false" style="margin-left:40px;"
                   :disabled="isDisabled"
                   v-model="paramData.batchEnabledFlag"
                   active-text="开启批次管理">
        </el-switch>
        <div style="margin-left:40px;" v-if="paramData.batchEnabledFlag&&BatchFlag && false">
          <div style="margin:20px 0;">
            <el-radio-group v-model="paramData.batchType" :disabled="isDisabled">
              <el-radio :label="1">管理批次</el-radio>
              <el-radio :label="2">管理批次保质期</el-radio>
            </el-radio-group>
          </div>
          <div style="margin-bottom:20px;">
            <label for="">批次自动生成规则：</label>
            <el-select size='small' style="width:192px;" v-model="paramData.batchRules" :disabled="isDisabled" placeholder="">
              <el-option
                v-for="item in batchRulesData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div v-if="paramData.batchType==2">
            <div class="industry-date">
              <span>保质期：</span>
              <el-input style="width:80px;" v-model="paramData.expTime" :disabled="isDisabled"></el-input>
              <el-select size='small' style="width:60px;" v-model="paramData.expUnit" :disabled="isDisabled" placeholder="">
                <el-option
                  v-for="item in timeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="industry-date">
              <span>发货提前期：</span>
              <el-input style="width:80px;" v-model="paramData.sendAheadTime" :disabled="isDisabled"></el-input>
              <el-select size='small' style="width:60px;" v-model="paramData.sendAheadUnit" :disabled="isDisabled" placeholder="">
                <el-option
                  v-for="item in timeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="industry-date">
              <span>预警提前期：</span>
              <el-input style="width:80px;" v-model="paramData.warningAheadTime" :disabled="isDisabled"></el-input>
              <el-select size='small' style="width:60px;" v-model="paramData.warningAheadUnit" :disabled="isDisabled" placeholder="">
                <el-option
                  v-for="item in timeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="自定义属性" name="3">
        <el-row>
          <el-col :span="24">
            <div class="input-box">
              <div class="input-box">
                <div style="margin-top:15px;" v-for="(item,i) in attributesArr" class="self-files">
                  <!--单选
                  <div v-if="item.attributeType==1">
                    <span style="margin-top:0;">{{item.attributeName}}</span>
                    <el-select :disabled="isDisabled" size='small'
                               v-model="item.attributeValueId"
                               placeholder="">
                      <el-option
                        v-for="single in item.attributeCodeBeans"
                        :key="single.attributeValueId"
                        :label="single.attributeValueName"
                        :value="single.attributeValueId">
                      </el-option>
                    </el-select>
                  </div>
                  &lt;!&ndash;多选&ndash;&gt;
                  <div v-if="item.attributeType==2">
                    <span style="margin-top:0;">{{item.attributeName}}</span>
                    <el-select :disabled="isDisabled" size='small'
                               multiple
                               collapse-tags
                               v-model="item.attributeValueId"
                               placeholder="">
                      <el-option
                        v-for="single in item.attributeCodeBeans"
                        :key="single.attributeValueId"
                        :label="single.attributeValueName"
                        :value="single.attributeValueId">
                      </el-option>
                    </el-select>
                  </div>-->
                  <!--单选-->
                  <div v-if="item.attributeType==1">
                    <span style="margin-top:0;">{{item.attributeName}}：</span>
                    <el-radio-group v-model="item.attributeValueId" :disabled="isDisabled" style="display:inline-block;width:80%;">
                      <el-radio style="margin:5px 30px 5px 0px;"  v-for="single in item.attributeCodeBeans" :label="single.attributeValueId" :key="single.attributeValueId">{{single.attributeValueName}}</el-radio>
                    </el-radio-group>
                  </div>
                  <!--多选-->
                  <div v-if="item.attributeType==2">
                    <span style="margin-top:0;float:left;line-height: 35px;">{{item.attributeName}}：</span>
                    <el-checkbox-group :disabled="isDisabled" v-model="item.attributeValueId" style="display:inline-block;width:80%;">
                      <el-checkbox style="margin:5px 30px 5px 0px;"  v-for="(single,index) in item.attributeCodeBeans" :label="single.attributeValueId" :key="index">{{single.attributeValueName}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <!--单行文本-->
                  <div v-if="item.attributeType==3">
                    <span>{{item.attributeName}}：</span>
                    <el-input :disabled="isDisabled"  type="text" v-model="item.attributeValue"></el-input>
                  </div>
                  <!--多行文本-->
                  <div v-if="item.attributeType==4" style="width: 100%;">
                    <span>{{item.attributeName}}：</span>
                    <el-input :disabled="isDisabled" type="textarea" v-model="item.attributeValue"></el-input>
                  </div>
                  <!--时间选择器-->
                  <div v-if="item.attributeType==5">
                    <span>{{item.attributeName}}：</span>
                    <el-date-picker
                      v-model="item.attributeValue"
                      type="date"
                      :disabled="isDisabled"
                      placeholder="选择日期"
                      format='yyyy-MM-dd'
                      value-format='yyyy-MM-dd'>
                    </el-date-picker>
                  </div>
                  <!--时间区间选择器-->
                  <div v-if="item.attributeType==6">
                    <span>{{item.attributeName}}：</span>
                    <!--<el-date-picker
                      v-model="item.attributeValue"
                      type="daterange"
                      :disabled="isDisabled"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format='yyyy-MM-dd'
                      value-format='yyyy-MM-dd'>
                    </el-date-picker>-->
                    <el-date-picker
                      v-model="item.attributeValue[0]"
                      @change="changePicker('attributesArr',item.attributeValue,0,i)"
                      type="date"
                      :disabled="isDisabled"
                      placeholder="开始日期"
                      format='yyyy-MM-dd'
                      value-format='yyyy-MM-dd'>
                    </el-date-picker>
                    <span style="width: 25px;">到</span>
                    <el-date-picker
                      v-model="item.attributeValue[1]"
                      @change="changePicker('attributesArr',item.attributeValue,1,i)"
                      type="date"
                      :disabled="isDisabled"
                      placeholder="结束日期"
                      format='yyyy-MM-dd'
                      value-format='yyyy-MM-dd'>
                    </el-date-picker>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item v-if="type==2" title="日志" name="5">
        <public-Log2 :paramObj="paramObj"></public-Log2>
      </el-collapse-item>
    </el-collapse>

    <div class="col-button">
      <el-button style="width:100px;" size="small" @click="showParentBlock">返回</el-button>
      <el-button v-if="type!=2" type="primary" style="width:100px;" size="small" @click="suitSave('ruleForm')">保存</el-button>
      <el-button v-if="type==1" type="primary" style="width:100px;" size="small" @click="suitSave('ruleForm','going')">保存并继续</el-button>
    </div>
    <!--添加产品弹框-->
    <el-dialog v-dialogDrag title="添加相关产品" :close-on-click-modal="false" :visible.sync="dialogAddProduct" width="800px">
      <div class="input-box">
        <el-row>
          <el-col :span="10">
            <div><label for="">商品名称：</label>
              <el-input size='small' v-model="queryData.goodsName" @keyup.enter.native="queryProductBtn"></el-input>
            </div>
          </el-col>
          <el-col :span="10">
            <div><label for="">条形码：</label>
              <el-input size='small' v-model="queryData.barCode" @keyup.enter.native="queryProductBtn"></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button size="small" type="primary" style="width:80px;" @click="queryProductBtn">查询</el-button>
          </el-col>
        </el-row>
        <el-table
          border
          max-height="500"
          :data="addProductData"
          @selection-change="handleSelectionChange"
          style="margin-top:15px;margin-bottom:0;"
        >
          <el-table-column
            align='center'
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align='center'
            label="商品名称"
            width="">
          </el-table-column>
          <el-table-column
            prop="specification"
            align='center'
            min-width=''
            label="规格">
          </el-table-column>
          <el-table-column
            prop="barCode"
            label="条形码"
            min-width=''
            align='center'
            width="">
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
      </div>
      <span slot="footer" class="dialog-footer">
        <!--<el-button size="small"  @click="cancelAddProduct">确定并继续</el-button>-->
        <el-button @click="dialogAddProduct=false">取消</el-button>
        <el-button type="primary" size="small" style="width:80px;" @click="saveAddProduct">确定</el-button>
      </span>
    </el-dialog>
    <!--选择分类弹框-->
    <el-dialog v-dialogDrag
               :close-on-click-modal="false"
               title="分类"
               :visible.sync="classificationDialogVisible">
      <div>
        <el-tree
          style="width: auto"
          :data="bindTreeData"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="treeNodeClick"
        >
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click.prevent="cancleTree">取 消</el-button>
      </span>
    </el-dialog>
    <!--是否更新套装弹框-->
    <el-dialog v-dialogDrag width="550px" :close-on-click-modal="false" title="" :visible.sync="isUpdateDialogVisible">
      <div>
          <div><i style="color:orange;font-size:20px;margin-right:10px;" class="el-icon-warning"></i>是否同步更新订单内的套装商品？</div>
          <div style="color:red;margin:10px 0 10px 30px;">选择更新，订单内的套装单品将更新为修改后的单品sku和数量，请谨慎选择</div>
        <div>
          <label for=""><span style="color:red;margin-right:2px;">*</span>付款时间晚于</label>
          <el-date-picker
            style="width:200px;margin-left:8px;"
            v-model="payTime"
            @change="pickerChange"
            :editable="false"
            :picker-options="pickerOptions"
            value-format='timestamp'
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div>
          <label for="" style="margin:15px 8px 0px 68px;">的</label>
          <multiple-select
            :selectArr="orderStatusList"
            :valueArr="orderStatus"
            @multipleChange="multipleChange1"
            style="width:200px;margin-right:5px;">
          </multiple-select>
          <span>订单</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click.prevent="cancleUpdate">不更新</el-button>
          <el-button type="primary" @click.prevent="updateSave">更 新</el-button>
      </span>
    </el-dialog>
    <!--新任务跳转弹框-->
    <el-dialog v-dialogDrag width="380px" :close-on-click-modal="false" title="" :before-close="handleClose" :visible.sync="newTaskDialogVisible">
      <div>
        <div><i style="color:#66b1ff;font-size:20px;margin-right:10px;" class="el-icon-warning"></i>
          生成更新任务
          <el-button type="text" @click="openTaskCenter">{{newTaskCode}}</el-button>
        </div>
        <div style="color:rgb(169, 169, 169);margin:10px 0 0 30px;">请去任务中心查看更新进度</div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click.prevent="showParentBlockRefresh">知道了</el-button>
      </span>
    </el-dialog>
    <div class="fh-loading" v-if="loading" v-loading="loading" element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"></div>
  </div>
</template>

<script>
  import PublicLog2 from '@/components/common/PublicLog2.vue';
  import {keepOneBits,returnFloat,turnTimestamp, returnTimesStamp, priceValidator, positiveIntegerValidator ,keepFourBits,validateSpelCharacter} from '@/assets/js/validate.js';
  export default {
    components:{
      PublicLog2 //公共日志表格
    },
    name: '',
    props:{
      params:Object
    },
    data() {
      //表单校验
      var goodsName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入商品名称'));
        }
        /*if (validateSpelCharacter(value)) {
          callback(new Error('商品名称不能包含特殊字符'));
        }*/ else {
          callback();
        }
      };
      var goodsCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入商品编号'));
        }
        if (/[\u4E00-\u9FA5]/g.test(value)) {/* !(/^[0-9A-Za-z]*$/.test(value)) */
          callback(new Error('商品编号不能输入汉字！'));
        } else {
          callback();
        }
      };
      var barCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入条形码'));
        }
        if (/[\u4E00-\u9FA5]/g.test(value)) {/* !(/^[0-9A-Za-z]*$/.test(value)) || !(/\d+/.test(value)) */
          callback(new Error('条形码不能输入汉字！'));
        } else {
          callback();
        }
      };
      var articleNumber = (rule, value, callback) => {
        if (!(/^[0-9A-Za-z\u4e00-\u9fa5]*$/.test(value))) {
          callback(new Error('厂家货号只能是数字字母或汉字'));
        } else {
          callback();
        }
      };
      return {
        pickerOptions: {  //时间选择区间
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        loading:false,
        newTaskCode:'',//任务编号
        payTime:"",//付款时间
        orderStatusList:[{
          label:'待客审',
          value:'1'
        },{
          label:'已客审',
          value:'2'
        }],//订单状态集合
        orderStatusObj:{
          '1':'待客审',
          '2':'已客审'
        },
        orderStatus:[],//订单状态value
        isUpdateDialogVisible:false,//是否更新套装弹框
        newTaskDialogVisible:false,//新任务跳转弹框
        paramObj:{
          moduleId:'21',
          billCode:this.params.skuId
        },//公共日志参数
        rules: {
          goodsCode: [
            { required: true,validator: goodsCode, trigger: 'blur' }
          ],
          barCode: [
            { required: true,validator: barCode, trigger: 'blur' }
          ],
          goodsName: [
            { required: true, validator: goodsName, trigger: 'blur' }
          ],
          articleNumber: [
            { validator: articleNumber, trigger: 'blur' }
          ],
          goodsShortName:{ min: 0, max: 50, message: '商品简称长度不能超过50个字符', trigger: 'blur' },
          specification:{ min: 0, max: 50, message: '商品规格不能超过50个字符', trigger: 'blur' },
          salesPrice:[{ required: true, message: '售价不能为空', trigger: 'blur' }],
          suttle:{ min: 0, max: 20, message: '商品净重不能超过20个字符', trigger: 'blur' },
        },//表单校验规则
        isDisabled:false,//是否禁用
        titleName:'新建',
        version: '1.0.0',
        barCodeArr:[
          {
            barCode:''
          }
        ],//备用条形码
        dialogAddProduct:false,//添加商品弹框
        addProductData:[],//添加商品data
        currentPage:1,
        totalPage:15,
        totalNum:0,
        paramData:{
          timelinessMarkFlag:false,
          thirdPartyStore:'2',
          batchEnabledFlag:false,
          articleNumber:'',
          goodsLength:'',
          goodsWidth:'',
          goodsHeight:'',
          goodsCode:'',
          barCode:'',
          goodsName:'',
          goodsShortName:'',
          specification:'',
          salesPrice:'',
          suttle:'',
          binRatio:'',
          sendStorageId:'',
          goodsBeanList:[],
          brandId:'',
          catalogId:''
        },//添加套装参数
        brandIdArr:[],//品牌集合
        catalogIdProps:{
          label: 'privilegeName',
          value:'catalogId',
          children: 'nodes'
        },
        planIdArr:[],//智能仓库集合
        picUrlList:[
          {
            imageUrl:'',
            showDel:false
          },
          {
            imageUrl:'',
            showDel:false
          },
          {
            imageUrl:'',
            showDel:false
          },
          {
            imageUrl:'',
            showDel:false
          },
          {
            imageUrl:'',
            showDel:false
          }
        ],//添加图片集合
        imageUrl:'',//添加图片url
        goodsId:this.params.skuId,//商品id
        type:this.params.type,//添加 修改 查看
        activeNames: [],
        popoverShow:false,//添加图片按钮显示
        attributesArr:[],  //自定义属性arr
        selectionData:[],//表格选中项
        queryData:{
          issuit:true,
          goodsName:'',
          barCode:'',
          page:1,
          size:15
        },//表格查询条件
        batchRulesData:[
          {
            label:'生产日期+流水号',
            value:1
          },
          {
            label:'入库日期+流水号',
            value:2
          },
          {
            label:'生产日期+供应商编号+流水号',
            value:3
          },
          {
            label:'入库日期+供应商编号+流水号',
            value:4
          }
        ],//批次自动生成规则集合
        timeArr:[
          {
            label:'日',
            value:1
          },
          {
            label:'月',
            value:2
          },
          {
            label:'年',
            value:3
          }
        ],//年月日集合
        industryArr:[],//图书行业属性模板
        attributeData:[
          {
            label:'图书行业',
            value:'BOOK_INDU_TMPL_ID'
          }
        ],//行业属性模板
        BatchFlag:false,//是否开启批次
        classificationDialogVisible:false,//分类弹框
        bindTreeData:[],//分类树
        defaultProps: {
          children: 'nodes',
          label: 'privilegeName'
        },
        chooseClassifyBtn:'',//分类显示文字
        classifyMatchArr:[],//分类匹配集合
        storeParamData:{},//修改入参存储
      }
    },
    watch:{
    },
    methods: {
      //多选下拉组件（订单状态）
      multipleChange1(value) {
        this.orderStatus = value;
      },
      pickerChange(){
        if(this.payTime > new Date().getTime()){
          this.$message({
            message: '付款时间不能晚于当前服务器时间，请重新选择！',
            type: 'warning'
          });
          this.payTime = '';
        }
      },
      //不更新
      cancleUpdate(){
        this.suitModifyFn();
      },
      //更新
      updateSave(){
        if(!this.payTime){
          this.$message({
            message: '请选择付款时间',
            type: 'warning'
          });
          return false;
        }
        if(this.orderStatus.length == 0){
          this.$message({
            message: '请选择订单类型',
            type: 'warning'
          });
          return false;
        }
        var orderStatus = [],orderStatusName = '';
        if(this.orderStatus.length == this.orderStatusList.length){
          orderStatusName = '全部';
        }else{
          this.orderStatus.forEach(item => {
            orderStatus.push(this.orderStatusObj[item]);
          })
          orderStatusName = orderStatus.join(',');
        }

        this.$confirm('确定更新付款时间晚于'+ turnTimestamp(this.payTime) +'的'+ orderStatusName +'订单？<span style="color:red;">更新成功后不可恢复</span>，你还要继续吗？', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isUpdateDialogVisible = false;
          this.loading = true;
          this.suitModifyFn('fanhu');
          this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/getTaskCode').then(response => {
            if (response.data.success) {
              this.newTaskCode = response.data.result?response.data.result:'';
              this.newTaskDialogVisible = true;
              this.loading = false;
              //获取任务编号
              this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/taskPlanCreate',{
                payTime:this.payTime,
                orderStatus:this.orderStatus.join(','),
                goodsId:this.paramData.goodsId,
                taskCode:this.newTaskCode
              }).then(response => {
                if (response.data.success) {

                } else {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {

        });
      },
      //打开任务中心
      openTaskCenter(){
        $(parent.document.querySelector('#taskCenter')).click();
      },
      handleClose(done) {
        setTimeout(()=>{
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        },300)
        this.showParentBlockRefresh();
        done();
      },
      //选择分类
      chooseClassify(value) {
        if(this.isDisabled)return false;
        var self = this;
        this.classificationDialogVisible = true;
        self._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + self.version + '/listTree').then(response => {
          if (response.data.success) {
            this.bindTreeData = response.data.result
          } else {
            self.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //选择树节点
      treeNodeClick(treeObj){
        if(treeObj.nodes && treeObj.nodes.length>0){
          this.$message({
            message: "不能选择父节点",
            type: 'warning'
          });
        }else{
          this.chooseClassifyBtn = treeObj.privilegeName;
          this.paramData.catalogId=treeObj.catalogId;
          this.classificationDialogVisible=false;
        }
      },
      //清除分类
      clearCalalogId(){
        this.chooseClassifyBtn = '';
        this.paramData.catalogId = '';
      },
      //关闭树节点弹框
      cancleTree(){
        this.classificationDialogVisible = false;
      },
      //多选下拉组件（品牌）
      multipleChange(value) {
        this.paramData.brandId = value;
      },
      //组件回传
      showParentBlock(clockBlock) {
        this.$emit('changeShow')
      },
      showParentBlockRefresh(){
        this.$emit('changeShow',{isRefresh:true});
      },
      //改变日期
      changePicker(name,value,item,i){
        if(value[0] && value[1] && value[0] > value[1]){
          this.$set(this[name][i].attributeValue,item,'');
          this.$message({
            message: '开始时间不能大于结束时间！',
            type: 'warning'
          });
        }
      },
      //表单验证
      validation(item) {
        switch (item) {
          case 1 :
            this.paramData.salesPrice=priceValidator(this.paramData.salesPrice);
            break;
          case 2 :
            this.paramData.suttle=priceValidator(this.paramData.suttle);
            break;
          case 3 :
            this.paramData.goodsLength=keepOneBits(this.paramData.goodsLength);
            break;
          case 4 :
            this.paramData.goodsWidth=keepOneBits(this.paramData.goodsWidth);
            break;
          case 5 :
            this.paramData.goodsHeight=keepOneBits(this.paramData.goodsHeight);
            break;
          case 6 :
            if(this.paramData.binRatio == 0){this.paramData.binRatio = '';}
            break;
        }
      },
      renderHeader(createElement, { _self }) {
        return createElement(
          'span',
          {
            'style':'font-weight:bold;'
          },
          [
            createElement('span', ['数量']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-edit',
                'style':'font-weight:bold;margin-left:5px;'
              }
            )
          ]
        );
      },
      //双击单元格
      celldbClick(row, column, cell, event){
        if(column.property=="skuNum" && !this.isDisabled){
          row.isEdit=true;
        }
      },
      //单元格保存
      keyupNumSave(row,index){
        row.skuNum=positiveIntegerValidator(row.skuNum);
        row.isEdit=false;
        this.calculateWeight();
      },
      //上传图片
      addImgBtn(){
        /*function CheckImgExists(imageUrl) {
          var ImgObj = new Image(); //判断图片是否存在
          ImgObj.src = imageUrl;
          //没有图片，则返回-1
          if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
            return true;
          } else {
            return false;
          }
        }
        var ImgObj = new Image();
        ImgObj.src = this.imageUrl;
        console.log(ImgObj.fileSize);
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
          console.log(111);
        } else {
          console.log(0);
        }
        return false;*/
        //http://a.hiphotos.baidu.com/image/pic/item/d0c8a786c9177f3e2fb5a1987ccf3bc79e3d56a5.jpg
        if(this.imageUrl.trim()==''){
          this.$message({
            message: '请输入图片路径',
            type: 'warning'
          });
          return false;
        }
        var imgSuffix=this.imageUrl.split('.');
        if (imgSuffix[imgSuffix.length-1] != 'gif' && imgSuffix[imgSuffix.length-1] != 'png' && imgSuffix[imgSuffix.length-1] != 'jpg') {
          this.$message({
            message: '图片类型为gif、png、jpg格式',
            type: 'warning'
          });
          return false;
        }
        var index=-1;
        this.picUrlList.forEach((item,i)=>{
          if(item.imageUrl=='' && index==-1){
            index = i;
          }
        });
        if(index<5 && index!=-1){
          this.picUrlList[index].imageUrl=this.imageUrl;
        }else{
          this.$message({
            message: '最多添加五张图片',
            type: 'warning'
          });
        }
      },//https://img.alicdn.com/imgextra/i8/TB1oTx2GFXXXXb.XFXXW8xU.VXX_111459.jpg
      //图片划入
      mouseenterImg(e,item){
        //console.log(e,item);
        item.showDel=true;
      },
      //图片划出
      mouseoutImg(e,item){
        if(e.relatedTarget.tagName !== 'I'){
          item.showDel=false;
        }
      },
      //图片左移
      leftRemove(i,item){
        if(i != 0){
          this.picUrlList.splice(i,1);
          this.picUrlList.splice(i-1,0,item);
        }
      },
      //图片右移
      rightRemove(i,item){
        if(this.picUrlList[i+1] && this.picUrlList[i+1].imageUrl != ''){
          this.picUrlList.splice(i,1);
          this.picUrlList.splice(i+1,0,item);
        }
      },
      //删除图片
      deleteImg(i){
        this.picUrlList.splice(i,1);
        this.picUrlList.push({imageUrl:"",showDel:false});
      },
      //添加图片按钮显示
      popoverShowBtn(){
        this.imageUrl='';
        this.popoverShow=true;
      },
      //添加图片按钮关闭
      cancelImgBtn(){
        this.popoverShow=false;
      },
      //添加备用条形码
      addLadder(){
        if(this.barCodeArr.length<10){
          this.barCodeArr.push( {
            barCode:''
          })
        }else{
          this.$message({
            message: '最多允许添加10个备用条形码',
            type: 'warning'
          });
        }
      },
      //删除备用条形码
      reduceLadder(index){
        this.barCodeArr.splice(index,1);
      },
      handleSelectionChange(val){
        this.selectionData = val;
      },
      handleSizeChange(val) {
        this.queryData.size = val;
        sessionStorage.setItem('hold_b_3_2',val);
        this.queryProductBtn();
      },
      handleCurrentChange(val) {
        this.queryData.page = val;
        this.queryProductBtn();
      },
      //添加商品列表
      queryProductBtn(){
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/query',this.queryData).then((response)=>{
          if (response.data.success) {
            response.data.result.rows.forEach((item,i)=>{
              item.isEdit=false;
              item.imageUrl=item.goodsImageBean?item.goodsImageBean.imageUrl:'';
            })
            this.addProductData=response.data.result.rows;
            this.totalNum=response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //添加商品弹框显示
      addProductDialog(){
        //初始化每页数量
        if(sessionStorage.getItem('hold_b_3_2')!=null){
          this.totalPage=parseInt(sessionStorage.getItem('hold_b_3_2'));
        }
        this.queryData.goodsName='';
        this.queryData.barCode='';
        this.queryData.size=this.totalPage;
        this.dialogAddProduct=true;
        this.queryProductBtn();
      },
      //添加商品保存
      saveAddProduct(){
        if(this.selectionData.length==0){
          this.$message({
            message: '请选择要添加的商品！',
            type: 'warning'
          });
          return false;
        }else{
          var mapArr=new Map(),isPass=false;
          this.paramData.goodsBeanList.forEach((item,i)=>{
            mapArr.set(item.goodsId,item);
          })
          this.selectionData.forEach((item,i)=>{
            item.skuNum=1;
            if(!mapArr.get(item.goodsId)){
              this.paramData.goodsBeanList.push(item);
              isPass=true;
            }
          })
          if(!isPass){
            this.$message({
              message: '此商品已添加，请勿重复添加',
              type: 'warning'
            });
          }
          this.calculateWeight();
          this.dialogAddProduct=false;
        }
      },
      //计算净重
      calculateWeight(){
        var num = 0,num2 = 0;
        this.paramData.goodsBeanList.forEach(item =>{
          item.suttle = item.suttle?item.suttle:0;
          item.salesPrice = item.salesPrice?item.salesPrice:0;
          num += item.suttle*item.skuNum;
          num2 += item.salesPrice*item.skuNum;
        }),
        this.$set(this.paramData,'suttle',num.toFixed(2));
        this.$set(this.paramData,'salesPrice',num2.toFixed(2));

        console.log(this.paramData.suttle);
        var third = this.paramData.goodsCode;
        this.paramData.goodsCode = '';
        this.paramData.goodsCode = third;
      },
      //table列表删除
      tableDel(index,row){
        this.paramData.goodsBeanList.splice(index,1);
        this.calculateWeight();
      },
      //添加商品保存并继续
      cancelAddProduct(){
        this.saveAddProduct();
        this.queryProductBtn();
      },
      handleChange(val) {
        //console.log(val);
      },
      //套装保存
      suitSave(formName,type){
        this.paramData.goodsName=this.paramData.goodsName.trim();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //处理图片列表
            this.picUrlList.forEach((item,i)=>{
              item.pri=i;
            })
            this.paramData.DtGoodsImagePOList = JSON.stringify(this.picUrlList);
            //处理保质期、发货期前期、预警提前期
            if(!this.paramData.batchEnabledFlag || this.paramData.batchType==1){
              this.paramData.expTime='';
              this.paramData.expUnit='';
              this.paramData.sendAheadTime='';
              this.paramData.sendAheadUnit='';
              this.paramData.warningAheadTime='';
              this.paramData.warningAheadUnit='';
            }
            if(!this.paramData.thirdPartyStore){
              this.$message({
                message: '是否同步到三方仓必选',
                type: 'warning'
              });
              return false;
            }
            //处理table表格
            var skuIdList=[],skuNumList=[];
            var isPass2 = false;
            this.paramData.goodsBeanList.forEach((item,i)=>{
              skuIdList.push(item.goodsId);
              skuNumList.push(item.skuNum);
              if(item.skuNum == 0 || !item.skuNum){
                isPass2 = true;
              }
            })
            if(isPass2){
              this.$message({
                message: '单品数量为必填且不能为0！',
                type: 'warning'
              });
              return false;
            }
            this.paramData.goodsIdList=JSON.stringify(skuIdList);
            this.paramData.goodsNumList=JSON.stringify(skuNumList);

            //处理自定义档案
            var attributesArr=[];
            this.attributesArr.forEach((item,i)=>{
              attributesArr.push({});
              attributesArr[i].attributeId=item.attributeId;
              if(item.attributeType==1){
                attributesArr[i].attributeValueId=item.attributeValueId?item.attributeValueId:'';
              }else if(item.attributeType==2){
                attributesArr[i].attributeValueId=item.attributeValueId?item.attributeValueId.join(','):'';
              }else if(item.attributeType==3 || item.attributeType==4 || item.attributeType==5 || item.attributeType==6){
                attributesArr[i].attributeValue=item.attributeValue?item.attributeValue:'';
              }
            })
            //处理行业模板
            var industryArr=[];
            this.industryArr.forEach((item,i)=>{
              industryArr.push({});
              industryArr[i].attributeId=item.attributeId;
              if(item.attributeType==1){
                industryArr[i].attributeValueId=item.attributeValueId?item.attributeValueId:'';
              }else if(item.attributeType==2){
                attributesArr[i].attributeValueId=item.attributeValueId?item.attributeValueId.join(','):'';
              }else if(item.attributeType==3 || item.attributeType==4 || item.attributeType==5 || item.attributeType==6){
                industryArr[i].attributeValue=item.attributeValue?item.attributeValue:'';
              }
            })
            var concatArr= attributesArr.concat(industryArr);
            this.paramData.GoodsAttributeSaveBeanList=JSON.stringify(concatArr);
            //处理备用条码
            var goodsStandbyBarCodeList=[];
            var isPass=true;
            this.barCodeArr.forEach((item,i)=>{
              if(item.barCode){
                goodsStandbyBarCodeList.push(item.barCode);
              }
              if(item.barCode==''||item.barCode==undefined){
                isPass=true;
              } else if (/[\u4E00-\u9FA5]/g.test(item.barCode)) {
                isPass=false;
              }
            })
            this.paramData.goodsStandbyBarCodeList=JSON.stringify(goodsStandbyBarCodeList);
            if(!isPass){
              this.$message({
                message: '备用条形码不能输入汉字！',
                type: 'warning'
              });
              return false;
            }
            //分类
            //this.paramData.catalogId
            console.log(this.paramData);
            var paramData = JSON.parse(JSON.stringify(this.paramData));
            paramData.goodsLength*=10;
            paramData.goodsWidth*=10;
            paramData.goodsHeight*=10;
            if(this.type==1 || this.type==4){//新建 复制
              paramData.goodsId='';
              this._post('com.edb01.erp.mdata.service.api.SuitService/'+this.version+'/insert',paramData).then((response)=>{
                if(response.data.success){
                  setTimeout(()=>{
                    if(this.type==1){
                      this.$message({
                        message: '保存成功',
                        type: 'success'
                      });
                    }else{
                      this.$message({
                        message: '复制成功',
                        type: 'success'
                      });
                    }

                  },300)
                  if(this.type==1 && type=='going'){
                    this.imageUrl = '';
                    this.paramData={
                      DtGoodsImagePOList:'',
                      GoodsAttributeSaveBeanList:'',
                      goodsStandbyBarCodeList:'',
                      goodsType:1,
                      timelinessMarkFlag:false,
                      thirdPartyStore:'2',
                      batchEnabledFlag:true,
                      goodsLength:'',
                      goodsWidth:'',
                      goodsHeight:'',
                      goodsCode:'',
                      barCode:'',
                      goodsName:'',
                      goodsShortName:'',
                      specification:'',
                      salesPrice:'',
                      suttle:'',
                      binRatio:'',
                      sendStorageId:'',
                      goodsBeanList:[],
                      brandId:'',
                      catalogId:'',
                      expUnit:'',
                      sendAheadUnit:'',
                      warningAheadUnit:''
                    }
                    this.barCodeArr=[{barCode:''}];
                    this.picUrlList=[
                      {
                        imageUrl:'',
                        showDel:false
                      },
                      {
                        imageUrl:'',
                        showDel:false
                      },
                      {
                        imageUrl:'',
                        showDel:false
                      },
                      {
                        imageUrl:'',
                        showDel:false
                      },
                      {
                        imageUrl:'',
                        showDel:false
                      }
                    ];
                    //自定义属性
                    this._post( 'com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/selectGoodsAttribute').then((response)=>{
                      if (response.data.success) {
                        response.data.result = response.data.result?response.data.result:[];
                        response.data.result.forEach((item,i)=>{
                          if(item.attributeType==1){
                            item.attributeValueId='';
                          }else if(item.attributeType==2){
                            item.attributeValueId=[];
                          }else{
                            item.attributeValue='';
                          }
                        })
                        this.attributesArr=response.data.result;
                      } else {
                        this.$message({
                          message: response.data.msg,
                          type: 'warning'
                        });
                      }
                    })
                  }else{
                    //this.$router.push({path: '/suit'});
                    this.$emit('changeShow',{isRefresh:true});
                  }
                }else{
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            }else if(this.type==3){//修改
              //判断是否可以更新套装
              this._post('com.edb01.erp.mdata.service.api.SuitService/'+this.version+'/getSuitLockState',{
                goodsId:this.paramData.goodsId,
                updateTime:this.paramData.updateTime
              }).then((response)=>{
                if(response.data.success){
                  //套装未锁定继续操作
                  //套装修改明细判断是否触发修改订单明细
                  this._post('com.edb01.erp.mdata.service.api.SuitService/'+this.version+'/triggerSuitOrderUpdate',{
                    goodsIdList:paramData.goodsIdList,
                    goodsNumList:paramData.goodsNumList,
                    goodsId:paramData.goodsId,
                    goodsCode:paramData.goodsCode,
                    barCode:paramData.barCode,
                    goodsName:paramData.goodsName,
                  }).then((response)=>{
                    if(response.data.success){
                      this.storeParamData = JSON.parse(JSON.stringify(paramData));
                      if(response.data.code == 1){
                        this.orderStatus = ['1','2'];
                        this.isUpdateDialogVisible = true;
                      }else{
                        this.suitModifyFn();
                      }
                    }else{
                      this.$message({
                        message: response.data.msg,
                        type: 'warning'
                      });
                    }
                  })
                }else{
                  //套装已锁定
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            }else{//查看
              this.$emit('changeShow');
            }
          } else {
            return false;
          }
        });
      },
      suitModifyFn(flag){
        this._post('com.edb01.erp.mdata.service.api.SuitService/'+this.version+'/update',this.storeParamData).then((response)=>{
          if(response.data.success){
            if(flag)return false;
            setTimeout(()=>{
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            },300)
            this.$emit('changeShow',{isRefresh:true});
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //套装返回
      suitCancel(){
        this.$router.push({path: '/suit'});
      },
      //行业模板改变
      handleAttributeChange(){
        //行业模板回显
        var self=this;
        if(self.paramData.attributeTmplId){
          self._post('com.edb01.erp.mdata.service.api.AttributeTmplService/' + self.version + '/getInduAttributeBeanList',{
            attributeTmplId:self.paramData.attributeTmplId
          }).then((response)=>{
            if(response.data.success){
              response.data.result = response.data.result?response.data.result:[];
              response.data.result.forEach((item,i)=>{
                if(item.attributeType==1){
                  item.attributeValueId=item.defaultAttributeId?item.defaultAttributeId:'';
                }else if(item.attributeType==2){
                  item.attributeValueId=item.defaultAttributeId?item.defaultAttributeId.split(','):[];
                }else if(item.attributeType==6){
                  item.attributeValue=['',''];
                }else{
                  item.attributeValue='';
                }
              })
              self.industryArr=response.data.result;
            }else{
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      }
    },mounted(){
      /*判断 新建 查看 修改 复制 页面*/
      if(this.type==1){
        this.titleName='新建';
        $('.first-focus input').focus();
      }else if(this.type==2){
        this.titleName='查看';
        this.isDisabled=true;
      }else if(this.type==3){
        this.titleName='修改';
      }else if(this.type==4){
        this.titleName='复制';
      }
      var self=this;
      function echoFn(){
        self._post('com.edb01.erp.mdata.service.api.SuitService/'+self.version+'/echo',{goodsId:self.goodsId}).then((response)=>{
          if(response.data.success){
            response.data.result.goodsBeanList=response.data.result.goodsBeanList?response.data.result.goodsBeanList:[];
            response.data.result.goodsBeanList.forEach((item,i)=>{
              item.isEdit=false;
              item.skuNum=response.data.result.goodsNumList[i];
              if(item.goodsImageBean)item.imageUrl=item.goodsImageBean.imageUrl;
            })

            if(response.data.result.goodsExtendBean){
              response.data.result.expUnit=response.data.result.goodsExtendBean.expUnit;
              response.data.result.sendAheadUnit=response.data.result.goodsExtendBean.sendAheadUnit;
              response.data.result.warningAheadUnit=response.data.result.goodsExtendBean.warningAheadUnit;
            }
            response.data.result.batchType = response.data.result.batchType?response.data.result.batchType:'';
            response.data.result.binRatio = response.data.result.binRatio?response.data.result.binRatio:'';
            response.data.result.thirdPartyStore = response.data.result.thirdPartyStore?response.data.result.thirdPartyStore + '':'';
            self.paramData=response.data.result;
            self.paramData.goodsLength = self.paramData.goodsLength?self.paramData.goodsLength/10:'';
            self.paramData.goodsWidth = self.paramData.goodsWidth?self.paramData.goodsWidth/10:'';
            self.paramData.goodsHeight = self.paramData.goodsHeight?self.paramData.goodsHeight/10:'';
            self.paramData.suttle = self.paramData.suttle?self.paramData.suttle:'';
            /*self.paramData.goodsLength=self.paramData.goodsLength?self.paramData.goodsLength:'';
            self.paramData.goodsWidth=self.paramData.goodsWidth?self.paramData.goodsWidth:'';
            self.paramData.goodsHeight=self.paramData.goodsHeight?self.paramData.goodsHeight:'';*/
            //salesPrice
            /*self.paramData.salesPrice=self.paramData.salesPrice?self.paramData.salesPrice+'':'';
            self.paramData.suttle = self.paramData.suttle?self.paramData.suttle+'':'';*/

           /* self.paramData.goodsBeanList.forEach((item,i)=>{
              item.skuNum=self.paramData.goodsNumList[i];
              if(item.goodsImageBean)item.imageUrl=item.goodsImageBean.imageUrl;
            })*/
            //行业模板回显
            if(self.paramData.attributeTmplId)industryTemplate();
            //回显图片
            self.picUrlList.forEach((item,i)=>{
              if(self.paramData.dtGoodsImageBeanList[i]){
                self.picUrlList[i].imageUrl=self.paramData.dtGoodsImageBeanList[i].imageUrl;
                self.picUrlList[i].pri=self.paramData.dtGoodsImageBeanList[i].pri;
              }
            })
            self.picUrlList.sort((a,b)=>{
              return a.pri-b.pri;
            })

            //匹配分类
            self.classifyMatchArr.forEach((item,i)=>{
              if(item.catalogId == self.paramData.catalogId){
                self.chooseClassifyBtn=item.catalogName;
              }
            })

            //回显自定义属性
            var mapArr=new Map();
            self.paramData.goodsAttributeShowBeanList.forEach((item,i)=>{
              mapArr.set(item.attributeId,item);
            })
            self.attributesArr.forEach((item,i)=>{
              if(mapArr.get(item.attributeId)){
                if(item.attributeType==1){//选项;
                  item.attributeValueId = mapArr.get(item.attributeId).attributeValueId;
                }else if(item.attributeType==2){
                  item.attributeValueId = mapArr.get(item.attributeId).attributeValueId?mapArr.get(item.attributeId).attributeValueId.split(','):[];
                }else if(item.attributeType==3 || item.attributeType==4 || item.attributeType==5){//文本
                  item.attributeValue = mapArr.get(item.attributeId).attributeValue;
                }else if(item.attributeType==6){
                  item.attributeValue = JSON.parse(mapArr.get(item.attributeId).attributeValue);
                }
              }
            })
            //回显保质期、发货期前期、预警提前期 goodsExtendBean
            if(self.paramData.expTime){
              switch(self.paramData.expUnit){
                case 1:
                  self.paramData.expTime=self.paramData.expTime/86400;
                  break;
                case 2:
                  self.paramData.expTime=self.paramData.expTime/2592000;
                  break;
                case 3:
                  self.paramData.expTime=self.paramData.expTime/31104000;
                  break;
              }
            }
            if(self.paramData.sendAheadTime){
              switch(self.paramData.sendAheadUnit){
                case 1:
                  self.paramData.sendAheadTime=self.paramData.sendAheadTime/86400;
                  break;
                case 2:
                  self.paramData.sendAheadTime=self.paramData.sendAheadTime/2592000;
                  break;
                case 3:
                  self.paramData.sendAheadTime=self.paramData.sendAheadTime/31104000;
                  break;
              }
            }
            if(self.paramData.warningAheadTime){
              switch(self.paramData.warningAheadUnit){
                case 1:
                  self.paramData.warningAheadTime=self.paramData.warningAheadTime/86400;
                  break;
                case 2:
                  self.paramData.warningAheadTime=self.paramData.warningAheadTime/2592000;
                  break;
                case 3:
                  self.paramData.warningAheadTime=self.paramData.warningAheadTime/31104000;
                  break;
              }
            }

            //回显备用条码
            if(self.type!=4){
              self.paramData.goodsStandbyBarBeanList.forEach((item,i)=>{
                if(i!=0){
                  self.barCodeArr.push({});
                }
                self.barCodeArr[i].barCode=item.barValue;
              })
            }
          }else{
            self.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
      //智能仓库
      this._post('com.edb01.erp.wms.service.api.WmInStorageService/'+this.version+'/echoWmAssignStorage').then((response)=>{
        if(response.data.success){
          this.planIdArr=response.data.result;
        }else{
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      })
      //自定义属性
      this._post( 'com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/selectGoodsAttribute').then((response)=>{
        if (response.data.success) {
          response.data.result = response.data.result?response.data.result:[];
          response.data.result.forEach((item,i)=>{
            if(item.attributeType==1){
              item.attributeValueId=item.defaultAttributeId?item.defaultAttributeId:'';
            }else if(item.attributeType==2){
              item.attributeValueId=item.defaultAttributeId?item.defaultAttributeId.split(','):[];
            }else if(item.attributeType==6){
              item.attributeValue=['',''];
            }else{
              item.attributeValue='';
            }
          })
          this.attributesArr=response.data.result;
          if(this.type!=1){
            echoFn();
          }
        } else {
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      })
      //行业模板
      function industryTemplate(){
        self._post('com.edb01.erp.mdata.service.api.AttributeTmplService/' + self.version + '/getInduAttributeBeanList',{
          attributeTmplId:self.paramData.attributeTmplId
        }).then((response)=>{
          if(response.data.success){
            //回显行业模板value
            if(self.type!=1){
              getIndustryTemplate(response.data.result);
            }else{
              response.data.result = response.data.result?response.data.result:[];
              response.data.result.forEach((item,i)=>{
                if(item.attributeType==1){
                  item.attributeValueId=item.defaultAttributeId?item.defaultAttributeId:'';
                }else if(item.attributeType==2){
                  item.attributeValueId=item.defaultAttributeId?item.defaultAttributeId.split(','):[];
                }else if(item.attributeType==6){
                  item.attributeValue=['',''];
                }else{
                  item.attributeValue='';
                }
              })
              self.industryArr=response.data.result;
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
      function getIndustryTemplate(params){
        self._post('com.edb01.erp.mdata.service.api.AttributeTmplService/' + self.version + '/getListGoodsAttribute',{
          attributeTmplId:self.paramData.attributeTmplId,
          goodsId:self.goodsId
        }).then((response)=>{
          if(response.data.success){
            //回显行业模板
            var mapArr=new Map();
            response.data.result = response.data.result?response.data.result:[];
            response.data.result.forEach((item,i)=>{
              mapArr.set(item.attributeId,item);
            })
            params.forEach((item,i)=>{
              if(mapArr.get(item.attributeId)){
                if(item.attributeType==1){//选项;
                  item.attributeValueId = mapArr.get(item.attributeId).attributeValueId;
                }else if(item.attributeType==2){
                  item.attributeValueId = mapArr.get(item.attributeId).attributeValueId?mapArr.get(item.attributeId).attributeValueId.split(','):[];
                }else if(item.attributeType==3 || item.attributeType==4 || item.attributeType==5){//文本
                  item.attributeValue = mapArr.get(item.attributeId).attributeValue;
                }else if(item.attributeType==6){
                  item.attributeValue = JSON.parse(mapArr.get(item.attributeId).attributeValue);
                }
              }
            })
            self.industryArr=params;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
      //是否开启批次
      this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryBatchFlag').then((response) => {
        if (response.data.success) {
          this.BatchFlag=response.data.result?response.data.result.batchFlag:[];
        } else {
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      })
      //品牌
      this._post('com.edb01.erp.mdata.service.api.BrandService/' + this.version + '/list').then((response) => {
        if (response.data.success) {
          response.data.result = response.data.result?response.data.result:[];
          response.data.result.forEach(item => {
            item.label = item.brandName;
            item.value = item.brandId;
          })
          this.brandIdArr = response.data.result;
        } else {
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      })
      //分类匹配
      this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + self.version + '/list').then(response => {
        if (response.data.success) {
          this.classifyMatchArr=response.data.result;
        } else {
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      })
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .input-box .el-input {
    width: 200px;
  }
  .input-box .el-select {
    width: 200px;
  }
  .input-box>div{
    margin-bottom:20px;
  }
  .input-box>div>span{
    display:inline-block;
    width:80px;
    text-align:right;
  }
  .img-box{
    width:600px;
    display:inline-block;
    height:90px;
  }
  .img-box .icon-box{
    width:100%;
    height:25px;
    position:absolute;
    bottom:-28px;
  }
  .img-box .icon-box i{
    font-size:10px;
    font-weight:bold;
    margin-top:5px;
    cursor: pointer;
    color:#ccc;
  }
  .img-box>div{
    width: 80px;
    height:80px;
    line-height:77px;
    border:1px solid #ccc;
    float:left;
    margin-right:10px;
    border-radius:5px;
    text-align: center;
    vertical-align: middle;
    /*display: flex !important;*/
    align-items: center;
    justify-content: center;
  }
  .img-box>div>img{
    width: auto;
    max-width:76px;
    height: auto;
    max-height: 76px;
  }
  .img-box>div>i{
    font-size:25px;
    color:#ccc;
  }
  .icon-box .el-icon-arrow-left{
    float:left;margin-left:27px;
  }
  .icon-box .el-icon-arrow-right{
    float:right;margin-right:27px;
  }
  .attribute-box{
    margin-top:20px;width:900px;background:#F2F2F2;padding:20px;
  }
  .attribute-box>div{
    margin-top:15px;
    display:inline-block;
  }
  .attribute-box>div>div{
    width: 400px;
  }
  .attribute-box>div>div>span{
    float:left;
    width:120px;
    margin-right:20px;
    margin-top:3px;
    text-align:right;
  }
  .attribute-box>div .el-input{
    width:200px;
  }
  .attribute-box .el-textarea{
    width:600px;
    height:100px;
  }
  .attribute-box .el-textarea .el-textarea__inner{
    height: 100%;
  }
  .self-files>div>span{
    display:inline-block;
    width:160px;
    text-align:right;
    margin-right:10px;
  }
  .self-files .el-textarea{
    width: 200px  ;
  }
  .industry-date{
    display:inline-block;
    margin-right:50px;
  }
</style>

