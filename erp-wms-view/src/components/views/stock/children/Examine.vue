<!--审核调整单 尘音-->
<template>
  <div id="examine">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">库存调整</a></el-breadcrumb-item>
        <el-breadcrumb-item>审核调整单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--搜索区-->
    <div id="searchBox">
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <label for="searchStock">仓库：</label>
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

        <el-col :span="6">
          <div class="grid-content">
            <label for="adjustType">调整类型：</label>
            <el-select disabled id="adjustType" v-model="invaType" filterable placeholder="全部">
              <el-option
                v-for="item in optionsAdjustType"
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
            <label for="explain" style="vertical-align: top;">调整说明：</label>
            <el-input
              disabled
              maxlength="200"
              id="explain"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="invaExplain">
            </el-input>
            <span>{{invaExplain.length}}</span>/200
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
            <p class="cen-g">{{ scope.row.barCode }}</p>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" width="200">
          <template slot-scope="scope">
            <p class="initP-g">{{ scope.row.goodsName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="仓库">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.storageName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="库区">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.sectionName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="库位">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.storageBinName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="库位类型">
          <template slot-scope="scope">
            <p class="cen-g" v-show="scope.row.binType == 1">正品</p>
            <p class="cen-g" v-show="scope.row.binType == 2">次品</p>
          </template>
        </el-table-column>

        <el-table-column label="可配货库存">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.dstInv }}</p>
          </template>
        </el-table-column>

        <el-table-column label="调整量">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.adjustQty }}</p>
          </template>
        </el-table-column>

      </el-table>
      <!--footer-->
      <div class="wmsFoot">
        <el-button @click="backClick" size="mini" type="default">返 回</el-button>
        <el-button @click="refuseTrue()" size="mini" type="primary">审核拒绝</el-button>
        <el-button @click="passClick" size="mini" type="primary">审核通过</el-button>
      </div>
      <el-dialog v-dialogDrag
        title="审核拒绝"
        :visible.sync="refuseClick"
        width="420px"
        center>
        <div style="text-align: center">
          <span style="vertical-align: top">审核备注：</span>
          <el-input
            maxlength="200"
            style="width: 252px;"
            type="textarea"
            :rows="3"
            placeholder="请输入备注内容"
            v-model="auditRemark">
          </el-input>
          <div style="text-align: left;position: relative">
            <span v-show="isshow" style="color: red;display: inline-block;margin-left: 20px">请填写审核备注</span>
            <span style="position: absolute;left: 288px;height: 17px">{{auditRemark.length}}/200</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="refuseClick = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="refuseTrueClick">确 定</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      params: Object //接收父级参数
    },
    data(){
      return{
        version: '1.0.0',
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId: '',//仓库

        optionsAdjustType:[//调整类型下拉
          {
            value: '',
            label: '全部'
          },
          {
            value: '1001',
            label: '盘点调整'
          },
          {
            value: '1002',
            label: '损益调整'
          },
          {
            value: '1003',
            label: '其他调整'
          }
        ],
        invaType: '',//调整类型

        invaExplain: '',//调整说明

        tableData: [],//表格数据

        invaStatus: '',//调整单状态

        refuseClick: false,//审核拒绝

        auditRemark: '',//备注内容

        isshow: false//验证审核备注
      }
    },
    mounted(){
      this.initStock();//初始和仓库下拉
      this.initMessage()//初始化表格数据
    },
    methods:{

      //返回父级
      showParentBlock() {
        this.$emit('changeShow',true)
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
          if(res.data.success) {
            let arr = res.data.result;
            arr.forEach(function (val) {
              this.optionsStock.push({value: val.storageId,label: val.storageName})
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this));
      },

      //初始化表格数据
      initMessage(){
        let data = {stockInvaId: this.params.stockInvaId};
        this._post('com.edb01.erp.wms.service.api.WmStockInvaService/' + this.version + '/queryLinkById',data).then(function (res) {
          console.log(666,res.data);
          if(res.data.success) {
            this.storageId = res.data.result.storageId;
            this.invaType = res.data.result.invaType.toString();
            this.invaExplain = res.data.result.invaExplain;
            this.tableData = res.data.result.wmStockInvaItemPOList;
            this.invaStatus = res.data.result.invaStatus;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //审核接口
      changCancel:function (optType) {
        let data = {
          "invaStatus": this.invaStatus,
          "optType": optType,
          "stockInvaId": this.params.stockInvaId,
          "auditRemark": this.auditRemark
        };

        this._post('com.edb01.erp.wms.service.api.WmStockInvaService/' + this.version + '/alterState',data).then(function (res) {
          if(res.data.success) {
            this.refuseClick = false;
            //this.$router.push('/adjust')
            this.$emit('changeShow',{isRefresh:true})
          }else {
            this.$alert(res.data.msg,{
              type: 'info',
              center: true,
              confirmButtonText: '知道了'
            });
            this.initMessage();
          }
        }.bind(this))
      },

      //审核通过
      passClick: function () {
        this.changCancel('1001');
      },

      //审核拒绝点击进入
      refuseTrue: function () {
        this.auditRemark = '';
        this.isshow = false;
        this.refuseClick = true
      },

      //审核拒绝确定点击
      refuseTrueClick: function () {
        if(this.auditRemark != '') {
          this.changCancel('1003');
        }else {
          this.isshow = true;
        }

      },

      //点击返回
      backClick: function () {
        //this.$router.push('/adjust')
        this.$emit('changeShow',true)
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
  #examine .el-textarea{
    width:83%;
  }
</style>
