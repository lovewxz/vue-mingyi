<template>
<div class="people-case-handler">
  <el-form :model="form" :rules="formRules" ref="form">
    <sticky>
      <template v-if="fetchSuccess">
        <router-link style="margin-right:15px;" v-show='this.$route.params.id' :to="{ path:'diary-add' }">
          <el-button type="info">新建日记</el-button>
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
              <el-col :span="8">
                <el-form-item label="分类目录:" prop="category">
                  <cate-cascader :selectedCateList="selectedCateList" @cateDataChange="cateDataChange"></cate-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="操作专家:" prop="doctor">
                  <el-select placeholder="请选择专家" v-model="form.doctor">
                    <el-option v-for="item in doctors" :key="item._id" :label="item.realname" :value="item._id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="关联项目:" prop="project">
                  <el-select placeholder="请选择专家" v-model="form.project">
                    <el-option v-for="item in projects" :key="item._id" :label="item.title" :value="item._id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-form-item label="模特姓名:" label-width="80px" props="user_name">
        <el-col :span="4">
          <el-input v-model="form.user_name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label-width="45px" label="简介:" prop="contents">
        <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="form.contents">
        </el-input>
        <!-- <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span> -->
      </el-form-item>
      <el-row style="margin-bottom: 40px;">
        <el-col :span="12">
          <el-form-item label="术前照片:" prop="before" label-width="85px" v-if="form.compare_photo">
            <upload :file-list="form.compare_photo.before"></upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="术后照片:" prop="after" label-width="85px" v-if="form.compare_photo">
            <upload :file-list="form.compare_photo.after"></upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="标签" v-if="form.all_item" prop="tag" label-width="45px">
        <tag :tag-list="form.all_item"></tag>
      </el-form-item>
      <div v-show="diaryListShow">
        <el-row style="margin-bottom: 20px">
          <el-col>相关日记:</el-col>
        </el-row>
        <case-diary :case-id="$route.params.id" :table-data="diaryList" @filter="diaryFitler" @del="diaryDel" @batchDel="diaryBatchDel" ref="caseDiary" ></case-diary>
      </div>
    </div>
  </el-form>
</div>
</template>
<script>
import { getDoctorList } from '@/api/doctor'
import { getProjectList } from '@/api/project'
import { getPcaseById, savePcase, createPcase } from '@/api/pcase'
import { getDiaryByCaseId } from '@/api/diary'
import { removeURLToImage, addURLToImage} from '@/utils'
import config from '@/config'
import Upload from '@/components/upload/upload'
import CaseDiary from '@/components/CaseDiary/CaseDiary'
import Tag from '@/components/tag/tag'
import CateCascader from '@/components/CateCascader/CateCascader'
import Sticky from '@/components/Sticky'
import MDinput from '@/components/MDinput'
import randomToken from 'random-token'

export default {
  data() {
    const checkCate = (rule, value, callback) => {
      if (!this.selectedCateList.length) {
        return callback(new Error('分类不能为空'))
      }
      callback()
    }
    const checkBefore = (rule, value, callback) => {
      if (!this.form.compare_photo.before.length) {
        return callback(new Error('术前照片不能为空'))
      }
      callback()
    }
    const checkAfter = (rule, value, callback) => {
      if (!this.form.compare_photo.after.length) {
        return callback(new Error('术后照片不能为空'))
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
        ],
        before: [
          { required: true, validator: checkBefore, trigger: 'blur' }
        ],
        after: [
          { required: true, validator: checkAfter, trigger: 'blur' }
        ]
      },
      form: {
        title: '',
        contents: '',
        isTop: false,
        user_name: '',
        compare_photo: {
          before: [],
          after: []
        },
        all_item: [],
        doctor: '',
        project: '',
        category: ''
      },
      diaryListShow: true,
      diaryList: [],
      doctors: [],
      projects: [],
      selectedCateList: [],
      fetchSuccess: true
    }
  },
  methods: {
    // 保存
    save() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          let res = ''
          const data = this._saveResult(this.form)
          if (this.$route.params.id) {
            res = await savePcase(data)
          } else {
            res = await createPcase(data)
          }
          res.success ? this.$router.back() : this.$message({
            message: res.err,
            type: 'error'
          })
        }
      })
    },
    // 取消按钮
    cancelBtn() {
      this.$router.back()
    },
    diaryBatchDel(diaryArr) {
      this.diaryList = this.diaryList.filter(item => {
        let bool = true
        diaryArr.forEach(diary => {
          if (diary.id === item.id) {
            bool = false
          }
        })
        return bool
      })
    },
    diaryDel(index) {
      this.diaryList.splice(index, 1)
    },
    diaryFitler(keyword) {
      if (!keyword) {
        return
      }
      keyword = new RegExp(keyword, 'i')
      this.diaryList = this.diaryList.filter(item => {
        return item.article.match(keyword)
      })
    },
    cateDataChange(newVal) {
      this.selectedCateList = newVal
    },
    _saveResult(data) {
      const _data = JSON.parse(JSON.stringify(data))
      _data.category = this.selectedCateList
      _data.doctor = this.form.doctor
      _data.project = this.form.project
      const beforePhotoURL = removeURLToImage(_data.compare_photo.before[0].url)
      const afterPhotoURL = removeURLToImage(_data.compare_photo.after[0].url)
      _data.compare_photo = {
        before: beforePhotoURL,
        after: afterPhotoURL
      }
      return _data
    },
    _genResult(data) {
      if (data.compare_photo) {
        data.compare_photo.before = [{ name: data.compare_photo.before, url: `${config.imgCDN}/${data.compare_photo.before}` }]
        data.compare_photo.after = [{ name: data.compare_photo.after, url: `${config.imgCDN}/${data.compare_photo.after}` }]
      }
      this.selectedCateList = data.category.map(item => parseInt(item))
      return Object.assign({}, data)
    },
    async _fetchPcaseById(id) {
      await getPcaseById(id).then(res => {
        if (res.success) {
          this.form = this._genResult(res.data)
          this.form.doctor = this.form.doctor && res.data.doctor._id
          this.form.project = this.form.project && res.data.project._id
        }
      })
    },
    async _batchDiaryByCaseId(caseId) {
      await getDiaryByCaseId(caseId).then(res => {
        if (res.success) {
          const diary = res.data
          console.log(diary)
          this.diaryList = diary.map(item => {
            if (item.article) {
              item.article = addURLToImage(item.article)
            }
            return item
          })
        }
      })
    }
  },
  async beforeCreate() {
    await getDoctorList().then(res => {
      if (res.success) {
        this.doctors = res.data.list
      }
    })
    const params = { page: 0, limit: 0 }
    await getProjectList(params).then(res => {
      if (res.success) {
        this.projects = res.data.list
      }
    })
  },
  async created() {
    if (this.$route.params.id) {
      await this._fetchPcaseById(this.$route.params.id)
      await this._batchDiaryByCaseId(this.$route.params.id)
    } else {
      this.diaryListShow = false
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.path.indexOf('add') > -1) {
        this.form = {}
        this.diaryList = []
        this.diaryListShow = false
        this.$refs.form.resetFields()
      }
    }
  },
  components: {
    Upload,
    CaseDiary,
    Tag,
    CateCascader,
    Sticky,
    MDinput
  }
}
</script>
<style lang="scss">
@import "src/styles/mixin.scss";
.people-case-handler {
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
