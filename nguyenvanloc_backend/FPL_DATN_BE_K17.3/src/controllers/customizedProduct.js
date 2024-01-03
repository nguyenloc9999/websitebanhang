import CustomizedProduct from "../models/customizedProducts.js";
import { CustomizedProductSchema } from "../schemas/CustomizedProduct.js";

// Controller để tạo sản phẩm tự thiết kế
export const createCustomizedProduct = async (req, res) => {
    try {
        const body = req.body;
        const { error } = CustomizedProductSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const customizedProduct = await CustomizedProduct.create(body);
        if (customizedProduct.length === 0) {
            return res.status(400).json({
                message: "Thêm sản phẩm tự thiết kế thất bại"
            })
        }
        return res.status(200).json({ message: 'Sản phẩm tự thiết kế đã được tạo thành công.', customizedProduct });
    } catch (error) {
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo sản phẩm tự thiết kế.', error });
    }
};
export const getAllCustomProduct = async (req, res) => {
    try {
        const customProduct = await CustomizedProduct.find().sort({ createdAt: -1 });
        if (customProduct.length === 0) {
            return res.status(404).json({
                message: 'Lấy tất cả sản phẩmm tự thiết kế thất bại',
            });
        }
        return res.status(200).json({
            message: " Lấy tất cả sản phẩm tự thiết kế thành công",
            customProduct
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export const listCustomizedProducts = async (req, res) => {
    try {
        const userId = req.params.userId; // Lấy userId từ yêu cầu URL
        // Truy vấn cơ sở dữ liệu để tìm tất cả sản phẩm tự thiết kế của người dùng
        const customizedProducts = await CustomizedProduct.find({ userId }).sort({ createdAt: -1 });
        if (!customizedProducts || customizedProducts.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm tự thiết kế của người dùng này',
            });
        }

        return res.status(200).json({
            message: 'Lấy sản phẩm tự thiết kế thành công',
            products: customizedProducts,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm tự thiết kế.', error });
    }
};

export const getAllDeleteById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const product = await CustomizedProduct.findWithDeleted({ userId, deleted: true });

        return res.status(200).json({
            message: "Lấy tất cả sản phẩm tự thiết kế đã bị xóa",
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};
export const getAllDelete = async (req, res) => {
    try {
        const product = await CustomizedProduct.findWithDeleted({ deleted: true });
        if (!product) {
            return res.status(201).json({
                message: "không có sản phẩm thiết kế nào được xóa"
            });
        }
        return res.status(200).json({
            message: "Lấy tất cả sản phẩm tự thiết kế đã bị xóa",
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};
export const restoreProduct = async (req, res) => {
    try {
        const restoredProduct = await CustomizedProduct.restore({ _id: req.params.id }, { new: true });
        if (!restoredProduct) {
            return res.status(400).json({
                message: "Sản phẩm tự thiết kế không tồn tại hoặc đã được khôi phục trước đó.",
            });
        }

        return res.status(200).json({
            message: "Khôi phục sản phẩm tự thiết kế thành công.",
            product: restoredProduct,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await CustomizedProduct.findById(id);
        if (product) {
            await product.delete()
        }
        return res.status(200).json({
            message: "Xoá sản phẩm tự thiết kế thành công.Chuyển sang thùng rác",
            product
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const removeForce = async (req, res) => {
    try {
        const product = await CustomizedProduct.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Xoá sản phẩm tự thiết kế vĩnh viễn",
            product
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};
export const get = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await CustomizedProduct.findById(id);
        if (product.length === 0) {
            return res.status(400).json({
                message: "Không có sản phẩm tự thiết kế này!",
            })
        }
        return res.status(200).json({
            message: "Lấy 1 sản phẩm tự thiết kế thành công",
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = CustomizedProductSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const data = await CustomizedProduct.findByIdAndUpdate({ _id: id }, body, { new: true })
        if (data.length === 0) {
            return res.status(400).json({
                message: "Cập nhật sản phẩm tự thiết kế thất bại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật sản phẩm tự thiết kế thành công",
            data
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}