<template>
  <transition name="mini">
    <div 
      class="mini-player" 
      v-show="!fullScreen"
      @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img ref="cdImageRef" :class="cdCls" width="40" height="40" :src="currentSong.pic" alt="">
        </div>
      </div>
      <div class="slider-wrapper">
        <div class="slider-group">
          <h2 class="name">{{currentSong.name}}</h2>
          <p class="desc">{{currentSong.singer}}</p>
        </div>
      </div>
      <div class="control">
        <div class="item">
          <progress-circle :progress="progress">
            <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay"></i>
          </progress-circle>
        </div>
        <div class="item" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
      <play-list ref="playlistRef"></play-list>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useCd from './use-cd'
import ProgressCircle from './progress-circle'
import playList from './play-list'

export default {
  components: {
    ProgressCircle,
    playList
  },
  props: {
    togglePlay: {
      type: Function
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  setup() {
    const playlistRef = ref(null)
    
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)

    const { cdCls,cdRef, cdImageRef } = useCd()

    const miniPlayIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    })

    const showNormalPlayer = () => {
      store.commit('setFullScreen', true)
    }

    const showPlaylist = () => {
      playlistRef.value.show()
    }

    return {
      playlistRef,
      fullScreen,
      currentSong,
      miniPlayIcon,
      showNormalPlayer,
      showPlaylist,
      // cd
      cdCls,
      cdRef,
      cdImageRef
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player{
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper{
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd{
      width: 100%;
      height: 100%;
      img{
        border-radius: 50%;
        &.playing {
          animation: rotate 20s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group{
      .name {
        margin-bottom: 2px;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
  .control{
    display: flex;
    text-align: center;
    .item{
      width: 50px;
      .icon-mini {
        position: absolute;
        left: 9px;
        top: 0;
        color: $color-theme-d;
        font-size: 32px;
      }
      .icon-playlist {
        position: relative;
        top: 0;
        font-size: 28px;
        color: $color-theme-d;
      }
    }
  }
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0)
  }
}
</style>
