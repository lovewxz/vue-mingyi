import api from '../../api'
import { controller, get, required } from '../../lib/decorator/router'

@controller('admin')
export class doctorController {
  @get('doctors')
  async getDoctorList(ctx, next) {
    const { limit } = ctx.query || 10
    const { page } = ctx.query || 1
    const doctors = await api.doctor.getDoctorList(limit, page)
    const count = await api.doctor.getDoctorCount()
    ctx.body = {
      success: true,
      data: {
        list: doctors,
        total: count
      }
    }
  }
  @get('doctors/:_id')
  async getDoctorById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (_id) {
      ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    const doctor = await api.doctor.getDoctorById(_id)
    ctx.body = {
      success: true,
      data: doctor
    }
  }
}
