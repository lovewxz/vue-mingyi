import axios from 'axios'

const baseUrl = ''
export default {
  getWXSignature(url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }
}
