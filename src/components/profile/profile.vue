<template>
  <div class="profile">
    <h1 v-if="userInfo.nickname">你好{{userInfo.nickname}}</h1>
  </div>
</template>
<script>
import { getStorage } from '@/common/js/cache'

export default {
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
    this.userInfo = getStorage('user')
  }
}
</script>
<style lang="scss">
</style>
