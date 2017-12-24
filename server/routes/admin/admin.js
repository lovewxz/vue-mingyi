import api from '../../api'
import { controller, post, required } from '../../lib/decorator/router'
import jwt from '../../util/jwt'

@controller('admin')
export class adminController {
  @post('login')
  @required({ body: ['email', 'password'] })
  async login(ctx, next) {
    const { email, password } = ctx.request.body
    let data = await api.admin.login(email, password)
    const { match, admin } = data
    if (match) {
      const signParams = {
        id: data._id,
        role: data.role
      }
      data.token = jwt.createToken(signParams)
      data = await api.admin.update(data)
      return ctx.body = {
        success: true,
        data: {
          email: admin.email,
          nickname: admin.nickname,
          avatarUrl: admin.avatarUrl,
          token: admin.token
        }
      }
    }
    return ctx.body = {
      success: false,
      err: '密码或账号错误'
    }
  }
}
