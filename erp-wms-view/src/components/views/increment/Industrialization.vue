<!--行业化 尘音-->
<template>
  <div id="industrialization">
    <div style="padding-bottom: 10px;border-bottom: 1px solid #ccc">批次设置</div>
    <div style="margin-top: 20px;position: relative">
      <el-switch v-model="value"></el-switch>
      <span style="position: absolute;left: 33px;margin-left: 15px;font-size: 14px">开启批次</span>
    </div>
    <!--footer-->
    <div class="wmsFoot">
      <el-button v-if="authorityCode.WMS_INDUSTRIALIZATION_HOLD" @click="holdClick" size="mini" type="primary">保 存</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0',//版本号
        value: false,//是否开启批次

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限
      }
    },
    mounted() {
      this.initMessage();//初始化页面数据
    },
    methods: {

      //初始化数据
      initMessage: function () {
        this._post('com.edb01.erp.mdata.service.api.TmtSetupService/' + this.version + '/getBatchFlag').then(function (res) {
          if(res.data.success) {
            this.value = res.data.result;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //保存接口
      initholdClick: function () {
        let data = {
          enableFlag: this.value
        };
        this._post('com.edb01.erp.mdata.service.api.TmtSetupService/' + this.version + '/editEnable',data).then(function (res) {
          if(res.data.success) {
            this.initMessage()
          }else {
            this.$alert(res.data.msg,{
              type: 'info',
              center: true,
              confirmButtonText: '知道了',
              callback: action => {
                this.initMessage()
              }
            })
          }
        }.bind(this))
      },

      //保存数据
      holdClick: function () {
        this.initholdClick()
      },
    }
  }
</script>
