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
    let { match, admin } = data
    if (match) {
      const signParams = {
        id: admin._id
      }
      admin.token = jwt.createToken(signParams)
      admin = await api.admin.update(admin)
      return (ctx.body = {
        success: true,
        data: {
          email: admin.email,
          nickname: admin.nickname,
          avatarUrl: admin.avatarUrl,
          token: admin.token
        }
      })
    }
    return (ctx.body = {
      success: false,
      err: '密码或账号错误'
    })
  }

  @post('checkToken')
  @required({ body: ['token'] })
  async checkToken(ctx, next) {
    const { token } = ctx.request.body
    await jwt
      .checkToken(token)
      .then(data => {
        return (ctx.body = {
          success: true,
          data: data
        })
      })
      .catch(e => {
        return (ctx.body = {
          success: false,
          err: e.name
        })
      })
  }

  @post('user')
  @required({ body: ['token'] })
  async getUserInfo(ctx, next) {
    const { token } = ctx.request.body
    try {
      const data = await jwt.checkToken(token)
      const admin = await api.admin.getAdminById(data.id)
      if (admin) {
        return (ctx.body = {
          success: true,
          data: admin
        })
      }
      ctx.throw(402)
    } catch (e) {
      ctx.throw(402, e)
    }
  }
}
