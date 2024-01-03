import Joi from "joi";


export const ContactSchema = Joi.object({
    contact_name: Joi.string().required().messages({
        "string.empty": "Họ tên bắt buộc nhập",
        "any.required": 'Trường "Họ tên" bắt buộc nhập'
    }),
    contact_email: Joi.string().email().required().messages({
        "string.empty": "Email bắt buộc nhập",
        "any.required": 'Trường "Email" bắt buộc nhập',
        "string.email": "Email không đúng định dạng"
    }),
    contact_phone: Joi.string().max(10).required().messages({
        "string.empty": "Mời điền số điện thoại",
        "any.required": 'Bắt buộc thêm "Số điện thoại"',
        "string.max": "Số điện thoại phải có ít hơn 10 số",
    }),
    contact_description: Joi.string().required().messages({
        "string.empty": "Mô tả sản phẩm bắt buộc nhập",
        "any.required": 'Trường "Mô tả" bắt buộc nhập'
    }),
})