import rp from 'request-promise'
import _ from 'lodash'
import { writeFileSync } from 'fs'
import { sleep } from './util'
import R from 'ramda'
import { resolve } from 'path'
import cheerio from 'cheerio'
import randomToken from 'random-token'
import QiniuSDK from '../lib/qiniuSDK'

let project = []
const r = path => resolve(__dirname, path)

export const getYMProject = async (page = 1) => {
  const url = `http://m.yuemei.com/hospital/loadmoreservice/id/10659/page/${page}`
  console.log(`正在爬${page}页的数据`)
  let body = await rp(url)
  body = JSON.parse(body)
  if (body.status !== 1) {
    return
  }
  project = _.union(project, body.data)
  if (body.data.length < 20) {
    console.log('爬完了')
    writeFileSync(
      r('../database/json/project.json'),
      JSON.stringify(project, null, 2),
      'utf-8'
    )
    return
  } else {
    await sleep(200)
    page++
    getYMProject(page)
  }
}

const fetchYMProjectDescAndParamsAndDetailImgs = async url => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body)
  }
  const $ = await rp(options)
  let desc = $('.mainTit')
    .children('p')
    .text()
  let detailImgs = []
  $('.swiper-container .swiper-wrapper .swiper-slide a img').each(function() {
    const img = $(this).attr('src')
    detailImgs.push(img)
  })
  let params = []
  $('table.archives-data tbody tr').each(function() {
    params.push({
      key: $(this)
        .find('td')
        .eq(0)
        .text(),
      value: $(this)
        .find('td')
        .eq(1)
        .text()
    })
  })
  let doctorId = $('.outerBase .docBox')
    .attr('href')
    .match(/\/dr\/(.*?)\/$/)[1]
  return {
    detail_images: detailImgs,
    params,
    doctor: doctorId,
    description: desc
  }
}

export const getYMProjectDetail = async () => {
  const data = require(r('../database/json/project.json'))
  for (let i = 0; i < data.length; i++) {
    const url = `http://m.yuemei.com/tao/${data[i].id}/`
    console.log(`正在爬${url}`)
    const desc = await fetchYMProjectDescAndParamsAndDetailImgs(url)
    await sleep(200)
    data[i].cover_image = data[i].small_image
    data[i] = R.compose(
      R.pick([
        'title',
        'id',
        'price',
        'original_price',
        'cover_image',
        'doctor',
        'params',
        'description',
        'detail_images'
      ]),
      R.merge(desc)
    )(data[i])
  }
  R.filter(i => i.id && i.detail_images.length > 0 && i.doctor)(data)
  writeFileSync(
    r('../database/json/mergeProject.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  )
  return data
}

export const checkYMProject = () => {
  let data = require(r('../database/json/mergeProject.json'))
  R.compose(
    R.map(item => {
      if (item.price) {
        item.price = item.price + ''
      }
      if (item.cover_image) {
        item.cover_image = item.cover_image.replace(/(\/[0-9]+_[0-9]+)/, '')
      }
      return item
    })
  )(data)

  writeFileSync(
    r('../database/json/checkYMProject.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  )
  return data
}

export const uploadYMProject = async () => {
  let data = require(r('../database/json/checkYMProject.json'))
  // data = [
  //   data[0],
  //   data[1]
  // ]
  data = R.map(async item => {
    try {
      const key = `${item.id}/${randomToken(32)}`
      const Qiniu = new QiniuSDK()
      const ret = await Qiniu.fetchImage(item.cover_image, key)
      item.cover_image = ret.key
      for (let i = 0; i < item.detail_images.length; i++) {
        let _key = `${item.id}/${randomToken(32)}`
        await Qiniu.fetchImage(item.detail_images[i], _key)
        await sleep(100)
        item.detail_images[i] = _key
      }
    } catch (e) {
      console.error(e)
    }
    return item
  })(data)
  data = await Promise.all(data)
  writeFileSync(
    r('../database/json/finalYMProject.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

uploadYMProject()
