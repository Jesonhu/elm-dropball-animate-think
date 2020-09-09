//============================================
// axios 请求方式封装(Get Post).
//
// @update 2019/01/16
// @Jesonhu(github)
// @email jesonhu_web@163.com
//============================================

import axios from 'axios';
import CONFIG from '../config';
import qs from 'qs';

const config = CONFIG.axios;
const service = axios.create(config);

// request interceptor
service.interceptors.request.use(
  config => {
    // Tips: Post Params Type Is Form Data
    if (config.method === 'post') config.data = qs.stringify(config.data);
    return config;
  },
  error => Promise.reject(error)
);

// response interceptor
service.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

const request = {

  post(url, data) {
    return service({
      method: 'post',
      data: data,
      url
    });
  },

  get(url, data = {}) {
    return service({
      method: 'get',
      params: data,
      url
    })
  },
}


export default request