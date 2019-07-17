<!--查看波次策略 尘音-->
<template>
  <div id="waveDetail">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">波次策咯</a></el-breadcrumb-item>
        <el-breadcrumb-item>查看波次策咯</el-breadcrumb-item>
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
                <el-input disabled maxlength="50" id="waveName" v-model="waveStrategyName" placeholder=""></el-input>
              </div>
            </el-col>

            <el-col :span="5">
              <div class="grid-content">
                <label for="trueStock">生效仓库：</label>
                <el-select disabled id="trueStock" v-model="storageId" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsStock"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="5">
              <div class="grid-content">
                <label>执行时间：</label>
                <el-time-picker
                  disabled
                  v-model="executeStartTime"
                  placeholder="选择开始时间">
                </el-time-picker>
              </div>
            </el-col>

            <el-col :span="5">
              <div class="grid-content">
                <label style="width: 60px;text-align: right">至：</label>
                <el-time-picker
                  disabled
                  v-model="executeEndTime"
                  placeholder="选择结束时间">
                </el-time-picker>
              </div>
            </el-col>

            <el-col :span="5">
              间隔 <input disabled class="inpNum-g" v-model="intervalTime"  type="number"> 分钟生成一次波次
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
                            <span>{{ scope.row.expressNameList }}</span>
                          </p>

                        </template>
                      </el-table-column>

                      <el-table-column label="波次内商品数量（件）">
                        <template slot-scope="scope">
                          <div class="initP-g">
                            <div style="margin-left: 25%">
                              <input disabled v-model="scope.row.goodsStartQty" type="number" class="inpNum-g">
                              ~
                              <input disabled v-model="scope.row.goodsEndQty" type="number" class="inpNum-g">
                            </div>
                          </div>
                        </template>
                      </el-table-column>

                    </el-table>

                  </div>
                </el-tab-pane>
                <el-tab-pane label="按订单类型指定" name="second">
                  <!--表格区-->
                  <div class="pDown">
                    <el-table :data="tableDataType" border style="width: 950px">

                      <el-table-column label="订单类型" width="300">
                        <template slot-scope="scope">
                          <p class="cen-g">
                            <span>{{ scope.row.orderTypeNameList }}</span>
                          </p>
                        </template>
                      </el-table-column>

                      <el-table-column label="波次内商品数量（件）">
                        <template slot-scope="scope">
                          <div class="initP-g">
                            <div style="margin-left: 25%">
                              <input disabled v-model="scope.row.goodsStartQty" type="number" class="inpNum-g">
                              ~
                              <input disabled v-model="scope.row.goodsEndQty" type="number" class="inpNum-g">
                            </div>
                          </div>
                        </template>
                      </el-table-column>

                    </el-table>

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
                          </p>
                        </template>
                      </el-table-column>

                      <el-table-column label="波次内商品数量（件）">
                        <template slot-scope="scope">
                          <div class="initP-g">
                            <div style="margin-left: 25%">
                              <input disabled v-model="scope.row.goodsStartQty" type="number" class="inpNum-g">
                              ~
                              <input disabled v-model="scope.row.goodsEndQty" type="number" class="inpNum-g">
                            </div>
                          </div>
                        </template>
                      </el-table-column>

                    </el-table>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <div class="orderWave">
            <span>大宗订单波次：</span>
            <span>单订单商品数量超过
              <input disabled v-model="manySkuWaveEnd" type="number" class="inpNum-g">件
            </span>
          </div>
          <div class="orderWave">
            <span>单品订单波次：</span>
            <span>单商品超过 <input disabled v-model="skuOrderWaveMax" type="number" class="inpNum-g"> 件，生成单品订单波次</span>
            <el-checkbox disabled v-model="skuSingleWaveFlag" id="aloneWave" class="checkboxWave" type="checkbox"></el-checkbox>
            <label for="aloneWave" style="width: auto!important;">单品多件单独生成波次</label>
            <div style="margin-top: 10px">
              <i>*订单中仅有一种SKU，商品满足指定件数才生成单品订单波次，勾选“单品多件单独生成波次“则单品单件和单品多件分开生成波次，单品多件波次也需要满足数量限制</i>
            </div>
          </div>
          <div class="orderWave">
            <span>单件混合波次：</span>
            <span>
              波次内商品数量
              <input disabled v-model="singleMingleWaveStart" type="number" class="inpNum-g">
                ~
              <input disabled v-model="singleMingleWaveEnd" type="number" class="inpNum-g">
            </span>
            <div style="margin-top: 10px">
              <i>*仅有一件商品的订单，按照指定数量混合生成波次</i>
            </div>
          </div>
          <div class="orderWave">
            <span>多品订单波次：</span>
            <span>
              波次内商品数量
              <input disabled v-model="manySkuWaveStart" type="number" class="inpNum-g">
                ~
              <input disabled v-model="manySkuWaveEnd" type="number" class="inpNum-g">
              <el-checkbox disabled v-model="sameSubsidiaryFlag" id="sameWave" class="checkboxWave" type="checkbox"></el-checkbox>
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
            <el-checkbox disabled class="checkboxWave" id="check1" type="checkbox" v-model="excludeUrgencyFlag"></el-checkbox>
            <label style="width: auto!important;" for="check1">排除加急订单</label>
          </div>
          <div style="display: inline-block">
            <el-checkbox disabled class="checkboxWave" id="check2" type="checkbox" v-model="excludeHeavyFlag"></el-checkbox>
            <label style="width: auto!important;" for="check2">排除超重商品（重量超过
              <input v-if="excludeHeavyFlag == true" disabled v-model="heavyMax" type="number" class="inpNum-g">
              <input v-if="excludeHeavyFlag == false" disabled v-model="heavyMax" type="number" class="inpNum-g">
              kg）</label>
          </div>
          <div style="display: inline-block">
            <el-checkbox disabled class="checkboxWave" id="check3" type="checkbox" v-model="excludeBiggoodsFlag"></el-checkbox>
            <label style="width: auto!important;" for="check3">排除大件商品（体积超过
              <input disabled v-model="biggoodsVolume" type="number" class="inpNum-g">
              cm³）</label>
          </div>
        </div>
      </div>
      <!--操作日志-->
      <div class="conBotLog">
        <h3>
          <span style="display: inline-block;width: 72px">操作日志</span>
        </h3>
        <!--日志表格-->
        <publicLog :paramObj="paramObj"></publicLog>
      </div>
      <!--footer-->
      <div class="wmsFoot">
        <el-button @click="backClick" size="mini">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import dataTime from '@/components/common/DataTime.vue'
  import publicLog from '@/components/common/publicLog.vue';
  export default {
    props: {
      params: Object //接收父级参数
    },
    components: {
      dataTime,publicLog
    },
    data() {
      return {
        version: '1.0.0',
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
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

        bigOrderWaveMax: '',//大宗订单波次

        skuOrderWaveMax: '',//单品订单波茨

        skuSingleWaveFlag: true,//是否单品订单单独波茨

        singleMingleWaveStart: '',//单件混合波次起始
        singleMingleWaveEnd: '',//单件混合波茨结束

        manySkuWaveStart: '',//多品订单波次起始
        manySkuWaveEnd: '',//多品订单波茨结束
        sameSubsidiaryFlag: true,//是否相同明细单独生成波次

        excludeUrgencyFlag: true,//排除加急订单标志

        excludeHeavyFlag: false,//排除超重订单标志
        heavyMax: '',//超重值

        excludeBiggoodsFlag: false,//排除大件商品标志
        biggoodsVolume: '',//大件商品体积

        expressFormVisible: false,//选择快递弹框
        expressForm: [],//弹框快递列表
        expressStr: '',//已选快递
        expressIndex:0,//编辑快递下标

        shopFormVisible: false,//选择店铺弹框
        shopForm: [],//弹框店铺列表
        shopStr: '',//已选店铺
        shopIndex:0,//编辑店铺下标

        paramObj:{
          moduleId:'18',
          billCode: this.params.waveStrategyId
        },//日志传参
      }
    },

    mounted() {
      this.initStock();//初始化仓库下拉
      this.initMessage()//初始化调整信息
    },

    methods: {

      //返回父级
      showParentBlock() {
        this.$emit('changeShow',true)
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
            this.bigOrderWaveMax = res.data.result.bigOrderWaveMax;
            this.skuOrderWaveMax = res.data.result.skuOrderWaveMax;
            this.skuSingleWaveFlag = res.data.result.skuSingleWaveFlag;
            this.singleMingleWaveStart = res.data.result.singleMingleWaveStart;
            this.singleMingleWaveEnd = res.data.result.singleMingleWaveEnd;
            this.manySkuWaveStart = res.data.result.manySkuWaveStart;
            this.manySkuWaveEnd = res.data.result.manySkuWaveEnd;
            this.excludeUrgencyFlag = res.data.result.excludeUrgencyFlag;
            this.excludeHeavyFlag = res.data.result.excludeHeavyFlag;
            this.heavyMax = res.data.result.heavyMax;
            this.excludeBiggoodsFlag = res.data.result.excludeBiggoodsFlag;
            this.biggoodsVolume = res.data.result.biggoodsVolume;
            this.sameSubsidiaryFlag = res.data.result.sameSubsidiaryFlag;
            this.tableDataExpress = res.data.result.expressBeanList;
            this.tableDataType = res.data.result.ordertypeBeanList;
            this.tableDataShop = res.data.result.storeBeanList
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

      //点击返回
      backClick: function () {
//        this.$router.push('/wave')
        this.$emit('changeShow',true)
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
  .conBotLog{
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
</style>
