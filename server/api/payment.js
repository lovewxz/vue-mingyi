import mongoose from 'mongoose'
const Payment = mongoose.model('Payment')

export async function savePayment(payment) {
  payment = new Payment(payment)
  payment = await payment.save()
  return payment
}

export async function updatePayment(payment) {
  payment = await payment.save()
  return payment
}

export async function getPayment(_id) {
  const payment = await Payment.findOne({_id}).populate([
    {
      path: 'user',
      select: 'openid'
    }
  ]).exec()
  return payment
}

export async function getPaymentByProjectId(projectId, userId) {
  const payment = await Payment.findOne({
    success: 0,
    project: projectId,
    user: userId
  }).exec()
  return payment
}

export async function getPaymentList(limit = 10, page = 1, success) {
  let payment = ''
  if (success) {
    payment = await Payment
    .find({ success })
    .populate([
      {
        path: 'project',
        select: '_id title description price original_price cover_image'
      }
    ])
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  } else {
    payment = await Payment.find({})
    .populate([
      {
        path: 'project',
        select: '_id title description price original_price cover_image'
      }
    ])
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ 'meta.createdAt': -1 })
    .exec()
  }
  return payment
}


export async function getPaymentCount() {
  const total = await Payment.count()
  return total
}
