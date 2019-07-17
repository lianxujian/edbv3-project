<!--修改出库单 秋香-->
// 组件b
<template>
  <!--表格-->
  <div id="SingleNumber">
    <el-breadcrumb separator=">" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/EnterShelves' }">上架</el-breadcrumb-item>
      <el-breadcrumb-item>上架单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs type="border-card">
      <el-tab-pane label="上架商品">
        <div class="pDown" style="width: 1000px">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="序号" width="45">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="条形码" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品名称" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="批次号" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="源库区" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="源库位" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="库位类型" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="应上数量" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="实上数量" width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="col-nav" style="margin:10px 0;width: 1000px">
          <ul>
            <li @click="addButton()"><span>操作日志</span></li>
          </ul>
        </div>


        <div style="width: 1000px">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="序号" width="45">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="操作类型" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="操作描述" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="操作人" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="操作时间" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="IP" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

          </el-table>

          <div style="margin-top:100px;margin-bottom:20px;text-align: center">
            <router-link :to="{path: '/EnterShelves'}">
              <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;" round @click="">返回</el-button>
            </router-link>
          </div>

        </div>
      </el-tab-pane>

      <el-tab-pane label="上架任务">
        <div class="pDown" style="width: 1000px">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="序号" width="45">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="条形码" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品名称" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="批次号" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="目标库区" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="目标库位" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="库位类型" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="应上数量" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.id }}</p>
              </template>
            </el-table-column>

            <el-table-column label="实上数量" width="140">
              <template slot-scope="scope">
                <el-input v-model="id" id="id" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>

          </el-table>

          <div style="margin-top:100px;margin-bottom:20px;text-align: center">
            <router-link :to="{path: '/EnterShelves'}">
              <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;" round @click="">返回</el-button>
            </router-link>
            <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;" @click="">仅保存</el-button>
            <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;" @click="shelves=true">完成上架</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="shelves"
        width="30%"
        center>
        <div style="width: 100%;margin-top:-10px;text-align: center">
          <i style="font-size: 16px;color: red;" class="el-icon-warning"></i>
          <span style="font-size: 14px;margin-left: 10px">以下目标库位未完成上架，是否重新分配目标库位？</span>
          <div class="" style="margin-top: 20px">
            <el-table :data="tableData" border style="width:100%;">
              <el-table-column label="序号" >
                <template slot-scope="scope" >
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
              <el-table-column label="条形码" >
                <template slot-scope="scope">
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
              <el-table-column label="目标库位" >
                <template slot-scope="scope">
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
              <el-table-column label="应上数量" >
                <template slot-scope="scope">
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
              <el-table-column label="实上数量" >
                <template slot-scope="scope">
                  <p class="cen-g"></p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin-top:20px;margin-bottom:20px;text-align: right">
          <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;" @click="shelves=false">取消</el-button>
          <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;" @click="shelves=true">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<!--<script>
  export default {
    id: '',
    data () {
      return {
        msg: ''
      }
    },
    methods: {
      getParams () {
        // 取到路由带过来的参数
        let routerParams = this.$route.singleNumber.id
        // 将数据放在当前组件的数据内
        this.msg = routerParams
      }
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'SingleNumber'
    }
  }
</script>-->
<script>
  import pagination from '@/components/common/Pagination.vue'
  export default {
    components: {
      pagination
    },
    data() {
      return {
        optionsSuit:[{//仓库下拉
          value: '选项1',
          label: '北京仓'
        }, {
          value: '选项2',
          label: '上海仓'
        }, {
          value: '选项3',
          label: '广州仓'
        }, {
          value: '选项4',
          label: '成都仓'
        }, {
          value: '选项5',
          label: '武汉仓'
        }],
        stock: [],//仓库
        id: '',//条形码
        id:'',//商品名称
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        isenable: [{//状态下拉
          value: '选项1',
          label: '是'
        }, {
          value: '选项2',
          label: '否'
        }],
        isSuit: '',//是否套装
        shelves:false,//完成上架弹窗
      }
    },
    mounted(){
      this.message();//获取表格数据方法

      //初始化每页数量
      if(sessionStorage.getItem("hold_stock_1") != null) {
        this.pageSize = parseInt(sessionStorage.getItem("hold_stock_1"));
      }
    },
    methods:{
      //根据id设置详情路由
      pushRouter:function (row) {
//        console.log(row.id);
        if(event.target.innerHTML != 0) {
          this.$router.push('/preAccount/' + row.id)
        }
      },
      message:function () {
        this.$http.get('../static/stock.json').then(function (res) {
          this.tableData=res.data.rows;
          this.total = res.data.total;
          this.curPage = res.data.page;
//          this.pageSize = res.data.size;
        }.bind(this))
      },
//      以下是分页
      getPageSize: function (val) {

        //存储每页数量
        if(val != undefined) {
          sessionStorage.setItem('hold_stock_1', val);
        }
      },
      getCurPage: function (val) {
        if(val != undefined) {
          this.curPage = val
        }
      },
    }
  }
</script>
<style scoped>
  #SingleNumber{
    padding: 20px;
  }
  .pTop{
    margin-bottom: 20px;
  }
  .el-button {
    display: inline-block;
    line-height: 0
  }
</style>
<style>
  #SingleNumber  .el-table td, .el-table th{
    padding: 0!important;
  }
  #SingleNumber .el-table th>.cell {
    text-align: center;
    padding: 3px 0;
    background-color: #eee;
    height: 29px;
  }
  #SingleNumber .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #eee!important;
  }
  #SingleNumber .pTop .el-input,.pTop .el-input__inner{
    width: 195px!important;
    height: 28px!important;
    line-height: inherit!important;
  }
  #SingleNumber .btnStyle{
    border-radius: 5px !important;
    background-color: rgb(129, 141, 154);
    color: white;
    border: none;
    width: 100px!important;
    height: 30px;
  }

</style>



