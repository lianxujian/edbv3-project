<!--确认移位 秋香-->
<template>
  <div id="SureChange">
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
            <label >移位状态：</label>
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
            <label  style="vertical-align: top;">调整说明：</label>
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

        <el-table-column label="条形码" width="110" prop="barCode">
        </el-table-column>

        <el-table-column label="商品名称" width="200" prop="goodsName">
        </el-table-column>

        <el-table-column label="批次" width="200" prop="batchNo">
        </el-table-column>

        <el-table-column label="来源库区" prop="sourceSectionName">
        </el-table-column>

        <el-table-column label="来源库位" prop="sourceStorageBinName">
        </el-table-column>

        <el-table-column label="库位类型">
          <template slot-scope="scope">
            <span class="cen-g" v-show="scope.row.binType == 1">正品</span>
            <span class="cen-g" v-show="scope.row.binType == 2">次品</span>
          </template>
        </el-table-column>

        <el-table-column label="目标库区" prop="targetSectionName">
        </el-table-column>

        <el-table-column label="目标库位" prop="targetStorageBinName">
        </el-table-column>

        <el-table-column label="计划移动量" prop="planMoveQty">
        </el-table-column>

        <el-table-column label="实际移动量" v-if="isShowTime">
          <template slot-scope="scope">
           <div v-if="isShowNum">
             <span class="cen-g">{{ scope.row.realityMoveQty }}</span>
           </div>
                <div v-if="isShowNumtwo"> <el-input type="text" v-model="scope.row.realityMoveQty"
                                                    :disabled="scope.row.isTrue"
                                                    :class="{ box: isClasses ==true && (scope.row.realityMoveQty==undefined||scope.row.realityMoveQty=='')||(scope.row.realityMoveQty>scope.row.planMoveQty)}"
                                                    @blur="holdNum(scope.row,scope.$index)"></el-input></div>
          </template>
        </el-table-column>
      </el-table>
      <!--footer-->
      <div class="wmsFoot">
          <el-button @click="backClick" size="mini" type="info">返 回</el-button>
          <el-button v-if="isShowButton"  style="margin:0;background-color:#49A0F5;color:white;border:1px solid #818d9a;" @click="saveChange()">保存</el-button>
          <el-button v-if="isShowButton"  style="margin:0;background-color:#49A0F5;color:white;border:none;" @click="complateChange()">确认移位</el-button>

      </div>
    </div>

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
        isShowTime:false,//实际移动量隐藏
        isShowStatus:true,//移位状态隐藏
        isShowNum:false,//实际移动量
        isShowNumtwo:false,//实际移动量
        isShowButton:false,//按钮
        moveStatus: '',//移位状态
        remark: '',//调整说明
        tableData: [],//表格数据
        refuseClick: false,//审核拒绝
        refuse: '',//备注内容
        wmStockMoveItemPOLinkParamList:[],//初始化数据
        stockMoveNo:'',//移位单号
        isDisable:false,//禁用按钮
        isShowMum:false,//校验框
        isClasses:false,//禁用
      }
    },
    mounted(){
      this.initStock();//初始和仓库下拉
      this.initMessage()//初始化表格数据
    },
    methods:{
      //校验实际移动量不能大于计划移动量
      holdNum(row){
        if (row.realityMoveQty>row.planMoveQty) {
          this.isClasses = true;
          this.$message({
            type: 'warning',
            message:'实际移动量不能大于计划移动量',
          })
          row.isShowMum=true
          row.isShowNumtwo=false
          return false;
        }
      },

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
        const id = this.$route.params.id;
        let data = {stockMoveId: id};
        this._post('com.edb01.erp.wms.service.api.WmStockMoveService/' + this.version + '/queryLinkById',data).then(function (res) {
          //this.storageId = res.data.result.storageId;
         if(res.data.success){
           this.tableData= res.data.result.wmStockMoveItemPOLinkParamList;
           this.tableData.forEach((item,i)=>{
           if(item.realityMoveQty== undefined||item.realityMoveQty==''){
             item.isTrue=false
           }else{
             item.isTrue=true
           }
         })
           this.storageId = res.data.result.storageId;
           this.stockMoveId = res.data.result.stockMoveId;
           this.stockMoveNo = res.data.result.stockMoveNo;
           this.moveStatus = res.data.result.moveStatus;//状态
           if(this.moveStatus==1003) {//已完成
             this.isShowTime=true
             this.isShowNum=true
           }
           if(this.moveStatus==1002){//已分配
             this.isShowTime=true
             this.isShowNum=false
             this.isShowNumtwo=true
             this.isShowStatus=false
             this.isShowButton=true
           }
           if(this.moveStatus==1001){//未分配
             this.isShowTime=false
           }
           this.remark = res.data.result.remark;
         }else{
           this.$message({
             message:res.data.msg,
             type:'warning'
           })
         }


        }.bind(this))
      },

      //保存
      saveChange:function(){
        let str = JSON.stringify(this.tableData);
        var addDataW = {
          stockMoveId:this.stockMoveId,
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
        this.isDisable=true
        let arr = [];
        this.tableData.forEach(function (val) {
          arr.push(val.realityMoveQty);
        }.bind(this));
        if (arr.indexOf(undefined) != -1) {
          this.isDisable=false
          this.isClasses = true;
          this.$message({
            type: 'warning',
            message:'有未填写实际移动量的商品，无法完成!',
          })
          return false;
        }

        let str = JSON.stringify(this.tableData);
        var addDataW = {
          stockMoveId:this.stockMoveId,
          stockMoveNo:this.stockMoveNo,
          merchantId:0,//商户id
          storageId: this.storageId,
          remark: this.remark,
          wmStockMoveItemPOParamListStr: str,
          saveType:1003,
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
                message:res.data.msg,
              })
              if(res.data.code==600000011){
                self.isClasses = true;
                self.$message({
                  type: 'warning',
                  message:'实际移动量小于等于计划移动量，并且大于0',
                })
              }
            }
            }.bind(this))
        setTimeout(() => {
          self.isDisable = false
        }, 1500)

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
/*  #SureChange .el-textarea{
    width:83%;
  }*/
  #SureChange .box input.el-input__inner {
    border: 1px solid red !important;
  }
</style>
