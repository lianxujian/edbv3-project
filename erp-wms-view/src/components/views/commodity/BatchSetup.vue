<!--批次设置 尘音-->
<template>
  <div id="batchSetup">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label for="attrName">属性名称：</label>
              <el-input @keyup.enter.native="search" maxlength="50" id="attrName" v-model="attrName" placeholder=""></el-input>
              <!--<p v-show="isWaveStrategyNameShow" style="margin-left: 65px;margin-top:3px;color: red">请填写属性名称</p>-->
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox1">
        <el-button @click="search" size="mini" type="primary">查 询</el-button>
      </div>
    </div>
    <!--操作导航-->
    <div class="col-nav" style="margin:0 0 10px">
      <ul style="margin-bottom: 0">
        <li v-if="authorityCode.WMS_BATCHSETUP_ADD" @click="handleModifyClick"><span>添加</span></li>
        <el-dialog v-dialogDrag
          :title="dialogName"
          :visible.sync="addDialogVisible"
          width="500px"
          center>

          <div class="contentBox">
            <div class="grid-content">
              <span style="color: red">*</span>
              <label for="attrNameDialog">属性名称：</label>
              <el-input maxlength="50" id="attrNameDialog" v-model="attrNameDialog" placeholder="请输入..."></el-input>
              <p v-show="isAttrNameShow" style="margin-left: 65px;margin-top:3px;color: red">请填写属性名称</p>
            </div>
            <div class="grid-content">
              <span style="color: red">*</span>
              <label for="choseClass">属性类型：</label>
              <el-select @change="changeAttr(choseClass)" id="choseClass" v-model="choseClass" filterable placeholder="全部">
                <el-option
                  v-for="(item,index) in optionsChoseClass"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="grid-content" style="position: relative">
              <div style="position: absolute;top: 5px;left: 0">
                <span style="color: red">*</span>
                <label for="attrDialog">属性值：</label>
              </div>
              <div style="display: inline-block;margin-left: 71px" v-if="isAttrValShow">
                <el-input disabled maxlength="50" style="width: 260px" id="attrDialog" v-model="attrDialog" placeholder=""></el-input>
                <p v-show="isAttrShow" style="margin-left: 65px;margin-top:3px;color: red">请填写属性名称</p>
              </div>
              <div style="display: inline-block;margin-left: 71px" v-else>
                <el-radio-group v-model="radio">
                  <div v-for="(val,index) in attributeValueList" style="white-space: nowrap">
                    <el-radio  :label="index"  style="margin: 0 0 10px 1px ;">&nbsp;</el-radio>
                    <el-input style="width: 228px" placeholder="请输入..." v-model="val.attributeValue" :key="index"  :maxlength="200"></el-input>
                    <i class="el-icon-circle-close-outline style-i" style="color: red;font-size: 16px" @click="deleteRadio(index,attributeValueList)" v-if="index !=0"></i>
                    <i class="el-icon-circle-plus-outline style-i" style="font-size: 16px"  @click="addRadio" v-if="index !=9"></i>
                  </div>
                </el-radio-group>
              </div>

            </div>
          </div>

          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addClick">确 定</el-button>
          </span>
        </el-dialog>
        <!--查看日志-->
        <li v-if="authorityCode.WMS_BATCHSETUP_LOG" @click="publicLogBtn"><span>查看日志</span></li>
        <publicLogDialog
          @changShow="changDialogShow"
          :paramObj="paramObj"
          :pulicLogVisible="pulicLogVisible">
        </publicLogDialog>
      </ul>
    </div>
    <!--表格1-->
    <div class="pDown">
      <el-table id="tableH" :data="tableData1" border :max-height="table_h" style="width: 100%">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="属性名称" width="200">
          <template slot-scope="scope">
            {{ scope.row.attributeName }}
          </template>
        </el-table-column>

        <el-table-column label="属性类型" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.attributeType == 1">选项</span>
            <span v-if="scope.row.attributeType == 2">文本</span>
          </template>
        </el-table-column>

        <el-table-column label="属性值">
          <template slot-scope="scope">
            {{ scope.row.attributeValues }}
          </template>
        </el-table-column>

        <el-table-column
          width="100"
          align="center"
          label="启用状态">
          <template slot-scope="scope">
            <el-switch v-if="authorityCode.WMS_BATCHSETUP_STATUS" v-model="scope.row.enabledFlag" @click.native="switchChange(scope.row)"></el-switch>
            <el-switch v-else disabled v-model="scope.row.enabledFlag" @click.native="switchChange(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="177" align="center">
          <template slot-scope="scope">
            <el-button  @click="handleModifyClick(scope.row,scope.$index)" type="text" size="small" v-if="authorityCode.WMS_BATCHSETUP_EDIT">修改</el-button>
            <el-button  @click="handleDelClick(scope.row)" ref="del" type="text" size="small" style="color: red" v-if="authorityCode.WMS_BATCHSETUP_DEL">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>
<script>
  import publicLogDialog from '@/components/common/publicLogDialog.vue'
  export default {
    components:{
      publicLogDialog
    },
    data() {
      return {
        version: '1.0.0',//版本号
        dialogName: '',//弹框名称

        attrName: '',//属性名称
        attrNameDialog: '',//弹框属性名称
        isAttrNameShow: false,//弹框属性名称判空
        attrDialog: '',//弹框单行文本属性值
        isAttrShow: false,//单行文本属性值判空

        table_h: 0,//表格高度
        tableData1: [],//批次设置表格数据

        pulicLogVisible:false,//查看日志弹框显示隐藏
        paramObj:{},//日志参数对象

        addDialogVisible: false,//添加弹框显示隐藏

        optionsChoseClass: [
          {value: 2,label: '单行文本'},
          {value: 1,label: '单选框'}],//属性类型下拉
        choseClass: 2,//默认为单选文本
        isAttrValShow: true,//默认单选文本输入框

        attributeValueList: [{}],//单选框值

        radio: 0,//默认显示
        row: [],//当前行所选数据

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限
      }
    },
    mounted() {
      this.initBatchList();//初始化页面数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });
    },
    methods: {

      //初始化页面数据接口
      initBatchList: function () {
        let data = {
          attributeName: this.attrName
        };
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/showBatchList',data).then(function (res) {
          if(res.data.success) {
            if(res.data.result != undefined) {
              this.tableData1 = res.data.result
            }
            console.log(res.data.result)
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //启用状态接口
      initSwitchChange: function (row) {
        let data = {
          attributeId: row.attributeId,
          enabledFlag: row.enabledFlag
        };
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/editBatchEnable',data)
          .then(function (res) {
              if(res.data.success) {
                this.initBatchList()
              }else {
                this.$alert(res.data.msg, {
                  type: 'warning',
                  center: true,
                  confirmButtonText: '确定'
                });
                this.initBatchList()
              }
            }.bind(this)
          )
      },

      //新增接口
      initInsertBatch: function () {
        let arr = [];
        console.log(this.attributeValueList);
        this.attributeValueList.forEach(function (val,index) {
          if(index == this.radio) {
            arr.push({attributeValue: val.attributeValue,defaultValueFlag: '1'})
          }else {
            arr.push({attributeValue: val.attributeValue,defaultValueFlag: '0'})
          }
        }.bind(this));
        let data = {
          attributeName: this.attrNameDialog,
          attributeType: this.choseClass,
          attributeValueListJson: JSON.stringify(arr)
        };
        console.log('新增参数',data);
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/insertBatch',data).then(function (res) {
          if(res.data.success) {
            this.addDialogVisible = false;
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.initBatchList()
          }else {
            this.$alert(res.data.msg, {
              type: 'warning',
              center: true,
              confirmButtonText: '知道了'
            });
          }
        }.bind(this))
      },

      //修改回显接口
      initEchoBatch: function (row) {
        let data = {
          attributeId: row.attributeId
        };
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/echoBatchAttribute',data).then(function (res) {
          if(res.data.success) {
            if(res.data.result.attributeType == 2) {
              this.isAttrValShow = true;
              this.attributeValueList = [{}]
            }else {
              this.isAttrValShow = false;
              this.attributeValueList = res.data.result.attributeValueBeans
            }

            this.attrNameDialog = res.data.result.attributeName;
            this.choseClass = res.data.result.attributeType;

          }else {
            this.$alert(res.data.msg, {
              type: 'warning',
              center: true,
              confirmButtonText: '知道了'
            });
          }
        }.bind(this))
      },

      //保存修改接口
      initUpdateBatch: function () {
        let data = {
          attributeId :this.row.attributeId,
          attributeName: this.attrNameDialog,
          attributeType: this.choseClass,
          attributeValueListJson: JSON.stringify(this.attributeValueList)
        };
        console.log('修改参数=>',data);
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/updateBatch',data).then(function (res) {
          if(res.data.success) {
            this.addDialogVisible = false;
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.initBatchList()
          }else {
            this.$alert(res.data.msg, {
              type: 'warning',
              center: true,
              confirmButtonText: '知道了'
            });
          }
        }.bind(this))
      },

      //删除接口
      initDeleteBatch: function (row) {
        let data = {
          attributeId: row.attributeId
        };
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/deleteBatch',data).then(function (res) {
          if(res.data.success) {
            this.addDialogVisible = false;
            this.initBatchList()
          }else {
            this.$alert(res.data.msg, {
              type: 'warning',
              center: true,
              confirmButtonText: '知道了'
            });
          }
        }.bind(this))
      },

      //查询
      search: function () {
        this.initBatchList();
      },

      //启用状态
      switchChange: function (row) {
        this.initSwitchChange(row)
      },

      //重置弹框
      resetDialog: function () {
        this.isAttrValShow = true;
        this.attrNameDialog = '';
        this.choseClass = 2;
        this.attributeValueList = [{}]
      },

      //添加/修改属性
      handleModifyClick: function (row,index) {

        this.row = row;
        if(index == undefined) {
          this.dialogName = '添加批次属性';
          this.resetDialog();
        }else {
          this.dialogName = '修改批次属性';
          this.initEchoBatch(row)
        }

        this.addDialogVisible = true
      },

      //删除
      handleDelClick: function (row,index) {
        this.initDeleteBatch(row)
      },

      //添加/修改属性弹框确定
      addClick: function (val) {
        if(this.row.attributeId == undefined) {
          this.initInsertBatch()
        }else {
          this.initUpdateBatch()
        }
      },

      //单选框和单行文本切换
      changeAttr: function (val) {
        if(val == 2) {
          this.isAttrValShow = true
        }else {
          this.isAttrValShow = false
        }
      },

      //添加单选
      addRadio: function () {
        this.attributeValueList.push({})
      },

      //删除属性值
      deleteRadio: function (index,data) {
        data.splice(index,1)
      },

      //查看日志
      publicLogBtn: function () {
        this.pulicLogVisible = true;
        this.paramObj.moduleId= 31;//单据类型
        this.paramObj.billCode='';//操作项id
        this.paramObj.typeId='';//操作类型
      },

      //关闭日志弹窗
      changDialogShow(){
        this.pulicLogVisible=false;
      },
    }
  }
</script>
