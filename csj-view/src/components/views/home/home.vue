<template>
  <div class="index-content" id='home'>
    <div class="contain">
      <div class="top">
        <div>
          今日获取宝贝数<b style='color:#FF6BDA;'>{{removeTotal}}</b>
        </div>
        <div>
          今日发布宝贝数<b style='color:#FF9630;'>{{releaseTotal}}</b>
        </div>
        <div>
          累计消费金额<b style='color:#4DBB23;'>{{rechargeMoney.totalConsumeAmount}}</b>
        </div>
        <div style='margin-right:0;'>
          可用余额<b style='color:#45AAFF;'>{{rechargeMoney.totalSurplusAmount}}</b>
        </div>
      </div>
      <div class="center">
        <div class="left">
          <div class="i-notice">
            <h1><img src="../../../assets/img/purple.png" alt="">系统公告<span
              style='float:right;cursor:pointer;font-weight:normal;' @click='turnList'>更多>></span></h1>
            <div style='padding-top:35px;width:100%;height:90%;'>
              <div style='width:100%;height:100%;background:#FBFBFB;padding:10px;overflow:hidden;'>
                <ul>
                  <li v-for='(item,index) in noticeList' @click='turnDetail(item)'>
                    <a><span>{{index + 1}}.</span>
                      <el-badge v-if="index==0" value="new" class="item">
                        {{item.title}}
                      </el-badge>
                      <span v-else>
                        {{item.title}}
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="i-way">
            <h1><img src="../../../assets/img/blue.png" alt="">服务通道</h1>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                     style='width:100%;height:100%;'>
              <el-form-item label="标题" prop="qaTitle">
                <el-input size="small" type="input" v-model="ruleForm.qaTitle" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="问题描述" prop="qaDesc">
                <el-input size="small" type="textarea" v-model="ruleForm.qaDesc"></el-input>
              </el-form-item>
              <el-form-item label="联系人电话" prop="contactPhone">
                <el-input size="small" v-model.number="ruleForm.contactPhone"></el-input>
              </el-form-item>
              <el-form-item label="联系人QQ" prop="contactQq">
                <el-input size="small" v-model.number="ruleForm.contactQq"></el-input>
              </el-form-item>
              <el-form-item class='spel-btn'>
                <el-button size="small" type="primary" style='width:100%;' @click="submitForm('ruleForm')">提交问题
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="bottom i-process">
        <h1><img src="../../../assets/img/orange.png" alt="">操作流程</h1>
        <div class="process">
          <div><img src="../../../assets/img/Start.png" alt=""><span
            style='margin-top:10px;font-size:12px;'>Start</span></div>
          <div class='arrow'></div>
          <div class='process-fy' @click='skyCatLM'><img src="../../../assets/img/task_center.png" alt=""><span
            style='margin-top:10px;font-size:12px;'>商品管理</span></div>
          <div class='arrow'></div>
          <div class='process-fy' @click='limitword'><img src="../../../assets/img/goods_man.png" alt=""><span
            style='margin-top:10px;font-size:12px;'>极限词检测</span></div>
          <div class='arrow'></div>
          <div class='process-fy' @click='release'><img src="../../../assets/img/goods_rel.png" alt=""><span
            style='margin-top:10px;font-size:12px;'>商品发布</span></div>
          <div class='arrow'></div>
          <div class='process-fy' @click='taskCenter'><img src="../../../assets/img/limitword_test.png" alt=""><span
            style='margin-top:10px;font-size:12px;'>任务中心</span></div>
          <div class='arrow'></div>
          <div><img src="../../../assets/img/Finish.png" alt=""><span
            style='margin-top:10px;font-size:12px;'>Finish</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {returnFloat} from '@/assets/js/validate';

  export default {
    data() {
      var contactPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号码不能为空'));
        }
        if (!(/^1[34578][0-9]{9}$/.test(value))) {
          callback(new Error("手机号码格式不正确"));
        } else {
          callback();
        }
      };
      var contactQq = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('联系人QQ不能为空'));
        }
        if (!(/^[1-9]\d{4,10}$/.test(value))) {
          callback(new Error("联系人QQ格式不正确"));
        } else {
          callback();
        }
      };
      return {
        noticeList: [],
        ruleForm: {},
        releaseTotal: 0,
        removeTotal: 0,
        rechargeMoney: {
          totalConsumeAmount: 0,
          totalSurplusAmount: 0
        },
        rules: {
          qaTitle: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          qaDesc: [
            {required: true, message: '请输入问题描述', trigger: 'blur'}
          ],
          contactPhone: [
            {required: true, validator: contactPhone, trigger: 'blur'}
          ],
          contactQq: [
            {required: true, validator: contactQq, trigger: 'blur'}
          ]
        }
      }
    }, methods: {
      //商品管理
      skyCatLM() {
        if (process.env.NODE_ENV == 'development') {
          location.href = 'http://localhost:8080/#/goodsManage'
        } else {
          MainTab.createTab('2E16698022F94E8F8A2308CF529E9F1E', '商品管理', process.env.API_PAGE + 'goodsManage');
        }
      },
      //商品发布
      release() {
        if (process.env.NODE_ENV == 'development') {
          location.href = 'http://localhost:8080/#/goodsRelease'
        } else {
          MainTab.createTab('F5A87FACDDE344A9B76EF9A62A1439BB', '宝贝发布', process.env.API_PAGE + 'goodsRelease');
        }
      },
      //极限词检测
      limitword() {
        if (process.env.NODE_ENV == 'development') {
          location.href = 'http://localhost:8080/#/limitwordCare'
        } else {
          MainTab.createTab('28D2C06E0C7F4122B4E3D18F6DA3CC3F', '极限词检测', process.env.API_PAGE + 'limitwordCare');
        }
      },
      //任务中心
      taskCenter() {
        if (process.env.NODE_ENV == 'development') {
          location.href = 'http://localhost:8080/#/taskCenter'
        } else {
          MainTab.createTab('2044DAD755814182A7CF43EF7747223E', '任务中心', process.env.API_PAGE + 'taskCenter');
        }
      },
      //列表
      turnDetail(item) {
        if (process.env.NODE_ENV == 'development') {
          location.href = 'http://localhost:8080/#/notice/' + item.noticeId
        } else {
          MainTab.createTab('notice_' + item.noticeId, '查看公告', process.env.API_PAGE + 'notice/' + item.noticeId);
        }
      },
      //更多
      turnList() {
        if (this.noticeList.length == 0) {
          this.$message({
            message: '暂无公告消息',
            type: 'warning'
          });
          return false;
        }
        if (process.env.NODE_ENV == 'development') {
          location.href = 'http://localhost:8080/#/noticeDetail'
        } else {
          MainTab.createTab('noticeDetail', '公告列表', process.env.API_PAGE + 'noticeDetail');
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var self = this;
            this.$axios({
              method: 'post',
              url: process.env.OLD_API + 'api/login_index/save',
              data: self.ruleForm,
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
                  self.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  self.$refs[formName].resetFields();
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
      }
    },
    mounted() {
      var self = this;
      //首页今日搬家和发布的个数统计查询
      //发布
      this.$axios({
        method: 'post',
        url: process.env.OLD_API + 'api/login_index/publish'
      })
        .then(function (response) {
          if (response.data.code == 0) {
            self.releaseTotal = response.data.result;
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
      //搬家
      this.$axios({
        method: 'get',
        url: process.env.OLD_API + 'api/login_index/download'
      })
        .then(function (response) {
          if (response.data.code == 0) {
            self.removeTotal = response.data.result;
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

      //系统公告
      this.$axios({
        method: 'post',
        url: process.env.OLD_API + 'api/login_index/showNotices'

      })
        .then(function (response) {
          if (response.data.code == 0) {
            self.noticeList = response.data.result;
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

      //余额回显
      this.$axios({
        method: 'get',
        url: process.env.OLD_API + 'api/login_index/getMoney'
      })
        .then(function (response) {
          console.log(response)
          if (response.data.code == 0) {
            self.rechargeMoney = response.data.result;
            console.log(self.rechargeManey)
            self.rechargeMoney.totalConsumeAmount = returnFloat(self.rechargeMoney.totalConsumeAmount / 100);
            self.rechargeMoney.totalSurplusAmount = returnFloat(self.rechargeMoney.totalSurplusAmount / 100);
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

      this._post(process.env.BASE_API + "com.edb01.csj.core.service.TsPlatformCatalogService/1.0.0/selTmallPlatFormCatalog").then((response)=>{
        console.log(response);
        if(response.data.success){
          var catalogList = response.data.result;
          catalogList.forEach(item =>{
            delete item.createTime;
            delete item.creater;
            delete item.platformCatalogPid;
            delete item.platformType;
            delete item.updateTime;
            delete item.updater;
            if(item.childCatalog){
              item.childCatalog.forEach(item1 =>{
                delete item1.createTime;
                delete item1.creater;
                delete item1.platformCatalogPid;
                delete item1.platformType;
                delete item1.updateTime;
                delete item1.updater;
                if(item1.childCatalog){
                  item1.childCatalog.forEach(item2 =>{
                    delete item2.createTime;
                    delete item2.creater;
                    delete item2.platformCatalogPid;
                    delete item2.platformType;
                    delete item2.updateTime;
                    delete item2.updater;
                    if(item2.childCatalog){
                      item2.childCatalog.forEach(item3 =>{
                        delete item3.createTime;
                        delete item3.creater;
                        delete item3.platformCatalogPid;
                        delete item3.platformType;
                        delete item3.updateTime;
                        delete item3.updater;
                      })
                    }
                  })
                }
              })
            }
          })
          localStorage.setItem('catalogList',JSON.stringify(catalogList));
          //this.$store.dispatch('setCatalogList',catalogList)
          //this.api.catalogList = catalogList;
        }else{
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-form-item {
    margin-bottom: 18px;
  }

  #home {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #FBFBFB;
  }

  .el-input {
    width: 100%;
  }

  .contain {
    margin-left: 50px;
    margin-right: 50px;
    position: relative;
    height: 100%;
    min-width: 980px;
    min-height: 890px;
  }

  .top {
    height: 110px;
    line-height: 110px;
    position: absolute;
    top: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .top > div {
    flex: 1;
    height: 110px;
    background: #fff;
    margin-right: 40px;
    border-radius: 10px;
    box-shadow: 3px 3px 8px #CDCDCD;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .top > div b {
    margin-left: 30px;
    font-size: 20px;
  }

  .center {
    height: 100%;
    padding: 200px 0 290px 0;
  }

  .center > div {
    float: left;
    width: 48%;
    height: 100%;
    background: #fff;
    box-shadow: 3px 3px 8px #CDCDCD;
    padding: 25px;
  }

  .center > .right {
    float: right;
  }

  .i-notice {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #fff;
  }

  .i-notice ul li a {
    display: inline-block;
    width: 100%;
  }

  .i-notice ul li {
    line-height: 30px;
    cursor: pointer;
    color: #409EFF;
  }

  .i-notice ul li span {
    margin-right: 5px;
  }

  .i-way h1, .i-notice h1, .i-process h1 {
    line-height: 30px;
    font-size: 16px;
    margin-bottom: 20px;
    float: left;
    width: 100%;
  }

  .i-way h1 img, .i-notice h1 img, .i-process h1 img {
    margin-right: 10px;
  }

  .bottom {
    height: 200px;
    position: absolute;
    bottom: 50px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 3px 3px 8px #CDCDCD;
    width: 100%;
    padding: 25px;
  }

  .i-way {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #fff;
    position: relative;
  }

  .i-way .demo-ruleForm {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    padding: 45px 10px 0 10px;
  }

  .i-way .demo-ruleForm div {
    flex: 1;
  }

  .i-way .demo-ruleForm label {
    width: 85px;
    display: inline-block;
    text-align: right;
    margin-bottom: -18px;
    float: left;
  }

  .i-way .el-input__suffix {
    right: 20px;
  }

  .process {
    width: 90%;
    margin-left: 5%;
    height: 100px;
    margin-top: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .process > div {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  .arrow {
    border-bottom: 1px solid #539FFF;
    width: 100%;
    margin-top: -75px;
    height: 50% !important;
    flex: 3 !important;
  }

  .arrow > img {
    width: 100%;
  }

  .process-fy {
    cursor: pointer;
  }
</style>
