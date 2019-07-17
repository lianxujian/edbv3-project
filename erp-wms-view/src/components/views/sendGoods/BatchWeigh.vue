<!--批量称重 尘音-->
<template>
  <div id="batchWeigh">
    <div class="botTop">
      <div style="margin-bottom: 20px">
        <label for="waveCode">波次号：</label>
        <el-input :disabled="isWaveCode" v-model="waveCode" id="waveCode" @keyup.enter.native="waveCodeSearch" maxlength="50" style="width: 387px" placeHolder="请输入/扫码波此号，点击【回车】获取该波次的订单信息"></el-input>
        <span style="visibility: hidden">kg</span>
        <el-button size="mini" @click="reset" type="default" v-if="authorityCode.WMS_BATCHWEIGH_RESET">重 置</el-button>
        <p v-show="isWaveCodeShow" style="padding-left: 55px;color:red;">波次号不能为空</p>
      </div>
      <div style="display: inline-block;margin-right: 100px;margin-bottom: 20px">
        <label for="weighNum" style="width: 48px;text-align: right">毛重：</label>
        <el-input @change="changeWeighNum" @keyup.native="weighNum = weighNum.replace(/[^\d\.]/g,'');" placeHolder="请输入/扫描毛重信息，点击【回车】进行毛重值的提交" v-model="weighNum" id="weighNum" @keyup.enter.native="weighNumSearch" maxlength="7" style="width: 387px"></el-input>
        <span>kg</span>
        <el-button @click="weighNumSearch" size="mini" type="primary" v-if="authorityCode.WMS_BATCHWEIGH_SURE">确 定</el-button>
        <p v-show="isWeighNumShow" style="padding-left: 55px;color:red;">毛重不能为空</p>
      </div>
      <div style="display: inline-block">
        <label style="margin-right: 20px">异常订单/正常订单：</label>
        <div style="display: inline-block;">
          <span style="color: red;font-size: 20px;font-weight: bolder">{{abnormalCount}}</span>
          <span style="font-size: 20px;font-weight: bolder">/ {{normalCount}}</span>
        </div>
      </div>
    </div>
    <div class="botBot">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="异常原因" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.abnormalReason != undefined || scope.row.abnormalReason != ''" style="background: #FF8080">{{ scope.row.abnormalReason }}</div>
          </template>
        </el-table-column>

        <el-table-column label="订单号" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.salesOrderNo }}</p>
          </template>
        </el-table-column>

        <el-table-column label="快递单号" align="center">
          <template slot-scope="scope">
            <p class="initP-g">{{ scope.row.expressNo }}</p>
          </template>
        </el-table-column>


        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.orderStatus == 1">待客审</span>
            <span v-if="scope.row.orderStatus == 2">已客审</span>
            <span v-if="scope.row.orderStatus == 3">已财审</span>
            <span v-if="scope.row.orderStatus == 4">已仓审</span>
            <span v-if="scope.row.orderStatus == 5">已拣货</span>
            <span v-if="scope.row.orderStatus == 6">已验货</span>
            <span v-if="scope.row.orderStatus == 7">已打包</span>
            <span v-if="scope.row.orderStatus == 8">已称重</span>
            <span v-if="scope.row.orderStatus == 9">已发货</span>
            <span v-if="scope.row.orderStatus == 10">已完成</span>
            <span v-if="scope.row.orderStatus == 11">已取消</span>
            <span v-if="scope.row.orderStatus == 20">已分配拣货位</span>
          </template>
        </el-table-column>

        <el-table-column label="退款状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.refundStatus == 1">未退款</span>
            <span v-if="scope.row.refundStatus == 2">退款中</span>
            <span v-if="scope.row.refundStatus == 3">已退款</span>
          </template>
        </el-table-column>

        <el-table-column label="净重（kg）" align="right">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.totalWeight }}</p>
          </template>
        </el-table-column>

        <el-table-column label="毛重（kg）" align="right">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.roughWerght }}</p>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <div class="pagination">
        <pagination
          :totalCom="total"
          :pageSizeCom="pageSize"
          :curPageCom="curPage"
          @pageSizeVal="getPageSize" @curPageVal="getCurPage"
        ></pagination>
      </div>
    </div>

    <!--音乐盒子-->
    <div id="audio"></div>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  export default {
    components: {
      pagination
    },
    data() {
      return {
        version: '1.0.0',

        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数

        waveCode: '',//波次
        isWaveCode: false,//波次是否禁用
        isWaveCodeShow: false,//波次输入框校验

        weighNum: '',//毛重
        isWeighNumShow: false,//毛重输入框校验

        abnormalCount: 0,//异常订单
        normalCount: 0,//正常订单

        errorRangeEnd: 0,//错误范围下线
        errorRangeStart: 0,//错误范围上线

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限
      }
    },
    mounted() {

    },
    methods: {

      //毛重校验
      changeWeighNum: function () {

        this.weighNum = Number(this.weighNum).toFixed(2);
        if(this.weighNum.length > 7) {
          this.weighNum = '';
          this.$message({
            message: '毛重最大输入9999.99',
            type: 'warning'
          })
        }
      },

      //重置波次
      reset: function () {
        this.isWaveCode = false;
        this.waveCode = '';
        this.weighNum = '';
        this.tableData = [];
        this.abnormalCount = 0;
        this.normalCount = 0
      },

      //初始化界面数据接口
      initMessage: function () {
        let data = {
          "waveNo": this.waveCode,
          "page": this.curPage,
          "size": this.pageSize,
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/batchWeithGetOrder',data).then(function (res) {
          if(res.data.success) {
            if(res.data.result.checkWaveOrderExist == true) {
              this.$confirm('该波次存在明细不相同的订单，是否放弃称重？', '提示', {
                confirmButtonText: '不放弃',
                cancelButtonText: '放弃',
                type: 'warning',
                center: true
              }).then(() => {
                this.isWaveCode = true;
                this.tableData = res.data.result.WmsDataPager.rows;
                this.total = res.data.result.WmsDataPager.total;
                this.abnormalCount = res.data.result.abnormalCount;
                this.normalCount = res.data.result.normalCount;
                this.errorRangeEnd = res.data.result.errorRangeEnd;
                this.errorRangeStart = res.data.result.errorRangeStart
              }).catch(() => {
                this.reset()
              })
            }else {
              this.isWaveCode = true;
              this.tableData = res.data.result.WmsDataPager.rows;
              this.total = res.data.result.WmsDataPager.total;
              this.abnormalCount = res.data.result.abnormalCount;
              this.normalCount = res.data.result.normalCount;
              this.errorRangeEnd = res.data.result.errorRangeEnd;
              this.errorRangeStart = res.data.result.errorRangeStart
            }

          }else {
            this.$alert(res.data.msg, {
              type: 'info',
              center: true,
              confirmButtonText: '知道了',
            });
          }
        }.bind(this))
      },

      //称重结果提交后台接口
      initBatchWeith: function () {
        console.log('称重传参',this.tableData);
        let arr = [];
        this.tableData.forEach(function (val) {
          if(val.abnormalReason == undefined || val.abnormalReason == '') {
            arr.push({salesOrderId: val.salesOrderId,salesOrderNo: val.salesOrderNo})
          }
        });
        let data = {
          weightBeanJson: JSON.stringify(arr),
          roughWerght: this.weighNum,
          waveNo: this.waveCode
        };

        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/batchWeith',data).then(function (res) {
          if(res.data.success) {
            if(this.abnormalCount == 0){
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
            }else {
              this.$message({
                message: `该波次订单毛重成功更新${this.normalCount}单，存在${this.abnormalCount}单异常不支持称重!`,
                type: 'warning'
              });
            }

            this.reset()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //称重
      initBatchWeight: function () {
        if(this.weighNum > this.errorRangeEnd || this.weighNum < this.errorRangeStart) {
          this.$confirm('该波次订单的误差值超出了误差范围，是否放弃称重?', '提示', {
            confirmButtonText: '不放弃',
            cancelButtonText: '放弃',
            type: 'warning',
            center: true
          }).then(() => {
            this.initBatchWeith()
          });
          this.soundN()
        }else {
          this.soundY();
          this.initBatchWeith()
        }

      },

      //波次回车查找
      waveCodeSearch: function () {
        if(this.waveCode == '') {
          this.isWaveCodeShow = true
        }else {
          this.isWaveCodeShow = false;
          this.initMessage()
        }
      },

      //毛重回显
      weighNumSearch: function () {
        if(this.isWaveCode == false) {
          this.$message({
            message: '请输入波次号之后点击回车键【Enter】查询波次订单！',
            type: 'warning'
          });
        }else if(this.normalCount == 0) {
          this.$message({
            message: '该波次的订单全部异常不支持称重！',
            type: 'warning'
          });
        }else {
          if(this.weighNum == '') {
            this.isWeighNumShow = true;
          }else {
            this.isWeighNumShow = false;
            this.tableData.forEach(function (val,index) {
              if(this.tableData[index].abnormalReason == '' || this.tableData[index].abnormalReason == undefined) {
                let obj = this.tableData[index];
                obj.roughWerght = this.weighNum;
                this.$set(this.tableData,index,obj)
              }
            }.bind(this));
            this.initBatchWeight()
          }
        }
      },

      //以下是分页
      getPageSize: function (val) {
        if(val != undefined) {

          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();

        }

      },
      getCurPage: function (val) {
        if(val != undefined) {

          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
        }
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

      //播放异常音
      soundN: function () {
        this.clearAudio();
        this.audioN()
      },

      //播放正常音
      soundY: function () {
        this.clearAudio();
        this.audioY()
      },
    }
  }
</script>
