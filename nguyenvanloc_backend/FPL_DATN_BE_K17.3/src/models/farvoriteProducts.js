import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const FavoriteProductSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);
FavoriteProductSchema.plugin(mongoosePaginate);
export default mongoose.model("FavoriteProduct", FavoriteProductSchema);
