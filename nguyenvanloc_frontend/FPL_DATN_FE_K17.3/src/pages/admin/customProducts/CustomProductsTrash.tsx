import { useGetAllDeleteQuery, useRemoveForceCustomProductMutation, useRestoreCustomProductMutation } from "@/api/CustomizedProductAPI"
import { useGetUsersQuery } from '@/api/authApi';
// import { useGetCategoryQuery } from '@/api/categoryApi';
import { useGetColorsQuery } from '@/api/colorApi';
import { useGetMaterialQuery } from '@/api/materialApi';
import { useGetSizeQuery } from '@/api/sizeApi';
import { Table, Button } from 'antd';
import { FaTrashCan, FaTrash } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { FaWindowRestore } from "react-icons/fa";
import { BiFoodMenu } from "react-icons/bi";
import { toast } from "react-toastify";
const CustomProductsTrash = () => {
  const { data }: any = useGetAllDeleteQuery();
  const CustomProducts = data?.product
  const { data: colors } = useGetColorsQuery<any>()
  const { data: materials } = useGetMaterialQuery<any>()
  const { data: users } = useGetUsersQuery<any>()
  // const { data: categories } = useGetCategoryQuery<any>()
  const { data: size } = useGetSizeQuery<any>()
  const [removeCustomProduct, resultAdd] = useRemoveForceCustomProductMutation();
  const [restoreCustomProduct, resultCustom] = useRestoreCustomProductMutation()

  const deleteCustomproduct = async (id: any) => {
    // Swal.fire({
    try {
      const result = await Swal.fire({
        title: 'Bạn chắc chứ?',
        text: 'Sản phẩm sẽ được xoá vĩnh viễn',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, tôi chắc chắn!',
        cancelButtonText: 'Huỷ',
      });

      if (result.isConfirmed) {
        const data: any = await removeCustomProduct(id).unwrap();
        if (data) {
          toast.success(`${data.message}`);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('Đã hủy xóa Sản phẩm ');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const restoreCustomProducts = async (id: any) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn chắc chứ?',
        text: 'Bạn có chắc muốn khôi phục sản phẩm này chứ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, tôi chắc chắn!',
        cancelButtonText: 'Huỷ',
      });

      if (result.isConfirmed) {
        const data: any = await restoreCustomProduct(id).unwrap();
        if (data) {
          toast.success(`${data.message}`);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('Sản phẩm chưa được khôi phục');
      }
    } catch (error: any) {
      toast.error(error.message);
    }

  }

  const color = colors?.color
  const material = materials?.material
  const user = users?.data
  // const categorie = categories?.category?.docs
  const sizes = size?.size


  const data1 = CustomProducts?.map((product: any, index: number) => {
    return {
      key: product._id,
      STT: index + 1,
      name: product.product_name,
      price: product.product_price,
      category: product.categoryId,
      materials: product.materialId,
      color: product.colorId,
      user: product.userId,
      sizes: product.sizeId,
      quantity: product.stock_quantity,
      image: <img width={50} src={product.image[0]?.url} alt="" />
    }
  });
  const formatCurrency = (number: number) => {
    if (typeof number !== 'number') {
      // Xử lý khi number không phải là số
      return '0'; // Hoặc giá trị mặc định khác tùy vào yêu cầu của bạn
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      render: (index: any) => <a>{index}</a>,
      width: 75,
    },
    {
      title: 'Tên khách hàng ',
      dataIndex: 'user',
      key: 'user',
      render: (record: any) => {
        const username = user?.find((cate: any) => cate._id === record);
        return `${username?.first_name} ${username?.last_name}`;
      },
      width: 120,
    },
    {
      title: 'Tên sản phẩm ',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
    },
    {
      title: 'Giá',
      width: 100,
      dataIndex: 'price',
      key: 'price',
      render: (text: any) => <p className='text-red-700'>{formatCurrency(text)}₫</p>
    },
    {
      title: 'Muốn mua',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Vật liệu',
      dataIndex: 'materials',
      key: 'materials',
      width: 100,
      render: (record: any) => {
        const materialsname = material?.find((cate: any) => cate._id === record);
        return materialsname?.material_name;
      }
    },
    {
      title: 'Kích cỡ ',
      dataIndex: 'sizes',
      key: 'sizes',
      width: 110,
      render: (record: any) => {
        const sizesrname = sizes?.find((cate: any) => cate._id === record);
        return sizesrname?.size_name;
      }
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (record: any) => {
        const colorname = color?.find((cate: any) => cate._id === record);
        return colorname?.colors_name;
      }
    },
    {
      title: 'Chức năng',
      width: 120,
      render: ({ key: _id }: { key: number | string }) => (
        <div style={{ width: '120px' }}>
          <Button className='mr-1 text-red-500' onClick={() => deleteCustomproduct(_id)}>
            {resultAdd.isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin m-auto" />
            ) : (
              <FaTrashCan />
            )}
          </Button>
          <Button className='mr-1 text-blue-500' onClick={() => restoreCustomProducts(_id)} >
            {resultCustom.isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin m-auto" />
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
      <h3 className="font-semibold">Sản phẩm thiết kế đã xóa</h3>
      <div className="overflow-x-auto drop-shadow-xl rounded-lg">
        <Button className='m-2  float-left'><Link to={'/admin/customized-products-list'}><BiFoodMenu style={{ fontSize: '20', display: 'block' }} /></Link></Button>
        <Button className='m-2  float-right'><Link to={'trash'}><FaTrash style={{ fontSize: '20', display: 'block' }} /></Link></Button>
        <Table dataSource={data1} columns={columns} pagination={{ defaultPageSize: 6 }} rowKey="key" />
      </div>
    </div>
  )
}
export default CustomProductsTrash