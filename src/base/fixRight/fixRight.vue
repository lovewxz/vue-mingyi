<template>
  <div class="fixed-right">
    <div class="ask">
      <i class="iconfont icon-kefu"></i>
    </div>
    <div class="back-top"
         v-show="showFlag"
         @click="backTop">
      <i class="iconfont icon-huidaodingbu"></i>
    </div>
    <div class="back-left"
         @click="back">
      <i class="iconfont icon-huidaodingbu"></i>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    backTop() {
      this.$emit('backTop')
    },
    back() {
      this.$emit('back')
    },
    hide() {
      this.showFlag = false
    },
    show() {
      this.showFlag = true
    }
  }
}
</script>
<style lang="scss">
.fixed-right {
  position: fixed;
  z-index: 300;
  right: 10px;
  bottom: 200px;
  width: 40px;
  .ask {
    width: 40px;
    height: 40px;
    display: block;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    text-align: center;
    .icon-kefu {
      font-size: 35px;
      line-height: 40px;
      color: #fff;
      display: inline-block;
    }
  }
  .back-top {
    width: 40px;
    height: 40px;
    display: block;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    text-align: center;
    margin-top: 10px;
    .icon-huidaodingbu {
      font-size: 20px;
      line-height: 40px;
      color: #fff;
      display: inline-block;
    }
  }
  .back-left {
    width: 40px;
    height: 40px;
    display: block;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    text-align: center;
    margin-top: 10px;
    .icon-huidaodingbu {
      font-size: 20px;
      line-height: 40px;
      color: #fff;
      display: inline-block;
      transform: rotate(-90deg);
    }
  }
}
</style>
