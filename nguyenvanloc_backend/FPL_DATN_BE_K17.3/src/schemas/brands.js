import Joi from "joi";

export const BrandSchema = Joi.object({
    _id: Joi.string(),
    brand_name: Joi.string().required().messages({
        "string.empty": "Tên thương hiệu không được để trống",
        "any.required": "Trường tên thương hiệu bắt buộc nhập"
    })
})