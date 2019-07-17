<template>
  <div>
    <div class="input-box">
      <el-row>
        <!--<el-col :span="5">
          <div class='s-date'>
            <label for="" style="margin-right:4px;">模块检测：</label>
            <el-select size='small' v-model="formInfo.modelType" placeholder="请选择">
              <el-option
                v-for="item in testInfo"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>-->
       <!-- <el-col :span="5">
          <div class='s-date'>
            <label for="" style="margin-right:4px;">宝贝平台：</label>
            <el-select size='small' v-model="formInfo.platformType" placeholder="请选择" @change='changeSelect'>
              <el-option
                v-for="item in platformInfo"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>-->

       <!-- <el-col :span="5">
          <div class='s-date'>
            <label for="" style="margin-right:1px;">宝贝店铺：</label>
            <el-select size='small' v-model="formInfo.storeId" placeholder="请选择">
              <el-option
                v-for="item in shopInfo"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>-->
        <el-col :span="5">
          <div class='s-date'><label for="">检测人：</label>
            <el-input size='small' v-model="formInfo.checker" @keyup.enter.native="queryBtn"></el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="">检测时间：</label>
            <el-date-picker size='small'
                            :editable='false'
                            @change="channelDateChange(1)"
                            v-model="formInfo.checkBeforeTime"
                            type="date"
                            placeholder="选择日期"
                            format='yyyy-MM-dd'
                            value-format='yyyy-MM-dd'
                            :picker-options="pickerOptions0">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="">至：</label>
            <el-date-picker size='small'
                            :editable='false'
                            @change="channelDateChange(2)"
                            v-model="formInfo.checkAfterTime"
                            type="date"
                            placeholder="选择日期"
                            format='yyyy-MM-dd'
                            value-format='yyyy-MM-dd'
                            :picker-options="pickerOptions1">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" @click='queryBtn'>查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div style='margin:15px 0;height:38px;background:#2EA3FC;'>
      <span
        style='cursor:pointer;display:inline-block;line-height:30px;margin-top:4px;color:#fff;padding:0 40px 0 40px;border-right:1px solid #fff;'
        v-if='isBtnShow' @click='clearHistoryBtn'>清空记录</span>
    </div>
    <div>
      <el-table
        align="center"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-background="hsla(0,0%,100%,.9)"
        ref="multipleTable"
        :data="tableInfo"
        id='fitTable'
        :height='table_h'
        border>
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="70">
        </el-table-column>
       <!-- <el-table-column
          prop="modelName"
          label="检测模块"
          align="center"
          width="">
        </el-table-column>-->
       <!-- <el-table-column
          prop="platformName"
          align="center"
          label="宝贝平台">
        </el-table-column>-->
       <!-- <el-table-column
          prop="storeName"
          label="宝贝店铺"
          align="center"
          width="">
        </el-table-column>-->
        <el-table-column
          prop="checkGoodsQuantity"
          label="检测商品数"
          align="center"
          width="testNum">
        </el-table-column>
        <el-table-column
          prop="issueGoodsQuantity"
          label="问题商品数"
          align="center"
          width="">
        </el-table-column>
        <el-table-column
          prop="checkTimeResult"
          align="center"
          label="检测时间">
        </el-table-column>
        <el-table-column
          prop="checker"
          align="center"
          label="检测人"
          width="">
        </el-table-column>
      </el-table>
      <div style='float:right;margin-top:10px;'>
        <el-pagination
          style='float:left;'
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 500]"
          :page-size="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
        <i class='el-icon-refresh' @click='refresh'></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        renderListFn: () => {
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        //模块检测下拉数据
        loading: false,
        table_h: 0,
        testInfo: [{
          value: -1,
          label: '全部'
        }, {
          value: 6,
          label: '宝贝搬家'
        }, {
          value: 5,
          label: '宝贝发布'
        }],
        //宝贝平台下拉数据
        platformInfo: [{
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '天猫'
        }, {
          value: 2,
          label: '京东'
        }],
        //宝贝店铺
        shopInfo: [],
        //查询条件
        formInfo: {
          checkBeforeTime: '',
          checkAfterTime: '',
          storeId: '',
          modelType: -1,
          platformType: '',
          checker: '',
          page: 1,
          rows: 20
        },
        //表格数据
        tableInfo: [],
        totalPage: 20,
        currentPage: 1,
        totalNum: 0,
        isBtnShow: false
      }
    }, methods: {
      channelDateChange(item){
        console.log(this.formInfo.checkBeforeTime, this.formInfo.checkAfterTime);
        if(this.formInfo.checkBeforeTime && this.formInfo.checkAfterTime && new Date(this.formInfo.checkBeforeTime).getTime() > new Date(this.formInfo.checkAfterTime).getTime()){
          this.$message({
            message: '开始时间不能大于结束时间！',
            type: 'warning'
          });
          if(item == 1){
            this.formInfo.checkBeforeTime = '';
          }else{
            this.formInfo.checkAfterTime = '';
          }
        }
      },
      //刷新
      refresh() {
        this.loading = true;
        var paramData = this.formInfo;
        paramData.page = this.currentPage;
        paramData.rows = this.totalPage;
        this.renderListFn(paramData);
        setTimeout(() => {
          this.loading = false;
        }, 300)
      },
      //查询按钮
      queryBtn() {
        var paramData = this.formInfo;
        paramData.checkBeforeTime = paramData.checkBeforeTime ? paramData.checkBeforeTime: '';
        paramData.checkAfterTime = paramData.checkAfterTime ? paramData.checkAfterTime: '';
        paramData.page = this.currentPage;
        paramData.rows = this.totalPage;
        this.renderListFn(paramData);
      },
      //每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        var paramData = this.formInfo;
        paramData.page = this.currentPage;
        paramData.rows = this.totalPage;
        this.renderListFn(paramData);
      },
      //当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        var paramData = this.formInfo;
        paramData.page = this.currentPage;
        paramData.rows = this.totalPage;
        this.renderListFn(paramData);
      },
      //二级联动
      changeSelect() {
        var self = this;
        this.$axios({
          method: 'get',
          url: process.env.OLD_API + 'api/limitWords/getStore?platformType=' + self.formInfo.platformType
        })
          .then(function (response) {
            self.formInfo.storeId = '';
            if (response.data.code == 0) {
              self.shopInfo = response.data.result;
              console.log(self.shopInfo)
              for (var i = 0; i < self.shopInfo.length; i++) {
                self.shopInfo[i].label = self.shopInfo[i].storeName;
                self.shopInfo[i].value = self.shopInfo[i].storeId;
                if (self.shopInfo[i].value == null) {
                  self.shopInfo[i].value = '';
                }
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
      },
      clearHistoryBtn() {
        var self = this;
        this.$confirm('确定要删除这些记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          self.$axios({
            method: 'get',
            url: process.env.OLD_API + 'api/limitWords/removeAll'
          })
            .then(function (response) {
              if (response.data.code == 0) {
                var paramData = {
                  page: 1,
                  rows: 20
                };
                self.renderListFn(paramData);
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
        }).catch(() => {
        });
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
      //渲染检测记录
      var paramData = this.formInfo;
      this.renderListFn = (paramData) => {
        var self = this;
        this.$axios({
          method: 'post',
          url: process.env.OLD_API + 'api/limitWords/searchWithOption',
          data: paramData,
          transformRequest: [function (data) {
            let newData = '';
            for (let k in data) {
              //encodeURLComponent 可把字符串作为URI 组件进行编码
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
            return newData;
          }]

        })
          .then(function (response) {
            if (response.data.code == 0) {
              self.totalNum = response.data.result.total;
              self.tableInfo = response.data.result.rows;
              if (self.tableInfo.length == 0) {
                self.isBtnShow = false;
              } else {
                self.isBtnShow = true;
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
      this.renderListFn(paramData);
    }
  }
</script>
<style scoped>
  .el-button span {
    font-size: 12px;
  }

  .s-date .el-select, .s-date .el-input {
    width: 60% !important;
  }

  .el-select .el-input {
    width: 100% !important;
  }

  .input-box label {
    width: 75px;
    display: inline-block;
    text-align: right;
    margin-right: 1px;
  }
</style>
