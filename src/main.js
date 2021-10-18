import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { FAVORITE_KEY,PLAY_KEY } from '@/assets/js/constant'
import { processSongs } from '@/api/song'

import Vant from 'vant';
import 'vant/lib/index.css';
import { Lazyload } from 'vant';
// 自定义loading指令
import loadingDirective from '@/components/loading/loading'

// 引入全局样式文件
import '@/assets/scss/index.scss'

// 针对歌曲url失效
let favoriteList = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
if(favoriteList.length > 0) {
  processSongs(favoriteList).then(songs => {
    store.commit('setFavoriteList',songs)
    localStorage.setItem('FAVORITE_KEY',songs)
  })
}

let playHistory = JSON.parse(localStorage.getItem(PLAY_KEY)) || []
if(playHistory.length > 0) {
  processSongs(playHistory).then(songs => {
    store.commit('setPlayHistory',songs)
    localStorage.setItem('PLAY_KEY',songs)
  })
}

createApp(App)
.use(store)
.use(router)
.use(Vant)
.use(Lazyload,{
  loading: require('@/assets/images/default.png')
})
.directive('loading',loadingDirective)
.mount('#app')
