import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/slide'
import { ref, onMounted, onUnmounted,onActivated,onDeactivated } from 'vue'

// 注册插件
BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData) {
  const scroll = ref(null)
  const rootRef = ref(null)
  const isPullUpLoad = ref(false)  // 控制拉取状态

  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,  // 上拉加载
      observeDOM: true, // dom变化
      click: true
    })

    scrollVal.on('pullingUp',pullingUpHandler)

    async function pullingUpHandler() {
      isPullUpLoad.value = true
      await requestData()
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}