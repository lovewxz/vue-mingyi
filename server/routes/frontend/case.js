import { get, controller } from '../../lib/decorator/router'
import api from '../../api'

@controller('api')
export class caseController {
  @get('cases')
  async getPcase(ctx, next) {
    const { limit } = ctx.query || 10
    const { page } = ctx.query || 1
    const status = 0
    const pcases = await api.pcase.getPcaseList({ limit, page, status })
    const count = await api.pcase.getPcaseCount({})
    ctx.body = {
      success: true,
      data: {
        list: pcases,
        total: count
      }
    }
  }
  @get('cases/list/:_id')
  async getPcaseById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (_id) {
      ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    const Pcase = await api.pcase.getPcaseById(_id)
    ctx.body = {
      success: true,
      data: Pcase
    }
  }
}
