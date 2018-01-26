<template lang="html">
  <div class="quil-editor">
    <quill-editor :content="article" class="vue-editor" ref="editor" :options="editorOption" @change="onEditorChange($event)" @focus="onEditorFocus($event)">
      <div id="toolbar" slot="toolbar">
        <el-button-group>
          <el-button class="ql-bold">Bold</el-button>
          <el-button class="ql-italic">Italic</el-button>
          <el-button @click.native="uploadImgHandler">
            <svg viewBox="0 0 18 18">
              <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
              <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
              <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
            </svg>
          </el-button>
          <el-button @click.native="uploadVideoHandler">
            <svg viewBox="0 0 18 18">
              <rect class="ql-stroke" height="12" width="12" x="3" y="3"></rect>
              <rect class="ql-fill" height="12" width="1" x="5" y="3"></rect>
              <rect class="ql-fill" height="12" width="1" x="12" y="3"></rect>
              <rect class="ql-fill" height="2" width="8" x="5" y="8"></rect>
              <rect class="ql-fill" height="1" width="3" x="3" y="5"></rect>
              <rect class="ql-fill" height="1" width="3" x="3" y="7"></rect>
              <rect class="ql-fill" height="1" width="3" x="3" y="10"></rect>
              <rect class="ql-fill" height="1" width="3" x="3" y="12"></rect>
              <rect class="ql-fill" height="1" width="3" x="12" y="5"></rect>
              <rect class="ql-fill" height="1" width="3" x="12" y="7"></rect>
              <rect class="ql-fill" height="1" width="3" x="12" y="10"></rect>
              <rect class="ql-fill" height="1" width="3" x="12" y="12"></rect>
            </svg>
          </el-button>
        </el-button-group>
        <select class="ql-size">
          <option value="small" >小号</option>
          <option selected>普通</option>
          <option value="large">大号</option>
          <option value="huge">超大号</option>
        </select>
      </div>
    </quill-editor>
    <el-dialog :visible.sync="uploadImgShow" title="上传图片">
      <upload upload-type="image" :file-list="fileList.image" ref="uploadImg" @processing="processing"  @processed="processed"></upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="uploadImgShow = false">取消</el-button>
        <el-button type="primary" @click.native="insertEditor('image')" :disabled="btnStatus">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="uploadVideoShow" title="上传视频">
      <upload upload-type="video" :file-list="fileList.video" ref="uploadVideo" @processing="processing"  @processed="processed"></upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="uploadVideoShow = false">取消</el-button>
        <el-button type="primary" @click.native="insertEditor('video')" :disabled="btnStatus">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import Upload from 'components/upload/upload'
import Quill from 'quill'
import { registerBlot } from './blot'
registerBlot()

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      article: '',
      editorOption: {
        modules: {
          toolbar: '#toolbar'
        }
      },
      editorContent: '',
      uploadVideoShow: false,
      uploadImgShow: false,
      uploadType: 'image',
      fileList: {
        image: [],
        video: []
      },
      btnStatus: false,
      editorSelection: 0
    }
  },
  watch: {
    content(newVal) {
      this.article = newVal
    },
    article(newVal) {
      this.$emit('articleChange', newVal)
    }
  },
  methods: {
    onEditorFocus() {
      this.editorSelection = this.$refs.editor.quill.getSelection().index
    },
    onEditorChange({ editor, html, text }) {
      this.article = html
    },
    insertEditor(type) {
      if (!this.fileList[type].length) {
        return
      }
      const quillHook = this.$refs.editor.quill
      this.fileList[type].forEach(item => {
        this.insertEmbed(type, item.url)
      })
      this.fileList[type] = []
      type === 'video'
        ? (this.uploadVideoShow = false)
        : (this.uploadImgShow = false)
    },
    insertEmbed(type, url) {
      const quillHook = this.$refs.editor.quill
      const selection = this.editorSelection > 0 ? this.editorSelection : 0
      let options = {}
      if (type === 'video') {
        options = {
          url: `${url}_video`,
          poster: url,
          controls: true
        }
        quillHook.insertEmbed(selection, 'customVideo', options)
      } else {
        options = url
        quillHook.insertEmbed(selection, 'image', options)
      }
    },
    uploadImgHandler() {
      this.uploadImgShow = true
    },
    uploadVideoHandler() {
      this.uploadVideoShow = true
    },
    processing() {
      this.btnStatus = true
      this.$message({
        type: 'warning',
        message: '正在处理请稍后...'
      })
    },
    processed() {
      this.btnStatus = false
      this.$message({
        type: 'success',
        message: '处理成功'
      })
    }
  },
  components: {
    quillEditor,
    Upload
  }
}
</script>

<style lang="scss">

</style>
