<!--贾南风 添加仓库-->
<template>
  <div style="text-align: left" id="addWarehouse">
    <div >
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;">
        <el-breadcrumb-item @click.native="backPage"><span class="clickS">仓库档案</span></el-breadcrumb-item>
        <el-breadcrumb-item>添加仓库</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="white-space: nowrap;padding-left: 50px;margin-bottom: 60px">
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
          <el-input v-model="addStore.tel" :maxlength="50" placeholder="请输入手机号"  style="width:50%;min-width:240px;"></el-input>
        </div>
        <div class="fix">
          <div class="fix-l"><label></label></div>
        </div>
      </div>
      <div class="wrapper-one">
        <div class="fix">
          <div class="fix-l"><label>是否启用：</label></div>
          <el-radio v-model="addStore.enabledFlag" label="true">启用</el-radio>
          <el-radio v-model="addStore.enabledFlag" label="false">停用</el-radio>
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
        <el-select v-model="addStore.provinceId"  placeholder="请选择省" @change="two()" style="width: 10%;min-width:140px;">
          <el-option
            v-for="item in province"
            :key="item.regionName"
            :label="item.regionName"
            :value="item.regionId">
          </el-option>
        </el-select>
        <el-select v-model="addStore.cityId" placeholder="请选择市" @change="three()" style="width: 10%;min-width:140px;">
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
        <!--<el-select v-model="addStore.regionId"  placeholder="请选择小区" style="width: 10%;min-width:140px;">
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
        <el-select v-model="addStore.logisticsStorageId"  placeholder="请选择智选发货仓库" style="width:50%;min-width:240px;">
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
        <el-select v-model="addStore.storageType"  placeholder="请选择仓库类型" @change="showData()" style="width:20%;min-width:240px;" >
          <el-option
            v-for="item in warehouseType"
            :key="item.storeTypeName"
            :label="item.storeTypeName"
            :value="item.storeTypeId">
          </el-option>
        </el-select>
        <!--<div class="fix-l" v-if="inputShow1" ><label>选择店铺：</label></div>
        <el-select v-if="inputShow1"  v-model="addStore.storeId"  placeholder="请选择店铺" style="width:7%;min-width:200px;">
          <el-option
            v-for="item in shop"
            :key="item.storeName"
            :label="item.storeName"
            :value="item.storeId">
          </el-option>
        </el-select>
        <div class="fix-l" v-if="inputShow1"><label>菜鸟仓ID：</label></div>
        <el-input v-if="inputShow1" v-model="addStore.cainiaoStorageId" :maxlength="20" placeholder="菜鸟仓ID" style="width:7%;min-width:200px;"></el-input>
        <div class="fix-l" v-if="inputShow2"><label><span class="xin">* </span>App key：</label></div>
        <el-input v-if="inputShow2" v-model="addStore.appkey" :maxlength="100" placeholder="请输入appkey" style="width:7%;min-width:200px;"></el-input>
        <div class="fix-l" v-if="inputShow2"><label><span class="xin">* </span>token：</label></div>
        <el-input v-if="inputShow2" v-model="addStore.token" :maxlength="100" placeholder="请输入token" style="width:7%;min-width:200px;"></el-input>-->
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
    </div>
    <div class="wmsFoot"><!--margin-top: 50px;padding-left:100px;-->
      <el-button type="primary"  @click="addData(1)">保存并继续</el-button>
      <el-button type="primary"  @click="addData(2)">保 存</el-button>
      <el-button type="prim" style="width: 100px" @click="backPage">取 消</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        //radio: 1,
        query: () => {},  // 定义方法全局调用
        queryFn: () => {}, // 定义方法全局调用
        tableData: [], // 表格数据
        threeCheckout: false, //检查三级是否有数据
        province: '', // 省
        city: '', // 市
        district: '', // 区
        housing: '', // 小区
        version: '1.0.0',
        addStore: {// 添加仓库
          storageId: '',// 仓库id，新增则置空。
          storageName: '', // 仓库名称。
          storageType: 1,// 仓库类型。
          logisticsStorageId: '', // 智选物流发货仓库id。
          logisticsStorageName: '',// 智选物流发货仓库名称。
          storeId: '',// 第三方菜鸟仓店铺id。
          cainiaoStorageId: '',// 第三方菜鸟仓id。
          appkey: '', // appKey。
          token: '',// token。
          provinceId: '',
          cityId: '',
          districtId: '',
          regionId: '',// 区域id。
          address: '',// 详细地址。
          contact: '',// 联系人。
          phone: '',// 电话。
          tel: '',// 手机。
          zipcode: '',// 邮编。
          enabledFlag: 'true', // 是否启用
          merchantCode: '', //货主编号
          extStorageId: '',//外部仓库id
          orderExpressSet: 1,//仓库订单快递设置
        },
        warehouseType1: [], // 智能物流
        shop: '', // 店铺
        centerP: false, // 控制弹层
        //inputShow1: false,
        //inputShow2: false,
        warehouseType: [// 仓库类型
          { storeTypeId: 1, storeTypeName: '自建仓' },
          { storeTypeId: 2, storeTypeName: '第三方仓' },
          { storeTypeId: 3, storeTypeName: '菜鸟仓' },
          { storeTypeId: 4, storeTypeName: '京云仓' }
        ],
      }
    },
    methods: {
      // 返回上一个页面
      backPage() {
        this.$emit('changeShow',{childrenShow: 1});
      },
    /*  transform(data){
        let newData = ''
        for (var k in data) {
          newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
        }
        return newData
      },*/
      // 仓库类型值改变时
      showData() {
        this.addStore.storeId = '';
        this.addStore.appkey = '';
        this.addStore.token = '';
        this.addStore.merchantCode = '';
        this.addStore.extStorageId = '';
        this.addStore.orderExpressSet = 1;
      },

      // 重置数据
      resetData() {
        this.addStore.storageName  = '';
        this.addStore.storageType = 1;
        this.addStore.logisticsStorageId = ''; // 智选物流发货仓库id。
        this.addStore.storeId = '';
        this.addStore.logisticsStorageName = '';
        this.addStore.cainiaoStorageId = '';
        this.addStore.appkey = '';
        this.addStore.token = '';
        this.addStore.provinceId = '';
        this.addStore.cityId = '';
        this.addStore.regionId = '';
        this.addStore.address = '';
        this.addStore.contact = '';
        this.addStore.phone = '';
        this.addStore.tel = '';
        this.addStore.zipcode = '';
        this.addStore.enabledFlag = true;
        this.addStore.merchantCode = '';
        this.addStore.extStorageId = '';
        this.addStore.orderExpressSet = 1;

      },
      // 添加仓库
      addData(num) {
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

        if (this.addStore.contact.length > 20) {
          this.$message({
            message: '联系人只允许输入20个字符',
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
        if (this.addStore.provinceId == '' && this.addStore.cityId == '' && this.addStore.districtId == ''  && this.addStore.address == '') { // && self.addStore.regionId == ''
          this.$message({
            message: '请输入仓库地址',
            type: 'warning'
          });
          return false
        }
        if(this.threeCheckout){
          this.addStore.regionId = this.addStore.cityId;
          if (this.addStore.provinceId == '' || this.addStore.cityId == '' ||  this.addStore.address == '') {
            this.$message({
              message: '仓库地址输入不全',
              type: 'warning'
            });
            return false
          }
        }else{
          this.addStore.regionId = this.addStore.districtId;
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
        if(this.warehouseType1 != undefined) {
          for (var item of this.warehouseType1) {
            if (item.logisticsStorageId == this.addStore.logisticsStorageId) {
              this.addStore.logisticsStorageName = item.logisticsStorageName
            }
          }
        }
        console.log(this.addStore);
        // 添加请求
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/insert',this.addStore)
          .then( res => {
            if (res.data.code == 0) {
              this.$message({
                message: '添加仓库成功',
                type: 'success'
              });
              if (num == 1) { // 点击保存并继续
                  this.resetData(); // 重置数据
              }else { // 点击保存
                this.$emit('changeShow',{childrenShow: 19,isRefresh: true});
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch( err =>  {
            console.log(err)
          });
      },
      // 省改变请求市'
      two() {
        let self = this;
        self.addStore.cityId = '';// 请空二级
        self.addStore.regionId = '';
        self.addStore.districtId = '';// 请空三级
        // 请求市
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.addStore.provinceId})
          .then(function(res) {
            if (res.data.code == 0){
              self.city = res.data.result; // 接受省的数据
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
      // 市改变请求区
      three() {
        let self = this;
        self.addStore.districtId = '';// 请空三级
        self.addStore.regionId = '';
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.addStore.cityId})
          .then(function(res) {
            if (res.data.code == 0){
              if(res.data.result.length == 0){
                self.threeCheckout = true;
              }else{
                self.threeCheckout = false;
              }
              self.district = res.data.result; // 接受省的数据
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
        self.addStore.regionId = '';  // 清空四级
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.addStore.districtId})
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

    },
    created() {
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
      };
      //this.query();
      let self = this;
      // 店铺
      self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/list')
        .then(function(res) {
          if (res.data.success == true){
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
          if (res.data.success == true){

            self.province = res.data.result; // 接受省的数据

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
