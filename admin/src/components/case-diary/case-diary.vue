<template>
<div class="case-diary">
  <filter-bar @filter="filter" @add="handleAdd"></filter-bar>
  <el-table :data="tableData" border @selection-change="selsChange">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="title" label="日期" width="120"></el-table-column>
    <el-table-column prop="article" label="文章" :show-overflow-tooltip="true">
      <template slot-scope="scope">
          {{_subText(scope.row.article)}}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200">
      <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDel(scope.$index,scope.row)"
            >删除</el-button>
          </template>
    </el-table-column>
  </el-table>
  <el-col :span="24" class="toolbar">
    <el-button type="danger" :disabled="this.sels.length===0" @click="batchDel">批量删除</el-button>
  </el-col>
</div>
</template>
<script>
import util from 'js/util'
import config from 'js/config'
import api from 'js/axios'
import Upload from 'components/upload/upload'
import FilterBar from 'components/filter-bar/filter-bar'
import Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'

export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    caseId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formRules: {
        title: [
          { required: true, message: '请输入天数', trigger: 'blur' }
        ]
      },
      formData: [],
      sels: [],
      total: 0,
      pageSize: 5,
      editorOption: {
        modules: {
          toolbar: '#toolbar'
        }
      }
    }
  },
  methods: {
    selsChange(sels) {
      this.sels = sels
    },
    filter(keyword) {
      this.$emit('filter', keyword)
    },
    handleAdd() {
      this.$router.push({path:'/diary/add', query:{ caseId: this.caseId }})
    },
    handleEdit(index, row) {
      this.$router.push(`/diary/edit/${row._id}`)
    },
    handleDel(index, row) {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(async() => {
        const options = Object.assign({}, { _id: row._id }, { status: -1 })
        await api.delDiary(options).then(res => {
          if (res.success && res.data.ok === 1) {
            this.$emit('del', index)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败,请稍后再试'
            })
          }
        })
      }, () => {
        this.$message({
          type: 'error',
          message: '删除失败,请稍后再试'
        })
        return
      })
    },
    batchDel() {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(async() => {
        const options = []
        this.sels.forEach((item) => {
          options.push(Object.assign({}, { _id: item._id }, { status: -1 }))
        })
        let promises = options.map((option) => api.delDiary(option))
        let results = await Promise.all(promises)
        if (results) {
          this.$emit('batchDel', this.sels)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }
      }, () => {
        this.$message({
          type: 'error',
          message: '删除失败,请稍后再试'
        })
        return
      })
    },
    _subText(str) {
      if (!str) {
        return
      }
      str = util.removeHTMLTag(str)
      return str
    }
  },
  watch: {
    tableData(newVal) {
      this.formData = newVal
    }
  },
  components: {
    FilterBar,
    quillEditor,
    Upload
  }
}
</script>
<style lang="scss">
.case-diary {
}
</style>
