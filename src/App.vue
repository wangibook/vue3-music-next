<template>
  <m-header></m-header>
  <!-- <router-view/> -->
</template>

<script>
import Header from '@/components/header/header'
export default {
  components: {
    MHeader: Header
  },
}
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
