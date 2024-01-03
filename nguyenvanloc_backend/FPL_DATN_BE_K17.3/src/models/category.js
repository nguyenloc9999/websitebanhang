import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";

const categorySchema = mongoose.Schema({
  category_name: {
    type: String,
    minLength: 3,
    maxlength: 50,
  },
  category_image: {
    type: Object,
    required: true
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product"
    },
  ]

},
  { timestamps: true, versionKey: false });

categorySchema.plugin(mongoosePaginate);
categorySchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
export default mongoose.model("Category", categorySchema)