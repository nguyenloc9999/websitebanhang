import mongoose from "mongoose";
import { format } from "date-fns";

const CommentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Auth",
    required: true
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: Array
  },
  rating: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
CommentSchema.virtual("formattedCreatedAt").get(function () {
  return format(this.createdAt, "HH:mm a dd/MM/yyyy");
});
export default mongoose.model("Comment", CommentSchema);