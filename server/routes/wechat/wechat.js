import Router from 'koa-router'
import config from '../../config'
import { getWechat } from '../../lib/wechat'
import reply from '../../lib/wechat/reply'
import wechatMiddle from '../../lib/wechat-lib/middleware'
import { signature, redirect, oauth } from '../../controllers/wechatController'
import { post, get, controller, required } from '../../lib/decorator/router'
import { getParamsAsync, getNoticeAsync, getPayDataAsync, buildSuccessXML } from '../../lib/wechat-lib/pay'
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
  async payOrder(ctx, next) {
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
    if (payment.success > 0) {
      return ctx.body = {
        success: false,
        err: '不要重复提交订单'
      }
    }
    try {
      let orderParams = {
        body: project.title,
        attach: '深圳铭医医疗美容医院在线支付',
        out_trade_no: payment.outTradeNo,
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

  @post('/notify')
  async payNotify(ctx, next) {
    try {
      const data = await getPayDataAsync(ctx.req)
      const message = await getNoticeAsync(data)
      if (message.return_code === 'SUCCESS') {
        let payment = await api.payment.getPaymentByTrade(message.out_trade_no)
        if (parseInt(message.total_fee) !== parseInt(payment.totalFee)) {
          payment.success = 500
        }
        if (!payment.notify) {
          payment.notify = message
          payment.success = 100
          payment = await api.payment.updatePayment(payment)
        }
      }
      ctx.status = 200
      ctx.type = 'application/xml'
      ctx.body = buildSuccessXML()
      return ctx.body
    } catch (e) {
      throw new Error('通知异常')
    }
  }
}
