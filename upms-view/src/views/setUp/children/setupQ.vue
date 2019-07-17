<!--设置权限 贾南风-->
<template>
  <div id="setupQ"  v-loading="loading"  element-loading-text="保存中...">
    <div>
      <el-breadcrumb separator=">" style="width:100%;background:#eee;padding:10px;margin-bottom: 10px;">
        <el-breadcrumb-item :to="{path: '/account'}">账号</el-breadcrumb-item>
        <el-breadcrumb-item>设置权限</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="setupB" :style="'height:' + table_h + 'px'">
      <div style="margin: 20px 0;height: 30px;line-height: 30px;">
        <el-checkbox v-model="copy" @change="changeData">复制他人权限</el-checkbox>
        <div class="select-box" v-if="copy">
          <el-select v-model="departmentId" placeholder="请选择部门" @change="departmentChange(departmentId)">
            <el-option
              v-for="item in options"
              :key="item.departmentName"
              :label="item.departmentName"
              :value="item.departmentId">
            </el-option>
          </el-select>
        </div>
        <div class="select-box" v-if="copy">
          <el-select v-model="userId" placeholder="请选择账号" :disabled="!departmentId" @change="echoData(userId)">
            <el-option
              v-for="item in optionsAll"
              :key="item.loginName"
              :label="item.loginName"
              :value="item.userId">
            </el-option>
          </el-select>
        </div>
      </div>
      <div>
        <div class="box">设置角色</div>
        <div class="box-common" >
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"  @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 1px 0 5px 0;"></div>
            <el-checkbox v-for="(item1,index) in tableData.privilegeGroupBeans" :label="item1.privilegegroupName" style="margin: 5px 30px 5px 1px;"  :key="index" v-model="item1.check" @change="ClickPrivilegeGroupBeans">
            </el-checkbox>
        </div>
        <div>
          <div class="box">设置店铺权限</div>
          <div class="box-common" v-for="(item,index) in tableData.storeBeans" style="margin: 5px 0 0 15px;">
            <span style="font-weight: bold;display: inline-block;width: 100px;font-size: 16px;padding-left: 1px">{{item.platFormName}}</span>
            <el-checkbox v-cloak :indeterminate="item.isIndeterminate" v-model="item.checked" @change="clickAllStoreBeans(item,index)" >全选</el-checkbox>
            <div style="width: 80%;margin-left: -10px;" v-cloak>
                <el-checkbox v-for="(role,index) in item.storeBeans" :label="role.storeName" @change="clickStoreBeans(item)"  v-model="role.checked" :key="index" class="checkbox-one"></el-checkbox>
            </div>
          </div>
        </div>
        <div>
          <div class="box">设置仓库权限</div>
          <div class="box-common">
            <el-checkbox :indeterminate="isIndeterminate1" @change="handleWarehouseBeans" v-model="checkAll1" >全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
              <el-checkbox v-for="(role,index) in tableData.warehouseBeans" :label="role.storageName" :key="index"   style="margin: 5px 20px 5px 1px;"  v-model="role.checked" @change="handleClickWarehouseBeans">
              </el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="footer" style="border: none!important;height: 42px!important;">
        <el-button @click="backPage">返 回</el-button>
        <el-button type="primary" @click="saveRole()">保 存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        queryDa: () => {}, // 方法
        loading: false,  //
        tableData: [],  //
        version: '1.0.0',  //
        options: [], // 部门下拉框
        optionsAll: [], // 部门下对应员工
        checkAll: false, // 角色
        checkAll1: false, // 仓库
        isIndeterminate: false, // 角色
        isIndeterminate1: false,// 仓库
        departmentId: '', //部门id
        userId : '', // 员工
        table_h: 0,  // 高度
        roleData: '', // 角色
        roleData1: [], // 假数据
        shop: '', // 店铺
        copy: false, // 复制权限
      }
    },
    methods: {
      // 选择账号回显的值
      echoData(val) {
        this._post('com.edb01.upms.service.UserService/'+ this.version+ '/getUserPriviegeBean',{userId: val})
          .then( res => {
            if(res.data.success == true){
              this.$nextTick( () => {
                this.tableData = res.data.result;
              })

            }
          });
      },
      // 保存权限
      saveRole() {
        if(this.loading){ // 用户不能连续点击
          return false;
        }
        //if(this.copy){ // 复制权限提交
         /* if(this.departmentId == ''){
            this.$message({
              message:'请选择部门',
              type: 'warning'
            });
            return false;
          }
          if(this.userId == ''){
            this.$message({
              message:'请选择账号',
              type: 'warning'
            });
            return false;
          }
          this.loading = true;
          this._post('com.edb01.upms.service.UserService/' +this.version+ '/copyUserPriviege',{userId: this.userId,userIds: this.$router.history.current.params.userId})
            .then((res) => {
               if(res.data.success == true){
                 this.$message({
                   message: '复制权限成功',
                   type: 'success'
                 });
                 this.loading = false;
                 this.$router.push({path: '/account'});
               }else{
                 this.loading = false;
                 this.$message({
                   message: res.data.msg,
                   type: 'warning'
                 })
               }
            })

*/
          let data = {
            userId: this.$router.history.current.params.userId,
            ArrayprivilegeGroups: '', // 角色
            ArrayStores: '', // 店铺
            ArrayWarehouses: '' // 仓库
          };
          let i = 0;
          let j = 1;
          let k = 0;
          // 拼接选择角色的id
          this.tableData.privilegeGroupBeans.forEach( item1 => {
            if(item1.check == true){
              i++;
              data.ArrayprivilegeGroups += item1.privilegegroupId + ',';
            }
          });
          // 判断是否只是选择一个角色
          if(i == 0){
            this.$message({
              message: '请选择角色',
              type: 'warning'
            });
            return false;
          }
          // 拼接选择店铺的id
          this.tableData.storeBeans.forEach(item => {
            item.storeBeans.forEach( item1 => {
              if(item1.checked == true){
                j++;
                  data.ArrayStores += item1.storeId + ',';
              }
            })
          });
          // 判断是否只是选择一个店铺
          if(j == 0){
            this.$message({
              message: '请选择店铺',
              type: 'warning'
            });
            return false;
          }
          // 拼接选择仓库的id
          this.tableData.warehouseBeans.forEach(item2 => {
            if(item2.checked == true){
              k++;
              data.ArrayWarehouses += item2.storageId + ',';
            }
          });
          // 判断是否只是选择一个仓库
          if(k == 0){
            this.$message({
              message: '请选择仓库',
              type: 'warning'
            });
            return false;
          }
          this.loading = true;
          data.ArrayprivilegeGroups = data.ArrayprivilegeGroups.slice(0,-1); // 角色
          data.ArrayStores = data.ArrayStores.slice(0,-1); // 店铺
          data.ArrayWarehouses = data.ArrayWarehouses.slice(0,-1); // 仓库
          this._post('com.edb01.upms.service.UserService/' + this.version+ '/optionUserPriviege', data)
            .then((res) => {
                if(res.data.success == true){
                  this.$router.push({path: '/account'});
                  this.loading = false;
                  this.$message({
                    message: '设置权限成功',
                    type: 'success'
                  })
                }else{
                  this.loading = false;
                  this.$message({
                    message: '设置权限失败',
                    type: 'warning'
                  })
                }
            })

      },
      // 复制权限部门改变时
      departmentChange(val) {
        this.userId = ''; // 清空员工
        let data = {
          departmentId: val
        };
        this.queryDa(data);

      },
      // 仓库的全选改变时
      handleWarehouseBeans(val) {
        if (val) {
          this.tableData.warehouseBeans.forEach((item) => {
            item.checked = true;
          });
          this.isIndeterminate1 = false;
        } else {
          this.tableData.warehouseBeans.forEach((item) => {
            item.checked = false;
          });
          this.isIndeterminate1 = false
        }
      },
      // 仓库的单个checkbox改变时
      handleClickWarehouseBeans() {
        var j = 0;
        this.tableData.warehouseBeans.forEach((item) => {
          if(item.checked == true) {
            j++;
          }
        });
        if(j == this.tableData.warehouseBeans.length){
          this.isIndeterminate1 = false;
          this.checkAll1 = true;
        }else if(j < this.tableData.warehouseBeans.length && j !== 0){
          this.isIndeterminate1 = true;
          this.checkAll1 = false;
        }else if(j == 0){
          this.checkAll1 = false;
          this.isIndeterminate1 = false;
        }

      },
      // 店铺的全选改变时
      clickAllStoreBeans(row) {
        // console.log(row.checked,44);
        if(row.checked){
          row.storeBeans.forEach(item => {
            item.checked = true;
          })
        }else{
          row.storeBeans.forEach(item => {
            item.checked = false;
          })
        }

      },
      // 店铺的单个checkbox改变时
      clickStoreBeans(row) {
        var i = 0;
        row.storeBeans.forEach(item => {
          if(item.checked == true){
            i++;
          }
        });

        if(i == row.storeBeans.length){
          row.isIndeterminate = false;
          row.checked = true;
        }else if(i < row.storeBeans.length && i !== 0){
          row.isIndeterminate = true;
          row.checked = false;
        }else if(i == 0){
          row.checked = false;
          row.isIndeterminate = false;
        }
      },
      // 角色改变时
      ClickPrivilegeGroupBeans() {
        var j = 0;
        this.tableData.privilegeGroupBeans.forEach((item) => {
          if(item.check == true) {
            j++;
          }
        });
        if(j == this.tableData.privilegeGroupBeans.length){
          this.isIndeterminate = false;
          this.checkAll = true;
        }else if(j < this.tableData.privilegeGroupBeans.length && j !== 0){
          this.isIndeterminate = true;
          this.checkAll = false;
        }else if(j == 0){
          this.checkAll = false;
          this.isIndeterminate = false;
        }
      },
      // 角色全选按钮触发的逻辑
      handleCheckAllChange(val) {
        if (val) {
          this.tableData.privilegeGroupBeans.forEach((item) => {
            item.check = true;
          })
          this.isIndeterminate = false;
        } else {
          this.tableData.privilegeGroupBeans.forEach((item) => {
            item.check = false;
          });
          this.isIndeterminate = false
        }
      },
      // 复制权限改变的时候
      changeData(val) {
        this.departmentId = ''; // 清空部门
        this.userId = ''; // 清空账号
      },
      // 返回上一个页面
      backPage() {
        this.$router.push({name: 'account',params: {departmentId: this.$router.history.current.params.departmentId}});
        // this.$router.push({path:'/account'}) //
      },
    },
    created() {
      // 判断修改多个账号还是一个
      if(this.$router.history.current.params.userId.match(/,/g)){ // 判断传过来的参数有逗号
        this._post('com.edb01.upms.service.UserService/'+ this.version+ '/getUserPriviegeBeanList')
          .then(res => {
            if(res.data.success == true){
              this.tableData = res.data.result;
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      }else{
        // 点击一个账号跳转过来加载的接口
        this._post('com.edb01.upms.service.UserService/'+ this.version+ '/getUserPriviegeBean',{userId: this.$router.history.current.params.userId})
          .then(res => {
            if(res.data.success == true){
              for (var i = 0; i < res.data.result.storeBeans.length; i++) {
                res.data.result.storeBeans[i].checked = false;
                res.data.result.storeBeans[i].isIndeterminate = false;

              }
              // 角色效果的回显
              let i = 0;
              res.data.result.privilegeGroupBeans.forEach(item => {
                if(item.check == true){
                  i++;
                }
              });
              if(i == res.data.result.privilegeGroupBeans.length){
                this.isIndeterminate = false;
                this.checkAll = true;
              }else if(i < res.data.result.privilegeGroupBeans.length && i !== 0){
                this.isIndeterminate = true;
                this.checkAll = false;
              }else if (i == 0){
                this.isIndeterminate = false;
                this.checkAll = false;
              }
              // 店铺的回显效果
              res.data.result.storeBeans.forEach(item => {
                let j = 0;
                item.storeBeans.forEach((item1) => {
                  if(item1.checked == true){
                    j++
                  }
                });
                if(j == item.storeBeans.length){
                  item.checked = true;
                  item.isIndeterminate = false;
                }else if(j < item.storeBeans.length && j !== 0){
                  item.checked = false;
                  item.isIndeterminate = true;
                }else if(j == 0){
                  item.checked = false;
                  item.isIndeterminate = false;
                }
              });
              // 仓库效果的回显
              let k = 0;
              res.data.result.warehouseBeans.forEach(item => {
                if(item.checked == true){
                  k++;
                }
              });
              if(k == res.data.result.warehouseBeans.length){
                this.isIndeterminate1 = false;
                this.checkAll1 = true;
              }else if(k < res.data.result.warehouseBeans.length && k !== 0){
                this.isIndeterminate1 = true;
                this.checkAll1 = false;
              }else if (k == 0){
                this.isIndeterminate1 = false;
                this.checkAll1 = false;
              }
              this.tableData = res.data.result
            }else{
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      };
      // 动态获取高度
      this.$nextTick(function () {
        this.table_h = $(window).height() - $('#setupB').offset().top - 100;
      });
      this._post('com.edb01.upms.service.DepartmentService/'+ this.version + '/getAll')
        .then((res) => {
          if (res.data.code == 0) {
            let result = res.data.result;
            this.options = result.nodes;
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    mounted() {
      // 部门下的对应员工
      this.queryDa = (par) => {
        let self = this;
        self._post('com.edb01.upms.service.UserService/' + self.version + '/getByPager', par)
          .then((res) => {
            if (res.data.code == 0) {
              var userId = this.$router.history.current.params.userId,optionsAll = [];
              if(!userId.match(/,/g)){
                //一个账号
                res.data.result.rows.forEach(item => {
                  if(item.userId != userId){
                    optionsAll.push(item);
                  }
                })
              }else{
                optionsAll = res.data.result.rows;
              }
              self.optionsAll = optionsAll;
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch((err) => {
            console.log(err)
          });
      };
    }
  }
</script>
<style scoped>
  #setupQ {
    border-left: 30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 15px solid #F0F1F5;
    padding: 15px 20px;
  }

  #setupQ .box {
    width: 100%;
    height: 22px;
    padding-left: 10px;
    line-height: 22px;
    background: #D1D4DD;
    margin: 10px 0;
  }

  #setupQ .select-box {
    display: inline-block;
    margin-left: 15px;
    width: 200px;
  }

  #setupQ .box-common {
    margin-left: 20px;
  }

  #setupB {
    overflow-y: scroll;
  }
  #setupQ .checkbox-one{
    margin: 10px 20px;
  }
  #setupQ .footer{
    width: 100%;
    text-align: center;
    position: fixed;
    bottom:20px;left: 1%;
  }
</style>

