import config from '@/config'

export const transArticle = (data) => {
  if (!data) {
    return
  }
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  /* eslint-disable no-useless-escape */
  const imgReg = /<img.*?(?:>|\/>)/gi
  // 匹配src属性
  /* eslint-disable no-useless-escape */
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
  const arr = data.match(imgReg)
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      const src = arr[i].match(srcReg)
      // 当然你也可以替换src属性
      if (src[1]) {
        data = data.replace(src[1], `${config.imgCDN}/${src[1]}`)
      }
    }
  }
  return data
}

export const removeHTMLTag = (str) => {
  str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
  str = str.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
  str = str.replace(/ /ig, '') // 去掉
  return str
}

export const getImgSrc = (data) => {
  if (!data) {
    return
  }
  const imgArr = []
  // 匹配图片（g表示匹配所有结果i表示区分大小写）
  /* eslint-disable no-useless-escape */
  const imgReg = /<img.*?(?:>|\/>)/gi
  // 匹配src属性
  /* eslint-disable no-useless-escape */
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
  const arr = data.match(imgReg)
  if (arr) {
    for (let i = 0; i < arr.length; i++) {
      const src = arr[i].match(srcReg)
      // 当然你也可以替换src属性
      if (src[1]) {
        imgArr.push(src[1])
      }
    }
  }
  return imgArr
}
