import { processSongs } from '@/api/song'
import musicList from '@/components/music-list/music-list'

export default function createDetailComponent(name,key,fetch) {
  return {
    name,
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
          let cached = JSON.parse(sessionStorage.getItem(key))
          if(cached && (cached.mid || cached.id) == this.id) {
            result = cached
          }
        }
        return result
      }
    },
    mounted() {
      this.getData()
    },
    destroyed() {
      window.removeEventListener('scroll',this.handleScroll,true)
    },
    methods: {
      getData() {
        fetch(this.computedData).then(res => {
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
}