import { PLAY_MODE } from './mutations-type'
 
export function selectPlay({ commit }, { list, index }) {
  commit('setPlaylist', list)
  // commit('setSequenceList', list)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setPlayingState', true)
}