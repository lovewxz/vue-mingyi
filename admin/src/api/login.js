import request from '@/utils/request'

export function login(email, password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
