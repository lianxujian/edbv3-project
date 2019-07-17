<template>
  <div style="min-width: 1200px">
    <div class="app-container">
      <div class="line"></div>
      <tree-table highlight-current-row   :data="tableData" :evalFunc="func" :evalArgs="args" border>
        <el-table-column label="权限树名" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="amendAuthority(scope.row)"><i :class="scope.row.icon"></i>&nbsp;{{scope.row.privilegeName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="程序代码" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.programCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作权限" align="center" width="400">
          <template slot-scope="scope">
            <span v-for="item,index in  scope.row.operates" style="margin-right: 5px;display:inline-block;width:80px;"><el-button type="text" size="mini"  @click="amendOperation(scope.row,scope.row.operates,index)">{{item.buttonName}}</el-button>
            <i class="el-icon-error" style="color: #F56C6C;font-size: 14px;cursor: pointer;float:right;margin-top:7px;" @click="delOperates(scope.row,scope.row.operates,index)"></i></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350" align="center">
          <template slot-scope="scope">
            <el-button  size="mini"  @click="addSon(scope.row)">添加访问子权限</el-button>
            <el-button type="primary" size="mini" v-if="scope.row.type != 'root'" @click="addOperate(scope.row)">添加操作权限</el-button>
            <el-button type="danger" size="mini" v-if="scope.row.type != 'root'" @click="deleteNode(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作">
          <template slot-scope="scope">
            <i class="fa fa-chevron-down"></i>  <i class="fa fa-chevron-up"></i>
          </template>
        </el-table-column>-->
      </tree-table>
    </div>
    <!--修改操作权限-->
    <div>
      <el-dialog  title="修改操作权限" :visible.sync="amendDialog"
                  width="900px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <div
            style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
            权限基础信息
          </div>
          <el-form >
            <el-form-item label="权限名称" :label-width="formLabelWidth">
              <el-input v-model="amendData.operateName" auto-complete="off" style="width:600px;"></el-input>
            </el-form-item>
            <el-form-item label="按钮名称" :label-width="formLabelWidth">
              <el-input v-model="amendData.buttonName" auto-complete="off" style="width:600px;"></el-input>
            </el-form-item>
            <div
              style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
              部署信息
            </div>
            <div>
              <div>
                <el-button style="margin-left:10px;" size="small" type="primary"><i class="el-icon-plus" style="" @click="amendBtn()"></i> 添加</el-button>
                <el-dialog
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
                  :height="300"
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
      <el-dialog  title="添加操作权限" :visible.sync="dialogForm"
                  width="900px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <div
            style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
            权限基础信息
          </div>
          <el-form >
            <el-form-item label="权限名称" :label-width="formLabelWidth">
              <el-input v-model="operation.operateName" auto-complete="off" style="width:600px;"></el-input>
            </el-form-item>
            <el-form-item label="按钮名称" :label-width="formLabelWidth">
              <el-input v-model="operation.buttonName" auto-complete="off" style="width:600px;"></el-input>
            </el-form-item>
            <div
              style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
              部署信息
            </div>
            <div>
              <div>
                <el-button  @click="addBtn()" style="margin-left:10px;" size="small" type="primary"><i class="el-icon-plus"></i> 添加</el-button>
                <el-dialog
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
                  <el-button type="success" @click="addName()">添加</el-button>
                </el-dialog>
              </div>
              <div>
                <el-table
                  :data="tableData1"
                  :height="300"
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
      <el-dialog  title="添加访问权限" :visible.sync="dialogFormVisible"
                  width="900px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <div
            style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
            权限基础信息
          </div>
          <el-form :model="form">
            <el-row>
              <el-col :span="10"><div class="grid-content bg-purple">
                <el-form-item label="权限名称" :label-width="formLabelWidth" style="display: inline-block">
                  <el-input v-model="form.privilegeName" auto-complete="off"></el-input>
                </el-form-item>
              </div></el-col>
              <el-col :span="10"><div class="grid-content bg-purple-light">
                <el-form-item label="权限图标" :label-width="formLabelWidth" >
                  <el-input v-model="form.icon" auto-complete="off"></el-input>
                </el-form-item>
              </div></el-col>
            </el-row>
            <el-form-item label="程序代码" :label-width="formLabelWidth">
              <el-input v-model="form.programCode" auto-complete="off" style="width:600px;"></el-input>
            </el-form-item>
            <div
              style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
              部署信息
            </div>
            <div style="margin-bottom: 200px;padding-left: 50px;">
              <div style="display: inline-block" >所属应用系统:E店宝</div>
              <div style="display: inline-block;margin-left: 80px;">
                <el-form-item label="所属应用" :label-width="formLabelWidth">
                  <el-select v-model="form.appId" placeholder="请选择所属应用" style="width: 300px;height: 10px;">
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
      <el-dialog  title="修改访问权限" :visible.sync="dialogS"
                  width="900px">
        <div style="border: 1px solid  #D5D5D5;margin-top: -20px;">
          <div
            style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
            权限基础信息
          </div>
          <el-form >
            <el-row>
              <el-col :span="10"><div class="grid-content bg-purple">
                <el-form-item label="权限名称" :label-width="formLabelWidth" style="display: inline-block">
                  <el-input v-model="amendForm.privilegeName" auto-complete="off"></el-input>
                </el-form-item>
              </div></el-col>
              <el-col :span="10"><div class="grid-content bg-purple-light">
                <el-form-item label="权限图标" :label-width="formLabelWidth" >
                  <el-input v-model="amendForm.icon" auto-complete="off"></el-input>
                </el-form-item>
              </div></el-col>
            </el-row>
            <el-form-item label="程序代码" :label-width="formLabelWidth">
              <el-input v-model="amendForm.programCode" auto-complete="off" style="width:600px;"></el-input>
            </el-form-item>
            <div
              style="height: 40px;background: #F6F6F5;font-size: 18px;padding-left:10px;font-weight: bold;line-height: 40px;margin: 10px 0;border-top: 1px solid #CECDCD;border-bottom: 1px dashed #CECDCD">
              部署信息
            </div>
            <div style="margin-bottom: 200px;padding-left: 50px;">
              <div style="display: inline-block" >所属应用系统：E店宝V3</div>
              <div style="display: inline-block;margin-left: 80px;">
                <el-form-item label="所属应用" :label-width="formLabelWidth">
                  <el-select v-model="amendForm.appId" placeholder="请选择所属应用" style="width: 300px;height: 10px;">
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
      <el-dialog  title="编辑应用系统" :visible.sync="dialogSystem"
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
            <div style="padding-left: 50px;">
              <div>
                <el-button style="margin-left:10px;" size="small" type="primary"><i class="el-icon-plus" style="" @click="addSystem()"></i> 添加</el-button>
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
                        <i class="el-icon-circle-close" style="font-size: 30px;color: red;cursor: pointer" @click="delSystem(scope.$index,tableDataS,scope.row)"></i>
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
        queryData: () => {
        },
        checked: '',
        version: '', // 版本号
        token: '',
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
          clToken: '',
          systemId: '',
          privilegePid: '',
          privilegeName: '',
          programCode: '',
          icon:'',
          appId:'',
        },
        amendForm:{
          clToken: '',
          systemId: '',
          privilegeId:'',
          privilegeName: '',
          programCode: '',
          icon:'',
          appId: '',
        }, // 修改权限里的参数
        amendParameter:{},
        operation:{ // 添加操作权限
          clToken:'',
          privilegeId:'',
          operateName:'',
          buttonName:'',
          interfaceJSON:[]
        },
        amendData:{}, // 修改该操作权限
        interfaceName:'',
        methodName:'',
        tableDataS:[],// 修改系统应用里的应用
        applyData:{
          systemId:'',
          clToken:'',
          systemName:'',
          icon:'',
          color:'',
          appJson:[]
        }, //修改系统的回显数据
        tableData1:[],
        func: treeToArray,
        tableData: [],
        args: [null, null, true, 'timeLine']
      }
    },
    methods: {
      // 修改的权限的提交
      addAmendAuthority(){
        let self = this
        self.amendForm.clToken = self.token
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
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeService/update',
          data: self.amendForm,
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
              self.dialogS = false
              self.queryData()
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
        let self = this
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
        self.applyData.appJson = JSON.stringify(self.applyData.appJson)
        console.log(self.tableDataS);
        // 提交的请求
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.SystemService/update',
          data: self.applyData,
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
              self.dialogSystem = false
              self.queryData()
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
        console.log(row);
        let self = this
        self.apply(row)
        if(row.type == 'system'){
          self.applyData.systemId = row.systemId
          self.applyData.clToken = self.token
          self.dialogSystem = true
          self.$axios({
            method: 'post',
            url: process.env.API_HOST + 'com.edb01.upms.service.SystemService/get',
            data: {systemId:row.systemId,clToken:self.token},
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
                let result = res.data.result
                self.applyData.systemName = result.systemName
                self.applyData.icon = result.icon
                self.applyData.color = result.color
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
          self.dialogS = true
          self.amendForm.privilegeName = row.privilegeName
          self.amendForm.programCode = row.programCode
          self.amendForm.icon = row.icon
          self.amendForm.appId = row.appId
          self.amendForm.privilegeId = row.privilegeId
          self.amendForm.systemId = row.systemId
          if(row. privilegePid){
            self.amendForm.privilegePid = row.privilegePid
          }
        }
      },
      changeCurrent(row){
        console.log(row);
      },
      delSystem(index,rows,row){
        // console.log(row);
        rows.splice(index,1)
      },
      // 添加系统应用
      addSystem(){
        this.tableDataS.push({})
        this.tableDataS[this.tableDataS.length - 1].port = '80'
      },
      // 删除操作权限
      delOperates(row,rows,index){  // row当前行的数据 rows 行下面的所有权限  index点击的操作权限索引
        console.log(row);
        let self = this
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.OperateService/delete',
          data: {operateId:rows[index].operateId,clToken:self.token},
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
              self.queryData()
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
      },
      // 修改操作权限里的保存
      saveAmendData(){
        let self = this
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
        self.amendParameter.operateName = self.amendData.operateName
        self.amendParameter.buttonName = self.amendData.buttonName
        self.amendParameter.interfaceJSON = JSON.stringify(self.amendData.interfaces)
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.OperateService/update',
          data: self.amendParameter,
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
              self.amendDialog = false // 关闭弹层
              self.queryData()
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
        this.amendData.interfaces.push({interfaceName:this.interfaceName,methodName:this.methodName}) // 把数据加到表格中
        this.innerVisible1 = false  // 关闭内层弹层
      },
      // 点击操作权限回显数据
      amendOperation(row,rows,index){
        let self = this
        self.amendParameter = {}
        self.amendParameter.privilegeId = row.privilegeId
        self.amendParameter.clToken = self.token
        self.amendParameter.operateId = rows[index].operateId
        self.amendDialog = true
        self.operation.interfaceJSON = JSON.stringify(self.tableData1)
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.OperateService/get',
          data: {operateId:rows[index].operateId,clToken:self.token},
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
              self.amendData = res.data.result
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
        //console.log(row[index].operateId);

        // console.log(row,index);
      },
      // 添加权限数据
      addOperationData(){
        let self = this
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
        self.operation.interfaceJSON = JSON.stringify(self.tableData1)
        self.$axios({
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
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.dialogForm = false // 关闭弹层
              self.queryData()
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
        this.innerVisible = true
        this.interfaceName = ''
        this.methodName = ''
      },
      // 点击修改操作权限图标清空输入框的值
      amendBtn(){
        this.innerVisible1 = true
        this.interfaceName = ''
        this.methodName = ''
      },
      // 点击删除
      deleteData(index,rows){
        rows.splice(index,1)
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
        this.tableData1.push({interfaceName:this.interfaceName,methodName:this.methodName}) // 把数据加到表格中
        this.innerVisible = false  // 关闭内层弹层
      },
      handleCurrentChange(val) {
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
      },
      // 删除节点
      deleteNode(row) {
        let self  = this
        console.log(row)
        self.$confirm('是否删除' + row.privilegeName, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$axios({
            method: 'post',
            url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeService/delete',
            data: { privilegeId: row.privilegeId, clToken: self.token },
            transformRequest: [function(data) {
              let newData = ''
              for (var k in data) {
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
              }
              return newData
            }]
          })
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
        let self = this
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
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeService/add',
          data: self.form,
          transformRequest: [function (data) {
            let newData = ''
            for (var k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
            }
            return newData
          }]
        })
          .then((res) => {
            if (res.data.code == 0) {
              this.dialogFormVisible = false
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
        let self = this
        self.apply(row)
        self.amendForm.appId = ''
        if (row.type == 'system') {
          delete self.form.privilegePid
        } else {
          self.form.privilegePid = row.privilegeId
        }
        self.form.clToken = self.token
        self.form.systemId = row.systemId

        self.privilegeName = ''
        self.programCode = ''

        self.operation.operateName = ''
        self.operation.buttonName = ''

        self.dialogFormVisible = true
      },
      // 点击添加操作权限
      addOperate(row){
        console.log(row);
        let self = this
        self.operation.buttonName = ''
        self.operation.operateName = ''
        self.dialogForm = true
        self.tableData1 = []  // 点击进去吧之前的数据清空
        self.operation.privilegeId = row.privilegeId
        self.operation.clToken = self.token
      },
      // 所属应用管理
      apply(row) {
        let self = this
        if (row.systemId == 0) {
          self.form.appId = ''
        } else {
          self.form.appId = 'C30FD2256ED74A11836F876056EF37E1'
        }
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.AppService/list',
          data: {
            systemId: row.systemId,
            clToken: self.token
          },
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
              self.state = res.data.result //应用
              console.log(1);
              self.tableDataS = self.state  // 系统应用的回显
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
      this.queryData = () => {
        var self = this
        self.$axios({
          method: 'post',
          url: process.env.API_HOST + 'com.edb01.upms.service.PrivilegeService/1.0.0/getPrivilegeJson',
          data: {clToken: encodeURIComponent(localStorage.getItem('clToken'))},
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
              var result = res.data.result
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
      }
      this.queryData()
    },
    created() {
      var self = this
      if (localStorage.getItem('clToken')) {
        self.token = localStorage.getItem('clToken');
      }
      if(localStorage.getItem('version')){
        self.version = localStorage.getItem('version');
      }
    }
  }
</script>
<style scoped>
  .line {
    border: 0.5px solid #eee;
  }
</style>
