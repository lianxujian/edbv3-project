<template>
  <div>
    <el-select v-model="value1" :disabled="disabled" placeholder="请选择" @change="channelChange1" style="width:120px;">
      <el-option
        v-for="item in options1"
        :key="item.regionId"
        :label="item.regionName"
        :value="item.regionId">
      </el-option>
    </el-select>
    <el-select v-model="value2" placeholder="请选择" :disabled="disabled" @change="channelChange2" style="width:120px;">
      <el-option
        v-for="item in options2"
        :key="item.regionId"
        :label="item.regionName"
        :value="item.regionId">
      </el-option>
    </el-select>
    <el-select v-model="value3" placeholder="请选择" :disabled="disabled" @change="channelChange3" v-if="options3.length > 0" style="width:120px;">
      <el-option
        v-for="item in options3"
        :key="item.regionId"
        :label="item.regionName"
        :value="item.regionId">
      </el-option>
    </el-select>
    <el-select v-model="value4" placeholder="请选择" :disabled="disabled" @change="channelChange4" v-if="options4.length > 0" style="width:120px;">
      <el-option
        v-for="item in options4"
        :key="item.regionId"
        :label="item.regionName"
        :value="item.regionId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    props:{
      proCityAreaValue:Array,
      proCityAreaLabel:Array,
      disabled:Boolean
    },
    data() {
      return {
        version:'1.0.0',
        value1:'',
        value2:'',
        value3:'',
        value4:'',
        options1:[],
        options2:[],
        options3:[],
        options4:[],
        areaObj:{},
      }
    },
    methods: {
      channelChange1(value,item){
        this._post("com.edb01.erp.mdata.service.api.DtRegionService/" + this.version + "/list",{regionId:value}).then((response) => {
          if (response.data.success) {
            this.options2 = response.data.result;
            this.options2.forEach(item => {
              this.areaObj[item.regionId] = item.regionName;
            })
            this.value2 = '';
            this.value3 = '';
            this.value4 = '';
            this.options3 = [];
            this.options4 = [];

            if(item == 'echo' && this.proCityAreaValue[1]){
              //回显
              this.value2 = this.proCityAreaValue[1];
              this.channelChange2(this.proCityAreaValue[1],'echo');
            }else{
              var proCityAreaValue = [this.value1],proCityAreaLabel = [this.areaObj[this.value1]],validatePass = '';
              if(this.options2.length > 0 ){
                validatePass = '请选择市'
              }else{
                validatePass = '';
              }
              this.$emit('channelArea',{proCityAreaValue, proCityAreaLabel, validatePass})
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      channelChange2(value,item){
        this._post("com.edb01.erp.mdata.service.api.DtRegionService/" + this.version + "/list",{regionId:value}).then((response) => {
          if (response.data.success) {
            this.options3 = response.data.result;
            this.options3.forEach(item => {
              this.areaObj[item.regionId] = item.regionName;
            })
            this.value3 = '';
            this.value4 = '';
            this.options4 = [];

            if(item == 'echo' && this.proCityAreaValue[2]){
              //回显

              //如果第三级下拉列表没有此value则将此value跟label push进去
              var isHas = false;
              this.options3.forEach(item => {
                if(item.regionId == this.proCityAreaValue[2]){
                  isHas = true;
                }
              })
              if(!isHas && this.proCityAreaLabel[2]){
                this.options3.push({
                  regionId:this.proCityAreaValue[2],
                  regionName:this.proCityAreaLabel[2]
                })
              }

              this.value3 = this.proCityAreaValue[2];
              this.channelChange3(this.proCityAreaValue[2],'echo');
            }else{
              var proCityAreaValue = [this.value1,this.value2],proCityAreaLabel = [this.areaObj[this.value1],this.areaObj[this.value2]],validatePass = '';
              if(this.options3.length > 0 ){
                validatePass = '请选择区'
              }else{
                validatePass = '';
              }
              this.$emit('channelArea',{proCityAreaValue, proCityAreaLabel, validatePass})
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      channelChange3(value,item){
        this._post("com.edb01.erp.mdata.service.api.DtRegionService/" + this.version + "/list",{regionId:value}).then((response) => {
          if (response.data.success) {
            this.options4 = response.data.result;
            this.options4.forEach(item => {
              this.areaObj[item.regionId] = item.regionName;
            })
            this.value4 = '';

            if(item == 'echo' && this.proCityAreaValue[3]){
              //回显
              this.value4 = this.proCityAreaValue[3];
              this.channelChange4(this.proCityAreaValue[3],'echo');
            }else{
              var proCityAreaValue = [this.value1,this.value2,this.value3],proCityAreaLabel = [this.areaObj[this.value1],this.areaObj[this.value2],this.areaObj[this.value3]],validatePass = '';
              if(this.options4.length > 0 ){
                validatePass = '请选择镇'
              }else{
                validatePass = '';
              }
              this.$emit('channelArea',{proCityAreaValue, proCityAreaLabel, validatePass})
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "warning"
            });
          }
        })
      },
      channelChange4(value,item){
        var proCityAreaValue = [this.value1,this.value2,this.value3,this.value4],proCityAreaLabel = [this.areaObj[this.value1],this.areaObj[this.value2],this.areaObj[this.value3],this.areaObj[this.value4]];
        this.$emit('channelArea',{proCityAreaValue, proCityAreaLabel, validatePass:''})
      },
    },
    mounted() {
      this._post("com.edb01.erp.mdata.service.api.DtRegionService/" + this.version + "/list",{regionId:1}).then((response) => {
        if (response.data.success) {
          this.options1 = response.data.result;
          this.options1.forEach(item => {
            this.areaObj[item.regionId] = item.regionName;
          })
          //回显
          //if(this.proCityAreaValue[0] == 'undefined')this.proCityAreaValue[0] = '';
          //if(this.proCityAreaValue[1] == 'undefined')this.proCityAreaValue[1] = '';
          //if(this.proCityAreaValue[2] == 'undefined')this.proCityAreaValue[2] = '';
          //if(this.proCityAreaValue[3] == 'undefined')this.proCityAreaValue[3] = '';
          for(var i=0;i<4;i++){
            if(this.proCityAreaValue[i] == 'undefined' || !this.proCityAreaValue[i])this.proCityAreaValue[i] = '';
            if(this.proCityAreaLabel[i] == 'undefined' || !this.proCityAreaLabel[i])this.proCityAreaLabel[i] = '';
          }
          //console.log(this.proCityAreaValue);
          //console.log(this.proCityAreaLabel);
          if(this.proCityAreaValue[0]){
            this.value1 = this.proCityAreaValue[0];
            this.channelChange1(this.proCityAreaValue[0],'echo');
          }else{
            this.$emit('channelArea',{proCityAreaValue:[], proCityAreaLabel:[], validatePass:'请选择省'})
            return false;
          }
        } else {
          this.$message({
            message: response.data.msg,
            type: "warning"
          });
        }
      })
    }
  }
</script>

<style scoped>

</style>
