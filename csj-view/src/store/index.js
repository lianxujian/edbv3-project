import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
 // * 表示将 './actions'模块中的所有接口挂载到actions对象上  as 表示别名的意思
import mutations from './mutations';
//import * as getters from './getters';
import state from './state';
Vue.use(Vuex)
const store = new Vuex.Store({
  state,
  actions,
  mutations
})
export default store;
