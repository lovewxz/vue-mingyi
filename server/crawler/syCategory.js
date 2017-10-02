import cheerio from 'cheerio'
import rp from 'request-promise'
import { sleep } from './util'
import { resolve } from 'path'
import { writeFileSync } from 'fs'

const r = path => resolve(__dirname, path)

export const getSYCategory = async() => {
  const url = `http://m.soyoung.com/itemcity/product?lver=6.3.9`
  let body = await rp(url)
  body = JSON.parse(body)
  let data = ''
  if (body.errorCode === 0) {
    data = body.responseData.menu1_info
  }
  writeFileSync(r('../database/json/category.json'), JSON.stringify(data, null, 2), 'utf-8')
}

getSYCategory()
