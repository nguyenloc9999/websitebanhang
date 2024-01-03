import { useGetSizeQuery, useRemoveSizeMutation } from '@/api/sizeApi';
import { ISize } from '@/interfaces/size';
import { Button, Skeleton, Table, Input } from 'antd';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaCirclePlus, FaTrashCan, FaWrench } from 'react-icons/fa6';
import { IoSearchSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Sizeslist: React.FC<ISize> = () => {
    const { data, error, isLoading } = useGetSizeQuery<any>();
    const [searchText, setSearchText] = useState('');
    const [removeSize, { isLoading: isRemoveLoading }] = useRemoveSizeMutation();
    const size = isLoading ? [] : data?.size;
    const [sortedInfo, setSortedInfo] = useState<any>({});
    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };
    const dataSource = size?.map(
        (
            { _id, size_name, size_height, size_length, size_weight, size_width, size_price }: ISize,
            index: number,
        ) => {
            return {
                key: _id,
                STT: index + 1,
                size_name,
                size_height,
                size_length,
                size_weight,
                size_width,
                size_price
            };
        },
    );
    const deleteSize = async (id: any) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Kích cỡ sẽ bị xoá và không thể khôi phục!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });
            if (result.isConfirmed) {
                const data = await removeSize(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`)
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy xoá kích cỡ');
            }
        } catch (error: any) {
            toast.error(error.data.message);
        }

    };
    const columns = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (index: any) => <a>{index}</a>,
            sorter: (a: any, b: any) => a.STT - b.STT, // Sắp xếp theo STT
            sortSize: sortedInfo.columnKey === 'STT' && sortedInfo.size,
            ellipsis: true,
            width: 90,
        },
        {
            title: 'Tên',
            dataIndex: 'size_name',
            key: 'size_name',
            width: 100,
        },
        {
            title: 'Chiều cao',
            width: 120,
            dataIndex: 'size_height',
            key: 'size_height',
            sorter: (a: any, b: any) => a.size_height - b.size_height,
            sortOrder: sortedInfo.columnKey === 'size_height' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Chiều dài',
            width: 120,
            dataIndex: 'size_length',
            key: 'size_length',
            sorter: (a: any, b: any) => a.size_length - b.size_length,
            sortOrder: sortedInfo.columnKey === 'size_length' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Cân nặng',
            width: 120,
            dataIndex: 'size_weight',
            key: 'size_weight',
            sorter: (a: any, b: any) => a.size_weight - b.size_weight,
            sortOrder: sortedInfo.columnKey === 'size_weight' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Chiều rộng',
            width: 120,
            dataIndex: 'size_width',
            key: 'size_width',
            sorter: (a: any, b: any) => a.size_width - b.size_width,
            sortOrder: sortedInfo.columnKey === 'size_width' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Giá kích cỡ',
            width: 120,
            dataIndex: 'size_price',
            key: 'size_price',
            render: (index: any) => <a>{formatCurrency(index)}đ</a>,
            sorter: (a: any, b: any) => a.size_width - b.size_width,
            sortOrder: sortedInfo.columnKey === 'size_price' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Chức năng',
            width: 120,
            render: ({ key: _id }: any) => {
                return (
                    <div style={{ width: '120px' }}>
                        <Button className="mr-1 text-red-500" onClick={() => deleteSize(_id)}>
                            {isRemoveLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                                <FaTrashCan />
                            )}
                        </Button>
                        <Button className="mr-1 text-blue-500">
                            <Link to={`/admin/sizes/edit/${_id}`}>
                                <FaWrench />
                            </Link>
                        </Button>
                    </div>
                );
            },
        },
    ];

    const formatCurrency = (number: number) => {
        if (typeof number !== 'number') {
            return '0';
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const filteredData = dataSource?.filter((item: any) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();
        const numericSearchText = parseFloat(lowerCaseSearchText);
        return (
            item.size_name.toLowerCase().includes(lowerCaseSearchText) ||
            item.size_height === numericSearchText ||
            item.size_length === numericSearchText ||
            item.size_weight === numericSearchText ||
            item.size_width === numericSearchText
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
            <h3 className="font-semibold">Danh sách Kích cỡ</h3>
            <div className="flex p-1">
                <Button className="text-blue-500">
                    <Link to="/admin/sizes/add">
                        <FaCirclePlus style={{ fontSize: '24', display: 'block' }} />
                    </Link>
                </Button>
                <Input
                    className="ml-4"
                    prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                    placeholder="Tìm kiếm kích cỡ..."
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
export default Sizeslist;
