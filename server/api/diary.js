import mongoose from 'mongoose'
const Diary = mongoose.model('Diary')

export async function getDiaryList({ limit = 10, page = 1, keyword = '', ...args }) {
  if (keyword) {
    args.article = keyword
  }
  const data = await Diary
    .find(args)
    .populate([
      {
        path: 'caseId',
        select: '_id user_name'
      }
    ])
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  return data
}

export async function getDiaryCount({ keyword = '', ...args }) {
  if (keyword) {
    args.article = keyword
  }
  const total = await Diary.find(args).count()
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

export async function getDiariesByCaseId(caseId) {
  const data = await Diary.find({ caseId }).where('status').ne(-1).exec()
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
