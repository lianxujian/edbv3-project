<!--库存查询预占 尘音-->
<template>
  <div id="bill">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">库存查询</a></el-breadcrumb-item>
        <el-breadcrumb-item>台账预占单据</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="background: #F2F2F2;height: 30px;line-height: 30px;padding-left: 10px;">商品信息</div>
    <div style="height: 40px;line-height: 40px;padding-left: 10px;">
      <span>条形码：{{ barCode }}</span>
      <span style="margin-left: 100px">商品名称：{{ goodsName }}</span>
    </div>
    <div style="background: #F2F2F2;height: 30px;line-height: 30px;margin-bottom: 20px;padding-left: 10px;">单据信息</div>
    <!--表格-->
    <div class="pDown">
      <el-table id="tableH" :data="tableData" border :max-height="table_h" style="width: 100%">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="单据类型">
          <template slot-scope="scope">
            <span class="cen-g" v-if="scope.row.orderType == 1">订单</span>
            <span class="cen-g" v-if="scope.row.orderType == 2">出库单</span>
            <span class="cen-g" v-if="scope.row.orderType == 3">入库单</span>
            <span class="cen-g" v-if="scope.row.orderType == 4">移位单</span>
            <span class="cen-g" v-if="scope.row.orderType == 5">上架单</span>
          </template>
        </el-table-column>

        <el-table-column label="单据状态">
          <template slot-scope="scope">
            {{ scope.row.orderStatusName }}
          </template>
        </el-table-column>

        <el-table-column label="单据编号">
          <template slot-scope="scope">
            {{ scope.row.orderNo }}
          </template>
        </el-table-column>

        <el-table-column label="预占数量" align="right">
          <template slot-scope="scope">
            {{ scope.row.camponQty }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small">
              <a href="javascript" v-if="scope.row.orderType == 1 && authorityCode.WMS_STOCK_CAMPON">解除预占</a>
            </el-button>
          </template>
        </el-table-column>

      </el-table>
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
        table_h: 0,//表格高度
        tableData:[],//表格数据

        name: '',//动态获取显示名
        barCode: this.params.id.barCode,//条形码
        goodsName: this.params.id.goodsName,//商品名称

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限
      }
    },
    mounted(){
      this.initMessage();//初始化表格数据
      this.initName();//初始化导航名称

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 35);
        console.log(this.table_h)
      });
    },
    methods:{

      //返回父级
      showParentBlock() {
        this.$emit('changeShow')
      },

      //初始化导航名称
      initName: function () {
        let num = this.params.num;
        if(num == 1) {
          this.name = '库存查询'
        }else if(num == 2) {
          this.name = '库位库存查询'
        }else {
          this.name = '库位库存快照'
        }
      },

      //初始化表格数据
      initMessage(){
        let data = {
          storageIdListStr: this.params.id.storageIdListStr,
          goodsId: this.params.id.goodsId,
          binInvId: this.params.id.binInvId,
          storageId: this.params.id.storageId,
          camponType: this.params.id.camponType
        };
        this._post('com.edb01.erp.wms.service.api.WmBinInvCamponService/' + this.version + '/queryList',data).then(function (res) {
          if(res.data.success) {
            this.tableData = res.data.result;
            this.invCamponId = res.data.result
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //解除预占
      deleteRow(index, rows) {
        let dataCampon = {
          "invCamponId": rows[index].invCamponId,
          "camponType": rows[index].camponType
        };
        this._post('com.edb01.erp.wms.service.api.WmBinInvCamponService/' + this.version + '/unlockCamp',dataCampon).then(function (res) {
          if(res.data.success) {
            this.$message({
              message: '解除成功！',
              type: 'success',
            });

            //通知父级刷新表格数据
            this.$emit('changeShow',true);
          }else {
            this.$message.error('解除失败！');
          }
        }.bind(this));
      }
    }
  }
</script>
<style scoped>
  .pTop{
    margin-bottom: 20px;
  }
</style>
