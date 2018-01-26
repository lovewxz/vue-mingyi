import { getWechat, getOAuth } from '../lib/wechat'
import mongoose from 'mongoose'
const User = mongoose.model('User')

export async function getSignatureAsync(url) {
  const Wechat = getWechat()
  const tokenData = await Wechat.fetchAccessToken()
  const accessToken = tokenData.access_token
  const ticketData = await Wechat.fetchTicket(accessToken)
  const ticket = ticketData.ticket
  const params = await Wechat.ticketSignature(ticket, url)
  params.appID = Wechat.appID
  return params
}

export function getAuthorizeURL(...args) {
  const OAuth = getOAuth()
  return OAuth.getAuthorizeURL(...args)
}

export async function getUserInfoByCode(code) {
  const OAuth = getOAuth()
  const data = await OAuth.fetchAccessToken(code)

  const userInfo = await OAuth.getUserInfo(data.access_token, data.openid)
  let existUser = await User.findOne({
    openid: data.openid
  }).exec()
  if (!existUser) {
    let newUser = new User({
      openid: [data.openid],
      unionid: data.unionid || '',
      nickname: userInfo.nickname,
      province: userInfo.province,
      country: userInfo.country,
      city: userInfo.city,
      sex: userInfo.sex,
      headimgurl: userInfo.headimgurl
    })
    existUser = await newUser.save()
  }
  return existUser
}
