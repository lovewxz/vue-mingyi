import mongoose from 'mongoose'
const { Schema } = mongoose
const Mixed = Schema.Types.Mixed

const CaseSchema = new Schema({
  _id: Number,
  id: Number,
  doctor: {
    type: Number,
    ref: 'Doctor'
  },
  project: {
    type: Number,
    ref: 'Project'
  },
  title: String,
  user_name: String,
  contents: String,
  all_item: [String],
  sections: Mixed,
  compare_photo: {
    before: String,
    after: String
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
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Case = mongoose.model('Case', CaseSchema)
