import Joi from "joi";

export const CustomizedProductSchema = Joi.object({
    _id: Joi.string(),
    userId: Joi.string().required().messages({
        'any.required': 'userId không được để trống.',
    }),
    productId: Joi.string().required().messages({
        'any.required': 'productId không được để trống.',
    }),
    product_name: Joi.string().required().messages({
        "string.empty": "Tên sản phẩm bắt buộc nhập",
        "any.required": "Trường tên sản phẩm bắt buộc nhập"
    }),
    product_price: Joi.number().min(1000).required().messages({
        "number.empty": "Giá sản phẩm bắt buộc nhập",
        "any.required": "Trường giá sản phẩm bắt buộc nhập",
        "number.base": "Giá sản phẩm phải là số",
        'number.min': 'Giá ít nhất phải là 1000đ.'
    }),
    image: Joi.array().required().messages({
        "any.required": "Trường ảnh sản phẩm bắt buộc nhập"
    }),
    stock_quantity: Joi.number().min(1).required().messages({
        "number.empty": "Số lượng tồn kho bắt buộc nhập",
        "any.required": "Trường Số lượng tồn kho bắt buộc nhập",
        "number.base": "Số lượng sản phẩm muốn tạo phải là số",
        'number.min': 'Số lượng ít nhất phải là 1.'
    }),
    categoryId: Joi.string().required().messages({
        "string.empty": "Danh mục sản phẩm bắt buộc nhập",
        "any.required": "Trường danh mục sản phẩm bắt buộc nhập",
        "string.base": "Danh mục sản phẩm phải là chuỗi"
    }),
    colorId: Joi.string().required().messages({
        "string.empty": "Màu bắt buộc nhập",
        "any.required": "Trường màu bắt buộc nhập",
        "string.base": "Màu phải là chuỗi"
    }),
    sizeId: Joi.string().required().messages({
        "string.empty": "Kích cỡ bắt buộc nhập",
        "any.required": "Trường kích cỡ bắt buộc nhập",
        "string.base": "Kích cỡ phải là chuỗi"
    }),
    materialId: Joi.string().required().messages({
        "string.empty": "Vật liệu bắt buộc nhập",
        "any.required": "Trường Vật liệu bắt buộc nhập",
        "string.base": "Vật liệu phải là chuỗi"
    })
})