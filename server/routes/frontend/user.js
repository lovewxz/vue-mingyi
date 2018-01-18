import { get, controller } from '../../lib/decorator/router'
import api from '../../api'

@controller('api')
export class userController {
  @get('user/project/:_id')
  async getProjectById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (_id) {
      ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    const favorProject = await api.user.getFavorProjectById(_id)
    ctx.body = {
      success: true,
      data: favorProject
    }
  }
}
