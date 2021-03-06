<template>
  <transition name="moveInLeft">
    <div class="doctor-detail">
      <div class="doctor-top">
        <div class="doctor-avatar">
          <div class="doctor-avatar-img">
            <img :src="`${imgCDN}/${doctor.avatar}`">
          </div>
        </div>
        <h1 class="name">{{doctor.realname}}</h1>
        <p class="job-title">{{doctor.title}}</p>
        <div class="subscribe">
          <p class="sub-btn"
             @click="favor">{{isFavor ? "已关注" : "关注"}}</p>
        </div>
        <div class="doctor-other">
          <p class="other-item">案例 21</p>
          <p class="other-item">项目 63</p>
        </div>
      </div>
      <div class="doctor-profile">
        <div class="doctor-profile-title">
          <i class="iconfont icon-doctor"></i>
          <span class="text">医生资料</span>
        </div>
        <div class="doctor-profile-arrow">
          <i class="iconfont icon-arrow-right"></i>
        </div>
      </div>
      <div class="doctor-project"
           v-show="projects.length > 0">
        <h2>热门预约</h2>
        <div class="doctor-project-detail">
          <ul>
            <li class="doctor-project-item"
                v-for="item in projects"
                :key="item._id"
                @click="goProject(item)">
              <project-content :project="item"></project-content>
            </li>
          </ul>
        </div>
      </div>
      <div class="doctor-case"
           v-show="pcases.length > 0">
        <h2>热门案例</h2>
        <div class="doctor-case-detail">
          <ul>
            <li class="doctor-case-item"
                v-for="item in pcases"
                :key="item._id"
                @click="goPcase(item)">
              <case-content :pcase="item"></case-content>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import ProjectContent from '@/components/projectContent/projectContent'
import CaseContent from '@/components/caseContent/caseContent'
import config from '@/config'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      doctor: {},
      projects: [],
      pcases: [],
      favorStatus: false
    }
  },
  computed: {
    isFavor() {
      if (!this.favorDoctor || this.favorDoctor.length === 0) {
        this.favorStatus = false
        return false
      }
      let favorArr = this.favorDoctor
      const index = favorArr.findIndex(item => {
        return item === this.$route.params.id
      })
      this.favorStatus = index > -1
      return index > -1
    },
    ...mapGetters(['favorDoctor', 'user'])
  },
  methods: {
    favor() {
      const { name } = this.$route
      if (!this.user) {
        this.$router.push({
          name: 'login',
          query: { visit: name, id: this.doctor._id }
        })
        return
      }
      this.favorStatus = !this.favorStatus
      if (this.favorStatus) {
        this.$store.dispatch('setFavorDoctorAction', this.doctor._id)
      } else {
        this.$store.dispatch('cancelFavorDoctorAction', this.doctor._id)
      }
    },
    goProject(item) {
      this.$router.push(`/project/${item._id}`)
    },
    goPcase(item) {
      this.$router.push(`/case/list/${item._id}`)
    },
    getDoctorProfile() {
      this.imgCDN = config.imgCDN
      const { id } = this.$route.params
      if (!id) {
        this.$router.back()
      }
      const params = {
        limit: 3,
        page: 1,
        id
      }
      this.$store.dispatch('getDoctorDetail', id).then(res => {
        res = res.data
        if (res.success) {
          this.doctor = res.data
        }
      })
      this.$store.dispatch('getProjectByDoctorId', params).then(res => {
        res = res.data
        if (res.success) {
          this.projects = res.data
        }
      })
      this.$store.dispatch('getPcaseByDoctorId', params).then(res => {
        res = res.data
        if (res.success) {
          this.pcases = res.data
        }
      })
    }
  },
  created() {
    this.getDoctorProfile()
  },
  watch: {
    $route(to, from) {
      const reg = /\/doctor\//
      if (reg.test(to.path)) {
        this.getDoctorProfile()
      }
    }
  },
  components: {
    ProjectContent,
    CaseContent
  }
}
</script>
<style lang="scss" scoped>
.doctor-detail {
  background: #f3f7f7;
  z-index: 500;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: auto;
  &.moveInLeft-enter-active,
  &.moveInLeft-leave-active {
    transition: all 0.3s linear;
  }
  &.moveInLeft-enter,
  &.moveInLeft-leave-to {
    transform: translate3d(-100%, 0, 0);
  }
  .doctor-top {
    background: url('./bg_expert.jpg') no-repeat center;
    background-size: cover;
    overflow: hidden;
    text-align: center;
    .doctor-avatar {
      margin: 40px auto 10px;
      .doctor-avatar-img {
        margin: 0 auto;
        img {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          border: 3px solid #fff;
        }
      }
    }
    .name {
      font-size: 16px;
      font-weight: 900;
      color: #fff;
    }
    .job-title {
      margin: 8px 0;
      font-size: 12px;
      color: #fff;
    }
    .subscribe {
      width: 100%;
      margin: 8px 0;
      height: 30px;
      .sub-btn {
        width: 90px;
        height: 100%;
        line-height: 30px;
        border: 1px solid #fff;
        border-radius: 5px;
        color: #fff;
        text-align: center;
        font-size: 14px;
        margin: 0 auto;
      }
    }
    .doctor-other {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px auto 10px;
      .other-item {
        padding: 5px;
        flex: 1;
        color: #fff;
        font-size: 14px;
        &:nth-child(1) {
          border-right: 1px solid #fff;
        }
      }
    }
  }
  .doctor-profile {
    height: 40px;
    line-height: 41px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    background: #fff;
    .doctor-profile-title {
      font-size: 0px;
      .icon-doctor {
        color: #222;
        font-size: 18px;
        display: inline-block;
        vertical-align: middle;
      }
      .text {
        font-size: 14px;
        display: inline-block;
        vertical-align: middle;
        color: #666;
      }
    }
    .doctor-profile-arrow {
      color: #999;
    }
  }
  .doctor-project {
    background: #fff;
    box-sizing: border-box;
    margin-top: 10px;
    padding-bottom: 15px;
    h2 {
      margin: 0 15px;
      font-size: 14px;
      color: #666;
      height: 40px;
      line-height: 41px;
      border-bottom: 1px solid #e5e5e5;
    }
    .doctor-project-detail {
      .doctor-project-item {
        padding: 15px 15px 0 15px;
      }
    }
  }
  .doctor-case {
    background: #fff;
    box-sizing: border-box;
    margin-top: 10px;
    padding-bottom: 15px;
    h2 {
      margin: 0 15px;
      font-size: 14px;
      color: #666;
      height: 40px;
      line-height: 41px;
      border-bottom: 1px solid #e5e5e5;
    }
    .doctor-case-detail {
      .doctor-case-item {
        padding: 15px 15px 0 15px;
      }
    }
  }
}
</style>
