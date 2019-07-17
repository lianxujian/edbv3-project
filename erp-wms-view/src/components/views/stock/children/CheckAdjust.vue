<!--查看调整单 尘音-->
<template>
  <div id="checkAdjust">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">库存调整</a></el-breadcrumb-item>
        <el-breadcrumb-item>查看调整单</el-breadcrumb-item>
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

        refuseClick: false,//审核拒绝

        refuse: '',//备注内容

        paramObj:{
          moduleId:'51',
          billCode: this.params.stockInvaId
        },//日志传参

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
          if(res.data.success) {
            this.storageId = res.data.result.storageId;
            this.invaType = res.data.result.invaType.toString();
            this.invaExplain = res.data.result.invaExplain;
            this.tableData = res.data.result.wmStockInvaItemPOList;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //点击返回
      backClick: function () {
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
  #checkAdjust .el-textarea{
    width:83%;
  }
</style>
