import config from '@/config'

export const cdnUrlMixin = {
  methods: {
    cdnName(url, width, height) {
      let size = height ? `?imageMogr2/thumbnail/!${width}x${width}r|imageView2/1/w/${width}/h/${height}` : `?imageMogr2/thumbnail/!${width}x${width}r|imageView2/1/w/${width}/h/${width}`
      const completeUrl = width === 0 ? `${config.imgCDN}/${url}` : `${config.imgCDN}/${url}${size}`
      return completeUrl
    }
  }
}
