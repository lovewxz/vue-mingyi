<template>
<div class="case" ref="case">
  <scroll ref="scroll" :data="cases" class="case-content" :pullUp="pullUp" @scrollEnd="scrollToEnd">
    <ul>
      <li v-for="item in cases" class="case-item" @click="goUrl(item)">
        <case-content :pcase="item"></case-content>
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
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import caseContent from '@/components/caseContent/caseContent'

export default {
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
    goUrl(item) {
      this.$router.push(`/case/list/${item._id}`)
    },
    scrollToEnd() {
      if (!this.hasMore) {
        return
      }
      this.page = this.page + 1
      this.$store.dispatch('getPcaseList', { limit: this.limit, page: this.page }).then(res => {
        res = res.data
        if (res.success) {
          this.cases = this.cases.concat(res.data.list)
          this._checkMore(this.cases)
        }
      })
    },
    _getCases() {
      this.$store.dispatch('getPcaseList', { limit: this.limit, page: this.page }).then(res => {
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
  created() {
    this._getCases()
  },
  components: {
    Scroll,
    Loading,
    caseContent
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
