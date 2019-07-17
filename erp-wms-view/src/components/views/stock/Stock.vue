<!--库存查询 尘音-->
<template>
  <div>
    <div v-show="paramsObj.mainPageShow" id="stock">
      <!--搜索区-->
      <div id="searchBox">
        <div class="leftBox2">
          <el-row>
            <!--<el-col :span="6">-->
              <!--<div class="grid-content">-->
                <!--<label for="example-post">仓库：</label>-->
                <!--<select id="example-post" name="multiselect[]" multiple="multiple">-->
                  <!--<option v-for="item in optionsStock" :value="item.value">{{item.label}}</option>-->
                <!--</select>-->
              <!--</div>-->
            <!--</el-col>-->

            <el-col :span="6">
              <div class="grid-content">
                <label for="barCode">条形码：</label>
                <el-input @keyup.enter.native="search" maxlength="50" id="barCode" v-model="barCode"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="goodsName">商品名称：</label>
                <el-input @keyup.enter.native="search" maxlength="100" id="goodsName" v-model="goodsName"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="isSuit">是否套装：</label>
                <el-select id="isSuit" v-model="suitFlag" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsSuit"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>

            <!--宝洁新增-->
            <el-col :span="6">
              <div class="grid-content">
                <el-select style="width: 95px!important;" v-model="invtype" filterable>
                  <el-option label="现货库存" :value="1001"></el-option>
                  <el-option label="预售库存" :value="1002"></el-option>
                  <el-option label="台账余量" :value="1003"></el-option>
                  <el-option v-if="accountCamponFlag" label="台账预占" :value="1004"></el-option>
                  <el-option label="实物库存" :value="1005"></el-option>
                </el-select>
                <el-input @keyup.enter.native="search" @keyup.native="startInv = startInv.replace(/[^\d\-]/g,'')" style="width: 26%!important;" maxlength="10" v-model="startInv"></el-input>
                -
                <el-input @keyup.enter.native="search" @keyup.native="endInv = endInv.replace(/[^\d\-]/g,'')" style="width: 26%!important;" maxlength="10" v-model="endInv"></el-input>
              </div>
            </el-col>

            <!--宝洁新增 品牌-->
            <el-col :span="6">
              <div class="grid-content">
                <label>品牌：</label>
                <multiple-select
                  style="width: 65%"
                  :selectArr="optionsBrand"
                  :valueArr="brandVal"
                  @multipleChange="multipleChange">
                </multiple-select>
              </div>
            </el-col>

            <!--宝洁新增 分类-->
            <el-col :span="6">
              <div class="grid-content">
                <label for="choseClass">分类：</label>
                <!--<el-select id="choseClass" v-model="choseClass" filterable placeholder="全部">-->
                  <!--<el-option-->
                    <!--v-for="(item,index) in optionsChoseClass"-->
                    <!--:key="index"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                  <!--</el-option>-->
                <!--</el-select>-->
                <el-cascader
                  style="width:65%;line-height: 28px;"
                  clearable filterable
                  v-model="choseClass"
                  placeholder="请选择"
                  :options="optionsChoseClass"
                  :props="catalogIdProps"
                  :show-all-levels="false">
                </el-cascader>
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
          <li @click="outList"><span>导出</span></li>
        </ul>
      </div>

      <!--ag-grid表格①-->
      <ag-grid-vue :style='{"height":table_h+"px","width": "100%"}'
                   class="ag-theme-balham ag-table"
                   :gridOptions="gridOptions"
                   :columnDefs="columnDefs"
                   :rowData="tableData"
                   :pinnedBottomRowData="pinnedBottomRowData"
                   :enableFilter="true"
                   :enableSorting="true"
                   :enableColResize="true"
                   :components="components"
                   :gridReady="onGridReady">
      </ag-grid-vue>
      <!--分页-->
      <div class="pagination">
        <pagination
          :totalCom="total"
          :pageSizeCom="pageSize"
          :curPageCom="curPage"
          @pageSizeVal="getPageSize" @curPageVal="getCurPage">
        </pagination>
      </div>
      <!--表格-->
      <div ref="tabOne" class="pDown" v-if="false">
        <el-table id="tableH" :data="tableData" border :max-height="table_h" style="width: 100%">
          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

          <el-table-column label="条形码" width="120">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.barCode }}</p>
            </template>
          </el-table-column>

          <el-table-column label="商品名称" width="200">
            <template slot-scope="scope">
              <p class="initP-g">{{ scope.row.goodsName }}</p>
            </template>
          </el-table-column>

          <!--宝洁新增 品牌-->
          <el-table-column label="品牌" align="center">
            <template slot-scope="scope">
              <p class="initP-g">{{ scope.row.brandName }}</p>
            </template>
          </el-table-column>

          <!--宝洁新增 分类-->
          <el-table-column label="分类" align="center">
            <template slot-scope="scope">
              <p class="initP-g">{{ scope.row.catalogName }}</p>
            </template>
          </el-table-column>

          <el-table-column label="是否套装" width="100">
            <template slot-scope="scope">
              <p class="cen-g" v-if="scope.row.suitFlag == false">否</p>
              <p class="cen-g" v-if="scope.row.suitFlag == true">是</p>
            </template>
          </el-table-column>

          <el-table-column label="可售库存">
            <el-table-column label="现货库存" align="right">
              <template slot-scope="scope">
                {{ scope.row.goodsSalesInv }}
              </template>
            </el-table-column>
            <el-table-column label="预售库存" align="right">
              <template slot-scope="scope">
                {{ scope.row.goodsPresellInv }}
              </template>
            </el-table-column>
          </el-table-column>

          <!--<el-table-column label="预售库存">-->
          <!--<template slot-scope="scope">-->
          <!--<p class="cen-g">{{ scope.row.preSaleInv }}</p>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <!--宝洁新增-->
          <el-table-column label="单品组套最大可售" align="right">
            <template slot-scope="scope">
              <span v-if="scope.row.suitMaxSales != undefined">{{ scope.row.suitMaxSales }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <!--台账余量-->
          <el-table-column align="right" min-width="100">
            <template slot="header" slot-scope="slot">
              <div>
                <span>台账余量</span>
                <el-tooltip effect="dark" content="仓库可用于发货的实物库存" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.accountSurplusInv == undefined">-</span>
              <span v-else>{{ scope.row.accountSurplusInv }}</span>
            </template>
          </el-table-column>

          <!--<el-table-column label="台账库存">-->
          <!--<template slot-scope="scope">-->
          <!--<p class="cen-g">{{ scope.row.accountInv }}</p>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column label="台账预占" align="right">
            <template slot-scope="scope">
              <a @click="campon(scope.row,'1001')" v-if="scope.row.accountCamponInv != 0" href="javascript:">{{ scope.row.accountCamponInv }}</a>
              <span v-if="scope.row.accountCamponInv == 0">0</span>
              <span v-if="scope.row.accountCamponInv == undefined">-</span>
            </template>
          </el-table-column>

          <!--<el-table-column label="可配货库存">-->
          <!--<template slot-scope="scope">-->
          <!--<p class="cen-g">{{ scope.row.dstInv }}</p>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <!--<el-table-column label="可配货预占">-->
          <!--<template slot-scope="scope">-->
          <!--<p class="cen-g">-->
          <!--<a @click="campon(scope.row,'1002')" v-show="scope.row.dstCamponInv != 0" href="javascript:">{{ scope.row.dstCamponInv }}</a>-->
          <!--<span v-show="scope.row.dstCamponInv == 0">0</span>-->
          <!--</p>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <!--<el-table-column label="上架预占">-->
          <!--<template slot-scope="scope">-->
          <!--<p class="cen-g">-->
          <!--<a @click="campon(scope.row,'1003')" v-show="scope.row.putawayCamponInv != 0" href="javascript:">{{ scope.row.putawayCamponInv }}</a>-->
          <!--<span v-show="scope.row.putawayCamponInv == 0">0</span>-->
          <!--</p>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <!--宝洁新增-->
          <el-table-column label="单品组套最大台账" align="right">
            <template slot-scope="scope">
              <span v-if="scope.row.suitMaxAccount != undefined">{{ scope.row.suitMaxAccount }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column label="实物库存" align="right">
            <template slot-scope="scope">
              <span v-if="scope.row.goodsInv == undefined">-</span>
              <span v-else>{{ scope.row.goodsInv }}</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text">分仓库存</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>
    <bill
      v-if="!paramsObj.mainPageShow"
      :params="paramsObj"
      @changeShow="changeShow">
    </bill>

    <!--分仓库存弹窗-->
    <el-dialog v-dialogDrag
      id="dialogBox"
      center
      title="分仓库存"
      :visible.sync="dialogVisible"
      width="1100px">
      <el-table :data="tableDataDialog" border height="500" style="width: 100%;">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

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

        <el-table-column label="现货可售" width="80" align="right">
          <template slot-scope="scope">
            <p class="initP-g">{{ scope.row.nowSaleInv }}</p>
          </template>
        </el-table-column>

        <!--台账余量-->
        <el-table-column align="right" min-width="100">
          <template slot="header" slot-scope="slot">
            <div>
              <span>台账余量</span>
              <el-tooltip effect="dark" content="仓库可用于发货的实物库存" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </template>
          <template slot-scope="scope">
            {{ scope.row.accountSurplusInv }}
          </template>
        </el-table-column>

        <!--宝洁新增-->
        <el-table-column label="单品组套最大台账" align="right" v-if="isShow">
          <template slot-scope="scope">
            <span v-if="scope.row.suitMaxAccount != undefined">{{ scope.row.suitMaxAccount }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!--可配货余量-->
        <el-table-column align="right" min-width="100">
          <template slot="header" slot-scope="slot">
            <div>
              <span>可配货余量</span>
              <el-tooltip effect="dark" content="仓库库位库存总量（包括次品）" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </template>
          <template slot-scope="scope">
            {{ scope.row.dstSurplusInv }}
          </template>
        </el-table-column>

        <el-table-column label="实物库存">
          <el-table-column label="正品库存" align="right">
            <template slot-scope="scope">
              {{ scope.row.goodsNormalInv }}
            </template>
          </el-table-column>
          <el-table-column label="次品库存" align="right">
            <template slot-scope="scope">
              {{ scope.row.goodsDefectiveInv }}
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="仓库">
          <template slot-scope="scope">
            {{ scope.row.storageName }}
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue';//分页组件
  import bill from '@/components/views/stock/children/Bill.vue'//子级路由组件
  import {AgGridVue} from "ag-grid-vue";//ag-grid组件②

  export default {
    components: {
      pagination,
      bill,
      'ag-grid-vue': AgGridVue,//ag-grid定义组件③

      //1、渲染序号
//      getRenderer1: {
//        template: '<span>{{params.node.rowIndex + 1}}</span>',
//      },

      //2、渲染是否套装
      getRenderer2: {
        template: `<div><span v-if="params.data.suitFlag">是</span>
                   <span v-if="params.data.suitFlag == false">否</span>
                   <span v-if="params.data.suitFlag == undefined"></span></div>`,
      },

      //3、渲染单品组套最大可售
      getRenderer3: {
        template: `<div><span v-if="params.data.suitMaxSales != undefined">{{ params.data.suitMaxSales }}</span>
                   <span v-else>-</span></div>`
      },

      //3_1、渲染台账余量
      getRenderer3_1: {
        template: `<div><span v-if="params.data.accountSurplusInv == undefined">-</span>
                   <span v-else>{{ params.data.accountSurplusInv }}</span></div>`
      },

      //4、渲染台账预占
      getRenderer4: {
        template: `<div><a @click="campon(params.data,'1001')" v-if="params.data.accountCamponInv != 0 && params.data.isLink == undefined" style="color: blue">{{ params.data.accountCamponInv }}</a>
                   <span v-if="params.data.accountCamponInv == 0 && params.data.isLink == undefined">0</span>
                   <span v-if="params.data.isLink == 1">{{ params.data.accountCamponInv }}</span>
                   <span v-if="params.data.accountCamponInv == undefined">-</span></div>`,
        methods: {

          //预占
          campon: function (row,type) {
            let _this = this.params.context;
            let obj = {
              goodsId: row.goodsId,
              barCode: row.barCode,
              goodsName: row.goodsName,
              storageId: '',
              camponType: type
            };

            //给子级传参并显示子级
            _this.paramsObj = {
              id: obj,
              num: 1,
              mainPageShow: false
            }
          },
        }
      },

      //5、渲染单品组套最大台账
      getRenderer5: {
        template: `<div><span v-if="params.data.suitMaxAccount != undefined">{{ params.data.suitMaxAccount }}</span>
                   <span v-else>-</span></div>`
      },

      //6、渲染实物库存
      getRenderer6: {
        template: `<span v-if="params.data.goodsInv == undefined">-</span>
                   <span v-else>{{ params.data.goodsInv }}</span>`
      },

      //7、渲染操作列
      getRenderer7: {
        template: `<el-button v-if="params.data.isShow == undefined" @click="handleClick(params.data)" type="text">分仓库存</el-button>`,
        methods: {

          //分仓库存
          handleClick: function (row) {
            let _this = this.params.context;
            _this.dialogVisible = true;
            _this.initBranchStorage(row)
          },
        }
      }

    },
    data() {
      return {
        version:'1.0.0',//接口版本号
        optionsStock:[],//仓库下拉
        //storageId: [],//仓库
        barCode: '',//条形码
        goodsName:'',//商品名称
        pinnedBottomRowData: null,//ag-grid固定列数据
        //ag-grid属性定义④
        gridOptions: {
          //国际化（设置显示文字）
          context: this,
          enableColResize: true,//可拖动改变列宽度
          suppressExcelExport:true,//关闭excel导出
          suppressCsvExport:true,//关闭csv导出
          /*rowHeight:50,*/
          enableRangeSelection:true,//可复制多行多单元格
          suppressCopyRowsToClipboard:true,//当启用行单击选择和范围选择时，如果您希望让范围优先，则快捷方式将复制所选行而不是所选范围
          suppressRowClickSelection: true,//阻止单击行选中本行
          enableSorting:true,
          enableBrowserTooltips:true,
          localeText:{
            noRowsToShow:'暂无数据',
            pinColumn:"固定列",
            pinLeft:'居左',
            pinRight:'居右',
            noPin:'默认',
            autosizeThiscolumn:'自适应当前列',
            autosizeAllColumns:'自适应所有列',
            resetColumns:'重置列',
            toolPanel:'工具板',
            blanks:'空白',
            selectAll:'全选',
            searchOoo:'搜索',
            filterOoo:'筛选',
            columns:'自定义显示列',
            groups:'行组',
            rowGroupColumnsEmptyMessage:'拖动此处以设置行组'
          }
        },//ag-grid表格初始化配置
        components: null,//ag-grid自定义列
        columnDefs: null,//ag-grid列标题设置
        tableData: null,//ag-grid表格数据属性
        table_h: 0,//ag-grid表格高度
        //ag-grid企业扩展
        gridApi: null,
        columnApi: null,

        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        optionsSuit: [ //套装下拉
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '否'
          }, {
            value: '1',
            label: '是'
          }
        ],
        suitFlag: '',//是否套装

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

        dialogVisible: false,//分仓库存弹窗控制
        tableDataDialog: [],//弹框表格数据

        isShow: false,//分仓库存弹框是否展示最大台账
        clickLimit: 1,//点击限制

        //宝洁新增品牌
        optionsBrand: [],//品牌下拉列表
        brandVal: [],//品牌已选
        brandList: [],//所有品牌id

        //宝洁新增分类
        optionsChoseClass: [],//分类下拉
        choseClass: [''],//已选分类
        catalogIdProps:{
          label: 'privilegeName',
          value:'catalogId',
          children: 'nodes'
        },//分级对应关系
        accountCamponFlag:false,//台账预占是否开启
      }
    },

    beforeMount() {

      //ag-grid获取表格数据⑤
      this.initBrandList();//初始化品牌下拉

    },

    mounted(){

      //改变滚动条样式
      $('#example-post').multiselect({
        onInitialized: function(select, container) {

          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });

      this.initatalogList();//初始化分类下拉
      this.initStock();//初始化仓库下拉
      this.accountCamponFn();//判断台账预占是否开启

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('.ag-table').offset().top - 85);
        console.log(this.table_h)
      });
    },

    methods:{

      //判断台账预占是否开启
      accountCamponFn(){
        this._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + this.version + '/query').then(response => {
          if (response.data.success) {
            this.accountCamponFlag = response.data.result.accountCamponFlag;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },

      //ag-grid表格初始化⑥
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

      },

      //子级传参通知父级刷新表格数据
      changeShow(val){
        if(val){
          this.initMessage();
        }
        this.paramsObj.mainPageShow = true;
      },

      //重置
      reset: function () {
        $('#example-post').multiselect('dataprovider', this.optionsStock);
        this.barCode = '';
        this.goodsName = '';
        this.suitFlag = '';
        this.startInv = '';
        this.endInv = '';
        this.invtype = 1001
      },

      //查询
      search: function () {
        if(parseInt(this.endInv) >= parseInt(this.startInv) || this.endInv == '' || this.startInv == '' || this.endInv == '-' || this.startInv == '-') {
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

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth').then(function (res) {
          if(res.data.success) {
            let arr = res.data.result;
            let value = [];
            if(arr != undefined) {
              arr.forEach(function (val) {
                this.optionsStock.push({value: val.storageId,label: val.storageName});
                value.push(val.storageId)
              }.bind(this));
            }

            $('#example-post').multiselect('dataprovider', this.optionsStock);
            $('#example-post').multiselect('select',value);
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this));
      },

      //品牌列表接口
      initBrandList: function () {
        this._post('com.edb01.erp.mdata.service.api.BrandService/' + this.version + '/list').then(function (res) {
          console.log(res);
          if(res.data.success) {
            let arr = res.data.result;
            let brr = [];
            arr.forEach(function (val) {

              this.optionsBrand.push({value: val.brandId,label: val.brandName});
              brr.push(val.brandId)
            }.bind(this));

            this.optionsBrand.unshift({value: 'DongPing',label: '(无数据)'});

            this.brandVal = brr;
            this.brandList = brr;
            this.brandVal.unshift('DongPing');

            this.initMessage();//初始化表格数据
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //分类列表接口
      initatalogList: function () {
//        this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/listTail').then(function (res) {
//          console.log(res);
//          if(res.data.success) {
//            let arr = res.data.result;
//            arr.forEach(function (val) {
//              this.optionsChoseClass.push({value: val.catalogId,label: val.catalogName})
//            }.bind(this));
//          }else {
//            this.$message({
//              message: res.data.msg,
//              type: 'warning'
//            });
//          }
//        }.bind(this))
        this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/listTree').then(response => {
          if (response.data.success) {
            response.data.result = response.data.result?response.data.result:[];
            response.data.result.unshift({
              privilegeName:'（无数据）',
              catalogId:'DongPing'
            });
            response.data.result.unshift({
              privilegeName:'全部',
              catalogId:''
            });
            this.optionsChoseClass = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },

      //所选品牌
      multipleChange(value) {
        this.brandVal = value;
        console.log(value)
      },

      //导出
      outList: function () {
        if(this.clickLimit == 1) {
          this.initOutList()
        }
      },

      //导出接口
      initOutList: function () {
        this.clickLimit = 2;
        let brandIdListStr = '';
        if(this.brandVal == '') {
          brandIdListStr = this.brandList.toString();
        }else {
          brandIdListStr = this.brandVal.toString()
        }
        let startInv = '';
        let endInv = '';
        if(this.startInv == '-') {
          startInv = ''
        }else {
          startInv = this.startInv
        }

        if(this.endInv == '-') {
          endInv = ''
        }else {
          endInv = this.endInv
        }

        let data = {
          "barCode": this.barCode,
          "goodsName": this.goodsName,
          "suitFlag": this.suitFlag,
          invtype: this.invtype,
          startInv: startInv,
          endInv: endInv,
          "page": this.curPage,
          "size": this.pageSize,
//          "storageIdListStr": $('#example-post').val().toString(),
          brandIdListStr: brandIdListStr,
          catalogId: this.choseClass

        };
        this._post('com.edb01.erp.wms.service.api.WmMerchantInvService/' + this.version + '/exportMerchantInv',data).then(function (res) {
          this.clickLimit = 1;
          if(res.data.success) {
            location.href = 'http://'+process.env.FILE_API+'/files-web/download/' + res.data.result
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))

      },

      //初始化表格数据
      initMessage: function () {
        let brandIdListStr = '';
        if(this.brandVal == '') {
          brandIdListStr = this.brandList.toString();
        }else {
          brandIdListStr = this.brandVal.toString()
        }
        let startInv = '';
        let endInv = '';
        if(this.startInv == '-') {
          startInv = ''
        }else {
          startInv = this.startInv
        }

        if(this.endInv == '-') {
          endInv = ''
        }else {
          endInv = this.endInv
        }

        let data = {
          "barCode": this.barCode,
          "goodsName": this.goodsName,
          "suitFlag": this.suitFlag,
          invtype: this.invtype,
          startInv: startInv,
          endInv: endInv,
          "page": this.curPage,
          "size": this.pageSize,
//          "storageIdListStr": $('#example-post').val().toString(),
          brandIdListStr: brandIdListStr,
          catalogId: this.choseClass[this.choseClass.length - 1]

        };

        this._post('com.edb01.erp.wms.service.api.WmMerchantInvService/' + this.version + '/queryPager',data).then(function (res) {
          console.log(res.data.result);

          if(res.data.success) {
            let goodsSalesInv = 0,
                goodsPresellInv = 0,
                suitMaxSales = 0,
                accountSurplusInv = 0,
                accountCamponInv = 0,
                suitMaxAccount = 0,
                goodsInv = 0;
            if(res.data.result.rows) {
              res.data.result.rows.forEach((item,index) => {
                item.index = index + 1;
                if(item.goodsSalesInv != undefined) {
                  goodsSalesInv += item.goodsSalesInv*1;
                }
                if(item.goodsPresellInv != undefined) {
                  goodsPresellInv += item.goodsPresellInv*1;
                }
                if(item.suitMaxSales != undefined) {
                  suitMaxSales += item.suitMaxSales*1;
                }
                if(item.accountSurplusInv != undefined) {
                  accountSurplusInv += item.accountSurplusInv*1;
                }
                if(item.accountCamponInv != undefined) {
                  accountCamponInv += item.accountCamponInv*1;
                }
                if(item.suitMaxAccount != undefined) {
                  suitMaxAccount += item.suitMaxAccount*1;
                }
                if(item.goodsInv != undefined) {
                  goodsInv += item.goodsInv*1
                }
              })
            }
            this.tableData = res.data.result.rows;
            this.total = res.data.result.total;
            this.pinnedBottomRowData = [{index: '合计',isShow: 1,isLink: 1,
              goodsSalesInv: goodsSalesInv,
              goodsPresellInv : goodsPresellInv,
              suitMaxSales: suitMaxSales,
              accountSurplusInv: accountSurplusInv,
              accountCamponInv: accountCamponInv,
              suitMaxAccount: suitMaxAccount,
              goodsInv: goodsInv}];

            //宝洁新增显示隐藏列
            if(res.data.result.rows[0].openManSuitSales) {
              this.isShow = false;

              //ag-grid列标题设置⑦
              this.columnDefs = [
                {headerName: '序号', width: 100,field: 'index'},
                {headerName: '条形码', width: 120,field: 'barCode'},
                {headerName: '商品名称', width: 200,field: 'goodsName'},
                {headerName: '品牌',width: 100, field: 'brandName'},
                {headerName: '分类',width: 100,field: 'catalogName'},
                {headerName: '是否套装', width: 100,field: 'suitFlag',cellRendererFramework: "getRenderer2"},
                {headerName: '现货库存(可售)',width: 120, field: 'goodsSalesInv'},
                {headerName: '预售库存(可售)',width: 120, field: 'goodsPresellInv'},
//                {headerName: '单品组套最大可售',width: 150,field: 'suitMaxSales', cellRendererFramework: "getRenderer3"},
                {headerName: '台账余量', width: 100,field: 'accountSurplusInv',cellRendererFramework: "getRenderer3_1",headerComponentParams: {
                  template:
                  '<div class="ag-cell-label-container" role="presentation">' +
                  '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                  '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                  '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                  '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                  '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                  '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                  '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span><i class="el-icon-question" style="line-height:33px;" title="仓库可用于发货的实物库存"></i>' +
                  '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                  '  </div>' +
                  '</div>'
                }},
                {headerName: '台账预占',width: 100,field: 'accountCamponInv', cellRendererFramework: "getRenderer4"},
//                {headerName: '单品组套最大台账',width: 150,field: 'suitMaxAccount', cellRendererFramework: "getRenderer5"},
                {headerName: '实物库存',width: 100,field: 'goodsInv',cellRendererFramework: "getRenderer6"},
                {headerName: '操作', width: 100,cellRendererFramework: "getRenderer7"}
              ];
            }else {
              this.isShow = true;

              //列标题设置
              this.columnDefs = [
                {headerName: '序号', width: 100,field: 'index'},
                {headerName: '条形码', width: 120,field: 'barCode'},
                {headerName: '商品名称', width: 200,field: 'goodsName'},
                {headerName: '品牌',width: 100, field: 'brandName'},
                {headerName: '分类',width: 100,field: 'catalogName'},
                {headerName: '是否套装', width: 100,field: 'suitFlag',cellRendererFramework: "getRenderer2"},
                {headerName: '现货库存(可售)',width: 120, field: 'goodsSalesInv'},
                {headerName: '预售库存(可售)',width: 120, field: 'goodsPresellInv'},
                {headerName: '单品组套最大可售',width: 150,field: 'suitMaxSales', cellRendererFramework: "getRenderer3"},
                {headerName: '台账余量', width: 100,field: 'accountSurplusInv',cellRendererFramework: "getRenderer3_1",headerComponentParams: {
                  template:
                  '<div class="ag-cell-label-container" role="presentation">' +
                  '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
                  '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                  '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
                  '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
                  '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
                  '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
                  '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span><i class="el-icon-question" style="line-height:33px;" title="仓库可用于发货的实物库存"></i>' +
                  '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
                  '  </div>' +
                  '</div>'
                }},
                {headerName: '台账预占',width: 100,field: 'accountCamponInv', cellRendererFramework: "getRenderer4"},
                {headerName: '单品组套最大台账',width: 150,field: 'suitMaxAccount', cellRendererFramework: "getRenderer5"},
                {headerName: '实物库存',width: 100,field: 'goodsInv',cellRendererFramework: "getRenderer6"},
                {headerName: '操作', width: 100,cellRendererFramework: "getRenderer7"}
              ];
            }

            for(var i=0;i<this.columnDefs.length-1;i++){
              if(this.columnDefs[i].headerName == '台账预占')break;
            }
            if(!this.accountCamponFlag){
              this.columnDefs.splice(i,1);
            }
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //台账余量
      renderHeader(h, data) {
        return h("div", [
          h("span", ['台账余量 ']),
          h("el-tooltip", {
            attrs: {
              effect: "dark",
              content: "仓库可用于发货的实物库存",
              placement: "top"
            }
          }, [h("i",{'class': 'el-icon-question table-msg'})])
        ])
      },

      //可配货余量
      renderHeader1(h, data) {
        return h("div", [
          h("span", ['可配货余量 ']),
          h("el-tooltip", {
            attrs: {
              effect: "dark",
              content: "仓库库位库存总量（包括次品）",
              placement: "top"
            }
          }, [h("i",{'class': 'el-icon-question table-msg'})])
        ])
      },

      //分仓库存接口
      initBranchStorage: function (row) {
        let data = {
          barCode: row.barCode,
          goodsName: row.goodsName,
          suitFlag: row.suitFlag,
          goodsId: row.goodsId
        };
        let url = '';
        if(row.suitFlag) {
          url = '/queryBranchStorageSuitList'
        }else {
          url = '/queryBranchStorageList'
        }
        this._post('com.edb01.erp.wms.service.api.WmStorageInvService/' + this.version + url,data).then(function (res) {
          if(res.data.success) {
            this.tableDataDialog = res.data.result
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }.bind(this))
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
  .pDown a{
    color: blue;
    text-decoration: underline;
  }
  #stock{
    margin-bottom: 50px;
  }
</style>
<style>

  #dialogBox .el-dialog__body {
    padding: 30px!important;
  }
  /*#stock .el-tag--small {*/
    /*max-width: 40%;*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
  /*}*/
</style>

