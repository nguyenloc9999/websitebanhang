import Joi from "joi";

export const CouponSchema = Joi.object({
    _id: Joi.string(),
    coupon_name: Joi.string().required().messages({
        "string.empty": "Tên mã giảm giá bắt buộc nhập",
        "any.required": "Trường tên mã giảm giá bắt buộc nhập"
    }),
    coupon_code: Joi.string(),
    coupon_content: Joi.string().required().messages({
        "string.empty": "Nội dung mã giảm giá bắt buộc nhập",
        "any.required": "Trường nội dung mã giảm giá bắt buộc nhập"
    }),
    coupon_quantity: Joi.number().min(1).required().messages({
        "number.empty": "Số lượng mã giảm giá bắt buộc nhập",
        "any.required": "Trường số lượng mã giảm giá bắt buộc nhập",
        "number.base": "Số lượng mã giảm giá phải là số",
        "number.min": "Không được nhập số nhỏ hơn 1"
    }),
    discount_amount: Joi.number().min(1).max(100).required().messages({
        "number.empty": "Số tiền giảm giá bắt buộc nhập",
        "any.required": "Trường số tiền giảm giá bắt buộc nhập",
        "number.base": "Số tiền giảm giá phải là số",
        "number.min": "Không được nhập nhỏ hơn 1%",
        "number.max": "Không được nhập trên 100%"
    }),
    expiration_date: Joi.date().min('now').required().messages({
        "any.required": "Ngày hết hạn mã giảm giá bắt buộc nhập",
        "date.min": "Ngày hết hạn không thể là ngày quá khứ"
    }),
    min_purchase_amount: Joi.number().min(0).messages({
        "number.base": "Tổng số tiền để được áp dụng phiếu giảm giá phải là số",
        "number.min": "Không được nhập số âm"
    }),
})