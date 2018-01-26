import mongoose from 'mongoose'
const { Schema } = mongoose

const DiarySchema = new Schema({
  _id: String,
  id: String,
  caseId: {
    type: String,
    ref: 'Case'
  },
  title: String,
  article: String,
  status: {
    type: Number,
    default: 0
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

DiarySchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Diary = mongoose.model('Diary', DiarySchema)
