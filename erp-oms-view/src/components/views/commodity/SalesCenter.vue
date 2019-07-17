<!--促销中心 樊虎-->
<template>
  <div id="salesCenter" style="padding-bottom:0px !important;">
    <div style="margin-bottom:15px;"><!--:disabled="!authorityCode.OMS_GIFTSTRATEGY_STATUS" -->
      <el-switch v-model="holdOrderFlag" @change="switchBtn(holdOrderFlag)" :disabled="!authorityCode.OMS_SALESCENTER_STATUS"></el-switch>
      <span style="margin:0 15px;"> HOLD单店铺：</span>
      <span v-if="storeNameString.length<=60">{{storeNameString}}</span>
      <span v-else :title="storeNameString">{{storeNameString.slice(0,60)}}...</span>
      <i class="el-icon-edit" v-if="authorityCode.OMS_SALESCENTER_EDIT" style="margin-left:15px;color:#409EFF;cursor:pointer;font-weight:bold;" @click="editStoreBtn"></i>
      <div style="display: inline-block;float:right;font-size:16px;">
        <!--<span v-if="isDisplay"> <span style="color:#409EFF;cursor:pointer;" @click="displayBtn">展开</span> / <span>收起</span></span>
        <span v-else> <span>展开</span> / <span style="color:#409EFF;cursor:pointer;" @click="displayBtn">收起</span></span>-->
        <div style="float:left;width:36px;height:15px;" v-if="cardData.length > tabCardNum">
          <transition name="shows">
            <span class="showHide" v-if="isDisplay" @click="displayBtn">展开<i style="cursor:pointer;" class="el-icon-arrow-up"></i></span>
          </transition>
          <transition name="shows">
            <span class="showHide" v-if="!isDisplay" @click="displayBtn">收起<i style="cursor:pointer;" class="el-icon-arrow-down"></i></span>
          </transition>
        </div>
        <i class="el-icon-refresh" style="margin-left:25px;font-size:16px;color:#409EFF;cursor:pointer;font-weight:bold;" @click="refreshBtn"></i>
      </div>
    </div>
    <div style="margin:0 -15px 10px 0;":class="{'display-active':isDisplay}">
      <div :class="{'box-card':true,'highlight-active':cardIndex == i}" v-for="(item,i) in cardData" @click="cardTab(i,item)">
        <el-tag v-if="item.openFlag" class="box-card-tag" size="mini" type="success">进行中</el-tag>
        <el-tag v-else class="box-card-tag" size="mini" type="danger">已结束</el-tag>
        <div class="box-card-header ellipsis" :title="item.storeName">{{item.storeName}}</div>
        <div class="box-card-content">{{item.orderNum}}</div>
        <div class="box-card-footer">
          <el-button type="text" :disabled="!authorityCode.OMS_SALESCENTER_RELEASE" @click="releaseBtn($event,i,item)">释放</el-button>
          <el-button type="text" @click="querySalesBtn($event,i,item)">查促销</el-button>
        </div>
      </div>
    </div>
    <div id="searchBox">
      <div class="leftBox2" style="margin-right:195px">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>平台编号：</label>
              <el-input type="text" placeholder="请输入内容" maxlength="20" v-model="paramData.sourceOrderNo"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>促销编号：</label>
              <el-input type="text" placeholder="请输入内容" maxlength="20" v-model="paramData.strategyNo"></el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <label>状态：</label>
              <el-select placeholder="请选择" style="width:95px !important;" v-model="paramData.timeType">
                <el-option key="1" label="付款时间" value="1"></el-option>
                <el-option key="2" label="下单时间" value="2"></el-option>
              </el-select>
              <el-date-picker style="width:340px;padding:3px;" :clearable="false" v-model="pickerTimer" type="datetimerange"
                              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
                              :editable="false">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox2" style="width:195px">
        <el-button size="mini" type="primary" style="width:80px !important;" @click="getTableList">查 询</el-button>
        <el-button size="mini" type="deafult" style="width:80px !important;" @click="RestBtn()">重 置</el-button>
      </div>
    </div>
    <div class="col-border">
      <ag-grid-vue :style='{"height":t_height+"px","width": "100%"}'
                   v-loading="agLoading"
                   element-loading-text="拼命加载中"
                   element-loading-spinner="el-icon-loading"
                   class="ag-theme-balham ag-table"
                   :gridOptions="gridOptions"
                   :columnDefs="columnDefs"
                   :rowData="tableData">
      </ag-grid-vue>
    </div>
    <div style="text-align:right;margin-top:10px;">
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
    <!-- 修改店铺弹窗 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="设置店铺" :visible.sync="storeDialog" width="450px">
      <el-input style="width:100%;" v-model="storeInput" placeholder="请输入店铺名称"
                suffix-icon="el-icon-search" @keyup.enter.native="editStoreBtn('search')"></el-input>
      <el-table highlight-current-row border height="310"
                :data="storeList" style="margin-top:10px;">
        <el-table-column prop="selection" align="center" width="50px" label="">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" :disabled="!scope.row.autoDlOrderFlag || !scope.row.enabledFlag" @change="changeChecked(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="storeName" align="center" label="店铺名称"></el-table-column>
      </el-table>
      <div style="margin-top:30px;margin-bottom:10px;text-align:right;">
        <el-button @click="storeDialog = false" style="width:70px !important;">取消</el-button>
        <el-button type="primary" @click="updateStore" style="width:70px !important;">确定</el-button>
      </div>
    </el-dialog>
    <!--释放弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="" :visible.sync="releaseDialogVisible" width="550px">
      <div>
        <div><i style="color:orange;font-size:20px;margin-right:10px;" class="el-icon-warning"></i>请选择需要释放的订单？</div>
        <div style="color:red;margin:10px 0 10px 30px;">订单将保留当前促销计算的结果进入系统，请谨慎选择</div>
        <div>
          <label for=""><span style="color:red;margin-right:2px;">*</span>付款时间：</label>
          <el-date-picker style="width:340px;padding:3px;" :clearable="false" v-model="pickerTimer2" type="datetimerange"
                          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
                          :editable="false">
          </el-date-picker>
          <span v-if="releaseStore">且</span>
          <span v-else>的订单</span>
        </div>
        <div v-if="releaseStore">
          <label for="" style="margin:15px 0px 0px 12px;"><span style="color:red;margin-right:2px;">*</span>店铺为：</label>
          <multiple-select
            :selectArr="storeEchoList"
            :valueArr="storeValue"
            @multipleChange="multipleChange"
            style="width:200px;margin-right:5px;">
          </multiple-select>
          <span>的订单</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click.prevent="releaseDialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="relLoading" @click.prevent="releaseSave">确 定</el-button>
      </span>
    </el-dialog>
    <!--查促销弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="赠品策略" :visible.sync="querySalesDialogVisible" width="1000px">
      <div>
        <el-table
          border
          max-height="500"
          highlight-current-row
          :data="querySalesData"
        >
          <el-table-column
            align='center'
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            prop="giftStrategyNo"
            label="策略编号"
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="giftStrategyName"
            align='center'
            show-overflow-tooltip
            label="策略名称"
            width="">
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="生效状态"
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="barCode"
            label="启用状态"
            align='center'
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.enableFlag">启用</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="barCode"
            label="起止时间"
            align='center'
            width="265">
            <template slot-scope="scope">
              {{scope.row.orderBeginTime | turnTimestamp}} ～ {{scope.row.orderEndTime | turnTimestamp}}
            </template>
          </el-table-column>
          <el-table-column
            prop="partakeStore"
            label="参与店铺"
            align='center'
            show-overflow-tooltip
            width="120">
          </el-table-column>
          <el-table-column
            prop="barCode"
            min-width='120'
            align='center'>
            <template slot="header" slot-scope="scope">
              <span>赠送情况</span>
              <el-tooltip class="item" effect="dark" content="已赠送的名额 / 总赠送名额，不包含hold单池中的订单" placement="top">
                <i class="el-icon-question" style="font-size:16px;"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              {{scope.row.quotaGranted}}/{{scope.row.totalQuota}}
            </template>
          </el-table-column>
        </el-table>
        <div class="dialog-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage1"
            :page-sizes="[15, 30, 50, 100, 200]"
            :page-size="pageSize1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum1">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click.prevent="querySalesDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--商品详细信息-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="商品详细信息" :visible.sync="goodsDetailDialog" v-if="goodsDetailDialog" width="1100px">
      <original-order-detail :isOperation="false" :sourceOrderNo="sourceOrderNo"></original-order-detail>
    </el-dialog>
  </div>
</template>
<script>
  import {turnTimestamp1,gridOptions} from '@/assets/js/validate.js';
  import {AgGridVue} from "ag-grid-vue";
  import OriginalOrderDetail from '@/components/common/OriginalOrderDetail.vue';
  export default {
    components:{
      'ag-grid-vue': AgGridVue,
      OriginalOrderDetail,
      RowFn:{
        template:'<span>{{params.node.rowIndex+1}}</span>'
      },
      goodsComponent: {
        template: `<div>
          <el-button type="text" @click="goodsDetail">{{params.data.goodsTypeQty}}/{{params.data.goodsQty}}</el-button>
        </div>`,
        methods: {
          goodsDetail(){
            this.params.context.goodsDetail(this.params.data);
          }
        }
      },
    },
    data() {
      return {
        goodsDetailDialog:false,
        sourceOrderNo:'',

        storeDialog:false,
        pickerOptions: {  //时间选择区间
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        holdOrderFlag:false,//hold开关
        storeInput:'',//店铺查询条件
        storeList:[],
        storeCacheData:[],
        storeNameString:'',
        storeEchoList:[],
        paramData: {
          sourceOrderNo: '',
          strategyNo: '',
          storeId:'',
          timeType: '1',
          startTime:'',
          endTime:'',
        },
        pickerTimer:[],//时间区间
        startTime: '',
        endTime: '',
        isDisplay:true,//收起状态
        cardData:[],
        cardIndex:0,
        releaseDialogVisible:false,//释放弹框
        releaseStore:false,//是否是点击的全部tabcard
        pickerTimer2:[],//释放时间区间
        storeValue:[],//释放店铺value
        querySalesDialogVisible:false,//查促销
        querySalesData:[],//查促销table
        currentPage1: 1, //当前页
        pageSize1: 15, //当前页条数
        totalNum1: 0, //总条数

        t_height:0,
        agLoading:false,
        tableData: [], // 数据列表
        columnDefs:null,
        gridOptions:gridOptions(),

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
        tabCardNum:0,//一行展示多少个tabcard
        storeId:'',//释放店铺id存起来
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
        relLoading:false,
      }
    },
    mounted() {   //数据挂载
      //console.log(this.$Technology.sectionThreePoints(4324234242));
      //获取.display-active 的宽度 292
      this.tabCardNum = Math.floor(document.querySelector('.display-active').offsetWidth/292);
      window.onresize = () => {
        this.tabCardNum = Math.floor(document.querySelector('.display-active').offsetWidth/292);
        this.t_height = $(window).height() - $('.col-border').offset().top - 60;
      }
      //渲染表格高度
      this.$nextTick(function () {
        this.t_height = $(window).height() - $('.col-border').offset().top - 60;
      })
      //回车事件
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13 && $('.v-modal').length == 0) { // enter 键
          //要做的事情
          this.getTableList();
        }
      };
      //回显表格数据
      this.getTableList();
      //回显店铺和开启状态
      this.echoInit();
      //回显店铺
      this.echoInitStore();
    },
    beforeMount() {
      this.gridOptions.context = this;
      this.columnDefs = [
        {headerName: "序号",
          pinned: 'left',
          field: "row",
          width: 95,
          suppressToolPanel:true,
          suppressSorting: true,
          lockPosition: true,
          cellRendererFramework: 'RowFn',},
        {
          headerName: "店铺",
          field: "storeName",
        },
        {
          headerName: "平台单号",
          field: "sourceOrderNo",
        },
        {
          headerName: "商品信息",
          field: "enabledFlag",
          width: 120,
          cellRendererFramework: 'goodsComponent',
        },
        {
          headerName: "下单时间",
          field: "orderTime",
        },
        {
          headerName: "付款时间",
          field: "payTime",
        },
        {
          headerName: "商品实收总金额",
          field: "goodsTotalAmt",
        },
        {
          headerName: "促销编号",
          field: "strategyNo",
        },
      ];
    },
    methods: {
      //回显店铺和开启状态
      echoInit(){
        //回显开启状态
        this._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + this.version + '/query').then(response => {
          if (response.data.success) {
            this.holdOrderFlag = response.data.result.holdOrderFlag;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //回显店铺
      echoInitStore(){
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/getOpenHoldFlagStore').then(response => {
          if (response.data.success) {
            this.storeEchoList = response.data.result?response.data.result:[];
            this.storeNameString = '';
            this.storeEchoList.forEach(item => {
              this.storeNameString += item.storeName + '，';
              item.label = item.storeName;
              item.value = item.storeId;
            })
            if(this.storeNameString)this.storeNameString = this.storeNameString.slice(0,-1);
            //获取卡片信息
            this.getCardInfo();
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //多选下拉组件（订单状态）
      multipleChange(value) {
        this.storeValue = value;
      },
      goodsDetail(row){
        this.sourceOrderNo = row.sourceOrderNo;
        this.goodsDetailDialog = true;
      },
      //开启hold店铺
      switchBtn(row){
        this.holdOrderFlag = !row;
        if(this.holdOrderFlag){
          //关闭
          this.$confirm('<p style="text-align:left;">确定终止店铺促销计算？<span style="color:#999;text-align:left;font-size:14px;">（促销计算将在60分钟后停止）</span></p>', '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning',
            center: true
          }).then(() => {
            this.switchFn(!this.holdOrderFlag);
          }).catch(() => {});
        }else{
          this.$confirm('<p style="text-align:left;">确定开启店铺促销计算？</p><p style="color:red;text-align:left;">选中店铺的订单将不会自动处理，需手动释放进入系统</p>', '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning',
            center: true
          }).then(() => {
            this.switchFn(!this.holdOrderFlag);
          }).catch(() => {});
        }
      },
      switchFn(holdOrderFlag){
        this._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + this.version + '/updateOrderSetUp',{holdOrderFlag}).then(response => {
          if (response.data.success) {
            this.holdOrderFlag = holdOrderFlag;

            this.cardData.forEach(item => {
              if(item.storeName == '全部'){
                item.openFlag = this.holdOrderFlag;
              }else{
                item.openFlag = this.storeEchoList.some(obj => {
                  return item.storeId == obj.storeId && this.holdOrderFlag;
                })
              }
            })
          } else {
            this.holdOrderFlag = !holdOrderFlag;
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //修改店铺选择
      editStoreBtn(arg){
        //点击编辑时，把已选中的店铺存起来
        if(arg !== 'search') this.storeCacheData = JSON.parse(JSON.stringify(this.storeEchoList));

          this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/queryListOauth',{
            storeName:this.storeInput
        }).then(response => {
          if (response.data.success) {
            this.storeDialog = true;
            const mapArr = new Map();
            this.storeCacheData.forEach(item => {
              mapArr.set(item.storeId,item);
            })
            response.data.result = response.data.result?response.data.result:[];
            response.data.result.forEach(item => {
              item.checked = false;
              if(mapArr.get(item.storeId)){
                item.checked = true;
              }
            })
            this.storeList = response.data.result;
            //console.log(this.storeCacheData);
            //console.log(this.storeList);
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //选择与取消checkbox
      changeChecked(row){
        /*const isExist = this.storeCacheData.some(item => {
          return item.storeId == row.storeId;
        })*/
        if(row.checked){//勾上
          this.storeCacheData.push(row);
        }else{//取消勾选
          this.storeCacheData = this.storeCacheData.filter(item => {
            return item.storeId != row.storeId;
          })
        }
        //console.log(this.storeCacheData);
      },
      //修改店铺保存
      updateStore(){
        /*if(this.storeCacheData.length == 0){
          this.$message({
            message: '请选择店铺',
            type: 'warning'
          });
          return false;
        }*/
        if(this.storeCacheData.length > 8){
          this.$message({
            message: '最多可以选择8个店铺',
            type: 'warning'
          });
          return false;
        }
        const storeIds = this.storeCacheData.map(item => {
          return item.storeId;
        })
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/saveHoldFalg',{
          storeIds
        }).then(response => {
          if (response.data.success) {
            this.storeDialog = false;
            this.echoInitStore();
            this.getTableList();
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //刷新
      refreshBtn(){
        //回显表格数据
        this.getTableList();
        //回显店铺和开启状态
        this.echoInit();
        //回显店铺
        this.echoInitStore();
      },
      //展开
      displayBtn(){
        this.isDisplay = !this.isDisplay;
      },
      cardTab(index,row){
        if(index == this.cardIndex)return false;
        this.cardIndex = index;
        this.paramData.storeId = row.storeId?row.storeId:'';
        this.getTableList();
      },
      //获取卡片信息
      getCardInfo(){
        this._post('com.edb01.erp.oms.service.api.PromotionCenterService/' + this.version + '/count').then(response => {
          if (response.data.success) {
            let totalNum = 0;
            response.data.result = response.data.result?response.data.result:[];
            response.data.result.forEach(item => {
              item.openFlag = this.storeEchoList.some(obj => {
                return item.storeId == obj.storeId && this.holdOrderFlag;
              })
              totalNum += item.orderNum*1;
            })
            //排序
            response.data.result.forEach((item)=> {
              if(item.openFlag){
                item.pri = 0;
              }else{
                item.pri = 1;
              }
            })
            response.data.result.sort((a,b)=> {
              return a.pri - b.pri;
            })

            response.data.result.unshift({
              storeName:'全部',
              orderNum:totalNum,
              openFlag:this.holdOrderFlag
            })
            this.cardData = response.data.result;
            //console.log(this.cardData);
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //释放
      releaseBtn(event,index,row){
        event.stopPropagation();
        if(index == 0){
          this.releaseStore = true;
        }else{
          this.releaseStore = false;
        }
        this.storeId = row.storeId?row.storeId:'';
        this.pickerTimer2 = [];
        this.storeValue = [];
        this.releaseDialogVisible = true;
      },
      //查促销
      querySalesBtn(event,index,row){
        event.stopPropagation();
        this._post('com.edb01.erp.oms.service.api.PromotionCenterService/' + this.version + '/queryStrategy', {
          page:this.currentPage1,
          size:this.pageSize1,
          storeId:row.storeId?row.storeId:''
        }).then(response => {
          if (response.data.success) {
            this.querySalesDialogVisible = true;
            let rows = response.data.result && response.data.result.rows?response.data.result.rows:[];
            this.querySalesData = rows;
            this.totalNum1 = response.data.result?response.data.result.total:0;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //释放保存
      releaseSave(){
        if(!this.pickerTimer2 || this.pickerTimer2.length == 0){
          this.$message({
            message: '请选择付款时间',
            type: 'warning'
          });
          return false;
        }
        if(this.releaseStore && this.storeValue.length == 0){
          this.$message({
            message: '请选择店铺',
            type: 'warning'
          });
          return false;
        }
        let storeId = this.storeId;
        if(this.releaseStore){
          //点击的全部
          if(this.storeEchoList.length == this.storeValue.length){
            //选择的全部
            storeId = '';
          }else{
            storeId = this.storeValue;
          }
        }
        let paramData = {
          timeStart:this.pickerTimer2[0],
          timeEnd:this.pickerTimer2[1],
          storeId
        }
        this.relLoading = true;
        this._post('com.edb01.erp.oms.service.api.PromotionCenterService/' + this.version + '/release', paramData).then(response => {
          this.relLoading = false;
          if (response.data.success) {
            this.releaseDialogVisible = false;
            this.getCardInfo();
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      handleSizeChange1(val) {
        this.pageSize1 = val;
        this.querySalesBtn();
      },
      handleCurrentChange1(val) {
        this.currentPage1 = val;
        this.querySalesBtn();
      },
      //表格数据列表
      getTableList() {
        var paramData = Object.assign(this.paramData, {
          page: this.currentPage,
          size: this.pageSize,
          startTime:this.pickerTimer && this.pickerTimer[0] ? this.pickerTimer[0] : '',
          endTime:this.pickerTimer && this.pickerTimer[1] ? this.pickerTimer[1] : ''
        })
        this.agLoading = true;
        //this.$store.commit('setLoading',true)
        this._post('com.edb01.erp.oms.service.api.PromotionCenterService/' + this.version + '/list', paramData).then(response => {
          this.agLoading = false;
          //this.$store.commit('setLoading',false)
          if (response.data.success) {
            response.data.result.rows = response.data.result.rows?response.data.result.rows:[];
            response.data.result.rows.forEach((item) => {
              item.orderTime = item.orderTime ? turnTimestamp1(item.orderTime) : '--';
              item.payTime = item.payTime ? turnTimestamp1(item.payTime) : '--';
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
        this.paramData =  {
          sourceOrderNo: '',
            strategyNo: '',
            storeId:'',
            timeType: '1',
            startTime:'',
            endTime:'',
        },
        this.pickerTimer = [];
        this.endTime = [];
      },
      //分页
      handleSizeChange(val) {
        this.pageSize = val;
        this.getTableList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getTableList();
      },
    }
  }


</script>

<style scoped>
  .showHide {
    position: absolute;
    color: #409eff;
    margin-top: 3px;
    cursor: pointer;
  }
  .box-card{
    padding:10px;border:1px solid #eee;display: inline-block;width: 277px;margin:0 15px 15px 0;
    box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
    border-radius:3px;
    cursor:pointer;
    position: relative;
  }
  .highlight-active{
    background: #f5f7fa;
  }
  .highlight-active .box-card-content{
    color:red;
  }
  .box-card-tag{
    position:absolute;
    right:20px;
    top:20px;
  }
  .box-card-header{
    width: 200px;
    border-left:3px solid #409EFF;padding-left:5px;
  }
  .box-card-content{
    margin:23px;font-size:20px;text-align:center;
  }
  .box-card-footer{
    text-align:center;
  }
  .display-active{
    height: 146px;
    overflow: hidden;
  }
</style>
