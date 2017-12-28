import api from '../../api'
import { controller, get, required, checkToken } from '../../lib/decorator/router'

@controller('admin')
export class doctorController {
  @get('doctor')
  @checkToken()
  async getDoctorList(ctx, next) {
    let condition = ctx.query
    const doctors = await api.doctor.getDoctorList(condition)
    const count = await api.doctor.getDoctorCount()
    ctx.body = {
      success: true,
      data: {
        list: doctors,
        total: count
      }
    }
  }
  @get('doctor/:_id')
  @checkToken()
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
