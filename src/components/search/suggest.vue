<template>
  <div 
    class="suggest"
    ref="rootRef" 
    v-loading="loading">
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
        @click="selectSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{singer.name}}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
      <div
        class="suggest-item"
        v-loading="pullUpLoading"
      ></div>
    </ul>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { search } from '@/api/search'
import { processSongs } from '@/api/song'
import usePullUpLoad from './use-pull-up-load'

export default {
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-singer','select-song'],
  setup(props,{ emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)

    const { scroll,rootRef,isPullUpLoad } = usePullUpLoad(searchMore)

    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })

    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })

    // watch这里监听的是props.query 响应式对象，不能直接监听它
    // 通过一个函数返回要监听的属性
    watch(() => props.query, async (newQuery) => {
      if(!newQuery) return
      await searchFirst()
    })

    async function searchFirst() {
      if(!props.query) return
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true
      let data = {
        query: props.query,
        page: page.value,
        showSinger: props.showSinger
      }
      const res = await search(data)
      const result = res.data.result
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
    }

    async function searchMore() {
      if(!hasMore.value || !props.query) return
      page.value++
      let data = {
        query: props.query,
        page: page.value,
        showSinger: props.showSinger
      }
      const res = await search(data)
      const result = res.data.result
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
    }

    const selectSinger = (singer) => {
      emit('select-singer',singer)
    }
    const selectSong = (song) => {
      emit('select-song',song)
    }

    return {
      singer,
      songs,
      loading,
      pullUpLoading,
      selectSinger,
      selectSong,
      //pullUpLoad
      rootRef
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest{
  height: 100%;
  overflow: hidden;
  .suggest-list{
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon{
        flex: 0 0 30px;
        width: 30px;
        .icon-mine,.icon-music{
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}

.no-result{
  text-align: center;
  padding-top: 50px;
  img{
    width: 120px;
    height: 120px;
  }
  .word{
    color: #666;
    padding-top: 10px;
  }
}
</style>
