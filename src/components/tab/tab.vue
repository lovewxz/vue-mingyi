<template>
  <div class="tab">
    <router-link to="/case" tag="li" class="tab-item">
      <i class="icon iconfont icon-comiisfariji"></i>
      <span class="tab-name">日记</span>
    </router-link>
    <router-link to="/project" tag="li" class="tab-item">
      <i class="icon iconfont icon-qianggou"></i>
      <span class="tab-name">抢购</span>
    </router-link>
    <router-link to="/doctor" tag="li" class="tab-item">
      <i class="icon iconfont icon-yishengzhuanhuan"></i>
      <span class="tab-name">医生</span>
    </router-link>
    <router-link to="/profile" tag="li" class="tab-item">
      <i class="icon iconfont icon-geren"></i>
      <span class="tab-name">我的</span>
    </router-link>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss">
@import "~@/common/scss/mixin";
  .tab {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-top: 1px solid rgba(0,0,0,.2);
    background: #fff;
    .tab-item {
      flex: 1;
      &.router-link-active {
        .icon {
          color: #1dc5c3;
        }
        .tab-name {
          color: #1dc5c3;
        }
      }
      .icon {
        display: block;
        margin-bottom: 3px;
        font-size: 18px;
        color: #555;
      }
      .tab-name {
        font-size: 12px;
        color: #555;
      }
    }
  }
</style>
