<!--修改上架策略 秋香-->
    <template>
      <div id="UpdateNewStrategy">
        <el-breadcrumb separator=">" class="col-breadcrumb">
          <el-breadcrumb-item :to="{ path: '/upShelves' }">上架策略</el-breadcrumb-item>
          <el-breadcrumb-item>修改</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="white-space: nowrap;padding-left: 50px;">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="wrapper-one">
                <div class="fix">
                  <div class="fix-l" ><label>策略名称：</label></div>
                  <el-input v-model="updateData.strategyName" :disabled="isShow" placeholder="请输入策略名称" :maxlength="50" style="width:50%;width:200px;"></el-input><span class="xin">* </span>
                </div>
              </div>
            </el-col>
            <el-col :span="15">
              <div class="grid-content">
                <div class="fix">
                  <div class="fix-l" ><label>上架商品规则：</label></div>
                  <template>
                    <el-radio-group v-model="updateData.goodsRule" :disabled="isShow">
                      <el-radio :label="1">一品一位</el-radio>
                      <el-radio :label="2">一品多位</el-radio>
                   </el-radio-group>
                  </template>
                </div>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="wrapper-one">
                <div class="fix">
                  <div class="fix-l" >
                    <ul>
                      <label>库位上架优先顺序：</label>
                      <li v-for="(item,index) in tableLeft">
                        <span class="indexS">{{index + 1}}</span><i class="icon-down iconfont spanI" v-if="index !=0" @click="upOne(tableLeft,index)"></i>
                        <span class="liText">{{item.name}}</span><i class="icon-down iconfont spanI1" v-if="index !=tableLeft.length - 1" @click="downOne(tableLeft,index)"></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="wrapper-one">
                <div class="fix" style="margin-bottom: 10px">
                  <div class="fix-l" ><label>可上架库区配置：</label></div>
                  <span @click="addClickExpress()"><el-button type="primary" round :disabled="isShowButton">添加</el-button></span>
                  <span class="fontP">（备注：不同批次的商品不会放在同一库位 不同质量属性的商品不会放在同一库位）</span>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="pDown">
            <el-table :data="tableData" border style="width: 100%;">
              <el-table-column
                align="center"
                type="index"
                label="序号">
              </el-table-column>
              <el-table-column label="仓库名称"width="180" >
                <template slot-scope="scope">
                    <el-select id="isSuit" v-model="scope.row.storageId" filterable placeholder="全部" :disabled="scope.row.disabled1" @click.native="testM(scope.row)" @change="changeStorage(scope.$index,scope.row)">
                      <el-option
                        v-for="item in storage"
                        :key="item.storageId"
                        :label="item.storageName"
                        :disabled="item.disabled"
                        :value="item.storageId">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column label="库区名称" >
                <template slot-scope="scope">
                  <div v-if="scope.row.isShowKit1">
                    <el-badge value="X" class="item" style="margin:10px 20px 15px 0;cursor: pointer" v-for="(item,index) in scope.row.putawaySectionVOS" :key="index" @click.native="clickDelOne(index,scope.row)">
                      <el-button style="width:auto!important;" size="small">{{item.sectionName}}</el-button>
                    </el-badge>
                  </div>
                  <div>
                    <div v-if="!scope.row.isShowKit1">
                      <el-badge  class="item" style="margin:10px 10px 5px 0;cursor: pointer" v-for="(item,index) in  scope.row.putawaySectionVOS" :key="index">
                        <el-button style="width:auto!important;" size="small">{{item.sectionName}}</el-button>
                      </el-badge>
                    </div>
                  </div>
                  <div v-if="scope.row.isShowKit1">
                    <p class="cen-g">
                      <i class="el-icon-circle-plus" @click="setOrder(scope.row,scope.$index);"></i>
                    </p>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="180"  align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.isShowKit1">
                    <el-button type="text" size="small" @click="updateDataName(scope.row,scope.$index)">保存</el-button>
                    <el-button type="text" size="small" style="color: red" @click="cancelNameData(scope.row,scope.$index)">取消</el-button>
                  </div>
                  <div v-else>

                    <el-button type="text" size="small" :disabled="isChangedata.indexOf(true)>-1"  @click="updateByIdMoney(scope.row,scope.$index)">修改</el-button>
                    <el-button type="text" size="small" style="color: red" @click="cancelStrateData(scope.row,scope.$index)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="save">
          <el-button  @click="delK()">取消</el-button>
          <el-button type="primary" @click="addAll()">确定</el-button>
        </div>
        <div>
          <el-dialog v-dialogDrag
            title="选择库区"
            :visible.sync="shelves"
            width="600px"
            center>
            <div style="width: 100%;margin-top:-10px;text-align: center">
              <div class="" style="margin-top: 20px">
                <el-table :data="tableDataOne" border style="width:100%;"@selection-change="handleSelectionChange3"
                          ref="multipleTable3" >

                  <el-table-column
                    align="center"
                    type="index"
                    label="序号">
                  </el-table-column>

                  <el-table-column
                    align='center'
                    type="selection"
                    width="50">
                  </el-table-column>

                  <el-table-column label="库区类型" >
                    <template slot-scope="scope">
                      <span v-if="scope.row.sectionType == 1">拣货区</span>
                      <span v-if="scope.row.sectionType == 2">存货区</span>
                      <span v-if="scope.row.sectionType == 3">收货区</span>
                      <span v-if="scope.row.sectionType == 4">退货区</span>
                      <span v-if="scope.row.sectionType == 5">次品区</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="库区名称" >
                    <template slot-scope="scope">
                      <p class="cen-g">{{scope.row.sectionName}}</p>
                    </template>
                  </el-table-column>

                </el-table>
              </div>
            </div>
            <div style="margin-top:20px;margin-bottom:20px;text-align: right">
              <el-button class="btnStyle" style="margin:0;background-color:white;color:black;border:1px solid #818d9a;" @click="shelves=false">取消</el-button>
              <el-button class="btnStyle" style="margin:0;background-color:#49A0F5;color:white;border:none;" @click="sureData()">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </template>
    <script>
      import pagination from '@/components/common/Pagination.vue'
      export default {
        data(){
          return {
            version:'1.0.0',//版本号
            tableLeft: [],//类型
            strateg1:[],//库区
            strateg:[],//库区
            tableData:[],//仓库
            tableDataOne:[],//选择库区
            types:[{
              value: 1,
              label: '采购退货'
            }, {
              value: 2,
              label: '调拨出库'
            }, {
              value: 3,
              label: '其他出库'
            },{
              value: 4,
              label: '订单出库'
            }],//仓库下拉
            isSuit: '',//是否套装
            shelves:false,//选择库区窗口
            gridData: [], // 店铺名称
            storage:[],//仓库
            disabled: false,//禁用按钮
            indexTag: '',//校验
            isShowKit1:false,//隐藏
            updateData:{
              merchantId:'',//商户id
              strategyName:'',//策略名
              goodsRule:'',//上架商品规则
              putawayStorageBeanList:[],//仓库
              goodStronge:'',//库区
            },//修改
            putawaySectionVOS:[],//库区名称
            sectionName:'',//仓库名称
            putawayStrategyId:'',//上架策略id
            old:[],//设置仓库
            storageId:'',//仓库
            isShow: false,//禁用按钮
            disabled1:false,//禁用按钮
            putawayStorageVOS:[],//仓库
            isShowButton:false,//添加按钮
            isChangedata:[],//校验修改
            storageData:[],//仓库
          }
        } ,
        mounted(){
          this.storageName();//仓库
          //回显
          var self = this;
          var paramData = {
            putawayStrategyId:self.$router.history.current.params.putawayStrategyId,
            merchantId:0,//商户id
          }
          self._post('com.edb01.erp.wms.service.api.WmPutawayStrategyService/' + this.version +'/findPutawayStrategy',paramData)
            .then(function (response) {
              if (response.data.code == 0) {
                self.updateData=response.data.result;
                response.data.result.putawayStorageVOS.forEach((item)=>{
                  item.isShowKit1=false
                  if(!item.storageId==''){
                    item.disabled1=true
                  }
                })
                self.tableData=response.data.result.putawayStorageVOS;

                response.data.result.putawayStorageVOS.forEach((item=>{
                  self.storageData=item.storageId
                }))

                //  this.tableData.push({storageId: '',isShowKit1:true,putawaySectionVOS: []})
                self.priArray = response.data.result.priArrayStr;
                self.putawayStrategyId=response.data.result.putawayStrategyId
                if(self.updateData.systemDefault ==true){ // 判断当前是否是系统默认
                  self.isShow = true;
                  self.isShowButton=true;
                }else{
                  self.isShow = false;
                  self.isShowButton=false;
                }
                let putawaySectionVOS=[]
                for(var item of self.tableData) {
                  self.putawaySectionVOS=item.putawaySectionVOS
                }
                    self.putawaySectionVOS.forEach(item1 => {
                      item.sectionName = item1.sectionName
                    })
                var tableLeft = [
                   {name: '有货库位'},
                   {name: '空库位'},
                   {name: '新库位'},
                ]
                var priArray = self.priArray.split(",");
                tableLeft.forEach((item,i)=>{
                  tableLeft[i].pri = priArray[i];
                })
                tableLeft = tableLeft.sort((a,b)=>{
                  return a.pri - b.pri;
                })
                self.tableLeft = tableLeft;
                self.putawaySectionVOS.forEach(item => {
                  let obj = {storageSectionId:item.storageSectionId};
                  self.old.push(obj);
                });
                self.storageId=item.storageId
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
        methods:{
          // 点击仓库名称下拉框
          testM(row) {
            this.tableData.forEach(item => {
              this.storage.forEach((item1,index) => {
                if(item.storageId == item1.storageId){
                  if(item.storageId == row.storageId){
                  }else{
                    item1.disabled = true;
                  }
                }
              })
            })
          },
          //仓库名称
          storageName(){
            var self = this;
            //根据商户id查询启用仓库列表。
            var paramData = {
              merchantId:0,//商户id
            }
            self._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version +'/findGrantStorageByUser',paramData)
              .then(function (response) {
                if (response.data.code == 0) {
                  self.storage = response.data.result;
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

          //库区名称
          initStock(row){
            // this.storageName();
            var self = this;
            var paramData = {
              storageId:row.storageId,
              type:1,
            }
            self._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version +'/findForStrategy',paramData)
              .then( res=> {
                if (res.data.code == 0) {
                  if(res.data.result.length == 0){
                    this.tableDataOne = res.data.result;
                  }else{
                    this.tableDataOne = res.data.result;
                    row.putawaySectionVOS.forEach(item => {
                      this.tableDataOne.forEach((item1,index) => {
                        if(item.storageSectionId ==  item1.storageSectionId){
                          this.tableDataOne.splice(index,1);
                        }
                      })
                    })
                  }

                } else {
                  this.$message({
                    message: res.data.result.msg,
                    type: 'warning'
                  });
                }
              })

              .catch(function (error) {
                console.log(error);
              });
          },

          //X号删除
          clickDelOne(index,row) {
            row.putawaySectionVOS.splice(index,1)
            this.tableDataOne.push(row)
          },

          //取消跳转路由
          delK(){
            this.$router.push({path: '/UpShelves'});
          },

          //仓库
          changeStorage(index,row) {
            row.putawaySectionVOS = [];
          },

          //追加列表
          addClickExpress: function () {
            if(this.updateData.strategyName == '系统默认上架策略'){ // 判断当前是否是系统默认
              this.isShow = true;
              this.isShowButton=true;
            }else{
              if(this.tableData.length<1){
                this.tableData.push({storageId: '',isShowKit1:true,putawaySectionVOS: []})
                this.disabled1=false;
              }else {
                if(this.tableData[this.tableData.length-1].isShowKit1==true){
                  return false
                }
                this.tableData.push({storageId: '',isShowKit1:true,putawaySectionVOS: []})
                this.disabled1=false;
                this.tableData.forEach(item => {
                  this.storage.forEach((item1,index) => {
                    if(item.storageId == item1.storageId){
                        item1.disabled = true;
                    }
                  })
                })
              }
            }
          },

          //保存按钮
          updateDataName(row,index){
            let arr=[];
            if(row.putawaySectionVOS.length==0){
              this.$message({
                type: 'warning',
                message: '请选择库区!'
              })
            }else{
              let obj = this.tableData[index];
              this.$set(this.tableData, index, obj);
              row.isShowKit1=false;
              row.disabled1=true;
              this.tableData.forEach((item)=>{
                arr.push(item.isShowKit1)
                this.isChangedata=arr
              })
            }
          },

          //修改按钮
          updateByIdMoney(row){
            this.tableData.forEach((item)=>{
              this.isChangedata.push(item.isShowKit1)
            })
            if( this.isChangedata.indexOf(true)<0) {
              row.isShowKit1=true;
              row.disabled1=false
            }

          },

          //操作箭头
          swapItems(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0]
            // arr.storeSort = index1
            return arr
          },

          //箭头向左
          upOne(arr, index) {
            if (arr.length > 1 && index !== 0) {
              this.tableLeft = this.swapItems(arr, index, index - 1)
            }
          },

          //箭头向右
          downOne(arr, index) {
            if (arr.length > 1 && index !== (arr.length - 1)) {
              this.tableLeft = this.swapItems(arr, index, index + 1)
            }
          },

          // 选择设置仓库复选框
          handleSelectionChange3(val) {
            let arr = []
            val.forEach(function (val) {
              val.storageSectionId
              arr.push({storageSectionId:val.storageSectionId,sectionName:val.sectionName})
            });
            this.strateg1 = arr
          },

          // 点击设置时的回显
          setOrder(rows,index) {
            this.initStock(rows);
            this.shelves=true
            this.tableData.forEach((item) => {
              item.putawaySectionVOS.forEach(item1 => {
                this.tableDataOne.splice(item1,1)
              })
            })
            let self = this
            self.indexTag = index
            self.shelves = true
            // tableDataOne strateg
            var timer = setTimeout(function () {
              if (self.strateg.length == 0) {
                self.$refs.multipleTable3.clearSelection();
              } else {
                var num = []
                self.gridData.forEach(function(item) {
                  rows.forEach(item1 => {
                    if ( item == item1) {
                    } else {
                      num.push(item)
                    }
                  })
                })
                num.forEach(r => {
                  self.$refs.multiplTable3.toggleRowSelection(self.gridData[r],true);
                });
                rows.forEach(r => {
                  self.$refs.multipleTable3.toggleRowSelection(r,true);
                });
              }
            },1)
          },

          //删除当前行
          cancelStrateData(row,index){
            this.tableData.splice(index,1);
              this.storage.forEach((item,index) => {
                if(item.storageId == row.storageId){
                  this.storage.splice(index,1);
                }
              })
            this.tableData.forEach(item => {
              this.storage.forEach((item1,index) => {
                if(item.storageId == item1.storageId){
                  if(item.storageId == row.storageId){
                  }else{
                    item1.disabled = true;
                  }
                }
              })
            })
          },

          //取消
          cancelNameData(row,index){
            this.tableData.splice(index,1);
          },

          //点击弹框确定按钮
          sureData() {
            this.strateg1.forEach(item => {
              this.tableData[this.indexTag].putawaySectionVOS.push(item);
            })
            /*  this.strateg1.forEach(item => {
              this.tableData[this.indexTag].putawaySectionVOS.push(item);
            })*/
            this.shelves = false;
            this.$nextTick(() => {
              this.tableData = this.tableData
            })
          },
          // 点击删除标签的时候

          clickDel(tableIndex,index) {
            this.tableData[tableIndex].putawaySectionVOS.splice(index,1)
          },

          //点击弹框确定按钮
          addAll(){
            var arr1 = [],arr2 = [],arr3=[],arr4=[]
            this.tableLeft.forEach(item=>{
              arr1.push(item.name);
            })
            arr2.push(arr1.indexOf('有货库位')+1);
            arr2.push(arr1.indexOf('空库位')+1);
            arr2.push(arr1.indexOf('新库位')+1);

            var self=this;
            let data= [];


            self.tableData.forEach(item=>{
              if(item.storageId != ''){
                arr3.push(item.storageId)
              }
              if(item.putawaySectionVOS.length == 0){
                arr4.push(undefined)
              }

            })

            if(arr3.length != self.tableData.length){
              this.$message({
                message:'请选择仓库',
                type: 'warning'
              });
             return false
           }

            if(arr4.includes(undefined)){
              this.$message({
                message:'请选择库区',
                type: 'warning'
              });
              return false
            }




            self.tableData.forEach((item)=>{
              delete item.isShowKit1
              item.putawaySectionVOS.forEach((item1)=>{
                delete item1.sectionName
              })
              item.putawaySectionBeanList=item.putawaySectionVOS
              delete item.putawaySectionVOS
            })
            if(self.tableData.length==0){
              self.tableData=''
            }

            var updateDataW = {
              merchantId:0,//商户id
              storageId:self.storageId,//仓库Id
              putawayStrategyId:self.putawayStrategyId,
              strategyName:self.updateData.strategyName,//策略名
              priArrayStr:arr2.join(','),
              goodsRule:self.updateData.goodsRule,//上架商品规则
              putawayStorageBeanList: JSON.stringify(self.tableData)
            }
            if(self.tableData.length==0){
              updateDataW.putawayStorageBeanList=''
            }
            self._post('com.edb01.erp.wms.service.api.WmPutawayStrategyService/' + this.version +'/updateStrategy',updateDataW)
              .then(function (res) {
                if (res.data.code == 0) {
                  self.$message({
                    type: 'success',
                    message: '修改成功!',
                  })
                  self.$router.push('/UpShelves')
                }else  if (res.data.code == 13000002) {
                  self.$message({
                    type: 'warning',
                    message: '策略名重复!',
                  })
                }else {
                  self.$message({
                    message: '修改失败，请重试！',
                    type: 'warning'
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        }
      }
    </script>
    <style>
      #UpdateNewStrategy{
        padding: 20px;
      }
    </style>
    <style scoped>
      .spanI{
        cursor: pointer;
      }

      .fontP{
        width: 250px;
        margin-left:20px;
        color: #cccccc;
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
      .xin {
        color: red;
        margin-left: 10px;
      }
      .fix-l .fix-2{
        width: 50px;height: 30px;
        margin-left: 40px;
      }
      .fix-l label {
        width: 120px!important;
        text-align: right;
      }
      .el-icon-circle-plus{
        font-size: 20px;
        text-align: left;
      }
      .el-icon-arrow-left{
        font-size: 18px;
        line-height: 30px;
        color:red;
      }
      .el-icon-arrow-right{
        font-size: 18px;
        line-height: 30px;
        color:blue;
      }
      .fix-l ul li{
        margin-left:50px;
        /*background-color: #DFC3F1;*/
        display: inline-block;
      }
      .indexS{
        color: #fff;
        margin-right: 5px;
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        line-height: 16px;
        background-color: #606266;
        text-align: center;
      }
      .liText{
        display: inline-block;
        background-color: #DFC3F1;
        text-align: center;
        width: 80px;
        height: 20px;
        line-height: 20px;
        border-radius: 5px;
      }
      .spanI{
        display: inline-block;
        color: #409EFF;
        cursor: pointer;
        transform:rotate(90deg);
        -ms-transform:rotate(90deg); 	/* IE 9 */
        -moz-transform:rotate(90deg); 	/* Firefox */
        -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
        -o-transform:rotate(90deg); 	/* Opera */
        vertical-align: bottom;
      }
      .spanI1{
        display: inline-block;
        color: #409EFF;
        cursor: pointer;
        transform:rotate(-90deg);
        -ms-transform:rotate(-90deg); 	/* IE 9 */
        -moz-transform:rotate(-90deg); 	/* Firefox */
        -webkit-transform:rotate(-90deg); /* Safari 和 Chrome */
        -o-transform:rotate(-90deg); 	/* Opera */
        vertical-align: bottom;}
      .save{
        position: fixed;
        bottom: 20px;
        right: 0;
        width: 100%;
        text-align: center;
      }
    </style>
