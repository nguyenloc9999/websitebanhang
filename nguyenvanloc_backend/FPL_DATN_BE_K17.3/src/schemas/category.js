import Joi from "joi"

export const categorySchema = Joi.object({
    _id: Joi.string(),
    category_name: Joi.string().required().messages({
        "string.empty": "Tên danh mục bắt buộc nhập",
        "any.required": "Trường danh mục bắt buộc nhập"
    }),
    category_image: Joi.object().required().messages({
        "any.required": "Trường ảnh danh mục bắt buộc nhập"
    }),
    
});