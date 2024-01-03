import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    couponId: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
      default: null
    },
    products: [
      {
        productId: String,
        product_name: String,
        product_price: Number,
        image: String,
        stock_quantity: Number,
        originalPrice: Number,
        sizeId: String,
        colorId: String,
        materialId: String,
        formation: {
          type: String,
          default: "nor",
        },
      },
    ],
    total: {
      type: Number,
    }
  },
  { timestamps: true, versionKey: false }
);
export default mongoose.model("cart", cartSchema);
