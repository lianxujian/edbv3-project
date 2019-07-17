<!--策略设置 尘音-->
<template>
  <div>

    <!--主页-->
    <div v-show="paramsObj.mainPageShow" id="waveSetup">
      <!--导航-->
      <div class="pTop">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><a @click="showParentBlock">同步库存策略</a></el-breadcrumb-item>
          <el-breadcrumb-item>策略设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!--搜索区-->
      <div id="searchBox" style="margin-top:20px">
        <div class="leftBox2">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="name">策略名称：</label>
                <el-input @keyup.enter.native="search" maxlength="100" id="name" v-model="strategyName"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="example-post">生效店铺：</label>
                <select id="example-post" name="multiselect[]" multiple="multiple">
                  <option  v-for="item in optionsShop" :value="item.value">{{item.label}}</option>
                </select>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="isPreSale">启用状态：</label>
                <el-select id="isPreSale" v-model="enabledFlag" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsIsPreSale"
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
          <!--添加策略-->
          <li @click="addStrategyClick"><span>添加策略</span></li>
          <!--查看日志-->
          <li @click="publicLogBtn"><span>查看日志</span></li>
          <publicLogDialog
            @changShow="changDialogShow"
            :paramObj="paramObj"
            :pulicLogVisible="pulicLogVisible">
          </publicLogDialog>
        </ul>
      </div>
      <!--表格1-->
      <div class="pDown">
        <el-table id="tableH" :data="tableData1" border :max-height="table_h" style="width: 100%">
          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

          <el-table-column label="策略名称">
            <template slot-scope="scope">
              <a @click="strategyClick(scope.row)" href="javascript:">{{ scope.row.strategyName }}</a>
            </template>
          </el-table-column>

          <el-table-column label="策略生效店铺" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.storeName }}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="启用状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enabledFlag" @click.native="switchChange(scope.row)"></el-switch>
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

          <el-table-column label="操作" width="177" align="center">
            <template slot-scope="scope">
              <el-button  @click="handleModifyClick(scope.row)" type="text" size="small">修改</el-button>
              <el-button  @click="handleDelClick(scope.row)" ref="del" type="text" size="small" style="color: red">删除</el-button>
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

    <!--添加策略-->
    <addStrategy
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 1"
      :params="paramsObj"
      @changeShow="changeShow"
      @backFarther="backFarther">
    </addStrategy>

    <!--修改策略-->
    <editStrategy
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 2"
      :params="paramsObj"
      @changeShow="changeShow"
      @backFarther="backFarther">
    </editStrategy>

    <!--策略详情-->
    <strategyDetail
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 3"
      :params="paramsObj"
      @changeShow="changeShow"
      @backFarther="backFarther">
    </strategyDetail>
  </div>
</template>
<script>

  import pagination from '@/components/common/Pagination.vue'
  import publicLogDialog from '@/components/common/publicLogDialog.vue'
  import addStrategy from '@/components/views/commodity/children/children/AddStrategy.vue'
  import editStrategy from '@/components/views/commodity/children/children/EditStrategy.vue'
  import strategyDetail from '@/components/views/commodity/children/children/StrategyDetail.vue'
  export default {
    props: {
      params: Object //接收父级参数
    },
    components:{
      pagination,publicLogDialog,addStrategy,editStrategy,strategyDetail
    },
    data() {
      return {
        version: '1.0.0',//版本号
        checkDialogVisible:false,//查看日志弹框显示隐藏

        strategyName: '',//策略名称
        optionsShop: [],//生效店铺下拉
//        storeId: [],//生效店铺

        optionsShop1: [],//生效店铺下拉

        optionsIsPreSale: [//启用状态下拉
          {
            value: '',
            label: '全部'
          },
          {
            value: 'true',
            label: '启用'
          },
          {
            value: 'false',
            label: '停用'
          }
        ],
        enabledFlag: '',//启用状态

        table_h: 0,//表格高度
        tableData1: [],//表格数据
        total1: 0, //总页数
        pageSize1: 15, //每页数量
        curPage1: 1, //当前页数

        tableData2: [],//日志表格数据
        total2: 100, //总页数
        pageSize2: 15, //每页数量
        curPage2: 1, //当前页数

        pulicLogVisible:false,//查看日志弹框显示隐藏
        paramObj:{},//日志参数对象

        paramsObj: {
          mainPageShow: true
        }//子级传参
      }
    },
    mounted() {

      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });

      this.initMessage1();//初始化表格策略设置表格数据
      this.initList();//初始化店铺数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods:{

      //子集传参，返回上一级
      backFarther(val) {
        if(val) {
          this.showParentBlock()
        }
      },

      //子级传参通知父级刷新表格数据
      changeShow(val) {
        if(val.isRefresh){
          this.initMessage1();
        }
        this.paramsObj.mainPageShow = true;
      },

      //返回父级
      showParentBlock() {
        this.$emit('changeShow',true)
      },

      //重置
      reset: function () {

        $('#example-post').multiselect('dataprovider', this.optionsShop);

        this.strategyName = '';
//        this.storeId = [];
        this.enabledFlag = ''
      },

      //查询
      search: function () {
        this.initMessage1();
      },

      //初始化同步库存表格数据
      initMessage1: function () {
        let str = '';
        if($('#example-post').val().length == this.optionsShop.length) {
          str = ''
        }else {
          str = $('#example-post').val().toString()
        }

        let data = {
          strategyName: this.strategyName,
          storeId: str,
          enabledFlag: this.enabledFlag,
          page: this.curPage1,
          size: this.pageSize1
        };
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/queryStrategy',data).then(function (res) {
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

      //店铺接口
      initList: function () {
        this.optionsShop = [];
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/listOauth').then(function (res) {
          console.log(res.data.result);
          if(res.data.success) {
            let arr = res.data.result;
            let value = [];
            arr.forEach(function (val) {
              this.optionsShop.push({value: val.storeId,label: val.storeName});
              value.push(val.storeId)

            }.bind(this));
            $('#example-post').multiselect('dataprovider', this.optionsShop );
//            $('#example-post').multiselect('select',value);
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //启用状态接口
      initSwitchChange: function (row) {
        let data = {
          synInvStrategyId: row.synInvStrategyId,
          flag: row.enabledFlag
        };
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/updateSync',data).then(function (res) {
          if(res.data.success) {
            this.initMessage1()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //删除策略接口
      initDelete: function (row) {
        let data = {
          synInvStrategyId: row.synInvStrategyId
        };
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/detete',data).then(function (res) {
          if(res.data.success) {
            this.initMessage1()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //点击修改
      handleModifyClick: function (row) {
//        this.$router.push('/editStrategy/' + row.synInvStrategyId)
        this.paramsObj = {
          synInvStrategyId: row.synInvStrategyId,
          childrenShow: 2,
          mainPageShow: false
        }

      },

      //启用状态点击
      switchChange: function (row) {
        this.initSwitchChange(row)
      },

      //策略名称点击
      strategyClick: function (row) {
//        let id = row.synInvStrategyId;
//        this.$router.push('/strategyDetail/' + id)
        this.paramsObj = {
          synInvStrategyId: row.synInvStrategyId,
          childrenShow: 3,
          mainPageShow: false
        }
      },

      //点击删除
      handleDelClick: function (row) {
        this.$confirm('确认要删除此策咯?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
        }).then(() => {
          this.initDelete(row);
          this.$alert("删除成功!", {
            type: 'success',
            center: true,
            confirmButtonText: '知道了'
          })
        }).catch(() => {});
      },

      //添加策略
      addStrategyClick: function () {
//        this.$router.push('/addStrategy')
        this.paramsObj = {
          childrenShow: 1,
          mainPageShow: false
        }
      },

      //查看日志
      publicLogBtn: function () {
        this.pulicLogVisible = true;
        this.paramObj.moduleId= 54;//单据类型
        this.paramObj.billCode='';//操作项id
        this.paramObj.typeId='';//操作类型
      },

      //关闭日志弹窗
      changDialogShow(){
        this.pulicLogVisible=false;
      },

      //1、以下是策略设置分页
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

      //2、以下是查看日志分页
      getPageSize2: function (val) {
        if(val != undefined) {

          //变换每页数量刷新数据
          this.pageSize2 = val;
//          this.initMessage2();
        }
      },
      getCurPage2: function (val) {
        if(val != undefined) {

          //变换当前页刷新数据
          this.curPage2 = val;
//          this.initMessage2()
        }
      },
    }
  }
</script>
<style>
  #waveSetup .el-pager li:hover {
    color: #409EFF!important;
    background-color: transparent!important;
  }
</style>
