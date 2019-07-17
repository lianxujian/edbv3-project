<!--订单标记 方证/樊虎-->
<template>
  <div id="orderMarks" v-loading="listLoading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <!--操作导航栏-->
    <div class="col-nav">
      <ul style="margin: 0!important;">
        <li @click="handleAddSign" v-if="authorityCode.OMS_ORDERMARKS_ADD"><span>{{$t("orderSign.onAdd")}}</span></li>
        <li @click="publicLogBtn('')"><span>{{$t("orderPlan.viewLog")}}</span></li>
      </ul>
    </div>
    <!--日志弹框-->
    <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>

    <!--主数据表格区-->
    <div style="margin-top: 15px;">
      <el-table id="tabSign" :data="list" border :height="tabHeight" style="width: 100%">
        <el-table-column :label="$t('orderSign.index')" type="index" align="center">
        </el-table-column>
        <el-table-column :label="$t('orderSign.signName')" show-overflow-tooltip header-align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-tooltip effect="light" content="输入最大长度为 10 个汉字或字符！" placement="bottom-start">
                <el-input v-model="scope.row.signName" :maxlength="10"></el-input>
              </el-tooltip>
            </template>
            <span v-else>{{ scope.row.signName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderSign.issystem')" header-align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.signType === 1">{{$t("orderSign.default")}}</span>
            <span v-else>{{$t("orderSign.define")}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderSign.ishangup')" align="center" width="100">
          <template slot-scope="scope">
            <el-checkbox @change="handleHangup(scope.row)" :disabled="scope.row.enabledFlag || scope.row.signId === '3' || !authorityCode.OMS_ORDERMARKS_HANGUP" v-model="scope.row.hangUpFlag"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderSign.isenable')" align="center" width="100">
          <template slot-scope="scope">
            <el-switch @change="handleEnable(scope.row)" :disabled="!authorityCode.OMS_ORDERMARKS_STATUS" v-model="scope.row.enabledFlag"></el-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderSign.remark')" show-overflow-tooltip header-align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-tooltip effect="light" content="输入最大长度为 20 个汉字或字符！" placement="bottom-start">
                <el-input v-model="scope.row.remark" :maxlength="20"></el-input>
              </el-tooltip>
            </template>
            <span v-else>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderSign.operation')" align="center" width="150">
          <template slot-scope="scope">
            <template v-if="scope.row.signType==1 && authorityCode.OMS_ORDERMARKS_RULESSETTING">
              <el-button v-show="scope.row.signName === '超重'" @click="showChildBlock('signWeight',scope.row)" type="text">
                {{$t("orderSign.onRuleSetting")}}
              </el-button>
              <el-button v-show="scope.row.signName === $t('orderSign.signOvertime')" @click="showChildBlock('signOvertime',scope.row)" type="text">
                {{$t("orderSign.onRuleSetting")}}
              </el-button>
            </template>
            <template v-else>
              <el-button @click="showChildBlock('signSetting',scope.row)" v-if="authorityCode.OMS_ORDERMARKS_RULESSETTING" type="text" :disabled="scope.row.signId === ''">
                {{$t("orderSign.onRuleSetting")}}
              </el-button>
              <template v-if="scope.row.edit">
                <el-button @click="confirmEdit(scope.row)" type="text" >
                  {{$t("orderSign.onSave")}}
                </el-button>
                <el-button @click='cancelEdit(scope.row)' type="text">
                  {{$t("orderSign.onCancel")}}
                </el-button>
              </template>
              <template v-else>
                <el-button @click='channelEdit(scope.row)' type="text" v-if="!scope.row.enabledFlag && authorityCode.OMS_ORDERMARKS_EDIT" :disabled="scope.row.enabledFlag">
                  {{$t("orderSign.onModify")}}
                </el-button>
                <el-button @click='deleteEdit(scope.row)' type="text" v-if="!scope.row.enabledFlag && authorityCode.OMS_ORDERMARKS_DEL" :disabled="scope.row.enabledFlag" :style="{color: scope.row.enabledFlag ? '#C0C4CC':'red'}">
                  {{$t("orderSign.onDelete")}}
                </el-button>
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="col-button" v-if="this.type==1">
      <el-button type="primary"  @click="returnOrderProcessing">返回</el-button>
    </div>
  </div>
</template>
<script>
  import publicLog from '@/components/common/publicLog.vue';

  export default {
    name: 'signMain',
    components: {
      'v-Publiclog': publicLog
    },
    data() {
      return {
        apiVersion:'1.0.0',
        paramObj:{},
        pulicLogVisible: false,//公共日志弹框
        list: [], //审单方案列表主数据
        listLoading: false,//表格loading
        tabHeight: 100, //列表高度
        editing:false,//是否编辑状态
        type:this.$router.history.current.params.type,//判断是否从订单处理跳过来的
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//权限code
      }
    },
    created() {

    },
    beforeRouteEnter(to, from, next) {
      /*if (to.path == "/index") {
        to.meta.keepAlive = true;
      } else {
        to.meta.keepAlive = false;
      }
      */
      next();
    },
    mounted() {
      //订单标记列表初始化
      this.getList()
      this.$nextTick(() => {
        this.onResize()
      })
      window.onresize = () => {
        this.onResize()
      }
    },
    methods: {
      //跳转到订单处理
      returnOrderProcessing(){
        this.$router.push({path: '/orderProcessing'});
      },
      // 自适应窗体高度
      onResize() {
        const clientHeight = document.body.clientHeight
        this.tableTop = document.getElementById('tabSign').offsetTop
        if(this.type==0){
          this.tabHeight = clientHeight - this.tableTop - 50;
        }else if(this.type==1){
          this.tabHeight = clientHeight - this.tableTop - 110;
        }
      },
      // 路由跳转
      showChildBlock(clockBlock, row) {
        switch (clockBlock) {
          case 'signWeight':
            this.$router.push({name: 'orderMarkWeight', params: {signId: row.signId,type:this.type}});
            break;
          case 'signOvertime':
            this.$router.push({name: 'orderMarkOvertime', params: {signId: row.signId,type:this.type}});
            break;
          case 'signSetting':
            this.$router.push({name: 'orderMarkSetting', params: {signId: row.signId,type:this.type}});
        }
      },
      //公共日志参数
      publicLogBtn(code) {
        this.paramObj.moduleId = '32';
        this.pulicLogVisible = true
      },
      changDialogShow() {
        this.pulicLogVisible = false
      },
      // 查询订单标记列表
      getList() {
        this.listLoading = true
        // 查询订单标记列表
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/getOrderSignByList').then(response => {
          if (response.data.success === true) {
            const items = response.data.result?response.data.result:[];
            this.list = items.map(v => {
              this.$set(v, 'edit', false)
              v.originalName = v.signName
              v.originalRemark = v.remark
              return v
            })
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
          this.listLoading = false
        }).catch((error) => {
          this.listLoading = false
        })
      },
      // 操作：[添加]订单标记
      handleAddSign() {
        // 最多允许添加20条自定义标记
        let defLen = 0
        this.list.map(v => {
          if (v.signType === 2) {
            defLen += 1
          }
        })
        if(this.editing){
          this.$confirm('请先保存或取消当前编辑方案。', this.$t('orderSign.prompt'), {
            showCancelButton: false,
            center: true
          })
          return false;
        }
        if (defLen >= 20) {
          this.$confirm(this.$t('orderSign.3007'), this.$t('orderSign.prompt'), {
            showCancelButton: false,
            center: true
          })
          return
        }

        // 在表格下方添加一行
        this.list.splice(6, 0, {
          signId: '',
          signName: '',
          signType: 2,
          enabledFlag: false,
          hangUpFlag: false,
          remark: '',
          edit: true
        });
        this.editing=true;
      },
      // 行操作：[保存]订单标记
      confirmEdit(row) {
        // [订单名称]必须输入
        if (row.signName === '') {
          this.$confirm(this.$t('orderSign.100000'), this.$t('orderSign.prompt'), {
            showCancelButton: false,
            center: true
          })
          return
        }

        if (row.signId === '') {
          // 保存[添加]行
          const item = { signName: row.signName, enabledFlag: row.enabledFlag, hangUpFlag: row.hangUpFlag, remark: row.remark }
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/addOrderSign',item).then(response => {
            if (response.data.success === true) {
              this.getList()
              row.edit = false;
              this.editing=false;
              //row.signId = response.data.result.signId
              row.originalName = row.signName;
              row.originalRemark = row.remark;
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        } else {
          // 保存[修改]行
          const item = { signId: row.signId, signName: row.signName, enabledFlag: row.enabledFlag, hangUpFlag: row.hangUpFlag, remark: row.remark }
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/updateOrderSign',item).then(response => {
            if (response.data.success === true) {
              row.edit = false;
              this.editing=false;
              row.originalName = row.signName;
              row.originalRemark = row.remark;
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      //判断是否处于编辑状态
      channelEdit(row){
        if(this.editing){
          this.$confirm('请先保存或取消当前编辑方案。', this.$t('orderSign.prompt'), {
            showCancelButton: false,
            center: true
          })
          return false;
        }
        row.edit=true;
        this.editing=true;
      },
      // 取消【添加】【修改】操作
      cancelEdit(row) {
        if (row.signId === '') {
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        } else {
          row.signName = row.originalName
          row.remark = row.originalRemark
          row.edit = false
        }
        this.editing=false;
      },
      // 删除标记
      deleteEdit(row) {
        this.$confirm(this.$t('orderSign.deleteOrderSign'), this.$t('orderSign.prompt'), {
          center: true
        }).then(() => {
          const item = { signId: row.signId }
          // 删除标记
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/deleteOrderSign',item).then(response => {
            if (response.data.success === true) {
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            } else {
              /*this.$confirm(response.data.msg, this.$t('orderSign.prompt'), {
                showCancelButton: false,
                center: true
              })*/
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        })
      },
      // 行状态【挂起、解挂】
      handleHangup(row) {
        if (row.signId !== '') {
          const item = { signId: row.signId }
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/updateOrderSignHangUp',item).then(response => {
            if (response.data.success === true) {
              // '未合并'标记，同步启用、挂起
              if (row.signId === '3') {
                row.enabledFlag = row.hangUpFlag
              }
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
              row.hangUpFlag = !row.hangUpFlag
            }
          }).catch((error) => {
            row.hangUpFlag = !row.hangUpFlag
          })
        }
      },
      // 行状态【启用、禁用】
      handleEnable(row) {
        if (row.signId !== '') {
          const item = { signId: row.signId }
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/updateOrderSignIsEnable',item).then(response => {
            if (response.data.success === true) {
              // '未合并'标记，同步启用、挂起
              if (row.signId === '3') {
                row.hangUpFlag = row.enabledFlag
              }
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
              row.enabledFlag = !row.enabledFlag
            }
          }).catch((error) => {
            row.enabledFlag = !row.enabledFlag
          })
        }
      }
    }
  }
</script>
