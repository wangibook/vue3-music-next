import { PLAY_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function usePlayHistory() {
  const maxLen = 100
  const store = useStore()

  function savePlay(song) {
    let songs = save(song, PLAY_KEY, maxLen)
    store.commit('setPlayHistory', songs)
  }


  function save(song, key, maxLen) {
    // 从缓存中读取现有数据
    let items = JSON.parse(localStorage.getItem(key)) || []
    let index = items.findIndex(item => {
      return item.id === song.id
    })
    if(index > -1) {
      items.splice(index, 1)
    }
    items.unshift(song)
    if(maxLen && items.length > maxLen) {
      items.pop()
    }
    
    localStorage.setItem(key,JSON.stringify(items))
    return items
  }

  return {
    savePlay
  }
}