<template>
  <div class="nav-bar">
    <div class="back"
         @click="back">
      <i class="iconfont icon-arrow-left"></i>
      <span class="text">返回</span>
    </div>
    <div class="title">{{title}}</div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    back() {
      this.$emit('back')
    }
  }
}
</script>
<style lang="scss">
.nav-bar {
  width: 100%;
  height: 40px;
  background: #1dc5c3;
  color: #fff;
  position: relative;
  .back {
    position: absolute;
    font-size: 0;
    box-sizing: border-box;
    .icon-arrow-left {
      display: inline-block;
      padding-right: 2px;
      font-size: 20px;
      vertical-align: middle;
      padding-left: 5px;
    }
    .text {
      font-size: 14px;
      line-height: 40px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .title {
    text-align: center;
    line-height: 40px;
    font-size: 18px;
  }
}
</style>
