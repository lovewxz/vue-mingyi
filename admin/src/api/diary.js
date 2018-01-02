import request from '@/utils/request'
import config from '@/config'

export function getDiaryList(condition) {
  return request({
    url: `${config.adminPrefix}/diary`,
    method: 'get',
    params: {
      status: 0,
      ...condition
    }
  })
}

export function getDiaryById(id) {
  return request({
    url: `${config.adminPrefix}/diary/${id}`,
    method: 'get'
  })
}

export function getDiaryByCaseId(caseId) {
  return request({
    url: `${config.adminPrefix}/diary/case/${caseId}`,
    method: 'get'
  })
}

export function saveDiary(params) {
  return request({
    url: `${config.adminPrefix}/diary`,
    method: 'put',
    data: params
  })
}

export function createDiary(params) {
  return request({
    url: `${config.adminPrefix}/diary`,
    method: 'post',
    data: params
  })
}
