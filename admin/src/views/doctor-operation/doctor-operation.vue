<template>
  <div class="doctor-operation">
    <el-form :model="doctor">
      <sticky>
        <template v-if="fetchSuccess">
          <el-dropdown trigger="click">
            <el-button plain>{{doctor.isTop?'已经置顶':'未置顶'}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu class="no-padding"
                              slot="dropdown">
              <el-dropdown-item>
                <el-radio-group style="padding: 10px;"
                                v-model="doctor.isTop">
                  <el-radio :label="true">设置置顶</el-radio>
                  <el-radio :label="false">取消置顶</el-radio>
                </el-radio-group>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-loading="loading"
                     style="margin-left: 10px;"
                     type="success"
                     @click="save()">发布
          </el-button>
          <el-button v-loading="loading"
                     type="warning"
                     @click="cancelBtn">取消</el-button>
        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>
      </sticky>
      <div class="createPost-main-container">
        <el-form-item prop="realname">
          <MDinput name="realname"
                   v-model="doctor.realname"
                   required
                   :maxlength="100">
            姓名
          </MDinput>
        </el-form-item>
        <el-form-item prop="title"
                      label="职称:">
          <el-select placeholder="请选择职称"
                     v-model="doctor.title">
            <el-option v-for="item in titles"
                       :key="item.id"
                       :label="item.value"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="desc"
                      label="简介:">
          <el-input type="textarea"
                    class="article-textarea"
                    :rows="1"
                    autosize
                    placeholder="请输入内容"
                    v-model="doctor.desc">
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="头像照片:"
                          prop="avatar">
              <upload :file-list="doctor.avatar"></upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医生相册:"
                          prop="photos">
              <upload :file-list="doctor.photos"></upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="擅长项目:"
                      prop="tag">
          <tag :tag-list="doctor.tags"></tag>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import MDinput from '@/components/MDinput'
import Upload from '@/components/Upload/Upload'
import Tag from '@/components/Tag/Tag'
import { getDoctorById, saveDoctor, createDoctor } from '@/api/doctor'
import config from '@/config'

export default {
  data() {
    return {
      fetchSuccess: true,
      loading: false,
      doctor: {
        isTop: false,
        realname: '',
        title: '',
        desc: '',
        photos: [],
        avatar: [],
        tags: []
      },
      titles: [
        {
          id: 1,
          value: '主治医师'
        },
        {
          id: 2,
          value: '主任医师'
        },
        {
          id: 3,
          value: '副主任医师'
        },
        {
          id: 4,
          value: '院长'
        }
      ]
    }
  },
  methods: {
    save() {
      const { id } = this.$route.params
      const doctor = this._saveResult(this.doctor)
      id ? saveDoctor(doctor) : createDoctor(doctor)
    },
    cancelBtn() {
      this.$router.push({ name: 'doctor-index' })
    },
    getDoctorById(id) {
      getDoctorById(id).then(res => {
        if (res.success) {
          this.doctor = this._genResult(res.data)
        }
      })
    },
    _saveResult(data) {
      const saveData = JSON.parse(JSON.stringify(data))
      saveData.avatar = data.avatar[0].url.replace(`${config.imgCDN}/`, '')
      const savePhotos = []
      saveData.photos.forEach(item => {
        savePhotos.push(item.url.replace(`${config.imgCDN}/`, ''))
      })
      saveData.photos = savePhotos
      return saveData
    },
    _genResult(data) {
      if (data.avatar && !Array.isArray(data.avatar)) {
        data.avatar = [
          {
            name: data.avatar,
            url: `${config.imgCDN}/${data.avatar}`
          }
        ]
      }
      if (data.photos) {
        const newPhotos = []
        data.photos.forEach(item => {
          newPhotos.push({
            name: item,
            url: `${config.imgCDN}/${item}`
          })
        })
        data.photos = newPhotos
      }
      return data
    }
  },
  created() {
    const { id } = this.$route.params
    if (id) {
      this.getDoctorById(id)
    }
  },
  components: {
    Sticky,
    MDinput,
    Upload,
    Tag
  }
}
</script>

<style lang="scss">
.createPost-main-container {
  padding: 40px 45px 20px 50px;
}
</style>
