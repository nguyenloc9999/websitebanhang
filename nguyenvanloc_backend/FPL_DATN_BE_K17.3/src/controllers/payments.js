const { createHmac } = await import('node:crypto');
import { request } from 'https';
import paypal from 'paypal-rest-sdk'
import Order from "../models/orders.js"
import Coupon from "../models/coupons.js"
import Product from "../models/products.js";
import ChildProduct from "../models/childProduct.js";
import CryptoJS from "crypto-js";
import axios from 'axios';
import moment from 'moment';
import Cart from '../models/cart.js'
import { sendOrderEmail } from './auth.js';
import dotenv from "dotenv";
dotenv.config();

export const PayMomo = (req, res) => {
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'THANH TOÁN MOMO';
    const partnerCode = 'MOMO';
    const redirectUrl = process.env.REDIRECT_MOMO;
    const ipnUrl = process.env.REDIRECT_MOMO;
    const requestType = "payWithMethod";
    const amount = Math.floor(req.body.total + req.body.shipping)
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    // Bổ sung
    const userId = req.body.userId;
    const couponId = req.body.couponId;
    const products = req.body.products;
    const status = req.body.status;
    const phone = req.body.phone;
    const address = req.body.address;
    const shipping = req.body.shipping;
    const notes = req.body.notes;
    const extraData = `userId=${userId}&shipping=${shipping}&couponId=${couponId}&phone=${phone}&address=${address}&notes=${notes}&products=${JSON.stringify(products)}`;
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
};



export const MomoSuccess = async (req, res) => {
    const body = req.query;
    const total = body.amount
    const paymentId = body.orderId;
    const paymentCode = body.requestId;
    const payerId = body.orderInfo
    // Tạo một đối tượng để lưu trữ các giá trị
    const data = {};

    // Tách chuỗi thành các cặp key-value dựa trên dấu "&"
    const keyValuePairs = body.extraData.split('&');

    // Lặp qua từng cặp key-value
    keyValuePairs.forEach((keyValue) => {
        // Tách mỗi cặp thành key và value dựa trên dấu "="
        const [key, value] = keyValue.split('=');

        // Kiểm tra nếu giá trị là một chuỗi JSON
        if (key === 'products') {
            // Sử dụng JSON.parse() để chuyển thành đối tượng JavaScript
            data[key] = JSON.parse(decodeURIComponent(value));
        } else {
            // Lưu trữ các giá trị khác
            data[key] = decodeURIComponent(value);
        }
    });
    // Bây giờ bạn có thể truy cập các giá trị từ đối tượng data
    const userId = data.userId;
    const shipping = data.shipping;
    const couponId = data.couponId;
    const phone = data.phone;
    const address = data.address;
    const notes = data.notes;
    const products = data.products;

    // Xử lý dữ liệu theo cách bạn muốn ở đây
    const formattedData = {
        userId,
        couponId,
        products: products,
        total: Number(total),
        shipping: Number(shipping),
        status: '64e8a93da63d2db5e8d8562b',
        phone,
        address,
        notes,
        paymentId,
        paymentCode,
        payerId
    };
    if (formattedData.notes === 'undefined') {
        // Chuyển chuỗi "null" thành giá trị null
        formattedData.notes = undefined;
    }
    if (formattedData.couponId === 'null') {
        // Chuyển chuỗi "null" thành giá trị null
        formattedData.couponId = null;
    }
    // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
    if (formattedData.couponId !== null) {
        // Tăng số lượng phiếu giảm giá đã sử dụng lên 1
        const coupon = await Coupon.findById(formattedData.couponId);
        if (coupon) {
            coupon.coupon_quantity -= 1;
            await coupon.save();
        }
    }
    // Lặp qua từng sản phẩm trong đơn hàng và cập nhật số lượng và số lượng sản phẩm đã bán
    for (const item of formattedData.products) {
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
    const order = await Order.create(formattedData);
    const orderIdString = order._id.toString();
    await sendOrderEmail({ userId: userId, orderId: orderIdString });

    const cartExist = await Cart.findOne({ userId });
    cartExist.products = []; // Xoá tất cả sản phẩm trong giỏ hàng
    cartExist.total = 0;// Đặt tổng giá trị về 0
    cartExist.couponId = null
    await cartExist.save();

    res.redirect(process.env.REDIRECT_SUCCESS);
}

// 
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AQyc1P8zTxcYbL9RgIIeJDyrClQl8pCATFKLf9o-BW5FqkisSdtBMlblVOg611WhgQg429hx6JUnjdeE',
    'client_secret': 'ENYh-J6nt272nE7bQ_nWtAUijIwvlt0Yf9IYU2-Y6vDBT6lZYYw6-xNMSqt9vISwLlPC6vHs-_T6s3dx'
});

export const PayPal = async (req, res) => {
    const { products, userId, couponId, phone, address, notes, shipping } = req.body
    const rate = await axios.get(`https://openexchangerates.org/api/latest.json/?app_id=7ca0b8d132d64563990a974556701e6d&base=USD`)
    const exchangeRate = 1 / rate.data.rates.VND;
    const shippingFee = Number((shipping * exchangeRate).toFixed(2));
    const transformedProducts = products.map(product => {
        const classOption = `Price=${product.product_price}&&Color=${product.colorId}&&Size=${product.sizeId}&&Material=${product.materialId}&&Formation=${product.formation}`;
        const priceUsd = (product.product_price * exchangeRate).toFixed(2);
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
            return_url: process.env.PAYPAL_SUCCESS,
            cancel_url: process.env.PAYPAL_CANCEL,
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
                        subtotal: money.toString(),
                        shipping: shippingFee.toString(), // Định nghĩa phí vận chuyển
                    },
                },
                description: notes,
                custom: JSON.stringify({
                    phone: phone,
                    address: address,
                    userId: userId,
                    couponId: couponId,
                    shipping: shipping,
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


export const PayPalSuccess = (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const token = req.query.token;
    const execute_payment_json = {
        "payer_id": payerId,
    };
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            console.log(error.response);
            // Xử lý lỗi ở đây nếu cần
        } else {
            // Truy cập thông tin giao dịch từ đối tượng payment
            const productList = payment.transactions[0].item_list.items.map(item => {
                const classOption = item.description.split('&&'); // Tách thông tin theo dấu &&
                // Khởi tạo các biến để lưu thông tin
                let color = '';
                let size = '';
                let material = '';
                let price = '';
                let formation = '';
                // Lặp qua từng phần tử trong productInfo
                classOption.forEach(info => {
                    if (info.includes('Color=')) {
                        color = info.replace('Color=', ''); // Lấy màu sắc sau "Color="
                    }
                    if (info.includes('Size=')) {
                        size = info.replace('Size=', ''); // Lấy kích thước sau "Size="
                    }
                    if (info.includes('Material=')) {
                        material = info.replace('Material=', ''); // Lấy kích thước sau "Material="
                    }
                    if (info.includes('Price=')) {
                        price = info.replace('Price=', '');
                    }
                    if (info.includes('Formation=')) {
                        formation = info.replace('Formation=', '');
                    }
                });
                return {
                    product_name: item.name,
                    stock_quantity: item.quantity,
                    product_price: Number(price),
                    productId: item.sku,
                    image: item.image_url,
                    colorId: color, // Lưu thông tin color
                    sizeId: size, // Lưu thông tin size
                    materialId: material,
                    formation: formation
                };
            });
            // Bây giờ bạn có thể sử dụng danh sách sản phẩm productList trong mã của bạn
            const customData = JSON.parse(payment.transactions[0].custom);
            const phone = customData.phone;
            const address = customData.address;
            const userId = customData.userId;
            const couponId = customData.couponId;
            const shipping = customData.shipping;
            const notes = customData.notes
            const totalMoney = productList.reduce((acc, product) => {
                return acc + (product.product_price * product.stock_quantity);
            }, 0);
            // Tạo đối tượng có định dạng bạn mong muốn
            const formattedData = {
                products: productList,
                total: totalMoney + shipping,
                shipping: shipping,
                status: '64e8a93da63d2db5e8d8562b',
                phone,
                address,
                userId,
                couponId,
                notes,
                paymentId,
                paymentCode: token,
                payerId
            };
            if (formattedData.couponId === 'null') {
                // Chuyển chuỗi "null" thành giá trị null
                formattedData.couponId = null;
            }
            // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
            if (formattedData.couponId !== null) {
                // Tăng số lượng phiếu giảm giá đã sử dụng lên 1
                const coupon = await Coupon.findById(formattedData.couponId);
                if (coupon && coupon.coupon_quantity > 0) {
                    coupon.coupon_quantity -= 1;
                    await coupon.save();
                } else {
                    res.send("Đã hết phiếu giảm giá");
                    return
                }
            }
            // Lặp qua từng sản phẩm trong đơn hàng và cập nhật số lượng và số lượng sản phẩm đã bán
            for (const item of formattedData.products) {
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
            const cartExist = await Cart.findOne({ userId });
            cartExist.products = []; // Xoá tất cả sản phẩm trong giỏ hàng
            cartExist.total = 0;// Đặt tổng giá trị về 0
            cartExist.couponId = null
            await cartExist.save();
            const order = await Order.create(formattedData);
            const orderIdString = order._id.toString();
            await sendOrderEmail({ userId: userId, orderId: orderIdString });
            res.redirect(process.env.REDIRECT_SUCCESS);
        }
    });
}
// 
export const depositSuccess = async (req, res) => {
    const body = req.query;
    const deposit = body.amount
    const paymentId = body.orderId;
    const paymentCode = body.requestId;
    const payerId = body.orderInfo;

    // Tạo một đối tượng để lưu trữ các giá trị
    const data = {};

    // Tách chuỗi thành các cặp key-value dựa trên dấu "&"
    const keyValuePairs = body.extraData.split('&');

    // Lặp qua từng cặp key-value
    keyValuePairs.forEach((keyValue) => {
        // Tách mỗi cặp thành key và value dựa trên dấu "="
        const [key, value] = keyValue.split('=');

        // Kiểm tra nếu giá trị là một chuỗi JSON
        if (key === 'products') {
            // Sử dụng JSON.parse() để chuyển thành đối tượng JavaScript
            data[key] = JSON.parse(decodeURIComponent(value));
        } else {
            // Lưu trữ các giá trị khác
            data[key] = decodeURIComponent(value);
        }
    });

    // Bây giờ bạn có thể truy cập các giá trị từ đối tượng data
    const userId = data.userId;
    const couponId = data.couponId;
    const phone = data.phone;
    const address = data.address;
    const products = data.products;
    const total = data.total;
    const shipping = data.shipping;
    const notes = data.notes;
    // Xử lý dữ liệu theo cách bạn muốn ở đây
    const formattedData = {
        userId,
        couponId,
        products: products,
        total: Number(total),
        deposit: Number(deposit),
        shipping: Number(shipping),
        phone,
        address,
        notes,
        paymentId,
        paymentCode,
        payerId
    };
    if (formattedData.couponId === 'null') {
        // Chuyển chuỗi "null" thành giá trị null
        formattedData.couponId = null;
    }
    // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
    if (formattedData.couponId !== null) {
        // Tăng số lượng phiếu giảm giá đã sử dụng lên 1
        const coupon = await Coupon.findById(formattedData.couponId);
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
    for (const item of formattedData.products) {
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
    const order = await Order.create(formattedData);
    const orderIdString = order._id.toString();
    await sendOrderEmail({ userId: userId, orderId: orderIdString });
    const cartExist = await Cart.findOne({ userId });
    cartExist.products = []; // Xoá tất cả sản phẩm trong giỏ hàng
    cartExist.total = 0;// Đặt tổng giá trị về 0
    cartExist.couponId = null
    await cartExist.save();
    res.redirect(process.env.REDIRECT_SUCCESS);
}

export const depositPaypal = async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const token = req.query.token;
    const execute_payment_json = {
        "payer_id": payerId,
    };
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
            console.log(error.response);
            // Xử lý lỗi ở đây nếu cần
        } else {
            // Truy cập thông tin giao dịch từ đối tượng payment
            const productList = payment.transactions[0].item_list.items.map(item => {
                const classOption = item.description.split('&&'); // Tách thông tin theo dấu &&
                // Khởi tạo các biến để lưu thông tin
                let color = '';
                let size = '';
                let material = '';
                let price = '';
                let formation = '';

                // Lặp qua từng phần tử trong productInfo
                classOption.forEach(info => {
                    if (info.includes('Color=')) {
                        color = info.replace('Color=', ''); // Lấy màu sắc sau "Color="
                    }
                    if (info.includes('Size=')) {
                        size = info.replace('Size=', ''); // Lấy kích thước sau "Size="
                    }
                    if (info.includes('Material=')) {
                        material = info.replace('Material=', ''); // Lấy kích thước sau "Material="
                    }
                    if (info.includes('Price=')) {
                        price = info.replace('Price=', ''); // Lấy kích thước sau "Material="
                    }
                    if (info.includes('Formation=')) {
                        formation = info.replace('Formation=', '');
                    }
                });
                return {
                    product_name: item.name,
                    stock_quantity: item.quantity,
                    product_price: Number(price),
                    productId: item.sku,
                    image: item.image_url,
                    colorId: color, // Lưu thông tin color
                    sizeId: size, // Lưu thông tin size
                    materialId: material,
                    formation: formation
                };
            });
            // Bây giờ bạn có thể sử dụng danh sách sản phẩm productList trong mã của bạn
            const customData = JSON.parse(payment.transactions[0].custom);
            const phone = customData.phone;
            const address = customData.address;
            const userId = customData.userId;
            const couponId = customData.couponId;
            const shipping = customData.shipping;
            const notes = customData.notes
            const totalMoney = productList.reduce((acc, product) => {
                return acc + (product.product_price * product.stock_quantity);
            }, 0);
            const deposit = Number(Math.floor((totalMoney + shipping) * 0.2));
            // Tạo đối tượng có định dạng bạn mong muốn
            const formattedData = {
                products: productList,
                total: Number(Math.floor((totalMoney + shipping) - deposit)),
                deposit: deposit,
                shipping: Number(shipping),
                phone,
                address,
                userId,
                couponId,
                notes,
                paymentId,
                paymentCode: token,
                payerId
            };
            if (formattedData.couponId === 'null') {
                // Chuyển chuỗi "null" thành giá trị null
                formattedData.couponId = null;
            }
            // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
            if (formattedData.couponId !== null) {
                // Tăng số lượng phiếu giảm giá đã sử dụng lên 1
                const coupon = await Coupon.findById(formattedData.couponId);
                if (coupon && coupon.coupon_quantity > 0) {
                    coupon.coupon_quantity -= 1;
                    await coupon.save();
                } else {
                    res.send("Đã hết phiếu giảm giá");
                    return
                }
            }
            // Lặp qua từng sản phẩm trong đơn hàng và cập nhật số lượng và số lượng sản phẩm đã bán
            for (const item of formattedData.products) {
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
            const cartExist = await Cart.findOne({ userId });
            cartExist.products = []; // Xoá tất cả sản phẩm trong giỏ hàng
            cartExist.total = 0;// Đặt tổng giá trị về 0
            cartExist.couponId = null
            await cartExist.save();
            const order = await Order.create(formattedData);
            const orderIdString = order._id.toString();
            await sendOrderEmail({ userId: userId, orderId: orderIdString });
            res.redirect(process.env.REDIRECT_SUCCESS);
        }
    });

}

export const ZaloPay = async (req, res) => {
    // APP INFO
    const config = {
        app_id: "2553",
        key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
        key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
        endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    };

    const embed_data = {
        "preferred_payment_method": [],
        "redirecturl": "http://localhost:8088/api/zalopay_success",
    }

    const items = req.body.products;
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: "user123",
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 50000,
        description: `Lazada - Payment for the order #${transID}`,
        bank_code: "",
        callback_url: "http://localhost:8088/api/zalopay_success",
    };
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    axios.post(config.endpoint, null, { params: order })
        .then(response => {
            const orderUrl = response.data.order_url;
            console.log(orderUrl);
            res.json({ order_url: orderUrl }); // Trả về phản hồi JSON với order_url
        })
        .catch(err => console.log(err));
}
export const ZaloRedirect = async (req, res) => {
    const config = {
        app_id: "2553",
        key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
        key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    };
    let data = req.query;
    let checksumData = data.appid + '|' + data.apptransid + '|' + data.pmcid + '|' + data.bankcode + '|' + data.amount + '|' + data.discountamount + '|' + data.status;
    let checksum = CryptoJS.HmacSHA256(checksumData, config.key2).toString();

    if (checksum != data.checksum) {
        res.sendStatus(400);
    } else {
        // kiểm tra xem đã nhận được callback hay chưa, nếu chưa thì tiến hành gọi API truy vấn trạng thái thanh toán của đơn hàng để lấy kết quả cuối cùng
        res.sendStatus(200);
    }
}

import stripe from 'stripe';
import { log } from 'console';
const stripeInstance = stripe('sk_test_51O0bn3IY3g0rgNrbiw44N8Wfy9Xig0zXd8n4pvXVjDQOqXsWTb9vT4eH6eyoT5OSgNCMB8z1GbIlH8YmKSrb35s500DtTNT3Sh');
export const Striper = async (req, res) => {
    const {
        userId,
        couponId,
        products,
        total,
        phone,
        address
    } = req.body;
    const exchangeRateVNDToUSD = 0.000043; // Ví dụ: 1 VND = 0.000043 USD

    const lineItems = products.map(product => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: product.product_name,
                images: [product.image],
            },
            unit_amount: Math.floor(product.product_price * exchangeRateVNDToUSD * 100), // Chuyển đổi từ VND sang cent
        },
        quantity: product.stock_quantity,
        description: `Color: ${product.colorId}, Material: ${product.materialId}, Size: ${product.sizeId}`,
    }));
    console.log(lineItems);
    const session = await stripeInstance.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:8088/success',
        cancel_url: 'http://localhost:8088/cancel',
        metadata: {
            userId,
            couponId,
            phone,
            address,
        },
    });

    res.status(200).json({
        url: session.url
    })
}