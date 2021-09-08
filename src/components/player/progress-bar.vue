<template>
  <div class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <div 
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      offset: 0
    }
  },
  computed: {
    progressStyle() {
      return `width:${this.offset}px`
    },
    btnStyle() {
      return `transform: translate3d(${this.offset}px,0,0)`
    } 
  },
  watch: {
    // 监听滚动条
    progress(newProgress) {
      this.setOffset(newProgress)
    }
  },
  mounted() {
    // 不需要观测变化，但是上下文中又希望用到，就可以这样定义
    this.touch = {}
  },
  methods: {
    setOffset(progress) {
      // 进度条宽度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      this.offset = barWidth * progress
    },
    onTouchStart(e) {
      // 开始的横坐标值
      this.touch.x1 = e.touches[0].pageX
      // 进度条开始的宽度
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    onTouchMove(e) {
      // 偏移的横向位移
      const delta = e.touches[0].pageX - this.touch.x1
      // 拖动后的宽度
      const tempWidth = this.touch.beginWidth + delta
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // progress在0~1之间
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      this.offset = barWidth * progress
      this.$emit('progress-changing', progress)
    },
    onTouchEnd() {
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = this.$refs.progress.clientWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    onClick(e) {
      const rect = this.$el.getBoundingClientRect()
      // rect.left ---- > 元素距视窗左侧的距离
      // 拖动后的宽度 = 点击的位置-元素距视窗左侧的距离
      const tempWidth = e.pageX - rect.left
      const barWidth = this.$el.clientWidth - progressBtnWidth
      const progress = tempWidth / barWidth
      this.$emit('progress-changed', progress)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar{
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>

