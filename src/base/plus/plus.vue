<template>
<div class="plus" @click.stop>
  <i class="iconfont icon-jian" @click="decrease"></i>
  <div class="num">{{num}}</div>
  <i class="iconfont icon-plus" @click="plus"></i>
</div>
</template>
<script>
export default {
  props: {
    oneOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      num: 1
    }
  },
  methods: {
    plus() {
      if (this.oneOnly) {
        return
      }
      this.num++
      this.$emit('getNum', this.num)
      return this.num
    },
    decrease() {
      if (this.oneOnly) {
        return
      }
      if (this.num > 1) {
        this.num--
        this.$emit('getNum', this.num)
      }
      return this.num
    }
  }
}
</script>
<style lang="scss">
.plus {
    font-size: 0;
    display: flex;
    align-items: center;
    // border: 1px solid #e5e5e5;
    // width: 110px;
    // height: 30px;
    // border-radius: 4px;
    .iconfont {
        display: inline-block;
        vertical-align: top;
        width: 30px;
        line-height: 30px;
        background: #f1f1f1;
        text-align: center;
        font-size: 14px;
        color: #666;
        position: relative;
        flex: 0 0 30px;
        border: 10px solid transparent;
        background-clip: padding-box;
    }
    .num {
        display: inline-block;
        vertical-align: top;
        width: 50px;
        font-size: 16px;
        text-align: center;
        line-height: 30px;
    }
}
</style>
