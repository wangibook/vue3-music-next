import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "user" */ '../views/user')
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import(/* webpackChunkName: "recommend" */ '../views/recommend')
  },
  {
    path: '/singer',
    name: 'singer',
    component: () => import(/* webpackChunkName: "singer" */ '../views/singer'),
    children: [
      {
        path: ':id',
        name: 'singerDetail',
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
    component: () => import(/* webpackChunkName: "search" */ '../views/search')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
