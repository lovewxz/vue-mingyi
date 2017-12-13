import Services from './service'

export const getWXSignature = function ({ commit }, url) {
  return Services.getWXSignature(url)
}

export const saveProjectOrder = function ({ commit }, params) {
  return Services.saveProjectOrder(params)
}

export const wechatPay = function ({ commit }, params) {
  return Services.wechatPay(params)
}
