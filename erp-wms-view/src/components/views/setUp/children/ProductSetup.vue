<!--贾南风 产品指定仓-->
<template>
  <div style="min-width: 1100px" id="productSetup">
    <div v-show="isShow">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;" >
        <el-breadcrumb-item :to="{name: 'autoWarehouse'}">智能仓库设置</el-breadcrumb-item>
        <el-breadcrumb-item>商品指定仓库设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box">
      <span class="span"
            @click="addS(0,'')">商品指定仓设置规则：当订单包含某些商品时，这些订单只能有某些仓库发货，并可通过优先级指定仓库发货顺序，优先级数值越小，优先级越高，仓库越优先发货</span>
    </div>
    <div style="height: 40px;line-height: 40px;margin-left: 24px;">
      <label>方案名称：</label>
      <el-input placeholder="请输入方案名称" v-model="queryData.schemeName" style="width:220px;margin-right: 30px;"></el-input>
      <el-button type="primary" @click="queryD()">查 询</el-button>
    </div>
    <div class="col-nav" style="margin-top:10px;">
      <ul>
        <li @click="addButton()"><span>添加方案</span></li>
        <li @click="publicLogBtn()"><span>查看日志</span></li>
      </ul>
    </div>
    <div id="wrapper" class="col-border">
      <el-table
        :data="tableData"
        id="fitTable"
        tooltip-effect="dark"
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
          min-width="260"
          :show-overflow-tooltip="true"
          label="商品发货仓方案">
          <template slot-scope="scope">
            <span style="color:#409EFF;width: 100%;padding: 0 10px;cursor: pointer  "  @click="checkF(scope.row)">{{scope.row.schemeName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="仓库"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-table
              id="wrap"
              tooltip-effect="dark"
              :data="scope.row.wmAssignStorageSBeans"
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
          width="120"
          label="优先级">
          <template slot-scope="scope">
              <el-table
                class="wrap"
                :data="scope.row.wmAssignStorageSBeans"
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
              class="wrap"
              :data="scope.row.wmAssignStorageSBeans"
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
              class="wrap"
              tooltip-effect="dark"
              :data="scope.row.wmAssignStorageSBeans"
              :show-header="false">
              <el-table-column
                :show-overflow-tooltip="true"
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
            <el-button type="text" size="small" @click="setupStore(scope.row)">设置仓库</el-button>
            <el-button type="text" size="small" style="color: red" @click="delProduct(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--查看方案商品-->
    <div>
      <!--添加赠品弹框-->
      <el-dialog v-dialogDrag v-dialogDrag title="查看方案商品" :close-on-click-modal="false" :visible.sync="dialogCheck" width="800px">
        <div class="div-log">
        <el-dialog v-dialogDrag
          :close-on-click-modal="false"
          width="400px"
          title="查看大图"
          :visible.sync="innerVisible"
          style="text-align: center"
          append-to-body>
          <div style="width: 300px;height: 300px;padding:0!important;">
            <img :src="skuUrl" style="width: 100%;height: 100%">
          </div>
        </el-dialog>
        </div>
        <div class="input-box">
          <el-row>
            <el-col :span="10">
              <div><label for="">商品名称：</label>
                <el-input size='small' v-model="checkData.skuName" style="width: 180px"  @keyup.enter.native="queryGiftBtn1"></el-input>
              </div>
            </el-col>
            <el-col :span="10">
              <div><label for="">条形码：</label>
                <el-input size='small' v-model="checkData.barCode" style="width: 180px"   @keyup.enter.native="queryGiftBtn1"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button size="small" type="primary" style="width:80px;" @click="queryGiftBtn1">查询</el-button>
            </el-col>
          </el-row>
          <div class="col-border">
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
              width="60">
            </el-table-column>
            <el-table-column
              align='center'
              label="图片"
              min-width="">
              <template slot-scope="scope">
                <div v-if="scope.$index == index" style="position: fixed;z-index: 1000000000;left:50%;top:50%;border-radius: 10px;margin-top: -150px;margin-left: -150px;background: #000">
                <img :src="scope.row.skuImageUrl" alt="" style="width: 300px;height: 300px;cursor: pointer;border-radius: 10px;">
                </div>
                <img :src="scope.row.skuImageUrl" alt="" style="width: 25px;height: 25px;cursor: pointer" @mouseenter="showImg(scope.row,scope.$index)" @mouseleave="showImg1()">
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
                <span>{{can.schemeName}}</span>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--添加方案名弹层-->
    <div>
      <el-dialog v-dialogDrag
        title="添加方案"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="500px"
      >
        <div style="height: 40px;line-height: 40px;margin: 1px 40px 20px;">
          <label>方案名称：</label>
          <el-input v-model="queryA.schemeName" :maxlength="40" placeholder="方案名称保存成功后不可更改" style="width:220px;margin-right: 30px;"></el-input>
        </div>
          <div style="width: 100%;text-align:right;">
          <el-button type="primary" @click="goonAdd()">继续添加</el-button>
           <el-button @click="saveGoon()">保存并关闭</el-button>
            </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog v-dialogDrag
        :visible.sync="autoVisible"
        :close-on-click-modal="false"
        width="440px">
        <div class="box1" style="margin-top: -20px"><i class="el-icon-warning" style="font-size: 30px;color: #DB525A"></i></div>
        <div class="box1" style="font-weight: bold">不可编辑</div>
        <div class="box1" style="margin-bottom: 20px">关闭智能仓库后才可编辑！</div>
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
    data() {
      return {
        isShow: true,   // 订单设置
        index: 'AS', // 显示大图的index
        // 查看日志
        paramObj:{},
        pulicLogVisible:false,
        innerVisible: false, // 显示大图的
        autoVisible: false, // 不可编辑
        skuUrl: '', // 显示大图URL
        state: this.$router.history.current.params.state, // 路由状态
        query: () => {}, // 方法
        queryF: () => {},// 方法
        version: '1.0.0',// 版本号
        dialogCheck: false, //添加赠品弹框
        tableData: [], // 数据接收
        project: [], // 查看方案商品
        queryData: { // 查询商品列表
          schemeName: ''
        },
        queryA: { // 添加的
          schemeName: '',
        },
        dog: 0, // 看门狗
        checkData: { // 添加商品
          skuName: '',
          barCode: '',
          assignStorageId: ''
        },
        can: '', // 行数据
        dialogVisible: false, // 方案
        totalPage: 20, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 数据总条数
        table_h: 0// 表格高度
      }
    },
    methods: {
      // 订单设置
      updateCity(bool) {
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
        this.paramObj.moduleId= 52;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      // 点击查看日志
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      // 显示图片大图
      showImg(row,index) {
        this.index = index;
        console.log(row);
        this.skuUrl = row.skuUrl;
        //this.innerVisible = true;
      },
      // 隐藏
      showImg1() {
        this.$nextTick(() => {
          this.index = 'ABC';
        })
        //this.innerVisible = false;
      },
      // 查看日志的方法
      changDialogShow() {
        this.pulicLogVisible = false;
      },
      // 点击设置仓库
      setupStore(row) {
        if (this.state == true) {
          this.autoVisible = true;
          return false
        }
        this.$router.push({name: 'setupStore',params: {id: row.assignStorageId}})
      },
      // 查询
      queryGiftBtn1() {
        this.checkSP(this.can)
      },
      // 查看方案
      checkF(row) {
        console.log(this.index);
        console.log(row);
        this.can = row;
        this.checkSP(row);
        this.dialogCheck = true;
      },
      // 查看方案商品的请求接口
      checkSP(row) {
        let self = this;
        self.checkData.assignStorageId = row.assignStorageId;
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/getWmAssignGoodList',self.checkData)
          .then(function(res) {
            if (res.data.code == 0) {
              self.project = res.data.result
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
      // 查询
      queryD() {
        this.query()
      },
      // 删除商品仓
      delProduct(val) {
        if (this.state == true) {
          this.autoVisible = true;
          return false
        }
        this._post('com.edb01.erp.wms.service.api.WmInStorageService/' + this.version + '/checkremoveoWmAssignStorage',{  assignStorageId: val.assignStorageId })
          .then(response => {
            if(response.data.success == true){
              this.$confirm('是否删除方案《'+ val.schemeName + '》？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
              }).then(() => {
                this._post('com.edb01.erp.wms.service.api.WmInStorageService/' + this.version + '/removeoWmAssignStorage',{  assignStorageId: val.assignStorageId })
                  .then(res => {
                    if (res.data.success == true) {
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                      this.query()
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
              }).catch(() => {
              });
            }else{
              this.$message({
                message: response.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 继续添加
      goonAdd() {
        this.queryF()
      },
      // 保存并关闭
      saveGoon() {
        this.queryF()
        if (this.dog == 1) {
          return false
        }
        this.dialogVisible = false
      },
     /* // 点击面包屑条页面
      jumpPage() {
        // 触发父组件
        this.$emit('ee', 1, '')
      },*/
      // 添加方案
      addButton() {
        this.dialogVisible = true
      },
    /*  handleCurrentChange(val) {
        console.log(val)
        this.currentPage = val;
      },
      // 分页
      // 每页多少条
      handleSizeChange(val) {
        console.log(val)
        this.totalPage = val;
      }*/
    },
    created() {
      // 动态获取表格高度
      //渲染表格高度
      this.$nextTick(function() {
        this.table_h = $(window).height() - $('.col-border').offset().top - 50;
      });
      window.onresize = () => {
        this.table_h = $(window).height() - $('.col-border').offset().top - 50;
      };
      // 添加仓方案
      this.queryF = () => {
        let self = this
        if(self.queryA.schemeName == '') {
          self.$message({
            message: '方案名称不能为空',
            type: 'warning'
          });
          self.dog = 1;
          return false
        }
        self.dog = 0
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/saveWmAssignStorageName',self.queryA)
          .then(function(res) {
            if (res.data.success == true) {
              self.queryA.schemeName = '';
              self.query();
              self.$message({
                message: '添加方案成功',
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
      // 产品仓列表
      this.query = () => {
        let self = this;
        //self.queryData.schemeName = '';
        self._post('com.edb01.erp.wms.service.api.WmInStorageService/' + self.version + '/echoWmAssignStorage',self.queryData)
          .then(function(res) {
            if (res.data.code == 0) {
              self.tableData = res.data.result;
              self.totalNum = res.data.result.total; // 数据的总条数
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
    }
  }
</script>

<style scoped>
/*  div,span,label{
    color: #5c5c5c;
  }*/
  .box1{
    text-align: center;
    font-size: 14px;
  }
  .box {
    margin: 20px 0 20px 24px;
  }
  .box88{
    text-align: left;
    height: 60px;
    line-height: 30px;
    width: 100%;
    overflow: hidden;
  }
</style>
<style>
  .div-log .el-dialog__body{
    padding:0!important;
  }
   .wrap .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
   border-bottom: none!important;
 }
 /* #wrapper .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0;
  }
  #wrapper .el-table .cell, .el-table th div {
    padding-right: 0;
  }
  #wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: none;
  }
  #wrapper > .el-table_1_column_1,.el-table_1_column_2,.el-table_1_column_3,.el-table_1_column_4,.el-table_1_column_5,.el-table_1_column_6{
    border-right: 1px solid #ebeef5!important;
  }
  #wrapper .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #fff;
  }*/
  #wrapper .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0;
  }
 #wrapper .el-table .cell, .el-table th div {
    padding-right: 0;
  }
 #wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 1px solid #ebeef5;
  }
 /*#wrapper .table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 0;
  }*/
/* #wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
   border-bottom: none!important;
 }*/
/* #wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
   border-right: none!important;
 }*/
 /*#wrapper #fitTable .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
   border-right: 1px solid #ebeef5!important;
 }*/
 #productSetup .el-table--enable-row-hover .el-table__body tr:hover>td {
   background-color: #fff!important;
 }
</style>
