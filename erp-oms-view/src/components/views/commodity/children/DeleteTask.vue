<!--任务详情（删除） 樊虎-->
<template>
  <div id="deleteTask">
    <el-breadcrumb separator="/" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/taskCenter' }">任务中心</el-breadcrumb-item>
      <el-breadcrumb-item>任务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="fh-title">删除任务详情</p>
    <div id="searchBox" style="margin:15px 0 0 0;">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>订单编号：</label>
              <el-input maxlength="20" type="text" placeholder="请输入内容" v-model="paramData.salseOrderNo" @keyup.enter.native="goodsDownList"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>平台单号：</label>
              <el-input type="text" placeholder="请输入内容" v-model="paramData.sourceOrderNo" @keyup.enter.native="goodsDownList"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>删除结果：</label>
              <el-select placeholder="请选择" v-model="paramData.deleteResult">
                <el-option key="2" label="全部" value=""></el-option>
                <el-option key="1" label="成功" value="1"></el-option>
                <el-option key="0" label="失败" value="0"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button size="mini" type="primary" @click="goodsDownList">查 询</el-button>
        <el-button size="mini" type="deafult" @click="RestBtn()">重 置</el-button>
      </div>
    </div>
    <div class="col-border">
      <el-table
        :data="tableData"
        :max-height="t_height"
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
        </el-table-column>
        <el-table-column
          prop="storeName"
          align="center"
          label="店铺">
        </el-table-column>
        <el-table-column
          prop="salseOrderNo"
          align="center"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          align="center"
          label="订单状态">
          <template slot-scope="scope">
            <span>{{orderStatusObj[scope.row.orderStatus]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sourceOrderNo"
          align="center"
          label="平台单号">
        </el-table-column>
        <el-table-column
          prop="deleteTime"
          align="center"
          label="删除时间">
        </el-table-column>
        <el-table-column
          prop="deleteResult"
          align="center"
          label="删除结果">
          <template slot-scope="scope">
            <span>{{deleteResultObj[scope.row.deleteResult]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="deleteReason"
          label="失败原因">
        </el-table-column>
      </el-table>
    </div>
    <div class="col-button">
      <router-link :to="{ path: '/taskCenter' }">
        <el-button style="width:100px;" size="small">返回</el-button>
      </router-link>
    </div>
  </div>
</template>
<script>
  import {turnTimestamp} from '@/assets/js/validate.js';
  export default {
    data() {
      return {
        paramData:{
          salseOrderNo:'',
          sourceOrderNo:'',
          deleteResult:'',
        },
        tableData: [], // 数据列表
        currentPage: 1, //当前页
        pageSize:15, //当前页条数
        version:'1.0.0',
        totalNum: 0, //总条数
        deleteResultObj:{
          '0':'失败',
          '1':'成功'
        },//删除结果
        orderStatusObj:{
          '1':'待客审',
          '2':'已客审',
          '3':'已财审',
          '4':'已仓审',
          '5':'已捡货',
          '6':'已验货',
          '7':'已打包',
          '8':'已称重',
          '9':'已发货',
          '10':'已完成',
          '11':'已取消',
          '12':'已作废',
          '20':'已分配拣货位',
        },//订单状态
        t_height:0,
      }
    },
    mounted() {   //数据挂载
      this.goodsDownList(); //表格数据列表

      //渲染表格高度
      this.$nextTick(function () {
        this.t_height = $(window).height() - $('.col-border').offset().top - 90;
      })
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 90;
      }
    },
    methods: {
      //表格数据列表
      goodsDownList() {
        var paramData = Object.assign(this.paramData,{
          page:this.currentPage,
          size:this.pageSize,
          taskCode:this.$route.query.taskCode
        })
        this._post('com.edb01.erp.mdata.service.api.TaskExecuteOrderdDeleteService/' + this.version +'/qureyDeleteOrder', paramData).then(response => {
          if (response.data.success) {
            response.data.result.forEach((item)=>{
              item.deleteTime = item.deleteTime ? turnTimestamp(item.deleteTime) : '--';
              item.deleteReason = item.deleteReason?item.deleteReason:'--';
            })
            this.tableData = response.data.result;
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
          salseOrderNo:'',
          sourceOrderNo:'',
          deleteResult:'',
        }
      },
      //分页
      handleSizeChange(val) {
        this.currentPage = val;
        this.goodsDownList();
      },
      handleCurrentChange(val) {
        this.pageSize = val;
        this.goodsDownList();
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
    margin-left:5px;
    margin-top:20px;
  }
  .titleText{
    display:inline-block;
    width: 70px;
    text-align: right;
  }
  .line-child{
    width:25%;
  }
</style>
