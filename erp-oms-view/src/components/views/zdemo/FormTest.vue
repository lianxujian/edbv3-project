<template>
  <div>
    <!--<k-form :model="model" :rules="rules" ref="kkbLoginForm">
      <k-form-item label="用户名" prop="username">
        <k-input v-model="model.username"></k-input>
      </k-form-item>
      <k-form-item label="密码" prop="password">
        <k-input type="password" v-model="model.password"></k-input>
      </k-form-item>
    </k-form>-->
    <Upload></Upload>
  </div>
</template>
<script>
  import Upload from '@/components/common/Upload2.vue';
  import KInput from '@/components/common/KInput.vue';
  import KFormItem from '@/components/common/KFormItem.vue';
  import KForm from '@/components/common/KForm.vue';
  export default {
    components:{
      KInput,
      KFormItem,
      KForm,
      Upload
    },
    data() {
      return {
        model:{
          username:'樊虎',
          password:'fanhu123'
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {

    },
    mounted(){

    }
  }
</script>








