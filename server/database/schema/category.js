import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
const { Schema } = mongoose

autoIncrement.initialize(mongoose.connection)

const CategorySchema = new Schema({
  name: String,
  parentId: {
    type: Number,
    default: 0
  },
  topId: {
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

CategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

CategorySchema.plugin(autoIncrement.plugin, 'Category')

const Category = mongoose.model('Category', CategorySchema)
