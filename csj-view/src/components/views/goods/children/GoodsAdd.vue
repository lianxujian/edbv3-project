<!--添加商品 樊虎-->
<template>
  <div id="goodsAdd" style="padding:10px 20px 0px 20px !important;height:100%;">
    <!--<div class="fixed-menu">
      <ul>
        <li v-for='(item,index) in titleData' :class="{active:item.iscur}" :key="index" @click="setCur(index)"><a
        >{{item.name}}</a></li>
      </ul>
    </div>-->
    <el-tabs v-model="activeName1" class="spel-parent" style="padding-bottom:70px;" @tab-click="handleClick1" v-loading="loading" element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading">
      <el-tab-pane label="基本信息" name="first">
        <div ref="title1" class="goods-module">
          <h4>基本信息</h4>
          <div class="template">
            <label for="" class="require">商品名称：</label>
            <el-input type="text" style="width:400px;" size="small" maxlength="60"  v-model="goodsParam.goodsName"></el-input>
            <span>
            <span v-if="goodsParam.goodsName.length<60">（最多支持输入60字，剩余{{60-goodsParam.goodsName.length}}字，</span>
            <span v-else>（最多支持输入60字，剩余0字，</span>
            <span v-if="goodsParam.goodsName.length<=60">超过0字</span>
            <span v-else style="color:red;">超过{{goodsParam.goodsName.length-60}}字</span>
            ）</span>
          </div>
          <div class="template">
            <label for="">卖点：</label>
            <el-input type="text" style="width:400px;" size="small" maxlength="60" v-model="goodsParam.sellPoint"></el-input>
            <span>
            <span v-if="goodsParam.sellPoint.length<60">（最多支持输入60字，剩余{{60-goodsParam.sellPoint.length}}字，</span>
            <span v-else>（最多支持输入60字，剩余0字，</span>
            <span v-if="goodsParam.sellPoint.length<=60">超过0字</span>
            <span v-else style="color:red;">超过{{goodsParam.sellPoint.length-60}}字</span>
            ）</span>
          </div>
          <div class="template">
            <label for="" class="require">商家编码：</label>
            <el-input type="text" style="width:215px;" size="small" v-model="goodsParam.goodsCode"></el-input>
          </div>
          <div class="template">
            <label for="">条形码：</label>
            <el-input type="text" style="width:215px;" size="small" v-model="goodsParam.barCode"></el-input>
          </div>
          <div class="template">
            <label for="" class="require">售价：</label>
            <el-input type="text" style="width:215px;" size="small" @keyup.native="keyUpPrice('goodsParam','salesPrice')" @blur="validate('goodsParam','salesPrice')" v-model="goodsParam.salesPrice"></el-input>
          </div>
          <div class="template">
            <label for="" style="float:left;margin-right: 9px;">备注：</label>
            <el-input type="textarea" style="width:400px;" maxlength="50" size="small" v-model="goodsParam.remark"></el-input>
          </div>
          <div class="template">
            <label for="">市场价：</label>
            <el-input type="text" style="width:215px;" size="small" @keyup.native="keyUpPrice('goodsParam','marketPrice')" @blur="validate('goodsParam','marketPrice')" v-model="goodsParam.marketPrice"></el-input>
          </div>
          <div class="template">
            <label for="" class="require">数量：</label>
            <el-input type="text" style="width:215px;" size="small" @keyup.native="keyUpPrice('goodsParam','goodsQty','integer')" v-model="goodsParam.goodsQty"></el-input>
          </div>
          <div class="template">
            <label for="" class="require">发货地：</label>
            <el-select size='small' v-model="goodsParam.prov" placeholder="请选择" @change='provinceChange'>
              <el-option
                v-for="item in provinceList"
                :key="item.districtId"
                :label="item.districtName"
                :value="item.districtId">
              </el-option>
            </el-select>
            <el-select size='small' v-model="goodsParam.districtId" placeholder="请选择">
              <el-option
                v-for="item in cityList"
                :key="item.districtId"
                :label="item.districtName"
                :value="item.districtId">
              </el-option>
            </el-select>
          </div>
          <div class="template">
            <label for="">发货时间：</label>
            <el-radio-group v-model="goodsTmallInfo.deliveryTimeType">
              <el-radio :label="1">不设置</el-radio>
              <el-radio :label="2"> 固定发货时间</el-radio>
              <el-date-picker
                style="margin:0 20px;width:130px;"
                :editable="false"
                :disabled="goodsTmallInfo.deliveryTimeType!=2"
                size='small'
                v-model="goodsTmallInfo.fixDeliveryTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <el-radio :label="3">相对发货时间</el-radio>
              <span style="margin-left:20px;font-size:14px;">付款后 </span>
              <el-input type="text" @keyup.native="keyUpPrice('goodsTmallInfo','relatDeliveryTime','integer')" :disabled="goodsTmallInfo.deliveryTimeType!=3" size="small" style="width:80px;" v-model="goodsTmallInfo.relatDeliveryTime"></el-input>
              <span style="margin-left:5px;font-size:14px;">天内发货</span>
            </el-radio-group>
          </div>
          <div class="template">
            <label class="require" for="" style="float:left;">商品图片：</label>
            <el-upload
              style="width:600px;display:inline-block;height:100px;overflow:hidden;"
              :action="`http://${imgUpload}.com/files-web/upload1`"
              list-type="picture-card"
              :limit="5"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1"
              :file-list="imgList1"
              :before-upload="beforeAvatarUpload1"
              :on-success="handleAvatarSuccess1">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
        </div>
        <div class="goods-module">
          <h4>商品描述</h4>
          <div class="template">
            <div class="edit-box" style="margin-left:108px;">
              <div class="edit-head">
                <!--<span class="edit-head-content">商品参数<span style="color:#999;">（选填）</span></span>
                <span class="toggle-edit">收起</span>-->
              </div>
              <div class="edit-line">
                <input id="goodsParam_value" type="hidden" name="goodsParam"/>
                <div class="text-box">
                  <div class="text-content editor" id="goodsDesc" contenteditable="true" v-html='goodsParam.goodsDesc'></div>
                  <div class="text-foot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="天猫属性" name="second">
        <div ref="title2" class="goods-module">
          <h4>平台-天猫</h4>
          <div class="template">
            <label for="">淘宝类目：</label>
            <el-cascader
              size="small"
              :filterable="true"
              @change="channelCascader"
              placeholder="请选择" style="width:337px;"
              v-model="catalogId"
              :options="catalogList"
              separator="-"
            ></el-cascader>
            <el-button type="primary" size="small" @click="tmallRefresh">刷新</el-button>
          </div>
        </div>

        <div class="goods-module" v-if="tmallIsKeyArr.length>0">
          <h4>关键属性</h4>
          <div class="template" v-for="(item,i) in tmallIsKeyArr" style="width:350px;display:inline-block;">
            <label for="" :class="{require:item.must}">{{item.attributeName}}：</label>
            <el-input style="width:215px;" v-if="item.showType == 2" type="text" size="small" v-model="item.attributeValue"></el-input>
            <div v-else style="display:inline-block;">
              <el-select size='small' v-if="item.tsAttributeValueDefinePOS.length<1000" v-model="item.platformAttributeValueId" @change="changeChannel('tmallIsKeyArr',i,item.platformAttributeValueId,item.tsAttributeValueDefinePOS)" placeholder="请选择">
                <el-option
                  v-for="item2 in item.tsAttributeValueDefinePOS"
                  :key="item2.platformAttributeValueId"
                  :label="item2.attributeValueName"
                  :value="item2.platformAttributeValueId">
                </el-option>
              </el-select>
              <fh-select v-else :list="item.tsAttributeValueDefinePOS" :model="item.platformAttributeValueId" :parentArr="`tmallIsKeyArr+${i}`" @changeSelect="changeSelect"></fh-select>
            </div>
          </div>
        </div>
        <div class="goods-module" v-if="tmallNotKeyArr.length>0">
          <h4>非关键属性</h4>
          <div class="template" v-for="(item,i) in tmallNotKeyArr" style="width:350px;display:inline-block;">
            <label for="" :class="{require:item.must}">{{item.attributeName}}：</label>
            <el-input style="width:215px;" v-if="item.showType == 2" type="text" size="small" v-model="item.attributeValue"></el-input>
            <div v-else style="display:inline-block;">
              <el-select size='small' v-if="item.tsAttributeValueDefinePOS.length<1000" v-model="item.platformAttributeValueId" @change="changeChannel('tmallNotKeyArr',i,item.platformAttributeValueId,item.tsAttributeValueDefinePOS)" placeholder="请选择">
                <el-option
                  v-for="item2 in item.tsAttributeValueDefinePOS"
                  :key="item2.platformAttributeValueId"
                  :label="item2.attributeValueName"
                  :value="item2.platformAttributeValueId">
                </el-option>
              </el-select>
              <fh-select v-else :list="item.tsAttributeValueDefinePOS" :model="item.platformAttributeValueId" :parentArr="`tmallNotKeyArr+${i}`" @changeSelect="changeSelect"></fh-select>
            </div>
          </div>
        </div>

        <div class="goods-module">
          <el-tabs type="card" v-model="activeName" class="spel-children" style="margin-top:15px;">
            <el-tab-pane label="商品属性" name="first">
              <div class="template">
                <label for="">商品名称：</label>
                <el-input type="text" size="small" v-model="goodsTmallInfo.goodsName" style="width:400px;"></el-input>
                <el-checkbox @change="checkChnage('goodsTmallInfo',goodsTmallCheckBox.isCheck1,'goodsName')" v-model="goodsTmallCheckBox.isCheck1" style="margin-left:15px;">等同共有商品名称</el-checkbox>
              </div>
              <div class="template">
                <label for="">卖点：</label>
                <el-input type="text" size="small" v-model="goodsTmallInfo.sellPoint" style="width:400px;"></el-input>
                <el-checkbox @change="checkChnage('goodsTmallInfo',goodsTmallCheckBox.isCheck2,'sellPoint')" v-model="goodsTmallCheckBox.isCheck2" style="margin-left:15px;">等同共有商品卖点</el-checkbox>
              </div>
              <div class="template">
                <label for="">商品数量：</label>
                <el-input type="text" @keyup.native="keyUpPrice('goodsTmallInfo','goodsQty','integer')" size="small" v-model="goodsTmallInfo.goodsQty" style="width:215px;"></el-input>
                <el-checkbox @change="checkChnage('goodsTmallInfo',goodsTmallCheckBox.isCheck3,'goodsQty')" v-model="goodsTmallCheckBox.isCheck3" style="margin:0 15px;">等同共有数量</el-checkbox>
              </div>
              <div class="template">
                <label for="">售价：</label>
                <el-input type="text" @keyup.native="keyUpPrice('goodsTmallInfo','salesPrice')" @blur="validate('goodsTmallInfo','salesPrice')" size="small" v-model="goodsTmallInfo.salesPrice" style="width:215px;"></el-input>
                <el-checkbox @change="checkChnage('goodsTmallInfo',goodsTmallCheckBox.isCheck4,'salesPrice')" v-model="goodsTmallCheckBox.isCheck4" style="margin-left:15px;">等同共有售价</el-checkbox>
              </div>
              <div class="template">
                <label for="">天猫商家编码：</label>
                <el-input type="text" size="small" v-model="goodsTmallInfo.goodsCode" style="width:215px;"></el-input>
              </div>
              <div class="template">
                <label for="" style="float:left;margin-right:10px;">无线图：</label>
                <el-upload
                  style="width:600px;display:inline-block;height:100px;overflow:hidden;"
                  :action="`http://${imgUpload}.com/files-web/upload1`"
                  list-type="picture-card"
                  :limit="5"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove2"
                  :file-list="imgList2"
                  :before-upload="beforeAvatarUpload2"
                  :on-success="handleAvatarSuccess2">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </div>
              <div class="template">
                <label for="" style="float:left;margin-right:10px;">透明素材图：<span>（800*800px）</span></label>
                <el-upload
                  style="width:200px;display:inline-block;height:100px;overflow:hidden;"
                  :action="`http://${imgUpload}.com/files-web/upload1`"
                  list-type="picture-card"
                  :limit="1"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove3"
                  :file-list="imgList3"
                  :before-upload="beforeAvatarUpload3"
                  :on-success="handleAvatarSuccess3">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </div>
            </el-tab-pane>
            <el-tab-pane label="达尔文信息" name="second">
              <div class="template">
                <span style="margin-left:2px;margin-right:5px;">选择挂靠产品：</span>
                <el-select size='small' v-model="subordinatePro" @change="subordinateChange" placeholder="请选择">
                  <el-option
                    v-for="item in subordinateList"
                    :key="item.productId"
                    :label="item.productName"
                    :value="item.productId">
                  </el-option>
                </el-select>
                <el-button type="primary" size="small" @click="subordinateBtn">挂靠</el-button>
              </div>
              <div class="template" v-if="darwinProductJson.catalogName">
                <label for="">类目：</label>
                <span>{{darwinProductJson.catalogName}}</span>
              </div>
              <div v-if="darwinProductJson.tsDarwinGoodsAttrPOS" v-for="item in darwinProductJson.tsDarwinGoodsAttrPOS">
                <div class="template">
                  <label for="">{{item.goodsAttr}}：</label>
                  <span>{{item.goodsAttrValue}}</span>
                </div>
              </div>

              <div class="template" v-if="darwinProductJson.imgUrls && darwinProductJson.imgUrls.length>0">
                <label for="" style="float:left;">产品图片：</label>
                <span v-for="imgUrl in darwinProductJson.imgUrls" style="width:100px;height:100px;display:inline-block;border:1px solid #e4e7ed;margin-right:15px;"><img style="width:100%;" :src="imgUrl" alt=""></span>
              </div>
              <!--<div class="template">
                <label for="" style="float:left;">作者介绍：</label>
                <el-input type="textarea" style="width: 700px;" disabled size="small" v-model="goodsParam.goodsName"></el-input>
              </div>-->
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <el-tab-pane label="京东属性" name="third">
        <div ref="title3" class="goods-module">
          <h4>平台-京东</h4>
          <div class="template">
            <label for="">商品名称：</label>
            <el-input type="text" size="small" v-model="goodsJdInfo.goodsName"  style="width:400px;"></el-input>
            <el-checkbox @change="checkChnage('goodsJdInfo',goodsJdCheckBox.isCheck1,'goodsName')" v-model="goodsJdCheckBox.isCheck1" style="margin-left:15px;">等同共有商品名称</el-checkbox>
          </div>
          <div class="template">
            <label for="">卖点：</label>
            <el-input type="text" size="small" v-model="goodsJdInfo.sellPoint"  style="width:400px;"></el-input>
            <el-checkbox @change="checkChnage('goodsJdInfo',goodsJdCheckBox.isCheck2,'sellPoint')" v-model="goodsJdCheckBox.isCheck2" style="margin-left:15px;">等同共有商品卖点</el-checkbox>
          </div>
          <div class="template">
            <label for="">京东商家编码：</label>
            <el-input type="text" size="small" v-model="goodsJdInfo.goodsCode" style="width:215px;"></el-input>
          </div>
          <div class="template">
            <label for="">商品数量：</label>
            <el-input type="text" size="small" @keyup.native="keyUpPrice('goodsJdInfo','goodsQty','integer')" v-model="goodsJdInfo.goodsQty" style="width:215px;"></el-input>
            <el-checkbox @change="checkChnage('goodsJdInfo',goodsJdCheckBox.isCheck3,'goodsQty')" v-model="goodsJdCheckBox.isCheck3" style="margin-left:15px;">等同共有数量</el-checkbox>
          </div>
          <div class="template">
            <label for="">售价：</label>
            <el-input type="text" size="small" @keyup.native="keyUpPrice('goodsJdInfo','salesPrice')" @blur="validate('goodsJdInfo','salesPrice',1)" v-model="goodsJdInfo.salesPrice" style="width:215px;"></el-input>
            <el-checkbox @change="checkChnage('goodsJdInfo',goodsJdCheckBox.isCheck4,'salesPrice')" v-model="goodsJdCheckBox.isCheck4" style="margin-left:15px;">等同共有售价</el-checkbox>
          </div>
          <div class="template">
            <label for="">折扣（%）：</label>
            <el-input type="text" disabled @keyup.native="keyUpPrice('goodsJdInfo','discount')" @blur="validate('goodsJdInfo','discount')" size="small" v-model="goodsJdInfo.discount" style="width:215px;"></el-input>
          </div>
          <div class="template">
            <label for="">市场价：</label>
            <el-input type="text" @keyup.native="keyUpPrice('goodsJdInfo','marketPrice')" @blur="validate('goodsJdInfo','marketPrice',1)" size="small" v-model="goodsJdInfo.marketPrice" style="width:215px;"></el-input>
            <el-checkbox @change="checkChnage('goodsJdInfo',goodsJdCheckBox.isCheck5,'marketPrice')" v-model="goodsJdCheckBox.isCheck5" style="margin-left:15px;">等同共有定价</el-checkbox>
          </div>
          <div class="template">
            <label for="">长（mm）：</label>
            <el-input type="text" size="small" @keyup.native="keyUpPrice('goodsJdInfo','goodsLength')" @blur="validate('goodsJdInfo','goodsLength')" v-model="goodsJdInfo.goodsLength" style="width:215px;"></el-input>
          </div>
          <div class="template">
            <label for="">宽（mm）：</label>
            <el-input type="text" size="small" @keyup.native="keyUpPrice('goodsJdInfo','goodsWidth')" @blur="validate('goodsJdInfo','goodsWidth')" v-model="goodsJdInfo.goodsWidth" style="width:215px;"></el-input>
          </div>
          <div class="template">
            <label for="">高（mm）：</label>
            <el-input type="text" size="small" @keyup.native="keyUpPrice('goodsJdInfo','goodsHeight')" @blur="validate('goodsJdInfo','goodsHeight')" v-model="goodsJdInfo.goodsHeight" style="width:215px;"></el-input>
          </div>
          <div class="template" style="padding-left:5px;">
            <label style="width:105px;" for="">密度（g/m3）：</label>
            <el-input type="text" size="small" @keyup.native="keyUpPrice('goodsJdInfo','density')" @blur="validate('goodsJdInfo','density')" v-model="goodsJdInfo.density" style="width:215px;"></el-input>
          </div>
          <div class="template">
            <label for=""  style="width:100px;">京东类目：</label>
            <el-select size='small' v-model="goodsJdInfo.oneCatalog" filterable @change="oneCatalogChannel" placeholder="请选择">
              <el-option
                v-for="item in oneCatalogList"
                :key="item.catalogId"
                :label="item.catalogName"
                :value="item.catalogId">
              </el-option>
            </el-select>
            <el-select size='small' v-model="goodsJdInfo.twoCatalog" filterable @change="twoCatalogChannel" placeholder="请选择">
              <el-option
                v-for="item in twoCatalogList"
                :key="item.catalogId"
                :label="item.catalogName"
                :value="item.catalogId">
              </el-option>
            </el-select>
            <el-select size='small' v-model="goodsJdInfo.threeCatalog" filterable @change="threeCatalogChannel" placeholder="请选择">
              <el-option
                v-for="item in threeCatalogList"
                :key="item.catalogId"
                :label="item.catalogName"
                :value="item.catalogId">
              </el-option>
            </el-select>
            <el-button type="primary" size="small" @click="jdRefresh">刷新</el-button>
          </div>
        </div>
        <div class="goods-module" v-if="jdIsKeyArr.length>0">
          <h4>关键属性</h4>
          <div class="template" v-for="(item,i) in jdIsKeyArr" style="width:350px;display:inline-block;">
            <label for="" class="require">{{item.attributeName}}：</label>
            <el-input style="width:215px;" v-if="item.showType == 2" type="text" size="small" v-model="item.attributeValue"></el-input>
            <div v-else style="display:inline-block;">
              <el-select v-if="item.tsAttributeValueDefinePOS.length<1000"size='small' v-model="item.platformAttributeValueId" @change="changeChannel('jdIsKeyArr',i,item.platformAttributeValueId,item.tsAttributeValueDefinePOS)" placeholder="请选择">
                <el-option
                  v-for="item2 in item.tsAttributeValueDefinePOS"
                  :key="item2.platformAttributeValueId"
                  :label="item2.attributeValueName"
                  :value="item2.platformAttributeValueId">
                </el-option>
              </el-select>
              <fh-select v-else :list="item.tsAttributeValueDefinePOS" :model="item.platformAttributeValueId" :parentArr="`jdIsKeyArr+${i}`" @changeSelect="changeSelect"></fh-select>
            </div>
          </div>
        </div>
        <div class="goods-module" v-if="jdInvariantKey.length>0">
          <h4>不变属性</h4>
          <div class="template" v-for="(item,i) in jdInvariantKey" style="width:350px;display:inline-block;">
            <label for="">{{item.attributeName}}：</label>
            <el-input style="width:215px;" v-if="item.showType == 2" type="text" size="small" v-model="item.attributeValue"></el-input>
            <div v-else style="display:inline-block;">
              <el-select v-if="item.tsAttributeValueDefinePOS.length<1000" size='small' v-model="item.platformAttributeValueId" @change="changeChannel('jdInvariantKey',i,item.platformAttributeValueId,item.tsAttributeValueDefinePOS)" placeholder="请选择">
                <el-option
                  v-for="item2 in item.tsAttributeValueDefinePOS"
                  :key="item2.platformAttributeValueId"
                  :label="item2.attributeValueName"
                  :value="item2.platformAttributeValueId">
                </el-option>
              </el-select>
              <fh-select v-else :list="item.tsAttributeValueDefinePOS" :model="item.platformAttributeValueId" :parentArr="`jdInvariantKey+${i}`" @changeSelect="changeSelect"></fh-select>
            </div>
          </div>
        </div>
        <div class="goods-module" v-if="jdVariantKey.length>0">
          <h4>可变属性</h4>
          <div class="template" v-for="(item,i) in jdVariantKey" style="width:350px;display:inline-block;">
            <label for="">{{item.attributeName}}：</label>
            <el-input style="width:215px;" v-if="item.showType == 2" type="text" size="small" v-model="item.attributeValue"></el-input>
            <div v-else style="display:inline-block;">
              <el-select v-if="item.tsAttributeValueDefinePOS.length<1000" size='small' v-model="item.platformAttributeValueId" @change="changeChannel('jdVariantKey',i,item.platformAttributeValueId,item.tsAttributeValueDefinePOS)" placeholder="请选择">
                <el-option
                  v-for="item2 in item.tsAttributeValueDefinePOS"
                  :key="item2.platformAttributeValueId"
                  :label="item2.attributeValueName"
                  :value="item2.platformAttributeValueId">
                </el-option>
              </el-select>
              <fh-select v-else :list="item.tsAttributeValueDefinePOS" :model="item.platformAttributeValueId" :parentArr="`jdVariantKey+${i}`" @changeSelect="changeSelect"></fh-select>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="拼多多属性" name="fourth">
        <div ref="title4" class="goods-module">
          <h4>平台-拼多多</h4>
          <!--类目-->
          <div class="template">
            <label for="" class="require">拼多多分类：</label>
            <el-select size='small' filterable v-model="goodsPddInfo.oneCatalogId" @change="onePddCatalogChannel" placeholder="请选择">
              <el-option
                v-for="item in onePddCatalogList"
                :key="item.catalogId"
                :label="item.catalogName"
                :value="item.catalogId">
              </el-option>
            </el-select>
            <el-select size='small' filterable v-model="goodsPddInfo.twoCatalogId" @change="twoPddCatalogChannel" placeholder="请选择">
              <el-option
                v-for="item in twoPddCatalogList"
                :key="item.catalogId"
                :label="item.catalogName"
                :value="item.catalogId">
              </el-option>
            </el-select>
            <el-select size='small' filterable v-model="goodsPddInfo.threeCatalogId" @change="threePddCatalogChannel" placeholder="请选择">
              <el-option
                v-for="item in threePddCatalogList"
                :key="item.catalogId"
                :label="item.catalogName"
                :value="item.catalogId">
              </el-option>
            </el-select>
            <el-select size='small' filterable v-if="fourPddCatalogList.length > 0" v-model="goodsPddInfo.fourCatalogId" @change="fourPddCatalogChannel" placeholder="请选择">
              <el-option
                v-for="item in fourPddCatalogList"
                :key="item.catalogId"
                :label="item.catalogName"
                :value="item.catalogId">
              </el-option>
            </el-select>
            <!--<el-button type="primary" size="small" @click="jdRefresh">刷新</el-button>-->
          </div>
          <!--拼多多基础属性-->
          <!--<el-input-number v-model="num9" :precision="2" :max="10" :min="-1" :controls="false"></el-input-number>-->
          <div class="goods-module" v-if="commonProp.length>0" style="margin-left:10px;background:#FBFBFB;padding: 0px 10px 15px 10px;max-width:1430px;">
            <p style="margin: 15px 0 0 28px;padding-top:10px;">商品属性</p>
            <div class="template" v-for="(item,i) in commonProp" style="width:350px;display:inline-block;">
              <label for="" :class="{require:item.required}">{{item.nameAlias}}：</label>
              <!--输入框-->
              <div v-if="item.controlType == 0" style="display:inline-block;">
                <el-input style="width:178px;" v-if="item.valueType==0" type="text" size="small" :maxlength="item.maxValue" :minlength="item.minValue" v-model="item.attributeValue"></el-input>
                <el-input-number style="width:178px;" v-if="item.valueType==1" size="small" v-model="item.attributeValue" :precision="item.valuePrecision" :max="item.maxValue" :min="item.minValue" :controls="false"></el-input-number>
                <!--<span>{{item.valueUnit}}</span>-->
              </div>
              <!--下拉单选-->
              <div v-if="item.controlType == 1" style="display:inline-block;">
                <el-select style="width:178px;" size='small' v-model="item.platformAttributeValueId" @change="changeChannel('commonProp',i,item.platformAttributeValueId,item.valuesJsonList,'pdd')" placeholder="请选择">
                  <el-option
                    v-for="item2 in item.valuesJsonList"
                    :key="item2.vid"
                    :label="item2.value"
                    :value="item2.vid">
                  </el-option>
                </el-select>
                <!--<span>{{item.valueUnit}}</span>-->
              </div>
              <!--单项时间选择器-年月日-->
              <div v-if="item.controlType == 5" style="display:inline-block;">
                <el-date-picker
                  style="width:178px;"
                  format='yyyy-MM-dd'
                  value-format='yyyy-MM-dd'
                  v-model="item.attributeValue"
                  size="small"
                  type="date"
                  :picker-options="pickerOptions1"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <!--单项时间选择器-年月-->
              <div v-if="item.controlType == 7" style="display:inline-block;">
                <el-date-picker
                  style="width:178px;"
                  format='yyyy-MM'
                  value-format='yyyy-MM'
                  v-model="item.attributeValue"
                  size="small"
                  type="month"
                  :picker-options="pickerOptions1"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <!--输入数值乘积-2维-->
              <div v-if="item.controlType == 12" style="display:inline-block;">
                <el-input-number style="width:90px;" size="small" v-model="item.attributeValue1" :precision="item.valuePrecision" :max="item.maxValue" :min="item.minValue" :controls="false"></el-input-number> x
                <el-input-number style="width:90px;" size="small" v-model="item.attributeValue2" :precision="item.valuePrecision" :max="item.maxValue" :min="item.minValue" :controls="false"></el-input-number>
                <!--<span>{{item.valueUnit}}</span>-->
              </div>
            </div>
          </div>
          <div class="template">
            <label for="" class="require">商品标题：</label>
            <el-input type="text" size="small" v-model="goodsPddInfo.goodsName" style="width:400px;"></el-input>
            <span> （最多支持输入60字，剩余60字， 超过0字 ）</span>
            <el-checkbox v-model="goodsPddCheckBox.isCheck1" @change="checkChnage('goodsPddInfo',goodsPddCheckBox.isCheck1,'goodsName')" style="margin-left:15px;">等同共有商品标题</el-checkbox>
          </div>
          <div class="template">
            <label for="">商品短标题：</label>
            <el-input type="text" size="small" v-model="goodsPddInfo.shortTitle" style="width:400px;"></el-input>
            <span> （最多支持输入10字，剩余20字， 超过0字 ）</span>
            <el-checkbox v-model="goodsPddCheckBox.isCheck2" @change="checkChnage('goodsPddInfo',goodsPddCheckBox.isCheck2,'shortTitle','sellPoint')" style="margin-left:15px;">等同共有商品短标题</el-checkbox>
          </div>
          <div class="template">
            <label for="">商品编码：</label>
            <el-input type="text" size="small" v-model="goodsPddInfo.goodsCode" style="width:215px;"></el-input>
            <!--<el-tooltip class="item" effect="dark" content="商品编码是为了方便商家管理商品，用于库存管理，多渠道销售分析等；商家可以在这里输入erp编码，库存编号，标准条码等；对于多规格的商品，可以设置整个商品的编码和每个规格(SKU)的编码；输入商品编码后，需要商品发布成功才能生效。" placement="top-start">
              <i class="el-icon-question" style="margin-left:5px;font-size:16px;"></i>
            </el-tooltip>-->
          </div>
          <div class="template">
            <label class="require" for="" style="float:left;">
              商品轮播图：
            </label>
            <p style="color:orangered;font-size:10px;margin-bottom:2px;">提示：a.等宽高且尺寸宽高需均大于480px；b. 大小1M以内；c. 数量限制在10张以内；d. 图片格式仅支持JPG,PNG格式；e. 主轮播图背景为纯白色（服饰除外）,图片上不添加任何文字</p>
            <el-upload
              style="width:870px;margin-left: 112px;overflow:hidden;"
              :action="`http://${imgUpload}.com/files-web/upload1`"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove4"
              :file-list="imgList4"
              :before-upload="beforeAvatarUpload4"
              :on-success="handleAvatarSuccess4">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
          <div class="template" style="margin-top:5px;">
            <label class="require" for="" style="float:left;">商品缩略图：</label>
            <el-upload
              style="width:130px;height: 107px;display:inline-block;overflow:hidden;"
              :action="`http://${imgUpload}.com/files-web/upload1`"
              list-type="picture-card"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove5"
              :file-list="imgList5"
              :before-upload="beforeAvatarUpload5"
              :on-success="handleAvatarSuccess5">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
          <div class="template" style="margin-top:5px;">
            <label class="require" for="" style="float:left;">高清缩略图：</label>
            <el-upload
              style="width:130px;height: 107px;display:inline-block;overflow:hidden;"
              :action="`http://${imgUpload}.com/files-web/upload1`"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove6"
              :file-list="imgList6"
              :limit="1"
              :before-upload="beforeAvatarUpload6"
              :on-success="handleAvatarSuccess6">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>

          <div class="template" style="margin-top:5px;">
            <label for="" style="float:left;margin-right: 9px;">商品描述：</label>
            <el-input type="textarea" style="width:600px;float:left;" maxlength="500" v-model="goodsPddInfo.pddGoodsDesc"></el-input>
            <span style="float:left;"> （最多支持输入500字，剩余500字， 超过0字 ）</span>
            <div style="clear:both;"></div>
          </div>
          <div class="template">
            <label for="" style="float:left;">
              商品详情图：
            </label>
            <p style="color:orangered;font-size:10px;margin-bottom:2px;">提示：a.等宽高且尺寸宽高需均大于480px；b. 大小1M以内；c. 数量限制在20张以内；d. 图片格式仅支持JPG,PNG格式；</p>
            <el-upload
              style="width:870px;display:inline-block;overflow:hidden;"
              :action="`http://${imgUpload}.com/files-web/upload1`"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove7"
              :file-list="imgList7"
              :before-upload="beforeAvatarUpload7"
              :on-success="handleAvatarSuccess7">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
          <div class="goods-module" v-if="showType">
            <h4>商品规格与库存</h4>
            <!--商品规格-->
            <div class="template">
              <label for="" style="float:left;">商品规格：</label>
              <div style="display:inline-block;width:920px;">
                <!--添加规格-->
                <p style="color:#999;" v-if="specificationArr.length>0">最多添加两个商品规格</p>
                <div v-if="specificationArr.length>0" v-for="(specification,i) in specificationArr" class="specification">
                  <div class="title">
                    <el-select size='small' v-model="specification.value" @change="speciChange(i,specification.value)" style="width:180px;">
                      <el-option
                        v-for="item in specification.specProp"
                        :key="item.parent_spec_id"
                        :label="item.parent_spec_name"
                        :value="item.parent_spec_id">
                      </el-option>
                    </el-select>
                    <el-button type="text" style="float:right;" @click="speciDelete(i)">删除规格</el-button>
                  </div>
                  <div class="content">
                    <div>
                      <el-tag
                        v-for="(tag,index) in specification.valueList"
                        @close="handleClose(tag,i,index)"
                        :key="tag"
                        closable>
                        {{tag}}
                      </el-tag>
                    </div>
                    <div v-if="specification.value" style="display:inline-block;">
                      <el-input type="text" size='small' placeholder="请输入规格名称" style="width:180px;" v-model="specification.inputValue" @blur="addSpeciValue(specification.inputValue,specification.value,i)"></el-input>
                      <el-button type="text" @click="addSpeciValue(specification.inputValue,specification.value,i)">添加</el-button>
                    </div>
                  </div>
                </div>
                <el-button type="primary" size="small" v-if="showType == 2 && specificationArr.length < 2" @click="addSpecification">添加规格</el-button>
                <!--颜色与鞋码-->
                <div v-if="showType == 1 && colorProp.length > 0" class="classification spel-children">
                  <p style="margin-bottom:15px;">颜色分类</p>
                  <el-tree
                    ref="colorTree"
                    :data="colorProp"
                    show-checkbox
                    node-key="vid"
                    @check-change="checkChange"
                    :props="defaultProps1"
                    :default-checked-keys="colorValue">
                  </el-tree>
                  <p style="margin-top:15px;">鞋码</p>
                  <el-tabs v-model="activeName3" @tab-click="handleClick" :before-leave="beforeLeave">
                    <el-tab-pane :label="sizeList.value" :name="sizeList.vid" :key="sizeList.vid" v-for="(sizeList,i) in sizeProp">
                      <el-checkbox-group v-model="sizeValue" @change="handleCheckedSizeChange(sizeList.children)">
                        <el-checkbox style="margin:10px;width:100px;" v-for="(item,index) in sizeList.children" :label="item.vid" :key="item.vid">{{item.value}}</el-checkbox>
                      </el-checkbox-group>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </div>
            <!--价格与库存-->
            <div class="template">
              <label for="" class="require" style="float:left;">价格及库存：</label>
              <div style="width:920px;display: inline-block;">
                <el-table
                  :data="tableData1"
                  tooltip-effect="dark"
                  border
                  class="table1"
                  style="width:100%;margin:10px 0 20px;">
                  <el-table-column
                    v-if="label1"
                    align="center"
                    prop="prop1.attributeValue"
                    :label="label1">
                  </el-table-column>
                  <el-table-column
                    v-if="label2"
                    align="center"
                    :label="label2">
                    <template slot-scope="scope">
                      <el-table
                        :data="scope.row.children"
                        class="table-box"
                        tooltip-effect="dark"
                        :show-header="false">
                        <el-table-column
                          align="center"
                          prop="prop2.attributeValue">
                          <template slot-scope="scope">
                            <div style="display:inline-block;height:60px;overflow:hidden;margin-top:6px;line-height: 60px;">
                              <span>{{scope.row.prop2.attributeValue}}</span>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="*库存">
                    <template slot="header" slot-scope="scope">
                      <span style="color:red;">* </span><span>库存</span>
                    </template>
                    <template slot-scope="scope">
                      <el-table
                        :data="scope.row.children"
                        class="table-box"
                        tooltip-effect="dark"
                        :show-header="false">
                        <el-table-column
                          align="center"
                          prop="prop2.attributeValue">
                          <template slot-scope="scope">
                            <div style="display:inline-block;height:60px;overflow:hidden;margin-top:6px;line-height: 60px;">
                              <el-input-number v-model="scope.row.goodsQty" size="small" style="width:100px;" @blur="channelChange()" :precision="0" :min="0" :controls="false"></el-input-number>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="*团购价">
                    <template slot="header" slot-scope="scope">
                      <span style="color:red;">* </span><span>团购价</span>
                    </template>
                    <template slot-scope="scope">
                      <el-table
                        :data="scope.row.children"
                        class="table-box"
                        tooltip-effect="dark"
                        :show-header="false">
                        <el-table-column
                          align="center"
                          prop="prop2.attributeValue">
                          <template slot-scope="scope">
                            <div style="display:inline-block;height:60px;overflow:hidden;margin-top:6px;line-height: 60px;">
                              <el-input-number v-model="scope.row.grouponPrice" size="small" style="width:100px;" @blur="channelChange()" :precision="2" :min="0" :controls="false"></el-input-number>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="*单买价">
                    <template slot="header" slot-scope="scope">
                      <span style="color:red;">* </span><span>单买价</span>
                    </template>
                    <template slot-scope="scope">
                      <el-table
                        :data="scope.row.children"
                        class="table-box"
                        tooltip-effect="dark"
                        :show-header="false">
                        <el-table-column
                          align="center"
                          prop="prop2.attributeValue">
                          <template slot-scope="scope">
                            <div style="display:inline-block;height:60px;overflow:hidden;margin-top:6px;line-height: 60px;">
                              <el-input-number v-model="scope.row.salesPrice" size="small" style="width:100px;" :precision="2" @blur="channelChange()" :min="0" :controls="false"></el-input-number>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="sku编码">
                    <template slot-scope="scope">
                      <el-table
                        :data="scope.row.children"
                        class="table-box"
                        tooltip-effect="dark"
                        :show-header="false">
                        <el-table-column
                          align="center"
                          prop="prop2.attributeValue">
                          <template slot-scope="scope">
                            <div style="display:inline-block;height:60px;overflow:hidden;margin-top:6px;line-height: 60px;">
                              <el-input type="text" v-model="scope.row.skuCode" size="small" style="width:100px;"></el-input>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    align="center"
                    label="*预览图">
                    <template slot="header" slot-scope="scope">
                      <span style="color:red;">* </span><span>预览图</span>
                    </template>
                    <template slot-scope="scope">
                      <el-table
                        :data="scope.row.children"
                        class="table-box"
                        tooltip-effect="dark"
                        :show-header="false">
                        <el-table-column
                          align="center"
                          prop="prop2.attributeValue">
                          <template slot-scope="scope">
                            <el-upload
                              style="width:70px;display:inline-block;height:60px;overflow:hidden;margin-top:6px;"
                              :action="`http://${imgUpload}.com/files-web/upload1`"
                              list-type="picture-card"
                              :limit="1"
                              :on-preview="handlePictureCardPreview"
                              :on-remove="(value)=> handleRemove8(value,scope.row)"
                              :file-list="scope.row.imgList"
                              :before-upload="beforeAvatarUpload8"
                              :on-success="(value)=> handleAvatarSuccess8(value,scope.row)">
                              <i class="el-icon-plus"></i>
                            </el-upload>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table
                  :data="tableData2"
                  class="table2"
                  border
                  style="width:100%;"><!--:render-header="renderHeader"-->
                  <el-table-column
                    prop="goodsQtys"
                    align="center"
                    label="日期">
                    <template slot="header" slot-scope="scope">
                      <span>总库存</span>
                      <el-tooltip class="item" effect="dark" content="总库存 = 已上架状态SKU的预估当前库存 + 已上架状态SKU的库存增减" placement="top-start">
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="grouponPrice"
                    align="center"
                    label="团购价">
                  </el-table-column>
                  <el-table-column
                    prop="salesPrice"
                    align="center"
                    label="单买价">
                  </el-table-column>
                </el-table>
                <p v-if="errorMessage && tableData1.length > 0" style="color:red;font-size:10px;margin-top:5px;">{{errorMessage}}</p>
              </div>
            </div>
          </div>
          <div class="template">
            <label for="" class="require">市场价：</label><!--<el-input-number v-model="num9" :precision="2" :max="10" :min="-1" :controls="false"></el-input-number>-->
            <!--<el-input-number type="text" size="small" v-model.trim="goodsPddInfo.marketPrice" :precision="2" :min="0" :controls="false" @blur="channelChange('')" style="width:215px;"></el-input-number>-->
            <el-input type="text" @keyup.native="keyUpPrice('goodsPddInfo','marketPrice')" @blur="validate('goodsPddInfo','marketPrice')" size="small" v-model="goodsPddInfo.marketPrice" style="width:215px;"></el-input>
            <el-checkbox v-model="goodsPddCheckBox.isCheck3" @change="checkChnage('goodsPddInfo',goodsPddCheckBox.isCheck3,'marketPrice')" style="margin-left:15px;">等同共有市场价</el-checkbox>
          </div>
        </div>
        <div class="goods-module">
          <h4>团购要求</h4>
          <div class="template">
            <label for="" class="require">团购人数：</label>
            <el-input-number size="small" :precision="0" v-model="goodsPddInfo.grouponNum" style="width:215px;" :min="0" :controls="false"></el-input-number>
          </div>
          <div class="template">
            <label for="" class="require">单次限量：</label>
            <el-input-number size="small" :precision="0" v-model="goodsPddInfo.onceLimitNum" style="width:215px;" :min="0" :controls="false"></el-input-number>
          </div>
          <div class="template">
            <label for="" class="require">限购次数：</label>
            <el-input-number size="small" :precision="0" v-model="goodsPddInfo.limitBuyNum" style="width:215px;" :min="0" :controls="false"></el-input-number>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--<div style="position: fixed;left:0;top:0;width:100%;height:60px;background:#fff;z-index:100;padding:0 20px;">
      <el-breadcrumb separator="/" class="col-breadcrumb" style="margin:15px 0;width:100%;">
        <el-breadcrumb-item><span @click="channelCancel">{{parentName}}</span></el-breadcrumb-item>
        <el-breadcrumb-item>{{titleName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>-->
    <div class="goodsDetail" v-if="false" >
      <!--<div class="goods-module" v-if="jdSellKey.length>0">
        <h4>销售属性</h4>
        <div class="template" v-for="(item,i) in jdSellKey" style="width:350px;display:inline-block;">
          <label for="">{{item.attributeName}}：</label>
          <el-input style="width:215px;" v-if="item.showType == 2" type="text" size="small" v-model.trim="item.attributeValue"></el-input>
          <el-select v-else size='small' v-model="item.platformAttributeValueId" @change="changeChannel('jdSellKey',i,item.platformAttributeValueId,item.tsAttributeValueDefinePOS)" placeholder="请选择">
            <el-option
              v-for="item2 in item.tsAttributeValueDefinePOS"
              :key="item2.platformAttributeValueId"
              :label="item2.attributeValueName"
              :value="item2.platformAttributeValueId">
            </el-option>
          </el-select>
        </div>
      </div>-->
    </div>
    <div style="position:fixed;bottom: 0;left:0;width:100%;height:50px;background:#fff;text-align: center;line-height: 50px;z-index:10;border-top:2px solid #eee;">
      <el-button size="small" style="width: 100px;" @click="channelCancel">取消</el-button>
      <el-button type="primary" style="width: 100px;" size="small" @click="channelSave(1)">保存</el-button>
      <el-button type="primary" style="width: 100px;" size="small" @click="channelSave(2)">保存并发布</el-button>
    </div>
    <!-- 发布弹框 -->
    <el-dialog title="发布店铺" :close-on-click-modal="false" :visible.sync="isPublish" width="750px" v-loading="loading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
      <div class="col-left" style="padding:0;">
        <p>选择要发布店铺：</p>
        <div>
          <label for=""><span>*</span>平台：</label>
          <el-select size='small' v-model="releaseObj.platFormType" placeholder="请选择" @change="platFormChange">
            <el-option label="天猫" value="1"></el-option>
            <el-option label="京东" value="2"></el-option>
            <el-option label="淘宝" value="3"></el-option>
            <el-option label="拼多多" value="4"></el-option>
          </el-select>
        </div>
        <div>
          <label for=""><span>*</span>店铺：</label>
          <el-select size='small' filterable v-model="releaseObj.storeId" placeholder="请选择" @change="shopChange">
            <el-option
              v-for="item in storeData"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId">
            </el-option>
          </el-select>
        </div>
        <div>
          <label for=""><span></span>店内分类：</label>
          <!--<el-select size='small' v-model="releaseObj.cid" placeholder="请选择">
            <el-option
              v-for="item in cidInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>-->
          <el-input class="container_search" :title="releaseObj.catelogoName" type="text" v-model="releaseObj.catelogoName" disabled size="small" style="width:180px !important;">
            <template slot="append">
              <div style="width:100%;height: 100%;" @click="addCatelog"><i class="el-icon-more"></i></div>
            </template>
          </el-input>
        </div>
        <div>
          <label for=""><span>*</span>运费模块：</label>
          <el-select size='small' v-model="releaseObj.freightTempId" placeholder="请选择">
            <el-option
              v-for="item in templateData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="rel-button">
          <el-button type="primary" size="small" @click="addShopBtn">确定选中</el-button>
        </div>
      </div>
      <div class="col-right" style="padding: 0 0 0 40px;">
        <p>已选择发布店铺：</p>
        <div class="shop-box"><!--:key="i"-->
          <div v-for="(item,i) in shopData"><!-- -->
            <el-tooltip class="item" effect="dark" :content="`店内分类：${item.catelogoName}；运费模块：${item.templateName}`" placement="top-start">
              <div style="display:inline-block;">{{channelObj[item.platFormType]}}：{{item.storeName}}</div>
            </el-tooltip>
            <span class="close" @click="delStore(i)">&times;</span>，
          </div>
        </div>
        <div class="rel-button">
          <el-button size="small"  @click="isPublish = false">取消</el-button>
          <el-button type="primary" size="small" @click='publishShop'>发布</el-button>
        </div>
      </div>
      <div style="clear:both;"></div>
    </el-dialog>
    <!-- 类目树弹框 -->
    <el-dialog title="请选择店内分类" :close-on-click-modal="false" :visible.sync="cateLogDialog" width="600px">
      <el-tree
        :data="cidInfo"
        show-checkbox
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <el-button type="primary" size="small" style="margin:20px 0 0 200px;width:100px;" @click="catelogSave">确定</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import { richTextEditor } from '@/assets/js/rich-text-editor.js';
  import { priceValidator,validateSpelCharacter } from '@/assets/js/validate.js';
  import FhSelect from '@/components/common/FhSelect.vue';
  export default {
    props:{
      params:Object
    },
    components: {
      FhSelect
    },
    data() {
      return {
        showType:'',//自定义规格or颜色尺码选择器
        specificationArr:[],//自定义规格规格数组
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        num9:1,
        specProp:[],//自定义规格属性
        commonProp:[],//拼多多基础属性值json
        colorProp:[],//颜色规格属性
        defaultProps1:{
          children: 'children',
          label: 'value'
        },
        sizeProp:[],//尺码属性选择器
        colorObj:{},//颜色属性obj
        colorValue:[],//属性值回显
        sizeObj:{},//尺码属性obj
        sizeValue:[],
        sizeValueRecord:[],
        activeName3:'',
        onePddCatalogList:[],
        twoPddCatalogList:[],
        threePddCatalogList:[],
        fourPddCatalogList:[],
        baseInfo:{},
        goodsPddCheckBox:{
          isCheck1:true,
          isCheck2:true,
          isCheck3:true,
        },
        goodsPddInfo:{
          oneCatalogId:'',//拼多多一级类目
          twoCatalogId:"",    //拼多多二级类目
          threeCatalogId:"",  //拼多多三级类目
          fourCatalogId:"",//拼多多四级类目
          goodsName:"",      //拼多多商品名称
          shortTitle:"", //拼多多短标题
          goodsCode:'',//商品编码
          marketPrice:'',     //市场价
          grouponNum:'2',     //团购人数
          onceLimitNum:'999999',  //单次限量
          limitBuyNum:'999999',   //限购次数
          pddGoodsDesc:'',//商品描述
        },
        label1:'',
        label2:'',
        tags: ['标签一','标签二','标签三',],
        tableData1:[],
        tableData2:[{
          goodsQtys:0,
          grouponPrice:0,
          salesPrice:0
        }],
        activeName2: 'first',
        checkedCities:['上海', '北京'],
        cities:['上海', '北京', '广州', '深圳'],
        errorMessage:'',

        activeName1: 'first',
        titleData: [
          {
            iscur: true,
            name: '基本信息'
          },
          {
            iscur: false,
            name: '天猫'
          },
          {
            iscur: false,
            name: '京东'
          }
        ],
        loading:false,
        imgUpload:process.env.IMG_UPLOAD,
        version:'1.0.0',//fengqinc
        dialogImageUrl:'',
        dialogVisible:false,
        imgList1:[],
        imgList2:[],
        imgList3:[],
        imgList4:[],
        imgList5:[],
        imgList6:[],
        imgList7:[],

        activeName:'first',
        goodsParam:{
          goodsName:'',
          districtId:'',
          sellPoint:'',
          salesPrice:'',
          marketPrice:'',
          goodsQty:'',
        },
        goodsTmallInfo:{
          catalogId:'',
          deliveryTimeType:1,
          goodsQty:'',
          salesPrice:'',
        },//天猫信息
        goodsTmallCheckBox:{
          isCheck1:true,
          isCheck2:true,
          isCheck3:true,
          isCheck4:true,
        },
        goodsJdInfo:{
          oneCatalog:'',
          twoCatalog:'',
          threeCatalog:'',
          goodsQty:'',
          salesPrice:'',
          discount:'',
          marketPrice:'',
          goodsLength:'',
          goodsWidth:'',
          goodsHeight:'',
          density:''
        },
        goodsJdCheckBox:{
          isCheck1:true,
          isCheck2:true,
          isCheck3:true,
          isCheck4:true,
          isCheck5:true,
        },
        provinceList:[],
        cityList:[],
        oneCatalogList:[],
        twoCatalogList:[],
        threeCatalogList:[],
        catalogId:[],
        catalogIdObj:{},
        catalogList:[],
        tmallIsKeyArr:[],
        tmallNotKeyArr:[],
        jdIsKeyArr:[],//关键属性
        jdSellKey:[],//销售属性
        jdVariantKey:[],//可变属性
        jdInvariantKey:[],//不变属性
        subordinatePro:'',//挂靠产品
        subordinateList:[],//挂靠产品集合
        darwinProductJson:{},//挂靠信息
        titleName:'',
        delPicids:[],
        tsGoodsId:'',
        source:this.$router.history.current.params.source,
        parentName:'',
        oldProductId:'',
        sightcing:0,
        //重构发布店铺
        cateLogDialog:false,
        cidInfo:[],
        defaultProps: {
          children: 'childCatalogs',
          label: 'name'
        },
        catelogName:'',
        releaseObj:{
          storeId:'',
          freightTempId:'',
          cid:'',
          platFormType:''
        },
        templateData:[],
        shopData:[],
        storeData:[],
        cidInfo:[],
        isPublish:false,
        channelObj:{
          '1':'天猫',
          '2':'京东',
          '3':'淘宝'
        },
        tsGoodsIds:'',
        version1:'zhucy',
        firstRecord:[],//记录表格第一个属性
        tabRecord:1
      }
    },
    mounted(){
      if(this.$router.history.current.params.tsGoodsId == 'fanhu'){
        this.titleName = '添加';
        this.sightcing = 1;
      }else{
        this.titleName = '修改';
        this.tsGoodsId = this.$router.history.current.params.tsGoodsId;
        //达尔文信息
        this.darwinEcho();
      }
      this.parentName = this.source == 'goodsManage'?'商品管理':'极限词检测';
      //富文本编辑器
      richTextEditor();
      //初始化类目集合
      this.initCategory();
      this.scrollFn();
    },
    watch:{//asd
      'goodsParam.goodsName':function(){
        if(this.goodsTmallCheckBox.isCheck1 && this.sightcing>0){
          this.goodsTmallInfo.goodsName = this.goodsParam.goodsName;
        }
        if(this.goodsJdCheckBox.isCheck1 && this.sightcing>0){
          this.goodsJdInfo.goodsName = this.goodsParam.goodsName;
        }
        if(this.goodsPddCheckBox.isCheck1 && this.sightcing>0){
          if(this.baseInfo.tsGoodsPddPO && this.tabRecord == 1){//修改
            this.baseInfo.tsGoodsPddPO.goodsName = this.goodsParam.goodsName;
          }else{//新建
            this.goodsPddInfo.goodsName = this.goodsParam.goodsName;
          }
        }
      },
      'goodsParam.sellPoint':function(){
        if(this.goodsTmallCheckBox.isCheck2 && this.sightcing>0){
          this.goodsTmallInfo.sellPoint = this.goodsParam.sellPoint;
        }
        if(this.goodsJdCheckBox.isCheck2 && this.sightcing>0){
          this.goodsJdInfo.sellPoint = this.goodsParam.sellPoint;
        }
        if(this.goodsPddCheckBox.isCheck2 && this.sightcing>0){
          if(this.baseInfo.tsGoodsPddPO && this.tabRecord == 1){//修改
            this.baseInfo.tsGoodsPddPO.shortTitle = this.goodsParam.sellPoint;
          }else{
            this.goodsPddInfo.shortTitle = this.goodsParam.sellPoint;
          }
        }
      },
      'goodsParam.goodsQty':function(){
        if(this.goodsTmallCheckBox.isCheck3 && this.sightcing>0){
          this.goodsTmallInfo.goodsQty = this.goodsParam.goodsQty;
        }
        if(this.goodsJdCheckBox.isCheck3 && this.sightcing>0){
          this.goodsJdInfo.goodsQty = this.goodsParam.goodsQty;
        }
      },
      'goodsParam.salesPrice':function(){
        if(this.goodsTmallCheckBox.isCheck4 && this.sightcing>0){
          this.goodsTmallInfo.salesPrice = this.goodsParam.salesPrice;
        }
        if(this.goodsJdCheckBox.isCheck4 && this.sightcing>0){
          this.goodsJdInfo.salesPrice = this.goodsParam.salesPrice;
        }
      },
      'goodsParam.marketPrice':function(){
        if(this.goodsJdCheckBox.isCheck5 && this.sightcing>0){
          this.goodsJdInfo.marketPrice = this.goodsParam.marketPrice;
        }
        if(this.goodsPddCheckBox.isCheck3 && this.sightcing>0){
          if(this.baseInfo.tsGoodsPddPO && this.tabRecord == 1){//修改
            this.baseInfo.tsGoodsPddPO.marketPrice = this.goodsParam.marketPrice;
          }else{
            this.goodsPddInfo.marketPrice = this.goodsParam.marketPrice;
          }
        }
      },
      'goodsPddInfo.goodsName':function(){
        //if(this.baseInfo.tsGoodsPddPO)this.baseInfo.tsGoodsPddPO.goodsName = this.goodsPddInfo.goodsName;
      },
      'goodsPddInfo.shortTitle':function(){
        //if(this.baseInfo.tsGoodsPddPO)this.baseInfo.tsGoodsPddPO.shortTitle = this.goodsPddInfo.shortTitle;
      },
      'goodsPddInfo.marketPrice':function(){
        //if(this.baseInfo.tsGoodsPddPO)this.baseInfo.tsGoodsPddPO.marketPrice = this.goodsPddInfo.marketPrice;
      }
    },
    methods: {
      resetTable(item){
        this.tableData1 = [];
        this.channelChange();
        this.label1 = '';
        this.label2 = '';
        this.sizeProp = [];
        this.colorProp = [];
        this.colorValue = [];
        this.sizeValue = [];
        this.activeName3 = '';
        this.specificationArr = [];
        this.commonProp = [];
        if(item)this.showType = '';
      },
      handleClick1(tab, event) {
        //拼多多属性
        if(tab.name == 'fourth') {
          //编辑回显
          if(this.tsGoodsId && this.tabRecord == 1){
            //拼多多基本信息 this.baseInfo
            if(this.baseInfo.tsGoodsPddPO){
              this.loading = true;
              //this.goodsPddInfo = this.baseInfo.tsGoodsPddPO;
              var catalogArr = this.baseInfo.pddCatalogs?JSON.parse(JSON.stringify(this.baseInfo.pddCatalogs)):[];
              var pddCatalogs = this.baseInfo.pddCatalogs?catalogArr.reverse():[];
              if(this.baseInfo.tsGoodsPddPO.catalogId)pddCatalogs.push(this.baseInfo.tsGoodsPddPO.catalogId);
              this.goodsPddInfo = {
                oneCatalogId:pddCatalogs[0]?pddCatalogs[0]:'',//拼多多一级类目
                twoCatalogId:pddCatalogs[1]?pddCatalogs[1]:'',    //拼多多二级类目
                threeCatalogId:pddCatalogs[2]?pddCatalogs[2]:'',  //拼多多三级类目
                fourCatalogId:pddCatalogs[3]?pddCatalogs[3]:'',  //拼多多四级类目
                goodsName:this.baseInfo.tsGoodsPddPO.goodsName,      //拼多多商品名称
                shortTitle:this.baseInfo.tsGoodsPddPO.shortTitle, //拼多多短标题
                goodsCode:this.baseInfo.tsGoodsPddPO.goodsCode,//商品编码
                marketPrice:this.baseInfo.tsGoodsPddPO.marketPrice,     //市场价
                grouponNum:this.baseInfo.tsGoodsPddPO.grouponNum,     //团购人数
                onceLimitNum:this.baseInfo.tsGoodsPddPO.onceLimitNum,  //单次限量
                limitBuyNum:this.baseInfo.tsGoodsPddPO.limitBuyNum,   //限购次数
                pddGoodsDesc:this.baseInfo.pddGoodsDesc,//商品描述
              }
              console.log(this.goodsPddInfo);
              //图片回显
              this.imgList4 = [];this.imgList5 = [];this.imgList6 = [];this.imgList7 = [];
              //轮播图
              this.baseInfo.pddLbImagePOS = this.baseInfo.pddLbImagePOS?this.baseInfo.pddLbImagePOS:[];
              this.baseInfo.pddLbImagePOS.forEach((item,i)=>{
                item.url = item.imageUrl;
                item.resourcesId = item.fileId;
                this.imgList4.push(item);
              })
              //商品详情图
              this.baseInfo.pddXqImagePOS = this.baseInfo.pddXqImagePOS?this.baseInfo.pddXqImagePOS:[];
              this.baseInfo.pddXqImagePOS.forEach((item,i)=>{
                item.url = item.imageUrl;
                item.resourcesId = item.fileId;
                this.imgList7.push(item);
              })
              //商品缩略图：
              if(this.baseInfo.pddPtSlImagePO){
                this.baseInfo.pddPtSlImagePO.url = this.baseInfo.pddPtSlImagePO.imageUrl;
                this.baseInfo.pddPtSlImagePO.resourcesId = this.baseInfo.pddPtSlImagePO.fileId;
                this.imgList5.push(this.baseInfo.pddPtSlImagePO);
              }
              //高清缩略图：
              //this.baseInfo.pddGqSlImagePO = this.baseInfo.pddGqSlImagePO?this.baseInfo.pddGqSlImagePO:{};
              if(this.baseInfo.pddGqSlImagePO){
                this.baseInfo.pddGqSlImagePO.url = this.baseInfo.pddGqSlImagePO.imageUrl;
                this.baseInfo.pddGqSlImagePO.resourcesId = this.baseInfo.pddGqSlImagePO.fileId;
                this.imgList6.push(this.baseInfo.pddGqSlImagePO);
              }
              //规则与尺寸颜色
              if(this.baseInfo.tsGoodsPddPO.catalogId){
                this.basicAttributeEcho();
              }else{
                setTimeout(()=>{
                  this.loading = false;
                },1000)
              }
            }
          }

          //拼多多一级类目
          //this.loading = true;
          this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version + "/selPddCatalog").then((response) => {
            if (response.data.success) {
              //this.loading = false;
              this.onePddCatalogList = response.data.result;
              if(this.baseInfo.tsGoodsPddPO && this.goodsPddInfo.oneCatalogId && this.tabRecord == 1){
                this.onePddCatalogChannel('一级',this.goodsPddInfo.twoCatalogId,this.goodsPddInfo.threeCatalogId,this.goodsPddInfo.fourCatalogId);
              }
              this.tabRecord = 2;
            } else {
              //this.loading = false;
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      //拼多多基础属性回显
      basicAttributeEcho(){
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version + "/selPddKeyProps",{
          catalogId :this.goodsPddInfo.fourCatalogId?this.goodsPddInfo.fourCatalogId:this.goodsPddInfo.threeCatalogId,
          oneCid:this.goodsPddInfo.oneCatalogId,
          goodsId:this.tsGoodsId
        }).then((response)=>{
          setTimeout(()=>{
            this.loading = false;
          },1000)
          if(response.data.success){
            //普通属性
            this.showType = response.data.result.showType;
            response.data.result.commonProp = response.data.result.commonProp?response.data.result.commonProp:[];
            //判断有没有级联下拉及处理
            for(var i=0;i<response.data.result.commonProp.length;i++){
              if(response.data.result.commonProp[i].childPddVOs){
                response.data.result.commonProp.splice(i+1,0,response.data.result.commonProp[i].childPddVOs[0]);
              }
            }
            response.data.result.commonProp.forEach(item=>{
              if(item.selectShow){
                item.platformAttributeValueId = item.selectShow[0].platformAttributeValueId?item.selectShow[0].platformAttributeValueId*1:'';//属性值id
              }else{
                item.platformAttributeValueId = '';
              }
              item.attributeValue = item.selectShow?item.selectShow[0].attributeValue:'';//属性值
              item.valuesJsonList = item.valuesJson?JSON.parse(item.valuesJson):[];
              if(item.maxValue == ''){item.maxValue = 10000000000;}else{item.maxValue*=1;}
              if(item.minValue == ''){item.minValue = 0;}else{item.minValue*=1;}
              if(item.valuePrecision >100){item.valuePrecision = 10;}
              if(item.controlType == 12){
                //二维
                var arr = '';
                if(item.selectShow){
                  item.selectShow[0].attributeValue?item.selectShow[0].attributeValue.split(','):''
                }
                item.attributeValue1 = arr?arr[0]:'';
                item.attributeValue2 = arr?arr[1]:'';
              }
              if(item.controlType == 0){
                //输入框
                item.platformAttributeValueId = 0;
              }
            })
            this.commonProp = response.data.result.commonProp;
            //console.log(this.commonProp);

            this.baseInfo.pddGoodsGgVOS = this.baseInfo.pddGoodsGgVOS?this.baseInfo.pddGoodsGgVOS:[];
            //如果没有属性
            if(this.baseInfo.pddGoodsGgVOS.length == 0){
              if(response.data.result.showType == 1){
                //颜色尺码属性
                if(response.data.result.colorAndSizeProp){
                  this.colorObj = {
                    attributeType:response.data.result.colorAndSizeProp[0].attributeType,//属性类型
                    platformAttributeId:response.data.result.colorAndSizeProp[0].attrId,//属性id
                    attributeName:response.data.result.colorAndSizeProp[0].nameAlias,//属性名称
                    attributeValue:'',//属性值
                    platformAttributeValueId:'',//属性值id
                  };
                  this.sizeObj = {
                    attributeType:response.data.result.colorAndSizeProp[1].attributeType,//属性类型
                    platformAttributeId:response.data.result.colorAndSizeProp[1].attrId,//属性id
                    attributeName:response.data.result.colorAndSizeProp[1].nameAlias,//属性名称
                    attributeValue:'',//属性值
                    platformAttributeValueId:'',//属性值id
                  };
                  //颜色
                  var colorProp = response.data.result.colorAndSizeProp[0].groupsList;
                  for(var item in colorProp){
                    this.colorProp.push({
                      value:item,
                      disabled: true,
                      vid:colorProp[item][0].groupId,
                      children:colorProp[item]
                    })
                  }
                  //尺码
                  var sizeProp = response.data.result.colorAndSizeProp[1].groupsList;
                  for(var item in sizeProp){
                    this.sizeProp.push({
                      value:item,
                      vid:sizeProp[item][0].groupId+'',
                      children:sizeProp[item]
                    })
                  }
                  this.activeName3 = this.sizeProp[0].vid;
                }
              }else{
                //自定义规格属性
                this.specProp = response.data.result.specProp?response.data.result.specProp:[];
              }
              return false;
            }
            /*this.label1 = this.baseInfo.pddGoodsGgVOS[0].attributeName;
            if(this.baseInfo.pddGoodsGgVOS[0])this.label2 = this.baseInfo.pddGoodsGgVOS[0].tsPddSkuVOS[0].attributeName;*/
            //表格数据处理
            var pddGoodsGgVOS = [];
            this.baseInfo.pddGoodsGgVOS.forEach(item => {
              var prop1 = {
                platformAttributeId:item.platformAttributeId,//属性id
                platformAttributeValueId:item.platformAttributeValueId,//属性值id
                attributeName:item.attributeName,//属性名称
                attributeValue:item.attributeValue,//属性值
                attributeType:item.attributeType,//属性类型
              }
              var children = [];
              item.tsPddSkuVOS.forEach(item1 => {
                var prop2 = {
                  platformAttributeId:item1.platformAttributeId,//属性id
                  platformAttributeValueId:item1.platformAttributeValueId,//属性值id
                  attributeName:item1.attributeName,//属性名称
                  attributeValue:item1.attributeValue,//属性值
                  attributeType:item1.attributeType,//属性类型
                }
                var imgList = item1.imageUrl?[{url:item1.imageUrl,resourcesId:item1.fileId?item1.fileId:''}]:[];
                children.push({
                  prop2,
                  salesPrice:item1.salesPrice,//单买价
                  grouponPrice:item1.grouponPrice, //团购价
                  goodsQty:item1.goodsQty, //商品库存
                  skuCode:item1.skuCode,//sku编码
                  pddYlPicId:item1.fileId?item1.fileId:'',  //预览图ID
                  imgList
                })
              })
              pddGoodsGgVOS.push({
                prop1,
                children
              })
            })
            //如果是颜色尺寸并且只有一个属性（尺寸）的话
            if(pddGoodsGgVOS[0].prop1.attributeType == '2'){
              var specialVos = [],children1 = [];
              pddGoodsGgVOS.forEach(item => {
                children1.push({
                  prop2:{
                    platformAttributeId:item.prop1.platformAttributeId,
                    platformAttributeValueId:item.prop1.platformAttributeValueId,
                    attributeName:item.prop1.attributeName,
                    attributeValue:item.prop1.attributeValue,
                    attributeType:item.prop1.attributeType
                  },
                  salesPrice:item.children[0].salesPrice,//单买价
                  grouponPrice:item.children[0].grouponPrice, //团购价
                  goodsQty:item.children[0].goodsQty, //商品库存
                  skuCode:item.children[0].skuCode,//sku编码
                  pddYlPicId:item.children[0].pddYlPicId,  //预览图ID
                  imgList:item.children[0].imgList,
                })
              })
              specialVos.push({
                prop1:{
                  attributeType:'',//属性类型
                  platformAttributeId:'',//属性id
                  attributeName:'',//属性名称
                  attributeValue:'',//属性值
                  platformAttributeValueId:'',
                },
                children:children1
              })
              this.tableData1 = specialVos;
            }else{
              this.tableData1 = pddGoodsGgVOS;
            }
            console.log(this.tableData1);
            this.label1 = this.tableData1[0].prop1.attributeName;
            this.label2 = this.tableData1[0].children[0].prop2.attributeName;
            this.channelChange();
            //规格与颜色 自定义属性
            this.sizeProp = [];
            this.colorProp = [];
            this.specificationArr = [];
            if(response.data.result.showType == 1){
              //颜色尺码属性
              if(response.data.result.colorAndSizeProp){
                this.colorObj = {
                  attributeType:response.data.result.colorAndSizeProp[0].attributeType,//属性类型
                  platformAttributeId:response.data.result.colorAndSizeProp[0].attrId,//属性id
                  attributeName:response.data.result.colorAndSizeProp[0].nameAlias,//属性名称
                  attributeValue:'',//属性值
                  platformAttributeValueId:'',//属性值id
                };
                this.sizeObj = {
                  attributeType:response.data.result.colorAndSizeProp[1].attributeType,//属性类型
                  platformAttributeId:response.data.result.colorAndSizeProp[1].attrId,//属性id
                  attributeName:response.data.result.colorAndSizeProp[1].nameAlias,//属性名称
                  attributeValue:'',//属性值
                  platformAttributeValueId:'',//属性值id
                };
                //颜色
                var colorProp = response.data.result.colorAndSizeProp[0].groupsList;
                for(var item in colorProp){
                  this.colorProp.push({
                    value:item,
                    disabled: true,
                    vid:colorProp[item][0].groupId,
                    children:colorProp[item]
                  })
                }
                //尺码
                var sizeProp = response.data.result.colorAndSizeProp[1].groupsList;
                for(var item in sizeProp){
                  this.sizeProp.push({
                    value:item,
                    vid:sizeProp[item][0].groupId+'',
                    children:sizeProp[item]
                  })
                }
                this.activeName3 = this.sizeProp[0].vid;
                //尺码tab回显
                if(this.tableData1[0].children[0].prop2.platformAttributeValueId){
                  var id = this.tableData1[0].children[0].prop2.platformAttributeValueId;
                  this.sizeProp.forEach(item => {
                    item.children.forEach(item1 => {
                      if(item1.vid == id){
                        this.activeName3 = item.vid;
                      }
                    })
                  })
                }
                this.tableData1.forEach(item => {
                  this.colorValue.push(item.prop1.platformAttributeValueId*1);
                })
                this.tableData1[0].children.forEach(item => {
                  if(item.prop2.platformAttributeValueId){
                    this.sizeValue.push(item.prop2.platformAttributeValueId*1);
                    this.sizeValueRecord.push(item.prop2.platformAttributeValueId*1);
                  }
                })
              }
            }else{
              //自定义规格属性
              this.specProp = response.data.result.specProp?response.data.result.specProp:[];
              var specificationObj1 = {inputValue:'',specProp:this.specProp},valueList1 = [],specificationObj2 = {inputValue:'',specProp:this.specProp},valueList2 = [];
              this.baseInfo.pddGoodsGgVOS.forEach(item => {
                specificationObj1.value = item.platformAttributeId*1;
                valueList1.push(item.attributeValue);
              })
              specificationObj1.valueList = valueList1;
              if(this.baseInfo.pddGoodsGgVOS[0] && this.baseInfo.pddGoodsGgVOS[0].tsPddSkuVOS){
                this.baseInfo.pddGoodsGgVOS[0].tsPddSkuVOS.forEach(item => {
                  specificationObj2.value = item.platformAttributeId*1;
                  valueList2.push(item.attributeValue);
                })
                specificationObj2.valueList = valueList2;
              }
              if(specificationObj1.value)this.specificationArr.push(specificationObj1);
              if(specificationObj2.value)this.specificationArr.push(specificationObj2);
            }
            //console.log(this.tableData1);
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //拼多多一级类目
      onePddCatalogChannel(item1,item2,item3,item4){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selPddCatalog",{
          catalogId :this.goodsPddInfo.oneCatalogId
        }).then((response)=>{
          if(response.data.success){
            this.twoPddCatalogList = response.data.result;
            this.goodsPddInfo.threeCatalogId = '';
            this.goodsPddInfo.fourCatalogId = '';
            this.threePddCatalogList = [];
            this.fourPddCatalogList = [];
            if(item1 == '一级'){
              this.goodsPddInfo.twoCatalogId = item2;
              if(this.goodsPddInfo.twoCatalogId){
                this.twoPddCatalogChannel('二级',item3,item4);
              }
            }else{
              this.goodsPddInfo.twoCatalogId = '';
              //重置表格
              this.resetTable(1);
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //拼多多二级类目
      twoPddCatalogChannel(item1,item2,item3){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selPddCatalog",{
          catalogId :this.goodsPddInfo.twoCatalogId
        }).then((response)=>{
          if(response.data.success){
            this.threePddCatalogList = response.data.result;
            this.goodsPddInfo.fourCatalogId = '';
            this.fourPddCatalogList = [];
            if(item1 == '二级'){
              this.goodsPddInfo.threeCatalogId = item2;
              if(this.goodsPddInfo.threeCatalogId){
                this.threePddCatalogChannel('三级',item3);
              }
            }else{
              this.goodsPddInfo.threeCatalogId = '';
              //重置表格
              this.resetTable(1);
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //拼多多三级类目
      threePddCatalogChannel(item1,item2){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selPddCatalog",{
          catalogId :this.goodsPddInfo.threeCatalogId
        }).then((response)=>{
          if(response.data.success){
            this.fourPddCatalogList = response.data.result;
            if(this.fourPddCatalogList.length > 0){
              //还有四级
              if(item1 == '三级'){
                this.goodsPddInfo.fourCatalogId = item2;
                if(this.goodsPddInfo.fourCatalogId){
                  this.fourPddCatalogChannel('四级');
                }
              }else{
                this.goodsPddInfo.fourCatalogId = '';
                //重置表格
                this.resetTable(1);
              }
            }else{//没有四级
              if(item1 == '三级'){
                //this.pddCatalogSelect(this.goodsPddInfo.threeCatalogId);
              }else{
                this.goodsPddInfo.fourCatalogId = '';
                this.pddCatalogSelect(this.goodsPddInfo.threeCatalogId);
                //重置表格
                this.resetTable(1);
              }
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //拼多多四级类目
      fourPddCatalogChannel(item1){
        if(item1 == '四级'){
          //this.pddCatalogSelect(this.goodsPddInfo.fourCatalogId);
        }else{
          //重置表格
          this.resetTable(1);
          this.pddCatalogSelect(this.goodsPddInfo.fourCatalogId);
        }
      },
      //拼多多类目选择
      pddCatalogSelect(catalogId){
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version + "/selPddKeyProps",{
          catalogId,
          oneCid:this.goodsPddInfo.oneCatalogId
        }).then((response)=>{
          this.loading = false;
          if(response.data.success){
            //普通属性
            this.showType = response.data.result.showType;
            response.data.result.commonProp = response.data.result.commonProp?response.data.result.commonProp:[];
            response.data.result.commonProp.forEach(item=>{
              item.platformAttributeValueId = '';//属性值id
              item.attributeValue = '';//属性值
              item.valuesJsonList = item.valuesJson?JSON.parse(item.valuesJson):[];
              if(item.maxValue == ''){item.maxValue = 10000000000;}else{item.maxValue*=1;}
              if(item.minValue == ''){item.minValue = 0;}else{item.minValue*=1;}
              if(item.valuePrecision >100){item.valuePrecision = 10;}
              if(item.controlType == 12){
                //二维
                item.attributeValue1 = '';
                item.attributeValue2 = '';
              }
              if(item.controlType == 0){
                //输入框
                item.platformAttributeValueId = 0;
              }
            })
            this.commonProp = response.data.result.commonProp;
            console.log(this.commonProp);

            if(response.data.result.showType == 1){
              //颜色尺码属性
              if(response.data.result.colorAndSizeProp){
                this.colorObj = {
                  attributeType:response.data.result.colorAndSizeProp[0].attributeType,//属性类型
                  platformAttributeId:response.data.result.colorAndSizeProp[0].attrId,//属性id
                  attributeName:response.data.result.colorAndSizeProp[0].nameAlias,//属性名称
                  attributeValue:'',//属性值
                  platformAttributeValueId:'',//属性值id
                };
                this.sizeObj = {
                  attributeType:response.data.result.colorAndSizeProp[1].attributeType,//属性类型
                  platformAttributeId:response.data.result.colorAndSizeProp[1].attrId,//属性id
                  attributeName:response.data.result.colorAndSizeProp[1].nameAlias,//属性名称
                  attributeValue:'',//属性值
                  platformAttributeValueId:'',//属性值id
                };
                //颜色
                this.colorProp = [];
                var colorProp = response.data.result.colorAndSizeProp[0].groupsList;
                for(var item in colorProp){
                  this.colorProp.push({
                    value:item,
                    disabled: true,
                    vid:colorProp[item][0].groupId,
                    children:colorProp[item]
                  })
                }
                //尺码
                this.sizeProp = [];
                var sizeProp = response.data.result.colorAndSizeProp[1].groupsList;
                for(var item in sizeProp){
                  this.sizeProp.push({
                    value:item,
                    vid:sizeProp[item][0].groupId+'',
                    children:sizeProp[item]
                  })
                }
                this.activeName3 = this.sizeProp[0].vid;
                console.log(this.colorProp,this.sizeProp);
              }
            }else{
              //自定义规格属性
              this.specProp = response.data.result.specProp?response.data.result.specProp:[];
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //添加规格
      addSpecification(){
        this.specificationArr.push({
          valueList:[],//规格选中值list
          value:'',//规格值
          inputValue:'',//输入框值
          specProp:this.specProp,
        })
      },
      //选择规格
      speciChange(i,value){
        this.specificationArr[i].valueList = [];
        if(this.specificationArr.length == 2 && this.specificationArr[0].value == this.specificationArr[1].value){
          this.$message({
            message: '此规格已存在，请重新选择！',
            type: 'warning'
          });
          this.specificationArr[i].value = '';
        }
        if(i == 0 && this.label1){
          this.label1 = '';
          if(this.label2){
            var obj = JSON.parse(JSON.stringify(this.tableData1[0]));
            obj.prop1 = {
              platformAttributeId:'',//属性id
              platformAttributeValueId:'',//属性值id
              attributeName:'',//属性名称
              attributeValue:'',//属性值
              attributeType:'',//属性类型
            }
            obj.children.forEach(item => {
              item.salesPrice = '';
              item.grouponPrice = '';
              item.goodsQty = '';
              item.skuCode = "";
              item.pddYlPicId = "";
              item.imgList = [];
            })
            this.tableData1 = [obj];
            this.channelChange();
          }else{
            this.tableData1 = [];
            this.channelChange();
          }
        }
        if(i == 1 && this.label2){
          this.label2 = '';
          if(this.label1){
            this.tableData1.forEach(item => {
              item.children = [{
                prop2:{
                  platformAttributeId:'',//属性id
                  platformAttributeValueId:'',//属性值id
                  attributeName:'',//属性名称
                  attributeValue:'222',//属性值
                  attributeType:'',//属性类型
                },
                salesPrice:'',//单买价
                grouponPrice:'', //团购价
                goodsQty:'', //商品库存
                skuCode:"",//sku编码
                pddYlPicId:"",  //预览图ID
                imgList:[]
              }]
            })
          }else{
            this.tableData1 = [];
            this.channelChange();
          }
        }
      },
      //添加规格值
      addSpeciValue(value,id,i){
        if(validateSpelCharacter(value)){
          this.$message({
            message: '请避免输入特殊字符！',
            type: 'warning'
          });
          return false;
        }
        if(this.specificationArr[i].valueList.indexOf(value)<0 && value){
          this.specificationArr[i].valueList.push(value);
          this.specificationArr[i].inputValue = '';

          /*[{
          prop1:{
            platformAttributeId:'',//属性id
            platformAttributeValueId:'',//属性值id
            attributeName:'',//属性名称
            attributeValue:'111',//属性值
            attributeType:'',//属性类型
          },
          children:[{
            prop2:{
              platformAttributeId:'',//属性id
              platformAttributeValueId:'',//属性值id
              attributeName:'',//属性名称
              attributeValue:'222',//属性值
              attributeType:'',//属性类型
            },
            salesPrice:'',//单买价
            grouponPrice:'', //团购价
            goodsQty:'', //商品库存
            skuCode:"",//sku编码
            pddYlPicId:"",  //预览图ID
            imgList:[]
          }]
        }]*/
          //push到table1
          var obj = {};
          //获取此属性的信息（id,label,value,类型）
          this.specProp.forEach(item => {
            if(item.parent_spec_id == id){
              obj = {
                platformAttributeId:id,//属性id
                platformAttributeValueId:'',//属性值id
                attributeName:item.parent_spec_name,//属性名称
                attributeValue:value,//属性值
                attributeType:item.attributeType,//属性类型
              }
            }
          })
          if(i == 0){
            ///*------------------------------- 添加第一个属性（始） ---------------------------------*/
            this.label1 = obj.attributeName;
            if(!this.specificationArr[1] || (this.specificationArr[1] && this.specificationArr[1].valueList.length == 0)){
              //1 、第二个属性没值
              this.tableData1.push({
                prop1:obj,
                children:[{
                  prop2:{
                    platformAttributeId:'',//属性id
                    platformAttributeValueId:'',//属性值id
                    attributeName:'',//属性名称
                    attributeValue:'',//属性值
                    attributeType:'',//属性类型
                  },
                  salesPrice:'',//单买价
                  grouponPrice:'', //团购价
                  goodsQty:'', //商品库存
                  skuCode:"",//sku编码
                  pddYlPicId:"",  //预览图ID
                  imgList:[]
                }]
              })
            }else{
             //2 、第二个属性有值
              if(this.specificationArr[0].valueList.length == 1){
                //（1）添加第一个属性的第1个属性值
                var arr = [];
                arr.push({
                  prop1:obj,
                  children:this.tableData1[0].children
                });
                this.tableData1 = JSON.parse(JSON.stringify(arr));
                this.channelChange();
              }else{
                //（2）添加第一个属性的非第1个属性值
                var obj1 = JSON.parse(JSON.stringify(this.tableData1[0].children));
                  obj1.forEach(item => {
                    item.salesPrice = '',//单买价
                    item.grouponPrice = '', //团购价
                    item.goodsQty = '', //商品库存
                    item.skuCode = "",//sku编码
                    item.pddYlPicId = "",  //预览图ID
                    item.imgList = []
                  })
                this.tableData1.push({
                  prop1:obj,
                  children:obj1
                })
              }
            }
            ///*------------------------------- 添加第一个属性（末） ---------------------------------*/
          }else if(i ==1){
            ///*------------------------------- 添加第二个属性（始） ---------------------------------*/
            this.label2 = obj.attributeName;
            if(this.specificationArr[0].valueList.length == 0){
              //1 、第一个属性没值
              if(this.specificationArr[1].valueList.length == 1) {
                //（1）添加第二个属性的第1个属性值
                this.tableData1.push({
                  prop1:{
                    platformAttributeId:'',//属性id
                    platformAttributeValueId:'',//属性值id
                    attributeName:'',//属性名称
                    attributeValue:'',//属性值
                    attributeType:'',//属性类型
                  },
                  children:[{
                    prop2:obj,
                    salesPrice:'',//单买价
                    grouponPrice:'', //团购价
                    goodsQty:'', //商品库存
                    skuCode:"",//sku编码
                    pddYlPicId:"",  //预览图ID
                    imgList:[]
                  }]
                })
              }else{
                //（2）添加第二个属性的非第1个属性值
                this.tableData1[0].children.push({
                  prop2:obj,
                  salesPrice:'',//单买价
                  grouponPrice:'', //团购价
                  goodsQty:'', //商品库存
                  skuCode:"",//sku编码
                  pddYlPicId:"",  //预览图ID
                  imgList:[]
                })
              }
            }else{
              //2 、第一个属性有值
              if(this.specificationArr[1].valueList.length == 1){
                //（1）添加第二个属性的第1个属性值
                this.tableData1.forEach((item,i)=>{
                  var arr = [];
                  arr.push({
                    prop2:obj,
                    salesPrice:item.children[0].salesPrice,//单买价
                    grouponPrice:item.children[0].grouponPrice, //团购价
                    goodsQty:item.children[0].goodsQty, //商品库存
                    skuCode:item.children[0].skuCode,//sku编码
                    pddYlPicId:item.children[0].pddYlPicId,  //预览图ID
                    imgList:item.children[0].imgList
                  });
                  item.children = JSON.parse(JSON.stringify(arr));
                })
                console.log(this.tableData1);
              }else{
                //（2）添加第二个属性的非第1个属性值
                this.tableData1.forEach((item,i)=>{
                  item.children.push({
                    prop2:obj,
                    salesPrice:'',//单买价
                    grouponPrice:'', //团购价
                    goodsQty:'', //商品库存
                    skuCode:"",//sku编码
                    pddYlPicId:"",  //预览图ID
                    imgList:[]
                  });
                })
              }
            }
          }
          ///*------------------------------- 添加第二个属性（末） ---------------------------------*/
        }
      },
      //删除规格
      speciDelete(i){
        if(i == 1){
          this.$confirm('删除该规格后，当前的规格相关数据将丢失，确认要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            this.specificationArr.splice(1,1);
            var arr = JSON.parse(JSON.stringify(this.tableData1));
            this.label2 = '';
            arr.forEach(item => {
              item.children = [{
                prop2:{
                  platformAttributeId:'',//属性id
                  platformAttributeValueId:'',//属性值id
                  attributeName:'',//属性名称
                  attributeValue:'',//属性值
                  attributeType:'',//属性类型
                },
                salesPrice:'',//单买价
                grouponPrice:'', //团购价
                goodsQty:'', //商品库存
                skuCode:"",//sku编码
                pddYlPicId:"",  //预览图ID
                imgList:[]
              }]
            })
            this.tableData1 = arr;
            this.channelChange();
          }).catch(() => {});
        }else{
          var prompt = '';
          if(this.specificationArr.length == 1){
            prompt = '删除该规格后，当前的规格相关数据将丢失，确认要删除吗？';
          }else{
            prompt = '删除该规格后，以下两个规格的所有数据将丢失，确认要删除吗？';
          }
          this.$confirm(prompt, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            this.resetTable();
          }).catch(() => {});
        }
      },
      handleClose(tag,i,index) {
        this.specificationArr[i].valueList.splice(this.specificationArr[i].valueList.indexOf(tag), 1);

        var arr = JSON.parse(JSON.stringify(this.tableData1));
        if(i == 0){
          //删除第一个属性
          if(this.specificationArr[i].valueList.length != 0 ){
            //第一个属性属性值没有都删完
            arr.splice(index,1);
          }else{
            this.label1 = '';
            arr[0].prop1 = {
              platformAttributeId:'',//属性id
              platformAttributeValueId:'',//属性值id
              attributeName:'',//属性名称
              attributeValue:'',//属性值
              attributeType:'',//属性类型
            }
          }
        }else{
          //删除第二个属性
          if(this.specificationArr[i].valueList.length != 0 ) {
            //第二个属性属性值没有都删完
            arr.forEach(item => {
              item.children.splice(index,1);
            })
          }else{
            this.label2 = '';
            arr.forEach(item => {
              item.children[0].prop2 = {
                platformAttributeId:'',//属性id
                platformAttributeValueId:'',//属性值id
                attributeName:'',//属性名称
                attributeValue:'',//属性值
                attributeType:'',//属性类型
              }
            })
          }
        }
        this.tableData1 = arr;
        console.log(this.tableData1);
        if((!this.specificationArr[1] && this.specificationArr[0].valueList.length == 0) || (this.specificationArr[0].valueList.length == 0 && this.specificationArr[1].valueList.length == 0)){
          this.tableData1 = [];
          this.errorMessage = '';
        }
        this.channelChange();
      },
      //颜色选择与删除
      checkChange(a,b){
        //当前节点 是否被选中
        if(!a.children){
          var colorSelected = this.$refs.colorTree.getCheckedKeys(true);//选中的颜色属性值
          if(b){
            //添加
            var obj = JSON.parse(JSON.stringify(this.colorObj));
            obj.attributeValue = a.value;
            obj.platformAttributeValueId = a.vid;

            this.label1 = obj.attributeName;
            if(this.sizeValue.length == 0){
              //1 、尺寸属性没值
              this.tableData1.push({
                prop1:obj,
                children:[{
                  prop2:{
                    platformAttributeId:'',//属性id
                    platformAttributeValueId:'',//属性值id
                    attributeName:'',//属性名称
                    attributeValue:'',//属性值
                    attributeType:'',//属性类型
                  },
                  salesPrice:'',//单买价
                  grouponPrice:'', //团购价
                  goodsQty:'', //商品库存
                  skuCode:"",//sku编码
                  pddYlPicId:"",  //预览图ID
                  imgList:[]
                }]
              })
            }else{
              //2 、尺寸属性有值
              if(colorSelected.length == 1){
                //（1）添加颜色属性的第1个属性值
                var arr = [];
                arr.push({
                  prop1:obj,
                  children:this.tableData1[0].children
                });
                this.tableData1 = JSON.parse(JSON.stringify(arr));
                this.channelChange();
              }else{
                //（2）添加颜色属性的非第1个属性值
                var obj1 = JSON.parse(JSON.stringify(this.tableData1[0].children));
                obj1.forEach(item => {
                  item.salesPrice = '',//单买价
                    item.grouponPrice = '', //团购价
                    item.goodsQty = '', //商品库存
                    item.skuCode = "",//sku编码
                    item.pddYlPicId = "",  //预览图ID
                    item.imgList = []
                })
                this.tableData1.push({
                  prop1:obj,
                  children:obj1
                })
              }
            }
          }else{
            //删除
            var arr = JSON.parse(JSON.stringify(this.tableData1));
            if(colorSelected.length != 0 ){
              //颜色属性属性值没有都删完
              arr.forEach((item,i)=>{
                if(item.prop1.platformAttributeValueId == a.vid){
                  arr.splice(i,1);
                }
              })
            }else{
              this.label1 = '';
              arr[0].prop1 = {
                platformAttributeId:'',//属性id
                platformAttributeValueId:'',//属性值id
                attributeName:'',//属性名称
                attributeValue:'',//属性值
                attributeType:'',//属性类型
              }
            }
            this.tableData1 = arr;
            if(colorSelected.length == 0 && this.sizeValue.length == 0){
              this.tableData1 = [];
              this.errorMessage = '';
            }
            this.channelChange();
          }
        }
      },
      //尺码tab切换
      handleClick(tab, event) {
        //console.log(tab, event);
      },
      beforeLeave(activeName, oldActiveName){
        if(this.sizeValue.length != 0){
          return this.$confirm('切换分组后，SKU及其数据将被清空，确认执行此操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.sizeValue = [];
            this.sizeValueRecord = [];
            this.label2 = '';
            this.tableData1.forEach((item,i)=>{
              item.children = [{
                prop2:{
                  platformAttributeId:'',//属性id
                  platformAttributeValueId:'',//属性值id
                  attributeName:'',//属性名称
                  attributeValue:'',//属性值
                  attributeType:'',//属性类型
                },
                salesPrice:'',//单买价
                grouponPrice:'', //团购价
                goodsQty:'', //商品库存
                skuCode:"",//sku编码
                pddYlPicId:"",  //预览图ID
                imgList:[]
              }]
            })
            if(!this.label1 && !this.label2){this.tableData1 = []}
          }).catch(() => {
            throw new Error("取消成功！");
          });
        }
      },
      //选择尺码与删除
      handleCheckedSizeChange(currentList) {
        //获取当前选中或删除的id及name
        var obj = JSON.parse(JSON.stringify(this.sizeObj));
        if(this.sizeValue.length > this.sizeValueRecord.length){
          this.sizeValue.forEach(item => {
            if(this.sizeValueRecord.indexOf(item)<0){
              obj.platformAttributeValueId = item;
            }
          })
        }else{
          this.sizeValueRecord.forEach(item => {
            if(this.sizeValue.indexOf(item)<0){
              obj.platformAttributeValueId = item;
            }
          })
        }
        currentList.forEach(item => {
          if(item.vid == obj.platformAttributeValueId){
            obj.attributeValue = item.value;
          }
        })
        var colorSelected = this.$refs.colorTree.getCheckedKeys(true);//选中的颜色属性值
        if(this.sizeValue.length > this.sizeValueRecord.length){
          //添加
          this.label2 = obj.attributeName;
          if(colorSelected.length == 0){
            //1 、颜色属性没值
            if(this.sizeValue.length == 1) {
              //（1）添加尺码属性的第1个属性值
              this.tableData1.push({
                prop1:{
                  platformAttributeId:'',//属性id
                  platformAttributeValueId:'',//属性值id
                  attributeName:'',//属性名称
                  attributeValue:'',//属性值
                  attributeType:'',//属性类型
                },
                children:[{
                  prop2:obj,
                  salesPrice:'',//单买价
                  grouponPrice:'', //团购价
                  goodsQty:'', //商品库存
                  skuCode:"",//sku编码
                  pddYlPicId:"",  //预览图ID
                  imgList:[]
                }]
              })
            }else{
              //（2）添加尺码属性的非第1个属性值
              this.tableData1[0].children.push({
                prop2:obj,
                salesPrice:'',//单买价
                grouponPrice:'', //团购价
                goodsQty:'', //商品库存
                skuCode:"",//sku编码
                pddYlPicId:"",  //预览图ID
                imgList:[]
              })
            }
          }else{
            //2 、颜色属性有值
            if(this.sizeValue.length == 1){
              //（1）添加尺码属性的第1个属性值
              this.tableData1.forEach((item,i)=>{
                var arr = [];
                arr.push({
                  prop2:obj,
                  salesPrice:item.children[0].salesPrice,//单买价
                  grouponPrice:item.children[0].grouponPrice, //团购价
                  goodsQty:item.children[0].goodsQty, //商品库存
                  skuCode:item.children[0].skuCode,//sku编码
                  pddYlPicId:item.children[0].pddYlPicId,  //预览图ID
                  imgList:item.children[0].imgList
                });
                item.children = JSON.parse(JSON.stringify(arr));
              })
            }else{
              //（2）添加第二个属性的非第1个属性值
              this.tableData1.forEach((item,i)=>{
                item.children.push({
                  prop2:obj,
                  salesPrice:'',//单买价
                  grouponPrice:'', //团购价
                  goodsQty:'', //商品库存
                  skuCode:"",//sku编码
                  pddYlPicId:"",  //预览图ID
                  imgList:[]
                });
              })
            }
          }
        }else{
          //删除
          var arr = JSON.parse(JSON.stringify(this.tableData1));
          if(this.sizeValue.length != 0 ) {
            //尺码属性属性值没有都删完
            arr.forEach((item,i)=>{
              item.children.forEach((item1,j)=>{
                if(item1.prop2.platformAttributeValueId == obj.platformAttributeValueId){
                  item.children.splice(j,1);
                }
              })
            })
          }else{
            this.label2 = '';
            arr.forEach(item => {
              item.children[0].prop2 = {
                platformAttributeId:'',//属性id
                platformAttributeValueId:'',//属性值id
                attributeName:'',//属性名称
                attributeValue:'',//属性值
                attributeType:'',//属性类型
              }
            })
          }
          this.tableData1 = arr;
          if(colorSelected.length == 0 && this.sizeValue.length == 0){
            this.tableData1 = [];
            this.errorMessage = '';
          }
          this.channelChange();
        }
        this.sizeValueRecord = this.sizeValue;
      },
      channelChange(callback){
        if(!callback){
          if(this.tableData1.length == 0){
            this.errorMessage = '';
            this.tableData2 = [{
              goodsQtys:0,
              grouponPrice:0,
              salesPrice:0
            }];
            return false;
          }
        }

        var newArr = [];
        this.tableData1.forEach(item => {
          item.children.forEach(item1 => {
            newArr.push({
              salesPrice:item1.salesPrice,//单买价
              grouponPrice:item1.grouponPrice, //团购价
              goodsQty:item1.goodsQty, //商品库存
            })
          })
        })

        for(var i=0;i<newArr.length;i++){
          if(newArr[i].grouponPrice <= 0){
            this.errorMessage = '第'+(i+1)+'行sku的团购价必须大于0';
            break;
          }
          if(newArr[i].salesPrice <= 0){
            this.errorMessage = '第'+(i+1)+'行sku的单买价必须大于0';
            break;
          }
          if(newArr[i].salesPrice < newArr[i].grouponPrice+1){
            this.errorMessage = '第'+(i+1)+'行sku的单买价必须至少比团购价高一元';
            break;
          }
          if(this.goodsPddInfo.marketPrice != undefined){
            if(newArr[i].salesPrice > this.goodsPddInfo.marketPrice){
              this.errorMessage = '第'+(i+1)+'行sku的单买价高于或等于您设置的市场价，请修改';
              break;
            }
          }
          this.errorMessage = '';
        }
        if(callback)callback(this.errorMessage)
        //团购价单买价最小值 库存最大值
        var arr1 = JSON.parse(JSON.stringify(newArr)),
          arr2 = JSON.parse(JSON.stringify(newArr)),
          goodsQtys = 0;
        arr1.sort((a,b)=>{
          return a.grouponPrice - b.grouponPrice;
        })
        arr2.sort((a,b)=>{
          return a.salesPrice - b.salesPrice;
        })
        newArr.forEach(item => {
          goodsQtys += item.goodsQty*1;
        })
        this.tableData2[0].grouponPrice = arr1[0].grouponPrice;
        this.tableData2[0].salesPrice = arr2[0].salesPrice;
        this.tableData2[0].goodsQtys = goodsQtys;
      },

      //商品轮播图
      beforeAvatarUpload4(file) {
        console.log(file);
        if(file.type!='image/png' && file.type!='image/PNG' && file.type!='image/jpg'  && file.type!='image/JPG' && file.type!='image/jpeg' && file.type!='image/JPEG'){
          this.$message({
            message: '图片类型只能为png,jpg',
            type: 'warning'
          });
          return false;
        }
        if(file.size > 1024*1024){
          this.$message({
            message: '图片大小不能超过1M',
            type: 'warning'
          });
          return false;
        }
        if(this.imgList4.length >= 10){
          this.$message({
            message: '最多添加10张图片',
            type: 'warning'
          });
          return false;
        }
      },
      handleAvatarSuccess4(response, file, fileList){
        response.url=response.resourceUrl;
        this.imgList4.push(response);
      },
      handleRemove4(file, fileList) {
        this.imgList4.forEach((item,i)=>{
          if(item.uid==file.uid){
            this.imgList4.splice(i,1)
          }
        })
        if(file.goodsImageId){
          this.delPicids.push(file.goodsImageId);
        }
      },
      //商品缩略图
      beforeAvatarUpload5(file) {
        if(file.type!='image/png' && file.type!='image/PNG' && file.type!='image/gif'  && file.type!='image/GIF' && file.type!='image/jpg'  && file.type!='image/JPG' && file.type!='image/jpeg' && file.type!='image/JPEG'){
          this.$message({
            message: '图片类型只能为gif,png,jpg,jpeg',
            type: 'warning'
          });
          return false;
        }
        /*if(file.size/1024>500){
          this.$message({
            message: '图片大小不能超过500K',
            type: 'warning'
          });
          return false;
        }*/
      },
      handleAvatarSuccess5(response, file, fileList){
        response.url=response.resourceUrl;
        this.imgList5.push(response);
      },
      handleRemove5(file, fileList) {
        this.imgList5.forEach((item,i)=>{
          if(item.uid==file.uid){
            this.imgList5.splice(i,1)
          }
        })
        if(file.goodsImageId){
          this.delPicids.push(file.goodsImageId);
        }
      },
      //高清缩略图
      beforeAvatarUpload6(file) {
        if(file.type!='image/png' && file.type!='image/PNG' && file.type!='image/gif'  && file.type!='image/GIF' && file.type!='image/jpg'  && file.type!='image/JPG' && file.type!='image/jpeg' && file.type!='image/JPEG'){
          this.$message({
            message: '图片类型只能为gif,png,jpg,jpeg',
            type: 'warning'
          });
          return false;
        }
        /*if(file.size/1024>500){
          this.$message({
            message: '图片大小不能超过500K',
            type: 'warning'
          });
          return false;
        }*/
      },
      handleAvatarSuccess6(response, file, fileList){
        response.url=response.resourceUrl;
        this.imgList6.push(response);
      },
      handleRemove6(file, fileList) {
        this.imgList6.forEach((item,i)=>{
          if(item.uid==file.uid){
            this.imgList6.splice(i,1)
          }
        })
        if(file.goodsImageId){
          this.delPicids.push(file.goodsImageId);
        }
      },
      //商品详情图
      beforeAvatarUpload7(file) {
        if(file.type!='image/png' && file.type!='image/PNG' && file.type!='image/jpg'  && file.type!='image/JPG' && file.type!='image/jpeg' && file.type!='image/JPEG'){
          this.$message({
            message: '图片类型只能为png,jpg',
            type: 'warning'
          });
          return false;
        }
        if(file.size > 1024*1024){
          this.$message({
            message: '图片大小不能超过1M',
            type: 'warning'
          });
          return false;
        }
        if(this.imgList7.length >= 20){
          this.$message({
            message: '最多添加20张图片',
            type: 'warning'
          });
          return false;
        }
      },
      handleAvatarSuccess7(response, file, fileList){
        response.url=response.resourceUrl;
        this.imgList7.push(response);
      },
      handleRemove7(file, fileList) {
        this.imgList7.forEach((item,i)=>{
          if(item.uid==file.uid){
            this.imgList7.splice(i,1)
          }
        })
        if(file.goodsImageId){
          this.delPicids.push(file.goodsImageId);
        }
        console.log(this.imgList7);
      },
      //预览图
      beforeAvatarUpload8(file) {
        if(file.type!='image/png' && file.type!='image/PNG' && file.type!='image/gif'  && file.type!='image/GIF' && file.type!='image/jpg'  && file.type!='image/JPG' && file.type!='image/jpeg' && file.type!='image/JPEG'){
          this.$message({
            message: '图片类型只能为gif,png,jpg,jpeg',
            type: 'warning'
          });
          return false;
        }
        /*if(file.size/1024>500){
          this.$message({
            message: '图片大小不能超过500K',
            type: 'warning'
          });
          return false;
        }*/
      },
      handleAvatarSuccess8(response, row){
        response.url=response.resourceUrl;
        row.imgList.push(response);
        row.pddYlPicId = response.resourcesId;
      },
      handleRemove8(file,row) {
        console.log(file, row);
        row.imgList.forEach((item,i)=>{
          if(item.uid==file.uid){
            row.imgList.splice(i,1)
          }
        })
        row.pddYlPicId = '';
      },

      renderHeader(h, { column, $index },index){
        return h('span', {}, [
          h('span', {}, '总库存'),
          h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '总库存 = 已上架状态SKU的预估当前库存 + 已上架状态SKU的库存增减' }}, [
            h('i', { slot: 'reference', class:'el-icon-question'}, '')
          ])
        ])
      },
      renderHeader1(h, { column, $index },index){
        return h('span', {}, [
          h('span', {}, '商品编码'),
          h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '商品编码是为了方便商家管理商品，用于库存管理，多渠道销售分析等；' +
          '商家可以在这里输入erp编码，库存编号，标准条码等；' +
          '对于多规格的商品，可以设置整个商品的编码和每个规格(SKU)的编码；' +
          '输入商品编码后，需要商品发布成功才能生效。' }}, [
            h('i', { slot: 'reference', class:'el-icon-question'}, '')
          ])
        ])
      },
      changeSelect(params){
        var arr = params.list,
          keyArr = params.parentArr.split('+')[0],
          i = params.parentArr.split('+')[1],
          id = params.value;
        arr.forEach((item,index)=>{
          if(item.platformAttributeValueId == id){
            this[keyArr][i].attributeValue = item.attributeValueName;
            this[keyArr][i].platformAttributeValueId = id;
          }
        })
      },
      checkChnage(obj,value,name,flag){
        if(value){
          if(flag){
            this[obj][name] = this.goodsParam[flag];
          }else{
            this[obj][name] = this.goodsParam[name];
          }
        }
      },
      validate(param1,param2,param3){
        this[param1][param2] = priceValidator(this[param1][param2]);
        if(param3 == 1 && this.goodsJdInfo.salesPrice && this.goodsJdInfo.marketPrice){
          this.goodsJdInfo.discount = priceValidator(this.goodsJdInfo.salesPrice*100/this.goodsJdInfo.marketPrice);
        }else{
          this.goodsJdInfo.discount = '';
        }
      },
      keyUpPrice(param1,param2,param3){
        this[param1][param2] += '';
        setTimeout(()=>{
          if(param3 == 'integer'){
            this[param1][param2] = this[param1][param2].replace(/[^\d]/g,'');
          }else{
            this[param1][param2] = this[param1][param2].replace(/[^\d\.]/g,'');
          }
        },100)
      },
      //回显
      echoInit(){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/selectGoodsByID",{
          id:this.tsGoodsId
        }).then((response)=>{
          if(response.data.success){
            this.baseInfo = response.data.result;
            //基本信息
            this.goodsParam = {
              goodsName:response.data.result.goodsName,
              sellPoint:response.data.result.sellPoint,
              goodsCode:response.data.result.goodsCode,
              barCode:response.data.result.barCode,
              remark:response.data.result.remark,
              salesPrice:response.data.result.salesPrice || response.data.result.salesPrice === 0 ?response.data.result.salesPrice:'',
              marketPrice:response.data.result.marketPrice || response.data.result.marketPrice === 0 ?response.data.result.marketPrice:'',
              goodsQty:response.data.result.goodsQty || response.data.result.goodsQty === 0 ?response.data.result.goodsQty:'',
              prov:response.data.result.districtPid,
              goodsDesc:response.data.result.goodsDesc,//富文本编辑器
              districtId:'',
            }
            if(this.goodsParam.prov){this.provinceChange('fanhu',response.data.result.districtId);}else{
              this.loading = false;
            }
            response.data.result.basicImageUrl = response.data.result.basicImageUrl?response.data.result.basicImageUrl:[];
            response.data.result.materialImageUrl = response.data.result.materialImageUrl?response.data.result.materialImageUrl:[];
            response.data.result.wirelessImageUrl = response.data.result.wirelessImageUrl?response.data.result.wirelessImageUrl:[];
            //商品主图
            response.data.result.basicImageUrl.forEach((item,i)=>{
              item.url = item.imageUrl;
              item.resourcesId = item.fileId;
              this.imgList1.push(item);
            })
            //天猫无线图
            response.data.result.wirelessImageUrl.forEach((item,i)=>{
              item.url = item.imageUrl;
              item.resourcesId = item.fileId;
              this.imgList2.push(item);
            })
            //天猫素材透明图
            response.data.result.materialImageUrl.forEach((item,i)=>{
              item.url = item.imageUrl;
              item.resourcesId = item.fileId;
              this.imgList3.push(item);
            })
            //天猫平台信息
            if(response.data.result.tsGoodsTmallPO){
              this.goodsTmallInfo = {
                goodsName:response.data.result.tsGoodsTmallPO.goodsName?response.data.result.tsGoodsTmallPO.goodsName:response.data.result.goodsName,
                sellPoint:response.data.result.tsGoodsTmallPO.sellPoint?response.data.result.tsGoodsTmallPO.sellPoint:response.data.result.sellPoint,
                goodsQty:response.data.result.tsGoodsTmallPO.goodsQty || response.data.result.tsGoodsTmallPO.goodsQty === 0 ?response.data.result.tsGoodsTmallPO.goodsQty:response.data.result.goodsQty,
                salesPrice:response.data.result.tsGoodsTmallPO.salesPrice || response.data.result.tsGoodsTmallPO.salesPrice === 0 ?response.data.result.tsGoodsTmallPO.salesPrice:response.data.result.salesPrice,
                goodsCode:response.data.result.tsGoodsTmallPO.goodsCode,
                deliveryTimeType:response.data.result.tsGoodsTmallPO.deliveryTimeType,
                relatDeliveryTime:response.data.result.tsGoodsTmallPO.relatDeliveryTime,
                fixDeliveryTime:response.data.result.tsGoodsTmallPO.fixDeliveryTime?response.data.result.tsGoodsTmallPO.fixDeliveryTime:'',
                goodsId:response.data.result.tsGoodsTmallPO.goodsId
              }
            }else{
              this.goodsTmallInfo = {
                goodsName:response.data.result.goodsName,
                sellPoint:response.data.result.sellPoint,
                goodsQty:response.data.result.goodsQty,
                salesPrice:response.data.result.salesPrice,
              }
            }
            if(response.data.result.catalog){
              var catalogId = response.data.result.catalog.reverse();
              if(response.data.result.tsGoodsTmallPO.catalogId)catalogId.push(response.data.result.tsGoodsTmallPO.catalogId);
              this.catalogId = catalogId;
            }
            //京东平台信息
            if(response.data.result.tsGoodsJdPO){
              this.goodsJdInfo = {
                goodsName:response.data.result.tsGoodsJdPO.goodsName?response.data.result.tsGoodsJdPO.goodsName:response.data.result.goodsName,
                sellPoint:response.data.result.tsGoodsJdPO.sellPoint?response.data.result.tsGoodsJdPO.sellPoint:response.data.result.sellPoint,
                goodsQty:response.data.result.tsGoodsJdPO.goodsQty || response.data.result.tsGoodsJdPO.goodsQty === 0 ?response.data.result.tsGoodsJdPO.goodsQty:response.data.result.goodsQty,
                salesPrice:response.data.result.tsGoodsJdPO.salesPrice || response.data.result.tsGoodsJdPO.salesPrice === 0 ?response.data.result.tsGoodsJdPO.salesPrice:response.data.result.salesPrice,
                goodsCode:response.data.result.tsGoodsJdPO.goodsCode,
                discount:response.data.result.tsGoodsJdPO.discount || response.data.result.tsGoodsJdPO.discount === 0 ?response.data.result.tsGoodsJdPO.discount:'',
                marketPrice:response.data.result.tsGoodsJdPO.marketPrice || response.data.result.tsGoodsJdPO.marketPrice === 0 ?response.data.result.tsGoodsJdPO.marketPrice:response.data.result.marketPrice,
                goodsLength:response.data.result.tsGoodsJdPO.goodsLength || response.data.result.tsGoodsJdPO.goodsLength === 0 ?response.data.result.tsGoodsJdPO.goodsLength:'',
                goodsWidth:response.data.result.tsGoodsJdPO.goodsWidth || response.data.result.tsGoodsJdPO.goodsWidth === 0 ?response.data.result.tsGoodsJdPO.goodsWidth:'',
                goodsHeight:response.data.result.tsGoodsJdPO.goodsHeight || response.data.result.tsGoodsJdPO.goodsHeight === 0 ?response.data.result.tsGoodsJdPO.goodsHeight:'',
                density:response.data.result.tsGoodsJdPO.density || response.data.result.tsGoodsJdPO.density === 0 ?response.data.result.tsGoodsJdPO.density:'',
                oneCatalog:response.data.result.tsGoodsJdPO.oneCatalog,
                goodsId:response.data.result.tsGoodsJdPO.goodsId
              }
              if(this.goodsJdInfo.salesPrice && this.goodsJdInfo.marketPrice){
                this.goodsJdInfo.discount = priceValidator(this.goodsJdInfo.salesPrice*100/this.goodsJdInfo.marketPrice);
              }else{
                this.goodsJdInfo.discount = '';
              }
            }else{
              this.goodsJdInfo = {
                goodsName:response.data.result.goodsName,
                sellPoint:response.data.result.sellPoint,
                goodsQty:response.data.result.goodsQty,
                salesPrice:response.data.result.salesPrice,
                marketPrice:  response.data.result.marketPrice,
              }
            }
            if(response.data.result.tsGoodsJdPO && response.data.result.tsGoodsJdPO.oneCatalog){
              this.oneCatalogChannel('一级',response.data.result.tsGoodsJdPO.twoCatalog,response.data.result.tsGoodsJdPO.threeCatalog);
            }
            //天猫类目属性
            if(response.data.result.tsGoodsTmallPO && response.data.result.tsGoodsTmallPO.catalogId){
              this.cascaderEcho(response.data.result.tsGoodsTmallPO.goodsId);
            }
            //京东类目属性
            if(response.data.result.tsGoodsJdPO && response.data.result.tsGoodsJdPO.threeCatalog){
              this.jdCatalogEcho(response.data.result.tsGoodsJdPO.goodsId,response.data.result.tsGoodsJdPO.threeCatalog);
            }
            setTimeout(()=>{
              this.sightcing = 1;
            })
          }else{
            this.loading = false;
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //达尔文信息回显
      darwinEcho(){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsAffilatedService/" + this.version+ "/showAffilatedInfo",{
          tsGoodsId:this.tsGoodsId
        }).then((response)=>{
          if(response.data.success){
            this.darwinProductJson = response.data.result;
            this.oldProductId = response.data.result.productId;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //淘宝类目回显
      cascaderEcho(goodsId){
        this.loading = true;
        this.goodsTmallInfo.catalogId = this.catalogId[this.catalogId.length-1];
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selTmallKeyProps",{
          catalogId:this.goodsTmallInfo.catalogId,
          goodsId
        }).then((response)=>{
          this.loading = false;
          if(response.data.success){
            response.data.result.isKey = response.data.result.isKey?response.data.result.isKey:[];
            response.data.result.isKey.forEach((item,i)=>{
              item.platformAttributeValueId = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.platformAttributeValueId:'';//属性值id
              item.attributeValue = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.attributeValue:'';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            response.data.result.notKey = response.data.result.notKey?response.data.result.notKey:[];
            response.data.result.notKey.forEach((item,i)=>{
              item.platformAttributeValueId = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.platformAttributeValueId:'';//属性值id
              item.attributeValue = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.attributeValue:'';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            this.tmallIsKeyArr = response.data.result.isKey;
            this.tmallNotKeyArr = response.data.result.notKey;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //京东类目回显
      jdCatalogEcho(goodsId,threeCatalog){
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selJdKeyProps",{
          catalogId :threeCatalog,
          goodsId
        }).then((response)=>{
          this.loading = false;
          if(response.data.success){
            //关键属性
            response.data.result.isKey = response.data.result.isKey?response.data.result.isKey:[];
            response.data.result.isKey.forEach((item,i)=>{
              item.platformAttributeValueId = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.platformAttributeValueId:'';//属性值id
              item.attributeValue = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.attributeValue:'';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            this.jdIsKeyArr = response.data.result.isKey;
            //不变属性
            response.data.result.invariantKey = response.data.result.invariantKey?response.data.result.invariantKey:[];
            response.data.result.invariantKey.forEach((item,i)=>{
              item.platformAttributeValueId = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.platformAttributeValueId:'';//属性值id
              item.attributeValue = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.attributeValue:'';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            this.jdInvariantKey = response.data.result.invariantKey;
            //可变属性
            response.data.result.chanelKey = response.data.result.chanelKey?response.data.result.chanelKey:[];
            response.data.result.chanelKey.forEach((item,i)=>{
              item.platformAttributeValueId = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.platformAttributeValueId:'';//属性值id
              item.attributeValue = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.attributeValue:'';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            this.jdVariantKey = response.data.result.chanelKey;
            //销售属性
            /*response.data.result.sellKey = response.data.result.sellKey?response.data.result.sellKey:[];
            response.data.result.sellKey.forEach((item,i)=>{
              item.platformAttributeValueId = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.platformAttributeValueId:'';//属性值id
              item.attributeValue = item.tsGoodsAttributeValuePO?item.tsGoodsAttributeValuePO.attributeValue:'';//属性值
            })
            this.jdSellKey = response.data.result.sellKey;*/
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      scrollFn(){
        var self = this;
        $('.goodsDetail').on('scroll',function () {
          var h1 =  self.$refs.title1.offsetTop,
            h2 = self.$refs.title2.offsetTop,
            h3 = self.$refs.title3.offsetTop;
          if ($('.goodsDetail').scrollTop() > h1 && $('.goodsDetail').scrollTop() < h2) {
            self.titleData.map(function (v, i) {
              i == 0 ? v.iscur = true : v.iscur = false;
            });
          }
          if ($('.goodsDetail').scrollTop() > h2 && $('.goodsDetail').scrollTop() < h3) {
            self.titleData.map(function (v, i) {
              i == 1 ? v.iscur = true : v.iscur = false;
            });
          }
          if ($('.goodsDetail').scrollTop() > h3) {
            self.titleData.map(function (v, i) {
              i == 2 ? v.iscur = true : v.iscur = false;
            });
          }
        })
      },
      changeChannel(keyArr,i,id,arr,type){
        let propId = '';//所选属性id
        arr.forEach((item,index)=>{
          if(type == 'pdd'){
            if(item.vid == id){
              this[keyArr][i].attributeValue = item.value;
              propId = this[keyArr][i].attrId;
            }
          }else{
            if(item.platformAttributeValueId == id){
              this[keyArr][i].attributeValue = item.attributeValueName;
            }
          }
        })
        //console.log(this[keyArr]);
        if(type != 'pdd'){
          return false;
        }
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selPddChildKeyProps",{
          catalogId:this.goodsPddInfo.threeCatalogId,
          propId,
          vid:id
        }).then((response)=>{
          if(response.data.success){
            response.data.result = response.data.result?response.data.result:[];
            response.data.result.forEach(item=>{
              item.platformAttributeValueId = '';//属性值id
              item.attributeValue = '';//属性值
              item.valuesJsonList = item.valuesJson?JSON.parse(item.valuesJson):[];
              if(item.maxValue == ''){item.maxValue = 10000000000;}else{item.maxValue*=1;}
              if(item.minValue == ''){item.minValue = 0;}else{item.minValue*=1;}
              if(item.valuePrecision >100){item.valuePrecision = 10;}
              if(item.controlType == 12){
                //二维
                item.attributeValue1 = '';
                item.attributeValue2 = '';
              }
            })
            //重置删除子集下拉
            for(var j = this.commonProp.length;j--;j>=0){
              if(this.commonProp[j].parentId == propId){
                this.commonProp.splice(j,1);
              }
            }
            //push添加子集下拉
            response.data.result.forEach(item => {
              this.commonProp.splice(i+1,0,item);
            })
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      initCategory(){
        //淘宝类目
        this.loading = true;
        var catalogList = [];
        if(localStorage.getItem('catalogList')){
          catalogList = JSON.parse(localStorage.getItem('catalogList'));
        }
        if(catalogList.length > 0){
          this.catalogList = catalogList;
          this.catalogList.forEach((item,i)=>{
            this.catalogIdObj[item.catalogId] = item.platformCatalogId;
            item.children=item.childCatalog;
            item.value=item.catalogId;
            item.label=item.catalogName;
            if(item.childCatalog){
              item.childCatalog.forEach((item2,i)=>{
                this.catalogIdObj[item2.catalogId] = item2.platformCatalogId;
                item2.children=item2.childCatalog;
                item2.value=item2.catalogId;
                item2.label=item2.catalogName;
                if(item2.childCatalog){
                  item2.childCatalog.forEach((item3,i)=>{
                    this.catalogIdObj[item3.catalogId] = item3.platformCatalogId;
                    item3.children=item3.childCatalog;
                    item3.value=item3.catalogId;
                    item3.label=item3.catalogName;
                    if(item3.childCatalog){
                      item3.childCatalog.forEach((item4,i)=>{
                        this.catalogIdObj[item4.catalogId] = item4.platformCatalogId;
                        item4.value=item4.catalogId;
                        item4.label=item4.catalogName;
                      })
                    }
                  })
                }
              })
            }
          })
          //京东一级类目
          this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selJdCatalog").then((response)=>{
            if(response.data.success){
              this.oneCatalogList = response.data.result;
              //省级下拉
              this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/selectAllProvince").then((response)=>{
                if(response.data.success){
                  this.provinceList = response.data.result;
                  if(this.titleName == '修改'){
                    //回显
                    this.echoInit();
                  }else{
                    this.loading = false;
                  }
                }else{
                  this.loading = false;
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            }else{
              this.loading = false;
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }else{
          this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selTmallPlatFormCatalog").then((response)=>{
            //this.loading = false;
            if(response.data.success){
              this.catalogList = response.data.result;
              this.catalogList.forEach((item,i)=>{
                this.catalogIdObj[item.catalogId] = item.platformCatalogId;
                item.children=item.childCatalog;
                item.value=item.catalogId;
                item.label=item.catalogName;
                if(item.childCatalog){
                  item.childCatalog.forEach((item2,i)=>{
                    this.catalogIdObj[item2.catalogId] = item2.platformCatalogId;
                    item2.children=item2.childCatalog;
                    item2.value=item2.catalogId;
                    item2.label=item2.catalogName;
                    if(item2.childCatalog){
                      item2.childCatalog.forEach((item3,i)=>{
                        this.catalogIdObj[item3.catalogId] = item3.platformCatalogId;
                        item3.children=item3.childCatalog;
                        item3.value=item3.catalogId;
                        item3.label=item3.catalogName;
                        if(item3.childCatalog){
                          item3.childCatalog.forEach((item4,i)=>{
                            this.catalogIdObj[item4.catalogId] = item4.platformCatalogId;
                            item4.value=item4.catalogId;
                            item4.label=item4.catalogName;
                          })
                        }
                      })
                    }
                  })
                }
              })
              //京东一级类目
              this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selJdCatalog").then((response)=>{
                if(response.data.success){
                  this.oneCatalogList = response.data.result;
                  //省级下拉
                  this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/selectAllProvince").then((response)=>{
                    if(response.data.success){
                      this.provinceList = response.data.result;
                      if(this.titleName == '修改'){
                        //回显
                        this.echoInit();
                      }else{
                        this.loading = false;
                      }
                    }else{
                      this.loading = false;
                      this.$message({
                        message: response.data.msg,
                        type: 'warning'
                      });
                    }
                  })
                }else{
                  this.loading = false;
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            }else{
              this.loading = false;
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      //淘宝类目选择
      channelCascader(){
        this.loading = true;
        this.goodsTmallInfo.catalogId = this.catalogId[this.catalogId.length-1];
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selTmallKeyProps",{
          catalogId:this.goodsTmallInfo.catalogId
        }).then((response)=>{
          this.loading = false;
          if(response.data.success){
            response.data.result.isKey = response.data.result.isKey?response.data.result.isKey:[];
            response.data.result.isKey.forEach((item,i)=>{
              item.platformAttributeValueId = '';//属性值id
              item.attributeValue = '';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            response.data.result.notKey = response.data.result.notKey?response.data.result.notKey:[];
            response.data.result.notKey.forEach((item,i)=>{
              item.platformAttributeValueId = '';//属性值id
              item.attributeValue = '';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            this.tmallIsKeyArr = [];
            this.tmallNotKeyArr = [];
            setTimeout(()=>{
              this.tmallIsKeyArr = response.data.result.isKey;
              this.tmallNotKeyArr = response.data.result.notKey;
            })
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      tmallRefresh(){
        if(!this.goodsTmallInfo.catalogId){
          this.$message({
            message: '请选择淘宝类目！',
            type: 'warning'
          });
          return false;
        }
        this.loading = true;
        setTimeout(()=>{
          this.loading = false;
        },3000)
        return false;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/refTmallKeyPorpsByCatalogId",{
          catalogId:this.goodsTmallInfo.catalogId
        }).then((response)=>{;
          if(response.data.success){
            this.channelCascader();
          }else{
            this.loading = false
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //京东一级类目
      oneCatalogChannel(item1,item2,item3){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selJdCatalog",{
          catalogId :this.goodsJdInfo.oneCatalog
        }).then((response)=>{
          if(response.data.success){
            this.twoCatalogList = response.data.result;
            this.goodsJdInfo.twoCatalog = '';
            this.threeCatalogList = [];
            this.goodsJdInfo.threeCatalog = '';
            if(item1 == '一级'){
              this.goodsJdInfo.twoCatalog = item2;
              if(this.goodsJdInfo.twoCatalog){
                this.twoCatalogChannel('二级',item3);
              }
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //京东二级类目
      twoCatalogChannel(item1,item2){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selJdCatalog",{
          catalogId :this.goodsJdInfo.twoCatalog
        }).then((response)=>{
          if(response.data.success){
            this.threeCatalogList = response.data.result;
            this.goodsJdInfo.threeCatalog = '';
            if(item1 == '二级'){
              this.goodsJdInfo.threeCatalog = item2;
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //京东类目选择
      threeCatalogChannel(){
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/selJdKeyProps",{
          catalogId :this.goodsJdInfo.threeCatalog,
        }).then((response)=>{
          this.loading = false;
          if(response.data.success){
            //关键属性
            response.data.result.isKey = response.data.result.isKey?response.data.result.isKey:[];
            response.data.result.isKey.forEach((item,i)=>{
              item.platformAttributeValueId = '';//属性值id
              item.attributeValue = '';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            //不变属性
            response.data.result.invariantKey = response.data.result.invariantKey?response.data.result.invariantKey:[];
            response.data.result.invariantKey.forEach((item,i)=>{
              item.platformAttributeValueId = '';//属性值id
              item.attributeValue = '';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            //可变属性
            response.data.result.chanelKey = response.data.result.chanelKey?response.data.result.chanelKey:[];
            response.data.result.chanelKey.forEach((item,i)=>{
              item.platformAttributeValueId = '';//属性值id
              item.attributeValue = '';//属性值
              item.tsAttributeValueDefinePOS = item.tsAttributeValueDefinePOS?item.tsAttributeValueDefinePOS:[];
              item.tsAttributeValueDefinePOS.forEach(item2=>{
                item2.value = item2.platformAttributeValueId;
                item2.label = item2.attributeValueName;
              })
            })
            this.jdIsKeyArr = [];
            this.jdInvariantKey = [];
            this.jdVariantKey = [];
            setTimeout(()=>{
              this.jdIsKeyArr = response.data.result.isKey;
              this.jdInvariantKey = response.data.result.invariantKey;
              this.jdVariantKey = response.data.result.chanelKey;
            })
            //销售属性
            /*response.data.result.sellKey = response.data.result.sellKey?response.data.result.sellKey:[];
            response.data.result.sellKey.forEach((item,i)=>{
              item.platformAttributeValueId = '';//属性值id
              item.attributeValue = '';//属性值
            })
            this.jdSellKey = response.data.result.sellKey;*/
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      jdRefresh(){
        if(!this.goodsJdInfo.threeCatalog){
          this.$message({
            message: '请选择京东类目！',
            type: 'warning'
          });
          return false;
        }
        this.loading = true;
        setTimeout(()=>{
          this.loading = false;
        },3000)
        return false;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/" + this.version+ "/refJdKeyPorpsByCatalogId",{
          catalogId:this.goodsJdInfo.threeCatalog
        }).then((response)=>{
          if(response.data.success){
            this.threeCatalogChannel();
          }else{
            this.loading = false;
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //挂靠
      subordinateBtn(){
        if(!this.goodsTmallInfo.catalogId){
          this.$message({
            message: '请选择淘宝类目！',
            type: 'warning'
          });
          return false;
        }
        let attrsJson = [];
        this.tmallIsKeyArr.forEach((item,i)=>{
          if(item.attributeValue){
            if(item.showType == 1){
            //下拉
              /*var obj={
                keyId:item.platformAttributeId,
                keyValue:''
              }
              item.tsAttributeValueDefinePOS.forEach((item2,i)=>{
                if(item2.attributeValueId == item.platformAttributeValueId){
                  obj.keyValue = item2.platformAttributeValueId
                }
              })*/
              attrsJson.push({
                keyId:item.platformAttributeId,
                keyValue:item.platformAttributeValueId
              });
            }else{
              attrsJson.push({
                keyId:item.platformAttributeId,
                keyValue:item.attributeValue
              })
            }
          }
        })
        this.tmallNotKeyArr.forEach((item,i)=>{
          if(item.attributeValue){
            if(item.showType == 1){
              //下拉
             /* var obj={
                keyId:item.platformAttributeId,
                keyValue:''
              }
              item.tsAttributeValueDefinePOS.forEach((item2,i)=>{
                if(item2.attributeValueId == item.platformAttributeValueId){
                  obj.keyValue = item2.platformAttributeValueId
                }
              })*/
              attrsJson.push({
                keyId:item.platformAttributeId,
                keyValue:item.platformAttributeValueId
              });
            }else{
              attrsJson.push({
                keyId:item.platformAttributeId,
                keyValue:item.attributeValue
              })
            }
          }
        })
        /*platFormCatalogId:this.catalogIdObj[this.goodsTmallInfo.catalogId],
          attrsJson:JSON.stringify(attrsJson)*/
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsAffilatedService/" + this.version+ "/affilatedByGoodsAttrs",{
          platFormCatalogId:this.catalogIdObj[this.goodsTmallInfo.catalogId],
          attrsJson:JSON.stringify(attrsJson)
        }).then((response)=>{
          this.loading = false;
          if(response.data.success){
            this.subordinateList = response.data.result;
            this.$message({
              message: '挂靠成功！',
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
      //挂靠change
      subordinateChange(){
        this.subordinateList.forEach((item,i)=>{
          if(this.subordinatePro == item.productId){
            this.darwinProductJson = item;
          }
        })
      },
      //发货地省级联动
      provinceChange(item1,item2) {
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/selectAllCity",{
          districtId:this.goodsParam.prov
        }).then((response)=>{
          if(response.data.success){
            this.cityList = response.data.result;
            if(item1 == 'fanhu'){
              this.goodsParam.districtId = item2;
              this.loading = false;
            }else{
              this.goodsParam.districtId = '';
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //取消
      channelCancel(){
        if(this.source == 'goodsManage'){
          if(process.env.NODE_ENV=='development'){
            this.$router.push({path:'/goodsManage'});
          }else{
            MainTab.closeTabAndGoto('2E16698022F94E8F8A2308CF529E9F1E','商品管理');
          }
        }else{
          if(process.env.NODE_ENV=='development'){
            this.$router.push({path:'/limitDetection/'+ this.source});
          }else{
            //MainTab.createTab('release','宝贝发布',process.env.API_PAGE+'release');
            var source = this.source.replace(/,/g,'');
            MainTab.closeTabAndGoto(source,'检测结果');
          }
        }
        //this.$emit('changeShow');
      },
      valaidateFn(obj,param,name){
        if(!(this[obj][param]+'')){
          this.$message({
            message: name+'必填！',
            type: 'warning'
          });
          return true;
        }
      },
      //保存
      channelSave(type){
        if(this.valaidateFn('goodsParam','goodsName','商品名称'))return false;
        if(this.valaidateFn('goodsParam','goodsCode','商家编码'))return false;
        if(this.valaidateFn('goodsParam','salesPrice','售价'))return false;
        if(this.valaidateFn('goodsParam','goodsQty','数量'))return false;
        if(this.goodsParam.goodsName.length > 60){
          this.$message({
            message: '商品名称最多支持输入60个字符！',
            type: 'warning'
          });
          return false;
        }
        if(this.goodsParam.sellPoint.length > 60){
          this.$message({
            message: '卖点最多支持输入60个字符！',
            type: 'warning'
          });
          return false;
        }
        if(!this.tsGoodsId){
          if(this.valaidateFn('goodsParam','districtId','发货地'))return false;
          if(this.imgList1.length == 0){
            this.$message({
              message: '至少添加一张商品图片！',
              type: 'warning'
            });
            return false;
          }
        }
        //* -------------------------- 拼多多必填校验 --------------------------- */
        /*if(!this.goodsPddInfo.threeCatalogId){
          this.$message({
            message: '请选择拼多多分类！',
            type: 'warning'
          });
          return false;
        }
        //基础属性校验必填
        var basePass = false;
        for(var i=0;i<this.commonProp.length;i++){
          if(this.commonProp[i].controlType == 0 || this.commonProp[i].controlType == 1 || this.commonProp[i].controlType == 5 || this.commonProp[i].controlType == 7){
            if(!this.commonProp[i].attributeValue && this.commonProp[i].required){
              this.$message({
                message: this.commonProp[i].nameAlias+'必填！',
                type: 'warning'
              });
              basePass = true;
              break;
            }
          }
          if(this.commonProp[i].controlType == 12){
            if((!this.commonProp[i].attributeValue1 || !this.commonProp[i].attributeValue2)  && this.commonProp[i].required){
              this.$message({
                message: this.commonProp[i].nameAlias+'必填！',
                type: 'warning'
              });
              basePass = true;
              break;
            }
          }
        }
        if(basePass)return false;
        if(this.valaidateFn('goodsPddInfo','goodsName','拼多多商品标题'))return false;
        if(this.imgList4.length == 0){
          this.$message({
            message: '至少添加一张拼多多商品轮播图！',
            type: 'warning'
          });
          return false;
        }
        if(this.imgList5.length == 0){
          this.$message({
            message: '至少添加一张拼多多商品缩略图！',
            type: 'warning'
          });
          return false;
        }
        if(this.imgList6.length == 0){
          this.$message({
            message: '至少添加一张拼多多高清缩略图！',
            type: 'warning'
          });
          return false;
        }
        if(this.tableData1.length == 0){
          this.$message({
            message: '请添加商品规格！',
            type: 'warning'
          });
          return false;
        }//商品规格
        if(this.valaidateFn('goodsPddInfo','marketPrice','拼多多市场价'))return false;*/
        if(this.tableData1.length > 0){
          var isPass = false,_this = this;
          this.channelChange(function(result){
            if(result){
              _this.$message({
                message: result,
                type: 'warning'
              });
              isPass = true;
            }
          })//商品规格价格校验
          var newArr = [];//商品规格图片校验
          console.log(this.tableData1);
          this.tableData1.forEach(item => {
            item.children.forEach(item1 => {
              newArr.push({
                imageUrl:item1.imgList[0]?item1.imgList[0].url:'',//图片
              })
            })
          })
          console.log(this.tableData1);
          for(var i=0;i<newArr.length;i++){
            if(!newArr[i].imageUrl){
              this.$message({
                message: '拼多多价格及库存第'+(i+1)+'行图片必选',
                type: 'warning'
              });
              isPass = true;
              break;
            }
          }
          if(isPass){return false}
        }
        /*if(this.valaidateFn('goodsPddInfo','grouponNum','拼多多团购人数'))return false;
        if(this.valaidateFn('goodsPddInfo','onceLimitNum','拼多多单词限量'))return false;
        if(this.valaidateFn('goodsPddInfo','limitBuyNum','拼多多限购次数'))return false;*/
        /* ----------------------------------------------------- */

        var params = JSON.parse(JSON.stringify(this.goodsParam));
        //富文本编辑器
        params.goodsDesc = $('#goodsDesc').html();

        if(this.tsGoodsId){
          //修改
          params.tsGoodsId = this.tsGoodsId;
          //图片
          var picIds = [],wirelessPicIds = [],lucencyPicId = [];
          this.imgList1.forEach(item =>{
            picIds.push(item.resourcesId);
          })
          this.imgList2.forEach(item =>{
            wirelessPicIds.push(item.resourcesId);
          })
          this.imgList3.forEach(item =>{
            lucencyPicId.push(item.resourcesId);
          })
          params.delPicids = this.delPicids.join(',');
          params.addPicIds = picIds.join(',');
          params.addWirelessPicIds = wirelessPicIds.join(',');
          params.addLucencyPicId = lucencyPicId.join(',');
        }else{
          //新增
          //图片
          var picIds = [],wirelessPicIds = [],lucencyPicId = [];
          this.imgList1.forEach(item =>{
            picIds.push(item.resourcesId);
          })
          this.imgList2.forEach(item =>{
            wirelessPicIds.push(item.resourcesId);
          })
          this.imgList3.forEach(item =>{
            lucencyPicId.push(item.resourcesId);
          })
          params.picIds = picIds.join(',');
          params.wirelessPicIds = wirelessPicIds.join(',');
          params.lucencyPicId = lucencyPicId.join(',');
        }
        //天猫信息
        params.goodsTmallAddVoJson = JSON.stringify(this.goodsTmallInfo);
        //天猫属性
        var isKeyAttributeTmJson = [],nonKeyAttributeJson = [];
        this.tmallIsKeyArr.forEach((item,i)=>{
          isKeyAttributeTmJson.push({
            platformAttributeId:item.platformAttributeId,
            platformAttributeValueId:item.platformAttributeValueId,
            attributeName:item.attributeName,
            attributeValue:item.attributeValue,
            pri:item.pri
          })
        })
        this.tmallNotKeyArr.forEach((item,i)=>{
          nonKeyAttributeJson.push({
            platformAttributeId:item.platformAttributeId,
            platformAttributeValueId:item.platformAttributeValueId,
            attributeName:item.attributeName,
            attributeValue:item.attributeValue,
            pri:item.pri
          })
        })
        params.isKeyAttributeTmJson = JSON.stringify(isKeyAttributeTmJson);
        params.nonKeyAttributeJson = JSON.stringify(nonKeyAttributeJson);
        //京东信息
        params.goodsJdAddVoJson = JSON.stringify(this.goodsJdInfo);
        //京东属性
        var isKeyAttributeJdJson = [],invariabilityAttributeJson = [],variableAttributeJson = [],saleAttributeJson = [];
        this.jdIsKeyArr.forEach((item,i)=>{
          isKeyAttributeJdJson.push({
            platformAttributeId:item.platformAttributeId,
            platformAttributeValueId:item.platformAttributeValueId,
            attributeName:item.attributeName,
            attributeValue:item.attributeValue,
            pri:item.pri
          })
        })
        this.jdInvariantKey.forEach((item,i)=>{
          invariabilityAttributeJson.push({
            platformAttributeId:item.platformAttributeId,
            platformAttributeValueId:item.platformAttributeValueId,
            attributeName:item.attributeName,
            attributeValue:item.attributeValue,
            pri:item.pri
          })
        })
        this.jdVariantKey.forEach((item,i)=>{
          variableAttributeJson.push({
            platformAttributeId:item.platformAttributeId,
            platformAttributeValueId:item.platformAttributeValueId,
            attributeName:item.attributeName,
            attributeValue:item.attributeValue,
            pri:item.pri
          })
        })
        this.jdSellKey.forEach((item,i)=>{
          saleAttributeJson.push({
            platformAttributeId:item.platformAttributeId,
            platformAttributeValueId:item.platformAttributeValueId,
            attributeName:item.attributeName,
            attributeValue:item.attributeValue,
            pri:item.pri
          })
        })
        params.isKeyAttributeJdJson = JSON.stringify(isKeyAttributeJdJson);
        params.invariabilityAttributeJson = JSON.stringify(invariabilityAttributeJson);
        params.variableAttributeJson = JSON.stringify(variableAttributeJson);
        params.saleAttributeJson = JSON.stringify(saleAttributeJson);
        //达尔文信息
        if(this.tsGoodsId){
          var darwinProductJson = JSON.parse(JSON.stringify(this.darwinProductJson));
          darwinProductJson.newProductId = darwinProductJson.productId;
          darwinProductJson.productId = this.oldProductId;
          params.darwinProductJson = JSON.stringify(darwinProductJson);
        }else{
          params.darwinProductJson = JSON.stringify(this.darwinProductJson);
        }

        /* ------------------------ 拼多多 ----------------------------- */
        //基础信息
        this.goodsPddInfo.catalogId = this.goodsPddInfo.fourCatalogId?this.goodsPddInfo.fourCatalogId:this.goodsPddInfo.threeCatalogId;
        params.goodsPddBaseJson = JSON.stringify((this.goodsPddInfo));
        var pddLbPicIds = [],pddSlPicId = [],pddGslPicId = [],pddXqPicIds = [];
        this.imgList4.forEach(item =>{
          pddLbPicIds.push(item.resourcesId);
        })
        this.imgList5.forEach(item =>{
          pddSlPicId.push(item.resourcesId);
        })
        this.imgList6.forEach(item =>{
          pddGslPicId.push(item.resourcesId);
        })
        this.imgList7.forEach(item =>{
          pddXqPicIds.push(item.resourcesId);
        })
        params.pddLbPicIds = pddLbPicIds.join(',');
        params.pddSlPicId = pddSlPicId.join(',');
        params.pddGslPicId = pddGslPicId.join(',');
        params.pddXqPicIds = pddXqPicIds.join(',');
        //基础属性
        var pddGoodsAttributeAndValueJson = [];
        this.commonProp.forEach((item,i)=>{
          pddGoodsAttributeAndValueJson.push({
            platformAttributeId:item.attrId,
            platformAttributeValueId:item.platformAttributeValueId,
            attributeName:item.nameAlias,
            attributeValue:item.attributeValue,
            attributeType:item.attributeType,
            attributeUnit:item.valueUnit?item.valueUnit.split(',')[0]:''
          })
        })
        params.pddGoodsAttributeAndValueJson = JSON.stringify(pddGoodsAttributeAndValueJson);
        //颜色、规格、自定义属性
        var goodsPddValueJson = [];
        //如果只要有一种属性并且这个属性在children里
        if(this.tableData1[0] && !this.tableData1[0].prop1.attributeValue){
          this.tableData1[0].children.forEach(item => {
            goodsPddValueJson.push({
              platformAttributeId:item.prop2.platformAttributeId,
              platformAttributeValueId:item.prop2.platformAttributeValueId,
              attributeName:item.prop2.attributeName,
              attributeValue:item.prop2.attributeValue,
              attributeType:item.prop2.attributeType,
              pddSkuDetailVOSJson:[{
                platformAttributeId:'',
                platformAttributeValueId:'',
                attributeName:'',
                attributeValue:'',
                attributeType:'',
                grouponPrice:item.grouponPrice,
                salesPrice:item.salesPrice,
                goodsQty:item.goodsQty,
                skuCode:item.skuCode,
                pddYlPicId:item.pddYlPicId,
              }]
            });
          })
        }else{
          console.log(this.tableData1);
          this.tableData1.forEach(item =>{
            var pddSkuDetailVOSJson = [];
            item.children.forEach(item1 => {
              var obj1 = {
                platformAttributeId:item1.prop2.platformAttributeId,
                platformAttributeValueId:item1.prop2.platformAttributeValueId,
                attributeName:item1.prop2.attributeName,
                attributeValue:item1.prop2.attributeValue,
                attributeType:item1.prop2.attributeType,
                grouponPrice:item1.grouponPrice,
                salesPrice:item1.salesPrice,
                goodsQty:item1.goodsQty,
                skuCode:item1.skuCode,
                pddYlPicId:item1.pddYlPicId,
                imageUrl:item1.imgList[0].url
              }
              pddSkuDetailVOSJson.push(obj1);
            })
            var obj = {
              platformAttributeId:item.prop1.platformAttributeId,
              platformAttributeValueId:item.prop1.platformAttributeValueId,
              attributeName:item.prop1.attributeName,
              attributeValue:item.prop1.attributeValue,
              attributeType:item.prop1.attributeType,
              pddSkuDetailVOSJson
            }
            goodsPddValueJson.push(obj);
          })
        }
        params.goodsPddValueJson = JSON.stringify(goodsPddValueJson);
        console.log(params);
        /* ----------------------------------------------------- */

        var paramsUrl = this.tsGoodsId?'updateGoods':'addGoods';
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/"+ paramsUrl,params).then((response)=>{
          this.loading = false;
          if(response.data.success){
            if(type == 1){
              if(this.tsGoodsId){
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
              }else{
                this.$message({
                  message: '添加成功！',
                  type: 'success'
                });
              }
              setTimeout(()=>{
                if(this.source == 'goodsManage'){
                  if(process.env.NODE_ENV=='development'){
                    this.$router.push({path:'/goodsManage'});
                  }else{
                    MainTab.closeTabAndRefresh('2E16698022F94E8F8A2308CF529E9F1E','商品管理');
                  }
                }else{
                  if(process.env.NODE_ENV=='development'){
                    this.$router.push({path:'/limitDetection/'+ this.source});
                  }else{
                    var source = this.source.replace(/,/g,'');
                    MainTab.closeTabAndRefresh(source,'检测结果');
                  }
                }
              },1000)
            }else{
              this.tsGoodsIds = this.tsGoodsId?this.tsGoodsId:response.data.result;
              this.releaseBtn();
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //商品图
      beforeAvatarUpload1(file) {
        if(file.type!='image/png' && file.type!='image/PNG' && file.type!='image/gif'  && file.type!='image/GIF' && file.type!='image/jpg'  && file.type!='image/JPG' && file.type!='image/jpeg' && file.type!='image/JPEG'){
          this.$message({
            message: '图片类型只能为gif,png,jpg,jpeg',
            type: 'warning'
          });
          return false;
        }
        if(file.size/1024>500){
          this.$message({
            message: '图片大小不能超过500K',
            type: 'warning'
          });
          return false;
        }
        if(this.imgList1.length>=5){
          this.$message({
            message: '最多上传5张图片',
            type: 'warning'
          });
          return false;
        }
      },
      handleAvatarSuccess1(response, file, fileList){
        response.url=response.resourceUrl;
        this.imgList1.push(response);
      },
      handleRemove1(file, fileList) {
        this.imgList1.forEach((item,i)=>{
          if(item.uid==file.uid){
            this.imgList1.splice(i,1)
          }
        })
        if(file.goodsImageId){
          this.delPicids.push(file.goodsImageId);
        }
      },
      //无线图
      beforeAvatarUpload2(file) {
        if(file.type!='image/png' && file.type!='image/PNG' && file.type!='image/gif'  && file.type!='image/GIF' && file.type!='image/jpg'  && file.type!='image/JPG' && file.type!='image/jpeg' && file.type!='image/JPEG'){
          this.$message({
            message: '图片类型只能为gif,png,jpg,jpeg',
            type: 'warning'
          });
          return false;
        }
        if(file.size/1024>500){
          this.$message({
            message: '图片大小不能超过500K',
            type: 'warning'
          });
          return false;
        }
        if(this.imgList2.length>=5){
          this.$message({
            message: '最多上传5张图片',
            type: 'warning'
          });
          return false;
        }
      },
      handleAvatarSuccess2(response, file, fileList){
        response.url=response.resourceUrl;
        this.imgList2.push(response);
      },
      handleRemove2(file, fileList) {
        this.imgList2.forEach((item,i)=>{
          if(item.uid==file.uid){
            this.imgList2.splice(i,1)
          }
        })
        if(file.goodsImageId){
          this.delPicids.push(file.goodsImageId);
        }
      },
      //透明素材图
      beforeAvatarUpload3(file) {
        if(file.type!='image/png' && file.type!='image/PNG' && file.type!='image/gif'  && file.type!='image/GIF' && file.type!='image/jpg'  && file.type!='image/JPG' && file.type!='image/jpeg' && file.type!='image/JPEG'){
          this.$message({
            message: '图片类型只能为gif,png,jpg,jpeg',
            type: 'warning'
          });
          return false;
        }
        if(file.size/1024>500){
          this.$message({
            message: '图片大小不能超过500K',
            type: 'warning'
          });
          return false;
        }
        if(this.imgList3.length>=5){
          this.$message({
            message: '最多上传5张图片',
            type: 'warning'
          });
          return false;
        }
      },
      handleAvatarSuccess3(response, file, fileList){
        response.url=response.resourceUrl;
        this.imgList3.push(response);
      },
      handleRemove3(file, fileList) {
        this.imgList3.forEach((item,i)=>{
          if(item.uid==file.uid){
            this.imgList3.splice(i,1)
          }
        })
        if(file.goodsImageId){
          this.delPicids.push(file.goodsImageId);
        }
      },
      setCur(index) {
        setTimeout(() => {
          this.titleData.map(function (v, i) {
            v.iscur = i == index ? true : false;
          });
        }, 60)
        //$('.goodsDetail').animate({scrollTop:this.$refs['title' + (index + 1)].offsetTop - 60})
        document.querySelector('.goodsDetail').scrollTop = this.$refs['title' + (index + 1)].offsetTop;
      },

      addCatelog(){
        if(this.releaseObj.storeId == ''){
          this.$message({
            message: '请选择店铺！',
            type: 'warning'
          });
          return false;
        }
        this.cateLogDialog = true;
        if(this.$refs.tree)this.$refs.tree.setCheckedKeys(this.releaseObj.cid.split(','));
      },
      catelogSave(){
        if(this.$refs.tree.getCheckedKeys(true).length == 0){
          this.$message({
            message: '请选择店内分类！',
            type: 'warning'
          });
          return false;
        }
        if(this.$refs.tree.getCheckedKeys(true).length > 10){
          this.$message({
            message: '店内分类最多可选择10个！',
            type: 'warning'
          });
          return false;
        }
        var catelogName = [];
        this.$refs.tree.getCheckedNodes(true).forEach((item,i)=>{
          catelogName.push(item.name);
        })
        this.releaseObj.catelogoName = catelogName.join('，');
        this.releaseObj.cid = this.$refs.tree.getCheckedKeys(true).join(',');
        this.cateLogDialog = false;
      },
      //发布弹出框
      releaseBtn(){
        this.isPublish = true;
        this.shopData = [];
        this.storeData = [];
        this.templateData=[];
        this.cidInfo = [];
        this.releaseObj={
          storeId:'',
          freightTempId:'',
          cid:'',
          platFormType:'',
          catelogoName:''
        }
      },
      //平台选择
      platFormChange(){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/getMerchantList",{
          platformType:this.releaseObj.platFormType
        }).then((response)=>{
          if (response.data.success) {
            this.storeData = response.data.result;
            this.releaseObj.storeId = '';
            this.releaseObj.freightTempId = '';
            this.releaseObj.cid = '';
            this.releaseObj.catelogoName = '';
            this.cidInfo = [];
            this.templateData = [];
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //渲染二级菜单
      shopChange(){
        let storeToken = '',nick = '';
        this.storeData.forEach(item =>{
          if(item.storeId == this.releaseObj.storeId){
            storeToken = item.storeToken;
            nick = item.nick;
          }
        })
        this.releaseObj.freightTempId = '';
        this.releaseObj.cid = '';
        this.releaseObj.catelogoName = '';
        this.cidInfo = [];
        this.templateData = [];
        //店内分类
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.PublishTaskCenterService/" + this.version+ "/getStoreCataLog",{
          storeToken,
          nick,
          platFormType:this.releaseObj.platFormType
        }).then((response)=>{
          if (response.data.success) {
            this.cidInfo = response.data.result;
            this.releaseObj.cid = '';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
        //运费模板
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.PublishTaskCenterService/" + this.version+ "/getStoreDelivTemp",{
          storeToken,
          nick,
          platFormType:this.releaseObj.platFormType
        }).then((response)=>{
          if (response.data.success) {
            this.templateData = response.data.result;
            this.releaseObj.freightTempId = '';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //确定选中
      addShopBtn(){
        if(this.releaseObj.platFormType==''){
          this.$message({
            message: '请选择平台！',
            type: 'warning'
          });
          return false;
        }else if(this.releaseObj.storeId==''){
          this.$message({
            message: '请选择店铺！',
            type: 'warning'
          });
          return false;
        }/*else if(this.releaseObj.cid==''){
          this.$message({
            message: '请选择店内分类！',
            type: 'warning'
          });
          return false;
        }*/else if(this.releaseObj.freightTempId==''){
          this.$message({
            message: '请选择运费模块',
            type: 'warning'
          });
          return false;
        }
        //平台
        this.storeData.forEach((item,i)=>{
          if(item.storeId==this.releaseObj.storeId){
            this.releaseObj.storeName=item.storeName;
          }
        })
        //模板
        this.templateData.forEach((item,i)=>{
          if(item.id==this.releaseObj.freightTempId){
            this.releaseObj.templateName=item.name;
          }
        })
        /*//店内分类
        this.cidInfo.forEach((item,i)=>{
          if(item.id == this.releaseObj.cid){
            this.releaseObj.catelogoName = item.name;
          }
        })*/
        //店铺
        var isPass=true;
        this.shopData.forEach((item,i)=>{
          if(item.storeId == this.releaseObj.storeId){
            isPass=false;
          }
        })
        if(isPass){
          this.shopData.push(JSON.parse(JSON.stringify(this.releaseObj)));
        }else{
          this.$message({
            message: '此店铺已选中，请先删除后再重新选择',
            type: 'warning'
          });
        }
      },
      //删除选中
      delStore(i){
        this.shopData.splice(i,1);
      },
      //发布
      publishShop() {
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.publish.service.PublishTaskCenterService/" + this.version+ "/publishGoods",{
          tsGoodsIds:this.tsGoodsIds,
          publishInfoJson:JSON.stringify(this.shopData)
        }).then((response)=>{
          this.loading = false;
          if (response.data.success) {
            this.$message({
              message:response.data.msg,
              type: "success"
            });
            this.isPublish = false;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
    }
  }
</script>
<style scoped>
  .fh-tag{
    background: #fff;
  }
  .el-tag{
    margin-right:10px;
  }
  .specification{
    margin-top:15px;
  }
  .classification{
    background: #FBFBFB;
    padding:15px;
  }
  .specification .title{
    background:#f4f5f9;
    padding:0 15px;
    height: 42px;
    line-height:42px;
  }
  .content{
    background: #FBFBFB;
    padding:15px;
  }
  .goodsDetail{
    height: 100%;
    overflow-y:scroll;
    padding-bottom:15px;
  }
  .goods-module>h4{
    border-bottom:1px solid #e4e7ed;
    line-height:40px;
    margin:0;
    font-weight:bold;
  }
  .goods-module .template{
    margin-top:15px;
    padding-left:10px;
  }
  .goods-module .template>label{
    display:inline-block;
    width:107px;
    text-align:right;
    margin-right:5px;
  }
  .goods-module .template>label.require:before{
    content:'*';
    margin-right: 3px;
    color:red;
  }
  .goods-module .template label.el-radio{
    width:auto;
  }
  .goods-module .template .el-input{
    width:280px;
  }
  .fixed-menu{
    width:100px;
    position:fixed;
    right:18px;
    top:300px;
    z-index:100;
  }
  .fixed-menu:hover{
    width:100px;
  }
  .fixed-menu ul li{
    height:30px;
    width:100%;
    background:#ccc;
    color:#fff;
    line-height: 30px;
    border-bottom:1px solid #fff;
    padding-left:10px;
    cursor:pointer;
  }
  .fixed-menu ul li.active{
    background:#000;
  }
</style>
<style>
  #goodsAdd .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #fff!important;
  }
  #goodsAdd .el-table .cell{
    padding-left:0 !important;
    padding-right:0 !important;
  }
  .spel-parent>.el-tabs__header {
    padding: 10px 20px;
    position: fixed;
    margin: 0 0 15px;
    width: 100%;
    background: #fff;
    z-index: 100;
    top: 0;
    left: 0;
  }
  .spel-parent .el-tabs__item {
    width: 250px;
    text-align: center;
  }
  .spel-children .el-tabs__item{
    width: auto !important;
    text-align: center;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    height:100px !important;
    width: 100px !important;
    display: flex!important;
    align-items: center;
    justify-content: center;
    float:left;
  }
  .el-upload-list--picture-card .el-upload-list__item-thumbnail{
    width: auto !important;
    max-width: 98px !important;
    height: auto !important;
    max-height: 98px !important;
  }
  .el-upload--picture-card{
    width:100px !important;
    height: 100px !important;
    line-height: 100px !important;
    margin-bottom: 8px;
  }
  .table1 .el-upload-list--picture-card .el-upload-list__item{
    height:60px !important;
    width: 60px !important;
  }
  .table1 .el-upload-list--picture-card .el-upload-list__item-thumbnail{
    max-width: 58px !important;
    max-height: 58px !important;
  }
  .table1 .el-upload--picture-card{
    width:60px !important;
    height: 60px !important;
    line-height: 68px !important;
    margin-right:8px;
  }
</style>

