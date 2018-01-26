import mongoose from 'mongoose'
const Case = mongoose.model('Case')

export async function getPcaseList({
  limit = 10,
  page = 1,
  keyword = '',
  ...args
}) {
  if (keyword) {
    args.title = keyword
  }
  const data = await Case.find(args)
    .populate([
      {
        path: 'category',
        select: '_id name'
      }
    ])
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  return data
}

export async function getPcaseCount({ keyword = '', ...args }) {
  if (keyword) {
    args.title = keyword
  }
  const total = await Case.find(args).count()
  return total
}

export async function getPcaseById(_id) {
  const data = await Case.findOne({ _id })
    .populate([
      {
        path: 'project',
        select: '_id cover_image original_price price title'
      },
      {
        path: 'doctor',
        select: '_id avatar realname title'
      }
    ])
    .exec()
  return data
}

export async function getPcaseByDoctorId({ limit = 10, page = 1, ...args }) {
  const { status, id } = args
  const data = await Case.find({
    doctor: id,
    status: status
  })
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
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
