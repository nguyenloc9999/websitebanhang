import Joi from "joi";

export const ProductSchema = Joi.object({
    _id: Joi.string(),
    product_name: Joi.string().required().messages({
        "string.empty": "Tên sản phẩm bắt buộc nhập",
        "any.required": "Trường tên sản phẩm bắt buộc nhập"
    }),
    product_price: Joi.number().min(1000).max(200000000).required().messages({
        "number.empty": "Giá sản phẩm bắt buộc nhập",
        "any.required": "Trường giá sản phẩm bắt buộc nhập",
        "number.base": "Giá sản phẩm phải là số",
        'number.min': 'Giá ít nhất phải là 1000đ.',
        'number.max': 'Giá cao nhất là 200.000.000đ'
    }),
    image: Joi.array().required().messages({
        "any.required": "Trường ảnh sản phẩm bắt buộc nhập"
    }),
    sold_quantity: Joi.number(),
    description: Joi.string().allow(''),
    views: Joi.number(),
    categoryId: Joi.string().required().messages({
        "string.empty": "Danh mục sản phẩm bắt buộc nhập",
        "any.required": "Trường danh mục sản phẩm bắt buộc nhập",
        "string.base": "Danh mục sản phẩm phải là chuỗi"
    }),
    brandId: Joi.string().required().messages({
        "string.empty": "Thương hiệu bắt buộc nhập",
        "any.required": "Trường thương hiệu bắt buộc nhập",
        "string.base": "Thương hiệu phải là chuỗi"
    }),
    materialId: Joi.string().required().messages({
        "string.empty": "Vật liệu bắt buộc nhập",
        "any.required": "Trường vật liệu bắt buộc nhập",
        "string.base": "Vật liệu phải là chuỗi"
    })
})