import request from '@/utils/request'
import config from '@/config'

export function getProjectList(condition) {
  return request({
    url: `${config.adminPrefix}/project`,
    method: 'get',
    params: {
      status: 0,
      ...condition
    }
  })
}

export function getProjectById(id) {
  return request({
    url: `${config.adminPrefix}/project/${id}`,
    method: 'get'
  })
}

export function saveProject(params) {
  return request({
    url: `${config.adminPrefix}/project`,
    method: 'put',
    data: params
  })
}

export function createProject(params) {
  return request({
    url: `${config.adminPrefix}/project`,
    method: 'post',
    data: params
  })
}

export function delProject(params) {
  return request({
    url: `${config.adminPrefix}/project/del`,
    method: 'put',
    data: params
  })
}
