import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";
const productsSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_price: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    sold_quantity: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    brandId: {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
    },
    materialId: {
        type: mongoose.Types.ObjectId,
        ref: "Material",
    }
},
    { timestamps: true, versionKey: false });
productsSchema.plugin(mongoosePaginate);
productsSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("Product", productsSchema);