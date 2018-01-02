import { get, controller } from '../../lib/decorator/router'
import api from '../../api'

@controller('api')
export class caseController {
  @get('diaries')
  async getDiary(ctx, next) {
    const { limit } = ctx.query || 20
    const { page } = ctx.query || 1
    const status = 0
    const diaries = await api.diary.getDiaryList({ limit, page, status })
    const count =  await api.diary.getDiaryCount({})
    ctx.body = {
      success: true,
      data: {
        list: diaries,
        total: count
      }
    }
  }
  @get('diary/:caseId')
  async getDiariesByCaseId(ctx, next) {
    const { params } = ctx
    const { caseId } = params
    if (!caseId) {
      ctx.body = {
        success: false,
        err: 'caseid不存在'
      }
    }
    const diary = await api.diary.getDiariesByCaseId(caseId)
    ctx.body = {
      success: true,
      data: diary
    }
  }
  @get('diary/id/:_id')
  async getDiaryById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (!_id) {
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
}
