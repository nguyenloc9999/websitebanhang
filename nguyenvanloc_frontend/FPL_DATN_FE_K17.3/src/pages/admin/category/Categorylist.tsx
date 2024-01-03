import { useGetCategoryQuery, useRemoveCategoryMutation } from '@/api/categoryApi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Table, Button, Input } from 'antd';
import { FaCirclePlus, FaTrash, FaTrashCan, FaWrench } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
interface Category {
    _id?: string;
    category_name: string;
    category_image: {
        url: string;
    };
}
const Categorylist = () => {
    const { data }: any = useGetCategoryQuery();
    const categories = data?.category.docs;
    const [removeCategory, { isLoading: isRemoveLoading }] = useRemoveCategoryMutation();
    const [sortedInfo, setSortedInfo] = useState({} as any);
    const [searchText, setSearchText] = useState('');

    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        // eslint-disable-next-line no-constant-condition
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };

    const data1 = categories?.map((category: Category, index: number) => {
        return {
            key: category._id,
            STT: index + 1,
            category_name: category.category_name,
            category_image: <img width={50} src={category.category_image?.url} alt="" />,
        };
    });
    const filteredData = data1?.filter((category: Category) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();
        const lowerCaseCategoryName = category.category_name.toLowerCase().trim();
        return lowerCaseCategoryName.includes(lowerCaseSearchText);
    });

    const deleteProduct = async (id: string) => {
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
                const data: any = await removeCategory(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy xoá danh mục');
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
            width: 90,
            render: (index: number) => <a>{index}</a>,
            sorter: (a: any, b: any) => a.STT - b.STT, // Sắp xếp theo STT
            sortOrder: sortedInfo.columnKey === 'STT' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Ảnh ',
            width: 120,
            dataIndex: 'category_image',
            key: 'category_image',
        },
        {
            title: 'Danh Mục',
            width: 200,
            dataIndex: 'category_name',
            key: 'category_name',
            sorter: (a: any, b: any) => a.category_name.localeCompare(b.category_name),
            sortOrder: sortedInfo.columnKey === 'category_name' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Chức năng',
            width: 150,
            render: ({ key: _id }: { key: string }) => (
                <div style={{ width: '150px' }}>
                    <Button className="mr-1 text-red-500" onClick={() => deleteProduct(_id)}>
                        {isRemoveLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            <FaTrashCan />
                        )}
                    </Button>
                    <Button className="mr-1 text-blue-500">
                        <Link to={`/admin/categories/${_id}/edit`}>
                            <FaWrench />
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];
    return (
        <div className="container">
            <h3 className="font-semibold">Danh sách danh mục</h3>
            <div className="flex overflow-x-auto drop-shadow-xl rounded-lg items-center">
                <Button className="text-blue-500">
                    <Link to="/admin/categories/add">
                        <FaCirclePlus style={{ fontSize: '24', display: 'block' }} />
                    </Link>
                </Button>
                <Input
                    className="m-2"
                    prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                    placeholder="Tìm kiếm tên danh mục sản phẩm..."
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: '16px', borderRadius: '5px', width: '400px' }}
                />
                <Button className="ml-auto">
                    <Link to={'trash'}>
                        <FaTrash style={{ fontSize: '20', display: 'block' }} />
                    </Link>
                </Button>
            </div>
            <Table
                onChange={handleChange}
                dataSource={filteredData}
                columns={columns}
                pagination={{ defaultPageSize: 6 }}
                rowKey="key"
            />
        </div>
    );
};

export default Categorylist;
