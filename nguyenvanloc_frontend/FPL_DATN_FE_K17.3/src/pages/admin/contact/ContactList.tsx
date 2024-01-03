import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Table, Button, Input } from 'antd';
import Swal from 'sweetalert2';
import { useGetAllContactQuery, useRemoveForceContactMutation } from '@/api/contactApi';
import { FaTrashCan } from 'react-icons/fa6';
import { useState } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';

const ContactList = () => {
    const [removeContact, { isLoading: isRemoveLoading }] = useRemoveForceContactMutation();
    const { data, isloading: isLoadingContact }: any = useGetAllContactQuery();
    const contacts = data?.contact.docs;
    const [searchText, setSearchText] = useState('');
    const [sortedInfo, setSortedInfo] = useState({} as any);
    const handleChange = (pagination: any, filters: any, sorter: any) => {
        setSortedInfo(sorter);
        if (false) {
            console.log(pagination);
            console.log(filters);
        }
    };
    const datacontact = isLoadingContact
        ? []
        : contacts?.map((contact: any, index: number) => {
            return {
                key: contact._id,
                STT: index + 1,
                contact_name: contact.contact_name,
                contact_email: contact.contact_email,
                contact_phone: contact.contact_phone,
                contact_description: contact.contact_description,
            };
        });

    const deleteContact = async (id: any) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Liên hệ  sẽ bị xoá và không thể khôi phục!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });
            if (result.isConfirmed) {
                const data: any = await removeContact(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`)
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy xóa liên hệ  ');
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
            title: 'Họ tên',
            dataIndex: 'contact_name',
            key: ' contact_name',
            width: 100,
        },
        {
            title: 'Email',
            dataIndex: 'contact_email',
            key: 'contact_email',
            width: 270,
        },
        {
            title: 'Số điện thoại',
            width: 120,
            dataIndex: 'contact_phone',
            key: 'contact_phone',
        },
        {
            title: 'Góp ý',
            width: 200,
            dataIndex: 'contact_description',
            key: 'contact_description',
        },
        {
            title: 'Chức năng',
            width: 170,
            render: ({ key: _id }: any) => {
                return (
                    <div style={{ width: '150px' }}>
                        <Button className="mr-1 text-red-500" onClick={() => deleteContact(_id)}>
                            {isRemoveLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                                <FaTrashCan />
                            )}
                        </Button>
                    </div>
                );
            },
        },
    ];
    const filteredData = datacontact?.filter((item: any) => {
        const lowerCaseSearchText = searchText.toLowerCase().trim();

        const lowerCaseContactEmail = item.contact_email.toLowerCase().trim();
        const lowerCaseContactName = item.contact_name.toLowerCase().trim();
        const lowerCaseContactPhone = item.contact_phone.toLowerCase().trim();
        const lowerCaseContactDescription = item.contact_description.toLowerCase().trim();

        return (
            lowerCaseContactEmail.includes(lowerCaseSearchText) ||
            lowerCaseContactName.includes(lowerCaseSearchText) ||
            lowerCaseContactPhone.includes(lowerCaseSearchText) ||
            lowerCaseContactDescription.includes(lowerCaseSearchText)
        );
    });
    return (
        <div className="container">
            <h3 className="font-semibold">Danh sách liên hệ</h3>
            <Input
                prefix={<IoSearchSharp style={{ opacity: 0.5 }} />}
                placeholder="Tìm kiếm theo tên hoặc email ..."
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

export default ContactList;
