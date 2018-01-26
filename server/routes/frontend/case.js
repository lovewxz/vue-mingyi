import { get, controller } from '../../lib/decorator/router'
import api from '../../api'

@controller('api')
export class caseController {
  @get('pcase')
  async getPcase(ctx, next) {
    const { limit } = ctx.query || 10
    const { page } = ctx.query || 1
    const status = 0
    const pcases = await api.pcase.getPcaseList({ limit, page, status })
    const count = await api.pcase.getPcaseCount({ status })
    ctx.body = {
      success: true,
      data: {
        list: pcases,
        total: count
      }
    }
  }
  @get('pcase/list/:_id')
  async getPcaseById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (!_id) {
      return (ctx.body = {
        success: false,
        err: 'id不存在'
      })
    }
    const Pcase = await api.pcase.getPcaseById(_id)
    ctx.body = {
      success: true,
      data: Pcase
    }
  }

  @get('pcase/doctor')
  async getPcaseByDoctorId(ctx, next) {
    const { limit, page, id } = ctx.query
    if (!id) {
      return (ctx.body = {
        success: false,
        err: 'id不存在'
      })
    }
    const params = {
      limit,
      page,
      id,
      status: 0
    }
    const Pcase = await api.pcase.getPcaseByDoctorId(params)
    return (ctx.body = {
      success: true,
      data: Pcase
    })
  }
}
