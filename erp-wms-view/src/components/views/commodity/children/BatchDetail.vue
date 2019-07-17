<!--查看库存详情 尘音-->
<template>
  <div id="batchDetail">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">批次查询</a></el-breadcrumb-item>
        <el-breadcrumb-item>批次库存详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="pCenter">
      <div style="display: inline-block;margin-right: 50px">
        <label>商品名称：</label>
        <span>{{goodsName}}</span>
      </div>
      <div style="display: inline-block;margin-right: 50px">
        <label>规格：</label>
        <span>{{specification}}</span>
      </div>
      <div style="display: inline-block;margin-right: 50px">
        <label>批次号：</label>
        <span>{{batchNo}}</span>
      </div>
    </div>
    <div class="pBottom">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="库存详情" name="first">
          <!--搜索区-->
          <div id="searchBox">
            <div class="leftBox2">
              <el-row>
                <el-col :span="6">
                  <div class="grid-content">
                    <label for="searchStock">仓库：</label>
                    <el-select @change="stockChange" id="searchStock" v-model="storageId1" filterable placeholder="全部">
                      <el-option
                        v-for="item in optionsStock"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content">
                    <label for="stockArea">库区名称：</label>
                    <el-select @change="search1" id="stockArea" v-model="storageSectionId" filterable placeholder="全部">
                      <el-option
                        v-for="item in optionsStockArea"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content">
                    <label for="stockType">库位类型：</label>
                    <el-select @change="search1" id="stockType" v-model="binType" filterable placeholder="全部">
                      <el-option
                        v-for="item in optionsStockType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </el-col>

              </el-row>
            </div>
            <div class="rightBox2">
              <el-input
                @keyup.enter.native="search1"
                placeholder="库位名称"
                v-model="storageBinName">
                <i @click="search1" style="cursor: pointer" slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
          </div>
          <!--表格-->
          <div class="pDown">
            <el-table id="tableH" :data="tableData1" border :max-height="table_h" style="width: 100%">
              <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

              <el-table-column label="仓库">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.storageName }}</p>
                </template>
              </el-table-column>

              <el-table-column label="库区名称">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.sectionName }}</p>
                </template>
              </el-table-column>

              <el-table-column label="库位名称">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.storageBinName }}</p>
                </template>
              </el-table-column>

              <el-table-column label="库位类型">
                <template slot-scope="scope">
                  <p class="cen-g" v-if="scope.row.binType == 1">正品</p>
                  <p class="cen-g" v-if="scope.row.binType == 2">次品</p>
                </template>
              </el-table-column>

              <el-table-column label="可配货库存">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.dstInv }}</p>
                </template>
              </el-table-column>

              <el-table-column label="可配货预占">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.dstCamponInv }}</p>
                </template>
              </el-table-column>

            </el-table>
            <!--分页-->
            <div class="pagination">
              <pagination
                :totalCom="total1"
                :pageSizeCom="pageSize1"
                :curPageCom="curPage1"
                @pageSizeVal="getPageSize1" @curPageVal="getCurPage1">
              </pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="入库记录" name="second">
          <!--搜索区-->
          <div id="searchBox1">
            <div class="leftBox2">
              <el-row>
                <el-col :span="6">
                  <div class="grid-content">
                    <label for="searchStock">仓库：</label>
                    <el-select @change="search2" id="searchStock" v-model="storageId2" filterable placeholder="全部">
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
            </div>
            <div class="rightBox2">
              <el-input
                @keyup.enter.native="search2"
                placeholder="入库单号"
                v-model="stockInNo">
                <i @click="search2" style="cursor: pointer" slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
          </div>
          <!--表格-->
          <div class="pDown">
            <el-table id="tableH" :data="tableData2" border :max-height="table_h" style="width: 100%">
              <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

              <el-table-column label="入库单号">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.stockInNo }}</p>
                </template>
              </el-table-column>

              <el-table-column label="仓库">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.storageName }}</p>
                </template>
              </el-table-column>

              <el-table-column label="入库类型">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.stockInTypeName }}</p>
                </template>
              </el-table-column>

              <el-table-column label="入库时间">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.confirmeTime | normalTime(6) }}</p>
                </template>
              </el-table-column>

              <el-table-column label="商品属性">
                <template slot-scope="scope">
                  <p class="cen-g" v-if="scope.row.goodsAttrType == 1">正品</p>
                  <p class="cen-g" v-if="scope.row.goodsAttrType == 2">次品</p>
                  <p class="cen-g" v-if="scope.row.goodsAttrType == 3">未知</p>
                </template>
              </el-table-column>

              <el-table-column label="入库数量">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.actualInQty }}</p>
                </template>
              </el-table-column>

            </el-table>
            <!--分页-->
            <div class="pagination">
              <pagination
                :totalCom="total2"
                :pageSizeCom="pageSize2"
                :curPageCom="curPage2"
                @pageSizeVal="getPageSize2" @curPageVal="getCurPage2">
              </pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  export default {
    props: {
      params: Object //接收父级参数
    },
    components:{
      pagination
    },
    data() {
      return {
        version: '1.0.0',//版本号
        activeName: 'first',//tab切换

        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId1: '',//仓库(库存详情)
        storageId2: '',//仓库(入库记录)
        stockInNo: '',//入库单号

        optionsStockArea:[{value: '',label: '全部'}],//库区下拉
        storageSectionId:'',//库区

        optionsStockType: [//库位类型下拉
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '正品'
          },
          {
            value: '2',
            label: '次品'
          }
        ],
        binType: '',//库位类型

        storageBinName:'',//库位名称

        table_h: 0,//表格高度
        tableData1: [],//表格数据(库存详情)
        total1: 0, //总页数
        pageSize1: 15, //每页数量
        curPage1: 1,//当前页数

        tableData2: [],//表格数据(入库记录)
        total2: 0, //总页数
        pageSize2: 15, //每页数量
        curPage2: 1,//当前页数

        goodsName: this.params.id.goodsName,//商品名称
        specification: this.params.id.specification,//规格
        batchNo: this.params.id.batchNo,//批次号
      }
    },
    mounted() {

      //初始化库位每页数量
      if(sessionStorage.getItem("hold_batchDetail_1") != null) {
        this.pageSize1 = parseInt(sessionStorage.getItem("hold_batchDetail_1"));
      }

      //初始化入库每页数量
      if(sessionStorage.getItem("hold_batchDetail_2") != null) {
        this.pageSize2 = parseInt(sessionStorage.getItem("hold_batchDetail_2"));
      }

      this.initStock();//初始化仓库下拉
      this.initMessage1();//初始化页面数据(库存详情)

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods: {

      //返回父级
      showParentBlock() {
        this.$emit('changeShow')
      },

      //初始化仓库下拉
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
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

      //初始化库区下拉
      initSeat: function () {
        let data = {
          storageId: this.storageId1
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/findByStorageId',data).then(function (res) {
          if(res.data.success) {
            let arr = res.data.result;
            console.log(arr);
            this.optionsStockArea = [{value:'',label:'全部'}];
            arr.forEach(function (val) {
              this.optionsStockArea.push({value: val.storageSectionId,label: val.sectionName})
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this));
      },

      //初始化页面数据(库存详情)
      initMessage1: function () {
        let data = {
          storageId: this.storageId1,
          storageSectionId: this.storageSectionId,
          binType: this.binType,
          storageBinName: this.storageBinName,
          goodsId: this.params.id.goodsId,
          batchNo: this.params.id.batchNo,
          page: this.curPage1,
          size: this.pageSize1
        };
        this._post('com.edb01.erp.wms.service.api.StorageBinGoodsService/' + this.version + '/getBinInv',data).then(function (res) {
          if(res.data.success) {
            this.tableData1 = res.data.result.rows;
            this.total1 = res.data.result.total;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this));
      },

      //初始化页面数据(入库记录)
      initMessage2: function () {
        let data = {
          goodsId: this.params.id.goodsId,
          batchNo: this.params.id.batchNo,
          storageId: this.storageId2,
          stockInNo: this.stockInNo,
          page: this.curPage2,
          size: this.pageSize2
        };
        this._post('com.edb01.erp.wms.service.api.StorageBinGoodsService/' + this.version + '/getStockInBean',data).then(function (res) {
          if(res.data.success) {
            this.tableData2 = res.data.result.rows;
            this.total2 = res.data.result.total;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this));
      },

      //根据仓库id获取库区
      stockChange:function () {
        if(this.storageId1 != '') {
          this.initSeat()
        }else {
          this.storageSectionId = '';
          this.optionsStockArea = [{value: '',label: '全部'}]
        }
        this.initMessage1()
      },

      //查询(库存详情)
      search1: function () {
        this.initMessage1()
      },

      //查询(入库记录)
      search2: function () {
        this.initMessage2()
      },

      //库存详情分页
      getPageSize1: function (val) {
        if(val != undefined) {

          //库位变换每页数量刷新数据
          this.pageSize1 = val;
          this.initMessage1();

          //存储库位每页数量
          sessionStorage.setItem('hold_batchDetail_1', val);
        }
      },
      getCurPage1: function (val) {
        if(val != undefined) {

          //变换库位当前页刷新数据
          this.curPage1 = val;
          this.initMessage1()
        }
      },

      //入库分页
      getPageSize2: function (val) {
        if(val != undefined) {

          //入库变换每页数量刷新数据
          this.pageSize2 = val;
          this.initMessage2();

          //存储入库每页数量
          sessionStorage.setItem('hold_batchDetail_2', val);
        }
      },
      getCurPage2: function (val) {
        if(val != undefined) {

          //变换入库当前页刷新数据
          this.curPage2 = val;
          this.initMessage2()
        }
      },

      //tab切换
      handleClick: function () {
        if(this.activeName == 'first') {
          this.initMessage1();
        }else if(this.activeName == 'second') {
          this.initMessage2();
        }
      },
    }
  }
</script>
<style scoped>
  .pCenter{
    margin-top: 20px;
  }
  .pCenter label{
    font-weight: bolder;
  }
  .pBottom{
    margin-top: 20px;
  }
</style>
<style>
  #batchDetail .el-tabs__item {
    padding: 0 60px!important;
    border-bottom: 1px solid #e4e7ed!important;
  }
  #batchDetail .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #e4e7ed!important;
    color: black!important;
    background: #F2F2F2;
  }
  #batchDetail .el-tabs--card>.el-tabs__header {
     border-bottom: none;
  }
  #batchDetail .el-tabs__header {
    margin: 0 0 35px!important;
  }
</style>
