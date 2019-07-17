<!--批次查询 尘音-->
<template>
  <div>
    <!--主页-->
    <div v-show="paramsObj.mainPageShow"  id="batchQuery">
      <!--搜索区-->
      <div id="searchBox">
        <div class="leftBox1">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="searchStock">仓库：</label>
                <el-select id="searchStock" v-model="storageId" filterable placeholder="全部">
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
                <label for="supplier">供应商：</label>
                <el-select id="supplier" v-model="storageSectionId" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsSupplier"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content">
                <label for="name">商品名称：</label>
                <el-input @keyup.enter.native="search" maxlength="100" id="name" v-model="goodsName" placeholder="请输入内容"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <el-select id="condition" v-model="queryEnumId" filterable placeholder="全部" style="width: 110px!important;">
                  <el-option
                    v-for="item in optionsCondition"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input @keyup.enter.native="search" maxlength="50" v-model="queryMsg" placeholder="请输入内容" style="width: 50%!important;"></el-input>
              </div>
            </el-col>
            <el-col :span="4" class="loseDay">
              <div class="grid-content">
                <span>临近失效天数</span>
                <input maxlength="10" @keyup.enter="search" type="text" @keyup="nearLoseDay = nearLoseDay.replace(/[^\d]/g,'')" style="width: 60px!important" v-model="nearLoseDay" class="inpNum-g">
                <span>天</span>
                <el-checkbox v-model="available">有货</el-checkbox>
              </div>
            </el-col>

          </el-row>
        </div>
        <div class="rightBox1">
          <el-button @click="search" size="mini" type="primary">查 询</el-button>
        </div>
      </div>
      <!--表格-->
      <div class="pDown">
        <el-table id="tableH" :data="tableData" border :max-height="table_h" style="width: 100%">
          <el-table-column label="序号" type="index" align="center" width="45"></el-table-column>

          <el-table-column label="提示" width="250" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.timeStatus == 1">
                <span style="color: #129646">正常 —</span>
                <span>预警提前期 —</span>
                <span>发货提前期 —</span>
                <span>过期</span>
              </div>
              <div v-if="scope.row.timeStatus == 2">
                <span style="color: #B9B9B9">正常 —</span>
                <span style="color: #FFA22C">预警提前期 —</span>
                <span>发货提前期 —</span>
                <span>过期</span>
              </div>
              <div v-if="scope.row.timeStatus == 3">
                <span style="color: #B9B9B9">正常 —</span>
                <span style="color: #B9B9B9">预警提前期 —</span>
                <span style="color: #FF392A">发货提前期 —</span>
                <span>过期</span>
              </div>
              <div v-if="scope.row.timeStatus == 4">
                <span style="color: #B9B9B9">正常 —</span>
                <span style="color: #B9B9B9">预警提前期 —</span>
                <span style="color: #B9B9B9">发货提前期 —</span>
                <span style="color: #B9B9B9">过期</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="商品图片" width="110" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl">
            </template>
          </el-table-column>

          <el-table-column label="条形码" width="110">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.barCode }}</p>
            </template>
          </el-table-column>

          <el-table-column label="商品名称" width="200">
            <template slot-scope="scope">
              <p class="initP-g">{{ scope.row.goodsName }}</p>
            </template>
          </el-table-column>

          <el-table-column label="规格" width="60">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.specification }}</p>
            </template>
          </el-table-column>

          <el-table-column label="供应商">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.supplierName }}</p>
            </template>
          </el-table-column>

          <el-table-column label="批次号" width="80">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.batchNo }}</p>
            </template>
          </el-table-column>

          <el-table-column label="生产日期">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.produceTime | normalTime(6) }}</p>
            </template>
          </el-table-column>

          <el-table-column label="保质期" width="60">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.expTimeTxt }}</p>
            </template>
          </el-table-column>

          <el-table-column label="预警提前期" width="110">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.warningAheadTimeTxt }}</p>
            </template>
          </el-table-column>

          <el-table-column label="发货提前期" width="110">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.sendAheadTimeTxt }}</p>
            </template>
          </el-table-column>

          <el-table-column label="可配货库存" width="110">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.dstInv }}</p>
            </template>
          </el-table-column>

          <el-table-column label="可配货预占" width="110">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.dstCamponInv }}</p>
            </template>
          </el-table-column>

          <!--批次属性-->
          <el-table-column :label="item.attributeName" v-for="(item,index) in batchArr" :key="index" width="160">
            <template slot-scope="scope">
              <p class="cen-g" v-for="(val,ind) in scope.row.goodsBatchAttributeValueBeans">
                <span v-if="index == ind">{{ scope.row.goodsBatchAttributeValueBeans[index].attributeValue }}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="130" align="center">
            <template slot-scope="scope">
              <el-button @click="handleCheckClick(scope.row)" type="text" size="small">查看库存详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!--分页-->
        <div class="pagination">
          <pagination
            :totalCom="total"
            :pageSizeCom="pageSize"
            :curPageCom="curPage"
            @pageSizeVal="getPageSize" @curPageVal="getCurPage">
          </pagination>
        </div>
      </div>
    </div>

    <!--查看库存详情-->
    <batchDetail
      v-if="!paramsObj.mainPageShow"
      :params="paramsObj"
      @changeShow="changeShow">
    </batchDetail>
  </div>

</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import batchDetail from '@/components/views/commodity/children/BatchDetail.vue'
  export default {
    components:{
      pagination,batchDetail
    },
    data() {
      return {
        version: '1.0.0',
        optionsStock: [{value: '',label: '全部'}],//仓库下拉
        storageId: '',//仓库

        optionsSupplier: [{value: '',label: '全部'}],//供应商下拉
        storageSectionId: '',//供应商

        goodsName: '',//商品名称
        nearLoseDay: '',//临近失效条数
        available: true,//是否有货

        optionsCondition: [//条形码下拉
          {
            value: '1',
            label: '条形码'
          },
          {
            value: '2',
            label: '批次号'
          },
          {
            value: '3',
            label: '备用条形码'
          }
        ],
        queryEnumId: '1',//条形码
        queryMsg: '',//条形码文本

        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1,//当前页数

        batchArr: [],//批次属性列表

        paramsObj: {
          mainPageShow: true
        },//子级传参
      }
    },
    mounted() {

      //初始化每页数量
      if(sessionStorage.getItem("hold_batchSetup_1") != null) {
        this.pageSize = parseInt(sessionStorage.getItem("hold_batchSetup_1"));
      }

      this.initStock();//初始化仓库下拉
      this.initGetSupplier();//初始化供应商下拉
      this.initMessage();//初始化页面数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods:{

      //子级传参通知父级刷新表格数据
      changeShow(val) {
        if(val) {
          this.initMessage();
        }
        this.paramsObj.mainPageShow = true
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

      //初始化供应商下拉
      initGetSupplier: function () {
        this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/getSupplierList').then(function (res) {
          if(res.data.success) {
            let arr = res.data.result;
            arr.forEach(function (val) {
              this.optionsSupplier.push({value: val.supplierId,label: val.supplierName})
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this));
      },

      //初始化页面数据
      initMessage: function () {
        let data = {
          storageId: this.storageId,
          supplierId: this.storageSectionId,
          goodsName: this.goodsName,
          queryEnumId: this.queryEnumId,
          queryMsg: this.queryMsg,
          nearLoseDay: this.nearLoseDay,
          available: this.available,
          page: this.curPage,
          size: this.pageSize

        };
        this._post('com.edb01.erp.wms.service.api.StorageBinGoodsService/' + this.version + '/showDataPager',data).then(function (res) {
          if(res.data.success) {
            this.tableData = res.data.result.rows;
            this.total = res.data.result.total;
            this.batchArr = res.data.result.rows[0].goodsBatchAttributeValueBeans;
            console.log(this.batchArr)
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this));
      },

      //查询
      search: function () {
        this.initMessage();
      },

      //查看库存详情
      handleCheckClick: function (row) {
        let id = {goodsId: row.goodsId,batchNo: row.batchNo,specification: row.specification,goodsName: row.goodsName};
//        this.$router.push('/batchDetail/' + JSON.stringify(id))

        //给子级传参并显示子级
        this.paramsObj = {
          id: id,
          mainPageShow: false
        }
      },

      //以下是分页
      getPageSize: function (val) {
        if(val != undefined) {

          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();

          //存储每页数量
          sessionStorage.setItem('hold_batchSetup_1', val);
        }
      },
      getCurPage: function (val) {
        if(val != undefined) {

          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
        }
      }
    }
  }
</script>
<style scoped>
  @media screen and (max-width:1461px) {
    .loseDay{
      width: 100% !important;
    }
  }
</style>

