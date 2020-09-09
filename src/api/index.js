import Vue from 'vue'
import request from '@/utils/request'

const apiUrl = {
  login: '/login',
  getUserInfo: '/user_info',
  getTestList: '/test/list'
}

const api = {
  getUserInfo(params = {}) {
    return request.get(apiUrl.getUserInfo, params)
  },

  getTestList(params = {}) {
    return request.get(apiUrl.getTestList, params)
  }
}

Vue.prototype.$http = api

export default api
