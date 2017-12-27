import request from '@/utils/request'

export function getProjectList(condition) {
  return request({
    url: '/admin/projects',
    method: 'get',
    params: {
      condition
    }
  })
}

export function saveProject() {

}

export function delProject() {
  
}
