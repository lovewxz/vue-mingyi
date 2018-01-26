<template lang="html">
  <div class="favor-list">
    <nav-bar :title="title" @back="back"></nav-bar>
    <switches :switches="switches" class="switches" @switch="tab" :currentIndex="currentIndex"></switches>
    <div class="favor-content">
      <project-list class="project-list" v-show="currentIndex === 0" :isFavor="isFavor" ref="project"></project-list>
      <doctor-list class="doctor-list" v-show="currentIndex === 1" :isFavor="isFavor" ref="doctor"></doctor-list>
    </div>
  </div>
</template>

<script>
import Switches from '@/base/switches/switches'
import NavBar from '@/base/navBar/navBar'
import ProjectList from '@/components/projectList/projectList'
import DoctorList from '@/components/doctorList/doctorList'

export default {
  data() {
    return {
      title: '我的收藏',
      switches: [{ name: '项目列表' }, { name: '专家列表' }],
      currentIndex: 0,
      isFavor: true
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    tab(index) {
      this.currentIndex = index
      if (index === 0) {
        this.$refs.project && this.$refs.project.refresh()
      } else {
        this.$refs.doctor && this.$refs.doctor.refresh()
      }
    }
  },
  components: {
    Switches,
    NavBar,
    ProjectList,
    DoctorList
  }
}
</script>

<style lang="scss" scoped>
.favor-list {
  position: fixed;
  top: 0;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
  .switches {
    margin: 0px auto;
    padding: 10px 0;
  }
  .favor-content {
    position: absolute;
    width: 100%;
    top: 88px;
    left: 0;
    bottom: 0px;
    right: 0;
    .project-list {
      height: 100%;
      overflow: hidden;
    }
    .doctor-list {
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
