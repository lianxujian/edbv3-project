<!--任务详情（更新） 樊虎-->
<template>
  <div id="updateTask" style="padding-bottom:90px !important;">
    <el-breadcrumb separator="/" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/taskCenter' }">任务中心</el-breadcrumb-item>
      <el-breadcrumb-item>任务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="fh-title">基本信息</p>
    <div class="formatLine">
      <div class="line-child"><span class="titleText">条形码：</span><span class="valueStyle ellipsis"
                                                                       :title="rowInfo.barCode">{{rowInfo.barCode}}</span>
      </div>
      <div class="line-child"><span class="titleText">套装名称：</span><span class="valueStyle ellipsis"
                                                                        :title="rowInfo.goodsName">{{rowInfo.goodsName}}</span>
      </div>
      <div class="line-child" style="width:50%;"><span class="titleText">更新范围：</span><span
        class="valueStyle">付款时间晚于 {{rowInfo.payTime}} &nbsp;&nbsp;&nbsp;
        且订单状态为 &nbsp;&nbsp;&nbsp; {{rowInfo.orderStatusMes}}</span></div>
    </div>
    <div class="formatLine">
      <div class="line-child"><span class="titleText">状态：</span><span
        class="valueStyle">{{taskStatusObj[rowInfo.taskStatus]}}</span></div>
      <div class="line-child"><span class="titleText">开始时间：</span><span class="valueStyle">{{rowInfo.startTime}}</span>
      </div>
      <div class="line-child" style="width:50%;"><span class="titleText">完成时间：</span><span
        class="valueStyle">{{rowInfo.endTime}}</span></div>
    </div>
    <p class="fh-title">更新明细</p>
    <div id="searchBox" style="margin:15px 0 0 0;">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>订单编号：</label>
              <el-input type="text" maxlength="20" placeholder="请输入内容" @keyup.enter.native="goodsDownList" v-model="paramData.salseOrderNo"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>更新结果：</label>
              <el-select placeholder="请选择" v-model="paramData.updateResult">
                <el-option key="3" label="全部" value="3"></el-option>
                <el-option key="2" label="未开始" value="2"></el-option>
                <el-option key="1" label="成功" value="1"></el-option>
                <el-option key="0" label="失败" value="0"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <label>更新时间：</label>
              <el-date-picker
                style="width:370px;"
                type="datetimerange"
                :editable="false"
                :picker-options="pickerOptions"
                value-format='timestamp'
                v-model="paramData.updateTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
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
    <!--操作按钮区-->
    <div class="col-nav" style="margin:5px 0 15px 0;">
      <ul v-if="isCarry">
        <li><span @click="rollBack">重新执行</span></li>
      </ul>
      <el-button style="margin-left:10px;" v-else disabled>重新执行</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        max-height="556"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="salseOrderNo"
          align="center"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="taskNo"
          align="center"
          label="商品信息">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="goodsDetailBtn(scope.row)">
              {{scope.row.goodsTypeQty}}/{{scope.row.goodsQty}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodIds"
          align="center"
          label="订单状态">
          <template slot-scope="scope">
            <span>{{orderStatusObj[scope.row.orderStatus]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          align="center"
          label="更新时间">
        </el-table-column>
        <el-table-column
          prop="sourceOrderNo"
          align="center"
          label="平台单号">
        </el-table-column>
        <el-table-column
          prop="updateResult"
          align="center"
          label="更新结果">
          <template slot-scope="scope">
            <span>{{updateResultObj[scope.row.updateResult]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="updateReason"
          label="失败原因">
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:5px;">
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
    <!--操作日志-->
    <p class="fh-title">操作日志</p>
    <div>
      <el-table
        border
        :data="publicLogData"
        style="margin-top:15px;"
      >
        <el-table-column
          type="index"
          align='center'
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="operateName"
          align='center'
          label="操作类型"
          width="">
        </el-table-column>
        <el-table-column
          prop="operateRemark"
          align='center'
          label="操作描述"
          :show-overflow-tooltip='true'
          width="">
        </el-table-column>
        <el-table-column
          prop="operater"
          align='center'
          label="操作人"
          width="">
        </el-table-column>
        <el-table-column
          prop="operateTime"
          align='center'
          min-width=''
          label="操作时间">
        </el-table-column>
        <el-table-column
          prop="opersteIp"
          label="IP"
          min-width=''
          align='center'
          width="">
        </el-table-column>
      </el-table>
    </div>
    <div class="col-button">
      <router-link :to="{ path: '/taskCenter' }">
        <el-button style="width:100px;" size="small">返回</el-button>
      </router-link>
    </div>
    <!--商品详细信息-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="商品详细信息" :visible.sync="goodsDetailDialog"
               v-if="goodsDetailDialog" width="1100px">
      <order-detail-dialog :isOperation="false" :salesOrderId="salesOrderId"></order-detail-dialog>
    </el-dialog>
  </div>
</template>
<script>
  import {turnTimestamp, returnTimesStamp} from '@/assets/js/validate.js';
  import OrderDetailDialog from '@/components/common/OrderDetailDialog.vue';

  export default {
    components: {
      OrderDetailDialog
    },
    data() {
      return {
        publicLogData: [],//操作日志
        goodsDetailDialog: false,//商品详情弹框显隐
        salesOrderId: '',//订单id
        pickerOptions: {  //时间选择区间
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        paramData: {
          salseOrderNo: '',
          updateResult: '3',
          updateTime: [],
        },
        tableData: [], // 数据列表
        currentPage: 1, //当前页
        pageSize: 15, //当前页条数
        version: '1.0.0',
        totalNum: 0, //总条数
        isRefresh: false,
        baseInfos: {},
        updateResultObj: {
          '1': '成功',
          '0': '失败',
          '2': '未开始',
        },//更新结果
        orderStatusObj: {
          '1': '待客审',
          '2': '已客审',
          '3': '已财审',
          '4': '已仓审',
          '5': '已捡货',
          '6': '已验货',
          '7': '已打包',
          '8': '已称重',
          '9': '已发货',
          '10': '已完成',
          '11': '已取消',
          '12': '已作废',
          '20': '已分配拣货位',
        },//订单状态
        taskStatusObj: {
          '1': '进行中',
          '2': '暂停',
          '3': '已完成',
          '4': '终止中'
        },//任务状态
        rowInfo: {},//该任务的详细信息
        isCarry: false,
      }
    },
    beforeRouteLeave(to, from, next) {
      //不可行
      /*if(this.isRefresh){//刷新
        to.meta.keepAlive = false;
      }else{//不刷新
        to.meta.keepAlive = true;
      }*/
      next();
    },
    mounted() {
      //获取该任务详细信息
      this.renderTaskDetail();
    },
    methods: {
      //获取该任务详细信息
      renderTaskDetail() {
        this._post('com.edb01.erp.mdata.service.api.TaskPlanService/' + this.version + '/queryTaskPlan', {
          taskCode: this.$route.query.taskCode,
          taskType: 0,
          taskStatus: 0,
          startTime: '',
          endTime: '',
          page: 1,
          size: 15
        }).then(response => {
          if (response.data.success) {
            response.data.result.rows.forEach((item) => {
              item.startTime = item.startTime ? turnTimestamp(item.startTime) : '--';
              item.endTime = item.endTime ? turnTimestamp(item.endTime) : '--';
              item.payTime = item.payTime ? turnTimestamp(item.payTime) : '';
              item.comment = item.comment ? item.comment : '--';
            })
            this.rowInfo = response.data.result.rows[0];
            this.goodsDownList(); //表格数据列表
            this.taskLogs();
            this.reCarry();
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //判断是否可以重新执行
      reCarry() {
        this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/taskPerformStatus', {
          taskId: this.rowInfo.taskId,
          taskCode: this.rowInfo.taskCode,
          goodsId: this.rowInfo.goodsId,
        }).then(response => {
          if (response.data.success) {
            this.isCarry = true;
          } else {
            this.isCarry = false;
          }
        })
      },
      //操作日志
      taskLogs() {
        this._post('com.edb01.erp.mdata.service.api.TaskLogsService/' + this.version + '/qureyTaskLogs', {
          taskId: this.rowInfo.taskId
        }).then((response) => {
          if (response.data.success) {
            this.publicLogData = response.data.result;
            this.publicLogData.forEach((item, i) => {
              item.operateTime = turnTimestamp(item.operateTime);
              switch(item.operateType){
                case 0:
                  item.operateName = '【套装更新订单】—任务开始';
                  break;
                case 1:
                  item.operateName = '【套装更新订单】—任务完成';
                  break;
                case 2:
                  item.operateName = '【套装更新订单】—任务暂停';
                  break;
                case 3:
                  item.operateName = '【套装更新订单】—任务继续';
                  break;
                case 4:
                  item.operateName = '【套装更新订单】—任务终止';
                  break;
                case 5:
                  item.operateName = '【套装更新订单】—重新执行';
                  break;
              }
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //重新执行
      rollBack() {
        this.$confirm('确定要重新执行吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/taskPerformStatus', {
            taskId: this.rowInfo.taskId,
            taskCode: this.rowInfo.taskCode,
            goodsId: this.rowInfo.goodsId,
          }).then(response => {
            if (response.data.success) {
              this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/taskPerform', {
                taskId: this.rowInfo.taskId,
                payTime: this.rowInfo.payTime ? returnTimesStamp(this.rowInfo.payTime) : '',
                orderStatus: this.rowInfo.orderStatus,
                goodsId: this.rowInfo.goodsId,
                taskCode: this.rowInfo.taskCode,
              }).then(response => {
                if (response.data.success) {
                  this.renderTaskDetail();
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {
        });
      },
      //表格数据列表
      goodsDownList() {
        var paramData = Object.assign(this.paramData, {
          page: this.currentPage,
          size: this.pageSize,
          taskCode: this.rowInfo.taskCode,
          updateTimeBegin: this.paramData.updateTime && this.paramData.updateTime[0] ? this.paramData.updateTime[0] : '',
          updateTimeEnd: this.paramData.updateTime && this.paramData.updateTime[1] ? this.paramData.updateTime[1] : '',
        })
        this._post('com.edb01.erp.mdata.service.api.TaskExecuteProductUpdateService/' + this.version + '/queryTaskExecute', paramData).then(response => {
          if (response.data.success) {
            response.data.result.rows.forEach((item) => {
              item.updateTime = item.updateTime ? turnTimestamp(item.updateTime) : '--';
              item.updateReason = item.updateReason ? item.updateReason : '--';
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
          salseOrderNo: '',
          updateResult: '3',
          updateTime: [],
        }
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
      //商品信息
      goodsDetailBtn(row) {
        this.salesOrderId = row.salseOrderId;
        this.goodsDetailDialog = true;
      },
    }
  }


</script>

<style scoped>
  .formatLine {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    margin-left: 5px;
    margin-top: 20px;
  }

  .titleText {
    display: inline-block;
    width: 70px;
    text-align: right;
  }
  .ellipsis{
    width:225px;
    display:inline-block;
    margin-bottom:-5px;
  }
  .line-child {
    width: 25%;
  }
</style>
