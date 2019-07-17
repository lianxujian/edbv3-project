<!--添加入库单 佩玖-->

<template>
  <!--表格-->
  <div id="Addinstorage">
    <el-breadcrumb separator=">" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/inStock' }">入库</el-breadcrumb-item>
      <el-breadcrumb-item>添加入库单</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表头 -->
    <div>
      <p style="margin: 10px 0"><strong>基本信息</strong></p>
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <label for="searchStock">入库类型：</label><!--isChange-->
            <el-select filterable clearable v-model="stockInType" :disabled="tableData.length != 0"
                       placeholder="请选择入库类型"
                       style="width: 201px!important;">
              <el-option
                v-for="item in StockOutTypeEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="xin">* </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label for="searchStock">仓库：</label>
            <el-select id="searchStock" filterable clearable v-model="storageId" placeholder="请选择仓库"
                       style="width: 201px!important;">
              <el-option
                v-for="item in optionsStock"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="xin">* </span>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content">
            <label for="searchStock">供应商：</label>
            <el-select id="supplierId" filterable clearable v-model="supplierIds" placeholder="请选择供应商"
                       style="width: 201px!important;">
              <el-option
                v-for="item in supplier"
                :key="item.supplierId"
                :label="item.supplierName"
                :value="item.supplierId">
              </el-option>
            </el-select>
            <span class="xin" v-show="stockInType!=2">*</span>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content">
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17">
          <div class="grid-content">
            <label for="explain" style="">入库备注：</label>
            <el-input
              maxlength="200"
              id="explain"
              type="textarea"
              :rows="4"
              placeholder="请输入入库备注"
              v-model="remark"
            >
            </el-input>
            <span>{{remark.length}}/200</span>
          </div>
        </el-col>
      </el-row>
      <div>
      </div>
    </div>
    <p style="margin: 10px 0"><strong>商品信息</strong></p>
    <div class="col-nav" style="margin:10px 0 10px;">
      <ul>
        <li @click="addButton()"><span>+添加商品</span></li>
        <li @click="deldteButton()"><span>删除</span></li>
      </ul>
    </div>
    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData" style="width: 100%" fit ref="table" id="tableH" border :max-height="table_h"
                @selection-change="handleSelectionChangssa">
        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          align='center'
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column label="商品" align='left' min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl" alt="" style="width: 30px;height: 30px;margin-right: 5px">
            <span v-show="scope.row.suitFlag==true">【套】</span><span>{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="条形码" align='center' prop="barCode" min-width="150">
        </el-table-column>

        <el-table-column label="商品编号" align='center' prop="goodsCode" min-width="150">
        </el-table-column>

        <el-table-column label="规格" align='center' prop="specification" min-width="150">
        </el-table-column>

        <el-table-column :label="item.attributeName" align="center" v-for="(item,i) in state" :key="i" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="cen-g" v-for="(itemd,j) in scope.row.goodsAttributeAllShowBeanList">
              <span v-if="j==i">{{ itemd.attributeValue }}</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="商品属性" min-width="150" v-if="stockInType==2">
          <template slot-scope="scope">
            <el-select v-model="scope.row.goodsAttributeType" :disabled="scope.row.forbid != 1 || scope.row.overdueFlag" placeholder="请选择"
                       style="width:100%"
                       @change="typeTwo(scope.row,scope.$index)">
              <el-option
                v-for="item in shopList"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="入库数量" align='center' min-width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.goodsQty"
                      :class="{ box: isClasses ==true && (scope.row.goodsQty==undefined||scope.row.goodsQty=='')}"
                      @keyup.native="scope.row.goodsQty = scope.row.goodsQty.replace(/[^\d]/g,'');if(scope.row.goodsQty == 0)scope.row.goodsQty = ''"
                      :maxlength="9" style="width:100%;"
                      ></el-input>
          </template>
        </el-table-column>

        <el-table-column label="生产日期" align='center' min-width="150" v-if="batchEnable">
          <template slot-scope="scope">
            <el-date-picker
              :class="{ box: scope.$index == isClass && isMather == 'produceTimeshow' }"
              v-model="scope.row.produceTimeshow"
              :disabled="!(scope.row.batchEnabledFlag==true&&scope.row.suitFlag==false)||stockInType==2"
              :picker-options="pickerOptions2"
              type="date"
              style="width:100%!important;"
              placeholder="选择日期"
              @change="changeProduceTime(scope.row,scope.$index)"
            >
            </el-date-picker>
          </template>
        </el-table-column>

        <el-table-column label="批次号" align='center'min-width="150" v-if="batchEnable">
          <template slot-scope="scope">
            <el-input v-model="scope.row.batchNo"
                      :class="{ box: scope.$index == isClass && isMather == 'batchNo' }"
                      @keyup.native="scope.row.batchNo = scope.row.batchNo.replace(/[^\d]/g,'')"
                      :disabled="!(scope.row.batchEnabledFlag==true&&scope.row.suitFlag==false)"
                      @blur="Batchcheck(scope.row,scope.$index)" maxlength="50" style="width:100%;">
              <i slot="suffix" class="el-input__icon el-icon-more"
                 style="cursor: pointer"
                 v-show="scope.row.batchEnabledFlag==true && scope.row.suitFlag==false"
                 @click="batchdata(scope.row,scope.$index)"></i>
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="保质期" align='center' prop="expTimeEcho" min-width="150" v-if="batchEnable">
        </el-table-column>

        <el-table-column :label="item.attributeName" v-for="(item,index) in batchoption" align='center'
                         :key="item.index" min-width="150" v-if="batchAttrShow">
          <template slot-scope="scope">
            <span v-for="(val) in scope.row.batchoptiondataes">
            <span v-if="item.attributeName==val.attributeName">

              <el-input v-model="scope.row['attributeValue'+index]"
                        :disabled="stockInType==2||scope.row.isChange!=1"
                        v-show="val.attributeType=='2'" maxlength="50"
                        style="width:100%;"></el-input>
              <el-select v-model="scope.row['attributeValueId'+index]"
                         :disabled="stockInType==2||scope.row.isChange!= 1"
                         v-show="val.attributeType=='1'" placeholder="请选择"
                         clearable style="width:100%;"
                         @change="typeTwo2(scope.row,scope.$index)">
              <el-option
                v-for="items in val.attributeCodeBeans"
                :key="items.attributeValueName"
                :label="items.attributeValueName"
                :value="items.attributeValueId">
              </el-option>
           </el-select>

            </span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="200" align="center">
          <template slot-scope="scope">

            <el-button @click="addBatch(scope.row,scope.$index)" v-show="scope.row.batchEnabledFlag && !scope.row.suitFlag"
                       type="text" size="small">添加批次
            </el-button>
            <el-button @click="addAttribute(scope.row,scope.$index)" v-show="stockInType == 2 && scope.row.overdueFlag == false"
                       :disabled="scope.row.forbid!= 1"
                       type="text" size="small">添加属性
            </el-button>
            <el-button @click="handleDelete(scope.row,scope.$index)" type="text" size="small">删除</el-button>

          </template>
        </el-table-column>
      </el-table>

      <!--分页-->


    </div>
    <div class="wmsFoot">
      <router-link :to="{path: '/inStock'}">
        <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                   round @click="">返回
        </el-button>
      </router-link>
      <el-button :loading="isDisable" class="btnStyle"
                 style="margin-left:40px;background-color:#49A0F5;color:white;border:none;"
                 @click="addintbound()"  v-loading.fullscreen.lock="fullscreenLoading"><span v-if="!isDisable">创建入库单</span>
        <span v-else>创建中...</span>
      </el-button>

    </div>

    <!--添加商品-->
    <div id="special">
      <el-dialog v-dialogDrag
        title="选择商品"
        :visible.sync="addShop"
        :before-close="handleClose"
        width="850px"
        center>
        <div id="searchBox">
          <div class="leftBox1">
            <el-row>
              <el-col :span="15">
                <div class="grid-content">
                  <el-select style="width: 120px!important;" v-model="baby" filterable placeholder="">
                    <el-option
                      v-for="item in shopData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input style="width: 192px!important;" v-model="babyt" @keyup.enter.native="query()"
                            placeholder=""></el-input>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">
                  <label for="searchStock2">是否套装：</label>
                  <el-select id="searchStock2" v-model="enabledFlag" filterable placeholder="全部">
                    <el-option
                      v-for="item in enabledFlagTwo"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="rightBox1">
            <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                       @click="query()">查询
            </el-button>
          </div>
          <div class="pDown">
            <el-table :data="tableDataShop"
                      border
                      v-loading="loading"
                      height="556"
                      style="width: 100%"
                      ref="multipleTable"
                      @selection-change="handleSelectionChange"
            >
              <el-table-column
                label="序号"
                width="45"
                type="index"
                align="center">
              </el-table-column>

              <el-table-column
                align='center'
                type="selection"
                width="50">
              </el-table-column>

              <el-table-column label="商品" align='left' min-width="150" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <!--<img :src="scope.row.imageUrl" alt="" style="width: 30px;height: 30px;margin-right: 10px">-->
                  <el-popover
                    placement="left-end"
                    title="商品图片预览："
                    width="520"
                    height="520"
                    trigger="hover">
                    <img :src="scope.row.imageUrl" width="100%" height="100%"/>
                    <img slot="reference" :src="scope.row.imageUrl"  style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px;">
                  </el-popover>
                  <span>{{scope.row.goodsName}}</span>
                </template>
              </el-table-column>


              <el-table-column label="商品编号" align="center" min-width="100" prop="goodsCode" :show-overflow-tooltip="true">
              </el-table-column>

              <el-table-column label="条形码"  align="center" min-width="100" prop="barCode" :show-overflow-tooltip="true">
              </el-table-column>


              <el-table-column label="规格"  align="center" min-width="100" prop="specification" :show-overflow-tooltip="true">
              </el-table-column>

              <el-table-column label="是否套装"  align="center" min-width="100">
                <template slot-scope="scope">
                  <span  v-show="scope.row.suitFlag == false">否</span>
                  <span  v-show="scope.row.suitFlag == true">是</span>
                </template>
              </el-table-column>

            </el-table>
            <div style="float: right">
              <pagination
                :totalCom="total"
                :pageSizeCom="pageSize"
                :curPageCom="curPage"
                @pageSizeVal="getPageSize" @curPageVal="getCurPage"
              ></pagination>
            </div>
          </div>
        </div>
        <div style="margin-top:40px;margin-bottom:20px;text-align: right">
          <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                     @click="handleClose()">取消
          </el-button>
          <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                     @click="success()">确定
          </el-button>
        </div>
      </el-dialog>
    </div>


    <!--添加原批次-->
    <el-dialog v-dialogDrag
      title="选择批次"
      :visible.sync="addbathlist"
      id="isChangs"
      width="1050px"
      center>
      <el-table :data="tableDataad"
                highlight-current-row
                @current-change="handleSelectionChangesd"
                border
                style="width: 100%"
      >
        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column label="提示" align='center' width="260px">
          <template slot-scope="scope">

            <span class="initP-g" v-show="scope.row.showWay == 'A'"><span style="color:#89C589">正常---</span>预警提前期---发货提前期---过期
            </span>
            <p class="initP-g" v-show="scope.row.showWay == 'B'"><span style="color:#999999">正常---</span><span style="color:#FEC773 ">预警提前期---</span>发货提前期---过期
            </p>
            <p class="initP-g" v-show="scope.row.showWay == 'C'"><span style="color:#999999">正常---</span><span style="color:#999999">预警提前期---</span><span style="color:#FE6C6C ">发货提前期---</span>过期
            </p>
            <p class="initP-g" v-show="scope.row.showWay =='D'">正常--预警提前期---发货提前期---<span style="color:#999999">过期</span>

            <p class="initP-g" v-show="scope.row.showWay =='E'">正常---预警提前期---发货提前期---过期</p>

          </template>
        </el-table-column>

        <el-table-column label="批次号" align="center" prop="batchNo">
        </el-table-column>

        <el-table-column label="失效日期" align="center">
          <template slot-scope="scope">
            <p class="initP-g">{{ scope.row.overdueTime | normalTime(6)}}</p>
          </template>
        </el-table-column>

        <el-table-column label="预警提前期" align="center" prop="warningAheadTimeText">
        </el-table-column>

        <el-table-column label="发货提前期" align="center" prop="sendAheadTimeText">
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="addbathlist= false" style="line-height: 10px">取 消</el-button>
            <el-button size="mini" type="primary" @click="refuse()" style="line-height: 10px">确 定</el-button>
          </span>

    </el-dialog>

  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'

  export default {
    components: {
      pagination
    },
    data() {
      return {
        pickerOptions2: {          //时间选择置灰函数
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        version: '1.0.0',
        loading:true,
        batchAttrShow:false,//批次属性判断
        fullscreenLoading: false, //判断是否加遮罩
        isClasses: false, //判断入库数量输入框是否切换边框样式
        invoking: 5, //判断批次号是否改变
        batchNoes: [],//所有批次号集合
        replaceDatas: '',//保存选择的批次号
        ids2: '',  //获取自定义属性提交的商品id集合
        isClass: 50000, // 判断生产日期是否为空
        isMather: 50,// 判断生产日期是否为空
//        optionsStock: [{value: '', label: '全部'}],//仓库下拉
        supplier: [],//供应商
        StockOutTypeEnum: [//入库类型
          {
            value: '1',
            label: '采购入库 '
          }, {
            value: '2',
            label: '调拨入库'
          },
          {
            value: '3',
            label: '其他入库'
          },
        ],
        addbathlist: false, //添加批次号弹窗
        stockInType: '',//出库类型
        storageId: '', //仓库id
        supplierIds: '',//供应商
        remark: '',//出库备注
        //商品
        enabledFlagTwo: [{ //是否套装类型枚举
          value: '',
          label: '全部'
        }, {
          value: false,
          label: '单品'
        }, {
          value: true,
          label: '套装'
        }],
        enabledFlag: '',  //是否套装值
        shopData: [{
          value: '1',
          label: '条形码'
        }, {
          value: '2',
          label: '商品编号'
        }, {
          value: '3',
          label: '备用条形码'
        }],
        multipleTable: [],//勾选条数
        baby: '1', //选择商品弹窗类型选择
        babyt: '', //选择商品弹窗具体类型输入
        suitFlag: '',//是否是套装
        goodsCode: '', // 商品编码。
        barCode: '', // 商品条形码。
        goodsName: '',// 商品名称。
        enableFlag: '',//是否可用
        standbyBarCode: '',//备用条形码
        goodsIdListJsonStr: '',//json串 出入库添加商品时排除页面上已经存在的商品集合
        multipleSelection: [],//选择商品
        shopList: [// 1//商品属性 1：正品 2：次品
          {
            value: 1,
            label: '正品'
          }, {
            value: 2,
            label: '次品'
          }],
        indexs: '', //选择批次号后应该插入的index
        optionsStock: [], //仓库枚举集合
        tableData: [],//表格数据
        total: 0, //总页数
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        isDisable: false, //创建入库单按钮置灰判断
        tableDataShop: [],//选择商品表格数据
        addShop: false,//添加商品窗口
        state: [], //自定义属性
        tableNum: [], //勾选商品结合
        tableDataad: [], //添加批次号弹窗批次号集合
        batchEnable: '', //行业化插件
        replaceData: null,//单选获取批次号
        table_h: 0, //表格高度
        ids: [], //已选中的商品id
        batchoption: [] //批次属性
      }
    },
    mounted() {
      this.plugflag();//行业化插件是否开启
      this.initStock();//初始化仓库下拉
      this.supplierSum();//供应商

      //表格高度自适应
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 90);
      });


    },

    methods: {
      //查询
      query() {
        this.addButton()
      },

      //获取批次
      handleSelectionChangesd(val) {
        this.replaceData = val.batchNo
        this.replaceDatas = val.produceTime

      },

      //确定获取批次属性回显信息
      refuse() {
        this.$nextTick(() => {
          this.tableData[this.indexs].batchNo = this.replaceData;  //单选获取批次号放入添加的批次行中
          this.tableData[this.indexs].produceTimeshow = this.replaceDatas;  //单选获取批次号放入添加的批次行中
          this.addbathlist = false;
          this.tableData[this.indexs].forbid = 1;
        })
        let data = {
          goodsId: this.tableData[this.indexs].goodsId,
          batchNo: this.replaceData
        }
        this._post('com.edb01.erp.wms.service.api.StorageAttributeService/' + this.version + '/getGoodsBatchAllAtribute', data).then(function (res) {
          if (res.data.success) {
            if (res.data.hasOwnProperty('result')) {
              this.tableData[this.indexs].isChange = 0

              if( this.tableData[this.indexs].batchEnabledFlag == true && this.tableData[this.indexs].suitFlag == false ){
                this.tableData[this.indexs].batchoptiondataes.forEach((num,i)=> {
                  res.data.result.forEach((val, n)=> {
                    if (num.attributeId == val.attributeId) {
                      this.tableData[this.indexs]['attributeValueId' + n]= val.attributeValueId;
                      this.tableData[this.indexs]['attributeValue' + n] = val.attributeValue;
                    }
                  })

                })

              }


            }else {
              this.tableData[this.indexs].isChange = 1;

            }


          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })

          }
        }.bind(this))
      },

      //输入批次号校验
      Batchcheck(row,index) {

        if (row.batchNo != '') {
          let data = {
            goodsId: row.goodsId,
            stockInType: this.stockInType,
            batchNo: row.batchNo,
            supplierId: this.supplierIds

          }
          this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/checkAndEchoBatch', data).then(function (res) {
            if (res.data.success) {
              if (res.data.hasOwnProperty('result')) {
                this.tableData[index].isChange = 0
                this.tableData[index].produceTimeshow = res.data.result.produceTime;
                if( this.tableData[index].batchEnabledFlag == true && this.tableData[index].suitFlag == false ){
                  this.tableData[index].batchoptiondataes.forEach((num,i)=> {
                    res.data.result.goodsBatchAttributeValueBeanList.forEach((val, n)=> {
                      if (num.attributeId == val.attributeId) {
                        this.tableData[index]['attributeValueId' + n]= val.attributeValueId;
                        this.tableData[index]['attributeValue' + n] = val.attributeValue;
                      }
                    })

                  })

                }

              }else {
                this.tableData[index].isChange = 1;
              }


            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })


            }
          }.bind(this))

        }


      },

      //点击省略号获取批次数据
      batchdata(row, index) {

        if (row.batchNo == '') {
          this.$message({
            message: '有商品的批次号为空,请输入批次号!',
            type: 'warning'
          })
          return false
        }
        let data = {
          "goodsId": row.goodsId,
          "batchNos": row.batchNo,
        }

//        if(row.batchNosd!=''){
//          data.batchNos=row.batchNosd
//        }
        this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/queryAndUpdateBatch', data).then(function (res) {
          if (res.data.code == 0) {
            let ArrData = new Map()   //Map结构提供了“值—值”的对应，是一种更完善的Hash结构实现。如果你需要“键值对”的数据结构，
            // Map比Object更合适。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
            this.tableData.forEach((item) => {
              ArrData.set(item.batchNo, item)
            })
            let arr = []
            res.data.result.forEach((val) => {
              if (!ArrData.get(val.batchNo)) {    //判断批次号val.batchNo在ArrData是否存在，不存在就可以继续添加操作然后push进列表。存在就排除出去
                arr.push(val)
              }
            })

            this.addbathlist = true;
            this.tableDataad = arr;

          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })

          }
        }.bind(this))
        this.indexs = index;
      },

//      添加批次
      addBatch(row,index) {
        if (this.stockInType == 2) {
          let bats = ''
          this.tableData.forEach((item) => {
            bats += item.batchNo + ','
          })
          let datas = {
            goodsId: row.goodsId,
            batchNos: bats.slice(0, -1),
          }

          this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/checkAddBatch', datas)
            .then(function (res) {
              if (res.data.success) {
                let data = Object.assign({}, row);
                data.forbid = 1;
                data.produceTimeshow = res.data.result.produceTime;
                data.batchNo = res.data.result.batchNo;
                if (this.stockInType == 2 && res.data.result.hasOwnProperty("goodsBatchAttributeValueBeanList")) {
                  res.data.result.goodsBatchAttributeValueBeanList.forEach((val, n) => {
                    data["attributeValueId" + n] = val.attributeValueId;
                    data["attributeValue" + n] = val.attributeValue;
                  })
                }
                this.tableData.push(data)  //在原商品行增加一行记录
                this.tableData[index+1].pri=this.tableData.length

              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })

              }
            }.bind(this))

        } else {

          let data = Object.assign({}, row)
          this.tableData.forEach((item) => {
            item.batchoptiondataes.forEach((val, n) => {
              data["attributeValueId" + n] = ''
              data["attributeValue" + n] = ''

            })

          })

          data.produceTimeshow = '';
          data.batchNosd = data.batchNo;
          data.batchNo = ''
          this.tableData.push(data)  //在原商品行增加一行记录
          this.tableData[index+1].pri=this.tableData.length


        }


      },

      //      添加属性
      addAttribute(row, index) {
        row.forbid = 0;
        let data = Object.assign({}, row);
        data.goodsAttributeType = (data.goodsAttributeType == 1) ? 2 : 1;
        data.goodsQty = '';
        this.tableData.splice(index + 1, 0, data)
        this.tableData[index+1].pri=this.tableData.length
        this.tableData.forEach((item, i) => {
          item.isMyAttr = 'isDelt' + i       //区别是否是添加属性后数据完全相同


        })

      },

      //删除
      handleDelete(row, index) {
        let arr=[]
        this.tableData.forEach((item, i) => {
          if (row.goodsId== item.goodsId) {
            arr.push(i);
            if(arr.length==2){
             if(arr[0]==index){
               let j=arr[1]
               this.tableData[j].forbid = 1
             }else {
               let n=arr[0]
               this.tableData[n].forbid = 1

             }
            }

          }
        })
        this.ids.forEach((val, n) => {
          if (this.tableData[index].goodsId == val) {
            this.ids.splice(n, 1)
          }
        })
        this.tableData.splice(index, 1);


        if (this.tableData.length == 0) {
          this.state = '';

        }


      },

      // 批量删除
      deldteButton () {
        if (this.tableNum == '') {
          this.$message({
            message: '请选择商品',
            type: 'warning'
          })

        } else {

          this.tableNum.forEach((item) => {
            this.ids.forEach((v, i) => {
              if (item.goodsId == v) {
                this.ids.splice(i, 1)
              }
            })
          })
          let goodsId
          let num
          this.tableNum.forEach((val, index) => {
            this.tableData.forEach((v, i) => {
              if (v.hasOwnProperty("isMyAttr")) {
                if(val.isMyAttr == v.isMyAttr){
                  num=i;
                  goodsId=this.tableData[i].goodsId;
                  this.Dletes2(goodsId,num);
                  this.Dletes(i);  //删方法

                }

              } else {
                if (val.goodsId == v.goodsId) {
                  this.tableData.splice(i, 1)
                }
              }
              this.$message({
                message: "删除成功" + this.tableNum.length + "条",
                type: 'success'
              });

            })
          })


          if (this.tableData.length == 0) {
            this.state = '';

          }

        }


      },

      Dletes(i){
        this.tableData.splice(i,1)
      },

      Dletes2(goodsId,num){
        let arr=[]
        this.tableData.forEach((item, i) => {
          if (goodsId== item.goodsId) {
            arr.push(i);
            if(arr.length==2){
              if(arr[0]==num){
                let j=arr[1]
                this.tableData[j].forbid = 1
              }else {
                let n=arr[0]
                this.tableData[n].forbid = 1

              }
            }
          }
        })
      },

      handleSelectionChangssa(val) {
        this.tableNum = val;
      },

      handleClose() {
        this.babyt = '';
        this.baby = '1';
        this.enabledFlag = '';
        this.$refs.multipleTable.clearSelection();
        this.addShop = false;

      },

      initTime() {
        this.tableData.forEach(function (item) {
          if (item.produceTimeshow == '') {
            item.produceTimeshow = new Date().getTime();
          }

        })
      },

      // 添加商品弹窗待选商品列表
      addButton() {
        if (this.tableData.length == 0) {
          this.isClasses = false;
        }
        if (this.stockInType == '') {
          this.$message({
            message: '请选入库类型',
            type: 'warning'
          });

        } else if (this.storageId == '') {
          this.$message({
            message: '请选择仓库',
            type: 'warning'
          });

        } else {
          if (this.stockInType == 1 && this.supplierIds == '' || this.stockInType == 3 && this.supplierIds == '') {
            this.$message({
              message: '请选择供应商！',
              type: 'warning'
            });
          } else {
            this.addShop = true;//添加商品窗口
            let data = {
              "sendStorageId": this.storageId,
              "stockInType": this.stockInType,
              "page": this.curPage,//当前页
              "size": this.pageSize,//每页行数
              "suitFlag": this.enabledFlag,//是否是套装
              "goodsCode": '', // 商品编码。2
              "barCode": '', // 商品条形码。1
              "goodsName": this.goodsName,// 商品名称。
              "standbyBarCode": '',//备用条形码3
              "goodsIdListJsonStr": JSON.stringify(this.ids),//json串 出入库添加商品时排除页面上已经存在的商品集合
            }
            if (this.tableData.length == 0) {
              data.goodsIdListJsonStr = ''
            }
            if (this.baby == 1) {
              data.barCode = this.babyt;
              data.goodsCode = '';
              data.standbyBarCode = '';
            }
            if (this.baby == 2) {
              data.goodsCode = this.babyt;
              data.barCode = '';
              data.standbyBarCode = '';
            }
            if (this.baby == 3) {
              data.standbyBarCode = this.babyt;
              data.goodsCode = '';
              data.barCode = '';
            }
            this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsStockInWms', data).then((res)=> {
                if(res.data.success){
                  res.data.result.rows.forEach((item, i) => {
                    item.batchNo = '';
                    item.produceTimeshow = '';
                    item.isChange = 1;
                    item.forbid = 1;
                    item.imageUrl = item.goodsImageBean.imageUrl;
                    item.batchoptiondataes = this.batchoption
                    item.batchoptiondataes.forEach((value, num)=> {
                      item['attributeValue' + num] = '';
                      item['attributeValueId' + num] = '';
                    })

                  })
                  this.total = res.data.result.total;
                  this.tableDataShop = res.data.result.rows;
                  this.loading = false;
                }else {
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }

            });
          }

        }
      },

      //弹窗勾选后确定获取自定义属性生产日期为当前并且传参获取批次号
      success() {
        if( this.multipleSelection.length==0){
          this.$message({
            message: '请选择商品！',
            type: 'warning'
          })
          return false
        }

        let ids = []
        this.multipleSelection.forEach((item) => {
          ids.push(item.goodsId);
          this.ids2 = ids
          this.ids.push(item.goodsId);
        })
        let data = {
          "stockInType": this.stockInType,
          "batchEnable": this.batchEnable,
          "goodsIdListJsonStrSelect": JSON.stringify(this.ids2)
        }
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsStockInWmsItem', data).then(function (res) {
          if (res.data.code == 0) {
            this.multipleSelection.forEach((item) => {
              res.data.result.forEach((val) => {
                this.state = val.goodsAttributeAllShowBeanList;            //表头信息
                if (item.goodsId == val.goodsId) {
                  item.expTimeEcho = val.expTimeEcho;
                  item.goodsAttributeAllShowBeanList = val.goodsAttributeAllShowBeanList;  //获取自定义属性放入勾选内容
                  if (this.stockInType == 2) {   //出库类型如果为调拨就去生产日期批次号还有对应的批次属性回显包括下拉和文本框
                    this.batchNoes.push(val.batchNo)
                    item.batchNo = val.batchNo;
                    item.overdueFlag = val.overdueFlag;//过期判断
                    if(item.overdueFlag == true){      //已过期
                      item.goodsAttributeType=2         //设为次品且不可修改
                    }else if(item.overdueFlag == false){ //未过期
                      item.goodsAttributeType = 1        //设为正品可修改
                    }
                    item.produceTimeshow = val.produceTime;
                    item.batchoptiondataes.forEach((num)=> {
                      if (val.batchEnabledFlag == true && val.suitFlag == false) {
                        val.mdataGoodsBatchAttributeValueBean.forEach((val, n)=> {
                          if (num.attributeId == val.attributeId) {
                            item['attributeValueId' + n] = val.attributeValueId;
                            item['attributeValue' + n] = val.attributeValue;
                          }
                        })
                      }
                    })


                  }
                }
              })
            })

            this.addShop = false;

            if (this.multipleSelection.length != 0) {
              this.$message({
                message: "添加成功" + this.multipleSelection.length + "条",
                type: 'success'
              });
            }


            if (this.stockInType == 1 || this.stockInType == 3) {
              this.Assuccess()
            } else {
              this.multipleSelection.forEach((item,i) => {
                  this.tableData.unshift(item);
                if (item.batchEnabledFlag == true && item.suitFlag == false){
                  this.batchAttrShow = true;
                }

              })
              for (var i = this.tableData.length-1; i>=0; i--) {
                this.tableData[i].pri = this.tableData.length-i;
              }


            }

          }
          this.babyt = '';
          this.baby = '1';
          this.enabledFlag = '';
          this.isClasses = false;
          this.$refs.multipleTable.clearSelection();
        }.bind(this));


      },

      //当生产日期改变的时候
      changeProduceTime(row, index) {
        this.batchNoes.forEach((item) => {
          if (row.batchNo == item) {
            this.invoking = 1
          }

        })

        if (this.invoking == 1 || (row.produceTimeshow != '' && row.batchNo == '')) {
          let supplierNos='';
          this.supplier.forEach(function (item) { //获取对应的供应商编号
            if (item.supplierId === this.supplierIds) {
              supplierNos = item.supplierNo
            }
          }.bind(this))

          if (row.batchEnabledFlag == true && row.suitFlag == false) {
            let data = {
              supplierNo: supplierNos,
              batchNo: row.batchNo,
              supplierId: this.supplierIds,
              produceTime: row.produceTimeshow.getTime(),
              stockInType: this.stockInType,
              batchEnabledFlag: row.batchEnabledFlag,
              batchRules: row.batchRules,
              suitFlag: row.suitFlag,

            }
            this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/generateBatchNo', data).then(function (res) {
              if (res.data.success) {
                this.batchNoes.push(res.data.result);
                this.tableData[index].batchNo = res.data.result;
                this.invoking = 5
              }
            }.bind(this))
          }
        }


      },

      //入库类型为采购或其他的时候获取批次号
      Assuccess() {
        let supplierNos = ''
        this.supplier.forEach(function (item) { //获取对应的供应商编号
          if (item.supplierId == this.supplierIds) {
            supplierNos = item.supplierNo
          }
        }.bind(this))

        this.multipleSelection.forEach(function (item, i) {
          item.goodsAttributeType = 3
          if (this.multipleSelection[i].batchEnabledFlag == true && this.multipleSelection[i].suitFlag == false) {
            this.batchAttrShow = true;
            let data = {
              supplierNo: supplierNos,
              supplierId: this.supplierIds,
              produceTime: new Date().getTime(),
              stockInType: this.stockInType,
              batchEnabledFlag: this.multipleSelection[i].batchEnabledFlag,
              batchRules: this.multipleSelection[i].batchRules,
              batchNo: this.multipleSelection[i].batchNo,
              suitFlag: this.multipleSelection[i].suitFlag
            }
            this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/generateBatchNo', data).then(function (res) {
              if (res.data.success) {
                this.batchNoes.push(res.data.result)
                item.batchNo = res.data.result;
                item.produceTimeshow = new Date().getTime();
                this.tableData.unshift(item)
                for(var j= 0;j<this.tableData.length;j++){
                  this.tableData[this.tableData.length-1-j].pri=j+1;
                }

              }
            }.bind(this))
          } else {
            this.multipleSelection[i].produceTimeshow = '';
            this.tableData.unshift(item)
            for(var j= 0;j<this.tableData.length;j++){
              this.tableData[this.tableData.length-1-j].pri=j+1;
            }

          }
        }.bind(this))


      },

      //行业化插件是否开启查询
      plugflag() {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryBatchFlag').then((res) => {
          if (res.data.success) {
            this.batchEnable = res.data.result.batchFlag;
            if (res.data.result.batchFlag) {
              this.initBatchopt()

            }
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })

      },

      //修改商品属性校验
      typeTwo(row, index) {
        let obj = this.tableData[index];
        this.$set(this.tableData, index, obj);
      },

      typeTwo2(row, index) {
        let obj = this.tableData[index];
        this.$set(this.tableData, index, obj);
      },

      //创建入库单
      addintbound() {
        let exit = false; // 判断是否符合提交条件
        let arr2 = []
        let issure = ''
        this.tableData.forEach((items, i)=> {
          items.goodsAttrType = items.goodsAttributeType
          items.produceTime = items.produceTimeshow
          items.batchAttrListJsonStr = [];
          if (items.goodsQty != undefined && items.goodsQty !="") {
            arr2.push(items.goodsQty)
          }
          items.batchoptiondataes.forEach((val, n)=> {
            if(items['attributeValueId' + n] !='' || items['attributeValue' + n] !=''){
              items.batchAttrListJsonStr.push({
                goodsId: items.goodsId,
                batchNo:  items.batchNo,
                attributeId: val.attributeId,
                attributeValueId: items['attributeValueId' + n],
                attributeValue: items['attributeValue' + n]
              })
            }
          })
        })

        if (this.tableData.length != arr2.length) {
          this.isClasses = true;
          this.$message({
            message: '有商品的入库数量为空，请输入商品的入库数量！',
            type: 'warning'
          });
        } else if (issure == 1) {
          this.$message({
            message: '入库数量必须大于0',
            type: 'warning'
          });


        } else if (this.tableData.length == 0) {
          this.$message({
            message: '请添加商品',
            type: 'warning'
          });
        } else if (this.tableData.length > 0) { // 如果商品添加至少一条时
          this.tableData.forEach((item, index) => {
            if (item.batchEnabledFlag == true && item.suitFlag == false && (item.produceTimeshow == '' || item.produceTimeshow == null)) { // 符合生产日期必填的情况
              this.isClass = index;
              this.isMather = 'produceTimeshow'; // 标识是生产日期
              exit = true;
              this.$message({
                message: '有商品的生产日期为空，请选择生产日期！',
                type: 'warning'
              })
            }
            if (item.batchEnabledFlag == true && item.suitFlag == false && item.batchNo == '') {
              exit = true;
              this.isClass = index;
              this.isMather = 'batchNo';  // 标识是批次号
              this.$message({
                message: '有商品的批次号为空，请选择批次号！',
                type: 'warning'
              })
            }
          })
          if (exit) {
            return false;
          };
          let data={
           "stockInType": this.stockInType,//入库单类型
           "storageId": this.storageId,//仓库id
         };
          let addDataW = {
            "stockInType": this.stockInType,//入库单类型
            "storageId": this.storageId,//仓库id
            "supplierId": this.supplierIds,//供货商Id
            "batchFlag": this.batchEnable,   //是否开启行业化插件
            "remark": this.remark,//出库备注
            "wmsStockInItemEditBeanListJsonStr": JSON.stringify(this.tableData),//表格
          }
          this.isDisable = true
          this._post('com.edb01.erp.wms.service.api.WmInWorkflowSetupService/' + this.version + '/selectSetup', data)
            .then(function (res) {
              if (res.data.success) {
                if(res.data.result.affirmInFlag){
                  this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/insertStockIn', addDataW)
                    .then(function (res) {
                      if (res.data.success) {
                        this.$message({
                          type: 'success',
                          message:'创建成功！',
                        })
                        this.isDisable = false;
                        this.$router.push('/inStock')
                      } else {
                        this.isDisable = false;
                        this.$message({
                          message: res.data.msg,
                          type: 'warning'
                        });
                      }
                    }.bind(this))

                }else {
                  if(!res.data.result.qcFlag){
                    const loading = this.$loading({
                      lock: true,
                      text: '正在寻找商品的上架库位，请稍后...',
                      spinner: 'el-icon-loading',
                      background: 'rgba(0, 0, 0, 0.7)'
                    });

                    this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/insertStockIn', addDataW)
                      .then(function (res) {
                        if (res.data.success) {
                          this.$message({
                            type: 'success',
                            message:res.data.result,
                          })
                          loading.close();
                          this.isDisable = false;
                          this.$router.push('/inStock')
                        } else {
                          this.$message({
                            message: res.data.msg,
                            type: 'warning'
                          });
                          this.isDisable = false;
                        }
                      }.bind(this))
                  }else {

                    this._post('com.edb01.erp.wms.service.api.WmStockInService/' + this.version + '/insertStockIn', addDataW)
                      .then(function (res) {
                        if (res.data.success) {
                          this.$message({
                            type: 'success',
                            message: '创建成功！',
                          })
                          this.isDisable = false;
                          this.$router.push('/inStock')
                        } else {
                          this.$message({
                            message: res.data.msg,
                            type: 'warning'
                          });
                          this.isDisable = false;
                        }
                      }.bind(this))

                  }


                }

              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
                this.isDisable = false;
              }
            }.bind(this))

        }

      },

      //初始化仓库下拉列表
      initStock: function () {
//        findGrantStorageByUser
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth').then(function (res) {
          res.data.result.forEach(function (val) {
            this.optionsStock.push({value: val.storageId, label: val.storageName})
          }.bind(this));
        }.bind(this));
      },

      //供应商
      supplierSum: function () {
        this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/getSupplierList').then(function (res) {
          if (res.data.success) {
            this.supplier = res.data.result;
          }
        }.bind(this));
      },

      //初始化批次属性选项
      initBatchopt() {
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/selectGoodsAttributeBatch').then(function (res) {
          res.data.result.forEach(function (val) {
            val.attributeValue = ''
          });
          this.batchoption = res.data.result
        }.bind(this));
      },

      //勾选条数
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      //      以下是分页
      getPageSize: function (val) {
        if (val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.addButton();
        }
      },

      getCurPage: function (val) {
        if (val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.addButton();

        }
      },

    }
  }
</script>
<style scoped>

  #Addinstorage {
    padding: 20px;
  }
  #Addinstorage #isChangs .initP-g{
    margin: 0!important;
  }
  .pTop {
    margin-bottom: 20px;
  }

  .el-button {
    display: inline-block;
    line-height: 0
  }

  .xin {
    color: red;
  }
</style>
<style>
  #Addinstorage .box input.el-input__inner {
    border: 1px solid red !important;
  }

  #Addinstorage .el-table td, .el-table th {
    padding: 0 !important;
  }


  #Addinstorage .el-table th > .cell {
    text-align: center;
    padding: 3px 0;
    background-color: #eee;
    height: 29px;
  }

  #Addinstorage .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #eee !important;
  }

  #Addinstorage .pTop .el-input, .pTop .el-input__inner {
    width: 195px !important;
    height: 28px !important;
    line-height: inherit !important;
  }

  #Addinstorage .btnStyle {
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px !important;
    height: 30px;
  }
  #special .el-dialog__body{
    padding: 10px!important;
  }

</style>



