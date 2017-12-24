import mongoose from 'mongoose'
const { Schema } = mongoose

const UserSchema = new Schema({
  token: String,
  openid: [String],
  unionid: String,
  nickname: String,
  province: String,
  country: String,
  city: String,
  sex: String,
  headimgurl: String,
  phoneNumber: String,
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

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

mongoose.model('User', UserSchema)
