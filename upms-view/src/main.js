// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/*import axios from 'axios'
import $ from 'jquery'*/
 import "babel-polyfill" //兼容ie


//axios封装
import '@/assets/js/http'

//dialog拖拽
import '@/assets/js/directives.js'

//无更新禁止加载
Vue.config.productionTip = false;
// Vue.prototype.$axios = axios
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
