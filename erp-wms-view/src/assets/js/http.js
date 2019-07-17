import Vue from 'vue'
import axios from 'axios';

//axios.defaults.timeout = 5000;
axios.defaults.baseURL = process.env.BASE_API + '';

Vue.prototype.$axios=axios;
Vue.prototype._post=function(url,param){
  let params=param?param:{};
   //params.tenantId=0;
    params.merchantId=0;
  const token = sessionStorage.getItem('clToken') ? sessionStorage.getItem('clToken') : localStorage.getItem('clToken');
  if(token)params.clToken=token;
  return new Promise((resolve,reject) => {
    axios({
      method: 'post',
      url,
      data: params,
      transformRequest: [(data) => {
        let newData = '';
        for(let k in data) {
          newData += encodeURIComponent(k) + '=' + encodeURIComponent(encodeURIComponent(data[k])) + '&';
        }
        return newData;
      }]
    }).then(res => {
      if(res.data.code == 91000003 || res.data.code == 50004){
        parent.location.href = `http://${process.env.FILE_API}`;
        //console.log('我要跳转到登录页！');
        return false;
      }

      resolve(res)
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
      url
    }).then(res => {
      resolve(res)
    }).catch(function(error) {
      //reject(error)
      console.log(error);
    });
  })
};

