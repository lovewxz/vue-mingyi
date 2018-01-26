<template lang="html">
  <div class="bind-tel">
    <div class="bind-left">
      <span class="iconfont icon-shouji"></span>
      <span class="text">找不到订单?绑定手机号试试</span>
    </div>
    <div class="bind-right">
      <div class="bind-btn">立即绑定</div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.bind-tel {
  padding: 7px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  .bind-right {
    flex: 0 0 55px;
    width: 55px;
    height: 18px;
    line-height: 18px;
    border: 1px solid #1dc5c3;
    text-align: center;
    .bind-btn {
      font-size: 12px;
      color: #1dc5c3;
    }
  }
  .bind-left {
    flex: 1;
    font-size: 0px;
    .icon-shouji {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      margin-right: 5px;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
    }
  }
}
</style>
