<template lang="html">
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  async beforeMount() {
    const url = window.location.href
    const { data } = await axios.get(`/wechat-oauth?url=${encodeURIComponent(url)}`)
    if (data.success) {
      this.saveUser(data.data)
      const visit = this.getUrlParam('state')
      this.$router.replace({ name: visit })
    } else {
      throw new Error('用户信息获取失败')
    }
  },
  methods: {
    getUrlParam(param) {
      const reg = new RegExp(`(^|&)${param}=([^&]*)(&|$)`)
      const result = window.location.search.substr(1).match(reg)
      return result ? decodeURIComponent(result[2]) : null
    },
    ...mapActions([
      'saveUser'
    ])
  }
}
</script>
