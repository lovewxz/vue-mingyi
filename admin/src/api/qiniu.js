import request from '@/utils/request'

export function getQiniuToken(params) {
  return request({
    url: '/qiniu/uptoken',
    method: 'get',
    params: {
      ...params
    }
  })
}

export function getPrefopStatus(params) {
  console.log(...params)
  return request({
    url: '/qiniu/prefopStatus',
    method: 'get',
    params: {
      ...params
    }
  })
}
