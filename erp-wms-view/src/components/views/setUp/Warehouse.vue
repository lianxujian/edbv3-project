<!--仓库 贾南风-->
<template>
  <div>
  <div id="warehouse" v-show="paramsObj.mainPageShow">
    <div v-if="showAdd == 1">
      <div id="searchBox">
        <div class="leftBox1">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label>仓库类型：</label>
                <el-select v-model="queryD.storageType" clearable placeholder="请选择" >
                  <el-option
                    v-for="item in warehouseType"
                    :key="item.storeTypeName"
                    :label="item.storeTypeName"
                    :value="item.storeTypeId">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label>状态：</label>
                <el-select v-model="queryD.enableFlag" clearable placeholder="请选择" >
                  <el-option
                    v-for="item in state"
                    :key="item.value"
                    :label="item.value"
                    :value="item.label">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label>仓库名称：</label>
                <el-input v-model="queryD.storageName" placeholder="请输入内容" ></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox1">
          <el-button size="mini" type="primary"  @click="queryData()">查 询</el-button>
        </div>
      </div>
      <div style="clear:both"></div>
      <div class="col-nav" style="margin:-10px 0 10px;">
        <ul>
          <li @click="addPage" v-if="authorityCode.WMS_WAREHOUSE_ADD"><span>添加仓库</span></li>
          <li @click="publicLogBtn()" v-if="authorityCode.WMS_WAREHOUSE_LOG"><span>查看日志</span></li>
        </ul>
      </div>
      <div class="col-border">
        <el-table
          id="fitTable"
          :data="tableData"
          tooltip-effect="dark"
          :height="t_height"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            width="50"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="storageName"
            :show-overflow-tooltip="true"
            label="仓库名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="storageTypeName"
            width="130"
            label="仓库类型">
          </el-table-column>
          <el-table-column
            prop="contact"
            label="联系人">
          </el-table-column>
          <el-table-column
            align="right"
            prop="tel"
            :show-overflow-tooltip="true"
            width="120"
            label="手机">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="fullAddress"
            label="仓库地址">
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            label="启用状态">
            <template slot-scope="scope">
              <el-switch v-if="authorityCode.WMS_WAREHOUSE_START" v-model="scope.row.enabledFlag" @click.native="clickStart(scope.row)"></el-switch>
              <el-switch v-else v-model="scope.row.enabledFlag" disabled></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="amend(1,scope.row)" v-if="authorityCode.WMS_WAREHOUSE_AMEND">修改</el-button>
              <el-button type="text" size="small" @click="amend(2,scope.row)" v-if="authorityCode.WMS_WAREHOUSE_BINGEXPRESS">绑定快递</el-button>
              <el-button type="text" size="small" @click="deleteStore(scope.row)" style="color: red" v-if="authorityCode.WMS_WAREHOUSE_DEL">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100,200]"
          :page-size="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>
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
         <el-button style="margin-bottom: -30px" type="primary" @click="close()">关闭</el-button>
       </span>
      </el-dialog>
    </div>
    <!-- &lt;!&ndash;查看日志&ndash;&gt;-->
    <publicLog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></publicLog>

  </div>
    <addWarehouse v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 1" :params="paramsObj" @changeShow="changeShow"></addWarehouse>
    <amendWarehouse v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 2" :params="paramsObj" @changeShow="changeShow" :storageId="storageId"></amendWarehouse>
    <bindExpress v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 3" :params="paramsObj" @changeShow="changeShow" :storageId="storageId"></bindExpress>
    <lookFreight v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 4" :params="paramsObj" @changeShow="changeShow" :storageId="paramsObj.storageId" :expressId="paramsObj.expressId"></lookFreight>
  </div>
</template>
<script>
  import publicLog from '@/components/common/publicLogDialog.vue'
  import addWarehouse from '@/components/views/setUp/children/AddWarehouse.vue' // 添加仓库
  import amendWarehouse from '@/components/views/setUp/children/AmendWarehouse.vue' // 修改仓库
  import bindExpress from '@/components/views/setUp/children/BindExpress.vue' // 绑定快递
  import lookFreight from '@/components/views/setUp/children/LookFreight.vue' //  编辑运费模板

  export default {
    components: {
      publicLog,addWarehouse,amendWarehouse,bindExpress,lookFreight
    },
    data() {
      return {
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        // 查看日志参数
        paramObj:{},
        pulicLogVisible:false,
        centerDialogVisible: false, // 删除失败弹层
        title: '', // 删除失败弹层title
        paramsObj: {
          mainPageShow: true
        },//子级传参
        queryFn: () => {
        }, // 定义方法全局调用
        tableData: [], // 表格信息
        tableData9: [], // 查看日志
        /*{ storeTypeId: 2, storeTypeName: '菜鸟自动流转仓' },*/
        warehouseType: [
          { storeTypeId: '', storeTypeName: '全部' },
          { storeTypeId: 1, storeTypeName: '自建仓' },
          { storeTypeId: 2, storeTypeName: '第三方仓' },
          { storeTypeId: 3, storeTypeName: '菜鸟仓' },
          { storeTypeId: 4, storeTypeName: '京云仓' }
        ], // 仓库类型
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 数据总条数
        showAdd: 1, // 组件的显示隐藏
        queryD: {// 查询条件
          storageName: '',// 仓库名称
          storageType: '',// 仓库类型id
          enableFlag: '', // 是否启用
          page: 1,
          size: 15,
        },
        //id: '',
        storageId: '', // 传给修改仓库的参数
        version: '1.0.0', // 版本号
        state: [// 状态
          { value: '全部', label: '' },
          { value: '启用', label: true },
          { value: '停用', label: false }
        ],
        t_height: 0,// 表格高度
        arr: [],//仓库提示
      }
    },
    methods: {
      //子级传参通知父级刷新表格数据
      changeShow(val){
        if(val.isRefresh){
          this.paramsObj.mainPageShow = true;
          this.queryFn(this.queryD);
        }else if(val.childrenShow == 1) {
          this.paramsObj.childrenShow = 1;
          this.paramsObj.mainPageShow = true;
        }else if(val.childrenShow == 2) {
          this.paramsObj.childrenShow = 2;
          this.paramsObj.mainPageShow = false;
        }else if(val.childrenShow == 3){
          this.paramsObj.childrenShow = 3;
          this.paramsObj.mainPageShow = false;
          this.storageId = val.storageId;
        }else if(val.childrenShow == 4) {
          this.paramsObj.childrenShow = 4;
          this.paramsObj.mainPageShow = false;
          this.paramsObj.storageId = val.storageId;
          this.paramsObj.expressId = val.expressId;
        }else if(val.childrenShow == 19){
          this.paramsObj.mainPageShow = true;
        }
        },
      // 点击查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 13;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      //查看日志
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      // 修改的跳转页面
      amend(num,row) {
        this.storageId = row.storageId;
        if(num == 1) { // 修改页面
          this.paramsObj = {
            childrenShow: 2,
            mainPageShow: false
          }
          //this.$router.push({name: 'amendWarehouse',params: {storageId:row.storageId}})
        }else{ // 绑定快递
          this.paramsObj = {
            childrenShow: 3,
            mainPageShow: false
          }
          //this.$router.push({name: 'bindExpress',params: {storageId:row.storageId}})
        }
      },
      // 添加的跳转页面
      addPage() {
        //给子级传参并显示子级
        this.paramsObj = {
          childrenShow: 1,
          mainPageShow: false
        }
        //this.$router.push({path: 'addWarehouse'})
      },
      //监听全局enter触发的模糊查询--------------------------------------全局enter-----------------------------------------------------------全局enter
      /* overallBody(event) {
         var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
         if (e && e.keyCode === 13) {//如果按下的enter,进入
           this.queryData()//调用模糊查询的方法
         }
       },*/
      // 关闭错误的弹层
      close() {
        this.centerDialogVisible = false
      },
      // 点击启用  / 停用
      clickStart(row) {
        let self = this;
        if (row.enabledFlag === false) {
          self.clickStop(row)
        } else {
          self.queryD.page = self.currentPage;
          self.queryD.size = self.totalPage;
/*
          self.$confirm('是否启用该仓库?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {*/
            self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/activate',{storageId: row.storageId,storageType:row.storageType})
              .then(function (res) {
                if (res.data.code == 0) {
                  self.$message({// 给用户一个提示
                    message: '已启用',
                    type: 'success'
                  });
                  self.queryFn(self.queryD)// 重新渲染数据
                } else {
                  row.enabledFlag = false;
                  self.$message({
                    message: res.data.msg,// 如果code为其他，弹出错误码
                    type: 'warning'
                  })
                }
              })
              .catch(function (err) {
                console.log(err)
              })
         /* }).catch(() => {
            row.enabledFlag = false;
            self.$message({
              type: 'info',
              message: '已取消启用'
            })
          })*/
        }
      },
      // 点击停用
      clickStop(row) {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version+ '/checkDependecy',{storageId: row.storageId,flag: false})
          .then(res => {
            if(res.data.success == true){
              self.queryD.page = self.currentPage;
              self.queryD.size = self.totalPage;
              self.$confirm('是否停用该仓库?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
              }).then(() => {
                // 发请求
                self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/deactivate',{storageId: row.storageId})
                  .then(function (res) {
                    if (res.data.code == 0) {
                      self.$message({// 给用户一个提示
                        message: '已停用',
                        type: 'success'
                      });
                      self.queryFn(self.queryD)// 重新渲染数据
                    }
                  })
                  .catch(function (err) {
                    console.log(err)
                  })
              }).catch(() => {
                row.enabledFlag = true;
                /*self.$message({
                  type: 'info',
                  message: '已取消启用'
                })*/
              })

            }else if(res.data.success == false){
              if(res.data.code == 250000005){
                self.arr = [];
                row.enabledFlag = true;
                var result = res.data.result
                for (var item of result.codeList){
                  if (item == 250000001) {
                    self.arr.push({name:'已有' +  result.shopNumber + '个店铺设置此仓库为默认仓库'})
                  }
                  if (item == 250000002) {
                    self.arr.push({name: '仓库为属地仓'})
                  }
                  if (item == 250000003) {
                    self.arr.push({name:'仓库为商品指定仓' })
                  }
                  if (item == 250000004) {
                    self.arr.push({name: '仓库已绑定快递'})
                  }
                  if(item == 250000005 ) {
                    self.arr.push({name: '此仓库不可被删除或停用'})
                  }
                  if(item == 250000006 ) {
                    self.arr.push({name: '此仓库在订单标记超重规则被使用'})
                  }
                  if(item == 250000007) {
                    self.arr.push({name: '此仓库下有存在库区不允许删除或停用'})
                  }
                  if(item == 250000008) {
                    self.arr.push({name: '此仓库有未处理的订单'})
                  }
                }
                self.title = '停用失败';
                self.centerDialogVisible = true
              }
            }
          });
      },
     /* addS(val, row) {
        this.id = row;
        this.showAdd = val;
        this.queryFn(this.queryD)
      },*/
      // 查询
      queryData() {
        this.queryFn(this.queryD) // 初始化调用
      },
      // 删除仓库
      deleteStore(row) {
        console.log(row);
        let self = this;
        self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version+ '/checkDependecy',{storageId: row.storageId,flag: true})
          .then(res => {
            if(res.data.success == true){
              self.queryD.page = self.currentPage;
              self.queryD.size = self.totalPage;
              self.$confirm('是否删除仓库《' + row.storageName + '》', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
              }).then(() => {
                // 发删除请求
                // 发请求
                self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version+ '/delete',{ storageId: row.storageId})
                  .then(function(res) {
                    if (res.data.code == 0) {
                      self.queryFn(self.queryD); // 重新渲染数据
                      self.$message({//  提示用户删除成功
                        type: 'success',
                        message: '删除成功!'
                      })
                    }
                  })
                  .catch(function(err) {
                    console.log(err)
                  })
              }).catch(() => {
               /* self.$message({//  取消删除提示
                  type: 'info',
                  message: '已取消删除'
                })*/
              })
            }else if(res.data.success == false){
              if(res.data.code == 250000005){
                self.title = '删除失败';
                self.centerDialogVisible = true;
                self.arr = [];
                var result = res.data.result;
                for (var item of result.codeList){
                  if (item == 250000001) {
                    self.arr.push({name:'已有' +  result.shopNumber + '个店铺设置此仓库为默认仓库'})
                  }
                  if (item == 250000002) {
                    self.arr.push({name: '仓库为属地仓'})
                  }
                  if (item == 250000003) {
                    self.arr.push({name:'仓库为商品指定仓' })
                  }
                  if (item == 250000004) {
                    self.arr.push({name: '仓库已绑定快递'})
                  }
                  if(item == 250000005) {
                    self.arr.push({name: '此仓库不可被删除或停用'})
                  }
                  if(item == 250000006) {
                    self.arr.push({name: '此仓库在订单标记超重规则被使用'})
                  }
                  if(item == 250000007) {
                    self.arr.push({name: '此仓库下有存在库区不允许删除或停用'})
                  }
                  if(item == 250000008) {
                    self.arr.push({name: '此仓库有未处理的订单'})
                  }
                }
                console.log(self.arr);
              }
            }
          });
      },
      //  当前页
      handleCurrentChange(val) {
        console.log(val);

        this.currentPage = val;
        this.queryD.page = this.currentPage;
        this.queryD.size = this.totalPage;

        this.queryFn(this.queryD);// 请求数据
      },
      //  分页
      //  每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        sessionStorage.setItem('hold_warehousesFiles_1', val);

        this.queryD.page = this.currentPage;
        this.queryD.size = this.totalPage;

        this.queryFn(this.queryD);// 请求数据
      },
     /* handleClick(row) {
        this.rowId = row;
        console.log(row)
      }*/
    },
    mounted() {
      //渲染表格高度
      this.$nextTick(function() {
        this.t_height = $(window).height() - $('.col-border').offset().top - 95;
      });
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 95;
      };

      if(sessionStorage.getItem('hold_warehousesFiles_1') != null){
        this.totalPage = parseInt(sessionStorage.getItem('hold_warehousesFiles_1'))
        this.queryD.size = this.totalPage;
      }
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if(e && e.keyCode==13){ // enter 键
          //调接口
          this.queryData();
        }
      };
      /* //监听全局enter 回车事件
       document.body.addEventListener( 'keyup' , this.overallBody, false) //监听全局的键盘按下   第三个参数是否启用捕获，一般是false*/
    },
    created() {
      //  页面初始化数据--------------------------------------------------------初始化---------------------------------初始化
      this.queryFn = (pare) => {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/query',pare)
          .then(function(response) {
            if (response.data.code === 0) {
              self.totalNum = response.data.result.total; //  数据的总条数
              self.tableData = response.data.result.rows; //  接受所有的数据
              // 判断仓库类型并做相应显示
              for (var i = 0; i < self.tableData.length; i++) {
                if (self.tableData[i].storageType == 1) {
                  self.tableData[i].storageTypeName = '自建仓'
                } else if (self.tableData[i].storageType == 2) {
                  self.tableData[i].storageTypeName = '第三方仓'
                } else if (self.tableData[i].storageType == 3) {
                  self.tableData[i].storageTypeName = '菜鸟仓'
                } else if (self.tableData[i].storageType == 4) {
                  self.tableData[i].storageTypeName = '京云仓'
                }
              }
              //  遍历状态isEnable,为true时显示正常，否则为冻结
              /* for (var i = 0; i < self.tableData.length; i++) {
                 if (self.tableData[i].isenable == true) {
                   self.tableData[i].isenable = '启用'
                 } else {
                   self.tableData[i].isenable = '停用'
                 }
               }*/
            } else {
              self.$message({
                message: response.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      }
      this.queryFn(this.queryD)//  初始化调用
    }
  }
</script>
<style scoped>
</style>

