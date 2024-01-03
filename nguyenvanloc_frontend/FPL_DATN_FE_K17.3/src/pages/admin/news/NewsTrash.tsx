import { useGetAllDeleteQuery, useRemoveForceNewMutation, useRestoreNewMutation } from '@/api/newsApi';
import { INew } from '@/interfaces/new';
import { Table, Button } from 'antd';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaTrashCan, FaWindowRestore } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


const NewsTrash = () => {
  const { data }: any = useGetAllDeleteQuery();
  const news = data?.news;
  const [removeNew, resultRemove] = useRemoveForceNewMutation();
  const [restoreNew, resultRestore] = useRestoreNewMutation()
  const navigate = useNavigate();

  const deleteNew = async (id: number | string) => {
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
        const data: any = await removeNew(id).unwrap();
        if (data) {
          toast.success(`${data.message}`);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('Hủy xoá Tin tức');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  const restoreNew1 = async (id: number | string) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn chắc chứ?',
        text: 'Bạn có muốn khôi phục lại!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, tôi chắc chắn!',
        cancelButtonText: 'Huỷ',
      });

      if (result.isConfirmed) {
        const data: any = await restoreNew(id).unwrap();
        if (data) {
          toast.success(`${data.message}`);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('Hủy Khôi Phục Tin tức');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const data1 = news?.map((news: INew) => {
    return {
      key: news._id,
      name: news.new_name,
      stake: news.new_description,
      image: <img width={50} src={news.new_image?.url} alt="" />
    }
  });

  const columns = [
    {
      title: 'Ảnh ',
      dataIndex: 'image',
      key: 'image',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Chức năng',
      render: ({ key: _id }: { key: number | string }) => (

        <div>
          <Button className='mr-1 text-red-500' onClick={() => deleteNew(_id)}>
            {resultRemove.isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FaTrashCan />
            )}
          </Button>
          <Button className='mr-1 text-blue-500' onClick={() => restoreNew1(_id)} >
            {resultRestore.isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FaWindowRestore />
            )}
          </Button>
        </div>
      )

    }

  ];
  return (
    <div className="container">
      <h3 className="font-semibold">Danh sách tin tức đã xoá</h3>
      <Button className="h-10 bg-blue-500 text-xs text-white mt-2 mb-2" onClick={() => navigate("/admin/news")} htmlType="submit">
        Danh sách tin tức
      </Button>
      <Table dataSource={data1} columns={columns} />
    </div>
  )
}

export default NewsTrash