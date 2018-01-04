<template>
  <div class="category-list">
    <el-tree :data="cateList"
             :props="defaultProps"
             show-checkbox
             node-key="_id"
             default-expand-all
             :expand-on-click-node="false"
             :render-content="renderContent"
             class="category-tree">
    </el-tree>
    <el-col :span="24" class="toolbar">
      <el-button type="primary" @click="appendTop">添加顶级栏目</el-button>
    </el-col>
    <el-dialog :visible.sync="showFlag" :show-close="false">
      <el-form :model="form" ref="cateForm">
        <el-form-item label="父级栏目" prop="selectedCateList">
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="defaultProps"
            v-model="form.selectedCateList"
            style="width: 40%"
            placeholder="留空即为根组件"
            :disabled="cascaderDisabled"
            :change-on-select="true"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="栏目名称" prop="name">
          <el-input v-model="form.name" style="width: 40%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="showFlag = false">取消</el-button>
        <el-button type="primary" @click.native="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCategoryList, createCategory, saveCategory, delCategory } from '@/api/category'

export default {
  data() {
    return {
      cateList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: '_id'
      },
      showFlag: false,
      form: {
        _id: '',
        selectedCateList: [],
        name: '',
      },
      cascaderDisabled: false
    }
  },
  async created() {
    await this.fetchCategory()
  },
  methods: {
    append(node, data) {
      this.form.selectedCateList = this._getCascader(node)
      this.form.selectedCateList.push(data._id)
      this.form.name = ''
      this.form._id = ''
      this.cascaderDisabled = false
      this.showFlag = true
    },
    appendTop() {
      this.form.selectedCateList = []
      this.form.name = ''
      this.form._id = ''
      this.showFlag = true
      this.cascaderDisabled = true
    },
    edit(node, data) {
      this.form.selectedCateList = this._getCascader(node)
      this.form.name = data.name
      this.form._id = data._id
      this.cascaderDisabled = false
      this.showFlag = true
    },
    remove(node, data) {
      let children = data.children
      let ids = this._getChildren(children)
      if (!ids) {
        ids = [data._id]
      } else {
        ids.push(data._id)
      }
      this.$confirm('确认删除吗?', '提示', {
        type: 'warning'
      }).then(async () => {
        await delCategory({ids}).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
        await this.fetchCategory()
      },() => {
        return
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex:1;display:flex;align-items:center;justify-content:space-between;font-size:14px;padding-right:8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button type="success" icon="el-icon-plus" size="mini" on-click={ () => this.append(node, data) }></el-button>
            <el-button type="warning" icon="el-icon-edit" size="mini" on-click={ () => this.edit(node, data) }></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" on-click={ () => this.remove(node, data) }></el-button>
          </span>
        </span>
      )
    },
    async save() {
      let selectedCateList = this.form.selectedCateList
      let formData = {}
      if (this.form._id) {
        let pidAndTid = {
          parentId: selectedCateList.length > 0 ? selectedCateList.slice(-1)[0] : '0',
          topId: selectedCateList.length > 0 ? selectedCateList.slice(0, 1)[0] : '0'
        }
        formData = Object.assign({}, this.form, pidAndTid)
        console.log(formData)
        await saveCategory(formData).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.showFlag = false
          } else {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          }
        })
      } else {
        formData = {
          name: this.form.name,
          parentId: selectedCateList.length > 0 ? selectedCateList.slice(-1)[0] : '0',
          topId: selectedCateList.length > 0 ? selectedCateList.slice(0, 1)[0] : '0'
        }
        await createCategory(formData).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.showFlag = false
          } else {
            this.$message({
              type: 'error',
              message: '新增失败'
            })
          }
        })
      }
      await this.fetchCategory()
    },
    async fetchCategory() {
      const cateList = await getCategoryList().then((res) => {
         if (res.success) {
           res = this._genResult(res.data)
           this.cateList = res
         }
      })
    },
    _getChildren(children) {
      let ids = []
      if (!children) {
        return
      }
      if (!Array.isArray(children)) {
        children = [children]
      }
      children.forEach(item => {
        ids.push(item._id)
        if(item.children) {
          this._getChildren(item.children)
        }
      })
      return ids
    },
    _getCascader(node) {
      let p = node.parent
      let tempList = []
      while (p.parent) {
        tempList.unshift(p.data._id)
        p = p.parent
      }
      return tempList
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
  }
}
</script>
<style lang="scss">
.category-list {
  padding: 20px;
  .category-tree {
    border: 1px solid #d1dbe5;
    .el-tree-node__content {
      height: 36px;
      line-height: 36px;
      cursor: pointer;
      border-bottom: 1px dashed #ddd;
    }
  }
  .toolbar {
    margin-top: 20px;
  }
}
</style>
