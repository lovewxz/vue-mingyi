import mongoose from 'mongoose'
const { Schema } = mongoose

const DoctorSchema = new Schema({
  _id: String,
  id: String,
  realname: String,
  title: String,
  avatar: String,
  desc: String,
  tags: [String],
  photos: [String],
  project: [
    {
      type: String,
      ref: 'Project'
    }
  ],
  case: [
    {
      type: String,
      ref: 'Case'
    }
  ],
  isTop: {
    type: Boolean,
    default: false
  },
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

DoctorSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Doctor = mongoose.model('Doctor', DoctorSchema)
