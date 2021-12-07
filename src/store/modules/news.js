export default {
  namespaced: true,
  state:() => ({
    newsDetail:``
  }),
  mutations: {
    setNewsDetail(store,payload){
      store.newsDetail = payload.newsDetail
    },

  }

}