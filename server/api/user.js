import mongoose from 'mongoose'
const User = mongoose.model('User')

export async function getUserByOpenid(openid) {
  let user = await User.findOne({
    openid: openid
  })
  return user
}

export async function getUserById(_id) {
  const user = await User.findOne({
    _id: _id
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

export async function getFavorList(id) {
  let user = await User.findOne({
    _id: id
  })
  return {
    favorProject: user.favorProject,
    favorDoctor: user.favorDoctor
  }
}

export async function updateFavorProjectById(_id, favorProject) {
  const data = await User.update({ _id }, { $set: { favorProject } })
  return data
}

export async function updateFavorDoctorById(_id, favorDoctor) {
  const data = await User.update({ _id }, { $set: { favorDoctor } })
  return data
}
