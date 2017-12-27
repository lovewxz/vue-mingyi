import jwt from 'jsonwebtoken'
import config from '../config'

export const createToken = (data) => {
  const token = jwt.sign(data, config.jwt.token, {
    expiresIn: config.jwt.expiredTime // 过期时间设置为60妙。那么decode这个token的时候得到的过期时间为 : 创建token的时间 +　设置的值
  })
  return token
}

export const checkToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.token, (err, decoded) => {
      if (err) {
        reject(err)
      }
      resolve(decoded)
    })
  })
}

export const decodeToken = (token) => {
  token = jwt.decode(token, config.jwt.token)
  return token
}

export default {
  createToken,
  checkToken,
  decodeToken
}
