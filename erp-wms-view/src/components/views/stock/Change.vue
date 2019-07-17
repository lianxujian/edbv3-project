<!--移位 秋香-->
<template>
  <div id="change">
      <!--搜索区-->
      <div id="searchBox">
        <div class="leftBox2">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label>仓库：</label>
                <el-select id="searchStock" v-model="storageId" filterable placeholder="全部">
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
                <label>来源库位：</label>
                <el-input maxlength="50" id="stockSeat" v-model="sourceStorageBinName" placeholder="请输入内容"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label>目标库位：</label>
                <el-input maxlength="50" id="stockSeat1" v-model="targetStorageBinName" placeholder="请输入内容"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label>移位状态：</label>
                <el-select id="changeState" v-model="moveStatus" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsAdjustState"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label>移位单号：</label>
                <el-input maxlength="50" id="stockSeat2" v-model="stockMoveNo" placeholder="请输入内容"></el-input>
              </div>
            </el-col>
          </el-row>
            <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <el-select style="width: 110px!important;" v-model="selectSundryType" filterable placeholder="调整状态">
                  <el-option
                    v-for="item in optionsAdjust"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input maxlength="50" style="width: 50%!important;" v-model="selectContext" placeholder=""></el-input>
              </div>
            </el-col>

            <el-col :span="18">
              <div class="grid-content">
                <el-select style="width: 110px!important;" v-model="selectTimeType" filterable placeholder="创建时间">
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

      <!--操作导航-->
      <div class="col-nav" style="margin:0 0 10px">
        <ul style="margin-bottom: 0">
          <li @click="addChange()"  v-if="authorityCode.WMS_CHANGE_ADD"><span>添加</span></li>
          <li @click="Unassign()"  v-if="authorityCode.WMS_CHANGE_ALLOT"><span>分配</span></li>
          <li @click="change()" ><span>打印</span></li>
        </ul>
      </div>

      <!--表格-->
      <div class="pDown">
        <el-table id="tableH"
                  :data="tableData"
                  border :max-height="table_h"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
        >
          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

          <el-table-column
            align='center'
            type="selection"
            width="50">
          </el-table-column>

          <el-table-column label="移位单号">
            <template slot-scope="scope">
              <span class="cen-g">
                <a @click="stockMoveChang(scope.row)" >{{ scope.row.stockMoveNo }}</a>
              </span>
            </template>
          </el-table-column>

          <el-table-column label="移位状态">
            <template slot-scope="scope">
              <span class="cen-g" v-show="scope.row.moveStatus == 1001">未分配</span>
              <span class="cen-g" v-show="scope.row.moveStatus == 1002">已分配</span>
              <span class="cen-g" v-show="scope.row.moveStatus == 1003">已完成</span>
            </template>
          </el-table-column>

          <el-table-column label="仓库" prop="storageName">
          </el-table-column>

          <el-table-column label="创建人" prop="creater">
          </el-table-column>

          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span class="cen-g">{{ scope.row.createTime| normalTime(6) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="移位人" prop="mover">
          </el-table-column>

          <el-table-column label="移位时间">
            <template slot-scope="scope">
              <span class="cen-g">{{ scope.row.moveTime| normalTime(6) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="说明" max-width="200">
            <template slot-scope="scope">
              <span class="cen-g" :title="scope.row.remark" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                {{ scope.row.remark }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="177">
            <template slot-scope="scope">
              <div  v-show="scope.row.moveStatus == 1001">
                <el-button @click="updateChange(scope.row)" type="text" size="small" v-if="authorityCode.WMS_CHANGE_UPDATE">修改</el-button>
                <el-button @click="deleteData(scope.row)" ref="del" type="text" size="small" style="color: red"   v-if="authorityCode.WMS_CHANGE_DEL" >删除</el-button>
              </div>
              <div  v-show="scope.row.moveStatus == 1002">
                <el-button @click="changeUnassign(scope.row)" type="text" size="small" v-if="authorityCode.WMS_CHANGE_ALLOT">重新分配</el-button>
                <el-button @click="stockMove(scope.row)" ref="del" type="text" size="small" style="color: red" v-if="authorityCode.WMS_CHANGE_AFFIRM">确认移位</el-button>
              </div>
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

      <!--分配-->
      <el-dialog v-dialogDrag
        :visible.sync="centerDialogVisible"
        width="400px"
        center>
        <span >请选择您希望执行{{table1}}移位单的操作员</span>
        <el-row style="margin-top: 20px">
          <el-col >
              <div class="grid-content">
                <label>移位人：</label>
                <el-select v-model="addData.mover" filterable placeholder="请选择移位人">
                  <el-option
                    v-for="item in putAwayers"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userName">
                  </el-option>
                </el-select>
                <p v-if ="isMoverShow" style="margin-left: 65px;margin-top:3px;color: red">请先选择移位人</p>
              </div>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click=" isTrue()">确 认</el-button>
            </span>
      </el-dialog>

      <!--重新分配-->
      <el-dialog v-dialogDrag
        :data="tableData"
        :visible.sync="changeDialogVisible"
        width="400px"
        center>
        <span >请选择您希望执行{{table1}}移位单的操作员</span>
        <el-row style="margin-top: 20px">
          <el-col >
              <div class="grid-content">
                <label>移位人：</label>
                <el-select v-model="updateData.mover" filterable placeholder="请选择移位人">
                  <el-option
                    v-for="item in putAwayers"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userName">
                  </el-option>
                </el-select>
                <p v-if ="isMoverShow" style="margin-left: 65px;margin-top:3px;color: red">请先选择移位人</p>
              </div>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
              <el-button @click="changeDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click=" changeTrue()">确 认</el-button>
            </span>
      </el-dialog>
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
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId: [],//仓库
        addData:{
          mover:'',
        },//添加移位人
        putAwayers:[],//移位人
        optionsAdjust:[
          {
            value: 1001,
            label: '创建人'
          },
          {
            value: 1002,
            label: '移位人'
          }
        ],//调整单号下拉
        select1Type: '1001',//调整单号
        select1Value: '',//调整单号实体
        updateData:{
          mover:''
        },
        optionsAdjustType:[//调整类型下拉
          {
            value: '',
            label: '全部'
          },
          {
            value: '1001',
            label: '盘点调整'
          },
          {
            value: '1002',
            label: '损益调整'
          },
          {
            value: '1003',
            label: '其他调整'
          }
        ],
        invaType: '',//调整类型
        optionsAdjustState: [//移位状态下拉
          {
            value: '',
            label: '全部'
          },
          {
            value: '1001',
            label: '未分配'
          },
          {
            value: '1002',
            label: '已分配'
          },
          {
            value: '1003',
            label: '已完成'
          }
        ],
        sunShine:'',//当前行移位单id
        optionsCreate:[//创建时间下拉
          {
            value: '1001',
            label: '创建时间'
          },
          {
            value: '1002',
            label: '审核时间'
          }
        ],
        selectTimeType: '1001',//时间类型
        sourceStorageBinName:'',
        targetStorageBinName:'',
        stockMoveNo:'',
        moveStatus:'',//调整状态
        selectSundryType:1001,
        selectContext:'',
        startTime: null,//起始时间
        endTime: null,//结束时间
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        isShowName:false,
        tableNum:[],
        centerDialogVisible:false,//分配窗口
        changeDialogVisible:false,//重新分配窗口
        isMoverShow:false,//移位人
        table1:'',//移位单号
        table2:'',//移位单号
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{}//权限
      }
    },
    mounted(){
      this.initTime();//查询时间
      this.initStock();//初始化仓库下拉
      this.initMessage();//初始化表格数据
      this.assigner();//移位人
      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });
    },
    activated() {
      this.initMessage();//初始化表格数据
    },
    methods:{
      //分配人
      assigner(){
        this._post('com.edb01.upms.service.UserService/1.0.0/getUserByPri', {privilegeName:'移位'})
          .then((res) => {
            this.putAwayers= res.data.result;
          })
      },

      //重新分配
      changeUnassign(row) {
        this.assigner();
        this.changeDialogVisible=true
        row.mover
       this.sunShine= row.stockMoveId
       this.isMoverShow = false;
       this.updateData.mover=row.mover
      },

      //确认
      changeTrue(){
        if(this.updateData.mover == '') {
          this.isMoverShow = true;
          return false;
        }else{
          this.isMoverShow = false;
          let self = this
          self._post('com.edb01.erp.wms.service.api.WmStockMoveService/'+this.version+'/allot', {
            stockMoveIdListStr:  this.sunShine,
            merchantId: 0,
            allotType:1002,
            mover:self.updateData.mover//移位人
          })
            .then(function (res) {
              if (res.data.code == 0) {
                self.changeDialogVisible=false
                self.$message({
                  type: 'success',
                  message: '分配成功!',
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
        }


      },

      //分配详情
      isTrue(){
        if(this.addData.mover == '') {
          this.isMoverShow = true;
          return false;
        }else{
          this.isMoverShow = false;
        }
        let str = []
        for (let item of this.tableNum) { // 库位ID，用逗号隔开
          str.push(item.stockMoveId)
        }
        this.table2=JSON.stringify(str)
        this.table2=this.table2.replace(/\"/g, "");
        this.table2=this.table2.replace(/\[|]/g,'')
        let self = this
        self._post('com.edb01.erp.wms.service.api.WmStockMoveService/'+this.version+'/allot', {
          stockMoveIdListStr: self.table2,
          merchantId: 0,
          allotType:1001,
          mover:self.addData.mover//移位人
        })
          .then(function (res) {
            if (res.data.success == true) {
              self.centerDialogVisible=false
              self.$message({
                type: 'success',
                message: '分配成功!',
              })
              self.initMessage();
            } else {
              self.$message({
                message: '分配失败!',// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },

      //删除
      deleteData(row){
        var self = this;
        self.$confirm('确定要删除该移位单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true
        }).then(() => {
          self._post('com.edb01.erp.wms.service.api.WmStockMoveService/'+this.version+'/delete',{stockMoveId:row.stockMoveId})
            .then(function(res) {
              if (res.data.success == true){
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                self.initMessage();
              }else{
                self.$message({
                  type: 'warning',
                  message: res.data.msg
                });
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //多选
      handleSelectionChange(val){
        this.tableNum=val;
        var hh=[];
        for(var item of this.tableNum){
         hh.push(item.stockMoveNo);
        }
        this.table1=JSON.stringify(hh)
        this.table1=this.table1.replace(/\"/g, "");
        this.table1=this.table1.replace(/\[|]/g,'')
      },

      //分配
      Unassign() {
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择需要分配的移位单！',
            type: 'warning'
          })
          return false
        }else{
          var vals=[];
          for(var item of this.tableNum){
            vals.push(item.moveStatus);
          }
          for(let i=0; i<vals.length; i++) {
            if (vals[i] == 1001) {//未分配
              this.centerDialogVisible =true;
              this.isMoverShow = false;
              this.addData.mover=''
              this.assigner();
            } else {
              this.centerDialogVisible =false;
              this.$message({
                message: '【已分配】和【已完成】的订单无法进行分配！',
                type: 'warning'
              })
              return false;
            }
          }
        }
      },

      //重置
      reset: function () {
        this.moveStatus='',//移位状态
        this.stockMoveNo='',//移位单号
        this.storageId='',//仓库
        this.sourceStorageBinName='',//来源库位
        this.targetStorageBinName='',//目标库位
        this.selectContext = '';
        this.selectSundryType = 1001;
        this.selectTimeType = '1001';
        this.startTime = '';//开始时间
        this.endTime = ''//结束时间
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

      //打印
      change(){
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择需要打印的单据！',
            type: 'warning'
          })
          return false
        }else{
          let arr=[]
          this.tableNum.forEach((item)=>{
            arr.push(item.moveStatus)
          })
          if(arr.indexOf(1001)==-1) {//未分配
            var arrOne=''
            for (let item of this.tableNum) {
              arrOne += item.stockMoveId + ','
            }
            const token=sessionStorage.getItem('clToken');
            let data={
              ids:arrOne.slice(0, -1),
              modelkey:10,
              stype:'SVoucher',
              cltoken:token
            }
            $.ajax({
              type: "post",
              url: "http://127.0.0.1:8082/preview",
              data: data,
              success: function(data){
              }
            });
          }else{
            this.$message({
              message: '未分配的移位单不可打印!',
              type: 'warning'
            })
          }
        }
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.optionsStock.push({value: val.storageId,label: val.storageName})
          }.bind(this));
        }.bind(this));
      },

      //初始化表格数据
      initMessage:function () {
        let startTime,endTime;
        if(this.startTime != null) {
          startTime = new Date(this.startTime).getTime()
        }else {
          startTime = ''
        }
        if(this.endTime != null) {
          endTime = new Date(this.endTime).getTime()
        }else {
          endTime = ''
        }
        let data = {

          "moveStatus": this.moveStatus,//移位状态
          "stockMoveNo":this.stockMoveNo,//移位单号
          "sourceStorageBinName":this.sourceStorageBinName,//来源库位
          "targetStorageBinName":this.targetStorageBinName,//目标库位
          "storageId": this.storageId,//仓库
          "selectSundryType":this.selectSundryType,//杂项内容
          "selectContext":this.selectContext,
          "selectTimeType": this.selectTimeType,//时间类型
          "startTime": startTime,
          "endTime":endTime,
          "page": this.curPage,
          "size": this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmStockMoveService/' + this.version + '/queryPager',data).then(function (res) {
          this.tableData=res.data.result.rows;
       //  this.yu= res.data.result.rows.stockMoveNo
          this.total = res.data.result.total;
        }.bind(this))
      },

      //添加调整单
      addChange: function () {
        this.$router.push('/addChange')
      },

      //作废接口
      changCancel:function (row) {
        let data = {
          "moveStatus": row.moveStatus,
          "optType":row.optType,
          "stockInvaId":row.stockInvaId
        };
        this._post('com.edb01.erp.wms.service.api.WmStockInvaService/' + this.version + '/alterState',data).then(function (res) {
          if(res.data.success) {
            this.initMessage();
          }
        }.bind(this))
      },

      //查看调整单号详情
      stockMoveChang(row){
      this.$router.push('/NoChange/' + row.stockMoveId)
      },

      //确认移位
      stockMove: function (row) {
        this.$router.push('/SureChange/' + row.stockMoveId)
      },

      //点击修改
      updateChange: function (row) {
        this.$router.push('/UpdateChange/' + row.stockMoveId)
      },

      //点击审核
      handleExaClick: function (row) {
        if(row.moveStatus == '1001' || row.moveStatus == '1003') {
          this.$router.push('/examine/' + row.stockInvaId)
        }else {
          this.$confirm('只有调整状态为“待审核”或“审核拒绝”的调整单才允许审核!','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
          }).then(() => {
            this.initMessage()
          });
        }
      },

      //作废
      handleDelClick: function (row) {
        if(row.moveStatus == '1001' || row.moveStatus == '1003') {
          this.$confirm('确认要作废此调整单吗?','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
          }).then(() => {
            this.changCancel(row);
            this.$alert("作废成功", {
              type: 'success',
              center: true,
              confirmButtonText: '知道了'
            });
          }).catch(() => {});
        }else {
          this.$confirm('只有调整状态为“待审核”或“审核拒绝”的调整单才允许作废!','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
          }).then(() => {
            this.initMessage()
          });
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
//      以下是分页
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
    }
  }
</script>
<style scope>
  .pDown a{
    color: blue;
    text-decoration: underline;
  }
</style>
<style>
  #change .el-table .cell {
    text-align: center;
  }
</style>



