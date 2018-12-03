import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    token: '',
    author: 'Wise Wrong'
  },
  // 修改方法
  mutations: {
    setToken (state, msg) {
      state.token = msg
    },
    newAuthor (state, msg) {
      state.author = msg
    }
  }
})

// 用于页面加载loading
store.registerModule('vux', { // 名字自己定义
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
})

export default store
