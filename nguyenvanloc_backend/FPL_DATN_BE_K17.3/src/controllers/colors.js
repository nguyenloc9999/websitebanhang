import Color from "../models/colors.js";
import { colorSchema } from "../schemas/colors.js";

export const getColorList = async (req, res) => {
    try {
        const color = await Color.find();
        if (color.length === 0) {
            return res.status(404).json({
                message: 'Lấy tất cả màu thất bại',
            });
        }
        return res.status(200).json({
            message: " Lấy tất cả màu thành công",
            color
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


export const createColor = async (req, res) => {
    try {
        const { colors_name } = req.body;
        const { error } = colorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message),
            });
        }
        const data = await Color.findOne({ colors_name });
        if (data) {
            return res.status(400).json({
                message: "Tên màu đã tồn tại",
            });
        }
        const color = await Color.create(req.body);
        if (!color) {
            return res.status(400).json({
                message: 'Thêm màu thất bại',
            });
        }
        return res.status(200).json({
            message: 'Thêm màu thành công',
            color,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const updateColor = async (req, res) => {
    try {
        const id = req.params.id;
        const { colors_name } = req.body;
        const body = req.body;
        const { error } = colorSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message)
            return res.status(400).json({
                message: errors
            })
        }
        const data = await Color.findOne({ colors_name, _id: { $ne: id } });
        if (data) {
            return res.status(400).json({
                message: "Tên màu đã tồn tại",
            });
        }
        const color = await Color.findByIdAndUpdate(id, body, { new: true, });
        if (!color) {
            return res.status(404).json({
                message: 'Cập nhật màu thất bại',
            });
        }
        return res.status(200).json({
            message: "Cập nhật màu thành công",
            color
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
};


export const removeColor = async (req, res) => {
    try {
        const color = await Color.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: 'Xóa màu thành công',
            color
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const getColor = async (req, res) => {
    try {
        const id = req.params.id;
        const color = await Color.findById(id);
        if (color.length === 0) {
            return res.status(400).json({
                message: "Không có màu!",
            })
        }
        return res.status(200).json({
            message: "Lấy 1 màu thành công",
            color
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};