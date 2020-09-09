import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    user
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
})
