import mongoose from "mongoose";

const UserOtpVerificationSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    otp: {
        type: String
    },
    createdAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    }
})

export default mongoose.model("UserOTPVerification", UserOtpVerificationSchema)