<template>
  <div style="padding:0 16px;height:100%;">
    <el-row :gutter="20" style="height: 100%">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div style="width: 100%;margin: 10px 0;">
            <el-button icon="el-icon-plus" size="small" @click="addAuthority()">增加权限组</el-button> <!--dialogFormVisible-->
            <el-button type="primary" size="small" icon="el-icon-edit" @click="amendAuthority()">修改权限组</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteAuthority()">删除</el-button>
          </div>
          <el-table
            ref="box"
            id="fitTable"
            :data="tableData"
            highlight-current-row
            @current-change="clickCurrent"
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
              label="权限组名称">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="1" style="height:100%;">
        <div style="height:100%;margin:0 auto;width: 1px;background: #D4D4D4"></div>
      </el-col>
      <el-col :span="15" style="margin-top:10px;">
        <div class="grid-content bg-purple">
          <div class="line"></div>
          <tree-table highlight-current-row :data="dataOne" :evalFunc="func" :evalArgs="args" border>
            <!--<el-table-column label="程序代码" width="" align="center" prop="programCode"></el-table-column>-->
            <el-table-column label="操作权限" width="700" align="center">
              <template slot-scope="scope">
                <el-button type="text" v-for="item,index in  scope.row.operates" :key='index'>{{item.buttonName}}
                </el-button>
              </template>
            </el-table-column>
          </tree-table>
        </div>
        <!-- <div class="grid-content bg-purple">
           <tree-table :data="dataOne" :columns="columns" border></tree-table>
         </div>-->
      </el-col>
    </el-row>
    <!--增加权限组-->
    <div>
      <el-dialog title="增加权限组" :visible.sync="dialogFormVisible"
                 width="900px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <el-row>
            <div style="padding: 10px;">
              <el-col :span="8">
                <div class="demo-input-suffix">
                  权限组名
                  <el-input
                    v-model="addOP.privilegegroupName" style="width: 200px;">
                  </el-input>
                </div>
              </el-col>
            </div>
          </el-row>
          <div style="width: 100%;height: 1px;background: #ddd;margin-top: 10px;"></div>
          <el-row>
            <el-col :span="24">
              <div style="height: 500px;overflow-y: scroll">
                <tree-table :data="data1" :evalFunc="func" :evalArgs="args" border>
                  <el-table-column label="访问权限" width="150">
                    <template slot-scope="scope">
                      <el-checkbox v-if="scope.row.systemId != ''" v-model="scope.row.check"
                                   @change="checkState(scope.row)">
                        {{scope.row.privilegeName}}
                      </el-checkbox>
                      <span v-else>{{scope.row.privilegeName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作权限" width="530">
                    <template slot-scope="scope">
                      <el-checkbox v-for="item,index in  scope.row.operates" :key='index' @change="checkS(scope.row)"
                                   v-model="item.check">{{item.buttonName}}
                      </el-checkbox>
                    </template>
                  </el-table-column>
                </tree-table>
              </div>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer"
               style="height: 50px;background: #F3F3F3;line-height: 50px;text-align: center;">
            <el-button type="success" icon="el-icon-check" @click="updateAddData()">提 交</el-button>
            <el-button icon="el-icon-close" @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--修改权限组-->
    <div>
      <el-dialog title="修改权限组" :visible.sync="dialogFormV"
                 width="900px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <el-row>
            <div style="padding: 10px;">
              <el-col :span="8">
                <div class="demo-input-suffix">
                  权限组名
                  <el-input
                    v-model="amendD.privilegegroupName" style="width: 200px;">
                  </el-input>
                </div>
              </el-col>
            </div>
          </el-row>
          <div style="width: 100%;height: 1px;background: #ddd;margin-top: 10px;"></div>
          <el-row>
            <el-col :span="24">
              <div style="height: 500px;overflow-y: scroll">
                <tree-table :data="data2" :evalFunc="func" :evalArgs="args" border>
                  <el-table-column label="访问权限" width="150">
                    <template slot-scope="scope">
                      <el-checkbox v-if="scope.row.systemId != ''" v-model="scope.row.check"
                                   @change="checkState(scope.row)">
                        {{scope.row.privilegeName}}
                      </el-checkbox>
                      <span v-else>{{scope.row.privilegeName}}</span>
                      <!--<el-checkbox v-model="scope.row.check" @change="checkState(scope.row)">
                        {{scope.row.privilegeName}}
                      </el-checkbox>-->
                    </template>
                  </el-table-column>
                  <el-table-column label="操作权限" width="530">
                    <template slot-scope="scope">
                      <el-checkbox v-for="item,index in  scope.row.operates" :key='index' @change="checkS(scope.row)"
                                   v-model="item.check">{{item.buttonName}}
                      </el-checkbox>
                    </template>
                  </el-table-column>
                </tree-table>
              </div>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer"
               style="height: 50px;background: #F3F3F3;line-height: 50px;text-align: center;">
            <el-button type="success" icon="el-icon-check" @click="updateAmendData()">提 交</el-button>
            <el-button icon="el-icon-close" @click="dialogFormV = false">取 消</el-button>
          </div>
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
        version: '', // 版本号
        token: '', // token
        queryData: () => {
        },
        queryGroup: () => {
        },
        data2: [],
        data1: [],
        defaultProps: {
          children: 'nodes',
          label: 'privilegeName'
        },
        dialogFormVisible: false, // 增加
        dialogFormV: false, // 修改
        name: '',
        tableData: [],
        privilegegroupId: '',
        amendD: { // 修改数据的提交
          clToken: '',
          privilegegroupId: '',
          privilegegroupName: '',
          privilegeJson: []
        },
        addOP: {
          systemId: 0,
          privilegegroupName: '',
          clToken: '',
          privilegeJson: []
        },
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
        dataOne: [],
        arr1:[]
      }
    },
    methods: {
      checkS(row) {
        console.log(row)
        if (row.check == false) {
          for (var i = 0; i < row.operates.length; i++) {
            row.operates[i].check = false
          }
        }
      },
      // 访问权限的checkbox
      checkState(row) {
        console.log(row);
        if (row.check == false) {
          for (var i = 0; i < row.operates.length; i++) {
            row.operates[i].check = false
          }
        }
      },
      // 添加权限组的递归
      findchildnode(rootnode){
        for(var i=0;i<rootnode.length;i++){  //从节点中取出子节点依次遍历
          let a = {operateIds: [], privilegeId: ''}
          if(rootnode[i].check){
            a.privilegeId = rootnode[i].privilegeId
            console.log(rootnode[i].privilegeId);
            for(var j = 0;j<rootnode[i].operates.length;j++){
              if(rootnode[i].operates[j].check){
                a.operateIds.push({operateId: rootnode[i].operates[j].operateId})
                console.log(rootnode[i].operates[j].operateId);
              }
            }
            this.addOP.privilegeJson.push(a)
          }
          if(rootnode[i].nodes.length>0){  //判断子节点下是否存在子节点
            this.findchildnode(rootnode[i].nodes);    //如果存在子节点  递归
          }
        }
      },
      // 修改权限组的递归
      findchildNode(rootnode){
        for(var i=0;i<rootnode.length;i++){  //从节点中取出子节点依次遍历
          let a = {operateIds: [], privilegeId: ''}
          if(rootnode[i].check){
            a.privilegeId = rootnode[i].privilegeId
            console.log(rootnode[i].privilegeId);
            for(var j = 0;j<rootnode[i].operates.length;j++){
              if(rootnode[i].operates[j].check){
                a.operateIds.push({operateId: rootnode[i].operates[j].operateId})
                console.log(rootnode[i].operates[j].operateId);
              }
            }
            this.amendD.privilegeJson.push(a)
          }
          if(rootnode[i].nodes.length>0){  //判断子节点下是否存在子节点
            this.findchildNode(rootnode[i].nodes);    //如果存在子节点  递归
          }
        }
      },
      // 添加数据的提交
      updateAddData() {
        let self = this
        if (self.addOP.privilegegroupName.trim() == '') {
          self.$message({
            message: '权限组名不能为空',
            type: 'warning'
          })
          return false
        }
        self.addOP.clToken = self.token

        var roonodes = self.data1;   //获取主节点
        self.findchildnode(roonodes);  //开始递归
        self.addOP.privilegeJson = JSON.stringify(self.addOP.privilegeJson)
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeGroupService/add',
          data: self.addOP,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                message: '添加成功',
                type: 'success'
              });
              self.dialogFormVisible = false
              self.queryData() // 重新渲染页面
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
      // 修改数据的提交
      updateAmendData() {
        let self = this
        if (self.amendD.privilegegroupName.trim() == '') {
          self.$message({
            message: '权限组名不能为空',
            type: 'warning'
          })
          return false
        }
        //  存token
        self.amendD.clToken = self.token
        var roonodes = self.data2;   //获取主节点
        self.findchildNode(roonodes);  //开始递归
        self.amendD.privilegeJson = JSON.stringify(self.amendD.privilegeJson)
       /* // 选中的遍历出来
        for (var i = 0; i < self.data2.length; i++) {
          for (var j = 0; j < self.data2[i].nodes.length; j++) {
            // 定义结构
            let a = { privilegeId: '', operateIds: [] }
            if (self.data2[i].nodes[j].check == true) {
              a.privilegeId = self.data2[i].nodes[j].privilegeId
              // console.log(self.data2[i].nodes[j].check)
              for (var k = 0; k < self.data2[i].nodes[j].operates.length; k++) {
                if (self.data2[i].nodes[j].operates[k].check == true) {
                  a.operateIds.push({operateId: self.data2[i].nodes[j].operates[k].operateId})
                }
              }
              console.log(self.amendD.privilegeJson);
              console.log(typeof(self.amendD.privilegeJson));
              self.amendD.privilegeJson.push(a)
            }
          }
          self.amendD.privilegeJson = JSON.stringify(self.amendD.privilegeJson)
        }*/
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeGroupService/update',
          data: self.amendD,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                message: '修改成功',
                type: 'success'
              });
              self.privilegegroupId = '',
                self.dialogFormV = false
              self.queryGroup(self.privilegegroupId)

              //this.queryGroup(this.privilegegroupId)
              self.queryData() // 重新渲染页面
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
      // 删除权限组
      deleteAuthority() {
        let self = this
        self.$confirm('你确定要删除' + self.name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => { //PrivilegeGroupService/delete
          self.$axios({
            method: 'post',
            url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeGroupService/delete',
            data: {groupId: self.privilegegroupId, clToken: self.token},
            transformRequest: [function (data) {
              let newData = ''
              for (var k in data) {
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
              }
              return newData
            }]
          })
            .then(function (res) {
              if (res.data.code == 0) {
                self.data1 = res.data.result.nodes
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                self.queryData() // 调用权限组
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
      // 点击添加权限组
      addAuthority() {
        let self = this
        self.addOP.privilegeJson = []
        self.dialogFormVisible = true
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeService/getPrivilegeJson',
          data: {groupId:'', clToken: self.token},
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.data1 = res.data.result.nodes
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
      // 点击修改权限组
      amendAuthority() {
        let self = this
        self.amendD.privilegeJson = []
        if (self.privilegegroupId == '') {
          self.$message({
            message: '请选择要修改的权限',
            type: 'warning'
          });
          return false
        }
        self.dialogFormV = true;
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeService/getGroupCheckJson',
          data: {groupId: self.privilegegroupId, clToken: self.token},
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.data2 = res.data.result.nodes
            } else {
              console.log(5)
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      //  点击选择的行数触发
      clickCurrent(val) {
        console.log(val);
        let self = this
        self.amendD.privilegegroupName = val.privilegegroupName
        self.privilegegroupId = val.privilegegroupId
        self.amendD.privilegegroupId = val.privilegegroupId
        self.queryGroup(val.privilegegroupId)
      }
    },
    mounted() {
      // 右边显示的对应树
      this.queryGroup = (par) => {
        let self = this
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeService/getByGroup',
          data: {privilegeGroupId: par, clToken: self.token},
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.dataOne = res.data.result
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
          let self = this
          self.$axios({
            method: 'post',
            url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeGroupService/list',
            data: {clToken: self.token},
            transformRequest: [function (data) {
              let newData = ''
              for (var k in data) {
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
              }
              return newData
            }]
          })
            .then(function (res) {
              if (res.data.code == 0) {
                self.tableData = res.data.result
              } else {
                console.log(5)
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }
      this.queryGroup(this.privilegegroupId) // 调用组 => 右
      this.queryData() // 调用权限组
    },
    created() {
      if (localStorage.getItem('clToken')) {
        this.token = localStorage.getItem('clToken')
      }
      if (localStorage.getItem('version')) {
        this.version = localStorage.getItem('version')
      }
    }
  }
</script>
<style scoped>
</style>
