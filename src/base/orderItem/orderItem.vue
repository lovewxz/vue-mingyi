<template lang="html">
  <div class="order-project">
    <div class="order-status">
      <h2>{{orderStauts}}</h2>
    </div>
    <div class="order-cate">
      <h1>订单编号:{{order._id}}</h1>
    </div>
    <div class="order-item">
      <div class="order-left">
        <img :src="cdnThumbnail(order.project.cover_image[0], 200)" alt="">
      </div>
      <div class="order-right">
        <p class="order-title">{{order.project.title}}</p>
        <p class="order-desc">支付方式：{{order.payType}}</p>
      </div>
      <div class="order-price">
        <p class="orgin-price">¥{{order.project.original_price}}</p>
        <p class="now-price">¥{{order.project.price}}</p>
        <p class="num">x{{order.num}}</p>
      </div>
    </div>
    <div class="order-total-price">
      <p>合计<span class="total-price">¥{{order.totalFee}}</span></p>
    </div>
  </div>
</template>

<script>
import { cdnUrlMixin } from '@/common/js/mixin'
import config from '@/config'

export default {
  mixins: [cdnUrlMixin],
  props: {
    order: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    orderStauts() {
      if (!this.order._id) {
        return
      }
      const success = this.order.success.toString()
      let orderStatusTit = '出错了'
      for (let [key, value] of Object.entries(config.orderCode)) {
        if (success === key) {
          orderStatusTit = value
        }
      }
      return orderStatusTit
    }
  }
}
</script>

<style lang="scss" scoped>
.order-project {
  background: #fff;
  .order-status {
    height: 30px;
    background: #f5f5f5;
    h2 {
      font-size: 14px;
      color: #ff5777;
      line-height: 30px;
      margin-left: 10px;
    }
  }
  .order-cate {
    height: 40px;
    h1 {
      font-size: 14px;
      line-height: 40px;
      color: #333;
      margin-left: 10px;
    }
  }
  .order-item {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    .order-left {
      flex: 0 0 100px;
      width: 100px;
    }
    .order-right {
      margin: 4px 10px 0 10px;
      .order-title {
        font-size: 12px;
        line-height: 16px;
        color: #333;
      }
      .order-desc {
        font-size: 12px;
        line-height: 16px;
        margin-top: 4px;
        color: #999;
      }
    }
    .order-price {
      margin-top: 4px;
      text-align: right;
      .orgin-price {
        font-size: 14px;
        line-height: 1;
        color: #999;
        text-decoration: line-through;
      }
      .now-price {
        font-size: 14px;
        line-height: 18px;
        color: #333;
      }
      .num {
        font-size: 14px;
        line-height: 1;
        color: #999;
        text-align: right;
      }
    }
  }
  .order-total-price {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    padding: 0 10px;
    text-align: right;
    .total-price {
      font-size: 16px;
      color: #ff5777;
      margin-left: 4px;
    }
  }
}
</style>
