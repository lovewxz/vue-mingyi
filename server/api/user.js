import mongoose from 'mongoose'
const User = mongoose.model('User')

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
