import { get, controller } from '../../lib/decorator/router'
import api from '../../api'

@controller('api')
export class projectController {
  @get('projects')
  async getProjectList(ctx, next) {
    const { limit } = ctx.query || 10
    const { page } = ctx.query || 1
    const projects = await api.project.getProjectList(limit, page)
    const count = await api.project.getProjectCount()
    ctx.body = {
      success: true,
      data: {
        list: projects,
        total: count
      }
    }
  }
  @get('projects/:_id')
  async getProjectById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (_id) {
      ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    const project = await api.project.getProjectById(_id)
    ctx.body = {
      success: true,
      data: project
    }
  }
}
