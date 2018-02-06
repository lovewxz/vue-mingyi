import request from '@/utils/request'
import config from '@/config'

export function getDoctorList(condition) {
  return request({
    url: `${config.adminPrefix}/doctor`,
    method: 'get',
    params: {
      status: 0,
      ...condition
    }
  })
}

export function getDoctorById(id) {
  return request({
    url: `${config.adminPrefix}/doctor/${id}`,
    method: 'get'
  })
}

export function saveDoctor(params) {
  return request({
    url: `${config.adminPrefix}/doctor`,
    method: 'put',
    data: params
  })
}

export function createDoctor(params) {
  return request({
    url: `${config.adminPrefix}/doctor`,
    method: 'post',
    data: params
  })
}

export function delDoctor(condition) {
  return request({
    url: `${config.adminPrefix}/doctor/del`,
    method: 'put',
    data: {
      ...condition
    }
  })
}
