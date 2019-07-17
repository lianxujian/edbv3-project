<template>
  <div>
    <div class="demo-input-suffix">
      <span class="span-box">
      时间段：
      </span>
      <el-input
        style="width: 20%"
        placeholder="请输入时间段"
        :disabled="dis"
        v-model="input.timeBucket">
      </el-input>
    </div>
    <div class="demo-input-suffix">
      <span class="span-box">
         锁定时间（秒）：
      </span>
      <el-input
        style="width: 20%"
        placeholder="请输入锁定时间（秒）"
        :disabled="dis"
        v-model="input.lockedTime">
      </el-input>
    </div>
    <div class="demo-input-suffix">
      <span class="span-box">
          行为次数：
      </span>
      <el-input
        style="width: 20%"
        :disabled="dis"
        placeholder="请输入行为次数"
        v-model="input.registQuantity">
      </el-input>
    </div>
    <div>
      <el-button type="primary" style="margin-left: 200px;" @click="amendInput()">修改</el-button>
      <el-button type="primary" style="margin-left: 200px;" @click="save()">保存</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        queryD: () => {},
        input: [],
        dis: true,
        version: '1.0.0', // 版本号
        token: '' //
      }
    },
    props: ['logo'],
    methods: {
      // 让输入框可以输入
      amendInput() {
        console.log(1233);
        this.dis = false
      },
      // 点击保存提交数据
      save() {
        let self = this
        if (self.dis === false) {
          if (isNaN(self.input.timeBucket) || self.input.timeBucket === '') {
            self.$message({
              message: '时间段为数字且不能为空',
              type: 'warning'
            })
            return false
          }
          if (isNaN(self.input.lockedTime) || self.input.lockedTime === '') {
            self.$message({
              message: '锁定时间为数字且不能为空',
              type: 'warning'
            })
            return false
          }
          if (isNaN(self.input.registQuantity) || self.input.registQuantity === '') {
            self.$message({
              message: ' 行为次数为数字且不能为空',
              type: 'warning'
            })
            return false
          }
          var par = {
            timeBucket: self.input.timeBucket,
            registQuantity: self.input.registQuantity,
            lockedTime: self.input.lockedTime,
            blackConfigType: self.logo,
            clToken: self.token
          }
          self.$axios({
            method: 'post',
            url: process.env.API_HOST + 'com.edb01.risk.service.api.iface.RiskRulesApi/' + self.version + '/saveUpdate',
            data: par,
            transformRequest: [function(data) {
              let newData = ''
              for (var k in data) {
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
              }
              return newData
            }]
          })
            .then(function(res) {
              if (res.data.code === 0) {
                self.dis = true
                self.$message({
                  message: '保存成功',
                  type: 'success'
                })
                self.queryD()
              } else {
                self.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
            .catch(function(err) {
              console.log(err)
            })
        }
      }
    },
    created() {
      if (localStorage.getItem('clToken')) {
        this.token = localStorage.getItem('clToken');
      }
      /*console.log(this.$store.getters.token)
      console.log(this.$store.getters.version)*/
      // 页面初始化
      this.queryD = () => {
        var self = this
        self.$axios({
          method: 'get',
          url: process.env.API_HOST + 'com.edb01.risk.service.api.iface.RiskRulesApi/' + self.version + '/getByType?type=' + self.logo + '&clToken=' + self.token
        })
          .then(function(res) {
            if (res.data.code === 0) {
              self.input = res.data.result
            } else {
              self.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
          .catch(function(err) {
            console.log(err)
          })
      }
      this.queryD() // 调用
    }
  }
</script>

<style scoped>
  .demo-input-suffix {
    margin: 30px;
  }
  .span-box{
    display: inline-block;
    width: 150px;
    text-align: right;
  }
</style>
