<!--会员列表 佩玖-->
<template>
  <div id="MemberList">
    <!--搜索区-->
    <div id="searchBox">
      <div class="leftBox2">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <span style="width: 25px">会员来源：</span>
              <el-select  id="searchStock" v-model="source" filterable placeholder="全部">
                <el-option
                  v-for="item in soureoption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label>平台：</label>
              <el-select  v-model="ecId" filterable placeholder="全部">
                <el-option
                  v-for="item in orderTypeNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

            </div>
          </el-col>

          <el-col :span="13">
            <div class="grid-content">

              <span>消费总次数</span>
              <el-input :maxlength="10" style="width: 70px!important;" v-model="qtyThan"
                        placeholder="" @blur="isTure()"
              ></el-input>
          -
              <el-input :maxlength="10" style="width: 70px!important;" v-model="qtyLess"
                        placeholder=""  @blur="isTure()"
              ></el-input>

              <span style="margin-left:20px ">消费总金额</span>
              <el-input :maxlength="10" style="width: 70px!important;" v-model="amtThan"
                        placeholder=""  @blur="isTure()"
              ></el-input>
              -
              <el-input :maxlength="10" style="width: 70px!important;" v-model="amtLess"
                        placeholder=""  @blur="isTure()"
              ></el-input>

            </div>
          </el-col>

        </el-row>
        <el-row >
          <el-col>
            <div class="grid-content">
              <el-select style="width: 130px!important;" v-model="timeType" filterable placeholder="创建时间">
                <el-option
                  v-for="item in timeTypeNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>

              <dataTime
                style="display: inline-block"
                :timeCom1="startTime"
                :timeCom2="endTime"
                @timeVal1="getTime1"
                @timeVal2="getTime2"
              ></dataTime>
            </div>
          </el-col>

        </el-row>
      </div>
      <div class="rightBox2">
        <el-button @click="reset()" size="mini" type="default">重 置</el-button>
        <el-button @click="query" size="mini" type="primary">查 询</el-button>

      </div>
    </div>
    <!-- 表头 -->
    <div class="col-nav" style="margin:10px 0;">
      <ul>
        <li @click="deleceperson()"><span>删除</span></li>
        <li @click="exportData()"><span>导出</span></li>
        <li>
          <el-dropdown  @command="handleCommand">
  <span class="el-dropdown-link">
    导入
  </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="Importber">导入会员</el-dropdown-item>
              <el-dropdown-item command="Downimport">下载导入模板</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <!--表格-->
    <div class="pDown">
      <el-table :data="tableData"
                tooltip-effect="dark"
                id="tableH"
                border :max-height="table_h"
                :default-sort="{prop: 'date', order: 'descending'}"
                @selection-change="handleSelectionChange"
                border style="width: 100%">
        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          align='center'
          type="selection"
          width="50">
        </el-table-column>

        <el-table-column label="买家ID" align='center'>
          <template slot-scope="scope">
            <el-button @click="buyerId(scope.row)" type="text" size="small">{{scope.row.ecCustomerId}}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="会员来源" prop="source" align='center' min-width="100">
        </el-table-column>

        <el-table-column label="平台" prop="ecId" align='center' min-width="100">
        </el-table-column>

        <el-table-column label="会员姓名" prop="customerName" align="center"  min-width="100">
        </el-table-column>

        <el-table-column label="手机号" prop="mobile" align="center"  min-width="100">
        </el-table-column>

        <el-table-column label="消费总次数" prop="buyTotalQty" align="center"  min-width="100">
        </el-table-column>

        <el-table-column label="消费总金额（¥）" prop="buyTotalAmt" align="center"  min-width="100">
        </el-table-column>

        <el-table-column label="首次消费时间" min-width="100">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.firstBuyTime | normalTime(6) }}</p>
          </template>
        </el-table-column>

        <el-table-column label="最后消费时间" min-width="100">
          <template slot-scope="scope">
            <p class="cen-g">{{ scope.row.lastBuyTime | normalTime(6) }}</p>
          </template>
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
    <!--导入-->
    <el-dialog v-dialogDrag
      title="导入"
      :visible.sync="visibleLead"
      width="800px"
      :before-close="handleClose">
      <div>
        <ul id="leadUl">
          <li>说明:</li>
          <li>1.表头为红色的必填。</li>
          <li>2.详细地址，格式”某某村“。</li>
          <li>3.首次购物时间格式，”2018-01-15“，不填则取导入时间。</li>
          <li>4.最后一次购物时间格式，”2018-01-15“，不填则取导入时间。</li>
          <li>5.交易数字写数字，不填则取0。</li>
          <li>6.交易金额写数字，支持两位小数，不填则取0。</li>
          <el-form label-width="120px"  class="demo-ruleForm" :model="addData" ref="addData">
            <el-form-item label="上传文件：" prop="fileName">
              <el-input placeholder="文件路径" disabled style="width:198px" v-model="addData.fileName"></el-input>
              <el-button @click="fileUpload">选择文件</el-button>
              <input type="file" style="display:none" ref="fileBtn" @change="fileSelect"/>
            </el-form-item>
            <el-form-item style="width:100%;text-align: right">
              <el-button type="primary" @click="makeImport('addData')">确定导入</el-button>
            </el-form-item>
          </el-form>
        </ul>
      </div>
    </el-dialog>
    <!-- 导入结果-->
    <el-dialog v-dialogDrag
      title="导入结果"
      :visible.sync="DataSuccesssd"
      width="400px"
      tooltip-effect="dark"
      center>
      <div style="width: 100%;text-align: center">
        <div style="width: 100%;margin-top: -20px;margin-bottom: 10px"><i style="font-size: 16px;color: #E6A23C;margin-left: 20px;" class="el-icon-warning"></i>{{succseData}} </div>

        <el-button style="width:190px!important;" @click="DwonUpload()">下载导入失败的订单 </el-button>
      </div>

    </el-dialog>

  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  import dataTime from '@/components/common/DataTime.vue'
  export default {
    components: {
      pagination, dataTime
    },
    data() {
      return {
        version: '1.0.0',//接口版本号
        startTime: null,//起始时间
        endTime: null,//结束时间
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        addData:{    //导入文件
          fileName:'',
        },
        visibleLead:false, //导入弹窗
        ecId: '', //平台
        mobile: '', //手机
        succseData:'',//成功条数
        qtyThan: '', //消费次数左
        qtyLess: '',//消费次数右
        amtThan: '',//消费金额左
        amtLess: '',//消费金额右
        timeEnd: '',
        timeStart: '',
        timeType: 1,  //时间类型
        timeTypeNo: [{ //时间
          value: 1,
          label: '首次消费时间'
        }, {
          value: 2,
          label: '最后消费时间'
        }],
        orderTypeNo: [{value: "", label: "全部"}], //平台
        soureoption: [ //单据来源
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
        source: '', //会员来源
        DataSuccesssd:false, //导入状况
        dataId:'', //文件id
        SelectionData: [], //多选删除
      }
    },
    mounted() {
      this.platformdata();
      this.initTime();//初始时间
      this.initMessage();//初始化表格数据


      //表格高度自适应
      this.$nextTick(function () {
        this.table_h = (document.body.clientHeight - $('#tableH').offset().top - 90);
      });
      //初始化每页数量
      if (sessionStorage.getItem("MemberList_1") != null) {
        this.pageSize = parseInt(sessionStorage.getItem("MemberList_1"));
      }

    },
    //离开页面返回后触发的钩子函数
    activated() {
      this.initMessage();//初始化表格数据
    },
    methods: {
      //校验输入
      isTure(){
        let regT= /^[0-9]+.?[0-9]*$/;
        if(!regT.test(this.qtyThan)&&this.qtyThan!=''){
          this.qtyThan=''
        }else if(!regT.test(this.qtyLess)&&this.qtyLess!=''){
          this.qtyLess=''
        }else if(!regT.test(this.amtThan)&&this.amtThan!=''){
          this.amtThan=''
        }else if(!regT.test(this.amtLess)&&this.amtLess!=''){
          this.amtLess=''
        }
      },
      //是否缓存本页的钩子函数
      beforeRouteLeave(to,from,next) {
        if (to.name == 'Memberdetaimport') {
          //离开时，将自身缓存下来
          if (!from.meta.keepAlive) {
            from.meta.keepAlive = true;
          }
          next();
        }else {
          from.meta.keepAlive = false;
          to.meta.keepAlive = false;
          this.$destory();
          next();
        }


      },
      //初始化表格数据
      initMessage() {
        let startTime, endTime;
        if (this.startTime != null) {
          startTime = new Date(this.startTime).getTime()
        } else {
          startTime = ''
        }
        if (this.endTime != null) {
          endTime = new Date(this.endTime).getTime()
        } else {
          endTime = ''
        }

        let data = {
          timeType: this.timeType,
          source: this.source,
          ecId: this.ecId,
          qtyThan: this.qtyThan,
          qtyLess: this.qtyLess,
          amtThan: this.amtThan,
          amtLess: this.amtLess,
          timeEnd: endTime,
          timeStart: startTime,
          page: this.curPage,
          size: this.pageSize
        };
        this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/getCustomerList', data).then(function (res) {
          res.data.result.rows.forEach((item)=>{
            this.soureoption.forEach((val)=>{
              if(val.value==item.source){
                item.source=val.label
              }
            })
            this.orderTypeNo.forEach((nums)=>{
              if(nums.value==item.ecId){
                item.ecId=nums.label
              }
            })

          })
          this.tableData = res.data.result.rows;
          this.total = res.data.result.total;

        }.bind(this))
      },
      // 弹框关闭时置为空
      handleClose(done, addData) {
        this.$refs.addData.resetFields();
        done();
      },
     //下载导入失败的模板
      DwonUpload(){
        location.href = 'http://'+process.env.FILE_API+'/files-web/download/' +  this.dataId

      },
      //确定导入
      makeImport() {
        if(this.uploadFile==undefined){
          this.$message({
            message:'请选择上传文件',
            type: 'warning'
          })
        return false
        }
        this.$refs.addData.validate((valid) => {
          if (valid) {
            let formData = new FormData();
            formData.append('filedata', this.uploadFile);
            this.$axios({
              method: 'post',
              url: 'http://'+process.env.FILE_API+'/files-web/upload',

              data: formData
            })
              .then((res) => {
                console.log(1258, res)
                if (res.data.resourcesId) {
                  this.addData.fileId = res.data.resourcesId
                  this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/customerImport', this.addData)
                    .then((res) => {
                      if (res.data.success) {
                        if(res.data.result.failNum==0&&res.data.result.successNum>0){
                          this.visibleLead = false;
                          this.$message({
                            message: '导入成功'+res.data.result.successNum+'条',
                            type: 'warning'
                          })

                        }else {
                          this.dataId=res.data.result.fileId;
                          this.DataSuccesssd=true;
                          this.succseData='导入成功' + res.data.result.successNum + '条,失败' + res.data.result.failNum + '条!',
                            this.visibleLead = false;
                        }


                      } else {
                        this.$message({
                          message: res.data.msg,
                          type: 'warning'
                        })
                      }
                    })
                }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 点击选择文件
      fileUpload() {
        this.$refs.fileBtn.click();
      },
      //文件选择函数
      fileSelect(e) {
        if (e.target.files[0].name.indexOf(".xls") > 0 || e.target.files[0].name.indexOf(".xlsx") > 0 || e.target.files[0].name.indexOf(".csv") > 0) {
          this.uploadFile = e.target.files[0];
          this.addData.fileName = e.target.files[0].name;
        } else {
          this.$message({
            message: '只支持excel文件上传(.xls、.xlsx、csv)',
            type: 'warning'
          });
        }
      },
      //导出
      exportData(){
        let startTime, endTime;
        if (this.startTime != null) {
          startTime = new Date(this.startTime).getTime()
        } else {
          startTime = ''
        }
        if (this.endTime != null) {
          endTime = new Date(this.endTime).getTime()
        } else {
          endTime = ''
        }

        let data = {
          timeType: this.timeType,
          source: this.source,
          ecId: this.ecId,
          qtyThan: this.qtyThan,
          qtyLess: this.qtyLess,
          amtThan: this.amtThan,
          amtLess: this.amtLess,
          timeEnd: endTime,
          timeStart: startTime,
          page: this.curPage,
          size: this.pageSize
        };
          this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/exportCustomerList', data).then(function (res) {
            if(res.data.success){
              location.href = 'http://'+process.env.FILE_API+'/files-web/download/' + res.data.result
            }else {
              this.$message({
                message: res.data.msg,// 如果code为其他，弹出错误码
                type: 'warning'
              })
            }

          }.bind(this))



      },
      //导入菜单
      handleCommand(command) {
        if (command=="Importber") {
          this.visibleLead=true;
        }else if(command =="Downimport"){
          location.href = 'http://'+process.env.FILE_API+'/files-web/download/1209';


        }
      },
      //跳转
      buyerId(row){
        this.$router.push("/Memberdetaimport/"+row.ecBuyRptId)
      },
      //删除
      deleceperson() {
        if (this.SelectionData.length == 0) {
          this.$message({
            message: '请选择需要删除的会员!',
            type: 'warning'
          })
        } else {
          this.$confirm('确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            let ids = ''
            this.SelectionData.forEach((item) => {
              ids += item.customerId + ','
            })
            this._post('com.edb01.erp.oms.service.api.CustomerService/' + this.version + '/customerDel', {customerIds: ids.slice(0, -1)}).then(function (res) {
              if (res.data.success) {
                this.$message({
                  message: "删除成功" + this.SelectionData.length + "条",
                  type: 'success'
                });
                this.initMessage()

              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            }.bind(this))

          })
        }


      },
     //勾选
      handleSelectionChange(val) {
        this.SelectionData = val
      },
      // 跳到第几页
      getPageSize: function (val) {
        if (val != undefined) {

          //变换每页数量刷新数据
          this.pageSize = val;
          this.initMessage();

          //存储每页数量
          sessionStorage.setItem('MemberList_1', val);
        }
      },
      //每页条数
      getCurPage: function (val) {
        if (val != undefined) {

          //变换当前页刷新数据
          this.curPage = val;
          this.initMessage()
        }
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
      //查询
      query() {
        this.initMessage();//初始化表格数据
      },
      //重置
      reset() {
        this.ecId = '';
        this.source='';
        this.qtyThan = '';
        this.qtyLess = '';
        this.amtThan = '';
        this.amtLess = '';
        this.timeType = 1;
        this.initTime()

      },
      //初始化时间
      initTime: function () {
        let oDate = new Date();
        const Y = oDate.getFullYear(),
          M = oDate.getMonth() + 1,
          D = oDate.getDate();
        let timeStart = Y + ' ' + M + ' ' + D + ' 00:00:00';
        this.startTime = new Date(timeStart);
        let timeEnd = Y + ' ' + M + ' ' + D + ' 23:59:59';
        this.endTime = new Date(timeEnd)
      },
      //获取时间time1
      getTime1(val) {
        this.startTime = val
      },
      //获取时间time2
      getTime2(val) {
        this.endTime = val;
      },

    }

  }
</script>
<style>
</style>
<style scoped>


  .pTop {
    margin-bottom: 20px;
  }
  #leadUl li {
    color: #FF0000;
    font-size: 14px;
    margin-bottom: 20px;
    padding-left: 17px;
  }

  .liSpan {
    color: #0000FF;
    cursor: pointer;
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

  .fix-l1 {
    width: 260px;
  }

  .grid-content {
    /*   width: 200px;*/
    position: relative;
  }

  .grid-content .el-icon-more {
    /* //background: url(image/search.gif) no-repeat;*/
    width: 20px;
    height: 20px;
    position: absolute;
    top: 10px;
    padding-left: 50px;
  }

  /* left:50px;
 }*/
  .grid-content .username {
    padding-left: 30px;
    height: 20px;
  }


</style>


