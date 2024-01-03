import { useGetCouponQuery, useRemoveCouponMutation } from '@/api/couponsApi';
import { ICoupon } from '@/interfaces/coupon';
import { Button, Skeleton, Table, Input } from 'antd';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaCirclePlus, FaTrashCan, FaWrench } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { IoSearchSharp } from 'react-icons/io5';
import { useState } from 'react';
import { toast } from 'react-toastify';

const CouponsList = () => {
    const { data, error, isLoading }: any = useGetCouponQuery();
    const [searchText, setSearchText] = useState('');
    const [sortedInfo, setSortedInfo] = useState({} as any);
    const [removeCoupon, { isLoading: isRemoveLoading }] = useRemoveCouponMutation();
    const coupon = isLoading ? [] : data?.coupon;

    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };
    const dataSource = coupon?.map(
        (
            {
                _id,
                coupon_name,
                coupon_code,
                coupon_content,
                coupon_quantity,
                discount_amount,
                expiration_date,
                min_purchase_amount,
            }: ICoupon,
            index: number,
        ) => {
            const formattedExpirationDate = expiration_date
                ? format(new Date(expiration_date), 'dd/MM/yyyy')
                : '';
            return {
                key: _id,
                STT: index + 1,
                coupon_name,
                coupon_code,
                coupon_content,
                coupon_quantity,
                discount_amount,
                expiration_date: formattedExpirationDate,
                min_purchase_amount,
            };
        },
    );
    const formatCurrency = (number: number) => {
        if (typeof number !== 'number') {
            return '0';
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    const deleteCoupon = async (id: number | string) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Phiếu giảm giá sẽ bị xoá và không thể khôi phục!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });

            if (result.isConfirmed) {
                const data: any = await removeCoupon(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy xoá phiếu giảm giá');
            }
        } catch (error: any) {
            toast.error(error.message);
        }

    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (index: number) => <a>{index}</a>,
            sorter: (a: any, b: any) => a.STT - b.STT, // Sắp xếp theo STT
            sortOrder: sortedInfo.columnKey === 'STT' && sortedInfo.order,
            ellipsis: true,
            width: 70,
        },
        {
            title: 'Phiếu giảm giá',
            dataIndex: 'coupon_name',
            key: 'coupon_name',
            width: 120,
        },
        {
            title: 'Mã giảm giá',
            dataIndex: 'coupon_code',
            key: 'coupon_code',
            width: 110,
        },
        {
            title: 'Nội dung',
            dataIndex: 'coupon_content',
            key: 'coupon_content',
            width: 170,
        },
        {
            title: 'Số lượng',
            width: 95,
            dataIndex: 'coupon_quantity',
            key: 'coupon_quantity',
            sorter: (a: any, b: any) => a.coupon_quantity - b.coupon_quantity, // Sắp xếp theo coupon_quantity
            sortOrder: sortedInfo.columnKey === 'coupon_quantity' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Phần trăm giảm giá (%)',
            width: 100,
            dataIndex: 'discount_amount',
            key: 'discount_amount',
            render: (index: string | number) => <a>{index}%</a>,
            sorter: (a: any, b: any) => a.discount_amount - b.discount_amount, // Sắp xếp theo discount_amount
            sortOrder: sortedInfo.columnKey === 'discount_amount' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Ngày hết hạn',
            width: 120,
            dataIndex: 'expiration_date',
            key: 'expiration_date',
            sorter: (a: any, b: any) => a.expiration_date.localeCompare(b.expiration_date),
            sortOrder: sortedInfo.columnKey === 'expiration_date' && sortedInfo.order,
        },
        {
            title: 'Số tiền mua tối thiểu',
            width: 130,
            dataIndex: 'min_purchase_amount',
            key: 'min_purchase_amount',
            render: (index: number) => <a>{formatCurrency(index)}đ</a>,
            sorter: (a: any, b: any) => a.min_purchase_amount - b.min_purchase_amount, // Sắp xếp theo min_purchase_amount
            sortOrder: sortedInfo.columnKey === 'min_purchase_amount' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Chức năng',
            width: 110,
            render: ({ key: _id }: { key: string }) => {
                return (
                    <div style={{ width: '110px' }}>
                        <Button className="mr-1 text-red-500" onClick={() => deleteCoupon(_id)}>
                            {isRemoveLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                                <FaTrashCan />
                            )}
                        </Button>
                        <Button className="mr-1 text-blue-500">
                            <Link to={`/admin/coupons/edit/${_id}`}>
                                <FaWrench />
                            </Link>
                        </Button>
                    </div>
                );
            },
        },
    ];
    const filteredData = dataSource?.filter((item: ICoupon) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();
        const numericSearchText = parseFloat(lowerCaseSearchText);

        const lowerCaseCouponName = item.coupon_name.toLowerCase().trim();
        const lowerCaseCouponCode = item.coupon_code.toLowerCase().trim();
        const lowerCaseCouponContent = item.coupon_content.toLowerCase().trim();

        return (
            lowerCaseCouponName.includes(lowerCaseSearchText) ||
            lowerCaseCouponCode.includes(lowerCaseSearchText) ||
            lowerCaseCouponContent.includes(lowerCaseSearchText) ||
            item.coupon_quantity === numericSearchText ||
            item.discount_amount === numericSearchText
        );
    });

    if (isLoading) return <Skeleton />;
    if (error) {
        if ('data' in error && 'status' in error) {
            return (
                <div>
                    {error.status} - {JSON.stringify(error.data)}
                </div>
            );
        }
    }
    return (
        <div className="container">
            <h3 className="font-semibold">Danh sách phiếu giảm giá</h3>
            <div className="flex p-1">
                <Button className="text-blue-500">
                    <Link to="/admin/coupons/add">
                        <FaCirclePlus style={{ fontSize: '24', display: 'block' }} />
                    </Link>
                </Button>
                <Input
                    className="ml-4"
                    prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                    placeholder="Tìm kiếm phiếu giảm giá ..."
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: '16px', borderRadius: '5px', width: '400px' }}
                />
            </div>
            <div className="overflow-x-auto drop-shadow-xl rounded-lg">
                <Table
                    onChange={handleChange}
                    dataSource={filteredData}
                    columns={columns}
                    pagination={{ defaultPageSize: 6 }}
                    rowKey="key"
                />
            </div>
        </div>
    );
};

export default CouponsList;
