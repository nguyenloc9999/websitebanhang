import Joi from "joi";

export const materialSchema = Joi.object({
    _id: Joi.string(),
    material_name: Joi.string().required().messages({
        "string.empty": "Tên vật liệu không được để trống",
        "any.required": "Trường tên vật liệu bắt buộc nhập"
    }),
    material_price: Joi.number().min(1000).max(10000000).required().messages({
        "number.empty": "Giá vật liệu bắt buộc nhập",
        "any.required": "Trường vật liệu màu bắt buộc nhập",
        "number.base": "Giá vật liệu phải là số",
        'number.min': 'Giá ít nhất phải là 1000đ.',
        'number.max': 'Giá cao nhất là 10.000.000đ'
    }),
})
