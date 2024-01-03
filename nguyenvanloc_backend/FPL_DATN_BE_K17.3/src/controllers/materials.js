import Material from "../models/materials.js";
import { materialSchema } from "../schemas/materials.js";

export const getMaterialList = async (req, res) => {
    try {
        const material = await Material.find().sort({ createdAt: -1 });
        if (material.length === 0) {
            return res.status(404).json({
                message: 'Lấy tất cả vật liệu thất bại',
            });
        }
        return res.status(200).json({
            message: " Lấy tất cả vật liệu thành công",
            material
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


export const createMaterial = async (req, res) => {
    try {
        const { material_name } = req.body
        const { error } = materialSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message),
            });
        }
        const data = await Material.findOne({ material_name });
        if (data) {
            return res.status(400).json({
                message: "Tên vật liệu đã tồn tại",
            });
        }
        const material = await Material.create(req.body);
        if (!material) {
            return res.status(400).json({
                message: 'Thêm vật liệu thất bại',
            });
        }
        return res.status(200).json({
            message: 'Thêm vật liệu thành công',
            material,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const updateMaterial = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { material_name } = body
        const data = await Material.findOne({ material_name, _id: { $ne: id } });
        if (data) {
            return res.status(400).json({
                message: "Tên vật liệu đã tồn tại",
            });
        }
        const { error } = materialSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message)
            return res.status(400).json({
                message: errors
            })
        }
        const material = await Material.findByIdAndUpdate(id, body, { new: true, });
        if (!material) {
            return res.status(404).json({
                message: 'Cập nhật vật liệu thất bại',
            });
        }
        return res.status(200).json({
            message: "Cập nhật vật liệu thành công",
            material
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
};


export const removeMaterial = async (req, res) => {
    try {
        const material = await Material.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: 'Xóa vật liệu thành công',
            material
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const getMaterial = async (req, res) => {
    try {
        const id = req.params.id;
        const material = await Material.findById(id);
        if (material.length === 0) {
            return res.status(400).json({
                message: "Không có vật liệu!",
            })
        }
        return res.status(200).json({
            message: "Lấy 1 vật liệu thành công",
            material
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};