<!--库位库存查询 尘音-->
<template>
  <div>
    <div v-show="paramsObj.mainPageShow" id="seat">
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
                <el-input @keyup.enter.native="search" maxlength="50" id="stockSeat" v-model="storageBinName" placeholder="请输入内容"></el-input>
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
            <el-col :span="6">
              <div class="grid-content">
                <label for="stockType">库位类型：</label>
                <el-select id="stockType" v-model="binType" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsStockType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <el-select style="width: 95px!important;" v-model="invtype" filterable>
                  <el-option
                    v-for="item in optionsData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input @keyup.enter.native="search" @keyup.native="startInv = startInv.replace(/[^\d]/g,'')" style="width: 26%!important;" maxlength="10" v-model="startInv"></el-input>
                -
                <el-input @keyup.enter.native="search" @keyup.native="endInv = endInv.replace(/[^\d]/g,'')" style="width: 26%!important;" maxlength="10" v-model="endInv"></el-input>
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
        <el-table id="tableH" :data="tableData" border :max-height="table_h" show-summary style="width: 100%">
          <el-table-column label="序号" type="index" align="center" width="45"></el-table-column>

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
              <span v-if="scope.row.batchNo != 0">{{ scope.row.batchNo }}</span>
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
              <span v-show="scope.row.binType == 1">正品</span>
              <span v-show="scope.row.binType == 2">次品</span>
            </template>
          </el-table-column>

          <el-table-column label="可配货库存" prop="dstInv" sortable align="right">
            <template slot-scope="scope">
              {{ scope.row.dstInv }}
            </template>
          </el-table-column>

          <el-table-column label="可配货预占" prop="dstCamponInv" sortable align="right">
            <template slot-scope="scope">
              <a @click="campon(scope.row,'1002')" v-show="scope.row.dstCamponInv != 0" href="javascript:">{{ scope.row.dstCamponInv }}</a>
              <span v-show="scope.row.dstCamponInv == 0">0</span>
            </template>
          </el-table-column>

          <el-table-column label="上架预占" prop="putawayCamponInv" sortable align="right">
            <template slot-scope="scope">
              <a @click="campon(scope.row,'1003')" v-show="scope.row.putawayCamponInv != 0" href="javascript:">{{ scope.row.putawayCamponInv }}</a>
              <span v-show="scope.row.putawayCamponInv == 0">0</span>
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
    <seatBill
      v-if="!paramsObj.mainPageShow"
      :params="paramsObj"
      @changeShow="changeShow">
    </seatBill>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue';
  import seatBill from '@/components/views/stock/children/SeatBill.vue'
  export default {
    components: {
      pagination,seatBill
    },
    data() {
      return {
        version: '1.0.0',
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId: '',//仓库

        optionsStockArea:[{value: '',label: '全部'}],//库区下拉
        storageSectionId:'',//库区

        storageBinName:'',//库位
        barCode: '',//条形码
        goodsName:'',//商品名称
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

        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数

        paramsObj:{
          mainPageShow:true,
        },//子级传参

        //迭代
        optionsData: [
          {
            value: 1001,
            label: '现货库存'
          },
          {
            value: 1002,
            label: '预售库存'
          },
          {
            value: 1003,
            label: '台账余量'
          },
          {
            value: 1004,
            label: '台账预占'
          },
          {
            value: 1005,
            label: '实物库存'
          }],//库存类型下拉
        invtype: 1001,//库存类型
        startInv: '',//最小值
        endInv: '',//最大值
      }
    },
    mounted(){

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
        this.goodsName = '';
        this.barCode = '';
        this.storageId = '';
        this.storageSectionId = '';
        this.binType = '';
        this.storageBinName = '';
        this.optionsStockArea = [{value: '',label: '全部'}];
        this.startInv = '';
        this.endInv = '';
        this.invtype = 1001
      },

      //查询
      search: function () {
        if(parseInt(this.endInv) >= parseInt(this.startInv) || this.endInv == '' || this.startInv == '') {
          this.initMessage();
        }else {

          let msg = '';
          switch (this.invtype) {
            case 1001 :
              msg = '现货库存';
              break;
            case 1002 :
              msg = '预售库存';
              break;
            case 1003 :
              msg = '台账余量';
              break;
            case 1004 :
              msg = '台账预占';
              break;
            case 1005 :
              msg = '实物库存'
          }
          this.$message({
            message: msg + '起始数量不能大于结束数量',
            type: 'warning'
          })
        }
      },

      //初始化仓库下拉
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth').then(function (res) {
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
        let data = {
          invtype: this.invtype,
          startInv: this.startInv,
          endInv: this.endInv,
          "goodsName": this.goodsName,
          "barCode": this.barCode,
          "storageId": this.storageId,
          "storageSectionId": this.storageSectionId,
          "binType": this.binType,
          "storageBinName": this.storageBinName,
          "page": this.curPage,
          "size": this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmBinInvService/' + this.version + '/queryPager',data).then(function (res) {
          if(res.data.success) {
            this.tableData = res.data.result.rows;
            this.total = res.data.result.total;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
            this.tableData = [];
            this.total = 0
          }
        }.bind(this))
      },

      //预占
      campon: function (row,type) {
        let obj = {
          binInvId: row.binInvId,
          goodsId: row.goodsId,
          barCode: row.barCode,
          goodsName: row.goodsName,
          batchNo: row.batchNo,
          storageName: row.storageName,
          sectionName: row.sectionName,
          storageBinName: row.storageBinName,
          binType: row.binType,
          storageId: row.storageId,
          camponType: type
        };

        //给子级传参并显示子级
        this.paramsObj = {
          id: obj,
          num: 2,
          mainPageShow: false
        }
      },

      //以下是分页
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
