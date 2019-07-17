<!--售后设置 樊虎-->
<template>
  <div id="afterSaleSet">
    <el-select v-model="value5" collapse-tags multiple filterable placeholder="请选择" @change="selectAll">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        options: [{
          value: '选项0',
          label: '全部'
        },{
          value: '1',
          label: '黄金糕'
        }, {
          value: '2',
          label: '双皮奶'
        }, {
          value: '3',
          label: '蚵仔煎'
        }, {
          value: '4',
          label: '龙须面'
        }, {
          value: '5',
          label: '北京烤鸭'
        }],
        value5: [],
        oldOptions:[],
      }
    },
    beforeMount() {

    },
    mounted(){
      this.value5 = ['1','2'];
      this.oldOptions = ['1','2'];
    },
    methods:{
      selectAll(val) {
        let allValues = []
        //保留所有值
        for (let item of this.options) {
          allValues.push(item.value)
        }

        // 用来储存上一次的值，可以进行对比
        const oldVal = this.oldOptions;

        // 若是全部选择
        if (val.includes('选项0')) this.value5 = allValues;

        // 取消全部选中  上次有 当前没有 表示取消全选
        if (oldVal.includes('选项0') && !val.includes('选项0')) this.value5 = [];

        // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if (oldVal.includes('选项0') && val.includes('选项0')) {
          const index = val.indexOf('选项0')
          val.splice(index, 1); // 排除全选选项
          this.value5 = val;
        }

        //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if (!oldVal.includes('选项0') && !val.includes('选项0')) {
          if (val.length === allValues.length - 1) this.value5 = ['选项0'].concat(val);
        }

        //储存当前最后的结果 作为下次的老数据
        this.oldOptions = this.value5;
      }
    }
  }
</script>
<style scoped>

</style>

