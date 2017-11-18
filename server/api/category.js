import mongoose from 'mongoose'
const Category = mongoose.model('Category')

export async function getCategory() {
  const data = await Category.find({}).exec()
  return data
}

export async function save(cate) {
  cate = new Category(cate)
  console.log(cate)
  cate = await cate.save()
  return cate
}

export async function del(ids) {
  const data = await Category.remove({_id: {$in: ids}}).exec()
  return data
}
