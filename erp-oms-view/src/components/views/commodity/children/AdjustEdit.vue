<!-- 赠品调整新建修改查看 樊虎-->
<template>
  <div id="giftAdjust" style='padding-bottom:95px !important;'>
    <el-breadcrumb separator="/" class="col-breadcrumb" style="margin-bottom:15px;">
      <el-breadcrumb-item :to="{ path: '/giftAdjust' }"><span @click="showParentBlock">赠品调整</span></el-breadcrumb-item>
      <el-breadcrumb-item>{{titleName}}调整单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="24">
        <el-form :model="paramData" :rules="rules" ref="ruleForm" label-width="90px" class="ruleForm">
          <el-form-item label="调整类型：" prop="adjustType">
            <el-select size='small' v-model="paramData.adjustType" :disabled="isDisabled || type==3" placeholder="请选择调整类型" @change="handleAdjustChange">
              <el-option
                v-for="item in adjustTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调整说明：" prop="adjustNote" style="width:600px;">
            <el-input type="textarea" maxlength="200" size="small" :disabled="isDisabled" placeholder="请输入调整说明（必填）" v-model="paramData.adjustNote"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--操作导航栏-->
    <div class="col-nav" style="margin:10px 0 20px 0;" v-if="type==1||type==3">
      <ul>
        <li @click="addProductDialog"><span>添加{{giftName}}</span></li>
      </ul>
    </div>
    <!--表格区域-->
    <div class="border">
      <el-table
        border
        :data="paramData.listBean"
        @cell-dblclick="celldbClick"
      >
        <el-table-column
          align='center'
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          prop="barCode"
          align='center'
          min-width=''
          label="条形码">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          min-width=''
          align='center'
          width="">
        </el-table-column>
        <el-table-column
          prop="allowableAdjustQty"
          align='center'
          label="可调整量"
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
            <el-input maxlength="9" v-if="scope.row.isEdit" size="mini" @keyup.native="scope.row.adjustQty = scope.row.adjustQty.replace(/[^\d]/g,'')"  v-model="scope.row.adjustQty" @blur="keyupNumSave(scope.row)"></el-input>
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
    <!--操作日志-->
    <div v-if="type==2" style="margin-top:20px;">
      <h5>操作日志</h5>
      <public-Log2 :paramObj="paramObj"></public-Log2>
    </div>
    <div class="col-button">
      <el-button style="width:100px;" size="small" @click="showParentBlock">返回</el-button>
      <el-button v-if="type==1 || type==3" type="primary" style="width:100px;" size="small" @click="adjustSave('ruleForm')">保存</el-button>
      <el-button v-if="type==4" type="primary" style="width:100px;" size="small" @click="auditPassOrReject('ruleForm',2)">审核拒绝</el-button>
      <el-button v-if="type==4" type="primary" style="width:100px;" size="small" @click="auditPassOrReject('ruleForm',1)">审核通过</el-button>
    </div>
    <!--添加商品弹框-->
    <el-dialog v-dialogDrag :title="`添加调整${giftName}`" :close-on-click-modal="false" :visible.sync="dialogAddProduct" width="800px">
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
          :data="addProductData"
          @selection-change="handleSelectionChange"
          style="margin-top:15px;margin-bottom:0;"
        >
          <el-table-column
            align='center'
            type="index"
            label="序号"
            width="55">
          </el-table-column>
          <el-table-column
            align='center'
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="barCode"
            label="条形码"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align='center'
            label="商品名称"
            width="">
          </el-table-column>
          <el-table-column
            v-if="paramData.adjustType==1"
            prop="goodsMerchantInv.goodsSalesInv"
            align='center'
            min-width=''
            label="可售余量">
          </el-table-column>
          <el-table-column
            v-if="paramData.adjustType==2"
            prop="goodsMerchantInv.giftSalesInv"
            align='center'
            min-width=''
            label="可售余量">
          </el-table-column>
          <el-table-column
            v-if="paramData.adjustType==1"
            prop="goodsMerchantInv.goodsPresellInv"
            align='center'
            min-width=''
            label="预售库存">
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
        <el-button size="small"  @click="dialogAddProduct=false">返回</el-button>
        <el-button type="primary" size="small" style="width:80px;" @click="saveAddProduct">添加并返回</el-button>
      </span>
    </el-dialog>
    <!--审核拒绝弹框-->
    <el-dialog v-dialogDrag title="审核拒绝" :close-on-click-modal="false" :visible.sync="dialogReject" width="450px">
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
    props:{
      params:Object
    },
    components:{
      PublicLog2
    },
    data() {
      return {
        paramObj:{
          moduleId:'49',
          billCode:this.params.adjustId
        },//公共日志
        rules: {
          adjustType:{required: true ,message: '请选择调整类型', trigger: 'blur' },
          adjustNote:{required: true ,message: '请填写调整说明', trigger: 'blur' },
        },//查询规则
        rules2: {
          auditRemark:{required: true ,message: '请输入审核备注', trigger: 'blur' },
        },//查询规则（审核拒绝弹框）
        rejectObj:{
          auditRemark:''
        },//审核拒绝参数
        dialogReject:false,//审核拒绝弹框
        adjustTypeArr: [
          {
            label: '商品转赠品',
            value: 1
          },
          {
            label: '赠品转商品',
            value: 2
          }
        ],//调整类型
        giftName:'商品',//商品 赠品
        isDisabled:false,//是否禁用
        titleName:'新建',//标题
        version: '1.0.0',
        tableData:[],//表格数据
        dialogAddProduct:false,//添加商品弹框
        addProductData:[],//添加商品弹框data
        currentPage:1,
        totalPage:15,
        totalNum:0,
        paramData:{
          listBean:[],
          adjustNote:'',
          adjustType:'',
        },//新建调整单参数
        adjustType:'',//调整类型记录状态
        adjustId:this.params.adjustId,//赠品调整id
        type:this.params.type,
        selectionData:[],//选中值集合
        queryData:{
          goodsType:1,
          goodsName:'',
          barCode:'',
          page:1,
          size:15
        },//添加商品查询条件
        dogFlag:true,//防止多次点击
      }
    },
    watch:{
    },
    methods: {
      //组件回传
      showParentBlock(clockBlock) {
        this.$emit('changeShow');
      },
      renderHeader(createElement, { _self }) {
        return createElement(
          'span',
          {
            'style':'font-weight:bold;'
          },
          [
            createElement('span', ['调整量']
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
      //change调整类型
      handleAdjustChange(){
        if(this.paramData.listBean.length>0){
          var giftName=this.paramData.adjustType==1?'赠品':'商品';
          this.$confirm('切换调整类型，'+giftName+'数据将会被会清空，是否确定切换？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            this.paramData.listBean=[];
            this.adjustType = this.paramData.adjustType;
            if(this.paramData.adjustType==1){
              this.giftName='商品';
            }else{
              this.giftName='赠品';
            }
          }).catch(() => {
            this.paramData.adjustType = this.adjustType;
          });
        }else{
          if(this.paramData.adjustType==1){
            this.giftName='商品';
          }else{
            this.giftName='赠品';
          }
          this.adjustType = this.paramData.adjustType;
        }
      },
      //双击单元格
      celldbClick(row, column, cell, event){
        if(column.property=="adjustQty" && !this.isDisabled){
          row.isEdit=true;
        }
      },
      //单元格保存
      keyupNumSave(row,index){
        row.adjustQty=positiveIntegerZero(row.adjustQty);
        row.isEdit=false;
      },
      handleSelectionChange(val){
        this.selectionData = val;
      },
      handleSizeChange(val) {
        this.queryData.size = val;
        this.queryProductBtn();
      },
      handleCurrentChange(val) {
        this.queryData.page = val;
        this.queryProductBtn();
      },
      //商品、赠品列表渲染
      queryProductBtn(){
        if(this.paramData.adjustType==1){
          //商品列表
          this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsListByCondition',this.queryData).then((response)=>{
            if (response.data.success) {
              this.dialogAddProduct=true;
              response.data.result.rows.forEach((item,i)=>{
                item.isEdit=false;
                item.allowableAdjustQty=item.goodsMerchantInv?item.goodsMerchantInv.goodsSalesInv:0;
                item.adjustQty=0;
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
        }else{
          //赠品列表
          this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGiftsByCondition',this.queryData).then((response)=>{
            if (response.data.success) {
              this.dialogAddProduct=true;
              response.data.result.rows.forEach((item,i)=>{
                item.isEdit=false;
                item.allowableAdjustQty=item.goodsMerchantInv?item.goodsMerchantInv.giftSalesInv:0;
                item.adjustQty=0;
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
        }
      },
      //添加商品、赠品
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
        this.queryData.size=this.totalPage;
        this.queryProductBtn();
      },
      //添加商品保存
      saveAddProduct(logo){
        if(this.selectionData.length==0){
          this.$message({
            message: '请选择要添加的商品！',
            type: 'warning'
          });
          return false;
        }else{
          var mapArr=new Map(),isPass=false;
          this.paramData.listBean.forEach((item,i)=>{
            mapArr.set(item.goodsId,item);
          })
          this.selectionData.forEach((item,i)=>{
            item.adjustQty=0;
            if(this.paramData.adjustType==1){
              item.allowableAdjustQty=item.goodsMerchantInv?item.goodsMerchantInv.goodsSalesInv:0;
            }else{
              item.allowableAdjustQty=item.goodsMerchantInv?item.goodsMerchantInv.giftSalesInv:0;
            }
            if(!mapArr.get(item.goodsId)){
              this.paramData.listBean.push(item);
              isPass=true;
            }
          })
          console.log(this.paramData.listBean);
          if(!isPass){
            this.$message({
              message: '此商品已添加，请勿重复添加',
              type: 'warning'
            });
          }
          if(logo!='going'){
            this.dialogAddProduct=false;
          }
        }
      },
      //table列表删除
      tableDel(index,row){
        this.paramData.listBean.splice(index,1);
      },
      //策略调整保存
      adjustSave(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.paramData.listBean.length<1){
              this.$message({
                message: '请添加调整'+this.giftName,
                type: 'warning'
              });
              return false;
            }
            var isPass=true,isPass1 = true;
            this.paramData.listBean.forEach((item,i)=>{
              if(item.adjustQty*1>item.allowableAdjustQty*1){
                isPass=false;
                item.isEdit = true;
              }
              if(item.adjustQty == '' || item.adjustQty*1 <= 0){
                isPass1=false;
                item.isEdit = true;
              }
            })
            if(!isPass1){
              this.$message({
                message: '调整数量不能为空且必须为大于0的正整数！',
                type: 'warning'
              });
              return false;
            }
            if(!isPass){
              this.$message({
                message: '调整量不能超过现有量',
                type: 'warning'
              });
              return false;
            }
            this.paramData.wmGiftAdjustItemBeanList=JSON.stringify(this.paramData.listBean);
            if(this.type==1 && this.dogFlag){//新建 复制
              this.paramData.adjustId='';
              this.dogFlag=false;
              this._post('com.edb01.erp.wms.service.api.WmGiftAdjustService/'+this.version+'/insertGiftAdjust',this.paramData).then((response)=>{
                if(response.data.success){
                  setTimeout(()=>{
                    this.$message({
                      message: '保存成功',
                      type: 'success'
                    });
                  },300)
                  //this.$router.push({path: '/giftAdjust'});
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
              this._post('com.edb01.erp.wms.service.api.WmGiftAdjustService/'+this.version+'/updateGiftAdjust',this.paramData).then((response)=>{
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
            if(this.paramData.listBean.length<1){
              this.$message({
                message: '请添加调整'+this.giftName,
                type: 'warning'
              });
              return false;
            }
            this.paramData.wmGiftAdjustItemBeanList=JSON.stringify(this.paramData.listBean);
            this.paramData.adjustId=this.adjustId;
            if(type==1){
              this.paramData.auditStatus=2;
              this._post('com.edb01.erp.wms.service.api.WmGiftAdjustService/'+this.version+'/auditAdjust',this.paramData).then((response)=>{
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
              if(this.paramData.auditRemark && this.paramData.auditRemark != 'undefined'){
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
            this.paramData.auditStatus=3;
            this.paramData.auditRemark=this.rejectObj.auditRemark;
            this._post('com.edb01.erp.wms.service.api.WmGiftAdjustService/'+this.version+'/auditAdjust',this.paramData).then((response)=>{
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
        this.$emit('changeShow',{isRefresh:true});
      },
    },mounted(){
      /*判断 新建 查看 修改 审核 页面*/
      if(this.type==1){
        this.titleName='新建';
      }else if(this.type==2){
        this.titleName='查看';
        this.isDisabled=true;
      }else if(this.type==3){
        this.titleName='修改';
      }else if(this.type==4){
        this.titleName='审核';
        this.isDisabled=true;
      }
      var self=this;
      if(this.type!=1){
        echoFn()
      }
      //回显
      function echoFn(){
        self._post('com.edb01.erp.wms.service.api.WmGiftAdjustService/'+self.version+'/echoGiftAdjust',{adjustId:self.adjustId}).then((response)=>{
          if(response.data.success){
            self.paramData.adjustType=response.data.result.adjustType;
            self.paramData.adjustNote=response.data.result.adjustNote;
            response.data.result.listBean=response.data.result.wmGiftAdjustItemPOParamList?response.data.result.wmGiftAdjustItemPOParamList:[];
            response.data.result.listBean.forEach((item,i)=>{
              item.isEdit=false;
              if(self.paramData.adjustType==1){
                item.allowableAdjustQty=item.wmMerchantInvPOParam?(item.wmMerchantInvPOParam.goodsSalesInv-item.totalAdjustQty):'';
              }else{
                item.allowableAdjustQty=item.wmMerchantInvPOParam?(item.wmMerchantInvPOParam.giftSalesInv-item.totalAdjustQty):'';
              }
              item.goodsName=item.wmGoodsEchoBean?item.wmGoodsEchoBean.goodsName:'';
              item.barCode=item.wmGoodsEchoBean?item.wmGoodsEchoBean.barCode:'';
            })
            self.paramData.listBean=response.data.result.listBean;
            self.paramData.auditRemark=response.data.result.auditRemark;
            self.adjustType = self.paramData.adjustType;
          }else{
            self.$message({
              message: response.data.msg,
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

