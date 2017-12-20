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
    let payment = ''
    try {
      const count = await api.payment.getPaymentCount()
      if (success) {
        payment = await api.payment.getPaymentList(limit, page, success)
      } else {
        payment = await api.payment.getPaymentList(limit, page)
      }
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
}
