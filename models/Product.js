import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: 500
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
productSchema.index({ name: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });

// Middleware to update updatedAt field
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);