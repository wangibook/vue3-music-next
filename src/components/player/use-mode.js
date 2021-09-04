import { computed } from 'vue'
import { useStore } from 'vuex'
import { PLAY_MODE } from '@/store/mutations-type'

export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    if(playModeVal === PLAY_MODE.sequence) {
      return 'icon-sequence'
    } else if(playModeVal === PLAY_MODE.random) {
      return 'icon-random'
    } else {
      return 'icon-loop'
    }
  })

  const changeMode = () => {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
    console.log(mode)
  }

  return {
    modeIcon,
    changeMode
  }
}