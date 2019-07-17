<!--验货出库 秋香-->
<template>
  <div id="ExamineGoods">
    <div class="pageTop">
      <label >出库单号：</label>
      <el-input @keyup.enter.native="orderCodeSearch"  ref="oneBrand" v-model="stockOutNo" :maxlength="50" placeholder="输入后请敲回车键" style="width:300px;margin-right: 10px" ></el-input>
      <el-button @click="reset" size="mini" type="primary" :disabled="isDisable">重 验</el-button>
    </div>
    <div style="margin-top: 20px">
      <div>
          <el-row>
            <div class="grid-content">
              <label>出货备注：</label>
              <span>{{stockOutRemark}}</span>
            </div>
          </el-row>
        <el-row>
          <div class="grid-content">
            <label>提示：</label>
            <span style="font-weight: normal ;font-size: 26px;color: red">{{msg}}</span>
          </div>
        </el-row>
      </div>
    </div>
    <div>
      <div>
        <div style="display: inline-block;margin-right: 100px;">
          <label>条形码：</label>
          <el-input v-model="barCode" id="barCode" placeholder="输入后请敲回车键" @keyup.enter.native="barCodeSearch" maxlength="50" style="width: 300px"></el-input>
          <p v-show="isBarCodeShow" style="padding-left: 55px;color:red;">条形码不能为空</p>
        </div>
        <div style="display: inline-block">
          <label style="margin-right: 20px">验货总数：</label>
          <div style="display: inline-block;">
            <span style="color: #33CC33;font-size: 20px;font-weight: bolder">{{realTotal}}</span>
            <span style="font-size: 20px;font-weight: bolder">/</span>
            <span style="font-size: 20px;font-weight: bolder">{{goodsTotal}}</span>
          </div>
        </div>
      </div>
      <div class="botBot">
        <div class="botBotL pDown">
          <el-table :data="tableData" border style="width: 750px">
            <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

            <el-table-column
              align="center"
              label="验货状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0" style="color: red">未验货</span>
                <span v-if="scope.row.status == 1" style="color: green">已验货</span>
                <span v-if="scope.row.status == 2" style="color: red">部分验货</span>
              </template>
            </el-table-column>

            <el-table-column label="条形码" prop="barCode">
            </el-table-column>

            <el-table-column label="批次号" prop="batchNo">
            </el-table-column>

            <el-table-column label="出库数量" align="right" prop="goodsQty">
            </el-table-column>

            <el-table-column label="验货数量"  width="100px">
              <template slot-scope="scope">
                <el-input  v-model="scope.row.realQty" :maxlength="20"  style="width:70px;"@keyup.enter.native="numSearch(scope.row)" onkeyup="value=value.replace(/^0/g,'')"></el-input>
                <!-- <p class="cen-g" :style="{'background':scope.row.bgColor}">{{ scope.row.realQty }}     onkeyup="value=value.replace(/[^\d]/ig,'')</p>-->
              </template>
            </el-table-column>

            <el-table-column label="商品名称" prop="goodsName">
            </el-table-column>

            <el-table-column label="规格" prop="specification">
            </el-table-column>

            <el-table-column label="商品属性">
              <template slot-scope="scope">
                <span v-if="scope.row.goodsAttrType==1">正品</span>
                <span v-if="scope.row.goodsAttrType==2">次品</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="botBotR" v-for="(item,i) in tableData" >
          <span v-show="item.hasOwnProperty('imageUrl') && i == 0"><img :src="item.imageUrl" width="270" height="270" alt=""></span>
          <span v-show="!item.hasOwnProperty('imageUrl') && i == 0"> <img src="../../../assets/img/default300.png" width="270" height="270" alt=""></span>
        </div>
        <div class="botBotR" v-show="tableData.length == 0">
          <img src="../../../assets/img/default300.png" width="270" height="270" alt="">
        </div>
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
        version: '1.0.0',//版本号
        stockOutRemark:'',//备注
        realQty:'',//验货数量
        goodsQty:'',//出库数量
        goodsTotal:0,//商品数量
        realTotal:0,//验货总数
        stockOutId: '',//订单号
        salesOrderId: '',//订单Id
        stockOutItemId:'',//出库单明细id
        imageUrl: '',//图片地址
        tableData: [],//表格数据
        isOrderShow: false,//订单输入框校验
        barCode: '',//条形码输入框绑定参数
        isBarCodeShow: false,//条形码输入框校验
        msg:'',//提示信息
        isDisable:false,//重验
        stockOutNo:'',//出库单号
        information:'',//商品已验货信息
      }
    },
    mounted() {

    },
    methods: {
      //初始化订单信息
      initOrderMsg: function (a) {
        let data = {
          stockOutNo: this.stockOutNo
        };
        this._post('com.edb01.erp.wms.service.api.WmStockOutCheckService/' + this.version + '/getStockInfo',data).then(function (res) {
          if(res.data.success==true){
            if(res.data.code==0) {
              this.tableData=res.data.result.stockOutItem;
              this.stockOutRemark = res.data.result.stockOutRemark;//备注
              this.salesOrderId = res.data.result.salesOrderId;
              this.goodsTotal=res.data.result.goodsTotal;//商品数量
              this.realTotal=res.data.result.realTotal;//验货总数
              this.stockOutItemId=res.data.result.stockOutItemId;
              this.isDisable=false;
              this.msg=''
              this.barCode=''
              this.tableData.forEach((item)=>{
                item.dtGoodsImageBeanList.forEach((val)=>{
                  if(val.pri == 0 && val.imageUrl != ''){
                    item.imageUrl = val.imageUrl
                  }
                })
              })
            }}else{
           if(res.data.code==320000004) { // 出库单不存在
              this.tableData=res.data.result.stockOutItem;
              this.stockOutRemark = res.data.result.stockOutRemark;//备注
              this.salesOrderId = res.data.result.salesOrderId;
              this.goodsTotal=res.data.result.goodsTotal;//商品数量
              this.realTotal=res.data.result.realTotal;//验货总数
              this.stockOutItemId=res.data.result.stockOutItemId;
              this.isDisable=false;
              this.msg=res.data.msg;
            }
            if(res.data.code==320000003) {
              if(this.information=='商品已全部验货'){
                this.msg='商品已全部验货'
                this.stockOutNo=''
                this.audioY()
                this.tableData=[]
                this.realTotal=0
                this.goodsTotal=0
                this.barCode=''
                this.$nextTick(()=> {
                  this.$refs.oneBrand.focus();
                })

              }else{
                this.audioN()
                this.msg=res.data.msg;
                this.tableData=[]
                this.realTotal=0
                this.goodsTotal=0
                this.barCode=''
              }
            }if(res.data.code==320000001) { // 出库单不存在
              this.isDisable=false;
              this.tableData=[]
              this.goodsTotal=0;//商品数量
              this.realTotal=0;//验货总数
              this.msg=res.data.msg;
              this.audioN()
            }
          }

        }.bind(this))
      },

      //重验
      reset: function () {
        if(this.msg=='已验货'){

        }else{
          let data = {
            stockOutNo: this.stockOutNo
          };
          this._post('com.edb01.erp.wms.service.api.WmStockOutCheckService/' + this.version + '/reset',data).then(function (res) {
            this.initOrderMsg()
          }.bind(this))
        }

      },

      //根据单号查找
      orderCodeSearch: function () {
        let len = this.stockOutNo.length;
        if(len == 0) {
          this.isOrderShow = true
        }else {
          this.isOrderShow = false;
          this.initOrderMsg()
        }
      },

      //根据条形码查找
      barCodeSearch: function () {
        let len = this.barCode.length;
        if(len == 0) {
          this.isBarCodeShow = true;
        }else {
          if(this.goodsTotal==this.realTotal+1){
            this.information='商品已全部验货'
          }
          let data = {
            stockOutNo: this.stockOutNo,//订单id
            barCode: this.barCode, //条形码
          };
          this._post('com.edb01.erp.wms.service.api.WmStockOutCheckService/' + this.version + '/inc', data).then(function (res) {
            if(res.data.success==true){
           if(res.data.code==0){
               this.initOrderMsg(this.information)
               this.audioY()
           }else if(res.data.code==320000004){
             this.initOrderMsg(res.data.msg)
             this.realQty ++;
             this.realTotal=this.goodsTotal
           }
          }if(res.data.success==false){
              if(res.data.code==320000004){
                this.initOrderMsg(res.data.msg)
                this.realQty ++;
                this.$message({
                  message: '验货数量不能超过出库数量！',
                  type: 'warning'
                });
              } else if(res.data.code==320000002){
                this.$message({
                  message: '商品不存在！',
                  type: 'warning'
                });
                this.audioN()
              }
            }
          }.bind(this))
        }
      },

      //输入状态
      numSearch(row){
    if(row.realQty<=row.goodsQty){
        if(row.goodsQty==row.realQty){
          this.information='商品已全部验货'
        }
        let data = {
          stockOutNo: this.stockOutNo,//订单id
          barCode: row.barCode, //条形码
          realQty: row.realQty, //验货数量
          stockOutItemId: row.stockOutItemId//出库单明细id
        };
        this._post('com.edb01.erp.wms.service.api.WmStockOutCheckService/' + this.version + '/inc', data).then((res) => {
          if(res.data.code==0){
              this.initOrderMsg(this.information)
              this.audioY()
          }else if(res.data.code==320000004){
            this.initOrderMsg(res.data.msg)
          }
        })
        } else{
          this.$message({
            message: '验货数量不能超过出库数量！',
            type: 'warning'
          });
        }
      },

      //异常音接口
      audioN() {
        let str = `<audio src="http://centaur-files.oss-cn-zhangjiakou.aliyuncs.com/20180807/DAAA5D8F44B249199EDF79F36E3FD3A3.wav" autoplay></audio>`;
        $('#audio').append(str)
      },

      //正常音接口
      audioY() {
        let str = `<audio src="http://centaur-files.oss-cn-zhangjiakou.aliyuncs.com/20180807/8804D017D3EF4B8AB85E80863842F98F.wav" autoplay></audio>`;
        $('#audio').append(str)
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

</style>


