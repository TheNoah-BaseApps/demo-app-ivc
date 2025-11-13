import mongoose, { Schema } from 'mongoose';

const stockSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  reserved: {
    type: Number,
    default: 0,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Calculate available stock (quantity - reserved)
stockSchema.virtual('available').get(function() {
  return this.quantity - this.reserved;
});

// Ensure reserved quantity doesn't exceed total quantity
stockSchema.pre('save', function(next) {
  if (this.reserved > this.quantity) {
    return next(new Error('Reserved quantity cannot exceed total quantity'));
  }
  next();
});

export default mongoose.models.Stock || mongoose.model('Stock', stockSchema);