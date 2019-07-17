<!--品牌  贾南风-->
<template>
  <div id="brand">
    <div>
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
    <div>
      <div id="searchBox">
        <div class="leftBox1">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <div><el-input v-model="input" placeholder="请输入品牌进行查询"   @keyup.enter.native="searchBranMain"></el-input></div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox1">
          <el-button type="primary" @click.native.prevent="searchBranMain">查询</el-button>
        </div>
      </div>
      <el-row class="row-margin" :gutter="100" >
        <el-col :span="24">
          <div  class="col-nav">
            <ul>
              <li @click="addBrand()" v-if="authorityCode.DATA_BRAND_ADD"><span>新增</span></li>
              <li @click="publicLogBtn"><span>查看日志</span></li>
            </ul>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-margin" :gutter="100" >
        <el-col    class="row-margin"    >
          <el-table
            class="col-border"
            tooltip-effect="dark"
            style="margin-top: 20px"
            :height="t_height"
            :data="brandTable"
            border
          >
            <el-table-column
              prop="index"
              label="序号"
              type="index"
            >
            </el-table-column>
            <el-table-column
              prop="brandName"
              :show-overflow-tooltip="true"
              label="品牌"
              align:left
            >
            </el-table-column>
            <el-table-column
              prop="brandShortName"
              :show-overflow-tooltip="true"
              label="简称"
            >
            </el-table-column>
            <el-table-column
              prop="brandDescribe"
              :show-overflow-tooltip="true"
              label="说明"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              align="center" width="200"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  v-if="authorityCode.DATA_BRAND_AMEND"
                  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                <el-button
                  size="mini"
                  type="text"
                  v-if="authorityCode.DATA_BRAND_DEL"
                  style="color:red;"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row  class="row-margin"  >
        <div class="col-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[15,30,50,100,200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalDatas">
          </el-pagination>
        </div>
      </el-row>
    </div>
    <!--添加品牌-------------------------------------------------------添加品牌------------------------------------------------------->
    <div    class="dialogDiv">
      <el-dialog v-dialogDrag
        :title='dialogBrandTitle'
        :visible.sync="dialogAddBrandVisible"
        width="600px"
        :before-close="closeDialog"
      >
        <el-form :model="brandForm"   ref="brandForm"  style="margin-left: -6px;margin-top: -14px;margin-bottom: -3px"  :rules="rules" >
          <el-form-item   class="formItem"   label="品牌：" :label-width="formLabelWidth"  prop="brandName">
            <el-input   :maxlength="20"  placeholder="最多输入20个汉字" ref="oneBrand"  v-model="brandForm.brandName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item    class="formItem"   label="简称：" :label-width="formLabelWidth" >
            <el-input  :maxlength="10"  placeholder="最多输入10个汉字"  v-model="brandForm.brandShortName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item   class="formItem"   label="说明：" :label-width="formLabelWidth"  >
            <el-input
              v-model="brandForm.brandDescribe"
              :maxlength="100"
              type="textarea"
              :rows="10"
              placeholder="最多输入100个汉字"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="resetForm('brandForm')">取 消</el-button>
          <el-button @click="clickConfirm('brandForm')">确 定</el-button>
          <el-button type="primary" @click="clickConfirmAndContinue('brandForm')">确定并继续</el-button>
        </div>
      </el-dialog>
    </div>
    <!--编辑品牌-------------------------------------------------------编辑品牌------------------------------------------------------->
    <div    class="dialogDiv">
      <el-dialog v-dialogDrag
        :title='dialogBrandTitle'
        :visible.sync="dialogEditBrandVisible"
        width="590px"
        :before-close="closeDialog"
      >
        <el-form :model="brandForm"   ref="brandForm"   style="margin-left: -6px;margin-top: -14px;margin-bottom: -3px"  :rules="rules" >
          <el-form-item   class="formItem"   label="品牌：" :label-width="formLabelWidth"  prop="brandName">
            <el-input   :maxlength="20"  placeholder="最多输入20个汉字"  v-model="brandForm.brandName" ></el-input><!--auto-complete="off"-->
          </el-form-item>
          <el-form-item    class="formItem"   label="简称：" :label-width="formLabelWidth" >
            <el-input  :maxlength="10"  placeholder="最多输入10个汉字"  v-model="brandForm.brandShortName" ></el-input>
          </el-form-item>
          <el-form-item   class="formItem"   label="说明：" :label-width="formLabelWidth"  >
            <el-input
              v-model="brandForm.brandDescribe"
              :maxlength="100"
              type="textarea"
              :rows="10"
              placeholder="最多输入100个汉字"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="resetForm('brandForm')">取 消</el-button>
          <el-button type="primary"  @click="clickConfirm('brandForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import publicLog from '@/components/common/publicLog.vue';
  export default {
    components: {
      'v-Publiclog': publicLog
    },
    name: "brand-main",
    data() {
      return {
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        version:'1.0.0',//版本号
        repetition: false,// 防止重复点击
        // 日志参数
        billTypeid:9,
        billCode:'',
        pulicLogVisible:false,
        t_height:0, //高度
        //textarea: '',
        input: '',// 品牌
        // 分页
        currentPage: 1,
        pageSize: 15,
        totalDatas: 1,
        dialogAddBrandVisible: false, // 添加品牌
        dialogEditBrandVisible:false,// 编辑品牌
        dialogBrandTitle: '',// 编辑title
        isAddOrEdit: true, // true 添加   false 编辑
        isContinueAdd: false, //  true是  false否  继续添加
        brandForm: {
          brandName: '',//品牌名称
          brandShortName: '',//品牌简称
          brandId: '', //品牌Id
          brandDescribe: '' //备注
        },
        row:'',
        formLabelWidth: '80px',// 样式宽度
        brandTable: [], // 数据接收
        rules: { // 表单验证
          brandName: [
            { required: true, message: '请输入品牌', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
          ]
        },
        paramObj:{},
      }
    },
    methods: {
      // 查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 23;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      // 查看日志
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      getList(){
        var self = this;
        var    fetchParam = {
          'brandName': self.input,
          'page': self.currentPage,
          'size': this.pageSize
        };
        self._post('com.edb01.erp.mdata.service.api.BrandService/' + self.version + '/query',fetchParam).then(response =>{
          if(response.data.success){
            self.brandTable=response.data.result.rows;
            self.totalDatas=response.data.result.total;
          }else {
            self.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      // 查询
      searchBranMain(){
        this.getList();
      },
      // 修改
      handleEdit(index, row) {
        console.log(row);
        /*this.row=row;
        console.log(JSON.stringify(this.row));*/
        this.clearBrandForm();
        this.isAddOrEdit = false ; // true 添加   false 编辑
        this.dialogBrandTitle='编辑品牌';
        this.dialogEditBrandVisible=true;
        this.$nextTick(()=> {
          this.$refs['brandForm'].resetFields()
          this.brandForm.brandName = row.brandName;
          this.brandForm.brandShortName =  row.brandShortName;
          this.brandForm.brandDescribe = row.brandDescribe;
          this.brandForm.brandId = row.brandId;
        })


      },
      // 删除
      handleDelete(index, row) {
        var self=this;
        this.$confirm('确认删除这个品牌?', '提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          center:true
        }).then(_ => {
          self._post('com.edb01.erp.mdata.service.api.BrandService/' + self.version + '/delete',{brandId: row.brandId,merchantId: 0}).then(response =>{
            if (response.data.success){
              this.getList();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          });
        })
          .catch( (err) => {
            console.log(err);
          });
      },
      // 每页多少条
      handleSizeChange(val) {
        this.pageSize=val;
        this.getList();
      },
      // 当前多少页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage=val;
        this.getList();
      },
      // 新增品牌
      addBrand(){
        this.dialogBrandTitle='新增品牌';
        this.dialogAddBrandVisible = true;
        this.isAddOrEdit = true; // true 添加   false 编辑
        this.clearBrandForm();
        // this.$refs[formName].resetFields();
        this.$nextTick(()=> {
          this.$refs['brandForm'].resetFields();
          this.$refs.oneBrand.focus();
        })
      },
      // 编辑的提交
      clickConfirm(formName){
        var self = this;
        self.isContinueAdd=false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 添加
            if (self.isAddOrEdit){
              this.addRequest();
              // 编辑
            }else {
              self._post('com.edb01.erp.mdata.service.api.BrandService/' + self.version + '/update',self.brandForm).then(response =>{
                // alert(JSON.stringify(response))
                if (response.data.success){
                  self.clearBrandForm();
                  self.getList();
                  this.dialogEditBrandVisible=false;
                  this.$message({
                    message: "修改成功",
                    type: 'success'
                  });
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              });
            }
          } else {
            console.log('error submit!!');
            return true;
          }
        });
      },
      // 添加的继续
      clickConfirmAndContinue(formName){
        var self=this;
        this.isContinueAdd = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 添加
            if (this.isAddOrEdit){
              this.addRequest();
              // 编辑
            }else {

            }
          } else {
            console.log('error submit!!');
            return true;
          }
        });
      },
      // 添加的接口
      addRequest(){
        var self=this;
        if(self.repetition == true){ // 防止重复点击
          return false;
        }
        this.repetition = true;
        self._post('com.edb01.erp.mdata.service.api.BrandService/' + self.version + '/insert',self.brandForm).then(response =>{
          // alert(JSON.stringify(response))
          if (response.data.success){
            self.repetition = false;
            self.dialogAddBrandVisible = false;
            // alert("self.isContinueAdd="+self.isContinueAdd);
            if (self.isContinueAdd){ // 继续添加
              self.dialogAddBrandVisible = true;
              self.clearBrandForm();
              self.getList();
            } else {
              self.dialogAddBrandVisible = false;
              self.clearBrandForm();
              self.getList();
            }
            this.$message({
              message: "添加成功",
              type: 'success'
            });
          } else {
            self.repetition = false;
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });

          }
        });
      },
     /* changDialogShow(){
        this.pulicLogVisible=false;
      },*/
     // 重置
      clearBrandForm(){
        this.brandForm.brandName = '';
        this.brandForm.brandShortName = '';
        this.brandForm.brandId =  '';
        this.brandForm.brandDescribe = '';
      },
      // 取消
      resetForm(formName){
        var self=this;
        self.dialogAddBrandVisible=false;
        self.dialogEditBrandVisible=false;
        if(self.$refs[formName]!=undefined){
          self.$refs[formName].resetFields();
        }
      },
      // 弹框关闭之后
      closeDialog(){
        var self=this;
        self.dialogAddBrandVisible=false;
        self.dialogEditBrandVisible=false;
      }
    },
    created() {
    },
    mounted(){
      this.getList();
      this.$nextTick(function () {
        this.t_height=$(window).height()-$('.col-border').offset().top-75;
      })
    },
  }
</script>
<style scoped>
  .row-margin{
    /*margin-top:20px;*/
  }
  .formItem{
    margin-top:30px;
    width: 500px;
  }
  .dialogDiv .el-dialog__body {
    padding: 15px 30px !important;
  }
</style>
<style>
  #brand .el-dialog__body {
    padding: 0 0;
  }
</style>
