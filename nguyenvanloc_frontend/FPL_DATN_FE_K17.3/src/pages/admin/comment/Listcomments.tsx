import { useGetCommentsQuery } from '@/api/commentApi';
import { Table, Button, Input, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { BiDetail } from 'react-icons/bi';
import { useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { IComment } from '@/interfaces/comment';

const Listcomments = () => {
    const { data: comment, isloading: isLoadingComment, error } = useGetCommentsQuery<any>();
    const comments = comment?.products;
    const [searchText, setSearchText] = useState('');
    const [sortedInfo, setSortedInfo] = useState({} as any);
    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };

    const dataComment = comments?.map((comment: IComment, index: number) => {
        return {
            key: comment._id,
            STT: index + 1,
            product: comment.product_name,
            comments_count: comment.comments_count,
        };
    });

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
            title: 'Sản Phẩm',
            dataIndex: 'product',
            key: 'product',
            width: 200,
        },
        {
            title: 'Số lượng đánh giá',
            dataIndex: 'comments_count',
            key: 'comments_count',
            width: 200,
            sorter: (a: any, b: any) => a.comments_count - b.comments_count,
            sortOrder: sortedInfo.columnKey === 'comments_count' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: 'Chức năng',
            width: 120,
            render: ({ key: _id }: IComment) => (
                <div>
                    <Button className="mr-5 text-blue-500">
                        <Link to={`/admin/comments/${_id}`}>
                            <BiDetail />
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];
    const filteredData = dataComment?.filter((item: IComment | any) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();
        const lowerCaseProductName = item.product.toLowerCase().trim();
        
        return lowerCaseProductName.includes(lowerCaseSearchText);
    });
    if (isLoadingComment) return <Skeleton />;
    if (error) {
        return <div>Error: {error.message}</div>; // Hoặc hiển thị một thông báo lỗi khác
    }
    return (
        <div>
            <div className="container">
                <h3 className="font-semibold py-3">Danh sách sản phẩm có đánh giá </h3>
                <Input
                    prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                    placeholder="Tìm kiếm theo tên sản phẩm..."
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: '16px', borderRadius: '5px', width: '400px' }}
                />
                <br />
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

export default Listcomments;
