import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const { Schema } = mongoose

const saltRounds = 10

const AdminSchema = new Schema({
  role: {
    type: String,
    default: 'admin'
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

AdminSchema.pre('save', function (next) {
  const admin = this
  if (!admin.isModified('password')) {
    return next()
  }
  console.log(admin.isModified('password'))
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err)
    bcrypt.hash(admin.password, salt, function (error, hash) {
      if (error) return next(error)
      admin.password = hash
      next()
    })
  })
})

AdminSchema.methods = {
  comparePassWord: function (_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, function (err, isMatch) {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  }
}

mongoose.model('Admin', AdminSchema)
