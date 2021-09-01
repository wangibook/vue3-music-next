<template>
  <ul class="song-list">
    <li 
      class="item"
      v-for="(item, index) in songs"
      :key="item.id"
      @click="selectItem(item, index)">
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
    }
  },
  data() {
    return {

    }
  },
  methods: {
    selectItem(song,index) {
      this.$emit('select',{song,index})
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

