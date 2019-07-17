<!--下架策略组件 樊虎-->
<template>
  <div id="bindStrayegy">
    <p style="text-align:center;border-bottom:1px solid #ccc;padding-bottom:10px;">{{titleName}}策略</p>
    <el-button style="margin-bottom:10px;" type="primary" @click="addStrategy">+ 添加行</el-button>
    <!--表格区域-->
    <el-table
      border
      :max-height="t_height"
      :data="tableData"
      @row-click="handleRow"
    >
      <el-table-column
        align='center'
        label="序号"
        type="index"
        width="55">
      </el-table-column>
      <el-table-column
        prop="goodsCode"
        align='center'
        min-width=''
        label="策略名称">
        <template slot-scope="scope">
          <el-select v-if="scope.row.edit" v-model="scope.row.soldoutStrategyId" @change="changeChannelStrategy(scope.row.soldoutStrategyId)" placeholder="">
            <el-option
              v-for="item in nextStrategyList"
              :key="item.soldoutStrategyId"
              :label="item.strategyName"
              :value="item.soldoutStrategyId">
            </el-option>
          </el-select>
          <span v-else>{{scope.row.strategyName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align='center'
        min-width=''
        label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.edit">
            <el-button
              type="text"
              @click="handleSave(scope.$index, scope.row)">保存
            </el-button>
            <el-button
              type="text"
              @click="handleCancel(scope.$index, scope.row)">取消
            </el-button>
          </div>
          <div v-else>
            <el-button
              type="text"
              @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
            <el-button
              type="text"
              style="color:red;"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--策略详情-->
    <div class="strategy-detail" v-if="tableData.length>0">
      <h5 style="font-weight:bold;">策略详情</h5>
      <div>
        <span style="margin-right:100px;">策略名称：{{strategyName}}</span>
        <span>出库单类型：{{soldoutTypeName}}</span>
      </div>
      <div>
        <p>库位下架优先顺序：<span v-if="downOrder1">1、{{downOrder1}}  2、{{downOrder2}}  3、{{downOrder3}}  4、{{downOrder4}}</span> </p>
      </div>
      <div>
        <p><span style="float:left;">可下架仓库：</span><span style="width: 575px;display: inline-block;word-break: break-all;">{{downShelf}}</span></p>
      </div>
      <div>
        <p><span style="float:left;">可下架库区：</span><span style="width: 575px;display: inline-block;word-break: break-all;">{{downArea}}</span></p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      type: String,
      goodsId:String
    },
    data() {
      return {
        titleName:'',//上下架
        tableData:[],//表格数据
        t_height:205,
        version:'1.0.0',
        nextStrategyList:[],//策略集合
        oldSoldoutStrategyId:'',//修改之前的策略id
        isEditing:false,//编辑状态
        //详细展示
        strategyName:'',//策略名称
        soldoutTypeName:'',//出库单类型
        downOrder1:'',//下架顺序
        downOrder2:'',
        downOrder3:'',
        downOrder4:'',
        downShelf:'',//下架仓库
        downArea:'',//下架库区
      }
    },
    beforeMount() {

    },
    watch:{
      //策略id改变即刷新数据
      goodsId:function (a,b) {
        if(!b){
          this.renderInit();
        }
      }
    },
    mounted(){
      this.titleName=this.type==1?'上架':'下架';
      this.renderInit();
    },
    methods:{
      //显示策略详情
      showDetail(row){
        this.strategyName=row.strategyName;
        var soldoutTypeName = [];
        if(row.soldoutTypeList.indexOf(1)>-1){
          soldoutTypeName.push('采购退货');
        }
        if(row.soldoutTypeList.indexOf(2)>-1){
          soldoutTypeName.push('调拔出库');
        }
        if(row.soldoutTypeList.indexOf(3)>-1){
          soldoutTypeName.push('其他出库');
        }
        if(row.soldoutTypeList.indexOf(4)>-1){
          soldoutTypeName.push('订单出库');
        }
        this.soldoutTypeName = soldoutTypeName.join(',');
       /* switch(row.soldoutType){
          case 1:
            this.soldoutTypeName='采购退货';
            break;
          case 2:
            this.soldoutTypeName='调拔出库';
            break;
          case 3:
            this.soldoutTypeName='其他出库';
            break;
          case 4:
            this.soldoutTypeName='订单出库';
            break;
        };*/
        var _this=this;
        function orderFn(item,name){
          switch(item){
            case 1:
              _this.downOrder1=name;
              break;
            case 2:
              _this.downOrder2=name;
              break;
            case 3:
              _this.downOrder3=name;
              break;
            case 4:
              _this.downOrder4=name;
              break;

          }
        }
        orderFn(row.queuePri,'先进先出');
        orderFn(row.excellentPri,'拣货路径最优');
        orderFn(row.effectivePri,'近有效期先出');
        orderFn(row.emptyPri,'清空库位');

        this.downShelf = row.storageNames;
        this.downArea = row.sectionNames;
        /*this.downShelf=row.soldoutStrategyStorageVO.storageName;
        let str='';
        row.soldoutStrategyStorageVO.wmSoldoutStrategySectionVOList.forEach((item,i)=>{
          if(item.storageSectionNameList){
            str+=item.storageSectionNameList+',';
          }
        })
        this.downArea=str.slice(0,-1);*/
      },
      //点击当前行
      handleRow(row){
        if(this.isEditing){
          return false;
        }else{
          this.showDetail(row)
        }
      },
      //策略select改变
      changeChannelStrategy(row){
        this.nextStrategyList.forEach(item =>{
          if(item.soldoutStrategyId == row){
            this.showDetail(item);
          }
        })
      },
      //添加赠品策略行
      addStrategy(){
        if(this.isEditing){
          this.$message({
            message: '请先保存或取消当前编辑方案。',
            type: 'warning'
          });
          return false;
        }else{
          this.nextStrategyFn('',()=>{
            this.isEditing=true;
            this.tableData.unshift({
              edit:true,
              isAdd:true
            });
          })
        }
      },
      //赠品策略下拉集合
      nextStrategyFn(param,callback){
        this._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/' + this.version + '/findSoldoutStrategyBymerchantId',{
          soldoutStrategyId:param?param:'',
          goodsId:this.goodsId
        }).then((response)=>{
          if(response.data.success){
            callback();
            this.nextStrategyList=response.data.result;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //初始化详情
      initDetail(){
        this.strategyName='';
        this.soldoutTypeName='';
        this.downOrder1='';
        this.downOrder2='';
        this.downOrder3='';
        this.downOrder4='';
        this.downShelf='';
        this.downArea='';
      },
      //赠品策略table集合
      renderInit(){
        this.initDetail();
        this._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/' + this.version + '/soldoutStrategyListInGoods',{
          goodsId:this.goodsId
        }).then((response)=>{
          if(response.data.success){
            this.tableData = response.data.result.map(v => {
              this.$set(v, 'edit', false)
              return v
            })
            if(this.tableData.length>0){
              this.showDetail(this.tableData[0]);
            }
            this.isEditing=false;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //保存
      handleSave(index,row){
        if(row.soldoutStrategyId){
          //添加
          if(row.isAdd){
            this._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/' + this.version + '/saveSoldOutStrategyGoods',{
              goodsId:this.goodsId,
              soldoutStrategyId:row.soldoutStrategyId
            }).then((response)=>{
              if(response.data.success){
                this.renderInit();
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          }else{
            //修改
            this._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/' + this.version + '/updateSoldOutStrategyGoods',{
              goodsId:this.goodsId,
              newSoldoutStrategyId :row.soldoutStrategyId,
              oldSoldoutStrategyId:this.oldSoldoutStrategyId
            }).then((response)=>{
              if(response.data.success){
                this.renderInit();
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          }
        }else{
          this.$message({
            message:'下架策略不能为空',
            type: 'warning'
          });
        }
      },
      //取消
      handleCancel(index,row){
        this.renderInit();
      },
      //修改
      handleEdit(index,row){
        if(this.isEditing){
          this.$message({
            message: '请先保存或取消当前编辑方案。',
            type: 'warning'
          });
          return false;
        }else{
          this.nextStrategyFn(row.soldoutStrategyId,()=>{
            this.isEditing=true;
            row.edit=true;
            this.oldSoldoutStrategyId=row.soldoutStrategyId;
          })
        }
      },
      //删除
      handleDelete(index,row){
        this.$confirm('是否确认删除当前策略？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this._post('com.edb01.erp.wms.service.api.WmSoldoutStrategyService/' + this.version + '/deleteSoldOutStrategyGoods',{
            goodsId:this.goodsId,
            soldoutStrategyId:row.soldoutStrategyId
          }).then((response)=>{
            if(response.data.success){
              this.renderInit();
            }else{
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {
        });
      }
    }
  }
</script>
<style scoped>
.strategy-detail{
  background:#F2F2F2;margin-top:10px;padding:10px;
}
.strategy-detail>div{
  margin-top:20px;
}
</style>

