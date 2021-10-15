<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <div class="hot-history" v-show="!query">
      <!-- 热门搜索 -->
      <div class="hot-keys">
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
      <!-- 搜索历史 -->
      <div class="search-history"  v-show="searchHistory.length">
        <h1 class="title">
          <span>搜索历史</span>
          <i class="icon-clear" @click="showConfirm"></i>
        </h1>
        <search-list 
          :searches="searchHistory"
          @select="addQuery"
          @delete="deleteSearch">
        </search-list>
      </div>
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

    <confirm-com
      ref="confirmRef"
      text="是否清空所有搜索历史?"
      @confirm="clearSearch">
    </confirm-com>
  </div>
</template>

<script>
import searchInput from '@/components/search/search-input'
import suggest from '@/components/search/suggest'
import searchList from '@/components/search/search-list'
import confirmCom from '@/components/confirm/confirm'
import { ref,onMounted, computed } from 'vue'
import { getHotKeys } from '@/api/search'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '@/components/search/use-search-history'

export default {
  components: {
    searchInput,
    suggest,
    searchList,
    confirmCom
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)
    const confirmRef = ref(null)

    const store = useStore()
    const router = useRouter()

    const searchHistory = computed(() => store.state.searchHistory)

    const { saveSearch,deleteSearch,clearSearch } = useSearchHistory()

    onMounted(() => {
      _getHotKeys()
    })

    const _getHotKeys = () => {
      getHotKeys().then(res => {
        hotKeys.value = res.data.result.hotKeys
      })
    }

    function addQuery(key) {
      query.value = key
    }

    function selectSinger(singer) {
      selectedSinger.value = singer
      saveSearch(query.value)
      sessionStorage.setItem(SINGER_KEY,JSON.stringify(singer))
      router.push({
        path: `/search/${singer.mid}`
      })
    }

    function selectSong(song) {
      saveSearch(query.value)
      store.dispatch('addSong',song)
    }

    function showConfirm() {
      confirmRef.value.show()
    }

    return {
      query,
      hotKeys,
      selectedSinger,
      searchHistory,
      confirmRef,
      addQuery,
      selectSinger,
      selectSong,
      showConfirm,
      // use-search-history
      deleteSearch,
      clearSearch
    }
  }
}
</script>

<style lang="scss" scoped>
.search{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper{
    margin: 20px;
  }
  .hot-history{
    position: fixed;
    top: 176px;
    bottom: 0;
    overflow: scroll;
  }
  .hot-keys{
    margin:0 20px 20px;
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
  .search-history{
    margin: 0 20px;
    .title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: $font-size-medium;
      color: $color-text-l;
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
