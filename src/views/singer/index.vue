<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="selectSinger"></index-list>

    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer'
import indexList from '@/components/index-list/index-list'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  name: 'singer',
  components: {
    indexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
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
    selectSinger(singer) {
      this.selectedSinger = singer
      sessionStorage.setItem(SINGER_KEY,JSON.stringify(singer))
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    }
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
