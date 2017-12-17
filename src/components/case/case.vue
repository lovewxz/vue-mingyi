<template>
<div class="case" ref="case">
  <scroll ref="scroll" :data="cases" class="case-content" :pullUp="pullUp" @scrollEnd="scrollToEnd">
    <ul>
      <li v-for="item in cases" class="case-item">
        <router-link :to="`/case/list/${item._id}`">
          <div class="case-detail">
            <div class="case-top">
              <span class="head-img">
              <img v-lazy="cdnName(item.compare_photo.after,80)" >
            </span>
              <span class="head-name">{{item.user_name}}</span>
            </div>
            <div class="case-photo">
              <div class="case-before">
                <img v-lazy="cdnName(item.compare_photo.before,300)">
                <em>Before</em>
              </div>
              <div class="case-after">
                <img v-lazy="cdnName(item.compare_photo.after,300)">
                <em>After</em>
              </div>
            </div>
            <div class="case-text">
              <p>{{item.contents}}</p>
            </div>
          </div>
        </router-link>
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
import axios from 'axios'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { cdnUrlMixin } from '@/common/js/mixin'

export default {
  mixins: [cdnUrlMixin],
  data() {
    return {
      cases: [],
      pullUp: true,
      hasMore: true,
      page: 1,
      limit: 10,
      total: 0
    }
  },
  methods: {
    async scrollToEnd() {
      if (!this.hasMore) {
        return
      }
      this.page = this.page + 1
      await axios(`/api/cases?limit=${this.limit}&page=${this.page}`).then(res => {
        res = res.data
        if (res.success) {
          this.cases = this.cases.concat(res.data.list)
          this._checkMore(this.cases)
        }
      })
    },
    async _getCases() {
      await axios('/api/cases').then(res => {
        res = res.data
        if (res.success) {
          this.cases = res.data.list
          this.total = res.data.total
          this._checkMore(this.cases)
        }
      })
    },
    _checkMore(data) {
      if (data.length >= this.total) {
        this.hasMore = false
      }
    }
  },
  async created() {
    await this._getCases()
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="scss" scoped>
.case {
    background: #f3f7f7;
    position: fixed;
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
    .case-content {
        height: 100%;
        overflow: hidden;
        ul {
            position: relative;
            .case-item {
                margin-bottom: 10px;
                box-sizing: border-box;
                padding: 15px;
                background: #fff;
                box-shadow: 0 0 5px #ccc;
                &:last-child {
                    margin-bottom: 0;
                }
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
</style>
