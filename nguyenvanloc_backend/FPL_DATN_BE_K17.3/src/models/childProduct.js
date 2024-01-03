import mongoose from "mongoose";

const childProductSchema = mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    stock_quantity: {
        type: Number,
        required: true
    },
    // Thêm các trường khác cho sản phẩm con tại đây
    colorId: {
        type: mongoose.Types.ObjectId, // Tham chiếu đến bảng màu sắc
        ref: "Color",
    },
    sizeId: {
        type: mongoose.Types.ObjectId, // Tham chiếu đến bảng size
        ref: "Size",
    }
}, { timestamps: true, versionKey: false });

export default mongoose.model("ChildProduct", childProductSchema);