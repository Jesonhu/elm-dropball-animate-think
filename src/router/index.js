import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    meta: { title: '购物车小球动画' },
    component: () => import('@/views/home')
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '*',
    name: 'E404',
    component: () => import('@/views/exception/404')
  }
]

const router = new VueRouter({
  routes
})

export default router
