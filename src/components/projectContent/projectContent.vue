<template lang="html">
  <div class="project-content" @click="goUrl(project)">
    <div class="project-cover-image">
      <img v-lazy="cdnName(project.cover_image,200)" alt="">
    </div>
    <div class="project-desc">
      <h2 class="title" v-html="project.title"></h2>
      <div class="price">
        <span class="now-price">¥{{project.price}}</span>
        <span class="or-price">¥{{project.original_price}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { cdnUrlMixin } from '@/common/js/mixin'
export default {
  props: {
    project: {
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
.project-content {
    display: flex;
    overflow: hidden;
    align-items: center;
    .project-cover-image {
        flex: 0 0 105px;
        width: 105px;
    }
    .project-desc {
        flex: 1;
        margin-left: 10px;
        .title {
            color: #444;
            margin: 2px 0 5px;
            font-size: 14px;
            line-height: 20px;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .price {
            font-size: 0;
            margin-top: 10px;
            .now-price {
                display: inline-block;
                vertical-align: bottom;
                font-size: 20px;
                color: #ff5c77;
            }
            .or-price {
                display: inline-block;
                vertical-align: bottom;
                font-size: 12px;
                color: #bbb;
                text-decoration: line-through;
                margin-left: 5px;
            }
        }
    }
}
</style>
