<!--供应商  贾南风-->
<template>
  <div id="supplier">
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 75px">供应商编号：</label>
              <el-input  placeholder="" :maxlength="20" v-model="supplierData.supplierNo"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 75px">供应商名称：</label>
              <el-input  placeholder="" :maxlength="50" v-model="supplierData.supplierName"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>启用状态：</label>
              <el-select  clearable placeholder="请选择" v-model="supplierData.statusFlag">
                <el-option
                  v-for="item in state1"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox1">
        <el-button size="mini" type="primary" @click="queryData()">查 询</el-button>
      </div>
    </div>
    <div style="clear:both"></div>
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="addSupplier"><span>添加</span></li>
        <li @click="publicLogBtn()"><span>查看日志</span></li>
      </ul>
    </div>
    <div>
      <el-table
        ref="box"
        id="fitTable"
        :height="table_h"
        tooltip-effect="dark"
        :data="tableData"
        border>
        <el-table-column
          width="50"
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="supplierNo"
          :show-overflow-tooltip="true"
          label="供应商编号">
        </el-table-column>
        <el-table-column
          prop="supplierName"
          :show-overflow-tooltip="true"
          label="供应商名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="contacts"
          :show-overflow-tooltip="true"
          label="联系人">
        </el-table-column>
        <el-table-column
          align="right"
          prop="mobile"
          :show-overflow-tooltip="true"
          label="手机">
        </el-table-column>
        <el-table-column
          align="right"
          prop="newAddress"
          :show-overflow-tooltip="true"
          label="地址">
        </el-table-column>
        <el-table-column
          align="right"
          prop="url"
          :show-overflow-tooltip="true"
          label="网址">
        </el-table-column>
        <el-table-column
          align="left"
          prop="remark"
          :show-overflow-tooltip="true"
          label="备注">
        </el-table-column>
        <el-table-column
          align="center"
          width="100"
          label="启用状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.startFlag" @click.native="clickStart(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="amendData(scope.row)" type="text" size="small">修改</el-button>
            <el-button type="text" size="small" style="color:red" @click="delData(scope.row)">删除</el-button>
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
    <!--添加/编辑-->
    <div>
      <el-dialog v-dialogDrag
        :title="title"
        :visible.sync="dialogVisible"
        width="800px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple">
              <el-form-item label="供应商编号" prop="supplierNo">
                <el-input :disabled="true" v-model="ruleForm.supplierNo"></el-input>
              </el-form-item>
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="ruleForm.supplierName" :maxlength="50"></el-input>
              </el-form-item>
            </div></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple">
              <el-form-item label="联系人">
                <el-input v-model="ruleForm.contacts" :maxlength="20"></el-input>
              </el-form-item>
            </div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="ruleForm.mobile" :maxlength="11"></el-input>
              </el-form-item>
            </div></el-col>
          </el-row>
              <el-form-item label="地址">
                <el-row>
                  <el-col :span="4" style="margin-right: 8px">
                    <el-select v-model="ruleForm.provinceId" placeholder="请选择" @change="two()">
                      <el-option
                        v-for="item in province"
                        :key="item.regionName"
                        :label="item.regionName"
                        :value="item.regionId">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="4" style="margin-right: 8px">
                    <el-select v-model="ruleForm.cityId" placeholder="请选择" @change="three()">
                      <el-option
                        v-for="item in city"
                        :key="item.regionName"
                        :label="item.regionName"
                        :value="item.regionId">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="4" style="margin-right: 8px">
                    <el-select v-model="ruleForm.regionId" placeholder="请选择" >
                    <el-option
                      v-for="item in district"
                      :key="item.regionName"
                      :label="item.regionName"
                      :value="item.regionId">
                    </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="11">
                    <el-input v-model="ruleForm.address" :maxlength="100"></el-input></el-col>
                </el-row>
              </el-form-item>
          <el-form-item label="网址">
            <el-input v-model="ruleForm.url" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="ruleForm.remark" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="startFlag">
            <el-radio-group v-model="ruleForm.startFlag">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="width: 100%;text-align: right">
            <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
            <el-button @click="dialogVisible=false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </div>
    <!-- &lt;!&ndash;查看日志&ndash;&gt;-->
    <div>
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
  </div>
</template>
<script>
  import publicLog from '@/components/common/publicLog.vue'
  export default {
    components: {
      'v-Publiclog': publicLog
    },
    data() {
      return {
        paramObj: {}, // 日志接受参数
        pulicLogVisible: false, // 日志
        queryFn: () => {},// 方法
        tableData: [],// 表格接受数据
        version: '1.0.0',//版本号
        dialogVisible: false, // 添加
        title: '添加供应商',// 添加弹框title
        stateFlag: true, // 区分编辑还是保存
        dog: 0,// 看门1
        dog1: 0,// 看门2
        state: [
          { name: '全部', id: ''},
          { name: '未授权', id: 1 },
          { name: '已授权', id: 2 },
          { name: '授权失效', id: 3 }
        ], // 授权状态
        state1: [
          { name: '全部',id: ''},
          { name: '启用', id: true },
          { name: '停用', id: false }
        ], // 启用状态
        province: '', // 省
        city: '', // 市
        district: '', // 区
        ruleForm: { // 添加供应商参数
          supplierName: '',//供应商name
          supplierNo: '',//供应商编号
          contacts: '',//联系人
          mobile: '',//手机
          provinceId: '',//地址省id
          cityId: '',//地址市id
          regionId: '', //地址区id
          address: '',//地址
          url: '', //网址
          remark: '', //备注
          startFlag: 1//是否启用
        },
        rules: { // 表单验证规则
          supplierName: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' },
          ],
          supplierNo: [
            { required: true, message: '请输入供应商编号', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          startFlag: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ]
        },
        supplierData:{
          supplierName: '',//供应商名
          supplierNo: '',//供应商编号
          statusFlag: '', // 应商启用状态 1启用 0未启用 不传所有
          page: 1,
          size: 15
        },
        currentPage: 1,
        totalPage: 15, // 要显示的条数
        totalNum: 0, // 数据总条数
        success: false, // 看门
        table_h: 0// 表格高度
      }
    },
    methods: {
      // 点击查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 26;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      // 日志方法
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      // 点击修改数据
      amendData(row) {
        this.title = '修改供应商';
        this.stateFlag = true;
        this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/getSupplierById',{supplierId:row.supplierId})
          .then(res => {
            if(res.data.success == true){
              this.dialogVisible = true;
              if(res.data.result.startFlag == true) {
                res.data.result.startFlag = 1;
              }else{
                res.data.result.startFlag = 2;
              }
              this.ruleForm = res.data.result;
              if(this.ruleForm.cityId){
                this.dog = 0;
                this.dog1 = 0;
                this.two(); // 二级
                this.three(); // 三级
              }
            }
          })

      },
      // 提交添加·
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm.startFlag == 1){
              this.ruleForm.startFlag = true;
            }else{
              this.ruleForm.startFlag = false;
            }
            if(this.stateFlag == true){ // 编辑的保存
              this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/updateSupplier', this.ruleForm)
                .then(res => {
                  if (res.data.success == true) {
                    this.dialogVisible = false;
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    });
                    this.queryFn(this.supplierData);
                  } else {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
            }else if(this.stateFlag == false){ // 添加的保存
              this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/addSupplier', this.ruleForm)
                .then(res => {
                  if (res.data.success == true) {
                    this.dialogVisible = false;
                    this.$message({
                      message: '添加成功',
                      type: 'success'
                    });
                    this.queryFn(this.supplierData);
                  } else {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
            }

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 删除供应商
      delData(row){
        this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/deleteCheck',{supplierId:row.supplierId})
          .then(res => {
            if(res.data.success == true){
              if(res.data.result == true){
                this.$confirm('确定要删除此供应商吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  center: 'true'
                }).then(() => {
                  this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/deleteSupplier',{supplierId:row.supplierId})
                    .then(res => {
                      if(res.data.success == true){
                        this.queryFn(this.supplierData);
                        this.$message({
                          type: 'success',
                          message: '删除成功!'
                        });
                      }else{
                        this.$message({
                          type: 'warning',
                          message: res.data.msg
                        });
                      }
                    })
                }).catch(() => {
                });
              }else{
                this.$message({
                  message: '出库单或入库单有此供应商，不可删除!',
                  type: 'warning'
                })
              }

            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }

          })

      },
      /*resetForm(formName) {
        this.$refs[formName].resetFields();
      },*/
      // 查询按钮
      queryData() {
        this.queryFn(this.supplierData);
      },
      // 点击添加供应商
      addSupplier() {
        this.title = '添加供应商';
        this.stateFlag = false;
        this.ruleForm.contacts = '';
        this.ruleForm.provinceId = '';
        this.ruleForm.url = '';
        this.ruleForm.remark = '';
        this.ruleForm.address = '';
        this.ruleForm.cityId = '';
        this.ruleForm.regionId = '';
        this.ruleForm.supplierName = '';
        this.ruleForm.mobile = '';
        this.dialogVisible = true;
          this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/createSupplierNo')
            .then(res => {
              if(res.data.success == true){
                this.$nextTick( () => {
                  this.ruleForm.supplierNo = res.data.result;
                })
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
      },
      // 传给查看日志的方法
      changDialogShow() {
        this.pulicLogVisible = false;
      },
      //监听全局enter触发的模糊查询--------------------------------------全局enter-----------------------------------------------------------全局enter
      overallBody(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if (e && e.keyCode === 13) {//如果按下的enter,进入
          this.queryData()//调用模糊查询的方法
        }
      },
      // 查看日志的方法
      changDialogShow() {
        this.pulicLogVisible = false;
      },
      // 点击启用  / 停用
      clickStart(row) {
        let self = this
        if (row.startFlag === false) {
          self.clickStop(row)
        } else {
          self.supplierData.page = self.currentPage;
          self.supplierData.size = self.totalPage;

          self.$confirm('是否启用该供应商?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            // 发请求
            self._post('com.edb01.erp.mdata.service.api.SupplierService/' + self.version + '/statusUsing', {
              supplierId: row.supplierId,
              statusFlag: 1
            })
              .then(function (res) {
                if (res.data.code == 0) {
                  self.$message({// 给用户一个提示
                    message: '已启用',
                    type: 'success'
                  });
                  self.queryFn(self.supplierData)// 重新渲染数据
                } else {
                  row.startFlag = false;
                  self.$message({
                    message: res.data.msg,// 如果code为其他，弹出错误码
                    type: 'warning'
                  })
                }
              })
              .catch(function (err) {
                console.log(err)
              })
          }).catch(() => {
            row.startFlag = false;
          })
        }
      },
      // 点击停用
      clickStop(row) {
        this.supplierData.page = this.currentPage;
        this.supplierData.size = this.totalPage;
        this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/stopCheck', {supplierId: row.supplierId})
          .then(res =>{
            if(res.data.result == true){
              this.$confirm('是否停用该供应商?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
              }).then(() => {
                // 发请求
                this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/statusUsing', {
                  supplierId: row.supplierId,
                  statusFlag: 0
                })
                  .then(res => {
                    if (res.data.code == 0) {
                      this.$message({// 给用户一个提示
                        message: '已停用',
                        type: 'success'
                      })
                      this.queryFn(this.supplierData)// 重新渲染数据
                    } else {
                      row.startFlag = true;
                      this.$message({
                        message: res.data.msg, // 如果code为其他，弹出错误码
                        type: 'warning'
                      })
                    }
                  })
                  .catch(function (err) {
                    console.log(err)
                  })
              }).catch(() => {
                row.startFlag = true;
              })
            }else{
              row.startFlag = true;
              this.$message({
                message: '有未确认的出库单或入库单，不可停用',
                type: 'warning'
              })

            }
          })
      },
      // 当前页
      handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val;
        this.supplierData.page = this.currentPage;
        this.supplierData.size = this.totalPage;

        this.queryFn(this.supplierData); // 请求数据
      },
      // 分页
      // 每页多少条
      handleSizeChange(val) {
        console.log(val);
        this.totalPage = val;
        sessionStorage.setItem('hold_shopFiles_1', val);
        this.supplierData.page = this.currentPage;
        this.supplierData.size = this.totalPage;
        this.queryFn(this.supplierData);// 请求数据
      },
      // 省改变请求市'
      two() {
        let self = this;
        if(self.dog >= 1) {
          self.ruleForm.cityId = '';// 请空二级
          self.ruleForm.regionId = '';// 请空三级
        }
        self.dog++;
        // 请求市
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.ruleForm.provinceId})
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
        if(self.dog1 >= 1) {
          self.ruleForm.regionId = '';// 请空三级
        }
        self.dog1++;
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.ruleForm.cityId})
          .then(function(res) {
            if (res.data.code == 0){
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
    },
    created() {
      // 把所有的a标签里的href编码
      var a = document.getElementsByTagName('a');
      for (var i = 0, len = a.length; i < len; i++) {
        a[i].href = encodeURI(a[i].href)
        // console.log(a[i].href, 13);
      }
    },
    mounted() {
      this.queryFn = (data) => {
        this._post('com.edb01.erp.mdata.service.api.SupplierService/' + this.version + '/listWithPage',data)
          .then(res => {
            if(res.data.success == true){
              this.tableData = res.data.result.rows;
              this.totalNum = res.data.result.total;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      };

      this.queryFn(this.supplierData);

      // 请求省
      this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list',{regionId: 1})
        .then( res => {
          if (res.data.code == 0){
            this.province = res.data.result; // 接受省的数据
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
        .catch(function(err) {
          console.log(err)
        });
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight;// 页面高度
        var b = document.getElementById('fitTable').offsetTop; // 表格距离顶部的距离
        this.table_h = a - b - 85;
      });

      //监听全局enter 回车事件
      document.body.addEventListener( 'keyup' , this.overallBody, false) //监听全局的键盘按下   第三个参数是否启用捕获，一般是false
    }
  }
</script>
<style scoped>
  .fix {
    margin-top: 20px;
    white-space: nowrap;
  }

  .fix-l {
    display: inline-block;
    width: 120px;
    text-align: right;
  }

  .check {
    margin-left: 60px;
  }

  .xin {
    color: red;
  }
</style>

