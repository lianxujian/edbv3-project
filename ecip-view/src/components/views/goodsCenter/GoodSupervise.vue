<!--WMS货品管理 尘音-->
<template>
  <div id="goodSupervise">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox2">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>货主：</label>
              <el-select v-model="owner_name" filterable placeholder="全部">
                <el-option
                  v-for="item in optionsOwnerName"
                  :key="item.value"
                  :label="item.owner_name"
                  :value="item.owner_code">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 78px">WMS货品ID：</label>
              <el-input style="width: 60%!important;" @keyup.enter.native="search" maxlength="100" v-model="item_id"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <el-select style="width: 40%!important;" v-model="searchType" filterable placeholder="全部">
                <el-option
                  v-for="item in optionsBarcode"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input @keyup.enter.native="search" style="width: 50%!important;" v-model="searchContent"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>商品类型：</label>
              <el-select v-model="sku_type" filterable>
                <el-option
                  v-for="item in optionsGoodsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content">
              <label>品牌名称：</label>
              <el-select v-model="brand_cn_name" filterable>
                <el-option
                  v-for="item in optionsBrandName"
                  :key="item.value"
                  :label="item.brand_cn_name"
                  :value="item.brand_code">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 78px">分类名称：</label>
              <el-select style="width: 60%!important;" v-model="category_cn_name" filterable>
                <el-option
                  v-for="item in optionsCategory"
                  :key="item.value"
                  :label="item.category_cn_name"
                  :value="item.category_code">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label style="width: 40%">是否组合货品：</label>
              <el-select style="width: 50%!important;" v-model="sku_combine" filterable>
                <el-option
                  v-for="item in optionsIsSuit"
                  :key="item.value"
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
    <!--表格区-->
    <div id="tableBox">
      <el-table id="tableH" :data="tableData" border :height="table_h" style="width: 100%">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="货主名称" width="120">
          <template slot-scope="scope">
            {{ scope.row.owner_name }}
          </template>
        </el-table-column>

        <el-table-column label="WMS货品ID" width="200">
          <template slot-scope="scope">
            {{ scope.row.item_id }}
          </template>
        </el-table-column>

        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.spu_name }}
          </template>
        </el-table-column>

        <el-table-column label="商品编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.spu_code }}
          </template>
        </el-table-column>

        <el-table-column label="条形码" align="center">
          <template slot-scope="scope">
            {{ scope.row.sku_barcode }}
          </template>
        </el-table-column>

        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.brand_cn_name }}
          </template>
        </el-table-column>

        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.category_cn_name }}
          </template>
        </el-table-column>

        <el-table-column label="商品类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.sku_type }}
          </template>
        </el-table-column>

        <el-table-column label="是否组合货品" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sku_combine == 0">否</span>
            <span v-else>是</span>
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
</template>
<script>
  import pagination from '@/components/common/Pagination.vue';//分页组件
  export default {
    components: {
      pagination
    },
    data() {
      return {
        tableData: [],//表格数据
        table_h: 0,
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        optionsOwnerName: [],//货主下拉
        owner_name: 'ALL',//货主
        item_id: '',//WMS货品ID
        optionsBarcode:[
          {value: 'sku_barcode',label: '条形码'},
          {value: 'spu_code',label: '商品编号'},
          {value: 'spu_name',label: '商品名称'}],//查询类型下拉
        searchType: 'sku_barcode',//默认显示条形码
        searchContent: '',//查询内容
        optionsGoodsType: [
          {value: 'ALL',label: '全部'},
          {value: '正品',label: '正品'},
          {value: '赠品',label: '赠品'},
          {value: '包材',label: '包材'},
          {value: '耗材',label: '耗材'}],//商品类型下拉
        sku_type: 'ALL',//商品类型
        optionsBrandName: [],//品牌名称下拉
        brand_cn_name: 'ALL',//品牌名称
        optionsCategory: [],//分类名称下拉
        category_cn_name: 'ALL',//分类名称
        optionsIsSuit: [
          {value: 'ALL',label: '全部'},
          {value: 1,label: '是'},
          {value: 0,label: '否'}],//是否组合货品下拉
        sku_combine: 'ALL',//是否组合货品
      }
    },
    mounted() {

      //初始化数据
      this.initMessage();

      //货主下拉赋值
      this._post('/ecip.goods.center/execute?method=owner.get').then(res => {
        if(res.data.response.code == 0) {
          res.data.response.result.unshift({owner_code: 'ALL',owner_name: '全部'});
          this.optionsOwnerName = res.data.response.result
        }
      });

      //品牌名称下拉赋值
      this._post('/ecip.goods.center/execute?method=brand.get').then(res => {
        if(res.data.response.code == 0) {
          res.data.response.result.list.unshift({brand_code: 'ALL',brand_cn_name: '全部'});
          this.optionsBrandName = res.data.response.result.list
        }
      });

      //分类名称下拉赋值
      this._post('/ecip.goods.center/execute?method=category.get').then(res => {
        if(res.data.response.code == 0) {
          res.data.response.result.unshift({category_code: 'ALL',category_cn_name: '全部'});
          this.optionsCategory = res.data.response.result
        }
      });

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
      });
    },
    methods: {

      //初始化数据
      initMessage: function () {
        let data = {
          owner_name: this.owner_name,
          item_id: this.item_id,
          sku_type: this.sku_type,
          brand_cn_name: this.brand_cn_name,
          category_cn_name: this.category_cn_name,
          sku_combine: this.sku_combine,
          page_num: this.curPage,
          page_size: this.pageSize,
        };
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
        this._post('/ecip.goods.center/execute?method=wmsgoodsmanage.get',data).then((res) => {
          if(res.data.response.code == 0) {
            this.tableData = res.data.response.result.list;
            this.total = res.data.response.result.total_record;
          }else {
            this.$message({
              type: 'warning',
              msg: res.data.response.message
            })
          }
        });
      },

      //查询
      search: function () {
        this.initMessage()
      },

      //重置
      reset: function () {
        this.owner_name = 'ALL';
        this.item_id = '';
        this.searchType = 'sku_barcode';
        this.searchContent = '';
        this.sku_type = 'ALL';
        this.brand_cn_name = 'ALL';
        this.category_cn_name = 'ALL';
        this.sku_combine = 'ALL'
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
    }
  }
</script>
