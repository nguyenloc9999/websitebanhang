import Product from '../models/products.js';
import Brand from '../models/brands.js';
import { BrandSchema } from '../schemas/brands.js';

export const getAllBrands = async (req, res) => {
  try {
    const brand = await Brand.find().sort({ createdAt: -1 });
    if (brand.length === 0) {
      return res.status(404).json({
        message: 'Không có thương hiệu nào',
      });
    }
    return res.status(200).json({
      message: "Lấy tất cả thương hiệu thành công!",
      brand
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        message: 'Không có thương hiệu nào',
      });
    }
    const products = await Product.find({ brandId: req.params.id });
    return res.status(200).json({
      message: "Lấy 1 thương hiệu thành công",
      ...brand.toObject(), products
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const createBrand = async (req, res) => {
  try {
    const { brand_name } = req.body;
    const body = req.body;
    const data = await Brand.findOne({ brand_name });
    if (data) {
      return res.status(400).json({
        message: "Thương hiệu đã tồn tại",
      });
    }
    const { error } = BrandSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors
      })
    }
    const brand = await Brand.create(body);
    if (!brand) {
      return res.status(404).json({
        message: 'Không thể thêm thương hiệu',
      });

    }
    return res.status(200).json({
      message: 'Thêm thương hiệu thành công',
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body
    const { brand_name } = body;
    const data = await Brand.findOne({ brand_name, _id: { $ne: id } });
    if (data) {
      return res.status(400).json({
        message: "Thương hiệu đã tồn tại",
      });
    }
    const { error } = BrandSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors
      })
    }
    const brand = await Brand.findByIdAndUpdate(id, body, { new: true, });
    if (!brand) {
      return res.status(404).json({
        message: 'Thương hiệu không tồn tại',
      });
    }
    return res.status(200).json({
      message: 'Cập nhật thương hiệu thành công',
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};


export const removeBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: 'Xóa thương hiệu thành công',
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
