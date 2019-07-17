<!--下架策略 秋香-->
<template>
  <div id="DownShelves">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label >策略名称：</label>
              <el-input id="barCode" v-model="soldoutStrategyName" placeholder="请输入内容"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label >生效仓库：</label>
              <!--<el-select id="isSuit" v-model="queryAll.storageId" filterable placeholder="全部">
                <el-option
                  v-for="item in storage"
                  :key="item.storageId"
                  :label="item.storageName"
                  :value="item.storageId">
                </el-option>
              </el-select>-->
              <select id="example-post" name="multiselect[]" multiple="multiple">
                <option  v-for="item in storage" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label >状态：</label>
              <el-select id="enabledFlag" v-model="enabledFlag" filterable placeholder="启用">
                <el-option
                  v-for="item in enabledFlagTwo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button @click="queryData()" size="mini" type="primary">查 询</el-button>
        <el-button @click="reset()" size="mini" type="default">重 置</el-button>
      </div>
    </div>
    <!-- 表头 -->
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="addButton()" v-if="authorityCode.WMS_DOWNSHELVES__UPDATE"><span>添加</span></li>
        <li @click="deleteButton()" v-if="authorityCode.WMS_DOWNSHELVES__ADD"><span>删除</span></li>
        <li @click="publicLogBtn()"><span>查看日志</span></li>
      </ul>
    </div>

    <!--表格-->
    <div class="pDown">
        <el-table  ref="multipleTable"
                    id="fitTable"
                    :height="table_h"
                    :data="tableData"
                    border style="width: 100%"
                    @selection-change="handleSelectionChange"
                   tooltip-effect="dark"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="45">
          </el-table-column>
          <el-table-column
            align='center'
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            align="center"
            prop="strategyName"
            label="策略名称">
          </el-table-column>
          <el-table-column
            align="center"
            label="出库单类型"
            width="200">
            <template slot-scope="scope">
              <span v-for="item in scope.row.soldoutTypeList">
                 <span v-if="item == 1">采购退货</span>
                  <span v-if="item== 2">调拨出库</span>
                  <span v-if="item == 3">其他出库</span>
                  <span v-if="item == 4">订单出库</span>
                  <span v-if="item == 5">全部</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="生效仓库"
            align='left'
            :show-overflow-tooltip="true"
            prop="storageNames">
          </el-table-column>
          <el-table-column
            align="center"
            label="库区名称"
            :show-overflow-tooltip="true"
            prop="sectionNames">
          </el-table-column>
          <el-table-column
            align="center"
            prop="orderName"
            label="库位下架优先顺序"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enabledFlag" :disabled="scope.row.systemDefault ==true"  @click.native="switchChange(scope.row)" v-if="authorityCode.WMS_DOWNSHELVES_STATUS"></el-switch>
              <el-switch v-model="scope.row.enabledFlag" disabled v-else></el-switch>
            </template>
          </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope" v-if="scope.row.enabledFlag==false||scope.row.systemDefault ==true">
            <el-button  @click="clickDetail(scope.row)"type="text" size="small" v-if="authorityCode.WMS_DOWNSHELVES__UPDATE">修改</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <div class="pagination">
        <pagination
          :totalCom="total"
          :pageSizeCom="pageSize"
          :curPageCom="curPage"
          @pageSizeVal="getPageSize" @curPageVal="getCurPage"
        ></pagination>
      </div>
    </div>
    <!--------------------------------------------------删除快递绑定-------------------------------------------------------------->
    <div>
      <el-dialog v-dialogDrag
        title="删除"
        :visible.sync="deleteListWindow"
        width="500px"
        center>
        <div style="width: 100%;margin-top: -20px;">
           <div>
             <i style="font-size: 16px;color: red;margin-left: 20px;" class="el-icon-warning">
             </i><span style="font-size: 14px;margin-left: 10px">已删除成功{{deletetableData.deleteSuccessNums}}条，失败{{num}}条！</span>
           </div>
          <div style="margin-top: 10px">
            <span>失败原因：下架策略已经被引用，不可进行删除操作。</span>
          </div>
        </div>

        <div style="margin-top:20px">
          <div><span>失败策略列表</span></div>
          <el-table :data="deletetableData.strategyListBeanlist" border style="width:100%;"
                    ref="multipleTable3" >
            <el-table-column
              align="center"
              type="index"
              label="序号">
            </el-table-column>

            <el-table-column
              label="策略名称"
               prop="strategyName">
            </el-table-column>

            <el-table-column
              label="生效仓库"
                prop="storageNames">
            </el-table-column>

            <el-table-column
              label="库区名称"
              prop="sectionNames">
            </el-table-column>
          </el-table>
          </div>
      </el-dialog>
    </div>
    <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import publicLog from '@/components/common/publicLogDialog.vue'
  export default {
    components: {
      pagination,
      'v-Publiclog': publicLog
    },
    data() {
      return {
        version:'1.0.0',
        queryFn: () => {
        }, // 定义方法全局调用
        paramObj:{},
        pulicLogVisible:false,
        table_h: 0,//表格高度
        curPage: 1, //当前页数
        totalPage: 15, // 要显示的条数
        currentPage: 1, //当前页
        totalNum: 0, // 数据总条数
        // 模糊查询
          soldoutStrategyName:'',//下架策略名
          storageIdList:'',//制定仓库id集合
          enabledFlag:'',//启用状态
          page: 1,//当前页
          merchantId:0,//商户id
          size: 15,
        paramData:{
          soldoutStrategyName:'',//下架策略名
          storageIdList:'',//制定仓库id集合
          enabledFlag:'',//启用状态
          page: 1,//当前页显示条数
          merchantId:0,//商户id
          size: 15,
        },
        storage:[],//仓库
        enabledFlagTwo:[
        {
          value: true,
          label: '启用'
        },{
          value: false,
          label: '停用'
        }, {
            value:'',
            label: '全部'
          }],//按钮
        tableLeft: [
          {id:1,name: '近有效期先出'},
          {id:2,name: '先进先出'},
          {id:3,name: '拣货路径最优'},
          {id:4,name: '清空库位'},
        ],//类型
        soldoutType:[
          {id:1,lable: '采购退货'},
          {id:2,lable: '调拨出库'},
          {id:3,lable: '其他出库'},
          {id:4,lable: '订单出库'},
          ],//出库单类型
        num: '',//失败条数
        stock: [],//仓库
        barCode: '',//条形码
        name:'',//商品名称
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        isSuit: '',//是否套装
        tableData1:[],//表格勾选
        deleteListWindow:false,//删除快递绑定窗口
        deletetableData:[],//失败策略列表
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{}//权限
      }
    },
    mounted(){
      this.initMessage();
      this.initInt()
      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight // 页面高度
        var b = document.getElementById('fitTable').offsetTop // 表格距离顶部的距离
        this.table_h = a - b - 100
      })
    },
    activated() {
      this.initMessage();//初始化表格数据
    },
    methods:{
      // 点击查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 25;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },

      //日志窗口
      changDialogShow(){
        this.pulicLogVisible=false;
      },

      //初始化数据
      initMessage(){
        if ($('#example-post').val().length == this.storage.length) {
          this.storageIdList = ''
        }else {
          this.storageIdList = $('#example-post').val();
        }
        var self = this;
        var paramData = {
          soldoutStrategyName:self.soldoutStrategyName,//下架策略名
          storageIdList:self.storageIdList,//制定仓库id集合
          enabledFlag:self.enabledFlag,//启用状态
          page:self.curPage,//当前页显示条数
          size: self.pageSize,
          merchantId:0,//商户id
        }
        this.queryFn = (paramData) => {
          self._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/'+this.version+'/newList',paramData)
            .then(function (response) {
              if (response.data.code == 0) {
                self.tableData = response.data.result.rows;
                self.total = response.data.result.total;
                for (var item of self.tableData) {
                  if (item.systemDefault == true||item.soldoutTypeList.length==4) {
                    item.soldoutTypeList = '5';
                  }
                }

                //近有效期先出,先进先出,拣货路径最优,清空库位,
                self.tableData.forEach((item,i)=>{
                  var orderName = item.priArrayStr.split(','),newArr = [],str = '';
                  orderName.forEach((item2,j)=>{
                    newArr.push({
                      num:item2,
                      name:''
                    })
                    if(j == 0)newArr[0].name = '近有效期先出';
                    if(j == 1)newArr[1].name = '先进先出';
                    if(j == 2)newArr[2].name = '拣货路径最优';
                    if(j == 3)newArr[3].name = '清空库位';
                  })
                  newArr = newArr.sort((a,b)=>{
                    return a.num*1 - b.num*1;
                  })
                  newArr.forEach((item,i)=>{
                    str+=item.name + ',';
                  })
                  item.orderName = str.slice(0,-1);
                })

                for(var item of self.tableData){
                  for(var item1 of item.soldoutType){
                    for(var item2 of self.soldoutStrategy){
                      if(item2.id == item1){
                        item.soldoutStrategy += item2.name
                      }
                    }
                  }
                }
              } else {
                self.$message({
                  message: response.data.result.message,
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        this.queryFn(paramData);
      },

      //根据商户id查询启用仓库列表。
      initInt(){
        var self=this;
        var paramData = {
          merchantId:0,//商户id
        }
        self._post('com.edb01.erp.wms.service.api.WmStorageService/'+this.version+'/findGrantStorageByUser',paramData)
          .then(function (response) {
            if (response.data.code == 0) {
              self.storage = response.data.result;
              var value = []
              for (var item of self.storage){
                item.value = item.storageId
                item.label = item.storageName
                value.push(item.storageId)
              }
              $('#example-post').multiselect('dataprovider', self.storage );
              $('#example-post').multiselect('select',value);
            } else {
              self.$message({
                message: response.data.result.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //以下是分页
      getPageSize: function (val) {
        if(val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();
        }
      },
      getCurPage: function (val) {
        if(val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
        }
      },

      //重置
      reset(){
          this.soldoutStrategyName='',//策略名 模糊查询
          this.enabledFlag=''//启用状态
          $('#example-post').multiselect('dataprovider', this.storage);
      },

      //修改路由跳转
      clickDetail(row){
        this.$router.push({name: 'UpdateNextStrategy',params: {soldoutStrategyId: row.soldoutStrategyId}})
      },

      //根据id设置详情路由
      pushRouter:function (row) {
        if(event.target.innerHTML != 0) {
          this.$router.push('/preAccount/' + row.id)
        }
      },

      //添加跳转路由
      addButton() {
        this.$router.push({path: '/NextStrategy'});
      },

      //模糊查询
      queryData(){
        this.initMessage();// 初始化调用
      },

      //switch开关是否停用
      switchChange(row){
        let self = this
        if(row.systemDefault ==true){
          row.enabledFlag =true
        }else {
          if (row.enabledFlag == true) {
            self.clickStop(row)
          } else {
            self.page = self.currentPage;
            self.size = self.totalPage;
            self.$confirm('是否停用?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true
            }).then(() => {
              self._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/' + this.version + '/usingStatus', {
                soldoutStrategyId: row.soldoutStrategyId,
                enabledFlag: false,
                merchantId: 0
              })
                .then(function (res) {
                  if (res.data.code == 0) {
                    self.$message({// 给用户一个提示
                      message: '已停用',
                      type: 'success'
                    });
                    // 重新渲染列表
                    var paramData = {
                      clToken: self.token,
                      page: self.currentPage,
                      enabledFlag: '',//启用状态
                      size: 15,
                      tenantId: 0,
                    }
                    self.queryFn(paramData)// 重新渲染数据
                  }
                  if (res.data.code == 13000001) {
                    row.enabledFlag = true
                    self.$message({
                      type: 'warning',
                      message: '该策略已经被引用，不允许停用！'
                    })
                  } else if (res.data.code == 410006) {
                    row.enabledFlag = true
                    self.defaultShop = res.data.result
                    self.title = '停用失败'
                    self.centerDialogVisible = true
                  }
                })
                .catch(function (err) {
                  console.log(err)
                })
            }).catch(() => {
              row.enabledFlag = true
              self.$message({
                type: 'info',
                message: '已取消停用'
              });
            });
          }
        }
      },

      //switch开关是否启用
      clickStop(row) {
        let self = this
        self.page = self.currentPage
        self.size = self.totalPage
        self.$confirm('是否启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true
        }).then(() => {
          // 发请求
          self._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/'+this.version+'/usingStatus',{soldoutStrategyId:row.soldoutStrategyId,enabledFlag:true,merchantId:0})
            .then(function(res) {
              if (res.data.code == 0) {
                self.$message({// 给用户一个提示
                  message: '已启用',
                  type: 'success'
                })
                // 重新渲染列表
                var paramData = {
                  clToken: self.token,
                  page: self.currentPage,
                  enabledFlag:'',//启用状态
                  size: 15,
                  tenantId: 0,
                }
                self.queryFn(paramData)// 重新渲染数据
              } else {
                self.$message({
                  message: res.data.message,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }).catch(() => {
          row.enabledFlag = false
          self.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      },

      //表格勾选
      handleSelectionChange(val){
        this.tableData1 = val
      },

      //删除确定按钮
      deleteButton(){
        if(this.tableData1.length == 0) { // 判断是否选中要删除的库位
          this.$message({
            message:'请选择要删除的下架策略',
            type: 'warning'
          })
          return false
        }
        this.$confirm('确定要删除此下架策略吗？','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          let str = ''
          for(let item of this.tableData1){ // 库位ID，用逗号隔开
            str += item.soldoutStrategyId + ','
          }
          var data={
            soldoutStrategyIdListStr: str.slice(0,-1),
            merchantId:'0'
          }
          this._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/'+this.version+'/deleteSoldoutStrategy', data)
            .then((res) => {
              let paramData = {
                soldoutStrategyName:'',//下架策略名
                storageIdList:'',//制定仓库id集合
                enabledFlag:'',//启用状态
                page: 1,//当前页显示条数
                merchantId:0,//商户id
                size: 15,
              };
              if(res.data.success == true){

                if(res.data.result.strategyListBeanlist.length == 0){
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.queryFn(paramData); // 重新渲染数据
                }else{
                  this.deleteListWindow=true;
                  this.deletetableData = res.data.result;
                  //this.deleteLength = this.deletetableData.strategyListBeanlist.length;
                  this.num = this.tableData1.length - this.deletetableData.deleteSuccessNums;
                  this.queryFn(paramData); // 重新渲染数据
                }
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
        }).catch(() => {
          this.$message({//  取消删除提示
            type: 'info',
            message: '已取消删除'
          })
        })
      },
    },
    created() {
    }
  }
</script>
<style scoped>
  #DownShelves{
    padding: 20px;
  }
  .pTop{
    margin-bottom: 20px;
  }
</style>
<style>
  #DownShelves .el-table td, .el-table th{
    padding: 0!important;
  }
  #DownShelves .el-table th>.cell {
    text-align: center;
    padding: 3px 0;
    background-color: #eee;
  }
  #DownShelves .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #eee!important;
  }
  #DownShelves .pTop .el-input,.pTop .el-input__inner{
    width: 195px!important;
    height: 28px!important;
    line-height: inherit!important;
  }

  #DownShelves del span {
    text-align: center;
  }

</style>


