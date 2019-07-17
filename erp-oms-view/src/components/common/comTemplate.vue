<!--公共模板 樊虎-->
<template>
  <div id="taskCenter">
    <div id="searchBox">
      <div class="leftBox2">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>任务编号：</label>
              <el-input type="text" placeholder="请输入内容" v-model="paramData.taskNum"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>任务类型：</label>
              <el-select clearable placeholder="请选择" v-model="paramData.taskType">
                <el-option key="0" label="全部" value=""></el-option>
                <el-option key="1" label="等待执行" value="1"></el-option>
                <el-option key="2" label="执行中" value="2"></el-option>
                <el-option key="3" label="已结束" value="3"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>状态：</label>
              <el-select clearable placeholder="请选择" v-model="paramData.taskStatus">
                <el-option key="0" label="全部" value=""></el-option>
                <el-option key="1" label="等待执行" value="1"></el-option>
                <el-option key="2" label="执行中" value="2"></el-option>
                <el-option key="3" label="已结束" value="3"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>开始时间：</label>
              <el-date-picker
                @change="channelChangePicker"
                type="datetime"
                value-format='timestamp'
                v-model="paramData.startTime"
                :picker-options="pickerOptions"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>完成时间：</label>
              <el-date-picker
                @change="channelChangePicker"
                type="datetime"
                v-model="paramData.endTime"
                :picker-options="pickerOptions"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button size="mini" type="primary" @click="goodsDownList">查 询</el-button>
        <el-button size="mini" type="deafult" @click="RestBtn()">重 置</el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData"
        :max-height="t_height"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="taskNo"
          label="任务编号">
        </el-table-column>
        <el-table-column
          prop=" goodIds"
          label="任务类型">
        </el-table-column>
        <el-table-column
          prop=" taskStatus"
          label="状态">
        </el-table-column>
        <el-table-column
          prop=" taskStatus"
          label="进度">
        </el-table-column>
        <el-table-column
          prop=" taskStatus"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="taskStatus"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="ecName"
          label="完成时间">
        </el-table-column>
        <el-table-column
          prop="storeName"
          label="说明">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="terminateBtn(scope.row)">终止</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15,30,50,100,200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {turnTimestamp} from '@/assets/js/validate.js';
  export default {
    data() {
      return {
        pickerOptions:{  //时间选择区间
          disabledDate(time){
            let curDate = (new Date()).getTime();
            let three = 90 * 24 * 3600 * 1000;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          },
        },
        paramData:{

        },
        t_height:0,//表格高度
        tableData: [], // 数据列表
        currentPage: 1, //当前页
        pageSize:15, //当前页条数
        version:'1.0.0',
        totalNum: 0, //总条数
      }
    },
    mounted() {   //数据挂载
      this.goodsDownList(); //表格数据列表
      //渲染表格高度
      this.$nextTick(function () {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      })
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      }
      //回车事件
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13 && $('.v-modal').length == 0) { // enter 键
          //要做的事情
          this.goodsDownList();
        }
      };
    },
    methods: {
      // 起始时间
      channelChangePicker() {
        if(this.paramData.startTime > this.paramData.endTime){
          this.$message({
            message: '开始时间不能大于完成时间',
            type: 'warning'
          });
          this.paramData.endTime = '';
        }
      },
      //表格数据列表
      goodsDownList() {
        var paramData = Object.assign(this.paramData,{
          page:this.currentPage,
          size:this.pageSize,
        })
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsService/' + this.version +'/queryTask', paramData).then(response => {
          if (response.data.success) {
            response.data.result.rows.forEach((item)=>{
              item.createTime = item.createTime ? turnTimestamp(item.createTime) : '';
            })
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
      //重置
      RestBtn() {

      },
      //分页
      handleSizeChange(val) {
        this.pageSize = val;
        this.goodsDownList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.goodsDownList();
      },
      //终止按钮
      terminateBtn(row){

      }
    }
  }


</script>

<style scoped>

</style>
