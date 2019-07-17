<!--损益单 佩玖-->
<template>
  <div id="cauExceSin">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox2">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label for="example-postd">仓库：</label>
              <select id="example-postd" name="multiselect[]" multiple="multiple" placeholder="请选择仓库">
                <option  v-for="item in optionsStock" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="grid-content">
              <el-select style="width: 110px!important;" v-model="timeType" clearable filterable placeholder="生成时间">
                <el-option key="1" label="生成时间" value="1001"></el-option>
                <el-option key="2" label="审核时间" value="1002"></el-option>
              </el-select>

              <el-date-picker
                style="width: 35%!important"
                @change="methodsS"
                type="datetime"
                v-model="startTime"
                :picker-options="pickerOptions1"
                placeholder="选择日期时间">
              </el-date-picker>
              <i>-</i>
              <el-date-picker
                @change="methodsM"
                style="width: 35%!important"
                type="datetime"
                v-model="endTime"
                :picker-options="pickerOptions2"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content" style="white-space: nowrap" id="Adaption">
              <el-select style="width: 105px!important;" v-model="profitlossSundryType" clearable filterable
                         placeholder="创建人">
                <el-option key="1" label="创建人" value="1001"></el-option>
                <el-option key="2" label="审核人" value="1002"></el-option>
                <el-option key="3" label="损溢单号" value="1003"></el-option>
              </el-select>
              <el-input class="Adaption2"  @keyup.enter.native="search" placeholder="" v-model="select1Value"></el-input>

            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content">
              <label>状态:</label>
              <el-select  v-model="status" clearable filterable placeholder="全部">
                <el-option key="1" label="全部" value=""></el-option>
                <el-option key="2" label="待审核" value="1001"></el-option>
                <el-option key="3" label="已审核" value="1002"></el-option>
                <el-option key="4" label="审核拒绝" value="1003"></el-option>
                <el-option key="5" label="已作废" value="1004"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>

      </div>
      <div class="rightBox2">
        <el-button @click="initMessage()" size="mini" type="primary">查 询</el-button>
        <el-button @click="reset()" size="mini" type="default">重 置</el-button>
      </div>
    </div>
    <!-- 表头 -->
    <div class="col-nav
" style="margin:10px 0;">
      <ul>
        <li @click="CreatCauExceSin" v-if="authorityCode.WMS_CAUEXCESIN_CREATCAUEXCESIN"><span>生成损溢单</span></li>

      </ul>
    </div>

    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData"
                id="tableH"
                border
                style="width: 100%"
                border :max-height="table_h"

      >
        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column label="损溢单号">
          <template slot-scope="scope">
            <el-button v-if="authorityCode.WMS_CAUEXCESIN_HANDLENUMBERS" @click="handlenumbers(scope.row)" type="text" size="small">{{scope.row.profitlossNo}}</el-button>
          </template>
        </el-table-column>

        <el-table-column label="仓库">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.storageName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <p class="cen-g" v-show="scope.row.status=='1001'">待审核</p>
            <p class="cen-g" v-show="scope.row.status=='1002'">已审核</p>
            <p class="cen-g" v-show="scope.row.status=='1003'">审核拒绝</p>
            <p class="cen-g" v-show="scope.row.status=='1004'">已作废</p>
          </template>
        </el-table-column>

        <el-table-column label="创建人">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.creater }}</p>
          </template>
        </el-table-column>

        <el-table-column label="生成时间">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.createTime | normalTime(6)}}</p>
          </template>
        </el-table-column>

        <el-table-column label="审核人">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.auditor }}</p>
          </template>
        </el-table-column>

        <el-table-column label="审核时间">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.auditTime | normalTime(6)}}</p>
          </template>
        </el-table-column>

        <el-table-column label="审核备注" width="200px":show-overflow-tooltip="true" align="left" prop="auditRemark">
        </el-table-column>

        <el-table-column label="单据来源">
          <template slot-scope="scope">
            <p class="cen-g" v-show="scope.row.sourceType=='1001'">调整单</p>
            <p class="cen-g" v-show="scope.row.sourceType=='1002'">第三方盘点</p>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
           <div v-show="scope.row.status==1001||scope.row.status==1003">
             <el-button v-if="authorityCode.WMS_CAUEXCESIN_AUDIT" @click="audit(scope.row)" type="text" size="small">审核</el-button>
             <el-button @click="cancellation(scope.row)" ref="del" type="text" size="small" style="color: red">作废</el-button>
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

    <!--生成损益单弹框-->
    <el-dialog v-dialogDrag
      title="生成损溢单"
      :visible.sync="creatcauExceSindialog"
      :before-close="handleClose"
      width="380px"
      center>
      <div style="text-align: center">


        <label for="example-post">仓库：</label>
        <select id="example-post" name="multiselect[]" multiple="multiple" placeholder="请选择仓库">
          <option  v-for="item in optionsStock" :value="item.value">{{item.label}}</option>
        </select>

      </div>
      <span slot="footer" class="dialog-footer" >
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="isTrue()">确 认</el-button>
        </span>
    </el-dialog>
    <div>

    </div>

  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'

  export default {
    components: {
      pagination, dataTime
    },
    data() {
      return {
        pickerOptions2:{
          disabledDate(time){
            let curDate = (new Date()).getTime();
            let three = 90 * 24 * 3600 * 1000;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          },
        },
        pickerOptions1: {
          disabledDate(time) {
            let curDate = (new Date()).getTime();
            let three = 3600 * 1000 * 24 * 30;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{},
        version: '1.0.0',
        select1Value: '', //给杂项内容赋值
        profitlossSundryType: '1001',//杂项
        timeType: '1001', //时间类型
        status: '', //状态
        selectTimeType: '',//时间类型
        startTime: null,//起始时间
        endTime: null,//结束时间
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        storageId: [],
        inputHeight:'',
        optionsStock: [],//仓库下拉
        optionsStocks: [{lable:'全部',value:'0'}],//仓库下拉
        createTime: '',
        creatcauExceSindialog: false,//生成损益单弹窗
        oldOptions:''

      }
    },
    activated() {
      this.initMessage();//初始化表格数据
    },
    mounted() {
      this.initStock();//初始化仓库下拉
      this.initTime()
      this.initMessage();//初始化表格数据
      $('#example-postd').multiselect({
        onInitialized: function (select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor: 'hsla(220,4%,58%,.3)'
          });
        },
      });

      //表格高度自适应
      this.$nextTick(function () {
        this.inputHeight = document.body.clientWidth;

        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);

      });

      //初始化每页数量
      if (sessionStorage.getItem("hold_cauExceSin_1") != null) {
        this.pageSize = parseInt(sessionStorage.getItem("hold_cauExceSin_1"));
      }
    },
    methods: {
      //初始化时间
      // 起始时间
      methodsS() {
        if(this.endTime){
          if(this.startTime > this.endTime){
            this.endTime = '';
          }else{
            //this.queryData.endTime == ''
          }
        }
      },
      beforeRouteLeave(to,from,next) {
        if (to.name == 'CheckCauExceSin'||to.name == 'AuditCauExceSin') {
          //离开时，将自身缓存下来
          if (!from.meta.keepAlive) {
            from.meta.keepAlive = true;
          }
          next();
        }else {
          from.meta.keepAlive = false;
          to.meta.keepAlive = false;
          this.$destory();
          next();
        }



      },
      // 结束时间
      methodsM() {
        if(this.startTime){
          if(this.startTime > this.endTime){
            this.endTime = '';
          }else{
            //this.queryData.endTime == ''
          }
        }else{

        }
        /* console.log(this.queryData.startTime > this.queryData.endTime);
         console.log(this.queryData.endTime);*/
      },
      // 中国标准时间转换为时间戳
      dateToMs (date) {
        let result = new Date(date).getTime();
        return result;
      },
      //初始化时间
      initTime: function () {
        var nowdate = new Date();
        var y = nowdate.getFullYear();
        var m = nowdate.getMonth() + 1;
        var d = nowdate.getDate();
        var formatnowdate = y + '-' + m + '-' + d + ' 23:59:59';
        nowdate.setMonth(nowdate.getMonth() - 1);
        var y = nowdate.getFullYear();
        var m = nowdate.getMonth() + 1;
        var d = nowdate.getDate();
        var formatwdate = y + '-' + m + '-' + d;
        this.startTime = formatwdate
        this.endTime = formatnowdate
      },
//      selectAll(val) {
//        let allValues = []
//        //保留所有值
//        for (let item of this.optionsStocks) {
//          allValues.push(item.value)
//        }
//
//        // 用来储存上一次的值，可以进行对比
//        const oldVal = this.oldOptions.length === 1 ? [] : this.oldOptions[1]
//
//        // 若是全部选择
//        if (val.includes('0')) this.value5 = allValues
//
//        // 取消全部选中  上次有 当前没有 表示取消全选
//        if (oldVal.includes('0') && !val.includes('0')) this.value5 = []
//
//        // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
//        // 新老数据都有全部选中
//        if (oldVal.includes('0') && val.includes('0')) {
//          const index = val.indexOf('0')
//          val.splice(index, 1) // 排除全选选项
//          this.value5 = val
//        }
//
//        //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
//        if (!oldVal.includes('选项0') && !val.includes('选项0')) {
//          console.log(11)
//          if (val.length === allValues.length - 1) this.value5 = ['选项0'].concat(val)
//        }
//
//        //储存当前最后的结果 作为下次的老数据
//        this.oldOptions[1] = this.value5
//      },

      //重置
      reset() {
          this.status = '',//选择类型
          $('#example-postd').multiselect('dataprovider', this.optionsStock);
          this.initTime()
          this.timeType = '1001',//上架状态
          this.profitlossSundryType = '1001',
          this.select1Value = ''

      },
//      关闭调用清空
      handleClose(){
        this.cancel()
      },
      //取消清空
      cancel(){
        this.creatcauExceSindialog = false
        $('#example-post').multiselect('dataprovider', this.optionsStock);
      },

      //初始化表格数据
      initMessage: function (row) {
        let startTime, endTime;
        if (this.startTime != null) {
          startTime = new Date(this.startTime).getTime()
        } else {
          startTime = ''
        }
        if (this.endTime != null) {
          endTime = new Date(this.endTime).getTime()
        } else {
          endTime = ''
        }
        let data = {
          "profitlossSundryType": this.profitlossSundryType,
          "profitlossSundryContent": this.select1Value,
          "timeType": this.timeType, //时间类型
          "status": this.status, //状态
          "storageIdListStr": $('#example-postd').val().toString(), // 仓库id
          "startTime": startTime,//创建时间开始
          "endTime": endTime,//创建时间结束
          "page": this.curPage,
          "size": this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmStockProfitlossService/'+this.version+'/queryPager', data).then(function (response) {
          this.tableData = response.data.result.rows;
          this.total = response.data.result.total;
        }.bind(this))
      },
      //初始化仓库下拉列表
      initStock: function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/'+this.version+'/listOauth').then(function (res) {
          if (res.data.success) {
            let arr = res.data.result;
            let value = [];
            arr.forEach(function (val) {
              this.optionsStock.push({value: val.storageId, label: val.storageName});
              this.optionsStocks.push({value: val.storageId, label: val.storageName});
              value.push(val.storageId)
            }.bind(this));

            $('#example-post').multiselect('dataprovider', this.optionsStock);
            $('#example-postd').multiselect('dataprovider', this.optionsStock);
            $('#example-post').multiselect('select', value);
            $('#example-postd').multiselect('select', value);
          }

        }.bind(this));
      },
//      审核
      audit(row) {
        this.$router.push({name: 'AuditCauExceSin', params: {objdata: Object.assign({}, row)}})

      },

//      作废
      cancellation(row) {
        let self = this
        if (row.status === 1004) {
          self.$message({
            message: "不能重复操作",
            type: 'warning'
          });
        } else {
          this.$confirm('确定要作废此损溢单吗, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            self._post('com.edb01.erp.wms.service.api.WmStockProfitlossService/'+this.version+'/profitlossOpt', {
              stockProfitlossId: row.stockProfitlossId,
              optType: 1003

            }).then(function (res) {

              if (res.data.success) {
                self.initMessage()
                self.$message({
                  message: "作废成功",
                  type: 'success'
                });

              } else {
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }

            }).catch(function (err) {
              console.log(err)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });

        }

      },
//      审核损益单
      handlenumbers(row) {
        this.$router.push({name: 'CheckCauExceSin', params: {objdata: Object.assign({}, row)}})
      },

      //生成损益单弹框
      CreatCauExceSin() {
        this.creatcauExceSindialog = true;
        this.$nextTick(function () {
          $('#example-post').multiselect({
            onInitialized: function (select, container) {
              //改变滚动条样式
              $("._scroll").yi_scroll({
                barColor: 'hsla(220,4%,58%,.3)'
              });
            },
          });

        })

      },
      //生成损益单提交
      isTrue() {
        let self = this
        if($('#example-post').val()==''){
          self.$message({
            message: '请选择仓库',// 如果code为其他，弹出错误码
            type: 'warning'
          })
        }else {
          self._post('com.edb01.erp.wms.service.api.WmStockProfitlossService/'+this.version+'/insert', {
            storageIdListStr: JSON.stringify( $('#example-post').val()),

          }).then(function (res) {

            if (res.data.code == 0) {
              self.creatcauExceSindialog = false
              self.$message({
                type: 'success',
                message: res.data.msg,
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
      //      以下是分页
      getPageSize: function (val) {
        if (val != undefined) {
          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();

          //存储每页数量
          sessionStorage.setItem('hold_cauExceSin_1', val);
        }
      },
      getCurPage: function (val) {
        if (val != undefined) {
          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
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
    }
  }
</script>
<style>
  #cauExceSin .pTop .col-nav ul li span {

  }

  @media screen and (max-width:1548px){ /*1366-95*/
    #cauExceSin #Adaption .Adaption2 .el-input__inner{
      width:100px!important;
    }
  }
</style>
<style scoped>
  #CauExceSin {
    padding: 20px;
  }

  .pTop {
    margin-bottom: 20px;
  }

  .btnStyle {
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px !important;
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
  /*.Adaption{*/
    /*width:3px!important;*/
  /*}*/


</style>

