<template>
<div id="app" class="app">
  <tab></tab>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</div>
</template>

<script>
import Tab from '@/components/tab/tab'
export default {
  components: {
    Tab
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  min-width: 320px;
}
</style>
