import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'


export default function useCd() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing,(newPlaying) => {
    // 如果是暂停，同步旋转角度
    if(!newPlaying) {
      // syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  const syncTransform = (wrapper, inner) => {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    // 如果外层有旋转角度，再同步时，旋转角度就是 外层和内层角度叠加
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}