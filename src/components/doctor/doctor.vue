<template lang="html">
  <div class="doctor-tab">
    <doctor-list class="doctor-list"></doctor-list>
    <router-view></router-view>
  </div>
</template>

<script>
import DoctorList from '@/components/doctorList/doctorList'

export default {
  components: {
    DoctorList
  }
}
</script>

<style lang="scss">
.doctor-tab {
  position: absolute;
  top: 0;
  bottom: 50px;
  left: 0;
  right: 0;
  z-index: 100;
  .doctor-list {
    height: 100%;
    overflow: hidden;
  }
}
</style>
