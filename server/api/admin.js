import mongoose from 'mongoose'
const Admin = mongoose.model('Admin')

export async function login(email, password) {
  let match = false
  let admin
  try {
    admin = await Admin.findOne({
      email
    }).exec()
    if (admin) {
      match = await admin.comparePassWord(password, admin.password)
    }
  } catch (e) {
    throw new Error(e)
  }
  return {
    match,
    admin
  }
}

export async function getAdminList(limit = 10, page = 1) {
  let admin = await Admin
    .find({})
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  return admin
}

export async function getAdminById(id) {
  const admin = await Admin.findOne({ _id: id }).exec()
  return admin
}

export async function update(admin) {
  admin = await admin.save()
  return admin
}
