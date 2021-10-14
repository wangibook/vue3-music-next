<template>
  <div class="app-container">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <div class="hot-keys" v-show="!query">
      <h1 class="title">热门搜索</h1>
      <ul>
        <li
          class="item"
          v-for="item in hotKeys"
          :key="item.id"
          @click="addQuery(item.key)"
        >
          <span>{{item.key}}</span>
        </li>
      </ul>
    </div>

    <div class="search-result" v-show="query">
      <suggest 
        :query="query"
        @select-singer="selectSinger"
        @select-song="selectSong" />
    </div>

    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import searchInput from '@/components/search/search-input'
import suggest from '@/components/search/suggest'
import { ref,onMounted } from 'vue'
import { getHotKeys } from '@/api/search'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  components: {
    searchInput,
    suggest
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)

    const store = useStore()
    const router = useRouter()

    onMounted(() => {
      _getHotKeys()
    })

    const _getHotKeys = () => {
      getHotKeys().then(res => {
        hotKeys.value = res.data.result.hotKeys
      })
    }

    const addQuery = (key) => {
      query.value = key
    }

    function selectSinger(singer) {
      selectedSinger.value = singer
      sessionStorage.setItem(SINGER_KEY,JSON.stringify(singer))
      router.push({
        path: `/search/${singer.mid}`
      })
    }

    function selectSong(song) {
      store.dispatch('addSong',song)
    }

    return {
      query,
      hotKeys,
      selectedSinger,
      addQuery,
      selectSinger,
      selectSong
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input-wrapper{
  margin: 20px;
}
.hot-keys{
  margin: 20px;
  .title {
    margin-bottom: 20px;
    font-size: $font-size-medium;
    color: $color-text-l;
  }
  .item {
    display: inline-block;
    padding: 5px 10px;
    margin: 0 20px 10px 0;
    border-radius: 6px;
    background: $color-highlight-background;
    font-size: $font-size-medium;
    color: $color-text-d;
  }
}
.search-result {
  flex: 1;
  overflow: hidden;
}
</style>
