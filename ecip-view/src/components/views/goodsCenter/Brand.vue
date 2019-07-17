<!--品牌管理 佩玖-->
<template>
  <div id="brand">
    <div id="searchBox">
      <div class="leftBox2"><!--查询区-->
        <el-row>
          <el-col :span="7">
            <div class="grid-content special" style="white-space: nowrap;margin-bottom: 3px!important;">
              <el-select style="width:130px!important;" v-model="searchType" placeholder="请选择">
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
          <li @click="addBand()"><span>增加</span></li>
        </ul>
      </div>

      <!--按钮-->
      <div class="rightBox2">
        <el-button type="primary" @click="query()">查 询</el-button>
        <el-button @click="reset()">重 置</el-button>
      </div>

      <div class="isspliec">
        <!--增加品牌-->
        <el-dialog v-dialogDrag
                   :title="Eder"
                   :visible.sync="visibleLead"
                   width="500px"
                   :before-close="handleClose">
          <div>
            <ul class="leadUl" type="disc">
              <el-form label-width="90px" class="demo-ruleForm" :model="addData" :rules="rules" ref="addData">

                <el-form-item label="品牌编码" prop="brand_code">
                  <el-input type="text" placeholder="最多输入20个字符" v-model="addData.brand_code" style="width: 100%"
                            :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="品牌名称" prop="brand_cn_name">
                  <el-input type="text" placeholder="最多输入10个字符" v-model="addData.brand_cn_name" style="width: 100%"
                            :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="brand_en_name">
                  <el-input type="text" placeholder="" v-model="addData.brand_en_name" style="width: 100%"
                            :maxlength="20"></el-input>
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
                  <el-input type="textarea" placeholder="请输入备注" v-model="addData.remark" style="width: 100%"
                            :maxlength="200"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;text-align: center">
                  <el-button type="plain"  @click="handleClose()">取消</el-button>
                  <el-button type="primary" @click="sure('addData')" :loading="isloading">确定</el-button>
                </el-form-item>
              </el-form>
            </ul>
          </div>
        </el-dialog>
        <!-- 编辑-->

      </div>

      <!--  列表-->
      <div>
        <el-table
          :data="tableData5"
          border
          ref="itoktab"
          id="fitTable5"
          :min-height="80"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            align="center"
            label="品牌编码"
            prop="brand_code"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop="brand_cn_name"
            align="center"
            min-width="100"
            label="品牌名称">
          </el-table-column>

          <el-table-column
            prop="brand_en_name"
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
              <span class="el-icon-bottom"  style="font-weight: 700;font-size: 16px;cursor: pointer" v-if="scope.$index < tableData5.length-1" @click="goBottom(scope.row,scope.$index)"></span>
              <span class="el-icon-top" style="font-weight: 700;font-size: 16px;cursor: pointer" v-if="scope.$index > 0" @click="goTop(scope.row,scope.$index)"></span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="操作"
            min-width="130">
            <template slot-scope="scope">
              <el-button @click="isEditers(scope.row)" type="text" size="mini">编辑</el-button>
              <el-button @click="Delect(scope.row,scope.$index)" type="text" size="mini">删除</el-button>
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        serachData:'',
        searchType:1,
        Eder:'',
        isEditer:false,
        isloading:false,
        addData: { //根分类参数
          method:'brand.add',
          brand_code:'',
          brand_cn_name:'',
          brand_en_name:'',
          status:'',
          remark:'',
        },
        custom:[{label:'商品编码',value:1},{label:'品牌名称',value:2},{label:'英文名称',value:3}],
        optionsStock1:[{label:'启用',value:true},{label:'未启用',value:false}],//启用状态
        visibleLead: false, //增加根分类
        visibleLead2: false, //编辑
        table_h5: 0,//高度
        totalNum5: 0, //总条数
        tableData5: [], //主数据
        pageSize5: 15, //当夜页条数
        curPage5: 1, //当前页
        total_page:1,
        page_size:15,
        rules: {
          brand_code: [     //必选入库类型
            {trigger: 'blur', required: true, message: '请输入！'}
          ],
          brand_cn_name: [         //必选仓库
            {trigger: 'blur', required: true, message: '请输入！'},
          ],
          brand_en_name: [         //必选仓库
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

      sure(){
        this.$refs.addData.validate((valid)=>{
          if(valid){
            this.isloading = true;
            if(this.isEditer){
              this.addData.method = 'brand.update'
            }
            this._post('/ecip.goods.center/execute',this.addData).then(res=>{
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

      },

      isEditers(row){
        this.isEditer = true;
        this.visibleLead = true;
        this.addData.brand_code = row.brand_code;
        this.addData.brand_cn_name = row.brand_cn_name;
        this.addData.brand_en_name = row.brand_en_name;
        this.addData.status = row.status;
        this.addData.remark = row.remark;
        this.Eder = '编辑'

      },

      addBand(){
        this.visibleLead = true;
        this.Eder = '添加品牌'
      },

      handleClose() {
        this.visibleLead = false;
        this.addData.brand_code = '';
        this.addData.brand_cn_name = '';
        this.addData.brand_en_name = '';
        this.addData.status = '';
        this.$refs.addData.clearValidate()
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
            method: 'brand.delete',
            brand_code: row.brand_code

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

      //重置
      reset() {
        this.serachData = '';
        this.searchType = 1;

      },

      //降序
      goBottom(row, index) {
        let data = {
          method: 'brandsort.update',
          brand_id_a: row.brand_id,
          sort_a: row.sort_order,
          brand_id_b: this.tableData5[index + 1]. brand_id,
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
          method: 'brandsort.update',
          brand_id_a: row.brand_id,
          sort_a: row.sort_order,
          brand_id_b: this.tableData5[index - 1]. brand_id,
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

      //初始化数据
      initMessages5() {
        let data = {
          method: 'brand.get',
          brand_code:'',
          brand_cn_name:'',
          brand_en_name:'',
          total_page:this.total_page,
          page_size:this.page_size

        };

        if(this.searchType == 1){
          data.brand_code = this.serachData
        }else if(this.searchType == 2){
          data.brand_cn_name = this.serachData
        }else{
          data.brand_en_name = this.serachData
        }
        this._post('/ecip.goods.center/execute',data)
          .then(res => {
            if (res.data.response.code == 0) {
              this.tableData5 = res.data.response.result.list;
              this.totalNum5 = res.data.response.result.total_record;

            }
          })


      },

      //当前页多少
      handleSizeChange(val) {
        this.total_page = val
        this.initMessages5();


      },

      // 跳到第几页
      handleCurrentChange(val) {
        this.page_size = val
        this.initMessages5()


      },


    },

    mounted() {
      this.$nextTick(() => {
        this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 70;

      });
      window.onresize = () => {
        this.table_h5 = $(window).height() - $('#fitTable5').offset().top - 80;
      };

      this.initMessages5() //主数据
//
    },


  }
</script>
<style scoped>

</style>
<style>
  #brand .btn-group > .btn:first-child {
    width: 200px;
    height: 28px;
    text-align: left;
    line-height: 15px;
    border: 1px solid #d8dce5;
  }

  #brand .input-box .el-input__inner {
    padding: 0 5px !important;
    font-size: 12px !important;
  }

  @media screen and (max-width: 1550px) {
    #brand .special .special1 .el-input__inner {
      width: 110px !important;

    }
  }

  #brand .el-date-editor .el-range-input, .el-date-editor .el-range-separator {
    font-size: 12px;
  }

  #brand .isspliec .el-dialog__body {
    padding: 20px !important;
  }

  #brand .el-range-editor.el-input__inner {
    padding: 3px 2px;
    padding-left: 0;

  }

</style>
