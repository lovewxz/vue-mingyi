<template>
  <transition name="fadeIn">
    <div class="project-mask"
         v-show="showFlag"
         @click.stop="hide">
      <div class="project-layer">
        <h3>预订方式</h3>
        <switches :switches="switches"
                  :currentIndex="currentIndex"
                  @switch="seletSwitch"></switches>
        <h3>预订数量</h3>
        <plus @getNum="getNum"
              :num="num"></plus>
        <div class="price-detail">
          <ul>
            <li>
              <span class="price-title">特惠价</span>
              <span class="price">¥{{price}}</span>
            </li>
            <li v-if="this.currentIndex === 0">
              <span class="price-title">订金</span>
              <span class="price">¥{{parseInt(price * 0.1)}}</span>
            </li>
            <li>
              <span class="price-title">数量</span>
              <span class="price">x{{num}}</span>
            </li>
            <li>
              <span class="price-title title-color">需支付</span>
              <span class="price price-color">¥{{totalPrice}}</span>
            </li>
          </ul>
        </div>
        <div class="submit-order"
             @click.stop="createOrder">
          <p>立即预订</p>
        </div>
        <div class="layer-close"
             @click.stop="hide">
          <i class="iconfont icon-guanbi"></i>
        </div>
        <div class="cover-image">
          <img v-lazy="cdnName(coverImg[0],200)"
               alt="">
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Switches from '@/base/switches/switches'
import Plus from '@/base/plus/plus'
import { cdnUrlMixin } from '@/common/js/mixin'
import { mapGetters } from 'vuex'

export default {
  mixins: [cdnUrlMixin],
  props: {
    price: {
      type: Number,
      default: 0
    },
    coverImg: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      switches: [{ name: '支付订金' }, { name: '支付全款' }],
      currentIndex: 0,
      showFlag: false,
      num: 1
    }
  },
  computed: {
    totalPrice() {
      if (this.currentIndex === 1) {
        return this.num * this.price
      } else if (this.currentIndex === 0) {
        return this.num * parseInt(this.price * 0.1)
      }
    },
    ...mapGetters(['user'])
  },
  methods: {
    hide() {
      this.showFlag = false
    },
    show() {
      this.showFlag = true
    },
    seletSwitch(index) {
      this.currentIndex = index
    },
    getNum(num) {
      this.num = num
    },
    createOrder() {
      const params = {
        totalPrice: this.totalPrice,
        singlePrice:
          this.currentIndex === 0
            ? parseInt(this.price * 0.1)
            : parseInt(this.price),
        price: this.price,
        num: this.num,
        type: this.currentIndex === 0 ? '支付订金' : '支付全款'
      }
      this.$emit('confirm', params)
    }
  },
  components: {
    Switches,
    Plus
  }
}
</script>
<style lang="scss">
.project-mask {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  z-index: 350;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  &.fadeIn-enter-active,
  &.fadeIn-leave-active {
    transition: opacity 0.3s linear;
    .project-layer {
      transition: all 0.3s linear;
    }
  }
  &.fadeIn-enter,
  &.fadeIn-leave-to {
    opacity: 0;
    .project-layer {
      transform: translate3d(0, 100%, 0);
    }
  }
  .project-layer {
    width: 100%;
    max-height: 75%;
    background: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 15px 12px;
    box-sizing: border-box;
    h3 {
      font-size: 14px;
      margin-bottom: 5px;
    }
    .switches {
      margin-bottom: 18px;
    }
  }
  .plus {
    margin-bottom: 4px;
  }
  .price-detail {
    border-top: 1px solid #dbdbdb;
    padding-top: 13px;
    padding-bottom: 21px;
    ul {
      display: flex;
      li {
        flex: 0 0 25%;
        span {
          display: block;
          line-height: 1.3;
          &.price-title {
            color: #999;
            font-size: 14px;
          }
          &.price {
            font-size: 16px;
            color: #999;
          }
          &.price-color {
            color: #ff5c77;
          }
          &.title-color {
            color: #333;
          }
        }
      }
    }
  }
  .submit-order {
    height: 50px;
    line-height: 50px;
    color: #fff;
    background: #ff5c77;
    border-radius: 20px;
    text-align: center;
    width: 80%;
    margin: 0 auto;
  }
  .layer-close {
    width: 40px;
    height: 40px;
    text-align: center;
    position: absolute;
    right: 0;
    top: 0;
    .icon-guanbi {
      font-size: 30px;
      line-height: 40px;
      color: #555;
    }
  }
  .cover-image {
    position: absolute;
    width: 100px;
    height: 100px;
    right: 50px;
    top: -50px;
    border-radius: 5px;
    img {
      border-radius: 5px;
    }
  }
}
</style>
