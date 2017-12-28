import request from '@/utils/request'
import config from '@/config'

export function getCategoryList() {
  return request({
    url: `${config.adminPrefix}/category`,
    method: 'get'
  })
}
