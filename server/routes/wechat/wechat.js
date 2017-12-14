import Router from 'koa-router'
import config from '../../config'
import { getWechat } from '../../lib/wechat'
import reply from '../../lib/wechat/reply'
import wechatMiddle from '../../lib/wechat-lib/middleware'
import { signature, redirect, oauth } from '../../controllers/wechatController'
import { post, get, controller, required } from '../../lib/decorator/router'
import { getParamsAsync } from '../../lib/wechat-lib/pay'
import uuidv1 from 'uuid/v1'
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
  @required({ body: [ 'user', 'projectId', 'totalFee' ] })
  async createOrder(ctx, next) {
    const ip = ctx.ip.replace('::ffff:', '')
    const {
      user,
      projectId,
      totalFee
    } = ctx.request.body
    const userInfo = await api.user.getUserByOpenid(user.openid)
    if (!userInfo) {
      return ctx.body = {
        success: false,
        err: '用户不存在'
      }
    }
    const project = await api.project.getProjectById(projectId)
    if (!project) {
      return ctx.body = {
        success: false,
        err: '宝贝不存在'
      }
    }
    let payment = await api.payment.getPaymentByProjectId(project._id, userInfo._id)
    if (!payment) {
      return ctx.body = {
        success: false,
        err: '订单不存在'
      }
    }
    try {
      let orderParams = {
        body: project.title,
        attach: '深圳铭医医疗美容医院在线支付',
        out_trade_no: `Project-${uuidv1().substr(0,18)}`,
        spbill_create_ip: ip,
        total_fee: 1,
        openid: userInfo.openid,
        trade_type: 'JSAPI'
      }
      const order = await getParamsAsync(orderParams)
      payment.totalFee = 1
      payment.order = order
      console.log(payment)
      payment = await api.payment.updatePayment(payment)
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
