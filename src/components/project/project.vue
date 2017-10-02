<template>
<div class="project">
  <scroll :data="projects" class="project-wrapper" :pullUp="pullUp" @scrollEnd="scrollToEnd">
    <ul>
      <li v-for="item in projects" class="project-item">
        <div class="project-content" @click="goUrl(item)">
          <div class="project-cover-image">
            <img v-lazy="cdnName(item.cover_image,200)" alt="">
          </div>
          <div class="project-desc">
            <h2 class="title" v-html="item.title"></h2>
            <div class="price">
              <span class="now-price">¥{{item.price}}</span>
              <span class="or-price">¥{{item.original_price}}</span>
            </div>
          </div>
        </div>
      </li>
      <div class="loading-wrapper">
        <loading title="" v-show="hasMore"></loading>
      </div>
    </ul>
  </scroll>
  <transition name="moveInLeft">
    <router-view></router-view>
  </transition>
</div>
</template>
<script>
import { cdnUrlMixin } from '@/common/js/mixin'
import axios from 'axios'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'

export default {
  mixins: [cdnUrlMixin],
  data() {
    return {
      projects: [],
      pullUp: true,
      total: 0,
      hasMore: true,
      page: 1,
      limit: 10
    }
  },
  methods: {
    goUrl(item) {
      this.$router.push(`/project/${item._id}`)
    },
    async scrollToEnd() {
      if (!this.hasMore) {
        return
      }
      this.page = this.page + 1
      await this._getProjectList(this.limit, this.page)
    },
    _checkMore(data) {
      if (data.length >= this.total) {
        this.hasMore = false
      }
    },
    async _getProjectList(limit, page) {
      await axios.get(`/api/projects?limit=${limit}&page=${page}`).then(res => {
        res = res.data
        if (res.success) {
          this.projects = this.projects.concat(res.data.list)
          this.total = res.data.total
          this._checkMore(this.projects)
        }
      })
    }
  },
  async created() {
    await this._getProjectList(this.limit, this.page)
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="scss" scoped>
.project {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 50px;
    width: 100%;
    .moveInLeft-enter-active,
    .moveInLeft-leave-active {
        transition: all 0.3s linear;
    }
    .moveInLeft-enter,
    .moveInLeft-leave-to {
        transform: translate3d(100%,0,0);
    }
    .project-wrapper {
        height: 100%;
        overflow: hidden;
        .project-item {
            padding: 13px 10px 13px 0;
            margin-left: 10px;
            border-bottom: 1px solid #e5e5e5;
            &:last-child {
                border-bottom: 0;
            }
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
        }
        .loading-wrapper {
            width: 24px;
            height: 24px;
            position: absolute;
            left: 50%;
            transform: translate(-50%);
        }
    }
}
</style>
