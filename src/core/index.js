import Vue from 'vue'
import './cube-ui'
import './vant'
import { setRem } from '@/utils'
import api from '@/api'
import config from '@/config'

// Vue.prototype
Vue.prototype.$_config = config
Vue.prototype.$_api = api

// permission
import '@/permission'

// Set Rem
setRem()

// Base Title
if (document) document.title = config.projectTitle

