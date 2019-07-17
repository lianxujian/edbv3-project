<!--贾南风 修改仓库-->
<template>
  <div style="text-align: left;" id="amendWarehouse">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;">
        <el-breadcrumb-item @click.native="backPage" ><span class="clickS">仓库档案</span></el-breadcrumb-item>
        <el-breadcrumb-item>修改仓库</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="white-space: nowrap;padding-left: 50px;margin-bottom: 60px">
      <el-form>
        <div class="wrapper-one">
          <div class="fix">
            <div class="fix-l"><label><span class="xin">* </span>仓库名称：</label></div>
            <el-input v-model="addStore.storageName" placeholder="请输入仓库名称" :maxlength="100" style="width:50%;min-width:240px;"></el-input>
          </div>
          <div class="fix">
            <div class="fix-l"><label><span class="xin">* </span>联系人：</label></div>
            <el-input v-model="addStore.contact" placeholder="请输入联系人姓名" :maxlength="10" style="width:50%;min-width:240px;"></el-input>
          </div>
          <div class="fix">
            <div class="fix-l"><label><span class="xin">* </span>手机：</label></div>
            <el-input v-model="addStore.tel" :maxlength="50" placeholder="请输入手机号" style="width:50%;min-width:240px;"></el-input>
          </div>
          <div class="fix">
            <div class="fix-l"><label></label></div>
          </div>
        </div>
        <div class="wrapper-one">
          <div class="fix">
            <div class="fix-l"><label>是否启用：</label></div>
            <el-radio v-model="addStore.enabledFlag" :label="true">启用</el-radio>
            <el-radio v-model="addStore.enabledFlag" :label="false" @change="changeRadio">停用</el-radio>
            <!--<el-input v-model="addStore.storeName" placeholder="请输入仓库名称" style="width:50%;min-width:240px;"></el-input>
            <span class="xin">*</span>-->
          </div>
          <div class="fix">
            <div class="fix-l"><label>电话：</label></div>
            <el-input v-model="addStore.phone" :maxlength="20" placeholder="请输入电话" style="width:50%;min-width:240px;"></el-input>
          </div>
          <div class="fix">
            <div class="fix-l"><label>邮编：</label></div>
            <el-input v-model="addStore.zipcode" :maxlength="20" placeholder="请输入邮编" style="width:50%;min-width:240px;"></el-input>
          </div>
          <div class="fix">
            <div class="fix-l"><label></label></div>
            <span class="xin"></span>
          </div>
        </div>
        <div class="fix" style="margin-top: 1px;">
          <div class="fix-l"><label><span class="xin">* </span>仓库地址：</label></div>
          <el-select v-model="addStore.provinceId"  placeholder="请选择省" @change="two()"  style="width: 10%;min-width:140px;"><!--@change="two()"-->
            <el-option
              v-for="item in province"
              :key="item.regionName"
              :label="item.regionName"
              :value="item.regionId">
            </el-option>
          </el-select>
          <el-select v-model="addStore.cityId"  placeholder="请选择市" @change="three()"  style="width: 10%;min-width:140px;"><!--@change="three()"-->
            <el-option
              v-for="item in city"
              :key="item.regionName"
              :label="item.regionName"
              :value="item.regionId">
            </el-option>
          </el-select>
          <el-select v-model="addStore.districtId"  placeholder="请选择区"  style="width: 10%;min-width:140px;"><!--@change="four()"-->
            <el-option
              v-for="item in district"
              :key="item.regionName"
              :label="item.regionName"
              :value="item.regionId">
            </el-option>
          </el-select>
          <!-- <el-select v-model="addStore.regionId"  placeholder="请选择小区" style="width: 10%;min-width:140px;">
             <el-option
               v-for="item in housing"
               :key="item.regionName"
               :label="item.regionName"
               :value="item.regionId">
             </el-option>
           </el-select>-->
          <el-input v-model="addStore.address" placeholder="请输入街道" :maxlength="100"  style="width:25%;min-width:240px;"></el-input>
        </div>
        <div class="fix">
          <div class="fix-l" style="width: 150px;"><label>关联智选物流发货仓库：</label></div>
          <el-select v-model="addStore.logisticsStorageId" placeholder="请选择智选发货仓库" style="width:50%;min-width:240px;">
            <el-option
              v-for="item in warehouseType1"
              :key="item.logisticsStorageName"
              :label="item.logisticsStorageName"
              :value="item.logisticsStorageId">
            </el-option>
          </el-select>
          <i class="el-icon-question"
             style="font-size: 20px;vertical-align: middle;color: #CCCCCC;cursor: pointer;margin-left: 10px;"
             title="关联智选物流发货仓库下拉列表数据从接口获取，是在开通菜鸟智选物流后设置的仓库名称信息。"></i>
          <el-button type="text" style="margin-left: 6px" @click="query()">刷新</el-button>
        </div>
        <div class="fix">
          <div class="fix-l"><label><span class="xin">* </span>仓库类型：</label></div>
          <el-select v-model="addStore.storageType" disabled placeholder="请选择仓库类型" style="width:20%;min-width:240px;" @change="showData()">
            <el-option
              v-for="item in warehouseType"
              :key="item.storeTypeName"
              :label="item.storeTypeName"
              :value="item.storeTypeId">
            </el-option>
          </el-select>
          <!--<div class="fix-l" v-if="inputShow2" ><label>选择店铺：</label></div>
          <el-select v-if="inputShow2"  v-model="addStore.storeId"  placeholder="请选择店铺" style="width:7%;min-width:200px;">
            <el-option
              v-for="item in shop"
              :key="item.storeName"
              :label="item.storeName"
              :value="item.storeId">
            </el-option>
          </el-select>
          <div class="fix-l" v-if="inputShow2"><label>菜鸟仓ID：</label></div>
          <el-input v-if="inputShow2" v-model="addStore.cainiaoStorageId" :maxlength="20" placeholder="请输入菜鸟仓ID" style="width:7%;min-width:200px;"></el-input>
          <div class="fix-l" v-if="inputShow1"><label><span class="xin">* </span>App key：</label></div>
          <el-input v-if="inputShow1" v-model="addStore.appkey" :maxlength="100" placeholder="请输入appkey" style="width:7%;min-width:200px;"></el-input>
          <div class="fix-l" v-if="inputShow1"><label><span class="xin">* </span>token：</label></div>
          <el-input v-if="inputShow1" v-model="addStore.token" :maxlength="100" placeholder="请输入token" style="width:7%;min-width:200px;"></el-input>-->
        </div>
        <div class="fix" v-if="addStore.storageType == 2 || addStore.storageType == 4">
          <div class="fix-l" ><label><span class="xin">* </span>App key：</label></div>
          <el-input  v-model="addStore.appkey" :maxlength="100" placeholder="请输入appkey" style="width:7%;min-width:200px;"></el-input>
          <div class="fix-l" ><label><span class="xin">* </span>token：</label></div>
          <el-input  v-model="addStore.token" :maxlength="100" placeholder="请输入token" style="width:7%;min-width:200px;"></el-input>
        </div>
        <div class="fix" v-if="addStore.storageType == 2 || addStore.storageType == 4 || addStore.storageType == 3">
          <div class="fix-l" v-if="addStore.storageType == 3" ><label>选择店铺：</label></div>
          <el-select v-if="addStore.storageType == 3"  v-model="addStore.storeId"  placeholder="请选择店铺" style="width:7%;min-width:200px;">
            <el-option
              v-for="item in shop"
              :key="item.storeName"
              :label="item.storeName"
              :value="item.storeId">
            </el-option>
          </el-select>
          <div class="fix-l" ><label><span class="xin">* </span>外部仓库编号：</label></div>
          <el-input  v-model="addStore.extStorageId" :maxlength="50" placeholder="请输入外部仓库编号" style="width:7%;min-width:200px;"></el-input>
          <div class="fix-l" ><label><span class="xin">* </span>货主编号：</label></div>
          <el-input  v-model="addStore.merchantCode" :maxlength="50" placeholder="请输入货主编号" style="width:7%;min-width:200px;"></el-input>
        </div>
        <div class="fix" v-if="addStore.storageType == 2">
          <div class="fix-l" style="margin-right: 18px"><label><span class="xin">* </span>仓库订单快递设置：</label></div>
          <el-radio-group v-model="addStore.orderExpressSet">
            <el-radio :label="1">不分配快递</el-radio>
            <el-radio :label="2">仅分配快递</el-radio>
            <el-radio :label="3">分配快递及快递单号</el-radio>
          </el-radio-group>
        </div>
      </el-form>
    </div>
    <!--删除失败弹层-->
    <div>
      <el-dialog v-dialogDrag
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="centerDialogVisible"
        width="400px"
        center>
        <div style="width: 100%;margin-top: -20px;"><i style="font-size: 16px;color: #E6A23C;margin-right: 3px;" class="el-icon-warning"></i><span style="font-size: 14px;">失败原因：</span> </div>
        <div v-for="item,index in arr"><span>{{index + 1}}：</span><span>{{item.name}}</span></div>
        <span slot="footer" class="dialog-footer">
         <el-button style="margin-bottom: -30px" type="primary" @click="centerDialogVisible=false">关闭</el-button>
       </span>
      </el-dialog>
    </div>
    <div  class="wmsFoot"><!--style="position: fixed;bottom: 30px;left:1px;text-align: center;width: 100%"-->
      <el-button type="primary" @click="addData()">保 存</el-button>
      <el-button type="primary" @click="backPage">取 消</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['storageId'],
    data() {
      return {
        query: () => {},
        queryFn: () => {}, // 定义方法全局调用
        tableData: [], // 表格数据
        warehouseType1: [],
        centerDialogVisible: false,
        threeCheckout: false, //检查三级是否有数据
        warehouseType: [// 仓库类型
          { storeTypeId: 1, storeTypeName: '自建仓' },
          { storeTypeId: 2, storeTypeName: '第三方仓' },
          { storeTypeId: 3, storeTypeName: '菜鸟仓' },
          { storeTypeId: 4, storeTypeName: '京云仓' }
        ],
        province: '', // 省
        city: '', // 市
        district: '', // 区
        housing: '', // 小区
        version: '1.0.0',
        addStore: [], // 修改的数据
        shop: '', // 店铺
        centerP: false, // 控制弹层
        inputShow1: false,
        inputShow2: false,
        title: '停用失败',
        dog: 0, // 看门1
        dog1: 0, // 看门2
        dog2: 0, // 看门3
        arr: [],// code提示语存储
      }
    },
    methods: {
      // 选择停用的时候校验当前是否可停用
      changeRadio() {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/deactivate',{storageId: this.storageId})
          .then(res => {
            if(res.data.success == true){

            }else{
              this.addStore.enabledFlag = true;
              if(res.data.code == 250000005){
                this.arr = [];
                var result = res.data.result;
                for (var item of result.codeList){
                  if (item == 250000001) {
                    this.arr.push({name:'已有' +  result.shopNumber + '个店铺设置此仓库为默认仓库'})
                  }
                  if (item == 250000002) {
                    this.arr.push({name: '仓库为属地仓'})
                  }
                  if (item == 250000003) {
                    this.arr.push({name:'仓库为商品指定仓' })
                  }
                  if (item == 250000004) {
                    this.arr.push({name: '仓库已绑定快递'})
                  }
                  if(item == 250000005 ) {
                    this.arr.push({name: '此仓库不可被删除或停用'})
                  }
                  if(item == 250000006 ) {
                    this.arr.push({name: '此仓库在订单标记超重规则被使用'})
                  }
                  if(item == 250000007) {
                    this.arr.push({name: '此仓库下有存在库区不允许删除或停用'})
                  }
                  if(item == 250000008) {
                    this.arr.push({name: '此仓库有未处理的订单'})
                  }
                }
                this.title = '停用失败';
                this.centerDialogVisible = true
              }
            }
          })
      },
      // 返回上一个页面
      backPage() {
        this.$emit('changeShow',{childrenShow: 1});
        //this.$router.push({name: 'warehouse'})
      },
      // 点击仓库类型显示隐藏
      showData() {
        if (this.addStore.storageType == 5){
          this.inputShow2 = true
        } else {
          this.inputShow2 = false
        }
        if (this.addStore.storageType == 4){
          this.inputShow1 = true
        } else {
          this.inputShow1 = false
        }
      },
      // 省改变请求市'
      two() {
        let self = this;

        if (self.dog >= 1) {// 第一次改变时不清空，第二次以后改变时清空
          self.addStore.cityId = '';// 请空二级
          self.addStore.regionId = '';
          self.addStore.districtId = '';// 请空三级
        }
        self.dog++;
        // 请求市
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.addStore.provinceId,merchantId: 0 })
          .then(function(res) {
            if (res.data.code == 0){
              self.city = res.data.result; // 接受省的数据
              if (self.dog1 == 0){
                self.three();
              }
              self.dog1++;
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
        console.log(2);
      },
      // 市改变请求区
      three() {
        let self = this
        if (self.dog >= 2) {
          self.addStore.districtId = ''; // 请空三级
          self.addStore.regionId = '';  // 清空四级
        }
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.addStore.cityId,merchantId: 0 })
          .then(function(res) {
            if (res.data.code == 0){
              console.log(res.data.result,8989);
              if(res.data.result.length == 0){
                self.threeCheckout = true;
              }else{
                self.threeCheckout = false;
              }
              self.district = res.data.result; // 接受省的数据
              /*if (self.dog2 == 0){
                self.four();
              }*/
              self.dog2++;
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 请求四级地址
      four() {
        let self = this;
        if (self.dog >= 2) {
          self.addStore.regionId = '';  // 清空四级
        }
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.addStore.districtId,merchantId: 0 })
          .then(function(res) {
            if (res.data.code == 0){
              self.housing = res.data.result; // 接受省的数据
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 修改保存仓库
      addData(){
        if (!this.addStore.storageName) {
          this.$message({
            message: '请输入仓库名称',
            type: 'warning'
          });
          return false
        }

        if (!this.addStore.contact) {
          this.$message({
            message: '请输入联系人',
            type: 'warning'
          });
          return false
        }

        if (!this.addStore.tel) {
          this.$message({
            message: '请输入手机号',
            type: 'warning'
          });
          return false
        }

        if (this.addStore.provinceId == '' && this.addStore.cityId == '' && this.addStore.districtId == ''  && this.addStore.address == '') {
          this.$message({
            message: '请输入仓库地址',
            type: 'warning'
          });
          return false
        }
        if(this.threeCheckout){
          this.addStore.regionId = this.addStore.cityId;
          // 仓库地址
          if (this.addStore.provinceId == '' || this.addStore.cityId == '' ||  this.addStore.address == '') {
            this.$message({
              message: '仓库地址输入不全',
              type: 'warning'
            });
            return false
          }
        }else{
          this.addStore.regionId = this.addStore.districtId;
          // 仓库地址
          if (this.addStore.provinceId == '' || this.addStore.cityId == '' || this.addStore.districtId == '' || this.addStore.address == '') {
            this.$message({
              message: '仓库地址输入不全',
              type: 'warning'
            });
            return false
          }
        }
        // 仓库类型为第三方 和 京云仓
        if (this.addStore.storageType == 2 || this.addStore.storageType == 4) {
          if (this.addStore.appkey == '') {
            this.$message({
              message: '请输入Appkey',
              type: 'warning'
            });
            return false
          } else if (this.addStore.token == '') {
            this.$message({
              message: '请输入token',
              type: 'warning'
            });
            return false
          }else if (this.addStore.extStorageId == '') {
            this.$message({
              message: '请输入外部仓库编号',
              type: 'warning'
            });
            return false
          } else if (this.addStore.merchantCode == '') {
            this.$message({
              message: '请输入货主编号',
              type: 'warning'
            });
            return false
          }
        }
        // 仓库类型为菜鸟仓
        if(this.addStore.storageType == 3){
          if (this.addStore.storeId == '') {
            this.$message({
              message: '请选择店铺',
              type: 'warning'
            });
          }else if (this.addStore.extStorageId == '') {
            this.$message({
              message: '请输入外部仓库编号',
              type: 'warning'
            });
            return false
          } else if (this.addStore.merchantCode == '') {
            this.$message({
              message: '请输入货主编号',
              type: 'warning'
            });
            return false
          }
        }
        this.warehouseType1.forEach(item => {
          if (item.logisticsStorageId == this.addStore.logisticsStorageId) {
            this.addStore.logisticsStorageName = item.logisticsStorageName
          }
        });
        // 添加请求
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/update',this.addStore)
          .then(res => {
            if(res.data.code == 0){
              //this.backPage();
              this.$emit('changeShow',{childrenShow: 19,isRefresh: true});
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch( err => {
            console.log(err)
          });
      },

    },
    created() {
      let self = this;
      // 店铺
      self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/list',{merchantId: 0})
        .then(function(res) {
          if (res.data.code == 0){
            self.shop = res.data.result ; // 接受省的数据
          } else {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
        .catch(function (err) {
          console.log(err)
        });
      // 请求省
      self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: 1})
        .then(function(res) {
          if (res.data.code == 0){

            self.province = res.data.result; // 接受省的数据
            // 调二级市方法
          } else {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
        .catch(function(err) {
          console.log(err)
        })

      // 页面初始化
      this.queryFn = () => {
        let self = this;
        // 数据回显
        self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/findEditBeanById',{ storageId: self.storageId,merchantId: 0 })
          .then(function(res) {
            if (res.data.code == 0) {
              self.addStore = res.data.result; // 回显的数据
              self.showData()
              self.two();
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      };
      this.query = () => {
        let self = this;
        // 智能仓库
        self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/listOutstore')
          .then(function(res) {
            if (res.data.success == true){
              self.warehouseType1 = res.data.result; // 接受省的数据
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
      //this.query();
      this.queryFn();// 初始化调用
    }
  }

</script>
<style scoped>
  .clickS{
    font-weight: bold;
    cursor: pointer;
    color: #333333;
  }
  .xin{
    color: red;
  }
  .fix {
    margin-top: 40px;
    white-space: nowrap;
  }
  .fix-l {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  .wrapper-one{
    display: inline-block;
    width: 40%;
    min-width: 500px;
  }
</style>

