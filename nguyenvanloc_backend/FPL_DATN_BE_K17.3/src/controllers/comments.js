import Comment from "../models/comments.js";
import { CommentSchema } from "../schemas/comments.js";
import Product from "../models/products.js";
import Auth from "../models/auth.js";
import Order from "../models/orders.js"
import customizedProducts from "../models/customizedProducts.js";

export const getCommentFromProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const comments = await Comment.find({ productId: productId }).sort({ createdAt: -1 }).populate({
            path: 'userId',
            select: 'first_name last_name email avatar',
        });
        if (!comments || comments.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy theo sản phẩm bình luận',
            });
        }
        return res.status(200).json({
            message: 'Lấy bình luận theo sản phẩm thành công',
            comments: comments,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

export const getOneComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                message: 'Không tìm thấy bình luận',
            });
        }
        return res.status(200).json({
            message: "Lấy thành công 1 bình luận",
            comment,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const getAllComment = async (req, res) => {
    try {
        const products = await Comment.aggregate([
            {
                $group: {
                    _id: '$productId',
                    count: { $sum: 1 }, // Đếm số lượng bình luận cho mỗi sản phẩm
                },
            },
            {
                $lookup: {
                    from: 'products', // Tên của bảng sản phẩm
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            {
                $unwind: '$productInfo',
            },
            {
                $project: {
                    _id: '$productInfo._id',
                    product_name: '$productInfo.product_name',
                    ratings_count: '$productInfo.ratings_count',
                    comments_count: '$count',
                },
            },
        ]);

        return res.status(200).json({
            message: 'Lấy tất cả sản phẩm đã được đánh giá và số lượng đánh giá thành công',
            products,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const create = async (req, res) => {
    try {
        const { userId, rating, description, image, productId, orderId, sizeId, colorId, materialId } = req.body;
        const { error } = CommentSchema.validate(req.body, { abortEarly: false });

        // Kiểm tra và xử lý lỗi nếu có
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            });
        }

        if (!userId) {
            return res.status(401).json({
                message: "Bạn phải đăng nhập mới được đánh giá sản phẩm!",
            });
        }

        // Kiểm tra sự tồn tại của sản phẩm và người dùng
        const product = await Product.findById(productId);
        const productCustom = await customizedProducts.findById(productId);

        if (!product && !productCustom) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm.",
            });
        }

        const user = await Auth.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại.",
            });
        }

        // Tìm đơn hàng với orderId
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại.",
            });
        }

        // Tìm sản phẩm trong đơn hàng để đánh giá
        const productToReview = order.products.find((product) => {
            return (
                !product.hasReviewed &&
                product.productId == productId &&
                product.sizeId == sizeId && // Thay 'sizeId' bằng tên thuộc tính kích thước trong request
                product.colorId == colorId && // Thay 'colorId' bằng tên thuộc tính màu sắc trong request
                product.materialId == materialId // Thay 'materialId' bằng tên thuộc tính vật liệu trong request
            );
        });
        if (productToReview) {
            // Nếu sản phẩm có thể đánh giá, đánh giá sản phẩm và cập nhật trạng thái đã đánh giá
            const comment = await Comment.create({
                userId,
                rating,
                description,
                productId,
                image
            });

            // Cập nhật trạng thái đã đánh giá của sản phẩm
            productToReview.hasReviewed = true;

            // Lưu đơn hàng sau khi đã cập nhật
            await order.save();

            return res.status(200).json({
                message: "Bạn đã đánh giá thành công sản phẩm này!",
                success: true,
                comment,
            });
        } else {
            return res.status(401).json({
                message: "Bạn đã đánh giá sản phẩm này trước đó.",
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};





export const updateCommentByAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = CommentSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const comment = await Comment.findByIdAndUpdate(id, body, { new: true });
        return res.status(200).json({
            message: 'Admin thay đổi bình luận thành công',
            comment
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const updateCommentByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { userId = '' } = req.query;
        const { error } = CommentSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const findCommentById = await Comment.findById(id);
        if (!findCommentById) {
            return res.status(404).json({
                message: "Không tìm thấy bình luận"
            })
        }
        if (findCommentById.userId == userId) {
            const comment = await Comment.findByIdAndUpdate(id, body, { new: true });
            if (!comment) {
                return res.status(400).json({
                    message: "Thay đổi bình luận của chính mình thất bại"
                })
            }
            return res.status(200).json({
                message: 'Thay đổi bình luận của chính mình thành công',
                comment
            });
        } else {
            return res.status(403).json({
                message: "Bạn không có quyền thay đổi bình luận này!"
            })
        }
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};



// Remove comment by user ( Người dùng có thể tự xóa comment của chính mình )
export const removeCommentByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { userId = '' } = req.query;
        const findCommentById = await Comment.findById(id);

        // Kiểm tra nếu không tìm thấy bình luận
        if (!findCommentById) {
            return res.status(404).json({
                message: "Không tìm thấy bình luận"
            });
        }

        // console.log(userId);
        // console.log(findCommentById.userId);
        if (findCommentById.userId == userId) {
            // Xóa bình luận
            const comment = await Comment.findByIdAndDelete(id);
            return res.status(200).json({
                message: "Xóa bình luận thành công",
                comment
            });
        } else {
            // Trả về mã lỗi 403 nếu người dùng không có quyền xóa bình luận này
            return res.status(403).json({
                message: "Bạn không có quyền xóa bình luận này"
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


// Remove comment by admin 
export const removeCommentByAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const comment = await Comment.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Admin xóa bình luận thành công!',
            comment
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};



