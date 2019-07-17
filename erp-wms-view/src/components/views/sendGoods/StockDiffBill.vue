<!--仓库异常单 贾南风-->
<template>
  <div id="stockDiffBill">
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="5">
            <div class="grid-content">
              <label>快递单号：</label>
              <el-input placeholder="请输入快递单号" @keyup.enter.native="queryButton" v-model="queryData.expressNo" ></el-input>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <label>订单号：</label>
              <el-input  placeholder="请输入订单号" @keyup.enter.native="queryButton" v-model="queryData.salesOrderNo"></el-input>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <label>异常原因：</label>
              <el-select  placeholder="请选择异常原因" clearable v-model="queryData.abnormalReason">
                <el-option
                  v-for="item in warehouseType"
                  :key="item.abnormalReason"
                  :label="item.abnormalReason"
                  :value="item.abnormalReason">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">
              <label>仓审须知：</label>
              <el-input  placeholder="请输入仓审须知" @keyup.enter.native="queryButton" v-model="queryData.storageAuditMsg"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button size="mini" type="primary" @click="queryButton">查 询</el-button>
        <el-button size="mini" type="primary" @click="resetData">重 置</el-button>
      </div>
    </div>

    <div class="col-nav" style="margin:0 0 10px;">
      <ul>
        <li v-if="authorityCode.WMS_STOCKDIFFBILL_REPULSE" @click="repulse"><span>打回</span></li>
        <li v-if="authorityCode.WMS_STOCKDIFFBILL_AMENDEXPRESS" @click="amendExpress()"><span>批量改快递</span></li>
        <li v-if="authorityCode.WMS_STOCKDIFFBILL_PATCH" @click="patchExit"><span>补打</span></li>
        <li v-if="authorityCode.WMS_STOCKDIFFBILL_NORMAL" @click="normalAmend"><span>转正常</span></li>
        <li v-if="authorityCode.WMS_STOCKDIFFBILL_LOG" @click="publicLogBtn()"><span>查看日志</span></li>
      </ul>
    </div>
    <!-- 表格区订单列表 -->
    <ag-grid-vue :style='{"height":agHeight+"px","width": "100%"}'
                 class="ag-theme-balham ag-table"
                 :gridOptions="gridOptions"
                 :columnDefs="columnDefs"
                 :rowData="orderList"
                 rowSelection="multiple"
                 :enableFilter="true"
                 :components="components"
                 :enableSorting="true"
                 :gridReady="onGridReady"><!--:enableSorting="true"-->
    </ag-grid-vue>
    <div id="pageTool" class="col-pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                     :page-sizes="[15, 30,50,100, 200,1000]" :page-size="size"
                     layout="total, sizes,prev,pager , next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--打回-->
    <div>
      <el-dialog v-dialogDrag
        :close-on-click-modal="false"
        title="打回"
        :visible.sync="dialogVisible"
        width="480px"
      >
        <div style="width: 100%;text-align: center;margin: 20px 0">
          <label>状态选择：</label>
          <el-select  placeholder="请选择" v-model="orderStatus">
            <el-option
              v-for="item in repulse1"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="clickRepulse(1)">打 回</el-button>
          <el-button type="primary" @click="clickRepulse(2)" style="width: 110px!important;">打回并转正常</el-button>
         </span>
      </el-dialog>
    </div>
    <!--批量改快递-->
    <div>
      <el-dialog v-dialogDrag
        title="批量改快递"
        :close-on-click-modal="false"
        :visible.sync="dialogVisibleExpress"
        width="480px"
      >
        <div style="width: 100%;text-align: center;margin: 20px 0">
          <label>快递：</label>
          <el-select  placeholder="请选择" v-model="expressId">
            <el-option
              v-for="item in express"
              :key="item.expressId"
              :label="item.expressName"
              :value="item.expressId">
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleExpress = false">取 消</el-button>
    <el-button type="primary" @click="saveAmendE">确 定</el-button>
  </span>
      </el-dialog>
    </div>
    <!--补打-->
    <div>
      <el-dialog v-dialogDrag
        title="补打"
        :close-on-click-modal="false"
        :visible.sync="dialogVisiblePatch"
        width="480px"
      >
        <div style="width: 100%;margin: 20px 0">
          <el-checkbox-group v-model="radio" style="margin-left: 10px;" ><!--@change="handleCheckedCitiesChange"-->
            <label>单据类型：</label>
            <el-checkbox  label="1" >快递面单</el-checkbox>
            <el-checkbox  label="2" >发货单</el-checkbox>
          </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisiblePatch = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisiblePatch = false">预 览</el-button>
          <el-button type="primary" @click="dialogVisiblePatch = false">打 印</el-button>
  </span>
      </el-dialog>
    </div>
    <!--转正常-->
    <div>
      <el-dialog v-dialogDrag
        :close-on-click-modal="false"
        title="转正常"
        :visible.sync="dialogVisibleNormal"
        width="480px"
      >
        <div style="width: 100%;text-align: center;margin: 20px 0">
          <span>您确定将选中的单据转为正常单据吗?</span>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleNormal = false">取 消</el-button>
    <el-button type="primary" @click="clickNormal">确 定</el-button>
  </span>
      </el-dialog>
    </div>
    <!--打回失败的-->
    <div>
      <el-dialog v-dialogDrag
        :close-on-click-modal="false"
        title="打回"
        :visible.sync="dialogVisibleDelete"
        width="800px">
        <div>
          <div class="deleteBox"><i class="el-icon-warning"
                                    style="color:red;margin-right: 5px;"></i>已打回成功{{repulseFailed.successNums}}条，失败{{repulseFailed.defeatNums}}条
          </div>
          <div  style="margin:30px 0 5px 0"><span>失败订单列表</span>
            <span class="span" @click="repeatD" style="margin-left: 10px;cursor: pointer;color: #409EFF">打回</span></div>
          <div >
            <el-table
              :data="repulseFailed.notBackList"
              tooltip-effect="dark"
              border
              :height="500"
              @selection-change="handleSelectionChange"
              style="width: 100%">
              <el-table-column
                type="selection"
                align="center"
                width="55">
              </el-table-column>
              <el-table-column
                prop="defeateReason"
                :show-overflow-tooltip="true"
                label="失败原因">
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="abnormalReason"
                label="异常原因">
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="salesOrderNo"
                label="订单号">
              </el-table-column>
              <el-table-column
                align="center"
                label="订单状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.orderStatus == 1">待客审</span>
                  <span v-if="scope.row.orderStatus == 2">已客审</span>
                  <span v-if="scope.row.orderStatus == 3">已财审</span>
                  <span v-if="scope.row.orderStatus == 4">已仓审</span>
                  <span v-if="scope.row.orderStatus == 5">已拣货</span>
                  <span v-if="scope.row.orderStatus == 6">已验货</span>
                  <span v-if="scope.row.orderStatus == 7">已打包</span>
                  <span v-if="scope.row.orderStatus == 8">已称重</span>
                  <span v-if="scope.row.orderStatus == 9">已发货</span>
                  <span v-if="scope.row.orderStatus == 10">已完成</span>
                  <span v-if="scope.row.orderStatus == 11">已取消</span>
                  <span v-if="scope.row.orderStatus == 20">已分配拣货位</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="退款状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.refundStatus == 1">未退款</span>
                  <span v-if="scope.row.refundStatus == 2">退款中</span>
                  <span v-if="scope.row.refundStatus == 3">已退款</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="customerName"
                label="买家信息">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
    <!--修改快递单号-->
    <div>
      <el-dialog v-dialogDrag title="修改快递单号" :close-on-click-modal="false" :visible.sync="expressVisible" width="500px">
			<label>快递单号：</label>
        <el-input   placeholder="请输入快递单号" :disabled="disabledExpress" style="width: 80%" v-model="expressNo"></el-input>
        <div style="text-align: center;margin: 30px 0 10px 0">
          <el-button @click="expressVisible=false">取 消</el-button>
          <el-button type="primary" v-if="!disabledExpress" @click="saveExpressNo">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改内部便签弹窗 -->
    <div>
      <el-dialog v-dialogDrag title="修改内部便签" :close-on-click-modal="false" :visible.sync="noteVisible" width="700px">
    <span style="font-size: 14px;">
				内部便签：
			</span>
        <br><br>
        <el-input type="textarea" :rows="10" placeholder="请输入内部便签" v-model="noteMsg"></el-input>
        <div style="text-align: center;margin-top: 10px">
          <el-button @click="noteVisible=false">取 消</el-button>
          <el-button type="primary" @click="saveNotMeg">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改仓审须知 -->
    <div>
      <el-dialog v-dialogDrag title="修改仓审须知" :visible.sync="noticeVisible" :close-on-click-modal="false" width="700px">
        <el-input type="textarea" :rows="10"  placeholder="请输入仓审须知" v-model="storeMsg">
        </el-input>
        <div style="text-align: center;margin-top: 10px">
          <el-button @click="noticeVisible=false">取 消</el-button>
          <el-button type="primary" @click="saveStoreMsg">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--异常单修改-->
    <div>
      <el-dialog v-dialogDrag title="异常单修改" :visible.sync="abnormalVisible" :close-on-click-modal="false" width="700px">
    <span style="font-size: 14px;">
				异常原因：
			</span>
        <br><br>
        <el-input type="textarea" :rows="10" placeholder="请输入异常原因" v-model="abnormalReason"></el-input>
        <div style="text-align: center;margin-top: 10px">
          <el-button @click="abnormalVisible=false">取 消</el-button>
          <el-button type="primary" @click="saveAbnormalReason">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--修改收货地址-->
      <el-dialog v-dialogDrag
        title="修改收货地址"
        :visible.sync="dialogVisible1"
        :close-on-click-modal="false"
        style="padding: 10px!important;"
        width="685px">
        <div style="margin-left: -80px">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item  prop="provinceId" style="display: inline-block;width: 275px;margin-right: -98px">
              <el-select v-model="ruleForm.provinceId" placeholder="请选省" @change="two()">
                <el-option
                  v-for="item in province"
                  :key="item.regionName"
                  :label="item.regionName"
                  :value="item.regionId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="cityId" style="width: 275px;display: inline-block;margin-right: -98px">
              <el-select v-model="ruleForm.cityId" placeholder="请选择市" @change="three()">
                <el-option
                  v-for="item in city"
                  :key="item.regionName"
                  :label="item.regionName"
                  :value="item.regionId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="regionId" style="width: 275px;display: inline-block">
              <el-select v-model="ruleForm.regionId" placeholder="请选择区">
                <el-option
                  v-for="item in district"
                  :key="item.regionName"
                  :label="item.regionName"
                  :value="item.regionId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="town">
              <el-input v-model="ruleForm.town" style="width: 95%"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button @click="dialogVisible1=false">取 消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    <!-- &lt;!&ndash;查看日志&ndash;&gt;-->
    <div>
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
    <!--批量修改快递失败-->
    <div>
      <el-dialog v-dialogDrag
        title="批量修改快递"
        :close-on-click-modal="false"
        :visible.sync="dialogExpress"
        width="800px">
        <div>
          <div style="text-align: center">
            <i class="el-icon-warning" style="color: #D81E06;font-size: 14px;margin-right: 5px"></i><span>批量修改快递成功{{tableData.successCount}}条，失败{{tableData.failCount}}条！</span>
          </div>
          <div style="margin-top: 20px"><span>失败订单列表</span><span style="margin-left: 20px;color: #0000FF" @click="expressA">批量修改快递</span></div>
          <div>
            <el-table
              :data="tableData.baseBatchUpOrders"
              border
              tooltip-effect="dark"
              :height="500"
              @selection-change="handleSelectionChange1"
              style="width: 100%">
              <el-table-column
                align="center"
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="failReason"
                :show-overflow-tooltip="true"
                label="失败原因">
              </el-table-column>
              <el-table-column
                prop="expressName"
                label="快递">
              </el-table-column>
              <el-table-column
                prop="salesOrderNo"
                :show-overflow-tooltip="true"
                label="订单号">
              </el-table-column>
              <el-table-column
                prop="orderStatus"
                label="订单状态">
              </el-table-column>
              <el-table-column
                prop="storageName"
                label="仓库">
              </el-table-column>
              <el-table-column
                prop=""
                :show-overflow-tooltip="true"
                label="买家信息">
                <template slot-scope="scope">
                    <span>{{scope.row.buyerNick}}：{{scope.row.shippingAddress}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import publicLog from '@/components/common/publicLogDialog.vue'
  import {AgGridVue} from "ag-grid-vue";
  export default {
    name: "SearchUi",
    components: {
      'ag-grid-vue': AgGridVue,
      'v-Publiclog': publicLog
    },
    data() {
      return {
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        //查看日志
        paramObj: {},
        pulicLogVisible: false,
        version: '1.0.0',  //版本号
        dialogExpress: false,  // 修改快递弹框
        dog: 0,  //看门狗
        tableData: {},  //表格数据
        query: () => {},  //方法
        agHeight: 0,  //高度
        radio: [],  //单据类型
        checkLength: [], // 选择复选框的值
        checkL: [], // 打回失败复选框的值
        checkA: [], // 修改失败复选框的值
        express: [], // 快递
        expressList: [], // 表格里的快递
        dialogVisible1: false, // 修改收货地址
        dialogVisible: false, // 打回
        dialogVisibleExpress: false, // 批量改快递
        dialogVisiblePatch: false, // 补打
        dialogVisibleNormal: false, // 转正常
        expressVisible: false, // 快递单号
        dialogVisibleDelete: false,
        noteVisible: false, // 内部便签
        noteMsgA: '', //内部便签
        storeMsg: '', //仓审须知
        expressNo: '', // 快递单号
        abnormalVisible: false, // 异常原因
        abnormalReason: '', // 异常原因弹框
        salesOrderId: '', // 点击铅笔的id
        noticeVisible: false, // 仓审须知
        disabledExpress:  false, // 是否修改电子面单
        box: '',
        orderStatus: '', // 打回弹框里的状态
        expressId: '', // 批量修改快递的快递ID
        /* {id: 20, label: '已分配拣货位'},*/
        repulse1:[ // 状态
          {id: 1, label: '待客审'},
          {id: 2, label: '已客审'},
          {id: 4, label: '已仓审'},
          {id: 6, label: '已验货'}
        ],
        warehouseType: [],//异常原因
        queryData:{ // 查询的数据参数
          salesOrderNo: '', //订单号
          expressNo: '', //快递单号
          abnormalReason: '',//异常原因id
          storageAuditMsg: '', //仓审须知
          page: 1 ,//当前页数
          size: 15// 一页展示条数
        },
        components: null,//自定义列
        columnDefs: null,//列标题设置
        rowData: null,//表格数据
        //企业扩展
        gridApi: null,
        columnApi: null,
        repulseFailed: [], // 打回失败的数据
        ruleForm: {  // 修改收货信息参数
          provinceId: '',
          cityId: '',
          regionId: '',
          town: ''
        },
        province: '', // 省
        city: '', // 市
        district: '', // 区
        rules: {  //表单验证
          provinceId: [
            { required: true, message: '请选择省', trigger: 'blur' },
          ],
          cityId: [
            { required: true, message: '请选择市', trigger: 'change' }
          ],
          regionId: [
            { required: true, message: '请选择区', trigger: 'change' }
          ],
          town: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        },
        gridOptions: {
          enableColResize: true,
          //阻止单击行选中本行
          suppressRowClickSelection: true,
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
            columns: '工具板',
            groups: '行组',
            rowGroupColumnsEmptyMessage: '拖动此处以设置行组'
          }
        },
        //企业扩展
        autoGroupColumnDef: null,
        //n: 1,  //
        //tests: "",  //
        checkLength_5: 10, //字符限制
        checkLength_6: 15, //字符限制
        checkLength_2: 30, //字符限制
        checkLength_3: 20, //字符限制
        checkLength_4: 100, //字符限
        active: "1", //测试
        maxFont: 500,
       /* //简易查询
        tenantId: 0,
        simpleParam: {  //
          page: 1,
          size: 15,
          sourceOrderNo: '',//平台单号
          salesOrderNo: '',//订单编号
          customerName: '',//买家ID
          consigneeMobile: '',//手机号
          expressNo: '',//快递单号
        },*/
        size: 15, //每页条数
        page: 1, //当前页
        sortColumn: 0, //排序字段
        total: 0, //数据总条数
        sortType: 0, //排序方式 0正序 1倒序
        clToken: "", //token令牌
        //高级查询
        /*------------------------------------------------查询条件------------------------------------------------*/
        isServMsg: false, //有客服备注
        isNoServMsg: false, //无客服备注
        isBuyerMsg: false, //有买家留言
        isNoBuyerMsg: false, //无买家留言
        timeRange: [], //索引0为开始时间索引1为结束时间
        conditionText: "", //商品选择框
        paramData: {
          page: 1,
          size: 15,
          orderTab: 1,//待客审 待仓审 未付款 取消的订单
          serverMsgFlag: '',//有无客服备注
          customerMsgFlag: '',//有无买家留言
          codFlag: '', //货到付款订单
          preSaleFlag: '',//预售订单
          giftInFlag: '',//包含赠品
          suitInFlag: '',//包含套装
          timeoutOrderFlag: '',//超时订单
          ledgerStockoutFlag: '',//缺货订单
          overWeightFlag: '',//超重订单
          expressExceptionFlag: '',//快递异常订单
          orderType: '',//订单类型
          OrderMoneyOrWeight: '',//订单金额或订单重量判断
          OrderMoneyOrWeightThan: '',//商品条数或数量下限值
          OrderMoneyOrWeightLess: '',//商品条数或数量上限值
          itemType: '',//商品条数或数量判断
          itemTypeNumThan: '',//商品条数或数量下限值
          itemTypeNumLess: '',//商品条数或数量上限值
          flagId: '',//旗帜
          orderSignCode: '',//异常标记ID
          refundStatus: '', //退款状态
          refundType: '', //退款类型
          receiveType: '',//收货人条件判断
          receiveInfo: '',//收货人信息输入框值
          dateType: '', //时间类型条件判断
          dateStart: '',//开始时间
          dateEnd: '',//结束时间
          goodsId: '',//商品ID
        },
        consigneeTypeList: [],//省份下拉select
        selectShop: [], //选中的店铺列表
        selectWarehouse: [], //选中的仓库列表
        selectExpress: [], //选中的快递列表
        shopIdList: [], //店铺ID列表
        storeBeansList: [], //仓库列表
        expressBeansList: [], //快递列表
        orderLists: [], // checkbox选中的数据
        depositNum: "1", //订单金额或订单重量判断


        orderListLoading: true, //表格数据载入状态
        headupStatus: false, //订单挂起弹窗状态
        headupType: 0, //订单挂起类型
        headupReason: "", //订单挂起原因

        importShop: "", //导入店铺信息
        orderImport: false, //订单导入弹窗
        warehouseListTemp: [], //仓库列表临时变量
        expressListTemp: [], //快递列表临时变量

        batchStoreId: "", //批量修改仓库ID
        batchExpressId: "", //批量修改快递ID

        cancelReasonList: {}, //订单取消原因列表
        cancelReasonText: "", //订单取消原因
        cancelReason: "", //取消原因选择
        cancelStatus: false, //取消订单弹窗状态

        verifyNull: false, //验证空标记

        t_height: 0, //表格最大高度
        searchTextFlag: false,
        searchColumn: "", //模糊搜索的条件标记
        searchText: "",
        columnsFlag: false, //自定义显示列
        checkAll: true, //全选按钮状态
        noteMsg: "", //内部便签
        test: false,
        timeDisable: false, //时间选择器禁止手动编辑
        saveSet: false, //方案另存为标记
        goodsNameTemp: "",
        higeSearchSet: false, //高级查询条件显示标记
        orderList: [],  //表格区列表
        higeSearchFlag: true,  //之前选择
        //num: 333,  //
      /*  goods: "0",  //
        verifyFlag: 1,  //
        saveCondition: 0,  //
        saveConditionId: 0,  //
        searchCondition: "",  //*/
       /* warehouse:'',  //
        note: "",  //
        notice: "",  //
        receiveMobile: "", //收货人手机
        receiveAddress: "", //收货地址
        receiveName: "", //收货人
        saveSwitch: "",  //
        tagList: [],  //
        checkList: [],  //
        checkList_2: [],  //
        columnsCheckList: [],  //
        noteFlag: false,  //
        noticeFlag: false,  //
        receiptFlag: false,  //
        goodsListFlag: false,  //*/
       /* searchConditionFlag: false,  //
        receiptVisible: false,  //
        conditionVisible: false,  //
        commonConditionVisible: false,  //*/
      };
    },
    beforeMount() {
      this.columnDefs = [
        {headerName: '序号', field: 'index', width: 65},
        {checkboxSelection: true, headerCheckboxSelection: true,width: 38},
        {headerName: '异常原因',  field: 'abnormalReason', width: 150,cellRenderer: "clickRender"}, ///////////////////////////////
        {headerName: '订单号', field: 'salesOrderNo', width: 120},
        {headerName: '商品信息', field: 'productTypenum', width: 100, cellRenderer: "merchandiseNews"},//productSkunum
        {headerName: '订单状态', field: 'orderStatus', width: 200},
        {headerName: '退款状态', field: 'refundStatus', width: 100},
        {headerName: '买家留言', field: 'customerMsg', width: 100},
        {headerName: '客服备注', field: 'serviceMsg', width: 100},
        {headerName: '收货信息', field: 'shippingAddress', width: 200, cellRenderer: "singleClickEditRenderer"},//receiveMobile receiveAddress
        {headerName: '买家信息', field: 'customerName', width: 100, cellRenderer: function(params) { return '<span title="买家ID：'+params.data.buyerNick+' 店铺：'+params.data.storeName+'">买家ID：'+params.data.buyerNick+'  店铺：'+params.data.storeName+'</span>'}},//shopId
        {headerName: '内部便签', field: 'internalMemoMsg', width: 100, cellRenderer: "noteRender"},
        {headerName: '仓审须知', field: 'storageAuditMsg', width: 100, cellRenderer: "storeRender"},
        {headerName: '仓库', field: 'storageName', width: 130},
        {headerName: '快递', field: 'expressId', width: 130, cellRenderer: "expressRender"},
        {headerName: '快递单号', field: 'expressNo', width: 100, cellRenderer: "expressNum"},/////////////////////////////////////////////
        {headerName: '是否加急', field: 'urgentFlag', width: 100},
        {headerName: '净重', field: 'totalWeight', width: 100},
        {headerName: '下单时间', field: 'orderTime', width: 150},
        {headerName: '付款时间', field: 'payTime', width: 150},
        {headerName: '平台单号', field: 'sourceOrderNo', width: 120},
        {headerName: '相关单号', field: 'fromOrderCode', width: 120}
      ];
      this.components = {
        merchandiseNews: this.shopNews('productTypenum'), // 商品信息
        expressNum: this.expressEdit(), // 快递单号
        clickRender: this.getRender(), // 异常原因
        singleClickEditRenderer: this.getRenderer(), //收货信息
        expressRender: this.getRenderer4(), // 快递
        noteRender: this.getNoteRender(),// 内部便签
        storeRender: this.storeRender() // 仓审须知
      };
    },
    methods: {
      // 所有开启的快递
      expressStore(row) {
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/'+ this.version +'/getExpressList',{storageIdListStr: row})
          .then(res => {
            if(res.data.success == true){
              this.express = res.data.result;
             /* for (var item of res.data.result) {
                this.expressList.push({
                  value: item.expressId,
                  label: item.expressName
                });
              }*/
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          });
      },
      // 格式化0-9
      turnSingle(num) {
        return num<10?'0'+num:num
      },
      // 点击查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 48;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      // 查看日志
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      // 省改变请求市'
      two() {
        let self = this;
        if (self.dog >= 1) {// 第一次改变时不清空，第二次以后改变时清空
          self.ruleForm.cityId = '';// 请空二级
          self.ruleForm.regionId = '' // 请空三级
        }
        self.dog++;
        // 请求市
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.ruleForm.provinceId})
          .then(function(res) {
            if (res.data.code == 0){
              self.city = res.data.result; // 接受省的数据
              if (self.dog1 == 0){
                self.three();
              }
              self.dog1++;
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
        console.log(2);
      },
      // 市改变请求区
      three() {
        let self = this;
        if (self.dog >= 2) {
          self.ruleForm.regionId = '';  // 清空三级
        }
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list',{regionId: self.ruleForm.cityId})
          .then(function(res) {
            if (res.data.code == 0){
              self.district = res.data.result; // 接受省的数据
              self.dog2++;
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 修改快递单号的提交
      saveExpressNo() {
        if(this.expressNo == ''){
          this.$message({
            message: '请输入快递单号',
            type: 'warning'
          });
          return false;
        }
        let data = {
          salesOrderId: this.salesOrderId,
          expressNo: this.expressNo
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/updateExpressNo',data)
          .then(res => {
            if(res.data.success ==  true){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.expressVisible = false;
              this.query();
              this.checkLength = [];
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
      },
      // 修改收货信息的提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              salesOrderId:this.salesOrderId,
              provinceId:this.ruleForm.provinceId,
              cityId:this.ruleForm.cityId,
              areaId:this.ruleForm.regionId,
              shippingAddress:this.ruleForm.town,
              provinceName: '',
              cityName: '',
              areaName: ''
            };
            // 省的name
            this.province.forEach(item => {
              if(item.regionId == this.ruleForm.provinceId){
                  data.provinceName = item.regionName;
              }
            });
            // 市的name
            this.city.forEach(item1 => {
              if(item1.regionId == this.ruleForm.cityId){
                data.cityName = item1.regionName;
              }
            });
            this.district.forEach(item2 => {
              if(item2.regionId == this.ruleForm.regionId){
                data.areaName = item2.regionName;
              }
            })
            this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/updateShippingAddress',data)
              .then(res => {
                if(res.data.success == true){
                  this.dialogVisible1 = false;
                  this.query();
                  this.checkLength = [];
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 异常原因信息提交
      saveAbnormalReason() {
        if(this.abnormalReason == ''){
          this.$message({
            message: '异常原因为空',
            type: 'warning'
          });
          return false;
        }

        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/updateOrderAbrReason',{salesOrderId:this.salesOrderId,orderAbnormalReason:this.abnormalReason})
          .then(res => {
            if(res.data.success == true){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.query();
              this.checkLength = [];
              this.abnormalVisible = false;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
      },
      // 修改仓审 保存
      saveStoreMsg() {
        if(this.storeMsg == ''){
          this.$message({
            message: '请输入仓审须知',
            type: 'warning'
          })
          return false;
        }

        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/updateStorageAuditMsg',{salesOrderId: this.salesOrderId,storageAuditMsg: this.storeMsg})
          .then(res => {
            if(res.data.success == true){
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              this.noticeVisible = false;
              this.query();
              this.checkLength = [];
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 修改内部便签 保存
      saveNotMeg() {
        if(this.noteMsg == ''){
          this.$message({
            message: '请输入内部便签',
            type: 'warning'
          })
          return false;
        }

        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/updateInternalMemoMsg',{salesOrderId: this.salesOrderId,internalMemoMsg: this.noteMsg})
          .then(res => {
            if(res.data.success == true){
              this.$message({
                message: '更新成功',
                type: 'success'
              });
              this.noteVisible = false;
              this.query();
              this.checkLength = [];
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 转正常确定
      clickNormal() {
        let str = '';
        this.checkLength.forEach(item => {
          str += item.salesOrderId + ',';
        });

        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/orderToNormal',{salesOrderIdList: str.slice(0,-1)})
          .then(res => {
            if(res.data.success == true){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.dialogVisibleNormal = false;
              this.query();
              this.checkLength = [];
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
      },
      // 批量修改快递的确定
      saveAmendE() {
        if(this.expressId == ''){
          this.$message({
            message: '请选择快递',
            type: 'warning'
          });
          return false;
        }
        let str = '';
        this.checkLength.forEach(item => {
          str += item.salesOrderId + ',';
        });
        // console.log(str.slice(0, -1));
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/batchUpdateExpress',{salesOrderIdList: str.slice(0,-1),expressId: this.expressId})
          .then((res) => {
            if(res.data.success == true){
              if(res.data.code == 1000){
                if(res.data.result.failCount == 0){
                  this.$message({
                    message: '批量修改快递成功',
                    type: 'success'
                  });
                }else{
                  this.tableData = res.data.result;
                  this.dialogExpress = true;
                }
                this.dialogVisibleExpress = false;
                this.query();
                this.checkLength = [];
              }else if(res.data.code == 1002){
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
                this.dialogVisibleExpress = false;
              }else if(res.data.code == 1003){
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
                this.dialogVisibleExpress = false;
              }
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
      },
      // 补打
      patchExit() {
        if(this.checkLength.length == 0){
          this.$message({
            message: '请选择要补打的异常单',
            type: 'warning'
          });
          return false;
        }
        this.dialogVisiblePatch = true;
      },
      // 点击批量改快递
      amendExpress() {
        if(this.checkLength.length == 0){
          this.$message({
            message: '请选择要批量改快递的异常单',
            type: 'warning'
          });
          return false;
        }
        let str = '';
        this.checkLength.forEach(item => {
          str += item.storageId + ',';
        });
        this.expressStore(str.slice(0,-1));
        this.dialogVisibleExpress = true;
      },
      // 打回失败里的打回
      repeatD() {
        if(this.checkL.length == 0){
          this.$message({
            message: '请选择要打回的异常单',
            type: 'warning'
          });
          return false;
        }
        this.checkLength = this.checkL;
        console.log(this.checkLength,2);
        console.log(this.checkL,1);

        this.dialogVisibleDelete = false; // 关闭失败弹框
       this.dialogVisible = true;
      },
      // 修改快递失败的修改
      expressA() {
        if(this.checkA.length == 0){
          this.$message({
            message: '请选择要修改快递的异常单',
            type: 'warning'
          });
          return false;
        }

        this.checkLength = this.checkA;
        this.dialogExpress = false; // 关闭失败弹框

        let str = '';
        this.checkLength.forEach(item => {
          str += item.storageId + ',';
        });
        this.expressStore(str.slice(0,-1));

        this.dialogVisibleExpress = true;
      },
      // 打回失败的表格数据触发checkbox
      handleSelectionChange(val) {
        this.checkL = val;
        console.log(val);
      },
      //批量修改失败的表格数据触发checkbox
      handleSelectionChange1(val){
        this.checkA = val;
      },
      // 打回弹框里的打回按钮 // 打回并转正按钮
      clickRepulse(num) {
        if(this.orderStatus == ''){
          this.$message({
            message: '请选择状态',
            type: 'warning'
          });
          return false;
        }
        let str = '';
        this.checkLength.forEach(item => {
          str += item.salesOrderId + ',';
        });
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/orderStatusBack',{orderStatus: this.orderStatus,salesOrderIdList:str.slice(0,-1)})
          .then(res => {
            if(res.data.success == true){
              if(res.data.code == 310000006){ //全部退款的单据不支持打回！
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }else{
                this.repulseFailed = res.data.result;
                this.dialogVisible = false;
                if(this.repulseFailed.defeatNums == 0){ // 没有失败的
                  if(num == 1){
                    this.$message({
                      message: '已打回成功' + this.repulseFailed.successNums + '条！',
                      type: 'success'
                    })
                  }

                }else{
                  this.dialogVisibleDelete = true;
                }
                if(num == 1){ // 打回按钮
                  this.query(); // 渲染数据
                  this.checkLength = [];
                }else if(num == 2 && this.repulseFailed.successNums*1 >= 1){ // 打回并转正常
                  if(this.orderStatus == 1 || this.orderStatus == 2){
                    this.query();
                  }else{
                    if(this.repulseFailed.couldBackOrderIdStr == ''){

                    }else{
                      this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/orderToNormal',{salesOrderIdList: this.repulseFailed.couldBackOrderIdStr})
                        .then(res => {
                          if(res.data.success == true){
                            this.query();
                            this.checkLength = [];
                          }else{
                              this.$message({
                                message: res.data.msg,
                                type: 'warning'
                              })
                          }
                        })
                    }
                  }
                }
              }

            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 点击打回按钮
      repulse() {
        let isShow = true;
        if(this.checkLength.length == 0){
          this.$message({
            message: '请选择要打回的异常单',
            type: 'warning'
          });
          return false;
        }
       /* this.checkLength.forEach(item => {
          if (item.refundStatus == '退款中' || item.refundStatus == '已退款') {
            isShow = false;
            this.$message({
              message: '单据为已退款/退款中，不可进行打回！',
              type: 'warning'
            })
          }
        })*/
            if(isShow){
              this.orderStatus = '';
              this.dialogVisible = true;
            }

      },
      // 重置表单
      resetData() {
        this.queryData.salesOrderNo = '';
        this.queryData.expressNo = '';
        this.queryData.abnormalReason = '';
        this.queryData.storageAuditMsg = '';

      },
      // 查询按钮
      queryButton() {
        this.query();
        this.checkLength = [];
      },
      //表格初始化
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        //表格列自适应
        params.api.sizeColumnsToFit();
        //点击多选框触发此事件
        this.gridOptions.onSelectionChanged = (event) => {
          this.checkLength = this.getSelectedRows();
        }
      },
      //获取选中行数据
      getSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData;
      },
      // 点击转正常按钮
      normalAmend() {
        let isShow = true;
        if(this.checkLength.length == 0){
          this.$message({
            message: '请选择要转正常的异常单',
            type: 'warning'
          });
          return false;
        }
       /* this.checkLength.forEach(item => {
          if(item.refundStatus == '退款中' || item.refundStatus == '已退款'){
            isShow = false;
              this.$message({
                message: '退款中或者已退款的单据不支持仓库人员直接转正常，如需转为正常单据，请打回至待客审节点，由客审人员进行处理！',
                type: 'warning'
              })
          }
        });
        if(isShow){

        }*/
        this.dialogVisibleNormal = true;
      },
      // 重置表单
      resetData() {
        this.queryData.salesOrderNo = '';
        this.queryData.expressNo = '';
        this.queryData.abnormalReason = '';
        this.queryData.storageAuditMsg = '';

      },
      // 查询按钮
      queryButton() {
        this.query();
        this.checkLength = [];
      },
      //更改每页显示数量
      handleSizeChange(value) {
        this.queryData.size = value;
        this.query();
        this.checkLength = [];
      },
      //更改页数
      handleCurrentChange(value) {
        this.queryData.page = value;
        this.query();
        this.checkLength = [];
      },
      /*----------------------------------*/
      //表格鼠标划过铅笔
      mouseHover() {
        $('.ag-theme-balham').on('mouseenter', '.icon-edit', function (e) {
          $(this).show();
        }).on('mouseout', '.icon-edit', function () {
          $(this).hide();
        })
        $('.ag-theme-balham').on('mouseenter', '.mouse-edit', function (e) {
          $(this).prev().show();
        }).on('mouseout', '.mouse-edit', function () {
          $(this).prev().hide();
        })
      },
      //初始化表格选中
      InitializationTable() {
        this.shopIdList = [];
        this.storeBeansList = [];
        this.expressBeansList = [];
        this.orderIdList = [];
        this.orderToChgBeans = [];
      },
      //表格初始化
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        //点击多选框触发此事件
        this.gridOptions.onSelectionChanged = (event) => {
          this.checkLength = this.getSelectedRows();
        }
      },
      //单个修改快递
      updateSignExpress() {
        const data = {
          salesOrderId: this.salesOrderId,
          expressId: this.batchExpressId
        };
        this._post("com.edb01.erp.wms.service.api.WmStorageAbnormalService/" + this.version + "/updateExpress", data).then((res) => {
          if (res.data.success == true) {
            if(res.data.code == 1000){
              if(res.data.result.failCount == 0){
                // 判断当前快递是电子还是纸质
                this._post('com.edb01.erp.wms.service.api.ExpressService/' + this.version + '/findExpressById',{expressId: this.batchExpressId})
                  .then(res => {
                    console.log(res.data.result);
                    if(res.data.success){
                      if(res.data.result.expressType == 2){ // 纸质显示修改快递单号
                        this.expressVisible = true;
                      }
                    }
                  })
              }else{
                this.$message({
                  message: res.data.result.baseBatchUpOrders[0].failReason,
                  type: 'warning'
                });
                this.query();
              }
            }
            //this.query();
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
            this.query();
          }
        })
      },
      // 商品信息
      shopNews(item) {
        var _this = this;
        function CellRenderer() {
        }
        CellRenderer.prototype.createGui = function () {
          var template =
            '<span><span class="jump"></span></span>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui();
          this.params = params;
          var eValue = this.eGui.querySelector(".jump");
          if (item == 'productTypenum') {
            eValue.innerHTML = params.data.goodsTypeQty + '/' + params.data.goodsQty;
          } else {
            eValue.innerHTML = params.data.salesOrderNo;
          }
          this.eButton = this.eGui.querySelector(".jump");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          //this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          _this.$router.push({ name:'orderDetail',params:{orderId:this.params.data.salesOrderId,fromPage:'OrderProcessing'}});
        };
        CellRenderer.prototype.destroy = function () {
          //this.eButton.removeEventListener("click", this.buttonClickListener);
        };
        return CellRenderer;
      },
      // 获取快递的类型
      getExpressType(data){
        /*this.expressNo = 9999999999999;
        console.log(this.expressNo,888888888);*/
        this._post('com.edb01.erp.wms.service.api.ExpressService/' + this.version + '/findExpressById',{expressId: data})
          .then(res => {
            console.log(789);
            if(res.data.result.expressType == 1){ // 电子
                this.disabledExpress = true;
                this.expressVisible = true;
            }else{ // 纸质
                this.disabledExpress = false;
              this.expressVisible = true;
            }
          })
      },
      // 快递单号
      expressEdit() {
        var _this = this;

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          var expressNo = params.data.expressNo ? params.data.expressNo:'';
          var template =
            '<div><i class="el-icon-edit icon-edit note-edit"></i><span class="mouse-edit" title="' + expressNo + '">' + expressNo + '</span></div>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          this.eButton = this.eGui.querySelector(".note-edit");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          //console.log(this.params.data.expressNo,89898989);
          //_this.expressVisible = true;
          _this.expressNo = this.params.data.expressNo;
          //_this.expressNo = this.params.data.expressId;
          _this.salesOrderId = this.params.data.salesOrderId;
          _this.getExpressType(this.params.data.expressId)
        };
        return CellRenderer;
      },
      // 异常原因
      getRender() {
        var _this = this;

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          //console.log(params);
          var abnormalReason = params.data.abnormalReason?params.data.abnormalReason: '';
          //console.log(abnormalReason);=
          var template = '<div><i class="el-icon-edit icon-edit note-edit"></i><span class="mouse-edit" title="' + abnormalReason + '">' + abnormalReason + '</span></div>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          this.eButton = this.eGui.querySelector(".note-edit");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          _this.abnormalVisible = true;
           _this.abnormalReason = this.params.data.abnormalReason;
           _this.salesOrderId = this.params.data.salesOrderId;
        };
        return CellRenderer;
      },
      //收货信息
      getRenderer() {
        var _this = this;
        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          let shippingAddress = params.data.shippingAddress?params.data.shippingAddress:'';
          var template =
            '<div><i class="el-icon-edit icon-edit note-edit"></i><span class="theValue mouse-edit" title="' + shippingAddress + '" style="padding-left: 4px;">'+ shippingAddress +'</span></div>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          /*var eValue = this.eGui.querySelector(".theValue");
          eValue.innerHTML = params.data.consignee + ' ' + params.data.consigneeMobile + ' ' + params.data.shippingAddress;
          eValue.setAttribute("title", params.data.consignee + ' ' + params.data.consigneeMobile + ' ' + params.data.shippingAddress);*/
          this.eButton = this.eGui.querySelector(".note-edit");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          console.log(this.params.data,789456123);
          _this.dog = 0;
          _this.ruleForm.provinceId = this.params.data.provinceRegionId + '';
          _this.ruleForm.cityId= this.params.data.cityRegionId + '';
          _this.ruleForm.regionId = this.params.data.areaRegionId + '';
          _this.ruleForm.town = this.params.data.shippingAddress;
          _this.salesOrderId = this.params.data.salesOrderId;
          setTimeout(() => {
            _this.two();
          },200);
          setTimeout(() => {
            _this.three();
          },500);
          _this.dialogVisible1 = true;
        };
        return CellRenderer;
      },
      //表格数据处理
      tableHandle(data,obj) {
        var mapArr = new Map();
        for(var item in obj){
          mapArr.set(item,obj[item]);
        }
        data.forEach((item, i) => {
          if(mapArr.get(item.storageId)){
            item.expressList = mapArr.get(item.storageId);
          }else{
            item.expressList = this.expressList;
          }
          item.index = i + 1;
          /*item.orderTotalAmt = '￥' + returnFloat(item.orderTotalAmt);
          item.actuallyPayAmt = '￥' + returnFloat(item.actuallyPayAmt);
          item.merchantDctAmt = '￥' + returnFloat(item.merchantDctAmt);
          item.ecDctAmt = '￥' + returnFloat(item.ecDctAmt);
          item.totalWeight = returnFloat(item.totalWeight) + ' kg';
          item.moneypPost = '运费：￥' + returnFloat(item.freightAmt) + '， 代收：￥：' + returnFloat(item.expressServiceAmt);
          if (item.orderTime) item.orderTime = turnTimestamp(item.orderTime);
          if (item.payTime) item.payTime = turnTimestamp(item.payTime);
          item.orderSign = item.orderSign ? item.orderSign.split(',') : [];
          item.buyerNick = item.buyerNick ? item.buyerNick : '';
          item.storeName = item.storeName ? item.storeName : '';
          item.consigneeProvince = item.consigneeProvince ? item.consigneeProvince : '';
          item.consigneeCity = item.consigneeCity ? item.consigneeCity : '';
          item.consigneeArea = item.consigneeArea ? item.consigneeArea : '';
          item.serviceMsg = item.originalFlag?item.serviceMsg:'';//客服备注

          if (item.manualHangupFlag) {
            item.hangupLogo = '【挂】';
          } else {
            item.hangupLogo = '';
          }*/
        })
        return data;
      },
      //快递
      getRenderer4() {
        const _this = this;
        const expressListTemp = [];

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          console.log(params);
          //var express = this.params.data.expressId;
          var template = '<div><select name="" class="expressName">';
          params.data.expressList.forEach((item, i) => {
            template += '<option value="' + item.expressId + '">' + item.expressName + '</option>';
          })
          template += '</select></div>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          this.eButton = this.eGui.querySelector(".expressName");
          //回显快递名称
          $(this.eButton).val(params.data.expressId);
          this.changeListener = this.onButtonChange.bind(this);
          this.eButton.addEventListener("change", this.changeListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonChange = function () {
          //console.log($(this.eButton).val());
          _this.salesOrderId = this.params.data.salesOrderId;
          _this.orderIdList = [];
          _this.batchStoreId = "";
          _this.orderIdList.push(this.params.data.orderId);
          _this.batchExpressId = $(this.eButton).val();
          _this.updateSignExpress($(this.eButton));
        };
        return CellRenderer;
      },
      //内部便签点击修改
      getNoteRender() {
        var _this = this;

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          var noteMsg = params.data.internalMemoMsg ? params.data.internalMemoMsg : '';
          var template =
            '<div><i class="el-icon-edit icon-edit note-edit"></i><span class="mouse-edit" title="' + noteMsg + '">' + noteMsg + '</span></div>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          this.eButton = this.eGui.querySelector(".note-edit");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          _this.salesOrderId = this.params.data.salesOrderId;
          _this.noteMsg = this.params.data.internalMemoMsg;
          _this.noteVisible = true;
        };
        return CellRenderer;
      },
      //仓审须知点击修改
      storeRender() {
        var _this = this;

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          var storeMsg = params.data.storageAuditMsg ? params.data.storageAuditMsg : '';
          var template =
            '<div><i class="el-icon-edit icon-edit note-edit"></i><span class="mouse-edit" title="' + storeMsg + '">' + storeMsg + '</span></div>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          this.eButton = this.eGui.querySelector(".note-edit");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          _this.salesOrderId = this.params.data.salesOrderId;
          _this.storeMsg = this.params.data.storageAuditMsg;
          _this.noticeVisible = true;
        };
        return CellRenderer;
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
    },
    created() {
      // 所有开启的快递
      this._post('com.edb01.erp.wms.service.api.ExpressService/'+ this.version +'/listExpress')
        .then(res => {
          if(res.data.success == true){
            for (var item of res.data.result) {
              this.expressList.push({
                value: item.expressId,
                label: item.expressName
              });
            }
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        });

      // 请求省
      this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list',{regionId: 1})
        .then((res) => {
          if (res.data.code == 0){
            this.province = res.data.result; // 接受省的数据
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
        .catch(function(err) {
          console.log(err)
        });
      // 表格数据渲染
      this.query = () => {
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/'+ this.version +'/list',this.queryData)
          .then((res) => {
            if(res.data.success == true){
              let  storageId = []; // 仓库ID
              res.data.result.rows.forEach((item,index) => { // 处理数据
                //console.log(item.storageId,8989899898);
                item.shippingAddress = item.consigneeProvince + item.consigneeCity + item.consigneeArea + item.shippingAddress;

                if(item.storageId){
                  storageId.push(item.storageId);
                }
                item.expressList = [];
                item.index = index + 1;
                //console.log(item.payTime);
                if(item.payTime == undefined || item.payTime == ''){
                  item.payTime = '';
                }else{
                  let b = new Date(new Date(item.payTime));
                  item.payTime = b.getFullYear() + '-' + this.turnSingle(b.getMonth() + 1) + '-' +this.turnSingle(b.getDate())+' '+this.turnSingle(b.getHours())+':'+this.turnSingle(b.getMinutes())+':'+this.turnSingle(b.getSeconds());
                }
                if(item.orderTime == undefined || item.orderTime == ''){
                  item.orderTime = '';
                }else{
                  let a = new Date(new Date(item.orderTime));
                  item.orderTime = a.getFullYear() + '-' + this.turnSingle(a.getMonth() + 1) + '-' +this.turnSingle(a.getDate())+' '+this.turnSingle(a.getHours())+':'+this.turnSingle(a.getMinutes())+':'+this.turnSingle(a.getSeconds());
                }
                // 订单状态
                if(item.orderStatus == 1){
                  item.orderStatus = '待客审';
                }else if(item.orderStatus == 2){
                    item.orderStatus = '已客审';
                }else if(item.orderStatus == 3){
                  item.orderStatus = '已财审';
                }else if(item.orderStatus == 4){
                  item.orderStatus = '已仓审';
                }else if(item.orderStatus == 5){
                  item.orderStatus = '已拣货';
                }else if(item.orderStatus == 6){
                  item.orderStatus = '已验货';
                }else if(item.orderStatus == 7){
                  item.orderStatus = '已打包';
                }else if(item.orderStatus == 8){
                  item.orderStatus = '已称重';
                }else if(item.orderStatus == 9){
                  item.orderStatus = '已发货';
                }else if(item.orderStatus == 10){
                  item.orderStatus = '已完成';
                }else if(item.orderStatus == 11){
                  item.orderStatus = '已取消';
                }else if(item.orderStatus == 20){
                  item.orderStatus = '已分配拣货位';
                }

                // 退款状态
                if(item.refundStatus == 1){
                  item.refundStatus = '未退款'
                }else if(item.refundStatus == 2){
                  item.refundStatus = '退款中'
                }else if(item.refundStatus == 3){
                  item.refundStatus = '已退款'
                }
                // 是否加急
                if(item.urgentFlag == false){
                  item.urgentFlag = '否';
                }else if(item.urgentFlag == true){
                  item.urgentFlag = '是';
                }
                  item.index = index + 1;

                item.sourceOrderNo = (item.orderType == 3 || item.orderType == 4) ? '' : item.sourceOrderNo;//平台单号
              });
              //通过仓库id获取快递列表
              this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version + "/getExpressListBeanGroupByStorageId", {
                storageId:storageId.join(',')
              }).then((response) => {
                if (response.data.success) {
                  this.orderList = res.data.result.rows;

                  this.total = res.data.result.total;
                  this.orderList = this.tableHandle(this.orderList,response.data.result);
                  /*  //清空表格选中
                    this.orderLists = [];
                    this.orderIds = '';
                    this.orderList = response.data.result.rows;

                    this.total = response.data.result.total;
                    this.page = response.data.result.page;
                    this.size = response.data.result.size;
                    //拆分完成
                    if(param1 == 'split'){
                      setTimeout(()=>{
                        this.gridOptions.api.forEachNode( function (node) {
                          param2.forEach((item,i)=>{
                            if(item == node.data.salesOrderId){
                              node.setSelected(true);
                            }
                          })
                        })
                      },600)
                    }*/
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "warning"
                  });
                }
              })
            }
          })
      }
      this.query();
    },
    mounted() {
      // 表格内修改，如果权限则调用鼠标滑过方法
      if(this.authorityCode.WMS_STOCKDIFFBILL_TABLEAMEND){
        //鼠标划过铅笔
        this.mouseHover();
      }


      //渲染表格高度
      this.renderTableHeight();
      // 点击订单详情，返回后记住之前的选择
      // sessionStorage.setItem('high_search',this.higeSearchFlag)
      this.higeSearchFlag = sessionStorage.getItem('high_search');

      // 异常原因
      this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/'+ this.version + '/abnormalReasonList')
        .then( (res) => {
          if(res.data.success == true){
            for (var i = 0; i < 3; i++) {
              if(i == 0){
                res.data.result.push({abnormalReason: '已退款',reasionId: i})
              }else if(i == 1){
                res.data.result.push({abnormalReason: '退款中',reasionId: i})
              }
            }
            this.warehouseType = res.data.result;
            //  console.log(this.warehouseType,88888888888);
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
    }
  };
</script>

<style scoped>
  .deleteBox{
    text-align: center;
  }
  #tools ul {
    margin-top: -53px;
  }

  #tools ul li {
    float: left;
  }



  .order-export-left p {
    margin-top: 15px;
  }
  #searchBox .el-col-6 {
    width: 19% !important;;
  }
  .el-tag .el-icon-close {
    position: absolute;
    top: 3px;
    right: 2px;
  }
</style>
<style>
  .changeSelect .multiselect-native-select {
    width: 60% !important;
    margin-left: -4px;
  }
</style>
