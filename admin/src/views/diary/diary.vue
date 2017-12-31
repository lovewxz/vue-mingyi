<template>
<div class="diary">
  <filter-bar @filter="filter" @add="handleAdd" style="padding-bottom:0;" defaultPlaceholder="填写要搜索的日记内容">
    <el-form-item>
      <el-select placeholder="模特姓名" v-model="condition.caseId">
        <el-option v-for="item in allUserName" :key="item._id" :label="item.user_name" :value="item._id">
        </el-option>
      </el-select>
    </el-form-item>
  </filter-bar>
  <el-table :data="diary" border @selection-change="selsChange" v-loading="listLoading">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="article" label="日记内容" align="left" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column prop="caseId.user_name" label="模特姓名" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
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
  <div class="toolbar" style="margin-top: 20px;">
    <el-button type="danger" :disabled="this.sels.length===0" @click="batchDel">批量删除</el-button>
    <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="condition.limit" :total="total" style="float:right;">
    </el-pagination>
  </div>
</div>
</template>
<script>
import config from '@/config'
import { getDiaryList } from '@/api/diary'
import { getPcaseList } from '@/api/pcase'
import ProjectParams from '@/components/ProjectParams/ProjectParams'
import FilterBar from '@/components/FilterBar/FilterBar'
import { removeHTMLTag } from '@/utils'

const imgCDN = config.imgCDN
export default {
  data() {
    return {
      total: 0,
      diary: [],
      sels: [], //选中的数据
      // 分页
      condition: {
        page: 1,
        limit: 20,
        keyword: '',
        caseId: ''
      },
      listLoading: false,
      allUserName: []
    }
  },
  async beforeCreate() {
    const params = {
      limit: 0,
      page: 0
    }
    await getPcaseList(params).then(res => {
      if (res.success) {
        this.allUserName = res.data.list
      }
    })
  },
  async created() {
    await this.fetchDiary(this.condition)
  },
  methods: {
    //分页
    async handleCurrentChange(page) {
      this.condition.page = page
      await this.fetchDiary(this.condition)
    },
    // 选择按钮
    selsChange(sels) {
      this.sels = sels
    },
    // 增加按钮
    handleAdd() {
      this.$router.push('/pcase/add')
    },
    // 编辑按钮
    handleEdit(index, row) {
      this.$router.push(`/pcase/edit/${row._id}`)
    },
    // 删除按钮
    handleDel(index, row) {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(async() => {
        const options = Object.assign({}, { _id: row._id }, { status: -1 })
        const data = await delPcase(options)
        if (data.success && data.data.ok === 1) {
          await this.fetchDiary(this.condition)
        }
      }, () => {
        return
      })
    },
    _genResult(data) {
      data = data.map(item => {
        item.article = removeHTMLTag(item.article)
        return item
      })
      return data
    },
    // 过滤查询
    async filter(keyword) {
      this.condition.keyword = encodeURIComponent(keyword)
      await this.fetchDiary(this.condition)
    },
    // 批量删除
    async batchDel() {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(async () => {
        if (Array.isArray(this.sels)) {
          const options = []
          this.sels.forEach((item) => {
            options.push(Object.assign({}, { _id: item._id }, { status: -1 }))
          })
          let promises = options.map((option) => delPcase(option))
          let results = await Promise.all(promises)
          await this.fetchDiary(this.condition)
        }
      })
    },
    async fetchDiary(condtion) {
      this.listLoading = true
      try {
        const res = await getDiaryList(condtion)
        if (res.success) {
          this.diary = this._genResult(res.data.list)
          this.total = res.data.total
        }
      } catch (e) {
        throw new Error(e)
      }
      this.listLoading = false
    }
  },
  components: {
    ProjectParams,
    FilterBar
  }
}
</script>
<style lang="scss">
.diary {
    padding: 20px;
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
