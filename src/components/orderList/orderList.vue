<template lang="html">
  <transition name="moveInLeft">
    <div class="order-list">
      <ul class="order-tab">
        <router-link :to="{ name: 'order-all' }" tag="li">
          <p>全部订单</p>
        </router-link>
        <router-link :to="{ name: 'order-nonpaid' }" tag="li">
          <p>待付款</p>
        </router-link>
        <router-link :to="{ name: 'order-paid' }" tag="li">
          <p>已付款</p>
        </router-link>
        <router-link :to="{ name: 'order-refund' }" tag="li">
          <p>退款</p>
        </router-link>
      </ul>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
  .order-list {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 400;
    background: #e5e5e5;
    &.moveInLeft-enter-active,
    &.moveInLeft-leave-active {
      transition: all 0.3s linear;
    }
    &.moveInLeft-enter,
    &.moveInLeft-leave-to {
      transform: translate3d(100%,0,0);
    }
    .order-tab {
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      background: #f5f5f5;
      li {
        &.router-link-active {
          border-bottom: 2px solid #ff5777;
          p {
            color: #ff5777;
          }
        }
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        height: 40px;
        line-height: 40px;
        p {
          font-size: 14px;
          color: #555;
        }
      }
    }
  }
</style>
