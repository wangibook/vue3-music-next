<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li 
        v-for="item in searches"
        :key="item"
        class="search-item"
        @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span
          class="icon"
          v-if="showDelete"
          @click.stop="deleteItem(item)"
        >
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select','delete'],
  methods: {
    selectItem(item) {
      this.$emit('select',item)
    },
    deleteItem(item) {
      this.$emit('delete',item)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-list{
  .search-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: $font-size-medium;
    color: $color-text-l;
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>

