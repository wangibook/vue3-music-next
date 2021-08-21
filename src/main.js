import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vant from 'vant';
import 'vant/lib/index.css';
import { Lazyload } from 'vant';
// 自定义loading指令
import loadingDirective from '@/components/loading/loading'

// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App)
.use(store)
.use(router)
.use(Vant)
.use(Lazyload,{
  loading: require('@/assets/images/default.png')
})
.directive('loading',loadingDirective)
.mount('#app')
