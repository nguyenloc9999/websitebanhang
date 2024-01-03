import Joi from 'joi'

export const bannerSchema = Joi.object({
    _id: Joi.string(),
    image: Joi.object().required().messages({
        "any.required": "Trường ảnh Banner bắt buộc nhập"
    }),
});