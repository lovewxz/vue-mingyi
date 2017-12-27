<template>
<div class="project-handler" style="margin-top:30px;">
  <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" auto-complete="off" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item label="简介" prop="description">
      <el-input type="textarea" v-model="form.description" placeholder="请输入简介"></el-input>
    </el-form-item>
    <el-form-item label="是否置顶" prop="isTop">
      <el-checkbox v-model="form.isTop">置顶</el-checkbox>
    </el-form-item>
    <el-form-item label="封面图" prop="cover_image">
      <upload :file-list="form.cover_image"></upload>
    </el-form-item>
    <el-form-item label="分类目录" prop="category">
      <cate-cascader :selectedCateList="selectedCateList" @cateDataChange="cateDataChange"></cate-cascader>
    </el-form-item>
    <el-form-item label="现价" prop="price" style="display:inline-block">
      <el-input v-model="form.price" auto-complete="off" placeholder="请输入现价">
        <template slot="prepend">¥</template>
      </el-input>
    </el-form-item>
    <el-form-item label="原价" prop="original_price" style="display:inline-block;text-decoration:line-through">
      <el-input v-model="form.original_price" auto-complete="off" placeholder="请输入原价">
        <template slot="prepend">¥</template>
      </el-input>
    </el-form-item>
    <el-form-item label="图片列表" prop="detail_images">
      <upload :file-list="form.detail_images"></upload>
    </el-form-item>
    <el-form-item label="操作专家" prop="doctor">
      <el-select placeholder="请选择专家" v-model="formSelectVal">
        <el-option v-for="item in doctors" :key="item._id" :label="item.realname" :value="item._id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="参数" prop="params" class="project-params">
      <project-params :params="form.params"></project-params>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click.native="cancelBtn">取消</el-button>
    <el-button type="primary" @click.native="save" :loading="loading">提交</el-button>
  </div>
</div>
</template>
<script>
import api from 'js/axios'
import config from 'js/config'
import ProjectParams from 'components/project-params/project-params'
import Upload from 'components/upload/upload'
import CateCascader from 'components/cate-cascader/cate-cascader'

export default {
  data() {
    const checkCate = (rule, value, callback) => {
      if (!this.selectedCateList.length) {
        return callback(new Error('分类不能为空'))
      }
      callback()
    }
    return {
      loading: false,
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        category: [
          { required: true, validator: checkCate, trigger: 'blur' }
        ]
      },
      form: {
        title: '',
        description: '',
        price: '',
        original_price: '',
        cover_image: [],
        params: [{
          key: '',
          value: ''
        }],
        detail_images: [],
        doctor: '',
        isTop: false,
        category: ''
      },
      selectedCateList: [],
      doctors: [],
      formSelectVal: '',
      isAuthorized: false // 是否验证过
    }
  },
  methods: {
    // 保存
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.addLoading = true
          // console.log(this._saveResult(this.form))
          let data = ''
          if (this.$route.params.id) {
            data = await api.putProject(this._saveResult(this.form))
          } else {
            data = await api.saveProject(this._saveResult(this.form))
          }
          data.success ? this.$router.push('/projects') : this.$message({
            message: data.err,
            type: 'error'
          })
        }
      })
    },
    // 取消按钮
    cancelBtn() {
      this.$router.back()
    },
    cateDataChange(newVal) {
      this.selectedCateList = newVal
    },
    _saveResult(data) {
      const _data = Object.assign({}, data)
      _data.category = this.selectedCateList
      _data.doctor = this.formSelectVal
      _data.cover_image = _data.cover_image.map(item => item.url.replace(`${config.imgCDN}/`, ''))
      _data.detail_images = _data.detail_images.map(item => item.url.replace(`${config.imgCDN}/`, ''))
      return _data
    },
    _genResult(data) {
      if (data.cover_image.length > 0) {
        const newImgs = []
        data.cover_image.forEach(item => newImgs.push({ name: item, url: `${config.imgCDN}/${item}` }))
        data.cover_image = newImgs
      }
      if (data.detail_images.length > 0) {
        const newImgs = []
        data.detail_images.forEach(item => newImgs.push({ name: item, url: `${config.imgCDN}/${item}` }))
        data.detail_images = newImgs
      }
      return Object.assign({}, data)
    }
  },
  async beforeCreate() {
    if (!this.isAuthorized) {
      await api.fetchDoctor().then(res => {
        res = res.data
        this.doctors = res
      }).catch(e => {
        if (e.status === 402) {
          this.isAuthorized = true
          this.$message({
            message: e.data,
            type: 'error'
          })
        }
      })
    }
  },
  async created() {
    if (this.$route.params.id && !this.isAuthorized) {
      await api.fetchProjectById(this.$route.params.id).then(res => {
        this.form = this._genResult(res)
        if (this.form.doctor) {
          this.formSelectVal = this.form.doctor._id
        }
        this.selectedCateList = this.form.category.map(item => parseInt(item))
        console.log(this.selectedCateList)
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path.indexOf('add') > -1) {
        this.$refs.form.resetFields()
      }
    }
  },
  components: {
    ProjectParams,
    Upload,
    CateCascader
  }
}
</script>
<style lang="scss">
.project-handler {
    .dialog-footer {
        text-align: center;
    }
}
</style>
