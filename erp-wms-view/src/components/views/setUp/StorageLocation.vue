<!--库位 贾南风-->
<template>
  <div id="storageLocation">
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="5">
            <div class="grid-content">
              <label>所属仓库：</label>
              <el-select v-model="queryD.storageId"  placeholder="请选择所属仓库" @change="changeName">
                <el-option
                  v-for="item in store"
                  :key="item.storageId"
                  :label="item.storageName"
                  :value="item.storageId">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <label>库区类型：</label>
              <el-select v-model="queryD.sectionType"  placeholder="请选择库区类型" @change="changeName">
                <el-option
                  v-for="item in storageType"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="5">
            <div  class="grid-content" style="white-space: nowrap">
              <label for="example-post1">库区名称：</label>
              <select id="example-post1" name="multiselect[]" multiple="multiple">
                <option  v-for="item in reservoirName1" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <label>通道号：</label>
              <el-input type="number" @keyup.native="rangeNum(1)" class="mouse3" onmousewheel="return false;" v-model="queryD.aisleCode" placeholder="请输入通道号" ></el-input>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <label>库位类型：</label>
              <el-select v-model="queryD.binType" clearable placeholder="全部" >
                <el-option
                  v-for="item in storageLocalType"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <label style="width: 72px!important;">库位优先级：</label>
              <el-input type="number" class="mouse3" onmousewheel="return false;"@keyup.native="rangeNum(2)" v-model="queryD.pri"  placeholder="请输入库位优先级" style="width: 61%!important;"></el-input>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <label>库位名称：</label>
              <el-input v-model="queryD.storageBinName" placeholder="请输入库位名称"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button size="mini" type="primary" @click="refer()">查 询</el-button>
        <el-button size="mini"  @click="resetData()">重 置</el-button>
      </div>
    </div>
    <div class="col-nav" style="margin:0 0 10px;">
      <ul>
        <li v-if="authorityCode.WMS_STORAGELOCATION_ADD" @click="clickAdd('addData')"><span>添加</span></li>
        <li v-if="authorityCode.WMS_STORAGELOCATION_ADD" @click="batchAdd('addData')"><span>批量添加</span></li>
        <li v-if="authorityCode.WMS_STORAGELOCATION_DEL" @click="clickDelete()"><span>删除</span></li>
        <li v-if="authorityCode.WMS_STORAGELOCATION_ADD" @click="importTemplate"><span>导入</span></li>
        <li v-if="authorityCode.WMS_STORAGELOCATION_ORDER" @click="storeOrder"><span>调整库位顺序</span></li>
        <li v-if="authorityCode.WMS_STORAGELOCATION_LOG" @click="publicLogBtn()"><span>查看日志</span></li>
        <li v-if="authorityCode.WMS_STORAGELOCATION_PRINT" @click="printLocal()"><span>打印库位名称</span></li>
      </ul>
    </div>
    <!--表格数据-->
    <div class="col-border">
      <el-table
        :data="tableData"
        id="fitTable"
        :height="table_h"
        border
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="storageName"
          label="所属仓库">
        </el-table-column>
        <el-table-column
          align="center"
          label="库区类型">
          <template slot-scope="scope">
            <span v-if="scope.row.storageSectionType == 1">拣货区</span>
            <span v-if="scope.row.storageSectionType == 2">存货区</span>
            <span v-if="scope.row.storageSectionType == 3">收货区</span>
            <span v-if="scope.row.storageSectionType == 4">退货区</span>
            <span v-if="scope.row.storageSectionType == 5">次品区</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="80"
          prop="storageSectionName"
          label="库区名称">
        </el-table-column>
        <el-table-column
          align="center"
          width="80"
          prop="aisleCode"
          label="通道号">
        </el-table-column>
        <el-table-column
          prop="storageBinName"
          min-width="100"
          label="库位名称">
        </el-table-column>
        <el-table-column
          align="center"
          label="库位类型">
          <template slot-scope="scope">
            <span v-if="scope.row.binType == 1">正品</span>
            <span v-if="scope.row.binType == 2">次品</span>
          </template>
        </el-table-column>
        <el-table-column
          width="83"
          align="center"
          prop="pri"
          label="库位优先级">
        </el-table-column>
        <el-table-column
          width="93"
          align="center"
          prop="minQty"
          label="库位最小容量">
        </el-table-column>
        <el-table-column
          width="93"
          align="center"
          prop="maxQty"
          label="库位最大容量">
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-switch v-if="authorityCode.WMS_STORAGELOCATION_START"  v-model="scope.row.enabledFlag" @click.native="clickStart(scope.row)"></el-switch>
            <el-switch v-else disabled v-model="scope.row.enabledFlag"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          width="115"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="authorityCode.WMS_STORAGELOCATION_AMEND" type="text" @click="editData(scope.row)">修改</el-button>
            <el-button v-if="authorityCode.WMS_STORAGELOCATION_BIND" type="text" @click="bindGoods(scope.row)">绑定商品</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="col-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100,200]"
        :page-size="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
    <!--批量添加库位-->
    <div id="storageEdit1">
      <el-dialog v-dialogDrag
        title="批量添加库位"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible1"
        width="700px">
        <el-form :model="addData" :rules="rules" ref="addData" label-width="100px" class="demo-addData">
          <el-form-item for="example-post2" label="所属仓库：" prop="storageId">
            <el-select   v-model="addData.storageId" placeholder="请选择仓库" style="width: 100%" @change="changeStorage(addData.storageSectionType)">
              <el-option
                v-for="item in store"
                :key="item.storageId"
                :label="item.storageName"
                :value="item.storageId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库区类型：" prop="storageSectionType">
            <el-select v-model="addData.storageSectionType" placeholder="请选择库区类型" style="width: 100%" @change="changeStorage(addData.storageSectionType)">
              <el-option
                v-for="item in storageType"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库区名称：" prop="storageSectionId">
            <el-select v-model="addData.storageSectionId" placeholder="请选择库区名称" style="width: 100%" @change="storageL(100)">
              <el-option
                v-for="item in reservoirName"
                :key="item.storageSectionId"
                :label="item.sectionName"
                :value="item.storageSectionId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通道号：" required style="white-space: nowrap">
            <el-col :span="24">
              <el-form-item prop="aisleCode" style="margin-right: 5px;">
                <el-input  type="number" class="mouse3" onmousewheel="return false;" v-model="addData.aisleCode" @keyup.native="withinNum(1)" @blur="withinNum(1)"></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="4">
              <el-form-item>
                <el-select v-model="addData.channl" @change="storageL(100)">
                  <el-option
                    v-for="item in access1"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>-->
          </el-form-item>
          <el-form-item   label="货架数：" prop="shelfCode">
            <el-input type="number" class="mouse3" onmousewheel="return false;" @keyup.native="withinNum(2)"  @blur="withinNum(2)"  v-model="addData.shelfCode" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item   label="层数：" prop="lay">
            <el-input type="number" class="mouse3" onmousewheel="return false;" @keyup.native="withinNum(3)" @blur="storageL(3)" v-model="addData.lay" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item   label="格子数：" prop="caseId">
            <el-input type="number" class="mouse3" onmousewheel="return false;" @keyup.native="withinNum(4)" @blur="storageL(4)" v-model="addData.caseId" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="示例：">
            <el-input  v-model="addData.storageBinName"  disabled style="width: 100%" placeholder="B12-8-0101"></el-input>
          </el-form-item>
          <el-form-item label="库位类型：" prop="binType">
            <el-select v-model="addData.binType" placeholder="请选择活动区域" style="width: 100%" :disabled="addData.storageSectionType==5">
              <el-option
                v-for="item in storageLocalType"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  style="width: 100%;text-align: right;margin-top: 20px;"><!--添加的保存-->
            <el-button type="primary" @click="submitBatch('addData',1)" :loading="isLoading">预 览</el-button>
            <el-button @click="dialogVisible1=false">取 消</el-button>
            <el-button type="primary" @click="submitBatch('addData',0)" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--添加和编辑库位-->
    <div id="storageEdit">
      <el-dialog v-dialogDrag
        :title="titleName"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="700px">
        <el-form :model="addData" :rules="rules" ref="addData" label-width="100px" class="demo-addData">
          <el-form-item label="所属仓库：" prop="storageId">
            <el-select   v-model="addData.storageId" placeholder="请选择所属仓库" style="width: 93%" @change="changeStorage(addData.storageSectionType)">
              <el-option
                v-for="item in store"
                :key="item.storageName"
                :label="item.storageName"
                :value="item.storageId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库区类型：" prop="storageSectionType">
            <el-select v-model="addData.storageSectionType" placeholder="请选择活动区域" style="width: 93%" @change="changeStorage(addData.storageSectionType)">
              <el-option
                v-for="item in storageType"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库区名称：" prop="storageSectionId">
            <el-select v-model="addData.storageSectionId" placeholder="请选择活动区域" style="width: 93%" @change="storageL(100)" @blur="priorityN">
              <el-option
                v-for="item in reservoirName"
                :key="item.sectionName"
                :label="item.sectionName"
                :value="item.storageSectionId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库位特性：" required style="white-space: nowrap" id="box">
            <el-col :span="5">
              <el-form-item prop="aisleCode" style="margin-right: 5px;">
                <el-input  type="number" class="mouse3" onmousewheel="return false;" v-model="addData.aisleCode" @keyup.native="withinNum(1)" @blur="priorityN(1)" placeholder="通道号"></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="3">
              <el-form-item>
                <el-select v-model="addData.channl">
                  <el-option
                    v-for="item in access"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>-->
            <el-col class="line" :span="1" style="text-align: center">-</el-col>
            <el-col :span="5">
              <el-form-item prop="shelfCode">
                <el-input type="number" class="mouse3" onmousewheel="return false;" v-model="addData.shelfCode" @keyup.native="withinNum(2)" @blur="storageL(2)" placeholder="货架号" ></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1" style="text-align: center">-</el-col>
            <el-col :span="5">
              <el-form-item prop="lay" style="margin-right: 5px;">
                <el-input type="number" class="mouse3" onmousewheel="return false;" v-model="addData.lay" @keyup.native="withinNum(3)" placeholder="层号"  @blur="storageL(3)"></el-input> <!--层号-->
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="caseId">
                <el-input type="number" class="mouse3" onmousewheel="return false;" v-model="addData.caseId" @keyup.native="withinNum(4)" placeholder="格号"  @blur="storageL(4)"></el-input> <!--格号-->
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="示例：">
            <el-input t v-model="addData.storageBinName"  disabled style="width: 93%" placeholder="B12-8-0101"></el-input>
          </el-form-item>
          <el-form-item label="库位类型：" prop="binType">
            <el-select v-model="addData.binType" placeholder="请选择活动区域" style="width: 93%" :disabled="addData.storageSectionType==5">
              <el-option
                v-for="item in storageLocalType"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item   label="库位优先级：" prop="pri">
            <el-input type="number" class="mouse3" onmousewheel="return false;" @keyup.native="withinNum(5)" @blur="withinNum(5)" placeholder="库位优先级"  v-model="addData.pri" style="width: 93%"></el-input>
          </el-form-item>
          <el-form-item v-if="isShow"    label="库位最小容量：" prop="minQty">
            <el-input type="number" class="mouse3" onmousewheel="return false;" @keyup.native="withinNum(6)" v-model="addData.minQty" style="width: 93%"></el-input>
          </el-form-item>
          <el-form-item v-if="isShow"  label="库位最大容量：" prop="maxQty">
            <el-input type="number" class="mouse3" onmousewheel="return false;" @keyup.native="withinNum(7)"   v-model="addData.maxQty" style="width: 93%"></el-input>
          </el-form-item>
          <el-form-item v-if="!isShow" style="width: 100%;text-align: right;margin-top: 20px;"><!--添加的保存-->
            <el-button @click="dialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="submitForm('addData',1)">确 定</el-button>
            <el-button @click="submitForm('addData',2)">确定并继续</el-button>
          </el-form-item>
          <el-form-item v-if="isShow" style="width: 100%;text-align: right;margin-top: 20px;"> <!--编辑的-->
            <el-button @click="dialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="submitFormUpdate('addData')">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--删除库位条数-->
    <div>
      <el-dialog v-dialogDrag
        title="删除"
        :close-on-click-modal="false"
        :visible.sync="dialogVisibleDelete"
        width="800px">
        <div>
          <div class="deleteBox"><i class="el-icon-warning"
                                    style="color:red;margin-right: 5px;"></i>已修改成功{{failedData.total - failedData.failNum}}条，失败{{failedData.failNum}}条
          </div>
          <div class="deleteBox">失败原因：库位已绑定商品，不可进行删除操作</div>
          <div style="margin:30px 0 5px 0"><span>失败订单列表</span>
            <span class="span" @click="unbindGoods(deleteList)">解绑商品</span>
            <span class="span" @click="exportDefeated">导出</span></div>
          <div>
            <el-table
              :data="failedData.failBean"
              :height="500"
              @selection-change="handleSelectionChangeF"
              border
              style="width: 100%">
              <el-table-column
                type="selection"
                align="center"
                width="40">
              </el-table-column>
              <el-table-column
                prop="storageBinName"
                label="库位名称">
              </el-table-column>
              <el-table-column
                prop="goodSName"
                label="已绑定商品">
              </el-table-column>
              <el-table-column
                align="center"
                label="库区类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.storageSectionType == 1">拣货区</span>
                  <span v-if="scope.row.storageSectionType == 2">存货区</span>
                  <span v-if="scope.row.storageSectionType == 3">收货区</span>
                  <span v-if="scope.row.storageSectionType == 4">退货区</span>
                  <span v-if="scope.row.storageSectionType == 5">次品区</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="storageSectionName"
                align="center"
                width="70"
                label="库区名称">
              </el-table-column>
              <el-table-column
                prop="aisleCode"
                width="70"
                align="center"
                label="通道号">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--绑定商品-->
    <div>
      <el-dialog v-dialogDrag
        title="绑定商品"
        :close-on-click-modal="false"
        :visible.sync="dialogCommodity"
        width="800px">
        <div>
          <el-button style="margin: -20px 0 10px 0;" @click="queryGoods">查询商品</el-button>
          <div>
            <el-table
              :data="bindData"
              tooltip-effect="dark"
              :height="500"
              border
              style="width: 100%">
              <el-table-column
                type="index"
                align="center"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="goodsName"
                :show-overflow-tooltip="true"
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="barCode"
                label="条形码">
              </el-table-column>
              <el-table-column
                align="center"
                width="93"
                label="库位最大容量">
                <template slot-scope="scope">
                  <el-input type="number" onmousewheel="return false;" @keyup.native="bindNum(scope.row,scope.$index)" @blur="maxMin(scope.$index)" v-model="scope.row.maxQty"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                width="93"
                align="center"
                label="库位最小容量">
                <template slot-scope="scope">
                  <el-input type="number" onmousewheel="return false;" @keyup.native="bindNum1(scope.row,scope.$index)" @blur="maxMin(scope.$index)" v-model="scope.row.minQty"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="aisleCode"
                width="70"
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="bindOne(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="width: 100%;text-align: right;margin-top: 10px">
          <el-button @click="dialogCommodity=false">取 消</el-button>
          <el-button type="primary" @click="changeCapacity">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--选择商品-->
    <div>
      <el-dialog v-dialogDrag
        title="选择商品"
        :close-on-click-modal="false"
        :visible.sync="selectCommodity"
        width="800px">
        <div>
          <el-row>
            <el-col :span="8"><div class="grid-content bg-purple">
              <label>商品名称：</label>
              <el-input v-model="goodD.goodsName"></el-input>
            </div></el-col>
            <el-col :span="8" :offset="3"><div class="grid-content bg-purple-light">
              <label>条形码：</label>
              <el-input v-model="goodD.barCode"></el-input>
            </div></el-col>
            <el-col :span="3" :offset="1"><div class="grid-content bg-purple">
              <el-button @click="queryG">查 询</el-button>
            </div></el-col>
          </el-row>
          <div>
            <el-table
              :data="goodsList"
              :height="480"
              border
              ref="multipleTable"
              tooltip-effect="dark"
              @selection-change="handleSelectionChangeGoods"
              style="width: 100%">
              <el-table-column
                type="index"
                align="center"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                align="center"
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="goodsName"
                :show-overflow-tooltip="true"
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="barCode"
                label="条形码">
              </el-table-column>
            </el-table>
          </div>
          <div>
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage1"
              :page-sizes="[15, 30, 50, 100,200]"
              :page-size="totalPage1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum1">
            </el-pagination>
          </div>
        </div>
        <div style="width: 100%;text-align: right;margin-top: 10px">
          <el-button @click="selectCommodity=false">取 消</el-button>
          <el-button type="primary" @click="goodsBind()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--导入-->
    <div>
      <el-dialog v-dialogDrag
        title="选择商品"
        :close-on-click-modal="false"
        :visible.sync="visibleLead"
        :before-close="handleClose"
        width="800px">
        <div>
          <ul id="leadUl">
            <li>1.务必按照模板格式导入，点击 <span class="liSpan" @click="downLoad">下载导入模板</span></li>
            <li>2.列名称分别为：库区类型，库区名称，库位名称。其中库区名称必须为英文大写字母，有且只有一个。库位名称必须按照严格的库位显示规则：通道号-货架号-层数格子数的格式书写，层数最大支持两位正整数，不足两位的前边加0补齐格子数最大支持两位正整数，不足两位的前边加0补齐。例如：A12-20-0212</li>
            <li>3.以上列均为必填项</li>
            <li>4.导入文件不符合条件的将导入失败，可手动下载导入失败原因</li>
            <el-form :model="updateForm" :rules="rules" ref="updateForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="上传文件：" prop="fileName">
                <el-input   v-model="updateForm.fileName" placeholder="文件路径" disabled style="width: 60%" ></el-input>
                <el-button @click="fileUpload">选择文件</el-button>
                <input type="file"  ref="fileBtn" style="display: none" @change="fileSelect" />
              </el-form-item>
              <el-form-item label="所属仓库：" prop="storageId1">
                <el-select v-model="updateForm.storageId1"  placeholder="请选择所属仓库" style="width: 78%" >
                  <el-option
                    v-for="item in store"
                    :key="item.storageId"
                    :label="item.storageName"
                    :value="item.storageId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注：">
                <el-input v-model="updateForm.remark" type="textarea" style="width: 78%" :maxlength="100"></el-input>
              </el-form-item>
              <el-form-item style="width:100%;text-align: right">
                <el-button type="primary" @click="updateData('updateForm')">确定导入</el-button>
              </el-form-item>
            </el-form>
          </ul>
        </div>
      </el-dialog>
    </div>
    <!--预览库位-->
    <div>
      <el-dialog v-dialogDrag
        title="预览库位"
        :close-on-click-modal="false"
        :visible.sync="dialogVisibleW"
        width="700px">
        <el-table
          :data="tableData6"
          border
          :height="500  "
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label="行号"
            width="55">
          </el-table-column>
          <el-table-column
            prop="storageBinName"
            label="库位名称">
          </el-table-column>
          <el-table-column
            label="库位优先级">
            <template slot-scope="scope">
              <el-input v-model="scope.row.pri"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="width: 100%;text-align: right;margin-top: 10px">
          <el-button @click="dialogVisibleW=false">取 消</el-button>
          <el-button type="primary" @click="adjustPri1(tableData6)" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--调整库位顺序-->
    <div>
      <el-dialog v-dialogDrag
        title="调整库位顺序"
        :close-on-click-modal="false"
        :visible.sync="dialogVisibleOrder"
        width="700px">
        <el-table
          :data="checkboxLength"
          border
          :height="500"
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label="行号"
            width="55">
          </el-table-column>
          <el-table-column
            prop="storageBinName"
            label="库位名称">
          </el-table-column>
          <el-table-column
            label="库位优先级">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.pri" onmousewheel="return false;" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                        @keyup.native="regData(scope.row)"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="width: 100%;text-align: right;margin-top: 10px">
          <el-button @click="dialogVisibleOrder=false">取 消</el-button>
          <el-button type="primary" @click="adjustPri(checkboxLength)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--导入结果-->
    <div>
      <el-dialog v-dialogDrag
        title="导入结果"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible2"
        width="400px">
        <span style="font-size: 15px;">导入成功0条！失败{{failNum}}条！</span>
        <div @click="downloadF" style="color:#409EFF;cursor: pointer;margin-top: 20px">下载导入失败的订单</div>
        <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
  </span>
      </el-dialog>
    </div>
    <!-- &lt;!&ndash;查看日志&ndash;&gt;-->
    <div>
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
  </div>
</template>
<script>
  import publicLog from '@/components/common/publicLogDialog.vue'
  export  default {
    components: {
      'v-Publiclog': publicLog
    },
    data(){
      return {
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        imgUpload:process.env.FILE_API,//图片URL
        //日志参数
        paramObj: {},
        fullscreenLoading:false,//遮罩
        pulicLogVisible: false,
        version: '1.0.0',//版本号
        isLoading: false, // 预览的加载
        tableData6:[],//库位数据
        dialogVisibleOrder: false, // 调整库位顺序
        dialogVisibleW: false, // 预览车位
        visibleLead: false, // 导入
        selectCommodity: false, // 选择商品
        dialogCommodity: false, // 绑定商品
        failedData: [], // 删除失败的数据
        checkboxLength: '', // 选中的数据
        isShow: false, // 添加和编辑的区别
        dialogVisibleDelete: false, // 删除
        titleName: '添加库位',
        addData:{ // insert数据
          storageId: '', //仓库id
          storageSectionId: '',//库区ID
          storageSectionName: '',//库区名称
          binType: 1,//库位类型【正/残】
          storageBinName: '',//库位名称
          shelfCode: '',//货架
          aisleCode: '',//通道
          pri: '',//库位优先级
          storageSectionType: 1,// 库区类型
          lay: '',// 层号
          //channl: '1', //下拉
          caseId: '',// 格号
          remark: '',//库位说明
          putawayFlag: '',//是否可上架
          binStatus: '',//库位状态
          goodsSetupId: '',//商品设置id
          maxQty: 50,//库位最大容量
          minQty: 0,//库位最小容量
          inQty: '',//入库数量
          outQty: '',//出库数量
          batchId: '',//批次号id
          batchNo: '',//批次号
          enabledFlagenabledFlag: true//是否启用
        },
        rules: { //表单验证
          storageId: [
            { required: true, message: '请选择所属仓库',trigger: 'blur'},
          ],
          storageSectionId: [
            { required: true,message: '请选择库区名称',trigger: 'blur'}
          ],
          binType: [
            {required: true}
          ],
          storageSectionType: [
            { required: true}
          ],
          lay: [
            { required: true,message: '请输入层数', trigger: 'blur'}
          ],
          caseId: [
            { required: true,message: '请输入格数', trigger: 'blur'}
          ],
          shelfCode: [
            { required: true,message: '请输入货架数', trigger: 'blur'}
          ],
          aisleCode: [
            { required: true,message: '请输入通道号', trigger: 'blur'}
          ],
          pri: [
            { required: true, message: '请输入优先级', trigger: 'blur' }
          ],
          maxQty: [
            { required: true, message: '请输入库位最大容量', trigger: 'blur' }
          ],
          minQty: [
            { required: true, message: '请输入库位最小容量', trigger: 'blur' }
          ],
          fileName: [
            { required: true, message: '请选择上传文件', trigger: 'blur'},
          ],
          storageId1: [
            { required: true, message: '请选择所属仓库', trigger: 'blur'},
          ]
        },
        fileId: '', // 失败的ID
        failNum: '', // 失败的条数
        updateForm: {
          fileId: '', //文件id
          fileName: '',//文件名称
          storageId: '',//仓库id
          storageId1: '',
          remark: ''//备注
        },
        uploadFile: '', // 上传的文件
        access:[ // 通道号
          {id:'1',name: 'L'},
          {id:'2',name: 'R'}
        ],
        access1:[ // 通道号
          {id:'0',name: '全部'},
          {id:'1',name: 'L'},
          {id:'2',name: 'R'}
        ],
        storageLocalType:[//库位类型
          {id:1,name: '正品'},
          {id:2,name: '次品'}
        ],
        dialogVisible: false, // 添加库区
        dialogVisible1: false,//编辑库区
        dialogVisible2: false, // 导入结果
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 数据总条数
        totalNum1: 0, // 数据总条数
        totalPage1: 15, // 要显示的条数
        currentPage1: 1, //
        table_h: 0, // 高度
        queryStore: () => {}, // 所属仓库
        query: () => {}, // 库区方法
        queryList: () => {}, // 查询数据列表
        bindG: () => {}, // 绑定商品列表
        queryG: () => {}, // 查询商品
        queryFind: () => {},
        goodsList: [], // 商品列表
        goodsId: [], // 选中的商品列表
        goodD: { // 查询商品列表参数
          goodsCode: '',//商品编码
          barCode: '', // 商品条形码
          goodsName: '', // 商品名称
          page: 1, // 页数。
          size: 15, // 页面大小
        },
        deleteList: '', // 删除失败列表的checkbox
        storageId: '', // 库位ID
        reservoirName:[], //库区名称
        reservoirName1: [],//库区名称
       /* repulse1:[//
          {id: 1, label: '待客审'},
          {id: 2, label: '已客审'},
          {id: 3, label: '已仓审'},
          {id: 4, label: '已分配拣货位'},
          {id: 5, label: '已验货'}
        ],*/
        //{id:'',name: '全部'},
        storageType:[ // 库区类型
          {id:1,name: '拣货区'},
          {id:2,name: '存货区'},
          {id:3,name: '收货区'},
          {id:4,name: '退货区'},
          {id:5,name: '次品区'}
        ],
       /* warehouseType: [//
          {id: 1, label: '验货异常'},
          {id: 2, label: '称重异常'},
          {id: 3, label: '发货异常'}
        ],*/
        store: [], // 所属仓库
        tableData: [],//表格数据
        bindData: [], // 库位绑定的商品
        queryD: { // 模糊查询参数
          storageBinName: '',//库位名称
          storageId: '',//所属仓库
          sectionType: 1,//库区类型
          aisleCode: '',//通道号
          binType: '',//库位类型
          pri: '',//库位优先级
          page: 1,
          size: 15,
        },
        dog: 0 //看门狗
      }
    },
    methods:{
      // 打印库位名称
      printLocal() {
        if(this.checkboxLength.length == 0) { // 判断是否选中要删除的库位
          this.$message({
            message:'请选择要打印的库位',
            type: 'warning'
          });
          return false
        }
          let str = '';
        this.checkboxLength.forEach( (item,index) => {
          str += item.storageBinId + ',';
        });
        let data = {
          ids:str.slice(0, -1),
          modelkey: 9,
          stype:'SVoucher',
          cltoken: sessionStorage.getItem('clToken')
        };
        $.ajax({
          type: "post",
          url: "http://127.0.0.1:8082/preview",
          data: data,
          success: function(data){
          }
        });
          //const token=sessionStorage.getItem('clToken');
         /* let data={
            ids:arrOne.slice(0, -1),
            modelkey:5,
            stype:'SVoucher',
            cltoken:token
          }
          $.ajax({
            type: "post",
            url: "http://127.0.0.1:8082/preview",
            data: data,
            success: function(data){
            }
          });*/
      },
      // 下拉失败的导入
      downloadF() {
        location.href = 'http://'+ this.imgUpload+'/files-web/download/' + this.fileId;
      },
      // 根据通道号推荐优先级
      priorityN(num) {
        this.storageL(num);
        if(this.addData.aisleCode && this.addData.storageSectionId){
          this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/recommendPri',{aisle: this.addData.aisleCode,storageSectionId: this.addData.storageSectionId})
            .then(res => {
              if(res.data.success == true){
                this.addData.pri =  res.data.result;
              }
            })
        }else{
          this.addData.pri = '';
          console.log(123);
        }
      },
      // 点击查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 15;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true;
      },
      // 查看日志
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      // 查询区域所属仓库库区类型联动库区名称
      changeName() {
        if(this.queryD.storageId == ''){
          this.$nextTick(() => {
            this.reservoirName1 = [];
            $('#example-post1').multiselect('dataprovider', this.reservoirName1);
          })
          return false;
        }
        // 所属仓库
        //this.queryD.storageId = $('#example-post').val();
        this.queryFind(this.queryD.sectionType,this.queryD.storageId); // 库区类型，所属仓库
      },
      // 库位调整优先级1-9999
      regData(row){
        if(row.pri > 9999){
          row.pri = row.pri.slice(0,4)
        }
      },
      // 绑定商品 库位最大最小容量
      maxMin(index) {
        if(this.bindData[index].maxQty && this.bindData[index].minQty){
          if(this.bindData[index].maxQty*1 < this.bindData[index].minQty*1){
            this.$message({
              message: '最小容量不能大于最大容量',
              type: 'warning'
            });
          }
        }
      },
      // 调整绑定商品的最大最小容量
      changeCapacity() {
        for(let item of this.bindData){
          if(item.maxQty*1 < item.minQty*1){
            this.$message({
              message: '最小容量不能大于最大容量',
              type: 'warning'
            });
            return false;
          }
          if(item.maxQty == '' || item.maxQty == undefined){
            this.$message({
              message: '库位最大容量不能为空',
              type: 'warning'
            })
            return false;
          }
          if(item.minQty == '' || item.minQty == undefined){
            this.$message({
              message: '库位最小容量不能为空',
              type: 'warning'
            })
            return false;
          }
        }
        let GoodsBeanJson = [];
        this.bindData.forEach(item => {
          console.log(item);
          GoodsBeanJson.push({goodsId: item.goodsId,maxQty: item.maxQty,minQty: item.minQty})
        });
        GoodsBeanJson = JSON.stringify(GoodsBeanJson);
      this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/insertGoods',{storageBinId: this.storageId.storageBinId,GoodsBeanJson: GoodsBeanJson})
        .then( (res) => {
          if (res.data.success == true) {
            this.$message({// 给用户一个提示
              message: '操作成功',
              type: 'success'
            });
            this.dialogCommodity = false;
            // this.bindG(this.storageId);
          } else{
            this.$message({
              message: res.data.msg,// 如果code为其他，弹出错误码
              type: 'warning'
            })
          }
        })
      },
      // 校验1-99 绑定商品的库位最大容量
      bindNum(row,index) {
        if(row.maxQty < 1 || row.maxQty > 9999 || !/^\d+$/.test(row.maxQty)){
            row.maxQty = '';
           }

      },
      // 校验1-99 绑定商品的库位最小容量
      bindNum1(row,index) {
        if(row.minQty < 1 || row.minQty > 9999 || !/^\d+$/.test(row.minQty)){
          row.minQty = '';
        }
      },
      // 绑定商品里的删除
      bindOne(index) {
        this.bindData.splice(index,1);
      },
      // 调整优先级的调整预览的确定
      adjustPri1(rows) {
        for(let item of rows){
          if(item.pri == ''){
            this.$message({
              message: '优先级不能为空',
              type: 'warning'
            });
            return false
          }
        }
        for (var i = 0; i < rows.length; i++) {
          for (var j = 0; j < rows.length; j++) {
            if(i != j){
              if(rows[i].storageSectionName == rows[j].storageSectionName &&  rows[i].aisleCode == rows[j].aisleCode && rows[i].pri == rows[j].pri){
                this.$message({
                  message: '同一库区同一通道号不允许有相同优先级',
                  type: 'warning'
                });
                return false;
              }
            }
          }
        }
        const loading = this.$loading({
          lock: true,
          text: '请稍候...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/batchBeanInsert',{batchBeanJson: JSON.stringify(rows)})
          .then((res) => {
            if(res.data.success == true){
              loading.close();
              this.$message({
                message: '批量添加成功',
                type: 'success'
              });
              this.dialogVisibleW = false;
              this.dialogVisible1 = false;
              this.queryList();
            }else{
              loading.close();
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 调整优先级的调整
      adjustPri(rows) {
        for(let item of rows){
          if(item.pri == ''){
            this.$message({
              message: '优先级不能为空',
              type: 'warning'
            });
            return false
          }
        }
        for (var i = 0; i < rows.length; i++) {
          for (var j = 0; j < rows.length; j++) {
            if(i != j){
              if(rows[i].storageSectionName == rows[j].storageSectionName &&  rows[i].aisleCode == rows[j].aisleCode && rows[i].pri == rows[j].pri){
                this.$message({
                  message: '同一库区同一通道号不允许有相同优先级',
                  type: 'warning'
                });
                return false;
              }
            }
          }
        }
        let binPriJson = [];
        rows.forEach((item) => {
          binPriJson.push({binId: item.storageBinId,pri: item.pri})
        });
        binPriJson = JSON.stringify(binPriJson);
        this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/updatePri',{binPriJson: binPriJson})
          .then((res) => {
              if(res.data.success == true){
                this.$message({
                  message: '调整优先级成功',
                  type: 'success'
                });
                this.dialogVisibleOrder = false;
                this.queryList();
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
          })
      },
      // 重置按钮
      resetData() {
       /* let arr1 = [];
        this.store.forEach(item => {
          arr1.push(item.storageId)
        });
        $('#example-post').multiselect('select',arr1); // 重置所属仓库*/
        let arr = [];
        this.reservoirName1.forEach(item => {
          arr.push(item.storageSectionId);
        });
        $('#example-post1').multiselect('select',arr); // 重置库区名称
        this.queryD.storageBinName = '';
        this.queryD.storageId = '';
        this.queryD.sectionType = 1;
        this.queryD.aisleCode = '';
        this.queryD.binType = '';
        this.queryD.pri = '';
      },
      // 点击调整库位顺序
      storeOrder() {
        if(this.checkboxLength.length == 0) { // 判断是否选中要删除的库位
          this.$message({
            message:'请选择要调整的库位',
            type: 'warning'
          })
          return false;
        }
        for (var i = 0; i <  this.checkboxLength.length; i++) {
          for (var j = 0; j < this.checkboxLength.length; j++) {
            if(i != j){
              if(this.checkboxLength[i].storageId != this.checkboxLength[j].storageId){
                this.$message({
                  message:'勾选的库位属于不同的仓库，请重新选择相同仓库的库位！',
                  type: 'warning'
                })
                return;
              }
            }
          }
        }

          this.dialogVisibleOrder = true;
      },
      // 下载导入模板
      downLoad() {
        location.href = 'http://'+ this.imgUpload+'/files-web/download/2833';
      },
      // 删除库位失败解绑商品按钮
      unbindGoods(rows) {
        if(rows.length == 0){
          this.$message({
            message: '请选择要解绑商品的库位',
            type: 'warning'
          })
          return false;
        }
        let binGoodsSetupBean = [];
        rows.forEach(item => {
          binGoodsSetupBean.push({storageBinId: item.storageBinId,goodsId: item.goodsId})
        });
        binGoodsSetupBean = JSON.stringify(binGoodsSetupBean);
        this._post('com.edb01.erp.wms.service.api.WmStorageBinGoodsSetupService/' + this.version + '/delete', { binGoodsSetupBean: binGoodsSetupBean })
          .then((res) => {
              if(res.data.success == true){
                  this.$message({
                    message: '解绑成功',
                    type: 'success'
                  });
                  this.dialogVisibleDelete = false;
                  this.queryList()
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
          })
      },
      // 删除库位失败导出按钮
      exportDefeated() {
        if(this.deleteList.length == 0){
          this.$message({
            message: '请选择要导出的库位',
            type: 'warning'
          })
          return false;
        }
        let deleteFailJson = [];
        this.deleteList.forEach(item => {
          deleteFailJson.push({storageBinName: item.storageBinName,bindGoodsName: item.goodSName,storageSectionType: item.storageSectionType,storageSectionName: item.storageSectionName})/*,channel: item.channl*/
        });
        deleteFailJson = JSON.stringify(deleteFailJson);
        this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/expExcel',{deleteFailJson: deleteFailJson})
          .then((res) => {
              if(res.data.success == true){
                location.href = 'http://'+this.imgUpload+'/files-web/download/'+ res.data.result;
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
          })
      },
      // 点击导入按钮
      importTemplate() {
        this.visibleLead = true;
        this.updateForm.fileId = '';
        this.updateForm.fileName = '';
        this.updateForm.storageId = '';
        this.updateForm.storageId1 = '';
        this.updateForm.remark = '';
        this.uploadFile = '';

        let timer = setTimeout(() => {
          this.$refs.updateForm.resetFields();
        },100)
      },
      // 点击确定上传文件
      updateData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
//            this.updateForm.storageId = this.updateForm.storageId1
            let formData = new FormData();
            formData.append('filedata', this.uploadFile);
            this.$axios({
              method: 'post',
              url: 'http://'+ this.imgUpload+'/files-web/upload',
              data: formData
            })
              .then((res) => {
                if (res.data.resourcesId) {
                  this.updateForm.fileId = res.data.resourcesId;
                  this.updateForm.storageId = this.updateForm.storageId1;
                  // console.log(this.updateForm);
                  this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/batchImport',this.updateForm)
                    .then((res) => {
                      if(res.data.success == true){
                        if(res.data.result.failNum == 0){
                          this.$message({
                            message: '导入成功'+ res.data.result.successNum + '条',
                            type: 'success'
                          });
                        }else if(res.data.result.failNum == 0 && res.data.result.successNum == 0){
                          this.$message({
                            message: res.data.result.errorMessage,
                            type: 'warning'
                          })
                        } else{
                          if(res.data.result.errorMessage){
                            this.$alert('导入成功'+ res.data.result.successNum + '条,失败' + res.data.result.failNum + '条!失败原因：' + res.data.result.errorMessage, '导入结果', {
                              confirmButtonText: '确定',
                              center: true
                            });
                          }else{
                            this.dialogVisible2 = true;
                            this.fileId = res.data.result.fileId;
                            this.failNum = res.data.result.failNum;

                          }
                        }
                        this.visibleLead = false;
                      }else{
                        this.$message({
                          message: res.data.msg,
                          type: 'warning'
                        })
                      }
                    })
                }
              })
          }else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 弹框关闭时置为空
      handleClose(done) {
        this.$refs.fileBtn.value='';
        this.uploadFile = '';
        done();
      },
      //文件选择函数
      fileSelect(e) {
        console.log(123,e.target.files);
        this.uploadFile = "";
        this.updateForm.fileName = e.target.files[0].name;
        if (e.target.files[0].name.indexOf(".xls") > 0 || e.target.files[0].name.indexOf(".xlsx") > 0 || e.target.files[0].name.indexOf(".csv") > 0) {
          this.uploadFile = e.target.files[0];
          // console.log(this.uploadFile);
        } else {
          this.$message({
            message: '只支持excel文件上传(.xls、.xlsx、csv)',
            type: 'warning'
          });
        }
      },
      // 点击选择文件
      fileUpload() {
        this.$refs.fileBtn.click();
      },
      // 库位商品绑定接口
      goodsBind() {
        if(this.bindData.length == 0){ // 如果当前没有绑定商品不需要过滤
          this.goodsId.forEach(item => {
            this.bindData.push(item);
          });
        }else{
          if(this.goodsId.length == 0){ // 如果当前没有选中商品不需要过滤

          }else{
            this.bindData.forEach(item => {
              this.goodsId.forEach((item1,index) => { // 过滤
                if(item.goodsId == item1.goodsId){
                  this.goodsId.splice(index,1);
                }
              })
            })
            if(this.goodsId.length == 0){ // 如果过滤完没有不需要push

            }else{
              this.goodsId.forEach(item => { // push
                this.bindData.push(item);
              });
            }
          }
        }


        this.selectCommodity = false;
       /* let GoodsBeanJson = [];
        this.goodsId.forEach(item => {
          GoodsBeanJson.push({storageBinId: this.storageId.storageBinId,goodsId: item.goodsId})
        });
        GoodsBeanJson = JSON.stringify(GoodsBeanJson);
        this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/insertGoods',{GoodsBeanJson: GoodsBeanJson})
          .then( (res) => {
            if (res.data.success == true) {
              this.$message({// 给用户一个提示
                message: '绑定成功',
                type: 'success'
              })
              this.selectCommodity = false;
              this.bindG(this.storageId);
            } else{
              row.enabledFlag = true;
              this.$message({
                message: res.data.msg,// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })*/
      },
      // 查询商品
      queryGoods() {
        this.queryG();
        this.selectCommodity = true;
        // 回显已绑定的商品
        var arr = [];
        var trimer = setTimeout(() => {// 必须等页面渲染出来再去回显
          // 把绑定商品索引保存起来
          this.bindData.forEach((item) => {
            this.goodsList.forEach((item1,index) => {
              if(item.goodsId == item1.goodsId){
                arr.push(index);
              }
            })
          })
          if(arr){
            arr.forEach(item => {
              this.$refs.multipleTable.toggleRowSelection(this.goodsList[item],true)
            })
          }else{
            self.$refs.multipleTable.clearSelection();
          }

        },100)
      },
      // 库位绑定的商品
      bindGoods(row) {
        console.log(row);
        this.bindG(row);
        this.storageId = row;
        this.dialogCommodity = true;
      },
      // 点击启用  // 停用
      clickStart(row) {
        let self = this
        if (row.enabledFlag === false) {
          self.clickStop(row)
        } else {
          /*elf.$confirm('是否启用该库位?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {*/
            self._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + self.version + '/activate',{storageBinId: row.storageBinId})
              .then(function (res) {
                if (res.data.success == true) {
                  self.$message({// 给用户一个提示
                    message: '已启用',
                    type: 'success'
                  });
                  self.queryList()// 重新渲染数据
                } else {
                  row.enabledFlag = false;
                  self.$message({
                    message: res.data.msg,// 如果code为其他，弹出错误码
                    type: 'warning'
                  })
                }
              })
              .catch(function (err) {
                console.log(err)
              })
          /*}).catch(() => {
            row.enabledFlag = false;
            self.$message({
              type: 'info',
              message: '已取消启用'
            })
          })*/
        }
      },
      // 点击停用
      clickStop(row) {
        /*this.$confirm('是否停用该库位?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {*/
          // 发请求
          this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/deactivate',{storageBinId: row.storageBinId})
            .then( (res) => {
              if (res.data.success == true) {
                this.$message({// 给用户一个提示
                  message: '已停用',
                  type: 'success'
                })
                this.queryList()// 重新渲染数据
              } else{
                row.enabledFlag = true;
                this.$message({
                  message: res.data.msg,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
            /*}).catch(() => {
            row.enabledFlag = true;
            this.$message({
              type: 'info',
              message: '已取消启用'
            })
          })*/
        })
      },
      // 选择商品触发
      handleSelectionChangeGoods(val) {
        this.goodsId = val;
        console.log(val);
      },
      // 删除错误list触发
      handleSelectionChangeF(val){
        this.deleteList = val
        console.log(val);
      },
      // 点击删除批量删除库位
      clickDelete() {
        //console.log(this.checkboxLength);
        if(this.checkboxLength.length == 0) { // 判断是否选中要删除的库位
          this.$message({
            message:'请选择要删除的库位',
            type: 'warning'
          })
          return false
        }
        this.$confirm('是否删除选中的库位','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          let str = '';
          let strName = '';
          for(let item of this.checkboxLength){ // 库位ID，用逗号隔开
            str += item.storageBinId + ','
          }
          for(let item of this.checkboxLength){ // 库位名称，用逗号隔开
            strName += item.storageBinName + ','
          }
          this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/delete', {storageBinId: str.slice(0,-1),storageBinName:strName.slice(0,-1)})
            .then((res) => {
              if(res.data.success == true){
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.queryList() // 重新渲染数据
              }else if(res.data.code == 270000006){
                  this.failedData = res.data.result;
                  this.dialogVisibleDelete = true;
                  if(this.failedData.total - this.failedData.failNum >0){ // 有删除成功的也重新渲染
                    this.queryList() // 重新渲染数据
                  }
              }else if(res.data.code == 270000005){
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            })
        }).catch(() => {
          self.$message({//  取消删除提示
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      // 批量添加库位
      batchAdd(formName) {
          this.isLoading = false;
        //this.query(1,'');
        this.emptyData();
        if(!this.isLoading) {
          this.dialogVisible1 = true;
          if(this.dialogVisible1){
            setTimeout(() => {
              this.$refs[formName].resetFields();
            },500)
          }
        }

      },
      // 点击编辑页面
      editData(row){
        this.titleName = '修改库位';
        this.isShow = true;
        this.dialogVisible = true;
        this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/findById',{storageBinId: row.storageBinId})
          .then((res) => {
             if(res.data.success == true){
               this.addData =  res.data.result;
               this.query(this.addData.storageSectionType,this.addData.storageId)
             }
          })
      },
      // 点击新增按钮
      clickAdd(formName) {
        this.dialogVisible = true;
        this.emptyData(); // 重置数据
        // this.query(1,'');
        this.titleName = '添加库位';
        this.isShow = false;
        this.reservoirName = [];
        if(this.dialogVisible){
          setTimeout(() => {
            this.$refs[formName].resetFields();
            console.log(123);
          },500)
        }


      },
      // 重置数据
      emptyData() {
        this.addData.storageId = ''; //仓库id
        this.addData.storageSectionId = '';//库区名称
        this.addData.binType = 1;//库位类型【正/残】
        this.addData.storageBinName = '';//库位名称
        this.addData.storageSectionName = '';
        this.addData.shelfCode = '';//货架
        this.addData.aisleCode = '';//通道
        this.addData.pri = '';//库位优先级
        this.addData.storageSectionType = 1;// 库区类型
        this.addData.lay = '';// 层号
        /*this.addData.channl = '1';//下拉*/
        this.addData.caseId = '';// 格号
      },
      // 校验1-99
      withinNum(val) {
        if(val == 1){
          this.storageL(val);
          if(this.addData.aisleCode < 1 || this.addData.aisleCode > 99 || !/^\d+$/.test(this.addData.aisleCode)){
           this.addData.aisleCode = '';
         }
        }else if(val == 2){
          this.storageL(val);
          if(this.addData.shelfCode < 1 || this.addData.shelfCode > 99 || !/^\d+$/.test(this.addData.shelfCode)){
            this.addData.shelfCode = '';
          }
        }else if(val == 3){
          if(this.addData.lay < 1 || this.addData.lay > 99 || !/^\d+$/.test(this.addData.lay)){
            this.addData.lay = '';
          }
        }else if(val == 4){
          if(this.addData.caseId < 1 || this.addData.caseId > 99 || !/^\d+$/.test(this.addData.caseId)){
            this.addData.caseId = '';
          }
        }else if(val == 5){
          if(this.addData.pri < 1 || this.addData.pri > 9999 || !/^\d+$/.test(this.addData.pri)){
            this.addData.pri = '';
          }
        }else if(val == 6){
          if(this.addData.minQty < 1 || this.addData.minQty > 9999 || !/^\d+$/.test(this.addData.minQty)){
            this.addData.minQty = '';
          }
        }else if(val == 7){
          if(this.addData.maxQty < 0 || this.addData.maxQty > 9999 || !/^\d+$/.test(this.addData.maxQty)){
            this.addData.maxQty = '';
          }
        }
      },
      // 取同一通道号的库位最大优先级
      priMax() {
        let arr = [];
        for(var item of  this.tableData){
          if(this.addData.aisleCode == item.aisleCode){ // 同一通道号里取库位最大优先级
            arr.push(item.pri);
          }
        }
        if(arr.length == 0){ // 如果没有相同通道号，择从1开始
          this.addData.pri = 1
        }else{
          this.addData.pri = Math.max.apply(Math,arr) + 1 // 否则取最大优先级加1
        }
      },
      // 库位名称
      storageL(val) {
        if(val == 1){
          if(this.addData.aisleCode < 0){
            this.addData.aisleCode = '';

          }else{
            if(this.addData.aisleCode.length == 1){
              //this.addData.aisleCode = 0 + this.addData.aisleCode;
            }else if(this.addData.aisleCode.length == 3){ // 如果前面补零后用户又输入截图最后一位
              this.addData.aisleCode = this.addData.aisleCode.slice(0,2);
            }
          }

         /* if(this.addData.aisleCode){ // 有值的时候去跑逻辑
            this.priMax(); //取同一通道号的库位最大优先级
          }*/
        }else if(val == 2){
          if(this.addData.shelfCode < 0){
            this.addData.shelfCode = '';
          }else{
            if(this.addData.shelfCode.length == 1){
              //this.addData.shelfCode =0 + this.addData.shelfCode;
            }else if(this.addData.shelfCode.length == 3){
              this.addData.shelfCode = this.addData.shelfCode.slice(0,2);
            }
          }

        }else if(val == 3){
          if(this.addData.lay < 0){
            this.addData.lay = '';
          }else{
            if(this.addData.lay.length == 1){
              this.addData.lay = 0 + this.addData.lay;
            }else if(this.addData.lay.length == 3){
              this.addData.lay = this.addData.lay.slice(0,2);
            }
          }

        }else if(val == 4){
          if(this.addData.caseId < 0){
            this.addData.caseId = '';
          }else{
            if(this.addData.caseId.length == 1){
              this.addData.caseId = 0 + this.addData.caseId;
            }else if(this.addData.caseId.length == 3){
              this.addData.caseId = this.addData.caseId.slice(0,2);
            }
          }

        }
        //
          let a = '';
        for(var item of this.reservoirName){
            if(this.addData.storageSectionId == item.storageSectionId){
            this.addData.storageSectionName = item.sectionName
            }
          }
         /* if(this.addData.channl == 1){
            a = 'L';
          }else if(this.addData.channl == 2){
            a = 'R';
          } else {
            a = 'A'
          }*/
            this.addData.storageBinName =  this.addData.storageSectionName  + this.addData.aisleCode + '-' + this.addData.shelfCode + '-' + this.addData.lay + this.addData.caseId;
      },
      // 库区类型改变库区名称不同
      changeStorage(val) {
        if(val == 5){ // 次品区改变库位类型为次品
          this.addData.binType = 2;
        }
        if(this.addData.storageId == ''){
          return false;
        }

        //console.log(this.addData.storageId,888);
        this.addData.storageSectionId = '';
        this.query(val,this.addData.storageId)
      },
      // 单条添加库位
      submitForm(formName,num) {
         //var arr = [4,8,5,98,545,3285];
         //var num = Math.max.apply(Math,arr);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/insert',this.addData)
              .then((res) => {
                  if(res.data.success == true){
                    if(num == 2){
                      this.$refs[formName].resetFields();
                    }else{
                      this.dialogVisible = false;
                    }
                    this.queryList(); // 重新渲染
                    this.$message({
                      message: '新增成功',
                      type: 'success'
                    })
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
      // 批量添加的预览按钮
      submitBatch(formName,num) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isLoading = true; // 按钮加载状态
            // this.addData.storageSectionId
            this.reservoirName.forEach(item => {
              if(this.addData.storageSectionId == item.storageSectionId) {
                this.addData.storageSectionName = item.sectionName;
              }
            });
            this.addData.handle = num;
            if(num == 0){
              const loading = this.$loading({
                lock: true,
                text: '请稍候...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/batchInsert',this.addData)
                .then((res) => {
                  if(res.data.success == true){
                      loading.close();
                      this.dialogVisible1 = false;
                      this.queryList(); // 重新渲染
                      this.$message({
                        message: '批量添加成功',
                        type: 'success'
                      })

                  }else{
                    loading.close();
                    this.isLoading = false;
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    })
                  }
                })
            } else if(num == 1) {
              this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/batchInsert',this.addData)
                .then((res) => {
                  if(res.data.success == true){
                    //this.queryList(); // 重新渲染
                    this.dialogVisibleW = true;
                    this.tableData6 = res.data.result;
                    /* var timer = setTimeout(() => {
                       this.dialogVisible1 = false;
                     },1000);*/
                    this.isLoading = false;

                  }else{
                    this.isLoading = false;
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


          }
        });
      },
      // 编辑库位的保存
      submitFormUpdate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.addData.minQty *1 > this.addData.maxQty *1){
              this.addData.minQty = '';
              this.$message({
                message: '最小库存容量不能大于最大库存容量',
                type: 'warning'
              })
              return false
            }
            if(this.addData.maxQty *1 < this.addData.minQty *1){
              this.addData.maxQty = '';
              this.$message({
                message: '最大库存容量不能小于最小库存容量',
                type: 'warning'
              })
              return false
            }
            this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/update',this.addData)
              .then((res) => {
                if(res.data.success == true){
                  this.dialogVisible = false;
                  this.queryList(); // 重新渲染
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
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
      resetForm(formName) {
        this.submitForm(formName);
        //this.$refs[formName].resetFields();
      },
      // 点击查询
      refer() { //
        // 库区名称
          this.queryD.storageSectionId = $('#example-post1').val();
        // 所属仓库
          //this.queryD.storageId = $('#example-post').val();
        //console.log(this.queryD,99999);
        this.queryList()
      },
      // 通道号和优先级的范围
      rangeNum(num) {
        if(num == 1){ // 通道号
          if(this.queryD.aisleCode < 1 || this.queryD.aisleCode > 99 || !/^\d+$/.test(this.queryD.aisleCode) ){
            this.queryD.aisleCode = '';
          }
        }else if(num == 2){ // 优先级
          if(this.queryD.pri < 1 || this.queryD.pri > 9999 || !/^\d+$/.test(this.queryD.pri)){
            this.queryD.pri = '';
          }
        }
      },
      // 点击表格复现框触发的方法
      handleSelectionChange(val) {
        console.log(val);
        this.checkboxLength = val;
      },
      //  分页
      //  每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        sessionStorage.setItem('hold_storageLocation_1', val);
        this.queryD.page = this.currentPage;
        this.queryD.size = this.totalPage;
        this.queryList();// 请求数据
      },
      //  当前页
      handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val;
        this.queryD.page = this.currentPage;
        this.queryD.size = this.totalPage;

        this.queryList();// 请求数据
      },
      //  分页
      //  每页多少条
      handleSizeChange1(val) {
        this.totalPage1 = val;
        this.goodD.page = this.currentPage1;
        this.goodD.size = this.totalPage1;
        this.queryG();// 请求数据
      },
      //  当前页
      handleCurrentChange1(val) {
        console.log(val);
        this.currentPage1 = val;
        this.goodD.page = this.currentPage1;
        this.goodD.size = this.totalPage1;
        this.queryG();// 请求数据
      },
    },
    created() {
      this.queryFind = (type,par) => {
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/findByType',{sectionType: type ,storageId: par})
          .then((res) => {
            if (res.data.success == true) {
              this.reservoirName1 = res.data.result;
              var value = [];
              for (var item of this.reservoirName1){
                item.value = item.storageSectionId;
                item.label = item.sectionName;
                value.push(item.storageSectionId);
              }
              //console.log(self.plat);
              $('#example-post1').multiselect('dataprovider', this.reservoirName1);
              $('#example-post1').multiselect('select',value);

              this.queryD.storageSectionId = $('#example-post1').val();
              //console.log($('#example-post1').val(),89898989);
               this.queryList();
            }
          });
      };
      // 所有商品的列表
      this.queryG = () => {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsAndSuitByCondition',this.goodD)
          .then((res) => {
            if(res.data.success == true){
              this.goodsList = res.data.result.rows;
              this.totalNum1 = res.data.result.total;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })

      };
      // 绑定商品的列表
     this.bindG = (row) => {
       this._post('com.edb01.erp.wms.service.api.WmStorageBinGoodsSetupService/' + this.version + '/findByBinId',{binId: row.storageBinId})
         .then((res) => {
           if(res.data.success == true){
             this.bindData = res.data.result;
           }else{
             this.$message({
               message: res.data.msg,
               type: 'warning'
             })
           }
         })
     };
      // 所属仓库列表
      this.queryStore = () => {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth',{storageType: 1})
          .then((res) => {
            if (res.data.success == true) {
              this.store = res.data.result;
              let value = [];
              let str = '';
              for (let item of this.store){
                str += item.storageId + ',';
                item.value = item.storageId;
                item.label = item.storageName;
                value.push(item.storageId)
              }
              this.queryFind(1,str.slice(0,-1));
              //console.log(self.plat);
              $('#example-post').multiselect('dataprovider', this.store );
              $('#example-post').multiselect('select',value);
            }
          })
      };
      this.queryStore();
      // 库区名称列表
      this.query = (val,store) => {
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/findByType',{sectionType: val ,storageId: store})
          .then((res) => {
            if (res.data.success == true) {
              this.reservoirName = res.data.result;
            }
          })
      };
      // 库位名称接口
      this.queryList = () => {
        this._post('com.edb01.erp.wms.service.api.WmStorageBinService/' + this.version + '/query',this.queryD)
          .then((res) => {
          if(res.data.success == true){
            let result = res.data.result;
            this.tableData = result.rows;
            this.totalNum = result.total;
            this.dog = 0;
          }
          })
      };
    },
    mounted() {
      // 禁止火狐浏览器滚轮滑动
      $(".mouse3")[0].addEventListener('DOMMouseScroll', MouseWheel, false);
      function MouseWheel(event) {
        event = event || window.event;
        event.preventDefault();
      }
      //渲染表格高度
      this.$nextTick(function() {
        this.table_h = $(window).height() - $('.col-border').offset().top - 95;
      });
      window.onresize = () => {
        this.table_h = $(window).height() - $('.col-border').offset().top - 95;
      };
      $('#example-post1').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      let self = this;
      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
        //下拉框关闭回调函数
        onDropdownHide: function (event) {
          self.changeName();
        },
      });

    }
  }
</script>
<style scoped>
  .styleColor,.el-input__inner{
    border: 1px solid red!important;
    border-radius: 4px;
  }
  .deleteBox{
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
  }
  .span{
    margin-left: 20px;
    color: #409EFF;
    cursor: pointer;
  }
  #leadUl li{
    color: #FF0000;
    font-size: 14px;
    margin-bottom: 20px;
    padding-left: 17px;
  }
  .liSpan{
    color:#0000FF;
    cursor: pointer;
  }
</style>
<style>
  #storageLocation .el-input__inner::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }
  #storageLocation .el-input__inner[type="number"]{-moz-appearance:textfield!important;}
  #storageEdit1 .el-form-item{
    margin-bottom: 4px;
  }
  #storageEdit1 .el-form-item__error{
    top:80%!important;
  }
  #storageEdit .el-form-item__label{
    width: 120px!important;
  }
  #storageEdit .el-form-item__error{
    left:20px!important;
    top:91%!important;
  }
  #storageEdit #box .el-form-item__error{
    left:1px!important;
    top:92%!important;
  }
  #storageEdit .el-form-item{
    margin-bottom: 10px;
  }
</style>
