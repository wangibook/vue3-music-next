<template>
  <div class="top-list">
    <ul class="top-list-content">
      <li
        class="item"
        v-for="item in topList"
        :key="item.id"
        @click="selectItem(item)">
        <img class="img" v-lazy="item.pic" alt="">
        <ul class="song-list">
          <li
            class="song"
            v-for="(song, index) in item.songList"
            :key="song.id">
            <span>{{index + 1}}. </span>
            <span>{{song.songName}}-{{song.singerName}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedTop"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getTopList } from '@/api/topList'
import { TOP_KEY } from '@/assets/js/constant'
export default {
  name: 'topList',
  data() {
    return {
      topList: [],
      selectedTop: null
    }
  },
  mounted() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      getTopList().then(res => {
        let data = res.data.result
        this.topList = data.topList
      })
    },
    selectItem(top) {
      this.selectedTop = top
      sessionStorage.setItem(TOP_KEY,JSON.stringify(top))
      this.$router.push({
        path: `/topList/${top.id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-list{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: scroll;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .img {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
