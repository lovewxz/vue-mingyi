<template>
  <el-cascader
    expand-trigger="hover"
    :options="cateList"
    :props="defaultProps"
    v-model="cateData"
    style="width: 40%"
    placeholder="留空即为根组件"
    :disabled="isAllow"
    :change-on-select="true"
  >
  </el-cascader>
</template>
<script>
import api from 'js/axios'

export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        value: '_id'
      },
      isAllow: false,
      cateList: [],
      cateData: []
    }
  },
  props: {
    selectedCateList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  async created() {
    await this.fetchCategory()
  },
  methods: {
    disabled() {
      this.isAllow = true
    },
    async fetchCategory() {
      const cateList = await api.fetchCategory().then((res) => {
         if (res.success) {
           res = this._genResult(res.data)
           this.cateList = res
         }
      })
    },
    _genResult(arr) {
      arr.sort((a, b) => a.parentId > b.parentId ? 1 : -1)
      for (let i = arr.length; i--;) {
        if (arr[i].parentId > 0) {
          let obj = arr.pop()
          arr.forEach(item => {
            if (item._id === obj.parentId) {
              item.children = item.children || []
              item.children.push(obj)
            }
          })
        }
      }
      return arr
    }
  },
  watch: {
    selectedCateList (newVal) {
      this.cateData = newVal
    },
    cateData(newVal) {
      this.$emit('cateDataChange', newVal)
    }
  }
}
</script>
<style lang="scss">
</style>
