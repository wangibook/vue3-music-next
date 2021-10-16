const mutations = {
  setFullScreen(state,fullScreen) {
    state.fullScreen = fullScreen
  },
  setPlaylist(state, list) {
    state.playlist = list
  },
  // 设置顺序播放
  setSequenceList(state,list) {
    state.sequenceList = list
  },
  // 当前播放
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  // 播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  setPlayingState(state, playing) {
    state.playing = playing
  },
  // 设置喜欢和取消喜欢歌曲
  setFavoriteList(state, list) {
    state.favoriteList = list
  },
  // addSongLyric(state,{newSong,lyric}) {
  //   state.sequenceList.map((item) => {
  //     if (item.mid === newSong.mid) {
  //       item.lyric = lyric
  //     }
  //     return item
  //   })
  // },
  setSearchHistory(state, searches) {
    state.searchHistory = searches
  },
  setPlayHistory(state, songs) {
    state.playHistory = songs
  }
}

export default mutations