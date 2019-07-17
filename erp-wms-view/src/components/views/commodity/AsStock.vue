<!--同步库存策略 尘音-->
<template>
  <div>

    <!--主页-->
    <div v-show="paramsObj.mainPageShow" id="asStock">
      <!--搜索区-->
      <div id="searchBox">
        <div class="leftBox2">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="name">商品名称：</label>
                <el-input @keyup.enter.native="search" maxlength="100" id="name" v-model="goodsName" placeholder="请输入内容"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="barCode">条形码：</label>
                <el-input @keyup.enter.native="search" maxlength="50" id="goodsBarCode" v-model="barCode" placeholder="请输入内容"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="isPreSale">是否关联策略：</label>
                <el-select id="isPreSale" v-model="strategyFalg" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optionsStrategy"
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
          <el-button @click="search" size="mini" type="primary">查 询</el-button>
          <el-button @click="reset" size="mini" type="default">重 置</el-button>
        </div>
      </div>

      <!--操作导航-->
      <div class="col-nav" style="margin:0 0 10px">
        <ul style="margin-bottom: 0">
          <!--选择策略-->
          <li v-if="authorityCode.WMS_ASSTOCK_CHOSE" @click="choseWaveClick"><span>选择策略</span></li>
          <el-dialog v-dialogDrag
            id="dialogBox"
            title="选择策略"
            :visible.sync="choseDialogVisible"
            width="800px"
            center>

            <div class="contentBox">
              <!--搜索区-->
              <div id="searchBox1" style="position: relative">
                <div class="leftBox2">
                  <el-row>
                    <div class="grid-content">
                      <label for="name" style="width: 60px!important;">策略名称：</label>
                      <el-input @keyup.enter.native="choseSearch" style="width: 300px!important;" maxlength="100" id="name" v-model="strategyName" placeholder="请输入内容"></el-input>
                    </div>
                  </el-row>
                </div>
                <div class="rightBox2">
                  <el-button @click="choseSearch" size="mini" type="primary">查 询</el-button>
                </div>
              </div>
              <!--表格2-->
              <div style="margin-bottom: 20px">
                <div class="pDown" style="position: relative">
                  <el-table
                    highlight-current-row
                    id="tableH" :data="tableData2" border :max-height="table_h" style="width: 100%"
                    @current-change="handleCurrentChange2">

                    <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

                    <el-table-column label="策略名称">
                      <template slot-scope="scope">
                        {{ scope.row.strategyName }}
                      </template>
                    </el-table-column>

                    <el-table-column label="策略生效店铺" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        {{ scope.row.storeName }}
                      </template>
                    </el-table-column>

                    <el-table-column label="创建时间">
                      <template slot-scope="scope">
                        <p class="cen-g">{{ scope.row.createTime | normalTime(6) }}</p>
                      </template>
                    </el-table-column>

                    <el-table-column label="修改时间">
                      <template slot-scope="scope">
                        <p class="cen-g">{{ scope.row.updateTime | normalTime(6) }}</p>
                      </template>
                    </el-table-column>

                  </el-table>
                  <!--分页-->
                  <div class="pagination" style="position: absolute;bottom: -50px;border-top: none">
                    <pagination
                      :totalCom="total2"
                      :pageSizeCom="pageSize2"
                      :curPageCom="curPage2"
                      @pageSizeVal="getPageSize2" @curPageVal="getCurPage2">
                    </pagination>
                  </div>
                </div>
              </div>
            </div>

            <span slot="footer" class="dialog-footer">
            <el-button @click="choseDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="choseWaveOk">确 认</el-button>
          </span>
          </el-dialog>
          <!--策略设置-->
          <li v-if="authorityCode.WMS_ASSTOCK_SETUP" @click="waveSetupClick"><span>策略设置</span></li>
          <!--查看日志-->
          <li v-if="authorityCode.WMS_ASSTOCK_LOG" @click="publicLogBtn"><span>查看日志</span></li>
          <publicLogDialog
            @changShow="changDialogShow"
            :paramObj="paramObj"
            :pulicLogVisible="pulicLogVisible">
          </publicLogDialog>
        </ul>
      </div>

      <!--表格1-->
      <div class="pDown">
        <el-table
          id="tableH" :data="tableData1" border :max-height="table_h" style="width: 100%"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange1">
          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>

          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.goodsUrl" alt="">
            </template>
          </el-table-column>

          <el-table-column label="条形码" align="center">
            <template slot-scope="scope">
              {{ scope.row.barCode }}
            </template>
          </el-table-column>

          <el-table-column label="商品名称" :show-overflow-tooltip="true" align="left">
            <template slot-scope="scope">
              {{ scope.row.goodsName }}
            </template>
          </el-table-column>

          <el-table-column label="规格" align="left">
            <template slot-scope="scope">
              {{ scope.row.specification }}
            </template>
          </el-table-column>

          <el-table-column label="可售库存" align="right">
            <template slot-scope="scope">
              {{ scope.row.googsSalesInv }}
            </template>
          </el-table-column>

          <el-table-column label="预售库存" align="right">
            <template slot-scope="scope">
              {{ scope.row.goodsPresellInv }}
            </template>
          </el-table-column>

          <el-table-column label="现货库存" align="right">
            <template slot-scope="scope">
              {{ scope.row.goodsstock }}
            </template>
          </el-table-column>

          <el-table-column label="虚拟库存" align="right">
            <template slot-scope="scope">
              {{ scope.row.virtualInv }}
            </template>
          </el-table-column>

          <el-table-column label="是否关联策略" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.strategyFalg == true">是</span>
              <span v-if="scope.row.strategyFalg == false">否</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="130" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.strategyFalg && authorityCode.WMS_ASSTOCK_EDIT" @click="handleEditClick(scope.row)" type="text" size="small">修改策略</el-button>
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
    </div>

    <!--修改策略（单个商品）-->
    <goodsEditStrategy
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 1"
      :params="paramsObj"
      @changeShow="changeShow">
    </goodsEditStrategy>

    <!--策略设置-->
    <waveSetup
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 2"
      :params="paramsObj"
      @changeShow="changeShow">
    </waveSetup>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import publicLogDialog from '@/components/common/publicLogDialog.vue'
  import goodsEditStrategy from '@/components/views/commodity/children/GoodsEditStrategy.vue'
  import waveSetup from '@/components/views/commodity/children/WaveSetup.vue'
  export default {
    components:{
      pagination,publicLogDialog,goodsEditStrategy,waveSetup
    },
    data() {
      return {
        version: '1.0.0',
        choseDialogVisible:false,//选择策略弹框显示隐藏

        goodsName:'',//商品名称
        barCode: '',//条形码

        optionsStrategy: [//是否关联策略下拉
          {
            value: '',
            label: '请选择'
          },
          {
            value: 'true',
            label: '是'
          },
          {
            value: 'false',
            label: '否'
          }
        ],
        strategyFalg: '',//是否关联策略

        multipleSelection1: [],//已选商品

        strategyName: '',//策略名称
        chooseWaveRow: null,//已选策略

        table_h: 0,//表格高度
        tableData1: [],//同步库存表格数据
        total1: 0, //总页数
        pageSize1: 15, //每页数量
        curPage1: 1, //当前页数

        tableData2: [],//选择策略表格数据
        total2: 0, //总页数
        pageSize2: 15, //每页数量
        curPage2: 1, //当前页数

        tableData3: [],//日志表格数据
        total3: 0, //总页数
        pageSize3: 15, //每页数量
        curPage3: 1, //当前页数

        pulicLogVisible:false,//查看日志弹框显示隐藏
        paramObj:{},//日志参数对象

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限

        paramsObj: {
          mainPageShow: true
        }//子级传参
      }
    },
    mounted(){

      this.initMessage1();//初始化同步库存表格数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods:{

      //子级传参通知父级刷新表格数据
      changeShow(val){
        if(val.isRefresh){
          this.initMessage1();
        }
        this.paramsObj.mainPageShow = true;
      },

      //重置
      reset: function () {
        this.barCode = '';
        this.goodsName = '';
        this.strategyFalg = ''
      },

      //查询
      search: function () {
        this.initMessage1();
      },

      //查询
      choseSearch: function () {
        this.initMessage2();
      },

      //初始化同步库存表格数据接口
      initMessage1: function () {
        let data = {
          "barCode": this.barCode,
          "goodsName": this.goodsName,
          "strategyFalg": this.strategyFalg,
          "page": this.curPage1,
          "size": this.pageSize1
        };
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/query',data).then(function (res) {
          if(res.data.success) {
            this.tableData1 = res.data.result.rows;
            this.total1 = res.data.result.total;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //初始化选择策略表格数据接口
      initMessage2: function () {
        let data = {
          goodschoce: true,
          strategyName: this.strategyName,
          page: this.curPage2,
          size: this.pageSize2
        };
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/queryStrategy',data).then(function (res) {
          if(res.data.success) {
            this.tableData2 = res.data.result.rows;
            this.total2 = res.data.result.total;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //选择策略确认接口
      initChoiceStrategy: function () {

        let goodsId = '';
        this.multipleSelection1.forEach(function (val) {
          goodsId += val.goodsId + ','
        });
        goodsId = goodsId.substring(0,goodsId.length - 1);

        let synInvStrategyIds = this.chooseWaveRow.synInvStrategyId;

        let data = {
          synInvStrategyIds:synInvStrategyIds,
          goodsId:goodsId
        };
        console.log(data);
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/choiceStrategy',data).then(function (res) {
          if(res.data.success) {
            this.choseDialogVisible = false;
            this.initMessage1()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //选择策略确认按钮
      choseWaveOk: function () {
        if(this.chooseWaveRow != null) {
          this.initChoiceStrategy();
        }else {
          this.$alert('请选择策略！',{
            type: 'info',
            center: true,
            confirmButtonText: '知道了',
          });
        }
      },

      handleSelectionChange1: function (val) {
        this.multipleSelection1 = val
      },

      //修改策略
      handleEditClick: function (row) {
        let id = row.goodsId;
//        this.$router.push('/goodsEditStrategy/' + id)

        //给子级传参并显示子级
        this.paramsObj = {
          goodsId: row.goodsId,
          childrenShow: 1,
          mainPageShow: false
        }
      },

      //选择策略
      choseWaveClick: function () {
        if(this.multipleSelection1.length != 0) {
          this.strategyName = '';
          this.choseDialogVisible = true;
          this.initMessage2()
        }else {
          this.$alert("请至少选择一条商品！", {
            type: 'info',
            center: true,
            confirmButtonText: '确定'
          });
        }
      },

      handleCurrentChange2(val) {
        this.chooseWaveRow = val
      },

      //策略设置
      waveSetupClick: function () {
//        this.$router.push('/waveSetup')

        //给子级传参并显示子级
        this.paramsObj = {
          childrenShow: 2,
          mainPageShow: false
        }
      },

      //查看日志
      publicLogBtn: function () {
        this.pulicLogVisible = true;
        this.paramObj.moduleId= 53;//单据类型
        this.paramObj.billCode='';//操作项id
        this.paramObj.typeId='';//操作类型
      },

      //关闭日志弹窗
      changDialogShow(){
        this.pulicLogVisible=false;
      },

      //1、以下是同步库存分页
      getPageSize1: function (val) {
        if(val != undefined) {

          //变换每页数量刷新数据
          this.pageSize1 = val;
          this.initMessage1();
        }
      },
      getCurPage1: function (val) {
        if(val != undefined) {

          //变换当前页刷新数据
          this.curPage1 = val;
          this.initMessage1()
        }
      },

      //2、以下是选择策略分页
      getPageSize2: function (val) {
        if(val != undefined) {

          //变换每页数量刷新数据
          this.pageSize2 = val;
          this.initMessage2();
        }
      },
      getCurPage2: function (val) {
        if(val != undefined) {

          //变换当前页刷新数据
          this.curPage2 = val;
          this.initMessage2()
        }
      },

      //3、以下是查看日志分页
      getPageSize3: function (val) {
        if(val != undefined) {

          //变换每页数量刷新数据
          this.pageSize3 = val;
//          this.initMessage3();

        }
      },
      getCurPage3: function (val) {
        if(val != undefined) {

          //变换当前页刷新数据
          this.curPage3 = val;
//          this.initMessage3()
        }
      }
    }
  }
</script>
<style scoped>
  #asStock .grid-content>label {
    width: 84px!important;
  }
  @media screen and (max-width:1461px){
    #asStock .grid-content>.el-input,#asStock .grid-content .el-select{
      width: 61%!important;
    }
  }

</style>
<style>
  #dialogBox .el-dialog__body {
    padding: 35px 30px !important;
  }
  #asStock .el-pager li:hover {
    color: #409EFF!important;
    background-color: transparent!important;
  }
</style>
