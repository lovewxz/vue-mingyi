import mongoose from 'mongoose'
const { Schema } = mongoose
const Mixed = Schema.Types.Mixed
const Diary = mongoose.model('Diary')

const CaseSchema = new Schema({
  _id: String,
  id: String,
  doctor: {
    type: String,
    ref: 'Doctor'
  },
  project: {
    type: String,
    ref: 'Project'
  },
  category: [{
    type: String,
    ref: 'Category'
  }],
  title: String,
  user_name: String,
  contents: String,
  all_item: [String],
  sections: [{
    type: String,
    ref: 'Diary'
  }],
  compare_photo: {
    before: String,
    after: String
  },
  status: {
    type: Number,
    default: 0
  },
  isTop: {
    type: Boolean,
    default: false
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

CaseSchema.pre('save', function (next) {
  const pcase = this
  console.log(pcase.status)
  if (pcase.isNew) {
    pcase.meta.createdAt = pcase.meta.updatedAt = Date.now()
  } else {
    pcase.meta.updatedAt = Date.now()
  }
  next()
})

CaseSchema.pre('update', async function(next) {
  let idParam = {}
  const pcase = this
  const idObj = pcase.getQuery()
  idParam.caseId = idObj._id
  const statusObj = pcase.getUpdate()
  const status = statusObj.$set && statusObj.$set.status
  if (!status) {
    return next()
  }
  await Diary.updateMany(idParam, statusObj)
  next()
})


const Case = mongoose.model('Case', CaseSchema)
