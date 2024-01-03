import { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { getDecodedAccessToken } from '@/decoder';
import { useGetCategoryQuery } from '@/api/categoryApi';
import { useGetMaterialQuery } from '@/api/materialApi';
import { useGetColorsQuery } from '@/api/colorApi';
import { useGetSizeQuery } from '@/api/sizeApi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAddCartMutation } from '@/api/cartApi';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ProductCustom = ({ products }: any) => {
    const decodedToken: any = getDecodedAccessToken();
    const idUser = decodedToken ? decodedToken.id : null;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: category }: any = useGetCategoryQuery();
    const categoryLish = category?.category.docs;
    const categoryLishOne = categoryLish?.find(
        (categoryLish: any) => categoryLish?._id === products?.categoryId,
    )?.category_name;
    const { data: material }: any = useGetMaterialQuery();
    const materialList = material?.material;
    const materialLishOne = materialList?.find(
        (materialList: any) => materialList?._id === products?.materialId,
    )?.material_name;

    const { data: color }: any = useGetColorsQuery();
    const colorList = color?.color;
    const colorLishOne = colorList?.find(
        (colorList: any) => colorList?._id === products?.colorId,
    )?.colors_name;

    const { data: size }: any = useGetSizeQuery();
    const sizeLish = size?.size;
    const sizeLishOne = sizeLish?.find(
        (sizeLish: any) => sizeLish?._id === products?.sizeId,
    )?.size_name;
    const [quantity, setQuantity] = useState<any>(1); // Sử dụng useState để quản lý số lượng
    useEffect(() => {
        if (products) {
            setQuantity(products?.stock_quantity)
        }
    }, [products])

    const [addCart, resultAdd] = useAddCartMutation();

    // ADD to cart custom-Product
    const handleAddToCart = async () => {
        try {
            if (products && idUser) {
                const sizeId = products.sizeId;
                const colorId = products.colorId;
                const materialId = products.materialId;
                const cartData: any = {
                    productId: products._id,
                    product_name: products.product_name,
                    product_price: products?.product_price,
                    image: products.image[0]?.url,
                    stock_quantity: quantity,
                    colorId: colorId,
                    sizeId: sizeId,
                    materialId: materialId,
                    formation: 'des'
                };
                const result = await Swal.fire({
                    title: 'Bạn chắc chứ?',
                    text: 'Sản phẩm sẽ được thêm vào giỏ hàng!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Vâng, tôi chắc chắn!',
                    cancelButtonText: 'Huỷ',
                });

                if (result.isConfirmed) {
                    // Thực hiện thêm vào giỏ hàng
                    const response: any = await addCart({
                        data: cartData,
                        userId: idUser,
                    }).unwrap();
                    console.log(response);

                    if (response) {
                        toast.success(response.message);
                        setIsModalOpen(false);
                    }

                    setIsModalOpen(false);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Hiển thị thông báo hủy thêm vào giỏ hàng
                    toast.info('Huỷ Sản phẩm không được thêm vào giỏ hàng ');
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

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const formatCurrency = (number: number) => {
        if (typeof number !== 'number') {
            // Xử lý khi number không phải là số
            return '0'; // Hoặc giá trị mặc định khác tùy vào yêu cầu của bạn
        }
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <>
            <Button onClick={showModal} className="button btn-cart rounded-none">
                Thêm hàng
            </Button>
            <Modal title="Mua ngay" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '50%' }}>
                        <img src={products?.image[0]?.url} width={300} alt="Product" />
                    </div>
                    <div style={{ width: '50%', marginLeft: '20px' }}>
                        <h6 className="font-bold">{products?.product_name}</h6>
                        <div className="text-red-700 text-sm font-bold">
                            {formatCurrency(products?.product_price)}
                            <span>₫</span>
                        </div>
                        <div className="text-[14px] mt-2">
                            <div className="flex space-x-4">
                                <div className="font-bold">Loại:</div>
                                <div>{categoryLishOne}</div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="font-bold">Màu:</div>
                                <div>{colorLishOne}</div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="font-bold">Kích thước:</div>
                                <div>{sizeLishOne}</div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="font-bold">Vật liệu:</div>
                                <div>{materialLishOne}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                            <button
                                aria-label="Decrease"
                                className="btn3s btn-solid-primary5s btn-4cs"
                                onClick={decreaseQuantity}
                            >
                                -
                            </button>
                            <input
                                className="btn4 btn-solid-primary4 w-[100px] h-[10px] btn-d mn"
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
                                className="btn5s btn-solid-primary5s btn-4cs"
                                onClick={increaseQuantity}
                            >
                                +
                            </button>
                        </div>
                        <div style={{ marginLeft: '33px', marginTop: '10px' }}>
                            {resultAdd.isLoading ? (
                                <AiOutlineLoading3Quarters className="animate-spin m-auto " />
                            ) : (
                                <Button
                                    className="ml-2 w-100px bg-blue-600 bg-red-600 border-0 text-white text-m font-bold py-1"
                                    onClick={handleAddToCart}
                                >
                                    Thêm ngay
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProductCustom;
