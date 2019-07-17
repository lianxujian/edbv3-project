<template>
  <div style='padding-bottom:0px !important;width:100%;height:100%;' v-loading="loading" element-loading-text="拼命加载中"
       element-loading-background="hsla(0,0%,100%,.9)">
    <div v-if="paramsObj.mainPageShow">
      <div class="release-nav" style="margin-top:0;">
        <ul>
          <li @click='exportBtn'>导出</li>
          <li @click='replaceBtn'>快速替换</li>
        </ul>
      </div>
      <div>
        <el-table
          id='fitTable'
          align="center"
          ref="multipleTable"
          :data="tableData"
          :height='table_h'
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="70">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align="left"
            label="商品名称"
            :show-overflow-tooltip='true'
            width='200'>
          </el-table-column>
          <el-table-column
            prop="goodsCode"
            align="center"
            label="商品编码">
          </el-table-column>
          <el-table-column
            label="名称"
            align="center">
            <template slot-scope="scope">
              <i class="el-icon-close" v-if='scope.row.goodsTitleCheckResult'></i>
              <i class="el-icon-check" v-else></i>
            </template>
          </el-table-column>
          <el-table-column
            label="卖点"
            align="center">
            <template slot-scope="scope">
              <i class="el-icon-close" v-if='scope.row.sellPointsCheckResult'></i>
              <i class="el-icon-check" v-else></i>
            </template>
          </el-table-column>
          <el-table-column
            label="商品描述"
            align="center">
            <template slot-scope="scope">
              <i class="el-icon-close" v-if='scope.row.charCheckResult'></i>
              <i class="el-icon-check" v-else></i>
            </template>
          </el-table-column>
          <el-table-column
            prop="isReplacedShow"
            label="文字是否被替换"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleEdit(scope.$index, scope.row)">修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style='float:right;margin-top:5px;'>
          <el-pagination
            style='float:left;'
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 500]"
            :page-size="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
          <i class='el-icon-refresh' @click='refresh'></i>
        </div>
      </div>
      <!-- 弹出框 -->
      <div class="dialog" v-show="repalceShow">
        <div class="mask"></div>
        <div class="dialog-box">
          <div class="dialog-head">
            快速替换<span @click='closeMask'>&times;</span>
          </div>
          <div class="dialog-content">
            <div style="margin: 30px 0;"></div>
            <div style='margin-left:20px;'>
              <span>将问题文字替换为：</span>
              <el-autocomplete
                class="inline-input"
                size="small"
                v-model="state"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="handleSelect"
              ></el-autocomplete>
            </div>
            <el-button type="primary" size='small' style='margin:65px 0 30px 73px;width:75px;' @click='saveBtn'>保存
            </el-button>
            <el-button size='small' style='margin:20px 0 30px 80px;width:75px;' @click='closeMask'>取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <goods-add v-else :params="paramsObj" @changeShow="changeShow"></goods-add>
  </div>
</template>
<script>
  import GoodsAdd from '@/components/views/goods/children/GoodsAdd.vue';
  export default {
    components: {
      GoodsAdd
    },
    data() {
      return {
        paramsObj:{
          mainPageShow:true,
        },
        testResultBtn: () => {
        },
        table_h: 0,
        currentPage: 1,
        totalPage: 20,
        totalNum: 0,
        tableData: [],
        paramData: this.$router.history.current.params,
        selectionData: [],
        goodsIds: '',  //id串
        replaceContent: [
          {'value': '*'},
          {'value': '@'},
          {'value': '#'},
          {'value': '&'}
        ],
        state: '*',
        repalceShow: false,
        loading: true
      }
    }, methods: {
      changeShow(param){
        if(param && param.isRefresh){
          var self = this;
          self.loading = true;
          this.$axios({
            method: 'post',
            url: process.env.OLD_API + 'api/check/checkWord',
            data: {
              goodsIds:this.paramData.goodsIds
            },
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
                self.paramData.limitBatchId = response.data.result;
                self.paramData.page = self.currentPage;
                self.paramData.rows = self.totalPage;

                self.testResultBtn(self.paramData);
              } else {
                self.$message({
                  message: response.data.message,
                  type: 'warning'
                });
                self.loading = false;
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        this.paramsObj.mainPageShow = true;
      },
      querySearch(queryString, cb) {
        var replaceContent = this.replaceContent;
        var results = queryString ? replaceContent.filter(this.createFilter(queryString)) : replaceContent;
        cb(results);
      },
      createFilter(queryString) {
        return (replaceContent) => {
          return (replaceContent.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      },
      handleSelectionChange(val) {
        this.selectionData = val;
        var str = '';
        for (var i = 0; i < this.selectionData.length; i++) {
          str += this.selectionData[i].goodsId + ',';
        }
        this.goodsIds = str.slice(0, -1);

      },
      //刷新
      refresh() {
        this.loading = true;
        this.testResultBtn(this.paramData);
      },
      //编辑
      handleEdit(index, row) {
        //this.$router.push({path: '/goodsAdd/' + row.goodsId + '/limitDetection'});
        /*this.paramsObj = {
          tsGoodsId:row.goodsId,
          source:'limitDetection',
          mainPageShow:false
        }*/
        if (process.env.NODE_ENV == 'development') {
          this.$router.push({path: '/goodsAdd/' + row.goodsId + '/'+this.paramData.goodsIds});
        } else {
          MainTab.createTab(row.goodsId + 'goodsAdd', '修改商品', process.env.API_PAGE + 'goodsAdd/' + row.goodsId + '/'+this.paramData.goodsIds);
        }
      },
      //导出
      exportBtn() {
        if (this.selectionData.length === 0) {
          this.$message({
            message: '请选择要导出的数据！',
            type: 'warning'
          });
        } else {
          var limitBatchId = this.paramData.limitBatchId;
          location.href = process.env.OLD_API + 'api/check/getCheckReExcel?goodIds=' + this.goodsIds + '&limitBatchId=' + limitBatchId;
        }
      },
      //快速替换
      replaceBtn() {
        if (this.selectionData.length == 0) {
          this.$message({
            message: '请选择要替换的数据！',
            type: 'warning'
          });
          return false;
        }
        var isPass = false;
        this.selectionData.forEach((item, i) => {
          if (item['charCheckResult'] == true || item['goodsTitleCheckResult'] == true || item['salesPointsCheckResult'] == true) {
            isPass = true;
          }
        })
        if (isPass) {
          this.repalceShow = true;
          this.state = '*';
        } else {
          this.$message({
            message: '没有需要替换的内容',
            type: 'warning'
          });
        }
      },
      //替换保存
      saveBtn() {
        var limitBatchId = this.paramData.limitBatchId,
          funE = this.paramData.funE;
        var self = this;
        this.$axios({
          method: 'get',
          url: process.env.OLD_API + 'api/check/quickRep?goodsIds=' + self.goodsIds + '&limitBatchId=' + limitBatchId + '&chChar=' + encodeURIComponent(self.state)
        })
          .then(function (response) {
            if (response.data.code == 0) {
              //重新渲染列表
              self.testResultBtn(self.paramData);
              self.repalceShow = false;
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
      },
      //每页多少条
      handleSizeChange(val) {
        this.totalPage = val;
        this.paramData.rows = this.totalPage;

        this.testResultBtn(this.paramData);
      },
      //当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.paramData.page = this.currentPage;

        this.testResultBtn(this.paramData);
      },
      closeMask() {
        this.repalceShow = false;
      },
      renderTableHeight() {
        this.$nextTick(function () {
          this.table_h = $(window).height() - $('#fitTable').offset().top - 45;
        });
        window.onresize = () => {
          this.table_h = $(window).height() - $('#fitTable').offset().top - 45;
        }
      },
    }, mounted() {
      console.log(this.paramData);
      //渲染表格高度
      this.renderTableHeight();
      var self = this;
      this.$axios({
        method: 'post',
        url: process.env.OLD_API + 'api/check/checkWord',
        data: this.paramData,
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
            self.paramData.limitBatchId = response.data.result;
            self.paramData.page = self.currentPage;
            self.paramData.rows = self.totalPage;

            self.testResultBtn(self.paramData);
          } else {
            self.$message({
              message: response.data.message,
              type: 'warning'
            });
            self.loading = false;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      this.testResultBtn = (paramData) => {
        this.$axios({
          method: 'get',
          url: process.env.OLD_API + 'api/check/getCheckList?limitBatchId=' + paramData.limitBatchId + '&page=' + paramData.page + '&rows=' + paramData.rows
        })
          .then(function (response) {
            if (response.data.code == 0) {
              self.tableData = response.data.result.rows;
              self.totalNum = response.data.result.total;
              self.loading = false;
              //console.log(self.tableData)
            } else {
              self.$message({
                message: response.data.message,
                type: 'warning'
              });
              self.loading = false;
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }
</script>
<style scoped>
  .el-icon-check {
    color: #77E731;
    font-size: 20px;
  }

  .el-icon-close {
    color: #E63C29;
    font-size: 20px;
  }
</style>
