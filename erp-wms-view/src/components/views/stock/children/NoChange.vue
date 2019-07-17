<!--移位单详情 秋香-->
<template>
  <div id="NoChange">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Change' }">移位</el-breadcrumb-item>
        <el-breadcrumb-item>移位单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--搜索区-->
    <div id="searchBox">
      <el-row>
        <el-col :span="6">
          <div class="grid-content" v-if="isShowStatus">
            <label>移位状态：</label>
            <el-select disabled id="adjustType" v-model="moveStatus" filterable placeholder="全部">
              <el-option
                v-for="item in optionsAdjustState"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label >仓库：</label>
            <el-select disabled id="searchStock" v-model="storageId" filterable placeholder="全部">
              <el-option
                v-for="item in optionsStock"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <label style="vertical-align: top;">说明：</label>
            <el-input
              disabled
              maxlength="200"
              id="explain"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="remark">
            </el-input>
            <span>{{remark.length}}</span>/200
          </div>
        </el-col>
      </el-row>

    </div>
    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="条形码" width="110">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.barCode }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" width="200">
          <template slot-scope="scope">
            <span class="initP-g">{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="批次" width="200">
          <template slot-scope="scope">
            <span class="initP-g">{{ scope.row.batchNo}}</span>
          </template>
        </el-table-column>

        <el-table-column label="来源库区">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.sourceSectionName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="来源库位">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.sourceStorageBinName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="库位类型">
          <template slot-scope="scope">
            <span class="cen-g" v-show="scope.row.binType == 1">正品</span>
            <span class="cen-g" v-show="scope.row.binType == 2">次品</span>
          </template>
        </el-table-column>

        <el-table-column label="目标库区">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.targetSectionName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="目标库位">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.targetStorageBinName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="计划移动量">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.planMoveQty }}</span>
          </template>
        </el-table-column>

        <el-table-column label="实际移动量" v-if="isShowTime">
          <template slot-scope="scope">
              <span class="cen-g">{{ scope.row.realityMoveQty}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--footer-->
      <div class="wmsFoot">
          <el-button @click="backClick" size="mini" type="info">返 回</el-button>
      </div>
    </div>

    <!--操作日志-->
    <div class="col-nav" style="margin:20px 0 10px">
      <ul>
        <li><span>操作日志</span></li>
      </ul>
    </div>
    <!--日志表格-->
    <publicLog :paramObj="paramObj"></publicLog>
  </div>
</template>
<script>
  import publicLog from '@/components/common/publicLog.vue';
  export default {
    components:{
      publicLog
    },
    data(){
      return{
        version: '1.0.0',//版本号
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId: '',//仓库
        optionsAdjustState: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1001',
            label: '未分配'
          },
          {
            value: '1002',
            label: '已分配'
          },
          {
            value: '1003',
            label: '已完成'
          }
        ],//移位状态下拉
        isShowTime:false,//是否显示实际移动量
        isShowStatus:true,//是否显示移位状态
        isShowNum:false,//实际移动量
        isShowNumtwo:false,//实际移动量
        isShowButton:false,//按钮
        moveStatus: '',//移位状态
        remark: '',//调整说明
        tableData: [],//表格数据
        refuseClick: false,//审核拒绝
        refuse: '',//备注内容
        wmStockMoveItemPOLinkParamList:[],
        tableLog:[],//日志
        paramObj:{
          moduleId:'43',
          billCode: this.$router.history.current.params.id
        },//日志
        mainData:this.$router.history.current.params.id,//移位单id
      }
    },
    mounted(){
      this.initStock();//初始和仓库下拉
      this.initMessage()//初始化表格数据
    },
    methods:{
      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.optionsStock.push({value: val.storageId,label: val.storageName})
          }.bind(this));
        }.bind(this));
      },

      //初始化表格数据
      initMessage(){
        const id = this.mainData
        let data = {stockMoveId: id};
        this._post('com.edb01.erp.wms.service.api.WmStockMoveService/' + this.version + '/queryLinkById',data).then(function (res) {
          //this.storageId = res.data.result.storageId;
          this.tableData= res.data.result.wmStockMoveItemPOLinkParamList;
          console.log(this.tableData);
          this.storageId = res.data.result.storageId;
          this.stockMoveId = res.data.result.stockMoveId;
          this.moveStatus = res.data.result.moveStatus;//状态
          if(this.moveStatus==1003) {//已完成
            this.moveStatus='已完成'
            this.isShowTime=true
         //   this.isShowNum=true
          }
          if(this.moveStatus==1002){//已分配
            this.moveStatus='已分配'
            this.isShowTime=true
        /*    this.isShowNum=false
            this.isShowNumtwo=true*/
            this.isShowStatus=false
            this.isShowButton=true
          }
          if(this.moveStatus==1001){//未分配
            this.moveStatus='未分配'
            this.isShowTime=false
          }
          this.remark = res.data.result.remark;
        }.bind(this))
      },

      //保存
      saveChange:function(){
        let arr = [];
        this.tableData.forEach(function (val) {
          arr.push(val.realityMoveQty);
        }.bind(this));
        if (arr.indexOf(undefined) != -1) {
          this.$alert('实际移动量不能为空!', '提示', {
            confirmButtonText: '确定',
            center: true,
          })
          return false;
        }
        let str = JSON.stringify(this.tableData);
        var addDataW = {
          stockMoveId:this.mainData,
          merchantId:0,//商户id
          storageId: this.storageId,
          remark: this.remark,
          wmStockMoveItemPOParamListStr: str,
          saveType:1001
        }
        var self=this
        self._post('com.edb01.erp.wms.service.api.WmStockMoveService/'+this.version+'/save',addDataW)
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                type: 'success',
                message: '保存成功!',
              })
              self.$router.push('/Change')
            }
          })
          .catch(function (error) {
            console.log(error);
          });

      },

      //确认移位
      complateChange:function () {
        let arr = [];
        this.tableData.forEach(function (val) {
          arr.push(val.realityMoveQty);
        }.bind(this));
        if (arr.indexOf(undefined) != -1) {
          this.$alert('实际移动量不能为空!', '提示', {
            confirmButtonText: '确定',
            center: true,
          })
          return false;
        }
        let str = JSON.stringify(this.tableData);
        var addDataW = {
          stockMoveId:this.mainData.stockMoveId,
          merchantId:0,//商户id
          storageId: this.storageId,
          remark: this.remark,
          wmStockMoveItemPOParamListStr: str,
          saveType:1003,
          stockMoveNo:this.mainData.stockMoveNo,

        }
        var self=this
        self._post('com.edb01.erp.wms.service.api.WmStockMoveService/'+this.version+'/confirmMove',addDataW)
          .then(function (res) {
            if (res.data.success == true) {
              self.$message({
                type: 'success',
                message: '移位成功!',
              })
              self.$router.push('/Change')
            }else{
              self.$message({
                type: 'warning',
                message: res.data.msg,
              })
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //点击返回
      backClick: function () {
        this.$router.push('/Change')
      }

    }
  }
</script>
<style scoped>
  .pTop{
    margin-bottom: 20px;
  }
</style>
<style>
  #NoAdjust .el-textarea{
    width:83%;
  }
</style>
