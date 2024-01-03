import { useGetBrandQuery, useRemoveBrandMutation } from '@/api/brandApi';
import { IBrand } from '@/interfaces/brand';
import { Button, Skeleton, Table, Input } from 'antd';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaCirclePlus, FaTrashCan, FaWrench } from 'react-icons/fa6';
import { IoSearchSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const BrandsList = () => {
    const { data, error, isLoading }: any = useGetBrandQuery();
    const [removeBrand, { isLoading: isRemoveLoading }] = useRemoveBrandMutation();
    const brand = data?.brand;
    const [searchText, setSearchText] = useState('');
    const [sortedInfo, setSortedInfo] = useState({} as any);
    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        // eslint-disable-next-line no-constant-condition
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };
    const dataSource = isLoading
        ? []
        : brand?.map(({ _id, brand_name }: IBrand, index: number) => {
            return {
                key: _id,
                STT: index + 1,
                name: brand_name,
            };
        });
    const deleteBrand = async (id: any) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Danh mục sẽ bị xoá và không thể khôi phục!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });
            if (result.isConfirmed) {
                const data = await removeBrand(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy xoá danh mục');
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
            sortOrder: sortedInfo.columnKey === 'STT' && sortedInfo.order,
            ellipsis: true,
            width: 90,
        },
        {
            title: 'Tên thương hiệu',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'Chức năng',
            width: 150,
            render: ({ key: _id }: any) => {
                return (
                    <div style={{ width: '150px' }}>
                        <Button className="mr-1 text-red-500" onClick={() => deleteBrand(_id)}>
                            {isRemoveLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                                <FaTrashCan />
                            )}
                        </Button>
                        <Button className="mr-1 text-blue-500">
                            <Link to={`/admin/brands/edit/${_id}`}>
                                <FaWrench />
                            </Link>
                        </Button>
                    </div>
                );
            },
        },
    ];
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

    const filteredData = dataSource?.filter((item: any) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();
        const lowerCaseItemName = item.name.toLowerCase().trim();

        return lowerCaseItemName.includes(lowerCaseSearchText);
    });
    return (
        <div className="container">
            <h3 className="font-semibold">Danh sách thương hiệu </h3>
            <div className="flex p-1">
                <Button className="text-blue-500">
                    <Link to="/admin/brands/add">
                        <FaCirclePlus style={{ fontSize: '24', display: 'block' }} />
                    </Link>
                </Button>
                <Input
                    className="ml-4"
                    prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                    placeholder="Tìm kiếm theo tên thương hiệu ..."
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

export default BrandsList;
