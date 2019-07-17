<!--修改波次策略 尘音-->
<template>
  <div id="changeWave">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">波次策咯</a></el-breadcrumb-item>
        <el-breadcrumb-item>修改波次策咯</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--主体-->
    <div class="content">
      <div class="conTop">
        <h3>基本信息</h3>
        <div class="topCon">
          <!--搜索区-->
          <el-row>

            <el-col :span="5">
              <div class="grid-content">
                <label for="waveName">策略名称：</label>
                <el-input maxlength="50" id="waveName" v-model="waveStrategyName" placeholder=""></el-input>
                <p v-show="isWaveStrategyNameShow" style="margin-left: 65px;margin-top:3px;color: red">请填写策略名称</p>
              </div>
            </el-col>

            <el-col :span="5">
              <div class="grid-content">
                <label for="trueStock">生效仓库：</label>
                <el-select id="trueStock" v-model="storageId" filterable placeholder="请选择仓库">
                  <el-option
                    v-for="item in optionsStock"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <p v-show="isStockShow" style="margin-left: 65px;margin-top:3px;color: red">请选择生效仓库</p>
              </div>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="5">
              <div class="grid-content">
                <label>执行时间：</label>
                <el-time-picker
                  v-model="executeStartTime"
                  placeholder="选择开始时间">
                </el-time-picker>
                <p v-show="isExecuteStartTimeShow" style="margin-left: 65px;margin-top:3px;color: red">请选择执行时间</p>
              </div>
            </el-col>

            <el-col :span="5">
              <div class="grid-content">
                <label style="width: 60px;text-align: right">至：</label>
                <el-time-picker
                  v-model="executeEndTime"
                  placeholder="选择结束时间">
                </el-time-picker>
                <p v-show="isExecuteEndTimeShow" style="margin-left: 65px;margin-top:3px;color: red">请选择结束时间</p>
              </div>
            </el-col>

            <el-col :span="6">
              间隔 <input maxlength="5" @blur="intervalTime1()" class="inpNum-g" v-model="intervalTime"  type="text" @keyup="intervalTime = intervalTime.replace(/[^\d]/g,'')">
              <span v-show="intervalTime < 10" style="color: red">请输入大于10的整数</span>
              分钟生成一次波次
            </el-col>

          </el-row>
        </div>
      </div>
      <div class="conMid">
        <h3>
          <span style="display: inline-block;width: 72px">波次分类</span>
          <i>订单划分波次顺序为：自定义波次 > 大宗订单波次 > 单品订单波次 > 单件混合波次  > 多品订单波次</i>
        </h3>
        <div class="midCon">
          <div class="autoWave">
            <div class="minLeft">自定义波次：</div>
            <div class="minRight">
              <i>*自定义波次订单不满足商品数量的余单也生成波次</i>
              <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label="按快递指定" name="first">
                  <!--表格区-->
                  <div class="pDown">
                    <el-table :data="tableDataExpress" border style="width: 950px">

                      <el-table-column label="快 递" width="300">
                        <template slot-scope="scope">
                          <p class="cen-g">
                            <span v-show="false">{{ scope.row.expressIdList }}</span>
                            <span>{{ scope.row.expressNameList }}</span>
                            <el-button @click="handleExpressClick(scope.$index)" ref="del" type="text" size="small" style="color: rgb(64, 158, 255)">编辑</el-button>
                          </p>
                          <el-dialog v-dialogDrag title="请选择指定快递" :visible.sync="expressFormVisible" width="400px">
                            <ul style="overflow: auto;max-height: 300px">
                              <li style="width: 50%;float: left" v-for="(val,n) in expressForm">
                                <el-checkbox :disabled="val.disabled" type="checkbox" v-model="val.isChecked">{{val.expressName}}</el-checkbox>
                              </li>
                            </ul>
                            <div slot="footer" class="dialog-footer">
                              <el-button type="primary" @click="expressSureClick">确 定</el-button>
                            </div>
                          </el-dialog>
                        </template>
                      </el-table-column>

                      <el-table-column label="波次内商品数量（件）">
                        <template slot-scope="scope">
                          <div class="initP-g">
                            <div style="text-align: center">
                              <input
                                maxlength="4"
                                @keyup="goodsStartKeyup(scope.row,scope.$index,tableDataExpress)"
                                @blur="goodsStartQty($event,scope.row,scope.$index,tableDataExpress)"
                                @input="testGoodsStartQty($event,scope.row,scope.$index,tableDataExpress)"
                                v-model="scope.row.goodsStartQty" type="text" class="inpNum-g"
                              >
                              <span style="color: red;display: none">请输入大于0的整数</span>
                              ~
                              <input
                                maxlength="4"
                                @keyup="goodsEndKeyup(scope.row,scope.$index,tableDataExpress)"
                                @blur="goodsEndQty($event,scope.row,scope.$index,tableDataExpress)"
                                @input="testGoodsEndQty($event,scope.row,scope.$index,tableDataExpress)"
                                v-model="scope.row.goodsEndQty" type="text" class="inpNum-g"
                              >
                              <span style="color: red;display: none">请输入大于0的整数</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>

                      <el-table-column label="操 作" width="200">
                        <template slot-scope="scope">
                          <p class="cen-g">
                            <span @click="handleExpressDelete(scope.$index, tableDataExpress)" style="color: red;cursor: pointer">删除</span>
                          </p>
                        </template>
                      </el-table-column>

                    </el-table>
                    <div class="clickAdd">
                      <span @click='addClickExpress'>＋添加新指定</span>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="按订单类型指定" name="second">
                  <!--表格区-->
                  <div class="pDown">
                    <el-table :data="tableDataType" border style="width: 950px">

                      <el-table-column label="订单类型" width="300">
                        <template slot-scope="scope">
                          <p class="cen-g">
                            <span v-show="false">{{ scope.row.orderTypeList }}</span>
                            <span>{{ scope.row.orderTypeNameList }}</span>
                            <el-button @click="handleOrderClick(scope.$index)" ref="del" type="text" size="small" style="color: rgb(64, 158, 255)">编辑</el-button>
                          </p>
                          <el-dialog v-dialogDrag title="请选择指定订单类型" :visible.sync="typeFormVisible" width="400px">
                            <ul style="overflow: auto;max-height: 300px">
                              <li style="width: 50%;float: left" v-for="(val,n) in typeForm">
                                <el-checkbox :disabled="val.disabled" type="checkbox" v-model="val.isChecked">{{val.typeName}}</el-checkbox>
                              </li>
                            </ul>
                            <div slot="footer" class="dialog-footer">
                              <el-button type="primary" @click="typeSureClick">确 定</el-button>
                            </div>
                          </el-dialog>
                        </template>
                      </el-table-column>

                      <el-table-column label="波次内商品数量（件）">
                        <template slot-scope="scope">
                          <div class="initP-g">
                            <div style="margin-left: 25%">
                              <input
                                maxlength="4"
                                @keyup="goodsStartKeyup(scope.row,scope.$index,tableDataType)"
                                @blur="goodsStartQty($event,scope.row,scope.$index,tableDataType)"
                                @input="testGoodsStartQty($event,scope.row,scope.$index,tableDataType)"
                                v-model="scope.row.goodsStartQty" type="text" class="inpNum-g">
                              <span style="color: red;display: none">请输入大于0的整数</span>
                              ~
                              <input
                                maxlength="4"
                                @keyup="goodsEndKeyup(scope.row,scope.$index,tableDataType)"
                                @blur="goodsEndQty($event,scope.row,scope.$index,tableDataType)"
                                @input="testGoodsEndQty($event,scope.row,scope.$index,tableDataType)"
                                v-model="scope.row.goodsEndQty" type="text" class="inpNum-g">
                              <span style="color: red;display: none">请输入大于0的整数</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>

                      <el-table-column label="操 作" width="200">
                        <template slot-scope="scope">
                          <p class="cen-g">
                            <span @click="handleTypeDelete(scope.$index, tableDataType)" style="color: red;cursor: pointer">删除</span>
                          </p>
                        </template>
                      </el-table-column>

                    </el-table>
                    <div class="clickAdd" >
                      <span @click='addClickType'>＋添加新指定</span>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="按店铺指定" name="third">
                  <!--表格区-->
                  <div class="pDown">
                    <el-table :data="tableDataShop" border style="width: 950px">

                      <el-table-column label="所属店铺" width="300">
                        <template slot-scope="scope">
                          <p class="cen-g">
                            <span>{{ scope.row.storeNameList }}</span>
                            <span v-show="false">{{ scope.row.storeIdList }}</span>
                            <el-button @click="handleShopClick(scope.$index)" ref="del" type="text" size="small" style="color: rgb(64, 158, 255)">编辑</el-button>
                          </p>
                          <el-dialog v-dialogDrag title="请选择指定店铺" :visible.sync="shopFormVisible" width="400px">
                            <ul style="overflow: auto;max-height: 300px">
                              <li style="width: 50%;float: left" v-for="(val,n) in shopForm">
                                <el-checkbox :disabled="val.disabled" type="checkbox" v-model="val.isChecked">{{val.storeName}}</el-checkbox>
                              </li>
                            </ul>
                            <div slot="footer" class="dialog-footer">
                              <el-button type="primary" @click="shopSureClick">确 定</el-button>
                            </div>
                          </el-dialog>
                        </template>
                      </el-table-column>

                      <el-table-column label="波次内商品数量（件）">
                        <template slot-scope="scope">
                          <div class="initP-g">
                            <div style="margin-left: 25%">
                              <input
                                maxlength="4"
                                @keyup="goodsStartKeyup(scope.row,scope.$index,tableDataShop)"
                                @blur="goodsStartQty($event,scope.row,scope.$index,tableDataShop)"
                                @input="testGoodsStartQty($event,scope.row,scope.$index,tableDataShop)"
                                v-model="scope.row.goodsStartQty" type="text" class="inpNum-g">
                              <span style="color: red;display: none">请输入大于0的整数</span>
                              ~
                              <input
                                maxlength="4"
                                @keyup="goodsEndKeyup(scope.row,scope.$index,tableDataShop)"
                                @blur="goodsEndQty($event,scope.row,scope.$index,tableDataShop)"
                                @input="testGoodsEndQty($event,scope.row,scope.$index,tableDataShop)"
                                v-model="scope.row.goodsEndQty" type="text" class="inpNum-g">
                              <span style="color: red;display: none">请输入大于0的整数</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>

                      <el-table-column label="操 作" width="200">
                        <template slot-scope="scope">
                          <p class="cen-g">
                            <span @click="handleShopDelete(scope.$index, tableDataShop)" style="color: red;cursor: pointer">删除</span>
                          </p>
                        </template>
                      </el-table-column>

                    </el-table>
                    <div class="clickAdd">
                      <span @click='addClickShop'>＋添加新指定</span>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="orderWave">
            <span>大宗订单波次：</span>
            <span>单订单商品数量超过
              <input maxlength="4" ref="manySkuWaveEnd" v-model="manySkuWaveEnd" type="text" @keyup="manySkuWaveEnd = manySkuWaveEnd.replace(/[^\d]/g,'')" class="inpNum-g">
              <span v-show="manySkuWaveEnd < 1" style="color: red">请输入大于0的整数</span>
              件
            </span>
          </div>
          <div class="orderWave">
            <span>单品订单波次：</span>
            <span>单商品超过 <input maxlength="4" ref="skuOrderWaveMax" v-model="skuOrderWaveMax" type="text" @keyup="skuOrderWaveMax = skuOrderWaveMax.replace(/[^\d]/g,'')" class="inpNum-g">
              <span v-show="skuOrderWaveMax < 1" style="color: red">请输入大于0的整数</span>
              件，生成单品订单波次
            </span>

            <el-checkbox v-model="skuSingleWaveFlag" id="aloneWave" class="checkboxWave" type="checkbox"></el-checkbox>
            <label for="aloneWave" style="width: auto!important;">单品多件单独生成波次</label>
            <div style="margin-top: 10px">
              <i>*订单中仅有一种SKU，商品满足指定件数才生成单品订单波次，勾选“单品多件单独生成波次“则单品单件和单品多件分开生成波次，单品多件波次也需要满足数量限制</i>
            </div>
          </div>
          <div class="orderWave">
            <span>单件混合波次：</span>
            <span>
              波次内商品数量
              <input maxlength="4" ref="singleMingleWaveStart" v-model="singleMingleWaveStart" type="text" @keyup="singleMingleWaveStart = singleMingleWaveStart.replace(/[^\d]/g,'')" class="inpNum-g">
              <span v-show="singleMingleWaveStart < 1" style="color: red">请输入大于0的整数</span>
                ~
              <input maxlength="4" ref="singleMingleWaveEnd" v-model="singleMingleWaveEnd" type="text" @keyup="singleMingleWaveEnd = singleMingleWaveEnd.replace(/[^\d]/g,'')" class="inpNum-g">
              <span v-show="singleMingleWaveEnd < 1" style="color: red">请输入大于0的整数</span>
            </span>
            <div style="margin-top: 10px">
              <i>*仅有一件商品的订单，按照指定数量混合生成波次</i>
            </div>
          </div>
          <div class="orderWave">
            <span>多品订单波次：</span>
            <span>
              波次内商品数量
              <input maxlength="4" ref="manySkuWaveStart" v-model="manySkuWaveStart" type="text" @keyup="manySkuWaveStart = manySkuWaveStart.replace(/[^\d]/g,'')" class="inpNum-g">
              <span v-show="manySkuWaveStart < 1" style="color: red">请输入大于0的整数</span>
                ~
              <input maxlength="4" ref="manySkuWaveEnd" v-model="manySkuWaveEnd" type="text" @keyup="manySkuWaveEnd = manySkuWaveEnd.replace(/[^\d]/g,'')" class="inpNum-g">
              <span v-show="manySkuWaveEnd < 1" style="color: red">请输入大于0的整数</span>

              <el-checkbox v-model="sameSubsidiaryFlag" id="sameWave" class="checkboxWave" type="checkbox"></el-checkbox>
            <label for="sameWave" style="width: auto!important;">相同明细单独生成波次</label>
            </span>
            <div style="margin-top: 10px">
              <i>*多品订单不满足商品数量的余单也生成波次</i>
            </div>
          </div>
        </div>
      </div>
      <div class="conBot">
        <h3>
          <span style="display: inline-block;width: 72px">排除条件</span>
          <i>满足排除条件的订单不参与自动生成订单波次</i>
        </h3>
        <div class="botCon">
          <div style="display: inline-block;">
            <el-checkbox class="checkboxWave" id="check1" type="checkbox" v-model="excludeUrgencyFlag"></el-checkbox>
            <label style="width: auto!important;" for="check1">排除加急订单</label>
          </div>
          <div style="display: inline-block">
            <el-checkbox class="checkboxWave" id="check2" type="checkbox" v-model="excludeHeavyFlag"></el-checkbox>
            <label style="width: auto!important;" for="check2">排除超重商品（
              重量超过 <input v-if="excludeHeavyFlag == false" disabled v-model="heavyMax" type="number" class="inpNum-g">
              <input maxlength="3" v-if="excludeHeavyFlag == true" ref="heavyMax" v-model="heavyMax" type="number" class="inpNum-g">
              <span v-show="excludeHeavyFlag == true && heavyMax <= 0" style="color: red">请输入大于0的一位小数</span>
              kg
              ）</label>
          </div>
          <div style="display: inline-block">
            <el-checkbox class="checkboxWave" id="check3" type="checkbox" v-model="excludeBiggoodsFlag"></el-checkbox>
            <label style="width: auto!important;" for="check3">排除大件商品（
              体积超过 <input v-if="excludeBiggoodsFlag == false" disabled v-model="biggoodsVolume" type="number" class="inpNum-g">
              <input v-if="excludeBiggoodsFlag == true" ref="biggoodsVolume" v-model="biggoodsVolume" type="number" class="inpNum-g">
              <span v-show="excludeBiggoodsFlag == true && biggoodsVolume <= 0" style="color: red">请输入大于0的三位小数</span>
              cm³
              ）</label>
          </div>
        </div>
      </div>
      <!--footer-->
      <div class="wmsFoot">
        <el-button @click="backClick" size="mini">返 回</el-button>
        <el-button @click="holdClick" size="mini" type="primary">保 存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import dataTime from '@/components/common/DataTime.vue'
  export default {
    props: {
      params: Object //接收父级参数
    },
    components: {
      dataTime
    },
    data() {
      return {
        version: '1.0.0',
        optionsStock:[{value: '',label: '请选择仓库'}],//仓库下拉
        storageId: '',//生效仓库

        waveStrategyName:'',//策略名称

        timeLabel:'执行时间：',//时间组件名称
        executeStartTime: '',//开始时间
        executeEndTime:'',//结束时间

        intervalTime: 120,//间隔多少分钟生成一次波次

        activeName2: 'first',//默认显示第一个tabs
        tableDataExpress: [],//快递表格数据
        tableDataType: [],//订单类型表格数据
        tableDataShop: [],//店铺表格数据

//        bigOrderWaveMax: 30,//大宗订单波次

        skuOrderWaveMax: 30,//单品订单波茨

        skuSingleWaveFlag: true,//是否单品订单单独波茨

        singleMingleWaveStart: 25,//单件混合波次起始
        singleMingleWaveEnd: 30,//单件混合波茨结束

        manySkuWaveStart: 25,//多品订单波次起始
        manySkuWaveEnd: 30,//多品订单波茨结束
        sameSubsidiaryFlag: true,//是否相同明细单独生成波次

        excludeUrgencyFlag: true,//排除加急订单标志

        excludeHeavyFlag: false,//排除超重订单标志
        heavyMax: '',//超重值

        excludeBiggoodsFlag: false,//排除大件商品标志
        biggoodsVolume: '',//大件商品体积

        expressFormVisible: false,//选择快递弹框
        expressForm: [],//弹框快递列表
        expressNameStr: '',//已选快递
        expressIdStr: '',//已选快递id
        expressIndex:0,//编辑快递下标

        typeFormVisible: false,//选择订单类型弹框
        typeForm: [],//弹框订单类型列表
        typeNameStr: '',//已选订单类型
        typeIdStr: '',//已选订单类型id
        typeIndex:0,//编辑订单类型下标

        shopFormVisible: false,//选择店铺弹框
        shopForm: [],//弹框店铺列表
        shopNameStr: '',//已选店铺
        shopIdStr: '',//已选店铺
        shopIndex:0,//编辑店铺下标

        //判空参数
        isStockShow: false,//生效仓库校验
        isWaveStrategyNameShow: false,//策略名称校验
        isExecuteStartTimeShow: false,//执行开始时间校验
        isExecuteEndTimeShow: false,//执行结束时间校验

        //点击限制
        expressArgs: 1,//快递
        typeArgs: 1,//类型
        shopArgs: 1,//店铺

        indexExpressArr: '',//每行已选快递
        indexTypeArr: '',//每行已选类型
        indexShopArr: '',//每行已选店铺
      }
    },

    mounted() {
      this.initStock();//初始化仓库下拉
      this.initMessage();//初始化调整信息

      //大宗订单波次验证
//      this.$refs.bigOrderWaveMax.onblur = function () {
//        if(this.bigOrderWaveMax < 1) {
//          this.bigOrderWaveMax = 30;
//        }else {
//          this.bigOrderWaveMax = parseInt(this.bigOrderWaveMax)
//        }
//      }.bind(this);

      //单品订单波次验证
      this.$refs.skuOrderWaveMax.onblur = function () {
        if(this.skuOrderWaveMax < 1) {
          this.skuOrderWaveMax = 30
        }else {
          this.skuOrderWaveMax = parseInt(this.skuOrderWaveMax)
        }
      }.bind(this);

      //单品混合波次起始验证
      this.$refs.singleMingleWaveStart.onblur = function () {
        if(this.singleMingleWaveStart < 1) {
          this.singleMingleWaveStart = 25
        }else {
          this.singleMingleWaveStart = parseInt(this.singleMingleWaveStart)
        }
      }.bind(this);

      //单品混合波次结束验证
      this.$refs.singleMingleWaveEnd.onblur = function () {
        if(this.singleMingleWaveEnd < 1) {
          this.singleMingleWaveEnd = 30
        }else {
          this.singleMingleWaveEnd = parseInt(this.singleMingleWaveEnd)
        }
      }.bind(this);

      //多品订单波次起始验证
      this.$refs.manySkuWaveStart.onblur = function () {
        if(this.manySkuWaveStart < 1) {
          this.manySkuWaveStart = 25
        }else {
          this.manySkuWaveStart = parseInt(this.manySkuWaveStart)
        }
      }.bind(this);

      //多品订单波次结束验证
      this.$refs.manySkuWaveEnd.onblur = function () {
        if(this.manySkuWaveEnd < 1) {
          this.manySkuWaveEnd = 30
        }else {
          this.manySkuWaveEnd = parseInt(this.manySkuWaveEnd)
        }
      }.bind(this);

      //重量超过验证
      this.$watch('excludeHeavyFlag',function () {
        if(this.excludeHeavyFlag == true) {

          this.$refs.heavyMax.onblur = function () {
            if(this.heavyMax <= 0) {
              this.heavyMax = 0.1
            }else {
              this.heavyMax = parseFloat(this.heavyMax).toFixed(1)
            }
          }.bind(this);
        }else {
          this.heavyMax = ''
        }
      });

      //体积超过验证
      this.$watch('excludeBiggoodsFlag',function () {
        if(this.excludeBiggoodsFlag == true) {

          this.$refs.biggoodsVolume.onblur = function () {
            if(this.biggoodsVolume <= 0) {
              this.biggoodsVolume = 0.001
            }else {
              this.biggoodsVolume = parseFloat(this.biggoodsVolume).toFixed(3)
            }
          }.bind(this);
        }else {
          this.biggoodsVolume = ''
        }
      })

    },

    methods: {

      //返回父级
      showParentBlock() {
        this.$emit('changeShow',true)
      },

      //间隔时间验证
      intervalTime1: function () {
        if(this.intervalTime < 10) {
          this.intervalTime = 120
        }else {
          this.intervalTime = parseInt(this.intervalTime)
        }
      },

      //起始数值4位限制
      goodsStartKeyup: function (row,index,data) {
        row.goodsStartQty = row.goodsStartQty.replace(/[^\d]/g,'');
        let obj = data[index];
        obj.goodsStartQty = row.goodsStartQty;
        this.$set(data,index,obj);

      },

      //表格里起始数值验证--提示信息
      testGoodsStartQty: function (event,row,index,data) {
        if(row.goodsStartQty < 1) {
          $(event.path[0]).next().css('display','inline-block')
        }else {
          $(event.path[0]).next().css('display','none')
        }
      }.bind(this),

      //表格里起始数值验证
      goodsStartQty: function (event,row,index,data) {
        $(event.path[0]).next().css('display','none');
        if(row.goodsStartQty < 1) {
          let obj = data[index];
          obj.goodsStartQty = 25;
          this.$set(data, index, obj);
        }else {
          let obj = data[index];
          obj.goodsStartQty = parseInt(obj.goodsStartQty);
          this.$set(data, index, obj);
        }
      },

      //结束数值4位限制
      goodsEndKeyup: function (row,index,data) {
        row.goodsEndQty = row.goodsEndQty.replace(/[^\d]/g,'');
        let obj = data[index];
        obj.goodsEndQty = row.goodsEndQty;
        this.$set(data,index,obj);

      },

      //表格里结束数值验证--提示信息
      testGoodsEndQty: function (event,row,index) {
        if(row.goodsEndQty < 1) {
          $(event.path[0]).next().css('display','inline-block')
        }else {
          $(event.path[0]).next().css('display','none')
        }
      }.bind(this),

      //表格里结束数值验证
      goodsEndQty: function (event,row,index,data) {
        $(event.path[0]).next().css('display','none');
        if(row.goodsEndQty < 1) {
          let obj = data[index];
          obj.goodsEndQty = 30;
          this.$set(data, index, obj);
        }else {
          let obj = data[index];
          obj.goodsEndQty = parseInt(obj.goodsEndQty);
          this.$set(data, index, obj);
        }
      },

      //初始化仓库下拉
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list')
          .then(function (res) {
            if(res.data.success) {
              let arr = res.data.result;
              arr.forEach(function (val) {
                this.optionsStock.push({value: val.storageId,label: val.storageName})
              }.bind(this));
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }.bind(this));
      },

      //初始化调整信息
      initMessage: function () {
//        const id = this.$route.params.id;
        let data = {waveStrategyId: this.params.waveStrategyId};
        this._post('com.edb01.erp.wms.service.api.WmWaveStrategyService/' + this.version + '/findWmWaveStrategyBean',data).then(function (res) {
          if(res.data.success) {
            this.storageId = res.data.result.storageId;
            this.waveStrategyName = res.data.result.waveStrategyName;
            this.executeStartTime = res.data.result.startTimeForShow;
            this.executeEndTime = res.data.result.endTimeForShow;
            this.intervalTime = res.data.result.intervalTime;
//          this.bigOrderWaveMax = res.data.result.bigOrderWaveMax;
            this.skuOrderWaveMax = res.data.result.skuOrderWaveMax;
            this.skuSingleWaveFlag = res.data.result.skuSingleWaveFlag;
            this.singleMingleWaveStart = res.data.result.singleMingleWaveStart;
            this.singleMingleWaveEnd = res.data.result.singleMingleWaveEnd;
            this.manySkuWaveStart = res.data.result.manySkuWaveStart;
            this.manySkuWaveEnd = res.data.result.manySkuWaveEnd;
            this.excludeUrgencyFlag = res.data.result.excludeUrgencyFlag;
            this.excludeHeavyFlag = res.data.result.excludeHeavyFlag;
            if(res.data.result.heavyMax == undefined) {
              this.heavyMax = ''
            }else {
              this.heavyMax = res.data.result.heavyMax;
            }
            this.excludeBiggoodsFlag = res.data.result.excludeBiggoodsFlag;
            if(res.data.result.biggoodsVolume == undefined) {
              this.biggoodsVolume = ''
            }else {
              this.biggoodsVolume = res.data.result.biggoodsVolume;
            }
            this.sameSubsidiaryFlag = res.data.result.sameSubsidiaryFlag;
            this.tableDataExpress = res.data.result.expressBeanList;
            this.tableDataType = res.data.result.ordertypeBeanList;
            this.tableDataShop = res.data.result.storeBeanList;
            this.tableDataExpress.forEach(function (val) {
              val.disabled = false
            });
            this.tableDataType.forEach(function (val) {
              val.disabled = false
            });
            this.tableDataShop.forEach(function (val) {
              val.disabled = false
            })
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //快递接口
      initExpress: function (index) {
        this._post('com.edb01.erp.wms.service.api.ExpressService/' + this.version + '/listExpress')
          .then(function (res) {
            if(res.data.success) {
              res.data.result.forEach(function (val) {
                val.disabled = false;
                val.isChecked = false
              });

              let arrSum = [];
              this.tableDataExpress.forEach(function (val) {
                let arr = val.expressIdList.split(',');
                arr.forEach(function (item) {
                  arrSum.push(item)
                });

              });

              arrSum.forEach(function (val) {
                res.data.result.forEach(function (item) {
                  if(val == item.expressId) {
                    item.disabled = true;
                    item.isChecked = true
                  }
                });
              }.bind(this));

              if(this.tableDataExpress[index].expressIdList != '') {
                this.indexExpressArr = this.tableDataExpress[index].expressIdList.split(',');
                this.indexExpressArr.forEach(function (val) {
                  res.data.result.forEach(function (item,num) {

                    if(val == item.expressId) {
                      item.disabled = false;
                    }

                  }.bind(this));
                }.bind(this));
              }

              this.expressForm = res.data.result;
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }.bind(this))
      },

      //店铺接口
      initShop: function (index) {
        let data = {
          page: 1,
          size: 10000
        };
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/query',data)
          .then(function (res) {
            if(res.data.success) {
              res.data.result.rows.forEach(function (val) {
                val.disabled = false;
                val.isChecked = false
              });

              let arrSum = [];
              this.tableDataShop.forEach(function (val) {
                let arr = val.storeIdList.split(',');
                arr.forEach(function (item) {
                  arrSum.push(item)
                });

              });

              arrSum.forEach(function (val) {
                res.data.result.rows.forEach(function (item) {
                  if(val == item.storeId) {
                    item.disabled = true;
                    item.isChecked = true
                  }
                });
              }.bind(this));

              if(this.tableDataShop[index].storeIdList != '') {
                this.indexShopArr = this.tableDataShop[index].storeIdList.split(',');
                this.indexShopArr.forEach(function (val) {
                  res.data.result.rows.forEach(function (item,num) {

                    if(val == item.storeId) {
                      item.disabled = false;
                    }

                  }.bind(this));
                }.bind(this));
              }

              this.shopForm = res.data.result.rows;
              console.log(888,this.shopForm)

            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }.bind(this))
      },

      //修改接口
      initHold: function () {
//        const id = this.$route.params.id;
        let strExpress = JSON.stringify(this.tableDataExpress);
        let strShop = JSON.stringify(this.tableDataShop);
        let strType = JSON.stringify(this.tableDataType);
        let startTime = new Date(this.executeStartTime).getTime();
        let endTime = new Date(this.executeEndTime).getTime();
        let data = {
          waveStrategyId: this.params.waveStrategyId,
          storageId: this.storageId,
          waveStrategyName: this.waveStrategyName,
          executeStartTime: startTime,
          executeEndTime: endTime,
          intervalTime: this.intervalTime,
          bigOrderWaveMax: this.manySkuWaveEnd,
          skuOrderWaveMax: this.skuOrderWaveMax,
          skuSingleWaveFlag: this.skuSingleWaveFlag,
          singleMingleWaveStart: this.singleMingleWaveStart,
          singleMingleWaveEnd: this.singleMingleWaveEnd,
          manySkuWaveStart: this.manySkuWaveStart,
          manySkuWaveEnd: this.manySkuWaveEnd,
          excludeUrgencyFlag: this.excludeUrgencyFlag,
          excludeHeavyFlag:this.excludeHeavyFlag,
          heavyMax: this.heavyMax,
          excludeBiggoodsFlag: this.excludeBiggoodsFlag,
          biggoodsVolume: this.biggoodsVolume,
          sameSubsidiaryFlag: this.sameSubsidiaryFlag,
          expressBeanList: strExpress,
          storeBeanList: strShop,
          ordertypeBeanList: strType
        };
        this._post('com.edb01.erp.wms.service.api.WmWaveStrategyService/' + this.version + '/updateWmWaveStrategyBean',data)
          .then(function (res) {
            if(res.data.success) {
//              this.$router.push('/wave')

              this.$emit('changeShow',{isRefresh:true})

            }else if(res.data.code == 8000001) {
              this.$alert(res.data.msg,{
                type: 'info',
                center: true,
                confirmButtonText: '知道了',
              })
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }.bind(this))
      },

      //tab切换
      handleClick(tab, event) {
        console.log(tab, event);
      },

      //添加新指定
      addClickExpress: function () {
        let arr = [];

        this.tableDataExpress.forEach(function (val,index) {
          arr.push(index);
        }.bind(this));

        let index = arr.pop();

        if(this.tableDataExpress.length == 0) {
          this.tableDataExpress.push({expressIdList: '',expressNameList: '请选择指定快递'});
          this.tableDataExpress[0].goodsStartQty = 25;
          this.tableDataExpress[0].goodsEndQty = 30;
        }else {
          if(this.tableDataExpress[index].expressNameList == '请选择指定快递') {
            this.$alert('请选择指定快递!', '提示', {
              confirmButtonText: '确定',
              center: true,
            })
          }else {
            this.tableDataExpress.push({expressIdList: '',expressNameList: '请选择指定快递'});
            this.tableDataExpress[index + 1].goodsStartQty = 25;
            this.tableDataExpress[index + 1].goodsEndQty = 30;
          }

        }
      },
      addClickType: function () {
        let arr = [];

        this.tableDataType.forEach(function (val,index) {
          arr.push(index);
        });

        let index = arr.pop();

        if(this.tableDataType.length == 0){
          this.tableDataType.push({orderTypeList: '',orderTypeNameList: '请选择指定订单类型'});
          this.tableDataType[0].goodsStartQty = 25;
          this.tableDataType[0].goodsEndQty = 30;
        }else {
          if(this.tableDataType[index].orderTypeNameList == '请选择指定订单类型') {
            this.$alert('请选择指定订单类型!', '提示', {
              confirmButtonText: '确定',
              center: true,
            })
          }else {
            this.tableDataType.push({orderTypeList: '',orderTypeNameList: '请选择指定订单类型'});
            this.tableDataType[index + 1].goodsStartQty = 25;
            this.tableDataType[index + 1].goodsEndQty = 30;
          }
        }

      },
      addClickShop: function () {
        let arr = [];

        this.tableDataShop.forEach(function (val,index) {
          arr.push(index);
        });

        let index = arr.pop();

        if(this.tableDataShop.length == 0) {
          this.tableDataShop.push({storeIdList: '',storeNameList: '请选择指定店铺'});
          this.tableDataShop[0].goodsStartQty = 25;
          this.tableDataShop[0].goodsEndQty = 30;
        }else {
          if(this.tableDataShop[index].storeNameList == '请选择指定店铺') {
            this.$alert('请选择指定店铺!', '提示', {
              confirmButtonText: '确定',
              center: true,
            })
          }else {
            this.tableDataShop.push({storeIdList: '',storeNameList: '请选择指定店铺'});
            this.tableDataShop[index + 1].goodsStartQty = 25;
            this.tableDataShop[index + 1].goodsEndQty = 30;
          }
        }

      },

      //按快递编辑
      handleExpressClick: function (index) {
        this.expressArgs = 1;
        this.expressIndex = index;
        this.expressNameStr = '';
        this.expressIdStr = '';

        this.expressFormVisible = true;
        if(this.expressForm.length == 0) {
          this.initExpress(index)
        }else {
          if(this.tableDataExpress[index].expressIdList != '') {
            this.indexExpressArr = this.tableDataExpress[index].expressIdList.split(',');
            this.indexExpressArr.forEach(function (val) {
              this.expressForm.forEach(function (item,num) {

                if(val == item.expressId) {
                  item.disabled = false
                }

              }.bind(this));
            }.bind(this));
          }

        }
      },

      //快递弹框确定
      expressSureClick: function () {
        if(this.expressArgs == 1) {
          console.log(this.expressForm);

          if(this.expressForm.length != 0) {

            this.expressForm.forEach(function (val,index) {

              if(val.isChecked) {

                if(!val.disabled) {
                  this.expressNameStr += val.expressName + '、';
                  this.expressIdStr += val.expressId + ',';
                }

                val.disabled = true;
              }

            }.bind(this));
            this.expressNameStr = this.expressNameStr.substr(0, this.expressNameStr.length - 1);
            this.expressIdStr = this.expressIdStr.substr(0, this.expressIdStr.length - 1);

            if(this.expressNameStr != '') {
              this.tableDataExpress[this.expressIndex].expressNameList = this.expressNameStr;
              this.tableDataExpress[this.expressIndex].expressIdList = this.expressIdStr;
              this.expressFormVisible = false;
              this.expressArgs = 2
            }else {
              this.$alert('请选择指定快递!', '提示', {
                confirmButtonText: '确定',
                center: true,
              })
            }

          }
        }
      },

      //快递删除
      handleExpressDelete: function (index, rows) {
        let arr = [];
        arr = rows[index].expressIdList.split(',');

        arr.forEach(function (val) {
          this.expressForm.forEach(function (item) {
            if(val == item.expressId) {
              item.disabled = false;
              item.isChecked = false
            }
          });
        }.bind(this));
        rows.splice(index, 1);
        this.$message({
          message: '删除成功！',
          type: 'success'
        });

      },

      //按订单类型编辑
      handleOrderClick: function (index) {
        this.typeArgs = 1;

        this.typeIndex = index;
        this.typeNameStr = '';
        this.typeIdStr = '';
        this.typeFormVisible = true;
        if(this.typeForm.length == 0) {
          let arr = [
            {id: 1,typeName: '正常订单',disabled: false,isChecked: false},
            {id: 2,typeName: '预售订单',disabled: false,isChecked: false},
            {id: 3,typeName: '换货订单',disabled: false,isChecked: false},
            {id: 4,typeName: '补发订单',disabled: false,isChecked: false},
            {id: 5,typeName: '定金订单',disabled: false,isChecked: false}
          ];
          let arrSum = [];
          this.tableDataType.forEach(function (val) {
            let arr = val.orderTypeList.split(',');
            arr.forEach(function (item) {
              arrSum.push(item)
            });

          });

          arrSum.forEach(function (val) {
            arr.forEach(function (item) {
              if(val == item.id) {
                item.disabled = true;
                item.isChecked = true
              }
            });
          }.bind(this));
          if(this.tableDataType[index].orderTypeList != '') {
            this.indexTypeArr = this.tableDataType[index].orderTypeList.split(',');
            this.indexTypeArr.forEach(function (val) {
              arr.forEach(function (item,num) {

                if(val == item.id) {
                  item.disabled = false;
                }

              }.bind(this));
            }.bind(this));
          }

          this.typeForm = arr
        }else {
          if(this.tableDataType[index].orderTypeList != '') {
            this.indexTypeArr = this.tableDataType[index].orderTypeList.split(',');
            this.indexTypeArr.forEach(function (val) {
              this.typeForm.forEach(function (item,num) {

                if(val == item.id) {
                  item.disabled = false
                }

              }.bind(this));
            }.bind(this));
          }
        }

      },

      //订单类型弹框确定
      typeSureClick: function () {
        if(this.typeArgs == 1) {
          if(this.typeForm.length != 0) {
            this.typeForm.forEach(function (val) {
              if(val.isChecked) {
                if(!val.disabled) {
                  this.typeNameStr += val.typeName + '、';
                  this.typeIdStr += val.id + ',';
                }

                val.disabled = true;

              }
            }.bind(this));
            this.typeNameStr = this.typeNameStr.substr(0, this.typeNameStr.length - 1);
            this.typeIdStr = this.typeIdStr.substr(0, this.typeIdStr.length - 1);

            if(this.typeNameStr != '') {
              this.tableDataType[this.typeIndex].orderTypeNameList =  this.typeNameStr;
              this.tableDataType[this.typeIndex].orderTypeList = this.typeIdStr;
              this.typeFormVisible = false;
              this.typeArgs = 2
            }else {
              this.$alert('请选择指定订单类型!', '提示', {
                confirmButtonText: '确定',
                center: true,
              })
            }
          }
        }
      },

      //订单类型删除
      handleTypeDelete: function (index,rows) {
        let arr = [];
        arr = rows[index].orderTypeList.split(',');
        arr.forEach(function (val) {
          this.typeForm.forEach(function (item) {
            if(val == item.id) {
              item.disabled = false;
              item.isChecked = false
            }
          });
        }.bind(this));
        rows.splice(index, 1);
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      },

      //按店铺编辑
      handleShopClick: function (index) {
        this.shopArgs = 1;
        this.shopIndex = index;
        this.shopNameStr = '';
        this.shopIdStr = '';
        this.shopFormVisible = true;
        if(this.shopForm.length == 0) {
          this.initShop(index)
        }else {
          if(this.tableDataShop[index].storeIdList != '') {
            this.indexShopArr = this.tableDataShop[index].storeIdList.split(',');
            this.indexShopArr.forEach(function (val) {
              this.shopForm.forEach(function (item,num) {

                if(val == item.storeId) {
                  item.disabled = false
                }

              }.bind(this));
            }.bind(this));
          }

        }
      },

      //店铺弹框确定
      shopSureClick: function () {
        if(this.shopArgs == 1) {
          if(this.shopForm.length != 0) {
            this.shopForm.forEach(function (val) {
              if(val.isChecked) {
                if(!val.disabled) {
                  this.shopNameStr += val.storeName + '、';
                  this.shopIdStr += val.storeId + ','
                }

                val.disabled = true;

              }

            }.bind(this));

            this.shopNameStr = this.shopNameStr.substr(0, this.shopNameStr.length - 1);
            this.shopIdStr = this.shopIdStr.substr(0, this.shopIdStr.length - 1);

            if(this.shopNameStr != '') {
              this.tableDataShop[this.shopIndex].storeNameList = this.shopNameStr;
              this.tableDataShop[this.shopIndex].storeIdList = this.shopIdStr;
              this.shopFormVisible = false;
              this.shopArgs = 2
            }else {
              this.$alert('请选择指定店铺!', '提示', {
                confirmButtonText: '确定',
                center: true,
              })
            }
          }
        }
      },

      //店铺删除
      handleShopDelete: function (index,rows) {
        let arr = [];
        arr = rows[index].storeIdList.split(',');
        arr.forEach(function (val) {
          this.shopForm.forEach(function (item) {
            if(val == item.storeId) {
              item.disabled = false;
              item.isChecked = false
            }
          });
        }.bind(this));
        rows.splice(index, 1);
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      },

      //点击返回
      backClick: function () {
//        this.$router.push('/wave')

        this.$emit('changeShow',true)
      },

      //点击保存
      holdClick: function () {

        if(this.storageId == '') {
          this.isStockShow = true;
        }else if(this.waveStrategyName == '') {
          this.isStockShow = false;
          this.isWaveStrategyNameShow = true;
        } else if(this.executeStartTime == '') {
          this.isStockShow = false;
          this.isWaveStrategyNameShow = false;
          this.isExecuteStartTimeShow = true;
        } else if(this.executeEndTime == '') {
          this.isStockShow = false;
          this.isWaveStrategyNameShow = false;
          this.isExecuteStartTimeShow = false;
          this.isExecuteEndTimeShow = true;
        } else {
          this.isExecuteEndTimeShow = false;

          let arr = [];
          let isExpressNum = true;
          this.tableDataExpress.forEach(function (val) {
            isExpressNum = val.goodsEndQty <= val.goodsStartQty;
            arr.push(isExpressNum)
          }.bind(this));

          let isTypePNum = true;
          this.tableDataType.forEach(function (val) {
            isTypePNum= val.goodsEndQty <= val.goodsStartQty;
            arr.push(isTypePNum)
          }.bind(this));

          let isShopNum = true;
          this.tableDataShop.forEach(function (val) {
            isShopNum = val.goodsEndQty <= val.goodsStartQty;
            arr.push(isShopNum)
          }.bind(this));
          console.log(arr);

          if(arr.indexOf(true) != -1 || this.singleMingleWaveStart >= this.singleMingleWaveEnd || this.manySkuWaveStart >= this.manySkuWaveEnd) {
            this.$alert('商品数量结束值不能小于起始值!', '提示', {
              confirmButtonText: '确定',
              center: true,
            })
          }else {
            this.initHold()
          }

        }

      }
    }
  }
</script>
<style scoped>
  .content h3{
    font-size: 12px;
    background: #F1F1F1;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 12px;
  }
  i{
    color: #008000;
  }
  .minLeft{
    padding-top: 12px;
    text-align: right;
    float: left;
    width: 80px;
  }
  .minRight{
    margin-left: 88px;
    position: relative;
    width: 950px;
  }
  .minRight i{
    position: absolute;
    top: 12px;
    left: 410px;
    color: #008000;
  }
  .topCon,.midCon,.botCon{
    padding: 10px 20px;
  }
  .clickAdd{
    color:rgb(64, 158, 255);
    border: 1px solid #ebeef5;
    border-top: none;
    padding-left: 10px;
    height: 40px;
    line-height: 40px;
  }
  .clickAdd span:hover{
    text-decoration: underline;
    cursor: pointer;
  }
  .orderWave{
    margin-top: 20px;
  }
  .checkboxWave{
    margin:0 3px 0 30px;
  }
  .conBot{
    margin-bottom: 80px;
  }
</style>
<style>
  .minRight .el-tabs__item{
    font-size: 12px;
    font-weight: normal;
  }
  .minRight .el-tabs__header{
    margin-bottom: 0;
  }
  #changeWave .el-dialog__body {
    padding: 30px 40px 0 !important;
  }
</style>
