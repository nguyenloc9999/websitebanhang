import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Auth",
    required: true
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: false  // Đặt required là false để cho phép giá trị null
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      product_name: String,
      product_price: Number,
      image: String,
      stock_quantity: Number,
      sizeId: String,
      colorId: String,
      materialId: String,
      hasReviewed: {
        type: Boolean,
        default: false, // Ban đầu, đánh dấu là chưa đánh giá
      },
      formation: String,
    }
  ],
  total: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  status: {
    type: mongoose.Types.ObjectId,
    ref: "Status",
    default: '64e8a93da63d2db5e8d8562a'
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  paymentId: {
    type: String
  },
  paymentCode: {
    type: String
  },
  payerId: {
    type: String
  },
  hasReviewed: {
    type: Boolean,
    default: false, // Ban đầu, đánh dấu là chưa đánh giá
  },
},
  { timestamps: true, versionKey: false });
export default mongoose.model("order", orderSchema);