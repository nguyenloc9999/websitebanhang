import {
    useGetAllDeleteQuery,
    useRemoveForceCategoryMutation,
    useRestoreCategoryMutation,
} from '@/api/categoryApi';
import { ICategory } from '@/interfaces/category';
import { Table, Button } from 'antd';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaTrashCan, FaWindowRestore } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const CategoryTrash = () => {
    const { data }: any = useGetAllDeleteQuery();
    const categories = data?.category;
    const [removeCategory, { isLoading: isRemoveLoading }] = useRemoveForceCategoryMutation();
    const [restoreCategory, { isLoading: isRestoreLoading }] = useRestoreCategoryMutation();
    const navigate = useNavigate();

    const deleteCategory = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chứ?',
                text: 'Danh mục sẽ bị xoá và không thể khôi phục!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Vâng, tôi chắc chắn!',
                cancelButtonText: 'Huỷ',
            });

            if (result.isConfirmed) {
                const data: any = await removeCategory(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy xoá danh mục');
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };
    const restoreCategory1 = async (id: string) => {
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
                const data: any = await restoreCategory(id).unwrap();
                if (data) {
                    toast.success(`${data.message}`);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                toast.info('Hủy Khôi Phục Danh mục');
            }
        } catch (error: any) {
            toast.error(error.message);
        }

    };

    const data1 = categories?.map((category: ICategory) => {
        return {
            key: category._id,
            name: category.category_name,
            image: <img width={50} src={category.category_image?.url} alt="" />,
        };
    });

    const columns = [
        {
            title: 'Ảnh ',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: 'Danh Mục',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Chức năng',
            render: ({ key: _id }: { key: string }) => (
                <div>
                    <Button className="mr-1 text-red-500" onClick={() => deleteCategory(_id)}>
                        {isRemoveLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            <FaTrashCan />
                        )}
                    </Button>
                    <Button className="mr-1 text-blue-500" onClick={() => restoreCategory1(_id)}>
                        {isRestoreLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                            <FaWindowRestore />
                        )}
                    </Button>
                </div>
            ),
        },
    ];
    return (
        <div className="container">
            <h3 className="font-semibold">Danh sách danh mục đã bị xoá</h3>
            <Button className="h-10 bg-blue-500 text-xs text-white mt-2 mb-2" onClick={() => navigate("/admin/categories")} htmlType="submit">
                Danh sách danh mục
            </Button>
            <Table dataSource={data1} columns={columns} />
        </div>
    );
};

export default CategoryTrash;
