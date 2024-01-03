import { FaArrowRight, FaMoneyBill1, FaChevronLeft } from 'react-icons/fa6';
import { Button, Form, Input, Select, Skeleton, Tooltip, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { getDecodedAccessToken } from '@/decoder';
import {
    useApplyCouponMutation,
    useGetCartsQuery,
    useRemoveAllCartMutation,
    useRemoveCouponMutation,
} from '@/api/cartApi';
import { useGetColorsQuery } from '@/api/colorApi';
import { useGetSizeQuery } from '@/api/sizeApi';
import { useGetMaterialQuery } from '@/api/materialApi';
import { useGetUserByIdQuery } from '@/api/authApi';
import { useEffect, useState } from 'react';
import {
    useGetAvailableMutation,
    useGetCityQuery,
    useGetDistrictMutation,
    useGetShippingMutation,
    useGetWardMutation,
} from '@/api/shipApi';
import Swal from 'sweetalert2';
import { useAddOrderMutation } from '@/api/orderApi';
import { usePayMomoMutation, usePayPaypalMutation } from '@/api/paymentApi';
import { useGetCouponByUserQuery } from '@/api/couponsApi';
import { SubmitHandler, useForm } from 'react-hook-form';
import './PayPage.css';
import { format } from 'date-fns';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
type TypeInputs = {
    couponId?: string;
};
const PayPage = () => {
    const decodedToken: any = getDecodedAccessToken();
    const id = decodedToken ? decodedToken.id : null;
    const navigate = useNavigate();
    const { data: carts, isLoading } = useGetCartsQuery(id);
    const productsInCart = carts?.data.products;
    const { data: Colors, isLoading: isLoadingColors }: any = useGetColorsQuery();
    const { data: Sizes, isLoading: isLoadingSizes }: any = useGetSizeQuery();
    const { data: Materials, isLoading: isLoadingMaterials }: any = useGetMaterialQuery();
    const { data: dataCoupons }: any = useGetCouponByUserQuery(id);
    const coupons = dataCoupons?.validCoupons || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState('');

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleRadioChange = (e: any) => {
        setSelectedCouponId(e.target.value);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedCouponId('')
    };

    const { data: city }: any = useGetCityQuery();
    const [addDistrict] = useGetDistrictMutation<any>();
    const [addWard] = useGetWardMutation<any>();
    const [addAvailable] = useGetAvailableMutation();
    const [addShipping] = useGetShippingMutation();
    const [addOrder, resultOrder] = useAddOrderMutation();
    const [removeAllCart] = useRemoveAllCartMutation();
    const [addMomo, resultMomo] = usePayMomoMutation();
    const [addPaypal, resultPaypal] = usePayPaypalMutation();
    const [applyCoupon, resultAdd] = useApplyCouponMutation();
    const [removeCoupon, resultRemove] = useRemoveCouponMutation();

    const { data: user } = useGetUserByIdQuery(id);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState<any>([]);
    const [available, setAvailable] = useState<any>([]);
    const [size, setSize] = useState<any>([]);
    const [wardCode, setwardCode] = useState<any>('');
    const [averageWidth, setAverageWidth] = useState(0);
    const [averageHeight, setAverageHeight] = useState(0);
    const [averageLength, setAverageLength] = useState(0);
    const [averageWeight, setAverageWeight] = useState(0);
    const [ship, setShip] = useState<any>({});
    const [pay, setPay] = useState<any>('');
    const [type, setType] = useState<any>('');
    const [total, setTotal] = useState<number>(0);
    const { register, handleSubmit } = useForm<TypeInputs>();
    // css active
    const sizeTotal = () => {
        if (productsInCart) {
            const sizesArray = productsInCart.map((product: any) => {
                return Sizes?.size?.find((sizes: any) => sizes._id === product.sizeId);
            });
            setSize(sizesArray);
        }
    };
    useEffect(() => {
        if (size && size?.length > 0) {
            const totalWidth = size.reduce(
                (sum: any, size: any) => sum + (size.size_width || 0),
                0,
            );
            const totalHeight = size.reduce(
                (sum: any, size: any) => sum + (size.size_height || 0),
                0,
            );
            const totalLength = size.reduce(
                (sum: any, size: any) => sum + (size.size_length || 0),
                0,
            );
            const totalWeight = size.reduce(
                (sum: any, size: any) => sum + (size.size_weight || 0),
                0,
            );
            setAverageWidth(Math.floor(totalWidth / size.length));
            setAverageHeight(Math.floor(totalHeight / size.length));
            setAverageLength(Math.floor(totalLength / size.length));
            setAverageWeight(Math.floor(totalWeight / size.length));
        }
    }, [size]);

    const [form] = Form.useForm();
    const setFields = () => {
        form.setFieldsValue({
            _id: user?._id,
            fullname: `${user?.first_name} ${user?.last_name}`,
            phone: user?.phone,
        });
    };
    useEffect(() => {
        if (user) {
            setFields();
            setTotal(carts?.data?.total);
        }
    }, [user, total, carts?.data?.total]);

    // const handleCityChange = async (value: any, option: any) => {
    //     if (false) {
    //         console.log(value);
    //     }
    //     const id = Number(option.key); // Lấy id từ option.key
    //     addDistrict({ province_id: id }).then((response: any) => {
    //         setDistrict(response.data.data);
    //         sizeTotal();
    //     });
    // };
    const handleCityChange = async (value: any, option: any) => {
        // Lấy id từ option.key
        if (false) {
            console.log(value);
        }
        const id = Number(option.key);

        const response = await addDistrict({ province_id: id });
        if ('data' in response) {
            form.setFieldsValue({
                address: {
                    district: undefined,
                    ward: undefined,
                    ship: undefined,
                },
            });
            setShip({})
            setDistrict(response.data.data);
            // Gọi hàm tính toán kích thước tổng cộng (nếu cần)
            sizeTotal();
        }
    };
    const handleDistrictChange = async (value: any, option: any) => {
        if (false) {
            console.log(value);
        }
        const id = Number(option.key); // Lấy id từ option.key
        const response = await addWard({ district_id: id })
        if ('data' in response) {
            form.setFieldsValue({
                address: {
                    ward: undefined,
                    ship: undefined,
                },
            });
            setShip({})
            setWard(response.data.data);
            sizeTotal();
        }

    };
    const handleAvailableChange = async (value: any, option: any) => {
        if (false) {
            console.log(value);
        }
        const id = option.key; // Lấy id từ option.key
        setwardCode(id);
        addAvailable({
            shop_id: 4537750,
            from_district: 3440,
            to_district: ward[0].DistrictID,
        }).then((response: any) => {
            setAvailable(response.data.data);
        });
    };

    const handleShippingChange = async (id: string) => {
        const data = {
            service_id: id,
            insurance_value: carts.data.total,
            from_district_id: 3440,
            to_district_id: ward[0].DistrictID,
            to_ward_code: wardCode,
            height: averageHeight,
            length: averageLength,
            weight: averageWeight,
            width: averageWidth,
        };
        addShipping(data).then((response: any) => {
            setShip(response.data.data);
        });
    };
    const formatCurrency = (number: number) => {
        if (typeof number !== 'undefined' && number !== null) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return ''; // Trả về một giá trị mặc định hoặc xử lý sao cho phù hợp với ứng dụng của bạn
    };

    const onFinish = async ({ address, phone, notes }: any) => {
        const cartDataWithoutId = { ...carts?.data };
        delete cartDataWithoutId._id;
        delete cartDataWithoutId.createdAt;
        delete cartDataWithoutId.updatedAt;
        address = `${address.ward}, ${address.district}, ${address.street}`;
        if (pay && pay == 'cod') {
            if (Number(cartDataWithoutId.total + ship.total) > 5000000) {
                if (type && type == 'momo') {
                    try {
                        Swal.fire({
                            title: 'Bạn chắc chứ?',
                            text: 'Khi mua đơn hàng này sẽ phải cọc 20% !',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Vâng, tôi chắc chắn!',
                            cancelButtonText: 'Huỷ',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                (async () => {
                                    const response: any = await addOrder({
                                        ...cartDataWithoutId,
                                        address,
                                        phone,
                                        notes,
                                        shipping: ship.total,
                                        type: type,
                                    });
                                    if (response.error) {
                                        toast.error(response.error.data.message);
                                    }
                                    if (response) {
                                        window.location.href = response.data.payUrl;
                                    }
                                })();
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                // Hiển thị thông báo hủy xóa sản phẩm
                                toast.info("Đơn hàng chưa được cọc :)");
                            }
                        });
                    } catch (error) {
                        console.log(error);
                    }
                } else if (type && type == 'paypal') {
                    try {
                        Swal.fire({
                            title: 'Bạn chắc chứ?',
                            text: 'Khi mua đơn hàng này sẽ phải cọc 20% !',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Vâng, tôi chắc chắn!',
                            cancelButtonText: 'Huỷ',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                (async () => {
                                    const response: any = await addOrder({
                                        ...cartDataWithoutId,
                                        address,
                                        phone,
                                        notes,
                                        shipping: ship.total,
                                        type: type,
                                    });
                                    if (response.error) {
                                        toast.error(response.error.data.message);
                                    }
                                    if (response) {
                                        window.location.href = response.data.approval_url;
                                    }
                                })();
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                // Hiển thị thông báo hủy xóa sản phẩm
                                toast.info("Đơn hàng chưa được cọc :)");
                            }
                        });
                    } catch (error: any) {
                        toast.error(error?.data?.message);
                    }
                }
            } else {
                try {
                    const result = await Swal.fire({
                        title: "Bạn chắc chứ?",
                        text: "Đơn hàng này sẽ được đặt!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Vâng, tôi chắc chắn!",
                        cancelButtonText: "Huỷ",
                    });

                    if (result.isConfirmed) {
                        // Thực hiện thêm vào giỏ hàng
                        const response: any = await addOrder({
                            ...cartDataWithoutId,
                            address,
                            phone,
                            notes,
                            shipping: ship.total,
                        }).unwrap();
                        if (response.error) {
                            toast.error(response.error.data.message);
                        }
                        if (response) {
                            toast.success(response.message);
                            removeAllCart(id)
                            setIsModalOpen(false);
                            navigate('/user/orders');
                        }
                        setIsModalOpen(false);
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // Hiển thị thông báo hủy thêm vào giỏ hàng
                        toast.info("Đơn hàng chưa được mua :)");
                    }
                } catch (error: any) {
                    if (Array.isArray(error.data.message)) {
                        // Xử lý trường hợp mảng
                        const messages = error.data.message;
                        messages.forEach((message: any) => {
                            toast.error(message);
                        });
                    } else {
                        // Xử lý trường hợp không phải mảng
                        toast.error(error.data.message);
                    }
                }
            }
        } else if (pay && pay == 'momo') {
            try {
                Swal.fire({
                    title: 'Bạn chắc chứ?',
                    text: 'Khi thanh toán bằng momo sẽ không huỷ được!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Vâng, tôi chắc chắn!',
                    cancelButtonText: 'Huỷ',
                }).then((result) => {
                    if (result.isConfirmed) {
                        (async () => {
                            const response: any = await addMomo({
                                ...cartDataWithoutId,
                                address,
                                phone,
                                notes,
                                shipping: ship.total,
                            });
                            if (response.error) {
                                toast.error(response.error.data.message);
                            }
                            if (response) {
                                window.location.href = response.data.payUrl;
                            }
                        })();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // Hiển thị thông báo hủy xóa sản phẩm
                        toast.info("Đơn hàng chưa được mua :)");
                    }
                });
            } catch (error: any) {
                toast.error(error?.data?.message);
            }
        } else if (pay && pay == 'paypal') {
            try {
                Swal.fire({
                    title: 'Bạn chắc chứ?',
                    text: 'Khi thanh toán bằng paypal sẽ không huỷ được!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Vâng, tôi chắc chắn!',
                    cancelButtonText: 'Huỷ',
                }).then((result) => {
                    if (result.isConfirmed) {
                        (async () => {
                            const response: any = await addPaypal({
                                ...cartDataWithoutId,
                                address,
                                phone,
                                notes,
                                shipping: ship.total,
                            });
                            if (response.error) {
                                toast.error(response.error.data.message);
                            }
                            if (response) {
                                window.location.href = response.data.approval_url;
                            }
                        })();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // Hiển thị thông báo hủy xóa sản phẩm
                        toast.info("Đơn hàng chưa được mua :)");
                    }
                });
            } catch (error: any) {
                toast.error(error?.data?.message);
            }
        }
    };

    // Check đơn hàng có total lớn hơn min_purchase_amount trong coupons
    // Thực hiện check đơn hàng nào quá hạn
    const currentDate = new Date();
    // Lấy ngày hiện tại
    const validCoupons = coupons.filter((coupon: any) => {
        // Kiểm tra xem ngày hiện tại có trước ngày hết hạn trong phiếu giảm giá không
        return (
            carts &&
            coupon.coupon_quantity > 0 &&
            carts.data.total >= coupon.min_purchase_amount &&
            currentDate <= new Date(coupon.expiration_date)
        );
    });
    const cartCouponId = carts && carts.data.couponId;

    const matchingCoupon = coupons.find((coupon: any) => coupon._id === cartCouponId);
    // Lấy coupon_name từ matchingCoupon (nếu tìm thấy)
    const cartCouponName = matchingCoupon ? matchingCoupon.coupon_name : null;
    const cartCouponcontent = matchingCoupon ? matchingCoupon.coupon_content : null;
    const cartCouponexpirationdate = matchingCoupon ? matchingCoupon.expiration_date : null;

    const onSubmit: SubmitHandler<TypeInputs> = async (data: any) => {
        try {
            const response: any = await applyCoupon({ userId: id, data: data });
            if (response) {
                toast.success(response.data.message);
            }
            setTotal(response.data.data.total);
        } catch (error: any) {
            if (Array.isArray(error.data.message)) {
                // Xử lý trường hợp mảng
                const messages = error.data.message;
                messages.forEach((message: any) => {
                    toast.error(message);
                });
            } else {
                // Xử lý trường hợp không phải mảng
                toast.error(error.data.message);
            }
        }

    };
    const removeCoupons: SubmitHandler<any> = async () => {
        try {
            const response: any = await removeCoupon({ userId: id, data: {} });
            if (response) {
                toast.success(response.data.message);
                setTotal(response.data.total);
            }
            setIsModalOpen(false);
        } catch (error: any) {
            if (Array.isArray(error.data.message)) {
                // Xử lý trường hợp mảng
                const messages = error.data.message;
                messages.forEach((message: any) => {
                    toast.error(message);
                });
            } else {
                // Xử lý trường hợp không phải mảng
                toast.error(error.data.message);
            }
        }

    };

    if (!id) {
        return (
            <div>
                <div
                    className="grid px-4 bg-white place-content-center  pb-3"
                    style={{ height: "500px" }}
                >
                    <div className="">
                        <img
                            className="w-[400px]"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRllmpIxnyIgtYuaJhrUERHnONFy6GdgWfgbg&usqp=CAU"
                            alt=""
                        />

                        <h1
                            className="mt-6 font-bold tracking-tight text-gray-900 "
                            style={{ fontSize: "17px" }}
                        >
                            Bạn chưa đăng nhập, hãy tiến hành đăng nhập đã nhé !
                        </h1>

                        <Link
                            to="/signin"
                            className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-  focus:outline-none focus:ring no-underline "
                            style={{ background: "#ff7600", marginLeft: "90px" }}
                        >
                            Đăng nhập cùng Casa
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    if (!productsInCart || productsInCart?.length === 0) {
        return (
            <div>
                <div
                    className="grid  px-4 bg-white place-content-center  pb-3"
                    style={{ height: "500px" }}
                >
                    <div className="">
                        <img
                            className="w-[400px]"
                            src="https://nhanhieuquocgia.com.vn/assets/images/no-cart.png"
                            alt=""
                        />

                        <h1
                            className="mt-6  font-bold tracking-tight text-gray-900 "
                            style={{ fontSize: "17px" }}
                        >
                            Giỏ hàng của bạn còn trống, hãy lựa mua ngay nhé !
                        </h1>

                        <Link
                            to="/"
                            className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-  focus:outline-none focus:ring no-underline "
                            style={{ background: "#ff7600", marginLeft: "90px" }}
                        >
                            Mua sắm cùng Casa
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) return <Skeleton />;
    if (isLoadingColors) return <Skeleton />;
    if (isLoadingSizes) return <Skeleton />;
    if (isLoadingMaterials) return <Skeleton />;

    return (
        <div className="container mx-auto mt-20">
            <div className="flex items-center pb-10">
                <div className="float-left">Trang Chủ</div>
                <FaArrowRight className="ml-2" />
                <div className="pl-2">Giỏ hàng</div>
                <FaArrowRight className="ml-2" />
                <div className="pl-2">Thanh Toán</div>
            </div>
            <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 ml-4">
                {/* --------------------Col 1 --------------------------- */}
                <div className="rounded-lg">
                    <h3 className="pl-4 font-semibold pb-2">Thông tin nhận hàng</h3>
                    <h5 className="font-extralight italic pb-2">Thông tin nhận hàng</h5>
                    <Form
                        form={form}
                        name="complex-form"
                        onFinish={onFinish}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Form.Item label="" name="_id" style={{ display: 'none' }}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="fullname"
                            style={{ marginBottom: 20 }}
                            rules={[{ required: true, message: 'Họ và tên không được để trống' }]}
                        >
                            <Input style={{ width: 330 }} placeholder="Họ và tên" readOnly />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            style={{ marginBottom: 20 }}
                            rules={[
                                { required: true, message: 'Số điện thoại không được để trống' },
                            ]}
                        >
                            <Input style={{ width: 330 }} placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name={['address', 'street']}
                            style={{ marginBottom: 20 }}
                            rules={[{ required: true, message: 'Thành phố không được để trống' }]}
                        >
                            <Select
                                style={{ width: 330 }}
                                onChange={handleCityChange}
                                placeholder="Tỉnh Thành"
                            >
                                {city &&
                                    city?.data?.map((ct: any) => {
                                        return (
                                            <Select.Option
                                                key={ct?.ProvinceID}
                                                value={ct?.ProvinceName}
                                            >
                                                {ct?.ProvinceName}
                                            </Select.Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={['address', 'district']}
                            style={{ marginBottom: 20 }}
                            rules={[{ required: true, message: 'Quận huyện không được để trống' }]}
                        >
                            <Select
                                style={{ width: 330 }}
                                onChange={handleDistrictChange}
                                placeholder="Quận huyện"
                            >
                                {district &&
                                    district.map((dis: any) => {
                                        return (
                                            <Select.Option
                                                key={dis?.DistrictID}
                                                value={dis?.DistrictName}
                                            >
                                                {dis?.DistrictName}
                                            </Select.Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={['address', 'ward']}
                            style={{ marginBottom: 20 }}
                            rules={[{ required: true, message: 'Phường xã không được để trống' }]}
                        >
                            <Select
                                style={{ width: 330 }}
                                onChange={handleAvailableChange}
                                placeholder="Phường xã"
                            >
                                {ward &&
                                    ward.map((ward: any) => {
                                        return (
                                            <Select.Option
                                                key={ward?.WardCode}
                                                value={ward?.WardName}
                                            >
                                                {ward?.WardName}
                                            </Select.Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={['address', 'ship']}
                            style={{ marginBottom: 20 }}
                            rules={[
                                { required: true, message: 'Loại vận chuyển không được để trống' },
                            ]}
                        >
                            <Select
                                style={{ width: 330 }}
                                onChange={(value) => handleShippingChange(value)}
                                placeholder="Loại vận chuyển"
                            >
                                {available && available?.length > 0 && (
                                    <Select.Option
                                        key={available[0]?.service_id}
                                        value={available[0]?.service_id}
                                    >
                                        {available[0]?.short_name}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item name="notes">
                            <Input.TextArea
                                showCount
                                maxLength={100}
                                style={{ width: 330 }}
                                placeholder="Ghi chú"
                            />
                        </Form.Item>
                        <div className="ml-2 pt-4 ">
                            <FaChevronLeft className="float-left mt-2" />
                            <Link
                                className="text-blue-900 float-left mt-1 font-semibold"
                                style={{ textDecoration: 'none', fontSize: '14px' }}
                                to={'/carts'}
                            >
                                Quay về giỏ hàng
                            </Link>
                        </div>
                        <Form.Item>
                            <div className="submit h-20">
                                {pay == 'cod' && total > 5000000 ? (
                                    <Tooltip title={type ? '' : 'Bạn phải chọn phương thức cọc'}>
                                        {resultOrder.isLoading ? (
                                            <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                                        ) : (
                                            <Button
                                                className="rounded-md  w-36 h-12  float-right font-semibold"
                                                htmlType="submit"
                                                style={{
                                                    background: 'rgb(74, 74, 170)',
                                                    color: 'white',
                                                }}
                                            >
                                                Cọc tiền
                                            </Button>
                                        )}

                                    </Tooltip>
                                ) : (
                                    <Tooltip
                                        title={pay ? '' : 'Bạn phải chọn phương thức thanh toán'}
                                    >
                                        {resultOrder.isLoading || resultMomo.isLoading || resultPaypal.isLoading ? (
                                            <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                                        ) : (
                                            <Button
                                                className="rounded-md  w-36 h-12   float-right font-semibold"
                                                htmlType="submit"
                                                style={{ background: '#316595', color: 'white' }}
                                            >
                                                Đặt hàng
                                            </Button>
                                        )}
                                    </Tooltip>
                                )}
                            </div>
                        </Form.Item>
                    </Form>
                </div>
                {/* --------------------Col 2 --------------------------- */}
                <div className="rounded-lg">
                    <h3 className="pl-4 font-semibold pb-3">Thanh Toán</h3>

                    <div
                        className={`border-solid border-2 rounded w-80 h-14 pl-2 pt-2 mb-5 ${pay === 'cod' ? 'active' : ''
                            }`}
                        onClick={() => setPay('cod')}
                    >
                        <label className="ml-3 mt-1">
                            Thanh toán khi giao hàng(COD)
                            <p className="float-right ml-8 mt-1" style={{ color: '#1990C6' }}>
                                <FaMoneyBill1 />
                            </p>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    <div
                        className={`border-solid border-2 rounded w-80 h-14 pl-2 pt-2 mb-5  ${pay === 'momo' ? 'active' : ''
                            }`}
                        onClick={() => setPay('momo')}
                    >
                        <label className="ml-3 mt-1">
                            Thanh toán bằng ví momo
                            <img
                                className="w-6 h-6 float-right ml-16 mt-1"
                                style={{ borderRadius: '5px', height: '20px', width: '20px' }}
                                src="data:image/png;base64,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"
                            />
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="momo"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    <div
                        className={`border-solid border-2 mb-4 rounded w-80 h-11 pl-2 pt-2 pb-5 ${pay === 'paypal' ? 'active' : ''
                            }`}
                        onClick={() => setPay('paypal')}
                    >
                        <label className="ml-3 mt-1">
                            Thanh toán bằng ví paypal
                            <img
                                className="w-5 h-5 float-right ml-16 mt-1"
                                style={{ borderRadius: '5px', height: '20px', width: '20px' }}
                                src="https://play-lh.googleusercontent.com/bDCkDV64ZPT38q44KBEWgicFt2gDHdYPgCHbA3knlieeYpNqbliEqBI90Wr6Tu8YOw"
                            />
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="paypal"
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    {pay === 'cod' && Number(total + ship.total) > 5000000 ? (
                        <div>
                            <h3 className="pl-4 font-semibold pb-3 pt-10">Cọc tiền</h3>

                            <div
                                className={`order-solid border-2 rounded w-80 h-14 pl-2 pt-2 mb-5 ${type === 'momo' ? 'active' : ''
                                    }`}
                                onClick={() => setType('momo')}
                            >
                                <label className="ml-3 mt-1">
                                    Thanh toán bằng momo
                                    <img
                                        className="w-6 h-6 float-right ml-20 mt-1"
                                        style={{
                                            borderRadius: '5px',
                                            height: '20px',
                                            width: '20px',
                                        }}
                                        src="data:image/png;base64,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"
                                    />
                                    <input
                                        type="radio"
                                        name="deposite"
                                        value="momo"
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            <div
                                className={`border-solid border-2 rounded w-80 h-11 pl-2 pt-2 pb-5 ${type === 'paypal' ? 'active' : ''
                                    }`}
                                onClick={() => setType('paypal')}
                            >
                                <label className="ml-3 mt-1">
                                    Thanh toán bằng ví paypal
                                    <img
                                        className="w-5 h-5 float-right ml-16 mt-1"
                                        style={{
                                            borderRadius: '5px',
                                            height: '20px',
                                            width: '20px',
                                        }}
                                        src="https://play-lh.googleusercontent.com/bDCkDV64ZPT38q44KBEWgicFt2gDHdYPgCHbA3knlieeYpNqbliEqBI90Wr6Tu8YOw"
                                    />
                                    <input
                                        type="radio"
                                        name="deposite"
                                        value="paypal"
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>

                {/* --------------------Col 3 --------------------------- */}
                <div className="rounded-lg" style={{ background: '#FAFAFA' }}>
                    <h3 className="pl-4 font-semibold bt-1">
                        Đơn hàng ({productsInCart?.length} sản phẩm)
                    </h3>
                    <hr />
                    {productsInCart ? (
                        productsInCart?.map((product: any) => {
                            const colorname = Colors?.color?.find(
                                (colors: any) => colors._id == product.colorId,
                            );
                            const sizesname = Sizes?.size?.find(
                                (sizes: any) => sizes._id == product.sizeId,
                            );
                            const materialsname = Materials?.material?.find(
                                (materials: any) => materials._id == product.materialId,
                            );
                            return (
                                <div className="container w-auto h-24" key={product._id}>
                                    <img
                                        className="w-16 h-16 ml-2 mr-2 rounded float-left"
                                        src={product?.image}
                                        width={50}
                                    />
                                    <div className="container-2">
                                        <div className="text-xs float-left w-52 font-semibold">
                                            {product?.product_name}
                                        </div>
                                        <div
                                            className="text-sm float-left  font-semibold"
                                            style={{
                                                fontFamily: 'Lato, sans-serif',
                                                color: '#f30c28',
                                            }}
                                        >
                                            {formatCurrency(product?.product_price)}₫
                                        </div>
                                        <p className="float-right text-xs ml-10 mr-1">
                                            x{product?.stock_quantity}
                                        </p>
                                    </div>
                                    <div className="col-span-2 flex ef">
                                        <div className="text-xs">
                                            Màu sắc: {colorname?.colors_name}
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex ef">
                                        <div className="text-xs">
                                            Kích cỡ: {sizesname?.size_name}{' '}
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex ef">
                                        <div className="text-xs">
                                            Vật liệu: {materialsname?.material_name}{' '}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>Chưa có sản phẩm</p>
                    )}
                    <hr />
                    <div className="Coupons my-3">
                        <div>
                            {carts && carts?.data.couponId ? (
                                <div>
                                    <form
                                        className="px-2 flex "
                                        onSubmit={handleSubmit(removeCoupons)}
                                    >
                                        <div className="w-[400px] flex shadow-lg rounded-lg items-center">
                                            <img
                                                className=" w-[70px] h-[70px] mt-3 rounded-md ml-2 mb-3"
                                                src="https://cf.shopee.vn/file/vn-11134004-7r98o-llyheem4gvz306"
                                                alt=""
                                            />
                                            <div className="py-2 pl-2 text-sm font-family ">
                                                <div className="flex py-1">
                                                    <div className="" style={{ fontSize: '16px' }}>
                                                        <strong>{cartCouponName}</strong>
                                                    </div>
                                                </div>
                                                <div className="mb-2">
                                                    <i>{cartCouponcontent}</i>
                                                </div>

                                                <div className="mt-1 text-xs text-gray-400">
                                                    HSD:{' '}
                                                    {format(
                                                        new Date(cartCouponexpirationdate),
                                                        'dd/MM/yyyy',
                                                    )}
                                                </div>
                                            </div>
                                            {resultRemove.isLoading ? (
                                                <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                                            ) : (
                                                <button
                                                    className="rounded-md mr-4 w-32 h-10 ml-12"
                                                    style={{
                                                        background: '#31AC57',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Huỷ
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            ) : validCoupons && validCoupons?.length > 0 ? (
                                <div>
                                    <div className='flex justify-between px-2 '>
                                        <div className='flex items-center'>
                                            <p className=' mt-2'>Casa Voucher</p>
                                        </div>
                                        <button onClick={showModal} className='text-blue-800'>Chọn hoặc nhập mã </button>
                                    </div>
                                    <Modal
                                        title="Mã giảm giá hiện có "
                                        open={isModalOpen}
                                        onCancel={handleCancel}
                                        afterClose={handleCancel}
                                        footer={[
                                            resultAdd.isLoading ? (
                                                <AiOutlineLoading3Quarters className="animate-spin m-auto" />
                                            ) : (
                                                <Button key="ok" style={{ backgroundColor: 'brown', color: 'white' }} onClick={handleSubmit(onSubmit)}>
                                                    Sử dụng
                                                </Button>
                                            )
                                        ]}
                                    >
                                        {validCoupons &&
                                            validCoupons.map((coupon: any) => (
                                                <form
                                                    key={coupon._id}
                                                    onSubmit={handleSubmit(onSubmit)}
                                                >
                                                    <div className=" shadow-lg rounded-lg flex items-center">
                                                        <div className="flex w-[450px]">
                                                            <img
                                                                className="w-[100px] h-[100px] mt-3 rounded-md ml-2 mb-3"
                                                                src="https://cf.shopee.vn/file/vn-11134004-7r98o-llyheem4gvz306"
                                                                alt=""
                                                            />
                                                            <div className="py-2 px-2 text-sm font-family">
                                                                <div className="flex py-1">
                                                                    <div
                                                                        className="flex justify-between"
                                                                        style={{ fontSize: '16px' }}
                                                                    >
                                                                        <strong>
                                                                            {coupon.coupon_name}
                                                                        </strong>
                                                                    </div>
                                                                </div>
                                                                <div className="mb-2">
                                                                    <i>{coupon.coupon_content}</i>
                                                                </div>

                                                                <div className="mt-1 text-xs text-gray-400">
                                                                    HSD:{' '}
                                                                    {format(
                                                                        new Date(
                                                                            coupon.expiration_date,
                                                                        ),
                                                                        'dd/MM/yyyy',
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <input
                                                                className="larger-radio border rounded-full"
                                                                type="radio"
                                                                value={coupon._id}
                                                                {...register('couponId')}
                                                                checked={selectedCouponId === coupon._id}
                                                                onChange={handleRadioChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </form>
                                            ))}
                                    </Modal>
                                </div>
                            ) : (
                                <p className="text-red-600 font-bold ml-4 ">
                                    Không có phiếu giảm giá nào có thể áp dụng cho đơn hàng của bạn !
                                </p>
                            )}
                        </div>
                    </div>

                    <hr />
                    <div className=" mt-4 ml-4 mr-6 h-16">
                        <div className="float-left font-semibold">Tạm tính:</div>
                        <p
                            className="text-xl float-right  font-semibold"
                            style={{ fontFamily: 'Lato, sans-serif', color: '#f30c28' }}
                        >
                            {formatCurrency(carts?.data.total)}₫
                        </p>
                    </div>
                    <div className=" ml-4 mr-6 h-14 mt-2">
                        <div className="float-left font-semibold">Phí vận chuyển:</div>
                        <p
                            className=" float-right  text-xl font-semibold"
                            style={{ fontFamily: 'sans-serif', color: '#f30c28' }}
                        >
                            {ship && ship.total ? formatCurrency(ship.total) + '₫' : ''}
                        </p>
                    </div>
                    <hr />
                    <div className=" mt-5 ml-4 mr-6 h-16">
                        <p className="float-left font-semibold">Tổng cộng:</p>
                        <div
                            className=" float-right  text-xl font-semibold"
                            style={{ fontFamily: 'sans-serif', color: '#f30c28' }}
                        >
                            {ship && ship.total ? (
                                formatCurrency(carts?.data.total + ship.total) + '₫'
                            ) : (
                                <p
                                    className="sp2 font-semibold"
                                    style={{ fontFamily: 'sans-serif', color: '#f30c28' }}
                                >
                                    Vui lòng chọn địa chỉ !
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayPage;
