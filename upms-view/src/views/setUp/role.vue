<!--贾南风 角色-->
<template>
  <div id="role">
    <el-row :gutter="20" style="height: 100%">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div class="col-nav" style="margin:0 0 10px 0;">
            <ul>
              <li @click="addAuthority" v-if="!!authorityCode.UPMS_ROLE_ADD"><span>添加</span></li>
              <li @click="amendAuthority" v-if="isShow && !!authorityCode.UPMS_ROLE_AMEND"><span>修改</span></li>
            </ul>
          </div>
          <el-table
            ref="tableBox"
            id="fitTable"
            :height="table_h"
            highlight-current-row
            @current-change="clickCurrent"
            :data="tableData"
            border>
            <el-table-column
              align="center"
              type="index"
              width="60"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="privilegegroupName"
              align="center"
              label="角色名称">
            </el-table-column>
            <el-table-column
              align="center"
              width="100"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" style="width: 20px" >查看</el-button><!--@click="queryGroup(scope.row.privilegegroupId)"-->
                <el-button v-if="scope.$index != 0 && !!authorityCode.UPMS_ROLE_DEL" type="text" size="small"  style="color: red;width:20px" @click="deleteAuthority(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="1" style="height:100%;">
        <div style="height:100%;margin:0 auto;width: 1px;background: #D4D4D4"></div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <tree-table highlight-current-row :data="dataOne" id="fitTable1" :height="table_t" :evalFunc="func" :evalArgs="args" border>
            <el-table-column label="页面" min-width="100" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.privilegeName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作权限" min-width="450" align="center">
              <template slot-scope="scope">
                <span v-for="item,index in  scope.row.operates" :key='index' style="margin-right: 10px" >{{item.buttonName}}</span>
              </template>
            </el-table-column>
          </tree-table>
        </div>
      </el-col>
    </el-row>
    <!--删除角色提示-->
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="400px">
        <span style="font-size: 14px">《{{name}}》角色已被使用，删除后相关账号将无法使用该角色！”，确认则删除角色、同时删除账号与该角色对应关系！</span>
        <div style="width: 100%;text-align: center;margin-top: 20px">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteRole(true)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import treeTable from '../../components/TreeTable/index.vue'
  import treeToArray from './customEval'
  export default {
    name: 'tree',
    components: {treeTable},
    data() {
      return {
        dialogVisible: false, //删除角色提示
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        version: '1.0.0', // 版本号
        table_h: 0, //高度
        table_t: 0, //高度
        queryData: () => {}, // 权限组方法
        queryGroup: () => {}, // 右边数据方法
        isShow: true, // 系统管理员不可修改
        data2: [],
        data1: [],
        name: '',
        tableData: [], // 表格数据
        privilegegroupId: '', // 保存修改的权限
        groupId: [], //  保存行的数据
        amendD: { // 修改数据的提交
          privilegegroupId: '',
          privilegegroupName: '',
          privilegeJson: []
        },
        func: treeToArray,
        args: [null, null, true, 'timeLine'],
        dataOne: [], // 权限组接受
      }
    },
    methods: {
      // 删除权限组
      deleteAuthority(row) {
        let self = this;
        self.name = row.privilegegroupName;
        self.$confirm('你确定要删除' + self.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => { //PrivilegeGroupService/delete
          self.deleteRole(false)
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteRole(bool) {
        this._post('com.edb01.upms.service.PrivilegeGroupService/'+ this.version +'/delete',{groupId: this.privilegegroupId,isCoerce: bool})
          .then(  (res) => {
            if(res.data.success == true){
              if (res.data.code == 0) {
                this.data1 = res.data.result.nodes;
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.dialogVisible = false;
                this.queryData() // 调用权限组
              }else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            }else{
            if(res.data.code == 91000013){
               this.dialogVisible = true;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
            }

          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 点击添加权限组
      addAuthority() {
        this.$router.push({ name:'addRole'});
      },
      // 点击修改权限组
      amendAuthority() {
        this.amendD.privilegeJson = []
        if (this.privilegegroupId == '') {
          this.$message({
            message: '请选择要修改的权限',
            type: 'warning'
          });
          return false;
        }
        this.$router.push({ name:'amendRole',params:{ privilegegroupName: this.groupId.privilegegroupName, privilegegroupId:this.groupId.privilegegroupId}});
      },
      //  点击选择的行数触发
      clickCurrent(val) {
        console.log(val);
        let self = this;
        self.groupId = val;
        self.amendD.privilegegroupName = val.privilegegroupName;
        self.privilegegroupId = val.privilegegroupId;
        self.amendD.privilegegroupId = val.privilegegroupId;
        self.queryGroup(val.privilegegroupId);
        for (var i = 0; i < this.tableData.length; i++) {
          if( i == 0 ){
            if(this.tableData[i].privilegegroupId == val.privilegegroupId){
              this.isShow = false;
              return false;
            }
          }
        }
        this.isShow = true;
      }
    },
    mounted() {
      // 右边显示的对应树
      this.queryGroup = (par) => {
        let self = this;
        self._post('com.edb01.upms.service.PrivilegeService/'+ self.version +'/getByGroup',{privilegeGroupId: par})
          .then(function (res) {
            if (res.data.code == 0) {
              self.dataOne = res.data.result.nodes;
            } else {
              console.log(5)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
        // 左边显示权限组
        this.queryData = () => {
          let self = this;
          self._post('com.edb01.upms.service.PrivilegeGroupService/'+ self.version+'/list')
            .then(function (res) {
              if (res.data.code == 0) {
                self.tableData = res.data.result;
                self.queryGroup(self.tableData[0].privilegegroupId); //页面一开始显示第一个管理员的信息
                // 页面一开始表格第一个为选中状态
                self.$nextTick(function(){
                  self.$refs.tableBox.setCurrentRow(self.tableData[0]);
                })
              } else {
                console.log(5)
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }
      this.queryData() // 调用权限组
    },
    created() {
      this.$nextTick(function() { //  nextTick当DOM发生变化时实时执行回调
        var a = document.body.clientHeight;//  页面高度
        var b = document.getElementById('fitTable').offsetTop;//  表格距离顶部的距离
        var c = document.getElementById('fitTable1').offsetTop;//  表格距离顶部的距离
        this.table_h = a - b - 80;//  表格高度
        this.table_t = a - c - 80;//  表格高度
      })
    }
  }
</script>
<style scoped>
  #role{
    border-left: 30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 15px solid #F0F1F5;
    padding: 15px 20px;
  }
</style>
<style>
 /* #role .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #C6DEF5;
  }*/
  #role .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, .el-table__body tr.current-row>td, .el-table__body tr.hover-row.current-row>td, .el-table__body tr.hover-row.el-table__row--striped.current-row>td, .el-table__body tr.hover-row.el-table__row--striped>td, .el-table__body tr.hover-row>td {
    background-color: #D1E3F5;
  }
</style>
<!--鼠标上浮显示大图-->
<!--<template>
  <div style="width:1000px;height:1000px;text-align: center;line-height: 1000px;">
    <el-popover
      placement="top"
      width="160"
      trigger="hover"
      v-model="visible2">
      <div style="width: 300px;height: 300px;">
        <img style="width: 100%;height: 100%" alt="" src="./img.jpg"/>
      </div>
      <el-button slot="reference">删除</el-button>
    </el-popover>
    <el-popover
      placement="top"
      width="160"
      trigger="hover"
      v-model="visible1">
      <div style="width: 300px;height: 300px;">
        <img style="width: 100%;height: 100%" alt="" src="./img.jpg"/>
      </div>
      <el-button slot="reference">删除</el-button>
    </el-popover>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        visible2: false,
        visible1: false,
      };
    }
  }
</script>
<style scoped>

</style>-->
