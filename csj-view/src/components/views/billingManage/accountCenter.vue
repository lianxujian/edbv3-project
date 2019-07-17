<template>
  <div>
    <div class="wrapper">
      <div>
        <div class="mess"><span>您的基础信息</span></div>
        <ul class="wra-ul">
          <li><span>主账号：</span>&nbsp;&nbsp;<span>{{rechargeData.mainAccount}}</span></li>
          <li><span>绑定手机：</span><el-input
            size="small"
            type="text"
            maxlength="11"
            @keyup.native="baseInfo.bindMobile = baseInfo.bindMobile.replace(/[^\d]/ig,'')"
            style="width: 26%;"
            v-model="baseInfo.bindMobile"
            :disabled='phoneEdit'>
          </el-input><span v-if="!phoneSave" class="alter" @click='phoneEditBtn'>修改</span><span v-if="phoneSave" class="alter" style="color:red;" @click='phoneSaveBtn'>取消</span><span class="alter1" v-if='phoneSave' @click='phoneSaveBtn("save")'>保存</span></li>
          <li><span>绑定邮箱：</span><el-input
            size="small"
            type="text"
            style="width: 26%"
            v-model="baseInfo.bindEmail"
            :disabled="emailEdit">
          </el-input><span v-if="!emailSave" class="alter" @click='emailEditBtn'>修改</span><span v-if="emailSave" class="alter" style="color:red;" @click='emailSaveBtn'>取消</span><span class="alter1" v-if='emailSave' @click='emailSaveBtn("save")'>保存</span></li>
        </ul>
      </div>
      <div>
        <div class="mess"><span>您的账户信息</span>
          <el-button  type="warning" size='mini' round style="margin-left: 5%;" @click="rechargeDialog">充值</el-button>
        </div>
        <div style="width: 80%;margin-top: 20px;" v-if='tableShow'>
          <el-table
            :data="rechargeData.rechargeRecordBeanList"
            border
            style="width: 100%">
            <el-table-column
              align="right"
              prop="rechargeAmount"
              label="充值金额（元）">
            </el-table-column>
            <el-table-column
              align="right"
              prop="acquirePrice"
              label="获取单价（元/条）">
            </el-table-column>
            <el-table-column
              align="right"
              prop="publishPrice"
              label="发布单价（元/条）">
            </el-table-column>
            <el-table-column
              align="right"
              prop="consumeAmount"
              label="消耗金额（元）">
            </el-table-column>
            <el-table-column
              align="right"
              prop="freezeAmount"
              label="冻结金额（元）">
            </el-table-column>
            <el-table-column
              align="right"
              prop="surplusAmount"
              label="可用余额（元）">
            </el-table-column>
            <el-table-column
              align="center"
              label="状态">
              <template slot-scope="scope">
                <span style='color:green;' v-if='scope.row.status=="B11"'>正在使用</span>
                <span style='color:orange;' v-if='scope.row.status=="B12"'>未使用</span>
                <span style='color:red;' v-if='scope.row.status=="B13"'>已使用</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--<div v-if='easyShow' style='margin:25px 0 0 20px;'><span>试用版本：免费50条</span><span style='margin:0 50px 0 50px;'>已使用{{rechargeData.totalConsumeAmount}}条</span><span>剩余可用<span style='color:orange;'>{{rechargeData.preStoreTotalSurplusAmount}}</span>条</span></div>-->
        <div v-if='easyShow' style='margin:25px 0 0 20px;'><span>免费试用剩余天数：</span><span style="color:red;"> {{rechargeData.surplusDay}} </span><span>天，试用到期时间：</span><span style="color:red;"> {{rechargeData.expireTime}}</span></div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="充值"
      :visible.sync="centerDialogVisible"
      width="420px"
    >
      <div>
        <ul class="t-ul">
          <li><span>充值账号：{{rechargeData.mainAccount}}</span></li>
          <li><span style="">充值金额：</span>
            <el-select v-model="rechargeParam" size="small" style="width:160px;" placeholder="请选择充值金额">
              <el-option
                v-for="item in rechargeData.rechargeGoodsBeanList"
                :key="item.rechargeGoodsId"
                :label="item.rechargeGoodsName"
                :value="item.rechargeGoodsId">
              </el-option>
            </el-select>
          </li>
          <li>
            <span style="vertical-align: top;">充值方式：</span>
            <span class='pay-way' v-for='(item,index) in payData' :class="{'pay-active':subIndex==index}" @click="submenutab(index)">{{item}}</span>
          </li>
          <li>
            <el-button style='width:260px;' type='primary' size="small" @click='nextBtn'>下一步</el-button>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [//表格信息
          {money: '2000.00', priceH: ' 0.05', priceF: ' 0.05', moneyX: '500.00', moneyK: ' 1500.00', start: '正在使用'},
          {money: '500.00', priceH: ' 0.05', priceF: ' 0.05', moneyX: '0', moneyK: ' 500', start: '未使用'},
          {money: '1000.00', priceH: ' 0.05', priceF: ' 0.05', moneyX: '1000', moneyK: ' 0', start: '已使用'}

        ],
        centerDialogVisible: false,
        rechargeParam: '',//
        payData:['支付宝'],
        subIndex:0,
        baseInfo:{
          bindMobile:'',
          bindEmail:''
        },
        phoneEdit:true,
        phoneSave:false,
        emailEdit:true,
        emailSave:false,
        rechargeData:{
          surplusDay:0
        },
        tableShow:false,
        easyShow:false
      }
    },
    methods:{
      //补零的方法
      returnFloat(x) {
        var f = parseFloat(x);
        var f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },
      //電話号码修改
      phoneEditBtn(){
        if(!this.emailEdit){
          this.$message({
            message: '请先保存邮箱！',
            type: 'warning'
          });
        }else{
          this.phoneSave=true;
          this.phoneEdit=false;
        }
      },
      //电话号码保存
      phoneSaveBtn(param){
        if(param != 'save'){
          this.baseInfo.bindMobile=this.rechargeData.bindMobile;
          this.phoneSave=false;
          this.phoneEdit=true;
          return false;
        }
        if(!this.baseInfo.bindMobile){
          this.$message({
            message: '请输入手机号码！',
            type: 'warning'
          });
          return false;
        }
        /*if(!(/^1[34578][0-9]{9}$/.test(this.baseInfo.bindMobile))){
          this.$message({
            message: '手机号码格式不正确',
            type: 'warning'
          });
          //this.baseInfo.bindMobile=this.rechargeData.bindMobile;
          return false;
        }*/
        var self = this;
          this.$axios({
            method:'post',
            url:process.env.OLD_API + 'api/recharge/update',
            data:this.baseInfo,
            transformRequest:[function (data) {
              let newData = '';
              for(let k in data){
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
              }
              return newData;
            }]

          })
            .then(function (response) {
              if(response.data.code==0){
                self.rechargeData.bindMobile = self.baseInfo.bindMobile;
                self.phoneSave=false;
                self.phoneEdit=true;
                self.$message({
                  message: '修改成功！',
                  type: 'success'
                });
              }else{
                self.$message({
                          message: response.data.message,
                          type: 'warning'
                        });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
      },
      //邮箱修改
      emailEditBtn(){
        if(!this.phoneEdit){
          this.$message({
            message: '请先保存手机号码！',
            type: 'warning'
          });
        }else{
          this.emailSave=true;
          this.emailEdit=false;
        }
      },
      //邮箱保存
      emailSaveBtn(param){
        if(param != 'save'){
          this.baseInfo.bindEmail=this.rechargeData.bindEmail;
          this.emailSave=false;
          this.emailEdit=true;
          return false;
        }
        if(!this.baseInfo.bindEmail){
          this.$message({
            message: '请输入邮箱！',
            type: 'warning'
          });
          return false;
        }
        if(!(/^(\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14})$/.test(this.baseInfo.bindEmail))){
          this.$message({
            message: '邮箱格式不正确',
            type: 'warning'
          });
          //this.baseInfo.bindEmail=this.rechargeData.bindEmail;
          return false;
        }
        var self = this;
          this.$axios({
            method:'post',
            url:process.env.OLD_API + 'api/recharge/update',
            data:this.baseInfo,
            transformRequest:[function (data) {
              let newData = '';
              for(let k in data){
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
              }
              return newData;
            }]

          })
            .then(function (response) {
              if(response.data.code==0){
                self.rechargeData.bindEmail = self.baseInfo.bindEmail;
                self.emailSave=false;
                self.emailEdit=true;
                self.$message({
                  message: '修改成功！',
                  type: 'success'
                });
              }else{
                self.$message({
                  message: response.data.message,
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
      },
      //显示弹出框
      rechargeDialog(){
        this.centerDialogVisible=true;
        this.rechargeParam='';
      },
      //支付方式切换
      submenutab(val){
        this.subIndex=val;
      },
      //下一步
      nextBtn(){

        //return false;
        if(this.rechargeParam==''){
          this.$message({
            message: '请选择充值金额',
            type: 'warning'
          });
        }else{
          var self = this;
          var paramData={
            payWay:'B41',
            rechargeGoodsId:this.rechargeParam
          }
          self.centerDialogVisible=false;
          window.open('#/payPage/B41/'+self.rechargeParam);
        }
      }
    },
    mounted(){
      var self = this;
          this.$axios({
            method:'post',
            url:process.env.OLD_API + 'api/recharge/params'
          })
          .then(function (response) {
            if(response.data.code==0){
              console.log(response)
              self.rechargeData=response.data.result;
              if(!self.rechargeData.hasRecharge){
                self.easyShow=true;
                self.tableShow=false;
              }else{
                self.easyShow=false;
                self.tableShow=true;
              }
              self.baseInfo.bindMobile=self.rechargeData.bindMobile;
              self.baseInfo.bindEmail=self.rechargeData.bindEmail;
              self.rechargeData.rechargeRecordBeanList.forEach((item,i)=>{
                item.rechargeAmount=self.returnFloat(item.rechargeAmount/100);
                item.acquirePrice=self.returnFloat(item.acquirePrice/100);
                item.publishPrice=self.returnFloat(item.publishPrice/100);
                item.consumeAmount=self.returnFloat(item.consumeAmount/100);
                item.surplusAmount=self.returnFloat(item.surplusAmount/100);
                item.freezeAmount=item.freezeAmount==undefined?'':self.returnFloat((item.freezeAmount/100));
              })
            }else{
              self.$message({
                message: response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
</script>
<style scoped>
  .t-ul{
    margin-bottom:30px;
  }
  .t-ul li {
    margin-left: 12%;
    height: 60px;
  }

  .wrapper {
    margin-left: 20px;
  }

  .mess {
    background: #F2F2F2;
    width: 80%;
    height: 50px;
    line-height: 50px;
    color: #666666;
    font-weight: bold;
    margin-top:20px;
    display:inline-block;
  }

  .mess span {
    margin-left: 20px;
  }

  .wra-ul li {
    width: 80%;
    height: 80px;
    line-height: 80px;
    margin-left: 20px;
  }
  .alter1{
    color:#008000;
    margin-left:50px;
    cursor:pointer;
  }
  .alter {
    color: #FF9933;
    margin-left:50px;
    cursor:pointer;
  }


  .right-div {
    box-shadow: 8px 8px 8px #CDCDCD;
    width: 450px;
    height: 360px;
    margin: 40px 100px 0 0;
    background: #FFDF25;
    padding: 10px;
  }

  .right-div li {
    margin-bottom: 15px;
  }
  .num{
    padding-left: 83px;
  }
  /*.pay-way{
    display: inline-block;
    border: 1px solid #ccc;
    padding: 2px 16px;
    border-radius: 6px;
    margin-right: 20px;
    cursor: pointer;
  }
  .pay-active{
    color:#fff;
    background: orange;
  }*/
</style>
