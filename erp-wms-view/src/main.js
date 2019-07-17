// 入口文件
// 配置文件url：build/webpack.base.conf
import "babel-polyfill";//兼容ie
import Vue from 'vue'
import App from './App'
import router from './router'//引入路由

//全局组件多选下拉
import MultipleSelect from '@/components/common/MultipleSelect.vue';
Vue.component('MultipleSelect',MultipleSelect);

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/ag-theme-balham.css";

//分组（企业）
import 'ag-grid-enterprise';

//假数据请求
import axios from 'axios';
Vue.prototype.$http = axios;
//import echarts from 'echarts';

//axios封装
import '@/assets/js/http'

//dialog拖拽
import '@/assets/js/directives.js'

// 全局过滤器
import * as filters from './filters'
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

//无更新禁止加载
Vue.config.productionTip = false ;

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
