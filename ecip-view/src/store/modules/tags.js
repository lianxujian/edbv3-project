/**
 * Created by chenyin on 2019-06-11.
 */
const tags = {
  state: {
    dynamicTags: ['index'],
    currentIndex: 0
  },
  mutations: {

    //首页
    INDEX: (state) => {
      state.currentIndex = 0
    },

    //品牌管理
    BRAND: (state,name) => {
      if(!state.dynamicTags.includes('brand')) {
        state.dynamicTags.push('brand');
      }
      let i = state.dynamicTags.indexOf('brand');
      state.currentIndex = i
      console.log(state.dynamicTags);
    },

    //分类管理
    CLASSIFY: (state) => {
      if(!state.dynamicTags.includes('classify')) {
        state.dynamicTags.push('classify');
      }
      let i = state.dynamicTags.indexOf('classify');
      state.currentIndex = i
      console.log(state.dynamicTags);
    },

    //商品维护
    SINGLEGOODS: (state) => {
      if(!state.dynamicTags.includes('singleGoods')) {
        state.dynamicTags.push('singleGoods');
      }
      let i = state.dynamicTags.indexOf('singleGoods');
      state.currentIndex = i
    },

    //商品查询
    SINGLESKU: (state) => {
      if(!state.dynamicTags.includes('singleSku')) {
        state.dynamicTags.push('singleSku');
      }
      let i = state.dynamicTags.indexOf('singleSku');
      state.currentIndex = i
    },

    //套装维护
    SUIT: (state) => {
      if(!state.dynamicTags.includes('suit')) {
        state.dynamicTags.push('suit');
      }
      let i = state.dynamicTags.indexOf('suit');
      state.currentIndex = i
    },

    //套装查询
    SUITSKU: (state) => {
      if(!state.dynamicTags.includes('suitSku')) {
        state.dynamicTags.push('suitSku');
      }
      let i = state.dynamicTags.indexOf('suitSku');
      state.currentIndex = i
    },

    //平台商品查询
    INTERNETGOODS: (state) => {
      if(!state.dynamicTags.includes('internetGoods')) {
        state.dynamicTags.push('internetGoods');
      }
      let i = state.dynamicTags.indexOf('internetGoods');
      state.currentIndex = i
    },

    //前后端商品绑定
    GOODSBIND: (state) => {
      if(!state.dynamicTags.includes('goodsBind')) {
        state.dynamicTags.push('goodsBind');
      }
      let i = state.dynamicTags.indexOf('goodsBind');
      state.currentIndex = i
    },

    //WMS货品管理
    GOODSUPERVISE: (state) => {
      if(!state.dynamicTags.includes('goodSupervise')) {
        state.dynamicTags.push('goodSupervise');
      }
      let i = state.dynamicTags.indexOf('goodSupervise');
      state.currentIndex = i
    },

    //tag关闭
    TAGCLOSE: (state) => {
      state.currentIndex = state.currentIndex - 1;
    }
  },
  actions: {

    //首页
    index: ({commit}) => {
      commit('INDEX')
    },

    //品牌管理
    brand: ({commit},name) => {
      commit('BRAND',name);
    },

    //分类管理
    classify: ({commit}) => {
      commit('CLASSIFY')
    },

    //商品维护
    singleGoods: ({commit}) => {
      commit('SINGLEGOODS')
    },

    //商品查询
    singleSku: ({commit}) => {
      commit('SINGLESKU')
    },

    //套装维护
    suit: ({commit}) => {
      commit('SUIT')
    },

    //套装查询
    suitSku: ({commit}) => {
      commit('SUITSKU')
    },

    //平台商品查询
    internetGoods: ({commit}) => {
      commit('INTERNETGOODS')
    },

    //前后端商品绑定
    goodsBind: ({commit}) => {
      commit('GOODSBIND')
    },

    //WMS货品管理
    goodSupervise: ({commit}) => {
      commit('GOODSUPERVISE')
    },

    //tag关闭
    tagClose: ({commit}) => {
      commit('TAGCLOSE')
    }
  }
};

export default tags
