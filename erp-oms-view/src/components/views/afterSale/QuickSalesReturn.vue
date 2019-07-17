<!--快速退货入库 尘音-->
<template>
  <div id="quickSalesReturn">
    <div class="pageLeft">
      <label class="leftLabel">快递单号/平台单号</label>
      <el-input @keyup.enter.native="orderNumEnter" v-model="orderNum" placeholder="支持扫描以及手动输入" class="elInput"></el-input>
      <div class="leftLabel" style="position: relative">
        <label>条形码</label>
        <div style="position: absolute;right: 2px; top: 3px">
          <el-radio v-model="goodsRadio" label="edbzp">正品</el-radio>
          <el-radio v-model="goodsRadio" label="edbcp">次品</el-radio>
        </div>
      </div>
      <el-input v-model="barCodeMsg" @keyup.enter.native="barCodeEnter" ref="barCode" placeholder="支持扫描以及手动输入" class="elInput"></el-input>
      <el-button @click="intoStorage" type="primary" :disabled="isDisabled" class="leftBtn">收货入库(快捷键Ctrl+~)</el-button>
    </div>
    <div class="pageRight">
      <!--收货信息-->
      <div style="padding-left: 10px">
        <label class="rightLabel">收货信息</label>
        <div style="margin-top: 10px">
          <label style="font-size: 14px;text-indent: 1em">收货仓：</label>
          <span style="font-size: 14px;">{{storageName}}</span>
        </div>
      </div>
      <!--售后单-->
      <div v-show="loading" style="position: fixed;top: 50%;left:60%;">loading...</div>
      <div v-for="(afterSaleMsg,allIndex) in messageAll" class="orderStyle">
        <!--售后单信息-->
        <div style="margin-bottom: 10px">
          <div class="afterStyle">
            <div>
              <label style="font-weight: bold">售后订单：</label>
              <span>{{afterSaleMsg.afterSalesNo}}</span>
            </div>

            <div>
              <label style="font-weight: bold">买家ID：</label>
              <span>{{afterSaleMsg.buyerNick}}</span>
            </div>

            <div>
              <label style="font-weight: bold">手机号：</label>
              <span>{{afterSaleMsg.mobile}}</span>
            </div>

            <div>
              <label style="font-weight: bold">快递公司：</label>
              <span>{{afterSaleMsg.expressName}}</span>
            </div>

            <div>
              <label style="font-weight: bold">快递单号：</label>
              <span>{{afterSaleMsg.expressNo}}</span>
            </div>
          </div>
          <div>
            <label style="float: left;width: 65px;font-weight: bold">售后备注：</label>
            <div style="padding-left: 65px;width: 100%">
              <el-input
                style="font-size: 12px"
                type="textarea"
                placeholder="请输入备注，最多可输入500字"
                v-model="afterSaleMsg.afterMsg">
              </el-input>
            </div>
          </div>
        </div>
        <!--售后单商品信息-->
        <div id="afterTable" style="margin: 0 -20px">
          <el-table
            :show-header="false"
            :data="afterSaleMsg.datails"
            style="width: 100%;">

            <el-table-column
              label="序号"
              width="35">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div class="lineHStyle" v-if = "scope.row.suitFlag">
                  <div style="font-weight: bold">{{ scope.$index + 1 }}</div>
                  <div
                    :style="{'height': suitMsg.batchs.length*50 + 'px','line-height': suitMsg.batchs.length*50 + 'px'}"
                    v-for="(suitMsg,index) in scope.row.suits"
                    style="margin-top: 30px">
                    <div style="visibility: hidden">隐藏序号</div>
                  </div>
                </div>
                <span v-else style="font-weight: bold">{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="商品名称"
              width="240">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <!--套装-->
                <div class="lineHStyle" v-if = "scope.row.suitFlag">
                  <div>
                    <img :src="scope.row.goodsUrl" width="40" height="40" style="float: left">
                    <el-tooltip class="item" effect="dark" :content="scope.row.goodsName" placement="bottom">
                      <span class="spanStyle">{{ scope.row.goodsName }}</span>
                    </el-tooltip>
                  </div>
                  <div
                    :style="{'height': suitMsg.batchs.length*50 + 'px','line-height': suitMsg.batchs.length*50 + 'px'}"
                    v-for="(suitMsg,index) in scope.row.suits"
                    style="padding-left: 20px;margin-top: 30px">
                    <img :style="{'margin-top': ((suitMsg.batchs.length*50 - 40)/2) + 'px','float': 'left'}" :src="suitMsg.goodsUrl" width="40" height="40">
                    <el-tooltip class="item" effect="dark" :content="suitMsg.goodsName" placement="bottom">
                      <span class="spanStyle">{{ suitMsg.goodsName }}</span>
                    </el-tooltip>
                  </div>
                </div>
                <!--单品-->
                <div class="lineHStyle" v-else>
                  <div>
                    <img :src="scope.row.goodsUrl" width="40" height="40" style="float: left">
                    <el-tooltip class="item" effect="dark" :content="scope.row.goodsName" placement="bottom">
                      <span class="spanStyle">{{ scope.row.goodsName }}</span>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="条形码"
              width="160">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div class="lineHStyle" v-if = "scope.row.suitFlag">
                  <div class="batchStyle">条形码：{{ scope.row.goodsBarCode }}</div>
                  <div
                    :style="{'height': suitMsg.batchs.length*50 + 'px','line-height': suitMsg.batchs.length*50 + 'px'}"
                    v-for="(suitMsg,index) in scope.row.suits"
                    style="margin-top: 30px">
                    条形码：{{ suitMsg.goodsBarCode }}
                  </div>
                </div>
                <span v-else style="font-weight: bold">条形码：{{ scope.row.goodsBarCode }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="规格"
              width="115">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div class="lineHStyle" v-if = "scope.row.suitFlag">
                  <div class="batchStyle">规格：{{ scope.row.goodsSpec }}</div>
                  <div
                    :style="{'height': suitMsg.batchs.length*50 + 'px','line-height': suitMsg.batchs.length*50 + 'px'}"
                    v-for="(suitMsg,index) in scope.row.suits"
                    style="margin-top: 30px">
                    规格：{{ suitMsg.goodsSpec }}
                  </div>
                </div>
                <span v-else style="font-weight: bold">规格：{{ scope.row.goodsSpec }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="申请退货数量"
              width="165">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div class="lineHStyle" v-if = "scope.row.suitFlag">
                  <div class="batchStyle">申请退货数量：{{ scope.row.applyReturnQty }}</div>
                  <div
                    :style="{'height': suitMsg.batchs.length*50 + 'px','line-height': suitMsg.batchs.length*50 + 'px'}"
                    v-for="(suitMsg,index) in scope.row.suits"
                    style="margin-top: 30px">
                    申请退货数量：{{ suitMsg.applyReturnQty }}
                  </div>
                </div>
                <span v-else style="font-weight: bold">申请退货数量：{{ scope.row.applyReturnQty }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="实退数量"
              width="140">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div class="lineHStyle" v-if = "scope.row.suitFlag">
                  <div class="batchStyle">实退数量：{{ scope.row.realReturnQty }}</div>
                  <div
                    :style="{'height': suitMsg.batchs.length*50 + 'px','line-height': suitMsg.batchs.length*50 + 'px'}"
                    v-for="(suitMsg,index) in scope.row.suits"
                    style="margin-top: 30px">
                    实退数量：{{ suitMsg.realReturnQty }}
                  </div>
                </div>
                <span v-else style="font-weight: bold">实退数量：{{ scope.row.realReturnQty }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="正品数量"
              width="140">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div v-if = 'scope.row.suitFlag'>
                  <div class="lineHStyle">
                    <span style="float: left;font-weight: bold">正品数量</span>
                    <div class="numStyle">
                      <el-input @keyup.native="scope.row.suitNormalQty = scope.row.suitNormalQty.replace(/[^\d]/g,'');if(scope.row.suitNormalQty == 0)scope.row.suitNormalQty = ''" @focus="focusNum(scope.row.suitNormalQty)" @change="changeNum(scope.$index,allIndex,scope.row,scope.row.suitNormalQty,true,true,allIndex,scope.row)" :disabled="scope.row.isDisabledNum" v-model="scope.row.suitNormalQty" style="font-weight: bold"></el-input>
                    </div>
                  </div>

                  <div v-for="(suitMSg,index) in scope.row.suits" style="margin-top: 30px">
                    <div class="lineHStyle" v-for="(batchMsg,index) in suitMSg.batchs">
                      <span style="float: left;font-weight: bold">正品数量</span>
                      <div class="numStyle">
                        <el-input @keyup.native="batchMsg.normalQty = batchMsg.normalQty.replace(/[^\d]/g,'');if(batchMsg.normalQty == 0)batchMsg.normalQty = ''" @focus="focusNum(batchMsg.normalQty)" @change="changeNum(scope.$index,allIndex,suitMSg,batchMsg.normalQty,true,true,index,scope.row)" :disabled="suitMSg.isDisabledNum" v-model="batchMsg.normalQty" style="font-weight: bold"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="lineHStyle" v-for="(batchMsg,index) in scope.row.batchs">
                    <span style="float: left;font-weight: bold">正品数量</span>
                    <div class="numStyle">
                      <el-input @keyup.native="batchMsg.normalQty = batchMsg.normalQty.replace(/[^\d]/g,'');if(batchMsg.normalQty == 0)batchMsg.normalQty = ''" @focus="focusNum(batchMsg.normalQty)" @change="changeNum(scope.$index,allIndex,scope.row,batchMsg.normalQty,true,false,index)" style="font-weight: bold" v-model="batchMsg.normalQty"></el-input>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="次品数量"
              width="140">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div v-if = 'scope.row.suitFlag'>
                  <div class="lineHStyle">
                    <span style="float: left;font-weight: bold">次品数量</span>
                    <div class="numStyle">
                      <el-input @keyup.native="scope.row.suitInferionQty = scope.row.suitInferionQty.replace(/[^\d]/g,'');if(scope.row.suitInferionQty == 0)scope.row.suitInferionQty = ''" @focus="focusNum(scope.row.suitInferionQty)" @change="changeNum(scope.$index,allIndex,scope.row,scope.row.suitInferionQty,false,true,allIndex,scope.row)" :disabled="scope.row.isDisabledNum" v-model="scope.row.suitInferionQty" style="font-weight: bold"></el-input>
                    </div>
                  </div>

                  <div style="margin-top: 30px" v-for="(suitMSg,index) in scope.row.suits">
                    <div class="lineHStyle" v-for="(batchMsg,index) in suitMSg.batchs">
                      <span style="float: left;font-weight: bold">次品数量</span>
                      <div class="numStyle">
                        <el-input @keyup.native="batchMsg.inferionQty = batchMsg.inferionQty.replace(/[^\d]/g,'');if(batchMsg.inferionQty == 0)batchMsg.inferionQty = ''" @focus="focusNum(batchMsg.inferionQty)" @change="changeNum(scope.$index,allIndex,suitMSg,batchMsg.inferionQty,false,true,index,scope.row)" :disabled="suitMSg.isDisabledNum" v-model="batchMsg.inferionQty" style="font-weight: bold"></el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="lineHStyle" v-for="(batchMsg,index) in scope.row.batchs">
                    <span style="float: left;font-weight: bold">次品数量</span>
                    <div class="numStyle">
                      <el-input @keyup.native="batchMsg.inferionQty = batchMsg.inferionQty.replace(/[^\d]/g,'');if(batchMsg.inferionQty == 0)batchMsg.inferionQty = ''" @focus="focusNum(batchMsg.inferionQty)" @change="changeNum(scope.$index,allIndex,scope.row,batchMsg.inferionQty,false,false,index)" v-model="batchMsg.inferionQty" style="font-weight: bold"></el-input>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="批次号"
              width="110">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div class="lineHStyle" v-if="scope.row.suitFlag">
                  <div class="lineHStyle" style="visibility: hidden">
                    隐藏批次
                  </div>
                  <div style="margin-top: 30px" v-for="(suitMsg,index) in scope.row.suits">
                    <div v-for="(batchMsg,index) in suitMsg.batchs">
                      <div v-if="suitMsg.goodsIsBatch" class="batchStyle">批次号<br/>{{ batchMsg.batchNo }}</div>
                      <div v-else style="visibility: hidden" class="batchStyle">批次号<br/>{{ batchMsg.batchNo }}</div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="lineHStyle" v-for="(batchMsg,index) in scope.row.batchs">
                    <div v-if="scope.row.goodsIsBatch" class="batchStyle">批次号<br/>{{ batchMsg.batchNo }}</div>
                    <div v-else style="visibility: hidden" class="batchStyle">批次号<br/>{{ batchMsg.batchNo }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              min-width="110"
              label="操作"
              fixed="right"
              v-if="goodsIsBatchAll">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div class="lineHStyle" v-if = 'scope.row.suitFlag'>
                  <div class="lineHStyle" style="visibility: hidden">
                    隐藏修改/删除
                  </div>
                  <div style="margin-top: 30px" v-for="(suitMsg,index) in scope.row.suits">
                    <div v-for="(batchMsg,index) in suitMsg.batchs">
                      <div v-if="suitMsg.goodsIsBatch">
                        <a style="color: #1871F0;font-size: 14px" @click="handleEdit(allIndex,scope.$index,suitMsg,true,suitMsg,index)">修改</a>
                        <el-button v-if="suitMsg.batchs.length == 1" disabled :style="{'color': '#ccc'}" style="font-size: 14px;margin-left: 20px" type="text">删除</el-button>
                        <el-button v-if="suitMsg.batchs.length > 1 && batchMsg.isDisabled == true" disabled :style="{'color': '#ccc'}" style="font-size: 14px;margin-left: 20px" type="text">删除</el-button>
                        <el-button v-if="suitMsg.batchs.length > 1 && batchMsg.isDisabled == false" :style="{'color': '#D8283E'}" style="font-size: 14px;margin-left: 20px" @click="handleDelete(scope.$index,suitMsg,index)" type="text">删除</el-button>
                        <el-button v-if="suitMsg.batchs.length > 1 && batchMsg.isDisabled == undefined" :style="{'color': '#D8283E'}" style="font-size: 14px;margin-left: 20px" @click="handleDelete(scope.$index,suitMsg,index)" type="text">删除</el-button>
                      </div>
                      <div v-else style="visibility: hidden">
                        <a style="color: #1871F0;font-size: 14px" @click="handleEdit(allIndex,index,suitMsg,true,batchMsg)">修改</a>
                        <el-button v-if="suitMsg.batchs.length == 1" disabled :style="{'color': '#ccc'}" style="font-size: 14px;margin-left: 20px" type="text">删除</el-button>
                        <el-button v-if="suitMsg.batchs.length > 1" :style="{'color': '#D8283E'}" style="font-size: 14px;margin-left: 20px" @click="handleDelete(index, batchMsg)" type="text">删除</el-button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="lineHStyle" v-for="(batchMsg,index) in scope.row.batchs">
                    <div v-if="scope.row.goodsIsBatch">
                      <a style="color: #1871F0;font-size: 14px" @click="handleEdit(allIndex,scope.$index, scope.row,false,scope.row,index)">修改</a>
                      <el-button v-if="scope.row.batchs.length == 1" disabled :style="{'color': '#ccc'}" type="text" style="font-size: 14px;margin-left: 20px">删除</el-button>
                      <el-button v-if="scope.row.batchs.length > 1" :style="{'color': '#D8283E'}" type="text" style="font-size: 14px;margin-left: 20px" @click="handleDelete(scope.$index, scope.row,index)">删除</el-button>
                    </div>
                    <div v-else style="visibility: hidden;overflow: hidden">
                      <a style="color: #1871F0;font-size: 14px" @click="handleEdit(allIndex,scope.$index, scope.row,false,batchMsg)">修改</a>
                      <el-button v-if="scope.row.batchs.length == 1" disabled :style="{'color': '#ccc'}" type="text" style="font-size: 14px;margin-left: 20px">删除</el-button>
                      <el-button v-if="scope.row.batchs.length > 1" :style="{'color': '#D8283E'}" type="text" style="font-size: 14px;margin-left: 20px" @click="handleDelete(scope.$index, scope.row,index)">删除</el-button>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column v-if="goodsIsBatchAll" fixed="right" label="操作" min-width="110">
              <template slot-scope="scope">
                <div class="styleH"></div>
                <div class="lineHStyle" v-if = 'scope.row.suitFlag'>
                  <div class="lineHStyle" style="visibility: hidden">隐藏添加批次</div>
                  <div v-for="(suitMsg,index) in scope.row.suits">
                    <div style="height: 30px;line-height: 30px">
                      <a v-if="suitMsg.goodsIsBatch" style="color: #1871F0;font-size: 14px" @click="handleAdd(scope.$index,allIndex,index,suitMsg,true)">添加批次</a>
                      <a v-else style="visibility: hidden;color: #1871F0;font-size: 14px" @click="handleAdd(scope.$index,allIndex,index,suitMsg,true)">添加批次</a>
                    </div>
                    <div :style="{'height': suitMsg.batchs.length*50 + 'px'}">
                      <a style="visibility: hidden">隐藏添加批次</a>
                    </div>
                  </div>
                </div>
                <div style="margin-top: -30px" v-else>
                  <a v-if="scope.row.goodsIsBatch" style="color: #1871F0;font-size: 14px" @click="handleAdd(scope.$index,allIndex,scope.$index, scope.row,false)">添加批次</a>
                  <a v-else style="visibility: hidden;color: #1871F0;font-size: 14px" @click="handleAdd(scope.$index,allIndex,scope.$index, scope.row,false)">添加批次</a>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!--仓库选择-->
    <el-dialog v-dialogDrag
      title="选择退货入库仓库"
      :visible.sync="dialogVisible"
      :closeOnClickModal="false"
      :showClose="false"
      width="500px">
      <div style="margin-left: 52px;position: relative">
        <!--<i v-if="storageId != ''" @click="storageId = ''" class="el-icon-close" style="position: absolute;top: 8px;left: 255px;z-index: 99;cursor: pointer"></i>-->
        <label style="font-size: 14px">退货入库仓库：</label>
        <el-select id="searchStock" v-model="storageId" filterable placeholder="请选择">
          <el-option
            v-for="item in optionsStock"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="storageClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--批次修改-->
    <el-dialog v-dialogDrag
      id="dialogBox1"
      title="批次列表"
      :visible.sync="batchDialogVisible1"
      width="800px"
      center>

      <div class="contentBox">
        <!--搜索区-->
        <div id="searchBox1" style="position: relative">
          <div class="leftBox2">
            <el-row>
              <div class="grid-content">
                <label for="name" style="width: 60px!important;">批次号：</label>
                <el-input @keyup.enter.native="choseSearch" style="width: 300px!important;" maxlength="100" id="name" v-model="searchBatchNo" placeholder="请输入内容"></el-input>
              </div>
            </el-row>
          </div>
          <div class="rightBox2">
            <el-button @click="choseSearch" size="mini" type="primary">查 询</el-button>
          </div>
        </div>
        <!--表格1-->
        <div style="margin-bottom: 20px">
          <div class="pDown" style="position: relative">
            <el-table
              highlight-current-row
              id="tableH" :data="tableDataBatch" border :max-height="table_h" style="width: 100%"
              @current-change="handleCurrentChange1">

              <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

              <el-table-column label="批次号">
                <template slot-scope="scope">
                  {{ scope.row.batchNo }}
                </template>
              </el-table-column>

              <el-table-column label="失效日期">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.expirationDate }}</p>
                </template>
              </el-table-column>

              <el-table-column label="预警提前期">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.earlyWarningDays }}</p>
                </template>
              </el-table-column>

              <el-table-column label="发货提前期">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.deliveryLeadDays }}</p>
                </template>
              </el-table-column>

            </el-table>
            <!--分页-->
            <div class="pagination" style="position: absolute;bottom: -50px;border-top: none">
              <pagination
                :totalCom="total"
                :pageSizeCom="pageSize"
                :curPageCom="curPage"
                @pageSizeVal="getPageSize" @curPageVal="getCurPage">
              </pagination>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="choseBatchOk1">确 认</el-button>
      </span>
    </el-dialog>

    <!--批次添加-->
    <el-dialog v-dialogDrag
      id="dialogBox2"
      title="批次列表"
      :visible.sync="batchDialogVisible2"
      width="800px"
      center>

      <div class="contentBox">
        <!--搜索区-->
        <div id="searchBox2" style="position: relative">
          <div class="leftBox2">
            <el-row>
              <div class="grid-content">
                <label for="name" style="width: 60px!important;">批次号：</label>
                <el-input @keyup.enter.native="choseSearch" style="width: 300px!important;" maxlength="100" id="name" v-model="searchBatchNo" placeholder="请输入内容"></el-input>
              </div>
            </el-row>
          </div>
          <div class="rightBox2">
            <el-button @click="choseSearch" size="mini" type="primary">查 询</el-button>
          </div>
        </div>
        <!--表格2-->
        <div style="margin-bottom: 20px">
          <div class="pDown" style="position: relative">
            <el-table
              id="tableH" :data="tableDataBatch" border :max-height="table_h" style="width: 100%"
              @selection-change="handleSelectionChange2">

              <el-table-column label="序号" width="45" type="index" align="center"></el-table-column>

              <el-table-column type="selection" width="55" align="center"></el-table-column>

              <el-table-column label="批次号">
                <template slot-scope="scope">
                  {{ scope.row.batchNo }}
                </template>
              </el-table-column>

              <el-table-column label="失效日期">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.expirationDate }}</p>
                </template>
              </el-table-column>

              <el-table-column label="预警提前期">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.earlyWarningDays }}</p>
                </template>
              </el-table-column>

              <el-table-column label="发货提前期">
                <template slot-scope="scope">
                  <p class="cen-g">{{ scope.row.deliveryLeadDays }}</p>
                </template>
              </el-table-column>

            </el-table>
            <!--分页-->
            <div class="pagination" style="position: absolute;bottom: -50px;border-top: none">
              <pagination
                :totalCom="total"
                :pageSizeCom="pageSize"
                :curPageCom="curPage"
                @pageSizeVal="getPageSize" @curPageVal="getCurPage">
              </pagination>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="choseBatchOk2">确 认</el-button>
      </span>
    </el-dialog>

    <!--音乐盒子-->
    <div id="audio"></div>
  </div>
</template>
<script>
  import pagination from '@/components/common/Pagination.vue'
  export default {
    components: {
      pagination
    },
    data() {
      return {
        version:'1.0.0',//接口版本号
        optionsStock:[],//仓库下拉
        storageId: '',//仓库
        storageName: '',//仓库名称

        orderNum: '',//快递单号/平台单号
        barCodeMsg: '',//条形码扫描

        goodsRadio: 'edbzp',//正次品选择
        dialogVisible: false,//选择退货入库仓库是否展示
        isDisabled: false,//是否禁用入库按钮

        messageAll: [],//所有售后单信息
        messageTo: [],//套装内单品比例

        searchBatchNo: '',///查询条件批次号
        tableDataBatch: [],//批次表格数据
        total: 0, //总页数
        pageSize: 15, //每页数量
        curPage: 1, //当前页数
        table_h: 500,//表格高度
        batchDialogVisible1: false,//批次修改显示/隐藏
        batchDialogVisible2: false,//批次添加显示/隐藏
        currentRow1: null,//修改批次（表格已选）
        multipleSelection2: [],//添加批次（表格已选）

        currentMsg: {},//添加当前所选数据
        currentEditMsg: {},//修改当前所选数据
        suitType: false,//当前数据是否是套装数据
        isMarkList: [],//提示无效条形码条件数组
        initType: 1,//接口传参
        initNum: '',//正次品原始数值
        initBatch: Number,//修改行
        initRow: Number,//添加行
        allNum: Number,//messageAll数据行
        goodsRow: Number,//商品行
        tableIndex: Number,//table行

        loading: false,//loading效果
        goodsIsBatchAll: true,//是否都不是批次商品
      }
    },
    beforeMount() {

    },
    mounted(){
      this.initStock();//初始化仓库下拉

      //ctrl+~入库
      document.onkeydown = (event) => {
        console.log(event);
        let e = event || window.event;
        if (e.ctrlKey && e.keyCode == 192) {
          this.initReturnStorage();
        }
      };


    },
    methods:{

      //全屏loading
      openFullScreen() {
        this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },

      //关闭全屏loading
      closeFullScreen() {
        this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        }).close();
      },

      //初始化仓库下拉列表
      initStock:function () {
        this._post('com.edb01.erp.wms.service.api.WmStorageService/' + this.version + '/listOauthByQuickStorage').then(function (res) {
          if(res.data.success) {
            if(this.optionsStock.length == 0) {
              let arr = res.data.result;

              if(arr.length == 0) {

                //无仓库
                this.isDisabled = true;
                document.onkeydown = null
              }else if(arr.length == 1) {

                //一个仓库
                this.storageName = arr[0].storageName;
                this.storageId = arr[0].storageId
              }else {

                //多个仓库
                this.dialogVisible = true;
                arr.forEach(function (val) {
                  this.optionsStock.push({value: val.storageId,label: val.storageName})
                }.bind(this));
              }
            }

          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this));
      },

      //初始化售后单信息据接口
      initMessage: function () {
        this.messageAll = [];
        this.loading = true;
        let data = {
          data: this.orderNum
        };
        this._post('com.edb01.erp.ass.service.api.QuickReturnStorageService/' + this.version + '/scanningInfo',data).then(function (res) {
          if(res.data.success) {
            if(res.data.result.resultIsFind) {

              let arr = [];
              this.loading = false;
              this.$refs.barCode.focus();
              res.data.result.infos.forEach((item1) => {
                item1.datails.forEach((item2) => {
                  item2.isDisabledNum = false;
                  if(item2.goodsIsBatch) {
                    arr.push(true)
                  }else {
                    arr.push(false)
                  }
                  item2.suits.forEach((item3) => {

                    //套单首行不禁用
                    item3.batchs[0].isDisabled = false;

                    //isDisabledNum是否禁用输入框
                    item3.isDisabledNum = false;
                    if(item3.goodsIsBatch) {
                      arr.push(true)
                    }else {
                      arr.push(false)
                    }
                  })
                })
              });
              this.messageAll = res.data.result.infos;
              this.messageTo = res.data.result.blInfo;
              if(arr.includes(true)){}
              else {
                this.goodsIsBatchAll = false
              }
            }else {
              this.loading = false;
              this.$message({
                message: res.data.result.message,
                type: 'warning'
              })
            }

          }else {
            this.loading = false;
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //批次列表接口（弹窗）
      initSelectBatchsList: function (row) {
        this.currentMsg = row;
        let oldGoodsBatchBySplitComma = '';
        if(row.batchs) {
          row.batchs.forEach(function (val) {
            oldGoodsBatchBySplitComma += val.batchNo + ','
          }.bind(this))
        }
        oldGoodsBatchBySplitComma = oldGoodsBatchBySplitComma.slice(0,oldGoodsBatchBySplitComma.length - 1);
        let data = {
          searchBatchNo: this.searchBatchNo,
          goodsId: row.goodsId,
          oldGoodsBatchBySplitComma: oldGoodsBatchBySplitComma,
          "page": this.curPage,
          "size": this.pageSize
        };
        this._post('com.edb01.erp.ass.service.api.QuickReturnStorageService/' + this.version + '/selectBatchsList',data).then(function (res) {
          if(res.data.success) {
            this.tableDataBatch = res.data.result.rows;
            this.total = res.data.result.total
          }else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }.bind(this))
      },

      //收货入库接口
      initReturnStorage: function () {
        this.openFullScreen();
        let data = {
          handleType: this.initType,
          saveDataByJson: JSON.stringify({
            saveOrders: this.messageAll,
            storageId: this.storageId
          })
        };
        this._post('com.edb01.erp.ass.service.api.QuickReturnStorageService/' + this.version + '/saveQuickReturnStorage',data).then(function (res) {
          this.closeFullScreen();
          if(res.data.success) {

            if(this.initType == 2 || this.initType == 3) {

              this.$message({
                message: '入库成功！',
                type: 'success'
              });

              //初始化页面数据
              this.initType = 1;
              this.orderNum = '';
              this.messageAll = [];
            }else {
              this.initType = 2;
              this.initReturnStorage();
            }

          }else {
            if(res.data.code == 8500001) {
              this.$confirm(res.data.msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              }).then(() => {
                this.initType = 3;
                this.initReturnStorage();
              }).catch(() => {});
            }else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }

          }
        }.bind(this))
      },

      //选择仓库弹窗确定
      storageClick: function () {

        if(this.storageId == '') {
          this.$message({
            message: '请选择退货入库仓库!',
            type: 'warning'
          });
        } else {
          this.dialogVisible = false;

          //根据仓库id匹配仓库名称
          this.optionsStock.forEach(function (val) {
            if(val.value == this.storageId) {
              this.storageName = val.label
            }
          }.bind(this));
        }
      },

      //快递单号/平台单号
      orderNumEnter: function () {
        this.goodsIsBatchAll = true;
        if(this.orderNum == '') {
          this.$message({
            message: '快递单号/平台单号不能为空！',
            type: 'warning'
          })
        }else {
          this.initMessage()
        }
      },

      //条形码扫描
      barCodeEnter: function () {
        let arrStatus = [];
        this.isMarkList = [];
        let arr = [];
        if(this.barCodeMsg == '') {
          this.$message({
            message: '条形码不能为空！',
            type: 'warning'
          })
        }else if(this.barCodeMsg == 'edbzp') {
          this.goodsRadio = 'edbzp';
          this.barCodeMsg = ''
        }else if(this.barCodeMsg == 'edbcp') {
          this.goodsRadio = 'edbcp';
          this.barCodeMsg = ''
        }else {
          this.messageAll.forEach((item1) => {
            item1.datails.forEach((item2) => {

              //判断是否找到
              if(item2.goodsBarCode == this.barCodeMsg || item2.goodsSpareBarCode.includes(this.barCodeMsg)) {
                arr.push(true);
              }else {
                item2.suits.forEach((item3) => {
                  if(item3.goodsBarCode == this.barCodeMsg || item3.goodsSpareBarCode.includes(this.barCodeMsg)) {
                    arr.push(true);
                  }else {
                    arr.push(false);
                  }
                })
              }

              if((item2.goodsBarCode == this.barCodeMsg || item2.goodsSpareBarCode.includes(this.barCodeMsg)) && item2.realReturnQty != item2.applyReturnQty) {

                this.isMarkList.push(true);
                if(item2.suitFlag) {

                  //套装扫描
                  if(this.goodsRadio == 'edbzp') {

                    //套装正品
                    item2.suits.forEach((item3) => {
                      for(let i in this.messageTo) {
                        if(i == item1.afterSalesId) {
                          for(let j in this.messageTo[i]) {
                            if(j == item2.goodsId) {
                              for(let k in this.messageTo[i][j]) {
                                if(k == item3.goodsId) {

                                  if((item3.realReturnQty - item3.applyReturnQty) > (- this.messageTo[i][j][k])) {
                                    arrStatus.push(false);
                                  }else {
                                    arrStatus.push(true)
                                  }

                                  if(arrStatus.includes(false) || item2.realReturnQty >= item2.applyReturnQty) {}
                                  else {

                                    //套单首行禁用
                                    if(item2.isDisabledNum == false) {
                                      item3.batchs[0].isDisabled = true;
                                    }

                                    //套单自动加数量
                                    item3.batchs[0].normalQty = Number(item3.batchs[0].normalQty) + this.messageTo[i][j][k];
                                    item3.realReturnQty = Number(item3.realReturnQty) + this.messageTo[i][j][k];
                                    if(item2.isDisabledNum == false) {

                                      //禁用套单输入框
                                      item3.isDisabledNum = true
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    });
                    if(item2.isDisabledNum == false) {
                      if(arrStatus.includes(false) || item2.realReturnQty >= item2.applyReturnQty) {
                        this.$message({
                          message: '实退数量不能大于申请退货数量！',
                          type: 'warning'
                        })
                      }else {

                        //套装扫描加数量
                        item2.suitNormalQty ++;
                        item2.realReturnQty ++;
                      }
                    }else {
                      if(arrStatus.includes(false)) {
                        this.$message({
                          message: '实退数量不能大于申请退货数量！',
                          type: 'warning'
                        })
                      }
                    }

                    this.barCodeMsg = ''

                  }else if(this.goodsRadio == 'edbcp') {

                    //套装次品
                    item2.suits.forEach((item3) => {
                      for(let i in this.messageTo) {
                        if(i == item1.afterSalesId) {
                          for(let j in this.messageTo[i]) {
                            if(j == item2.goodsId) {
                              for(let k in this.messageTo[i][j]) {
                                if(k == item3.goodsId) {
                                  if((item3.realReturnQty - item3.applyReturnQty) > (- this.messageTo[i][j][k])) {
                                    arrStatus.push(false);
                                  }else {
                                    arrStatus.push(true)
                                  }

                                  if(arrStatus.includes(false) || item2.realReturnQty >= item2.applyReturnQty) {}
                                  else {

                                    //套单首行禁用
                                    item3.batchs[0].isDisabled = true;

                                    //套单自动加数量
                                    item3.batchs[0].inferionQty = Number(item3.batchs[0].inferionQty) + this.messageTo[i][j][k];
                                    item3.realReturnQty = Number(item3.realReturnQty) + this.messageTo[i][j][k];

                                    //禁用套单输入框
                                    item3.isDisabledNum = true
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    });
                    if(arrStatus.includes(false) || item2.realReturnQty >= item2.applyReturnQty) {
                      this.$message({
                        message: '实退数量不能大于申请退货数量！',
                        type: 'warning'
                      })
                    }else {

                      //套装扫描加数量
                      item2.suitInferionQty ++;
                      item2.realReturnQty ++;

                    }
                    this.barCodeMsg = '';
                  }

                }else {

                  //单品扫描
                  if(this.goodsRadio == 'edbzp') {

                    if(item2.realReturnQty >= item2.applyReturnQty) {
                      this.$message({
                        message: '实退数量不能大于申请退货数量！',
                        type: 'warning'
                      })
                    }else {
                      item2.batchs[0].normalQty ++;
                      item2.realReturnQty ++;
                    }
                    this.barCodeMsg = ''
                  }else if(this.goodsRadio == 'edbcp') {
                    if(item2.realReturnQty >= item2.applyReturnQty) {
                      this.$message({
                        message: '实退数量不能大于申请退货数量！',
                        type: 'warning'
                      })
                    }else {
                      item2.batchs[0].inferionQty ++;
                      item2.realReturnQty ++;
                    }

                    this.barCodeMsg = ''
                  }
                }
              }else {

                //套单扫描
                item2.suits.forEach((item3) => {
                  if((item3.goodsBarCode == this.barCodeMsg || item3.goodsSpareBarCode.includes(this.barCodeMsg)) && item3.realReturnQty != item3.applyReturnQty) {
                    this.isMarkList.push(true);
                    if(this.goodsRadio == 'edbzp') {
                      if(item3.realReturnQty >= item3.applyReturnQty) {
                        this.$message({
                          message: '实退数量不能大于申请退货数量！',
                          type: 'warning'
                        })
                      }else {
                        item2.isDisabledNum = true;
                        this.messageAll.forEach((val1) => {
                          val1.datails.forEach((val2) => {
                            val2.suits.forEach((val3) => {
                              val3.isDisabledNum = false;
                            })
                          })
                        });

                        //套单首行不禁用
                        item3.batchs[0].isDisabled = false;
                        item2.suitNormalQty = null;
                        item2.suitInferionQty = null;
                        item3.batchs[0].normalQty ++;
                        item3.realReturnQty ++;
                      }

                      this.barCodeMsg = ''
                    }else if(this.goodsRadio == 'edbcp') {
                      if(item3.realReturnQty >= item3.applyReturnQty) {
                        this.$message({
                          message: '实退数量不能大于申请退货数量！',
                          type: 'warning'
                        })
                      }else {
                        item2.isDisabledNum = true;
                        this.messageAll.forEach((val1) => {
                          val1.datails.forEach((val2) => {
                            val2.suits.forEach((val3) => {
                              val3.isDisabledNum = false
                            })
                          })
                        });

                        //套单首行不禁用
                        item3.batchs[0].isDisabled = false;
                        item2.suitNormalQty = null;
                        item2.suitInferionQty = null;
                        item3.batchs[0].inferionQty ++;
                        item3.realReturnQty ++;
                      }

                      this.barCodeMsg = ''
                    }
                  }else {
                    this.isMarkList.push(false);
                  }
                })
              }
            })
          });

          if(this.isMarkList.includes(true)) {
            this.soundY();
          }else {
            if(arr.includes(true)) {
              this.$message({
                message: '实退数量不能大于申请退货数量！',
                type: 'warning'
              })
            }else {
              this.soundN()
            }
          }
        }
      },

      /**修改批次
       * @param allIndex messageAll数据行
       * @param index 表格行
       * @param row 表格行数据
       * @param suitType 是否套装
       * @param currentData 商品行数据
       * @param num 批次行
       */
      handleEdit: function (allIndex,index,row,suitType,currentData,num) {
        this.tableDataBatch = [];
        this.suitType = suitType;
        this.currentEditMsg = currentData;
        this.initBatch = num;
        this.allNum = allIndex;
        this.goodsRow = index;
        this.batchDialogVisible1 = true;
        this.initSelectBatchsList(row)
      },

      //批次修改弹框选择
      handleCurrentChange1: function (val) {
        this.currentRow1 = val
      },

      //批次修改确认
      choseBatchOk1: function () {
        if(this.currentRow1 == null) {
          this.$message({
            message: '请选择退货入库批次',
            type: 'warning'
          })
        }else {

          let item2 = this.messageAll[this.allNum].datails[this.goodsRow];
          if(!this.suitType) {
            if(item2.goodsId == this.currentEditMsg.goodsId) {
              item2.batchs[this.initBatch].batchNo = this.currentRow1.batchNo;
              item2.batchs[this.initBatch].produceTime = this.currentRow1.produceTime
            }

          }else {
            item2.suits.forEach((item3) => {
              if(item3.goodsId == this.currentEditMsg.goodsId) {
                item3.batchs[this.initBatch].batchNo = this.currentRow1.batchNo;
                item3.batchs[this.initBatch].produceTime = this.currentRow1.produceTime
              }

            })
          }

          this.batchDialogVisible1 = false;
        }
      },

      /**添加批次
       * @param num messageAll数据行
       * @param tableIndex 表格行
       * @param index 商品行
       * @param row 商品行数据
       * @param suitType 正次品Boolean
       */
      handleAdd: function (tableIndex,num,index,row,suitType) {
        this.tableDataBatch = [];
        this.suitType = suitType;
        this.currentMsg = row;
        this.initRow = num;
        this.goodsRow = index;
        this.tableIndex = tableIndex;
        this.batchDialogVisible2 = true;

        this.initSelectBatchsList(row)
      },

      //批次添加弹框选择
      handleSelectionChange2: function (val) {
        this.multipleSelection2 = val
      },

      //批次添加确认
      choseBatchOk2: function () {
        if(this.multipleSelection2.length == 0) {
          this.$message({
            message: '请选择退货入库批次',
            type: 'warning'
          })
        }else {
          let creatMultipleSelection2 = this.multipleSelection2.slice(1);
          let item2 = this.messageAll[this.initRow].datails[this.tableIndex];

          if(!this.suitType) {

            if(item2.goodsId == this.currentMsg.goodsId) {

              //自动填写套单首行批次号
              if(item2.batchs[0].batchNo == '') {
                item2.batchs[0].batchNo = this.multipleSelection2[0].batchNo;
                item2.batchs[0].produceTime = this.multipleSelection2[0].produceTime
              }else {
                creatMultipleSelection2 = this.multipleSelection2
              }

              //添加批次行
              if(creatMultipleSelection2.length != 0) {
                creatMultipleSelection2.forEach(function (val) {
                  item2.batchs.push({batchNo: val.batchNo,produceTime: val.produceTime,inferionQty: '',normalQty: ''});
                }.bind(this));
              }

            }
          }else {

            item2.suits.forEach((item3,index3) => {
              if(item3.goodsId == this.currentMsg.goodsId) {

                //自动填写套单首行批次号
                if(item3.batchs[0].batchNo == '') {
                  item3.batchs[0].batchNo = this.multipleSelection2[0].batchNo;
                  item3.batchs[0].produceTime = this.multipleSelection2[0].produceTime
                }else {
                  creatMultipleSelection2 = this.multipleSelection2
                }

                //添加批次行
                if(creatMultipleSelection2.length != 0) {
                  creatMultipleSelection2.forEach(function (val) {
                    item3.batchs.push({batchNo: val.batchNo,produceTime: val.produceTime,inferionQty: '',normalQty: ''})
                  }.bind(this));
                }
              }
            })
          }
          this.batchDialogVisible2 = false;
        }

      },

      //批次查询
      choseSearch: function () {
        this.initSelectBatchsList(this.currentMsg)
      },

      //删除批次行
      handleDelete: function (index,row,num) {
        let numAll = Number(row.batchs[num].normalQty) + Number(row.batchs[num].inferionQty);
        row.realReturnQty = row.realReturnQty - numAll;
        row.batchs.splice(num,1);

      },

      //改变前正次品数量
      focusNum: function (val) {
        this.initNum = val
      },

      /**修改正次品数量
       * @param index messageAll数据行
       * @param row 行数据
       * @param num 当前正次品数量
       * @param type 正次品Boolean
       * @param mark 是否套装Boolean
       * @param bathParams 波次集合index
       * @param rowData 套装行数据
       */
      changeNum: function (tableIndex,index,row,num,type,mark,bathParams,rowData) {
        let val2 = this.messageAll[index].datails[tableIndex];

        //套装正次品直接修改
        if(type) {

          //正品修改
          if(val2.goodsId == row.goodsId) {

            //套装、单品修改
            if((val2.realReturnQty - val2.applyReturnQty) <= (this.initNum - num)) {
              if(mark) {
                let arrStatus = [];

                //套装
                val2.suits.forEach((val3) => {
                  for(let i in this.messageTo) {
                    if(i == this.messageAll[index].afterSalesId) {
                      for(let j in this.messageTo[i]) {
                        if(j == val2.goodsId) {
                          for(let k in this.messageTo[i][j]) {
                            if(k == val3.goodsId) {
                              if((val3.realReturnQty - val3.applyReturnQty) > (- this.messageTo[i][j][k])*(num - this.initNum)) {
                                arrStatus.push(false);
                              }else {
                                arrStatus.push(true)
                              }

                              if(arrStatus.includes(false)) {}
                              else {

                                //禁用删除按钮
                                val3.batchs[0].isDisabled = true;

                                //套单自动加数量
                                val3.batchs[0].normalQty = Number(val3.batchs[0].normalQty) + this.messageTo[i][j][k]*(num - this.initNum);
                                val3.realReturnQty = Number(val3.realReturnQty) + this.messageTo[i][j][k]*(num - this.initNum);
                                if(val3.batchs[0].normalQty == 0) {
                                  val3.batchs[0].normalQty = ''
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }

                });
                if(arrStatus.includes(false)) {
                  this.$message({
                    message: '实退数量不能大于申请退货数量！',
                    type: 'warning'
                  })
                }
                else {

                  //套装数量修改
                  if(val2.suitFlag) {
                    val2.realReturnQty = val2.realReturnQty - (this.initNum - num)
                  }
                }
              }else {

                //单品
                val2.realReturnQty = val2.realReturnQty - (this.initNum - num)

              }

            }else {
              if(mark) {

                //套装
                row.suitNormalQty = this.initNum;
              }else {

                //单品
                row.batchs[bathParams].normalQty = this.initNum
              }
              this.$message({
                message: '实退数量不能大于申请退货数量！',
                type: 'warning'
              })
            }
          }else {

            if(mark) {

              //套单修改
              val2.suits.forEach((val3) => {
                if(val3.goodsId == row.goodsId && rowData.goodsId == val2.goodsId) {
                  if((val3.realReturnQty - val3.applyReturnQty) <= (this.initNum - num)) {
                    val3.realReturnQty = val3.realReturnQty - (this.initNum - num)
                  }else {
                    row.batchs[bathParams].normalQty = this.initNum;
                    this.$message({
                      message: '实退数量不能大于申请退货数量！',
                      type: 'warning'
                    })
                  }
                }
              })
            }
          }
        }else {

          //次品修改
          if(val2.goodsId == row.goodsId) {

            //套装、单品修改
            if((val2.realReturnQty - val2.applyReturnQty) <= (this.initNum - num)) {
              if(mark) {
                let arrStatus = [];

                //套装
                val2.suits.forEach((val3) => {
                  for(let i in this.messageTo) {
                    if(i == this.messageAll[index].afterSalesId) {
                      for(let j in this.messageTo[i]) {
                        if(j == val2.goodsId) {
                          for(let k in this.messageTo[i][j]) {
                            if(k == val3.goodsId) {
                              if((val3.realReturnQty - val3.applyReturnQty) > (- this.messageTo[i][j][k])*(num - this.initNum)) {
                                arrStatus.push(false);
                              }else {
                                arrStatus.push(true)
                              }

                              if(arrStatus.includes(false)) {}
                              else {

                                //禁用删除按钮
                                val3.batchs[0].isDisabled = true;

                                //套单自动加数量
                                val3.batchs[0].inferionQty = Number(val3.batchs[0].inferionQty) + this.messageTo[i][j][k]*(num - this.initNum);
                                val3.realReturnQty = Number(val3.realReturnQty) + this.messageTo[i][j][k]*(num - this.initNum);
                                if(val3.batchs[0].inferionQty == 0) {
                                  val3.batchs[0].inferionQty = ''
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }

                });
                if(arrStatus.includes(false)) {
                  this.$message({
                    message: '实退数量不能大于申请退货数量！',
                    type: 'warning'
                  })
                }
                else {

                  //套装数量修改
                  if(val2.suitFlag) {
                    val2.realReturnQty = val2.realReturnQty - (this.initNum - num)
                  }
                }
              }else {

                //单品
                val2.realReturnQty = val2.realReturnQty - (this.initNum - num)
              }

            }else {
              if(mark) {

                //套装
                row.suitInferionQty = this.initNum;
              }else {

                //单品
                row.batchs[bathParams].inferionQty = this.initNum
              }
              this.$message({
                message: '实退数量不能大于申请退货数量！',
                type: 'warning'
              })
            }
          }else {

            if(mark) {

              //套单修改
              val2.suits.forEach((val3) => {
                if(val3.goodsId == row.goodsId && rowData.goodsId == val2.goodsId) {
                  if((val3.realReturnQty - val3.applyReturnQty) <= (this.initNum - num)) {
                    val3.realReturnQty = val3.realReturnQty - (this.initNum - num)
                  }else {
                    row.batchs[bathParams].inferionQty = this.initNum;
                    this.$message({
                      message: '实退数量不能大于申请退货数量！',
                      type: 'warning'
                    })
                  }
                }
              })
            }
          }
        }

        //是否开启已禁用的输入框
        let arr = [];
        let brr = [];

        //套装正次品是否为空
        if (rowData) {
          if ((rowData.suitNormalQty == '' || rowData.suitNormalQty == null) && (rowData.suitInferionQty == '' || rowData.suitInferionQty == null)) {
            arr.push(true)
          }else {
            arr.push(false)
          }

          //套单正次品是否为空
          rowData.suits.forEach((item1) => {
            item1.batchs.forEach((item2) => {
              if(item2.inferionQty == '' && item2.normalQty == '') {
                brr.push(true)
              }else {
                brr.push(false)
              }
            });
          });

          if(arr.includes(false) && brr.includes(false)) {

            //禁用套单
            rowData.suits.forEach((suitsVal1) => {
              suitsVal1.isDisabledNum = true
            });
            rowData.isDisabledNum = false;
          }
          else if(arr.includes(false) == false && brr.includes(false) == true) {

            //禁用套装
            rowData.isDisabledNum = true
          }
          else {

            //放开套装/套单禁用
            rowData.suits.forEach((suitsVal1) => {
              suitsVal1.isDisabledNum = false
            });
            rowData.isDisabledNum = false
          }
        }
      },

      //批次列表分页
      getPageSize: function (val) {
        if(val != undefined) {

          //变换每页数量刷新数据
          this.pageSize = val;
          this.initSelectBatchsList(this.currentMsg)

        }
      },
      getCurPage: function (val) {
        if(val != undefined) {

          //变换当前页刷新数据
          this.curPage = val;
          this.initSelectBatchsList(this.currentMsg)
        }
      },

      //收货入库
      intoStorage: function () {
        let arr = [];//实退
        let brr = [];//正次品
        this.messageAll.forEach((item1) => {
          item1.datails.forEach((item2) => {

            //判断实退数量
            if(item2.realReturnQty == 0) {
              arr.push(true)
            }else {
              arr.push(false)
            }

            //判断套装正次品数量
            if(item2.suitInferionQty == 0 && item2.suitNormalQty == 0) {
              brr.push(true)
            }else {
              brr.push(false)
            }

            //判断单品正次品数量
            item2.batchs.forEach((item5) => {
              if(item5.inferionQty == 0 && item5.normalQty == 0) {
                brr.push(true)
              }else {
                brr.push(false)
              }
            });

            //判断套装实退数量
            item2.suits.forEach((item3) => {
              if(item3.realReturnQty == 0) {
                arr.push(true)
              }else {
                arr.push(false)
              }

              //判断套单正次品数量
              item3.batchs.forEach((item4) => {
                if(item4.inferionQty == 0 && item4.normalQty == 0) {
                  brr.push(true)
                }else {
                  brr.push(false)
                }
              })
            })
          })
        });

        if(arr.includes(false)) {
          if(brr.includes(false)) {
            this.initReturnStorage()
          }else {
            this.$message({
              message: '请填写入库数量！',
              type: 'warning'
            })
          }

        }else {
          if(this.messageAll != '') {

            this.$message({
              message: '实退数量不能为0！',
              type: 'warning'
            })
          }else {
            this.$message({
              message: '请先回车加载退货信息！',
              type: 'warning'
            })
          }
        }

      },

      //异常音接口
      audioN: function () {
        let str = `<audio src="http://centaur-files.oss-cn-zhangjiakou.aliyuncs.com/20180807/DAAA5D8F44B249199EDF79F36E3FD3A3.wav" autoplay></audio>`;
        $('#audio').append(str)
      },

      //正常音接口
      audioY: function () {
        let str = `<audio src="http://centaur-files.oss-cn-zhangjiakou.aliyuncs.com/20180807/8804D017D3EF4B8AB85E80863842F98F.wav" autoplay></audio>`;
        $('#audio').append(str)
      },

      //清除提示音
      clearAudio: function () {
        $('#audio').empty()
      },

      //播放异常音
      soundN: function () {
        this.clearAudio();
        this.audioN()
      },

      //播放正常音
      soundY: function () {
        this.clearAudio();
        this.audioY()
      },
    }
  }
</script>
<style scoped>
  #quickSalesReturn{
    background: transparent;
    color: #4A4A4A;
    height: 100%;
    padding: 0!important;
  }
  .pageLeft{
    padding:20px 10px;
    height: 100%;
    width: 278px;
    background: white;
    float: left;
  }
  .pageRight{
    padding:20px 0;
    margin-left: 298px;
  }
  .leftLabel,.rightLabel{
    border-left: 4px solid #409EFF;
    font-weight: bold;
    padding-left: 10px;
    font-size: 16px;
  }
  .leftLabel label{
    font-weight: bold;
    font-size: 16px;
  }
  .leftBtn{
    width: auto!important;
    height: 30px;
    margin-left: 25px;
    margin-top: 50px;
  }
  .afterStyle{
    margin-bottom: 10px;
  }
  .afterStyle div{
    display: inline-block;
    margin-right: 20px;
    font-weight: bold;
  }
  .elInput{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .orderStyle{
    background: white;
    margin-top: 10px;
    padding: 10px 20px;
    width: 100%;
  }
  .batchStyle{
    line-height: 16px!important;
    display: inline-block;
    vertical-align: middle;
    font-weight: bold;
  }
  .styleH{
    height: 30px;
  }
  .lineHStyle{
    line-height: 50px!important;
  }
  .numStyle{
    padding-left: 60px;
  }
  .spanStyle{
    padding-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
</style>
<style>
  #quickSalesReturn .el-button span{
    font-size: 14px!important;
  }
  #quickSalesReturn .el-textarea .el-textarea__inner {
    height: 50px!important;
  }
  #quickSalesReturn .el-table_1_column_1.is-center{
    padding-top: 30px!important;
  }
  #quickSalesReturn .el-table__row td:last-child{
    vertical-align: top;
  }

  /*批次弹框*/
  #dialogBox1 .el-dialog__body,#dialogBox2 .el-dialog__body {
    padding: 35px 30px !important;
  }
  #quickSalesReturn .el-pager li:hover {
    color: #409EFF!important;
    background-color: transparent!important;
  }
  #afterTable .el-table td, .el-table th.is-leaf{
    border-bottom: 1px dashed #ebeef5!important;
  }
  #afterTable .el-table--border::after, .el-table--group::after, .el-table::before {
    background-color: transparent!important;
  }
</style>

