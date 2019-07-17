<!--发货失败列表 佩玖-->
<template>
  <div id="SendFailure">
    <div id="searchBox">
      <div class="leftBox2"><!--查询区-->

        <el-row>
          <el-col :span="7">
            <div class="grid-content">
              <label for="example-post">店铺：</label>
              <select id="example-post5_1" class="example-post Showey3" name="multiselect[]" multiple="multiple">
                <option v-for="item in shop" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content special" style="white-space: nowrap">
              <el-select style="width:110px!important;margin-left: 30px" v-model="serachType" placeholder="请选择">
                <el-option
                  v-for="item in manageState2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input style="width: 190px!important;" class="special1" @keyup.native.enter="query()"
                        v-model="serachData"></el-input>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <label>发货时间</label>
              <el-date-picker
                style="width: 290px"
                v-model="applyTime5"
                type="datetimerange"
                range-separator="-"
                format="yyyy/MM/dd HH:mm:ss"
                start-placeholder="开始日期"
                :default-time="['00:00:00', '23:59:59']"
                end-placeholder="结束日期">
              </el-date-picker>

            </div>
          </el-col>
        </el-row>


      </div>
      <div class="col-nav" style="margin:10px 0;">
        <ul>
          <li @click="reDispat()"><span>重新发货</span></li>
          <li @click="exportData()"><span>导出</span></li>
        </ul>
      </div>

      <!--按钮-->
      <div class="rightBox2" >
        <el-button type="primary"  @click="query()">查 询</el-button>
        <el-button @click="reset()">重 置</el-button>
      </div>

      <div>
        <el-table
          :data="tableData5"
          @selection-change="changeData"
          border
          ref="itoktab"
          id="fitTable5"
          :height="table_h5"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="序号"
            width="45"
            type="index"
            align="center">
          </el-table-column>

          <el-table-column
            align='center'
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            align="center"
            label="失败原因"
            prop="sendErrorMessage"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="ecName"
            align="center"
            min-width="100"
            label="平台">
          </el-table-column>
          <el-table-column
            prop="storeName"
            align="center"
            label="店铺"
            min-width="100">
          </el-table-column>
          <el-table-column
            align="center"
            label="平台单号"
            min-width="100">
            <template slot-scope="scope">
              <span class="cen-g"  v-if="scope.row.asType == 4 || scope.row.asType == 3">-</span>
              <span class="cen-g" v-else>{{scope.row.resourceOrderId}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderId"
            align="center"
            label="订单号"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="expressName"
            align="center"
            label="快递公司"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="expressNo"
            align="center"
            label="快递单号"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="nick"
            align="center"
            label="买家ID"
            min-width="100">
          </el-table-column>
          <el-table-column
            align="center"
            label="发货时间"
            min-width="100">
            <template slot-scope="scope">
              <span class="cen-g">{{ scope.row.createTime | normalTime(6)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="col-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="curPage5"
            :page-sizes="[15, 30, 50, 100, 200]"
            :page-size="pageSize5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum5">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        version: '1.0.0',
        area1: {
          storeId:'', //店铺
          startTime:'',//开始时间
          resourceOrderId:'',//平台单号
          orderId:'', //订单号
          expressNo:'', //快递号
          nick:'', //客户
          endTime:'',//结束时间
          page: 1,   //当前页
          Size: 15 //当夜页条数

        },
        serachType:'resourceOrderId',//查询类型
        serachData:'',//查询输入数据
        table_h5:0,//高度
        totalNum5: 0, //总条数
        tableData5: [], //主数据
        manageState2: [ // 处理状态
          {value:'resourceOrderId', label: '平台单号'},
          {value: 'orderId', label: '订单号'},
          {value: 'expressNo', label: '快递单号'},
          {value: 'nick', label: '买家昵称'},
        ],
        applyTime5: [],  //时间
        shop: [], // 店铺
        pageSize5: 15, //当夜页条数
        curPage5: 1, //当前页
        multipleOrid:[]  //重新发货集合

      }
    },



    methods: {

      //查询
      query() {
        this.initMessages5();

      },

      //重置
      reset() {
        this.serachType = 'resourceOrderId';
        this.serachData = '';
        $('#example-post5_1').multiselect('dataprovider', this.shop); //店铺
        this.nowTime()


      },

      //初始化数据
      initMessages5() {
        if (this.applyTime5 != null) {
          this.area1.startTime = this.applyTime5[0].getTime();
          this.area1.endTime = this.applyTime5[1].getTime();
        } else {
          this.area1.startTime =''
          this.area1.endTime = ''
        }
        this.area1.storeId = $('#example-post5_1').val().toString();
        if(this.serachType=='resourceOrderId'){
          this.area1.resourceOrderId=this.serachData;
          this.area1.nick='';
          this.area1.orderId='';
          this.area1.expressNo='';
        }else if(this.serachType=='orderId'){
          this.area1.orderId=this.serachData
          this.area1.resourceOrderId='';
          this.area1.expressNo='';
          this.area1.nick='';
        }else if(this.serachType=='expressNo'){
          this.area1.expressNo=this.serachData
          this.area1.orderId='';
          this.area1.resourceOrderId='';
          this.area1.nick='';

        }else if(this.serachType=='nick'){
          this.area1.nick=this.serachData
          this.area1.expressNo='';
          this.area1.orderId='';
          this.area1.resourceOrderId='';
        }
        this._post('com.edb01.erp.wms.service.api.WmSendErrorService/' + this.version + '/query', this.area1)
          .then(res => {
            if (res.data.success) {

              this.tableData5= res.data.result.rows;
              this.totalNum5 = res.data.result.total;

            }
          })


      },

      //导出
      exportData() {

        if (this.applyTime5 != null) {
          this.area1.startTime = this.applyTime5[0].getTime();
          this.area1.endTime = this.applyTime5[1].getTime();
        } else {
          this.area1.startTime =''
          this.area1.endTime = ''
        }
        this.area1.storeId = $('#example-post5_1').val().toString();
        if(this.serachType=='resourceOrderId'){
          this.area1.resourceOrderId=this.serachData;
          this.area1.nick='';
          this.area1.orderId='';
          this.area1.expressNo='';
        }else if(this.serachType=='orderId'){
          this.area1.orderId=this.serachData
          this.area1.resourceOrderId='';
          this.area1.expressNo='';
          this.area1.nick='';
        }else if(this.serachType=='expressNo'){
          this.area1.expressNo=this.serachData
          this.area1.orderId='';
          this.area1.resourceOrderId='';
          this.area1.nick='';

        }else if(this.serachType=='nick'){
          this.area1.nick=this.serachData
          this.area1.expressNo='';
          this.area1.orderId='';
          this.area1.resourceOrderId='';
        }
        this._post('com.edb01.erp.wms.service.api.WmSendErrorService/' + this.version + '/export', this.area1).then((res) => {
          if (res.data.success) {
            location.href = 'http://file.edbv3.com/files-web/download/' + res.data.result
          } else {
            this.$message({
              message: res.data.msg,// 如果code为其他，弹出错误码
              type: 'warning'
            })
          }
        });


      },

      //重新发货
      reDispat(){
        if(this.multipleOrid.length==0){
          this.$message({
            message: '请选择操作订单',
            type: 'warning'
          })
          return false
        }
        let orid=''
        this.multipleOrid.forEach(item=>{
          orid+=item.orderId+','
        })
        let data={
          orderId:orid.slice(0,-1)
        }
        this._post('com.edb01.erp.wms.service.api.WmSendErrorService/' + this.version + '/sendAgain',data).then((res) => {
          if (res.data.success) {
            if(res.data.result){
              this.$message({
                message:'重新发货成功',
                type: 'success'
              })
              this. initMessages5()
            }else {
              this.$message({
                message:res.data.msg,
                type: 'warning'
              })

            }

          }
        });

      },

       //勾选重新发货
      changeData(val){
        this.multipleOrid=val;
      },

     //当前页多少
      handleSizeChange(val) {
        this.pageSize5 = val
        this.area1.Size = val;
        this.initMessages5();


      },

      // 跳到第几页
      handleCurrentChange(val) {
        this.area1.page = val;
        this.curPage5 = val;
        this.initMessages5()


      },

    //默认近7天
      nowTime() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth(); // 月
        let strDate = date.getDate(); // 日
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);
        const start = new Date(year, month, strDate-7, 0, 0);
        this.applyTime5 = [start, end];


      },

    },

    mounted() {
      this.nowTime();
      this.$nextTick(() => {
        this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 70;

      });
      window.onresize = () => {
        this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 80;
      };

      $('.example-post').multiselect({ // 商品分类多选的样式
        onInitialized: function (select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor: 'hsla(220,4%,58%,.3)'
          });
        },
      });
      //店铺多选
      this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/listOauth')
        .then(res => {
          if (res.data.success == true) {
            this.shop = res.data.result;
            var value = [];
            for (var item of this.shop) {
              item.value = item.storeId;
              item.label = item.storeName;
              value.push(item.storeId)
            }
            //console.log(self.plat);
            $('.Showey3').multiselect('dataprovider', this.shop);
            $('.Showey3').multiselect('select', value);

          }
        });
      this.initMessages5() //主数据
//
    },


  }
</script>
<style scoped>

</style>
<style>
  #SendFailure .btn-group > .btn:first-child {
    width: 200px;
    height: 28px;
    text-align: left;
    line-height: 15px;
    border: 1px solid #d8dce5;
  }
  #SendFailure .input-box .el-input__inner{
    padding: 0 5px!important;
    font-size: 12px!important;
  }

  @media screen and (max-width: 1550px) {
    #SendFailure .special .special1 .el-input__inner {
      width: 110px !important;

    }
  }


  #SendFailure .el-date-editor .el-range-input, .el-date-editor .el-range-separator {
    font-size: 12px;
  }

  #SendFailure .el-range-editor.el-input__inner {
    padding: 3px 2px;
    padding-left: 0;

  }

</style>
