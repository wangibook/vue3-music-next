<template>
  <div class="user-center">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <switches
        :items="['我喜欢的', '最近播放']"
        v-model="currentIndex"
      ></switches>
    </div>
    <div 
      class="play-btn" 
      v-if="currentList.length"
      @click="random">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper">
      <scroll class="list-scroll" v-if="currentIndex===0">
        <div class="list-inner">
          <song-list
            v-if="favoriteList.length" 
            :songs="favoriteList"
            @select="selectSong">
          </song-list>
          <div class="no-result" v-else>
            <img src="../../assets/images/no-result@2x.png" alt="">
            <p>暂无收藏歌曲</p>
          </div>
        </div>
      </scroll>
      <scroll class="list-scroll" v-if="currentIndex===1">
        <div class="list-inner">
          <song-list
            v-if="playHistory.length"
            :songs="playHistory"
            @select="selectSong">
          </song-list>
          <div class="no-result" v-else>
            <img src="../../assets/images/no-result@2x.png" alt="">
            <p>你还没有听过歌曲</p>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import switches from '@/components/switches/switches'
import scroll from '@/components/scroll/scroll'
import songList from '@/components/song-list/song-list'
import { mapState,mapActions } from 'vuex'
export default {
  name: 'user',
  components: {
    switches,
    scroll,
    songList
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    ...mapState([
      'favoriteList',
      'playHistory'
    ]),
    currentList() {
      return this.currentIndex === 0 ? this.favoriteList : this.playHistory
    }
  },
  methods: {
    ...mapActions([
      'addSong',
      'randomPlay'
    ]),
    back() {
      this.$router.back()
    },
    selectSong({song}) {
      this.addSong(song)
    },
    random() {
      this.randomPlay(this.currentList)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center{
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 12px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;
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
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
      .no-result{
        text-align: center;
        padding-top: 50px;
        img{
          width: 100px;
          height: 100px;
        }
        p{
          padding-top: 10px;
          color: #666;
        }
      }
    }
  }
}
</style>

