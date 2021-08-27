<template>
  <div class="singer-detail">
    <music-list
      :pic="pic"
      :title="title"
      :songs="songs"
      :loading="loading">
    </music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/api/singer'
import { processSongs } from '@/api/song'
import musicList from '@/components/music-list/music-list'
export default {
  name: 'singerDetail',
  props: {
    singer: {
      type: Object
    }
  },
  components: {
    musicList
  },
  data() {
    return {
      mid: this.$route.params.id,
      songs: [],
      loading: true
    }
  },
  computed: {
    pic() {
      return this.singer && this.singer.pic
    },
    title() {
      return this.singer && this.singer.name
    }
  },
  mounted() {
    this._getSingerDetail()
  },
  destroyed() {
    window.removeEventListener('scroll',this.handleScroll,true)
  },
  methods: {
    _getSingerDetail() {
      getSingerDetail(this.mid).then(res => {
        let data = res.data.result
        this._processSongs(data.songs)
      })
    },
    _processSongs(dataArr) {
      processSongs(dataArr).then(result => {
        this.songs = result
        this.loading = false
      })
    }
  }
}
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

