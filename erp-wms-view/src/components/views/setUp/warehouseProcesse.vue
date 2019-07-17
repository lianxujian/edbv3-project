<!--仓库流程
子流程：入库流程设置——秋香
子流程：出库流程设置——秋香
子流程：订单生产流程设置——尘音
子流程：平台订单发货状态设置——尘音-->
<template>
  <div id="warehouseProcesse">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">

      <!--入库设置 秋香-->
      <el-tab-pane label="入库流程设置" name="first">
        <div style="margin:0 0 10px">
          <div>
            <el-button v-if="authorityCode.WMS_WAREHOUSEPROCESSE_EDIT1" size="mini" type="primary" @click="addRo()"  :disabled="this.tableOne.length==0">+ 添加</el-button>
          </div>
          <div ref='ff' style="margin-top: 50px;" v-for="(item,index) in tableOne" >
            <div style='margin:20px 0;'>
              <ul>
                <li class="wrapper-li" :id="item.id">
                  <el-row style='margin:10px 0;'>
                    <el-col :span='24'>
                      <label>请选择入库类型：</label>
                      <span>
                 <div style="display: inline-block">
                  <span>
                       <el-checkbox v-model="item.cg" >采购入库</el-checkbox>
                  </span>
                  <span>
                       <el-checkbox  v-model="item.xt">销退入库</el-checkbox>
                  </span>
                  <span>
                        <el-checkbox v-model="item.db">调拨入库</el-checkbox>
                  </span> <span>
                        <el-checkbox v-model="item.qt">其他入库</el-checkbox>
                  </span>
                 </div>
                <el-button  @click="handleDeleteOne(index)"  type="text" size="small" style="color: #0000FF;margin-left: 20px"   v-if="index != 0 && authorityCode.WMS_WAREHOUSEPROCESSE_EDIT1" >删除</el-button>
            </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span='24'>
                      <div>
                        <span>创建入库单</span>
                        <span style="margin: 0 20px 0 65px">————</span>
                        <span>确认入库</span>
                        <span style="position: relative">
                      <el-switch style="position: absolute;left:1px;top:-3px"  v-model="item.affirmInFlag"></el-switch>
                    </span>

                        <span style="margin: 0 20px 0 65px">————</span>
                        <span>质检</span>
                        <span style="position: relative">
                      <el-switch style="position: absolute;left:1px;top:-3px" v-model="item.qcFlag"></el-switch>
                    </span>
                        <span style="margin: 0 20px 0 65px">————</span>
                        <span>提交上架</span>
                        <span style="margin: 0 20px 0 65px">————</span>
                        <span>商品上架</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row style='margin:10px 0;'>
                    <el-col :span="1.5"><div class="grid-content bg-purple">
                      <label>生效仓库：</label>
                    </div></el-col>
                    <el-col :span="22"><div class="grid-content bg-purple-light">
                      <el-checkbox-group v-model="item.storageIdList"  style="display:inline-block;width:80%;" > <!--wmStorageBeanList-->
                        <el-checkbox  v-for="(item,index) in storeOne" style="margin: 0 10px 10px 10px" :label="item.storageId"  :key="index">{{index + 1}} {{item.storageName}}</el-checkbox>
                      </el-checkbox-group>
                    </div></el-col>
                  </el-row>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!--页脚-->
        <div class="wmsFoot">
          <el-button v-if="authorityCode.WMS_WAREHOUSEPROCESSE_EDIT1" type="primary" @click="saveOne()">保 存</el-button>
        </div>
      </el-tab-pane>

      <!--出库设置 秋香-->
      <el-tab-pane label="出库流程设置" name="second">
        <div style="margin:0 0 10px">
          <div>
            <el-button v-if="authorityCode.WMS_WAREHOUSEPROCESSE_EDIT2" size="mini" type="primary" @click="addAll" :disabled="this.tableData.length==0" >+ 添加</el-button>
          </div>
          <div ref='ff' id='ff' style="margin-top: 50px" v-for="(item,index) in tableData">
            <div id="goods-edit" style='margin:20px 0;'>
              <ul>
                <li class="wrapper-li" :id="item.id">
                  <el-row style='margin:10px 0;'>
                    <el-col :span='24'>
                      <label>请选择出库类型：</label>
                      <span>
                 <div style="display: inline-block">
                  <span>
                       <el-checkbox   v-model="item.cg">采购退货</el-checkbox>
                  </span>
                  <span>
                       <el-checkbox  v-model="item.db">调拨出库</el-checkbox>
                  </span>
                  <span>
                        <el-checkbox  v-model="item.qt">其他出库</el-checkbox>
                  </span>
                 </div>
                <el-button  @click="handleDelete(index)" type="text" size="small" style="color: #0000FF;margin-left: 20px"   v-if="index != 0 && authorityCode.WMS_WAREHOUSEPROCESSE_EDIT2" >删除</el-button>
            </span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span='24'>
                      <label>创建出库单</label>
                      <span style="font-size: 24px;line-height: 14px;color: #cccccc;" class="dog">→  </span><span>审核</span>
                      <span style="font-size: 24px;line-height: 24px;color: #cccccc;margin-top: 20px" class="dog">→  </span><span>分配拣货人</span>
                      <span style="font-size: 24px;line-height: 24px;color: #cccccc;" class="dog">→  </span><span>拣货</span>
                      <span style="font-size: 24px;line-height: 24px;color: #cccccc;" class="dog">→  </span><span>验货</span>
                      <el-select id="isSuit" v-model="item.examineType" filterable placeholder="全部" style="width: 120px" >
                        <el-option
                          v-for="item in ids"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <span style="font-size: 24px;line-height: 24px;color: #cccccc;" class="dog">→  </span><span>商品出库</span>
                    </el-col>
                  </el-row>
                  <el-row style='margin:10px 0;'>
                    <el-col :span="1.5"><div class="grid-content bg-purple">
                      <label>生效仓库：</label>
                    </div></el-col>
                    <el-col :span="22"><div class="grid-content bg-purple-light">
                      <el-checkbox-group  v-model="item.wmStorageBeanList" style="display:inline-block;width:80%;" > <!--wmStorageBeanList-->
                        <el-checkbox  v-for="(item,index) in store" style="margin: 0 10px 10px 10px" :label="item.storageId"  :key="index">{{index + 1}} {{item.storageName}}</el-checkbox>
                      </el-checkbox-group>
                    </div></el-col>
                  </el-row>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!--页脚-->
        <div class="wmsFoot">
          <el-button v-if="authorityCode.WMS_WAREHOUSEPROCESSE_EDIT2" type="primary" @click="saveData()">保 存</el-button>
        </div>
      </el-tab-pane>

      <!--订单生产流程设置 尘音-->
      <el-tab-pane label="订单生产流程设置" name="three">
        <div style="margin:0 0 10px">
          <div style="margin-left: 20px">
            <el-button v-if="authorityCode.WMS_WAREHOUSEPROCESSE_EDIT3" size="mini" type="primary" @click="addProcess" :disabled="this.processData.length==0">+ 添加</el-button>
          </div>
          <div style="margin-bottom: 200px">
            <div style="margin: 20px 0 20px 20px">
              <span>默认流程</span>
              <span style="color: #ccc;margin-left: 10px">在仓库没有单独进行生成流程设置的时候，默认按照默认流程进行处理，在设置了新流程后，系统按照该仓库该波次类型单独设置的流程进行订单生产流程的处理</span>
            </div>
            <div style="margin: -15px 0 20px 20px">
              <span style="visibility: hidden">默认流程</span>
              <span style="color: #ccc;margin-left: 10px">若关闭任何一个或者两个操作节点，则订单状态直接进入最后一个被关闭的节点状态，比如开启验货、关闭称重、开启发货，那么验货完成后订单状态直接更新为已称重</span>
            </div>
            <div v-for="(val,index) in processData">
              <div style="padding: 0 20px">
                <div :style="{'background': val.bgColor,'padding': '20px 30px'}">
                  <div style="margin-bottom: 30px">
                    <label>生效仓库：</label>
                    <span style="margin-left: 10px;display: inline-block;width: 300px" v-if="val.system">全部</span>
                    <div style="margin-left: 10px;display: inline-block;width: 300px" v-if="!val.system" >
                      <el-select :disabled="val.isDisabled" @change="stockSelectAll(val,index)" v-model="val.storageIdList" filterable multiple collapse-tags
                                 style="margin-left: 20px;" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in optionsStock"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>

                    <label>波次类型：</label>
                    <span style="margin-left: 10px;display: inline-block;width: 300px" v-if="val.system">全部</span>
                    <div style="margin-left: 10px;display: inline-block;width: 300px" v-if="!val.system" >
                      <el-select :disabled="val.isDisabled" @change="typeSelectAll(val,index)" v-model="val.waveTypeList" filterable multiple collapse-tags
                                 style="margin-left: 20px;" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in optionsType"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <!--<div style="display: inline-block">-->
                      <!--<span v-if="val.isShow" @click="deleteClick(val,index,processData)" style="color: red">删除</span>-->
                      <!--<span style="color: blue">修改</span>-->
                    <!--</div>-->
                  </div>
                  <div>
                    <span>分配波次</span>
                    <span style="margin: 0 20px">————</span>
                    <span>拣货</span>
                    <span style="margin: 0 20px">————</span>
                    <span>验货</span>
                    <span style="position: relative">
                      <el-switch :disabled="val.isDisabled" style="position: absolute;left:1px;top:-3px" v-model="val.examineFlag"></el-switch>
                    </span>
                    <span style="margin: 0 20px 0 65px">————</span>
                    <span>称重</span>
                    <span style="position: relative">
                      <el-switch :disabled="val.isDisabled" style="position: absolute;left:1px;top:-3px" v-model="val.weighFlag"></el-switch>
                    </span>
                    <span style="margin: 0 20px 0 65px">————</span>
                    <span>发货</span>
                    <span style="position: relative">
                      <el-switch :disabled="val.isDisabled" style="position: absolute;left:1px;top:-3px" v-model="val.sendoutFlag"></el-switch>
                    </span>
                    <div style="margin-left: 150px;display: inline-block">
                      <a v-if="val.isShow && authorityCode.WMS_WAREHOUSEPROCESSE_EDIT3" @click="deleteClick(val,index,processData)" style="color: red">删除</a>
                      <a v-if="val.isEditShow && authorityCode.WMS_WAREHOUSEPROCESSE_EDIT3" @click="editClick(val,index,processData)" style="color: blue;margin-left: 10px">修改</a>
                      <a v-if="val.isHoldShow" @click="holdClick(val,index,processData)" style="color: blue;margin-left: 10px">保存</a>
                    </div>
                  </div>
                </div>
              </div>
              <div style="border-bottom: 1px dashed #E3E0E0;margin: 20px 0"></div>
            </div>
          </div>
        </div>
        <!--页脚-->
        <!--<div class="wmsFoot">-->
          <!--<el-button type="default" @click="backClick()">取 消</el-button>-->
          <!--<el-button type="primary" @click="sureClick()">确 定</el-button>-->
        <!--</div>-->
      </el-tab-pane>

      <!--平台订单发货状态设置 尘音-->
      <el-tab-pane label="平台订单发货状态设置" name="four">
        <div style="margin:0 0 10px">
          <div style="margin-left: 20px">
            <el-button size="mini" v-if="authorityCode.WMS_WAREHOUSEPROCESSE_EDIT4" type="primary" @click="addSendGoods" :disabled="this.sendGoodsData.length==0">+ 添加</el-button>
          </div>
          <div style="margin-top: 20px">
            <el-table id="tableH" :data="sendGoodsData" border :max-height="table_h" style="width: 100%">
              <el-table-column label="序号" type="index" align="center" width="45"></el-table-column>

              <el-table-column label="平台发货节点" width="350" align="center">
                <template slot-scope="scope">
                  <div style="display: inline-block" v-if="scope.row.isSendShow">
                    <span v-if="scope.row.sendoutStatusNode == 4">已仓审</span>
                    <span v-if="scope.row.sendoutStatusNode == 20">已分配拣货位</span>
                    <span v-if="scope.row.sendoutStatusNode == 6">已验货</span>
                    <span v-if="scope.row.sendoutStatusNode == 8">已称重</span>
                    <span v-if="scope.row.sendoutStatusNode == 9">已发货</span>
                  </div>

                  <el-select v-else id="adjustState" v-model="scope.row.sendoutStatusNode" filterable placeholder="请选择">
                    <el-option
                      v-for="(item,index) in optionsSendGoods"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="平台" >
                <template slot-scope="scope">
                  <span v-if="scope.$index == 0" style="display: block;text-align: center">全部</span>
                  <div v-else style="display:block;">
                    <el-tag
                      v-if="scope.row.isTagShow == true"
                      v-for="(tag,index) in scope.row.terraceBeans"
                      :key="index"
                      type="info">
                      {{tag.terraceName}}
                    </el-tag>
                    <div v-if="scope.row.isTagShow == false">
                      <el-tag
                        v-for="(tag,index) in scope.row.terraceBeans"
                        :key="index"
                        closable
                        @close="handleClose(tag,scope.row.terraceBeans)"
                        type="info">
                        {{tag.terraceName}}
                      </el-tag>
                      <!--平台添加按钮-->
                      <span @click="addTerraceClick(scope.row,scope.$index)" style="line-height: 30px;font-size: 16px" class="el-icon-circle-plus"></span>
                      <el-dialog v-dialogDrag
                        id="dialogBox"
                        title="选择平台"
                        :visible.sync="choseDialogVisible"
                        width="520px"
                        center>

                        <div class="contentBox">
                          <!--搜索区-->
                          <div id="searchBox">
                            <el-row>
                              <div class="grid-content">
                                <el-input v-model="ecName" style="width: 340px!important;" @keyup.enter.native="choseSearch" maxlength="100" placeholder="请输入需要查询的平台信息，多个平台使用“,”隔开"></el-input>
                                <el-button style="float: right" @click="choseSearch" size="mini" type="primary">查 询</el-button>
                              </div>
                            </el-row>
                          </div>
                          <!--表格2-->
                          <div>
                            <div class="pDown" style="position: relative">
                              <el-table
                                id="tableH" :data="tableTerraceData" border :max-height="300" style="width: 100%"
                                ref="multipleTable"
                                @selection-change="handleSelectionChange">

                                <el-table-column
                                  align="center"
                                  type="selection"
                                  width="55">
                                </el-table-column>

                                <el-table-column label="平台">
                                  <template slot-scope="scope">
                                    {{ scope.row.ecName }}
                                  </template>
                                </el-table-column>

                              </el-table>
                            </div>
                          </div>
                        </div>

                        <span slot="footer" class="dialog-footer">
                          <el-button @click="choseDialogVisible = false">取 消</el-button>
                          <el-button type="primary" @click="choseWaveOk(scope.row,scope.$index)">确 认</el-button>
                        </span>
                      </el-dialog>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="状态" align="center" width="150">
                <template slot-scope="scope">
                  <span v-if="scope.$index == 0">开启</span>
                  <div v-else>
                    <el-switch :disabled="scope.row.isDisabled" v-model="scope.row.enabledFlag"></el-switch>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="177" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.isEditShow && authorityCode.WMS_WAREHOUSEPROCESSE_EDIT4" @click="handleModifyClick(scope.row)" type="text" size="small">修改</el-button>
                  <el-button v-if="scope.row.isHoldShow" @click="handleHoldClick(scope.row)" type="text" size="small">保存</el-button>

                  <el-button v-if="scope.row.isDelShow && scope.$index != 0 && authorityCode.WMS_WAREHOUSEPROCESSE_EDIT4" @click="handleDelClick(scope.row)" ref="del" type="text" size="small" style="color: red">删除</el-button>
                  <el-button v-if="scope.row.isBackShow" @click="handleBackClick(scope.row)" ref="del" type="text" size="small" style="color: red">取消</el-button>
                </template>
              </el-table-column>

            </el-table>

          </div>
        </div>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  export default {
    components: {

      pagination,dataTime
    },
    data() {
      return {
        version: '1.0.0',
        /*入库信息*/
        tableOne:[],//入库数据
        affirmInFlag:false,//是否确认入库
        qcFlag:false,//是否质检
        qt:false,//其他出库 0为开启
        cg: false,//采购出库
        db:false,//调拨出库
        xt:false,//销退
        isStatusOne:false,//删除
        storeOne:[],//生效仓库

        /*出库信息*/
        tableData: [],//出库单数据
        store: [], // 生效的仓库
        qt:false,//其他出库 0为开启
        cg: false,//采购出库
        db:false,//调拨出库
        examineType: '',//0为明细 1为整单
        type: '',//类型
        ids: [{
          value: 0,
          label: '验明细'
        },
          {
            value: 1,
            label: '仅验单据'
          }
        ],//验货下拉
        id: 1,//测试
        isStatus: true,//删除
        storageIds:[],//仓库

        /**
         * chenYin
         */

        //订单生成
        activeName: 'first',//tab切换
        processData:[],//流程数据
        optionsStock: [{value: '', label: '全部'}],//仓库下拉
        oldStockOptions: [],//上次已选仓库
        oldTypeOptions: [],//上次已选类型

        optionsType: [
          {value: '', label: '全部'},
          {value: '1002', label: '自定义波次'},
          {value: '1003', label: '大宗订单波次'},
          {value: '1004', label: '单品订单波次'},
          {value: '1005', label: '单件混合波次'},
          {value: '1006', label: '多品订单波次'}
        ],//波次类型下拉

        //平台订单
        sendGoodsData: [],//发货状态表格数据
        table_h: 0,//表格高度

        optionsSendGoods: [
          {value: 4, label: '已仓审'},
          {value: 20, label: '已分配拣货位'},
          {value: 6, label: '已验货'},
          {value: 8, label: '已称重'},
          {value: 9, label: '已发货'}
        ],//平台发货节点下拉
        choseDialogVisible: false,//平台修改弹框显示隐藏
        tableTerraceData: [],//平台列表数据
        ecName: '',//平台查询条件
        multipleSelection: [],//已选平台

        clickLimit: 1,//点击限制
        clickLimit1: 1,//点击限制

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限
      }
    },
    computed: {
    },
    methods: {

      /***
       * 入库信息
       */
      scrollTo(){
        console.log(555);

  },
      // 添加按钮
      addRo(){
         this.tableOne.push({db: false,cg:false,xt:false,qt:false,qcFlag:false,affirmInFlag:false,storageIdList: []})
        this.tableOne.forEach((item,index) => {
          if(index == this.tableOne.length-1){
            item.id = 'box';
          }else{
            item.id = index;
          }
        })
        setTimeout(() => {
          document.getElementById("box").scrollIntoView();
        },800)
      },

      //初始化入库
      list:function () {
        this._post('com.edb01.erp.wms.service.api.WmInWorkflowSetupService/' + this.version + '/showSetup').then(function (res) {
          if(res.data.code==0) {
            this.tableOne=res.data.result

            for(var item of res.data.result){
              if(item.db==4){
                item.db=true
              }
              if(item.cg==1){
                item.cg=true
              }
              if(item.xt==2){
                item.xt=true
              }
              if(item.qt==8){
                item.qt=true
              }
            }
          }
          this.isStatusOne=false
          for(var item in item.storageIdList){
            this.storageIds.push(item);
          }
        }.bind(this));
      },

      //删除
      handleDeleteOne(index){
        var self = this;
        self.$confirm('确定要删除此流程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true
        }).then(() => {
          this.tableOne.splice(index, 1);
          if(this.tableOne.length == 1){
            this.isStatusOne = false;
          }else{
            this.isStatusOne = true;
          }
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      //保存
      saveOne:function(){//cg:1,db:4,xt:2,qt:8
        let data= [];
        var self = this;
        self.tableOne.forEach(item => {
          if(item.cg==true){
            item.cg=1
          }else if(item.cg==false){
            item.cg=0
          }
          if(item.db==true){
            item.db=4
          }else if(item.db==false){
            item.db=0
          }
          if(item.xt==true){
            item.xt=2
          }else if(item.xt==false){
            item.xt=0
          }
          if(item.qt==true){
            item.qt=8
          }else if(item.qt==false){
            item.qt=0
          }
          let str = '';
          item.storageIdList.forEach(item1 => {
            str += item1 + ','
          });
          let obj = {affirmInFlag:item.affirmInFlag,qcFlag:item.qcFlag,storageIdListStr:str.slice(0,-1),cg: item.cg,db: item.db,qt: item.qt,xt: item.xt};

          if(obj.cg==0&obj.db==0&obj.qt==0&obj.xt==0){

          }else{
            data.push(obj);
          }
        });
        data = JSON.stringify(data);
        self._post('com.edb01.erp.wms.service.api.WmInWorkflowSetupService/'+this.version+'/saveSetup',{insertSetupBeanListStr:data})
          .then( res => {
            self.tableOne.forEach(item => {
              if(item.cg==1){
                item.cg=true
              }else if(item.cg==0){
                item.cg=false
              }
              if(item.db==4){
                item.db=true
              }else if(item.db==0){
                item.db=false
              }
              if(item.xt==2){
                item.xt=true
              }else if(item.xt==0){
                item.xt=false
              }
              if(item.qt==8){
                item.qt=true
              }else if(item.qt==0){
                item.qt=false
              }
            });
            if(res.data.success == true){
              self.$message({
                message: '保存成功',
                type: 'success'
              })
              //   this.initMessage();
            }else if(res.data.code==111000201){
              self.tableOne.forEach(item => {
                if(item.cg==1){
                  item.cg=true
                }else if(item.cg==0){
                  item.cg=false
                }
                if(item.db==4){
                  item.db=true
                }else if(item.db==0){
                  item.db=false
                }
                if(item.xt==2){
                  item.xt=true
                }else if(item.xt==0){
                  item.xt=false
                }
                if(item.qt==8){
                  item.qt=true
                }else if(item.qt==0){
                  item.qt=false
                }
              });
              self.$message({
                message: '有仓库的入库类型未设置入库流程！',
                type: 'warning'
              })
            }else if(res.data.code==320000005){
              self.tableData.forEach(item => {
                if(item.cg==1){
                  item.cg = true;
                }else if(item.cg==0){
                  item.cg = false;
                }
                if(item.db==2){
                  item.db=true;
                }else if(item.db==0){
                  item.db=false;
                }
                if(item.qt==4){
                  item.qt=true;
                }else if(item.qt==0){
                  item.qt=false;
                }
              });
              self.$message({
                message: '存在仓库的出库类型未配置出库流程！',
                type: 'warning'
              })
            }else if(res.data.code==320000007){
              self.$message({
                message: '入库类型至少勾选一个！',
                type: 'warning'
              })
              self.tableOne.forEach(item => {
                if(item.cg==1){
                  item.cg=true
                }else if(item.cg==0){
                  item.cg=false
                }
                if(item.db==4){
                  item.db=true
                }else if(item.db==0){
                  item.db=false
                }
                if(item.xt==2){
                  item.xt=true
                }else if(item.xt==0){
                  item.xt=false
                }
                if(item.qt==8){
                  item.qt=true
                }else if(item.qt==0){
                  item.qt=false
                }
              });
            }else if(res.data.code==111000202){
              self.$message({
                message: '有仓库的一个入库类型设置了多个入库流程！',
                type: 'warning'
              })
              self.tableOne.forEach(item => {
                if(item.cg==1){
                  item.cg=true
                }else if(item.cg==0){
                  item.cg=false
                }
                if(item.db==4){
                  item.db=true
                }else if(item.db==0){
                  item.db=false
                }
                if(item.xt==2){
                  item.xt=true
                }else if(item.xt==0){
                  item.xt=false
                }
                if(item.qt==8){
                  item.qt=true
                }else if(item.qt==0){
                  item.qt=false
                }
              });

            }
          })
      },


      /****
       *  出库信息
       */
      //回显数据
      initMessage:function(){
        this._post('com.edb01.erp.wms.service.api.WmOutWorkflowSetupService/'+this.version+'/query').then(function (res) {
          this.tableData=res.data.result;
          for(var item of res.data.result){
            if(item.db==2){
              item.db=true
            }
            if(item.cg==1){
              item.cg=true
            }
            if(item.qt==4){
              item.qt=true
            }
          }
          this.isStatus = false;
          for(var item in item.wmStorageBeanList){
            this.storageIds.push(item);
          }

        }.bind(this));
      },

      // 添加按钮
      addAll(){
        this.tableData.push({db: false,cg:false,qt:false,examineType:0,wmStorageBeanList: []})
        this.tableData.forEach((item,index) => {
          if(index == this.tableData.length-1){
            item.id = 'box1';
          }else{
            item.id = index;
          }
        })
        setTimeout(() => {
          document.getElementById("box1").scrollIntoView();
        },800)
      },

      //删除
      handleDelete(index){
        var self = this;
        self.$confirm('确定要删除此流程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true
        }).then(() => {
          this.tableData.splice(index, 1);
          if(this.tableData.length == 1){
            this.isStatus = false;
          }else{
            this.isStatus = true;
          }
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //保存
      saveData:function(){
        let data= [];
        this.tableData.forEach(item => {
          if(item.cg==true){
            item.cg=1
          }else if(item.cg==false){
            item.cg=0
          }
          if(item.db==true){
            item.db=2
          }else if(item.db==false){
            item.db=0
          }
          if(item.qt==true){
            item.qt=4
          }else if(item.qt==false){
            item.qt=0
          }
          let str = '';
          item.wmStorageBeanList.forEach(item1 => {
            str += item1 + ','
          });
          let obj = {examineType: item.examineType,storageId:str.slice(0,-1),cg: item.cg,db: item.db,qt: item.qt};

          if(obj.cg==0&obj.db==0&obj.qt==0){

          }else{
            data.push(obj);
          }
        });
        data = JSON.stringify(data);
        this._post('com.edb01.erp.wms.service.api.WmOutWorkflowSetupService/'+this.version+'/insert',{outWorkflowSetupJson:data})
          .then( res => {
            this.tableData.forEach(item => {
              if(item.cg==1){
                item.cg = true;
              }else if(item.cg==0){
                item.cg = false;
              }
              if(item.db==2){
                item.db=true;
              }else if(item.db==0){
                item.db=false;
              }
              if(item.qt==4){
                item.qt=true;
              }else if(item.qt==0){
                item.qt=false;
              }
            });

            if(res.data.success == true){
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.initMessage();
            }else if(res.data.code==320000006){
              this.tableData.forEach(item => {
                if(item.cg==1){
                  item.cg = true;
                }else if(item.cg==0){
                  item.cg = false;
                }
                if(item.db==2){
                  item.db=true;
                }else if(item.db==0){
                  item.db=false;
                }
                if(item.qt==4){
                  item.qt=true;
                }else if(item.qt==0){
                  item.qt=false;
                }
              });
              this.$message({
                message: '存在同一个仓库一个出库类型配置了多个出库流程',
                type: 'warning'
              })
            }else if(res.data.code==320000005){
              this.tableData.forEach(item => {
                if(item.cg==1){
                  item.cg = true;
                }else if(item.cg==0){
                  item.cg = false;
                }
                if(item.db==2){
                  item.db=true;
                }else if(item.db==0){
                  item.db=false;
                }
                if(item.qt==4){
                  item.qt=true;
                }else if(item.qt==0){
                  item.qt=false;
                }
              });
              this.$message({
                message: '存在仓库的出库类型未配置出库流程',
                type: 'warning'
              })
            }else if(res.data.code==320000007){
              this.tableData.forEach(item => {
                if(item.cg==1){
                  item.cg = true;
                }else if(item.cg==0){
                  item.cg = false;
                }
                if(item.db==2){
                  item.db=true;
                }else if(item.db==0){
                  item.db=false;
                }
                if(item.qt==4){
                  item.qt=true;
                }else if(item.qt==0){
                  item.qt=false;
                }
              });
              this.$message({
                message: '出库类型至少勾选一个',
                type: 'warning'
              })
            }

          })
      },

      /**
       * chenYin
       */

      //tab切换
      handleClick: function () {
        if(this.activeName == 'first') {

        }else if(this.activeName == 'second') {

        }
      },

      //添加订单生产流程
      addProcess: function () {
        let arr=[];
        this.processData.forEach(function (val) {
          arr.push(val.isHoldShow)
        });
        if(arr.includes(true)){
          this.$alert('您有未保存内容！', {
            confirmButtonText: '知道了',
            center: true,
            type:'info',
          });
        }else {
          this.processData.push({
            bgColor: 'white',
            isShow: true,
            examineFlag: true,
            weighFlag: true,
            sendoutFlag: true,
            isSystem: false,
            isEditShow: false,
            isHoldShow: true,
            isDisabled: false
          });
        }
      },

      //添加保存接口
      initAddSetup: function (val) {
        if(val.storageIdList != undefined && val.waveTypeList != undefined) {
          val.storageIdListStr = val.storageIdList.toString();
          val.waveTypeListStr = val.waveTypeList.toString()
        }
        this._post('com.edb01.erp.wms.service.api.WmOrderFlowSetupService/' + this.version + '/addSetup',val).then(function (res) {
          this.clickLimit1 = 1;
          if(res.data.success) {
            this.$message({
              message: '保存成功!',
              type: 'success'
            });
            val.isEditShow = true;
            val.isHoldShow = false;
            val.isDisabled = true;
            this.initSettingList()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }.bind(this))
      },

      //修改保存接口
      initUpdateSetup: function (val) {
        if(val.storageIdList != undefined && val.waveTypeList != undefined) {
          val.storageIdListStr = val.storageIdList.toString();
          val.waveTypeListStr = val.waveTypeList.toString()
        }
        this._post('com.edb01.erp.wms.service.api.WmOrderFlowSetupService/' + this.version + '/updateSetup',val).then(function (res) {
          if(res.data.success) {
            this.$message({
              message: '保存成功!',
              type: 'success'
            });
            val.isEditShow = true;
            val.isHoldShow = false;
            val.isDisabled = true;
            this.initSettingList()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }.bind(this))
      },

      //删除接口
      initDeleteSetup: function (val) {
        this._post('com.edb01.erp.wms.service.api.WmOrderFlowSetupService/' + this.version + '/deleteSetup',{flowSetupId: val.flowSetupId}).then(function (res) {
          if(res.data.success) {
            this.$message({
              message: '删除成功!',
              type: 'success'
            });
            this.initSettingList()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }.bind(this))
      },

      //校验接口
      initUpdateCheck: function (val,type) {
        this.clickLimit1 = 2;
        if(val.storageIdList != undefined) {
          val.storageIdListStr = val.storageIdList.toString();
        }
        val.storageIds = val.storageIdListStr;
        if(val.system != undefined) {
          val.isSystem = val.system;
        }
        this._post('com.edb01.erp.wms.service.api.WmOrderFlowSetupService/' + this.version + '/updateCheck',val).then(function (res) {

          if(res.data.success) {
            if(res.data.result) {
              this.$message({
                message: '仓库存在未完成订单!',
                type: 'warning'
              });
              setTimeout(() => {
                val.isEditShow = true;
                val.isHoldShow = false;
                this.initSettingList()
              },3000)
            }else {
              if (type == 1) {
                this.initUpdateSetup(val)
              }else if (type == 2) {
                this.initAddSetup(val)
              }else if (type == 3) {
                this.initDeleteSetup(val)
              }
            }
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }.bind(this))
      },

      //保存流程
      holdClick: function (val,index,data) {

        if(val.storageIdList == '') {
          this.$message({
            message: '请选择生效仓库!',
            type:'warning'
          })
        }else if(val.waveTypeList == ''){
          this.$message({
            message: '请选择波次类型!',
            type:'warning'
          })

        }else {

          if(val.flowSetupId) {

            //修改
            if(this.clickLimit1 == 1) {
              this.initUpdateCheck(val,1);
            }

          }else {

            //添加
            if(this.clickLimit1 == 1) {
              this.initUpdateCheck(val,2);
            }

          }
        }

      },

      //修改流程
      editClick: function (val,index,data) {

        if(val.storageIdList == '') {
          this.$message({
            message: '请选择生效仓库!',
            type:'warning'
          })
        }else if(val.waveTypeList == ''){
          this.$message({
            message: '请选择波次类型!',
            type:'warning'
          })

        }else {

          let arr=[];
          data.forEach(function (val) {
            arr.push(val.isHoldShow)
          });
          if(arr.includes(true)){
            this.$alert('您有未保存内容！', {
              confirmButtonText: '知道了',
              center: true,
              type:'info',
            });
          }else {
            val.isEditShow = false;
            val.isHoldShow = true;
            val.isDisabled = false
          }

        }

      },

      //删除流程
      deleteClick: function (val,index,data) {
        if(val.flowSetupId) {

          //校验
          this.initUpdateCheck(val,3);
        }else {
          data.splice(index,1);
          this.$message({
            message: '删除成功!',
            type: 'success'
          });
        }
      },

      //出库仓库
      initStockOut:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listExcludeTri').then(function (res) {
          if(res.data.success) {
            this.initSettingList();//初始化页面数据
            res.data.result.forEach(function (val) {
              this.store=res.data.result;
              this.storeOne=res.data.result;
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this));
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
          if(res.data.success) {
            this.initSettingList();//初始化页面数据
            res.data.result.forEach(function (val) {
              this.optionsStock.push({value: val.storageId,label: val.storageName});
              //this.store=res.data.result;
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this));
      },

      //订单生产流程设置列表接口
      initSettingList: function () {
        this.clickLimit1 = 1;
        this._post('com.edb01.erp.wms.service.api.WmOrderFlowSetupService/'+this.version+'/settingList').then(function (res) {
          if(res.data.success) {
            if(res.data.result.length != 0) {
              res.data.result.forEach((val,index) => {
                val.isEditShow = true;
                val.isHoldshow = false;
                val.isDisabled = true;
                if(val.system) {
                  res.data.result[index].bgColor = '#F2F2F2';
                }else {
                  val.isShow = true;
                  if(res.data.result[index].storageIdListStr) {
                    res.data.result[index].storageIdList = val.storageIdListStr.split(',');
                  }
                  if(res.data.result[index].waveTypeListStr) {
                    res.data.result[index].waveTypeList = val.waveTypeListStr.split(',');
                  }

                  //仓库格式数据
                  if(res.data.result[index].storageIdList) {
                    res.data.result[index].storageIdList.forEach(function (val1,index1) {
                      if(val1 == '') {
                        res.data.result[index].storageIdList.splice(index1,1)
                      }
                    });

                    if(res.data.result[index].storageIdList.length == (this.optionsStock.length) - 1) {
                      res.data.result[index].storageIdList.unshift('')
                    }
                  }

                  //波次格式数据
                  if(res.data.result[index].waveTypeList) {
                    if(res.data.result[index].waveTypeList.length == (this.optionsType.length - 1)) {
                      res.data.result[index].waveTypeList.unshift('')
                    }
                  }
                }
              });
            }

            this.processData = res.data.result;
            console.log(res.data.result,111);
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this));
      },

      //保存接口
      initsaveOrder: function () {
        this.processData.forEach(function (val,index) {
          if(val.storageIdList != undefined && val.waveTypeList != undefined) {
            this.processData[index].storageIdListStr = val.storageIdList.toString();
            this.processData[index].waveTypeListStr = val.waveTypeList.toString()
          }
        }.bind(this));
        let data = {
          orderFlowSetupPOList: JSON.stringify(this.processData)
        };
        console.log(this.processData);
        this._post('com.edb01.erp.wms.service.api.WmOrderFlowSetupService/'+ this.version +'/saveOrderFlowSetup',data).then(function (res) {
          if(res.data.success) {
            this.$message({
              message: '保存成功！',
              type: 'success',
              callback: action => {
                this.initSettingList();
              }
            });

          }else {
            this.$alert(res.data.msg,{
              type: 'info',
              center: true,
              confirmButtonText: '知道了',
            });

          }

        }.bind(this));
      },

      //仓库多选方法
      stockSelectAll(val) {

        let allValues = [];

        //下拉所有值
        for (let item of this.optionsStock) {
          allValues.push(item.value)
        }

        //储存当前最后的结果 作为下次的老数据
        this.oldStockOptions[0] = val.storageIdList;

        // 全部选择
        if(this.oldStockOptions[0] != undefined) {
          if (this.oldStockOptions[0].includes('')) val.storageIdList = allValues;
        }

        // 取消全部选中  上次有 当前没有 表示取消全选
        if(this.oldStockOptions[0] != undefined && this.oldStockOptions[1] != undefined) {
          if (!this.oldStockOptions[0].includes('') && this.oldStockOptions[1].includes('')) val.storageIdList = [];
        }

        // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if(this.oldStockOptions[0] != undefined && this.oldStockOptions[1] != undefined) {
          if (this.oldStockOptions[0].includes('') && this.oldStockOptions[1].includes('')) {
            const index = this.oldStockOptions[0].indexOf('');
            this.oldStockOptions[0].splice(index, 1);// 排除全选选项
            val.storageIdList = this.oldStockOptions[0]
          }
        }

        //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if(this.oldStockOptions[0] != undefined && this.oldStockOptions[1] != undefined) {
          if (!this.oldStockOptions[0].includes('') && !this.oldStockOptions[1].includes('')) {
            if (this.oldStockOptions[0].length === allValues.length - 1) val.storageIdList = allValues
          }
        }

        this.oldStockOptions[1] = val.storageIdList;
      },

      //类型多选方法
      typeSelectAll(val) {

        let allValues = [];
        for (let item of this.optionsType) {
          allValues.push(item.value)
        }
        this.oldTypeOptions[0] = val.waveTypeList;
        if(this.oldTypeOptions[0] != undefined) {
          if (this.oldTypeOptions[0].includes('')) val.waveTypeList = allValues;
        }
        if(this.oldTypeOptions[0] != undefined && this.oldTypeOptions[1] != undefined) {
          if (!this.oldTypeOptions[0].includes('') && this.oldTypeOptions[1].includes('')) val.waveTypeList = [];
        }
        if(this.oldTypeOptions[0] != undefined && this.oldTypeOptions[1] != undefined) {
          if (this.oldTypeOptions[0].includes('') && this.oldTypeOptions[1].includes('')) {
            const index = this.oldTypeOptions[0].indexOf('');
            this.oldTypeOptions[0].splice(index, 1);// 排除全选选项
            val.waveTypeList = this.oldTypeOptions[0]
          }
        }
        if(this.oldTypeOptions[0] != undefined && this.oldTypeOptions[1] != undefined) {
          if (!this.oldTypeOptions[0].includes('') && !this.oldTypeOptions[1].includes('')) {
            if (this.oldTypeOptions[0].length === allValues.length - 1) val.waveTypeList = allValues
          }
        }

        this.oldTypeOptions[1] = val.waveTypeList;
      },

      //确定
      sureClick: function () {
        this.initsaveOrder()
      },

      //取消
      backClick: function () {
        this.initSettingList();
      },

      //平台订单发货状态设置初始数据接口
      initList: function () {
        this._post('com.edb01.erp.wms.service.api.WmTerraceSendoutSetupService/' + this.version + '/list').then(function (res) {
          if(res.data.success) {
            res.data.result.forEach(function (val) {
              val.isSendShow = true;
              val.isTagShow = true;
              val.isEditShow = true;
              val.isHoldShow = false;
              val.isDelShow = true;
              val.isBackShow = false;
              val.isDisabled = true
            });
            this.sendGoodsData = res.data.result
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
          console.log(12,res.data.result);
        }.bind(this))
      },

      //启用状态接口
      initSwitchChange: function (row) {
        let data = {
          terraceSendoutSetupId: row.terraceSendoutSetupId,
          enabledFlag: row.enabledFlag
        };
        this._post('com.edb01.erp.wms.service.api.WmTerraceSendoutSetupService/' + this.version + '/changeStatus',data)
          .then(function (res) {
              if(res.data.success) {
                this.initList()
              }else {
                this.$alert(res.data.msg, {
                  type: 'warning',
                  center: true,
                  confirmButtonText: '确定'
                });
                this.initList()
              }
            }.bind(this)
          )
      },

      //启用状态
      switchChange: function (row) {
        if(row.terraceSendoutSetupId != undefined) {
          this.initSwitchChange(row)
        }
      },

      //删除接口
      initDelete: function (row) {
        let data = {
          terraceSendoutSetupId: row.terraceSendoutSetupId
        };
        this._post('com.edb01.erp.wms.service.api.WmTerraceSendoutSetupService/' + this.version + '/delete',data).then(function (res) {
          if(res.data.success) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.initList()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //平台列表接口
      initQueryEc: function (row,index) {
        this.tableTerraceData = [];
        let data = {
          ecName: this.ecName
        };
        this._post('com.edb01.erp.wms.service.api.WmTerraceSendoutSetupService/' + this.version + '/queryEc',data).then(function (res) {
          if(res.data.success) {
            this.tableTerraceData = res.data.result;
            this.tableTerraceData.forEach(function (val,index) {
              if(row.terraceBeans != undefined) {
                row.terraceBeans.forEach(function (item) {
                  if(item.terraceId == val.ecId) {
                    this.$nextTick(function () {
                      this.$refs.multipleTable.toggleRowSelection(this.tableTerraceData[index])
                    });

                  }

                }.bind(this))
              }

            }.bind(this))
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //修改保存接口
      initUpdate: function (row) {
        let arr = [];
        row.terraceBeans.forEach(function (val) {
          if(val.terraceId) {
            arr.push(val.terraceId)
          }else {
            arr.push(val.ecId)
          }

        });
        let data = {
          terraceSendoutSetupId: row.terraceSendoutSetupId,
          sendoutStatusNode: row.sendoutStatusNode,
          enabledFlag: row.enabledFlag,
          terraceIdsJson: arr.toString()
        };
        console.log('修改传参',data);
        this._post('com.edb01.erp.wms.service.api.WmTerraceSendoutSetupService/' + this.version + '/update',data).then(function (res) {
          if(res.data.success) {
            this.initList()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //添加保存接口
      initAdd: function (row) {
        this.clickLimit = 2;
        let arr = [];
        if(row.terraceBeans != undefined) {
          row.terraceBeans.forEach(function (val) {
            arr.push(val.ecId)
          });
        }

        let data = {
          sendoutStatusNode: row.sendoutStatusNode,
          enabledFlag: row.enabledFlag,
          terraceIdStr: arr.toString()
        };
        console.log('添加传参',data);
        this._post('com.edb01.erp.wms.service.api.WmTerraceSendoutSetupService/' + this.version + '/add',data).then(function (res) {
          this.clickLimit = 1;
          if(res.data.success) {

            this.initList()
          }else {

            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //添加平台发货状态点击
      addSendGoods: function () {
        let arr=[];
        this.sendGoodsData.forEach(function (val) {
          arr.push(val.isHoldShow)
        });
        if(arr.includes(true)){
          this.$alert('您有未保存内容！', {
            confirmButtonText: '知道了',
            center: true,
            type:'info',
          });
        }else {
          this.sendGoodsData.push({isSendShow: false,isTagShow: false,isEditShow: false,
            isHoldShow: true,isDelShow: false,isBackShow: true,enabledFlag: true})
        }
      },

      //平台查询
      choseSearch: function () {
        this.initQueryEc()
      },

      //添加平台
      addTerraceClick: function (row,index) {
        this.choseDialogVisible = true;
        this.initQueryEc(row,index);//平台接口
      },

      //弹框确定
      choseWaveOk: function (row,index) {
        let arr = [];//去除当前行数据
        let brr = [];//拼接其他行平台
        let crr = [];//判断重复数据
        this.sendGoodsData.forEach(function (val,orderNum) {
          if(orderNum != index && orderNum != 0) {
            arr.push(val)
          }
        });
        arr.forEach(function (val) {
          brr = brr.concat(val.terraceBeans)
        });

        this.multipleSelection.forEach(function (val) {
          val.terraceName = val.ecName;
          val.terraceId = val.ecId;
          brr.forEach(function (item) {
            crr.push(item.terraceId == val.ecId);
          })
        });
        if(crr.includes(true)) {
          this.$alert('同一个平台只能设置一个发货节点！', {
            confirmButtonText: '知道了',
            center: true,
            type:'info',
          });
        }else {

          if(this.sendGoodsData[index].terraceBeans) {
            this.sendGoodsData[index].terraceBeans.forEach((val) => {
              this.multipleSelection.forEach((item,num) => {
                console.log(val.terraceId,item.terraceId);
                if(val.terraceId == item.terraceId) {
                  this.multipleSelection.splice(num,1)
                }
              })
            });
            this.sendGoodsData[index].terraceBeans = [...this.sendGoodsData[index].terraceBeans,...this.multipleSelection];
          }else {
            this.sendGoodsData[index].terraceBeans = this.multipleSelection;
          }

          this.choseDialogVisible = false;
        }

      },

      //已选平台
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //点击修改
      handleModifyClick: function (row) {
        let arr=[];
        this.sendGoodsData.forEach(function (val) {
          arr.push(val.isHoldShow)
        });
        if(arr.includes(true)){
          this.$alert('您有未保存内容！', {
            confirmButtonText: '知道了',
            center: true,
            type:'info',
          });
        }else {
          row.isDisabled = false;
          row.isSendShow = false;
          row.isTagShow = false;
          row.isEditShow = false;//修改是否显示
          row.isHoldShow = true;//保存是否显示
          row.isDelShow = false;//删除是否显示
          row.isBackShow = true;//取消是否显示
        }

      },

      //点击保存
      handleHoldClick: function (row) {
        console.log(this.clickLimit);
        if(row.terraceSendoutSetupId != undefined) {
          this.initUpdate(row)
        }else {
          if(this.clickLimit == 1) {
            this.initAdd(row);
          }
        }
      },

      //点击取消
      handleBackClick: function (row) {
        this.initList()
      },

      //删除发货设置
      handleDelClick: function (row) {
        this.initDelete(row)
      },

      //删除平台tag
      handleClose(tag,data) {
        data.splice(data.indexOf(tag), 1);
      },
    },
    mounted(){

      //入库消息
      this.list();

      //仓库回显
      /*   this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list')
           .then(res => {
             this.store = res.data.result;
           });*/
      this.initMessage();
      /* this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list')
         .then(res => {
           this.storeOne = res.data.result;
         });*/

      /**
       * chenYin
       */
      this.initStock();//初始化仓库下拉
      this.initStockOut();//出库仓库下拉

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85 - 120);
        console.log(this.table_h)
      });

      //平台发货初始化
      this.initList();
    },

  }

</script>
<style>
  .wrapper-li{
    border-bottom: 1px dashed #E3E0E0;
  }
  #warehouseProcesse  .col {
    border:1px solid #999999;
    background-color: white;
    width: 50%;
    height: 30px;
  }

  #warehouseProcesse .col ul li {
    float: left;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
  }
  #warehouseProcesse .col ul li {
    padding: 0 50px;
  }

  /*tab*/
  #warehouseProcesse .el-tabs__item {
    padding: 0 60px!important;
    border-bottom: 1px solid #e4e7ed!important;
  }
  #warehouseProcesse .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #e4e7ed!important;
    color: black!important;
    background: #F2F2F2;
  }
  #warehouseProcesse .el-tabs--card>.el-tabs__header {
    border-bottom: none;
  }
  #warehouseProcesse .el-tabs__header {
    margin: 0 0 35px!important;
  }

  /*chenYin*/
  #warehouseProcesse .el-tag--small {
    max-width: 102px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #tableH .el-tag--info{
    margin-right: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .dog {
    position: relative;
    left: 2px;
    top: 2px;
  }
</style>
<style scoped>
  #warehouseProcesse{
    padding: 20px;
  }

  .save{
    position: fixed;
    bottom: 20px;
    right: 0;
    width: 100%;
    text-align: center;
  }
  #scroll {
      position:fixed;
      top:300px;
      right:100px;
         }
  .scrollItem {
      width:20px;
      height:70px;
      border:#e1e1e1 1px solid;
      cursor: pointer;
      text-align: center;
      padding-top: 10px;
        }

</style>
