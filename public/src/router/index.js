import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home')
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "editor" */ '../views/editor')
  },
  {
    path: '/editor/add',
    name: 'Editor Add',
    component: () => import(/* webpackChunkName: "add" */ '../views/editor/add')
  },
  {
    path: '/editor/edit/:id',
    name: 'Editor Edit',
    component: () => import(/* webpackChunkName: "edit" */ '../views/editor/edit')
  },
  {
    path: '/translator',
    name: 'Translator',
    component: () => import(/* webpackChunkName: "edit" */ '../components/translator')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
