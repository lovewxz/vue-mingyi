<template>
<div class="project-handler">
  <el-form :model="form" :rules="formRules" ref="form">
    <sticky>
        <template v-if="fetchSuccess">
          <router-link style="margin-right:15px;" v-show='this.$route.params.id' :to="{ path:'project-add' }">
            <el-button type="info">新建项目</el-button>
          </router-link>
          <el-dropdown trigger="click">
            <el-button plain>{{form.isTop?'已经置顶':'未置顶'}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-padding" slot="dropdown">
              <el-dropdown-item>
                <el-radio-group style="padding: 10px;" v-model="form.isTop">
                  <el-radio :label="true">设置置顶</el-radio>
                  <el-radio :label="false">取消置顶</el-radio>
                </el-radio-group>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="save()">发布
          </el-button>
          <el-button v-loading="loading" type="warning" @click="cancelBtn">取消</el-button>
        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>

      </sticky>
    <div class="createPost-main-container">
      <el-row>
        <el-col :span="21">
          <el-form-item style="margin-bottom: 40px;" prop="title">
            <MDinput name="title" v-model="form.title" required :maxlength="100">
              标题
            </MDinput>
            <!-- <span v-show="form.title.length>=26" class='title-prompt'>app可能会显示不全</span> -->
          </el-form-item>
          <div class="postInfo-container">
            <el-row>
              <el-col :span="12">
                <el-form-item label="分类目录:" prop="category">
                  <cate-cascader :selectedCateList="selectedCateList" @cateDataChange="cateDataChange"></cate-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="操作专家:" prop="doctor">
                  <el-select placeholder="请选择专家" v-model="formSelectVal">
                    <el-option v-for="item in doctors" :key="item._id" :label="item.realname" :value="item._id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-form-item style="margin-bottom: 40px;" label-width="45px" label="简介:" prop="description">
        <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="form.description">
        </el-input>
        <!-- <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span> -->
      </el-form-item>
      <el-row style="margin-bottom: 40px;">
        <el-col :span="8">
          <el-form-item label="封面图:" prop="cover_image" label-width="60px">
            <upload :file-list="form.cover_image"></upload>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="图片列表:" prop="detail_images" label-width="75px">
            <upload :file-list="form.detail_images"></upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 40px;">
        <el-col :span="12">
          <el-form-item label="现价:" prop="price">
            <el-col :span="12">
              <el-input v-model="form.price" auto-complete="off" placeholder="请输入现价">
                <template slot="prepend">¥</template>
              </el-input>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原价:" prop="original_price">
            <el-col :span="12">
              <el-input v-model="form.original_price" auto-complete="off" placeholder="请输入原价" class="inline-input">
                <template slot="prepend">¥</template>
              </el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="参数:" prop="params" class="project-params" label-width="45px">
        <project-params :params="form.params"></project-params>
      </el-form-item>
    </div>
  </el-form>
</div>
</template>
<script>
import config from '@/config'
import ProjectParams from 'components/ProjectParams/ProjectParams'
import Upload from 'components/Upload/Upload'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky'
import CateCascader from 'components/CateCascader/CateCascader'
import { getDoctorList } from '@/api/doctor'
import { getProjectById, saveProject, createProject } from '@/api/project'

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
        category: '',
        source_uri: ''
      },
      selectedCateList: [],
      doctors: [],
      formSelectVal: '',
      fetchSuccess: true
    }
  },
  methods: {
    // 保存
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.addLoading = true
          let data = ''
          if (this.$route.params.id) {
            data = await saveProject(this._saveResult(this.form))
          } else {
            data = await createProject(this._saveResult(this.form))
          }
          this.addLoading = false
          data.success ? this.$router.push('/project/index') : this.$message({
            message: data.err,
            type: 'error'
          })
        }
      })
    },
    // 取消按钮
    cancelBtn() {
      this.$router.push({name: 'project-index'})
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
    await getDoctorList().then(res => {
      if (res.success) {
        this.doctors = res.data.list
      }
    })
  },
  async created() {
    if (this.$route.params.id) {
      await getProjectById(this.$route.params.id).then(res => {
        if (res.success) {
          this.form = this._genResult(res.data)
          if (this.form.doctor) {
            this.formSelectVal = this.form.doctor._id
          }
          this.selectedCateList = this.form.category.map(item => parseInt(item))
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path.indexOf('add') > -1) {
        this.$refs.form.resetFields()
        this.formSelectVal = ''
        this.selectedCateList = []
      }
    }
  },
  components: {
    ProjectParams,
    Upload,
    CateCascader,
    MDinput,
    Sticky
  }
}
</script>
<style lang="scss">
@import "src/styles/mixin.scss";
.project-handler {
  position: relative;
  .dialog-footer {
    text-align: center;
  }
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
}
</style>
