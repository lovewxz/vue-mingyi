import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const { Schema } = mongoose

const saltRounds = 10

const UserSchema = new Schema({
  role: {
    type: String,
    default: 'user'
  },
  token: String,
  openid: [String],
  unionid: String,
  nickname: String,
  province: String,
  country: String,
  city: String,
  sex: String,
  headimgurl: String,
  password: String,
  phoneNumber: String,
  email: String,
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
  const user = this
  if (!user.isModified('password')) return next()
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) return next(error)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods = {
  comparePassWord: function (_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, function (err, isMatch) {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  }
}

mongoose.model('User', UserSchema)
