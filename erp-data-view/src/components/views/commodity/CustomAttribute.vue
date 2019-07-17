<!--自定义属性  方证/贾南风 -->
<template>
  <div class="app-container" id="customAttribute">
    <!--<div class="tool-container">
      <el-button @click="editExtcol('create')" type="text" plain icon="el-icon-plus" >{{$t('extcol.create')}}</el-button>
      <el-button @click="publicLogBtn" type="text" plain style="margin-left: 10px">{{$t('extcol.viewLog')}}</el-button>
    </div>-->
    <div class="col-nav">
      <ul style="margin: 0!important;">
        <li @click="clickAdd" v-if="authorityCode.DATA_CUSTOMATTRIBUTE_ADD"><span>{{$t("extcol.create")}}</span></li>
        <li @click="publicLogBtn()"><span>{{$t("extcol.viewLog")}}</span></li>
      </ul>
    </div>
    <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    <div style="margin-top: 20px;">
      <el-table id="tabExtcol" tooltip-effect="dark" :data="list" v-loading.body="listLoading" border :height="tabHeight" style="width: 100%">
        <el-table-column type="index" :label="$t('extcol.index')" align="center" fix width="50">
        </el-table-column>
        <el-table-column :label="$t('extcol.extcolName')" header-align="center" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.attributeName}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('extcol.extcolType')" header-align="center" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.attributeType == 1">单选框</span>
            <span v-if="scope.row.attributeType == 2">复选框</span>
            <span v-if="scope.row.attributeType == 3">单行文本</span>
            <span v-if="scope.row.attributeType == 4">多行文本</span>
            <span v-if="scope.row.attributeType == 5">时间选择器</span>
            <span v-if="scope.row.attributeType == 6">时间区间选择器</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('extcol.extNames')" :show-overflow-tooltip="true" show-overflow-tooltip header-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.attributeValues}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('extcol.isenable')" align="center" width="100">
          <template slot-scope="scope">
            <el-switch v-if="authorityCode.DATA_CUSTOMATTRIBUTE_START" v-model="scope.row.enabledFlag" @change="enableExtcol(scope.row)"></el-switch>
            <el-switch v-else v-model="scope.row.enabledFlag" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('extcol.operation')" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="text" v-if="authorityCode.DATA_CUSTOMATTRIBUTE_AMEND" @click="editTable(scope.row)" :disabled="scope.row.enabledFlag">{{$t('extcol.update')}}</el-button>
            <el-button type="text" v-if="authorityCode.DATA_CUSTOMATTRIBUTE_DEL" @click="deteleExtcol(scope.row)" :disabled="scope.row.enabledFlag" :style="{color: scope.row.enabledFlag ? '#C0C4CC':'red'}">{{$t('extcol.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>.
<!--添加编辑页面弹框-->
    <el-dialog v-dialogDrag :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="80px">
        <el-form-item :label="$t('extcol.extcolName')" prop="attributeName">
          <el-input v-model="temp.attributeName" :placeholder="$t('extcol.pleaseInput')" :maxlength=20 ></el-input>
        </el-form-item>
        <el-form-item :label="$t('extcol.extcolType')" prop="attributeType">
          <el-select class="filter-item" v-model="temp.attributeType">
            <el-option v-for="item in  extcolTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('extcol.extNames')" prop="attributeValues">
          <template v-if="temp.attributeType === 1">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.attributeValues" :placeholder="$t('extcol.inputOptions')" maxlength=200>
            </el-input>
          </template>
          <template v-else>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" label="" disabled>
            </el-input>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" align="center">
        <el-button @click="dialogFormVisible = false">{{$t('extcol.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="saveExtcol">{{$t('extcol.confirm')}}</el-button>
        <el-button v-else type="primary" @click="saveExtcol">{{$t('extcol.confirm')}}</el-button>
      </div>
    </el-dialog>
    <!--添加自定义属性弹框页面-->
    <div>
      <el-dialog v-dialogDrag title="添加" :visible.sync="dialogAdd" width="600px">
        <el-form>
          <el-form-item>
            <span class="span">*</span>
            <label>属性名称</label>
            <el-input v-model="temp.attributeName" placeholder="请输入..." style="width: 50%;" :maxlength=20></el-input>
          </el-form-item>
          <el-form-item>
            <span class="span">*</span>
            <label>属性类型</label>
            <el-select class="filter-item" v-model="temp.attributeType" style="width:244px">
              <el-option v-for="item in  extcolTypeOptions" :key="item.key" :label="item.display_name"
                         :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="temp.attributeType == 1">
            <span class="span span1">*</span>
            <label>属性值</label>
            <div class="box-wrapper">
              <el-radio-group v-model="radio">
                <div v-for="(city,index) in radios" style="white-space: nowrap">
                <el-radio  :label="city.id"  style="margin: 0 0 10px 1px ;">&nbsp;</el-radio>
                  <el-input placeholder="请输入..." v-model="city.attributeValue" :id="index"  :maxlength="20"></el-input>
                  <i class="el-icon-circle-close-outline style-i" style="color: red" @click="deleteRadio(index)" v-if="index !=0"></i>
                  <i class="el-icon-circle-plus-outline style-i"  @click="addRadio" v-if="index == radioLength && index !=9"></i>
                </div>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item v-if="temp.attributeType == 2">
            <span class="span span1">*</span>
            <label>属性值</label>
            <div class="box-wrapper">
              <el-checkbox-group v-model="checkedCities">
                <div v-for="(city,index) in cities" style="white-space: nowrap">
                <el-checkbox  :label="city.id" :key="city.id"  style="margin:-5px 0 0 1px;">
                  &nbsp;
                </el-checkbox>
                  <el-input style="width: 200px;" v-model="city.attributeValue" placeholder="请输入..." :id="index+100" :maxlength="20" @keyup.native="stopM(index,1)"></el-input>
                  <i class="el-icon-circle-close-outline style-i" style="color: red" @click="deleteCheckBox(index)" v-if="index !=0"></i>
                  <i class="el-icon-circle-plus-outline style-i" v-if="index == checkLength && index != 9" @click="addCheckbox"></i>
                </div>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item v-if="temp.attributeType == 3">
            <span class="span span1">*</span>
            <label>属性值</label>
            <el-input :disabled="true" placeholder="请输入..." style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item v-if="temp.attributeType == 4">
            <span class="span span1">*</span>
            <label>属性值</label>
            <el-input :disabled="true" type="textarea" :rows="2" placeholder="请输入..." style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item v-if="temp.attributeType == 5">
            <span class="span span1">*</span>
            <label>属性值</label>
            <el-date-picker
              type="date"
              :disabled="true"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="temp.attributeType == 6">
            <span class="span span1">*</span>
            <label>属性值</label>
            <el-date-picker
              :disabled="true"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" align="center">
          <el-button @click="dialogAdd = false">取 消</el-button>
          <el-button type="primary" @click="addCustomAttribute">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--编辑自定义属性的弹层页面-->
    <div>
      <el-dialog v-dialogDrag title="编辑" :visible.sync="dialogAmend" width="600px">
        <el-form>
          <el-form-item>
            <span class="span">*</span>
            <label>属性名称</label>
            <el-input v-model="tempU.attributeName" placeholder="请输入..." style="width: 50%;" :maxlength=20></el-input>
          </el-form-item>
          <el-form-item>
            <span class="span">*</span>
            <label>属性类型</label>
            <el-select class="filter-item" v-model="tempU.attributeType" style="width:244px" @change="changeType">
              <el-option v-for="item in  extcolTypeOptions" :key="item.key" :label="item.display_name"
                         :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="tempU.attributeType == 1">
            <span class="span span1">*</span>
            <label>属性值</label>
            <div class="box-wrapper">
              <el-radio-group v-model="radioU">
                <div v-for="(city,index) in tempU.attributeValueBeans" style="white-space: nowrap">
                  <el-radio  :label="city.attributeValueId" :key="city.attributeValueId"  style="margin: 0 0 10px 1px ;">&nbsp;</el-radio>
                  <el-input placeholder="请输入..." v-model="city.attributeValue" :id="index + 50" :maxlength="20"></el-input>
                  <i class="el-icon-circle-close-outline style-i" style="color: red" @click="deleteRadioUpdate(index)" v-if="index !=0"></i>
                  <i class="el-icon-circle-plus-outline style-i"  @click="addRadioUpdate" v-if="index == tempU.attributeValueBeans.length-1 && index !=9"></i>
                </div>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item v-if="tempU.attributeType == 2">
            <span class="span span1">*</span>
            <label>属性值</label>
            <div class="box-wrapper">
              <el-checkbox-group v-model="checkedCitiesU" @change="handleCheckedCitiesChange">
                <div v-for="(city,index) in tempU.attributeValueBeans" style="white-space: nowrap">
                  <el-checkbox  :label="city.attributeValueId" :key="city.attributeValueId"   style="margin:-5px 0 0 1px;">
                    &nbsp;
                  </el-checkbox>
                  <el-input style="width: 200px;" v-model="city.attributeValue" placeholder="请输入..." :id="index + 60" :maxlength="20" @keyup.native="stopM(index,2)"></el-input>
                  <i class="el-icon-circle-close-outline style-i" style="color: red" @click="deleteCheckBoxUpdate(index)" v-if="index !=0"></i>
                  <i class="el-icon-circle-plus-outline style-i" v-if="index == tempU.attributeValueBeans.length-1 && index != 9" @click="addCheckboxUpdate"></i>
                </div>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item v-if="tempU.attributeType == 3">
            <span class="span span1">*</span>
            <label>属性值</label>
            <el-input :disabled="true" placeholder="请输入..." style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item v-if="tempU.attributeType == 4">
            <span class="span span1">*</span>
            <label>属性值</label>
            <el-input :disabled="true" type="textarea" :rows="2" placeholder="请输入..." style="width: 210px"></el-input>
          </el-form-item>
          <el-form-item v-if="tempU.attributeType == 5">
            <span class="span span1">*</span>
            <label>属性值</label>
            <el-date-picker
              type="date"
              :disabled="true"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="tempU.attributeType == 6">
            <span class="span span1">*</span>
            <label>属性值</label>
            <el-date-picker
              :disabled="true"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" align="center">
          <el-button @click="dialogAmend = false">取 消</el-button>
          <el-button type="primary" @click="UpdateCustomAttribute">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  //import { fetchExtcolList, getExtcol, enableExtcol, addExtcol, updateExtcol, deleteExtcol } from '@/api/productText'
  import publicLog from '@/components/common/publicLog.vue'
  const cityOptions = [{id:1,defaultValueFlag:'',attributeValue:''}]; // checkbox
  const cityOptionsRadio = [{id:1,defaultValueFlag:'',attributeValue:''}]; // radio
  export default {
    name: '',
    components: {
      'v-Publiclog': publicLog
    },
    data() {
      var _templateData = {
        attributeTemplateId: undefined,
        attributeName: '',
        attributeType: 1,
        attributeValues: ''
      }
      var _temp = JSON.parse(JSON.stringify(_templateData))

      var validateExtcolTypeid = (rule, value, callback) => {
        if (value == 1) {
          this.rules['attributeValues'][0].required = true
        } else {
          this.rules['attributeValues'][0].required = false
        }
        this.$refs.dataForm.validateField('attributeValues');
        callback();
      };
      var validateExtNames = (rule, value, callback) => {
        if (!value && this.temp.extcolTypeid === 1) {
          callback(new Error('属性类型为[选项]，属性值必须输入！'));
        } else {
          callback();
        }
      };
      return {
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        dog: false,// 看门
        // 添加
        radio: 1,// 属性值 radio
        checkedCities: [1], // 属性值 checkbox
        //value4:'',
        //value1: '',
        //checkbox: [],
        cities: cityOptions, // 复选框的值
        radios: cityOptionsRadio, // 单选框的值
        radioLength: cityOptionsRadio.length-1, // 确保最好一个
        checkLength: cityOptions.length-1, // 确保最好一个
        dialogAdd: false, // 添加
        temp:{ // 添加数据
          attributeName: '',
          attributeType: 1,
          attributeValueListJson: [],
          enabledFlag: true
        },
        // 编辑
        dialogAmend: false, // 编辑
        tempU: {},// 编辑数据
        radioU: '',
        checkedCitiesU: [], // 复选框回显
        /*-------------------------------------------*/
        apiVersion: '1.0.0', // 版本号
        paramObj:{},//日志
        pulicLogVisible:false,
//        billTypeid: 0,
//        billCode: '',
//        pulicLogVisible: false,
        list: null,
        num: 100,
        listLoading: false,
        extcolTypeOptions: [ // 属性类型
          { key: 1, display_name: '单选框' },
          { key: 2, display_name: '复选框' },
          { key: 3, display_name: '单行文本' },
          { key: 4, display_name: '多行文本' },
          { key: 5, display_name: '时间选择器' },
          { key: 6, display_name: '时间区间选择器' }
        ],
        extcolType: {
          1: this.$t('extcol.options'),
          2: this.$t('extcol.text')
        },
        templateData: _templateData,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {// 添加
          update: this.$t('extcol.update'),
          create: this.$t('extcol.create')
        },
        rules: { // 表单验证规则
          attributeName: [{ required: true, message: this.$t('extcol.extcolNameNotNull'), trigger: 'blur' }],
          attributeType: [{ required: true, validator: validateExtcolTypeid, trigger: 'change' }],
          attributeValues: [{ required: true, validator: validateExtNames, trigger: 'blur' }]
        },
        tabHeight: null // 高度
      }
    },
    mounted() {
      window.onresize = () => {
        this.onResize()
      }
    },
    created() {
      this.getList();
      this.$nextTick(() => {
        this.onResize()
      })
    },
    methods: {
      // 输入触发方法
      stopM(index,num) {
        if(event.keyCode == 186 && num == 1){
          this.cities[index].attributeValue = '';
        }else if(event.keyCode == 186 && num == 2){
          this.$nextTick( () => {
            this.tempU.attributeValueBeans[index].attributeValue = '';
          })
        }
      },
      // checkbox
      handleCheckedCitiesChange(val) {
        console.log(val);
      },
      // 点击添加
      clickAdd() {
        //console.log(this.list);
        if(this.list == undefined){

        }else{
          // 自定义属性最多添加15个
          if(this.list.length == 15) {
            this.$message({
              message: '自定义属性最多添加15个',
              type: 'warning'
            })
            return false
          }
        }

        // 重置单选按钮
        cityOptionsRadio.splice(0,cityOptionsRadio.length);
        cityOptionsRadio.push({id:1,defaultValueFlag:'',attributeValue:''});
        this.radioLength = cityOptionsRadio.length - 1;

        // 重置复选框
        cityOptions.splice(0,cityOptions.length);
        cityOptions.push({id:1,defaultValueFlag:'',attributeValue:''});
        this.checkLength = cityOptions.length -1;

        this.dialogAdd = true
        this.temp.attributeName = '';
        this.temp.attributeType = 1;
        this.temp.attributeValueListJson = [];
      },
      // 添加区域操作--------------------------------------------------------------------------
      // 删除单选框
      deleteRadio(index){
        if(this.radio == cityOptionsRadio[index].id){
           cityOptionsRadio.splice(index,1);
           this.radio = 1;
         }else{
           cityOptionsRadio.splice(index,1);
         }
        this.radioLength = cityOptionsRadio.length -1;  // 删除时也要判断值的变化
      },
      // 删除复选框
      deleteCheckBox(index) {
        cityOptions.splice(index,1);
        this.checkLength = cityOptions.length -1;  // 删除时也要判断值的变化
      },
      // 点击添加单选按钮
      addRadio() {
        cityOptionsRadio.push({id:cityOptionsRadio[cityOptionsRadio.length-1].id + 1, defaultValueFlag: '',attributeValue: ''});
        this.radioLength = cityOptionsRadio.length-1;
        this.$nextTick(() => {
          switch(this.radioLength){
            case 1:
              $('#1').focus();
              break;
            case 2:
              $('#2').focus();
              break;
            case 3:
              $('#3').focus();
              break;
            case 4:
              $('#4').focus();
              break;
            case 5:
              $('#5').focus();
              break;
            case 6:
              $('#6').focus();
              break;
            case 7:
              $('#7').focus();
              break;
            case 8:
              $('#8').focus();
              break;
            case 9:
              $('#9').focus();
              break;
          }
        })
      },
      // 点击添加复选框
      addCheckbox() {
          cityOptions.push({id:cityOptions[cityOptions.length-1].id + 1, defaultValueFlag: '',attributeValue: ''});
            this.checkLength = cityOptions.length - 1;
        this.$nextTick(() => {
          switch(this.checkLength){
            case 1:
              $('#101').focus();
              break;
            case 2:
              $('#102').focus();
              break;
            case 3:
              $('#103').focus();
              break;
            case 4:
              $('#104').focus();
              break;
            case 5:
              $('#105').focus();
              break;
            case 6:
              $('#106').focus();
              break;
            case 7:
              $('#107').focus();
              break;
            case 8:
              $('#108').focus();
              break;
            case 9:
              $('#109').focus();
              break;
          }
        })
      },
      // 添加自定义属性的保存
      addCustomAttribute() {
        if(this.temp.attributeName == '') {
          this.$message({
            message: '请输入属性名称',
            type: 'warning'
          });
          return false
        }
        // 处理单选复选的逻辑
        if(this.temp.attributeType == 1){
          for(var item of cityOptionsRadio){
            if(item.attributeValue == ''){
              this.$message({
                message: '请填写完整的属性值',
                type: 'warning'
              });
              return false
            }
          }
          // 处理选择的值
          for (var item of cityOptionsRadio) {
            if (item.id == this.radio){
              item.defaultValueFlag = true;
            }else{
              item.defaultValueFlag = false;
            }
          }

          if(cityOptionsRadio.length <= 1){
            this.$message({
              message: '添加的属性值必须大于等于两个',
              type: 'warning'
            });

            return false;
          }
          this.temp.attributeValueListJson = JSON.stringify(cityOptionsRadio)
        }else if(this.temp.attributeType == 2){
          // 处理复选的逻辑
          for(var item of cityOptions){
            if(item.attributeValue == ''){
              this.$message({
                message: '请填写完整的属性值',
                type: 'warning'
              });
              return false
            }
          }
          for(var item of cityOptions){
            for(var item1 of this.checkedCities){
              if(item1 == item.id){
                item.defaultValueFlag = true;
                break;
              }else{
                item.defaultValueFlag = false;
                break;
              }
            }
          }

          if(cityOptions.length <= 1){
            this.$message({
              message: '添加的属性值必须大于等于两个',
              type: 'warning'
            });

            return false;
          }
          this.temp.attributeValueListJson = JSON.stringify(cityOptions)
        }
        console.log(this.temp);
        // 添加的请求
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.apiVersion + '/insert',this.temp)
          .then(res => {
            if(res.data.code == 0){
              this.dialogAdd = false;
              this.getList();
              this.$message({
                message: '添加成功',
                type: 'success'
              });
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      // 编辑区域操作----------------------------------------------------------------------------------
      // 删除单选框
      deleteRadioUpdate(index){
        if(this.radioU == this.tempU.attributeValueBeans[index].attributeValueId){
          this.tempU.attributeValueBeans.splice(index,1);
          this.radioU = this.tempU.attributeValueBeans[0].attributeValueId
        }else{
          this.tempU.attributeValueBeans.splice(index,1);
          if(this.dog){
            this.dialogAmend = false;
            this.dialogAmend = true;
          }
        }
      },
      // 删除复选框
      deleteCheckBoxUpdate(index) {
        this.tempU.attributeValueBeans.splice(index,1);
        if(this.dog){
          this.dialogAmend = false;
          this.dialogAmend = true;
        }
      },
      // 点击添加单选按钮
      addRadioUpdate() {
        console.log(this.tempU.attributeValueBeans);
        this.tempU.attributeValueBeans.push({attributeValueId:this.tempU.attributeValueBeans.length+1, defaultValueFlag: '',attributeValue: ''});
        setTimeout(() => {
          this.$nextTick(() => {
            switch(this.tempU.attributeValueBeans.length-1){
              case 1:
                $('#51').focus();
                break;
              case 2:
                $('#52').focus();
                break;
              case 3:
                $('#53').focus();
                break;
              case 4:
                $('#54').focus();
                break;
              case 5:
                $('#55').focus();
                break;
              case 6:
                $('#56').focus();
                break;
              case 7:
                $('#57').focus();
                break;
              case 8:
                $('#58').focus();
                break;
              case 9:
                $('#59').focus();
                break;
            }
          })
        },10);
        if(this.dog){
          this.dialogAmend = false;
          this.dialogAmend = true;
        }
      },
      // 点击添加复选框
      addCheckboxUpdate() {
        console.log(this.tempU.attributeValueBeans.length - 1);
        this.tempU.attributeValueBeans.push({attributeValueId:this.tempU.attributeValueBeans.length+1, defaultValueFlag: '',attributeValue: ''});
        setTimeout(() => {
          this.$nextTick(() => {
            switch(this.tempU.attributeValueBeans.length-1){
              case 1:
                $('#61').focus();
                break;
              case 2:
                $('#62').focus();
                break;
              case 3:
                $('#63').focus();
                break;
              case 4:
                $('#64').focus();
                break;
              case 5:
                $('#65').focus();
                break;
              case 6:
                $('#66').focus();
                break;
              case 7:
                $('#67').focus();
                break;
              case 8:
                $('#68').focus();
                break;
              case 9:
                $('#69').focus();
                break;
            }
          },10);
        });

        if(this.dog){
          this.dialogAmend = false;
          this.dialogAmend = true;
        }
      },
      // 改变类型
      changeType() {
        if(this.tempU.attributeType == 1 || this.tempU.attributeType == 2){
          this.tempU.attributeValueBeans = [{attributeValueId:1,defaultValueFlag: '',attributeValue: ''}]
        }
      },
      // 自定义属性的更新
      UpdateCustomAttribute() {
        if(this.tempU.attributeName == '') {
          this.$message({
            message: '请输入属性名称',
            type: 'warning'
          });
          return false
        }
        // 处理单选复选的逻辑
        if(this.tempU.attributeType == 1){
          for(var item of this.tempU.attributeValueBeans){
            if(item.attributeValue == ''){
              this.$message({
                message: '请填写完整的属性值',
                type: 'warning'
              });
              return false
            }
          }
          // 处理选择的值
          for (var item1 of this.tempU.attributeValueBeans) {
            if (item1.attributeValueId == this.radioU){
              item1.defaultValueFlag = true
            }else{
              item1.defaultValueFlag = false
            }
          }
          if(this.tempU.attributeValueBeans.length <= 1){
            this.$message({
              message: '添加的属性值必须大于等于两个',
              type: 'warning'
            });
            return false;
          }


          this.tempU.attributeValueListJson = JSON.stringify(this.tempU.attributeValueBeans);
          delete this.tempU.attributeValueBeans
        }else if(this.tempU.attributeType == 2){
          // 处理复选的逻辑
          for(var item of this.tempU.attributeValueBeans){
            if(item.attributeValue == ''){
              this.$message({
                message: '请填写完整的属性值',
                type: 'warning'
              });
              return false
            }
          }

          if(this.tempU.attributeValueBeans.length <= 1){
            this.$message({
              message: '添加的属性值必须大于等于两个',
              type: 'warning'
            });
            return false;
          }

          this.tempU.attributeValueBeans.forEach( item => {
            //console.log(this.checkedCitiesU.indexOf(item.attributeValueId));
            if(this.checkedCitiesU.indexOf(item.attributeValueId) != -1){
              item.defaultValueFlag = true;
            }else if(this.checkedCitiesU.indexOf(item.attributeValueId) == -1){
              item.defaultValueFlag = false;
            }
            delete item.merchantId
            });
          //console.log(this.tempU.attributeValueBeans);
          this.tempU.attributeValueListJson = JSON.stringify(this.tempU.attributeValueBeans);
          delete this.tempU.attributeValueBeans
        }else{
          this.tempU.attributeValueBeans = [];
        }
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.apiVersion + '/update',this.tempU)
          .then((res) => {
          if(res.data.success == true) {
            this.dialogAmend = false;
            this.getList();
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
          })

      },
      // 点击编辑自定义属性回显数据
      editTable(row) {
        this.dialogAmend = true;
        this.dog = false;
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.apiVersion + '/select', {attributeId: row.attributeId}).then(response => {
          if (response.data.success === true) {
            this.tempU = response.data.result;
            // 类型是单选框
            if(this.tempU.attributeType == 1) {
              for(var item of this.tempU.attributeValueBeans){
                if(item.defaultValueFlag == true){
                  this.$nextTick(() => {
                    this.radioU = item.attributeValueId
                  });
                  break;
                }
              }
              // 类型是复选框
            }else if(this.tempU.attributeType == 2){
              this.checkedCitiesU = [];
              for(var item1 of this.tempU.attributeValueBeans){
                if(item1.defaultValueFlag === true){
                    this.checkedCitiesU.push(item1.attributeValueId)
                }
              }
            }else{
              this.dog = true;
            }
            console.log(this.checkedCitiesU);
          }
        })
      },
      onResize() {
        const clientHeight = document.body.clientHeight
        this.tableTop = document.getElementById('tabExtcol').offsetTop
        if (clientHeight - this.tableTop - 35 > 100) {
          this.tabHeight = clientHeight - this.tableTop - 50
        } else {
          this.tabHeight = 100
        }
      },
      //  查看日志
      publicLogBtn() {
        this.paramObj.moduleId= 22;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true;
      },
      //  查看日志
      changDialogShow() {
        this.pulicLogVisible = false
      },
      // 数据渲染
      getList() {
        this.listLoading = true;
        //fetchExtcolList()
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.apiVersion + '/showList',{merchantId: 0}).then(response => {
          if (response.data.success === true) {
            this.list = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
            /* this.$confirm(response.data.msg, this.$t('extcol.loadError'), {
               showCancelButton: false,
               type: 'warning',
               center: true
             })*/
          }
        })
        this.listLoading = false
      },
      // 保存
      saveExtcol() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.temp.attributeType === 1) {
              var arr = this.temp.attributeValues.length > 0 ? this.temp.attributeValues.split(',') : [];
              var result = [];
              for (var i = 0; i < arr.length; i++) {
                if (result.indexOf(arr[i]) === -1 && arr[i] !== '') {
                  if (arr[i].length > 20) {
                    this.$message({
                      message: '属性值中，属性项长度不能超过20位',
                      type: 'warning',
                      duration: 1500
                    })
                    return
                  }
                  result.push(arr[i])
                }
              }
              this.temp.attributeValues = result.join(',');

              if (this.temp.attributeValues === '' || this.temp.attributeValues === undefined) {
                this.$message({
                  message: this.$t('extcol.410007'),
                  type: 'warning',
                  duration: 1500
                });
                return
              }
            }
            if (this.dialogStatus === 'create') {
              this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.apiVersion + '/insert',this.temp).then(response => {
                if (response.data.success === true) {
                  this.dialogFormVisible = false;
                  this.getList()
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning',
                    duration: 1500
                  })
                }
              })
            } else {
              this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.apiVersion + '/update',this.temp).then(response => {
                if (response.data.success === true) {
                  this.dialogFormVisible = false;
                  this.getList()
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning',
                    duration: 1500
                  })
                }
              })
            }
          }
        })
      },
      // 删除
      deteleExtcol(row) {
        this.$confirm(this.$t('extcol.confirmDelete') + this.$t('extcol.handleContinue'), this.$t('extcol.handlePrompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          const item = { attributeId: row.attributeId, attributeType: row.attributeType}
          this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.apiVersion + '/delete',item).then(response => {
            if (response.data.success === true) {
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning',
                duration: 1500
              })
            }
          })
        })
      },
      // 开启、关闭
      enableExtcol(row) {
        const _item = { attributeId: row.attributeId, enabledFlag: row.enabledFlag}
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.apiVersion + '/editIsEnable',_item).then(response => {
          if (response.data.success !== true) {
            this.$message({
              message: response.data.msg,
              type: 'warning',
              duration: 1500
            })
            row.enabledFlag = !row.enabledFlag
          }
        }).catch(() => {
          row.enabledFlag = !row.enabledFlag
        })
      }
    }
  }
</script>
<style scoped>
  #customAttribute label{
    font-size: 14px!important;
    margin-right: 10px;
  }
  .span{
    color: red;
  }
  .span1{
    padding-left: 12px;
  }
  .style-i{
    font-size: 20px;
    cursor: pointer;
    margin-left: 5px;
  }
  .box-wrapper{
    width: 260px;padding-left: 46px;margin:-36px 0 0  30px;
  }
</style>


