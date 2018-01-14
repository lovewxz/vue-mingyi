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
  },
  getPayment(payment) {
    return axios.post(`${baseUrl}/api/payment`, payment)
  },
  updatePayment(payment) {
    return axios.post(`${baseUrl}/api/paymentupdate`, payment)
  },
  getPaymentList(params) {
    return axios.post(`${baseUrl}/api/paymentlist`, params)
  },
  getDoctorList(params) {
    return axios.get(`${baseUrl}/api/doctor`, { params })
  },
  getDoctorDetail(id) {
    return axios.get(`${baseUrl}/api/doctor/${id}`)
  },
  getProjectByDoctorId(params) {
    return axios.get(`${baseUrl}/api/project/doctor`, { params })
  },
  getPcaseByDoctorId(params) {
    return axios.get(`${baseUrl}/api/pcase/doctor`, { params })
  },
  getPcaseList(params) {
    return axios.get(`${baseUrl}/api/pcase`, { params })
  },
  getPcaseListById(id) {
    return axios.get(`${baseUrl}/api/pcase/list/${id}`)
  },
  getDiaryById(id) {
    return axios.get(`${baseUrl}/api/diary/id/${id}`)
  },
  getDiaryListByCaseId(caseId) {
    return axios.get(`${baseUrl}/api/diary/pcase/${caseId}`)
  },
  getProjectList(params) {
    return axios.get(`${baseUrl}/api/project`, { params })
  },
  getProjectById(id) {
    return axios.get(`${baseUrl}/api/project/list/${id}`)
  }
}
