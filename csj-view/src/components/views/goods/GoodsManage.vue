<template>
  <div style='padding-bottom:0px !important;height:100%;'>
    <div v-if="paramsObj.mainPageShow">
      <div class="input-box">
        <el-row style="">
          <el-col :span="5">
            <div><label for="">商家编码：</label><el-input size='small' v-model="paramData.goodsCode" @keyup.enter.native="queryBtn"></el-input></div>
          </el-col>
          <el-col :span="5">
            <div><label for="">商品名称：</label><el-input size='small' v-model="paramData.goodsName" @keyup.enter.native="queryBtn"></el-input></div>
          </el-col>
          <el-col :span="5">
            <div class='s-date'>
              <label for="" style="margin-right:1px;">来源：</label>
              <el-select size='small' clearable v-model="paramData.sourceType" placeholder="请选择">
                <el-option
                  v-for="(item,i) in sourceTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="5">
            <div class='s-date'>
              <label for="" style="margin-right:1px;">来源店铺：</label>
              <el-select size='small' filterable clearable v-model="paramData.sourceStore" placeholder="请选择">
                <el-option
                  v-for="item in sourceStoreList"
                  :key="item.storeId"
                  :label="item.storeName"
                  :value="item.storeName">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4" style="">
            <el-button type="primary" size="small" @click='queryBtn'>查 询</el-button>
            <el-button size="small" @click='resetBtn' style="background:#E4E4E4;">重 置</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top:15px;">
          <el-col :span="5">
            <div><label for="">修改人：</label><el-input size='small' v-model="paramData.updater" @keyup.enter.native="queryBtn"></el-input></div>
          </el-col>
          <el-col :span="5">
            <div><label for="">备注：</label><el-input size='small' v-model="paramData.remark" @keyup.enter.native="queryBtn"></el-input></div>
          </el-col>
        </el-row>
      </div>
      <div class="release-nav">
        <ul>
          <li>
            <el-dropdown trigger="click" @command="addBaby">
					      <span class="el-dropdown-link" style='color:#fff;'>
					        新增宝贝<i class="el-icon-arrow-down el-icon--right"></i>
					      </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command='a'>新增</el-dropdown-item>
                <el-dropdown-item command='b'>导入</el-dropdown-item>
                <el-dropdown-item command='c'>平台下载</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <li @click="releaseBtn">发布任务</li>
          <li @click="limitDetection">极限词检测</li>
          <li @click="batchDelete">删除</li>
          <li @click="exportOut">导出</li>
          <li @click="batchEditBtn">批量修改</li>
          <li @click="logoBtn">操作日志</li>
        </ul>
      </div>
      <div class="border">
        <el-table
          border
          id='fitTable'
          :height="table_h"
          :data="tableData"
          @select="handleSelect"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align='center'
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align='center'
            label="序号"
            type="index"
            width="55">
          </el-table-column>
          <el-table-column
            label="操作"
            align='center'
            width="110">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="text"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsCode"
            align='center'
            :show-overflow-tooltip='true'
            label="商家编码"
            min-width="">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align='left'
            :show-overflow-tooltip='true'
            min-width=''
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="salesPrice"
            label="售价（元）"
            width='100'
            align='right'>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            :show-overflow-tooltip='true'
            width='250'
            align='left'>
          </el-table-column>
          <el-table-column
            prop="price"
            align='center'
            label="来源"
            width="100">
            <template slot-scope="scope">
              {{sourceTypeObj[scope.row.sourceType]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            align='center'
            label="来源店铺"
            width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.sourceType==2">{{scope.row.storeName}}</span>
              <span v-else>——</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            align='center'
            label="最近修改时间"
            width="">
          </el-table-column>
          <el-table-column
            prop="creater"
            align='center'
            label="修改人"
            width="">
          </el-table-column>
        </el-table>
      </div>
      <div style='float:right;margin-top:5px;'>
        <el-pagination
          style='float:left;'
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
        <i class='el-icon-refresh refresh' @click='refresh'></i>
      </div>
      <!-- 查看日志 -->
      <el-dialog title="查看日志" :visible.sync="logoDialog" width="850px" :close-on-click-modal="false">
        <div class="input-box">
          <label for="">操作时间：</label>
          <el-date-picker
            size="small"
            style="width:350px;"
            v-model="timeArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format='yyyy-MM-dd HH:mm:ss'
            @keyup.enter.native="logoQueryBtn"
            value-format="timestamp">
          </el-date-picker>
          <label for="" style="margin-left:10px;">操作人：</label>
          <el-input size='small' style="width:120px !important;" v-model="logoParamData.creater" @keyup.enter.native="logoQueryBtn"></el-input>
          <el-button size="small" type="primary" style="width:80px;margin:1px 15px 0 15px;" @click="logoQueryBtn">查询</el-button>
        </div>
        <el-table
          border
          height="430"
          :data="publicLogData"
          style="margin-top:15px;"
        >
          <el-table-column
            type="index"
            align='center'
            label="序号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="typeDesc"
            align='center'
            label="操作类型"
            width="">
          </el-table-column>
          <el-table-column
            prop="operatingInfo"
            align='left'
            label="操作描述"
            :show-overflow-tooltip='true'
            width="">
          </el-table-column>
          <el-table-column
            prop="creater"
            align='center'
            label="操作人"
            width="">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align='center'
            min-width=''
            label="操作时间">
            <template slot-scope="scope">
              {{scope.row.createTime | turnTimestamp}}
            </template>
          </el-table-column>
          <el-table-column
            prop="ipAddress"
            label="IP"
            min-width=''
            align='center'
            width="">
          </el-table-column>
        </el-table>
        <div style="float:right;margin-top:10px;">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="currentPage1"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="totalPage1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum1">
          </el-pagination>
        </div>
        <div style="clear:both;"></div>
      </el-dialog>
      <!-- 导入 -->
      <el-dialog title="导入" :close-on-click-modal="false" :visible.sync="exportDialog" width="440px"  v-loading="loading" element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading">
        <div>
          <label for="">下载模板：</label> <a :href="`http://${uploadUrl}.com/files-web/download/108917`" style="color:#409eff;cursor:pointer;">点击这里下载模板</a>
        </div>
        <div style="margin:20px 0 ;">
          <label for="">导入模板：</label><el-input type="text" size="small" v-model="exportParam.name" disabled style="width:190px;" placeholder="最多支持导入1000条"></el-input>
          <el-upload
            style="display:inline-block;"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange1"
            :show-file-list="false"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">打开</el-button>
          </el-upload>
        </div>
        <el-button type="primary" size="small" style="margin-left:120px;width:100px;" @click="exportBtn">导入</el-button>
      </el-dialog>
      <!-- 导入成功 -->
      <el-dialog title="导入结果" :close-on-click-modal="false" :visible.sync="exportSeccess" width="360px">
        <p style="text-align:center;">导入成功{{exportForm.successNum}}条，失败{{exportForm.failNum}}条。</p>
        <div style="margin-top:20px;text-align:center;">
          <el-button type="primary" size="small" style="" @click="exportSeccess = false">确定</el-button>
          <el-button size="small" v-if="exportForm.failNum!=0" @click="errExport">导出失败列表</el-button>
        </div>
      </el-dialog>
      <!-- 平台下载 -->
      <el-dialog class="downloadDialog" :close-on-click-modal="false" title="平台下载" :visible.sync="downloadDialog" width="485px" v-loading="loading" element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading">
        <div class="template">
          <label for="">来源平台：</label>
          <el-select size='small' v-model="downloadForm.channel" placeholder="请选择" @change="channelChange">
            <el-option label="天猫" value="1"></el-option>
            <el-option label="京东" value="2"></el-option>
            <el-option label="淘宝" value="3"></el-option>
            <el-option label="拼多多" value="4"></el-option>
          </el-select>
        </div>
        <div class="template">
          <label for="">平台店铺：</label>
          <el-select size='small' filterable v-model="downloadForm.storeId" placeholder="请选择">
            <el-option
              v-for="item in storeList"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId">
            </el-option>
          </el-select>
        </div>
        <div class="template">
          <label for="">选择下载宝贝：</label>
          <el-input type="text" size='small' @keyup.native="downloadForm.numIds = downloadForm.numIds.replace(/[，]/ig,'')" style="width:215px;" v-model="downloadForm.numIds" placeholder="商品ID，多个用英文逗号隔开"></el-input>
        </div>
        <div class="template">
          <label for="">下载模板：</label> <a :href="`http://${uploadUrl}.com/files-web/download/106568`" style="color:#409eff;cursor:pointer;">点击这里下载模板</a>
        </div>
        <div class="template">
          <label for="">导入模板：</label><el-input type="text" size="small" disabled style="width:215px;margin-left:5px;" v-model="fileName"></el-input>
          <el-upload
            style="display:inline-block;"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange2"
            :show-file-list="false"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">打开</el-button>
          </el-upload>
        </div>
        <el-button type="primary" size="small" style="margin-left:150px;width:100px;" @click="downLoadBtn">下载</el-button>
      </el-dialog>
      <!-- 批量修改 -->
      <el-dialog title="批量修改" :close-on-click-modal="false" :visible.sync="batchEditDialog" width="460px">
        <div class="batchEdit">
          <span @click="batchEdits('a')">商品名称</span>
          <span @click="batchEdits('b')">卖点</span>
          <span @click="batchEdits('c')">售价</span>
          <span @click="batchEdits('d')">市场价</span>
          <span @click="batchEdits('e')">库存</span>
          <span @click="batchEdits('f')">发货地</span>
        </div>
        <p style="margin-top:15px;">平台-京东</p>
        <div class="batchEdit">
          <span @click="batchEdits('g')">市场价</span>
          <span @click="batchEdits('h')">售价</span>
        </div>
        <p style="margin-top:15px;">平台-天猫</p>
        <div class="batchEdit">
          <p style="margin-left:10px;">无</p>
        </div>
        <!--<p style="margin-top:15px;">平台-拼多多</p>
         <div class="batchEdit">
           <span>团购价</span>
           <span>单买价</span>
         </div>-->
      </el-dialog>
      <!-- 批量修改名称 -->
      <el-dialog :title="`批量修改${titleName}`" :close-on-click-modal="false" :visible.sync="editDialog1" width="740px">
        <div>
          <div style="margin: 10px 0;"></div>
          <el-radio-group v-model="selectTitle" @change="changeTitle()">
            <div style='margin-bottom:18px;'>
              <el-radio label="title1">
                <span>使用新内容：</span>
                <el-input :disabled='newDis' type='text' @blur="regular(12)" v-model='titleForm.newWord'
                          placeholder='请输入新内容' style="width:187px;"
                          size='small'></el-input>
              </el-radio>
            </div>
            <div style='margin-bottom:25px;'>
              <el-radio label="title2">
                <span style='display:inline-block;width:84px;'>增加前缀：</span>
                <el-input :disabled='prePostDis' type='text' v-model='titleForm.prefix' style='width:187px !important;'
                          placeholder='请输入前缀内容' size='small'></el-input>
                <span style='margin-left:10px;'>增加后缀：</span>
                <el-input :disabled='prePostDis' type='text' v-model='titleForm.postfix' style='width:187px !important;'
                          placeholder='请输入后缀内容' size='small'></el-input>
              </el-radio>
            </div>
            <div>
              <el-radio label="title3">
                <div class='add-radio' v-for='(item,index) in addForm'>
                  <span>标题关键字：</span>
                  <el-input :disabled='keyReplaceDis' v-model='item.KeyWords' placeholder='请输入关键字'
                            style='width:187px !important;' type='text' size='small'></el-input>
                  <span style='margin-left:24px;'>替换为：</span>
                  <el-input :disabled='keyReplaceDis' v-model='item.replaceWords' placeholder='请输入内容'
                            style='width:187px !important;' type='text' size='small'></el-input>
                  <span class='add-r' v-if='index!=4' @click='addBtn'>+</span><span class="reduce-r" v-if='index!=0'
                                                                                    @click='reduceBtn(index)'>-</span>
                </div>
              </el-radio>
            </div>
          </el-radio-group>
          <p style='margin:5px 0 25px 112px;color:red;'>备注：若内容长度超过允许范围，自动跳过不修改</p>
          <div>
            <el-button size='small' type='primary' style='margin:0 100px 0 150px;'
                       @click='editorIsBtn'>确认修改
            </el-button>
            <el-button size='small' @click='emptyBtn'>清空重置</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 批量修改价格 -->
      <el-dialog :title="`批量修改${titlePrice}`" :close-on-click-modal="false" :visible.sync="editDialog2" width="740px">
        <div class="priceDialog">
          <div style="margin: 10px 0;"></div>
          <el-radio-group style="margin-bottom:0;" v-model="priceAll.way" :change="changeLabel()">
            <div style="margin-bottom: 20px;">
              <el-radio label="1">
                <span>使用新价格：</span>
                <el-input size='small' type='text' :disabled="ableOne" @blur="regular(1)" v-model="priceAll.newPrice" style="width:205px;"
                          placeholder="请输入新价格"></el-input><!--onkeyup="value=value.replace(/[^\d]/g,'') "-->
              </el-radio>
            </div>
            <div>
              <el-radio label="2">
                <span>使用公式：</span>
                <span class="add">(</span>
                <el-select size='small' v-model="priceAll.operatePrice" placeholder="请选择" style="width: 90px;"
                           :disabled="able">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <i class="el-icon-close"></i>
                <el-input size='small' type='text' :disabled="able" v-model="priceAll.percentBef"
                          @blur="regular(2)"
                          style="width: 55px !important;"></el-input>
                <span>%&nbsp;&nbsp;&nbsp;</span><i class="el-icon-plus"></i>
                <el-input size='small' type='text' :disabled="able" v-model="priceAll.numOne"
                          @blur="regular(3)"
                          style="width: 55px !important;"></el-input>
                <i class="el-icon-minus"></i>
                <el-input size='small' type='text' :disabled="able" v-model="priceAll.numSec"
                          @blur="regular(4)"
                          style="width: 55px !important;"></el-input>
                <span class="add">）</span>
                <i class="el-icon-close"></i>
                <el-input size='small' type='text' :disabled="able" v-model="priceAll.percentAft"
                          @blur="regular(5)"
                          style="width: 55px !important;"></el-input>
                <span>%</span>
              </el-radio>
            </div>
          </el-radio-group>
          <div style="margin-bottom:20px;">
            <div style="margin-top: 20px;padding-left: 100px;">
              <span>价格取整：</span>
              <el-radio-group v-model="priceAll.integerWay" :change="changeInt()">
                <el-radio :label="1">四舍五入</el-radio>
                <el-radio :label="2">向上取整</el-radio>
                <el-radio :label="3">向下取整</el-radio>
              </el-radio-group>
              <div style="margin:15px 0 20px 73px;">
                <span>尾款金额： 0.</span>
                <el-input size='small' type='text' @blur="regular(11)" v-model="priceAll.mantissa"
                          :disabled="mantissa" style="width:60px !important;"></el-input>
                <span style="color: #FF9932;margin-left:10px;">价格取整小数点后显示的数字</span>
              </div>
            </div>
            <div style="margin: 25px 0 0 5px;">
              <el-checkbox-group v-model="priceAll.checkBoxStatus" :change="changeBox()">
                <span style="font-size:14px;">价格限制：</span>
                <div style="margin-top: -26px;">
                  <div class="checkbox-div">
                    <el-checkbox label="one"><span>新价格不能低于</span>
                      <el-input size='small' v-model="priceAll.minPrice" style="width: 60px !important;"
                                @blur="regular(6)"
                                :disabled="checkIn"></el-input>
                      <span>元</span></el-checkbox>
                  </div>
                  <div class="checkbox-div">
                    <el-checkbox label="sec"><span>新价格不能低于原价格的</span>
                      <el-input size='small' v-model="priceAll.minPercent" style="width: 60px !important;"
                                @blur="regular(7)"
                                :disabled="checkInput"></el-input>
                      <span>%</span></el-checkbox>
                  </div>
                </div>
              </el-checkbox-group>
              <div class="checkbox-div" style="color: #FF9932">备注：若新价格低于价格限制或者小于0，直接跳过宝贝不修改</div>
            </div>
          </div>
          <div style="width: 100%;bottom: 45px;left: 0;padding-left: 180px;">
            <el-button size='small' type="primary" @click="enterT()">确认修改</el-button>
            <el-button size='small' style="margin-left: 100px;" @click="empty()">清空重置</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 批量修改库存 -->
      <el-dialog title="批量修改库存" :close-on-click-modal="false" :visible.sync="editDialog3" width="600px">
        <div>
          <div style="margin: 10px 0;"></div>
          <el-radio-group v-model="storeAll.way" :change="storeStatus()">
            <div style="margin-bottom: 30px;">
              <el-radio label="1">
                <span>使用新库存：</span>
                <el-input size='small' type='text' placeholder="请输入新库存" @blur="regular(8)" v-model="storeAll.replaceNum"
                          :disabled="radio" style="width:230px;"></el-input>
              </el-radio>
            </div>
            <div>
              <el-radio label="2">
                <span>使用公式：</span>
                <span>当前库存</span>
                <i class="el-icon-plus"></i>
                <el-input size='small' type='text' style="width: 80px !important;" @blur="regular(9)"
                          v-model="storeAll.numOne"
                          :disabled="radio1"></el-input>
                <i class="el-icon-minus"></i>
                <el-input size='small' type='text' style="width: 80px !important;" @blur="regular(10)"
                          v-model="storeAll.numSec"
                          :disabled="radio1"></el-input>
              </el-radio>
            </div>
          </el-radio-group>
          <div style="width: 100%;text-align:center;margin-top:30px;">
            <el-button size='small' type="primary" @click="amendStore()">确认修改</el-button>
            <el-button size='small' style="margin-left: 100px;" @click="emptyStore()">清空重置</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 批量修改发货地 -->
      <el-dialog title="批量修改发货地" :close-on-click-modal="false" :visible.sync="editDialog4" width="600px">
        <div>
          <div style="margin: 10px 0;"></div>
          <span>新发货地：</span>
          <el-select style='width:160px;' v-model="delivery.prov" size='small' placeholder="选择省"
                     @change='provinceChange'>
            <el-option
              v-for="item in provinceData"
              :key="item.districtId"
              :label="item.districtName"
              :value="item.districtId">
            </el-option>
          </el-select>
          <el-select style='width:160px;' v-model="delivery.city" size='small' placeholder="选择市">
            <el-option
              v-for="item in cityData"
              :key="item.districtId"
              :label="item.districtName"
              :value="item.districtId">
            </el-option>
          </el-select>
          <div style="width: 100%;text-align:center;margin-top:30px;">
            <el-button size='small' type="primary" @click="deliveryBtn">确认修改</el-button>
            <el-button size='small' style="margin-left: 100px;" @click="emptyDeliveryBtn">清空重置</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 发布弹框 -->
      <el-dialog title="发布店铺" :close-on-click-modal="false" :visible.sync="isPublish" width="750px" v-loading="loading" element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading">
        <div class="col-left" style="padding:0;">
          <p>选择要发布店铺：</p>
          <div>
            <label for=""><span>*</span>平台：</label>
            <el-select size='small' v-model="releaseObj.platFormType" placeholder="请选择" @change="platFormChange">
              <el-option label="天猫" value="1"></el-option>
              <el-option label="京东" value="2"></el-option>
              <el-option label="淘宝" value="3"></el-option>
              <el-option label="拼多多" value="4"></el-option>
            </el-select>
          </div>
          <div>
            <label for=""><span>*</span>店铺：</label>
            <el-select size='small' filterable v-model="releaseObj.storeId" placeholder="请选择" @change="shopChange">
              <el-option
                v-for="item in storeData"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId">
              </el-option>
            </el-select>
          </div>
          <div>
            <label for=""><span></span>店内分类：</label>
            <!--<el-select size='small' v-model="releaseObj.cid" placeholder="请选择">
              <el-option
                v-for="item in cidInfo"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>-->
            <el-input class="container_search" :title="releaseObj.catelogoName" type="text" v-model="releaseObj.catelogoName" disabled size="small" style="width:180px !important;">
              <template slot="append">
                <div style="width:100%;height: 100%;" @click="addCatelog"><i class="el-icon-more"></i></div>
              </template>
            </el-input>
          </div>
          <div>
            <label for=""><span>*</span>运费模块：</label>
            <el-select size='small' v-model="releaseObj.freightTempId" placeholder="请选择">
              <el-option
                v-for="item in templateData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="rel-button">
            <el-button type="primary" size="small" @click="addShopBtn">确定选中</el-button>
          </div>
        </div>
        <div class="col-right" style="padding: 0 0 0 40px;">
          <p>已选择发布店铺：</p>
          <div class="shop-box"><!--:key="i"-->
            <div v-for="(item,i) in shopData"><!-- -->
              <el-tooltip class="item" effect="dark" :content="`店内分类：${item.catelogoName}；运费模块：${item.templateName}`" placement="top-start">
                <div style="display:inline-block;">{{channelObj[item.platFormType]}}：{{item.storeName}}</div>
              </el-tooltip>
              <span class="close" @click="delStore(i)">&times;</span>，
            </div>
          </div>
          <div class="rel-button">
            <el-button size="small"  @click="isPublish = false">取消</el-button>
            <el-button type="primary" size="small" @click='publishShop'>发布</el-button>
          </div>
        </div>
        <div style="clear:both;"></div>
      </el-dialog>
      <!-- 类目树弹框 -->
      <el-dialog title="请选择店内分类" :close-on-click-modal="false" :visible.sync="cateLogDialog" width="600px">
        <el-tree
          :data="cidInfo"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <el-button type="primary" size="small" style="margin:20px 0 0 200px;width:100px;" @click="catelogSave">确定</el-button>
      </el-dialog>
    </div>
    <goods-add v-else :params="paramsObj" @changeShow="changeShow"></goods-add>
  </div>
</template>

<script>
  import { priceValidator,turnTimestamp2,positiveIntegerValidator,positiveIntegerZero } from '@/assets/js/validate';
  import GoodsAdd from '@/components/views/goods/children/GoodsAdd.vue';

  export default {
    components: {
      GoodsAdd
    },
    data () {
      return {
        uploadUrl:process.env.IMG_UPLOAD,
        sourceStoreList:[],
        paramsObj:{
          mainPageShow:true,
        },
        /*改标题*/
        loading:false,
        selectTitle: 'title1',
        newDis: false,
        titleForm: {
          newWord: '',
          prefix: '',
          postfix: ''
        },
        prePostDis: true,
        addForm: [
          {
            KeyWords: '',
            replaceWords: ''
          }
        ],
        keyReplaceDis: true,
        titleName:'名称',
        editDialog1:false,
        editDialog2:false,
        editDialog3:false,
        editDialog4:false,

        /*改价格*/
        //改价格提交的参数
        priceAll: {//改价格提交的参数
          tsGoodsIds: '',// 图书ID字符串集合“,”分隔
          way: '1',//(Integer)：选择的替换方式（1：使用新价格；2：使用公式
          newPrice: '',//(BigDecimal)：方式 1 的新价格
          operatePrice: '1',//(Integer)：方式 2 的下拉框选择的基准价格（1：原价格；2：定价）
          percentBef: '100',//(Integer)：方式 2 中，前面的百分比
          percentAft: '100',//(Integer)：方式 2 中，后面的百分比
          numOne: '0',//(Integer)：方式 2 中，加号后面的数字
          numSec: '0',//(Integer)：方式 2 中，减号后面的数字
          integerWay: 1,//(Integer)：方式 2 中取整方式（1：四舍五入；2：向上取整；3：向下取整；4：保留指定尾数）
          mantissa: '',//(Integer)：保留的尾数
          checkBoxStatus: [],//(String)：复选框的组合选择状态（one：只选择了第一个；sec：只选择了第二个；both：两个全选）
          minPrice: '',//(BigDecimal)：最低价格下限
          minPercent: '',//(BigDecimal)：最低百分比
        },
        ableOne: true,//新价格input输入框
        able: true,//使用公式的input输入框
        options: [
          {
            value: '1',
            label: '销售价'
          },
          {
            value: '2',
            label: '定价'
          }
        ],
        checkIn: true,//价格限制input1
        checkInput: true,//价格限制input2
        titlePrice:'售价',

        //批量改库存
        storeAll: {
          tsGoodsIds: '',//(String)： 图书ID字符串集合“,”分隔
          way: '1',//(Integer)：选择的替换方式（1：使用新库存；2：使用公式）
          replaceNum: '',//(Integer)：方式 1 的新库存
          numOne: '',//(Integer)：方式 2 加号后数字
          numSec: '',//(Integer)：方式 2 减号后数字
        },
        radio: true,//单选按钮的input框的状态
        radio1: true,//单选按钮的input框的状态
        delivery: {
          prov: '',
          city: ''
        },
        provinceData: [],
        cityData: [],
        deliveryShow: false,

        sourceTypeObj:{
          '1':'录入',
          '2':'下载',
          '3':'导入'
        },
        sourceTypeList:[
          {
            label:'全部',
            value:''
          },
          {
            label:'录入',
            value:'1'
          },
          {
            label:'下载',
            value:'2'
          },
          {
            label:'导入',
            value:'3'
          },
        ],
        publicLogData:[],
        currentPage1:1,
        totalPage1:10,
        totalNum1:0,
        timeArr:[],
        logoParamData:{},
        exportDialog:false,
        downloadDialog:false,
        batchEditDialog:false,
        version:'1.0.0',
        totalNum:0,
        totalPage:20,
        currentPage:1,
        tableData:[],
        paramData:{
          page:1,
          size:20,
          sourceType:'',
          sourceStore:''
        },
        selectionData:[],
        materialType:[],
        table_h:0,
        logoDialog:false,
        exportParam:{
          name:'',
          raw:''
        },
        exportSeccess:false,
        exportForm:{
          successNum:0,
          failNum:0
        },
        tsGoodsIds:[],
        downloadForm:{
          channel:'1',
        },
        fileName:'',
        storeList:[],
        //重构发布店铺
        cateLogDialog:false,
        cidInfo:[],
        defaultProps: {
          children: 'childCatalogs',
          label: 'name'
        },
        catelogName:'',
        releaseObj:{
          storeId:'',
          freightTempId:'',
          cid:'',
          platFormType:''
        },
        templateData:[],
        shopData:[],
        storeData:[],
        cidInfo:[],
        isPublish:false,
        channelObj:{
          '1':'天猫',
          '2':'京东',
          '3':'淘宝'
        },
      }
    },methods:{
      channelPlat(){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/getMerchantList",{
          platformType:''
        }).then((response)=>{
          if (response.data.success) {
            response.data.result.unshift({
              storeName:'全部',
              storeId:'全部'
            })
            this.sourceStoreList = response.data.result;
            this.paramData.sourceStore = '全部';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      addCatelog(){
        if(this.releaseObj.storeId == ''){
          this.$message({
            message: '请选择店铺！',
            type: 'warning'
          });
          return false;
        }
        this.cateLogDialog = true;
        if(this.$refs.tree)this.$refs.tree.setCheckedKeys(this.releaseObj.cid.split(','));
      },
      catelogSave(){
        if(this.$refs.tree.getCheckedKeys(true).length == 0){
          this.$message({
            message: '请选择店内分类！',
            type: 'warning'
          });
          return false;
        }
        if(this.$refs.tree.getCheckedKeys(true).length > 10){
          this.$message({
            message: '店内分类最多可选择10个！',
            type: 'warning'
          });
          return false;
        }
        var catelogName = [];
        this.$refs.tree.getCheckedNodes(true).forEach((item,i)=>{
          catelogName.push(item.name);
        })
        this.releaseObj.catelogoName = catelogName.join('，');
        this.releaseObj.cid = this.$refs.tree.getCheckedKeys(true).join(',');
        this.cateLogDialog = false;
      },
      //发布弹出框
      releaseBtn(){
        if (this.selectionData.length == 0) {
          this.$message({
            message: '请选择要发布的数据！',
            type: 'warning'
          });
        } else {
          this.isPublish = true;
          this.shopData = [];
          this.storeData = [];
          this.templateData=[];
          this.cidInfo = [];
          this.releaseObj={
            storeId:'',
            freightTempId:'',
            cid:'',
            platFormType:'',
            catelogoName:''
          }
          /*this.$axios({
            method: 'post',
            url:'api/tmall/item/isProduct?tmallBookIds=' + str.slice(0, -1)
          })
            .then(function (response) {
              if (response.data.code == 0) {

              } else {
                self.$message({
                  message: '商品[' + response.data.message + ']未挂靠，请挂靠后重新尝试！',
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });*/
        }
      },
      //平台选择
      platFormChange(){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/getMerchantList",{
          platformType:this.releaseObj.platFormType
        }).then((response)=>{
          if (response.data.success) {
            this.storeData = response.data.result;
            this.releaseObj.storeId = '';
            this.releaseObj.freightTempId = '';
            this.releaseObj.cid = '';
            this.releaseObj.catelogoName = '';
            this.cidInfo = [];
            this.templateData = [];
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //渲染二级菜单
      shopChange(){
        let storeToken = '',nick = '';
        this.storeData.forEach(item =>{
          if(item.storeId == this.releaseObj.storeId){
            storeToken = item.storeToken;
            nick = item.nick;
          }
        })
        this.releaseObj.freightTempId = '';
        this.releaseObj.cid = '';
        this.releaseObj.catelogoName = '';
        this.cidInfo = [];
        this.templateData = [];
        //店内分类
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.PublishTaskCenterService/" + this.version+ "/getStoreCataLog",{
          storeToken,
          nick,
          platFormType:this.releaseObj.platFormType
        }).then((response)=>{
          if (response.data.success) {
            this.cidInfo = response.data.result;
            this.releaseObj.cid = '';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
        //运费模板
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.PublishTaskCenterService/" + this.version+ "/getStoreDelivTemp",{
          storeToken,
          nick,
          platFormType:this.releaseObj.platFormType
        }).then((response)=>{
          if (response.data.success) {
            this.templateData = response.data.result;
            this.releaseObj.freightTempId = '';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //确定选中
      addShopBtn(){
        if(this.releaseObj.platFormType==''){
          this.$message({
            message: '请选择平台！',
            type: 'warning'
          });
          return false;
        }else if(this.releaseObj.storeId==''){
          this.$message({
            message: '请选择店铺！',
            type: 'warning'
          });
          return false;
        }/*else if(this.releaseObj.cid==''){
          this.$message({
            message: '请选择店内分类！',
            type: 'warning'
          });
          return false;
        }*/else if(this.releaseObj.freightTempId==''){
          this.$message({
            message: '请选择运费模块',
            type: 'warning'
          });
          return false;
        }
        //平台
        this.storeData.forEach((item,i)=>{
          if(item.storeId==this.releaseObj.storeId){
            this.releaseObj.storeName=item.storeName;
          }
        })
        //模板
        this.templateData.forEach((item,i)=>{
          if(item.id==this.releaseObj.freightTempId){
            this.releaseObj.templateName=item.name;
          }
        })
        /*//店内分类
        this.cidInfo.forEach((item,i)=>{
          if(item.id == this.releaseObj.cid){
            this.releaseObj.catelogoName = item.name;
          }
        })*/
        //店铺
        var isPass=true;
        this.shopData.forEach((item,i)=>{
          if(item.storeId == this.releaseObj.storeId){
            isPass=false;
          }
        })
        if(isPass){
          this.shopData.push(JSON.parse(JSON.stringify(this.releaseObj)));
        }else{
          this.$message({
            message: '此店铺已选中，请先删除后再重新选择',
            type: 'warning'
          });
        }
      },
      //删除选中
      delStore(i){
        this.shopData.splice(i,1);
      },
      //发布
      publishShop() {
        if (this.shopData.length == 0) {
          this.$message({
            message: '请选择发布店铺',
            type: 'warning'
          });
          return false;
        }
        let tsGoodsIds = [];
        this.selectionData.forEach(item => {
          tsGoodsIds.push(item.tsGoodsId);
        })
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.publish.service.PublishTaskCenterService/" + this.version+ "/publishGoods",{
          tsGoodsIds:tsGoodsIds.join(','),
          publishInfoJson:JSON.stringify(this.shopData)
        }).then((response)=>{
          this.loading = false;
          if (response.data.success) {
            this.$message({
              message:response.data.msg,
              type: "success"
            });
            this.isPublish = false;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },

      changeShow(param){
        if(param && param.isRefresh){
          this.initRenderTable();
        }
        this.paramsObj.mainPageShow = true;
      },
      regular(num) {
        let self = this;
        switch (num) {
          case  1:
            if (self.priceAll.newPrice == 0) {
              self.priceAll.newPrice = '';
            }
            self.priceAll.newPrice = priceValidator(self.priceAll.newPrice);
            break;
          case  2:
            if (self.priceAll.percentBef <= 0) {
              self.priceAll.percentBef = '';
            } else if (self.priceAll.percentBef.indexOf('.') > -1) {
              self.priceAll.percentBef = self.priceAll.percentBef.slice(0, self.priceAll.percentBef.indexOf('.'));
            } else {
              self.priceAll.percentBef = priceValidator(self.priceAll.percentBef);
            }
            break;
          case  3:
            if (self.priceAll.numOne < 0) {
              self.priceAll.numOne = '';
            }
            self.priceAll.numOne = priceValidator(self.priceAll.numOne);
            break;
          case  4:
            if (self.priceAll.numSec < 0) {
              self.priceAll.numSec = '';
            }
            self.priceAll.numSec = priceValidator(self.priceAll.numSec);
            break;
          case  5:
            if (self.priceAll.percentAft <= 0 || self.priceAll.percentAft.indexOf('.') > -1) {
              self.priceAll.percentAft = '';
            } else {
              self.priceAll.percentAft = priceValidator(self.priceAll.percentAft);
            }
            break;
          case  6:
            self.priceAll.minPrice = priceValidator(self.priceAll.minPrice);
            break;
          case  7:
            if (self.priceAll.minPercent <= 0 || self.priceAll.minPercent.indexOf('.') > -1) {
              self.priceAll.minPercent = '';
            } else {
              self.priceAll.minPercent = priceValidator(self.priceAll.minPercent);
            }
            break;
          case  11:
            if (isNaN(self.priceAll.mantissa) || self.priceAll.mantissa.indexOf('.') > -1 || self.priceAll.mantissa == '' || self.priceAll.mantissa == undefined || self.priceAll.mantissa <= 0) {
              self.priceAll.mantissa = '';
            } else if (self.priceAll.mantissa.length == 1) {
              self.priceAll.mantissa += 0;
            } else if (self.priceAll.mantissa.length > 2) {
              self.priceAll.mantissa = self.priceAll.mantissa.slice(0, 2);
            }
            break;
          case  8:
            self.storeAll.replaceNum = positiveIntegerZero(self.storeAll.replaceNum);
            break;
          case  9:
            self.storeAll.numOne = positiveIntegerZero(self.storeAll.numOne);
            break;
          case  10:
            self.storeAll.numSec = positiveIntegerZero(self.storeAll.numSec);
            break;
        }
      },                           /*------  改标题 ------*/
      changeTitle() {
        this.addForm = [
          {
            KeyWords: '',
            replaceWords: ''
          }
        ];
        this.titleForm = {
          newWord: '',
          prefix: '',
          postfix: ''
        };
        if (this.selectTitle == 'title1') {
          this.keyReplaceDis = true;
          this.newDis = false;
          this.prePostDis = true;
        } else if (this.selectTitle == 'title2') {
          this.keyReplaceDis = true;
          this.newDis = true;
          this.prePostDis = false;
        } else {
          this.keyReplaceDis = false;
          this.newDis = true;
          this.prePostDis = true;
        }
      },
      addBtn() {
        var arrItem = {
          KeyWords: '',
          replaceWords: ''
        };
        if (this.addForm.length < 5) {
          this.addForm.push(arrItem);
        }

      },
      reduceBtn(index) {
        this.addForm.splice(index, 1)
      },
      changeTitle() {
        this.addForm = [
          {
            KeyWords: '',
            replaceWords: ''
          }
        ];
        this.titleForm = {
          newWord: '',
          prefix: '',
          postfix: ''
        };
        if (this.selectTitle == 'title1') {
          this.keyReplaceDis = true;
          this.newDis = false;
          this.prePostDis = true;
        } else if (this.selectTitle == 'title2') {
          this.keyReplaceDis = true;
          this.newDis = true;
          this.prePostDis = false;
        } else {
          this.keyReplaceDis = false;
          this.newDis = true;
          this.prePostDis = true;
        }
      },
      //确认修改标题卖点
      editorIsBtn() {
        if (this.selectTitle == 'title1') {
          if (this.titleForm.newWord == '' || this.titleForm.newWord == undefined) {
            this.$message({
              message: '请输入新内容',
              type: 'warning'
            });
            return false;
          } else {
            if (this.titleName == '名称') {
              if (this.titleForm.newWord.length > 60) {
                this.$message({
                  message: '标题内容长度不能超过60个字符',
                  type: 'warning'
                });
                return false;
              }
            } else {
              if (this.titleForm.newWord.length > 20) {
                this.$message({
                  message: '卖点内容长度不能超过20个字符',
                  type: 'warning'
                });
                return false;
              }
            }
          }
        } else if (this.selectTitle == 'title2') {
          if ((this.titleForm.prefix == '' || this.titleForm.prefix == undefined) && (this.titleForm.postfix == '' || this.titleForm.postfix == undefined)) {
            this.$message({
              message: '前缀内容和后缀内容不能都为空',
              type: 'warning'
            });
            return false;
          }
        } else {
          var isPass = true,keyArr = [], replaceArr = [];
          this.addForm.forEach((item, index) => {
            keyArr.push(item.KeyWords);
            replaceArr.push(item.replaceWords);
          })
          keyArr.forEach((item, index) => {
            if (item == '') {
              this.$message({
                message: '标题关键字不能为空',
                type: 'warning'
              });
              isPass = false;
            }
          })
          replaceArr.forEach((item, index) => {
            if (item == '') {
              this.$message({
                message: '替换内容不能为空',
                type: 'warning'
              });
              isPass = false;
            }
          })
          if (!isPass) {
           return false;
          }
        }
        let params = JSON.parse(JSON.stringify(this.titleForm));
        let methodsName = this.titleName == '名称'?'updateGoodsName':'updateSalePoints';
        params.way = this.selectTitle.slice(5);
        params.keyValueBean = JSON.stringify(this.addForm);
        params.tsGoodsIds = this.tsGoodsIds.join(',');
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/"+methodsName,params).then((response)=>{
          if (response.data.success) {
            this.editDialog1 = false;
            this.batchEditDialog = false;
            this.$message({
              message: '修改成功'+response.data.result[1]+'条，失败0条，跳过'+response.data.result[0]+'条！',
              type: 'success'
            });
            this.initRenderTable();
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //清空
      emptyBtn() {
        this.addForm = [
          {
            KeyWords: '',
            replaceWords: ''
          }
        ];
        this.titleForm = {};
        this.keyReplaceDis = true;
        this.newDis = false;
        this.prePostDis = true;
        this.selectTitle = 'title1';
      },

      //改价格提交                                   /*------  改价格 ------*/
      enterT() {
        //使用新价格
        if (this.priceAll.way == 1) {
          if (this.priceAll.newPrice === '') {
            this.$message({
              message: '请输入新价格',
              type: 'warning'
            });
            return false;
          }
        }
        if (this.priceAll.way == 2) {
          if (this.priceAll.percentBef == '' || this.priceAll.numOne == '' || this.priceAll.numSec == '' || this.priceAll.percentAft == '') {
            this.$message({
              message: '请输入公式里的数据',
              type: 'warning'
            });
            return false;
          }
        }
        if (this.priceAll.way == 2 && this.priceAll.integerWay == '') {
          this.priceAll.integerWay = 1;
        }
        if (this.priceAll.checkBoxStatus.length === 2) {
          if (this.priceAll.minPrice == '') {
            this.$message({
              message: '请输入最低价格下限',
              type: 'warning'
            });
            return false;
          }
          if (this.priceAll.minPercent == '') {
            this.$message({
              message: '请输入最低百分比',
              type: 'warning'
            });
            return false;
          }
        } else {
          //复选框1
          if (this.priceAll.checkBoxStatus == 'one') {
            if (this.priceAll.minPrice == '') {
              this.$message({
                message: '请输入最低价格下限',
                type: 'warning'
              });
              return false;
            }
          }
          //复选框2
          if (this.priceAll.checkBoxStatus == 'sec') {
            if (this.priceAll.minPercent == '') {
              this.$message({
                message: '请输入最低百分比',
                type: 'warning'
              });
              return false;
            }
          }
        }
        let params = JSON.parse(JSON.stringify(this.priceAll)),methodsName = '',priceWay = 1;
        if(this.titlePrice == '售价' || this.titlePrice == '市场价'){
          methodsName = 'updatePrice';
        }else if(this.titlePrice == '京东售价' || this.titlePrice == '京东市场价'){
          methodsName = 'updateJDPrice';
        }
        if(this.titlePrice == '售价' || this.titlePrice == '京东售价'){
          priceWay = 1;
        }else if(this.titlePrice == '市场价' || this.titlePrice == '京东市场价'){
          priceWay = 2;
        }
        params.tsGoodsIds = this.tsGoodsIds.join(',');
        params.priceWay = priceWay;
        params.checkBoxStatus = this.priceAll.checkBoxStatus.length==2?'both':this.priceAll.checkBoxStatus.join(',');
        //请求
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/"+methodsName,params).then((response)=>{
          if (response.data.success) {
            this.editDialog2 = false;
            this.batchEditDialog = false;
            this.$message({
              message: '修改成功'+response.data.result[1]+'条，失败0条，跳过'+response.data.result[0]+'条！',
              type: 'success'
            });
            this.initRenderTable();
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //清空重置改价格
      empty() {
        this.priceAll.tsGoodsIds = '';// 图书ID字符串集合“,”分隔
        this.priceAll.way = '1';//(Integer)：选择的替换方式（1：使用新价格；2：使用公式）
        this.priceAll.newPrice = '';//(BigDecimal)：方式 1 的新价格
        this.priceAll.operatePrice = '1';//(Integer)：方式 2 的下拉框选择的基准价格（1：原价格；2：定价）
        this.priceAll.percentBef = '';//(Integer)：方式 2 中，前面的百分比
        this.priceAll.percentAft = '';//(Integer)：方式 2 中，后面的百分比
        this.priceAll.numOne = '';//(Integer)：方式 2 中，加号后面的数字
        this.priceAll.numSec = '';//(Integer)：方式 2 中，减号后面的数字
        this.priceAll.integerWay = '';//(Integer)：方式 2 中取整方式（1：四舍五入；2：向上取整；3：向下取整；4：保留指定尾数）
        this.priceAll.mantissa = '';//(Integer)：保留的尾数
        this.priceAll.checkBoxStatus = [];//(String)：复选框的组合选择状态（one：只选择了第一个；sec：只选择了第二个；both：两个全选）
        this.priceAll.minPrice = '';//(BigDecimal)：最低价格下限
        this.priceAll.minPercent = '';//(BigDecimal)：最低百分比
        this.priceAll.integerWay = 1;
      },
      //价格和公式的值改变时
      changeLabel() {
        //使用新价格
        if (this.priceAll.way == 1) {
          this.ableOne = false;
          this.mantissa = true;
          this.priceAll.mantissa = '';

          this.priceAll.operatePrice = '1';//(Integer)：方式 2 的下拉框选择的基准价格（1：原价格；2：定价）
          this.priceAll.percentBef = '100';//(Integer)：方式 2 中，前面的百分比
          this.priceAll.percentAft = '100';//(Integer)：方式 2 中，后面的百分比
          this.priceAll.numOne = '0';//(Integer)：方式 2 中，加号后面的数字
          this.priceAll.numSec = '0';
          this.able = true;
          this.priceAll.integerWay = 1;
        } else {
          //使用公式
          this.ableOne = true;
          this.priceAll.newPrice = '';

          this.mantissa = false;
          this.able = false;
        }
      },
      //价格取整的值改变时
      changeInt() {
        //console.log(this.priceAll.integerWay);
        //this.priceAll.integerWay = 2;
      },
      //价格限制改变时
      changeBox() {
        if (this.priceAll.checkBoxStatus.length === 2) {
          this.checkIn = false;
          this.checkInput = false;
        } else {
          //复选框1
          if (this.priceAll.checkBoxStatus == 'one') {
            this.checkIn = false;
          } else {
            this.priceAll.minPrice = ''
            this.checkIn = true;
          }
          //复选框2
          if (this.priceAll.checkBoxStatus == 'sec') {
            this.checkInput = false;
          } else {
            this.checkInput = true;
            this.priceAll.minPercent = ''

          }
        }

      },

      //批量修改库存的确认修改                        /*------  改库存 ------*/
      //批量改库存里的单选按钮状态改变时
      storeStatus() {
        if (this.storeAll.way == 1) {
          this.radio = false;
        } else {
          this.radio = true;
          this.storeAll.replaceNum = '';
        }
        if (this.storeAll.way == 2) {
          this.radio1 = false;
        } else {
          this.radio1 = true;
          this.storeAll.numOne = '0';//(Integer)：方式 2 加号后数字
          this.storeAll.numSec = '0';//(Integer)：方式 2 减号后数字
        }
      },
      amendStore() {
        //使用新价格
        if (this.storeAll.way == 1) {
          if (this.storeAll.replaceNum == '') {
            this.$message({
              message: '请输入新库存',
              type: 'warning'
            });

            return false;
          }
        }
        //使用新价格
        if (this.storeAll.way == 2) {
          if (this.storeAll.numOne === '' || this.storeAll.numSec === '') {
            this.$message({
              message: '请输入公式里的数据',
              type: 'warning'
            });
            return false;
          }
        }
        this.storeAll.tsGoodsIds = this.tsGoodsIds.join(',');
        //请求
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/updateInventory",this.storeAll).then((response)=>{
          if (response.data.success) {
            this.editDialog3 = false;
            this.batchEditDialog = false;
            this.$message({
              message: '修改成功'+response.data.result[1]+'条，失败0条，跳过'+response.data.result[0]+'条！',
              type: 'success'
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      //批量修改库存的清空重置
      emptyStore() {
        this.storeAll.tsGoodsIds = '';
        this.storeAll.way = '1';
        this.storeAll.replaceNum = '';//(Integer)：方式 1 的新库存
        this.storeAll.numOne = '0';//(Integer)：方式 2 加号后数字
        this.storeAll.numSec = '0';//(Integer)：方式 2 减号后数字
      },

      //新发货地省级菜单                              /*------  改发货地 ------*/
      provinceChange() {
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/selectAllCity",{
          districtId:this.delivery.prov
        }).then((response)=>{
          if(response.data.success){
            this.cityData = response.data.result;
            this.delivery.city = '';
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //修改发货地保存
      deliveryBtn() {
        if (this.delivery.city == '') {
          this.$message({
            message: '请选择发货地',
            type: 'warning'
          });
          return false;
        }
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/updateShipAddr",{
          tsGoodsIds:this.tsGoodsIds.join(','),
          addr:this.delivery.city
        }).then((response)=>{
          if (response.data.success) {
            this.editDialog4 = false;
            this.batchEditDialog = false;
            this.$message({
              message: '修改成功'+response.data.result[1]+'条，失败0条，跳过'+response.data.result[0]+'条！',
              type: 'success'
            });
            this.initRenderTable();
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      emptyDeliveryBtn(param) {
        this.delivery = {
          prov:'',
          city:''
        };
        this.cityData = [];
        if(param == 'empty'){
          this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/selectAllProvince").then((response)=>{
            if(response.data.success){
              this.provinceData = response.data.result;
            }else{
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
        }
      },

      //操作日志
      handleSizeChange1(val){
        this.totalPage1 = val;
        this.logoQueryBtn();
      },
      handleCurrentChange1(val){
        this.currentPage1 = val;
        this.logoQueryBtn();
      },
      logoQueryBtn(){
        this.logoParamData.page = this.currentPage1;
        this.logoParamData.size = this.totalPage1;
        this.logoParamData.startTime = this.timeArr && this.timeArr.length>0?this.timeArr[0]:'';
        this.logoParamData.endTime = this.timeArr && this.timeArr.length>0?this.timeArr[1]:'';
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/queryPageLogs",this.logoParamData).then((response)=>{
          if(response.data.success){
            this.publicLogData = response.data.result.rows;
            this.totalNum1 = response.data.result.total;
            this.logoDialog = true;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      logoBtn(){
        this.currentPage1 = 1;
        this.totalPage1 = 10;
        this.logoParamData.creater = '';
        this.formatTime();
        this.logoQueryBtn();
      },
      formatTime(){
        let y = new Date().getFullYear();
        let m = new Date().getMonth()-3;
        let d = new Date().getDate();
        let h = new Date().getHours();
        let M = new Date().getMinutes();
        let s = new Date().getSeconds();
        this.timeArr = [new Date(y,m,d,h,M,s).getTime(),new Date().getTime()];
      },
      //批量修改
      batchEditBtn(){
        if(this.isChecked('修改')){
          this.batchEditDialog = true;
        }
      },
      batchEdits(item){
        if(item == 'a'){
          //商品名称
          this.titleName = '名称';
          this.editDialog1 = true;
          this.emptyBtn();
        }else if(item == 'b'){
          //卖点
          this.titleName = '卖点';
          this.editDialog1 = true;
          this.emptyBtn();
        }else if(item == 'c'){
          //售价
          this.titlePrice = '售价';
          this.editDialog2 = true;
          this.empty();
        }else if(item == 'd'){
          //市场价
          this.titlePrice = '市场价';
          this.editDialog2 = true;
          this.empty();
        }else if(item == 'e'){
          //库存
          this.editDialog3 = true;
          this.emptyStore();
        }else if(item == 'f'){
          //发货地
          this.editDialog4 = true;
          this.emptyDeliveryBtn('empty');
        }else if(item == 'g'){
          //京东市场价
          this.titlePrice = '京东市场价';
          this.editDialog2 = true;
          this.empty();
        }else if(item == 'h'){
          //京东售价
          this.titlePrice = '京东售价';
          this.editDialog2 = true;
          this.empty();
        }
      },
      //极限词检测
      limitDetection(){
        if(this.selectionData.length == 0){
          this.$message({
            message: '请选择要检测的数据！',
            type: 'warning'
          });
          return false;
        }
        var tsGoodsId = '',reId = '';
        for (var i = 0; i < this.selectionData.length; i++) {
          tsGoodsId += this.selectionData[i].tsGoodsId + ',';
          reId += this.selectionData[i].tsGoodsId;
        }
        if (process.env.NODE_ENV == 'development') {
          this.$router.push({path: '/limitDetection/' + tsGoodsId.slice(0,-1)});
        } else {
          MainTab.createTab(reId, '检测结果', process.env.API_PAGE + 'limitDetection/' + tsGoodsId.slice(0, -1));
        }
      },
      //新增宝贝
      addBaby(item){
        if(item == 'a'){
          //新增
          /*this.paramsObj = {
              tsGoodsId:'fanhu',
              source:'goodsManage',
              mainPageShow:false
            }*/
          if (process.env.NODE_ENV == 'development') {
            this.$router.push({path:'/goodsAdd/fanhu/goodsManage'});
          } else {
            MainTab.createTab('goodsAdd', '新增商品', process.env.API_PAGE + 'goodsAdd/fanhu/goodsManage');
          }
        }else if(item == 'b'){
          //导入
          this.exportDialog = true;
          this.exportParam = {
            name:'',
            raw:''
          };
        }else{
          //平台下载
          this.downloadForm = {
            channel:'1',
            numIds:'',
            storeId:'',
            fileId:''
          }
          this.fileName = '';
          this.channelChange();
          this.downloadDialog = true;
        }
      },
      channelChange(){
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.GoodsTaskService/" + this.version+ "/getMerchantList",{
          platformType:this.downloadForm.channel
        }).then((response)=>{
          if (response.data.success) {
            this.storeList = response.data.result;
            this.downloadForm.storeId = '';
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      handleChange2(file, fileList) {
        if(file.name.indexOf("xls") < 0 && file.name.indexOf("xlsx") < 0){
          this.$message({
            message: '只支持excel文件上传(.xls、.xlsx)',
            type: 'warning'
          });
          return;
        }
        let data = new FormData();
        data.append("filedata", file.raw);
        this.$axios({
          method: "post",
          url: "http://"+this.uploadUrl+".com/files-web/upload",
          data
        })
          .then(response => {
            if (response.data) {
              this.fileName = file.name;
              this.downloadForm.fileId = response.data.resourcesId;
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
      },
      //下载
      downLoadBtn(){
        if(!this.downloadForm.storeId){
          this.$message({
            message: '请选择平台店铺！',
            type: 'warning'
          });
          return;
        }
        if(!this.downloadForm.numIds && !this.downloadForm.fileId){
          this.$message({
            message: '下载宝贝与导入模板不能同时为空！',
            type: 'warning'
          });
          return;
        }
        var params = JSON.parse(JSON.stringify(this.downloadForm));
        params.channel *= 1;
        this.storeList.forEach((item,i)=>{
          if(item.storeId == params.storeId){
            params.clToken = item.storeToken;
            params.merchantId = item.merchantId;
          }
        })
        this.loading = true;
        this._post(process.env.BASE_API + "com.edb01.csj.publish.service.GoodsDownLoadTaskCenterService/" + this.version+ "/downLoadGoodsCenterTask",{
          platformType:this.downloadForm.channel,
          downLoadInfoJson:JSON.stringify(params)
        }).then((response)=>{
          this.loading = false;
          if(response.data.success){
            this.downloadDialog = false;
            this.$message({
              message: response.data.msg,
              type: 'success'
            });
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      //导入
      handleChange1(file, fileList) {
        //this.fileList = file;
        if(file.name.indexOf("xls")>0 || file.name.indexOf("xlsx")>0){
          this.exportParam.name = file.name;
          this.exportParam.raw = file.raw;
        }else{
          this.$message({
            message: '只支持excel文件上传(.xls、.xlsx)',
            type: 'warning'
          });
        }
      },
      exportBtn(){
        //http://file.edb01.com/files-web/upload1 exportParam
        if(!this.exportParam.raw){
          this.$message({
            message: '请添加导入模板！',
            type: 'warning'
          });
          return false;
        }
        let formData = new FormData();
        formData.append('filedata', this.exportParam.raw)
        this.loading = true;
        this.$axios({
          method: 'post',
          url: 'http://'+this.uploadUrl+'.com/files-web/upload',
          data: formData
        }).then((response)=>{
          if(response.data.resourcesId){
            this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/importExcel",{
              fileId:response.data.resourcesId,
              fileName:this.exportParam.name
            }).then((response)=>{
              this.loading = false;
              if(response.data.success){
                if(response.data.result){
                  this.exportForm = response.data.result;
                  this.initRenderTable();
                }else{
                  this.exportForm = {
                    successNum:0,
                    failNum:0
                  };
                }
                this.exportSeccess = true;
                setTimeout(()=>{
                  this.exportDialog = false;
                })
              }else{
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            })
          }else{
            this.loading = false;
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });

      },
      errExport(){
        location.href = 'http://'+this.uploadUrl+'.com/files-web/download/'+this.exportForm.fileId;
      },
      //导出
      exportOut(){
        if(!this.isChecked('导出')){
         return false;
        }
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/exportExcel",{
          tsGoodsIds:this.tsGoodsIds.join(',')
        }).then((response)=>{
          if(response.data.success){
            this.$message({
              message: '正在导出中,请稍后！',
              type: 'success'
            });
            location.href = 'http://'+this.uploadUrl+'.com/files-web/download/'+response.data.result;
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        })
      },
      queryBtn(item){
        this.initRenderTable(item);
      },
      //重置
      resetBtn(){
        this.paramData = {
          goodsName:'',
          sourceStore:'全部',
          goodsCode:'',
          sourceType:'',
          updater:''
        }
      },
      handleSizeChange(val){
        this.totalPage = val;
        this.initRenderTable();
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.initRenderTable();
      },
      refresh(){
        this.initRenderTable();
      },
      //多选框
      handleSelectionChange(val){
        this.selectionData=val;
      },
      handleSelect(selection,row){
        console.log(selection, row);
      },
      //编辑
      handleEdit(index,row){
        /*this.paramsObj = {
          tsGoodsId:row.tsGoodsId,
          source:'goodsManage',
          mainPageShow:false
        }*/
        if (process.env.NODE_ENV == 'development') {
          this.$router.push({path:'/goodsAdd/'+row.tsGoodsId+'/goodsManage'});
        } else {
          MainTab.createTab(row.tsGoodsId + 'goodsAdd', '修改商品', process.env.API_PAGE + 'goodsAdd/'+row.tsGoodsId+'/goodsManage');
        }
      },
      //删除单条
      handleDelete(index,row){
        this.$confirm('确认要删除本条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/deleteGoodsById",{
            tsGoodsId: row.tsGoodsId
          }).then((response)=>{
            if (response.data.success) {
              this.$message({
                message: '删除成功！',
                type: "success"
              });
              this.initRenderTable();
            } else {
              this.$message({
                message: response.data.msg,
                type: "warning"
              });
            }
          })
        }).catch(() => {});
      },
      //删除多条
      batchDelete(){
        if(this.isChecked('删除')){
          this.$confirm('确认要删除这些数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/deleteGoodsByUpdate",{
              tsGoodsIds: this.tsGoodsIds.join(',')
            }).then((response)=>{
              if (response.data.success) {
                this.$message({
                  message: '删除成功！',
                  type: "success"
                });
                this.initRenderTable();
              } else {
                this.$message({
                  message: response.data.msg,
                  type: "warning"
                });
              }
            })
          }).catch(() => {});
        }
      },
      renderTableHeight() {
        this.$nextTick(function () {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        });
        window.onresize = () => {
          this.table_h=$(window).height()-$('#fitTable').offset().top-45;
        }
      },
      initRenderTable(item){
        this.currentPage = item?1:this.currentPage;
        this.paramData.page = this.currentPage;
        this.paramData.size = this.totalPage;
        var param = JSON.parse(JSON.stringify(this.paramData));
        param.sourceStore = this.paramData.sourceStore == '全部'?'':this.paramData.sourceStore;
        this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsGoodsService/" + this.version+ "/queryPageGoods",param).then((response)=>{
          if (response.data.success) {
            this.tableData = response.data.result.rows;
           /* this.tableData = this.tableData.sort((a,b)=>{
              return b.createTime - a.createTime;
            })*/
            this.tableData.forEach((item,i)=>{
              if(item.createTime)item.createTime = turnTimestamp2(item.createTime);
            })
            this.totalNum = response.data.result.total;
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      isChecked(param){
        if(this.selectionData.length == 0){
          this.$message({
            message: '请选择要'+param+'的数据！',
            type: 'warning'
          });
          return false;
        }else{
          this.tsGoodsIds = [];
          this.selectionData.forEach((item,i)=>{
            this.tsGoodsIds.push(item.tsGoodsId);
          })
          return true;
        }
      }
    },
    mounted(){
      //渲染表格高度
      this.renderTableHeight();
      this.initRenderTable();
      this.channelPlat();
      //console.log(this.api);
      //this.api.name = 'lianxujian';
    },
    created(){

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .input-box .el-input{
    width:60% !important;
  }
  .downloadDialog .template{
    margin-bottom:20px;
  }
  .downloadDialog .template>label{
    width:100px;
    text-align:right;
    display:inline-block;
  }
  .batchEdit{
    height:40px;
    line-height:40px;
    border-bottom:1px solid #ccc;
  }
  .batchEdit>span{
    color:#409EFF;
    cursor:pointer;
    margin:0 10px;
  }
  /*批量修改*/
  .add-radio {
    margin-top: 15px;
    margin-left: 25px;
  }

  .add-radio:first-child {
    margin-top: -25px;
  }

  .add-r, .reduce-r {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    color: #fff;
    margin-left: 8px;
    font-size: 20px;
  }

  .add-r {
    line-height: 20px;
    background: #409EFF;
  }

  .reduce-r {
    line-height: 17px;
    background: red;
    margin-top: 3px;
    float: right;
  }

  .add {
    font-size: 22px;
  }

  .checkbox-div {
    padding-left: 80px;
  }
  .priceDialog .el-checkbox {
    margin-bottom: 20px;
  }
  .priceDialog .el-checkbox {
    margin-bottom: 20px;
  }
</style>
