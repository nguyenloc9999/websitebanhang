import { useGetMaterialQuery, useRemoveMaterialMutation } from '@/api/materialApi';
import { IMaterials } from '@/interfaces/materials';
import { Table, Button, Skeleton, Input } from 'antd';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaCirclePlus, FaTrashCan, FaWrench } from 'react-icons/fa6';
import { IoSearchSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


const MaterialList = () => {
    const { data, isLoading }: any = useGetMaterialQuery();
    const [searchText, setSearchText] = useState('');
    const [removeMaterial, { isLoading: isRemoveLoading }] = useRemoveMaterialMutation();
    const material = data?.material;
    const [sortedInfo, setSortedInfo] = useState({} as any);
    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };
    const dataSource = isLoading
        ? []
        : material?.map(({ _id, material_name, material_price }: IMaterials, index: number) => {
            return {
                key: _id,
                STT: index + 1,
                name: material_name,
                price: material_price
            };
        });

    const deleteMaterial = async (id: any) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Vật liệu sẽ bị xoá và không thể khôi phục!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });
            if (result.isConfirmed) {
                const data = await removeMaterial(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`)
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy vật liệu ');
            }
        } catch (error: any) {
            toast.error(error.data.message);
        }

    }
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
            title: 'Tên vật liệu',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'Giá vật liệu',
            dataIndex: 'price',
            key: 'price',
            render: (index: any) => <a>{formatCurrency(index)}đ</a>,
            sorter: (a: any, b: any) => a.STT - b.STT, // Sắp xếp theo STT
            sortSize: sortedInfo.columnKey === 'price' && sortedInfo.size,
            ellipsis: true,
            width: 150,
        },
        {
            title: 'Chức năng',
            width: 140,
            render: ({ key: _id }: { key: number | string }) => (
                <div style={{ width: '140px' }}>
                    <Button className="mr-1 text-red-500" onClick={() => deleteMaterial(_id)}>
                        {isRemoveLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            <FaTrashCan />
                        )}
                    </Button>
                    <Button className="mr-1 text-blue-500">
                        <Link to={`/admin/materials/edit/${_id}`}>
                            <FaWrench />
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    const formatCurrency = (number: number) => {
        if (typeof number !== 'number') {
            return '0';
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    if (isLoading) return <Skeleton />;
    const filteredData = dataSource?.filter((item: any) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();
        const lowerCaseName = item.name.toLowerCase().trim();
        const nameMatches = lowerCaseName.includes(lowerCaseSearchText);
        return nameMatches;
    });
    return (
        <div className="container">
            <h3 className="font-semibold">Danh sách vật liệu</h3>
            <div className="flex">
                <Button className="text-blue-500">
                    <Link to="/admin/materials/add">
                        <FaCirclePlus style={{ fontSize: '24', display: 'block' }} />
                    </Link>
                </Button>
                <Input
                    className="ml-4"
                    prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                    placeholder="Tìm kiếm tên vật liệu ..."
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: '16px', borderRadius: '5px', width: '400px' }}
                />
            </div>
            <div className="overflow-x-auto drop-shadow-xl rounded-lg">
                <Table
                    dataSource={filteredData}
                    onChange={handleChange}
                    columns={columns}
                    pagination={{ defaultPageSize: 6 }}
                    rowKey="key"
                />
            </div>

        </div>
    );
};

export default MaterialList;
