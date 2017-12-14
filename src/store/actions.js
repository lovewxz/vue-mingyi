import Services from './service'

export const getWXSignature = function ({ commit }, url) {
  return Services.getWXSignature(url)
}

export const saveProjectOrder = async function ({ commit }, params) {
  return await Services.saveProjectOrder(params)
}

export const wechatPay = async function ({ commit }, params) {
  return await Services.wechatPay(params)
}
