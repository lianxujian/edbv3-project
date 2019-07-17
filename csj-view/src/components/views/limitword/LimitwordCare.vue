<template>
  <div class='limit-box' style="padding:10px 0 0 20px;" id='tab_small'>
   <!-- <div class="release-title">
      <p>极限词检测</p>
    </div>-->
    <div class="release-nav">
      <ul>
        <li @click='showDialog(0,"樊","虎")'>新增</li>
        <li @click='delBtn'>删除</li>
        <!--<li @click='goHistory'>历史检测记录</li>-->
      </ul>
    </div>
    <el-table align="center"
          ref="multipleTable"
          id='fitTable'
          :data="tableData"
          border
          :height='table_h'
          style="width: 100%"
          @sort-change='sortFn'
          @selection-change="handleSelectionChange"
          >
          <el-table-column
            type="selection"
            align="center"
            :selectable='checkboxInit'
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="70">
          </el-table-column>
          <el-table-column
            align="center"
            prop="templateName"
            label="模版名称">
          </el-table-column>
           <el-table-column
            align="center"
            prop="creater"
            label="创建人">
          </el-table-column>
          <el-table-column
            align="center"
            prop="updateTime"
            label="最近更新时间"
            sortable='custom'>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="110">
            <template slot-scope="scope">
              <el-button v-if='scope.row.merchantId==-1' type="text" @click='showDialog(1,scope.$index, scope.row)'>查看</el-button>
              <el-button v-else type="text" @click='showDialog(2,scope.$index, scope.row)'>修改</el-button>
            </template>
          </el-table-column>
      </el-table>
      <div style='float:right;margin-top:10px;margin-right:0px;'>
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
      <div class="dialog" v-if="addShow">
        <div class="mask"></div>
        <div class="dialog-box" style='width:500px;height:470px;margin-top:-230px;margin-left:-250px;'>
          <div class="dialog-head">
          {{addOrDisplay}}<span @click='closeBtn'>&times;</span>
          </div>
          <div class="dialog-content">
            <div style='margin-top:20px;'></div>
            <el-form :model="formData" ref="formData">
                <!--<div v-if='flag1' class='template-div'>
                  <span>模版号：</span>
                  <el-form-item
                    style='display:inline-block;'
                  >
                    <el-input v-model="formData.templateCode" style="width:300px;" disabled></el-input>
                  </el-form-item>
                </div>-->
                <div class='template-div'>
                  <span><a style="color:red;margin-right:3px;">*</a>模版名称：</span>
                  <el-form-item
                    style='display:inline-block;'
                    prop="templateName"
                    :rules="[
                      { required: true, message: '请输入模板名称', trigger: 'blur' }
                    ]"
                  >
                    <el-input v-model.trim="formData.templateName" style="width:300px;"></el-input>
                  </el-form-item><!--@keyup.native="formData.templateName = formData.templateName.replace(/[\s]/ig,'')"-->
                </div>
                <div v-if='!flag1' class='template-div'>
                  <span><a style="color:red;margin-right:3px;">*</a>创建人：</span>
                  <el-form-item
                    style='display:inline-block;'
                    prop="creater"
                    :rules="[
                      { required: true, message: '请输入创建人', trigger: 'blur' }
                    ]"
                  >
                    <el-input v-model="formData.creater" disabled style="width:300px;"></el-input>
                  </el-form-item>
                </div>
              <div class='template-div'>
                <span style='width:100%;'><span style="float:left;margin-left:10px;">模版内容：</span><span style='font-size:12px;float:left;margin-left:10px;'>（检测宝贝中是否含有以下敏感词，每个词汇用","分开）</span></span>
              </div>
                <div style='' class='template-div spel-template'>
                  <span></span>
                  <el-form-item
                    style='display:inline-block;margin-top:10px;'
                    prop="limitWords"
                    :rules="[
                      { required: true, message: '请输入模板内容', trigger: 'blur' }
                    ]"
                  >
                    <el-input type='textarea' v-model="formData.limitWords" style="width:300px;height:140px;"></el-input>
                  </el-form-item>
                </div>
            </el-form>
            <el-button v-if='flag1' size="small" style="width:80px;margin:20px 35px 0 90px;" type="primary" @click='saveBtn("formData")'>保存</el-button>
            <el-button v-if='!flag1' size="small" style="width:80px;margin:0px 35px 0 90px;" type="primary" @click='saveBtn("formData")'>保存</el-button>
            <el-button size="small" style="width:80px;" @click='closeBtn'>取消</el-button>
          </div>
        </div>
      </div>
      <div class="dialog" v-if="displayShow">
        <div class="mask"></div>
        <div class="dialog-box" style='width:500px;height:440px;margin-top:-210px;margin-left:-250px;'>
          <div class="dialog-head">
          查看<span @click='closeBtn'>&times;</span>
          </div>
          <div class="dialog-content">
            <div style='margin-top:20px;'></div>
            <div class='template-div'>
              <span>模版名称：</span>
              <el-input v-model="formData.templateName" style="width:300px;" disabled></el-input>
            </div>
            <div class='template-div'>
              <span>创建人：</span>
              <el-input v-model="formData.creater" style="width:300px;" disabled></el-input>
            </div>
            <div class='template-div'>
              <span style='width:100%;'><span style="float:left;margin-left:10px;">模版内容：</span><span style='font-size:12px;float:left;margin-left:10px;'>（检测宝贝中是否含有以下敏感词，每个词汇用","分开）</span></span>
            </div>
            <div style='margin-bottom:30px;' class='template-div spel-template'>
              <span></span>
              <el-input type='textarea' v-model="formData.limitWords" style="width:300px;" disabled></el-input>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import { turnTimestamp } from '@/assets/js/validate';
export default {
  data () {
    return {
      tableRenderFn:()=>{},
      activeName:'first',
      formData:{
        templateName:'',
        templateCode:'',
        creater:'',
        limitWords:''
      },
      tableData: [],
      currentPage:1,   //当前页
      totalPage:10,    //每页显示20
      totalNum:0,      //总条数
      displayShow:false,
      addShow:false,
      addOrDisplay:'',
      templateCode:'',  //模版号
      flag1:false,
      selectionData:[],
      table_h:0
    }
  },methods:{
    //排序
    sortFn(column){
      var paramData={
        page:this.currentPage,
        rows:this.totalPage,
        sort:'updateTime'
      }
      if(column.order=='descending'){
        //倒序
        paramData.order='desc';
        this.tableRenderFn(paramData);
      }else{
        //正序
        paramData.order='asc';
        this.tableRenderFn(paramData);
      }
    },
    //刷新表格
    refresh(){
      var paramData={
        page:this.currentPage,
        rows:this.totalPage
      };
      this.tableRenderFn(paramData);
    },
    checkboxInit(row,index){
      if(row.is_default===true){
           return false;
       }else {
           return true;
       }
    },
    handleSelectionChange(val){
      this.selectionData=val;
    },
    //每页多少条
    handleSizeChange(val){
      this.totalPage=val;
      var paramData={
          page:this.currentPage,
          rows:this.totalPage
        };
      this.tableRenderFn(paramData);
    },
    //当前页
    handleCurrentChange(val){
      this.currentPage=val;
      var paramData={
          page:this.currentPage,
          rows:this.totalPage
        };
      this.tableRenderFn(paramData);
    },
    //弹出框展示
    showDialog(n,index,row){
      //初始化
      var self = this;
          self.formData.templateName='';
          self.formData.creater='';
          self.formData.limitWords='';
       //查看
      if(n==1){
        this.displayShow=true;
        this.flag1=false;
          this.$axios({
            method:'get',
            url:process.env.OLD_API + 'api/limitWords/selectByDefault_vue'
          })
            .then(function (response) {
              if(response.data.code==0){
                 console.log(response.data.result.templateName)
                 self.formData.templateName=response.data.result.templateName;
                 self.formData.creater=response.data.result.creater;
                 self.formData.limitWords=response.data.result.limitWords;
              }else{
                self.$message({
                  message:response.data.message,
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
      }else{
        this.addShow=true;
        //添加
        if(n==0){
          this.flag1=true;
          this.addOrDisplay='新增';
          this.$axios({
            method:'get',
            url:process.env.OLD_API + 'api/limitWords/add_vue'
          })
            .then(function (response) {
              if(response.data.code==0){
                self.templateCode=response.data.result.templateCode;
                self.formData.templateCode=self.templateCode;
                //console.log(response.data.result)
              }else{
                self.$message({
                  message:response.data.message,
                  type: 'warning'
                });
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }else{
          //修改
          this.addOrDisplay='修改';
          this.flag1=false;
          //修改前查出
          self.formData.templateName=row.templateName;
          self.formData.creater=row.creater;
          self.formData.limitWords=row.limitWords;
          self.formData.templateId=row.templateId;
        }
      }
    },
    //保存
    saveBtn(formName){
      var self=this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.addOrDisplay=='新增'){
            //新增保存
            this.$axios({
                method:'get',
                url:process.env.OLD_API + 'api/limitWords/checkTmlName?templateName='+self.formData.templateName
              })
                .then(function (response) {
                  if(response.data.code==0){
                      self.$axios({
                        method:'get',
                        url:process.env.OLD_API + 'api/limitWords/save?templateName='+self.formData.templateName+'&templateCode='+self.formData.templateCode+'&limitWords='+self.formData.limitWords
                      })
                        .then(function (response) {
                          if(response.data.code==0){
                            var paramData={
                              page:self.currentPage,
                              rows:self.totalPage
                            };
                            self.tableRenderFn(paramData);
                            self.addShow=false;
                            self.$message({
                              message: '添加成功',
                              type: 'success'
                            });
                          }else{
                            self.$message({
                              message: response.data.message,
                              type: 'warning'
                            });
                          }
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                  }else{
                    self.$message({
                      message: response.data.message,
                      type: 'warning'
                    });
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
          }else{
            //修改保存
            this.$axios({
                method:'get',
                url:process.env.OLD_API + 'api/limitWords/checkTmlName?templateName='+self.formData.templateName+'&templateId='+self.formData.templateId
              })
                .then(function (response) {
                  if(response.data.code==0){
                    self.$axios({
                      method:'get',
                      url:process.env.OLD_API + 'api/limitWords/update?templateName='+self.formData.templateName+'&creater='+self.formData.creater+'&limitWords='+self.formData.limitWords+'&templateId='+self.formData.templateId
                    })
                      .then(function (response) {
                        if(response.data.code==0){
                          var paramData={
                            page:self.currentPage,
                            rows:self.totalPage
                          };
                          self.tableRenderFn(paramData);
                          self.addShow=false;
                          self.$message({
                            message: '修改成功',
                            type: 'success'
                          });
                        }else{
                          self.$message({
                            message: response.data.message,
                            type: 'warning'
                          });
                        }
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                   }else{
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
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //删除
    delBtn(){
      if(this.selectionData.length==0){
        this.$message({
              message: '请选择要删除的模版！',
              type: 'warning'
            });
      }else{
        var self = this;
        this.$confirm('确定要删除选中模版吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          var str='';
          for(var i=0;i<self.selectionData.length;i++){
            str+=self.selectionData[i].templateId+',';
          }
            self.$axios({
              method:'get',
              url:process.env.OLD_API + 'api/limitWords/del?templateId='+str.slice(0,-1)
            })
              .then(function (response) {
                if(response.data.code==0){
                  var paramData={
                    page:self.currentPage,
                    rows:self.totalPage
                  };
                  self.tableRenderFn(paramData);
                  setTimeout(()=>{
                    self.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                  },300)
                }else{
                  self.$message({
                    message:response.data.message,
                    type: 'warning'
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
        }).catch(() => {});
      }
    },
    closeBtn(){
      this.displayShow=false;
      this.addShow=false;
    },
    goHistory(){
      if(process.env.NODE_ENV=='development'){
        location.href='http://localhost:8080/#/historyRecord';
      }else{
        MainTab.createTab('history','历史检测记录',process.env.API_PAGE+'historyRecord');
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
  },mounted(){
      //渲染表格高度
      this.renderTableHeight();
      var paramData={
          page:this.currentPage,
          rows:this.totalPage
        };
      this.tableRenderFn=(paramData)=>{
        var self = this;
        this.$axios({
          method:'post',
          url:process.env.OLD_API + 'api/limitWords/list',
          data:paramData,
          transformRequest:[function (data) {
            let newData = '';
            for(let k in data){
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
            return newData;
          }]

        })
          .then(function (response) {
            if(response.data.code==0){
              self.tableData=response.data.result.rows;
              for(var i=0;i<self.tableData.length;i++){
                if(self.tableData[i].updateTime){
                  if(self.tableData[i].updateTime)self.tableData[i].updateTime=turnTimestamp(self.tableData[i].updateTime);
                }
              }
              self.totalNum=response.data.result.total;
            }else{
              self.$message({
                message:response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      this.tableRenderFn(paramData);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .release-title{
    text-align:left;
    margin-bottom:20px;
  }
  .release-title p{
    font-size:20px;
    text-align:left;
    padding-left:10px;
    border-left:5px solid #2EA3FC;
  }
  .el-select{
    width:60%;
  }
  .el-input{
    width:60%;
  }
  .el-select .el-input{
    width:100%;
  }
  .input-box label{
    width:85px;
    display:inline-block;
    text-align:right;
    margin-right:5px;
  }
  .release-nav{
    background:#2EA3FC;
    width:100%;
    height:38px;
    margin:15px 0;
  }
  .release-nav ul li{
    float:left;
    height:26px;
    margin-top:6px;
    line-height:26px;
    padding:0 40px;
    color:#fff;
    border-right:1px solid #fff;
    cursor: pointer;
  }
  .dialog-content .template-div>span{
    display:inline-block;
    width:80px;
    text-align:right;
    margin-right:10px;
  }
  .dialog-content>div{
    margin-bottom: 20px;
  }
  .limit-box .el-textarea__inner{
    display:inline-block;
    height:140px !important;
  }
</style>
<style>
  .spel-template .el-textarea .el-textarea__inner{
    height:140px;
  }
</style>
