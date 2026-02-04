import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'product name required'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, 'price required'],
    min: [0, 'price must be >= 0']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
}, {
  timestamps: true
});

export const ProductModel = model('products', ProductSchema);
