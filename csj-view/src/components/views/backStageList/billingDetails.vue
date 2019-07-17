<!--结算明细-->
<template>
  <div style='padding-left:20px;height:100%;'>
    <div class="input-box">
      <el-row style="">
        <el-col :span="6">
          <div><label for="">主账号：</label>
            <el-input size='small' v-model="queryData.mainAccount" @keyup.enter.native="queryBtn"></el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="white-space:nowrap;">
            <label for="" style="margin-right:2px;text-align:center;">可用余额：</label>
            <el-select v-model="queryData.type" placeholder="全部" size='small'>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input size='small' @blur="valigatorMoney" v-model="queryData.money"></el-input>
          </div>
        </el-col>
        <el-col :span="5" style="text-align:right;">
          <el-button type="primary" size="small" @click='queryBtn'>查询</el-button>
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
          prop="mainAccount"
          align="center"
          label="主账号">
        </el-table-column>
        <el-table-column
          prop="bindMobile"
          align="center"
          label="绑定手机号"
          width='200'>
        </el-table-column>
        <el-table-column
          prop="bindEmail"
          align="center"
          label="绑定邮箱">
        </el-table-column>
        <el-table-column
          prop="acquiredCount"
          align="center"
          label="获取宝贝数">
        </el-table-column>
        <el-table-column
          prop="publishedCount"
          align="center"
          label="发布宝贝数">
        </el-table-column>
        <el-table-column
          prop="totalConsumeAmount"
          align="right"
          label="消费金额（元）">
        </el-table-column>
        <el-table-column
          prop="totalSurplusAmount"
          align="right"
          label="可用余额（元）">
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
    data() {
      return {
        queryFn: () => {
        },
        table_h:0,
        queryData: {
          page: 1,
          rows: 20,
          mainAccount: '', //主账号
          type: '',//1 小于等于2 大于等于
          startTime: '',//开始时间
          endTime: '',//结束时间
          money:''
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        totalNum: 0,
        totalPage: 20,
        currentPage: 1,
        tableData: [],
        selectionData: '',
        options: [
          {
            value: '',
            label: '全部'
          },
          {
          value: '2',
          label: '大于等于'
        }, {
          value: '1',
          label: '小于等于'
        }]
      }
    }, methods: {

      //保留小数点后两位
      toDecimal2(x) {
        var f = x*1;
        if (isNaN(f)||f<0) {
          return '';
        }
        if(f>999999999.99){
          return '999999999.99';
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
      handleSizeChange(val) {
        this.queryData.rows = val;
        this.queryFn();
      },
      handleCurrentChange(val) {
        this.queryData.page = val;
        this.queryFn();
      },
      valigatorMoney(){
        this.queryData.money=this.toDecimal2(this.queryData.money);
      },
      refresh() {
        this.queryFn();
      },
      //导出数据-------------------------------------------------------------导出------------------------------------------------导出
      exportBtn() {
          location.href = process.env.OLD_API + '/api/BillDetail/adminExcel?mainAccount='+this.queryData.mainAccount+'&type='+this.queryData.type+'&money='+this.queryData.money;
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
    mounted() {
      //渲染表格高度
      this.renderTableHeight();
      var self = this;
      this.queryFn = () => {
        this.$axios({
            method: 'post',
            url:process.env.OLD_API + 'api/BillDetail/getByList',
            data: self.queryData,
            transformRequest: [function (data) {
            let newData = '';
            for (let k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
            return newData;
          }]

        })
          .then(function (response) {
            console.log(response)
            if (response.data.code == 0) {
              self.totalNum = response.data.result.total;
              self.tableData = response.data.result.rows;
              //转化为保存后两位小数
              for (var i = 0; i < self.tableData.length; i++) {
                self.tableData[i].totalConsumeAmount = self.toDecimal2(self.tableData[i].totalConsumeAmount / 100)
              }
              for (var i = 0; i < self.tableData.length; i++) {
                self.tableData[i].totalSurplusAmount = self.toDecimal2(self.tableData[i].totalSurplusAmount / 100)
              }

            } else {
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
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .input-box label {
    width: 70px;
    display: inline-block;
    text-align: right;
    margin-right: 5px;
  }

  .el-select {
    width: 60%;
  }

  .el-input {
    width: 60% !important;
  }

  .release-nav {
    background: #2EA3FC;
    width: 100%;
    height: 38px;
    margin: 15px 0;
  }

  .release-nav ul li {
    float: left;
    height: 26px;
    margin-top: 6px;
    line-height: 26px;
    padding: 0 40px;
    color: #fff;
    border-right: 1px solid #fff;
    cursor: pointer;
  }
</style>
