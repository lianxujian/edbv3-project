<!--发货流程 秋香-->
<template>
  <div id="Deliver">
    <!-- 表头 -->
    <div class="col" style="margin:10px 0;">
        <ul>
          <li @click=""><span>入库流程设置</span></li>
          <li @click=""><span>出库流程设置</span></li>
          <li @click="" style="  background: #F2F2F2;"><span>订单生产流程设置</span></li>
          <li @click=""><span>平台订单流程设置</span></li>
        </ul>
    </div>
    <div style="width: 500px;height: 200px">
      <div class="onlyOne">
        <p>订单生产流程</p>
      </div>
      <div class="onlyTwo">
        <i class="el-icon-circle-plus" >添加</i>
      </div>
    </div>
<div>
  <!--搜索区-->
  <div id="searchBox" style="margin-top: 10px;">
    <div class="leftBox1">
      <el-row >
        <el-col :span="6" style="margin-left: -300px">
          <div class="grid-content">
            <label for="searchStock">生效仓库：</label>
            <el-select id="searchStock"  filterable placeholder="全部">
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
            <label for="search">波次类型：</label>
            <el-select id="search"  filterable placeholder="全部">
              <el-option
                v-for="item in optionsStock"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <div class="oneSelf">
    <ul>
      <li>分配波次------</li>
      <li>拣货</li>
      <li>验货
        <el-switch
          v-model="value3"
          active-text=""
          inactive-text="">
        </el-switch>
      </li>
      <li>称重
        <el-switch
          v-model="value4"
          active-text=""
          inactive-text="">
        </el-switch>
      </li>
      <li>发货</li>
    </ul>
  </div>
</div>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  export default {
    components: {
      pagination,dataTime
    },
    data() {
      return {
        optionsStock:[//仓库下拉
          {
            value: '选项1',
            label: '北京仓'
          },
          {
            value: '选项2',
            label: '上海仓'
          },
          {
            value: '选项3',
            label: '广州仓'
          },
          {
            value: '选项4',
            label: '成都仓'
          },
          {
            value: '选项5',
            label: '武汉仓'
          }
        ],
        stock: '',//仓库
        optionsStockArea:[//库区下拉
          {
            value: '选项1',
            label: '拣货区'
          },
          {
            value: '选项2',
            label: '存货区'
          },
          {
            value: '选项3',
            label: '销退区'
          },
          {
            value: '选项4',
            label: '质检区'
          },
          {
            value: '选项5',
            label: '其他区'
          }
        ],
        stockArea:'',//库区
        stockSeat:'',//库位
        isSeat: false,//库位判空
        barCode: '',//条形码
        name:'',//商品名称
        total: 0, //总页数
        pageSize: 20, //每页数量
        curPage: 1 ,//当前页数
        centerDialogVisible:false,//上架弹窗
        unassign:false,//取消分配弹窗
        assignNumber:false,//分配快递单号
        multipleSelection:[],
        optionsSuit:[],
        platId:'',
        adjust:'',
        adjustTo:'',
        plat:[],
        print:false,//打印窗口
        items:[
          {
            message:'波次拣货单'
          },{
            message:'发货单'
          },{
            message:'快递单'
          },],
        checked:true,
        checked1:true,
        checked2:true,
        checked3:true,//允许覆盖原始单号
        value3:true,
        value4:true

      }
    },
    mounted(){
      this.message();//获取表格数据方法
      const _this = this;
      $('#stockSeat').blur(function () {//库位判空即时验证
        if(_this.stockSeat == ''){
          _this.isSeat = true;
          $(this).css('border', '1px solid red')

        }else {
          _this.isSeat = false;
          $(this).css('border', '1px solid #dcdfe6')
        }
      });

      //初始化每页数量
      if(sessionStorage.getItem("hold_EnterShelves_1") != null) {
        this.pageSize = parseInt(sessionStorage.getItem("hold_EnterShelves_1"));
      }
    },
    methods: {
      //获取时间time1
      getTime1: function (val) {
        this.time1 = val
      },

      //获取时间time2
      getTime2: function (val) {
        this.time2 = val;
      },

      search: function () {
//        console.log(this.timer1);
        if (this.stockSeat == '') {//库位判空提交验证
          this.isSeat = true;
          $('#stockSeat').css('border', '1px solid red')
        } else {
          this.isSeat = false;
          $('#stockSeat').css('border', '1px solid #dcdfe6')
        }
      },
      message: function () {
        this.$http.get('http://www.edbv3.com/upms-view/dist/static/stock.json').then(function (res) {
          this.tableData = res.data.rows;
          this.total = res.data.total;
          this.curPage = res.data.page;
//          this.pageSize = res.data.size;
//          console.log(this.tableData);
        }.bind(this))
      },
//      以下是分页
      getPageSize: function (val) {

        //存储每页数量
        if (val != undefined) {
          sessionStorage.setItem('hold_snapshot_1', val);
        }
      },
      getCurPage: function (val) {
        if (val != undefined) {
          this.curPage = val
        }
      },
      //取消分配
      Unassign() {
        self.unassign = true;
        //清空界面数据
      },
      //打印
      Print(){
        self.print = true;
      },
      //分配快递单号
      AssignNumber(){
        self.assignNumber=true;
      },
    }

  }
</script>
<style>
  #Deliver  .col {
    border:1px solid #999999;
    background-color: white;
    width: 50%;
    height: 30px;
  }

  #Deliver .col ul li {
    float: left;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }
  #Deliver .col ul li {
    padding: 0 50px;
  }
</style>
<style scoped>
  #Deliver{
    padding: 20px;
  }
  .onlyOne p{
    font-size: 18px;
    margin: 100px 100px;
    background-color: #DFC2E1;
    text-align: center;
    line-height: 50px;
    width: 150px;
    height: 50px;
    float: left;
  }
.el-icon-circle-plus{
  color:white;
}
  .onlyTwo{
    width: 100px;
    height: 30px;
    background-color: #5899F7;
    text-align: center;
    line-height: 30px;
    float: left;
    margin-top: 120px;
  }
  .oneSelf ul li{
    float: left;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    padding: 0 50px;
  }
</style>

