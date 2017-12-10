import Router from 'koa-router'
import config from '../../config'
import { getWechat } from '../../lib/wechat'
import reply from '../../lib/wechat/reply'
import wechatMiddle from '../../lib/wechat-lib/middleware'
import { signature, redirect, oauth } from '../../controllers/wechatController'
import { post, get, controller, required } from '../../lib/decorator/router'
import { getParamsAsync } from '../../lib/wechat-lib/pay'
import uuidv4 from 'uuid/v4'
import api from '../../api'
import R from 'ramda'
import xss from 'xss'

@controller('')
export class WechatController {
  @get('/wechat-hear')
  async wechatHear(ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    const body = await middle(ctx, next)
    return ctx.body = body
  }

  @post('/wechat-hear')
  async wechatPostHear(ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    const body = await middle(ctx, next)
    return ctx.body = body
  }

  @get('/wechat-signature')
  async wechatSignature(ctx, next) {
    await signature(ctx, next)
  }

  @get('/wechat-redirect')
  async wechatRedirect(ctx, next) {
    await redirect(ctx, next)
  }

  @get('/wechat-oauth')
  async wechatOauth(ctx, next) {
    await oauth(ctx, next)
  }
  @post('/wechat-pay')
  @required({ body: ['userInfo', 'projectId', 'phoneNumber', 'name'] })
  async createOrder(ctx, next) {
    const ip = ctx.ip.replace('::ffff:', '')
    const {
      userInfo,
      projectId,
      phoneNumber,
      name
    } = ctx.request.body
    const project = await api.project.getProjectById(projectId)
    console.log(project)
    if (!project) {
      ctx.body = {
        success: false,
        err: '这个宝贝不在了'
      }
    }
    try {
      let user = await api.user.getUserByOpenid(userInfo.openid)
      if (!user) {
        user = {
          openid: [xss(userInfo.openid)],
          nickname: xss(userInfo.nickname),
          province: xss(userInfo.province),
          country: xss(userInfo.country),
          city: xss(userInfo.city),
          sex: xss(userInfo.sex),
          headimgurl: xss(userInfo.headimgurl),
        }
        user = await api.user.saveUser(user)
      }
      let orderParams = {
        body: project.title,
        attach: '深圳铭医医疗美容医院在线支付',
        out_trade_no: `Project${uuidv4()}`,
        spbill_create_ip: ip,
        total_fee: 1,
        openid: userInfo.openid,
        trade_type: 'JSAPI'
      }
      const order = await getParamsAsync(orderParams)
      let payment = {
        user: xss(user._id),
        project: xss(project._id),
        name: xss(name),
        phoneNumber: xss(phoneNumber),
        payType: '公众号',
        totalFee: 1,
        order: order
      }
      payment = await api.payment.savePayment(payment)
      ctx.body = {
        success: true,
        data: payment.order
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
}
