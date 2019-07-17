<!--贾南风 部门-->
<template>
  <div  id="department">
    <el-row>
      <el-col :span="24">
        <div class="col-nav">
          <ul>
            <li v-if="!isAdd && !!authorityCode.UPMS_DEPARTMENT_ADD" @click="addDepartment()"><span>新增部门</span></li>
            <li v-if="!isShow && !!authorityCode.UPMS_DEPARTMENT_AMEND" @click="amendNode()"><span>修改部门</span></li>
            <li v-if="!isShow && !!authorityCode.UPMS_DEPARTMENT_DEL" @click="delNode()"><span>删除部门</span></li>
          </ul>
        </div>
        <div class="grid-content bg-purple-light box-wrapper" style="overflow: auto">
          <el-tree :data="data" :props="defaultProps" :highlight-current="true" :default-expand-all="true" :style="'height:'+ table_h +'px;'" :expand-on-click-node="true" id="fitTable"
                   @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>
    </el-row>
    <!--添加部门弹层-->
    <div>
      <el-dialog v-dialogDrag
        title="添加部门"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="600px">
        <span>部门名称</span>
        <el-input v-model="addDep.departmentName" :maxlength="15" placeholder="请输入部门名称"
                  style="width: 300px;margin-left: 20px;"></el-input>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addName()">添 加</el-button>
  </span>
      </el-dialog>
    </div>
    <!--修改部门-->
    <div>
      <el-dialog v-dialogDrag
        title="修改部门"
        :close-on-click-modal="false"
        :visible.sync="dialogName"
        width="600px">
        <span>部门名称</span>
        <el-input v-model="addDep.departmentName" :maxlength="15" placeholder="请输入部门名称"
                  style="width: 300px;margin-left: 20px;"></el-input>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogName = false">取 消</el-button>
    <el-button type="primary" @click="amendAddName()">保 存</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default{
    data() {
      return {
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        version: '1.0.0', // 版本号
        queryData: () => {}, // 部门列表方法
        table_h: 0, // 高度
        dialogVisible: false, // 添加部门弹层
        dialogName: false, // 修改部门弹层
        isShow: false, // 判断当前显示
        isAdd: false, // 判断当前显示添加
        length: 0,  // 当前节点长度
        data: [], // tree数据
        departmentId: '', // 存储部门ID
        departmentName: '', // 存储部门名称
        companyId: '', // 普通用户的公司id
        departmentPid: '',// 父的Pid
        addDep: {   // 新增部门参数
          departmentCode: 0,
          departmentPid: '',
          departmentName: '',
          companyId: ''
        },
        totalPage: 20, // 要显示的条数
        currentPage: 1, // 页数
        totalNum: 0, // 总条数
        defaultProps: { // tree绑定的参数
          children: 'nodes',
          label: 'departmentName'
        }
      }
    },
    methods: {
      // 点击部门触发的方法
      handleNodeClick(data) {
        console.log(data);
        if(data.departmentId == 0){
          this.isShow = true;
        }else{
          this.isShow = false;
        }
        if(data.level == 5){ // 第五级不允许添加
          this.isAdd = true;
        }else{
          this.isAdd = false;
        }

        this.length = data.nodes.length;
        this.addDep.companyId = data.companyId;
        this.addDep.departmentPid = data.departmentId;
        this.departmentId = data.departmentId;
        this.departmentName = data.departmentName;
        this.departmentPid = data.departmentPid;
        // console.log(data);
      },
      // 点击添加部门
      addDepartment() {
        if(this.addDep.departmentPid == ''){
          this.$message({
            message: '请先选择上级部门',
            type: 'warning'
          });
          return false;
        }
        this.addDep.departmentName = '';
        this.dialogVisible = true;
      },
      // 修改部门里的保存
      amendAddName() {
        let self = this;
        if (self.addDep.departmentName == '') {
          self.$message({
            message: '部门名称不能为空',
            type: 'warning'
          });
          return false
        }
        self._post('com.edb01.upms.service.DepartmentService/'+ self.version +'/update',{departmentPid: self.departmentPid,companyId: self.addDep.companyId ,departmentId: self.departmentId, departmentName: self.addDep.departmentName})
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogName = false;
              self.$message({
                message: '修改部门成功',
                type: 'success'
              });
              self.queryData(self.addDep.companyId)
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
      // 点击修改部门
      amendNode() {
        if(this.isShow){
          return false;
        }
        if (this.departmentId == '') {
          return false
        }
        this.dialogName = true;
        this._post('com.edb01.upms.service.DepartmentService/'+ this.version +'/get',{departmentId: this.departmentId})
          .then(res =>{
            if (res.data.code == 0) {
              this.addDep.companyId = res.data.result.companyId;
              //this.addDep.departmentPid = res.data.result.departmentPid;
              this.departmentPid = res.data.result.departmentPid;
              this.addDep.departmentName = res.data.result.departmentName;
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 点击删除节点
      delNode() {
        let self = this;
        if(self.isShow){
          return false;
        }
        let title = '是否删除部门《' + self.departmentName + '》?';
        if(self.length > 0){
           title = '删除该部门时会删除其子部门！是否确定要删除?';
        }
        if (self.departmentId == '') {
          return false
        };
        self.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          self._post('com.edb01.upms.service.DepartmentService/'+ self.version +'/delete',{departmentId: self.departmentId})
            .then(function (res) {
              if (res.data.code == 0) {
                self.dialogVisible = false
                self.queryData(self.addDep.companyId);
                self.$message({
                  message: '删除部门成功',
                  type: 'success'
                });
              }else if(res.data.code == 12007){
                self.$message({
                  message: '请先删除该部门中所有员工，然后再删除该部门！',
                  type: 'warning'
                });
              }else{
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
      // 添加部门
      addName() {
        let self = this;
        if (self.addDep.departmentName.trim() == '') {
          self.$message({
            message: '部门名称不能为空',
            type: 'warning'
          });
          return false
        }
        self._post('com.edb01.upms.service.DepartmentService/'+ self.version +'/add',self.addDep)
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogVisible = false;
              self.queryData(self.addDep.companyId);
              self.departmentId = '';
              self.$message({
                message: '添加部门成功',
                type: 'success'
              });
            } else if(res.data.code == 12008) {
              self.$message({
                message: '在' + self.departmentName + '下已经存在' + self.addDep.departmentName + '子部门！',
                type: 'warning'
              });

            }else{
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
    },
    created() {
      var height = 0;
      // 动态获取表格高度
      this.$nextTick(function () {
        var a = document.body.clientHeight // 页面高度
        var b = document.getElementById('fitTable').offsetTop // 表格距离顶部的距离
        height = a - b-81;
        this.table_h = height
      })
    },
    mounted() {
      // 部门列表
      this.queryData = () => {
        let self = this;
        self._post('com.edb01.upms.service.DepartmentService/'+ self.version +'/getAll')
          .then(function (res) {
            if (res.data.code == 0) {
              self.data = [];
              var result = res.data.result;
              self.data.push(result);
              console.log(res.data.result);
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

      };
      this.queryData();
    },
  }
</script>
<style scoped>
  #department{
    border-left: 30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 15px solid #F0F1F5;
    padding: 15px 20px;
  }
  #department .box-wrapper{
    margin-top: 10px;
  }
</style>
<style>
  #department .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #C6DEF5;
  }
  #department .el-tree-node__label {
    font-size: 14px;
  }

  #department .el-icon-caret-right:before {
    font-size: 20px;
  }

  #department .el-icon-caret-right:before {
    margin-bottom: 10px;
  }
  #department .el-tree-node__expand-icon{
    color:#2196F3 !important;
  }
</style>
