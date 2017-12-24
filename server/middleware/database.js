import mongoose from 'mongoose'
import config from '../config'
import { resolve } from 'path'
import R from 'ramda'
import glob from 'glob'
import bluebird from 'bluebird'

const model = resolve(__dirname, '../database/schema')
const r = (path) => resolve(__dirname, path)
glob.sync(resolve(model, './*.js')).forEach(require)

const formateData = (id) => {
  return R.map(i => {
    i._id = i[id]
    return i
  })
}
let doctorData = require(r('../database/json/finalYMDoctor.json'))
let projectData = require(r('../database/json/finalYMProject.json'))
let caseData = require(r('../database/json/finalYMCaseExtract.json'))
let diaryData = require(r('../database/json/finalYMDiaryExtract.json'))

doctorData = formateData('id')(doctorData)
projectData = formateData('id')(projectData)
caseData = formateData('id')(caseData)
diaryData = formateData('id')(diaryData)

export const database = app => {
  mongoose.set('debug', true)
  mongoose.Promise = bluebird
  mongoose.connect(config.db, { useMongoClient: true })
  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db, { useMongoClient: true })
  })
  mongoose.connection.on('err', (err) => {
    console.error(err)
  })
  mongoose.connection.on('open', async() => {
    console.log('Connect to MongoDB', config.db)

    const Doctor = mongoose.model('Doctor')
    const Project = mongoose.model('Project')
    const Case = mongoose.model('Case')
    const Admin = mongoose.model('Admin')
    const Diary = mongoose.model('Diary')

    const existDoctor = await Doctor.find({}).exec()
    const existProject = await Project.find({}).exec()
    const existCase = await Case.find({}).exec()
    const existDiary = await Diary.find({}).exec()

    if (!existDoctor.length) Doctor.insertMany(doctorData)
    if (!existProject.length) Project.insertMany(projectData)
    if (!existCase.length) Case.insertMany(caseData)
    if (!existDiary.length) Diary.insertMany(diaryData)

    let admin = await Admin.findOne({
      email: 'yaojun@qq.com',
    }).exec()

    if(!admin) {
      console.log('用户写入数据库')
      admin = new Admin({
        email: 'yaojun@qq.com',
        password: '123456',
        role: 'admin',
        nickname: '豆阿豆阿',
        headimgurl: 'http://image.0755mingyi.com/100.png'
      })
      await admin.save()
    }
  })
}
