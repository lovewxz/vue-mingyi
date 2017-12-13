<template>
<transition name="confirm-fade">
  <div class="confirm" v-show="showFlag" @click.stop>
    <div class="confirm-wrapper">
      <div class="confirm-content">
        <p class="text">{{text}}</p>
        <div class="operate">
          <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
          <div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    confirm() {
      this.hide()
      this.$emit('confirm')
    },
    cancel() {
      this.hide()
    }
  }
}
</script>
<style lang="scss">
@import "../../common/scss/variable";
.confirm {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background: $color-background-d;
    &.confirm-fade-enter-active {
      animation: confirm-fadeIn 0.3s;
      .confirm-content {
        animation: confirm-zoom 0.3s;
      }
    }
    .confirm-wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        z-index: 999;
        .confirm-content {
            width: 270px;
            border-radius: 5px;
            background: #fff;
            .text {
                padding: 19px 15px;
                line-height: 22px;
                text-align: center;
                font-size: 18px;
                color: #000;
            }
            .operate {
                display: flex;
                align-items: center;
                text-align: center;
                font-size: 18px;
                .operate-btn {
                    flex: 1;
                    line-height: 22px;
                    padding: 10px 0;
                    border-top: 1px solid #d5d5d6;
                    color: #333;
                    &.left {
                        border-right: 1px solid #d5d5d6;
                    }
                }
            }
        }
    }
}
@keyframes confirm-fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes confirm-zoom {
  0% {
    transform: scale(.9);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
