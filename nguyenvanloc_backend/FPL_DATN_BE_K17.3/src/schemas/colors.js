import Joi from "joi";

export const colorSchema = Joi.object({
    _id: Joi.string(),
    colors_name: Joi.string().required().messages({
        "string.empty": "Trường tên màu không được để trống",
        "any.required": "Trường tên màu là bắt buộc",
    }),
    color_price: Joi.number().min(1000).max(10000000).required().messages({
        "number.empty": "Giá màu bắt buộc nhập",
        "any.required": "Trường giá màu bắt buộc nhập",
        "number.base": "Giá màu phải là số",
        'number.min': 'Giá ít nhất phải là 1000đ.',
        'number.max': 'Giá cao nhất là 10.000.000đ'
    }),
})