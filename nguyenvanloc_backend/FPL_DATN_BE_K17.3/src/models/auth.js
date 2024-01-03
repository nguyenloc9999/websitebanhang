import { format } from "date-fns";
import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    avatar: {
        type: Object
    },
    verified: {
        type: Boolean,
        default: false
    },
    passwordChanged: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        default: null,
    },
    facebookId: {
        type: String,
        default: null,
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    role: {
        type: String,
        default: "member",
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    },
    passwordChangeAt: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
authSchema.virtual("formattedCreatedAt").get(function () {
    return format(this.createdAt, "HH:mm a dd/MM/yyyy");
});
export default mongoose.model("Auth", authSchema);