import mongoose from 'mongoose'
const Category = mongoose.model('Category')

export async function getCategory() {
  const data = await Category.find({}).exec()
  return data
}

export async function save(cate) {
  cate = new Category(cate)
  cate = await cate.save()
  return cate
}

export async function del(ids) {
  const data = await Category.remove({_id: {$in: ids}}).exec()
  return data
}

export async function getCategoryById(_id) {
  const data = await Category.findOne({_id}).exec()
  return data
}

export async function update(cate) {
  const {_id} = cate
  cate = await Category.update({_id},{$set: cate})
  return cate
}
