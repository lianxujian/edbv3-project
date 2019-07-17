<!--绩效 樊虎-->
<template>
  <div id="giftList" style='padding-left:20px;'>
    <!--查询区域-->
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label for="conStartTime">统计日期：</label>
              <el-date-picker id="conStartTime" v-model="paramData.countTimeStart" :clearable="false" :editable="false"
                              @change="channelChangeTime" type="date" placeholder="选择日期"
                              format='yyyy-MM-dd' value-format='timestamp'>
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="conEndTime" style="text-align:center;">-</label>
              <el-date-picker id="conEndTime" v-model="paramData.countTimeEnd" :clearable="false" :editable="false"
                              @change="channelChangeTime" type="date" placeholder="选择日期"
                              format='yyyy-MM-dd' value-format='timestamp'>
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="">角色：</label>
              <el-select v-model="paramData.role" placeholder="">
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="barCode">操作员：</label>
              <el-input id="barCode" size='small' :maxlength="50" v-model="paramData.operator"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox1">
        <el-button type="primary" @click='queryBtn'>查询</el-button>
      </div>
    </div>
    <div style="clear:both;"></div>
    <!--按钮区域-->
    <div class="col-nav" style="margin-bottom:10px;">
      <ul>
        <li @click="exportData"><span>导出</span></li>
      </ul>
    </div>
    <!--表格区域-->
    <div class="col-border">
      <el-table
        border
        @sort-change="sortChange"
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
          label="角色"
          min-width=''
          align='center'
          width="">
          <template slot-scope="scope">
            <span>{{roleObj[scope.row.role]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          align='center'
          label="操作员"
          width="">
        </el-table-column>
        <el-table-column
          prop="orderNums"
          align='center'
          sortable="custom"
          label="订单笔数"
          width="">
        </el-table-column>
        <el-table-column
          prop="goodsNums"
          align='center'
          sortable="custom"
          label="商品数"
          width="">
        </el-table-column>
        <el-table-column
          prop="atmTotal"
          align='center'
          sortable="custom"
          label="总金额"
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
        imgUpload:process.env.FILE_API,//文件服务域名
        totalNum: 0,
        totalPage: 15,
        currentPage: 1,
        tableData: [],//表格data
        roleObj:{
          '0':'全部',
          '1':'审单员',
          '2':'打单员',
          '3':'验货员',
          '4':'称重员',
          '5':'发货员',
          '6':'配货员',
          '7':'打包员',
        },//角色集合obj
        roleList:[
          {
            label:'全部',
            value:'0'
          },
          {
            label:'审单员',
            value:'1'
          },
          {
            label:'打单员',
            value:'2'
          },
          {
            label:'验货员',
            value:'3'
          },
          {
            label:'称重员',
            value:'4'
          },
          {
            label:'发货员',
            value:'5'
          },
          {
            label:'配货员',
            value:'6'
          },
          {
            label:'打包员',
            value:'7'
          }
        ],//角色集合
        paramData: {
          page: 1,
          size: 15,
          operator:'',
          role:'0',
          countTimeStart:'',
          countTimeEnd:'',
          orderByColumn:'',
          orderByType:'',
        },//查询条件
        t_height:0,
        exportObj:{},//导出参数
      }
    }, methods: {
      //导出
      exportData(){
        this._post( 'com.edb01.erp.bis.service.api.PerformanceCountService/' + this.version+ '/reportPerformanceExcel',this.exportObj).then((response)=>{
          if (response.data.success) {
            location.href = 'http://'+ this.imgUpload+'/files-web/download/' + response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //排序
      sortChange(params){
        if(params.order == "ascending"){
          this.paramData.orderByType = 0;
        }else if(params.order == "descending"){
          this.paramData.orderByType = 1;
        }
        if(params.prop == 'orderNums'){
          this.paramData.orderByColumn = 1;
        }else if(params.prop == "goodsNums"){
          this.paramData.orderByColumn = 2;
        }else if(params.prop == 'atmTotal'){
          this.paramData.orderByColumn = 3;
        }
        this.renderFn();
      },
      //查询
      queryBtn() {
        this.renderFn();
      },
      handleSizeChange(val) {
        this.paramData.size = val;
        this.totalPage = val;
        this.queryBtn();
      },
      handleCurrentChange(val) {
        this.paramData.page = val;
        this.queryBtn();
      },
      //时间选择
      channelChangeTime(){

      },
      //时间初始化
      handleDateType(val) {
        var today = new Date();
        this.paramData.countTimeEnd = new Date().getTime();
        this.paramData.countTimeStart = new Date(new Date().getFullYear(),new Date().getMonth()-1,new Date().getDate()).getTime();
      },
      //渲染表格
      renderFn(){
        this._post( 'com.edb01.erp.bis.service.api.PerformanceCountService/' + this.version+ '/performanceList',this.paramData).then((response)=>{
          if (response.data.success) {
            this.exportObj = JSON.parse(JSON.stringify(this.paramData));
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
      },
    },
    mounted() {
      //渲染表格高度
      this.$nextTick(function() {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      })
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      }
      //时间初始化
      this.handleDateType();
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


