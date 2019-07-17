<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px">
      <div class="ftitle">用户登录</div>
      <el-form-item label="用户名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="密 码">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        this.$router.push({ name:'Layout'});
      }
    },
    beforeCreate () {
      document.querySelector('body').setAttribute('style', 'background:#ccc')
    },
    beforeDestroy () {
      document.querySelector('body').setAttribute('style', '')
    }
  }
</script>

<style scoped>
  body{
    background: #ccc;
  }

  .login{
    text-align:center;
    padding: 150px 0px 0px 0px;
  }
  .login form{
    width: 500px;
    text-align: center;
    display:inline-block;
    border:1px darkgray solid;
    padding: 20px 20px 0px 20px;
    background: #fff;
  }
  .ftitle{
    text-align: left;
    font-size: 14px;
    color: #606266;
    margin: 0px 0px 20px 0px;
  }

</style>
