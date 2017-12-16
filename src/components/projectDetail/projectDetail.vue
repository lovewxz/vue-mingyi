<template>
<transition name="moveInLeft">
  <div class="project-detail">
    <scroll ref="projectDetailScroll" class="project-detail-scroll">
      <div class="project-wrapper" v-if="projectDetail">
        <div class="project-swiper-wrapper">
          <swiper :options="swiperOption" class="project-swiper">
            <swiper-slide v-for="item in projectDetail.detail_images" class="swiper-item" :key="item">
              <img :src="cdnName(item,400)" @load="loadImage">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
          <i class="iconfont icon-left" @click="back"></i>
          <i class="iconfont icon-home" @click="backHome"></i>
          <i class="iconfont icon-star"></i>
        </div>
        <div class="project-content">
          <h2 v-html="projectDetail.title"></h2>
          <p class="desc">{{projectDetail.description}}</p>
          <div class="price">
            <i>¥</i><span class="num">{{projectDetail.price}}</span><span class="time">/次</span>
            <em>¥{{projectDetail.original_price}}</em>
            <span class="sale">{{sale}}折</span>
          </div>
        </div>
        <div class="project-doctor" v-if="projectDetail.doctor">
          <div class="doctor-img">
            <img v-lazy="cdnName(projectDetail.doctor.avatar,120)" alt="">
          </div>
          <div class="doctor-desc">
            <h2>医生:{{projectDetail.doctor.realname}}</h2>
            <p v-if="projectDetail.doctor.title">职称:{{projectDetail.doctor.title}}</p>
            <i class="iconfont icon-left"></i>
          </div>
        </div>
        <div class="project-service">
          <h2 class="service-title">服务详情</h2>
          <div class="service-detail">
            <div class="service-text">小档案</div>
            <ul v-if="projectDetail.params">
              <li v-for="item in projectDetail.params">
                <span class="service-key">{{item.key}}</span>
                <span class="service-value">{{item.value}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </scroll>
    <div class="bottom-bar">
      <ul>
        <li class="size-s">
          <i class="iconfont icon-Tel"></i>
          <span class="text">电话</span>
        </li>
        <li class="size-s">
          <i class="iconfont icon-star"></i>
          <span class="text">收藏</span>
        </li>
        <li class="zx-wrapper">
          <span class="btn-zx">在线咨询</span>
        </li>
        <li class="buy-wrapper" @click.stop="showMask">
          <span class="btn-buy">立即预订</span>
        </li>
      </ul>
    </div>
    <project-mask ref="mask" :price="parseInt(projectDetail.price)" :cover-img="projectDetail.cover_image" @confirm="confirm"></project-mask>
    <transition name="moveInLeft">
      <router-view></router-view>
    </transition>
  </div>
</transition>
</template>
<script>
import axios from 'axios'
import Scroll from '@/base/scroll/scroll'
import ProjectMask from '@/components/projectMask/projectMask'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { cdnUrlMixin } from '@/common/js/mixin'
import { mapGetters } from 'vuex'
import { getStorage } from '@/common/js/cache'

export default {
  mixins: [cdnUrlMixin],
  data() {
    return {
      projectDetail: {},
      swiperOption: {
        initialSlide: 1,
        loop: true,
        autoplay: 5000,
        pagination: '.swiper-pagination'
      },
      checkLoaded: false
    }
  },
  computed: {
    sale() {
      return (Number(this.projectDetail.price) / Number(this.projectDetail.original_price) * 10).toFixed(1)
    },
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    showMask() {
      this.$refs.mask.show()
    },
    back() {
      this.$router.push('/project')
    },
    backHome() {
      this.$router.push('/')
    },
    loadImage() {
      if (!this.checkLoaded) {
        setTimeout(() => {
          this.$refs.projectDetailScroll.refresh()
        }, 20)
        this.checkLoaded = true
      }
    },
    confirm(params) {
      params = Object.assign({}, params, { coverImg: this.projectDetail.cover_image[0], title: this.projectDetail.title, projectId: this.projectDetail._id })
      let { name } = this.$route
      name = encodeURIComponent(name)
      let storageUser = getStorage('user')
      if (!this.user && !storageUser) {
        this.$router.push({ name: 'login', query: { visit: name } })
      } else {
        this.$router.push({ name: 'project-confirm-order', params: params })
      }
    },
    async _getProjectDeatil() {
      if (!this.$route.params.id) {
        return
      }
      await axios.get(`/api/projects/${this.$route.params.id}`).then(res => {
        res = res.data
        if (res.success) {
          this.projectDetail = res.data
        }
      })
    }
  },
  watch: {
    async '$route' (to, from) {
      const reg = /\/project\//
      if (reg.test(to.path)) {
        await this._getProjectDeatil()
        this.checkLoaded = false
        setTimeout(() => {
          this.$refs.projectDetailScroll.refresh()
          this.$refs.projectDetailScroll.scrollTo(0, 0)
        }, 20)
      }
    }
  },
  async created() {
    await this._getProjectDeatil()
    setTimeout(() => {
      this.$refs.projectDetailScroll.refresh()
    }, 20)
  },
  components: {
    swiper,
    swiperSlide,
    Scroll,
    ProjectMask
  }
}
</script>
<style lang="scss">
@import "~@/common/scss/mixin";

.project-detail {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    z-index: 320;
    background: #f3f7f7;
    &.moveInLeft-enter-active,
    &.moveInLeft-leave-active {
        transition: all 0.3s linear;
    }
    &.moveInLeft-enter,
    &.moveInLeft-leave-to {
        transform: translate3d(-100%,0,0);
    }
    .moveInLeft-enter-active,
    .moveInLeft-leave-active {
        transition: all 0.3s linear;
    }
    .moveInLeft-enter,
    .moveInLeft-leave-to {
        transform: translate3d(-100%,0,0);
    }
    .project-detail-scroll {
        height: 100%;
        overflow: hidden;
        .project-wrapper {
            .project-swiper-wrapper {
                position: relative;
                .iconfont {
                    position: absolute;
                    z-index: 320;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    text-align: center;
                    background: rgba(0,0,0,.6);
                    &.icon-left {
                        color: #fff;
                        font-size: 24px;
                        top: 10px;
                        left: 10px;
                        display: block;
                        line-height: 50px;
                        &:before {
                            position: absolute;
                            top: -10px;
                            left: -10px;
                            right: -10px;
                            bottom: -10px;
                        }
                    }
                    &.icon-home {
                        color: #fff;
                        font-size: 24px;
                        right: 10px;
                        top: 10px;
                        display: block;
                        line-height: 50px;
                        &:before {
                            position: absolute;
                            top: -10px;
                            left: -10px;
                            right: -10px;
                            bottom: -10px;
                        }
                    }
                    &.icon-star {
                        color: #fff;
                        font-size: 18px;
                        right: 50px;
                        top: 10px;
                        line-height: 47px;
                        display: block;
                        &:before {
                            position: absolute;
                            top: -10px;
                            left: -10px;
                            right: -10px;
                            bottom: -10px;
                        }
                    }
                }
                .project-swiper {
                    position: relative;
                    .swiper-wrapper {
                        display: flex;
                        width: 100%;
                        position: relative;
                        .swiper-item {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            flex-shrink: 0;
                            position: relative;
                            .swiper-lazy-preloader {
                                width: 40px;
                                height: 40px;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%,50%);
                                position: absolute;
                                &:after {
                                    display: block;
                                    background-image: url('../../common/images/loading.gif');
                                    width: 100%;
                                    height: 100%;
                                    background-size: 100%;
                                    background-repeat: no-repeat;
                                    content: '';
                                }
                            }
                        }
                    }
                    .swiper-pagination {
                        position: absolute;
                        display: inline-block;
                        font-size: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        height: 5px;
                        bottom: 20px;
                        span {
                            display: inline-block;
                            width: 5px;
                            height: 5px;
                            margin-right: 5px;
                            background: #fff;
                            border-radius: 50%;
                            &.swiper-pagination-bullet-active {
                                background: #ff5370;
                            }
                        }
                    }
                }
            }
            .project-content {
                padding: 12px;
                background: #fff;
                h2 {
                    font-size: 18px;
                    line-height: 24px;
                    color: #000;
                }
                .desc {
                    font-size: 14px;
                    line-height: 20px;
                    color: #969696;
                    margin-top: 10px;
                }
                .price {
                    margin-top: 10px;
                    font-size: 0;
                    i {
                        font-size: 12px;
                        font-style: normal;
                        margin-right: 4px;
                        color: #ff527f;
                        vertical-align: bottom;
                    }
                    .num {
                        font-size: 18px;
                        color: #ff527f;
                        font-weight: 900;
                        vertical-align: bottom;
                    }
                    em {
                        font-style: normal;
                        font-size: 12px;
                        color: #777;
                        text-decoration: line-through;
                        margin-left: 15px;
                        vertical-align: bottom;
                    }
                    .time {
                        font-size: 12px;
                        display: inline-block;
                        vertical-align: bottom;
                    }
                    .sale {
                        font-size: 12px;
                        color: #fff;
                        width: 45px;
                        height: 18px;
                        text-align: center;
                        line-height: 18px;
                        background: #ff8ea3;
                        position: relative;
                        border-radius: 4px;
                        display: inline-block;
                        margin-left: 15px;
                    }
                }
            }
            .project-doctor {
                margin: 15px 0;
                display: flex;
                align-items: center;
                background: #fff;
                padding: 10px;
                box-sizing: border-box;
                position: relative;
                .doctor-img {
                    flex: 0 0 60px;
                    height: 60px;
                    img {
                        border-radius: 50%;
                    }
                }
                .doctor-desc {
                    margin-left: 10px;
                    h2 {
                        font-size: 16px;
                        color: #333;
                        line-height: 1.5;
                    }
                    p {
                        font-size: 14px;
                        color: #949494;
                        @include no-wrap();
                    }
                    .icon-left {
                        position: absolute;
                        top: 10px;
                        font-size: 18px;
                        color: #949494;
                        right: 0;
                        transform: rotate(180deg);
                    }
                }
            }
            .project-service {
                width: 100%;
                background: #fff;
                padding: 10px 15px;
                box-sizing: border-box;
                .service-text {
                    display: block;
                    height: 28px;
                    padding: 0 17px;
                    font-size: 14px;
                    line-height: 28px;
                    color: #333;
                    background: #f1f1f1;
                    text-align: center;
                    margin: 25px auto 0;
                    width: 15%;
                }
                ul {
                    margin-top: 25px;
                    li {
                        display: flex;
                        padding: 6px 0;
                        border-bottom: 1px dotted #e1e1e1;
                        &:last-child {
                            border-bottom: none;
                        }
                        .service-key {
                            flex: 0 0 40%;
                            width: 40%;
                            font-size: 12px;
                            color: #969696;
                            display: flex;
                            align-items: center;
                        }
                        .service-value {
                            flex: 0 0 60%;
                            width: 60%;
                            font-size: 12px;
                            line-height: 18px;
                            color: #333;
                            text-align: right;
                        }
                    }
                }
            }
        }
    }
    .bottom-bar {
        position: fixed;
        height: 50px;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: 320;
        background: #fff;
        ul {
            display: flex;
            height: 100%;
            border-top: 1px solid #e5e5e5;
            li {
                flex: 0 0 35%;
                width: 35%;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                &.size-s {
                    flex: 0 0 15%;
                    width: 15%;
                    border-right: 1px solid #e5e5e5;
                }
                &.zx-wrapper {
                    background: #ffa89d;
                    .btn-zx {
                        color: #fff;
                        font-size: 16px;
                        font-weight: 200;
                    }
                }
                &.buy-wrapper {
                    background: #ff5c77;
                    .btn-buy {
                        color: #fff;
                        font-size: 16px;
                        font-weight: 200;
                    }
                }
                .iconfont {
                    display: block;
                    font-size: 18px;
                    &.icon-Tel {
                        color: #ff5370;
                    }
                }
                .text {
                    margin-top: 6px;
                    font-size: 12px;
                    font-weight: 200;
                }
            }
        }
    }
}
</style>
