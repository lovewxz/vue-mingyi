<template lang="html">
  <div class="order-detail">
    <scroll ref="scroll" :data="orders" class="order-wrapper" :pullUp="pullUp" @scrollEnd="scrollToEnd">
      <ul>
        <li v-for="order in orders">
          <order-item :order="order"></order-item>
        </li>
        <div class="loading-wrapper">
          <loading title="" v-show="hasMore"></loading>
        </div>
      </ul>
    </scroll>
  </div>
</template>

<script>
import OrderItem from '@/base/orderItem/orderItem'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'

export default {
  props: {
    limit: {
      type: Number,
      default: 10
    },
    page: {
      type: Number,
      default: 1
    },
    success: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      orders: [],
      pullUp: true,
      hasMore: true,
      total: 0
    }
  },
  methods: {
    async scrollToEnd() {
      if (!this.hasMore) {
        return
      }
      this.page = this.page + 1
      await this._getPayments(this.limit, this.page)
    },
    async _getPayments(limit, page) {
      await this.$store
        .dispatch('getPaymentList', { limit, page, success: this.success })
        .then(res => {
          res = res.data
          if (res.success) {
            this.orders = this.orders.concat(res.data.list)
            this.total = res.data.total
            this._checkMore(this.orders)
          }
        })
    },
    _checkMore(data) {
      if (data.length >= this.total) {
        this.hasMore = false
      }
    }
  },
  async created() {
    await this._getPayments(this.limit, this.page)
  },
  components: {
    OrderItem,
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  position: fixed;
  top: 42px;
  bottom: 0;
  left: 0;
  right: 0;
  .order-wrapper {
    height: 100%;
    overflow: hidden;
    ul {
      position: relative;
      overflow: hidden;
      li {
        margin-top: 10px;
        padding: 0 10px;
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
