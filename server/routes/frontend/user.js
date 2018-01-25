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
  async setFavorDoctor(ctx, next) {
    const { _id, doctor } = ctx.request.body
    const res = await api.user.updateFavorDoctorById(_id, doctor)
    ctx.body = {
      success: true,
      data: res
    }
  }
  @get('user/favorlist')
  async getFavorList(ctx, next) {
    const { _id } = ctx.request.query
    const res = await api.user.getFavorList(_id)
    ctx.body = {
      success: true,
      data: res
    }
  }
  @get('user/favordoctor')
  async getFavorDoctorList(ctx, next) {
    const { limit, page, _id } = ctx.request.query
    const user = await api.user.getUserById(_id)
    if (!user) {
      ctx.body = {
        success: false,
        err: '用户不存在'
      }
    }
    const list = await api.user.getFavorDoctorList({ limit, page, _id })
    const total = user.favorDoctor.length
    ctx.body = {
      success: true,
      data: {
        list: list.favorDoctor,
        total: total
      }
    }
  }
  @get('user/favorproject')
  async getFavorProjectList(ctx, next) {
    const { limit, page, _id } = ctx.request.query
    const user = await api.user.getUserById(_id)
    if (!user) {
      ctx.body = {
        success: false,
        err: '用户不存在'
      }
    }
    const list = await api.user.getFavorProjectList({ limit, page, _id })
    const total = user.favorProject.length
    ctx.body = {
      success: true,
      data: {
        list: list.favorProject,
        total: total
      }
    }
  }
}
