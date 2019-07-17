<!--赠品调整 樊虎-->
<template>
  <div id="giftAdjust" style='padding-left:20px;'>
    <div v-if="paramsObj.mainPageShow">
      <!--搜索区域-->
      <div id="searchBox">
        <div class="leftBox2">
          <div class="spel-content">
            <el-select v-model="paramData.numberType" placeholder="" style="width:95px !important;">
              <el-option
                v-for="item in effectiveStateArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input size='small' maxlength="50" style="width:180px !important;" v-model="paramData.numberValue"
                      @keyup.enter.native="queryInit"></el-input>
          </div>
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
              type="datetime"
              @change="channelTimeChange(1)"
              placeholder=""
              format='yyyy-MM-dd HH:mm:ss'
              value-format='yyyyMMddHHmmss'>
            </el-date-picker>
          </div>
          <div class="spel-content">
            <label for="" style="width:30px !important;text-align:center;">~</label>
            <el-date-picker
              style="width:180px !important;"
              :editable="false"
              @change="channelTimeChange(2)"
              v-model="paramData.timeEnd"
              type="datetime"
              placeholder=""
              format='yyyy-MM-dd HH:mm:ss'
              value-format='yyyyMMddHHmmss'>
            </el-date-picker>
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
        </div>
        <div class="rightBox2">
          <el-button type="primary" @click='queryInit'>查询</el-button>
          <el-button @click='resetBtn'>重置</el-button>
        </div>
      </div>
      <div style="clear:both;"></div>
      <!--操作导航栏-->
      <div class="col-nav" style="margin:0px 0 15px 0;">
        <ul>
          <li @click="newAdjustBtn" v-if="authorityCode.OMS_GIFTADJUST_ADD"><span>添加调整单</span></li>
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
            min-width="">
            <template slot-scope="scope">
            <span style="cursor: pointer;color:#409EFF;"
                  @click="Hyperlink(scope.row)">{{scope.row.adjustNo}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="giftingWayName"
            label="调整类型"
            min-width=''
            align='center'
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.adjustType==1">商品转赠品</span>
              <span v-else>赠品转商品</span>
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
              {{scope.row.auditRemark=="undefined"?'':scope.row.auditRemark}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align='center'
            width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="(scope.row.auditStatus==1 || scope.row.auditStatus==3) && authorityCode.OMS_GIFTADJUST_EDIT"
                @click="handleEdit(scope.$index, scope.row)">修改
              </el-button>
              <el-button
                type="text"
                v-if="(scope.row.auditStatus==1 || scope.row.auditStatus==3) && authorityCode.OMS_GIFTADJUST_AUDIT"
                @click="handleExamine(scope.$index, scope.row)">审核
              </el-button>
              <el-button
                v-if="(scope.row.auditStatus==1 || scope.row.auditStatus==3) && authorityCode.OMS_GIFTADJUST_CANCEL"
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
    <!--查看修改新建-->
    <adjust-list v-else :params="paramsObj" @changeShow="changeShow"></adjust-list>
  </div>
</template>

<script>
  import {turnTimestamp,turnTimestamp3, turnTimestamp4} from '@/assets/js/validate.js';
  import AdjustList from '@/components/views/commodity/children/AdjustEdit.vue';
  export default {
    components: {
      AdjustList
    },
    data() {
      return {
        paramsObj:{
          mainPageShow:true,
        },//组件传参
        version: '1.0.0',
        totalNum: 0,
        totalPage: 15,
        currentPage: 1,
        tableData: [],//主数据data
        paramData: {
          auditStatus:'',
          numberValue:'',
          adjustType:'',
          numberType:0,
          dateType:0,
          page: 1,
          size: 15,
          adjustdate: [],
          timeBegin:'',
          timeEnd:''
        },//查询条件
        adjustdate:[],//记录日期状态
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
        ],//查询条件下拉
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
            label: '商品转赠品',
            value: 1
          },
          {
            label: '赠品转商品',
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
    }, methods: {
      //组件回传
      changeShow(param){
        if(param && param.isRefresh){
          this.queryInit();
        }
        this.paramsObj.mainPageShow = true;
      },
      //查询条件初始化
      queryInit() {
        this.paramData.adjustNo='';//调整单号
        this.paramData.auditer='';//审核人
        this.paramData.creater='';//创建人
        this.paramData.auditTimeBegin='';//审核开始时间
        this.paramData.auditTimeEnd='';//审核结束时间
        this.paramData.createTimeBegin='';//创建开始时间
        this.paramData.createTimeEnd='';//创建结束时间

        switch(this.paramData.numberType){
          case 0:
            this.paramData.adjustNo=this.paramData.numberValue;
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
        this._post('com.edb01.erp.wms.service.api.WmGiftAdjustService/' + this.version + '/queryAdjustListByConditions', this.paramData).then((response) => {
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
          adjustdate: [],
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
      //新建赠品策略
      newAdjustBtn() {
        //this.$router.push({name: 'adjustEdit', params: {adjustId: 'fanhu', type: 1}});
        this.paramsObj = {
          adjustId:'fanhu',
          type:1,
          mainPageShow:false
        }
      },
      //修改
      handleEdit(index, row) {
        //this.$router.push({name: 'adjustEdit', params: {adjustId: row.adjustId, type: 3}});
        this.paramsObj = {
          adjustId:row.adjustId,
          type:3,
          mainPageShow:false
        }
      },
      //审核
      handleExamine(index, row) {
        //this.$router.push({name: 'adjustEdit', params: {adjustId: row.adjustId, type: 4}});
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
          this._post('com.edb01.erp.wms.service.api.WmGiftAdjustService/' + this.version + '/cancelAdjust', {
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
        //this.$router.push({name: 'adjustEdit', params: {adjustId: row.adjustId, type: 2}});
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
      //选择时间校验
      channelTimeChange(item){
        if(item==1){
          if(new Date(turnTimestamp4(this.paramData.timeEnd)).getTime()<new Date(turnTimestamp4(this.paramData.timeBegin)).getTime()){
            this.$message({
              message:'起始时间不能大于结束时间',
              type: 'warning'
            });
            this.paramData.timeBegin='';
          }else if(new Date(turnTimestamp4(this.paramData.timeEnd)).getTime()-new Date(turnTimestamp4(this.paramData.timeBegin)).getTime()>2678400000){
            this.$message({
              message:'起止时间最长时间不超过31天',
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
          }else if(new Date(turnTimestamp4(this.paramData.timeEnd)).getTime()-new Date(turnTimestamp4(this.paramData.timeBegin)).getTime()>2678400000){
            this.$message({
              message:'起止时间最长时间不超过31天',
              type: 'warning'
            });
            this.paramData.timeEnd='';
          }
        }
      },
      //初始化时间区间
      initPickerTime(){
        var today=new Date().toLocaleDateString().replace(/\//g,'-');
        this.adjustdate=[turnTimestamp3(today+' 0:0:0'),turnTimestamp3(today+' 23:59:59')];
        this.paramData.adjustdate=[turnTimestamp3(today+' 0:0:0'),turnTimestamp3(today+' 23:59:59')];
        this.paramData.timeBegin=this.paramData.adjustdate[0];
        this.paramData.timeEnd=this.paramData.adjustdate[1];
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
