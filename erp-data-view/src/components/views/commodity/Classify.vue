<!--分类  贾南风 -->
<template>
  <div id="classify">
    <div class="grid-content bg-purple">
      <div class="col-nav" style="margin:-10px 0 10px 0;">
        <ul>
          <li @click="publicLogBtn"><span>查看日志</span></li>
        </ul>
      </div>
    </div>
    <div class="grid-content bg-purple" id="grid">
      <tree-table highlight-current-row :data="dataOne" id="fitTable1" :height="table_t" :evalFunc="func" :evalArgs="args" border>
        <el-table-column label="操作" align="left" min-width="500">
          <template slot-scope="scope" >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              v-if="scope.row.catalogLevel!=5 && authorityCode.DATA_CLASSIFY_ADD"
              plain
              @click="add(scope.row)">添加</el-button>
            <el-button  v-if="scope.row.catalogLevel!=0 && authorityCode.DATA_CLASSIFY_AMEND"
                        size="mini"
                        type="text"
                        plain
                        @click="edit(scope.row)"
                        icon="el-icon-edit" >修改</el-button>
            <el-button
              size="mini"
              type="text"
              v-if="(scope.row.catalogLevel!=0)&&(typeof scope.row.nodes == 'undefined' || scope.row.nodes == null || scope.row.nodes == '') && authorityCode.DATA_CLASSIFY_DEL"
              plain
              icon="el-icon-delete"
              @click="deleteAuthority(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </tree-table>
    </div>
    <div>
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
    <div>
      <el-dialog v-dialogDrag
        :title="dialogTitle"
        :visible.sync="editDialogVisible"
        width="500px">
        <div >
          <el-form  style="margin-right: 50px" label-width="100px" class="demo-ruleForm">
            <el-form-item  label="分类名称：" prop="name">
              <el-input
                style="width:200px"
                :maxlength="10"
                ref="input"
                placeholder="最多10个字符"
                v-model="classifcationName">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
       <el-button @click="editDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="updateAddData">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import treeTable from '@/components/common/TreeTable/index.vue'
  import treeToArray from './customEval'
  import publicLog from '@/components/common/publicLog.vue';
  export default {
    name: 'tree',
    components: {treeTable,   'v-Publiclog': publicLog},
    data() {
      return {
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        version: '1.0.0', // 版本号
        table_h: 0, // 高度
        table_t: 0, // 高度
        queryData: () => {}, //版本号
        queryGroup: () => {}, //版本号
        // 查看日志
        billCode: '',
        pulicLogVisible: false,
        dialogTitle: "", // 修改title
        editDialogVisible: false,// 修改弹框
        isEdit: 0,// true  添加  false  编辑
        //treeData: '',
        classifcationName: '', // 分类名称
        // 分类字父ID
        sortId: '',
        sortParentid: '',
        //treeId: 30000,
        //data2: [],
        //data1: [],
        defaultProps: {
          children: 'nodes',
          label: 'sortName'
        },
        dialogFormVisible: false, // 增加
        dialogFormV: false, // 修改
        name: '',
        tableData: [],
        //privilegegroupId: '',
        //groupId: [],
        /*amendD: { // 修改数据的提交
          privilegegroupId: '',
          privilegegroupName: '',
          privilegeJson: []
        },*/
       /* addOP: {
          systemId: 0,
          privilegegroupName: '',
          privilegeJson: []
        },*/
        func: treeToArray,
        args: [null, null, true, 'timeLine'],
        columns: [
          {
            text: '权限树  ',
            value: 'privilegeName'
          },
          {
            text: '程序代码',
            value: 'programCode'
          },
          {
            text: '操作权限',
            vlue: 'buttonName'
          }
        ],
        dataOne: [],//表格树
        paramObj:{}//日志参数
      }
    },
    methods: {
      // 点击编辑子分类
      edit(row){
        //console.log(row);
        this.sortId = row.catalogId;
        this.sortParentid = row.catalogPid;
        this.editDialogVisible = true;
        this.isEdit = 3;
        this.classifcationName = row.privilegeName;
        this.dialogTitle = "修改分类";
      },
      // 点击添加子分类
      add(row) {
        if(row.catalogLevel > 4) {
          this.$message({
            message: '层级不能超过6级',
            type: 'warning'
          });
          return false
        }
        this.classifcationName = '';
        this.dialogTitle="添加子分类";
        this.sortId = row.catalogId;
        this.isEdit = 2;
        this.editDialogVisible = true;
        this.$nextTick(() => {
          this.$refs['input'].focus();
        })
      },
      // 添加/编辑数据的提交
      updateAddData() {
        let self = this;
        if (self.classifcationName == '') {
          self.$message({
            message: '分类名称不能为空',
            type: 'warning'
          });
          return false
        }
        // isEdit为2时添加操作
        if(self.isEdit == 2) {
          self._post('com.edb01.erp.mdata.service.api.DtCatalogService/'+ self.version + '/insert',{catalogName: self.classifcationName,catalogPid: self.sortId})
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({
                  message: '添加成功',
                  type: 'success'
                });
                self.editDialogVisible = false;
                self.queryGroup() // 重新渲染页面
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
        }
        // isEdit为3时修改操作
        if(self.isEdit == 3) {
          self._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + self.version + '/update',{catalogName: self.classifcationName, catalogId: self.sortId, catalogPid: self.sortParentid})
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({
                  message: '修改成功',
                  type: 'success'
                });
                self.editDialogVisible = false;
                self.queryGroup() // 重新渲染页面
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
            .catch(_ => {
              console.log('876434564')// 取消
            });
        }
      },
      // 删除商品
      deleteAuthority(row) {
        let self = this
        self.$confirm('你确定要删除分类' + row.privilegeName + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => { //PrivilegeGroupService/delete
          self._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + self.version + '/delete',{catalogId: row.catalogId,merchantId:0})
            .then(function (res) {
              if (res.data.code == 0) {
                self.queryGroup() // 调用权限组
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
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
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 38;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      // 查看日志的方法
      changDialogShow(){
        this.pulicLogVisible=false;
      }
    },
    mounted() {
      // 树列表数据请求
      this.queryGroup = () => {
        let self = this
        self._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/listTree')
          .then(function (res) {
            if (res.data.code == 0) {
              self.dataOne = res.data.result
            } else {
              self.$message({
                message: response.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
      this.queryGroup()
    },
    created() {
      this.$nextTick(function() { //  nextTick当DOM发生变化时实时执行回调
        var a = document.body.clientHeight;//  页面高度
        var c = document.getElementById('fitTable1').offsetTop;//  表格距离顶部的距离
        this.table_t = a - c - 70;//  表格高度
      })
    }
  }
</script>

