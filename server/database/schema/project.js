import mongoose from 'mongoose'
const { Schema } = mongoose

const ProjectSchema = new Schema({
  _id: String,
  id: String,
  title: String,
  price: String,
  original_price: String,
  cover_image: [String],
  detail_images: [String],
  description: String,
  params: [
    {
      key: String,
      value: String
    }
  ],
  doctor: {
    type: String,
    ref: 'Doctor'
  },
  status: {
    type: Number,
    default: 0
  },
  category: {
    type: Number,
    ref: 'Category'
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

ProjectSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Project = mongoose.model('Project', ProjectSchema)
