// 入口文件
// 配置文件url：build/webpack.base.conf
import "babel-polyfill";//兼容ie
import Vue from 'vue'
import App from './App'
import router from './router'//引入路由
import i18n from './assets/js/lang' // 国际化
import store from './store'

//全局组件多选下拉
import MultipleSelect from '@/components/common/MultipleSelect.vue';
Vue.component('MultipleSelect',MultipleSelect)

Vue.prototype.$Num = (val)=>{
  return val.replace(/[^\d]/g,'');
}

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

/*let v = new Vue();
v.$message({
  message: 'test',
  type: 'warning'
});*/
//ag-Grid
import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/ag-theme-balham.css";

//分组（企业）
import 'ag-grid-enterprise';

//axios封装
import '@/assets/js/http'

//挂载全局方法
import * as technology from '@/assets/js/validate'
Vue.prototype.$Technology = technology;

//全局loading
Vue.prototype.$loading = false;

//dialog拖拽
import '@/assets/js/directives.js'

// 全局过滤器
import * as filters from './filters'
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));
//无更新禁止加载
Vue.config.productionTip = false ;

new Vue({
  el: '#app',
  i18n,
  store,
  router,
  template: '<App/>',
  components: { App }
});
