import Vue from 'vue'
import axios from 'axios';

//axios.defaults.timeout = 30000;
//axios.defaults.baseURL = process.env.BASE_API + '';

// http response 请求拦截器，有token值则配置上token值
axios.interceptors.response.use(
  response => {
    if(response.data.code==101001){
      window.parent.location.href='http://www.edb01.com';
    }else{
      return response;
    }
  },
  error => {
    return response;
  });

Vue.prototype.$axios=axios;
Vue.prototype._post=function(url,param){
  let params=param?param:{};
  params.merchantId=0;
  const token=localStorage.getItem('clToken');
  //if(token)params.clToken=token;
  params.clToken='default-token';
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
      if(res.data.code == 101001){
        //window.parent.location.href='http://dev.edb01.com';
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
}

