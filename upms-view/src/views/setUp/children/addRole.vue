<!--添加角色 贾南风-->
<template>
  <div id="addRole">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;margin-bottom: 10px;">
        <el-breadcrumb-item :to="{path: '/role'}">角色</el-breadcrumb-item>
        <el-breadcrumb-item>添加角色</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-row>
        <div style="padding: 10px;">
          <el-col :span="8">
            <div class="demo-input-suffix">
              角色名称：
              <el-input
                v-model="addOP.privilegegroupName" style="width: 200px;" :maxlength="10" @keyup.native="addOP.privilegegroupName=addOP.privilegegroupName.replace(/[+%￥&]/g,'')" @focus="methodStyle" @blur="methodBlur" :class="{roleStyle: isShow}">
              </el-input>
              <span v-if="isKey" style="margin-left: 5px;color:#F56C6C;">请输入角色名称</span>
            </div>
          </el-col>
        </div>
      </el-row>
      <div style="width: 100%;height: 1px;background: #ddd;margin-top: 10px;"></div>
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <tree-table :data="data1" :evalFunc="func" :evalArgs="args" border id="fitTable1" :height="table_t">
              <el-table-column label="访问权限" min-width="200">
                <template slot-scope="scope" >
                  <el-checkbox v-if="scope.row.systemId != ''&& scope.row.nodes.length < 1" v-model="scope.row.check"
                               @change="checkState(scope.row)">
                    {{scope.row.privilegeName}}
                  </el-checkbox>
                  <span  v-else-if="scope.row.privilegePid != 'root'" style="color:#71AFF0;font-weight: bold;font-size: 14px;">{{scope.row.privilegeName}}</span>
                  <el-checkbox v-if="scope.row.systemId != ''&& scope.row.privilegePid == 'root'" v-model="scope.row.check"
                               @change="checkState(scope.row)">
                    {{scope.row.privilegeName}}
                  </el-checkbox>
                  <!--:indeterminate="isIndeterminate"-->
                  <!--<el-checkbox v-if="scope.row.systemId != '' && scope.row.nodes==0" v-model="scope.row.check"
                               @change="checkState(scope.row)">
                    {{scope.row.privilegeName}}
                  </el-checkbox>-->
                </template>
              </el-table-column>
              <el-table-column label="操作权限" min-width="500">
                <template slot-scope="scope">
                  <el-checkbox v-for="item,index in  scope.row.operates" :key="index" @change="checkS(scope.row)"
                               v-model="item.check">{{item.buttonName}}
                  </el-checkbox>
                </template>
              </el-table-column>
            </tree-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="width: 100%;text-align: center;margin-top: 20px;">
      <el-button icon="el-icon-close" @click="backPage">返回</el-button>
      <el-button type="primary" icon="el-icon-check" @click="updateAddData">添加</el-button>
    </div>
  </div>
</template>
<script>
  import treeTable from '../../../components/TreeTable/index.vue'
  import treeToArray from './customEval'

  export default {
    name: 'tree',
    components: {treeTable},
    data() {
      return {
        isShow: false,// 判读添加角色是否为空
        isKey: false,// 角色名称为空时显示的提示语
        //isIndeterminate: true,
        version: '1.0.0', // 版本号
        table_t: 0, // 高度
        data1: [], // nodes 数据接收
        addOP: { // 添加的参数
          systemId: 0,
          privilegegroupName: '',
          privilegeJson: []
        },
        func: treeToArray,
        args: [null, null, true, 'timeLine'],
      }
    },
    methods: {
      // 角色失去焦点时的验证
      methodStyle() {
        this.isShow = false;
        this.isKey = false;
      },
      // 角色失去焦点时的验证
      methodBlur() {
        if(this.addOP.privilegegroupName.trim() == ''){
          this.isKey = true;
          this.isShow = true;
        }
      },
      // 返回上一个页面（角色页面）
      backPage() {
        this.$router.push({path: '/role'})
      },
      // 如何访问权限为false，则操作权限都为false，不允许选择
      checkS(row) {
        if(row.check == true) {
          return false;
        }
        for (var item of row.operates){
           if(item.check == true) {
             row.check = true;
             break;
           }
        }
      },
      // 访问权限的checkbox如果为false,则操作权限都为false
      checkState(row) {
        //console.log(row.nodes);
        // 选中根节点切换checkbox的状态
        if(row.privilegePid == 'root') {
          if(row.check) {
            this.findChildCheck(row.nodes,true); // 调用递归方法
          }else{
            this.findChildCheck(row.nodes,false); // 调用递归方法
            this.operatingCheck(row.nodes,false); // 操作权限递归
          }
          return false
        }
          // this.findChildIsIndeterminate(this.data1)
        // 选中不是根节点时的状态
        if (row.check == false) {
          this.findChildCheck(row.nodes,false);
          for (var i = 0; i < row.operates.length; i++) {
            row.operates[i].check = false;
          }
          // 有一个不为true，则把全选取消
          for(var item of this.data1){
            item.check = false;
          }
        }else{
          this.findChildCheck(row.nodes,true)
        }
      },
      // 全选不选的递归
      findChildCheck(rootNode,bool){
        for(var i=0;i<rootNode.length;i++){  //从节点中取出子节点依次遍历
          rootNode[i].check = bool
          if(rootNode[i].nodes.length>0){  //判断子节点下是否存在子节点
            this.findChildCheck(rootNode[i].nodes,bool);    //如果存在子节点  递归
          }
        }
      },
      // 操作权限的递归 访问权限为false则操作权限为false
      operatingCheck(rootNode,bool) {
        if(!bool){
          for(var i=0;i<rootNode.length;i++){  //从节点中取出子节点依次遍历
            if(rootNode[i].operates.length>0){
              for(var item of rootNode[i].operates) {
                item.check = false
              }
            }
            if(rootNode[i].nodes.length>0){  //判断子节点下是否存在子节点
              this.operatingCheck(rootNode[i].nodes,bool);    //如果存在子节点  递归
            }
          }
        }
      },
      // 添加权限组的递归
      findchildnode(rootnode){
        for(var i=0;i<rootnode.length;i++){  //从节点中取出子节点依次遍历
          let a = {operateIds: [], privilegeId: ''};
          if(rootnode[i].check){
            a.privilegeId = rootnode[i].privilegeId;
            console.log(rootnode[i].privilegeId);
            for(var j = 0;j<rootnode[i].operates.length;j++){
              if(rootnode[i].operates[j].check){
                a.operateIds.push({operateId: rootnode[i].operates[j].operateId});
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
      // 添加数据的提交
      updateAddData() {
        let self = this
        if (self.addOP.privilegegroupName.trim() == '') {
          this.isShow = true;
          this.isKey = true;
         /* self.$message({
            message: '权限组名不能为空',
            type: 'warning'
          })*/
          return false
        }
        var roonodes = self.data1;   //获取主节点
        self.findchildnode(roonodes);  //开始递归
        self.addOP.privilegeJson = JSON.stringify(self.addOP.privilegeJson);
        self._post('com.edb01.upms.service.PrivilegeGroupService/'+ self.version +'/add',self.addOP)
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                message: '添加成功',
                type: 'success'
              });
              // 添加成功返回上一个页面（角色页面）
             self.backPage()
            } else {
              self.addOP.privilegeJson = JSON.parse(self.addOP.privilegeJson);
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
      this.$nextTick(function() { //  nextTick当DOM发生变化时实时执行回调
        var a = document.body.clientHeight;//  页面高度
        var c = document.getElementById('fitTable1').offsetTop;//  表格距离顶部的距离
        this.table_t = a - c - 200;//  表格高度
      });
      // 获取权限树的nodes
      let self = this;
      self.addOP.privilegeJson = [];
      self.dialogFormVisible = true;
      self._post('com.edb01.upms.service.PrivilegeService/'+ self.version +'/getPrivilegeJson')
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
    }
  }
</script>
<style scoped>
  .roleStyle{
    border:1px solid #F56C6C;
    border-radius: 5px;
  }
  #addRole{
    border-left: 30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 15px solid #F0F1F5;
    padding: 15px 20px;
  }
</style>
