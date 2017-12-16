import config from '@/config'
import { mapActions } from 'vuex'

export const cdnUrlMixin = {
  methods: {
    cdnName(url, width, height) {
      let size = height ? `?imageMogr2/thumbnail/!${width}x${width}r|imageView2/1/w/${width}/h/${height}` : `?imageMogr2/thumbnail/!${width}x${width}r|imageView2/1/w/${width}/h/${width}`
      const completeUrl = width === 0 ? `${config.imgCDN}/${url}` : `${config.imgCDN}/${url}${size}`
      return completeUrl
    }
  }
}

export const wxInit = {
  methods: {
    wxInit(url) {
      const wx = window.wx
      this.getWXSignature(url).then(res => {
        res = res.data
        if (res.success) {
          const params = res.params
          wx.config({
            debug: true,
            appId: params.appID,
            timestamp: params.timestamp,
            nonceStr: params.noncestr,
            signature: params.signature,
            jsApiList: [
              'previewImage',
              'uploadImage',
              'downloadImage',
              'chooseImage',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'hideAllNonBaseMenuItem',
              'chooseWXPay'
            ]
          })
          wx.ready(() => {
            console.log('success')
          })
        } else {
          throw new Error('不能获取服务器签名')
        }
      })
    },
    ...mapActions([
      'getWXSignature'
    ])
  }
}
