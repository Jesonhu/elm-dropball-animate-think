import { isUndefined } from '@/utils'
import API from '@/api'
import config from '@/config'

const { getUserInfo } = API
const httpCode = config.httpCode

const user = {
  state: {
    info: {}
  },

  mutations: {
    SET_INFO: (state, info) => {
      if (!isUndefined(info)) state.info = info
    }
  },

  aciotns: {
    // 获取用户信息
    GetInfo({ commit }) {
      // Tips: 
      // 虽然 getUserInfo 执行后就返回一个 Promise, 但是为了控制全局流程需要 return Promsie
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const resData = res
          const { code, data } = resData
          console.log('res', resData)
          if (httpCode.SUCCESS === code) {
            commit('SET_INFO', data)
          } else {
            reject(resData)
          }
        }).catch(err => {
          reject(err)
        })
      })
      
    }
  }
}

export default user