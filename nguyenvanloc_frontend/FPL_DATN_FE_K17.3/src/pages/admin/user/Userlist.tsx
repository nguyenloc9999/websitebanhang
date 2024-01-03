import { Table, Image, Input, Button } from 'antd';
import { useGetUsersQuery } from '@/api/authApi';
import { useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { FaWrench } from 'react-icons/fa';

const Userlist = () => {
    const { data, isloading }: any = useGetUsersQuery();
    const user = data?.data;
    const [searchText, setSearchText] = useState('');
    const [sortedInfo, setSortedInfo] = useState({} as any);

    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };
    const data1 = isloading
        ? []
        : user?.map((user: any, index: number) => {
            return {
                key: user._id,
                STT: index + 1,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                phone: user.phone ? user.phone : 'Chưa thêm số',
                address: user.address ? user.address : 'Chưa thêm địa chỉ',
                image: user.avatar ? (
                    <Image width={40} height={40} src={user.avatar.url} />
                ) : (
                    <Image width={40} height={40} src={'https://static.thenounproject.com/png/363640-200.png'} />
                ),
                role: <p>{user.role === 'member' ? 'Khách hàng' : user.role === 'admin' ? 'Quản trị' : ''}</p>,
            };
        });
    const columns = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (index: string | number) => <a>{index}</a>,
            sorter: (a: any, b: any) => a.STT - b.STT, // Sắp xếp theo STT
            sortOrder: sortedInfo.columnKey === 'STT' && sortedInfo.order,
            ellipsis: true,
            width: 90,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            key: 'name',
            width: 170,
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Ảnh ',
            dataIndex: 'image',
            key: 'image',
            width: 120,
            reder: (record: any) => {
                return <Image width={80} height={80} src={record.url} />;
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 250,
            render: (email: string) => <a>{email}</a>,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
            render: (phone: string) => <a>{phone}</a>,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 150,
            render: (address: string) => <a>{address}</a>,
        },
        {
            title: 'Chức vụ',
            dataIndex: 'role',
            key: 'role',
            width: 120,
        },
        {
            title: 'Chức năng',
            width: 110,
            render: ({ key: _id }: any) => {
                return (
                    <div style={{ width: '110px' }}>
                        <Button className="mr-1 text-blue-500">
                            <Link to={`/admin/users/edit/${_id}`}>
                                <FaWrench />
                            </Link>
                        </Button>
                    </div>
                );
            },
        },
    ];

    // Xử lý filter..............
    const filteredData = data1?.filter((item: any) => {
        const lowerCaseSearchText = searchText.toLowerCase();
        return (
            item.email.toLowerCase().includes(lowerCaseSearchText) ||
            item.phone.toLowerCase().includes(lowerCaseSearchText) ||
            item.address.toLowerCase().includes(lowerCaseSearchText) ||
            item.role.toLowerCase().includes(lowerCaseSearchText)
        );
    });
    return (
        <div className="container">
            <h3 className="font-semibold">Danh sách khách hàng </h3>
            <Input
                prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                placeholder="Tìm kiếm theo email ..."
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
    );
};

export default Userlist;

