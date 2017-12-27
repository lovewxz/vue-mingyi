<template>
<div class="tag-operation">
  <el-col>
    <el-tag :key="tag" type="primary" v-for="(tag,index) in tagList" :closable="true" :close-transition="false" @close="handleClose(tag,index)" class="tag-item">
      {{tag}}
    </el-tag>
  </el-col>
  <el-col :span="2">
    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
  </el-col>
</div>
</template>
<script>
export default {
  props: {
    tagList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    handleClose(tag, index) {
      this.tagList.splice(index, 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.tagList.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
<style lang="scss">
.tag-operation {
  .tag-item {
      margin-right: 10px;
      display: inline-block;
  }
}
</style>
