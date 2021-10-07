<template>
  <div class="recommend-detail">
    <music-list
      :pic="computedData.pic"
      :title="computedData.title"
      :songs="songs"
      :loading="loading">
    </music-list>
  </div>
</template>

<script>
import { getAlbum } from '@/api/recommend'
import { ALBUM_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'

export default createDetailComponent('recommendDetail',ALBUM_KEY,getAlbum)

</script>

<style lang="scss" scoped>
  .recommend-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>

