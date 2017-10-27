import rp from 'request-promise'
import _ from 'lodash'
import { writeFileSync } from 'fs'
import { sleep } from './util'
import R from 'ramda'
import { resolve } from 'path'
import cheerio from 'cheerio'
import randomToken from 'random-token'
import QiniuSDK from '../lib/qiniuSDK'

let trueCase = []
const r = path => resolve(__dirname, path)

export const getYMCase = async(page = 1) => {
  const url = `http://m.yuemei.com/hospital/loadmorereg/id/10659/page/${page}`
  let body = await rp(url)
  body = JSON.parse(body)
  if (body.status !== 1) {
    return
  }
  trueCase = _.union(trueCase, body.data.list)
  if (body.data.list.length < 20) {
    console.log('爬完了')
    writeFileSync(r('../database/json/case.json'), JSON.stringify(trueCase, null, 2), 'utf-8')
    return
  } else {
    await sleep(200)
    page++
    getYMCase(page)
  }
}

const fetchYMCaseArticle = async(url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body, { decodeEntities: false })
  }
  const $ = await rp(options)
  const article = $('.head-cont .list-txt').html()
  return article
}

const fetchYMCaseDesc = async(url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body, { decodeEntities: false })
  }
  const $ = await rp(options)
  let beforeImgs = []
  $('.before-box div img').each(function () {
    let src = $(this).attr('src')
    beforeImgs.push(src)
  })
  let sections = []
  $('.page-list .li-order').each(function () {
    const id = $(this).find('.list-text a').attr('href').match(/[0-9]+/g)[0] || $(this).children('a').attr('href').match(/[0-9]+/g)[0]
    const title = $(this).find('.page').text()
    const text = $(this).find('.list-text a').html()
    const images = []
    $(this).find('.list-img img').each(function () {
      const that = this
      images.push($(that).attr('src'))
    })
    sections.push({
      id,
      title,
      text,
      images
    })
  })
  for (let i = 0; i < sections.length; i++) {
    const url = `http://m.yuemei.com/c/${sections[i].id}.html`
    const article = await fetchYMCaseArticle(url)
    sections[i].article = article
  }
  return sections
}

const checkCase = () => {
  const data = require(r('../database/json/mergeCase.json'))
  const newData = R.compose(
    R.map(item => {
      if (item.compare_photo && item.compare_photo.before && item.compare_photo.after) {
        delete item.compare_photo["0"]
        delete item.compare_photo["1"]
        item.compare_photo.before = item.compare_photo.before.replace(/(\/[0-9]+_[0-9]+)/, '')
        item.compare_photo.after = item.compare_photo.after.replace(/(\/[0-9]+_[0-9]+)/, '')
      }
      item.sections.forEach(i => {
        const newImgs = []
        if (i.images.length > 0) {
          i.images.forEach(image => {
            newImgs.push(image.replace(/(\/[0-9]+_[0-9]+)/, ''))
          })
        }
        if (i.article) {
          i.article = i.article.replace(/(\/[0-9]+_[0-9]+)/g, '')
          i.article = i.article.replace(/\n/g, '').trim()
        }
        if (i.text) {
          i.text = i.text.replace(/\n/g, '').trim()
          i.text = i.text.replace(/<p><\/p>/g, '')
        }
        i.images = newImgs
      })
      return item
    }),
    R.map(item => R.pick(['id', 'doctor', 'title', 'user_name','headImgUrl', 'contents', 'project', 'all_item', 'sections', 'compare_photo'])(item)),
    R.map(item => {
      item.headImgUrl = item.compare_photo.after
      item.id = Number(item.id)
      item.doctor = Number(item.doctor_user_id)
      item.project =  Number(item.tao_id)
      return item
    }),
    R.filter(i => i.id && i.compare_photo && !Array.isArray(i.compare_photo) )
  )(data)
  console.log(newData.length)
  writeFileSync(r('../database/json/checkYMCase.json'), JSON.stringify(newData, null, 2), 'utf-8')
}

export const uploadYMCase = async() => {
  let data = require(r('../database/json/checkYMCase.json'))
  // data = [
  //   data[0],
  //   data[1]
  // ]
  data = R.map(async(item) => {
    try {
      const Qiniu = new QiniuSDK()
      for (let i = 0; i < item.sections.length; i++) {
        const newImgs = []
        const matchedImgs = item.sections[i].article.match(/(\/\/.*?(.jpg|png))/g)
        if (matchedImgs && matchedImgs.length > 0) {
          for (let j = 0; j < matchedImgs.length; j++) {
            const key = `${item.sections[i].id}/${randomToken(32)}`
            const ret = await Qiniu.fetchImage(`http:${matchedImgs[j]}`, key)
            if (!ret.key) {
              return
            }
            await Qiniu.waterMarkImage(ret.key)
            console.log(ret)
            await sleep(100)
            item.sections[i].article = item.sections[i].article.replace(matchedImgs[j], ret.key)
            newImgs.unshift(ret.key)
          }
          item.sections[i].images = newImgs
        }
        if (item.compare_photo) {
          const beforeRet = await Qiniu.fetchImage(`http:${item.compare_photo.before}`, `${item.id}/${randomToken(32)}`)
          const afterRet = await Qiniu.fetchImage(`http:${item.compare_photo.after}`, `${item.id}/${randomToken(32)}`)
          if (beforeRet.key && afterRet.key) {
            item.compare_photo.before = beforeRet.key
            item.compare_photo.after = afterRet.key
            item.headImgUrl = afterRet.key
          }
        }
      }
      return item
    } catch (e) {
      console.error(e)
    }
  })(data)
  data = await Promise.all(data)
  writeFileSync(r('../database/json/finalYMCase.json'), JSON.stringify(data, null, 2), 'utf-8')
}

export const extractCase = () => {
  let data = require(r('../database/json/finalYMCase.json'))
  const caseList = R.map(item => {
    const diaryArr = []
    item.sections.forEach(article => diaryArr.push(article.id))
    item.sections = diaryArr
    return item
  })(data)
  writeFileSync(r('../database/json/finalYMCaseExtract.json'), JSON.stringify(caseList, null, 2), 'utf-8')

}

export const extractDiaryFromCase = () => {
  let data = require(r('../database/json/finalYMCase.json'))
  const result = []
  R.forEach(item => {
    let caseId = R.pick(['id'])(item)
    R.forEach(diaryData => {
      diaryData = R.pick(['id','article','title'])(diaryData)
      diaryData.caseId = caseId.id
      result.push(diaryData)
    })(item.sections)
  })(data)
  writeFileSync(r('../database/json/finalYMDiaryExtract.json'), JSON.stringify(result, null, 2), 'utf-8')
}

export const getCompleteCase = async() => {
  const data = require(r('../database/json/case.json'))
  for (let i = 0; i < data.length; i++) {
    // const url = `http://m.yuemei.com/c/1636701.html`
    const url = `http://m.yuemei.com/c/${data[i].id}.html`
    console.log(`正在爬${url}`)
    const sections = await fetchYMCaseDesc(url)
    data[i].sections = sections
  }
  writeFileSync(r('../database/json/mergeCase.json'), JSON.stringify(data, null, 2), 'utf-8')
}

extractDiaryFromCase()
