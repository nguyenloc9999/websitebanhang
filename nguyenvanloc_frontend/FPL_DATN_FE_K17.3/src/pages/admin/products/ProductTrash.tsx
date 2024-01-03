import { useGetProductsDeleteQuery, useRemoveForceProductMutation, useRestoreProductMutation } from '@/api/productApi';
import { Table, Button } from 'antd';
import { FaTrashCan, FaWindowRestore } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useGetCategoryQuery } from '@/api/categoryApi';
import { useGetBrandQuery } from '@/api/brandApi';
import { useGetMaterialQuery } from '@/api/materialApi';
import Swal from 'sweetalert2';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IProduct } from '@/interfaces/product';
import { ICategory } from '@/interfaces/category';
import { IMaterials } from '@/interfaces/materials';
import { IBrand } from '@/interfaces/brand';
import { toast } from 'react-toastify';

const ProductTrash = () => {
    const { data }: any = useGetProductsDeleteQuery<IProduct[]>();
    const { data: categories } = useGetCategoryQuery<any>();
    const { data: brands } = useGetBrandQuery<any>();
    const { data: materials } = useGetMaterialQuery<any>();
    const [removeProduct, { isLoading: isRemoveLoading }] = useRemoveForceProductMutation();
    const [restoreProduct, { isLoading: isRestoreLoading }] = useRestoreProductMutation()
    const navigate = useNavigate();

    const products = data?.product;
    const category = categories?.category?.docs;
    const brand = brands?.brand;
    const material = materials?.material;
    const data1 = products?.map((product: any, index: number) => {
        return {
            key: product._id,
            STT: index + 1,
            name: product.product_name,
            price: product.product_price,
            category: product.categoryId,
            brand: product.brandId,
            materials: product.materialId,
            quantity: product.sold_quantity,
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

    const deleteProduct = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Khi xóa bạn không thể khôi phục lại',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });

            if (result.isConfirmed) {
                const data: any = await removeProduct(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy xoá sản phẩm');
            }
        } catch (error: any) {
            toast.error(error.message);
        }

    }
    const restoreProduct1 = async (id: string) => {
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
                const data: any = await restoreProduct(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy khôi phục sản phẩm');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (index: string) => <a>{index}</a>,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => <p className='text-red-700'>{formatCurrency(price)}₫</p>,
        },
        {
            title: 'Đã bán',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            render: (text: number) => <a>{text}</a>,
        },
        {
            title: 'Danh Mục',
            dataIndex: 'category',
            key: 'category',
            render: (record: string) => {
                const catename = category?.find((cate: ICategory) => cate._id === record);
                return catename?.category_name
                    ;
            }
        },
        {
            title: 'Vật liệu',
            dataIndex: 'materials',
            key: 'materials',
            width: 120,
            render: (record: string) => {
                const materialname = material?.find((materials: IMaterials) => materials._id === record);
                return materialname?.material_name;
            }
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'brand',
            key: 'brand',
            render: (record: string) => {
                const brandname = brand?.find((bra: IBrand) => bra._id === record);
                return brandname?.brand_name
                    ;
            }
        },
        {
            title: 'Chức năng',
            render: ({ key: _id }: any) => (
                <div style={{ width: '100px' }}>
                    <Button className='mr-1 text-red-500' onClick={() => deleteProduct(_id)}>
                        {isRemoveLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            <FaTrashCan />
                        )}
                    </Button>

                    <Button className='mr-1 text-blue-500' onClick={() => restoreProduct1(_id)} >
                        {isRestoreLoading ? (
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
            <h3 className="font-semibold">Danh sách sản phẩm đã xóa </h3>
            <div className="overflow-x-auto drop-shadow-xl rounded-lg">
                <Button className="h-10 bg-blue-500 text-xs text-white mt-2 mb-2" onClick={() => navigate("/admin/products")} htmlType="submit">
                    Danh sách sản phẩm
                </Button>
                <Table dataSource={data1} columns={columns} pagination={{ defaultPageSize: 6 }} rowKey="key" />
            </div>
        </div>
    )
}

export default ProductTrash