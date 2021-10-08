<template>
  <ul class="song-list">
    <li 
      class="item"
      v-for="(item, index) in songs"
      :key="item.id"
      @click="selectItem(item, index)">
      <div class="rank" v-if="rank">
        <span class="text" :class="getRankCls(index)">{{getRankText(index)}}</span>
      </div>
      <div class="content">
        <h2 class="name">{{item.name}}</h2>
        <p class="desc">{{item.singer}}-{{item.album}}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    rank: {
      type: Boolean
    }
  },
  data() {
    return {

    }
  },
  methods: {
    selectItem(song,index) {
      this.$emit('select',{song,index})
    },
    getRankCls(index) {
      if(index <= 2) {
        return `icon icon${index}`
      }
    },
    getRankText(index) {
      if(index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list{
  .item{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank{
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon{
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0{
          background-image: url('./first@2x.png');
        }
        &.icon1{
          background-image: url('./second@2x.png');
        }
        &.icon2{
          background-image: url('./third@2x.png');
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
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
</style>

