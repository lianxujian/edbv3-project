<!--订单处理 樊虎-->
<template>
  <div id="order-processing" class="container_orderList" v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading" style="padding:15px !important;">
    <!-- 从首页点击打开订单处理借助此dom显示相应订单-->
    <div class="fh-order1" @click="tabRender(1)"></div>
    <div class="fh-order2" @click="tabRender(2)"></div>
    <div v-show="paramsObj.mainPageShow">
      <!-- 订单操作结果弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" :title="`${titleName}结果`" :visible.sync="successShowStatus"
                 width="600px">
        <div class="successTitle">
          <i class="icon iconfont el-icon-warning"
             style="font-size:18px;color: #DB525A;float:left;"></i>
          <span class="titleText" style="float: left;width: 270px;">
            <span v-show="allNum" style="font-size:14px;">共执行{{allNum}}单,</span>{{titleName}}成功{{successNum}}单,失败{{faliNum}}单
            <span style="font-weight:700;" v-if="titleName=='反客审'||titleName=='解挂'">（{{customerNum}}个订单根据客服备注更新失败<span
              v-if="titleName!='解挂'">，请手动更新</span>）</span>
          </span>
          <div style="clear:both;"></div>
        </div>
        <div v-show="faliNum!=0">
          <span
            style="display:inline-block;margin-top:0px;margin-bottom:5px;font-size:14px;font-weight:900;">失败订单列表</span>
          <a ref="splitExportLink" style="float:right;margin-top: 15px;color: #409EFF;cursor: pointer;"
             v-if="titleName=='预售拆分'||titleName=='缺货拆分'||titleName=='超重拆分'||titleName=='退款拆分'"
             @click="exportSplit">导出</a>
          <el-table :data="responseList" class="col-border" border style="width: 100%" max-height="300">
            <el-table-column v-if="titleName=='解挂'" prop="orderNo" align="center" label="订单号">
            </el-table-column>
            <el-table-column v-else prop="orderCode" align="center" label="订单号">
            </el-table-column>
            <el-table-column prop="orderStatus" align="center" label="订单状态">
            </el-table-column>
            <el-table-column prop="failReason" align="center" label="失败原因">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- 订单取消弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="取消订单(仅限未发货的订单)" v-loading="cancelLoading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading" :visible.sync="cancelStatus" width="700px">
        <span style="font-size:14px;float:left;">取消原因</span>
        <div style="margin:4px 0 0 70px;height:200px;overflow-y: scroll">
          <el-radio-group v-model="cancelReason">
            <div v-for="(value,key) in cancelReasonList" style="margin-bottom: 8px">
              <el-radio class="listStyle" :value="value" :key="key" :label="key">{{value}}<i
                style="color:#409eff;cursor:pointer;font-size: 16px;margin:-1px 0 0 5px" @click="delReason(key)"
                class="el-icon-circle-close-outline"></i></el-radio>
            </div>
          </el-radio-group>
          ·
        </div>
        <div style="margin: 10px 0 -10px;">
          <el-input v-model="cancelReasonText" placeholder="添加原因" :maxlength="50" @keyup.native="flagSet"
                    style="width:79%;"></el-input>
          <el-button type="primary" style="color:white;margin-left:20px" @click="addReason">添 加</el-button>
        </div>
        <br>
        <transition name="shows">
          <i class="el-icon-warning" v-show="verifyNull" style="color:#DB525A;position:absolute;">&nbsp;请添加取消原因!</i>
        </transition>
        <hr>
        <div style="text-align: right;width: 100%">
          <el-button type="primary" @click="cancelOrder">确 定</el-button>
        </div>
      </el-dialog>
      <!--取消成功，包含取消成功条数，失败条数，取消失败的具体原因-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="取消订单" :visible.sync="cancelSuccess" width="500px">
        <div style="text-align: center;line-height: 30px;">
          <i v-if="successData.failQty == 0" class="el-icon-success" style="font-size: 30px;color: #65F007"></i>
          <i v-else class="el-icon-error" style="font-size: 30px;color: red"></i>
          <div>勾选{{successData.orderTotalQty}}条，操作成功{{successData.successQty}}条，失败{{successData.failQty}}条。</div>
          <div v-show="successData.failQty!=0">失败原因：订单不符合取消订单的条件。</div>
        </div>
        <div style="text-align: center;width: 100%;margin-top: 16px;">
          <el-button @click="cancelSuccess=false">知道了</el-button>
        </div>
      </el-dialog>
      <!--勾选的订单不符合取消订单的条件-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="取消订单" :visible.sync="cancelFailed" width="500px">
        <div style="line-height: 30px;">
          <div style="font-size: 16px;color: black;font-weight: bold;text-align: center;margin-bottom: 10px">
            勾选的订单不符合取消订单的条件！
          </div>
          <div>
            <div style="display: inline-block;vertical-align: top">可取消的订单：</div>
            <div style="display: inline-block;text-align: left">
              <div>1、未发货的订单；</div>
              <div>2、不是已取消的订单；</div>
              <div>3、不是已作废的订单。</div>
            </div>
          </div>
        </div>
        <div style="text-align: center;width: 100%;margin-top: 16px;">
          <el-button @click="cancelFailed=false">知道了</el-button>
        </div>
      </el-dialog>
      <!--反取消 1000-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="反取消" :visible.sync="cancel1000" width="400px">
        <div style="text-align: center;line-height: 30px;">
          <i class="el-icon-success" style="font-size: 30px;color: #65F007"></i>
          <div>操作成功，已生成新订单！</div>
          <div>新订单为： <span style="color: #409EFF;cursor: pointer;text-decoration: underline;"
                           @click="routerDetail(0)">{{cancelF[0]}}</span></div>
        </div>
      </el-dialog>
      <!--反取消 1002-->
      <!--反取消 1003-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="取消订单" :visible.sync="cancel1003" width="400px">
        <div style="text-align: center;line-height: 30px;">
          <i class="el-icon-success" style="font-size: 30px;color: #DB525A"></i>
          <div>勾选的订单必须含有订单状态为已取消的订单！</div>
        </div>
        <div style="text-align: center;width: 100%;margin-top: 16px;">
          <el-button @click="cancel1003=false">知道了</el-button>
        </div>
      </el-dialog>
      <!--反取消 1005-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="反取消" :visible.sync="cancel1005" width="400px">
        <div style="text-align: center;line-height: 30px;">
          <div>订单中有商品的库存不足，是否继续反取消？</div>
        </div>
        <div style="text-align: center;width: 100%;margin-top: 16px;">
          <el-button type="primary" @click="clickCancel">确 定</el-button>
          <el-button @click="cancel1005=false">取 消</el-button>
        </div>
      </el-dialog>
      <!--反取消 1006-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="反取消" :visible.sync="cancel1006" width="400px">
        <div style="text-align: center;line-height: 30px;">
          <div>确定反取消订单？</div>
        </div>
        <div style="text-align: center;width: 100%;margin-top: 16px;">
          <el-button type="primary" @click="clickCancel">确 定</el-button>
          <el-button @click="cancel1006=false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 订单导入结果弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="导入结果" :visible.sync="importStatus" width="400px">
        <span style="font-size:16px;">本次导入成功：{{successFileNum}} 条，失败：{{failFileNum}} 条。</span>
        <br><br>
        <p v-show="failFileNum != 0">
          <a :href="failExcelFile">下载导入失败的订单</a>
          <br><br>
        </p>
        <el-button type="primary" style="color:white;float:right;" @click="importStatus=false">确 定</el-button>
        <br>
      </el-dialog><!--:modal="!importStatus"-->
      <!-- 批量修改不符合规定弹框 -->
      <el-dialog :close-on-click-modal="false" title="批量改仓库" :visible.sync="errStorageDialog" width="430px">
        <h5 style="font-weight:700;">勾选的订单不符合改仓库的条件，请重新选择！</h5>
        <div>
          <div style="display:inline-block;float:left;margin-top:7px;">可修改仓库的订单：</div>
          <div style="display:inline-block;line-height:30px;">
            <p>1、待客审的订单；</p>
            <p>2、已客审的订单；</p>
            <p>3、未含有挂起标记的订单；</p>
          </div>
        </div>
        <el-button style="margin:30px 0 0 100px;" @click="errStorageDialog=false">知道了</el-button>
        <br>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="批量改快递" :visible.sync="errExpressDialog" width="430px">
        <h5 style="font-weight:700;">勾选的订单不符合改快递的条件，请重新选择！</h5>
        <div>
          <div style="display:inline-block;float:left;margin-top:7px;">可修改快递的订单：</div>
          <div style="display:inline-block;line-height:30px;">
            <p>1、待客审的订单；</p>
            <p>2、已客审的订单；</p>
            <p>3、未含有挂起标记的订单；</p>
          </div>
        </div>
        <el-button style="margin:30px 0 0 100px;" @click="errExpressDialog=false">知道了</el-button>
        <br>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="改内部便签" :visible.sync="errNotesDialog" width="430px">
        <h5 style="font-weight:700;">勾选的订单不符合改内部便签的条件，请重新选择！</h5>
        <div>
          <div style="display:inline-block;float:left;margin-top:7px;">可修改内部便签的订单：</div>
          <div style="display:inline-block;line-height:30px;">
            <p>1、未发货的订单；</p>
            <p>2、不是已取消的订单；</p>
            <p>3、不是已作废的订单；</p>
          </div>
        </div>
        <el-button style="margin:30px 0 0 100px;" @click="errNotesDialog=false">知道了</el-button>
        <br>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="批量改赠品" :visible.sync="errGiftDialog" width="430px">
        <h5 style="font-weight:700;">勾选的订单不符合改赠品的条件，请重新选择！</h5>
        <div>
          <div style="display:inline-block;float:left;margin-top:7px;">可修改赠品的订单：</div>
          <div style="display:inline-block;line-height:30px;">
            <p>1、待客审的订单；</p>
            <p>2、未含有挂起标记的订单；</p>
            <p>3、不是全部退款的订单；</p>
          </div>
        </div>
        <el-button style="margin:30px 0 0 100px;" @click="errGiftDialog=false">知道了</el-button>
        <br>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="批量换商品" :visible.sync="errGoodsDialog" width="430px">
        <h5 style="font-weight:700;">勾选的订单不符合换商品的条件，请重新选择！</h5>
        <div>
          <div style="display:inline-block;float:left;margin-top:7px;">可更换商品的订单：</div>
          <div style="display:inline-block;line-height:30px;">
            <p>1、待客审的订单；</p>
            <p>2、未含有挂起标记的订单；</p>
            <p>3、不是全部退款的订单；</p>
          </div>
        </div>
        <el-button style="margin:30px 0 0 100px;" @click="errGoodsDialog=false">知道了</el-button>
        <br>
      </el-dialog>
      <!--批量修改内部便签成功-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" :title="`改${titleName}`" :visible.sync="successShowNotes" width="400px">
        <div class="successTitle">
          <i class="el-icon-success" style="font-size:25px;color:limegreen;display:inline-block;margin-top:-7px;"></i>
          <span style="font-size:16px;font-weight:normal;line-height:30px;">勾选{{allNum}}条,修改成功{{successNum}}条,失败{{faliNum}}条！</span>
          <span v-if="faliNum!=0" style="font-size:16px;font-weight:normal;line-height:30px;">失败原因：订单状态不符合修改条件！</span>
        </div>
        <el-button type="primary" @click="successShowNotes=false" class="btnFormatEnter"
                   style="margin-left:40%!important;margin-top:30px;margin-bottom:10px;">确定
        </el-button>
      </el-dialog>
      <!--部分快递失败-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="批量改快递" :visible.sync="partErrExpressDialog" width="1000px"
                 :before-close="handleClose">
        <div style="text-align:center;"><i class="el-icon-warning" style="color:red;margin-right:10px;"></i>已修改成功{{successNum}}条，失败{{faliNum}}条！
        </div>
        <div style="margin:20px 0 10px 0;">
          <span style="margin-right:10px;">失败订单列表</span>
          <el-button type="text" @click="subChangeExpress">改快递</el-button>
          <el-button type="text" @click="subHangUp">挂起</el-button>
          <a ref="downLoadFail" style="color:#409EFF;cursor:pointer;margin-left:10px;" @click="subExport">导出</a>
        </div>
        <el-table :data="partErrExpressList" class="col-border" border style="width: 100%" max-height="350"
                  @selection-change="handleSelectionChange">
          <el-table-column
            align='center'
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column prop="salesOrderNo" align="center" label="订单号">
          </el-table-column>
          <el-table-column prop="orderSign" align="center" label="标记">
          </el-table-column>
          <el-table-column prop="orderStatus" align="center" label="订单状态">
          </el-table-column>
          <el-table-column prop="payTime" align="center" width="140" label="付款时间">
          </el-table-column>
          <el-table-column prop="orderCode" align="left" width="180" label="收货地址" :show-overflow-tooltip='true'>
            <template slot-scope="scope">
              <span>{{scope.row.consigneeProvince}} {{scope.row.consigneeCity}} {{scope.row.consigneeArea}} {{scope.row.consigneeTown}}</span><br><span>{{scope.row.shippingAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="storageName" align="center" label="仓库">
          </el-table-column>
          <el-table-column prop="expressName" align="center" label="快递">
          </el-table-column>
          <el-table-column prop="failReason" align="center" label="失败原因" :show-overflow-tooltip='true'>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 批量修改仓库弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="请选择仓库" :visible.sync="batchStoreShowStatus" width="400px">
        <el-input style="width:192px;" v-model="selectStore" placeholder="请输入仓库名称"
                  suffix-icon="el-icon-search" @keyup.enter.native="storeShowSearch"></el-input>
        <el-table highlight-current-row max-height="200" border height="200" :data="warehouseListTemp"
                  @current-change="selectStoreRow" style="margin-top:20px;cursor:pointer;">
          <el-table-column type="index" align="center" width="50px" label="序号"></el-table-column>
          <el-table-column prop="storageName" align="center" label="仓库名称"></el-table-column>
        </el-table>
        <el-button type="primary" @click="updateStore"
                   style="color:white;margin-left:33%;margin-top:30px;margin-bottom:10px;">确定
        </el-button>
      </el-dialog>
      <!-- 批量修改快递弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="请选择快递" :visible.sync="batchExpressShowStatus" width="400px">
        <el-input style="width:192px;" v-model="expressInput" placeholder="请输入快递名称"
                  suffix-icon="el-icon-search" @keyup.enter.native="expressShowSearch"></el-input>
        <el-table highlight-current-row max-height="200" border height="200" @current-change="selectExpressRow"
                  :data="expressListTemp" style="margin-top:20px;">
          <el-table-column type="index" align="center" width="50px" label="序号"></el-table-column>
          <el-table-column prop="expressName" align="center" label="快递名称"></el-table-column>
        </el-table>
        <el-button type="primary" @click="updateExpress"
                   style="color:white;margin-left:33%;margin-top:30px;margin-bottom:10px;">确定
        </el-button>
      </el-dialog>
      <!-- 批量修改内部便签弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="修改内部便签" :visible.sync="batchNoteMsgShowStatus" width="600px">
        <span style="font-size:14px;">请输入内部便签</span>
        <el-input style="margin-top:10px;" rows="15" type="textarea" :maxlength="maxFont" v-model="setNoteMsg"
                  placeholder="最多输入500个字"></el-input>
        <div style="margin-top:10px;">
          <el-radio-group v-model="noteMsgType">
            <el-radio label="1">在原有内容后追加</el-radio>
            <el-radio label="0">覆盖原有内部便签</el-radio>
          </el-radio-group>
        </div>
        <el-button @click="batchNoteMsgShowStatus=false" style="margin-left:150px;">取 消</el-button>
        <el-button type="primary" @click="updateNoteMsg"
                   style="color:white;margin-top:30px;margin-bottom:10px;">确定
        </el-button>
      </el-dialog>
      <!-- 批量修改仓审须知弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="修改仓审须知" :visible.sync="batchStoreMsgShowStatus" width="600px">
        <span style="font-size:14px;">请输入仓审须知</span>
        <el-input style="margin-top:10px;" rows="15" type="textarea" :maxlength="maxFont" v-model="setStoreMsg"
                  placeholder="最多输入500个字"></el-input>
        <div style="margin-top:10px;">
          <el-radio v-model="storeMsgType" label="1">在原有内容后追加</el-radio>
          <el-radio v-model="storeMsgType" label="0">覆盖原有仓审须知</el-radio>
        </div>
        <el-button @click="batchStoreMsgShowStatus=false" style="margin-left:150px;">取 消</el-button>
        <el-button type="primary" @click="updateStoreMsg"
                   style="color:white;margin-top:30px;margin-bottom:10px;">确 定
        </el-button>
      </el-dialog>
      <!-- 标记列表弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="订单标记列表" :visible.sync="signListStatus" width="500px">
        <el-checkbox-group v-model="checkFlagList">
          <el-checkbox v-for="(item,key) in signList" :key="item.signCode" :label="item.signCode"
                       style="width:50%;margin-left:0;margin-top:10px;">{{item.signName}}
          </el-checkbox>
        </el-checkbox-group>
        <span @click="turnCustomMark"
              style="position:absolute;right:50px;bottom:40px;cursor:pointer;color:#409EFF;">自定义标记</span>
        <el-button type="primary" @click="signOrder"
                   style="color:white;margin-left:35%;margin-top:30px;margin-bottom:10px;">确 定
        </el-button>
      </el-dialog>
      <!-- 取消标记列表弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="取消标记列表" :visible.sync="clearSignListStatus" width="500px">
        <el-checkbox-group v-model="checkFlagList">
          <el-checkbox v-for="(item,key) in signList" :key="item.signCode" :label="item.signCode"
                       style="width:50%;margin-left:0;margin-top:10px;">{{item.signName}}
          </el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" @click="returnSignOrder"
                   style="color:white;margin-left:35%;margin-top:30px;margin-bottom:10px;">确 定
        </el-button>
      </el-dialog>
      <!--取消标记返回值弹框-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="取消标记" :visible.sync="cancelStatus1" width="500px">
        <div style="width: 100%;text-align: center;font-size: 14px;margin-bottom: 10px;font-weight: bold"><i
          v-if="cancelOrderList.failCount==0" class="el-icon-success"
          style="font-size: 18px;color: #09BB07;margin-right: 5px"></i><i v-else class="el-icon-warning"
                                                                          style="font-size: 18px;color: #DB525A;margin-right: 5px"></i>取消标记成功{{cancelOrderList.successCount}}个订单，失败{{cancelOrderList.failCount}}个订单！
        </div>
        <div v-if="cancelOrderList.failCount!=0">取消标记操作异常订单列表</div>
        <el-table
          v-if="cancelOrderList.failCount!=0"
          :data="cancelOrderList.funResultBeans"
          height="300"
          border
          style="width: 100%">
          <el-table-column
            prop="orderNo"
            align="center"
            label="订单编号">
          </el-table-column>
          <el-table-column
            prop="failReason"
            align="center"
            label="失败原因">
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 订单挂起弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="订单挂起" :visible.sync="headupStatus" width="500px">
        <el-radio-group v-model="headupType">
          <el-radio :label="0">覆盖原挂起原因</el-radio>
          <el-radio :label="1">追加到原挂起原因中</el-radio>
        </el-radio-group>
        <br>
        <div style="margin-top:20px;">
          <span style="font-size:14px;vertical-align:top;">挂起原因： </span>
          <el-input :rows="5" style="width:80%!important;margin-top:5px;" type="textarea"
                    v-model="headupReason"></el-input>
        </div>
        <div style="width: 100%;text-align: center;margin-top: 20px">
          <el-button @click="headupStatus=false">
            取 消
          </el-button>
          <el-button type="primary" @click="handup">
            确 定
          </el-button>
        </div>

      </el-dialog>
      <!-- 商品列表弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="商品列表" :visible.sync="dialogAddCommodity" width="800px">
        <div class="input-box">
          <el-row>
            <el-col :span="10">
              <div><label for="">商品名称：</label>
                <el-input maxlength="50" style="width:200px;" v-model="addCommodityParam.goodsName"
                          @keyup.enter.native="queryGiftBtn2"></el-input>
              </div>
            </el-col>
            <el-col :span="10">
              <div><label for="">条形码：</label>
                <el-input maxlength="50" style="width:200px;" v-model="addCommodityParam.barCode"
                          @keyup.enter.native="queryGiftBtn2"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" style="height:28px;" @click="queryGiftBtn2">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            border
            max-height="400"
            :data="addCommodityData"
            @selection-change="handleSelectionChange2"
            style="margin-top:15px;"
          >
            <el-table-column
              align='center'
              label="序号"
              type="selection"
              width="80">
            </el-table-column>
            <el-table-column
              label="序号"
              align='center'
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="imageUrl"
              align='center'
              label="图片"
              min-width="">
              <template slot-scope="scope">
                <img v-if="scope.row.goodsImageBean" :src="scope.row.goodsImageBean.imageUrl" alt="">
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsName"
              align='center'
              label="商品名称"
              width="">
            </el-table-column>
            <el-table-column
              prop="specification"
              align='center'
              min-width=''
              label="规格">
            </el-table-column>
            <el-table-column
              prop="barCode"
              label="条形码"
              min-width=''
              align='center'
              width="">
            </el-table-column>
            <!--<el-table-column
              prop="buyQty"
              align='center'
              label="库存"
              width="">
            </el-table-column>-->
          </el-table>
          <div class="dialog-pagination">
            <el-pagination
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="currentPage2"
              :page-sizes="[15, 30, 50, 100, 200]"
              :page-size="totalPage2"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum2">
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAddCommodity">取消</el-button>
          <el-button type="primary" @click="saveAddCommodity">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog v-dialogDrag
        :close-on-click-modal="false"
        title="订单标记"
        :visible.sync="dialogVisibleSuccess"
        width="500px">
        <div style="font-size: 14px;font-weight: bold">订单标记成功{{successNum1}}条，失败{{successCountNum}}条！<span
          style="font-size: 14px;font-weight: bold;">失败原因：</span><span
          style="font-size: 14px;font-weight: bold;color:red">{{faliReasonTitle}}</span></div>
        <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisibleSuccess = false">确 定</el-button>
    </span>
      </el-dialog>
      <!-- 修改收货信息弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="修改收货信息" v-if="receiptVisible" v-loading="areaLoading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading" :visible.sync="receiptVisible" width="650px">
        <span>收货人：</span>
        <el-input v-model.trim="receiveName" placeholder="请输入收货人" style="width:495px" maxlength="50"></el-input>
        <br/><br/>
        <span>手&nbsp;&nbsp;&nbsp;&nbsp;机：</span>
        <el-input v-model="receiveMobile" @keyup.native="receiveMobile = receiveMobile.replace(/[^\d]/g,'')" type="text"
                  placeholder="请输入手机号" style="width: 495px;" maxlength="50"></el-input>
        <br/><br/>
        <span>地&nbsp;&nbsp;&nbsp;&nbsp;址：</span>
        <!--<el-cascader
          placeholder="请选择" style="width:250px;"
          v-model="proCityAreaValue"
          :options="proCityAreaData"
          separator="-"
        ></el-cascader>-->
        <prov-city-area style="display:inline-block;" @channelArea="channelArea"
                        :proCityAreaValue="proCityAreaValue" :proCityAreaLabel="proCityAreaLabel"></prov-city-area>
        <div>
          <el-input v-model.trim="receiveAddress" placeholder="请输入地址" style="width: 240px;margin: 20px 0 0 53px;"
                    maxlength="100"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
      <el-button @click="receiptVisible=false" class="btnFormat">取 消</el-button>
      <el-button type="primary" @click="channelAddress" class="btnFormatEnter">确 定</el-button>
      </span>
      </el-dialog>
      <!-- 修改内部便签弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="修改内部便签" :visible.sync="noteVisible" width="600px">
        <span style="font-size: 14px;margin-bottom:5px;display:block;">
          内部便签：
        </span>
        <el-input type="textarea" :rows="20" placeholder="请输入内部便签" maxlength="500" style="width:500px;"
                  v-model.trim="noteMsg">
        </el-input>
        <el-button style="margin-left:32%;margin-top:30px;margin-bottom:8px;" @click="noteVisible=false"
                   class="btnFormat">取 消
        </el-button>
        <el-button type="primary" @click="nodeChannelSave" class="btnFormatEnter">确 定</el-button>
      </el-dialog>
      <!-- 修改仓审须知 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="修改仓审须知" :visible.sync="noticeVisible" width="600px">
        <span style="font-size: 14px;margin-bottom:5px;display:block;">
          仓审须知：
        </span>
        <el-input type="textarea" :rows="20" style="width:500px;" maxlength="500" placeholder="请输入仓审须知"
                  v-model.trim="storeMsg">
        </el-input>
        <el-button style="margin-left:32%;margin-top:30px;margin-bottom:8px;" @click="noticeVisible=false"
                   class="btnFormat">取 消
        </el-button>
        <el-button type="primary" @click="noticeChannelSave" class="btnFormatEnter">确 定</el-button>
      </el-dialog>
      <!-- 订单未合并弹窗 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="订单合并" width="1000px" :visible.sync="signVisible">
        <h5 style="color:#409eff;">提示：仅合并则只将订单进行合并，合并后的新单为待审核状态；合并后审核则将合并后的新单直接审核通过；</h5>
        <el-table :height="400" border tooltip-effect="dark" :data="signMergeList"
                  @selection-change="orderMergeMethods">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column type="selection" align="center">
          </el-table-column>
          <el-table-column label="订单编号" :show-overflow-tooltip="true" prop="salesOrderNo">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            width="95"
            prop="sourceOrderNo"
            label="外部平台单号">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            width="100" prop="payStatus" label="付款状态/时间">
            <template slot-scope="scope">
              <span>{{scope.row.payStatus}}/{{scope.row.payTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="异常标记" prop="orderSign">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="订单类型" prop="orderType">
          </el-table-column>
          <el-table-column prop="handResion" label="挂起原因">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            width="100"
            label="收货人信息">
            <template slot-scope="scope">
              <span>{{scope.row.consignee}}/{{scope.row.consigneeMobile}}/{{scope.row.shippingAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="customerMsg" label="买家留言">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="serviceMsg" label="客服备注">
          </el-table-column>
        </el-table>
        <div style="width: 100%;text-align: center;margin-top: 16px">
          <el-button type="primary" @click="onlyMergeOrder(0,0)">仅合并</el-button>
          <el-button type="primary" @click="onlyMergeOrder(1,0)">合并后审核</el-button>
        </div>
      </el-dialog>
      <!--订单手动合并不能合并列表-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="手动合并" width="600px" :visible.sync="errorVisible">
        <div style="width: 100%;text-align: center;font-weight: bold;font-size: 14px">
          <i class="el-icon-warning" style="font-size: 18px;color: #DB525A;margin-right: 5px"></i>
          <span>共执行{{allLength}}单，可合并{{okLength}}单，不可合并{{noLength}}单，请重新选择订单进行合并</span>
        </div>
        <div>
          <div style="margin: 15px 0 5px 0">不可合并的订单列表</div>
          <el-table
            :data="mergeLists.unMergeReasonList"
            :height="300"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="orderCode"
              label="订单号">
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="orderStatus"
              label="订单状态">
            </el-table-column>
            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="failReason"
              label="失败原因">
            </el-table-column>
          </el-table>
        </div>

      </el-dialog>
      <!--订单合并-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="订单合并" width="1100px" :visible.sync="mergeVisible">
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple"
            ></div>
            <div style="color: #FF0000;margin-top: -30px">注：请选择其中一单作为主订单，合并后收货人信息均取自主单，可在下列中对合并订单收货人信息进行修改</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <div class="grid-content bg-purple"
                 style="width: 100%;height: 100%;padding-right: 5px">
              <div>
                <el-table
                  :data="mergeLists.mergeList"
                  tooltip-effect="dark"
                  border
                  :height="500"
                  style="width:100%">
                  <el-table-column
                    type="index"
                    label="序号">
                  </el-table-column>
                  <el-table-column
                    label=""
                    width="40"
                  >
                    <template slot-scope="scope">
                      <el-radio class="fh-radio" :label="scope.$index" v-model="radio"
                                @change.native="getCurrentRow(scope.$index)">
                        &nbsp;
                      </el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="salesOrderNo"
                    :show-overflow-tooltip="true"
                    label="订单编号">
                  </el-table-column>
                  <el-table-column
                    prop="sourceOrderNo"
                    :show-overflow-tooltip="true"
                    min-width="100"
                    label="外部平台单号">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    min-width="100"
                    :show-overflow-tooltip="true"
                    label="付款状态/时间">
                    <template slot-scope="scope">
                      <span>{{scope.row.payStatus}}/{{scope.row.payTime}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="orderStatus"
                    align="center"
                    :show-overflow-tooltip="true"
                    label="订单状态">
                  </el-table-column>
                  <el-table-column
                    prop="handResion"
                    :show-overflow-tooltip="true"
                    label="挂起原因">
                  </el-table-column>
                  <el-table-column
                    min-width="90"
                    :show-overflow-tooltip="true"
                    label="收货人信息">
                    <template slot-scope="scope">
                      <span>{{scope.row.consignee}}，{{scope.row.consigneeMobile}}，{{scope.row.shippingAddress}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="customerMsg"
                    :show-overflow-tooltip="true"
                    label="买家留言">
                  </el-table-column>
                  <el-table-column
                    prop="serviceMsg"
                    :show-overflow-tooltip="true"
                    label="客服备注">
                  </el-table-column>
                  <el-table-column
                    prop="storageName"
                    :show-overflow-tooltip="true"
                    label="仓库">
                  </el-table-column>
                  <el-table-column
                    prop="expressName"
                    :show-overflow-tooltip="true"
                    label="快递">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple-light">
              <div style="height: 26px;width: 100%;background: #eee;line-height: 26px;padding: 0 10px">
                <span style="float: left;color: #333333;font-weight: bold">收货信息</span>
                <span style="float: right;color: #409EFF;cursor: pointer" @click="handleAmend">手动修改</span></div>
              <div style="padding: 10px 0 0 10px;overflow-y: scroll;height: 475px;">
                <el-row>
                  <el-col :span="4">
                    <div class="grid-content bg-purple">
                      <div>收货人</div>
                    </div>
                  </el-col>
                  <el-col :span="20">
                    <div class="grid-content bg-purple-light">
                      <el-radio-group v-if="isShow" v-model="radio1" @change="changeName(radio1)">
                        <el-radio v-for="(item,index) in mergeLists.mergeList" :key="index" :label="index"
                                  style="margin:0 16px 10px 0">&nbsp;{{item.consignee}}
                        </el-radio>
                      </el-radio-group>
                      <el-input v-else v-model="ruleForm.people"></el-input>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <div class="grid-content bg-purple">
                      <div>手机</div>
                    </div>
                  </el-col>
                  <el-col :span="20">
                    <div class="grid-content bg-purple-light">
                      <el-radio-group v-if="isShow" v-model="radio2" @change="changePhone(radio2)">
                        <el-radio v-for="(item,index) in mergeLists.mergeList" :key="index" :label="index"
                                  style="margin:0 16px 10px 0">&nbsp;{{item.consigneeMobile}}
                        </el-radio>
                      </el-radio-group>
                      <el-input v-else v-model="ruleForm.phone"></el-input>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <div class="grid-content bg-purple">
                      <div>收货地址</div>
                    </div>
                  </el-col>
                  <el-col :span="20">
                    <div class="grid-content bg-purple-light">
                      <el-radio-group v-if="isShow" v-model="radio3" @change="changeAddress(radio3)">
                        <el-radio v-for="(item,index) in mergeLists.mergeList" :label="index" :key="index"
                                  style="margin:0 0 10px 0">&nbsp;{{item.shippingAddress}}
                        </el-radio>
                      </el-radio-group>
                      <div v-else style="line-height: 36px">
                        <prov-city-area style="display:inline-block;" @channelArea="channelArea"
                                        :proCityAreaValue="mergeValue" :proCityAreaLabel="mergeLabel"></prov-city-area>
                        <!--<el-cascader
                          placeholder="请选择" style="width:308px;"
                          v-model="mergeValue"
                          :options="proCityAreaData"
                          separator="-"
                          change-on-select
                        ></el-cascader>-->
                        <el-input v-model="ruleForm.town" style="width: 95%"></el-input>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
        <div style="width: 100%;text-align: right">
          <el-button type="primary" :loading="holdClick" @click="onlyMerge(0,0)">仅合并</el-button>
          <el-button type="primary" :loading="holdClick" @click="onlyMerge(1,0)">合并后审核</el-button>
        </div>
      </el-dialog>
      <!--订单合并成功弹框-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="订单合并" width="400px" :visible.sync="mergeSuccess">
        <div><i class="el-icon-success" style="font-size: 18px;color: #09BB07;margin-right: 5px"></i>
          <span>订单合并成功，订单编号为</span>
          <span style="color: #409EFF;cursor: pointer;text-decoration: underline;" @click="routerDetail(1)">{{orderSuccess}}</span>
        </div>
        <div v-if="catelogue" style="margin-left: 27px">{{messageMsg}}!</div>
        <div style="width: 100%;text-align: center;margin-top: 10px">
          <el-button type="primary" @click="mergeSuccess=false;mergeVisible=false">确 认</el-button>
        </div>
      </el-dialog>
      <!--未合并-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="强制合并" width="400px" :visible.sync="forcedMerge">
        <div style="width: 100%;text-align: center">
          所合并的订单中含挂起订单确认强制合并？
        </div>
        <div style="width: 100%;text-align: center;margin-top: 10px">
          <el-button type="primary" @click="onlyMergeOrder(0,1)">确 定</el-button>
          <el-button @click="forcedMerge=false;mergeVisible=false;">取 消</el-button>
        </div>
      </el-dialog>
      <!--未合并合并-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="强制合并" width="400px" :visible.sync="forcedMerge2">
        <div style="width: 100%;text-align: center">
          所合并的订单中含挂起订单确认强制合并？
        </div>
        <div style="width: 100%;text-align: center;margin-top: 10px">
          <el-button type="primary" @click="onlyMergeOrder(1,1)">确 定</el-button>
          <el-button @click="forcedMerge2=false;mergeVisible=false;">取 消</el-button>
        </div>
      </el-dialog>
      <!--手动合并-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="强制合并" width="400px" :visible.sync="forcedMerge1">
        <div style="width: 100%;text-align: center">
          所合并的订单中含挂起订单确认强制合并？
        </div>
        <div style="width: 100%;text-align: center;margin-top: 10px">
          <el-button type="primary" @click="onlyMerge(0,1)">确 定</el-button>
          <el-button @click="forcedMerge1=false;mergeVisible=false;">取 消</el-button>
        </div>
      </el-dialog>
      <!--手动合并-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="强制合并" width="400px" :visible.sync="forcedMerge3">
        <div style="width: 100%;text-align: center">
          所合并的订单中含挂起订单确认强制合并？
        </div>
        <div style="width: 100%;text-align: center;margin-top: 10px">
          <el-button type="primary" @click="onlyMerge(1,1)">确 定</el-button>
          <el-button @click="forcedMerge3=false;mergeVisible=false;">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 订单导入 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="订单导入" width="1000px" v-loading="loading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading" :visible.sync="orderImport">
        <div style="display:inline-block;width:495px;height:650px;" class="order-export-left">
          <span
            style="color:red;position:absolute;left:78px;font-size:21px;padding-top:3px;font-size:12px;">*</span><span
          class="selectShopList">请选择导入订单所属店铺：</span>
          <el-select v-model="importShop" style="width:200px;" placeholder="请选择店铺">
            <el-option v-for="item in shopList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <br>
          <span class="selectShopList" style="margin-top:10px;">自定义导入模板的列名对应关系：</span>
          <el-select v-model="templateName" style="width:200px;" placeholder="请选择对应关系">
          </el-select>
          <br>
          <span class="selectShopList" style="margin-top:10px;">请选择要导入订单：</span>
          <el-button style="width:200px!important;" class="import-btn" @click="fileUpload" :title="exportName">{{exportName}}</el-button>
          <input type="file" style="display:none" ref="fileBtn" @change="fileSelect">
          <el-button type="primary" style="color:white;margin-left:5px;" @click="uploadFile">确定导入</el-button>
          <div style="margin-top:10px;">
            <span>导入说明：</span><br>
            <p>1、导入前请先<a
              :href="`http://${imgUpload}/files-web/download/${fileId}`"
              style="text-decoration:underline;">下载订单导入模板</a>，在导入模板中填写需要导入的订单数据。</p>
            <p>2、导入模板中，红色表头表示必填列，其它为非必填列。</p>
            <p>3、导入失败的订单，会在excel最后面加一列提示失败原因，商家可根据提示失败原因修改订单信息，然后重新导入。</p>
            <p>4、每次最多导入10000条订单。</p>
            <p>5、部分导入列说明</p>
            <p>× 相同平台单号明细视为同一订单，多行完全相同的明细无法导入；</p>
            <p>× 同一订单中不同明细“下单时间、买家信息、订单付款时间、支付方式、支付宝交易号、买家留言、订单备注、旗帜颜色、货到付款状态、买家货到付款服务费、
              首次付款金额、二次付款金额、买家实际支付金额、买家应付邮费、快递代收款、买家积分支付金额、平台红包、平台代金券、快递、发票信息”需保持一致；</p>
            <p>× 填写“首次付款金额”为定金订单，“货到付款状态”为“是”的订单为货到付款订单，其他状态均为正常订单；</p>
            <p>× 填写“订单付款时间”时订单状态为“已付款”，未付款订单不允许导入；</p>
            <p>×“退款状态”决定订单明细退款状态，所有明细均为“已退款”时订单状态为交易关闭；</p>
            <p>×“发货时间”决定订单明细发货状态，仅部分明细填写发货时间为“部分发货”，所有明细均填写发货时间为“已发货”；</p>
            <p>×“完成时间”决定订单明细完成状态，全部明细均填写完成时间订单为交易完成；</p>
            <p>× 快递，填写ERP档案中软件名称，填写时表示订单使用填写的快递发货；</p>
            <p>× 发票抬头类型，有个人、企业，填写企业时需要填写纳税人识别号；</p>
            <p>× 发票内容有明细、办公用品、电脑配件、耗材；</p>
          </div>
        </div>
        <div class="setOrderRow">
          <span
            style="font-size:14px;margin-left:20px;margin-top:10px;display:inline-block;">标准导入模板与用户自定义模板列名的对应关系：</span>
          <el-input style="margin-left:20px;width:355px;margin-bottom:10px;margin-top:5px;" v-model="userTemplateName"
                    placeholder="请输入对照关系名称"></el-input>
          <div class="changeList">
            <div style="width:50%">
              <ul>
                <li class="rowTitle" style="background:#eeeeee!important;">标准列名</li>
                <li v-for="item in rowsList" class="rowTitle"><span v-show="item.must"
                                                                    style="color:red;vertical-align:middle;">*&nbsp;</span><span>{{item.name}}</span>
                </li>
              </ul>
            </div>
            <div style="width:50%">
              <li class="rowTitle" style="background:#eeeeee!important;">自定义列名</li>
              <li class="rowTitle">
                <el-input v-model="rowName.outOrderId" :maxlength="50"></el-input>
              </li>
              <li class="rowTitle">
                <el-date-picker :editable="false" style="width:100%;" type="datetime"
                                v-model="rowName.createDate"></el-date-picker>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.buyerId" :maxlength="30"></el-input>
              </li>
              <li class="rowTitle">
                <el-select v-model="rowName.payType">
                  <el-option v-for="(value,key) in payList" :value="key" :label="value" :key="key"></el-option>
                </el-select>
              </li>
              <li class="rowTitle">
                <el-select v-model="rowName.payStatus">
                  <el-option v-for="(value,key) in payStatusList" :value="key" :label="value" :key="key"></el-option>
                </el-select>
              </li>

              <li class="rowTitle">
                <el-date-picker :editable="false" style="width:100%;" type="datetime"
                                v-model="rowName.payDate"></el-date-picker>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.payCode" :maxlength="50"></el-input>
              </li>
              <li class="rowTitle">
                <el-select v-model="rowName.orderType">
                  <el-option v-for="(value,key) in orderTypeList" :label="value" :value="value" :key="key"></el-option>
                </el-select>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.fristGold"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.secondGold"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.moneypPost"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.moneyOrder"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.servMsg" :maxlength="50"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.noteMsg" :maxlength="50"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.receiveName" :maxlength="50"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.receiveMobile" :maxlength="20"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.receivePhone" :maxlength="30"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.province"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.city"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.county"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.receiveAddress" :maxlength="checkLength_4"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.zipCode" :maxlength="checkLength_5"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.express" :maxlength="checkLength_6"></el-input>
              </li>
              <li class="rowTitle">
                <el-select v-model="rowName.delivery">
                  <el-option v-for="(value,key) in deliveryList" :label="value" :value="key" :key="key"></el-option>
                </el-select>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.deliveryCash"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.preferential"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.integral"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.envelope"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.coupon"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.invoice" :maxlength="checkLength"></el-input>
              </li>
              <li class="rowTitle">
                <el-select v-model="rowName.invoiceHeadType">
                  <el-option v-for="(value,key) in invoiceHeadTypeList" :value="value" :label="value"
                             :key="key"></el-option>
                </el-select>
              </li>
              <li class="rowTitle">
                <el-select v-model="rowName.invoiceType">
                  <el-option v-for="(value,key) in invoiceTypeList" :value="value" :lable="value"
                             :key="key"></el-option>
                </el-select>
              </li>
              <li class="rowTitle">
                <el-select v-model="rowName.invoiceContent">
                  <el-option v-for="(value,key) in invoiceContentList" :value="value" :label="value"
                             :key="key"></el-option>
                </el-select>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.taxpayerCode" :maxlength="100"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.bank" :maxlength="100"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.account" :maxlength="100"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.barcode" :maxlength="50"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.skuPlatname" :maxlength="50"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.skuPlatspec" :maxlength="50"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.num"></el-input>
              </li>
              <li class="rowTitle">
                <el-input v-model="rowName.single"></el-input>
              </li>
            </div>
          </div>
          <el-button type="primary" style="color:white;margin-top:80px;margin-left:35%;">保 存</el-button>
        </div>
      </el-dialog>
      <!-- 保存查询方案 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="保存查询方案" :visible.sync="conditionVisible" width="410px">
        <span style="font-size: 14px;margin-left: 12px;">方案名称：</span>
        <el-input placeholder="请输入查询方案名称" :maxlength="50" style="width: 210px;height:30px"
                  v-model.trim="searchCondition">
        </el-input>
        <el-button @click="conditionVisible=false" class="btnFormat"
                   style="margin-left:17%;margin-top:25px;margin-bottom:8px;">取 消
        </el-button>
        <el-button type="primary" @click="channelProgrameSave" class="btnFormatEnter">确 定</el-button>
      </el-dialog>
      <!-- 方案另存为 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="方案保存为" :visible.sync="saveSet" width="400px">
        <el-radio-group v-model="saveSwitch">
          <el-radio label="3">当前方案</el-radio>
          <br/><br/>
          <el-radio label="6">新方案：
            <el-input placeholder="请输入查询方案名称" :maxlength="50" style="width: 85%;" v-model="searchCondition">
            </el-input>
          </el-radio>
        </el-radio-group>
        <el-button @click="saveSet=false" style="margin:25px 10px 5px 45px">取 消</el-button>
        <el-button type="primary" @click="channelProgrameUpdate">确 定</el-button>
      </el-dialog>
      <!-- 常用查询方案弹框 -->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="常用查询方案" :visible.sync="commonConditionVisible" width="500px">
        <el-radio-group v-model="saveCondition" style="margin-top:-22px;">
          <el-radio v-for="item in conditionList" :key="item.queryPlanId" :label="item.queryPlanId" class="radioStyle">
            {{item.queryPlanName}}
            <el-button style="float:right;margin-right:100px;height:30px;padding:0;" class="schemeBtn"
                       @click="deleteProject(item)">删 除
            </el-button>
          </el-radio>
        </el-radio-group>
        <el-button @click="commonConditionVisible=false" style="margin-left:25%;margin-top:30px;margin-bottom:8px;"
                   class="btnFormat">取 消
        </el-button>
        <el-button type="primary" @click="channelCommonCondition" class="btnFormatEnter">确 定</el-button>
      </el-dialog>
      <!--批量手拆-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="批量拆分" :visible.sync="batchSplitVisible" width="900px">
        <span>拆分方式：</span>
        <el-radio-group v-model="splitWay">
          <el-tooltip placement="top" effect="light">
            <div slot="content">所选商品均拆分到一条新订单中</div>
            <el-radio label="1">拆至一单</el-radio>
          </el-tooltip>
          <el-tooltip placement="top" effect="light">
            <div slot="content">所选商品每一SKU商品分别拆分到一条新订单中</div>
            <el-radio label="2">拆至多单</el-radio>
          </el-tooltip>
        </el-radio-group>
        <hr style="margin-top:10px;">
        <div>
          <el-select id="enableFlag" v-model="batchSplitObj.type" style="width:120px;" placeholder="">
            <el-option v-for="(value,key) in batchSplitList" :key="key" :label="value" :value="key">
            </el-option>
          </el-select>
          <el-input type="text" v-model="batchSplitObj.info" style="width:180px;" @keyup.enter.native="batchSplitQuery"
                    placeholder="请准备输入内容"></el-input>
          <el-button type="primary" style="float:right;" @click="batchSplitQuery">查询</el-button>
        </div>
        <el-table border height="400" :data="batchSplitData"
                  @selection-change="batchSplitSelection" style="margin-top:20px;cursor:pointer;">
          <el-table-column align='center' type="selection" width="50"></el-table-column>
          <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
          <el-table-column prop="goodsUrl" align="center" label="商品图片">
            <template slot-scope="scope">
              <img v-if="scope.row.goodsUrl" :src="scope.row.goodsUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="goodsCode" align="center" label="商品编号"></el-table-column>
          <el-table-column prop="goodsBarCode" align="center" label="条形码"></el-table-column>
          <el-table-column prop="goodsName" align="center" label="商品名称"></el-table-column>
          <el-table-column prop="goodsSpec" align="center" label="规格"></el-table-column>
          <el-table-column prop="brand" align="center" label="商品品牌"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
           <el-button @click="batchSplitVisible=false">取 消</el-button>
           <el-button type="primary" @click="batchSplitSave">执行拆分</el-button>
        </span>
      </el-dialog>
      <!--手动拆分-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="手动拆分" v-loading="loading" element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading" :visible.sync="manualSplitVisible" width="1270px">
        <p><span>买家留言：</span><span>{{manualSplitObj.customerMsg}}</span></p>
        <p style="margin:10px 0;">
          <span>客服备注：</span><span
          style="margin-bottom:-5px;display: inline-block;width:605px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{manualSplitObj.serviceMsg}}</span>
          <span>拆出明细</span>
        </p>
        <div>
          <div style="width:665px;display:inline-block;">
            <el-table border height="600" ref="multipleTable" :data="manualSplitObj.funSplitOrderDetailsBean"
                      @selection-change="manualSplitSelection">
              <el-table-column align='center' type="selection" fixed="left" :selectable='checkboxInit'
                               width="50"></el-table-column>
              <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
              <el-table-column prop="goodsUrl" align="center" label="商品图片">
                <template slot-scope="scope">
                  <img v-if="scope.row.goodsUrl" :src="scope.row.goodsUrl" alt="">
                </template>
              </el-table-column>
              <el-table-column prop="goodsBarCode" align="center" label="条形码"></el-table-column>
              <el-table-column prop="goodsName" align="center" label="商品名称" width="150" :show-overflow-tooltip='true'>
                <template slot-scope="scope">
                  <span v-if="scope.row.presellFlag && !scope.row.classFlag" style="color:green;">【预】</span>
                  <span v-if="scope.row.giftFlag && !scope.row.classFlag" style="color:#FD00FF;">【赠】</span>
                  <span v-if="scope.row.refundFlag && !scope.row.classFlag" style="color:red;">【退】</span>
                  <span v-if="scope.row.suitFlag && !scope.row.classFlag" style="color:#0000FF;cursor:pointer;"
                        @click="showSuitList(scope.$index,scope.row)">【套】</span>
                  {{scope.row.goodsName}}
                </template>
              </el-table-column>
              <el-table-column prop="goodsSpec" align="center" label="规格"></el-table-column>
              <el-table-column prop="goodsQty" align="center" label="订货数量"></el-table-column>
              <el-table-column prop="removableQty" align="center" label="可拆数量"></el-table-column>
              <el-table-column prop="splitQty" align="center" label="拆分数量">
                <template slot-scope="scope">
                  <el-input type='text' :disabled="scope.row.isDisabled" v-model="scope.row.splitQty"
                            @keyup.native="splitQtyKeyup(scope.$index,scope.row)"
                            @blur="splitQtyBlur(scope.$index,scope.row)"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" style="margin:10px 0 0 280px;" @click="detachBtn">拆出</el-button>
          </div>
          <div style="display:inline-block;width:500px;">
            <div style="height:600px;width:100%;overflow-y:scroll;border:1px solid #eee;">
              <div v-for="(item,i) in splitOrderBeansJson">
                <div style="margin:5px;">
                  <span>明细{{i + 1}}</span>
                  <el-button type="text" style="float:right;" @click="rollBack(item,i)">回退</el-button>
                </div>
                <el-table :data="item.orderDetails">
                  <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
                  <el-table-column prop="goodsBarCode" align="center" label="条形码"></el-table-column>
                  <el-table-column prop="goodsName" align="center" label="商品名称">
                    <template slot-scope="scope">
                      {{scope.row.goodsName}}
                      <span v-if="scope.row.classFlag">（套单）</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="goodsSpec" align="center" label="规格"></el-table-column>
                  <el-table-column prop="splitQty" align="center" label="拆分数量"></el-table-column>
                </el-table>
              </div>
            </div>
            <el-button type="primary" style="margin:10px 0 0 200px;" @click="detachSave">确认拆分</el-button>
          </div>
        </div>
      </el-dialog>
      <!--拆分成功-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="拆分结果" :visible.sync="splitSuccessDialog" width="460px">
        <span>订单拆分成功，订单编号为</span>
        <span v-for="(item,i) in splitCodeArr" @click="codeLink(item,i)" style="line-height: 30px;"><span
          style="color: #007aff;cursor:pointer;">{{item}}</span><span v-if="splitCodeArr.length-1!=i">、</span></span>。
        <br><br>
        <el-button type="primary" style="color:white;float:right;" @click="splitSuccessDialog=false">确 定</el-button>
        <br>
      </el-dialog>
      <!--商品详细信息-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="商品详细信息" :visible.sync="goodsDetailDialog" v-if="goodsDetailDialog"
                 width="1100px">
        <order-detail-dialog :isOperation="true" :salesOrderId="salesOrderId"></order-detail-dialog>
      </el-dialog>
      <!--部分改赠品失败-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="批量改赠品" :visible.sync="batchPartGiftDialog" width="1000px">
        <div style="text-align:center;"><i class="el-icon-warning" style="color:red;margin-right:10px;"></i>已修改成功{{successNum}}条，失败{{faliNum}}条！
          <p style="line-height: 30px;">失败原因：{{errFailReason}}。</p>
        </div>
        <div style="margin:20px 0 10px 0;">
          <span style="margin-right:10px;">失败订单列表</span>
          <el-button type="text" @click="complimentaryOrShop">挂起</el-button>
          <a ref="downLoadFail" style="color:#409EFF;cursor:pointer;margin-left:10px;"
             @click="subExport1('gift')">导出</a>
        </div>
        <el-table :data="partErrGiftList" class="col-border" border style="width: 100%" max-height="350"
                  @selection-change="handleSelectionChange1">
          <el-table-column
            align='center'
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column prop="orderCode" align="center" label="订单号">
            <template slot-scope="scope">
              <p>{{ scope.row.orderCode}}</p>
              <span style="background:orange;color:#fff;padding:2px;"
                    v-if="scope.row.orderSign">{{ scope.row.orderSign}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" align="center" label="订单状态">
          </el-table-column>
          <el-table-column prop="payTime" align="center" width="140" label="付款时间">
            <template slot-scope="scope">
              <span v-if="scope.row.payTime">{{ scope.row.payTime | turnTimestamp}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="buyerMsg" align="center" label="买家留言" width="150" :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column prop="servMsg" align="center" label="客服备注" width="150" :show-overflow-tooltip='true'>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!--批量改赠品-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="批量改赠品" :visible.sync="batchChangeGiftDialog" width="700px"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading">
        <div class="change-gift-1">
          <span>修改赠品类型：</span>
          <el-radio-group v-model="changeGiftObj.changeType" :disabled="!!this.changeGiftObj.giftBarCode"
                          @change="changeTypeChannel(changeGiftObj.changeType)">
            <el-radio :label="1">添加指定数量的赠品</el-radio>
            <el-radio :label="2">删除指定数量的赠品</el-radio>
          </el-radio-group>
        </div>
        <div class="change-gift-1">
          <span>请选择赠品：</span>
          <!--maxlength="50" @keyup.native="changeGiftObj.giftBarCode = changeGiftObj.giftBarCode.replace(/[^\d|a-z]/ig,'')"-->
          <el-input type="text" v-model="changeGiftObj.giftBarCode" placeholder="可输入条形码"
                    style="width:250px;"></el-input>
          <el-button type="primary" @click="chooseGift">选择</el-button>
        </div>
        <div class="change-gift-1">
          <span>数量：</span>
          <el-input type='text' maxlength="5"
                    @keyup.native="changeGiftObj.giftNum = changeGiftObj.giftNum.replace(/[^\d]/g,'')"
                    v-model="changeGiftObj.giftNum" style="width:250px;"></el-input>
        </div>
        <div class="change-gift-1">
          <span></span>
          <el-checkbox v-model="changeGiftObj.addUpFlag">{{changeTypeName}}</el-checkbox>
        </div>
        <div class="change-gift-1">
          <el-button type="primary" style="margin-left:170px;" @click="batchChangeSave">批量修改</el-button>
        </div>
        <div style="color:red;">
          <p>注意：</p>
          <p>1、已客审通过的订单不会修改；</p>
          <p>2、已挂起的订单不会修改；</p>
          <p>3、全部退款的订单不会修改。</p>
        </div>
      </el-dialog>
      <!--选择赠品（加赠品）-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="请选择赠品" :visible.sync="selectAddGiftDialog" width="1200px"
                 v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <div class="input-box">
          <el-row>
            <el-col :span="4">
              <div><label for="">赠品名称：</label>
                <el-input maxlength="50" style="width:110px;" v-model="addGiftObj.giftName"
                          @keyup.enter.native="queryGiftBtn1"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <div><label for="">赠品编号：</label>
                <el-input maxlength="50" style="width:110px;" v-model="addGiftObj.giftCode"
                          @keyup.enter.native="queryGiftBtn1"></el-input>
              </div>
            </el-col>
            <el-col :span="4">
              <div><label for="">条形码：</label>
                <el-input maxlength="50" style="width:110px;" v-model="addGiftObj.giftBarCode"
                          @keyup.enter.native="queryGiftBtn1"></el-input>
              </div>
            </el-col>
            <el-col :span="4" v-if="openManGiftInv">
              <div><label for="">销售状态：</label>
                <el-select v-model="addGiftObj.giftSalesStatus" placeholder="" style="width:110px;">
                  <el-option label="全部" value="-1"></el-option>
                  <el-option label="可售可赠" value="1"></el-option>
                  <el-option label="仅可赠" value="2"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="4">
              <div><label for="">是否套装：</label>
                <el-select v-model="addGiftObj.giftSuitFlag" placeholder="" style="width:110px;">
                  <el-option label="全部" value="-1"></el-option>
                  <el-option label="单品" value="0"></el-option>
                  <el-option label="套装" value="1"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" style="height:28px;margin-left:10px;" @click="queryGiftBtn1">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="selectAddGiftDialogLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            border
            highlight-current-row
            height="400"
            :data="addGiftData1"
            @current-change="selecGiftRow1"
            style="margin-top:15px;"
          >
            <el-table-column
              label="序号"
              align='center'
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="imageUrl"
              align='center'
              label="赠品图片"
              min-width="">
              <template slot-scope="scope">
                <img v-if="scope.row.goodsUrl" :src="scope.row.goodsUrl" alt="">
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsCode"
              align='center'
              label="赠品编号"
              width="">
            </el-table-column>
            <el-table-column
              prop="goodsBarCode"
              align='center'
              min-width=''
              label="条形码">
            </el-table-column>
            <el-table-column
              prop="goodsName"
              label="赠品名称"
              min-width=''
              align='center'
              width="">
            </el-table-column>
            <el-table-column
              prop="goodsSpec"
              align='center'
              label="规格"
              width="">
            </el-table-column>
            <el-table-column
              prop="salesPrice"
              align='center'
              label="软件售价"
              width="">
            </el-table-column>
            <el-table-column
              prop="suitFlag"
              align='center'
              label="是否套装"
              width="">
              <template slot-scope="scope">
                <span v-if="scope.row.suitFlag">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="giftType"
              align='center'
              label="销售状态"
              v-if="openManGiftInv"
              width="">
              <template slot-scope="scope">
                <span v-if="scope.row.giftType==1">可售可赠</span>
                <span v-else>仅可赠</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="saleQty"
              align='center'
              label="可售库存"
              v-if="openManGiftInv"
              width="">
              <template slot-scope="scope">
                <span v-if="scope.row.saleQty > 0">{{scope.row.saleQty}}</span>
                <span v-else style="color:red;">{{scope.row.saleQty}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="readyForSale"
              align='center'
              label="可售现货"
              v-if="!openManGiftInv"
              width="">
            </el-table-column>

            <!--宝洁新增-->
            <el-table-column v-if="!isSuitShow" label="单品组套最大可售" align="center">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales >= 0">{{ scope.row.suitMaxSales
                  }}</span>
                <span
                  v-else-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales < 0">0</span>
                <span v-else>-</span>
              </template>
            </el-table-column>

          </el-table>
          <div class="dialog-pagination">
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage1"
              :page-sizes="[15, 30, 50, 100, 200]"
              :page-size="totalPage1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum1">
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectAddGiftDialog=false">取消</el-button>
          <el-button type="primary" @click="saveAddGift1">确定</el-button>
        </span>
      </el-dialog>
      <!--选择赠品（删赠品）-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="请选择赠品" :visible.sync="selectDelGiftDialog" width="1200px">
        <div class="input-box">
          <el-row>
            <el-col :span="5">
              <div><label for="">商品名称：</label>
                <el-input maxlength="50" style="width:150px;" v-model="delGiftObj.giftName"
                          @keyup.enter.native="queryGiftBtn3"></el-input>
              </div>
            </el-col>
            <el-col :span="5">
              <div><label for="">商品编号：</label>
                <el-input maxlength="50" style="width:150px;" v-model="delGiftObj.giftCode"
                          @keyup.enter.native="queryGiftBtn3"></el-input>
              </div>
            </el-col>
            <el-col :span="5">
              <div><label for="">条形码：</label>
                <el-input maxlength="50" style="width:150px;" v-model="delGiftObj.giftBarCode"
                          @keyup.enter.native="queryGiftBtn3"></el-input>
              </div>
            </el-col>
            <el-col :span="5">
              <div><label for="">是否套装：</label>
                <el-select v-model="delGiftObj.giftSuitFlag" placeholder="" style="width:150px;">
                  <el-option label="全部" value="-1"></el-option>
                  <el-option label="单品" value="0"></el-option>
                  <el-option label="套装" value="1"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" style="height:28px;margin-left:10px;" @click="queryGiftBtn3">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="selectDelGiftDialogLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            border
            highlight-current-row
            height="400"
            :data="addGiftData3"
            @current-change="selecGiftRow3"
            style="margin-top:15px;"
          >
            <el-table-column
              label="序号"
              align='center'
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="imageUrl"
              align='center'
              label="赠品图片"
              min-width="">
              <template slot-scope="scope">
                <img v-if="scope.row.goodsUrl" :src="scope.row.goodsUrl" alt="">
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsCode"
              align='center'
              label="赠品编号"
              width="">
            </el-table-column>
            <el-table-column
              prop="goodsBarCode"
              align='center'
              min-width=''
              label="条形码">
            </el-table-column>
            <el-table-column
              prop="goodsName"
              label="赠品名称"
              min-width=''
              align='center'
              width="">
            </el-table-column>
            <el-table-column
              prop="goodsSpec"
              align='center'
              label="规格"
              width="">
            </el-table-column>
            <el-table-column
              prop="salesPrice"
              align='center'
              label="软件售价"
              width="">
            </el-table-column>
            <el-table-column
              prop="suitFlag"
              align='center'
              label="是否套装"
              width="">
              <template slot-scope="scope">
                <span v-if="scope.row.suitFlag">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="giftType"
              align='center'
              label="销售状态"
              v-if="openManGiftInv"
              width="">
              <template slot-scope="scope">
                <span v-if="scope.row.giftType==1">可售可赠</span>
                <span v-else>仅可赠</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="saleQty"
              align='center'
              label="可售库存"
              v-if="openManGiftInv"
              width="">
            </el-table-column>
            <el-table-column
              prop="readyForSale"
              align='center'
              label="可售现货"
              v-if="!openManGiftInv"
              width="">
            </el-table-column>
            <el-table-column
              :render-header="renderHeader1"
              prop="existOrderNum"
              align='center'
              width="">
            </el-table-column>
          </el-table>
          <div class="dialog-pagination">
            <el-pagination
              @size-change="handleSizeChange3"
              @current-change="handleCurrentChange3"
              :current-page="currentPage3"
              :page-sizes="[15, 30, 50, 100, 200]"
              :page-size="totalPage3"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum3">
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectDelGiftDialog=false">取消</el-button>
          <el-button type="primary" @click="saveAddGift3">确定</el-button>
        </span>
      </el-dialog>

      <!--批量换商品-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="批量换商品（仅支持一对一替换）" :visible.sync="batchExchangeGoodsDialog"
                 width="1200px" v-loading="loading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading">
        <div class="change-gift-2">
          <span>请选择替换的商品：</span>
          <!--maxlength="50" @keyup.native="changeGoodsObj.newSkuBarCode = changeGoodsObj.newSkuBarCode.replace(/[^\d|a-z]/ig,'')"-->
          <el-input type="text" v-model="changeGoodsObj.newSkuBarCode" placeholder="可输入条形码"
                    style="width:250px;"></el-input>
          <el-button type="primary" style="width:80px !important;" @click="chooseGoods">选择</el-button>
          <el-button type="primary" @click="batchReplaceGoods">批量替换</el-button>
        </div>
        <div class="change-gift-2">
          <span>替换商品规则：</span>
          <el-checkbox-group v-model="changeGoodsObj.replaceList" style="width:530px;display:inline-block;">
            <el-checkbox label="1" style="margin-right:0px;">替换订单中的正常商品</el-checkbox>
            <el-checkbox label="2" style="margin-left:15px;margin-right:0;">替换订单中的赠品</el-checkbox>
            <el-checkbox label="3" style="margin-left:15px;">替换订单中的预售商品</el-checkbox>
          </el-checkbox-group>
          <p style="color:red;display:inline;">注意：退款商品不支持换货</p>
        </div>
        <p>请选择原商品</p>
        <div style="width:100%;border:1px solid #eee;margin-top:10px;padding-top:15px;">
          <div class="input-box">
            <el-row>
              <el-col :span="5" style="margin-left:15px;">
                <div><label for="">是否套装：</label>
                  <el-select v-model="primaryGoodsObj.suitFlag" placeholder="" style="width:150px;">
                    <el-option label="全部" value="-1"></el-option>
                    <el-option label="单品" value="0"></el-option>
                    <el-option label="套装" value="1"></el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="5">
                <div><label for="">条形码：</label>
                  <el-input maxlength="50" style="width:150px;" v-model="primaryGoodsObj.barCode"
                            @keyup.enter.native="queryGiftBtn4"></el-input>
                </div>
              </el-col>
              <el-col :span="5">
                <div><label for="">商品编号：</label>
                  <el-input maxlength="50" style="width:150px;" v-model="primaryGoodsObj.goodsCode"
                            @keyup.enter.native="queryGiftBtn4"></el-input>
                </div>
              </el-col>
              <el-col :span="5">
                <div><label for="">商品名称：</label>
                  <el-input maxlength="50" style="width:150px;" v-model="primaryGoodsObj.goodsName"
                            @keyup.enter.native="queryGiftBtn4"></el-input>
                </div>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" style="height:28px;margin-left:10px;" @click="queryGiftBtn4">查询</el-button>
              </el-col>
            </el-row>
            <el-table
              border
              highlight-current-row
              max-height="400"
              :data="primaryGoodsArr"
              @current-change="selecGiftRow4"
              style="margin-top:15px;"
            >
              <el-table-column
                label="序号"
                align='center'
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="imageUrl"
                align='center'
                label="商品图片"
                min-width="">
                <template slot-scope="scope">
                  <img v-if="scope.row.goodsImageUrl" :src="scope.row.goodsImageUrl" alt="">
                </template>
              </el-table-column>
              <el-table-column
                prop="goodsCode"
                align='center'
                label="商品编号"
                width="">
              </el-table-column>
              <el-table-column
                prop="goodsBarCode"
                align='center'
                min-width=''
                label="条形码">
              </el-table-column>
              <el-table-column
                prop="goodsName"
                label="商品名称"
                min-width=''
                align='center'
                width="">
              </el-table-column>
              <el-table-column
                prop="goodsSpec"
                align='center'
                label="规格"
                width="">
              </el-table-column>
              <el-table-column
                prop="suitFlag"
                align='center'
                label="是否套装"
                width="">
                <template slot-scope="scope">
                  <span v-if="scope.row.suitFlag">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="salesPrice"
                align='center'
                v-if="openLimitExchangeGoods"
                label="售价"
                width="">
              </el-table-column>
              <el-table-column
                :render-header="renderHeader2"
                prop="salesOrderExistsCount"
                align='center'
                label="存在订单数"
                sortable
                width="">
              </el-table-column>
              <el-table-column
                :render-header="renderHeader3"
                prop="salesOrderGiftCount"
                align='center'
                sortable
                label="赠品订单数"
                width="">
              </el-table-column>
              <el-table-column
                :render-header="renderHeader4"
                prop="salesOrderPreSellCount"
                align='center'
                sortable
                label="预售商品订单数"
                width="130">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-dialog>
      <!--部分换商品失败-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="批量换商品" :visible.sync="batchReplaceGoodsDialog" width="1250px">
        <div style="text-align:center;"><i class="el-icon-warning" style="color:red;margin-right:10px;"></i>已修改成功{{successNum}}条，失败{{faliNum}}条！
          <p style="line-height: 30px;">失败原因：{{errFailReason}}</p>
        </div>
        <div style="margin:20px 0 10px 0;">
          <span style="margin-right:10px;">失败订单列表</span>
          <el-button type="text" @click="complimentaryOrShop">挂起</el-button>
          <a ref="downLoadFail" style="color:#409EFF;cursor:pointer;margin-left:10px;"
             @click="subExport1('goods')">导出</a>
        </div>
        <el-table :data="partErrGoodsList" class="col-border" border style="width: 100%" max-height="350"
                  @selection-change="handleSelectionChange1">
          <el-table-column
            align='center'
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column prop="sourceOrderNo" align="center" label="订单号" width="150" :show-overflow-tooltip='true'>
            <template slot-scope="scope">
              <p>{{ scope.row.sourceOrderNo}}</p>
              <span style="background:orange;color:#fff;padding:2px;"
                    v-if="scope.row.orderSign">{{ scope.row.orderSign}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" align="center" label="订单状态">
          </el-table-column>
          <el-table-column prop="payTime" align="center" width="140" label="付款时间">
            <template slot-scope="scope">
              <span v-if="scope.row.payTime">{{ scope.row.payTime | turnTimestamp}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerMsg" align="center" width="150" label="买家留言" :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column prop="serviceMsg" align="center" width="150" label="客服备注" :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column prop="productName" align="center" label="商品名称" width="350">
            <template slot-scope="scope">
              <div v-if="scope.row.orderDetails" v-for="(item,i) in scope.row.orderDetails">
                <div>
                  <div class="ellipsis" style="width: 180px;display:inline-block;float:left;" :title="item.productName">
                    <span v-if="item.isPreSall" style="color:green;">【预】</span>
                    <span v-if="item.isGift" style="color:#FD00FF;">【赠】</span>
                    {{item.productName}}
                  </div>
                  <div style="width: 90px;display:inline-block;margin-left:50px;color:green;">
                    订货数量：{{item.buyNum}}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!--请选择替换的商品-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="请选择替换的商品" :visible.sync="replaceGoodsDialog" width="1200px">
        <div class="input-box">
          <el-row>
            <el-col :span="5">
              <div><label for="">商品名称：</label>
                <el-input maxlength="50" style="width:150px;" v-model="replaceGoodsObj.goodsName"
                          @keyup.enter.native="queryGiftBtn5"></el-input>
              </div>
            </el-col>
            <el-col :span="5">
              <div><label for="">商品编号：</label>
                <el-input maxlength="50" style="width:150px;" v-model="replaceGoodsObj.goodsCode"
                          @keyup.enter.native="queryGiftBtn5"></el-input>
              </div>
            </el-col>
            <el-col :span="5">
              <div><label for="">条形码：</label>
                <el-input maxlength="50" style="width:150px;" v-model="replaceGoodsObj.barCode"
                          @keyup.enter.native="queryGiftBtn5"></el-input>
              </div>
            </el-col>
            <el-col :span="5">
              <div><label for="">是否套装：</label>
                <el-select v-model="replaceGoodsObj.suitFlag" placeholder="" style="width:150px;">
                  <el-option label="全部" value="-1"></el-option>
                  <el-option label="单品" value="0"></el-option>
                  <el-option label="套装" value="1"></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" style="height:28px;margin-left:10px;" @click="queryGiftBtn5">查询</el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="replaceGoodsDialogLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            border
            highlight-current-row
            height="400"
            :data="addGiftData5"
            @current-change="selecGiftRow5"
            style="margin-top:15px;"
          >
            <el-table-column
              label="序号"
              align='center'
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="goodsUrl"
              align='center'
              label="商品图片"
              min-width="">
              <template slot-scope="scope">
                <img v-if="scope.row.goodsUrl" :src="scope.row.goodsUrl" alt="">
              </template>
            </el-table-column>
            <el-table-column
              prop="goodsCode"
              align='center'
              label="商品编号"
              width="">
            </el-table-column>
            <el-table-column
              prop="barCode"
              align='center'
              min-width=''
              label="条形码">
            </el-table-column>
            <el-table-column
              prop="goodsName"
              label="商品名称"
              min-width=''
              align='center'
              width="">
            </el-table-column>
            <el-table-column
              prop="specification"
              align='center'
              label="规格"
              width="">
            </el-table-column>
            <el-table-column
              prop="suitFlag"
              align='center'
              label="是否套装"
              width="">
              <template slot-scope="scope">
                <span v-if="scope.row.suitFlag">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="salesPrice"
              align='center'
              label="软件售价"
              v-if="openLimitExchangeGoods"
              width="">
            </el-table-column>
            <el-table-column
              prop="stockAvailable"
              align='center'
              label="可售现货"
              width="">
              <template slot-scope="scope">
                <span v-if="scope.row.stockAvailable > 0">{{scope.row.stockAvailable}}</span>
                <span v-else style="color:red;">{{scope.row.stockAvailable}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="stockPreSellAvailable"
              align='center'
              label="预售库存"
              width="">
              <template slot-scope="scope">
                <span v-if="scope.row.stockPreSellAvailable > 0">{{scope.row.stockPreSellAvailable}}</span>
                <span v-else style="color:red;">{{scope.row.stockPreSellAvailable}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="stockGiftAvailable"
              align='center'
              v-if="openManGiftInv"
              label="赠品可售库存"
              width="">
              <template slot-scope="scope">
                <span v-if="scope.row.stockGiftAvailable > 0">{{scope.row.stockGiftAvailable}}</span>
                <span v-else style="color:red;">{{scope.row.stockGiftAvailable}}</span>
              </template>
            </el-table-column>
            <!--宝洁新增-->
            <el-table-column v-if="!isSuitShow" label="单品组套最大可售" align="center">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales >= 0">{{ scope.row.suitMaxSales
                  }}</span>
                <span
                  v-else-if="scope.row.suitMaxSales != undefined && scope.row.suitFlag && scope.row.suitMaxSales < 0">0</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="dialog-pagination">
            <el-pagination
              @size-change="handleSizeChange5"
              @current-change="handleCurrentChange5"
              :current-page="currentPage5"
              :page-sizes="[15, 30, 50, 100, 200]"
              :page-size="totalPage5"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum5">
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="replaceGoodsDialog=false">取消</el-button>
          <el-button type="primary" @click="saveAddGift5">确定</el-button>
        </span>
      </el-dialog>
      <!--单条修改快递-->
      <el-dialog v-dialogDrag :close-on-click-modal="false" title="修改快递" :visible.sync="editExpressDialog" width="460px">
        <span style="margin-left:50px;">快递：</span>
        <el-select v-model="expressId" placeholder="">
          <el-option
            v-for="item in expressBeensList"
            :key="item.expressId"
            :label="item.expressName"
            :value="item.expressId">
          </el-option>
        </el-select>
        <div style="text-align:right;margin-top:50px;">
          <el-button type="primary" @click="updateStorageExpress">保存</el-button>
          <el-button @click="updateStorageExpressCancel">取消</el-button>
        </div>
      </el-dialog>

      <!-- 动态查询框 -->
      <div id="searchInput" style="position: absolute;left: 0;top: 0;z-index: 100;" v-show="searchTextFlag">
        <el-input id="searchText" v-model="searchText" style="width: 120px;height: 24px;"></el-input>
      </div>
      <!-- 头部查询条件区域 -->
      <div id="headBar">
        <div id="leftBar">
          <el-button class="fastSearch" @click="searchShow" :style="higeSearchFlag?'color:#fff;background:#409EFF':''">
            高级查询
          </el-button>
          <br>
          <el-button class="fastSearch" :style="!higeSearchFlag?'color:#fff;background:#409EFF':''" @click="searchHide">
            简易查询
          </el-button>
        </div>
        <div style="line-height:58px;padding-left:110px;" v-show="!higeSearchFlag">

          <div id="searchBox">
            <div class="leftBox1">
              <el-row>
                <el-col :span="6" style="width:22% !important;">
                  <div class="grid-content easy-content">
                    <label for="" style="float:left;">平台单号：</label>
                    <div style="width:71%;float:left;" class="fh-select-box">
                      <el-select class="fh-select" style="width:72px !important;"
                                 v-model="simpleParam.sourceOrderNoType" placeholder="请选择">
                        <el-option label="等于" value="1"></el-option>
                        <el-option label="开头是" value="2"></el-option>
                      </el-select>
                      <el-input v-model="simpleParam.sourceOrderNo" style="flex:1;"
                                @keyup.native="simpleParam.sourceOrderNo=simpleParam.sourceOrderNo.replace(/[^\d|a-z|-]/ig,'')"
                                :maxlength="50"></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6" style="width:22% !important;">
                  <div class="grid-content easy-content">
                    <label for="" style="float:left;">订单号：</label>
                    <div style="width:71%;float:left;" class="fh-select-box">
                      <el-select class="fh-select" style="width:72px !important;" v-model="simpleParam.salesOrderNoType"
                                 placeholder="请选择">
                        <el-option label="等于" value="1"></el-option>
                        <el-option label="结尾是" value="2"></el-option>
                      </el-select>
                      <el-input v-model="simpleParam.salesOrderNo" style="flex:1;"
                                @keyup.native="simpleParam.salesOrderNo=simpleParam.salesOrderNo.replace(/[^\d|a-z]/ig,'')"
                                :maxlength="50"></el-input>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6" style="width:18% !important;">
                  <div class="grid-content easy-content">
                    <label for="">买家ID：</label>
                    <el-input v-model="simpleParam.buyerNick" style="width:62% !important;" :maxlength="50"></el-input>
                    <!--@keyup.native="simpleParam.buyerNick=simpleParam.buyerNick.replace(/[^\d|a-z|\u4e00-\u9fa5]/ig,'')"-->
                  </div>
                </el-col>
                <el-col :span="6" style="width:18% !important;">
                  <div class="grid-content easy-content">
                    <label for="">手机号：</label>
                    <el-input v-model="simpleParam.consigneeMobile" style="width:62% !important;"
                              @keyup.native="simpleParam.consigneeMobile=simpleParam.consigneeMobile.replace(/[^\d]/ig,'')"
                              :maxlength="50"></el-input>
                  </div>
                </el-col>
                <el-col :span="6" style="width:18% !important;">
                  <div class="grid-content easy-content">
                    <label for="">快递单号：</label>
                    <el-input v-model="simpleParam.expressNo" style="width:62% !important;"
                              @keyup.native="simpleParam.expressNo=simpleParam.expressNo.replace(/[^\d|a-z]/ig,'')"
                              :maxlength="50"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="rightBox1" style="right:8px;width:130px;">
              <el-button type='primary' style="width: 60px !important;padding:7px 13px !important;" @click="easySearchBtn">查询</el-button>
              <el-button style="width: 55px !important;padding:7px 13px !important;margin-left: 0;" @click="resetEasyBtn">重置</el-button>
            </div>
          </div>
        </div>
        <div id="rightBar" v-show="higeSearchFlag">
          <ul id="fastSearchCondition">
            <li>
              <p class="conditionBtn" @click="channelOrderTab(1)"
                 :style="paramData.orderTab==1?'color:#409EFF':''">待客审({{numObj1.num1}})
              </p>
              <span>|</span>
            </li>
            <li>
              <p class="conditionBtn" @click="channelOrderTab(2)" :style="paramData.orderTab==2?'color:#409EFF':''">
                待仓审({{numObj1.num2}})</p>
              <span>|</span>
            </li>
            <li>
              <p class="conditionBtn spel-order-title" @click="channelOrderTab(5)"
                 :style="paramData.orderTab==5?'color:#409EFF':''">已挂起({{numObj1.num3}})</p>
              <span>|</span>
            </li>
          </ul>
          <br><br>
          <div id="conditionList">
            <div style="margin-top:-12px;margin-left:9px!important;" v-show="paramData.orderTab==1">
              <el-checkbox class="checkStyle" value="1"
                           v-model="isServMsg"><span
                class="checkBoxTitle">有客服备注({{numObj1.num4}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="2" v-model="isNoServMsg"><span
                class="checkBoxTitle">无客服备注({{numObj1.num5}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="3" v-model="isBuyerMsg"><span
                class="checkBoxTitle">有买家留言({{numObj1.num6}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="4" v-model="isNoBuyerMsg"><span
                class="checkBoxTitle">无买家留言({{numObj1.num7}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="5" true-label='1' false-label='' v-model="paramData.codFlag"><span
                class="checkBoxTitle">货到付款订单({{numObj1.num8}})</span>
              </el-checkbox>
              <el-checkbox class="checkStyle" value="6" true-label='1' false-label=''
                           v-model="paramData.preSaleFlag"><span
                class="checkBoxTitle">预售订单({{numObj1.num9}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="7" true-label='1' false-label=''
                           v-model="paramData.giftInFlag"><span
                class="checkBoxTitle">包含赠品({{numObj1.num10}})</span>
              </el-checkbox>
              <el-checkbox class="checkStyle" value="8" true-label='1' false-label=''
                           v-model="paramData.suitInFlag"><span
                class="checkBoxTitle">包含套装({{numObj1.num11}})</span>
              </el-checkbox>
              <el-checkbox class="checkStyle" value="9" true-label='1' false-label=''
                           v-model="paramData.timeoutOrderFlag"><span
                class="checkBoxTitle">超时订单({{numObj1.num12}})</span></el-checkbox>
            </div>
            <div style="margin-top:-12px;margin-left:9px!important;" v-show="paramData.orderTab==2">
              <el-checkbox class="checkStyle" v-model="paramData.ledgerStockoutFlag" label="1" true-label='1'
                           false-label=''><span>缺货订单({{numObj1.num13}})</span></el-checkbox>
              <el-checkbox class="checkStyle" v-model="paramData.overWeightFlag" label="2" true-label='1'
                           false-label=''>
                <span>超重订单({{numObj1.num14}})</span></el-checkbox>
              <el-checkbox class="checkStyle" v-model="paramData.expressExceptionFlag" label="3" true-label='1'
                           false-label=''><span>快递异常订单({{numObj1.num15}})</span></el-checkbox>
            </div>
            <div style="margin-top:-12px;margin-left:9px!important;" v-show="paramData.orderTab==5">
              <el-checkbox class="checkStyle" value="1"
                           v-model="paramData.hangTimeout" true-label='true' false-label=''><span
                class="checkBoxTitle">超时订单({{numObj1.num16}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="2" v-model="paramData.hangSalesLack" true-label='true'
                           false-label=''><span
                class="checkBoxTitle">超卖订单({{numObj1.num17}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="3" v-model="paramData.hangStocklack" true-label='true'
                           false-label=''><span
                class="checkBoxTitle">仓库缺货({{numObj1.num18}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="4" v-model="paramData.hangUnmerge" true-label='true'
                           false-label=''><span
                class="checkBoxTitle">未合并({{numObj1.num19}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="5" true-label='true' false-label=''
                           v-model="paramData.hangserviceMsgFail"><span
                class="checkBoxTitle">客服备注更新({{numObj1.num20}})</span>
              </el-checkbox>
              <el-checkbox class="checkStyle" value="6" true-label='true' false-label=''
                           v-model="paramData.hangHumanAudit"><span
                class="checkBoxTitle">需人工审核({{numObj1.num21}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="7" true-label='true' false-label=''
                           v-model="paramData.hangOverWeight"><span
                class="checkBoxTitle">超重订单({{numObj1.num22}})</span>
              </el-checkbox>
              <el-checkbox class="checkStyle" value="8" true-label='true' false-label=''
                           v-model="paramData.hangExpressException"><span
                class="checkBoxTitle">分配快递异常({{numObj1.num23}})</span>
              </el-checkbox>
              <el-checkbox class="checkStyle" value="9" true-label='true' false-label=''
                           v-model="paramData.hangCusSign"><span
                class="checkBoxTitle">自定义标记({{numObj1.num24}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="10" true-label='true' false-label=''
                           v-model="paramData.hangHumanHang"><span
                class="checkBoxTitle">人工挂起({{numObj1.num25}})</span></el-checkbox>
              <el-checkbox class="checkStyle" value="10" true-label='true' false-label=''
                           v-model="paramData.refundReCheckFlag"><span
                class="checkBoxTitle">退款复核({{numObj1.num26}})</span></el-checkbox>
            </div>
          </div>
        </div>
        <span v-show="higeSearchFlag" style="float: right;width:15px;height:16px;margin:10px 10px 0 0;cursor:pointer;"
              @click="refreshBtn"><i class="el-icon-refresh refreshIcon"
                                     style="font-size:16px;margin:0!important;"></i></span>
      </div>
      <div v-show="higeSearchFlag">
        <div id="conditionTab">
          <div id="conditionLeft">
            <i v-if="tagList.length>8" class="el-icon-caret-left"
               style="position:absolute;font-size:30px;left:-8px;top:3px;cursor:pointer;"></i>
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide" :key="index" v-for="(item,index) in tagList">
                  <el-tag :title="item.label" class="tagStyle" closable :disable-transitions="false"
                          size="medium" @close="tagClose(item)">
                    {{item.title}} ： {{item.label}}
                  </el-tag>

                </div>
              </div>
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
            </div>
            <i v-if="tagList.length>8" class="el-icon-caret-right"
               style="position:absolute;font-size:30px;right:324px;top:3px;cursor:pointer;"></i>
          </div>
          <div id="searchCondition">
            <el-button id="getSearchCondition" @click="querysChemesList"
                       style="margin-top:3px;margin-left:-10px;"><span style="text-decoration: underline">常用查询方案</span>
            </el-button>
            <el-button id="searchConditionRefresh" @click="resetQueryBtn">重 置</el-button>
            <el-button id="combinationSearch" @click="highSearchBtn">组合查询 <i class="el-icon-search"></i></el-button>
            <div style="float:left;width:36px;height:15px;">
              <transition name="shows">
                <span class="showHide" v-if="higeSearchSet" @click="higeSearchSetBtn">收起<i style="cursor:pointer;" class="el-icon-arrow-up"></i></span>
              </transition>
              <transition name="shows">
                <span class="showHide" v-if="!higeSearchSet" @click="higeSearchSetBtn">展开<i style="cursor:pointer;" class="el-icon-arrow-down"></i></span>
              </transition>
            </div>
          </div>
          <div id="saveIcon">
            <i class="el-icon-document" style="font-size: 25px;margin-top: 5px;margin-left: 3px;"
               @click="conditionVisibleBtn"></i>
          </div>
        </div>
        <!-- 高级查询条件 -->
        <!--<el-collapse-transition>-->
        <div id="higeSearch" v-show="higeSearchSet">
          <div class="search-box" style="margin-top:10px;">
            <div class="changeSelect" style="margin-left:0px;">
              <label for="participate-shop" style="width:36px;">店铺：</label><!--storeBeans-->
              <select id="participate-shop" name="multiselect[]" multiple="multiple" required>
                <option v-for="item in shopList" :value="item.value">{{item.label}}</option>
              </select>
            </div>
            <div class="changeSelect">
              <label for="Warehouse" style="width:60px;text-align:right;">仓库：</label><!--storageBeans-->
              <select id="Warehouse" name="multiselect[]" multiple="multiple" required>
                <option v-for="item in warehouseList" :value="item.value">{{item.label}}</option>
              </select>
            </div>
            <div class="changeSelect">
              <label for="express-sel" style="width:60px;text-align:right;">快递：</label><!--storageBeans-->
              <select id="express-sel" name="multiselect[]" multiple="multiple" required>
                <option v-for="item in expressList" :value="item.value">{{item.label}}</option>
              </select>
            </div>
            <div class="changeSelect">
              <span class="spanSet">订单类型：</span>
              <multiple-select
                :selectArr="orderTypeArr"
                :valueArr="paramData.orderTypes"
                @multipleChange="multipleChange"
                style="width:60%;">
              </multiple-select>
            </div>
            <div id="deposit" class="changeSelect">
              <el-select class="selects" v-model="paramData.OrderMoneyOrWeight" @change="channelChangeOrder"
                         placeholder="请选择" style="width:41%;">
                <el-option label="订单金额" value="1">
                </el-option>
                <el-option label="订单重量" value="2">
                </el-option>
              </el-select>
              <el-input style="width: 27%;height:25px;" @blur="channelChangeOrder(1)" type='text'
                        @keyup.native="paramData.OrderMoneyOrWeightThan = paramData.OrderMoneyOrWeightThan.replace(/[^\d\.]/g,'')"
                        v-model="paramData.OrderMoneyOrWeightThan"></el-input>
              -
              <el-input style="width: 27%;height:25px;" @blur="channelChangeOrder(2)" type='text'
                        @keyup.native="paramData.OrderMoneyOrWeightLess = paramData.OrderMoneyOrWeightLess.replace(/[^\d\.]/g,'')"
                        v-model="paramData.OrderMoneyOrWeightLess"></el-input>
            </div>
          </div>
          <div class="search-box">
            <div id="goods" class="changeSelect" style="position: relative;margin-left:0px;">
              <span class="spanSet" style="width:36px;">商品：</span>
              <span style="position: absolute;right:39%;top: 7px;z-index:100;">
                <i class="el-icon-error" style="cursor:pointer;" v-show="paramData.barCodes" @click="clearGoods"></i>
              </span>
              <el-input v-model="paramData.barCodes" :clearble="true" @blur="barCodesBlur" class="selects"
                        maxlength="50" style="width: 60%;">
                <template slot="append">
                  <div style="width:100%;height: 100%;" @click="addCommodityDialog('fanhu')"><i
                    class="el-icon-more"></i></div>
                </template>
              </el-input>
            </div>
            <div id="refundStatus" class="changeSelect">
              <span class="spanSet">退款状态：</span>
              <el-select v-model="paramData.refundStatus" placeholder="请选择" class="selects"
                         @change="changeTitle('退款状态',paramData.refundStatus,'refundStatusList','refundStatus')">
                <el-option :value="key" :key="key" :label="value" v-for="(value,key) in refundStatusList">
                </el-option>
              </el-select>
            </div>
            <div id="refundType" class="changeSelect">
              <span class="spanSet">退款类型：</span>
              <el-select v-model="paramData.refundType" class="selects" placeholder="请选择"
                         @change="changeTitle('退款类型',paramData.refundType,'refundTypeList','refundType')">
                <el-option value="2" label="部分退款" v-if="paramData.refundStatus=='2'||paramData.refundStatus=='3'"></el-option>
                <el-option value="3" label="全部退款" v-if="paramData.refundStatus=='2'||paramData.refundStatus=='3'"></el-option>
              </el-select>
            </div>
            <div id="abnormalFlag" class="changeSelect">
              <span class="spanSet">异常标记：</span>
              <el-select v-model="paramData.orderSignCode" placeholder="请选择" class="selects"
                         @change="changeTitle('异常标记',paramData.orderSignCode,'orderSignList','orderSignCode')">
                <el-option :value="key" :key="key" :label="value" v-for="(value,key) in orderSignList">
                </el-option>
              </el-select>
            </div>
            <div id="goodsNum" class="changeSelect">
              <el-select class="selects" v-model="paramData.itemType" @change="channelChangeGoods" placeholder="请选择"
                         style="width:41%;">
                <el-option label="商品数量" value="2">
                </el-option>
                <el-option label="商品条数" value="1">
                </el-option>
              </el-select>
              <el-input style="width: 27%;height:25px;" @blur="channelChangeGoods(1)"
                        @keyup.native="paramData.itemTypeNumThan = paramData.itemTypeNumThan.replace(/[^\d]/g,'')"
                        type='text'
                        v-model="paramData.itemTypeNumThan"></el-input>
              -
              <el-input style="width: 27%;height:25px;" @blur="channelChangeGoods(2)"
                        @keyup.native="paramData.itemTypeNumLess = paramData.itemTypeNumLess.replace(/[^\d]/g,'')"
                        type='text'
                        v-model="paramData.itemTypeNumLess"></el-input>
            </div>
          </div>
          <div class="search-box">
            <div id="setFlag" class="changeSelect" style="margin-left:0px;margin-top:1px;width:20%;">
              <span class="spanSet" style="width:36px;">旗帜：</span>
              <el-select class="selects" v-model="paramData.flagId" placeholder="请选择"
                         @change="changeTitle('旗帜',paramData.flagId,'flagList','flagId')">
                <el-option v-for="(value,key) in flagList" :value="key" :key="key" :label="value"><i
                  class="icon iconfont icon-ai246" :style="{color:flagColorList[key]}">&nbsp;<span
                  style="font-size:14px;">{{value}}</span></i>
                </el-option>
              </el-select>
            </div>
            <div class="changeSelect">
              <span class="spanSet">订单渠道：</span>
              <el-select class="selects" v-model="paramData.orderChannel" placeholder="请选择"
                         @change="changeTitle('订单渠道',paramData.orderChannel,'orderChannelList','orderChannel')">
                <el-option :value="key" :key="key" :label="value" v-for="(value,key) in orderChannelList"></el-option>
              </el-select>
            </div>
            <div class="changeSelect">
              <span class="spanSet">付款状态：</span>
              <el-select class="selects" v-model="paramData.payStatus" placeholder="请选择"
                         @change="changeTitle('付款状态',paramData.payStatus,'payStatusList','payStatus')">
                <el-option :value="key" :key="key" :label="value" v-for="(value,key) in payStatusList"></el-option>
              </el-select>
            </div>
            <div id="datePicker" class="changeSelect" style="margin-top:1px;width:480px;margin-left:-3px;">
              <span class="spanSet">&nbsp;时间范围：</span>
              <el-select v-model="paramData.dateType" placeholder="请选择" @change="channelTimeChange" style="width:95px;">
                <el-option label="下单时间" value="1" key="orderTime">
                </el-option>
                <el-option label="付款时间" value="2" key="paymentTime">
                </el-option>
                <el-option label="发货时间" value="3" key="deliverTime">
                </el-option>
                <el-option label="审单时间" value="4" key="examineTime">
                </el-option>
              </el-select>
              <el-date-picker class="order-picker" style="width:313px;margin-left:5px;padding:3px;" v-model="timeRange" @change="channelTimeChange"
                              type="datetimerange"
                              :editable="false" :clearable="false"
                              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                              value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </div>
          </div>
          <div class="search-box">
            <div id="address" class="changeSelect" style="margin-top:1px;width:291px;">
              <el-select v-model="paramData.receiveType" placeholder="请选择" @change="channelConsignee"
                         style="width: 95px;">
                <el-option label="收货人" value="1" key="Consignee1">
                </el-option>
                <el-option label="电话" value="2" key="Consignee2">
                </el-option>
                <el-option label="省份" value="3" key="Consignee3">
                </el-option>
                <!-- <el-option label="收货地址" value="4" key="Consignee4">
                 </el-option>-->
              </el-select>
              <el-select v-if="paramData.receiveType=='3'" @change="channelCollectGoods" v-model="paramData.receiveInfo"
                         placeholder="请选择" style="width: 175px;margin-left:5px;">
                <el-option v-for="item in consigneeTypeList" :key="item.regionName" :label="item.regionName"
                           :value="item.regionName">
                </el-option>
              </el-select>
              <el-input v-else v-model.trim="paramData.receiveInfo" placeholder="请输入内容" clearable
                        style="width: 175px;margin-left:5px;" @blur="channelCollectGoods"></el-input>
            </div>
            <div style="display:inline-block;">
              <span class="spanSet">条件1：</span>
              <!--first-->
              <el-select v-model="paramData.conditionType1" style="width:120px;" placeholder="请选择"
                         @change="changeOrder1">
                <el-option label="收货人地址" value="1"></el-option>
                <el-option label="条形码" value="2"></el-option>
                <el-option label="网店品名" value="3"></el-option>
                <el-option label="客服备注" value="4"></el-option>
                <el-option label="平台订单状态" value="5"></el-option>
                <el-option label="拆合状态" value="6"></el-option>
                <el-option label="促销编号" value="7"></el-option>
                <el-option label="买家留言" value="8"></el-option>
              </el-select>
              <!--second-->
              <el-select v-show="paramData.conditionType1==1||paramData.conditionType1==2||paramData.conditionType1==3||paramData.conditionType1==4||paramData.conditionType1==8" v-model="paramData.childType1" style="width:85px;" placeholder="请选择">
                <el-option label="包含" value="1"></el-option>
                <el-option label="不包含" value="2"></el-option>
              </el-select>
              <el-select v-show="paramData.conditionType1==5||paramData.conditionType1==6||paramData.conditionType1==7" v-model="paramData.childType1" style="width:85px;" placeholder="请选择" @change="childTypeChange1">
                <el-option label="等于" value="2"></el-option>
                <el-option v-if="paramData.conditionType1!=7" label="不等于" value="13"></el-option>
              </el-select>
              <!--third-->
              <el-input v-if="paramData.conditionType1==1||paramData.conditionType1==2||paramData.conditionType1==3||paramData.conditionType1==4 || paramData.conditionType1==7||paramData.conditionType1==8" type="text" style="width:160px;" v-model="paramData.conditionInfo1"></el-input>
              <el-select v-if="paramData.conditionType1==5" v-model="paramData.conditionInfo1" style="width:160px;" placeholder="请选择">
                <!--<el-option v-for="item in orderStatusArr" :label="item.label" :value="item.value" :key="item.value"></el-option>-->
                <el-option v-if="paramData.childType1!=13" label="全部" value=""></el-option>
                <el-option label="未付款" value="1"></el-option>
                <el-option label="已付款" value="2"></el-option>
                <el-option label="货到付款" value="3"></el-option>
                <el-option label="已发货" value="4"></el-option>
                <el-option label="待退货" value="5"></el-option>
                <el-option label="已退货" value="6"></el-option>
                <el-option label="待退款" value="7"></el-option>
                <el-option label="已退款" value="8"></el-option>
                <el-option label="已关闭" value="9"></el-option>
                <el-option label="已完成" value="10"></el-option>
              </el-select>
              <el-select v-if="paramData.conditionType1==6" v-model="paramData.conditionInfo1" style="width:160px;" placeholder="请选择">
                <el-option v-if="paramData.childType1!=13" label="全部" value=""></el-option>
                <el-option label="手动批量拆分" value="2"></el-option>
                <el-option label="手动合并" value="3"></el-option>
                <el-option label="自动预售拆分" value="4"></el-option>
                <el-option label="自动拆分" value="5"></el-option>
                <el-option label="自动合并" value="6"></el-option>
                <el-option label="手动自定义拆分" value="7"></el-option>
              </el-select>
            </div>
            <el-select v-model="paramData.conditionRelation" style="width:72px;margin-right:5px;" placeholder="请选择">
              <el-option label="并且" value="1"></el-option>
              <el-option label="或者" value="2"></el-option>
            </el-select>
            <div style="display:inline-block;">
              <span class="spanSet">条件2：</span>
              <!--first-->
              <el-select v-model="paramData.conditionType2" style="width:120px;" placeholder="请选择"
                         @change="changeOrder2">
                <el-option label="收货人地址" value="1"></el-option>
                <el-option label="条形码" value="2"></el-option>
                <el-option label="网店品名" value="3"></el-option>
                <el-option label="客服备注" value="4"></el-option>
                <el-option label="平台订单状态" value="5"></el-option>
                <el-option label="拆合状态" value="6"></el-option>
                <el-option label="促销编号" value="7"></el-option>
                <el-option label="买家留言" value="8"></el-option>
              </el-select>
              <!--second-->
              <el-select v-show="paramData.conditionType2==1||paramData.conditionType2==2||paramData.conditionType2==3||paramData.conditionType2==4||paramData.conditionType2==8" v-model="paramData.childType2" style="width:85px;" placeholder="请选择">
                <el-option label="包含" value="1"></el-option>
                <el-option label="不包含" value="2"></el-option>
              </el-select>
              <el-select @change="childTypeChange2" v-show="paramData.conditionType2==5||paramData.conditionType2==6||paramData.conditionType2==7" v-model="paramData.childType2" style="width:85px;" placeholder="请选择">
                <el-option label="等于" value="2"></el-option>
                <el-option v-if="paramData.conditionType2!=7" label="不等于" value="13"></el-option>
              </el-select>
              <!--third-->
              <el-input v-if="paramData.conditionType2==1||paramData.conditionType2==2||paramData.conditionType2==3||paramData.conditionType2==4||paramData.conditionType2==7||paramData.conditionType2==8" type="text" style="width:160px;" v-model="paramData.conditionInfo2"></el-input>
              <el-select v-if="paramData.conditionType2==5" v-model="paramData.conditionInfo2" style="width:160px;" placeholder="请选择">
                <el-option v-if="paramData.childType2!=13" label="全部" value=""></el-option>
                <el-option label="未付款" value="1"></el-option>
                <el-option label="已付款" value="2"></el-option>
                <el-option label="货到付款" value="3"></el-option>
                <el-option label="已发货" value="4"></el-option>
                <el-option label="待退货" value="5"></el-option>
                <el-option label="已退货" value="6"></el-option>
                <el-option label="待退款" value="7"></el-option>
                <el-option label="已退款" value="8"></el-option>
                <el-option label="已关闭" value="9"></el-option>
                <el-option label="已完成" value="10"></el-option>
              </el-select>
              <el-select v-if="paramData.conditionType2==6" v-model="paramData.conditionInfo2" style="width:160px;" placeholder="请选择">
                <el-option v-if="paramData.childType2!=13" label="全部" value=""></el-option>
                <el-option label="手动批量拆分" value="2"></el-option>
                <el-option label="手动合并" value="3"></el-option>
                <el-option label="自动预售拆分" value="4"></el-option>
                <el-option label="自动拆分" value="5"></el-option>
                <el-option label="自动合并" value="6"></el-option>
                <el-option label="手动自定义拆分" value="7"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!--</el-collapse-transition>-->
      </div>
      <!-- 功能按钮栏 -->
      <div class="col-nav" style="margin:10px 0;padding:0 5px;">
        <ul>
          <li v-if="!flag2 && authorityCode.OMS_ORDERPROCESSING_GUEST" @click="setOrder('servReview')"><span>客审</span>
          </li>
          <li v-if="!flag1 && authorityCode.OMS_ORDERPROCESSING_WAREHOUSEAUDIT" @click="setOrder('storeReview')"><span>仓审</span>
          </li>
          <li v-if="!flag1 && authorityCode.OMS_ORDERPROCESSING_NOTGUEST" @click="setOrder('returnServReview')"><span>反客审</span>
          </li>
          <li v-if="(!flagHeightOrEasy || flag1) && authorityCode.OMS_ORDERPROCESSING_MERGE" @click="setOrder('merge')">
            <span>合并</span></li>
          <li v-if="(!flagHeightOrEasy || flag1 || flag2) && authorityCode.OMS_ORDERPROCESSING_SPLIT"
              @click="setOrder('manualSplit')"><span>拆分</span></li>
          <li v-if="!flagHeightOrEasy || flag1 || flag2">
            <el-dropdown placement="bottom" trigger="click" @command="setOrder"
                         style="">
              <span class="el-dropdown-link">
                  批量拆分<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="preSaleSplit"
                                  v-if="(!flagHeightOrEasy || paramData.orderTab==1) && authorityCode.OMS_ORDERPROCESSING_PRESELL">
                  预售拆分
                </el-dropdown-item>
                <el-dropdown-item command="stockSplit" divided
                                  v-if="(!flagHeightOrEasy || paramData.orderTab==2) && authorityCode.OMS_ORDERPROCESSING_STOCKOUT">
                  缺货拆分
                </el-dropdown-item>
                <el-dropdown-item command="overweightSplit" divided
                                  v-if="(paramData.orderTab==2 || !flagHeightOrEasy) && authorityCode.OMS_ORDERPROCESSING_OVERWEIGHT">
                  超重拆分
                </el-dropdown-item>
                <el-dropdown-item command="refundsSplit" divided
                                  v-if="(paramData.orderTab==1 || !flagHeightOrEasy) && authorityCode.OMS_ORDERPROCESSING_REFUND">
                  退款拆分
                </el-dropdown-item>
                <el-dropdown-item command="batchSplit" divided
                                  v-if="(paramData.orderTab==1 || !flagHeightOrEasy) && authorityCode.OMS_ORDERPROCESSING_BATCHHAND">
                  批量手拆
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li>
            <el-dropdown placement="bottom" trigger="click" @command="setOrder">
              <span class="el-dropdown-link">
                  批量修改<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="updateStore" v-if="authorityCode.OMS_ORDERPROCESSING_WAREHOUSE">改仓库
                </el-dropdown-item>
                <el-dropdown-item command="updateExpress" v-if="authorityCode.OMS_ORDERPROCESSING_EXPRESS" divided>改快递
                </el-dropdown-item>
                <el-dropdown-item command="updateNoteMsg" v-if="authorityCode.OMS_ORDERPROCESSING_INTERNAL" divided>
                  改内部便签
                </el-dropdown-item>
                <el-dropdown-item command="updateStoreMsg" v-if="authorityCode.OMS_ORDERPROCESSING_GUIDELINES" divided>
                  改仓审须知
                </el-dropdown-item>
                <el-dropdown-item command="changeGift" v-if="authorityCode.OMS_ORDERPROCESSING_EDITGOODS" divided>改赠品
                </el-dropdown-item>
                <el-dropdown-item command="exchangeGoods" v-if="authorityCode.OMS_ORDERPROCESSING_EDITGOODS" divided>
                  换商品
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li v-if="!flag2 && authorityCode.OMS_ORDERPROCESSING_SIGN" @click="setOrder('sign')"><span>标记</span></li>
          <li v-if="!flag2 && authorityCode.OMS_ORDERPROCESSING_NOTSIGN" @click="setOrder('returnSign')">
            <span>取消标记</span></li>
          <li v-if="authorityCode.OMS_ORDERPROCESSING_HANGUP" @click="setOrder('handup')"><span>挂起</span></li>
          <li v-if="authorityCode.OMS_ORDERPROCESSING_NOTHANGUP" @click="setOrder('returnHandup')"><span>解挂</span></li>
          <li v-if="authorityCode.OMS_ORDERPROCESSING_CANCEL" @click="setOrder('cancel')"><span>取消</span></li>
          <li v-if="authorityCode.OMS_ORDERPROCESSING_NOTCANCEL" @click="theCancel"><span>反取消</span></li>
          <li v-if="!flag2 && authorityCode.OMS_ORDERPROCESSING_DEL && false" @click="setOrder('deleteOrder')">
            <span>删除</span></li>
          <li v-if="!flag2 && authorityCode.OMS_ORDERPROCESSING_PREMIUM" @click="setOrder('urgent')"><span>加急客审</span>
          </li>
          <li v-if="flag1 && authorityCode.OMS_ORDERPROCESSING_IMPORT" @click="importFile"><span>导入</span></li>
          <li v-if="!flag1 && authorityCode.OMS_ORDERPROCESSING_THERMAL" @click="setOrder('hotSingle')">
            <span>手动分配热敏单</span></li>
          <li v-if="flag1" @click="setOrder()"><span>参数设置</span></li>
          <li @click="saveTableSet"><span>保存表格设置</span></li>
        </ul>
      </div>
      <!-- 表格区订单列表 -->
      <ag-grid-vue :style='{"height":agHeight+"px","width": "100%"}' v-loading="agLoading" element-loading-text="拼命加载中"
                   element-loading-spinner="el-icon-loading"
                   class="ag-theme-balham ag-table"
                   :gridOptions="gridOptions"
                   :columnDefs="columnDefs"
                   :rowData="orderList"

                   rowSelection="multiple"
                   :pinnedBottomRowData="pinnedBottomRowData"
                   :components="components"
                   :gridReady="onGridReady">
      </ag-grid-vue>
      <div id="pageTool" class="col-pagination" style="height:50px;border-top: 10px solid #F0F1F5;">
        <el-pagination  style="margin-top:5px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                       :page-sizes="[15, 30,50,100, 200,1000,2000]" :page-size="size"
                       layout="total, sizes,prev,pager , next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <order-detail v-if="!paramsObj.mainPageShow" :params="paramsObj" @changeShow="changeShow"></order-detail>
  </div>
</template>
<script>
  import {AgGridVue} from "ag-grid-vue";
  //import {provCityAndDistrict} from '@/assets/js/provCityAndDistrict';
  import {
    gridOptions,
    phoneEncrypt,
    switchGroup,
    zeroFill,
    turnTimestamp,
    selShowLabel,
    turnTimestamp3,
    priceValidator,
    validateSpelCharacter
  } from '@/assets/js/validate';
  import Swiper from '@/../static/js/swiper.min.js';
  import OrderDetail from '@/components/views/order/children/OrderDetail.vue';
  import ProvCityArea from '@/components/common/ProvCityArea.vue';
  import OrderDetailDialog from '@/components/common/OrderDetailDialog.vue';
  //import MultipleSelect from '@/components/common/MultipleSelect.vue';

  export default {
    name: "orderProcessing",
    components: {
      'ag-grid-vue': AgGridVue,
      OrderDetail,
      ProvCityArea,
      OrderDetailDialog,
      //MultipleSelect,
      RowFn: {//params.node.rowIndex+1
        template: `<span><span v-if="params.data.index == '合计'">{{params.data.index}}</span><span v-else>{{params.node.rowIndex+1}}</span></span>`
      },
      //渲染ag-grid列（vue方法）
      modifyComponent: {
        template: `<div>
                <i v-if="params.data.orderStatus == '待客审' || params.data.orderStatus == '已客审'" @click="consigneeEdit" class="el-icon-edit icon-edit note-edit"></i>
                <i v-else class="note-edit"></i>
              <span class="mouse-edit" v-if="params.colDef.headerName == '收货人'" style="padding-left: 4px;">{{params.data.consignee}}</span>
              <span class="mouse-edit" v-if="params.colDef.headerName == '手机'" style="padding-left: 4px;">{{params.data.consigneeMobile1}}</span>
              <span class="mouse-edit" v-if="params.colDef.headerName == '省'" style="padding-left: 4px;">{{params.data.consigneeProvince}}</span>
              <span class="mouse-edit" v-if="params.colDef.headerName == '市'" style="padding-left: 4px;">{{params.data.consigneeCity}}</span>
              <span class="mouse-edit" v-if="params.colDef.headerName == '区'" style="padding-left: 4px;">{{params.data.consigneeArea}}</span>
              <span class="mouse-edit" v-if="params.colDef.headerName == '镇'" style="padding-left: 4px;">{{params.data.consigneeTown}}</span>
              <span class="mouse-edit" v-if="params.colDef.headerName == '详细地址'" :title="params.data.shippingAddress" style="padding-left: 4px;">{{params.data.shippingAddress}}</span>
        </div>`,
        methods: {
          //点击小铅笔弹出修改收货信息弹框
          consigneeEdit(){
            this.params.context.modifyInformation(this.params.data);
          }
        }
      }
    },
    data() {
      return {
        pinnedBottomRowData:null,
        orderStatusArr: [
          {
            label: '全部',
            value: '',
          },
          {
          label: '未付款',
          value: 1,
          },
          {
            label: '已付款',
            value: 2,
          },
          {
            label: '货到付款',
            value: 3,
          },
          {
            label: '已发货',
            value: 4,
          },
          {
            label: '待退货',
            value: 5,
          },
          {
            label: '已退货',
            value: 6,
          },
          {
            label: '待退款',
            value: 7,
          },
          {
            label: '已退款',
            value: 8,
          },
          {
            label: '已关闭',
            value: 9,
          },
          {
            label: '已完成',
            value: 10,
          }],//订单状态枚举值
        splitJoinStatusObj:{
          1:'合并手拆',
          2:'手动批量拆分',
          3:'手动合并',
          4:'自动预售拆分',
          5:'自动拆分',
          6:'自动合并',
          7:'手动自定义拆分'
        },//拆合状态
        ecOrderStatusObj:{
          1:'未付款',
          2:'已付款',
          3:'货到付款',
          4:'已发货',
          5:'待退货',
          6:'已退货',
          7:'待退款',
          8:'已退款',
          9:'已关闭',
          10:'已完成',
        },//平台订单状态
        cancelLoading: false,//取消弹框loading
        areaParams: {},//省市区组件参数回传
        selectAddGiftDialogLoading: false,//选择赠品弹框
        selectDelGiftDialogLoading: false,//删除赠品弹框
        replaceGoodsDialogLoading: false,//替换商品弹框
        authorityCode: sessionStorage.getItem('authorityCode') ? JSON.parse(sessionStorage.getItem('authorityCode')) : {},//权限code
        agLoading: false,//aggrid loding
        openManGiftInv: false,//是否开启管理赠品库存
        openManSuitSales: false,//是否开启管理套装库存
        imgUpload: process.env.FILE_API,//文件服务域名
        fileId:process.env.FILE_API == 'www.edbv3.com'?'20632':'21236',//导出文件id
        exportName: '导入Excel',//导入按钮name
        paramsObj: {
          mainPageShow: true,
        },//组件传参参数
        editExpressDialog: false,//单条修改快递弹框
        expressBeensList: [],//快递集合
        expressId: '',//仓库下快递集合
        //批量换商品
        batchExchangeGoodsDialog: false,//批量换商品弹框
        batchReplaceGoodsDialog: false,//部分换商品失败弹框
        replaceGoodsDialog: false,// 请选择替换的商品弹框
        replaceGoodsObj: {},//请选择替换的商品查询条件
        changeGoodsObj: {
          replaceList: [],
        },//批量换商品替换的商品参数
        primaryGoodsObj: {},//批量换商品原商品参数
        selectRow4: '',//原商品选中值
        primaryGoodsArr: [],//原商品data
        selectRow5: '',//替换的商品选中值
        currentPage5: 1,
        totalPage5: 15,
        totalNum5: 0,
        addGiftData5: [],//替换的商品data
        openLimitExchangeGoods: false,//是否开启限制换货标治
        openSaleInvNegativeFlag: false,//是否允许可售库存为负
        //批量改赠品
        changeTypeName: '订单已存在此赠品时，数量累加',//备注信息
        salesOrderId: '',//记录订单id
        errFailReason: '',//失败原因
        addGiftObj: {
          giftName: '',
          giftCode: '',
          giftBarCode: '',
          giftSalesStatus: '-1',
          giftSuitFlag: '-1',
        },//加赠品参数
        selectAddGiftDialog: false,//加赠品弹框
        holdClick: false, // 禁止多次点击
        currentPage1: 1,
        totalPage1: 15,
        totalNum1: 0,
        addGiftData1: [],//加赠品data
        isSuitShow: false,//是否展示最大可售列
        selectRow1: '',//加赠品选中值
        delGiftObj: {
          giftName: '',
          giftCode: '',
          giftBarCode: '',
          giftSalesStatus: '-1',
          giftSuitFlag: '-1',
        },//删赠品参数
        selectDelGiftDialog: false,//删赠品弹框
        currentPage3: 1,
        totalPage3: 15,
        totalNum3: 0,
        addGiftData3: [],//删赠品data
        selectRow3: '',//删赠品选中值

        batchPartGiftDialog: false,//部分改赠品
        partErrGiftList: [],//改赠品部分失败列表
        partErrGoodsList: [],//换商品部分失败列表
        partSelectArr: [],//选中集合
        errGoodsDialog: false,//换商品不符合弹框
        errGiftDialog: false,//改赠品不符合弹框
        batchChangeGiftDialog: false,//批量改赠品弹框
        changeGiftObj: {
          changeType: 1,
          addUpFlag: true,
          giftBarCode: '',
          giftNume: '',
        },//批量改赠品参数
        goodsDetailDialog: false,//商品详情弹框

        catelogue: false,//是否显示消息提示
        messageMsg: '',//消息提示
        newOrderOne: '',//订单id
        numObj1: {
          num1: 0,
          num2: 0,
          num3: 0,
          num4: 0,
          num5: 0,
          num6: 0,
          num7: 0,
          num8: 0,
          num9: 0,
          num10: 0,
          num11: 0,
          num12: 0,
          num13: 0,
          num14: 0,
          num15: 0,
          num16: 0,
          num17: 0,
          num18: 0,
          num19: 0,
          num20: 0,
          num21: 0,
          num22: 0,
          num23: 0,
          num24: 0,
          num25: 0,
          num26: 0,
        },//高级查询selection参数
        flag1: true,//控制功能按钮显隐
        flag2: false,//控制功能按钮显隐
        flagHeightOrEasy: false,//高级简易查询
        expressInput: '',//批量修改快递查询条件
        successNum1: '',//订单标记成功数
        successCountNum: '',//订单标记失败数
        faliReasonTitle: '',///失败原因
        dialogVisibleSuccess: false,//订单标记弹框
        contrastAddress: [],//合并地址
        province: [],//省
        city: [],//市
        area: [],//区
        isShow: true,//订单合并显隐flag
        errorVisible: false,//订单手动合并不能合并列表弹框
        radio: '',//订单合并单选框value值
        radio1: '',//订单合并收货人单选框value值
        radio2: '',//订单合并手机单选框value值
        radio3: '',//订单合并收货地址单选框value值
        mergeValue: [], // 省市区
        mergeLabel:[],//省市区label
        ruleForm: {  // 合并手动修改信息
          town: '', // 小区
          phone: '',
          people: ''
        },//表单检验规则
        allLength: '',//共执行合并
        okLength: '',//合并多少单
        noLength: '',//未合并多少单
        mergeSuccess: false, //合并成功提示框
        orderSuccess: '', // 成功后的订单号
        orderSuccessId: '',// 成功后的订单ID
        forcedMerge: false, // 强制合并
        forcedMerge1: false, // 强制合并
        forcedMerge2: false,// 强制合并
        forcedMerge3: false,// 强制合并
        signDesign: '', // 合并、仅合并
        mainOrder: '', // 未合并的主单
        unincorporatedList: '', // 未合并list
        gridOptions: gridOptions(),//ag-grid
        agHeight: 0,
        components: null,
        columnDefs: null,
        rowData: null,
        //企业扩展
        gridApi: null,
        columnApi: null,
        autoGroupColumnDef: null,
        n: 1,
        checkLength: 50, //字符限制
        checkLength_5: 10, //字符限制
        checkLength_6: 15, //字符限制
        checkLength_2: 30, //字符限制
        checkLength_3: 20, //字符限制
        checkLength_4: 100, //字符限制
        version: "1.0.0", //版本
        active: "1", //测试
        maxFont: 500,//最大长度
        //简易查询
        simpleParam: {
          page: 1,
          size: 15,
          sourceOrderNoType: '1',
          salesOrderNoType: '1',//订单单号类型
          sourceOrderNo: '',//平台单号
          salesOrderNo: '',//订单编号
          buyerNick: '',//买家ID
          consigneeMobile: '',//手机号
          expressNo: '',//快递单号
        },// 简易查询条件
        size: 15, //每页条数
        page: 1, //当前页
        sortColumn: 0, //排序字段
        total: 0, //数据总条数
        sortType: 0, //排序方式 0正序 1倒序
        //高级查询
        /*------------------------------------------------查询条件------------------------------------------------*/
        isServMsg: false, //有客服备注
        isNoServMsg: false, //无客服备注
        isBuyerMsg: false, //有买家留言
        isNoBuyerMsg: false, //无买家留言
        timeRange: [], //索引0为开始时间索引1为结束时间
        conditionText: "", //商品选择框
        paramData: {
          page: 1,
          size: 15,
          orderTab: 1,//待客审 待仓审 未付款 取消的订单
          serverMsgFlag: '',//有无客服备注
          customerMsgFlag: '',//有无买家留言
          codFlag: '', //货到付款订单
          preSaleFlag: '',//预售订单
          giftInFlag: '',//包含赠品
          suitInFlag: '',//包含套装
          timeoutOrderFlag: '',//超时订单
          ledgerStockoutFlag: '',//缺货订单
          overWeightFlag: '',//超重订单
          expressExceptionFlag: '',//快递异常订单
          orderTypes: ['1','3','4','5'],//订单类型
          OrderMoneyOrWeight: '1',//订单金额或订单重量判断
          OrderMoneyOrWeightThan: '',//商品条数或数量下限值
          OrderMoneyOrWeightLess: '',//商品条数或数量上限值
          itemType: '2',//商品条数或数量判断
          itemTypeNumThan: '',//商品条数或数量下限值
          itemTypeNumLess: '',//商品条数或数量上限值
          flagId: '0',//旗帜
          orderSignCode: '0',//异常标记ID
          refundStatus: '1', //退款状态
          refundType: '', //退款类型
          receiveType: '1',//收货人条件判断
          receiveInfo: '',//收货人信息输入框值
          dateType: '1', //时间类型条件判断
          dateStart: '',//开始时间
          dateEnd: '',//结束时间
          goodsId: '',//商品ID
          barCodes: '',

          hangTimeout: '',//超时挂起
          hangSalesLack: '',//超卖挂起
          hangStocklack: '',//台账（仓库）缺货挂起
          hangUnmerge: '',//未合并挂起
          hangserviceMsgFail: '',//客服备注更新失败挂起
          hangHumanAudit: '',//需人工审核挂起
          hangOverWeight: '',//超重挂起
          hangExpressException: '',//分配快递异常挂起
          hangCusSign: '',//自定义标记挂起
          hangHumanHang: '',//人工挂起
          refundReCheckFlag:'',//退款复核
          conditionType1:'1',
          childType1:'1',
          conditionInfo1:'',
          conditionType2:'1',
          childType2:'1',
          conditionInfo2:'',
          conditionRelation:'1',
          orderChannel:'0',//订单渠道
          payStatus:'3',//付款状态
        },//高级查询条件--------------------asd-----------------------
        consigneeTypeList: [],//省份下拉select
        selectShop: [], //选中的店铺列表
        selectWarehouse: [], //选中的仓库列表
        selectExpress: [], //选中的快递列表
        shopIdList: [], //店铺ID列表
        storeBeansList: [], //仓库列表
        expressBeansList: [], //快递列表
        orderLists: [], // checkbox选中的数据
        depositNum: "1", //订单金额或订单重量判断
        /*取消订单*/
        cancelSuccess: false, // 1000
        cancelFailed: false, // 1002
        successData: '', // code 1000
        /*反取消弹框*/
        cancel1000: false,
        cancel1002: false,
        cancel1003: false,
        cancel1005: false,
        cancel1006: false,
        cancelF: '', // 新生成的订单号
        cancelOrderList: '', // 取消标记的返回值
        cancelStatus1: false,//取消标记返回值弹框
        mergeVisible: false, // 订单合并
        mergeLists: '',// 可合并的订单
        /*--------------------------------添加商品-----------------------------------*/
        addCommodityParam: {
          page: 1,
          size: 15,
          goodsName:'',
          barCode:'',
        },//添加商品查询条件
        addCommodityData: [],//添加商品data
        currentPage2: 1,
        totalPage2: 15,
        totalNum2: 0,
        dialogAddCommodity: false,//添加商品弹框
        selectionData2: [],//添加商品选中值
        /*---------------------------------------------------------------------------*/
        //返回值公用变量
        responseList: [], //返回值列表
        faliNum: 0, //失败数量
        successNum: 0, //成功数量
        customerNum: 0,//客服失败条数
        allNum: 0, //总共数量
        titleName: "", //窗口名字
        successShowStatus: false, //弹窗显示状态
        orderIdList: [], //欲操作订单列表
        //客审
        commitNum: 1, //提交次数
        canCheckPass: false, //异常强制通过标记
        //批量修改状态
        batchStoreShowStatus: false, //批量修改仓库弹窗状态
        batchExpressShowStatus: false, //批量修改快递弹窗状态
        batchNoteMsgShowStatus: false, //批量修改内部便签弹窗状态
        batchStoreMsgShowStatus: false, //批量修改仓审须知弹窗状态
        setNoteMsg: "", //内部便签
        setStoreMsg: "", //仓审须知
        selectStore: "", //仓库模糊查询
        expressSelect: "", //快递模糊查询
        noteMsgType: "1", //内部便签类型
        storeMsgType: "1", //仓库须知类型
        //订单标记公用变量
        checkFlagList: [], //标记列表选择列表
        signList: [], //订单标记列表
        //订单标记
        signListStatus: false, //标记列表弹窗状态
        //取消标记
        clearSignListStatus: false, //取消标记弹窗状态
        //订单合并
        signVisible: false, //订单未合并弹窗状态
        signMergeList: [], //订单未合并列表
        //导入Excel
        fileTemp: "", //文件上传临时变量
        userTemplateName: "", //自定义模板名
        templateName: "", //模板名
        successFileNum: 0, //成功文件数
        failFileNum: 0, //失败文件数
        failExcelFile: "", //错误excel文件
        importStatus: false, //导入结果弹窗
        orderToChgBeans: [], //批量修改的订单信息列表
        headupStatus: false, //订单挂起弹窗状态
        headupType: 0, //订单挂起类型
        headupReason: "", //订单挂起原因
        importShop: "", //导入店铺信息
        orderImport: false, //订单导入弹窗
        warehouseListTemp: [], //仓库列表临时变量
        expressListTemp: [], //快递列表临时变量
        batchStoreId: "", //批量修改仓库ID
        batchExpressId: "", //批量修改快递ID
        cancelReasonList: {}, //订单取消原因列表
        cancelReasonText: "", //订单取消原因
        cancelReason: "", //取消原因选择
        cancelStatus: false, //取消订单弹窗状态
        verifyNull: false, //验证空标记
        t_height: 0, //表格最大高度
        searchTextFlag: false,
        searchColumn: "", //模糊搜索的条件标记
        searchText: "",
        columnsFlag: false, //自定义显示列
        checkAll: true, //全选按钮状态
        noteMsg: "", //内部便签
        storeMsg: "", //仓审须知
        test: false,
        timeDisable: false, //时间选择器禁止手动编辑
        saveSet: false, //方案另存为标记
        goodsNameTemp: "",
        higeSearchSet: false, //高级查询条件显示标记
        num: 333,
        goods: "0",
        saveCondition: 0,//查询方案radio value
        saveConditionId: '',//查询方案id
        searchCondition: "",//请输入查询方案名称
        warehouse: "",//仓库
        express: "",///快递
        note: "",//内部便签
        notice: "",//仓审须知
        receiveMobile: "", //收货人手机
        receiveAddress: "", //收货地址
        receiveName: "", //收货人
        saveSwitch: "",//查询方案value
        tagList: [],//高级查询添加tab list
        orderList: [],//订单列表data
        higeSearchFlag: true,//高级简易查询
        receiptVisible: false,//修改收货信息弹窗
        areaLoading: false,//修改收货信息弹窗
        noteVisible: false,//修改内部便签弹窗
        noticeVisible: false,//修改仓审须知
        conditionVisible: false,//保存查询方案弹框
        commonConditionVisible: false,//常用查询方案弹框
        //列绑定的变量
        rowName: {
          outOrderId: "",
          createDate: "",
          buyerId: "",
          payType: "",
          payStatus: "3",
          payDate: "",
          payCode: "",
          orderType: "",
          fristGold: "",
          secondGold: "",
          moneypPost: "",
          moneyOrder: "",
          servMsg: "",
          noteMsg: "",
          receiveName: "",
          receiveMobile: "",
          receivePhone: "",
          province: "",
          city: "",
          county: "",
          receiveAddress: "",
          zipCode: "",
          express: "",
          delivery: "2",
          deliveryCash: "",
          preferential: "",
          integral: "",
          envelope: "",
          coupon: "",
          invoice: "",
          invoiceHeadType: "",
          invoiceType: "",
          invoiceContent: "",
          taxpayerCode: "",
          bank: "",
          account: "",
          barcode: "",
          skuPlatname: "",
          skuPlatspec: "",
          num: "",
          single: ""
        },
        //付款状态列表
        payStatusList: {
          "0":"全部",
          "1": "未付款",
          "2": "部分付款",
          "3": "已付款"
        },
        //支付方式列表
        payList: {
          "1": "支付宝",
          "2": "微信",
          "3": "银联",
          "4": "现金",
          "5": "京东"
        },
        //导入订单设置数据
        rowsList: [
          {
            name: "平台单号",
            must: true,
            title: "outOrderId"
          },
          {
            name: "下单时间",
            must: true,
            title: "createDate"
          },
          {
            name: "买家ID",
            must: true,
            title: "buyerNick"
          },
          {
            name: "支付方式",
            title: "payType"
          },
          {
            name: "付款状态",
            title: "payStatus"
          },
          {
            name: "付款时间",
            must: true,
            title: "payDate"
          },
          {
            name: "支付单号",
            title: "payCode"
          },
          {
            name: "订单类型",
            title: "orderType"
          },
          {
            name: "首次付款金额",
            title: "fristGold"
          },
          {
            name: "二次付款金额",
            title: "secondGold"
          },
          {
            name: "运费",
            must: true,
            title: "moneypPost"
          },
          {
            name: "订单总金额",
            must: true,
            title: "moneyOrder"
          },
          {
            name: "客服备注",
            title: "servMsg"
          },
          {
            name: "买家留言",
            title: "noteMsg"
          },
          {
            name: "收货人",
            must: true,
            title: "receiveName"
          },
          {
            name: "手机号",
            must: true,
            title: "receiveMobile"
          },
          {
            name: "电话",
            title: "receivePhone"
          },
          {
            name: "省",
            must: true,
            title: "province"
          },
          {
            name: "市",
            must: true,
            title: "city"
          },
          {
            name: "县",
            must: true,
            title: "county"
          },
          {
            name: "收货地址",
            must: true,
            title: "receiveAddress"
          },
          {
            name: "邮编",
            title: "zipCode"
          },
          {
            name: "快递",
            title: "express"
          },
          {
            name: "是否货到付款订单",
            title: "delivery"
          },
          {
            name: "货到付款服务费",
            title: "deliveryCash"
          },
          {
            name: "店铺优惠",
            title: "preferential"
          },
          {
            name: "平台积分",
            title: "integral"
          },
          {
            name: "平台红包",
            title: "envelope"
          },
          {
            name: "平台优惠券",
            title: "coupon"
          },
          {
            name: "发票抬头",
            title: "invoice"
          },
          {
            name: "抬头类型",
            title: "invoiceHeadType"
          },
          {
            name: "发票类型",
            title: "invoiceType"
          },
          {
            name: "发票内容",
            title: "invoiceContent"
          },
          {
            name: "纳税人识别号",
            title: "taxpayerCode"
          },
          {
            name: "开票公司开户行",
            title: "bank"
          },
          {
            name: "开票公司银行账户",
            title: "account"
          },
          {
            name: "商品条码",
            must: true,
            title: "barcode"
          },
          {
            name: "网店品名",
            title: "skuPlatname"
          },
          {
            name: "网店规格",
            title: "skuPlatspec"
          },
          {
            name: "数量",
            must: true,
            title: "num"
          },
          {
            name: "单价",
            must: true,
            title: "single"
          }
        ],
        //商品列表
        goodsList: [],
        //发票内容
        invoiceContentList: {
          "1": "明细",
          "2": "办公用品",
          "3": "电脑配件",
          "4": "耗材"
        },
        //发票类型
        invoiceTypeList: {
          "1": "普通发票",
          "2": "专用发票"
        },
        //发票抬头类型
        invoiceHeadTypeList: {
          "1": "个人",
          "2": "企业"
        },
        //是否货到付款
        deliveryList: {
          "1": "是",
          "2": "否"
        },
        //排序字段列表
        sortList: [
          "订单编号",
          "订单总金额",
          "净重",
          "下单时间",
          "付款时间",
          "平台单号"
        ],
        //旗帜颜色列表
        flagColorList: {
          "0": "#999",
          "1": "#cd3930",
          "2": "#edcf4c",
          "3": "#72c95d",
          "4": "#3d9bfe",
          "5": "#822aea"
        },
        //旗帜颜色显示
        flagList: {
          "0": "全部",
          "1": "红色",
          "2": "黄色",
          "3": "绿色",
          "4": "蓝色",
          "5": "紫色"
        },
        //退款类型列表
        refundTypeList: {
          "1": "未退款",
          "2": "部分退款",
          "3": "全部退款"
        },
        //退款状态列表
        refundStatusList: {
          "0": "全部",
          "1": "未退款",
          "2": "退款中",
          "3": "已退款"
        },
        //订单渠道
        orderChannelList:{
          "0":'全部',
          '1':'网店直营',
          '2':'手工下单',
          '3':'导入订单'
        },
        //发货状态
        sendStatusList:{
          "1":'未发货',
          "2":'部分发货',
          "3":'已发货'
        },
        //查询方案列表
        conditionList: {
          "1": "客服blink专用方案",
          "2": "客服shadow专用方案",
          "3": "客服iceice专用方案"
        },
        //订单类型列表
        orderTypeList: {
          "0": "全部",
          "1": "正常订单",
          "2": "预售订单",
          "3": "换货订单",
          "4": "补发订单",
          "5": "定金订单"
        },
        orderTypeArr:[{
          label:'正常订单',
          value:'1',
        },{
          label:'预售订单',
          value:'2',
        },{
          label:'换货订单',
          value:'3',
        },{
          label:'补发订单',
          value:'4',
        },{
          label:'定金订单',
          value:'5',
        }],
        shopList: [],//店铺
        warehouseList: [],//仓库
        expressList: [],///快递
        expressListStr: '',//快递string
        shopSelect: [],//店铺
        warehouseSelect: [],//仓库
        expressSelect: [],//快递
        elem_store: {},//店铺
        elem_storage: {},//仓库
        elem_express: {},//快递
        orderSignList: {
          "0": "全部",
        },//异常标记列表
        timeRangeList: {
          '1': '下单时间',
          '2': '付款时间',
          '3': '发货时间',
        },//时间区间
        receiveTypeList: {
          '1': '收货人',
          '2': '电话',
          '3': '省份',
          '4': '收货地址'
        },
        orderIds: '',//选中的订单id ,分隔字符串
        errStorageDialog: false,//店铺不符合修改提示弹框
        errExpressDialog: false,//快递不符合修改提示弹框
        partErrExpressDialog: false,//部分快递失败弹框
        errNotesDialog: false,//内部便签不符合修改提示弹框
        partErrExpressList: [],//部分快递失败列表
        partExpressSelect: [],//部分快递列表选中
        successShowNotes: false,//批量修改内部便签弹框
        proCityAreaData: [],//省市级data
        proCityAreaValue: [],//级联下拉value
        proCityAreaLabel:[],//级联下拉label
        proCityAreaValueSet: [],//级联下拉value 订单合并
        loading: false,//遮罩层
        batchSplitVisible: false,//批量拆分
        batchSplitObj: {
          type: '1',
          info: ''
        },//批量拆分条件
        batchSplitList: {
          '1': '条形码',
          '2': '商品编号',
          '3': '商品名称',
          '4': '商品分类'
        },//批量手拆集合
        batchSplitData: [],//批量手拆data
        splitWay: '1',//拆至一单
        batchSplitSelect: [],//批量手拆选中集合
        manualSplitObj: {
          customerMsg: '',
          serviceMsg: '',
          funSplitOrderDetailsBean: [],//手动拆分表格data
        },//手动拆分条件
        manualSplitSelect: [],//手动拆分选中集合
        manualSplitVisible: false,//手动拆分
        splitOrderBeansJson: [],//拆分后的明细分组
        splitSuccessDialog: false,//手动拆分成功弹框
        splitCodeArr: [],//手动拆分编码arr
        splitIdArr: [],//手动拆分id arr
        expressEleId: '',//单个快递修改
        storageEleId: '',//单个仓库修改
        rowsInfo: {},//记录本行数据
        recordInit:0,
      };
    },
    beforeMount() {
      this.createColumnDefs();
    },
    activated() {
      //console.log(123);
    },
    beforeRouteLeave(to, from, next) {
      /*if (to.path == "/index") {
        to.meta.keepAlive = true;
      } else {
        to.meta.keepAlive = false;
      }
      */
      next();
    },
    beforeRouteEnter(to, from, next) {
      next();
    },
    methods: {
      //修改收货信息
      modifyInformation(data){
        this.receiveAddress = data.shippingAddress;
        this.receiveMobile = data.consigneeMobile;
        this.receiveName = data.consignee;
        this.proCityAreaValue = [data.provinceRegionId + '', data.cityRegionId + '', data.areaRegionId + '', data.townRegionId + ''];
        this.proCityAreaLabel = [data.consigneeProvince,data.consigneeCity,data.consigneeArea,data.consigneeTown];
        this.rowsInfo = data;
        this.receiptVisible = true;
        this.areaLoading = true;
      },
      //多选下拉组件
      multipleChange1(value) {
        this.paramData.childType1 = value;
      },
      //查询类型改变（条件1）
      changeOrder1(){
        if(this.paramData.conditionType1 == 1 || this.paramData.conditionType1 == 2 || this.paramData.conditionType1 == 3 || this.paramData.conditionType1 == 4 || this.paramData.conditionType1 == 8){
          this.paramData.childType1 = '1';
        }else if(this.paramData.conditionType1 == 5 || this.paramData.conditionType1 == 6|| this.paramData.conditionType1 == 7){
          this.paramData.childType1 = '2';
        }
        this.paramData.conditionInfo1 = '';
      },
      childTypeChange1(){
        if(this.paramData.childType1 == 2){
          this.paramData.conditionInfo1 = '';
        }else{
          if(this.paramData.conditionType1 == 5){
            this.paramData.conditionInfo1 = '1';
          }else{
            this.paramData.conditionInfo1 = '2';
          }
        }
      },
      childTypeChange2(){
        if(this.paramData.childType2 == 2){
          this.paramData.conditionInfo2 = '';
        }else{
          if(this.paramData.conditionType2 == 5){
            this.paramData.conditionInfo2 = '1';
          }else{
            this.paramData.conditionInfo2 = '2';
          }
        }
      },
      //查询类型改变（条件2）
      changeOrder2(){
        if(this.paramData.conditionType2 == 1 || this.paramData.conditionType2 == 2 || this.paramData.conditionType2 == 3 || this.paramData.conditionType2 == 4 || this.paramData.conditionType2 == 8){
          this.paramData.childType2 = '1';
        }else if(this.paramData.conditionType2 == 5 || this.paramData.conditionType2 == 6|| this.paramData.conditionType2 == 7){
          this.paramData.childType2 = '2';
        }
        this.paramData.conditionInfo2 = '';
      },
      /*renderHeader1(h, { column, $index },index){
        return h('span', {}, [
          h('span', {}, '存在订单数'),
          h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '勾选的订单中存在此赠品可修改的订单数' }}, [
            h('i', { slot: 'reference', class:'el-icon-question'}, '')
          ])
        ])
      },*/
      changeShow(param) {
        if (param) {
          if (this.higeSearchFlag) {
            this.highSearch()
          } else {
            this.easySearch();
          }
        }
        console.log(this.authorityCode);
        this.paramsObj.mainPageShow = true;
        this.renderTableHeight();
      },
      /* 换商品 */
      renderHeader2(createElement, {_self}) {
        return createElement(
          'span',
          {
            style: 'font-weight:bold;'
          },
          [
            createElement('span', ['存在订单数']
            ),
            createElement(
              'i',
              {
                class: 'el-icon-question',
                style: 'font-size:14px;margin-left:5px;',
                attrs: {title: '勾选的订单中存在此商品且可换货的订单数'}
              }
            )
          ]
        );
      },
      renderHeader3(createElement, {_self}) {
        return createElement(
          'span',
          {
            style: 'font-weight:bold;'
          },
          [
            createElement('span', ['赠品订单数']
            ),
            createElement(
              'i',
              {
                class: 'el-icon-question',
                style: 'font-size:14px;margin-left:5px;',
                attrs: {title: '勾选的订单中存在此赠品且可换货的订单数'}
              }
            )
          ]
        );
      },
      renderHeader4(createElement, {_self}) {
        return createElement(
          'span',
          {
            style: 'font-weight:bold;'
          },
          [
            createElement('span', ['预售商品订单数']
            ),
            createElement(
              'i',
              {
                class: 'el-icon-question',
                style: 'font-size:14px;margin-left:5px;',
                attrs: {title: '勾选的订单中存在此预售商品且可换货的订单数'}
              }
            )
          ]
        );
      },
      //选择原商品
      chooseGoods() {
        this.replaceGoodsObj = {
          goodsName: '',
          goodsCode: '',
          barCode: '',
          suitFlag: '-1',
        }
        this.currentPage5 = 1;
        this.totalPage5 = 15;
        this.selectRow5 = '';
        this.queryGiftBtn5();
      },
      queryGiftBtn4() {
        this.loading = true;
        this.primaryGoodsObj.salesOrderIdListByJson = JSON.stringify(this.orderIds.split(','));
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/selectOldGoodsList", this.primaryGoodsObj).then((response) => {
          if (response.data.success) {
            this.selectRow4 = '';
            this.openLimitExchangeGoods = response.data.result.openLimitExchangeGoods;
            this.openManGiftInv = response.data.result.openManGiftInv;
            this.openManSuitSales = response.data.result.openManSuitSales;
            this.openSaleInvNegativeFlag = response.data.result.openSaleInvNegativeFlag;
            this.batchExchangeGoodsDialog = true;
            this.primaryGoodsArr = response.data.result.rows;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
          this.loading = false;
        })
      },
      selecGiftRow4(row, oldrow) {
        this.selectRow4 = row ? row : '';
      },
      /*---------------------------------------------*/
      //请选择替换的商品
      queryGiftBtn5() {
        this.replaceGoodsObj.page = this.currentPage5;
        this.replaceGoodsObj.size = this.totalPage5;
        this.replaceGoodsObj.openManGiftInv = this.openManGiftInv;
        this.replaceGoodsObj.openManSuitSales = this.openManSuitSales;
        this.replaceGoodsObj.goodsId = this.selectRow4 ? this.selectRow4.goodsId : '';
        //当用户没选则原商品列表，但原商品列表条数为1条，在点击选择的时候，也把原商品的标治传入接口里。
        if (this.primaryGoodsArr.length == 1 && !this.selectRow4.goodsId) {
          this.replaceGoodsObj.goodsId = this.primaryGoodsArr[0].goodsId;
        }
        this.replaceGoodsDialog = true;
        this.replaceGoodsDialogLoading = true;
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateProductFindNewProductList", this.replaceGoodsObj).then((response) => {
          this.replaceGoodsDialogLoading = false;
          if (response.data.success) {
            this.openLimitExchangeGoods = response.data.result.openLimitExchangeGoods;//openManGiftInv
            this.openManGiftInv = response.data.result.openManGiftInv;
            this.openManSuitSales = response.data.result.openManGiftInv;

            //宝洁新增是否显示最大可售列
            this.isSuitShow = response.data.result.openManSuitSales;
            this.selectRow5 = '';
            this.addGiftData5 = response.data.result.rows;
            this.totalNum5 = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      handleSizeChange5(value) {
        this.totalPage5 = value;
        this.queryGiftBtn5();
      },
      handleCurrentChange5(value) {
        this.currentPage5 = value;
        this.queryGiftBtn5();
      },
      selecGiftRow5(row, oldrow) {
        this.selectRow5 = row ? row : '';
      },
      saveAddGift5() {
        if (!this.selectRow5) {
          this.$message({
            message: '请选择替换的商品!',
            type: 'warning'
          });
          return false;
        }
        this.loading = true;
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/chooseReplaceProductListClickYes", {
          //oldGoodsId: this.selectRow4 ? this.selectRow4.goodsId : '',
          replaceGoodsId: this.selectRow5.goodsId,
          _oldGoodsPrice: this.selectRow4 ? this.selectRow4.salesPrice : null,
          _replaceGoods: this.selectRow5.salesPrice,
          suitFlag: this.selectRow5.suitFlag
          //salesOrderId:this.selectRow4 ? this.selectRow4.salesOrderId : '',
          //orderItemId:this.selectRow4 ? this.selectRow4.orderItemId : ''
        }).then((response) => {
          this.loading = false;
          if (response.data.success) {
            this.replaceGoodsDialog = false;
            //console.log(this.selectRow5);
            this.changeGoodsObj.newSkuBarCode = this.selectRow5.barCode;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //批量替换
      batchReplaceGoods() {
        if (this.changeGoodsObj.newSkuBarCode == '') {
          this.$message({
            message: '请选择替换的商品!',
            type: 'warning'
          });
          return false;
        }
        if (this.changeGoodsObj.replaceList.length == 0) {
          this.$message({
            message: '请选择商品替换规则!',
            type: 'warning'
          });
          return false;
        }
        if (!this.selectRow4) {
          this.$message({
            message: '请选择原商品!',
            type: 'warning'
          });
          return false;
        }
        var params = {
          orderIdListJson:'',
          newSkuBarCode: this.changeGoodsObj.newSkuBarCode,
          oldSkuGoodsId: this.selectRow4.goodsId,
          isFromOrderDetail:0,
          orderDetailId: '',
          replaceSale: '',
          replacePreSale: '',
          replaceGiftSale: '',
          openManGiftInv: this.openManGiftInv,
          openManSuitSales: this.openManSuitSales,
          openLimitExchangeGoods: this.openLimitExchangeGoods,
          openSaleInvNegativeFlag: this.openSaleInvNegativeFlag
        };
        if (this.changeGoodsObj.replaceList.indexOf('1') > -1) {
          params.replaceSale = true;
        } else {
          params.replaceSale = false;
        }
        if (this.changeGoodsObj.replaceList.indexOf('2') > -1) {
          params.replaceGiftSale = true;
        } else {
          params.replaceGiftSale = false;
        }
        if (this.changeGoodsObj.replaceList.indexOf('3') > -1) {
          params.replacePreSale = true;
        } else {
          params.replacePreSale = false;
        }
        this.loading = true;
        //订单处理操作按钮异步同时调用返回结果统一处理
        var orderIds = this.orderIds.split(',');
        var nums = Math.ceil(orderIds.length/50);//调用多少次
        var startNum = 0,i = 0;
        var result = {
          rows:[],
          successQty:0,
          failQty:0,
          failReason:[]
        };
        //根据勾选的订单数算出调用接口次数并调用接口且处理数据
        var interval1 = setInterval(() => {
          params.orderIdListJson = JSON.stringify(orderIds.slice(i*50,(i+1)*50));
          params.separateRequestIndex = i;
          i += 1;
          this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateProduct", params).then((res) => {
            startNum += 1;
            if (res.data.success) {
              res.data.result.rows = res.data.result.rows?res.data.result.rows:[];
              result.successQty = result.successQty?result.successQty:0;
              result.failQty = result.failQty?result.failQty:0;
              res.data.result.rows.forEach((item) => {
                result.rows.push(item);
              })
              result.successQty += res.data.result.successQty*1;
              result.failQty += res.data.result.failQty*1;
              if(res.data.result.failReason && result.failReason.indexOf(res.data.result.failReason) < 0){
                result.failReason.push(res.data.result.failReason);
              }
            } else {
              this.loading = false;
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          }).catch((res)=>{
            this.loading = false;
            this.$message({
              message: '连接超时！',
              type: "warning"
            });
          })
          if(i == nums){
            clearInterval(interval1);
          }
        },2500);
        //监听所有的接口是否调用完毕，如调用完则做相应交互，清除定时器
        var interval2 = setInterval(() => {
          if(startNum == nums){
            //调用完了
            clearInterval(interval2);

            this.loading = false;
            if (result.failQty === 0) {
              //都成功
              this.batchExchangeGoodsDialog = false;
              this.$alert("修改成功！", "", {
                type: "success",
                center: true,
                confirmButtonText: "知道了"
              });
              if (this.higeSearchFlag) {
                this.highSearch()
              } else {
                this.easySearch();
              }
            } else if (result.successQty === 0) {
              this.$alert("修改失败!原因：" + result.failReason.join(',') + "！", "", {
                type: "warning",
                center: true,
                confirmButtonText: "关闭"
              });
            } else {
              this.batchExchangeGoodsDialog = false;
              this.batchReplaceGoodsDialog = true;
              this.partErrGoodsList = result.rows;
              this.successNum = result.successQty;
              this.faliNum = result.failQty;
              this.errFailReason = result.failReason.join(',');
              if (this.higeSearchFlag) {
                this.highSearch()
              } else {
                this.easySearch();
              }
            }
          }
        },500)
        /*this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateProduct", params).then((res) => {
          this.loading = false;
          if (res.data.success) {
            if (res.data.result.returnType == 3) {
              this.$alert("修改失败!原因：" + res.data.result.failReason + "！", "", {
                type: "warning",
                center: true,
                confirmButtonText: "关闭"
              });
            } else if (res.data.result.failQty === 0) {
              //都成功
              this.batchExchangeGoodsDialog = false;
              this.$alert("修改成功！", "", {
                type: "success",
                center: true,
                confirmButtonText: "知道了"
              });
              if (this.higeSearchFlag) {
                this.highSearch()
              } else {
                this.easySearch();
              }
            } else if (res.data.result.successQty === 0) {
              this.$alert("修改失败!原因：" + res.data.result.failReason + "！", "", {
                type: "warning",
                center: true,
                confirmButtonText: "关闭"
              });
            } else {
              this.batchExchangeGoodsDialog = false;
              this.batchReplaceGoodsDialog = true;
              this.partErrGoodsList = res.data.result.rows;
              this.successNum = res.data.result.successQty;
              this.faliNum = res.data.result.failQty;
              this.errFailReason = res.data.result.failReason;
              if (this.higeSearchFlag) {
                this.highSearch()
              } else {
                this.easySearch();
              }
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })*/
      },

      /*  改赠品 */
      renderHeader1(createElement, {_self}) {
        return createElement(
          'span',
          {
            style: 'font-weight:bold;'
          },
          [
            createElement('span', ['存在订单数']
            ),
            createElement(
              'i',
              {
                class: 'el-icon-question',
                style: 'font-size:14px;margin-left:5px;',
                attrs: {title: '勾选的订单中存在此赠品且可修改的订单数'}
              }
            )
          ]
        );
      },
      //选择赠品添加查询
      queryGiftBtn1() {
        this.selectAddGiftDialog = true;
        this.selectAddGiftDialogLoading = true;
        this.addGiftObj.page = this.currentPage1;
        this.addGiftObj.size = this.totalPage1;
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/queryAddGiftList', this.addGiftObj)
          .then((res) => {
            if (res.data.success) {
              this.openManGiftInv = res.data.result.openManGiftInv ? res.data.result.openManGiftInv : false;
              this.openManSuitSales = res.data.result.openManSuitSales ? res.data.result.openManSuitSales : false;
              this.selectRow1 = '';

              //宝洁新增是否显示最大可售列
              this.isSuitShow = res.data.result.openManSuitSales;

              this.addGiftData1 = res.data.result.rows;
              this.totalNum1 = res.data.result.total;
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
            this.selectAddGiftDialogLoading = false;
          })
      },
      handleSizeChange1(value) {
        this.totalPage1 = value;
        this.queryGiftBtn1();
      },
      handleCurrentChange1(value) {
        this.currentPage1 = value;
        this.queryGiftBtn1();
      },
      selecGiftRow1(row, oldrow) {
        this.selectRow1 = row ? row : '';
      },


      /*---------------------------------------------*/
      //选择赠品删除查询
      queryGiftBtn3() {
        this.selectDelGiftDialog = true;
        this.selectDelGiftDialogLoading = true;
        this.delGiftObj.page = this.currentPage3;
        this.delGiftObj.size = this.totalPage3;
        this.delGiftObj.salesOrderIdList = JSON.stringify(this.orderIds.split(','));
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/queryReduceGiftList', this.delGiftObj)
          .then((res) => {
            if (res.data.success) {
              this.selectRow3 = '';
              this.openManGiftInv = res.data.result.openManGiftInv ? res.data.result.openManGiftInv : false;
              this.addGiftData3 = res.data.result.rows;
              this.totalNum3 = res.data.result.total;
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
            this.selectDelGiftDialogLoading = false;
          })
      },
      handleSizeChange3(value) {
        this.totalPage3 = value;
        this.queryGiftBtn3();
      },
      handleCurrentChange3(value) {
        this.currentPage3 = value;
        this.queryGiftBtn3();
      },
      selecGiftRow3(row, oldrow) {
        this.selectRow3 = row ? row : '';
      },
      //修改赠品类型
      changeTypeChannel(item) {
        if (item == 1) {
          this.changeTypeName = '订单已存在此赠品时，数量累加';
        } else {
          this.changeTypeName = '订单中赠品数量不足时，直接删除';
        }
      },
      /*---------------------------------------------*/
      //选择商品
      chooseGift() {
        if (this.changeGiftObj.changeType == 1) {
          //添加赠品列表
          this.addGiftObj = {
            giftName: '',
            giftCode: '',
            giftBarCode: '',
            giftSalesStatus: '-1',
            giftSuitFlag: '-1',
          };
          this.currentPage1 = 1;
          this.totalPage1 = 15;
          this.selectRow1 = '';
          this.queryGiftBtn1();
        } else {
          //删除赠品列表
          this.delGiftObj = {
            giftName: '',
            giftCode: '',
            giftBarCode: '',
            giftSalesStatus: '-1',
            giftSuitFlag: '-1',
          };
          this.currentPage3 = 1;
          this.totalPage3 = 15;
          this.selectRow3 = '';
          this.queryGiftBtn3();
        }
      },
      //添加赠品
      saveAddGift1() {
        if (!this.selectRow1) {
          this.$message({
            message: '请选择要添加的赠品！',
            type: 'warning'
          });
          return false;
        }
        this.selectAddGiftDialog = false;
        this.changeGiftObj.giftBarCode = this.selectRow1.goodsBarCode;
      },
      //删除赠品
      saveAddGift3() {
        if (!this.selectRow3) {
          this.$message({
            message: '请选择要删除的赠品！',
            type: 'warning'
          });
          return false;
        }
        this.selectDelGiftDialog = false;
        this.changeGiftObj.giftBarCode = this.selectRow3.goodsBarCode;
      },
      //批量修改
      batchChangeSave() {
        if (this.changeGiftObj.giftBarCode == '') {
          this.$message({
            message: '请选择赠品！',
            type: 'warning'
          });
          return false;
        }
        if (this.changeGiftObj.giftNum == '') {
          this.$message({
            message: '请输入赠品数量！',
            type: 'warning'
          });
          return false;
        }
        if (this.changeGiftObj.giftNum == 0) {
          this.$message({
            message: '赠品数量必须大于0！',
            type: 'warning'
          });
          return false;
        }
        this.changeGiftObj.orderIds = this.orderIds;
        this.changeGiftObj.isNotDel = null;
        this.changeGiftObj.isFromOrderDetail = 0;
        this.loading = true;
        this._post('com.edb01.erp.oms.service.api.OrderSetUpService/' + this.version + '/query').then((response) => {
          if (response.data.success) {
            this.changeGiftObj.openManGiftInv = response.data.result.openManGiftInv;
            this.changeGiftObj.openManSuitSales = response.data.result.openManSuitSales;
            this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funUpdateGift', this.changeGiftObj)
              .then((res) => {
                this.loading = false;
                if (res.data.success) {
                  if (res.data.result.returnType == 3) {
                    this.$alert("修改失败!原因：" + res.data.result.failReason + "！", "", {
                      type: "warning",
                      center: true,
                      confirmButtonText: "关闭"
                    });
                  } else if (res.data.result.failQty === 0) {
                    //都成功
                    this.batchChangeGiftDialog = false;
                    this.$alert("修改成功！", "", {
                      type: "success",
                      center: true,
                      confirmButtonText: "知道了"
                    });
                    if (this.higeSearchFlag) {
                      this.highSearch()
                    } else {
                      this.easySearch();
                    }
                  } else if (res.data.result.successQty === 0) {
                    this.$alert("修改失败!原因：" + res.data.result.failReason + "！", "", {
                      type: "warning",
                      center: true,
                      confirmButtonText: "关闭"
                    });
                  } else {
                    this.batchChangeGiftDialog = false;
                    this.batchPartGiftDialog = true;
                    this.partErrGiftList = res.data.result.rows;
                    this.successNum = res.data.result.successQty;
                    this.faliNum = res.data.result.failQty;
                    this.errFailReason = res.data.result.failReason;
                    this.partSelectArr = [];
                    if (this.higeSearchFlag) {
                      this.highSearch()
                    } else {
                      this.easySearch();
                    }
                  }
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "warning"
                  });
                }
              })
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //部分失败列表导出
      subExport1(value) {
        if (value == 'gift') {
          var salesOrderIdList = '';
          this.partErrGiftList.forEach((item, i) => {
            salesOrderIdList += item.salesOrderId + ','
          })
          this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/exportOrderUpGiftFail', {
            salesOrderIdList: JSON.stringify(salesOrderIdList.slice(0, -1).split(','))
          })
            .then((res) => {
              if (res.data.success) {
                location.href = 'http://' + process.env.FILE_API + '/files-web/download/' + res.data.result;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
        } else if (value == 'goods') {
          /*var salesOrderIdList = '';
          this.partErrGoodsList.forEach((item, i) => {
            salesOrderIdList += item.salesOrderId + ','
          })
          this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/exportOrderReplaceProductFail', {
            salesOrderIdList: JSON.stringify(salesOrderIdList.slice(0, -1).split(','))
          })
            .then((res) => {
              if (res.data.success) {

              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })*/
          var str = '';
          this.partErrGoodsList.forEach((item, i) => {
            var str1 = '<p>';
            item.orderDetails.forEach(item2 => {
              if (item2.isPreSall) {
                str1 += '<span>【预】</span>';
              }
              if (item2.isGift) {
                str1 += '<span>【赠】</span> ';
              }
              str1 += '<span>' + item2.productName + '</span>  订货数量：<span>' + item2.buyNum + '</span></p>';
            })

            str += `<tr>
          <td>${item.sourceOrderNo ? item.sourceOrderNo : ''} ${item.orderSign ? item.orderSign : ''}</td>
          <td>${item.orderStatus ? item.orderStatus : ''}</td>
          <td>${item.payTime ? turnTimestamp(item.payTime) : ''}</td>
         <td>${item.customerMsg ? item.customerMsg : ''}</td>
         <td>${item.serviceMsg ? item.serviceMsg : ''}</td>
         <td>${str1}</td></tr>`;
          })
          var html = "<html><head><meta charset='utf-8' /></head><body><table border='1'><caption>订单换商品失败列表</caption>" +
            "<tr><td>订单号</td><td>订单状态</td><td>付款时间</td><td>买家留言</td><td>客服备注</td><td>商品名称</td></tr>" + str + "</table></body></html>";
          // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
          var blob = new Blob([html], {type: "application/vnd.ms-excel"});
          var a = this.$refs.downLoadFail;
          // 利用URL.createObjectURL()方法为a元素生成blob URL
          a.href = URL.createObjectURL(blob);
          // 设置文件名
          var date = new Date().toLocaleDateString().split('/');
          var m = date[1] < 10 ? '0' + date[1] : date[1];
          var d = date[2] < 10 ? '0' + date[2] : date[2];
          a.download = "失败订单_" + date[0] + m + d + ".xls";
        }
      },
      //部分失败列表选择
      handleSelectionChange1(arr) {
        this.partSelectArr = arr;
      },
      //<--------------------------------------------------------  asd订单各项操作  ------------------------------------------------------->
      setOrder(value) {
        this.holdClick = false;
        if (value == 'merge') {
          //console.log(this.orderLists, 888888);
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }

          if (this.orderLists.length < 2) { // 合并的订单必须2个已上
            this.$message({
              message: '请选择2个以上订单!',
              type: 'warning'
            });
            return false;
          }
          this.contrastAddress = '';
          this.mergeValue = '';
          this.ruleForm.phone = '';
          this.ruleForm.people = '';
          this.ruleForm.town = '';
          this.radio = '';
          this.radio1 = '';
          this.radio2 = '';
          this.radio3 = '';
          this.isShow = true;
          this.orderMerge();
        } else if (value == "servReview") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "客审";
          this.servReview(1);
        } else if (value == "storeReview") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "仓审";
          this.storeReview(1);
        } else if (value == 'returnServReview') {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "反客审";
          this.returnServReview(1);
        } else if (value == 'manualSplit') {
          //手动拆分
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          } else if (this.orderLists.length > 1) {
            this.$message({
              message: '只允许勾选单个订单!',
              type: 'warning'
            });
            return false;
          }
          this.manualSplitFn();
        } else if (value == 'preSaleSplit') {
          //预售拆分
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "预售拆分";
          this.preSaleSplitFn(1);
        } else if (value == 'stockSplit') {
          //缺货拆分
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "缺货拆分";
          this.preSaleSplitFn(3);
        } else if (value == 'overweightSplit') {
          //超重拆分
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "超重拆分";
          this.preSaleSplitFn(4);
        } else if (value == 'refundsSplit') {
          //退款拆分
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "退款拆分";
          this.preSaleSplitFn(2);
        } else if (value == 'batchSplit') {
          //批量手拆
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "批量手拆";
          this.batchSplitFn();
        } else if (value == "urgent") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "加急";
          this.urgent();
        } else if (value == "deleteOrder") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择所要删除的订单!',
              type: 'warning'
            });
            return false;
          }
          this.$confirm('确定要删除所选的订单吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.titleName = "删除";
            this.deleteOrder();
          }).catch(() => {
          });
        } else if (value == "updateNoteMsg") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "内部便签";
          this.noteMsgType = '1';
          this.setNoteMsg = '';
          this.noteMsgShow();
        } else if (value == 'hotSingle') {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "手动分配热敏单";
          this.hotSingle(1);
        } else if (value == "updateStore") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "请选择仓库";
          this.storeShow(1);
          this.batchStoreId = '';
        } else if (value == "updateExpress") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "请选择快递";
          this.expressShow(1);
          this.batchExpressId = '';
        } else if (value == "updateStoreMsg") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.titleName = "仓审须知";
          this.setStoreMsg = '';
          this.storeMsgType = '1';
          this.StoreMsgShow();
        } else if (value == "returnHandup") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          var isPass = false, isService = false;
          this.orderLists.forEach((item, i) => {
            if (item.manualHangupFlag) {
              isPass = true;//orderSign
            }
            if (item.orderSign.indexOf('根据客服备注更新失败') > -1) {
              isService = true;
            }
          })
          if (!isPass) {
            this.$message({
              message: '请选择已挂起的订单!',
              type: 'warning'
            });
            return false;
          }
          var prompt = isService ? '勾选有根据客服备注更新失败的订单，解挂后请手动更新。' : '';
          this.$confirm(prompt + "是否确定要解挂勾选的" + this.orderLists.length + "个订单？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.titleName = "解挂";
            this.returnHandup(1);
          });
        } else if (value == "handup") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          /*console.log(this.orderLists);orderStatus*/
          if (this.orderLists.length == 1) {
            let status = false;
            this.orderLists.forEach(item => {
              if (item.orderStatus == '待客审' || item.orderStatus == '已客审') {
                this.headupStatus = true;
              } else {
                //this.orderLists = [];
                this.$message({
                  message: '只有待客审和已客审订单才能挂起！',
                  type: 'warning'
                });
                status = true;
                //console.log(this.orderLists,789);
              }
            });
            if (status) {
              return false;
            }
            if (this.orderLists[0].manualHangupFlag) { /*---------------------------------------------------------------------------------------*/
              this.$nextTick(() => {
                this.headupReason = this.orderLists[0].manualHangupReason;
              })
            } else {
              this.$nextTick(() => {
                this.headupReason = '';
              })

            }
            this.headupType = '';
          } else {
            let show = 1;
            this.orderLists.forEach(item => {
              if (item.orderStatus == '待客审' || item.orderStatus == '已客审') {
                show++;
              }
            });

            if (show == 1) {
              this.orderLists = [];
              this.$message({
                message: '只有待客审和已客审订单才能挂起！',
                type: 'warning'
              });
              return false;
            }
            this.headupStatus = true;
            this.headupType = 0;
          }
          this.titleName = "挂起";
          this.headupReason = '';
        } else if (value == "sign") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          let isTitle = true;
          this.orderLists.forEach(item => {
            if (item.orderStatus == '待客审') {
              isTitle = false;
            }
          });
          if (isTitle) {
            this.$message({
              message: '只能标记待客审的订单',
              type: 'warning'
            })
            return false;
          }
          this.signFind();
          this.signListStatus = true;
        } else if (value == "returnSign") { // 取消标记
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          // 取消标记
          let bb = 0;
          let aa = true;
          for (var item of this.orderLists) {
            if (item.orderSign) {
              aa = false;
              break;
            } else {
              bb++
            }
          }
          // 判断选中的有没有异常标记的
          if (aa) {
            if (bb == this.orderLists.length) {
              this.$message({
                message: '请选择包含自定义标记的订单!',
                type: 'warning'
              });
              return false;
            }
          }
          this.titleName = "取消标记";
          this.checkFlagList = [];
          let str = '';
          this.orderLists.forEach(item => {
            str += item.salesOrderId + ',';
          });
          //if(this.orderLists.length == 1){ // 如果选择一条数据，调用订单标记
          this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funOrderSignFindCustomSignMapByOrderId', {orderId: str.slice(0, -1)})
            .then((res) => {
              if (res.data.success == true) {
                this.signList = res.data.result;
                if (res.data.result.length == 0) {
                  this.clearSignListStatus = false;
                  this.$message({
                    message: '请选择包含自定义标记的订单!',
                    type: 'warning'
                  });
                  return false;
                } else {
                  this.clearSignListStatus = true;
                }
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            })
        } else if (value == "cancel") {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          //判断是否可以取消操作（已取消、已作废、已发货、已完成）
          var isPass = true;
          this.orderLists.forEach(item => {
            if(item.orderStatus != '已取消' && item.orderStatus != '已作废' && item.orderStatus != '已发货' && item.orderStatus != '已完成'){
              isPass = false;
            }
          });
          if(isPass){
            this.cancelFailed = true;
            return false;
          }
          this.cancelReason = '';
          this.titleName = "取消";
          this.cancelList(); // 调用取消原因列表
          this.cancelStatus = true;
        } else if (value == 'changeGift') {
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.changeGiftObj = {
            changeType: 1,
            giftBarCode: '',
            giftNum: '',
            addUpFlag: true
          }
          this.changeTypeName = '订单已存在此赠品时，数量累加';
          var salesOrderIdList = JSON.stringify(this.orderIds.split(','));
          this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/followPassSalesOrderVoucher", {
            salesOrderIdList
          }).then((response) => {
            if (response.data.success) {
              if (response.data.result) {
                this.batchChangeGiftDialog = true;
              } else {
                this.errGiftDialog = true;
              }
            } else {
              this.$message({
                message: response.data.msg,
                type: "warning"
              });
            }
          })
        } else if (value == 'exchangeGoods') {//---------------------------asdf
          if (this.orderLists.length == 0) {
            this.$message({
              message: '请选择订单!',
              type: 'warning'
            });
            return false;
          }
          this.changeGoodsObj = {
            newSkuBarCode: '',
            replaceList: ['1']
          }
          this.primaryGoodsObj = {
            suitFlag: '-1',
            barCode: '',
            goodsCode: '',
            goodsName: ''
          }
          var salesOrderIdList = JSON.stringify(this.orderIds.split(','));
          this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/followPassSalesOrderVoucherByReplaceProduct", {
            salesOrderIdList
          }).then((response) => {
            if (response.data.success) {
              if (response.data.result) {
                this.queryGiftBtn4();
              } else {
                this.errGoodsDialog = true;
              }
            } else {
              this.$message({
                message: response.data.msg,
                type: "warning"
              });
            }
          })
        }
      },
      //订单合并手动修改
      handleAmend() { // 手动修改
        if (this.radio === '' && this.radio !== 0) {
          this.$message({
            message: '请选择一个主单',
            type: 'warning'
          });
          return false;
        }
        this.isShow = !this.isShow
      },
      //挂起
      handup() {
        if (this.headupType !== 0 && this.headupType !== 1) {
          this.$message({
            message: '请选择挂起方式',
            type: 'warning'
          });
          return false;
        }
        if (this.headupReason == '') {
          this.$message({
            message: '请填写挂起原因',
            type: 'warning'
          })
        } else {
          this.$confirm('是否确定挂起?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let data = {
              salesOrderIdList: [],
              handUpReason: this.headupReason,
              reasonIsAppend: this.headupType
            };
            this.orderLists.forEach(item => {
              data.salesOrderIdList.push(item.salesOrderId);
            });
            data = JSON.stringify(data);
            this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funOrderHandUp', {hangUpBeanJson: data})
              .then((res) => {
                if (res.data.success == true) {
                  this.partErrExpressDialog = false; // 失败快递
                  this.batchReplaceGoodsDialog = false; // 失败商品
                  this.batchPartGiftDialog = false; // 赠品
                  this.headupStatus = false;
                  if (this.higeSearchFlag) {
                    this.highSearch()
                  } else {
                    this.easySearch();
                  }
                  this.$message({
                    message: '订单挂起成功' + res.data.result.successCount + '条,' + '失败' + res.data.result.failcount + '条！',
                    type: 'success'
                  });
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "warning"
                  });
                }
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }
      },
      // 点击反取消
      theCancel() {
        if (this.orderLists.length == 0) {
          this.$message({
            message: '请选择订单!',
            type: 'warning'
          });
          return false;
        }
        if (this.orderLists.length > 1) {
          this.$message({
            message: '只能勾选一条订单!',
            type: 'warning'
          });
          return false;
        }
        let data = {
          orderIds: '',
          commitNum: 1,
          canCheckPass: false,
        };

        this.orderLists.forEach(item => {
          data.orderIds += item.salesOrderId + ',';
        });
        data.orderIds = data.orderIds.slice(0, -1);

        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funOrderReturnCancel', data)
          .then(res => {
            if (res.data.success == true) {
              if (res.data.code === 1000) {
                this.cancel1000 = true;
                this.cancelF = res.data.result.split(',');
              } else if (res.data.code === 1002) {
                this.cancel1002 = true;
              } else if (res.data.code === 1003) {
                this.cancel1003 = true;
              } else if (res.data.code === 1005) {
                this.cancel1005 = true;
              } else if (res.data.code === 1006) {
                this.cancel1006 = true;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }

          })
      },
      // 强制反取消
      clickCancel() {
        this.cancel1006 = false;
        let data = {
          orderIds: '',
          commitNum: 3,
          canCheckPass: true,
        };
        this.newOrderOne = this.orderLists[0].salesOrderId;
        this.orderLists.forEach(item => {
          data.orderIds += item.salesOrderId + ',';
        });
        data.orderIds = data.orderIds.slice(0, -1);

        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funOrderReturnCancel', data)
          .then(res => {
            if (res.data.success == true) {
              if (res.data.code === 1000) {
                if (this.higeSearchFlag) {
                  this.highSearch()
                } else {
                  this.easySearch();
                }
                this.cancel1000 = true;
                this.cancelF = res.data.result.split(',');
              } else if (res.data.code === 1002) {
                this.cancel1002 = true;
              } else if (res.data.code === 1003) {
                this.cancel1003 = true;
              } else if (res.data.code === 1005) {
                this.cancel1005 = true;
              } else if (res.data.code === 1006) {
                this.cancel1006 = true;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      //取消原因列表
      cancelList() {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funOrderCancelFindReasonList")
          .then((res) => {
            if (res.data.success == true) {
              this.cancelReasonList = res.data.result;
              for (var item in this.cancelReasonList) {
                if (this.cancelReasonList[item] == this.cancelReasonText) {
                  this.cancelReason = item;
                }
              }
              this.cancelReasonText = ''; // 请空取消的值
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          })
      },
      //添加取消原因
      addReason() {
        if (this.cancelReasonList.length >= 50) {
          this.$message({
            message: '取消原因条数不可超过50条，请删除后再添加。',
            type: 'warning'
          })
        }
        if (this.cancelReasonText == '') { //
          this.verifyNull = true;
        } else {
          this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/cancelReasonInsert', {reason: this.cancelReasonText})
            .then((res) => {
              if (res.data.success == true) {
                this.verifyNull = false;
                this.cancelList(); // 取消原因列表
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
        }
      },
      //删除取消原因
      delReason(id) {
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/cancelReasonDelete', {reasonId: id})
          .then((res) => {
            if (res.data.success == true) {
              this.cancelList();
              this.cancelReason = '';
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          })
      },
      //取消订单
      cancelOrder() {
        if (this.cancelReason != '') {
          const temp = {
            orderIds: '',
            reason: this.cancelReason,
            commitNum: 10,
            canCheckPass: true
          };
          this.orderLists.forEach(item => {
            temp.orderIds += item.salesOrderId + ',';
          });
          temp.orderIds = temp.orderIds.slice(0, -1);
          for (var item in this.cancelReasonList) {
            if (item == this.cancelReason) {
              temp.reason = this.cancelReasonList[item];
            }
          }
          //console.log(this.cancelReasonList[item], this.cancelReasonList, item);
          /* const data = {
            cancleInfo: JSON.stringify(temp)
          };*/
          this.cancelLoading = true;
          this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funOrderCancel', temp)
            .then((res) => {
              this.cancelLoading = false;
              if (res.data.success == true) {
                if (res.data.code == 1000) { // 取消成功，包含取消成功条数，失败条数，取消失败的具体原因
                  if (this.higeSearchFlag) {
                    this.highSearch()
                  } else {
                    this.easySearch();
                  }
                  this.successData = res.data.result;
                  this.cancelStatus = false;
                  this.cancelSuccess = true;
                } else if (res.data.code == 1002) { //勾选的订单不符合取消订单的条件
                  this.cancelStatus = false;
                  this.cancelFailed = true;
                } else if (res.data.code == 1003) { //存在可以取消的订单，是否需要处理取消?

                }

              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
        } else {
          this.$message({
            message: '请选择取消原因',
            type: 'warning'
          });
        }
      },
      // 点击订单号跳转详情页
      routerDetail(num) {
        if (num == 0) {
          //this.$router.push({name: 'orderDetail', params: {orderId: this.cancelF[1], fromPage: 'OrderProcessing'}});
          this.cancel1000 = false;
          this.mergeVisible = false;
          this.paramsObj = {
            orderId: this.cancelF[1],
            fromPage: 'OrderProcessing',
            mainPageShow: false
          }
        } else if (num == 1) {
          //this.$router.push({name: 'orderDetail', params: {orderId: this.orderSuccessId, fromPage: 'OrderProcessing'}});
          this.mergeSuccess = false;
          this.mergeVisible = false;
          this.paramsObj = {
            orderId: this.orderSuccessId,
            fromPage: 'OrderProcessing',
            mainPageShow: false
          }
        }
      },
      //设置标志状态
      flagSet() {
        if (this.cancelReasonText == '') {
          this.verifyNull = true;
        } else {
          this.verifyNull = false;
        }

      },
      //标记订单
      signOrder() {
        if (this.checkFlagList.length == 0) {
          this.$message({
            message: '请选择自定义标记',
            type: 'warning'
          });
          return false;
        }
        let listTemp = '';
        this.checkFlagList.forEach(item => {
          this.signList.forEach(item1 => {
            if (item == item1.signCode) {
              listTemp += '《' + item1.signName + '》';
            }
          })
        });
        this.$confirm('是否确定标记勾选订单为' + listTemp + '订单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.titleName = "标记";
          this.sign();
          this.checkFlagList = [];
          this.signListStatus = false;
        });
      },
      //标记订单
      sign() {
        const data = {
          orderIds: '',
          signCodes: ''
        };
        this.checkFlagList.forEach(item1 => {
          data.signCodes += item1 + ','
        });
        data.signCodes = data.signCodes.slice(0, -1);
        this.orderLists.forEach(item => {
          data.orderIds += item.salesOrderId + ',';
        });
        data.orderIds = data.orderIds.slice(0, -1);
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funOrderSign', data)
          .then((res) => {
            if (res.data.code == 0) {
              this.signListStatus = false;
              /*this.$message({
              showClose: true,
              message: '订单标记成功'+ res.data.result.successCount + '条，失败'+ res.data.result.successCount + '条，失败原因：' + res.data.result.faliReason,
              type: 'success'
            });*/
              this.successNum1 = res.data.result.successCount;
              this.successCountNum = res.data.result.failcount;
              this.faliReasonTitle = res.data.result.faliReason;
              if (this.successCountNum == 0 && this.successNum1 == 1) {
                this.$message({
                  message: '标记成功！',
                  type: 'success'
                })
              } else if (this.successCountNum == 0) {
                this.$message({
                  message: '(批量）标记订单成功！',
                  type: 'success'
                })
              } else {
                this.dialogVisibleSuccess = true;
              }

              if (this.higeSearchFlag) {
                this.highSearch()
              } else {
                this.easySearch();
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          })
      },
      //取消标记订单
      returnSignOrder() {
        if (this.checkFlagList.length == 0) {
          this.$message({
            message: '请选择需要取消的标记',
            type: 'warning'
          });
          return false
        }
        let listTemp = '';
        this.checkFlagList.forEach(item => {
          this.signList.forEach(item1 => {
            if (item == item1.signCode) {
              listTemp += '《' + item1.signName + '》';
            }
          })
        });
        this.$confirm(
          "是否确定要取消勾选的" + this.orderLists.length + "个订单中的" + listTemp + "标记？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
          }
        ).then(() => {
          var data = {
            orderIds: '',
            signCodes: '',
          };

          this.checkFlagList.forEach(item1 => {
            data.signCodes += item1 + ','
          });
          data.signCodes = data.signCodes.slice(0, -1);
          this.orderLists.forEach(item => {
            data.orderIds += item.salesOrderId + ',';
          });
          data.orderIds = data.orderIds.slice(0, -1);
          //取消订单  com.edb01.erp.oms.service.api.OrderBaseFunService
          data.permitFlag = Boolean(this.authorityCode.OMS_ORDERPROCESSING_REVIEWSERVICE);
          this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funOrderReturnSign', data)
            .then((res) => {
              if (res.data.code == 0) {
                this.checkFlagList = [];
                this.clearSignListStatus = false;
                this.cancelOrderList = res.data.result;
                if (res.data.result.failCount == 0) {
                  this.$message({
                    message: '取消标记成功' + res.data.result.successCount + '个订单！',
                    type: "success"
                  });
                } else {
                  this.cancelStatus1 = true;
                }

                /*console.log(res.data.result);
              this.$message({
                message: '取消标记成功' + res.data.result.successCount + '个订单,' + '失败' + res.data.result.failCount + '个订单',
                type: "success"
              });
              this.highSearch()*/
                if (this.higeSearchFlag) {
                  this.highSearch()
                } else {
                  this.easySearch();
                }
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
          // this.signFind();
        });
      },
      // 合并的订单选择radio触发
      getCurrentRow(val) {
        //console.log(val, this.mergeLists.mergeList);
        this.radio1 = val;
        this.radio2 = val;
        this.radio3 = val;
        if (val || val == 0) {
          this.contrastAddress = [this.mergeLists.mergeList[val].provinceRegionId + '', this.mergeLists.mergeList[val].cityRegionId + '', this.mergeLists.mergeList[val].areaRegionId + '',this.mergeLists.mergeList[val].townRegionId + ''];
          this.mergeValue = [this.mergeLists.mergeList[val].provinceRegionId + '', this.mergeLists.mergeList[val].cityRegionId + '', this.mergeLists.mergeList[val].areaRegionId + '', this.mergeLists.mergeList[val].townRegionId + ''];
          this.mergeLabel = [this.mergeLists.mergeList[val].consigneeProvince + '', this.mergeLists.mergeList[val].consigneeCity + '', this.mergeLists.mergeList[val].consigneeArea + '', this.mergeLists.mergeList[val].consigneeTown];
          this.ruleForm.phone = this.mergeLists.mergeList[val].consigneeMobile;
          this.ruleForm.people = this.mergeLists.mergeList[val].consignee;
          this.ruleForm.town = this.mergeLists.mergeList[val].shippingAddress;
        } else {
          this.mergeValue = [];
          this.mergeLabel = [];
        }
      },
      // 收货人姓名改变时
      changeName(val) {
        //console.log(val);
        this.ruleForm.people = this.mergeLists.mergeList[val].consignee

      },
      // 手机号改变时
      changePhone(val) {
        this.ruleForm.phone = this.mergeLists.mergeList[val].consigneeMobile;
        //console.log(val);
      },
      // 地址改变时
      changeAddress(val) {
        this.contrastAddress = [this.mergeLists.mergeList[val].provinceRegionId + '', this.mergeLists.mergeList[val].cityRegionId + '', this.mergeLists.mergeList[val].areaRegionId + '',this.mergeLists.mergeList[val].townRegionId + ''];
        this.mergeValue = [this.mergeLists.mergeList[val].provinceRegionId + '', this.mergeLists.mergeList[val].cityRegionId + '', this.mergeLists.mergeList[val].areaRegionId + '',this.mergeLists.mergeList[val].townRegionId + ''];
        this.mergeLabel = [this.mergeLists.mergeList[val].consigneeProvince + '', this.mergeLists.mergeList[val].consigneeCity + '', this.mergeLists.mergeList[val].consigneeArea + '', this.mergeLists.mergeList[val].consigneeTown];
        this.ruleForm.town = this.mergeLists.mergeList[val].shippingAddress;
      },
      //合并 获取可以合并和不能合并的单
      orderMerge() {
        let str = '';
        this.orderLists.forEach(item => {
          str += item.salesOrderId + ',';
        });
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funMergeFindSelectOrder', {orderIds: str.slice(0, -1)})
          .then(res => {
            if (res.data.success == true) {
              res.data.result.mergeList.forEach(item => {
                item.shippingAddress = item.consigneeProvince + item.consigneeCity + item.consigneeArea + item.shippingAddress;
              })
              this.mergeLists = res.data.result;
              //console.log(this.mergeLists.unmergeList.length);
              if (this.mergeLists.unMergeReasonList.length == 0) {
                this.mergeLists.mergeList.forEach(item => {
                  var a = new Date(new Date(item.payTime));
                  item.payTime = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds();
                });
                this.mergeVisible = true;
              } else {
                this.allLength = this.orderLists.length;
                this.okLength = this.mergeLists.mergeList.length;
                this.noLength = this.mergeLists.unMergeReasonList.length; //
                this.errorVisible = true;
              }
            } else {

            }
          })
      },
      //点击表格未合并
      unincorporatedBtn(val) {
        this.mainOrder = val;
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funMergeFindSignOrder', {salesOrderId: val.salesOrderId})
          .then(res => {
            if (res.data.success == true) {
              if (res.data.code == 0) {
                this.signVisible = true;
                res.data.result.forEach((item, index) => {
                  if (item.salesOrderNo == val.salesOrderNo) {
                    res.data.result.splice(index, 1);
                  }
                });
                res.data.result.forEach(item => {
                  if (item.payTime) {
                    let a = new Date(new Date(item.payTime));
                    item.payTime = a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds();
                  }
                });
                this.signMergeList = res.data.result;

                //console.log(val);
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      // 未合并订单list selection-change
      orderMergeMethods(val) {
        this.unincorporatedList = val;
        console.log(val);
      },
      // 点击未合并里的合并
      onlyMergeOrder(val, val2) {
        if (this.unincorporatedList.length == 0) {
          this.$message({
            message: '请选择需要合并的订单',
            type: 'warning'
          });
          return;
        }
        this.catelogue = false;
        // 处理公共的参数
        let data = {
          orderIds: '',
          masterId: this.mainOrder.salesOrderId,
          signMerge: 0,//0：勾选产生的合并，1：点击未合并产生的合并
          masterChange: 0, //主单有无修改：0：没修改，不需要传入收件人姓名，手机，地址信息，1：修改，传入收件人姓名，手机，地址
          audit: val, //0:合并后不客审，1：合并后客审
          forceMerge: val2, ////强制合并：0：不强制，1：强制合并. 这个参数的作用是后台判断有挂起的订单，且挂起类型仅为未合并时，如果该参数为false，返回提示。为1则直接强制处理。

          //以下参数是当勾选订单时，客户端修改收货人信
          receiveName: '', // 收货让人姓名
          receiveAddress: '', // 详细地址
          receiveMobile: '', // 手机
          provinceRegionId: '', // 省id
          cityRegionId: '',// 市id
          areaRegionId: '',// 区id
          consigneeProvince: '',// 省name
          consigneeCity: '',// 市name
          consigneeArea: ''// 区name
        };

        this.unincorporatedList.forEach(item => {
          data.orderIds += item.salesOrderId + ',';
        });
        data.orderIds = data.orderIds.slice(0, -1);
        console.log(data);
        this.mergeMethods(data, val);
      },
      //仅合并
      onlyMerge(val, val2) {
        // console.log(this.mergeLists.mergeList[this.radio].salesOrderId);
        // return false;
        if (this.radio === '' && this.radio !== 0) {
          this.$message({
            message: '请选择一个主单',
            type: 'warning'
          });
          return false;
        }
        this.holdClick = true;
        if (val == 0) {
          this.signDesign = 2;
        } else if (val == 1) {
          this.signDesign = 3;
        }
        // 处理公共的参数
        let data = {
          orderIds: '',
          masterId: this.mergeLists.mergeList[this.radio].salesOrderId,
          signMerge: 0,//0：勾选产生的合并，1：点击未合并产生的合并
          masterChange: 0, //主单有无修改：0：没修改，不需要传入收件人姓名，手机，地址信息，1：修改，传入收件人姓名，手机，地址
          audit: val, //0:合并后不客审，1：合并后客审
          forceMerge: val2, ////强制合并：0：不强制，1：强制合并. 这个参数的作用是后台判断有挂起的订单，且挂起类型仅为未合并时，如果该参数为false，返回提示。为1则直接强制处理。

          //以下参数是当勾选订单时，客户端修改收货人信
          receiveName: '', // 收货让人姓名
          receiveAddress: '', // 详细地址
          receiveMobile: '', // 手机
          provinceRegionId: '', // 省id
          cityRegionId: '',// 市id
          areaRegionId: '',// 区id
          consigneeProvince: '',// 省name
          consigneeCity: '',// 市name
          consigneeArea: ''// 区name
        };
        this.mergeLists.mergeList.forEach(item => {
          data.orderIds += item.salesOrderId + ',';
        });
        data.orderIds = data.orderIds.slice(0, -1);
        //console.log(this.isShow,88888);
        if (this.isShow === true) { // 没有手动修改，radio
          if (this.radio === this.radio1 && this.radio === this.radio2 && this.radio === this.radio3) { // 没有修改的情况下
            this.mergeMethods(data, this.signDesign); //合并接口调用
          } else { // 修改的情况下
            data.receiveName = this.mergeLists.mergeList[this.radio1].consignee; // 收货人
            data.receiveMobile = this.mergeLists.mergeList[this.radio2].consigneeMobile; // 手机
            data.provinceRegionId = this.mergeValue[0]; // 省id
            this.proCityAreaData.forEach(item => {
              if (this.mergeValue[0] == item.regionId) {
                data.consigneeProvince = item.regionName; // 省name
              }
            });
            data.cityRegionId = this.mergeValue[1]; // 市id
            this.city.forEach(item => {
              if (this.mergeValue[1] == item.regionId) {
                data.consigneeCity = item.regionName; // 市name
              }
            });
            data.areaRegionId = this.mergeValue[2]; // 区id
            this.area.forEach(item => {
              if (this.mergeValue[2] == item.regionId) {
                data.consigneeArea = item.regionName; // 区name
              }
            });
            data.receiveAddress = this.mergeLists.mergeList[this.radio2].shippingAddress; // 详细地址
            data.masterChange = 1; // 修改
            this.mergeMethods(data, this.signDesign); //合并接口调用
          }
        } else if (this.isShow === false) { // 点击手动修改按钮
          // console.log(this.ruleForm.people,1);
          // console.log(this.ruleForm.phone,2);
          // console.log(this.mergeValue[0],3);
          // console.log(this.radio,this.radio1,this.radio2,this.radio3);
          //if (this.radio === this.radio1 && this.radio === this.radio2 && this.radio === this.radio3) {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
          //手动修改了
          if (this.ruleForm.phone != this.mergeLists.mergeList[this.radio].consigneeMobile || this.ruleForm.people != this.mergeLists.mergeList[this.radio].consignee || this.ruleForm.town != this.mergeLists.mergeList[this.radio].shippingAddress || this.contrastAddress.toString() != this.mergeValue.toString()) {
            if (this.ruleForm.people == '') {
              this.$message({
                message: '请输入收货人姓名',
                type: 'warning'
              });
              this.holdClick = false;
              return false;
            }
            if (this.ruleForm.phone == '') {
              this.$message({
                message: '请输入手机号',
                type: 'warning'
              });
              this.holdClick = false;
              return false;
            }
            if (!reg.test(this.ruleForm.phone)) {
              this.$message({
                message: '请输入正确的手机号',
                type: 'warning'
              });
              this.holdClick = false;
              return false;
            }

            if (this.areaParams.validatePass) {
              this.$message({
                message: this.areaParams.validatePass,
                type: 'warning'
              });
              this.holdClick = false;
              return false;
            }
            if (this.ruleForm.town == '') {
              this.$message({
                message: '请输入详细地址',
                type: 'warning'
              });
              this.holdClick = false;
              return false;
            }
            data.receiveName = this.ruleForm.people; // 收货人
            data.receiveMobile = this.ruleForm.phone; // 手机
            data.provinceRegionId = this.areaParams.proCityAreaValue[0]; // 省id
            data.consigneeProvince = this.areaParams.proCityAreaLabel[0]; // 省name
            data.cityRegionId = this.areaParams.proCityAreaValue[1]; // 市id
            data.consigneeCity = this.areaParams.proCityAreaLabel[1]; // 市name
            data.areaRegionId = this.areaParams.proCityAreaValue[2]; // 区id
            data.consigneeArea = this.areaParams.proCityAreaLabel[2]; // 区name
            data.receiveAddress = this.ruleForm.town; // 详细地址
            data.masterChange = 1; // 修改
            this.mergeMethods(data, this.signDesign); //合并接口调用
          } else { // 没有任何修改
            this.mergeMethods(data, this.signDesign); //合并接口调用
          }
        }
      },
      //合并接口调用
      mergeMethods(data, num) {
        data.permitFlag = Boolean(this.authorityCode.OMS_ORDERPROCESSING_REVIEWSERVICE);
        this._post('com.edb01.erp.oms.service.api.OrderBaseFunService/' + this.version + '/funMerge', data)
          .then(res => {
            if (res.data.success == true) {
              if (res.data.code == 1001) { // 不存在满足条件的仅含未合并标的订单

              } else if (res.data.code == 1002) { //单数少于2单，不执行合并
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              } else if (res.data.code == 1003) {//有不可合并订单，不执行合并
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              } else if (res.data.code == 1004) { // 存在挂起且挂起原因仅为未合并的订单,是否强制合并----
                if (num == 0) {
                  this.forcedMerge = true;
                } else if (num == 1) {
                  this.forcedMerge2 = true;
                } else if (num == 2) {
                  this.forcedMerge1 = true;
                } else if (num == 3) {
                  this.forcedMerge3 = true;
                }

              } else if (res.data.code == 1007) {//解挂或反客审之后，主单不可合并
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              } else if (res.data.code == 1008) {//解挂或反客审之后，可合并单数少于2单，不执行合并
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              } else if (res.data.code == 1009) {//合并后，订单已挂起,没有执行客审
                this.catelogue = true;
                this.forcedMerge3 = false;
                this.forcedMerge2 = false;
                this.forcedMerge1 = false;
                this.forcedMerge = false;
                this.signVisible = false;
                this.orderSuccess = res.data.result.newOrderCode;
                this.orderSuccessId = res.data.result.newOrderId;
                this.messageMsg = res.data.msg;
                this.mergeSuccess = true;
                if (this.higeSearchFlag) {
                  this.highSearch()
                } else {
                  this.easySearch();
                }
              } else if (res.data.code == 1010) {//合并后，订单商品可售库存不足,没有执行客审
                this.catelogue = true;
                this.forcedMerge3 = false;
                this.forcedMerge2 = false;
                this.forcedMerge1 = false;
                this.forcedMerge = false;
                this.signVisible = false;
                this.orderSuccess = res.data.result.newOrderCode;
                this.orderSuccessId = res.data.result.newOrderId;
                this.messageMsg = res.data.msg;
                this.mergeSuccess = true;
                if (this.higeSearchFlag) {
                  this.highSearch()
                } else {
                  this.easySearch();
                }
              } else if (res.data.code == 1011) {//合并成功，新单客审成功
                this.forcedMerge3 = false;
                this.forcedMerge2 = false;
                this.forcedMerge1 = false;
                this.forcedMerge = false;
                this.signVisible = false;
                this.orderSuccess = res.data.result.newOrderCode;
                this.orderSuccessId = res.data.result.newOrderId;
                this.mergeSuccess = true;
                if (this.higeSearchFlag) {
                  this.highSearch()
                } else {
                  this.easySearch();
                }
              } else if (res.data.code == 1012) {//合并成功
                this.forcedMerge3 = false;
                this.forcedMerge2 = false;
                this.forcedMerge1 = false;
                this.forcedMerge = false;
                this.signVisible = false;
                this.orderSuccess = res.data.result.newOrderCode;
                this.orderSuccessId = res.data.result.newOrderId;
                this.mergeSuccess = true;
                if (this.higeSearchFlag) {
                  this.highSearch()
                } else {
                  this.easySearch();
                }
              } else if (res.data.code == 1013) {//合并成功，客审失败,客审失败原因
                this.forcedMerge3 = false;
                this.forcedMerge2 = false;
                this.forcedMerge1 = false;
                this.forcedMerge = false;
                this.signVisible = false;
                this.orderSuccess = res.data.result.newOrderCode;
                this.orderSuccessId = res.data.result.newOrderId;
                this.catelogue = true;
                this.messageMsg = res.data.msg;
                this.mergeSuccess = true;
                if (this.higeSearchFlag) {
                  this.highSearch()
                } else {
                  this.easySearch();
                }
              }
              this.holdClick = false;
            } else {
              this.holdClick = false;
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      },
      //客审
      servReview(type) {
        //orderLists
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funOrderCheck", {
          orderIds: this.orderIds,
          commitNum: type,
          canCheckPass: type == 1 ? false : true
        }).then((response) => {
          if (response.data.code == 1000) {
            this.successShowStatus = true;
            this.responseList = response.data.result.rows;
            this.allNum = response.data.result.orderTotalQty;
            this.successNum = response.data.result.successQty;
            this.faliNum = response.data.result.failQty;
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else if (response.data.code == 1002) {
            this.$confirm('审核订单中含异常订单确认强制审核通过？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.servReview(2);
            }).catch(() => {
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //手动分配热敏单
      hotSingle(type) {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funOrderHotPaperAlloc", {
          orderIds: this.orderIds,
          commitNum: type,
          canCheckPass: type == 1 ? false : true
        }).then((response) => {
          if (response.data.code == 1000) {
            this.successShowStatus = true;
            this.responseList = response.data.result.rows;
            this.allNum = response.data.result.orderTotalQty;
            this.successNum = response.data.result.successQty;
            this.faliNum = response.data.result.failQty;
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else if (response.data.code == 1002) {
            this.$confirm('所选订单已含有快递单号，确认再次重新手动分配？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.hotSingle(2);
            }).catch(() => {
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //反客审
      returnServReview(type) {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funReturnOrderCheck", {
          orderIds: this.orderIds,
          commitNum: type,
          canCheckPass: type == 1 ? false : true,
          permitFlag:Boolean(this.authorityCode.OMS_ORDERPROCESSING_REVIEWSERVICE)
        }).then((response) => {
          if (response.data.code == 1000) {
            this.successShowStatus = true;
            this.responseList = response.data.result.rows;
            this.allNum = response.data.result.orderTotalQty;
            this.successNum = response.data.result.successQty;
            this.faliNum = response.data.result.failQty;
            this.customerNum = response.data.result.servSignUpFailQty;
            if (this.higeSearchFlag) {
              this.highSearch();
            } else {
              this.easySearch();
            }
          } else if (response.data.code == 1003) {
            this.$confirm('有已客审订单允许反客审,是否执行反客审操作？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.returnServReview(2);
            }).catch(() => {
            });
          } else if (response.data.code == 1002) {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //仓审
      storeReview(type) {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funStorageCheck", {
          orderIds: this.orderIds,
          commitNum: type,
          canCheckPass: type == 1 || type == 3 ? false : true
        }).then((response) => {
          if (response.data.code == 1000) {
            this.successShowStatus = true;
            this.responseList = response.data.result.rows;
            this.allNum = response.data.result.orderTotalQty;
            this.successNum = response.data.result.successQty;
            this.faliNum = response.data.result.failQty;
            if (this.higeSearchFlag) {
              this.highSearch();
            } else {
              this.easySearch();
            }
          } else if (response.data.code == 1002) {
            this.$confirm('仓审订单中含超重订单,是否处理？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.storeReview(2);
            }).catch(() => {
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //解挂
      returnHandup(type) {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funOrderReturnHandup", {
          orderIds: this.orderIds,
          commitNum: type,
          canCheckPass: type == 1 ? false : true,
          permitFlag:Boolean(this.authorityCode.OMS_ORDERPROCESSING_REVIEWSERVICE)
        }).then((response) => {
          if (response.data.code == 1000) {
            this.successShowStatus = true;
            this.responseList = response.data.result.funResultBeans;
            this.allNum = this.orderLists.length;
            this.successNum = response.data.result.successCount;
            this.faliNum = response.data.result.failCount;
            this.customerNum = response.data.result.sverCount;
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else if (response.data.code == 1002) {
            this.$confirm('所选订单中存在有客服备注更新失败的订单，是否处理?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.returnHandup(2);
            }).catch(() => {
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //仓库列表展示
      storeShow() {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateStorageCheck", {
          orderIds: this.orderIds
        }).then((response) => {
          if (response.data.success) {
            if (response.data.result) {
              this.selectStore = '';
              this._post("com.edb01.erp.wms.service.api.WmStorageService/" + this.version + "/getByName", {
                storageName: this.selectStore
              }).then((response) => {
                if (response.data.success) {
                  this.batchStoreShowStatus = true;
                  this.warehouseListTemp = response.data.result;
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: "warning"
                  });
                }
              })
            } else {
              this.errStorageDialog = true;
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //仓库筛选查询
      storeShowSearch() {
        this.batchStoreId = '';
        this._post("com.edb01.erp.wms.service.api.WmStorageService/" + this.version + "/getByName", {
          storageName: this.selectStore
        }).then((response) => {
          if (response.data.success) {
            this.warehouseListTemp = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //批量修改仓库选择仓库
      selectStoreRow(row, oldrow) {
        if (row) this.batchStoreId = row.storageId;
      },
      //批量修改仓库
      updateStore() {
        if (this.batchStoreId == '') {
          this.$message({
            message: '请选择仓库！',
            type: 'warning'
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateStorage", {
          orderIds: this.orderIds,
          storageId: this.batchStoreId
        }).then((response) => {
          if (response.data.code == 1000) {
            if (response.data.result.count > 0) {
              this.$alert("已修改" + response.data.result.count + "条!", "批量改仓库", {
                type: "success",
                center: true,
                confirmButtonText: "知道了"
              });
              if (this.higeSearchFlag) {
                this.highSearch()
              } else {
                this.easySearch();
              }
              setTimeout(() => {
                this.batchStoreShowStatus = false;
              })
            } else {
              this.errStorageDialog = true;
              setTimeout(() => {
                this.batchStoreShowStatus = false;
              })
            }
          } else if (response.data.code == 1002) {
            this.errStorageDialog = true;
            setTimeout(() => {
              this.batchStoreShowStatus = false;
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //快递列表展示
      expressShow(flag) {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateExpressCheck", {
          orderIds: this.orderIds
        }).then((response) => {
          if (response.data.success) {
            if (response.data.result) {
              this.expressInput = '';
              this._post("com.edb01.erp.wms.service.api.ExpressService/" + this.version + "/getExpressIdNameBean", {
                expressName: this.expressInput
              }).then((response) => {
                if (response.data.success) {
                  this.batchExpressShowStatus = true;
                  this.expressListTemp = response.data.result;
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: "warning"
                  });
                }
              })
            } else {
              this.errExpressDialog = true;
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //快递筛选查询
      expressShowSearch() {
        this.batchExpressId = '';
        this._post("com.edb01.erp.wms.service.api.ExpressService/" + this.version + "/getExpressIdNameBean", {
          expressName: this.expressInput
        }).then((response) => {
          if (response.data.success) {
            this.expressListTemp = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //批量修改快递选择快递
      selectExpressRow(row, oldrow) {
        if (row) this.batchExpressId = row.expressId;
      },
      handleSelectionChange(val) {
        this.partExpressSelect = val;
      },
      //批量修改快递
      updateExpress() {
        if (this.batchExpressId == '') {
          this.$message({
            message: '请选择快递！',
            type: 'warning'
          });
          return false;
        }
        var orderIds = '', expressId = '';
        //二级修改快递
        if (this.partExpressSelect.length > 0) {
          this.partExpressSelect.forEach((item, i) => {
            orderIds += item.salesOrderId + ',';
          });
          orderIds = orderIds.slice(0, -1);
        } else {
          orderIds = this.orderIds
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateExpress", {
          orderIds,
          expressId: this.batchExpressId
        }).then((response) => {
          if (response.data.code == 1000) {
            if (response.data.result.failCount == 0) {
              this.$alert("已修改" + response.data.result.successCount + "条!", "批量改快递", {
                type: "success",
                center: true,
                confirmButtonText: "知道了"
              });
              if (this.higeSearchFlag) {
                this.highSearch()
              } else {
                this.easySearch();
              }
              setTimeout(() => {
                this.batchExpressShowStatus = false;
                this.partErrExpressDialog = false;
                this.partExpressSelect = [];
              })
            } else {
              //部分修改失败
              this.partErrExpressDialog = true;
              this.partErrExpressList = response.data.result.baseBatchUpOrders;
              this.partErrExpressList.forEach((item, i) => {
                if (item.payTime) item.payTime = turnTimestamp(item.payTime);
              })
              this.successNum = response.data.result.successCount;
              this.faliNum = response.data.result.failCount;
              setTimeout(() => {
                this.batchExpressShowStatus = false;
              })
            }
          } else if (response.data.code == 1002) {
            this.errExpressDialog = true;
            setTimeout(() => {
              this.batchExpressShowStatus = false;
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //二级改快递弹框
      subChangeExpress() {
        if (this.partExpressSelect.length == 0) {
          this.$message({
            message: '请选择需要批量修改快递的订单!',
            type: 'warning'
          });
          return false;
        }
        this.expressShow(1);
        this.batchExpressId = '';
      },
      handleClose(done) {
        this.partExpressSelect = [];
        done();
      },
      //批量修改快递失败列表的二级挂起
      subHangUp() {
        if (this.partExpressSelect.length == 0) {
          this.$message({
            message: '请勾选订单',
            type: 'warning'
          })
          return false;
        }
        this.orderLists = this.partExpressSelect;
        this.setOrder('handup');
      },
      //商品or赠品失败的挂起
      complimentaryOrShop() {
        if (this.partSelectArr.length == 0) {
          this.$message({
            message: '请勾选订单',
            type: 'warning'
          });
          return false;
        }
        this.orderLists = this.partSelectArr;
        this.setOrder('handup');
      },
      //二级导出
      subExport() {
        var str = '';
        this.partErrExpressList.forEach((item, i) => {
          str += `<tr><td>${item.salesOrderNo ? item.salesOrderNo : ''}</td><td>${item.orderSign ? item.orderSign : ''}</td><td>${item.orderStatus ? item.orderStatus : ''}</td>
         <td>${item.payTime ? item.payTime : ''}</td><td>${item.consigneeProvince ? item.consigneeProvince : ''} ${item.consigneeCity ? item.consigneeCity : ''}
         ${item.consigneeArea ? item.consigneeArea : ''}${item.consigneeTown ? item.consigneeTown : ''} ${item.shippingAddress ? item.shippingAddress : ''}</td>
         <td>${item.storageName ? item.storageName : ''}</td><td>${item.expressName ? item.expressName : ''}</td><td>${item.failReason ? item.failReason : ''}</td></tr>`;
        })
        var html = "<html><head><meta charset='utf-8' /></head><body><table border='1'><caption>订单改快递失败列表</caption>" +
          "<tr><td>订单号</td><td>标记</td><td>订单状态</td><td>付款时间</td><td>收货地址</td><td>仓库</td><td>快递</td><td>失败原因</td></tr>" + str + "</table></body></html>";
        // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
        var blob = new Blob([html], {type: "application/vnd.ms-excel"});
        var a = this.$refs.downLoadFail;
        // 利用URL.createObjectURL()方法为a元素生成blob URL
        a.href = URL.createObjectURL(blob);
        // 设置文件名
        var date = new Date().toLocaleDateString().split('/');
        var m = date[1] < 10 ? '0' + date[1] : date[1];
        var d = date[2] < 10 ? '0' + date[2] : date[2];
        a.download = "失败订单_" + date[0] + m + d + ".xls";
      },
      //内部便签展示
      noteMsgShow() {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateNoteMsgCheck", {
          orderIds: this.orderIds
        }).then((response) => {
          if (response.data.success) {
            if (response.data.result) {
              this.batchNoteMsgShowStatus = true;
            } else {
              this.errNotesDialog = true;
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //批量修改内部便签
      updateNoteMsg() {
        if (this.setNoteMsg.trim() == '') {
          this.$message({
            message: '请输入内部便签！',
            type: 'warning'
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateNoteMsg", {
          orderIds: this.orderIds,
          noteMsg: this.setNoteMsg,
          isAppend: this.noteMsgType
        }).then((response) => {
          if (response.data.code == 1000) {
            this.successShowNotes = true;
            this.allNum = response.data.result.successCount + response.data.result.failcount;
            this.successNum = response.data.result.successCount;
            this.faliNum = response.data.result.failcount;
            setTimeout(() => {
              this.batchNoteMsgShowStatus = false;
            })
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else if (response.data.code == 1002) {
            this.errNotesDialog = true;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //仓审须知展示
      StoreMsgShow() {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateStorageMsgCheck", {
          orderIds: this.orderIds
        }).then((response) => {
          if (response.data.success) {
            if (response.data.result) {
              this.batchStoreMsgShowStatus = true;
            } else {
              this.$message({
                message: '已客审未发货的订单可修改仓审须知！',
                type: "warning"
              });
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //批量修改仓审须知
      updateStoreMsg() {
        if (this.setStoreMsg.trim() == '') {
          this.$message({
            message: '请输入仓审须知！',
            type: 'warning'
          });
          return false;
        }//setStoreMsg storeMsgType
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateStorageMsg", {
          orderIds: this.orderIds,
          storageMsg: this.setStoreMsg,
          isAppend: this.storeMsgType
        }).then((response) => {
          if (response.data.code == 1000) {
            this.successShowNotes = true;
            this.allNum = response.data.result.successCount + response.data.result.failcount;
            this.successNum = response.data.result.successCount;
            this.faliNum = response.data.result.failcount;
            setTimeout(() => {
              this.batchStoreMsgShowStatus = false;
            })
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else if (response.data.code == 1002) {
            this.$message({
              message: '已客审未发货的订单可修改仓审须知！',
              type: "warning"
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //单个修改仓库
      updateSignStore(expressEle, rows) {
        this.$confirm('是否确定修改修改为当前仓库？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateStorage", {
            orderIds: this.orderIds,
            storageId: this.batchStoreId
          }).then((response) => {
            if (response.data.code == 1000) {
              if (response.data.result.count == 1) {
                this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version + "/getExpressListBean", {
                  storageId: this.batchStoreId
                }).then((response) => {
                  if (response.data.success) {
                    this.expressBeensList = response.data.result;
                    var isHas = false;
                    response.data.result = response.data.result ? response.data.result : [];
                    response.data.result.forEach((item, i) => {
                      if (item.expressId == rows.expressId) {
                        isHas = true;
                      }
                    })
                    if (isHas || rows.expressId == '' || rows.expressId == undefined) {
                      this.$alert("修改成功!", "改仓库", {
                        type: "success",
                        center: true,
                        confirmButtonText: "知道了"
                      });
                      if (this.higeSearchFlag) {
                        this.highSearch()
                      } else {
                        this.easySearch();
                      }
                    } else {
                      if (this.higeSearchFlag) {
                        this.highSearch('continueModify');
                      } else {
                        this.easySearch('continueModify');
                      }
                      this.$confirm('当前快递在当前仓库不可发，是否修改快递?', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'warning',
                        center: true
                      }).then(() => {
                        setTimeout(() => {
                          this.editExpressDialog = true;
                          this.expressId = '';
                        }, 300)
                      }).catch(() => {
                        this.orderIds = '';
                      });
                    }
                  } else {
                    this.$message({
                      message: response.data.msg,
                      type: "warning"
                    });
                  }
                })
              } else {
                this.$message({
                  message: response.data.result.baseBatchUpOrders[0].failReason,
                  type: "warning"
                });
                $(expressEle).val(this.storageEleId);
              }
            } else if (response.data.code == 1002) {
              this.$message({
                message: response.data.result.baseBatchUpOrders[0].failReason,
                type: "warning"
              });
              $(expressEle).val(this.storageEleId);
            } else {
              this.$message({
                message: response.data.msg,
                type: "warning"
              });
              $(expressEle).val(this.storageEleId);
            }
          })
        }).catch(() => {
          $(expressEle).val(this.storageEleId);
        });
      },
      //仓库下快递修改
      updateStorageExpress() {
        if (!this.expressId) {
          this.$message({
            message: '请选择快递！',
            type: "warning"
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateExpress", {
          orderIds: this.orderIds,
          expressId: this.expressId
        }).then((response) => {
          var _this = this;
          //快递不可达是否强制修改快递
          function expressUnReach(){
            if (response.data.result.baseBatchUpOrders[0].failReason == '快递不可达') {
              _this.$confirm('选择的快递不可达！是否强制选择此快递?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning',
                center: true
              }).then(() => {
                _this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + _this.version + "/funUpdateExpress", {
                  orderIds: _this.orderIds,
                  expressId: _this.expressId,
                  forceChangeFlag: true
                }).then((response) => {
                  if (response.data.code == 1000) {
                    if (response.data.result.successCount == 1) {
                      _this.editExpressDialog = false;
                      _this.$message({
                        message: '修改成功！',
                        type: "success"
                      });
                      if (_this.higeSearchFlag) {
                        _this.highSearch()
                      } else {
                        _this.easySearch();
                      }
                    } else {
                      _this.$message({
                        message: response.data.result.baseBatchUpOrders[0].failReason,
                        type: "warning"
                      });
                    }
                  } else if (response.data.code == 1002) {
                    _this.$message({
                      message: response.data.result.baseBatchUpOrders[0].failReason,
                      type: "warning"
                    });
                  } else {
                    _this.$message({
                      message: response.data.msg,
                      type: "warning"
                    });
                  }
                })
              }).catch(() => {
              });
            } else {
              _this.$message({
                message: response.data.result.baseBatchUpOrders[0].failReason,
                type: "warning"
              });
            }
          }
          if (response.data.code == 1000) {
            if (response.data.result.successCount == 1) {
              this.editExpressDialog = false;
              this.$message({
                message: '修改成功！',
                type: "success"
              });
              if (this.higeSearchFlag) {
                this.highSearch()
              } else {
                this.easySearch();
              }
            } else {
              //快递不可达是否强制修改快递
              expressUnReach();
            }
          } else if (response.data.code == 1002) {
            //快递不可达是否强制修改快递
            expressUnReach();
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      updateStorageExpressCancel(){
        this.editExpressDialog = false;
        this.orderIds = '';
      },
      //单个修改快递
      updateSignExpress(expressEle) {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateExpress", {
          orderIds: this.orderIds,
          expressId: this.batchExpressId
        }).then((response) => {
          var _this = this;
          //快递不可达是否强制修改快递
          function expressUnReach(){
            if (response.data.result.baseBatchUpOrders[0].failReason == '快递不可达') {
              _this.$confirm('选择的快递不可达！是否强制选择此快递?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning',
                center: true
              }).then(() => {
                _this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + _this.version + "/funUpdateExpress", {
                  orderIds: _this.orderIds,
                  expressId: _this.batchExpressId,
                  forceChangeFlag: true
                }).then((response) => {
                  if (response.data.code == 1000) {
                    if (response.data.result.successCount == 1) {
                      _this.$alert("修改成功！", "改快递", {
                        type: "success",
                        center: true,
                        confirmButtonText: "知道了"
                      });
                      if (_this.higeSearchFlag) {
                        _this.highSearch()
                      } else {
                        _this.easySearch();
                      }
                    } else {
                      _this.$message({
                        message: response.data.result.baseBatchUpOrders[0].failReason,
                        type: "warning"
                      });
                      $(expressEle).val(_this.expressEleId);
                    }
                  } else if (response.data.code == 1002) {
                    _this.$message({
                      message: response.data.result.baseBatchUpOrders[0].failReason,
                      type: "warning"
                    });
                    $(expressEle).val(_this.expressEleId);
                  } else {
                    _this.$message({
                      message: response.data.msg,
                      type: "warning"
                    });
                    $(expressEle).val(_this.expressEleId);
                  }
                })
              }).catch(() => {
                $(expressEle).val(_this.expressEleId);
              });
            } else {
              _this.$message({
                message: response.data.result.baseBatchUpOrders[0].failReason,
                type: "warning"
              });
              $(expressEle).val(_this.expressEleId);
            }
          }
          if (response.data.code == 1000) {
            if (response.data.result.successCount == 1) {
              this.$alert("修改成功！", "改快递", {
                type: "success",
                center: true,
                confirmButtonText: "知道了"
              });
              if (this.higeSearchFlag) {
                this.highSearch()
              } else {
                this.easySearch();
              }
            } else {
              //快递不可达是否强制修改快递
              expressUnReach();
            }
          } else if (response.data.code == 1002) {
            //快递不可达是否强制修改快递
            expressUnReach();
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
            $(expressEle).val(this.expressEleId);
          }
        })
      },
      //单个内部标签修改
      nodeChannelSave() {
        if (!this.noteMsg || this.noteMsg.trim() == '') {
          this.$message({
            message: '请输入内部便签！',
            type: 'warning'
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateNoteMsg", {
          orderIds: this.orderIds,
          noteMsg: this.noteMsg,
          isAppend: 0
        }).then((response) => {
          if (response.data.code == 1000) {
            this.$message({
              message: '修改成功！',
              type: "success"
            });
            this.noteVisible = false;
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //单个仓审须知修改
      noticeChannelSave() {
        if (!this.storeMsg || this.storeMsg.trim() == '') {
          this.$message({
            message: '请输入仓审须知！',
            type: 'warning'
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpdateStorageMsg", {
          orderIds: this.orderIds,
          storageMsg: this.storeMsg,
          isAppend: 0
        }).then((response) => {
          if (response.data.code == 1000) {
            this.$message({
              message: '修改成功！',
              type: "success"
            });
            this.noticeVisible = false;
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //修改收货地址
      channelAddress() {
        //receiveName receiveMobile proCityAreaValue receiveAddress
        if (this.receiveName == '') {
          this.$message({
            message: '请输入收货人！',
            type: 'warning'
          });
          return false;
        }
        if (this.receiveMobile == '') {
          this.$message({
            message: '请输入手机号码',
            type: 'warning'
          });
          return false;
        }
        if (this.areaParams.validatePass) {
          this.$message({
            message: this.areaParams.validatePass,
            type: 'warning'
          });
          return false;
        }
        if (this.receiveAddress == '') {
          this.$message({
            message: '请输入详细地址',
            type: 'warning'
          });
          return false;
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funUpOrderAddress", {
          receiveName: this.receiveName,
          receiveMobile: this.receiveMobile,
          provinceRegionId: this.areaParams.proCityAreaValue[0] ? this.areaParams.proCityAreaValue[0] : '',
          cityRegionId: this.areaParams.proCityAreaValue[1] ? this.areaParams.proCityAreaValue[1] : '',
          areaRegionId: this.areaParams.proCityAreaValue[2] ? this.areaParams.proCityAreaValue[2] : '',
          townRegionId: this.areaParams.proCityAreaValue[3] ? this.areaParams.proCityAreaValue[3] : '',
          consigneeProvince: this.areaParams.proCityAreaLabel[0] ? this.areaParams.proCityAreaLabel[0] : '',
          consigneeCity: this.areaParams.proCityAreaLabel[1] ? this.areaParams.proCityAreaLabel[1] : '',
          consigneeArea: this.areaParams.proCityAreaLabel[2] ? this.areaParams.proCityAreaLabel[2] : '',
          consigneeTown: this.areaParams.proCityAreaLabel[3] ? this.areaParams.proCityAreaLabel[3] : '',
          receiveAddress: this.receiveAddress,
          orderId: this.rowsInfo.salesOrderId,
        }).then((response) => {
          if (response.data.result == 1) {
            this.$message({
              message: '收货信息修改成功！',
              type: "success"
            });
            this.receiptVisible = false;
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      channelArea(params) {
        console.log(params);
        this.areaParams = params;
        this.areaLoading = false;
      },
      //orderTab切换
      channelOrderTab(index) {
        this.paramData.orderTab = index;
        if (this.higeSearchFlag) {
          this.highSearchBtn(1, 2, 3)
        } else {
          this.easySearch();
        }
      },
      //预售缺货超重退款拆分
      preSaleSplitFn(type) {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funSplit", {
          orderIds: this.orderIds,
          splitType: type
        }).then((response) => {
          if (response.data.code == 0) {
            this.successShowStatus = true;
            this.responseList = response.data.result.rows;
            this.allNum = response.data.result.orderTotalQty;
            this.successNum = response.data.result.successQty;
            this.faliNum = response.data.result.failQty;
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else if (response.data.code == 1002) {
            this.$alert(response.data.msg, "拆分结果", {
              type: 'warning',
              center: true,
              confirmButtonText: "知道了"
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //导出
      exportSplit() {
        var str = '';
        this.responseList.forEach((item, i) => {
          str += `<tr><td>${item.orderCode ? item.orderCode : ''}</td><td>${item.failReason ? item.failReason : ''}</td></tr>`;
        })
        var html = "<html><head><meta charset='utf-8' /></head><body><table border='1'><caption>" + this.titleName + "失败列表</caption>" +
          "<tr><td>订单编号</td><td>失败原因</td></tr>" + str + "</table></body></html>";
        // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
        var blob = new Blob([html], {type: "application/vnd.ms-excel"});
        var a = this.$refs.splitExportLink;
        // 利用URL.createObjectURL()方法为a元素生成blob URL
        a.href = URL.createObjectURL(blob);
        // 设置文件名
        a.download = this.titleName + "失败列表.xls";
      },
      batchSplitSelection(val) {
        this.batchSplitSelect = val;
      },
      batchSplitQuery() {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funSplitSelectGoodsInfo", {
          orderIds: this.orderIds,
          type: this.batchSplitObj.type,
          info: this.batchSplitObj.info
        }).then((response) => {
          if (response.data.success) {
            this.batchSplitVisible = true;
            this.batchSplitData = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      batchSplitFn() {
        this.splitWay = '1';
        this.batchSplitObj.type = '1';
        this.batchSplitObj.info = '';
        this.batchSplitQuery();
      },
      //执行拆分
      batchSplitSave() {
        if (this.batchSplitSelect.length == 0) {
          this.$message({
            message: '请至少选择一个商品',
            type: "warning"
          });
          return false;
        } else if (this.batchSplitSelect.length == 1 && this.splitWay == '2') {
          this.$message({
            message: '选择一个商品时仅可选择拆至一单',
            type: "warning"
          });
          return false;
        }
        var goodsIds = '';
        this.batchSplitSelect.forEach((item, i) => {
          goodsIds += item.goodsId + ',';
        })
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funSplit", {
          orderIds: this.orderIds,
          splitType: 5,
          goodsIds: goodsIds.slice(0, -1),
          splitWay: this.splitWay
        }).then((response) => {
          if (response.data.success) {
            this.successShowStatus = true;
            this.responseList = response.data.result.rows;
            this.allNum = response.data.result.orderTotalQty;
            this.successNum = response.data.result.successQty;
            this.faliNum = response.data.result.failQty;
            var newOrderIdList = response.data.result.newOrderIdList ? response.data.result.newOrderIdList : [];
            setTimeout(() => {
              this.batchSplitVisible = false;
            })
            if (this.higeSearchFlag) {
              this.highSearch('split', newOrderIdList);
            } else {
              this.easySearch('split', newOrderIdList);
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },

      //手动拆分
      manualSplitFn() {//--------asd---------
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funSplitFindOrderDetails", {
          orderId: this.orderIds
        }).then((response) => {
          if (response.data.code == 1000) {
            /*if (response.data.result.orderStatus == '已客审') {
              this.$message({
                message: '已客审订单不可进行手动拆分',
                type: "warning"
              });
            } else */
            if (response.data.result.orderStatus == '已取消') {
              this.$message({
                message: '已取消订单不可进行手动拆分',
                type: "warning"
              });
            } else if (response.data.result.orderStatus == '已作废') {
              this.$message({
                message: '已作废订单不可进行手动拆分',
                type: "warning"
              });
            } else if (response.data.result.orderStatus == '已仓审') {
              this.$message({
                message: '已仓审订单不可进行手动拆分',
                type: "warning"
              });
            } else {
              if (response.data.result.orderStatus != '待客审') {
                this.$message({
                  message: '只有待客审订单可进行手动拆分',
                  type: "warning"
                });
                return false;
              }
              if (response.data.result.funSplitOrderDetailsBean.length == 1 && !response.data.result.funSplitOrderDetailsBean[0].suitFlag && !response.data.result.funSplitOrderDetailsBean[0].goodsQty == 1) {
                this.$message({
                  message: '该订单只包含一个商品且订货数量为1，不可进行手动拆分！',
                  type: "warning"
                });
                return false;
              }
              this.splitOrderBeansJson = [];
              this.manualSplitVisible = true;
              response.data.result.funSplitOrderDetailsBean.forEach((item, i) => {
                item.removableQty = item.goodsQty;
                item.splitQty = '';
                item.isDisabled = false;
                item.isSelect = false;
                item.signId = item.goodsId + item.orderItemId;
                //传给后台字段
                item.gift = item.giftFlag;
                item.preSale = item.presellFlag;
                item.return = item.refundFlag;
                item.spitSku = false;
                item.sku_id = item.goodsId;
                item.orderDetailId = item.orderItemId;

                if (item.orderSuitDetailBeans) {
                  item.minusArr = [];
                  var arr = [], minuArr = [];
                  item.orderSuitDetailBeans.forEach((item2, n) => {
                    //传给后台字段
                    item2.gift = item.giftFlag;
                    item2.preSale = item.presellFlag;
                    item2.return = item.refundFlag;
                    item2.spitSku = true;
                    item2.sku_id = item.goodsId;
                    item2.fromDetailId = item.orderItemId;

                    item2.index = n;
                    item2.signId = item2.goodsId + item2.orderItemId;
                    item2.splitQty = '';
                    item2.isDisabled = false;
                    item2.isSelect = false;
                    item2.removableQty = item2.goodsQty;
                    item2.minus = item2.goodsQty / item.goodsQty;
                    arr.push(item2.goodsQty);
                  })
                  /*arr = arr.sort((a, b) => {
                    return a - b;
                  })*/
                  arr.forEach((item3, i) => {
                    minuArr.push(item3 / item.goodsQty);
                  })
                  item.minusArr = minuArr;
                }
              })
              this.manualSplitObj = response.data.result;
              console.log(this.manualSplitObj);
            }
          } else if (response.data.code == 1003) {
            this.$message({
              message: '已挂起订单不可进行手动拆分',
              type: "warning"
            });
          } else if (response.data.code == 1004) {
            this.$message({
              message: '已作废订单不可进行手动拆分',
              type: "warning"
            });
          } else if (response.data.code == 1005) {
            this.$message({
              message: '未付款订单不可进行手动拆分',
              type: "warning"
            });
          } else if (response.data.code == 1006) {
            this.$message({
              message: '定金订单不可进行手动拆分',
              type: "warning"
            });
          }
        })
      },
      //手动拆分多选
      manualSplitSelection(val) {
        this.manualSplitSelect = val;
        var mapArr = new Map();
        this.manualSplitSelect.forEach((item, i) => {
          mapArr.set(item.signId, item);
        })
        console.log(this.manualSplitSelect, this.manualSplitObj.funSplitOrderDetailsBean);
        this.manualSplitObj.funSplitOrderDetailsBean.forEach(item => {
          if (mapArr.get(item.signId)) {
            item.checkedSelection = true;//该商品是否已勾选
          } else {
            item.checkedSelection = false;
          }
        })
      },
      //套装更多显示
      showSuitList(index, row) {
        if (row.suitFlag && !row.clicked && !row.giftFlag) {
          if(!row.orderSuitDetailBeans || row.orderSuitDetailBeans.length == 0){
            this.$message({
              message: '该套装下没有单品',
              type: 'warning'
            });
            return false;
          }
          for (var i = row.orderSuitDetailBeans.length; i--; i >= 0) {
            //套单
            row.orderSuitDetailBeans[i].classFlag = 'classFlag';//套装单品有此字段
            row.orderSuitDetailBeans[i].goodsName = row.orderSuitDetailBeans[i].goodsName;
            row.orderSuitDetailBeans[i].removableQty = row.removableQty * row.orderSuitDetailBeans[i].minus;
            this.manualSplitObj.funSplitOrderDetailsBean.splice(index + 1, 0, row.orderSuitDetailBeans[i]);
            //套装
            row.isSelect = true;//多选框是否可选择（true为禁用，false为可用）
            row.clicked = true;//记录是否展开了
            row.splitQty = '';
          }
          //多选框初始化不选
          this.manualSplitObj.funSplitOrderDetailsBean.forEach(item => {
            if (item.goodsId == row.goodsId) {
              this.$refs.multipleTable.toggleRowSelection(item, false);
            }
          });
        }
      },
      checkboxInit(row, index) {
        if (row.isSelect === true) {
          return false;
        } else {
          return true;
        }
      },
      //输入框keyUp
      splitQtyKeyup(index, row) {
        this.manualSplitObj.funSplitOrderDetailsBean[index].splitQty = this.manualSplitObj.funSplitOrderDetailsBean[index].splitQty.replace(/[^1-9]/g, '');
        /*this.manualSplitObj.funSplitOrderDetailsBean.forEach(row => {
          this.$refs.multipleTable.clearSelection();
        });*/
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (row.classFlag) {
            //套单输入框输入时
            if (item.orderItemId == row.orderItemId && !item.classFlag && row.splitQty != '') {
              //套单对应的套装（父）
              item.isDisabled = true;//输入框是否可输入（true为禁用，false为可用）
              item.isSelect = true;
            } else if (item.orderItemId == row.orderItemId) {
              //套单对应的套单（兄弟）
              item.isDisabled = false;
              //item.isSelect=false;
            }
          } else {
            //套装输入框输入时
            if (item.orderItemId == row.orderItemId) {
              if (item.classFlag && row.splitQty != '') {
                //套装对应的套单
                item.isDisabled = true;
                item.isSelect = true;
                this.$refs.multipleTable.toggleRowSelection(item, false);
              } else {
                //套装对应的套装
                item.isDisabled = false;
                item.isSelect = false;
              }
              //套装对应的套装如果有套单，套装输入为''时;
              if (!item.classFlag && row.splitQty == '' && row.clicked) {
                item.isSelect = true;
                this.$refs.multipleTable.toggleRowSelection(item, false);
              }
            }
          }
        })
      },
      //输入框blur
      splitQtyBlur(index, row) {
        if (row.splitQty > row.removableQty) {
          this.$message({
            message: '拆分数量不能超过可拆数量！',
            type: 'warning'
          });
          return false;
        }
        /*if(!row.suitFlag && !row.classFlag){
          //非套装和非套单
          row.removableQty=row.removableQty-row.splitQty;
        }else if(row.suitFlag && row.clicked){
          //套装且已点击展开
          row.removableQty=row.removableQty-row.splitQty;
          this.manualSplitObj.funSplitOrderDetailsBean.forEach((item,i)=>{
            if(item.orderItemId == row.orderItemId){
              // row.removableQty=row.removableQty-row.splitQty*row.minusArr[i];
            }
          })
        }*/
      },
      //拆出
      detachBtn() {
        var realSplitSelect = [];//checkbox可勾选的商品
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (!item.isSelect) {//isSelect 复选框true为禁用
            realSplitSelect.push(item);
          }
        })
        var isPass = false, isPass1 = false, isPass2 = false, isPass3 = false;
        if (this.manualSplitSelect.length == 0) {
          this.$message({
            message: '请选择所需拆分的产品',
            type: 'warning'
          });
          return false;
        }
        /*this.manualSplitSelect.forEach((item, i) => {
          if (item.removableQty != item.splitQty && item.splitQty != '') {
            isPass3 = true;
          }
          /!*if (item.removableQty == '0' && item.splitQty == '0') {
            isPass3 = true;
          }*!/
        })
        if (this.manualSplitSelect.length == realSplitSelect.length && !isPass3) {
          this.$message({
            message: '不可将该订单中所有产品从中拆出',
            type: 'warning'
          });
          return false;
        }
        //bug1
        var surplusArr = [];//除了可拆数量为0 剩下的所有的checkbox可勾选的商品
        realSplitSelect.forEach((item,i)=>{
          if(item.removableQty != '0'){
            surplusArr.push(item);
          }
        })
        if (this.manualSplitSelect.length == surplusArr.length && !isPass3) {
          this.$message({
            message: '不可将该订单中所有产品从中拆出',
            type: 'warning'
          });
          return false;
        }*/
        //
        this.manualSplitSelect.forEach((item, i) => {
          if (item.splitQty > item.removableQty) {
            isPass = true;
          }
          if (item.splitQty == '0') {
            isPass1 = true;
          }
        })
        if (isPass) {
          this.$message({
            message: '拆分数量已超过可拆数量不可对订单进行拆分',
            type: 'warning'
          });
          return false;
        }
        /*if (isPass1) {
          this.$message({
            message: '拆分数量不能为0',
            type: 'warning'
          });
          return false;
        }*/
        this.manualSplitSelect.forEach((item, i) => {
          if (item.splitQty == '') {
            item.splitQty = item.removableQty;
          }
          if (item.splitQty == '0') {
            isPass2 = true;
          }
        })
        if (isPass2) {
          this.$message({
            message: '可拆分数量为0，不能进行拆分！',
            type: 'warning'
          });
          return false;
        }
        //不可将该订单中所有产品从中拆出
        console.log(realSplitSelect);
        realSplitSelect.forEach((item, i) => {
          //未勾选只要removableQty不为0，iaPass3就为true（不可将该订单中所有产品从中拆出(没有拆出所有商品)）
          if (!item.checkedSelection && item.removableQty != 0) {
            isPass3 = true;
          }
          //勾选splitQty不为''并且splitQty < removableQty，iaPass3就为true
          console.log(item.checkedSelection, item.splitQty, item.removableQty);
          if (item.checkedSelection && item.splitQty != '' && item.splitQty * 1 < item.removableQty * 1) {
            isPass3 = true;
          }
        })
        if (!isPass3) {
          this.$message({
            message: '不可将该订单中所有产品从中拆出',
            type: 'warning'
          });
          return false;
        }
        //处理逻辑
        var mapArr = new Map();
        this.manualSplitSelect.forEach((item, i) => {
          mapArr.set(item.signId, item);
        })
        //1、预 赠 退 套装勾选 本行可拆计算
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (mapArr.get(item.signId) && !item.classFlag) {
            //不是套单（算非套单剩余可拆数量）
            item.removableQty = item.removableQty - item.splitQty;
          }
        })

        //2、套装下的单品勾选
        //（1）计算套装行的可拆数量
        //给套单赋值minusArr1，minusArr2;
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (mapArr.get(item.signId) && item.classFlag) {
            //是套单（算套装剩余可拆数量）
            var minusArr1 = [], minusArr2 = [];
            this.manualSplitObj.funSplitOrderDetailsBean.forEach((item2, i) => {
              if (item2.orderItemId == item.orderItemId && item2.classFlag) {
                minusArr1.push(item2.removableQty);
                if (item2.splitQty) {
                  if (mapArr.get(item2.signId)) {
                    minusArr2.push(item2.splitQty);
                  } else {
                    minusArr2.push(0);
                  }
                } else {
                  minusArr2.push(0);
                }
              }
            })
            item.minusArr1 = minusArr1;
            item.minusArr2 = minusArr2;
          }
        })
        //给套装可拆重新赋值
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (mapArr.get(item.signId) && item.classFlag) {
            this.manualSplitObj.funSplitOrderDetailsBean.forEach((item2, i) => {
              if (item2.orderItemId == item.orderItemId && !item2.classFlag) {
                item2.removableQty = switchGroup(item.minusArr1, item2.minusArr, item.minusArr2, 0)[0];
                item2.surplusQty = switchGroup(item.minusArr1, item2.minusArr, item.minusArr2, 0)[1];
              }
            })
          }
        })
        //（2）计算套装下的勾选的单品行的可拆数量
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (mapArr.get(item.signId) && item.classFlag) {
            item.removableQty = item.removableQty - item.splitQty;
          }
        })

        //3、套装勾选（套装下的单品展开）计算套装下的单品行的可拆数量
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (mapArr.get(item.signId) && !item.classFlag) {
            this.manualSplitObj.funSplitOrderDetailsBean.forEach((item2, i) => {
              if (item2.orderItemId == item.orderItemId && item2.classFlag) {
                item2.removableQty = item2.removableQty - item.splitQty * item2.minus;
              }
            })
          }
        })

        var orderDetails = {
          orderDetails: JSON.parse(JSON.stringify(this.manualSplitSelect))
        };
        //清空拆分数量 重置select禁用
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          item.splitQty = '';
          item.isDisabled = false;
          if (item.clicked) {
            item.isSelect = true;
          } else {
            item.isSelect = false;
          }
        })
        this.manualSplitObj.funSplitOrderDetailsBean.forEach(row => {
          this.$refs.multipleTable.clearSelection();
        });
        this.splitOrderBeansJson.push(orderDetails);
      },
      //回退
      rollBack(item, index) {
        //处理逻辑
        var mapArr = new Map();
        item.orderDetails.forEach((item, i) => {
          mapArr.set(item.signId, item);
        })
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          //1、预 赠 退 套装本行回退
          if (mapArr.get(item.signId) && !item.classFlag) {
            item.removableQty = item.removableQty * 1 + mapArr.get(item.signId).splitQty * 1;

            //（套装下如果有单品）
            this.manualSplitObj.funSplitOrderDetailsBean.forEach((item2, i) => {
              if (item2.orderItemId == item.orderItemId && item2.classFlag) {
                item2.removableQty = item2.removableQty + mapArr.get(item.signId).splitQty * item2.minus;
              }
            })
          }

          //2、套装下单品行回退
          if (mapArr.get(item.signId) && item.classFlag) {
            item.removableQty = item.removableQty * 1 + mapArr.get(item.signId).splitQty * 1;
          }
        })
        //套装下单品行回退计算套装行可拆数量
        //给套单赋值minusArr1，minusArr2;
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (mapArr.get(item.signId) && item.classFlag) {
            //是套单（算套装剩余可拆数量）
            var minusArr1 = [], minusArr2 = [];
            this.manualSplitObj.funSplitOrderDetailsBean.forEach((item2, i) => {
              if (item2.orderItemId == item.orderItemId && item2.classFlag) {
                minusArr1.push(item2.removableQty);
                minusArr2.push(0);
              }
            })
            item.minusArr1 = minusArr1;
            item.minusArr2 = minusArr2;
          }
        })
        //给套装可拆重新赋值
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (mapArr.get(item.signId) && item.classFlag) {
            this.manualSplitObj.funSplitOrderDetailsBean.forEach((item2, i) => {
              if (item2.orderItemId == item.orderItemId && !item2.classFlag) {
                item2.removableQty = switchGroup(item.minusArr1, item2.minusArr, item.minusArr2, 0)[0];
                item2.surplusQty = switchGroup(item.minusArr1, item2.minusArr, item.minusArr2, 0)[1];
              }
            })
          }
        })

        this.splitOrderBeansJson.splice(index, 1);
      },
      //确认拆分
      detachSave() {
        if (this.splitOrderBeansJson.length == 0) {
          this.$message({
            message: '至少拆出一单！',
            type: 'warning'
          });
          return false;
        }
        var splitOrderBeansJson = [], orderDetails = [];
        splitOrderBeansJson = JSON.parse(JSON.stringify(this.splitOrderBeansJson));
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (item.removableQty != 0) {
            //不是套单
            if (!item.classFlag) {
              item.splitQty = item.removableQty;
              orderDetails.push(item);
            } else {
              //套装下的单品
              this.manualSplitObj.funSplitOrderDetailsBean.forEach((item3, i) => {
                if (item3.orderItemId == item.orderItemId && !item3.classFlag) {
                  this.manualSplitObj.funSplitOrderDetailsBean.forEach((item2, i) => {
                    if (item2.orderItemId == item.orderItemId && item2.classFlag) {
                      if (item3.surplusQty) {
                        item2.splitQty = item3.surplusQty[item2.index];
                      } else {
                        item2.splitQty = 0;
                      }
                    }
                  })
                }
              })
            }
          }
        })
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          if (item.splitQty != 0 && item.classFlag) {
            orderDetails.push(item);
          }
        })
        if (orderDetails.length > 0) {
          splitOrderBeansJson.push({
            orderDetails: orderDetails
          })
        }
        splitOrderBeansJson.forEach((item, i) => {
          item.groupId = i + 1;
          item.orderDetails.forEach((item2, i) => {
            item2.num = item2.splitQty;
          })
        })
        this.manualSplitObj.funSplitOrderDetailsBean.forEach((item, i) => {
          item.splitQty = '';
        })
        this.loading = true;
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funSplitGroup", {
          orderId: this.orderIds,
          splitOrderBeansJson: JSON.stringify(splitOrderBeansJson)
        }).then((response) => {
          this.loading = false;
          if (response.data.success) {
            this.splitCodeArr = JSON.parse(response.data.msg).newOrderNoList;
            this.splitIdArr = JSON.parse(response.data.msg).newOrderIdList;
            this.splitSuccessDialog = true;
            this.manualSplitVisible = false;
            if (this.higeSearchFlag) {
              this.highSearch();
            } else {
              this.easySearch();
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //拆分成功订单编号跳转
      codeLink(barCode, i) {
        //this.$router.push({name: 'orderDetail', params: {orderId: this.splitIdArr[i], fromPage: 'OrderProcessing'}});
        this.splitSuccessDialog = false;
        this.paramsObj = {
          orderId: this.splitIdArr[i],
          fromPage: 'OrderProcessing',
          mainPageShow: false
        }
      },
      //刷新快速查询条件数
      refreshBtn() {
        //订单处理高级查询列头汇总查询
        this.getStatusConditions();
      },
      //跳转到订单标记设置
      turnCustomMark() {
        this.$router.push({path: '/orderMarks/1'});
      },
      //标记查询
      signFind() {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funOrderSignFindCustomSignMap").then((res) => {
          if (res.data.code == 0) {
            this.signList = res.data.result;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
      },
      //删除订单
      deleteOrder() {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funOrderDelete", {
          orderIds: this.orderIds,
          commitNum: 1,
          canCheckPass: true
        }).then((response) => {
          if (response.data.success) {
            this.successShowStatus = true;
            this.responseList = response.data.result.rows;
            this.allNum = response.data.result.orderTotalQty;
            this.successNum = response.data.result.successQty;
            this.faliNum = response.data.result.failQty;
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //加急
      urgent() {
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funOrderUrgent", {
          orderIds: this.orderIds,
          commitNum: 1,
          canCheckPass: true
        }).then((response) => {
          if (response.data.success) {
            this.successShowStatus = true;
            this.responseList = response.data.result.rows;
            this.allNum = response.data.result.orderTotalQty;
            this.successNum = response.data.result.successQty;
            this.faliNum = response.data.result.failQty;
            if (this.higeSearchFlag) {
              this.highSearch()
            } else {
              this.easySearch();
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //文件上传
      uploadFile() {
        if (!this.importShop) {
          this.$alert("请选择店铺!", "提示", {
            type: "warning",
            center: true,
            confirmButtonText: "确定"
          });
        } else if (!this.$refs.fileBtn.value) {
          this.$alert("请选择您要导入的excel文件!", "提示", {
            type: "warning",
            center: true,
            confirmButtonText: "确定"
          });
        } else {
          let data = new FormData();
          this.loading = true;
          data.append("filedata", this.fileTemp);
          this.$axios({
            method: "post",
            url: `http://${process.env.FILE_API}/files-web/upload`,
            data
          })
            .then(response => {
              if (response.data) {
                console.log(response.data);
                this.fileCheck(response.data);
              } else {
                this.$message({
                  message: "文件上传异常",
                  type: "warning"
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      },
      //文件检测
      fileCheck(value) {
        const data = {
          shopId: this.importShop,
          fileId: value.resourcesId,
          fileName: value.localFileName + "." + value.fileSuffix
        };
        this._post("com.edb01.erp.oms.service.api.OrderBaseFunService/" + this.version + "/funOrderImport", data).then((response) => {
          if (response.data.success) {
            this.successFileNum = response.data.result.successNum ? response.data.result.successNum : 0;
            this.failFileNum = response.data.result.failNum ? response.data.result.failNum : 0;
            this.failExcelFile = "http://" + process.env.FILE_API + "/files-web/download/" + response.data.result.fileId;
            this.orderImport = false;
            this.importStatus = true;
            this.$refs.fileBtn.value = "";
            this.exportName = '导入Excel';
            this.fileTemp = "";
            if (this.higeSearchFlag) {
              this.highSearch();
            } else {
              this.easySearch();
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //文件选择函数
      fileSelect(e) {
        //console.log(e.target.files[0]);
        this.fileTemp = "";

        if (e.target.files[0].type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && e.target.files[0].type != 'application/vnd.ms-excel') {
          this.fileTemp = "";
          this.exportName = '导入Excel';
          this.$alert("只支持excel文件上传(.xls、.xlsx、csv)!", "提示", {
            type: "warning",
            center: true,
            confirmButtonText: "确定"
          });
          return false;
        }
        this.fileTemp = e.target.files[0];
        this.exportName = e.target.files[0].name;
        /*if (e.target.files[0].name.indexOf(".xls") > 0) {
          this.fileTemp = e.target.files[0];
          this.exportName = e.target.files[0].name;
        } else if (e.target.files[0].name.indexOf(".xlsx") > 0) {
          this.fileTemp = e.target.files[0];
          this.exportName = e.target.files[0].name;
        } else if (e.target.files[0].name.indexOf(".csv") > 0) {
          this.fileTemp = e.target.files[0];
          this.exportName = e.target.files[0].name;
        } else {
          this.fileTemp = "";
          this.exportName = '导入Excel';
          this.$alert("只支持excel文件上传(.xls、.xlsx、csv)!", "提示", {
            type: "warning",
            center: true,
            confirmButtonText: "确定"
          });
        }*/
      },
      //文件上传点击
      fileUpload() {
        this.$refs.fileBtn.click();
      },
      //导入文件弹窗
      importFile() {
        this.exportName = '导入Excel';
        this.orderImport = true;
        this.importShop = '';
        this.fileTemp = "";
      },
      //更改每页显示数量
      handleSizeChange(value) {
        this.size = value;
        if (this.higeSearchFlag) {
          this.highSearchBtn();
        } else {
          this.easySearchBtn();
        }
      },
      //更改页数
      handleCurrentChange(value) {
        this.page = value;
        if (this.higeSearchFlag) {
          this.highSearchBtn();
        } else {
          this.easySearchBtn();
        }
      },
      //简易查询按钮
      searchHide() {
        this.higeSearchFlag = false;
        this.higeSearchSet = false;
        this.renderTableHeight();
      },
      //高级查询按钮
      searchShow() {
        this.higeSearchFlag = true;
        this.higeSearchSet = true;
        this.renderTableHeight();
      },
      //显示收起
      higeSearchSetBtn() {
        if (this.higeSearchSet) {
          this.higeSearchSet = false;
        } else {
          this.higeSearchSet = true;
        }
        this.renderTableHeight();
      },
      /*----------------------------------*/
      //添加商品弹框
      addCommodityDialog() {
        this.addCommodityParam.goodsName = '';
        this.addCommodityParam.barCode = '';//goodsName barCode
        this.queryGiftBtn2();
      },
      //添加商品保存
      saveAddCommodity() {
        if (this.selectionData2.length == 0) {
          this.$message({
            message: '请选择要添加的商品！',
            type: 'warning'
          });
          return false;
        } else {
          var barCodes = this.paramData.barCodes.split(','), mapArr = new Map();
          if (barCodes[0] == '') {
            barCodes.splice(0, 1);
          }
          barCodes.forEach(item => {
            mapArr.set(item, item);
          })
          this.selectionData2.forEach(item => {
            if (!mapArr.get(item.barCode)) {
              barCodes.push(item.barCode);
            }
          })
          this.paramData.barCodes = barCodes.join(',');
          this.dialogAddCommodity = false;
          //添加tag标签
          this.setTitle('商品', '商品', this.paramData.barCodes, this.paramData.barCodes);
        }
      },
      //添加商品
      barCodesBlur() {
        this.setTitle('商品', '商品', this.paramData.barCodes, this.paramData.barCodes);
        if (!this.paramData.barCodes) {
          this.clearGoods();
        }
      },
      //添加商品取消
      cancelAddCommodity() {
        this.dialogAddCommodity = false;
      },
      handleSelectionChange2(val) {
        this.selectionData2 = val;
      },
      handleSizeChange2(val) {
        this.addCommodityParam.size = val;
        this.queryGiftBtn2();
      },
      handleCurrentChange2(val) {
        this.addCommodityParam.page = val;
        this.queryGiftBtn2();
      },
      queryGiftBtn2() {
        this._post('com.edb01.erp.mdata.service.api.GoodsService/' + this.version + '/queryGoodsAndSuitByCondition', this.addCommodityParam).then((response) => {
          if (response.data.success) {
            this.dialogAddCommodity = true;
            this.addCommodityData = response.data.result.rows;
            this.totalNum2 = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //清除商品信息
      clearGoods() {
        this.paramData.barCodes = '';
        this.tagList.forEach((item, i) => {
          if (item.id == '商品') {
            this.tagList.splice(i, 1);
          }
        })
      },
      /*----------------------------------*/
      //表格鼠标划过铅笔
      mouseHover() {
        $('.ag-theme-balham').on('mouseenter', '.icon-edit', function (e) {
          $(this).show();
        }).on('mouseout', '.icon-edit', function () {
          $(this).hide();
        })
        $('.ag-theme-balham').on('mouseenter', '.mouse-edit', function (e) {
          $(this).prev().show();
        }).on('mouseout', '.mouse-edit', function () {
          $(this).prev().hide();
        })
      },
      //初始化表格选中
      InitializationTable() {
        this.shopIdList = [];
        this.storeBeansList = [];
        this.expressBeansList = [];
        this.orderIdList = [];
        this.orderToChgBeans = [];
      },
      createColumnDefs() {
        this.columnDefs = [//manualHangupFlag , valueGetter:'node.rowIndex+1'
          {
            headerName: '序号',
            pinned: 'left',
            width: 95,
            suppressToolPanel: true,
            suppressSorting: true,
            lockPosition: true,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            cellRendererFramework: 'RowFn',
          },
          {
            headerName: '异常标记',
            field: 'orderSign1',
            lockPosition: true,
            suppressToolPanel: true,
            width: 100,
            suppressSizeToFit: true,
            cellRenderer: "abnormalTag"
          },
          {
            headerName: '订单号',
            field: 'salesOrderNo',
            suppressToolPanel: true,
            lockPosition: true,
            width: 120,
            cellRenderer: "orderCodeRender"
          },
          {
            headerName: '商品信息',
            field: 'productTypenum1',
            suppressToolPanel: true,
            lockPosition: true,
            width: 100,
            cellRenderer: "productRender",
            headerComponentParams: {
              template:
              '<div class="ag-cell-label-container" role="presentation">' +
              '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
              '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
              '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
              '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
              '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
              '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
              '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span><i class="el-icon-question" style="line-height:33px;" title="商品种类/商品总数量"></i>' +
              '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
              '  </div>' +
              '</div>'
            }
          },//productSkunum
          {headerName: '订单状态', field: 'orderStatus', width: 90},
          {
            headerName: '买家留言', field: 'customerMsg', width: 100, cellRenderer: function (params) {
            return '<span title="' + params.data.customerMsg + '">' + params.data.customerMsg + '</span>'
          }
          },
          {
            headerName: '客服备注', field: 'serviceMsg', width: 100, cellRenderer: function (params) {
            return '<span title="' + params.data.serviceMsg + '">' + params.data.serviceMsg + '</span>'
          }
          },
          {
            headerName: "收货人",
            field: "consignee",
            cellRendererFramework: 'modifyComponent',
            width: 80
          },
          {
            headerName: "手机",
            field: "consigneeMobile1",
            cellRendererFramework: 'modifyComponent',
            width: 100
          },
          {
            headerName: "省",
            field: "consigneeProvince",
            cellRendererFramework: 'modifyComponent',
            width: 80
          },
          {
            headerName: "市",
            field: "consigneeCity",
            cellRendererFramework: 'modifyComponent',
            width: 80
          },
          {
            headerName: "区",
            field: "consigneeArea",
            cellRendererFramework: 'modifyComponent',
            width: 80
          },
          {
            headerName: "镇",
            field: "consigneeTown",
            cellRendererFramework: 'modifyComponent',
            width: 80
          },
          {
            headerName: "详细地址",
            field: "shippingAddress",
            cellRendererFramework: 'modifyComponent',
            width: 120
          },
          {
            headerName: "买家ID",
            field: "buyerNick",
            width: 80
          },
          {
            headerName: "店铺",
            field: "storeName",
            width: 100
          },//shopId
          {headerName: '内部便签', field: 'internalMemoMsg', width: 100, cellRenderer: "noteRender"},
          {headerName: '仓审须知', field: 'storageAuditMsg', width: 100, cellRenderer: "storeRender"},
          {headerName: '订单总金额', field: 'orderTotalAmt1', width: 100, cellRenderer: function (params) {
            return '<span>' + params.data.orderTotalAmt + '</span>'
          }},
          {headerName: '平台整单优惠', field: 'ecDctAmt1', width: 120, cellRenderer: function (params) {
            return '<span>' + params.data.ecDctAmt + '</span>'
          }},
          {headerName: '商家整单优惠', field: 'merchantDctAmt1', width: 120, cellRenderer: function (params) {
            return '<span>' + params.data.merchantDctAmt + '</span>'
          }},
          {headerName: '实付金额', field: 'actuallyPayAmt1', width: 100, cellRenderer: function (params) {
            return '<span>' + params.data.actuallyPayAmt + '</span>'
          }},
          {headerName: '运费', field: 'freightAmt1', width: 80, cellRenderer: function (params) {
            return '<span>' + params.data.freightAmt + '</span>'
          }},
          {headerName: '代收金额', field: 'expressServiceAmt1', width: 100, cellRenderer: function (params) {
            return '<span>' + params.data.expressServiceAmt + '</span>'
          }},
          {headerName: '仓库', field: 'storageName', width: 130, cellRenderer: "expressRender"},
          {headerName: '快递', field: 'expressName', width: 130, cellRenderer: "suttleRender"},
          {headerName: '净重', field: 'totalWeight', width: 100, cellRenderer: function (params) {
            return '<span>' + params.data.totalWeight + ' kg</span>'
          }},
          {headerName: '毛重', field: 'grossWeight', width: 100, cellRenderer: function (params) {
            return '<span>' + params.data.grossWeight + ' kg</span>'
          }},
          {headerName: '下单时间', field: 'orderTime', width: 150},
          {headerName: '付款时间', field: 'payTime', width: 150},
          {headerName: '平台单号', field: 'sourceOrderNo', width: 100},
          {headerName: '相关单号', field: 'fromOrderCode', width: 100},
          {headerName: '平台订单状态', field: 'ecOrderStatus', width: 120},
          {headerName: '拆合状态', field: 'splitJoinStatus', width: 100},

          {headerName: '快递单号', field: 'expressNo', width: 100},
          {headerName: '付款状态', field: 'payStatus', width: 100},
          {headerName: '退款状态', field: 'refundStatus', width: 100},
          {headerName: '退款类型', field: 'refundType', width: 100},
          {headerName: '发货状态', field: 'sendStatus', width: 100},
          {headerName: '平台发货状态', field: 'ecSendStatus', width: 115},
          {headerName: '订单类型', field: 'orderType', width: 100},
          {headerName: '三方仓推送状态', field: 'pushOtherFlag', width: 125},
          {headerName: '支付方式', field: 'paymentWay', width: 100},
          {headerName: '订单渠道', field: 'orderChannel', width: 100},
          {headerName: '首次付款金额', field: 'firstPayAmt1', width: 115, cellRenderer: function (params) {
            return '<span>' + params.data.firstPayAmt + '</span>'
          }},
          {headerName: '二次付款金额', field: 'lastPayAmt1', width: 115, cellRenderer: function (params) {
            return '<span>' + params.data.lastPayAmt + '</span>'
          }},
          {headerName: '买家货到付款服务费', field: 'receiptServiceAmt1', width: 150, cellRenderer: function (params) {
            return '<span>' + params.data.receiptServiceAmt + '</span>'
          }},
          {headerName: '商品总金额', field: 'goodsTotalAmt1', width: 100, cellRenderer: function (params) {
            return '<span>' + params.data.goodsTotalAmt + '</span>'
          }},
          {headerName: '产品总优惠', field: 'orderDctAmt1', width: 100, cellRenderer: function (params) {
            return '<span>' + params.data.orderDctAmt + '</span>'
          }},
          {headerName: '菜鸟服务类型', field: 'cainiaoServiceType', width: 115},
          {headerName: '审单员', field: 'orderReviewName', width: 100},
          {headerName: '审单时间', field: 'orderReviewTime', width: 150},
          {headerName: '发货时间', field: 'sendTime', width: 150},
          {headerName: '获取时间', field: 'createTime', width: 150},
          {headerName: '促销编号', field: 'strategyNos', width: 150},
        ];
        this.components = {
          orderCodeRender: this.getRenderer2('orderCode'),
          productRender: this.getRenderer2('productTypenum'),
          expressRender: this.getRenderer3(),
          suttleRender: this.getRenderer4(),
          noteRender: this.getNoteRender(),
          storeRender: this.storeRender(),
          abnormalTag: this.abnormalTag()
        };
      },
      //保存表格设置
      saveTableSet() {
        var setColumnState = JSON.stringify(this.gridOptions.columnApi.getColumnState());
        sessionStorage.setItem("columnStateOrder", setColumnState);
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
      },
      onGridReady(params) {
        if (sessionStorage.getItem("columnStateOrder")) {
          var getColumnState = JSON.parse(sessionStorage.getItem("columnStateOrder"));
          this.gridOptions.columnApi.setColumnState(getColumnState);
        }
        this.gridOptions.context = this;
        //this.gridApi = params.api;
        // this.columnApi = params.columnApi;
        //params.api.sizeColumnsToFit();
        this.orderIds = '';
        this.gridOptions.onSelectionChanged = (event) => {
          //this.orderLists = this.getSelectedRows();
          this.orderLists = this.gridOptions.api.getSelectedRows();
          var orderIds = '';
          this.orderLists.forEach((item, i) => {
            orderIds += item.salesOrderId + ',';
          })
          this.orderIds = orderIds.slice(0, -1);
        }
        this.gridOptions.onFilterChanged = (event) => {
          var tableData = [];
          this.gridOptions.api.forEachNodeAfterFilterAndSort((node,index)=>{
            tableData.push(node.data);
          })
          this.getSummaries(tableData);
        }
      },
      getSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData;
      },
      //订单号 商品信息
      getRenderer2(item) {
        var _this = this;

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function () {
          var template =
            '<span><span class="jump" style="color:#409eff;cursor:pointer;"></span></span>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui();
          this.params = params;
          var eValue = this.eGui.querySelector(".jump");
          if (item == 'productTypenum') {
            if(params.data.goodsTypeQty && params.data.goodsQty){
              eValue.innerHTML = params.data.goodsTypeQty + '/' + params.data.goodsQty;
            }else{
              eValue.innerHTML = params.data.goodsQty;
              $(eValue).css({'color':'#000','cursor':'unset'});
            }
          } else {
            if(params.data.salesOrderNo){
              eValue.innerHTML = params.data.salesOrderNo;
            }else{
              eValue.innerHTML = '';
            }
          }
          this.eButton = this.eGui.querySelector(".jump");
          this.buttonClickListener = this.onButtonClicked.bind(this,params);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function (params) {
          if(params.data.index == '合计')return;
          if (item == 'productTypenum') {
            //获取商品详情
            _this.salesOrderId = this.params.data.salesOrderId;
            _this.goodsDetailDialog = true;
          } else {
            /* _this.$router.push({
               name: 'orderDetail',
               params: {orderId: this.params.data.salesOrderId, fromPage: 'OrderProcessing'}
             });*/
            _this.paramsObj = {
              orderId: this.params.data.salesOrderId,
              fromPage: 'OrderProcessing',
              mainPageShow: false
            }
          }
        };
        CellRenderer.prototype.destroy = function () {
          this.eButton.removeEventListener("click", this.buttonClickListener);
        };
        return CellRenderer;
      },
      //仓库
      getRenderer3() {
        const _this = this;
        const warehouseListTemp = this.warehouseList;

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          if(_this.authorityCode.OMS_ORDERPROCESSING_WAREHOUSE){
            var template = '<div><select name="" class="storeName">';
          }else{
            var template = '<div><select name="" class="storeName" disabled>';
          }
          warehouseListTemp.forEach((item, i) => {
            template += '<option value="' + item.value + '">' + item.label + '</option>';
          })
          template += '</select></div>';
          if(params.data.index == '合计'){template = '<div></div>';}
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          if(params.data.index == '合计')return;
          this.params = params;
          this.eButton = this.eGui.querySelector(".storeName");
          //回显快递名称
          $(this.eButton).val(params.data.storageId);
          this.changeListener = this.onButtonChange.bind(this);
          this.eButton.addEventListener("change", this.changeListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonChange = function () {
          _this.orderIds = this.params.data.salesOrderId;
          _this.batchStoreId = $(this.eButton).val();
          _this.storageEleId = this.params.data.storageId;
          _this.updateSignStore($(this.eButton), this.params.data);
        };
        return CellRenderer;
      },
      //快递
      getRenderer4() {
        const _this = this;
        const expressListTemp = [];

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          if(_this.authorityCode.OMS_ORDERPROCESSING_EXPRESS){
            var template = '<div><select name="" class="expressName">';
          }else{
            var template = '<div><select name="" class="expressName" disabled>';
          }
          params.data.expressList = params.data.expressList?params.data.expressList:[];
          params.data.expressList.forEach((item, i) => {
            template += '<option value="' + item.expressId + '">' + item.expressName + '</option>';
          })
          template += '</select></div>';
          if(params.data.index == '合计'){template = '<div></div>';}
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          if(params.data.index == '合计')return;
          this.params = params;
          this.eButton = this.eGui.querySelector(".expressName");
          //回显快递名称
          $(this.eButton).val(params.data.expressId);
          this.changeListener = this.onButtonChange.bind(this);
          this.eButton.addEventListener("change", this.changeListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonChange = function () {
          _this.orderIds = this.params.data.salesOrderId;
          _this.batchExpressId = $(this.eButton).val();
          _this.expressEleId = this.params.data.expressId;
          _this.updateSignExpress($(this.eButton));
        };
        return CellRenderer;
      },
      //内部便签点击修改
      getNoteRender() {
        var _this = this;

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          var noteMsg = params.data.internalMemoMsg ? params.data.internalMemoMsg : '';
          var classParam = '';//已作废 已发货 已完成 已取消
          if (params.data.index == '合计' || !_this.authorityCode.OMS_ORDERPROCESSING_INTERNAL || params.data.orderStatus == '已作废' || params.data.orderStatus == '已发货' || params.data.orderStatus == '已完成' || params.data.orderStatus == '已取消') {
            classParam = 'note-edit';
          } else {
            classParam = 'el-icon-edit icon-edit note-edit';
          }
          var template =
            '<div><i class="' + classParam + '"></i><span class="mouse-edit" title="' + noteMsg + '">' + noteMsg + '</span></div>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          this.eButton = this.eGui.querySelector(".note-edit");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          _this.orderIds = this.params.data.salesOrderId;
          _this.noteMsg = this.params.data.internalMemoMsg;
          _this.noteVisible = true;
        };
        return CellRenderer;
      },
      //仓审须知点击修改
      storeRender() {
        var _this = this;

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          var storeMsg = params.data.storageAuditMsg ? params.data.storageAuditMsg : '';
          var classParam = ''; //已作废 已发货 已完成 已取消 待客审
          if (params.data.index == '合计' || !_this.authorityCode.OMS_ORDERPROCESSING_GUIDELINES || params.data.orderStatus == '已作废' || params.data.orderStatus == '已发货' || params.data.orderStatus == '已完成' || params.data.orderStatus == '已取消' || params.data.orderStatus == '待客审') {
            classParam = 'note-edit';
          } else {
            classParam = 'el-icon-edit icon-edit note-edit';
          }
          var template =
            '<div><i class="' + classParam + '"></i><span class="mouse-edit" title="' + storeMsg + '">' + storeMsg + '</span></div>';
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          this.eButton = this.eGui.querySelector(".note-edit");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          _this.orderIds = this.params.data.salesOrderId;
          _this.storeMsg = this.params.data.storageAuditMsg;
          _this.noticeVisible = true;
        };
        return CellRenderer;
      },
      //异常标记
      abnormalTag() {
        var _this = this;

        function CellRenderer() {
        }

        CellRenderer.prototype.createGui = function (params) {
          var template = '', isUrgent = '', orderSign = '';
          params.data.orderSign = params.data.orderSign?params.data.orderSign:[];
          for (var i = 0; i < params.data.orderSign.length; i++) {
            if (params.data.orderSign[i] == '需人工审核') {
              var checkFailResion = params.data.checkFailResion ? params.data.checkFailResion : '';
              orderSign = orderSign + '<span title="' + checkFailResion + '">' + params.data.orderSign[i] + '</span>,';
            } else {
              orderSign = orderSign + '<span>' + params.data.orderSign[i] + '</span>,';
            }
          }
          orderSign = orderSign.slice(0, -1);
          if (params.data.orderSign.length > 0) {
            isUrgent = params.data.urgentFlag ? '，加急' : '';
          } else {
            isUrgent = params.data.urgentFlag ? '加急' : '';
          }
          if (params.data.orderSign[0] == '未合并') {
            if (params.data.orderStatus != '已客审') {
              template =
                '<div><span title="' + params.data.handResion + '">' + params.data.hangupLogo + '</span><span class="unincorporated" style="cursor:pointer;color:#409eff;">' + orderSign + '</span><span>' + isUrgent + '</span></div>';
            } else {
              var urgent = isUrgent ? '加急' : '';
              template =
                '<div><span title="' + params.data.handResion + '">' + params.data.hangupLogo + '</span><span>' + urgent + '</span></div>';
            }
          } else {
            template =
              '<div><span title="' + params.data.handResion + '">' + params.data.hangupLogo + '</span><span>' + orderSign + '</span><span>' + isUrgent + '</span></div>';
          }
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = template;
          this.eGui = tempDiv.firstElementChild;
        };
        CellRenderer.prototype.init = function (params) {
          this.createGui(params);
          this.params = params;
          this.eButton = this.eGui.querySelector(".unincorporated");
          this.buttonClickListener = this.onButtonClicked.bind(this);
          if (this.eButton) this.eButton.addEventListener("click", this.buttonClickListener);
        };
        CellRenderer.prototype.getGui = function () {
          return this.eGui;
        };
        CellRenderer.prototype.onButtonClicked = function () {
          //console.log(this.params.data.orderSign);
          _this.unincorporatedBtn(this.params.data);
        };
        return CellRenderer;
      },
      //测试select关闭tag
      testSelect() {
      },
      //多选下拉组件（订单类型）
      multipleChange(value) {
        this.paramData.orderTypes = value;
        if(this.recordInit > 0){
          var label = [];
          value.forEach(item => {
            label.push(this.orderTypeList[item]);
          })
          this.changeTitleMultiple('订单类型',value,label.join(','),this.orderTypeArr,'orderTypes');
        }
        this.recordInit += 1;
      },
      changeTitleMultiple(title, value, label,list,model) {
        if(label == ''){
          this.tagList.forEach((item,i) =>{
            if(item.title == title){
              this.tagList.splice(i, 1);
            }
          })
          return;
        }
        //标签去重,防止选择相同选择器出现多个
        for (var i = 0; i < this.tagList.length; i++) {
          if (this.tagList[i].title == title) {
            this.tagList[i].title = title;
            this.tagList[i].label = label;
            this.tagList[i].value = value;
            this.tagList[i].list = list;
            this.tagList[i].model = model;
            return;
          }
        }
        //不重复的话直接新建标签
        this.tagList.push({list, title, label, value,model});
        this.$nextTick(() => {
          this.swiper();
        })
      },
      //根据点击生成标签,传入参数为标签名字、绑定的值、所在的列表（普通单选下拉）
      changeTitle(title, value, list, model) {
        if (title == '退款状态' && (value == '1' || value == '0')) {
          this.paramData.refundType = '';
          this.tagList.forEach((item, i) => {
            if (item.title == '退款类型') {
              this.tagList.splice(i, 1);
            }
          })
        }
        //标签去重,防止选择相同选择器出现多个
        for (var i = 0; i < this.tagList.length; i++) {
          if (this.tagList[i].title == title) {
            this.tagList[i].title = title;
            this.tagList[i].label = this[list][value];
            this.tagList[i].value = value;
            this.tagList[i].model = model;
            return;
          }
        }
        //不重复的话直接新建标签
        this.tagList.push({
          list: list,
          title: title,
          label: this[list][value],
          value: value,
          model: model
        });
        this.$nextTick(() => {
          this.swiper();
        })
      },
      //特殊查询条件
      setTitle(id, title, label, value, value_t) {
        for (var i = 0; i < this.tagList.length; i++) {
          if (this.tagList[i].id == id) {
            this.tagList[i].title = title;
            this.tagList[i].label = label;
            this.tagList[i].value = value;
            if (value_t) this.tagList[i].value_t = value_t;
            return;
          }
        }
        if (value_t) {
          this.tagList.push({id, title, label, value, value_t});
        } else {
          this.tagList.push({id, title, label, value});
        }
        this.$nextTick(() => {
          this.swiper();
        })
      },
      //关闭标签事件
      tagClose(tag) {
        this.tagList.splice(this.tagList.indexOf(tag), 1);
        if (tag.model) {
          if(tag.model == 'orderTypes'){
            this.paramData[tag.model] = [];
          }else{
            this.paramData[tag.model] = "";
          }
        } else {
          if (tag.id == '商品') {
            this.paramData.barCodes = '';
          } else if (tag.id == '店铺') {
            $('#participate-shop').multiselect('dataprovider', this.shopList);
          } else if (tag.id == '仓库') {
            $('#Warehouse').multiselect('dataprovider', this.warehouseList);
          } else if (tag.id == '快递') {
            $('#express-sel').multiselect('dataprovider', this.expressList);
          } else if (tag.id == '时间范围') {
            this.timeRange = [];
          } else if (tag.id == '收货人信息') {
            this.paramData.receiveType = '';
            this.paramData.receiveInfo = '';
          } else if (tag.id == '订单金额或重量') {
            this.paramData.OrderMoneyOrWeight = '';
            this.paramData.OrderMoneyOrWeightThan = '';
            this.paramData.OrderMoneyOrWeightLess = '';
          } else if (tag.id == '商品条数或数量') {
            this.paramData.itemType = '';
            this.paramData.itemTypeNumThan = '';
            this.paramData.itemTypeNumLess = '';
          }
        }
        this.$nextTick(() => {
          this.swiper();
          if (this.tagList.length == 8) {
            $('.swiper-button-prev').trigger('click');
          }
        })
      },
      //表格数据处理
      tableHandle(data, obj) {
        var mapArr = new Map();
        for (var item in obj) {
          mapArr.set(item, obj[item]);
        }
        data.forEach((item, i) => {
          if (mapArr.get(item.storageId)) {
            item.expressList = mapArr.get(item.storageId);
          } else {
            item.expressList = this.expressListTemp;
          }
          item.index = i + 1;

          item.orderTotalAmt1 = item.orderTotalAmt;
          item.actuallyPayAmt1 = item.actuallyPayAmt;
          item.merchantDctAmt1 = item.merchantDctAmt;
          item.ecDctAmt1 = item.ecDctAmt;
          item.freightAmt1 = item.freightAmt;
          item.expressServiceAmt1 = item.expressServiceAmt;
          item.orderTotalAmt = item.orderTotalAmt?'￥'+ zeroFill(item.orderTotalAmt):'￥0.00';
          item.actuallyPayAmt = item.actuallyPayAmt?'￥'+ zeroFill(item.actuallyPayAmt):'￥0.00';
          item.merchantDctAmt = item.merchantDctAmt?'￥' + zeroFill(item.merchantDctAmt):'￥0.00';
          item.ecDctAmt = item.ecDctAmt?'￥' + zeroFill(item.ecDctAmt):'￥0.00';
          item.freightAmt = item.freightAmt?'￥' + zeroFill(item.freightAmt):'￥0.00';
          item.expressServiceAmt = item.expressServiceAmt?'￥' + zeroFill(item.expressServiceAmt):'￥0.00';

          if (item.orderTime) item.orderTime = turnTimestamp(item.orderTime);
          if (item.payTime) item.payTime = turnTimestamp(item.payTime);
          item.orderSign = item.orderSign ? item.orderSign.split(',') : [];
          item.buyerNick = item.buyerNick ? item.buyerNick : '';
          item.storeName = item.storeName ? item.storeName : '';
          //eValue.innerHTML = params.data.consignee + ' ' + params.data.consigneeMobile + params.data.consigneeTown + ' ' + params.data.shippingAddress;
          item.consignee = item.consignee && item.consignee != 'undefined' ? item.consignee : '';
          item.consigneeMobile = item.consigneeMobile && item.consigneeMobile != 'undefined' ? item.consigneeMobile : '';
          item.consigneeMobile1 = item.consigneeMobile ? phoneEncrypt(item.consigneeMobile) : '';//表格展示****
          item.shippingAddress = item.shippingAddress && item.shippingAddress != 'undefined' ? item.shippingAddress : '';
          item.consigneeProvince = item.consigneeProvince && item.consigneeProvince != 'undefined' ? item.consigneeProvince : '';
          item.consigneeCity = item.consigneeCity && item.consigneeCity != 'undefined' ? item.consigneeCity : '';
          item.consigneeArea = item.consigneeArea && item.consigneeArea != 'undefined' ? item.consigneeArea : '';
          item.consigneeTown = item.consigneeTown && item.consigneeTown != 'undefined' ? item.consigneeTown : '';
          item.customerMsg = item.customerMsg ? item.customerMsg : '';
          item.serviceMsg = item.serviceMsg ? item.serviceMsg : '';
          item.serviceMsg = item.serviceMsg && item.serviceMsg.length > 500 ? item.serviceMsg.slice(0, 500) : item.serviceMsg;
          item.customerMsg = item.customerMsg && item.customerMsg.length > 500 ? item.customerMsg.slice(0, 500) : item.customerMsg;
          //item.sourceOrderNo = (item.orderType == 3 || item.orderType == 4) ? '' : item.sourceOrderNo;//平台单号
          //item.serviceMsg = item.originalFlag?item.serviceMsg:'';//客服备注  serviceMsg customerMsg
          if (item.manualHangupFlag) {
            item.hangupLogo = '【挂】';
          } else {
            item.hangupLogo = '';
          }
          item.orderSign1 = item.hangupLogo + item.orderSign.join(',');
          //处理表格复制
          item.productTypenum1 = item.goodsTypeQty + '/' + item.goodsQty;

          item.ecOrderStatus = item.ecOrderStatus ? this.ecOrderStatusObj[item.ecOrderStatus] : '';//平台订单状态
          item.splitJoinStatus = item.splitJoinStatus ? this.splitJoinStatusObj[item.splitJoinStatus] : '';//拆合状态

          item.payStatus = this.payStatusList[item.payStatus];//付款状态
          item.refundStatus = this.refundStatusList[item.refundStatus];//退款状态
          item.refundType = this.refundTypeList[item.refundType];//退款类型
          item.sendStatus = this.sendStatusList[item.sendStatus];//发货状态
          item.ecSendStatus = this.sendStatusList[item.ecSendStatus];//平台发货状态
          item.orderType = this.orderTypeList[item.orderType];//订单类型
          if(item.pushOtherFlag){
            item.pushOtherFlag = '已推送';
          }else{
            item.pushOtherFlag = item.pushOtherFlag === false?'未推送':'';
          }//三方仓推送状态
          item.orderChannel = this.orderChannelList[item.orderChannel];//订单渠道
          if(item.cainiaoServiceType){
            item.cainiaoServiceType = item.cainiaoServiceType == 1?'当日达':'次日达';
          }else{
            item.cainiaoServiceType = '';
          }//菜鸟服务类型
          if (item.orderReviewTime) item.orderReviewTime = turnTimestamp(item.orderReviewTime);//审单时间
          if (item.sendTime) item.sendTime = turnTimestamp(item.sendTime);//发货时间
          if (item.createTime) item.createTime = turnTimestamp(item.createTime);//获取时间

          item.firstPayAmt1 = item.firstPayAmt;
          item.lastPayAmt1 = item.lastPayAmt;
          item.receiptServiceAmt1 = item.receiptServiceAmt;
          item.goodsTotalAmt1 = item.goodsTotalAmt;
          item.orderDctAmt1 = item.orderDctAmt;
          item.totalWeight = item.totalWeight?zeroFill(item.totalWeight):'0.00';
          item.grossWeight = item.grossWeight?zeroFill(item.grossWeight):'0.00';
          item.firstPayAmt = item.firstPayAmt?'￥'+ zeroFill(item.firstPayAmt):'￥0.00';
          item.lastPayAmt = item.lastPayAmt?'￥'+ zeroFill(item.lastPayAmt):'￥0.00';
          item.receiptServiceAmt = item.receiptServiceAmt?'￥' + zeroFill(item.receiptServiceAmt):'￥0.00';
          item.goodsTotalAmt = item.goodsTotalAmt?'￥' + zeroFill(item.goodsTotalAmt):'￥0.00';
          item.orderDctAmt = item.orderDctAmt?'￥' + zeroFill(item.orderDctAmt):'￥0.00';

        })
        return data;
      },
      //计算表格金额合计
      getSummaries(data){
        var tableData = data?JSON.parse(JSON.stringify(data)):JSON.parse(JSON.stringify(this.orderList));
        var obj = {
          index:'合计',
          customerMsg:'',
          serviceMsg:'',
          handResion:'',
          hangupLogo:'',
          orderTotalAmt:0,
          ecDctAmt:0,
          merchantDctAmt:0,
          actuallyPayAmt:0,
          freightAmt:0,
          expressServiceAmt:0,
          firstPayAmt:0,
          lastPayAmt:0,
          receiptServiceAmt:0,
          goodsTotalAmt:0,
          orderDctAmt:0,
          totalWeight:0,
          grossWeight:0,
          goodsQty:0,
        }
        tableData.forEach(item => {
          item.orderTotalAmt1 = item.orderTotalAmt1?item.orderTotalAmt1*1:0;
          item.ecDctAmt1 = item.ecDctAmt1?item.ecDctAmt1*1:0;
          item.merchantDctAmt1 = item.merchantDctAmt1?item.merchantDctAmt1*1:0;
          item.actuallyPayAmt1 = item.actuallyPayAmt1?item.actuallyPayAmt1*1:0;
          item.freightAmt1 = item.freightAmt1?item.freightAmt1*1:0;
          item.expressServiceAmt1 = item.expressServiceAmt1?item.expressServiceAmt1*1:0;
          item.firstPayAmt1 = item.firstPayAmt1?item.firstPayAmt1*1:0;
          item.lastPayAmt1 = item.lastPayAmt1?item.lastPayAmt1*1:0;
          item.receiptServiceAmt1 = item.receiptServiceAmt1?item.receiptServiceAmt1*1:0;
          item.goodsTotalAmt1 = item.goodsTotalAmt1?item.goodsTotalAmt1*1:0;
          item.orderDctAmt1 = item.orderDctAmt1?item.orderDctAmt1*1:0;
          item.totalWeight = item.totalWeight?item.totalWeight*1:0;
          item.grossWeight = item.grossWeight?item.grossWeight*1:0;

          obj.orderTotalAmt += item.orderTotalAmt1;
          obj.ecDctAmt += item.ecDctAmt1;
          obj.merchantDctAmt += item.merchantDctAmt1;
          obj.actuallyPayAmt += item.actuallyPayAmt1;
          obj.freightAmt += item.freightAmt1;
          obj.expressServiceAmt += item.expressServiceAmt1;
          obj.firstPayAmt += item.firstPayAmt1;
          obj.lastPayAmt += item.lastPayAmt1;
          obj.receiptServiceAmt += item.receiptServiceAmt1;
          obj.goodsTotalAmt += item.goodsTotalAmt1;
          obj.orderDctAmt += item.orderDctAmt1;
          obj.totalWeight += item.totalWeight;
          obj.grossWeight += item.grossWeight;
          obj.goodsQty += item.goodsQty*1;
        })
        obj.totalWeight = zeroFill(obj.totalWeight);
        obj.grossWeight = zeroFill(obj.grossWeight);
        obj.orderTotalAmt = '￥' + zeroFill(obj.orderTotalAmt);
        obj.ecDctAmt = '￥' + zeroFill(obj.ecDctAmt);
        obj.merchantDctAmt = '￥' + zeroFill(obj.merchantDctAmt);
        obj.actuallyPayAmt = '￥' + zeroFill(obj.actuallyPayAmt);
        obj.freightAmt = '￥' + zeroFill(obj.freightAmt);
        obj.expressServiceAmt = '￥' + zeroFill(obj.expressServiceAmt);
        obj.firstPayAmt = '￥' + zeroFill(obj.firstPayAmt);
        obj.lastPayAmt = '￥' + zeroFill(obj.lastPayAmt);
        obj.receiptServiceAmt = '￥' + zeroFill(obj.receiptServiceAmt);
        obj.goodsTotalAmt = '￥' + zeroFill(obj.goodsTotalAmt);
        obj.orderDctAmt = '￥' + zeroFill(obj.orderDctAmt);
        this.pinnedBottomRowData = [obj];
      },
      //重置简易查询按钮
      resetEasyBtn(){
        this.simpleParam = {
          sourceOrderNoType: '1',//平台单号类型
          salesOrderNoType: '1',//订单单号类型
          sourceOrderNo: '',//平台单号
          salesOrderNo: '',//订单编号
          buyerNick: '',//买家ID
          consigneeMobile: '',//手机号
          expressNo: '',//快递单号
        }
      },
      //简易查询按钮
      easySearchBtn() {
        /*this.flag1 = false;
        this.flag2 = false;
        this.flagHeightOrEasy = false;

        this.agLoading = true;
        this.simpleParam.size = this.size;
        this.simpleParam.page = this.page;

        this._post("com.edb01.erp.oms.service.api.OrderBaseListService/" + this.version + "/getOrderSimpleList", this.simpleParam).then((response) => {
          if (response.data.success) {
            var storageId = [];
            response.data.result.rows = response.data.result.rows ? response.data.result.rows : [];
            response.data.result.rows.forEach((item, i) => {
              if (item.storageId) {
                storageId.push(item.storageId);
              }
            })
            this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version + "/getExpressListBeanGroupByStorageId", {
              storageId: storageId.join(',')
            }).then((res) => {
              this.agLoading = false;
              if (res.data.success) {
                //清空表格选中
                this.orderLists = [];
                this.orderIds = '';
                this.orderList = response.data.result.rows;
                this.orderList = this.tableHandle(this.orderList, res.data.result);
                //合计金额数
                this.getSummaries();
                this.total = response.data.result.total;
                this.page = response.data.result.page;
                this.size = response.data.result.size;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
          } else {
            this.agLoading = false;
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
          this.agLoading = false;
        })*/
        this.easySearch('表格刷新');
      },
      //高级查询按钮
      highSearchBtn() {
        /*this.flagHeightOrEasy = true;
        if (this.paramData.orderTab == 1) {
          this.flag1 = true;
          this.flag2 = false;
        } else if (this.paramData.orderTab == 2) {
          this.flag1 = false;
          this.flag2 = true;
        } else if (this.paramData.orderTab == 5) {
          this.flag1 = false;
          this.flag2 = false;
        }
        this.agLoading = true;

        var params = {};
        //有无客服备注 有无买家留言 isServMsg isNoServMsg isBuyerMsg isNoBuyerMsg
        if (this.isServMsg == this.isNoServMsg) {
          this.paramData.serverMsgFlag = '';
        } else {
          this.paramData.serverMsgFlag = this.isServMsg ? '1' : '0';
        }
        if (this.isBuyerMsg == this.isNoBuyerMsg) {
          this.paramData.customerMsgFlag = '';
        } else {
          this.paramData.customerMsgFlag = this.isBuyerMsg ? '1' : '0';
        }
        this.paramData.storeBeans = $('#participate-shop').val().length > 0 ? $('#participate-shop').val() : '';
        this.paramData.storageBeans = $('#Warehouse').val().length > 0 ? $('#Warehouse').val() : '';
        this.paramData.expressBeans = $('#express-sel').val().length > 0 ? $('#express-sel').val() : '';
        this.paramData.dateStart = this.timeRange.length == 2 ? turnTimestamp3(this.timeRange[0]) : '';
        this.paramData.dateEnd = this.timeRange.length == 2 ? turnTimestamp3(this.timeRange[1]) : '';
        this.paramData.size = this.size;
        this.paramData.page = this.page;

        var paramData = JSON.parse(JSON.stringify(this.paramData));
        paramData.flagId = this.paramData.flagId == '0' ? '' : this.paramData.flagId;
        //paramData.orderType = this.paramData.orderType == '0' ? '' : this.paramData.orderType;
        paramData.refundStatus = this.paramData.refundStatus == '0' ? '' : this.paramData.refundStatus;
        paramData.orderSignCode = this.paramData.orderSignCode == '0' ? '' : this.paramData.orderSignCode;
        paramData.orderChannel = this.paramData.orderChannel == '0' ? '' : this.paramData.orderChannel;
        paramData.payStatus = this.paramData.payStatus == '0' ? '' : this.paramData.payStatus;
        //高级查询tab切换
        if (paramData.orderTab == 1) {
          paramData.ledgerStockoutFlag = '';
          paramData.overWeightFlag = '';
          paramData.expressExceptionFlag = '';

          paramData.hangTimeout = '';
          paramData.hangSalesLack = '';
          paramData.hangStocklack = '';
          paramData.hangUnmerge = '';
          paramData.hangserviceMsgFail = '';
          paramData.hangHumanAudit = '';
          paramData.hangOverWeight = '';
          paramData.hangExpressException = '';
          paramData.hangCusSign = '';
          paramData.hangHumanHang = '';
          paramData.refundReCheckFlag = '';
        } else if (paramData.orderTab == 2) {
          paramData.serverMsgFlag = '';
          paramData.customerMsgFlag = '';
          paramData.codFlag = '';
          paramData.preSaleFlag = '';
          paramData.giftInFlag = '';
          paramData.suitInFlag = '';
          paramData.timeoutOrderFlag = '';

          paramData.hangTimeout = '';
          paramData.hangSalesLack = '';
          paramData.hangStocklack = '';
          paramData.hangUnmerge = '';
          paramData.hangserviceMsgFail = '';
          paramData.hangHumanAudit = '';
          paramData.hangOverWeight = '';
          paramData.hangExpressException = '';
          paramData.hangCusSign = '';
          paramData.hangHumanHang = '';
          paramData.refundReCheckFlag = '';
        } else if (paramData.orderTab == 5) {
          paramData.serverMsgFlag = '';
          paramData.customerMsgFlag = '';
          paramData.codFlag = '';
          paramData.preSaleFlag = '';
          paramData.giftInFlag = '';
          paramData.suitInFlag = '';
          paramData.timeoutOrderFlag = '';

          paramData.ledgerStockoutFlag = '';
          paramData.overWeightFlag = '';
          paramData.expressExceptionFlag = '';
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseListService/" + this.version + "/getOrderList", paramData).then((response) => {
          if (response.data.success) {
            var storageId = [];
            response.data.result.rows = response.data.result.rows ? response.data.result.rows : [];
            response.data.result.rows.forEach((item, i) => {
              if (item.storageId) {
                storageId.push(item.storageId);
              }
            })
            this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version + "/getExpressListBeanGroupByStorageId", {
              storageId: storageId.join(',')
            }).then((res) => {
              this.agLoading = false;
              if (res.data.success) {
                //清空表格选中
                this.orderLists = [];
                this.orderIds = '';
                this.orderList = response.data.result.rows;
                this.orderList = this.tableHandle(this.orderList, res.data.result);
                //合计金额数
                this.getSummaries();
                this.total = response.data.result.total;
                this.page = response.data.result.page;
                this.size = response.data.result.size;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
          } else {
            this.agLoading = false;
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
          this.agLoading = false;
        })*/
        this.highSearch('表格刷新');
      },
      //简易查询函数
      easySearch(param1, param2) {
        this.flag1 = false;
        this.flag2 = false;
        this.flagHeightOrEasy = false;

        if(param1 == '表格刷新'){
          this.agLoading = true;
        }else{
          this.loading = true;
        }
        this.simpleParam.size = this.size;
        this.simpleParam.page = this.page;

        //订单处理高级查询列头汇总查询
        this.getStatusConditions();

        this._post("com.edb01.erp.oms.service.api.OrderBaseListService/" + this.version + "/getOrderSimpleList", this.simpleParam).then((response) => {
          if (response.data.success) {
            var storageId = [];
            response.data.result.rows = response.data.result.rows ? response.data.result.rows : [];
            response.data.result.rows.forEach((item, i) => {
              if (item.storageId && storageId.indexOf(item.storageId) < 0) {
                storageId.push(item.storageId);
              }
            })
            this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version + "/getExpressListBeanGroupByStorageId", {
              storageId: storageId.join(',')
            }).then((res) => {
              if(param1 == '表格刷新'){
                this.agLoading = false;
              }else{
                this.loading = false;
              }
              if (res.data.success) {

                //清空表格选中
                this.orderLists = [];
                if(param1 != 'continueModify')this.orderIds = '';
                this.orderList = response.data.result.rows;
                this.orderList = this.tableHandle(this.orderList, res.data.result);
                //合计金额数
                this.getSummaries();
                this.total = response.data.result.total;
                this.page = response.data.result.page;
                this.size = response.data.result.size;
                //拆分完成
                if (param1 == 'split') {
                  setTimeout(() => {
                    this.gridOptions.api.forEachNode(function (node) {
                      param2.forEach((item, i) => {
                        if (item == node.data.salesOrderId) {
                          node.setSelected(true);
                        }
                      })
                    })
                  }, 600)
                }
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
          } else {
            if(param1 == '表格刷新'){
              this.agLoading = false;
            }else{
              this.loading = false;
            }
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //高级查询函数
      highSearch(param1, param2) {
        this.flagHeightOrEasy = true;
        if (this.paramData.orderTab == 1) {
          this.flag1 = true;
          this.flag2 = false;
        } else if (this.paramData.orderTab == 2) {
          this.flag1 = false;
          this.flag2 = true;
        } else if (this.paramData.orderTab == 5) {
          this.flag1 = false;
          this.flag2 = false;
        }
        if(param1 == '表格刷新'){
          this.agLoading = true;
        }else{
          this.loading = true;
        }
        var params = {};
        //有无客服备注 有无买家留言 isServMsg isNoServMsg isBuyerMsg isNoBuyerMsg
        if (this.isServMsg == this.isNoServMsg) {
          this.paramData.serverMsgFlag = '';
        } else {
          this.paramData.serverMsgFlag = this.isServMsg ? '1' : '0';
        }
        if (this.isBuyerMsg == this.isNoBuyerMsg) {
          this.paramData.customerMsgFlag = '';
        } else {
          this.paramData.customerMsgFlag = this.isBuyerMsg ? '1' : '0';
        }
        this.paramData.storeBeans = $('#participate-shop').val().length > 0 ? $('#participate-shop').val() : '';
        this.paramData.storageBeans = $('#Warehouse').val().length > 0 ? $('#Warehouse').val() : '';
        this.paramData.expressBeans = $('#express-sel').val().length > 0 ? $('#express-sel').val() : '';
        this.paramData.dateStart = this.timeRange.length == 2 ? turnTimestamp3(this.timeRange[0]) : '';
        this.paramData.dateEnd = this.timeRange.length == 2 ? turnTimestamp3(this.timeRange[1]) : '';
        this.paramData.size = this.size;
        this.paramData.page = this.page;

        //订单处理高级查询列头汇总查询 flagId orderType refundStatus orderSignCode
        this.getStatusConditions();
        var paramData = JSON.parse(JSON.stringify(this.paramData));
        paramData.flagId = this.paramData.flagId == '0' ? '' : this.paramData.flagId;
        //paramData.orderType = this.paramData.orderType == '0' ? '' : this.paramData.orderType;
        paramData.refundStatus = this.paramData.refundStatus == '0' ? '' : this.paramData.refundStatus;
        paramData.orderSignCode = this.paramData.orderSignCode == '0' ? '' : this.paramData.orderSignCode;
        paramData.orderChannel = this.paramData.orderChannel == '0' ? '' : this.paramData.orderChannel;
        paramData.payStatus = this.paramData.payStatus == '0' ? '' : this.paramData.payStatus;

        //高级查询tab切换
        if (paramData.orderTab == 1) {
          paramData.ledgerStockoutFlag = '';
          paramData.overWeightFlag = '';
          paramData.expressExceptionFlag = '';

          paramData.hangTimeout = '';
          paramData.hangSalesLack = '';
          paramData.hangStocklack = '';
          paramData.hangUnmerge = '';
          paramData.hangserviceMsgFail = '';
          paramData.hangHumanAudit = '';
          paramData.hangOverWeight = '';
          paramData.hangExpressException = '';
          paramData.hangCusSign = '';
          paramData.hangHumanHang = '';
          paramData.refundReCheckFlag = '';
        } else if (paramData.orderTab == 2) {
          paramData.serverMsgFlag = '';
          paramData.customerMsgFlag = '';
          paramData.codFlag = '';
          paramData.preSaleFlag = '';
          paramData.giftInFlag = '';
          paramData.suitInFlag = '';
          paramData.timeoutOrderFlag = '';

          paramData.hangTimeout = '';
          paramData.hangSalesLack = '';
          paramData.hangStocklack = '';
          paramData.hangUnmerge = '';
          paramData.hangserviceMsgFail = '';
          paramData.hangHumanAudit = '';
          paramData.hangOverWeight = '';
          paramData.hangExpressException = '';
          paramData.hangCusSign = '';
          paramData.hangHumanHang = '';
          paramData.refundReCheckFlag = '';
        } else if (paramData.orderTab == 5) {
          paramData.serverMsgFlag = '';
          paramData.customerMsgFlag = '';
          paramData.codFlag = '';
          paramData.preSaleFlag = '';
          paramData.giftInFlag = '';
          paramData.suitInFlag = '';
          paramData.timeoutOrderFlag = '';

          paramData.ledgerStockoutFlag = '';
          paramData.overWeightFlag = '';
          paramData.expressExceptionFlag = '';
        }
        this._post("com.edb01.erp.oms.service.api.OrderBaseListService/" + this.version + "/getOrderList", paramData).then((response) => {
          if (response.data.success) {
            var storageId = [];
            response.data.result.rows = response.data.result.rows ? response.data.result.rows : [];
            response.data.result.rows.forEach((item, i) => {
              if (item.storageId && storageId.indexOf(item.storageId) < 0) {
                storageId.push(item.storageId);
              }
            })
            this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version + "/getExpressListBeanGroupByStorageId", {
              storageId: storageId.join(',')
            }).then((res) => {
              if(param1 == '表格刷新'){
                this.agLoading = false;
              }else{
                this.loading = false;
              }
              if (res.data.success) {
                //清空表格选中
                this.orderLists = [];
                if(param1 != 'continueModify')this.orderIds = '';
                this.orderList = response.data.result.rows;
                this.orderList = this.tableHandle(this.orderList, res.data.result);
                //合计金额数
                this.getSummaries();
                this.total = response.data.result.total;
                this.page = response.data.result.page;
                this.size = response.data.result.size;
                //拆分完成
                if (param1 == 'split') {
                  setTimeout(() => {
                    this.gridOptions.api.forEachNode(function (node) {
                      param2.forEach((item, i) => {
                        if (item == node.data.salesOrderId) {
                          node.setSelected(true);
                        }
                      })
                    })
                  }, 600)
                }
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
          } else {
            if(param1 == '表格刷新'){
              this.agLoading = false;
            }else{
              this.loading = false;
            }
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //渲染表格高度
      renderTableHeight() {
        this.$nextTick(function () {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 65;
        });
        window.onresize = () => {
          this.agHeight = $(window).height() - $(".ag-table").offset().top - 65;
        }
      },
      //获取店铺仓库快递list
      getQueryInit() {
        var _this = this;
        //参与店铺下拉框
        $('#participate-shop').multiselect({
          nonSelectedText: '',
          onInitialized: function (select, container) {
            $("._scroll").yi_scroll();
          },
          //下拉框关闭回调函数
          onDropdownHide: function (event) {
            _this.selectCallBack('店铺');
          },
        });
        //仓库下拉框
        $('#Warehouse').multiselect({
          onInitialized: function (select, container) {
            $("._scroll").yi_scroll();
          },
          //下拉框关闭回调函数
          onDropdownHide: function (event) {
            _this.selectCallBack('仓库');
          },
        });
        //快递下拉框
        $('#express-sel').multiselect({
          onInitialized: function (select, container) {
            $("._scroll").yi_scroll();
          },
          //下拉框关闭回调函数
          onDropdownHide: function (event) {
            _this.selectCallBack('快递');
          },
        });
        this._post("com.edb01.erp.oms.service.api.OrderOnlySearchService/" + this.version + "/getPageElement").then((response) => {
          if (response.data.code == 0) {
            this.elem_store = response.data.result.elem_store;
            this.elem_storage = response.data.result.elem_storage;
            this.elem_express = response.data.result.elem_express;
            //参与店铺
            for (var item in response.data.result.elem_store) {
              this.shopList.push({
                value: item,
                label: response.data.result.elem_store[item]
              });
              this.shopSelect.push(item);
            }
            $('#participate-shop').multiselect('dataprovider', this.shopList);
            //$('#participate-shop').multiselect('select',this.shopSelect);

            //仓库
            for (var item in response.data.result.elem_storage) {
              this.warehouseList.push({
                value: item,
                label: response.data.result.elem_storage[item]
              });
              this.warehouseSelect.push(item);
            }
            $('#Warehouse').multiselect('dataprovider', this.warehouseList);
            //$('#Warehouse').multiselect('select',this.warehouseSelect);

            //快递
            //this.expressList = response.data.result.elem_express;
            for (var item in response.data.result.elem_express) {
              this.expressList.push({
                value: item,
                label: response.data.result.elem_express[item]
              });
              this.expressSelect.push(item);
            }
            this.expressListStr = JSON.stringify(this.expressList);
            $('#express-sel').multiselect('dataprovider', this.expressList);
            //$('#express-sel').multiselect('select',this.expressSelect);
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
        //省份下拉
        this._post('com.edb01.erp.mdata.service.api.DtRegionService/' + this.version + '/list', {regionId: 1}).then((response) => {
          if (response.data.success) {
            this.consigneeTypeList = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //多选选中回调
      selectCallBack(title) {
        var label = '';
        if (title == '店铺') {
          if ($('#participate-shop').val().length > 0) {
            $('#participate-shop').val().forEach((item, i) => {
              label += this.elem_store[item] + ',';
            })
            this.setTitle(title, title, label.slice(0, -1), $('#participate-shop').val());
          } else {
            this.tagList.forEach((item, i) => {
              if (item.id == '店铺') {
                this.tagList.splice(i, 1);
              }
            })
          }
        } else if (title == '仓库') {
          if ($('#Warehouse').val().length > 0) {
            $('#Warehouse').val().forEach((item, i) => {
              label += this.elem_storage[item] + ',';
            })
            this.setTitle(title, title, label.slice(0, -1), $('#Warehouse').val());
            //级联快递
            this._post("com.edb01.erp.wms.service.api.WmStorageExpressService/" + this.version + "/getExpressListBean", {
              storageId: $('#Warehouse').val().join(',')
            }).then((response) => {
              if (response.data.success) {
                //this.expressList = response.data.result;
                this.expressList = [];
                response.data.result = response.data.result ? response.data.result : [];
                response.data.result.forEach((item, i) => {
                  this.expressList.push({
                    value: item.expressId,
                    label: item.expressName
                  });
                  this.expressSelect.push(item);
                })
                $('#express-sel').multiselect('dataprovider', this.expressList);
                this.tagList.forEach((item, i) => {
                  if (item.id == '快递') {
                    this.tagList.splice(i, 1);
                  }
                })
              } else {
                this.$message({
                  message: response.data.msg,
                  type: "warning"
                });
              }
            })
          } else {
            this.expressList = JSON.parse(this.expressListStr);
            $('#express-sel').multiselect('dataprovider', this.expressList);
            this.tagList.forEach((item, i) => {
              if (item.id == '仓库') {
                this.tagList.splice(i, 1);
              }
            })
          }
        } else if (title == '快递') {
          if ($('#express-sel').val().length > 0) {
            $('#express-sel').val().forEach((item, i) => {
              label += this.elem_express[item] + ',';
            })
            this.setTitle(title, title, label.slice(0, -1), $('#express-sel').val());
          } else {
            this.tagList.forEach((item, i) => {
              if (item.id == '快递') {
                this.tagList.splice(i, 1);
              }
            })
          }
        }
      },
      //获取异常标记集合
      getMarksList() {
        this._post("com.edb01.erp.oms.service.api.OrderSignService/" + this.version + "/getOrderSignByList").then((response) => {
          if (response.data.success) {
            //orderSignList
            response.data.result.forEach((item, i) => {
              if (item.enabledFlag) {
                this.orderSignList[item.signCode] = item.signName;
              }
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //时间区间change
      channelTimeChange() {
        if (this.timeRange && this.timeRange.length > 0) {
          this.setTitle('时间范围', this.timeRangeList[this.paramData.dateType], this.timeRange.join('至'), this.timeRange, this.paramData.dateType);
        } else {
          this.timeRange = [];
          this.tagList.forEach((item, i) => {
            if (item.id == '时间范围') {
              this.tagList.splice(i, 1);
            }
          })
        }
      },
      //订单金额或重量change
      channelChangeOrder(index) {
        // OrderMoneyOrWeightThan OrderMoneyOrWeightLess
        this.paramData.OrderMoneyOrWeightThan = priceValidator(this.paramData.OrderMoneyOrWeightThan);
        this.paramData.OrderMoneyOrWeightLess = priceValidator(this.paramData.OrderMoneyOrWeightLess);
        var title = this.paramData.OrderMoneyOrWeight == '1' ? '订单金额' : '订单重量';
        if (this.paramData.OrderMoneyOrWeightThan == '' && this.paramData.OrderMoneyOrWeightLess == '') {
          this.tagList.forEach((item, i) => {
            if (item.id == '订单金额或重量') {
              this.tagList.splice(i, 1);
            }
          })
          return false;
        } else if (this.paramData.OrderMoneyOrWeightLess == '') {
          this.setTitle('订单金额或重量', title, '> ' + this.paramData.OrderMoneyOrWeightThan, this.paramData.OrderMoneyOrWeight);
        } else if (this.paramData.OrderMoneyOrWeightThan == '') {
          this.setTitle('订单金额或重量', title, '< ' + this.paramData.OrderMoneyOrWeightLess, this.paramData.OrderMoneyOrWeight);
        } else {
          if (index == 1 && this.paramData.OrderMoneyOrWeightThan * 1 > this.paramData.OrderMoneyOrWeightLess * 1) {
            this.paramData.OrderMoneyOrWeightThan = '';
            this.$message({
              message: '下限值不能高于上限值！',
              type: 'warning'
            });
            this.setTitle('订单金额或重量', title, '< ' + this.paramData.OrderMoneyOrWeightLess, this.paramData.OrderMoneyOrWeight);
            return false;
          }
          if (index == 2 && this.paramData.OrderMoneyOrWeightThan * 1 > this.paramData.OrderMoneyOrWeightLess * 1) {
            this.paramData.OrderMoneyOrWeightLess = '';
            this.$message({
              message: '上限值不能低于下限值！',
              type: 'warning'
            });
            this.setTitle('订单金额或重量', title, '> ' + this.paramData.OrderMoneyOrWeightThan, this.paramData.OrderMoneyOrWeight);
            return false;
          }
          this.setTitle('订单金额或重量', title, this.paramData.OrderMoneyOrWeightThan + '-' + this.paramData.OrderMoneyOrWeightLess, this.paramData.OrderMoneyOrWeight);
        }
      },
      //商品条数或数量change
      channelChangeGoods(index) {
        var title = this.paramData.itemType == '1' ? '商品条数' : '商品数量';
        if (this.paramData.itemTypeNumThan == '' && this.paramData.itemTypeNumLess == '') {
          this.tagList.forEach((item, i) => {
            if (item.id == '商品条数或数量') {
              this.tagList.splice(i, 1);
            }
          })
          return false;
        } else if (this.paramData.itemTypeNumLess == '') {
          this.setTitle('商品条数或数量', title, '> ' + this.paramData.itemTypeNumThan, this.paramData.itemType);
        } else if (this.paramData.itemTypeNumThan == '') {
          this.setTitle('商品条数或数量', title, '< ' + this.paramData.itemTypeNumLess, this.paramData.itemType);
        } else {
          if (index == 1 && this.paramData.itemTypeNumThan * 1 > this.paramData.itemTypeNumLess * 1) {
            this.paramData.itemTypeNumThan = '';
            this.$message({
              message: '下限值不能高于上限值！',
              type: 'warning'
            });
            this.setTitle('商品条数或数量', title, '< ' + this.paramData.itemTypeNumLess, this.paramData.itemType);
            return false;
          }
          if (index == 2 && this.paramData.itemTypeNumThan * 1 > this.paramData.itemTypeNumLess * 1) {
            this.paramData.itemTypeNumLess = '';
            this.$message({
              message: '上限值不能低于下限值！',
              type: 'warning'
            });
            this.setTitle('商品条数或数量', title, '> ' + this.paramData.itemTypeNumThan, this.paramData.itemType);
            return false;
          }
          this.setTitle('商品条数或数量', title, this.paramData.itemTypeNumThan + '-' + this.paramData.itemTypeNumLess, this.paramData.itemType);
        }
      },
      //收货信息changhe
      channelConsignee() {
        this.paramData.receiveInfo = '';
        this.setTitle('收货人信息', this.receiveTypeList[this.paramData.receiveType], this.paramData.receiveInfo, this.paramData.receiveType);
      },
      //收货信息input失焦
      channelCollectGoods() {
        this.setTitle('收货人信息', this.receiveTypeList[this.paramData.receiveType], this.paramData.receiveInfo, this.paramData.receiveType);
      },
      //swiper
      swiper() {
        var swiper = new Swiper('.swiper-container', {
          slidesPerView: 8,
          spaceBetween: 10,
          slidesPerGroup: 8,
          //loop: true,
          //loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
        $('.el-icon-caret-right').click(function () {
          $('.swiper-button-next').trigger('click');
        })
        $('.el-icon-caret-left').click(function () {
          $('.swiper-button-prev').trigger('click');
        })
      },
      //查询方案弹出框
      conditionVisibleBtn() {
        if (this.saveConditionId == '') {
          this.conditionVisible = true;
          this.searchCondition = '';
        } else {
          this.saveSet = true;
          this.saveSwitch = '3';
          this.searchCondition = '';
        }
      },
      //查询方案保存
      channelProgrameSave() {
        //conditionVisible
        if (this.searchCondition.trim() == '') {
          this.$message({
            message: '请输入查询方案名称',
            type: 'warning'
          });
          return false;
        }
        if (this.tagList.length == 0) {
          this.$message({
            message: '至少输入一项查询条件',
            type: 'warning'
          });
          return false;
        }
        this.programeSaveFn(this.searchCondition);
      },
      //保存方案函数
      programeSaveFn(queryPlanName) {
        this._post('com.edb01.erp.oms.service.api.OrderBaseListService/' + this.version + '/searchplanAdd', {
          queryPlanName,
          queryCondition: JSON.stringify(this.tagList)
        }).then((response) => {
          if (response.data.success) {
            if (this.conditionVisible) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
              this.conditionVisible = false;
            }
            if (this.saveSet) {
              this.$message({
                message: '更新成功！',
                type: 'success'
              });
              this.saveSet = false;
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //更新查询方案
      channelProgrameUpdate() {
        //this.saveSet=false;
        if (this.tagList.length == 0) {
          this.$message({
            message: '至少输入一项查询条件',
            type: 'warning'
          });
          return false;
        }
        if (this.saveSwitch == '3') {
          //保存为当前方案
          //先删除当前方案
          this._post("com.edb01.erp.oms.service.api.OrderBaseListService/" + this.version + "/searchplanDelete", {
            queryPlanId: this.saveConditionId
          }).then((response) => {
            if (response.data.success) {
              var queryPlanName = '';
              this.conditionList.forEach((item, i) => {
                if (item.queryPlanId == this.saveConditionId) {
                  queryPlanName = item.queryPlanName;
                }
              })
              this.programeSaveFn(queryPlanName);
            } else {
              this.$message({
                message: response.data.msg,
                type: "warning"
              });
            }
          })
        } else {
          //保存为新方案
          if (this.searchCondition.trim() == '') {
            this.$message({
              message: '请输入查询方案名称',
              type: 'warning'
            });
            return false;
          }
          this._post('com.edb01.erp.oms.service.api.OrderBaseListService/' + this.version + '/searchplanAdd', {
            queryPlanName: this.searchCondition,
            queryCondition: JSON.stringify(this.tagList)
          }).then((response) => {
            if (response.data.success) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              });
              this.saveSet = false;
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      //删除查询方案
      deleteProject(item) {
        this.$confirm("确定删除该查询方案？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this._post("com.edb01.erp.oms.service.api.OrderBaseListService/" + this.version + "/searchplanDelete", {
            queryPlanId: item.queryPlanId
          }).then((response) => {
            if (response.data.success) {
              this.$message({
                message: '删除成功',
                type: "success"
              });
              this.querysChemesList();
            } else {
              this.$message({
                message: response.data.msg,
                type: "warning"
              });
            }
          })
        });
      },
      //查询方案列表
      querysChemesList() {
        this.commonConditionVisible = true;
        this.saveCondition = '';//this.saveConditionId
        this._post("com.edb01.erp.oms.service.api.OrderBaseListService/" + this.version + "/getSearchplanList").then((response) => {
          if (response.data.success) {
            this.conditionList = response.data.result;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //重置查询条件
      resetQueryBtn() {
        this.recordInit = 0;
        var orderTab = this.paramData.orderTab;
        var codFlag = this.paramData.codFlag;
        var preSaleFlag = this.paramData.preSaleFlag;
        var giftInFlag = this.paramData.giftInFlag;
        var suitInFlag = this.paramData.suitInFlag;
        var timeoutOrderFlag = this.paramData.timeoutOrderFlag;
        var ledgerStockoutFlag = this.paramData.ledgerStockoutFlag;
        var overWeightFlag = this.paramData.overWeightFlag;
        var expressExceptionFlag = this.paramData.expressExceptionFlag;
        this.paramData = {
          orderTab,
          codFlag,//货到付款订单
          preSaleFlag,//销售订单
          giftInFlag,//包含赠品
          suitInFlag,//包含套装
          timeoutOrderFlag,//超时订单
          ledgerStockoutFlag,//缺货订单
          overWeightFlag,//超重订单
          expressExceptionFlag,//快速异常订单
          orderTypes: ['1','3','4','5'],//订单类型
          OrderMoneyOrWeight: '1',//订单金额或订单重量判断
          OrderMoneyOrWeightThan: '',//商品条数或数量下限值
          OrderMoneyOrWeightLess: '',//商品条数或数量上限值
          itemType: '2',//商品条数或数量判断
          itemTypeNumThan: '',//商品条数或数量下限值
          itemTypeNumLess: '',//商品条数或数量上限值
          flagId: '0',//旗帜
          orderSignCode: '0',//异常标记ID
          refundStatus: '1', //退款状态
          refundType: '', //退款类型
          receiveType: '1',//收货人条件判断
          receiveInfo: '',//收货人信息输入框值
          dateType: '1', //时间类型条件判断
          dateStart: '',//开始时间
          dateEnd: '',//结束时间
          goodsId: '',//商品ID
          barCodes: '',
          conditionType1:'1',
          childType1:'1',
          conditionInfo1:'',
          conditionType2:'1',
          childType2:'1',
          conditionInfo2:'',
          conditionRelation:'1',
          orderChannel:'0',//订单渠道
          payStatus:'3',//付款状态
        }
        this.conditionText = '';
        this.timeRange = [];
        $('#participate-shop').multiselect('dataprovider', this.shopList);
        $('#Warehouse').multiselect('dataprovider', this.warehouseList);
        $('#express-sel').multiselect('dataprovider', this.expressList);
        this.tagList = [];
      },
      //查询方案选择
      channelCommonCondition() {
        if (this.saveCondition == 0) {
          this.$message({
            message: '请选择查询方案',
            type: 'warning'
          });
          return false;
        }
        this.saveConditionId = this.saveCondition;
        var saveCondition = '';
        this.conditionList.forEach((item, i) => {
          if (item.queryPlanId == this.saveConditionId) {
            saveCondition = item.queryCondition;
          }
        })
        this.resetQueryBtn();
        this.tagList = JSON.parse(saveCondition);
        this.$nextTick(() => {
          this.swiper();
        })
        this.tagList.forEach((item, i) => {
          if (item.model) {
            this.paramData[item.model] = item.value;
          } else {
            switch (item.id) {
              case '店铺':
                $('#participate-shop').multiselect('select', item.value);
                break;
              case '仓库':
                $('#Warehouse').multiselect('select', item.value);
                break;
              case '快递':
                $('#express-sel').multiselect('select', item.value);
                break;
              case '商品':
                this.conditionText = item.label;
                this.paramData.goodsId = item.value;
                break;
              case '时间范围':
                this.paramData.dateType = item.value_t;
                this.timeRange = item.value;
                break;
              case '商品条数或数量':
                this.paramData.itemType = item.value;
                this.paramData.itemTypeNumThan = item.label.split('-')[0];
                this.paramData.itemTypeNumLess = item.label.split('-')[1];
                break;
              case '订单金额或重量':
                this.paramData.OrderMoneyOrWeight = item.value;
                this.paramData.OrderMoneyOrWeightThan = item.label.split('-')[0];
                this.paramData.OrderMoneyOrWeightLess = item.label.split('-')[1];
                break;
              case '收货人信息':
                this.paramData.receiveType = item.value;
                this.paramData.receiveInfo = item.label;
                break;
            }
          }
        })
        this.commonConditionVisible = false;
      },
      //订单处理高级查询列头汇总查询
      getStatusConditions() {
        this._post("com.edb01.erp.oms.service.api.OrderBaseListService/" + this.version + "/getStatusConditions").then((response) => {
          if (response.data.success) {
            var obj1 = {}, obj2 = {};
            response.data.result.forEach((item, i) => {
              switch (item.typeName) {
                case '待客审':
                  this.numObj1.num1 = item.num;
                  break;
                case '待仓审':
                  this.numObj1.num2 = item.num;
                  break;
                case '已挂起':
                  this.numObj1.num3 = item.num;
                  break;
                //待客审
                case '有客服备注':
                  this.numObj1.num4 = item.num;
                  break;
                case '无客服备注':
                  this.numObj1.num5 = item.num;
                  break;
                case '有买家留言':
                  this.numObj1.num6 = item.num;
                  break;
                case '无买家留言':
                  this.numObj1.num7 = item.num;
                  break;
                case '货到付款订单':
                  this.numObj1.num8 = item.num;
                  break;
                case '预售订单':
                  this.numObj1.num9 = item.num;
                  break;
                case '包含赠品':
                  this.numObj1.num10 = item.num;
                  break;
                case '包含套装':
                  this.numObj1.num11 = item.num;
                  break;
                case '超时订单':
                  this.numObj1.num12 = item.num;
                  break;
                //待仓审
                case '缺货订单':
                  this.numObj1.num13 = item.num;
                  break;
                case '超重订单':
                  this.numObj1.num14 = item.num;
                  break;
                case '快递异常':
                  this.numObj1.num15 = item.num;
                  break;
                //已挂起
                case '超时':
                  this.numObj1.num16 = item.num;
                  break;
                case '超卖':
                  this.numObj1.num17 = item.num;
                  break;
                case '仓库缺货':
                  this.numObj1.num18 = item.num;
                  break;
                case '未合并':
                  this.numObj1.num19 = item.num;
                  break;
                case '客服备注更新':
                  this.numObj1.num20 = item.num;
                  break;
                case '需人工审核':
                  this.numObj1.num21 = item.num;
                  break;
                case '超重':
                  this.numObj1.num22 = item.num;
                  break;
                case '分配快递异常':
                  this.numObj1.num23 = item.num;
                  break;
                case '自定义标记':
                  this.numObj1.num24 = item.num;
                  break;
                case '人工挂起':
                  this.numObj1.num25 = item.num;
                  break;
                case '退款复核':
                  this.numObj1.num26 = item.num;
                  break;
              }
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //点击多条件查询tab待客审 待仓审 已挂起
      tabRender(tabValue) {
        this.paramData.orderTab = tabValue;
        this.higeSearchFlag = true;
        this.highSearchBtn();
      }
    },
    mounted() {
      if(!sessionStorage.getItem('authorityCode')){this.authorityCode = localStorage.getItem('authorityCode') ? JSON.parse(localStorage.getItem('authorityCode')) : {};}
      //console.log(this.authorityCode,JSON.parse(localStorage.getItem('authorityCode')),JSON.parse(sessionStorage.getItem('authorityCode')));
      this.swiper();
      //鼠标划过铅笔
      this.mouseHover();

      //渲染表格高度
      this.renderTableHeight();
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0]; // IE ff
        if (e && e.keyCode == 13) { // enter 键
          //调接口
          if (this.higeSearchFlag) {
            if ($('.v-modal').length == 0) {
              this.highSearchBtn();
            }
          } else {
            if ($('.v-modal').length == 0) {
              this.easySearchBtn();
            }
          }
        }
      };
      this.loading = true;
      //获取快递集合
      this._post("com.edb01.erp.wms.service.api.ExpressService/" + this.version + "/getExpressIdNameBean").then((response) => {
        if (response.data.success) {
          response.data.result = response.data.result ? response.data.result : [];
          response.data.result.forEach((item, i) => {
            this.expressListTemp.push(item);
          })
          //高级查询
          this.highSearch();
        } else {
          this.loading = false;
          this.$message({
            message: response.data.msg,
            type: "warning"
          });
        }
      }).catch(() => {
        this.loading = false;
      })
      //获取店铺仓库快递list
      this.getQueryInit();
      //获取异常标记集合
      this.getMarksList();
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .easy-content {
    margin: 0;
  }

  .col-nav ul li {
    margin-left: 1px;
  }

  .col-nav ul li span {
    padding: 0 8px;
  }

  .change-gift-1, .change-gift-2 {
    margin-bottom: 25px;
    margin-left: 50px;
  }

  .change-gift-1 > span {
    width: 90px;
    display: inline-block;
    text-align: right;
  }

  .change-gift-2 > span {
    width: 120px;
    display: inline-block;
    text-align: right;
  }

  .formatLine {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    margin-left: 5px;
  }

  .line-child {
    flex: 1;
  }

  .titleText {
    margin-left: 10px;
    font-weight: 500;
    display: inline-block;
  }

  .valueStyle {
    margin-right: 15px;
    line-height: 20px;
  }

  .ellipsis {
    width: 125px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .showAndHide .el-icon-edit {
    display: none;
  }

  .spel-order-title {
    width: 120px !important;
  }

  .shows-enter-active,
  .shows-leave-active {
    transition: opacity 0.5s;
  }

  .shows-enter,
  .shows-leave-to {
    opacity: 0;
  }

  .showAndHide .hover-row .el-icon-edit {
    display: block !important;
  }

  .showHide {
    position: absolute;
    color: #409eff;
    margin-top: 12px;
    cursor: pointer;
  }

  .listStyle {
    width: 150px;
  }

  .changeList {
    overflow: hidden;
    overflow-y: scroll;
    margin: 0 auto;
    width: 355px;
    height: 520px;
    border: solid 1px #eeeeee;
    display: flex;
    justify-content: space-between;
  }

  .selectShopList {
    text-align: right;
    display: inline-block;
    width: 180px;
  }

  .rowTitle {
    cursor: default;
    line-height: 30px;
    height: 30px;
    text-align: center;
    border-bottom: solid 1px #eeeeee;
    border-right: solid 1px #eeeeee;
  }

  .setFlagList {
    color: #409eff !important;
    position: absolute;
    right: 0;
    bottom: 42px;
    margin-right: 30px;
  }

  #rightBar {
    width: 90%;
    float: left;
  }

  .checkStyle {
    margin-left: 10px !important;
    margin-right: 0;
  }

  .checkBoxTitle {
    margin-left: -7px !important;
  }

  .vertical {
    color: #d5d5d5;
  }

  .chkStyle {
    margin-left: 35px !important;
    text-align: left;
    display: block;
    width: 120px;
  }

  .formatFont {
    font-size: 14px;
  }

  .selects {
    float: left;
    width: 60%;
    height: 28px;
  }

  .el-tag {
    background-color: transparent;
  }

  .el-dropdown-menu__item {
    font-size: 12px;
  }

  .container_orderList {
    padding-left: 20px !important;
    padding-top: 20px !important;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    color: #333333;
    font-weight: 500;
    overflow-y: hidden;
  }

  .topBarText {
    margin-left: 10px;
    margin-top: 20px;
    float: left;
  }

  .topBarInput {
    margin-top: 15px;
    float: left;
    width: 100px !important;
  }

  .clearBorder {
    border: none;
    background-color: transparent;
  }

  #orderlist {
    cursor: pointer;
    font-weight: 500;
  }

  .setOrderRow {
    position: absolute;
    right: 50px;
    top: 80px;
    width: 395px;
    height: 640px;
    border: solid 1px #dfdfdf;
  }

  .radioStyle {
    line-height: 40px;
    margin-top: 20px;
    height: 30px;
    margin-left: 0 !important;
    width: 500px;
  }

  .spanSet {
    float: left;
    margin-top: 7px;
  }

  .headTools {
    top: 50%;
    padding-top: 10px;
    z-index: 100;
    background-color: white;
    width: 100px;
    height: 125px;
    position: absolute;
  }

  a {
    color: #409eff;
  }

  .tagStyle {
    height: 22px;
    line-height: 35px;
    margin-top: 8px;
    line-height: 22px !important;
    border: solid 1px #ff8746 !important;
    color: #ff8746 !important;
  }

  .successTitle {
    font-size: 16px;
    font-weight: 900;
    margin: 0 auto;
    margin-bottom: 15px;
    width: 300px;
  }

  .titles {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 16px;
  }

  #saveSearchCondition {
    position: absolute;
    top: 20%;
    left: 28%;
    z-index: 10;
    width: 475px;
    height: 175px;
    background-color: white;
    border: solid 1px black;
  }

  #setReceipt {
    padding-top: 35px;
    padding-left: 15px;
    width: 400px;
    height: 225px;
    position: fixed;
    top: 30%;
    z-index: 10;
    left: 38%;
    border: solid 1px black;
    background-color: white;
  }

  #setNote {
    padding-top: 25px;
    padding-left: 15px;
    width: 400px;
    height: 265px;
    position: fixed;
    top: 30%;
    z-index: 10;
    left: 40%;
    border: solid 1px black;
    background-color: white;
  }

  .conditionBtn {
    float: left;
    height: 20px;
    width: 100px;
    line-height: 19px;
    text-align: center;
    padding: 0 !important;
    border: none;
    background-color: transparent;
  }

  #setNotice {
    padding-top: 25px;
    padding-left: 15px;
    width: 400px;
    height: 250px;
    position: fixed;
    top: 30%;
    z-index: 10;
    left: 40%;
    border: solid 1px black;
    background-color: white;
  }

  #toolBar {
    margin-bottom: 20px !important;
    margin-top: 20px !important;
    background-color: #eeeeee;
    padding-top: 5px;
    padding-bottom: 5px;
    /*float: left;*/
    width: 100%;
    height: 30px;
  }

  #tools {
    height: 100%;
    width: 100%;
    margin-top: 55px !important;
  }

  #tools ul {
    margin-top: -53px;
  }

  #tools ul li {
    float: left;
  }

  .toolsBtns {
    width: 44px !important;
    margin: 0;
    padding: 0 !important;
    margin-top: -15px;
    background-color: transparent;
    border: none;
    height: 30px;
    color: #606266 !important;
  }

  .toolsBtns:hover {
    background-color: #818d9b;
    border-radius: 0;
    color: white !important;
  }

  #refundType {
    float: left;
    font-size: 12px;
  }

  #setBtn {
    margin-top: 5px;
    margin-bottom: -15px;
  }

  .btns {
    border: solid 1px #409eff;
    color: #409eff;
  }

  .downMenu {
    margin: 0 !important;
    padding: 0 !important;
    width: 100px !important;
    margin-top: -10px !important;
    line-height: 0px !important;
  }

  .btns:hover {
    background-color: #409eff;
    color: white;
  }

  #datePicker {
    font-size: 12px;
    margin-top: 15px;
    padding: 0;
  }

  #dataList {
    width: 100%;
    margin-top: 15px;
  }

  #setFlag {
    float: left;
    font-size: 12px;
  }

  #goods {
    font-size: 12px;
    float: left;
  }

  #refundStatus {
    font-size: 12px;
    float: left;
  }

  #open {
    color: #409eff;
    cursor: pointer;
  }

  .titleText {
    vertical-align: top;
    display: inline-block;
    margin-top: 0px;
    font-size: 14px;
  }

  #saveIcon {
    cursor: pointer;
    float: right;
    border: none;
    border-left: solid 1px #dfdfdf;
    height: 36px;
    width: 35px;
    position: absolute;
    right: 295px;
  }

  .btnFormat {
    color: black;
  }

  .btnFormatEnter {
    margin-left: 35px !important;
    color: white;
  }

  .btnFormatEnter:hover {
    color: white;
  }

  #getSearchCondition {
    width: 95px;
    margin: 0;
    float: left;
    margin-top: 0px !important;
    background-color: transparent;
    border: none;
    height: 36px;
  }

  #searchConditionRefresh {
    margin: 0;
    border-radius: 0 !important;
    background-color: #f2f2f2;
    width: 65px !important;
    float: left;
    height: 36px;
    border: none;
  }

  #combinationSearch {
    border: none;
    color: white;
    border-radius: 0 !important;
    margin: 0;
    width: 75px;
    float: left;
    height: 36px;
    background-color: rgb(64, 158, 255);
    margin-right: 5px;
  }

  #combinationSearch:hover {
    color: white;
  }

  #searchCondition {
    float: right;
    height: 36px;
    border: none;
    position: absolute;
    right: 0;
  }

  #conditionTab {
    margin-top: 10px !important;
    border: solid 1px #dfdfdf;
    height: 38px;
    width: 100%;
    position: relative;
  }

  #conditionLeft {
    width: 100%;
    position: absolute;
    padding: 4px 351px 0 20px;
    border: none;
    height: 38px;
    overflow: hidden;
  }

  .refreshIcon {
    color: #409eff;
    font-size: 12px;
    float: right;
  }

  .rightBtn {
    padding: 0;
    border: none;
    background-color: transparent;
  }

  .rightBtn:hover {
    background-color: transparent;
  }

  .clearfix:after {
    content: "";
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }

  #higeSearch {
    width: 100%;
    height: 131px;
    margin: 0 auto;
  }

  #fastSearchCondition {
    margin-top: 10px;
  }

  #fastSearchCondition li {
    cursor: pointer;
    float: left;
  }

  #fastSearchCondition li:last-child {
    border: none;
  }

  .changeSelect {
    float: left;
    width: 20%;
  }

  #centerBar {
    width: 90%;
    text-align: center;
    float: left;
    display: flex;
    justify-content: space-around;
  }

  #leftBar {
    float: left;
  }

  .clearfix {
    zoom: 1;
  }

  #headBar {
    border: solid 1px #dfdfdf;
    width: 100%;
    height: 60px;
  }

  .fastSearch {
    width: 88px !important;
    border-radius: 0 !important;
    background-color: #eeeeee;
    border: none;
    padding: 0;
    height: 29px;
  }

  .order-export-left p {
    margin-top: 15px;
  }

  .search-box {
    width: 100%;
    height: 35px;
  }

  #searchBox .el-col-6 {
    width: 19% !important;;
  }

  .rightBox1 {
    right: 30px;
  }

  .el-tag {
    position: relative;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 16px;
  }

  .el-tag .el-icon-close {
    position: absolute;
    top: 3px;
    right: 2px;
  }
</style>
<style>
  .order-picker.el-date-editor .el-range-input{
    width:43%;
  }
  .order-picker.el-date-editor .el-range__close-icon{
    display: none;
  }
  .fh-select-box {
    display: flex;
  }

  .fh-select-box .el-input__inner {
    padding: 0 10px;
  }

  .fh-select .el-input--suffix .el-input__inner {
    padding: 0 10px !important;
  }

  .fh-radio {
    white-space: inherit;
  }

  .fh-radio .el-radio__label {
    float: right;
    padding-left: 0;
  }

  .selects .el-input__inner {
    padding-right: 27px;
  }

  .selects .el-input-group__append {
    padding: 0;
    height: 26px;
    width: 26px;
    background: #fff;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
  }

  .import-btn span {
    width: 100%;
    display: block;
    overflow: hidden;
  }

  #toolBar .el-button {
    border-radius: 0 !important;
  }

  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: left;
    font-size: 18px;
    background: #fff;
    height: 20px;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .swiper-button-next, .swiper-button-prev {
    opacity: 0 !important;
  }

  .changeSelect .multiselect-native-select {
    width: 60% !important;
    margin-left: -4px;
  }

  .app-main {
    min-width: 1600px !important;
  }

  .container_orderList .el-checkbox + .el-checkbox {
    margin-left: 0px;
  }

  .container_orderList .el-table__body tr.hover-row > td {
    background-color: #eeeeee !important;
  }

  .container_orderList #conditionLeft .el-tag__close {
    color: #ff8746 !important;
    position: absolute;
    top: 3px;
    right: 2px;
  }

  .container_orderList #conditionLeft .el-icon-close:hover {
    color: white !important;
    background-color: #ff8746 !important;
  }

  /*.container_orderList .el-dropdown {
    cursor: pointer;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 0px;
    padding-top: 6px;
    height: 28px;
  }*/

  .container_orderList .el-select .el-tag {
    margin: 0;
    padding: 0;
    font-size: 11px;
    text-align: center;
    padding-left: 3px;
    padding-right: 5px;
    margin-left: 2px;
  }

  .container_orderList .el-select__tags {
    max-width: 155px !important;
    width: 155px !important;
  }

  .container_orderList .el-select__tags-text {
    width: 80px !important;
    max-width: 155px !important;
  }

  .container_orderList .el-tag .el-icon-close {
    margin: 0;
  }

  .container_orderList .el-dropdown:hover {
    background-color: #818d9b;
    color: white !important;
  }

  .container_orderList .el-dropdown-menu,
  .el-dropdown-menu--mini {
    text-align: center !important;
  }

  .container_orderList .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #818d9b;
    color: white;
  }

  .selects.is-disabled .el-input__inner, .selects.is-disabled .el-input__icon {
    cursor: pointer !important;
  }
</style>
