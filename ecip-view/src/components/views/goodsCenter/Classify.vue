<!--分类管理 佩玖-->
<template>
  <div id="classify">
    <div id="searchBox">
      <div class="leftBox2"><!--查询区-->
        <el-row>
          <el-col :span="7">
            <div class="grid-content special" style="white-space: nowrap;margin-bottom: 3px!important;">
              <el-select style="width:130px!important;" v-model="searchType" clearable placeholder="请选择">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input style="width:400px!important;" @keyup.native.enter="query()"
                        placeholder="请输入"
                        v-model="serachData">
                <i
                  class="el-icon-search el-input__icon"
                  slot="prefix"
                >
                </i>
              </el-input>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="col-nav" style="margin:6px 0;">
        <ul>
          <li @click="visibleLead = true"><span>增加根分类</span></li>
        </ul>
      </div>

      <!--按钮-->
      <div class="rightBox2">
        <el-button type="primary" @click="query()">查 询</el-button>
        <el-button @click="reset()">重 置</el-button>
      </div>

      <div class="isspliec">
        <!--增加根分类-->
        <el-dialog v-dialogDrag
                   ref="test"
                   title="添加根分类"
                   :visible.sync="visibleLead"
                   width="500px"
                   :before-close="handleClose">
          <div>
            <ul class="leadUl" type="disc">
              <el-form label-width="90px" class="demo-ruleForm" :model="addData" :rules="rules" ref="addData">
                <el-form-item label="分类编码" prop="category_code">
                  <el-input type="text" placeholder="最多输入20个字符" v-model="addData.category_code" style="width: 100%"
                            :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="分类名称" prop="category_cn_name">
                  <el-input type="text" placeholder="最多输入10个字符" v-model="addData.category_cn_name" style="width: 100%"
                            :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="category_en_name">
                  <el-input type="text" placeholder="" v-model="addData.category_en_name" style="width: 100%"
                            :maxlength="20"></el-input>
                </el-form-item>

                <el-form-item label="启用状态" prop="status">
                  <el-select v-model="addData.status" filterable placeholder="请选择" style="width: 100%!important;">
                    <el-option
                      v-for="item in optionsStock1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" placeholder="请输入备注" v-model="addData.remark" style="width: 100%"
                            :maxlength="200"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;text-align: center">
                  <el-button type="plain" @click="handleClose()">取消</el-button>
                  <el-button type="primary" @click="sure('addData',1)" :loading="isloading">确定</el-button>
                </el-form-item>
              </el-form>
            </ul>
          </div>
        </el-dialog>
        <!-- 增加子分类-->
        <el-dialog v-dialogDrag
                   title="添加子分类"
                   :visible.sync="visibleLead2"
                   width="500px"
                   :before-close="handleClose2">
          <div>
            <ul class="leadUl" type="disc">
              <el-form label-width="90px" class="demo-ruleForm" :model="addData" :rules="rules" ref="addData">

                <el-form-item label="分类编码" prop="category_code">
                  <el-input type="text" placeholder="最多输入20个字符" v-model="addData.category_code" style="width: 100%"
                            :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="分类名称" prop="category_cn_name">
                  <el-input type="text" placeholder="最多输入10个字符" v-model="addData.category_cn_name" style="width: 100%"
                            :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="category_en_name">
                  <el-input type="text" placeholder="" v-model="addData.category_en_name" style="width: 100%"
                            :maxlength="20"></el-input>
                </el-form-item>

                <el-form-item label="上级分类" prop="category_cn_name1">
                  <el-input type="text" placeholder="请输入" v-model="category_cn_name1" style="width: 100%"
                            :disabled="true"
                            :maxlength="200"></el-input>
                </el-form-item>


                <el-form-item label="启用状态" prop="status">
                  <el-select v-model="addData.status" filterable placeholder="请选择仓库" style="width: 100%!important;">
                    <el-option
                      v-for="item in optionsStock1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" placeholder="请输入入库备注" v-model="addData.remark" style="width: 100%"
                            :maxlength="200"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;text-align: center">
                  <el-button type="plain" @click="handleClose2()">取消</el-button>
                  <el-button type="primary" @click="sure('addData',2)" :loading="isloading">确定</el-button>
                </el-form-item>
              </el-form>
            </ul>
          </div>
        </el-dialog>
        <!-- 编辑-->
        <el-dialog v-dialogDrag
                   title="编 辑"
                   :visible.sync="visibleLead3"
                   width="500px"
                   :before-close="handleClose3">
          <div>
            <ul class="leadUl" type="disc">
              <el-form label-width="90px" class="demo-ruleForm" :model="addData" :rules="rules" ref="addData">

                <el-form-item label="分类编码" prop="category_code">
                  <el-input type="text" placeholder="最多输入20个字符" v-model="addData.category_code" style="width: 100%"
                            :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="分类名称" prop="category_cn_name">
                  <el-input type="text" placeholder="最多输入10个字符" v-model="addData.category_cn_name" style="width: 100%"
                            :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="category_en_name">
                  <el-input type="text" placeholder="" v-model="addData.category_en_name" style="width: 100%"
                            :maxlength="20"></el-input>
                </el-form-item>

                <el-form-item label="上级分类" prop="category_cn_name1">
                  <el-input type="text" placeholder="请输入" v-model="category_cn_name1" style="width: 100%"
                            :disabled="true"
                            :maxlength="200"></el-input>
                </el-form-item>


                <el-form-item label="启用状态" prop="status">
                  <el-select v-model="addData.status" filterable placeholder="请选择仓库" style="width: 100%!important;">
                    <el-option
                      v-for="item in optionsStock1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" placeholder="请输入入库备注" v-model="addData.remark" style="width: 100%"
                            :maxlength="200"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;text-align: center">
                  <el-button type="plain" @click="handleClose3()">取消</el-button>
                  <el-button type="primary" @click="sure('addData',3)" :loading="isloading">确定</el-button>
                </el-form-item>
              </el-form>
            </ul>
          </div>
        </el-dialog>
        <!-- 增加商品属性-->
        <el-dialog v-dialogDrag
                   title="增加商品属性"
                   :visible.sync="visibleLead4"
                   width="500px"
                   :before-close="handleClose4">
          <div>
            <ul>
              <el-form label-width="90px" class="demo-ruleForm" :model="addData1" :rules="rules1" ref="addData1">

                <el-form-item label="分类名称" prop="category_cn_name">
                  <el-input type="text" placeholder="最多输入20个字符" v-model="addData1.category_cn_name" style="width: 100%"
                            :maxlength="20" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="属性名称" prop="attr_name">
                  <el-input type="text" placeholder="最多输入10个字符" v-model="addData1.attr_name" style="width: 100%"
                            :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="属性别名" prop="attr_name_alias">
                  <el-input type="text" placeholder="" v-model="addData1.attr_name_alias" style="width: 100%"
                            :maxlength="20"></el-input>
                </el-form-item>


                <el-form-item label="属性类型" prop="attr_input_type">
                  <el-select v-model="addData1.attr_input_type" filterable placeholder="请选择"
                             style="width: 100%!important;">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="属性值" :prop="item.attr_value" v-for="(item,i) in datas" :key="i"
                              v-if="addData1.attr_input_type == 1 || addData1.attr_input_type == 2">
                  <ul style="width:100%;">
                    <li>
                      <el-input type="text" placeholder="请输入" v-model="item.attr_value"
                                style="width:80%;margin-left: 5px"
                                :maxlength="20">
                      </el-input>
                      <i class="el-icon-circle-plus" style="font-size: 22px;cursor: pointer;position: relative;top:4px;" v-if="i == datas.length-1" @click="plus(i)"></i>
                      <i class="el-icon-circle-close" style="font-size: 22px;color: red;cursor: pointer;position: relative;top:4px;" v-if="datas.length > 1" @click="close(i)"></i>
                    </li>
                  </ul>

                </el-form-item>
                <el-form-item style="width:100%;text-align: center">
                  <el-button type="plain" @click="handleClose4()">取消</el-button>
                  <el-button type="primary" @click="sure('addData1',4)" :loading="isloading">确定</el-button>
                </el-form-item>
              </el-form>
            </ul>
          </div>
        </el-dialog>
      </div>
      <!--  列表-->
      <div>
        <el-table
          :data="tableData5"
          border
          ref="itoktab"
          id="fitTable5"
          :height="table_h5"
          tooltip-effect="dark"
          row-key="category_id"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          style="width: 100%">
          <el-table-column
            align="center"
            label="分类名称"
            prop="category_cn_name"
            min-width="120">
          </el-table-column>

          <el-table-column
            prop="category_code"
            align="center"
            min-width="100"
            label="分类编码">
          </el-table-column>

          <el-table-column
            prop="category_en_name"
            align="center"
            label="英文名称"
            min-width="100">
          </el-table-column>

          <el-table-column
            prop="created"
            align="center"
            label="创建时间"
            min-width="100">
          </el-table-column>

          <el-table-column
            prop="modified"
            align="center"
            label="更新时间"
            min-width="100">
          </el-table-column>

          <el-table-column
            align="center"
            label="启用状态"
            min-width="70">
            <template slot-scope="scope">
              <span class="cen-g" v-if="scope.row.status">启用</span>
              <span class="cen-g" v-if="!scope.row.status">未启用</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="排序"
            min-width="100">
            <template slot-scope="scope">
              <span class="el-icon-bottom" style="font-weight: 700;font-size: 16px;cursor: pointer"
                    v-if="(scope.row.index < tableData5.length-1) || scope.row.canBottom || (scope.row.index < tableData5.length-1 && !tableData5[scope.$index+1].isSon)"
                    @click="goBottom(scope.row,scope.$index)"></span>
              <span class="el-icon-top" style="font-weight: 700;font-size: 16px;cursor: pointer"
                    v-if="scope.row.index > 0 || scope.row.canTop" @click="goTop(scope.row,scope.$index)"></span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="分类操作"
            min-width="130">
            <template slot-scope="scope">
              <el-button
                @click="category_cn_name1=scope.row.category_cn_name;addData.parent_id=scope.row.category_id;visibleLead2 = true"
                type="text" size="mini" v-if="!scope.row.grandson && !scope.row.isSon">添加子分类
              </el-button>
              <el-button @click="eDitor(scope.row,scope.$index)" type="text" size="mini">编辑</el-button>
              <el-button @click="Delect(scope.row,scope.$index)" type="text" size="mini" style="color: red">删除</el-button>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品属性操作"
            min-width="130">
            <template slot-scope="scope">
              <el-button @click="addBatch(scope.row,scope.$index)" type="text"
                         size="mini">增加商品属性
              </el-button>
              <el-button @click="goList(scope.row,'spu')" type="text" size="mini">属性列表</el-button>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="SKU属性操作"
            min-width="130">
            <template slot-scope="scope">
              <el-button @click="addBatch(scope.row,scope.$index,'sku')" type="text" size="mini">增加SKU属性</el-button>
              <el-button @click="goList(scope.row,'sku')" type="text" size="mini">属性列表</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->

      </div>


    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        serachData: '',
        sku:'',
        datas:[{attr_value:''}],
        isloading: false,
        addData: { //根分类参数
          method: 'category.add',
          category_code: '',
          category_cn_name: '',
          category_en_name: '',
          parent_id: '',
          status: '',
          remark: ''
        },

        addData1: { //添加属性
          attr_values:'',
          category_code:'',
          category_cn_name:'',
          attr_name_alias:'',
          attr_input_type: '',
          attr_name: '',
          attr_typ: 'spu_sale',
          category_id: '',
        },
        attr_name_alias:'',
        searchType: 1,
        category_cn_name1: '',
        custom: [{label: '分类编码', value: 1}, {label: '分类名称', value: 2}, {label: '英文名称', value: 3}],
        optionsStock1: [{label: '启用', value: true}, {label: '未启用', value: false}],//启用状态
        options: [{label: '文本', value: 0}, {label: '单选', value: 1}, {label: '多选', value: 2}],//属性
        visibleLead: false, //增加根分类
        visibleLead2: false, //增加子分类
        visibleLead3: false,
        visibleLead4: false,
        table_h5: 0,//高度
        totalNum5: 0, //总条数
        tableData5: [], //主数据
        pageSize5: 15, //当夜页条数
        curPage5: 1, //当前页
        rules: {
          category_code: [     //必选入库类型
            {trigger: 'blur', required: true, message: '请输入！'}
          ],
          category_cn_name: [         //必选仓库
            {trigger: 'blur', required: true, message: '请输入！'},
          ],
          category_en_name: [         //必选仓库
            {trigger: 'blur', required: true, message: '请输入！'},
          ],

        },//校验表单规则

        rules1: {
          attr_values: [     //必选入库类型
            {trigger: 'blur', required: true, message: '请输入！'}
          ],
          attr_input_type: [         //必选仓库
            {trigger: 'blur', required: true, message: '请输入！'},
          ],
          attr_name: [         //必选仓库
            {trigger: 'blur', required: true, message: '请输入！'},
          ],

        },//校验表单规则

      }
    },


    methods: {
      //查询
      query() {
        this.initMessages5();

      },

      plus(index){
        if(this.datas[index].attr_value){
          this.datas.push({attr_value:''} )

        }else {
          this.$message({
            message:'请输入',
            type: 'warning'
          });
        }

      },

      close(index){
        if(this.datas[index].attr_value){
          this.datas.splice(index,1)
        }

      },

      //跳转属性列表
      goList(row,val){
        if(val == 'sku'){
          this.$router.push({name:'AttribuLists',params:{category_id :row.category_id , attr_type:'sku_sale'}})
        }else {
          this.$router.push({name:'AttribuLists',params:{category_id :row.category_id , attr_type:'spu_sale'}})
        }

      },

      //新增
      sure(v, num) {
        if (num == 1) { //根
          this.$refs.addData.validate((valid) => {
            if (valid) {
              this.isloading = true
              this.addData.method = 'category.add'
              this.addData.parent_id = 0;
              this._post('/ecip.goods.center/execute', this.addData).then(res => {
                if (res.data.response.code == 0) {
                  this.$message({
                    message: res.data.response.result,
                    type: 'success'
                  });
                  this.isloading = false
                  this.initMessages5()
                  this.$nextTick(() => {
                    this.handleClose()
                  })
                } else {
                  this.isloading = false
                  this.$message({
                    message: res.data.response.result,
                    type: 'warning'
                  });
                }

              }).catch(err => {
                console.log(err);
              })
            }
          })
        } else if (num == 2) { //子
          this.$refs.addData.validate((valid) => {
            if (valid) {
              this.isloading = true;
              this.addData.method = 'category.add'
//              this.addData.parent_id = 0;
              this._post('/ecip.goods.center/execute', this.addData).then(res => {
                if (res.data.response.code == 0) {
                  this.$message({
                    message: res.data.response.result,
                    type: 'success'
                  });
                  this.isloading = false
                  this.initMessages5()
                  this.$nextTick(() => {
                    this.handleClose2()
                  })
                } else {
                  this.isloading = false;
                  this.$message({
                    message: res.data.response.result,
                    type: 'warning'
                  });
                }

              }).catch(err => {
                console.log(err);
              })


            }

          })


        } else if (num == 3) { //编辑
          this.$refs.addData.validate((valid) => {
            if (valid) {
              this.isloading = true
              this.addData.method = 'category.update'

//              delete this.addData.parent_id
              this._post('/ecip.goods.center/execute', this.addData).then(res => {
                if (res.data.response.code == 0) {
                  this.$message({
                    message: res.data.response.result,
                    type: 'success'
                  });
                  this.isloading = false
                  this.initMessages5()
                  this.$nextTick(() => {
                    this.handleClose3()
                  })
                } else {
                  this.isloading = false
                  this.$message({
                    message: res.data.response.result,
                    type: 'warning'
                  });
                }

              }).catch(err => {
                console.log(err);
              })
            }
          })
        } else if (num == 4) {  //添加属性sku，spu
          this.$refs.addData1.validate((valid) => {
            if (valid) {
              if(this.addData1.attr_input_type == 1 || this.addData1.attr_input_type == 2){
                for(var i=0;i<this.datas.length;i++){
                  if(this.datas[i].attr_value == ''){
                    this.$message({
                      message: '请输入属性值',
                      type: 'warning'
                    });
                    return
                  }
                }
              }
              this.isloading = true;
              this.addData1.attr_values = this.datas
              if(this.sku == 'sku'){
                this.addData1.attr_typ = 'sku_sale'
              }

              this._postRaw('/ecip.goods.center/execute?method=categoryattr.add',this.addData1).then(res => {
                if (res.data.response.code == 0) {
                  this.$message({
                    message: res.data.response.result,
                    type: 'success'
                  });
                  this.isloading = false
                  this.initMessages5()
                  this.$nextTick(() => {
                    this.handleClose4()
                  })
                } else {
                  this.isloading = false
                  this.$message({
                    message: res.data.response.result,
                    type: 'warning'
                  });
                }

              }).catch(err => {
                console.log(err);
              })
            }
          })


        }

      },

      //编辑
      eDitor(row) {
        this.visibleLead3 = true
        this.addData.category_code = row.category_code;
        this.addData.category_cn_name = row.category_cn_name;
        this.addData.category_en_name = row.category_en_name;
        this.category_cn_name1 = row.category_cn_name;
        this.addData.status = row.status;
        this.addData.remark = row.remark;
        if (row.isSon || row.grandson) {
          delete this.addData.parent_id;
        } else {
          this.addData.parent_id = 0;
        }

      },

      //删除
      Delect(row) {
        this.$confirm('确认删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let data = {
            method: 'category.delete',
            category_id: row.category_id
          }
          this._post('/ecip.goods.center/execute', data).then(res => {
            if (res.data.response.code == 0) {
              this.initMessages5()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }else {
              this.$message({
                type: 'warning',
                message: res.data.response.result
              });

            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      //降序
      goBottom(row, index) {
        if (!row.isSon && !row.grandson) {
          let data = {
            method: 'categorysort.update',
            category_id_a: row.category_id,
            sort_a: row.sort_order,
            category_id_b: this.tableData5[row.index + 1].category_id,
            sort_b: this.tableData5[row.index + 1].sort_order,
          }

          this._post('/ecip.goods.center/execute', data).then(res => {
            if (res.data.response.code == 0) {
              this.$message({
                message: res.data.response.result,
                type: 'success'
              });
              this.initMessages5()

            } else {
              this.$message({
                message: res.data.response.result,
                type: 'warning'
              });
            }


          }).catch(err => {
            console.log(err);
          })

        } else {
          if(row.isSon){
            let data = {
              method: 'categorysort.update',
              category_id_a: row.category_id,
              sort_a: row.sort_order,
              category_id_b: this.tableData5[row.Sindex + 1].category_id,
              sort_b: this.tableData5[row.Sindex + 1].sort_order,
            }

            this._post('/ecip.goods.center/execute', data).then(res => {
              if (res.data.response.code == 0) {
                this.$message({
                  message: res.data.response.result,
                  type: 'success'
                });

                this.initMessages5()

              } else {
                this.$message({
                  message: res.data.response.result,
                  type: 'warning'
                });
              }


            }).catch(err => {
              console.log(err);
            })
          }else{
            let data = {
              method: 'categorysort.update',
              category_id_a: row.category_id,
              sort_a: row.sort_order,
              category_id_b: this.tableData5[row.Sfindex + 1].category_id,
              sort_b: this.tableData5[row.Sfindex + 1].sort_order,
            }
            this._post('/ecip.goods.center/execute', data).then(res => {
              if (res.data.response.code == 0) {
                this.$message({
                  message: res.data.response.result,
                  type: 'success'
                });

                this.initMessages5()

              } else {
                this.$message({
                  message: res.data.response.result,
                  type: 'warning'
                });
              }


            }).catch(err => {
              console.log(err);
            })
          }



        }

      },

      //升序
      goTop(row, index) {
        if (!row.isSon && !row.grandson) {
          let data = {
            method: 'categorysort.update',
            category_id_a: row.category_id,
            sort_a: row.sort_order,
            category_id_b: this.tableData5[row.index - 1].category_id,
            sort_b: this.tableData5[row.index - 1].sort_order,
          }

          this._post('/ecip.goods.center/execute', data).then(res => {
            if (res.data.response.code == 0) {
              this.$message({
                message: res.data.response.result,
                type: 'success'
              });
              this.initMessages5()

            } else {
              this.$message({
                message: res.data.response.result,
                type: 'warning'
              });
            }


          }).catch(err => {
            console.log(err);
          })

        } else {
          if(row.isSon){
            let data = {
              method: 'categorysort.update',
              category_id_a: row.category_id,
              sort_a: row.sort_order,
              category_id_b: this.tableData5[row.Sindex - 1].category_id,
              sort_b: this.tableData5[row.Sindex - 1].sort_order,
            }
            this._post('/ecip.goods.center/execute', data).then(res => {
              if (res.data.response.code == 0) {
                this.$message({
                  message: res.data.response.result,
                  type: 'success'
                });

                this.initMessages5()

              } else {
                this.$message({
                  message: res.data.response.result,
                  type: 'warning'
                });
              }


            }).catch(err => {
              console.log(err);
            })
          }else{
            let data = {
              method: 'categorysort.update',
              category_id_a: row.category_id,
              sort_a: row.sort_order,
              category_id_b: this.tableData5[row.Sfindex - 1].category_id,
              sort_b: this.tableData5[row.Sfindex - 1].sort_order,
            }

            this._post('/ecip.goods.center/execute', data).then(res => {
              if (res.data.response.code == 0) {
                this.$message({
                  message: res.data.response.result,
                  type: 'success'
                });

                this.initMessages5()

              } else {
                this.$message({
                  message: res.data.response.result,
                  type: 'warning'
                });
              }


            }).catch(err => {
              console.log(err);
            })
          }



        }


      },

      //增加商品属性
      addBatch(row,index,v) {
        this.visibleLead4 = true;
        this.addData1.category_cn_name = row.category_cn_name;
        this.addData1.category_id = row.category_id;
        this.addData1.category_code = row.category_code;
        this.sku = v
      },

      handleClose() {
        this.addData.category_code = '';
        this.addData.category_cn_name = '';
        this.addData.category_en_name = '';
        this.addData.parent_id = '';
        this.category_cn_name1 = '';
        this.addData.status = '';
        this.addData.remark = '';
        this.visibleLead = false;
        this.$refs.addData.clearValidate()
      },

      handleClose2() {
        this.addData.category_code = '';
        this.addData.category_cn_name = '';
        this.addData.category_en_name = '';
        this.addData.parent_id = '';
        this.category_cn_name1 = '';
        this.addData.status = '';
        this.addData.remark = '';
        this.visibleLead2 = false;
        this.$refs.addData.clearValidate()
      },

      handleClose3() {
        this.addData.category_code = '';
        this.addData.category_cn_name = '';
        this.addData.category_en_name = '';
        this.addData.parent_id = '';
        this.category_cn_name1 = '';
        this.addData.status = '';
        this.addData.remark = '';
        this.visibleLead3 = false;
        this.$refs.addData.clearValidate()

      },

      handleClose4() {
//        console.log(this.addData1.attr_values);
//        this.addData1.attr_values = [];
        this.addData1.attr_input_type = '';
        this.addData1.attr_name = '';
        this.addData1.category_id = '';
        this.addData1.category_code = '';
        this.datas.length = 1;
        this.visibleLead4 = false;
        this.$refs.addData1.clearValidate()

      },

      //重置
      reset() {
        this.searchType = 1;
        this.serachData = ''

      },

      //初始化数据
      initMessages5() {
        console.log('5');
        let data = {
          method: 'category.get',
//          category_en_name:'',
//          category_code:'',
//          category_cn_name:''
        };

//        if(this.searchType == 1){
//          data.category_code = this.serachData
//        }else if(this.searchType == 2){
//          data.category_cn_name = this.serachData
//        }else{
//          data.category_en_name = this.serachData
//        }
        this._post('/ecip.goods.center/execute', data)
          .then(res => {
            if (res.data.response.code == 0) {
              this.tableData5 = res.data.response.result;
              this.totalNum5 = res.data.response.total;
              this.tableData5.forEach((item, i) => {
                item.index = i
                if (item.children) {
                  item.children.forEach((val, j) => {
                    val.isSon = true;
                    val.Sindex = j
                    if (j < item.children.length - 1) {
                      val.canBottom = true
                    }
                    if (j > 0) {
                      val.canTop = true
                    }
                    if (val.children) {
                      val.children.forEach((val2, k) => {
                        val2.grandson = true;
                        val2.Sfindex = k;
                        if (k < val.children.length - 1) {
                          val2.canBottom = true
                        }
                        if (k > 0) {
                          val2.canTop = true
                        }
                      })
                    }

                  })


                }

              })

            }
          })


      },

      //当前页多少
      handleSizeChange(val) {
        this.pageSize5 = val
        this.area1.Size = val;
        this.initMessages5();


      },

      // 跳到第几页
      handleCurrentChange(val) {
        this.area1.page = val;
        this.curPage5 = val;
        this.initMessages5()


      },


    },

    mounted() {
      this.$nextTick(function () {
        this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 70;

      })

      this.initMessages5() //主数据


    },


  }
</script>
<style scoped>

</style>
<style>
  #classify .btn-group > .btn:first-child {
    width: 200px;
    height: 28px;
    text-align: left;
    line-height: 15px;
    border: 1px solid #d8dce5;
  }

  #classify .input-box .el-input__inner {
    padding: 0 5px !important;
    font-size: 12px !important;
  }

  @media screen and (max-width: 1550px) {
    #classify .special .special1 .el-input__inner {
      width: 110px !important;

    }
  }

  #classify .el-date-editor .el-range-input, .el-date-editor .el-range-separator {
    font-size: 12px;
  }

  #classify .isspliec .el-dialog__body {
    padding: 20px !important;
  }

  #classify .el-range-editor.el-input__inner {
    padding: 3px 2px;
    padding-left: 0;

  }

  #classify .cell .el-table__expand-icon .el-icon-arrow-right {

    font-weight: 700 !important;
    color: #211cff !important;
  }

</style>
