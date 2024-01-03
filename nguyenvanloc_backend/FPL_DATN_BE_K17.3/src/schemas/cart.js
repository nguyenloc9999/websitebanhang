import Joi from 'joi';
export const cartSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'productId không được để trống.',
    'string.base': 'productId phải là một chuỗi.',
  }),
  product_name: Joi.string().messages({
    'string.base': 'product_name phải là một chuỗi.',
  }),
  product_price: Joi.number().messages({
    'number.base': 'product_price phải là một số.',
  }),
  image: Joi.string().messages({
    'string.base': 'image phải là một chuỗi.',
  }),
  stock_quantity: Joi.number().min(1).messages({
    'number.base': 'Phải chọn số lượng sản phẩm mua.',
    'number.min': 'Số lượng ít nhất phải là 1.'
  }),
  originalPrice: Joi.number().messages({
    'number.base': 'originalPrice phải là một số.',
  }),
  sizeId: Joi.string().required().messages({
    'any.required': 'Size không được để trống.',
    'string.base': 'Size phải là một chuỗi.',
  }),
  colorId: Joi.string().required().messages({
    'any.required': 'Color không được để trống.',
    'string.base': 'Color phải là một chuỗi.',
  }),
  materialId: Joi.string().required().messages({
    'any.required': 'Material không được để trống.',
    'string.base': 'Material phải là một chuỗi.',
  }),
  formation: Joi.string()
});
