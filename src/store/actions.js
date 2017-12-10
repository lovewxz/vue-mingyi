import Services from './service'

export const getWXSignature = function ({ commit }, url) {
  return Services.getWXSignature(url)
}
