<!--指定快递配置 秋香-->
<template>
  <div id="SpecifiedDelivery">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;">
        <el-breadcrumb-item :to="{name: 'autoExpress'}">智能快递</el-breadcrumb-item>
        <el-breadcrumb-item>指定快递配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--商品指定快递-->
    <div class="content">
      <el-tabs type="border-card" style="margin:10px 0;">
        <el-tab-pane label="商品指定快递">
          <div class="col-nav" style="margin:-10px 0;">
            <ul>
              <li @click="addClickExpress()"><span>添加</span></li>
            </ul>
          </div>
          <div  >
            <el-table
              :data="resultData"
              ref="tables"
              id="fitTable"
              :height="table_h"
              :show-overflow-tooltip="true"
              border
              style="margin-top: 20px">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="60">
              </el-table-column>
              <el-table-column
                align="right"
                width="180"
                label="【条形码】商品名称">

                <template slot-scope="scope" >
                  <div  v-if="scope.row.isShowShop">
                    <el-button style="margin-right: 10px" v-if="scope.row.goodsEchoBeans.length>0"
                               @click="clickChange(scope.row,scope.$index)" type="text" size="small"> 详情
                    </el-button>
                    <div>
                      <el-dialog
                        id="showKu"
                        title="商品详情"
                        :visible.sync="dialogFormVisibleOne"
                        :before-close="handleCloseDetail"
                        width="800px"
                      >
                        <el-breadcrumb separator=">" style="width:100%;background:#eee;">
                          <div style="text-align: left;">
                            <el-button @click="handleDelete()">批量删除</el-button>
                          </div>
                        </el-breadcrumb>
                        <div style="margin: 10px 0;">
                          <el-table
                            :height="500"
                            ref="table"
                            v-loading="loading"
                            tooltip-effect="dark"
                            @selection-change="changemustip"
                            :data="scope.row.goodsEchoBeans"
                            stripe
                            border
                          >
                            <el-table-column
                              align="center"
                              type="index"
                              label="序号">
                            </el-table-column>
                            <el-table-column
                              align='center'
                              type="selection"
                              width="50">
                            </el-table-column>
                            <el-table-column
                              align="center"
                              prop="barCode"
                              :show-overflow-tooltip="true"
                              label="条形码"
                              min-width="100">
                            </el-table-column>
                            <el-table-column
                              align="center"
                              prop="goodsName"
                              label="商品名称"
                              :show-overflow-tooltip="true"
                              min-width="100">
                            </el-table-column>
                            <el-table-column
                              align="center"
                              width="160"
                              label="操作">
                              <template slot-scope="scope">
                                <div >
                                 <span>
                                    <el-button type="text" size="small" @click="deleteGoods(scope.row,scope.$index)" >删除
                                    </el-button>
                                 </span>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                          <!--分页-->
                        </div>
                        <div style="text-align: right;margin-top: 20px">
                          <el-button @click="handleCloseDetail()">关 闭</el-button>
                        </div>

                      </el-dialog>
                    </div>
                  </div>
                  <el-popover
                    v-else
                    placement="right-start"
                    title=""
                    width="300"
                    id="boxS"
                    trigger="hover"
                    tooltip-effect="dark"
                  >
                    <el-table :data="scope.row.goodsEchoBeans"
                              :height="300"
                    >
                      <el-table-column
                        align="center"
                        prop="barCode"
                        label="条形码"
                        min-width="100">
                      </el-table-column>
                      <el-table-column
                        align="left"
                        prop="goodsName"
                        label="商品名称"
                        min-width="100"
                      >
                      </el-table-column>
                    </el-table>
                    <span slot="reference"  class="isNoSame" v-if="scope.row.goodsEchoBeans.length != 0">【{{scope.row.goodsEchoBeans[0].barCode}}】{{scope.row.goodsEchoBeans[0].goodsName.slice(0,3)+'...'}}</span>
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                width="210"
                label="店铺"
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div v-if="scope.row.isShowShop">
                    <!--<el-select id="isSuit2" v-model="scope.row.storeIdList" clearable multiple collapse-tags filterable
                               placeholder="全部">
                      <el-option
                        v-for="item in shopAll2"
                        :key="item.storeId"
                        :label="item.storeName"
                        :value="item.storeId">
                      </el-option>
                    </el-select>-->
                    <div style="display: inline-block;"  >
                      <el-select @change="shopSelectAll(scope.row,index)" v-model="scope.row.storeIdList" filterable multiple collapse-tags
                                 placeholder="请选择">
                        <el-option
                          v-for="(item,index) in shopAll2"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div v-if="!scope.row.isShowShop">{{scope.row.storeName}}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="210"
                prop="expressName"
                label="指定发货快递"
                :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div v-if="scope.row.isShowShop">
                    <el-select id="isSuit2"  v-model="scope.row.expressId" placeholder="请选择" filterable
                               :class="{ box: isClasses ==true && (scope.row.expressId==undefined||scope.row.expressId=='')}">
                      <el-option
                        v-for="item in ExpressAll"
                        :key="item.expressId"
                        :label="item.expressName"
                        :value="item.expressId">
                      </el-option>
                    </el-select>
                  </div>
                  <div v-if="!scope.row.isShowShop">
                    {{scope.row.expressName}}
                  </div>
                  <div v-if="scope.row.isShopConfirm">
                    <el-input type="text" v-model="scope.row.expressName" style="border: 1px solid red;" >
                    </el-input>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                prop="updater"
                label="最后修改人">
              </el-table-column>

              <el-table-column
                label="最后修改时间"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.updateTime | normalTime(6) }}
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                width="160"
                label="启用状态">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.enabledFlag" @click.native="switchChangeShop(scope.row)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="160"
                label="操作">
                <template slot-scope="scope">
                  <div v-if="scope.row.isShowKit2">
                   <span>
                      <el-button v-if="scope.row.isShowShop" style="margin-right: 10px"
                                 @click="clickImg(scope.row,scope.$index,isMYs=12)" type="text" size="small"> 添加商品
                      </el-button>
                      <el-button type="text" size="small" @click="addShop(scope.row,scope.$index)">保存</el-button>
                      <el-button type="text" size="small" style="color: red"
                                 :id="{'box': indexReg == scope.$index && idFlag == 'box'}"
                                 @click="cancelShopData(scope.row,scope.$index)">取消
                      </el-button>
                   </span>
                  </div>
                  <div v-if="!scope.row.isShowKit2">
                    <span>
                       <el-button type="text" size="small" class="box1" :class="{box: scope.row.enabledFlag == true}"
                                  @click="updateByIdShop(scope.row,scope.$index)">修改
                      </el-button>
                      <el-button type="text" size="small" class="box2" :class="{box: scope.row.enabledFlag == true}"
                                 @click="delShopData(scope.row)">删除
                      </el-button>
                      <el-button type="text" size="small" @click="publicLogBtn(scope.row)">日志</el-button>
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <!--订单金额指定快递-->
        <el-tab-pane label="订单金额指定快递">
          <div class="col-nav" style="margin:-10px 0;">
            <ul>
              <li @click="addClicksExpress()"><span>添加</span></li>
            </ul>
          </div>
          <div class="pDown" style="width: 100%">
            <div id="wrapper" ref="bb">
              <el-table
                :data="resultsData"
                tooltip-effect="dark"
                ref="tabless"
                id="fitTablee"
                :height="table_h"
                border
                style="width: 100%; margin-top: 20px">
                <el-table-column
                  align="center"
                  type="index"
                  label="序号"
                  width="60">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="订单金额">
                  <template slot-scope="scope">
                    <div v-if="scope.row.isShowMoney">
                      <div class="initP-g">
                        <div >
                          <el-input style="width: 60px!important;" v-model="scope.row.startAmt"
                                    placeholder=""
                                    :maxlength="7"
                                    @keyup.native="scope.row.startAmt=scope.row.startAmt.replace(/[^\d]/ig,'')"
                          ></el-input>
                          ~
                          <el-input style="width: 60px!important;" v-model="scope.row.endAmt"
                                    placeholder=""
                                    :maxlength="7"
                                    @keyup.native="scope.row.endAmt=scope.row.endAmt.replace(/[^\d]/ig,'')"
                          ></el-input>
                        </div>
                      </div>
                    </div>
                    <div v-if="!scope.row.isShowMoney">
                      {{scope.row.startAmt}} ~ {{scope.row.endAmt}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="220"
                  label="店铺"
                  :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div v-if="scope.row.isShowMoney">
                      <!--  <el-select id="isSuit" v-model="scope.row.storeIdList" clearable multiple collapse-tags filterable
                                   placeholder="全部">
                          <el-option
                            v-for="item in shopAll1"
                            :key="item.storeId"
                            :label="item.storeName"
                            :value="item.storeId">
                          </el-option>
                        </el-select>-->
                      <!--    <span style="margin-left: 10px;display: inline-block;width: 300px" >全部</span>-->
                      <div  style="padding: 0 20px"  >
                        <el-select @change="moneySelectAll(scope.row,index)" v-model="scope.row.storeIdList" filterable multiple collapse-tags
                                   placeholder="请选择">
                          <el-option
                            v-for="(item,index) in shopAll1"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div v-if="!scope.row.isShowMoney">
                      {{scope.row.storeName}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="220"
                  label="指定发货快递"
                  :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    <div v-if="scope.row.isShowMoney">
                      <p class="cen-g">
                        <el-select id="isSuit1" v-model="scope.row.expressId" placeholder="请选择" filterable
                                   :class="{ box: isClasses ==true && (scope.row.expressId==undefined||scope.row.expressId=='')}">
                          <el-option
                            v-for="item in ExpressAll"
                            :key="item.expressId"
                            :label="item.expressName"
                            :value="item.expressId">
                          </el-option>
                        </el-select>
                      </p>
                    </div>
                    <div v-if="!scope.row.isShowMoney">
                      {{scope.row.expressName}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="updater"
                  label="最后修改人">
                </el-table-column>

                <el-table-column
                  label="最后修改时间"
                  align="center"
                >
                  <template slot-scope="scope">
                   {{ scope.row.updateTime | normalTime(6) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="启用状态"
                  align="center">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.enabledFlag" @click.native="switchChangeMoney(scope.row)"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="操作">
                  <template slot-scope="scope">
                    <div v-if="scope.row.isShowKit1">
                      <el-button type="text" size="small" @click="addDataMoney(scope.row,scope.$index)">保存</el-button>
                      <el-button type="text" size="small" style="color: red"
                                 @click="cancelMoneyData(scope.row,scope.$index)">取消
                      </el-button>
                    </div>
                    <div v-if="!scope.row.isShowKit1">
                      <span class="box1" :class="{box: scope.row.enabledFlag == true}"
                            @click="updateByIdMoney(scope.row)">修改</span>
                      <el-button type="text" size="small" class="box2" :class="{box: scope.row.enabledFlag == true}"
                                 @click="delMoneyData(scope.row)">删除
                      </el-button>
                      <el-button type="text" size="small" @click="publicLogBtnMoney(scope.row)">日志</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--------------------------------------------------添加选择商品-------------------------------------------------------------->
    <el-dialog
      id="showKu"
      title="选择商品"
      :visible.sync="dialogFormVisiblec"
      :before-close="handleClose"
      width="800px"
    >
      <el-row>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <label>商品名称：</label>
            <el-input v-model="queryAll.goodsName" :maxlength="50" @keyup.enter.native="queryData"></el-input>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">
            <label>条形码：</label>
            <el-input v-model="queryAll.barCode" :maxlength="50" @keyup.enter.native="queryData"></el-input>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">
            <label>商品编码：</label>
            <el-input v-model="queryAll.goodsCode"  :maxlength="50" style="width: 120px" @keyup.enter.native="queryData"></el-input>
          </div>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button @click="queryData()" type="primary">查 询</el-button>
        </el-col>
      </el-row>
      <div style="margin: 10px 0;">
        <el-table
          :height="500"
          ref="table"
          v-loading="loading"
          tooltip-effect="dark"
          @selection-change="changeData"
          :data="tableDataAll"
          stripe
          border
        >
          <el-table-column
            align="center"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            align='center'
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column label="商品图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsCode"
            label="商品编号"
            min-width="100">
          </el-table-column>
          <el-table-column
            align="center"
            prop="barCode"
            :show-overflow-tooltip="true"
            label="条形码"
            min-width="100">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goodsName"
            :show-overflow-tooltip="true"
            label="商品名称"
            min-width="100">
          </el-table-column>
          <el-table-column
            align="center"
            prop="specification"
            label="规格"
            min-width="100">
          </el-table-column>
          <el-table-column
            align="center"
            prop="brandName"
            :show-overflow-tooltip="true"
            label="商品品牌">
          </el-table-column>
        </el-table>
        <!--分页-->
        <div style="float: right">
          <pagination
            :totalCom="total"
            :pageSizeCom="pageSize"
            :curPageCom="curPage"
            @pageSizeVal="getPageSize" @curPageVal="getCurPage"
          ></pagination>
        </div>
      </div>
      <div style="text-align: right;margin-top: 40px">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="sureData()">确定</el-button>
      </div>

    </el-dialog>
    <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    <v-Publiclog @changShow="changDialogShowMoney" :paramObj="paramObj"
                 :pulicLogVisible="pulicLogVisibleMoney"></v-Publiclog>
  </div>
</template>

<script>
  import publicLog from '@/components/common/publicLogDialog.vue'
  import pagination from '@/components/common/Pagination.vue'
  import {
    turnTimestamp,
    returnTimesStamp,
    priceValidator,
    positiveIntegerValidator,
    Trim
  } from '@/assets/js/validate.js';

  export default {
    components: {
      pagination,
      'v-Publiclog': publicLog
    },
    name: '',
    data() {
      return {
        version: '1.0.0',
        shopAll1: [{value: '', label: '全部'}],//仓库下拉//查询店铺
        shopAll2: [{value: '', label: '全部'}],//查询店铺
        tableData1: [],//选择商品勾选数据
        resultData1: [],//店铺
        ExpressAll: [],//快递
        queryFn: () => {
        }, // 定义方法全局调用
        isClasses:'',//框的样式
        idFlag: '',//样式
        indexReg: '',//样式
        originalData: '',//引用
        dialogFormVisibles: true,//修改商品的框
        isShowMuch: false,//修改金额保存
        isShowMoney: true,//金额的按钮
        isShowKit1: true,//金额数据
        //isShowShop:true,//店铺的按钮
        isShowKit2: true,//店铺的数据
        multiple: true,//店铺多选
        paramObj: {},//日志参数
        pulicLogVisible: false,//日志窗口
        table_h: 0,//表格高度
        dog: true,//存储未保存商品状态
        dog1: true,//存储未保存金额状态
        queryShop: () => {
        },//调用商品接口
        queryMoney: () => {
        },//调用金额接口
        tableData: [],
        resultData: [],//商品指定快递
        resultsData: [],//指定快递金额
        totalNum1: 0, // 数据总条数
        // 获取row的key值
        getRowKeys(row) {
          return row.areaId;
        },
        // 要展开的行，数值的元素是row的key值
        expands: [], //商品指定快递数据
        goodsExpressId: '', //主键Id  新增不用传
        // goodsIds:'',  //商品Id 逗号分隔
        enabledFlag: '', //启用状态
        expressId: '',  //快递Id
        storeIds: '',  //店铺Id 逗号分隔
        //订单金额指定快递数据
        orderamtExpressId: '', //订单金额指定快递Id
        startAmt: '', //起始金额
        endAmt: '', //结束金额
        updateTime: '', //修改时间
        updater: '',//修改人
        dialogFormVisiblec: false,//选择商品
        dialogFormVisible: false,//【商品名称】条形码详情
        tableDataAll: [],//商品
        loading:true,//加载
        queryAll: {
          barCode: '',
          goodsName: '',
          goodsCode: '',
          page: 1, // 页数
          size: 15, // 行数
        }, // 模糊查询
        shopData: [],//商品
        expressCoId: '05002799C83E4F068D0D3F6F7363E790',//默认快递
        shopAll: [],//商品
        pulicLogVisibleMoney: false,//金额日志
        showUpShop: [],//修改的数据
        isShopConfirm:false,
        oldShopOptions: [],//上次已选店铺
        oldMoneyOptions: [],//上次已选店铺
        isNum:'',//未选择商品状态
        index: '',//当前数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1,//当前页数
        isSeeShop:false,
        isNoSeeShop:false,
        dialogFormVisibleOne:false,//删除弹框
        newGood:[],//返回的数据
        goodsEchoBeans:'',//批量
        delindex:'',//详情
        arrDatas:[],//批量商品
        DellArr:[],//详情页勾选商品
        //id:1,
        isSee:'',//添加状态为了区分是否有值
        sameNumber:'',//详情数据
        box:'',//样式
        barCode:'',//条形码
      }
    },
    methods: {
      //详情窗口关闭
      handleCloseDetail(){
        this.arrDatas.forEach(row=>{
          this.resultData[this.delindex].ids.replace(row,'')
        })
        this.dialogFormVisibleOne=false;
      },

      //批量删除
      handleDelete(){
        this.DellArr.forEach(v=>{
          this.goodsEchoBeans.forEach((item,i)=>{
            if(v.goodsId == item.goodsId){
              this.arrDatas.push(item.goodsId)
              this.goodsEchoBeans.splice(i,1);
            }
          })
        })
      },

      //详情页勾选
      changemustip(val){
        this.DellArr=val
      },

      //删除
      deleteGoods(row,index) {
        this.arrDatas.push(row.goodsId)
          this.goodsEchoBeans.splice(index, 1);
      },

      //查看详情
      clickChange(row,index){
        this.delindex=index;
        this.sameNumber=JSON.parse(JSON.stringify(row.goodsEchoBeans));
        this.goodsEchoBeans=row.goodsEchoBeans;
//        this.sameNumber=this.goodsEchoBeans
        this.dialogFormVisibleOne=true;
        this.loading = false
      },

      //以下是分页
      getPageSize: function (val) {
        if (val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.clickImg();
        }
      },
      getCurPage: function (val) {
        if (val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.clickImg()
        }
      },

      //店铺下拉
      shopSelectAll(row){
        let allValues = [];
        //下拉所有值
        for (let item of this.shopAll2) {
          allValues.push(item.value)
        }
        //储存当前最后的结果 作为下次的老数据
        this.oldShopOptions[0] = row.storeIdList;
        // 全部选择
        if(this.oldShopOptions[0] != undefined) {
          if (this.oldShopOptions[0].includes('')) row.storeIdList = allValues;
        }
        // 取消全部选中  上次有 当前没有 表示取消全选
        if(this.oldShopOptions[0] != undefined && this.oldShopOptions[1] != undefined) {
          if (!this.oldShopOptions[0].includes('') && this.oldShopOptions[1].includes('')) row.storeIdList = [];
        }
        // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if(this.oldShopOptions[0] != undefined && this.oldShopOptions[1] != undefined) {
          if (this.oldShopOptions[0].includes('') && this.oldShopOptions[1].includes('')) {
            const index = this.oldShopOptions[0].indexOf('');
            this.oldShopOptions[0].splice(index, 1);// 排除全选选项
            row.storeIdList = this.oldShopOptions[0]
          }
        }
        //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if(this.oldShopOptions[0] != undefined && this.oldShopOptions[1] != undefined) {
          if (!this.oldShopOptions[0].includes('') && !this.oldShopOptions[1].includes('')) {
            if (this.oldShopOptions[0].length === allValues.length - 1) row.storeIdList = allValues
          }
        }
        this.oldShopOptions[1] = row.storeIdList;
      },

      //金额下拉
      moneySelectAll(row){
        let allValues = [];
        //下拉所有值
        for (let item of this.shopAll1) {
          allValues.push(item.value)
        }
        //储存当前最后的结果 作为下次的老数据
        this.oldMoneyOptions[0] = row.storeIdList;

        // 全部选择
        if(this.oldMoneyOptions[0] != undefined) {
          if (this.oldMoneyOptions[0].includes('')) row.storeIdList = allValues;
        }

        // 取消全部选中  上次有 当前没有 表示取消全选
        if(this.oldMoneyOptions[0] != undefined && this.oldMoneyOptions[1] != undefined) {
          if (!this.oldMoneyOptions[0].includes('') && this.oldMoneyOptions[1].includes('')) row.storeIdList = [];
        }

        // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if(this.oldMoneyOptions[0] != undefined && this.oldMoneyOptions[1] != undefined) {
          if (this.oldMoneyOptions[0].includes('') && this.oldMoneyOptions[1].includes('')) {
            const index = this.oldMoneyOptions[0].indexOf('');
            this.oldMoneyOptions[0].splice(index, 1);// 排除全选选项
            row.storeIdList = this.oldMoneyOptions[0]
          }
        }

        //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if(this.oldMoneyOptions[0] != undefined && this.oldMoneyOptions[1] != undefined) {
          if (!this.oldMoneyOptions[0].includes('') && !this.oldMoneyOptions[1].includes('')) {
            if (this.oldMoneyOptions[0].length === allValues.length - 1) row.storeIdList = allValues
          }
        }

        this.oldMoneyOptions[1] = row.storeIdList;
      },

      // 点击查看日志
      publicLogBtn(row) {
        if (this.dog == false) {
          this.$message({
            message: '存在未保存的方案，无法查看日志!',
            type: 'warning'
          });
          return false;
        }else{
          this.paramObj.moduleId = 58;
          this.paramObj.billCode = row.goodsExpressId;
          this.paramObj.typeId = '';
          this.pulicLogVisible = true
        }
      },

      // 点击查看日志
      publicLogBtnMoney(row) {
        if (this.dog1 == false) {
          this.$message({
            message: '存在未保存的方案，无法查看日志!',
            type: 'warning'
          });
          return false;
        }else{
          this.paramObj.moduleId = 58;
          this.paramObj.billCode = row.orderamtExpressId;
          this.paramObj.typeId = '';
          this.pulicLogVisibleMoney = true
        }
      },

      //校验金额
      validation(a, row) {
        switch (a) {
          case 1 :
            row.startAmt = priceValidator(row.startAmt);
            break;
          case 2 :
            row.endAmt = priceValidator(row.endAmt);
            break;
        }
      },

      //修改回显金额
      updateByIdMoney(row, index) {
        if (row.enabledFlag == true) {
          return false;
        } else {
          if (this.dog1 == false) {
            this.$message({
              message: '存在未保存方案，无法修改!',
              type: 'warning'
            });
            return false;
          }
          let obj = this.resultsData[index]
          this.$set(this.resultsData, index, obj)
          row.isShowMoney = true;
          row.isShowKit1 = true;
          this.dog1 = false;
        }
        this.resultsData.forEach(function (val,index) {
          if(index != 0) {
            //仓库格式数据
            this.resultsData[index].storeIdList.forEach(function (val1,index1) {
              if(val1 == '') {
                this.resultsData[index].storeIdList.splice(index1,1)
              }
            });
            if(this.resultsData[index].storeIdList.length == (this.shopAll1.length) - 1) {
              this.resultsData[index].storeIdList.unshift('')
            }
          }
        }.bind(this));
      },

      // 点击弹框确定按钮
      sureData() {
        if (this.tableData1.length == 0) {
          if(this.isNum==1){
            return false
          }else{
            this.$message({
              type: 'warning',
              message: '请选择商品！'
            });
          }
        } else {
          this.isSeeShop=false;
          this.isNoSeeShop=true;
          this.tableData1.forEach(item => {
            this.resultData[this.index].goodsEchoBeans.push(item);
          });
          this.handleClose();
        }
      },

      //修改回显商品
      updateByIdShop(row, index) {
        let arr=[]
        this.resultData.forEach(item=>{
          arr.push(item.isShowShop)
        })
        if (row.enabledFlag == true) {
          return false;
        } else {
          if (arr.indexOf(true)>-1) {
            this.$message({
              message: '存在未保存方案，无法修改!',
              type: 'warning'
            });
            return false;
          } else {
            let obj = this.resultData[index];
            this.$set(this.resultData, index, obj);
            row.isShowShop = true;
            row.isShowKit2 = true;
            row.dialogFormVisibles = true;
            this.dog = false;
          }
        }
      },

      //保存商品指定快递
      addShop(row, index) {
        if(!row.expressId){
          this.isClasses = true;
          this.$message({
            type: 'warning',
            message: '请选择快递!'
          })
          return false;
        }else{
          this.isClasses = false;
        }
        if(!row.goodsEchoBeans){
          this.isClasses = true;
          this.$message({
            type: 'warning',
            message: '请选择商品!'
          })
          return false;
        }
        if(row.goodsEchoBeans.length == 0){
          this.isClasses = true;
          this.$message({
            type: 'warning',
            message: '请选择商品!'
          });
          return false;
        }
        this.goodsIds = ''; // 置空
        row.goodsEchoBeans.forEach(item=>{
          this.goodsIds += item.goodsId + ',';
        })
        let self = this;
        let num = []; // self.resultData1
        if(row.storeIdList[0] == ''){
          num.push(row.storeIdList[0]);
        }else{
          row.storeIdList.forEach( (item,index) => {
            num.push(item)
          })
        }
        this.newGood=this.goodsIds.slice(0,-1)
        var data = {
          goodsExpressId: row.goodsExpressId,//主键Id 修改必传
          goodsIds:this.goodsIds.slice(0,-1),  //商品Id 逗号分隔
          enabledFlag: row.enabledFlag, //启用状态
          expressId: row.expressId,  //快递Id
          storeIds: num,  //店铺Id 逗号分隔
        }

        if (row.goodsExpressId == undefined) {
          data.goodsExpressId = ''
        }
        if (row.expressId == undefined) {
          data.expressId = ''
        }
        self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + self.version + '/saveGoods', data)
          .then(function (res) {
            if (res.data.code == 0) {
              if (self.goodsExpressId == '') {
                self.dog = true;
                self.$message({
                  type: 'success',
                  message: '保存成功!',
                });
                self.resultData[index].isShowKit2 = false;
                self.resultData[index].isShowShop = false;
                self.queryShop();
                row.ids=''
              }
            } else if (res.data.code == 100000) {
              self.$message({
                type: 'warning',
                message: res.data.msg,
              })
            } else if (res.data.code == 300000001) {
              self.$message({
                type: 'warning',
                message: '与其他方案重复，请修改!',
              })
            } else {
              self.$message({
                message: '保存失败，请重试！',
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      //修改金额绑定快递启用状态switch开关是否停用
      switchChangeMoney(row) {
        let self = this;
        if (row.enabledFlag == true) {
          self.clickMoney(row)
        } else {
          self.$confirm('是否停用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            self._post('com.edb01.erp.wms.service.api.ExpressSetupService/1.0.0/editOrderamtEnable', {
              orderamtExpressId: row.orderamtExpressId,
              enabledFlag: false,
              merchantId: 0
            })
              .then(function (res) {
                if (res.data.code == 0) {
                  self.$message({// 给用户一个提示
                    message: '已停用',
                    type: 'success'
                  });
                } else if (res.data.code == 410006) {
                  row.enabledFlag = true
                  self.defaultShop = res.data.result;
                  self.title = '停用失败';
                  self.centerDialogVisible = true
                }
              })
              .catch(function (err) {
                console.log(err)
              })
          }).catch(() => {
            row.enabledFlag = true;
            self.$message({
              type: 'info',
              message: '已取消停用'
            });
          });
        }
      },

      //修改金额绑定快递启用状态switch开关是否启用
      clickMoney(row) {
        let self = this
        self.$confirm('是否启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          // 发请求
          self._post('com.edb01.erp.wms.service.api.ExpressSetupService/1.0.0/editOrderamtEnable', {
            orderamtExpressId: row.orderamtExpressId,
            enabledFlag: true,
            merchantId: 0
          })
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({// 给用户一个提示
                  message: '已启用',
                  type: 'success'
                })
              } else {
                self.$message({
                  message: res.data.message,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }).catch(() => {
          row.enabledFlag = false;
          self.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      },

      //删除按金额指定快递
      delMoneyData(row) {
        var self = this;
        if (row.enabledFlag == true) {
          return false;
        } if (this.dog1 == false) {
          this.$message({
            message: '存在未保存方案，无法删除!',
            type: 'warning'
          });
          return false;
        } else {
          self.$confirm('确定要删除该快递吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            var delMoney = {
              orderamtExpressId: row.orderamtExpressId, //订单金额指定快递Id
              merchantId: 0, //商户Id
            }
            self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + self.version + '/deleteOrderAmt', delMoney)
              .then(function (res) {
                if (res.data.code == 0) {
                  self.$message({
                    type: 'success',
                    message: '删除成功!',
                  });
                  self.queryMoney()// 重新渲染数据
                } else {
                  self.$message({
                    message: '删除失败，请重试！',
                    type: 'warning'
                  });
                }
              })
              .catch(function (err) {
                console.log(err)
              })

          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }

      },

      //删除商品指定快递
      delShopData(row) {
        let self = this;
        if (row.enabledFlag == true) {
          return false;
        } if (this.dog == false) {
          this.$message({
            message: '存在未保存方案，无法删除!',
            type: 'warning'
          });
          return false;
        } else {
          self.$confirm('确定要删除该快递吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            var delShop = {
              goodsExpressId: row.goodsExpressId, //订单金额指定快递Id
              merchantId: 0, //商户Id
            }
            self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + this.version + '/deleteGoods', delShop)
              .then(function (res) {
                if (res.data.success == true) {
                  self.$message({
                    type: 'success',
                    message: '删除成功!',
                  })
                  self.queryShop()
                } else {
                  self.$message({
                    message: '删除失败，请重试！',
                    type: 'warning'
                  });
                }
              })
          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },

      //保存按金额指定快递
      addDataMoney(row, index) {
        if(!row.startAmt==''&&!row.endAmt==''){
          if (row.startAmt * 1 > row.endAmt * 1) {
            this.$message({
              type: 'warning',
              message: '结束金额应大于等于起始金额!'
            })
            return false;
          }
        }
        if(!row.expressId){
          this.isClasses = true;
          this.$message({
            type: 'warning',
            message: '请选择快递!'
          })
          return false;
        }else{
          this.isClasses = false;
        }
        if( !row.storeIdList){
          this.$message({
            type: 'warning',
            message: '店铺不能为空!'
          })
          return false;
        }
        let self = this;
        var addMoney = {
          orderamtExpressId: row.orderamtExpressId, //订单金额指定快递Id
          startAmt: row.startAmt, //起始金额
          endAmt: row.endAmt, //结束金额
          enabledFlag: row.enabledFlag, //启用状态
          expressId: row.expressId,//快递id
          updateTime: '', //修改时间
          updater: '',//修改人
          storeIds: row.storeIdList,  //店铺Id 逗号分隔
        }
        if (row.orderamtExpressId == undefined) {
          addMoney.orderamtExpressId = ''
        }
        if (row.endAmt == undefined) {
          addMoney.endAmt = ''
        }
        if (row.startAmt == undefined) {
          addMoney.startAmt = ''
        }
        if (row.expressId == undefined) {
          addMoney.expressId = ''
        }

        self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + self.version + '/saveOrderAmt', addMoney)
          .then(function (res) {
            if (res.data.code == 0) {
              self.dog1 = true;
              self.$message({
                type: 'success',
                message: '保存成功!',
              })
              self.resultsData[index].isShowKit1 = false;
              self.resultsData[index].isShowMoney = false;
              self.queryMoney()// 重新渲染数据
            } else if (res.data.code == 300000004) {
              self.$message({
                type: 'warning',
                message: '与其他方案重复，请修改!',
              })
            } else if (res.data.code == 300000005) {
              self.$message({
                type: 'warning',
                message: '起始金额和结束金额不能同时为空!',
              })

            } else if (res.data.code == 100000) {
              self.$message({
                type: 'warning',
                message: res.data.msg,
              })
            } else {
              self.$message({
                message: '保存失败，请重试！',
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      //修改按金额指定快递
      updateMoney(row, index) {
        let self = this;
        var upMoney = {
          orderamtExpressId: row.orderamtExpressId, //订单金额指定快递Id
          startAmt: row.startAmt, //起始金额
          endAmt: row.endAmt, //结束金额
          goodsExpressId: '', //主键Id 修改必传
          enabledFlag: row.enabledFlag, //启用状态
          expressId: row.expressId,//快递id
          storeIds: row.storeIds, //店铺Id 逗号分隔
          goodsIds: row.goodsIds, //商品Id 逗号分隔
        }
        self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + self.version + '/updateOrderAmt', upMoney)
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                type: 'success',
                message: '修改成功!',
              })
              self.resultsData[index].isShowKit1 = false;
              self.resultsData[index].isShowMoney = false;
            } else {
              self.$message({
                message: '修改失败，请重试！',
                type: 'warning'
              });
              row.storeIdList=row.storeIds
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      //修改商品指定快递
      updateShop(row) {
        let self = this;
        var upShop = {
          goodsExpressId: row.goodsExpressId,//主键Id 修改必传
          goodsIds: row.goodsIds,  //商品Id 逗号分隔
          enabledFlag: row.enabledFlag, //启用状态
          expressId: row.expressId,  //快递Id
          storeIds: row.storeIds,  //店铺Id 逗号分隔
        }
        if (row.goodsExpressId == undefined) {
          upShop.goodsExpressId = ''
        }
        if (row.expressId == undefined) {
          upShop.expressId = ''
        }
        self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + self.version + '/updateGoods', upShop)
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                type: 'success',
                message: '修改成功!',
              })
            } else {
              self.$message({
                message: '修改失败，请重试！',
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      //选择商品关闭窗口
      handleClose() {
        this.dialogFormVisiblec = false;
      },

      //商品弹框
      clickImg(row, index,isMYs) {
        //初始化每页数量
        if (sessionStorage.getItem("hold_OutStock_1") != null) {
          this.pageSize = parseInt(sessionStorage.getItem("hold_OutStock_1"));
        }
        var self = this;
        let arr=[];
        let str='';
        let str2=[];
        if(isMYs==12){
          self.index = index;
        }
        var paramData = {
          goodsCode: '',
          barCode: '',
          goodsName: '',
          merchantId: 0,
          "page": self.curPage,//当前页
          "size": self.pageSize,//每页行数
        }

        self.queryFn = (paramData) => {
          self._post('com.edb01.erp.mdata.service.api.GoodsService/' + self.version + '/queryGoodsAndSuitByCondition', paramData)
            .then(function (response) {
              if (response.data.code == 0) {
                let ArrData=new Map()
                self.resultData[self.index].goodsEchoBeans.forEach(v=>{
                  ArrData.set(v.goodsId,v)
                })
                let arr=[]
                response.data.result.rows.forEach(item=>{
                  if(!ArrData.get(item.goodsId)){
                    arr.push(item)
                  }
                })
                self.tableDataAll = arr;
                self.total = response.data.result.total;
                self.tableDataAll.forEach((item, i) => {
                  if (item.goodsImageBean && item.goodsImageBean.imageUrl) {
                    item.imageUrl = item.goodsImageBean.imageUrl;
                  }
                })
                self.loading = false
              } else {
                self.$message({
                  message: response.data.result.message,
                  type: 'warning'
                });
                self.loading = false
              }
            })
            .catch(function (error) {
              console.log(error);
              self.loading = false
            });
        }
        this.queryFn(paramData);
        this.dialogFormVisiblec = true;
      },

      //选择商品勾选数据
      changeData(val) {
        this.tableData1 = val
      },

      //修改商品绑定快递启用状态switch开关是否停用
      switchChangeShop(row) {
        let self = this
        if (row.enabledFlag == true) {
          self.clickStop(row)
        } else {
          self.$confirm('是否停用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            self._post('com.edb01.erp.wms.service.api.ExpressSetupService/1.0.0/editGoodsEnable', {
              goodsExpressId: row.goodsExpressId,
              enabledFlag: false,
              merchantId: 0
            })
              .then(function (res) {
                if (res.data.code == 0) {
                  self.$message({// 给用户一个提示
                    message: '已停用',
                    type: 'success'
                  });
                } else if (res.data.code == 410006) {
                  row.enabledFlag = true
                  self.defaultShop = res.data.result
                  self.title = '停用失败'
                  self.centerDialogVisible = true
                }
              })
              .catch(function (err) {
                console.log(err)
              })
          }).catch(() => {
            row.enabledFlag = true
            self.$message({
              type: 'info',
              message: '已取消停用'
            });
          });
        }
      },

      //修改商品绑定快递启用状态switch开关是否启用
      clickStop(row) {
        let self = this
        self.$confirm('是否启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          // 发请求
          self._post('com.edb01.erp.wms.service.api.ExpressSetupService/1.0.0/editGoodsEnable', {
            goodsExpressId: row.goodsExpressId,
            enabledFlag: true,
            merchantId: 0
          })
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({// 给用户一个提示
                  message: '已启用',
                  type: 'success'
                })
              } else {
                self.$message({
                  message: res.data.message,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }).catch(() => {
          row.enabledFlag = false
          self.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      },

      // 查看商品日志的方法
      changDialogShow() {
        this.pulicLogVisible = false;
      },

      // 查看金额日志的方法
      changDialogShowMoney() {
        this.pulicLogVisibleMoney = false;
      },

      //添加商品新指定
      addClickExpress: function () {
        let arr=[]
        this.resultData.forEach(item=>{
          arr.push(item.isShowShop)
        })

        if (arr.indexOf(true)>-1) {
          this.$message({
            message: '存在未保存方案，无法添加!',
            type: 'warning'
          });
          return false;
        }
        if (this.resultData == undefined) {
          if(this.isSee==1){
            this.dog = false;
            this.resultData = [];
            this.isClasses=false
            this.resultData.push({index: '请选择指定快递',isClasses:false, ids: '', isShowKit2: true, isShowShop: true, enabledFlag: false,goodsEchoBeans:[]})
          }else{

          }
        } else {
          if(this.isSee==1){
            this.dog = false;
            this.resultData.push({index: '请选择指定快递',isClasses:false, ids: '', isShowKit2: true, isShowShop: true, enabledFlag: false,goodsEchoBeans:[],})
            this.$nextTick(()=>{
              this.$refs.tables.bodyWrapper.scrollTop =this.$refs.tables.bodyWrapper.scrollHeight
            })
          }else{

          }

        }
      },

      //添加订单金额新指定
      addClicksExpress: function () {
        if (this.dog1 == false) {
          this.$message({
            message: '存在未保存方案，无法添加!',
            type: 'warning'
          });
          return false;
        }
        this.dog1 = false;
        if (this.resultsData == undefined) {
          this.resultsData = []
          this.isClasses=false
          this.resultsData.push({index: '请选择指定快递',isClasses:false,bgColor: 'white', isShowKit1: true, isShowMoney: true, enabledFlag: false})
          this.$nextTick(()=>{
            this.$refs.tabless.bodyWrapper.scrollTop =this.$refs.tabless.bodyWrapper.scrollHeight
          })
        } else {
          this.isClasses=false
          this.resultsData.push({index: '请选择指定快递',isClasses:false,bgColor: 'white', isShowKit1: true, isShowMoney: true, enabledFlag: false})
        }
      },

      //取消商品
      cancelShopData(row, index) {
        if (row.goodsExpressId == undefined) {
          this.resultData.splice(index, 1);
        } else {
          let obj = this.resultData[index];
          this.$set(this.resultData, index, obj);
          row.isShowShop = false;
          row.isShowKit2 = false;
          this.queryShop()// 重新渲染数据
        }
        this.dog = true;
      },

      //取消金额
      cancelMoneyData(row, index) {
        if (row.orderamtExpressId == undefined) {
          this.resultsData.splice(index, 1);
        } else {
          this.queryMoney()// 重新渲染数据
        }
        this.dog1 = true;
      },

      // 点击删除标签的时候
      clickDel(index, val) {
        if (val = 1) {
          this.storage.splice(index, 1)
        }
      },

      // 选择商品添加复选框
      handleSelectChange(val) {
        this.storage1 = val
      },

      //获取快递
      getExpress() {
        let self = this
        self._post('com.edb01.erp.wms.service.api.ExpressService/' + self.version + '/listExpress', {merchantId: 0})
          .then(function (res) {
            if (res.data.code == 0) {
              self.ExpressAll = res.data.result
            } else {
              self.$message({
                message: res.data.msg, //如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      //店铺列表
      getShop() {
        let self = this
        self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/list')
          .then(function (res) {
            if (res.data.code == 0) {
              self.resultData1 = res.data.result;
              res.data.result.forEach(function (val) {
                self.shopAll1.push({value: val.storeId,label: val.storeName});

              }.bind(this));
              res.data.result.forEach(function (val) {
                self.shopAll2.push({value: val.storeId,label: val.storeName});

              }.bind(this));
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      checked(){
        this.$refs.table.toggleRowSelection(this.tableDataAll[1],true);
      },

      //模糊查询
      queryData() {
        let self = this
        var queryAll = { // 模糊查询
          barCode: '',
          goodsName: '',
          goodsCode: '',
          page: 1, // 页数
          size: 15, // 行数
        }
        this.queryFn(self.queryAll);// 初始化调用
      },

    },
    created() {
      this.getShop();//获取店铺
      this.getExpress();//获取快递
      // 动态获取表格高度
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('#fitTable').offset().top - 55);
      });
    },

    //订单金额指定快递列表
    mounted() {
      setTimeout(()=>{
        $('#example-post').multiselect({
          onInitialized: function(select, container) {
            //改变滚动条样式
            $("._scroll").yi_scroll({
              barColor:'hsla(220,4%,58%,.3)'
            });
          },
        });
      })

      //初始化商品数据
      var self = this;
      self.queryShop = () => {
        let self = this;
        let str = ''
        this._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + this.version + '/getGoodsExpressBean')
          .then(function (res) {
            if (res.data.success == true) {
              if(res.data.result==undefined){
                self.resultData =[]
                self.isSee=1;
              }else{
                self.resultData= res.data.result;
                self.isSee=1;
              }
              if (self.resultData.length > 0) {
                for (var item of res.data.result) {
                  item.isShowKit2 = false;
                  item.isShowShop = false;
                  item.goodsEchoBeans.forEach((val) => {
                    str += val.goodsId + ','
                  })
                  item.ids = str.slice(0, -1)
                }
              }
            // self.originalData = JSON.parse(JSON.stringify(res.data.result));
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
      }
      this.queryShop();

      //初始化金额数据
      this.queryMoney = () => {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + self.version + '/getOrderAmtExpressBean')
          .then(function (res) {
            if (res.data.success == true) {
              if(res.data.result==undefined){
                self.resultsData =[]
              }else{
                self.resultsData= res.data.result;
                res.data.result.forEach((val,index) => {
                  res.data.result[index].bgColor = '#F2F2F2'
                });
              }
              for (var item of res.data.result) {
                item.isShowKit1 = false;
                item.isShowMoney = false;
              }
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
      this.queryMoney();
    }
  }
</script>

<style scoped>
  #SpecifiedDelivery  #el-table-filter {
    height:100px;
    overflow: hidden;
  }

  .box1 {
    cursor: pointer;
    color: #409EFF;
    margin-right: 10px;
  }

  .box2 {
    color: red;
  }

  .box {
    color: #999;
  }

  .block {
    margin: 20px 0 16px 0;
    width: 100%;
    line-height: 30px;
    height: 30px;
    background: #F7F7F7;
    padding-left: 8px;
    border: 1px solid #DFDFDF;
  }

  .inpNum {
    width: 40px;
    height: 24px;
    border-radius: 5px;
  }
  .el-popover el-popper{
    height: 200px!important;
    overflow: auto;
  }
  #SpecifiedDelivery  #main[data-v-0235d39d] {
    padding: 0px;
  }
</style>
<style>
  #SpecifiedDelivery  #el-popover-7964 .el-popover el-popper{
    height: 200px!important;
    overflow: auto;
  }
  #SpecifiedDelivery .el-popover{
    height: 200px!important;
    overflow: auto;
  }
  #SpecifiedDelivery .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0;
  }

  #SpecifiedDelivery .el-table .cell, .el-table th div {
    padding-right: 0;
  }

  #SpecifiedDelivery .el-table_1_column_1, .el-table_1_column_2, .el-table_1_column_3, .el-table_1_column_4, .el-table_1_column_5, .el-table_1_column_6 {
    border-right: 1px solid #ebeef5 !important;
  }

  #SpecifiedDelivery .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff !important;
  }

  #SpecifiedDelivery .el-tag--small {
    max-width: 60px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
  } #SpecifiedDelivery .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  #SpecifiedDelivery .box #isSuit1{
    border: 1px solid red !important;
  }
  #SpecifiedDelivery .box #isSuit2{
    border: 1px solid red !important;
  }
  #SpecifiedDelivery .el-select__input {
    width: 50px;
  }
  #SpecifiedDelivery  .isNoSame {
    text-align: left;
    height: 20px;
    width: 120px;
    display:block;
    float: left;
  }
  #SpecifiedDelivery  #main[data-v-0235d39d] {
    padding: 0px;
  }
</style>
