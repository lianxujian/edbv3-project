<!--多选下拉 樊虎-->
<template>
  <div id="multiple-select" style="display:inline-block;">
    <el-select style="width:100%;" v-model="value5" :disabled="disabled" collapse-tags multiple filterable placeholder="请选择" @change="selectAll">
      <el-option
        v-for="(item,i) in options"
        :key="i"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  export default {
    props: {
      selectArr: Array,
      valueArr: Array,
      disabled:Boolean
    },
    data() {
      return {
        options: [],
        value5: [],
        oldOptions:[],
      }
    },
    beforeMount() {

    },
    watch:{
      selectArr:function(value,oldValue){
        //赋下拉集合
        var selectArr = JSON.parse(JSON.stringify(value));
        if(selectArr.length > 0 && selectArr[0].label != '全部'){
          selectArr.unshift({
            label:'全部',
            value:'选项0'
          })
        }
        this.options = selectArr;
      },
      valueArr:function(value,oldValue){
        if(value.length != oldValue.length){
          //重新赋值
          this.value5 = value;
          this.oldOptions = value;
          this.selectAll(this.value5)
        }
      }
    },
    mounted(){
      //赋下拉集合
      var selectArr = JSON.parse(JSON.stringify(this.selectArr));
      if(selectArr.length > 0 && selectArr[0].label != '全部'){
        selectArr.unshift({
          label:'全部',
          value:'选项0'
        })
      }
      this.options = selectArr;
      //赋值
      this.value5 = this.valueArr;
      this.oldOptions = this.valueArr;
      this.selectAll(this.value5)
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

        var emitArr = JSON.parse(JSON.stringify(this.value5));
        if(emitArr[0] == '选项0')emitArr.shift();
        this.$emit('multipleChange',emitArr);
      }
    }
  }
</script>
<style>
  #multiple-select .el-select__tags{
    width:100% !important;
  }
</style>

