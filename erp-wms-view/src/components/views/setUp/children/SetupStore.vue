<!--贾南风 设置仓库-->
<template>
  <div id="setupStore">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;">
        <el-breadcrumb-item :to="{name: 'autoWarehouse'}">智能仓库设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{name: 'productSetup',params:{state: 0}}">商品指定仓设置</el-breadcrumb-item>
        <el-breadcrumb-item>设置仓库</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box"><span>方案名称：</span><span @click="queryGiftBtn1(id)" style="color: #3996F3;cursor: pointer;">{{allData.schemeName}}</span></div>
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="addButton"><span>添加仓库</span></li>
      </ul>
    </div>
    <!--<div class="block" style="text-align: left;"><span style="cursor: pointer" @click="addButton()"><i class="el-icon-plus" style="color:#3996F3;font-weight: bold;" @click="addButton()"></i>添加仓库</span>
    </div>-->
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
          width="100"
        >
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="360"
          label="仓库名称">
          <template slot-scope="scope">
            <el-select v-model="scope.row.storageId" placeholder="请选择" style="width:180px;">
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
    <!--查看方案商品-->
    <div>
      <!--添加方案弹框-->
      <el-dialog v-dialogDrag title="查看方案商品" :close-on-click-modal="false" :visible.sync="dialogCheck" width="800px">
        <div class="input-box">
          <el-row>
            <el-col :span="10">
              <div><label for="">商品名称：</label>
                <el-input size='small' v-model="checkData.skuName" style="width: 180px"  @keyup.enter.native="checkSP(id)"></el-input>
              </div>
            </el-col>
            <el-col :span="10">
              <div><label for="">条形码：</label>
                <el-input size='small' v-model="checkData.barCode" style="width: 180px"   @keyup.enter.native="checkSP(id)"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button size="small" type="primary" style="width:80px;" @click="queryGiftBtn1">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            border
            :data="project"
            :height="400"
            style="margin-top:15px;"
          >
            <el-table-column
              align='center'
              label="序号"
              type="index"
              width="80">
            </el-table-column>
            <el-table-column
              prop="imageUrl"
              align='center'
              label="图片"
              min-width="">
              <template slot-scope="scope">
                <img :src="scope.row.skuImageUrl" alt="">
              </template>
            </el-table-column>
            <el-table-column
              prop="barCode"
              label="条形码"
              min-width=''
              align='center'
              width="">
            </el-table-column>
            <el-table-column
              prop="goodsName"
              align='center'
              label="商品名称"
              width="">
            </el-table-column>
            <el-table-column
              prop="specification"
              align='center'
              min-width=''
              label="规格">
            </el-table-column>
            <el-table-column
              label="发货仓方案"
              align='center'
            >
              <template slot-scope="scope">
                <span>{{allData.schemeName}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <!--设置覆盖城市-->
    <div>
      <el-dialog v-dialogDrag title="设置覆盖城市" :close-on-click-modal="false" :visible.sync="dialogTableVisible">
        <el-table :data="gridData" border :height="500">
          <el-table-column width="150">
            <template slot-scope="scope">
              <el-checkbox @selection-change="handleSelection" @change="handleSelectionChange(scope.row,scope.$index)">{{scope.row.regionName}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="regionName"></el-table-column>
        </el-table>
        <div class="box2">同一个覆盖省市只能存在一个收货区域内</div>
        <div class="box2"><el-button type="primary">确认设置</el-button></div>
      </el-dialog>
    </div>
    <div style="width: 100%;text-align: center;margin-top: 10px; "><el-button type="primary" @click="saveData()">保 存</el-button> <el-button  @click="jumpPage()">返 回</el-button></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: this.$router.history.current.params.id,// 路由ID
        version: '1.0.0', // 版本号
        project: [], // 数据接收
        dialogCheck: false,//添加方案弹框
        checkData: { //添加方案
          skuName: '',
          barCode: '',
          assignStorageId: '',
        },
        query: () => {}, // 方法
        queryF: () => {}, // 方法
        tableData: [],// 数据接收
        table_h: 0, // 高度
        allData: {},// 仓库
        options: [], // 仓库名称
        dog: 0, // 看门狗
        gridData: [], // 城市
        dialogTableVisible: false // 设置覆盖城市
      }
    },
    methods: {
      // 查询
      queryGiftBtn1(row) {
        let data = {assignStorageId:row};
        this.dialogCheck = true;
        this.checkSP(data)
      },
      // 查看方案商品的请求接口
      checkSP(row) {
        this.checkData.assignStorageId = row.assignStorageId;
        this._post('com.edb01.erp.wms.service.api.WmInStorageService/' + this.version + '/getWmAssignGoodList',this.checkData)
          .then( (res) => {
            if (res.data.success == true) {
              this.project = res.data.result
            } else {
              this.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      },

      // 点击保存
      saveData() {
        let self = this;
        for (let k = 0; k < self.tableData.length; k++) {
          if (self.tableData[k].storageId == '') {
            self.$message({
              message: '请选择仓库',
              type: 'warning'
            })
            return false
          }
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
          assignStorageId: '',
          schemeName: '',
          wmAssignStorageSBeanJson: []
        }
        data.intellectStorageId = self.allData.intellectStorageId;
        data.assignStorageId = self.allData.assignStorageId;
        data.schemeName = self.allData.schemeName;
        for (let k = 0; k < self.tableData.length; k++) {
          data.wmAssignStorageSBeanJson.push({ storageId: self.tableData[k].storageId, pri: k + 1 })
        }
        data.wmAssignStorageSBeanJson = JSON.stringify(data.wmAssignStorageSBeanJson)
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/saveWmAssignStorage',data)
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                message: '保存成功',
                type: 'success'
              });
              self.jumpPage()
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
      },
      // 上移下移的方法
      swapItems(arr, index1, index2){
        arr[index1] = arr.splice(index2,1,arr[index1])[0];
        return arr
      },
      // 上移
      upOne(arr, index) {
        if (arr.length > 1 && index !== 0) {
          this.tableData = this.swapItems(arr, index, index - 1)
        }
      },
      // 下移
      downOne(arr, index) {
        if (arr.length > 1 && index !== (arr.length - 1)) {
          this.tableData = this.swapItems(arr, index, index + 1)
        }
      },
      // 继续添加
      goonAdd() {
        this.queryF()
        this.queryA.planName = ''
      },
      // 保存并关闭
      saveGoon() {
        this.queryF();
        if (this.dog == 1) {
          return false
        }
        this.dialogVisible = false
      },
      dialogTable() {
        this.dialogTableVisible = true
      },
      // 点击面包屑条页面
      jumpPage() {
        this.$router.push({name: 'productSetup',params: {state: 0}})
      },
      // 点击添加仓库
      addButton() {
        //console.log(this.tableData.length);
        // 选择仓库完整后再添加下一个
        if(this.tableData.length>=1){
          if(this.tableData[this.tableData.length-1].storageId == '') {
            return false
          }
        }
        this.tableData.push({ storageId: '' })
        // this.dialogVisible = true
      },
      // 点击删除
      deleteStore(index) {
        this.tableData.splice(index, 1)
        // console.log(index)
      },
      handleSelection(val){
        console.log(val);
      },
      handleSelectionChange(row, index) {
        console.log(row, index)
      }
    },
    created() {
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight// 页面高度
        var b = document.getElementById('fitTable').offsetTop // 表格距离顶部的距离
        this.table_h = a - b - 240;
        //console.log(this.table_h)
      })

      let self = this;
      // 回显仓库数据
      self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/echoWmAssignStorageOne',{assignStorageId: self.id})
        .then(function(res) {
          if (res.data.code == 0) {
            self.allData = res.data.result;
            self.tableData = self.allData.wmAssignStorageSBeans
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
      // 获取仓库
      self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/list')
        .then(function(res) {
          if (res.data.code == 0) {
            self.options = res.data.result
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
  }
  .box2{
    width: 100%;
    text-align: center;
  }
  /*.block {
    margin: 20px 0 16px 0;
    width: 100%;
    line-height: 40px;
    height: 40px;
    background: #F7F7F7;
    padding-left: 20px;
    border: 1px solid #DFDFDF;
  }*/
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
