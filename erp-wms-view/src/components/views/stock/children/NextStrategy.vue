<!--新增下架策略 秋香-->
<template>
  <div id="NextStrategy">
    <el-breadcrumb separator=">" class="col-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/downShelves' }">下架策略</el-breadcrumb-item>
      <el-breadcrumb-item>添加</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="white-space: nowrap;padding-left: 50px;">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="wrapper-one">
            <div class="fix">
              <div class="fix-l" ><label>策略名称：</label></div>
              <el-input v-model="addData.strategyName" placeholder="请输入策略名称" :maxlength="50" style="width:50%;width:200px;"></el-input><span class="xin">* </span>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="wrapper-one">
            <div class="fix">
              <div class="fix-l" ><label>出库单类型：</label></div>
             <!-- <el-select v-model="addData.soldoutTypes"  filterable placeholder="全部" style="width:50%;width:200px;">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>-->
              <select id="example-post" name="multiselect[]" multiple="multiple">
                <option  v-for="item in types" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="wrapper-one">
            <div class="fix">
              <div class="fix-l" >
                <ul>
                  <label>库位下架优先顺序：</label>
                  <li v-for="(item,index) in tableLeft"><span class="indexS">{{index + 1}}</span><i class="icon-down iconfont spanI" v-if="index !=0" @click="upOne(tableLeft,index)"></i><span class="liText">{{item.name}}</span><i class="icon-down iconfont spanI1" v-if="index !=tableLeft.length - 1" @click="downOne(tableLeft,index)"></i></li>
                </ul>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="wrapper-one">
            <div class="fix" style="margin-bottom: 10px">
              <div class="fix-l" ><label>可下架库区配置：</label></div>
              <span @click="addClickExpress()"><el-button type="primary" round>添加</el-button></span>
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
              <p class="cen-g">
                <el-select id="isSuit" v-model="scope.row.storageId" filterable placeholder="全部" :disabled="disabled1" @click.native="testM(scope.row)" @change="changeStorage(scope.$index,scope.row)"><!---->
                  <el-option
                    v-for="item in storage"
                    :key="item.storageId"
                    :label="item.storageName"
                    :disabled="item.disabled"
                    :value="item.storageId">
                  </el-option>
                </el-select>
              </p>
            </template>
          </el-table-column>

          <el-table-column label="库区名称" >
            <template slot-scope="scope">
              <div v-if="scope.row.isShowKit1">
                <el-badge  value="X"  class="item" style="margin:10px 10px 5px 0;cursor: pointer" v-for="(item,index) in  scope.row.soldoutStrategySectionBeanList" :key="index" @click.native="clickDelOne(index,scope.row)">
                  <el-button style="width:auto!important;" size="small">{{item.sectionName}}</el-button>
                </el-badge>
              </div>
              <div v-if="!scope.row.isShowKit1">
                <el-badge  class="item" style="margin:10px 10px 5px 0;cursor: pointer" v-for="(item,index) in  scope.row.soldoutStrategySectionBeanList" :key="index">
                  <el-button style="width:auto!important;" size="small">{{item.sectionName}}</el-button>
                </el-badge>
              </div>
              <div v-if="scope.row.isShowKit1">
                <p class="cen-g">
                  <i class="el-icon-circle-plus" @click="setOrder(scope.row,scope.$index);"></i><!---->
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180"  align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.isShowKit1">
                <el-button type="text" size="small" @click="addDataName(scope.row,scope.$index)">保存</el-button>
                <el-button type="text" size="small" style="color: red" @click="cancelNameData(scope.row,scope.$index)">取消</el-button>
              </div>
              <div v-if="!scope.row.isShowKit1">
                <el-button type="text" size="small" :disabled="isChangedata.indexOf(true)>-1" @click="updateByIdMoney(scope.row,scope.$index)">修改</el-button>
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
        version:'1.0.0',
        tableLeft: [
          {id:1,name: '近有效期先出'},
          {id:2,name: '先进先出'},
          {id:3,name: '拣货路径最优'},
          {id:4,name: '清空库位'},
        ],
        tabs: [
          { text: '近有效期先出' },
          { text: '先进先出' },
          { text: '拣货路径最优' },
          { text: '清空库位' },
        ],
        strateg1:[],//库区
        strateg:[],//库区
        isChangedata:[],//校验
        tableData:[],//仓库
        tableDataOne:[],//选择库区
        types:[{//仓库下拉
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
        }],
        isSuit: '',//是否套装
        shelves:false,//选择库区窗口
        gridData: [], // 店铺名称
        storage:[],//仓库
        disabled1: true,//禁用按钮
        indexTag: '',//当前行数据
        isShowKit1:false,//隐藏
        addData:{
          merchantId:'',//商户id
          strategyName:'',//策略名
          soldoutTypes:1,//出库单类型
          effectivePri:'',//近有效期先出
          queuePri:'',//队列 先进先出
          excellentPri:'',//拣货路径最优
          emptyPri:'',//清空库位
          SoldoutStrategyStorageBeanList:[],//仓库数据
        },//添加
        soldoutTypes:[],//类型
      }
    },
    mounted(){
      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      this.storageName();//仓库
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
      clickDelOne(index,row) {
        row.soldoutStrategySectionBeanList.splice(index,1);
        this.tableDataOne.push(row)

      },
      //库区名称
      initStock(row){
        var paramData = {
          storageId:row.storageId,
          type:2,
        }
        this._post('com.edb01.erp.wms.service.api.WmStorageSectionService/' + this.version +'/findForStrategy',paramData)
          .then( res=> {
            if (res.data.code == 0) {
              if(res.data.result.length == 0){
                this.tableDataOne = res.data.result;

              }else{
                this.tableDataOne = res.data.result;
                row.soldoutStrategySectionBeanList.forEach(item => {
                  this.tableDataOne.forEach((item1,index) => {
                    if(item.storageSectionId ==  item1.storageSectionId){
                      this.tableDataOne.splice(index,1);
                    }
                  })
                })
              }
            } else {
              this.$message({
                message: response.data.result.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
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
              response.data.result.forEach(item => {
                item.disabled = false;
              })
              self.storage = response.data.result;
              /*     let arr = response.data.result;
                   self.tableDataOne = [];
                   arr.forEach( (val) => {
                     val.sectionList.forEach((item) => {
                       self.tableDataOne.push(item)
                     })
                   });*/
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

      //取消跳转路由
     delK(){
       this.$router.push({path: '/DownShelves'});
     },

      //取消
     changeStorage(index,row) {
       row.soldoutStrategySectionBeanList = [];
     },

      //追加列表
     addClickExpress: function () {
       if(this.tableData.length<1){
         this.tableData.push({storageId: '',isShowKit1:true,soldoutStrategySectionBeanList: []})
         this.disabled1=false;
       }else {
         if(this.tableData[this.tableData.length-1].isShowKit1==true){
           return false
         }
         this.tableData.push({storageId: '',isShowKit1:true,soldoutStrategySectionBeanList: []})
         this.disabled1=false;

       }
     },

      //保存按钮
      addDataName(row){
       let arr=[];
        if(row.soldoutStrategySectionBeanList.length==0){
          this.$message({
            type: 'warning',
            message: '请选择库区!'
          })
        }else{
          row.isShowKit1=false;
          this.disabled1=true;
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
        if(this.isChangedata.indexOf(true)<0) {
          row.isShowKit1=true;
          this.disabled1=false;
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
       let arr = [];
       val.forEach(function (val) {
         val.storageSectionId
         arr.push({storageSectionId:val.storageSectionId,sectionName:val.sectionName})
       });
        this.strateg1 = arr;
      },

      // 点击设置时的回显
      setOrder(rows,index) {
        this.shelves=true;
        this.initStock(rows);
       //this.tableDataOne
        this.tableData.forEach((item) => {
         item.soldoutStrategySectionBeanList.forEach(item1 => {
           this.tableDataOne.splice(item1,1)
         })
        })
        let self = this
        self.indexTag = index;
          self.shelves = true;
       // tableDataOne strateg
          var timer = setTimeout(function () {
            if (self.strateg.length == 0) {
              self.$refs.multipleTable3.clearSelection();
            } else {
              var num = [];
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
        this.storage.forEach(item => {
          if(item.storageId == row.storageId){
            item.disabled = false;
          }
        })
        //this.storage.push(row);
      },

        //取消
      cancelNameData(row,index){
        let arr=[];
        this.tableData.splice(index,1);
        this.tableData.forEach((item)=>{
          arr.push(item.isShowKit1)
          this.isChangedata=arr
        })
      },

      //点击弹框确定按钮
      sureData() {
        this.strateg1.forEach(item => {
          this.tableData[this.indexTag].soldoutStrategySectionBeanList.push(item);
        })
        this.shelves = false;
        this.$nextTick(() => {
          this.tableData = this.tableData
        })
      },

      // 点击删除标签的时候
      clickDel(tableIndex,index) {
        this.tableData[tableIndex].soldoutStrategySectionBeanList.splice(index,1)
      },

      //添加
      addAll(){
        var arr = '';
        this.tableLeft.forEach((item) => {
          arr += item.id + ','
        })
        arr.slice(0,-1)
        var self=this;
        if(self.tableData.length==0){
          self.$message({
            message: '请选择库区！',
            type: 'warning'
          })
          return false;
        }
        let isOkO=false
        self.tableData.forEach((item)=>{
           if(item.soldoutStrategySectionBeanList.length==0){
             isOkO=true
             self.$message({
               message: '请选择库区！',
               type: 'warning'
             })
           }
        })
        if( isOkO){
          return false;
        }
        if ($('#example-post').val().length == self.types.length) {
          var value = []
          for (var item of self.types){
            item.value = item.value
            item.label = item.label
            value.push(item.value)
          }
          self.addData.soldoutTypes= value
        }else {
          self.addData.soldoutTypes = $('#example-post').val();
        }

        var addDataW = {
          merchantId:0,//商户id
          strategyName:self.addData.strategyName,//策略名
          soldoutTypes:self.addData.soldoutTypes,//出库单类型
          priArrayStr:arr.slice(0,-1),
          SoldoutStrategyStorageBeanList:JSON.stringify(self.tableData),
        }
        self._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/'+this.version+'/saveSoldoutStrategy',addDataW)
          .then(function (res) {
            if (res.data.code == 0) {
              self.$message({
                type: 'success',
                message: '保存成功!',
              })
              self.$router.push('/DownShelves')
            }else  if (res.data.code == 9528) {
              self.$message({
                message: '请输入策略名称！',
                type: 'warning'
              });
            }else  if (res.data.code == 13000002) {
              self.$message({
                type: 'warning',
                message: '策略名重复!',
              })
            }
            else {
              self.$message({
                message: '保存失败，请重试！',
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
<style scoped>
  .spanI{
    cursor: pointer;
  }
  #NextStrategy{
    padding: 20px;
  }
  .fontP{
    width: 250px;
    margin-left: 20px;
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
  .fix-l ul li{
    margin-left:50px;
    /*background-color: #DFC3F1;*/
    display: inline-block;
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
    vertical-align: bottom;
  }
  .save{
    position: fixed;
    bottom: 20px;
    right: 0;
    width: 100%;
    text-align: center;
  }

</style>
<style>

</style>
