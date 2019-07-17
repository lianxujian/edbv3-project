<!--参与促销 樊虎-->
<template>
  <div id="giftList">
    <!--面包屑导航-->
    <div>
      <el-breadcrumb separator=">" class="col-breadcrumb">
        <el-breadcrumb-item @click.native="showParentBlock">赠品策略</el-breadcrumb-item>
        <el-breadcrumb-item>参与促销订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--操作按钮区-->
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="exportBtn"><span>导出</span></li>
      </ul>
    </div>
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
          prop="salesOrderNo"
          label="订单编号"
          min-width=''
          align='center'
          width="">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          align='center'
          label="商品信息"
          width="">
          <template slot-scope="scope">
            <span style="color:#409EFF;cursor:pointer;" @click="showGoodsDetail(scope.row)">{{scope.row.goodsTypeQty}}/{{scope.row.goodsQty}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderStatusStr"
          align='center'
          label="订单状态"
          width="">
        </el-table-column>
        <el-table-column
          prop="ecSendStatusStr"
          align='center'
          label="平台发货状态"
          width="">
        </el-table-column>
        <el-table-column
          prop="actuallyRecvTotalAmt"
          align='center'
          label="商品实收总金额"
          width="">
        </el-table-column>
        <el-table-column
          prop="buyerNick"
          align='center'
          label="买家ID"
          width="">
        </el-table-column>
        <el-table-column
          prop="storeName"
          align='center'
          label="店铺"
          width="">
        </el-table-column>
        <el-table-column
          width="140"
          prop="orderTime"
          align='center'
          label="下单时间">
        </el-table-column>
        <el-table-column
          width="140"
          prop="payTime"
          align='center'
          label="付款时间">
        </el-table-column>
        <el-table-column
          prop="sourceOrderNo"
          align='center'
          label="平台单号"
          width="">
        </el-table-column>
      </el-table>
    </div>
    <div style="float:right;margin-top:5px;">
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
    <div class="col-button">
      <el-button style="width:100px;" size="small" @click="showParentBlock">返回</el-button>
    </div>
    <!--商品详细信息-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="商品详细信息" :visible.sync="goodsDetailDialog" v-if="goodsDetailDialog" width="1100px">
      <order-detail-dialog :isOperation="false" :salesOrderId="salesOrderId"></order-detail-dialog>
    </el-dialog>
  </div>
</template>
<script>
  import { turnTimestamp } from '@/assets/js/validate';
  import OrderDetailDialog from '@/components/common/OrderDetailDialog.vue';
  export default {
    props:{
      params:Object
    },
    components: {
      OrderDetailDialog
    },
    data() {
      return {
        version:'1.0.0',
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
          giftStrategyId:this.params.giftStrategyId
        },//查询条件
        goodsDetailDialog:false,
        t_height:0,
      }
    },
    methods: {
      //组件回传
      showParentBlock(clockBlock) {
        this.$emit('changeShow')
      },
      //导出
      exportBtn(){
        this._post( 'com.edb01.erp.oms.service.api.PromplanService/' + this.version+ '/strategyOrderListExport',{
          giftStrategyId:this.params.giftStrategyId
        }).then((response)=>{
          if (response.data.success) {
            if(!response.data.result){
              this.$message({
                message: '暂无数据！',
                type: 'warning'
              });
              return false;
            }
            location.href = 'http://' + process.env.FILE_API + '/files-web/download/' + response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //查询
      queryBtn() {
        this.renderFn();
      },
      handleSizeChange(val) {
        this.paramData.size = val;
        this.queryBtn();
      },
      handleCurrentChange(val) {
        this.paramData.page = val;
        this.queryBtn();
      },
      renderFn(){
        this._post( 'com.edb01.erp.oms.service.api.PromplanService/' + this.version+ '/getStrategyOrderListByDataPager',this.paramData).then((response)=>{
          if (response.data.success) {
            //下拉框插件
            this.tableData = response.data.result.rows;
            this.tableData.forEach(item => {
              item.orderTime = turnTimestamp(item.orderTime);
              item.payTime = turnTimestamp(item.payTime);
            })
            this.totalNum = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //展示商品弹框
      showGoodsDetail(row){
        //获取商品详情
        this.salesOrderId = row.salesOrderId;
        this.goodsDetailDialog = true;
      }
    },
    mounted() {
      //渲染表格高度
      this.$nextTick(function() {
        this.t_height = $(window).height() - $('.col-border').offset().top - 240;
      })
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 240;
      }
      //渲染表格
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


