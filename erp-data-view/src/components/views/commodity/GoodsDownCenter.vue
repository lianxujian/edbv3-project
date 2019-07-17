<!--任务中心 佩玖-->
<template>
  <div id="goodsDownCenter">
    <div id="searchBox">
      <div class="leftBox2">
        <el-row>
          <el-col :span="12">
            <div class="grid-content">
              <label>起止时间：</label>
              <el-date-picker
                style="width: 30%!important"
                @change="methodsS"
                type="datetime"
                v-model="startTime"
                :picker-options="pickerOptions1"
                placeholder="选择日期时间">
              </el-date-picker>
              <label>至：</label>
              <el-date-picker
                @change="methodsM"
                style="width: 30%!important"
                type="datetime"
                v-model="endTime"
                :picker-options="pickerOptions2"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content">
              <label>任务状态：</label>
              <el-select clearable placeholder="请选择" v-model="status">
                <el-option key="0" label="全部" value=""></el-option>
                <el-option key="1" label="等待执行" value="1"></el-option>
                <el-option key="2" label="执行中" value="2"></el-option>
                <el-option key="3" label="已结束" value="3"></el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>店铺：</label>
              <select id="example-post" name="multiselect[]" multiple="multiple">
                <option  v-for="item in optionsShop" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>


        </el-row>
        <div class="rightBox2">

          <el-button size="mini" type="primary" @click="queryBtn">查 询</el-button>
          <el-button size="mini" type="deafult" @click="RestBtn()">重 置</el-button>
        </div>
      </div>

    </div>
    <div>
      <el-table
        :data="dataDownList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="taskNo"
          label="任务编号">
        </el-table-column>
        <el-table-column
          prop=" taskStatus"
          label="任务状态">
        </el-table-column>
        <el-table-column
          prop="ecName"
          label="平台">
        </el-table-column>
        <el-table-column
          prop="storeName"
          label="店铺">
        </el-table-column>
        <el-table-column
          prop=" goodIds"
          label="商品">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="任务提交时间">
        </el-table-column>

      </el-table>
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[15,30,50,100,200]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalDatas">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {turnTimestamp,turnTimestamp4} from '@/assets/js/validate.js';
  export default {
    data() {
      return {
        pickerOptions2:{  //时间选择区间
          disabledDate(time){
            let curDate = (new Date()).getTime();
            let three = 90 * 24 * 3600 * 1000;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          },
        },
        pickerOptions1: {  //时间选择区间
          disabledDate(time) {
            let curDate = (new Date()).getTime();
            let three = 90 * 24 * 3600 * 1000;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
        dataDownList: [], // 数据列表
        optionsShop: [],//店铺下拉
        currentPage: 1, //当前页
        pageSize:15, //当前页条数
        startTime: '', //开始时间
        endTime: '', //结束时间
        status: "", //任务状态
        version:'1.0.0',
        totalDatas: 0 //总条数

      }
    },
    mounted() {   //数据挂载
      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      this.initList(); //店铺多选
      this.goodsDownList(); //表格数据列表

    },
    methods: {
      // 起始时间
      methodsS() {
        if(this.endTime){
          if(this.startTime > this.endTime){
            this.endTime = '';
          }else{

          }
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
      },
      // 中国标准时间转换为时间戳
      dateToMs (date) {
        let result = new Date(date).getTime();
        return result;
      },
      //表格数据列表
      goodsDownList() {
        if(this.startTime == ''){

        }else{
          this.startTime = this.dateToMs(this.startTime);
        }
        if(this.endTime == ''){

        }else{
          this.endTime = this.dateToMs(this.endTime);
        }

        let data = {
          page:this.currentPage,
          size:this.pageSize,
          startTime: this.startTime,
          endTime: this.endTime,
          status: this.status,
          storeId: $('#example-post').val().toString(),
        }
        if(data.startTime==0){
          data.startTime='';
        }
        if(data.endTime==0){
          data.endTime='';
        }
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsService/' + this.version +'/queryTask', data).then(response => {
          if (response.data.success) {
            response.data.result.rows.forEach((item)=>{
              item.createTime = item.createTime ? turnTimestamp(item.createTime) : '';

            })
            this.dataDownList = response.data.result.rows;
            this.totalDatas = response.data.result.total;
          } else {
            self.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //多选店铺下拉
      initList: function () {
        this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/listOauth').then(function (res) {
          this.optionsChoseShop = [{value: '',label: '全部'}];
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
          }
        }.bind(this))
      },
//      搜索
      queryBtn() {
        let self = this;
        if (this.startTime > this.endTime) {
          self.$message({
            message: "开始日期不能大于结束日期",
            type: 'warning'
          });
        } else {
          this.page = 1;
          this.goodsDownList()
        }

      },
//      重置
      RestBtn() {
        this.startTime = '';
        this.endTime = '';
        this.status=""
        //店铺
        let arr = [];
        this.optionsShop.forEach(item => {
          arr.push(item.value)
        });
        $('#example-post').multiselect('select',arr);

      },

       //分页
      handleSizeChange(val) {
        this.currentPage = val
        this.goodsDownList()

      },

      handleCurrentChange(val) {
        this.pageSize = val
        this.goodsDownList()

      },
//      开始时间
      handlStartTime() {
        this.startTime = this.startTime.getTime();
        console.log(this.startTime)
      },
//      结束时间
      handlEndTime() {
        this.endTime = this.endTime.getTime();
        console.log(this.endTime)
      },
      handlState() {
        this.page = 1;
        this.goodsDownList()
      }


    }
  }


</script>

<style scoped>

</style>
