<template>
  <div class="singer-detail">
    <music-list
      :pic="computedData.pic"
      :title="computedData.name"
      :songs="songs"
      :loading="loading">
    </music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/api/singer'
import { SINGER_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'

export default createDetailComponent('singerDetail',SINGER_KEY,getSingerDetail)
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>

