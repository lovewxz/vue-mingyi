import mongoose from 'mongoose'
const Diary = mongoose.model('Diary')
export async function getDiaryList(limit = 10, page = 1, reg = '') {
  const data = reg ? await Diary
    .find({})
    .where('status')
    .ne(-1)
    .where('title')
    .regex(reg)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  : await Diary
    .find({})
    .where('status')
    .ne(-1)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  return data
}

export async function getDiaryCount(reg) {
  const total = reg ? await Diary.where('status').ne(-1).where('title').regex(reg).count() : await Diary.where('status').ne(-1).count()
  return total
}

export async function getDiaryById(_id) {
  const data = await Diary.findOne({ _id }).populate([
    {
      path: 'caseId',
      select: '_id user_name'
    }
  ]).exec()
  return data
}

export async function update(diary) {
  diary = await diary.save()
  return diary
}

export async function save(diary) {
  diary = new Diary(diary)
  diary = await diary.save()
  return diary
}

export async function updateStatus(_id, status) {
  const data = await Diary.update({ _id }, { $set: { status } })
  return data
}
