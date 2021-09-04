import { PLAY_MODE } from './mutations-type'
import { shuffle } from '@/assets/js/util'
 
export function selectPlay({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setPlaylist', list)
  commit('setSequenceList', list)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
  commit('setPlayingState', true)
}

export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setPlaylist', shuffle(list))
  commit('setSequenceList', list)
  commit('setCurrentIndex', 0)
  commit('setFullScreen', true)
  commit('setPlayingState', true)
}

export function changeMode({commit,state,getters},mode) {
  const currentId = getters.currentSong.id

  if(mode === PLAY_MODE.random) {
    // 把歌曲打乱顺序
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex((song) => {
    return song.id === currentId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}