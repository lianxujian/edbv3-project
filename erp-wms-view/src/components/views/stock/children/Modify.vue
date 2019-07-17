<!--修改调整单 尘音-->
<template>
  <div id="modify">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="showParentBlock">库存调整</a></el-breadcrumb-item>
        <el-breadcrumb-item>修改调整单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--搜索区-->
    <div id="searchBox">
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            <label for="searchStock">仓库：</label>
            <el-select disabled id="searchStock" v-model="storageId" filterable placeholder="全部">
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
            <p v-show="isTypeShow" style="margin-left: 65px;margin-top:3px;color: red">请选择调整类型</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <label for="explain" style="vertical-align: top;">调整说明：</label>
            <el-input
              maxlength="200"
              id="explain"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="invaExplain">
            </el-input>
            <span>{{invaExplain.length}}/200</span>
            <p v-show="isExplainShow" style="margin-left: 65px;margin-top:3px;color: red">请填写调整说明</p>

          </div>
        </el-col>
      </el-row>

    </div>
    <!--操作导航-->
    <div class="col-nav" style="margin:20px 0 10px">
      <ul>
        <li @click="addGoods"><span>添加商品</span></li><span></span>
      </ul>
    </div>
    <el-dialog v-dialogDrag
      title="添加调整商品"
      :visible.sync="refuseClick"
      width="1050px"
      center>
      <div style="margin: 0 -30px">
        <!--搜索区-->
        <div style="position: relative">
          <div class="leftBox1">
            <el-row>

              <el-col :span="7">
                <div class="grid-content">
                  <label for="stockArea">库区：</label>
                  <el-select id="stockArea" v-model="storageSectionIdDialog" filterable placeholder="全部">
                    <el-option
                      v-for="item in optionsStockAreaDialog"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-col>

              <el-col :span="10">
                <div class="grid-content">
                  <el-select style="width: 110px!important;" v-model="select1TypeDialog" filterable>
                    <el-option
                      v-for="item in optionsAdjustDialog"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input maxlength="50" style="width: 220px!important;" v-model="select1ValueDialog" placeholder=""></el-input>
                </div>
              </el-col>

              <el-col :span="7">
                <div class="grid-content">
                  <label for="name">商品名称：</label>
                  <el-input maxlength="100" id="name" v-model="goodsNameDialog" placeholder="请输入内容"></el-input>
                </div>
              </el-col>

            </el-row>
          </div>
          <div class="rightBox1">
            <el-button @click="searchDialog" size="mini" type="default">查 询</el-button>
          </div>
        </div>
        <!--表格-->
        <div class="pDown">
          <el-table
            :data="tableDataDialog" border max-height="300" style="width: 100%"
            ref="multipleTable"
            @selection-change="handleSelectionChange">
            <el-table-column label="序号" type="index" align="center" width="45"></el-table-column>

            <el-table-column
              type="selection"
              width="55">
            </el-table-column>

            <el-table-column label="条形码" width="110">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.barCode }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品名称" width="200">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.goodsName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="仓库">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.storageName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="库区">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.sectionName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="库位">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.storageBinName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="库位类型">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.binType }}</p>
              </template>
            </el-table-column>

            <el-table-column label="可配货库存" width="85">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.dstInv }}</p>
              </template>
            </el-table-column>

            <el-table-column label="可配货预占" width="85">
              <template slot-scope="scope">
                <p class="cen-g">{{ scope.row.dstCamponInv }}</p>
              </template>
            </el-table-column>

          </el-table>
          <!--分页-->
          <div style="text-align: right;margin-top: 10px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="curPage"
              :page-sizes="[15, 30, 50, 100, 200]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="refuseClick = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="refuseTrueClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData" border style="width: 100%;margin-bottom: 100px">
        <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

        <el-table-column label="条形码" width="110">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.barCode }}</p>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" width="200">
          <template slot-scope="scope">
            <p class="initP-g">{{ scope.row.goodsName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="仓库">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.storageName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="库区">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.sectionName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="库位">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.storageBinName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="库位类型">
          <template slot-scope="scope">
            <p class="cen-g" v-show="scope.row.binType == 1">正品</p>
            <p class="cen-g" v-show="scope.row.binType == 2">次品</p>
          </template>
        </el-table-column>

        <el-table-column label="可配货库存">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.dstInv }}</p>
          </template>
        </el-table-column>

        <el-table-column label="调整量">
          <template slot-scope="scope">
            <p class="cen-g">
              <input type="number" @keyup="scope.row.adjustQty = scope.row.adjustQty.replace(/[^\d\-]/g,'');if(scope.row.adjustQty == 0)scope.row.adjustQty = ''" v-model="scope.row.adjustQty" style="width:90%;height: 25px;text-align: center">
            </p>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="177">
          <template slot-scope="scope">
            <el-button @click="deleteClick(scope.row,scope.$index,tableData)" ref="del" type="text" size="small" style="color: red">删 除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!--footer-->
      <div class="wmsFoot">
        <el-button @click="holdClick" size="mini" type="primary">保 存</el-button>
        <el-button @click="backClick" size="mini" type="info">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      params: Object //接收父级参数
    },
    data(){
      return{
        version: '1.0.0',
        optionsStock:[{value: '',label: '全部'}],//仓库下拉
        storageId: '',//仓库

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

        invaExplain: '',//调整说明

        tableData:[],//表格数据

        isTypeShow: false,//调整类型验证

        isExplainShow: false,//调整说明验证

        refuseClick: false,//添加商品

        optionsStockAreaDialog:[],//弹框库区下拉
        storageSectionIdDialog: '',//弹框库区

        optionsAdjustDialog: [
          {value: '1001',label: '条形码'},
          {value: '1002',label: '库位'}],//弹框库位、条形码下拉
        select1TypeDialog: '1002',//弹框库位、条形码
        select1ValueDialog: '',//弹框库位、条形码值

        goodsNameDialog: '',//弹框商品名称

        tableDataDialog: [],//弹框表格数据
        multipleTable: [],//弹框选择的数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1 //当前页数
      }
    },
    mounted(){
      this.initStock();//初始和仓库下拉
      this.initMessage();//初始化表格数据
    },
    methods:{

      //返回父级
      showParentBlock() {
        this.$emit('changeShow',true)
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/list').then(function (res) {
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

      //初始化库区下拉
      initSeat: function () {
        let data = {
          storageId: this.storageId
        };
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version + '/findByStorageId',data).then(function (res) {
          if(res.data.success) {
            let arr = res.data.result;
            console.log(arr);
            this.optionsStockAreaDialog = [{value:'',label:'全部'}];
            arr.forEach(function (val) {
              this.optionsStockAreaDialog.push({value: val.storageSectionId,label: val.sectionName})
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
      initMessage(){
        let data = {stockInvaId: this.params.stockInvaId};
        this._post('com.edb01.erp.wms.service.api.WmStockInvaService/' + this.version + '/queryLinkById',data)
          .then(function (res) {
            if(res.data.success) {
              this.storageId = res.data.result.storageId;

              this.invaType = res.data.result.invaType.toString();
              this.invaExplain = res.data.result.invaExplain;
              if(res.data.result.wmStockInvaItemPOList != undefined) {
                this.tableData = res.data.result.wmStockInvaItemPOList;
              }else {
                this.tableData = []
              }
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
        }.bind(this))
      },

      //初始化弹框表格数据
      initDialog: function () {
        let data = {
          storageId: this.storageId,
          storageSectionId: this.storageSectionIdDialog,
          goodsName: this.goodsNameDialog,
          selectValue: this.select1ValueDialog,
          selectType: this.select1TypeDialog,
          page: this.curPage,
          size: this.pageSize
        };
        this._post('com.edb01.erp.wms.service.api.WmBinInvService/' + this.version + '/wmStockInvaQueryPager',data)
          .then(function (res) {
            if(res.data.success) {
              this.tableDataDialog = res.data.result.rows;
              this.total = res.data.result.total;
            }else {
              if(res.data.code == 200000003) {
                this.tableDataDialog = []
              }else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            }
          }.bind(this))
      },

      //添加商品
      addGoods: function () {
        if(this.storageId == '') {
          this.isStockShow = true
        }else {
          this.isStockShow = false;
          this.refuseClick = true;
          this.initSeat();
          this.initDialog()
        }
      },

      //弹框选择商品
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //添加调整商品确定点击
      refuseTrueClick: function () {

        if(this.tableData.length == 0) {
          this.tableData = this.multipleSelection
        }else {
          this.multipleSelection.forEach(function (val,index) {
            this.tableData.forEach(function (item) {
              if(this.multipleSelection[index].storageBinId == item.storageBinId && this.multipleSelection[index].goodsId == item.goodsId) {

                this.$alert('本商品行已存在!','提示',{
                  confirmButtonText: '确定',
                  center: true,
                });
                this.multipleSelection.splice(index,1)
              }

            }.bind(this));
          }.bind(this));

          this.multipleSelection.forEach(function (val) {
            this.tableData.push(val)
          }.bind(this))
        }

        this.refuseClick = false;

      },

      //弹框查询
      searchDialog: function () {
        this.initDialog()
      },

      //弹框分页
      handleSizeChange(val) {
        console.log(val);
      },
      handleCurrentChange(val) {
        console.log(val);
      },

      //删除接口
      initDelete: function (row) {
        let data = {stockInvaItemId: row.stockInvaItemId};
        this._post('com.edb01.erp.wms.service.api.WmStockInvaItemService/' + this.version + '/delete',data)
          .then(function (res) {
            if(res.data.success) {
              this.initMessage()
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }.bind(this))
      },

      //删除
      deleteClick: function (row,index,rows) {
        rows.splice(index,1)
      },

      //保存接口
      initHold: function () {
        let str = JSON.stringify(this.tableData);
        let data = {
          stockInvaId: this.params.stockInvaId,
          storageId: this.storageId,
          invaType: this.invaType,
          invaExplain: this.invaExplain,
          wmStockInvaItemPOListStr: str
        };

        this._post('com.edb01.erp.wms.service.api.WmStockInvaService/' + this.version + '/update',data)
          .then(function (res) {
            if(res.data.success) {
              //this.$router.push('/adjust')
              this.$emit('changeShow',{isRefresh:true})
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }.bind(this))
      },

      //点击返回
      backClick: function () {
        //this.$router.push('/adjust')
        this.$emit('changeShow',true)
      },

      //点击保存
      holdClick: function () {
        if(this.invaType == '') {
          this.isTypeShow = true
        }
        else if(this.invaExplain == '') {
          this.isTypeShow = false;
          this.isExplainShow = true
        }
        else if(this.tableData.length == 0) {
          this.isTypeShow = false;
          this.isExplainShow = false;
          this.$alert('请添加调整商品!','提示',{
            confirmButtonText: '确定',
            center: true,
          })
        }
        else {
          this.isTypeShow = false;
          this.isExplainShow = false;

          let arr = [];
          this.tableData.forEach(function (val) {
            arr.push(val.adjustQty);
          }.bind(this));
          if (arr.indexOf(undefined) != -1) {
            this.$alert('调整量不能为空!', '提示', {
              confirmButtonText: '确定',
              center: true,
            })
          }else {
            this.initHold()
          }
        }
      },
    }
  }
</script>
<style scoped>
  .pTop{
    margin-bottom: 20px;
  }
</style>
<style>
  #modify .el-textarea{
    width: 82%;
  }
  #modify .el-table .cell {
    text-align: center;
  }
</style>
