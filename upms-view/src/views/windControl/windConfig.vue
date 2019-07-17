<!--风控配置 贾南风-->
<template>
 <div id="windConfig" :style="'height:'+ table_h + 'px'">
   <div style="min-width: 1040px;" id="fitTable" >
     <div style="height: 40px;width: 100%;background: #409EFF;">
       <ul class="ul-box">
         <li style="margin-left: 10px;">风控配置</li>
       </ul>
     </div>
   <el-tabs type="border-card" style="height: 100%;">
     <el-tab-pane label="IP验证">
      <v-ip :logo="ip"></v-ip>
     </el-tab-pane>
     <el-tab-pane label="Mac验证">
       <v-ip :logo="mac"></v-ip>
     </el-tab-pane>
     <el-tab-pane label="登录频度验证">
       <v-ip :logo="login"></v-ip>
     </el-tab-pane>
     <el-tab-pane label="密码错误次数验证">
       <v-ip :logo="pass"></v-ip>
     </el-tab-pane>
   </el-tabs>
   </div>
 </div>
</template>

<script>
  import ip from './windConfig/ip.vue'
  export default {
    components: {
      'v-ip': ip
    },
    data() {
      return {
        table_h: 0, // 表格高度
        // 当前点击tab
        ip: 1,
        mac: 2,
        login: 3,
        pass: 4

      }
    },
    created() {
      // 动态获取表格高度
      this.$nextTick(function() {
        var a = document.body.clientHeight; // 页面高度
        var b = document.getElementById('fitTable').offsetTop; // 表格距离顶部的距离
        this.table_h = a - b + 30;
      })
    }
  }
</script>

<style scoped>
  ol, ul {
    list-style: none;
  }
  .ul-box {
    line-height: 40px;
    color: #fff;
  }
  #windConfig{
    border-left: 30px solid #F0F1F5;
    border-right: 30px solid #F0F1F5;
    border-top: 15px solid #F0F1F5;
    border-bottom: 15px solid #F0F1F5;
    padding: 15px 20px;
  }
</style>
