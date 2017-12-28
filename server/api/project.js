import mongoose from 'mongoose'
const Project = mongoose.model('Project')

export async function getProjectList({ limit = 10, page = 1, keyword = '', ...args}) {
  let data = ''
  if (keyword) {
    data = await Project
    .find(args)
    .populate([
      {
        path: 'category',
        select: '_id name'
      }
    ])
    .where('title')
    .regex(keyword)
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  } else {
    data = await Project
      .find(args)
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
  }
  return data
}

export async function getProjectCount({ keyword = '', ...args }) {
  const total = keyword ? await Project.find(args).where('title').regex(decodeURIComponent(keyword)).count() : await Project.find(args).count()
  return total
}

export async function getProjectById(_id) {
  const data = await Project.findOne({ _id }).populate([
    {
      path: 'doctor',
      select: '_id avatar realname title'
    }
  ]).exec()
  return data
}

export async function update(project) {
  project = await project.save()
  return project
}

export async function save(project) {
  project = new Project(project)
  project = await project.save()
  return project
}

export async function updateStatus(_id, status) {
  const data = await Project.update({ _id }, { $set: { status } })
  return data
}
