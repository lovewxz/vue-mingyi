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
