<template>
  <div class="music-list">
    <div class="back" @click="$router.back()">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" ref="bgImgRef" :style="bgImageStyle">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <div 
      class="list"
      :style="listStyle"
      ref="listRef"
      v-loading="loading">
      <song-list 
        v-if="songs.length" 
        :songs="songs"
        @select="selectItem">
      </song-list>
      <div class="no-result" v-else>
        <img src="../../assets/images/no-result@2x.png" alt="">
        <p class="word">抱歉，没有找到可播放的歌曲</p>
      </div>
    </div>
  </div>
</template>

<script>
import songList from '@/components/song-list/song-list'
import { mapState,mapActions } from 'vuex'
const RESERVED_HEIGHT = 40
export default {
  props: {
    pic: {
      type: String
    },
    title: {
      type: String
    },
    songs: {
      type: Array
    },
    loading: {
      type: Boolean
    }
  },
  components: {
    songList
  },
  data() {
    return {
      imgHeght: 0,
      maxTranslateY: 0,
      scrollTop: 0
    }
  },
  computed: {
    ...mapState([
      'playlist'
    ]),
    bgImageStyle() {
      let paddingTop = '70%'
        
      return {
        paddingTop,
        backgroundImage: `url(${this.pic})`
      }
    },
    playBtnStyle() {
      let display = ''
      if(this.scrollTop > 0) {
        display = 'none'
      }
      return {
        display
      }
    },
    listStyle() {
      let imgHeght = this.imgHeght
      let scrollTop = this.scrollTop
      let height = imgHeght - scrollTop

      if(height < 40) {
        height = `${RESERVED_HEIGHT}px`
      }

      // 歌曲滚动列表距底部距离，防止有一部分被遮挡
      let bottom = this.playlist.length ? '60px' : '0'
      return {
        top: `${height}px`,
        bottom
      }
    },
    filterStyle() {
      let blur = 0
      let imgHeght = this.imgHeght
      let scrollTop = this.scrollTop
      if(scrollTop > 0) {
        // blur = scrollTop / imgHeght * 20
        blur = Math.min(this.maxTranslateY / imgHeght, scrollTop / imgHeght) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    }
  },
  mounted() {
    this.imgHeght = this.$refs.bgImgRef.clientHeight
    
    window.addEventListener('scroll',this.handleScroll,true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll',this.handleScroll,true)
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    handleScroll() {
      if(this.$refs.listRef) {
        this.scrollTop = this.$refs.listRef.scrollTop
        this.maxTranslateY = this.imgHeght - RESERVED_HEIGHT
      }
    },
    selectItem({song,index}) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay(this.songs)
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list{
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px 30px;
    box-sizing: border-box;
    background: #222;
    overflow: scroll;
    
    .no-result{
      text-align: center;
      padding-top: 50px;
      img{
        width: 120px;
        height: 120px;
      }
      .word{
        color: #666;
        padding-top: 10px;
      }
    }
  }
}
</style>

