<!--修改策略（单个商品） 尘音-->
<template>
  <div id="goodsEditStrategy">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">同步库存策略</a></el-breadcrumb-item>
        <el-breadcrumb-item>修改策略</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--搜索区-->
    <div class="pageSearch" style="margin-top: 20px">
      <label>商品名称：</label><span style="margin-right: 20px">{{ goodsName }}</span>
      <label>条形码：</label><span style="margin-right: 20px">{{ barCode }}</span>
      <label>预售库存：</label><input style="margin-right: 20px;width: 50px" v-model="goodsPresellInv" type="number" class="inpNum-g">
      <label>现货库存：</label><span style="margin-right: 20px">{{ goodsstock }}</span>
      <label>可售库存：</label><span>{{ googsSalesInv }}</span>
      <div style="color: #FF943C;margin-top: 20px">注：若一个商品对应一个店铺中多个商品链接，则这些链接商品按照均摊数量同步库存</div>
    </div>
    <!--独占库存设置-->
    <div class="aloneStock" style="margin-top: 20px">
      <h5>独占库存设置</h5>
      <!--添加1-->
      <el-button @click="addStockSetup1" type="info" style="width: 50px!important;height: 20px;padding: 0!important;">添加</el-button>
      <!--表格1 独占库存-->
      <div class="aloneTable" style="margin-top: 10px;position: relative">

        <el-tooltip class="item" effect="dark" content="现货商品默认独占比例" placement="top-start">
          <i style="position: absolute;top: 8px;left: 202px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="现货商品独占的库存数量" placement="top-start">
          <i style="position: absolute;top: 8px;left: 332px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="预售商品默认独占比例" placement="top-start">
          <i style="position: absolute;top: 8px;left: 437px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="预售商品独占的库存数量" placement="top-start">
          <i style="position: absolute;top: 8px;left: 566px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="当库存低于最小下架数，更新网店库存为0，当库存高于最小下架数，自动上架" placement="top-start">
          <i style="position: absolute;top: 8px;left: 794px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-table :data="tableData1" border style="width: 950px">

          <el-table-column label="生效店铺" align="center">
            <template slot-scope="scope">
              <el-select @change="stockChange1(scope.row,scope.$index)" id="shop" v-model="scope.row.storeId" filterable placeholder="全部">
                <el-option
                  v-for="(item,index) in optionsShop"
                  :disabled="item.disabled"
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
                <input @keyup="scope.row.cashQty = scope.row.cashQty.replace(/[^\d]/g,'')" @input="cashQtyChange(scope.row,scope.$index)" style="width: 50px" v-model="scope.row.cashQty" type="number" class="inpNum-g">
                %
              </div>
            </template>
          </el-table-column>

          <el-table-column label="现货独占数量">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input @keyup="scope.row.cashInvQty = scope.row.cashInvQty.replace(/[^\d]/g,'')" style="width: 70px" v-model="scope.row.cashInvQty" type="number" class="inpNum-g">
              </div>
            </template>
          </el-table-column>

          <el-table-column label="预售独占">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input @keyup="scope.row.presalesQty = scope.row.presalesQty.replace(/[^\d]/g,'')" @input="presalesQtyChange(scope.row,scope.$index)" style="width: 50px" v-model="scope.row.presalesQty" type="number" class="inpNum-g">
                %
              </div>
            </template>
          </el-table-column>

          <el-table-column label="预售独占数量">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input @keyup="scope.row.presalesInvQty = scope.row.presalesInvQty.replace(/[^\d]/g,'')" style="width: 70px" v-model="scope.row.presalesInvQty" type="number" class="inpNum-g">
              </div>
            </template>
          </el-table-column>

          <el-table-column label="自动同步库存" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.autoSynInvFlag" @click.native="switchChange1(scope.row,scope.$index)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="最小下架数">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input @keyup="scope.row.minOutQty = scope.row.minOutQty.replace(/[^\d]/g,'')" style="width: 70px" v-model="scope.row.minOutQty" type="number" class="inpNum-g">
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="130" align="center">
            <template slot-scope="scope">
              <el-button @click="handleDeleteClick1(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <!--共享库存设置-->
    <div class="aloneStock" style="margin-top: 20px">
      <h5>共享库存设置</h5>
      <!--添加2-->
      <el-button @click="addStockSetup2" type="info" style="width: 50px!important;height: 20px;padding: 0!important;">添加</el-button>
      <!--表格2 共享库存-->
      <div class="commTable" style="margin-top: 10px;position: relative">

        <el-tooltip class="item" effect="dark" content="排除现货独占数量后，现货商品的共享库存" placement="top-start">
          <i style="position: absolute;top: 8px;left: 276px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="排除预售独占数量后，预售商品的共享库存" placement="top-start">
          <i style="position: absolute;top: 8px;left: 439px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="当库存低于最小下架数，更新网店库存为0，当库存高于最小下架数，自动上架" placement="top-start">
          <i style="position: absolute;top: 8px;left: 771px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-table :data="tableData2" border style="width: 950px">

          <el-table-column label="生效店铺" align="center">
            <template slot-scope="scope">
              <el-select @change="stockChange2(scope.row,scope.$index)" id="shop" v-model="scope.row.storeId" filterable placeholder="全部">
                <el-option
                  v-for="(item,index) in optionsShop"
                  :disabled="item.disabled"
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
                <input @keyup="scope.row.cashShareQty = scope.row.cashShareQty.replace(/[^\d]/g,'')" v-model="scope.row.cashShareQty" type="number" class="inpNum-g">
                %
              </div>
            </template>
          </el-table-column>

          <el-table-column label="预售共享">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input @keyup="scope.row.presalesShareQty = scope.row.presalesShareQty.replace(/[^\d]/g,'')" v-model="scope.row.presalesShareQty" type="number" class="inpNum-g">
                %
              </div>
            </template>
          </el-table-column>

          <el-table-column label="自动同步库存" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.autoSynInvFlag" @click.native="switchChange2(scope.row,scope.$index)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="最小下架数">
            <template slot-scope="scope">
              <div class="cen-g" style="margin-left: 16%">
                <input @keyup="scope.row.minOutQty = scope.row.minOutQty.replace(/[^\d]/g,'')" v-model="scope.row.minOutQty" type="number" class="inpNum-g">
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="130" align="center">
            <template slot-scope="scope">
              <el-button @click="handleDeleteClick2(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <!--虚拟库存设置-->
    <div class="aloneStock" style="margin-top: 20px">
      <h5>虚拟库存设置</h5>
      <!--添加3-->
      <el-button @click="addStockSetup3" type="info" style="width: 50px!important;height: 20px;padding: 0!important;">添加</el-button>
      <!--表格3 虚拟库存-->
      <div class="dummyTable" style="margin-top: 10px;margin-bottom:70px;position: relative">
        <el-tooltip class="item" effect="dark" content="每次同步库存时按照此虚拟库存数量同步" placement="top-start">
          <i style="position: absolute;top: 8px;left: 276px;z-index: 99" class="el-icon-question"></i>
        </el-tooltip>

        <el-table :data="tableData3" border style="width: 950px">

          <el-table-column label="生效店铺" align="center" width="167">
            <template slot-scope="scope">
              <el-select @change="stockChange3(scope.row,scope.$index)" id="shop" v-model="scope.row.storeId" filterable placeholder="全部">
                <el-option
                  v-for="(item,index) in optionsShop"
                  :disabled="item.disabled"
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
                <input @keyup="scope.row.virtualInvQty = scope.row.virtualInvQty.replace(/[^\d]/g,'')" v-model="scope.row.virtualInvQty" type="number" class="inpNum-g">
              </div>
            </template>
          </el-table-column>

          <el-table-column label="自动同步库存" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.autoSynInvFlag" @click.native="switchChange3(scope.row,scope.$index)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="130" align="center">
            <template slot-scope="scope">
              <el-button @click="handleDeleteClick3(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
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
  export default {
    props: {
      params: Object //接收父级参数
    },
    data() {
      return {
        version: '1.0.0',
        goodsName: '',//商品名称
        barCode: '',//条形码
        goodsPresellInv: 0,//预售库存
        goodsstock: 2,//现货库存
        googsSalesInv: 0,//可售库存

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

      //返回父级
      showParentBlock() {
        this.$emit('changeShow',true)
      },

      //店铺接口
      initList: function () {
        this.optionsShop = [{value: '',label: '全部'}];
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/list').then(function (res) {
          if(res.data.success) {
            let arr = res.data.result;
            arr.forEach(function (val) {
              this.optionsShop.push({value: val.storeId,label: val.storeName,synInvFlag: val.synInvFlag,disabled: false})

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
        let data = {goodsId: this.params.goodsId};
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/echoGoodsStrategy',data).then(function (res) {
          console.log(111,res.data.result);
          if(res.data.success) {
            this.goodsName = res.data.result.goodsName;
            this.barCode = res.data.result.barCode;
            if(res.data.result.goodsPresellInv != undefined) {
              this.goodsPresellInv = res.data.result.goodsPresellInv;
            }
            if(res.data.result.goodsstock != undefined) {
              this.goodsstock = res.data.result.goodsstock;
            }
            if(res.data.result.googsSalesInv != undefined) {
              this.googsSalesInv = res.data.result.googsSalesInv;
            }

            this.tableData1 = res.data.result.wmCashQtyBeanList;
            this.tableData2 = res.data.result.wmShareInvBeanList;
            this.tableData3 = res.data.result.wmVirtualInvBinList;

            this.tableData1.forEach(function (val,index) {
              if(val.cashInvQty == undefined) {
                val.cashInvQty = 0;
                this.tableData1[index].cashInvQty = parseInt(this.tableData1[index].cashQty*this.goodsstock/100)
              }

            }.bind(this));

            this.tableData1.forEach(function (val,index) {
              if(val.presalesInvQty == undefined) {
                val.presalesInvQty = 0;
                this.tableData1[index].presalesInvQty = parseInt(this.tableData1[index].presalesQty*this.goodsPresellInv/100)
              }

            }.bind(this))
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
          goodsId: this.params.goodsId,
          goodsPresellInv: this.goodsPresellInv,
          cashQtyJson: JSON.stringify(this.tableData1),
          presalesJson: JSON.stringify(this.tableData2),
          virTurlInvQtyJson: JSON.stringify(this.tableData3)
        };
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/updateGoodsStrategy',data).then(function (res) {
          if(res.data.success) {
//            this.$router.push('/asStock')

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
        console.log(222,this.tableData1);
        this.changeColor()
      },

      //计算现货独占数量
      cashQtyChange: function (row,index) {
        let obj = this.tableData1[index];
        obj.cashInvQty = parseInt(row.cashQty*this.goodsstock/100);
        this.$set(this.tableData1,index,obj)
      },

      //计算预售独占数量
      presalesQtyChange: function (row,index) {
        let obj = this.tableData1[index];
        obj.presalesInvQty = parseInt(row.presalesQty*this.goodsPresellInv/100);
        this.$set(this.tableData1,index,obj)
      },

      //table1启用状态
      switchChange1: function (row,index) {
        let obj = this.tableData1[index];
        obj.autoSynInvFlag = row.autoSynInvFlag;
        this.$set(this.tableData1,index,obj);
      },

      //共享同步库存
      stockChange2:function (row,index) {
        let choosenItem = this.optionsShop.filter(item => item.value === row.storeId)[0];
        let obj = this.tableData2[index];
        obj.autoSynInvFlag = choosenItem.synInvFlag;
        this.$set(this.tableData2,index,obj);
        this.changeColor()
      },

      //table2启用状态
      switchChange2: function (row,index) {
        let obj = this.tableData2[index];
        obj.autoSynInvFlag = row.autoSynInvFlag;
        this.$set(this.tableData2,index,obj);
      },

      //虚拟同步库存
      stockChange3:function (row,index) {
        let choosenItem = this.optionsShop.filter(item => item.value === row.storeId)[0];
        let obj = this.tableData3[index];
        obj.autoSynInvFlag = choosenItem.synInvFlag;
        this.$set(this.tableData3,index,obj);
        this.changeColor()
      },

      //table3启用状态
      switchChange3: function (row,index) {
        let obj = this.tableData3[index];
        obj.autoSynInvFlag = row.autoSynInvFlag;
        this.$set(this.tableData3,index,obj);
      },

      //店铺置灰
      changeColor: function () {
        let arr = [];
        if(this.tableData1 != '') {
          this.tableData1.forEach(function (val) {
            arr.push(val)
          });
        }
        if(this.tableData2 != '') {
          this.tableData2.forEach(function (val) {
            arr.push(val)
          });
        }
        if(this.tableData3) {
          this.tableData3.forEach(function (val) {
            arr.push(val)
          });
        }

        this.optionsShop.forEach(function (item,index) {
          item.disabled = false;
          arr.forEach(function (val) {
            if(val.storeId == item.value) {
              item.disabled = true
            }
          }.bind(this));

        }.bind(this))
      },

      //独占删除
      handleDeleteClick1: function (index) {
        this.tableData1.splice(index,1);
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      },

      //共享删除
      handleDeleteClick2: function (index) {
        this.tableData2.splice(index,1);
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      },

      //虚拟删除
      handleDeleteClick3: function (index) {
        this.tableData3.splice(index,1);
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      },

      //添加独占库存设置
      addStockSetup1: function () {
        this.tableData1.push({minOutQty: 0});
        this.changeColor()
      },

      //添加共享库存设置
      addStockSetup2: function () {
        this.tableData2.push({minOutQty: 0});
        this.changeColor()
      },

      //添加虚拟库存设置
      addStockSetup3: function () {
        this.tableData3.push({});
        this.changeColor()
      },

      //返回按钮
      backClick: function () {
//        this.$router.push('/asStock')
        this.$emit('changeShow',true)
      },

      //保存按钮
      holdClick: function () {
        let cashQtyNum = 0;
        this.tableData1.forEach(function (val) {
          cashQtyNum += parseInt(val.cashQty)
        }.bind(this));

        let presalesQtyNum = 0;
        this.tableData1.forEach(function (val) {
          presalesQtyNum += parseInt(val.presalesQty)
        }.bind(this));

        let cashShareQtyNum = 0;
        this.tableData2.forEach(function (val) {
          cashShareQtyNum += parseInt(val.cashShareQty)
        }.bind(this));

        let presalesShareQtyNum = 0;
        this.tableData2.forEach(function (val) {
          presalesShareQtyNum += parseInt(val.presalesShareQty)
        }.bind(this));

        if(cashQtyNum > 100) {
          this.$alert("现货独占之和不能大于100%！", {
            type: 'info',
            center: true,
            confirmButtonText: '确定'
          })
        }else if(presalesQtyNum > 100) {
          this.$alert("预售独占之和不能大于100%！", {
            type: 'info',
            center: true,
            confirmButtonText: '确定'
          })
        }else if(cashShareQtyNum > 100) {
          this.$alert("现货共享之和不能大于100%！", {
            type: 'info',
            center: true,
            confirmButtonText: '确定'
          })
        }else if(presalesShareQtyNum > 100) {
          this.$alert("预售共享之和不能大于100%！", {
            type: 'info',
            center: true,
            confirmButtonText: '确定'
          })
        }else {
          this.initAddWm()
        }
      },
    }
  }
</script>
