
import { useGetOrderByIdQuery } from '@/api/orderApi';
import { format } from 'date-fns';
import { getDecodedAccessToken } from '@/decoder';
import { Link, useParams } from 'react-router-dom';
import { useGetUserByIdQuery } from '@/api/authApi';
import { Skeleton } from 'antd';
import { useGetMaterialQuery } from '@/api/materialApi';
import { useGetColorsQuery } from '@/api/colorApi';
import { useGetSizeQuery } from '@/api/sizeApi';

const OrderDetail = () => {
  const decodedToken: any = getDecodedAccessToken();
  const iduser = decodedToken ? decodedToken.id : null;
  const { id }: any = useParams();
  const { data: dataOrder, error, isLoading: isLoadingFetching }: any = useGetOrderByIdQuery(id || "");
  const orders = dataOrder?.order;
  const { data: dataUser } = useGetUserByIdQuery<any>(iduser);
  dataUser?.user;
  const { data: colors } = useGetColorsQuery<any>();
  const { data: sizes } = useGetSizeQuery<any>();
  const { data: materials } = useGetMaterialQuery<any>();
  const color = colors?.color;
  const size = sizes?.size;
  const material = materials?.material


  const formatCurrency = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (isLoadingFetching) return <Skeleton />;
  if (error) {
    if ("data" in error && "status" in error) {
      return (
        <div>
          {error.status} - {JSON.stringify(error.data)}
        </div>
      );
    }
  }
  return (
    <div>
      <h3 className='text-gray-500 md:py-10 pt-5 pl-10'>Thông tin đơn hàng</h3>
      <div className="md:grid md:grid-cols-2 l md:mx-4 mx-2 rounded-md " key={orders._id}>
        {/* --------------------Col 1 --------------------------- */}
        <div className="rounded-lg bg-white md:ml-20 max-w-md	h-80 mt-3">
          <div className="name font-sans pt-10 ml-20">Họ và tên : <a href="" style={{ textDecoration: "none", color: "black", fontSize: '14px' }}>{dataUser?.first_name} {dataUser?.last_name} </a></div>
          <div className='font-sans mt-2 ml-20'>Số điện thoại : <a href="" style={{ textDecoration: "none", color: "black", fontSize: '14px' }}>{orders?.phone}</a></div>
          <div className='font-sans mt-2 ml-20'>Địa chỉ : <a href="" style={{ textDecoration: "none", color: "black", fontSize: '14px' }}>{orders?.address}</a></div>
          <div className='font-sans mt-2 ml-20'>Trạng thái : <strong style={{ textDecoration: "none", color: "black", fontSize: '14px' }}>{orders?.status?.status_name}</strong></div>
          <div className='font-sans mt-2 ml-20'>Ngày đặt hàng : <a href="" style={{ textDecoration: "none", color: "black", fontSize: '14px' }}>{format(new Date(orders?.createdAt), "HH:mm a dd/MM/yyyy")}</a></div>
          {orders && orders.notes ? <div className='font-sans mt-1'>Ghi chú : <a href="" style={{ textDecoration: "none", color: "black", fontSize: '14px' }}>{orders?.notes}</a></div> : ''}
          <div className='font-sans mt-2 ml-20'>Phí vận chuyển: <a href="" style={{ textDecoration: "none", color: "red", }}>{formatCurrency(orders?.shipping)}₫</a></div>
          {orders.deposit ? <div className='font-semibold ml-20'>Đã cọc: <a href="" style={{ textDecoration: "none", color: "red", }}>{formatCurrency(orders?.deposit)}₫</a></div> : ''}
          <div className='font-semibold mt-2 mb-10 ml-20'>{orders.deposit ? 'Tổng tiền còn lại: ' : 'Tổng đơn hàng: '} <a href="" style={{ textDecoration: "none", color: "red", }}>{formatCurrency(orders?.total)}₫</a></div>
        </div>
        {/* --------------------Col 1 --------------------------- */}
        <div className="rounded-lg md:mr-20">
          {orders ? orders.products.map((product: any, index: number) => {
            const colorname = color?.find((color: any) => color._id === product.colorId);
            const sizename = size?.find((size: any) => size._id === product.sizeId);
            const materialname = material?.find((material: any) => material._id === product.materialId);
            return (
              <div key={index} className='mb-3 mt-3' style={{ background: '#FAFAFA', borderRadius: "10px" }}>
                <div className="container p-4">
                  <img className="ml-2 mr-2 rounded float-left" style={{ width: 150, height: 120 }} src={product?.image} alt="" />
                  <div className="font-sans">
                    <strong >
                      {product.formation == 'nor' ? <Link style={{ color: "black" }} to={`/products/${product?.productId}`}>{product?.product_name}</Link> : <Link style={{ color: "black" }} to={`/customized-products/${product?.productId}`}>{product?.product_name}</Link>}
                    </strong>
                  </div>
                  <div className="font-sans" style={{ fontSize: '14px' }}>Giá: <a href='' style={{ textDecoration: "none", color: "red", fontWeight: 'bold', fontSize: '12px' }}>{formatCurrency(product?.product_price)}₫</a> , số lượng: <a href='' style={{ textDecoration: "none", color: "black", fontSize: '12px' }}>{product?.stock_quantity}</a> </div>
                  <div className="font-sans" style={{ fontSize: '14px' }}>Màu sắc: <a href="" style={{ textDecoration: "none", color: "black" }}>{colorname?.colors_name}</a> </div>
                  <div className="font-sans" style={{ fontSize: '14px' }}>Size: <a href="" style={{ textDecoration: "none", color: "black", }}>{sizename?.size_name}</a> </div>
                  <div className="font-sans" style={{ fontSize: '14px' }}>Vật liệu: <a href="" style={{ textDecoration: "none", color: "black", }}>{materialname?.material_name}</a> </div>
                </div>
              </div>
            )
          }) : "Lỗi"}
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
