import { get, controller } from '../../lib/decorator/router'
import api from '../../api'

@controller('api')
export class caseController {
  @get('cases')
  async getCases(ctx, next) {
    const { limit } = ctx.query || 10
    const { page } = ctx.query || 1
    const cases = await api.peopleCase.getCases(limit, page)
    const count = await api.peopleCase.getCasesCount()
    ctx.body = {
      success: true,
      data: {
        list: cases,
        total: count
      }
    }
  }
  @get('cases/list/:_id')
  async getCaseById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (_id) {
      ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    const pepleCase = await api.peopleCase.getCaseById(_id)
    ctx.body = {
      success: true,
      data: pepleCase
    }
  }
}
