<template>
  <div class="profile">
    <div class="head-top">
      <img :src="headimgurl">
      <p class="name">{{nickname}}</p>
    </div>
    <div class="cut"></div>
    <bind-tel></bind-tel>
    <div class="cut"></div>
    <div class="my-order">
      <div class="order-title"
           @click="go('order-all')">
        <h3>我的订单</h3>
        <p>
          <span class="order-all">查看全部订单</span>
          <span class="iconfont icon-arrow-right"></span>
        </p>
      </div>
      <div class="order-detail">
        <ul>
          <li @click="go('order-nonpaid')">
            <i class="iconfont icon-daifukuan"></i>
            <p>待支付</p>
          </li>
          <li @click="go('order-paid')">
            <i class="iconfont icon-yifukuan"></i>
            <p>已支付</p>
          </li>
          <li @click="go('order-all')">
            <i class="iconfont icon-quanbudingdan"></i>
            <p>全部订单</p>
          </li>
          <li @click="go('favor')">
            <i class="iconfont icon-shoucang"></i>
            <p>我的收藏</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="cut"></div>
    <a href="tel:0755-82328320">
      <div class="contact-tel">
        <h3>联系电话</h3>
        <p>
          <span class="iconfont icon-arrow-right"></span>
        </p>
      </div>
    </a>
    <div class="cut"></div>
    <a href="tel:0755-82328320">
      <div class="contact-kefu border-bot">
        <h3>联系客服</h3>
        <p>
          <span class="iconfont icon-arrow-right"></span>
        </p>
      </div>
    </a>
    <div class="btn-logout"
         @click="confirmShow">退出登录</div>
    <div class="profile-logo">
      <img :src="require('@/common/images/logo.png')"
           alt="">
    </div>
    <confirm :text="confirmText"
             @confirm="logout"
             ref="confirmWrapper"></confirm>
  </div>
</template>
<script>
import bindTel from '@/base/bindTel/bindTel'
import { getUserStorage } from '@/common/js/cache'
import Confirm from '@/base/confirm/confirm'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      nickname: '默认用户',
      headimgurl: require('./avatar.jpg'),
      confirmText: ''
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      const userInfo = getUserStorage()
      if (userInfo) {
        this.nickname = userInfo.nickname
        this.headimgurl = userInfo.headimgurl
      } else {
        const { name } = this.$route
        this.$router.push(`/login?visit=${name}`)
      }
    },
    go(name) {
      this.$router.push({ name: name })
    },
    confirmShow() {
      this.confirmText = '确定要退出吗'
      this.$nextTick(() => {
        this.$refs.confirmWrapper.show()
      })
    },
    logout() {
      this.saveUser(null)
      this.$router.push('/')
    },
    ...mapActions(['saveUser'])
  },
  activated() {
    this.getUserInfo()
  },
  components: {
    bindTel,
    Confirm
  }
}
</script>
<style lang="scss" scoped>
.profile {
  position: absolute;
  width: 100%;
  bottom: 51px;
  top: 0;
  left: 0;
  right: 0;
  background: #f7f7f7;
  .head-top {
    padding: 20px 0 10px 0;
    text-align: center;
    background: #fff;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }
    .name {
      font-size: 14px;
      color: #000;
      margin-top: 5px;
    }
  }
  .cut {
    height: 10px;
    background: #f5f5f5;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }
  .my-order {
    background: #fff;
    .order-title {
      padding: 10px 10px 10px 0;
      margin-left: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e5e5;
      h3 {
        font-size: 14px;
        color: #333;
      }
      p {
        font-size: 0;
        .order-all {
          font-size: 12px;
          margin-right: 5px;
          vertical-align: middle;
          display: inline-block;
          color: #b5b5b5;
        }
        .icon-arrow-right {
          font-size: 12px;
          vertical-align: middle;
          display: inline-block;
          color: #b5b5b5;
        }
      }
    }
    .order-detail {
      ul {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        li {
          display: flex;
          flex: 1;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          i {
            font-size: 20px;
            color: #333;
          }
          p {
            font-size: 12px;
            margin-top: 5px;
            color: #333;
          }
        }
      }
    }
  }
  .contact-tel,
  .contact-kefu {
    background: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.border-bot {
      border-bottom: 1px solid #e5e5e5;
    }
    h3 {
      font-size: 14px;
      color: #333;
    }
    p {
      font-size: 0;
      .icon-arrow-right {
        font-size: 12px;
        vertical-align: middle;
        display: inline-block;
        color: #b5b5b5;
      }
    }
  }
  .btn-logout {
    width: 60%;
    margin: 50px auto 0;
    background: #4cbbb4;
    color: #fff;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 0 0 5px #4cbbb4;
  }
  .profile-logo {
    width: 60%;
    margin: 50px auto 0;
  }
}
</style>
