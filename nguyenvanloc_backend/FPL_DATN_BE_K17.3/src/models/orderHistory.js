import mongoose from "mongoose";

const orderHistory = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: "order",
        required: true,
    },
    old_status: {
        type: String,
        required: true
    },
    new_status: {
        type: String,
        required: true
    },
}, { timestamps: true, versionKey: false });

export default mongoose.model("History", orderHistory);