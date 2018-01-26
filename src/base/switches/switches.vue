<template>
  <ul class="switches"
      @click.stop>
    <li class="switch-item"
        v-for="(item,index) in switches"
        :key="index"
        :class="{active: currentIndex === index}"
        @click="selectItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    switches: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    selectItem(index) {
      this.$emit('switch', index)
    }
  }
}
</script>
<style lang="scss">
.switches {
  display: flex;
  align-items: center;
  width: 200px;
  .switch-item {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #666;
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    padding: 6px;
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      color: #ff97a5;
      border: 1px solid #ff97a5;
    }
  }
}
</style>
