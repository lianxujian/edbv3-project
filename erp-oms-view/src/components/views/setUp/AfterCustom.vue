<!--单据自定义属性管理 尘音-->
<template>
  <div id="afterCustom">
    <!--操作导航-->
    <div class="col-nav" style="margin:0 0 10px">
      <ul style="margin-bottom: 0">
        <li @click="handleModifyClick"><span>添加</span></li>
        <el-dialog v-dialogDrag
          :title="dialogName"
          :visible.sync="addDialogVisible"
          width="500px"
          center>

          <div class="contentBox">
            <!--属性名称-->
            <div class="grid-content">
              <label for="attrNameDialog"><span style="color: red">*</span>属性名称 </label>
              <el-input maxlength="10" id="attrNameDialog" v-model="attrNameDialog"></el-input>
            </div>
            <!--属性类型-->
            <div class="grid-content">
              <label for="choseClass"><span style="color: red">*</span>属性类型 </label>
              <el-select id="choseClass" v-model="choseClass" filterable>
                <el-option
                  v-for="(item,index) in optionsChoseClass"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <!--属性值-->
            <div class="grid-content" style="position: relative">
              <div style="position: absolute;top: 0;left: 18px">
                <label v-if="choseClass == 1" for="attrDialog"><span style="color: red">*</span>属性值 </label>
                <label v-else for="attrDialog" style="color: #ccc"><span>*</span>属性值 </label>
              </div>
              <div id="attrDialog" v-if="choseClass == 1" style="display: inline-block;margin-left: 63px">
                <div v-for="(val,index) in attributeValueList" style="white-space: nowrap">
                  <el-input style="width: 260px" @blur="valueBlur(index,attributeValueList)" v-model="val.attributeValue" :key="index"  :maxlength="50"></el-input>
                  <el-button type="text" style="color: red;margin-right: -10px" @click="deleteAttr(index,attributeValueList)" v-if="val.isDeleteAttrShow">删除</el-button>
                  <el-button type="text" style="color: blue;"  @click="addAttr(index,val)" v-if="val.isAddAttrShow">添加</el-button>
                </div>
              </div>
              <div v-else style="display: inline-block;margin-left: 63px">
                <div>
                  <el-input disabled style="width: 260px"></el-input>
                </div>
              </div>
            </div>
            <!--业务单据-->
            <div class="grid-content">
              <label for="choseClass"><span style="color: red">*</span>业务单据 </label>
              <el-select id="business" v-model="businessType" multiple>
                <el-option
                  v-for="(item,index) in optionsBusiness"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>

          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addClick(businessType)">确 定</el-button>
          </span>
        </el-dialog>
        <!--查看日志-->
        <li @click="publicLogBtn"><span>查看日志</span></li>
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
            <span v-if="scope.row.attributeType == 1">下拉框</span>
            <span v-if="scope.row.attributeType == 2">单行文本</span>
            <span v-if="scope.row.attributeType == 3">多行文本</span>
          </template>
        </el-table-column>

        <el-table-column label="属性值">
          <template slot-scope="scope">
            <span v-if="scope.row.attributeValues == undefined">-</span>
            <span v-else>{{ scope.row.attributeValues }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="100"
          align="center"
          label="启用状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabledFlag" @click.native="switchChange(scope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="177" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.enabledFlag == false" @click="handleModifyClick(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
            <el-button disabled v-if="scope.row.enabledFlag == true" @click="handleModifyClick(scope.row,scope.$index)" type="text" size="small">编辑</el-button>
            <el-button v-if="scope.row.enabledFlag == false"  @click="handleDelClick(scope.row)" ref="del" type="text" size="small" style="color: red">删除</el-button>
            <el-button disabled v-if="scope.row.enabledFlag == true" @click="handleDelClick(scope.row)" ref="del" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>
<script>
  import publicLogDialog from '@/components/common/publicLog.vue'
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

        table_h: 0,//表格高度
        tableData1: [],//批次设置表格数据

        pulicLogVisible:false,//查看日志弹框显示隐藏
        paramObj:{},//日志参数对象

        addDialogVisible: false,//添加弹框显示隐藏

        optionsChoseClass: [
          {value: '',label: '请选择'},
          {value: 1,label: '下拉框'},
          {value: 2,label: '单行文本'},
          {value: 3,label: '多行文本'}],//属性类型下拉
        choseClass: '',//默认为单选文本

        attributeValueList: [{isAddAttrShow: true,isDeleteAttrShow: false}],//下拉框值
        row: [],//当前行所选数据
        optionsBusiness: [{value: 1, label: '售后单'}],//业务类型下拉枚举
        businessType: [1],//业务类型值
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
        this._post('com.edb01.erp.ass.service.api.AfterAttributeDefineService/' + this.version + '/showList').then(function (res) {
          if(res.data.success) {
            if(res.data.result != undefined) {
              this.tableData1 = res.data.result
            }
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
        this._post('com.edb01.erp.ass.service.api.AfterAttributeDefineService/' + this.version + '/editIsEnable',data)
          .then(function (res) {
              if(res.data.success) {
                this.initBatchList()
              }else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
                this.initBatchList()
              }
            }.bind(this)
          )
      },

      //新增接口
      initInsertBatch: function () {
        let arr = [];
        this.attributeValueList.forEach(function (val) {
          arr.push({attributeValue: val.attributeValue,defaultValueFlag: false})
        }.bind(this));
        let data = {
          attributeName: this.attrNameDialog,
          attributeType: this.choseClass,
          businessType: this.businessType,
          attributeValueListJson: JSON.stringify(arr)
        };
        this._post('com.edb01.erp.ass.service.api.AfterAttributeDefineService/' + this.version + '/insert',data).then(function (res) {
          if(res.data.success) {
            this.addDialogVisible = false;
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.initBatchList()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //修改回显接口
      initEchoBatch: function (row) {
        let data = {
          attributeId: row.attributeId
        };
        this._post('com.edb01.erp.ass.service.api.AfterAttributeDefineService/' + this.version + '/select',data).then(function (res) {
          if(res.data.success) {
            this.attrNameDialog = res.data.result.attributeName;
//            this.businessType = res.data.result.businessType;
            this.businessType = [1];
            this.choseClass = res.data.result.attributeType;

            let len = res.data.result.attributeValueBeans.length;

            if(this.choseClass == 1) {
              if(len == 0) {
                this.attributeValueList = [{isAddAttrShow: true,isDeleteAttrShow: false}];
              }else {
                this.attributeValueList = res.data.result.attributeValueBeans;
                this.attributeValueList.forEach(item => {
                  item.isDeleteAttrShow = true
                });
                this.attributeValueList[0].isDeleteAttrShow = false;
                this.attributeValueList[len - 1].isAddAttrShow = true;
              }
            }

          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
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
          businessType: this.businessType,
          attributeValueListJson: JSON.stringify(this.attributeValueList)
        };
        this._post('com.edb01.erp.ass.service.api.AfterAttributeDefineService/' + this.version + '/update',data).then(function (res) {
          if(res.data.success) {
            this.addDialogVisible = false;
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.initBatchList()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //删除接口
      initDeleteBatch: function (row) {
        let data = {
          attributeId: row.attributeId
        };
        this._post('com.edb01.erp.ass.service.api.AfterAttributeDefineService/' + this.version + '/delete',data).then(function (res) {
          if(res.data.success) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initBatchList()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //启用状态
      switchChange: function (row) {
        this.initSwitchChange(row)
      },

      //重置弹框
      resetDialog: function () {
        this.attrNameDialog = '';
        this.choseClass = '';
        this.attributeValueList = [{isAddAttrShow: true,isDeleteAttrShow: false}];

        $('#attrNameDialog').css('border','1px solid #dcdfe6');
        $('#choseClass').css('border','1px solid #dcdfe6')
      },

      //添加/修改属性
      handleModifyClick: function (row,index) {
        $('#attrDialog').find('.el-input__inner').css('border','1px solid #dcdfe6');
        this.row = row;
        this.resetDialog();
        if(index == undefined) {
          this.dialogName = '添加自定义属性';
        }else {
          this.dialogName = '修改自定义属性';
          this.initEchoBatch(row)
        }

        this.addDialogVisible = true
      },

      //删除
      handleDelClick: function (row,index) {
        this.initDeleteBatch(row)
      },

      //输入校验
      checkInto: function () {

        if(this.attrNameDialog == '') {
          this.$message({
            message: '请输入属性名称',
            type: 'warning'
          });
          $('#attrNameDialog').css('border','1px solid red')
        }
        else if(this.choseClass == '') {
          this.$message({
            message: '请选择属性类型',
            type: 'warning'
          });
          $('#attrNameDialog').css('border','1px solid #dcdfe6');
          $('#choseClass').css('border','1px solid red')
        }
        else {
          $('#choseClass').css('border','1px solid #dcdfe6');
          if(this.choseClass == 1) {
            let val = this.attributeValueList[this.attributeValueList.length - 1].attributeValue;
            let attrDiv = $('#attrDialog').find('.el-input__inner')[this.attributeValueList.length - 1];
            if(val == undefined || val == '') {
              this.$message({
                message: '请输入属性值',
                type: 'warning'
              });
              $(attrDiv).css('border','1px solid red')
            }else {
              $(attrDiv).css('border','1px solid #dcdfe6');
              return true
            }
          }else {
            return true
          }
        }
      },

      //添加/修改属性弹框确定
      addClick: function (val) {
        let arr = [];
        if(this.checkInto()) {
          if(this.row.attributeId == undefined) {
            this.tableData1.forEach(item => {
              if(item.businessType == val) {
                arr.push(item)
              }
            });
            if(arr.length >= 10) {
              this.$message({
                message: '每种单据最多可添加10个售后属性',
                type: 'warning'
              })
            }else {
              this.initInsertBatch()
            }
          }else {
            this.initUpdateBatch()
          }
        }
      },

      //添加单选
      addAttr: function (index,val) {
        let value = this.attributeValueList[index].attributeValue;
        let attrDiv = $('#attrDialog').find('.el-input__inner')[index];

        if(value == undefined || value == '') {
          this.$message({
            message: '请输入属性值',
            type: 'warning'
          });
          $(attrDiv).css('border','1px solid red')
        }else {
          $(attrDiv).css('border','1px solid #dcdfe6');
          this.attributeValueList.push({isAddAttrShow: true,isDeleteAttrShow: true});
          let len = this.attributeValueList.length;
          if(index == 0 && len != 1) {
            this.attributeValueList[0].isAddAttrShow = false
          }else {
            this.attributeValueList.forEach(item => {
              item.isAddAttrShow = false
            });
            this.attributeValueList[index + 1].isAddAttrShow = true
          }
        }
      },

      //删除属性值
      deleteAttr: function (index,data) {
        data.splice(index,1);
        let len = this.attributeValueList.length;
        if(len == 1) {
          this.attributeValueList[0].isAddAttrShow = true;
          this.attributeValueList[0].isAddDeleteShow = false;
        }else {
          if(index == len) {
            this.attributeValueList[index - 1].isAddAttrShow = true
          }else {
            this.attributeValueList[index].isAddAttrShow = true
          }
        }
      },

      //查看日志
      publicLogBtn: function () {
        this.pulicLogVisible = true;
        this.paramObj.moduleId= 59;//单据类型
        this.paramObj.billCode='';//操作项id
        this.paramObj.typeId='';//操作类型
      },

      //关闭日志弹窗
      changDialogShow(){
        this.pulicLogVisible=false;
      },

      //属性值去空格
      valueBlur: function (index,data) {
        data[index].attributeValue = data[index].attributeValue.trim()
      },
    }
  }
</script>
