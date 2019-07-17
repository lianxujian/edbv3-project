<!--赠品策略 樊虎-->
<template>
  <div id="giftStrategy" style='padding-left:20px;' v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <div v-show="paramsObj.mainPageShow">
      <!--查询搜索区-->
      <div id="searchBox">
        <div class="leftBox2">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="planName">策略编号：</label>
                <el-input id="planName" size='small' v-model="paramData.giftStrategyNo"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="planName">策略名称：</label>
                <el-input id="planName" size='small' v-model="paramData.planName"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="partShop">参与店铺：</label>
                <multiple-select
                  :selectArr="participateShopArr"
                  :valueArr="paramData.storeIdList"
                  @multipleChange="multipleChange2"
                  style="width:65%;">
                </multiple-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">生效状态：</label>
                <el-select v-model="paramData.statusid" placeholder="">
                  <el-option
                    v-for="item in effectiveStateArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">开始时间：</label>
                <el-date-picker
                  :editable="false"
                  :clearable="false"
                  v-model="paramData.startdate"
                  @change="channelChangeDate(1)"
                  type="datetime"
                  placeholder=""
                  format='yyyy-MM-dd HH:mm:ss'
                  value-format='yyyy-MM-dd HH:mm:ss'>
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="">结束时间：</label>
                <el-date-picker
                  :editable="false"
                  :clearable="false"
                  @change="channelChangeDate(2)"
                  v-model="paramData.enddate"
                  type="datetime"
                  placeholder=""
                  format='yyyy-MM-dd HH:mm:ss'
                  value-format='yyyy-MM-dd HH:mm:ss'>
                </el-date-picker>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="giftWay">赠送方式：</label>
                <multiple-select
                  :selectArr="givingWayArr"
                  :valueArr="paramData.givewayid"
                  @multipleChange="multipleChange1"
                  style="width:65%;">
                </multiple-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="enableFlag">启用状态：</label>
                <el-select id="enableFlag" v-model="paramData.enableFlag" placeholder="">
                  <el-option
                    v-for="item in enabledStateArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="groupList">所属分组：</label>
                <multiple-select
                  :selectArr="groupArr"
                  :valueArr="paramData.groupIdList"
                  @multipleChange="multipleChange3"
                  style="width:65%;">
                </multiple-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="rightBox2">
          <el-button type="primary" @click='queryBtn'>查询</el-button>
          <el-button @click='resetBtn'>重置</el-button>
        </div>
      </div>
      <div style="clear:both;"></div>
      <!--操作按钮区-->
      <div class="col-nav">
        <ul>
          <li @click="newStrategyBtn" v-if="authorityCode.OMS_GIFTSTRATEGY_ADD"><span>添加</span></li>
          <li @click="batchDelBtn" v-if="authorityCode.OMS_GIFTSTRATEGY_DEL"><span>批量删除</span></li>
          <li @click='Invalidated' v-if="authorityCode.OMS_GIFTSTRATEGY_CANCEL"><span>作废</span></li>
          <!--<li @click="publicLogBtn"><span>查看日志</span></li>-->
          <li><span @click="groupSetting">分组设置</span></li>
          <li><span @click="prioritizeOpen">调整优先级</span></li>
        </ul>
      </div>
      <!--主数据表格区-->
      <div class="col-border" style="margin-top:15px;">
        <el-table
          border
          v-if="autoHeight"
          :height="t_height"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align='center'
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            label="序号"
            align='center'
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="giftStrategyNo"
            align='center'
            label="策略编号"
            min-width='100'
            width="">
          </el-table-column>
          <el-table-column
            align='center'
            label="策略名称"
            min-width="130">
            <template slot-scope="scope">
              <span style="cursor: pointer;color:#409EFF;"
                    @click="Hyperlink(scope.row)">{{scope.row.giftStrategyName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align='center'
            min-width=''
            label="生效状态">
            <template slot-scope="scope">
              <span style="color:#000;" v-if="scope.row.statusName=='未开始'">{{scope.row.statusName}}</span>
              <span style="color:green;" v-if="scope.row.statusName=='进行中'">{{scope.row.statusName}}</span>
              <span style="color:red;" v-if="scope.row.statusName=='已过期'">{{scope.row.statusName}}</span>
              <span style="color:#999;" v-if="scope.row.statusName=='已作废'">{{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="giftingWayName"
            label="赠送方式"
            min-width=''
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="sortWaitTime"
            label="排序等待时间"
            min-width='100'
            align='center'
            width="">
          </el-table-column>
          <el-table-column
            prop="giftingWayName"
            label="所属分组"
            min-width=''
            align='center'
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.groupName">{{scope.row.groupName}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="giftStrategyGroupPri"
            label="分组内优先级"
            min-width='100'
            align='center'
            width="">
            <template slot-scope="scope">
              <span v-if="scope.row.giftStrategyGroupPri">{{scope.row.giftStrategyGroupPri}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            align='center'
            label="启用状态"
            min-width=''
            width="">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enableFlag" :disabled="!authorityCode.OMS_GIFTSTRATEGY_STATUS" @change="switchBtn(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="enddate"
            align='center'
            label="起止时间"
            width="270">
            <template slot-scope="scope">
              {{scope.row.startdate}} ～ {{scope.row.enddate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="joinStoreNameList"
            align='center'
            label="参与店铺"
            width="160"
            :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
            label="操作"
            align='center'
            width="190">
            <template slot-scope="scope">
              <el-button
                v-if="(scope.row.statusName=='未开始'||scope.row.statusName=='进行中') && !scope.row.enableFlag && authorityCode.OMS_GIFTSTRATEGY_EDIT"
                type="text"
                @click="handleEdit(scope.$index, scope.row)">修改
              </el-button>
              <el-button
                type="text"
                v-if="authorityCode.OMS_GIFTSTRATEGY_COPY"
                @click="handleCopy(scope.$index, scope.row)">复制
              </el-button>
              <el-button
                type="text"
                @click="participateBtn(scope.$index, scope.row)">参与订单
              </el-button>
              <el-button
                type="text"
                v-if="authorityCode.OMS_GIFTSTRATEGY_DEL"
                style="color:red;"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
      <!--分组设置弹框-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="分组设置" :visible.sync="dialogGroup" width="800px">
        <div class="input-box">
          <el-row>
            <el-col :span="10">
              <div><label for="">分组名称：</label>
                <el-input style="width:200px;" v-model="groupParam.groupName" @keyup.enter.native="queryGiftBtn1"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button  type="primary" style="height:28px;" @click="queryGiftBtn1">查询</el-button>
            </el-col>
          </el-row>
          <div class="col-nav" style="margin-top: 10px;">
            <ul>
              <li><span @click="addGroup">添加</span></li>
              <li><span @click="deleteGroup">删除</span></li>
            </ul>
          </div>
          <el-table
            border
            max-height="400"
            :data="groupData"
            @selection-change="handleSelectionChange1"
            style="margin-top:5px;"
          >
            <el-table-column
              align='center'
              type="selection"
              width="80">
            </el-table-column>
            <el-table-column
              label="序号"
              align='center'
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              label="分组名称"
              min-width=''
              align='center'
              width="">
              <template slot-scope="scope">
                <el-input type="text" size="small" maxlength="20" v-if="scope.row.isEdit" v-model="scope.row.groupName"></el-input>
                <span v-else>{{scope.row.groupName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align='center'
              label="说明"
              width="">
              <template slot-scope="scope">
                <el-input type="text" size="small" maxlength="200" v-if="scope.row.isEdit" v-model="scope.row.groupDesc"></el-input>
                <span v-else>{{scope.row.groupDesc}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="usableQty"
              align='center'
              label="操作"
              width="">
              <template slot-scope="scope">
                <el-button size="small" type="text" v-if="!scope.row.isEdit" @click="editGroupBtn(scope.row)">修改</el-button>
                <el-button size="small" type="text" v-else @click="saveGroupBtn(scope.row)">保存</el-button>
                <el-button size="small" style="color:red;" type="text" v-if="!scope.row.isEdit" @click="delGroupBtn(scope.row)">删除</el-button>
                <el-button size="small" type="text" v-else @click="cancelGroupBtn(scope.row,scope.$index)">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogGroup = false">关闭</el-button>
      </span>
      </el-dialog>
      <!--调整优先级-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="分组设置" :visible.sync="dialogPrioritize" width="800px">
        <div>
          <el-row style="margin-bottom:10px;">
            <label for="">请选择需要调整方案优先级的分组：</label>
            <el-select id="enableFlag" style="width:220px;margin-left:5px;" v-model="prioritizeParam.groupId" @change="channelPrioritize" placeholder="请选择">
              <el-option
                v-for="item in groupArr1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-row>
          <el-table
            v-if="prioritizeParam.groupId"
            border
            max-height="400"
            :data="strategyData"
            style="margin-top:5px;"
          >
            <el-table-column
              label="序号"
              align='center'
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              label="策略名称"
              min-width=''
              prop="giftStrategyName"
              align='center'
              width="">
            </el-table-column>
            <el-table-column
              label="生效状态"
              min-width=''
              prop="statusName"
              align='center'
              width="">
            </el-table-column>
            <el-table-column
              label="赠送方式"
              min-width=''
              prop="giftingWayName"
              align='center'
              width="">
            </el-table-column>
            <el-table-column
              prop="usableQty"
              align='center'
              label="优先级"
              width="">
              <template slot-scope="scope">
                <i class="el-icon-upload2" @click="upArrowBtn(scope.row,scope.$index)"
                   v-if="scope.$index!=0"
                   style="color:#409EFF;font-size: 16px;cursor: pointer;"></i>
                <i class="el-icon-upload2" v-if="scope.$index==0"
                   style="font-size: 16px;cursor: no-drop;"></i>
                <i class="el-icon-download" @click="downArrowBtn(scope.row,scope.$index)"
                   v-if="scope.$index!=strategyData.length-1"
                   style="color:orange;font-size: 16px;cursor: pointer;"></i>
                <i class="el-icon-download"
                   v-if="scope.$index==strategyData.length-1"
                   style="font-size: 16px;cursor: no-drop;"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPrioritize = false">取消</el-button>
          <el-button type="primary" @click='prioritizeSave'>确定</el-button>
        </span>
      </el-dialog>
      <!--公共日志弹框-->
      <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    </div>
    <!--添加修改查看复制-->
    <gift-add v-if="paramsObj.giftAdd" :params="paramsObj" @changeShow="changeShow"></gift-add>
    <Participate v-if="paramsObj.participate" :params="paramsObj" @changeShow="changeShow"></Participate>
  </div>
</template>

<script>
  import {turnTimestamp} from '@/assets/js/validate.js';
  import publicLog from '@/components/common/publicLog.vue';
  import GiftAdd from '@/components/views/commodity/children/GiftAdd.vue';
  import Participate from '@/components/views/commodity/children/Participate.vue';

  export default {
    components: {
      'v-Publiclog': publicLog,
      GiftAdd,
      Participate
    },
    data() {
      return {
        //保洁
        autoHeight:true,//重新调整表格高度
        groupData:[],//分组表格data
        selectionData1:[],//表格选中集合
        groupParam:{
          groupName:'',
        },//分组查询参数
        dialogGroup:false,//分组设置弹框
        groupArr:[],//分组下拉集合
        isEditing:false,//是否可编辑
        dialogPrioritize:false,//调整优先级
        prioritizeParam:{
          groupId:''
        },//调整优先级查询条件
        groupArr1:[],//调整优先级分组下拉集合
        strategyData:[],//调整优先级表格data
        paramsObj: {
          mainPageShow: true,
          giftAdd: false,
          participate:false,
        },//新建修改复制查看组件参数
        loading: false,
        paramObj: {},//公共日志组件参数
        pulicLogVisible: false,//公共日志弹框
        version: '1.0.0',
        renderFn: () => {
        },//主数据表格渲染
        deleteFn: () => {
        },//删除或作废
        totalNum: 0,
        totalPage: 15,
        currentPage: 1,
        tableData: [],//主数据表格data
        paramData: {
          page: 1,
          size: 15,
          tenantId: 0,
          enableFlag: '',
          statusid: 0,
          givewayid: [1,2,3,4,5,6,7],
          storeIdList:[],
          groupIdList:[],
          startdate: '',
          enddate: '',
          planName: ''
        },//主数据表格查询条件
        selectionData: [],//主数据表格选中值集合
        effectiveStateArr: [
          {
            label: '全部',
            value: 0
          },
          {
            label: '未开始',
            value: 1
          },
          {
            label: '进行中',
            value: 2
          },
          {
            label: '已过期',
            value: 3
          },
          {
            label: '已作废',
            value: 4
          }
        ],//生效状态
        givingWayArr: [
          {
            label: '订单金额阶梯赠送',
            value: 1,
            disabled: false
          },
          {
            label: '订单满金额赠送',
            value: 2,
            disabled: false
          },
          {
            label: '订单满件数赠送',
            value: 3,
            disabled: false
          },
          {
            label: '订单满种类赠送',
            value: 4,
            disabled: false
          },
          {
            label: '指定单品买就送',
            value: 5,
            disabled: false
          },
          {
            label: '多个商品买就送',
            value: 6,
            disabled: false
          },
          {
            label: '名额阶梯赠送',
            value: 7,
            disabled: false
          }
        ],//赠送方式
        enabledStateArr: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: 'true'
          },
          {
            label: '停用',
            value: 'false'
          }
        ],//启用状态
        participateShopArr: [],//参与店铺集合
        t_height: 0,
        shopSelect: [],//店铺选中值
        groupSelect:[],//分组选中值
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
      }
    }, methods: {
      //多选下拉组件（赠送方式）
      multipleChange1(value) {
        this.paramData.givewayid = value;
      },
      //店铺
      multipleChange2(value) {
        this.paramData.storeIdList = value;
      },
      //分组
      multipleChange3(value) {
        this.paramData.groupIdList = value;
      },
      //是否处于编辑状态
      iseditFn(){
        if(this.isEditing){
          this.$message({
            message: '请先保存后再进行操作',
            type: 'warning'
          });
          return true;
        }else{
          return false;
        }
      },
      //多选框
      handleSelectionChange1(val) {
        this.selectionData1 = val;
      },
      //添加分组按钮
      addGroup(){
        if(this.iseditFn())return false;
        this.isEditing = true;
        this.groupData.unshift({
          isEdit:true,
          groupDesc:'',
          groupName:''
        })
      },
      //保存分组
      saveGroupBtn(row){
        if(!row.groupName){
          this.$message({
            message: '分组名称不能为空',
            type: 'warning'
          });
          return false;
        }
        var params = {
          groupName:row.groupName,
          groupDesc:row.groupDesc
        }
        var urlParam = '';
        if(row.giftStrategyGroupId){
          //修改
          urlParam = 'promplanGroupChange';
          params.groupId = row.giftStrategyGroupId;
        }else{
          //新增
          urlParam = 'promplanGroupAdd';
        }
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/' + urlParam,params).then((response) => {
          if (response.data.success) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.groupSetting();
            this.groupListEcho();
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //编辑分组
      editGroupBtn(row){
        if(this.iseditFn())return false;
        this.isEditing = true;
        row.isEdit = true;
      },
      //删除分组
      delGroupBtn(row){
        if(this.iseditFn())return false;
        this.$confirm('确定删除该分组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/promplanGroupDel',{
            groupIds:row.giftStrategyGroupId
          }).then((response) => {
            if (response.data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.groupSetting();
              this.groupListEcho();
              this.renderFn(this.paramData);
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {});
      },
      //取消分组
      cancelGroupBtn(row,index){
        this.isEditing = false;
        if(row.giftStrategyGroupId){
          //修改
          row.isEdit = false;
        }else{
          //新增
          this.groupArr.splice(index,1);
        }
      },
      //批量删除分组
      deleteGroup(){
        if(this.iseditFn())return false;
        if(this.selectionData1.length <= 0){
          this.$message({
            message: '请选择需要删除的分组',
            type: 'warning'
          });
          return false;
        }
        var groupIds = '';
        this.selectionData1.forEach(item => {
          groupIds += item.giftStrategyGroupId + ',';
        })
        this.$confirm('确定删除这些分组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/promplanGroupDel',{
            groupIds
          }).then((response) => {
            if (response.data.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.groupSetting();
              this.groupListEcho();
              this.renderFn(this.paramData);
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {});
      },
      //分组设置查询
      queryGiftBtn1(){
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/promplanGroupListSearch',this.groupParam).then((response) => {
          if (response.data.success) {
            this.dialogGroup = true;
            this.isEditing = false;
            response.data.result.forEach(item => {
              item.isEdit = false;
            })
            this.groupData = response.data.result;
            /*this.groupArr = response.data.result;
            this.groupArr.forEach((item, i) => {
              item.value = item.giftStrategyGroupId;
              item.label = item.groupName;
              this.groupSelect.push(item.giftStrategyGroupId);
            })
            $('#groupList').multiselect('dataprovider', this.groupArr);
            $('#groupList').multiselect('select', this.groupSelect);*/
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //初始化
      groupSetting(){
        this.groupParam.groupName = '';
        this.queryGiftBtn1();
      },
      //优先级保存
      prioritizeSave(){
        if(this.strategyData.length == 0){
          this.$message({
            message: '该分组下没有策略，请重新选择',
            type: 'warning'
          });
          return false;
        }
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/promplanGroupPriorityChange',{
          groupPriorityJson:JSON.stringify(this.strategyData)
        }).then((response) => {
          if (response.data.success) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.dialogPrioritize = false;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //点击调整优先级
      prioritizeOpen(){
        this.dialogPrioritize = true;
        this.prioritizeParam.groupId = '';
        this.strategyData = [];
        this.groupArr1 = JSON.parse(JSON.stringify(this.groupArr));
        if(this.groupArr1[0] && this.groupArr1[0].label == '全部'){
          this.groupArr1.splice(0,1);
        }
        /*this.groupArr1.unshift({
          value:'',
          label:'请选择'
        })*/
      },
      //选择需要调整方案优先级的分组
      channelPrioritize(){
        this.strategyData = [];
        if(!this.prioritizeParam.groupId){
          return false;
        }
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/promplanGroupPrioritySearch',this.prioritizeParam).then((response) => {
          if (response.data.success) {
            response.data.result = response.data.result.sort((a,b) => {
              return a.giftStrategyGroupPri - b.giftStrategyGroupPri;
            })
            this.strategyData = response.data.result;
          } else {
            this.prioritizeParam.groupId = '';
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //表格向上箭头
      upArrowBtn(row,index) {
        this.strategyData.splice(index,1);
        this.strategyData.splice(index-1,0,row);
        this.strategyData.forEach((item,i)=>{
          item.giftStrategyGroupPri = i+1;
        })
      },
      //表格向下箭头
      downArrowBtn(row, index) {
        this.strategyData.splice(index,1);
        this.strategyData.splice(index+1,0,row);
        this.strategyData.forEach((item,i)=>{
          item.giftStrategyGroupPri = i+1;
        })
      },
      //组件回传
      changeShow(param) {
        if(param && param.isRefresh){
          this.queryBtn();
        }
        this.autoHeight = false;
        this.autoHeight = true;
        this.$nextTick(function () {
          this.t_height = $(window).height() - $('.col-border').offset().top - 80;
        })
        this.paramsObj = {
          mainPageShow: true,
          giftAdd: false,
          giftEdit: false,
          giftQuery:false,
          participate:false
        }
      },
      //时间选择
      channelChangeDate(item) {
        if (this.paramData.startdate && this.paramData.enddate) {
          if (new Date(this.paramData.startdate).getTime() > new Date(this.paramData.enddate).getTime()) {
            this.$message({
              message: '开始时间不能大于结束时间！',
              type: 'warning'
            });
            if (item == 1) {
              this.paramData.startdate = this.paramData.enddate;
            } else {
              this.paramData.enddate = this.paramData.startdate;
            }
          }
         /* if (new Date(this.paramData.enddate).getTime() - new Date(this.paramData.startdate).getTime() > 31 * 24 * 3600 * 1000) {
            this.$message({
              message: '起止时间最长不超过31天！',
              type: 'warning'
            });
            if (item == 2) {
              var startDate = new Date(new Date(this.paramData.enddate).getTime() - 31 * 24 * 3600 * 1000).toLocaleString();
              this.paramData.startdate = startDate.replace(/\//g, '-').replace(/[\u4e00-\u9fa5]/g, '');
            } else {
              var endDate = new Date(new Date(this.paramData.startdate).getTime() + 31 * 24 * 3600 * 1000).toLocaleString();
              this.paramData.enddate = endDate.replace(/\//g, '-').replace(/[\u4e00-\u9fa5]/g, '');
            }
          }*/
        }
      },
      //公共日志点击
      publicLogBtn() {
        this.paramObj.moduleId = 61;
        this.paramObj.billCode = '';
        this.paramObj.typeId = '';
        this.pulicLogVisible = true;
      },
      //公共日志弹框关闭
      changDialogShow() {
        this.pulicLogVisible = false;
      },
      //查询
      queryBtn() {
        this.paramData.planName = this.paramData.planName;
        this.paramData.startdate = this.paramData.startdate == null ? '' : this.paramData.startdate;
        this.paramData.enddate = this.paramData.enddate == null ? '' : this.paramData.enddate;
        this.renderFn(this.paramData);
      },
      //重置
      resetBtn() {
        this.paramData.groupIdList = this.groupSelect;
        this.paramData.givewayid = [1, 2, 3, 4, 5, 6, 7];
        this.paramData.storeIdList = this.shopSelect;

        this.paramData.statusid = 0;
        this.paramData.enableFlag = '';
        this.paramData.giftStrategyNo = '';//策略编号
        this.paramData.planName = '';
        this.paramData.startdate = '';
        this.paramData.enddate = '';
        //this.formatTime();
      },
      handleSizeChange(val) {
        this.paramData.size = val;
        this.totalPage = val;
        this.queryBtn();
      },
      handleCurrentChange(val) {
        this.paramData.page = val;
        this.queryBtn();
      },
      //多选框
      handleSelectionChange(val) {
        this.selectionData = val;
      },
      //switch开关
      switchBtn(row) {
        row.enableFlag = !row.enableFlag;
        if (row.enableFlag) {
          this.$confirm('当前策略正在启用中，是否确定停用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            row.enableFlag = !row.enableFlag;
            this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/updatePromplanEnableFlag', {
              giftStratageId: row.giftStrategyId,
              enableFlag: row.enableFlag,
              tenantId: 0
            }).then((response) => {
              if (response.data.success) {
                this.queryBtn();
              } else {
                row.enableFlag = !row.enableFlag;
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            }).catch(function(error) {
              row.enableFlag = !row.enableFlag;
            });
          }).catch(() => {

          });
        } else {
          this.$confirm('当前策略正在停用中，是否确定启用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            row.enableFlag = !row.enableFlag;
            this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/updatePromplanEnableFlag', {
              giftStratageId: row.giftStrategyId,
              enableFlag: row.enableFlag,
              tenantId: 0
            }).then((response) => {
              if (response.data.success) {
                this.queryBtn();
              } else {
                row.enableFlag = !row.enableFlag;
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            }).catch(function(error) {
              row.enableFlag = !row.enableFlag;
            });
          }).catch(() => {

          });
        }
      },
      //删除单条
      handleDelete(index, row) {
        if (row.statusName == '进行中') {
          this.$confirm('该赠品策略正在进行中，是否确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            var params = {
              giftStratageIds: row.giftStrategyId,
              tenantId: 0,
              type: 1
            }
            this.deleteFn(params, 1);
          }).catch(() => {
          });
        } else {
          this.$confirm('是否确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            var params = {
              giftStratageIds: row.giftStrategyId,
              tenantId: 0,
              type: 1,
            }
            this.deleteFn(params, 1);
          }).catch(() => {
          });
        }
      },
      //删除多条
      batchDelBtn() {
        if (this.selectionData.length == 0) {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        } else {
          var isPass = false, str = '';
          this.selectionData.forEach((item) => {
            str += item.giftStrategyId + ',';
            if (item.statusName == '进行中') {
              isPass = true;
            }
          })
          if (isPass) {
            this.$confirm('存在进行中的赠品策略，是否确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true
            }).then(() => {
              var params = {
                giftStratageIds: str.slice(0, -1),
                tenantId: 0,
                type: 1
              }
              this.deleteFn(params, 0);
            }).catch(() => {
            });
          } else {
            this.$confirm('是否确定删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true
            }).then(() => {
              var params = {
                giftStratageIds: str.slice(0, -1),
                tenantId: 0,
                type: 1
              }
              this.deleteFn(params, 0);
            }).catch(() => {
            });
          }
        }
      },
      //作废
      Invalidated() {//statusName
        var isFlag = true;
        this.selectionData.forEach((item, i) => {
          if (item.statusName != '已作废') {
            isFlag = false;
          }
        })
        if (this.selectionData.length == 0) {
          this.$message({
            message: '请选择要作废的数据！',
            type: 'warning'
          });
        } else if (isFlag) {
          this.$message({
            message: '勾选的赠品策略已经是“已作废”状态！',
            type: 'warning'
          });
        } else {
          var str = '';
          this.selectionData.forEach((item) => {
            str += item.giftStrategyId + ',';
          })
          this.$confirm('策略作废后，赠品剩余赠送数量将不再赠送，是否确定作废？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            var params = {
              giftStratageIds: str.slice(0, -1),
              tenantId: 0,
              type: 2
            }
            this.deleteFn(params, 2);
          }).catch(() => {
          });
        }
      },
      //新建赠品策略
      newStrategyBtn() {
        //this.$router.push({ path:'/giftAdd'});
        this.paramsObj = {
          giftStratageId:'',
          type: 1,
          giftStrategyId: false,
          giftAdd: true,
          participate: false
        }
      },
      //修改
      handleEdit(index, row) {
        //this.$router.push({name: 'giftEdit', params: {giftStratageId: row.giftStrategyId, type: 1}});
        this.paramsObj = {
          giftStrategyId: row.giftStrategyId,
          type: 2,
          mainPageShow: false,
          giftAdd: true,
          participate: false
        }
      },
      //复制
      handleCopy(index, row) {
        //this.$router.push({name: 'giftEdit', params: {giftStratageId: row.giftStrategyId, type: 2}});
        this.paramsObj = {
          giftStrategyId: row.giftStrategyId,
          type: 3,
          mainPageShow: false,
          giftAdd: true,
          participate: false
        }
      },
      //参与订单
      participateBtn(index,row){
        this.paramsObj = {
          giftStrategyId: row.giftStrategyId,
          mainPageShow: false,
          participate: true,
          giftAdd: false
        }
      },
      //超链接查看
      Hyperlink(row) {
        //this.$router.push({name: 'giftQuery', params: {giftStratageId: row.giftStrategyId}});
        this.paramsObj = {
          giftStrategyId: row.giftStrategyId,
          type: 4,
          mainPageShow: false,
          giftAdd: true,
          participate: false,
          giftStrategyNo:row.giftStrategyNo
        }
      },
      //格式化时间
      formatTime(){
        var enddate = new Date().toLocaleDateString().replace(/\//g, '-');
        this.paramData.enddate = enddate + ' 23:59:59';
        let y = new Date().getFullYear();
        let m = new Date().getMonth()-3;
        let d = new Date().getDate();
        var startdate = new Date(y,m,d).toLocaleDateString().split('/');
        startdate[1] = startdate[1].length==1?'0'+startdate[1]:startdate[1];
        startdate[2] = startdate[2].length==1?'0'+startdate[2]:startdate[2];
        this.paramData.startdate = startdate.join('-') + ' 00:00:00';
      },
      //分组集合回显
      groupListEcho(){
        //分组集合
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/promplanGroupListSearch').then((response) => {
          if (response.data.success) {
            this.groupArr = response.data.result;
            this.groupSelect = [];
            this.groupArr.forEach((item, i) => {
              item.value = item.giftStrategyGroupId;
              item.label = item.groupName;
              this.groupSelect.push(item.giftStrategyGroupId);
            })
            this.paramData.groupIdList = this.groupSelect;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },
    mounted() {
      /* axios.all() 同时发起多个请求时的处理
      var _this = this;
      function a(){
        return _this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + _this.version + '/findGrantStoreByUser');
      }
      function b(){
        var paramData = JSON.parse(JSON.stringify(_this.paramData));
        if(_this.groupArr.length > 0 && paramData.groupIdList.length == _this.groupArr.length){
          paramData.groupIdList = '';
        }
        paramData.size = _this.totalPage;
        return _this._post('com.edb01.erp.oms.service.api.PromplanService/' + _this.version + '/getPromplanListBeanByDataPager', paramData)
      }

      this.$axios.all([a(), b()])
        .then(_this.$axios.spread((acct, perms) => {
          console.log(acct, perms);
          console.log('两个请求都完成了')
        }));
      */
      if(!sessionStorage.getItem('authorityCode')){this.authorityCode = localStorage.getItem('authorityCode') ? JSON.parse(localStorage.getItem('authorityCode')) : {};}
      //this.formatTime();
      //参与店铺下拉
      this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/findGrantStoreByUser').then((response) => {
        if (response.data.success) {
          this.participateShopArr = response.data.result;
          this.participateShopArr.forEach((item, i) => {
            item.value = item.storeId;
            item.label = item.storeName;
            this.shopSelect.push(item.storeId);
          })
          this.paramData.storeIdList = this.shopSelect;
        } else {
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      })
      this.groupListEcho();
      //渲染表格高度
      this.$nextTick(function () {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      })
      window.onresize = () => {
        this.t_height = $(window).height() - $('.col-border').offset().top - 80;
      }
      //回车事件
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13 && $('.v-modal').length == 0) { // enter 键
          //要做的事情
          this.queryBtn();
        }
      };
      //回显
      this.renderFn = (param) => {
        var paramData = JSON.parse(JSON.stringify(this.paramData));
        if(this.groupArr.length > 0 && paramData.groupIdList.length == this.groupArr.length){
          paramData.groupIdList = '';
        }
        paramData.size = this.totalPage;
        //console.log(paramData);
        this.loading = true;
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/getPromplanListBeanByDataPager', paramData).then((response) => {
          this.loading = false;
          if (response.data.success) {
            //下拉框插件
            this.tableData = response.data.result.rows;
            this.tableData.forEach((item, i) => {
              item.joinStoreNameList = JSON.parse(item.joinStoreNameList) != null ? JSON.parse(item.joinStoreNameList).join(',') : '';
              item.startdate = item.startdate?turnTimestamp(item.startdate):'';
              item.enddate = item.enddate?turnTimestamp(item.enddate):'';
            })
            this.totalNum = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
      this.renderFn();
      //删除或作废
      this.deleteFn = (params, type) => {
        this._post('com.edb01.erp.oms.service.api.PromplanService/' + this.version + '/deletePromplanBean', params).then((response) => {
          if (response.data.success) {
            this.renderFn();
            if (type == 0) {
              this.$message({
                message: '批量删除成功',
                type: 'success'
              });
            } else if (type == 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            } else if (type == 2) {
              this.$message({
                message: '作废成功',
                type: 'success'
              });
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
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
