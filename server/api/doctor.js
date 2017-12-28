import mongoose from 'mongoose'
const Doctor = mongoose.model('Doctor')

export async function getDoctorList({ limit = 10, page = 1 }) {
  const data = await Doctor.find({}).skip((page - 1) * Number(limit)).limit(Number(limit)).exec()
  return data
}

export async function getDoctorCount() {
  const total = await Doctor.count()
  return total
}

export async function getDoctorById(_id) {
  const data = await Doctor.findOne({_id}).populate([
    {
      path: 'doctor',
      select: '_id avatar realname title'
    }
  ]).exec()
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
