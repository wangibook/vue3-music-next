import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const maxLen = 100
  const store = useStore()

  // 保存搜索
  function saveSearch(query) {
    let searches = save(query, SEARCH_KEY, maxLen)
    store.commit('setSearchHistory', searches)
  }
  // 单个删除搜索记录
  function deleteSearch(query) {
    let searches = remove(query, SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }
  // 清空所有记录
  function clearSearch() {
    let searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  function save(query, key, maxLen) {
    // 从缓存中读取现有数据
    let items = JSON.parse(localStorage.getItem(key)) || []
    let index = items.findIndex(item => {
      return item === query
    })
    if(index > -1) {
      items.splice(index, 1)
    }
    items.unshift(query)
    if(maxLen && items.length > maxLen) {
      items.pop()
    }
    
    localStorage.setItem(key,JSON.stringify(items))
    return items
  }
  
  function remove(query,key) {
    let items = JSON.parse(localStorage.getItem(key)) || []
    let index = items.findIndex(item => {
      return item === query
    })
    if (index > -1) {
      items.splice(index, 1)
    }

    localStorage.setItem(key,JSON.stringify(items))
    return items
  }


  function clear(key) {
    localStorage.removeItem(key)
    return []
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}