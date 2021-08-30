<template>
  <div class="singer-detail">
    <music-list
      :pic="computedSinger.pic"
      :title="computedSinger.name"
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
    computedSinger() {
      let result = null
      const singer = this.singer
      if(singer) {
        result = singer
      } else {
        let singerKey = JSON.parse(sessionStorage.getItem('singerKey'))
        if(singerKey && singerKey.mid == this.mid) {
          result = singerKey
        }
      }
      return result
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
        this.loading = false
        if(data.songs.length) {
          this._processSongs(data.songs)
        }
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

