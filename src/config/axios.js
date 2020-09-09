const axios = {
  baseURL:  '',
  // 自定义的请求头
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    },
    post: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  },
  timeout: 60000
}

export default axios