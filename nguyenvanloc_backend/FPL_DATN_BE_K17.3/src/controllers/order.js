import Order from "../models/orders.js"
import { orderSchema } from "../schemas/order.js";
import Coupon from "../models/coupons.js"
import Product from "../models/products.js";
import ChildProduct from "../models/childProduct.js";
const { createHmac } = await import('node:crypto');
import { request } from 'https';
import paypal from 'paypal-rest-sdk'
import axios from "axios";
import { sendOrderEmail } from "./auth.js";
import notifier from "node-notifier";
import Auth from "../models/auth.js";

export const getOrderByUserId = async (req, res) => {
    try {
        const id = req.params.userId
        const order = await Order.find({ userId: id }).populate('products.productId status').sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Lấy thông tin người dùng đặt hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const id = req.params.id
        const order = await Order.findById(id).populate('products.productId status userId couponId')
        if (!order || order.length === 0) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json({
            message: "Lấy 1 đơn hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getAllOrder = async (req, res) => {
    try {
        const order = await Order.find().populate('products.productId status userId').sort({ createdAt: -1 });
        if (!order) {
            return res.status(404).json({
                error: "Lấy tất cả đơn hàng thất bại"
            })
        }
        return res.status(200).json({
            message: "Lấy tất cả đơn hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const removeOrder = async (req, res) => {
    try {
        // Tìm đơn hàng để lấy thông tin sản phẩm đã mua
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            });
        }
        // Lặp qua từng sản phẩm trong đơn hàng và cập nhật lại số lượng sản phẩm và view
        for (const item of order.products) {
            // Tăng số lượng sản phẩm lên theo số lượng đã hủy
            const childProduct = await ChildProduct.findOne({
                productId: item.productId,
                colorId: item.colorId,
                sizeId: item.sizeId
            });
            if (childProduct) {
                childProduct.stock_quantity += item.stock_quantity;
                await childProduct.save();
            }
        }
        await Order.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Xóa đơn hàng thành công!",
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AQyc1P8zTxcYbL9RgIIeJDyrClQl8pCATFKLf9o-BW5FqkisSdtBMlblVOg611WhgQg429hx6JUnjdeE',
    'client_secret': 'ENYh-J6nt272nE7bQ_nWtAUijIwvlt0Yf9IYU2-Y6vDBT6lZYYw6-xNMSqt9vISwLlPC6vHs-_T6s3dx'
});

export const createOrder = async (req, res) => {
    try {
        const body = req.body;
        const { error } = orderSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        if (Number(body.total + body.shipping) > 5000000) {
            if (Number(body.total + body.shipping) > 5000000 && body.type == 'momo') {
                const accessKey = 'F8BBA842ECF85';
                const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
                const orderInfo = 'CỌC ĐƠN HÀNG MOMO';
                const partnerCode = 'MOMO';
                const redirectUrl = 'http://localhost:8088/api/momo-deposit';
                const ipnUrl = 'http://localhost:8088/api/momo-deposit';
                const requestType = "payWithMethod";
                const amount = Math.floor((req.body.total + req.body.shipping) * 0.2);
                const orderId = partnerCode + new Date().getTime();
                const requestId = orderId;
                // Bổ sung
                const total = (req.body.total + req.body.shipping) - amount;
                const userId = req.body.userId;
                const couponId = req.body.couponId;
                const products = req.body.products;
                const status = req.body.status;
                const phone = req.body.phone;
                const address = req.body.address;
                const shipping = req.body.shipping
                const notes = req.body.notes;
                const extraData = `total=${total}&shipping=${shipping}&userId=${userId}&couponId=${couponId}&phone=${phone}&address=${address}&products=${JSON.stringify(products)}`;
                const orderGroupId = '';
                const autoCapture = true;
                const lang = 'vi';
                // Create raw signature
                const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
                // Generate signature
                const signature = createHmac('sha256', secretKey)
                    .update(rawSignature)
                    .digest('hex');
                // JSON object to send to MoMo endpoint
                const requestBody = JSON.stringify({
                    partnerCode: partnerCode,
                    partnerName: "Test",
                    storeId: "MomoTestStore",
                    requestId: requestId,
                    amount: amount,
                    orderId: orderId,
                    orderInfo: orderInfo,
                    redirectUrl: redirectUrl,
                    ipnUrl: ipnUrl,
                    lang: lang,
                    requestType: requestType,
                    autoCapture: autoCapture,
                    extraData: extraData,
                    orderGroupId: orderGroupId,
                    signature: signature,
                    // 
                    total: total,
                    userId: userId,
                    couponId: couponId,
                    products: products,
                    status: status,
                    phone: phone,
                    address: address,
                    shipping: shipping,
                    notes: notes
                });

                // HTTPS request options
                const options = {
                    hostname: 'test-payment.momo.vn',
                    port: 443,
                    path: '/v2/gateway/api/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody)
                    },
                };

                // Send the request and get the response
                const momoRequest = request(options, momoResponse => {
                    momoResponse.setEncoding('utf8');
                    momoResponse.on('data', body => {
                        res.json({ payUrl: JSON.parse(body).payUrl });
                    });
                    momoResponse.on('end', () => {
                        console.log('No more data in response.');
                    });
                });
                momoRequest.on('error', error => {
                    console.log(`Problem with request: ${error.message}`);
                    res.status(500).json({ error: 'Internal Server Error' });
                });

                // Write data to request body
                console.log("Sending....");
                momoRequest.write(requestBody);
                momoRequest.end();
            } else if (Number(body.total + body.shipping) > 5000000 && body.type == 'paypal') {
                const { products, userId, couponId, phone, address, notes, shipping, total } = req.body
                const rate = await axios.get(`https://openexchangerates.org/api/latest.json/?app_id=7ca0b8d132d64563990a974556701e6d&base=USD`)
                const exchangeRate = 1 / rate.data.rates.VND;
                const shippingFee = Number(((shipping * 0.2) * exchangeRate).toFixed(2));
                const transformedProducts = products.map(product => {
                    const classOption = `Price=${product.product_price}&&Color=${product.colorId}&&Size=${product.sizeId}&&Material=${product.materialId}&&Formation=${product.formation}`;
                    const priceUsd = ((product.product_price * 0.2) * exchangeRate).toFixed(2);
                    return {
                        sku: product.productId,
                        name: product.product_name,
                        quantity: product.stock_quantity,
                        image_url: product.image,
                        description: classOption,
                        price: priceUsd,
                        currency: 'USD',
                    };
                });
                const totalMoney = transformedProducts.reduce((acc, product) => {
                    return acc + (product.price * product.quantity);
                }, 0);
                const money = Number(totalMoney.toFixed(2));

                const create_payment_json = {
                    intent: 'sale',
                    payer: {
                        payment_method: 'paypal',
                    },
                    redirect_urls: {
                        return_url: `http://localhost:8088/api/paypal_deposit`,
                        cancel_url: `http://localhost:5173/carts`,
                    },
                    transactions: [
                        {
                            item_list: {
                                items: transformedProducts,
                            },
                            amount: {
                                currency: 'USD',
                                total: (money + shippingFee).toFixed(2).toString(),
                                details: {
                                    subtotal: money.toFixed(2).toString(),
                                    shipping: shippingFee.toFixed(2).toString(), // Định nghĩa phí vận chuyển
                                },
                            },
                            description: notes,
                            custom: JSON.stringify({
                                phone: phone,
                                address: address,
                                userId: userId,
                                couponId: couponId,
                                shipping: shipping,
                                total: total,
                                notes: notes
                            }),
                        },
                    ],
                };
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        res.status(400).json(error)
                    } else {
                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === 'approval_url') {
                                // Trả về đường link dưới dạng JSON response
                                res.json({ approval_url: payment.links[i].href });
                                return; // Dừng hàm và kết thúc response
                            }
                        }
                    }
                });
            }

        } else {
            body.total = body.total + body.shipping;
            // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
            if (body.couponId !== null) {
                // Tăng số lượng phiếu giảm giá đã sử dụng lên 1
                const coupon = await Coupon.findById(body.couponId);
                if (coupon) {
                    if (coupon.coupon_quantity > 0) {
                        coupon.coupon_quantity -= 1;
                        await coupon.save();
                    } else {
                        return res.status(400).json({ message: 'Phiếu giảm giá đã hết lượt sử dụng' });
                    }
                }
            }

            // Lặp qua từng sản phẩm trong đơn hàng và cập nhật số lượng và số lượng sản phẩm đã bán
            for (const item of body.products) {
                const product = await Product.findById(item.productId);
                const childProduct = await ChildProduct.findOne({
                    productId: item.productId,
                    colorId: item.colorId,
                    sizeId: item.sizeId
                });
                if (product && childProduct) {
                    // Giảm số lượng sản phẩm tương ứng với số lượng mua
                    childProduct.stock_quantity -= item.stock_quantity; // Giảm số lượng theo số lượng trong giỏ hàng
                    // Tăng số lượng đã bán (view) tương ứng với số lượng mua
                    product.sold_quantity += item.stock_quantity; // Tăng view theo số lượng trong giỏ hàng
                    await childProduct.save();
                    await product.save();
                }
            }

            const order = await Order.create(body);
            const orderIdString = order._id.toString();
            await sendOrderEmail({ userId: body.userId, orderId: orderIdString });
            notifier.notify({
                title: "ÔNG CHỦ ƠI, CÓ ĐƠN HÀNG MỚI",
                message: "Bạn có đơn hàng mới!"
            })
            if (!order) {
                return res.status(404).json({
                    error: "Đặt hàng thất bại"
                })
            }
            return res.status(200).json({
                message: "Đặt hàng thành công",
                order
            });
        }


    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}



export const updateOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = orderSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const order = await Order.findByIdAndUpdate(id, body, { new: true }).populate('products.productId status')
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật đơn hàng thành công",
            orderUpdateSuccess: order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { status } = body;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        const user = await Auth.findById(order.userId);
        if (user._id != body.userId && order.deposit > 0 && user.role == 'admin' && status == '6565969f3a59bec4e5baea03') {
            return res.status(404).json({
                message: "Đơn hàng đã cọc, không thể huỷ!"
            })
        }
        if (order.deposit === 0 && order.payerId && (status == '64e8a93da63d2db5e8d8562a')) {
            return res.status(404).json({
                message: "Đơn hàng đã thanh toán toàn bộ tiền, không thể chuyển sang chưa xác nhận!"
            });
        }
        if (order.status == status) {
            return res.status(404).json({
                message: "Trạng thái đơn hàng đã là trạng thái bạn muốn cập nhật"
            });
        }
        if (order.status == '656596893a59bec4e5baea02') {
            return res.status(404).json({
                message: "Đơn hàng đã hoàn thành, không thể cập nhật trạng thái"
            })
        }
        const orderUpdate = await Order.findByIdAndUpdate(id, body, { new: true })

        return res.status(200).json({
            message: "Huỷ đơn hàng thành công",
            messages: 'Cập nhật trạng thái đơn hàng thành công',
            orderUpdateSuccess: orderUpdate
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}