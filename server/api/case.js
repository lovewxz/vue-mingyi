import mongoose from 'mongoose'
const Case = mongoose.model('Case')

// export async function getCases(limit = 10, page = 1) {
//   const data = await Case.find({}).skip((page - 1) * Number(limit)).limit(Number(limit)).exec()
//   return data
// }
//
// export async function getCasesCount() {
//   const total = await Case.count()
//   return total
// }
//
// export async function getCaseById(_id) {
//   const data = await Case.findOne({ _id }).populate([
//     {
//       path: 'project',
//       select: '_id cover_image original_price price title'
//     },
//     {
//       path: 'doctor',
//       select: '_id avatar realname title'
//     }
//   ]).exec()
//   return data
// }

export async function getPcaseList(limit = 10, page = 1, reg = '') {
  const data = reg ? await Case
    .find({})
    .where('status')
    .ne(-1)
    .where('title')
    .regex(reg)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  : await Case
    .find({})
    .where('status')
    .ne(-1)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  return data
}

export async function getPcaseCount(reg) {
  const total = reg ? await Case.where('status').ne(-1).where('title').regex(reg).count() : await Case.where('status').ne(-1).count()
  return total
}

export async function getPcaseById(_id) {
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

export async function update(pcase) {
  pcase = await pcase.save()
  return pcase
}

export async function save(pcase) {
  pcase = new Case(pcase)
  pcase = await pcase.save()
  return pcase
}

export async function updateStatus(_id, status) {
  const data = await Case.update({ _id }, { $set: { status } })
  return data
}
