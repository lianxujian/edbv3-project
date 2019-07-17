<!--店铺  贾南风-->
<template>
  <div id="shop">
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content" style="white-space: nowrap">
              <label for="example-post">平台类型：</label>
              <select id="example-post" name="multiselect[]" multiple="multiple">
                <option  v-for="item in plat" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>店铺名称：</label>
              <el-input v-model="query.storeName" placeholder=""></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>授权状态：</label>
              <el-select v-model="query.authStatus" clearable placeholder="请选择">
                <el-option
                  v-for="item in state"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>启用状态：</label>
              <el-select v-model="query.enabledFlag" clearable placeholder="请选择">
                <el-option
                  v-for="item in state1"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox1">
        <el-button size="mini" type="primary" @click="queryData">查 询</el-button>
      </div>
    </div>
    <div style="clear:both"></div>
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="addButton()" v-if="authorityCode.DATA_SHOP_ADD"><span>添加</span></li>
        <li @click="publicLogBtn()" v-if="authorityCode.DATA_SHOP_ADD"><span>查看日志</span></li>
      </ul>
    </div>
    <div>
      <el-table
        ref="box"
        id="fitTable"
        tooltip-effect="dark"
        :height="table_h"
        :data="tableData"
        border>
        <el-table-column
          width="50"
          align="center"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="storeName"
          :show-overflow-tooltip="true"
          label="店铺名称">
        </el-table-column>
        <el-table-column
          prop="ecName"
          label="平台类型">
        </el-table-column>
        <el-table-column
          align="center"
          prop="authStatus"
          label="授权状态">
        </el-table-column>
        <el-table-column
          align="right"
          prop="authStartTime"
          label="授权时间">
        </el-table-column>
        <el-table-column
          align="right"
          prop="authEndTime"
          label="授权到期时间">
        </el-table-column>
        <el-table-column
          align="right"
          prop="contactsPhone"
          label="联系人手机">
        </el-table-column>
        <el-table-column
          align="center"
          width="100"
          label="启用状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabledFlag" v-if="authorityCode.DATA_SHOP_START" @click.native="clickStart(scope.row)"></el-switch>
            <el-switch v-model="scope.row.enabledFlag" v-else disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small" v-if="authorityCode.DATA_SHOP_AMEND">修改</el-button>
            <el-button type="text" size="small" @click="handle(scope.row)" v-if="authorityCode.DATA_SHOP_ACCREDIT">平台授权</el-button>
            <el-button type="text" size="small" style="color:red" @click="delData(scope.row)" v-if="authorityCode.DATA_SHOP_DEL">删除</el-button>
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
    <!--<div class="col-pagination">
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100,200]"
        :page-size="totalPage"
        layout="total, prev, next,pager,sizes,jumper"
        :total="totalNum">
      </el-pagination>
    </div>-->
    <!--添加店铺-------------------------------------------------------添加店铺------------------------------------------------------->
    <div>
      <el-dialog v-dialogDrag
        title="添加店铺"
        :visible.sync="centerDialogVisible"
        width="700px"
      >
        <el-row :gutter="20" style="margin-top: -30px;">
          <el-col :span="20" :offset="2">
            <div class="grid-content bg-purple">
              <div class="fix">
                <div class="fix-l"><label><span class="xin">* </span>店铺名称：</label></div>
                <el-input v-model="add.storeName" :maxlength="50" placeholder="最多支持输入50个字符，名称不允许重复"
                          style="width:65%;"></el-input>
              </div>
              <div class="fix">
                <div class="fix-l"><label><span class="xin">* </span>平台类型：</label></div>
                <el-select v-model="add.ecId" placeholder="请选择平台类型" style="width:65%;">
                  <el-option
                    v-for="item in plat"
                    :key="item.ecName"
                    :label="item.ecName"
                    :value="item.ecId">
                  </el-option>
                </el-select>
              </div>
              <div class="fix">
                <div class="fix-l"><label> 联系人手机：</label></div>
                <el-input v-model="add.contactsPhone" @keyup.native="add.contactsPhone=add.contactsPhone.replace(/[^\d]/g,'')" placeholder="请输入联系人手机" :maxlength="40" style="width: 65%"></el-input>
              </div>
              <div class="fix">
                <div class="fix-l"><label><span class="xin">* </span> 默认仓库：</label></div>
                <el-select v-model="add.defStorageId" placeholder="请选择默认仓库" style="width: 65%">
                  <el-option
                    v-for="item in warehouse"
                    :key="item.storageName"
                    :label="item.storageName"
                    :value="item.storageId">
                  </el-option>
                </el-select>
              </div>
              <div class="fix">
                <div class="fix-l"><label> 默认快递：</label></div><!--<span class="xin">* </span>-->
                <el-select v-model="add.defExpressId" clearable placeholder="请选择默认快递" style="width: 65%">
                  <el-option
                    v-for="item in express1"
                    :key="item.expressId"
                    :label="item.expressName"
                    :value="item.expressId">
                  </el-option>
                </el-select>
              </div>
              <div class="fix">
                <div class="fix-l"><label> 默认货到付款快递：</label></div><!--<span class="xin">*</span>-->
                <el-select v-model="add.defPodExpressId" clearable placeholder="请选择默认快递" style="width: 65%">
                  <el-option
                    v-for="item in express"
                    :key="item.expressId"
                    :label="item.expressName"
                    :value="item.expressId">
                  </el-option>
                </el-select>
              </div>
              <div class="fix">
                <div class="check">
                  <el-row :gutter="20" style="margin-bottom: 20px;">
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-checkbox-group v-model="add.enabledFlag">
                          <el-checkbox>启用店铺</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-checkbox-group v-model="add.expsheetFlag">
                          <el-checkbox>启用电子面单</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-checkbox-group v-model="add.autoDlOrderFlag">
                          <el-checkbox>自动下载订单</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-col>
                  </el-row>
                  <!--<el-row :gutter="20" style="margin-bottom: 20px;">
                    <el-col :span="7">
                      <div class="grid-content bg-purple">
                        <el-checkbox-group v-model="add.autoDlOrderFlag">
                          <el-checkbox>自动下载订单</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-col>
                    <el-col :span="7">
                      <div class="grid-content bg-purple">
                        <el-checkbox-group v-model="add.autoDlAsFlag">
                          <el-checkbox>自动下载售后单</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-col>
                    <el-col :span="7">
                      <div class="grid-content bg-purple">
                        <el-checkbox-group v-model="add.autoDlGoodsFlag">
                          <el-checkbox>自动下载商品</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-col>
                  </el-row>-->
                  <el-row :gutter="20" style="margin-bottom: 20px;">
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-checkbox-group v-model="add.autoDlAsFlag">
                          <el-checkbox>自动下载售后单</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-checkbox-group v-model="add.synInvFlag">
                          <el-checkbox>自动同步库存</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-checkbox-group v-model="add.cainiaoOrderFlag">
                          <el-checkbox>获取菜鸟自动流转单</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div style="text-align: right">
          <el-button  style="width: 100px;" @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" style="width: 100px;" @click="addData(1)">保 存</el-button>
          <el-button type="primary" style="width: 108px;" @click="addData(2)">保存并继续</el-button>
        </div>
      </el-dialog>
    </div>
    <!--修改店铺-----------------------------------------------------修改店铺----------------------------------------------------->
    <div style="text-align: left;">
      <el-dialog v-dialogDrag
        title="修改店铺"
        :visible.sync="centerShop"
        width="700px"
      >
        <el-row :gutter="22" style="margin-top: -30px;">
          <el-col :span="18" :offset="2">
            <div class="grid-content bg-purple">

              <div class="fix">
                <div class="fix-l"><label><span class="xin">*</span>店铺名称：</label></div>
                <el-input v-model="amend.storeName" :maxlength="50" placeholder="最多支持输入50个字符，名称不允许重复"
                          style="width:65%;"></el-input>
              </div>
              <div class="fix">
                <div class="fix-l"><label>  <span class="xin">* </span>平台类型：</label></div>
                <el-input v-model="plantName" :disabled="true" style="width: 65%"></el-input>


                <!--<el-select v-model="amend.platId" placeholder="请选择平台类型" :disabled="true" style="width: 49%">
                  <el-option
                    v-for="item in plat"
                    :key="item.ecName"
                    :label="item.ecName"
                    :value="item.platId">
                  </el-option>
                </el-select>-->
              </div>
              <div class="fix">
                <div class="fix-l"><label>联系人手机：</label></div>
                <el-input v-model="amend.contactsPhone" @keyup.native="add.contactsPhone=add.contactsPhone.replace(/[^\d]/g,'')" :maxlength="40" placeholder="请输入联系人手机" style="width: 65%"></el-input>
              </div>
              <div class="fix">
                <div class="fix-l"><label><span class="xin">* </span>默认仓库：</label></div>
                <el-select v-model="amend.defStorageId" placeholder="请选择默认仓库" style="width: 65%">
                  <el-option
                    v-for="item in warehouse"
                    :key="item.storageName"
                    :label="item.storageName"
                    :value="item.storageId">
                  </el-option>
                </el-select>
              </div>
              <div class="fix">
                <div class="fix-l"><label>默认快递：</label></div><!--<span class="xin">* </span>-->
                <el-select v-model="amend.defExpressId" clearable placeholder="请选择默认快递" style="width: 65%">
                  <el-option
                    v-for="item in express1"
                    :key="item.expressId"
                    :label="item.expressName"
                    :value="item.expressId">
                  </el-option>
                </el-select>
              </div>
              <div class="fix">
                <div class="fix-l"><label>默认货到付款快递：</label></div><!--<span class="xin">* </span>-->
                <el-select v-model="amend.defPodExpressId" clearable placeholder="请选择默认快递" style="width: 65%">
                  <el-option
                    v-for="item in express"
                    :key="item.expressId"
                    :label="item.expressName"
                    :value="item.expressId">
                  </el-option>
                </el-select>
              </div>
              <div class="fix">
                <div class="check">
                  <el-checkbox-group>
                    <el-row :gutter="20" style="margin-bottom: 20px;">
                      <el-col :span="8">
                        <div class="grid-content bg-purple">
                          <el-checkbox-group v-model="amend.enabledFlag">
                            <el-checkbox>启用店铺</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="grid-content bg-purple">
                          <el-checkbox-group v-model="amend.expsheetFlag">
                            <el-checkbox>启用电子面单</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="grid-content bg-purple">
                          <el-checkbox-group v-model="amend.autoDlOrderFlag">
                            <el-checkbox>自动下载订单</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-col>
                    </el-row>
                    <!--<el-row :gutter="20" style="margin-bottom: 20px;">
                      <el-col :span="7">
                        <div class="grid-content bg-purple">
                          <el-checkbox-group v-model="amend.autoDlAsFlag">
                            <el-checkbox>自动下载售后单</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-col>
                      &lt;!&ndash;<el-col :span="7">
                        <div class="grid-content bg-purple">
                          <el-checkbox-group v-model="amend.autoDlGoodsFlag">
                            <el-checkbox>自动下载商品</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-col>&ndash;&gt;
                    </el-row>-->
                    <el-row :gutter="20" style="margin-bottom: 20px;">
                      <el-col :span="8">
                        <div class="grid-content bg-purple">
                          <el-checkbox-group v-model="amend.autoDlAsFlag">
                            <el-checkbox>自动下载售后单</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="grid-content bg-purple">
                          <el-checkbox-group v-model="amend.synInvFlag">
                            <el-checkbox>自动同步库存</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="grid-content bg-purple">
                          <el-checkbox-group v-model="amend.cainiaoOrderFlag">
                            <el-checkbox>获取菜鸟自动流转单</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </el-col>
                    </el-row>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div style="text-align: right">
          <el-button  @click="centerShop=false">取 消</el-button>
          <el-button type="primary"  @click="upData()">保 存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--平台授权-->
    <div>
      <el-dialog v-dialogDrag
        title="平台授权"
        :visible.sync="centerP"
        width="700px"
        :before-close="handleClose"
      >
        <a :href="URL" target="_blank"
           @click="handleClose"
           style="border: 1px solid #BCBCBC;margin: 16px 0 0 1px;display: inline-block;border-radius: 5px;width:60px;height:26px;margin-top: -40px;cursor: pointer;line-height: 26px;text-align: center">自动授权</a>
        <el-row :gutter="20" style="margin-top: -10px;">
          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purple">
              <div class="fix">
                <div class="fix-l"><label>店铺名称：</label></div>
                <el-input v-model="platIm.storeName" placeholder="请输入店铺名称" disabled
                          style="width:65%"></el-input>
              </div>
              <div class="fix">
                <div class="fix-l"><label>平台类型：</label></div>
                <el-select v-model="platIm.ecId" placeholder="请选择平台类型" disabled style="width: 65%;">
                  <el-option
                    v-for="item in plat"
                    :key="item.ecId"
                    :label="item.ecName"
                    :value="item.ecId">
                  </el-option>
                </el-select>
              </div>
              <div class="fix">
                <div class="fix-l"><label><span class="xin">* </span>APP key：</label></div>
                <el-input v-model="platIm.appkey" type="password" autocomplete="off" placeholder="请输入Appkey"
                          style="width:65%;"></el-input>
              </div>
              <div class="fix">
                <div class="fix-l"><label><span class="xin">* </span>Secrets：</label></div>
                <el-input v-model="platIm.secrets" type="password" autocomplete="off" placeholder="请输入Secrets"
                          style="width:65%"></el-input>
              </div>
              <div class="fix" v-if="a3">
                <div class="fix-l"><label><span class="xin">* </span>Token：</label></div>
                <el-input v-model="platIm.token" type="password" autocomplete="off" placeholder="请输入Token"
                          style="width:65%"></el-input>
              </div>
              <div class="fix" v-if="a4">
                <div class="fix-l"><label><span class="xin">* </span>uin：</label></div>
                <el-input v-model="platIm.dangdangUid" type="password" autocomplete="off" placeholder="请输入uin"
                          style="width:65%"></el-input>
              </div>
              <div class="fix" v-if="a5">
                <div class="fix-l"><label><span class="xin">* </span>客服ID：</label></div>
                <el-input v-model="platIm.dangdangCsId" type="password" autocomplete="off" placeholder="请输入客服ID"
                          style="width:65%"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button  @click="centerP=false">取 消</el-button>
           <el-button type="primary"  @click="platSave()">保 存</el-button>
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
  import { turnTimestamp, turnTimestamp2, checkLogQuery } from '@/assets/js/validate';
  import publicLog from '@/components/common/publicLog.vue';
  export default {
    components: {
      'v-Publiclog': publicLog
    },
    data() {
      return {
        plantName: '', // 平台名称
        queryFn: () => {}, // 定义方法全局调用
        query1: () => {},// 定义方法全局调用
        paramObj:{},// 日志接受参数
        pulicLogVisible:false,// 日志
        shopUpload:process.env.FILE_API, // 上传地址
        //timer: '',
        authorityCode: sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},// 权限code
        version: '1.0.0',// 版本号
        plat: [], // 平台类型
        /*1是已授权  2是未授权  3是失效*/
        state: [
          { name: '全部', id: ''},
          { name: '已授权', id: 1 },
          { name: '未授权', id: 2 },
          { name: '授权失效', id: 3 }
        ], // 授权状态
        state1: [
          { name: '全部',id: ''},
          { name: '启用', id: true },
          { name: '停用', id: false }
        ], // 启用状态
        express: '', // 默认货到付款快递
        express1: '', // 默认快递
        warehouse: '', // 默认仓库
        tableData: [], // 表格信息
        centerDialogVisible: false, // 添加
        centerShop: false, // 修改
        centerP: false, // 授权
        checkL: false, // 日志
        query: { // 查询条件
          storeName: '', // 店铺名称。
          ecId: '',// 平台id。
          authStatus: '',// 授权状态id。
          enabledFlag: '', // 是否启用。
          merchantId: 0,// 商户id。
          page: 1,
          size: 15
        },
        URL: '',// 授权访问地址
        platIm: {}, // 平台授权
        /*platImName: {
          storeName: '',
          ecId: '',
          ecName: ''
        },*/
        amend: '', // 修改店铺
        add: {
          storeId: '', // 店铺id，新增则置空。
          storeName: '', // 店铺名称。
          ecId: '', // 平台id。
          contactsPhone: '', // 手机。
          defStorageId: '', // 默认仓库id。
          defExpressId: '', // 默认快递id。
          defPodExpressId: '', // 货到付款默认快递id。
          expsheetFlag: false, // 是否启用电子面单。
          autoDlOrderFlag: true, // 是否自动下载订单。
          autoDlAsFlag: true, // 是否自动下载售后单。
          autoDlGoodsFlag: true, // 是否自动下载商品。
          synInvFlag: true, // 是否自动同步库存。
          cainiaoOrderFlag: false, // 是否下载菜鸟自动流转单。
          enabledFlag: true, // 是否启用。
          merchantId: 0, // 商户id。
        },
        // 判断是哪个平台
        a1: true,
        a2: true,
        a3: true,
        a4: true,
        a5: true,
        currentPage: 1,
        totalPage: 15, // 要显示的条数
        totalNum: 0, // 数据总条数
        success: false, // 看门
        table_h: 0// 表格高度
      }
    },
    methods: {
      // 关闭平台授权弹框
      handleClose() {
        this.centerP = false;
        //window.clearInterval(this.timer);
      },
      // 点击查看日志
      publicLogBtn(){
        this.paramObj.moduleId= 10;
        this.paramObj.billCode='';
        this.paramObj.typeId='';
        this.pulicLogVisible = true
      },
      // 传给查看日志的方法
      changDialogShow(){
        this.pulicLogVisible=false;
      },
      //监听全局enter触发的模糊查询--------------------------------------全局enter-----------------------------------------------------------全局enter
      overallBody(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if (e && e.keyCode === 13) {//如果按下的enter,进入
          this.queryData()//调用模糊查询的方法
        }
      },
      // 删除行数据
      delData(row) {
        let self = this
        self.$confirm('是否删除店铺《' + row.storeName + '》?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/delete',{storeId: row.storeId,merchantId: 0})
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                self.queryFn(self.query)// 重新渲染数据
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
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 点击启用  / 停用
      clickStart(row) {
        let self = this;
        if (row.enabledFlag === false) {
          self.clickStop(row)
        } else {
          self.query.page = self.currentPage;
          self.query.size = self.totalPage;

          self.$confirm('是否启用该店铺?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            // 发请求
            self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/activate',{storeId: row.storeId,merchantId: 0})
              .then(function (res) {
                if (res.data.code == 0) {
                  self.$message({// 给用户一个提示
                    message: '已启用',
                    type: 'success'
                  });
                  self.queryFn(self.query)// 重新渲染数据
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
          }).catch(() => {
            row.enabledFlag = false;
            self.$message({
              type: 'info',
              message: '已取消启用'
            })
          })
        }
      },
      // 点击停用
      clickStop(row) {
        let self = this;
        self.query.page = self.currentPage;
        self.query.size = self.totalPage;
        self.$confirm('是否停用该店铺?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          // 发请求
          self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/deactivate',{storeId: row.storeId,merchantId: 0})
            .then(function (res) {
              if (res.data.code == 0) {
                self.$message({// 给用户一个提示
                  message: '已停用',
                  type: 'success'
                })
                self.queryFn(self.query)// 重新渲染数据
              } else {
                row.enabledFlag = true;
                self.$message({
                  message: res.data.msg, // 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function (err) {
              console.log(err)
            })
        }).catch(() => {
          row.enabledFlag = true;
          self.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      },
      /* // 确定并继续
       sureGo() {
         let self = this
         self.addData(true);
         console.log(self.success);
         if (self.success) {// 当请求成时再去调用此方法
           console.log(456);
           self.addButton();
         }
       },*/
      // 点击添加按钮
      addButton() {
        //let title = 'http://edb.centaur.cn/edbtp/oauthhome.aspx?p=淘宝&e=edb_a64971&s=1&f=edb&r=http://www.edbv3.com/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/bai/callback?clToken='+localStorage.getItem('clToken').replace(/\+/g, "%2B")+'&';
        //console.log(localStorage.getItem('clToken').replace(/\+/g, "%2B"),88888888);
        let self = this;
        self.query1();
        self.add.storeName = '';// 店铺/**/
        self.add.ecId = '';
        self.add.storeId = '';
        self.add.contactsPhone = '';
        self.add.defStorageId = '';
        self.add.defExpressId = '';
        self.add.defPodExpressId = '';
        self.add.expsheetFlag = false;
        self.add.autoDlOrderFlag = true;
        self.add.autoDlAsFlag = true;
        self.add.autoDlGoodsFlag = true;
        self.add.synInvFlag = true;
        self.add.cainiaoOrderFlag = false;
        self.add.enabledFlag = true; // console.log(self.success);
        self.success = false;
        self.centerDialogVisible = true;// 显示弹层
      },
      // 添加店铺--确定按钮
      addData(num) {
        let self = this;
        // 店铺不能为空
        if (!self.add.storeName.trim()) {
          self.$message({
            message: '请输入店铺名称',
            type: 'warning'
          });
          return false
        } else if (self.add.storeName.length > 50) {
          self.$message({
            message: '店铺最多支持输入50个字符',
            type: 'warning'
          });
          return false
        }
        // 平台类型不能为空
        if (!self.add.ecId) {
          self.$message({
            message: '请选择平台类型',
            type: 'warning'
          });
          return false
        }
        // 验证手机号
        if (self.add.contactsPhone) {
          if (!(/^\d{1,40}$/.test(self.add.contactsPhone))) {
            // 如果手机号有值，验证是否正确
            self.$message({
              message: '输入数值型且不能超过40字符',
              type: 'warning'
            });
            return false
          }
        }
        // 默认仓库为必选项
        if (!self.add.defStorageId) {
          self.$message({
            message: '默认仓库为必选项',
            type: 'warning'
          });
          return false;
        }
       /* // 默认快递为必选项
        if (!self.add.defExpressId) {
          self.$message({
            message: '默认快递为必选项',
            type: 'warning'
          });
          return false
        }
        // 默认货到付款快递为必选项
        if (!self.add.defPodExpressId) {
          self.$message({
            message: '默认货到付款快递为必选项',
            type: 'warning'
          });
          return false
        }*/
        /* // 启用状态不能为空
         if (!self.add.isenable) {
           self.$message({
             message: '请选择状态',
             type: 'warning'
           })
           return false
         }*/
        // 请求传参
        self.add.storeName = self.add.storeName.trim()
        self.query.page = self.currentPage
        self.query.size = self.totalPage
        self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/insert',self.add)
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({// 给用户一个提示
                message: '添加店铺成功',
                type: 'success'
              });
              if (num == 1) {
                self.queryFn(self.query);// 重新渲染数据
                self.centerDialogVisible =  false;
              }else if(num == 2) {
                self.centerDialogVisible =  true;
                self.addButton()
              }
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 当前页
      handleCurrentChange(val) {
        console.log(val);
        this.currentPage = val;
        this.query.page = this.currentPage;
        this.query.size = this.totalPage;

        this.queryFn(this.query); // 请求数据
      },
      // 分页
      // 每页多少条
      handleSizeChange(val) {
        console.log(val);
        this.totalPage = val;
        sessionStorage.setItem('hold_shopFiles_1', val);
        this.query.page = this.currentPage;
        this.query.size = this.totalPage;
        this.queryFn(this.query);// 请求数据
      },
      // 修改
      handleClick(row) {
        console.log(row);
        this.plantName = row.ecName
        for(var item of this.plat) {
          if(item.ecId == row.ecId){
            this.plantName = item.ecName
          }
        }
        let self = this;
        self.query1();
        self.centerShop = true;
        self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version  + '/findEditBeanById',{storeId: row.storeId,merchantId: 0})
          .then(function (res) {
            if (res.data.code == 0) {
              self.amend = res.data.result; // 接受数据
            } else {
              self.$message({
                message: res.data.msg, // 如果code为其他，弹出错误码
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 修改里的保存
      upData() {
        let self = this
        // 店铺不能为空
        if (!self.amend.storeName.trim() || self.amend.storeName.length > 50) {
          self.$message({
            message: '店铺名不能为空且最多支持输入50个字符',
            type: 'warning'
          });
          return false;
        }
        // 平台类型不能为空
        if (!self.amend.ecId) {
          self.$message({
            message: '请选择平台类型',
            type: 'warning'
          });
          return false;
        }

        if (!self.amend.defStorageId) {
          self.$message({
            message: '默认仓库为必选项',
            type: 'warning'
          });
          return false;
        }
       /* if (!self.amend.defExpressId) {
          self.$message({
            message: '默认快递为必选项',
            type: 'warning'
          });
          return false;
        }*/
        // 验证手机号
        if (self.amend.contactsPhone) {
          if (!(/^\d{1,40}$/.test(self.amend.contactsPhone))) {
            // 如果手机号有值，验证是否正确
            self.$message({
              message: '手机号是数值型且不能超过40字符',
              type: 'warning'
            })
            return false
          }
        }
        /* if (self.amend.telephone) {
           if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(self.amend.telephone))) {
             // 如果手机号有值，验证是否正确
             self.$message({
               message: '不是完整的11位手机号或者正确的手机号前七位',
               type: 'warning'
             });
             return false;
           }
         }*/
        self.amend.storeName = self.amend.storeName.trim();
        this.query.page = this.currentPage;
        this.query.size = this.totalPage;
        self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/update',self.amend)
          .then(function (res) {
            if (res.data.code == 0) {
              self.centerShop = false;
              self.$message({
                message: '修改成功',
                type: 'success'
              })
              self.queryFn(self.query)// 重新渲染数据
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
      // 平台授权
      handle(row) {
        let token = sessionStorage.getItem('clToken') ? sessionStorage.getItem('clToken') : localStorage.getItem('clToken');
        //console.log(token);
        //console.log(row,row.ecName,898989);
        let variable = row.ecId;
        let arr = 1;
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/findGrantBeanById',{storeId: row.storeId})
          .then((res) =>  {
            if (res.data.code == 0) {
              this.platIm = res.data.result;// 接受平台授权状态
              variable = parseInt(variable);
               /* this.timer = setInterval(()=> {
                  this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/findGrantBeanById',{storeId: row.storeId})
                    .then(res => {
                      if(res.data.code == 0){
                        this.platIm = res.data.result;// 接受平台授权状态
                      }
                    })
                },5000);*/
              switch (variable) {
                // 1号店2.0
                case 1:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 360shop
                case 2:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 当当
                case 7:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = true;
                  break;
                // 淘宝
                case 14:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = true;
                  break;
                // 淘宝分销
                case 15:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 亚马逊
                case 16:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = true;
                  break;
                // 京东
                case 17:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 阿里巴巴
                case 18:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 库巴
                case 19:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 优购
                case 20:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 邮乐
                case 21:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 聚美优品 shopex_general
                case 22:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 走秀
                case 25:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 建行善融
                case 29:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 苏宁
                case 30:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 唯品会
                case 32:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 蘑菇街
                case 34:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 美丽说 工商银行
                case 35:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 工商银行
                case 38:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                  //贝贝网
                case 39:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 楚楚街
                case 41:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 口袋购物
                case 43:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 微盟
                case 44:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 360Shop微分销
                case 45:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 速卖通
                case 49:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 天猫
                case 51:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = true;
                  break;
                // 宝宝树
                case 52:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = true;
                  break;
                // 卷皮网
                case 53:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 优物库
                case 56:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 孩子王
                case 61:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 亲宝宝
                case 62:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 卖客星球
                case 63:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 百联
                case 66:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 苏宁特卖
                case 69:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = true;
                  break;
                // 楚楚通
                case 71:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 分期乐
                case 72:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 有赞
                case 73:
                  this.a3 = false;
                  this.a4 = false;
                  this.a5 = false;
                  break;
                // 千米网
                case 77:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                  // 京东2
                case 82:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                  // 蘑菇街小店
                case 85:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = false;
                  break;
                // 苏宁自营
                case 86:
                  this.a3 = true;
                  this.a4 = true;
                  this.a5 = true;
                  break;
                default:
                  this.a3 = true;
                  this.a4 = false;
                  this.a5 = false;
        }                                                                                                       // http://www.edbv3.com/api/com.edb01.erp.mdata.service.api                         localStorage.getItem('clToken').replace(/\+/g, "%2B")

              if(row.ecName == '京东'){
                this.URL = 'http://edb.centaur.cn/edbtp/oauthhome.aspx?p=' + row.ecName + '2&e=edb_a64971&s=1&f=edb&r=http://'+ this.shopUpload +'/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/callback?clToken='+ encodeURIComponent(encodeURIComponent(encodeURIComponent(encodeURIComponent(token)))) +'.storeId=' + row.storeId + '&';
              }else{
                if(row.ecName == '天猫'){
                  row.ecName = '淘宝';
                  this.URL = 'http://edb.centaur.cn/edbtp/oauthhome.aspx?p=' + row.ecName + '&e=edb_a64971&s=1&f=edb&r=http://'+ this.shopUpload +'/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/callback?clToken='+ encodeURIComponent(encodeURIComponent(encodeURIComponent(encodeURIComponent(token)))) +'.storeId=' + row.storeId + '&';
                }else{
                  this.URL = 'http://edb.centaur.cn/edbtp/oauthhome.aspx?p=' + row.ecName + '&e=edb_a64971&s=1&f=edb&r=http://'+ this.shopUpload +'/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/callback?clToken='+ encodeURIComponent(encodeURIComponent(encodeURIComponent(encodeURIComponent(token)))) +'.storeId=' + row.storeId + '&';

                }
              }
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
        this.centerP = true;// 开启弹层
      },
      // 平台授权里的保存
      platSave() {
        let self = this;
        // appkey不能为空
        if(self.a1) {
          if (!self.platIm.appkey) {
            self.$message({
              message: '请输入appkey',
              type: 'warning'
            });
            return false
          }
        }
        if (self.a2) {
          // secrets不能为空
          if (!self.platIm.secrets) {
            self.$message({
              message: '请输入secrets',
              type: 'warning'
            });
            return false;
          }
        }
        if (self.a3) {
          // token不能为空
          if (!self.platIm.token) {
            self.$message({
              message: '请输入token',
              type: 'warning'
            });
            return false;
          }
        }
        if (self.a4) {
          if(!self.platIm.dangdangUid) {
            self.$message({
              message: '请输入uin',
              type: 'warning'
            });
            return false;
          }
        }
        if (self.a5) {
          if (!self.platIm.dangdangCsId) {
            self.$message({
              message: '请输入客服ID',
              type: 'warning'
            });
            return false;
          }
        }
        // 请求数据
        self._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/grant',self.platIm)
          .then(function(res) {
            if (res.data.code == 0) {
              self.centerP = false; // 关闭弹层
              self.$message({
                message: '保存成功',
                type: 'success'
              });
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },
      // 查询--------------------------------------------------------------------------------------查询
      queryData() {
        let self = this;
        if ($('#example-post').val().length == self.plat.length) {
          self.query.ecId = ''
        }else {
          self.query.ecId = $('#example-post').val();
        }
        self.queryFn(self.query)// 调用请求数据方法
      }
    },
    created() {
      if(sessionStorage.getItem('hold_shopFiles_1') !== null) {
        this.totalPage = parseInt(sessionStorage.getItem('hold_shopFiles_1'))
      }
      // 把所有的a标签里的href编码
      var a = document.getElementsByTagName('a')
      for (var i = 0, len = a.length; i < len; i++) {
        a[i].href = encodeURI(a[i].href)
        // console.log(a[i].href, 13);
      }
      this.query1 = () => {
        let self = this;
        // 默认快递
        // 默认货到付款快递
        self._post('com.edb01.erp.wms.service.api.ExpressService/' + self.version + '/listExpress')
          .then(function (res) {
            if (res.data.code == 0) {
              self.express1 = res.data.result; // 接受默认快递数据
              self.express = res.data.result; // 接受默认快递数据
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
       /* // 默认货到付款快递
        self._post('com.edb01.erp.wms.service.api.ExpressService/' + self.version + '/listExpress')
          .then(function (res) {
            if (res.data.code == 0) {
              self.express = res.data.result // 接受默认快递数据
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })*/
        // 默认仓库
        self._post('com.edb01.erp.wms.service.api.WmStorageService/' + self.version + '/list')
          .then(function (res) {
            if (res.data.code == 0) {
              self.warehouse = res.data.result // 接受默认仓库数据
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      };
      let self = this;
      // 平台类型---页面初始化
      self._post('com.edb01.erp.mdata.service.api.EcService/' + self.version + '/getEcBeanList')
        .then(function(res) {
          if (res.data.code == 0) {
            self.plat = res.data.result; // 接受平台类型数据
            var value = []
            for (var item of self.plat){
              item.value = item.ecId;
              item.label = item.ecName;
              value.push(item.ecId)
            }
            //console.log(self.plat);
            $('#example-post').multiselect('dataprovider', self.plat );
            $('#example-post').multiselect('select',value);
          } else {
            self.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
        .catch(function (err) {
          console.log(err)
        });

      // 页面初始化数据--------------------------------------------------------初始化---------------------------------初始化
      this.queryFn = (pare) => {
        let str = '';
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + self.version + '/query',pare)
          .then((response) => {
            if (response.data.code === 0) {
              response.data.result.rows.forEach(item => {
                // 通过平台ID找到对应的平台
               /* this.plat.forEach(item1 => {
                  if(item.ecId == item1.ecId){
                    item.ecName = item1.ecName;
                  }
                });*/
               /* for(var item1 of this.plat){
                  if(item.ecId == item1.ecId){
                    this.$set(item,"ecName", item1.ecName);
                    break;
                  }
                }*/
                if (item.authStatus == 1) {
                  item.authStatus = '已授权';
                } else if (item.authStatus == 2) {
                  item.authStatus = '未授权';
                } else if (item.authStatus == 3) {
                  item.authStatus = '授权失败';
                }else{
                  item.authStatus = '未授权';
                }
                // 转换授权时间戳并把为null的字段过滤掉
                if (item.authEndTime == undefined) {
                  item.authEndTime = '00:00:00'
                } else {
                  item.authEndTime = turnTimestamp(item.authEndTime)
                }
                // /转换授权到期时间戳并把为null的字段过滤掉
                if (item.authStartTime == undefined) {
                  item.authStartTime = '00:00:00'
                } else {
                  item.authStartTime = turnTimestamp(item.authStartTime)
                }
              })

              this.totalNum = response.data.result.total; // 数据的总条数
              this.tableData = response.data.result.rows; // 接受所有的数据

            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      };

      let component = this;
    },
    mounted() {
      // 表格数据
      let par = {
        storeName: '', // 店铺名称。
        ecId: '',// 平台id。
        authStatus: '',// 授权状态id。
        enabledFlag: '', // 是否启用。
        merchantId: 0,// 商户id。
        page: this.currentPage,
        size: this.totalPage,
      };
      this.queryFn(par); // 初始化调用
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight;// 页面高度
        var b = document.getElementById('fitTable').offsetTop; // 表格距离顶部的距离
        this.table_h = a - b - 94;
      });
      window.onresize = () => {
        this.table_h = $(window).height() - $('#fitTable').offset().top - 94;
      };
      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });

      //监听全局enter 回车事件
      document.body.addEventListener( 'keyup' , this.overallBody, false) //监听全局的键盘按下   第三个参数是否启用捕获，一般是false
    }
  }
</script>
<style scoped>
 /* input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    box-shadow:0 0 0 60px white inset!important;
    -webkit-text-fill-color: #878787!important;
  }
  input[type=password]:focus{
    border: 1px solid blue!important;
  }*/
  .fix {
    margin-top: 20px;
    white-space: nowrap;
  }

  .fix-l {
    display: inline-block;
    width: 120px;
    text-align: right;
  }

  .check {
    margin-left: 60px;
  }

  .xin {
    color: red;
  }
</style>

