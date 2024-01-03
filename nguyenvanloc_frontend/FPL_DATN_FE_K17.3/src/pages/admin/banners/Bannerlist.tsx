import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Table, Button } from 'antd';
import { FaCirclePlus, FaTrashCan, FaWrench } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useGetBannerQuery, useRemoveBannerMutation } from '@/api/bannerApi';
import { useState } from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const Bannerlist = () => {
  const { data }: any = useGetBannerQuery();
  const banners = data?.banner?.docs;
  const [removeBanner, { isLoading: isRemoveLoading }] = useRemoveBannerMutation()
  const [sortedInfo, setSortedInfo] = useState({} as any);
  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortedInfo(sorter);
    // eslint-disable-next-line no-constant-condition
    if (false) {
      console.log(pagination);
      console.log(filters);
    }
  };

  const bannerlist = banners?.map((banner: any, index: number) => {
    return {
      key: banner._id,
      STT: index + 1,
      image: <img width={200} src={banner.image?.url} alt="404 Image" />,
    }
  });
  const deleteBanner = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn chắc chứ?',
        text: 'Banner sẽ bị xoá và không thể khôi phục!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, tôi chắc chắn!',
        cancelButtonText: 'Huỷ',
      });
      if (result.isConfirmed) {
        const data: any = await removeBanner(id).unwrap();
        if (data) {
          toast.success(data.message);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('Hủy xoá banner');
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
      render: (index: number | string) => <a>{index}</a>,
      sorter: (a: any, b: any) => a.STT - b.STT, // Sắp xếp theo STT
      sortOrder: sortedInfo.columnKey === 'STT' && sortedInfo.order,
      ellipsis: true,
      width: 90,
    },
    {
      title: 'Ảnh ',
      dataIndex: 'image',
      key: 'image',
      width: 100,
    },

    {
      title: 'Chức năng',
      width: 140,
      render: ({ key: _id }: { key: string }) => (
        <div style={{ width: '140px' }}>
          <Button className='mr-1 text-red-500' onClick={() => deleteBanner(_id)}>
            {isRemoveLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FaTrashCan />
            )}
          </Button>
          <Button className='mr-1 text-blue-500'>
            <Link to={`/admin/banners/${_id}/edit`}><FaWrench /></Link>
          </Button>
        </div>
      ),

    }

  ];
  return (
    <div className="container">
      <h3 className="font-semibold">Danh sách ảnh quảng cáo</h3>
      <Button className='text-blue-500'>
        <Link to="/admin/banners/add"><FaCirclePlus style={{ fontSize: '24', display: 'block' }} /></Link>
      </Button>
      <Table onChange={handleChange} dataSource={bannerlist} columns={columns} pagination={{ defaultPageSize: 6 }} rowKey="key" />

    </div>

  )
}


export default Bannerlist;
