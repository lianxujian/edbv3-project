<!-- 快递  秋香-->
<template>
  <div id="express">
    <v-Publiclog @changShow="changDialogShow" :paramObj="paramObj" :pulicLogVisible="pulicLogVisible"></v-Publiclog>
    <div id="searchBox">
      <div class="leftBox1">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <label>快递名称：</label>
              <el-input id="name1" v-model="queryAll.expressName"  width="180px!important" placeholder="请输入内容" @keyup.enter.native="queryData()"></el-input>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <label for="example-post1">所属快递：</label>
              <select id="example-post1" name="multiselect[]" multiple="multiple" >
                <option  v-for="item in sysPressOption" :value="item.value">{{item.label}}</option>
              </select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="rightBox1">
        <el-button size="mini" type="primary" @click="queryData()">查 询</el-button>
      </div>
    </div>
    <div class="col-nav" style="margin:0 0 10px 0;">
      <ul>
        <li @click="dialogFormVisible = true;handleAdd()"  v-if = 'authorityCode.DATA_EXPRESS_ADD'><span>添加</span></li>
        <li @click="publicLogBtn" v-if = 'authorityCode.DATA_EXPRESS_LOG'><span>查看日志</span></li>
      </ul>
    </div>
    <el-table
      ref="box"
      id="fitTable"
      :height="table_h"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        label="序号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="expressName"
        label="快递">
      </el-table-column>
      <el-table-column
        align="center"
        label="启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @click.native="switchChange(scope.row)" v-if="authorityCode.DATA_EXPRESS_STATUS"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="expressCoName"
        label="所属快递">
      </el-table-column>
      <el-table-column
        align="center"
        prop="expressType"
        label="运单类型">
        <template slot-scope="scope">
          <span v-if="scope.row.expressType==1">电子面单类型</span>
          <span v-else>纸质面单类型</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button  @click="dialogFormVisiblex = true;updateClick(scope.row)" type="text" size="small" v-if= 'authorityCode.DATA_EXPRESS_UPDATE'>修改</el-button>
          <el-button  type="text" size="small" @click="electronic(scope.row)" v-if="scope.row.expressTypeName=='电子面单'">电子面单信息</el-button>
          <el-button  @click="deleteNew(scope.row)" type="text" size="small" style="color: red" v-if="authorityCode.DATA_EXPRESS_DEL">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="col-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 30, 50, 100,200]"
        :page-size="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>

    <!--添加快递-->
    <div class="header">
      <el-dialog v-dialogDrag
        class="addExpress"
        width="950px"
        title="添加快递"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="addData">
          <div style="white-space: nowrap; margin-bottom: 20px">
            <el-row :gutter="20" style="margin-top: -30px;">
              <el-col :span="12">
                <div class="grid-content1" >
                  <label class="paragraph"><span style="color: red">* &nbsp</span>快递名称 : </label>
                  <el-input v-model="addData.expressName" placeholder="请输入快递名称"   class="a"></el-input>
                </div>
                <div class="grid-content1">
                  <label class="paragraph"><span style="color: red">* &nbsp</span>运单类型 : </label>
                  <el-select v-model="addData.expressType"  placeholder="请选择运单类型"  class="a" @change="clickChang">
                    <el-option
                      v-for="item in expressOptions"
                      :key="item.expressType"
                      :label="item.expressTypeName"
                      :value="item.expressType">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content1" >
                  <label class="paragraph"><span style="color: red">* &nbsp</span>所属快递 :  </label>
                  <el-select v-model="addData.expressCoId"  placeholder="请选择" class="a" filterable  @change="clickChange()" >
                    <el-option
                      v-for="item in sysexPress"
                      :key="item.expressCoId"
                      :label="item.nameAndCode"
                      :value="item.expressCoId">
                    </el-option>
                  </el-select>
                </div>
                <div class="grid-content1"v-if="kit">
                  <label class="paragraph"><span style="color: red">* &nbsp</span>打印模板 : </label>
                  <el-select v-model="addData.pagePrintTmplId"  placeholder="请选择打印模板" class="a" >
                    <el-option
                      v-for="item in Templates"
                      :key="item.printTmplId"
                      :label="item.printTmplName"
                      :value="item.printTmplId">
                    </el-option>
                  </el-select>
                  <i class="el-icon-question"  title="快递单的打印模板。"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <!--使用菜鸟电子面单-->
          <el-collapse v-model="activeName"  >
            <div v-if="taobao">
              <el-collapse-item style="margin-bottom: 0px;" name="1">
                <template slot="title"  >
                  <div class="dog">
                    <el-checkbox @change="changeCheck(addData.cainiaoFlag)" style=";margin-left: 40px" v-model="addData.cainiaoFlag" >使用菜鸟电子面单</el-checkbox>
                  </div>
                </template>
                <div style="white-space: nowrap;" v-if="taobao">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="grid-content1">
                        <label class="paragraph"><span style="color: red">* &nbsp</span>淘系的授权店铺 : </label>
                        <el-select v-model="addData.tmallShopId"  placeholder="请选择店铺" class="a" >
                          <el-option
                            v-for="item in taobaoShopList"
                            :key="item.storeId"
                            :label="item.storeName"
                            :value="item.storeId">
                          </el-option>
                        </el-select>
                        <i class="el-icon-question"  title="开通当前快递电子面单的店铺,或者开通菜鸟云打印模板时、获取菜鸟云打印模板信息。"></i>
                      </div>
                      <div class="grid-content1" >
                        <label class="paragraph"><span style="color: red">* &nbsp</span>打印模板类型 : </label>
                        <el-select v-model="addData.cainiaoPrintTmplType"  placeholder="请选择打印模板类型" class="a"   @change="ChangeTemplateTypeid">
                          <el-option
                            v-for="item in templateType"
                            :key="item.printTmpType"
                            :label="item.templateTypeName"
                            :value="item.printTmpType"
                            :disabled="!addData.cainiaoFlag">
                          </el-option>
                        </el-select>
                      </div>
                    </el-col>
                    <el-col :span="10">
                      <div class="grid-content1" id="wrapper">
                        <label class="paragraph"><span style="color: red">* &nbsp</span>订单来源 : </label>
                        <!--  <el-select v-model="addData.cainiaoEcIds" multiple collapse-tags placeholder="请选择平台" class="a">
                            <el-option
                              v-for="item in platOne"
                              :key="item.ecName"
                              :label="item.ecName"
                              :value="item.ecId">
                            </el-option>
                          </el-select>-->
                        <select id="example-post" name="multiselect[]" multiple="multiple"  style="width: 180px!important;">
                          <option  v-for="item in platOne" :value="item.value">{{item.label}}</option>
                        </select>
                        <i class="el-icon-question" title="选中平台的订单，使用菜鸟电子面单。"></i>
                      </div>
                      <div class="grid-content1">
                        <label class="paragraph"><span style="color: red">* &nbsp</span>打印模板 : </label>
                        <el-select v-model="addData.cainiaoPrintTmplId"  placeholder="请选择打印模板" class="a" >
                          <el-option
                            v-for="item in taobTemplates"
                            :key="item.printTmplId"
                            :label="item.printTmplName"
                            :value="item.printTmplId">
                          </el-option>
                        </el-select>
                        <i class="el-icon-question" title="快递单的打印模板。可以使用软件中设计的打印模板，也可以使用菜鸟提供的打印模板。"></i>
                      </div>
                      <div class="newPlan">
                        <span  @click="acquire()"><a   target="_blank"  style="font-size: 16px;color: #3A9CDA">&nbsp;&nbsp;获取菜鸟打印模板</a></span>
                        <a   target="_blank" href="http://cloudprint.cainiao.com/print/templates.htm" style="font-size: 16px;color: #3A9CDA">&nbsp;&nbsp;编辑菜鸟模板</a>
                      </div>
                    </el-col>
                    <el-col>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse-item>
            </div>
            <!--使用京东第三方快递电子面单-->
            <div v-if="jdthree">
              <el-collapse-item  name="2">
                <template slot="title" >
                  <div class="dog">
                    <el-checkbox @change="changeCheckOne(addData.jdThrFlag)" style=";margin-left: 40px"  v-model="addData.jdThrFlag">使用京东第三方快递电子面单</el-checkbox>
                  </div>
                </template>
                <div style="white-space: nowrap;" v-if="jdthree">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="grid-content1">
                        <label class="paragraph"><span style="color: red">* &nbsp</span>京东的授权店铺 : </label>
                        <el-select v-model="addData.jdThrShopId"  placeholder="请选择店铺"  class="a">
                          <el-option
                            v-for="item in jdrShopList"
                            :key="item.storeId"
                            :label="item.storeName"
                            :value="item.storeId">
                          </el-option>
                        </el-select>
                        <i class="el-icon-question" title="开通当前快递电子面单的店铺。"></i>
                      </div>
                      <div class="grid-content1">
                        <label class="paragraph"><span style="color: red">* &nbsp</span>快件种类 : </label>
                        <el-select v-model="addData.jdExpressType"  placeholder="请选择" class="a">
                          <el-option
                            v-for="item in jdTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content1">
                        <label class="paragraph"><span style="color: red">* &nbsp</span>订单来源 : </label>
                        <el-select v-model="addData.ecId"  placeholder="请选择平台" class="a">
                          <el-option
                            v-for="item in platTwo"
                            :key="item.ecId"
                            :label="item.ecName"
                            :value="item.ecId"
                            :disabled="!addData.jdThrFlag">
                          </el-option>
                        </el-select>
                        <i class="el-icon-question"title="选中平台的订单，使用京东第三方快递电子面单。"></i>
                      </div>
                      <div class="grid-content1">
                        <label class="paragraph"> <span style="color: red">* &nbsp</span>打印模板 : </label>
                        <el-select v-model="addData.jdThrPrintTmplId"  placeholder="请选择打印模板" class="a">
                          <el-option
                            v-for="item in jdthrTemplates"
                            :key="item.printTmplId"
                            :label="item.printTmplName"
                            :value="item.printTmplId">
                          </el-option>
                        </el-select>
                        <i class="el-icon-question" title="快递单的打印模板。"></i>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse-item>
            </div>

            <!--使用京东快递电子面单-->
            <el-collapse-item name="3"   v-if="jd">
              <template slot="title"  >
                <div class="dog">
                  <el-checkbox @change="changeCheckTwo(addData.jdFlag)"  style=";margin-left: 40px"  v-model="addData.jdFlag"  >使用京东快递电子面单</el-checkbox>
                </div>
              </template>
              <div style="white-space: nowrap;">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>京东的授权店铺 : </label>
                      <el-select v-model="addData.jdShopId"  placeholder="请选择店铺" class="a">
                        <el-option
                          v-for="item in jdShopList"
                          :key="item.storeId"
                          :label="item.storeName"
                          :value="item.storeId">
                        </el-option>
                      </el-select>
                      <i class="el-icon-question" title="开通当前快递电子面单的店铺。"></i>
                    </div>
                    <div class="grid-content1">
                      <div class="grid-content1" >
                        <label class="paragraph"><span style="color: red">* &nbsp</span>商家编号 : </label>
                        <el-input v-model="addData.merchantCode" placeholder="请输入内容" class="a" ></el-input>
                        <i class="el-icon-question" title="开通京东配送时京东生成的商家编号，向京东开通该服务的人员索要"></i>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="11">
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>打印模板 : </label>
                      <el-select v-model="addData.jdPrintTmplId"  placeholder="请选择打印模板" class="a" >
                        <el-option
                          v-for="item in jdTemplates"
                          :key="item.printTmplId"
                          :label="item.printTmplName"
                          :value="item.printTmplId">
                        </el-option>
                      </el-select>
                      <i class="el-icon-question" title="快递单的打印模板。"></i>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDall()">保存</el-button>
        </div>
      </el-dialog>
    </div>

    <!--修改快递-->
    <div class="header">
      <el-dialog v-dialogDrag
        class="addExpress"
        width="950px"
        title="修改快递"
        :visible.sync="dialogFormVisiblex"
      >
        <el-form :model="updateData">
          <div style="white-space: nowrap; margin-bottom: 20px">
            <el-row>
              <el-col :span="12">
                <div class="grid-content1" >
                  <label class="paragraph"><span style="color: red">* &nbsp</span>快递名称 : </label>
                  <el-input v-model="updateData.expressName" placeholder="请输入快递名称" class="a"  ></el-input>
                </div>
                <div class="grid-content1"  >
                  <label class="paragraph" ><span style="color: red">* &nbsp</span>运单类型 : </label>
                  <el-select v-model="updateData.expressType"  placeholder="请选择运单类型" class="a"  @change="clickType()" >
                    <el-option
                      v-for="item in expressOptions"
                      :key="item.expressTypeName"
                      :label="item.expressTypeName"
                      :value="item.expressType">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="11">
                <div class="grid-content1">
                  <label class="paragraph"><span style="color: red">* &nbsp</span>所属快递 :  </label>
                  <el-select v-model="updateData.expressCoId"  placeholder="请选择" filterable   @change="clickYd()" class="a">
                    <el-option
                      v-for="item in sysexPress"
                      :key="item.expressCoId"
                      :label="item.nameAndCode"
                      :value="item.expressCoId">
                    </el-option>
                  </el-select>
                </div>
                <div class="grid-content1"v-if="kit">
                  <label class="paragraph"><span style="color: red">* &nbsp</span>打印模板 : </label>
                  <el-select v-model="updateData.pagePrintTmplId"  placeholder="请选择打印模板" class="a" >
                    <el-option
                      v-for="item in Templates"
                      :key="item.printTmplId"
                      :label="item.printTmplName"
                      :value="item.printTmplId">
                    </el-option>
                  </el-select>
                  <i class="el-icon-question"  title="快递单的打印模板。"></i>
                </div>
              </el-col>
            </el-row>
          </div>
          <!--使用菜鸟电子面单-->
          <el-collapse v-model="activeName" >
            <el-collapse-item style="margin-bottom: 0px" name="1" v-if="taobao">
              <template slot="title" >
                <div class="dog">
                  <el-checkbox v-model="updateData.cainiaoFlag"  style=";margin-left: 40px"   @change="changeCheck(updateData.cainiaoFlag)" >使用菜鸟电子面单</el-checkbox>
                </div>
              </template>
              <div style="white-space: nowrap;" v-if="taobao">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>淘系的授权店铺 : </label>
                      <el-select v-model="updateData.tmallShopId"  placeholder="请选择店铺" class="a" >
                        <el-option
                          v-for="item in taobaoShopList"
                          :key="item.storeId"
                          :label="item.storeName"
                          :value="item.storeId">
                        </el-option>
                      </el-select>
                      <i class="el-icon-question" title="开通当前快递电子面单的店铺,或者开通菜鸟云打印模板时、获取菜鸟云打印模板信息。"></i>
                    </div>
                    <div class="grid-content1" >
                      <label class="paragraph"><span style="color: red">* &nbsp</span>打印模板类型 : </label>
                      <el-select v-model="updateData.cainiaoPrintTmplType"  placeholder="请选择打印模板类型" class="a"   @change="ChangeTemplateType()">
                        <el-option
                          v-for="item in templateType"
                          :key="item.printTmpType"
                          :label="item.templateTypeName"
                          :value="item.printTmpType"
                          :disabled="!updateData.cainiaoFlag">
                        </el-option>
                      </el-select>
                    </div>
                  </el-col>

                  <el-col :span="12" >
                    <div class="grid-content1" id="wrapper1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>订单来源 : </label>
               <!--       <el-select v-model="updateData.cainiaoEcList" multiple collapse-tags placeholder="请选择平台" class="a">
                        <el-option
                          v-for="item in platOne"
                          :key="item.ecName"
                          :label="item.ecName"
                          :value="item.ecId">
                        </el-option>
                      </el-select>-->
                     <!-- <select id="example-post2" name="multiselect[]" multiple="multiple" >
                        <option  v-for="item in platOne" :value="item.value">{{item.label}}</option>
                      </select>-->

                        <el-select @change="terrace(updateData)" v-model="updateData.cainiaoEcList" filterable multiple collapse-tags
                                  placeholder="请选择" class="chicun" >
                          <el-option
                            v-for="(item,index) in terraceNumber"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      <span style="margin-left: -2px"><i class="el-icon-question"  title="选中平台的订单，使用菜鸟电子面单。"></i></span>
                    </div>
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>打印模板 : </label>
                      <el-select v-model="updateData.cainiaoPrintTmplId"  placeholder="请选择打印模板" class="a" >
                        <el-option
                          v-for="item in taobTemplates"
                          :key="item.printTmplId"
                          :label="item.printTmplName"
                          :value="item.printTmplId">
                        </el-option>
                      </el-select>
                      <i class="el-icon-question" title="快递单的打印模板。可以使用软件中设计的打印模板，也可以使用菜鸟提供的打印模板。"></i>
                    </div>
                    <div class="newPlan">
                      <span  @click="acquire()"><a   target="_blank"  style="font-size: 16px;color: #3A9CDA">&nbsp;&nbsp;获取菜鸟打印模板</a></span>
                      <a   target="_blank" href="http://cloudprint.cainiao.com/print/templates.htm" style="font-size: 16px;color: #3A9CDA">&nbsp;&nbsp;编辑菜鸟模板</a>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
            <!--使用京东第三方快递电子面单-->
            <el-collapse-item  name="2"  v-if="jdthree">
              <template slot="title" >
                <div class="dog">
                  <el-checkbox v-model="updateData.jdThrFlag"  style="margin-left: 40px" @change="changeOne(updateData.jdThrFlag)">使用京东第三方快递电子面单</el-checkbox>
                </div>
              </template>
              <div style="white-space: nowrap;" v-if="jdthree">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>京东的授权店铺 : </label>
                      <el-select v-model="updateData.jdThrShopId"  placeholder="请选择店铺"  class="a">
                        <el-option
                          v-for="item in jdrShopList"
                          :key="item.storeId"
                          :label="item.storeName"
                          :value="item.storeId">
                        </el-option>
                      </el-select>
                      <i class="el-icon-question"  title="开通当前快递电子面单的店铺。"></i>
                    </div>
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>快件种类 : </label>
                      <el-select v-model="updateData.jdExpressType"  placeholder="请选择" class="a">
                        <el-option
                          v-for="item in jdTypes"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="11">
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>订单来源 : </label>
                      <el-select v-model="updateData.ecId"   placeholder="请选择平台" class="a">
                        <el-option
                          v-for="item in platTwo"
                          :key="item.ecName"
                          :label="item.ecName"
                          :value="item.ecId"
                          :disabled="!updateData.jdThrFlag">
                        </el-option>
                      </el-select>
                      <i class="el-icon-question" title="选中平台的订单，使用京东第三方快递电子面单。"></i>
                    </div>
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>打印模板 : </label>
                      <el-select v-model="updateData.jdThrPrintTmplId"  placeholder="请选择打印模板" class="a">
                        <el-option
                          v-for="item in jdthrTemplates"
                          :key="item.printTmplId"
                          :label="item.printTmplName"
                          :value="item.printTmplId">
                        </el-option>
                      </el-select>
                      <i class="el-icon-question" title="快递单的打印模板。"></i>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
            <!--使用京东快递电子面单-->
            <el-collapse-item name="3" accordion  v-if="jd">
              <template slot="title"  >
                <div class="dog">
                  <el-checkbox v-model="updateData.jdFlag"  style="margin-left: 40px"   @change="changeTwo(updateData.jdFlag)"  >使用京东快递电子面单</el-checkbox>
                </div>
              </template>
              <div style="white-space: nowrap;">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>京东的授权店铺 : </label>
                      <el-select v-model="updateData.jdShopId"  placeholder="请选择店铺" class="a">
                        <el-option
                          v-for="item in jdShopList"
                          :key="item.storeId"
                          :label="item.storeName"
                          :value="item.storeId">
                        </el-option>
                      </el-select>
                      <i class="el-icon-question" title="开通当前快递电子面单的店铺。"></i>
                    </div>
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>商家编号 : </label>
                      <el-input v-model="updateData.merchantCode" placeholder="请输入内容" class="a" ></el-input>
                      <i class="el-icon-question" title="开通京东配送时京东生成的商家编号，向京东开通该服务的人员索要"></i>
                    </div>
                  </el-col>
                  <el-col :span="11">
                    <div class="grid-content1">
                      <label class="paragraph"><span style="color: red">* &nbsp</span>打印模板 : </label>
                      <el-select v-model="updateData.jdPrintTmplId"  placeholder="请选择打印模板" class="a">
                        <el-option
                          v-for="item in jdTemplates"
                          :key="item.printTmplId"
                          :label="item.printTmplName"
                          :value="item.printTmplId">
                        </el-option>
                      </el-select>
                      <i class="el-icon-question" title="快递单的打印模板。"></i>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <div slot="footer" class="dialog-footer"  style="text-align: right">
          <el-button @click="dialogFormVisiblex = false">取 消</el-button>
          <el-button type="primary" @click="updateAll()">保存</el-button>
        </div>
      </el-dialog>
    </div>

    <!--电子面单信息窗口-->
    <el-dialog v-dialogDrag
      style="min-width: 1400px;"
      title="电子面单信息"
      :visible.sync="dialogFormVisiblecc"
    >
      <div class="line"></div>
      <div class="grid-content1 bg-purple" style="margin-left: 10px; margin-top: 20px">
        <el-button type="primary" @click="querySingle()">刷新</el-button>
      </div>
      <div style="margin: 20px 0;">
        <el-table
          :height="500"
          ref="multipleTable"
          :data="electroniclData"
          stripe
          border
        >
          <el-table-column
            align="center"
            prop="plat"
            label="平台"
            min-width="110">
          </el-table-column>
          <el-table-column
            align="center"
            prop="shopName"
            :show-overflow-tooltip='true'
            label="店铺名称"
            min-width="110">
          </el-table-column>
          <el-table-column
            align="center"
            prop="num"
            :show-overflow-tooltip='true'
            label="电子面单剩余量"
            min-width="100">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!--电子面单信息窗口-->
    <el-dialog v-dialogDrag
      style="height: 500px"
      title="电子面单信息"
      :visible.sync="dialogFormVisiblec"
      width="500px"
    >
      <el-container style="margin:100px;margin-left:170px">
        <div class="allDia">
          <p>直营的快递电子单号要用多少就申请多少，可以直接用!</p>
        </div>
      </el-container>
    </el-dialog>

    <!--删除快递绑定-->
    <el-dialog v-dialogDrag
      width="500px"
      title="删除快递绑定"
      :visible.sync="deleteWindow"
    >
      <div class="line"></div>
      <el-container style="margin: 20px 0;">
        <el-main>
          <span style="font-size: 14px">该快递与仓库已绑定，删除该快递时会删除仓库与该快递的绑定关系，</span><br>
          <span style="font-size: 14px"> 确定要删除吗!</span>
          <div  style="text-align: right;margin-top: 60px">
            <el-button @click="deleteWindow = false">取 消</el-button>
            <el-button type="primary" @click="delExpress()">确定</el-button>
          </div>
        </el-main>
      </el-container>
    </el-dialog>

    <!--删除快递绑定-->
    <el-dialog v-dialogDrag
      width="420px"
      title="提示"
      :visible.sync="delWindow"
    >
        <div class="line"></div>
            <div style="margin-top:-10px;text-align: center"><span style="font-size: 14px;">确定要删除该快递吗？</span></div>
            <div  style="text-align: center;margin-top: 20px">
              <el-button @click="delWindow = false">取 消</el-button>
              <el-button type="primary" @click="delExpress()">确定</el-button>
            </div>

    </el-dialog>

    <!--删除失败弹层-->
    <div>
      <el-dialog v-dialogDrag
        :title="title"
        :visible.sync="centerDialogVisible"
        width="500px"
        center>
        <div style="width: 100%;margin-top: -20px;"><i style="font-size: 16px;color: #E6A23C;margin-left: 20px;" class="el-icon-warning"></i><span style="font-size: 14px;margin-left: 10px">该快递已被设置为店铺默认快递，请先取消、再关闭：</span> </div>
        <div v-for="(todo,index) in defaultShop" style="margin:10px 40px"><span>{{index+1}}:{{todo}}</span></div>
        <span slot="footer" class="dialog-footer">
              <el-button style="margin-bottom: -30px" type="primary" @click="close()">关闭</el-button>
           </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import publicLog from '@/components/common/publicLog.vue';
  export default {
    components: {
      'v-Publiclog': publicLog  //日志
    },
    data() {
      return {
        version: '1.0.0',//版本号
        paramObj:{},//日志
        pulicLogVisible:false,//日志窗口
        defaultShop: [],//默认店铺
        title: '',//标题
        queryFn: () => {
        }, // 定义方法全局调用
        queryAll:{ // 模糊查询
          expressName:'',
          expressCoId:'',
          merchantId: 0,// 商户id。
          page: 1, // 页数
          size: 15, // 行数
        },
        taobaoShopList:[],//淘宝授权店铺
        jdShopList:[],//京东授权店铺
        jdrShopList:[],//京东第三方授权店铺
        sysPressOption:[],//所属快递
        status: [//状态
          {value: '开启', label: true},
          {value: '关闭', label: false}
        ],
        stripe:true,//状态
        taobao:true,//淘宝电子面单展示
        jdthree:true,//京东第三方电子面单展示
        jd:false,//京东电子面单展示
        kit:false,//纸质电子面单展示,
        tableData: [],//表格数据
        multiple:true,
        joData:{
          logDesc:''
        },// //电子面单刷新按钮
        formData: [{
          isenable:true, // 是否启用
          expressName: '', // 快递名称
          expressCoId: '',// 支持货到付款 value2: true,
          sysexpressName:[], // 所属快递
          ecId:'',//订单id
          ecName:'',//订单name
          tmplName: '', // 打印模板类型
          templateTypeName: '',//模板名称
          expressId: '' ,//快递编号
          page: 1, // 页数
          size: 15, // 行数
        }],
        activeName: [],//默认显示
        jdTypes:[ {
          value: 1,
          label: '普通运单'
        },{
          value: 2,
          label: '生鲜'
        },{
          value: 3,
          label: '航空'
        }],// 快件种类
        tbExpsheetFlag:false,//状态
        jdFlag:false,//参数
        total: 0,//总数
        totalPage: 15, // 要显示的条数
        currentPage: 1, //当前页
        totalNum: 0, // 数据总条数
        table_h: 0, // 表格高度,
        sysexPress: [ ] , // 快递群组
        shopAll:[],//店铺
        jdshopThreeAll:[],// 京东第三方店铺
        jdshopAll:[],// 京东店铺
        platOne: [],//淘宝订单来源
        platTwo:[{ //京东第三方订单来源
          ecId:'17',
          ecName:'京东',
          disabled:true,
        }],//京东订单来源
        Templates:[],//打印模板
        taobTemplates: [] ,// 菜鸟打印模板
        jdthrTemplates:[],// 京东第三方打印模板
        jdTemplates:[],// 京东打印模板
        dialogFormVisiblex: false,  // 修改快递
        dialogFormVisible: false,//添加快递
        dialogFormVisiblec: false,//电子面单信息窗口
        dialogFormVisiblecc:false,//电子面单信息窗口
        centerDialogVisible:false,//删除某些店铺被默认为快递
        deleteWindow:false,// 删除快递绑定窗口
        expressOptions:[{//面单种类
          expressType: 1,
          expressTypeName:'电子面单'
        },{
          expressType: 2,
          expressTypeName:'纸质面单'
        }],
        type:[ {  // 方式 菜鸟 1 京东第三方 2 京东 3
          value: 1,
          label: '菜鸟'
        },{
          value: 2,
          label: '京东第三方'
        },{
          value: 3,
          label: '京东'
        }],
        paramData:{
          page: 1,
          size: 15,
          expressName:'',
          expressCoId: '',
        },//查询参数
        updateData:{
          expressId: '', //快递Id  --新增不填
          expressCoId: '', //快递公司Id
          ecId: '', //电商平台id--京东和京东第三方
          expressName: '',//快递名称
          expressType: '', //运单类型
          cainiaoFlag:false, //是否使用菜鸟电子面单
          tmallShopId: '',//淘宝平台店铺Id
          cainiaoPrintTmplType: '', //菜鸟打印模板类型
          cainiaoPrintTmplId: '',//菜鸟打印模板Id
          jdThrFlag:false, //京东第三方电子面单
          jdThrShopId: '',//京东第三方授权店铺Id
          jdExpressType: '',//京东第三方快件种类
          jdThrPrintTmplId: '', //京东打印模板Id
          jdFlag:false, //是否使用京东电子面单
          jdShopId: '', //京东授权店铺Id
          jdPrintTmplId: '', //京东打印模板Id
          merchantCode: '', //京东商户code
          status:false, //启用状态
          pagePrintTmplId: '',//纸质面单打印模板Id
          cainiaoEcIds: '', //菜鸟电子面单平台ids 逗号分隔
        },//修改参数
        addData: {
          expressId: '', //快递Id  --新增不填
          expressCoId: '', //快递公司Id
          ecId: '', //电商平台id--京东和京东第三方
          expressName: '',//快递名称
          expressType: '', //运单类型
          cainiaoFlag:false, //是否使用菜鸟电子面单
          tmallShopId: '',//淘宝平台店铺Id
          cainiaoPrintTmplType: '', //菜鸟打印模板类型
          cainiaoPrintTmplId: '',//菜鸟打印模板Id
          jdThrFlag:false, //京东第三方电子面单
          jdThrShopId: '',//京东第三方授权店铺Id
          jdExpressType: '',//京东第三方快件种类
          jdThrPrintTmplId: '', //京东打印模板Id
          jdFlag:false, //是否使用京东电子面单
          jdShopId: '', //京东授权店铺Id
          jdPrintTmplId: '', //京东打印模板Id
          merchantCode: '', //京东商户code
          status:false, //启用状态
          pagePrintTmplId: '',//纸质面单打印模板Id
          cainiaoEcIds: [], //菜鸟电子面单平台ids 逗号分隔
        },//添加参数
        dData:{
          expressId: '', // 快递Id
          clToken: ''//
        },// 删除快递
        electroniclData:{
          page: 1,
          size: 15,
        },//电子面单信息
        templateType: [
          {
            printTmpType: 1,
            templateTypeName: '菜鸟云打印模板',
            disabled: true
          }, {
            printTmpType: 2,
            templateTypeName: '软件设计模板',
            disabled: true
          }],//打印模板类型
        delWindow:false,//删除快递绑定窗口
        newExpress:'',//快递ID
        oldChangeOptions:[],//勾选数据
        terraceNumber:[{value: '', label: '全部'}],//订单来源多选
        authorityCode:sessionStorage.getItem('authorityCode')?JSON.parse(sessionStorage.getItem('authorityCode')):{}//权限
      }
    },
    mounted(){
      //菜鸟订单来源初始化样式
      $('#example-post').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      //快递
      $('#example-post1').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      //修改来源
      $('#example-post2').multiselect({
        onInitialized: function(select, container) {
          //改变滚动条样式
          $("._scroll").yi_scroll({
            barColor:'hsla(220,4%,58%,.3)'
          });
        },
      });
      // 一上来加载快递模糊查询
      var self = this;
      self._post('com.edb01.erp.mdata.service.api.ExpressCoService/'+this.version+'/subExpress',{merchantId:0})
        .then(function (response) {
          if (response.data.code == 0) {
            self.sysPressOption = response.data.result; // 所属快递
            var value = []
            for (var item of self.sysPressOption){
              item.value = item.expressCoId
              item.label = item.nameAndCode
              value.push(item.expressCoId)
            }
            $('#example-post1').multiselect('dataprovider', self.sysPressOption );
            $('#example-post1').multiselect('select',value);
          } else {
            self.$message({
              message: response.data.result.message,
              type: 'warning'
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    },
    methods: {
      //多选订单来源
      terrace(updateData){
        let allValues = [];
        //下拉所有值
        for (let item of this.terraceNumber) {
          allValues.push(item.value)
        }

        //储存当前最后的结果 作为下次的老数据
        this.oldChangeOptions[0] = this.updateData.cainiaoEcList;

        // 全部选择
        if(this.oldChangeOptions[0] != undefined) {
          if (this.oldChangeOptions[0].includes(''))this.updateData.cainiaoEcList = allValues;
        }

        // 取消全部选中  上次有 当前没有 表示取消全选
        if(this.oldChangeOptions[0] != undefined && this.oldChangeOptions[1] != undefined) {
          if (!this.oldChangeOptions[0].includes('') && this.oldChangeOptions[1].includes('')) this.updateData.cainiaoEcList = [];
        }

        // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if(this.oldChangeOptions[0] != undefined && this.oldChangeOptions[1] != undefined) {
          if (this.oldChangeOptions[0].includes('') && this.oldChangeOptions[1].includes('')) {
            const index = this.oldChangeOptions[0].indexOf('');
            this.oldChangeOptions[0].splice(index, 1);// 排除全选选项
            this.updateData.cainiaoEcList = this.oldChangeOptions[0]
          }
        }

        //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if(this.oldChangeOptions[0] != undefined && this.oldChangeOptions[1] != undefined) {
          if (!this.oldChangeOptions[0].includes('') && !this.oldChangeOptions[1].includes('')) {
            if (this.oldChangeOptions[0].length === allValues.length - 1) this.updateData.cainiaoEcList = allValues
          }
        }

        this.oldChangeOptions[1] = this.updateData.cainiaoEcList;

      },

      // 勾选菜鸟面单复选框显示内容
      changeCheck(val){
        if(val) {
          this.activeName = '1';
        }
        this.ChangeTemplateTypeid()
        this.getList()
      },

      // 勾选京东第三方面单复选框显示内容
      changeCheckOne(val){
        if(val){
          this.activeName='2';
        }
        this.ChangeTemplateTypeid()
        this.getList()
      },

      // 勾选京东复选框显示内容
      changeCheckTwo(val){
        if(val){
          this.activeName='3';
        }
        this.ChangeTemplateTypeid()
        this.getList()
      },

      // 勾选菜鸟面单复选框显示内容
      change(val){
        if(val){
          this.activeName='1';
        }
        this.ChangeTemplateType()
      },

      // 勾选京东第三方面单复选框显示内容
      changeOne(val){
        if(val){
          this.activeName='2';
        }
        this.ChangeTemplateType()
      },

      // 勾选京东复选框显示内容
      changeTwo(val){
        if(val){
          this.activeName='3';
        }
        this.ChangeTemplateType()
      },

      //添加转换运单类型
      clickChang(){
        if(this.addData.expressType ==2 ){
          this.addData.pagePrintTmplId=''
          this.kit=true;
          this.jd=false
          this.taobao=false
          this.jdthree=false
        }else if(this.addData.expressType == 1 && this.addData.expressCoId == 1) {
          this.addData.pagePrintTmplId=''
          this.kit=false;
          this.jd=true
          this.taobao=false
          this.jdthree=false
        }else{
          this.kit=false;
          this.jd=false
          this.taobao=true
          this.jdthree=true
          this.addData.pagePrintTmplId=''
        }
        this.ChangeTemplateTypeid()
        this.getPlatList();
        this.$nextTick(function () {
          $('#example-post').multiselect({
            onInitialized: function(select, container) {
              //改变滚动条样式
              $("._scroll").yi_scroll({
                barColor:'hsla(220,4%,58%,.3)'
              });
            },
          });
        })
      },

      // 修改运单类型转换电子面单
      clickType(){
        if(this.updateData.expressType ==2 ){
          this.updateData.pagePrintTmplId=''
          this.kit=true;
          this.jd=false
          this.taobao=false
          this.jdthree=false
        }else{
          this.updateData.pagePrintTmplId=''
          this.kit=false;
          this.jd=false
          this.taobao=true
          this.jdthree=true
        }
        this.ChangeTemplateType()
      //  this.getPlatList();
     /*   this.$nextTick(function () {
          $('#example-post2').multiselect({
            onInitialized: function(select, container) {
              //改变滚动条样式
              $("._scroll").yi_scroll({
                barColor:'hsla(220,4%,58%,.3)'
              });
            },
          });
        })*/
      },

      //  电子面单时切换快递名称来判断隐藏情况
      clickYd(){
        //模板为空
        this.updateData.pagePrintTmplId=''
       // this.updateData.cainiaoPrintTmplId=''
        this.updateData.cainiaoPrintTmplId=''
        this.updateData.jdThrPrintTmplId=''
        this.updateData.jdPrintTmplId=''
       // this.jdTemplates=[]
        if(this.updateData.expressType !=2){
          var obj={};
          this.sysexPress.forEach((item,i)=>{
            if(item.expressCoId==this.updateData.expressCoId){
              obj=item;
              if(obj.jdExpsheetFlag==false&&obj.tbExpsheetFlag==false){
                this.taobao=false
                setTimeout(()=>{
                  this.jd=true;
                  this.jdthree=false
                  this.activeName = [];
                  this.activeName.push('3');
                },10)
              } if(obj.jdExpsheetFlag==false&&obj.tbExpsheetFlag==true){
                this.jd=false;
                this.taobao=true
                this.jdthree=false
                this.activeName = [];
                this.activeName.push('1');
              } if(obj.jdExpsheetFlag==true&&obj.tbExpsheetFlag==false){
                this.taobao=false
                setTimeout(()=>{
                  this.jd= false
                  this.jdthree=true
                  this.activeName = [];
                  this.activeName.push('2');
                },10)
              }if(obj.jdExpsheetFlag==true&&obj.tbExpsheetFlag==true){
                this.jd=false;
                this.taobao=true
                this.jdthree=true
                this.activeName = [];
                this.activeName.push('1','2');
              }
            }
          })
        }
     //   this.ChangeTemplateType()
      },

      //快递名称来判断是否
      clickChange(){
        if(this.addData.expressType !=2){
          var obj={};
          this.sysexPress.forEach((item,i)=>{
            if(item.expressCoId==this.addData.expressCoId){
              obj=item;
              if(obj.jdExpsheetFlag==false&&obj.tbExpsheetFlag==false){
                this.jd=true;
                this.taobao=false;
                this.jdthree=false;
                this.activeName = [];
                this.activeName.push('3');
              } if(obj.jdExpsheetFlag==false&&obj.tbExpsheetFlag==true){
                this.jd=false;
                this.taobao=true;
                this.jdthree=false;
                this.activeName = [];
                this.activeName.push('1');
              } if(obj.jdExpsheetFlag==true&&obj.tbExpsheetFlag==false){
                this.jd=false;
                this.taobao=false;
                this.jdthree=true;
                this.activeName = [];
                this.activeName.push('2');
              }if(obj.jdExpsheetFlag==true&&obj.tbExpsheetFlag==true){
                this.jd=false;
                this.taobao=true;
                this.jdthree=true;
                this.activeName = [];
                this.activeName.push('1','2');
              }
            }
          })
        }
        this.ChangeTemplateTypeid();
        this.getPlatList();
        this.$nextTick(function () {
          $('#example-post').multiselect({
            onInitialized: function(select, container) {
              //改变滚动条样式
              $("._scroll").yi_scroll({
                barColor:'hsla(220,4%,58%,.3)'
              });
            },
          });
        })
      },

      // 关闭错误的弹层
      close() {
        this.centerDialogVisible = false
      },

      //模糊查询
      queryData(){
        this.queryAll.page = this.currentPage;
        this.queryAll.size = this.totalPage;
        let self = this;
        if ($('#example-post1').val().length == self.sysPressOption.length) {
          self.queryAll.expressCoId = ''
        }else {
          self.queryAll.expressCoId = $('#example-post1').val();
        }
        this.queryFn(this.queryAll);// 初始化调用
      },

      // 日志方法
      publicLogBtn(){
        this.paramObj.moduleId=12,
          this.paramObj.billCode='',
          this.paramObj.typeId='',
          this.pulicLogVisible = true;
      },

      //日志
      changDialogShow(){
        this.pulicLogVisible=false;
      },

      // 获取刷新菜鸟打印模板
      acquire(){
        var self = this;
        self._post('com.edb01.erp.wms.service.api.PrintTemplService/'+this.version+'/saveCainiaoPrintTempl',{merchantId:0,tmallShopId:self.tmallShopId})
          .then(function (response) {
            if (response.data.code == 0) {

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

      //修改打印模板
      ChangeTemplateType(){
        var self = this;
        var oneData = {
          merchantId: 0, // 商户Id
          printTmpType:self.updateData.cainiaoPrintTmplType, //打印模板类型 1 菜鸟 2 软件
          expressType:self.updateData.expressType,//运单类型
          expressCoId:self.updateData.expressCoId //系统快递Id
        }
        if(self.updateData.expressCoId !=''&&self.updateData.cainiaoPrintTmplType=='') {
          if (self.updateData.jdThrFlag==true) {
            oneData.printTmpType= 2
          }
          if (self.updateData.jdFlag==true) {
            oneData.printTmpType= 2
          }
          if(self.updateData.expressType == 2){
            oneData.printTmpType= 2
          }
        }if (self.updateData.expressCoId !=''&&self.updateData.cainiaoPrintTmplType==1){
          if (self.updateData.cainiaoFlag==true) {
            oneData.printTmpType= 1
          }
          if (self.updateData.jdThrFlag==true) {
            oneData.printTmpType= 2
          }
          if (self.updateData.jdFlag==true) {
            oneData.printTmpType= 2
          }
          if(self.updateData.expressType == 2){
            oneData.printTmpType= 2
          }
        }if (self.updateData.expressCoId !=''&&self.updateData.cainiaoPrintTmplType==2) {
          if (self.updateData.cainiaoFlag==true) {
            oneData.printTmpType= 2
          }
          if (self.updateData.jdThrFlag==true) {
            oneData.type = 2
          }
        }
        self._post('com.edb01.erp.wms.service.api.PrintTemplService/'+this.version+'/getExpressPrintTempl',oneData)
          .then(function (response) {
            if (response.data.code == 0) {
              self.Templates = response.data.result;
              self.taobTemplates = response.data.result;
              self.jdthrTemplates = response.data.result;
              self.jdthrTemplates = response.data.result;
              self.jdTemplates = response.data.result;
            } else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        /*var self = this;
        var oneData = {  // 方式 菜鸟 1 京东第三方 2 京东 3 打印模板类型
          clToken: self.token,
          type:'',
          tenantId: 0,
          printTmpType: self.updateData.printTmpType,
          expressCoId: self.updateData.expressCoId
        }
        if(self.updateData.expressCoId !=''&&self.updateData.printTmpType=='') {
          if (self.updateData.jdThrFlag==true) {
            oneData.type = 2
          }
          if (self.updateData.jdFlag==true) {
            oneData.type = 3
            oneData.printTmpType=2
          }
        }if(self.updateData.expressCoId !=''&&self.updateData.printTmpType==2) {
          if (self.updateData.jdThrFlag==true) {
            oneData.type = 2
            oneData.printTmpType=2
          }
          if (self.updateData.jdFlag==true) {
            oneData.type = 3
            oneData.printTmpType=2
          }
        }if (self.updateData.expressCoId !=''&&self.updateData.printTmpType==1){
          if (self.updateData.cainiaoFlag==true) {
            oneData.type = 1
          }
          if (self.updateData.jdFlag==true) {
            oneData.type = 3
            oneData.printTmpType=2
          }
        }if (self.updateData.expressCoId !=''&&self.updateData.printTmpType==2){
          if (self.updateData.cainiaoFlag==true) {
            oneData.type = 1
          }
        }  if(self.updateData.expressCoId !=''&&self.updateData.expressType==2){
          oneData.type= 4
          oneData.printTmpType=2
        }
        self._post('com.edb01.erp.data.service.ExpressService/'+this.version+'/getAllTemplates',oneData)
          .then(function (response) {
            if (response.data.success == true) {
              if(oneData.type==4){
                self.Templates = response.data.result;
              }else if(oneData.type ==1){
                self.taobTemplates = response.data.result;
              }else if (oneData.type==2){
                self.jdthrTemplates = response.data.result;
              }else if(oneData.type==3){
                self.jdTemplates = response.data.result;
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          });*/
      },

      // 添加获取打印模板列表
      ChangeTemplateTypeid(){
        var self = this;
        var oneData = {
          merchantId: 0, // 商户Id
          printTmpType:self.addData.cainiaoPrintTmplType, //打印模板类型 1 菜鸟 2 软件
          expressType:self.addData.expressType,//运单类型
          expressCoId:self.addData.expressCoId //系统快递Id
        }
        if(self.addData.expressCoId !=''&&self.addData.cainiaoPrintTmplType=='') {
          if (self.addData.jdThrFlag==true) {
            oneData.printTmpType= 2
          }
          if (self.addData.jdFlag==true) {
            oneData.printTmpType= 2
          }
          if(self.addData.expressType == 2){
            oneData.printTmpType= 2
          }
        }if (self.addData.expressCoId !=''&&self.addData.cainiaoPrintTmplType==1){
          if (self.addData.cainiaoFlag==true) {
            oneData.printTmpType= 1
          }
          if (self.addData.jdThrFlag==true) {
            oneData.printTmpType= 2
          }
          if (self.addData.jdFlag==true) {
            oneData.printTmpType= 2
          }
          if(self.addData.expressType == 2){
            oneData.printTmpType= 2
          }
        }if (self.addData.expressCoId !=''&&self.addData.cainiaoPrintTmplType==2) {
          if (self.addData.cainiaoFlag==true) {
            oneData.printTmpType= 2
          }
          if (self.addData.jdThrFlag==true) {
            oneData.type = 2
          }
        }
        self._post('com.edb01.erp.wms.service.api.PrintTemplService/'+this.version+'/getExpressPrintTempl',oneData)
          .then(function (response) {
            if (response.data.code == 0) {
              self.Templates = response.data.result;
              self.taobTemplates = response.data.result;
              self.jdthrTemplates = response.data.result;
              self.jdTemplates = response.data.result;
            } else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //查询所属快递（根据快递判断显示框）
      getexpressName(){
        var self = this;
        self._post('com.edb01.erp.mdata.service.api.ExpressCoService/'+this.version+'/subExpress',{merchantId: 0, clToken: self.token})
          .then(function (response) {
            if (response.data.code == 0) {
              self.sysexPress = response.data.result;
            } else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //菜鸟订单来源
      getPlatList(){
        var self=this
        self.terraceNumber = [{value: '', label: '全部'}]
        self._post('com.edb01.erp.mdata.service.api.EcService/'+this.version+'/getEcBeanList')
          .then(function (response) {
            if (response.data.code == 0) {
              self.platOne = response.data.result; // 接受平台类型数据
              var value = []
              for (var item of self.platOne){
                item.value = item.ecId
                item.label = item.ecName
                value.push(item.ecId)
              }
              response.data.result.forEach(function (val) {
                self.terraceNumber.push({value: val.ecId,label: val.ecName});
              }.bind(this));

              $('#example-post').multiselect('dataprovider', self.platOne );
              $('#example-post').multiselect('select',value);

              self.addData.cainiaoEcIds=[]
              for (var item of self.platOne){
                self.addData.cainiaoEcIds.push(item.ecId)
              }
                  $('#example-post2').multiselect('dataprovider', self.platOne );
                  $('#example-post2').multiselect('select',value);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //授权店铺接口调用
      getList(){
        var self = this;
        self._post('com.edb01.erp.mdata.service.api.DtStoreService/'+this.version+'/getExpressGrantShopList',{merchantId: 0, clToken: self.token})
          .then(function (response) {
            if (response.data.code == 0) {
              self.taobaoShopList= response.data.result.taobaoShopList;
              self.jdShopList= response.data.result.jdShopList;
              self.jdrShopList= response.data.result.jdShopList;
            }else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //电子面单刷新按钮
      querySingle(){
        var self = this;
        var joData = {
          expressId:self.expressId,
          expressCoId :12, // 系统快递ID(所属快递ID)
        }
        self._post('com.edb01.erp.data.service.ExpressService/'+this.version+'/saveQuantity',joData)
          .then(function (response) {
            if (response.data.code == 0) {
              self.electroniclData = response.data.result.rows;
              self.totalNum = response.data.result.total // 数据的总条数
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

      //电子面单
      electronic(row){
        this.expressId = row.expressId;
        var self = this;
        var paramData = {
          expressId : this.expressId, // 快递
        }
        self._post('com.edb01.erp.data.service.CacheShopelectronService/'+this.version+'/getShopelectron',paramData)
          .then(function (response) {
            if (response.data.code == 0) {
              self.electroniclData = response.data.result;
              if(self.electroniclData == '直营快递'){
                self.dialogFormVisiblec=true
              }else{
                self.dialogFormVisiblecc=true
              }
            } else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //修改快递
      updateAll(){
        //  菜鸟模板的传参
        if(this.updateData.printTmpType == 1){
          for (var i=0; i<this.taobTemplates.length;i++) {
            if (this.updateData.printTmplName == this.taobTemplates[i].printTmplName) {
              this.updateData.cainiaoPrintTmplUrl = this.taobTemplates[i].printTmplUrl
              this.updateData.cainiaoPrintTmplId=''
              break;
            }
          }
        } else {
          for (var i=0; i<this.taobTemplates.length;i++) {
            if (this.updateData.printTmplName == this.taobTemplates[i].printTmplName ) {
              this.updateData.cainiaoPrintTmplId=this.taobTemplates[i].printTmplId
              this.updateData.cainiaoPrintTmplUrl = ''
              break;
            }
          }
        }
        this.updateData.cainiaoEcIds=this.updateData.cainiaoEcList
        var self = this
        if(self.updateData.expressType==2){
            self.updateData.cainiaoFlag = false // 菜鸟多选框
            self.updateData.jdThrFlag = false// 京东第三方多选框
            self.updateData.jdFlag = false // 是否使用京东面单
            self.updateData.ecId ='', //电商平台id--京东和京东第三方
            self.updateData.cainiaoFlag =false, //是否使用菜鸟电子面单
            self.updateData.tmallShopId ='',//淘宝平台店铺Id
            self.updateData.cainiaoPrintTmplType = '', //菜鸟打印模板类型
            self.updateData.cainiaoPrintTmplId = '',//菜鸟打印模板Id
            self.updateData.jdThrFlag =false, //京东第三方电子面单
            self.updateData.jdThrShopId = '',//京东第三方授权店铺Id
            self.updateData.jdExpressType ='',//京东第三方快件种类
            self.updateData.jdThrPrintTmplId = '', //京东打印模板Id
            self.updateData.jdshopId = '', //京东授权店铺Id
            self.updateData.jdFlag=false, //是否使用京东电子面单
            self.updateData.jdPrintTmplId= '', //京东打印模板Id
            self.updateData.merchantCode='', //京东商户code
            self.updateData.cainiaoEcIds= '' //菜鸟电子面单平台ids 逗号分隔
            self.updateData.cainiaoPrintTmplId=''
        }
        if (self.updateData.expressName=='') {
          self.$message({
            message: '请填写快递名称!',
            type: 'warning'
          })
          return false
        } else if (self.updateData.expressName.length > 15) {
          self.$message({
            message: '快递名称最多可输入15个汉字',
            type: 'warning'
          })
          return false
        }
        // 请选择所属快递不能为空
        if (!self.updateData.expressCoId) {
          self.$message({
            message: '请选择所属快递！',
            type: 'warning'
          })
          return false
        }
  /*      if(self.updateData.ecId==17&&self.updateData.cainiaoEcIds==17){
          if(self.updateData.cainiaoFlag==true&&self.updateData.jdThrFlag==true){
            console.log(22);
            self.$message({
              message:' 京东平台订单不可同时使用菜鸟和京东第三方电子面单!',
              type:'warning'
            })
            return false
          }
        }*/
        if(self.updateData.expressType==2){
          if(self.updateData.templateId==''){
            this.$message({
              message:'请选择打印模板！',
              type:'warning'
            })
            return false
          }
        }
        if(self.updateData.cainiaoFlag==true){
          if (!self.updateData.expressType) {
            self.$message({
              message: '请选择运单类型！',
              type: 'warning'
            })
            return false
          }
          if(self.updateData.tmallShopId==''){
            self.$message({
              message:'请选择授权店铺！',
              type:'warning'
            })
            return false
          }
          // 订单来源校验
          if(self.updateData.cainiaoEcIds==''){
            self.$message({
              message:'请选择订单来源！',
              type:'warning'
            })
            return false
          }
          if(self.updateData.printTmpType==''){
            self.$message({
              message:'请选择打印模板类型！',
              type:'warning'
            })
            return false
          }
          if(self.updateData.taobtmplName==''){
            self.$message({
              message:'请选择打印模板！',
              type:'warning'
            })
            return false
          }
        }
        if(self.updateData.jdThrFlag==true){
          if(self.updateData.jdThrShopId==''){
            self.$message({
              message:'请选择授权店铺！',
              type:'warning'
            })
            return false
          }
          if(self.updateData.ecId==''){
            self.$message({
              message:'请选择订单来源！',
              type:'warning'
            })
            return false
          }
          if(self.updateData.jdExpressType==''){
            self.$message({
              message:'请选择快件种类！',
              type:'warning'
            })
            return false
          }
          if(self.updateData.jdThrPrintTmplId==''){
            self.$message({
              message:'请选择打印模板！',
              type:'warning'
            })
            return false
          }
        }
        if(self.updateData.jdFlag==true){
          if(self.updateData.jdShopId==''){
            self.$message({
              message:'请选择授权店铺！',
              type:'warning'
            })
            return false
          }
          if(!self.updateData.jdPrintTmplId){
            self.$message({
              message:'请选择打印模板！',
              type:'warning'
            })
            return false
          }
          if(self.updateData.merchantCode==''){
            self.$message({
              message:'请填写商家编号！',
              type:'warning'
            })
            return false
          }
        }
        if(self.updateData.ecId==17 && self.updateData.cainiaoEcIds==17){
          if(self.updateData.cainiaoFlag==true&&self.updateData.jdThrFlag==true){
            self.$message({
              message:' 京东平台订单不可同时使用菜鸟和京东第三方电子面单!',
              type:'warning'
            })
            return false
          }
        }
          if(self.updateData.cainiaoEcIds==undefined){
            self.updateData.cainiaoEcIds=''
          }
        //self.updateData.cainiaoEcIds=$('#example-post2').val()

    //   delete this.updateData.cainiaoEcList
        if(this.updateData.printTmplId==undefined){
          this.updateData.printTmplId=''
        }
        self._post('com.edb01.erp.wms.service.api.ExpressService/'+this.version+'/update',self.updateData)
          .then(function (response) {
            if(response.data.success == false){

                self.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
           //   self.updateData.cainiaoEcList =self.updateData.cainiaoEcIds
         /*       if(self.updateData.cainiaoEcIds==undefined){
                  self.updateData.cainiaoEcList=''
                }else{
                  self.updateData.cainiaoEcList =self.updateData.cainiaoEcIds
                }
              }else if (response.data.code == 220000010) {
                self.$message({
                  type: 'warning',
                  message: '已存在相同的快递名称，请修改!'
                })
                if(self.updateData.cainiaoEcIds==undefined){
                  //  self.updateData.taobaoecIdList=''
                  self.updateData.cainiaoEcList=''
                }else{
                  self.updateData.cainiaoEcList =self.updateData.cainiaoEcIds
                }
              }else if( response.data.code ==400001) {
                self.$message({
                  type: 'warning',
                  message: '已存在相同的快递名称，请修改!'
                })
                if(self.updateData.cainiaoEcIds==undefined){
                //  self.updateData.taobaoecIdList=''
                self.updateData.cainiaoEcList=''
                }else{
                  self.updateData.cainiaoEcList =self.updateData.cainiaoEcIds
                }
              }else if(response.data.code ==110110){
                self.$message({
                  type: 'warning',
                  message: '服务异常，请重试!'
                })
                if(self.updateData.cainiaoEcIds==undefined){
                  self.updateData.cainiaoEcList=''
                }else{
                  self.updateData.cainiaoEcList =self.updateData.cainiaoEcIds
                }
              }else if(response.data.code ==100000){
                self.$message({
                  type: 'warning',
                  message: '请选择面单种类!'
                })
                self.updateData.cainiaoEcList =self.updateData.cainiaoEcIds
              }else if(response.data.code ==410003){
                self.$message({
                  type: 'warning',
                  message: '未选择电子面单种类!'
                })
                self.updateData.cainiaoEcList =self.updateData.cainiaoEcIds
              }else if(response.data.code ==220000009){
                self.$message({
                  type: 'warning',
                  message: '未选择纸质面单打印模板!'
                })
                if(self.updateData.cainiaoEcIds==undefined){
                  //  self.updateData.taobaoecIdList=''
                  self.updateData.cainiaoEcList=''
                }else{
                  self.updateData.cainiaoEcList =self.updateData.cainiaoEcIds
                }
              }*/
            }else{
              //重新渲染列表
              self.dialogFormVisiblex=false;
              self.$message({
                type: 'success',
                message: '修改成功!'
              })
              var paramData = {
                expressName:'',
                expressCoId:'',
                page: self.currentPage,
                size: self.totalPage,
              }
              self.queryFn(paramData)// 重新渲染数据
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //修改回显
      updateClick(row) {
        //this.ChangeTemplateType()
        this.terraceNumber=[{value: '', label: '全部'}],
        this.getPlatList();//订单来源
        this.getList()//店铺
        this.getexpressName();//所属快递
       // this.clickType()
        //this.clickYd()
        let self = this
        self._post('com.edb01.erp.wms.service.api.ExpressService/'+this.version+'/findExpressById',{expressId :row.expressId,merchantId:0})
          .then(function (response) {
            if (response.data.code == 0){
              self.updateData=response.data.result;
              // 显示电子面单信息
              if(self.updateData.expressType==2 ){
                self.kit=true;
                self.jd=false;
                self.taobao=false
                self.jdthree=false
              }
              if(self.updateData.expressType !=2){
                //  self.kit=false;
                var obj={};
                self.sysexPress.forEach((item,i)=>{
                  if(item.expressCoId==self.updateData.expressCoId){
                    obj=item;
                    if(obj.jdExpsheetFlag==false&&obj.tbExpsheetFlag==false){
                      //   self.activeName=['3']
                      self.jd=true;
                      self.kit=false;
                      self.taobao=false
                      self.jdthree=false
                      self.activeName = [];
                      self.activeName.push('3');
                    }else if(obj.jdExpsheetFlag==false&&obj.tbExpsheetFlag==true){
                      self.kit=false;
                      self.jd=false;
                      self.taobao=true
                      self.jdthree=false
                   //   self.activeName=['1']
                      self.activeName = [];
                      self.activeName.push('1');
                    }else if(obj.jdExpsheetFlag==true&&obj.tbExpsheetFlag==false){
                      self.kit=false;
                      self.jd=false;
                      self.taobao=false
                      self.jdthree=true
                    //  self.activeName=['2']
                      self.activeName = [];
                      self.activeName.push('2');
                    }else if(obj.jdExpsheetFlag==true&&obj.tbExpsheetFlag==true){
                      self.kit=false;
                      self.jd=false
                      self.taobao=true
                      self.jdthree=true
                     // self.activeName=['1','2']
                      self.activeName = [];
                      self.activeName.push('1','2');
                    }
                  }
                })
              }
              let  expressCoId='',type1 = '',type2 = '',expressType='';
              if (self.updateData.cainiaoFlag){
                self.function1(self.updateData.expressCoId,type1,type2,self.updateData.expressType,self.updateData.cainiaoPrintTmplType)
                self.function1(self.updateData.expressCoId,self.updateData.expressType,self.updateData.cainiaoPrintTmplType,1)
              }
              if (self.updateData.jdThrFlag){
                self.function1(self.updateData.expressCoId,2,type2,self.updateData.expressType,2)
              }
              if (self.updateData.jdFlag){
                self.function1(self.updateData.expressCoId,2,self.updateData.expressType,2)
              } if(self.updateData.expressType==2){
                self.function1(self.updateData.expressCoId,2,self.updateData.expressType,2)
              }
            //  self.terraceNumber=self.updateData.cainiaoEcList
               //  self.updateData.cainiaoPrintTmplId=self.updateData.cainiaoPrintTmplId
              //   self.clickYd()
              /*  let value=[];
                  $('#example-post2').multiselect('dataprovider', self.platOne );
                  $('#example-post2').multiselect('select',value);
                  self.updateData.cainiaoEcIds=[]
                  for (var item of self.platOne){
                    self.updateData.cainiaoEcIds.push(item.ecId)
                  }*/
               // self.updateData.cainiaoEcIds=self.updateData.cainiaoEcList
              // self.updateData.cainiaoEcIds=[]
             /* if(self.updateData.cainiaoEcList==undefined){
                self.terraceNumber=[{value: '', label: '全部'}]
               /!* $('#example-post2').multiselect('dataprovider', self.platOne );
                $('#example-post2').multiselect('select',value);*!/
              }else{
                //self.terraceNumber
               /!* self.updateData.cainiaoEcList.forEach((item)=>{
                  $('#example-post2').multiselect('select',item);
              })*!/
              }*/
            }else{
              self.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //参数
      function1(expressCoId,type1,type2,expressType){
       // console.log('yang1',expressCoId, printTmpType,type1,type2,expressType);
        let self = this
        if (type2) {
          self.changeData(expressCoId,type1,expressType)
          self.changeData( expressCoId,type2,expressType)
        }else{
          self.changeData( expressCoId,type1,type2,expressType)
        }
      },

      //被引用的
      changeData(a,b,c){
        let self=this
        var oneData = {
          merchantId: 0, // 商户Id
          expressCoId:a,//系统快递Id
          printTmpType:b, //打印模板类型 1 菜鸟 2 软件
          expressType:c,//运单类型1.电子2.纸质
        }
        if(self.updateData.expressCoId !=''&&self.updateData.cainiaoPrintTmplType=='') {
          if (self.updateData.jdThrFlag==true) {
            oneData.printTmpType= 2
            oneData.expressType=self.updateData.expressType
          }
          if (self.updateData.jdFlag==true) {
            oneData.printTmpType= 2
            oneData.expressType=self.updateData.expressType
          }
          if(self.updateData.expressType == 2){
            oneData.printTmpType= 2
            oneData.expressType=self.updateData.expressType
          }
        }if (self.updateData.expressCoId !=''&&self.updateData.cainiaoPrintTmplType==1){
          if (self.updateData.cainiaoFlag==true) {
            oneData.printTmpType= 1
          }
          if (self.updateData.jdThrFlag==true) {
            oneData.printTmpType= 2
          }
          if (self.updateData.jdFlag==true) {
            oneData.printTmpType= 2
          }
          if(self.updateData.expressType == 2){
            oneData.printTmpType= 2
          }
        }if (self.updateData.expressCoId !=''&&self.updateData.cainiaoPrintTmplType==2) {
          if (self.updateData.cainiaoFlag==true) {
            oneData.printTmpType= 2
            oneData.expressType=self.updateData.expressType
          }
          if (self.updateData.jdThrFlag==true) {
            oneData.type = 2
          }
        }
        self._post('com.edb01.erp.wms.service.api.PrintTemplService/'+this.version+'/getExpressPrintTempl',oneData)
          .then(function (response) {
            if (response.data.code == 0) {
              self.Templates = response.data.result;
              self.taobTemplates = response.data.result;
              self.jdthrTemplates = response.data.result;
              self.jdTemplates = response.data.result;
            } else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      //判断是否绑定信息删除
      deleteNew(row){
        if(row.status==true){
          this.$message({
            message: '启用状态快递不能删除，请停用后再删除!',
            type: 'warning'
          });
          return false

        }
        var self = this;
        self.newExpress=row.expressId;
        self._post('com.edb01.erp.wms.service.api.ExpressService/'+this.version+'/checkBindStorage',{expressId:row.expressId})
          .then(function (response) {
            if(response.data.result ==true){
             self.deleteWindow=true
            }else{
              self.delWindow=true
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //删除绑定关系
      deleteAll(){
        var self = this;
        self._post('com.edb01.erp.wms.service.api.ExpressService/'+this.version+'/delete',{expressId:self.newExpress,merchantId:0})
          .then(function (response) {
            if(response.data.code === 0){
              self.deleteWindow = false;
            }else{
              self.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //删除绑定关系-直接删除
      delExpress(){
        var self = this;
          self._post('com.edb01.erp.wms.service.api.ExpressService/'+this.version+'/checkAndDelete',{expressId:self.newExpress,merchantId:0})
            .then(function(res) {
              if (res.data.success == true){
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                var paramData = {
                  expressName:'',
                  expressCoId:'',
                  page: self.currentPage,
                  size: 15,
                }
                self.queryFn(paramData)// 重新渲染数据
                self.delWindow=false
                self.deleteWindow = false;
              } else{
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              }
            })
            .catch(function(err) {
              console.log(err)
            })
      },

      //添加数据
      addDall() {
        //  菜鸟模板的传参
        if(this.addData.printTmpType == 1){
          for (var i=0; i<this.taobTemplates.length;i++) {
            if (this.addData.printTmplName == this.taobTemplates[i].printTmplName) {
              this.addData.printTmplUrl = this.taobTemplates[i].printTmplUrl
              this.addData.cainiaoPrintTmplId=''
              break;
            }
          }
        } else {
          for (var i=0; i<this.taobTemplates.length;i++) {
            if (this.addData.printTmplName == this.taobTemplates[i].printTmplName ) {
              this.addData.cainiaoPrintTmplId=this.taobTemplates[i].printTmplId
              this.addData.printTmplUrl = ''
              break;
            }
          }
        }

        var self = this
        if(self.addData.expressType==2){
          self.addData.cainiaoFlag = false // 菜鸟多选框
          self.addData.jdThrFlag = false// 京东第三方多选框
          self.addData.jdFlag = false // 是否使用京东面单
          self.addData.expressId = '', //快递Id  --新增不填
            self.addData.ecId ='', //电商平台id--京东和京东第三方
            self.addData.cainiaoFlag =false, //是否使用菜鸟电子面单
            self.addData.tmallShopId ='',//淘宝平台店铺Id
            self.addData.cainiaoPrintTmplType = '', //菜鸟打印模板类型
            self.addData.cainiaoPrintTmplId = '',//菜鸟打印模板Id
            self.addData.jdThrFlag =false, //京东第三方电子面单
            self.addData.jdThrShopId = '',//京东第三方授权店铺Id
            self.addData.jdExpressType ='',//京东第三方快件种类
            self.addData.jdThrPrintTmplId = '', //京东打印模板Id
            self.addData.jdshopId = '', //京东授权店铺Id
            self.addData.jdFlag=false, //是否使用京东电子面单
            self.addData.jdPrintTmplId= '', //京东打印模板Id
            self.addData.merchantCode='', //京东商户code
            self.addData.cainiaoEcIds= '' //菜鸟电子面单平台ids 逗号分隔
          self.addData.cainiaoPrintTmplId=''
        }
        if (self.addData.expressName=='') {
          self.$message({
            message: '请填写快递名称!',
            type: 'warning'
          })
          return false
        } else if (self.addData.expressName.length > 15) {
          self.$message({
            message: '快递名称最多可输入15个汉字',
            type: 'warning'
          })
          return false
        }
        // 请选择所属快递不能为空
        if (!self.addData.expressCoId) {
          self.$message({
            message: '请选择所属快递！',
            type: 'warning'
          })
          return false
        }
        if (!self.addData.expressType) {
          self.$message({
            message: '请选择运单类型！',
            type: 'warning'
          })
          return false
        }

        if(self.addData.ecId==17 && $('#example-post').val().includes('17')){
          if(self.addData.cainiaoFlag==true&&self.addData.jdThrFlag==true){
            self.$message({
              message:' 京东平台订单不可同时使用菜鸟和京东第三方电子面单!',
              type:'warning'
            })
            return false
          }
        }
        if(self.addData.expressType==2){
          if(self.addData.pagePrintTmplId==''){
            self.$message({
              message:'请选择打印模板！',
              type:'warning'
            })
            return false
          }
        }
        // 菜鸟电子面单中的表单验证
        if(self.addData.cainiaoFlag==true){
          if(self.addData.tmallShopId==''){
            self.$message({
              message:'请选择授权店铺！',
              type:'warning'
            })
            return false
          }
          // 订单来源校验
          if(self.addData.cainiaoEcIds==''){
            self.$message({
              message:'请选择订单来源！',
              type:'warning'
            })
            return false
          }
          if(!self.addData.cainiaoPrintTmplType){
            self.$message({
              message:'请选择打印模板类型！',
              type:'warning'
            })
            return false
          }
         /* if(self.addData.pagePrintTmplId==''){
            alert('2')
            self.$message({
              message:'请选择打印模板！',
              type:'warning'
            })
            return false
          }*/
        }
        if(!self.addData.tmallShopId==''){
          if(self.addData.cainiaoFlag==false){
            self.$message({
              message:'请选择使用菜鸟或京东平台的电子面单！',
              type:'warning'
            })
            return false
          }
        } if(!self.addData.printTmpType==''){
          if(self.addData.cainiaoFlag==false){
            self.$message({
              message:'请选择使用菜鸟或京东平台的电子面单！',
              type:'warning'
            })
            return false
          }
        }
        if(!self.addData.taobtmplName==''){
          if(self.addData.cainiaoFlag==false){
            self.$message({
              message:'请选择使用菜鸟或京东平台的电子面单！',
              type:'warning'
            })
            return false
          }
        }
        //  京东第三方表单验证
        if(self.addData.jdThrFlag==true){
          /*   if(self.addData.jdThrShopId==''){
               self.$message({
                 message:'请选择授权店铺！',
                 type:'warning'
               })
               return false
             }*/
          if(self.addData.ecId==''){
            self.$message({
              message:'请选择订单来源！',
              type:'warning'
            })
            return false
          }
          if(self.addData.jdExpressType==''){
            self.$message({
              message:'请选择快件种类！',
              type:'warning'
            })
            return false
          }
          if(self.addData.jdThrPrintTmplId==''){
            self.$message({
              message:'请选择打印模板！',
              type:'warning'
            })
            return false
          }
        }
        if(self.addData.jdThrShopId!=''){
          if(self.addData.jdThrFlag==false){
            self.$message({
              message:'请选择使用菜鸟或京东平台的电子面单！',
              type:'warning'
            })
            return false
          }
        }
        if(self.addData.ecId!=''){
          if(self.addData.jdThrFlag==false){
            self.$message({
              message:'请选择使用菜鸟或京东平台的电子面单！',
              type:'warning'
            })
            return false
          }
        }
        if(self.addData.jdThrPrintTmplId!=''){
          if(self.addData.jdThrFlag==false){
            self.$message({
              message:'请选择使用菜鸟或京东平台的电子面单！',
              type:'warning'
            })
            return false
          }
        }
        // 京东电子面单验证
        if(self.addData.jdFlag==true){
          if(self.addData.jdshopId == ''){
            self.$message({
              message:'请选择授权店铺！',
              type:'warning'
            });
            return false
          }
          if(!self.addData.jdPrintTmplId){
            self.$message({
              message:'请选择打印模板！',
              type:'warning'
            })
            return false
          }
          if(self.addData.merchantCode==''){
            self.$message({
              message:'请填写商家编号！',
              type:'warning'
            })
            return false
          }
        }
        if(self.addData.jdPrintTmplId !=''){
          if(self.addData.jdFlag==false){
            self.$message({
              message:'未选择京东电子面单种类！',
              type:'warning'
            })
            return false
          }
        }
        if(self.addData.jdShopId!=''){
          if(self.addData.jdFlag==false){
            self.$message({
              message:'未选择京东电子面单种类！',
              type:'warning'
            })
            return false
          }
        }
        if(self.addData.merchantCode!=''){
          if(self.addData.jdFlag==false){
            self.$message({
              message:'未选择京东电子面单种类！',
              type:'warning'
            })
            return false
          }
        }
        if(self.addData.cainiaoFlag==true){
          self.addData.cainiaoEcIds=$('#example-post').val()
        }else{
          self.addData.cainiaoEcIds=''
        }
        if(self.addData.jdThrFlag==true){
          self.addData.jdExpressType=self.addData.jdExpressType
        }else{
          self.addData.jdExpressType=''
        }
        self._post('com.edb01.erp.wms.service.api.ExpressService/'+this.version+'/add',self.addData)
          .then(function (response) {
            if(response.data.code == 220000008){
              self.$message({
                type: 'warning',
                message: '请选择使用菜鸟或京东平台的电子面单!'
              })
            }if (response.data.code == 220000010) {
              self.$message({
                type: 'warning',
                message: '已存在相同的快递名称，请修改!'
              })
            }if (response.data.code == 91880001) {
              self.$message({
                type: 'warning',
                message: '服务端异常!'
              })
            }if (response.data.code == 220000009) {
              self.$message({
                type: 'warning',
                message: '未选择纸质面单打印模板!'
              })
            }if (response.data.code == 220000004) {
              self.$message({
                type: 'warning',
                message: '京东平台订单不可同时使用菜鸟和京东第三方电子面单!'
              })
            }if(response.data.code==0){
              if(response.data.success==true){
                //重新渲染列表
                var paramData = {
                  expressName:'',
                  expressCoId:'',
                  page: self.currentPage,
                  size: self.totalPage,
                }
                self.dialogFormVisible=false;
                self.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                self.queryFn(paramData)// 重新渲染数据
                if(self.expressType==1){
                  self.newPaper=true
                }
              }else{
                self.$message({
                  message: '添加失败，请重试！',
                  type: 'warning'
                });
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      //添加之前清空数据
      handleAdd() {
          //快递
          setTimeout(()=>{
            $('#example-post').multiselect({
              onInitialized: function(select, container) {
                //改变滚动条样式
                $("._scroll").yi_scroll({
                  barColor:'hsla(220,4%,58%,.3)'
                });
              },
            });
          })
          this.getList();//调用授权店铺
          // 清空之前输入的项
          this.kit = false
          this.activeName =['1','2']
          this.taobao = true
          this.jdthree = true
          this.jd = false
          this.getPlatList()
          this.getexpressName()
          this.addData.cainiaoFlag = false // 菜鸟多选框
          this.addData.jdThrFlag = false// 京东第三方多选框
          this.addData.jdFlag = false // 是否使用京东面单
          this.addData.expressId = '', //快递Id  --新增不填
          this.addData.expressCoId = '', //快递公司Id
          this.addData.ecId ='', //电商平台id--京东和京东第三方
          this.addData.expressName = '',//快递名称
          this.addData.expressType = '', //运单类型
          this.addData.cainiaoFlag =false, //是否使用菜鸟电子面单
          this.addData.tmallShopId ='',//淘宝平台店铺Id
          this.addData.cainiaoPrintTmplType = '', //菜鸟打印模板类型
          this.addData.cainiaoPrintTmplId = '',//菜鸟打印模板Id
          this.addData.jdThrFlag =false, //京东第三方电子面单
          this.addData.jdThrShopId = '',//京东第三方授权店铺Id
          this.addData.jdExpressType ='',//京东第三方快件种类
          this.addData.jdThrPrintTmplId = '', //京东打印模板Id
          this.addData.jdFlag=false, //是否使用京东电子面单
          this.addData.jdShopId='', //京东授权店铺Id
          this.addData.jdPrintTmplId= '', //京东打印模板Id
          this.addData.merchantCode='', //京东商户code
          this.addData.pagePrintTmplId= '',//纸质面单打印模板Id
          this.addData.cainiaoEcIds= '' //菜鸟电子面单平台ids 逗号分隔
          this.addData.cainiaoPrintTmplId=''
          let self = this
          self.accordion = 'false'
          self.success = false
          self.dialogFormVisible = true// 显示弹层
          self.addData.expressType = 1  // 运单类型
          self.addData.jdExpressType=1
          self.addData.tmallShopId=''//淘宝授权店铺
      },

      //switch开关是否停用
      switchChange(row){
        let self = this
        if (row.status == true) {
          self.clickStop(row)
        }else{
          self.formData.page = self.currentPage;
          self.formData.size = self.totalPage;
          self.$confirm('是否停用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center:true
          }).then(() => {
            self._post('com.edb01.erp.wms.service.api.ExpressService/'+this.version+'/editIsEnable',{expressId:row.expressId,status:false,merchantId:0})
              .then(function(res) {
                if (res.data.success == true){
                  self.$message({// 给用户一个提示
                    message: '已停用',
                    type: 'success'
                  });
                  row.status = false
                  // 重新渲染列表
                  var paramData = {
                    expressName:'',
                    expressCoId:'',
                    page: self.currentPage,
                    size: 15,
                  }
                  self.queryFn(paramData)// 重新渲染数据
                }else  if (res.data.success == false){
                  if(res.data.code ==0){
                   self.$message({// 给用户一个提示
                    message: '停用失败',
                    type: 'warning'
                  });
                  row.status = true
                  // 重新渲染列表
                  var paramData = {
                    expressName:'',
                    expressCoId:'',
                    page: self.currentPage,
                    size: 15,
                  }
                  self.queryFn(paramData)// 重新渲染数据
                  }else if(res.data.code ==410006){
                    row.status = true
                    self.defaultShop=res.data.result
                    self.centerDialogVisible = true
                  }else if(res.data.code ==220000016){
                    row.status = true
                    self.$message({
                      type: 'warning',
                      message: '有使用该快递的订单还未发货，请在发货完成后再关闭!'
                    })
                  }else if(res.data.code ==220000014){
                    row.status = true
                    self.defaultShop=res.data.result
                    self.centerDialogVisible = true
                  }else if(res.data.code ==220000017){
                    row.status = true
                    self.$message({
                      type: 'warning',
                      message: '指定快递在订单标记超重规则中被使用!'
                    })
                  }
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          }).catch(() => {
            row.status = true
            self.$message({
              type: 'info',
              message: '已取消停用'
            });
          });
        }
      },

      //switch开关是否启用
      clickStop(row) {
        let self = this
        self.formData.page = self.currentPage
        self.formData.size = self.totalPage
        self.$confirm('是否启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true
        }).then(() => {
          // 发请求
          self._post('com.edb01.erp.wms.service.api.ExpressService/'+this.version+'/editIsEnable',{expressId:row.expressId,status:true,merchantId:0})
            .then(function(res) {
              if (res.data.code == 0) {
                self.$message({// 给用户一个提示
                  message: '已启用',
                  type: 'success'
                })
                row.status = true
              } else {
                self.$message({
                  message: res.data.message,// 如果code为其他，弹出错误码
                  type: 'warning'
                })
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }).catch(() => {
          row.status = false
          self.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      },

      // 当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.paramData.page = this.currentPage;
        this.paramData.size = this.totalPage;
        this.paramData.clToken = this.token;
        this.queryFn(this.paramData); // 请求数据
      },

      // 每页多少条
      handleSizeChange(val) {
        //存储每页数量
        this.totalPage = val;
        this.paramData.page = this.currentPage;
        this.paramData.size = this.totalPage;
        this.paramData.clToken = this.token;
        this.queryFn(this.paramData);// 请求数据
      },

    },
    // 获取列表
    created() {
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight // 页面高度
        var b = document.getElementById('fitTable').offsetTop // 表格距离顶部的距离
        this.table_h = a - b - 70
      })
      var self = this;
      var paramData = {
        page: self.currentPage,
        expressName:'',
        expressCoId:'',
        size: self.totalPage,
        merchantId:0
      }
      this.queryFn = (paramData) => {
        self._post('com.edb01.erp.wms.service.api.ExpressService/'+this.version+'/showExpress',paramData)
          .then(function (response) {
            if (response.data.code == 0) {
              self.tableData = response.data.result.rows;
              self.totalNum = response.data.result.total; // 数据的总条数
            } else {
              self.$message({
                message: response.data.result.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.queryFn(paramData);
    }
  }
</script>
<style>
  .addExpress .el-collapse-item__wrap{
    overflow:inherit;
  }
  #express .header .el-dialog__body {
    padding: 30px 0px !important;
  }
  #express .el-dialog__body {
    padding: 10px 35px;
  }

  #express .el-collapse-item__wrap{
    border: none;
  }
  #express .el-collapse{
    border: none;
  }
  #express  .el-collapse-item__header{
    border: none;
  }
  #express .el-dialog__body {
    padding: 14px 0px;
  }
  #express .el-col-12 {
    width: 40%;
  }
  #express .paragraph[data-v-6588b102] {
    display: inline-block;
    width: 180px;
    text-align: right;
  }
  #express .el-collapse-item__content paragraph[data-v-6588b102] {
    display: inline-block;
    width: 180px;
    text-align: right;
  }
  #express .el-col-10 {
    width: 31.66667%;
  }
  #express .el-collapse-item__arrow {
    margin-right: 50px;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    transition: transform .3s,-webkit-transform .3s;
    float: right;
    line-height: 45px;
    font-weight: 300;
  }
 #wrapper .btn-group>.btn:first-child{
    width: 94%!important;
    height:28px;
    text-align: left;
    line-height:15px;
    border:1px solid #d8dce5;
  }
  #wrapper1 .btn-group>.btn:first-child{
    width: 94%!important;
    height:28px;
    text-align: left;
    line-height:15px;
    border:1px solid #d8dce5;
  }
  .chicun{
    width:180px!important
  }
</style>
<style scoped>

  .paragraph[data-v-8a71d564] {
    display: inline-block;
    width: 175px;
    text-align: right;
  }
  .paragraph[data-v-8d7da8cc] {
    display: inline-block;
    width: 180px;
    text-align: right;
  }
  .paragraph[data-v-69526146][data-v-69526146] {
    display: inline-block;
    width: 165px;
    text-align: right;
  }
  .paragraph[data-v-69526146] {
    display: inline-block;
    width: 120px;
    text-align: right;
  }
  .wra {
    padding: 20px 0 0 20px;
  }
  .block {
    margin: 20px 0 16px 0;
    width: 100%;
    line-height: 40px;
    height: 40px;
    background: #F7F7F7;
    padding-left: 20px;
    border:1px solid #DFDFDF;
  }
  .jd {
    margin-top: 20px;
    white-space: nowrap;
  }
  .jd-l {
    display: inline-block;
    width: 120px;
    text-align: right;
  }
  .check {
    margin-left: 60px;
  }
  .xin {
    margin: 0 10px;
    color: red;
  }
  .xin-text {
    color: #FF9933;
  }
  .input-box {
    margin: 20px 0px 0 0px;
    display: inline-block;
  }
  .input-box label {
    width: 100px;
    display: inline-block;
    background-color: red;
    float: left;
  }
  .grid-content1 bg-purple{
    min-width:200px;
    margin-left: 100px;
    display: inline-block;
    white-space: nowrap;
    text-align: right;
  }

  .grid-content1 bg-purple label{
    float: left;
    margin-left: 250px;
    line-height:50px
  }
  .oneModel span{
    font-size: 10px;
    color: red;
    margin-left: 20px;
  }
  .dav span{
    text-align: center;
  }
  .el-header {
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    color: #333;
    line-height: 30px;
    font-size: 16px;
    text-align: center;
  }
  .content-total {
    display: inline-block;
    valign:top;
  }
  .grid-content1{
    margin-top: 20px;
    white-space: nowrap;
  }
  .paragraph{
    display: inline-block;
    width: 120px;
    text-align: right;
  }
  .fot{
    font-size: 20px;
    font-weight: 300px;
  }
  .el-icon-question{
    font-size: 18px;
  }
  .el-icon-question{
    color: #d0d0d0;
  }
  .dog{
    background-color:#F4F9FF;
    min-width: 100%;
    height: 40px;
    line-height:40px;
    border-top:1px solid #E1E1E1;
    border-bottom:1px solid #E1E1E1 ;
  }
  .a{
    width: 180px;
    min-width: 120px;
  }
  .newPlan{
    width:280px;
    height: 30px;
    margin-top: 20px;
    margin-left: 130px;
  }

  .allDia{
    width: 81px;
    height: 80px
  }
  .allDia p{
    margin: -19px -49px;
  }
  .el-dialog__body {
    text-align: center;
  }
.chicun{
  width:180px!important
}
</style>
