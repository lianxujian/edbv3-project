<!--会员详情 佩玖-->
<template>
  <div id="Memberdetaimport">
    <!--导航-->
    <div class="pTop">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/MemberList' }">会员列表</el-breadcrumb-item>
        <el-breadcrumb-item>会员详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="col-nav" style="margin:10px 0;">
      <span style="line-height:2.5em">基本信息</span>
      <el-button v-show="sourceshow==0" @click="settings()" type="text" size="small">保存</el-button>
      <el-button v-show="sourceshow==2" @click="sourceshow=0" type="text" size="small">编辑</el-button>
    </div>
    <!--搜索区-->
    <div style="width: 750px;margin-bottom: 20px">
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <span>买家ID：</span>
            <span v-show="sourceshow==2||sourceshow==1">{{ecCustomerId}}</span>
            <el-input :maxlength="50" v-show="sourceshow==0" v-model="ecCustomerId" placeholder=""></el-input>

          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple"><span>平台：</span>
            <span v-show="sourceshow==2||sourceshow==1">{{ecname}}</span>
            <el-select v-show="sourceshow==0" v-model="ecId" filterable placeholder="全部">
              <el-option
                v-for="item in orderTypeNo"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple"><span>会员来源：</span>
            <span v-show="sourceshow==2||sourceshow==1">{{ sourcees}}</span>
            <el-select v-show="sourceshow==0" v-model="source" filterable placeholder="全部">
              <el-option
                v-for="item in soureoption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10">
          <div class="grid-content bg-purple"><span>首次消费时间：</span>
            <span v-show="sourceshow==2||sourceshow==1">{{ startTime | normalTime(6)}}</span>

            <el-date-picker
              @change="methodsS"
              type="datetime"
              v-show="sourceshow==0"
              v-model="startTime"
              :picker-options="pickerOptions1"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple"><span>最后消费时间：</span>
            <span v-show="sourceshow==2||sourceshow==1">{{ endTime | normalTime(6) }}</span>

            <el-date-picker
              @change="methodsM"
              v-show="sourceshow==0"
              type="datetime"
              v-model="endTime"
              :picker-options="pickerOptions2"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple"><strong></strong></div>
        </el-col>

      </el-row>
    </div>


    <!--收货人信息-->
    <div class="col-nav" style="margin:10px 0;">
      <span style="line-height:2.5em">收货人信息</span>
    </div>
    <div class="pDown" style="width:1200px">
      <div class="col-nav" style="margin:10px 0;">
        <ul>
          <li @click="addData()"><span>添加</span></li>
          <li @click="setDefault()"><span>设为默认</span></li>
        </ul>
      </div>

      <el-table :data="tableData1" highlight-current-row
                @current-change="handleSelectionChangesd" id="tableH"
                border
                max-height="220" style="width: 100%">
        <el-table-column
          label="序号"
          align="center"
          type="index"
        >
        </el-table-column>

        <el-table-column label="收货人" min-width="100">
          <template slot-scope="scope">
            <span style="color:red;margin-left: -65px " v-show="scope.row.defaultFlag==true">默认</span>
            <el-input :maxlength="10" v-if="tableData1.length-1 == scope.$index && scope.row.customerId == ''"
                      v-model="scope.row.receiveres"></el-input>
            <span class="cen-g" v-else style="margin-left:20px">{{ scope.row.receiver }}</span>
          </template>
        </el-table-column>

        <el-table-column label="手机号" min-width="100">
          <template slot-scope="scope">
            <el-input :maxlength="11" v-if="tableData1.length-1 == scope.$index && scope.row.customerId == ''"
                      v-model="scope.row.mobiles" @blur="isTrue(scope.row)"></el-input>
            <span class="initP-g" v-else>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>

        <el-table-column label="收货地址" width="550px">
          <template slot-scope="scope">
            <el-select v-if="tableData1.length-1 == scope.$index && scope.row.customerId == ''"
                       v-model="scope.row.provinceId" placeholder="请选择省" @change="two(scope.row)"
                       style="width: 100px!important;">
              <el-option
                v-for="item in province"
                :key="item.regionId"
                :label="item.regionName"
                :value="item.regionId">
              </el-option>
            </el-select>
            <el-select v-if="tableData1.length-1 == scope.$index && scope.row.customerId == ''"
                       v-model="scope.row.cityId" placeholder="请选择市" @change="three(scope.row)"
                       style="width: 100px!important;">
              <el-option
                v-for="item in city"
                :key="item.regionName"
                :label="item.regionName"
                :value="item.regionId">
              </el-option>
            </el-select>
            <el-select v-if="tableData1.length-1 == scope.$index && scope.row.customerId == ''"
                       v-model="scope.row.regionId" placeholder="请选择区" style="width: 100px!important;">
              <el-option
                v-for="item in district"
                :key="item.regionId"
                :label="item.regionName"
                :value="item.regionId">
              </el-option>
            </el-select>
            <el-input v-if="tableData1.length-1 == scope.$index && scope.row.customerId == ''" placeholder="请输入街道"
                      :maxlength="100" v-model="scope.row.consigneeAddr"
                      style="width:180px!important;"></el-input>
            <SpA class="cen-g" v-else>{{ scope.row.address }}</SpA>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button v-if="tableData1.length-1 == scope.$index && scope.row.customerId == ''"
                       @click="savedataes(scope.row)" type="text" size="small">保存
            </el-button>
            <el-button v-if="tableData1.length-1 == scope.$index && scope.row.customerId == ''"
                       @click="Deletedata(scope.row,scope.$index)" type="text" size="small">取消
            </el-button>
            <el-button v-show="scope.row.defaultFlag==true" @click="unsetDefault (scope.row)" type="text" size="small">
              取消默认
            </el-button>
            <el-button v-show="scope.row.Delbtn == 1 && scope.row.source==2 && tableData1.length>1 "
                       @click="handleDelete(scope.row,scope.$index)" type="text" size="small">删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>
    <!--消费店铺信息-->
    <div class="col-nav" style="margin:10px 0;">
      <span style="line-height:2.5em">消费店铺信息</span>
    </div>
    <div class="pDown">
      <el-table :data="tableData2" border style="width: 100%">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="55px"
        >
        </el-table-column>
        <el-table-column label="店铺名称" min-width="110" align="center" prop="storeName">
        </el-table-column>
        <el-table-column label="消费次数" min-width="110" align="center" prop="buyQty">
        </el-table-column>
        <el-table-column label="消费总金额（元）" min-width="110" align="center" prop="buyAmt">
        </el-table-column>
      </el-table>

    </div>
    <!--消费商品信息-->
    <div class="col-nav" style="margin:10px 0;">
      <span style="line-height:2.5em">消费商品信息</span>
    </div>
    <div class="pDown">
      <el-table :data="tableData3" border style="width: 100%">
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="55px"
        >
        </el-table-column>
        <el-table-column label="商品条码" min-width="110" align="center" prop="goodsCode">
        </el-table-column>
        <el-table-column label="商品名称" min-width="110" align="center" prop="goodsName">
        </el-table-column>
        <el-table-column label="购买总数" min-width="110" align="center" prop="goodsQty">
        </el-table-column>
        <el-table-column label="消费总金额" min-width="110" align="center" prop="buyAmt">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pickerOptions2: {//日期选项条件置灰
          disabledDate(time) {
            let curDate = (new Date()).getTime();
            let three = 90 * 24 * 3600 * 1000;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          },
        },
        pickerOptions1: { //日期选项条件置灰
          disabledDate(time) {
            let curDate = (new Date()).getTime();
            let three = 90 * 24 * 3600 * 1000;
            let threeMonths = curDate - three;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
        version: '1.0.0',
        table_h: 0,
        cityId: '',  //城市id
        startTime: '', //首次消费时间
        endTime: '', //最后消费时间
        provinceId: '', //省id
        tableData1: [], //新增会员
        tableData2: [], //消费店铺信息
        tableData3: [],//消费商品信息
        consigneeAddr: '', //街道
        refuseClick: false,  //审核拒绝弹框
        optionsStock: [{value: '', label: '全部'}],//仓库下拉
        storageId: '',//仓库
        ecname: '', //平台名称
        ecId: '', //平台名称对应id
        ecCustomerId: '', //买家id
        customerId: '', //主键id
        lastBuyTime: '',//最后一次消费时间
        receiveId: '', //地址id
        orderTypeNo: [{value: "", label: "全部"}], //平台枚举
        soureoption: [  //会员来源
          {
            value: '',
            label: '全部'
          }, {
            value: 1,
            label: '订单'
          }, {
            value: 2,
            label: '导入'

          }],
        province: [{value: '', label: '全部'}], // 省
        city: '', //市枚举
        district: '', //区枚举
        source: '', //来源
        regionId: '',  //区
        sourcees: '', //会员来源
        sourceshow: 1, //来源显示判断
        regionName: '', //省名
        regionNames: '', //市名
        regionNamesd: '',//区名
        tableData: [],//表格数据


      }
    },
    mounted() {
      this.platformdata();//初始和仓库下拉
      this.initMemberes(); //回显
      this.price();//请求省

      //表格高度自适应
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 420);
      });
    },
    methods: {
      //手机号校验
      isTrue(row) {
        let regT = /^[0-9]+.?[0-9]*$/;
        if (!regT.test(row.mobiles)) {
          row.mobiles = ''
        }
      },
      // 起始时间
      methodsS() {
        if (this.endTime) {
          if (this.startTime > this.endTime) {
            this.endTime = '';
          } else {
            //this.queryData.endTime == ''
          }
        }
      },
      // 结束时间
      methodsM() {
        if (this.startTime) {
          if (this.startTime > this.endTime) {
            this.endTime = '';
          } else {
            //this.queryData.endTime == ''
          }
        } else {

        }
        /* console.log(this.queryData.startTime > this.queryData.endTime);
         console.log(this.queryData.endTime);*/
      },
      // 中国标准时间转换为时间戳
      dateToMs(date) {
        let result = new Date(date).getTime();
        return result;
      },
      //初始化平台下拉列表
      platformdata() {
        this._post('com.edb01.erp.mdata.service.api.EcService/' + this.version + '/getEcBeanList').then(function (res) {
          let arr = res.data.result;
          arr.forEach(function (val) {
            this.orderTypeNo.push({value: val.ecId, label: val.ecName})
          }.bind(this));
        }.bind(this));
      },
      //保存
      settings() {
        console.log(this.startTime,11111111);
        if (this.startTime != null) {
          this.startTime = this.dateToMs(this.startTime);
        }else {
          this.startTime=''
        }
        if (this.endTime != null) {
          this.endTime = this.dateToMs(this.endTime);
        }else {
          this.endTime=''
        }

        if (this.source == '') {
          this.$message({
            message: '来源不能是全部，只能是其中之一',
            type: 'warning'
          });
          return false
        }


        let data = {
          ecBuyRptId: this.$route.params.id,
          ecId: this.ecId,
          ecCustomerId: this.ecCustomerId,
          source: this.source,
          lastBuyTime:this.endTime ,
          firstBuyTime:this.startTime
        }

        this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/customerUpdate', data).then(function (res) {
          if (res.data.success) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.$router.push("/MemberList")
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }

        }.bind(this));



      },
      //单选
      handleSelectionChangesd(val) {
        if (val) {
          this.receiveId = val.receiveId
        }

      },
      //默认设置
      setDefault() {
        if (this.receiveId == '') {
          this.$message({
            message: '请选择需要设为默认的收货人信息！',
            type: 'warning'
          });

        } else {
          this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/setDefaultAddress', {
            receiveId: this.receiveId,
            flag: true
          }).then(function (res) {
            if (res.data.success) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.initMemberes();
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }

          }.bind(this));
        }


      },
      //取消默认设置
      unsetDefault(row) {
        this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/setDefaultAddress', {
          receiveId: row.receiveId,
          flag: false
        }).then(function (res) {
          if (res.data.success) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.initMemberes();
          } else {
            this.$message({
              message: res.data.msg,
              type: 'waring'
            });
          }

        }.bind(this));

      },
//      取消
      Deletedata(row, index) {
        this.tableData1.splice(index, 1);
      },
      //删除
      handleDelete(row) {
        this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/delAddress', {receiveId: row.receiveId}).then(function (res) {
          if (res.data.success) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.initMemberes();
          } else {
            this.$message({
              message: res.data.msg,
              type: 'waring'
            });
          }

        }.bind(this));
        this.receiveId = ''
      },
//      保存新增收货人信息
      savedataes(row) {

        if (row.receiveres == undefined) {
          this.$message({
            message: '请输入收货人',
            type: 'warning'
          });
        } else if (row.mobiles == undefined) {
          this.$message({
            message: '请输入手机号',
            type: 'warning'
          });

        } else if (row.provinceId == undefined || row.cityId == undefined || row.consigneeAddr == undefined) {
          this.$message({
            message: '请输入完整地址',
            type: 'warning'
          });
        } else {
          this.district.forEach((item) => {
            if (item.regionId == row.regionId) {
              this.regionNamesd = item.regionName
            }
          })
          let data = {
            customerId: this.customerId,
            receiver: row.receiveres,
            mobile: row.mobiles,
            provinceRegionId: row.provinceId,//省id
            cityRegionId: row.cityId,//市id
            areaRegionId: row.regionId,//区id
            receiveAddress: row.consigneeAddr,//小区地址,详细地址
            province: this.regionName,
            city: this.regionNames,
            area: this.regionNamesd
          }
          this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/addAddress', data).then(function (res) {
            if (res.data.success) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.tableData1.forEach((item) => {
                item.Delbtn = 1;

              });
              this.initMemberes();
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }

          }.bind(this));


        }

      },
      //初始话会员数据
      initMemberes: function () {
        this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/getCustomerDetail', {ecBuyRptId: this.$route.params.id}).then(function (res) {
          if(res.data.success){
            this.sourceshow = res.data.result.source;
            this.startTime = res.data.result.firstBuyTime;
            this.endTime = res.data.result.lastBuyTime;
            this.ecId = res.data.result.ecId;
            this.ecCustomerId = res.data.result.ecCustomerId;
            this.customerId = res.data.result.customerId
            this.source = res.data.result.source;
            this.orderTypeNo.forEach((item) => {
              if (item.value == res.data.result.ecId) {
                this.ecname = item.label
              }
            });
            this.soureoption.forEach((val) => {
              if (val.value == res.data.result.source) {
                this.sourcees = val.label
              }

            });
            res.data.result.addressBeanList.forEach((item) => {
              item.address = item.province + item.city + item.area + item.receiveAddress;
              item.mobiles = '';
              item.provinceId = '';
              item.receiveres = '';
              item.cityId = '';
              item.regionId = '';
              item.consigneeAddr = '';
              if (item.source == 2 && res.data.result.addressBeanList.length > 1) {
                item.Delbtn = 1;

              }
            })
            this.tableData1 = res.data.result.addressBeanList;
            this.tableData2 = res.data.result.storeBuyRptBeanList; //按店铺统计列表
            this.tableData3 = res.data.result.goodsBuyRptBeanList;//按商品统计列表

          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });

          }


        }.bind(this));
      },
      //添加
      addData() {
        if (this.tableData1[this.tableData1.length - 1].customerId == '') {
          return false;
        }
        this.tableData1.push({regionId: '', customerId: '', source: 2})

      },
      //省
      price() {
        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list', {regionId: 1}).then(function (res) {
          this.province = res.data.result; // 接受省的数据
        }.bind(this));
      },
//      市
      two(row) {
        this.province.forEach((item) => {
          if (row.provinceId == item.regionId) {
            this.regionName = item.regionName
          }

        })
        row.cityId = ''
        row.regionId = ''
        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list', {
          regionId: row.provinceId
        }).then(function (res) {
          this.city = res.data.result; // 接受省的数据
        }.bind(this));
      },
      // 市改变请求区
      three(row) {
        this.city.forEach((item) => {
          if (item.regionId == row.cityId) {
            this.regionNames = item.regionName
          }
        })
        let self = this
        row.regionId = ''
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list', {
          regionId: row.cityId
        })
          .then(function (res) {
            if (res.data.code == 0) {

              self.district = res.data.result; // 接受省的数据


            }
          })

      },
      // 请求四级地址
      four() {
        let self = this
        self.addStore.regionId = '';  // 清空四级
        self._post('com.edb01.erp.mdata.service.api.DtRegionService/' + self.version + '/list', {regionId: self.addStore.districtId})
          .then(function (res) {
            if (res.data.code == 0) {
              self.housing = res.data.result; // 接受省的数据
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      },


    }
  }
</script>
<style scoped>
  .pTop {
    margin-bottom: 20px;

  }

  .pDown {
    width: 750px;
    height: auto;
    margin-bottom: 50px;
    /*padding-top: 15px;*/
  }

</style>
<style>
  #Memberdetaimport .el-textarea {
    width: 82%;
  }

  #Memberdetaimport .el-table .cell {
    text-align: center;
  }
</style>
