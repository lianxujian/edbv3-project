<!--商品分类销量统计 贾南风 变更 佩玖-->
<template>
  <div id="brandCount">
    <div id="searchBox" class="searchBox" style="margin: 8px 0 -10px 0">
      <div class="query-button" style="margin-left: -30px"><!--查询区-->
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post8">商品分类</label>
          <select id="example-post8" name="multiselect[]" multiple="multiple">
            <option  v-for="item in goods" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="white-space: nowrap;">
          <label for="example-post9">店铺</label>
          <select id="example-post9" name="multiselect[]" multiple="multiple">
            <option  v-for="item in shop" :value="item.value">{{item.label}}</option>
          </select>
        </div>
        <div class="grid-content" style="margin-left: 26px" id="selectMargin">
          <el-select style="width: 90px!important;" v-model="queryArgument.saleType"  placeholder="请选择">
            <el-option
              v-for="item in custom"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width: 93px!important;" v-model="queryArgument.minQty" :maxlength="9" @keyup.native="realTime(1)" ></el-input><!--@blur="regNum(1)"-->
          ~
          <el-input style="width: 93px!important;" v-model="queryArgument.maxQty" :maxlength="9" @keyup.native="realTime(2)" ></el-input><!--@blur="regNum(2)"-->
        </div>
        <div class="grid-content">
          <label>付款时间</label>
          <el-date-picker
            style="width: 290px"
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
      </div>
      <div class="rightBox3" >
        <el-button  type="primary"  @click="queryData">查 询</el-button>
        <el-button  @click="resetData">重 置</el-button>
      </div>
    </div>
    <div style="clear:both"></div>
    <div class="ledgement"></div>
    <div class="col-nav" style="margin:-10px 0 10px;">
      <ul>
        <li @click="DerivedExcel()"><span>导出报表</span></li>
      </ul>
    </div>
    <div>
      <el-row>
        <el-col :span="14"><div class="tableRight">&nbsp;</div></el-col>
        <el-col :span="3"><div class="tableRight">总计：<span v-if="tableData.length > 0"></span></div ></el-col>
        <el-col :span="3"><div class="tableRight">销售数量：<span v-if="tableData.length > 0">{{countNum.saleNumTotal}}</span></div></el-col>
        <el-col :span="4"><div class="tableRight" style="padding-right: 10px">销售总额：<span v-if="tableData.length > 0">{{countNum.saleAmtTotal}}</span></div></el-col>
      </el-row>
    </div>
    <div class="col-border4">
        <el-table
          :data="tableData"
          border
          :height="table_h4"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            width="50"
            align="center"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="catalogName"
            label="商品分类">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            align="right"
            prop="saleNum"
            label="销售数量">
          </el-table-column>
          <el-table-column prop="unitPrice" :render-header="renderHeader" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.unitPrice}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column
            :show-overflow-tooltip="true"
            align="right"
            prop="unitPrice"
            label="销售单价">
          </el-table-column>-->
          <el-table-column
            :show-overflow-tooltip="true"
            align="right"
            prop="saleAmt"
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
  </div>
</template>
<script>
  import { turnTimestamp } from '@/assets/js/validate'
  export default {
    data() {
      return {
        tableData:[ // 模拟返回的数据格式
          {name: '北极',id: 1},
          {name: '南极极',id: 2},
        ],
        imgUpload:process.env.FILE_API,
        version: '1.0.0',
        query: ()=>{}, // list
        queryShop: ()=>{}, // 商品list
        table_h4: 0,//表格的高度
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 数据总条数
        totalPage1: 15, // 要显示的条数
        currentPage1: 1, //
        totalNum1: 0, // 数据总条数
        goods: [], // 品牌
        shop: [], // 店铺
        //tableData: [], // 品牌统计数据
        countNum: [], // 总计接收
        queryArgument:{
          catalogIds: '',//品牌id
          storeIds: '',//店铺id
          maxQty: '',//最大销量
          minQty: '',//最小销量
          saleType: 0,//0：销售数量 1：销售总价
          startTime: '',//付款开始时间
          endTime: '',//付款结束时间
          page: 1, //页码
          size: 15,//每页大小
        },
        //枚举
        afterType: [ // 售后类型
          {value: '',label: '全部'},
          {value: 1,label: '退货退款'},
          {value: 2,label: '仅退款'},
        ],
        //自定义查询条件
        custom: [ // 处理状态
          {value: 0,label: '销售数量'},
          {value: 1,label: '销售总额'},
        ],
        value:1,
        value4: [],//默认显示近7天
      }
    },
    methods:{
      renderHeader(h, { column, $index },index){
        return h('span', {}, [
          h('span', {}, '销售单价'),
          h('el-popover', { props: { placement: 'top-start', width: '230', trigger: 'hover', content: '销售单价=销售总额/销售数量' }}, [
            h('i', { slot: 'reference',style: 'font-size: 16px;margin-left: 3px', class:'el-icon-question'}, '')
          ])
        ])
      },
      // 导出表格
      DerivedExcel() {
        let arr = $('#example-post8').val();
        let str = '';
        arr.forEach(item => {
          str += item + ',';
        });
        this.queryArgument.catalogIds = str.slice(0,-1);

        // storeIds: '',//店铺id
        let arr1 = $('#example-post9').val();
        let str1 = '';
        arr1.forEach(item => {
          str1 += item + ',';
        });
        this.queryArgument.storeIds = str1.slice(0,-1);

        this._post('com.edb01.erp.bis.service.api.CatalogService/' + this.version + '/goodsCatalogQueryExportExcel',this.queryArgument) // 获取需要导出的fileId
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
      // 选择完时间后赋值给查询参数
      dateChange() {
        if(!this.value4){
          this.queryArgument.startTime = '';
          this.queryArgument.endTime = '';
        }else{
          this.queryArgument.startTime = this.value4[0].getTime();
          this.queryArgument.endTime =  this.value4[1].getTime();
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
        this.queryArgument.startTime = this.value4[0];
        this.queryArgument.endTime =  this.value4[1];
      },
      // 销售金额/销售总量  区间起始值不能大于结束值
      regNum(num){
        if(num == 1){
          if(!!this.queryArgument.maxQty){
            if(this.queryArgument.minQty*1 > this.queryArgument.maxQty*1){
              this.queryArgument.minQty = '';
            }
          }
        }else{
          if(!!this.queryArgument.minQty){
            if(this.queryArgument.maxQty*1 < this.queryArgument.minQty*1){
              this.queryArgument.maxQty = '';
            }
          }
        }
      },
      // 销售金额/销售总量 正整数
      realTime(num) {  // minQty
        if(num == 1){
          if(this.queryArgument.minQty == 0){
            this.queryArgument.minQty = '';
          }
          this.queryArgument.minQty = this.queryArgument.minQty.replace(/[^\d]/g,'');
        }else{
          if(this.queryArgument.maxQty == 0){
            this.queryArgument.maxQty = '';
          }
          this.queryArgument.maxQty = this.queryArgument.maxQty.replace(/[^\d]/g,'');
        }
      },
      // 重置数据
      resetData() {
        this.queryArgument.maxQty = '';
        this.queryArgument.minQty = '';
        this.queryArgument.saleType = 0;
        this.sevenTime();
        let value = [];
        let value1 = [];
        for (var item of this.goods){
          item.value = item.catalogId;
          item.label = item.catalogName;
          value.push(item.catalogId)
        }
        for (var item of this.shop){
          item.value = item.storeId;
          item.label = item.storeName;
          value1.push(item.storeId)
        }
        $('#example-post8').multiselect('dataprovider', this.goods);
        $('#example-post8').multiselect('select',value);
        $('#example-post9').multiselect('dataprovider', this.shop);
        $('#example-post9').multiselect('select',value1);
      },
      // 点击查询按钮
      queryData() {
        let arr = $('#example-post8').val();
        let str = '';
        arr.forEach(item => {
          str += item + ',';
        });
        this.queryArgument.catalogIds = str.slice(0,-1);

        // storeIds: '',//店铺id
        let arr1 = $('#example-post9').val();
        let str1 = '';
        arr1.forEach(item => {
          str1 += item + ',';
        });
        this.queryArgument.storeIds = str1.slice(0,-1);
        this.query();
      },
      //  当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.queryArgument.page = this.currentPage;
        this.queryArgument.size = this.totalPage;
        this.query();
      },
      //  分页
      //  每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        this.queryArgument.page = this.currentPage;
        this.queryArgument.size = this.totalPage;
        this.query()// 请求数据
      },
      handleClick(row) {
        console.log(row);
      },
    },
    created(){
      this.sevenTime();  // 获取近7天的时间

      this.query = () => {
        this._post('com.edb01.erp.bis.service.api.CatalogService/' + this.version + '/catalogQuer', this.queryArgument)
          .then( res => {
            if(res.data.success){
              this.tableData = res.data.result.rows;
              this.totalNum = res.data.result.total;

              this._post('com.edb01.erp.bis.service.api.CatalogService/' + this.version + '/queryTotal',this.queryArgument)
                .then(res => {
                  if(res.data.success){
                        this.countNum = res.data.result;
                  }
                })
            }
          })
      }

    },
    mounted(){
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if(e && e.keyCode==13){ // enter 键
          //调接口
          this.queryData();// 数据查询
        }
      };
      //渲染表格高度
      this.$nextTick(function() {
        this.table_h4 = $(window).height() - $('.col-border4').offset().top - 80;
      });
      window.onresize = () => {
        this.table_h4 = $(window).height() - $('.col-border4').offset().top - 80;
        //console.log(this.table_h4,2);
      };
      // 商户有权限的商品分类
      this._post('com.edb01.erp.mdata.service.api.DtCatalogService/'+ this.version +'/listTail')
        .then(res => {
          if(res.data.success){
            this.goods = res.data.result;
            var value = [];
            for (var item of this.goods){
              item.value = item.catalogId;
              item.label = item.catalogName;
              value.push(item.catalogId)
            }
            //console.log(self.plat);
            $('#example-post8').multiselect('dataprovider', this.goods);
            $('#example-post8').multiselect('select',value);

            //this.queryData();
          }
        });
      $('#example-post8').multiselect({ // 品牌多选的样式
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
          if(res.data.success == true){
            this.shop = res.data.result;
            var value = [];
            for (var item of this.shop){
              item.value = item.storeId;
              item.label = item.storeName;
              value.push(item.storeId)
            }
            //console.log(self.plat);
            $('#example-post9').multiselect('dataprovider', this.shop );
            $('#example-post9').multiselect('select',value);
          }
        })
      $('#example-post9').multiselect({ // 店铺多选的样式
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
  .tableRight{
    text-align: right;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 10px;
  }
</style>
<style>
  #brandCount #selectMargin .el-input__inner{
    padding: 0 4px;
  }
  .el-table .warning-row {
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
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px!important;
    text-align: center;
  }
  .avatar {
    width: 140px;
    height: 140px;
    display: block;
  }
  #brandCount #shop-box  .el-input__inner{
    padding: 0 46px 0 15px!important;
  }
  #brandCount #input-box .el-input__inner{
    padding: 0 5px!important;
  }
  #input-box  .grid-content{
    margin-bottom: 10px;
  }
  #brandCount #pop-up .el-dialog__header{
    height: 40px!important;
    padding: 10px 20px 10px;
  }
  #brandCount .btn-group>.btn:first-child{
    width:200px;
    height:28px;
    text-align: left;
    line-height:15px;
    border:1px solid #d8dce5;
  }
  #brandCount .el-dialog__body{
    padding: 10px 20px!important;
  }
  #brandCount .open>.dropdown-menu{
    width:200px;
  }
  #brandCount .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
    font-size: 12px;
  }
  #brandCount .el-range-editor.el-input__inner{
    padding: 3px 2px;
  }
</style>
