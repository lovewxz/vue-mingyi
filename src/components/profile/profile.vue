<template>
  <div class="profile">
    <h1 v-if="userInfo.nickname">你好{{userInfo.nickname}}</h1>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.userInfo = this.user
  }
}
</script>
<style lang="scss">
</style>
