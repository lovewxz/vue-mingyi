import mongoose from 'mongoose'
const Case = mongoose.model('Case')

export async function getCases(limit = 10, page = 1) {
  const data = await Case.find({}).skip((page - 1) * Number(limit)).limit(Number(limit)).exec()
  return data
}

export async function getCasesCount() {
  const total = await Case.count()
  return total
}

export async function getCaseById(_id) {
  const data = await Case.findOne({ _id }).populate([
    {
      path: 'project',
      select: '_id cover_image original_price price title'
    },
    {
      path: 'doctor',
      select: '_id avatar realname title'
    }
  ]).exec()
  return data
}
