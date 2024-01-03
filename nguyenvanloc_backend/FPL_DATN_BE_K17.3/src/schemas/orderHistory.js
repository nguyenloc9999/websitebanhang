import Joi from "joi";

export const HistorySchema = Joi.object({
    _id: Joi.string(),
    userId: Joi.string().required().messages({
        'any.required': 'Người thay đổi không được để trống.',
    }),
    orderId: Joi.string().required().messages({
        'any.required': 'Đơn thay đổi không được để trống.',
    }),
    old_status: Joi.string().required().messages({
        'any.required': 'Trạng thái cũ không được để trống.',
    }),
    new_status: Joi.string().required().messages({
        'any.required': 'Trạng thái mới không được để trống.',
    }),
})