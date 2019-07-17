<!--策略详情 尘音-->
<template>
  <div id="strategyDetail">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParent">同步库存策略</a></el-breadcrumb-item>
        <el-breadcrumb-item><a @click="showParentBlock">策略设置</a></el-breadcrumb-item>
        <el-breadcrumb-item>策略详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--搜索区-->
    <div class="pageSearch" style="margin-top: 20px">
      <label for="strategyName">策略名称：</label>
      <el-input disabled id="strategyName" maxlength="50" v-model="strategyName" style="width: 500px"></el-input>
      <div style="color: #FF943C;margin-top: 20px">注：若一个商品对应一个店铺中多个商品链接，则这些链接商品按照均摊数量同步库存</div>
    </div>
    <!--独占库存设置-->
    <div class="aloneStock" style="margin-top: 20px">
      <h5>独占库存设置</h5>
      <!--表格1 独占库存-->
      <div class="aloneTable" style="margin-top: 10px">
        <el-table :data="tableData1" border style="width: 950px">

          <el-table-column label="生效店铺" align="center">
            <template slot-scope="scope">
              <el-select disabled @change="stockChange1(scope.row,scope.$index)" id="shop" v-model="scope.row.storeId" filterable placeholder="全部">
                <el-option
                  v-for="(item,index) in optionsShop"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="现货独占">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input disabled v-model="scope.row.cashQty" type="number" class="inpNum-g">
                %
              </div>
            </template>
          </el-table-column>

          <el-table-column label="预售独占">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input disabled v-model="scope.row.presalesQty" type="number" class="inpNum-g">
                %
              </div>
            </template>
          </el-table-column>

          <el-table-column label="自动同步库存" align="center">
            <template slot-scope="scope">
              <el-switch disabled v-model="scope.row.autoSynInvFlag" @click.native="switchChange1(scope.row,scope.$index)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="最小下架数">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input disabled v-model="scope.row.minOutQty" type="number" class="inpNum-g">
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <!--共享库存设置-->
    <div class="aloneStock" style="margin-top: 20px">
      <h5>共享库存设置</h5>
      <!--表格2 共享库存-->
      <div class="commTable" style="margin-top: 10px">
        <el-table :data="tableData2" border style="width: 950px">

          <el-table-column label="生效店铺" align="center">
            <template slot-scope="scope">
              <el-select disabled @change="stockChange2(scope.row,scope.$index)" id="shop" v-model="scope.row.storeId" filterable placeholder="全部">
                <el-option
                  v-for="(item,index) in optionsShop"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="现货共享">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input disabled v-model="scope.row.cashShareQty" type="number" class="inpNum-g">
                %
              </div>
            </template>
          </el-table-column>

          <el-table-column label="预售共享">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input disabled v-model="scope.row.presalesShareQty" type="number" class="inpNum-g">
                %
              </div>
            </template>
          </el-table-column>

          <el-table-column label="自动同步库存" align="center">
            <template slot-scope="scope">
              <el-switch disabled v-model="scope.row.autoSynInvFlag" @click.native="switchChange2(scope.row)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="最小下架数">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input disabled v-model="scope.row.minOutQty" type="number" class="inpNum-g">
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <!--虚拟库存设置-->
    <div class="aloneStock" style="margin-top: 20px">
      <h5>虚拟库存设置</h5>
      <!--表格3 虚拟库存-->
      <div class="dummyTable" style="margin-top: 10px;margin-bottom:70px;position: relative">
        <el-tooltip class="item" effect="dark" content="每次同步库存时按照此虚拟库存数量同步" placement="top-start">
          <i style="position: absolute;top: 8px;left: 276px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-table :data="tableData3" border style="width: 950px">

          <el-table-column label="生效店铺" align="center" width="167">
            <template slot-scope="scope">
              <el-select disabled @change="stockChange3(scope.row,scope.$index)" id="shop" v-model="scope.row.storeId" filterable placeholder="全部">
                <el-option
                  v-for="(item,index) in optionsShop"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="虚拟库存" width="163">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input disabled v-model="scope.row.virtualInvQty" type="number" class="inpNum-g">
              </div>
            </template>
          </el-table-column>

          <el-table-column label="自动同步库存" align="center">
            <template slot-scope="scope">
              <el-switch disabled v-model="scope.row.autoSynInvFlag" @click.native="switchChange3(scope.row)"></el-switch>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <!--footer-->
      <div class="wmsFoot">
        <el-button @click="backClick" size="mini">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      params: Object //接收父级参数
    },
    data() {
      return {
        version: '1.0.0',
        strategyName: '',//策略名称

        optionsShop: [{value: '',label: '全部',synInvFlag: ''}],//店铺下拉


        tableData1: [],//独占库存表格数据
        tableData2: [],//共享库存表格数据
        tableData3: [],//虚拟库存表格数据
      }
    },
    mounted() {
      this.initEchoWm();//初始化页面数据
      this.initList();//初始化店铺下拉数据
    },
    methods: {

      //返回主页
      showParent() {
        this.$emit('backFarther',true)
      },

      //返回父级
      showParentBlock() {
        this.$emit('changeShow',true)
      },

      //店铺接口
      initList: function () {
        this.optionsShop = [{value: '',label: '全部'}];
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/list').then(function (res) {
          console.log(res.data.result);
          if(res.data.success) {
            let arr = res.data.result;
            arr.forEach(function (val) {
              this.optionsShop.push({value: val.storeId,label: val.storeName,synInvFlag: val.synInvFlag})

            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //初始化数据接口
      initEchoWm: function () {
//        let id = this.$route.params.id;
        let data = {synInvStrategyId: this.params.synInvStrategyId};
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/echoWmSyncStrategy',data).then(function (res) {
          console.log(res.data.result);
          if(res.data.success) {
            this.strategyName = res.data.result.strategyName;
            this.tableData1 = res.data.result.wmCashQtyBeanList;
            this.tableData2 = res.data.result.wmShareInvBeanList;
            this.tableData3 = res.data.result.wmVirtualInvBinList;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //修改接口
      initAddWm: function () {
        this.tableData1.forEach(function (val) {
          val.setupType = 1
        });
        this.tableData2.forEach(function (val) {
          val.setupType = 2
        });
        this.tableData3.forEach(function (val) {
          val.setupType = 3
        });
//        let id = this.$route.params.id;
        let data = {
          synInvStrategyId: this.params.synInvStrategyId,
          strategyName: this.strategyName,
          cashQtyJson: JSON.stringify(this.tableData1),
          presalesJson: JSON.stringify(this.tableData2),
          virTurlInvQtyJson: JSON.stringify(this.tableData3)
        };
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/updateWmSyncStrategy',data).then(function (res) {
          if(res.data.success) {
//            this.$router.push('/waveSetup')
            this.$emit('changeShow',{isRefresh:true})
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //独占同步库存
      stockChange1: function (row,index) {
        let choosenItem = this.optionsShop.filter(item => item.value === row.storeId)[0];
        let obj = this.tableData1[index];
        obj.autoSynInvFlag = choosenItem.synInvFlag;
        this.$set(this.tableData1,index,obj);
        console.log(222,this.tableData1)

      },

      //启用状态
      switchChange1: function (row) {
        console.log(row)
      },

      //共享同步库存
      stockChange2:function (row,index) {
        let choosenItem = this.optionsShop.filter(item => item.value === row.storeId)[0];
        let obj = this.tableData2[index];
        obj.autoSynInvFlag = choosenItem.synInvFlag;
        this.$set(this.tableData2,index,obj);

      },

      //虚拟同步库存
      stockChange3:function (row,index) {
        let choosenItem = this.optionsShop.filter(item => item.value === row.storeId)[0];
        let obj = this.tableData3[index];
        obj.autoSynInvFlag = choosenItem.synInvFlag;
        this.$set(this.tableData3,index,obj);

      },

      //独占删除
      handleDeleteClick1: function (index) {
        this.tableData1.splice(index,1)
      },

      //共享删除
      handleDeleteClick2: function (index) {
        this.tableData2.splice(index,1)
      },

      //虚拟删除
      handleDeleteClick3: function (index) {
        this.tableData3.splice(index,1)
      },

      //添加独占库存设置
      addStockSetup1: function () {
        this.tableData1.push({})
      },

      //添加共享库存设置
      addStockSetup2: function () {
        this.tableData2.push({})
      },

      //添加虚拟库存设置
      addStockSetup3: function () {
        this.tableData3.push({})
      },

      //返回按钮
      backClick: function () {
//        this.$router.push('/waveSetup')
        this.$emit('changeShow',true)
      },

      //保存按钮
      holdClick: function () {
        this.initAddWm()
      },
    }
  }
</script>
