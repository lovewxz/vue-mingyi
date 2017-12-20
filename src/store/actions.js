import Services from './service'
import * as type from './mutation-types.js'
import { setStorage } from '@/common/js/cache'

export const getWXSignature = function ({ commit }, url) {
  return Services.getWXSignature(url)
}

export const saveProjectOrder = async function ({ commit }, params) {
  return await Services.saveProjectOrder(params)
}

export const wechatPay = async function ({ commit }, params) {
  return await Services.wechatPay(params)
}

export const saveUser = function ({ commit }, user) {
  commit(type.SET_USER, setStorage('user', user))
}

export const getPayment = async function ({ commit }, payment) {
  return await Services.getPayment(payment)
}

export const getPaymentList = async function ({ commit }, params) {
  params = Object.assign({
    limit: 10,
    page: 1
  }, params)
  return await Services.getPaymentList(params)
}
