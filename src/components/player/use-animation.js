import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = ref(null)

  // cd从隐藏到显示的动画，
  // 当只用 JavaScript 过渡的时候，在 enter 和 leave 中必须使用 done 进行回调。否则，它们将被同步调用，过渡会立即完成
  const enter = (el,done) => {
    const { x, y, scale } = getPosAndScale()

    let animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    // 动画的一些配置
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'ease-out'
      }
    })
    // 运行动画
    animations.runAnimation(cdWrapperRef.value,'move',done)
  }

  const afterEnter = () => {
    //运行完动画之后，注销掉动画
    animations.unregisterAnimation('move')
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.animation = ''
  }

  // cd从显示到隐藏的动画
  const leave = (el,done) => {
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = 'all .6s'
    // 这里我们只要直接移动变小就可以了
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperEl.addEventListener('transitionend',() => {
      done()
    })
  }

  const afterLeave = () => {
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }

  const getPosAndScale = () => {
    // 左下角小图片的宽度
    const targetWidth = 40
    const paddingLeft = 40
    const paddingBottom = 30
    const paddingTop = 80
    // cd宽度
    const width = window.innerWidth * 0.8
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width/2 - paddingBottom
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}