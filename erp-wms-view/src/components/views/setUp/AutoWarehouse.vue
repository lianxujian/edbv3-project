<!--智能仓库 贾南风-->
<template>
  <div id="autoWarehouse">
    <div id="fitTable" :style="{ height: activeHeight+ 'px'}" style="overflow-y: scroll;">
    <div style="min-width:1100px;height: 100%" v-if="showAdd == 1">
      <div>
        <div style="width: 100%;background: #EEEEEE;height: 40px;padding: 15px;font-weight: bold">
          排单设置
        </div>
        <div class="box">已审核通过的订单按照设置的排单规则分配仓库</div>
        <div class="box box1">
          <span>排单以</span>
          <el-select  type="medium" v-model="saveSetup.arrangeOrderCondition" placeholder="请选择" style="width: 201px!important;">
            <el-option
              v-for="item in state"
              :key="item.value"
              :label="item.value"
              :value="item.label">
            </el-option>
          </el-select>
          <span>为准,按</span>
          <el-select  placeholder="请选择" v-model="saveSetup.arrangeOrderPri" style="width: 201px!important;">
            <el-option
              v-for="item in state1"
              :key="item.value"
              :label="item.value"
              :value="item.label">
            </el-option>
          </el-select>
          <span>排序。</span>
        </div>
        <div class="box">
          <span>不参与排单的订单类型：</span>
          <el-badge value="X" class="item" style="margin:0 20px 15px 0;cursor: pointer" v-for="(item,index) in saveSetup.wmUnscheduledOrdertypeName" :key="index" @click.native="clickDel(index,1)">
            <el-button style="width:auto!important;" size="small">{{item.orderTypeName}}</el-button>
          </el-badge>
          <span class="span" v-if="authorityCode.WMS_AUTOWAREHOUSE_ORDER" style="color: #409EFF;white-space: nowrap" @click="setOrder(saveSetup.wmUnscheduledOrdertypeName, 1)">设置订单类型</span>
        </div>
        <div class="box">
          <span>不参与排单的标记类型：</span>
          <el-badge value="X" class="item" style="margin:0 20px 15px 0;cursor: pointer" v-for="(item,index) in saveSetup.wmUmscheduledSignName" :key="index" @click.native="clickDel(index,2)">
            <el-button style="width:auto!important;" size="small">{{item.signName}}</el-button>
          </el-badge>
          <span class="span" v-if="authorityCode.WMS_AUTOWAREHOUSE_SIGN" style="color: #409EFF;white-space: nowrap" @click="setOrder(saveSetup.wmUmscheduledSignName, 2)">设置标记类型</span>
        </div>
      </div>
      <div >
        <div style="width: 100%;background: #EEEEEE;height: 40px;padding: 15px;font-weight: bold;">
          分配仓库
        </div>
        <div class="box">
          <!--<div>开启分配仓库，已审核的订单将会根据排单规则分配仓库；</div>-->
          <div>开启智能仓库，选择仓库分配方式，系统将自动根据仓库分配方式为订单智能分配仓库。</div>
        </div>
        <div class="box">
          <el-switch v-if="authorityCode.WMS_AUTOWAREHOUSE_START" v-model="enabledFlag" :active-value="true" :inactive-value="false"></el-switch>
          <el-switch v-else v-model="enabledFlag" disabled></el-switch>
          <span v-if="enabledFlag == true" style="margin-left: 10px;">开启智能仓库</span>
          <span v-if="enabledFlag == false" style="margin-left: 10px;">关闭智能仓库</span>
          <span class="span" style="color: #409EFF" @click="showP()" v-if="authorityCode.WMS_AUTOWAREHOUSE_STORESETUP">属地仓设置</span>
          <span class="span" style="color: #409EFF" @click="showSp()" v-if="authorityCode.WMS_AUTOWAREHOUSE_PRODUCTSETUP">商品指定仓设置</span>
        </div>
        <div class="box" style="background: #F8F8F8;padding: 30px;width: 1000px;margin-left: 20px;" v-if="enabledFlag == true">
          <el-row>
            <el-col :span="6">
              <div class="grid-content bg-purple" style="text-align: right"><span>请选择仓库分配方式</span></div>
            </el-col>
            <el-col :span="18">
              <div class="grid-content bg-purple-light" style="margin-left: 20px;">
                <el-radio-group v-model="saveSetup.allotWay" @change="checkboxChange()">
                  <div class="box-radio">
                    <el-radio class="radio-s" :label="1">按属地分配 <el-tooltip placement="top">
                      <div slot="content" style="color: #fff">根据属地仓的优先级分配，将订单分配到属地优先级最高的仓库，勾选排除缺货仓，<br/>订单会优先分配到属地优先级最高且不缺货的仓库</div>
                      <i class="el-icon-question" style="margin-left:5px;font-size:16px;color:#ccc;cursor: pointer"></i>
                    </el-tooltip></el-radio>
                    <div style="display: inline-block">
                      <span   v-show="saveSetup.allotWay == 1">
                        <el-checkbox  v-model="saveSetup.excludeStockoutFlag">排除缺货仓</el-checkbox>
                      </span>
                    </div>
                  </div>
                  <div class="box-radio">
                    <el-radio class="radio-s" :label="2">按商品指定仓分配 <el-tooltip placement="top">
                      <div slot="content" style="color: #fff">根据商品指定仓的优先级分配，优先分配订单到商品指定仓优先级最高的仓库；勾选排除缺货仓，<br/>优先分配到不缺货仓库；勾选多仓智能拆单时，若已勾选排除缺货仓，则根据商品在仓库的缺货<br/>情况拆分订单，若未勾选排除缺货仓，则根据商品指定仓拆单</div>
                      <i class="el-icon-question" style="margin-left:5px;font-size:16px;color:#ccc;cursor: pointer"></i>
                    </el-tooltip></el-radio>
                    <div style="display: inline-block">
                      <span   v-show="saveSetup.allotWay == 2">
                        <el-checkbox  v-model="saveSetup.excludeStockoutFlag" @change="oneMuch">排除缺货仓</el-checkbox>
                        <el-checkbox v-model="saveSetup.multiStorageSplitFlag" @change="oneMuch">多仓智能拆单</el-checkbox>
                        <el-checkbox :disabled="isDisabled" v-model="saveSetup.suitStorageSplitFlag">套装单品多仓拆单</el-checkbox>
                      </span>
                    </div>
                  </div>
                  <div class="box-radio">
                    <el-radio class="radio-s" :label="3">按属地仓和商品指定仓分配 <el-tooltip  placement="top">
                      <div slot="content" style="color: #fff">根据属地仓和商品指定仓分配时，优先分配订单到属地优先级最高的商品指定仓；勾选排除缺货仓，<br/>优先分配到不缺货的仓库；勾选多仓智能拆单时，若已勾选排除缺货仓，则根据商品在仓库的缺货<br/>情况拆分订单，若未勾选排除缺货仓，则根据商品指定仓拆单</div>
                      <i class="el-icon-question" style="margin-left:5px;font-size:16px;color:#ccc;cursor: pointer"></i>
                    </el-tooltip></el-radio>
                    <div style="display: inline-block">
                      <span   v-show="saveSetup.allotWay == 3">
                        <el-checkbox  v-model="saveSetup.excludeStockoutFlag" @change="oneMuch">排除缺货仓</el-checkbox>
                        <el-checkbox v-model="saveSetup.multiStorageSplitFlag" @change="oneMuch">多仓智能拆单</el-checkbox>
                        <el-checkbox :disabled="isDisabled" v-model="saveSetup.suitStorageSplitFlag">套装单品多仓拆单</el-checkbox>
                      </span>
                    </div>
                  </div>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
          <div class="box2">
            <span>不参与店铺设置：</span>
            <el-badge value="X" class="item" style="margin:0 20px 15px 0;cursor: pointer" v-for="(item,index) in saveSetup.wmDropoutStoreName" :key="index" @click.native="clickDel(index,3)">
              <el-button size="small" style="width:auto!important;">{{item.storeName}}</el-button>
            </el-badge>
            <span class="span" style="color: #409EFF;white-space: nowrap"  v-if="authorityCode.WMS_AUTOWAREHOUSE_START" @click="setOrder(saveSetup.wmDropoutStoreName, 3)">设置店铺</span>
          </div>
          <div class="box2">
            <span>不参与仓库设置：</span>
            <el-badge value="X" class="item" style="margin:0 20px 15px 0;cursor: pointer" v-for="(item,index) in saveSetup.wmDropoutStorageName" :key="index" @click.native="clickDel(index,4)">
              <el-button style="width:auto!important;" size="small">{{item.storageName}}</el-button>
            </el-badge>
            <span class="span" v-if="authorityCode.WMS_AUTOWAREHOUSE_START" style="color: #409EFF;white-space: nowrap" @click="setOrder(saveSetup.wmDropoutStorageName, 4)">设置仓库</span>
          </div>
        </div>
      </div>
    </div>
      <div class="wmsFoot">
        <el-button type="primary" @click="saveData()" v-if="authorityCode.WMS_AUTOWAREHOUSE_SAVE">保 存</el-button>
      </div>
    </div>
    <!--设置订单类型-->
    <div>
      <el-dialog v-dialogDrag title="请选择订单类型" :close-on-click-modal="false" :visible.sync="dialogOrder" width="400px">
        <el-table  :data="gridData2"
                   tooltip-effect="dark"
                  @selection-change="handleSelectionChange1"
                  ref="multipleTable"
                  :height="260"
                  style="margin-top: -26px;"
                  border>
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="orderTypeName"
            label="订单类型">
          </el-table-column>
        </el-table>
        <div class="box3">
          <el-button type="primary" @click="sureData(1)">确 定</el-button>
          <el-button  plain @click="dialogOrder=false">取 消</el-button>
        </div>
        <!--<div class="box3"><el-button type="primary" @click="sureData(1)" style="margin-bottom: -30px;">确 定</el-button></div>-->
      </el-dialog>
    </div>
    <!--设置标记类型-->
    <div>
      <el-dialog v-dialogDrag title="请选择标记类型" :close-on-click-modal="false" :visible.sync="dialogTag" width="400px">
        <el-table tooltip-effect="dark" :data="gridData3" @selection-change="handleSelectionChange2"
                  ref="multipleTable2" :height="260"   style="margin-top: -26px;" border>
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="signName"
            label="标记类型">
          </el-table-column>
        </el-table>
        <div class="box3">
          <el-button type="primary" @click="sureData(2)">确 定</el-button>
          <el-button  plain @click="dialogTag=false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!--设置店铺-->
    <div>
      <el-dialog v-dialogDrag title="设置店铺" :visible.sync="dialogTableVisible" :close-on-click-modal="false" width="400px">
        <el-input v-model="storeName" @keyup.enter.native="shopQuery()"
                  placeholder="请输入店铺名称" style="width: 300px;margin: -26px 0 20px 0">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-table tooltip-effect="dark"
                  :data="gridData" ref="multipleTable3" @selection-change="handleSelectionChange3" :height="300" border>
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="storeName"
            label="店铺名称">
          </el-table-column>
        </el-table>
        <div  class="box3">
          <el-button type="primary" @click="sureData(3)">确 定</el-button>
          <el-button  plain @click="dialogTableVisible=false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!--设置仓库-->
    <div>
      <el-dialog v-dialogDrag title="设置仓库" :visible.sync="dialogStore" :close-on-click-modal="false" width="400px">
        <el-input v-model="storageName" @keyup.enter.native="query1()"
                  placeholder="请输入仓库名称" style="width: 300px;margin: -40px 0 20px 0">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-table tooltip-effect="dark" :data="gridData1" ref="multipleTable4" @selection-change="handleSelectionChange4" :height="300" border>
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="storageName"
            label="仓库名称">
          </el-table-column>
        </el-table>
        <div class="box3">
          <el-button type="primary" @click="sureData(4)">确 定</el-button>
          <el-button  plain @click="dialogStore=false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <!--成功的通知弹框-->
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :close-on-click-modal="false"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <div style="width: 100%;text-align: center"><i style="font-size: 30px;color: #65F007;margin-top: -10px" class="el-icon-success"></i> </div>
        <div  style="font-size: 18px;margin: 5px 0 -10px 0;width: 100%;text-align: center">保存成功！</div>
        <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="centerDialogVisible=false">知道了</el-button>
       </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data() {
      return {
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        //a: [],
        activeHeight: 0, // 高度
        isDisabled: true, // 套装单品多仓拆单
        query: () => {},// 查询店铺
        query1: () => {},// 查询仓库
        query2: () => {}, //智能仓库回显
        query3: () => {}, //设置标记类型
        storeName: '', // 店铺参数
        storageName: '', // 仓库参数
        queryBefore: '', //店铺模糊查询之前的值
        areaId: '', //组件参数
        version: '1.0.0', // 版本号
        dialogTableVisible: false, // 店铺
        dialogStore: false, // 仓库
        dialogOrder: false, // 订单类型
        dialogTag: false, // 标记类型
        centerDialogVisible: false,
        gridData: [], // 店铺名称
        gridData1: [], // 仓库
        dog:1, // 看门狗
        // 标记
        order1: [],
        tag1: [],
        store1: [],
        shop1: [],
        gridData2: [
          { orderTypeId: 1, orderTypeName: '预售订单' },
          { orderTypeId: 2, orderTypeName: '换货订单' },
          { orderTypeId: 3, orderTypeName: '补发订单' },
          { orderTypeId: 4, orderTypeName: '安装服务订单'},
          { orderTypeId: 5, orderTypeName: '定金订单' },
        ], // 订单类型
        gridData3: [], // 标记类型
        state: [ // 排单规则
          { label: 1, value: '下单时间' },
          { label: 2, value: '付款时间' },
          { label: 3, value: '订单金额' },
          { label: 4, value: '审核时间' }
        ],
        state1: [ //排单规则
          { label: 1, value: '降序' },
          { label: 2, value: '升序' }
        ],
        saveSetup: {},//回显数据接收
        showAdd: 1, // 显示的组件
        enabledFlag: false, // 分配方式显示
      }
    },
    methods: {
      // 套装单品拆分
      oneMuch() {
        if(this.saveSetup.excludeStockoutFlag == true && this.saveSetup.multiStorageSplitFlag == true){
          this.isDisabled = false;
        }else{
          this.isDisabled = true;
          this.saveSetup.suitStorageSplitFlag = false;
        }
      },
      // 设置店铺鼠标按下
      shopQuery() {
        this.query();
        this.queryBefore = this.shop1;
        var trimer = setTimeout(() => {
          let arr = [];
          this.queryBefore.forEach(item => {
            this.gridData.forEach((item1,index) => {
              if(item.storeId == item1.storeId){
                arr.push(index);
              }
            })
          });

          arr.forEach(item => {
            this.$refs.multipleTable3.toggleRowSelection(this.gridData[item],true)
          })
        },100)
      },
      // 点击设置时的回显
      setOrder(rows, number) {
        let self = this;
        // 订单类型
        if (number == 1) {
          self.dialogOrder = true;
          self.gridData2 = [
            { orderTypeId: 1, orderTypeName: '预售订单' },
            { orderTypeId: 2, orderTypeName: '换货订单' },
            { orderTypeId: 3, orderTypeName: '补发订单' },
            { orderTypeId: 4, orderTypeName: '安装服务订单'},
            { orderTypeId: 5, orderTypeName: '定金订单' },
          ]; // 订单类型
          // this.saveSetup.wmUnscheduledOrdertypeName
          rows.forEach(item => {
            self.gridData2.forEach((item1,index) => {
              if(item.orderTypeId == item1.orderTypeId){
                self.gridData2.splice(index,1)
              }
            })
          })
        } else if (number == 2) { // 订单标记
          self.dialogTag = true;
          self.query3();
        } else if (number == 3) { //设置店铺
          self.storeName = '';
          self.dialogTableVisible = true;
          self.query();
        } else if (number == 4) {  // 设置仓库
          self.storageName = '';
          self.dialogStore = true;
          self.query1();
        }
      },
      // 仓库分配方式点击单选按钮后改变复选框的值
      checkboxChange() {
        this.saveSetup.excludeStockoutFlag = false;
        this.saveSetup.multiStorageSplitFlag = false;
        this.saveSetup.suitStorageSplitFlag = false;
        this.isDisabled = true;
      },
      // 智能仓库的保存
      saveData() {
        let self = this;
        self.saveSetup.enabledFlag = self.enabledFlag;

        if(self.saveSetup.enabledFlag == false) {
          self.saveSetup.allotWay = ''
          self.saveSetup.IntelligentWarehouseTypeValue = [];
          self.saveSetup.distributionStore = '';
          self.saveSetup.wmDropoutStorage = '';
          self.saveSetup.wmDropoutStore = '';
        } else {
          // 不参与店铺
          self.saveSetup.wmDropoutStore = '';
          for (var i = 0; i < self.saveSetup.wmDropoutStoreName.length; i++) {
            self.saveSetup.wmDropoutStore += self.saveSetup.wmDropoutStoreName[i].storeId + ','
          }
          self.saveSetup.wmDropoutStore = self.saveSetup.wmDropoutStore.slice(0, -1);
          self.saveSetup.wmDropoutStorage = '';
          // 不参与仓库
          for (var i = 0; i < self.saveSetup.wmDropoutStorageName.length; i++) {
            self.saveSetup.wmDropoutStorage += self.saveSetup.wmDropoutStorageName[i].storageId + ','
          }
          self.saveSetup.wmDropoutStorage = self.saveSetup.wmDropoutStorage.slice(0, -1);
        }
        self.saveSetup.wmUnscheduledOrdertype = '';
        // 不参与订单类型
        for (var i = 0; i < self.saveSetup.wmUnscheduledOrdertypeName.length; i++) {
          self.saveSetup.wmUnscheduledOrdertype += self.saveSetup.wmUnscheduledOrdertypeName[i].orderTypeId + ','
        }
        self.saveSetup.wmUnscheduledOrdertype = self.saveSetup.wmUnscheduledOrdertype.slice(0, -1);
        self.saveSetup.wmUmscheduledSign = '';
        // 不参与订单标记
        for (var i = 0; i < self.saveSetup.wmUmscheduledSignName.length; i++) {
          self.saveSetup.wmUmscheduledSign += self.saveSetup.wmUmscheduledSignName[i].signId + ','
        }
        self.saveSetup.wmUmscheduledSign = self.saveSetup.wmUmscheduledSign.slice(0, -1);


        delete self.saveSetup.wmDropoutStoreName;
        delete self.saveSetup.wmDropoutStorageName;
        delete self.saveSetup.wmUnscheduledOrdertypeName;
        delete self.saveSetup.wmUmscheduledSignName;
        console.log(self.saveSetup);
        // 保存请求
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/saveWmIntellectStorage',self.saveSetup)
          .then(function(res) {
            if (res.data.code == 0) {
              self.centerDialogVisible = true;
              self.query2()
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })

      },
      // 点击弹框确定按钮
      sureData(val) {
        if (val == 1) {
          this.order1.forEach(item => {
            this.saveSetup.wmUnscheduledOrdertypeName.push(item);
          });
          this.dialogOrder = false;
        } else if (val == 2) {
          this.tag1.forEach(item => {
            this.saveSetup.wmUmscheduledSignName.push(item);
          });
          this.dialogTag = false;
        } else if (val == 3) {
          this.shop1.forEach(item => {
            this.saveSetup.wmDropoutStoreName.push(item);
          });
          this.dialogTableVisible = false;
        } else if (val == 4) {
          this.store1.forEach(item => {
            this.saveSetup.wmDropoutStorageName.push(item);
          });
          this.dialogStore = false;
        }
      },
      // 点击删除标签的时候
      clickDel(index,val) {
        if (val == 1) {
          this.saveSetup.wmUnscheduledOrdertypeName.splice(index, 1)
        } else if (val == 2) {
          this.saveSetup.wmUmscheduledSignName.splice(index, 1)
        } else if (val == 3) {
          this.saveSetup.wmDropoutStoreName.splice(index, 1)
        } else if (val == 4) {
          this.saveSetup.wmDropoutStorageName.splice(index, 1)
        }
      },
      // 订单类型
      handleSelectionChange1(val) {
          this.order1 = val;
      },
      // 标记类型
      handleSelectionChange2(val) {
        this.tag1 = val;
      },
      // 选择设置店铺复选框
      handleSelectionChange3(val) {
        this.shop1 = val;
      },
      // 选择设置仓库复选框
      handleSelectionChange4(val) {
        this.store1 = val;
      },
      // 切换组件
      addS(val, row) {
        this.areaId = row;
        this.showAdd = val;
      },
      // 点击属地仓设置
      showP() {
        if(this.saveSetup.enabledFlag == undefined){
          this.saveSetup.enabledFlag = false;
        }
        console.log(this.saveSetup.enabledFlag);
        console.log(this.saveSetup.intellectStorageId);
        this.$router.push({name: 'storeSetup',params: {state: this.saveSetup.enabledFlag,intellectStorageId:this.saveSetup.intellectStorageId}})
      },
      // 点击商品仓设置
      showSp() {
        this.$router.push({name: 'productSetup',params: {state: this.enabledFlag}})
      }
    },
    created() {
      //  动态获取表格高度
      this.$nextTick(function () { //  nextTick当DOM发生变化时实时执行回调
        var a = document.body.clientHeight;//  页面高度
        var b = document.getElementById('fitTable').offsetTop;//  表格距离顶部的距离
        this.activeHeight = a - b - 80;//  表格高度
      });

      // 仓库
      this.query1 = () => {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/getWmInStorageList',{ storageName : self.storageName})
          .then(function(res) {
            if (res.data.code == 0) {
              // console.log(res.data.result,8888888888888);
              self.gridData1 = res.data.result;
              self.saveSetup.wmDropoutStorageName.forEach(item => {
                self.gridData1.forEach((item1,index) => {
                  if(item.storageId == item1.storageId){
                    self.gridData1.splice(index,1);
                  }
                })
              })
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
      this.query1();
      // 店铺
      this.query = () => {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/getWmInStoreList',{ storeName: self.storeName })
          .then(function(res) {
            if (res.data.code == 0) {
              self.gridData = res.data.result;
              self.saveSetup.wmDropoutStoreName.forEach(item => {
                self.gridData.forEach((item1,index) => {
                  if(item.storeId == item1.storeId){
                    self.gridData.splice(index,1)
                  }
                })
              })
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err);
          })
      };
      this.query();
      // 标记类型
      this.query3 = () => {
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.version + '/getAllCustomerSignAndSystemSignEqUpdateFail')
          .then((res) => {
            if (res.data.code == 0) {
              this.gridData3 = res.data.result;
              this.saveSetup.wmUmscheduledSignName.forEach(item => {
                this.gridData3.forEach((item1,index) => {
                  if(item.signId == item1.signId){
                    this.gridData3.splice(index,1)
                  }
                })
              })
            } else {
              this.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      };
      this.query2 = () => {
        let self = this;
        // 获取智能仓库配置
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/getWmIntellectStorage')
          .then(function(res) {
            if (res.data.success == true) {
              self.saveSetup = res.data.result;
              self.enabledFlag = self.saveSetup.enabledFlag;
              if(!self.saveSetup.arrangeOrderCondition){//排单规则
                self.saveSetup.arrangeOrderCondition = 2;
              }
              if(!self.saveSetup.arrangeOrderPri){ // 排序规则
                self.saveSetup.arrangeOrderPri = 2;
              }
              // saveSetup.arrangeOrderCondition
              self.query3();
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
      };
      this.query2();
    },
    mounted() {


    }
  }
</script>
<style scoped>
  #autoWarehousediv,span,label{
    color: #5c5c5c;
  }
  .save{
    position: fixed;
    bottom: 30px;
    right: 0;
    width: 100%;
    text-align: center;
  }
  .box {
    margin: 26px 0 20px 80px;
  }

  .box1 span {
    margin: 0 4px;
  }
  .box2{
    margin: 20px 0 20px 44px;
  }
  .box3{
    margin: 20px 0 -10px 0;
    width: 100%;
    text-align: center;
  }

  .span {
    text-decoration: underline;
    margin-left: 20px;
    cursor: pointer;
  }

  .box-radio {
    margin: 0 0 30px 10px;
  }
  .radio-s{
    margin-right: 20px;
  }
</style>
<style>
  .el-input--mini .el-input__inner {
    height: 36px;
  }

  .el-button + .el-button {
    margin-left: 5px;
  }
</style>

