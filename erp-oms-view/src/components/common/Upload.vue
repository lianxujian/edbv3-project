<template>
  <div class="container">
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      :before-upload="beforeAvatarUpload"
      :show-file-list="false"
      :http-request="httpRequest"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        file:''
      };
    },
    methods: {
      beforeAvatarUpload(file) {
        this.file = file;
      },
      httpRequest(){
        let formData = new FormData();
        formData.append('filedata', this.file)
        this.$axios({
          method: 'post',
          url: 'http://file.edbv3.com/files-web/upload',
          data: formData
        }).then((response)=>{
          if(response.data.resourcesId){
            console.log(response);
          }else{
            this.$message({
              message: response.data.msg,
              type: 'warning'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  }
</script>
