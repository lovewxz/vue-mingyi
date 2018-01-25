import mongoose from 'mongoose'
const Doctor = mongoose.model('Doctor')

export async function getDoctorList({ limit = 10, page = 1, keyword = '', ...args }) {
  if (keyword) {
    args.realname = keyword
  }
  const data = await Doctor.find(args).skip((page - 1) * Number(limit)).limit(Number(limit)).exec()
  return data
}

export async function getDoctorCount({ keyword = '', ...args }) {
  const total = await Doctor.find(args).count()
  return total
}

export async function getDoctorById(_id) {
  const data = await Doctor.findOne({_id}).exec()
  return data
}

export async function update(doctor) {
  doctor = await doctor.save()
  return doctor
}

export async function save(doctor) {
  doctor = new Doctor(doctor)
  doctor = await doctor.save()
  return doctor
}
