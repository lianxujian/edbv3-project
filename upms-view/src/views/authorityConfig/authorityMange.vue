<!--权限配置 贾南风-->
<template>
  <div style="min-width: 1200px" id="authorityMange">
    <div > <!--class="app-container"-->
      <!--<div class="line"></div>-->
      <tree-table highlight-current-row tooltip-effect="dark"   :data="tableData" :evalFunc="func" :evalArgs="args" border id="tree-box" :height="table_h">
        <el-table-column label="权限树操作"  align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="amendAuthority(scope.row)"><i :class="scope.row.icon"></i>&nbsp;{{scope.row.privilegeName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="程序代码" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.programCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作权限" align="center" width="400">
          <template slot-scope="scope">
            <span v-for="item,index in  scope.row.operates" style="margin-right: 8px;display:inline-block;"><el-button type="text" size="mini"  @click="amendOperation(scope.row,scope.row.operates,index)">{{item.buttonName}}</el-button>
            <i class="el-icon-error" style="color: #F56C6C;font-size: 16px;cursor: pointer;float:right;margin-top:3px;" @click="delOperates(scope.row,scope.row.operates,index)"></i></span>
          </template>
        </el-table-column>
        <el-table-column label="移动" align="center" width="70">
          <template slot-scope="scope">
            <i class="el-icon-upload2" style="color:#30A0F6;cursor: pointer;font-size: 20px;margin-right: 5px;font-weight: bold" @click="clickUp(scope.row)"></i>
            <i class="el-icon-download" style="color:#FFAE3D;cursor: pointer;font-size: 20px;font-weight: bold" @click="clickDown(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button  type="primary" plain  size="mini" @click="addSon(scope.row)" style="padding-left: 7px;">添加访问子权限</el-button>
            <el-button type="success" plain size="mini" v-if="scope.row.type != 'root'" @click="addOperate(scope.row)">添加操作权限</el-button>
            <el-button type="danger" plain size="mini" v-if="scope.row.type != 'root'" @click="deleteNode(scope.row)" style="width: 36px;padding-left: 5px;">删除</el-button>
          </template>
        </el-table-column>
      </tree-table>
    </div>
    <!--修改操作权限-->
    <div>
      <el-dialog v-dialogDrag title="修改操作权限" :visible.sync="amendDialog"
                  width="800px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <div
            style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
            权限基础信息
          </div>
          <el-form >
            <el-form-item label="权限名称" :label-width="formLabelWidth" style="margin-bottom: 16px">
              <el-input v-model="amendData.operateName" auto-complete="off" style="width:520px;"></el-input>
            </el-form-item>
            <el-form-item label="按钮名称" :label-width="formLabelWidth" style="margin-bottom: 16px">
              <el-input v-model="amendData.buttonName" auto-complete="off" style="width:520px;"></el-input>
            </el-form-item>
            <el-form-item label="按钮Code" :label-width="formLabelWidth" style="margin-bottom: 16px">
              <el-input v-model="amendData.operateCode" auto-complete="off" style="width:520px;"></el-input>
            </el-form-item>
            <div
              style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
              部署信息
            </div>
            <div>
              <div>
                <el-button style="margin:0 0 5px 10px;" size="small" type="primary"><i class="el-icon-plus" style="" @click="amendBtn()"></i> 添加</el-button>
                <el-dialog v-dialogDrag
                  width="600px"
                  title="添加接口名称"
                  :visible.sync="innerVisible1"
                  append-to-body>
                  接口名称：
                  <el-input style="width: 160px;" v-model="interfaceName">
                  </el-input>
                  方法名称：
                  <el-input style="width: 160px;" v-model="methodName">
                  </el-input>
                  <el-button type="success" @click="amendAdd()">添加</el-button>
                </el-dialog>
              </div>
              <div>
                <el-table
                  :data="amendData.interfaces"
                  :height="200"
                  width="300px">
                  <el-table-column
                    align="center"
                    prop="interfaceName"
                    label="接口名称">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="methodName"
                    label="方法名称">
                  </el-table-column>
                  <el-table-column
                    width="120"
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button  size="small" style="cursor: pointer;" @click="deleteData(scope.$index,amendData.interfaces)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer"
               style="height: 50px;background: #F3F3F3;line-height: 50px;text-align: center;box-shadow: 0 -1px 6px #999">
            <el-button type="success" icon="el-icon-check" @click="saveAmendData()">保 存</el-button>
            <el-button @click="amendDialog = false" icon="el-icon-close">取 消</el-button>
          </div>
        </div>
      </el-dialog>

    </div>
    <!--添加操作权限-->
    <div>
      <el-dialog v-dialogDrag title="添加操作权限" :visible.sync="dialogForm"
                  width="800px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <div
            style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
            权限基础信息
          </div>
          <el-form >
            <el-form-item label="权限名称" :label-width="formLabelWidth" style="margin-bottom: 16px">
              <el-input v-model="operation.operateName" auto-complete="off" style="width:520px;"></el-input>
            </el-form-item>
            <el-form-item label="按钮名称" :label-width="formLabelWidth" style="margin-bottom: 16px">
              <el-input v-model="operation.buttonName" auto-complete="off" style="width:520px;"></el-input>
            </el-form-item>
            <el-form-item label="按钮Code" :label-width="formLabelWidth" style="margin-bottom: 16px">
              <el-input v-model="operation.operateCode" auto-complete="off" style="width:520px;"></el-input>
            </el-form-item>
            <div
              style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
              部署信息
            </div>
            <div>
              <div>
                <el-button  @click="addBtn()" style="margin:0 0 5px 10px;" size="small" type="primary"><i class="el-icon-plus"></i>添 加</el-button>
                <el-dialog v-dialogDrag
                  width="600px"
                  title="添加接口名称"
                  :visible.sync="innerVisible"
                  append-to-body>
                  接口名称：
                  <el-input style="width: 160px;" v-model="interfaceName">
                  </el-input>
                  方法名称：
                  <el-input style="width: 160px;" v-model="methodName">
                  </el-input>
                  <div style="width: 100%;text-align: right;margin: 15px 0 0 0">
                  <el-button type="success" @click="addName()">添加</el-button>
                  </div>
                </el-dialog>
              </div>
              <div>
                <el-table
                  :data="tableData1"
                  :height="200"
                  width="300px">
                  <el-table-column
                    align="center"
                    prop="interfaceName"
                    label="接口名称">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="methodName"
                    label="方法名称">
                  </el-table-column>
                  <el-table-column
                    width="180"
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button  size="small" style="cursor: pointer;" @click="deleteData(scope.$index,tableData1)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer"
               style="height: 50px;background: #F3F3F3;line-height: 50px;text-align: center;box-shadow: 0 -1px 6px #999">
            <el-button type="success" icon="el-icon-check" @click="addOperationData()">提 交</el-button>
            <el-button @click="dialogForm = false" icon="el-icon-close">取 消</el-button>
          </div>
        </div>
      </el-dialog>

    </div>
    <!--添加访问子权限-->
    <div>
      <el-dialog v-dialogDrag title="添加访问权限" :visible.sync="dialogFormVisible"
                  width="800px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <div
            style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
            权限基础信息
          </div>
          <el-form :model="form">
            <el-row>
              <el-col :span="11">
                <div>
                <el-form-item label="权限名称"  :label-width="formLabelWidth" style="display: inline-block">
                  <el-input v-model="form.privilegeName" auto-complete="off"></el-input>
                </el-form-item>
              </div></el-col>
              <el-col :span="11">
                <div>
                <el-form-item label="权限图标" :label-width="formLabelWidth" >
                  <el-input v-model="form.icon" auto-complete="off"></el-input>
                </el-form-item>
              </div></el-col>
            </el-row>
            <el-form-item label="程序代码" :label-width="formLabelWidth">
              <el-input v-model="form.programCode" auto-complete="off" style="width:520px;"></el-input>
            </el-form-item>
            <div
              style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
              部署信息
            </div>
            <div style="margin-bottom: 200px;padding-left: 50px;">
              <div style="display: inline-block" >所属应用系统:E店宝</div>
              <div style="display: inline-block;margin-left: 80px;">
                <el-form-item label="所属应用" :label-width="formLabelWidth">
                  <el-select v-model="form.appId" placeholder="请选择所属应用" style="width: 280px;height: 10px;">
                    <el-option
                      v-for="item in state"
                      :key="item.appName"
                      :label="item.appName"
                      :value="item.appId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer"
               style="height: 50px;background: #F3F3F3;line-height: 50px;text-align: center;box-shadow: 0 -1px 6px #999">
            <el-button type="success" icon="el-icon-check" @click="addLimits()">提 交</el-button>
            <el-button @click="dialogFormVisible = false" icon="el-icon-close">取 消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--修改访问权限-->
    <div>
      <el-dialog v-dialogDrag title="修改访问权限" :visible.sync="dialogS"
                  width="800px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <div
            style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
            权限基础信息
          </div>
          <el-form >
            <el-row>
              <el-col :span="11"><div >
                <el-form-item label="权限名称" :label-width="formLabelWidth" style="display: inline-block">
                  <el-input v-model="amendForm.privilegeName" auto-complete="off"></el-input>
                </el-form-item>
              </div></el-col>
              <el-col :span="11"><div >
                <el-form-item label="权限图标" :label-width="formLabelWidth" >
                  <el-input v-model="amendForm.icon" auto-complete="off"></el-input>
                </el-form-item>
              </div></el-col>
            </el-row>
            <el-form-item label="程序代码" :label-width="formLabelWidth">
              <el-input v-model="amendForm.programCode" auto-complete="off" style="width:520px;"></el-input>
            </el-form-item>
            <div
              style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
              部署信息
            </div>
            <div style="margin-bottom: 200px;padding-left: 50px;">
              <div style="display: inline-block" >所属应用系统：E店宝V3</div>
              <div style="display: inline-block;margin-left: 80px;">
                <el-form-item label="所属应用" :label-width="formLabelWidth">
                  <el-select v-model="amendForm.appId" placeholder="请选择所属应用" style="width: 256px;height: 10px;">
                    <el-option
                      v-for="item in state"
                      :key="item.appName"
                      :label="item.appName"
                      :value="item.appId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer"
               style="height: 50px;background: #F3F3F3;line-height: 50px;text-align: center;box-shadow: 0 -1px 6px #999">
            <el-button type="success" icon="el-icon-check" @click="addAmendAuthority()">提 交</el-button>
            <el-button @click="dialogS = false" icon="el-icon-close">取 消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--修改系统节点-->
    <div>
      <el-dialog v-dialogDrag title="编辑应用系统" :visible.sync="dialogSystem"
                  width="900px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <div
            style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
            应用系统信息
          </div>
          <el-form>
            <el-row :gutter="20">
              <el-col :span="11"><div class="grid-content bg-purple">
                <el-form-item label="系统名称" :label-width="formLabelWidth">
                  <el-input v-model="applyData.systemName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="系统图标" :label-width="formLabelWidth">
                  <el-input v-model="applyData.icon" auto-complete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="所属样式组" :label-width="formLabelWidth">
                  <el-input v-model="applyData.programCode" auto-complete="off"></el-input>
                </el-form-item>-->
              </div></el-col>
              <el-col :span="11"><div class="grid-content bg-purple">
                <!--<el-form-item label="系统编码" :label-width="formLabelWidth">
                  <el-input v-model="applyData.programCode" auto-complete="off"></el-input>
                </el-form-item>-->
                <el-form-item label="系统颜色" :label-width="formLabelWidth">
                  <el-input v-model="applyData.color" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              </el-col>
            </el-row>
            <div
              style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
              应用部署信息
            </div>
            <div >
              <div>
                <el-button style="margin-left:10px;" size="small" type="primary" @click="addSystem()"><i class="el-icon-plus" style="font-weight:bold"></i> 添加</el-button>
                <div>
                  <el-table
                    :height="300"
                    :data="tableDataS"
                    @current-change="changeCurrent"
                    width="300px">
                    <el-table-column
                      align="center"
                      label="应用名称">
                      <template slot-scope="scope">
                        <el-input class="edit-input" size="small" v-model="scope.row.appName"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="应用服务名">
                      <template slot-scope="scope">
                        <el-input class="edit-input" size="small" v-model="scope.row.appServerName"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="端口号">
                      <template slot-scope="scope">
                        <el-input class="edit-input" size="small" v-model="scope.row.port"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      width="180"
                      align="center"
                      label="操作">
                      <template slot-scope="scope">
                        <i class="el-icon-circle-close" style="font-size: 26px;color: red;cursor: pointer;line-height: 32px" @click="delSystem(scope.$index,tableDataS,scope.row)"></i>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer"
               style="height: 50px;background: #F3F3F3;line-height: 50px;text-align: center;box-shadow: 0 -1px 6px #999">
            <el-button type="success" icon="el-icon-check" @click="amendLimits()">提 交</el-button>
            <el-button @click="dialogSystem = false" icon="el-icon-close">取 消</el-button>
          </div>
        </div>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import treeTable from '@/components/TreeTable'
  import treeToArray from './customEval'
  export default {
    name: 'tree',
    components: { treeTable },
    data() {
      return {
        queryData: () => {}, //方法
        table_h: 0,// 树的高度
        version: '1.0.0', // 版本号
        dialogFormVisible: false, // 添加访问权限
        amendDialog: false, //修改操作弹层
        innerVisible: false, //内层弹层
        innerVisible1: false, //内层弹层
        dialogForm:false, // 添加操作弹层
        dialogSystem:false,  // 系统的权限修改
        dialogS:false, // 修改子权限
        formLabelWidth: '120px',
        state: '', // 所属应用
        form: { // 添加访问权限
          systemId: '',
          privilegePid: '',
          privilegeName: '',
          programCode: '',
          icon:'',
          appId:'',
        },
        amendForm:{ //修改访问权限参数
          systemId: '',
          privilegeId:'',
          privilegeName: '',
          operateCode: '',
          programCode: '',
          icon:'',
          appId: '',
        }, // 修改权限里的参数
        amendParameter:{},
        operation:{ // 添加操作权限
          privilegeId:'',
          operateName:'',
          buttonName:'',
          operateCode:'',
          interfaceJSON:[]
        },
        amendData:{}, // 修改该操作权限
        interfaceName:'', //接口名称
        methodName:'', // 方法名称
        tableDataS:[],// 修改系统应用里的应用
        applyData:{// 编辑系统应用参数
          systemId:'',
          clToken:'',
          systemName:'',
          icon:'',
          color:'',
          appJson:[]
        }, //修改系统的回显数据
        tableData1:[], // 接受接口数据
        func: treeToArray,
        tableData: [], //  权限树
        args: [null, null, true, 'timeLine']
      }
    },
    methods: {
      // 点击箭头往下移
      clickDown(row) {
        let self = this;
        var obj = {
          privilegeId: row.privilegeId,
          privilegePid: row.privilegePid,
        };
        if( !row.privilegePid) {
          delete obj.privilegePid;
        }
        self._post('com.edb01.upms.service.PrivilegeService/'+ self.version +'/moveDown',obj)
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogS = false;
              self.queryData();
              self.$message({
                type: 'success',
                message: '下移成功!'
              });
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          });
        console.log(row);

      },
      // 点击箭头往上移
      clickUp(row) {
        let self = this;
        let obj = {
          privilegeId: row.privilegeId,
          privilegePid: row.privilegePid,
        };
        if(!row.privilegePid) {
          delete obj.privilegePid;
        }
        self._post('com.edb01.upms.service.PrivilegeService/'+ self.version +'/moveUp',obj)
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogS = false;
              self.queryData();
              self.$message({
                type: 'success',
                message: '上移成功!'
              });
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          });
        console.log(row);

      },
      // 修改的权限的提交
      addAmendAuthority(){
        //console.log(this.amendForm);
        let self = this;
        if(self.amendForm.privilegeName == '' ){
          self.$message({
            message: '权限名称不能为空',
            type: 'warning'
          });
          return false
        }
        if(self.amendForm.icon == '' ){
          self.$message({
            message: '权限图标不能为空',
            type: 'warning'
          });
          return false
        }
        if(self.amendForm.programCode == '' ){
          self.$message({
            message: '程序代码不能为空',
            type: 'warning'
          });
          return false
        }
        if(self.amendForm.appId == '' ){
          self.$message({
            message: '所属应用不能为空',
            type: 'warning'
          });
          return false
        }
        self._post('com.edb01.upms.service.PrivilegeService/'+ self.version +'/update',self.amendForm)
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogS = false;
              self.queryData();
              self.$message({
                type: 'success',
                message: '修改成功!'
              });
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })

      },
      // 修改系统的提交
      amendLimits(){
        let self = this;
        if(self.applyData.systemName == ''){
          self.$message({
            message: '系统名称不能为空',
            type: 'warning'
          });
          return false

        }else if(self.applyData.icon == ''){
          self.$message({
            message: '系统图标不能为空',
            type: 'warning'
          });
          return false
        }else if(self.applyData.color == ''){
          self.$message({
            message: '系统颜色不能为空',
            type: 'warning'
          });
          return false
        }
        for(var i=0;i<self.tableDataS.length;i++){
          self.applyData.appJson.push({appId:self.tableDataS[i].appId,systemId:self.tableDataS[i].systemId,appName:self.tableDataS[i].appName,appServerName:self.tableDataS[i].appServerName,port:self.tableDataS[i].port})
        }
        self.applyData.appJson = JSON.stringify(self.applyData.appJson);
        console.log(self.tableDataS);
        // 提交的请求
        self._post('com.edb01.upms.service.SystemService/'+ self.version +'/update',self.applyData)
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogSystem = false;
              self.queryData();
              self.$message({
                type: 'success',
                message: '修改系统成功!'
              });
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 点击修改系统/应用权限
      amendAuthority(row){
        let self = this;
        self.apply(row);
        if(row.type == 'system'){
          self.applyData.systemId = row.systemId;
          self.dialogSystem = true;
          self._post('com.edb01.upms.service.SystemService/'+ self.version +'/get',{systemId:row.systemId})
            .then(function (res) {
              if (res.data.code == 0) {
                let result = res.data.result;
                self.applyData.systemName = result.systemName;
                self.applyData.icon = result.icon;
                self.applyData.color = result.color;
              } else {
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }else {
          self.dialogS = true;
          self.amendForm.privilegeName = row.privilegeName;
          self.amendForm.programCode = row.programCode;
          self.amendForm.icon = row.icon;
          self.amendForm.appId = row.appId;
          self.amendForm.privilegeId = row.privilegeId;
          self.amendForm.systemId = row.systemId;
          if(row. privilegePid){
            self.amendForm.privilegePid = row.privilegePid;
          }
        }
      },
      // 点击行触发的方法
      changeCurrent(row){
        //console.log(row);
      },
      // 部署信息的删除按钮
      delSystem(index,rows,row){
        // console.log(row);
        rows.splice(index,1)
      },
      // 添加系统应用
      addSystem(){
        this.tableDataS.push({});
        this.tableDataS[this.tableDataS.length - 1].port = '80'
      },
      // 删除操作权限（小图标）
      delOperates(row,rows,index){  // row当前行的数据 rows 行下面的所有权限  index点击的操作权限索引
        this.$confirm('是否删除操作权限《' + rows[index].buttonName +'》?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          let self = this;
          self._post('com.edb01.upms.service.OperateService/'+ self.version +'/delete',{operateId:rows[index].operateId})
            .then(function (res) {
              if (res.data.code == 0) {
                self.queryData();
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              } else {
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 修改操作权限里的保存
      saveAmendData(){
        let self = this;
        if(self.amendData.operateName == ''){
          self.$message({
            message: '权限名称不能为空',
            type: 'warning'
          });
          return false
        }
        if(self.amendData.buttonName == ''){
          self.$message({
            message: '按钮名称不能为空',
            type: 'warning'
          });
          return false
        }
        self.amendParameter.operateName = self.amendData.operateName;
        self.amendParameter.buttonName = self.amendData.buttonName;
        self.amendParameter.operateCode = self.amendData.operateCode;
        self.amendParameter.interfaceJSON = JSON.stringify(self.amendData.interfaces);
        self._post('com.edb01.upms.service.OperateService/'+ self.version +'/update',self.amendParameter)
          .then(function (res) {
            if (res.data.code == 0) {
              self.amendDialog = false; // 关闭弹层
              self.queryData();
              self.$message({
                message: '修改操作权限成功',
                type: 'success'
              })
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 修改操作权限里的添加
      amendAdd(){
        if(this.interfaceName.trim() == ''){
          this.$message({
            message: '接口名称不能为空',
            type: 'warning'
          });
          return false
        }
        if(this.methodName.trim() == ''){
          this.$message({
            message: '方法名称不能为空',
            type: 'warning'
          });
          return false
        }
        this.amendData.interfaces.push({interfaceName:this.interfaceName,methodName:this.methodName}); // 把数据加到表格中
        this.innerVisible1 = false; // 关闭内层弹层
      },
      // 点击操作权限回显数据
      amendOperation(row,rows,index){
        let self = this;
        self.amendParameter = {};
        self.amendParameter.privilegeId = row.privilegeId;
        self.amendParameter.operateId = rows[index].operateId;
        self.amendDialog = true;
        self.operation.interfaceJSON = JSON.stringify(self.tableData1);
        self._post('com.edb01.upms.service.OperateService/'+ self.version +'/get',{operateId:rows[index].operateId})
          .then(function (res) {
            if (res.data.code == 0) {
              self.amendData = res.data.result;
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 添加权限数据
      addOperationData(){
        let self = this;
        if(self.operation.operateName.trim() == ''){
          self.$message({
            message: '权限名称不能为空',
            type: 'warning'
          });
          return false
        }
        if(self.operation.buttonName.trim() == ''){
          self.$message({
            message: '按钮名称不能为空',
            type: 'warning'
          });
          return false
        }
        self.operation.interfaceJSON = JSON.stringify(self.tableData1);
       /* self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.OperateService/add',
          data: self.operation,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })*/
        self._post('com.edb01.upms.service.OperateService/'+ self.version +'/add',self.operation)
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogForm = false; // 关闭弹层
              self.queryData();
              self.$message({
                message: '添加操作权限成功',
                type: 'success'
              })
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 点击添加操作权限图标清空输入框的值
      addBtn(){
        this.innerVisible = true;
        this.interfaceName = '';
        this.methodName = '';
      },
      // 点击修改操作权限图标清空输入框的值
      amendBtn(){
        this.innerVisible1 = true;
        this.interfaceName = '';
        this.methodName = '';
      },
      // 点击删除
      deleteData(index,rows){
        rows.splice(index,1);
        console.log(this.tableData1);
      },
      // 添加操作权限里的添加接口名称
      addName(){
        if(this.interfaceName.trim() == ''){
          this.$message({
            message: '接口名称不能为空',
            type: 'warning'
          });
          return false
        }
        if(this.methodName.trim() == ''){
          this.$message({
            message: '方法名称不能为空',
            type: 'warning'
          });
          return false
        }
        this.tableData1.push({interfaceName:this.interfaceName,methodName:this.methodName}); // 把数据加到表格中
        this.innerVisible = false;  // 关闭内层弹层
      },
    /*  handleCurrentChange(val) {
        console.log(val);
        // console.log(val,val.privilegeId,val.index);
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].privilegeId === val.privilegeId && this.tableData[i].index === true) {
            for (var j = 0; j < this.tableData[i].nodes.length; j++) {
              this.tableData[i].nodes[j].index = false
              for (var k = 0; k < self.tableData[i].nodes[j].nodes.length; k++) {
                this.tableData[i].nodes[j].nodes[k].index = false
              }
            }
          }else{
            this.tableData[i].index = false
          }
        }
      },*/
      // 删除节点
      deleteNode(row) {
        let self  = this;
        console.log(row);
        self.$confirm('是否删除' + row.privilegeName, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          self._post('com.edb01.upms.service.PrivilegeService/'+ self.version +'/delete',{privilegeId: row.privilegeId})
            .then((res) => {
              if (res.data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.queryData() // 调用
              } else {
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 添加子权限
      addLimits() {
        let self = this;
        if (self.form.privilegeName === '') {
          self.$message({
            message: '权限名称不能为空',
            type: 'warning'
          })
          return false
        }
        if (self.form.programCode === '') {
          self.$message({
            message: '程序代码不可为空',
            type: 'warning'
          })
          return false
        }
        self._post('com.edb01.upms.service.PrivilegeService/'+ self.version +'/add',self.form)
          .then((res) => {
            if (res.data.code == 0) {
              this.dialogFormVisible = false;
              this.queryData() // 调用
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      // 点击添加访问子权限
      addSon(row) {
        console.log(row);
        let self = this;
        self.apply(row);
        self.amendForm.appId = '';
        if (row.type == 'system') {
          delete self.form.privilegePid
        } else {
          self.form.privilegePid = row.privilegeId
        }
        self.form.systemId = row.systemId;

        self.privilegeName = '';
        self.programCode = '';

        self.operation.operateName = '';
        self.operation.buttonName = '';

        self.dialogFormVisible = true
      },
      // 点击添加操作权限
      addOperate(row){
        this.operation.buttonName = '';
        this.operation.operateName = '';
        this.dialogForm = true;
        this.tableData1 = []; // 点击进去吧之前的数据清空
        this.operation.privilegeId = row.privilegeId;
      },
      // 所属应用管理
      apply(row) {
        let self = this;
        if (row.systemId == 0) {
          self.form.appId = '';
        } else {
          self.form.appId = 'C30FD2256ED74A11836F876056EF37E1';
        }
        self._post('com.edb01.upms.service.AppService/'+ self.version +'/list',{systemId: row.systemId})
          .then(function (res) {
            if (res.data.code == 0) {
              self.state = res.data.result;//应用
              console.log(1);
              self.tableDataS = self.state;  // 系统应用的回显
              if(self.state){  // 修改弹层默认显示第一个应用
                self.form.appId = self.state[0].appId
              }
            } else {
              self.$message({
                message: '请求失败',
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    mounted() {
      this.queryData = () => { // 获取菜单数据
        let self = this;
        self._post('com.edb01.upms.service.PrivilegeService/'+ self.version +'/getPrivilegeJson')
          .then(function (res) {
            if (res.data.code == 0) {
              var result = res.data.result;
              self.tableData = result.nodes
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      };
        this.queryData();
    },
    created() {
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight;  // 页面高度
        var b = document.getElementById('tree-box').offsetTop; // 表格距离顶部的距离
        this.table_h = a - b - 30
      });
    }
  }
</script>
<style scoped>
  .line {
    border: 0.5px solid #eee;
  }
  #authorityMange{
    border-left: 30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 15px solid #F0F1F5;
    padding: 15px 20px;
  }
</style>
