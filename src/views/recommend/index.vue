<template>
  <div class="recommend" v-loading="loading">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" v-if="sliders.length">
      <van-swipe-item v-for="item in sliders" :key="item.id">
        <a :href="item.link">
          <img :src="item.pic"/>
        </a>
      </van-swipe-item>
    </van-swipe>
    <div class="recommend-list">
      <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
      <ul>
        <li
          class="item"
          v-for="item in albums"
          :key="item.id"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="60" height="60" v-lazy="item.pic">
          </div>
          <div class="text">
            <h2 class="name">{{ item.username }}</h2>
            <p class="title">{{ item.title }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getRecommend } from '@/api/recommend'
export default {
  data() {
    return {
      sliders: [],
      albums: [],
    }
  },
  computed: {
    loading() {
      return !this.sliders.length && !this.albums.length
    }
  },
  mounted() {
    this._getRecommend()
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        let data = res.data.result
        this.sliders = data.sliders
        this.albums = data.albums
      })
    },
    selectItem() {

    }
  }
}
</script>

<style lang="scss" scoped>
.recommend{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .my-swipe{
    img {
      display: block;
      width: 100%;
    }
  }
  .recommend-list {
    .list-title {
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-theme;
    }
    .item {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      padding: 0 20px 20px 20px;

      .icon {
        flex: 0 0 60px;
        width: 60px;
        padding-right: 20px;
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        font-size: $font-size-medium;
      }
      .name {
        margin-bottom: 10px;
        color: $color-text;
      }
      .title {
        color: $color-text-d;
      }
    }
  }
}
</style>
