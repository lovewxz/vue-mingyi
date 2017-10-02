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
