import Joi from "joi";

export const statusSchema = Joi.object({
    _id: Joi.string(),
    status_name: Joi.string().required().messages({
        "string.empty": "Trường tên trạng thái không được để trống",
        "any.required": "Trường tên trạng thái là bắt buộc",
    }),
    status_description: Joi.string().required().messages({
        "string.empty": "Trường mô tả trạng thái không được để trống",
        "any.required": "Trường mô tả trạng thái là bắt buộc",
    })
})