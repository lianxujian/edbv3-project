<!--公共日期时间组件 尘音-->
<template>
  <div id="dataTime">
    <el-date-picker
      @change="timeChange1"
      style="width: 45%!important;"
      v-model="time1"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
    ~
    <el-date-picker
      @change="timeChange2"
      style="width: 45%!important;"
      v-model="time2"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      }
    },
    props: {
      timeCom1:{},
      timeCom2:{}
    },
    computed: {
      time1: {
        get: function () {
          if(this.timeCom1 == null) {
            return this.timeCom1
          }else {
            return new Date(this.timeCom1)
          }

        },
        set: function (val) {
          this.$emit('timeVal1',val);
//          const mm1 = new Date(val).getTime();
//          const mm2 = new Date(this.timeCom2).getTime();
//          console.log(mm1,mm2);
//          if(mm1 > mm2 && mm2 > 0) {
//            this.$alert('起始时间不能大于结束时间！', {
//              type: 'info',
//              center: true,
//              confirmButtonText: '确定',
//            });
//          }else if(mm2 - mm1 > 2678400000 && mm1 != '') {
//            this.$alert('对不起，只能查询31天以内的数据！', {
//              type: 'info',
//              center: true,
//              confirmButtonText: '确定',
//            });
//          }else {
//            this.$emit('timeVal1',val);
//          }
        }
      },
      time2: {
        get: function () {
          if(this.timeCom2 == null) {
            return this.timeCom2
          }else {
            return new Date(this.timeCom2)
          }
        },
        set: function (val) {
          this.$emit('timeVal2',val);
//          const mm1 = new Date(this.timeCom1).getTime();
//          const mm2 = new Date(val).getTime();
//          if(mm1 > mm2 && mm2 > 0) {
//            this.$alert('结束时间不能小于起始时间！', {
//              type: 'info',
//              center: true,
//              confirmButtonText: '确定',
//            });
//          }else if(mm2 - mm1 > 2678400000 && mm2 != '') {
//            this.$alert('对不起，只能查询31天以内的数据！', {
//              type: 'info',
//              center: true,
//              confirmButtonText: '确定',
//            });
//          }else {
//            this.$emit('timeVal2',val);
//
//          }
        }
      }
    },
    mounted() {
      this.$watch('time1',function (val) {
        console.log(22,val)
      })
    },
    methods: {

      timeChange1: function () {
        const mm1 = new Date(this.time1).getTime();
        const mm2 = new Date(this.timeCom2).getTime();
        console.log(mm1,mm2);
        if(mm1 > mm2 && mm2 > 0) {
          this.$alert('起始时间不能大于结束时间！', {
            type: 'info',
            center: true,
            confirmButtonText: '确定',
          });
        }else if(mm2 - mm1 > 2678400000 && mm1 != '') {
          this.$alert('对不起，只能查询31天以内的数据！', {
            type: 'info',
            center: true,
            confirmButtonText: '确定',
          });
        }
      },
      timeChange2: function () {
        const mm1 = new Date(this.timeCom1).getTime();
        const mm2 = new Date(this.time2).getTime();
        if(mm1 > mm2 && mm2 > 0) {
          this.$alert('结束时间不能小于起始时间！', {
            type: 'info',
            center: true,
            confirmButtonText: '确定',
          });
        }else if(mm2 - mm1 > 2678400000 && mm2 != '') {
          this.$alert('对不起，只能查询31天以内的数据！', {
            type: 'info',
            center: true,
            confirmButtonText: '确定',
          });
        }
      },
    }
  }
</script>
