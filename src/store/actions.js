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

export function removeSong({commit,state}, song) {
  //数组 slice 后相当于开辟了一片新的内存空间存储，修改它的值肯定不会影响之前数组的值
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  let sequenceIndex = findIndex(sequenceList,song)
  let playIndex = findIndex(playlist,song)
  // 如果列表中没有找到这首歌，直接return
  if(sequenceIndex < 0 || playIndex < 0) {
    return
  }

  sequenceList.splice(sequenceIndex,1)
  playlist.splice(playIndex,1)

  // 删除之后，做逻辑判断
  let currentIndex = state.currentIndex
  // 如果删除当前播放的之前的歌曲，下标往前移一个，
  if( playIndex < currentIndex || currentIndex === playlist.length ) {
    currentIndex--
  }

  commit('setSequenceList',sequenceList)
  commit('setPlaylist',playlist)
  commit('setCurrentIndex',currentIndex)
}

function findIndex(list,song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export function clearSongList({commit}) {
  commit('setSequenceList',[])
  commit('setPlaylist',[])
  commit('setCurrentIndex',0)
  // 清空后把播放状态也重置
  commit('setPlayingState', false)
}

export function addSong({commit,state}, song) {
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  let sequenceIndex = findIndex(sequenceList,song)
  let playIndex = findIndex(playlist,song)
  let currentIndex = state.currentIndex
  if(playIndex > -1) {
    currentIndex = playIndex
  } else {
    playlist.push(song)
    currentIndex = playlist.length - 1
  }

  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }
  commit('setSequenceList',sequenceList)
  commit('setPlaylist',playlist)
  commit('setCurrentIndex',currentIndex)
  commit('setFullScreen', true)
  commit('setPlayingState', true)
}