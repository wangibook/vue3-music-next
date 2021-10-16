<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input
            v-model="query"
            placeholder="搜索歌曲"
          ></search-input>
        </div>
        <div v-show="!query">
          <switches
            :items="['最近播放', '搜索历史']"
            v-model="currentIndex"
          ></switches>
          <div class="list-wrapper">
            <scroll
              ref="scrollRef" 
              class="list-scroll" 
              v-if="currentIndex===0">
              <div class="list-inner">
                <song-list 
                  :songs="playHistory"
                  @select="selectSongBySongList">
                </song-list>
              </div>
            </scroll>
            <scroll 
              ref="scrollRef"
              class="list-scroll" 
              v-if="currentIndex===1">
              <div class="list-inner">
                <search-list 
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQueryBySearchList">
                </search-list>
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest 
            :query="query"
            :showSinger="false"
            @select-song="selectSongBySuggest" />
        </div>
        <message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已添加到播放列表</span>
          </div>
        </message>
      </div>
    </transition>
  </teleport>
</template>

<script>
import searchInput from '@/components/search/search-input'
import suggest from '@/components/search/suggest'
import switches from '@/components/switches/switches'
import scroll from '@/components/scroll/scroll'
import songList from '@/components/song-list/song-list'
import searchList from '@/components/search/search-list'
import message from '@/components/message/message'
import { computed, ref, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import useSearchHistory from '@/components/search/use-search-history'

export default {
  components: {
    searchInput,
    suggest,
    switches,
    songList,
    searchList,
    scroll,
    message
  },
  setup() {
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)
    const messageRef = ref(null)

    const store = useStore()

    const playHistory = computed(() => store.state.playHistory)
    const searchHistory = computed(() => store.state.searchHistory)

    const { saveSearch } = useSearchHistory()

    watch(query,async () => {
      await nextTick()
      refreshScroll()
    })

    // dom在数据渲染前就已经有了，解决首次进入无法滚动的问题
    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll()
    }

    function hide() {
      visible.value = false
    }

    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    function selectSongBySuggest(song) {
      saveSearch(query.value)
      addSong(song)
    }

    // 选择一首最近播放的歌曲，添加到播放列表中播放
    function selectSongBySongList({song}) {
      addSong(song)
    }

    function addQueryBySearchList(key) {
      query.value = key
    }

    function addSong(song) {
      store.dispatch('addSong',song)
      showMessage()
    }

    function showMessage() {
      messageRef.value.show()
    }

    return {
      visible,
      query,
      scrollRef,
      messageRef,
      currentIndex,
      playHistory,
      searchHistory,
      show,
      hide,
      selectSongBySuggest,
      selectSongBySongList,
      addQueryBySearchList
    }
  }
}
</script>

<style lang="scss" scoped>
.add-song{
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px
  }
  .list-wrapper{
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
