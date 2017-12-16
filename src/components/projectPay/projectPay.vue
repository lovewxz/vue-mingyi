<template lang="html">
  <div class="project-pay">
    <div class="totalFee">
      <span>合计:</span>
      <span class="color">¥{{totalFee}}</span>
    </div>
    <div class="pay-type">
      <div class="pay-select">
        <p>支付方式</p>
      </div>
      <div class="pay-item">
        <div class="item-left">
          <span class="pay-logo"><img src="./wxlogo.png" alt=""></span>
          <span class="pay-text">微信支付</span>
        </div>
        <div class="item-right">
          <img src="./icon_yes.png" alt="">
        </div>
      </div>
    </div>
    <div class="tip">订单已经生成，请尽快支付</div>
    <div class="pay-btn" @click="pay">确认支付</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { getStorage } from '@/common/js/cache'

export default {
  data() {
    return {
      totalFee: 0,
      projectId: ''
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    const { payment } = this.$route.query
    this.getPayment({ payment }).then(res => {
      res = res.data
      if (res.success) {
        this.totalFee = res.data.totalFee
        this.projectId = res.data.project
      }
    })
  },
  methods: {
    async pay() {
      const storageUser = getStorage('user')
      const params = {
        totalFee: this.totalFee,
        projectId: this.projectId,
        user: this.user || storageUser
      }
      let res = await this.wechatPay(params)
      res = res.data
      console.log(res.data)
      /* eslint-disable no-undef */
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          appId: res.data.appId,
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign
        },
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {}
        }
      )
    },
    ...mapActions([
      'wechatPay',
      'getPayment'
    ])
  }
}
</script>

<style lang="scss">
.project-pay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 500;
    background: #f7f7f7;
    .totalFee {
        padding: 15px;
        background: #fff;
        font-size: 16px;
        .color {
            color: #ff527f;
            font-weight: 900;
        }
    }
    .pay-type {
        background: #fff;
        margin-top: 15px;
        font-size: 16px;
        .pay-select {
            padding: 15px;
            border-bottom: 1px solid #ddd;
        }
        .pay-item {
            padding: 15px;
            display: flex;
            justify-content: space-between;
            .item-left {
                font-size: 0;
                .pay-logo {
                    width: 25px;
                    height: 25px;
                    display: inline-block;
                    vertical-align: middle;
                }
                .pay-text {
                    font-size: 16px;
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 5px;
                }
            }
            .item-right {
                flex: 0 0 25px;
                width: 25px;
            }
        }
    }
    .tip {
        padding: 15px 0 15px 15px;
        color: #777;
    }
    .pay-btn {
        width: 80%;
        margin: 30px auto 0;
        background: #ff527f;
        color: #fff;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 5px;
    }
}
</style>
