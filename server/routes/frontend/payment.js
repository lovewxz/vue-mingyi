import { get, post, controller } from '../../lib/decorator/router'
import api from '../../api'

@controller('api')
export class caseController {
  @post('payment')
  async getPcase(ctx, next) {
    const { payment } = ctx.request.body
    try {
      const data = await api.payment.getPayment(payment)
      ctx.body = {
        success: true,
        data: data
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

  @post('paymentlist')
  async getPaymenList(ctx, next) {
    const { limit } = ctx.request.body || 10
    const { page } = ctx.request.body || 1
    const { success } = ctx.request.body
    const { _id } = ctx.request.body
    let payment = ''
    try {
      if (success < 0) {
        payment = await api.payment.getPaymentList(limit, page, _id)
      } else {
        payment = await api.payment.getPaymentList(limit, page, _id, success)
      }
      const count = await api.payment.getPaymentCount(_id)
      ctx.body = {
        success: true,
        data: {
          list: payment,
          total: count
        }
      }
    } catch (e) {
      ctx.body = {
        success: true,
        data: e
      }
    }
  }

  @post('paymentupdate')
  async updatePayment(ctx, next) {
    let { success } = ctx.request.body
    let { outTradeNo } = ctx.request.body
    success = parseInt(success)
    let payment = await api.payment.getPaymentByTrade(outTradeNo)
    if (payment) {
      payment.success = success
      payment = await api.payment.savePayment(payment)
      ctx.body = {
        success: true,
        data: payment
      }
    } else {
      ctx.body = {
        success: false,
        err: '订单不存在'
      }
    }
  }
}
