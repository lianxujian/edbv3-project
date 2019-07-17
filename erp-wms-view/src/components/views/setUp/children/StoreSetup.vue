<!--贾南风 属地仓设置-->
<template>
  <div id="storeSetup">
    <div v-show="isShow">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;">
        <el-breadcrumb-item :to="{name: 'autoWarehouse'}">智能仓库设置</el-breadcrumb-item>
        <el-breadcrumb-item>属地仓设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="block" style="background: #fff">
      <span class="span">属地仓设置规则：订单收货地在某地区指定某些仓库发货，并可通过优先级指定仓库发货顺序，优先级数值越小，优先级越高，仓库越优先发货。</span>
    </div>
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="jumpPage2(reId)"><span>添加收货区域</span></li>
        <li @click="publicLogBtn"><span>查看日志</span></li>
      </ul>
    </div>
      <div id="wrapper1" ref="bb">
        <el-table
          :data="resultData"
          tooltip-effect="dark"
          id="fitTable"
          :height="table_h"
          border
          style="width: 100%; margin-top: 10px">
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            align="center"
            width="120"
            prop="areaName"
            :show-overflow-tooltip="true"
            label="收货区域">
          </el-table-column>
          <el-table-column
            align="center"
            prop="regionName"
            :show-overflow-tooltip="true"
            label="覆盖省市">
          </el-table-column>
          <el-table-column
            label="仓库"
            width="180">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.wmDSstorages"
                class="table-box"
                tooltip-effect="dark"
                :show-header="false">
                <el-table-column
                  align="center"
                  :show-overflow-tooltip="true"
                  prop="storageName">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            label="优先级"
            >
            <template slot-scope="scope">
              <el-table
                :data="scope.row.wmDSstorages"
                class="table-box"
                :show-header="false">
                <el-table-column
                  align="center"
                  prop="pri">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="仓库类型"
            width="110">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.wmDSstorages"
                class="table-box"
                :show-header="false">
                <el-table-column
                  align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.storageType == 1">销售仓</span>
                    <span v-if="scope.row.storageType == 3">次品仓</span>
                    <span v-if="scope.row.storageType == 4">第三方仓</span>
                    <span v-if="scope.row.storageType == 5">第三方菜鸟仓</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            label="仓库地址">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.wmDSstorages"
                tooltip-effect="dark"
                :show-header="false">
                <el-table-column
                  :show-overflow-tooltip="true"
                  class="table-box"
                  prop="address">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="120"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="jumpPage1(scope.row)">修改</el-button>
              <el-button type="text" size="small" style="color: red" @click="delData(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <!--智能仓库开启不可编辑-->
    <div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="autoVisible"
        width="440px">
        <div class="box" style="margin-top: -20px"><i class="el-icon-warning" style="font-size: 30px;color: #DB525A"></i></div>
        <div class="box" style="font-weight: bold">不可编辑</div>
        <div class="box" style="margin-bottom: 20px">关闭智能仓库后才可编辑！</div>
        <div>温馨提示：关闭智能仓库后订单将分配到店铺默认仓，若使订单不分配到默认仓，请去【设置】-【<span style="color: #3B90ED;cursor: pointer;" @click="setType()">订单设置</span>】中关闭订单入仓。</div>
        <div></div>
      </el-dialog>
    </div>
    </div>
    <div v-show="!isShow">
      <v-order @showCityName="updateCity"></v-order>
    </div>
    <div>
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
  </div>
</template>
<script>
  import orderSet from '@/components/views/setUp/children/orderSet.vue'
  import publicLog from '@/components/common/publicLogDialog.vue'
  export default {
    components: {
      'v-Publiclog': publicLog,
      'v-order' : orderSet
    },
    name: '',
    data() {
      return {
        isShow: true,// 订单设置显示隐藏
        // 查看日志
        paramObj:{},
        pulicLogVisible:false,
        autoVisible: false, // 智能仓库
        state: this.$router.history.current.params.state, // 是否开启智能仓库
        table_h: 0, // 高度
        version: '1.0.0', // 版本号
        query: () => {}, // 方法`
        resultData: [],// 表格数据接收
        totalNum1: 0, // 数据总条数
        // 获取row的key值
       /* getRowKeys(row) {
          return row.areaId;
        },
        // 要展开的行，数值的元素是row的key值
        expands: [],*/
        reId:[]  // 标识
      }
    },
    methods: {
      // 订单设置
      updateCity(bool){
        this.isShow = bool;
      },
      // 订单设置
      setType() {
        this.autoVisible = false;
        $(parent.document.querySelector('#orderSet')).click();
        //this.isShow = false;
      },
      // 点击查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 47;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      // 点击查看日志
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      // 查看日志的方法
      changDialogShow() {
        this.pulicLogVisible = false;
      },
      // 删除属地仓
      delData(val) {
        if (this.state == true) {
          this.autoVisible = true;
          return false
        }
              this.$confirm('是否删除' + val.areaName + '属地仓?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
              }).then(() => {
                this._post('com.edb01.erp.wms.service.api.WmInStorageService/' + this.version + '/removeWmdependentStorage',{dependentStorageId: val.dependentStorageId})
                  .then(res => {
                    if (res.data.success == true) {
                      this.query();
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                    } else {
                      this.$message({
                        message: res.data.msg, // 如果code为其他，弹出错误码
                        type: 'warning'
                      })
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }).catch(() => {
              });
      },
      // 修改
      jumpPage1(row) {
        //console.log(row);
        if (this.state == true) {
          this.autoVisible = true;
          return false
        }
        row.reId = this.reId;
        this.$router.push({name: 'amendAddress',params: {id: row.dependentStorageId,reId:row.reId,regionId:row.regionId,intellectStorageId:this.$router.history.current.params.intellectStorageId}})
      },
      // 添加收货地址
      jumpPage2(row) {
        //console.log(row);
        if (this.state == true) {
          this.autoVisible = true;
          return false
        }
       this.$router.push({name: 'addAddress',params: {id: row,intellectStorageId:this.$router.history.current.params.intellectStorageId}})
      },
    },
    created() {
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight// 页面高度
        var b = document.getElementById('fitTable').offsetTop // 表格距离顶部的距离
        this.table_h = a - b - 50
      })
      this.query = () => {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/echoWmdependentStorage')
          .then(function(res) {
            if (res.data.code == 0) {
              self.resultData = res.data.result;
              self.reId = [];
              //console.log(res.data.result);
              for (var item of self.resultData) {
                  if (item.regionId) {
                      for (var item1 of item.regionId) {
                          self.reId.push(item1)
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
      };
      this.query()
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .box{
    text-align: center;
    font-size: 14px;
  }
  .block {
    margin: 20px 0 16px 0;
    width: 100%;
    line-height: 30px;
    height: 30px;
    background: #F7F7F7;
    padding-left: 8px;
    border: 1px solid #DFDFDF;
  }
</style>
<style>
  #storeSetup .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0;
  }
  #storeSetup .el-table .cell, .el-table th div {
    padding-right: 0;
  }
 /* #storeSetup> .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right:1px solid #eee!important;
  }*/
  #storeSetup .el-table_1_column_1,.el-table_1_column_2,.el-table_1_column_3,.el-table_1_column_4,.el-table_1_column_5,.el-table_1_column_6{
    border-right: 1px solid #ebeef5!important;
  }
  #storeSetup .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #fff!important;
  }
</style>
