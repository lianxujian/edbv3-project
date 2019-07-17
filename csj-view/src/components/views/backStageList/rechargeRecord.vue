<!--充值记录-->
<template>
  <div style='padding-left:20px;height:100%;'>
    <div class="input-box">
      <el-row style="">
        <el-col :span="5">
        </el-col>
        <el-col :span="5">
          <div style="white-space:nowrap;">
            <label for="" style='margin-right:2px;text-align:center;'>充值时间：</label>
            <el-date-picker
              :editable='false'
              size='small'
              @change="channelChangeDate(1)"
              v-model="queryData.startTime"
              type="datetime"
              format='yyyy-MM-dd HH:mm:ss'
              value-format='yyyy-MM-dd HH:mm:ss'
              placeholder="选择日期时间"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div style="white-space:nowrap;">
            <label for="" style="margin-right:2px;text-align:center;">至</label>
            <el-date-picker
              :editable='false'
              size='small'
              @change="channelChangeDate(2)"
              v-model="queryData.endTime"
              type="datetime"
              format='yyyy-MM-dd HH:mm:ss'
              value-format='yyyy-MM-dd HH:mm:ss'
              placeholder="选择日期时间"
              :picker-options="pickerOptions0">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div style="white-space:nowrap;">
            <label for="" style="margin-right:2px;text-align:center;">充值方式：</label>
            <el-select v-model="queryData.type" placeholder="全部" size='small'>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5">
          <div><label for="">主账号：</label><el-input size='small' v-model="queryData.mainAccount" @keyup.enter.native="queryBtn"></el-input></div>
        </el-col>
        <el-col :span="4">
          <el-button size="small" type="primary"  @click='queryBtn'>查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="release-nav">
      <ul>
        <li @click='exportBtn()'>导出</li>
      </ul>
    </div>
    <div class="border">
      <el-table
        id='fitTable'
        :height='table_h'
        :data="tableData"
        border
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="70">
        </el-table-column>
        <el-table-column
          prop="timeStr"
          align="left"
          label="充值时间">
        </el-table-column>
        <el-table-column
          prop="typeStr"
          align="center"
          label="充值方式"
          width='200'>
        </el-table-column>
        <el-table-column
          prop="mainAccount"
          align="center"
          label="主账号">
        </el-table-column>
        <el-table-column
          prop="rechargeAccount"
          align="center"
          label="充值账号">
        </el-table-column>
        <el-table-column
          prop="rechargeAmount"
          align="right"
          label="充值金额（元）">
        </el-table-column>
      </el-table>
    </div>
    <div style='float:right;margin-top:5px;'>
      <el-pagination
        style='float:left;'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
      <i class='el-icon-refresh' @click='refresh'></i>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        queryFn:()=>{},
        table_h:0,
        queryData:{
            page:1,
            rows:20,
            mainAccount:'', //主账号
            type:'typeAll' ,// type:B41 B42 B43 支付宝 微信 预充值
            startTime:'' ,//开始时间
            endTime:'' ,//结束时间
          },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        totalNum:0,
        totalPage:20,
        currentPage:1,
        tableData:[],
        selectionData:'',
        options: [{
          value: 'typeAll',
          label: '全部'
        },{
          value: 'B41',
          label: '支付宝'
        }],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
      }
    },methods:{
      channelChangeDate(item){
        if(this.queryData.startTime && this.queryData.endTime && new Date(this.queryData.startTime).getTime() > new Date(this.queryData.endTime).getTime()){
          this.$message({
            message: '起始时间不能大于结束时间！',
            type: 'warning'
          });
          if(item == 1){
            this.queryData.startTime = '';
          }else{
            this.queryData.endTime = '';
          }
        }
      },
      //保留小数点后两位
      toDecimal2(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
          return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },
      handleSizeChange() {

      },
      handleCurrentChange() {

      },
      //多选框
      handleCheckAllChange(val) {
        this.checkedCities = val ? this.cities : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        console.log(this.checkedCities);
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      handleClick(tab, event) {

      },
      handleSelectionChange(val) {
        this.selectionData = val;
        console.log(val)
      },
      handleSizeChange(val){
        this.queryData.rows=val;
        this.queryFn();
      },
      handleCurrentChange(val){
        this.queryData.page=val;
        this.queryFn();
      },
      //点击刷新页面
      refresh(){
        this.queryFn();
      },
      //导出数据-------------------------------------------------------------导出------------------------------------------------导出
      exportBtn() {
        location.href = process.env.OLD_API + '/api/record/adminExcel';
      },
      ///点击查询按钮---------------------------------------------------------查询---------------------------------------------------查询
      queryBtn() {
        this.queryFn();
      },
      renderTableHeight() {
        this.$nextTick(function () {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        });
        window.onresize = () => {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        }
      },
    },
    mounted(){
      //渲染表格高度
      this.renderTableHeight();
      var self = this;
      this.queryFn=()=>{
        this.$axios({
          method:'post',
          url:process.env.OLD_API + 'api/record/getRechargeListAdmin',
          data:self.queryData,
          transformRequest:[function (data) {
            let newData = '';
            for(let k in data){
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
            return newData;
          }]

        })
          .then(function (response) {
            console.log(response)
            if(response.data.code==0){
              self.totalNum=response.data.result.returnData.total;
              self.tableData=response.data.result.returnData.rows;
              for (var i = 0; i < self.tableData.length; i++) {
                self.tableData[i].rechargeAmount = self.toDecimal2(self.tableData[i].rechargeAmount / 100)
              }
            }else{
              self.$message({
                message: response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.queryFn();
    },
    created(){

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .input-box{
    margin:20px 0 0px 0;
    display:inline-block;
  }
  .input-box label{
    width:70px;
    display:inline-block;
    text-align:right;
    margin-right:5px;
  }
  .el-select{
    width:60%;
  }
  .el-input{
    width:60% !important;
  }
  .release-nav{
    background:#2EA3FC;
    width:100%;
    height:38px;
    margin:15px 0;
  }
  .release-nav ul li{
    float:left;
    height:26px;
    margin-top:6px;
    line-height:26px;
    padding:0 40px;
    color:#fff;
    border-right:1px solid #fff;
    cursor: pointer;
  }
</style>
