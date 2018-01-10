<template>
  <div class="doctor">
    <div class="doctor-top">
      <div class="doctor-avatar">
        <div class="doctor-avatar-img">
          <img :src="`${imgCDN}/${doctor.avatar}`">
        </div>
      </div>
      <h1 class="name">{{doctor.realname}}</h1>
      <p class="job-title">{{doctor.title}}</p>
      <div class="subscribe">
        <p class="sub-btn">关注</p>
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
    <div class="doctor-project">
      <h2>热门预约</h2>
      <div class="doctor-project-detail">
        <ul>
          <li class="doctor-project-item" v-for="item in projects" :key="item._id">
            <project-content :project="item"></project-content>
          </li>
        </ul>
      </div>
    </div>
    <div class="doctor-case">
      <h2>热门案例</h2>
      <div class="doctor-case-detail">
        <ul>
          <li class="doctor-case-item" v-for="item in projects" :key="item._id">
            <project-content :project="item"></project-content>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectContent from '@/components/projectContent/projectContent'
import config from '@/config'

export default {
  data() {
    return {
      doctor: {},
      projects: [],
      pcases: []
    }
  },
  created() {
    this.imgCDN = config.imgCDN
    const { id } = this.$route.params
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
      console.log(res.data)
    })
  },
  components: {
    ProjectContent
  }
}
</script>
<style lang="scss" scoped>
.doctor {
  background: #f3f7f7;
  z-index: 500;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
    h2 {
      margin: 0 15px;
      font-size: 14px;
      color: #666;
      height: 40px;
      line-height: 41px;
      border-bottom: 1px solid #e5e5e5;
    }
  }
}
</style>
