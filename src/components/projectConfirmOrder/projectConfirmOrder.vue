<template lang="html">
  <div class="project-confirm">
    <div class="confirm-title">
      <h1>确认订单</h1>
    </div>
    <div class="order-detail">
      <div class="order-pic">
        <img :src="cdnName(confirmInfo.coverImg, 200)" alt="">
      </div>
      <div class="order-project">
        <h1 class="order-title">{{confirmInfo.title}}</h1>
        <div class="order-desc">
          <span class="order-type">{{confirmInfo.type}}:</span>
          <span class="order-price">¥{{confirmInfo.singlePrice}}</span>
        </div>
      </div>
    </div>
    <div class="order-other">
      <ul>
        <li @click="inputFocus('inputName')">
          <span class="order-left">您的姓名</span>
          <span class="order-right">
            <input type="text" ref="inputName">
          </span>
        </li>
        <li @click="inputFocus('inputTel')">
          <span class="order-left">联系方式</span>
          <span class="order-right">
            <input type="text" ref="inputTel">
          </span>
        </li>
        <li>
          <span class="order-left">预订数量</span>
          <span class="order-right">
            <plus class="operate" @getNum="getNum" :num="confirmInfo.num"></plus>
          </span>
        </li>
        <li>
          <span class="order-left">支付总金额</span>
          <span class="order-right-price">¥{{totalPrice}}</span>
        </li>
      </ul>
    </div>
    <div class="order-bottom">
      <div class="order-left">
        <p class="bottom-price">
          <span>{{confirmInfo.type}}:</span>
          <span class="color">¥{{totalPrice}}</span>
        </p>
        <p v-if="confirmInfo.type === '支付订金'" class="bottom-other">
          <span>到院再付:</span>
          <span>¥{{restPay}}</span>
        </p>
      </div>
      <div class="order-right" @click.stop="confirmOrder">
        <p>提交订单</p>
      </div>
    </div>
    <confirm :text="confirmText" ref="confirmBox"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import { cdnUrlMixin } from '@/common/js/mixin'
import plus from '@/base/plus/plus'
import confirm from '@/base/confirm/confirm'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [ cdnUrlMixin ],
  data() {
    return {
      confirmInfo: {},
      confirmText: ''
    }
  },
  computed: {
    totalPrice() {
      return this.confirmInfo.singlePrice * this.confirmInfo.num
    },
    restPay() {
      return (parseInt(this.confirmInfo.price) - parseInt(this.confirmInfo.singlePrice)) * parseInt(this.confirmInfo.num)
    },
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    getNum(num) {
      this.confirmInfo.num = num
    },
    inputFocus(type) {
      this.$refs[type].focus()
    },
    async confirmOrder() {
      const name = this.$refs.inputName.value
      const phone = this.$refs.inputTel.value
      const phoneReg = /^1[0-9]{10}$/
      if (!name) {
        this.confirmText = '姓名未填写'
        this.$nextTick(() => {
          this.$refs.confirmBox.show()
        })
        return
      }
      if (!phoneReg.test(phone)) {
        this.confirmText = '手机格式错误'
        this.$nextTick(() => {
          this.$refs.confirmBox.show()
        })
        return
      }
      const params = Object.assign({}, {user: this.user}, {
        name: name,
        phoneNumber: phone,
        projectId: this.confirmInfo.projectId,
        num: parseInt(this.confirmInfo.num),
        payType: this.confirmInfo.type
      })
      const { data } = await this.saveProjectOrder(params)
      if (!data.success) {
        this.confirmText = '订单保存错误'
        this.$nextTick(() => {
          this.$refs.confirmBox.show()
        })
        return
      }
      this.$router.replace({ name: 'project-pay', params: { totalPrice: data.data.totalFee, projectId: data.data.project } })
    },
    ...mapActions([
      'saveProjectOrder'
    ])
  },
  created() {
    if (!this.$route.params.coverImg) {
      this.$router.back()
    }
    this.confirmInfo = Object.assign({}, this.$route.params)
  },
  components: {
    plus,
    confirm
  }
}
</script>

<style lang="scss" scoped>
.project-confirm {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 350;
  background: #f7f7f7;
  .confirm-title {
    width: 100%;
    background: #1dc5c3;
    text-align: center;
    height: 40px;
    h1 {
      font-size: 18px;
      line-height: 40px;
      color: #fff;
    }
  }
  .order-detail {
    display: flex;
    align-items: center;
    padding: 15px;
    box-sizing: border-box;
    background: #fff;
    position: relative;
    margin-top: 10px;
    .order-pic {
      flex: 0 0 100px;
      height: 100px;
      margin-right: 15px;
      img {
        border-radius: 5px;
      }
    }
    .order-project {
      .order-title {
        font-size: 16px;
        line-height: 20px;
      }
      .order-desc {
        font-size: 0px;
        margin-top: 15px;
        .order-type {
          font-size: 14px;
          color: #777;
        }
        .order-price {
          font-size: 14px;
          color: #FF527F;
          margin-left: 4px;
        }
      }
    }
  }
  .order-other {
    background: #fff;
    margin-top: 15px;
    ul {
      padding: 0 15px;
      li {
        display: flex;
        justify-content: space-between;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #F0F0F0;
        &:last-child {
          border-bottom: none;
        }
        .order-left {
          font-size: 14px
        }
        .order-right-price {
          font-size: 16px;
          color: #FF527F;
        }
        .order-right {
          flex: 1;
          margin-left: 30px;
          position: relative;
          input {
            width: 100%;
            height: 40px;
            text-align: right;
            font-size: 16px;
          }
          .operate {
            position: absolute;
            right: 0px;
            top: 0;
          }
        }
      }
    }
  }
  .order-bottom {
    width: 100%;
    height: 45px;
    background-color: #fff;
    border-top: 1px solid #ececec;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 320;
    display: flex;
    .order-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 15px;
      .bottom-price {
        font-size: 14px;
        color: #4a4a4a;
        line-height: 1.3;
        .color {
          color: #ff527f;
        }
      }
      .bottom-other {
        font-size: 12px;
        color: #979797;
        line-height: 1.3;
      }
    }
    .order-right {
      width: 90px;
      height: 100%;
      flex: 0 0 90px;
      background: #ff5c77;
      p {
        font-size: 16px;
        line-height: 45px;
        color: #fff;
        font-weight: 200;
        text-align: center;
      }
    }
  }
}
</style>
