<!--转为软件商品 尘音-->
<template>
  <div id="changeGoods">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">网店商品</a></el-breadcrumb-item>
        <el-breadcrumb-item>转为软件商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--主体-->
    <div class="content">
      <div class="pBottom">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="软件中不存在" name="first">
            <!--操作导航-->
            <div class="col-nav" style="margin:0 0 10px">
              <ul style="margin-bottom: 0">
                <!--批量修改-->
                <li @click="batchEditClick"><span>批量修改</span></li>
                <el-dialog v-dialogDrag
                  title="批量修改"
                  :visible.sync="batchDialogVisible"
                  width="20%"
                  center>

                  <div class="contentBox">
                    <div class="grid-content">
                      <label for="selectBrand">品牌：</label>
                      <el-select id="selectBrand" v-model="selectBrand" filterable placeholder="全部">
                        <el-option
                          v-for="(item,index) in optionSelectBrand"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <div class="grid-content">
                      <label for="choseClass">分类：</label>
                      <el-select id="choseClass" v-model="choseClass" filterable placeholder="全部">
                        <el-option
                          v-for="(item,index) in optionsChoseClass"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </div>

                  <span slot="footer" class="dialog-footer">
                    <el-button @click="batchDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="batchClick">确 定</el-button>
                   </span>
                </el-dialog>
                <!--转为软件商品-->
                <li @click="changeGoodesClick"><span>转为软件商品</span></li>
                <el-dialog v-dialogDrag
                  id="dialogBox"
                  title="转为软件商品"
                  :visible.sync="changeDialogVisible"
                  width="1152px"
                  center>

                  <div class="contentBox">
                    <!--提示信息-->
                    <div class="grid-content" style="font-size: 16px">
                      成功转为软件商品 <span>{{successNum}}</span> 条！失败 <span>{{errorNum}}</span> 条！失败原因如下：
                    </div>
                    <!--操作导航-->
                    <div class="col-nav" style="margin:0 0 10px">
                      <ul style="margin-bottom: 0">
                        <!--批量修改-->
                        <li @click="batchEditClick3"><span>批量修改</span></li>
                        <li @click="changeGoodesClick3"><span>转为软件商品</span></li>
                      </ul>
                    </div>
                    <!--表格3-->
                    <div class="grid-content">
                      <!--表格3-->
                      <div class="pDown">
                        <el-table
                          :data="tableData3" max-height="500" border style="width: 100%;"
                          tooltip-effect="dark"
                          @selection-change="handleSelectionChange3">
                          <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

                          <el-table-column
                            type="selection"
                            width="55">
                          </el-table-column>

                          <el-table-column label="图片" align="center">
                            <template slot-scope="scope">
                              <p class="cen-g"><img :src="scope.row.goodsUrl" alt=""></p>
                            </template>
                          </el-table-column>

                          <el-table-column label="店铺" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                              {{ scope.row.storeName }}
                            </template>
                          </el-table-column>

                          <el-table-column label="平台商家编码" align="center">
                            <template slot-scope="scope">
                              <p class="cen-g">{{ scope.row.merchantCode }}</p>
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

                          <!--商品编码-->
                          <el-table-column align="center" min-width="100">
                            <template slot="header" slot-scope="slot">
                              <div>
                                <span>商品编号</span>
                                <i style="font-weight: bold" class="el-icon-edit"></i>
                              </div>
                            </template>
                            <template slot-scope="scope">

                              <div @dblclick="goodsCode(scope.row,scope.$index)">
                                <p class="cen-g" v-if="scope.row.isGoodsCodeShow == false">{{ scope.row.goodsCode }}</p>
                                <el-input @blur="goodsCodeBlur(scope.row,scope.$index,tableData3)" v-if="scope.row.isGoodsCodeShow == true" v-model="scope.row.goodsCode"></el-input>
                              </div>

                            </template>
                          </el-table-column>

                          <!--商品名称-->
                          <el-table-column :show-overflow-tooltip="true" min-width="100">
                            <template slot="header" slot-scope="slot">
                              <div>
                                <span>商品名称</span>
                                <i style="font-weight: bold" class="el-icon-edit"></i>
                              </div>
                            </template>
                            <template slot-scope="scope">

                              <div style="display: inline-block" @dblclick="goodsName(scope.row,scope.$index)">
                                <span v-if="scope.row.isGoodsNameShow == false">{{ scope.row.goodsName }}</span>
                                <el-input @blur="goodsNameBlur(scope.row,scope.$index,tableData3)" v-if="scope.row.isGoodsNameShow == true" v-model="scope.row.goodsName"></el-input>
                              </div>

                             </template>
                          </el-table-column>

                          <!--条形码-->
                          <el-table-column align="center" min-width="100">
                            <template slot="header" slot-scope="slot">
                              <div>
                                <span>条形码</span>
                                <i style="font-weight: bold" class="el-icon-edit"></i>
                              </div>
                            </template>
                            <template slot-scope="scope">

                              <div>
                                <p @dblclick="goodsBarCode(scope.row,scope.$index)" class="cen-g" v-if="scope.row.isGoodsBarCodeShow == false">{{ scope.row.goodsBarCode }}</p>
                                <el-input @blur="goodsBarCodeBlur(scope.row,scope.$index,tableData3)" v-if="scope.row.isGoodsBarCodeShow == true" v-model="scope.row.goodsBarCode"></el-input>
                              </div>

                            </template>
                          </el-table-column>

                          <!--品牌-->
                          <el-table-column align="center">
                            <template slot="header" slot-scope="slot">
                              <div>
                                <span>品牌</span>
                                <i style="font-weight: bold" class="el-icon-edit"></i>
                              </div>
                            </template>
                            <template slot-scope="scope">
                              <el-select v-model="scope.row.brandId" filterable placeholder="全部" @change="brandChange3(scope.row,scope.$index)" @click.native="brandClick">
                                <el-option
                                  v-for="(item,index) in optionSelectBrand"
                                  :key="index"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </template>
                          </el-table-column>

                          <!--分类-->
                          <el-table-column align="center">
                            <template slot="header" slot-scope="slot">
                              <div>
                                <span>分类</span>
                                <i style="font-weight: bold" class="el-icon-edit"></i>
                              </div>
                            </template>
                            <template slot-scope="scope">
                              <el-select v-model="scope.row.catalogId" filterable placeholder="全部" @change="catalogChange3(scope.row,scope.$index)" @click.native="catalogClick">
                                <el-option
                                  v-for="(item,index) in optionsChoseClass"
                                  :key="index"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </template>
                          </el-table-column>

                          <el-table-column label="失败原因">
                            <template slot-scope="scope">
                              <p class="cen-g">{{ scope.row.errorMessage }}</p>
                            </template>
                          </el-table-column>

                        </el-table>
                      </div>
                    </div>
                  </div>

                  <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="changeDialogVisible = false">关 闭</el-button>
                  </span>
                </el-dialog>
              </ul>
            </div>
            <!--表格-->
            <div class="pDown">
              <el-table
                id="tableH" :data="tableData2" border :max-height="table_h" style="width: 100%"
                @selection-change="handleSelectionChange2">
                <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>

                <el-table-column label="图片" align="center">
                  <template slot-scope="scope">
                    <img :src="scope.row.goodsUrl" alt="">
                  </template>
                </el-table-column>

                <el-table-column label="店铺" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    {{ scope.row.storeName }}
                  </template>
                </el-table-column>

                <el-table-column label="平台商家编码" align="center">
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

                <!--商品编码-->
                <el-table-column align="center">
                  <template slot="header" slot-scope="slot">
                    <div>
                      <span>商品编号</span>
                      <i style="font-weight: bold" class="el-icon-edit"></i>
                    </div>
                  </template>
                  <template slot-scope="scope">
                    <div @dblclick="goodsCode2(scope.row,scope.$index)">
                      <span v-if="scope.row.isGoodsCodeShow == false">{{ scope.row.goodsCode }}</span>
                      <el-input @blur="goodsCodeBlur(scope.row,scope.$index,tableData2)" v-if="scope.row.isGoodsCodeShow == true" v-model="scope.row.goodsCode"></el-input>
                    </div>

                  </template>
                </el-table-column>

                <!--<el-table-column label="商品编号" align="center">-->
                  <!--<template slot-scope="scope">-->
                    <!--{{ scope.row.goodsCode }}-->
                  <!--</template>-->
                <!--</el-table-column>-->

                <!--商品名称-->
                <el-table-column :show-overflow-tooltip="true">
                  <template slot="header" slot-scope="slot">
                    <div>
                      <span>商品名称</span>
                      <i style="font-weight: bold" class="el-icon-edit"></i>
                    </div>
                  </template>
                  <template slot-scope="scope">
                    <div style="display: inline-block" @dblclick="goodsName2(scope.row,scope.$index)">
                      <span v-if="scope.row.isGoodsNameShow == false">{{ scope.row.goodsName }}</span>
                      <el-input @blur="goodsNameBlur(scope.row,scope.$index,tableData2)" v-if="scope.row.isGoodsNameShow == true" v-model="scope.row.goodsName"></el-input>
                    </div>

                  </template>
                </el-table-column>

                <!--<el-table-column label="商品名称" :show-overflow-tooltip="true">-->
                  <!--<template slot-scope="scope">-->
                    <!--{{ scope.row.goodsName }}-->
                  <!--</template>-->
                <!--</el-table-column>-->

                <!--条形码-->
                <el-table-column align="center">
                  <template slot="header" slot-scope="slot">
                    <div>
                      <span>条形码</span>
                      <i style="font-weight: bold" class="el-icon-edit"></i>
                    </div>
                  </template>
                  <template slot-scope="scope">
                    <div>
                      <span @dblclick="goodsBarCode2(scope.row,scope.$index)" v-if="scope.row.isGoodsBarCodeShow == false">{{ scope.row.goodsBarCode }}</span>
                      <el-input @blur="goodsBarCodeBlur(scope.row,scope.$index,tableData2)" v-if="scope.row.isGoodsBarCodeShow == true" v-model="scope.row.goodsBarCode"></el-input>
                    </div>

                  </template>
                </el-table-column>

                <!--<el-table-column label="条形码" align="center">-->
                  <!--<template slot-scope="scope">-->
                    <!--{{ scope.row.goodsBarCode }}-->
                  <!--</template>-->
                <!--</el-table-column>-->

                <!--品牌-->
                <el-table-column align="center">
                  <template slot="header" slot-scope="slot">
                    <div>
                      <span>品牌</span>
                      <i style="font-weight: bold" class="el-icon-edit"></i>
                    </div>
                  </template>
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.brandId" filterable placeholder="全部" @change="brandChange(scope.row,scope.$index)" @click.native="brandClick">
                      <el-option
                        v-for="(item,index) in optionSelectBrand"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <!--分类-->
                <el-table-column align="center">
                  <template slot="header" slot-scope="slot">
                    <div>
                      <span>分类</span>
                      <i style="font-weight: bold" class="el-icon-edit"></i>
                    </div>
                  </template>
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.catalogId" filterable placeholder="全部" @change="catalogChange(scope.row,scope.$index)" @click.native="catalogClick">
                      <el-option
                        v-for="(item,index) in optionsChoseClass"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页-->
              <div class="pagination">
                <pagination
                  :totalCom="total2"
                  :pageSizeCom="pageSize2"
                  :curPageCom="curPage2"
                  @pageSizeVal="getPageSize2" @curPageVal="getCurPage2">
                </pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="软件中已存在" name="second">
            <!--操作导航-->
            <div class="col-nav" style="margin:0 0 10px">
              <ul style="margin-bottom: 0">
                <li @click="coverImgClick"><span>覆盖软件图片</span></li>
              </ul>
            </div>
            <!--表格-->
            <div class="pDown">
              <el-table
                id="tableH" :data="tableData1" border :max-height="table_h" style="width: 100%"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange1">
                <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

                <el-table-column
                  type="selection"
                  width="55"
                  center>
                </el-table-column>

                <el-table-column label="图片" align="center">
                  <template slot-scope="scope">
                    <img :src="scope.row.goodsUrl" alt="">
                  </template>
                </el-table-column>

                <el-table-column label="店铺" :show-overflow-tooltip="true">
                  <template slot-scope="scope">
                    {{ scope.row.storeName }}
                  </template>
                </el-table-column>

                <el-table-column label="平台商家编码" align="center">
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

                <el-table-column label="商品编号" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.goodsCode }}
                  </template>
                </el-table-column>

                <el-table-column label="商品名称" :show-overflow-tooltip="true">
                  <template slot-scope="scope" >
                    {{ scope.row.goodsName }}
                  </template>
                </el-table-column>

                <el-table-column label="条形码" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.goodsBarCode }}
                  </template>
                </el-table-column>

                <el-table-column label="品牌" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.brandName }}
                  </template>
                </el-table-column>

                <el-table-column label="分类">
                  <template slot-scope="scope">
                    {{ scope.row.catalogName }}
                  </template>
                </el-table-column>
              </el-table>
              <!--分页-->
              <div class="pagination">
                <pagination
                  :totalCom="total1"
                  :pageSizeCom="pageSize1"
                  :curPageCom="curPage1"
                  @pageSizeVal="getPageSize1" @curPageVal="getCurPage1">
                </pagination>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
    <!--弹框批量修改-->
    <el-dialog v-dialogDrag
      title="批量修改"
      :visible.sync="batchDialogVisible3"
      width="400px"
      center>

      <div class="contentBox">
        <div class="grid-content">
          <label for="selectBrand">品牌：</label>
          <el-select id="selectBrand" v-model="selectBrand3" filterable placeholder="全部">
            <el-option
              v-for="(item,index) in optionSelectBrand"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="grid-content">
          <label for="choseClass">分类：</label>
          <el-select id="choseClass" v-model="choseClass3" filterable placeholder="全部">
            <el-option
              v-for="(item,index) in optionsChoseClass"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="batchClick3">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  export default {
    props: {
      params: Object //接收父级参数
    },
    components:{
      pagination
    },
    data() {
      return {
        version: '1.0.0',//版本号
        activeName: 'first',//tab切换

        multipleSelection1: [],//软件中已存在已选
        multipleSelection2: [],//软件中不存在已选
        multipleSelection3: [],//弹框转为软件商品已选

        batchDialogVisible: false,//批量修改弹框显示隐藏
        batchDialogVisible3: false,//弹框批量修改弹框显示隐藏

        changeDialogVisible: false,//转为软件商品弹框显示隐藏

        optionSelectBrand: [{value: '',label: '全部'}],//品牌下拉
        selectBrand: '',//批量选取品牌
        selectBrand3: '',//弹框批量选取品牌

        optionsChoseClass: [{value: '',label: '全部'}],//分类下拉
        choseClass: '',//批量分类
        choseClass3: '',//弹框批量分类

        successNum: 0,//成功条数
        errorNum: 0,//失败条数

        table_h: 0,//表格高度
        tableData1: [],//软件已存在表格数据
        total1: 0, //总页数
        pageSize1: 15, //每页数量
        curPage1: 1,//当前页数

        tableData2: [],//软件不存在表格数据
        total2: 0, //总页数
        pageSize2: 15, //每页数量
        curPage2: 1,//当前页数

        tableData3: [],//表格数据
      }
    },
    mounted() {

      //初始化软件中不存在
      this.initQueryGoods(2,this.curPage2,this.pageSize2);

      //表格高度自适应
      this.$nextTick(function() {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 85);
        console.log(this.table_h)
      });

    },
    methods: {

      //返回父级
      showParentBlock() {
        this.$emit('changeShow',true)
      },

      //初始化软件中不存在/存在接口
      initQueryGoods: function (queryType,curPage,pageSize) {
        let data = {
          queryType: queryType,
          "page": curPage,
          "size": pageSize
        };
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsService/' + this.version + '/queryGoods',data).then(function (res) {
          if(res.data.success) {
            if(queryType == 2) {
              this.tableData2 = res.data.result.rows;
              this.tableData2.forEach(function (val) {
                val.isGoodsCodeShow = false;
                val.isGoodsNameShow = false;
                val.isGoodsBarCodeShow = false;
                val.brandId = '';
                val.catalogId = ''
              });
              this.total2 = res.data.result.total;

            }else if(queryType == 1) {
              this.tableData1 = res.data.result.rows;
              this.total1 = res.data.result.total;
              console.log(this.tableData1)
            }
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //品牌列表接口
      initBrandList: function () {
        this._post('com.edb01.erp.mdata.service.api.BrandService/' + this.version + '/list').then(function (res) {
          console.log(res);
          if(res.data.success) {
            let arr = res.data.result;
            arr.forEach(function (val) {
              this.optionSelectBrand.push({value: val.brandId,label: val.brandName})
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //分类列表接口
      initatalogList: function () {
        this._post('com.edb01.erp.mdata.service.api.DtCatalogService/' + this.version + '/listTail').then(function (res) {
          console.log(res);
          if(res.data.success) {
            let arr = res.data.result;
            arr.forEach(function (val) {
              this.optionsChoseClass.push({value: val.catalogId,label: val.catalogName})
            }.bind(this));
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //转为软件商品接口
      initInsertGoogs: function (multipleSelection) {
        let data = {
          DtEcGoodsImportBeanJson: JSON.stringify(multipleSelection)
        };
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsService/' + this.version + '/insertGoogsByNotIn',data).then(function (res) {
          console.log(res.data.result);
          if(res.data.result.errorNum == 0) {
            this.changeDialogVisible = false;
            this.$alert("成功转为软件商品" + res.data.result.successNum + '条！失败0条', {
              type: 'success',
              center: true,
              confirmButtonText: '知道了'
            });
            this.initQueryGoods(2,this.curPage2,this.pageSize2);

          }else {
            this.initQueryGoods(2,this.curPage2,this.pageSize2);
            this.successNum = res.data.result.successNum;
            this.errorNum = res.data.result.errorNum;
            this.tableData3 = res.data.result.errorMessageBean;
            this.tableData3.forEach(function (val) {
              val.isGoodsCodeShow = false;
              val.isGoodsNameShow = false;
              val.isGoodsBarCodeShow = false;
//              val.brandId = '';
//              val.catalogId = ''
            });
            this.changeDialogVisible = true
          }
        }.bind(this))
      },

      //覆盖商品图片接口
      initInsertGoods: function () {
        let str = '';
        this.multipleSelection1.forEach(function (val) {
          str += val.ecGoodsId + ','
        });
        str = str.substr(0,str.length - 1);
        let data = {
          goodsId: str
        };
        this._post('com.edb01.erp.mdata.service.api.DtEcGoodsService/' + this.version + '/insertGoogsByIn',data).then(function (res) {
          console.log(res)
//          this.$alert("添加覆盖图片20条", {
//            type: 'success',
//            center: true,
//            confirmButtonText: '知道了'
//          });
          if(res.data.success) {
            this.$message({
              message: '覆盖成功!',
              type: 'success'
            });
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this))
      },

      //表格品牌数据请求
      brandClick: function () {
        if(this.optionSelectBrand.length == 1) {
          this.initBrandList()
        }
      },

      //表格分类数据请求
      catalogClick: function () {
        if(this.optionsChoseClass.length == 1) {
          this.initatalogList()
        }
      },

      //变换品牌数据
      brandChange: function (row,index) {

        let obj = this.tableData2[index];
        obj.brandId = row.brandId;
        this.$set(this.tableData2,index,obj);
      },

      //变换分类数据
      catalogChange: function (row,index) {
        let obj = this.tableData2[index];
        obj.catalogId = row.catalogId;
        this.$set(this.tableData2,index,obj);
      },

      //弹框变换品牌数据
      brandChange3: function (row,index) {

        let obj = this.tableData3[index];
        obj.brandId = row.brandId;
        this.$set(this.tableData3,index,obj);
      },

      //弹框变化分类数据
      catalogChange3: function (row,index) {
        let obj = this.tableData3[index];
        obj.catalogId = row.catalogId;
        this.$set(this.tableData3,index,obj);
      },

      //table3修改商品编码
      goodsCode: function (row,index) {
        let obj = this.tableData3[index];
        obj.isGoodsCodeShow = true;
        this.$set(this.tableData3,index,obj);
      },

      //table2修改商品编码
      goodsCode2: function (row,index) {
        let obj = this.tableData2[index];
        obj.isGoodsCodeShow = true;
        this.$set(this.tableData2,index,obj);
      },

      //不可修改商品编码
      goodsCodeBlur: function (row,index,data) {
        let obj = data[index];
        obj.isGoodsCodeShow = false;
        this.$set(data,index,obj);
      },

      //table3修改商品名称
      goodsName: function (row,index) {
        let obj = this.tableData3[index];
        obj.isGoodsNameShow = true;
        this.$set(this.tableData3,index,obj);
      },

      //table2修改商品名称
      goodsName2: function (row,index) {
        let obj = this.tableData2[index];
        obj.isGoodsNameShow = true;
        this.$set(this.tableData2,index,obj);
      },

      //不可修改商品名称
      goodsNameBlur: function (row,index,data) {
        let obj = data[index];
        obj.isGoodsNameShow = false;
        this.$set(data,index,obj);
      },

      //table3修改条形码
      goodsBarCode: function (row,index) {
        let obj = this.tableData3[index];
        obj.isGoodsBarCodeShow = true;
        this.$set(this.tableData3,index,obj);
      },

      //table2修改条形码
      goodsBarCode2: function (row,index) {
        let obj = this.tableData2[index];
        obj.isGoodsBarCodeShow = true;
        this.$set(this.tableData2,index,obj);
      },

      //不可修改条形码
      goodsBarCodeBlur: function (row,index,data) {
        let obj = data[index];
        obj.isGoodsBarCodeShow = false;
        this.$set(data,index,obj);
      },

      //批量修改
      batchEditClick: function () {

        if(this.multipleSelection2.length != 0) {
          this.batchDialogVisible = true;
          this.selectBrand = '';
          this.choseClass = '';
          this.initBrandList();
          this.initatalogList();
        }else {
          this.$alert('请至少选择一个商品！', {
            confirmButtonText: '确定',
            center: true
          });
        }

      },

      //弹框批量修改
      batchEditClick3: function () {
        if(this.multipleSelection3.length != 0) {
          this.batchDialogVisible3 = true;
          this.selectBrand3 = '';
          this.choseClass3 = '';
          this.initBrandList();
          this.initatalogList();
        }

      },

      //批量修改确认
      batchClick: function () {
        this.tableData2.forEach(function (Data2,index) {

          this.multipleSelection2.forEach(function (tion2) {
            if(Data2.ecGoodsId == tion2.ecGoodsId) {

              let obj = this.tableData2[index];
              obj.brandId = this.selectBrand;
              obj.catalogId = this.choseClass;
              this.$set(this.tableData2,index,obj);

            }
          }.bind(this))
        }.bind(this));
        console.log(this.tableData2);
        this.batchDialogVisible = false
      },

      //弹框批量修改确认
      batchClick3: function () {
        this.tableData3.forEach(function (Data3,index) {

          this.multipleSelection3.forEach(function (tion3) {
            if(Data3.ecGoodsId == tion3.ecGoodsId) {

              let obj = this.tableData3[index];
              obj.brandId = this.selectBrand3;
              obj.catalogId = this.choseClass3;
              this.$set(this.tableData3,index,obj);
            }
          }.bind(this))
        }.bind(this));
        console.log(this.tableData3);
        this.batchDialogVisible3 = false
      },

      //转为软件商品
      changeGoodesClick: function () {
        if(this.multipleSelection2.length != 0) {
          this.initInsertGoogs(this.multipleSelection2);
        }else {
          this.$alert('请至少选择一个商品！', {
            confirmButtonText: '确定',
            center: true
          });
        }

      },

      //弹框转为软件商品
      changeGoodesClick3: function () {
        if(this.multipleSelection3.length != 0) {
          this.initInsertGoogs(this.multipleSelection3);
        }

      },

      //覆盖软件图片
      coverImgClick: function () {
        if(this.multipleSelection1.length != 0) {
          this.initInsertGoods();
        }

      },

      //软件中已存在已选
      handleSelectionChange1: function (val) {
        this.multipleSelection1 = val;
        console.log(val)
      },

      //软件中不存在已选
      handleSelectionChange2:function (val) {
        this.multipleSelection2 = val;
        console.log(val)
      },

      //软件中不存在已选
      handleSelectionChange3:function (val) {
        this.multipleSelection3 = val;
        console.log(val)
      },

      //1、软件中已存在分页
      getPageSize1: function (val) {
        if(val != undefined) {

          //软件中已存在每页数量刷新数据
          this.pageSize1 = val;
          this.initQueryGoods(1,this.curPage1,this.pageSize1);
        }
      },
      getCurPage1: function (val) {
        if(val != undefined) {

          //变换软件中已存在当前页刷新数据
          this.curPage1 = val;
          this.initQueryGoods(1,this.curPage1,this.pageSize1);
        }
      },

      //2、软件中不存在分页
      getPageSize2: function (val) {
        if(val != undefined) {

          //软件中不存在变换每页数量刷新数据
          this.pageSize2 = val;
          this.initQueryGoods(2,this.curPage2,this.pageSize2);
        }
      },
      getCurPage2: function (val) {
        if(val != undefined) {

          //变换软件中不存在当前页刷新数据
          this.curPage2 = val;
          this.initQueryGoods(2,this.curPage2,this.pageSize2);
        }
      },

      //tab切换
      handleClick: function () {
        if(this.activeName == 'first') {
          this.initQueryGoods(2,this.curPage2,this.pageSize2);
        }else if(this.activeName == 'second') {
          this.initQueryGoods(1,this.curPage1,this.pageSize1);
        }
      },

      //商品编号-后渲染编辑图标
      renderHeader1(createElement, {_self}) {
        return createElement(
          'span',
          {
            'style': 'font-weight:bold;'
          },
          [
            createElement('span', ['商品编号']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-edit',
                'style': 'font-weight:bold;margin-left:5px;'
              }
            )
          ]
        );
      },

      //商品名称-后渲染编辑图标
      renderHeader2(createElement, {_self}) {
        return createElement(
          'span',
          {
            'style': 'font-weight:bold;'
          },
          [
            createElement('span', ['商品名称']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-edit',
                'style': 'font-weight:bold;margin-left:5px;'
              }
            )
          ]
        );
      },

      //条形码-后渲染编辑图标
      renderHeader3(createElement, {_self}) {
        return createElement(
          'span',
          {
            'style': 'font-weight:bold;'
          },
          [
            createElement('span', ['条形码']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-edit',
                'style': 'font-weight:bold;margin-left:5px;'
              }
            )
          ]
        );
      },

      //品牌-后渲染编辑图标
      renderHeader4(createElement, {_self}) {
        return createElement(
          'span',
          {
            'style': 'font-weight:bold;'
          },
          [
            createElement('span', ['品牌']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-edit',
                'style': 'font-weight:bold;margin-left:5px;'
              }
            )
          ]
        );
      },

      //分类-后渲染编辑图标
      renderHeader5(createElement, {_self}) {
        return createElement(
          'span',
          {
            'style': 'font-weight:bold;'
          },
          [
            createElement('span', ['分类']
            ),
            createElement(
              'i',
              {
                'class': 'el-icon-edit',
                'style': 'font-weight:bold;margin-left:5px;'
              }
            )
          ]
        );
      },
    }
  }
</script>
<style scoped>
  .content{
    margin-top: 20px;
  }
</style>
<style>
  #changeGoods .el-tabs__item {
    padding: 0 60px!important;
    border-bottom: 1px solid #e4e7ed!important;
  }
  #changeGoods .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #e4e7ed!important;
    color: black!important;
    background: #F2F2F2;
  }
  #changeGoods .el-tabs--card>.el-tabs__header {
    border-bottom: none;
  }
  #changeGoods .el-tabs__header {
    margin: 0 0 35px!important;
  }
  #dialogBox .el-dialog__body {
    padding: 35px 30px 0 !important;
  }
  #changeGoods .el-pager li:hover {
    color: #409EFF!important;
    background-color: transparent!important;
  }
  #changeGoods .el-table-column--selection .cell{
    text-align: center;
  }
</style>
