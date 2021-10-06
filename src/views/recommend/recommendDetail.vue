<template>
  <div class="recommend-detail">
    <music-list
      :pic="computedData.pic"
      :title="computedData.name"
      :songs="songs"
      :loading="loading">
    </music-list>
  </div>
</template>

<script>
import { getAlbum } from '@/api/recommend'
import { processSongs } from '@/api/song'
import musicList from '@/components/music-list/music-list'
export default {
  name: 'recommendDetail',
  props: {
    data: {
      type: Object
    }
  },
  components: {
    musicList
  },
  data() {
    return {
      id: this.$route.params.id,
      songs: [],
      loading: true
    }
  },
  computed: {
    computedData() {
      let result = null
      const data = this.data
      if(data) {
        result = data
      } else {
        let albumKey = JSON.parse(sessionStorage.getItem('albumKey'))
        if(albumKey && albumKey.id == this.id) {
          result = albumKey
        }
      }
      return result
    }
  },
  mounted() {
    this._getAlbum()
  },
  destroyed() {
    window.removeEventListener('scroll',this.handleScroll,true)
  },
  methods: {
    _getAlbum() {
      getAlbum(this.id).then(res => {
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

