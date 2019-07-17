<!--分类管理 佩玖-->
<template>
  <div id="AttribuLists">
    <el-breadcrumb separator=">" style="margin-bottom:30px">
      <el-breadcrumb-item :to="{ path: '/Classify' }">返回</el-breadcrumb-item>
      <el-breadcrumb-item>属性列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div id="searchBox">
      <div class="leftBox2"><!--查询区-->
        <el-row>
          <el-col :span="10">
            <div class="grid-content special" style="white-space: nowrap;margin-bottom: 3px!important;">
              <el-select style="width:130px!important;" v-model="searchType" placeholder="请选择">
                <el-option
                  v-for="item in custom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input @keyup.native.enter="query()"
                        style="width: 400px;!important;"
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

      <!--按钮-->
      <div class="rightBox2">
        <el-button type="primary" @click="query()">查 询</el-button>
        <el-button @click="reset()">重 置</el-button>
      </div>

    </div>


    <div class="col-nav" style="margin:6px 0;">
      <ul>

      </ul>
    </div>

    <div class="isspliec">
      <!-- 编辑商品属性-->
      <el-dialog v-dialogDrag
                 title="编 辑"
                 :visible.sync="visibleLead4"
                 width="500px"
                 :before-close="handleClose4">
        <div>
          <ul class="leadUl" type="disc">
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

              <el-form-item label="属性值" prop="item.attri_value" v-for="(item,i) in datas" :key="i"
                            v-if="addData1.attr_input_type == 1 || addData1.attr_input_type == 2">
                <ul style="width:100%;">
                  <li>
                    <el-input type="text" placeholder="请输入" v-model="item.attri_value"
                              style="width:80%;margin-left: 5px"
                              :maxlength="200"></el-input>
                    <i class="el-icon-circle-plus" style="font-size: 22px;cursor: pointer;position: relative;top:4px;"
                       v-if="i == datas.length-1" @click="plus(i)"></i>
                    <i class="el-icon-circle-close"
                       style="font-size: 22px;color: red;cursor: pointer;position: relative;top:4px;" v-if="i > 0"
                       @click="close(i)"></i>
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
        style="width: 100%">

        <el-table-column
          label="序号"
          width="45"
          type="index"
          align="center">
        </el-table-column>

        <el-table-column
          prop="category_code"
          align="center"
          min-width="100"
          label="分类编码">
        </el-table-column>

        <el-table-column
          prop="category_cn_name"
          align="center"
          min-width="100"
          label="分类名称">
        </el-table-column>

        <el-table-column
          prop="attr_name"
          align="center"
          label="属性名称"
          min-width="100">
        </el-table-column>

        <el-table-column
          prop="attr_name_alias"
          align="center"
          label="属性别名"
          min-width="100">
        </el-table-column>

        <el-table-column
          align="center"
          prop="attr_input_type"
          label="属性类型"
          min-width="100">
          <template slot-scope="scope">
            <!--<span>{{scope.row.attr_input_type}}</span>-->

            <span v-if="scope.row.attr_input_type == 0">文本框</span>
            <span v-if="scope.row.attr_input_type == 1">单选框</span>
            <span v-if="scope.row.attr_input_type == 2">复选框</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="attri_value"
          label="属性值"
          min-width="100">
        </el-table-column>

        <el-table-column
          align="center"
          prop="created"
          label="创建时间"
          min-width="120">
        </el-table-column>

        <el-table-column
          align="center"
          label="更新时间"
          prop="modified"
          min-width="120">
        </el-table-column>

        <el-table-column
          align="center"
          label="排序"
          min-width="100">
          <template slot-scope="scope">
              <span class="el-icon-bottom" style="font-weight: 700;font-size: 16px;cursor: pointer"
                    v-if="(scope.$index < tableData5.length-1)"
                    @click="goBottom(scope.row,scope.$index)"></span>
            <span class="el-icon-top" style="font-weight: 700;font-size: 16px;cursor: pointer"
                  v-if="scope.row.index > 0" @click="goTop(scope.row,scope.$index)"></span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操 作"
          min-width="130">
          <template slot-scope="scope">
            <el-button @click="addBatch(scope.row,scope.$index)" type="text" size="mini">编辑</el-button>
            <el-button @click="Delect(scope.row,scope.$index)" type="text" size="mini" style="color: red">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage5"
          :page-sizes="[15, 30, 50, 100, 200]"
          :page-size="pageSize5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum5">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        serachData: '',
        sku: '',
        datas: [],
        isloading: false,
        addData1: { //添加属性
          attr_values:'',
          category_cn_name:'',
          attr_name_alias:'',
          attr_input_type: '',
          attr_name: '',
          attr_typ: this.$route.params.attr_type,
          category_id: '',
        },
        attr_name_alias: '',
        searchType: 'category_code',
        category_cn_name1: '',
        custom: [{label: '分类编码', value: 'category_code'}, {label: '分类名称', value: 'category_cn_name'}, {label: '英文名称', value: 'category_en_name'},{label:'属性名称',value:'attr_name'}],
        optionsStock1: [{label: '启用', value: true}, {label: '未启用', value: false}],//启用状态
        options: [{label: '文本', value: '0'}, {label: '单选', value: '1'}, {label: '多选', value: '2'}],//属性
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
          attri_values: [     //必选入库类型
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

      plus(index) {
        if (this.datas[index].attri_value) {
          this.datas.push({attri_value: ''})

        } else {
          this.$message({
            message: '请输入',
            type: 'warning'
          });
        }

      },

      close(index) {
        if(this.datas[index].attri_value){
          this.datas.splice(index,1)
        }
      },

      //新增
      sure(v, num) {
          this.$refs.addData1.validate((valid) => {
            if (valid) {
              if(this.addData1.attr_input_type == 1 || this.addData1.attr_input_type == 2){
                for(var i=0;i<this.datas.length;i++){
                  if(this.datas[i].attri_value == ''){
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

              this._postRaw('/ecip.goods.center/execute?method=categoryattr.update', this.addData1).then(res => {
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
            method: 'categoryattr.delete',
            category_id: row.category_id
          }
          this._post('/ecip.goods.center/execute', data).then(res => {
            if (res.data.response.code == 0) {
              this.initMessages5()
              this.$message({
                type: 'success',
                message: '删除成功!'
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
        let data = {
          method: 'categoryattr.update',
          category_id_a: row.category_id,
          sort_a: row.sort_order,
          category_id_b: this.tableData5[index + 1].category_id,
          sort_b: this.tableData5[index + 1].sort_order,
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


      },

      //升序
      goTop(row, index) {
        let data = {
          method: 'categorysort.update',
          category_id_a: row.category_id,
          sort_a: row.sort_order,
          category_id_b: this.tableData5[index - 1].category_id,
          sort_b: this.tableData5[index - 1].sort_order,
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
      },

      //编辑商品属性
      addBatch(row, index, v) {
        this.visibleLead4 = true;
        this.addData1.category_cn_name = row.category_cn_name;
        this.addData1.attr_name_alias = row.attr_name_alias;
        this.datas = row.attr_values;
        this.addData1.attr_input_type= row.attr_input_type
        this.addData1.attr_name= row.attr_name
        this.addData1.category_id = row.category_id
//        this.datas = [{}]
      },

      handleClose4() {
        this.visibleLead4 = false;
        this.datas = [];
        this.$refs.addData1.clearValidate()

      },

      //重置
      reset() {
        this.searchType = 'category_code';
        this.serachData = ''

      },

      //初始化数据
      initMessages5() {
        let data = {
          method: 'categoryattr.get',
          attr_type: this.$route.params.attr_type,
          category_id: this.$route.params.category_id,
          category_code:'',
          category_en_name:'',
          category_cn_name:'',
          attr_name:'',
        };

        if(this.searchType == 'category_code'){
          data.category_code = this.serachData
        }else if(this.searchType == 'category_en_name'){
          data.category_en_name = this.serachData
        }else if(this.searchType == 'category_cn_name'){
          data.category_cn_name = this.serachData
        }else if(this.searchType == 'attr_name'){
          data.attr_name = this.serachData
        }

        this._post('/ecip.goods.center/execute', data)
          .then(res => {
            if (res.data.response.code == 0) {
              this.tableData5 = res.data.response.result;
              this.totalNum5 = res.data.response.total;


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
      this.initMessages5() //主数据
      this.$nextTick(() => {
        this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 70;

      });
      window.onresize = () => {
        this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 80;
      };


//
    },


  }
</script>
<style scoped>

</style>
<style>
  #AttribuLists .btn-group > .btn:first-child {
    width: 200px;
    height: 28px;
    text-align: left;
    line-height: 15px;
    border: 1px solid #d8dce5;
  }

  #AttribuLists .input-box .el-input__inner {
    padding: 0 5px !important;
    font-size: 12px !important;
  }

  @media screen and (max-width: 1550px) {
    #AttribuLists .special .special1 .el-input__inner {
      width: 110px !important;

    }
  }

  #AttribuLists .el-date-editor .el-range-input, .el-date-editor .el-range-separator {
    font-size: 12px;
  }

  #AttribuLists .isspliec .el-dialog__body {
    padding: 20px !important;
  }

  #AttribuLists .el-range-editor.el-input__inner {
    padding: 3px 2px;
    padding-left: 0;

  }

  #AttribuLists .cell .el-table__expand-icon .el-icon-arrow-right {

    font-weight: 700 !important;
    color: #211cff !important;
  }

</style>
