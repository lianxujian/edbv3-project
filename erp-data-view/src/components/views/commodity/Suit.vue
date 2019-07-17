<!--套装 樊虎-->
<template>
  <div style='padding-left:20px;'>
    <div v-show="paramsObj.mainPageShow">
      <!--搜索查询区-->
      <div id="searchBox">
        <div class="leftBox2" style="margin-right:250px;">
          <el-row>
            <div style="display:inline-block;float:left;">
              <el-select size='small' style="width:100px !important;"
                         v-model="conditionData.querySelect"
                         placeholder="请选择">
                <el-option
                  v-for="item in participateShopArr"
                  :key="item.vlaue"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input size='small' v-model="conditionData.queryInput" style="width:160px;" @keyup.enter.native="queryBtn"></el-input>
            </div>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">品牌：</label>
                <multiple-select style="width:65%;"
                  :selectArr="brandIdArr"
                  :valueArr="conditionData.brandIds"
                  @multipleChange="multipleChange">
                </multiple-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">分类：</label>
                <el-cascader
                  style="width:65%;line-height: 28px;"
                  clearable filterable
                  v-model="conditionData.catalogId"
                  placeholder="请选择"
                  :options="catalogList"
                  :props="catalogIdProps"
                  :show-all-levels="false"
                ></el-cascader>
              </div>
            </el-col>
            <el-checkbox style="margin-left:15px;margin-top:3px;" v-model="isenable">显示停用商品</el-checkbox>
          </el-row>
        </div>
        <div class="rightBox2" style="width:250px;">
          <el-button type="primary" style="width:100px;border:#818d9a;float: right;" size="small" @click="queryBtn">查询</el-button>
        </div>
      </div>
      <!--按钮区域-->
      <div class="col-nav" style="margin:15px 0 20px 0;">
        <ul>
          <li @click="newPublishBtn" v-if="authorityCode.DATA_SUIT_ADD"><span>添加</span>
          </li>
          <li @click='copyBtn' v-if="authorityCode.DATA_SUIT_ADD"><span>复制</span></li>
          <li @click="printBarcode" v-if="authorityCode.DATA_SUIT_PRINT"><span>打印商品条形码</span></li>
          <li @click="exportBtn"><span>导入</span>
          </li>
        </ul>
      </div>
      <!--表格区域-->
      <div class="col-border">
        <!--<el-table
          border
          :height="t_height"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align='center'
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            align='center'
            type="index"
            width="55">
          </el-table-column>
          <el-table-column
            align='center'
            label="状态"
            min-width=''
            width="">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enabledFlag" :disabled="!authorityCode.DATA_SUIT_STATUS" @change="switchBtn(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align='center'
            label="图片"
            min-width="">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsCode"
            align='center'
            min-width=''
            label="商品编码">
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
            prop="brandName"
            align='center'
            label="品牌"
            width="">
          </el-table-column>
          <el-table-column
            prop="catalogName"
            align='center'
            label="分类"
            width="">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align='center'
            label="创建时间"
            width="">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            align='center'
            label="修改时间"
            width="">
          </el-table-column>
          <el-table-column
            label="操作"
            align='center'
            width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleEdit(scope.$index, scope.row)" v-if="authorityCode.DATA_SUIT_EDIT">修改
              </el-button>
              <el-button
                type="text"
                @click="handleLook(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                v-if="!scope.row.enabledFlag && authorityCode.DATA_SUIT_DEL"
                type="text"
                style="color:red;"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>-->
        <ag-grid-vue :style='{"height":t_height+"px","width": "100%"}'
                     v-loading="agLoading"
                     element-loading-text="拼命加载中"
                     element-loading-spinner="el-icon-loading"
                     class="ag-theme-balham ag-table"
                     :gridOptions="gridOptions"
                     :columnDefs="columnDefs"
                     :rowData="tableData"
                     :components="components"
                     :gridReady="onGridReady">
        </ag-grid-vue>
      </div>
      <div class="col-pagination">
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
      <!--文件上传-->
      <el-dialog v-dialogDrag
        :close-on-click-modal="false"
        title="套装批量导入"
        :visible.sync="uploadFileDialog"
        width="600px"
        :before-close="handleClose"
        center>
        <div>
          <div>
            <p>套装批量导入规则:</p>
            <p> 1.请首先<a @click="downloadTemplet" style="text-decoration:underline;color:#409EFF;">下载套装导入模板</a>，下载模板后按照模板要求填写套装信息；</p>
            <p>2.只能导入新增的套装商品，不修改系统中已经存在的套装商品；</p>
            <div>
              <p>3.导入新增套装时：若系统中已经存在相同的的套装条形码，则导入失败；</p>
              <div style="margin-left:106px;">
                <p>若导入的品牌、分类在系统中不存在，则导入失败；</p>
                <p>若导入的套装单品在系统中不存在，则导入失败；</p>
                <p>若导入的套装条形码与套装中单品条形码重复，则导入失败；</p>
                <p>若导入的套装中的单品条形码多行重复，则导入失败；</p>
                <p>若导入的套装条形码重复，则导入失败；</p>
              </div>
            </div>
            <div>
              <p> 4.导入的文件格式必须与模板一致，其中：</p>
              <div style="margin-left:106px;margin-bottom:20px;">模板中的红色字体字段为必填项；</div>
            </div>
          </div>
          <el-row style="width: 650px">
            <el-col style="width: 400px">
              <div class="filePath">
                <el-input v-model="fileInput" style="width: 100px;background-color: #FFFFFF;" :disabled="true"
                          placeholder="文件路径"></el-input>
                <el-button @click="fileUpload">选择导入文件</el-button>
                <input type="file" style="display:none" ref="fileBtn" @change="fileSelect"></input>
              </div>
            </el-col>
          </el-row>
          <el-row style="width: 650px">
            <!--<div class="el-upload__tip">请上传.xls/.xlsx/.csv文件</div>-->
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
           <el-button @click="uploadFileDialog = false">取消</el-button>
           <el-button type="primary" @click="confirmImport">导入</el-button>
        </span>
      </el-dialog>
      <!--导入结果-->
      <el-dialog v-dialogDrag
        :close-on-click-modal="false"
        title="导入结果"
        :visible.sync="exportResult" width="400px">
        <div style="text-align:center;">
          导入成功{{successNum}}条，失败{{failNum}}条！
        </div>
        <div style="text-align:center;margin-top:30px;">
          <el-button type="primary" @click = 'exportResult=false'>确定</el-button>
          <el-button v-if="failNum!=0" type="primary" @click = 'exportErrBtn'>导出失败列表</el-button>
        </div>
      </el-dialog>
      <!--公共日志-->
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
    <suit-list v-if="!paramsObj.mainPageShow" :params="paramsObj" @changeShow="changeShow"></suit-list>
  </div>
</template>

<script>
  import {AgGridVue} from "ag-grid-vue";
  import {turnTimestamp,turnTimestamp4,gridOptions,returnTimesStamp,turnTimestamp3} from '@/assets/js/validate.js';
  import publicLog from '@/components/common/publicLog.vue';
  import SuitList from '@/components/views/commodity/children/SuitEdit.vue';
  export default {
    components: {
      'v-Publiclog': publicLog,
      SuitList,
      //ag-grid
      'ag-grid-vue': AgGridVue,
      RowFn:{
        template:'<span>{{params.node.rowIndex+1}}</span>'
      },
      statusComponent: {
        template: `<div>
          <el-switch v-model="params.data.enabledFlag" :disabled="!params.context.authorityCode.DATA_SUIT_STATUS" @change="switchBtn"></el-switch>
        </div>`,
        methods: {
          switchBtn(){
            this.params.context.switchBtn(this.params.data);
          }
        }
      },
      imageComponent: {
        template: `<div class="ag-image">
          <!--<el-tooltip placement="right" effect="light">
             <div slot="content"><img :src="params.data.imageUrl" alt=""></div>
             <img :src="params.data.imageUrl" alt="">
          </el-tooltip>-->
           <img :src="params.data.imageUrl" alt="">
        </div>`
      },
      operateComponent: {
        template: `<div>
          <div>
            <el-button type="text" v-if="params.context.authorityCode.DATA_SUIT_EDIT" @click="handleEdit">修改</el-button>
                <el-button type="text" @click="handleLook">查看</el-button>
                <el-button
                  v-if="!params.data.enabledFlag && params.context.authorityCode.DATA_SUIT_DEL"
                  type="text"
                  style="color:red;"
                  @click="handleDelete">删除
            </el-button>
          </div>
        </div>`,
        methods: {
          handleEdit(){
            this.params.context.handleEdit(this.params.data);
          },
          handleLook(){
            this.params.context.handleLook(this.params.data);
          },
          bindingPolicy(){
            this.params.context.bindingPolicy(this.params.data);
          },
          handleDelete(){
            this.params.context.handleDelete(this.params.data);
          }
        }
      },
    },
    data() {
      return {
        gridOptions:gridOptions(),
        components:{},
        agLoading:false,

        brandIdArr:[],//品牌下拉集合
        catalogList:[],//分类树
        catalogIdProps:{
          label: 'privilegeName',
          value:'catalogId',
          children: 'nodes'
        },

        imgUpload:process.env.FILE_API,//上传域名
        uploadFileDialog:false,//上传文件弹框
        fileInput:'',//文件input
        uploadFile:'',//文件file
        exportResult:false,//导入结果
        successNum:0,//成功数
        failNum:0,//失败数
        fileId:'',//文件id

        paramsObj:{
          mainPageShow:true,
        },//组件参数
        paramObj:{},//日志参数
        pulicLogVisible:false,//日志弹框
        t_height:0,
        version: '1.0.0',
        renderFn: () => {},
        totalNum: 0,
        totalPage: 15,
        currentPage: 1,
        tableData: [],//表格data
        conditionData:{
          querySelect:'barCode',
          queryInput:'',
          brandIds:[],
          catalogId:[""]
        },//查询区域参数
        paramData: {
          page: 1,
          size: 15,
          suitFlag:true,
          goodsCode:'',
          barCode:'',
          goodsName:'',
          enableFlag:true
        },//查询参数
        isenable:'',//起停用
        selectionData: [],//选中集合
        participateShopArr: [
          {
            label:'条形码',
            value:'barCode'
          },
          {
            label:'商品名称',
            value:'goodsName'
          },
          {
            label:'商品编号',
            value:'goodsCode'
          }
        ],//查询区域下拉集合
        clToken: sessionStorage.getItem('clToken') ? sessionStorage.getItem('clToken') : localStorage.getItem('clToken'),
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},
        classifyMatchArr:[],//分类下拉匹配
      }
    },
    beforeMount() {
      this.gridOptions.context = this;
      this.columnDefs = [
        {headerName: "序号",
          pinned: 'left',
          field: "row",
          width: 95,
          suppressToolPanel:true,
          suppressSorting: true,
          lockPosition: true,
          headerCheckboxSelection:true,
          checkboxSelection:true ,
          cellRendererFramework: 'RowFn',},
        {
          headerName: "状态",
          field: "enabledFlag",
          width: 120,
          cellRendererFramework: 'statusComponent',
        },
        {
          headerName: "图片",
          field: "consigneeMobile1",
          width: 150,
          cellRendererFramework: 'imageComponent',
        },
        {
          headerName: "商品编码",
          field: "goodsCode",
        },
        {
          headerName: "条形码",
          field: "barCode",
        },
        {
          headerName: "商品名称",
          field: "goodsName",
        },
        {
          headerName: "品牌",
          field: "brandName",
          width: 120
        },
        {
          headerName: "分类",
          field: "catalogName",
          width: 120
        },
        {
          headerName: "创建时间",
          field: "createTime",
          width: 150
        },
        {
          headerName: "修改时间",
          field: "updateTime",
          width: 150
        },
        {
          headerName: "操作",
          field: "consigneeMobile1",
          width: 190,
          cellRendererFramework: 'operateComponent',
        },
      ];
    },methods: {
      onGridReady(params) {
        this.gridOptions.context = this;
        this.gridOptions.onSelectionChanged = (event) => {
          this.selectionData = this.gridOptions.api.getSelectedRows();
        }
      },
      //上传文件弹框关闭
      handleClose(done) {
        done();
        this.uploadFile = '';
        this.$refs.fileBtn.value='';
      },
      //文件上传点击
      fileUpload() {
        this.$refs.fileBtn.click();
      },
      //文件选择函数
      fileSelect(e) {
        if (e.target.files[0].name.indexOf(".xls") > 0 || e.target.files[0].name.indexOf(".xlsx") > 0 || e.target.files[0].name.indexOf(".csv") > 0) {
          this.uploadFile = e.target.files[0];
          this.fileInput = e.target.files[0].name;
        } else {
          this.$message({
            message: '只支持excel文件上传(.xls、.xlsx、csv)',
            type: 'warning'
          });
        }
      },
      //判空
      isStrEmpty(obj) {
        if (typeof obj == 'undefined' || obj == null || obj == '') {
          return true;
        } else {
          return false;
        }
      },
      //导入excel
      confirmImport() {
        this.$refs.fileBtn.value='';
        var self = this;
        if (!this.isStrEmpty(this.uploadFile)) {
          //构造提交表单的数据
          // console.log(this.uploadFile.raw);
          //return false;
          let formData = new FormData();
          formData.append('filedata', this.uploadFile);
          this.$axios({
            method: 'post',
            url: `http://${process.env.FILE_API}/files-web/upload`,
            data: formData
          })
            .then((response) => {
              if (!this.isStrEmpty(response.data.resourcesId)) {
                var importParam = {fileId: response.data.resourcesId, fileName: self.uploadFile.name};
                //更新数据库
                self._post('com.edb01.erp.mdata.service.api.SuitService/' + self.version + '/batchImportSuit', importParam).then(response => {
                  if (response.data.success) {
                    this.exportResult = true;
                    this.failNum = response.data.result.failNum?response.data.result.failNum:0;
                    this.successNum = response.data.result.successNum?response.data.result.successNum:0;
                    this.fileId = response.data.result.fileId;
                    this.queryBtn();
                    setTimeout(()=>{
                      this.uploadFileDialog = false;
                    })
                  } else {
                    self.$message({
                      message: response.data.msg,
                      type: 'warning'
                    });
                  }
                }).catch(function (error) {
                  self.$message({
                    message: error,
                    type: 'warning'
                  });
                })


              } else {
                this.$message({
                  message: response.data.message,
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          this.$message({
            message: "请选择正确的文件",
            type: 'warning'
          });
        }
      },
      //导出失败列表
      exportErrBtn(){
        location.href = 'http://'+process.env.FILE_API+'/files-web/download/'+ this.fileId;
      },
      //下载模板
      downloadTemplet() {
        // 下载模板文件
        var fileId = '';
        if(process.env.FILE_API == 'www.edbv3.com'){
          fileId = '25034';
        }else if(process.env.FILE_API == 'www.edb02.net'){
          fileId = '17654';
        }else{
          fileId = '21960';
        }
        location.href = 'http://'+process.env.FILE_API+'/files-web/download/' + fileId;
      },
      //导入
      exportBtn() {
        this.uploadFileDialog = true;
        this.fileInput = '';
        this.$nextTick(() => {
          this.$refs.fileBtn.value='';
        })
      },
      //组件回传
      changeShow(param){
        this.selectionData = [];
        if(param && param.isRefresh){
          this.queryBtn();
        }
        this.paramsObj.mainPageShow = true;
      },
      //公共日志
      publicLogBtn(){
        this.paramObj.moduleId= '21';
        this.pulicLogVisible = true;
      },
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      //查询按钮
      queryBtn() {
        this.paramData.goodsName='';
        this.paramData.barCode='';
        this.paramData.goodsCode='';
        this.paramData.enableFlag = this.isenable == true ? '' :true;
        if(this.conditionData.querySelect){
          this.paramData[this.conditionData.querySelect]=this.conditionData.queryInput;
        }
        var conditionData = JSON.parse(JSON.stringify(this.conditionData));
        //分类
        if(this.conditionData.catalogId.length == 0){
          this.paramData.catalogId = '';
        }else{
          this.paramData.catalogId = this.conditionData.catalogId[this.conditionData.catalogId.length - 1];
        }
        //品牌
        if(this.conditionData.brandIds.length == this.brandIdArr.length){
          this.paramData.brandIds = '';
        }else{
          this.paramData.brandIds = this.conditionData.brandIds.join(',');
        }
        console.log(this.paramData);
        this.renderFn();
      },
      handleSizeChange(val) {
        this.paramData.size = val;
        this.totalPage = val;
        this.renderFn();
      },
      handleCurrentChange(val) {
        this.paramData.page = val;
        this.renderFn();
      },
      //刷新
      refresh() {
        this.queryBtn();
      },
      //多选框
      handleSelectionChange(val) {
        this.selectionData = val;
      },
      //打印条码
      printBarcode(){
        if(this.selectionData.length == 0){
          this.$message({
            message: '请选择要打印的商品！',
            type: 'warning'
          });
          return false;
        }
        let str = '';
        this.selectionData.forEach( (item,index) => {
          str += item.goodsId + ',';
        });
        let data = {
          ids:str.slice(0, -1),
          modelkey: 8,
          stype:'SVoucher',
          cltoken: localStorage.getItem('clToken')
        };
        $.ajax({
          type: "post",
          url: "http://127.0.0.1:8082/preview",
          data: data,
          success: function(data){
          }
        });
      },
      //switch开关
      switchBtn(row) {
        row.enabledFlag = !row.enabledFlag;
        if (row.enabledFlag) {
          this.$confirm('当前套装正在启用中，是否确定停用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            this._post( 'com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/deactivate',{
              goodsId: row.goodsId
            }).then((response)=>{
              if (response.data.success) {
                row.enabledFlag = !row.enabledFlag;
                this.renderFn();
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          }).catch(() => {
          });
        } else {
          this.$confirm('当前套装正在停用中，是否确定启用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/activate',{
              goodsId: row.goodsId
            }).then((response)=>{
              if (response.data.success) {
                row.enabledFlag = !row.enabledFlag;
                this.renderFn();
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          }).catch(() => {
          });
        }
      },
      //复制
      copyBtn() {
        if (this.selectionData.length == 0) {
          this.$message({
            message: '请选择要复制的商品！',
            type: 'warning'
          });
        }else if(this.selectionData.length>1){
          this.$message({
            message: '只允许复制单个商品！',
            type: 'warning'
          });
        } else {
          //this.$router.push({name: 'suitEdit', params: {skuId: this.selectionData[0].goodsId, type: 4}});
          this.paramsObj = {
            skuId:this.selectionData[0].goodsId,
            type:4,
            mainPageShow:false
          }
        }
      },
      //新建套装管理
      newPublishBtn() {
        //this.$router.push({name: 'suitEdit', params: {skuId: 'fanhu', type: 1}});
        this.paramsObj = {
          skuId:'fanhu',
          type:1,
          mainPageShow:false
        }
      },
      //修改
      handleEdit(row) {
        //判断是否可以更新套装
        this._post('com.edb01.erp.mdata.service.api.SuitService/'+this.version+'/getSuitLockState',{
          goodsId:row.goodsId,
          updateTime:turnTimestamp3(row.updateTime)
        }).then((response)=>{
          if(response.data.success){
            //套装未锁定继续操作
            this.paramsObj = {
              skuId:row.goodsId,
              type:3,
              mainPageShow:false
            }
          }else{
            if(response.data.msg == '套装已锁定'){
              //套装已锁定
              this.$message({
                message: '套装更新订单任务执行中，请稍后重试',
                type: 'warning'
              });
            }else{
              //套装已锁定
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }

          }
        })
      },
      //查看套装管理
      handleLook(row) {
        //this.$router.push({name: 'suitEdit', params: {skuId: row.goodsId,type:2}});
        this.paramsObj = {
          skuId:row.goodsId,
          type:2,
          mainPageShow:false
        }
      },
      //删除套装管理
      handleDelete(row) {
        this.$confirm('是否确定删除当前套装？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true
        }).then(() => {
          this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/delete',{
            goodsId:row.goodsId
          }).then((response)=>{
            if (response.data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.renderFn();
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {
        });
      },
      //多选下拉组件（品牌）
      multipleChange(value) {
        this.conditionData.brandIds = value;
      },
      //品牌下拉集合
      brandEcho(){
        return this._post('com.edb01.erp.mdata.service.api.BrandService/' + this.version + '/list');
      },
      //分类下拉集合
      catalogEcho(){
        return this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/list');
      },
      renderInit(){
        return this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/query',this.paramData);
      },
      catalogTree() {
        this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/listTree').then(response => {
          if (response.data.success) {
            response.data.result = response.data.result?response.data.result:[];
            response.data.result.unshift({
              privilegeName:'（无数据）',
              catalogId:'DongPing'
            })
            response.data.result.unshift({
              privilegeName:'全部',
              catalogId:''
            })
            this.catalogList = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
    },
    mounted() {
      //渲染表格高度
      this.$nextTick(function() {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      })
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      }
      //品牌
      this.brandEcho();
      //分类树
      this.catalogTree();
      //列表渲染
      this.renderFn = () => {
        this.paramData.size=this.totalPage;
        this.agLoading = true;
        this._post('com.edb01.erp.mdata.service.api.SuitService/' + this.version + '/query',this.paramData).then((response)=>{
          this.agLoading = false;
          if (response.data.success) {
            var mapArr1 = new Map(),mapArr2 = new Map();
            this.brandIdArr.forEach(item => {
              mapArr1.set(item.brandId,item);
            })
            this.classifyMatchArr.forEach(item => {
              mapArr2.set(item.catalogId,item);
            })
            this.tableData = response.data.result.rows;
            this.tableData.sort((a,b)=>{
              return b.createTime-a.createTime;
            })
            this.tableData.forEach((item, i) => {
              item.createTime = item.createTime ? turnTimestamp4(item.createTime) : '';
              item.updateTime = item.updateTime ? turnTimestamp4(item.updateTime) : '';
              if(item.goodsImageBean&&item.goodsImageBean.imageUrl){
                item.imageUrl=item.goodsImageBean.imageUrl;
              }
              if(mapArr1.get(item.brandId) && mapArr1.get(item.brandId).brandName){
                item.brandName = mapArr1.get(item.brandId).brandName;
              }else{
                item.brandName = '-';
              }
              if(mapArr2.get(item.catalogId)){
                item.catalogName = mapArr2.get(item.catalogId).catalogName;
              }else{
                item.catalogName = '-';
              }
            })
            this.selectionData = [];
            this.totalNum = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
      this.agLoading = true;
      this.$axios.all([this.brandEcho(), this.catalogEcho(),this.renderInit()])
        .then(this.$axios.spread((res1, res2, res3) => {
          this.agLoading = false;
          //品牌
          if(res1.data.success){
            res1.data.result = res1.data.result?res1.data.result:[];
            this.conditionData.brandIds = [];
            res1.data.result.forEach(item => {
              item.label = item.brandName;
              item.value = item.brandId;
              this.conditionData.brandIds.push(item.brandId)
            })
            res1.data.result.unshift({
              label:'（无数据）',
              value:'DongPing'
            })
            this.conditionData.brandIds.unshift('DongPing');
            this.brandIdArr = res1.data.result;
          }else{
            this.$message({
              message: res1.data.msg,
              type: 'warning'
            });
          }
          //分类
          if(res2.data.success){
            this.classifyMatchArr = res2.data.result;
          }else{
            this.$message({
              message: res2.data.msg,
              type: 'warning'
            });
          }
          //渲染列表
          if(res3.data.success){
            var mapArr1 = new Map(),mapArr2 = new Map();
            this.brandIdArr.forEach(item => {
              mapArr1.set(item.brandId,item);
            })
            this.classifyMatchArr.forEach(item => {
              mapArr2.set(item.catalogId,item);
            })
            this.tableData = res3.data.result.rows;
            this.tableData.sort((a,b)=>{
              return b.createTime-a.createTime;
            })
            this.tableData.forEach((item, i) => {
              item.createTime = item.createTime ? turnTimestamp4(item.createTime) : '';
              item.updateTime = item.updateTime ? turnTimestamp4(item.updateTime) : '';
              if(item.goodsImageBean&&item.goodsImageBean.imageUrl){
                item.imageUrl=item.goodsImageBean.imageUrl;
              }
              if(mapArr1.get(item.brandId) && mapArr1.get(item.brandId).brandName){
                item.brandName = mapArr1.get(item.brandId).brandName;
              }else{
                item.brandName = '-';
              }
              if(mapArr2.get(item.catalogId)){
                item.catalogName = mapArr2.get(item.catalogId).catalogName;
              }else{
                item.catalogName = '-';
              }
            })
            this.selectionData = [];
            this.totalNum = res3.data.result.total;
          }else{
            this.$message({
              message: res3.data.msg,
              type: 'warning'
            });
          }
          //console.log('两个请求都完成了')
        }));
    },
    created() {
      //回车事件
      document.onkeydown=(event)=>{
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){ // enter 键
          //要做的事情
          this.queryBtn();
        }
      };
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
  .input-box {
    margin: 20px 0 0px 0;
    display: inline-block;
    width: 100%;
  }

  .el-input {
    width: 60% !important;
  }

  .release-nav {
    background: #F7F7F7;
    width: 100%;
    height: 38px;
    margin: 15px 0;
    border: 1px solid #DFDFDF;
  }

  .release-nav ul li {
    float: left;
    height: 26px;
    margin-top: 6px;
    line-height: 26px;
    padding: 0 15px;
    color: #8A8A8A;
    cursor: pointer;
  }

  .template-div {
    margin-bottom: 20px;
  }

  .template-div span {
    display: inline-block;
    width: 80px;
    text-align: right;
  }

  .input-box label {
    width: 70px;
    display: inline-block;
    text-align: right;
    margin-right: 1px;
  }
</style>
<style>
  .el-dialog__footer {
    text-align: center;
  }
</style>


