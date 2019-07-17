<!--商品维护编辑 秋香-->
<template>
  <div id="updateShop">
    <div>
     <div style="border-bottom: 1px dashed #C5CBD1">
       <label  class="left" >商品信息</label>
       <el-row>
         <el-col :span="7">
           <el-form  :model="update" :rules="rules"  ref="update"label-width="90px" class="ruleForm">
             <el-form-item label="商品编号：" prop="spu_code">
               <el-input  v-model="update.spu_code" class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="请输入" :maxlength="50"></el-input>
             </el-form-item>
             <el-form-item label="商品名称：" prop="spu_name">
               <el-input   v-model="update.spu_name" class="first-focus"  type="text" size="small"  :disabled="isDisabled" placeholder="请输入" :maxlength="50"></el-input>
             </el-form-item>
             <el-form-item  style="width: 400px"  label="分类名称："  prop="category_cn_name">
               <el-select  filterable placeholder="全部" class="first-focus"  v-model="update.category_cn_name" @change="categoryChange()">
                 <el-option
                   v-for="item in optionsCategory"
                   :key="item.value"
                   :label="item.category_cn_name"
                   :value="item.category_id">
                 </el-option>
               </el-select>
             </el-form-item>
             <el-form-item  style="width: 400px"  label="品牌名称：" prop="brand_cn_name">
               <el-select  filterable placeholder="全部" class="first-focus" v-model="update.brand_cn_name" >
                 <el-option
                   v-for="item in optionsBrandName"
                   :key="item.brand_code"
                   :label="item.brand_cn_name"
                   :value="item.brand_code">
                 </el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="税率：" prop="barCode">
               <el-input    v-model="update.tax_rate" type="text" size="small"  :disabled="isDisabled" placeholder="请输入" :maxlength="50"></el-input>
             </el-form-item>
             <el-form-item label="产地：" prop="barCode">
               <el-input  v-model="updategoodsSkuInfoVO.product_origin" type="text" size="small"  :disabled="isDisabled" placeholder="请输入" :maxlength="50"></el-input>
             </el-form-item>
             <el-form-item  style="width: 400px"  label="启用状态：" >
               <el-select  filterable placeholder="可用" v-model="updategoodsSkuInfoVO.status">
                 <el-option
                   v-for="item in statusType"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
                 </el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="产品介绍：" prop="barCode">
                <textarea style="border:1px solid #DCDFE6;border-radius:5px;width: 1405px;height: 100px;"class='isStyle'   v-model="update.spu_desc">
                </textarea>
             <!--  <div class="grid-content">

                 <el-input
                   maxlength="200"
                   width="1800"
                   height="1500"
                   id="explain"
                   type="textarea"
                   :rows="4"
                   placeholder="请输入出库备注"
                 >
                 </el-input>

               </div>-->
             </el-form-item>
             <el-form-item label="图片：" prop="barCode">
               <el-upload
                 class="avatar-uploader"
                 action="https://jsonplaceholder.typicode.com/posts/"
                 :show-file-list="false"
                 :on-success="handleAvatarSuccess"
                 :before-upload="beforeAvatarUpload">
                 <img v-if="imageUrl" :src="imageUrl" class="avatar">
                 <i v-else class="el-icon-plus avatar-uploader-icon"></i>
               </el-upload>
             </el-form-item>
           </el-form>
         </el-col>
       </el-row>
     </div>
      <div>
        <label  class="leftLabel" >商品属性</label>
        <el-row>
          <el-col :span="24">
            <div class="input-box">
              <div class="input-box">
                <div style="margin-top:15px;" v-for="(item,i) in attributesArr" class="self-files">
                  <!--单选-->
                  <div v-if="item.attr_input_type==1">
                    <span style="margin-top:0;">{{item.attr_name}}：</span>
                    <el-radio-group v-model="item.attr_value_id"   style="display:inline-block;width:80%;">
                      <el-radio style="margin:5px 30px 5px 0px;"  v-for="single in item.attr_values" :label="single.attr_value_id" :key="single.attr_value_id">{{single.attr_value}}</el-radio>
                    </el-radio-group>
                  </div>
                  <!--多选-->
                  <div v-if="item.attr_input_type==2">
                    <span style="margin-top:0;float:left;line-height: 10px;">{{item.attr_name}}：</span>
                    <el-checkbox-group   v-model="item.attr_value_list" style="display:inline-block;width:80%;">
                      <el-checkbox style="margin:5px 30px 5px 0px;"  v-for="(single,index) in item.attr_values" :label="single.attr_value_id" :key="index">{{single.attr_value}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <!--单行文本-->
                  <!--    <div v-if="item.attr_input_type==3">
                        <span>{{item.attributeName}}：</span>
                        <el-input    type="text" v-model="item.attributeValue"></el-input>
                      </div>-->
                  <!--多行文本-->
                  <div v-if="item.attr_input_type==0" style="width: 100%;">
                    <span>{{item.attr_name}}：</span>
                    <el-input   type="textarea" v-model="item.attr_value"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
         <!-- <el-col :span="7">
            <el-form   ref="ruleForm" label-width="90px" class="ruleForm">
              <el-form-item  style="width: 400px"  label="适合发质：" >
                <el-select v-model="update.spu_code"  filterable placeholder="全部" >
                  <el-option
                    v-for="item in brandListOptions"
                    :key="item.brandId"
                    :label="item.brandName"
                    :value="item.brandId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item  style="width: 400px"  label="功效：" >
                <el-select v-model="update.spu_code"  filterable placeholder="全部" >
                  <el-option
                    v-for="item in brandListOptions"
                    :key="item.brandId"
                    :label="item.brandName"
                    :value="item.brandId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>-->
        </el-row>
      </div>
    </div>
    <!-- 标题栏 -->
   <div >
     <label  class="left1" >SKU信息</label>
     <ul id="topTitle">
       <li v-for='(item,index) in titleData' :class="{cur:item.iscur}" :key="index" @click="setCur(index)"><a
       >{{item.name}}</a></li>
     </ul>
     <div id="detail-container">
       <div class="detail-box">
         <!-- 基础信息 -->
         <div ref="title1" id="orderInfo">
           <span class="title"  style="border-left: 5px solid #2E5EC5; font-weight: 500;padding-left: 10px;font-size: 16px;margin-top: 10px;margin-bottom: 20px;margin-left: 5px">基础信息</span>
           <br/>
           <el-row style="margin-top: 20px">
           <el-col :span="7">
             <el-form :model="update" :rules="rules"  ref="ruleForm" label-width="110px" class="ruleForm">
               <el-form-item label="商品编号：" prop="goodsCode">
                 <el-input v-model="update.spu_code" class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="请输入" :maxlength="50"></el-input>
               </el-form-item>
               <el-form-item label="分类名称：" prop="barCode">
                 <el-input v-model="update.category_cn_name" type="text" size="small"  :disabled="isDisabled" placeholder="请输入" :maxlength="50"></el-input>
               </el-form-item>
               <el-form-item label="品牌名称：" prop="barCode">
                 <el-input v-model="update.brand_cn_name" type="text" size="small"  :disabled="isDisabled" placeholder="请输入" :maxlength="50"></el-input>
               </el-form-item>
               <el-form-item label="条形码：" prop="sku_barcode">
                 <el-input v-model="updategoodsSkuInfoVO.sku_barcode" type="text" size="small"  :disabled="isDisabled" placeholder="请输入" :maxlength="50"></el-input>
               </el-form-item>
               <el-form-item label="SKU名称：" prop="barCode">
                 <el-input v-model="updategoodsSkuInfoVO.sku_name"  type="text" size="small"  :disabled="isDisabled" placeholder="请输入" :maxlength="50"></el-input>
               </el-form-item>
               <el-form-item label="SKU编码：" prop="barCode">
                 <el-input v-model="updategoodsSkuInfoVO.sku_barcode" type="text" size="small"  :disabled="isDisabled" placeholder="请输入" :maxlength="50"></el-input>
               </el-form-item>
               <el-form-item label="外箱编码：" prop="barCode">
                 <el-input v-model="updategoodsSkuInfoVO.box_barcode"  type="text" size="small"  :disabled="isDisabled" placeholder="请输入" :maxlength="50"></el-input>
               </el-form-item>
             </el-form>
           </el-col>
         </el-row>
         <el-row>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="单位：" prop="goodsCode">
                   <el-select id="searchStock" v-model="updategoodsSkuInfoVO.sku_unit"  filterable placeholder="件" >
                     <el-option
                       v-for="item in unitType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
                     </el-option>
                   </el-select>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="120px" class="ruleForm">
                 <el-form-item label="商品类型：" prop="goodsCode">
                   <el-select id="searchStock" v-model="updategoodsSkuInfoVO.sku_type"  filterable placeholder="正品" >
                     <el-option
                       v-for="item in optionsGoodsType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
                     </el-option>
                   </el-select>
                 </el-form-item>
               </el-form>
             </el-col>
           <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="销售状态：" prop="goodsCode">
                   <el-select id="searchStock" v-model="updategoodsSkuInfoVO.sale_status"  filterable placeholder="正常销售" >
                     <el-option
                       v-for="item in salesType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
                     </el-option>
                   </el-select>
                 </el-form-item>
               </el-form>
             </el-col>
           <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="采购状态：" prop="goodsCode">
                   <el-select id="searchStock" v-model="updategoodsSkuInfoVO.purchase_status"  filterable placeholder="正常" >
                     <el-option
                       v-for="item in purchaseType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
                     </el-option>
                   </el-select>
                 </el-form-item>
               </el-form>
             </el-col>
           </el-row>
         <el-row :span="7">
           <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
             <el-form-item label="规格描述：" prop="goodsCode">
                <textarea style="border:1px solid #DCDFE6;border-radius:5px;width: 1405px;height: 100px;"class='isStyle' v-model="updategoodsSkuInfoVO.sku_desc"  >
                </textarea>
             </el-form-item>
           </el-form>
           </el-row>
         <el-row>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="含税零售价：" prop="goodsCode">
                   <el-input v-model="updategoodsSkuInfoVO.retail_price"   class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="120px" class="ruleForm">
                 <el-form-item label="采购参考价：" prop="goodsCode">
                   <el-input   v-model="updategoodsSkuInfoVO.purchase_price" class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="成本价：" prop="goodsCode">
                   <el-input v-model="updategoodsSkuInfoVO.cost_price"  class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="GIV价：" prop="goodsCode">
                   <el-input v-model="updategoodsSkuInfoVO.giv_price" class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
           </el-row>
         <el-row>
             <el-col :span="6">
             <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
               <el-form-item label="批次管理：" prop="goodsCode">
                 <el-select id="searchStock" v-model="updategoodsSkuInfoVO.batch"  filterable placeholder="启用" >
                   <el-option
                     v-for="item in batchType"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
                   </el-option>
                 </el-select>
               </el-form-item>
             </el-form>
           </el-col>
             <el-col :span="6">
             <el-form   ref="ruleForm" label-width="120px" class="ruleForm">
               <el-form-item label="效期管理：" prop="goodsCode">
                 <el-select id="searchStock" v-model="updategoodsSkuInfoVO.lifecycle_enable"  filterable placeholder="启用" >
                   <el-option
                     v-for="item in lifecycleType"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
                   </el-option>
                 </el-select>
               </el-form-item>
             </el-form>
           </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="有效期天数：" prop="goodsCode">
                   <el-input v-model="updategoodsSkuInfoVO.lifecycle" class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="禁售天数：" prop="goodsCode">
                   <el-input v-model="updategoodsSkuInfoVO.lockup_lifecycle"   class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
           </el-row>
         <el-row>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="禁收天数：" prop="goodsCode">
                   <el-input v-model="updategoodsSkuInfoVO.reject_lifecycle" class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="120px" class="ruleForm">
                 <el-form-item label="临期预警天数：" prop="goodsCode">
                   <el-input v-model="updategoodsSkuInfoVO.advent_lifecycle" class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
           <el-col :span="6">
             <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
               <el-form-item label="启用状态：" prop="goodsCode">
                 <el-select id="searchStock" v-model="updategoodsSkuInfoVO.status"  filterable placeholder="启用" >
                   <el-option
                     v-for="item in statusType"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
                   </el-option>
                 </el-select>
               </el-form-item>
             </el-form>
           </el-col>
           </el-row>

         </div>
         <!-- 物理属性 -->
         <div ref="title2" id="consigneeInfo">
           <span class="title paddings" style="border-left: 5px solid #2E5EC5; font-weight: 500;padding-left: 10px;font-size: 16px;margin-top: 10px;margin-bottom: 20px;margin-left: 5px">物理属性</span>
           <el-row style="margin-top: 20px">
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="长(cm)：" prop="goodsCode">
                   <el-input v-model="gcSkuPhysicalAttr.sku_length"  class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="120px" class="ruleForm">
                 <el-form-item label="宽(cm)：" prop="goodsCode">
                   <el-input v-model="gcSkuPhysicalAttr.sku_width"  class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="高(cm)：" prop="goodsCode">
                   <el-input v-model="gcSkuPhysicalAttr.sku_height"   class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="体积(cm³)：" prop="goodsCode">
                   <el-input  v-model="gcSkuPhysicalAttr.sku_volume"  class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="毛重(kg)：" prop="goodsCode">
                   <el-input v-model="gcSkuPhysicalAttr.sku_grossweight"   class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="120px" class="ruleForm">
                 <el-form-item label="净重(kg)：" prop="goodsCode">
                   <el-input v-model="gcSkuPhysicalAttr.sku_netweight"   class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="外箱长(cm)：" prop="goodsCode">
                   <el-input v-model="gcSkuPhysicalAttr.carton_length"  class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="外箱宽(cm)：" prop="goodsCode">
                   <el-input v-model="gcSkuPhysicalAttr.carton_width"   class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
           </el-row>
           <el-row>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="外箱高(cm)：" prop="goodsCode">
                   <el-input  v-model="gcSkuPhysicalAttr.carton_height"  class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="120px" class="ruleForm">
                 <el-form-item label="外箱体积(cm³)：" prop="goodsCode">
                   <el-input  v-model="gcSkuPhysicalAttr.carton_volume"  class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="重量(kg)：" prop="goodsCode">
                   <el-input  v-model="gcSkuPhysicalAttr.carton_weight"  class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
             <el-col :span="6">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="装箱数：" prop="goodsCode">
                   <el-input v-model="gcSkuPhysicalAttr.pcs"   class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
             </el-col>
           </el-row>
         </div>
         <!-- SKU属性 -->
         <div ref="title3" id="payInfo">
           <span class="title paddings" style="border-left: 5px solid #2E5EC5; font-weight: 500;padding-left: 10px;font-size: 16px;margin-top: 10px;margin-bottom: 20px;margin-left: 5px">SKU属性</span>
           <el-row style="margin-top: 20px">
             <el-col :span="24">
               <div class="input-box">
                 <div class="input-box">
                   <div style="margin-top:15px;" v-for="(item,i) in skuAttributesArr" class="self-files">
                     <!--单选-->
                     <div v-if="item.attr_input_type==1">
                       <span style="margin-top:0;">{{item.attr_name}}：</span>
                       <el-radio-group v-model="item.attr_value_id"   style="display:inline-block;width:80%;">

                         <el-radio style="margin:5px 30px 5px 0px;"  v-for="single in item.attr_values" :label="single.attr_value_id" :key="single.attr_value_id">{{single.attr_value}}</el-radio>
                       </el-radio-group>
                     </div>
                     <!--多选-->
                     <div v-if="item.attr_input_type==2">
                       <span style="margin-top:0;float:left;line-height: 10px;">{{item.attr_name}}：</span>
                       <el-checkbox-group   v-model="item.sku_value_list" style="display:inline-block;width:80%;">
                         <el-checkbox style="margin:5px 30px 5px 0px;"  v-for="(single,index) in item.attr_values" :label="single.attr_value_id" :key="index">{{single.attr_value}}</el-checkbox>
                       </el-checkbox-group>
                     </div>
                     <!--单行文本-->
                     <!--    <div v-if="item.attr_input_type==3">
                           <span>{{item.attributeName}}：</span>
                           <el-input    type="text" v-model="item.attributeValue"></el-input>
                         </div>-->
                     <!--多行文本-->
                     <div v-if="item.attr_input_type==0" style="width: 100%;">
                       <span>{{item.attr_name}}：</span>
                       <el-input   type="textarea" v-model="item.attr_value"></el-input>
                     </div>
                   </div>
                 </div>
               </div>
             </el-col>
             <!--<el-col :span="7">
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="属性1：" prop="goodsCode">
                   <el-input class="first-focus" type="text" size="small" :disabled="isDisabled" @blur="" placeholder="请输入" :maxlength="50"></el-input>
                 </el-form-item>
               </el-form>
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="批次管理：" prop="goodsCode">
                   <el-select id="searchStock" v-model="brand_cn_name"  filterable placeholder="启用" >
                     <el-option
                       v-for="item in optionsBrandName"
                       :key="item.value"
                       :label="item.brand_cn_name"
                       :value="item.brand_code">
                     </el-option>
                   </el-select>
                 </el-form-item>
               </el-form>
             </el-col>-->
           </el-row>
         </div>
         <!-- WMS货品设置 -->
         <div ref="title4">
           <span class="title paddings"style="border-left: 5px solid #2E5EC5; font-weight: 500;padding-left: 10px;font-size: 16px;margin-top: 10px;margin-bottom: 20px" >WMS货品设置</span>
           <el-row style="margin-top: 20px">
             <el-col :span="7">
              <!-- <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="对接系统：" prop="goodsCode">
                   <el-select id="searchStock" v-model="brand_cn_name"  filterable placeholder="全部" >
                     <el-option
                       v-for="item in optionsBrandName"
                       :key="item.value"
                       :label="item.brand_cn_name"
                       :value="item.brand_code">
                     </el-option>
                   </el-select>
                 </el-form-item>
               </el-form>-->
               <el-form   ref="ruleForm" label-width="110px" class="ruleForm">
                 <el-form-item label="选择货主：" prop="goodsCode">
                   <el-select id="searchStock" v-model="owner_name"  filterable placeholder="全部" >
                     <el-option
                       v-for="item in ownerType"
                       :key="item.owner_code"
                       :label="item.owner_name"
                       :value="item.owner_code">
                     </el-option>
                   </el-select>
                 </el-form-item>
               </el-form>
             </el-col>
           </el-row>
         </div>
         <!-- 图片 -->
        <!-- <div ref="title5" id="logInfo">
           <span class="title" style="border-left: 5px solid #2E5EC5; font-weight: 500;padding-left: 10px;font-size: 16px;margin-top: 10px;margin-bottom: 20px">图片</span>
            <el-upload
              class="avatar-uploader2"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader2-icon"></i>
            </el-upload>
          </div>-->

       </div>
     </div>
   </div>
    <div class="wmsFoot">
      <el-button @click="backClick" size="mini" >取 消</el-button>
      <el-button @click="" size="mini" type="primary">确 认</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        rules: {
          spu_code: [
            { required: true, message: '请输入商品编号', trigger: 'blur' },
          ],
          spu_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          category_cn_name: [
            { required: true, message: '请选择分类名称', trigger: 'change' },
          ],
          brand_cn_name: [
            { required: true, message: '请选择品牌名称', trigger: 'change' },
          ],
          sku_barcode: [
            { required: true, message: '请输入条形码', trigger: 'blur' },
          ],},
        isDisabled:false,
        tableData:[],
        brandListOptions:[],
        titleData: [
          {
            iscur: true,
            name: '基础信息'
          },
          {
            iscur: false,
            name: '物理属性'
          },
          {
            iscur: false,
            name: 'SKU属性'
          },
          {
            iscur: false,
            name: 'WMS货品设置'
          },
          {
            iscur: false,
            name: '图片'
          }
        ],//title
        imageUrl: '',
        optionsCategory:[],//分类
        optionsBrandName: [],//品牌名称下拉
        update:{
          spu_code:'',
          spu_name:'',
          category_cn_name:'',
          brand_cn_name:'',//品牌
          tax_rate:'',//税率
          product_origin:'',//产地
          spu_desc:'',//产品介绍
          sku_barcode:'',//条形码(  ---SKU编码   默认为条形码)
          category_id:'',//分类编码
          sku_name:'',//SKU名称
          sku_type:'',//商品类型
          sale_status:'',//销售状态
          purchase_status:'',//采购状态
          sku_unit:'',//单位
          sku_desc:'',//规格描述
          purchase_price:'',//采购参考价
          cost_price :'',//成本价
          giv_price:'',//GIV价


        },
        updategoodsSkuInfoVO:{
          tax_rate:'',//税率
          product_origin:'',//产地
          spu_desc:'',//产品介绍
          sku_barcode:'',//条形码(  ---SKU编码   默认为条形码)
          category_id:'',//分类编码
          sku_name:'',//SKU名称
          sku_type:'',//商品类型
          sale_status:'',//销售状态
          purchase_status:'',//采购状态
          sku_unit:'',//单位
          sku_desc:'',//规格描述
          purchase_price:'',//采购参考价
          cost_price :'',//成本价
          giv_price:'',//GIV价
          batch:'',//批次管理
          lifecycle:'',//有效期天数
          advent_lifecycle:'',//临期预警天数
          lockup_lifecycle:'',//禁售天数
          reject_lifecycle:'',//禁收天数
          retail_price:'',//含税零售价
          lifecycle_enable:'',//效期管理

        },
        batchType:[//批次管理  0不开启，1开启
          {value: false,label: '不开启'},
          {value: true,label: '开启'},
        ],
        statusType:[//启用状态	1启用；0停用；默认1
          {value: '1',label: '启用'},
          {value: '0',label: '停用'},
        ],
        lifecycleType:[　//效期管理 0不开启，1开启；默认0
          {value: true,label: '开启'},
          {value: false,label: '不开启'},
        ],

        updateList:[],
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
        ],//图片集合
        popoverShow:false,//图片按钮显隐
        brand_cn_name:'',
        goodsSkuInfoVO:[],// -- Sku信息
        gcGoodsOwnerList:[],// -- wms 货品设置
        gcSkuExtendSpecList:[],//-- sku 属性
        optionsGoodsType: [
          {value: '正品',label: '正品'},
          {value: '赠品',label: '赠品'},
          {value: '包材',label: '包材'},
          {value: '耗材',label: '耗材'}],//商品类型下拉
        sku_type: '',//商品类型
        salesType: [//销售状态    正常销售/暂停销售，默认正常销售
          {value: '正常销售',label: '正常销售'},
          {value: '暂停销售',label: '暂停销售'},
      ],
        purchaseType: [//采购状态   正常/停产/停用/缺货/暂停采购/暂停销售
          {value: '正常',label: '正常'},
          {value: '停产',label: '停产'},
          {value: '停用',label: '停用'},
          {value: '缺货',label: '缺货'},
          {value: '暂停采购',label: '暂停采购'},
          {value: '暂停销售',label: '暂停销售'},
      ],
        unitType:[//单位  件/箱
          {value: '件',label: '件'},
          {value: '箱',label: '箱'},
        ],
        gcSkuPhysicalAttr:{
          sku_height:'',//长
          sku_width:'',//宽
          sku_height:'',//高
        },//  --SKU物理属性
        attributesArr:[],//商品属性
        skuAttributesArr:[],//SKU属性
        ownerType:[],//货主
        owner_name:'',//货主
      }
    },
    methods:{
      //列表
      initMessage(){
        let data = {
          spu_id:2,
          sku_id:1,
        }
        this._post('/ecip.goods.center/execute?method=goodsSkuInfoBySkuId.get', data).then(function (res) {
          if(res.data.response.code == 0) {
            this.update = res.data.response.result;
           // this.update = res.data.response.result.gcSkuExtendSpecList;//  -- wms 货品设置
            this.updategoodsSkuInfoVO = res.data.response.result.goodsSkuInfoVO;//  --基础信息
            this.gcSkuPhysicalAttr = res.data.response.result.goodsSkuInfoVO.gcSkuPhysicalAttr;//  --SKU物理属性
            this.owner_name = res.data.response.result.goodsSkuInfoVO.gcGoodsOwnerList;// 货主
            res.data.response.result.goodsSkuInfoVO.gcGoodsOwnerList.forEach(item => {

            });
            res.data.response.result.goodsSkuInfoVO.gcGoodsOwnerList.forEach(item => {// -- sku 属性

            });

          }else {
            this.$message({
              type: 'warning',
              msg: res.data.response.message
            })
          }
        }.bind(this));
      },
      //分类
      optionsCategoryOne(){
        let data = {
          method:'category.get',
        }
        this._post('/ecip.goods.center/execute', data).then(function (res) {
          if(res.data.response.code == 0) {
            res.data.response.result.unshift({category_id: 'ALL',category_cn_name: '全部'});
            this.optionsCategory = res.data.response.result
          }
        }.bind(this));

      },
      //货主
      ownerOne(){
        this._post('/ecip.goods.center/execute?method=owner.get').then(function (res) {
          if(res.data.response.code == 0) {
            this.ownerType = res.data.response.result
          }
        }.bind(this));
      },
      //商品属性接口
      categoryChange(){
        let data1 = {
          category_id:this.update.category_cn_name,//-- 分类id
          attr_type:'spu_sale'//-- 属性所适用场景
        }
        //
        this._post('/ecip.goods.center/execute?method=categoryattrinfo.get', data1).then(function (res) {
          if(res.data.response.code == 0) {
            res.data.response.result.forEach(item => {
              item.attr_value_list = [];
            })
            this.attributesArr = res.data.response.result

          }
        }.bind(this));
        //SKU属性接口
        let data2 = {
          category_id:this.update.category_id,//-- 分类id
          attr_type:'sku_sale'//-- 属性所适用场景
        }
        //
        this._post('/ecip.goods.center/execute?method=categoryattrinfo.get', data2).then(function (res) {
          if(res.data.response.code == 0) {
            res.data.response.result.forEach(item => {
              item.sku_value_list = [];
            })
            this.skuAttributesArr = res.data.response.result
          }
        }.bind(this));
      },
      //品牌
      optionsBrandNameOne(){
        this._post('/ecip.goods.center/execute?method=brand.get').then(function (res) {
          if(res.data.response.code == 0) {
            res.data.response.result.list.unshift({brand_code: 'ALL',brand_cn_name: '全部'});
            this.optionsBrandName = res.data.response.result.list
          }
        }.bind(this));

      },
      //商品属性接口
      categoryChange(){
        let data1 = {
          category_id:this.update.category_cn_name,//-- 分类id
          attr_type:'spu_sale'//-- 属性所适用场景
        }
        //
        this._post('/ecip.goods.center/execute?method=categoryattrinfo.get', data1).then(function (res) {
          if(res.data.response.code == 0) {
            res.data.response.result.forEach(item => {
              item.attr_value_list = [];
            })
            this.attributesArr = res.data.response.result

          }
        }.bind(this));
        //SKU属性接口
        let data2 = {
          category_id:this.update.category_id,//-- 分类id
          attr_type:'sku_sale'//-- 属性所适用场景
        }
        //
        this._post('/ecip.goods.center/execute?method=categoryattrinfo.get', data2).then(function (res) {
          if(res.data.response.code == 0) {
            res.data.response.result.forEach(item => {
              item.sku_value_list = [];
            })
            this.skuAttributesArr = res.data.response.result
          }
        }.bind(this));
      },
      //点击返回
      backClick: function () {
        this.$router.push('/singleGoods')
      },
      //表头切换class的方法
      setCur(index) {
        setTimeout(() => {
          this.titleData.map(function (v, i) {
            v.iscur = i == index ? true : false;
          });
        }, 20)
        document.querySelector('.detail-box').scrollTop = this.$refs['title' + (index + 1)].offsetTop - 75;
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    },
    mounted(){
      //属性
      this.optionsBrandNameOne()
      //货主
      this.ownerOne();
      //列表回显
      this.initMessage();
      //分类
      this.optionsCategoryOne()
      //品牌
      this.optionsBrandNameOne()

      //点击表头动态切换样式
      var self = this;
      $('.detail-box').on('scroll',function () {
        var h1 =  self.$refs.title1.offsetTop - 75,
          h2 = self.$refs.title2.offsetTop - 75,
          h3 = self.$refs.title3.offsetTop - 75,
          h4 = self.$refs.title4.offsetTop - 75,
          h5 = self.$refs.title5.offsetTop - 75;
        if ($('.detail-box').scrollTop() > h1 && $('.detail-box').scrollTop() < h2) {
          self.titleData.map(function (v, i) {
            i == 0 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h2 && $('.detail-box').scrollTop() < h3) {
          self.titleData.map(function (v, i) {
            i == 1 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h3 && $('.detail-box').scrollTop() < h4) {
          self.titleData.map(function (v, i) {
            i == 2 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h4 && $('.detail-box').scrollTop() < h5) {
          self.titleData.map(function (v, i) {
            i == 3 ? v.iscur = true : v.iscur = false;
          });
        }
        if ($('.detail-box').scrollTop() > h5) {
          self.titleData.map(function (v, i) {
            i == 4 ? v.iscur = true : v.iscur = false;
          });
        }
      })
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped >
  .leftLabel{
    border-left: 5px solid #2E5EC5;
    font-weight: 500;
    padding-left: 10px;
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 20px;
    margin-left: 5px
  }

  .left{
    font-weight: 540;
    padding-left: 10px;
    font-size: 20px;
    margin-top: 5px;
    margin-bottom: 20px;
    margin-left: 5px
  }
  .left1{
    font-weight: 500;
    padding-left: 10px;
    font-size: 18px;
    margin-top: 15px;
    margin-bottom: 20px;
    margin-left: 5px
  }

  #detail-container {
    height:50%;
    width: 100%;
 /*   position: absolute;*/
    top: 10px;
    left: 20px;
    padding: 20px 0px 55px 0px;
  }

  .detail-box {
    width: 100%;
    height: 100%;
    padding-right: 15px;
  }

  #topTitle .cur {
    height: 99%;
    border-bottom: 4px solid #2E5EC5;
    color: #25BAFF;

  }

  #topTitle {
    left: 0;
    top: 45px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    z-index: 10;
   /* position: absolute;*/
    width: 50%;
  }

  #topTitle li {
    float: left;
    width: 20%;
    height: 100%;
    min-width: 100px;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    background: white;
    cursor: pointer;
  }

  #topTitle li a {
    display: inline-block;
    text-align: center;
    text-decoration: none;
    width: 100%;
    height: 100%;
    color: #848484;
    box-sizing: border-box;
    font-size: 14px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }

  .avatar-uploader2 .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }
  .avatar-uploader2 .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader2-icon {
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    margin-left: 110px;
  }
  .avatar {
    width: 78px;
    height: 78px;
    //display: block;
    display: none;
  }
  .avatar {
    width: 78px;
    height: 78px;
    //display: block;
    display: none;
  }
  .el-upload__input {
    display: none;
  }

  .wmsFoot{
 text-align: center;
  }
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
  .self-files>div>span{
    display:inline-block;
    width:160px;
    text-align:right;
    margin-right:10px;
  }
  .self-files .el-textarea{
    width: 200px  ;
  }
  .self-files > div > span[data-v-1b388f6c] {
    display: inline-block;
    width: 97px;
    text-align: right;
    margin-right: 10px;
  }
</style>
<style>
  #updateShop  input[type=file] {
    display: none!important;
  }

  @media screen and (max-width: 1366px) {
    #updateShop .ruleForm .el-select, .ruleForm .el-input {
      width: 160px !important;
    }
  }
  @media screen and (max-width: 1366px){
    #updateShop .isStyle[data-v-ea38dbe4] {
      width: 972px !important;
    }
  }
</style>
