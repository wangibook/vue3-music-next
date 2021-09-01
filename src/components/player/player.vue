<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" alt="">
      </div>
      <div class="top">
        <div class="back"  @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{currentSong.name}}</h1>
        <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioRef" @pause="pause"></audio>
  </div>
</template>

<script>
import { ref,computed, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  setup() {
    // data
    const audioRef = ref(null)
    // vuex
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })

    watch(currentSong, (newSong) =>  {
      if (!newSong.id || !newSong.url) return
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    // 监听播放状态
    watch(playing, (newPlaying) => {
      const audioEl = audioRef.value
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    const goBack = () => {
      store.commit('setFullScreen',false)
    }

    const togglePlay = () => {
      store.commit('setPlayingState', !playing.value)
    }

    // 特殊原因歌曲暂停，把状态置为false
    const pause = () => {
      store.commit('setPlayingState', false)
    }
    return {
      audioRef,
      fullScreen,
      currentSong,
      playIcon,
      goBack,
      togglePlay,
      pause
    }
  }
}
</script>

<style lang="scss" scoped>
.player{
  .normal-player{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .bottom{
      position: absolute;
      bottom: 50px;
      width: 100%;
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
