<!--快递单模板 贾南风-->
<template>
  <div id="expressTemplate">
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>模板名称：</label>
              <el-input  v-model="queryList.expressPrintTmplName" @keyup.enter.native="queryData()" :maxlength="50" placeholder="请输入模板名称" ></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>所属快递：</label>
              <select id="example-post" name="multiselect[]" multiple="multiple">
                <option  v-for="item in store" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox1">
        <el-button size="mini" type="primary" @click="queryData()">查 询</el-button>
      </div>
    </div>
    <div style="clear:both"></div>
    <div class="col-nav" style="margin:-10px 0 10px;">
      <ul>
        <li @click="addClick"><span>添加</span></li>
        <li @click="deleteTemplate"><span>删除</span></li>
        <li @click="getTm()"><span>获取菜鸟打印模板</span></li>
      </ul>
    </div>
    <div class="col-border">
      <el-table
        id="fitTable"
        :data="tableData"
        tooltip-effect="dark"
        :height="table_h"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          align="center"
          width="50"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          :show-overflow-tooltip="true"

          label="模板名称">
          <template slot-scope="scope">
            <div @mouseover="exitName(scope.$index)" @mouseleave="exitLeave" style="width: 100%;height: 100%;line-height: 35px">
            <el-input v-if="isShow && scope.$index == index"  :maxlength="50" v-model="scope.row.expressPrintTmplName" @blur="submitData(scope.row)" style="width: 80%"></el-input>
            <span v-else="!isShow && scope.$index == index"  style="color:#409EFF;cursor: pointer;" @click="exitT(scope.row)">{{scope.row.expressPrintTmplName}}</span>
            <i @click="showInput(scope.$index)" v-if="scope.$index == index" class="el-icon-edit" style="float: right;line-height: 35px;cursor: pointer;"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="面单类型">
          <template slot-scope="scope">
            <span v-if="scope.row.expsheetType == 2">纸质面单</span>
            <span v-if="scope.row.expsheetType == 1">电子面单</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="expressName"
          label="所属快递">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="打印模板类型">
          <template slot-scope="scope">
            <span v-if="scope.row.printTmplType == 2">软件创建模板</span>
            <span v-if="scope.row.printTmplType == 1">菜鸟模板</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="updateTime"
          label="最后修改时间">
        </el-table-column>
        <el-table-column
          prop="updater"
          align="center"
          width="100"
          label="修改人">
        </el-table-column>
      </el-table>
    </div>
    <!--添加模板-->
    <div>
      <el-dialog v-dialogDrag
        title="添加模板"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="500px">
        <el-form :model="addData" :rules="rules" ref="addData" label-width="100px" class="demo-ruleForm">
          <el-form-item label="模板名称" prop="expressPrintTmplName">
            <el-input v-model="addData.expressPrintTmplName" placeholder="请输入模板名称" :maxlength="50" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="面单类型" prop="expsheetType" required>
            <el-select v-model="addData.expsheetType" style="width: 90%" @change="changeType">
              <el-option
                v-for="item in expressType"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属快递" prop="expressId" v-if="isType">
            <el-select filterable v-model="addData.expressId" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in store"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="submitForm('addData')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--获取菜鸟-->
    <div>
      <el-dialog v-dialogDrag
        title="获取菜鸟打印模板"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible1"
        width="550px">
        <el-form :model="printData" :rules="rules1" ref="printData" label-width="100px" class="demo-ruleForm">
          <el-form-item label="店铺" prop="tmallShopId">
            <el-select v-model="printData.tmallShopId" placeholder="请选择" style="width: 90%">
              <el-option
                v-for="item in shopTm"
                :label="item.storeName"
                :value="item.storeId"
                :key="item.storeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogVisible1=false">取 消</el-button>
            <el-button type="primary" @click="submitP('printData')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
//        query: ()=>{},
        shopTm: [],// 淘宝店铺
        version: '1.0.0',
        store: [],//所属快递
        queryList: { // 查询数据
          expressPrintTmplName: '', // 模板名称
          expressId:'', // 快递ID
        },
        addData:{ // 添加的数据
          expressPrintTmplName: '', //模板名称
          expsheetType: '', //面单类型
          expressId: '', //快递ID
          printTmplType: 2 , // 打印模板类型
        },
        dialogVisible: false, // 添加/**/
        dialogVisible1: false, // 获取模板
        table_h: 0,//表格高度
        isShow: false,//是否显示输入框
        index: 'abc',//文本/输入框切换参数
        expressType: [
          {id: 1,name: '电子面单'},
          {id: 2,name: '纸质面单'}
        ],//面单类型
        tableData: [], // 数据列表
        isType: false,//是否展示所属快递
        checkBoxLength: [], //checkbox

        printData:{
          tmallShopId: ''
        },//获取菜鸟打印模板弹框数据

        //input校验
        rules1: {
          tmallShopId: [
            {required: true, message: '请选择店铺', trigger: 'blur'}
          ]
        },
        rules: {
          expsheetType: [
            { required: true, message: '请选择面单类型', trigger: 'blur' },
          ],
          expressPrintTmplName: [
            { required: true, message: '请输入模板名称', trigger: 'blur' },
          ],
          expressId: [
            { required: true, message: '请选择所属快递', trigger: 'blur' },
          ]
        },
      }
    },
    methods:{

      //获取菜鸟打印模板点击
      getTm() {
        this.printData.tmallShopId  = '';
        this.dialogVisible1 = true
      },

      // 查询数据
      queryData() {
        //this.query();

          if ($('#example-post').val().length == this.store.length) {
            this.queryList.expressId = ''
          }else {
            let arr = $('#example-post').val();
            let str = '';
            arr.forEach(item => {
              str += item + ','
            })
            this.queryList.expressId = str.slice(0,-1);
          }
        console.log(this.queryList);
        this.query();
      },

      // 跳转编辑页面
      exitT(row) {
        console.log(row);
        if(row.printTmplType == 2){ // 纸质
          this.$http.get('http://127.0.0.1:8082/design?stype=EVoucher' + '&templateid=' + row.expressPrintTmplId + '&cltoken=' + encodeURIComponent(sessionStorage.getItem('clToken')) + '&').then((res)=> {
            if(res.data.result == 'edb printer is running'){
              this.$message({
                message: '打印模板设计器正在运行，请关闭后重试。',
                type: 'warning'
              })
            }else if(res.data.result == 'false'){
              this.$message({
                message: '设计器打开失败',
                type: 'warning'
              })
            }
          })
        }else{ // 电子
         /* this.$http.get('http://127.0.0.1:8082/design?stype=SVoucher' + '&templateid=' + row.expressPrintTmplId + '&cltoken=' + encodeURIComponent(sessionStorage.getItem('clToken')) + '&').then( (res)=> {

            if(res.data.result == 'edb printer is running'){
              this.$message({
                message: '打印模板设计器正在运行，请关闭后重试。',
                type: 'warning'
              })
            }else if(res.data.result == 'false'){
              this.$message({
                message: '设计器打开失败',
                type: 'warning'
              })
            }
          })*/
        }
        /*this.$router.push({name: 'expressTemplate',params:{expressPrintTmplId: row.expressPrintTmplId}});*/
      },

      // 添加点击
      addClick() {
        this.dialogVisible = true;
        setTimeout(() => {
          this.$refs.addData.resetFields();
        },10)
      },

      // 点击删除模板
      deleteTemplate() {
        if(this.checkBoxLength.length == 0) {
          this.$message({
            message: '请选择要删除的模板',
            type: 'warning'
          })
          return false;
        }

        let str = '';
        this.checkBoxLength.forEach(item => {
          str+= item.expressPrintTmplId + ',';
        });
        this.$confirm('确定要删除选中的模板吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.wms.service.api.WmExpressPrintTmService/' + this.version + '/removeTemplent',{expressPrintTmplId: str.slice(0,-1)})
            .then( res => {
              if(res.data.success){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.query();
              }else{
                this.$message({
                  type: 'warning',
                  message: res.data.msg
                });
              }
            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      // 添加里的电子面单改变时
      changeType() {
        if(this.addData.expsheetType == 1){
          this.isType = false;
        }else if(this.addData.expsheetType == 2){
          this.isType = true;
        }
      },

      // 获取模板
      submitP(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._post('com.edb01.erp.wms.service.api.PrintTemplService/' + this.version + '/saveCainiaoPrintTempl',this.printData)
              .then(res => {
                if(res.data.success){
                  this.$message({
                    message: '获取菜鸟模板成功',
                    type: 'success'
                  });
                  this.dialogVisible1 = false;
                  this.queryData();
                }else{
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 添加模板
      submitForm(formName) {
        console.log(this.addData);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.addData.expsheetType == 1){
              this.addData.expressId = '';
            }
            this._post('com.edb01.erp.wms.service.api.WmExpressPrintTmService/' + this.version + '/addTemplent',this.addData)
              .then(res => {
                if(res.data.success){
                  this.query();
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  this.dialogVisible =  false;
                  this.isType = false;
                }else{
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // checkbox触发
      handleSelectionChange(val){
        console.log(val);
        this.checkBoxLength = val;
      },

      // 鼠标经过模板名称
      exitName(index) {
        if(this.isShow == true){
          return false;
        }
        this.index = index;
      },

      // 鼠标离开
      exitLeave(){
        if(this.isShow == true){
          return false;
        }
        this.index = 'abc';
        this.isShow = false;
      },

      // 点击铅笔
      showInput(index) {
        this.index = index;
        this.isShow = true;
      },

      // 提交表格中的input数据 修改模板名称
      submitData(row) {
        if(row.expressPrintTmplName == ''){
          this.$message({
            message: '模板名称不能为空',
            type: 'warning'
          })
          return false;
        }
        this._post('com.edb01.erp.wms.service.api.WmExpressPrintTmService/' + this.version + '/updateTemplent',{expressPrintTmplId: row.expressPrintTmplId,expressPrintTmplName: row.expressPrintTmplName})
          .then(res => {
            if(res.data.success){
              this.query();
              this.$message({
                message: '修改模板名称成功',
                type: 'success'
              });
              this.isShow = false;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })

      },

      // 格式化0-9
       turnSingle(num) {
        return num<10?'0'+num:num
      }
    },
    created() {

      //获取淘宝店铺
      this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/getExpressGrantShopList')
        .then(res => {
          if(res.data.success){
            this.shopTm = res.data.result.taobaoShopList;

          }
        });

      // 所有快递
      this._post('com.edb01.erp.mdata.service.api.ExpressCoService/1.0.0/subExpress')
        .then(res => {
          if(res.data.success == true){
            let value = [];
            for (let item of res.data.result){
              item.value = item.expressCoId;
              item.label = item.expressCoName;
              value.push(item.expressCoId)
            }
            this.store = res.data.result;

            $('#example-post').multiselect('dataprovider',this.store);
            $('#example-post').multiselect('select',value);
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        });
    },

    mounted() {

      // 查询列表
      this.query = () => {
        this._post('com.edb01.erp.wms.service.api.WmExpressPrintTmService/'+ this.version +'/getAllTemplent',this.queryList)
          .then((res) =>{
          if(res.data.success){
            res.data.result.forEach(item => {
              if(item.updateTime){
                var a = new Date(new Date(item.updateTime));
                item.updateTime = a.getFullYear() + '-' + this.turnSingle(a.getMonth() + 1) + '-' +this.turnSingle(a.getDate())+' '+this.turnSingle(a.getHours())+':'+this.turnSingle(a.getMinutes())+':'+this.turnSingle(a.getSeconds());
              }
            });
            this.tableData = res.data.result;
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }


          })
      };
      this.query();//查询列表

      //渲染表格高度
      this.$nextTick(function() {
        this.table_h = $(window).height() - $('.col-border').offset().top - 50;
      });
      window.onresize = () => {
        this.table_h = $(window).height() - $('.col-border').offset().top - 50;
      };

      //改变滚动条样式
      $('#example-post').multiselect({
        onInitialized: function (select, container) {

          $("._scroll").yi_scroll({
            barColor: 'hsla(220,4%,58%,.3)'
          });
        },
      })

    }

  }
</script>
