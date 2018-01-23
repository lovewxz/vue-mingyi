<template lang="html">
  <div class="project-list">
    <scroll :data="projects" class="project-wrapper" :pullUp="pullUp" @scrollEnd="scrollToEnd" ref="project">
      <ul>
        <li v-for="item in projects" class="project-item" :key="item._id" @click="goUrl(item)">
          <project-content :project="item"></project-content>
        </li>
        <div class="loading-wrapper">
          <loading title="" v-show="hasMore"></loading>
        </div>
      </ul>
    </scroll>
  </div>
</template>

<script>
import { cdnUrlMixin } from '@/common/js/mixin'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import ProjectContent from '@/components/projectContent/projectContent'

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
    _getProjectList(limit, page) {
      this.$store.dispatch('getProjectList', { limit: this.limit, page: this.page }).then(res => {
        res = res.data
        if (res.success) {
          this.projects = this.projects.concat(res.data.list)
          this.total = res.data.total
          this._checkMore(this.projects)
        }
      })
    },
    refresh() {
      setTimeout(() => {
        this.$refs.project.refresh()
      }, 20)
    }
  },
  created() {
    this._getProjectList(this.limit, this.page)
  },
  components: {
    Scroll,
    Loading,
    ProjectContent
  }
}
</script>

<style lang="scss">
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
