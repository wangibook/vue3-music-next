<template>
  <ul class="index-list" ref="groupRef">
    <li class="group" v-for="(group,index) in data" :key="index">
      <h2 class="title">{{group.title}}</h2>
      <ul v-for="item in group.list" :key="item.id">
        <li class="item">
          <img class="avatar" v-lazy="item.pic">
          <span class="name">{{item.name}}</span>
        </li>
      </ul>
    </li>
  </ul>
  <div class="fixed" :style="fixedStyle">
    <div class="fixed-title">{{fixedTitle}}</div>
  </div>
  <div class="shortcut">
    <ul>
      <li
        v-for="(item, index) in shortcutList"
        :key="item"
        :data-index="index"
        class="item"
        :class="{'current':currentIndex===index}">
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
import { onMounted, ref,watch,computed,nextTick, onUnmounted } from 'vue'
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props) {
    const TITLE_HEIGHT = 30
    const groupRef = ref(null)
    const listHeights = ref([])
    const currentIndex = ref(0)
    const distance = ref(0)

    // 数据发生变化，监听
    watch(() => props.data, async () => {
      // 数据发生变化，内部dom还没变，dom发生变化是在nextTick之后
      await nextTick()
      calculate()
    })

    const fixedTitle = computed(() => {
      const currentGroup = props.data[currentIndex.value]
      return currentGroup ? currentGroup.title : ''
    })

    const fixedStyle = computed(() => {
      const distanceVal = distance.value
      // 偏移值是不是小于title的高度
      const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
      return {
        transform: `translate3d(0,${diff}px,0)`
      }
    })

    const shortcutList = computed(() => {
      return props.data.map(item => {
        return item.title
      })
    })

    onMounted(() => {
      window.addEventListener('scroll',handleScroll,true)
    })
    onUnmounted(() => {
      window.removeEventListener('scroll',handleScroll,true)
    })
    // 获取滚动高度
    const handleScroll = () => {
      let scrollTop = groupRef.value.scrollTop
      const listHeightsVal = listHeights.value
      for (let i = 0; i < listHeightsVal.length - 1; i++) {
        const heightTop = listHeightsVal[i]
        const heightBottom = listHeightsVal[i + 1]
        if (scrollTop >= heightTop && scrollTop <= heightBottom) {
          currentIndex.value = i
          distance.value = heightBottom - scrollTop
        }
      }
    }

    const calculate = () => {
      const list = groupRef.value.children
      const listHeightsVal = listHeights.value
      let height = 0
      
      // 首先把0 push进去，从0开始
      listHeightsVal.length = 0
      listHeightsVal.push(height)

      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        listHeightsVal.push(height)
      }
    }

    return {
      groupRef,
      fixedTitle,
      fixedStyle,
      currentIndex,
      shortcutList
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
}
.fixed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  .fixed-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
    background: $color-highlight-background;
  }
}
.shortcut{
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: $color-background-d;
  font-family: Helvetica;
  .item {
    padding: 3px;
    line-height: 1;
    color: $color-text-l;
    font-size: $font-size-small;
    &.current {
      color: $color-theme
    }
  }
}
</style>
