import { PLAY_MODE } from './mutations-type'

const state = {
  fullScreen: false,
  playlist: [],  // 播放列表
  // sequenceList: [],   // 顺序播放列表
  currentIndex: 0,
  playMode: PLAY_MODE.sequence,
  playing: false,  // 播放状态, 默认不播放
}

export default state