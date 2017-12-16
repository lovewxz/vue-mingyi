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
