<!--称重 尘音-->
<template>
  <div id="weigh">
    <div class="pageTop">
      <el-input :disabled="orderCodeDisabled" @keyup.enter.native="orderCodeSearch" v-model="orderCode" maxlength="50" placeholder="请输入/扫描快递单号或者订单号，点击【回车】进行称重" style="width:350px;margin-right: 10px"></el-input>

      <el-button :disabled="submitDiffDisabled" @click="submitDiff" size="mini" type="default" v-if="authorityCode.WMS_WEIGH_DIFF">提交异常单</el-button>
      <p style="color: red" v-show="isOrderShow">快递单号或订单号不能为空</p>
      <el-dialog title="提交异常单" :visible.sync="diffVisible" width="400px" id="diffBox">
        <ul style="overflow: hidden" class="ulBox">
          <li v-for="(val,index) in abnormalReasonList" style="position: relative">
            <el-radio v-model="radioDiff" :label="val.reasionId">{{val.abnormalReason}}</el-radio>
            <!--<i v-if="val.abnormalType == 2" @click="deleteClick(val,index)" class="el-icon-close iconClose"></i>-->
          </li>
        </ul>
        <div slot="footer" class="dialog-footer">
          <div class="addDiff"><i @click="addDiff">添加异常原因</i></div>
          <el-button type="default" @click="diffVisible = false">取 消</el-button>
          <el-button type="primary" @click="diffSureClick">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加异常原因" :visible.sync="addDiffVisible" width="500px">
        <div>
          <label for="diff">异常原因：</label>
          <el-input id="diff" v-model="abnormalReason" style="width: 80%"></el-input>
          <p v-if="isdiffShow" style="color: red;text-indent: 5em">请输入异常原因</p>
          <div v-if="isMaxShow" style="color: red;text-indent: 5em;margin-top: 20px">提示：异常原因最多只能15条，请检查操作！</div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="default" @click="addDiffVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDiffSureClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="weighMsg">
      <el-row>
        <el-col :span="6" align="center">
          <span style="font-size: 25px;font-weight: bolder;">净重：{{readNum}} kg</span>
        </el-col>
        <el-col :span="6" align="center">
          <span :style="{color: 'black','font-size': '25px','font-weight':'bolder'}">毛重：{{weighNum}} Kg</span>
        </el-col>
        <el-col :span="6" align="center">
          <span v-if="isShow" :style="{'color': fontColor,'font-size': '25px','font-weight':'bolder'}">误差：<i :style="{'color': fontColor,'font-size': '25px','font-weight':'bolder','font-style':'normal'}" v-if="(weighNum - readNum) > 0">+</i> {{(weighNum - readNum) | toThree}}</span>
        </el-col>
        <el-col :span="6" align="center">
          <span style="color: red;font-size: 25px;font-weight: bolder;" v-if="abnormalStatus != null || abnormalStatus != undefined || abnormalStatus != ''">{{abnormalStatus}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="pageMid">
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <label>订单号：</label>
            <span>{{salesOrderNo}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label>快递信息：</label>
            <span>{{expressName}}</span>
            <span v-if="isExpressShow">/</span>
            <span>{{expressNo}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label>买家ID：</label>
            <span>{{buyerNick}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <label>是否开票：</label>
            <span v-if="invoiceFlag == true">是</span>
            <span v-if="invoiceFlag == false">否</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div class="grid-content">
          <label>收货信息：</label>
          <span>{{consignee}} {{consigneeMobile}} {{shippingAddress}}</span>
        </div>
      </el-row>
      <el-row>
        <div class="grid-content">
          <label>买家留言：</label>
          <span>{{customerMsg}}</span>
        </div>
      </el-row>
      <el-row>
        <div class="grid-content">
          <label>客服备注：</label>
          <span>{{serviceMsg}}</span>
        </div>
      </el-row>
      <el-row>
        <div class="grid-content">
          <label>内部便签：</label>
          <span>{{internalMemoMsg}}</span>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0',
        diffVisible: false,//提交异常单弹框
        addDiffVisible: false,//添加异常原因弹框
        isExpressShow: false,//快递斜线是否显示

        abnormalReasonList: [],//异常原因列表
        radioDiff: '',//异常原因
        isdiffShow: false,//异常原因判空
        isMaxShow: false,//15条限制信息

        abnormalReason: '',//添加异常原因

        salesOrderNo: '',//订单号
        salesOrderId: '',//订单Id
        expressName: '',//快递信息1
        expressNo: '',//快递信息2
        buyerNick: '',//买家ID
        invoiceFlag: null,//是否开票
        consignee: '',//收货信息1
        consigneeMobile: '',//收货信息2
        shippingAddress: '',//收获信息3
        customerMsg: '',//买家留言
        serviceMsg: '',//客户备足
        internalMemoMsg: '',//内部便签
        abnormalStatus: '',//订单状态

        fontColor: 'black',//误差颜色
        errorRangeStart: 0,//最小误差
        errorRangeEnd: '',//最大误差

        orderCode: '',//订单输入框绑定参数
        isOrderShow: false,//订单输入框校验
        weighNum: 0,//电子秤值
        readNum: 0,//净重

        orderCodeDisabled: false,//订单号是否可输入
        submitDiffDisabled: false,//提交异常单是否可点

        isShow: false,//是否显示误差

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限
      }
    },
    mounted() {
//      this.weighAudio()
    },
    methods: {

      //重验
      reset: function () {
        this.isExpressShow = false;

        this.salesOrderNo = '';
        this.expressName = '';
        this.expressNo = '';
        this.buyerNick = '';
        this.invoiceFlag = null;
        this.consignee = '';
        this.consigneeMobile = '';
        this.shippingAddress = '';
        this.customerMsg = '';
        this.serviceMsg = '';
        this.internalMemoMsg = '';
        this.abnormalStatus = '';
        this.orderCode = '';
        this.readNum = 0;
        this.weighNum = 0;
        this.fontColor = 'black'
      },

      //初始化订单信息
      initOrderMsg: function () {
        let data = {
          orderOrExpressNo: this.orderCode
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/weightUpShow',data).then(function (res) {
          if(res.data.success) {
            this.salesOrderNo = res.data.result.orderBean.salesOrderNo;
            this.salesOrderId = res.data.result.orderBean.salesOrderId;
            this.expressName = res.data.result.expressName;
            this.expressNo = res.data.result.orderBean.expressNo;
            if(this.expressName != '' && this.expressNo != '') {
              this.isExpressShow = true;
            }

            this.buyerNick = res.data.result.orderBean.buyerNick;
            this.invoiceFlag = res.data.result.orderBean.invoiceFlag;
            this.consignee = res.data.result.orderBean.consignee;
            this.consigneeMobile = res.data.result.orderBean.consigneeMobile;
            this.shippingAddress = res.data.result.orderBean.shippingAddress;
            this.customerMsg = res.data.result.orderBean.customerMsg;
            this.serviceMsg = res.data.result.orderBean.serviceMsg;
            this.internalMemoMsg = res.data.result.orderBean.internalMemoMsg;
            this.readNum = res.data.result.orderBean.totalWeight;
            console.log(res.data.result);
            this.abnormalStatus = res.data.result.abnormalStatus;

            this.errorRangeStart = res.data.result.errorRangeStart;
            this.errorRangeEnd = res.data.result.errorRangeEnd;
            if(this.abnormalStatus == '已取消' || this.abnormalStatus == '已退款' || this.abnormalStatus == '退款中') {
              this.orderCodeDisabled = false;
              this.orderCode = '';
              this.submitDiffDisabled = true;

            }else {
              this.orderCodeDisabled = false;
              this.submitDiffDisabled = false;
              if(this.readNum != 0) {
                this.weighVal()
              }

            }

          }else {
            this.$alert(res.data.msg,{
              type: 'info',
              center: true,
              confirmButtonText: '知道了',
              callback: action => {
                this.orderCode = '';
              }
            })
          }
        }.bind(this));

      },

      //初始化异常单原因
      initAbnormalReason: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/abnormalReasonList').then(function (res) {
          if(res.data.success) {
            this.abnormalReasonList = res.data.result
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //添加异常原因接口
      initAddAbnormalReason: function () {
        let data = {
          abnormalReason: this.abnormalReason
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/addAbnormalReason',data).then(function (res) {
          if(res.data.success) {
            this.addDiffVisible = false;
            this.submitDiff()
          }else if(res.data.code == 10000011){
            this.isMaxShow = true
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //提交异常单接口
      initAbnormalOrder: function (reasonId) {
        let data = {
          salesOrderId: this.salesOrderId,
          reasonId: reasonId
        };
        console.log(data);
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/submitAbnormalOrder',data).then(function (res) {
          if(res.data.success) {
            this.diffVisible = false;
            this.reset()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //称重成功提交接口
      initWeightUp: function () {
        let data = {
          salesOrderId: this.salesOrderId,
          roughWerght: this.weighNum,
          salesOrderNo: this.salesOrderNo
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/weightUp',data).then(function (res) {
          if(res.data.success) {
            this.reset()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //根据单号查找
      orderCodeSearch: function () {
        let len = this.orderCode.length;
        if(len == 0) {
          this.isOrderShow = true
        }else {
          this.isOrderShow = false;
          this.initOrderMsg();
        }
      },

      //单号错误接口
      initError: function () {
        let data = {
          orderOrExpressNO: this.orderCode
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/checkOrderOrExpressNo',data).then(function (res) {
          if(res.data.result) {
            this.diffVisible = true;
            this.initAbnormalReason()
          }else {
            this.$alert('快递单号错误，请输入正确的快递单号',{
              type: 'info',
              center: true,
              confirmButtonText: '知道了',
              callback: action => {
                this.orderCode = '';
              }
            })
          }

        }.bind(this))
      },

      //提交异常单
      submitDiff: function () {
        if(this.orderCode != '') {
          this.isOrderShow = false;
          this.initError()
        }else {
          this.isOrderShow = true
        }

      },

      //添加异常原因
      addDiff: function () {
        this.abnormalReason = '';
        this.diffVisible = false;
        this.addDiffVisible = true;

      },

      //添加异常原因确定
      addDiffSureClick: function () {
        if(this.abnormalReason == '') {
          this.isdiffShow = true
        }else {
          this.initAddAbnormalReason();
        }
      },

      //删除自定义异常原因
      deleteClick: function (val,index) {
        if(val.abnormalType == 2) {
          this.abnormalReasonList.splice(index,1)
        }
      },

      //提交异常单确定
      diffSureClick: function () {
        this.initAbnormalOrder(this.radioDiff)

      },

      //获取电子秤接口
      weighVal: function () {

        this.$http.get('http://127.0.0.1:8080').then(function (res) {
          this.weighNum = res.data.reader;
          let errorNum = this.weighNum - this.readNum;
          if(res.data.reader != 0) {
            this.isShow = true;
            if(errorNum <= this.errorRangeStart || errorNum >= this.errorRangeEnd) {
              this.fontColor = 'red';
              this.weighAudio('E');
              this.$confirm('该单据超出误差范围（单据已完成称重操作），是否提交重质量异常？','提示',{
                type: 'info',
                center: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                this.initAbnormalOrder('zhongliangyichangid')
              }).catch(() => {
                this.initWeightUp()
              });
            }else {
              this.fontColor = '#33CC33';
              this.weighAudio('R');
              this.initWeightUp()
            }
          }

          if(this.weighNum <= 0 && res.data.reader != '') {
            setTimeout(this.weighVal,2000);
            this.weighNum = 0;
          }

          if(res.data.reader == 0) {
            this.noneWeigh();
            setTimeout(() => {
              setInterval(this.noneWeigh,2000);
            },60000)
          }

        }.bind(this))
      },

      //获取电子秤提示音
      weighAudio: function (n) {
        this.$http.get('http://127.0.0.1:8080/' + n).then(function (res) {
          console.log(res)
        })
      },

      //未连接秤提示音
      noneWeigh: function () {
        this.$http.get('http://127.0.0.1:8080/E').then(function (res) {
          console.log(res)
        })
      },

    }
  }
</script>
<style scoped>
  .pageMid{
    margin-top: 20px;
    background: #F2F2F2;
    height: 188px;
    padding: 10px 30px
  }
  .weighMsg{
    margin-top: 20px;
  }
  .ulBox li{
    margin: 20px 0;
    padding-left: 10px;
    border-bottom: 1px solid #ccc;
  }
  .ulBox li label{
    font-size: 16px;
  }
  .addDiff{
    text-align: right;
    color: blue;
    padding:10px 45px 20px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .iconClose{
    color: #cccccc;
    position: absolute;
    top: 5px;
    right: 10px;
    cursor: pointer;
  }
  .iconClose:hover{
    color: rgb(96, 98, 102);
  }
</style>
<style>
  #diffBox .el-dialog__body{
    max-height: 300px;
    overflow-y: auto;
  }
</style>

