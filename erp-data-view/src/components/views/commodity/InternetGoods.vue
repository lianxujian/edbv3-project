<!--网店商品 尘音-->
<template>
  <div>
    <!--主页-->
    <div v-show="paramsObj.mainPageShow" id="internetGoods">
      <!--搜索区-->
      <div id="searchBox">
        <div class="leftBox2">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">
                <label for="example-post">店铺：</label>
                <select id="example-post" name="multiselect[]" multiple="multiple">
                  <option  v-for="item in optionsShop" :value="item.value">{{item.label}}</option>
                </select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="code">平台商家编码：</label>
                <el-input @keyup.enter.native="search" maxlength="50" id="code" v-model="merchantCode" placeholder="请输入内容"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="internetName">网店品名：</label>
                <el-input @keyup.enter.native="search" maxlength="100" id="internetName" v-model="ecName" placeholder="请输入内容"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="autoStock">自动同步库存：</label>
                <el-select id="autoStock" v-model="autoSynInvFlag" filterable placeholder="全部">
                  <el-option
                    v-for="(item,index) in optionsAutoStock"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="barCode">软件条形码：</label>
                <el-input @keyup.enter.native="search" maxlength="50" id="goodsBarCode" v-model="goodsBarCode" placeholder="请输入内容"></el-input>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="name">软件商品名称：</label>
                <el-input @keyup.enter.native="search" maxlength="100" id="name" v-model="goodsName" placeholder="请输入内容"></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="isPreSale">是否预售：</label>
                <el-select id="isPreSale" v-model="presalesFlag" filterable placeholder="全部">
                  <el-option
                    v-for="(item,index) in optionsIsPreSale"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
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
          <!--下载网店商品-->
          <li v-if="authorityCode.DATA_INTERNETGOODS_DOWNLOAD" @click="downloadGoods"><span>下载网店商品</span></li>
          <el-dialog v-dialogDrag
            title="下载网店商品"
            :visible.sync="downloadDialogVisible"
            width="705px"
            center>

            <div>
              <!--<div class="grid-content">-->
              <!--<label for="selectPlat">选择平台：</label>-->
              <!--<el-select id="selectPlat" v-model="selectPlat" filterable placeholder="全部" style="width: 300px!important;">-->
              <!--<el-option-->
              <!--v-for="(item,index) in optionsSelectPlat"-->
              <!--:key="index"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
              <!--</el-option>-->
              <!--</el-select>-->
              <!--</div>-->
              <div class="grid-content">
                <label for="choseShop">选择店铺：</label>
                <el-select id="choseShop" v-model="choseShopDialog" filterable placeholder="全部" style="width: 300px!important;">
                  <el-option
                    v-for="(item,index) in optionsChoseShop"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="grid-content">
                <label for="goodsState">商品状态：</label>
                <el-select id="goodsState" v-model="goodsState" filterable placeholder="全部" style="width: 300px!important;">
                  <el-option
                    v-for="(item,index) in optionsGoodsState"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="grid-content" v-if="goodsState == '3'">
                <label for="goodsId">商品ID：</label>
                <el-input id="goodsId" v-model="goodsId" placeholder="请输入商品ID，多个用逗号分开，最多10个" style="width: 310px!important;"></el-input>
                <el-button size="mini" type="primary" @click="downloadModel">下载模板</el-button>
                <el-upload
                  style="display: inline-block"
                  :action="imgUpload"
                  :data="upLoadData"
                  :onError="uploadError"
                  :onSuccess="uploadSuccess"
                  :beforeUpload="beforeAvatarUpload"
                  multiple>
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </div>
              <div style="color: #FF943C;text-indent: 2em">注意：当下载商品大于2000条时，下载会生成下载任务，下载进度请到任务中心查看。</div>
            </div>

            <span slot="footer" class="dialog-footer">
            <el-button @click="downloadDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="downloadClick">下 载</el-button>
          </span>
          </el-dialog>
          <!--转为软件商品-->
          <li v-if="authorityCode.DATA_INTERNETGOODS_CHANGE" @click="changeGoods"><span>转为软件商品</span></li>
          <!--同步库存日志-->
          <li v-if="authorityCode.DATA_INTERNETGOODS_LOG" @click="keepLog"><span>同步库存日志</span></li>
        </ul>
      </div>
      <!--下载进度提示-->
      <el-dialog v-dialogDrag
        title="下载"
        :visible.sync="downDialogVisible"
        width="300px"
        center>
        <div v-if="isProgressShow">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="progressNum"></el-progress>
        </div>
        <div v-if="!isProgressShow">
          下载成功<span>{{successNum}}</span>条，失败<span>{{errorNum}}</span>条！
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="downDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="errorClick">导出失败列表</el-button>
      </span>
      </el-dialog>
      <!--表格-->
      <div class="pDown">
        <el-table tooltip-effect="dark" id="tableH" :data="tableData" border :max-height="table_h" style="width: 100%">
          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

          <el-table-column label="提示" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div style="display: inline-block" v-show="scope.row.goodsBarCode == '' || scope.row.goodsBarCode == undefined || scope.row.goodsBarCode == null">
                <i class="el-icon-warning"></i>
                <span>软件内不存在此商品</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.goodsUrl" alt="">
            </template>
          </el-table-column>

          <el-table-column label="店铺">
            <template slot-scope="scope">
              {{ scope.row.storeName }}
            </template>
          </el-table-column>

          <el-table-column label="商家编码" align="center">
            <template slot-scope="scope">
              {{ scope.row.merchantCode }}
            </template>
          </el-table-column>

          <el-table-column label="网店品名" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.ecName }}
            </template>
          </el-table-column>

          <el-table-column label="网店规格" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.goodsSpec }}
            </template>
          </el-table-column>

          <el-table-column label="是否预售" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.presalesFlag == false">否</span>
              <span v-if="scope.row.presalesFlag == true">是</span>
            </template>
          </el-table-column>

          <el-table-column label="商品状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.goodsStatus }}
            </template>
          </el-table-column>

          <el-table-column label="商品ID" align="center">
            <template slot-scope="scope">
              {{ scope.row.itemId }}
            </template>
          </el-table-column>

          <el-table-column label="下载更新时间" align="center" width="132">
            <template slot-scope="scope">
              {{ scope.row.updateTime | normalTime(6) }}
            </template>
          </el-table-column>

          <el-table-column label="同步类型">
            <template slot-scope="scope">
              {{ scope.row.syncTypeName }}
            </template>
          </el-table-column>

          <el-table-column label="同步库存">
            <template slot-scope="scope">
              {{ scope.row.syncCount }}
            </template>
          </el-table-column>

          <el-table-column label="最小下架数">
            <template slot-scope="scope">
              {{ scope.row.minOutStockQty }}
            </template>
          </el-table-column>

          <el-table-column label="自动同步库存" align="center">
            <template slot-scope="scope">
              <el-switch v-if="scope.row.goodsBarCode != undefined && authorityCode.DATA_INTERNETGOODS_STATUS" v-model="scope.row.autoSynInvFlag"></el-switch>
              <el-switch v-else disabled v-model="scope.row.autoSynInvFlag" @click.native="switchChange(scope.row)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="软件条形码" align="center">
            <template slot-scope="scope">
              {{ scope.row.goodsBarCode }}
            </template>
          </el-table-column>

          <el-table-column label="软件商品名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.goodsName }}
            </template>
          </el-table-column>

        </el-table>
        <!--分页-->
        <div class="pagination">
          <pagination
            :totalCom="total"
            :pageSizeCom="pageSize"
            :curPageCom="curPage"
            @pageSizeVal="getPageSize" @curPageVal="getCurPage">
          </pagination>
        </div>
      </div>
    </div>

    <!--转为软件商品-->
    <changeGoods
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 1"
      :params="paramsObj"
      @changeShow="changeShow">
    </changeGoods>

    <!--同步库存日志-->
    <keepLog
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 2"
      :params="paramsObj"
      @changeShow="changeShow">
    </keepLog>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import changeGoods from '@/components/views/commodity/children/ChangeGoods.vue'
  import keepLog from '@/components/views/commodity/children/KeepLog.vue'
  export default {
    components: {
      pagination,changeGoods,keepLog
    },
    data() {
      return {
        imgUpload: `http://${process.env.FILE_API}/files-web/upload`,

        version: '1.0.0',
        optionsShop: [],//店铺下拉
//        storeId: '',//店铺

        merchantCode: '',//平台商家编码

        ecName: '',//网店品名

        optionsAutoStock: [
          {value: '',label: '全部'},
          {value: true,label: '是'},
          {value: false,label: '否'}
        ],//自动同步库存下拉
        autoSynInvFlag: '',//自动同步库存

        goodsBarCode: '',//软件条形码

        goodsName: '',//软件商品名称

        upLoadData: {},//上传文件参数
        resourcesId: '',//上传文件ID
        resourceId: '',//

        optionsIsPreSale: [//是否预售下拉
          {value: '',label: '全部'},
          {value: '1',label: '是'},
          {value: '0',label: '否'}
        ],
        presalesFlag: '',//是否预售

        //下载网店商品
        downloadDialogVisible: false,//下载网店产品弹框显示隐藏
        optionsChoseShop: [{value: '',label: '请选择'}],//店铺下拉
        choseShopDialog: '',//下载网店商品选择店铺
        downDialogVisible: false,//下载进度提示弹框显示隐藏
        progressNum: 0,//下载进度条参数
        isProgressShow: true,//进度条显示隐藏
        successNum: 0,// 下载成功条数
        errorNum: 0,//下载失败条数

        optionsSelectPlat: [{value: '',label: '全部'}],//选择平台下拉
        selectPlat:'',//选择平台

        optionsGoodsState: [//商店状态下拉
          {value: '3',label: '全部'},
          {value: '1',label: '在售中'},
          {value: '2',label: '仓库中'}
        ],
        goodsState: '3',//商店状态

        goodsId: '',//商店ID

        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数

        backId: '',//接口返回id

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限

        paramsObj: {
          mainPageShow: true
        }//子级传参
      }
    },
    mounted() {

      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });

      this.initList();//初始化店铺下拉
      this.initMessage();//初始化表格数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods: {

      //子级传参通知父级刷新表格数据
      changeShow(val){
        if(val.isRefresh){
          this.initMessage();
        }
        this.paramsObj.mainPageShow = true;
      },

      //重置
      reset: function () {

        //店铺
        let arr = [];
        this.optionsShop.forEach(item => {
          arr.push(item.value)
        });
        $('#example-post').multiselect('select',arr);
        console.log(this.optionsShop);

        //其他
        this.merchantCode = '';
        this.ecName = '';
        this.presalesFlag = '';
        this.autoSynInvFlag = '';
        this.goodsBarCode = '';
        this.goodsName = ''
      },

      //查询
      search: function () {
        this.initMessage();
      },

      //初始化表格数据
      initMessage: function () {
        let data = {
          "merchantCode": this.merchantCode,
          "storeId": $('#example-post').val().toString(),
          "ecName": this.ecName,
          "presalesFlag": this.presalesFlag,
          "autoSynInvFlag": this.autoSynInvFlag,
          "goodsBarCode": this.goodsBarCode,
          "goodsName": this.goodsName,
          "page": this.curPage,
          "size": this.pageSize
        };
        console.log(this.pageSize);
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsService/' + this.version + '/query',data).then(function (res) {
          console.log(res.data.result);
          if(res.data.success) {
            this.tableData = res.data.result.rows;
            this.total = res.data.result.total;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //平台接口
      initEcBeanList: function () {
        this._post('com.edb01.erp.mdata.service.api.EcService/' + this.version + '/getEcBeanList').then(function (res) {
          console.log(res.data.result);
          if(res.data.success) {
            let arr = res.data.result;
            arr.forEach(function (val) {
              this.optionsSelectPlat.push({value: val.ecId,label: val.ecName})
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //店铺接口
      initList: function () {
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/listOauth').then(function (res) {
          this.optionsChoseShop = [{value: '',label: '请选择'}];
          this.optionsShop = [];
          if(res.data.success) {
            let arr = res.data.result;
            let value = [];
            arr.forEach(function (val) {
              this.optionsShop.push({value: val.storeId,label: val.storeName});
              this.optionsChoseShop.push({value: val.storeId,label: val.storeName});
              value.push(val.storeId)
            }.bind(this));

            $('#example-post').multiselect('dataprovider', this.optionsShop);
            $('#example-post').multiselect('select',value);
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //下载接口--id
      initPullGoods: function () {
        this.downloadDialogVisible = false;
        this.downDialogVisible = true;
        this.progressNum = 0;
        this.isProgressShow = true;
        let timer = setInterval(() => {
          this.progressNum += 5;
          if(this.progressNum >= 95) {
            clearInterval(timer)
          }
        },1000);
        let goodsId = '';
        if(this.backId) {
          goodsId = this.backId
        }else {
          goodsId = this.goodsId.replace(/，/ig,',')
        }
        let data = {
          ecId: this.selectPlat,
          storeId: this.choseShopDialog,
          goodsId: goodsId
        };
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsService/' + this.version + '/pullDtEcGoods',data).then(function (res) {
          if(res.data.success) {
            console.log(res.data.result);
//            this.downloadDialogVisible = false;
//            this.downDialogVisible = true;
            this.progressNum = 100;
            this.isProgressShow = false;

            if(res.data.result.successNum != undefined) {
              this.successNum = res.data.result.successNum
            }else {
              this.successNum = 0
            }

            if(res.data.result.errorNum != undefined) {
              this.errorNum = res.data.result.errorNum
            }else {
              this.errorNum = 0
            }
            this.resourceId = res.data.result.resourceId;
            this.initMessage()
          }else {
            this.progressNum = 0;
            this.downDialogVisible = false;
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //下载接口--状态
      initByStatus: function () {
        this.downloadDialogVisible = false;
        this.downDialogVisible = true;
        this.progressNum = 0;
        this.isProgressShow = true;
        let timer = setInterval(() => {
          this.progressNum += 5;
          if(this.progressNum >= 95) {
            clearInterval(timer)
          }
        },1000);
        let data = {
          ecId: this.selectPlat,
          storeId: this.choseShopDialog,
          status: this.goodsState
        };
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsService/' + this.version + '/pullDtEcGoodsByStatus',data).then(function (res) {
          if(res.data.success) {
//            this.downloadDialogVisible = false;
//            this.downDialogVisible = true;
            this.progressNum = 100;
            this.isProgressShow = false;
            if(res.data.result.successNum == undefined) {
              this.successNum = 0
            }else {
              this.successNum = res.data.result.successNum
            }
            if(res.data.result.errorNum == undefined) {
              this.errorNum = 0
            }else {
              this.errorNum = res.data.result.errorNum
            }
            this.initMessage()
          }else {
            this.progressNum = 0;
            this.downDialogVisible = false;
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //导出失败列表点击
      errorClick: function () {
        if(this.errorNum != 0) {
          location.href = `http://${process.env.FILE_API}/files-web/download/${this.resourceId}`;
          this.downDialogVisible = false;
        }else {
          this.$message({
            message: '无导出信息！',
            type: 'warning'
          });
        }
      },

      //上传文件ID后台接口
      initFileId: function () {
        let data = {
          resourceId: this.resourcesId
        };
        console.log(data);
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsService/' + this.version + '/parseExcel',data).then(function (res) {
          if(res.data.success) {
            if(res.data.result == '') {
              this.$message({
                message: 'excel为空！',
                type: 'warning'
              });
            }else {
              this.$message({
                message: '上传成功！',
                type: 'success'
              });
              this.backId = res.data.result;
            }
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //启用状态接口
      initSwitchChange: function (row) {
        let data = {
          goodsId: row.goodsId,
          storeId: row.storeId,
          flag: row.autoSynInvFlag
        };
        console.log(888,data);
        this._post('com.edb01.erp.wms.service.api.WmSyncInvStrategyService/' + this.version + '/updateGoodsStrategyConfig',data)
          .then(function (res) {
            if(res.data.success) {
              this.initMessage()
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
              this.initMessage()
            }
          }.bind(this)
        )
      },

      //启用状态
      switchChange: function (row) {
        console.log(777,row);
        this.initSwitchChange(row)
      },

      //下载网店商品
      downloadGoods: function () {
        this.downloadDialogVisible = true;
        this.selectPlat = '';
        this.choseShopDialog = '';
        this.goodsState = '3';
        this.goodsId = '';
        this.progressNum = 0;
        this.initEcBeanList();
        this.initList()
      },

      //下载模板
      downloadModel: function () {
        location.href = `http://${process.env.FILE_API}/files-web/download/9176`
      },

      // 上传成功后的回调
      uploadSuccess (response, file, fileList) {
        this.resourcesId = response.resourcesId;
        this.initFileId()
      },

      // 上传错误
      uploadError (response, file, fileList) {
        console.log('上传失败，请重试！')
      },

      // 上传前文件处理
      beforeAvatarUpload (file) {
        this.upLoadData.filedata = file;
      },

      //下载
      downloadClick: function () {
        if(this.goodsId == ''){
          this.initByStatus()
        }else {
          this.goodsId = this.goodsId.replace(/，/ig,',');
          console.log(this.goodsId.split(',').length);
          if(this.goodsId.split(',').length > 10) {
            this.$alert('商品ID最多允许输入10个！', {
              confirmButtonText: '确定',
              center: true,
            });
          }else {
            this.initPullGoods();
          }
        }
      },

      //转为网店商品
      changeGoods: function () {
//        this.$router.push('/changeGoods')

        //给子级传参并显示子级
        this.paramsObj = {
          childrenShow: 1,
          mainPageShow: false
        }
      },

      //同步库存日志
      keepLog: function () {
//        this.$router.push('/keepLog')

        //给子级传参并显示子级
        this.paramsObj = {
          childrenShow: 2,
          mainPageShow: false
        }
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

      }
    },
  }
</script>
<style scoped>
  #internetGoods .grid-content>label {
    width: 84px;
  }
  @media screen and (max-width:1461px){
    #searchBox .el-col-6{
      width: 30%;
    }
  }
</style>
<style>
  #internetGoods .el-dialog__footer {
    text-align: center!important;
  }
  #internetGoods input[type="file"] {
    display: none!important;
  }
  #internetGoods .el-upload-list{
    display: none!important;
  }
</style>
