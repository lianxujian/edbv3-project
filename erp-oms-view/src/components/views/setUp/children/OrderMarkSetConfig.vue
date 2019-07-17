<!--订单标记-规则设置-【收货地址/买家/手机号/外部平台单号】配置 方证/樊虎-->
<template>
  <div id="orderMarkSetConfig">
    <!--操作导航栏-->
    <div class="col-nav">
      <ul>
        <li @click="handleAddConfig"><span>{{$t("orderSign.onAdd")}}</span></li>
        <li @click="batchDelete"><span>{{$t("orderSign.onBatchDel")}}</span></li>
        <li @click="handleExportFile"><span>{{$t("orderSign.onExport")}}</span></li>
        <li @click="dialogUploadFile = true"><span>{{$t("orderSign.onBatchImp")}}</span></li>
        <li @click="handleLoadFile"><span>{{$t("orderSign.onLoadTemplate")}}</span></li>
        <li @click="handleClear"><span>{{$t("orderSign.onClear")}}</span></li>
      </ul>

      <el-input style="position:absolute;top:20px;left:600px;width: 400px" placeholder="请输入内容" v-model="listQuery.msg" clearable @keyup.enter.native="getList">
        <!--<template slot="prepend">填写url</template>-->
        <el-button slot="append" @click="getList" icon="el-icon-search" style="width: 28px"></el-button>
      </el-input>
    </div>

    <!--主数据表格区-->
    <div style="margin-top: 20px;">
      <el-table id="tab_config" :data="list" v-loading.body="listLoading" border
                :height="tabHeight" @selection-change="handleSelectionChange"
                style="width: 100%">
        <el-table-column :label="$t('orderSign.index')" type="index" align="center">
        </el-table-column>
        <el-table-column type="selection" align="center">
        </el-table-column>
        <el-table-column :label="this.typeName" header-align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-input v-show="type === '1'" v-model="scope.row.rulesValue" :maxlength="100"></el-input>
              <el-input v-show="type === '2'" v-model="scope.row.rulesValue" :maxlength="50"></el-input>
              <el-input v-show="type === '3'" @keyup.native="scope.row.rulesValue = scope.row.rulesValue.replace(/[^\d]/g,'')" type='text' v-model="scope.row.rulesValue" :maxlength="50"></el-input>
              <el-input v-show="type === '4'" v-model="scope.row.rulesValue" :maxlength="50"></el-input>
            </template>
            <template v-else>
              <span v-show="type === '1'">{{ scope.row.rulesValue }}</span>
              <span v-show="type === '2'">{{ scope.row.rulesValue }}</span>
              <span v-show="type === '3'">{{ scope.row.rulesValue }}</span>
              <span v-show="type === '4'">{{ scope.row.rulesValue }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderSign.operation')" align="center" width=200>
          <template slot-scope="scope">
            <template v-if="scope.row.edit">
              <el-button @click="confirmEdit(scope.row)" type="text" >
                {{$t("orderSign.onSave")}}
              </el-button>
              <el-button @click='cancelEdit(scope.row)' type="text">
                {{$t("orderSign.onCancel")}}
              </el-button>
            </template>
            <template v-else>
              <el-button @click='channelEdit(scope.row)' type="text">
                {{$t("orderSign.onModify")}}
              </el-button>
              <el-button @click='deleteRow(scope.row)' type="text" style="color: red;">
                {{$t("orderSign.onDelete")}}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--批量导入操作弹框-->
    <!--文件上传-->
    <el-dialog v-dialogDrag
      title=""
      :close-on-click-modal="false"
      :visible.sync="dialogUploadFile"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      width="800px"
      :before-close="handleClose"
      center>
      <div>
        <el-row style="width: 650px">
          <el-col style="width: 400px">
            <div class="filePath">
              <el-input v-model="fileInput" style="width: 190px;background-color: #FFFFFF;margin-right:100px;margin-bottom:20px;" :disabled="true"
                        placeholder="文件路径"></el-input>
              <el-button style="width:100px!important;" @click="fileUpload">浏览</el-button>
              <input type="file" style="display:none" ref="fileBtn" @change="fileSelect"></input>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 650px">
          <div class="el-upload__tip">请上传.xls/.xlsx文件</div>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmImport">确定导入</el-button>
      </span>
    </el-dialog>

    <!--分页控制区-->
    <div style="height:32px;background:#F1F1F1;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page"
                     :page-sizes="[15,30,50,100,200]" :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"
                     style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { isStrEmpty } from '@/assets/js/validate.js'
  export default {
    name: 'orderMarkSetConfig',
    props: {
      type: String,
      typeName: String,
      tabHeight: Number
    },
    data() {
      return {
        loading:false,
        apiVersion: '1.0.0',
        selId: null,//缓存列表勾选集合
        list: null,//表格data
        total: null,//总页数
        listLoading: false,
        listQuery: {
          signId: '',
          type: '',
          msg: '',
          page: 1,
          size: 15
        },//查询条件
        dialogUploadFile: false,//文件上传弹框
        fileInput: '',//文件上传输入框
        uploadFile: '',//上传文件
        signId:this.$router.history.current.params.signId,//订单标记id
        editing:false,//是否可编辑
      }
    },
    methods: {
      // 初始化、展示查询结果
      initConfig(signId, list) {
        this.signId = signId
        this.list = null
        switch (this.type) {
          case '1':
            this.list = list.rows.map(v => {
              this.$set(v, 'edit', false)
              v.originalValue = v.rulesValue
              return v
            })
            break
          case '2':
            this.list = list.rows.map(v => {
              this.$set(v, 'edit', false)
              v.originalValue = v.rulesValue
              return v
            })
            break
          case '3':
            this.list = list.rows.map(v => {
              this.$set(v, 'edit', false)
              v.originalValue = v.rulesValue
              return v
            })
            break
          case '4':
            this.list = list.rows.map(v => {
              this.$set(v, 'edit', false)
              v.originalValue = v.rulesValue
              return v
            })
            break
        }
        this.total = list.total
        this.listQuery.page = list.page
        this.listQuery.size = list.size
        this.selId = []
      },
      // 分页查询配置列表
      getList() {
        this.listLoading = true
        this.listQuery.signId = this.signId
        this.listQuery.type = this.type
        switch (this.type) {
          case '1': // 收货地址
            //fetchConfigSetting(this.listQuery)
            this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/pageOrderSignCustomerQueryLike',this.listQuery).then(response => {
              if (response.data.success === true) {
                this.initConfig(this.signId, response.data.result.listAddress)
                this.listLoading = false
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            }).catch((error) => {
              this.listLoading = false
            })
            break
          case '2': // 买家Id
            //fetchConfigSetting(this.listQuery)
            this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/pageOrderSignCustomerQueryLike',this.listQuery).then(response => {
              if (response.data.success === true) {
                this.initConfig(this.signId, response.data.result.listBuyId)
                this.listLoading = false
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            }).catch((error) => {
              this.listLoading = false
            })
            break
          case '3': // 手机号
            //fetchConfigSetting(this.listQuery)
            this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/pageOrderSignCustomerQueryLike',this.listQuery).then(response => {
              if (response.data.success === true) {
                this.initConfig(this.signId, response.data.result.listMobile)
                this.listLoading = false
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            }).catch((error) => {
              this.listLoading = false
            })
            break
          case '4': // 外部平台单号
            //fetchConfigSetting(this.listQuery)
            this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/pageOrderSignCustomerQueryLike',this.listQuery).then(response => {
              if (response.data.success === true) {
                this.initConfig(this.signId, response.data.result.listOuterId)
                this.listLoading = false
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            }).catch((error) => {
              this.listLoading = false
            })
            break
        }
      },
      // 操作【添加】行
      handleAddConfig() {
        if(this.editing){
          this.$confirm('请先保存或取消当前编辑方案。', this.$t('orderSign.prompt'), {
            showCancelButton: false,
            center: true
          })
          return false;
        }
        this.list.unshift({
          id: '',
          rulesValue: '',
          edit: true
        })
        this.editing=true;
        // 行数超过页大小时，删除最后一行
        /*if (this.list.length > this.listQuery.size) {
          this.list.splice(this.listQuery.size - 1, 1)
        }*/
      },
      //是否可编辑
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
      // 操作【行保存】
      confirmEdit(row) {
        let rowValue = ''
        // , rulesValue: '', rulesValue: '', rulesValue: '', rulesValue: ''
        const _item = { signId: this.signId, valueType: this.type }
        rowValue = row.rulesValue
        _item.rulesValue = row.rulesValue
        if (rowValue === '') {
          this.$message({
            message: this.typeName + this.$t('orderSign.infoRequired'),
            type: 'warning',
            center: true
          })
          return
        }
        // 调用保存、更新接口
        if (row.customValueId === ''|| row.customValueId == undefined) {
          //createConfigSetting(_item)
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/saveOrderSignCustomerValueInfo',_item).then(response => {
            if (response.data.success === true) {
              row.edit = false
              this.editing=false;
              this.getList()
              row.originalValue = row.rulesValue
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        } else {
          _item.customValueId = row.customValueId
          //updateConfigSetting(_item)
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/updateOrderSignCustomerValue',_item).then(response => {
            if (response.data.success === true) {
              row.edit = false
              this.editing=false;
              row.originalValue = row.rulesValue
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      // 操作【取消行编辑】
      cancelEdit(row) {
        if (row.customValueId === ''|| row.customValueId == undefined) {
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        } else {
          row.rulesValue = row.originalValue
          row.edit = false
        }
        this.editing=false;
      },
      // 操作【行删除】
      deleteRow(row) {
        this.deleteConfig(row.customValueId,1)
      },
      // 操作【批量删除】
      batchDelete() {
        if (this.selId.length === 0) {
          this.$message({
            message: this.$t('orderSign.infoNoSelect'),
            type: 'warning'
          });
          return
        }
        const ids = []
        this.selId.map(v => {
          ids.push(v.customValueId)
        })
        this.deleteConfig(JSON.stringify(ids),2)
      },
      // 删除【收货地址/买家/手机号/外部平台单号】配置
      deleteConfig(ids,isSingle) {
        this.$confirm(this.$t('orderSign.confirmDelete') + this.typeName + this.$t('orderSign.infoContinue'), this.$t('orderSign.prompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          let _item=null,isSingleParam='';
          if(isSingle==1){
            _item = { signId: this.signId, valueType: this.type, customValueId: ids }
            isSingleParam='deleteSingleOrderSignCustomerValue';
          }else{
            _item = { signId: this.signId, valueType: this.type, customValueIdList: ids }
            isSingleParam='deleteBatchOrderSignCustomerValue';
          }
          //deleteConfigSetting(_item)
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/'+isSingleParam,_item).then(response => {
            if (response.data.success === true) {
              // this.list.splice(index, 1)
              // 删除行后刷新数据
              this.getList()
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        })
      },
      // 操作【清空】
      handleClear() {
        this.$confirm(this.$t('orderSign.confirmDelete') + this.typeName + this.$t('orderSign.infoContinue'), this.$t('orderSign.prompt'), {
          // type: 'warning',
          center: true
        }).then(() => {
          const _item = { signId: this.signId, valueType: this.type }
          //ClearConfigSetting(_item)
          this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/emptyOrderSignCustomerValue',_item).then(response => {
            if (response.data.success === true) {
              this.list = []
              this.total = 0
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        })
      },
      // 缓存列表勾选集合
      handleSelectionChange(val) {
        this.selId = val
      },
      //批量导出
      handleExportFile() {
        const _item = { signId: this.signId, valueType: this.type }
        //exportConfigSetting(_item)
        this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/export',_item).then(response => {
          if (response.data.success === true) {
            // 这里返回的是一个Long型数据
            if (!isStrEmpty(response.data.result)) {
              location.href = 'http://'+process.env.FILE_API+'/files-web/download/' + response.data.result.toString()
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      // 下载模板文件
      handleLoadFile() {
        if(this.type==1){
          location.href = `http://${process.env.FILE_API}/files-web/download/7352`
        }else if(this.type==2){
          location.href = `http://${process.env.FILE_API}/files-web/download/7352`
        }else if(this.type==3){
          location.href = `http://${process.env.FILE_API}/files-web/download/7352`
        }else if(this.type==4){
          location.href = `http://${process.env.FILE_API}/files-web/download/7352`
        }
      },
      //弹框关闭
      handleClose(done) {
        this.uploadFile = '';
        this.$refs.fileBtn.value='';
        this.fileInput='';
        this.dialogUploadFile=false;
      },
      //文件上传点击
      fileUpload() {
        this.$refs.fileBtn.click();
      },
      //文件选择函数
      fileSelect(e) {
        //this.uploadFile = "";
        this.fileInput = e.target.files[0].name;
        if (e.target.files[0].name.indexOf(".xls") > 0 || e.target.files[0].name.indexOf(".xlsx") > 0 || e.target.files[0].name.indexOf(".csv") > 0) {
          this.uploadFile = e.target.files[0];
          this.$refs.fileBtn.value='';
        } else {
          this.$message({
            message: '只支持excel文件上传(.xls、.xlsx)',
            type: 'warning'
          });
        }
      },
      // 检查导入文件是否存在
      fileExtension(fileName){
        // xls、. xlsx、CSV
        // console.log(fileName);
        if(fileName.indexOf("xls")>0){
          return true;
        }else if(fileName.indexOf("xlsx")>0){
          return true;
        }
        return false;
      },
      // 文件导入
      confirmImport() {
        var self = this
        if (this.uploadFile && this.fileExtension(this.uploadFile.name)) {
          // 构造提交表单的数据
          let formData = new FormData()
          formData.append('filedata', this.uploadFile)
          this.loading=true;
          this.$axios({
            method: 'post',
            url: `http://${process.env.FILE_API}/files-web/upload`,
            data: formData
          })
            .then((response) => {
              if (!isStrEmpty(response.data.resourcesId)) {
                this.$message({
                  message: '上传成功，后台正在更新中！',
                  type: 'success',
                  center: true
                })
                /*this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/uploadFileService',{
                  signId:self.signId,
                  fileName:response.data.fileName,
                  filePath:response.data.resourceUrl,
                  fileSize:response.data.resourceSize,
                  isCover:true
                }).then((response)=>{
                  if(response.data.success){

                  }else{
                    this.$message({
                      message: response.data.msg,
                      type: 'warning'
                    });
                  }
                })*/
                // 更新数据库
                var importParam={signId:self.signId, fileId: response.data.resourcesId, fileName: self.fileInput};
                //importConfigSetting(importParam)
                this._post('com.edb01.erp.oms.service.api.OrderSignService/' + this.apiVersion + '/batchImport',importParam).then(response =>{
                  this.loading=false;
                  if (response.data.success){
                    // alert(JSON.stringify(response.data.result))
                    if (response.data.result != -1) {
                      location.href = 'http://'+ process.env.FILE_API +'/files-web/download/' + response.data.result.toString()
                    }
                    this.dialogUploadFile=false;
                    // Bug:#845 导入数据后列表数据做刷新操作
                    this.$emit('refresh',this.type)
                  } else {
                    this.$message({
                      message: response.data.msg,
                      type: 'warning'
                    });
                  }
                }).catch(function (error) {
                  self.$message({
                    message: error,
                    type: 'warning',
                    center: true
                  });
                })
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }else {
          this.$message({
            message: "只能上传.xls/.xlsx文件,请检查文件类型",
            type: 'warning',
            center: true
          });
        }
      },

      handleSizeChange(val) {
        this.listQuery.size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }
    }
  }
</script>
