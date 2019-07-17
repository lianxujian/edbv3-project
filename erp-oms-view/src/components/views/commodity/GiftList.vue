<!--赠品列表 樊虎-->
<template>
  <div id="giftList" style='padding-left:20px;'>
    <!--搜索区域-->
    <div id="searchBox">
      <div class="leftBox2">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label for="barCode">条形码：</label>
              <el-input id="barCode" size='small' :maxlength="50" v-model="paramData.barCode"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="goodsName">赠品名称：</label>
              <el-input id="goodsName" :maxlength="100" size='small' v-model="paramData.goodsName"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="">销售状态：</label>
              <el-select v-model="paramData.goodsType" placeholder="">
                <el-option
                  v-for="item in goodsTypeArr"
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
        <el-button type="primary" @click='queryBtn'>查询</el-button>
        <el-button @click='resetBtn'>重置</el-button>
      </div>
    </div>
    <div style="clear:both;"></div>
    <!--主数据表格区-->
    <div class="col-border">
      <el-table
        border
        :height="t_height"
        :data="tableData"
      >
        <el-table-column
          label="序号"
          align='center'
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="barCode"
          label="条形码"
          min-width=''
          align='center'
          width="">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          align='center'
          label="赠品名称"
          width="">
        </el-table-column>
        <el-table-column
          prop="goodsType"
          align='center'
          label="销售状态"
          width="">
          <template slot-scope="scope">
            <span v-if="scope.row.goodsType==1">可售可赠</span>
            <span v-if="scope.row.goodsType==2">仅赠</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsMerchantInv.giftSalesInv"
          align='center'
          label="可售库存"
          width="">
        </el-table-column>
        <el-table-column
          prop="goodsMerchantInv.giftPreemptionInv"
          align='center'
          label="促销方案预占"
          width="">
        </el-table-column>
      </el-table>
    </div>
    <div class="col-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100, 200]"
        :page-size="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        version:'1.0.0',
        renderFn: () => {
        },
        totalNum: 0,
        totalPage: 15,
        currentPage: 1,
        tableData: [],//主数据data
        goodsTypeArr:[
          {
            label:'全部',
            value:'0'
          },
          {
            label:'可售可赠',
            value:'1'
          },
          {
            label:'仅赠',
            value:'2'
          }
        ],//销售状态
        paramData: {
          page: 1,
          size: 15,
          barCode:'',
          goodsName:'',
          goodsType:'0'
        },//查询条件
        t_height:0,
      }
    },
    methods: {
      //查询
      queryBtn() {
        this.renderFn();
      },
      //重置
      resetBtn(){
        this.paramData.barCode='';
        this.paramData.goodsName='';
        this.paramData.goodsType='0';
      },
      handleSizeChange(val) {
        this.paramData.size = val;
        this.totalPage = val;
        this.queryBtn();
      },
      handleCurrentChange(val) {
        this.paramData.page = val;
        this.queryBtn();
      }
    },
    mounted() {
      //渲染表格高度
      this.$nextTick(function() {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      })
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      }
      //渲染表格
      this.renderFn = (param) => {
        this._post( 'com.edb01.erp.mdata.service.api.GoodsService/' + this.version+ '/queryGiftsListByCondition',this.paramData).then((response)=>{
          if (response.data.success) {
            //下拉框插件
            this.tableData = response.data.result.rows;
            this.totalNum = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
      this.renderFn();
    },
    created() {
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){ // enter 键
          //要做的事情
          this.queryBtn();
        }
      };
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>

</style>


