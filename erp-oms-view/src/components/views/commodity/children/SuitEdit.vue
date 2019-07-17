<!-- 虚拟套装调整 樊虎-->
<template>
  <div id="giftAdjust" style='padding-bottom:95px !important;'>
    <el-breadcrumb separator="/" class="col-breadcrumb" style="margin-bottom:15px;">
      <el-breadcrumb-item :to="{ path: '/suitAdjust' }"><span @click="showParentBlock">虚拟套装调整</span></el-breadcrumb-item>
      <el-breadcrumb-item>{{titleName}}调整单</el-breadcrumb-item>
    </el-breadcrumb>
    <!--表单区域-->
    <el-row>
      <el-col :span="24">
        <el-form :model="paramData" :rules="rules" ref="ruleForm" label-width="90px" class="ruleForm">
          <el-form-item label="调整类型：" prop="adjustType" style="margin-right:0;width:300px;">
            <el-select size='small' v-model="paramData.adjustType" :disabled="isDisabled || isDisEdit" placeholder="请选择调整类型" @change="handleAdjustChange(1)">
              <el-option
                v-for="item in adjustTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套装类型：" prop="adjustType" style="margin-right:0;width:290px;">
            <el-select size='small' v-model="paramData.suitType" :disabled="isDisabled || isDisEdit" placeholder="请选择调整类型" @change="handleAdjustChange(2)">
              <el-option
                v-for="item in suitTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <span style="margin-top:5px;display:inline-block;float:left;height:48px;">（<span style="color:orange;">现货套装只能和现货单品相互调整，预售套装只能和预售单品相互调整</span>）</span>
          <el-form-item label="调整说明：" style="width:700px;">
            <el-input type="textarea" maxlength="200" size="small" :disabled="isDisabled" placeholder="" v-model="paramData.adjustNote"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--按钮区域-->
    <div style="margin:10px 0 20px 0;" v-if="type==1||type==3">
      <el-button @click="addProductDialog" type="primary">选择套装</el-button>
    </div>
    <!--表格区域-->
    <div class="border">
      <el-table
        border
        :data="paramData.listBean"
        @cell-dblclick="celldbClick"
        @row-click="handleRow"
      >
        <el-table-column
          align='center'
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          min-width=''
          align='center'
          width="">
        </el-table-column>
        <el-table-column
          prop="barCode"
          align='center'
          min-width=''
          label="条形码">
        </el-table-column>
        <el-table-column
          prop="adjustableQty"
          :render-header="renderHeader1"
          align='center'
          label="可调整数量"
          width="">
        </el-table-column>
        <el-table-column
          v-if="type == 2 || type == 4"
          prop="adjustQty"
          align='center'
          label="调整量"
          width="">
        </el-table-column>
        <el-table-column prop="adjustQty" v-if="type == 1 || type == 3" :render-header="renderHeader" align="center">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" size="mini" @keyup.native="scope.row.adjustQty = scope.row.adjustQty.replace(/[^\d]/g,'')" type='text' maxlength="9" v-model="scope.row.adjustQty" @blur="keyupNumSave(scope.row)"></el-input>
            <span v-else>{{scope.row.adjustQty}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isDisabled"
          label="操作"
          align='center'
          width="110">
          <template slot-scope="scope">
            <el-button style="color:red;" type='text' @click="tableDel(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:20px;">
      <h5>套装单品</h5>
      <div class="border">
        <el-table
          border
          :data="singleGoodsData"
        >
          <el-table-column
            align='center'
            label="序号"
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            label="商品名称"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="barCode"
            align='center'
            min-width=''
            label="条形码">
          </el-table-column>
          <el-table-column
            prop="maxQty"
            align='center'
            label="数量"
            width="">
          </el-table-column>
          <el-table-column
            prop="adjustableQty"
            :render-header="renderHeader2"
            v-if="paramData.adjustType==1"
            align='center'
            label="可调整数量"
            width="">
          </el-table-column>
          <el-table-column
            prop="adjustQty"
            align='center'
            label="调整数量"
            width="">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--操作日志-->
    <div v-if="type==2" class="col-nav" style="margin:10px 0 20px 0;line-height:30px;padding-left:10px;">
      <span>操作日志</span>
      <public-Log2 :paramObj="paramObj"></public-Log2>
    </div>
    <div class="col-button">
      <el-button style="width:100px;" size="small" @click="showParentBlock">返回</el-button>
      <el-button v-if="type==1 || type==3" type="primary" style="width:100px;" size="small" @click="adjustSave('ruleForm')">保存</el-button>
      <el-button v-if="type==4" type="primary" style="width:100px;" size="small" @click="auditPassOrReject('ruleForm',2)">审核拒绝</el-button>
      <el-button v-if="type==4" type="primary" style="width:100px;" size="small" @click="auditPassOrReject('ruleForm',1)">审核通过</el-button>
    </div>
    <!--添加商品弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="`添加调整${giftName}`" :visible.sync="dialogAddProduct" width="800px">
      <div class="input-box">
        <el-row>
          <el-col :span="10">
            <div><label for="">条形码：</label>
              <el-input  maxlength="50" size='small' v-model="queryData.barCode" @keyup.enter.native="queryProductBtn"></el-input>
            </div>
          </el-col>
          <el-col :span="10">
            <div><label for="">商品名称：</label>
              <el-input  maxlength="100" size='small' v-model="queryData.goodsName" @keyup.enter.native="queryProductBtn"></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button size="small" type="primary" style="width:80px;" @click="queryProductBtn">查询</el-button>
          </el-col>
        </el-row>
        <el-table
          border
          max-height="500"
          highlight-current-row
          :data="addProductData"
          @selection-change="handleSelectionChange"
          @current-change="selectStoreRow"
          style="margin-top:15px;margin-bottom:0;"
        >
          <el-table-column
            align='center'
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            v-if="paramData.adjustType==2"
            align='center'
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align='center'
            label="商品名称"
            width="">
          </el-table-column>
          <el-table-column
            prop="barCode"
            label="条形码"
            min-width=''
            align='center'
            width="">
          </el-table-column>
        </el-table>
        <div class="dialog-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[15, 30, 50, 100, 200]"
            :page-size="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small"  @click="dialogAddProduct=false">取消</el-button>
        <el-button type="primary" size="small" style="width:80px;" @click="saveAddProduct">确定</el-button>
      </span>
    </el-dialog>
    <!--审核拒绝弹框-->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="审核拒绝" :visible.sync="dialogReject" width="450px">
      <el-form :model="rejectObj" :rules="rules2" ref="ruleForm2" label-width="80px" class="ruleForm">
        <el-form-item label="审核备注：" prop="auditRemark" style="width:330px;height:100px;">
          <el-input maxlength="200" type="textarea" size="small" placeholder="请输入审核备注（必填）" v-model="rejectObj.auditRemark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="margin-right:90px;">
        <el-button size="small"  @click="dialogReject=false">取消</el-button>
        <el-button type="primary" size="small" style="width:80px;" @click="auditReject('ruleForm2')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {positiveIntegerZero} from '@/assets/js/validate.js';
  import PublicLog2 from '@/components/common/PublicLog2.vue';
  export default {
    name: '',
    inject:['form'],
    props:{
      params:Object
    },
    components:{
      PublicLog2
    },
    data() {
      return {
        paramObj:{
          moduleId:'50',
          billCode:this.params.adjustId
        },//公共日志
        rules: {
          adjustType:{required: true ,message: '请选择调整类型', trigger: 'blur' },
          adjustNote:{required: true ,message: '请填写调整说明', trigger: 'blur' },
        },//表单验证规则
        rules2: {
          auditRemark:{required: true ,message: '请输入审核备注', trigger: 'blur' },
        },//表单验证规则（审核拒绝弹框）
        rejectObj:{
          auditRemark:''
        },//审核拒绝弹框入参
        dialogReject:false,//审核拒绝弹框
        adjustTypeArr: [
          {
            label: '单品转套装',
            value: 1
          },
          {
            label: '套装转单品',
            value: 2
          }
        ],//调整类型
        suitTypeArr:[
          {
            label: '现货套装',
            value: 1
          },
          {
            label: '预售套装',
            value: 2
          }
        ],//套装类型
        giftName:'商品',//按钮名字
        isDisabled:false,//是否禁用
        isDisEdit:false,//是否禁用（调整类型、套装类型）
        titleName:'添加',//标题
        version: '1.0.0',
        tableData:[],//表格数据
        dialogAddProduct:false,//添加商品弹框
        addProductData:[],//添加商品表格数据
        currentPage:1,
        totalPage:15,
        totalNum:0,
        paramData:{
          listBean:[],
          adjustNote:'',
          adjustType:1,
          suitType:1
        },//添加调整单入参
        singleGoodsData:[],//单品列表
        adjustType:1,//记录调整类型状态
        suitType:1,//记录套装类型状态
        adjustId:this.params.adjustId,//调整单id
        type:this.params.type,
        selectionData:[],//选中数据集合
        dogFlag:true,//防止多次点击
        queryData:{
          goodsName:'',
          barCode:'',
          page:1,
          size:15
        },//添加商品弹框查询条件
      }
    },
    watch:{
    },
    methods: {
      showParentBlock(clockBlock) {
        this.$emit('changeShow')
      },
      //表头渲染
      renderHeader(createElement, { _self }) {
        return createElement(
          'span',
          {
            'style':'font-weight:bold;'
          },
          [
            createElement('span', ['调整数量']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-edit',
                'style':'font-weight:bold;margin-left:5px;'
              }
            )
          ]
        );
      },
      renderHeader1(createElement, { _self }) {
        return createElement(
          'span',
          {
            'style':'font-weight:bold;'
          },
          [
            createElement('span', ['可调整数量']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-question is-show',
                'style':'margin-left:5px;font-size:14px;display:none;',
                on:{
                  mouseover:this.headerOver1
                }
              }
            )
          ]
        );
      },
      renderHeader2(createElement, { _self }) {
        return createElement(
          'span',
          {
            'style':'font-weight:bold;'
          },
          [
            createElement('span', ['可调整数量']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-question',
                'style':'margin-left:5px;font-size:14px;',
                on:{
                  mouseover:this.headerOver2
                }
              }
            )
          ]
        );
      },
      //根据调整类型鼠标滑过表头显示相应内容
      headerOver1(val){
        if(this.paramData.suitType==1){
          $(val.target).attr('title','套装的可售库存-预售库存-台账库存-调整预占');
        }else{
          $(val.target).attr('title','预售库存-调整预占');
        }
      },
      headerOver2(val){
        if(this.paramData.suitType==1){
          $(val.target).attr('title','单品的可售库存-预售库存-调整预占');
        }else{
          $(val.target).attr('title','预售单品的预售库存-调整预占');
        }
      },
      //change调整类型
      handleAdjustChange(type){
        if(this.paramData.listBean.length>0){
          this.$confirm('切换调整类型或者套装类型，套装数据将会被会清空，是否确定切换？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            this.paramData.listBean=[];
            this.singleGoodsData=[];
            if(type==1){
              this.adjustType = this.paramData.adjustType;
              if(this.adjustType==1){
                $('.is-show').hide();
              }else{
                $('.is-show').show();
              }
            }else{
              this.suitType = this.paramData.suitType;
            }
          }).catch(() => {
            if(type==1){
              this.paramData.adjustType = this.adjustType;
            }else{
              this.paramData.suitType = this.suitType;
            }
          });
        }else{
          if(type==1){
            this.adjustType = this.paramData.adjustType;
            if(this.adjustType==1){
              $('.is-show').hide();
            }else{
              $('.is-show').show();
            }
          }else{
            this.suitType = this.paramData.suitType;
          }
        }
      },
      //双击单元格
      celldbClick(row, column, cell, event){
        if(column.property=="adjustQty" && !this.isDisabled){
          row.isEdit=true;
          console.log(row.isEdit);
        }
      },
      //单击单元格
      handleRow(row){
        console.log(row);
        if(this.paramData.adjustType==2){
          this.singleGoodsData=row.suitInnerBeanList;
        }
      },
      //单元格保存
      keyupNumSave(row,index){
        //row.adjustQty=positiveIntegerZero(row.adjustQty);
        if(row.adjustQty===''){
          row.isEdit=false;
          row.suitInnerBeanList.forEach((item,i)=>{
            item.adjustQty='';
          })
          this.singleGoodsData.forEach((item,i)=>{
            this.$set(item,'adjustQty','');
          })
        }else if(row.adjustQty<=0){
          this.$message({
            message: '调整数量必须为大于0的正整数！',
            type: 'warning'
          });
        }else if(row.adjustQty*1>row.adjustableQty*1){
          this.$message({
            message: '调整数量不能大于可调整量！',
            type: 'warning'
          });
        }else{
          row.suitInnerBeanList.forEach((item,i)=>{
            item.adjustQty=row.adjustQty*item.maxQty;
          })
          this.singleGoodsData.forEach((item,i)=>{
            this.$set(item,'adjustQty',row.adjustQty*item.maxQty)
          })
          row.isEdit=false;
        }
      },
      handleSelectionChange(val){
        this.selectionData = val;
      },
      //点击当前行
      selectStoreRow(row, oldrow) {
        if(this.paramData.adjustType==1){
          this.selectionData[0]=row;
        }
      },
      handleSizeChange(val) {
        this.queryData.size = val;
        this.queryProductBtn();
      },
      handleCurrentChange(val) {
        this.queryData.page = val;
        this.queryProductBtn();
      },
      //添加商品列表渲染
      queryProductBtn(){
        this.selectionData=[];
        this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/querySuitListByCondition',this.queryData).then((response)=>{
          if (response.data.success) {
            this.dialogAddProduct=true;
            response.data.result.rows.forEach((item,i)=>{
              item.isEdit=false;
              item.adjustQty='';
              item.suitInnerBeanList.forEach((item2,i)=>{
                item2.adjustQty='';
              })
            })
            this.addProductData=response.data.result.rows;
            this.totalNum=response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //添加商品
      addProductDialog(){
        if(!this.paramData.adjustType){
          this.$message({
            message: '请选择调整类型',
            type: 'warning'
          });
          return false;
        }
        this.queryData.goodsName='';
        this.queryData.barCode='';
        this.queryProductBtn();
      },
      //添加商品保存
      saveAddProduct(logo){
        if(this.selectionData.length==0 || this.selectionData[0]==null){
          this.$message({
            message: '请选择要添加的商品！',
            type: 'warning'
          });
          return false;
        }else{
          if(this.paramData.adjustType==1 && this.selectionData.length != 1){
            this.$message({
              message: '只能选择一个套装！',
              type: 'warning'
            });
            return false;
          }else if(this.paramData.adjustType==1 && this.paramData.listBean.length>=1){
            this.$message({
              message: '已经添加套装，请先删除套装再添加！',
              type: 'warning'
            });
            return false;
          }
          //单品转套装
          if(this.paramData.adjustType==1){
            var goodsIds='';
            this.selectionData[0].suitInnerBeanList.forEach((item,i)=>{
              goodsIds+=item.goodsId+',';
              item.adjustableQty = 0;
            })
            this._post('com.edb01.erp.wms.service.api.WmMerchantInvService/' + this.version + '/queryGoodsInvByIdList',{
              goodsIdListComma:goodsIds.slice(0,-1),
              suitType:this.paramData.suitType
            }).then((response)=>{
              if (response.data.success) {
                //通过goodsId重组数组
                var mapArr=new Map(),adjustableQty=0,maxArr=[];
                response.data.result.forEach((item,i)=>{
                  if(item)mapArr.set(item.goodsId,item);
                })
                this.selectionData[0].suitInnerBeanList.forEach((item,i)=>{
                  if(mapArr.get(item.goodsId)){
                   //现货套装
                   if(this.paramData.suitType==1){
                      item.adjustableQty=mapArr.get(item.goodsId).goodsSalesInv-mapArr.get(item.goodsId).goodsTotalAdvanceQty;
                      item.adjustableQty=item.adjustableQty>0?item.adjustableQty:0;
                   //预售套装
                   }else{
                     item.adjustableQty=mapArr.get(item.goodsId).goodsPresellInv-mapArr.get(item.goodsId).goodsTotalAdvanceQty;
                     item.adjustableQty=item.adjustableQty>0?item.adjustableQty:0;
                   }
                    maxArr.push(Math.floor(item.adjustableQty/item.maxQty));
                  }
                })
                maxArr=maxArr.sort((a,b)=>{
                  return a*1 - b*1;
                })
                console.log(maxArr);
                this.selectionData[0].adjustQty='';
                this.selectionData[0].adjustableQty=maxArr[0]?maxArr[0]:0;
                //添加到页面
                if(this.paramData.listBean.length<1){
                  this.paramData.listBean.push(this.selectionData[0]);
                  this.singleGoodsData=this.selectionData[0].suitInnerBeanList;
                  this.dialogAddProduct=false;
                }
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          }else{
            //套装转单品
            var goodsIds='';
            this.selectionData.forEach((item,i)=>{
              goodsIds+=item.goodsId+',';
              item.adjustableQty = 0;
            })
            this._post('com.edb01.erp.wms.service.api.WmMerchantInvService/' + this.version + '/querySuitInvByIdList',{
              suitIdListComma:goodsIds.slice(0,-1),
              suitType:this.paramData.suitType
            }).then((response)=>{
              if(response.data.success){
                //通过goodsId重组数组
                var mapArr=new Map();
                response.data.result.forEach((item,i)=>{
                  if(item)mapArr.set(item.goodsId,item);
                })
                this.selectionData.forEach((item,i)=>{
                  if(mapArr.get(item.goodsId)){
                    item.adjustQty='';
                    //现货套装
                    if(this.paramData.suitType==1){
                      item.adjustableQty=mapArr.get(item.goodsId).goodsSalesInv-mapArr.get(item.goodsId).accountInv-mapArr.get(item.goodsId).suitTotalAdvanceQty;
                      console.log(item.adjustableQty);
                      item.adjustableQty=item.adjustableQty>0?item.adjustableQty:0;
                      //预售套装
                    }else{
                      item.adjustableQty=mapArr.get(item.goodsId).goodsPresellInv-mapArr.get(item.goodsId).suitTotalAdvanceQty;
                      item.adjustableQty=item.adjustableQty>0?item.adjustableQty:0;
                    }
                  }
                })
                //添加到页面
                var excludeMapArr=new Map();
                this.paramData.listBean.forEach((item,i)=>{
                  excludeMapArr.set(item.goodsId,item);
                })
                this.selectionData.forEach((item,i)=>{
                  if(!excludeMapArr.get(item.goodsId)){
                    this.paramData.listBean.push(item);
                    this.singleGoodsData=this.paramData.listBean[0].suitInnerBeanList;
                  }
                })
                //console.log(this.paramData.listBean);
                this.dialogAddProduct=false;
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          }
        }
      },
      //table列表删除
      tableDel(index,row){
        this.$confirm('确定删除此套装吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.paramData.listBean.splice(index,1);
          if(this.paramData.listBean.length==0){
            this.singleGoodsData=[];
          }
        }).catch(() => {});
      },
      //策略调整保存
      adjustSave(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.paramData.listBean.length<1){
              this.$message({
                message: '请选择套装！',
                type: 'warning'
              });
              return false;
            }
            var isPass=true,isPass2=true,isPass3=true;
            this.paramData.listBean.forEach((item,i)=>{
              if(item.adjustQty==''){
                isPass=false;
                item.isEdit=true;
              }
              if(item.adjustQty*1>item.adjustableQty*1){
                isPass2=false;
                item.isEdit=true;
              }
              if(item.adjustQty*1<=0){
                isPass3=false;
                item.isEdit=true;
              }
            })
            if(!isPass){
              this.$message({
                message: '存在调整数量为空的套装！',
                type: 'warning'
              });
              return false;
            }
            if(!isPass2){
              this.$message({
                message: '存在调整数量大于可调整量的套装，请重新填写调整数量！',
                type: 'warning'
              });
              return false;
            }
            if(!isPass3){
              this.$message({
                message: '调整数量必须为大于0的正整数！',
                type: 'warning'
              });
              return false;
            }
            this.paramData.listBean.forEach((item,i)=>{
              item.suitGoodsId=item.goodsId;
              item.WmVirtualsuitAdjustItemGoodsBeanList=item.suitInnerBeanList;
            })
            console.log(this.paramData.listBean);
            this.paramData.wmVirtualsuitAdjustItemBeanList=JSON.stringify(this.paramData.listBean);
            if(this.type==1 && this.dogFlag){//新建
              this.dogFlag=false;
              this.paramData.adjustId='';
              this._post('com.edb01.erp.wms.service.api.WmVirtualsuitAdjustService/'+this.version+'/insertSuitAdjust',this.paramData).then((response)=>{
                if(response.data.success){
                  setTimeout(()=>{
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    });
                  },300)
                  this.$emit('changeShow',{isRefresh:true});
                }else{
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
                setTimeout(()=>{
                  this.dogFlag=true;
                },1000)
              })
            }else if(this.type==3){//修改
              this.paramData.adjustId=this.adjustId;
              this._post('com.edb01.erp.wms.service.api.WmVirtualsuitAdjustService/'+this.version+'/updateSuitAdjust',this.paramData).then((response)=>{
                if(response.data.success){
                  setTimeout(()=>{
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    });
                  },300)
                  this.$emit('changeShow',{isRefresh:true});
                }else{
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      //审核通过、审核拒绝
      auditPassOrReject(formName,type){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.paramData.listBean.forEach((item,i)=>{
              item.suitGoodsId=item.goodsId;
              item.WmVirtualsuitAdjustItemGoodsBeanList=item.suitInnerBeanList;
            })
            this.paramData.wmVirtualsuitAdjustItemBeanList=JSON.stringify(this.paramData.listBean);
            this.paramData.adjustId=this.adjustId;
            if(type==1){
              var isPass=true,isPass2=true,isPass3=true;
              this.paramData.listBean.forEach((item,i)=>{
                if(item.adjustQty==''){
                  isPass=false;
                  item.isEdit=true;
                }
                if(item.adjustQty*1>item.adjustableQty*1){
                  isPass2=false;
                  item.isEdit=true;
                }
                if(item.adjustQty*1<0){
                  isPass3=false;
                  item.isEdit=true;
                }
              })
              if(!isPass){
                this.$message({
                  message: '存在调整数量为空的套装！',
                  type: 'warning'
                });
                return false;
              }
              if(!isPass2){
                this.$message({
                  message: '存在调整数量大于可调整量的套装，请重新填写调整数量！',
                  type: 'warning'
                });
                return false;
              }
              if(!isPass3){
                this.$message({
                  message: '存在调整数量小于0的套装，请重新填写调整数量！',
                  type: 'warning'
                });
                return false;
              }
              this.paramData.auditType=1;
              this._post('com.edb01.erp.wms.service.api.WmVirtualsuitAdjustService/'+this.version+'/auditSuitAdjust',this.paramData).then((response)=>{
                if(response.data.success){
                  this.$emit('changeShow',{isRefresh:true});
                  this.$message({
                    message: '审核成功！',
                    type: 'success'
                  });
                }else{
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            }else{
              this.dialogReject=true;
              if(this.paramData.auditRemark && this.paramData.auditRemark !='undefined'){
                this.rejectObj.auditRemark=this.paramData.auditRemark;
              }else{
                if(this.$refs['ruleForm2'])this.$refs['ruleForm2'].resetFields();
              }
            }
          } else {
            return false;
          }
        });
      },
      //审核拒绝确认
      auditReject(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.paramData.auditType=2;
            this.paramData.auditRemark=this.rejectObj.auditRemark;
            this._post('com.edb01.erp.wms.service.api.WmVirtualsuitAdjustService/'+this.version+'/auditSuitAdjust',this.paramData).then((response)=>{
              if(response.data.success){
                this.$emit('changeShow',{isRefresh:true});
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      //策略调整返回
      adjustCancel(){
        this.$router.push({path: '/suitAdjust'});
      },
    },mounted(){
      //console.log(this.form,this.$parent); 获取父组件属性和方法
      /*判断 新建 查看 修改 审核 页面*/
      if(this.type==1){
        this.titleName='添加';
      }else if(this.type==2){
        this.titleName='查看';
        this.isDisabled=true;
      }else if(this.type==3){
        this.titleName='修改';
      }else if(this.type==4){
        this.titleName='审核';
        this.isDisabled=true;
      }
      var _this=this;
      if(this.type!=1){
        echoFn()
      }
      //回显
      function echoFn(){
        _this._post('com.edb01.erp.wms.service.api.WmVirtualsuitAdjustService/'+_this.version+'/echoSuitAdjust',{adjustId:_this.adjustId}).then((res)=>{
          if(res.data.success){
            _this.paramData.adjustType=res.data.result.adjustType;
            _this.paramData.suitType=res.data.result.suitType;
            _this.paramData.adjustNote=res.data.result.adjustNote;
            _this.paramData.auditRemark=res.data.result.auditRemark;
            //_this.paramData.suitGoodsId=res.data.result.goodsId;
            var listBean=res.data.result.wmVirtualsuitAdjustItemBeans?res.data.result.wmVirtualsuitAdjustItemBeans:[];

            //单品转套装
            if(_this.paramData.adjustType==1){
              var goodsIds='';
              listBean[0].wmVirtualsuitAdjustItemGoodsBeans.forEach((item,i)=>{
                goodsIds+=item.goodsId+',';
              })
              _this._post('com.edb01.erp.wms.service.api.WmMerchantInvService/' + _this.version + '/queryGoodsInvByIdList',{
                goodsIdListComma:goodsIds.slice(0,-1),
                adjustId:_this.adjustId
              }).then((response)=>{
                if (response.data.success) {
                  //通过goodsId重组数组
                  var mapArr=new Map(),adjustableQty=0,maxArr=[];
                  response.data.result.forEach((item,i)=>{
                    if(item)mapArr.set(item.goodsId,item);
                  })
                  listBean[0].wmVirtualsuitAdjustItemGoodsBeans.forEach((item,i)=>{
                    item.goodsName=item.mdataSuitInnerBean.goodsName;
                    item.barCode=item.mdataSuitInnerBean.barCode;
                    item.maxQty=item.mdataSuitInnerBean.maxQty;
                    if(mapArr.get(item.goodsId)){
                      //现货套装
                      if(_this.paramData.suitType==1){
                        item.adjustableQty=mapArr.get(item.goodsId).goodsSalesInv-mapArr.get(item.goodsId).goodsTotalAdvanceQty;
                        item.adjustableQty=item.adjustableQty>0?item.adjustableQty:0;
                        //预售套装
                      }else{
                        item.adjustableQty=mapArr.get(item.goodsId).goodsPresellInv-mapArr.get(item.goodsId).goodsTotalAdvanceQty;
                        item.adjustableQty=item.adjustableQty>0?item.adjustableQty:0;
                      }
                      maxArr.push((item.adjustableQty/item.maxQty).toFixed(0));
                    }
                  })
                  maxArr=maxArr.sort((a,b)=>{
                    return a*1 - b*1;
                  })
                  listBean[0].goodsName=listBean[0].mdataSuitAdjustBean.goodsName;
                  listBean[0].barCode=listBean[0].mdataSuitAdjustBean.barCode;
                  listBean[0].adjustableQty=maxArr[0];
                  listBean[0].isEdit=false;
                  listBean[0].goodsId=listBean[0].suitGoodsId;
                  //添加到页面
                  if(_this.paramData.listBean.length<1){
                    _this.paramData.listBean.push(listBean[0]);
                    console.log(_this.paramData.listBean);
                    listBean[0].suitInnerBeanList = listBean[0].wmVirtualsuitAdjustItemGoodsBeans;
                    _this.singleGoodsData=listBean[0].suitInnerBeanList;
                  }
                } else {
                  _this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            }else{
              //套装转单品
              $('.is-show').show();
              var goodsIds='';
              listBean.forEach((item,i)=>{
                item.goodsId=item.suitGoodsId;
                goodsIds+=item.goodsId+',';
              })
              _this._post('com.edb01.erp.wms.service.api.WmMerchantInvService/' + _this.version + '/querySuitInvByIdList',{
                suitIdListComma:goodsIds.slice(0,-1),
                adjustId:_this.adjustId
              }).then((response)=>{
                if(response.data.success){
                  //通过goodsId重组数组
                  var mapArr=new Map();
                  response.data.result.forEach((item,i)=>{
                    if(item)mapArr.set(item.goodsId,item);
                  })
                  listBean.forEach((item,i)=>{
                    item.wmVirtualsuitAdjustItemGoodsBeans.forEach((item2,i)=>{
                      item2.goodsName=item2.mdataSuitInnerBean.goodsName;
                      item2.barCode=item2.mdataSuitInnerBean.barCode;
                      item2.maxQty=item2.mdataSuitInnerBean.maxQty;
                    })
                    item.suitInnerBeanList=item.wmVirtualsuitAdjustItemGoodsBeans;
                    item.goodsName=item.mdataSuitAdjustBean.goodsName;
                    item.barCode=item.mdataSuitAdjustBean.barCode;
                    item.isEdit=false;
                    item.goodsId=item.suitGoodsId;
                    if(mapArr.get(item.goodsId)){
                      //现货套装
                      if(_this.paramData.suitType==1){
                        item.adjustableQty=mapArr.get(item.goodsId).goodsSalesInv-mapArr.get(item.goodsId).accountInv-mapArr.get(item.goodsId).suitTotalAdvanceQty;
                        item.adjustableQty=item.adjustableQty>0?item.adjustableQty:0;
                        //预售套装
                      }else{
                        item.adjustableQty=mapArr.get(item.goodsId).goodsPresellInv-mapArr.get(item.goodsId).suitTotalAdvanceQty;
                        item.adjustableQty=item.adjustableQty>0?item.adjustableQty:0;
                      }
                    }
                  })
                  _this.paramData.listBean=listBean;
                  _this.singleGoodsData=_this.paramData.listBean[0].wmVirtualsuitAdjustItemGoodsBeans;
                }else{
                  _this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              })
            }

            //listBean=response.data.result.listBean;
          }else{
            _this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .ruleForm .el-form-item{
    float:left;
  }
  .input-box .el-input {
    width: 200px;
  }
  .input-box .el-select {
    width: 200px;
  }
  .input-box>div{
    margin-bottom:20px;
  }
  .input-box>div>span{
    display:inline-block;
    width:80px;
    text-align:right;
  }
</style>

