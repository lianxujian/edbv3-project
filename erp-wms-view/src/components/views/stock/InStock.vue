<!--入库单管理 秋香-->
<template>
  <div id="InStock">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>仓库：</label>
              <el-select id="searchStock" filterable placeholder="全部" @keyup.enter.native="search" v-model="storageId">
                <el-option
                  v-for="item in optionsStock"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>单据状态：</label>
              <el-select id="searchStock3" filterable placeholder="全部" @keyup.enter.native="search" v-model="status">
                <el-option
                  v-for="item in statusNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>入库类型：</label>
              <el-select id="searchStock1" filterable placeholder="全部" @keyup.enter.native="search"
                         v-model="stockInType">
                <el-option
                  v-for="item in stockInTypeNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>供应商：</label>
              <el-select id="searchStock2" filterable placeholder="全部" @keyup.enter.native="search"
                         v-model="supplierId">
                <el-option
                  v-for="item in supplier"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14.5">
            <div class="grid-content">
              <el-select style="width: 110px!important;" v-model="timeType" @keyup.enter.native="search" filterable
                         placeholder="创建时间">
                <el-option
                  v-for="item in timeTypeNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

              <dataTime
                style="display: inline-block"
                :timeCom1="startTime"
                :timeCom2="endTime"
                @timeVal1="getTime1"
                @timeVal2="getTime2"
              ></dataTime>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              <el-select style="width: 110px!important;" filterable placeholder="入库单号" @keyup.enter.native="search"
                         v-model="serachType">
                <el-option
                  v-for="item in serachTypeNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input style="width: 192px!important;" placeholder="" v-model="serachStr" :maxlength="50"
                        @keyup.enter.native="search"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox1">
        <el-button size="mini" type="primary" @click="search()">查 询</el-button>
      </div>
    </div>
    <!-- 表头 -->
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="addDatas()" v-if="authorityCode.WMS_INSTOCK_ADD"><span>+添加</span></li>
        <li @click="importTemplate()" v-if="authorityCode.WMS_INSTOCK_ADD"><span>导入</span></li>
        <li @click="merge()" v-if="authorityCode.WMS_INSTOCK_MERGE"><span>合并</span></li>
        <li @click="affirmInStock()" v-if="authorityCode.WMS_INSTOCK_AFFIRMINSTOCK"><span>入库确认</span></li>
        <li @click="cancelled()" v-if="authorityCode.WMS_INSTOCK_CANCELLATIONESD"><span>作废</span></li>
        <li @click="derive()" v-if="authorityCode.WMS_INSTOCK_EXPORTDATA"><span>导出</span></li>
        <li @click="print()" v-if="authorityCode.WMS_INSTOCK_PRINT"><span>打印</span></li>
        <li @click="saveTableSet"><span>保存表格设置</span></li>
      </ul>
    </div>
    <ag-grid-vue :style='{"height":agHeight+"px","width": "100%"}'
                 class="ag-theme-balham ag-table"
                 :gridOptions="gridOptions"
                 :columnDefs="columnDefs"
                 :rowData="tableData"

                 rowSelection="multiple"
                 :enableFilter="true"
                 :enableSorting="true"
                 :enableColResize="true"
                 :components="components"
                 :gridReady="onGridReady"
    >
    </ag-grid-vue>

    <div class="pagination">
      <pagination
        :totalCom="total"
        :pageSizeCom="pageSize"
        :curPageCom="curPage"
        @pageSizeVal="getPageSize" @curPageVal="getCurPage"
      ></pagination>
    </div>
    <!--导入-->
    <el-dialog v-dialogDrag
               title="导入"
               :visible.sync="visibleLead"
               width="800px"
               :before-close="handleClose">
      <div>
        <ul class="leadUl" type="disc">
          <li>1.务必按照模板格式导入，点击 <span class="liSpan" @click="downLoad">下载入库单模板</span></li>
          <li>2.列名称分别为：条形码，入库数量，商品属性，生产日期，批次号。</li>
          <li>3.采购入库或其他入库时：</li>
          <li style="list-style-type : disc;margin-left: 50px;"><span style="color: #FF0000;margin-left: -20px">商品属性均默认未知；</span>
          </li>
          <li style="list-style-type : disc;margin-left: 50px;"><span style="color: #FF0000;margin-left: -20px">生产日期非必填，为空时，生产日期默认带入当天日期；</span>
          </li>
          <li style="list-style-type : disc;margin-left: 50px;"><span style="color: #FF0000;margin-left: -20px">批次号非必填，为空时，按照商品档案中的批次号生成规则自动生成。</span>
          </li>
          <li>4.调拨入库时：</li>
          <li style="list-style-type : disc;margin-left: 50px;"><span
            style="color: #FF0000;margin-left: -20px">商品属性必填；</span></li>
          <li style="list-style-type : disc;margin-left: 50px;"><span style="color: #FF0000;margin-left: -20px">批次号非必填，为空时，按照批次号最小或近效期规则带入。</span>
          </li>
          <li>5.导入文件后，若有商品不符合导入条件，则导入失败，可手动下载失败文件查看失败原因。</li>
          <li>6.文件导入成功后，自动创建入库单。</li>
          <el-form label-width="120px" class="demo-ruleForm" :model="addData" :rules="rules" ref="addData">
            <el-form-item label="上传文件：" prop="fileName">
              <el-input placeholder="文件路径" disabled style="width:198px" v-model="addData.fileName"></el-input>
              <el-button @click="fileUpload">选择文件</el-button>
              <input type="file" ref="fileBtn" style="display: none" @change="fileSelect"/>
            </el-form-item>
            <el-form-item label="入库类型：" prop="stockInType">
              <el-select id="StockOutType1" v-model="addData.stockInType" filterable placeholder="请选择入库类型"
                         style="width: 201px!important;">
                <el-option
                  v-for="item in StockOutTypeEnum2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库：" prop="storageId">
              <el-select v-model="addData.storageId" filterable placeholder="请选择仓库" style="width: 201px!important;">
                <el-option
                  v-for="item in optionsStock1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商：">
              <el-select id="supplierId1" filterable v-model="addData.supplierId" placeholder="请选择供应商"
                         @change="isShowOne"
                         style="width: 201px!important;">
                <el-option
                  v-for="item in supplier"
                  :key="item.supplierId"
                  :label="item.supplierName"
                  :value="item.supplierId">
                </el-option>
              </el-select>
              <span style="color:#248000"> 注：采购入库或其它入库时必填</span>
            </el-form-item>
            <span class="dog" v-if="isShowSupper"> 请选择供应商！</span>
            <el-form-item label="入库备注：" prop="remark">
              <el-input type="textarea" placeholder="请输入入库备注" v-model="addData.remark" style="width: 78%"
                        :maxlength="200"></el-input>
            </el-form-item>

            <el-form-item style="width:100%;text-align: right">
              <el-button type="primary" :disabled="isDisable" @click="makeImport('addData')">确定导入</el-button>
            </el-form-item>
          </el-form>
        </ul>
      </div>
    </el-dialog>
    <!--导入-->
    <el-dialog v-dialogDrag
               title="导入"
               :visible.sync="visibleLeadOne"
               width="800px"
               :before-close="handleClose">
      <div>
        <ul class="leadUl" type="disc">
          <li>1.务必按照模板格式导入，点击 <span class="liSpan" @click="downLoad">下载入库单模板</span></li>
          <li>2.列名称分别为条形码，入库数量和商品属性。</li>
          <li>3.导入文件后，若有商品不符合导入条件，则导入失败，可手动下载失败文件查看失败原因。</li>
          <li>4.文件导入成功后，自动创建入库单。</li>
          <el-form label-width="120px" class="demo-ruleForm" :model="addData" :rules="rules" ref="addData">
            <el-form-item label="上传文件：" prop="fileName">
              <el-input placeholder="文件路径" disabled style="width:198px" v-model="addData.fileName"></el-input>
              <el-button @click="fileUpload">选择文件</el-button>
              <input type="file" ref="fileBtn" style="display: none" @change="fileSelect"/>
            </el-form-item>
            <el-form-item label="入库类型：" prop="stockInType">
              <el-select id="StockOutType" v-model="addData.stockInType" filterable placeholder="请选择入库类型"
                         style="width: 201px!important;">
                <el-option
                  v-for="item in StockOutTypeEnum2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库：" prop="storageId">
              <el-select v-model="addData.storageId" filterable placeholder="请选择仓库" style="width: 201px!important;">
                <el-option
                  v-for="item in optionsStock1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商：">
              <el-select id="supplierId" filterable v-model="addData.supplierId" placeholder="请选择供应商"
                         @change="isShowOne"
                         style="width: 201px!important;">
                <el-option
                  v-for="item in supplier"
                  :key="item.supplierId"
                  :label="item.supplierName"
                  :value="item.supplierId">
                </el-option>
              </el-select>
              <span style="color:#248000"> 注：采购入库或其它入库时必填</span>
            </el-form-item>
            <span class="dog" v-if="isShowSupper"> 请选择供应商！</span>
            <el-form-item label="入库备注：" prop="remark">
              <el-input type="textarea" placeholder="请输入入库备注" v-model="addData.remark" style="width: 78%"
                        :maxlength="200"></el-input>
            </el-form-item>
            <el-form-item style="width:100%;text-align: right">
              <el-button type="primary" :disabled="isDisable" @click="makeImport('addData')">确定导入</el-button>
            </el-form-item>
          </el-form>
        </ul>
      </div>
    </el-dialog>
    <!--入库质检-->
    <div>
      <el-dialog v-dialogDrag
                 title="入库质检"
                 :visible.sync="inspectionOne"
                 :close-on-click-modal="false"
                 width="1200px"
                 tooltip-effect="dark"
                 center>
        <div v-loading="loading">
          <div class="sty">
            <label for="searchStock">条形码：</label>
            <el-input style="width: 192px!important;" placeholder="" v-model="barCode" @keyup.enter.native="searchOne()"
                      :maxlength="50"></el-input>
          </div>
          <div class="rightBox1" style="margin-top: 80px;margin-right: 40px">
            <el-button size="mini" type="primary" @click="searchOne()">查 询</el-button>
          </div>
          <div class="" style="margin-top: 20px">
            <el-table :data="tableDataShop"
                      height="500"
                      border>
              <el-table-column
                label="序号"
                align="center"
                type="index"
              >
              </el-table-column>
              <el-table-column label="商品图片">
                <template slot-scope="scope">
                  <img :src="scope.row.imageUrl" alt="">
                </template>
              </el-table-column>
              <el-table-column label="条形码" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.barCode }}</p>
                </template>
              </el-table-column>
              <el-table-column label="商品属性">
                <template slot-scope="scope">
                  <p class="cen-g" v-if="scope.row.goodsAttrType==1">正品</p>
                  <p class="cen-g" v-if="scope.row.goodsAttrType==2">次品</p>
                  <p class="cen-g" v-if="scope.row.goodsAttrType==3">未知</p>
                </template>

              </el-table-column>
              <el-table-column label="入库数量">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.goodsQty }}</p>
                </template>
              </el-table-column>
              <el-table-column
                :render-header="renderHeader1" width="100px">
                <template slot-scope="scope">
                  <!--@keyup.native="scope.row.failQty=scope.row.failQty.replace(/[^\d]/ig,'')"-->
                  <el-input id="id1" v-model="scope.row.failQty"
                            :disabled="scope.row.goodsAttrType==2"
                            @blur="verifyNews(scope.row,scope.$index)"
                            placeholder="请输入内容">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.goodsName}}</p>
                </template>
              </el-table-column>
              <el-table-column label="规格" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.specification}}</p>
                </template>
              </el-table-column>
              <el-table-column label="批次号" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.batchNo }}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div style="margin-top:20px;margin-bottom:20px;text-align: right">
            <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                       @click="inspectionOne=false">取消
            </el-button>
            <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                       @click="sureShelves()">提交上架
            </el-button>
            <el-button class="btnStyleOne"
                       style="margin:0;background-color:#49A0F5;color:white;border:none;width: 100px"
                       @click="sureShelvesOne()">提交上架并出库
            </el-button>
          </div>
        </div>
      </el-dialog>

    </div>
    <!--确认入库-->
    <div>
      <el-dialog v-dialogDrag
                 title="入库确认"
                 :visible.sync="tableDataSuccess"
                 width="800px"
                 tooltip-effect="dark"
                 center>
        <div>
          <div style="width: 100%;margin-top: -20px;margin-bottom: 10px"><i
            style="font-size: 16px;color: #E6A23C;margin-left: 20px;" class="el-icon-warning"></i><span
            style="font-size: 14px;margin-left: 10px">勾选{{this.selectNumber}}条，操作成功{{this.successNumber}}条，不符合确认条件{{this.unmatchedNumber}}条，操作失败{{this.failedNumber}}条件！</span>
          </div>
          <span style="margin-left: 3% ;font-size: 14px;font-weight:bold;;margin-bottom: 10px">{{this.msg}}</span>
        </div>
        <div class="" style="margin-top: 20px">
          <el-table :data="tableDataNum"
                    border>
            <el-table-column
              label="序号"
              align="center"
              type="index"
            >
            </el-table-column>
            <el-table-column label="入库单号">
              <template slot-scope="scope">
                <el-button @click="particulars(scope.row)" type="text" size="small"><span>{{scope.row.stockInNo}}</span>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="单据状态"
            >
              <template slot-scope="scope">
                <p class="initP-g" v-if="scope.row.status==0">全部</p>
                <p class="initP-g" v-if="scope.row.status==1">待确认</p>
                <p class="initP-g" v-if="scope.row.status==2">已确认</p>
                <p class="initP-g" v-if="scope.row.status==3">待上架</p>
                <p class="initP-g" v-if="scope.row.status==4">已上架</p>
                <p class="initP-g" v-if="scope.row.status==5">已作废</p>
              </template>
            </el-table-column>
            <el-table-column label="仓库">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.storageName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="供应商">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.supplierName}}</p>
              </template>
            </el-table-column>
            <el-table-column label="入库类型">
              <template slot-scope="scope">
                <p class="initP-g" v-if="scope.row.stockInType==0">全部</p>
                <p class="initP-g" v-if="scope.row.stockInType==1">采购</p>
                <p class="initP-g" v-if="scope.row.stockInType==2">调拨</p>
                <p class="initP-g" v-if="scope.row.stockInType==3">其他</p>
                <p class="initP-g" v-if="scope.row.stockInType==4">销退</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <!--提交上架并出库-->
    <el-dialog v-dialogDrag
               title="提示"
               :visible.sync="dialogFormVisiblec"
               width="418px"
    >
      <div>
        <p style="font-size: 16px;text-align: center">确定提交上架任务？</p>
      </div>
      <div style="margin-top:20px;margin-bottom:20px;text-align: center">
        <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                   @click="dialogFormVisiblec=false">取消
        </el-button>
        <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                   @click="sureDialogFormVisiblec(stockInIdC)" :disabled="isSure">确定
        </el-button>
      </div>
    </el-dialog>
    <!--提交上架-->
    <el-dialog v-dialogDrag
               title="提示"
               :visible.sync="dialogForm"
               width="418px"
    >
      <div>
        <p style="font-size: 16px;text-align: center">确定提交上架任务？</p>
      </div>
      <div style="margin-top:20px;margin-bottom:20px;text-align: center">
        <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                   @click="dialogForm=false">取消
        </el-button>
        <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                   @click="sureDialogForm(stockInIdC)" :disabled="asSure">确定
        </el-button>
      </div>
    </el-dialog>
    <!--合并条件窗口-->
    <el-dialog v-dialogDrag
               title="合并入库单"
               :visible.sync="centerDialogVisible"
               width="500px"
               center>
      <div style="width: 100%;margin-top: -20px;margin-bottom: 10px"><i
        style="font-size: 16px;color: #E6A23C;margin-left: 20px;" class="el-icon-warning"></i><span
        style="font-size: 14px;margin-left: 10px">勾选的入库单不符合合并条件，请重新选择！</span></div>
      <span style="margin-left: 3% ;font-size: 14px;font-weight:bold;;margin-bottom: 10px">合并入库单的条件：</span>
      <span>
          <ol style="margin-left: 30%;margin-top: 10px">
            <li>单据状态为待确认</li>
            <li>仓库、入库类型和供应商相同</li>
            <li>来源单据必须一致</li>
            <li>销退入库与调整入库不能合并</li>
         </ol>
       </span>
    </el-dialog>
    <!--合并入库单窗口-->
    <el-dialog v-dialogDrag
               width="420px"
               title="提示"
               :visible.sync="mergeWindow"
    >
      <div class="line"></div>
      <div style="margin-top:-10px;text-align: center"><span style="font-size: 14px;">确定合并入库单？</span></div>
      <div style="text-align: center;margin-top: 20px">
        <el-button @click="mergeWindow = false">取 消</el-button>
        <el-button type="primary" @click="mergeSure()">确定</el-button>
      </div>
    </el-dialog>
    <!--入库确认-->
    <el-dialog v-dialogDrag
               width="420px"
               title="提示"
               :visible.sync="affirmWindow"
    >
      <div class="line"></div>
      <div style="margin-top:-10px;text-align: center"><span style="font-size: 14px;">确认入库单？</span></div>
      <div style="text-align: center;margin-top: 20px">
        <el-button @click="affirmWindow = false">取 消</el-button>
        <el-button type="primary" @click="affirmSure()" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  import {AgGridVue} from "ag-grid-vue";

  export default {
    components: {
      'ag-grid-vue': AgGridVue,
      pagination, dataTime,
      orderCodeRender: {
        template: '<div><el-button @click="particulars()" type="text" size="small">{{params.data.stockInNo}}</el-button></div>',
        methods: {
          //入库单号跳转
          particulars() {
            /* let _this = this.params.context
             let stockInId=_this.tableData[this.params.node.rowIndex].stockInId
             _this.$router.push('/InventoryDetails/' + stockInId)*/
            let _this = this.params.context
            let stockInId = this.params.data.stockInId;
            _this.$router.push({name: 'InventoryDetails', params: {stockInNo: stockInId, id: 7}})
          }
        }
      },
      //操作
      delRenderer: {
        template: `<div >
          <div v-if="params.data.status == 1">
                <el-button v-if="params.context.authorityCode.WMS_INSTOCK__AMEND" @click="updateData()" type="text" size="small">修改
                </el-button>
                <el-button v-if="params.context.authorityCode.WMS_INSTOCK_AFFIRMINSTOCK && params.data.storageType!=2" @click="warehousingConfirm()" type="text" size="small">入库确认</el-button>
                <el-button v-if="params.context.authorityCode.WMS_INSTOCK_CANCELLATIONESD" @click="cancellatione()" type="text" size="small">作废</el-button>
          </div>
          <div v-if="params.data.status == 2 && this.params.context.authorityCode.WMS_INSTOCK_INSPECTION">
                <el-button @click="inspection()" type="text" size="small">入库质检</el-button>
          </div>
        </div>`,
        methods: {
          //单行入库确认
          warehousingConfirm() {
            let _this = this.params.context
            let stockInId = this.params.data.stockInId;
            _this.$router.push('/WarehousingConfirm/' + stockInId)
          },
          //跳入修改页面
          updateData() {
            let _this = this.params.context
            let stockInId = this.params.data.stockInId;
            _this.$router.push('/Amendinstorage/' + stockInId)
          },
          //入库质检
          inspection() {
            let stockInId = this.params.data.stockInId;
            //  this.stockInIdC=stockInId
            let outbarCode = this.params.data.barCode
            if (outbarCode == undefined) {
              outbarCode = ''
            }
            let _this = this.params.context
            this._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/getStockInItemInfo', {
              stockInId: stockInId,
              barCode: outbarCode
            }).then(function (res) {
              if (res.data.success == true) {
                _this.inspectionOne = true
                _this.barCode = ''
                _this.tableDataShop = res.data.result;
                _this.stockMap = new Map();
                //获取图片
                res.data.result.forEach(function (item, i) {
                  if (item.wmStockInGoodsBean.goodsId == item.goodsId) {
                    item.imageUrl = item.wmStockInGoodsBean.defaultImageUrl;
                  }
                })
                res.data.result.forEach(function (item, i) {
                  if (item.goodsAttrType == 1) {
                    item.failQty = 0
                  }
                })
                res.data.result.forEach(function (item, i) {
                  if (item.goodsAttrType == 3) {
                    item.failQty = 0
                  }
                })
                res.data.result.forEach(function (item, i) {
                  if (item.goodsAttrType == 2) {
                    item.failQty = item.goodsQty
                  }
                })
                _this.tableDataShop.forEach((item, i) => {//获取条形码
                  if (item.wmStockInGoodsBean.barCode) {
                    item.barCode = item.wmStockInGoodsBean.barCode
                  }
                })

                _this.tableDataShop.forEach((item, i) => {//获取
                  if (item.wmStockInGoodsBean.specification) {
                    item.specification = item.wmStockInGoodsBean.specification
                  }
                })
                _this.tableDataShop.forEach((item, i) => {//获取
                  if (item.wmStockInGoodsBean.batchNo) {
                    item.batchNo = item.wmStockInGoodsBean.batchNo
                  }
                })
                _this.tableDataShop.forEach((item, i) => {//获取
                  if (item.wmStockInGoodsBean.goodsName) {
                    item.goodsName = item.wmStockInGoodsBean.goodsName
                  }
                })
                _this.tableDataShop.forEach((item, i) => {//获取
                  if (item.wmStockInGoodsBean.realQty) {
                    item.realQty = item.wmStockInGoodsBean.realQty
                  }
                })
                _this.tableDataShop.forEach((item, i) => {//获取
                  if (item.wmStockInGoodsBean.goodsQty) {
                    item.goodsQty = item.wmStockInGoodsBean.goodsQty
                  }
                })
                _this.tableDataShop.forEach((item, i) => {//获取
                  _this.failQty = item.failQty
                })
                _this.tableDataShop.forEach((item, i) => {//获取
                  _this.stockInIdC = item.stockInId
                })
              }
            }).catch(function (err) {
              console.log(err)
            })
          },
          //单行作废
          cancellatione() {
            let _this = this.params.context
            let stockInId = this.params.data.stockInId;
            _this.$confirm('确定作废入库单？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              _this._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/batchCancel', {stockInIdList: stockInId}).then((res) => {
                if (res.data.success == true) {
                  //点击【确定】按钮，作废成功，并提示：勾选N1条，操作成功N2条，不符合作废条件的入库单为（N1-N2）条！
                  _this.$message({
                    message: '作废成功！勾选' + res.data.result.selectNumber + '条,操作成功' + res.data.result.successNumber + '条!不符合作废条件的入库单为' + res.data.result.unmatchedNumber + '条',
                    type: 'success'
                  });
                  _this.initMessage();//获取表格数据方法
                } else {
                  _this.$message({
                    message: '作废失败',
                    type: 'warning'
                  })
                }

              }).catch(function (err) {
                console.log(err)
              })
            }).catch(() => {
              _this.$message({
                type: 'info',
                message: '已取消操作'
              });
            });
          },
        }
      },
    },
    data() {
      return {
        gridOptions: {
          //国际化（设置显示文字）
          context: this,
          enableColResize: true,//可拖动改变列宽度
          suppressExcelExport: true,//关闭excel导出
          suppressCsvExport: true,//关闭csv导出
          /*rowHeight:50,*/
          enableRangeSelection: true,//可复制多行多单元格
          suppressCopyRowsToClipboard: true,//当启用行单击选择和范围选择时，如果您希望让范围优先，则快捷方式将复制所选行而不是所选范围
          suppressRowClickSelection: true,//阻止单击行选中本行
          enableSorting: true,
          enableBrowserTooltips: true,
          localeText: {
            noRowsToShow: '暂无数据',
            pinColumn: "固定列",
            pinLeft: '居左',
            pinRight: '居右',
            noPin: '默认',
            autosizeThiscolumn: '自适应当前列',
            autosizeAllColumns: '自适应所有列',
            resetColumns: '重置列',
            toolPanel: '工具板',
            blanks: '空白',
            selectAll: '全选',
            searchOoo: '搜索',
            filterOoo: '筛选',
            columns: '自定义显示列',
            groups: '行组',
            rowGroupColumnsEmptyMessage: '拖动此处以设置行组'
          }
        },//表格初始化配置
        components: null,//自定义列
        columnDefs: null,//列标题设置
        rowData: null,//表格数据
        //企业扩展
        gridApi: null,
        authorityCode: sessionStorage.getItem('authorityCode') ? JSON.parse(sessionStorage.getItem('authorityCode')) : {},//权限
        columnApi: null,
        agHeight: 0,
        wmsDownload: process.env.FILE_API,
        optionsAdjust: [],
        optionsStock: [{value: '', label: '全部'}],//仓库下拉
        optionsStock1: [],//仓库下拉
        supplier: [{value: '', label: '全部'}],//供应商
        supplierId: '',//供应商
        storageId: '',//仓库
        serachTypeNo: [
          {
            value: 1,
            label: '入库单号'
          }, {
            value: 5,
            label: '条形码'
          },
          {
            value: 6,
            label: '来源单号'
          },
          {
            value: 2,
            label: '申请人'
          },
          {
            value: 3,
            label: '确认人'
          },
          {
            value: 4,
            label: '质检人'
          }
        ],//入库单号
        serachType: 1,//默认入库单号
        serachStr: '',//入库单号输入内容
        timeTypeNo: [
          {
            value: 1,
            label: '申请时间'
          },
          {
            value: 2,
            label: '确认时间'
          },
          {
            value: 3,
            label: '质检时间'
          }
        ],//创建时间
        timeType: 1,//默认创建时间
        status: 0,//默认单据状态
        statusNo: [
          {
            value: 0,
            label: '全部'
          }, {
            value: 1,
            label: '待确认'
          },
          {
            value: 2,
            label: '已确认'
          },
          {
            value: 3,
            label: '待上架'
          },
          {
            value: 4,
            label: '已上架'
          },
          {
            value: 5,
            label: '已作废'
          }
        ],// status;//单据状态 0全部 1待确认 2已确认 3待上架 4已上架 5已作废
        stockInType: 0,//默认入库类型
        stockInTypeNo: [
          {
            value: 0,
            label: '全部'
          }, {
            value: 1,
            label: '采购入库'
          },
          {
            value: 2,
            label: '调拨入库'
          },
          {
            value: 3,
            label: '其他入库'
          },
          {
            value: 4,
            label: '销退入库'
          }
        ],// stockInType;//入库类型 0全部 1采购 2调拨 3其他 4销退
        startTime: '',//起始时间
        endTime: '',//结束时间
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        optionsCreate: [],
        stock: '',//仓库
        tableId: '',
        plat: [],
        stockArea: '',//库区
        stockSeat: '',//库位
        isSeat: false,//库位判空
        barCode: '',//条形码
        name: '',//商品名称
        dialogFormVisiblex: false,//修改窗口
        centerDialogVisible: false,//合并单
        unassign: false,//分配弹窗
        multipleSelection: [],//勾选
        visibleLead: false, // 导入1
        visibleLeadOne: false, // 导入1
        addData: {//确定导入
          fileName: '',//文件路径
          stockInType: '',//入库类型
          storageId: '',//仓库
          supplierId: '',//供应商
          remark: '',//入库备注
          fileId: '',//错误文件
          supplierNo: ''//供应商
        },
        StockOutTypeEnum: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 1,
            label: '采购入库'
          }, {
            value: 2,
            label: '调拨入库'
          }, {
            value: 3,
            label: '其他入库'
          },
        ],//入库类型
        StockOutTypeEnum2: [
          {
            value: 1,
            label: '采购入库'
          }, {
            value: 2,
            label: '调拨入库'
          }, {
            value: 3,
            label: '其他入库'
          },
        ],//入库类型
        rules: {
          stockInType: [     //必选入库类型
            {trigger: 'change', required: true, message: '请选择入库类型！'}
          ],
          storageId: [         //必选仓库
            {trigger: 'change', required: true, message: '请选择仓库！'},
          ],
          fileName: [       //文件
            {required: true, message: '请选择上传文件！'},
          ],
        },//校验表单规则
        tableDataShop: [],//入库质检
        tableDataShopOne: [],
        inspectionOne: false,//入库质检窗口
        names: '',
        supplierNo: '',
        tableDataSuccess: false,//入库确认弹窗
        tableDataNum: [],//入库确认信息
        successNumber: '',//勾选成功条数
        selectNumber: '',//不符合成功条数
        unmatchedNumber: '',//成功条数
        failedNumber: '',//失败条数
        msg: '',//原因
        number: '',//条数
        failQty: '',//不合格数量
        isShowSupper: false,//请选择供应商
        isDisable: false,//确定导入按钮
        isOk: 1,//文件选择函数
        isOk: 2,//选择格式不正确
        isOk: 3,//未上传文件
        loading: false,//加载中
        dialogFormVisiblec: false,//提交上架的窗口取消
        dialogForm: false,//提交上架任务的窗口取消
        mergeWindow: false,//合并窗口
        fullscreenLoading: false,//遮罩
        affirmWindow: false,//确认入库单窗口取消
        newFailQty: '',//新建的不合格数量
        stockMap: null,
        outId: '',
        outbarCode: '',
        nuber: '',//下标
        yesOne: 1,
        isSure: false,//确定提交上架任务禁用按钮
        asSure: false,//确定提交上架任务禁用按钮
        stockInIdC: '',//定义一个空字符接收id
        stockOne: [],//仓库全局

      }
    },
    //列标题设置
    beforeMount() {
      this.columnDefs = [/*多选框*/ /*表头全选框*/
        {
          headerName: '序号',
          field: 'index',
          pinned: 'left',
          suppressToolPanel: true,
          suppressSorting: true,
          lockPosition: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 120,
        },
        {headerName: '入库单号', field: 'stockInNo', pinned: 'left', width: 180, cellRendererFramework: "orderCodeRender"},
        {headerName: '单据状态', field: 'statusName', width: 180,},
        {headerName: '仓库', field: 'storageName', width: 120,},
        {headerName: '供应商', field: 'supplierName', width: 150, tooltipField: 'supplierName'},
        {headerName: '入库类型', field: 'stockInTypeName', width: 180},
        {headerName: '入库备注', field: 'remark', width: 200, tooltipField: 'remark'},
        {headerName: '三方仓同步状态', field: 'syncStatus', width: 200, tooltipField: 'remark'},
        {headerName: '三方仓处理状态', field: 'wmsProcessStatus', width: 200, tooltipField: 'remark'},
        {headerName: '申请人', field: 'proposer', width: 150},
        {headerName: '申请时间', field: 'proposeTime', width: 180},
        {headerName: '确认人', field: 'confirmor', width: 150},
        {headerName: '确认时间', field: 'confirmeTime', width: 200},
        {headerName: '质检人', field: 'qualiter', width: 150},
        {headerName: '质检时间', field: 'qualitTime', width: 200},
        {headerName: '来源单据', field: 'sourceOrderType', width: 180},
        {headerName: '来源单号', field: 'sourceOrderNo', width: 180},
        {headerName: '关联单号', field: 'relevantOrderNo', width: 180},
        {headerName: '操作', field: 'button ', pinned: 'right', width: 200, cellRendererFramework: "delRenderer",},
      ];
      //自定义列
      this.components = {};

    },
    activated() {
      this.initMessage();//初始化表格数据
    },
    mounted() {
      this.renderTableHeight(); //渲染表格高度
      this.supplierNum(); //供应商
      this.initTime();// //初始化时间
      this.initStock();    //初始化仓库下拉列表
      this.initMessage();//获取表格数据方法
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
      });//渲染表格高度
    },
    methods: {

      //保存表格设置
      saveTableSet() {
        var setColumnState = JSON.stringify(this.gridOptions.columnApi.getColumnState());
        sessionStorage.setItem("columnState", setColumnState);
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
      },

      //表格初始化
      onGridReady(params) {
        if (sessionStorage.getItem("columnState")) {
          var getColumnState = JSON.parse(sessionStorage.getItem("columnState"));
          this.gridOptions.columnApi.setColumnState(getColumnState);
        }
        //this.gridApi = params.api;
        // this.columnApi = params.columnApi;
        //params.api.sizeColumnsToFit();
        this.orderIds = '';
        this.gridOptions.onSelectionChanged = (event) => {
          //this.orderLists = this.getSelectedRows();
          this.multipleSelection = this.gridOptions.api.getSelectedRows();
          var orderIds = '';
          this.multipleSelection.forEach((item, i) => {
            orderIds += item.stockInId + ',';
          })
          this.orderIds = orderIds.slice(0, -1);
        }
        this.gridOptions.onSortChanged = (event) => {
          console.log(event);
        }
      },
      getSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData;
      },

//      onGridReady(params) {
//        this.gridApi = params.api;
//        this.columnApi = params.columnApi;
//        //点击多选框触发此事件
//        this.gridOptions.onSelectionChanged = (event) => {
//          this.multipleSelection = this.getSelectedRows();
//        }
//      },

      //详情，修改，入库确认跳转
      beforeRouteLeave(to, from, next) {
        if (to.name == 'InventoryDetails' || to.name == 'Amendinstorage' || to.name == 'WarehousingConfirm') {
          //离开时，将自身缓存下来
          if (!from.meta.keepAlive) {
            from.meta.keepAlive = true;//当我们进入到C时开启B的缓存
          }
          next();
        } else {
          from.meta.keepAlive = false;
          to.meta.keepAlive = false;
          this.$destroy();
          next();
        }
      },

      //入库质检输入
      verifyNews(row, index) {
        row.failQty += '';
        row.failQty = row.failQty.replace(/[^\d]/ig, '')
        if (row.goodsQty < row.failQty) {
          this.$message({
            message: '不合格数量不可超过入库数量！',
            type: 'warning'
          })
        }
        //this.newFailQty=row.failQty
        this.nuber = index
        this.yesOne = 1;
        this.stockMap.set(row.stockInItemId, row.failQty);
      },

      //供应商事件
      isShowOne() {
        if (this.addData.supplierId != '') {
          this.isShowSupper = false
        }
      },

      //打印
      print() {
        if (this.multipleSelection == '') {
          this.$message({
            message: '请勾选入库单！',
            type: 'warning'
          })
        } else {
          var arrOne = ''
          for (let item of this.multipleSelection) {
            arrOne += item.stockInId + ','
          }
          const token = sessionStorage.getItem('clToken');
          let data = {
            ids: arrOne.slice(0, -1),
            modelkey: 5,
            stype: 'SVoucher',
            cltoken: token
          }
          $.ajax({
            type: "post",
            url: "http://127.0.0.1:8082/preview",
            data: data,
            success: function (data) {
            }
          });
        }
      },

      //提交上架并出库
      sureShelvesOne() {
        var self = this;
        let arr = [];
        let exit = false;
        self.tableDataShop.forEach(item => {
          arr.push(item.failQty);
          if (arr.indexOf("" || undefined) != -1) {
            exit = true;
            self.$message({
              message: '不合格数量不能为空！',
              type: 'warning'
            })
          }
          if (item.goodsQty < item.failQty) {
            exit = true;
            self.$message({
              message: '不合格数量不可超过入库数量！',
              type: 'warning'
            })
          }
          if (exit) {
            self.loading = false;
            self.dialogFormVisiblec = false
            return false;
          }
          self.dialogFormVisiblec = true
        })
      },

      //提交上架并出库
      sureDialogFormVisiblec(stockInIdC) {
        const loading = this.$loading({
          lock: true,
          text: '正在寻找商品的上架库位，请稍后......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let outData = {
          stockInId: stockInIdC,
          barCode: this.outbarCode
        }
        let self = this;
        self.loading = true;
        let data = [];
        self.tableDataShop.forEach(item => {
          let obj = {
            merchantId: 0,
            stockInItemId: item.stockInItemId,
            goodsId: item.goodsId,
            goodsQty: item.goodsQty,
            failQty: item.failQty,
            goodsAttrType: item.goodsAttrType
          };
          data.push(obj);
        });
        data = JSON.stringify(data)
        self.isSure = true
        self._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/submitAndStockOut', {
          wmsStockInItemEditBeanListJsonStr: data,
          stockInId: stockInIdC
        })
          .then(function (response) {
            if (response.data.success == true) {
              self.$message({
                type: 'success',
                message: response.data.result,
              })
              self.inspectionOne = false
              self.dialogFormVisiblec = false
              self.initMessage()
              self.loading = false;
              self.isSure = false
              loading.close();
            } else {
              loading.close();
              self.isSure = false
              self.inspectionOne = false
              self.$message({
                message: response.data.msg,
                type: 'warning'
              });
              self.loading = false
              self.dialogFormVisiblec = false
              this.inspection(outData)//从新调一下接口
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //提交上架
      sureShelves() {
        let data = [];
        var self = this;
        let arr = [];
        let exit = false;
        self.tableDataShop.forEach(item => {
          arr.push(item.failQty);
          if (arr.indexOf("" || undefined) != -1) {
            exit = true;
            self.$message({
              message: '不合格数量不能为空!',
              type: 'warning'
            })
            self.loading = false;
          }
          if (item.goodsQty < item.failQty) {
            exit = true;
            self.$message({
              message: '不合格数量不可超过入库数量！',
              type: 'warning'
            })
          }
          if (exit) {
            self.loading = false;
            self.dialogForm = false;
            return false;
          }
          self.dialogForm = true
        })
      },

      //提交上架确认
      sureDialogForm(stockInIdC) {
        const loading = this.$loading({
          lock: true,
          text: '正在寻找商品的上架库位，请稍后......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let outData = {
          stockInId: stockInIdC,
          barCode: this.outbarCode
        }
        let self = this;
        self.loading = true;
        let data = [];
        self.tableDataShop.forEach(item => {
          let obj = {
            merchantId: 0,
            stockInItemId: item.stockInItemId,
            goodsId: item.goodsId,
            goodsQty: item.goodsQty,
            failQty: item.failQty,
            goodsAttrType: item.goodsAttrType
          };
          data.push(obj);
        });
        data = JSON.stringify(data)
        self.asSure = true
        self._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/submitStockIn', {
          wmsStockInItemEditBeanListJsonStr: data,
          stockInId: stockInIdC
        })
          .then(function (response) {
            //  if(response.data.code==0){
            if (response.data.success == true) {
              self.$message({
                type: 'success',
                message: response.data.result,
              })
              self.inspectionOne = false
              self.initMessage()
              self.loading = false;
              self.dialogForm = false
              self.asSure = false
              loading.close();
            } else {
              loading.close();
              self.asSure = false
              self.inspectionOne = false
              self.$message({
                message: response.data.msg,
                type: 'warning'
              });
              self.loading = false;
              self.dialogForm = false
              self.inspection(outData)//从新调一下接口

            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //导出
      derive() {
        if (this.multipleSelection == '') {
          let startTime, endTime;
          if (this.startTime != null) {
            startTime = new Date(this.startTime).getTime()
          } else {
            startTime = ''
          }
          if (this.endTime != null) {
            endTime = new Date(this.endTime).getTime()
          } else {
            endTime = ''
          }
          let data = {
            "status": this.status,//单据状态
            "supplierId": this.supplierId,//供应商
            "stockInType": this.stockInType,//入库类型
            "timeType": this.timeType,//时间类型
            "storageId": this.storageId, // 仓库id
            "serachType": this.serachType,//入库
            "serachStr": this.serachStr,//内容
            "startTime": startTime,//创建时间开始
            "endTime": endTime,//创建时间结束
            "page": this.curPage,
            "size": this.pageSize
          };
          let self = this;
          self._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/reportAllExcel', data /*{
            stockInIds: stre.slice(0, -1),
          }*/)
            .then(function (res) {
              if (res.data.code == 0) {
                location.href = 'http://' + self.wmsDownload + '/files-web/download/' + res.data.result
              } else {
                self.$message({
                  message: res.data.msg,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        } else {
          let str = []
          for (let item of this.multipleSelection) { // 库位ID，用逗号隔开
            str += item.stockInId + ','
          }
          let self = this;
          self._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/reportExcel', {
            stockInIds: str.slice(0, -1),
          })
            .then(function (res) {
              if (res.data.code == 0) {
                location.href = 'http://' + self.wmsDownload + '/files-web/download/' + res.data.result
              } else {
                self.$message({
                  message: res.data.msg,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }

      },

      //导入窗口
      importTemplate() {
        this.downLoadOne();
        let self = this;
        self.supplierSum();
        self.addData.fileId = '';
        self.addData.fileName = '';
        self.addData.storageId = '';
        self.addData.supplierId = '';
        self.addData.remark = '';
        self.uploadFile = '';
        self.isShowSupper = false;
      },

      //确定导入
      makeImport() {
        if (this.isOk == 2) {
          this.$message({
            message: '文件格式不正确，仅支持.xls、. xlsx两种格式！',
            type: 'warning'
          });
          return false;
        }
        if (this.isOk == 3) {
          this.$message({
            message: '请上传文件！',
            type: 'warning'
          });
          return false;
        }
        this.isDisable = true
        if (this.addData.stockInType == 1 || this.addData.stockInType == 3) {
          if (this.addData.supplierId == '') {
            this.isShowSupper = true

          } else if (!this.addData.supplierId == '') {
            this.isShowSupper = false
          }
        }
        this.$refs.addData.validate((valid) => {
          if (valid) {
            let formData = new FormData();
            formData.append('filedata', this.uploadFile);
            this.$axios({
              method: 'post',
              url: 'http://' + this.wmsDownload + '/files-web/upload',
              //  url: 'http://192.168.50.93:8822/files-web/upload',
              data: formData
            }).then((res) => {
              if (res.data.resourcesId) {
                this.addData.fileId = res.data.resourcesId
                this.addData.supplierNo = this.supplierNo;
                this._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/batchImport', this.addData)
                  .then((res) => {
                    if (res.data.success == true) {
                      if (res.data.result.success == false) {
                        location.href = 'http://' + this.wmsDownload + '/files-web/download/' + res.data.result.fileId
                        this.$message({
                          message: '导入失败，详细错误请查看Excel错误文件！',
                          type: 'warning'
                        })
                      } else {
                        if (!res.data.result.failReason == '') {
                          this.$message({
                            message: res.data.result.failReason,
                            type: 'warning'
                          })
                        } else {
                          this.$message({
                            message: '导入成功！',
                            type: 'success'
                          })
                          this.initMessage()
                        }

                      }
                      this.visibleLead = false;
                      this.visibleLeadOne = false;
                      this.$refs.fileBtn.value = '';
                    } else {
                      this.$message({
                        message: res.data.msg,
                        type: 'warning'
                      })
                    }
                  })
              }
            })
          } else {
            console.log('error submit!!');

          }
        });
        setTimeout(() => {
          this.isDisable = false
        }, 3000);
      },

      //供应商
      supplierSum: function () {
        this._post('com.edb01.erp.mdata.service.api.SupplierService/1.0.0/getSupplierList').then(function (res) {
          this.supplier = res.data.result;
          for (var i = 0; i < this.supplier.length; i++) {
            this.supplierNo = this.supplier[i].supplierNo
          }
        }.bind(this));
      },

      // 弹框关闭时置为空
      handleClose(done, addData) {
        this.$refs.addData.resetFields();
        this.$refs.fileBtn.value = '';
        done();
      },

      //导入
      downLoadOne() {
        let self = this;
        self._post('com.edb01.erp.mdata.service.api.GoodsService/1.0.0/queryBatchFlag').then(function (res) {
          if (res.data.result.batchFlag == true) {
            self.visibleLead = true
            self.visibleLeadOne = false
          }
          if (res.data.result.batchFlag == false) {
            self.visibleLead = false
            self.visibleLeadOne = true
          }
        }).catch(function (err) {
          console.log(err)
        })
      },

      //下载入库单模板
      downLoad() {
        let self = this;
        self._post('com.edb01.erp.mdata.service.api.GoodsService/1.0.0/queryBatchFlag').then(function (res) {
          if (res.data.result.batchFlag == true) {
            location.href = 'http://' + self.wmsDownload + '/files-web/download/9619';
          }
          if (res.data.result.batchFlag == false) {
            location.href = 'http://' + self.wmsDownload + '/files-web/download/9618';
          }
        }).catch(function (err) {
          console.log(err)
        })
      },

      //文件选择函数
      fileSelect(e) {
        this.isOk = 1
        this.uploadFile = "";
        this.addData.fileName = e.target.files[0].name;
        if (e.target.files[0].name.indexOf(".xls") > 0 || e.target.files[0].name.indexOf(".xlsx") > 0) {
          this.uploadFile = e.target.files[0];
        } else {
          this.isOk = 2
          this.$message({
            message: '文件格式不正确，仅支持.xls、. xlsx两种格式！',
            type: 'warning'
          });
        }
      },

      // 点击选择文件
      fileUpload() {
        this.$refs.fileBtn.click();
      },

      // 入库确认
      affirmSure() {
        let self = this
        var vals = '';
        self.multipleSelection.forEach((item) => {
          vals += item.stockInId + ',';
        })
        const loading = this.$loading({
          lock: true,
          text: '正在进行入库确认，请稍后......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        self.affirmWindow = false
        self._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/batchConfirm', {stockInIdList: vals.slice(0, -1)}).then(function (res) {
          if (res.data.success == true) {
            if (res.data.result.hasOwnProperty("msg")) {
              self.tableDataSuccess = true
              self.tableDataNum = res.data.result.wmStockInEditBeanList;
              self.msg = res.data.result.msg;
              self.selectNumber = res.data.result.selectNumber;
              self.successNumber = res.data.result.successNumber
              self.unmatchedNumber = res.data.result.unmatchedNumber
              self.failedNumber = res.data.result.failedNumber
              self.initMessage()
              loading.close();
            } else {
              self.$message({
                message: '勾选' + res.data.result.selectNumber + '条,操作成功' + res.data.result.successNumber + '条!不符合条件的入库单为' + res.data.result.unmatchedNumber + '条',
                type: 'success'
              });
              self.initMessage();
              loading.close();
            }
          } else {
            if (res.data.code == 320000002) {
              self.$message({
                message: '未找到收货区!',
                type: 'warning'
              })
              loading.close();
            }
            if (res.data.code == 111000014) {
              self.$message({
                message: '勾选的入库单中不包含待确认的入库单!',
                type: 'warning'
              })
              loading.close();
            }
          }
        }).catch(() => {
          self.$refs.multipleTable.clearSelection();
        });
      },

      //抬头入库确认
      affirmInStock() {
        let self = this;
        if (self.multipleSelection == '') {
          self.$message({
            message: '请勾选入库单！',
            type: 'warning'
          })
          return false;
        }
        let str = 0;
        this.multipleSelection.forEach(item => {
          if (item.status == 1) {
            str++;
          }
        })
        if (str == 0) {
          this.$message({
            message: '勾选的入库单中没有能确认的入库单！',
            type: 'warning'
          })
          return false;
        }
        var arr = '';
        self.multipleSelection.forEach((item) => {
          arr += item.stockInId + ',';
        })
        self._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/batchConfirmCheck', {stockInIdList: arr.slice(0, -1)}).then(function (res) {
          if (res.data.success == true) {
            self.affirmWindow = true
          } else {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (err) {
          console.log(err)
        })
      },

      //作废
      cancelled() {//status==1  待确认
        if (this.multipleSelection == '') {
          this.$message({
            message: '请勾选入库单！',
            type: 'warning'
          })

          return false;
        }
        let str = 0;
        this.multipleSelection.forEach(item => {
          if (item.status == 1) {
            str++;
          }
        })
        if (str == 0) {
          this.$message({
            message: '待确认的入库单才可作废!',
            type: 'warning'
          })

          return false;
        } else {
          let arr = '';
          for (let item of this.multipleSelection) {
            arr += item.stockInId + ','
          }
          this.$confirm('确定作废入库单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/batchCancel', {stockInIdList: arr.slice(0, -1)}).then(res => {
              if (res.data.success == true) {
                //点击【确定】按钮，作废成功，并提示：勾选N1条，操作成功N2条，不符合作废条件的入库单为（N1-N2）条！
                this.$message({
                  message: '作废成功！勾选' + res.data.result.selectNumber + '条,操作成功' + res.data.result.successNumber + '条!不符合作废条件的入库单为' + res.data.result.unmatchedNumber + '条',
                  type: 'success'
                });
                this.initMessage();//获取表格数据方法
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }

            }).catch(function (err) {
              console.log(err)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        }
      },

      //确定合并
      mergeSure() {
        let self = this;
        var arr = [];
        for (let item of this.multipleSelection) {
          arr += item.stockInId + ','
        }
        self._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/combineStockIn', {stockIds: arr.slice(0, -1)}).then(function (res) {
          if (res.data.success == true) {
            self.initMessage()
            self.$message({
              message: '合并成功' + self.number + '条！',
              type: 'success'
            });
            self.mergeWindow = false
          } else {
            self.mergeWindow = false
            self.centerDialogVisible = true
          }
        }).catch(function (err) {
          console.log(err)
        })
      },

      //合并
      merge() {
        if (this.multipleSelection == '') {
          this.$message({
            message: '请选择入库单！',
            type: 'warning'
          })
        } else if (this.multipleSelection.length == 1) {
          this.$message({
            message: '请选择多条入库单！',
            type: 'warning'
          })
        } else {
          this.number = this.multipleSelection.length
          let self = this
          var arr = [];
          for (let item of this.multipleSelection) {
            arr += item.stockInId + ','
          }
          self._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/combineStockInCheck', {stockIds: arr.slice(0, -1)}).then(function (res) {
            if (res.data.success == true) {
              self.mergeWindow = true
            } else {
              self.centerDialogVisible = true
            }
          }).catch(function (err) {
            console.log(err)
          })
        }
      },

      //弹窗查询
      searchOne() {
        let self = this;
        self._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/getStockInItemInfo', {
          stockInId: self.stockInId,
          barCode: self.barCode
        }).then(function (res) {
          if (res.data.code == 0) {
            self.inspectionOne = true
            self.tableDataShop = res.data.result;
            res.data.result.forEach(function (item, i) {
              if (item.wmStockInGoodsBean.goodsId == item.goodsId) {
                item.imageUrl = item.wmStockInGoodsBean.defaultImageUrl;
              }
            })
            res.data.result.forEach(function (item, i) {
              if (item.goodsAttrType == 1) {
                //item.failQty=self.newFailQty
                // item.failQty=item.failQty
                if (self.stockMap.get(item.stockInItemId)) {
                  item.failQty = self.stockMap.get(item.stockInItemId);
                }
              }
            })
            res.data.result.forEach(function (item, i) {
              if (item.goodsAttrType == 3) {
                item.failQty = 0
              }
            })
            res.data.result.forEach(function (item, i) {
              if (item.goodsAttrType == 2) {
                item.failQty = item.goodsQty
              }
            })
            self.tableDataShop.forEach((item, i) => {//获取条形码
              if (item.wmStockInGoodsBean.barCode) {
                item.barCode = item.wmStockInGoodsBean.barCode
              }
            })

            self.tableDataShop.forEach((item, i) => {//获取
              if (item.wmStockInGoodsBean.specification) {
                item.specification = item.wmStockInGoodsBean.specification
              }
            })
            self.tableDataShop.forEach((item, i) => {//获取
              if (item.wmStockInGoodsBean.batchNo) {
                item.batchNo = item.wmStockInGoodsBean.batchNo
              }
            })
            self.tableDataShop.forEach((item, i) => {//获取
              if (item.wmStockInGoodsBean.goodsName) {
                item.goodsName = item.wmStockInGoodsBean.goodsName
              }
            })
            self.tableDataShop.forEach((item, i) => {//获取
              if (item.wmStockInGoodsBean.realQty) {
                item.realQty = item.wmStockInGoodsBean.realQty
              }
            })
            self.tableDataShop.forEach((item, i) => {//获取
              if (item.wmStockInGoodsBean.goodsQty) {
                item.goodsQty = item.wmStockInGoodsBean.goodsQty
              }
            })
            self.tableDataShop.forEach((item, i) => {//获取
              self.failQty = item.failQty
            })
          }
        }).catch(function (err) {
          console.log(err)
        })
      },

      //添加
      addDatas() {
        this.$router.push({path: '/Addinstorage'});
      },

      //查询
      search: function () {
        this.initMessage();
      },

      //初始化时间
      initTime: function () {
        var nowdate = new Date();
        var y = nowdate.getFullYear();
        var m = nowdate.getMonth() + 1;
        var d = nowdate.getDate();
        var formatnowdate = y + '-' + m + '-' + d + ' 23:59:59';
        nowdate.setMonth(nowdate.getMonth() - 1);
        var y = nowdate.getFullYear();
        var m = nowdate.getMonth() + 1;
        var d = nowdate.getDate();
        var formatwdate = y + '-' + m + '-' + d;
        this.startTime = formatwdate
        this.endTime = formatnowdate
      },

      // 格式化0-9
      turnSingle(num) {
        return num < 10 ? '0' + num : num
      },

      //初始化表格数据
      initMessage: function () {
        let startTime, endTime;
        if (this.startTime != null) {
          startTime = new Date(this.startTime).getTime()
        } else {
          startTime = ''
        }
        if (this.endTime != null) {
          endTime = new Date(this.endTime).getTime()
        } else {
          endTime = ''
        }
        let data = {
          "status": this.status,//单据状态
          "supplierId": this.supplierId,//供应商
          "stockInType": this.stockInType,//入库类型
          "timeType": this.timeType,//时间类型
          "storageId": this.storageId, // 仓库id
          "serachType": this.serachType,//入库
          "serachStr": this.serachStr,//内容
          "startTime": startTime,//创建时间开始
          "endTime": endTime,//创建时间结束
          "page": this.curPage,
          "size": this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmStockInService/1.0.0/listWithPage', data).then(function (response) {
          if (response.data.code == 0) {
            if (response.data.hasOwnProperty("result")) {
              this.tableData = response.data.result.rows;
              this.total = response.data.result.total;
              //  this.total = response.data.result.total;
              response.data.result.rows.forEach(item => {
                if (item.remark) {
                  item.name1 = item.remark.slice(0, 25);
                  if (item.remark.length > 25) {
                    item.name2 = item.remark.slice(25, 200);
                  }
                } else {
                  item.name1 = '';
                  item.name2 = '';
                }
              })
              response.data.result.rows.forEach((item, index) => { // 处理数据
                item.index = index + 1;
                //单据状态
                if (item.status == 0) {
                  item.statusName = '全部';
                } else if (item.status == 1) {
                  item.statusName = '待确认';
                } else if (item.status == 2) {
                  item.statusName = '已确认';
                } else if (item.status == 3) {
                  item.statusName = '待上架';
                } else if (item.status == 4) {
                  item.statusName = '已上架';
                } else if (item.status == 5) {
                  item.statusName = '已作废';
                }
                // 入库类型
                if (item.stockInType == 1) {
                  item.stockInTypeName = '采购入库'
                } else if (item.stockInType == 2) {
                  item.stockInTypeName = '调拨入库'
                } else if (item.stockInType == 3) {
                  item.stockInTypeName = '其他入库'
                } else if (item.stockInType == 4) {
                  item.stockInTypeName = '销退入库'
                }
                if (item.stockInType == 4) {
                  item.sourceOrderType = '售后单'
                }
                //三方仓同步状态
                if (item.syncStatus == 1) {
                  item.syncStatus = '已同步';
                } else if (item.syncStatus == 0) {
                  item.syncStatus = '未同步';
                }
                //三方仓处理状态
                if (item.wmsProcessStatus == 1) {
                  item.wmsProcessStatus = '已确认';
                } else if (item.wmsProcessStatus == 0) {
                  item.wmsProcessStatus = '已取消';
                }
                //申请时间   proposeTime
                if (item.proposeTime == undefined || item.proposeTime == '') {
                  item.proposeTime = '';
                } else {
                  let b = new Date(new Date(item.proposeTime));
                  item.proposeTime = b.getFullYear() + '-' + this.turnSingle(b.getMonth() + 1) + '-' + this.turnSingle(b.getDate()) + ' ' + this.turnSingle(b.getHours()) + ':' + this.turnSingle(b.getMinutes()) + ':' + this.turnSingle(b.getSeconds());
                }
                //确认时间   confirmeTime
                if (item.confirmeTime == undefined || item.confirmeTime == '') {
                  item.confirmeTime = '';
                } else {
                  let a = new Date(new Date(item.confirmeTime));
                  item.confirmeTime = a.getFullYear() + '-' + this.turnSingle(a.getMonth() + 1) + '-' + this.turnSingle(a.getDate()) + ' ' + this.turnSingle(a.getHours()) + ':' + this.turnSingle(a.getMinutes()) + ':' + this.turnSingle(a.getSeconds());
                }
                //质检时间   qualitTime
                if (item.qualitTime == undefined || item.qualitTime == '') {
                  item.qualitTime = '';
                } else {
                  let c = new Date(new Date(item.qualitTime));
                  item.qualitTime = c.getFullYear() + '-' + this.turnSingle(c.getMonth() + 1) + '-' + this.turnSingle(c.getDate()) + ' ' + this.turnSingle(c.getHours()) + ':' + this.turnSingle(c.getMinutes()) + ':' + this.turnSingle(c.getSeconds());
                }
                item.index = index + 1;
              });
              this.stockOne.forEach((item1) => {
                this.tableData.forEach((item) => {
                  if (item.storageId == item1.storageId) {
                    item.storageName = item1.storageName
                    item.storageType = item1.storageType
                  }
                })
              })
            } else {
              this.tableData = [];
              this.total = 0;
            }
            //    console.log(response.data.result,111);
            /*   if(response.data.result.rows==undefined){
                 this.tableData =[]
               }else{
                 this.tableData = response.data.result.rows
               }*/

          }
          if (response.data.code == 100000) {
            this.$message({
              type: 'warning',
              message: response.data.msg
            })
          }
        }.bind(this))
      },

      //初始化仓库下拉列表
      initStock: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/1.0.0/listOauth').then(function (res) {
          let arr = res.data.result;
          this.stockOne = res.data.result
          arr.forEach(function (val) {
            this.optionsStock.push({value: val.storageId, label: val.storageName})
            this.optionsStock1.push({value: val.storageId, label: val.storageName})
          }.bind(this));
        }.bind(this));
      },

      //供应商
      supplierNum: function () {
        this._post('com.edb01.erp.mdata.service.api.SupplierService/1.0.0/getSupplierList').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.supplier.push({value: val.supplierId, label: val.supplierName})
          }.bind(this));
        }.bind(this));
      },

      //不合格数量
      renderHeader1(createElement, {_self}) {
        return createElement(
          'span',
          {
            style: 'font-weight:bold;'
          },
          [
            createElement('span', ['不合格数量']
            ),
            createElement(
              'i',
              {
                class: 'el-icon-question',
                style: 'font-size:14px;margin-left:5px;',
                attrs: {title: '商品的不合格数量，选择提交上架并出库时，此不合格数量将会直接生成出库单。'}
              }
            )
          ]
        );
      },
      //以下是分页
      getPageSize: function (val) {
        if (val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();
        }
      },

      getCurPage: function (val) {
        if (val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
        }
      },

      //获取时间time1
      getTime1: function (val) {
        this.startTime = val
      },

      //获取时间time2
      getTime2: function (val) {
        this.endTime = val;
      },

      //勾选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //渲染表格高度
      renderTableHeight() {
        this.$nextTick(function () {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 80;
        });
        window.onresize = () => {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 80;
        }
      },
    }

  }
</script>
<style>
  #InStock .pTop .col-nav ul li span {
  }

</style>
<style scoped>
  #InStock {
    padding: 20px;
  }

  .pTop {
    margin-bottom: 20px;
  }

  .btnStyle {
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px !important;
    height: 30px;
    line-height: 8px;
  }

  .btnStyleOne {
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 120px !important;
    height: 30px;
    line-height: 8px;
  }

  .fix {
    margin-top: 20px;
    white-space: nowrap;
  }

  .fix-l {
    display: inline-block;
    width: 120px;
    text-align: right;
  }

  ol {
    list-style-type: none;
    counter-reset: sectioncounter;
    width: 200px;
  }

  ol li:before {
    content: counter(sectioncounter) "、";
    counter-increment: sectioncounter;
  }

  .leadUl li {
    color: #FF0000;
    font-size: 14px;
    margin-bottom: 20px;
    padding-left: 17px;
  }

  .liSpan {
    color: #0000FF;
    cursor: pointer;
  }

  .dog {
    color: #EC6B6A;
    position: relative;
    left: 120px;
    top: -20px;
  }

</style>

