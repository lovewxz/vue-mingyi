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
}