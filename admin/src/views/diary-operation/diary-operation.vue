<template>
<div class="diary-container">
  <el-form :model="diaryData" ref="caseDiary" :rules="formRules">
    <el-form-item label="恢复天数" prop="title">
      <el-col :span="5">
        <el-input v-model="diaryData.title" placeholder="请填写天数"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="选择案例" prop="caseId">
      <el-select placeholder="请选择案例" v-model="diaryData.caseId">
        <el-option v-for="item in pcase" :key="item._id" :label="item.user_name" :value="item._id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="editor-content-item" label="文章详情" prop="article" label-width="80px">
      <quil-editor :content="diaryData.article" @articleChange="articleChange"></quil-editor>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click.native="diaryCancel">取消</el-button>
    <el-button type="primary" @click.native="diarySave">提交</el-button>
  </div>
</div>
</template>
<script>
import { getPcaseList } from '@/api/pcase'
import { saveDiary, createDiary, getDiaryById } from '@/api/diary'
import config from '@/config'
import { removeURLToImage, addURLToImage } from '@/utils'
import Upload from 'components/Upload/Upload'
import QuilEditor from 'components/QuilEditor/QuilEditor'
import randomToken from 'random-token'

export default {
  data() {
    return {
      diaryData: {
        title: '',
        article: '',
        caseId: this.$route.query.caseId || ''
      },
      formRules: {
        title: [
          { required: true, message: '请输入天数', trigger: 'blur' }
        ],
        caseId: [
          { required: true, message: '请输入内容', trigger: 'change' }
        ],
        article: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      pcase: []
    }
  },
  methods: {
    articleChange(article) {
      this.diaryData.article = article
    },
    diaryCancel() {
      this.$router.back()
    },
    diarySave() {
      this.$refs.caseDiary.validate(async (valid) => {
        if (valid) {
          this.diaryData.article = removeURLToImage(this.diaryData.article)
          if (this.$route.params.id) {
            await saveDiary(this.diaryData).then(res => {
              if (!res.success) {
                this.$message({
                  message: '保存失败',
                  type: 'error'
                })
              }
            })
          } else {
            this.diaryData._id = randomToken(32)
            await createDiary(this.diaryData).then(res => {
              if (!res.success) {
                this.$message({
                  message: '新增失败',
                  type: 'error'
                })
              }
            })
          }
          this.$refs.caseDiary.resetFields()
          this.$router.back()
        }
      })
    },
    async fetchDiaryById(id) {
      await getDiaryById(id).then(res => {
        if (res.success) {
          res.data.article = addURLToImage(res.data.article)
          res.data.caseId = res.data.caseId._id
          this.diaryData = res.data
        }
      })
    }
  },
  async beforeCreate() {
    await getPcaseList({ limit: 0, page: 0 }).then(res => {
      if (res.success) {
        this.pcase = res.data.list
      }
    })
  },
  async created() {
    if (this.$route.params.id) {
      await this.fetchDiaryById(this.$route.params.id)
    }
  },
  components: {
    QuilEditor
  }
}
</script>
<style lang="scss">
.diary-container {
    padding: 20px;
    .editor-content-item {
        height: 520px;
        .vue-editor {
            line-height: 1!important;
            height: 450px;
            img {
                max-width: 300px!important;
            }
            .ql-picker.ql-size {
              width: 68px!important;
            }
            .ql-toolbar.ql-snow {
              background: #f0f0f0;
            }
        }
    }
    .el-form-item {
        margin-bottom: 22px !important;
    }
    .upload-wrapper {
        padding: 8px;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }
}
</style>
