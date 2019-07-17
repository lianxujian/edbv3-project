<!--订单标记-超时订单 方证/樊虎-->
<template>
  <div id="orderMarkOvertime">
    <!--面包屑导航-->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="col-breadcrumb">
        <el-breadcrumb-item @click.native="showParentBlock">{{$t("orderSign.signSetting")}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t("orderSign.onOvertimeSetting")}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--操作导航栏-->
    <div class="col-nav" style="margin-top: 20px;">
      <ul>
        <li @click="handleAddOvertime"><span>{{$t("orderSign.onAdd")}}</span></li>
      </ul>
    </div>

    <!--超时标记备注-->
    <div style="margin-top: 20px;">
      <span>{{$t("orderSign.overtimeTip")}}</span>
    </div>

    <!--主数据表格区-->
    <div style="padding-top: 20px;">
      <el-table id="tabOvertime" :data="list" row-key="planId" v-loading.body="listLoading" :show-header="false" stripe
                border fit highlight-current-row :height="tabHeight" style="width: 100%">
        <el-table-column :label="$t('orderSign.index')" type="index" align="center" width="30">
        </el-table-column>
        <el-table-column :label="$t('orderSign.timeOutLong')" header-align="center" width="320">
          <template slot-scope="scope">
            <span>{{$t('orderSign.timeOutLong')}}</span>
            <!--<el-input v-model="scope.row.timeout" :disabled="!scope.row.edit" style="width: 55px"></el-input>-->
            <el-input v-model="scope.row.timeoutSec" :disabled="!scope.row.edit" @keyup.native="channelKeyUp(scope.$index)" type='text' style="width: 95px !important;"></el-input>
            <span style="margin-right: 10px">{{$t('orderSign.hour')}}</span>
            <template v-if="scope.row.signTimeoutId !== ''">
              <el-button v-if="scope.row.enabledFlag === false && !scope.row.edit" @click="handleEnablePlan(scope.row)" :disabled="scope.row.edit" type="text">
                {{$t("orderSign.onEnable")}}
              </el-button>
              <el-button v-if="scope.row.enabledFlag" @click="handleEnablePlan(scope.row)" :disabled="scope.row.edit" type="text">
                {{$t("orderSign.onDisable")}}
              </el-button>
            </template>
            <template v-if="scope.row.edit">
              <el-button @click="confirmEdit(scope.row)" type="text">
                {{$t("orderSign.onSave")}}
              </el-button>
              <el-button @click='cancelEdit(scope.row)' type="text">
                {{$t("orderSign.onCancel")}}
              </el-button>
            </template>
            <template v-else>
              <el-button @click='handleEditOvertime(scope.row)' v-if="!scope.row.enabledFlag" :disabled="scope.row.enabledFlag" type="text">
                {{$t("orderSign.onModify")}}
              </el-button>
              <el-button @click='deteleEdit(scope.row)' v-if="!scope.row.enabledFlag" :disabled="scope.row.enabledFlag" type="text" :style="{color: scope.row.enabledFlag ? '#C0C4CC':'red'}">
                {{$t("orderSign.onDelete")}}
              </el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderSign.listPlat')" header-align="center">
          <template slot-scope="scope">
            <ul class="my-plat-list">
              <li v-for="item in scope.row.Plats" class="plat-li">{{item}}
                <i v-show="scope.row.edit" @click="handleDeletePlat(scope.row, item)" class="el-icon-error"></i>
              </li>
            </ul>
            <el-button v-show="scope.row.edit" @click="handleShowPlat(scope.row)" icon="el-icon-plus" style="margin-top: 2px;"></el-button>
            <!--<span v-show="scope.row.edit" @click="handleShowPlat(scope.row)" class="plat-li"><i class="el-icon-plus"></i></span>-->
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-dialogDrag :title="$t('orderSign.dialogPlat')" width="700px" :visible.sync="dialogPlatVisible" :close-on-click-modal="false">
        <!--<div>
          <el-select v-model="plats" filterable multiple collapse-tags clearable style="width: 100%;">
            <el-option v-for="item in listPlat" :key="item.platId" :value="item.platId" :label="item.platName"></el-option>
          </el-select>
        </div>-->
        <div class="self-align-center">
          <!--<div style="margin:0 auto; background: green" >-->
          <el-transfer
            filterable
            :titles="['待选平台', '已选平台']"
            v-model="plats"
            :props="{ key: 'platId', label: 'platName' }"
            :data="listPlat">
            <!--<el-button class="transfer-footer" slot="left-footer">操作</el-button>-->
            <!--<el-button class="transfer-footer" slot="right-footer">操作</el-button>-->
          </el-transfer>
          <!--</div>-->
        </div>
        <div slot="footer" align="center">
          <el-button @click="dialogPlatVisible = false">{{$t('orderSign.onCancel')}}</el-button>
          <el-button @click="onOk" type="primary">{{$t('orderSign.onOk')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  //import { fetchOvertimeList, fetchPlatList, enableOvertime, createOvertime, updateOvertime, deleteOvertime } from '@/api/orderSign'

  export default {
    name: 'signOvertime',
    data() {
      return {
        apiVersion: '1.0.0',
        listLoading: false,//表格loading
        list: null,//表格数据
        curRow: null,//当前行
        editing: false,//是否编辑状态
        listPlat: [],//平台集合
        plats: [],//选中的平台集合
        platList:[],//平台集合data
        dialogPlatVisible: false,//添加平台弹框
        tabHeight: 100,
        type:this.$router.history.current.params.type,//0 1
        signId:this.$router.history.current.params.signId,//订单标记id
      }
    },
    created() {
      //初始化
      this.initOvertime(this.signId)
      this.$nextTick(() => {
        this.onResize()
      })
    },
    mounted() {
      window.onresize = () => {
        this.onResize()
      }
    },
    beforeRouteLeave(to, from, next) {
      /*if (to.path == "/index") {
        to.meta.keepAlive = true;
      } else {
        to.meta.keepAlive = false;
      }
      */
      from.meta.test = 'fanhu';
      next();
    },
    methods: {
      onResize() {
        const clientHeight = document.body.clientHeight
        this.tableTop = document.getElementById('tabOvertime').offsetTop
        if (clientHeight - this.tableTop - 50 > 100) {
          this.tabHeight = clientHeight - this.tableTop - 50
        } else {
          this.tabHeight = 100
        }
      },
      //输入框失焦校验
      channelKeyUp(index){
        this.list[index].timeoutSec = this.list[index].timeoutSec.replace(/[^\d]/g,'');
        if(this.list[index].timeoutSec>200){
          this.list[index].timeoutSec=200;
        }
      },
      //跳转到订单标记页
      showParentBlock() {
        //this.$emit('toblock', 'signMain', '')
        this.$router.push({name: 'orderMarks',params:{type:this.type}});
      },
      //初始化
      initOvertime(signId) {
        this.signId = signId
        this.platListFn()
      },
      //获取平台集合
      platListFn(){
        this._post('com.edb01.erp.mdata.service.api.EcService/'+ this.apiVersion + '/getEcBeanList').then((response)=>{
          if(response.data.success){
            this.platList=response.data.result;
            this.getList()
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //渲染表格数据
      getList() {
        const _item = { signId: this.signId }
        this.listLoading = true
        //fetchOvertimeList(_item)
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/selectOrderSignSystemOverTime',_item).then(response => {
          if (response.data.success === true) {
            const items = response.data.result
            this.list = items.map(v => {
              this.$set(v, 'edit', false)
              /*var _platIds = []
              _platIds = v.platFormIds.length > 0 ? v.platFormIds.split(',') : []
              v.PlatId = _platIds*/
              var _listPlat = [],mapArr = new Map();
              v.platFormIds.forEach((item, i) => {
                mapArr.set(item, item);
              })
              this.platList.forEach((item,i)=>{
                if (mapArr.get(item.ecId)) {
                  _listPlat.push(item.ecName);
                }
              })
              v.Plats = _listPlat
              v.PlatId = v.platFormIds
              v.originalTimeout = v.timeoutSec
              return v
            })
            this.editing = false;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
          this.listLoading = false
        }).catch((error) => {
          console.log(error)
          this.listLoading = false
        })
      },
      //删除平台
      handleDeletePlat(row, platid) {
        const index = row.Plats.indexOf(platid)
        row.Plats.splice(index, 1)
        row.PlatId.splice(index, 1)
      },
      //添加方案
      handleAddOvertime() {
        if (this.editing === true) {
          this.$confirm('请先保存或取消当前编辑方案。', this.$t('orderSign.prompt'), {
            showCancelButton: false,
            // type: 'info',
            center: true
          })
        } else {
          this.editing = true
          this.list.unshift({
            signId: '',
            signTimeoutId:'',
            timeoutSec: '',
            platIds: '',
            Plats: [],
            PlatId: [],
            enabledFlag: false,
            edit: true
          })
        }
      },
      //判断方案是否可编辑
      handleEditOvertime(row) {
        if (this.editing === true) {
          this.$confirm('请先保存或取消当前编辑方案。', this.$t('orderSign.prompt'), {
            showCancelButton: false,
            // type: 'info',
            center: true
          })
        } else {
          this.editing = true
          row.edit = true
        }
      },
      //排除已添加平台
      handleShowPlat(row) {
        this.curRow = row;
        this.dialogPlatVisible = true
        this.plats = []
        //fetchPlatList()
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/getOrderSignSystemOverTimeSelectedPlat').then(response => {
          if (response.data.success === true) {
            //this.listPlat = response.data.result
            var listPlat=[],mapArr=new Map();
            response.data.result.forEach((item,i)=>{
              mapArr.set(item.ecPlatformId,item);
            })
            this.platList.forEach((item,i)=>{
              if(!mapArr.get(item.ecId)){
                listPlat.push(item);
              }else{
                console.log(item.ecId);
              }
            })
            listPlat.forEach((item,i)=>{
              item.platName=item.ecName;
              item.platId=item.ecId;
            })
            this.listPlat = listPlat;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //添加平台
      onOk() {
        const _plats = this.listPlat.reduce((acc, cur) => {
          acc[cur.platId] = cur.platName
          return acc
        }, {})
        this.plats.map(p => {
          var isExist = false
          for (const s of this.curRow.PlatId) {
            if (s === p) {
              isExist = true
              break
            }
          }
          if (isExist === false) {
            this.curRow.PlatId.push(p + '')
            this.curRow.Plats.push(_plats[p])
          }
        })
        this.dialogPlatVisible = false
      },
      //保存方案
      confirmEdit(row) {
        var _this=this;
        if(!(row.timeoutSec+'') || (row.timeoutSec+'').trim()==''){
          this.$message({
            message:"请填写超时时长",
            type: 'warning'
          });
          return false;
        }
        row.timeoutSec = parseInt(row.timeoutSec)
        if (row.signTimeoutId === '') {
          const item = { signId:_this.signId,timeoutSec: row.timeoutSec, platIds: JSON.stringify(row.PlatId)}
          //createOvertime(item)
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/addOrderSignSystemOverTimeValue',item).then(response => {
            if (response.data.success === true) {
              this.platListFn()
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        } else {
          const item = { signId:_this.signId,signTimeoutId: row.signTimeoutId, timeoutSec: row.timeoutSec, platIds: row.PlatId.join(',') }
          //updateOvertime(item)
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/updateOrderSignSystemOverTimeValue',item).then(response => {
            if (response.data.success === true) {
              this.editing = false
              row.edit = false
              row.platFormIds = row.PlatId.join(',')
              row.listPlat = row.Plats.join(',')
              //this.platListFn()
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      //取消方案
      cancelEdit(row) {
        console.log(row);
        this.editing = false
        if (row.signTimeoutId === '') {
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        } else {
          row.timeoutSec = row.originalTimeout
          var PlatId = []
          PlatId = row.platFormIds.length > 0 ? row.platFormIds: []
          row.PlatId = PlatId
          var Plats = []
          Plats = row.Plats.length > 0 ? row.Plats: []
          row.Plats = Plats
          row.edit = false
        }
      },
      //删除方案
      deteleEdit(row) {
        // this.$t('orderSign.deleteSignPlan') + this.$t('orderSign.infoContinue')
        this.$confirm(this.$t('orderSign.deleteSignPlan'), this.$t('orderSign.prompt'), {
          // type: 'warning'
          center: true
        }).then(() => {
          const item = { signTimeoutId: row.signTimeoutId }
          //deleteOvertime(item)
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/deleteOrderSignSystemOverTimeValue',item).then(response => {
            if (response.data.success === true) {
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        })
      },
      //启用方案
      EnablePlan(row) {
        const item = { signTimeoutId: row.signTimeoutId, enabledFlag: !row.enabledFlag }
        //enableOvertime(item)
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/updateOrderSignSystemOverTimeValueIsEnable',item).then(response => {
          if (response.data.success === true) {
            row.enabledFlag = !row.enabledFlag
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //停用方案
      handleEnablePlan(row) {
        if (row.enabledFlag === true) {
          this.$confirm('确认停用该方案?', this.$t('orderSign.prompt'), {
            // type: 'warning'
            center: true
          }).then(() => {
            this.EnablePlan(row)
          })
        } else {
          this.EnablePlan(row)
        }
      },
      //关闭确认
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      }
    }
  }
</script>

<style>
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
  .self-align-center .el-transfer-panel {
    text-align: left;
  }
</style>

<style scoped>
  .plat-li{
    color: #fff;
    float: left;
    margin: 2px 5px 2px 0;
    padding: 3px 5px;
    min-width: 10px;
    background-color: #5F9EDF;
    text-align: center;
    border-radius: 5px;
  }
  .icon-star{
    margin-right:2px;
  }
  .drag-handler{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .show-d{
    margin-top: 15px;
  }
  .self-align-center {
    text-align: center
  }
  ol, ul {
    margin-top: 0;
    margin-bottom: 0;
  }
</style>
