<!--波次列表 秋香-->
<template>
    <div id="WaveList">

      <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox2">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <el-select style="width: 33%!important;" v-model="select1Type" filterable placeholder="波次编号" :maxlength="50" class="isOne">
                <el-option
                  v-for="item in WmWaveSundryEnum"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
                <el-input v-model="select1Value"  placeholder="" @keyup.enter.native="initMessage" :maxlength="50"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 33%!important;"  >波次描述：</label>
              <el-input  id="waveDescribe" v-model="waveDescribe"  placeholder="请输入内容"  :maxlength="50"  @keyup.enter.native="initMessage"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content" >
              <label style="width: 33%!important;">波次状态：</label>
              <el-select  id="waveStatus" v-model="waveStatus" filterable placeholder="全部" >
                <el-option
                  v-for="item in WmWaveStateEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 33%!important;">波次类型：</label>
              <el-select id="waveType"  v-model="waveType"  filterable placeholder="全部" >
                <el-option
                  v-for="item in WmWaveTypeEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
          <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 33%!important;">仓库：</label>
              <el-select id="storageName" v-model="storageId" filterable placeholder="全部" >
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
              <label style="width: 33%!important;">挂起状态：</label>
              <el-select id="hangupFlag" v-model="hangupFlag"  filterable placeholder="全部" >
                <el-option
                  v-for="item in HangUpStateEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 33%!important;">波次来源：</label>
              <el-select id="waveFrom" v-model="waveFrom" filterable placeholder="全部" >
                <el-option
                  v-for="item in WmWaveSourceEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 33%!important;">打印状态：</label>
              <el-select id="printType" v-model="printType" filterable placeholder="全部" >
                <el-option
                  v-for="item in PrintStateEnum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          </el-row>
        <el-row>
          <el-col :span="14">
            <div class="grid-content">
              <label  style="width: 11.4%!important;" class="isSize">创建时间：</label>
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
        <el-button @click="search" size="mini" type="primary" >查 询</el-button>
        <el-button @click="reset" size="mini" type="default">重 置</el-button>
      </div>
    </div>

      <!-- 表头 -->
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="AssignNumber();" v-if="authorityCode.WMS_WAVELIST_ALLOTNUMBER"><span>分配快递单号</span></li>
        <li @click="UnassignOne()" v-if="authorityCode.WMS_WAVELIST_ALLOT"><span>分配</span></li>
        <li @click="Unassign()" v-if="authorityCode.WMS_WAVELIST_ALLOT"><span> 取消分配</span></li>
        <li @click="Print();" v-if="authorityCode.WMS_WAVELIST_PRINT"><span>打印</span></li>
        <li @click="hangUp()" v-if="authorityCode.WMS_WAVELIST_HANG"><span>挂起</span></li>
        <li @click="noHangUp()" v-if="authorityCode.WMS_WAVELIST_HANG"><span>解挂</span></li>
        <li @click="deleteWave()" v-if="authorityCode.WMS_WAVELIST_DEL"><span>删除波次</span></li>
      </ul>
    </div>

      <!--表格-->
    <div class="pDown">
      <el-table :data="tableData"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
                border style="width: 100%"
                id="fitTable"
                :height="table_h"
      >

        <el-table-column
          align="center"
          type="index"
          label="序号">
        </el-table-column>

        <el-table-column
          align='center'
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column label="波次编号" width="110" align="center">
          <template slot-scope="scope">
            <span style="cursor: pointer;color: blue" @click="clickDetail(scope.row)">{{scope.row.waveOrderNo}}</span>
           <!-- <router-link :to="{path: '/WaveDetail',query: {stockWaveId: scope.row.stockWaveId,waveOrderNo:scope.row.waveOrderNo}}">-->
           <!--   <span style="cursor: pointer;color: blue" @click="clickDetail(scope.row)">{{scope.row.waveOrderNo}}</span>-->
            <!--</router-link>-->
        <!--    <p class="cen-g">
              <a @click="clickDetail(scope.row)" href="javascript:">{{ scope.row.waveOrderNo }}</a>
            </p>-->
          </template>
        </el-table-column>

        <el-table-column label="波次状态" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.waveStatus==1001">全部</span>
            <span v-if="scope.row.waveStatus==1002">待分配</span>
            <span v-if="scope.row.waveStatus==1003">已分配</span>
            <span v-if="scope.row.waveStatus==1004">拣货中</span>
            <span v-if="scope.row.waveStatus==1005">部分拣货</span>
            <span v-if="scope.row.waveStatus==1006">已拣货</span>
            <span v-if="scope.row.waveStatus==1007">已分拣</span>
          </template>
        </el-table-column>

        <el-table-column label="波次类型">
          <template slot-scope="scope">
            <span v-if="scope.row.waveType==1001">全部</span>
            <span v-if="scope.row.waveType==1002">自定义波次</span>
            <span v-if="scope.row.waveType==1003">多品订单波次</span>
            <span v-if="scope.row.waveType==1004">大宗订单波次</span>
            <span v-if="scope.row.waveType==1005">单品订单波次</span>
            <span v-if="scope.row.waveType==1006">单件混合波次</span>
            <span v-if="scope.row.waveType==1007">手工波次</span>
          </template>
        </el-table-column>

        <el-table-column label="波次描述" prop="waveDescribe">
        </el-table-column>

        <el-table-column label="仓库" prop="storageName">
        </el-table-column>

        <el-table-column label="挂起状态">
          <template slot-scope="scope">
            <span v-if="scope.row.hangupFlag==0">未挂起</span>
            <span  v-if="scope.row.hangupFlag==1">已挂起</span>
          </template>
        </el-table-column>

        <el-table-column label="波次来源">
          <template slot-scope="scope">
            <span v-if="scope.row.waveFrom==1001">全部</span>
            <span v-if="scope.row.waveFrom==1002">自动生成</span>
            <span v-if="scope.row.waveFrom==1003">手工创建</span>
          </template>
        </el-table-column>

        <el-table-column label="打印状态">
          <template slot-scope="scope">
            <span v-if="scope.row.printType==1001">全部</span>
            <span v-if="scope.row.printType==1002">未打印</span>
            <span v-if="scope.row.printType==1003">部分打印</span>
            <span v-if="scope.row.printType==1004">已打印</span>
          </template>
        </el-table-column>

        <el-table-column label="订单数量" prop="orderQty">
        </el-table-column>

        <el-table-column label="商品数量" prop="goodsQty">
        </el-table-column>

        <el-table-column label="创建人" prop="creater">
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span class="cen-g">{{ scope.row.createTime| normalTime(6)}}</span>
          </template>
        </el-table-column>

        <el-table-column label="拣货人" prop="pickingerName">
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

      <!--波次分配-->
    <el-dialog v-dialogDrag
      title="波次分配"
      :visible.sync="centerDialogVisible"
      width="400px"
      center>
      <div class="grid-content" style="margin-top: 20px">
       <label style="margin-left:20px;margin-bottom: 20px">拣货人：</label>
        <el-select v-model="pickingerId" placeholder="请选择拣货人" style="width:180px!important;" >
          <el-option
            v-for="item in person"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId">
          </el-option>
        </el-select>
        <p v-if ="isMoverShow" style="margin-left: 65px;margin-top:3px;color: red">请选择拣货员</p>
      </div>
      <span  style="margin-left: 40px;">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="istrue()">确 认</el-button>
        </span>
    </el-dialog>

      <!--取消分配-->
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="unassign"
        width="30%"
        center>
        <div style="width: 100%;margin-top: -20px;text-align: center">
          <i style="font-size: 16px;color: red;" class="el-icon-warning"></i>
          <span style="font-size: 14px;margin-left: 10px">确定要取消分配已选的[n]个波次吗？</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="unassign = false">取 消</el-button>
          <el-button type="primary" @click="unassign = false">确 认</el-button>
        </span>
      </el-dialog>
    </div>

      <!--波次打印-->
    <div>
      <el-dialog v-dialogDrag
        title="波次打印"
        :visible.sync="print"
        width="400px"
        center>
        <div class="grid-content" style="margin-left: 40%" >
          <el-checkbox-group v-model="checked">
            <el-checkbox>波次拣货单</el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="checked1">
            <el-checkbox>发货单</el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="checked2">
            <el-checkbox>快递单</el-checkbox>
          </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="print = false">取 消</el-button>
          <el-button type="primary" @click="printConfirmation();print = false;">确 认</el-button>
        </span>
      </el-dialog>
    </div>

      <!--分配快递单号-->
    <div>
      <el-dialog v-dialogDrag
        width="700px"
        title="分配快递单号"
        :visible.sync="assignNumber"
        center>
        <div style="text-align: center">
          <div class="fix">
            <div class="fix-l"><label>快递：</label></div>
            <el-select v-model="sysexPressId" disabled  style="width: 320px!important;">
             <!-- <el-option
                v-for="item in sysexPress"
                :key="item.expressCoId"
                :label="item.expressCoName"
                :value="item.expressCoId">
              </el-option>-->
            </el-select>
          </div>
          <div class="fix" v-if="isShowfirst">
            <div class="fix-l"><label>联想单号：</label></div>
            <el-input style="width: 320px!important;" v-model="expressNo"
                      :maxlength="50"
                      placeholder="请输入第一个快递单号（必填）"></el-input>
          </div>
          <div class="fix" v-if="isShowTwo">
            <div class="fix-l"><label>联想单号：</label></div>
            <el-input style="width:72px!important;" v-model="input1"
                      :maxlength="2"
                      placeholder="前两位"></el-input>
            <el-input style="width: 170px!important;" v-model="input2"
                      :maxlength="9"
                      placeholder="第一个单号的中间九位"></el-input>
            <el-input style="width: 72px!important;" v-model="input3"
                      :maxlength="2"
                      placeholder="后两位"></el-input>
          </div>
          <div class="fix">
            <div class="fix-l"><label>联想方式：</label></div>
            <el-select v-model="associateMethod" placeholder="普通（递增）" style="width: 320px!important;" :disabled="isSure">
              <el-option
                v-for="item in associateType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="fix">
            <div class="fix-l">
              <label>联想顺序</label>
              <label>:&nbsp订单序号</label>
            </div>
            <span></span>
          </div>
          <div class="fix">
            <el-checkbox-group v-model="isCoverOld">
              <el-checkbox>允许覆盖原始单号</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="assignNumber = false">取 消</el-button>
          <el-button type="primary" @click="AssignSuccess()">确 认</el-button>
        </span>
      </el-dialog>
    </div>

     <!--成功的通知弹框-->
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="successDialogVisible"
        width="30%"
        center>
        <div style="width: 100%;text-align: center"><i style="font-size: 30px;color: #65F007;margin-top: -10px" class="el-icon-success"></i> </div>
        <div  style="font-size: 18px;margin: 5px 0 -10px 0;width: 100%;text-align: center">取消分配成功！</div>
        <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="successDialogVisible=false">知道了</el-button>
       </span>
      </el-dialog>
    </div>

    <!--判断是否有取消或退款-->
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="judge"
        width="400px"
        center>
        <div style="width: 100%;margin-top: -20px;text-align: center">
          <i style="font-size: 16px;color: red;" class="el-icon-warning"></i>
          <span style="font-size: 14px;margin-left: 10px">订单号已取消/已退款，是否剔除波次？</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="delIndex()">确 认</el-button>
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
         version:'1.0.0',
        successDialogVisible:false,
        optionsStock:[{value: '',label: ''}],//仓库下拉
        table_h:0,
        WmWaveStateEnum: [//波次状态
          { label: '全部', value: 1001 },
          { label: '待分配', value: 1002 },
          { label: '已分配', value: 1003 },
          { label: '拣货中', value: 1004 },
          { label: '部分拣货', value: 1005 },
          { label: '已拣货', value:1006 },
          { label: '已分拣', value: 1007 },
        ],
        WmWaveTypeEnum: [//波次类型
          { label: '全部', value: 1001 },
          { label: '自定义波次', value: 1002},
          { label: '多品订单波次', value: 1003 },
          { label: '大宗订单波次', value: 1004},
          { label: '单品订单波次', value: 1005 },
          { label: '单件混合波次', value: 1006 },
        ],
        suspended: [//仓库
          { label: '全部', value: 1001 },
          { label: '未挂起', value: 0 },
          { label: '已挂起', value: 1 },
        ],
        HangUpStateEnum: [//挂起状态
          { label: '全部', value: '' },
          { label: '未挂起', value: 0 },
          { label: '已挂起', value: 1 },
        ],
        WmWaveSourceEnum: [//波次来源
          { label: '全部', value: 1001 },
          { label: '自动生成', value: 1002 },
          { label: '手工创建', value: 1003 },
        ],
        PrintStateEnum: [//打印状态
          { label: '全部', value: 1001 },
          { label: '未打印', value: 1002 },
          { label: '部分打印', value: 1003 },
          { label: '已打印', value: 1004 },
        ],
        suspended: [//时间
          { label: '未挂起', value: 0 },
          { label: '已挂起', value: 1 },
        ],
        WmWaveSundryEnum: [//查询条件
          { label: '波次编号', value:1001},
          { label: '创建人', value: 1002 },
          { label: '拣货人', value: 1003},
        ],
         // 模糊查询
        storageId:[{
          value:'',
          abel: '全部'
        }],
        sysexPressId:'',//快递名称
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
          select1Type:1001,//选择类型
          select1Value:'',//选择类型的值
          waveDescribe:'',//波次描述
          waveStatus:1001,//波次状态
          waveType:1001,//波次类型
          hangupFlag:'',//挂起状态
          waveFrom:1001,//波次来源
          printType:1001,//打印类型
          startTime: '',//起始时间
          endTime:'',//结束时间
          page: 1,//当前页显示条数
          merchantId:0,//商户id
          size: 15,
          stock: '',//仓库
        optionsStockArea:[//库区下拉
          {
            value: '选项1',
            label: '拣货区'
          },
          {
            value: '选项2',
            label: '存货区'
          },
          {
            value: '选项3',
            label: '销退区'
          },
          {
            value: '选项4',
            label: '质检区'
          },
          {
            value: '选项5',
            label: '其他区'
          }
        ],
        expressOne:'',
        storageName:'',
        stockArea:'',//库区
        stockSeat:'',//库位
        isSeat: false,//库位判空
        barCode: '',//条形码
        name:'',//商品名称
        time1: '',//起始时间
        time2:'',//结束时间
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1 ,//当前页数
        centerDialogVisible:false,//上架弹窗
        unassign:false,//取消分配弹窗
        assignNumber:false,//分配快递单号
        multipleSelection:[],//表格勾选数据
        createTime:'',//创建时间
        pickingerId:'',//分配人
        WaveList:'WaveList',//拣货人
        isMoverShow:false,//
        plat:[],
        print:false,//打印窗口
        items:[
          {
            message:'波次拣货单'
          },{
           message:'发货单'
          },{
           message:'快递单'
          },],
        checked:false,//波次拣货单
        checked1:false,//发货单
        checked2:false,//快递单
        isCoverOld:false,//允许覆盖原始单号
        tableNum:[],//分配数量
        vals:[],//已挂起
        sysexPress:[],//快递
        associateType:[
          {
            value:'1001',
            label:'普通 递增方式'
          }, {
            value:'1002',
            label:'ems 方式'
          }
          ],//联想方式
          merchantId:0,//商户id
          stockWaveId:'',//波次id
          expressId:'',//快递id
          expressNo:'',//第一个快递单号
          associateMethod:'1001',//联想方式
          isCoverOld:'',//是否覆盖原来的单据号
          person:[],//仓库下拉
          pickingerName:'',//拣货人
          isSure:true,//禁用按钮
          isNum:0,//快递单号
          paramsObj:{
            mainPageShow:true,
          },//子级传
          judge:false,//判断是否有取消或退款窗口
          num:'',//订单id
          isShowTwo:false,//普通快递
          isShowfirst:false,//EMS或者邮政
          input1:'',//联想单号前两位
          input2:'',//联想单号中间
          input3:'',//联想单号后两位
          mark:'',//联想状态
          expressSame:'',//联想单号多个框
          authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{}
      }
    },
    activated() {
      this.initMessage();//初始化表格数据
    },
    mounted(){
      this.assigner(); //分配人
      //this.getExpressId();
      this.initTime();//初始化时间
      this.initStock();//初始化仓库下拉
      this.initMessage();//初始化表格数据
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight // 页面高度
        var b = document.getElementById('fitTable').offsetTop // 表格距离顶部的距离
        this.table_h = a - b - 70
      })
      //初始化每页数量
      if(sessionStorage.getItem("hold_wave_1") != null) {
        this.pageSize = parseInt(sessionStorage.getItem("hold_wave_1"));
      }
    },
    methods: {
      //剔除波次
      delIndex(){
        var self=this;
        var paramData = {
          salesOrderIdListStr:self.num,//订单id
        }
        self._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/batchEliminateOrderFromWave',paramData)
          .then(function (response) {
            if (response.data.success == true) {
              self.$message({
                type: 'success',
                message: '剔除成功!',
              })
              self.initMessage();
              self.judge=false;
              self.print=true;
            }else {
              self.judge=false
              self.$message({
                message:response.data.msg ,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      // 跳转详情页
      clickDetail(row){
        this.$router.push({name: 'WaveDetail',params: {stockWaveId: row.stockWaveId,waveOrderNo:row.waveOrderNo,waveType:row.waveType}})
      },

      //子级传参通知父级刷新表格数据
      changeShow(val){
        if(val){
          this.initMessage();
        }
        this.paramsObj.mainPageShow = true;
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

      //重置
      reset: function () {
          this.select1Type=1001,
          this.select1Value='',
          this.waveDescribe='',
          this.waveStatus=1001,
          this.storageId='',
          this.waveType = 1001;
          this.hangupFlag = '';
          this.waveFrom = 1001;
          this.printType=1001;
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
      search() {
        this.initMessage();
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
          "select1Type": this.select1Type,//选择类型
          "select1Value":this.select1Value,//选择类型的值
          "waveDescribe":this.waveDescribe,//波次描述
          "waveStatus":this.waveStatus,//波次状态
          "storageId": this.storageId,//仓库
          "waveType":this.waveType,//挂起状态
          "hangupFlag":this.hangupFlag,
          "waveFrom":this.waveFrom,
          "printType":this.printType,
          "startCreateTime":startTime,
          "endCreateTime":endTime,
          "page": this.curPage,
          "size": this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/queryPager',data).then(function (res) {
          this.tableData=res.data.result.rows;
          this.total = res.data.result.total;
        }.bind(this))
      },

      //表格勾选数据
      handleSelectionChange(val){
          this.tableNum= val
          this.multipleSelection = val;
      },

      //获取时间time1
      getTime1: function (val) {
        this.startTime = val
      },

      //获取时间time2
      getTime2: function (val) {
        this.endTime = val;
      },

      // 以下是分页
      getPageSize: function (val) {
        if(val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();
          //存储每页数量
          sessionStorage.setItem('hold_change_1', val);
        }
      },
      getCurPage: function (val) {
        if(val != undefined) {

          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
        }
      },

      //取消分配
      Unassign() {
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择已分配的订单波次！',
            type: 'warning'
          })
          return false
        }
        var vals=[];
        for(var item of this.tableNum){
          vals.push(item.waveStatus);
        }
       for(let i=0; i<vals.length; i++) {
            if(vals[i]== 1003) {
              let str = []
              for(let item of this.tableNum){ // 库位ID，用逗号隔开
                //str += item.stockWaveId + ','
                str.push(item.stockWaveId)
              }
              //this.stockWaveIdList=str.slice(0,-1);
              var n=''
              n = this.tableNum.length
              this.$confirm('确定要取消分配已选的【'+n+'】个波次吗？','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                center: true
              }).then(() => {
                var data = {
                  merchantId:0,//商户id
                //  stockWaveIdListStr:JSON.stringify(str)
                  stockWaveIdListStr:str
                }
                this._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/cancleAllot', data)
                  .then((res) => {
                    if(res.data.success == true){
                      this.initMessage();
                    }
                  })
              }).catch(() => {
                this.$message({//  取消删除提示
                  type: 'info',
                  message: '已取消'
                })
              })
        }else{
          this.$message({
            message:'已选波次中有状态为非已分配的订单波次！',
            type: 'warning'
          })
        }
      }
      },

      //打印
      Print(){
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择需要打印的订单波次！',
            type: 'warning'
          })
          return false
        }else{
          let arr=[]
          this.tableNum.forEach((item)=>{
            arr.push(item.waveStatus)
          })
          if(arr.indexOf(1002)>-1||arr.indexOf(1004)>-1) {
            this.$message({
              message: '已选波次状态有不满足打印的波次！',
              type: 'warning'
            })
            this.print = false;
          }else {
            var arrOne=''
            for (let item of this.tableNum) {
              arrOne += item.stockWaveId + ','
            }
              var self = this;
              self._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/checkPrintDataSource',{printType: 1001, stockWaveIdListStr:arrOne.slice(0, -1)})
                .then(function (response) {
                  if (response.data.success ==true ) {
                    self.print = true;
                    self.checked=''
                    self.checked1=''
                    self.checked2=''
                  } else {
                    if (response.data.code ==400000021 ){
                      this.$message({
                        message:response.data.msg,
                        type: 'warning'
                      })
                    }if(response.data.code ==400000022){
                      this.$message({
                        message: response.data.msg,
                        type: 'warning'
                      })
                    }
                    if(!response.data.result==''){
                      self.judge=true
                      self.num=response.data.result
                    }
                      }
                })
                .catch(function (error) {
                  console.log(error);
                });
          }
        }
      },

      //波次拣货单打印确认
      printConfirmation(){
        if(this.checked==true){
          var arrOne=''
          for (let item of this.tableNum) {
            arrOne += item.stockWaveId + ','
          }
          const token=sessionStorage.getItem('clToken');
          let data={
            ids:arrOne.slice(0, -1),
            modelkey:3,
            stype:'SVoucher',
            cltoken:token
          }
          $.ajax({
            type: "post",
            url: "http://127.0.0.1:8082/print",
            data: data,
            success: function(response){
              this.print = false;
            }
          });
        }else{

        }
        //波次发货单
        if(this.checked1==true){
          var arrOne=''
          for (let item of this.tableNum) {
            arrOne += item.stockWaveId + ','
          }
          const token=sessionStorage.getItem('clToken');
          let data={
            ids:arrOne.slice(0, -1),
            modelkey:2,
            stype:'SVoucher',
            cltoken:token
          }
          $.ajax({
            type: "post",
            url: "http://127.0.0.1:8082/print",
            data: data,
            success: function(response){
              this.print = false;
            }
          });
        }else{

        }
        //快递单
        if(this.checked2==true){
          var arrOne=''
          for (let item of this.tableNum) {
            arrOne += item.stockWaveId + ','
          }
          const token=sessionStorage.getItem('clToken');
          let data={
            ids:arrOne.slice(0, -1),
            stype:'EVoucher',
            cltoken:token
          }
          $.ajax({
            type: "post",
            url: "http://127.0.0.1:8082/print",
            data: data,
            success: function(response){
              this.print = false;
            }
          });
        }else{

        }
      },

      // 查询所属快递（根据快递判断显示框）
      getexpressName(){
        var self = this;
        self._post('com.edb01.erp.mdata.service.api.ExpressCoService/'+this.version+'/subExpress',{merchantId: 0, clToken: self.token})
          .then(function (response) {
            if (response.data.code == 0) {
              self.sysexPress = response.data.result;
            } else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });

      },

      //快递
      getExpressId(){
        let str =[]
        for(let item of this.tableNum){ // 库位ID，用逗号隔开
          str.push(item.stockWaveId)
        }
        var data = {
          stockWaveId:str,//波次id
        }
        this._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/queryWaveExpress', data)
          .then((res) => {
            if(res.data.success == true){
              this.sysexPressId=res.data.result.expressName;
              this.expressOne=res.data.result.expressId
              if (res.data.result.expressName.indexOf("EMS") != -1||res.data.result.expressName.indexOf("邮政") != -1) {
                this.associateMethod = '1002'//联想方式
                this.isShowfirst=false
                this.isShowTwo=true
                this.mark=1
              } else {
                this.associateMethod = '1001'//联想方式
                this.isShowfirst=true
                this.isShowTwo=false
              }
            }
          })
      },

      //剔除波次取消窗口
      cancel(){
        this.judge = false;
        this.print=true;
       },

      //分配快递单号
      AssignNumber() {
        this.isNum=0
        this.getExpressId()
        this.isCoverOld = false//允许覆盖原始单号
        this.stockWaveId = ''//波次id
        this.expressId =''//快递id
        this.expressNo = ''//第一个快递单号
        this.input1 = '',
        this.input2 = '',
        this.input3 = ''
        if (this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message: '请选择待分配且纸质面单类型快递的订单波次！',
            type: 'warning'
          })
          return false
        }
        for (let item of this.tableNum) { // 库位ID，用逗号隔开
          if (item.waveStatus == 1002) {
            this.isNum++
          }
        }
        let nub=this.tableNum.length
        if(this.tableNum.length>1){
          this.$message({
            message: '分配快递单号仅支持单个波次批量分配快递单号！',
            type: 'warning'
          })
        }else{
          if(this.isNum==nub){
            this.getexpressName()
            this.assignNumber=true
            this.expressId=this.sysexPressId//快递id
          }else{
            this.assignNumber=false
            this.$message({
              message: '已选波次中有状态为非待分配的订单波次！',
              type: 'warning'
            })
          }
        }

      },

      //分配确定按钮
      AssignSuccess(){
        var vals=[];
        for(var item of this.tableNum){
          vals.push(item.waveStatus);
        }
        for(let i=0; i<vals.length; i++) {
          if(vals[i]== 1002) {//待分配且快递为纸质面单类型
             let str = []
             for(let item of this.tableNum){ // 库位ID，用逗号隔开
              // str += item.stockWaveId + ','
               str.push(item.stockWaveId)
             }
             var n=''
             n = this.tableNum.length
            var arr=[this.input1,this.input2,this.input3]
            var arr_str=arr.join()
            this.expressSame=arr_str.replace(/,/g,'');
            if(this.mark==1){
              this.expressNo=this.expressSame
            }else{
              this.expressNo=this.expressNo
            }
            if (this.expressNo==''){
              this.$message({
                message: '请填写快递单号!',
                type: 'warning'
              })
              return false
            }
            var data = {
               merchantId:0,//商户id
               stockWaveId:str,//波次id
               expressId:this.expressOne,//快递id
               expressNo:this.expressNo,//第一个快递单号
               associateMethod:this.associateMethod,//联想方式
               isCoverOld:this.isCoverOld,//是否覆盖原来的单据号
             }
            this._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/allotExpressNo', data)
               .then((res) => {
                 if(res.data.success == true){
                   this.assignNumber=false
                   this.$message({
                     message:'分配快递单号成功！',
                     type: 'success'
                   })
                   this.initMessage();
                 }else{
                   this.$message({
                     type: 'warning',
                     message: res.data.msg
                   })
                 }
               })
          }else{
            this.assignNumber=false
            this.$message({
              message:'已选波次中有状态为非待分配的订单波次！',
              type: 'warning'
            })
          }
        }
      },

      //挂起
      hangUp(){
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择未挂起的订单波次！',
            type: 'warning'
          })
          return false
        }
        var vals=[];
        for(var item of this.tableNum){
          vals.push(item.hangupFlag);
        }
      /*  for(let i=0; i<vals.length; i++) {
          if(vals[i]== 0) {*///未挂起
            //str.push(item.stockWaveId)
            let str =[]
            for(let item of this.tableNum){ // 库位ID，用逗号隔开
              str.push(item.stockWaveId)
            }
            this.stockWaveIdList=str
            var data = {
              pickingerName:'',//拣货人名称
              merchantId:0,//商户id
              stockWaveIdList:str,
              stockWaveIdListStr:str
            }
            this._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/hangUp', data)
              .then((res) => {
                if(res.data.success == true){
                  this.$message({
                    message:res.data.msg,
                    type: 'warning'
                  })
                  this.initMessage();
                }else{
                  this.$message({
                    message:res.data.msg,
                    type: 'warning'
                  })
                  this.initMessage();
                }
              }).catch(() => {
              this.$message({//  取消删除提示
                type: 'info',
                message: '已取消挂起'
              })
            })
         /* }else{
            this.$message({
              message:'已选波次中有状态为已挂起的订单波次！',
              type: 'warning'
            })
          }
        }*/
      },

      //解挂
      noHangUp(){
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择已挂起的订单波次！',
            type: 'warning'
          })
          return false
        }
        var vals=[];
        for(var item of this.tableNum){
          vals.push(item.hangupFlag);
        }
      /*  for(let i=0; i<vals.length; i++) {
          if(vals[i]== 1) {*///已挂起
            //str.push(item.stockWaveId)
            let str =[]
            for(let item of this.tableNum){ // 库位ID，用逗号隔开
              // str += item.stockWaveId + ','
              str.push(item.stockWaveId)
            }
            this.stockWaveIdList=str
            var data = {
              pickingerName:'',//拣货人名称
              merchantId:0,//商户id
              stockWaveIdListStr:str,
            }
            this._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/cancleHangUp', data)
              .then((res) => {
                if(res.data.success == true){
                  this.initMessage();
                  //this.queryFn(this.queryAll);
                }else{
                  this.$message({
                    message:res.data.msg,
                    type: 'warning'
                  })
                }
                this.initMessage();
              }).catch(() => {
              this.$message({//  取消删除提示
                type: 'info',
                message: '已取消解挂'
              })
            })
       /*   }else{
            this.$message({
              message:'已选波次中有状态为未挂起的订单波次！',
              type: 'warning'
            })
          }
        }*/
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/'+this.version+'/listOauth').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.optionsStock.push({value: val.storageId,label: val.storageName})
          }.bind(this));
        }.bind(this));
      },

      //删除波次
      deleteWave(){
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择待分配的订单波次！',
            type: 'warning'
          })
          return false
        }
        var vals=[];
        for(var item of this.tableNum){
          vals.push(item.waveStatus);
        }
        for(let i=0; i<vals.length; i++) {
          if(vals[i]== 1002) {//待分配
            //str.push(item.stockWaveId)
            let str =[]
            for(let item of this.tableNum){ // 库位ID，用逗号隔开
              // str += item.stockWaveId + ','
              str.push(item.stockWaveId)
            }
            this.stockWaveIdList=str
            var data = {
              pickingerName:'',//拣货人名称
              merchantId:0,//商户id
              stockWaveIdListStr:str,
            }
            this._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/delete', data)
              .then((res) => {
                if(res.data.success == true){
                  this.initMessage();
                  //this.queryFn(this.queryAll);
                }
              }).catch(() => {
              this.$message({//  取消删除提示
                type: 'info',
                message: '已取消删除'
              })
            })
          }else{
            this.$message({
              message:'已选波次中有状态为非待分配的订单波次！',
              type: 'warning'
            })
          }
        }
      },

      //分配
      UnassignOne(){
        if(this.tableNum.length == 0) { // 判断是否选中要删除的波次
          this.$message({
            message:'请选择待分配的订单波次！',
            type: 'warning'
          })
          return false
        }
        var vals=[];
        for(var item of this.tableNum){
          vals.push(item.waveStatus);
        }
        for(let i=0; i<vals.length; i++) {
          if(vals[i]== 1002) {//待分配
            this.centerDialogVisible=true;
            this.pickingerId = ''
            this.assigner();
          }else{
            this.centerDialogVisible=false
            this.$message({
              message:'已选波次中有状态为非待分配的订单波次！',
              type: 'warning'
            })
            return false;
          }
        }
      },

      //确认分配
      istrue(){
        if(this.pickingerId == '') {
          this.isMoverShow = true;
          return false;
        }else{
          this.isMoverShow = false;
        }
        this.person.forEach((val)=>{
          if(val.userId==this.pickingerId){
            this.pickinger=val.userName
          }
        })
        let str =[]
        for(let item of this.tableNum){ // 库位ID，用逗号隔开
          str.push(item.stockWaveId)
        }
        this.stockWaveIdList=str
        var data = {
          pickingerId:this.pickingerId,//拣货人id
          pickingerName:this.pickinger,//拣货人名称
          merchantId:0,//商户id
          stockWaveIdListStr:str
        }
        this._post('com.edb01.erp.wms.service.api.WmStockWaveService/'+this.version+'/allot', data)
          .then((res) => {
            if(res.data.success == true){
              this.centerDialogVisible=false
              this.$message({
                type: 'success',
                message: '分配成功!',
              })
              this.initMessage();
            }else{
                this.centerDialogVisible=false
                this.$message({
                message:res.data.msg,
                type: 'warning'
              })
            }
          }).catch(() => {
          this.$message({//  取消删除提示
            type: 'info',
            message: '已取消分配'
          })
        })

      },

      //分配人
      assigner(){
        this._post('com.edb01.upms.service.UserService/'+this.version+'/getUserByPri', {privilegeName:'波次列表'})
          .then((res) => {
            this.person = res.data.result;
          })
      }
    },
     //获取列表
    created() {
      // 登录获取token
      if (sessionStorage.getItem('clToken')) {
        this.token = sessionStorage.getItem('clToken')
      }
    }

  }
</script>
<style>
  @media screen and (max-width: 1366px) {
    .el-input--suffix .el-input__inner {
      padding-left: 5px;
    }
  }
  #WaveList .el-input--suffix .el-input__inner {
    padding-right: 22px;
  }
</style>
<style scoped>
  #WaveList{
    padding: 20px;
  }
  .pTop{
    margin-bottom: 20px;
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
  .fix-l1 {
    width: 260px;
  }
  @media screen and (max-width: 1366px) {
    .isSize {
      margin-left: 13px;
    }
  }

</style>

