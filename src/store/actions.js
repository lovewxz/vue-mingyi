import Services from './service'
import * as type from './mutation-types.js'
import { setStorage, getStorage } from '@/common/js/cache'

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

export const getPaymentList = async function ({ state }, params) {
  params = Object.assign({
    limit: 10,
    page: 1,
    openid: state.user.openid || getStorage('user').openid
  }, params)
  return await Services.getPaymentList(params)
}

export const updatePayment = async function ({ commit }, params) {
  return await Services.updatePayment(params)
}

export const getDoctorList = async function ({ commit }, params) {
  return await Services.getDoctorList(params)
}

export const getDoctorDetail = async function ({ commit }, id) {
  return await Services.getDoctorDetail(id)
}

export const getProjectByDoctorId = async function ({ commit }, params) {
  return await Services.getProjectByDoctorId(params)
}

export const getPcaseByDoctorId = async function ({ commit }, params) {
  return await Services.getPcaseByDoctorId(params)
}
