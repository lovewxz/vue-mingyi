<template lang="html">
  <div class="login-wx">
    <p @click="login">微信登录</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getUserStorage } from '@/common/js/cache'
import { urlEncode } from '@/common/js/util'

export default {
  data() {
    return {
      URLEncode: ''
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    login() {
      const storageUser = getUserStorage()
      if (!this.user && !storageUser) {
        window.location.href = `/wechat-redirect?${this.URLEncode}`
      } else {
        this.saveUser(storageUser)
        this.$router.push('/')
      }
    },
    ...mapActions([
      'saveUser'
    ])
  },
  beforeMount() {
    const params = this.$route.query
    this.URLEncode = params ? urlEncode(params) : this.$router.push('/')
  }
}
</script>

<style lang="scss">
.login-wx {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  z-index: 700;
  background: #fff;
  p {
    font-size: 20px;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    line-height: 40px;
    background: #00993e;
    height: 40px;
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    box-shadow: 0 0 5px #00993e;
  }
}
</style>
