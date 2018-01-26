<template>
  <div class="project">
    <project-list class="project-list"></project-list>
    <transition name="moveInLeft">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import ProjectList from '@/components/projectList/projectList'

export default {
  components: {
    ProjectList
  }
}
</script>
<style lang="scss" scoped>
.project {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 50px;
  width: 100%;
  .moveInLeft-enter-active,
  .moveInLeft-leave-active {
    transition: all 0.3s linear;
  }
  .moveInLeft-enter,
  .moveInLeft-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .project-list {
    height: 100%;
    overflow: hidden;
  }
}
</style>
