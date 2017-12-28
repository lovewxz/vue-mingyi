<template>
<div>
  <el-row v-for="(item,index) in params" style="margin-bottom: 10px;" :key="index">
    <el-col :span="5">
      <el-input v-model="item.key" placeHolder="属性"></el-input>
    </el-col>
    <el-col :span="1" style="text-align:center">
      -
    </el-col>
    <el-col :span="15">
      <el-input v-model="item.value" placeHolder="值"></el-input>
    </el-col>
    <el-col :span="2" class="parameters-close" style="text-align:center">
      <span class="el-icon-close" @click="delParameters(index)"></span>
    </el-col>
  </el-row>
  <el-button type="primary" @click="addParameters">新增参数</el-button>
</div>
</template>
<script>
export default {
  props: {
    params: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 新增参数
    addParameters() {
      this.params.push({ key: '', value: '' })
    },
    // 删除参数
    delParameters(index) {
      this.params.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
.project-params {}
</style>
