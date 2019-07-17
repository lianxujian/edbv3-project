<!--库存变更跟踪日志 尘音-->
<template>
  <div id="log">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox2">
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
              <label for="barCode">条形码：</label>
              <el-input @keyup.enter.native="search" maxlength="50" id="barCode" v-model="barCode" placeholder="请输入内容"></el-input>
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
              <label for="sourceBill">来源单号：</label>
              <el-input @keyup.enter.native="search" maxlength="50" id="sourceBill" v-model="sourceOrderCode" placeholder="请输入内容"></el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <label>变更时间：</label>
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

          <el-col :span="6">
            <div class="grid-content">
              <label for="docType">单据类型：</label>
              <el-select id="docType" v-model="sourceOrderType" filterable placeholder="全部">
                <el-option
                  v-for="item in optionsDocType"
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
        <el-button @click="search" size="mini" type="primary" >查 询</el-button>
        <el-button @click="reset" size="mini" type="default" >重 置</el-button>
      </div>
    </div>
    <!--表格-->
    <div class="pDown">
      <el-table id="tableH" :data="tableData" border :max-height="table_h" style="width: 100%">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="条形码" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.goodsBarCode }}
          </template>
        </el-table-column>

        <el-table-column label="商品名称" width="200">
          <template slot-scope="scope">
            {{ scope.row.goodsName }}
          </template>
        </el-table-column>

        <el-table-column label="来源单号" align="center">
          <template slot-scope="scope">
            {{ scope.row.sourceOrderCode }}
          </template>
        </el-table-column>

        <el-table-column label="单据类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sourceOrderType == '1001'">上架</span>
            <span v-if="scope.row.sourceOrderType == '1002'">拣货</span>
            <span v-if="scope.row.sourceOrderType == '1003'">补货</span>
            <span v-if="scope.row.sourceOrderType == '1004'">移位</span>
            <span v-if="scope.row.sourceOrderType == '1005'">库存调整</span>
          </template>
        </el-table-column>

        <el-table-column label="仓库">
          <template slot-scope="scope">
            {{ scope.row.storageName }}
          </template>
        </el-table-column>

        <el-table-column label="来源库位" align="center">
          <template slot-scope="scope">
            {{ scope.row.sourceStorageBinName }}
          </template>
        </el-table-column>

        <el-table-column label="目标库位" align="center">
          <template slot-scope="scope">
            {{ scope.row.targetStorageBinName }}
          </template>
        </el-table-column>

        <el-table-column label="变更数量" align="right">
          <template slot-scope="scope">
            {{ scope.row.changeQty }}
          </template>
        </el-table-column>

        <el-table-column label="变更后数量" align="right">
          <template slot-scope="scope">
            {{ scope.row.changeStorageInv }}
          </template>
        </el-table-column>

        <el-table-column label="变更时间" align="center">
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
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  export default {
    components:{
      pagination,dataTime
    },
    data() {
      return {
        version:'1.0.0',
        optionsStock:[{value: '', label: '全部'}],//仓库下拉
        storageId: '',//仓库
        barCode: '',//条形码
        goodsName:'',//商品名称
        sourceOrderCode:'',//来源单号
        startTime: '',//起始时间
        endTime: '',//结束时间
        optionsDocType:[//单据类型下拉
          {
            value: '1000',
            label: '全部'
          },
          {
            value: '1001',
            label: '上架'
          },
          {
            value: '1002',
            label: '拣货'
          },
          {
            value: '1003',
            label: '补货'
          },
          {
            value: '1004',
            label: '移位'
          },
          {
            value: '1005',
            label: '库存调整'
          }
        ],
        sourceOrderType: '1000',//单据类型

        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数

      }
    },
    mounted(){

      this.initTime();//初始化时间
      this.initStock();//初始化仓库下拉
      this.initMessage();//初始化表格数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);

      });

    },
    methods:{

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

      //重置
      reset: function () {
        this.storageId = '';
        this.barCode = '';
        this.goodsName = '';
        this.sourceOrderCode = '';
        this.sourceOrderType = '1000';
        this.initTime();
      },

      //查询
      search: function () {

        this.initMessage();
      },

      //初始化仓库下拉列表
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

      //初始化表格数据
      initMessage:function () {

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
          "sourceOrderCode": this.sourceOrderCode,
          "goodsName": this.goodsName,
          "barCode": this.barCode,
          "storageId": this.storageId,
          "sourceOrderType": this.sourceOrderType,
          "startTime": startTime,
          "endTime": endTime,
          "page": this.curPage,
          "size": this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageInvLogService/' + this.version + '/queryPager',data).then(function (res) {
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

      //获取时间startTime
      getTime1: function (val) {
        this.startTime = val
      },

      //获取时间endTime
      getTime2: function (val) {
        this.endTime = val;
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
          this.curPage = val;
          this.initMessage();
        }
      }
    }
  }
</script>
<style scoped>
  #log{
    padding: 20px;
  }
</style>

