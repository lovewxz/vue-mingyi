import { get, post, controller, required } from '../../lib/decorator/router'
import api from '../../api'
import xss from 'xss'
import R from 'ramda'
import uuidv1 from 'uuid/v1'

@controller('api')
export class projectController {
  @get('projects')
  async getProjectList(ctx, next) {
    const { limit } = ctx.query || 10
    const { page } = ctx.query || 1
    const status = 0
    const projects = await api.project.getProjectList({ limit, page, status })
    const count = await api.project.getProjectCount({})
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
  @post('project/order')
  @required({ body: ['user', 'projectId', 'phoneNumber', 'name', 'num', 'payType'] })
  async saveProjectOrder(ctx, next) {
    const {
      user,
      projectId,
      phoneNumber,
      name,
      num,
      payType
    } = ctx.request.body
    const project = await api.project.getProjectById(projectId)
    if (!project) {
      ctx.body = {
        success: false,
        err: '这个宝贝不在了'
      }
    }
    try {
      let userInfo = await api.user.getUserByOpenid(user.openid)
      if (!userInfo) {
        userInfo = {
          openid: [xss(user.openid)],
          nickname: xss(user.nickname),
          province: xss(user.province),
          country: xss(user.country),
          city: xss(user.city),
          sex: xss(user.sex),
          headimgurl: xss(user.headimgurl),
        }
        userInfo = await api.user.saveUser(userInfo)
      }
      let payment = await api.payment.getPaymentByProjectId(project._id, userInfo._id)
      let totalFee = payType === '支付订金' ? parseInt(num) * parseInt(project.price * 0.1).toFixed(1) : parseInt(num) * parseInt(project.price)
      if (!payment) {
        payment = {
          user: userInfo._id,
          project: project._id,
          phoneNumber: phoneNumber,
          name: name,
          totalFee: totalFee,
          num: num,
          payType: payType,
          outTradeNo: `Project-${uuidv1().substr(0,18)}`
        }
        payment = await api.payment.savePayment(payment)
      }
      ctx.body = {
        success: true,
        data: payment
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
}
