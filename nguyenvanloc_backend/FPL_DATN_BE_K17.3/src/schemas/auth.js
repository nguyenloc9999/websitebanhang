import joi from "joi";

// Validate Đăng kí
export const signupSchema = joi.object({
    first_name: joi.string().required().messages({
        "string.empty": "Mời nhập tên",
        "any.required": 'Trường "Tên" là bắt buộc',
    }),
    last_name: joi.string().required().messages({
        "string.empty": "Mời nhập họ",
        "any.required": 'Trường "Họ" là bắt buộc',
    }),
    email: joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "any.required": 'Trường "Email" là bắt buộc',
        "string.email": "Email không đúng định dạng",
    }),
    password: joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Trường mật khẩu là bắt buộc",
        "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    }),
    confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
        "any.only": "Mật khẩu không khớp",
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Trường mật khẩu là bắt buộc",
    }),
    phone: joi.string(),
    address: joi.string(),
    avatar: joi.object()
});

// Validate Đăng nhập
export const signinSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.empty": "Mời nhập email ",
        "any.required": 'Trường "Email" là bắt buộc',
        "string.email": "Email không đúng định dạng",
    }),
    password: joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Trường mật khẩu là bắt buộc",
        "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    }),
});

// Validate cập nhật người dùng
export const updateUserSchema = joi.object({
    _id: joi.string(),
    first_name: joi.string().required().messages({
        "string.empty": "Vui lòng mời nhập tên",
        "any.required": 'Trường "Tên" là bắt buộc',
    }),
    last_name: joi.string().required().messages({
        "string.empty": "Vui lòng mời nhập họ",
        "any.required": 'Trường "Họ" là bắt buộc',
    }),
    email: joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "any.required": 'Trường "Email" là bắt buộc',
        "string.email": "Email không đúng định dạng",
    }),
    phone: joi.string().max(10),
    address: joi.string(),
    avatar: joi.object(),
    role: joi.string()

});

// Quên mật khẩu người dùng : 
export const forgotPasswordUserSchema = joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "any.required": 'Trường "Email" là bắt buộc',
    "string.email": "Email không đúng định dạng",
});

// Đặt lại mật khẩu người dùng : 
export const resetPasswordUserSchema = joi.object({
    userId: joi.string().required().messages({
        "string.empty": "Không có userId",
        "any.required": 'Trường "userId" là bắt buộc',
    }),
    newPassword: joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Trường mật khẩu là bắt buộc",
        "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    }),
    confirmPassword: joi.string().valid(joi.ref("newPassword")).required().messages({
        "any.only": "Mật khẩu không khớp",
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Trường mật khẩu là bắt buộc",
    }),
})

// Thay đổi mật khẩu người dùng
export const changePasswordUserSchema = joi.object({
    currentPassword: joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu hiện tại không được để trống",
        "any.required": "Trường mật khẩu hiện tại là bắt buộc",
        "string.min": "Mật khẩu hiện tại phải có ít nhất {#limit} ký tự",
    }),
    newPassword: joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu mới không được để trống",
        "any.required": "Trường mật khẩu mới là bắt buộc",
        "string.min": "Mật khẩu mới phải có ít nhất {#limit} ký tự",
    })
})







