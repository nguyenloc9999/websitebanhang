import ChildProduct from "../models/childProduct.js";
import { childProductSchema } from "../schemas/childProduct.js";
import Size from "../models/size.js";

export const listChildProducts = async (req, res) => {
    try {
        const productId = req.params.productId; // Lấy userId từ yêu cầu URL
        // Truy vấn cơ sở dữ liệu để tìm tất cả sản phẩm tự thiết kế của người dùng
        const product = await ChildProduct.find({ productId }).sort({ createdAt: -1 });;
        if (!product || product.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm con của sản phẩm này',
            });
        }

        return res.status(200).json({
            message: 'Lấy sản phẩm sản phẩm con thành công',
            products: product,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách sản phẩm sản phẩm con của sản phẩm này', error });
    }
};


// Controller để tạo sản phẩm tự thiết kế
export const createChildProduct = async (req, res) => {
    try {
        const body = req.body;
        const { error } = childProductSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const checkChild = await ChildProduct.findOne({
            productId: body.productId,
            colorId: body.colorId,
            sizeId: body.sizeId
        });
        if (checkChild) {
            return res.status(400).json({
                message: "Đã có sản phẩm tồn tại màu và kích thước này"
            })
        }
        const product = await ChildProduct.create(body);
        if (product.length === 0) {
            return res.status(400).json({
                message: "Thêm sản phẩm tự thiết kế thất bại"
            })
        }
        return res.status(200).json({ message: 'Sản phẩm con tạo thành công.', product });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo sản phẩm con.', error });
    }
};


export const getChildProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await ChildProduct.findById(id);
        if (product.length === 0) {
            return res.status(400).json({
                message: "Không có sản phẩm con này!",
            })
        }
        return res.status(200).json({
            message: "Lấy 1 sản phẩm con thành công",
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};


export const removeChildProduct = async (req, res) => {
    try {
        await ChildProduct.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: 'Xóa sản phẩm con thành công',
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

export const updateChildProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = childProductSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const checkChild = await ChildProduct.findOne({
            productId: body.productId,
            colorId: body.colorId,
            sizeId: body.sizeId,
            _id: { $ne: id } // Loại trừ sản phẩm hiện tại đang được cập nhật
        });
        if (checkChild) {
            return res.status(404).json({
                message: "Sản phẩm con đã tồn tại",
            });
        }
        const data = await ChildProduct.findByIdAndUpdate({ _id: id }, body, { new: true })
        if (data.length === 0) {
            return res.status(400).json({
                message: "Cập nhật sản phẩm con thất bại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật sản phẩm con thành công",
            data
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}

export const getChildProductPrice = async (req, res) => {
    try {
        const { productId, sizeId, colorId } = req.query;

        // Kiểm tra xem có đủ các giá trị cần thiết không
        if (!productId || !sizeId || !colorId) {
            return res.status(200).json({
                message: 'Thiếu thông tin sản phẩm con',
                product: null
            });
        }

        // Kiểm tra sizeId không phải là null hoặc undefined
        if (sizeId === 'null' || sizeId === 'undefined' || colorId === 'null' || colorId === 'undefined') {
            return res.status(200).json({
                message: 'Không tìm thấy sản phẩm con dựa trên màu và size đã chọn',
                product: null
            });
        }

        // Tìm sản phẩm con dựa trên idProduct, màu và size
        const childProduct = await ChildProduct.findOne({
            productId: productId,
            colorId: colorId,
            sizeId: sizeId,
        });

        if (!childProduct) {
            return res.status(400).json({
                message: 'Không tìm thấy sản phẩm con dựa trên màu và size đã chọn',
            });
        }

        // Trả về giá của sản phẩm con
        return res.status(200).json({
            message: 'Lấy sản phẩm con thành công',
            product: childProduct,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy giá sản phẩm con',
            error,
        });
    }
};