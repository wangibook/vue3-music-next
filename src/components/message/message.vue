<template>
  <teleport to="body">
    <transition name="slide-down">
      <div class="message" v-show="visible" @click="hide">
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      visible: false,
      timer: null
    }
  },
  methods: {
    // 先关闭再创建，防止创建多个定时器
    show() {
      this.visible = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      },this.delay)
    },
    hide() {
      clearTimeout(this.timer)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.message{
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
  background: $color-dialog-background;
}
</style>