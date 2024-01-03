import Status from "../models/status.js";
import { statusSchema } from "../schemas/status.js";

export const getStatusList = async (req, res) => {
  try {
    const status = await Status.find();
    if (status.length === 0) {
      return res.status(404).json({
        message: 'Lấy tất cả trạng thái thất bại',
      });
    }
    return res.status(200).json({
      message: " Lấy tất cả trạng thái thành công",
      status
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};


export const createStatus = async (req, res) => {
  try {
    const { error } = statusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
      });
    }
    const status = await Status.create(req.body);
    if (!status) {
      return res.status(400).json({
        message: 'Thêm trạng thái thất bại',
      });
    }
    return res.status(200).json({
      message: 'Thêm trạng thái thành công',
      status,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};


export const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const { error } = statusSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message)
      return res.status(400).json({
        message: errors
      })
    }
    const status = await Status.findByIdAndUpdate(id, body, { new: true, });
    if (!status) {
      return res.status(404).json({
        message: 'Cập nhật trạng thái thất bại',
      });
    }
    return res.status(200).json({
      message: "Cập nhật trạng thái thành công",
      status
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}