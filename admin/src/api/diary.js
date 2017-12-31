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

export function getDiaryByCaseId(caseId) {
  return request({
    url: `${config.adminPrefix}/diary/case/${caseId}`,
    method: 'get'
  })
}
