<template>
<div class="case-article">
  <scroll :listen-scroll="listenScroll" @scroll="scroll" :probe-type="probeType" class="case-section" ref="caseScroll">
    <div>
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
        <router-link :to="`/case/list/${caseData._id}`">
          <div class="belong-case">
            <div class="belong-left">
              <i class="iconfont icon-comiisfariji"></i>
              <span class="belong-text">查看所属日记本</span>
            </div>
            <div class="belong-right">
              <i class="iconfont icon-left"></i>
            </div>
          </div>
        </router-link>
      </div>
      <div class="case-sections">
        <div class="section-item">
          <div class="section-page">
            <h3 class="text">{{casePost.title}}</h3>
          </div>
          <div class="section-text" v-html="casePost.article" ref="sectionTxt"></div>
        </div>
      </div>
    </div>
  </scroll>
  <layer :case-data="caseData" ref="layer"></layer>
  <fix-right @back="back" @backTop="backTop" ref="fixRight"></fix-right>
</div>
</template>
<script>
import axios from 'axios'
import Scroll from '@/base/scroll/scroll'
import Layer from '@/base/layer/layer'
import { cdnUrlMixin, wxInit } from '@/common/js/mixin'
import { transArticle } from '@/common/js/util'
import FixRight from '@/base/fixRight/fixRight'

export default {
  mixins: [cdnUrlMixin, wxInit],
  data() {
    return {
      caseData: {},
      listenScroll: true,
      scrollY: -1,
      casePost: {},
      caseArticle: ''
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
    scroll(pos) {
      this.scrollY = pos.y
    },
    trans(data) {
      return transArticle(data)
    },
    back() {
      this.$router.back()
    },
    backTop() {
      this.$refs.caseScroll.scrollTo(0, 0, 300)
    },
    async _getCaseListById(id) {
      await axios.get(`/api/cases/list/${id}`).then(res => {
        res = res.data
        if (res.success) {
          this.caseData = res.data
        }
      })
    },
    async _getDiaryById(id) {
      await axios.get(`/api/diary/id/${id}`).then(res => {
        res = res.data
        if (res.success) {
          this.casePost = res.data
          this.casePost.article = transArticle(this.casePost.article)
        }
      })
    },
    _onloadImg(imgs) {
      let len = imgs.length
      Array.from(imgs).forEach(img => {
        const src = img.src
        img.src = ''
        img.onload = () => {
          len--
          if (len === 0) {
            this.$refs.caseScroll.refresh()
          }
        }
        img.src = src
      })
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
  async created() {
    this.probeType = 3
    await this._getCaseListById(this.$route.params.id)
    await this._getDiaryById(this.$route.params.artId)
    setTimeout(() => {
      this.$refs.caseScroll.refresh()
    }, 20)
    this._onloadImg(this.$refs.sectionTxt.querySelectorAll('img'))
    console.log(window.location.href.split('#')[0])
    const url = encodeURIComponent(window.location.href.split('#')[0])
    this.wxInit(url)
    window.wx.onMenuShareAppMessage({
      title: this.caseData.user_name,
      desc: this.caseData.project.title,
      link: window.location.href,
      imgUrl: encodeURIComponent(this.cdnName(this.caseData.project.cover_image, 140)),
      success: function() {
        window.alert('分享成功')
      }
    })
  },
  components: {
    Scroll,
    Layer,
    FixRight
  }
}
</script>
<style lang="scss">
.case-article {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #f3f7f7;
    z-index: 300;
    .case-section {
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
                padding-bottom: 12px;
                border-bottom: 1px solid #e5e5e5;
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
            .belong-case {
                display: flex;
                justify-content: space-between;
                box-sizing: border-box;
                padding-top: 12px;
                .belong-left {
                    font-size: 0;
                    .icon-comiisfariji {
                        color: #777;
                        display: inline-block;
                        vertical-align: middle;
                        font-size: 16px;
                    }
                    .belong-text {
                        font-size: 14px;
                        display: inline-block;
                        vertical-align: middle;
                        margin-left: 5px;
                        color: #333;
                    }
                }
                .belong-right {
                    .icon-left {
                        font-size: 16px;
                        color: #777;
                        display: inline-block;
                        transform: rotate(180deg);
                    }
                }
            }
        }
        .case-sections {
            margin-top: 15px;
            .section-item {
                background: #fff;
                margin-bottom: 15px;
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
                .section-text {
                    padding: 0 15px 15px;
                    color: #333;
                    font-size: 14px;
                    line-height: 20px;
                    img {
                        // width: 300px;
                        // height: 300px;
                        margin: 5px auto;
                        display: block;
                    }
                }
            }
        }
    }
}
</style>
