<!--同步库存设置 尘音-->
<template>
  <div id="asStockSetup">
    <span>同步库存设置</span>
    <div style="margin-top: 10px;padding-left: 50px;position: relative">
      <el-checkbox @change="checkedClick" v-model="checked">开启按默认独占库存比例同步独占库存</el-checkbox>
      <el-tooltip class="item" effect="dark" content="开启后，当商品在仓库入库上架后，默认按照独占库存设置中的比例同步独占库存" placement="top-start">
        <i style="position: absolute;left: 317px;z-index: 99" class="el-icon-question"></i>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        checked: false,//同步库存是否开启
        synInvSetupId: false,//配置ID
      }
    },
    mounted() {
      this.initGetData();//初始化页面数据
    },
    methods: {

      //获取数据接口
      initGetData: function () {
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + '1.0.0' + '/getWmSynInvSetupBean').then(function (res) {
          console.log(res);
          if(res.data.success){
            this.checked = res.data.result.synInvDefaultFlag;
            this.synInvSetupId = res.data.result.synInvSetupId;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //更改数据接口
      initUpdate: function () {
        let data = {
          flag: this.checked,
          synId: this.synInvSetupId
        };
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + '1.0.0' + '/updateStrategyConfig',data).then(function (res) {
          if(res.data.success) {
            this.initGetData();
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //同步库存设置
      checkedClick: function () {
        this.initUpdate();
      },
    }
  }
</script>
