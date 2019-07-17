<!--拣货详情 佩玖-->
<template>
  <!--表格-->
  <div id="ConfirmPick">
    <div style="margin-bottom: 10px">
      <el-breadcrumb separator=">" class="col-breadcrumb">
        <el-breadcrumb-item @click.native="backOne">出库</el-breadcrumb-item>
        <el-breadcrumb-item>拣货详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="pDown">
      <el-tabs type="border-card" @tab-click="changOne(activeName2)" v-model="activeName2">
        <el-tab-pane label="出库商品" name="first">

          <el-table :data="tableDataGood" border max-height="800px" style="width: 100%">
            <el-table-column
              align="center"
              type="index"
              label="序号">
            </el-table-column>

            <el-table-column label="条形码" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.barCode }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品编号" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.goodsCode }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品名称" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.goodsName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="规格" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.specification }}</p>
              </template>
            </el-table-column>

            <el-table-column :label="item.attributeName" v-for="(item,i) in state" :key="i">
              <template slot-scope="scope">
                <p class="cen-g" v-for="(itemd,j) in scope.row.goodsAttributeShowBeanList"><span
                  v-if="j==i">{{ scope.row.goodsAttributeShowBeanList[i].attributeValue }}</span></p>
              </template>
            </el-table-column>

            <el-table-column label="批次号" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.batchNo}}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品属性" min-width="100" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.goodsAttrType == 1">正品</span>
                <span v-if="scope.row.goodsAttrType == 2">次品</span>
              </template>
            </el-table-column>

            <el-table-column label="应出库数量" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.goodsQty }}</p>
              </template>
            </el-table-column>
            <el-table-column label="实出库数量" width="100" prop="realQty">
            </el-table-column>

            <el-table-column :label="item.attributeName" v-for="(item,index) in batchoption" align='center'
                             :key="item.index" v-if="showBaych==true">
              <template slot-scope="scope">
                <div v-for="(val) in scope.row.batchoptiondataes">
                  <div v-if="item.attributeName==val.attributeName">
                    <span class="cen-g" v-show="val.attributeType=='2'">{{ scope.row['attributeValue' + index] }}</span>
                    <span class="cen-g" v-show="val.attributeType=='1'">{{ scope.row['attributeValue' + index] }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>


          </el-table>

        </el-tab-pane>

        <el-tab-pane label="拣货任务" name="second">
          <el-table :data="tableDataList"
                    id="fitTable"
                    border max-height="800px"
                    style="width: 100%">
            <el-table-column
              align="center"
              type="index"
              label="序号">
            </el-table-column>

            <el-table-column label="条形码" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.barCode }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品编号" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.goodsCode }}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品名称" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.goodsName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="规格" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.specification }}</p>
              </template>
            </el-table-column>

            <el-table-column label="批次号" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.batchNo}}</p>
              </template>
            </el-table-column>

            <el-table-column label="商品属性" min-width="100" align="center">
              <template slot-scope="scope">
                <span v-show="scope.row.goodsAttrType == 1">正品</span>
                <span v-show="scope.row.goodsAttrType == 2">次品</span>
              </template>
            </el-table-column>

            <el-table-column label="应拣数量" min-width="100">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.goodsQty }}</p>
              </template>
            </el-table-column>

            <el-table-column label="实拣数量" min-width="100">
              <template slot-scope="scope">
                <el-input v-model="scope.row.realQty"
                          @keyup.native="scope.row.realQty = scope.row.realQty.replace(/[^\d]/g,'');if(scope.row.realQty>scope.row.goodsQty)scope.row.realQty = '',refuse()"
                          maxlength="20"
                          style="width:80px;"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="库区名称" min-width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.storageSectionName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="库位名称" width="140">
              <template slot-scope="scope">
                <p class="initP-g">{{ scope.row.storageBinName }}</p>
              </template>
            </el-table-column>

            <el-table-column label="库位类型" width="140" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.binType == 1">正品</span>
                <span v-if="scope.row.binType == 2">次品</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="wmsFoot">
      <div v-if="isShowShop">
        <el-button type="info" style="line-height: 15px" @click="outTo"> 返 回 </el-button>
      </div>
      <div v-if="isShowList">
        <el-button type="primary" @click="saveDetermine(tableDataList[0].realQty,tableDataList[0].goodsQty)"> 保存并确认
        </el-button>
        <el-button type="primary" @click="save()"> 保 存 </el-button>
        <el-button type="info" @click="outTo"> 返 回 </el-button>
      </div>
    </div>


    <!--确认拣货-->
    <div>
      <el-dialog v-dialogDrag
        title="确认拣货"
        :visible.sync="reassignment"
        width="1200px"
        center>
        <div style="width: 100%;margin-top:-10px;text-align: center">
          <i style="font-size: 16px;color: #d58512;" class="el-icon-warning"></i>
          <span style="font-size: 14px;margin-left: 10px">以下库位未完成拣货，是否重新分配拣货库位？</span>
          <div class="" style="margin-top: 20px">
            <el-table :data="tableDataPig" border style="width:100%;">
              <el-table-column
                align="center"
                type="index"
                label="序号">
              </el-table-column>
              <el-table-column label="商品属性">
                <template slot-scope="scope">
                  <p class="cen-g" v-show="scope.row.goodsAttrType===1">正品</p>
                  <p class="cen-g" v-show="scope.row.goodsAttrType===2">次品</p>
                </template>
              </el-table-column>
              <el-table-column label="条形码">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.barCode }}</p>
                </template>
              </el-table-column>
              <el-table-column label="批次号">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.batchNo }}</p>
                </template>
              </el-table-column>
              <el-table-column label="库区名称">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.storageSectionName }}</p>
                </template>
              </el-table-column>
              <el-table-column label="库位名称" width="180">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.storageBinName }}</p>
                </template>
              </el-table-column>

              <el-table-column label="库位类型">
                <template slot-scope="scope">
                  <p class="cen-g" v-show="scope.row.goodsAttrType===1">正品</p>
                  <p class="cen-g" v-show="scope.row.goodsAttrType===2">次品</p>
                </template>
              </el-table-column>

              <el-table-column label="应拣数量">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.goodsQty }}</p>
                </template>
              </el-table-column>

              <el-table-column label="实拣数量" min-width="100">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.realQty }}</p>
                </template>
              </el-table-column>


            </el-table>
          </div>
        </div>
        <div style="margin-top:20px;margin-bottom:20px;text-align: right">
          <el-button
            @click="reassignment=false">取消
          </el-button>
          <el-button type="primary" @click="confirmatPick()">否，强制确认</el-button>
          <el-button type="primary"
                     @click="submitData()">是，重新分配
          </el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog v-dialogDrag
        title="提示"
        :visible.sync="complate"
        width="400px"
        center>
        <div style="text-align: center;">
          <span style="font-size: 18px">确定出库单拣货完成？</span>
        </div>
        <div style="margin-top:40px;margin-bottom:20px;text-align: center">
          <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;"
                     @click="complate=false">取消
          </el-button>
          <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;"
                     @click="isOk()">确定
          </el-button>
        </div>
      </el-dialog>
    </div>


    <!--重新分配库位-->
    <el-dialog v-dialogDrag
      title="重新分配库位"
      :visible.sync="addbathlist"
      width="1080px"
      center>
      <el-table :data="tableDataad"
                highlight-current-row
                border
                style="width: 100%"
      >
        <el-table-column
          align="center"
          type="index"
          label="序号">
        </el-table-column>

        <el-table-column label="商品属性" align='center' width="100px">
          <template slot-scope="scope">
            <p class="cen-g" v-show="scope.row.goodsAttrType==1">正品 </p>
            <p class="cen-g" v-show="scope.row.goodsAttrType==2">次品 </p>
          </template>
        </el-table-column>

        <el-table-column label="条形码" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.barCode }}</p>
          </template>
        </el-table-column>

        <el-table-column label="商品编号" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.goodsCode }}</p>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.goodsName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="规格" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.specification }}</p>
          </template>
        </el-table-column>

        <el-table-column label="批次号" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.batchNo }}</p>
          </template>
        </el-table-column>

        <el-table-column label="库区名称" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.storageSectionName }}</p>
          </template>
        </el-table-column>

        <el-table-column label="库位名称" align="center" width="180px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.storageBinId" placeholder="请选择"
                       style="width:160px!important;"
                       @change="typeTwo(scope.row,scope.$index)">
              <el-option
                v-for="(item,i) in scope.row.wmBinItems"
                :key="item.storageBinId"
                :label="item.storageBinName"
                :value="item.storageBinId">
              </el-option>
            </el-select>

          </template>
        </el-table-column>

        <el-table-column label="库位类型" align="center">
          <template slot-scope="scope">
            <p class="cen-g" v-show="scope.row.goodsAttrType==1">正品 </p>
            <p class="cen-g" v-show="scope.row.goodsAttrType==2">次品 </p>
          </template>
        </el-table-column>

        <el-table-column label="应拣数量" align="center">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.goodsQty }}</p>
          </template>
        </el-table-column>


      </el-table>

      <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="addbathlist= false;print()" style="line-height: 10px">打 印</el-button>
            <el-button size="mini" type="primary" @click="submitDataesd()" style="line-height: 10px">确 定</el-button>
          </span>

    </el-dialog>


  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'

  export default {
    components: {
      pagination
    },
    props: ['stockOutNos', 'stockOutIds'],//父级的传参
    data() {
      return {
        version: '1.0.0',
        addbathlist: false,//打印窗口
        showBaych: false,//批次属性列是否显示
        batchoption: [],//批次属性表头名称列表
        tableDataad: [],//重新分配库位数据
        activeName2: 'first',//tab切换默认
        optionsSuit: [{//仓库下拉
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
        isShowOne: false,
        isShowTwo: false,
        id: '',//条形码
        addData: [],//废弃属性，页面没有查到
        tableData: [],//表格数据
        tableDataGood: [],//上架商品信息
        tableDataList: [],//上架任务信息
        successTableData: [],//废弃属性，页面没有查到
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
        picks: false,//完成上架弹窗// 上架任务
        handadd: false,//废弃属性，页面没有查到
        Nopicks: false,//废弃属性，页面没有查到
        table_h: 0,//表格高度
        state: [],//属性表头名称列表
        isShowList: false,//是否展示操作按钮
        isShowShop: true,//是否展示返回按钮
        complate: false,//关闭弹框
        tableDataPig: [],//确认拣货弹框表格数据
        tableDataesd: [],//表格数据对比用数组
        reassignment: false,//确认拣货弹框关闭属性
      }
    },
    mounted() {
      this.initMessage();//初始化数据
      this.initBatchopt();//初始化批次属性选项

      //表格格高度
      this.$nextTick(function () {
        var a = document.body.clientHeight;// 页面高度
        var b = document.getElementById('fitTable').offsetTop;// 表格距离顶部的距离
        this.table_h = a - b - 100;
        console.log(1, this.table_h);
      })
    },
    methods: {

      //打印
      print(){
          var arrOne='';
          for (let item of this.tableDataad) {
            arrOne += item.stockOutId + ','
          }
          const token=sessionStorage.getItem('clToken');
          let data={
            ids:arrOne.slice(0, -1),
            modelkey:4,
            stype:'SVoucher',
            cltoken:token
          }
          $.ajax({
            type: "post",
            url: "http://127.0.0.1:8082/preview",
            data: data,
            success: function(data){
            }
          });
      },

      //初始化数据
      initMessage() {
        var self = this;

        //查询上架单详情
        var paramData = {
          stockOutId: self.stockOutIds
        }
        self._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/confirmPickingList', paramData)
          .then(function (response) {
            if (response.data.code == 0) {
//              self.tableDataGood = response.data.result.stockOutGoods;
              self.tableDataList = response.data.result.pickingTask;
              self.tableDataList.forEach((item) => {
                if (item.realQty == 0) {
                  item.realQty = ''
                }
              })
              response.data.result.stockOutGoods.forEach((item) => {
                self.state = item.goodsAttributeShowBeanList;
                item.batchoptiondataes = self.batchoption;
                item.batchoptiondataes.forEach((value, num) => {
                  item['attributeValue' + num] = '';
                  item['attributeValueId' + num] = '';
                });
              })
              response.data.result.stockOutGoods.forEach((item) => {
                if (item.batchNo != '') {
                  self.tableDataesd = response.data.result.stockOutGoods;
                  self.showBaych = true
                  self.Assuccess()
                } else {
                  self.tableDataGood = response.data.result.stockOutGoods;
                }
              })
            } else {
              self.$message({
                message: response.data.result.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //初始化批次属性选项
      initBatchopt() {
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/selectGoodsAttributeBatch').then(function (res) {
          res.data.result.forEach(function (val) {
            val.attributeValue = ''
          });
          this.batchoption = res.data.result
        }.bind(this));
      },

      //获取批次
      Assuccess() {
        this.tableDataesd.forEach((item) => {
          this._post('com.edb01.erp.wms.service.api.StorageAttributeService/' + this.version + '/getGoodsBatchAllAtribute', {
            batchNo: item.batchNo,
            goodsId: item.goodsId
          }).then((res) => {
            if (res.data.success) {
              res.data.result.forEach((val, n) => {
                item.batchoptiondataes.forEach((num) => {
                  if (num.attributeId == val.attributeId) {
                    item['attributeValueId' + n] = val.attributeValue;
                    item['attributeValue' + n] = val.attributeValue;
                  }
                })
              })
            }
          })
        })
        this.tableDataGood = this.tableDataesd
      },

      //初始化批次属性选项
      initBatchopt() {
        this._post('com.edb01.erp.mdata.service.api.AttributeDefineService/' + this.version + '/selectGoodsAttributeBatch').then(function (res) {
          res.data.result.forEach(function (val) {
            val.attributeValue = ''
          });
          this.batchoption = res.data.result
        }.bind(this));
      },

      // 返回售后处理页面
      backOne() {
        this.$emit('changeShow', {childrenShow: 3});

      },

      //校验
      refuse() {
        this.$message({
          message: '实拣数量不应大于应拣数量！',
          type: 'warning'
        });
      },

      /*//是，重新分配
     redistribution: function () {
       let self = this
        self._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/againAlloction', {stockOutId: self.$router.history.current.params.stockOutId}).then(function (res) {
         if (res.data.code == 0) {
           self.picks = false
           self.addbathlist = true
            self.tableDataad = res.data.result.data

            //直接跳回首页
            self.$router.push('/OutStock')
          } else {
           self.$message({
             message: res.data.result.data,
              type: 'warning'
            })
          }
        }).catch(function (err) {
          console.log(err)
        })
     },*/

      //强制确认拣货
      confirmatPick: function () {
        let self = this
        self._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/forceConfirm', {stockOutId: self.stockOutIds}).then(function (res) {
          if (res.data.code == 0) {
            self.$message({
              type: 'success',
              message: '确认拣货成功!'
            })
            //直接跳回首页
            this.backOne()
          } else {
            self.$message({
              message: res.data.result.data,
              type: 'warning'
            })
          }
        }).catch(function (err) {
          console.log(err)
        })
      },

     //提交重新分配数据
      submitData() {
        let self = this
        self._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/againAlloction', {
          stockOutId: self.stockOutIds
        }).then(function (res) {
          if (res.data.code == 0) {
            self.reassignment = false
            self.addbathlist = true;
            self.tableDataad = res.data.result.data;
            //self.initMessage();

          } else {
            self.$message({
              message: res.data.result.data,
              type: 'warning'
            })
          }

        }).catch(function (err) {
          console.log(err)
        })
      },

      //确认提交数据
      submitDataesd() {
        let self = this
        self._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/againAlloctionConfirm', {
          pickingItemJson: JSON.stringify(self.tableDataad),
          stockOutId: this.stockOutIds
        }).then(function (res) {
          if (res.data.code == 0) {
            self.addbathlist = false;
            self.$message({
              message: res.data.msg,
              type: 'success'
            })
            self.initMessage();
          } else {
            self.$message({
              message: res.data.result.data,
              type: 'warning'
            })
          }

        }).catch(function (err) {
          console.log(err)
        })
      },

      //确认拣货失败
      beDefeated: function () {
        let self = this
        this.$confirm('确定作废出库单？', '提示', {
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var arr = '';
          for (let item of this.tableNum) {
            arr += item.stockOutId + ','
          }
          self._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/cancelStockoutOrder', {stockOutIds: arr.slice(0, -1)}).then(function (res) {
            console.log(123, res.data.result.checkstatus)
            if (res.data.result.checkstatus) {
              self.$message({
                message: '导入成功' + res.data.result.successNum + '条,失败' + res.data.result.failNum + '条!',
                type: 'success'
              });
            } else {
              self.$message({
                message: res.data.result.data,
                type: 'warning'
              })
            }
          }).catch(function (err) {
            console.log(err)
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },

      //保存并确认
      saveDetermine() {
        let arr = []
        this.tableDataList.forEach(function (item, i) {
          if (item.realQty != '') {
            arr.push(item.realQty)
          }
        }.bind(this));
        if (arr.length != this.tableDataList.length) {
          this.$message({
            message: '有商品的实拣数量为空，请填写商品的实拣数量！',
            type: 'warning'
          });
        } else {
          var paramData = {
            stockOutId: this.stockOutIds,
            pickingDataJson: JSON.stringify(this.tableDataList),
          };

          this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/saveConfirmPickingData', paramData)
            .then(function (res) {
              if (res.data.success) {
                if (res.data.result.checkstatus == true) {
                  this.complate = true

                } else {

                  if (res.data.result.data != '') {
                    this.reassignment = true;
                    this.tableDataPig = res.data.result.data;
                  } else {
                    this.$message({
                      message: '拣货成功',
                      type: 'warning'
                    });
                  }
                }
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            }.bind(this))
        }
      },

      //确定
      isOk() {
        this.$message({
          type: 'success',
          message: '保存成功!',
        })
        this.backOne()
      },

      //保存
      save() {
        let arr = []
        this.tableDataList.forEach(function (item, i) {
          if (item.realQty != '') {
            arr.push(item.realQty)
          }
        }.bind(this));

        if (arr.length != this.tableDataList.length) {

          this.$message({
            message: '有商品的实拣数量为空，请填写商品的实拣数量！',
            type: 'warning'
          });
        } else {
          let data = [];
          this.tableDataList.forEach(function (item, i) {
            data.push({stockOutPickingItemId: item.stockOutPickingItemId, realQty: item.realQty});
          }.bind(this));

          var paramData = {
            stockOutId: this.stockOutIds,
            pickingDataJson: JSON.stringify(data),
          }
          this._post('com.edb01.erp.wms.service.api.WmStockOutService/' + this.version + '/savePickingData', paramData)
            .then(function (res) {
              if (res.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功!',
                });
                this.backOne()
              } else {
                this.$message({
                  message: '保存失败，请重试！',
                  type: 'warning'
                });
              }
            }.bind(this))
            .catch(function (error) {
              console.log(error);
            });
        }
      },

      //切换按钮
      changOne(activeName2) {
        if (this.activeName2 == 'first') {
          this.isShowList = false;
          this.isShowShop = true;
        }
        if (this.activeName2 == 'second') {
          this.isShowList = true;
          this.isShowShop = false;
        }
      },

      //返回
      outTo() {
        this.backOne()
      },

     // 以下是分页
      getPageSize: function (val) {
        this.pageSize = val;
      },
      getCurPage: function (val) {
        if (val != undefined) {
          this.curPage = val
        }
      },

    }
  }
</script>
<style scoped>
  #ConfirmPick {
    padding: 20px;
  }

  /*.pTop{
    margin-bottom: 20px;
  }
  .el-button {
    display: inline-block;
    line-height: 0
  }*/
</style>
<style>
  /* #ConfirmPick  .el-table td, .el-table th{
     padding: 0!important;
   }
   #ConfirmPick .el-table th>.cell {
     text-align: center;
     padding: 3px 0;
     background-color: #eee;
     height: 29px;
   }
   #ConfirmPick .el-table--enable-row-hover .el-table__body tr:hover>td {
     background-color: #eee!important;
   }
   #ConfirmPick .pTop .el-input,.pTop .el-input__inner{
     width: 195px!important;
     height: 28px!important;
     line-height: inherit!important;
   }
   #ConfirmPick  .col-nav{
     width: 100%;
     height: 28px!important;
     background: #F7F7F7;
   }
   #ConfirmPick .btnStyle{
     border-radius: 5px !important;
     background-color: rgb(129, 141, 154);
     color: white;
     border: none;
     width: 100px!important;
     height: 30px;
   }
   #ConfirmPick .save{
     position: fixed;
     bottom: 20px;
     right: 0;
     width: 100%;
     text-align: center;
   }
   #ConfirmPick .el-button[data-v-60b7066a] {
   display: inline-block;
   line-height: 15px;
 }
   #ConfirmPick .save{
     position: fixed;
     bottom: 20px;
     right: 0;
     width: 100%;
     text-align: center;
   }*/
  /* #ConfirmPick .main[data-v-0235d39d] {
     min-height: 100%;
     padding: 20px !important;
     background: rgb(255, 255, 255);
     position: relative;
     margin-left: 95px;}*/
</style>



