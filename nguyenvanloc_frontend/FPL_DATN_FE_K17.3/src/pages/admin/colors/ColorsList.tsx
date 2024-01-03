import { useGetColorsQuery, useRemoveColorMutation } from '@/api/colorApi';
import { IColor } from '@/interfaces/color';
import { Button, Input, Skeleton, Table } from 'antd';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaCirclePlus, FaTrashCan, FaWrench } from 'react-icons/fa6';
import { IoSearchSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


interface TableData {
    key: string;
    STT: number;
    name: string;
    price: number
}

const Colorslist: React.FC<IColor> = () => {
    const { data, error, isLoading } = useGetColorsQuery<any>();
    const [searchText, setSearchText] = useState('');
    const [removeColor, { isLoading: isRemoveLoading }] = useRemoveColorMutation();
    const [sortedInfo, setSortedInfo] = useState<any>({});

    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        // eslint-disable-next-line no-constant-condition
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };
    const color = isLoading ? [] : data?.color;
    const dataSource: TableData[] | undefined = color?.map(({ _id, colors_name, color_price }: IColor, index: number) => {
        return {
            key: _id,
            STT: index + 1,
            name: colors_name,
            price: color_price
        };
    });

    const deleteColor = async (id: any) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Màu sẽ bị xoá và không thể khôi phục!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });
            if (result.isConfirmed) {
                const data = await removeColor(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`)
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy Màu ');
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
            render: (index: number) => <a>{index}</a>,
            sorter: (a: TableData, b: TableData) => a.STT - b.STT, // Sắp xếp theo STT
            sortOrder: sortedInfo.columnKey === 'STT' && sortedInfo.order,
            ellipsis: true,
            width: 90,
        },
        {
            title: 'Tên màu',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'Giá màu',
            dataIndex: 'price',
            key: 'price',
            render: (index: number) => <a>{formatCurrency(index)}đ</a>,
            sorter: (a: TableData, b: TableData) => a.STT - b.STT, // Sắp xếp theo STT
            sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
            ellipsis: true,
            width: 150,
        },
        {
            title: 'Chức năng',
            width: 100,
            render: ({ key: _id }: TableData) => {
                return (
                    <div style={{ width: '100px' }}>
                        <Button className="mr-1 text-red-500" onClick={() => deleteColor(_id)}>
                            {isRemoveLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                                <FaTrashCan />
                            )}
                        </Button>
                        <Button className="mr-1 text-blue-500">
                            <Link to={`/admin/colors/edit/${_id}`}>
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
    // Xử lý filter..............
    const filteredData = dataSource?.filter((item: any) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();
        const lowerCaseName = item.name.toLowerCase().trim();
        return lowerCaseName.includes(lowerCaseSearchText);
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
            <h3 className="font-semibold">Danh sách màu</h3>
            <div className="flex p-1">
                <Button className="text-blue-500">
                    <Link to="/admin/colors/add">
                        <FaCirclePlus style={{ fontSize: '24', display: 'block' }} />
                    </Link>
                </Button>
                <Input
                    className="ml-4"
                    prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                    placeholder="Tìm kiếm tên màu ..."
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

export default Colorslist;
