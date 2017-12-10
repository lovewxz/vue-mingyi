import mongoose from 'mongoose'
import createToken from '../lib/token'
const User = mongoose.model('User')

export async function login(email, password) {
  let match = false
  let user
  try {
    user = await User.findOne({
      email
    }).exec()
    if (user) {
      match = await user.comparePassWord(password, user.password)
      user.token = createToken(user._id)
      await user.save()
    }
  } catch (e) {
    throw new Error(e)
  }
  return {
    match,
    user
  }
}

export async function getUserByOpenid(openid) {
  let user = await User.findOne({
    openid: openid
  })
  return user
}

export async function saveUser(user) {
  user = new User({
    openid: [user.openid],
    nickname: user.nickname,
    province: user.province,
    country: user.country,
    city: user.city,
    sex: user.sex,
    headimgurl: user.headimgurl,
  })
  user = await user.save()
  return user
}
