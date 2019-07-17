<!--库区 贾南风-->
<template>
  <div id="storageFarm">
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>所属仓库：</label>
              <select id="example-post" name="multiselect[]" multiple="multiple">
                <option  v-for="item in store" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>库区类型：</label>
              <select id="example-post1" name="multiselect[]" multiple="multiple">
                <option  v-for="item in storageType" :value="item.value">{{item.label}}</option>
              </select>
              <!--<el-select  placeholder="请选择库位类型" v-model="queryData.sectionType">
                <el-option
                  v-for="item in storageType"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>-->
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>库区名称：</label>
              <el-input placeholder="请输入库区名称" v-model="queryData.sectionName" :maxlength="26"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button size="mini" type="primary" @click="queryMuch">查 询</el-button>
        <el-button size="mini"  @click="resetQuery">重 置</el-button>
      </div>
    </div>
    <div class="col-nav" style="margin:0 0 10px;">
      <ul>
        <li @click="addStorageFarm('addData')" v-if="authorityCode.WMS_STORAGEFARM_ADD"><span>添加</span></li>
        <li @click="clickMax" v-if="authorityCode.WMS_STORAGEFARM_BIGSMALL"><span>库位最大容量设置</span></li>
        <li @click="publicLogBtn()" v-if="authorityCode.WMS_STORAGEFARM_LOG"><span>查看日志</span></li>
      </ul>
    </div>
    <!--表格数据-->
    <div class="col-border">
      <el-table
        :data="tableData"
        id="fitTable"
        :height="table_h"
        tooltip-effect="dark"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          prop="sectionName"
          label="库区名称">
        </el-table-column>
        <el-table-column
          prop="storageName"
          :show-overflow-tooltip="true"
          label="所属仓库">
        </el-table-column>
        <el-table-column
          align="center"
          label="库区类型">
          <template slot-scope="scope">
            <span v-if="scope.row.sectionType == 1">拣货区</span>
            <span v-if="scope.row.sectionType == 2">存货区</span>
            <span v-if="scope.row.sectionType == 3">收货区</span>
            <span v-if="scope.row.sectionType == 4">退货区</span>
            <span v-if="scope.row.sectionType == 5">次品区</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="shelfPri"
          label="上下架顺序">
        </el-table-column>
        <el-table-column
          align="center"
          label="是否可上架">
          <template slot-scope="scope">
            <span v-if="scope.row.putawayFlag == true">是</span>
            <span v-if="scope.row.putawayFlag == false">否</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="是否可下架">
          <template slot-scope="scope">
            <span v-if="scope.row.putoutFlag == true">是</span>
            <span v-if="scope.row.putoutFlag == false">否</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="商品库存为0自动解绑">
          <template slot-scope="scope">
            <span v-if="scope.row.unbindFlag == true">解绑</span>
            <span v-if="scope.row.unbindFlag == false">不解绑</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="是否计算可销">
          <template slot-scope="scope">
            <span v-if="scope.row.salesCaclFlag == true">是</span>
            <span v-if="scope.row.salesCaclFlag == false">否</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          width="300"
          prop="description"
          label="备注">
        </el-table-column>
        <el-table-column
          align="center"
          width="100"
          label="状态">
          <template slot-scope="scope">
            <el-switch v-if="authorityCode.WMS_STORAGEFARM_START"  :disabled="scope.row.sectionName == 'S' || scope.row.sectionName == 'T'" v-model="scope.row.enabledFlag" @click.native="clickStart(scope.row)"></el-switch>
            <el-switch v-else disabled v-model="scope.row.enabledFlag"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="amendData(scope.row)" v-if="authorityCode.WMS_STORAGEFARM_AMEND" style="overflow: ">修改</el-button>
            <el-button type="text" :class="{colorS:scope.row.sectionName == 'S' || scope.row.sectionName == 'T'}" @click="deleteData(scope.row)" v-if="authorityCode.WMS_STORAGEFARM_DEL">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
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
    <!--修改库区-->
    <div id="storage1">
      <el-dialog v-dialogDrag
        title="修改库区"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible1"
        width="800px">
        <el-form :model="addData1" :rules="rules1" ref="addData1" label-width="100px" class="demo-addData">
          <el-form-item label="所属仓库：" prop="storageId">
            <el-select v-model="addData1.storageId" placeholder="请选择所属仓库" :disabled="isExit" style="width: 70%" @change="maxOrder(addData1.storageId,2)">
              <el-option v-for="item in store"
                         :key="item.storageName"
                         :label="item.storageName"
                         :value="item.storageId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库区类型：" prop="sectionType">
            <el-select v-model="addData1.sectionType" placeholder="请选择库区类型" :disabled="isExit" style="width: 70%" @change="changeType(addData1)">
              <el-option v-for="item in storageType"
                         :label="item.label"
                         :value="item.value"
                         :key="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库区名称：" prop="sectionName">
            <el-input :maxlength="1" @keyup.native="MyValidate(2)" :disabled="isExit" v-model="addData1.sectionName" style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item label="上下架顺序：" v-if="isExit">
            <el-input v-model.number="addData1.shelfPri" :disabled="isExit" style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item label="上下架顺序：" prop="shelfPri" v-else>
            <el-input v-model.number="addData1.shelfPri"  style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item label="是否可上架：">
            <el-radio-group v-model="addData1.putawayFlag" :disabled="isExit">
              <el-radio :label="true" :disabled="isShow">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否可下架：" >
            <el-radio-group v-model="addData1.putoutFlag" :disabled="isExit">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品库存为0自动解绑：" >
            <el-radio-group v-model="addData1.unbindFlag" :disabled="isExit">
              <el-radio :label="true">解绑</el-radio>
              <el-radio :label="false">未解绑</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否计算可销：">
            <el-radio-group v-model="addData1.salesCaclFlag">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="库位规则：" >
            <el-radio-group v-model="addData1.binRule">
              <el-radio :label="0">一位一品</el-radio>
              <el-radio :label="1">一位多品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：" >
            <el-input type="textarea" :disabled="isExit" v-model="addData1.description" style="width: 70%" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%;text-align: right;margin-top: 20px;">
            <el-button @click="dialogVisible1=false">取 消</el-button>
            <el-button type="primary" @click="amendForm('addData1')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--添加库区-->
    <div id="storage">
      <el-dialog v-dialogDrag
        title="添加库区"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="800px">
        <el-form :model="addData" :rules="rules" ref="addData" label-width="100px" class="demo-addData">
          <el-form-item label="所属仓库：" prop="storageId" >
            <el-select v-model="addData.storageId" placeholder="请选择所属仓库" style="width: 70%" @change="maxOrder(addData.storageId,1)">
              <el-option v-for="item in store"
                         :key="item.storageName"
                         :label="item.storageName"
                         :value="item.storageId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库区类型：" prop="sectionType">
            <el-select v-model="addData.sectionType" placeholder="请选择库区类型" style="width: 70%" @change="changeType(addData)">
              <el-option v-for="item in storageType "
                         :label="item.label"
                         :value="item.value"
                         :key="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库区名称：" prop="sectionName">
            <el-input :maxlength="1" @keyup.native="MyValidate(1)" v-model="addData.sectionName" placeholder="请输入A-Z的一个英文字母做为库区名称" style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item label="上下架顺序：" prop="shelfPri">
            <el-input v-model.number="addData.shelfPri" @keyup.native="addData.shelfPri = addData.shelfPri.replace(/[^\d]/g,'')" style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item label="是否可上架：">
            <el-radio-group v-model="addData.putawayFlag">
              <el-radio :label="true" :disabled="isShow">是</el-radio>
              <el-radio :label="false" >否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否可下架：" >
            <el-radio-group v-model="addData.putoutFlag">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商品库存为0自动解绑：" >
            <el-radio-group v-model="addData.unbindFlag">
              <el-radio :label="true">解绑</el-radio>
              <el-radio :label="false">不解绑</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否计算可销：">
            <el-radio-group v-model="addData.salesCaclFlag">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="库位规则：" >
            <el-radio-group v-model="addData.binRule">
              <el-radio :label="0">一位一品</el-radio>
              <el-radio :label="1">一位多品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：" >
            <el-input type="textarea" v-model="addData.description" style="width: 70%" :maxlength="200"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%;text-align: right;margin-top: 20px;">
            <el-button @click="dialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="submitForm('addData',1)">确 定</el-button>
            <el-button @click="submitForm('addData',2)">确定并继续</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--库区最大容量设置-->
    <div id="maxCapacity">
      <el-dialog v-dialogDrag
        title="库位最大容量设置"
        :close-on-click-modal="false"
        :visible.sync="dialogVisibleMax"
        width="800px">
        <el-form ref="form"  label-width="80px">
          <el-form-item label="库区名称：">
            <div style="max-height: 100px;overflow-y: scroll">
            <el-checkbox-group v-model="farmMax.storageSectionId">
              <el-checkbox v-for="item in tableDataMax" :label="item.storageSectionId" :key="item.storageSectionId" name="type" style="margin: 0  10px">{{item.sectionName}}</el-checkbox>
            </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="库位最大容量：">
            <el-input style="width: 70%" v-model="farmMax.maxQty" type="number" placeholder="请输入库位最大容量" @keyup.native="keyUpNum"></el-input>
          </el-form-item>
          <div>
            <el-table
              :data="tableDataMax"
              :height="160"
              border
              style="width: 100%;">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60">
              </el-table-column>
              <el-table-column
                prop="storageName"
                align="center"
                label="所属仓库">
              </el-table-column>
              <el-table-column
                prop="sectionName"
                align="center"
                label="库区名称">
              </el-table-column>
              <el-table-column
                align="center"
                label="库区类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.sectionType == 1">拣货区</span>
                  <span v-if="scope.row.sectionType == 2">存货区</span>
                  <span v-if="scope.row.sectionType == 3">收货区</span>
                  <span v-if="scope.row.sectionType == 4">退货区</span>
                  <span v-if="scope.row.sectionType == 5">次品区</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="maxQty"
                align="center"
                label="库位最大容量">
              </el-table-column>
            </el-table>
          </div>
          <el-form-item style="width: 100%;text-align: right;margin-top: 20px;">
            <el-button @click="dialogVisibleMax=false">取 消</el-button>
            <el-button type="primary" @click="saveFarmMax">确 定</el-button>
          </el-form-item>
        </el-form>
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
        version: '1.0.0',//版本号
        paramObj: {},// 日志参数
        pulicLogVisible: false,//日志参数
        dog: 0,// 看门狗
        max: '',// 最大值
        table_h: 0,// 高度
        isExit: false,// 初始化创建修改是否可编辑
        dialogVisibleMax: false, // 库区最大容量
        storageType:[// 库区类型
          {value:1,label: '拣货区'},
          {value:2,label: '存货区'},
          {value:3,label: '收货区'},
          {value:4,label: '退货区'},
          {value:5,label: '次品区'}
            ],
        addData: { // 添加数据
          storageId: '',//仓库id
          sectionName: '',//;//仓库名称
          sectionType: '',//库区类型
          description: '',//库区说明
          putawayFlag: true,//是否可上架
          putoutFlag: true,//是否可下架
          shelfPri: '',//上下架顺序
          unbindFlag: true,//库存为0自动解绑
          salesCaclFlag: true,//是否计算可销
          enabledFlag: true,//是否启用
          maxQty: 50, // 库区最大容量
          binRule: 0//库位规则
        },
        farmMax:{ // 库位最大容量设置
          storageSectionId: [],
          maxQty: 50

        },
        tableDataMax:[],//库区最大容量设置
        addData1: '', // 修改数据
        rules: {
          sectionName: [ // 仓库名称
            {required: true, message: '请输入库区名称', trigger: 'blur'},
            /*{min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}*/
          ],
          shelfPri: [ // 上下架顺序
            {required: true, message: '请输入上下架顺序', trigger: 'blur'},
            { type: 'number', message: '上下架顺序必须为数字值',trigger: 'blur'}],
          sectionType: [ //库区类型
            {required: true, message: '请选择库区类型', trigger: 'change'}
          ],
          storageId: [ // 所属仓库
            {required: true, message: '请选择所属仓库', trigger: 'change'}
          ]
        },
        rules1: {
          sectionName: [ // 仓库名称
            {required: true, message: '请输入库区名称', trigger: 'blur'},
          ],
          shelfPri: [ // 上下架顺序
            {required: true, message: '请输入上下架顺序', trigger: 'blur'},
            { type: 'number', message: '上下架顺序必须为数字值',trigger: 'blur'}
          ],
          sectionType: [ //库区类型
            {required: true, message: '请选择库区类型', trigger: 'change'}
          ],
          storageId: [ // 所属仓库
            {required: true, message: '请选择所属仓库', trigger: 'change'}
          ]
        },
        dialogVisible: false, // 添加
        dialogVisible1: false, // 修改
        repulse1:[//
          {id: '', label: '全部'},
          {id: 1, label: '待客审'},
          {id: 2, label: '已客审'},
          {id: 3, label: '已仓审'},
          {id: 4, label: '已分配拣货位'},
          {id: 5, label: '已验货'}
        ],
        warehouseType: [//
          {id: '', label: '全部'},
          {id: 1, label: '验货异常'},
          {id: 2, label: '称重异常'},
          {id: 3, label: '发货异常'}
        ],
        tableData: [],//表格数据
        query: ()=>{},// 方法
        queryStore: ()=>{}, // 所属仓库
        store: [],// 所属仓库
        queryData:{ // 查询数据
          storageId: '',//所属仓库
          sectionName: '',//仓库名称
          sectionType: '',//库区类型
          enableFlag: true,//是否启用
          page: 1, // 页数。
          size: 15, // 页面大小。
        },
        totalPage: 15, // 要显示的条数
        currentPage: 1, //
        totalNum: 0, // 数据总条数
        isShow: false,// 是否可上架
      }
    },
    methods:{
      // 点击查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 14;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      // 点击查看日志
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      // 添加库区上下架顺序
      maxOrder(row,num) {
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/findMaxShelfPri',{storageId: row})
          .then((res) => {
           if(res.data.success == true){
             if(num == 1){
               this.addData.shelfPri = res.data.result + 1;
             }else if(num == 2){
               this.addData1.shelfPri = res.data.result + 1;
             }
           }
          })
      },
      // 库区类型
      changeType(rows) {
        if(rows.sectionType === 3 || rows.sectionType === 4) {
          rows.putawayFlag = false;
          this.isShow = true;
        }else{
          this.isShow = false;
          rows.putawayFlag = true;
        }
      },
      // 调用前获取多选的值
      queryMuch() {
        // 所属仓库
          this.queryData.storageId = $('#example-post').val();
        //  库区类型
          this.queryData.sectionType = $('#example-post1').val();
        this.query(this.queryData)
      },
      // 最大容量验证
      keyUpNum() {
        if(this.farmMax.maxQty < 1 || this.farmMax.maxQty > 9999 || !/^\d+$/.test(this.farmMax.maxQty)) {
          this.farmMax.maxQty = ''
        }
      },
      // 库区名称验证只允许输入26个字母，小写字母转成大写
      MyValidate(num) {
        var reg=/^[a-zA-Z]*$/;
        if(num == 1){// 添加
          if(!reg.test(this.addData.sectionName)){
            this.addData.sectionName = '';
          }else{
            this.addData.sectionName = this.addData.sectionName.toUpperCase();
          }
        }else if(num == 2){ // 修改
          if(!reg.test(this.addData1.sectionName)){
            this.addData1.sectionName = '';
          }else{
            this.addData1.sectionName = this.addData1.sectionName.toUpperCase();
          }
        }

      },
      // 点击库位最大容量设置
      clickMax() {
        this.farmMax.storageSectionId = []
        if(this.tableDataMax.length == 0) {
          this.$message({
            message: '请选择要设置库位容量的库区',
            type: 'warning'
          })
        }else{
          this.farmMax.maxQty = ''
          this.dialogVisibleMax = true
          // 处理库区名称全选
          for(var item of this.tableDataMax){
            this.farmMax.storageSectionId.push(item.storageSectionId)
          }
        }
      },
      // 保存库区最大容量
      saveFarmMax(){
        if(this.farmMax.storageSectionId == ''){
          this.$message({
            message: '请选择要设置的库区名称',
            type: 'warning'
          })
          return false
        }
        if(this.farmMax.maxQty == ''){
          this.$message({
            message: '库位最大容量不能为空',
            type: 'warning'
          })
          return false
        }
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/batchUpdate',this.farmMax)
          .then((res) => {
            if(res.data.success == true){
              this.dialogVisibleMax = false // 关闭弹框
              this.$message({
                message: '设置成功',
                type: 'success'
              })
              this.queryMuch()
              // this.query(this.queryData)
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })

      },
      // 点击修改
      amendData(row) {
        if(row.sectionName == 'S' || row.sectionName == 'T'){
            this.isExit = true;
        }else{
          this.isExit = false;
        }
        this.dialogVisible1 = true;
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/findById',{storageSectionId: row.storageSectionId})
          .then((res) => {
            if (res.data.success == true) {
              this.addData1 = res.data.result;
            } else {
              this.$message({
                message: res.data.msg,// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
      },
      // 点击启用  / 停用
      clickStart(row) {
        if(row.sectionName == 'S' || row.sectionName == 'T'){
          return
        }
        let self = this;
        if (row.enabledFlag === false) {
          self.clickStop(row)
        } else {
         /* self.$confirm('是否启用该库区?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {*/
            self._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + self.version + '/activate',{storageSectionId: row.storageSectionId})
              .then(function (res) {
                if (res.data.success == true) {
                  self.$message({// 给用户一个提示
                    message: '已启用',
                    type: 'success'
                  });
                  self.queryMuch()
                 // self.query(self.queryData)// 重新渲染数据
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
         /* }).catch(() => {
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
        /*this.$confirm('是否停用该库区?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {*/
          // 发请求
            this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/deactivate',{storageSectionId: row.storageSectionId})
            .then( (res) => {
              if (res.data.success == true) {
                this.$message({// 给用户一个提示
                  message: '已停用',
                  type: 'success'
                })
                this.queryMuch()
                //this.query(this.queryData)// 重新渲染数据
              } else{
                row.enabledFlag = true;
                this.$message({
                  message: res.data.msg,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
       /* }).catch(() => {
          row.enabledFlag = true;
            this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })*/
      })
      },
      // 重置按钮
      resetQuery() {
        let arr = [];
        this.store.forEach(item => {
          arr.push(item.storageId)
        });
        $('#example-post').multiselect('select',arr); // 重置所属仓库
        let arr1 = [];
        this.storageType.forEach(item => {
          arr1.push(item.value)
        });
        $('#example-post1').multiselect('select',arr1); // 重置库区类型
        this.queryData.storageId = '';
        this.queryData.sectionName = '';
        this.queryData.sectionType = '';
        this.queryData.nableFlag = '';
      },
      // 点击删除单行数据
      deleteData(row) {
        if(row.sectionName == 'S' || row.sectionName == 'T'){
          return
        }

       /* this.$confirm('是否删除库区《' + row.sectionName + '》', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {*/
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/delete', {storageSectionId: row.storageSectionId})
          .then((res) => {
          if(res.data.success == true){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.queryMuch()
            //this.query(this.queryData)
          }else{
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
          })
      /*  }).catch(() => {
          self.$message({//  取消删除提示
            type: 'info',
            message: '已取消删除'
          })
        })*/

      },
      // 点击添加库区
      addStorageFarm(formName) {
        //this.$refs[formName].resetFields();
        this.isShow = false;
        this.dialogVisible = true;
        this.resetData(formName);
        //this.addData.description = ''; //库区说明
        //this.queryStore(); // 所属仓库
        //this.addData.shelfPri = '';
        //this.addData.sectionType = 1; //库区说明
       /* let timer = setTimeout(() => {
          this.$refs[formName].resetFields();
          console.log(789);
        },1000)*/
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 把参数清空
      resetData(formName) {
        this.$refs[formName].resetFields();
        //this.addData.storageId =  ''; //仓库id
        this.addData.sectionName =  ''; // 仓库名称
        this.addData.sectionType =  1; //库区说明
        this.addData.description =  ''; //库区说明
        this.addData.shelfPri =  ''; //上下架顺序
        this.addData.putawayFlag =  true; //是否可上架
        this.addData.putoutFlag =  true; //是否可下架
        this.addData.unbindFlag =  true; //库存为0自动解绑
        this.addData.salesCaclFlag =  true; //是否计算可销
        this.addData.enabledFlag =  true;//是否启用
        this.addData.binRule = 0 //库位规则
      },
      // 添加的保存
      submitForm(formName, num) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/insert', this.addData)
              .then((res) => {
                  if(res.data.success == true){
                    if (num == 1) {
                      this.dialogVisible = false;
                      this.$message({
                        message: '添加成功',
                        type: 'success'
                      });
                      this.queryMuch()
                      //this.query(this.queryData)
                    } else if (num == 2) {
                      this.$message({
                        message: '添加成功继续添加',
                        type: 'success'
                      });
                      this.resetData(formName);
                      this.queryMuch();
                      //this.query(this.queryData)
                    }
                  }else{
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 修改的保存
      amendForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/update', this.addData1)
              .then((res) => {
                if(res.data.success == true){
                    this.dialogVisible1 = false
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    });
                    this.queryMuch()
                    //this.query(this.queryData)
                }else{
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  });
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //  分页
      //  每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        sessionStorage.setItem('hold_storageFarm_1', val)
        this.queryData.page = this.currentPage;
        this.queryData.size = this.totalPage;
        this.queryMuch()
        //this.query(this.queryData);// 请求数据
      },
      //  当前页
      handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val;
        this.queryData.page = this.currentPage;
        this.queryData.size = this.totalPage;
        this.queryMuch()
        //this.query(this.queryData);// 请求数据
      },
      handleSelectionChange(val) {
        //this.multipleSelection = val;
        console.log(val);
        this.tableDataMax = val

      }
    },
    created(){
      // 所属仓库列表
      this.queryStore = () => {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/findGrantStorageByUser')
          .then((res) => {
            if (res.data.success == true) {
              this.store = res.data.result;
              var value = [];
              for (var item of this.store){
                item.value = item.storageId;
                item.label = item.storageName;
                value.push(item.storageId)
              }
              //console.log(self.plat);
              $('#example-post').multiselect('dataprovider', this.store );
              $('#example-post').multiselect('select',value);
            }
          })
      };
      this.queryStore();
      // 查询数据
      this.query = (data) => {
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/query', data)
          .then((res) => {
            if (res.data.success == true) {
              this.dog = 0;
              var result = res.data.result;
              this.tableData = result.rows;
              this.totalNum = res.data.result.total;
            }
          })
      };
       this.query(this.queryData);
    },
    mounted() {
      var value = [];
      for (var item of this.storageType){
        value.push(item.value);
      }
      //console.log(self.plat);
      $('#example-post1').multiselect('dataprovider', this.storageType );
      $('#example-post1').multiselect('select',value);


      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      $('#example-post1').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      //渲染表格高度
      this.$nextTick(function() {
        this.table_h = $(window).height() - $('.col-border').offset().top - 95;
      });
      window.onresize = () => {
        this.table_h = $(window).height() - $('.col-border').offset().top - 95;
      };
      if(sessionStorage.getItem('hold_storageFarm_1') != null){
        this.totalPage = parseInt(sessionStorage.getItem('hold_storageFarm_1'))
      }
    }
  }
</script>
<style scoped>
  .colorS{
    color: #9d9d9d;
  }
</style>
<style>
  #storage .el-form-item__label{
    width: 170px!important;
  }
  #storage .el-form-item__error{
    left:70px!important;
    top:92%!important;
  }
  #storage .el-form-item{
    margin-bottom: 10px;
  }
  #storage1 .el-form-item__label{
    width: 170px!important;
  }
  #storage1 .el-form-item__error{
    left:70px!important;
    top:92%!important;
  }
  #storage1 .el-form-item{
    margin-bottom: 10px;
  }
  #maxCapacity .el-form-item__label{
    width: 110px!important;
  }

</style>
