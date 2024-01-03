import { useNavigate, useParams } from "react-router-dom"
import { Button, Form, Modal, Pagination, Select, Skeleton } from 'antd';
import { useGetStatusQuery } from "@/api/statusApi";
import { useEffect, useState } from "react";
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from "@/api/orderApi";
import { useGetMaterialQuery } from "@/api/materialApi";
import { useGetColorsQuery } from "@/api/colorApi";
import { useGetSizeQuery } from "@/api/sizeApi";
import "./OrdersDetail.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useCreateHistoryMutation, useGetByOrderHistoryQuery } from "@/api/historyApi";
import { getDecodedAccessToken } from "@/decoder";
import { FaArrowRight } from "react-icons/fa";

const OrdersDetail = () => {
    const { id }: any = useParams()
    const decodedToken: any = getDecodedAccessToken();
    const userId = decodedToken ? decodedToken.id : null;
    const { data: orderDetail } = useGetOrderByIdQuery<any>(id);
    const { data: status } = useGetStatusQuery<any>()
    const { data: Colors, isLoading: isLoadingColors } = useGetColorsQuery<any>();
    const { data: Sizes, isLoading: isLoadingSizes } = useGetSizeQuery<any>();
    const { data: Materials, isLoading: isLoadingMaterials } = useGetMaterialQuery<any>();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [createHistory] = useCreateHistoryMutation();
    const { data: historyOrder } = useGetByOrderHistoryQuery<any>(id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (orderDetail) {
            setFields();
        }
    }, [orderDetail]);
    const [form] = Form.useForm();
    const setFields = () => {
        form.setFieldsValue({
            _id: orderDetail?.order?._id,
            status: orderDetail?.order?.status?._id,
        });
    };


    const onFinish = async (values: any) => {
        try {
            const data = await updateOrderStatus({ _id: orderDetail?.order?._id, status: values.status }).unwrap();
            if (data) {
                toast.success(data.messages);
                await createHistory({
                    userId: userId,
                    orderId: id,
                    old_status: orderDetail?.order?.status?._id,
                    new_status: values.status
                }).unwrap();
            }
            navigate("/admin/orders");
        } catch (error: any) {
            toast.error(error.data.message);
        }

    };
    const formatCurrency = (number: number) => {
        if (typeof number !== 'number') {
            return '0';
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    //  Phân trang........................
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (isLoadingColors) return <Skeleton />;
    if (isLoadingSizes) return <Skeleton />;
    if (isLoadingMaterials) return <Skeleton />;



    return (
        <div className="flex flex-row">
            <div className="basis-1/2 or">
                <div>
                    <h5 className="ttdh">Thông tin đơn hàng <span style={{ color: '#a8729a' }}></span></h5>
                </div>
                <div className="qw">
                    <div>
                        <p>Họ và tên : {orderDetail?.order.userId?.first_name} {orderDetail?.order.userId?.last_name}</p>
                    </div>
                    <div>
                        <p>Phiếu giảm giá: {orderDetail?.order.couponId ? orderDetail?.order.couponId.coupon_name : "không sử dụng phiếu giảm giá"}</p>
                    </div>
                    <div>
                        <p>Số điện thoại : {orderDetail?.order.phone}</p>
                    </div>
                    <div>
                        <p>Địa chỉ : {orderDetail?.order.address}</p>
                    </div>
                    {orderDetail?.order.shipping ? <div>
                        <p>Phí vận chuyển : <strong>{formatCurrency(orderDetail?.order.shipping)}₫</strong></p>
                    </div> : ""}
                    <div>
                        <p>Đã cọc : <strong>{formatCurrency(orderDetail?.order.deposit)}₫</strong></p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p>Ngày đặt hàng : {orderDetail?.order.createdAt ? format(new Date(orderDetail.order.createdAt), "HH:mm a dd/MM/yyyy") : "Không có thời gian"}</p>
                    </div>
                    <div
                        style={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', marginLeft: "-10px" }}>
                        <h6 className="h2 mb-0 ms-2" >Tổng tiền: <span className="h2 mb-0 ms-2">{formatCurrency(orderDetail?.order.total)}₫</span></h6>
                    </div>
                    <Modal
                        open={isModalOpen}
                        onCancel={handleCancel}
                        footer={null} // Remove the footer entirely
                        width={750}
                    >
                        <div style={{ fontFamily: 'Arial, sans-serif' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Lịch sử đơn hàng:</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {historyOrder ? historyOrder?.histories?.slice(startIndex, endIndex)?.map((status: any, index: number) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                                        <p style={{ fontWeight: 'bold', marginRight: '10px' }}>
                                            {`${status?.userId.first_name} ${status?.userId.last_name}`}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <p style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center' }}>
                                                <span>cập nhật từ</span>&nbsp;
                                                <span style={{ color: '#FF5733' }}>{status?.old_status}</span>
                                            </p>
                                            <p style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                                <FaArrowRight style={{ marginRight: '5px' }} />
                                                <span style={{ color: '#36A2EB' }}>{status?.new_status}</span>
                                            </p>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>
                                            {`Ngày cập nhật: ${new Date(status?.createdAt).toLocaleString()}`}
                                        </p>
                                    </div>
                                )) : "Đơn hàng chưa được cập nhật trạng thái!"}

                            </div>
                            <Pagination
                                current={currentPage}
                                total={historyOrder?.histories?.length || 0}
                                pageSize={itemsPerPage}
                                onChange={handleChangePage}
                            />

                        </div>
                    </Modal>
                    <Form
                        form={form}
                        layout="vertical"
                        name="basic"
                        labelCol={{ span: 8 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div style={{ display: "flex", marginTop: "30px" }}>
                            <Form.Item
                                className="small text-primary fw-bold mb-0 float-left w-2/5"
                                name="status"
                                rules={[{ required: true, message: 'Trạng thái không được để trống!' }]}
                            >
                                <Select >
                                    {status?.status?.map((stt: any) => {
                                        return (
                                            <Select.Option style={{ width: '150px' }} key={stt?._id} value={stt._id} className="text-primary">
                                                {stt.status_name}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item >
                                <Button onClick={showModal} style={{ background: "#008000", color: "#fff", marginTop: "20px", width: "140px", height: "40px" }}>Lịch sử đơn hàng</Button>
                                <Button htmlType="submit" style={{ background: "#000080", color: "#fff", marginTop: "20px", width: "180px", height: "40px" }}>Cập nhật trạng thái</Button>
                            </Form.Item>
                        </div>
                    </Form>

                </div>
            </div>
            <div className="basis-1/2 or">
                <div style={{ borderRadius: '10px' }}>
                    <div>
                        {orderDetail ? orderDetail?.order?.products.map((order: any) => {
                            const colorname = Colors?.color?.find((colors: any) => colors._id == order.colorId);
                            const sizesname = Sizes?.size?.find((sizes: any) => sizes._id == order.sizeId);
                            const materialsname = Materials?.material?.find((materials: any) => materials._id == order.materialId);
                            return (
                                <div className="" key={order._id}>
                                    <div className="mp">
                                        <div className="row">
                                            <div className="ord-img shadow-lg">
                                                <img
                                                    src={order?.image}
                                                    className="order-image"
                                                />
                                                <div className="ord">
                                                    <div className="order-products"><strong>{order?.product_name}</strong></div>
                                                    <div className="order-products">Giá sản phẩm: {formatCurrency(order?.product_price)}₫</div>
                                                    <div className="order-products">Số lượng: {order?.stock_quantity}</div>
                                                    <div className="order-products">Màu: {colorname?.colors_name}</div>
                                                    <div className="order-products">Kích cỡ: {sizesname?.size_name}</div>
                                                    <div className="order-products">Vật liệu: {materialsname?.material_name}</div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <Skeleton />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrdersDetail









