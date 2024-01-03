import Order from '../models/orders.js';
import Product from "../models/products.js";
import Auth from "../models/auth.js";
import mongoose from 'mongoose';
import Comment from "../models/comments.js";    
import Status from "../models/status.js";

export const getRevenueAndProfit = async (req, res) => {
    try {
        const { year, month } = req.query;
        let matchCondition = {};

        if (year) {
            matchCondition.year = parseInt(year);
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        if (month) {
            matchCondition.month = parseInt(month);
        }

        if (!year && !month) {
            return res.status(400).json({ error: 'Thiếu thông tin tháng hoặc năm trong yêu cầu.' });
        }

        const revenueAndProfit = await Order.aggregate([
            {
                $match: {
                    $or: [
                        { status: new mongoose.Types.ObjectId('64e8a93da63d2db5e8d8562a') },
                        { status: new mongoose.Types.ObjectId('64e8a93da63d2db5e8d8562b') },
                        { status: new mongoose.Types.ObjectId('64e8a93da63d2db5e8d8562d') },
                        { status: new mongoose.Types.ObjectId('656596893a59bec4e5baea02') },
                        { status: new mongoose.Types.ObjectId('6565969f3a59bec4e5baea03') },
                    ],
                },
            },
            {
                $project: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    total: 1,
                    status: 1,
                    deposit: {
                        $cond: {
                            if: { $eq: ['$status', new mongoose.Types.ObjectId('6565969f3a59bec4e5baea03')] },
                            then: '$deposit',
                            else: { $add: ['$total', '$deposit'] }, // Nếu không phải đơn đã huỷ, sử dụng giá trị 0
                        },
                    },
                },
            },
            {
                $match: matchCondition,
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                        month: '$month',
                    },
                    total: { $sum: '$deposit' }, // Tổng tiền đơn hàng
                },
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    total: 1,
                },
            },
            {
                $sort: {
                    month: 1,
                },
            },
        ]);

        res.json(revenueAndProfit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
};

export const getTopSellingProducts = async (req, res) => {
    try {
        const { year, month } = req.query;
        let query = {};

        if (year && month) {
            query = {
                $and: [
                    { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } },
                    { $expr: { $eq: [{ $month: '$createdAt' }, parseInt(month)] } }
                ]
            };
        } else if (year) {
            query = { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } };
        } else if (month) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin tháng hoặc năm trong yêu cầu.' });
        }

        // Thực hiện truy vấn dựa trên query
        const topSellingProducts = await Product.aggregate([
            {
                $match: query,
            },
            {
                $sort: { sold_quantity: -1 },
            },
            {
                $limit: 5, // Lấy top 5 sản phẩm
            },
        ]);

        res.json(topSellingProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

export const getTopViewedProducts = async (req, res) => {
    try {
        const { year, month } = req.query;
        let query = {};

        if (year && month) {
            query = {
                $and: [
                    { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } },
                    { $expr: { $eq: [{ $month: '$createdAt' }, parseInt(month)] } }
                ]
            };
        } else if (year) {
            query = { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } };
        } else if (month) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin tháng hoặc năm trong yêu cầu.' });
        }

        // Thực hiện truy vấn dựa trên query
        const topSellingProducts = await Product.aggregate([
            {
                $match: query,
            },
            {
                $sort: { views: -1 },
            },
            {
                $limit: 5, // Lấy top 5 sản phẩm
            },
        ]);

        res.json(topSellingProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

export const getTotalSoldQuantity = async (req, res) => {
    try {
        const { year, month } = req.query;
        const matchCondition = {}; // Điều kiện tìm kiếm dựa trên năm và/hoặc tháng
        const projectFields = {
            sold_quantity: 1,
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
        };

        if (year) {
            matchCondition.year = parseInt(year);
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        if (month) {
            matchCondition.month = parseInt(month);
        }

        if (!year && !month) {
            return res.status(400).json({ error: 'Thiếu thông tin tháng hoặc năm trong yêu cầu.' });
        }

        const aggregationStages = [
            {
                $project: projectFields,
            },
            {
                $match: matchCondition,
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                        month: '$month',
                    },
                    totalSoldQuantity: { $sum: '$sold_quantity' },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    totalSoldQuantity: 1,
                },
            },
            {
                $sort: {
                    year: 1,
                    month: 1,
                },
            },
        ];

        // Kiểm tra nếu không có điều kiện tháng (chỉ có năm), thì gộp tất cả dữ liệu thành 1
        if (!month) {
            aggregationStages.splice(2, 1, {
                $group: {
                    _id: {
                        year: '$year',
                    },
                    totalSoldQuantity: { $sum: '$sold_quantity' },
                },
            });
        }

        const totalSoldQuantity = await Product.aggregate(aggregationStages);

        res.json(totalSoldQuantity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}
export const getTotalCreatedProducts = async (req, res) => {
    try {
        const { year, month } = req.query;
        const aggregationStages = [];

        if (year) {
            aggregationStages.push({
                $match: {
                    createdAt: {
                        $gte: new Date(parseInt(year), 0, 1),
                        $lt: new Date(parseInt(year) + 1, 0, 1),
                    },
                },
            });

            if (month) {
                aggregationStages[0].$match.createdAt = {
                    $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                    $lt: new Date(parseInt(year), parseInt(month), 1),
                };
            }
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        const groupFields = { year: { $year: '$createdAt' } };
        if (month) {
            groupFields.month = { $month: '$createdAt' };
        }

        const result = await Product.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: groupFields,
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}
export const getSellingProductsData = async (req, res) => {
    try {
        const { year, month } = req.query;

        let query = {};

        if (year && month) {
            query = {
                $and: [
                    { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } },
                    { $expr: { $eq: [{ $month: '$createdAt' }, parseInt(month)] } }
                ]
            };
        } else if (year) {
            query = { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } };
        } else if (month) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin tháng hoặc năm trong yêu cầu.' });
        }

        const sellingProductsData = await Product.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: 'categories', // Tên của collection chứa danh mục
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $group: {
                    _id: '$category.category_name', // Gom nhóm theo tên danh mục
                    totalSold: { $sum: '$sold_quantity' } // Tính tổng số sản phẩm đã bán
                }
            },
            {
                $match: {
                    totalSold: { $gt: 0 } // Lọc các danh mục có lượng bán lớn hơn 0
                }
            }
        ]);

        res.json(sellingProductsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

export const getTotalOrder = async (req, res) => {
    try {
        const { year, month } = req.query;
        const aggregationStages = [];

        if (year) {
            aggregationStages.push({
                $match: {
                    createdAt: {
                        $gte: new Date(parseInt(year), 0, 1),
                        $lt: new Date(parseInt(year) + 1, 0, 1),
                    },
                },
            });

            if (month) {
                aggregationStages[0].$match.createdAt = {
                    $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                    $lt: new Date(parseInt(year), parseInt(month), 1),
                };
            }
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        const groupFields = { year: { $year: '$createdAt' } };
        if (month) {
            groupFields.month = { $month: '$createdAt' };
        }

        const result = await Order.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: groupFields,
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

export const getUserStatistics = async (req, res) => {
    try {
        const { year, month } = req.query;
        const aggregationStages = [];

        if (year) {
            aggregationStages.push({
                $match: {
                    createdAt: {
                        $gte: new Date(parseInt(year), 0, 1),
                        $lt: new Date(parseInt(year) + 1, 0, 1),
                    },
                },
            });

            if (month) {
                aggregationStages[0].$match.createdAt = {
                    $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                    $lt: new Date(parseInt(year), parseInt(month), 1),
                };
            }
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        const groupFields = { year: { $year: '$createdAt' } };
        if (month) {
            groupFields.month = { $month: '$createdAt' };
        }

        const result = await Auth.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: groupFields,
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

// 
export const getReviewStatistics = async (req, res) => {
    try {
        const { year, month } = req.query;
        const aggregationStages = [];

        if (year) {
            aggregationStages.push({
                $match: {
                    createdAt: {
                        $gte: new Date(parseInt(year), 0, 1),
                        $lt: new Date(parseInt(year) + 1, 0, 1),
                    },
                },
            });

            if (month) {
                aggregationStages[0].$match.createdAt = {
                    $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                    $lt: new Date(parseInt(year), parseInt(month), 1),
                };
            }
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        const result = await Comment.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: null,
                    totalReviewCount: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    reviewDistribution: {
                        $push: {
                            rating: '$rating',
                        },
                    },
                },
            },
        ]);
        if (result.length === 0) {
            return res.status(200).json({
                tongdanhgia: 0,
                trungbinh: 0,
                tichcuc: 0,
                tieucuc: 0,
            });
        }
        const totalReviewCount = result[0].totalReviewCount;
        const averageRating = (result[0].averageRating).toFixed(2);
        const reviewDistribution = result[0].reviewDistribution;

        const positiveCount = reviewDistribution.filter((item) => item.rating > 3).length;
        const negativeCount = reviewDistribution.filter((item) => item.rating <= 3).length;

        res.json({
            tongdanhgia: totalReviewCount,
            trungbinh: averageRating,
            tichcuc: positiveCount,
            tieucuc: negativeCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}


export const getOrderUnconfirmed = async (req, res) => {
    try {
        const { year, month } = req.query;

        // Lấy dữ liệu trạng thái từ collection "statuses"
        const statuses = await Status.find({});

        const aggregationStages = [];

        if (!year) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        // Điều kiện để lọc trạng thái chưa xác nhận
        const notCompletedStatuses = statuses.filter(status => status.status_name !== 'Đã hoàn thành' && status.status_name !== 'Đã xác nhận' && status.status_name !== 'Đang giao hàng' && status.status_name !== 'Đã huỷ');

        aggregationStages.push({
            $match: {
                createdAt: {
                    $gte: new Date(parseInt(year), 0, 1),
                    $lt: new Date(parseInt(year) + 1, 0, 1),
                },
                'status': { $in: notCompletedStatuses.map(status => status._id) }
            }
        });

        if (month) {
            aggregationStages[0].$match.createdAt = {
                $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                $lt: new Date(parseInt(year), parseInt(month), 1),
            };
        }

        const groupFields = { year: { $year: '$createdAt' } };
        if (month) {
            groupFields.month = { $month: '$createdAt' };
        }

        const result = await Order.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: groupFields,
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}
export const getOrderConfirmed = async (req, res) => {
    try {
        const { year, month } = req.query;

        // Lấy dữ liệu trạng thái từ collection "statuses"
        const statuses = await Status.find({});

        const aggregationStages = [];

        if (!year) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        // Điều kiện để lọc trạng thái chưa xác nhận
        const notCompletedStatuses = statuses.filter(status => status.status_name !== 'Đã hoàn thành' && status.status_name !== 'Chưa xác nhận' && status.status_name !== 'Đang giao hàng' && status.status_name !== 'Đã huỷ');

        aggregationStages.push({
            $match: {
                createdAt: {
                    $gte: new Date(parseInt(year), 0, 1),
                    $lt: new Date(parseInt(year) + 1, 0, 1),
                },
                'status': { $in: notCompletedStatuses.map(status => status._id) }
            }
        });

        if (month) {
            aggregationStages[0].$match.createdAt = {
                $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                $lt: new Date(parseInt(year), parseInt(month), 1),
            };
        }

        const groupFields = { year: { $year: '$createdAt' } };
        if (month) {
            groupFields.month = { $month: '$createdAt' };
        }

        const result = await Order.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: groupFields,
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}
export const getOrderAccomplished = async (req, res) => {
    try {
        const { year, month } = req.query;

        // Lấy dữ liệu trạng thái từ collection "statuses"
        const statuses = await Status.find({});

        const aggregationStages = [];

        if (!year) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        // Điều kiện để lọc trạng thái chưa xác nhận
        const notCompletedStatuses = statuses.filter(status => status.status_name !== 'Đã xác nhận' && status.status_name !== 'Chưa xác nhận' && status.status_name !== 'Đang giao hàng' && status.status_name !== 'Đã huỷ');

        aggregationStages.push({
            $match: {
                createdAt: {
                    $gte: new Date(parseInt(year), 0, 1),
                    $lt: new Date(parseInt(year) + 1, 0, 1),
                },
                'status': { $in: notCompletedStatuses.map(status => status._id) }
            }
        });

        if (month) {
            aggregationStages[0].$match.createdAt = {
                $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                $lt: new Date(parseInt(year), parseInt(month), 1),
            };
        }

        const groupFields = { year: { $year: '$createdAt' } };
        if (month) {
            groupFields.month = { $month: '$createdAt' };
        }

        const result = await Order.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: groupFields,
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}


export const getOrderDelivering = async (req, res) => {
    try {
        const { year, month } = req.query;

        // Lấy dữ liệu trạng thái từ collection "statuses"
        const statuses = await Status.find({});

        const aggregationStages = [];

        if (!year) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        // Điều kiện để lọc trạng thái chưa xác nhận
        const notCompletedStatuses = statuses.filter(status => status.status_name !== 'Đã xác nhận' && status.status_name !== 'Chưa xác nhận' && status.status_name !== 'Đã hoàn thành' && status.status_name !== 'Đã huỷ');

        aggregationStages.push({
            $match: {
                createdAt: {
                    $gte: new Date(parseInt(year), 0, 1),
                    $lt: new Date(parseInt(year) + 1, 0, 1),
                },
                'status': { $in: notCompletedStatuses.map(status => status._id) }
            }
        });

        if (month) {
            aggregationStages[0].$match.createdAt = {
                $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                $lt: new Date(parseInt(year), parseInt(month), 1),
            };
        }

        const groupFields = { year: { $year: '$createdAt' } };
        if (month) {
            groupFields.month = { $month: '$createdAt' };
        }

        const result = await Order.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: groupFields,
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}
export const getOrderCanceled = async (req, res) => {
    try {
        const { year, month } = req.query;

        // Lấy dữ liệu trạng thái từ collection "statuses"
        const statuses = await Status.find({});

        const aggregationStages = [];

        if (!year) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        // Điều kiện để lọc trạng thái chưa xác nhận
        const notCompletedStatuses = statuses.filter(status => status.status_name !== 'Đã xác nhận' && status.status_name !== 'Chưa xác nhận' && status.status_name !== 'Đã hoàn thành' && status.status_name !== 'Đang giao hàng');

        aggregationStages.push({
            $match: {
                createdAt: {
                    $gte: new Date(parseInt(year), 0, 1),
                    $lt: new Date(parseInt(year) + 1, 0, 1),
                },
                'status': { $in: notCompletedStatuses.map(status => status._id) }
            }
        });

        if (month) {
            aggregationStages[0].$match.createdAt = {
                $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                $lt: new Date(parseInt(year), parseInt(month), 1),
            };
        }

        const groupFields = { year: { $year: '$createdAt' } };
        if (month) {
            groupFields.month = { $month: '$createdAt' };
        }

        const result = await Order.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: groupFields,
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}