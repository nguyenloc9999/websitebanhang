import Banner from '../models/banner.js'
import { bannerSchema } from '../schemas/banner.js';
export const createBanner = async (req, res) => {
  try {
    const { image } = req.body;
    const formData = req.body;
    const data = await Banner.findOne({ image });
    if (data) {
      return res.status(400).json({
        message: "Ảnh quảng cáo đã tồn tại",
      });
    }
    const { error } = bannerSchema.validate(formData, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const banner = await Banner.create(formData);
    if (!banner || banner.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy ảnh quảng cáo",
      });
    }
    return res.status(200).json({
      message: "Thêm ảnh quảng cáo thành công",
      banner,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const getAllBanners = async (req, res) => {
  const {
    _limit = 10,
    _sort = "createAt",
    _order = "asc",
    _page = 1,
    q,
  } = req.query;
  const options = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order == "desc" ? -1 : 1,
    },
  };
  const searchQuery = q ? { name: { $regex: q, $options: "i" } } : {};
  try {
    const banner = await Banner.paginate(searchQuery, options);
    if (banner.length === 0) {
      return res.status(404).json({
        message: "Không có ảnh quảng cáo!",
      });
    }
    return res.status(200).json({
      message: "Lấy tất cả ảnh quảng cáo thành công!",
      banner,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner || banner.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy ảnh quảng cáo",
      });
    }
    return res.status(200).json({
      message: "Lấy 1 ảnh quảng cáo thành công",
      banner,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const updateBanner = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const { error } = bannerSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const banner = await Banner.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    if (!banner || banner.length === 0) {
      return res.status(400).json({
        message: "Cập nhật ảnh quảng cáo thất bại",
      });
    }
    return res.status(200).json({
      message: "Cập nhật ảnh quảng cáo thành công",
      banner,});
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };
  export const deleteBanner = async (req, res) => {
    try {
      const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
      if (deletedBanner) {
        res.status(200).json({ message: 'Ảnh quảng cáo đã được xoá' });
      } else {
        res.status(404).json({ message: 'Ảnh quảng cáo không tồn tại' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };