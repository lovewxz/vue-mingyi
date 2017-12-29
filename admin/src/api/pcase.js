import request from '@/utils/request'
import config from '@/config'

export function getPcaseList(condition) {
  return request({
    url: `${config.adminPrefix}/pcase`,
    method: 'get',
    params: {
      status: 0,
      ...condition
    }
  })
}

export function delPcase(condition) {
  return request({
    url: `${config.adminPrefix}/pcase/del`,
    method: 'put',
    data: {
      ...condition
    }
  })
}

export function getPcaseById(id) {
  return request({
    url: `${config.adminPrefix}/pcase/${id}`,
    method: 'get',
  })
}


export function savePcase(params) {
  return request({
    url: `${config.adminPrefix}/pcase`,
    method: 'put',
    data: params
  })
}

export function createPcase(params) {
  return request({
    url: `${config.adminPrefix}/pcase`,
    method: 'post',
    data: params
  })
}
