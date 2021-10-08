<template>
  <div class="top-detail">
    <music-list
      :pic="computedData.pic"
      :title="computedData.name"
      :songs="songs"
      :loading="loading"
      rank>
    </music-list>
  </div>
</template>

<script>
import { getTopDetail } from '@/api/topList'
import { TOP_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'

export default createDetailComponent('topDetail',TOP_KEY,getTopDetail)

</script>

<style lang="scss" scoped>
  .top-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>