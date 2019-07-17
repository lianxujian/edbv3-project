<!--贾南风 属地仓修改-->
<template>
  <div id="amendAddress">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;">
        <el-breadcrumb-item :to="{name: 'autoWarehouse'}">智能仓库设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{name: 'storeSetup',params:{state: false,intellectStorageId:this.$router.history.current.params.intellectStorageId}}">属地仓设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改收货区域</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box">
      <label>收货区域：</label>
      <el-input v-model="allD.areaName" placeholder="请输入收货区域，例如：北方大区" :maxlength="100" style="width:400px;"></el-input>
    </div>
    <div class="box box1">
      <span>覆盖省市：</span><span>{{allD.regionName}}</span><span style="color: #409EFF;cursor: pointer" @click="dialogTable()">设置覆盖城市</span>
    </div>
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="addButton"><span>添加仓库</span></li>
      </ul>
    </div>
    <div id="tabBox">
      <div class="alertBox" style="float:left;margin-left:22px;">
        <el-tooltip class="item" effect="dark" content="优先级数值越小，优先级越高。"placement="top">
          <i style="font-size:16px;cursor:pointer;float:right;margin:12px 0 0 1px;" class="el-icon-question" />
        </el-tooltip>
      </div>
      <el-table
        :data="tableData"
        id="fitTable"
        :height="table_h"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          label="优先级"
          width="100">
          <template slot-scope="scope">
           <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="360"
          label="仓库名称">
          <template slot-scope="scope">
            <el-select v-model="scope.row.storageId" placeholder="请选择" style="width: 180px;">
              <el-option
                v-for="item in options"
                :key="item.storageId"
                :label="item.storageName"
                :value="item.storageId">
              </el-option>
            </el-select>
            <div class="box8" style="margin: 0 20px;">
              <i v-if="scope.$index == 0" style="font-size: 22px;font-weight: bold;color: #D8D8D8" class="el-icon-upload2"></i>
              <i v-else style="font-size: 22px;font-weight: bold;color: #F9A946;cursor: pointer" class="icon iconfont icon-xiaoliangjiantou" @click="upOne(tableData,scope.$index)"></i>
            </div>
            <div class="box8">
              <i v-if="scope.$index == tableData.length-1" style="font-size: 22px;font-weight: bold;color: #D8D8D8" class="el-icon-download"></i>
              <i v-else style="font-size: 22px;font-weight: bold;color: #2FA1FA;cursor: pointer" class="icon iconfont icon-down" @click="downOne(tableData,scope.$index)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteStore(scope.$index)" style="color: red">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
        >
        </el-table-column>
        <el-table-column
          >
        </el-table-column>
      </el-table>
    </div>
    <!--设置覆盖城市-->
    <div>
      <el-dialog title="设置覆盖城市" :visible.sync="dialogTableVisible" width="795px">
        <el-table :data="gridData" border  :height="312" style="margin-top: -30px;">
          <el-table-column width="95">
            <template slot-scope="scope" >
              <el-checkbox :indeterminate="scope.row.indeterminate" v-model="scope.row.areaId" style="margin-left: 8px" :disabled="scope.row.disabled"   @change.native="handleCheckAllChange(scope.row)" >{{scope.row.areaName}}</el-checkbox><!--@change="handleCheckAllChange"--><!--:indeterminate="isIndeterminate"-->
              <!--<el-checkbox @selection-change="handleSelection" @change="handleSelectionChange(scope.row,scope.$index)">{{scope.row.regionName}}</el-checkbox>-->
            </template>
          </el-table-column>
          <el-table-column width="598">
            <template slot-scope="scope">
              <!--<el-checkbox-group v-model="checkList" >--> <!--@change="handleCheckedCitiesChange"-->
                <el-checkbox   v-for="(city,index) in scope.row.regionBeanList" :disabled="city.disabled" :label="city.regionId" @change="clickData(scope.row)" :key="index" v-model="city.check" style="color: #101010">{{city.regionName}}</el-checkbox>
             <!-- </el-checkbox-group>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="box2" style="color: #868686;margin: 5px 0">同一个覆盖省市只能存在一个收货区域内</div>
        <div class="box2"><el-button type="primary" @click="log()">确认设置</el-button></div>
      </el-dialog>
    </div>
    <div style="width: 100%;text-align: center;margin-top: 10px; "><el-button type="primary" @click="saveData()">保 存</el-button> <el-button @click="backPage">返 回</el-button></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        //isIndeterminate: true, //
        //checkList: [], //
        version: '1.0.0', //版本号
        query: () => {}, // 方法
        queryF: () => {}, //方法
        id: this.$router.history.current.params.id, //路由ID
        reId: this.$router.history.current.params.reId, // 所有其他设置过的id
        regionId: this.$router.history.current.params.regionId, // 当前点击的设置的id
        allD: [], // 修改
        tableData: [], // 表格数据
        table_h: 0, //高度
        options: [], // 仓库名称
        queryA: { // 添加的
          planName: '',
          planSort: ''
        },
        dog: 0, // 看门狗
        gridData: [], // 城市
        dialogTableVisible: false, // 城市弹框
        temp: [] // 城市接收
      }
    },
    methods: {
      // 返回上一页
      backPage() {
        this.$router.push({name: 'storeSetup',params:{state: 0}})
      },
      // 点击保存
      saveData() {
        let self = this
        if (self.allD.areaName.trim() == '') {
          self.$message({
            message: '收货区域不能为空',
            type: 'warning'
          });
          return false
        }
        if (self.regionName == '') {
          self.$message({
            message: '请选择省市',
            type: 'warning'
          })
          return false
        }
        if (self.tableData.length == 0) {
          self.$message({
            message: '请添加仓库',
            type: 'warning'
          })
          return false
        }
        for (let k = 0; k < self.tableData.length; k++) {
          if (self.tableData[k].storageId == '') {
            self.$message({
              message: '请选择仓库',
              type: 'warning'
            })
            return false
          }
          //把所有相同的仓库对比
          //把所有相同的仓库对比
          for(var g=0;g<self.tableData.length;g++){
            if(k<g) {
              if(self.tableData[k].storageId == self.tableData[g].storageId){
                self.$message({
                  message: '同一仓库不可有不同优先级！',
                  type: 'warning'
                })
                return false
              }
            }
          }
        }
        let data = {
          intellectStorageId: '',
          dependentStorageId: '',
          regionIds: '',
          areaName: '',
          wmDSstoragesJson: []
        }
        data.intellectStorageId = self.allD.intellectStorageId;
        data.dependentStorageId = self.allD.dependentStorageId;
        data.areaName = self.allD.areaName;
        for (let k = 0; k < self.tableData.length; k++) {
          data.wmDSstoragesJson.push({ storageId: self.tableData[k].storageId, pri: k + 1 })
        }
        data.wmDSstoragesJson = JSON.stringify(data.wmDSstoragesJson)
        for (var j = 0; j < self.gridData.length; j++) {
          for (var i = 0; i < self.gridData[j].regionBeanList.length; i++) {
            if (self.gridData[j].regionBeanList[i].check == true) {
              data.regionIds += self.gridData[j].regionBeanList[i].regionId + ','
            }
          }
        }
        data.regionIds = data.regionIds.slice(0,-1);
        // console.log(data);
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/saveWmdependentStorage',data)
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                message: '修改成功',
                type: 'success'
              });
              self.backPage()
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 点击城市
      clickData(row) {
        this.gridData[0].areaId = !this.gridData[0].areaId;
        this.gridData[0].areaId = !this.gridData[0].areaId;
        var j = 0;
        for (var i=0;i<row.regionBeanList.length;i++) {
          if ( row.regionBeanList[i].check == true) {
            j++
          }
        }
        if (row.regionBeanList.length == j) {
            row.areaId = true;
            row.indeterminate = false;
          } else if(j < row.regionBeanList.length && j >0) {
            row.indeterminate = true
          }else if(j == 0) {
            row.areaId = false;
            row.indeterminate = false;
          }
      },
      // 点击确认设置之后
      log() {
        this.allD.regionName = ''
        for (var j = 0; j < this.gridData.length; j++) {
          for (var i = 0; i <this.gridData[j].regionBeanList.length; i++){
            if (this.gridData[j].regionBeanList[i].check == true) {
              console.log(this.gridData[j].regionBeanList[i].regionName);
              this.allD.regionName += this.gridData[j].regionBeanList[i].regionName + ','
            }
          }
        }
        if (this.allD.regionName == '') {
          this.$message({
            message: '请选择省市',
            type: 'warning'
          })
        } else {
          this.dialogTableVisible = false;
        }

      },
      //城市选择之后触发
      handleCheckAllChange(row) {
        console.log(row.areaId);
        if (row.areaId == true) {
          row.indeterminate = false;
          for (var i=0;i<row.regionBeanList.length;i++){
            row.regionBeanList[i].check = true;
          }
        } else {
          row.indeterminate = false;
          for (var i=0;i<row.regionBeanList.length;i++){
            row.regionBeanList[i].check = false;
          }
        }
      },
      // 移行的方法
      swapItems(arr, index1, index2) {
        arr[index1] = arr.splice(index2,1,arr[index1])[0]
        return arr
      },
      // 移上一行
      upOne(arr, index) {
        if (arr.length > 1 && index !== 0) {
          this.tableData = this.swapItems(arr, index, index - 1)
        }
      },
      // 移下一行
      downOne(arr, index) {
        if (arr.length > 1 && index !== (arr.length - 1)) {
          this.tableData = this.swapItems(arr, index, index + 1)
        }
      },
      // 继续添加
      goonAdd() {
        this.queryF();
        this.queryA.planName = '';
      },
      // 保存并关闭
      saveGoon() {
        this.queryF()
        if (this.dog == 1) {
          return false
        }
        this.dialogVisible = false;
      },
      dialogTable() {
        this.dialogTableVisible = true;
      },
      // 点击面包屑条页面
      jumpPage(val) {
        // 触发父组件
        this.$emit('ee', val, '');
      },
      // 点击添加仓库
      addButton() {
        // 选择仓库完整后再添加下一个
        if(this.tableData.length>=1){
          if(this.tableData[this.tableData.length-1].storageId == '') {
            return false
          }
        }
        this.tableData.push({ storageId: '', pri: this.tableData.length + 1 })
        // this.dialogVisible = true
      },
      // 点击删除
      deleteStore(index) {
        this.tableData.splice(index, 1)
        // console.log(index)
      },
     /* handleSelection(val){
        console.log(val);
      },
      handleSelectionChange(row, index) {
        console.log(row, index)
      }*/
    },
    mounted() {
      // 添加仓方案
      this.queryF = () => {
        let self = this;
        if (self.queryA.planName == '') {
          self.$message({
            message: '仓库名称不能为空',
            type: 'warning'
          });
          self.dog = 1;
          return false
        }
        self.dog = 0;
        self._post('com.edb01.erp.data.service.IntelligentWarehouseService/' + self.version + '/addStorearea',self.queryA)
          .then(function(res) {
            if (res.data.code == 0) {
              self.$message({
                message: '添加仓库成功',
                type: 'success'
              });
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
      // 城市
      this.query = () => {
        let self = this;
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/getDtAreaRegion')
          .then(function(res) {
            if (res.data.success == true) {
              self.temp = res.data.result;
              for (var i = 0; i < self.temp.length; i++) {
                self.temp[i].areaId = false;
                self.temp[i].indeterminate = false;
                self.temp[i].disabled = false;
                for (var item of self.temp[i].regionBeanList) {
                  for(var item1 of self.regionId){ // 把当前数据回显
                    if(item1 == item.regionId){
                      item.check = true
                      self.temp[i].indeterminate = true;
                    }
                  }
                  item.disabled = false;
                }
              }
              // 把当前选择的删除掉
              self.regionId.forEach((item) => {
                self.reId.forEach((item1,index) => {
                  if(item == item1) {
                    self.reId.splice(index,1)
                  }
                })
              })
              self.gridData = self.temp;
              // 把选择过的城市设为不可选
              for (var item of self.gridData) {
                for (var item1 of item.regionBeanList) {
                  for (var item2 of self.reId) {
                    if (item1.regionId == item2) {
                      item.disabled = true;
                      item1.disabled = true;
                      break;
                    }
                  }
                }
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
      }
       this.query()
    },
    created() {
      //console.log(123456789);
      //console.log(this.id,444);
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight;// 页面高度
        var b = document.getElementById('fitTable').offsetTop; // 表格距离顶部的距离
        this.table_h = a - b - 290;
        // console.log(this.table_h,888)
      })

      let self = this;
        // 单条数据的回显
      self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/echoWmdependentStorageOne',{ dependentStorageId : self.id })
        .then(function(res) {
          if (res.data.code == 0) {
            self.allD = res.data.result;
            self.tableData = self.allD.wmDSstorages;
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
      // 仓库地址
      self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/list')
        .then(function(res) {
          if (res.data.code == 0) {
            self.options = res.data.result;
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
  }
</script>

<style scoped>
  .box {
    margin: 20px 0 20px 30px;
  }
  .box1 span{
    margin-right: 20px;
    line-height: 20px;
  }
  .box2{
    width: 100%;
    text-align: center;
  }
  .box8 {
    display: inline-block;
  }
  #tabBox{
    position: relative;
  }
  #tabBox .alertBox{
    position: absolute;
    top: -6px;
    left: 51px;
    z-index: 10;
  }
</style>
