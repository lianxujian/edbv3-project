<!--任务中心 樊虎-->
<template>
  <div id="taskCenter">
    <div id="searchBox">
      <div class="leftBox2">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>任务编号：</label>
              <el-input type="text" placeholder="请输入内容" maxlength="20" v-model="paramData.taskCode"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>任务类型：</label>
              <el-select placeholder="请选择" v-model="paramData.taskType">
                <el-option key="0" label="全部" value="0"></el-option>
                <el-option key="1" label="订单删除" value="1"></el-option>
                <el-option key="2" label="套装更新订单" value="2"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>状态：</label>
              <el-select placeholder="请选择" v-model="paramData.taskStatus">
                <el-option key="0" label="全部" value="0"></el-option>
                <el-option key="1" label="进行中" value="1"></el-option>
                <!--<el-option key="2" label="暂停" value="2"></el-option>-->
                <el-option key="3" label="已完成" value="3"></el-option>
              </el-select>
            </div>
          </el-col>
          <div style="display:inline-block;margin-right: 30px;">
            <div class="grid-content">
              <label>开始时间：</label>
              <el-date-picker
                style="width:360px;"
                @change="channelChangePicker"
                value-format='timestamp'
                v-model="startTime"
                :editable="false"
                type="datetimerange"
                :picker-options="pickerOptions"
                placeholder="选择开始时间">
              </el-date-picker>
            </div>
          </div>
          <div style="display:inline-block;">
            <div class="grid-content">
              <label>完成时间：</label>
              <el-date-picker
                style="width:360px;"
                @change="channelChangePicker"
                type="datetimerange"
                :editable="false"
                value-format='timestamp'
                v-model="endTime"
                :picker-options="pickerOptions"
                placeholder="选择完成时间">
              </el-date-picker>
            </div>
          </div>
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button size="mini" type="primary" @click="goodsDownList">查 询</el-button>
        <el-button size="mini" type="deafult" @click="RestBtn()">重 置</el-button>
      </div>
    </div>
    <div class="col-border">
      <el-table
        :max-height="t_height"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="taskCode"
          align="center"
          label="任务编号">
          <template slot-scope="scope">
            <span style="color:#409EFF;cursor:pointer;" @click="taskDetailBtn(scope.row)">{{scope.row.taskCode}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskType"
          align="center"
          label="任务类型">
          <template slot-scope="scope">
            <span>{{taskTypeObj[scope.row.taskType]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskStatus"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus == 1" style="color:#409EFF;font-size:14px;">●</span>
            <span v-else-if="scope.row.taskStatus == 3" style="color:green;font-size:14px;">●</span>
            <span v-else style="font-size:14px;">●</span>
            <span>{{taskStatusObj[scope.row.taskStatus]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskStatus"
          align="center"
          label="进度">
          <template slot-scope="scope">
            <span>{{scope.row.completedCount}}</span>/<span>{{scope.row.totalCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createUser"
          align="center"
          label="操作人">
        </el-table-column>
        <el-table-column
          align="center"
          prop="startTime"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="endTime"
          align="center"
          label="完成时间">
        </el-table-column>
        <el-table-column
          prop="comment"
          align="center"
          label="说明">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.taskStatus == 3 || scope.row.taskStatus == 4 || scope.row.taskType == 1" disabled size="small" type="text">终止</el-button>
            <el-button v-else size="small" type="text" style="color:red;" @click="terminateBtn(scope.row)">终止</el-button>
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
        pickerOptions: {  //时间选择区间
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        paramData: {
          taskCode: '',
          taskType: '0',
          taskStatus: '0',
          startTimeBegin:'',
          startTimeEnd:'',
          endTimeBegin:'',
          endTimeEnd:'',
        },
        startTime: '',
        endTime: '',
        t_height:0,
        tableData: [], // 数据列表
        currentPage: 1, //当前页
        pageSize: 15, //当前页条数
        version: '1.0.0',
        totalNum: 0, //总条数
        taskTypeObj: {
          '1': '订单删除',
          '2': '套装更新订单'
        },//任务类型
        taskStatusObj: {
          '1': '进行中',
          '2': '暂停',
          '3': '已完成',
          '4': '终止中'
        },//任务状态
      }
    },
    activated() {
      this.goodsDownList(); //表格数据列表
    },
    beforeRouteLeave(to, from, next) {
      next();
    },
    beforeRouteEnter(to, from, next) {
      next();
    },
    mounted() {   //数据挂载
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
        if (e && e.keyCode == 13 && $('#deleteTask').length == 0 && $('#updateTask').length == 0) { // enter 键
          //要做的事情
          this.goodsDownList();
        }
      };
    },
    methods: {
      // 起始时间
      channelChangePicker() {

      },
      //表格数据列表
      goodsDownList() {
        var paramData = Object.assign(this.paramData, {
          page: this.currentPage,
          size: this.pageSize,
          startTimeBegin:this.startTime && this.startTime[0] ? this.startTime[0] : '',
          startTimeEnd:this.startTime && this.startTime[1] ? this.startTime[1] : '',
          endTimeBegin:this.endTime && this.endTime[0] ? this.endTime[0] : '',
          endTimeEnd:this.endTime && this.endTime[1] ? this.endTime[1] : '',
        })
        this._post('com.edb01.erp.mdata.service.api.TaskPlanService/' + this.version + '/queryTaskPlan', paramData).then(response => {
          if (response.data.success) {
            response.data.result.rows.forEach((item) => {
              item.startTime = item.startTime ? turnTimestamp(item.startTime) : '--';
              item.endTime = item.endTime ? turnTimestamp(item.endTime) : '--';
              item.payTime = item.payTime ? turnTimestamp(item.payTime) : '';
              item.comment = item.comment ? item.comment : '--';
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
        this.paramData = {
          taskCode: '',
          taskType: '0',
          taskStatus: '0',
        };
        this.startTime = [];
        this.endTime = [];
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
      terminateBtn(row) {
        this.$confirm('确定要终止此任务吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/taskStop', {
            taskId:row.taskId,
            taskCode:row.taskCode
          }).then(response => {
            if (response.data.success) {
              this.goodsDownList();
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {});
      },
      //查看任务
      taskDetailBtn(row) {
        if(row.taskType == 1){
          this.$router.push({path: '/deleteTask', query: {taskCode: row.taskCode}});
        }else if(row.taskType == 2){
          this.$router.push({path: '/updateTask', query: {taskCode: row.taskCode}});
        }
      },
    }
  }


</script>

<style scoped>

</style>
