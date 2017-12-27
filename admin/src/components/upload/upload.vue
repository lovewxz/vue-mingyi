<template>
  <el-upload list-type="picture-card"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :on-change="handleChange"
    :before-upload="beforeUpload"
    action="//up-z2.qiniu.com/"
    :data="imgData"
    :file-list="fileList"
    class="upload"
    ref="upload"
    multiple>
    <i class="el-icon-plus"></i>
  </el-upload>
</template>
<script>
import api from 'js/axios'
import randomToken from 'random-token'
import config from 'js/config'

export default {
  props: {
    uploadType: {
      type: String,
      default: 'image'
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // pic
      imgData: {},
      fileListLen: 0
    }
  },
  methods: {
    handleSuccess(response, file, filelist) {
      this.fileListLen = filelist.length
    },
    handleChange(file, filelist) {
      const checkAllSuccess = filelist.every(item => item.status === 'success')
      if (checkAllSuccess) {
        this.$emit('processing')
        filelist.forEach(async (item) => {
          if (item.response && item.response.persistentId) {
            await this._loopGetPrefopStatus(item.response.persistentId)
          }
        })
      }
    },
    handleRemove(file, filelist) {
      const index = this.fileList.findIndex((item) => {
        return item.uid === file.uid
      })
      this.fileList.splice(index, 1)
    },
    async beforeUpload(file) {
      console.log(file)
      let key = randomToken(32)
      let params = { key }
      if (this.uploadType === 'image') {
        params = Object.assign({}, params, {type: 'image'})
      } else if (this.uploadType === 'video') {
        params = Object.assign({}, params, {type: 'video'})
      }
      await api.fetchQiniuToken(params).then(res => {
        const response = res.data.data
        this.imgData = {
          key,
          token: response.upToken
        }
      })
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
    async _loopGetPrefopStatus(persistentId) {
      let res = await api.prefopStatus(persistentId)
      res = JSON.parse(res.data.data)
      if (res.code === 0 && res.items) {
        this.fileList.push({
          name: res.items[0].key,
          url: `${config.imgCDN}/${res.items[0].key}`
        })
        if (this.fileList.length === this.fileListLen) {
          this.$emit('processed')
        }
      } else if (res.code === 3){
        this.$message({
          type: 'error',
          message: '上传失败,请刷新重新上传'
        })
        return
      } else {
        setTimeout(async () => {
          await this._loopGetPrefopStatus(persistentId)
        }, 500)
      }
    }
  }
}
</script>
<style lang="scss">
.upload {}
</style>
