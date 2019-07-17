// 入口文件
// 配置文件url：build/webpack.base.conf
import "babel-polyfill";//兼容ie
import Vue from 'vue'
import App from './App'
import router from './router'//引入路由
import i18n from './assets/js/lang' // 国际化
import store from './store/index'; //引入store
import api from '@/assets/js/api'; //引入store

import VueQuillEditor from  'vue-quill-editor'
Vue.use(VueQuillEditor)

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

//ag-Grid
import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/ag-theme-balham.css";

//分组（企业）
import 'ag-grid-enterprise';

//axios封装
import '@/assets/js/http';
Vue.prototype.api = api;

// 全局过滤器
import * as filters from './filters'
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

//无更新禁止加载
Vue.config.productionTip = false ;

new Vue({
  el: '#app',
  i18n,
  router,
  store, //挂载store
  template: '<App/>',
  components: { App }
});
