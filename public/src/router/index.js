import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

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
    meta: {
      requireEditorCredentials: true,
    },
    component: () => import(/* webpackChunkName: "editor" */ '../views/editor')
  },
  {
    path: '/editor/add',
    name: 'Editor Add',
    meta: {
      requireEditorCredentials: true,
    },
    component: () => import(/* webpackChunkName: "add" */ '../views/editor/add')
  },
  {
    path: '/editor/edit/:id',
    name: 'Editor Edit',
    meta: {
      requireEditorCredentials: true,
    },
    component: () => import(/* webpackChunkName: "edit" */ '../views/editor/edit')
  },
  {
    path: '/translator',
    name: 'Translator',
    component: () => import(/* webpackChunkName: "translator" */ '../components/applications/translator')
  },
  {
    path: '/weather',
    name: 'Weather',
    component: () => import(/* webpackChunkName: "weather" */ '../components/applications/weather')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requireEditorCredentials) {


    if (to.query.unauthenticated !== 'true') {
      next()
      return
    }

    const isLoggedIntoEditor = store.getters.getIsLoggedIntoEditor
    if (isLoggedIntoEditor) next()
    else {
      // check cookie for correct password
      const res = await store.dispatch('checkAuthentication')
      if (res.ok) next() // Correct password so continue
      else next('/editor?unauthenticated=true') // Incorrect password so continue to prompt screen
    }
  } else {
    next()
  }
})

export default router
