<!--添加移位单 秋香-->
<template>
  <div id="AddChange">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/Change' }">移位</el-breadcrumb-item>
        <el-breadcrumb-item>添加移位单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--搜索区-->
    <div id="searchBox">
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <label >仓库：</label>
            <el-select id="searchStock" v-model="storageId" filterable placeholder="请选择" @change="changeOne()">
              <el-option
                v-for="item in optionsStock"
                :key="item.storageId"
                :label="item.storageName"
                :value="item.storageId">
              </el-option>
            </el-select>
            <p v-show="isStockShow" style="margin-left: 65px;margin-top:3px;color: red">请选择仓库</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <label style="vertical-align: top;">说明：</label>
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
      </ul>
    </div>

    <!--添加商品-->
    <el-dialog v-dialogDrag
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
                  <el-input maxlength="100" id="name1" v-model="barCode"  @keyup.enter.native="searchDialog()" placeholder="请输入内容" :maxlength="50"></el-input>
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
                  <label>库位：</label>
                  <el-input maxlength="100" id="name4" v-model="storageBinName" @keyup.enter.native="searchDialog()" placeholder="请输入内容" :maxlength="50"></el-input>
                </div>
              </el-col>

              <el-col :span="6">
                <div class="grid-content">
                  <label >商品名称：</label>
                  <el-input maxlength="100" id="name2" v-model="goodsName"  @keyup.enter.native="searchDialog()" placeholder="请输入内容" :maxlength="100"></el-input>
                </div>
              </el-col>

              <el-col :span="6">
                <div class="grid-content">
                  <label >批次号：</label>
                  <el-input maxlength="100" id="name3" v-model="batchNo"  @keyup.enter.native="searchDialog()" placeholder="请输入内容" :maxlength="50"></el-input>
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

            <el-table-column label="商品编码">
              <template slot-scope="scope">
                <span class="cen-g">{{ scope.row.goodsCode }}</span>
              </template>
            </el-table-column>

            <el-table-column label="条形码" >
              <template slot-scope="scope">
                <span class="cen-g">{{ scope.row.barCode }}</span>
              </template>
            </el-table-column>

            <el-table-column label="商品名称" >
              <template slot-scope="scope">
                <span class="initP-g">{{ scope.row.goodsName }}</span>
              </template>
            </el-table-column>

            <el-table-column label="库区">
              <template slot-scope="scope">
                <span class="initP-g">{{ scope.row.sectionName }}</span>
              </template>
            </el-table-column>

            <el-table-column label="库位">
              <template slot-scope="scope">
                <span class="cen-g">{{ scope.row.storageBinName }}</span>
              </template>
            </el-table-column>

            <el-table-column label="库位类型">
              <template slot-scope="scope">
                <span class="cen-g" v-show="scope.row.binType == 1">正品</span>
                <span class="cen-g" v-show="scope.row.binType == 2">次品</span>
              </template>
            </el-table-column>

            <el-table-column label="批次">
              <template slot-scope="scope">
                <span class="cen-g">{{ scope.row.batchNo }}</span>
              </template>
            </el-table-column>

            <el-table-column label="可配货库存">
              <template slot-scope="scope">
                <span class="cen-g">{{ scope.row.dstInv }}</span>
              </template>
            </el-table-column>

            <el-table-column label="可移动量">
              <template slot-scope="scope">
                <span class="cen-g">{{ scope.row.canMoveOutInv }}</span>
              </template>
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
        <el-button size="mini" @click="result()">取 消</el-button>
        <el-button size="mini" type="primary" @click="refuseTrueClick" :disabled="isSure">确 定</el-button>
      </span>
    </el-dialog>

    <!--表格-->
    <div class="pDown">
     <el-table :data="tableData"
                border style="width: 100%"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column
          align='center'
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column label="条形码" width="110">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.barCode }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" >
          <template slot-scope="scope">
            <span class="initP-g">{{ scope.row.goodsName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="批次">
          <template slot-scope="scope">
            <span class="initP-g">{{ scope.row.batchNo }}</span>
          </template>
        </el-table-column>

        <el-table-column label="来源库区">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.sectionName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="来源库位">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.sourceStorageBinName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="库位类型">
          <template slot-scope="scope">
            <span class="cen-g" v-show="scope.row.binType == 1">正品</span>
            <span class="cen-g" v-show="scope.row.binType == 2">次品</span>
          </template>
        </el-table-column>

        <el-table-column label="可移动量">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.canMoveOutNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="目标库区" >
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.targetSectionName}}</span>
          </template>
        </el-table-column>

        <el-table-column label="目标库位" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.isShowNum"> <el-input type="text" v-model="scope.row.targetStorageBinName"   @blur="holdNum(scope.row,scope.$index)"></el-input></div>
            <div v-if="scope.row.isShowMum"><el-input type="text" v-model="scope.row.targetStorageBinName" style="border: 1px solid red;"  @blur="holdNum(scope.row,scope.$index)"></el-input></div>
          </template>
        </el-table-column>

        <el-table-column label="可移入量">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.canMoveIntoNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="计划移动量" >
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.planMoveQty" :disabled="scope.row.isShowOne"
                      :class="{ box: isClasses ==true && (scope.row.planMoveQty==undefined||scope.row.planMoveQty=='')||(scope.row.planMoveQty>scope.row.canMoveOutNum)||(scope.row.planMoveQty>scope.row.canMoveIntoNum)}"
                      @keyup.native="scope.row.planMoveQty = scope.row.planMoveQty.replace(/[^\d]/g,'');if(scope.row.planMoveQty == 0)scope.row.planMoveQty = ''"  @blur="moveNum(scope.row,scope.$index)":maxlength="10"
            ></el-input>
          </template>
        </el-table-column>

       <el-table-column label="操作" width="177">
         <template slot-scope="scope">
             <el-button  @click.native.prevent="deleteGoods(scope.$index, tableData)"   ref="del" type="text" size="small" style="color: red">删除</el-button>
         </template>
       </el-table-column>

      </el-table>
      <!--footer-->
      <div class="wmsFoot">
        <el-button @click="holdClick" size="mini" type="primary" :disabled="isDisable">保 存</el-button>
        <el-button @click="backClick" size="mini" type="info">返 回</el-button>
      </div>
    </div>

    <!--切换仓库提示-->
    <el-dialog v-dialogDrag
      title="提示"
      :visible.sync="refuseClickOne"
      width="420px"
      center>
      <div style="text-align: center">
        <span>切换仓库，商品数据将会清空，是否确定切换？</span>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="refuseClickOne= false">取 消</el-button>
            <el-button size="mini" type="primary" @click="affirm">确 认</el-button>
          </span>
    </el-dialog>

  </div>
</template>
<script>
 // import {turnTimestamp, returnTimesStamp, priceValidator, positiveIntegerValidator , Trim} from '@/assets/js/validate.js';
  import pagination from '@/components/common/Pagination.vue'
  export default {
    components: {
      pagination
    },
    data(){
      return{
        version: '1.0.0',//版本号
        optionsStock:[],//仓库下拉
        storageId: '',//仓库
        remark: '',//调整说明
        tableData:[],//表格数据
        isExplainShow: false,//调整说明验证
        isStockShow: false,//仓库为空校验
        refuseClick: false,//添加商品
        optionsStockAreaDialog:[{value: '',label: '全部'}],//弹框库区下拉
        storageSectionIdDialog: '',//弹框库区
        optionsAdjustDialog: [
          {value: '1001',label: '条形码'},
          {value: '1002',label: '库位'}
          ],//弹框库位、条形码下拉
        select1TypeDialog: '1002',//弹框库位、条形码
        select1ValueDialog: '',//弹框库位、条形码值
        goodsNameDialog: '',//弹框商品名称
        storageSectionId:'',//库区id
        tableDataDialog: [],//弹框表格数据
        multipleTable: [],//弹框选择的数据
        total: 0, //总页数
        totalPage: 15, // 要显示的条数
        currentPage: 1, //当前页
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        barCode:'',//条形码
        sectionName:'',//库区
        storageBinName:'',//库位
        goodsName:'',//商品名称
        batchNo:'',//批次号
        multipleSelection:[], //弹框选择商品
        isShowNum:false,//目标库位显示
        isShowMum:false,//目标库位框为红色显示
        targetStorageSectionId:'',//目标库区id
       // targetStorageBinId:'',//目标库位id
        isDisable: false,//保存禁止按钮
        refuseClickOne:false,//切换仓库取消按钮
        isShowOne:false,//计划移动量禁止按钮
        isClasses:false,//状态
        isSure:false,//确实禁止按钮
      }
    },
    mounted(){
      this.initStock();//初始和仓库下拉
    },
    methods:{

      //校验计划移动和可移出量和移入量
      moveNum(row){
        if(row.planMoveQty>row.canMoveOutNum){
        this.isClasses=true
        this.$message({
          type: 'warning',
          message: '计划移动量不能大于可移出量!'
        })
      }
        if(row.planMoveQty>row.canMoveIntoNum){
          this.isClasses=true
          this.$message({
            type: 'warning',
            message: '计划移动量不能大于可移入量!'
          })
        }
      },

      //表格取消
      result(){
        this.refuseClick = false;
        this.tableData=[]
      },

      //转换仓库
      changeOne(){
        if(this.tableData==''){

        }else{
          this.refuseClickOne=true
        }
      },

      //确认切换仓库
      affirm(){
        this.tableData= [];
        this.refuseClickOne= false;
      },

      //删除
      deleteGoods(index, rows) {
        rows.splice(index, 1);
      },

      //获取移动量
      holdNum:function(row,index){
        if(row.storageBinName==row.targetStorageBinName){
          this.$message({
            type: 'warning',
            message: '目标库位和来源库位不能相同!'
          })
        }else{
          if(this.planMoveQty==undefined){
            this.planMoveQty=0
          } if(row.targetStorageBinName==undefined){
            row.targetStorageBinName=''
          }
          if(row.binInvId==undefined){
            row.binInvId=''
          }
          let data = {
            merchantId: 0,
            binInvId:row.binInvId,
            goodsId: row.goodsId,
            storageBinName:row.targetStorageBinName,
            batchNo:row.batchNo,
            binType:row.binType,
            storageId: this.storageId,
            planMoveQty:this.planMoveQty,
            sourceStorageSectionId:row.sourceStorageSectionId,//来源库区id
            sourceStorageBinId:row.sourceStorageBinId,//来源库位id
          };
          this._post('com.edb01.erp.wms.service.api.WmStockMoveService/' + this.version + '/checkWmStorageBin',data).then(function (res) {
            if(res.data.success==true) {
              if (res.data.code == 0) {
                let obj = this.tableData[index];
                obj.targetSectionName = res.data.result.sectionName;
                obj.canMoveIntoNum = res.data.result.canMoveIntoNum;
                if(res.data.result.planMoveQty==undefined){
                  obj.planMoveQty= row.planMoveQty
                  row.isShowOne=false
                }else{
                  obj.planMoveQty= res.data.result.planMoveQty;
                  row.isShowOne=true
                }
                this.$set(this.tableData, index, obj);
                row.isShowMum = false;
                row.isShowNum = true;
                obj.targetStorageSectionId = res.data.result.storageSectionId
                obj.targetStorageBinId = res.data.result.storageBinId
                if(!res.data.result.planMoveQty==undefined){
                  this.planMoveQty = res.data.result.planMoveQty
                  this.isShowOne=true
                }else{
                  this.planMoveQty=''
                  this.isShowOne=false
                }
              }
            }else{
             if (res.data.code == 600000004) {
                row.isShowMum = true;
                row.isShowNum = false;
                row.targetStorageBinName = ''
               this.$message({
                 type: 'warning',
                 message:'不存在该库位名称的库位!',
               })
              }  else if (res.data.code == 9528) {
                row.isShowMum = true;
                row.isShowNum = false;
                row.targetStorageBinName = ''
               this.$message({
                 type: 'warning',
                 message: '有商品未填写目标库位!'
               })
              } else{
               row.isShowMum = true;
               row.isShowNum = false;
                this.$message({
                  type: 'warning',
                  message: res.data.msg
                })
              }
            }
          }.bind(this));
        }
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth').then(function (res) {
          let arr = res.data.result;
          this.optionsStock = arr;
            /*arr.forEach(function (val) {
            this.optionsStock =
            this.optionsStock.push({value: val.storageId,label: val.storageName})
          }.bind(this));*/
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
         /* sectionName: this.sectionName,//库区*/
          storageBinName: this.storageBinName,//库位
          goodsName: this.goodsName,//商品名称
          batchNo: this.batchNo,//批次号
          page: this.curPage,//当前页
          size: this.pageSize,//每页行数

        };
        this._post('com.edb01.erp.wms.service.api.WmBinInvService/' + this.version + '/queryPager',data)
          .then(function (res) {
            if (res.data.result.hasOwnProperty("rows")){
              res.data.result.rows.forEach((val,i)=>{
                val.canMoveIntoNum = ''
              })
              this.tableDataDialog=res.data.result.rows;
              this.total = res.data.result.total;
            }else{
              this.tableDataDialog ='';
              this.total = 0;
            }
          }.bind(this))
      },

      //添加保存接口
      initHold: function (row) {
             this.isDisable=true
             let arr = [];
              this.tableData.forEach(function (val) {
                arr.push(val.targetStorageBinName);
              }.bind(this));
              if (arr.indexOf(undefined) != -1) {
                this.isDisable=false
                this.$message({
                  type: 'warning',
                  message: '有商品未填写目标库位!'
                })
                return false;
              }
              this.tableData.forEach(function (val) {
                arr.push(val.planMoveQty);
              }.bind(this));
              if (arr.indexOf(undefined) != -1) {
                this.isDisable=false
                this.$message({
                  type: 'warning',
                  message: '有商品未填写计划移动量!'
                })
                return false;
              }
        let str = JSON.stringify(this.tableData);
        let data = {
              storageId: this.storageId,
              remark: this.remark,
              wmStockMoveItemPOParamListStr: str
            };
        this._post('com.edb01.erp.wms.service.api.WmStockMoveService/'+this.version+'/insert',data)
            .then(function (res) {
            /*  if(res.data.success) {*/
                //提交成功
                if (res.data.success == true) {
                  this.$message({
                    type: 'success',
                    message: '添加成功!'
                  })
                  //直接跳回首页
                  this.$router.push('/change')
                }else {
                this.$message({
                  type: 'warning',
                  message: res.data.msg
                })
                  this.isDisable=false
              }

      /*      }else {
                this.$message({
                  message: res.data.result.data,
                  type: 'warning'
                })
            }*/
          }.bind(this))
             setTimeout(() => {
              this.isDisable = false
            }, 1500)

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
        }
        else {
          this.isExplainShow = false;
          this.initHold()
        }
      },

      //弹框选择商品
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //可移动量(移出
      isMoveNum:function () {
        let data= [];
        this.multipleSelection.forEach(item => {
           let str = {canMoveOutNum:'',binInvId:item.binInvId,planMoveNum:'',storageId:item.storageId,batchNo:item.batchNo, sourceStorageBinId:item.storageBinId,sourceStorageSectionId:item.storageSectionId, goodsId:item.goodsId }
          data.push(str);
        })
        data = JSON.stringify(data);
        this._post('com.edb01.erp.wms.service.api.WmBinInvService/' + this.version + '/queryMoveOutNum',{wmBinCanMoveOutBeanListStr:data}).then(function (res) {
          res.data.result.forEach((item, i) => {
            this.multipleSelection.forEach(function (val) {
              if (item.binInvId == val.binInvId) {
                val.canMoveOutNum =item.canMoveOutNum;
                this.tableData.push({isShowNum:true,canMoveOutNum:item.canMoveOutNum,stockMoveItemId:val.stockMoveItemId,storageId:val.storageId,
                  storageBinId:val.storageBinId,sourceStorageBinName:val.storageBinName,barCode:val.barCode,sectionName:val.sectionName,binInvId:val.binInvId,
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
        this.isSure=true
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
          this.initDialog();
        }
      },
      getCurPage: function (val) {
        if (val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.initDialog();
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
  #AddChange .el-textarea{
    width: 83%;
  }
  #AddChange #isWidth{
    width: 2000px;
  }
  #AddChange .el-table .cell {
    text-align: center;
  }
  #AddChange .box input.el-input__inner {
    border: 1px solid red !important;
  }
</style>
