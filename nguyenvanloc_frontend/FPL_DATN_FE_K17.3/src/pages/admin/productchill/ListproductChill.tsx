
import { useGetCategoryQuery } from '@/api/categoryApi';
import { useGetChildProductByProductIdQuery, useRemovecChildProductMutation } from '@/api/chilProductApi';
import { useGetColorsQuery } from '@/api/colorApi';
import { useGetMaterialQuery } from '@/api/materialApi';
import { useGetProductByIdQuery } from '@/api/productApi';
import { useGetSizeQuery } from '@/api/sizeApi';
import { IChildProduct } from '@/interfaces/childProduct';
import { Image, Table, Button, Row, Col } from 'antd';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaTrashCan, FaWrench } from "react-icons/fa6";
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AddChildProduct from './AddChildProduct';
import { useEffect } from 'react';
const ListproductChill = () => {
  const { productId }: any = useParams<string>();
  const { data, refetch, error }: any = useGetChildProductByProductIdQuery<IChildProduct>(productId);
  const { data: colors } = useGetColorsQuery<any>();
  const { data: sizes } = useGetSizeQuery<any>()
  const [RemoveChillproduct, resultRemove] = useRemovecChildProductMutation();
  const { data: productData }: any = useGetProductByIdQuery(productId);
  const products = data?.products
  const color = colors?.color;
  const size = sizes?.size
  const { data: category }: any = useGetCategoryQuery();
  const categoryLish = category?.category.docs;
  const categoryLishOne = categoryLish?.find(
    (categoryLish: any) => categoryLish?._id === productData?.product?.categoryId
  )?.category_name;
  const { data: material }: any = useGetMaterialQuery();
  const materialList = material?.material;
  const materialLishOne = materialList?.find(
    (materialList: any) => materialList?._id === productData?.product?.materialId
  )?.material_name;
  useEffect(() => {
    refetch()
  }, [resultRemove.isLoading])
  const data1 = products?.map((product: any, index: number) => {
    return {
      key: product._id,
      STT: index + 1,
      price: product.product_price,
      colors: product.colorId,
      sizes: product.sizeId,
      materials: product.materialId,
      quantity: product.stock_quantity,
      image: <img width={50} src={product.product?.url} alt="" />
    }
  });

  const deleteChillProduct = async (id: any) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn chắc chứ?',
        text: 'bạn có chắc chắn muốn xóa',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vâng, tôi chắc chắn!',
        cancelButtonText: 'Huỷ',
      });

      if (result.isConfirmed) {
        const data: any = await RemoveChillproduct(id).unwrap();
        if (data) {
          refetch();
          toast.success(`${data.message}`);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info('Sản phẩm thiết kế xoá thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
    }

  }
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
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: () => <Image src={productData?.product?.image[0]?.url} width={50} />
    },
    {
      title: 'Kích cỡ',
      dataIndex: 'sizes',
      key: 'sizes',
      width: 120,
      render: (record: any) => {
        const sizesname = size?.find((s: any) => s._id == record);
        return sizesname?.size_name
          ;
      }
    }
    ,
    {
      title: 'Màu Sắc',
      dataIndex: 'colors',
      key: 'colors',
      width: 120,
      render: (record: string) => {
        const colorname = color?.find((colors: any) => colors._id === record);
        return colorname?.colors_name
          ;
      }
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: any) => <p className="text-red-700">{formatCurrency(price)}₫</p>
    },
    {
      title: 'Số hàng tồn',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 170,
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: 'Chức năng',
      render: ({ key: _id }: { key: number | string }) => (
        <div style={{ width: '120px' }}>
          <Button className='mr-1 text-red-500' onClick={() => deleteChillProduct(_id)}>
            {resultRemove.isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FaTrashCan />
            )}
          </Button>
          <Button className='mr-1 text-blue-500'>
            <Link to={`/admin/products/childProduct/${_id}/edit`}><FaWrench /></Link>
          </Button>
        </div>
      ),

    }

  ];
  return (
    <div className="container">
      <div className="product-details">
        <div className="product-info">
          <h3 className="product-name">{productData?.product?.product_name}</h3>
          <p className="product-price">{formatCurrency(productData?.product?.product_price)}đ</p>
          <p className="product-category">Danh mục: {categoryLishOne}</p>
          <p className="product-material">Vật liệu: {materialLishOne}</p>
        </div>
        <div className="product-image">
          <img src={productData?.product?.image[0]?.url} alt="Product" />
        </div>
      </div>
      <div className="overflow-x-auto drop-shadow-xl rounded-lg mt-4">
        <Row gutter={[16, 16]}>
          <Col span={14}>
            {data1 && !error ? (
              <Table dataSource={data1} columns={columns} pagination={{ defaultPageSize: 4 }} rowKey="key" />
            ) : (
              <p className='text-red-500 text-center py-4'>Không có sản phẩm thiết kế nào.</p>
            )}
          </Col>
          <Col span={10}>
            <AddChildProduct />
          </Col>
        </Row>

      </div>
    </div>
  )
}

export default ListproductChill
