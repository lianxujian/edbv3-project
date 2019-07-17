<!--套装查询 秋香-->
<template>
  <div id="suitSku">
    <div id="searchBox">
      <div class="leftBox2">
        <el-row >
            <el-col :span="5">
              <div class="grid-content" >
                <label  >品牌：</label>
                <el-select  v-model="brand_cn_name"  filterable placeholder="全部" >
                  <el-option
                    v-for="item in optionsBrandName"
                    :key="item.brand_code"
                    :label="item.brand_cn_name"
                    :value="item.brand_code">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content" >
                <label >分类：</label>
                <el-select  v-model="category_cn_name" filterable placeholder="全部" >
                  <el-option
                    v-for="item in optionsCategory"
                    :key="item.category_code"
                    :label="item.category_cn_name"
                    :value="item.category_code">
                  </el-option>
                </el-select>
              </div>
            </el-col>
              <el-col :span="5">
                <div class="grid-content" >
                  <el-select style="width: 33%!important;" v-model="searchType"  filterable placeholder="">
                    <el-option
                      v-for="item in optionsBarcode"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input @keyup.enter.native="initMessage" style="width: 50%!important;" v-model="searchContent"></el-input>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content" >
                  <label style="width: 33%!important;" >商品类型：</label>
                  <el-select id="searchStock" v-model="sku_type" filterable placeholder="全部" >
                    <el-option
                      v-for="item in optionsGoodsType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
          <el-col :span="4">
            <div class="grid-content"  style="margin-left: 25%!important;margin-top: 5px"  >
              <el-checkbox     v-model="status">显示停用商品</el-checkbox>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox2">
        <el-button @click="initMessage()" size="mini" type="primary" >查 询</el-button>
        <el-button @click="reset()" size="mini" type="default">重 置</el-button>
      </div>
    </div>

    <!-- 表头 -->
    <div class="col-nav">
      <ul>
        <li @click=""  ><span> 导出</span></li>
      </ul>
    </div>

    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData"
                tooltip-effect="dark"
                id="tableH"
                border :height="table_h"
                @selection-change="handleSelectionChange"
                :default-sort = "{prop: 'orderTime', order: 'descending'}"
                border style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          align='center'
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="商品编号"
          prop="spu_code">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="条形码"
          prop="sku_barcode">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="商品名称"
          prop="spu_name">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="品牌名称"
          prop="brand_cn_name">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="分类名称"
          prop="category_cn_name">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="商品类型"
          prop="sku_type">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="销售价"
          prop="retail_price">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="图片"
          prop="">
        </el-table-column>

        <el-table-column
          label="创建时间"
          width="100"
          prop="created"
          :show-overflow-tooltip="true">
        </el-table-column>

        <el-table-column
          label="更新时间"
          width="100"
          prop="modified"
          :show-overflow-tooltip="true">
        </el-table-column>

        <el-table-column label="启用状态">
          <template slot-scope="scope">
            <p class="cen-g" v-if="scope.row.status==1">启用</p>
            <p class="cen-g" v-if="scope.row.status==0">停用</p>
          </template>
        </el-table-column>

        <el-table-column
          label="商品介绍"
          width="100"
          prop="spu_desc"
          :show-overflow-tooltip="true">
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
  </div>
</template>

<script>
  import pagination from '@/components/common/Pagination.vue';//分页组件
  export default {
    name:'suitSku',
    components: {
      pagination
    },
    data() {
      return {
        input: '',
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        optionsBrandName: [],//品牌名称下拉
        brand_cn_name: 'ALL',//品牌名称
        optionsCategory: [],//分类名称下拉
        category_cn_name: 'ALL',//分类名称
        optionsGoodsType: [
          {value: 'ALL',label: '全部'},
          {value: '正品',label: '正品'},
          {value: '赠品',label: '赠品'},
          {value: '包材',label: '包材'},
          {value: '耗材',label: '耗材'}],//商品类型下拉
        sku_type: 'ALL',//商品类型
        optionsBarcode:[
          {value: 'sku_barcode',label: '条形码'},
          {value: 'spu_code',label: '商品编号'},
          {value: 'spu_name',label: '商品名称'}],//查询类型下拉
        searchType: 'sku_barcode',//默认显示条形码
        searchContent: '',//查询内容
        status:false,//是否停用
      }
    },
    methods:{
      initMessage(){
        let data = {
          method:'goodssku.get',
          spu_combine:1,
          sku_type: this.sku_type,
          brand_cn_name: this.brand_cn_name,
          category_cn_name: this.category_cn_name,
          page_num: this.curPage,
          page_size: this.pageSize,
          status:this.status,
        }
        switch (this.searchType) {
          case 'sku_barcode':
            data.sku_barcode =  this.searchContent;
            break;
          case 'spu_code':
            data.spu_code = this.searchContent;
            break;
          case 'spu_name':
            data.spu_name = this.searchContent;
            break;
        }

        this._post('/ecip.goods.center/execute', data).then(function (res) {
          if(res.data.response.code == 0) {
            this.tableData = res.data.response.result.list;
            this.total = res.data.response.result.total_record;
          }else {
            this.$message({
              type: 'warning',
              msg: res.data.response.message
            })
          }
          /*  this.total1 = res.data.result.total;
            this.tableDataShop=res.data.result;
            //获取图片
            let arr=[]
            this.tableDataShop.forEach((item, i) => {
              if (item.goodsImageBean && item.goodsImageBean.imageUrl) {
                item.imageUrl = item.goodsImageBean.imageUrl;
              }
              if(this.addShopVal){
                this.addShopVal.forEach(val => {
                  if(item.barCode == val.barCode){
                    arr.push(i)
                  }
                })
              }
            })
            this.$nextTick(()=>{
              arr.forEach((j)=>{
                this.$refs.table.toggleRowSelection(this.tableDataShop[j],true);
              })
            });
*/
        }.bind(this));

      },

      //品牌
      brandOne(){
        let data = {
          method:'brand.get',
        }
        this._post('/ecip.goods.center/execute', data).then(function (res) {
          if(res.data.response.code == 0) {
            res.data.response.result.list.unshift({brand_code: 'ALL',brand_cn_name: '全部'});
            this.optionsBrandName = res.data.response.result.list
          }
        }.bind(this));

      },

      //分类
      classifyOne(){
        let data = {
          method:'category.get',
        }
        this._post('/ecip.goods.center/execute', data).then(function (res) {
          if(res.data.response.code == 0) {
            res.data.response.result.unshift({category_code: 'ALL',category_cn_name: '全部'});
            this.optionsCategory = res.data.response.result
          }
        }.bind(this));

      },

      //编辑
      query(){

      },

      //重置
      reset: function () {
        this.searchType = 'sku_barcode';
        this.searchContent = '';
        this.sku_type = 'ALL';
        this.brand_cn_name = 'ALL';
        this.category_cn_name = 'ALL';
      },

      handleSelectionChange(){

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
          this.initMessage();
        }
      },
    },
    mounted() {
      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
      });
      this.initMessage();
      this.brandOne();
      this.classifyOne();
    },
    create(){

    }
  }
</script>

<style>

</style>
