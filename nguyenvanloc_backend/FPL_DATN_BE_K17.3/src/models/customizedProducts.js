import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";
const CustomizedProductSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
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
    stock_quantity: {
        type: Number,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    colorId: {
        type: mongoose.Types.ObjectId,
        ref: "Color",
    },
    sizeId: {
        type: mongoose.Types.ObjectId,
        ref: "Size",
    },
    materialId: {
        type: mongoose.Types.ObjectId,
        ref: "Material",
    }
},
    { timestamps: true, versionKey: false });
CustomizedProductSchema.plugin(mongoosePaginate);
CustomizedProductSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("CustomizedProduct", CustomizedProductSchema);