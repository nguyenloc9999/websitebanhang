import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Table, Button, Input } from 'antd';
import { FaCirclePlus, FaTrash, FaTrashCan, FaWrench } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useGetNewsQuery, useRemoveNewMutation } from '@/api/newsApi';
import { IoSearchSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { INew } from '@/interfaces/new';

const Newslist = () => {
    const [searchText, setSearchText] = useState('');
    const { data, isloading: isloadingNews }: any = useGetNewsQuery();
    const news = data?.news.docs;
    const [removeNews, { isLoading: isRemoveLoading }] = useRemoveNewMutation();
    const [sortedInfo, setSortedInfo] = useState({} as any);
    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };

    const dataNews = isloadingNews
        ? []
        : news?.map((news: INew, index: number) => {
            return {
                key: news._id,
                STT: index + 1,
                new_name: news.new_name,
                new_description: news.new_description,
                new_image: <img width={50} src={news.new_image?.url} alt="" />,
            };
        });
    const deleteNew = async (_id: string) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Tin tức sẽ bị xoá và không thể khôi phục!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });
            if (result.isConfirmed) {
                const data: any = await removeNews(_id).unwrap();
                if (data) {
                    toast.success(`${data.message}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy xoá Tin tức');
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
            width: 90,
        },
        {
            title: 'Ảnh ',
            dataIndex: 'new_image',
            key: 'new_image',
            width: 100,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'new_name',
            key: 'new_name',
            width: 200,
            sorter: (a: any, b: any) => a.new_name.localeCompare(b.new_name),
            sortOrder: sortedInfo.columnKey === 'new_name' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Mô tả',
            width: 250,
            dataIndex: 'new_description',
            key: 'new_description',
            sorter: (a: any, b: any) => a.new_description - b.new_description, // Sắp xếp theo giá
            sortOrder: sortedInfo.columnKey === 'new_description' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Chức năng',
            width: 130,
            render: ({ key: _id }: { key: string }) => (
                <div style={{ width: '130px' }}>
                    <Button className="mr-1 text-red-500" onClick={() => deleteNew(_id)}>
                        {isRemoveLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            <FaTrashCan />
                        )}
                    </Button>
                    <Button className="mr-1 text-blue-500">
                        <Link to={`/admin/news/${_id}/edit`}>
                            <FaWrench />
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];
    const filteredData = dataNews?.filter((item: INew) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();
        const lowerCaseItemName = item.new_name.toLowerCase().trim();
        const lowerCaseItemDescription = item.new_description.toLowerCase().trim();

        return (
            lowerCaseItemName.includes(lowerCaseSearchText) ||
            lowerCaseItemDescription.includes(lowerCaseSearchText)
        );
    });
    return (
        <div className="container">
            <h3 className="font-semibold">Danh sách tin tức</h3>
            <div className="flex p-1">
                <Button className="text-blue-500">
                    <Link to="/admin/news/add">
                        <FaCirclePlus style={{ fontSize: '24', display: 'block' }} />
                    </Link>
                </Button>
                <Input
                    className="ml-4"
                    prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                    placeholder="Tìm kiếm theo tiêu đề ..."
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

export default Newslist;
