<template>
<transition name="moveInDown">
  <div class="project-fixed" v-if="caseData.project" v-show="showFlag" @click="goUrl(caseData.project._id)">
    <div class="cover-image">
      <img v-lazy="cdnName(caseData.project.cover_image,140)" alt="">
    </div>
    <div class="project-desc">

      <h2 class="title">{{caseData.project.title}}</h2>
      <div class="price">
        <span class="now-price">¥{{caseData.project.price}}</span>
        <span class="or-price">¥{{caseData.project.original_price}}</span>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
import { cdnUrlMixin } from '@/common/js/mixin'

export default {
  mixins: [cdnUrlMixin],
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    goUrl(id) {
      this.$router.push({
        name: 'project-detail',
        params: {
          id
        }
      })
    },
    hide() {
      this.showFlag = false
    },
    show() {
      this.showFlag = true
    }
  },
  props: {
    caseData: {
      type: Object,
      default: {}
    }
  }
}
</script>
<style lang="scss">
.project-fixed {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(255,255,255,.9);
    z-index: 260;
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    &.moveInDown-enter-active,
    &.moveInDown-leave-active {
        transition: all 0.3s linear;
    }
    &.moveInDown-enter,
    &.moveInDown-leave-to {
        transform: translate3d(0,-100%,0);
    }
    .cover-image {
        flex: 0 0 50px;
        width: 50px;
        height: 50px;
        border-radius: 5px;
    }
    .project-desc {
        flex: 1;
        margin-left: 10px;
        .title {
            font-size: 12px;
            line-height: 16px;
            color: #333;
        }
        .price {
            margin-top: 5px;
            font-size: 0;
            .now-price {
                display: inline-block;
                vertical-align: bottom;
                font-size: 14px;
                color: #ff527f;
            }
            .or-price {
                display: inline-block;
                vertical-align: bottom;
                font-size: 10px;
                margin-left: 5px;
                color: #b8b8b8;
                text-decoration: line-through;
            }
        }
    }
}
</style>
