<!--upms首页 秋香-->
<template>
  <div id="IndexBis">
    <!--刷新-->
    <div>
      <img src="../../../assets/img/刷新.png" width="15px" height="15px" style="margin-left: 96%;margin-bottom: 7px" alt="" class="spanClick" @click="refresh()">  <span style="color: #1871F0;margin-bottom: 4px" class="spanClick" @click="refresh()">刷新</span>
    </div>
    <!--功能导航图-->
    <div>
      <el-row :gutter="15">
        <el-col :span="4" class="isShowNum1">
          <div style="position: relative; width:100%">
            <img src="../../../assets/img/Hospitality trial.png" width="100%" alt="" @click="jumpTerm(1)" style="cursor: pointer;">
             <div class="isNoSame" @click="jumpTerm(1)">{{this.noCheckOrderNum}}</div>
            <div  style="position: absolute;color:#FFFFFF;font-size:1.7em;font-weight: inherit;left:15%;top:60%;cursor: pointer;" @click="jumpTerm(1)">待客审(单)</div>
          </div>
        </el-col>

        <el-col :span="4" class="isShowNum2">
          <div style="position: relative; width:100%">
            <img src="../../../assets/img/orange.png" width="100%" alt="" @click="jumpTerm(2)" style="cursor: pointer;">
            <div class="isNoSame" @click="jumpTerm(2)">{{this.noStorageCheckOrderNum}}</div>
            <div  style="position: absolute;color:#FFFFFF;font-size:1.7em;font-weight: inherit;left:15%;top:60%;cursor: pointer;" @click="jumpTerm(2)">待仓审(单)</div>
          </div>
        </el-col>
        <el-col :span="4" class="isShowNum3">
          <div  style="position: relative; width:100%">
            <img src="../../../assets/img/hblue.png" width="100%" alt="" @click="jumpTerm(3)" style="cursor: pointer;">
            <div class="isNoSame" @click="jumpTerm(3)">{{this.ecExceptionOrderNum}}</div>
            <div  style="position: absolute;color:#FFFFFF;font-size:1.7em;font-weight: inherit;left:15%;top:60%;cursor: pointer;"@click="jumpTerm(3)">平台异常单(单)</div>
          </div>
        </el-col>
        <el-col :span="4" class="isShowNum4">
          <div  style="position: relative; width:100%">
            <img src="../../../assets/img/blue.png" width="100%" alt="" @click="jumpTerm(4)" style="cursor: pointer;">
            <div class="isNoSame" @click="jumpTerm(4)" >{{this.warehouseOrder}}</div>
            <div  style="position: absolute;color:#FFFFFF;font-size:1.7em;font-weight: inherit;left:15%;top:60%;cursor: pointer;" @click="jumpTerm(4)">仓库异常单(单)</div>
          </div>
        </el-col>
        <el-col :span="4" class="isShowNum5">
          <div  style="position: relative; width:100%">
            <img src="../../../assets/img/Hospitality trial.png" width="100%" alt="" @click="jumpTerm(5)" style="cursor: pointer;">
            <div class="isNoSame"  @click="jumpTerm(5)">{{this.noSendOrderNum}}</div>
            <div  style="position: absolute;color:#FFFFFF;font-size:1.7em;font-weight: inherit;left:15%;top:60%;cursor: pointer;"@click="jumpTerm(5)">待发货(单)</div>
          </div>
        </el-col>
        <el-col :span="4" class="isShowNum6">
          <div  style="position: relative; width:100%">
            <img src="../../../assets/img/orange.png" width="100%" alt="" @click="jumpTerm(6)" style="cursor: pointer;">
            <div class="isNoSame" @click="jumpTerm(6)">{{this.noHandleAfterOrderNum}}</div>
            <div  style="position: absolute;color:#FFFFFF;font-size:1.7em;font-weight: inherit;left:15%;top:60%;cursor: pointer;" @click="jumpTerm(6)">待处理售后(单)</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--pageHome-->
    <div style="margin-top: 10px">
      <div style="float: right;margin-left:5px;width: 451px;">
        <!--公告-->
        <div style="margin-bottom: 10px;margin-left:10px;width:440px;background-color: white;height:160px">
          <div>
            <label  class="leftLabel" >公告</label>
            <p class="rightLabel"  @click="ChangHistory">历史公告</p>
            <div  style=" font-weight: 700;padding-left: 20px;padding-top: 15px;font-size: 12px;cursor: pointer;padding-right: 20px;text-align: justify;" @click="notice(sysNotiId)" >{{sysNotiTheme}}</div>
              <el-tooltip placement="top" popper-class="atooltip" v-if="sysNotiContent!=''">
                <div slot="content" style="width: 500px" v-html="sysNotiContent"></div>
                <div  class="isContent"   v-if="sysNotiContent.length > 100" v-html="sysNotiContent.slice(0,100)+'...' + '</p>'"></div>
                <div  class="isContent" v-else v-html="sysNotiContent"></div>
              </el-tooltip>
          </div>
        </div>
        <!--系统更新-->
        <div style="margin-bottom: 10px;margin-left:10px;width:440px;background-color: white;height:180px">
          <div>
            <label  class="leftLabel">系统更新</label>
            <p class="rightLabel1"  @click="ChangUpdate()">查看更多</p>
            <div>
                <el-row >
                  <el-col v-for="(item1,index) in testOne" :span="item1.col" :key="'info1-'+index" >
                    <!--表头-->
                    <div class="indexHeaderOne">{{item1.name}}</div>
                    <!--更新内容-->
                    <div class="indexBox2"   v-if="index == 0 && i<4" v-for="(item,i) in updateTable">
                      <el-tooltip placement="right" popper-class="atooltip">
                        <div slot="content" @click="theme(item)">{{item.sysNotiTheme}}</div>
                        <div @click="theme(item)" style="color:#409EFF;" v-if="item.sysNotiTheme.length>15">{{item.sysNotiTheme.slice(0,15)+'...'}}</div>
                        <div @click="theme(item)" style="color:#409EFF;" v-else>{{item.sysNotiTheme}}</div>
                      </el-tooltip>
                    </div>
                    <!--更新时间-->
                    <div class="indexBox2" v-if="index == 1 && i<4" v-for="(item,i) in updateTable">
                      <span v-if="item.updateTime == 1" style="color: #fff;margin-left: 40px">1</span>
                      <span v-else  style="margin-left: 60px">{{item.updateTime| normalTime(6)}}</span>
                    </div>
                  </el-col>
                </el-row>
            </div>
          </div>
        </div>
        <!--菜鸟快递剩余单量-->
        <div style="margin-bottom: 10px;margin-left:10px;width:440px;background-color: white;height:190px">
          <div >
            <label  class="leftLabel" >菜鸟快递剩余单量</label>
            <div style=" text-align: center;line-height: 110px"> <a href="#" class="underLine" @click="surplus()">{{this.expressNum}}</a></div>
          </div>
        </div>
        <!--二维码图片-->
        <div style="margin-top:30px;padding:0 30px;">
          <div style="display: inline-block">
            <img src="../../../assets/img/twoCode1.jpg" alt="">
            <div style="text-align: center">微信（公众）</div>
          </div>
          <div style="display: inline-block;margin-left: 90px">
            <img src="../../../assets/img/twoCode2.jpg" alt="">
            <div style="text-align: center">圣特尔 E店宝</div>
          </div>
        </div>
      </div>
      <div>
        <div style="width: 98.5%;padding-right: 441px">
          <!--失效店铺提醒-->
          <div style="margin-bottom: 5px;background-color: white;height: 268px">
            <label  class="leftLabel" >失效店铺提醒</label>
            <p class="rightLabel" @click="moveChang()">查看更多</p>
            <div style="margin-top: 20px;">
              <el-row>
                <el-col v-for="(item1,index) in test" :span="item1.col" :key="'info2-'+index">
                  <!--表头-->
                  <div class="indexHeader">{{item1.name}}</div>
                  <!--店铺-->
                  <div class="indexBox"  v-if="index == 0 && i<5" v-for="(item,i) in tableData" :key="'info3-'+i">
                    <el-tooltip placement="top" popper-class="atooltip">
                      <div slot="content" >{{item.storeName}}</div>
                      <span v-if="item.storeName.length>15">  {{item.storeName.slice(0,15)+'...'}}</span>
                      <span v-else> {{item.storeName}}</span>
                    </el-tooltip>
                  </div>

                  <!--平台-->
                  <div class="indexBox" v-if="index == 1 && i<5" v-for="(item,i) in tableData" :key="'info4-'+i">
                    {{item.ecName}}
                  </div>
                  <!--失效时间-->
                  <div class="indexBox" v-if="index == 2 && i<5" v-for="(item,i) in tableData" :key="'info5-'+i">
                    <span v-if="item.authEndTime == 1" style="color: #fff">1</span>
                    <span v-else>{{item.authEndTime| normalTime(6)}}</span>
                  </div>
                  <!-- 重新授权-->
                  <div class="indexBox1" style="margin-left: auto;"  v-if="index == 3 && i<5" v-for="(item,i) in tableData">
                    <a target="_blank"  @click="changQ(item)"  class="spanClick">自动授权</a>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!--核心优势-->
          <div style="margin-bottom: 5px;background-color: white;height:458px;margin-top: 10px">
            <label  class="leftLabel" >核心优势</label>
            <div style="margin-top: 50px;" id="iscirse">
              <el-carousel :interval="6000" arrow="always"trigger="click" >
                <el-carousel-item  v-for="(item,index) in itemName" :key="'info6-'+index">
                  <div>
                    <span style="font-size: 16px;margin-left: 35px">智能自动化处理</span>
                    <el-row style="margin-top: 30px" >
                      <el-col :span="6"  style="font-size: 16px;text-align: left">
                        <div  style="text-align: center;">
                          <img src="../../../assets/img/1-1.png">
                        </div>
                        <div class="isSize">
                          <span >按业务流，系统智能分段处理,提升推单、审单效率</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/1-2.png">
                        </div>
                        <div class="isSize">
                          <span  >多维度自动审单方案；退款单、预售单、超重单等自动拆分</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/1-3.png">
                        </div>
                        <div class="isSize">
                          <span  >多场景的智能分仓：属地仓、商品指定仓，寻找商品公共仓，最少拆单原则</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/1-4.png" >
                        </div>
                        <div class="isSize">
                          <span  >特殊订单的智能化标识和自动化处理</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-carousel-item>
                <el-carousel-item v-for="(item,index) in itemName" :key="'info7-'+index">
                  <div>
                    <span style="font-size: 16px;margin-left: 35px">九大精准库存模型</span>
                    <el-row :gutter="20" style="margin-top: 30px;" >
                      <el-col :span="6"  style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/2-1.png">
                        </div>
                        <div class="isSize">
                          <span >九大精准库存模型，下单预占，按需解锁，保证拣有货</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/2-2.png">
                        </div>
                        <div class="isSize">
                          <span>库存快照、变化跟踪日志等功能，实现全渠道库存的可视、可控、可追溯</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/2-3.png">
                        </div>
                        <div class="isSize">
                          <span>预售库存、赠品库存按需单独管理，严防超卖、超赠</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/2-4.png" >
                        </div>
                        <div class="isSize">
                          <span>多维度库存分析为企业的决策提供依据，有计划的进行采购、销售、备货</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-carousel-item>
                <el-carousel-item v-for="(item,index) in itemName" :key="'info8-'+index">
                  <div>
                    <span style="font-size: 16px;margin-left: 35px">专业仓储管理</span>
                    <el-row style="margin-top: 30px" >
                      <el-col :span="6"  style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/3-1.png">
                        </div>
                        <div class="isSize">
                          <span >分仓按需配置专业、规范的仓储作业流程和上下架策略</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/3-2.png">
                        </div>
                        <div class="isSize">
                          <span >智能波次策略，提总订单，汇聚同类商品，拣选路径与配货效率最高</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/3-3.png">
                        </div>
                        <div class="isSize">
                          <span >专业化仓储管理模型，确保拣有位，存有货</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/3-4.png" >
                        </div>
                        <div class="isSize">
                          <span  >规范式仓储作业流程，新人零培训上岗</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-carousel-item>
                <el-carousel-item v-for="(item,index) in itemName" :key="'info9-'+index">
                  <div>
                    <span style="font-size: 16px;margin-left: 35px">一体化</span>
                    <el-row style="margin-top: 30px" >
                      <el-col :span="6"  style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/3-5.png">
                        </div>
                        <div class="isSize">
                          <span  >自成一体的OMS+WMS库存模型的上下传承、保证库存的一致性</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/3-6.png">
                        </div>
                        <div class="isSize">
                          <span  >业务和财务的一体化，单据自动生成凭证、明细账，精准清晰，数据随时可追溯</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/3-7.png">
                        </div>
                        <div class="isSize">
                          <span  >业务单据全要素、全流程、全场景的数据可视化，上下游关联、及时拦截，保证数据的准确性</span>
                        </div>
                      </el-col>
                      <el-col :span="6" style="font-size: 16px;text-align: left">
                        <div  style="text-align: center">
                          <img src="../../../assets/img/3-8.png" >
                        </div>
                        <div class="isSize">
                          <span  >避免业务单据在不同系统的重复</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%;text-align:center;color: #C8CEDF;margin: 12px auto 0;">Copyright © @2004-2017 京公⽹安备11010502034342号 京ICP备19016511号-1 北京圣特尔科技发展有限公司 版权所有</div>
    <!--菜鸟快递剩余单量-->
    <div id="pop">
      <el-dialog v-dialogDrag
        title="菜鸟快递剩余单量"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        width="730px"
      >
        <div>
          <el-table
            :data="expressTable"
            tooltip-effect="dark"
            border
            :height="570"
            style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              label="序号"
              width="148">
            </el-table-column>
            <el-table-column
              align="center"
              prop="expressName"
              :show-overflow-tooltip="true"
              width="160"
              label="快递公司">
            </el-table-column>
            <el-table-column
              align="center"
              prop="quantity"
              width="160"
              :show-overflow-tooltip="true"
              label="剩余单量">
            </el-table-column>
            <el-table-column label="店铺详情" width="160">
              <template slot-scope="scope">
                <div >
                  <el-button @click="examine(scope.row)" type="text" size="small" >查看</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <!--菜鸟快递剩余单量详情-->
    <div id="pop-up">
      <el-dialog v-dialogDrag
        title="菜鸟快递剩余单量"
        :close-on-click-modal="false"
        :visible.sync="dialogVisibleOne"
        width="730px"
      >
        <div>
          <el-table
            :data="detailsDatadetails"
            tooltip-effect="dark"
            border
            :height="570"
            style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              label="序号"
              width="148">
            </el-table-column>
            <el-table-column
              align="center"
              prop="storeName"
              :show-overflow-tooltip="true"
              width="160"
              label="店铺">
            </el-table-column>
            <el-table-column
              align="center"
              prop="printQuantity"
              width="160"
              :show-overflow-tooltip="true"
              label="已用单量">
            </el-table-column>
            <el-table-column
              align="center"
              prop="quantity"
              width="160"
              :show-overflow-tooltip="true"
              label="剩余单量">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        data: {},
        version:'1.0.0',
        test:[
          {name: '店铺',col: 6},
          {name: '平台',col: 6},
          {name: '失效时间',col: 6},
          {name: '重新授权',col: 6}
        ],//失效店铺提醒表头
        testOne:[
          {name: '更新内容',col: 12},
          {name: '更新时间',col: 12},
        ],//系统更新表头
        itemName: [{}],//核心优势
        table_h: 0,//表格高度
        tableData: [],//表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        storeName:'',//店铺名称
        ecId:'',//平台
        authStatus:'',//授权状态id
        enabledFlag:'',// 是否启用
        dialogVisible:false,//菜鸟快递剩余单量弹框
        dialogVisibleOne:false,//菜鸟快递剩余单量详情弹框
        detailsDatadetails:[],//菜鸟快递剩余单量详情
        ecExceptionOrderNum:'',//平台异常单
        noCheckOrderNum: '',//待客审
        noHandleAfterOrderNum: '',//待处理售后单
        noSendOrderNum: '',//待发货
        noStorageCheckOrderNum: '',//待仓审
        warehouseOrder:'',//仓库异常单
        sysNotiId:'',//公告id
        expressNum:'',//菜鸟快递剩余单量
        expressTable:[],//菜鸟快递表格
        expressCoId:'',//店铺
        startTime:'',//开始时间
        endTime:'',//结束时间
        sysNotiTheme:'',//公告主题
        sysNotiType:'',//公告类型
        sysNotiState:'',//发布状态
        sysNotiContent:'',//公告内容
        updateTable:[],//系统更新内容
        authorityObj:{
          authority1:false,//订单处理
          authority2:false,//平台异常单
          authority3:false,//仓库异常单
          authority4:false,//订单查询
          authority5:false,//售后处理
        },
      }
    },
    computed:{
    },

    mounted() {
      this.findShop(); //店铺查询
      this.authorityInit();//获取权限
      this.getExpressNum()  //菜鸟快递剩余单量
      this.history();//公告主题
      this.findUpdate();//系统更新列表
    },
    methods:{
        //获取权限
        authorityInit(){
          this._post('com.edb01.upms.service.PrivilegeService/'+this.version+'/getUserPrivilege')
            .then((res)=> {
              if (res.data.code == 0) {
                var result = res.data.result.nodes;
                result.forEach(item => {
                  item.nodes.forEach(item2 => {
                    item2.nodes.forEach(item3 => {
                      for(var i= item3.nodes.length-1;i>=0;i--){
                        if(item3.nodes[i] && item3.nodes[i].privilegeName == '订单处理'){
                          this.authorityObj.authority1 = true;
                        }
                        if(item3.nodes[i] && item3.nodes[i].privilegeName == '平台异常单'){
                          this.authorityObj.authority2 = true;
                        }
                        if(item3.nodes[i] && item3.nodes[i].privilegeName == '仓库异常单'){
                          this.authorityObj.authority3 = true;
                        }
                        if(item3.nodes[i] && item3.nodes[i].privilegeName == '订单查询'){
                          this.authorityObj.authority4 = true;
                        }
                        if(item3.nodes[i] && item3.nodes[i].privilegeName == '售后单查询'){
                          this.authorityObj.authority5 = true;
                        }
                      }
                    })
                  })
                })
                //console.log(this.authorityObj);
                this.findBill();//订单查询
                this.findBillTwo()//仓库异常单
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            })
            .catch(function (err) {
              console.log(err);
            })
        },
        //跳转页面
        jumpTerm(item){
          switch(item){
            case 1:
              if(!this.authorityObj.authority1){
                this.$message({
                  message: '无访问权限',
                  type: 'error'
                })
                return false
              }
              $(parent.document.querySelector('#hospitalityTrial')).click();
              var parentDom = $(parent.document.querySelector('#content-main')).children('.J_iframe:visible');
              if($(parentDom)[0].contentWindow.document.querySelector('.fh-order1')){
                $(parentDom)[0].contentWindow.document.querySelector('.fh-order1').click();
              }
              $(parentDom)[0].onload = function(){
                $(parentDom)[0].contentWindow.document.querySelector('.fh-order1').click();
              }
              break;//待客审
            case 2:
              if(!this.authorityObj.authority1){
                this.$message({
                  message: '无访问权限',
                  type: 'error'
                })
                return false
              }
              $(parent.document.querySelector('#toWarehouse')).click();
              var parentDom = $(parent.document.querySelector('#content-main')).children('.J_iframe:visible');
              if($(parentDom)[0].contentWindow.document.querySelector('.fh-order2')){
                $(parentDom)[0].contentWindow.document.querySelector('.fh-order2').click();
              }
              $(parentDom)[0].onload = function(){
                $(parentDom)[0].contentWindow.document.querySelector('.fh-order2').click();
              }
              break;//待仓审
            case 3:
              if(!this.authorityObj.authority2){
                this.$message({
                  message: '无访问权限',
                  type: 'error'
                })
                return false
              }
              $(parent.document.querySelector('#ExceptionOrder')).click();
              break;//平台异常单
            case 4:
              if(!this.authorityObj.authority3){
                this.$message({
                  message: '无访问权限',
                  type: 'error'
                })
                return false
              }
              $(parent.document.querySelector('#warehouseOrder')).click();
              break;//仓库异常单
            case 5:
              if(!this.authorityObj.authority4){
                this.$message({
                  message: '无访问权限',
                  type: 'error'
                })
                return false
              }
              $(parent.document.querySelector('#toSendGoods')).click();
              break;//待发货
            case 6:
              if(!this.authorityObj.authority5){
                this.$message({
                  message: '无访问权限',
                  type: 'error'
                })
                return false
              }
              $(parent.document.querySelector('#toAfterSale')).click();
              break;//待处理售后
          }
        },

        //刷新按钮
          refresh(){
            this.findShop(); //店铺查询
            this.findBill();//订单查询
            this.findBillTwo()//仓库异常单
            this.getExpressNum()  //菜鸟快递剩余单量
            this.history();//公告主题
            this.findUpdate();//系统更新列表
          },

        //跳转到历史公告页面
          ChangHistory(){
            this.$router.push('/historyPage/')
          },

        //系统更新查看更多
          ChangUpdate(){
            this.$router.push('/SystemUpdate/')
          },

        // 公告跳转
        notice(sysNotiId){
          this.$router.push({name: 'SubjectContent',params: {sysNotiId: this.sysNotiId}})
        },

        // 系统更新列表内容
        theme(item){
          this.$router.push({name: 'UpdateDetail',params: {sysNotiId: item.sysNotiId}})
       },

        //系统更新列表查询
        findUpdate(){
          let data = {
            "page": this.curPage,
            "size": this.pageSize,
            "merchantId": 0,
            "sysNotiType":'1002',
          };
          this._post('com.edb01.erp.bis.service.api.BisSysNoticeService/'+this.version+'/queryByList',data).then(function (res) {
            this.updateTable=res.data.result.rows;
          }.bind(this))
        },

        //历史公告
        history(){
            this._post('com.edb01.erp.bis.service.api.BisSysNoticeService/'+this.version+'/queryByOrderByFirstNew').then( res =>{
              if(res.data.success==true){
                if(res.data.result != undefined) {
                  this.sysNotiTheme=res.data.result.sysNotiTheme;//公告主题
                }
                if(res.data.result != undefined) {
                  this.sysNotiContent=res.data.result.sysNotiContent;//公告内容
                }
                if(res.data.result != undefined) {
                  this.sysNotiId=res.data.result.sysNotiId
                }
              }else{
                this.$message({
                  message: res.data.msg,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
          })
          },

        // 点击重新授权
        againAccredit(item) {
        console.log(item);
        },

        //自动授权
        changQ(item){
          if(item.ecName == '京东'){
            //window.location.href
            window.open('http://edb.centaur.cn/edbtp/oauthhome.aspx?p=' + item.ecName + '2&e=edb_a64971&s=1&f=edb&r=http://www.edbv3.com/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/callback?clToken='+ encodeURIComponent(encodeURIComponent(encodeURIComponent(encodeURIComponent(sessionStorage.getItem('clToken'))))) +'.storeId=' + item.storeId + '&','_blank');
          }else{
            if(item.ecName == '天猫'){
              item.ecName = '淘宝';
              window.open('http://edb.centaur.cn/edbtp/oauthhome.aspx?p=' + item.ecName + '&e=edb_a64971&s=1&f=edb&r=http://www.edbv3.com/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/callback?clToken='+ encodeURIComponent(encodeURIComponent(encodeURIComponent(encodeURIComponent(sessionStorage.getItem('clToken'))))) +'.storeId=' + item.storeId + '&','_blank');
            }else{
              window.open('http://edb.centaur.cn/edbtp/oauthhome.aspx?p=' + item.ecName + '&e=edb_a64971&s=1&f=edb&r=http://www.edbv3.com/spider-api-web/api/com.edb01.erp.mdata.service.api.DtStoreService/1.0.0/callback?clToken='+ encodeURIComponent(encodeURIComponent(encodeURIComponent(encodeURIComponent(sessionStorage.getItem('clToken'))))) +'.storeId=' + item.storeId + '&','_blank');

            }
          }
        },

        //获取菜鸟快递剩余单量 快递下的店铺
        examine(row){
            let data = {
            "expressCoId": row.expressCoId,//店铺
            "merchantId": 0
            };
            this.dialogVisibleOne=true;
            this.dialogVisible=false
            this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/getStoreResidueList',data).then( res =>{
            this.detailsDatadetails=res.data.result;
            })
        },

        //菜鸟快递剩余单量弹框
        surplus(){
            this.dialogVisible=true;
            this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/getExpressResidueList').then( res =>{
            this.expressTable=res.data.result;
            })
        },

        //菜鸟快递剩余单量
        getExpressNum(){
            this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/getTotalResidueList').then( res =>{
            this.expressNum=res.data.result;
            })
        },

        //跳转到重新授权页面
        moveChang(item){
           this.$router.push('/reauthorization/')
        },

        //店铺查询
        findShop(){
            let data = {
            "storeName": this. storeName,//店铺名称
            "ecId":this.ecId,//平台
            "authStatus":this.authStatus,//授权状态id
            "enabledFlag":this.enabledFlag,// 是否启用
            "page": this.curPage,
            "size": this.pageSize,
            "merchantId": 0
            };
            this._post('com.edb01.erp.mdata.service.api.DtStoreService/' + this.version + '/query',data).then( res =>{
            res.data.result.rows.forEach((item,i)=>{
            if(!item.authEndTime && i!=2){
            item.authEndTime = '1';
            }
            })
            this.tableData=res.data.result.rows;
            this.total = res.data.result.total;
            })
        },

        //店铺查询
        findBill (){
            this._post('com.edb01.erp.oms.service.api.OrderForWmsService/' + this.version + '/getOrderCount').then( res =>{
            this.ecExceptionOrderNum = this.authorityObj.authority2?res.data.result.ecExceptionOrderNum:'--';//平台异常单
            this.noCheckOrderNum = this.authorityObj.authority1?res.data.result.noCheckOrderNum:'--';//待客审
            this.noHandleAfterOrderNum = this.authorityObj.authority5?res.data.result.noHandleAfterOrderNum:'--';//待处理售后单
            this.noSendOrderNum = this.authorityObj.authority4?res.data.result.noSendOrderNum:'--';//待发货
            this.noStorageCheckOrderNum = this.authorityObj.authority1?res.data.result.noStorageCheckOrderNum:'--';//待仓审
            })
        },

        //仓库异常单
        findBillTwo (){
            this._post('com.edb01.erp.wms.service.api.WmStorageAbnormalService/' + this.version + '/countStorageAbnormal').then( res =>{
            this.warehouseOrder = this.authorityObj.authority3?res.data.result:'--';//仓库异常单
            })
        },

        }
    }
    </script>
    <style scoped>

    .spanClick{
      color: #409EFF;
      cursor: pointer;
      display: inline-block;
    }

    .indexHeader{
      text-align: center;
      width: 100%;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .indexHeaderOne{
      text-align: center;
      width: 100%;
      font-size: 12px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .indexBox{
      display: flex;
      align-items:center;
      justify-content: center;
      width: 100%;
      height: 30px;
      margin-left:8px
    }
    .indexBox2{
      display: flex;
      align-items:center;
      justify-content: left;
      width: 100%;
      height: 24px;
      margin-left:20px
    }
    .indexBox1{
      display: flex;
      align-items:center;
      justify-content: center;
      width: 100%;
      height: 30px
    }
      #IndexBis{
      background: #F0F1F5;
      color: #4A4A4A;
      padding: 0px!important;
    }
      #IndexBis .el-carousel__item h3 {
      color: #475669;
      font-size: 18px;
      opacity: 0.75;
      line-height: 300px;
      margin: 0;
    }

      #IndexBis .el-carousel__item:nth-child(2n) {
      background-color: white;
    }

      #IndexBis .el-carousel__item:nth-child(2n+1) {
      background-color: white;
    }

    .el-carousel__button {
      display: block;
      opacity: .48;
      width: 30px;
      height: 2px;
      background-color: red;
      border: none;
      outline: 0;
      padding: 0;
      margin: 0;
      cursor: pointer;
      -webkit-transition: .3s;
      transition: .3s;
    }

      #IndexBis .leftLabel{
      border-left: 4px solid #409eff;
      font-weight: 700;
      padding-left: 10px;
      font-size: 16px;
      margin-top: 20px;
      margin-left: 20px
    }
      #IndexBis .rightLabel{
      font-weight: 700;
      margin-right: 20px;
      margin-top: 20px;
      font-size: 14px;
      color: #1871F0;
      float: right;
      cursor: pointer;
      display: inline-block;
    }
    #IndexBis .rightLabel1{
      font-weight: 700;
      margin-right: 20px;
      margin-top: 15px;
      font-size: 14px;
      color: #1871F0;
      float: right;
      cursor: pointer;
      display: inline-block;
    }
      #IndexBis .underLine{
      text-decoration:underline;
      font-size: 24px;
      color: #1871F0;
    }
      #IndexBis .isSize{
      font-size: 14px;
      width:80%;
      margin-left: 13%;
      margin-top: 20px;
      color: #9B9B9B;
    }
      #IndexBis .el-table td, .el-table th.is-leaf {
      border-bottom: 1px solid #fff;
    }

      #1ps {
      position:absolute;
      left:100px;
      top:150px
    }
    .isShowNum {
      position:absolute;
    }
    .isColor {
          width: 500px;
          text-align: justify;
        }

    </style>
    <style>
      #IndexBis .el-carousel__button {
      height: 12px;
      width: 12px;
      border: 1px solid #C7CFD6;
      margin-right: 40px;
      border-radius: 50%;
    }
      #IndexBis .is-active .el-carousel__button {
        background-color: #098AFB;
        border: white;
    }
      #IndexBis .el-carousel__arrow {
        background: rgba(255, 255, 255, 0.11)
    }
      #IndexBis  .isContent {
        overflow: hidden;
        text-overflow: ellipsis;
        color: #8A8A8A;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 10px;
        text-align: justify;
        display:block;
        height:60px;
      }
      #IndexBis  .isNoSame{
        position: absolute;
        left:15%;
        top:24%;
        font-size: 3em;
        font-weight: inherit;
        cursor: pointer;
        color:#FFFFFF;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 220px;
      }
      .atooltip {
        background: rgba(5, 4, 22, 0.36) !important;
      }

      @media screen and (max-width: 1366px) {
        #IndexBis  .isNoSame{
          text-overflow: ellipsis;
          overflow: hidden;
          width: 150px;
          padding-left: 2px;
          text-align: justify;
          display:block;
          height:40px;
          color:#FFFFFF;
          font:inherit;
          font-size: 2em;
          font-weight: inherit;
          cursor: pointer;
        }
      }
    </style>


