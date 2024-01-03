import Joi from 'joi';

export const CommentSchema = Joi.object({
    _id: Joi.string(),
    userId: Joi.string().required().messages({
        'any.required': 'userId không được để trống.',
    }),
    productId: Joi.string().required().messages({
        'any.required': 'productId không được để trống.',
    }),
    description: Joi.string().required().messages({
        'any.required': 'description không được để trống.',
    }),
    image: Joi.array(),
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.base': 'rating phải là một số.',
        'number.integer': 'rating phải là một số nguyên.',
        'number.min': 'rating phải lớn hơn hoặc bằng 1.',
        'number.max': 'rating phải nhỏ hơn hoặc bằng 5.',
        'any.required': 'rating không được để trống.',
    }),
    formattedCreatedAt: Joi.string().optional(),
    orderId: Joi.string(),
    sizeId: Joi.string(),
    colorId: Joi.string(),
    materialId: Joi.string(),

}).options({ abortEarly: false });