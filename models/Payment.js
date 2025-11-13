// models/Payment.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const paymentSchema = new Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'bank_transfer', 'credit_card', 'debit_card', 'cheque', 'other']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Sale',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;