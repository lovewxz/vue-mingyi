import rp from 'request-promise'
import _ from 'lodash'
import { writeFileSync } from 'fs'
import { sleep } from './util'
import R from 'ramda'
import { resolve } from 'path'
import cheerio from 'cheerio'
import randomToken from 'random-token'
import QiniuSDK from '../lib/qiniuSDK'

const r = path => resolve(__dirname, path)

let doctor = []
export const getYMDoctor = async (page = 1) => {
  const url = `http://m.yuemei.com/hospital/loadmoredoctor/id/10659/page/${page}`
  console.log(`正在爬${page}页的数据`)
  let body = await rp(url)
  body = JSON.parse(body)
  if (body.status !== 1) {
    return
  }
  doctor = _.union(doctor, body.data)
  writeFileSync(
    r('../database/json/doctor.json'),
    JSON.stringify(doctor, null, 2),
    'utf-8'
  )
  if (body.data.length < 20) {
    console.log('爬完了')
    return
  } else {
    await sleep(200)
    page++
    getYMDoctor(page)
  }
}

const getYMDoctorProject = async (url, count) => {
  const projects = []
  const getProjects = async (page = 1) => {
    console.log(`正在爬${url}index/p${page}.html`)
    if (count > projects.length) {
      const options = {
        uri: `${url}index/p${page}.html`,
        transform: body => cheerio.load(body, { decodeEntities: false })
      }
      const $ = await rp(options)
      if ($.text().trim() === '') {
        return projects
      }
      $('a.list-a').each(function() {
        const projectId = $(this)
          .attr('href')
          .match(/\/([0-9]+)\/$/)[1]
        projects.push(Number(projectId))
      })
      console.log(projects.length)
      page++
      await getProjects(page)
    } else {
      console.log('爬完了')
      return projects
    }
  }
  await getProjects()
  return projects
}

const getYMDoctorCase = async (url, count) => {
  let cases = []
  const getCases = async (page = 1) => {
    if (count > cases.length) {
      console.log(`正在爬${url}reviewsall/p${page}.html`)
      const options = {
        uri: `${url}reviewsall/p${page}.html`,
        transform: body => cheerio.load(body, { decodeEntities: false })
      }
      const $ = await rp(options)
      if ($.text().trim() === '') {
        return cases
      }
      $('a.boxItem2').each(function() {
        const caseId = $(this)
          .attr('href')
          .match(/\/([0-9]+).html$/)[1]
        cases.push(Number(caseId))
      })
      console.log(cases.length)
      page++
      await getCases(page)
    } else {
      console.log('爬完了')
      return cases
    }
  }
  await getCases()
  return cases
}

export const getYMDoctorDesc = async () => {
  const data = require(r('../database/json/doctor.json'))
  for (let i = 0; i < data.length; i++) {
    const options = {
      uri: `http:${data[i].url}`,
      transform: body => cheerio.load(body, { decodeEntities: false })
    }
    const $ = await rp(options)
    const desc = $('.introduction-cont p').text()
    data[i].desc = desc
    let proCount = $('nav.doc-nav .now')
      .text()
      .match(/([0-9]+)/)
    proCount = proCount === null ? 0 : Number(proCount[1])
    data[i].project = await getYMDoctorProject(`http:${data[i].url}`, proCount)
    let caseCount = $('nav.doc-nav li')
      .eq(1)
      .text()
      .match(/([0-9]+)/)
    caseCount = caseCount === null ? 0 : Number(caseCount[1])
    data[i].case = await getYMDoctorCase(`http:${data[i].url}`, caseCount)
  }
  writeFileSync(
    r('../database/json/mergeDoctor.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

const omitYMDoctor = item => {
  return R.compose(
    R.pick([
      'id',
      'realname',
      'title',
      'avatar',
      'range',
      'desc',
      'project',
      'case'
    ]),
    i => {
      for (let [k, v] of Object.entries(i)) {
        if (v == null) {
          delete i[k]
        }
        if (typeof v === 'string' && v.trim() === '') {
          delete i[k]
        }
        if (v instanceof Array && v.length <= 0) {
          delete i[k]
        }
      }
      i.id = i.url.match(/\/dr\/([0-9]+)/)[1]
      i.avatar = i.avatar.replace('_50_50', '_160_160')
      return i
    }
  )(item)
}

const validateDoctor = doctor => {
  const projectData = require(r('../database/json/checkYMProject.json'))
  const caseData = require(r('../database/json/checkYMCase.json'))
  if (doctor.project) {
    doctor.project = doctor.project.filter(item => {
      return !!_.find(projectData, data => {
        return item === data.id
      })
    })
  }
  if (doctor.case) {
    doctor.case = doctor.case.filter(item => {
      return !!_.find(caseData, data => {
        return item === data.id
      })
    })
  }
  return doctor
}

export const checkYMDoctor = () => {
  let data = require(r('../database/json/mergeDoctor.json'))
  const newData = R.compose(
    R.map(omitYMDoctor),
    R.map(validateDoctor),
    R.filter(i => i.url)
  )(data)

  writeFileSync(
    r('../database/json/checkDoctor.json'),
    JSON.stringify(newData, null, 2),
    'utf-8'
  )
}

export const uploadYMDoctor = async () => {
  const data = require(r('../database/json/checkDoctor.json'))
  for (let i = 0; i < data.length; i++) {
    try {
      const key = `${data[i].id}/${randomToken(32)}`
      const qiniu = new QiniuSDK()
      const ret = await qiniu.fetchImage(`http:${data[i].avatar}`, key)
      data[i].avatar = ret.key
    } catch (e) {
      console.error(e)
    }
  }
  writeFileSync(
    r('../database/json/finalYMDoctor.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

uploadYMDoctor()
