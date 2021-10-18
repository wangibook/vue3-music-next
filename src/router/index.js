import { createRouter, createWebHashHistory } from 'vue-router'

const User = () => import(/* webpackChunkName: "user" */ '../views/user')

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/user',
    name: 'user',
    components: {
      user: User
    }
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import(/* webpackChunkName: "recommend" */ '../views/recommend'),
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "recommendDetail" */ '../views/recommend/recommendDetail')
      }
    ]
  },
  {
    path: '/singer',
    name: 'singer',
    component: () => import(/* webpackChunkName: "singer" */ '../views/singer'),
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "singerDetail" */ '../views/singer/singerDetail')
      }
    ]
  },
  {
    path: '/topList',
    name: 'topList',
    component: () => import(/* webpackChunkName: "topList" */ '../views/topList'),
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "topDetail" */ '../views/topList/topDetail')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */ '../views/search'),
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "singerDetail" */ '../views/singer/singerDetail')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
