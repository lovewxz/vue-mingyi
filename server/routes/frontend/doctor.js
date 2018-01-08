import { get, controller } from '../../lib/decorator/router'
import api from '../../api'

@controller('api')
export class doctorController {
  @get('doctor')
  async getDoctor(ctx, next) {
    const { limit } = ctx.query || 20
    const { page } = ctx.query || 1
    const doctors = await api.doctor.getDoctorList({ limit, page })
    const count =  await api.doctor.getDoctorCount({})
    ctx.body = {
      success: true,
      data: {
        list: doctors,
        total: count
      }
    }
  }
}