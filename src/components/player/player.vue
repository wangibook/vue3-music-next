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
        <div class="progress-wrapper">
          <span class="time time-l">{{formatTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progressBar
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged" />
          </div>
          <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <audio 
      ref="audioRef" 
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end">
    </audio>
  </div>
</template>

<script>
import { ref,computed, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import progressBar from './progress-bar'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/store/mutations-type'

export default {
  components: {
    progressBar
  },
  setup() {
    // data
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(1550)
    let progressChanging = false
    // vuex
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)   // 播放状态
    const playlist = computed(() => store.state.playlist)  // 歌曲列表
    const currentIndex = computed(() => store.state.currentIndex)
    const playMode = computed(() => store.state.playMode)

    // hooks
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon,toggleFavorite  } = useFavorite()
    
    // computed
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    // 歌曲还没缓存好时，给个disable
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })


    // watch 更侧重于写逻辑相关
    watch(currentSong, (newSong) =>  {
      if (!newSong.id || !newSong.url) return
      currentTime.value = 0
      // 快速点击，歌曲还没准备好时，状态为false
      songReady.value = false
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
      store.commit('setPlayingState', true)
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
      if(!songReady.value) return
      store.commit('setPlayingState', !playing.value)
    }

    // 上一首歌曲
    const prev = () => {
      const list = playlist.value
      if(!songReady.value || !list.length) return
      
      if(list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        if (index === -1) {
          index = list.length - 1
        }
        store.commit('setCurrentIndex', index)
      }
    }

    const next = () => {
      const list = playlist.value
      if(!songReady.value || !list.length) return

      if(list.length === 1) {
        loop()
      } else {
        let index = currentIndex.value + 1
        if (index === list.length) {
          index = 0
        }
        store.commit('setCurrentIndex', index)
      }
    }

    const loop = () => {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    // 特殊原因歌曲暂停，把状态置为false
    const pause = () => {
      store.commit('setPlayingState', false)
    }

    const ready = () => {
      if(songReady.value) return
      songReady.value = true
    }

    const error = () => {
      songReady.value = true
    }

    // audio的播放事件
    const updateTime = (e) => {
      // 如果是播放状态，拖动进度条，还是会跳回来，所以加个progressChanging状态
      if(!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    const onProgressChanging = (progress) => {
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
    }

    const onProgressChanged = (progress) => {
      // 拖动完成后状态置为false
      progressChanging = false
      const audioEl = audioRef.value
      // 手松开的时候才改audio播放时间
      audioEl.currentTime = currentTime.value = currentSong.value.duration * progress
      // 如果是暂停，拖动完后播放
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    const end = () => {
      currentTime.value = 0
      if(playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    return {
      audioRef,
      fullScreen,
      currentSong,
      playIcon,
      disableCls,
      currentTime,
      progress,
      // 方法
      goBack,
      togglePlay,
      prev,
      next,
      pause,
      ready,
      error,
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      end,
      // useMode
      modeIcon,
      changeMode,
      // useFavorite
      getFavoriteIcon,
      toggleFavorite
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
      // 进度条
      .progress-wrapper{
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
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
