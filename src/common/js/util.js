import cheerio from 'cheerio'
import config from '@/config'

export const transArticle = (data) => {
  if (!data) {
    return
  }
  const $ = cheerio.load(data)
  if ($('img') == null) {
    return
  }
  $('img').each(function () {
    const oldSrc = $(this).attr('src')
    const newSrc = `${config.imgCDN}/${oldSrc}`
    data = data.replace(oldSrc, newSrc)
  })
  return data
}

export const removeHTMLTag = (str) => {
  str = str.replace(/<\/?[^>]*>/g, '') // 去除HTML tag
  str = str.replace(/[ | ]*\n/g, '\n') // 去除行尾空白
  str = str.replace(/ /ig, '') // 去掉
  return str
}

export const getImgSrc = (data) => {
  const imgArr = []
  if (!data) {
    return
  }
  const $ = cheerio.load(data)
  if ($('img') == null) {
    return
  }
  $('img').each(function () {
    const src = $(this).attr('src')
    imgArr.push(src)
  })
  return imgArr
}
