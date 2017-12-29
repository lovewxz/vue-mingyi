import request from '@/utils/request'
import config from '@/config'

export function getDiaryByCaseId(caseId) {
  return request({
    url: `${config.adminPrefix}/diary/case/${caseId}`,
    method: 'get'
  })
}
