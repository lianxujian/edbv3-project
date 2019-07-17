import Vue from 'vue'
import axios from 'axios';

//axios.defaults.timeout = 5000;
axios.defaults.baseURL = process.env.API_HOST + '';

// http request 拦截器
axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  });

Vue.prototype.$axios=axios;
Vue.prototype._post=function(url,param){
  var params= param?param:{};
  params.clToken=sessionStorage.getItem('clToken')?sessionStorage.getItem('clToken'):localStorage.getItem('clToken');/* params.tenantId=0;*/
  params.merchantId=0;
  return new Promise((resolve,reject) => {
    axios({
      method: 'post',
      url,
      data:params,
      transformRequest: [(data) => {
        let newData = '';
        for(let k in data) {
          newData += encodeURIComponent(k) + '=' + encodeURIComponent(encodeURIComponent(data[k])) + '&';
        }
        return newData;
      }]
    }).then(res => {
      if(res.data.code == 91000003 || res.data.code == 50004){
        localStorage.setItem('message',res.data.msg);
        //console.log('我要跳转到登录页！');
        window.parent.location.href = `http://${process.env.FILE_API}`;
        return false;
      }
      resolve(res);
    }).catch(function(error) {
      //reject(error)
      console.log(error);
    });
  })
}
Vue.prototype._get=function(url){
  return new Promise((resolve,reject) => {
    axios({
      method: 'get',
      url:url
    }).then(res => {
      resolve(res)
    }).catch(function(error) {
      reject(error);
      console.log(error);
    });
  })
}
