<template>
  <div style='padding-left:20px;height:100%;' class='rechargeManage'>
    <!-- <div class="input-box">
          <el-row style="">
            <el-col :span="6">
                  <div><label for="">标题：</label><el-input size='small' v-model="paramData.qaTitle" @keyup.enter.native="queryBtn"></el-input></div>
                </el-col>
                <el-col :span="6">
                  <div><label for="">联系人电话：</label><el-input size='small' v-model="paramData.contactPhone" @keyup.enter.native="queryBtn"></el-input></div>
                </el-col>
                <el-col :span="6">
                  <div><label for="">联系人QQ：</label><el-input size='small' v-model="paramData.contactQq" @keyup.enter.native="queryBtn"></el-input></div>
                </el-col>
                <el-col :span="4" style="text-align:center;">
                  <el-button type="small" style="width:80px;color:#fff;background:#00ADEE;"  @click='queryBtn'>查询</el-button>
                </el-col>
              </el-row>
      </div> -->
    <div class="release-nav">
      <ul>
        <li @click='addBtn'>新增</li>
      </ul>
    </div>
    <div class="border">
      <el-table
        id='fitTable'
        :height='table_h'
        :data="tableData"
        border
      >
        <el-table-column
          align='center'
          type='index'
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          label="操作"
          align='center'
          width="110">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="rechargeGoodsName"
          align='center'
          label="充值商品名称"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="rechargeGoodsPrice"
          align='right'
          min-width=''
          label="商品价格（元）">
        </el-table-column>
        <el-table-column
          prop="acquirePrice"
          label="获取单价（元）"
          min-width=''
          align='right'
          width="">
        </el-table-column>
        <el-table-column
          prop="publishPrice"
          align='right'
          label="发布价格（元）"
          min-width=''
          width="">
        </el-table-column>
        <el-table-column
          prop="creater"
          align='center'
          label="创建人"
          width="">
        </el-table-column>
        <el-table-column
          prop="creTimeForShow"
          align='left'
          label="创建时间"
          width="">
        </el-table-column>
        <el-table-column
          prop="updater"
          align='center'
          label="更新人"
          width="">
        </el-table-column>
        <el-table-column
          prop="updTimeForShow"
          align='left'
          label="更新时间"
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
      <i class='el-icon-refresh' @click='refresh'></i>
    </div>
    <div class="dialog" v-if="dialogShow">
      <div class="mask"></div>
      <div class="dialog-box" style='width:500px;height:420px;margin-top:-210px;margin-left:-250px;'>
        <div class="dialog-head">
          新增商品<span @click='closeBtn'>&times;</span>
        </div>
        <div class="dialog-content">
          <div style='margin-top:20px;'></div>
          <el-form :model="addFormData" :rules="rules" ref="addFormData">
            <el-form-item label="商品名称：" prop="rechargeGoodsName">
              <el-input v-model="addFormData.rechargeGoodsName" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="商品价格：" prop="rechargeGoodsPrice">
              <el-input v-model="addFormData.rechargeGoodsPrice" style="width:300px;"></el-input>
              元
            </el-form-item>
            <el-form-item label="获取价格：" prop="acquirePrice">
              <el-input v-model="addFormData.acquirePrice" style="width:300px;"></el-input>
              元
            </el-form-item>
            <el-form-item label="发布价格：" prop="publishPrice">
              <el-input v-model="addFormData.publishPrice" style="width:300px;"></el-input>
              元
            </el-form-item>
            <el-form-item>
              <el-button type='primary' size='small' style='margin:10px 30px 0px 110px;'
                         @click='addBtnSave("addFormData")'>保存
              </el-button>
              <el-button size='small'
                         style='margin:10px;' @click='closeBtn'>取消
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="dialogShowEdit">
      <div class="mask"></div>
      <div class="dialog-box" style='width:500px;height:420px;margin-top:-210px;margin-left:-250px;'>
        <div class="dialog-head">
          修改商品<span @click='closeBtn'>&times;</span>
        </div>
        <div class="dialog-content">
          <div style='margin-top:20px;'></div>
          <el-form :model="formData" :rules="rules" ref="formData">
            <el-form-item label="商品名称：" prop="rechargeGoodsName">
              <el-input v-model="formData.rechargeGoodsName" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="商品价格：" prop="rechargeGoodsPrice">
              <el-input v-model="formData.rechargeGoodsPrice" style="width:300px;"></el-input>
              元
            </el-form-item>
            <el-form-item label="获取价格：" prop="acquirePrice">
              <el-input v-model="formData.acquirePrice" style="width:300px;"></el-input>
              元
            </el-form-item>
            <el-form-item label="发布价格：" prop="publishPrice">
              <el-input v-model="formData.publishPrice" style="width:300px;"></el-input>
              元
            </el-form-item>
            <el-form-item>
              <el-button type='primary' size='small' style='margin:10px 30px 0px 110px;'
                         @click='editorSave("formData")'>保存
              </el-button>
              <el-button size='small'
                         style='margin:10px;' @click='closeBtn'>取消
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {returnFloat} from '@/assets/js/validate';

  export default {
    data() {
      //判断大于0数字
      var rechargeValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('商品价格不能为空'));
        }
        if (!(/^[0-9]+.?[0-9]*$/.test(value * 1))) {
          callback(new Error('请输入有效数字值'));
        } else {
          if (value < 0) {
            callback(new Error('数值必须大于等于0'));
          } else {
            callback();
            this.addFormData.rechargeGoodsPrice = returnFloat(this.addFormData.rechargeGoodsPrice);
            this.formData.rechargeGoodsPrice = returnFloat(this.formData.rechargeGoodsPrice);
          }
        }

      };
      var acquirePriceValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('获取价格不能为空'));
        }
        if (!(/^[0-9]+.?[0-9]*$/.test(value * 1))) {
          callback(new Error('请输入有效数字值'));
        } else {
          if (value < 0) {
            callback(new Error('数值必须大于等于0'));
          } else {
            callback();
            this.addFormData.acquirePrice = returnFloat(this.addFormData.acquirePrice);
            this.formData.acquirePrice = returnFloat(this.formData.acquirePrice);
          }
        }
      };
      var publishPriceValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('发布价格不能为空'));
        }
        if (!(/^[0-9]+.?[0-9]*$/.test(value * 1))) {
          callback(new Error('请输入有效数字值'));
        } else {
          if (value < 0) {
            callback(new Error('数值必须大于等于0'));
          } else {
            callback();
            this.addFormData.publishPrice = returnFloat(this.addFormData.publishPrice);
            this.formData.publishPrice = returnFloat(this.formData.publishPrice);
          }
        }
      };
      return {
        renderFn: () => {
        },
        table_h: 0,
        rules: {
          rechargeGoodsName: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
          rechargeGoodsPrice: {required: true, validator: rechargeValidator, trigger: 'blur'},
          acquirePrice: {required: true, validator: acquirePriceValidator, trigger: 'blur'},
          publishPrice: {required: true, validator: publishPriceValidator, trigger: 'blur'}
        },
        totalNum: 0,
        totalPage: 20,
        currentPage: 1,
        tableData: [],
        paramData: {
          page: 1,
          rows: 20
        },
        addFormData: {},
        formData: {},
        dialogShow: false,
        dialogShowEdit: false,
        selectionData: []
      }
    }, methods: {
      handleSizeChange(val) {
        this.paramData.rows = val;
        this.renderFn();
      },
      handleCurrentChange(val) {
        this.paramData.page = val;
        this.renderFn();
      },
      refresh() {
        this.renderFn();
      },
      //编辑
      handleEdit(index, row) {
        this.dialogShowEdit = true;
        this.formData.rechargeGoodsId = row.rechargeGoodsId;
        this.formData.rechargeGoodsName = row.rechargeGoodsName;
        this.formData.rechargeGoodsPrice = row.rechargeGoodsPrice;
        this.formData.acquirePrice = row.acquirePrice;
        this.formData.publishPrice = row.publishPrice;
      },
      //删除单条
      handleDelete(index, row) {
        this.$confirm('确认要删除本条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var self = this;
          this.$axios({
            method: 'get',
            url: process.env.OLD_API + 'api/rechargeGoods/delOneRechargeGoods?rechargeGoodsId=' + row.rechargeGoodsId
          })
            .then(function (response) {
              //console.log(response)
              if (response.data.code == 0) {
                self.renderFn();
              } else {
                self.$message({
                  message: response.data.message,
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }).catch(() => {
        });
      },
      addBtn() {
        this.dialogShow = true;
        this.addFormData = {};
      },
      //新增保存
      addBtnSave(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios({
              method: 'post',
              url: process.env.OLD_API + 'api/rechargeGoods/addRechargeGoods',
              data: this.addFormData,
              transformRequest: [function (data) {
                let newData = '';
                for (let k in data) {
                  newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
                }
                return newData;
              }]
            })
              .then(function (response) {
                //console.log(response)
                if (response.data.code == 0) {
                  self.renderFn();
                  self.dialogShow = false;
                } else {
                  self.$message({
                    message: response.data.message,
                    type: 'warning'
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      closeBtn() {
        this.dialogShow = false;
        this.dialogShowEdit = false;
      },
      queryBtn() {
        this.renderFn();
      },
      editorSave(formName) {
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios({
              method: 'post',
              url: process.env.OLD_API + 'api/rechargeGoods/updataRechargeGoods',
              data: this.formData,
              transformRequest: [function (data) {
                let newData = '';
                for (let k in data) {
                  newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
                }
                return newData;
              }]

            })
              .then(function (response) {
                //console.log(response)
                if (response.data.code == 0) {
                  self.renderFn();
                  self.dialogShowEdit = false;
                } else {
                  self.$message({
                    message: response.data.message,
                    type: 'warning'
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      renderTableHeight() {
        this.$nextTick(function () {
          this.table_h = $(window).height() - $('#fitTable').offset().top - 45;
        });
        window.onresize = () => {
          this.table_h = $(window).height() - $('#fitTable').offset().top - 45;
        }
      },
    },
    mounted() {
      //渲染表格高度
      this.renderTableHeight();
      var self = this;
      this.renderFn = () => {
        self.$axios({
          method: 'post',
          url: process.env.OLD_API + 'api/rechargeGoods/getDataPageChargeGoods',
          data: self.paramData,
          transformRequest: [function (data) {
            let newData = '';
            for (let k in data) {
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
            return newData;
          }]

        })
          .then(function (response) {
            if (response.data.code == 0) {
              self.tableData = response.data.result.rows;
              self.totalNum = response.data.result.total;
              self.tableData.forEach((item, i) => {
                console.log(item.acquirePrice)
                item.acquirePrice = returnFloat(item.acquirePrice / 100);
                item.publishPrice = returnFloat(item.publishPrice / 100);
                item.rechargeGoodsPrice = returnFloat(item.rechargeGoodsPrice / 100);
              })
            } else {
              self.$message({
                message: response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.renderFn();
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .input-box {
    margin: 20px 0 0 0;
    display: inline-block;
  }

  .input-box label {
    width: 90px;
    display: inline-block;
    text-align: right;
    margin-right: 5px;
  }

  .el-select {
    width: 60%;
  }

  .el-input {
    width: 60% !important;
  }

  .release-nav {
    background: #2EA3FC;
    width: 100%;
    height: 38px;
    margin: 15px 0;
    display: inline-block;
  }

  .release-nav ul li {
    float: left;
    height: 26px;
    margin-top: 6px;
    line-height: 26px;
    padding: 0 40px;
    color: #fff;
    border-right: 1px solid #fff;
    cursor: pointer;
  }

  .template-div {
    margin-bottom: 20px;
  }

  .template-div span {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
</style>
<style>
  .rechargeManage .el-form-item__error {
    left: 100px;
  }
</style>
