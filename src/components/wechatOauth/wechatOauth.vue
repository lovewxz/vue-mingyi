<template lang="html">
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import { getUserStorage } from '@/common/js/cache'

export default {
  async beforeMount() {
    const userInfo = getUserStorage()
    if (userInfo) {
      this.$router.push('/')
      return
    }
    const url = window.location.href
    const { data } = await axios.get(
      `/wechat-oauth?url=${encodeURIComponent(url)}`
    )
    if (data.success) {
      this.saveUser(data.data)
      let str = this.getUrlParam('state')
      const arr = str.split('_')
      if (arr.length > 1) {
        this.$router.replace({ name: arr[0], params: { id: arr[1] } })
      } else {
        this.$router.replace({ name: arr[0] })
      }
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
    ...mapActions(['saveUser'])
  }
}
</script>
