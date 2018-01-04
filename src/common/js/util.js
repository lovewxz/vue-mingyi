import config from '@/config'

const getDomSrc = (str, tag, attribute = 'src') => {
  const regStr = `<${tag}[^>]+${attribute}=['"]([^'"]+)['"]+`
  const reg = new RegExp(regStr, 'g')
  let arr = []
  let tem = ''
  while ((tem = reg.exec(str)) !== null) {
    arr.push(tem[1])
  }
  return arr
}

export const transArticle = (data) => {
  if (!data) {
    return
  }
  const imgRes = getDomSrc(data, 'img')
  imgRes.forEach((item) => {
    data = data.replace(item, `${config.imgCDN}/${item}`)
    return data
  })
  if (data.indexOf('video') > 0) {
    const videoRes = getDomSrc(data, 'video', 'poster')
    videoRes.forEach((item) => {
      const regStr = new RegExp(item, 'g')
      data = data.replace(regStr, `${config.imgCDN}/${item}`)
      return data
    })
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
  const result = getDomSrc(data, 'img')
  return result
}

export const urlEncode = (params) => {
  let str = ''
  for (let [key, value] of Object.entries(params)) {
    str += `&${key}=${encodeURIComponent(value)}`
  }
  return str.substring(1)
}
