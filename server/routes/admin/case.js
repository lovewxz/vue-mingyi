import { get, controller, put, del, post, checkToken } from '../../lib/decorator/router'
import api from '../../api'
import xss from 'xss'
import R from 'ramda'
import randomToken from 'random-token'

@controller('admin')
export class pcaseController {
  @get('pcases')
  @checkToken()
  async getPcaseList(ctx, next) {
    let pcases = ''
    let count = ''
    const { limit } = ctx.query || 10
    const { page } = ctx.query || 1
    let { keyword } = ctx.query || ''
    if (keyword) {
      const reg = new RegExp(xss(decodeURIComponent(keyword)), 'i')
      pcases = await api.pcase.getPcaseList(limit, page, reg)
      count = await api.pcase.getPcaseCount(reg)
    } else {
      pcases = await api.pcase.getPcaseList(limit, page)
      count =  await api.pcase.getPcaseCount()
    }
    ctx.body = {
      success: true,
      data: {
        list: pcases,
        total: count
      }
    }
  }
  @get('pcases/:_id')
  @checkToken()
  async getPcaseById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (_id) {
      ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    const pcase = await api.pcase.getPcaseById(_id)
    ctx.body = {
      success: true,
      data: pcase
    }
  }
  @put('pcases')
  @checkToken()
  async putPcase(ctx, next) {
    let body = ctx.request.body
    const { _id } = body
    if (!_id) {
      return ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    let pcase = await api.pcase.getPcaseById(_id)
    if (!pcase) {
      return ctx.body = {
        success: false,
        err: '项目不存在'
      }
    }
    pcase.title = xss(body.title)
    pcase.user_name = xss(body.user_name)
    pcase.contents = xss(body.contents)
    pcase.doctor = xss(body.doctor)
    pcase.project = xss(body.project)
    pcase.all_item = R.map(xss)(body.all_item)
    pcase.compare_photo = R.forEachObjIndexed((v,k) => ({
      k: xss(v)
    }))(body.compare_photo)
    pcase.isTop = xss(body.isTop)
    try {
      pcase = await api.pcase.update(pcase)
      ctx.body = {
        success: true,
        data: pcase
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
  @put('pcase/del')
  @checkToken()
  async delPcase(ctx, next) {
    let body = ctx.request.body
    const { _id } = body
    const { status } = body
    if (!_id) {
      return ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    let pcase = await api.pcase.getPcaseById(_id)
    if (!pcase) {
      return ctx.body = {
        success: false,
        err: '项目不存在'
      }
    }
    try {
      pcase = await api.pcase.updateStatus(_id, xss(status))
      ctx.body = {
        success: true,
        data: pcase
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
  @post('pcases')
  @checkToken()
  async createPcase(ctx, next) {
    let body = ctx.request.body
    body = {
      _id: randomToken(32),
      title: xss(body.title),
      user_name: xss(body.user_name),
      contents: xss(body.contents),
      doctor: xss(body.doctor),
      project: xss(body.project),
      all_item: R.map(xss)(body.all_item),
      compare_photo: R.forEachObjIndexed((v,k) => {k: xss(v)})(body.compare_photo),
      isTop: xss(body.isTop)
    }
    try {
      const pcase = await api.pcase.save(body)
      return ctx.body = {
        success: true,
        data: pcase
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

}
