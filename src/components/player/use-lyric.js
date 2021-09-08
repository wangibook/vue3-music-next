import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/api/song'
import Lyric from 'lyric-parser'

export default function useLyric({songReady,currentTime}) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong,async (newSong) => {
    const lyric = await getLyric(newSong)
    currentLyric.value = new Lyric(lyric, handleLyric)

    if(songReady.value) {
      playLyric()
    }
  })

  // 播放歌词
  const playLyric = () => {
    const currentLyricVal = currentLyric.value
    if(currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // 暂停歌词
  const stopLyric = () => {
    const currentLyricVal = currentLyric.value
    if(currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  const handleLyric = ({ lineNum, txt }) =>{
    console.log(lineNum)
    currentLineNum.value = lineNum
  }

  return {
    currentLyric,
    currentLineNum,
    playLyric,
    stopLyric
  }
}