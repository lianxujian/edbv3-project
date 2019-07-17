<!--贾南风 绑定快递-->
<template>
  <div id="bindExpress">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;">
        <el-breadcrumb-item @click.native="backPage"><span class="clickS">仓库档案</span></el-breadcrumb-item>
        <el-breadcrumb-item>绑定快递</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="addButton()"><span>添加绑定</span></li>
        <li @click='publicLogBtn'><span>查看日志</span></li>
      </ul>
    </div>
    <div>
      <el-table
        ref="box"
        id="fitTable"
        :height="table_h"
        :data="tableData"
        border>
        <el-table-column
          align="center"
          type="index"
          width="60"
          label="序号">
        </el-table-column>
        <el-table-column
          align="left"
          prop="expressName"
          label="快递名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="contacter"
          label="联系人">
        </el-table-column>
        <el-table-column
          align="center"
          prop="contactPhone"
          label="联系电话">
        </el-table-column>
        <!--<el-table-column
          align="left"
          prop="expressName"
          label="网点编号">
        </el-table-column>-->
        <el-table-column
          align="center"
          width="100"
          label="支持货到付款">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.codFlag" @click.native="clickStart(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="优先级">
          <template slot-scope="scope">
            <span style="line-height: 35px"  v-if="scope.$index != showIndex">{{scope.row.pri}}</span>
            <el-input v-if="scope.$index == showIndex" v-model="scope.row.pri" type="number" style="width: 50%;line-height: 35px"   @keyup.native="keyupData1(scope.$index)" @blur="amendPriority(scope.row)"></el-input>
            <i class="el-icon-edit" style="cursor: pointer;float: right;line-height: 35px" @click="clickIcon(scope.row,scope.$index)"></i>
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
            <el-button type="text" size="small" style="color:red" @click="delData(scope.row)">删除</el-button>
            <el-button  type="text" size="small" @click="editData(scope.row)">编辑运费模板</el-button>
            <el-button type="text" size="small" @click="checkFreight(scope.row)">查看运费模板</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--查看日志-->
    <div>
       <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
    <!--添加绑定快递-->
    <div>
      <el-dialog v-dialogDrag
        title="添加绑定"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="800px">
        <div style="width: 100%;">
          <el-form style="margin-left: 50px;">
            <el-form-item label="选择快递：" :required="true">
              <el-select v-model="addExpress.expressId" placeholder="请选择快递" style="width: 288px;" @change="showInput(1,false)">
                <el-option v-for="item in express"
                           :key="item.expressId"
                           :label="item.expressName"
                           :value="item.expressId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系人：">
              <el-input v-model="addExpress.contacter" :maxlength="10" style="width: 288px;"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：">
              <el-input v-model="addExpress.contactPhone" :maxlength="30" style="width: 288px;"></el-input>
            </el-form-item>
            <el-form-item label="网点编码：" v-if="showE" :required="true">
              <el-input v-model="addExpress.branchCode" :maxlength="30" style="width: 288px;"></el-input>
            </el-form-item>
            <el-form-item v-if="showC" label="菜鸟电子面单发货地址：" :required="true">
              <el-select v-model="addExpress.sendTbaddress" placeholder="请选择菜鸟发货地址" style="width: 288px;">
                <el-option v-for="item in expressC"
                           :key="item.id"
                           :label="item.fullAddress"
                           :value="item.id"
                ></el-option>
              </el-select>
              <el-tooltip class="item" effect="dark" content="开通电子面单时设置的发货地址" placement="top-start">
                <i class="el-icon-question" style="margin-left:5px;font-size:16px;color:#ccc;cursor: pointer"></i>
              </el-tooltip>
              <el-button type="text" style="margin-left: 6px" @click="query2(addExpress.expressId,true)">刷新</el-button>
            </el-form-item>
            <el-form-item v-if="showJ" label="京东第三方电子面单发货地址：" :required="true">
              <el-select v-model="addExpress.sendJdthraddress" placeholder="请选择京东发货地址" style="width: 288px;">
                <el-option v-for="item in expressJ"
                           :key="item.id"
                           :label="item.fullAddress"
                           :value="item.id"
                ></el-option>
              </el-select>
              <el-tooltip class="item" effect="dark" content="开通电子面单时设置的发货地址" placement="top-start">
                <i class="el-icon-question" style="margin-left:5px;font-size:16px;color:#ccc;cursor: pointer"></i>
              </el-tooltip>
              <el-button type="text" style="margin-left: 6px" @click="query3(addExpress.expressId,true)">刷新</el-button>
            </el-form-item>
            <el-form-item label="优先级：">
              <el-input v-model="addExpress.pri" :maxlength="30" style="width: 288px;" type="number" @keyup.native="keyupData(1)"></el-input><!--@keyup.native="addExpress.pri =addExpress.pri.replace(/^[^1]\d{2}$|^101$/g,'')"-->
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
     <el-button @click="dialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="saveAdd(addExpress,'insert',1)" style="width: 80px;">保 存</el-button>
  </div>
      </el-dialog>
    </div>
    <!--修改绑定快递-->
    <div>
      <el-dialog v-dialogDrag
        title="修改绑定"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible2"
        width="800px">
        <div style="width: 100%;">
          <el-form style="margin-left: 50px;">
            <el-form-item label="选择快递：" :required="true">
              <el-select v-model="addExpress1.expressId" disabled placeholder="请选择快递" style="width: 288px;"
                         @change="showInput(2,false)">
                <el-option v-for="item in express2"
                           :key="item.expressId"
                           :label="item.expressName"
                           :value="item.expressId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系人：">
              <el-input v-model="addExpress1.contacter" :maxlength="10" style="width: 288px;"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：">
              <el-input v-model="addExpress1.contactPhone" :maxlength="30" style="width: 288px;"></el-input>
            </el-form-item>
            <el-form-item label="网点编码：" v-if="showE" :required="true">
              <el-input v-model="addExpress1.branchCode" :maxlength="30" style="width: 288px;"></el-input>
            </el-form-item>
            <el-form-item v-if="showC" label="菜鸟电子面单发货地址：" :required="true">
              <el-select v-model="addExpress1.sendTbaddress" placeholder="请选择菜鸟发货地址" style="width: 288px;">
                <el-option v-for="item in expressC"
                           :key="item.id"
                           :label="item.fullAddress"
                           :value="item.id"
                ></el-option>
              </el-select>
              <el-tooltip class="item" effect="dark" content="开通电子面单时设置的发货地址" placement="top-start">
                <i class="el-icon-question" style="margin-left:5px;font-size:16px;color:#ccc;cursor: pointer"></i>
              </el-tooltip>
              <el-button type="text" style="margin-left: 6px" @click="query2(addExpress1.expressId,true)">刷新</el-button>
            </el-form-item>
            <el-form-item v-if="showJ" label="京东第三方电子面单发货地址：" :required="true" >
              <el-select v-model="addExpress1.sendJdthraddress" placeholder="请选择京东发货地址" style="width: 44%;">
                <el-option v-for="item in expressJ"
                           :key="item.id"
                           :label="item.fullAddress"
                           :value="item.id"
                ></el-option>
              </el-select>
              <el-tooltip class="item" effect="dark" content="开通电子面单时设置的发货地址" placement="top-start">
                <i class="el-icon-question" style="margin-left:5px;font-size:16px;color:#ccc;cursor: pointer"></i>
              </el-tooltip>
              <el-button type="text" style="margin-left: 6px" @click="query3(addExpress1.expressId,true)">刷新</el-button>
            </el-form-item>
            <el-form-item label="优先级：">
              <el-input v-model="addExpress1.pri" type="number" @keyup.native="keyupData(2)" :maxlength="30" style="width: 288px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2=false">取 消</el-button>
          <el-button type="primary" @click="saveAdd(addExpress1,'update',2)" style="width: 80px;">保 存</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 查看运费模板-->
    <div>
      <el-dialog v-dialogDrag
        title="查看运费模板"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible1"
        width="800px">
        <div style="width: 100%;margin-left: -20px;">
          <div v-if="checkData.chargeType == 1">
            <div style="margin:-15px 0  5px 0;font-weight: bold">{{checkData.expressName}}（续重计费）</div>
            <div class="spanBox">默认运费（<span>首重：{{checkData.defaultWeight}}元</span><span>首费：{{checkData.defaultFreightAmt}}KG</span><span>续重：{{checkData.increaseWeight}}元</span><span>续费：{{checkData.increaseFreightAmt}}KG</span><span v-if="checkData.surchargeAmt">附加费：{{checkData.surchargeAmt}}元</span><span v-if="checkData.roundoffWeight">舍入重量：{{checkData.roundoffWeight}}KG</span><span style="margin-left: -15px">）</span></div>
            <div id="wrapper">
              <el-table
                :data="checkData.wmFreightTmplGradientRegionBeanList"
                style="max-height: 400px;overflow-y:scroll"
                border>
                <el-table-column
                  align="center"
                  prop="regionPlanName"
                  label="运送地区">
                </el-table-column>
                <el-table-column
                  label="重量范围（KG）"
                  width="100"
                  align="center">
                  <template slot-scope="scope">
                    <el-table
                      id="wrap"
                      :data="scope.row.wmFreightTmplGradientBeans"
                      :show-header="false">
                      <el-table-column
                        align="center"
                        prop="firstCost">
                        <template slot-scope="scope">
                          <span v-if="scope.$index == 0">不限</span>
                          <span v-else>{{scope.row.weightThan}}~{{scope.row.weightLess}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="85"
                  label="首重（KG）">
                  <template slot-scope="scope">
                    <el-table
                      class="wrap"
                      :data="scope.row.wmFreightTmplGradientBeans"
                      :show-header="false">
                      <el-table-column
                        align="center"
                        prop="startWeight">
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="费用（元）"
                  width="85">
                  <template slot-scope="scope">
                    <el-table
                      :data="scope.row.wmFreightTmplGradientBeans"
                      :show-header="false">
                      <el-table-column
                        align="center"
                        prop="startAmt">
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  align="center"
                  width="85"
                  label="续重（KG）">
                  <template slot-scope="scope">
                    <el-table
                      class="wrap"
                      :data="scope.row.wmFreightTmplGradientBeans"
                      :show-header="false">
                      <el-table-column
                        prop="continuedWeight">
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="85"
                  label="续费（KG）">
                  <template slot-scope="scope">
                    <el-table
                      class="wrap"
                      :data="scope.row.wmFreightTmplGradientBeans"
                      :show-header="false">
                      <el-table-column
                        prop="continuedAmt">
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-else-if="checkData.chargeType == 2">
            <div style="margin:-16px 0 5px 0;font-weight: bold">{{checkData.expressName}}（按件计费）</div>
            <div class="spanBox">默认运费（<span>每件收取费用：{{checkData.defaultPieceAmt}}元</span><span style="margin-left: -15px">）</span></div>
            <div >
              <el-table
                border
                :data="checkData.wmFreightTmplGradientRegionBeanList"
                style="max-height: 400px;overflow-y:scroll"
              >
                <el-table-column
                  label="运送地区"
                  align="center"
                  prop="regionPlanName">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="每件收费"
                >
                  <template slot-scope="scope">
                    <div v-for="item in scope.row.wmFreightTmplGradientBeans">
                      <span>{{item.pieceAmt}}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-else>
            <div>{{checkData.expressName}}</div>
            <div><a style="color: #3D9BFE" @click="editData(checkData.row)">去编辑运费模板>></a></div>
          </div>
          <div class="box3">
            <el-button type="primary" @click="dialogVisible1=false">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import publicLog from '@/components/common/publicLogDialog.vue';
  export default {
    props: ['storageId'],
    components: { 'v-Publiclog': publicLog },
    data() {
      return {
        // 日志
        paramObj: {},
        pulicLogVisible: false,
        //a: '',
        // 方法
        query: () => {},
        query1: () => {},
        query2: () => {},
        query3: () => {},
        query4: () => {},
        //storageId: this.$router.history.current.params.storageId,
        express: [], // 快递
        express1: [], // listExpress
        express2: [], // 修改的list
        expressC: [], // 菜鸟电子面单发货地址
        expressJ: [], // 京东电子面单发货地址
        addList: '', // 触发参数
        addExpress: { // 添加的参数
          storageId: '', // 仓库id。
          expressId: '', // 快递id。
          contacter: '', // 联系人。
          contactPhone: '', // 联系电话。
          branchCode: '', // 网点编码
          sendTbprovince: '', // 天猫电子面单省级地址。
          sendTbcity: '', // 天猫电子面单市级地址。
          sendTbarea: '', // 天猫电子面单区级地址
          sendTbtown: '', // 天猫电子面单小区地址。
          sendTbaddress: '', // 天猫电子面单详细地址。
          sendJdthrprovince: '', // 京东第三方电子面单省级地址。
          sendJdthrcity: '', // 京东第三方电子面单市级地址。
          sendJdthrarea: '', // 京东第三方电子面单区级地址。
          sendJdthrtown: '', // 京东第三方电子面单小区地址。
          sendJdthraddress: '', // 京东第三方电子面单详细地址。
          codFlag: false, // 是否支持货到付款
          pri: ''// 优先级
        },
        showIndex: 'a', // 显示隐藏优先级
        sendTbaddress: '',//菜鸟电子面单详细地址
        sendJdthraddress: '', // 京东第三方电子面单详细地址
        //sortShow: false,
        addExpress1: {},// 修改绑定
        tableData: [],// 数据接收
        checkData: {},// 运费模板
        version: '1.0.0', // 版本号
        ruleForm: [],
        token: '',
        table_h: 0,
        showC: true, // 菜鸟
        showJ: true, // 京东
        showE: true,// 网点编码
        dialogVisible: false, // 添加快递
        dialogVisible1: false, // 运费模板
        dialogVisible2: false, // 修改快递
        tmId: '',//天猫
        jdId: '',//京东
        dog: 0, // 看门狗
        totalPage: 20, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 数据总条数
        totalPage1: 20, // 要显示的条数
        currentPage1: 1, //
        totalNum1: 0 // 数据总条数
      }
    },
    methods: {
      // 返回上一页
      backPage() {
        this.$emit('changeShow',{childrenShow: 1});
      },
      // 点击编辑查看模板
      editData(row) {
        this.$emit('changeShow',{childrenShow: 4,storageId: row.storageId,expressId:row.expressId});
        //this.$router.push({name: 'lookFreight',params: {storageId:row.storageId,expressId:row.expressId}})
      },
      // 查看日志的方法
      changDialogShow() {
        this.pulicLogVisible = false;
      },
      // 点击查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 55;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      // 页面表格优先级
      keyupData1(index) {
        if(this.tableData[index].pri >100 ||  this.tableData[index].pri <1)
          this.tableData[index].pri = ''
      },
      // 添加页面优先级
      keyupData(num) {
        if(num == 1){
          if(this.addExpress.pri > 100 || this.addExpress.pri < 1){
            this.addExpress.pri = ''
          }
        }else if(num == 2){
          if(this.addExpress1.pri > 100 || this.addExpress1.pri < 1){
            this.addExpress1.pri = ''
          }
        }

      },
      // 调整优先级
      amendPriority(row) {
        this._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + this.version + '/update',{expressId: row.expressId,storageId:row.storageId,pri:row.pri,flag: 1})
          .then((res) => {
          if(res.data.success = true) {
            //console.log(res.data.result,888);
            this.$message({
              message: '调整优先级成功',// 如果code为其他，弹出错误码
              type: 'success'
            })
            this.query()
            this.showIndex = 'a';
          }else{
            this.showIndex = 'a';
            this.$message({
              message: res.data.msg,// 如果code为其他，弹出错误码
              type: 'warning'
            })
          }
          })
      },
      // 点击编辑小图标
      clickIcon(row,index){
        //console.log(row);
        this.showIndex = index;
        //console.log(index);
      },
      // 开启关闭货到付款
      clickStart(row) {
        let self = this;
        if (row.codFlag === false) {
          self.clickStop(row)
        } else {
          self.$confirm('是否启用支持货到付款?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            self._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + self.version + '/CODFlag',{storageId: row.storageId,expressId:row.expressId})
              .then(function (res) {
                if (res.data.code == 0) {
                  self.$message({// 给用户一个提示
                    message: '已启用',
                    type: 'success'
                  });
                  self.query()
                } else {
                  row.codFlag = false;
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
            row.codFlag = false;
            self.$message({
              type: 'info',
              message: '已取消启用'
            })
          })
        }
      },
      // 点击停用
      clickStop(row) {
        let self = this
        self.$confirm('是否停用支持货到付款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          // 发请求
          self._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + self.version + '/noCODFlag',{storageId: row.storageId,expressId:row.expressId})
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({// 给用户一个提示
                  message: '已停用',
                  type: 'success'
                })
                self.query()// 重新渲染数据
              } else{
                row.codFlag = true;
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
          row.codFlag = true;
          self.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      },
      // 点击上移下移方法
      swapItems(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        // arr.storeSort = index1
        return arr
      },
      // 添加绑定的保存
      saveAdd(obj, method, num) {
        let self = this;
        // 点击修改根据绑定快递发请求回显
        if (obj.expressId == '') {
          self.$message({
            message: '请选择快递名称',
            type: 'warning'
          });
          return false
        }
        if (self.showE) {
          if (obj.branchCode == '') {
            self.$message({
              message: '请填写网点编码',
              type: 'warning'
            });
            return false;
          }
        }else{
          obj.branchCode = '';
        }
        // 如果支持菜鸟地址
        if (self.showC) {
          if (obj.sendTbaddress == '') {
            self.$message({
              message: '请选择菜鸟电子面单发货地址',
              type: 'warning'
            });
            return false
          }
          for (var i = 0; i < self.expressC.length; i++) {
            if (self.expressC[i].id == obj.sendTbaddress) {
              //console.log(self.expressC[i],8989);
              self.tmId = obj.sendTbaddress;  // 如果添加失败把ID存起来，重新赋值
              obj.sendTbprovince = self.expressC[i].sendTbprovince;
              obj.sendTbcity = self.expressC[i].sendTbcity;
              obj.sendTbarea = self.expressC[i].sendTbarea;
              obj.sendTbtown = self.expressC[i].sendTbtown;
              self.sendTbaddress = self.expressC[i].fullAddress;
              // 过滤掉没有的字段，防止有undefined
              if(!obj.sendTbarea){
                obj.sendTbarea = ''
              }
              if (obj.sendTbprovince == undefined) {
                obj.sendTbprovince = ''
              } else if (obj.sendTbtown == undefined) {
                obj.sendTbtown = ''
              } else if (obj.sendTbcity == undefined) {
                obj.sendTbcity = ''
              } else if (obj.sendTbarea == undefined) {
                obj.sendTbarea = ''
              } else if (obj.sendTbaddress == undefined) {
                obj.sendTbaddress = ''
              }
              break;
            }
          }
        } else {
          obj.sendTbprovince = '';
          obj.sendTbcity = '';
          obj.sendTbarea = '';
          obj.sendTbtown = '';
          obj.sendTbaddress = '';
        }
        // 如果支持京东地址
        if (self.showJ) {
          if (obj.sendJdthraddress == '') {
            self.$message({
              message: '请选择京东第三方快递电子面单发货地址',
              type: 'warning'
            });
            return false
          }
          for (var i = 0; i < self.expressJ.length; i++) {
            if (self.expressJ[i].id == obj.sendJdthraddress) {
              self.jdId = obj.sendJdthraddress;  // 如果添加失败把ID存起来，重新赋值
              obj.sendJdthrprovince = self.expressJ[i].sendJdthrprovince;
              obj.sendJdthrcity = self.expressJ[i].sendJdthrcity;
              obj.sendJdthrarea = self.expressJ[i].sendJdthrarea;
              obj.sendJdthrtown = self.expressJ[i].sendJdthrtown;
              self.sendJdthraddress = self.expressJ[i].sendJdthraddress;
              // 过滤掉没有的字段，防止有undefined
              if (obj.sendJdthrprovince == undefined) {
                obj.sendJdthrprovince = ''
              } else if (obj.sendJdthrcity == undefined) {
                obj.sendJdthrcity = ''
              } else if (obj.sendJdthrarea == undefined) {
                obj.sendJdthrarea = ''
              } else if (obj.sendJdthrtown == undefined) {
                obj.sendJdthrtown = ''
              } else if (obj.sendJdthraddress == undefined) {
                obj.sendJdthraddress = ''
              }
              break;
            }
          }
        } else {
          obj.sendJdthrprovince = '';
          obj.sendJdthrcity = '';
          obj.sendJdthrarea = '';
          obj.sendJdthrtown = '';
          obj.sendJdthraddress = '';
        }
        obj.storageId = self.storageId;
        //console.log(self.sendTbaddress,'test');
        let temp = {
          storageId: obj.storageId, // 仓库id。
          expressId: obj.expressId, // 快递id。
          contacter: obj.contacter, // 联系人。
          contactPhone: obj.contactPhone, // 联系电话。
          branchCode: obj.branchCode, // 网点编码
          sendTbprovince: obj.sendTbprovince, // 天猫电子面单省级地址。
          sendTbcity: obj.sendTbcity, // 天猫电子面单市级地址。
          sendTbarea: obj.sendTbarea, // 天猫电子面单区级地址g
          sendTbtown: obj.sendTbtown, // 天猫电子面单小区地址。
          sendTbaddress: self.sendTbaddress, // 天猫电子面单详细地址。
          sendJdthrprovince: obj.sendJdthrprovince, // 京东第三方电子面单省级地址。
          sendJdthrcity: obj.sendJdthrcity, // 京东第三方电子面单市级地址。
          sendJdthrarea: obj.sendJdthrarea, // 京东第三方电子面单区级地址。
          sendJdthrtown: obj.sendJdthrtown, // 京东第三方电子面单小区地址。
          sendJdthraddress: '',// 京东第三方电子面单详细地址。
          codFlag: obj.codFlag, // 支持货到付款
          pri: obj.pri // 优先级
        };
        if(self.showJ){ // 京东
          temp.sendJdthraddress = self.sendJdthraddress;
          temp.sendTbaddress = '';
        }else if(self.showC){// 菜鸟
          temp.sendTbaddress = self.sendTbaddress;
          temp.sendJdthraddress = '';
        }else{
          temp.sendJdthraddress = '';
          temp.sendTbaddress = '';
        }
        if(temp.pri == undefined){
          temp.pri = '';
        }
        console.log(temp,5555);
        self._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + self.version + '/' + method,temp)
          .then(function (res) {
            if (res.data.code == 0) {
              self.query();
              self.$message({
                message: '保存成功',
                type: 'success'
              });
              if (num == 1) {
                self.dialogVisible = false
              } else {
                self.dialogVisible2 = false;
                for (var item of self.express2){
                  if(self.addList.expressId == item.expressId) {
                    self.express2.splice(item,1);
                    break;
                  }
                }
              }
            } else {
              obj.sendJdthraddress = self.jdId;
              obj.sendTbaddress = self.tmId;
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 修改操作
      handleClick(row) {
        //console.log(row);
        let self = this;
          // self.query1();
        // 把绑定的快递添加到list中
        for (var item of self.express1){
          if(row.expressId == item.expressId) {
              self.express2.push(item);
            break;
          }
        }
        self.dialogVisible2 = true;
        self.addList = row;
        // 获取数据
        self._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + self.version + '/findEditBeanById',{storageId: self.storageId,expressId: row.expressId})
          .then(function (res) {
            if (res.data.code == 0) {
              if(!res.data.result.sendTbFullAddress){
                res.data.result.sendTbaddress = '';
              }else{
                res.data.result.sendTbaddress = res.data.result.sendTbFullAddress;
              }
              if(!res.data.result.sendJdthrFullAddress){
                res.data.result.sendJdthraddress = '';
              }else{
                res.data.result.sendJdthraddress = res.data.result.sendJdthrFullAddress;
              }
              //res.data.result.sendJdthraddress = '';
              self.addExpress1 = res.data.result;
              self.dog = 0;
              self.showInput(2,true)
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 查看运费模板
      checkFreight(row) {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.FreightTmplService/' + self.version + '/select',{ storageId : row.storageId,expressId:row.expressId})
          .then(function(res) {
            if (res.data.code == 0) {
              self.checkData = res.data.result;
              self.checkData.expressName = row.expressName;
              self.checkData.row = row // nums.insert(2, 'three')
              if(self.checkData.costTypeid == 2) {
                self.checkData.wmFreightTmplGradientRegionBeanList.unshift({planIdName: '全国（默认）',pieceCost: self.checkData.pieceCost})
              }
              if (self.checkData.costTypeid == 1) {
                self.checkData.wmFreightTmplGradientRegionBeanList.unshift({planIdName: '全国（默认）',wmFreightTmplGradientBeans: [{weightLess: 0,weightThan: 0,conWeight: self.checkData.conWeight,conCost:self.checkData.conCost,firstWeight:self.checkData.firstWeight,firstCost:self.checkData.firstCost}]})
              }
              self.dialogVisible1 = true
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      },
      // 选择快递不同，显示不同的input框
      showInput(num,bool) {
        let self = this;
        self.dog++;
        self.expressC = [];
        self.expressJ = [];
        for (var item of self.express1) {
          if(num == 1) {
            if (item.expressId == self.addExpress.expressId) {
              self.showC = item.cainiaoFlag;
              self.showJ = item.jdThrFlag;
              // 网点编码
              if (item.hasSite) {
                self.showE = true
              }else{
                self.showE = false
              }
              break;
            }
          }else if(num == 2){
            if (item.expressId == self.addExpress1.expressId) {
              self.showC = item.cainiaoFlag;
              self.showJ = item.jdThrFlag;
              // 网点编码
              if (item.hasSite) {
                self.showE = true;
              }else{
                self.showE = false
              }
              break;
            }
          }
        }
        if(bool){
          return;
        }
        // 改变快递的时候清空填入的值
        if(num == 1) {
          self.addExpress.sendTbaddress = '';
          self.addExpress.sendJdthraddress = '';
          if (self.addExpress.expressId && self.showC) {
            self.query2(self.addExpress.expressId, false)
          }
          if (self.addExpress.expressId && self.showJ) {
            self.query3(self.addExpress.expressId, false)
          }
        }else if(num == 2){
          // 修改第一次不能清空
          if (self.dog != 1){
            self.addExpress1.sendTbaddress = '';
            self.addExpress1.sendJdthraddress = '';
          }
          if (self.addExpress1.expressId && self.showC) {
            self.query2(self.addExpress1.expressId, false)
          }
          if (self.addExpress1.expressId && self.showJ) {
            self.query3(self.addExpress1.expressId, false)
          }
        }
      },
      // 删除绑定快递
      delData(row) {
        this.$confirm('要删除该快递与仓库的绑定关系，并且删除运费模板吗？', '提示', { //row.expressName
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + this.version + '/delete',{storageId: row.storageId,expressId:row.expressId})
            .then( res => {
              if (res.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.query()
              } else {
                this.$message({
                  message: res.data.msg, // 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch( err => {
              console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 点击添加绑定快递清空之前项
      addButton() {
        this.addExpress.expressId = '';
        this.addExpress.contacter = '';
        this.addExpress.contactPhone = '';
        this.addExpress.sendJdthrsitecode = '';
        this.addExpress.sendTbaddress = '';
        this.addExpress.sendJdthraddress = '';
        this.addExpress.pri = '';
        this.addExpress.sendTbaddress = '';
        this.addExpress.branchCode = '';
        this.dialogVisible = true;
        this.query1()
      },
      // 点击面包屑条页面
      jumpPage() {
        // 触发父组件
        this.$emit('ee', 1, '')
      },
      // 当前页
      handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val;
      },
      // 分页
      // 每页多少条
      handleSizeChange(val) {
        console.log(val);
        this.totalPage = val;
      },
      // 当前页
      handleCurrentChange1(val) {
        console.log(val);
        this.currentPage1 = val;
      },
      // 分页
      // 每页多少条
      handleSizeChange1(val) {
        console.log(val);
        this.totalPage1 = val;
      }
    },
    created() {
      // 动态获取表格高度
      this.$nextTick(function() {
        this.table_h = document.body.clientHeight - document.getElementById('fitTable').offsetTop - 50;
      });
      window.onresize = () => {
        this.table_h = document.body.clientHeight - document.getElementById('fitTable').offsetTop - 50;
      };
      // 快递数据
      this.query = () => {
        this._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + this.version + '/query',{storageId: this.storageId})
          .then( res => {
            if (res.data.code == 0) {
              for (var i=0; i<res.data.result.length; i++) {
                for (var j=0; j<this.express1.length; j++) {
                  if (res.data.result[i].expressId == this.express1[j].expressId) {
                    res.data.result[i].expressName = this.express1[j].expressName;
                    break;
                  }
                }
              }
              this.tableData = res.data.result;
            } else {
              this.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      };
      // 绑定快递
      this.query4 = () => {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.ExpressService/' + self.version + '/listExpressAll')
          .then(function (res) {
            if (res.data.code == 0) {
              self.express1 = res.data.result;
              self.query()
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
      this.query4()
    },
    mounted() {
      // 快递
      this.query1 = () => {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.ExpressService/' + self.version + '/list',{storageId: self.storageId})
          .then(function (res) {
            if (res.data.code == 0) {
              self.express = res.data.result;
              self.express2 = res.data.result;
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
      this.query1();
      // 菜鸟地址
      this.query2 = (row,state) => {
        let self = this;
        if(!row){
          self.$message({
            message: '请选择快递后再刷新', // 如果code为其他，弹出错误码
            type: 'warning'
          })
          return false
        }
        self._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + self.version + '/listTmallAddress',{expressId: row, manual: state,storageId: self.storageId})
          .then(function (res) {
            if (res.data.success == true) {
              for (var i = 0; i < res.data.result.length; i++) {
                res.data.result[i].id = i + 1;
              }
              self.expressC = res.data.result;
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      };
      // 京东地址
      this.query3 = (row,state) => {
        let self = this;
       if(!row){
         self.$message({
           message: '请选择快递后再刷新', // 如果code为其他，弹出错误码
           type: 'warning'
         })
         return false
       }
        self._post('com.edb01.erp.wms.service.api.WmStorageExpressService/' + self.version + '/listJdAddress',{expressId: row, manual: state,storageId: self.storageId})
          .then(function (res) {
            if (res.data.success == true) {
              self.expressJ = res.data.result;
              for (var i = 0; i < self.expressJ.length; i++) {
                self.expressJ[i].id = i + 1
              }
              //console.log(self.expressJ,123123123);
            } else {
              self.$message({
                message: res.data.result.errorMessage, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    }
  }
</script>
<style scoped>
  .clickS{
    font-weight: bold;
    cursor: pointer;
    color: #333333;
  }
  .spanBox {
    margin-bottom: 5px;
  }
  .spanBox span{
    margin-right: 16px;
  }
  .box3 {
    margin: 40px 0 10px 0;
    width: 100%;
    text-align: center;
  }
  .box8 {
    display: inline-block;
  }
</style>
<style>
  #bindExpress .el-input__inner::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }
  #bindExpress .el-input__inner[type="number"]{-moz-appearance:textfield!important;}
  .wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-bottom: none!important;
  }
  /* #wrapper .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
     padding-left: 0;
   }
   #wrapper .el-table .cell, .el-table th div {
     padding-right: 0;
   }
   #wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
     border-right: none;
   }*/
   #wrapper > .el-table_1_column_1,.el-table_1_column_2,.el-table_1_column_3,.el-table_1_column_4,.el-table_1_column_5,.el-table_1_column_6{
     border-right: 1px solid #ebeef5!important;
   }
   #wrapper .el-table--enable-row-hover .el-table__body tr:hover>td {
     background-color: #fff;
   }
  #wrapper .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0;
  }
  #wrapper .el-table .cell, .el-table th div {
    padding-right: 0;
  }
  /*#wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 1px solid #ebeef5;
  }*/
  /*#wrapper .table {
     width: 100%;
     max-width: 100%;
     margin-bottom: 0;
   }*/
  /* #wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
     border-bottom: none!important;
   }*/
  /* #wrapper .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
     border-right: none!important;
   }*/
  /*#wrapper #fitTable .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 1px solid #ebeef5!important;
  }*/
  #wrapper .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #fff;
  }
  .el-form-item__label {
    width: 230px;
    text-align: right
  }
</style>
