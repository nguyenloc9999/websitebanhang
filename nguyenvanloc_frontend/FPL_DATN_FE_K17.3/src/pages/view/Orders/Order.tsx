import 'swiper/css';
import 'swiper/css/navigation';
import { useGetOrderByUserIdQuery, useUpdateOrderStatusMutation } from '@/api/orderApi';
import { getDecodedAccessToken } from '@/decoder';
import { format } from 'date-fns';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGetStatusQuery } from '@/api/statusApi';
import { Pagination } from '@mui/material';
import Comment from '@/components/Comment';
import Swal from 'sweetalert2';
import { Skeleton } from 'antd';
import { toast } from 'react-toastify';

const Order = () => {
    const [currentStatus, setCurrentStatus] = useState('all'); // Mặc định hiển thị tất cả
    const [filteredOrders, setFilteredOrders] = useState([]);
    const decodedToken: any = getDecodedAccessToken();
    // const [removeOrder] = useRemoveOrderMutation();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const id = decodedToken ? decodedToken.id : null;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const commentAdded = searchParams.get('commentAdded');
    const {
        data,
        error,
        isLoading: isLoadingFetching,
        refetch,
    } = useGetOrderByUserIdQuery<any>(id);
    const orders = data?.order;
    console.log(orders);

    const { data: status, isLoading: isLoadingStatus }: any = useGetStatusQuery();
    const Status = isLoadingStatus ? [] : status?.status;
    // -------Phân trang--------
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const handlePageChange = (event: any, page: any) => {
        setCurrentPage(page);
        if (false) {
            console.log(event);
        }
    };
    const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedOrders = filteredOrders.slice(startIndex, endIndex);

    // -------------------------------------------
    const handleFilterOrders = (status: string) => {
        setCurrentStatus(status);
        if (status === 'all') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter((order: any) => order.status._id === status);
            setFilteredOrders(filtered);
        }
    };
    useEffect(() => {
        if (isLoadingFetching) return;
        if (commentAdded === 'true') {
            // Thực hiện refetch danh sách đơn hàng
            refetch();
        }
        if (currentStatus === 'all') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter((order: any) => order.status._id === currentStatus);
            setFilteredOrders(filtered);
        }
    }, [isLoadingFetching, currentStatus, orders, commentAdded]);
    // -------------------------------------------
    // const deleteOrder = async (id: any) => {
    //     try {
    //         const result = await Swal.fire({
    //             title: 'Bạn chắc chứ?',
    //             text: 'Banner sẽ bị xoá và không thể khôi phục!',
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'Vâng, tôi chắc chắn!',
    //             cancelButtonText: 'Huỷ',
    //         });
    //         if (result.isConfirmed) {
    //             const data: any = await removeOrder(id).unwrap();
    //             if (data) {
    //                 toast.success(data.message);
    //             }
    //         } else if (result.dismiss === Swal.DismissReason.cancel) {
    //             toast.info('Hủy xoá Đơn hàng ');
    //         }
    //     } catch (error: any) {
    //         toast.error(error.data.message);
    //     }

    // };
    // -------------------------------------------
    const updateOrder = async (orderId: any) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Nếu cọc rồi thì sẽ mất tiền cọc!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });
            if (result.isConfirmed) {
                const data = await updateOrderStatus({ _id: orderId, status: '6565969f3a59bec4e5baea03', userId: id }).unwrap();
                if (data) {
                    toast.success(`${data.message}`)
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Không huỷ');
            }
        } catch (error: any) {
            toast.error(error.data.message);
        }
    };
    // -------------------------------------------
    const formatCurrency = (number: number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    // -------------------------------------------
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Cuộn mượt
        });
    };
    if (isLoadingFetching) return <Skeleton />;
    if (error) {
        if ('data' in error && 'status' in error) {
            return (
                <div>
                    {error.status} - {JSON.stringify(error.data)}
                </div>
            );
        }
    }
    if (!orders || orders?.length === 0) {
        return (
            <div>
                <div
                    className="grid  px-4 bg-white place-content-center  pb-[400px]"
                    style={{ height: '1000px' }}
                >
                    <div className="">
                        <img
                            className="w-[200px] ml-20"
                            src="https://ichibajp.com/images/img-cart-empty.png"
                            alt=""
                        />

                        <h1
                            className="mt-6  font-light tracking-tight text-gray-900 pr-10"
                            style={{ fontSize: '17px' }}
                        >
                            Bạn chưa có đơn hàng nào, hãy đặt hàng ngay nhé !
                        </h1>

                        <Link
                            to="/"
                            className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-  focus:outline-none focus:ring no-underline "
                            style={{ background: '#ff7600', marginLeft: '90px' }}
                        >
                            Mua Ngay
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 border-solid border-1 rounded">
            <div className="m-3">
                <h3>Đơn hàng</h3>
                <div className="">
                    <ul className="font-medium flex flex-col p-3 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-500 dark:border-gray-700">
                        <li>
                            <a
                                href=""
                                className={`no-underline text-gray-700 ${currentStatus === 'all' ? 'font-medium' : ''
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleFilterOrders('all');
                                    setCurrentStatus('all'); // Thay đổi trạng thái hiện tại
                                }}
                            >
                                Tất cả
                            </a>
                        </li>
                        {status &&
                            Status?.map((statusItem: any) => (
                                <li key={statusItem._id}>
                                    <a
                                        href=""
                                        className={`no-underline text-gray-700 ${currentStatus === statusItem._id ? 'font-medium' : ''
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleFilterOrders(statusItem._id);
                                        }}
                                    >
                                        {statusItem.status_name}
                                    </a>
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="md:grid  md:grid-cols-2 gap-3 ">
                    {displayedOrders.map((order: any) => {
                        return (
                            <div
                                className="md:flex md:flex-row gap-5 border-solid boder-2 border-slate-400 bg-white shadow-lg border-0 rounded-md "
                                key={order._id}
                            >
                                <div className="flex justify-start md:top-0 py-2 pt-2 justify-center items-center mx-5">
                                    {order &&
                                        order?.products?.every((product: any) => product.hasReviewed === true) === true ? (
                                        <div className="absolute bg-red-500 text-white p-2 rounded-sm text-sm">
                                            Đã đánh giá
                                        </div>
                                    ) : (
                                        ''
                                    )
                                    }
                                    <img
                                        width="130"
                                        src={order?.products[0]?.image}
                                        alt="external-free-sales-flaticons-lineal-color-flat-icons"
                                    />
                                </div>
                                <div className="flex flex-col font-medium justify-center px-3 py-3 ">
                                    <p>
                                        Ngày mua:{' '}
                                        <span className="text-amber-600">
                                            {format(
                                                new Date(order.createdAt),
                                                'HH:mm a dd/MM/yyyy',
                                            )}
                                        </span>
                                    </p>
                                    <p className="total1">
                                        Tổng tiền:{' '}
                                        <span className="text-amber-600">
                                            {formatCurrency(order.total)}₫
                                        </span>
                                    </p>
                                    <p className="justify-start">
                                        Trạng thái:{' '}
                                        <span className="text-amber-600">
                                            {order.status.status_name}
                                        </span>
                                    </p>

                                    <div className="flex">
                                        <button className="bg-green-500 border-solid rounded border-1 py-1 px-3 text-white">
                                            <Link
                                                className="ctorder text-white"
                                                to={`/user/orders/${order._id}/orderdetail`}
                                                style={{ textDecoration: 'none', color: 'black' }}
                                                onClick={scrollToTop}
                                            >
                                                Chi tiết
                                            </Link>
                                        </button>
                                        {order && order.status._id == '64e8a93da63d2db5e8d8562a' ? (
                                            <button
                                                className="text-white bg-amber-500 border-solid rounded border-1 py-1 px-3 text-white"
                                                onClick={() => updateOrder(order._id)}
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        ) : (
                                            ''
                                        )}
                                        {/* {order && order.status._id == '6565969f3a59bec4e5baea03' ? (
                                            <button
                                                className="text-white bg-amber-500 border-solid rounded border-1 py-1 px-3 text-white"
                                                onClick={() => deleteOrder(order._id)}
                                            >
                                                Xoá bỏ
                                            </button>
                                        ) : (
                                            ''
                                        )} */}
                                        {order && order.status._id == '656596893a59bec4e5baea02' && order?.products?.every((product: any) => product.hasReviewed) === false ? (
                                            <Comment order={order} />
                                        ) : (
                                            <></>
                                        )
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex w-full py-4 justify-center">
                <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                />
            </div>
        </div>
    );
};
export default Order;
