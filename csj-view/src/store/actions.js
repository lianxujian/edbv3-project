const actions={
  //test
  setFirstname({commit},data){
    commit('SET_FIRSTNAME',data)
  },
  //类目列表
  setCatalogList({commit},data){
    commit('SET_CATALOGLIST',data)
  },
}

export default actions
