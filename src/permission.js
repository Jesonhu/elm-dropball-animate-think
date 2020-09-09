/**
 * 全局路由前置/后置导航守卫配置.
 * 
 * @file src/permission
 */
import router from './router';
import config from './config';
import { setDocumentTitle } from './utils';

// 页面白名单
// 当跳转到白名单中的页面(匹配地址)不进行检测
const whiteList = ['get-tickets', 'register']
const defaultRoutePath = '/get-tickets'

router.beforeEach((to, from, next) => {
  to.meta && (typeof to.meta.title !== 'undefined') && setDocumentTitle(`${to.meta.title} - ${config.projectTitle}`);
  next()
})