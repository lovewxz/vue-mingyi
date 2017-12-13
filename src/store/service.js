import axios from 'axios'

const baseUrl = ''
export default {
  getWXSignature(url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  },
  saveProjectOrder(params) {
    return axios.post(`${baseUrl}/api/project/order`, params)
  },
  wechatPay(params) {
    return axios.post(`${baseUrl}/wechat-pay`, params)
  }
}
