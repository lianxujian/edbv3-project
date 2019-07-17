<!--库位库存快照 尘音-->
<template>
  <div>
    <div v-show="paramsObj.mainPageShow" id="snapshot">
      <!--搜索区-->
      <div id="searchBox">
        <div class="leftBox2">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="searchStock">仓库：</label>
                <el-select @change="stockChange" id="searchStock" v-model="storageId" filterable placeholder="全部">
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
                <label for="stockArea">库区：</label>
                <el-select id="stockArea" v-model="storageSectionId" filterable placeholder="全部">
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
                <label for="stockSeat">库位：</label>
                <el-input @keyup.enter.native="search" maxlength="50" id="stockSeat" v-model="storageBinId" placeholder="请输入内容"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="name">商品名称：</label>
                <el-input @keyup.enter.native="search" maxlength="100" id="name" v-model="goodsName" placeholder="请输入内容"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="barCode">条形码：</label>
                <el-input @keyup.enter.native="search" maxlength="50" id="barCode" v-model="barCode" placeholder="请输入内容"></el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <label>快照时间：</label>
                <!--时间组件-->
                <dataTime
                  style="display: inline-block;width: 86%"
                  :timeCom1="startTime"
                  :timeCom2="endTime"
                  @timeVal1="getTime1"
                  @timeVal2="getTime2">
                </dataTime>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox2">
          <el-button @click="search" size="mini" type="primary">查 询</el-button>
          <el-button @click="reset" size="mini" type="default">重 置</el-button>
        </div>
      </div>
      <!--表格-->
      <div class="pDown">
        <el-table id="tableH" :data="tableData" border :max-height="table_h" style="width: 100%">
          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

          <el-table-column label="条形码" width="110" align="center">
            <template slot-scope="scope">
              {{ scope.row.barCode }}
            </template>
          </el-table-column>

          <el-table-column label="商品名称" width="200">
            <template slot-scope="scope">
              {{ scope.row.goodsName }}
            </template>
          </el-table-column>

          <el-table-column label="批次号" align="center">
            <template slot-scope="scope">
              {{ scope.row.batchNo }}
            </template>
          </el-table-column>

          <el-table-column label="仓库">
            <template slot-scope="scope">
              {{ scope.row.storageName }}
            </template>
          </el-table-column>

          <el-table-column label="库区" align="center">
            <template slot-scope="scope">
              {{ scope.row.sectionName }}
            </template>
          </el-table-column>

          <el-table-column label="库位" align="center">
            <template slot-scope="scope">
              {{ scope.row.storageBinName }}
            </template>
          </el-table-column>

          <el-table-column label="库位类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.binType == 1">正品</span>
              <span v-if="scope.row.binType == 2">次品</span>
            </template>
          </el-table-column>

          <el-table-column label="可配货库存" align="right">
            <template slot-scope="scope">
              {{ scope.row.dstInv }}
            </template>
          </el-table-column>

          <el-table-column label="可配货预占" align="right">
            <template slot-scope="scope">
              {{ scope.row.dstCamponInv }}
            </template>
          </el-table-column>

          <el-table-column label="上架预占" align="right">
            <template slot-scope="scope">
              {{ scope.row.putawayCamponInv }}
            </template>
          </el-table-column>

          <el-table-column label="快照时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.createTime | normalTime(6) }}
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
    <bill
      v-if="!paramsObj.mainPageShow"
      :params="paramsObj"
      @changeShow="changeShow">
    </bill>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  import bill from '@/components/views/stock/children/Bill.vue'
  export default {
    components: {
      pagination,dataTime,bill
    },
    data() {
      return {
        version:'1.0.0',
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId: '',//仓库

        optionsStockArea:[{value: '',label: '全部'}],//库区下拉
        storageSectionId:'',//库区

        storageBinId:'',//库位
        barCode: '',//条形码
        goodsName:'',//商品名称
        startTime: '',//快照开始
        endTime: '',//快照结束

        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 20, //每页数量
        curPage: 1, //当前页数

        paramsObj:{
          mainPageShow:true,
        },//子级传参
      }
    },
    mounted(){
      this.initTime();//初始化时间

      this.initStock();//初始化仓库下拉
      this.initMessage();//初始化表格数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods:{

      //子级传参通知父级刷新表格数据
      changeShow(val){
        if(val){
          this.initMessage();
        }
        this.paramsObj.mainPageShow = true;
      },

      //初始化时间
      initTime: function () {
        let oDate = new Date();
        const Y = oDate.getFullYear(),
          M = oDate.getMonth() + 1,
          D = oDate.getDate();
        let timeStart = Y + ' ' + M + ' ' + D + ' 00:00:00';
        this.startTime = new Date(timeStart);
        let timeEnd = Y + ' ' + M + ' ' + D + ' 23:59:59';
        this.endTime = new Date(timeEnd)
      },

      //根据仓库id获取库区
      stockChange:function () {
        if(this.storageId != '') {
          this.initSeat()
        }else {
          this.storageSectionId = '';
          this.optionsStockArea = [{value: '',label: '全部'}]
        }
      },

      //重置
      reset: function () {
        this.storageId = '';
        this.barCode = '';
        this.goodsName = '';
        this.storageBinId = '';
        this.storageSectionId = '';
        this.initTime();
      },

      //查询
      search: function () {
        this.initMessage();
      },

      //获取时间startTime
      getTime1: function (val) {

        this.startTime = val
      },

      //获取时间endTime
      getTime2: function (val) {
        this.endTime = val;
      },

      //查询
      search: function () {
        this.initMessage()
      },

      //初始化仓库下拉
      initStock: function () {
        let dataStock = {merchantId: 0};
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth',dataStock).then(function (res) {
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
          storageId: this.storageId
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/findByStorageId',data).then(function (res) {
          if(res.data.success) {
            let arr = res.data.result;
            console.log(arr);
            this.optionsStockArea = [{value:'',label:'全部'}];
            this.storageSectionId = '';
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

      //初始化表格数据
      initMessage: function () {
        let startTime,endTime;
        if(this.startTime != null) {
          startTime = new Date(this.startTime).getTime()
        }else {
          startTime = ''
        }
        if(this.endTime != null) {
          endTime = new Date(this.endTime).getTime()
        }else {
          endTime = ''
        }
        let data={
          goodsName: this.goodsName,
          barCode: this.barCode,
          storageId: this.storageId,
          storageBinName: this.storageBinId,
          startTime: startTime,
          endTime: endTime,
          storageSectionId: this.storageSectionId,
          page: this.curPage,
          size: this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmBinInvVsfService/' + this.version + '/query',data).then(function (res) {
          console.log(res);
          if(res.data.success) {
            this.tableData=res.data.result.rows;
            this.total = res.data.result.total;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //预占
      campon: function (row,type) {
        let obj = {
          goodsId: row.goodsId,
          storageId: row.storageId,
          camponType: type
        };

        //给子级传参并显示子级
        this.paramsObj = {
          id: obj,
          num: 3,
          mainPageShow: false
        }
      },

//      以下是分页
      getPageSize: function (val) {
        if(val != undefined) {

          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();

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
  #snapshot{
    padding: 20px;
  }
</style>
