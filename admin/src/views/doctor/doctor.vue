<template>
  <div class="doctor">
    <filter-bar @filter="filter"
                @add="handleAdd"
                style="padding-bottom:0;"></filter-bar>
    <el-table :data="doctor"
              border
              @selection-change="selsChange"
              v-loading="listLoading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="realname"
                       label="医生姓名"
                       align="left"></el-table-column>
      <el-table-column prop="title"
                       label="职称"
                       align="left"></el-table-column>
      <el-table-column prop="time"
                       label="发布时间"
                       align="center"
                       width="200">
        <template slot-scope="scope">
          {{scope.row.meta.createdAt.split('T')[0]}}
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="200">
        <template slot-scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small"
                     type="danger"
                     @click="handleDel(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="toolbar"
         style="margin-top: 20px;">
      <el-button type="danger"
                 :disabled="this.sels.length===0"
                 @click="batchDel">批量删除</el-button>
      <el-pagination background
                     layout="total, prev, pager, next, jumper"
                     @current-change="handleCurrentChange"
                     :page-size="condition.limit"
                     :total="total"
                     style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import config from '@/config'
import { getDoctorList, delDoctor } from '@/api/doctor'
import ProjectParams from '@/components/ProjectParams/ProjectParams'
import FilterBar from '@/components/FilterBar/FilterBar'

const imgCDN = config.imgCDN
export default {
  data() {
    return {
      total: 0,
      doctor: [],
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
    await this.fetchDoctor(this.condition)
  },
  methods: {
    //分页
    async handleCurrentChange(page) {
      this.condition.page = page
      await this.fetchDoctor(this.condition)
    },
    // 选择按钮
    selsChange(sels) {
      this.sels = sels
    },
    // 增加按钮
    handleAdd() {
      this.$router.push('/doctor/add')
    },
    // 编辑按钮
    handleEdit(index, row) {
      this.$router.push(`/doctor/edit/${row._id}`)
    },
    // 删除按钮
    handleDel(index, row) {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(
        async () => {
          const options = Object.assign({}, { _id: row._id }, { status: -1 })
          const data = await deldoctor(options)
          if (data.success && data.data.ok === 1) {
            await this.fetchDoctor(this.condition)
          }
        },
        () => {
          return
        }
      )
    },
    getLastCate(data) {
      if (data && data.length > 0) {
        const cate = data.slice(-1)[0].name
        return cate
      }
    },
    // 过滤查询
    async filter(keyword) {
      this.condition.keyword = encodeURIComponent(keyword)
      await this.fetchDoctor(this.condition)
    },
    // 批量删除
    async batchDel() {
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(async () => {
        if (Array.isArray(this.sels)) {
          const options = []
          this.sels.forEach(item => {
            options.push(Object.assign({}, { _id: item._id }, { status: -1 }))
          })
          let promises = options.map(option => delDoctor(option))
          let results = await Promise.all(promises)
          await this.fetchDoctor(this.condition)
        }
      })
    },
    async fetchDoctor(condtion) {
      this.listLoading = true
      try {
        const res = await getDoctorList(condtion)
        if (res.success) {
          this.doctor = res.data.list
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
.doctor {
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
