<template>
<div class="case-list" ref="caseList">
  <scroll :listen-scroll="listenScroll" @scroll="scroll" :probe-type="probeType" class="case-wrapper" ref="caseListScroll">
    <div>
      <nav-bar :title="title" @back="back"></nav-bar>
      <div class="case-project" ref="caseProject">
        <div class="case-top">
          <span class="head-img" v-if="caseData.compare_photo">
            <img v-lazy="cdnName(caseData.compare_photo.after,80)" alt="">
          </span>
          <span class="head-name">{{caseData.user_name}}</span>
        </div>
        <div class="case-project-detail" @click="goUrl(caseData.project._id)" v-if="caseData.project">
          <div class="cover-img">
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
        <div class="tags">
          <ul>
            <li v-for="item in caseData.all_item" class="tag-name">
              {{item}}
            </li>
          </ul>
        </div>
      </div>
      <div class="case-before">
        <div class="before-title">
          <h3 class="title">术前</h3>
        </div>
        <div class="before-imgs" v-if="caseData.compare_photo">
          <ul>
            <li class="before-item">
              <img v-lazy="cdnName(caseData.compare_photo.before,180)" alt="">
            </li>
            <li class="before-item">
              <img v-lazy="cdnName(caseData.compare_photo.before,180)" alt="">
            </li>
            <li class="before-item">
              <img v-lazy="cdnName(caseData.compare_photo.before,180)" alt="">
            </li>
          </ul>
        </div>
      </div>
      <div class="sections-title">
        <i class="iconfont icon-comiisfariji"></i>
        <h3 class="text">我的美丽日记</h3>
      </div>
      <div class="case-sections">
        <ul>
          <li v-for="diary in diaryData" class="section-item">
            <router-link :to="`/case/list/${caseData._id}/${diary._id}`">
              <div class="section-page">
                <h3 class="text">{{diary.title}}</h3>
              </div>
              <div class="section-imgs">
                <ul>
                  <li v-for="img in diary.images" class="img-item">
                    <img v-lazy="cdnName(img,300)" alt="">
                  </li>
                </ul>
              </div>
              <div class="section-text">{{diary.text}}</div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </scroll>
  <layer :case-data="caseData" ref="layer"></layer>
  <fix-right @back="back" @backTop="backTop" ref="fixRight"></fix-right>
  <transition name="moveInTop">
    <router-view></router-view>
  </transition>
</div>
</template>
<script>
import navBar from '@/base/navBar/navBar'
import axios from 'axios'
import Scroll from '@/base/scroll/scroll'
import Layer from '@/base/layer/layer'
import { cdnUrlMixin } from '@/common/js/mixin'
import { removeHTMLTag, getImgSrc } from '@/common/js/util'
import fixRight from '@/base/fixRight/fixRight'

export default {
  mixins: [cdnUrlMixin],
  data() {
    return {
      title: '日记详情',
      caseData: {},
      listenScroll: true,
      scrollY: -1,
      diaryData: []
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
    back() {
      this.$router.back()
    },
    backTop() {
      this.$refs.caseListScroll.scrollTo(0, 0, 300)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    async _getCaseListById(id) {
      await axios.get(`/api/cases/list/${id}`).then(res => {
        res = res.data
        if (res.success) {
          this.caseData = res.data
        }
      })
    },
    async _getDiaryListById(id) {
      await axios.get(`/api/diary/${id}`).then(res => {
        res = res.data
        if (res.success) {
          this.diaryData = this._genDiary(res.data)
          console.log(this.diaryData)
        }
      })
    },
    _genDiary(arr) {
      arr = arr.map(item => {
        if (item.article) {
          item.text = removeHTMLTag(item.article)
          item.images = getImgSrc(item.article)
        }
        return item
      })
      return arr
    }
  },
  watch: {
    scrollY(newVal) {
      const height = this.$refs.caseProject.clientHeight
      const winHeight = window.innerHeight
      if (Math.abs(newVal) > height) {
        this.$refs.layer.show()
      } else {
        this.$refs.layer.hide()
      }
      Math.abs(newVal) > winHeight ? this.$refs.fixRight.show() : this.$refs.fixRight.hide()
    }
  },
  components: {
    navBar,
    Scroll,
    Layer,
    fixRight
  },
  async created() {
    this.probeType = 3
    await this._getCaseListById(this.$route.params.id)
    await this._getDiaryListById(this.$route.params.id)
    setTimeout(() => {
      this.$refs.caseListScroll.refresh()
    }, 20)
  }
}
</script>
<style lang="scss" scoped>
.case-list {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: #f3f7f7;
    z-index: 250;
    .moveInTop-enter-active,
    .moveInTop-leave-active {
        transition: all 0.3s linear;
    }
    .moveInTop-enter,
    .moveInTop-leave-to {
        transform: translate3d(0,-100%,0);
    }
    .case-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .case-project {
            padding: 15px 15px 10px;
            background: #fff;
            .case-top {
                display: flex;
                align-items: center;
                .head-img {
                    flex: 0 0 40px;
                    width: 40px;
                    height: 40px;
                    img {
                        border-radius: 50%;
                    }
                }
                .head-name {
                    font-size: 14px;
                    margin-left: 5px;
                    color: #777;
                    flex: 1;
                }
            }
            .case-project-detail {
                display: flex;
                background: #f8f8f8;
                padding: 15px 10px;
                align-items: center;
                margin: 10px 0;
                .cover-img {
                    flex: 0 0 70px;
                    width: 70px;
                    height: 70px;
                    border-radius: 5px;
                }
                .project-desc {
                    flex: 1;
                    margin-left: 10px;
                    .title {
                        font-size: 14px;
                        line-height: 18px;
                        color: #333;
                    }
                    .price {
                        margin-top: 5px;
                        font-size: 0;
                        .now-price {
                            display: inline-block;
                            vertical-align: bottom;
                            font-size: 16px;
                            color: #ff527f;
                        }
                        .or-price {
                            display: inline-block;
                            vertical-align: bottom;
                            font-size: 12px;
                            margin-left: 5px;
                            color: #b8b8b8;
                            text-decoration: line-through;
                        }
                    }
                }
            }
            .tags {
                .tag-name {
                    display: inline-block;
                    height: 24px;
                    padding: 0 10px;
                    color: #666;
                    font-size: 12px;
                    background: #E8F8F5;
                    text-align: center;
                    line-height: 24px;
                    border-radius: 5px;
                    margin-right: 5px;
                    margin-top: 5px;
                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }
        .case-before {
            background: #fff;
            margin-top: 15px;
            .before-title {
                padding: 15px 0 10px;
                .title {
                    padding: 0 15px 0 12px;
                    border-radius: 0 10px 10px 0;
                    background: #ff5c77;
                    font-size: 14px;
                    color: #fff;
                    height: 20px;
                    line-height: 20px;
                    display: inline-block;
                }
            }
            .before-imgs {
                padding: 0 15px 15px;
                overflow: hidden;
                ul {
                    display: flex;
                    .before-item {
                        flex: 0 0 23.5%;
                        width: 23.5%;
                        margin-right: 10px;
                    }
                }
            }
        }
        .sections-title {
            background: #fff;
            box-sizing: border-box;
            padding: 0 15px;
            border-bottom: 1px solid #e5e5e5;
            margin-top: 15px;
            font-size: 0;
            .icon-comiisfariji {
                display: inline-block;
                font-size: 18px;
                vertical-align: middle;
                color: #777;
            }
            .text {
                display: inline-block;
                font-size: 16px;
                height: 44px;
                line-height: 44px;
                color: #777;
                vertical-align: middle;
                margin-left: 5px;
            }
        }
        .case-sections {
            ul {
                .section-item {
                    background: #fff;
                    margin-bottom: 15px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .section-page {
                        padding: 15px 0 10px;
                        .text {
                            padding: 0 15px 0 12px;
                            border-radius: 0 10px 10px 0;
                            background: #ff5c77;
                            font-size: 14px;
                            color: #fff;
                            height: 20px;
                            line-height: 20px;
                            display: inline-block;
                        }
                    }
                    .section-imgs {
                        padding: 0 15px 15px;
                        overflow: hidden;
                        ul {
                            display: flex;
                            flex-wrap: wrap;
                            .img-item {
                                flex: 0 0 32.5%;
                                width: 32.5%;
                                margin: 0 1.25% 1.25% 0;
                                &:nth-child(3n+0) {
                                    margin-right: 0;
                                }
                            }
                        }
                    }
                    .section-text {
                        padding: 0 15px 15px;
                        color: #333;
                        font-size: 14px;
                        line-height: 20px;
                        p {
                            color: #333;
                            font-size: 14px;
                            line-height: 20px;
                        }
                    }
                }
            }
        }
    }
}
</style>
