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
      <div 
        class="middle"
        @touchstart.prevent="onMiddleTouchStart"
        @touchmove.prevent="onMiddleTouchMove"
        @touchend.prevent="onMiddleTouchEnd">
        <div class="middle-l" :style="middleLStyle">
          <div class="cd-wrapper">
            <div class="cd" ref="cdRef">
              <img class="image" ref="cdImageRef" :class="cdCls" :src="currentSong.pic" alt="">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
          <div class="lyric-wrapper">
            <div 
              ref="lyricListRef" 
              v-if="currentLyric">
              <p 
                class="text"
                :class="{'current': currentLineNum ===index}"
                v-for="(item,index) in currentLyric.lines" 
                :key="index">
                {{item.txt}}
              </p>
            </div>
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{pureMusicLyric}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentShow==='cd'}"></span>
          <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
        </div>
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
import useCd from './use-cd'
import useLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import progressBar from './progress-bar'
import scroll from '@/components/scroll/scroll'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/store/mutations-type'

export default {
  components: {
    progressBar,
    scroll
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
    const { cdCls,cdRef, cdImageRef } = useCd()
    const { currentLyric,currentLineNum,lyricScrollRef,lyricListRef,pureMusicLyric,playingLyric,playLyric,stopLyric } = useLyric({songReady,currentTime})
    const { currentShow,middleLStyle,middleRStyle,onMiddleTouchStart,onMiddleTouchMove,onMiddleTouchEnd } = useMiddleInteractive()
    
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
      if(newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
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
      // 拖动过程中，滚动到当前歌词位置，再停止（不停止，就会顺着当前继续播放下面歌词）
      playLyric()
      stopLyric()
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
      // 拖动完成后，再播放
      playLyric()
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
      toggleFavorite,
      // useCd
      cdCls,
      cdRef,
      cdImageRef,
      // useLyric
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      pureMusicLyric,
      playingLyric,
      // useMiddleInteractive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
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
    .middle{
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper{
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
        }
      }
    }
    .bottom{
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper{
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
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
