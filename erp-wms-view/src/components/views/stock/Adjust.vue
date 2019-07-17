<!--库存调整 尘音-->
<template>
  <div>
    <!--主页-->
    <div v-show="paramsObj.mainPageShow" id="adjust">
      <!--搜索区-->
      <div id="searchBox">
        <div class="leftBox2">
          <el-row>
            <el-col :span="6">
              <div class="grid-content">

                <el-select style="width: 110px!important;" v-model="select1Type" filterable placeholder="调整单号">
                  <el-option
                    v-for="item in optionsAdjust"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input @keyup.enter.native="search" maxlength="50" style="width: 50%!important;" v-model="select1Value" placeholder=""></el-input>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="grid-content">
                <label for="searchStock">仓库：</label>
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
                <label for="adjustType">调整类型：</label>
                <el-select id="adjustType" v-model="invaType" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsAdjustType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content">
                <label for="adjustState">调整状态：</label>
                <el-select id="adjustState" v-model="invaStatus" filterable placeholder="全部">
                  <el-option
                    v-for="item in optionsAdjustState"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>

            <el-col :span="13">
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
                  style="display: inline-block;width: 58.7%"
                  :timeCom1="startTime"
                  :timeCom2="endTime"
                  @timeVal1="getTime1"
                  @timeVal2="getTime2">
                </dataTime>
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
      <div class="col-nav" style="margin:0 0 10px" v-if="authorityCode.WMS_ADJUST_ADD">
        <ul style="margin-bottom: 0">
          <li @click="addAdjust"><span>添加调整单</span></li>
        </ul>
      </div>
      <!--表格-->
      <div class="pDown">
        <el-table id="tableH" :data="tableData" border :max-height="table_h" style="width: 100%">
          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

          <el-table-column label="调整单号">
            <template slot-scope="scope">
              <p class="cen-g">
                <a @click="invaOrderNo(scope.row)" href="javascript:">{{ scope.row.invaOrderNo }}</a>
              </p>
            </template>
          </el-table-column>

          <el-table-column label="调整类型">
            <template slot-scope="scope">
              <p class="cen-g" v-show="scope.row.invaType == 1001">盘点调整</p>
              <p class="cen-g" v-show="scope.row.invaType == 1002">损溢调整</p>
              <p class="cen-g" v-show="scope.row.invaType == 1003">其他调整</p>
            </template>
          </el-table-column>

          <el-table-column label="调整状态">
            <template slot-scope="scope">
              <p class="cen-g" v-show="scope.row.invaStatus == 1001">待审核</p>
              <p class="cen-g" v-show="scope.row.invaStatus == 1002">已审核</p>
              <p class="cen-g" v-show="scope.row.invaStatus == 1003">审核拒绝</p>
              <p class="cen-g" v-show="scope.row.invaStatus == 1004">已作废</p>
            </template>
          </el-table-column>

          <el-table-column label="来源单号">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.sourceOrderNo }}</p>
            </template>
          </el-table-column>

          <el-table-column label="来源单据类型">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.sourceOrderType }}</p>
            </template>
          </el-table-column>

          <el-table-column label="仓库">
            <template slot-scope="scope">
              {{ scope.row.storageName }}
            </template>
          </el-table-column>

          <el-table-column label="创建人">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.creater }}</p>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="135">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.createTime | normalTime(6) }}</p>
            </template>
          </el-table-column>

          <el-table-column label="审核人">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.auditer }}</p>
            </template>
          </el-table-column>

          <el-table-column label="审核时间" width="135">
            <template slot-scope="scope">
              <p class="cen-g">{{ scope.row.auditTime | normalTime(6) }}</p>
            </template>
          </el-table-column>

          <el-table-column label="审核备注" max-width="200" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.auditRemark }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="177" align="center">
            <template slot-scope="scope">
            <span v-if="scope.row.invaStatus == 1001 || scope.row.invaStatus == 1003">
              <el-button v-if="authorityCode.WMS_ADJUST_EDIT" @click="handleModifyClick(scope.row)" type="text" size="small">修改</el-button>
              <el-button v-if="authorityCode.WMS_ADJUST_EXAMINE" @click="handleExaClick(scope.row)" type="text" size="small">审核</el-button>
              <el-button v-if="authorityCode.WMS_ADJUST_DEL" @click="handleDelClick(scope.row)" ref="del" type="text" size="small" style="color: red">作废</el-button>
            </span>
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
    <!--添加调整单-->
    <addAdjust
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 1"
      :params="paramsObj"
      @changeShow="changeShow">
    </addAdjust>
    <!--查看调整单-->
    <checkAdjust
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 2"
      :params="paramsObj"
      @changeShow="changeShow">
    </checkAdjust>
    <!--修改调整单-->
    <modify
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 3"
      :params="paramsObj"
      @changeShow="changeShow">
    </modify>
    <!--审核调整单-->
    <examine
      v-if="!paramsObj.mainPageShow && paramsObj.childrenShow == 4"
      :params="paramsObj"
      @changeShow="changeShow">
    </examine>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  import addAdjust from '@/components/views/stock/children/AddAdjust.vue'
  import checkAdjust from '@/components/views/stock/children/CheckAdjust.vue'
  import modify from '@/components/views/stock/children/Modify.vue'
  import examine from '@/components/views/stock/children/Examine.vue'

  export default {
    components: {
      pagination,dataTime,addAdjust,checkAdjust,modify,examine
    },
    data() {
      return {
        version:'1.0.0',//接口版本号
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId: '',//仓库

        optionsAdjust:[//调整单号下拉
          {
            value: '1001',
            label: '调整单号'
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
            label: '审核人'
          }
        ],
        select1Type: '1001',//调整单号
        select1Value: '',//调整单号实体

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

        optionsAdjustState: [//调整状态下拉
          {
            value: '',
            label: '全部'
          },
          {
            value: '1001',
            label: '待审核'
          },
          {
            value: '1002',
            label: '已审核'
          },
          {
            value: '1003',
            label: '审核拒绝'
          },
          {
            value: '1004',
            label: '已作废'
          }
        ],
        invaStatus: '',//调整状态

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
        startTime: null,//起始时间
        endTime: null,//结束时间

        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数

        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},//是否拥有输入权限

        paramsObj: {
          mainPageShow: true
        }//子级传参
      }
    },
    mounted(){
      this.initTime();//初始化时间

      this.initStock();//初始化仓库下拉
      this.initMessage();//初始化表格数据

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods:{

      //子级传参通知父级刷新表格数据
      changeShow(val){
        if(val.isRefresh){
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
        this.select1Type = '1001';
        this.invaType = '';
        this.invaStatus = '';
        this.select1Value = '';
        this.storageId = '';
        this.selectTimeType = '1001';
        this.initTime()
      },

      //查询
      search: function () {
        this.initMessage();
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauth').then(function (res) {
          if(res.data.success) {
            let arr = res.data.result;
            arr.forEach(function (val) {
              this.optionsStock.push({value: val.storageId,label: val.storageName})
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
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
          "select1Type": this.select1Type,
          "invaType": this.invaType,
          "invaStatus": this.invaStatus,
          "select1Value": this.select1Value,
          "storageId": this.storageId,
          "selectTimeType": this.selectTimeType,
          "startTime": startTime,
          "endTime": endTime,
          "page": this.curPage,
          "size": this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmStockInvaService/' + this.version + '/query',data).then(function (res) {
          if(res.data.success) {
            this.tableData=res.data.result.rows;
            this.total = res.data.result.total;
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //添加调整单
      addAdjust: function () {
        //this.$router.push('/addAdjust')

        //给子级传参并显示子级
        this.paramsObj = {
          childrenShow: 1,
          mainPageShow: false
        }
      },

      //作废接口
      changCancel:function (row) {

        let data = {
          "invaStatus": row.invaStatus,
          "optType": '1002',
          "stockInvaId":row.stockInvaId
        };

        this._post('com.edb01.erp.wms.service.api.WmStockInvaService/' + this.version + '/alterState',data).then(function (res) {
          if(res.data.success) {
            this.$alert("作废成功", {
              type: 'success',
              center: true,
              confirmButtonText: '知道了'
            });
            this.initMessage();
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //查看调整单号详情
      invaOrderNo: function (row) {

        //this.$router.push('/checkAdjust/' + row.stockInvaId)
        //给子级传参并显示子级
        this.paramsObj = {
          stockInvaId: row.stockInvaId,
          childrenShow: 2,
          mainPageShow: false
        }
      },

      //点击修改
      handleModifyClick: function (row) {

        //this.$router.push('/modify/' + row.stockInvaId)

        //给子级传参并显示子级
        this.paramsObj = {
          stockInvaId: row.stockInvaId,
          childrenShow: 3,
          mainPageShow: false
        }

      },

      //点击审核
      handleExaClick: function (row) {
        if(row.invaStatus == '1001' || row.invaStatus == '1003') {
          //this.$router.push('/examine/' + row.stockInvaId)

          //给子级传参并显示子级
          this.paramsObj = {
            stockInvaId: row.stockInvaId,
            childrenShow: 4,
            mainPageShow: false
          }
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
        console.log(row.invaStatus);
        if(row.invaStatus == '1001' || row.invaStatus == '1003') {
          this.$confirm('确认要作废此调整单吗?','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
          }).then(() => {
            console.log(111,row);
            this.changCancel(row);
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
      }
    }
  }
</script>
<style scope>
  .pDown a{
    color: blue;
    text-decoration: underline;
  }
</style>



