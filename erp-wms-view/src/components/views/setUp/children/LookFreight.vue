<!--贾南风 编辑运费模板-->
<template>
  <div id="lookFreight">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;margin-bottom: 10px;">
        <el-breadcrumb-item @click.native="backW"><span class="clickS">仓库档案</span></el-breadcrumb-item><!--:to="{path: '/warehouse'}"-->
        <el-breadcrumb-item @click.native="backUp"><span class="clickS">绑定快递</span></el-breadcrumb-item><!--:to="{name: 'bindExpress',params: {storageId: storageId,expressId: expressId}}"-->
        <el-breadcrumb-item>编辑运费模板</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="title">
      默认运费
    </div>
    <div class="box1">除指定运送地区外,其余地区运费采用默认运费</div>
    <div class="box">
      <el-radio-group  v-model="chargeType" @change="changeD(chargeType)">
        <el-radio :label="1">首重续重计费</el-radio>
        <el-radio :label="2">按件计费</el-radio>
      </el-radio-group>
    </div>
    <div v-if="chargeType == 1">
      <div class="box">
        <span class="box-span">默认运费：</span>
        <el-input   type="number" v-bind:class="{ styleColor: isDefaultWeight }"  title=" "  style="width: 100px;" @keyup.native="isNumber(1)" v-model="allData.defaultWeight" @blur="floatNum(allData.defaultWeight, 1)"></el-input>
        <span class="span">*</span><span>KG内，
    </span>
        <el-input  type="number" :class="{ styleColor: isDefaultFreightAmt }" title=" "  style="width: 100px;" @keyup.native="isNumber(2)" v-model="allData.defaultFreightAmt" @blur="floatNum(allData.defaultFreightAmt, 2)"></el-input>
        <span class="span">*</span><span>元，每增加</span>
        <el-input type="number"  :class="{ styleColor: isIncreaseWeight }" title=" " style="width: 100px;" @keyup.native="isNumber(3)" v-model="allData.increaseWeight" @blur="floatNum(allData.increaseWeight, 3)"></el-input>
        <span class="span">*</span><span>KG,费用增加</span>
        <el-input :class="{ styleColor: isIncreaseFreightAmt }" title=" " type="number" style="width: 100px;" @keyup.native="isNumber(4)" v-model="allData.increaseFreightAmt" @blur="floatNum(allData.increaseFreightAmt, 4)"></el-input>
        <span class="span">*</span><span>元</span>
      </div>
      <div class="box">
        <div class="black">
          <span class="box-span">运费附加费：</span>
          <el-input type="number" style="width: 100px;"  v-model="allData.surchargeAmt" title=" " @keyup.native="isNumber(5)" @blur="floatNum(allData.surchargeAmt, 5)"></el-input>
          <span style="margin-left: 5px;">元</span>
        </div>
        <div class="black">
          <span>舍入重量：</span>
          <el-input type="number" v-model="allData.roundoffWeight" style="width: 100px;" title=" " @keyup.native="isNumber(6)" @blur="floatNum(allData.roundoffWeight, 6)"></el-input>
          <span style="margin-left: 5px;">KG</span>
          <el-tooltip class="item" effect="dark" content="备注：快递公司与商家计算运费时允许超过的重量，例如：首重1kg，那么1.1kg也允许按1kg来进行计算运费。" placement="top-start">
            <i class="el-icon-question" style="margin-left:5px;font-size:16px;color:#ccc;cursor: pointer"></i>
          </el-tooltip>
        </div>
      </div>
      <div>
      </div>
      <div class="title" >
        指定地区运费
      </div>
      <div class="box1">指定地区运费(未指定的地区，则使用默认运费)</div>
      <div class="box1"> <span class="span1" style="color: #409EFF" @click="addTable()">添加运送地区模板</span></div>
      <div>
        <el-table
          :data="allData.tableData"
          border
          style="min-width: 1055px;width:1200px">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            align="left"
            label="运送地区"
            style="position: relative;padding-right: 33px;"
            >
            <template slot-scope="scope">
              <span v-if="scope.row.regionPlanName" style="display:inline-block;height:100%;margin: 15% 0">{{scope.row.regionPlanName}}</span>
              <span v-else style="display:inline-block;height:100%;margin: 15% 0">请选择运送地区</span>
             <div class="dot" @click="setKey(scope.row,scope.$index)">...</div>
            </template>
          </el-table-column>
          <el-table-column
            width="210"
            align="center"
            label=" 重量范围(kg)"
            >
            <template slot-scope="scope">
              <div style="height: 100%;padding: 10px 0;">
              <div  style="height: 30%;margin-bottom: 5px;white-space:nowrap;" :key="index" v-for="(item,index) in scope.row.wmFreightTmplGradientBeans">
                <div v-if="index == 0 && chargeType == 1">（默认，不区分重量）</div>
                <div v-else>
                <i class="el-icon-close" style="font-size: 16px;color: red;cursor: pointer;font-weight: bold;" @click="delD(scope.row.wmFreightTmplGradientBeans,index)"></i>
                <el-input type="number" style="width: 38%;" title=" " v-model="item.weightThan" :class="{styleColor: index == isClass && isMather == 'weightThan'}" :disabled="index>1 || index ==2" @keyup.native="isBig5(scope.$index,index)"  @blur="weightRanges(scope.row.wmFreightTmplGradientBeans,index,scope.$index,1)"></el-input>
                <span>~</span>
                <el-input type="number" style="width: 38%;" title=" " v-model="item.weightLess" :class="{styleColor: index == isClass && isMather == 'weightLess'}" @keyup.native="isBig6(scope.$index,index)"  @blur="weightRanges(scope.row.wmFreightTmplGradientBeans,index,scope.$index,2)"></el-input>
                  <span class="span">*</span>
                </div>
              </div>
                <div class="text-add" @click="addTr(scope.row.wmFreightTmplGradientBeans)">
                添加重量范围
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="111"
            prop="name"
            label="首重(kg)"
            >
            <template slot-scope="scope">
              <div class="no-box" v-for="(item,index) in scope.row.wmFreightTmplGradientBeans">
              <el-input type="number" @keyup.native="isBig1(scope.$index,index)" title=" " class="in-box" :class="{styleColor: index == isClass && isMather == 'startWeight'}"  v-model="item.startWeight" :key="index"  @blur="isFloat1(scope.$index,index)"></el-input>
                <span class="span">*</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="111"
            label="首费(元)"
            >
            <template slot-scope="scope">
              <div class="no-box" v-for="(item,index) in scope.row.wmFreightTmplGradientBeans">
              <el-input type="number" @keyup.native="isBig2(scope.$index,index)" title=" " :class="{styleColor: index == isClass && isMather == 'startAmt'}" v-model="item.startAmt" :key="index"  class="in-box" @blur="isFloat2(scope.$index,index)"></el-input>
              <span class="span">*</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="111"
            align="center"
            label="续重(kg)">
            <template slot-scope="scope">
              <div class="no-box" v-for="(item,index) in scope.row.wmFreightTmplGradientBeans">
              <el-input type="number" @keyup.native="isBig3(scope.$index,index)" title=" "  :class="{styleColor: index == isClass && isMather == 'continuedWeight'}" v-model="item.continuedWeight" :key="index"  class="in-box" @blur="isFloat3(scope.$index,index)"></el-input>
              <span class="span">*</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="111"
            align="center"
            label="续费(元)">
            <template slot-scope="scope">
              <div class="no-box" v-for="(item,index) in scope.row.wmFreightTmplGradientBeans">
              <el-input type="number" @keyup.native="isBig4(scope.$index,index)" title=" " :class="{styleColor: index == isClass && isMather == 'continuedAmt'}" v-model="item.continuedAmt" :key="index"  class="in-box" @blur="isFloat4(scope.$index,index)"></el-input>
              <span class="span">*</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="90"
            prop="name"
            align="center"
            label="操作"  >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteStore(allData.tableData,scope.$index)" style="color: red">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-if="chargeType == 2">
      <div class="box">
        <span>默认每件收取费用(元)：</span><el-input style="width: 100px;" type="number" class="login-form-input" :class="{styleColor: isClass == 'defaultPieceAmt'}" @keyup.native="isBig7" v-model="allData.defaultPieceAmt" @blur="isFloat5"></el-input><span class="span-box">*</span>
      </div>
      <div class="title">指定地区运费</div>
      <div class="box1">指定地区运费(未指定的地区，则使用默认运费)</div>
      <div class="box1"> <span class="span1" style="color:#409EFF" @click="addTable1()">添加运送地区模板</span></div>
      <div>
      <el-table
        :data="allData.tableData1"
        style="min-width: 1055px;width:1200px"
        border>
        <el-table-column
          align="center"
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          align="left"
          style="position: relative;padding-right: 33px;"
          label="运送地区">
          <template slot-scope="scope">
            <span v-if="scope.row.regionPlanName" style="line-height: 80px;padding-right: 33px;">{{scope.row.regionPlanName}}</span>
            <span v-else style="line-height: 80px;">请选择运送地区</span>
            <div class="dot1" @click="setKey(scope.row,scope.$index)">...</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="200px;"
          label="每件收费（元）">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.wmFreightTmplGradientBeans">
              <el-input   style="width: 120px;"  v-model="item.pieceAmt" :key="index" type="number" @change="floatNum1(item.pieceAmt,index,scope.$index)" :class="{styleColor: isClass == 'pieceAmt' && scope.$index == isIndex}"></el-input><span class="span-box">*</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="90"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="color:red" @click="delData(allData.tableData1,scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </div>
    <div style="width: 100%;text-align: center;margin-top: 20px;">
      <el-button @click="backUp">返 回</el-button>
      <el-button type="primary" @click="saveData()">保 存</el-button>
    </div>
    <!--选择地区-->
    <div>
      <el-dialog v-dialogDrag
        title="选择地区"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="400px">
        <el-tree
          id="tree"
          :data="data2"
          show-checkbox
          :default-expand-all="false"
          :default-expanded-keys="[2]"
          node-key="regionId"
          ref="tree"
          highlight-current
          style="height: 400px;overflow-y: scroll"
          :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关 闭</el-button>
    <el-button type="primary" @click="getCheckedNodes()">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { returnFloat } from '@/assets/js/validate'
  export default {
    props: ['storageId','expressId'],
    data() {
      return {
        isIndex: 50, // 当前索引
        // 校验
        isDefaultWeight: false,
        isDefaultFreightAmt: false,
        isIncreaseWeight: false,
        isIncreaseFreightAmt: false,
        isClass: 50,
        isMather: 50,
        isData: false,


        regionData: '', // 地区
        address: '', // 地址
        //isA: false,
        version: '1.0.0', // 版本号
        shop: [], // 用户之前存储过的数据
        chargeType: 1,// 方式
        //storageId: this.$router.history.current.params.storageId,
        //expressId: this.$router.history.current.params.expressId,
        allData: {
          chargeType: '',//计费方式
          defaultWeight: '', // 默认首重
          defaultFreightAmt: '', // 默认首重费用
          increaseWeight: '', // 默认续重
          increaseFreightAmt: '', // 默认续重费用
          surchargeAmt: '', // 运费附加费
          roundoffWeight: '', // 舍入重量
          tableData1: [], // 数据接收
          tableData: [], // 数据接收
          /*tableData1: [{
            wmFreightTmplGradientBeans: [
              {
              pieceAmt: '' // 选择首续重的时候默认为0
              }
            ],
            regionPlanName: '' // 地区Id 逗号分隔
          }],*/
          /*tableData: [{
            regionIdList: [],
            regionPlanName: '',
            wmFreightTmplGradientBeans: [
              {
                startWeight: '',//首重
                continuedWeight: '',//续重
                startAmt: '', //首费
                id: '',
                planId: '',
                continuedAmt: '', //续费
                weightThan: '',//重量大于
                weightLess: '',// 重量小于
                pri: ''
              }
            ]
          }]*/
        },
        allData1: {}, // 所有的数据
        tableData: [],
        dialogVisible: false, // 选择地区
        table_h: 0, // 高度
        data2: [], // 城市
        // 地区树
        defaultProps: {
          children: 'cityBeanList',
          label: 'regionName'
        }

      }
    },
    methods: {
      ////返回绑定快递
      backUp() {
          this.$emit('changeShow',{childrenShow: 3,storageId: this.storageId});
      },
      //返回仓库
      backW() {
        this.$emit('changeShow',{childrenShow: 19})
      },
      // 输入校验
      isNumber(num) {
        switch(num) {
          case 1:
            if(this.allData.defaultWeight < 1){
              this.allData.defaultWeight = '';
            }
            break;
          case 2:
            if(this.allData.defaultFreightAmt < 1){
              this.allData.defaultFreightAmt = '';
            }
            break;
          case 3:
            if(this.allData.increaseWeight < 1){
              this.allData.increaseWeight = '';
            }
            break;
          case 4:
            if(this.allData.increaseFreightAmt < 1){
              this.allData.increaseFreightAmt = '';
            }
            break;
          case 5:
            if(this.allData.surchargeAmt < 1){
              this.allData.surchargeAmt = '';
            }
            break;
          case 6:
            if(this.allData.roundoffWeight < 0){
              this.allData.roundoffWeight = '';
            }
            break;

        }
      },
      // 输入校验
      floatNum(val, num) {
        // 防止是空值
        if (!val) {
          return false;
        }
        var obj = returnFloat(val);
        switch (num) {
          case 1:
            this.allData.defaultWeight = obj;
            this.isDefaultWeight = false;
            break;
          case 2:
            this.allData.defaultFreightAmt = obj;
            this.isDefaultFreightAmt = false;
            break;
          case 3:
            this.allData.increaseWeight = obj;
            this.isIncreaseWeight =  false;
            break;
          case 4:
            this.allData.increaseFreightAmt = obj;
            this.isIncreaseFreightAmt = false;
            break;
          case 5:
            this.allData.surchargeAmt = obj;
            break;
          case 6:
            this.allData.roundoffWeight = obj;
            break;
        }
      },
      //首重
      isBig1(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startWeight < 1){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startWeight = '';
        }
      },
      //首费
      isBig2(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startAmt < 1){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startAmt = '';
        }
      },
      //续重
      isBig3(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedWeight < 1){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedWeight = '';
        }
      },
      //续费
      isBig4(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedAmt < 1){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedAmt = '';
        }
      },
      //起始范围
      isBig5(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightThan < 0){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightThan = '';
        }
      },
      //结束范围
      isBig6(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightLess < 1){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightLess = '';
        }
      },
      // // 按件计费 默认收取费用
      isBig7() {
        if(this.allData.defaultPieceAmt < 1){
          this.allData.defaultPieceAmt = ''
        }
      },
      //首重
      isFloat1(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startWeight){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startWeight = returnFloat(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startWeight);
        }
      },
      //首费
      isFloat2(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startAmt){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startAmt = returnFloat(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].startAmt);
        }
      },
      //续重
      isFloat3(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedWeight){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedWeight = returnFloat(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedWeight);
        }
      },
      //续费
      isFloat4(indexOne,index) {
        if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedAmt){
          this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedAmt = returnFloat(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].continuedAmt);
        }
      },
      // 按件计费 默认收取费用
      isFloat5(){
        if(this.allData.defaultPieceAmt){
          this.allData.defaultPieceAmt = returnFloat(this.allData.defaultPieceAmt)
        }
      },
      // 返回上一个页面
      bindBack() {
        this.$router.push({name: 'bindExpress',params: {storageId: this.storageId}})
      },
      changeD(val) {
        /*if (val == 2){
          this.allData.tableData1 = [{
            wmFreightTmplGradientBeans: [
              {
                pieceAmt: '' // 选择首续重的时候默认为0
              }
            ],
            regionPlanName: '' // 地区Id 逗号分隔
          }]
        }*/
      },
      // 失去焦点
      // 点击添加按件计费的表格
      addTable1() {
        if (this.allData.tableData1 == undefined) {
          this.allData.tableData1 = [{
            wmFreightTmplGradientBeans: [
              {
                pieceAmt: '' // 选择首续重的时候默认为0
              }
            ],
            regionPlanName: '' // 地区Id 逗号分隔
          }];
          //this.allData.tableData1.push({});
          //console.log(self.allData.tableData1);
        } else {
          for(var item of this.allData.tableData1){
           if(item.regionPlanName == ''){
             return false;
           }
           for(var item1 of item.wmFreightTmplGradientBeans){
             if(item1.pieceAmt == ''){
               return false;
             }
           }
          }
          this.allData.tableData1.push({
            wmFreightTmplGradientBeans: [
              {
                pieceAmt: '' // 选择首续重的时候默认为0
              }
            ],
            regionPlanName: '' // 地区Id 逗号分隔
          })
        }
      },
      // 按价计件的删除
      delData(row, index) {
        row.splice(index, 1)
        //console.log(row,99999999999);
      },
      // 重量范围的规范
      weightRanges(row, index,indexOne,num) {
        if(num == 1){
          if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightThan){
            this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightThan = returnFloat(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightThan);
          }
        }else if(num == 2){
          if(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightLess){
            this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightLess = returnFloat(this.allData.tableData[indexOne].wmFreightTmplGradientBeans[index].weightLess);
          }
        }
        if (row[index].weightThan && row[index].weightLess) {
          if (row[index].weightThan * 1 >= row[index].weightLess * 1) { // 当判断一个数值型大小，必须*1比较
            this.$message({
              message: '起始重量应该小于结束重量',
              type: 'warning'
            });
            row[index].weightLess = ''
          }
        }
        if(row[index].weightLess && row[index+1].weightThan){
          row[index+1].weightThan =  row[index].weightLess
        }
        if (index != 1) {
          if (row[index].weightThan && row[index - 1].weightLess) {
            if (row[index].weightThan != row[index - 1].weightLess) {
              this.$message({
                message: '下一阶重量段起始重量应该等于上一重量阶段结束重量',
                type: 'warning'
              });
              row[index].weightThan = ''
            }
          }
        }
      },
      // 点击保存按钮
      saveData() {
        this.isData = false;
        this.allData.chargeType = this.chargeType;
        if (this.allData.chargeType == 1) { // 1111111111111111111111111111111111111111111111111111111111111111111111111
          if (!this.allData.defaultWeight) {
            this.isDefaultWeight = true;
            return false;
          }
          if (!this.allData.defaultFreightAmt) {
            this.isDefaultFreightAmt = true;
            return false;
          }
          if (!this.allData.increaseWeight) {
            this.isIncreaseWeight = true;
            return false;
          }
          if (!this.allData.increaseFreightAmt) {
            this.isIncreaseFreightAmt = true;
            return false;
          }
          // 首费可以为空
          if (this.allData.tableData.length == 0) {
            delete this.allData1.wmFreightTmplGradientBeans
          } else  {
            // 遍历把所有的默认第一个为0
            this.allData.tableData.forEach((item,index) => {
                    item.pri =  index + 1;
                    item.wmFreightTmplGradientBeans.forEach((it,order) => {
                      if(order == 0) {
                        it.weightLess = 0;
                        it.weightThan = 0
                      }
                      it.pri = order + 1;
                    })
            });
            for (var i = 0; i < this.allData.tableData.length; i++) {
              if(this.allData.tableData[i].regionIdList && !this.allData.tableData[i].regionIds) {
                this.allData.tableData[i].regionIds = ''
                for (var item of this.allData.tableData[i].regionIdList){
                  this.allData.tableData[i].regionIds += item + ','
                }
                this.allData.tableData[i].regionIds = this.allData.tableData[i].regionIds.slice(0,-1)
              }
              if (!this.allData.tableData[i].regionIds) {
                this.$message({
                  message: '请选择运送地区',
                  type: 'warning'
                });
                return false
              }
              //console.log(this.allData.tableData[i].wmFreightTmplGradientBeans);
              this.allData.tableData[i].wmFreightTmplGradientBeans.forEach((item,index) => {
                //把默认为0的排除掉，0 == ''  true
                if ( index == 0 && !item.startWeight) {
                  this.$message({
                    message: '请填写首重',
                    type: 'warning'
                  });
                  this.isClass = index;
                  this.isMather = 'startWeight';
                  this.isData = true;
                }
                if ( index == 0 && !item.startAmt) {
                  this.$message({
                    message: '请填写首重费用',
                    type: 'warning'
                  });
                  this.isClass = index;
                  this.isMather = 'startAmt';
                  this.isData = true;
                }
                if ( index == 0 && !item.continuedWeight) {
                  this.$message({
                    message: '请填写续重',
                    type: 'warning'
                  });
                  this.isClass = index;
                  this.isMather = 'continuedWeight';
                  this.isData = true;
                }
                if ( index == 0 && !item.continuedAmt) {
                  this.$message({
                    message: '请填写首重续费',
                    type: 'warning'
                  });
                  this.isClass = index;
                  this.isMather = 'continuedAmt';
                  this.isData = true;
                }
                if(index == 0) {
                  //console.log(12346666666666);
                }else {
                  if(!item.weightThan) {
                    this.$message({
                      message: '请填写重量范围',
                      type: 'warning'
                    });
                    this.isMather = 'weightThan';
                    this.isClass = index;
                    this.isData = true;
                  }
                  if(!item.weightLess) {
                    this.$message({
                      message: '请填写重量范围',
                      type: 'warning'
                    });
                    this.isMather = 'weightLess';
                    this.isClass = index;
                    this.isData = true;
                  }
                }
                if (!item.startWeight) {
                  this.$message({
                    message: '请填写首重',
                    type: 'warning'
                  });
                  this.isData = true;
                  this.isClass = index;
                  this.isMather = 'startWeight';
                }
                if (!item.startAmt) {
                  this.$message({
                    message: '请填写首重费用',
                    type: 'warning'
                  });
                  this.isData = true;
                  this.isClass = index;
                  this.isMather = 'startAmt';
                }
                if (!item.continuedWeight) {
                  this.$message({
                    message: '请填写续重',
                    type: 'warning'
                  });
                  this.isData = true;
                  this.isClass = index;
                  this.isMather = 'continuedWeight';
                }
                if (!item.continuedAmt) {
                  this.$message({
                    message: '请填写首重续费',
                    type: 'warning'
                  });
                  this.isData = true;
                  this.isClass = index;
                  this.isMather = 'continuedAmt';
                }
              });

              // delete this.allData.tableData[i].regionPlanName;
            }
            if(this.isData){
              return false;
            }
            //console.log(this.allData.tableData,121212121212);
            this.allData1.wmFreightTmplGradientRegionBeanListJson  = JSON.stringify(this.allData.tableData);
          }
          this.allData1.expressId = this.expressId;
          this.allData1.storageId = this.storageId;
          this.allData1.expressId = this.expressId;
          this.allData1.chargeType = this.allData.chargeType;
          this.allData1.defaultWeight = this.allData.defaultWeight;
          this.allData1.defaultFreightAmt = this.allData.defaultFreightAmt;
          this.allData1.increaseWeight = this.allData.increaseWeight;
          this.allData1.increaseFreightAmt = this.allData.increaseFreightAmt;
          if (!this.allData.surchargeAmt) {
            this.allData1.surchargeAmt = ''
          }else{
            this.allData1.surchargeAmt = this.allData.surchargeAmt;
          }
          if (!this.allData.roundoffWeight) {
            this.allData1.roundoffWeight = '';
          }else{
            this.allData1.roundoffWeight = this.allData.roundoffWeight;
          }
          //console.log(this.allData1,898989);
        } else if (this.allData.chargeType == 2) { // 按件计费 22222222222222222222222222222222222222222222222222222222
          if (!this.allData.defaultPieceAmt){
            this.$message({
              message: '请填写每件收取费用',
              type: 'warning'
            });
            this.isClass = 'defaultPieceAmt';
            return false
          }

          this.allData1.storageId = this.storageId;
          this.allData1.expressId = this.expressId;
          this.allData1.chargeType = this.allData.chargeType;
          this.allData1.defaultPieceAmt = this.allData.defaultPieceAmt;
          if (this.allData.tableData1 == undefined || this.allData.tableData1.length == 0) {
            delete this.allData1.wmFreightTmplGradientBeans;
          } else {
            for (var i=0; i<this.allData.tableData1.length; i++) {
              //delete this.allData.tableData1[i].regionPlanName;
              this.allData.tableData1[i].pri = i + 1;
              // 当用户没有改变值点击保存，把之前的值赋值
               if (this.allData.tableData1[i].regionIdList && !this.allData.tableData1[i].regionIds) {
                 this.allData.tableData1[i].regionIds = '';
                 for (var item of this.allData.tableData1[i].regionIdList ) {
                   this.allData.tableData1[i].regionIds += item + ',';
                 }
                 this.allData.tableData1[i].regionIds = this.allData.tableData1[i].regionIds.slice(0,-1);
               }
              if (!this.allData.tableData1[i].regionIds) {
                this.$message({
                  message: '请选择运送地区',
                  type: 'warning'
                });
                return false
              }
              for (var item of this.allData.tableData1[i].wmFreightTmplGradientBeans){
                if (item.pieceAmt == '') {
                  this.$message({
                    message: '请填写每件收取费用',
                    type: 'warning'
                  });
                  this.isIndex = i;
                  this.isClass = 'pieceAmt';
                  return false
                }
              }
            }
            // console.log(self.allData);
            this.allData1.defaultPieceAmt = this.allData.defaultPieceAmt;
            this.allData1.wmFreightTmplGradientRegionBeanListJson = this.allData.tableData1;
            //console.log(self.allData1.wmFreightTmplGradientRegionBeanListJson,8999);
            //return false
            this.allData1.wmFreightTmplGradientRegionBeanListJson = JSON.stringify(this.allData1.wmFreightTmplGradientRegionBeanListJson);
            // console.log(self.allData1.wmFreightTmplGradientRegionBeanListJson,2);
          }
        }


        // 保存请求
        this._post('com.edb01.erp.wms.service.api.FreightTmplService/' + this.version + '/save',this.allData1)
          .then((res) => {
            if (res.data.success == true) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.backUp();// 保存成功返回上一个页面
            } else {
              this.$message({
                message: '保存失败，请重试',
                type: 'warning'
              });
            }
          })
          .catch(function(err) {
            console.log(err);
          })
      },
      // 添加运费模板
      addTable() {
        //console.log(this.allData.tableData);
        let interceptor = false;
        if(this.allData.tableData.length>0){
          this.allData.tableData.forEach(item => {
            if(!item.regionPlanName){
              interceptor = true;
            }
          })
        }
        if(interceptor){
          return
        }
        this.allData.tableData.push({ wmFreightTmplGradientBeans: [{}] })
      },
      // 点击添加弹出运送地区
      setKey(row, index) {
        //console.log(row.regionIdList);
        //console.log(this.allData.tableData);
        let self = this;
        self.dialogVisible = true;
        self.address = index;
        // 回显当前行的选中城市
        if (row.regionIdList) {
          let timer = setTimeout(function() {
            self.$refs.tree.setCheckedKeys(row.regionIdList);
          },1);
        }else{
          row.regionIdList = [];
          let timer1 = setTimeout(function () {
            self.$refs.tree.setCheckedKeys(row.regionIdList);
          })
        }
        if(self.chargeType == 1) { // 说明是首续重
          // 把所有的选中的置灰
          for (let item of self.data2) {  //regionIdList
            let length = 0;
            if(item.cityBeanList) {
              for (let item1 of item.cityBeanList) {
                for (let item2 of self.allData.tableData) {
                  for (let item3 of item2.regionIdList) {
                    if (item1.regionId == item3) {
                      length++;
                      if(item.cityBeanList.length == length){
                        item.disabled = true;
                      }
                      item1.disabled = true
                    }
                  }
                }
              }
            }
          }

          // 把当前选的置灰取消
          for (let item of self.data2) {
            let length = 0;
            if(item.cityBeanList) {
              for (let item1 of item.cityBeanList) {
                for (let item3 of row.regionIdList) {
                  if (item1.regionId == item3) {
                    length++;
                    if(item.cityBeanList.length == length){
                      item.disabled = false;
                    }
                    item1.disabled = false
                  }
                }
              }
            }
          }
          //console.log(self.allData.tableData);
        }else if(self.chargeType == 2) { // 按件计费
          // 把所有的选中的置灰
          for (let item of self.data2) {
            let length = 0;
            if(item.cityBeanList) { // 如果有ID
              for (let item1 of item.cityBeanList) {
                for (let item2 of self.allData.tableData1) {
                  for (let item3 of item2.regionIdList) {
                    if (item1.regionId == item3) {
                      length++;
                      if(item.cityBeanList.length == length){
                          item.disabled = true;
                      }
                      item1.disabled = true;
                      item1.check = true;
                    }
                  }
                }
              }
            }
          }

          // 把当前选的置灰取消
          for (let item of self.data2) {
            let length = 0;
            if(item.cityBeanList) {
              for (let item1 of item.cityBeanList) {
                  for (let item3 of row.regionIdList) {
                    if (item1.regionId == item3) {
                      length++;
                      if(item.cityBeanList.length == length){
                        item.disabled = false;
                      }
                      item1.disabled = false
                    }
                  }
              }
            }
          }
        }
      },
      // 删除每行
      deleteStore(row, index) {
        row.splice(index, 1)
      },
      // 每件收费改变时
      floatNum1(val,index,index1) {
        this.allData.tableData1[index1].wmFreightTmplGradientBeans[index].pieceAmt = returnFloat(val)
      },
      // 点击删除x
      delD(row, index) {
        row.splice(index, 1)
      },
      // 添加重量范围
      addTr(row) {
        if(row.length == 10){
          this.$message({
            message: '重量范围添加的太多了',
            type: 'warning'
          })
          return false
        }
        if(row.length == 1 && row[row.length - 1].startWeight && row[row.length - 1].continuedAmt && row[row.length - 1].continuedWeight && row[row.length - 1].startAmt ){
            row.push({})
        }else if (row.length >= 2 && row[row.length - 1].weightLess && row[row.length - 1].weightThan && row[row.length - 1].startWeight && row[row.length - 1].continuedAmt && row[row.length - 1].continuedWeight && row[row.length - 1].startAmt) {
          //console.log(row[row.length - 1].weightLess);
          //console.log(row[row.length - 1].weightThan);
            row.push({ weightThan: row[row.length - 1].weightLess })
          }
      },
      // 遍历选中的值
      getCheckedNodes() {
        let self = this;
        self.regionData = '';
        self.dialogVisible = false;
        var a = self.$refs.tree.getCheckedNodes();
        console.log(a,1);
        console.log(self.data2,2);
        if (self.chargeType == 1) { // 首重
            self.allData.tableData[self.address].regionIds = '';
          for (var item of a) {
            if (item.cityBeanList){
            }else{
              self.allData.tableData[self.address].regionIds += item.regionId + ','
            }
          }
          self.allData.tableData[self.address].regionIds = self.allData.tableData[self.address].regionIds.slice(0, -1);
          console.log(self.allData.tableData);
          for (var i = 0; i < a.length; i++) {
            if (a[i].hasOwnProperty('cityBeanList')) {
              self.regionData += a[i].regionName + ',';
              for (var k = 0; k < a.length; k++) {
                for (var j = 0; j < a[i].cityBeanList.length; j++) {
                  if (a[k] == a[i].cityBeanList[j]) {
                    a.splice(k, 1)
                  }
                }
              }
            } else {
              for (var f = 0; f < self.data2.length; f++) {
                if (i != 0 && a[i].regionPid == a[i-1].regionPid) {
                } else if (a[i].regionPid == self.data2[f].regionId) {
                  self.regionData += self.data2[f].regionName;
                  self.regionData += '('
                  for (var t = 0; t < a.length; t++) {
                    if (a[i].regionPid == a[t].regionPid) {
                      self.regionData += (a[t].regionName + ',')
                    }
                  }
                  self.regionData = self.regionData.slice(0, -1);
                  self.regionData += ')' + ','
                }
              }
            }
          }
          self.allData.tableData[self.address].regionIdList = [];
          for (var g = 0; g < a.length; g++) {
            if (a[g].cityBeanList) {
              for (var item of a[g].cityBeanList) {
                self.allData.tableData[self.address].regionIdList.push(item.regionId)
              }
            }else{
              self.allData.tableData[self.address].regionIdList.push(a[g].regionId)
            }
          }
          self.regionData = self.regionData.slice(0, -1)
          self.allData.tableData[self.address].regionPlanName = self.regionData;
          self.allData.tableData = self.allData.tableData;
          self.allData.tableData.push({});
          self.allData.tableData.splice(self.allData.tableData.length - 1, 1)
        } else if (self.chargeType == 2) { // 按件计费
          self.allData.tableData1[self.address].regionIds = '';
          console.log(a.length);
          for (var item1 of a) {
            if(item1.cityBeanList){
            }else{
                self.allData.tableData1[self.address].regionIds += item1.regionId + ','
            }
          }
          for (var i = 0; i < a.length; i++) {
            if (a[i].hasOwnProperty('cityBeanList')) {
              self.regionData += (a[i].regionName + ',');
              for (var k = 0; k < a.length; k++) {
                for (var j = 0; j < a[i].cityBeanList.length; j++) {
                  if (a[k] == a[i].cityBeanList[j]) {
                    a.splice(k, 1)
                  }
                }
              }
            } else {
              for (var f = 0; f < self.data2.length; f++) {
                if (i != 0 && a[i].regionPid == a[i-1].regionPid) {
                } else if (a[i].regionPid == self.data2[f].regionId){
                  self.regionData += self.data2[f].regionName;
                  self.regionData += '(';
                  for (var t = 0; t < a.length; t++) {
                    if (a[i].regionPid == a[t].regionPid) {
                      self.regionData += (a[t].regionName + ',')
                    }
                  }
                  self.regionData = self.regionData.slice(0, -1);
                  self.regionData += ')' + ',';
                }
              }
            }
          }
          self.allData.tableData1[self.address].regionIds = self.allData.tableData1[self.address].regionIds.slice(0, -1);
          self.allData.tableData1[self.address].regionIdList = [];
          for (var g = 0; g < a.length; g++) {
            if (a[g].cityBeanList) {
              for (var item of a[g].cityBeanList) {
                self.allData.tableData1[self.address].regionIdList.push(item.regionId);
              }
            }else{
              self.allData.tableData1[self.address].regionIdList.push(a[g].regionId);
            }
          }
          //console.log(self.regionData,2);
          self.regionData = self.regionData.slice(0, -1);
          // console.log(self.allData.tableData1[self.address].regionPlanName);
          self.allData.tableData1[self.address].regionPlanName = self.regionData;
          self.allData.tableData1.push({});
          self.allData.tableData1.splice(self.allData.tableData1.length - 1, 1);
          console.log(self.allData.tableData1);
        }
      }
    },
    created() {
      let self = this;
      // 运费模板返回数据
      self._post('com.edb01.erp.wms.service.api.FreightTmplService/' + self.version + '/select',{storageId : self.storageId,expressId:self.expressId})
        .then(function(res) {
          if (res.data.code == 0) {
            self.shop = res.data.result;
            if (JSON.stringify(self.shop) != "{}") { // 用户之前存储过数据
              self.allData = self.shop;
              if (self.shop.chargeType == 1) { // 首重 /*self.shop.wmFreightTmplGradientRegionBeanList && */
                if(self.shop.wmFreightTmplGradientRegionBeanList == undefined){ // 用户没有指定用户运费
                  self.allData.tableData = []; // 为空数组
                }else{
                  self.allData.tableData = self.shop.wmFreightTmplGradientRegionBeanList;
                  for (var item of self.allData.tableData) {
                    item.regionIds = '';
                    for (var item1 of item.regionIdList) {
                      item.regionIds += item1 + ','
                    }
                    item.regionIds = item.regionIds.slice(0, -1)
                  }
                }
                self.allData.tableData1 = [];// 赋值按件计费的表格数据
                //self.allData.tableData1.push({ pieceAmt: '', regionPlanName: ''})
              } else if (self.shop.chargeType == 2) { // 按件计费 /*self.shop.wmFreightTmplGradientRegionBeanList && */
                if(self.shop.wmFreightTmplGradientRegionBeanList == undefined){ // 用户没有指定用户运费
                  self.allData.tableData1 = []; // 为空数组
                }else{
                  self.allData.tableData1 = self.shop.wmFreightTmplGradientRegionBeanList;
                }
                self.chargeType = self.shop.chargeType;
                self.allData.tableData = [];// 赋值首重续重计费的表格数据
                //self.allData.tableData.push({ wmFreightTmplGradientBeans: [{}] })
              } else {
                self.allData.tableData = [];
                //self.allData.tableData.push({ wmFreightTmplGradientBeans: [{}] });
                self.allData.tableData1 = [];
                //self.allData.tableData1.push({ pieceAmt: '', regionPlanName: ''})
              }
            }
          } else {
            self.$message({
              message: res.data.msg, // 如果code为其他，弹出错误码
              type: 'warning'
            })
          }
        })
        .catch(function(err) {
          console.log(err)
        })
      // 省市
      self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/getProvAndCity')
        .then(function(res) {
          if (res.data.code == 0) {
            self.data2 = res.data.result
          } else {
            self.$message({
              message: res.data.msg, // 如果code为其他，弹出错误码
              type: 'warning'
            })
          }
        })
        .catch(function(err) {
          console.log(err)
        })
    }
  }
</script>
<style scoped>
  .clickS{
    font-weight: bold;
    cursor: pointer;
    color:#333333;
  }
  .styleColor,.el-input__inner{
    border: 1px solid red!important;
    border-radius: 5px;
  }
  .no-box{
    white-space: nowrap;
    display: inline-block;
  }
  .title{
    width: 100%;
    background: #F5F5F5;
    height:30px;
    padding: 10px;
    line-height: 15px;
    font-weight: bold;
  }
  .dot{
    position: absolute;
    height: 100%;
    width:22px;
    line-height: 350%;
    right: 0;
    bottom:0;
    background:#D2D2D2;
    font-size: 18px;
    cursor: pointer;
    padding:  0 3px;
    z-index: 3;
  }
  .dot1{
    position: absolute;
    height: 100%;
    right: 0;
    width:22px;
    bottom:0;
    z-index: 3;
    background:#D2D2D2;
    font-size: 18px;
    line-height: 350%;
    cursor: pointer;
    padding:  0 3px;
  }
  .span-box{
    font-size: 16px;
    margin-left: 5px;
    color: #FF0000;
  }
  .in-box{
    width: 80%;
    margin-bottom: 5px;
  }
  .text-add{
    position: absolute;
    z-index: 10;
    left: 5px;
    bottom: -6px;
    text-decoration: underline;
    color:#3D9BFE;
    cursor: pointer;
  }
  .span1 {
    text-decoration: underline;
    margin-left: 20px;
    cursor: pointer;
  }
  .box1 {
    margin: 15px 50px;
    color: #FF3B3B;
  }

  .box {
    margin: 25px 50px;
  }

  .span {
    color: red;
    margin: 0 5px;
  }

  .black {
    display: inline-block;
    margin-right: 158px;
  }

  .box-span {
    display: inline-block;
    width: 96px;
    text-align: right;
  }
</style>
<style>
  #lookFreight .el-input__inner::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }
  #lookFreight .el-input__inner[type="number"]{-moz-appearance:textfield!important;}
  #lookFreight .el-input--mini .el-input__inner {
    height: 28px;
  }
  #lookFreight .el-input__inner{
    padding: 0 5px;
  }
</style>
