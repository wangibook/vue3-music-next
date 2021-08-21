<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers"></index-list>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'
import indexList from '@/components/index-list/index-list'
export default {
  components: {
    indexList
  },
  data() {
    return {
      singers: []
    }
  },
  mounted() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        let data = res.data.result
        this.singers = data.singers
      })
    },
    
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
