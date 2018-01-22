import { post, get, controller } from '../../lib/decorator/router'
import api from '../../api'

@controller('api')
export class userController {
  @post('user/favorproject')
  async setFavorProject(ctx, next) {
    const { _id, project } = ctx.request.body
    const res = await api.user.updateFavorProjectById(_id, project)
    ctx.body = {
      success: true,
      data: res
    }
  }
  @post('user/favordoctor')
  async setFavorProject(ctx, next) {
    const { _id, doctor } = ctx.request.body
    const res = await api.user.updateFavorDoctorById(_id, doctor)
    ctx.body = {
      success: true,
      data: res
    }
  }
  @get('user/favorproject/list')
  async getFavorList(ctx, next) {
    const { _id } = ctx.request.query
    const res = await api.user.getFavorList(_id)
    ctx.body = {
      success: true,
      data: res
    }
  }
}
