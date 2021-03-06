import { useStore } from 'vuex'
import { computed } from 'vue'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  const getFavoriteIcon = (song) => {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  const toggleFavorite = (song) => {
    let list = []
    if(isFavorite(song)) {
      // 移除
      list = remove(song,FAVORITE_KEY)
    } else {
      // 加入
      list = save(song, FAVORITE_KEY, maxLen)
    }
    store.commit('setFavoriteList', list)
  }

  const isFavorite = (song) => {
    return favoriteList.value.findIndex(item => {
      return item.id === song.id
    }) > -1
  }

  const save = (song, key, maxLen) => {
    // 从缓存中读取现有数据
    let items = JSON.parse(localStorage.getItem(key)) || []
    items.unshift(song)
    if(maxLen && items.length > maxLen) {
      items.pop()
    }
    
    localStorage.setItem(key,JSON.stringify(items))
    return items
  }

  const remove = (song,key) => {
    let items = JSON.parse(localStorage.getItem(key)) || []
    let index = items.findIndex(item => {
      return item.id === song.id
    })
    if (index > -1) {
      items.splice(index, 1)
    }

    localStorage.setItem(key,JSON.stringify(items))
    return items
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}