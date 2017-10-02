import mongoose from 'mongoose'
const { Schema } = mongoose

const DoctorSchema = new Schema({
  _id: Number,
  id: Number,
  realname: String,
  title: String,
  avatar: String,
  desc: String,
  project: [{
    type: Number,
    ref: 'Project'
  }],
  case: [{
    type: Number,
    ref: 'Case'
  }],
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


DoctorSchema.pre('save', function (err) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Doctor = mongoose.model('Doctor', DoctorSchema)
