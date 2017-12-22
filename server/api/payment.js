import mongoose from 'mongoose'
import api from './index'

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

export async function getPaymentByTrade(outTradeNo) {
  const payment = await Payment.findOne({
    outTradeNo: outTradeNo
  }).exec()
  return payment
}

export async function getPaymentList(limit = 10, page = 1, openid, success = -1) {
  const user = await api.user.getUserByOpenid(openid)
  if (!user) {
    throw new Error('用户不存在')
    return
  }
  const params = success < 0 ? { user: user._id } : { success, user: user._id }
  const payment = await Payment
  .find(params)
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
  return payment
}


export async function getPaymentCount(id) {
  const params = id ? {user: id} : {}
  const total = await Payment.find(params).count()
  return total
}
