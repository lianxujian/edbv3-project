<!--智能快递 秋香-->
<template>
  <div id="autoExpress">
    <div style="  min-width:1100px;height: 100%" v-if="showAdd == 1">
      <div style="height: 40%">
        <div class="box">
          若要使用菜鸟智选物流，请先在淘宝服务市场开通&nbsp<span class="span" style="color: #409EFF" @click="">
          <a target="_blank" href="https://fuwu.taobao.com/ser/detail.htm?spm=a1z13.2196529.0.0.440be5fb1jS8Qk&service_code=A-CNZNFHYQ&tracelog=other_serv">订购服务</a></span>，
          然后&nbsp <span class="span" style="color: #409EFF" @click=""><a  target="_blank" href="https://z.cainiao.com/">进入菜鸟后台</a></span>设置。请设置授权店铺
          <el-select  type="medium" v-model="saveSetup.smartStoreId" placeholder="请选择授权店铺" style="width: 220px!important;">
            <el-option
              v-for="item in shopAll"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId">
            </el-option>
          </el-select>
          <el-tooltip class="item" effect="dark" content="开启电子面单的店铺均可以作为授权店铺。未开通智选物流服务时，此店铺仅用于判断可达；"placement="top">
            <i style="font-size:16px;cursor:pointer;" class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="box box1">
          <span class="span" style="color: #409EFF" @click="showP()"  v-if="authorityCode.DATA_AUTOEXPRESS_SPECIFIEDDELIVERY">指定快递配置</span>
        </div>
        <div class="box box1">
          <div>
            <span>  <el-checkbox v-model="saveSetup.intellectFlag" @change="changeData">开启智能快递</el-checkbox></span>
            <span v-if="openExpress">（已开通智选物流）</span>
            <span v-if="openExpressOne">（未开通智选物流）</span>
          </div>
        </div>
        <div class="box">
          <span style="margin-left: 43px">参与菜鸟智选物流的仓库</span>
          <el-badge value="X" class="item" style="margin:0 20px 15px 0;cursor: pointer" v-for="(item,index) in saveSetup.expressStorageBeanList" :key="index" @click.native="clickDel(index,1)">
            <el-button style="width:auto!important;" size="small">{{item.storageName}}</el-button>
          </el-badge>
          <span v-if="saveSetup.intellectFlag" class="span" style="color: #409EFF" @click="setOrder(saveSetup.expressStorageBeanList, 1)" :disabled="!saveSetup.intellectFlag" :label="true">设置仓库</span>
          <span v-else class="span" style="color: #9d9d9d"   >设置仓库</span>
        </div>
        <div class="box">
          <span style="margin-left: 55px">不参与智能快递的店铺</span>
          <el-badge value="X" class="item" style="margin:0 20px 15px 0;cursor: pointer" v-for="(item,index) in saveSetup.expressStoreBeans" :key="index" @click.native="clickDel(index,2)">
            <el-button style="width:auto!important;" size="small">{{item.storeName}}</el-button>
          </el-badge>
          <span v-if="saveSetup.intellectFlag" class="span" style="color: #409EFF" @click="setOrder(saveSetup.expressStoreBeans, 2)" :disabled="!saveSetup.intellectFlag" :label="true">设置店铺</span>
          <span v-else class="span"  style="color: #9d9d9d" >设置店铺</span>
        </div>
        <div class="box">
          <div class="box-radio" style="margin-left: 43px">
            <el-radio v-model="saveSetup.lowFreightFlag"  :label="true" @change.native="radioChangeOne(1)" :disabled="!saveSetup.intellectFlag">
              运费最低优先
                <el-tooltip class="item" effect="dark" content="开启后不参与智选物流仓库订单、货到付款订单优先推荐运费最低快递"placement="top">
                  <i style="font-size:16px;cursor:pointer;" class="el-icon-question" />
                </el-tooltip>
            </el-radio>
            <el-radio v-model="saveSetup.highPriFlag"  :label="true" @change.native="radioChangeOne(2)" :disabled="!saveSetup.intellectFlag">
              高优先级优先
              <el-tooltip class="item" effect="dark" content="开启后不参与智选物流仓库订单、货到付款订单优先推荐优先级高快递（优先级相同随机取）"placement="top">
                <i style="font-size:16px;cursor:pointer;" class="el-icon-question" />
              </el-tooltip>
            </el-radio>
          </div>
        </div>
        <div class="box box1">
          <div>
            <span>
               <el-checkbox v-model="saveSetup.judgeUpFlag" :disabled="!saveSetup.smartStoreId"  >开启判断可达</el-checkbox>
               <el-tooltip class="item" effect="dark" content="开启后所有快递均判断是否可达，需配置授权店铺；"placement="top">
                   <i style="font-size:16px;cursor:pointer;" class="el-icon-question" />
               </el-tooltip>
            </span>
          </div>
        </div>
        <div class="box">
          <div>可达接口仅支持15家快递（中国邮政、EMS、国通、汇通、快捷、全峰、优速、圆通、宅急送、中通、顺丰、天天、韵达、德邦快递、申通）</div>
        </div>
        <div class="box">
          <div class="box-radio">
            <el-radio v-model="saveSetup.upFlag" :label="true" @change.native="radioChangeTwo(1)" :disabled="!saveSetup.judgeUpFlag">
              无法判断可达快递默认“可达”
              <el-tooltip class="item" effect="dark" content="除接口支持15家快递，其他快递均视为“可达”"placement="top">
                <i style="font-size:16px;cursor:pointer;" class="el-icon-question" />
              </el-tooltip>
            </el-radio>
            <el-radio v-model="saveSetup.notSureUpFlag"    :label="true" @change.native="radioChangeTwo(2)" :disabled="!saveSetup.judgeUpFlag">
              无法判断可达快递默认“不确定可达”
              <el-tooltip class="item" effect="dark" content="除接口支持15家快递，其他快递均视为“不确定可达”，记录仓审须知人工处理"placement="top">
                <i style="font-size:16px;cursor:pointer;" class="el-icon-question" />
              </el-tooltip>
            </el-radio>
          </div>
        </div>
      </div>
      <div>
      </div>
      <div class="wmsFoot">
      <!--<div class="save">-->
        <el-button type="primary" @click="saveData()" v-if="authorityCode.DATA_AUTOEXPRESS_SAVA">保 存</el-button>
      </div>
    </div>

    <!--设置仓库-->
    <div>
      <el-dialog v-dialogDrag title="设置仓库" :visible.sync="dialogStore" width="400px">
        <el-input v-model="storageName" @keyup.enter.native="query1()"
                  placeholder="请输入仓库名称" style="width: 300px;margin: -40px 0 20px 0">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-table :data="gridData1"
                  @selection-change="handleSelectionChange4"
                  tooltip-effect="dark"
                  ref="multipleTable4"
                  :height="300"
                  border>
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="storageName"
            label="仓库名称">
          </el-table-column>
        </el-table>
        <div class="box3">
          <el-button  plain @click="dialogStore=false">取 消</el-button>
          <el-button type="primary" @click="sureData(1)">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--设置店铺-->
    <div>
      <el-dialog v-dialogDrag title="设置店铺" :visible.sync="dialogTableVisible" width="400px">
        <el-input v-model="storeName" @keyup.enter.native="query()"
                  placeholder="请输入店铺名称" style="width: 300px;margin: -26px 0 40px 0">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-table :data="gridData" @selection-change="handleSelectionChange3"
                  ref="multipleTable3" :height="260"   style="margin-top: -26px;" border>
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="storeName"
            label="店铺名称">
          </el-table-column>
        </el-table>
        <div class="box3">
          <el-button  plain @click="dialogTableVisible=false">取 消</el-button>
          <el-button type="primary" @click="sureData(2)">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--成功的通知弹框-->
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <div style="width: 100%;text-align: center"><i style="font-size: 30px;color: #65F007;margin-top: -10px" class="el-icon-success"></i> </div>
        <div  style="font-size: 18px;margin: 5px 0 -10px 0;width: 100%;text-align: center">保存成功！</div>
        <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="centerDialogVisible=false">知道了</el-button>
  </span>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0',
        query: () => {},// 查询店铺
        query1: () => {},// 查询仓库
        storeName: '', // 店铺参数
        storageName: '', // 仓库参数
        areaId: '',//切换组件
        dialogTableVisible: false, // 店铺
        dialogStore: false, // 仓库
        centerDialogVisible: false,//保存
        gridData: [], // 店铺名称
        gridData1: [], // 仓库
        shop1:[],// 选择设置店铺复选框
        storage1:[],//仓库
         //   storage:[],//仓库
        shopAll:[],//上来加载店铺
        upFlag:'true',
        saveSetup: {
          intellectFlag: false, //是否开启智能快递
          lowFreightFlag:'', //是否运费最低有先
          highPriFlag: true,//是否高优先级优先
          upFlag: '',//无法判断快递可达默认可达
          notSureUpFlag: true, //无法判断快递可达默认不确定可达
          smartStoreId: '', //智能快递授权店铺
          storageIds: '',//智选物流仓 逗号分隔
          notPatryStoreIds: '', //不参与智能快递店铺 逗号分隔
          judgeUpFlag:'',//判断可达？
        },//添加数据
        showAdd: 1,//显示
        openExpress:false,//是否开启按钮
        openExpressOne:false,//是否开启按钮
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},
      }
    },
    methods: {
      //回显
      goodEach(){
        let self=this
        self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + this.version + '/each',{merchantId:0})
          .then(function(res) {
            if (res.data.code == 0) {
              if(res.data.result != undefined) {
                self.saveSetup = res.data.result;
              }
              if(self.saveSetup.smartStoreId==undefined){
                self.saveSetup.smartStoreId=''
              }
               if(self.saveSetup.expressStorageBeanList==undefined){
                 self.saveSetup.expressStorageBeanList=''
               }
              if(self.saveSetup.notPatryStoreIdList==undefined){
                self.saveSetup.notPatryStoreIdList=''
               }
               if(self.saveSetup.storageIdList==undefined){
                 self.saveSetup.storageIdList=''
               }

            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      },

      //高优先级优先/运费最低优先
      radioChangeOne(num){
        if(num == 1) {
          if (this.saveSetup.lowFreightFlag == true) {
            this.saveSetup.highPriFlag = ''
          }
        }else if(num == 2){
          if (this.saveSetup.highPriFlag == true) {
            this.saveSetup.lowFreightFlag = ''
          }
        }
      },

      //无法判断可达快递默认“可达”/无法判断可达快递默认“不确定可达”
      radioChangeTwo(num){
        if(num == 1) {
          if (this.saveSetup.upFlag == true) {
            this.saveSetup.notSureUpFlag = ''
          }
        }else if(num == 2){
          if (this.saveSetup.notSureUpFlag == true) {
            this.saveSetup.upFlag = ''
          }
        }
      },

      //开启智能快递
      changeData() {
        if(this.saveSetup.intellectFlag == true){
         //this.openExpress=true
          let self = this
          var dataM={
            storeId:self.saveSetup.smartStoreId,
            merchantId:0,
          }
          self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + self.version + '/isSmartExpress',dataM)
            .then(function(res) {
              if (res.data.code == 300000003) {
                self.openExpressOne=false
                self.openExpress=false
                self.$message({
                  type: 'warning',
                  message: '获取是否开启智选物流异常!'
                })
              } if (res.data.code == 300000002) {
                self.openExpressOne=false
                self.openExpress=false
                self.$message({
                  type: 'warning',
                  message: '未获得店铺授权token!'
                })
              } if (res.data.result == false) {
                self.openExpressOne=true
                self.openExpress=false
              }if (res.data.result == true) {
                self.openExpress=true
                self.openExpressOne=false
              } else {
                self.$message({
                  message: res.data.msg, // 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }else{
          this.openExpressOne=false
          this.openExpress=false
        }
      },

      // 点击设置时的回显
      setOrder(rows, number) {//设置仓库
        if(this.saveSetup.intellectFlag==false){

        }else{
          if (number == 1) {
            this.storageName = '';
            this.dialogStore = true;
            this.query1();
          } else if (number == 2) { //设置店铺
            this.storeName = '';
            this.dialogTableVisible = true;
            this.query();
          }
        }

      },

      // 智能仓库的保存
      saveData() {
        let self = this;
          // 是否开启智能快递
        if(self.saveSetup.intellectFlag == 0) {
          self.saveSetup.storageIds = '';
          self.saveSetup.notPatryStoreIds = ''
        }else {
          self.saveSetup.notPatryStoreIds=''
          for (var i = 0; i < self.saveSetup.expressStoreBeans.length; i++) {
            self.saveSetup.notPatryStoreIds+= self.saveSetup.expressStoreBeans[i].storeId + ','
          }
          self.saveSetup.notPatryStoreIds = self.saveSetup.notPatryStoreIds.slice(0,-1)
          self.saveSetup.storageIds = ''
          // 设置仓库
          for (var i = 0; i < self.saveSetup.expressStorageBeanList.length; i++) {
            self.saveSetup.storageIds += self.saveSetup.expressStorageBeanList[i].storageId + ','
          }
          self.saveSetup.storageIds = self.saveSetup.storageIds.slice(0, -1)
          // 保存请求
        }
        if(!self.saveSetup.lowFreightFlag==''){
          self.saveSetup.highPriFlag=0
        }if(!self.saveSetup.highPriFlag==''){
          self.saveSetup.lowFreightFlag=0
        }if(!self.saveSetup.upFlag==''){
          self.saveSetup.notSureUpFlag=0
        }if(!self.saveSetup.notSureUpFlag==''){
          self.saveSetup.upFlag=0
        }
        if(self.saveSetup.notPatryStoreIds==undefined){
          self.saveSetup.notPatryStoreIds=''
        }
        delete self.saveSetup.expressStoreBeans
        delete self.saveSetup.expressStorageBeanList
        delete self.saveSetup.storageIdList
        self._post('com.edb01.erp.wms.service.api.ExpressSetupService/' + self.version + '/save',self.saveSetup)
          .then(function(res) {
            if (res.data.code == 0) {
              self.centerDialogVisible = true
              self.goodEach();
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      },

      // 点击弹框确定按钮
      sureData(val) {
        if (val == 2) {//店铺
          if(this.saveSetup.expressStoreBeans == undefined ){
            this.saveSetup.expressStoreBeans = [];
          }
          this.shop1.forEach(item => {
            this.saveSetup.expressStoreBeans.push(item);
          });
          this.dialogTableVisible = false;
        } else if (val == 1) {//仓库expressStorageBeanList  expressStoreBeans
          if(this.saveSetup.expressStorageBeanList == undefined ){
            this.saveSetup.expressStorageBeanList = [];
          }
          this.storage1.forEach(item => {
            this.saveSetup.expressStorageBeanList.push(item);
          });
          this.dialogStore = false;
        }
      },

      // 点击删除标签的时候
      clickDel(index,val) {
        if (val == 2) {//店铺
          this.saveSetup.expressStoreBeans.splice(index, 1)
        } if (val == 1) {//仓库
          this.saveSetup.expressStorageBeanList.splice(index, 1)
        }
      },

      // 选择设置店铺复选框
      handleSelectionChange3(val) {
        this.shop1 = val
      },

      // 选择设置仓库复选框
      handleSelectionChange4(val) {
        this.storage1 = val
      },

      // 切换组件
      addS(val, row) {
        this.areaId = row;
        this.showAdd = val
      },

      // 指定快递配置
      showP() {
       this.$router.push({name: 'SpecifiedDelivery'})
      },

      //初始化店铺
      showShop(){
        let self = this;
        self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/getTaobaoStoreList')
          .then(function(res) {
            if (res.data.success == true) {
              self.shopAll= res.data.result;
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
    },
    activated() {
      this.goodEach();//回显
      this.showShop()//店铺
    },
    created() {
      // 仓库
      this.query1 = () => {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/getIntellectStorage',{storageName:self.storageName})
          .then(function(res) {
            if (res.data.code == 0) {
              self.gridData1 = res.data.result;
              self.saveSetup.expressStorageBeanList.forEach(item => {
                self.gridData1.forEach((item1,index) => {
                  if(item.storageId == item1.storageId){
                    self.gridData1.splice(index,1);
                  }
                })
              })
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
      this.query1();
      // 店铺
      this.query = () => {
        let self = this;
        self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/list',{dtStoreName:self.storeName})
          .then(function(res) {
            if (res.data.code == 0) {
              self.gridData = res.data.result;
              self.saveSetup.expressStoreBeans.forEach(item => {
                self.gridData.forEach((item1,index) => {
                  if(item.storeId == item1.storeId){
                    self.gridData.splice(index,1)
                  }
                })
              })
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
      this.query()
    },

    mounted() {
      this.goodEach();//回显
      this.showShop()//店铺
    }
  }
</script>

<style scoped>
  div,span,label{
    color: #5c5c5c;
  }
  .save{
    position: fixed;
    bottom: 20px;
    right: 0;
    width: 100%;
    text-align: center;
  }
  .box {
    margin: 26px 0 20px 80px;
  }

  .box1 span {
    margin: 0 4px;
  }
  .box2{
    margin: 20px 0 20px 44px;
  }
  .box3{
    margin: 20px 0 -10px 0;
    width: 100%;
    text-align: center;
  }

  .span {
    text-decoration: underline;
    margin-left: 20px;
    cursor: pointer;
  }

  .box-radio {
    margin: 0 0 30px 10px;
  }
  .radio-s{
    margin-right: 20px;
  }
</style>
<style>
  .el-input--mini .el-input__inner {
    height: 36px;
  }

  .el-button + .el-button {
    margin-left: 5px;
  }
</style>

