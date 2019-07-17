<!-- 下拉懒加载 樊虎 -->
<template>
  <div id="lazySelect">
    <el-select
      v-model="value9"
      filterable
      remote
      size="small"
      reserve-keyword
      placeholder="请输入关键词"
      @change="changeChannel"
      :remote-method="remoteMethod"
      :loading="loading">
      <el-option
        class="lazyOption"
        v-for="item in options4"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  export default {
    props:{
      list:Array,
      model:String,
      parentArr:String
    },
    data() {
      return {
        options4: [],
        value9: [],
        list1: [{"value":"Alabama","label":"1"},{"value":"Alaska","label":"2"},{"value":"Arizona","label":"3"},{"value":"Arkansas","label":"4"},{"value":"California","label":"5"},{"value":"Colorado","label":"6"},{"value":"Connecticut","label":"7"},{"value":"Delaware","label":"8"},{"value":"Florida","label":"9"},{"value":"Georgia","label":"10"},{"value":"Hawaii","label":"11"},{"value":"Idaho","label":"12"},{"value":"Illinois","label":"13"},{"value":"Indiana","label":"14"},{"value":"Iowa","label":"15"},{"value":"Kansas","label":"16"},{"value":"Kentucky","label":"17"},{"value":"Louisiana","label":"18"},{"value":"Maine","label":"19"},{"value":"Maryland","label":"20"},{"value":"Massachusetts","label":"21"},{"value":"Michigan","label":"22"},{"value":"Minnesota","label":"23"},{"value":"Mississippi","label":"24"},{"value":"Missouri","label":"25"},{"value":"Montana","label":"26"},{"value":"Nebraska","label":"27"},{"value":"Nevada","label":"28"},{"value":"New Hampshire","label":"New 29"},{"value":"New Jersey","label":"New 30"},{"value":"New Mexico","label":"31"},{"value":"New York","label":"32"},{"value":"North Carolina","label":"33"},{"value":"North Dakota","label":"34"},{"value":"Ohio","label":"35"},{"value":"Oklahoma","label":"36"},{"value":"Oregon","label":"37"},{"value":"Pennsylvania","label":"38"},{"value":"Rhode Island","label":"39"},{"value":"South Carolina","label":"40"},{"value":"South Dakota","label":"41"},{"value":"Tennessee","label":"42"},{"value":"Texas","label":"43"},{"value":"Utah","label":"44"},{"value":"Vermont","label":"45"},{"value":"Virginia","label":"46"},{"value":"Washington","label":"47"},{"value":"West Virginia","label":"48"},{"value":"Wisconsin","label":"49"},{"value":"Wyoming","label":"50"}],
        loading: false,
        originlist1:[],
        eleSelect:null,
      }
    },
    mounted(){
      this.list1 = this.list;
      this.value9 = this.model;

      this.options4 = [];
      var index = '';
      this.list1.forEach((item,i)=>{
        if(this.model == item.platformAttributeValueId){
          index = i;
        }
        if(i<10){
          this.options4.push(item);
        }
      })
      if(index && index > 9){
        this.options4[9] = this.list1[index];
      }
      this.originlist1 = this.list1;

      var _this = this;
      $('.el-scrollbar__wrap').scroll(function(){
        _this.eleSelect = $(this);
        //console.log($(this).children().children('.el-select-dropdown__item').hasClass('lazyOption'));
        var num = Math.ceil(_this.list1.length/10);//一共有多少组
        var scrollTop = $(this).offset().top - $(this).children().offset().top;//option距离父盒子的距离
        //console.log($(this).scrollTop(),scrollTop);
        _this.options4 = [];
        _this.list1.forEach((item,index)=>{
          if(index <= ((Math.floor((scrollTop-95)/340))+2)*10){
            _this.options4.push(item);
          }
        })
      })
    },
    methods: {
      changeChannel(){
        this.$emit('changeSelect',{
          value:this.value9,
          parentArr:this.parentArr,
          list:this.list
        });
      },
      initShow(){
        this.options4 = [];
        this.list1.forEach((item,i)=>{
          if(i<10){
            this.options4.push(item);
          }
        })
      },
      remoteMethod(query) {
        $(this.eleSelect).scrollTop(0);//滚动到最顶部
        this.list1 = this.originlist1;
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.list1 = this.list1.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
           this.initShow();
          }, 200);
        } else {
          this.list1 = this.originlist1;
          this.initShow();
        }
      }
    }
  };
</script>
<style scoped>
 #lazySelect .select{
   width:210px;
 }
</style>
