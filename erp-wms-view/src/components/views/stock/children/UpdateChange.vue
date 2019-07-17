<!--修改移位单 秋香-->
<template>
  <div id="UpdateChang">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Change' }">移位</el-breadcrumb-item>
        <el-breadcrumb-item>修改移位单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--搜索区-->
    <div id="searchBox">
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <label >仓库：</label>
            <el-select id="searchStock" disabled v-model="storageId" filterable placeholder="全部">
              <el-option
                v-for="item in optionsStock"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <p v-show="isStockShow" style="margin-left: 65px;margin-top:3px;color: red">请选择仓库</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <label  style="vertical-align: top;">说明：</label>
            <el-input
              maxlength="200"
              id="explain"
              type="textarea"
              :rows="4"
              placeholder="请输入说明"
              v-model="remark">
            </el-input>
            <span>{{remark.length}}/200</span>

          </div>
        </el-col>
      </el-row>

    </div>
    <!--操作导航-->
    <div class="col-nav" style="margin:20px 0 10px">
      <ul>
        <li @click="addGoods"><span>添加商品</span></li><span></span>
        <li @click="deleteButton()"><span>删除</span></li><span></span>
      </ul>
    </div>
    <el-dialog
      title="添加商品"
      :visible.sync="refuseClick"
      width="1200px"
      center>
        <!--搜索区-->
        <div style="position: relative">
          <div class="leftBox1">
            <el-row>

              <el-col :span="6">
                <div class="grid-content">
                  <label >条形码：</label>
                  <el-input maxlength="50" id="name1" v-model="barCode" @keyup.enter.native="searchDialog()" placeholder="请输入内容"></el-input>
                </div>
              </el-col>

              <el-col :span="6">
                <div class="grid-content">
                  <label >库区：</label>
                  <el-select id="stockArea" v-model="storageSectionId" filterable placeholder="全部">
                    <el-option
                      v-for="item in optionsStockAreaDialog"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-col>

              <el-col :span="6">
                <div class="grid-content">
                  <label >库位：</label>
                  <el-input maxlength="100" id="name4" @keyup.enter.native="searchDialog()" v-model="storageBinName" placeholder="请输入内容"></el-input>
                </div>
              </el-col>

              <el-col :span="6">
                <div class="grid-content">
                  <label >商品名称：</label>
                  <el-input maxlength="100" id="name2" @keyup.enter.native="searchDialog()" v-model="goodsName" placeholder="请输入内容"></el-input>
                </div>
              </el-col>

              <el-col :span="6">
                <div class="grid-content">
                  <label>批次号：</label>
                  <el-input maxlength="100" id="name3" v-model="batchNo"  @keyup.enter.native="searchDialog()" placeholder="请输入内容"></el-input>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="rightBox1">
            <el-button @click="searchDialog" size="mini" type="default" style="margin:0;background-color:#49A0F5;color:white;border:none;" >查 询</el-button>
          </div>
        </div>
        <!--表格-->
        <div class="pDown">
          <el-table
            height="500"
            :data="tableDataDialog" border style="width: 100%"
            ref="multipleTable"
            @selection-change="handleSelectionChange">
            <el-table-column label="序号" type="index" align="center" width="45"></el-table-column>

            <el-table-column
              type="selection">
            </el-table-column>

            <el-table-column label="商品编码" prop="goodsCode">
            </el-table-column>

            <el-table-column label="条形码" prop="barCode">
            </el-table-column>

            <el-table-column label="商品名称" prop="goodsName" >
            </el-table-column>

            <el-table-column label="库区" prop="sectionName">
            </el-table-column>

            <el-table-column label="库位" prop="storageBinName">
            </el-table-column>

            <el-table-column label="库位类型">
              <template slot-scope="scope">
                <span class="cen-g" v-show="scope.row.binType == 1">正品</span>
                <span class="cen-g" v-show="scope.row.binType == 2">次品</span>
              </template>
            </el-table-column>

            <el-table-column label="批次" prop="batchNo">
            </el-table-column>

            <el-table-column label="可配货库存" prop="dstInv">
            </el-table-column>

            <el-table-column label="可移动量" prop="canMoveOutInv">
            </el-table-column>

          </el-table>
          <!--分页-->
          <div style="float: right">
            <pagination
              :totalCom="total"
              :pageSizeCom="pageSize"
              :curPageCom="curPage"
              @pageSizeVal="getPageSize" @curPageVal="getCurPage"
            ></pagination>
          </div>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="refuseClick = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="refuseTrueClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--表格-->
    <div class="pDown col-border">
      <el-table :data="tableData" border style="width: 100%"
                :height="table_h"
                @selection-change="handleSelectionChangeOne">
      >
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column label="条形码" width="110" prop="barCode">
        </el-table-column>

        <el-table-column label="商品名称"  prop="goodsName">
        </el-table-column>

        <el-table-column label="批次"  prop="batchNo">
        </el-table-column>

        <el-table-column label="来源库区" prop="sectionName">
        </el-table-column>

        <el-table-column label="来源库位" prop="storageBinName">
        </el-table-column>

        <el-table-column label="库位类型">
          <template slot-scope="scope">
            <span class="cen-g" v-show="scope.row.binType == 1">正品</span>
            <span class="cen-g" v-show="scope.row.binType == 2">次品</span>
          </template>
        </el-table-column>

        <el-table-column label="可移动量" prop="canMoveOutNum">
        </el-table-column>

        <el-table-column label="目标库区" prop="targetSectionName">
        </el-table-column>

        <el-table-column label="目标库位" >
          <template slot-scope="scope">
            <div v-if="!scope.row.isShowMum"> <el-input type="text" v-model="scope.row.targetStorageBinName"   @blur="holdNum(scope.row,scope.$index)"></el-input></div>
            <div v-if="scope.row.isShowMum"><el-input type="text" v-model="scope.row.targetStorageBinName" style="border: 1px solid red;"  @blur="holdNum(scope.row,scope.$index)"></el-input></div>
          </template>
        </el-table-column>

        <el-table-column label="可移入量" prop="canMoveIntoNum">
        </el-table-column>
        <el-table-column label="计划移动量" min-width="110">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.planMoveQty" :disabled="scope.row.isSure"
                      @keyup.native="scope.row.planMoveQty = scope.row.planMoveQty.replace(/[^\d]/g,'');if(scope.row.planMoveQty == 0)scope.row.planMoveQty = ''" @focuse="" :maxlength="10"
                      :class="{ box: isClasses ==true && (scope.row.planMoveQty==undefined||scope.row.planMoveQty=='')||(scope.row.planMoveQty>scope.row.canMoveOutNum)||(scope.row.planMoveQty>scope.row.canMoveIntoNum)}"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div class="wmsFoot">
        <el-button @click="holdClick" size="mini" type="primary">保 存</el-button>
        <el-button @click="backClick" size="mini" type="info">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {turnTimestamp, returnTimesStamp, priceValidator, positiveIntegerValidator , Trim} from '@/assets/js/validate.js';
  import pagination from '@/components/common/Pagination.vue'
  export default {
    components: {
      pagination
    },
    data(){
      return{
        version: '1.0.0',
        table_h: 0, //表格高度
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId: '',//仓库
        remark: '',//调整说明
        tableData:[],//表格数据
        isStockShow: false,//仓库为空校验
        refuseClick: false,//添加商品
        optionsStockAreaDialog:[{value: '',label: '全部'}],//弹框库区下拉
        storageSectionIdDialog: '',//弹框库区
        storageSectionId:'',//库区
        optionsAdjustDialog: [
          {value: '1001',label: '条形码'},
          {value: '1002',label: '库位'}
          ],//弹框库位、条形码下拉
        select1TypeDialog: '1002',//弹框库位、条形码
        select1ValueDialog: '',//弹框库位、条形码值
        goodsNameDialog: '',//弹框商品名称
        tableDataDialog: [],//弹框表格数据
        multipleTable: [],//弹框选择的数据
        total: 0, //总页数
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        barCode:'',//条形码
        sectionName:'',//库区
        storageBinName:'',//库位
        goodsName:'',//商品名称
        batchNo:'',//批次号
        tableNum:[],//勾选数据
        isShowNum:false,//过渡参数
        disLike:false,//计划移动量
        isTrue:1,//状态参数
        isClasses:'',//样式
      }
    },
    created() {
      //渲染表格高度
      this.$nextTick(function() {
        this.table_h = $(window).height() - $('.col-border').offset().top - 95;
      });
     /* window.onresize = () => {
        this.table_h = $(window).height() - $('.col-border').offset().top - 95;
      };*/

    },
    mounted(){
      this.initStock();//初始和仓库下拉
      this.updateById();//回显
    },
    methods:{

      // 批量删除
      deleteButton: function () {
        if (this.tableNum == '') {
          this.$message({
            message: '请勾选',
            type: 'warning'
          })

        } else {
          this.tableNum.forEach((item) => {
            this.tableData.forEach((item1,index) => {
              if(item.goodsId == item1.goodsId && item.sourceSectionName == item1.sourceSectionName
                && item.originalTargetStorageBinName == item1.originalTargetStorageBinName &&
                item.sectionName == item1.sectionName && item.canMoveIntoNum == item1.canMoveIntoNum
                && item.originalPlanMoveQty == item1.originalPlanMoveQty){
                  this.tableData.splice(index,1)
              }
            })
          })
        }
      },

      //可移动量(移出
      isMoveNum:function () {
        let data= [];
        this.multipleSelection.forEach(item => {
          let str = {canMoveOutNum:'',binInvId:item.binInvId,planMoveNum:'',storageId:item.storageId, sourceStorageBinId:item.storageBinId,sourceStorageSectionId:item.storageSectionId, goodsId:item.goodsId }
          data.push(str);
        })
        data = JSON.stringify(data);
        this._post('com.edb01.erp.wms.service.api.WmBinInvService/' + this.version + '/queryMoveOutNum',{wmBinCanMoveOutBeanListStr:data}).then(function (res) {
          res.data.result.forEach((item, i) => {
            this.multipleSelection.forEach(function (val) {
              if (item.binInvId == val.binInvId) {
                val.canMoveOutNum =item.canMoveOutNum;
                this.tableData.push({isShowNum:true,canMoveOutNum:item.canMoveOutNum,stockMoveItemId:val.stockMoveItemId,storageId:val.storageId,
                  storageBinId:val.storageBinId,storageBinName:val.storageBinName,barCode:val.barCode,sectionName:val.sectionName,
                  goodsName:val.goodsName,batchNo:val.batchNo,
                  sourceStorageBinId:val.storageBinId,sourceStorageSectionId:val.storageSectionId,
                  binType:val.binType,goodsId:val.goodsId,planMoveQty:val.planMoveQty });
                this.refuseClick = false;
              }
            }.bind(this));
          })

        }.bind(this));
      },

      //添加商品确定点击
      refuseTrueClick: function () {
        this.isMoveNum();
      },

      //获取移动量
      holdNum:function(row,index){
        if(row.storageBinName==row.targetStorageBinName){
          this.$message({
            type: 'warning',
            message: '目标库位和来源库位不能相同!'
          })
        }else{
          let setPlanMove=row.planMoveQty
          if(row.targetStorageBinName==row.originalTargetStorageBinName){
              row.planMoveQty= row.planMoveQty
              row.originalPlanMoveQty=row.originalPlanMoveQty
          }else{
            row.planMoveQty=''
            row.originalPlanMoveQty=row.originalPlanMoveQty
          }
          if(row.targetStorageBinName==undefined){
            row.targetStorageBinName=''
          } if(row.targetStorageBinName==''){
            this.$message({
              type: 'warning',
              message: '有商品未填写目标库位!'
            })
            row.isShowMum=true
            return false;
          }
          if(row.binInvId==undefined){
            row.binInvId=''
          }
          if(row.originalPlanMoveQty==undefined){
            row.originalPlanMoveQty=''
          }
          if(row.originalTargetStorageBinId==undefined){
            row.originalTargetStorageBinId=''
          }

          let data = {
            merchantId: 0,
            binInvId:row.binInvId,
            goodsId: row.goodsId,
            storageBinName:row.targetStorageBinName,
            batchNo:row.batchNo,
            binType:row.binType,
            storageId: this.storageId,
            planMoveQty:row.planMoveQty,
            sourceStorageSectionId:row.sourceStorageSectionId,//来源库区id
            sourceStorageBinId:row.sourceStorageBinId,//来源库位id
         /*   originalPlanMoveQty:row.originalPlanMoveQty,
            originalTargetStorageBinName:row.originalTargetStorageBinName,*/
            originalPlanMoveQty:row.originalPlanMoveQty,
            originalTargetStorageBinId:row.originalTargetStorageBinId,

          };
          this._post('com.edb01.erp.wms.service.api.WmStockMoveService/' + this.version + '/checkWmStorageBin',data).then(function (res) {
            if(res.data.success==true){
              this.tableData[index].targetStorageSectionId = res.data.result.storageSectionId;
              this.tableData[index].targetStorageBinId = res.data.result.storageBinId;
              let obj = this.tableData[index];
              obj.targetSectionName= res.data.result.sectionName;
              obj.canMoveIntoNum= res.data.result.canMoveIntoNum;
            if(res.data.result.planMoveQty==undefined||res.data.result.planMoveQty==''){
              obj.planMoveQty=setPlanMove
              obj.isSure=false
            }else{
              obj.planMoveQty= res.data.result.planMoveQty;
              obj.isSure=true
           }
              this.$set(this.tableData, index, obj);
              row.isShowMum=false;
              row.isShowNum=true;

              this.targetStorageSectionId= res.data.result.storageSectionId
              this.targetStorageBinId= res.data.result.storageBinId
            }else{
              this.$message({
                message: res.data.msg,
                type:'warning'
              })
              row.isShowMum=true;
              row.isShowNum=false;
              row.targetStorageBinName=''
              if(row.targetStorageBinName==''){
                row.isSure=false
              }
            }
          }.bind(this));
        }
      },

      //回显
      updateById:function () {
        const id = this.$route.params.id;//获取移位页面的移位单号
        let data = {stockMoveId: id};//传参
        this._post('com.edb01.erp.wms.service.api.WmStockMoveService/'+this.version+'/queryLinkById',data).then(function (res) {
          //表格主信息
          this.tableData = res.data.result.wmStockMoveItemPOLinkParamList;
          this.storageId = res.data.result.storageId;
          this.remark = res.data.result.remark;//说明
          res.data.result.wmStockMoveItemPOLinkParamList.forEach((item) => {
              item.sectionName = item.sourceSectionName;
              item.storageBinName=item.sourceStorageBinName;
          })
           res.data.result.wmStockMoveItemPOLinkParamList.forEach((item) => {
             if(item.isCanEditPlanMoveQty==1){
              item.isSure=true
             }
          })
        }.bind(this));
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.optionsStock.push({value: val.storageId,label: val.storageName})
          }.bind(this));
        }.bind(this));
      },

      //初始化库区下拉
      initSeat: function () {
        let data = {
          storageId: this.storageId
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/findByStorageId',data).then(function (res) {
          let arr = res.data.result;
          this.optionsStockAreaDialog = [{value:'',label:'全部'}];
          arr.forEach(function (val) {
            this.optionsStockAreaDialog.push({value: val.storageSectionId,label: val.sectionName})
          }.bind(this));
        }.bind(this));
      },

      //初始化弹框表格数据
      initDialog: function () {
        let data = {
          storageId:this.storageId,//仓库
          storageSectionId:this.storageSectionId,//库区
          storageBinId:this.storageBinId,//库位
          // binType:this.binType,//库位类型
          barCode: this.barCode,//条形码
       /*    sectionName: this.sectionName,//库区*/
          storageBinName: this.storageBinName,//库位
          goodsName: this.goodsName,//商品名称
          batchNo: this.batchNo,//批次号
          page: this.curPage,//当前页
          size: this.pageSize,//每页行数

        };
        this._post('com.edb01.erp.wms.service.api.WmBinInvService/' + this.version + '/queryPager',data)
          .then(function (res) {
            this.tableDataDialog=res.data.result.rows;
            this.total = res.data.result.total;
            res.data.result.rows.forEach((val,i)=>{
              val.canMoveIntoNum = ''
            })
          }.bind(this))
      },

      //添加保存接口
      initHold: function () {
        let arr = [];
        let hh=[]
        this.tableData.forEach(function (val) {
          arr.push(val.targetStorageBinName);
        }.bind(this));
        if (arr.indexOf(undefined) != -1) {
          this.$message({
            type: 'warning',
            message: '有商品未填写目标库位!'
          })
          return false;
        }
        this.tableData.forEach(function (val) {
          hh.push(val.planMoveQty);
        }.bind(this));
        if (hh.indexOf(undefined) != -1) {
          this.$message({
            type: 'warning',
            message: '有商品未填写计划移动量!'
          })
          return false;
        }
        let id = this.$route.params.id;
        let str = JSON.stringify(this.tableData);
        let data = {
          storageId: this.storageId,
          remark: this.remark,
          wmStockMoveItemPOParamListStr: str,
          stockMoveId: id,
          saveType:1002
        };

        this._post('com.edb01.erp.wms.service.api.WmStockMoveService/' + this.version + '/save',data)
          .then(function (res) {
            if(res.data.success) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$router.push('/change')
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          }.bind(this))
      },

      //添加商品
      addGoods: function () {
        if(this.storageId == '') {
          this.isStockShow = true;
        }else {
          this.isSure=false
          this.isStockShow = false;
          this.refuseClick = true;
          this.batchNo= ''
          this.goodsName= ''
          this.storageBinName= ''
          this.storageBinId=''
          this.storageSectionId=''
          this.barCode= ''
          this.initSeat();
          this.initDialog()
        }
      },

      //删除接口
      initDelete: function (row) {
        let data = {stockInvaItemId: row.stockInvaItemId};
        this._post('com.edb01.erp.wms.service.api.WmStockInvaItemService/' + this.version + '/delete',data)
          .then(function (res) {
            if(res.data.success) {
              this.initMessage()
            }
          }.bind(this))
      },

      //删除
      deleteClick: function (row) {
        this.initDelete(row)
      },

      //点击返回
      backClick: function () {
        this.$router.push('/Change')
      },

      //点击保存
      holdClick: function () {
        if(this.tableData.length == 0) {
          this.isExplainShow = false;
          this.$message({
            type: 'warning',
            message: '请给该移位单添加商品!'
          })
        } else {
          this.isExplainShow = false;
          this.initHold()
        }
      },

      //弹框选择商品
      handleSelectionChange(val) {
        console.log(val);
        this.multipleSelection = val;
      },

      //表格商品
      handleSelectionChangeOne(val) {
        this.tableNum = val;
      },

      //弹框查询
      searchDialog: function () {
        this.initDialog()
      },

      //以下是分页
      getPageSize: function (val) {
        if (val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          // this.initMessage();
          this.initDialog();
        }
      },
      getCurPage: function (val) {
        if (val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          // this.addGoods();
          this.initDialog();
          //  this.initMessage()
        }
      },
    }
  }
</script>
<style scoped>
  .pTop{
    margin-bottom: 20px;
  }
</style>
<style>
  #UpdateChang .el-textarea{
    width: 83%;
  }
  #UpdateChang .el-table .cell {
    text-align: center;
  }
  #UpdateChang .el-table .cell {
    text-align: center;
  }
  #UpdateChang .box input.el-input__inner {
    border: 1px solid red !important;
  }
  #UpdateChang #isWidth{
    width: 2000px;
  }
</style>
