import { PLAY_MODE } from './mutations-type'
import { FAVORITE_KEY,SEARCH_KEY,PLAY_KEY } from '@/assets/js/constant'

const state = {
  fullScreen: false,
  playlist: [],  // 播放列表
  sequenceList: [],   // 顺序播放列表
  currentIndex: 0,
  playMode: PLAY_MODE.sequence,
  playing: false,  // 播放状态, 默认不播放
  favoriteList: [],  // 收藏歌曲列表
  searchHistory: JSON.parse(localStorage.getItem(SEARCH_KEY)) || [],
  playHistory: [],
}

export default state