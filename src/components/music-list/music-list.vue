<template>
  <div class="music-list">
    <div class="back" @click="$router.back()">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" ref="bgImgRef" :style="bgImageStyle"></div>
    <div 
      class="list"
      :style="listStyle"
      ref="listRef"
      v-loading="loading">
      <ul class="song-list">
        <li 
          class="item"
          v-for="(item, index) in songs"
          :key="item.id">
          <div class="content">
            <h2 class="name">{{item.name}}</h2>
            <p class="desc">{{item.singer}}-{{item.album}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
      imgHeght: 0,
      maxTranslateY: 0,
      scrollTop: 0
    }
  },
  computed: {
    bgImageStyle() {
      let paddingTop = '70%'
      let height = 0

      if(this.scrollTop > this.maxTranslateY) {
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
      }
      
      return {
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`
      }
    },
    listStyle() {
      return {
        top: `${this.imgHeght}px`
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
    handleScroll() {
      this.scrollTop = this.$refs.listRef.scrollTop
      this.maxTranslateY = this.imgHeght - RESERVED_HEIGHT
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
    background: #222;
    overflow: scroll;
    .song-list{
      .item{
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 64px;
        font-size: $font-size-medium;
        .content {
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          .name {
            @include no-wrap();
            color: $color-text
          }
          .desc {
            @include no-wrap();
            margin-top: 4px;
            color: $color-text-d;
          }
        }
      }
    } 
  }
}
</style>

