<!--验货 尘音-->
<template>
  <div id="checkGoods">
    <div class="pageTop">
      <el-input @keyup.enter.native="orderCodeSearch(1)" ref="orderCode" :disabled="orderCodeDisabled" v-model="orderCode" maxlength="50" placeholder="请输入/扫描快递单号或者订单号" style="width:300px;margin-right: 10px"></el-input>
      <el-button :disabled="resetDisabled" @click="resetClick" size="mini" type="primary" v-if="authorityCode.WMS_CHECKGOODS_RESET">重 验</el-button>
      <el-button :disabled="putUpClickDisabled" @click="putUpClick(2)" size="mini" type="primary" v-if="authorityCode.WMS_CHECKGOODS_PUTUP">挂 起</el-button>
      <el-button :disabled="submitDiffDisabled" @click="submitDiff(3)" size="mini" type="default" v-if="authorityCode.WMS_CHECKGOODS_DIFF">提交异常单</el-button>
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
          <el-input maxlength="20" id="diff" v-model="abnormalReason" style="width: 80%"></el-input>
          <p v-if="isdiffShow" style="color: red;text-indent: 5em">请输入异常原因</p>
          <div v-if="isMaxShow" style="color: red;text-indent: 5em;margin-top: 20px">提示：异常原因最多只能15条，请检查操作！</div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="default" @click="addDiffVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDiffSureClick">确 定</el-button>
        </div>
      </el-dialog>
      <span v-if="abnormalStatus != null || abnormalStatus != undefined || abnormalStatus != ''">{{abnormalStatus}}</span>
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
    <div class="pageBot">
      <div class="botTop">
        <div style="display: inline-block;margin-right: 100px">
          <label for="barCode">条形码：</label>
          <el-input :disabled="barCodeDisabled" ref="barCode" v-model="barCode" id="barCode" @keyup.enter.native="barCodeSearch" maxlength="50" style="width: 300px"></el-input>
          <p v-show="isBarCodeShow" style="padding-left: 55px;color:red;">条形码不能为空</p>
        </div>
        <div style="display: inline-block">
          <label style="margin-right: 20px">验货总数：</label>
          <div style="display: inline-block;">
            <span style="color: #33CC33;font-size: 20px;font-weight: bolder">{{orderOkNum}}</span>
            <span style="font-size: 20px;font-weight: bolder">/</span>
            <span style="font-size: 20px;font-weight: bolder">{{orderNum}}</span>
          </div>
        </div>
      </div>
      <div class="botBot">
        <div class="botBotL pDown">
          <el-table :data="tableData" border style="width: 750px">
            <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

            <el-table-column label="条形码" width="110">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.goodsBarCode }}</p>
              </template>
            </el-table-column>

            <el-table-column label="规格" width="80">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.goodsSpec }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品名称" width="200">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.goodsName }}</p>
              </template>
            </el-table-column>


            <el-table-column label="批次号" width="110">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.sectionName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="订货数量" align="right">
              <template slot-scope="scope">
                <p class="cen-g" style="text-align: right">{{ scope.row.goodsQty }}</p>
              </template>
            </el-table-column>

            <el-table-column label="已验货数量">
              <template slot-scope="scope">
                <!--有权限-->
                <p v-if="authorityCode.WMS_CHECKGOODS_INPUT" class="cen-g" :style="{'background':scope.row.bgColor}">
                  <el-input @focus="holdNum(scope.row.examineGoodsQty)" @change="changeNum(scope.row,scope.$index)" v-model="scope.row.examineGoodsQty"></el-input>
                </p>
                <p v-else class="cen-g" :style="{'background':scope.row.bgColor}">{{ scope.row.examineGoodsQty }}</p>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="botBotR">
          <img v-if="imageUrl != ''" :src="imageUrl" width="270" height="270" alt="">
          <img v-if="imageUrl == ''" src="../../../assets/img/default300.png" width="270" height="270" alt="">
        </div>
      </div>
    </div>
    <!--音乐盒子-->
    <div id="audio"></div>
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
        expressNo: '',//快递信息2R
        buyerNick: '',//买家ID
        invoiceFlag: null,//是否开票
        consignee: '',//收货信息1
        consigneeMobile: '',//收货信息2
        shippingAddress: '',//收获信息3
        customerMsg: '',//买家留言
        serviceMsg: '',//客户备足
        internalMemoMsg: '',//内部便签
        abnormalStatus: '',//订单状态
        imageUrl: '',//图片地址
        orderOkNum: 0,//已验货数
        orderNum: 0,// 验货总数

        tableData: [],//表格数据

        orderCode: '',//订单输入框绑定参数
        isOrderShow: false,//订单输入框校验

        barCode: '',//条形码输入框绑定参数
        isBarCodeShow: false,//条形码输入框校验

        orderCodeDisabled: false,//订单号是否可输入
        barCodeDisabled: false,//条形码是否可输入
        resetDisabled: false,//重验是否可点
        putUpClickDisabled: false,//挂起是否可点
        submitDiffDisabled: false,//提交异常单是否可点
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限
        ownOldNum: Number,//存储当前的已验货数量
        limitNum: 1,//点击限制
      }
    },
    mounted() {

    },
    methods: {

      //获取当前已验货数量
      holdNum: function (num) {
        this.ownOldNum = num
      },

      //手动修改已验货数量
      changeNum: function (row,index) {
        if(row.goodsQty >= row.examineGoodsQty) {
          this.orderOkNum = Number(this.orderOkNum) + Number(row.examineGoodsQty) - this.ownOldNum;
          if(this.orderOkNum == this.orderNum) {
            this.initExamine()
          }
        }else if(row.goodsQty < row.examineGoodsQty) {
          this.$message({
            message: '已验货数量不能大于订货数量！',
            type: 'warning'
          });
          row.examineGoodsQty = this.ownOldNum
        }
      },

      //初始化订单信息
      initOrderMsg: function (val) {
        this.limitNum = 2;
        let data = {
          orderOrExpressNO: this.orderCode
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/getOrder',data).then(function (res) {
          this.limitNum = 1;
          if(res.data.success) {
            if(val == 1) {
              this.orderCodeDisabled = true;
              this.$refs.barCode.focus();

              if(res.data.result.salesOrderNo == 'undefined') {
                res.data.result.salesOrderNo = ''
              }
              this.salesOrderNo = res.data.result.salesOrderNo;

              if(res.data.result.salesOrderId == 'undefined') {
                res.data.result.salesOrderId = ''
              }
              this.salesOrderId = res.data.result.salesOrderId;

              if(res.data.result.expressName == 'undefined') {
                res.data.result.expressName = ''
              }
              this.expressName = res.data.result.expressName;

              if(res.data.result.expressNo == 'undefined') {
                res.data.result.expressNo = ''
              }
              this.expressNo = res.data.result.expressNo;

              if(this.expressName != '' && this.expressNo != '') {
                this.isExpressShow = true;
              }

              if(res.data.result.buyerNick == 'undefined') {
                res.data.result.buyerNick = ''
              }
              this.buyerNick = res.data.result.buyerNick;

              if(res.data.result.invoiceFlag == 'undefined') {
                res.data.result.invoiceFlag = ''
              }
              this.invoiceFlag = res.data.result.invoiceFlag;

              if(res.data.result.consignee == 'undefined') {
                res.data.result.consignee = ''
              }
              this.consignee = res.data.result.consignee;

              if(res.data.result.consigneeMobile == 'undefined') {
                res.data.result.consigneeMobile = ''
              }
              this.consigneeMobile = res.data.result.consigneeMobile;

              if(res.data.result.shippingAddress == 'undefined') {
                res.data.result.shippingAddress = ''
              }
              this.shippingAddress = res.data.result.shippingAddress;

              if(res.data.result.customerMsg == 'undefined') {
                res.data.result.customerMsg = ''
              }
              this.customerMsg = res.data.result.customerMsg;

              if(res.data.result.serviceMsg == 'undefined') {
                res.data.result.serviceMsg = ''
              }
              this.serviceMsg = res.data.result.serviceMsg;

              if(res.data.result.internalMemoMsg == 'undefined') {
                res.data.result.internalMemoMsg = ''
              }
              this.internalMemoMsg = res.data.result.internalMemoMsg;

              if(res.data.result.abnormalStatus == 'undefined') {
                res.data.result.abnormalStatus = ''
              }
              this.abnormalStatus = res.data.result.abnormalStatus;

              if(this.abnormalStatus == '已取消' || this.abnormalStatus == '已退款' || this.abnormalStatus == '退款中') {
                this.orderCodeDisabled = false;
                this.orderCode = '';
                this.barCodeDisabled = true;
                this.resetDisabled = false;
                this.putUpClickDisabled = true;
                this.submitDiffDisabled = true;

              }else {
                this.barCodeDisabled = false;
                this.resetDisabled = false;
                this.putUpClickDisabled = false;
                this.submitDiffDisabled = false;
              }

              this.imageUrl = res.data.result.orderItemList[0].imageUrl;
              res.data.result.orderItemList.forEach(function (val) {
                if(val.examineGoodsQty == '' || val.examineGoodsQty == null || val.examineGoodsQty == undefined) {
                  val.examineGoodsQty = 0
                }
              }.bind(this));

              res.data.result.orderItemList.forEach(function (val) {

                this.orderOkNum += Number(val.examineGoodsQty);
                this.orderNum += Number(val.goodsQty);
                if(val.examineGoodsQty == 0) {
                  val.bgColor = '';
                }else {
                  if(val.examineGoodsQty == val.goodsQty) {
                    val.bgColor = 'green'
                  }else {
                    val.bgColor = 'yellow'
                  }
                }
              }.bind(this));

              this.tableData = res.data.result.orderItemList;
              console.log(111,this.tableData)
            }else if(val == 2) {

              //挂起
              this.initUpIndexOrder()
            }else if(val == 3) {

              //提交异常单
              this.initAbnormalReason()
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
//            this.orderCode = '';
//            this.$message({
//              message: res.data.msg,
//              type: 'info'
//            });
          }
        }.bind(this))
      },

      //挂起接口
      initUpIndexOrder: function () {
        let tableDataStr = JSON.stringify(this.tableData);
        if(this.abnormalStatus == undefined || this.abnormalStatus == null) {
          this.abnormalStatus = ''
        }
        let data = {
          salesOrderId: this.salesOrderId,
          salesOrderNo: this.salesOrderNo,
          expressName: this.expressName,
          expressNo: this.expressNo,
          buyerNick: this.buyerNick,
          invoiceFlag: this.invoiceFlag,
          consignee: this.consignee,
          consigneeMobile: this.consigneeMobile,
          shippingAddress: this.shippingAddress,
          customerMsg: this.customerMsg,
          serviceMsg: this.serviceMsg,
          internalMemoMsg: this.internalMemoMsg,
          abnormalStatus: this.abnormalStatus,
          imageUrl: this.imageUrl,
          orderItemListStr: tableDataStr
        };
        console.log(data);
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/putUpIndexOrder',data).then(function (res) {
          console.log(res.data);
          if(res.data.success) {
            this.orderCodeDisabled = false;
            this.$message({
              message: '挂起成功！',
              type: 'success'
            });
            this.reset()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //验货完成接口
      initExamine: function () {
        let data = {
          salesOrderId: this.salesOrderId,
          salesOrderNo: this.salesOrderNo
        };
        console.log(data);
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/examine',data).then(function (res) {
          if(res.data.success) {
            this.$message({
              message: '验货完成！',
              type: 'success'
            });
            this.reset();
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
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
      initAbnormalOrder: function () {
        let data = {
          salesOrderId: this.salesOrderId,
          reasonId: this.radioDiff
        };
        console.log(data);
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/submitAbnormalOrder',data).then(function (res) {
          if(res.data.success) {
            this.diffVisible = false;
            this.$message({
              message: '提交成功！',
              type: 'success'
            });
            this.reset()
          }else if(res.data.code == 10000014) {
            this.diffVisible = false;
            this.$alert('' + res.data.msg,{
              type: 'info',
              center: true,
              confirmButtonText: '知道了',
              callback: action => {
                this.reset()
              }
            })
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //重验接口
      initPutupOrder: function () {
        let data = {
          salesOrderNo:this.salesOrderNo
        };
        this._post('com.edb01.erp.wms.service.api.SendOutGoodsService/' + this.version + '/resetPutupOrder',data).then(function (res) {
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

      //重验
      resetClick: function () {
        if(this.salesOrderNo != '') {
          this.initPutupOrder();
        }else {
          this.reset()
        }
      },

      //重置
      reset: function () {
        this.orderCodeDisabled = false;
        this.orderCode = '';
        this.$refs.orderCode.focus();
        this.isExpressShow = false;
        this.salesOrderId = '';
        this.orderOkNum = 0;
        this.orderNum = 0;

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

        this.barCode = '';

        this.tableData = [];
        this.imageUrl = '';

      },

      //挂起
      putUpClick: function (val) {
        if(this.orderCode == '') {
          this.isOrderShow = true;
        }else if(this.salesOrderId == '') {
          this.$message({
            message:'请点击回车按键！',
            type: 'warning'
          })
        }else {
          this.initOrderMsg(val);
        }
      },

      //根据单号查找
      orderCodeSearch: function (val) {

        if(this.orderCode == '') {
          this.isOrderShow = true;
        }else {
          this.isOrderShow = false;
          if(this.limitNum == 1) {
            this.initOrderMsg(val);
          }

        }
        n = 2
      },

      //提交异常单
      submitDiff: function (val) {
        if(this.orderCode == '') {
          this.isOrderShow = true;
        }else if(this.salesOrderId == '') {
          this.$message({
            message:'请点击回车按键！',
            type: 'warning'
          })
        }else {
          this.isOrderShow = false;
          this.diffVisible = true;
          this.initOrderMsg(val);
        }
      },

      //添加异常原因
      addDiff: function () {
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
        this.initAbnormalOrder()

      },

      //根据条形码查找
      barCodeSearch: function () {
        let len = this.barCode.length;
        if(len == 0) {
          this.isBarCodeShow = true;
        }else {
          this.isBarCodeShow = false;
          let arr = [];
          this.tableData.forEach(function (val,index) {
            arr.push(this.barCode == val.goodsBarCode);

            if(this.tableData[index].goodsBarCode == this.barCode) {

              this.orderOkNum ++;

              this.tableData.splice(index,1);
              this.tableData.unshift(val);

              this.tableData[0].examineGoodsQty ++;

              if(this.tableData[0].examineGoodsQty == this.tableData[0].goodsQty) {

                this.tableData[0].bgColor = 'green';

                this.tableData.push(val);
                this.tableData.shift();

              }else {
                this.tableData[0].bgColor = 'yellow'
              }

              if(this.tableData[0].examineGoodsQty > this.tableData[0].goodsQty) {
                this.soundN();
                this.$alert('该商品已完成验货，请核对数量！',{
                  type: 'info',
                  center: true,
                  confirmButtonText: '知道了',
                });
                this.tableData[0].examineGoodsQty = this.tableData[0].goodsQty;
                this.tableData[0].bgColor = 'green';
                this.orderOkNum = this.orderOkNum - 1;

              }else {
                this.soundY()
              }

              this.imageUrl = this.tableData[0].imageUrl;
              this.barCode = '';

            }

          }.bind(this));

          if(arr.indexOf(true) == -1) {
            this.$alert("无效条形码！", {
              type: 'info',
              center: true,
              confirmButtonText: '知道了'
            });
            this.barCode = '';
          }
        }
        console.log(1111,this.tableData);
        if(this.orderOkNum == this.orderNum && this.orderNum != 0) {
          this.initExamine()
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
<style scoped>
  .pageTop{
    position: relative;
  }
  .pageTop span{
    position: absolute;
    right: 15%;
    top: 20px;
    color: red;
    font-size: 25px;
    font-weight: bolder;
  }
  .pageMid{
    margin-top: 40px;
    background: #F2F2F2;
    height: 188px;
    padding: 10px 30px
  }
  .pageBot{
    margin-top: 20px;
  }
  .botBot{
    margin-top: 20px;
    overflow: hidden;
  }
  .botBotL,.botBotR{
    float: left;
  }
  .botBotR{
    margin-left: 30px;
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
