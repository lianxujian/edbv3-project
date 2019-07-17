<!--订单标记-超重 方证/樊虎-->
<template>
  <div id="orderMarkWeight">
    <!--面包屑导航-->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="col-breadcrumb">
        <el-breadcrumb-item @click.native="showParentBlock">{{$t("orderSign.signSetting")}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t("orderSign.weightSetting")}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--选项【超重订单处理方式】设置-->
    <div style="margin-top: 20px;">
      <h5 style="font-weight:bold;">处理方式</h5>
      <div style="margin-right:20px;padding-left:20px;">
        <span style="margin-right: 20px;">{{$t("orderSign.weightType")}}</span>
        <el-radio-group v-model="handlingType" @change="handleOverWeightType">
          <el-radio :label=1>{{$t("orderSign.onlySign")}}</el-radio>
          <el-radio :label=2>{{$t("orderSign.autoSplit")}}</el-radio>
        </el-radio-group>
      </div>
    </div>

    <!--选项【默认设置】设置-->
    <div style="margin-top: 20px;">
      <h5 style="font-weight:bold;">默认设置</h5>
      <div style="height:35px;line-height:35px;padding-left:20px;" class="col-nav">
        <span>超重阈值：<b><el-input-number v-if="dialogVisibleDefault" type="text" style="width:120px !important;" :controls="false" :min="0" v-model="defaultForm.defaultThreshold"></el-input-number><span v-else>{{defaultThreshold}}</span> kg</b></span>
        <div style="margin:0 40px;display:inline-block;">启用状态：
        <b>
          <el-switch
            v-if="dialogVisibleDefault"
            v-model="defaultForm.defaultEnabledFlag">
          </el-switch>
          <span v-else>{{enableStatus}}</span>
        </b>
        </div>
        <div v-if="dialogVisibleDefault" style="display:inline-block">
          <el-button @click="dialogVisibleDefault = false">取 消</el-button>
          <el-button type="primary" @click="defaultSetSave">确 定</el-button>
        </div>
        <el-button v-else type="primary" size="small" @click="editDefaultDialog">修改</el-button>
        <span style="margin-left:40px;">除指定仓库的指定快递外，其余均使用默认超重阈值</span>
      </div>
    </div>

    <!--主数据表格区-->
    <div style="margin-top: 20px;">
      <h5 style="font-weight:bold;">指定设置</h5>
      <el-button type="primary" size="small" style="width:194px !important;margin-bottom:10px;" @click="addExpress">+ 指定仓库指定快递超重阈值</el-button>
      <el-table id="tabWeight" :data="list" v-loading.body="listLoading" border :height="tabHeight" style="width: 100%">
        <el-table-column :label="$t('orderSign.index')" type="index" align="center">
        </el-table-column>
        <el-table-column label="指定仓库" align="center">
          <template slot-scope="scope">
            <el-select v-if="scope.row.edit" v-model="scope.row.storageId" placeholder="请选择">
              <el-option
                v-for="item in warehouseArr"
                :key="item.storageId"
                :label="item.storageName"
                :value="item.storageId">
              </el-option>
            </el-select>
            <span v-else>{{ scope.row.storageName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="指定快递" header-align="center" width="500">
          <template slot-scope="scope">
            <ul class="my-plat-list">
              <li v-for="(item,index) in scope.row.expressName" class="plat-li">{{item}}
                <i v-show="scope.row.edit" style="cursor:pointer;" @click="handleDeletePlat(scope.row, item,index)" class="el-icon-error"></i>
              </li>
            </ul>
            <el-button v-show="scope.row.edit" @click="handleShowPlat(scope.row)" icon="el-icon-plus" style="margin-top: 2px;"></el-button>
          </template>
        </el-table-column>

        <el-table-column :label="$t('orderSign.overweightNum')" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <!--<el-input v-model="scope.row.overweightNum"></el-input>-->
              <el-input v-model="scope.row.threshold" @blur="validate(scope.$index)"></el-input>
            </template>
            <template v-else>
              <span>{{scope.row.threshold}}</span>
            </template>
            <!--<template v-else>
              <span>&#45;&#45;&#45;&#45;</span>
            </template>-->
          </template>
        </el-table-column>
        <el-table-column label="启用状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabledFlag" v-if="scope.row.edit"></el-switch>
            <span v-else>
              <span v-if="scope.row.enabledFlag">启用</span>
              <span v-else>停用</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderSign.operation')" align="center" width="200">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-button @click="confirmEdit(scope.row)" type="text" >
                {{$t("orderSign.onSave")}}
              </el-button>
              <el-button @click='cancelEdit(scope.row)' type="text">
                {{$t("orderSign.onCancel")}}
              </el-button>
            </template>
            <template v-else>
              <el-button @click='editStart(scope.row)' type="text">{{$t("orderSign.onModify")}}</el-button>
              <!--el-button v-if="scope.row.enabledFlag" disabled @click="delExpress(scope.row)" type="text">删除</el-button>-->
              <el-button v-if="!scope.row.enabledFlag" @click="delExpress(scope.row)" style="color:red;" type="text">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--增加快递弹框-->
    <el-dialog v-dialogDrag
      :close-on-click-modal="false"
      class="express-dialog"
      title="添加快递"
      :visible.sync="dialogVisibleExpress"
      width="50%">
      <el-checkbox-group
        v-model="checkedExpress">
        <el-checkbox v-for="item in deliveryArr" :label="item.expressId" :key="item.expressId" :disabled="item.disabled">{{item.expressName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleExpress = false">取 消</el-button>
          <el-button type="primary" @click="addExpressSave">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import { returnFloat,selShowLabel,priceValidator } from '@/assets/js/validate.js';
  export default {
    name: 'signWeight',
    data() {
      return {
        apiVersion: '1.0.0',
        handlingType: 1,
        listLoading: false,//表格loading
        list: null,//表格data
        tabHeight: 100,
        enableStatus:'启用',//启用停用按钮
        defaultThreshold:'0.00',//超重阈值
        signId:this.$router.history.current.params.signId,//订单标记id
        type:this.$router.history.current.params.type,//是否订单处理
        dialogVisibleDefault:false,//修改默认设置
        signWeightId:'',//快递超重设置id
        defaultForm:{
          defaultThreshold:'',
          defaultEnabledFlag:true
        },//超重阈值参数
        warehouseArr:[],//仓库
        expressDeliveryArr:[],//所有快递
        deliveryArr:[],//弹框显示快递集合
        dialogVisibleExpress:false,//增加快递
        checkedExpress:[],//已选快递，
        curRow:{},//当前行
        editing:false,//是否编辑状态
        isAdd:false,//添加or修改
        o_expressIdList:[],//原始的快递id
      }
    },
    created() {
      //指定仓库集合
      this.warehouseFn();
      this.$nextTick(() => {
        this.onResize()
      })
    },
    mounted() {
      window.onresize = () => {
        this.onResize()
      }
    },
    methods: {
      //超重阈值校验
      validate(index){
        this.list[index].threshold=returnFloat(this.list[index].threshold);
      },
      onResize() {
        const clientHeight = document.body.clientHeight
        this.tableTop = document.getElementById('tabWeight').offsetTop
        if (clientHeight - this.tableTop - 50 > 100) {
          this.tabHeight = clientHeight - this.tableTop - 50
        } else {
          this.tabHeight = 100
        }
      },
      //跳转到订单标记页
      showParentBlock() {
        //this.$emit('toblock', 'signMain', '')
        this.$router.push({name: 'orderMarks',params:{type:this.type}});
        //this.$router.go(-1)
      },
      //指定仓库集合
      warehouseFn(){
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.apiVersion + '/list ').then((response)=>{
          if(response.data.success){
            this.warehouseArr=response.data.result;
            this.expressDeliveryFn();
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //指定快递集合
      expressDeliveryFn(){
        this._post('com.edb01.erp.wms.service.api.ExpressService/' + this.apiVersion + '/listExpressAll').then((response)=>{
          if(response.data.success){
            this.expressDeliveryArr=response.data.result;
            this.initWeight();
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //快递添加弹框
      handleShowPlat(row) {
        var _this=this;
        var expressDeliveryArr=[];
        if(!row.storageId){
          this.$message({
            message: '请选择指定仓库',
            type: 'warning'
          });
          return false;
        }
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + _this.apiVersion + '/queryStorageBindExpressList',{
          storageId:row.storageId
        }).then((response)=>{
          if(response.data.success){
            expressDeliveryArr=response.data.result;
            showDelivery()
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
        function showDelivery(){
          _this._post('com.edb01.erp.oms.service.api.OrderSignService/' + _this.apiVersion + '/selectOrderSignOverWeightSelectedExpressId',{
            signWeightId:_this.signWeightId,
            storageId:row.storageId
          }).then(response => {
            if (response.data.success) {
              _this.checkedExpress=[];
              _this.dialogVisibleExpress=true;
              _this.curRow = row;
              //this.listPlat = response.data.result
              var listPlat=[],mapArr=new Map();
              response.data.result.selectedExpressList=response.data.result.selectedExpressList?response.data.result.selectedExpressList:[];
              response.data.result.selectedExpressList.forEach((item,i)=>{
                mapArr.set(item,item);
              })
              console.log(mapArr);
              expressDeliveryArr.forEach((item,i)=>{
                if(!mapArr.get(item.expressId)){
                  listPlat.push(item);
                }else{
                  item.disabled=true;
                  listPlat.push(item);
                }
              })
              _this.deliveryArr = listPlat;
            }else{
              _this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      //添加指定仓库指定快递超重阈值
      addExpress(){
        this.isAdd=false;
        if (this.editing === true) {
          this.$confirm('请先保存或取消当前编辑方案。', this.$t('orderSign.prompt'), {
            showCancelButton: false,
            // type: 'info',
            center: true
          })
        } else {
          this.editing = true;
          this.isAdd=true;
          this.o_expressIdList='';
          //var defaultThreshold=this.enableStatus=='启用'?this.defaultThreshold:''
          this.list.unshift({
            threshold:0,
            storageId:'',
            enabledFlag: true,
            edit: true,
            expressId:[],
            expressName:[]
          })
        }
      },
      //快递添加保存
      addExpressSave(){
        var arr=[],newMap=new Map();
        this.checkedExpress.forEach((item,i)=>{
          newMap.set(item,item);
        })
        this.expressDeliveryArr.forEach((item,i)=>{
          if(newMap.get(item.expressId)){
            arr.push(item.expressName);
          }
        })
        var arrId=this.curRow.expressId;
        arr.forEach((item,i)=>{
          if(this.curRow.expressName.indexOf(item)<0){
            this.curRow.expressName.push(item);
          }
          if(arrId.indexOf(this.checkedExpress[i])<0){
            arrId.push(this.checkedExpress[i]);
          }
        })
        this.curRow.expressId=arrId;
        this.dialogVisibleExpress=false;
      },
      //快递删除
      handleDeletePlat(row, label,i) {
        var id='',index='';
        var arr=row.expressId;
        this.expressDeliveryArr.forEach((item,i)=>{
          if(item.expressName==label){
            id=item.expressId;
          }
        })
        index = arr.indexOf(id);
        arr.splice(index,1);
        row.expressId=arr;
        row.expressName.splice(i,1);
      },
      //快递超重table
      initWeight() {
        this.editing=false;
        this.isAdd=false;
        const item = { signId:this.signId }
        this.listLoading = true
        // fetchExpress().then(response => {
        //getOverWeight(item)
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/getOrderSignOverWeight ',item).then(response => {
          if (response.data.success === true) {
            this.signWeightId=response.data.result.signWeightId;
            this.handlingType = response.data.result.handlingType;
            this.defaultThreshold=response.data.result.defaultThreshold?returnFloat(response.data.result.defaultThreshold):'0.00';
            this.enableStatus=response.data.result.defaultEnabledFlag?'启用':'停用';
            console.log(response.data.result.settingObj, this.expressDeliveryArr);
            //快递
            response.data.result.settingObj=selShowLabel(response.data.result.settingObj,this.expressDeliveryArr,'expressName','expressId',2);
            //仓库
            response.data.result.settingObj=selShowLabel(response.data.result.settingObj,this.warehouseArr,'storageName','storageId');

            // const items = response.data.result
            const items = response.data.result.settingObj?response.data.result.settingObj:[];
            this.list = items.map(v => {
              this.$set(v, 'edit', false)
              v.threshold=returnFloat(v.threshold);
              v.originalNum = v.threshold
              return v
            })
            this.listLoading = false
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch((error) => {
          console.log(error)
          this.listLoading = false
        })
      },
      //处理方式
      handleOverWeightType() {
        const item = { handlingType: this.handlingType, signId: this.signId,signWeightId:this.signWeightId }
        //editOverWeightType(item)
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/updateOrderSignOverWeightHandlingType',item).then(response => {
          if (response.data.success !== true) {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
            this.handlingType = this.handlingType === 1 ? 2 : 1
          }
        }).catch(() => {
          this.handlingType = this.handlingType === 1 ? 2 : 1
        })
      },
      //点击修改按钮
      editStart(row){
        if (this.editing === true) {
          this.$confirm('请先保存或取消当前编辑方案。', this.$t('orderSign.prompt'), {
            showCancelButton: false,
            // type: 'info',
            center: true
          })
        } else {
          row.edit=true;
          this.isAdd=false;
          this.editing=true;
          this.o_expressIdList=JSON.stringify(row.expressId);
        }
      },
      //添加修改超重阈值
      confirmEdit(row) {
        let isAddParam='';
        isAddParam=this.isAdd?'addOrderSignOverWeightSetting':'updateOrderSignOverWeightSetting';
        const item = { o_expressIdList:this.o_expressIdList,n_expressIdList: JSON.stringify(row.expressId), threshold: row.threshold ,signId:this.signId,signWeightId:this.signWeightId,enabledFlag:row.enabledFlag,storageId:row.storageId}
        //editOverWeightNum(item)
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/'+isAddParam,item).then(response => {
          if (response.data.success === true) {
            row.edit = false
            row.originalNum = row.threshold
            this.editing=false;
            this.warehouseFn();
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //取消修改
      cancelEdit(row) {
        this.warehouseFn();
      },
      //删除行
      delExpress(row){
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/deleteOrderSignOverWeightSetting',{
            signWeightId:this.signWeightId,
            storageId:row.storageId,
            expressIdList:JSON.stringify(row.expressId)
          }).then((response)=>{
            if(response.data.success){
              this.warehouseFn();
            }else{
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {});
      },
      //格式化方法
      number_format(number, decimals, dec_point, thousands_sep, roundtag) {
        /*
        * 参数说明：
        * number：要格式化的数字
        * decimals：保留几位小数
        * dec_point：小数点符号
        * thousands_sep：千分位符号
        * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
        * */
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        roundtag = roundtag || "ceil"; //"ceil","floor","round"
        var n = !isFinite(+number) ? 0 : +number,
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
          dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
          s = '',
          toFixedFix = function (n, prec) {

            var k = Math.pow(10, prec);
            console.log();

            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
          };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
          s[0] = s[0].replace(re, "$1" + sep + "$2");
        }

        if ((s[1] || '').length < prec) {
          s[1] = s[1] || '';
          s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
      },
      //修改默认设置弹出框
      editDefaultDialog(){
        this.dialogVisibleDefault=true;
        this.defaultForm.defaultThreshold=this.defaultThreshold;
        this.defaultForm.defaultEnabledFlag=this.enableStatus=='启用'?true:false;
      },
      //默认设置修改保存
      defaultSetSave(){
        this.defaultForm.signWeightId=this.signWeightId;
        this.defaultForm.signId=this.signId;
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/updateOrderSignOverWeightDefaultSet',this.defaultForm).then((response)=>{
          if(response.data.success){
            this.initWeight();
            this.dialogVisibleDefault=false;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
    }
  }
</script>
<style scoped>
  .plat-li{
    color: #fff;
    float: left;
    margin: 2px 5px 2px 0;
    padding: 3px 5px;
    min-width: 10px;
    background-color: #5F9EDF;
    text-align: center;
    border-radius: 5px;
  }
  .el-input-number{
    width:100% !important;
  }
</style>
<style>
  .express-dialog .el-checkbox+.el-checkbox{
    margin-left:0;
    margin-bottom:20px;
  }
  .express-dialog .el-checkbox__label{
    min-width:130px;
    margin-right:10px;
  }
</style>
