<template>
<div class="project">
  <filter-bar @filter="filter" @add="handleAdd" style="padding-bottom:0;"></filter-bar>
  <el-table :data="project" @selection-change="selsChange" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
    <el-table-column type="selection"></el-table-column>
    <el-table-column prop="title" label="标题" align="left"></el-table-column>
    <el-table-column prop="category" label="分类" align="center" width="120">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.category.length > 0">{{getLastCate(scope.row.category)}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="cover_image" label="图片" align="center" width="150">
      <template slot-scope="scope">
        <img :src="`${imgCDN}/${scope.row.cover_image && scope.row.cover_image[0]}?imageView2/0/w/100/h/100`" alt="">
      </template>
    </el-table-column>
    <el-table-column prop="time" label="发布时间" align="center" width="200">
      <template slot-scope="scope">
        {{scope.row.meta.createdAt.split('T')[0]}}
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
    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="limit" :total="total" style="float:right;">
    </el-pagination>
  </el-col>
</div>
</template>
<script>
import config from 'js/config'
import { getProjectList } from '@/api/project'
import ProjectParams from 'components/project-params/project-params'
import FilterBar from 'components/filter-bar/filter-bar'
import axios from 'axios'
import randomToken from 'random-token'

export default {
  data() {
    return {
      total: 0,
      project: [],
      sels: [], //选中的数据
      // 分页
      condition: {
        page: 1,
        limit: 20,
        keyword: ''
      },
      listLoading: false
    }
  },
  async created() {
    this.imgCDN = config.imgCDN
    await this.fetchProject()
  },
  methods: {
    //分页
    async handleCurrentChange(page) {
      this.condition.page = page
      await this.fetchProject(this.condition)
    },
    // 选择按钮
    selsChange(sels) {
      this.sels = sels
    },
    // 增加按钮
    handleAdd() {
      this.$router.push('/projects/add')
    },
    // 编辑按钮
    handleEdit(index, row) {
      this.$router.push(`/projects/edit/${row._id}`)
    },
    // 删除按钮
    handleDel(index, row) {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(async() => {
        const options = Object.assign({}, { _id: row._id }, { status: -1 })
        const data = await api.delProject(options)
        if (data.success && data.data.ok === 1) {
          await this.fetchProject(this.condition)
        }
      }, () => {
        return
      })
    },
    getLastCate(data) {
      if (data && data.length > 0) {
        const cate = data.slice(-1)[0].name
        return cate
      }
    },
    // 过滤查询
    async filter(keyword) {
      keyword = encodeURIComponent(keyword)
      this.condition.keyword = keyword
      await this.fetchProject(this.condition)
    },
    // 批量删除
    async batchDel() {
      if (Array.isArray(this.sels)) {
        const options = []
        this.sels.forEach((item) => {
          options.push(Object.assign({}, { _id: item._id }, { status: -1 }))
        })
        let promises = options.map((option) => api.delProject(option))
        let results = await Promise.all(promises)
        await this.fetchProject(this.condition)
      }
    },
    async fetchProject(condition) {
      this.listLoading = true
      const list = await getProjectList(condition)
      this.listLoading = false
      this.project = list.data
      this.total = list.total
    }
  },
  components: {
    ProjectParams,
    FilterBar
  }
}
</script>
<style lang="scss">
.project {
    .now-price {
        display: block;
        font-size: 18px;
        color: #ff4949;
    }
    .or-price {
        display: block;
        text-decoration: line-through;
        color: #666;
    }
    .el-loading-mask {
      z-index: 500;
    }
}
</style>
