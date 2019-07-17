<!--操作日志 贾南风-->
<template>
  <div class="operationLog">
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="12">
            <div class="grid-content">
              <label>起止时间：</label>
              <el-date-picker
                style="width: 30%!important"
                @change="methodsS"
                type="datetime"
                v-model="queryData.startTime"
                :picker-options="pickerOptions1"
                placeholder="选择日期时间">
              </el-date-picker>
              <label>至：</label>
              <el-date-picker
                @change="methodsM"
                style="width: 30%!important"
                type="datetime"
                v-model="queryData.endTime"
                :picker-options="pickerOptions2"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>单据类型：</label>
              <el-select   v-model="queryData.sourceType" placeholder="请选择" @change="typeData()">
                <el-option
                  v-for="item in itemType"
                  :key="item.id"
                  :label="item.module"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>操作类型：</label>
              <el-select  clearable placeholder="请选择" v-model="queryData.operateType">
                <el-option
                  v-for="item in operationType"
                  :key="item.type"
                  :label="item.value"
                  :value="item.type">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <label>条件：</label>
              <el-select   placeholder="请选择" style="width: 20%!important" v-model="operater" @change="oneMethods()">
                <el-option
                  v-for="item in state"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-input v-if="operater==1" v-model="queryData.operater" placeholder="" style="width: 30%!important;"></el-input>
              <el-input v-else v-model="queryData.sourceId"  placeholder="" style="width: 30%!important;"></el-input>
            </div>
          </el-col>
        <!--  <el-col :span="6">
            <div class="grid-content">

            </div>
          </el-col>-->
        </el-row>
      </div>
      <div class="rightBox1">
        <el-button size="mini" type="primary" @click="queryFn()">查 询</el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData"
        id="fitTable"
        tooltip-effect="dark"
        :height="table_h"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="sourceTypeName"
          :show-overflow-tooltip="true"
          label="单据类型">
        </el-table-column>
        <el-table-column
          prop="sourceId"
          :show-overflow-tooltip="true"
          label="单据编号">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="operateName"
          label="操作类型">
        </el-table-column>
        <el-table-column
          prop="operateRemark"
          :show-overflow-tooltip="true"
          label="操作描述">
        </el-table-column>
        <el-table-column
          prop="operater"
          :show-overflow-tooltip="true"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="operateTime"
          label="操作时间">
        </el-table-column>
        <el-table-column
          prop="opersteIp"
          label="IP">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop=""
          label="备注">
        </el-table-column>
      </el-table>
    </div>
    <div class="col-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[50, 100,200]"
        :page-size="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { turnTimestamp } from '@/assets/js/validate';
  export default {
    data() {
      return {

        //限制只能输入最近三个月
        pickerOptions2:{
          disabledDate(time){
            let curDate = (new Date()).getTime();
            let three = 90 * 24 * 3600 * 1000;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          },
        },
        pickerOptions1: {
          disabledDate(time) {
                let curDate = (new Date()).getTime();
                let three = 90 * 24 * 3600 * 1000;
                let threeMonths = curDate - three;
                return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
        queryFn: ()=>{},// 方法
        tableData: [], //表格接受
        table_h: 0, // 高度
        version: '1.0.0',//版本号
        operater: 1, // 操作人
        operationType: [],// 操作类型
          queryData: {//查询条件
            sourceType: 40,
            startTime: '',
            endTime: '',
            operater: '',
            sourceId: '',
            operateType: '',
            page: 1,
            size: 50,
          },
          itemType: [ // 单据类型
            {id: 10, module: '店铺'},
            {id: 12, module: '快递档案'},
            {id: 13, module: '仓库档案'},
            {id: 14, module: '库区管理'},
            {id: 15, module: '库位管理'},
            {id: 16, module: '属地仓设置'},
            {id: 17, module: '商品指定仓设置'},
            {id: 18, module: '波次策略'},
            {id: 19, module: '审单方案'},
            {id: 20, module: '单品'},
            {id: 21, module: '套装'},
            {id: 22, module: '商品自定义属性'},
            {id: 23, module: '品牌'},
            {id: 24, module: '上架策略'},
            {id: 25, module: '下架策略'},
            {id: 26, module: '供应商'},
            {id: 27, module: '发票'},
            {id: 28, module: '发票基础设置'},
            {id: 29, module: '税务编号设置'},
            {id: 30, module: '税率设置'},
            {id: 31, module: '批次设置'},
            {id: 32, module: '订单标记'},
            {id: 33, module: '智能仓库配置'},
            {id: 34, module: '订单设置'},
            {id: 35, module: '入库流程设置'},
            {id: 36, module: '出库流程设置'},
            {id: 37, module: '行业化插件'},
            {id: 38, module: '分类'},
            {id: 39, module: '出库单'},
            {id: 40, module: '订单'},
            {id: 41, module: '波次列表'},
            {id: 42, module: '上架'},
            {id: 43, module: '移位'},
            {id: 44, module: '损益单'},
            {id: 45, module: '库存'},
            {id: 46, module: '仓储-异常原因'},
            {id: 47, module: '智能仓库'},
            {id: 48, module: '仓库异常单'},
            {id: 49, module: '赠品调整单'},
            {id: 50, module: '虚拟套装调整单'},
            {id: 51, module: '库存调整'},
            {id: 53, module: '同步库存策略'},
            {id: 54, module: '策略设置'},
            {id: 55, module: '仓库绑定快递'},
            {id: 56, module: '入库单管理'},
            {id: 58, module: '智能快递'}
          ],
          state: [ // 条件
            {name: '操作人', id: 1},
            {name: '单据编号', id: 2},
          ], // 授权状态
          currentPage: 1,//当前页
          totalPage: 15, // 要显示的条数
          totalNum: 0 // 数据总条数
        }
    },
    methods:{

      // 单据类型改变时触发
      typeData() {
        this.queryData.operateType = '';
        this._post('com.edb01.erp.log.service.api.OperateLogService/' + this.version + '/getEnum',{id: this.queryData.sourceType})
          .then( res => {
            if(res.data.success== true){
              this.operationType = res.data.result;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })

      },

      // 起始时间
      methodsS() {
        if(this.queryData.endTime){
          if(this.queryData.startTime > this.queryData.endTime){
            this.queryData.endTime = '';
          }else{
            //this.queryData.endTime == ''
          }
        }
      },

      // 结束时间
      methodsM() {
        if(this.queryData.startTime){
          if(this.queryData.startTime > this.queryData.endTime){
              this.queryData.endTime = '';
          }else{
            //this.queryData.endTime == ''
          }
        }else{

        }
       /* console.log(this.queryData.startTime > this.queryData.endTime);
        console.log(this.queryData.endTime);*/
      },

      // 选择条件
      oneMethods(){
        if(this.operater == 1){
        this.queryData.sourceId  = '';
        }else{
          this.queryData.operater = '';
        }
      },

      // 当前页
      handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val;
        this.queryData.page = this.currentPage;
        this.queryData.size = this.totalPage;

        this.queryFn(); // 请求数据
      },

      // 中国标准时间转换为时间戳
      dateToMs (date) {
        let result = new Date(date).getTime();
        return result;
      },

  // 分页
      // 每页多少条
      handleSizeChange(val) {
        console.log(val);
        this.totalPage = val;
//        sessionStorage.setItem('hold_LogFiles_1', val);
        this.queryData.page = this.currentPage;
        this.queryData.size = this.totalPage;
        this.queryFn();// 请求数据
      },
    },
    created() {
//      if(sessionStorage.getItem('hold_LogFiles_1') !== null) {
//        this.totalPage = parseInt(sessionStorage.getItem('hold_LogFiles_1'))
//      }

      //查询
      this.queryFn = () => {
        if(this.queryData.startTime == ''){

        }else{
          this.queryData.startTime = this.dateToMs(this.queryData.startTime);
        }
        if(this.queryData.endTime == ''){

        }else{
          this.queryData.endTime = this.dateToMs(this.queryData.endTime);
        }

        if(this.queryData.startTime==0){
          this.queryData.startTime='';
        }
        if(this.queryData.endTime==0){
          this.queryData.endTime='';
        }


        console.log(this.queryData);
        this._post('com.edb01.erp.log.service.api.OperateLogService/' + this.version + '/getLogDataPager',this.queryData)
          .then(res => {
            if(res.data.success == true){
              res.data.result.rows.forEach(item => {
                if(item.operateTime){
                  item.operateTime = turnTimestamp(item.operateTime)
                }
              })
              this.tableData = res.data.result.rows;
              this.totalNum = res.data.result.total;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }

          })
      }
      this.queryFn();//查询
    },
    mounted(){

      //表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight;// 页面高度
        var b = document.getElementById('fitTable').offsetTop; // 表格距离顶部的距离
        this.table_h = a - b - 94;
      });
      window.onresize = () => {
        this.table_h = $(window).height() - $('#fitTable').offset().top - 94;
      };

    },
  }
</script>
