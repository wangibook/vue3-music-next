import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/api/song'
import Lyric from 'lyric-parser'

export default function useLyric({songReady,currentTime}) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong,async (newSong) => {
    if (!newSong.url || !newSong.id) return
    // 切换歌曲时，把歌词列表重置，播放行数重置，解决来回跳的问题
    stopLyric()
    currentLineNum.value = 0
    currentLyric.value = null
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)

    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if(hasLyric) {
      if(songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
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
    currentLineNum.value = lineNum
    // 正在播放的歌词
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if(!listEl) return

    if(lineNum > 5) {
      // 滚动到中间位置
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    pureMusicLyric,
    playingLyric,
    playLyric,
    stopLyric
  }
}