<template lang="html">
  <div class="case-detail">
    <div class="case-top">
      <span class="head-img">
      <img v-lazy="cdnName(pcase.compare_photo.after,80)" >
    </span>
      <span class="head-name">{{pcase.user_name}}</span>
    </div>
    <div class="case-photo">
      <div class="case-before">
        <img v-lazy="cdnName(pcase.compare_photo.before,300)">
        <em>Before</em>
      </div>
      <div class="case-after">
        <img v-lazy="cdnName(pcase.compare_photo.after,300)">
        <em>After</em>
      </div>
    </div>
    <div class="case-text">
      <p>{{pcase.contents}}</p>
    </div>
  </div>
</template>

<script>
import { cdnUrlMixin } from '@/common/js/mixin'

export default {
  props: {
    pcase: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mixins: [cdnUrlMixin]
}
</script>

<style lang="scss">
.case-detail {
    .case-top {
        display: flex;
        align-items: center;
        .head-img {
            flex: 0 0 40px;
            width: 40px;
            height: 40px;
            display: block;
            img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
            }
        }
        .head-name {
            flex: 1;
            margin-left: 5px;
            font-size: 14px;
            color: #777;
        }
    }
    .case-photo {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        overflow: hidden;
        .case-after,
        .case-before {
            position: relative;
            flex: 1;
            em {
                font-size: 12px;
                background: rgba(51,51,51,.7);
                color: #fff;
                position: absolute;
                padding: 2px 5px;
                font-style: normal;
            }
            img {
                border-radius: 10px;
            }
        }
        .case-before {
            margin-right: 5px;
            em {
                border-radius: 6px 0 10px 0;
                right: 0;
                bottom: 2px;
            }
        }
        .case-after {
            em {
                border-radius: 0 6px 0 10px;
                left: 0;
                bottom: 2px;
                background: rgba(44,199,197,.7);
            }
        }
    }
    .case-text {
        font-size: 14px;
        line-height: 1.5;
        color: #777;
    }
}
</style>
