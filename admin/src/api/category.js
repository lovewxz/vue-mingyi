import request from '@/utils/request'
import config from '@/config'

export function getCategoryList() {
  return request({
    url: `${config.adminPrefix}/category`,
    method: 'get'
  })
}

export function saveCategory(params) {
  return request({
    url: `${config.adminPrefix}/category`,
    method: 'put',
    data: params
  })
}

export function createCategory(params) {
  return request({
    url: `${config.adminPrefix}/category`,
    method: 'post',
    data: params
  })
}

export function delCategory(params) {
  return request({
    url: `${config.adminPrefix}/category/del`,
    method: 'post',
    data: params
  })
}
