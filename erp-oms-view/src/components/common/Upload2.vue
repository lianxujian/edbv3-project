<template>
  <div class="container">
    <p>1、上传文件</p>
    <br>
    <el-upload
      class="upload-demo"
      ref="upload"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

    <br>
    <p>2、上传图片</p>
    <br>

    <el-upload
      ref="upload2"
      action="http://file.edbv3.com/files-web/upload"
      list-type="picture-card"
      :file-list="imgList"
      :before-upload="beforeAvatarUpload"
      multiple
      :http-request="httpRequest"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        file:'',
        imgList:[],
        fileList: [{name: 'food.jpeg', url: ''}, {name: 'food2.jpeg', url: ''}]
      };
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },

      /*上传图片*/
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeAvatarUpload(file) {
        this.file = file;
        this.$refs.upload2.clearFiles()
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
            response.data.url = response.data.resourceUrl;
            this.imgList.push(response.data)
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
