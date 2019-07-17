<!--商品列表 樊虎-->
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
                                 :selectArr="brandListOptions"
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
          <li @click="newPublishBtn" v-if="authorityCode.DATA_GIFTLIST_ADD"><span>添加</span></li>
          <li @click='importBtn' v-if="authorityCode.DATA_GIFTLIST_ADD"><span>导入</span></li>
          <li @click='copyBtn' v-if="authorityCode.DATA_GIFTLIST_ADD"><span>复制</span></li>
          <li @click='batchUpdate' v-if="authorityCode.DATA_GIFTLIST_EDIT"><span>批量修改</span></li>
          <li @click="printBarcode" v-if="authorityCode.DATA_GIFTLIST_PRINT"><span>打印商品条形码</span></li>
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
              <el-switch v-model="scope.row.enabledFlag" :disabled="!authorityCode.DATA_GIFTLIST_STATUS" @change="switchBtn(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            align='center'
            label="图片"
            min-width="">
            <template slot-scope="scope">
              <el-tooltip placement="right">
                <img :src="scope.row.imageUrl" alt="">
              </el-tooltip>
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
            :show-overflow-tooltip="true"
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
            width="140">
          </el-table-column>
          <el-table-column
            prop="updateTime"
            align='center'
            label="修改时间"
            width="140">
          </el-table-column>
          <el-table-column
            label="操作"
            align='center'
            width="190">
            <template slot-scope="scope">
              <el-button type="text" v-if="authorityCode.DATA_GIFTLIST_EDIT" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button type="text" @click="handleLook(scope.$index, scope.row)">查看</el-button>
              <el-button type="text" v-if="authorityCode.DATA_GIFTLIST_BINDING" @click="bindingPolicy(scope.$index, scope.row)">绑定策略</el-button>
              &lt;!&ndash;<el-button
                v-if="scope.row.enabledFlag"
                type="text"
                :disabled="scope.row.enabledFlag">删除
              </el-button>&ndash;&gt;
              <el-button
                v-if="!scope.row.enabledFlag"
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
        title="导入"
        :visible.sync="uploadFileDialog"
        width="600px"
        :before-close="handleClose"
        center>
        <div>
          <el-row style="width: 650px">
            <el-col style="width: 400px">
              <div class="filePath">
                <el-input v-model="fileInput" style="width: 100px;background-color: #FFFFFF;" :disabled="true"
                          placeholder="文件路径"></el-input>
                <el-button style="width:100px!important;" @click="fileUpload">浏览</el-button>
                <input type="file" style="display:none" ref="fileBtn" @change="fileSelect"></input>
              </div>
            </el-col>
            <el-col style="width: 100px;">
              <div class="grid-content bg-purple-dark" style="width: 100px;">
                <el-button slot="trigger" style="width:115px !important;" size="small"
                           @click.native.prevent="downloadTemplet">下载导入模板
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-row style="width: 650px">
            <div class="el-upload__tip">请上传.xls/.xlsx/.csv文件</div>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmImport">确定导入</el-button>
      </span>
      </el-dialog>
      <!--批量修改-->
      <el-dialog v-dialogDrag
        :close-on-click-modal="false"
        title="批量修改单品"
        :visible.sync="batchModificationDialogVisible"
        width="550px">
        <div>
          <el-form :model="pageCurrentObj" ref="batchUpdateForm" :rules="formRules">
            <el-form-item label-width="100px" label="品牌：">
              <el-select style="width: 210px" v-model="pageCurrentObj.brandId" placeholder="请选择">
                <el-option
                  v-for="item in brandListOptions"
                  :key="item.brandId"
                  :label="item.brandName"
                  :value="item.brandId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类：" label-width="100px">
              <el-button @click.native.prevent="chooseClassify">{{chooseClassifyBtn}}</el-button>
            </el-form-item>
            <el-form-item label="售价：" label-width="100px" prop="salesPrice">
              <el-input v-model="pageCurrentObj.salesPrice" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="净重：" label-width="100px" prop="suttle">
              <el-input v-model="pageCurrentObj.suttle" style="width: 210px"></el-input>
            </el-form-item>
            <el-form-item label-width="100px" label="发货仓方案：">
              <el-select v-model="pageCurrentObj.sendStorageId" style="width: 210px" placeholder="请选择">
                <el-option
                  v-for="item in queryDocStoreplanOptions"
                  :key="item.assignStorageId"
                  :label="item.schemeName"
                  :value="item.assignStorageId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="batchModificationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBatchModificationDialogVisible('batchUpdateForm')">确 定</el-button>
      </span>
      </el-dialog>
      <!--选择分类-->
      <el-dialog v-dialogDrag
        title="分类"
        :close-on-click-modal="false"
        :visible.sync="classificationDialogVisible"
        width="400px"
        :before-close="handleClose">
        <div style="">
          <el-tree
            :data="bindTreeData"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="treeNodeClick"
          >
          </el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="classificationDialogVisible = false">取 消</el-button>
      </span>
      </el-dialog>
      <!--绑定策略-->
      <el-dialog v-dialogDrag
        title="绑定策略"
        :close-on-click-modal="false"
        :visible.sync="bindingPolicyDialog"
        :before-close="handleStrategyClose"
        width="800px">
        <div style="">
          <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="上架策略" name="first">
              <up-strategy type="1" :goodsId="goodsId"></up-strategy>
            </el-tab-pane>
            <el-tab-pane label="下架策略" name="second">
              <down-strategy type="2" :goodsId="goodsId"></down-strategy>
            </el-tab-pane>
          </el-tabs>
        </div>
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
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
    <goods-list v-if="!paramsObj.mainPageShow" :params="paramsObj" @changeShow="changeShow"></goods-list>
  </div>
</template>

<script>
  import {AgGridVue} from "ag-grid-vue";
  import {turnTimestamp,turnTimestamp4,gridOptions} from '@/assets/js/validate.js';
  import publicLog from '@/components/common/publicLog.vue';
  import UpStrategy from '@/components/views/commodity/children/UpStrategy.vue';
  import DownStrategy from '@/components/views/commodity/children/DownStrategy.vue';
  import GoodsList from '@/components/views/commodity/children/GoodsListEdit.vue';
  export default {
    components: {
      'v-Publiclog': publicLog,
      DownStrategy,//下架策略
      UpStrategy,//上架策略
      GoodsList,//添加修改查看
      //ag-grid
      'ag-grid-vue': AgGridVue,
      RowFn:{
        template:'<span>{{params.node.rowIndex+1}}</span>'
      },
      statusComponent: {
        template: `<div>
          <el-switch v-model="params.data.enabledFlag" :disabled="!params.context.authorityCode.DATA_GIFTLIST_STATUS" @change="switchBtn"></el-switch>
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
          <el-button type="text" v-if="params.context.authorityCode.DATA_GIFTLIST_EDIT" @click="handleEdit">修改</el-button>
              <el-button type="text" @click="handleLook">查看</el-button>
              <el-button type="text" v-if="params.context.authorityCode.DATA_GIFTLIST_BINDING" @click="bindingPolicy">绑定策略</el-button>
              <!--<el-button
                v-if="params.data.enabledFlag"
                type="text"
                :disabled="params.data.enabledFlag">删除
              </el-button>-->
              <el-button
                v-if="!params.data.enabledFlag && params.context.authorityCode.DATA_GIFTLIST_DEL"
                type="text"
                style="color:red;"
                @click="handleDelete">删除
          </el-button>
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
        catalogList:[],//分类树
        catalogIdProps:{
          label: 'privilegeName',
          value:'catalogId',
          children: 'nodes'
        },
        paramsObj:{
          mainPageShow:true,
        },//组件传值参数
        exportResult:false,//导入结果
        successNum:0,//成功数
        failNum:0,//失败数
        fileId:'',//文件id
        formRules: {
          salesPrice: [{required: false, message: '支持2位小数浮点数', trigger: 'blur'},
            {
              validator: function (rule, value, callback) {
                if (typeof value == 'undefined' || value == null || value == '') {
                  callback();
                } else {
                  var num = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
                  if (num.test(value) == false) {
                    callback(new Error("支持2位小数浮点数"));
                  } else {
                    callback();
                  }
                }

              }, trigger: 'blur'
            },
          ],
          suttle: [{required: false, message: '支持4位小数浮点数', trigger: 'blur'},
            {
              validator: function (rule, value, callback) {
                if (typeof value == 'undefined' || value == null || value == '') {
                  callback();
                } else {
                  var num = /(^[1-9]\d*(\.\d{1,4})?$)|(^0(\.\d{1,4})?$)/;
                  if (num.test(value) == false) {
                    callback(new Error("支持4位小数浮点数"));
                  } else {
                    callback();
                  }
                }
              }, trigger: 'blur'
            }
          ]
        },//表单校验规则
        tableTransitionData:[],//表格data
        pageCurrentObj: {
          brandId:'',
          sendStorageId:''
        },//批量修改参数
        goodsId:'',//商品id
        chooseClassifyBtn: '选择分类',//分类按钮
        brandListOptions:[],//品牌分类
        batchModificationDialogVisible:false,//批量修改弹框
        classificationDialogVisible:false,//分类弹框
        queryDocStoreplanOptions:[],//发货仓方案集合
        bindTreeData:[],//分类树
        defaultProps: {
          children: 'nodes',
          label: 'privilegeName'
        },
        uploadFileDialog: false,//文件上传弹框
        fileInput: '',//文件上传输入框回显
        uploadFile: '',//文件
        paramObj: {},
        pulicLogVisible: false,
        t_height: 0,
        version: '1.0.0',
        renderFn: () => {},
        totalNum: 0,
        totalPage: 15,
        currentPage: 1,
        tableData: [],//表格数据
        conditionData: {
          querySelect: 'barCode',
          queryInput: '',
          brandIds:[],
          catalogId:[""]
        },//查询条件
        paramData: {
          page: 1,
          size: 15,
          suitFlag: true,
          goodsCode: '',
          barCode: '',
          goodsName: '',
          enableFlag: true
        },//查询条件参数
        isenable: '',//是否停用
        selectionData: [],//选中集合
        participateShopArr: [
          {
            label: '条形码',
            value: 'barCode'
          },
          {
            label: '商品名称',
            value: 'goodsName'
          },
          {
            label: '商品编号',
            value: 'goodsCode'
          }
        ],//查询条件集合
        clToken: sessionStorage.getItem('clToken') ? sessionStorage.getItem('clToken') : localStorage.getItem('clToken'),
        bindingPolicyDialog:false,//绑定策略弹框
        activeName:'first',//绑定策略tab
        commitClassifyList:[],//商品分类集合
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{}//权限code
      }
    },
    beforeMount() {
      this.gridOptions.context = this;
      this.createColumnDefs();
    },
    methods: {
      onGridReady(params) {
        this.gridOptions.context = this;
        this.gridOptions.onSelectionChanged = (event) => {
          this.selectionData = this.gridOptions.api.getSelectedRows();
        }
        this.gridOptions.onSortChanged = (event) => {
          var tableData = [];
          this.gridOptions.api.forEachNode((node,index)=>{
            tableData.push(node.data)
          })
          //this.tableData = tableData;
        }
      },
      createColumnDefs() {
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
      },
      //组件回传
      changeShow(param){
        this.selectionData = [];
        if(param && param.isRefresh){
          this.renderFn();
        }
        this.paramsObj.mainPageShow = true;
      },
      //下载
      exportErrBtn(){
        location.href = 'http://'+process.env.FILE_API+'/files-web/download/'+ this.fileId;
      },
      //绑定策略弹框关闭
      handleStrategyClose(done){
        done();
        this.goodsId='';
      },
      //绑定策略弹框
      bindingPolicy(row){
        this.bindingPolicyDialog=true;
        this.goodsId=row.goodsId;
        this.activeName='first';
      },
      //导入弹出框
      importBtn() {
        this.uploadFileDialog = true;
        this.fileInput = '';
      },
      //下载模板
      downloadTemplet() {
        // 下载模板文件
        // 下载模板文件
        var fileId = '';
        if(process.env.FILE_API == 'www.edbv3.com'){
          fileId = '3910';
        }else if(process.env.FILE_API == 'www.edb02.net'){
          fileId = '17755';
        }else{
          fileId = '21237';
        }
        location.href = 'http://'+process.env.FILE_API+'/files-web/download/' + fileId;
      },
      //上传关闭
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
      //校验是否为空
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
                this.$message({
                  message: '上传成功，后台正在更新中！',
                  type: 'success'
                });

                var importParam = {fileId: response.data.resourcesId, fileName: self.uploadFile.name};
                //更新数据库
                self._post('com.edb01.erp.mdata.service.api.GoodsService/' + self.version + '/batchImport', importParam).then(response => {
                  if (response.data.success) {
                    this.exportResult = true;
                    this.failNum = response.data.result.failNum?response.data.result.failNum:0;
                    this.successNum = response.data.result.successNum?response.data.result.successNum:0;
                    this.fileId = response.data.result.fileId;
                    this.renderInit();
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
      //选择分类
      chooseClassify(value) {
        var self = this;
        this.classificationDialogVisible = true;
        self._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + self.version + '/listTree').then(response => {
          if (response.data.success) {
            this.bindTreeData = response.data.result
          } else {
            self.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //树点击
      treeNodeClick(treeObj){
        if(treeObj.nodes && treeObj.nodes.length>0){
          this.$message({
            message: "不能选择父节点",
            type: 'warning'
          });
        }else{
          this.chooseClassifyBtn = treeObj.privilegeName;
          this.pageCurrentObj.catalogId=treeObj.catalogId;
          this.classificationDialogVisible=false;
        }
      },
      //批量修改
      batchUpdate() {
        var self = this;
        if (self.selectionData.length > 0) {
          self.batchModificationDialogVisible = true;
          //清空界面数据
          self.pageCurrentObj.brandId = "";
          self.chooseClassifyBtn = "选择分类";
          self.pageCurrentObj.salesPrice = "";
          self.pageCurrentObj.suttle = "";
          self.pageCurrentObj.sendStorageId = "";
          self.pageCurrentObj.catalogId='';
          var goodsIdList=[];
          for (var i=0;i<self.selectionData.length;i++){
            goodsIdList.push(self.selectionData[i].goodsId);
          }
          self.pageCurrentObj.goodsIdList=goodsIdList;
        } else {
          self.$message({
            message: '请选择数据',
            type: 'warning'
          });
        }
      },
      //批量修改保存
      confirmBatchModificationDialogVisible(batchUpdateForm){
        this.$refs[batchUpdateForm].validate((valid) => {
          if (valid) {
            var self=this;
           // 批量修改单品
            self._post( 'com.edb01.erp.mdata.service.api.GoodsService/' + self.version + '/batchEdit',self.pageCurrentObj).then(response =>{
              if (response.data.success){
                self.renderInit();
                self.batchModificationDialogVisible = false;
                self.$message({
                  message: "修改成功",
                  type: 'success'
                });
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
            console.log('error submit!');
            return false;
          }
        });
      },
      //日志弹框
      publicLogBtn() {
        this.paramObj.moduleId = 20;
        this.pulicLogVisible = true;
      },
      //弹框关闭
      changDialogShow() {
        this.pulicLogVisible = false;
      },
      //查询按钮
      queryBtn() {
        this.paramData.goodsName = '';
        this.paramData.barCode = '';
        this.paramData.goodsCode = '';
        this.paramData.enableFlag = this.isenable == true ? '' : true;
        if (this.conditionData.querySelect) {
          this.paramData[this.conditionData.querySelect] = this.conditionData.queryInput;
        }
        var conditionData = JSON.parse(JSON.stringify(this.conditionData));
        //分类
        if(this.conditionData.catalogId.length == 0){
          this.paramData.catalogId = '';
        }else{
          this.paramData.catalogId = this.conditionData.catalogId[this.conditionData.catalogId.length - 1];
        }
        //品牌
        if(this.conditionData.brandIds.length == this.brandListOptions.length){
          this.paramData.brandIds = '';
        }else{
          this.paramData.brandIds = this.conditionData.brandIds.join(',');
        }
        console.log(this.paramData);
        this.renderInit();
      },
      //重新刷新页面
      renderInit(){
        this.paramData.size = this.totalPage;
        this.agLoading = true;
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/query', this.paramData).then((response) => {
          this.agLoading = false;
          if (response.data.success) {
            this.tableData = response.data.result.rows;
            this.tableData.sort((a, b) => {
              return b.createTime - a.createTime;
            })
            this.tableData.forEach((item, i) => {
              item.createTime = item.createTime ? turnTimestamp4(item.createTime) : '';
              item.updateTime = item.updateTime ? turnTimestamp4(item.updateTime) : '';
              if (item.goodsImageBean && item.goodsImageBean.imageUrl) {
                item.imageUrl = item.goodsImageBean.imageUrl;
              }
            })
            var mapArr = new Map();
            this.commitClassifyList.forEach((item, i) => {
              mapArr.set(item.catalogId, item.catalogName);
            })
            this.tableData.forEach((item, i) => {
              if (mapArr.get(item.catalogId)) {
                item.catalogName = mapArr.get(item.catalogId);
              } else {
                item.catalogName = '-';
              }
            })

            var mapArr1 = new Map();
            this.brandListOptions.forEach((item, i) => {
              mapArr1.set(item.brandId, item.brandName);
            })
            this.tableData.forEach((item, i) => {
              if (mapArr1.get(item.brandId)) {
                item.brandName = mapArr1.get(item.brandId);
              } else {
                item.brandName = '-';
              }
            })

            this.totalNum = response.data.result.total;
            this.selectionData = [];
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      handleSizeChange(val) {
        this.paramData.size = val;
        this.totalPage = val;
        sessionStorage.setItem('hold_b_3_1', val);
        this.renderInit();
      },
      handleCurrentChange(val) {
        this.paramData.page = val;
        this.renderInit();
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
          this.$confirm('当前商品正在启用中，是否确定停用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/deactivate', {
              goodsId: row.goodsId
            }).then((response) => {
              if (response.data.success) {
                row.enabledFlag = !row.enabledFlag;
                this.renderInit();
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
          this.$confirm('当前商品正在停用中，是否确定启用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/activate', {
              goodsId: row.goodsId
            }).then((response) => {
              if (response.data.success) {
                this.renderInit();
                row.enabledFlag = !row.enabledFlag;
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
      //导入
      exportBtn() {
      },
      //复制
      copyBtn() {
        if (this.selectionData.length == 0) {
          this.$message({
            message: '请选择要复制的商品！',
            type: 'warning'
          });
        } else if (this.selectionData.length > 1) {
          this.$message({
            message: '只允许复制单个商品！',
            type: 'warning'
          });
        } else {
          //this.$router.push({name: 'goodsEdit', params: {skuId: this.selectionData[0].goodsId, type: 4}});
          this.paramsObj = {
            skuId:this.selectionData[0].goodsId,
            type:4,
            mainPageShow:false
          }
        }
      },
      //新建套装管理
      newPublishBtn() {
        //this.$router.push({name: 'goodsEdit', params: {skuId: 'fanhu', type: 1}});
        this.paramsObj = {
          skuId:'fanhu',
          type:1,
          mainPageShow:false
        }
      },
      //修改
      handleEdit(row) {
        //this.$router.push({name: 'goodsEdit', params: {skuId: row.goodsId, type: 3}});
        this.paramsObj = {
          skuId:row.goodsId,
          type:3,
          mainPageShow:false
        }
      },
      //查看套装管理
      handleLook(row) {
        //this.$router.push({name: 'goodsEdit', params: {skuId: row.goodsId, type: 2}});
        this.paramsObj = {
          skuId:row.goodsId,
          type:2,
          mainPageShow:false
        }
      },
      //删除套装管理
      handleDelete(row) {
        this.$confirm('是否确认删除当前产品数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/delete', {
            goodsId: row.goodsId
          }).then((response) => {
            if (response.data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.renderInit();
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
      //商品分类
      commitClassify() {
        this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/list').then((response) => {
          if (response.data.success) {
            const commitClassify = response.data.result;
            this.commitClassifyList = commitClassify;
            var mapArr = new Map();
            commitClassify.forEach((item, i) => {
              mapArr.set(item.catalogId, item.catalogName);
            })
            this.tableTransitionData.forEach((item, i) => {
              if (mapArr.get(item.catalogId)) {
                item.catalogName = mapArr.get(item.catalogId);
              } else {
                item.catalogName = '-';
              }
            })
            this.brand();
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //品牌分类
      brand() {
        this._post('com.edb01.erp.mdata.service.api.BrandService/' + this.version + '/list').then((response) => {
          if (response.data.success) {
            response.data.result = response.data.result?response.data.result:[];
            this.conditionData.brandIds = [];
            response.data.result.forEach(item => {
              item.label = item.brandName;
              item.value = item.brandId;
              this.conditionData.brandIds.push(item.brandId)
            })
           /* response.data.result.unshift({
              label:'（无数据）',
              value:'DongPing'
            })
            this.conditionData.brandIds.unshift('DongPing');*/
            this.brandListOptions=response.data.result;
            const brand = response.data.result;
            var mapArr = new Map();
            brand.forEach((item, i) => {
              mapArr.set(item.brandId, item.brandName);
            })
            this.tableTransitionData.forEach((item, i) => {
              if (mapArr.get(item.brandId)) {
                item.brandName = mapArr.get(item.brandId);
              } else {
                item.brandName = '-';
              }
            })
            this.tableData=this.tableTransitionData;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //发货仓方案
      conSignPlan() {
        this._post( 'com.edb01.erp.wms.service.api.WmInStorageService/' + this.version + '/echoWmAssignStorage').then(response =>{
          if (response.data.success){
            this.queryDocStoreplanOptions= response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //多选下拉组件（品牌）
      multipleChange(value) {
        this.conditionData.brandIds = value;
      },
      catalogTree() {
        this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/listTree').then(response => {
          if (response.data.success) {
            response.data.result = response.data.result?response.data.result:[];
            /*response.data.result.unshift({
              privilegeName:'（无数据）',
              catalogId:'DongPing'
            })*/
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
      //分类树
      this.catalogTree();
      //发货仓方案
      this.conSignPlan();
      //渲染表格高度
      this.$nextTick(function () {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      })
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      }
      //列表渲染
      this.renderFn = () => {
        this.paramData.size = this.totalPage;
        this.agLoading = true;
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/query', this.paramData).then((response) => {
          this.agLoading = false;
          if (response.data.success) {
            this.tableTransitionData = response.data.result.rows;
            this.tableTransitionData.sort((a, b) => {
              return b.createTime - a.createTime;
            })
            this.tableTransitionData.forEach((item, i) => {
              item.createTime = item.createTime ? turnTimestamp4(item.createTime) : '';
              item.updateTime = item.updateTime ? turnTimestamp4(item.updateTime) : '';
              if (item.goodsImageBean && item.goodsImageBean.imageUrl) {
                item.imageUrl = item.goodsImageBean.imageUrl;
              }
            })
            this.commitClassify();
            this.totalNum = response.data.result.total;
            this.selectionData = [];
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
      this.renderFn();
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

  .el-select {
    width: 30%;
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


