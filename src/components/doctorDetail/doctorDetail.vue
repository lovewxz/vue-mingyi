<template>
  <div class="doctor">
    <div class="doctor-top">
      <div class="doctor-avatar">
        <div class="doctor-avatar-img">
          <img :src="require('./test.jpg')" alt="">
        </div>
      </div>
      <h1 class="name">李奇军</h1>
      <p class="job-title">主任医师</p>
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
      <div class="project-detail">
        <ul>
          <li class="project-item">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Project from '@/components/projectContent/projectContent'

export default {
  components: {
    Project
  }
}
</script>
<style lang="scss">
.doctor {
  background: #f3f7f7;
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
    height: 40px;
    line-height: 41px;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 15px;
    box-sizing: border-box;
    margin-top: 10px;
    h2 {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
