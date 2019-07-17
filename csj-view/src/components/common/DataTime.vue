<!--公共日期时间组件 尘音-->
<template>
  <div id="dataTime">
    <el-date-picker
      v-model="time1"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
    ~
    <el-date-picker
      v-model="time2"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </div>
</template>
<script>
  export default {
    props: {
      timeCom1:{},
      timeCom2:{}
    },
    computed: {
      time1: {
        get: function () {
          return this.timeCom1
        },
        set: function (val) {
          const mm1 = new Date(val).getTime();
          const mm2 = new Date(this.timeCom2).getTime();
          if(mm1 > mm2) {
            this.$alert('对不起，请选择正确的时间区间！', {
              confirmButtonText: '确定',
            });
          }else {
            this.$emit('timeVal1',val);
          }
        }
      },
      time2: {
        get: function () {
          return this.timeCom2
        },
        set: function (val) {
          const mm1 = new Date(this.timeCom1).getTime();
          const mm2 = new Date(val).getTime();
          if(mm1 > mm2) {
            this.$alert('对不起，请选择正确的时间区间！', {
              confirmButtonText: '确定',
            });
          }else {
            this.$emit('timeVal2',val);
          }
        }
      }
    }
  }
</script>
<style scoped>
  #dataTime{
    display: inline-block;
  }
</style>
