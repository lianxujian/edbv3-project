<template>
  <div style='padding-left:20px;height:100%;'>
    <div class="input-box">
      <el-row style="">
        <el-col :span="5">
          <div><label for="">商家编码：</label><el-input size='small' v-model="paramData.goodsCode" @keyup.enter.native="queryBtn"></el-input></div>
        </el-col>
        <el-col :span="5">
          <div><label for="">商品名称：</label><el-input size='small' v-model="paramData.goodsName" @keyup.enter.native="queryBtn"></el-input></div>
        </el-col>
        <el-col :span="5">
          <div>
            <label for="">来源：</label>
            <el-select size='small' clearable v-model="paramData.sourceType" placeholder="请选择">
              <el-option
                v-for="(item,i) in sourceTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="" style="margin-right:1px;">来源店铺：</label>
            <el-select size='small' filterable clearable v-model="paramData.sourceStore" placeholder="请选择">
              <el-option
                v-for="item in sourceStoreList"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeName">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4" style="">
          <el-button type="primary" size="small" @click='queryBtn'>查 询</el-button>
          <el-button size="small" @click='resetBtn' style="background:#E4E4E4;">重 置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px;">
        <el-col :span="5">
          <div class='s-date'>
            <label for="">发布状态：</label>
            <el-select size='small' clearable v-model="paramData.pubStatic" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="未发布" value="0"></el-option>
              <el-option label="已发布" value="1"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="" style='margin-right:-3px;'>发布时间：</label>
            <el-date-picker
              :editable="false"
              size='small'
              @change="channelChangeDate(1)"
              v-model="paramData.startTime"
              value-format="timestamp"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div class='s-date'>
            <label for="" style='margin-right:-3px;text-align:center;'>至</label>
            <el-date-picker
              @change="channelChangeDate(2)"
              :editable="false"
              size='small'
              v-model="paramData.endTime"
              type="date"
              value-format="timestamp"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div><label for="">备注：</label><el-input size='small' v-model="paramData.remark" @keyup.enter.native="queryBtn"></el-input></div>
        </el-col>
      </el-row>
    </div>
    <div class="release-nav">
      <ul>
        <li @click="releaseBtn">发布任务</li>
      </ul>
    </div>
    <div class="border">
      <el-table
        border
        id='fitTable'
        :height="table_h"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align='center'
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align='center'
          label="序号"
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
          prop="goodsCode"
          align='center'
          :show-overflow-tooltip='true'
          label="商家编码"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          align='left'
          :show-overflow-tooltip='true'
          min-width=''
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="salesPrice"
          label="售价（元）"
          :show-overflow-tooltip='true'
          min-width=''
          align='right'
          width="">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          :show-overflow-tooltip='true'
          width='250'
          align='left'>
        </el-table-column>
        <el-table-column
          prop="price"
          align='center'
          label="来源"
          width="100">
          <template slot-scope="scope">
            {{sourceTypeObj[scope.row.sourceType]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          align='center'
          label="来源店铺"
          width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.sourceType==2">{{scope.row.storeName}}</span>
            <span v-else>——</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="publishStore"
          align='left'
          label="已发布店铺"
          width="220">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.publishStore" placement="top-start">
              <p style="width:160px;display:inline-block;line-height: 12px;" class='ellipsis'>{{scope.row.publishStore}}</p>
            </el-tooltip>
            <el-button type="text" v-if="scope.row.publishStore" @click="queryRecord(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="publishTime"
          align='center'
          label="发布时间"
          width="">
        </el-table-column>
      </el-table>
    </div>
    <div style='float:right;margin-top:5px;'>
      <el-pagination
        style='float:left;'
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
      <i class='el-icon-refresh refresh' @click='refresh'></i>
    </div>
    <!-- 发布弹框 -->
    <el-dialog title="发布店铺" :close-on-click-modal="false" :visible.sync="isPublish" width="750px" v-loading="loading" element-loading-text="拼命加载中"
               element-loading-spinner="el-icon-loading">
      <div class="col-left" style="padding:0;">
        <p>选择要发布店铺：</p>
        <div>
          <label for=""><span>*</span>平台：</label>
          <el-select size='small' v-model="releaseObj.platFormType" placeholder="请选择" @change="platFormChange">
            <el-option label="天猫" value="1"></el-option>
            <el-option label="京东" value="2"></el-option>
            <el-option label="淘宝" value="3"></el-option>
            <el-option label="拼多多" value="4"></el-option>
          </el-select>
        </div>
        <div>
          <label for=""><span>*</span>店铺：</label>
          <el-select size='small' filterable v-model="releaseObj.storeId" placeholder="请选择" @change="shopChange">
            <el-option
              v-for="item in storeData"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId">
            </el-option>
          </el-select>
        </div>
        <div>
          <label for=""><span></span>店内分类：</label>
          <!--<el-select size='small' v-model="releaseObj.cid" placeholder="请选择">
            <el-option
              v-for="item in cidInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>-->
          <el-input class="container_search" :title="releaseObj.catelogoName" type="text" v-model="releaseObj.catelogoName" disabled size="small" style="width:180px !important;">
            <template slot="append">
              <div style="width:100%;height: 100%;" @click="addCatelog"><i class="el-icon-more"></i></div>
            </template>
          </el-input>
        </div>
        <div>
          <label for=""><span>*</span>运费模块：</label>
          <el-select size='small' v-model="releaseObj.freightTempId" placeholder="请选择">
            <el-option
              v-for="item in templateData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="rel-button">
          <el-button type="primary" size="small" @click="addShopBtn">确定选中</el-button>
        </div>
      </div>
      <div class="col-right" style="padding: 0 0 0 40px;">
        <p>已选择发布店铺：</p>
        <div class="shop-box"><!--:key="i"-->
          <div v-for="(item,i) in shopData"><!-- -->
            <el-tooltip class="item" effect="dark" :content="`店内分类：${item.catelogoName}；运费模块：${item.templateName}`" placement="top-start">
              <div style="display:inline-block;">{{channelObj[item.platFormType]}}：{{item.storeName}}</div>
            </el-tooltip>
            <span class="close" @click="delStore(i)">&times;</span>，
          </div>
        </div>
        <div class="rel-button">
          <el-button size="small"  @click="isPublish = false">取消</el-button>
          <el-button type="primary" size="small" @click='publishShop'>发布</el-button>
        </div>
      </div>
      <div style="clear:both;"></div>
    </el-dialog>
    <!-- 查看发布记录 -->
    <el-dialog title="查看发布记录" :close-on-click-modal="false" :visible.sync="releaseRecord" width="800px">
      <el-table
        border
        max-height="400"
        :data="recordTableData"
      >
        <el-table-column
          align='center'
          prop="platFormType"
          label="平台"
          width="">
        </el-table-column>
        <el-table-column
          align='center'
          label="店铺"
          prop="store_name"
          width="">
        </el-table-column>
        <el-table-column
          prop="publishTime"
          align='center'
          label="最后发布时间"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="publishStatus"
          align='center'
          min-width=''
          label="发布状态">
        </el-table-column>
      </el-table>
      <el-button type="primary" size="small" style="margin:20px 0 0 300px;width:100px;" @click="releaseRecord = false">确定</el-button>
    </el-dialog>
    <!-- 类目树弹框 -->
    <el-dialog title="请选择店内分类" :close-on-click-modal="false" :visible.sync="cateLogDialog" width="600px">
      <el-tree
        :data="cidInfo"
        show-checkbox
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <el-button type="primary" size="small" style="margin:20px 0 0 200px;width:100px;" @click="catelogSave">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { priceValidator,turnTimestamp } from '@/assets/js/validate';
  export default {
    data () {
      return {
        cidInfo:[],
        sourceStoreList:[],
        defaultProps: {
          children: 'childCatalogs',
          label: 'name'
        },
        cateLogDialog:false,
        catelogName:'',
        version:'1.0.0',
        sourceTypeObj:{
          '1':'录入',
          '2':'下载',
          '3':'导入'
        },
        sourceTypeList:[
          {
            label:'全部',
            value:''
          },
          {
            label:'录入',
            value:'1'
          },
          {
            label:'下载',
            value:'2'
          },
          {
            label:'导入',
            value:'3'
          },
        ],
        totalNum:0,
        totalPage:20,
        currentPage:1,
        tableData:[],
        paramData:{
          page:1,
          size:20,
          targetId:'',
          startTime:'',
          endTime:'',
          sourceType:'',
          pubStatic:'',
          sourceStore:'全部'
        },
        selectionData:[],
        materialType:[],
        table_h:0,
        releaseRecord:false,
        recordTableData:[],
        //重构发布店铺
        releaseObj:{
          storeId:'',
          freightTempId:'',
          cid:'',
          platFormType:''
        },
        templateData:[],
        shopData:[],
        storeData:[],
        cidInfo:[],
        isPublish:false,
        channelObj:{
          '1':'天猫',
          '2':'京东',
          '3':'淘宝'
        },
        loading:false,
      }
    },methods:{
      channelChangeDate(item){
        if(this.paramData.startTime && this.paramData.endTime && this.paramData.startTime > this.paramData.endTime){
          this.$message({
            message: '起始时间不能大于结束时间！',
            type: 'warning'
          });
          if(item == 1){
            this.paramData.startTime = '';
          }else{
            this.paramData.endTime = '';
          }
        }
      },
      channelPlat(){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/getMerchantList",{
          platformType:''
        }).then((response)=>{
          if (response.data.success) {
            response.data.result.unshift({
              storeName:'全部',
              storeId:'全部'
            })
            this.sourceStoreList = response.data.result;
            this.paramData.sourceStore = '全部';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      addCatelog(){
        if(this.releaseObj.storeId == ''){
          this.$message({
            message: '请选择店铺！',
            type: 'warning'
          });
          return false;
        }
        this.cateLogDialog = true;
        if(this.$refs.tree)this.$refs.tree.setCheckedKeys(this.releaseObj.cid.split(','));
      },
      catelogSave(){
        if(this.$refs.tree.getCheckedKeys(true).length == 0){
          this.$message({
            message: '请选择店内分类！',
            type: 'warning'
          });
          return false;
        }
        if(this.$refs.tree.getCheckedKeys(true).length > 10){
          this.$message({
            message: '店内分类最多可选择10个！',
            type: 'warning'
          });
          return false;
        }
        var catelogName = [];
        this.$refs.tree.getCheckedNodes(true).forEach((item,i)=>{
          catelogName.push(item.name);
        })
        this.releaseObj.catelogoName = catelogName.join('，');
        this.releaseObj.cid = this.$refs.tree.getCheckedKeys(true).join(',');
        this.cateLogDialog = false;
      },
      //发布弹出框
      releaseBtn(){
        if (this.selectionData.length == 0) {
          this.$message({
            message: '请选择要发布的数据！',
            type: 'warning'
          });
        } else {
          this.isPublish = true;
          this.shopData = [];
          this.storeData = [];
          this.templateData=[];
          this.cidInfo = [];
          this.releaseObj={
            storeId:'',
            freightTempId:'',
            cid:'',
            platFormType:'',
            catelogoName:''
          }
          /*this.$axios({
            method: 'post',
            url:'api/tmall/item/isProduct?tmallBookIds=' + str.slice(0, -1)
          })
            .then(function (response) {
              if (response.data.code == 0) {

              } else {
                self.$message({
                  message: '商品[' + response.data.message + ']未挂靠，请挂靠后重新尝试！',
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });*/
        }
      },
      //平台选择
      platFormChange(){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/getMerchantList",{
          platformType:this.releaseObj.platFormType
        }).then((response)=>{
          if (response.data.success) {
            this.storeData = response.data.result;
            this.releaseObj.storeId = '';
            this.releaseObj.freightTempId = '';
            this.releaseObj.cid = '';
            this.releaseObj.catelogoName = '';
            this.cidInfo = [];
            this.templateData = [];
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //渲染二级菜单
      shopChange(){
        let storeToken = '',nick = '';
        this.storeData.forEach(item =>{
          if(item.storeId == this.releaseObj.storeId){
            storeToken = item.storeToken;
            nick = item.nick;
          }
        })
        this.releaseObj.freightTempId = '';
        this.releaseObj.cid = '';
        this.releaseObj.catelogoName = '';
        this.cidInfo = [];
        this.templateData = [];
        //店内分类
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.PublishTaskCenterService/" + this.version+ "/getStoreCataLog",{
          storeToken,
          nick,
          platFormType:this.releaseObj.platFormType
        }).then((response)=>{
          if (response.data.success) {
            this.cidInfo = response.data.result;
            this.releaseObj.cid = '';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
        //运费模板
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.PublishTaskCenterService/" + this.version+ "/getStoreDelivTemp",{
          storeToken,
          nick,
          platFormType:this.releaseObj.platFormType
        }).then((response)=>{
          if (response.data.success) {
            this.templateData = response.data.result;
            this.releaseObj.freightTempId = '';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //确定选中
      addShopBtn(){
        if(this.releaseObj.platFormType==''){
          this.$message({
            message: '请选择平台！',
            type: 'warning'
          });
          return false;
        }else if(this.releaseObj.storeId==''){
          this.$message({
            message: '请选择店铺！',
            type: 'warning'
          });
          return false;
        }/*else if(this.releaseObj.cid==''){
          this.$message({
            message: '请选择店内分类！',
            type: 'warning'
          });
          return false;
        }*/else if(this.releaseObj.freightTempId==''){
          this.$message({
            message: '请选择运费模块',
            type: 'warning'
          });
          return false;
        }
        //平台
        this.storeData.forEach((item,i)=>{
          if(item.storeId==this.releaseObj.storeId){
            this.releaseObj.storeName=item.storeName;
          }
        })
        //模板
        this.templateData.forEach((item,i)=>{
          if(item.id==this.releaseObj.freightTempId){
            this.releaseObj.templateName=item.name;
          }
        })
        /*//店内分类
        this.cidInfo.forEach((item,i)=>{
          if(item.id == this.releaseObj.cid){
            this.releaseObj.catelogoName = item.name;
          }
        })*/
        //店铺
        var isPass=true;
        this.shopData.forEach((item,i)=>{
          if(item.storeId == this.releaseObj.storeId){
            isPass=false;
          }
        })
        if(isPass){
          this.shopData.push(JSON.parse(JSON.stringify(this.releaseObj)));
        }else{
          this.$message({
            message: '此店铺已选中，请先删除后再重新选择',
            type: 'warning'
          });
        }
      },
      //删除选中
      delStore(i){
        this.shopData.splice(i,1);
      },
      //发布
      publishShop() {
        if (this.shopData.length == 0) {
          this.$message({
            message: '请选择发布店铺',
            type: 'warning'
          });
          return false;
        }
        let tsGoodsIds = [];
        this.selectionData.forEach(item => {
          tsGoodsIds.push(item.tsGoodsId);
        })
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.publish.service.PublishTaskCenterService/" + this.version+ "/publishGoods",{
          tsGoodsIds:tsGoodsIds.join(','),
          publishInfoJson:JSON.stringify(this.shopData)
        }).then((response)=>{
          this.loading = false;
          if (response.data.success) {
            this.$message({
              message:response.data.msg,
              type: "success"
            });
            this.isPublish = false;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },

      queryRecord(row){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/queryPublishGoodsDetail",{
          goodsId:row.tsGoodsId
        }).then((response)=>{
          if (response.data.success) {
            this.releaseRecord = true;
            this.recordTableData = response.data.result;
            this.recordTableData.forEach((item,i)=>{
              if(item.publishTime)item.publishTime = turnTimestamp(item.publishTime);
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      queryBtn(item){
        this.initRenderTable(item);
      },
      //重置
      resetBtn(){
        this.paramData = {
          goodsName:'',
          goodsCode:'',
          sourceType:'',
          pubStatic:'',
          startTime:'',
          endTime:'',
          sourceStore:'全部'
        }
      },
      handleSizeChange(val){
        this.totalPage = val;
        this.initRenderTable();
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.initRenderTable();
      },
      refresh(){
        this.initRenderTable();
      },
      //多选框
      handleSelectionChange(val){
        this.selectionData=val;
      },
      //编辑
      handleEdit(){
        this.dialogShow=true;
      },
      //删除单条
      handleDelete(){
        this.$confirm('确认要删除本条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {

        }).catch(() => {});
      },
      //删除多条
      delBtn(){
        if(this.selectionData.length==0){
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        }else{
          this.$confirm('确认要删除这些数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {

          }).catch(() => {});
        }
      },
      renderTableHeight() {
        this.$nextTick(function () {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        });
        window.onresize = () => {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        }
      },
      initRenderTable(item){
        this.currentPage = item?1:this.currentPage;
        this.paramData.page=this.currentPage;
        this.paramData.size=this.totalPage;
        this.paramData.startTime = this.paramData.startTime?this.paramData.startTime:'';
        this.paramData.endTime = this.paramData.endTime?this.paramData.endTime:'';
        var param = JSON.parse(JSON.stringify(this.paramData));
        param.sourceStore = this.paramData.sourceStore == '全部'?'':this.paramData.sourceStore;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/queryPublishGoods",param).then((response)=>{
          if (response.data.success) {
            this.tableData = response.data.result.rows;
            this.totalNum = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      }
    },
    mounted(){
      //渲染表格高度
      this.renderTableHeight();
      this.initRenderTable();
      this.channelPlat();
      //console.log(this.api);
    },
    created(){

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-input{
    width:60% !important;
  }
</style>
