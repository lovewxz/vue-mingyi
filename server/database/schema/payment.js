import mongoose from 'mongoose'
const { Schema } = mongoose
const Mixed = Schema.Types.Mixed
const ObjectId = Schema.Types.ObjectId

const PaymentSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  project: {
    type: String,
    ref: 'Project'
  },
  payType: String,
  totalFee: Number,
  phoneNumber: String,
  description: String,
  name: String,
  order: Mixed,
  num: {
    type: Number,
    default: 1
  },
  payTime: String,
  transactionId: String,
  outTradeNo: String,
  success: {
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

PaymentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }
  next()
})

const Payment = mongoose.model('Payment', PaymentSchema)
