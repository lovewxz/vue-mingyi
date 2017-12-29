import { get, controller, put, del, post, checkToken } from '../../lib/decorator/router'
import api from '../../api'
import xss from 'xss'
import R from 'ramda'
import randomToken from 'random-token'

@controller('admin')
export class diaryController {
  @get('diary')
  @checkToken()
  async getDiaryList(ctx, next) {
    let diary = ''
    let count = ''
    const { limit } = ctx.query || 10
    const { page } = ctx.query || 1
    let { keyword } = ctx.query || ''
    if (keyword) {
      const reg = new RegExp(xss(decodeURIComponent(keyword)), 'i')
      diary = await api.diary.getDiaryList(limit, page, reg)
      count = await api.diary.getDiaryCount(reg)
    } else {
      diary = await api.diary.getDiaryList(limit, page)
      count =  await api.diary.getDiaryCount()
    }
    ctx.body = {
      success: true,
      data: {
        list: diary,
        total: count
      }
    }
  }
  @get('diary/:_id')
  @checkToken()
  async getDiaryById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (_id) {
      ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    const diary = await api.diary.getDiaryById(_id)
    ctx.body = {
      success: true,
      data: diary
    }
  }
  @get('diary/case/:caseId')
  @checkToken()
  async getDiariesByCaseId(ctx, next) {
    const { params } = ctx
    const { caseId } = params
    if (caseId) {
      ctx.body = {
        success: false,
        err: '案例不存在'
      }
    }
    const diary = await api.diary.getDiariesByCaseId(caseId)
    ctx.body = {
      success: true,
      data: diary
    }
  }
  @put('diary')
  @checkToken()
  async putDiary(ctx, next) {
    let body = ctx.request.body
    const { _id } = body
    if (!_id) {
      return ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    let diary = await api.diary.getDiaryById(_id)
    if (!diary) {
      return ctx.body = {
        success: false,
        err: '项目不存在'
      }
    }
    diary._id = xss(body._id)
    diary.title = xss(body.title)
    diary.article = xss.friendlyAttrValue(body.article)
    diary.caseId =xss(body.caseId)
    try {
      diary = await api.diary.update(diary)
      ctx.body = {
        success: true,
        data: diary
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
  @put('diary/del')
  @checkToken()
  async delDiary(ctx, next) {
    let body = ctx.request.body
    const { _id } = body
    const { status } = body
    if (!_id) {
      return ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    let diary = await api.diary.getDiaryById(_id)
    if (!diary) {
      return ctx.body = {
        success: false,
        err: '项目不存在'
      }
    }
    try {
      diary = await api.diary.updateStatus(_id, xss(status))
      ctx.body = {
        success: true,
        data: diary
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
  @post('diary')
  @checkToken()
  async createDiary(ctx, next) {
    let body = ctx.request.body
    body = {
      _id: randomToken(32),
      title: xss(body.title),
      caseId: xss(body.caseId),
      article: xss.friendlyAttrValue(body.article),
      caseId: xss(body.caseId)
    }
    try {
      const diary = await api.diary.save(body)
      return ctx.body = {
        success: true,
        data: diary
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

}
