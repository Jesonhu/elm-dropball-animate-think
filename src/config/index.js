import httpCode from './http-code'
import axios from './axios'
import toast from './toast-duration'

let useApiBaseUrl = ''
let useAssetsBaseUrl = ''

const developBaseUrl = {
  api: 'http://192.168.1.15:8081/api',
  assets: ''
}

const productionBaseUrl = {
  api: '',
  assets: ''
}

if (process.env.NODE_ENV === 'production') {
  useApiBaseUrl = productionBaseUrl.api
  useAssetsBaseUrl = productionBaseUrl.assets
} else {
  useApiBaseUrl = developBaseUrl.api
  useAssetsBaseUrl = productionBaseUrl.assets
}

console.log('===== apiBaseUrl: %o', useApiBaseUrl)
console.log('===== assetsBaseUrl: %o', useAssetsBaseUrl)

axios.baseURL = useApiBaseUrl

const config = {
  projectTitle: '案例模板',
  axios,
  toast,
  httpCode
}

export default config

