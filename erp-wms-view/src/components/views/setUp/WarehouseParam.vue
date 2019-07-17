<!--仓库参数 尘音-->
<template>
  <div id="warehouseParam">
    <!--主体-->
    <div class="content">
      <div class="conTop">
        <h3>误差范围</h3>
        <div class="topCon" style="position: relative">
          <label>系统支持的误差范围值：</label>
          <div v-show="isEditShow" style="position: absolute;top: 7px;left: 160px">
            <span style="position: absolute;">+</span>
            <span style="position: absolute;top: 8px;left: 1px">-</span>
          </div>
          <div v-show="isHoldShow" style="position: absolute;top: 11px;left: 160px">
            <span style="position: absolute;">+</span>
            <span style="position: absolute;top: 8px;left: 1px">-</span>
          </div>
          <div style="display: inline-block;margin-left: 20px" v-show="isEditShow">
            <span>{{errorValue}}</span>
            %
            <!--~-->
            <!--<span>{{errorEnd}}</span>-->
            <!--%-->
          </div>
          <div style="display: inline-block;margin-left: 20px" v-show="isHoldShow">
            <input type="number" v-model="errorValue" class="inpNum-g">
            %
          </div>
        </div>
      </div>
      <div class="conMid">
        <h3>挂起次数</h3>
        <div class="midCon">
          <label>验货操作最多可挂起的次数：</label>
          <div style="display: inline-block" v-show="isEditShow">{{putUpNums}}</div>
          <div style="display: inline-block" v-show="isHoldShow">
            <input type="number" v-model="putUpNums" class="inpNum-g">
          </div>
        </div>
      </div>
      <div class="conBot">
        <h3>提示音</h3>
        <div class="botCon">
          <div>
            <label>异常提示音：</label>
            <div style="display: inline-block">
              <span>异常音</span>
              <img @click="soundN" width="35" height="25" src="../../../assets/img/weighSound.png" alt="异常音">
            </div>
          </div>
          <div style="margin-top: 20px">
            <label>正常提示音：</label>
            <div style="display: inline-block">
              <span>正常音</span>
              <img @click="soundY" width="35" height="25" src="../../../assets/img/weighSound.png" alt="正常音">
            </div>
          </div>
        </div>
      </div>
      <!--footer-->
      <div class="wmsFoot">
        <el-button v-show="isBackShow" @click="backClick" size="mini">返 回</el-button>
        <el-button v-show="isHistoryShow" @click="historyClick" size="mini">取 消</el-button>
        <el-button v-show="isHoldShow" @click="holdClick" size="mini" type="primary">保 存</el-button>
        <el-button v-if="authorityCode.WMS_WAREHOUSEPARAM_HOLD" v-show="isEditShow" @click="editClick" size="mini" type="primary">修 改</el-button>
      </div>
    </div>
    <div id="audio">

    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0',
        isEditShow: true,//修改是否显示
        isHoldShow: false,//保存是否显示
        isBackShow: false,//返回是否显示
        isHistoryShow: false,//取消是否显示
        errorValue: '',//误差值
        putUpNums: '',//挂起次数

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限
      }
    },

    mounted() {
      this.initMessage();//初始化页面数据
    },

    methods: {

      //初始化页面数据
      initMessage: function () {
        this._post('com.edb01.erp.wms.service.api.StorageSettingService/' + this.version + '/getSetting')
          .then(function (res) {
            if(res.data.success) {
              this.errorValue = res.data.result.errorEnd;
              this.putUpNums = res.data.result.putUpNums
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }.bind(this))
      },

      //保存接口
      initHold: function () {
        let data = {
          "errorSatrt": - this.errorValue,
          "errorEnd": this.errorValue,
          "putUpNums": this.putUpNums
        };
        this._post('com.edb01.erp.wms.service.api.StorageSettingService/' + this.version + '/saveSetting',data)
          .then(function (res) {
            if(res.data.success) {

              this.isBackShow = false;
              this.isHistoryShow = false;
              this.$message({
                message: '保存成功',
                type: 'success'
              });
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }.bind(this))
      },

      //异常音接口
      audioN: function () {
        let str = `<audio src="http://centaur-files.oss-cn-zhangjiakou.aliyuncs.com/20180807/DAAA5D8F44B249199EDF79F36E3FD3A3.wav" autoplay></audio>`;
        $('#audio').append(str)
      },

      //正常音接口
      audioY: function () {
        let str = `<audio src="http://centaur-files.oss-cn-zhangjiakou.aliyuncs.com/20180807/8804D017D3EF4B8AB85E80863842F98F.wav" autoplay></audio>`;
        $('#audio').append(str)
      },

      //清除提示音
      clearAudio: function () {
        $('#audio').empty()
      },

      //点击播放异常音
      soundN: function () {
        this.clearAudio();
        this.audioN()
      },

      //点击播放正常音
      soundY: function () {
        this.clearAudio();
        this.audioY()
      },

      //点击修改
      editClick: function () {
        this.isEditShow = false;
        this.isHoldShow = true;
        this.isBackShow = true;
        this.isHistoryShow = false;
      },

      //点击保存
      holdClick: function () {
        this.isEditShow = true;
        this.isHoldShow = false;
        this.initHold()
      },

      //点击返回
      backClick: function () {
        this.isEditShow = true;
        this.isHoldShow = false;
        this.isBackShow = false;
        this.isHistoryShow = false;
        this.initMessage()
      },

      //点击取消
      historyClick: function () {
        this.isEditShow = false;
        this.isHoldShow = true;
        this.isBackShow = true;
        this.isHistoryShow = false;
      },
    }
  }
</script>
<style scoped>
  .content h3{
    font-size: 12px;
    background: #F1F1F1;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding-left: 12px;
  }
  .topCon,.midCon,.botCon{
    padding: 10px 20px;
  }
  .conBot{
    margin-bottom: 80px;
  }
</style>
