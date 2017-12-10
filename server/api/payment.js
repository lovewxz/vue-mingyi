import mongoose from 'mongoose'
const Payment = mongoose.model('Payment')

export async function savePayment(payment) {
  payment = new Payment(payment)
  payment = await payment.save()
  return payment
}
