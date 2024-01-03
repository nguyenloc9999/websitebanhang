import History from "../models/orderHistory.js";
import { HistorySchema } from "../schemas/orderHistory.js";
import Status from "../models/status.js";

export const createHistory = async (req, res) => {
    try {
        const { userId, orderId, old_status, new_status } = req.body;
        const { error } = HistorySchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const oldStatus = await Status.findById(old_status);
        const newStatus = await Status.findById(new_status);

        const history = await History.create({
            userId: userId,
            orderId: orderId,
            old_status: oldStatus.status_name,
            new_status: newStatus.status_name
        });
        if (history.length === 0) {
            return res.status(400).json({
                message: "Lưu lịch sử thất bại"
            })
        }
        return res.status(200).json({ message: 'Trạng thái đã được thay đổi.', history });
    } catch (error) {
        return res.status(500).json({ message: 'Đã xảy ra lỗi khi lưu trạng thái.', error });
    }
};
export const getByOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const histories = await History.find({ orderId }).populate({
            path: 'userId',
            select: 'first_name last_name',
        }).sort({ createdAt: -1 });

        if (histories.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy lịch sử cho đơn hàng này!",
            });
        }

        return res.status(200).json({
            message: "Lấy trạng thái đơn hàng thành công",
            histories
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

