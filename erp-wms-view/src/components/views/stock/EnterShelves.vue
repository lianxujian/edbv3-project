<!--上架 秋香-->
<template>
  <div id="EnterShelves">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="7">
            <div class="grid-content">
              <el-select style="width: 110px!important;"  filterable placeholder="上架单号" v-model="select1Type" >
                <el-option
                  v-for="item in WmStockPutawayEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input style="width: 192px!important;"  placeholder="" v-model="select1Value" :maxlength="50"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>仓库：</label>
              <el-select id="searchStock"  filterable placeholder="全部" v-model="storageId">
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
              <label>上架类型：</label>
              <el-select id="isSuit"   filterable placeholder="全部" v-model="putawayType">
                <el-option
                  v-for="item in WmStockPutawayTypeEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>上架状态：</label>
              <el-select id="isenable"  filterable placeholder="全部" v-model="putawayStatus">
                <el-option
                  v-for="item in WmStockPutawayStateEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content">
              <el-select style="width: 110px!important;" v-model="timeType" filterable placeholder="创建时间">
                <el-option
                  v-for="item in optionsCreate"
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
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button @click="search" size="mini" type="primary">查 询</el-button>
        <el-button @click="reset" size="mini" type="default">重 置</el-button>
      </div>
    </div>
    <!-- 表头 -->
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="Unassign" v-if="authorityCode.WMS_ENTERSHELVES_ALLOT"><span>分配</span></li>
        <li @click="changeUnassign()" v-if="authorityCode.WMS_ENTERSHELVES_ALLOT"><span> 重新分配</span></li>
        <li @click="print()" v-if="authorityCode.WMS_ENTERSHELVES_PRINT"><span>打印</span></li>
      </ul>
    </div>

    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData"
                id="tableH"
                border
                style="width: 100%"
                border :max-height="table_h"
                @selection-change="handleSelectionChange"
                >
        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          align='center'
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column label="上架单号" width="110">
          <template slot-scope="scope">
            <span style="cursor: pointer;color: blue" @click="clickDetailOne(scope.row)">{{scope.row.stockPutawayNo}}</span>
          </template>
        </el-table-column>

        <el-table-column label="上架类型">
          <template slot-scope="scope">
            <span class="initP-g" v-if="scope.row.putawayType==1001">采购上架</span>
            <span class="initP-g" v-if="scope.row.putawayType==1002">销退上架</span>
            <span class="initP-g" v-if="scope.row.putawayType==1003">返货上架</span>
            <span class="initP-g" v-if="scope.row.putawayType==1004">调拨上架</span>
            <span class="initP-g" v-if="scope.row.putawayType==1005">其他上架</span>
          </template>
        </el-table-column>

        <el-table-column label="上架状态">
          <template slot-scope="scope">
            <span class="cen-g" v-if="scope.row.putawayStatus==1001">待分配</span>
            <span class="cen-g" v-if="scope.row.putawayStatus==1002">待上架</span>
            <span class="cen-g" v-if="scope.row.putawayStatus==1003">上架中</span>
            <span class="cen-g" v-if="scope.row.putawayStatus==1004">已上架</span>
          </template>
        </el-table-column>

        <el-table-column label="来源单号">
          <template slot-scope="scope">
            <span style="cursor: pointer;color: blue" @click="clickDetail(scope.row)">{{scope.row.sourceOrderNo}}</span>
           <!--<p class="cen-g">{{ scope.row.sourceOrderNo }}</p>-->
          </template>
        </el-table-column>

        <el-table-column label="来源单据类型">
          <template slot-scope="scope">
            <span class="cen-g" v-if="scope.row.sourceOrderType==1001">采购入库</span>
            <span class="cen-g" v-if="scope.row.sourceOrderType==1002">调拨入库</span>
            <span class="cen-g" v-if="scope.row.sourceOrderType==1003">其他入库</span>
            <span class="cen-g" v-if="scope.row.sourceOrderType==1004">销退入库</span>
            <span class="cen-g" v-if="scope.row.sourceOrderType==1005">订单返货上架</span>
          </template>
        </el-table-column>

        <el-table-column label="商品总数">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.goodsQty }}</span>
          </template>
        </el-table-column>

        <el-table-column label="已上架数量">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.alreadyQty }}</span>
          </template>
        </el-table-column>

        <el-table-column label="仓库">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.storageName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建人">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.creater}}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.createTime| normalTime(6)}}</span>
          </template>
        </el-table-column>

        <el-table-column label="上架人">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.putawayer }}</span>
          </template>
        </el-table-column>

        <el-table-column label="上架时间">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.putawayTime| normalTime(6) }}</span>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <div class="pagination">
        <pagination
          :totalCom="total"
          :pageSizeCom="pageSize"
          :curPageCom="curPage"
          @pageSizeVal="getPageSize" @curPageVal="getCurPage"
        ></pagination>
      </div>
    </div>

    <!--上架分配-->
    <el-dialog v-dialogDrag
      title="上架分配"
      :visible.sync="centerDialogVisible"
      width="500px"
      center>
      <div class="fix">
        <div class="fix-l"><label>上架人：</label></div>
        <el-select v-model="putawayer" placeholder="请选择上架人" style="width:180px!important;" >
          <el-option
            v-for="item in putAwayers"
            :key="item.userId"
            :label="item.userName"
            :value="item.userName">
          </el-option>
        </el-select>
        <div v-if ="isMoverShow" style="margin-left: 150px;margin-top:3px;color: red">请先选择上架人</div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click=" isTrue()">确 认</el-button>
        </span>
    </el-dialog>


    <!--上架重新分配-->
    <el-dialog v-dialogDrag
      title="上架分配"
      :visible.sync="centerDialogVisibleOne"
      width="500px"
      center>
      <div class="fix">
        <div class="fix-l"><label>上架人：</label></div>
        <el-select v-model="putawayer" placeholder="请选择上架人" style="width:180px!important;" >
          <el-option
            v-for="item in putAwayers"
            :key="item.userId"
            :label="item.userName"
            :value="item.userName">
          </el-option>
        </el-select>
        <div v-if ="isMoverShow" style="margin-left: 150px;margin-top:3px;color: red">请先选择上架人</div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibleOne = false">取 消</el-button>
          <el-button type="primary" @click=" isTrueOne()">确 认</el-button>
        </span>
    </el-dialog>
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="unassign"
        width="30%"
        center>
        <div style="width: 100%;margin-top: -20px;text-align: center">
          <i style="font-size: 16px;color: red;" class="el-icon-warning"></i>
          <span style="font-size: 14px;margin-left: 10px">确定要取消分配已选的[n]个上架单吗？</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="unassign = false">取 消</el-button>
          <el-button type="primary" @click="unassign = false">确 认</el-button>
        </span>
      </el-dialog>
    </div>

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
        version:'1.0.0',//接口版本号
        timeType: '1001',//时间类型
        startTime: '',//起始时间
        endTime:'',//结束时间
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        putAwayers:[],//上架人
        optionsCreate:[
        {
          value: '1001',
          label: '创建时间'
        },
        {
          value: '1002',
          label: '上架时间'
        }
      ],//创建时间下拉
        WmStockPutawayStateEnum:[
          {
            value:'',
            label:'全部'
          },{
            value:1001,
            label:'待分配',
          },{
            value:1002,
            label:'待上架',
          },{
            value:1003,
            label:'上架中',
          },{
            value:1004,
            label:'已上架',
          }
        ],//上架状态
        storageId:[{
          value:'',
          abel: '全部'
        }],
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        putawayStatus:'',//上架状态
        stock: '',//仓库
        WmStockPutawayTypeEnum:[
          {
            value: '',
            label: '全部'
          },
          {
            value: 1001,
            label: '采购上架'
          },
          {
            value: 1002,
            label: '销退上架'
          },
          {
            value:1003 ,
            label: '返货上架'
          },
          {
            value:1004 ,
            label: '调拨上架'
          },
          {
            value:1005,
            label: '其他上架'
          }
        ],//上架类型
        select1Type:'1001',//上架单号
        select1Value:'',//上架单号需要输入的内容
        putawayType:'',//上架类型
        createTime: '',//创建时间
        putawayTime:'',//上架时间
        time1: '',//起始时间
        time2:'',//结束时间
        stockArea:'',//库区
        stockSeat:'',//库位
        isSeat: false,//库位判空
        barCode: '',//条形码
        name:'',//商品名称
        centerDialogVisible:false,//上架弹窗
        unassign:false,//取消分配弹窗
        tableNum:[],//勾选的数据
        WmStockPutawayEnum:[
            {
              value: '1001',
              label: '上架单号'
            },
            {
              value: '1002',
              label: '来源单号'
            },
            {
              value: '1003',
              label: '创建人'
            },
            {
              value: '1004',
              label: '上架人'
            }
          ],//调整单号下拉
        putawayer:'',//请选择上架人
        centerDialogVisibleOne:false,//上架分配框
        isMoverShow:false,//请选择上架的校验
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限
      }
    },
    mounted(){
      this.initTime();//初始化时间
      this.initStock();//初始化仓库下拉
      this.initMessage();//初始化表格数据
      this.assigner();//获取分配人
      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    activated() {
      this.initMessage();//初始化表格数据
    },
    methods: {

      //初始化时间
      initTime: function () {
        let oDate = new Date();
        const Y = oDate.getFullYear(),
          M = oDate.getMonth() + 1,
          D = oDate.getDate();
        let timeStart = Y + ' ' + M + ' ' + D + ' 00:00:00';
        this.startTime = new Date(timeStart);
        let timeEnd = Y + ' ' + M + ' ' + D + ' 23:59:59';
        this.endTime = new Date(timeEnd)
      },

      //打印
      print(){
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择上架单！',
            type: 'warning'
          })
          return false
        }else{
          let arr=[]
          this.tableNum.forEach((item)=>{
            arr.push(item.putawayStatus)
          })
          if(arr.indexOf(1001)==-1) {
            var arrOne=''
            for (let item of this.tableNum) {
              arrOne += item.stockPutawayId + ','
            }
            const token=sessionStorage.getItem('clToken');
            let data={
              ids:arrOne.slice(0, -1),
              modelkey:6,
              stype:'SVoucher',
              cltoken:token
            }
            /*this._post('http://127.0.0.1:8082/preview',data).then((res) => {
              if (res.data.result == '') {

              }
            })*/
            $.ajax({
              type: "post",
              url: "http://127.0.0.1:8082/preview",
              data: data,
              success: function(data){

              }
            });
          }else{
            this.$message({
              message: '选择的上架单有状态为待分配状态，请完成分配后打印!',
              type: 'warning'
            })
          }

        }
      },

      //重 置
      reset(){
           this.select1Type='1001',//选择类型
           this.select1Value='',//选择类型的值
           this.storageId='', // 仓库id
           this.putawayType='',//上架类型
           this.putawayStatus=''//上架状态
          let oDate = new Date();
          const Y = oDate.getFullYear(),
          M = oDate.getMonth() + 1,
          D = oDate.getDate();
          let timeStart = Y + ' ' + M + ' ' + D + ' 00:00:00';
          this.startTime = new Date(timeStart);
          let timeEnd = Y + ' ' + M + ' ' + D + ' 23:59:59';
          this.endTime = new Date(timeEnd)
      },

      //查询
      search: function () {
        this.initMessage();
      },

      //初始化表格数据
      initMessage:function () {
        let startTime,endTime;

        if(this.startTime != null) {
          startTime = new Date(this.startTime).getTime()
        }else {
          startTime = ''
          this.$message({
            message:'开始日期不能为空！',
            type: 'warning'
          })
          return false
        }
        if(this.endTime != null) {
          endTime = new Date(this.endTime).getTime()
        }else {
          endTime = ''
          this.$message({
            message:'结束日期不能为空！',
            type: 'warning'
          })
          return false
        }
        let data = {
          "select1Type": this.select1Type,//选择类型
          "timeType":this.timeType,//时间类型
          "select1Value": this.select1Value,//选择类型的值
          "storageId": this.storageId, // 仓库id
          "putawayType": this.putawayType,//上架类型
          "putawayStatus": this.putawayStatus,//上架状态
          "startTime": startTime,//创建时间开始
          "endTime": endTime,//创建时间结束
          "page": this.curPage,
          "size": this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmStockPutawayService/'+this.version+'/queryPager',data).then(function (response) {
          this.tableData=response.data.result.rows;
          this.total = response.data.result.total;
        }.bind(this))
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/'+this.version+'/list').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.optionsStock.push({value: val.storageId,label: val.storageName})
          }.bind(this));
        }.bind(this));
      },

      //上架单号详情跳转
      clickDetail(row){
        if(row.putawayType == 1003){
         // this.$router.push({name: 'orderDetail', params: {orderId: row.sourceOrderId}});
          this.$router.push('/orderDetail/' + row.sourceOrderId)
        }else{
          //跳转到入库单详情
        //  this.$router.push('/InventoryDetails/' + row.sourceOrderId)
          this.$router.push({name: 'InventoryDetails',params: {stockInNo: row.sourceOrderId,id:8}})

        }
     },

      //详情跳转
      clickDetailOne(row){
        this.$router.push({name: 'SingleNumber',params: {stockPutawayId: row.stockPutawayId,storageId:row.storageId,putawayStatus:row.putawayStatus,putawayType:row.putawayType,sourceOrderId:row.sourceOrderId}})
     },

      //获取多选框的值
      handleSelectionChange(val){
        this.tableNum= val
      },

      //重新分配
      changeUnassign() {
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择上架单！',
            type: 'warning'
          })
          return false
        }else{
          var vals=[];
          for(var item of this.tableNum){
            vals.push(item.putawayStatus);
          }
          for(let i=0; i<vals.length; i++) {
            if (vals[i] == 1002) {//待上架
              this.centerDialogVisibleOne =true;
              this.isMoverShow=false
            //  this.putawayer=''
              this.assigner();
            //  this.putawayer=this.userName
            } else {
              this.centerDialogVisibleOne =false;
              this.$message({
                message: '选择的上架单有状态为非已分配状态！',
                type: 'warning'
              })
              return false;
            }
          }
        }
      },

      //分配
      Unassign() {
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择上架单！',
            type: 'warning'
          })
          return false
        }else{
          var vals=[];
          for(var item of this.tableNum){
            vals.push(item.putawayStatus);
          }
          for(let i=0; i<vals.length; i++) {
            if (vals[i] == 1001) {//待分配
              this.centerDialogVisible =true;
              this.isMoverShow = false;
              this.putawayer=''
              this.assigner();
            } else {
              this.centerDialogVisible =false;
              this.$message({
                message: '选择的上架单有状态为非待分配状态！',
                type: 'warning'
              })
              return false;
            }
          }
        }
      },

      //分配接口
      isTrue(){
         let str = []
         for (let item of this.tableNum) { // 库位ID，用逗号隔开
           str.push(item.stockPutawayId)
         }
         var n = ''
         n = this.tableNum.length
         let self = this
         if(self.putawayer==''){
           self.isMoverShow=true
           return false;
         }
        self._post('com.edb01.erp.wms.service.api.WmStockPutawayService/'+this.version+'/allot', {
           stockPutawayIdListStr: JSON.stringify(str),
           allotType: '1001',
           merchantId: 0,
           putawayer:this.putawayer//上架人
         })
           .then(function (res) {
             if (res.data.code == 0) {
               self.centerDialogVisible=false
               self.$message({
                 type: 'success',
                 message: '分配完成!',
               })
               self.initMessage();
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
       },

      //分配接口
      isTrueOne(){
        let str = []
        for (let item of this.tableNum) { // 库位ID，用逗号隔开
          str.push(item.stockPutawayId)
        }
        var n = ''
        n = this.tableNum.length
        let self = this
        if(self.putawayer==''){
          self.isMoverShow=true
          return false;
        }
        self._post('com.edb01.erp.wms.service.api.WmStockPutawayService/'+this.version+'/allot', {
          stockPutawayIdListStr: JSON.stringify(str),
          allotType: '1002',
          merchantId: 0,
          putawayer:this.putawayer//上架人
        })
          .then(function (res) {
            if (res.data.code == 0) {
              self.centerDialogVisibleOne=false
              self.$message({
                type: 'success',
                message: '分配完成!',
              })
              self.initMessage();
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
      },

      //分配人
      assigner(){
        this._post('com.edb01.upms.service.UserService/1.0.0/getUserByPri', {privilegeName:'上架'})
          .then((res) => {
            this.putAwayers = res.data.result;
          })
      },

      //以下是分页
      getPageSize: function (val) {
        if(val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();
        }
      },
      getCurPage: function (val) {
        if(val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
        }
      },

      //获取时间
      getTime1: function (val) {
        this.startTime = val
      },
      getTime2: function (val) {
        this.endTime = val;
      },
    }
  }
</script>
<style>
  #EnterShelves .pTop .col-nav ul li span{

  }
</style>
<style scoped>
  #EnterShelves{
    padding: 20px;
  }
  .pTop{
    margin-bottom: 20px;
  }
  .btnStyle{
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px!important;
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


</style>

