<template>
  <m-header></m-header>
  <m-tab></m-tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
  <router-view :style="viewStyle" name="user" v-slot="{ Component }">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>

  <player />
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
import { mapState } from 'vuex'

export default {
  components: {
    MHeader: Header,
    MTab: Tab,
    Player
  },
  computed: {
    ...mapState([
      'playlist'
    ]),
    viewStyle() {
      let bottom = this.playlist.length ? '60px' : '0'
      return {
        bottom
      }
    }
  }
}
</script>