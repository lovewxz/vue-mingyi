<template>
  <el-col :span="24"
          class="toolbar">
    <el-form :inline="true"
             :model="filterData">
      <el-form-item>
        <el-input v-model="filterData.title"
                  :placeholder="defaultPlaceholder"></el-input>
      </el-form-item>
      <slot></slot>
      <el-form-item>
        <el-button type="primary"
                   @click="handleFilter">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>
<script>
export default {
  props: {
    defaultPlaceholder: {
      type: String,
      default: '请填写标题'
    }
  },
  data() {
    return {
      filterData: {
        title: ''
      }
    }
  },
  methods: {
    handleFilter() {
      this.$emit('filter', this.filterData.title)
    },
    handleAdd() {
      this.$emit('add')
    }
  }
}
</script>
<style lang="scss">

</style>
