import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loading: false,
  },
  mutations: {
    setLoading(state, loading) {
      state.loading = loading;
    },
  },
  actions: {},
  getters: {}
});

// 订阅store变化
store.subscribe((mutation, state) => {
  switch (mutation.type) {
    case "setLoading":
      //console.log(state.loading);
      break;
  }
});

export default store;
