import Auth from "../models/auth.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { resetPasswordUserSchema, changePasswordUserSchema, forgotPasswordUserSchema } from "../schemas/auth.js";
import UserOTPVerification from "../models/userOtpVerification.js";
let refreshTokens = [];


// Quên mật khẩu
export const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email
        const { error } = forgotPasswordUserSchema.validate(email, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        // Kiểm tra người dùng có tồn tại hay không?
        const existingUser = await Auth.findOne({ email: email })
        if (!existingUser) {
            return res.status(400).json({
                message: "Không có tài khoản nào được đăng kí với email này!"
            })
        }

        const otpResponse = await sendOTPVerificationEmail(existingUser);
        return res.status(200).json({
            otpResponse // Thêm thông tin về OTP vào phản hồi
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
};

// Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
    try {
        const { userId, newPassword, confirmPassword } = req.body

        // Kiểm tra tính hợp lệ của dữ liệu đầu vào
        const { error } = resetPasswordUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Mật khẩu và xác nhận mật khẩu không khớp"
            })
        }

        const user = await Auth.findById(userId);
        // Kiểm tra xem người dùng có tồn tại và có được phép đặt lại mật khẩu hay không
        if (!user) {
            return res.status(400).json({
                message: "Người dùng không tồn tại"
            })
        }
        if (!user.passwordChanged) {
            return res.status(400).json({
                message: "Người dùng chưa được phép đặt lại mật khẩu"
            })
        }

        // Hash mật khẩu mới và cập nhật vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Auth.updateOne({ _id: userId }, { password: hashedPassword, passwordChanged: false })
        return res.status(200).json({
            message: "Thay đổi mật khẩu thành công, có thể đăng nhập",
            user

        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
};

// Thay đổi mật khẩu
export const changePassword = async (req, res) => {
    try {
        const { error } = changePasswordUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        const user = req.user
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu hiện tại không đúng"
            })
        }
        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);
        const userNew = await Auth.findByIdAndUpdate(req.user._id, { password: hashedNewPassword }, { new: true });
        if (!userNew) {
            return res.status(400).json({
                message: "Không tìm thấy người dùng"
            })
        }
        userNew.passwordChangeAt = Date.now()
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        //Lưu vào cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,//khong cho truy cap cookie nay ra duoc
            secure: false,
            path: "/",
            // Ngăn chặn tấn công CSRF -> Những cái http, request chỉ được đến từ sameSite
            sameSite: "strict"
        })
        return res.status(200).json({
            message: "Đổi mật khẩu thành công",
            user,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
};


// Gửi mã OTP user (Forgot Password)
export const sendOTPVerificationEmail = async ({ _id, email }) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`.slice(0, 6);
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // Mail Options
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Nội thất Casa OTP Forgot Password",
            html: `
            <p>Vui lòng sử dụng mã OTP để đặt lại mật khẩu : <span><b>${otp}</b></span></p>`,
        };

        //Hash mã OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Lưu OTP vào cơ sở dữ liệu
        const newOTPVerification = new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1800000,
        });

        await newOTPVerification.save();

        // Gửi gmail chứa mã OTP
        await mailTransporter.sendMail(mailOptions);
        // Trả về phản hồi thành công
        return {
            status: "Success",
            message: "Gửi mã OTP về gmail, vui lòng kiểm tra email !",
            data: {
                userId: _id,
                email,
            },
        };
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Xác thực OTP để đặt lại mật khẩu mới
export const verifyOTPResetPassword = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            return res.status(400).json({
                message: "Không được để trống mã otp và userId",
            });
        } else {
            const UserOTPVerificationRecords = await UserOTPVerification.find({
                userId
            });
            if (UserOTPVerificationRecords.length <= 0) {
                return res.status(404).json({
                    message:
                        "Không tìm thấy bản ghi tài khoản hoặc tài khoản đã được xác minh. Vui lòng đăng ký",
                });
            } else {
                const { expiresAt } = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp;

                if (expiresAt < Date.now()) {
                    await UserOTPVerification.deleteMany({ userId });
                    return res.status(400).json({
                        message: "Mã đã hết hạn. Vui lòng yêu cầu lại",
                    });
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);
                    if (!validOTP) {
                        return res.status(400).json({
                            message: "Mã không hợp lệ.",
                        });
                    } else {
                        // Thành công
                        await Auth.updateOne({ _id: userId }, { passwordChanged: true });
                        await UserOTPVerification.deleteMany({ userId });
                        const user = await Auth.findById(userId);
                        if (!user) {
                            return res.status(400).json({
                                message: " Không tìm thấy người dùng"
                            })
                        }
                        return res.status(200).json({
                            message: "Xác minh email thành công! Vui lòng đặt lại mật khẩu mới",
                            user
                        })
                    }
                }
            }
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Hàm xác minh gửi mã quên mật khẩu OTP
export const sendNewVerificationForgotPassword = async ({ _id, email }) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`.slice(0, 6);

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // Mail Options
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Nội thất Casa Rensend OTP Forgot Password ",
            html:
                `<p>Vui lòng sử dụng mã OTP mới để thay đổi mật khẩu và mã sẽ hết hạn sau 3 phút : <span><b>${otp}</b></span></p> `,
        };

        //Hash mã OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Lưu OTP vào cơ sở dữ liệu
        const newOTPVerification = new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1800000,
        });

        await newOTPVerification.save();

        // Gửi gmail chứa mã OTP
        await mailTransporter.sendMail(mailOptions);
        // Trả về phản hồi thành công
        return {
            status: "Success",
            message: "Resend OTP Forgot Password Email",
            data: {
                userId: _id,
                email,
            },
        };
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Gửi lại mã quên mật khẩu OTP
export const sendNewForgotOTP = async (req, res) => {
    try {
        const { userId, email } = req.body;
        if (!userId || !email) {
            return res.status(400).json({
                message: "Không được để trống userId và email ",
            });
        }
        const emailCheck = await Auth.findOne({ email })
        if (!emailCheck) {
            return res.status(400).json({
                message: "Email không tồn tại"
            })
        } else {
            await UserOTPVerification.deleteMany({ userId });
            const otpResponse = await sendNewVerificationForgotPassword({
                _id: userId,
                email,
            });
            return res.status(200).json({
                message: "Gửi lại mã OTP Forgot Password thành công",
                otpResponse, // Thêm thông tin về OTP vào phản hồi
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Generate Access Token
export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "2h" }
    );
};

// Generate Refresh Token
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "365d" }
    );
};
