/**
 * Created by chenyi on 2019-05-30.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import tags from './modules/tags'
import getters from './getters'
Vue.use(Vuex);

const stores = new Vuex.Store({
  modules: {
    tags
  },
  getters
});

export default stores
