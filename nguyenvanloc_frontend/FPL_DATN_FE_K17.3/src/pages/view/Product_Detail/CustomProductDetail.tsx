import './Product_detail.css';
import 'swiper/css';
import 'swiper/css/navigation';
import './Responsive_Product_Detail.css';
import { FaArrowRight } from 'react-icons/fa';
import { useParams, } from 'react-router-dom';
import { getDecodedAccessToken } from '@/decoder';
import { useGetCustomizedproductsByIdQuery } from '@/api/CustomizedProductAPI';
import { useGetCategoryQuery } from '@/api/categoryApi';
import { useEffect, useState } from 'react';
import { useGetMaterialQuery } from '@/api/materialApi';
import { useGetColorsQuery } from '@/api/colorApi';
import { useGetSizeQuery } from '@/api/sizeApi';
import { useAddCartMutation } from '@/api/cartApi';
import Swal from 'sweetalert2';
import { Button, Pagination } from 'antd';
import { AiFillStar, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useGetCommentByProductIdQuery } from '@/api/commentApi';

const PAGE_SIZE = 5;


const CustomProductDetail = () => {
  const { id }: any = useParams();
  const decodedToken: any = getDecodedAccessToken();
  const idUser = decodedToken ? decodedToken.id : null;
  const { data }: any = useGetCustomizedproductsByIdQuery(id || "");
  const customProducts = data?.product;
  const [selectedIndex] = useState(false);
  const { data: category }: any = useGetCategoryQuery();
  const { data: comment, isLoading: isLoadingComment }: any = useGetCommentByProductIdQuery(id || '');
  const categoryLish = category?.category.docs;
  const categoryLishOne = categoryLish?.find(
    (categoryLish: any) => categoryLish?._id === customProducts?.categoryId
  )?.category_name;

  const { data: material }: any = useGetMaterialQuery();
  const materialList = material?.material;
  const materialLishOne = materialList?.find(
    (materialList: any) => materialList?._id === customProducts?.materialId
  )?.material_name;

  const { data: color }: any = useGetColorsQuery();
  const colorList = color?.color;
  const colorLishOne = colorList?.find(
    (colorList: any) => colorList?._id === customProducts?.colorId
  )?.colors_name;

  const { data: size }: any = useGetSizeQuery();
  const sizeLish = size?.size;
  const sizeLishOne = sizeLish?.find(
    (sizeLish: any) => sizeLish?._id === customProducts?.sizeId
  )?.size_name;
  const [quantity, setQuantity] = useState<any>(1); // Sử dụng useState để quản lý số lượng

  const commentProductDetail = isLoadingComment ? [] : comment?.comments;
  const [page, setPage] = useState(1);

  const filteredComments = commentProductDetail?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (customProducts) {
      setQuantity(customProducts?.stock_quantity)
    }
  }, [customProducts])
  const formatCurrency = (number: { toString: () => string; }) => {
    if (number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
      return "0"; // Giá trị mặc định hoặc xử lý khác
    }
  }
  const [addCart, resultAdd] = useAddCartMutation<any>();

  const handleAddToCart = async () => {
    try {
      if (customProducts && idUser) {
        const sizeId = customProducts.sizeId;
        const colorId = customProducts.colorId;
        const materialId = customProducts.materialId;
        const cartData: any = {
          productId: customProducts._id,
          product_name: customProducts.product_name,
          product_price: customProducts?.product_price,
          image: customProducts.image[0]?.url,
          stock_quantity: quantity,
          colorId: colorId,
          sizeId: sizeId,
          materialId: materialId,
          formation: 'des'
        };
        const result = await Swal.fire({
          title: "Bạn chắc chứ?",
          text: "Sản phẩm sẽ được thêm vào giỏ hàng!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Vâng, tôi chắc chắn!",
          cancelButtonText: "Huỷ",
        });

        if (result.isConfirmed) {
          const response: any = await addCart({ data: cartData, userId: idUser } as any);
          if (response.error) {
            toast.error(response.error.data.message);
          }
          if (response) {
            toast.success(response.data.message);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          toast.info("Huỷ Sản phẩm không được thêm vào giỏ hàng ");
        }
      }
    } catch (error: any) {
      if (Array.isArray(error.data.message)) {
        // Xử lý trường hợp mảng
        const messages = error.data.message;
        messages.forEach((message: any) => {
          toast.error(message);
        });
      } else {
        // Xử lý trường hợp không phải mảng
        toast.error(error.data.message);
      }
    }
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1); // Cập nhật số lượng
    }
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const formatTimeAgo = (timestamp: any) => {
    const now: any = new Date();
    const commentTime: any = new Date(timestamp);

    const timeDiff = now - commentTime;
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12); // Số năm

    if (years > 0) {
      return `${years} năm trước`;
    } else if (months > 0) {
      return `${months} tháng trước`;
    } else if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return 'Vừa xong';
    }
  };


  return (
    <div className="">
      <div className="container">
        <div className="flex items-center my-4 px-3">
          <div className="float-left font-bold">Trang Chủ</div>
          <FaArrowRight className="ml-2" />
          <div className="pl-2">Sản phẩm tự thiết kế</div>
          <FaArrowRight className="ml-2" />
          <div className="pl-2">{customProducts?.product_name}</div>
        </div>
        <div className="">
          <div className="md:grid md:grid-cols-2 bg-white p-4 gap-2 justify-between px-3">
            <div className=" md:w-43% md:ml-53px md:h-106px">
              <div className="mb-6">
                {customProducts?.image?.map((img: any, index: any) => {
                  if (!selectedIndex && index === 0) {
                    return (
                      <div
                        className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
                        id={`image-tab-${index}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${index}`}
                        key={`image-content-${index}`}
                        data-te-tab-active
                      >
                        <img
                          src={img?.url}
                          className={`object-cover object-cover md:w-[250] md:h-[180]  `}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <div className="md:w-287px md:h-200px md:ml-215px  ">
              <div className="mb-3">
                <h3 className="font-bold iklm ">{customProducts?.product_name}</h3>
              </div>
              <div className="space-y-3">
                <div className="mt-3">
                  <p className="text-red-700 text-2xl font-bold">
                    {formatCurrency(customProducts?.product_price)}
                    <span>₫</span>
                  </p>
                </div>
                <div className="col-span-2 flex  space-x-4 ">
                  <div className="font-bold text-[16px]">Loại:</div>
                  <div >{categoryLishOne}</div>
                </div>
                <div className="col-span-2  flex space-x-4 ">
                  <div className="font-bold text-[16px]">Màu:</div>
                  <div >{colorLishOne}</div>
                </div>
                <div className="col-span-2 flex  space-x-4 ">
                  <div className=" font-bold text-[16px]">Kích thước:</div>
                  <div>{sizeLishOne}</div>
                </div>
                <div className="col-span-2 flex  space-x-4 ">
                  <div className=" font-bold text-[16px]">Vật liệu:</div>
                  <div >{materialLishOne}</div>
                </div>
              </div>
              <div className="md:flex button">
                <div className="flex items-center mt-2">
                  {/* <input
                    className="btn4 btn-solid-primary4 w-[150px] h-[10px] btn-d mn"
                    aria-live="assertive"
                    aria-valuenow={1}
                    value={customProducts?.stock_quantity}
                    readOnly
                  /> */}
                  <button
                    aria-label="Decrease"
                    className="btn3s btn-solid-primary3s btn-cs"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <input
                    className="btn4s btn-solid-primary4 btn-ds mn1"
                    aria-live="assertive"
                    aria-valuenow={1}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        setQuantity(value);
                      } else {
                        setQuantity(null);
                      }
                    }}
                  />
                  <button
                    aria-label="Increase"
                    className="btn5s btn-solid-primary5s btn-es"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
                <div className=" pl-0 flex md:mt-0 items-center mt-2 ml-2">
                  {resultAdd.isLoading ? (
                    <AiOutlineLoading3Quarters className="animate-spin m-auto " />
                  ) : (
                    <Button
                      className=" ml-2 md:w-200px bg-blue-600 bg-red-600 border-0 text-white  text-m font-bold py-1  "
                      onClick={handleAddToCart}
                    >
                      MUA NGAY
                    </Button>
                  )}
                </div>
              </div>
              <hr className="my-4" />
              <div className="md:flex space-x-2 ">
                <div className=" flex items-center pl-2 ">
                  <img
                    className="w-5"
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/6c502a2641457578b0d5f5153b53dd5d.png"
                  />
                  <div className="mnQqkL">7 ngày miễn phí trả hàng</div>
                </div>
                <div className=" flex items-center ">
                  <img
                    className="w-5"
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/511aca04cc3ba9234ab0e4fcf20768a2.png"
                  />
                  <div className="mnQqkL">Hàng chính hãng 100%</div>
                </div>
                <div className="flex items-center">
                  <img
                    className="w-5"
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/511aca04cc3ba9234ab0e4fcf20768a2.png"
                  />
                  <div className="mnQqkL">Giao hàng cực nhanh</div>
                </div>
              </div>

            </div>

          </div>
          <div className="bg-white">
            <div className="flex justify-center ">
            </div>
            <div className="md:px-4">
              <section className=" bg-white md:py-3 md:px-5  antialiased">
                <div>
                  <div className="font-semibold pl-2 md:text-2xl mb-4">
                    Đánh giá sản phẩm
                  </div>
                </div>
                <hr className="" />
                <div className=" md:py-3 md:px-5">
                  {filteredComments && filteredComments?.length > 0 ? (
                    filteredComments?.map((comment: any) => (
                      <article
                        key={comment._id}
                        className="p-6 text-base rounded-lg "
                      >
                        <footer className="flex items-center footer1">
                          <div className="evaluate">
                            <div className="inline-flex items-center mr-3 text-xs text-gray-900 dark:text-white font-semibold">
                              {comment &&
                                comment?.userId?.avatar ? (
                                <img
                                  src={
                                    comment?.userId?.avatar
                                      ?.url
                                  }
                                  className="mr-2 w-8 h-8 rounded-full avatar"
                                />
                              ) : (
                                <img
                                  src="https://static.thenounproject.com/png/363640-200.png"
                                  className="mr-2 w-8 h-8 rounded-full avatar"
                                />
                              )}
                              <a className="cm-name">
                                {comment.userId?.first_name}{' '}
                                {comment.userId?.last_name}
                              </a>
                              <a className="cm-name1 font-normal ">
                                {formatTimeAgo(
                                  comment.createdAt,
                                )}
                              </a>
                            </div>
                          </div>
                        </footer>

                        <div className="stars ml-16 flex">
                          <div className="star-rating">
                            {comment.rating &&
                              Array.from(
                                { length: comment?.rating },
                                (_, index) => (
                                  <AiFillStar
                                    key={index}
                                    style={{
                                      color: 'orange',
                                    }}
                                  />
                                ),
                              )}
                          </div>
                        </div>

                        <p className="ml-16 text-gray-500 dark:text-gray-400">
                          {comment.description}
                        </p>
                        <div className="product-small">
                          {comment &&
                            comment?.image.map((img: any) => {
                              return (
                                <img
                                  key={img?.publicId}
                                  className="image5"
                                  src={img?.url}
                                />
                              );
                            })}
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="sp2 ">Không có bình luận</p>
                  )}
                  <Pagination
                    pageSize={PAGE_SIZE}
                    defaultCurrent={1}
                    total={commentProductDetail?.length}
                    onChange={(page, pageSize) => {
                      setPage(page);
                      if (false) {
                        console.log(pageSize);
                      }
                    }}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default CustomProductDetail
