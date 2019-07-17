<!--异常原因 尘音-->
<template>
  <div id="diffReason">
    <!--操作导航-->
    <div class="col-nav" style="margin:0 0 10px">
      <ul style="margin-bottom: 0">
        <li @click="addDiffReason"><span>新增</span></li>
        <el-dialog v-dialogDrag title="添加异常原因" :visible.sync="addDiffVisible" width="500px">
          <div>
            <label for="diff">异常原因：</label>
            <el-input id="diff" v-model="abnormalReason" style="width: 80%"></el-input>
            <p v-if="isdiffShow" style="color: red;text-indent: 5em">请输入异常原因</p>
            <div v-if="isMaxShow" style="color: red;text-indent: 5em;margin-top: 20px">提示：异常原因最多只能15条，请检查操作！</div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="default" @click="addDiffVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDiffSureClick">确 定</el-button>
          </div>
        </el-dialog>
        <li @click="publicLogBtn"><span>查看日志</span></li>
        <publicLogDialog
          @changShow="changDialogShow"
          :paramObj="paramObj"
          :pulicLogVisible="pulicLogVisible">
        </publicLogDialog>
      </ul>
    </div>

    <div class="pDown">
      <el-table id="tableH" :data="tableData" border :max-height="table_h" style="width: 100%">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="异常原因">
          <template slot-scope="scope">
            <p class="cen-g">
              {{ scope.row.abnormalReason }}
            </p>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="177" align="center">
          <template slot-scope="scope">
            <span>
              <el-button @click="handleDelClick(scope.row)" type="text" size="small" style="color: red">删除</el-button>
              <el-button @click="handleEditClick(scope.row)" type="text" size="small">修改</el-button>
            </span>
          </template>
        </el-table-column>

      </el-table>
      <!--异常原因列表-->
      <el-dialog v-dialogDrag title="修改异常原因" :visible.sync="editDiffVisible" width="500px">
        <div>
          <label for="editDiff">异常原因：</label>
          <el-input id="editDiff" v-model="editAbnormalReason" style="width: 80%"></el-input>
          <p v-if="isdiffShow" style="color: red;text-indent: 5em">请输入异常原因</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="default" @click="editDiffVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDiffSureClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import publicLogDialog from '@/components/common/publicLogDialog.vue'
  export default {
    components:{
      publicLogDialog
    },
    data() {
      return {
        version: '1.0.0',//版本号
        addDiffVisible: false,//添加异常原因弹框
        editDiffVisible: false,//修改异常原因弹框
        abnormalReason: '',//添加异常原因
        reasionId: '',//修改异常原因id
        editAbnormalReason: '',//修改异常原因
        isdiffShow: false,//异常原因判空
        isMaxShow: false,//15条限制信息

        table_h: 0,//表格高度
        tableData: [],//表格数据

        pulicLogVisible:false,//查看日志弹框显示隐藏
        paramObj:{},//日志参数对象
      }
    },
    mounted(){

      this.initMessage();//初始化表格数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 35);
        console.log(this.table_h)
      });

    },
    methods: {

      //初始化页面数据
      initMessage: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/abnormalReasonList').then(function (res) {
          if(res.data.success) {
            this.tableData = res.data.result
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //添加异常原因接口
      initAddAbnormalReason: function () {
        let data = {
          abnormalReason: this.abnormalReason
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/addAbnormalReason',data).then(function (res) {
          if(res.data.success) {
            this.addDiffVisible = false;
            this.initMessage()
          }else if(res.data.code == 10000011){
            this.isMaxShow = true
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //删除接口
      initDelete: function (row) {
        let data = {
          reasionId: row.reasionId
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/deleteAbnormalReason',data).then(function (res) {
          if(res.data.success) {
            this.$alert('确认要删除此异常原因！', '提示', {
              confirmButtonText: '确定',
              center: true,
              callback: action => {
                this.initMessage()
              }
            });
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //修改接口
      initEdit: function () {
        let data = {
          reasionId: this.reasionId,
          abnormalReason: this.editAbnormalReason
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/updateAbnormalReason',data).then(function (res) {
          if(res.data.success) {
            this.editDiffVisible = false;
            this.initMessage()
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //添加异常原因
      addDiffReason: function () {
        this.addDiffVisible = true;
      },

      //添加异常原因确定
      addDiffSureClick: function () {
        if(this.abnormalReason == '') {
          this.isdiffShow = true
        }else {
          this.initAddAbnormalReason();
        }
      },

      //点击删除
      handleDelClick: function (row) {
        this.initDelete(row)
      },

      //点击修改
      handleEditClick: function (row) {
        this.editAbnormalReason = row.abnormalReason;
        this.reasionId = row.reasionId;
        this.editDiffVisible = true;
      },

      //修改异常原因
      editDiffSureClick: function () {
        this.initEdit()
      },

      //查看日志
      publicLogBtn: function () {
        this.pulicLogVisible = true;
        this.paramObj.moduleId= 46;//单据类型
        this.paramObj.billCode='';//操作项id
        this.paramObj.typeId='';//操作类型
      },

      //关闭日志弹窗
      changDialogShow(){
        this.pulicLogVisible=false;
      },

    },
  }
</script>
