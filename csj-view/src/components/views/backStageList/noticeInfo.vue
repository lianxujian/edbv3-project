<template>
  <div style='padding-left:20px;height:100%;'>
    <div class="input-box">
      <el-row style="">
        <el-col :span="5">
          <div><label for="">公告主题：</label>
            <el-input size='small' v-model="paramData.title" @keyup.enter.native="queryBtn"></el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <div><label for="">创建人：</label>
            <el-input size='small' v-model="paramData.creater" @keyup.enter.native="queryBtn"></el-input>
          </div>
        </el-col>
        <el-col :span="5">
          <div style="white-space:nowrap;">
            <label for="" style='margin-right:2px;text-align:center;'>公告时间：</label>
            <el-date-picker
              :editable="false"
              size='small'
              @change="channelChangeDate(1)"
              v-model="paramData.checkBeforeTime"
              type="date"
              placeholder="选择日期"
              format='yyyy-MM-dd'
              value-format='yyyy-MM-dd'
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div style="white-space:nowrap;">
            <label for="" style="margin-right:2px;">至：</label>
            <el-date-picker size='small'
                            :editable="false"
                            v-model="paramData.checkAfterTime"
                            type="date"
                            @change="channelChangeDate(2)"
                            placeholder="选择日期"
                            format='yyyy-MM-dd'
                            value-format='yyyy-MM-dd'
                            :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="4" style="padding-left:20px;">
          <el-button type="primary" size="small" @click='queryBtn'>查询</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px;">
        <el-col :span="5">
          <div>
            <label for="" style="margin-right:4px;">状态：</label>
            <el-select size='small' v-model="paramData.statusId" placeholder="请选择">
              <el-option
                v-for="item in noticeStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="release-nav">
      <ul>
        <li @click='addBtn'>新增</li>
        <li @click='delBtn'>删除</li>
      </ul>
    </div>
    <div class="border">
      <el-table
        id='fitTable'
        :height='table_h'
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align='center'
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align='center'
          prop='number'
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="title"
          align='center'
          :show-overflow-tooltip='true'
          label="公告主题"
          min-width="">
        </el-table-column>
        <el-table-column
          prop="creater"
          align='center'
          min-width='130'
          label="创建人">
        </el-table-column>
        <el-table-column
          prop="updater"
          label="更新人"
          min-width=''
          align='center'
          width="">
        </el-table-column>
        <el-table-column
          prop="status"
          align='center'
          label="公告状态"
          min-width=''
          width="">
        </el-table-column>
        <el-table-column
          prop="beginTime"
          align='left'
          label="创建时间"
          width="">
        </el-table-column>
        <el-table-column
          prop="lastPublishTime"
          align='left'
          label="最近发布时间"
          width="">
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
    <div class="dialog" v-if="addShow">
      <div class="mask"></div>
      <div class="dialog-box" style='width:800px;height:600px;margin-top:-300px;margin-left:-400px;'>
        <div class="dialog-head">
          新增<span @click='closeBtn'>&times;</span>
        </div>
        <div class="dialog-content">
          <div style='margin-top:20px;'></div>
          <el-form :model="addForm" label-width="120px">
            <el-form-item label="创建人：">
              <el-input v-model="addForm.creater" disabled placeholder='admin'></el-input>
            </el-form-item>
            <el-form-item label="公告主题：">
              <el-input v-model="addForm.title"></el-input>
            </el-form-item>
          </el-form>
          <span style='margin:0px 0px 15px 39px;display:block;'>公告内容：</span>
          <quill-editor style='width: 542px;height: 200px;
			margin:-34px 0px 115px 119px;' v-model='addForm.content'></quill-editor>
          <el-button size="small" type="primary" style="width:75px;margin:0 65px 0 230px;" @click='saveBtn(1)'>保存
          </el-button>
          <el-button size="small" style="width:75px;" @click='closeBtn'>取消</el-button>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="editorShow">
      <div class="mask"></div>
      <div class="dialog-box" style='width:800px;height:660px;margin-top:-330px;margin-left:-400px;'>
        <div class="dialog-head">
          修改<span @click='closeBtn'>&times;</span>
        </div>
        <div class="dialog-content">
          <div style='margin-top:20px;'></div>
          <el-form :model="editorForm" label-width="120px">
            <el-form-item label="公告主题：">
              <el-input v-model="editorForm.title"></el-input>
            </el-form-item>
            <el-form-item label="创建人：">
              <el-input v-model="editorForm.creater"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
              <el-select v-model="editorForm.status" placeholder="请选择">
                <el-option label="已公告" value="已公告"></el-option>
                <el-option label="未公告" value="未公告"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span style='margin:0px 0px 15px 39px;display:block;'>公告内容：</span>
          <quill-editor style='width: 542px;height: 200px;
			margin:-34px 0px 115px 119px;' v-model='editorForm.content'></quill-editor>
          <el-button size="small" type="primary" style="width:75px;margin:0 65px 0 230px;" @click='saveBtn(2)'>保存
          </el-button>
          <el-button size="small" style="width:75px;" @click='closeBtn'>取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        renderFn: () => {
        },
        table_h: 100,
        totalNum: 0,
        totalPage: 20,
        currentPage: 1,
        tableData: [],
        selectionData: [],
        paramData: {
          page: 1,
          rows: 20,
          title: '',
          creater: '',
          statusId: '',
          checkBeforeTime: '',
          checkAfterTime: ''
        },
        noticeStatus: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '已公告',
            value: '1'
          },
          {
            label: '未公告',
            value: '0'
          }
        ],
        addShow: false,
        editorShow: false,
        addForm: {
          creater: 'admin'
        },
        editorForm: {
          status: ''
        }
      }
    }, methods: {
      channelChangeDate(item) {
        if (this.paramData.checkBeforeTime && this.paramData.checkAfterTime && new Date(this.paramData.checkBeforeTime).getTime() > new Date(this.paramData.checkAfterTime).getTime()) {
          this.$message({
            message: '起始时间不能大于结束时间！',
            type: 'warning'
          });
          if (item == 1) {
            this.paramData.checkBeforeTime = '';
          } else {
            this.paramData.checkAfterTime = '';
          }
        }
      },
      handleSelectionChange(val) {
        this.selectionData = val;
      },
      queryBtn() {
        this.paramData.checkBeforeTime = this.paramData.checkBeforeTime == null ? '' : this.paramData.checkBeforeTime;
        this.paramData.checkAfterTime = this.paramData.checkAfterTime == null ? '' : this.paramData.checkAfterTime;
        this.renderFn();
      },
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
      addBtn() {
        this.addForm = {
          creater: 'admin'
        };
        this.addShow = true;
      },
      saveBtn(val) {
        if (val == 1) {
          var self = this;
          //新增保存
          if (this.addForm.title == '' || this.addForm.title == undefined) {
            this.$message({
              message: '请输入公告主题',
              type: 'warning'
            });
            return false;
          }
          if (this.addForm.content == '' || this.addForm.content == undefined) {
            this.$message({
              message: '请输入公告内容',
              type: 'warning'
            });
            return false;
          }
          this.$axios({
            method: 'post',
            url: process.env.OLD_API + 'api/notice/save',
            data: this.addForm,
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
                self.renderFn();
                self.addShow = false;
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
          //修改保存
          var self = this;
          this.$axios({
            method: 'post',
            url: process.env.OLD_API + 'api/notice/edit',
            data: this.editorForm,
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
                self.renderFn();
                self.editorShow = false;
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
        //this.addShow=false;
      },
      closeBtn() {
        this.addShow = false;
        this.editorShow = false;
      },
      //多条删除
      delBtn() {
        if (this.selectionData.length == 0) {
          this.$message({
            message: '请选择要删除的数据！',
            type: 'warning'
          });
        } else {
          var noticeIds = '';
          this.selectionData.forEach((item, i) => {
            noticeIds += item.noticeId + ',';
          })
          this.$confirm('确认要批量删除这些数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            var self = this;
            this.$axios({
              method: 'get',
              url: process.env.OLD_API + 'api/notice/del?noticeIds=' + noticeIds.slice(0, -1)
            })
              .then(function (response) {
                console.log(response)
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
        }
      },
      handleEdit(index, row) {
        this.editorShow = true;
        this.editorForm.status = row.status;
        this.editorForm.title = row.title;
        this.editorForm.creater = row.creater;
        this.editorForm.content = row.content;
        this.editorForm.noticeId = row.noticeId;
      },
      handleDelete(index, row) {
        console.log(row)
        this.$confirm('确认要删除<' + row.title + '>的系统公告吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var self = this;
          this.$axios({
            method: 'get',
            url: process.env.OLD_API + 'api/notice/delOne?noticeId=' + row.noticeId
          })
            .then(function (response) {
              console.log(response)
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
      this.renderTableHeight();
      var self = this;
      this.renderFn = () => {
        self._post(process.env.OLD_API + 'api/notice/seByCondition', self.paramData).then((response) => {
          if (response.data.code == 0) {
            self.tableData = response.data.result.rows;
            self.totalNum = response.data.result.total;
          } else {
            self.$message({
              message: response.data.message,
              type: 'warning'
            });
          }
        })
      }
      this.renderFn();
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .input-box label {
    width: 80px;
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
</style>
