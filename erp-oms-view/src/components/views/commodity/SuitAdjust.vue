<!--虚拟套装调整 樊虎-->
<template>
  <div id="giftAdjust" style='padding-left:20px;'>
    <div v-if="paramsObj.mainPageShow">
      <!--查询搜索区-->
      <div id="searchBox">
        <div class="leftBox2">
          <div class="spel-content">
            <el-select v-model="paramData.dateType" placeholder="" style="width:95px !important;">
              <el-option
                v-for="item in timeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker
              style="width:180px !important;"
              :editable="false"
              v-model="paramData.timeBegin"
              @change="channelTimeChange(1)"
              type="datetime"
              placeholder=""
              format='yyyy-MM-dd HH:mm:ss'
              value-format='yyyyMMddHHmmss'>
            </el-date-picker>
          </div>
          <div class="spel-content">
            <label for="" style="width:95px !important;padding-right:15px;">至</label>
            <el-date-picker
              style="width:180px !important;"
              :editable="false"
              v-model="paramData.timeEnd"
              @change="channelTimeChange(2)"
              type="datetime"
              placeholder=""
              format='yyyy-MM-dd HH:mm:ss'
              value-format='yyyyMMddHHmmss'>
            </el-date-picker>
          </div>
          <div class="spel-content">
            <el-select v-model="paramData.numberType" placeholder="" style="width:95px !important;">
              <el-option
                v-for="item in effectiveStateArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input size='small' maxlength="50" style="width:180px !important;" v-model="paramData.numberValue"></el-input>
          </div>
          <div class="spel-content">
            <label for="" style="width:95px !important;">调整类型：</label>
            <el-select v-model="paramData.adjustType" placeholder="" style="width:180px !important;">
              <el-option
                v-for="item in adjustTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="spel-content">
            <label for="" style="width:95px !important;">调整状态：</label>
            <el-select v-model="paramData.auditStatus" placeholder="" style="width:180px !important;">
              <el-option
                v-for="item in adjustStateArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="rightBox2">
          <el-button type="primary" @click='queryInit'>查询</el-button>
          <el-button @click='resetBtn'>重置</el-button>
        </div>
      </div>
      <div style="clear:both;"></div>
      <!--操作按钮区-->
      <div class="col-nav" style="margin:0px 0 15px 0;">
        <ul>
          <li @click="newAdjustBtn" v-if="authorityCode.OMS_SUITADJUST_ADD"><span>添加调整单</span></li>
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
            align='center'
            label="调整单号"
            width="110">
            <template slot-scope="scope">
            <span style="cursor: pointer;color:#409EFF;"
                  @click="Hyperlink(scope.row)">{{scope.row.adjustOrderNo}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="giftingWayName"
            label="调整类型"
            min-width=''
            align='center'
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.adjustType==1">单品转套装</span>
              <span v-else>套装转单品</span>
            </template>
          </el-table-column>
          <el-table-column
            align='center'
            min-width=''
            label="调整状态">
            <template slot-scope="scope">
              <span v-if="scope.row.auditStatus==1">待审核</span>
              <span v-if="scope.row.auditStatus==2">已审核</span>
              <span v-if="scope.row.auditStatus==3">审核拒绝</span>
              <span v-if="scope.row.auditStatus==4">已作废</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="creater"
            label="创建人"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align='center'
            label="创建时间"
            width="140">
          </el-table-column>
          <el-table-column
            prop="auditer"
            align='center'
            label="审核人"
            width="">
          </el-table-column>
          <el-table-column
            prop="auditTime"
            align='center'
            label="审核时间"
            width="140">
          </el-table-column>
          <el-table-column
            prop="auditRemark"
            align='center'
            label="审核备注"
            width=""
            :show-overflow-tooltip='true'>
            <template slot-scope="scope">
              {{scope.row.auditRemark=='undefined'?'':scope.row.auditRemark}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align='center'
            width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="(scope.row.auditStatus==1 || scope.row.auditStatus==3) && authorityCode.OMS_SUITADJUST_EDIT"
                @click="handleEdit(scope.$index, scope.row)">修改
              </el-button>
              <el-button
                type="text"
                v-if="(scope.row.auditStatus==1 || scope.row.auditStatus==3) && authorityCode.OMS_SUITADJUST_AUDIT"
                @click="handleExamine(scope.$index, scope.row)">审核
              </el-button>
              <el-button
                v-if="(scope.row.auditStatus==1 || scope.row.auditStatus==3) && authorityCode.OMS_SUITADJUST_CANCEL"
                type="text"
                style="color:red;"
                @click="handleVoid(scope.$index, scope.row)">作废
              </el-button>
            </template>
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
    <suit-list v-else :params="paramsObj" @changeShow="changeShow"></suit-list>
  </div>
</template>

<script>
  import {turnTimestamp,turnTimestamp3, turnTimestamp4} from '@/assets/js/validate.js';
  import SuitList from '@/components/views/commodity/children/SuitEdit.vue';
  export default {
    provide(){
      return {//把表单实例作为参数传递下去，子代可以直接使用
        form:this
      }
    },
    components: {
      SuitList
    },
    data() {
      return {
        paramsObj:{
          mainPageShow:true,
        },//入参
        version: '1.0.0',
        totalNum: 0,
        totalPage: 15,
        currentPage: 1,
        tableData: [],//表格数据
        paramData: {
          auditStatus:'',
          numberValue:'',
          adjustType:'',
          numberType:0,
          dateType:0,
          page: 1,
          size: 15,
          timeBegin:'',
          timeEnd:''
        },//查询参数
        effectiveStateArr: [
          {
            label: '调整单号',
            value: 0
          },
          {
            label: '创建人',
            value: 1
          },
          {
            label: '审核人',
            value: 2
          }
        ],//调整单号 创建人 审核人
        adjustStateArr: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '待审核',
            value: 1
          },
          {
            label: '已审核',
            value: 2
          },
          {
            label: '审核拒绝',
            value: 3
          },
          {
            label: '已作废',
            value: 4
          }
        ],//调整状态
        adjustTypeArr: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '单品转套装',
            value: 1
          },
          {
            label: '套装转单品',
            value: 2
          }
        ],//调整类型
        timeArr: [
          {
            label: '创建时间',
            value: 0
          },
          {
            label: '审核时间',
            value: 1
          }
        ],//时间类型下拉
        t_height: 0,
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
      }
    },
    methods: {
      //组件回传
      changeShow(param){
        if(param && param.isRefresh){
          this.queryInit();
        }
        this.paramsObj.mainPageShow = true;
      },
      //查询条件初始化
      queryInit() {
        this.paramData.adjustOrderNo='';//调整单号
        this.paramData.auditer='';//审核人
        this.paramData.creater='';//创建人
        this.paramData.auditTimeBegin='';//审核开始时间
        this.paramData.auditTimeEnd='';//审核结束时间
        this.paramData.createTimeBegin='';//创建开始时间
        this.paramData.createTimeEnd='';//创建结束时间

        switch(this.paramData.numberType){
          case 0:
            this.paramData.adjustOrderNo=this.paramData.numberValue;
            break;
          case 1:
            this.paramData.creater=this.paramData.numberValue;
            break;
          case 2:
            this.paramData.auditer=this.paramData.numberValue;
            break;
        }
        switch(this.paramData.dateType){
          case 0:
            this.paramData.createTimeBegin=this.paramData.timeBegin;
            this.paramData.createTimeEnd=this.paramData.timeEnd;
            break;
          case 1:
            this.paramData.auditTimeBegin=this.paramData.timeBegin;
            this.paramData.auditTimeEnd=this.paramData.timeEnd;
            break;
        }
        this._post('com.edb01.erp.wms.service.api.WmVirtualsuitAdjustService/' + this.version + '/queryAdjustListByConditions', this.paramData).then((response) => {
          if (response.data.success) {
            //下拉框插件
            this.tableData = response.data.result.rows;
            this.tableData.forEach((item, i) => {
              item.createTime = item.createTime?turnTimestamp4(item.createTime):'';
              item.auditTime = item.auditTime?turnTimestamp4(item.auditTime):'';
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
      //重置
      resetBtn() {
        this.paramData={
          auditStatus:'',
          numberValue:'',
          adjustType:'',
          numberType:0,
          dateType:0,
          page: 1,
          size: 15,
          timeBegin:'',
          timeEnd:''
        }
        this.initPickerTime();
      },
      handleSizeChange(val) {
        this.paramData.size = val;
        this.totalPage = val;
        this.queryInit();
      },
      handleCurrentChange(val) {
        this.paramData.page = val;
        this.queryInit();
      },
      //时间区间校验
      channelTimeChange(item){
        if(item==1){
          if(new Date(turnTimestamp4(this.paramData.timeEnd)).getTime()<new Date(turnTimestamp4(this.paramData.timeBegin)).getTime()){
            this.$message({
              message:'起始时间不能大于结束时间',
              type: 'warning'
            });
            this.paramData.timeBegin='';
          }
        }else if(item==2){
          if(new Date(turnTimestamp4(this.paramData.timeEnd)).getTime()<new Date(turnTimestamp4(this.paramData.timeBegin))){
            this.$message({
              message:'结束时间不能小于起始时间',
              type: 'warning'
            });
            this.paramData.timeEnd='';
          }
        }
      },
      //新建赠品策略
      newAdjustBtn() {
        //this.$router.push({name: 'suitEdit', params: {adjustId: 'fanhu', type: 1}});
        this.paramsObj = {
          adjustId:'fanhu',
          type:1,
          mainPageShow:false
        }
      },
      //修改
      handleEdit(index, row) {
        //this.$router.push({name: 'suitEdit', params: {adjustId: row.adjustId, type: 3}});
        this.paramsObj = {
          adjustId:row.adjustId,
          type:3,
          mainPageShow:false
        }
      },
      //审核
      handleExamine(index, row) {
        //this.$router.push({name: 'suitEdit', params: {adjustId: row.adjustId, type: 4}});
        this.paramsObj = {
          adjustId:row.adjustId,
          type:4,
          mainPageShow:false
        }
      },
      //作废
      handleVoid(index, row) {
        this.$confirm('确定要作废此调整单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.wms.service.api.WmVirtualsuitAdjustService/' + this.version + '/cancelSuitAdjustById', {
            adjustId:row.adjustId
          }).then((response) => {
            if (response.data.success) {
              this.queryInit();
              this.$message({
                message: '作废成功！',
                type: 'success'
              });
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
      //超链接查看
      Hyperlink(row) {
        //this.$router.push({name: 'suitEdit', params: {adjustId: row.adjustId, type: 2}});
        this.paramsObj = {
          adjustId:row.adjustId,
          type:2,
          mainPageShow:false
        }
      },
      //时间区间change
      channelPicker(){
        if(this.paramData.adjustdate){
          var adjustStart=this.paramData.adjustdate[0],adjustEnd=this.paramData.adjustdate[1];
          if(new Date(turnTimestamp4(adjustEnd)).getTime()-new Date(turnTimestamp4(adjustStart)).getTime()>2678400000){
            this.$message({
              message:'起止时间最长时间不超过31天',
              type: 'warning'
            });
            this.paramData.adjustdate=this.adjustdate;
          }
        }
      },
      //初始化时间区间
      initPickerTime(){
        var today=new Date().toLocaleDateString().replace(/\//g,'-');
        //this.paramData.timeBegin=turnTimestamp3(today+' 0:0:0');
        this.paramData.timeEnd=turnTimestamp3(today+' '+new Date().toTimeString().slice(0,8));
        var timeBegin=new Date(turnTimestamp4(this.paramData.timeEnd)).getTime()-2592000000;
        this.paramData.timeBegin=turnTimestamp3(turnTimestamp(timeBegin));
      }
    },
    mounted() {
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
        if (e && e.keyCode == 13) { // enter 键
          //要做的事情
          this.queryInit();
        }
      };
      //初始化时间控件
      this.initPickerTime();
      //初始化查询
      this.queryInit();
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  .template-div {
    margin-bottom: 20px;
  }

  .template-div span {
    display: inline-block;
    width: 80px;
    text-align: right;
  }

  .input-box label {
    width: 70px;
    display: inline-block;
    text-align: right;
    margin-right: 1px;
  }
  .spel-content{
    display:inline-block;
    margin-right:30px;
    margin-bottom:15px;
  }
  .spel-content>label{
    text-align:right;
  }
</style>
<style>
  .el-dialog__footer {
    text-align: center;
  }
</style>
