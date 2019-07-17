<!--审核损益单 佩玖-->
<template>
  <div id="auditCauExceSin">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/CauExceSin' }">损溢单</el-breadcrumb-item>
        <el-breadcrumb-item>审核损溢单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="stateShow">
      <el-row :gutter="17">
        <el-col :span="4">
          <div class="grid-content bg-purple"><strong>损溢单号：</strong>{{numbers}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple"><strong>状态：</strong>{{statues}}</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple"><strong>仓库：</strong>{{warehouse}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple"><strong>单据来源：</strong>{{source}}</div>
        </el-col>
      </el-row>
    </div>

    <!--损益单明细-->
    <div class="pDown" style="width: 650px;margin-bottom: 50px">
      <strong>损溢单明细：</strong>

      <el-table :data="tableData" border style="width: 100%;margin-bottom: 50px">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="商品名称" width="110">
          <template slot-scope="scope">
            <div v-show="scope.row.goodsQty!==0">
              <p class="cen-g">{{ scope.row.goodsName }}</p>
            </div>

          </template>
        </el-table-column>

        <el-table-column label="条形码" width="200">
          <template slot-scope="scope">
            <div v-show="scope.row.goodsQty!==0">
              <p class="initP-g">{{ scope.row.barCode }}</p>
            </div>

          </template>
        </el-table-column>

        <el-table-column label="商品属性">
          <template slot-scope="scope">
            <div v-show="scope.row.goodsQty!==0">
              <p class="cen-g" v-show="scope.row.goodsType==1">正品</p>
              <p class="cen-g" v-show="scope.row.goodsType==2">次品</p>
            </div>

          </template>
        </el-table-column>

        <el-table-column label="损溢数量">
          <template slot-scope="scope">
            <p class="cen-g"><span v-show="scope.row.goodsQty>0">+</span>{{ scope.row.goodsQty }}</p>
          </template>
        </el-table-column>


      </el-table>

    </div>
    <div class="wmsFoot" style="text-align: center">
      <el-button size="mini" @click="back()">返回</el-button>
      <el-button size="mini" type="primary" @click="AuditRefused">审核拒绝</el-button>
      <el-button size="mini" type="primary" @click="passverification ">审核通过</el-button>
    </div>
    <!--拒绝审核弹框-->
    <el-dialog v-dialogDrag
      title="审核拒绝"
      :visible.sync="refuseClick"
      :before-close="handleClose"
      width="420px"
      center>
      <div style="text-align: center">
        <span style="position: absolute ;top:85px;left:20px">审核备注：</span>
        <el-input
          maxlength="200"
          style="width: 252px;"
          type="textarea"
          :rows="3"
          placeholder="请输入备注内容"
          v-model="auditRemark">
        </el-input>
        <i style="color: red">*</i>
        <div style="text-align: left;position: relative">
          <span style="position: absolute;left: 236px;height: 17px">{{auditRemark.length}}/200</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
             <el-button @click="cancel()">取 消</el-button>
            <el-button size="mini" type="primary" @click="refuse" style="margin-right: 70px">确 定</el-button>
          </span>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0',
        numbers: '',  //单据号
        statues: '',  // 状态
        warehouse: '', //仓库
        source: '',    //来源单据
        auditRemark: '', //拒绝审核备注信息
        tableData: [],  //明细列表
        refuseClick: false,  //审核拒绝弹框
        optionsStock: [{value: '', label: '全部'}],//仓库下拉
        storageId: '',//仓库

      }
    },
    mounted() {
      this.initStock();//初始和仓库下拉
      this.isTrue();//初始化损益单


    },

    methods: {

      //损益单明细淑数据列表
      isTrue() {
        let self = this
        let arr = this.$route.params.objdata
        let id = arr.stockProfitlossId
        this.numbers = arr.profitlossNo
        this.warehouse = arr.storageName
        self._post('com.edb01.erp.wms.service.api.WmStockProfitlossService/'+this.version+'/queryLinkById', {
          stockProfitlossId: id,

        }).then(function (res) {
          self.tableData = res.data.result.wmStockProfitlossItemEditBeanList
          if(res.data.result.sourceType==1001){
            self.source ="调整单"
          }else if(res.data.result.sourceType==1002){
            self.source ="第三方盘点单"
          }

          if(res.data.result.status==1001){
             self.statues = "待审核"
          }else if(res.data.result.status==1002){
            self.statues ="已审核"
          }else if(res.data.result.status==1003){
            self.statues = "审核拒绝"
          }else if(res.data.result.status==1004){
            self.statues = "已作废"
          }

        }).catch(function (err) {
          console.log(err)
        })


      },
      //     调用清空
      handleClose(){
        this.cancel()
      },
      //取消并清空
      cancel(){
        this.refuseClick= false
        this.auditRemark=''
      },
//      拒绝审核
      refuse() {
        let self = this
        let arr = this.$route.params.objdata
        let id = arr.stockProfitlossId
        if (this.auditRemark == '') {
          self.$message({
            message: "备注不能为空",// 如果code为其他，弹出错误码
            type: 'warning'
          })
        } else {
          self._post('com.edb01.erp.wms.service.api.WmStockProfitlossService/'+ this.version+'/profitlossOpt', {
            auditRemark: this.auditRemark,
            stockProfitlossId: id,
            optType: 1002

          }).then(function (res) {

            if (res.data.success) {
              self.refuseClick = false;
              self.$message({
                message: "备注成功",
                type: 'success'
              })
              self.back()
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }

          }).catch(function (err) {
            console.log(err)
          })
        }


      },
//      审核通过
      passverification() {
        let self = this
        let arr = this.$route.params.objdata
        let id = arr.stockProfitlossId
        self._post('com.edb01.erp.wms.service.api.WmStockProfitlossService/'+ this.version+'/profitlossOpt', {
          stockProfitlossId: id,
          optType: 1001

        }).then(function (res) {

          if (res.data.success) {

            self.$message({
              message: "审核成功",
              type: 'success'
            })
//            self.isTrue()
           self.back()
          } else {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }

        }).catch(function (err) {
          console.log(err)
        })


      },

      initStock: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.optionsStock.push({value: val.storageId, label: val.storageName})
          }.bind(this));
        }.bind(this));
      },
//      审核拒绝弹框
      AuditRefused() {
        this.refuseClick = true;
      },
      //初始化库区下拉
      initSeat: function () {
        let data = {
          storageId: this.storageId
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/findByStorageId', data).then(function (res) {

          let arr = res.data.result;
          console.log(arr);
          this.optionsStockAreaDialog = [{value: '', label: '全部'}];
          arr.forEach(function (val) {
            this.optionsStockAreaDialog.push({value: val.storageSectionId, label: val.sectionName})
          }.bind(this));
        }.bind(this));
      },
      //      返回
      back() {
        this.$router.push("CauExceSin")
      },


    }
  }
</script>
<style scoped>
  .pTop {
    margin-bottom: 20px;

  }

</style>
<style>
  #auditCauExceSin .el-textarea {
    width: 82%;
  }

  #auditCauExceSin .el-table .cell {
    text-align: center;
  }
</style>
