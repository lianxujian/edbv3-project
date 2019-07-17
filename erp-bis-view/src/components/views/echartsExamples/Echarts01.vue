<template>
  <div id="echarts01">
    <div id="echarts" style="width: 90%;height:500px;"></div>
  </div>
</template>
<script>

  export default{
    data(){
      return{
        // 指定图表的配置项和数据
        option : {
          title: {
            text: '数据监控折线统计图',
            left:'44%',
            top:'5%'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['成功','失败'],
            top:'13%'
          },
          grid: {
            top:'20%',
            left: '3%',
            right: '4%',
            bottom: '5%',
            containLabel: true
          },
          toolbox: {
            feature: {
//              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['江西保险行业协会','中国经济网','湖北保险行业协会','江西保险行业协会','中国经济网','湖北保险行业协会','中国经济网']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name:'成功',
              type:'line',
              stack: '总量',
              data:[1, 5, 8, 9, 3, 4, 6]
            },
            {
              name:'失败',
              type:'line',
              stack: '总量',
              data:[6, 6, 8, 4, 6, 7, 5]
            }
          ]
        }
      }
    },
    mounted(){
      this.echarts()
    },
    methods:{
      echarts:function () {
        var _this=this;
        var echarts = require('echarts');
//        console.log('----',echarts.init);
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts'));

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(_this.option);
      }
    }
  }
</script>
<style scoped>

</style>

