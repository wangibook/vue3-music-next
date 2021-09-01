const mutations = {
  setFullScreen(state,fullScreen) {
    state.fullScreen = fullScreen
  },
  setPlaylist(state, list) {
    state.playlist = list
  },
  // 设置顺序播放
  // setSequenceList(state,list) {
  //   state.sequenceList = list
  // },
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
}

export default mutations