<!--商品销售统计（条形码）贾南风 变更 佩玖-->
<template>
  <div id="barCode">
    <div id="searchBox" class="searchBox" style="margin: 8px 0 -10px 0">
      <div class="query-button" style="margin-left: -30px"><!--查询区-->
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post1">商品分类</label>
          <select id="example-post1" name="multiselect[]" multiple="multiple">
            <option  v-for="item in shopClassify" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">店铺</label>
          <select id="example-post" name="multiselect[]" multiple="multiple">
            <option  v-for="item in shop" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post">品牌</label>
          <select id="example-post2" name="multiselect[]" multiple="multiple">
            <option  v-for="item in brand" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content">
          <label>付款时间</label>
          <el-date-picker
            style="width: 290px;margin-right: 10px"
            v-model="value4"
            type="datetimerange"
            :clearable="false"
            range-separator="-"
            format="yyyy/MM/dd HH:mm:ss"
            @blur="dateChange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="grid-content box" style="margin-right: -45px">
          <label>商品条码</label>
          <el-input style="width: 200px!important;" v-model="queryCode.barCodes" ></el-input>
          <i class="el-icon-close error" @click="queryCode.barCodes=''"></i> <!--X-->
          <span class="dot" @click="clickShop">...</span><!--...-->
        </div>
        <div class="grid-content">
          <label>是否套装</label>
          <el-select style="width: 200px!important;" v-model="queryCode.suitFlag"  clearable placeholder="请选择" @change="suitChange">
            <el-option
              v-for="item in isSuit"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="grid-content"  id="selectMargin">
          <el-select style="width: 90px!important;" v-model="queryCode.serachType"  clearable placeholder="请选择">
            <el-option
              v-for="item in custom"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width: 93px!important;" v-model="queryCode.numsStart" :maxlength="9" @keyup.native="realTime(1)" ></el-input><!--@blur="regNum(1)"-->
          ~
          <el-input style="width: 93px!important;" v-model="queryCode.numsEnd"  :maxlength="9" @keyup.native="realTime(2)"></el-input><!--@blur="regNum(2)"-->
        </div>
        <div style="margin-left: 55px">
          <el-checkbox v-model="queryCode.countSuitGoodsFlag" :disabled="queryCode.suitFlag === true">统计套装内单品</el-checkbox>
        </div>
      </div>
      <div class="rightBox3">
        <el-button  type="primary"  @click="queryData()">查 询</el-button>
        <el-button  @click="resetData">重 置</el-button>
      </div>
    </div>
    <div style="clear:both"></div>
    <div class="ledgement"></div>
    <div class="col-nav" style="margin:-10px 0 10px;">
      <ul>
        <li @click="exportList()"><span>导出报表</span></li>
      </ul>
    </div>
    <div>
      <el-row>
        <el-col :span="14"><div class="tableRight">&nbsp;</div></el-col>
        <el-col :span="3"><div class="tableRight">总计：</div ></el-col>
        <el-col :span="3"><div class="tableRight">销售数量：<span v-if="countZ">{{countZ.salesNumsCount}}</span></div></el-col>
        <el-col :span="4"><div class="tableRight" style="padding-right: 10px">销售总额：<span v-if="countZ">{{countZ.salesAtmCount}}</span></div></el-col>
      </el-row>
    </div>
    <div class="col-border1">
        <el-table
          :data="tableData"
          border
          id="fitTable"
          :height="table_h1"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            width="50"
            align="center"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            align="center"
            label="图片">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" style="width: 50px;height: 30px"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="barCode"
            align="center"
            label="条形码">
          </el-table-column>
          <el-table-column
            prop="goodsCode"
            align="center"
            label="商品编码">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align="left"
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="specification"
            align="left"
            label="规格">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="catalogName"
            label="商品分类">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="brandName"
            label="品牌">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            align="right"
            prop="salesNums"
            label="销售数量">
          </el-table-column>
          <el-table-column prop="salesPrice" :render-header="renderHeader" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.salesPrice}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            align="right"
            prop="salesAtmTotal"
            label="销售总额">
          </el-table-column>
        </el-table>
    </div>
    <div class="col-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100,200]"
        :page-size="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>

    <!--查询商品弹框-->
    <div id="pop-up">
      <el-dialog v-dialogDrag
        title="请选择所查询商品"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="730px"
      >
        <div  id="input-box">
          <el-row>
            <el-col :span="18"><div class="grid-content bg-purple">
              <el-input v-model="findShop.goodsCode" style="width: 100px!important;margin-right: 19px" placeholder="请输入商品编号"></el-input>
              <el-input v-model="findShop.barCode" style="width: 100px!important;margin-right: 19px" placeholder="输入条形码"></el-input>
              <el-input v-model="findShop.goodsName" style="width: 100px!important;margin-right: 19px" placeholder="请输入商品名称"></el-input>
              <el-input v-model="findShop.goodsSpec" style="width: 100px!important;"placeholder="请输入商品规格"></el-input>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple-light" style="float: right">
              <el-button @click="queryShop" type="primary" style="width: 74px!important;">查询</el-button>
              <el-button @click="shopReset" style="width: 74px!important;">重置</el-button>
            </div></el-col>
          </el-row>
        </div>
        <div>
          <el-table
            :data="tableData1"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange1"
            border
            :height="570"
            style="width: 100%">
            <el-table-column
              fixed="left"
              type="index"
              align="center"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              fixed="left"
              align="center"
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              label="商品"
              width="200">
              <template slot-scope="scope">
                <img :src="scope.row.goodsImageBean.imageUrl" alt="" style="width: 30px;height: 30px;border-radius: 1px;margin-right: 5px">
                <span>{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="goodsCode"
              :show-overflow-tooltip="true"
              width="80"
              label="商品编号">
            </el-table-column>
            <el-table-column
              align="center"
              prop="barCode"
              width="140"
              :show-overflow-tooltip="true"
              label="条形码">
            </el-table-column>
            <el-table-column
              align="center"
              prop="specification"
              width="56"
              :show-overflow-tooltip="true"
              label="规格">
            </el-table-column>
            <el-table-column
              align="center"
              prop="brandName"
              width="120"
              :show-overflow-tooltip="true"
              label="商品品牌">
            </el-table-column>
            <el-table-column
              align="right"
              prop="salesPrice"
              width="56"
              :show-overflow-tooltip="true"
              label="售价">
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="currentPage1"
            :page-sizes="[15, 30, 50, 100,200]"
            :page-size="totalPage1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum1">
          </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">返回</el-button>
    <el-button type="primary" @click="ChooseSure">确认选择</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { turnTimestamp } from '@/assets/js/validate'
  export default {
    data() {
      return {
        imgUpload:process.env.FILE_API,
        tableData: [],
        version: '1.0.0',
        brand: [], // 品牌
        shop: [], // 店铺
        shopClassify: [], // 商品分类
        query: ()=>{}, // list
        queryShop: ()=>{}, // 商品list
        table_h1: 0,//表格的高度
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 数据总条数
        totalPage1: 15, // 要显示的条数
        currentPage1: 1, //
        totalNum1: 0, // 数据总条数
        dialogVisible: false, // 查询商品弹框
        tableData1: [],
        value4: [],//默认显示近7天
        // 查询商品参数
        findShop: {
          page: 1,   //当前页
          size: 15,   //每页条数
          goodsCode: '',   //商品编码
          barCode: '',       //条形码
          goodsName: '',  //商品名称
          goodsSpec: '',  //商品规格
        },
        queryCode:{ // 查询的参数
          catalogIds: '',//多个分类id 用英文逗号分隔
          storeIds: '',//多个店铺id用英文隔开
          brandIds: '',//多个品牌id 用英文逗号隔开
          payTimeStart: '' ,//开始时
          payTimeEnd: '',//结束时间
          serachType: 1,//查询类型  1：销售数量  2：销售总额
          numsStart: '',//销售总额/数量起始值
          numsEnd: '',//销售总额/数量结束值
          barCodes: '',//商品条形码 多个用英文逗号分隔
          suitFlag: '',//是否是套装   true/false  不传就是全部
          countSuitGoodsFlag: false,//是否统计套装内单品   true/false
          page: 1, //页码
          size: 15,//每页大小
        },
        value: '5',
        countZ: [], // 统计总数
        shopList: [],//选择商品的checkBox接受值
        isSuit: [ // 是否套装
          {value: '',label: '全部'},
          {value: false,label: '单品'},
          {value: true,label: '套装'},
        ],
        //自定义查询条件
        custom: [ // 处理状态
          {value: 1,label: '销售数量'},
          {value: 2,label: '销售总额'},
        ],
      }
    },
    methods:{
      suitChange(){
        if(this.queryCode.suitFlag ===  true){
          this.queryCode.countSuitGoodsFlag = false;
        }
       /* if(this.queryCode.countSuitGoodsFlag === false){

        }*/
      },
      renderHeader(h, { column, $index },index){
        return h('span', {}, [
          h('span', {}, '销售单价'),
          h('el-popover', { props: { placement: 'top-start', width: '230', trigger: 'hover', content: '销售单价=销售总额/销售数量' }}, [
            h('i', { slot: 'reference',style: 'font-size: 16px;margin-left: 3px', class:'el-icon-question'}, '')
          ])
        ])
      },
      // 点击导出列表
      exportList() {
        this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/goodsSKUQueryExportExcel',this.queryCode)
          .then( res => {
            if(res.data.success){
              location.href = 'http://'+ this.imgUpload+'/files-web/download/' + res.data.result; // 下载Excel表格
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 点击查询按钮
      queryData() {

        let arr = $('#example-post').val();
        let str = '';
        arr.forEach(item => {
          str += item + ',';
        });
        let arr1 = $('#example-post1').val();
        let str1 = '';
        arr1.forEach(item => {
          str1 += item + ',';
        });
        let arr2 = $('#example-post2').val();
        let str2 = '';
        arr2.forEach(item => {
          str2 += item + ',';
        });

        this.queryCode.storeIds = str.slice(0,-1);
        this.queryCode.catalogIds = str1.slice(0,-1);
        this.queryCode.brandIds = str2.slice(0,-1);
        //console.log(this.queryCode.catalogIds,123123);
        this.query();
      },
      // 销售金额/销售总量  区间起始值不能大于结束值
      regNum(num){
        if(num == 1){
          if(!!this.queryCode.numsEnd){
            if(this.queryCode.numsStart*1 > this.queryCode.numsEnd*1){
              this.queryCode.numsStart = '';
            }
          }
        }else{
          if(!!this.queryCode.numsStart){
            if(this.queryCode.numsEnd*1 < this.queryCode.numsStart*1){
              this.queryCode.numsEnd = '';
            }
          }
        }
      },
      // 销售金额/销售总量 正整数
      realTime(num) {  // minQty
        if(num == 1){
          if(this.queryCode.numsStart == 0){
            this.queryCode.numsStart = '';
          }
          this.queryCode.numsStart = this.queryCode.numsStart.replace(/[^\d]/g,'');
        }else{
          if(this.queryCode.numsEnd == 0){
            this.queryCode.numsEnd = '';
          }
          this.queryCode.numsEnd = this.queryCode.numsEnd.replace(/[^\d]/g,'');
        }
      },
      // 商品的重置
      shopReset(){
        this.findShop.goodsCode = '';
        this.findShop.barCode = '';
        this.findShop.goodsName = '';
        this.findShop.goodsSpec = '';
      },
      // 选择完时间后赋值给查询参数
      dateChange() {
        if(!this.value4){
          this.queryCode.payTimeStart = '';
          this.queryCode.payTimeEnd = '';
        }else{
          this.queryCode.payTimeStart = this.value4[0].getTime();
          this.queryCode.payTimeEnd =  this.value4[1].getTime();
        }
      },
      // 获取时间(近7天)
      sevenTime(){
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth(); // 月
        let strDate = date.getDate(); // 日
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1).getTime();
        const start = new Date(year, month, strDate-7, 0, 0).getTime();
        this.value4 = [start, end];
        this.queryCode.payTimeStart = this.value4[0];
        this.queryCode.payTimeEnd =  this.value4[1];
      },

      // 重置数据
      resetData() {
        this.sevenTime(); // 重置默认时间
        this.queryCode.numsStart = '';
        this.queryCode.numsEnd = '';
        this.queryCode.barCodes = '';
        this.queryCode.serachType = 1;
        this.queryCode.suitFlag = '';
        this.queryCode.countSuitGoodsFlag = false;

        let value = [];
        let value1 = [];
        let value2 = [];
        for (var item of this.shopClassify){
          item.value = item.catalogId;
          item.label = item.catalogName;
          value.push(item.catalogId)
        }
        for (var item of this.shop){
          item.value = item.storeId;
          item.label = item.storeName;
          value1.push(item.storeId)
        }
        for (var item of this.brand){
          item.value = item.brandId;
          item.label = item.brandName;
          value2.push(item.brandId)
        }
        $('#example-post').multiselect('dataprovider', this.shop); // 店铺
        $('#example-post').multiselect('select',value1);
        $('#example-post1').multiselect('dataprovider', this.shopClassify); // 商品分类
        $('#example-post1').multiselect('select',value);
        $('#example-post2').multiselect('dataprovider', this.brand); // 品牌
        $('#example-post2').multiselect('select',value2);
      },
      // 选择商品的确认选择按钮
      ChooseSure() {
        this.dialogVisible = false;
        if(this.shopList.length == 0){ // 如何当前用户没有选择商品，则不改变之前的

        }else{
          this.queryCode.barCodes = '';
          this.shopList.forEach(item => {
            this.queryCode.barCodes += item.barCode + ',';
          })

          this.queryCode.barCodes = this.queryCode.barCodes.slice(0,-1);
        }
      },
      // 点击查询区域商品的...
      clickShop() {
        this.dialogVisible = true;
        this.queryShop();
      },
      // shop checkbox
      handleSelectionChange1(val) {
        console.log(val);
        this.shopList = val;
      },
      //  当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.queryCode.page = this.currentPage;
        this.queryCode.size = this.totalPage;
        this.query();
      },
      //  分页
      //  每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        this.queryCode.page = this.currentPage;
        this.queryCode.size = this.totalPage;
        this.query()// 请求数据
      },
      //  每页多少条
      handleCurrentChange1(val) {
        console.log(val);
        this.currentPage1 = val;
        this.findShop.page = this.currentPage1;
        this.findShop.size = this.totalPage1;
        this.queryShop();
      },
      handleSizeChange1(val) {
        console.log(val);
        this.totalPage1 = val;
        this.findShop.page = this.currentPage1;
        this.findShop.size = this.totalPage1;
        this.queryShop()// 请求数据
      },

      handleClick(row) {
        console.log(row);
      },
    },
    created(){
      this.sevenTime(); // 默认七天
      // 查询商品销量统计（条形码） // 销售总量
      this.query = () => {
        this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/getListPageGoods_SKU',this.queryCode)
          .then(res =>{
            if(res.data.success){
              this.tableData = res.data.result.rows;
              this.totalNum = res.data.result.total;

              this._post('com.edb01.erp.bis.service.api.ReportingSystemCountService/' + this.version + '/getTotalGoods_SKU',this.queryCode)
                .then(res => {
                  if(res.data.success){
                    this.countZ = res.data.result;
                  }
                })
            }
          })
      };

      // 商品的查询
      this.queryShop = () => {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryForHandWave',this.findShop)
          .then(res =>{
            if(res.data.success){
              this.tableData1 = res.data.result.rows;
              this.totalNum1 = res.data.result.total;
            }
          })
      };
    },
    mounted(){
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if(e && e.keyCode==13){ // enter 键
          //调接口
          if(this.dialogVisible){

            this.queryShop(); // 商品查询
          }else{
            this.queryData();// 数据查询
          }

        }
      };
      //渲染表格高度
      this.$nextTick(function() {
        this.table_h1 = $(window).height() - $('.col-border1').offset().top - 80;
      });
      window.onresize = () => {
        this.table_h1 = $(window).height() - $('.col-border1').offset().top - 80;
      };

      // 商户有权限的商品分类
      this._post('com.edb01.erp.mdata.service.api.DtCatalogService/'+ this.version +'/listTail')
        .then(res => {
          if(res.data.success){
            this.shopClassify = res.data.result;
            var value = [];
            for (var item of this.shopClassify){
              item.value = item.catalogId;
              item.label = item.catalogName;
              value.push(item.catalogId)
            }
            //console.log(self.plat);
            $('#example-post1').multiselect('dataprovider', this.shopClassify);
            $('#example-post1').multiselect('select',value);
          }
        });
      $('#example-post1').multiselect({ // 品牌多选的样式
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });

      // 商户有权限的品牌
      this._post('com.edb01.erp.mdata.service.api.BrandService/'+ this.version +'/list')
        .then(res => {
          if(res.data.success){
            this.brand = res.data.result;
            var value = [];
            for (var item of this.brand){
              item.value = item.brandId;
              item.label = item.brandName;
              value.push(item.brandId)
            }
            //console.log(self.plat);
            $('#example-post2').multiselect('dataprovider', this.brand);
            $('#example-post2').multiselect('select',value);
          }
        });
      $('#example-post2').multiselect({ // 品牌多选的样式
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });

      // 商户有权限的店铺
      this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/listOauth')
        .then(res => {
          if(res.data.success){
            this.shop = res.data.result;
            var value = [];
            for (var item of this.shop){
              item.value = item.storeId;
              item.label = item.storeName;
              value.push(item.storeId)
            }
            //console.log(self.plat);
            $('#example-post').multiselect('dataprovider', this.shop );
            $('#example-post').multiselect('select',value);
          }
          //this.queryData();
        });
      $('#example-post').multiselect({ // 店铺多选的样式
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });

    },

  }
</script>
<style scoped>
  @media screen and (max-width:1800px){
    #barCode #selectMargin{
      margin-left: 50px;
    }
  }
  .tableRight{
    text-align: right;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
  }
  #barCode .dot{ /*商品里的...号*/
    position: relative;
    left: -45px;
    top: 0;
    font-weight: bold;
    font-size: 18px;
    border-left: 1px solid #C5CBD1;
    display: inline-block;
    height: 26px;
    padding: 0 5px;
    color: #979797;
    cursor: pointer;
    line-height: 26px;
  }
  #barCode .error{ /*商品里的X号*/
    position: relative;
    left: -45px;
    top:2px;
    font-weight: bold;
    cursor: pointer;
    color: #979797;
  }
  #selectMargin{
    margin-left: 16px;
  }
</style>
<style>
  #barCode #selectMargin .el-input__inner{
    padding: 0 4px;
  }
  #barCode .box .el-input__inner{
    padding: 0 43px 0 15px;
  }

  #barCode .el-table .warning-row {
    background: #FFF7EB;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  #barCode #shop-box  .el-input__inner{
    padding: 0 46px 0 15px!important;
  }
  #barCode #input-box .el-input__inner{
    padding: 0 5px!important;
  }
  #input-box  .grid-content{
    margin-bottom: 10px;
  }
  #barCode #pop-up .el-dialog__header{
    height: 40px!important;
    padding: 10px 20px 10px;
  }
  #barCode .btn-group>.btn:first-child{
    width:200px;
    height:28px;
    text-align: left;
    line-height:15px;
    border:1px solid #d8dce5;
  }
  #barCode .el-dialog__body{
    padding: 10px 20px!important;
  }
  #barCode .open>.dropdown-menu{
    width:200px;
  }
  #barCode .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
    font-size: 12px;
  }
  #barCode .el-range-editor.el-input__inner{
    padding: 3px 2px;
  }
</style>
