import mongoose from 'mongoose'
const Project = mongoose.model('Project')

export async function getProjectList(limit = 10, page = 1) {
  const data = await Project.find({}).skip((page - 1) * Number(limit)).limit(Number(limit)).exec()
  return data
}

export async function getProjectCount() {
  const total = await Project.count()
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
