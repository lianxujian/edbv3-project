<template>
  <div style="width:100%;padding:30px;height:100%;">
    <div style="margin-bottom:15px;">
        <el-button size="small" @click='returnHome'><< 返回上一级</el-button>
    </div>
    <div class="content-box">
        <div class="l-title"><span style="color: red;">公告:</span> {{dataObj.title}}</div>
        <div class="l-content" v-html='dataObj.content'>
        </div>
    </div>
    <div class="l-page">
      <el-button size="small" :disabled='prevBtn' @click="togglePage(1)"><< 上一条</el-button> &nbsp;&nbsp;
      <el-button size="small" :disabled='nextBtn' @click="togglePage(2)">下一条 >></el-button></div>
    <div style='clear:both;'></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      noticeId:this.$router.history.current.params.noticeId,
      listBtn:()=>{},           //上一条下一条
      noticeFn:()=>{},
      prevBtn:false,
      nextBtn:false,
      arrId:[],
      dataObj:{},
      idIndex:0
    }
  },watch:{
    noticeId(curVal,oldVal){
      if(curVal!=oldVal){
        window.location.reload();
      }
    }
  },methods:{
    togglePage(n){
      if(n==1){
        //上一条
        this.idIndex--;
      }else{
        //下一条
        this.idIndex++;
      }
      this.listBtn(this.arrId,this.arrId[this.idIndex]);
      this.noticeFn(this.arrId[this.idIndex]);
    },
    returnHome(){
      if(process.env.NODE_ENV=='development'){
        location.href='http://localhost:8080/#/noticeDetail'
      }else{
        MainTab.createTab('noticeDetail','公告列表',process.env.API_PAGE+'noticeDetail');
      }
    }
  },
  mounted(){
    var self = this;
    this.noticeFn=(noticeId)=>{
       self.$axios({
          method:'post',
          url:process.env.OLD_API + 'api/login_index/showcontent',
          data:{noticeId:noticeId},
          transformRequest:[function (data) {
            let newData = '';
            for(let k in data){
              newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
            return newData;
          }]
        })
          .then(function (response) {
            if(response.data.code==0){
              self.dataObj=response.data.result;
            }else{
              self.$message({
                message:response.data.message,
                type: 'warning'
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    this.noticeFn(self.noticeId);
    this.$axios({
      method:'post',
      url:process.env.OLD_API + 'api/login_index/getBetweenData'

    })
      .then(function (response) {
        if(response.data.code==0){
          self.arrId=response.data.result;
          self.arrId.forEach((item,i)=>{
            if(item==self.noticeId){
              self.idIndex=i;
            }
          })
          self.listBtn(self.arrId,self.noticeId)
        }else{
          self.$message({
            message:response.data.message,
            type: 'warning'
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    //判断上一条下一条是否显示
    this.listBtn=(ids,noticeId)=> {
        for (var i = 0; i < ids.length; i++) {
            if (ids[i] == noticeId) {
                if (i == 0 && i == ids.length - 1) {
                  self.prevBtn=true;
                  self.nextBtn=true;
                }else if (i == 0) {
                  self.prevBtn=true;
                  self.nextBtn=false;
                }else if (i == ids.length - 1) {
                  self.prevBtn=false;
                  self.nextBtn=true;
                }else{
                  self.prevBtn=false;
                  self.nextBtn=false;
                }
            }
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content-box{
      height: 82%;
      width: 100%;
  }
  .l-page{
      float:right;
      margin-top:60px;
  }
  .l-title{
      line-height:30px;
      font-size:16px;
      margin-bottom:10px;
      width: 100%;
  }
  .l-content{
    width:100%;
    height:100%;
    padding:20px;
    border: 1px solid #ccc;
    overflow-y: scroll;
  }
</style>
