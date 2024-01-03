import FavoriteProduct from "../models/farvoriteProducts.js";
import Auth from "../models/auth.js";

export const getAllFavoriteProducts = async (req, res) => {
  try {
    const userId = req.params.id;
    // Lấy tất cả sản phẩm yêu thích cho userId cụ thể
    const favoriteProducts = await FavoriteProduct.find({ userId: userId }).populate({
      path: 'productId',
      select: 'product_name product_price image avatar',
    }).sort({ createdAt: -1 });


    return res.status(200).json({
      message: "Lấy tất cả các sản phẩm được yêu thích",
      favoriteProducts,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getFavoriteProducts = async (req, res) => {
  try {
    const { productId, userId } = req.query;
    // Lấy tất cả sản phẩm yêu thích cho userId cụ thể
    const favoriteProducts = await FavoriteProduct.findOne({ userId: userId, productId: productId })

    return res.status(200).json({
      message: "Lấy sản phẩm được yêu thích",
      favoriteProducts,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const createFavoriteProduct = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;
    const userExist = await Auth.findById(userId);
    if (!userExist) {
      return res.status(404).json({
        message: "Người dùng không tồn tại !",
      });
    }
    const existingFavoriteProduct = await FavoriteProduct.findOne({
      userId,
      productId,
    });
    if (existingFavoriteProduct) {
      return res.status(400).json({
        message: "Sản phẩm đã được thêm vào mục yêu thích trước đó.",
      });
    }
    const newFavoriteProduct = await FavoriteProduct.create({
      userId,
      productId,
    });
    await newFavoriteProduct.save();

    return res.status(201).json({
      message: "Sản phẩm đã được thêm vào mục yêu thích.",
      favoriteProduct: newFavoriteProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const removeFavoriteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const findFavoriteProductById = await FavoriteProduct.findById(id);

    if (!findFavoriteProductById) {
      return res.status(404).json({
        message: "Không tìm sản phẩm ",
      });
    }
    const data = await FavoriteProduct.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Bỏ sản phẩm yêu thích thành công",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
