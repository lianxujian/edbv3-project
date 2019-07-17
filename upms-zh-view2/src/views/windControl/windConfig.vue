<template>
 <div>
   <div style="padding: 20px;border-top: 1px solid #D8DCE5;min-width: 1040px;">
     <div style="height: 40px;width: 100%;background: #409EFF;">
       <ul class="ul-box">
         <li style="margin-left: -17px;">风控配置</li>
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
        ip: 1,
        mac: 2,
        login: 3,
        pass: 4

      }
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

</style>
