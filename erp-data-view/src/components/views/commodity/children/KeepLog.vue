<!--同步库存日志 尘音-->
<template>
  <div id="keepLog">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">网店商品</a></el-breadcrumb-item>
        <el-breadcrumb-item>同步库存日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--主体-->
    <div class="content">
      <!--搜索区-->
      <div id="searchBox">
        <div class="leftBox2">
          <el-row>
            <el-col class="contentTime">
              <div class="grid-content">
                <label>更新时间：</label>
                <!--时间组件-->
                <dataTime
                  style="display: inline-block"
                  :timeCom1="startTime"
                  :timeCom2="endTime"
                  @timeVal1="getTime1"
                  @timeVal2="getTime2"
                ></dataTime>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="shop">店铺：</label>
                <el-select id="shop" v-model="shop" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsShop"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="code">商家编码：</label>
                <el-input @keyup.enter.native="search" maxlength="50" id="code" v-model="code" placeholder="请输入内容"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="name">网店品名：</label>
                <el-input @keyup.enter.native="search" maxlength="100" id="name" v-model="goodsName" placeholder="请输入内容"></el-input>
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
          <!--<el-table-column label="序号" width="45" type="index" align="center"></el-table-column>-->

          <el-table-column label="店铺">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.storeName }}</p>
            </template>
          </el-table-column>

          <el-table-column label="商品编码">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.dtGoodsCode }}</p>
            </template>
          </el-table-column>

          <el-table-column label="网店品名">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.dtGoodsName }}</p>
            </template>
          </el-table-column>

          <el-table-column label="网店规格">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.dtGoodsSpec }}</p>
            </template>
          </el-table-column>

          <el-table-column label="同步库存">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.dtSyncQty }}</p>
            </template>
          </el-table-column>

          <el-table-column label="更新时间">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.createTime | normalTime(6) }}</p>
            </template>
          </el-table-column>

          <el-table-column label="更新结果">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.dtSyncResult }}</p>
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
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  export default {
    props: {
      params: Object //接收父级参数
    },
    components: {
      pagination,dataTime
    },
    data() {
      return {
        version: '1.0.0',
        startTime: '',//起始时间
        endTime:'',//结束时间

        optionsShop: [],//店铺下拉
        shop: '',//店铺

        code: '',//商家编码

        goodsName: '',//网店名称

        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
      }
    },

    mounted() {

      this.initList();//初始化店铺数据

      this.initMessage();//初始化页面数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });
    },

    methods: {

      //返回父级
      showParentBlock() {
        this.$emit('changeShow',true)
      },

      //重置
      reset: function () {
        this.startTime = '';
        this.endTime = '';
        this.shop = '';
        this.code = '';
        this.goodsName = ''
      },

      //查询
      search: function () {
        this.initMessage()
      },

      //店铺接口
      initList: function () {
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/listOauth').then(function (res) {
          if(res.data.success) {
            res.data.result.forEach(function (val) {
              this.optionsShop.push({value: val.storeId,label: val.storeName});
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //初始化页面数据
      initMessage: function () {
        let startTime,endTime;
        if(this.startTime != '') {
          startTime = new Date(this.startTime).getTime()
        }else {
          startTime = ''
        }
        if(this.endTime != '') {
          endTime = new Date(this.endTime).getTime()
        }else {
          endTime = ''
        }
        let data = {
          startTime: startTime,
          endTime: endTime,
          storeId: this.shop,
          merchantCode: this.code,
          dtEcGoodsName: this.goodsName,
          page: this.curPage,
          size: this.pageSize
        };
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsSyncLogService/' + this.version + '/query',data).then(function (res) {
          if(res.data.success) {
            this.tableData = res.data.result.rows;
            this.total = res.data.result.total
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
<style scoped>
  .content{
    margin-top: 20px;
  }
  .contentTime{
    width: 36%;
  }
  @media screen and (max-width:1461px){
    .contentTime{
      width: 57%;
    }
  }
</style>

