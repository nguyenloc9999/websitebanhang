import { Button, Input, Skeleton, Space } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useGetOrderQuery } from '@/api/orderApi';
import { BiDetail } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { getDecodedAccessToken } from '@/decoder';
import { useGetStatusQuery } from '@/api/statusApi';
import './Order.css';
import { IoSearchSharp } from 'react-icons/io5';

const OrdersManager = () => {
    const [currentStatus, setCurrentStatus] = useState('all');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const decodedToken: any = getDecodedAccessToken();
    const id = decodedToken ? decodedToken.id : null;
    const [searchText, setSearchText] = useState('');
    const { data: order, isLoading: isLoadingFetching } = useGetOrderQuery<any>(id);
    const orders = isLoadingFetching ? [] : order?.order;
    const { data: status, isLoading: isLoadingStatus }: any = useGetStatusQuery();
    const Status = isLoadingStatus ? [] : status?.status;
    const [sortedInfo, setSortedInfo] = useState({} as any);
    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };
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
        if (currentStatus === 'all') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter((order: any) => order.status._id === currentStatus);
            setFilteredOrders(filtered);
        }
    }, [isLoadingFetching, currentStatus, orders]);

    const formatCurrency = (number: number) => {
        if (typeof number !== 'number') {
            // Xử lý khi number không phải là số
            return '0'; // Hoặc giá trị mặc định khác tùy vào yêu cầu của bạn
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const data = isLoadingFetching
        ? []
        : filteredOrders.map((order: any, index: number) => {
            const createdAtTimestamp = Date.parse(order.createdAt);
            return {
                key: order._id,
                STT: index + 1,
                address: order.address,
                phone: order.phone,
                total: order.total,
                status: order.status.status_name,
                createAt: format(new Date(order.createdAt), 'HH:mm a dd/MM/yyyy'),
                createdAtTimestamp: createdAtTimestamp,
                image: <img width={50} src={order.products[0]?.image} alt="" />,
                userId: `${order.userId?.first_name} ${order.userId?.last_name}`,
            };
        });
    // Xử lý filter..............
    const filteredData = data?.filter((item: any) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();

        const lowerCaseAddress = item.address.toLowerCase().trim();
        const lowerCaseUserId = item.userId.toLowerCase().trim();
        const lowerCasePhone = item.phone.toLowerCase().trim();

        const addressMatches = lowerCaseAddress.includes(lowerCaseSearchText);
        const userIdMatches = lowerCaseUserId.includes(lowerCaseSearchText);
        const phoneMatches = lowerCasePhone.includes(lowerCaseSearchText);

        return addressMatches || userIdMatches || phoneMatches;
    });
    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (index: any) => <a>{index}</a>,
            sorter: (a: any, b: any) => a.STT - b.STT, // Sắp xếp theo STT
            sortOrder: sortedInfo.columnKey === 'STT' && sortedInfo.order,
            ellipsis: true,
            width: 90, // Điều chỉnh chiều rộng của cột "STT"
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            width: 100,
        },
        {
            title: 'Người mua',
            dataIndex: 'userId',
            key: 'userId',
            width: 150,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 120,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 150,
        },
        {
            title: 'Tổng đơn hàng',
            width: 150,
            dataIndex: 'total',
            key: 'total',
            render: (total: any) => <span className="text-red-700">{formatCurrency(total)}₫</span>,
            sorter: (a: any, b: any) => a.total - b.total,
            sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (index: any) => <strong>{index}</strong>,
        },
        {
            title: 'Thời gian mua',
            width: 170,
            dataIndex: 'createAt',
            key: 'createAt',
            sorter: (a: any, b: any) => a.createdAtTimestamp - b.createdAtTimestamp,
            sortOrder: sortedInfo.columnKey === 'createAt' && sortedInfo.order,
        },
        {
            title: 'Hành động',
            width: 120,
            key: 'action',
            render: (_, record: any) => (
                <Space size="middle">
                    <Button danger style={{ border: '1px solid blue' }}>
                        <Link to={`/admin/orders/${record.key}/detail`}>
                            <BiDetail />
                        </Link>
                    </Button>
                </Space>
            ),
        },
    ];
    if (isLoadingFetching) return <Skeleton />;

    return (
        <div>
            <br />
            <header className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-2xl">Đơn hàng của bạn</h2>
            </header>
            <div className="">
                <ul className="font-medium flex flex-col p-3 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <li>
                        <a
                            href=""
                            className={`no-underline text-gray-700 ${currentStatus === 'all' ? 'font-medium active2' : ''
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleFilterOrders('all');
                                setCurrentStatus('all');
                            }}
                        >
                            Tất cả
                        </a>
                    </li>
                    {Status.map((statusItem: any) => (
                        <li key={statusItem._id}>
                            <a
                                href=""
                                className={`no-underline text-gray-700 ${currentStatus === statusItem._id ? 'font-medium active2' : ''
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
            <Input
                prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                placeholder="Tìm kiếm theo tên và địa chỉ ..."
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: '16px', borderRadius: '5px', width: '400px' }}
            />
            <br />
            <Table
                onChange={handleChange}
                columns={columns}
                dataSource={filteredData}
                pagination={{ defaultPageSize: 6 }}
                rowKey="key"
            />
        </div>
    );
};

export default OrdersManager;
