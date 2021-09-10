import { ref } from 'vue'

export default function useMiddleInteractive() {
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {}
  let currentView = 'cd'

  const onMiddleTouchStart = (e) => {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }

  const onMiddleTouchMove = (e) => {
    // 手指拖动的位移
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY
    
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    // 设置滑动锁
    if(!touch.directionLocked) {
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    if(touch.directionLocked === 'v') return

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // -屏幕宽度和0之间
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if(currentView === 'cd') {
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }
    middleLStyle.value = {
      opacity: 1 - touch.percent
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
    }
  }

  const onMiddleTouchEnd = () => {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    middleLStyle.value = {
      opacity,
      transitionDuration: '0.3s'
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: '0.3s'
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}